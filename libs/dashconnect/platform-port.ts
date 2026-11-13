/* libs/dashconnect/platform-port.ts
 *
 * DashConnect's chain reads over the evo-sdk. Every method is a proved read
 * (the SDK's default facade methods verify proofs), and identity reads go to
 * the network directly, bypassing any identity cache: a key added moments ago
 * is exactly what the verifier checks.
 *
 * Ported from: yappr lib/app-connect/platform-port.ts (+ sdk-helpers subset)
 */

import bs58 from 'bs58'
import type { EvoSDK } from '@dashevo/evo-sdk'
import type { DocumentWhereClause } from '@dashevo/wasm-sdk'
import {
    APP_CONNECT_RESPONSE_CONTRACT_ID,
    APP_CONNECT_RESPONSE_DOCUMENT_TYPE,
} from './config'
import { toAppConnectIdentityKeys, type WasmIdentityKeyLike } from './key-mapping'
import { bytesToBase64, requireBytes } from './bytes'
import type { AppConnectCandidate, AppConnectResponsePort } from './poller'
import type {
    AppConnectGroupInfo,
    AppConnectGroupMember,
    AppConnectIdentityKey,
    AppConnectIdentityPort,
} from './types'

type GroupMemberKind = 'contracts' | 'documentTypes' | 'tokens'
const MEMBER_PAGE = 100

/** Block time and protocol version from the latest proved response. */
export interface AppConnectChainStatus {
    protocolVersion: number
    blockTimeMs: number
}

export interface AppConnectPlatformPort extends AppConnectIdentityPort, AppConnectResponsePort {
    chainStatus(): Promise<AppConnectChainStatus>
}

/* SDK connection management (DashSwap-local; mirrors yappr's evo-sdk-service). */
let cachedSdk: EvoSDK | null = null
let cachedNetwork: string | null = null

export async function getEvoSdk(network: AppConnectNetworkNameLike): Promise<EvoSDK> {
    if (cachedSdk && cachedNetwork === network) return cachedSdk
    const { EvoSDK } = await import('@dashevo/evo-sdk')
    const sdk = network === 'mainnet' ? EvoSDK.mainnetTrusted() : EvoSDK.testnetTrusted()
    await sdk.connect()
    cachedSdk = sdk
    cachedNetwork = network
    return sdk
}

type AppConnectNetworkNameLike = 'mainnet' | 'testnet' | 'devnet'

/** Normalize any identifier-like value to a base58 string. */
function identifierToBase58(value: unknown): string | null {
    if (!value) return null
    if (typeof value === 'string') {
        try {
            const decoded = bs58.decode(value)
            return bs58.encode(decoded)
        } catch {
            if (value.length === 44) {
                // SDK v3 returns base64 for byte-array fields.
                try {
                    return bs58.encode(Buffer.from(value, 'base64'))
                } catch {
                    return null
                }
            }
            return null
        }
    }
    return null
}

/**
 * Convert a queried document to a plain object. `toJSON()` surfaces system
 * fields ($id, $ownerId) as base58 strings and byteArray fields as base64.
 */
function documentToPlainObject(document: unknown): Record<string, unknown> {
    const plain = (document as { toJSON?: () => unknown }).toJSON?.() ?? document
    return plain as Record<string, unknown>
}

async function groupMembers(sdk: EvoSDK, groupId: string): Promise<AppConnectGroupMember[]> {
    const members: AppConnectGroupMember[] = []
    for (const kind of ['contracts', 'documentTypes', 'tokens'] as GroupMemberKind[]) {
        let startAfter: { contractId: string; documentTypeName?: string; tokenPosition?: number } | undefined
        for (;;) {
            const page = await sdk.contractGroups.members({ contractGroupId: groupId, kind, limit: MEMBER_PAGE, ...(startAfter ? { startAfter } : {}) })
            for (const contractId of page.contracts ?? []) members.push({ kind: 'contract', contractId })
            for (const entry of page.documentTypes ?? []) {
                members.push({ kind: 'documentType', contractId: entry.contractId, documentTypeName: entry.documentTypeName })
            }
            for (const entry of page.tokens ?? []) members.push({ kind: 'token', contractId: entry.contractId, position: entry.tokenPosition })
            if (!page.nextStartAfter) break
            startAfter = page.nextStartAfter
        }
    }
    return members
}

export function createAppConnectPlatformPort(resolveNetwork: () => AppConnectNetworkNameLike): AppConnectPlatformPort {
    return {
        async getIdentityFresh(identityId) {
            const sdk = await getEvoSdk(resolveNetwork())
            const identity = await sdk.identities.fetch(identityId)
            if (!identity) return null
            return {
                id: identity.id.toBase58(),
                publicKeys: toAppConnectIdentityKeys(identity.publicKeys as unknown as WasmIdentityKeyLike[]),
            }
        },

        async remainingBudgets(identityId, keyIds) {
            const sdk = await getEvoSdk(resolveNetwork())
            const budgets = await sdk.identities.keysRemainingBudgets(identityId, keyIds)
            const result = new Map<number, bigint | undefined>()
            for (const [keyId, remaining] of budgets) result.set(Number(keyId), remaining ?? undefined)
            return result
        },

        async contractKeys(identityId, contractId, purpose): Promise<AppConnectIdentityKey[]> {
            const sdk = await getEvoSdk(resolveNetwork())
            const entries = await sdk.identities.contractKeys({ identityIds: [identityId], contractId, purposes: [purpose] })
            const entry = entries.find((candidate) => candidate.identityId.toBase58() === identityId)
            return entry ? toAppConnectIdentityKeys(entry.keys as unknown as WasmIdentityKeyLike[]) : []
        },

        async groupInfo(groupId): Promise<AppConnectGroupInfo | null> {
            const sdk = await getEvoSdk(resolveNetwork())
            const info = await sdk.contractGroups.info(groupId)
            if (!info) return null
            return { ownerId: info.ownerId, adminIds: [...info.adminIds], members: await groupMembers(sdk, groupId) }
        },

        async listCandidates(requestHash, hint, startAfter, limit): Promise<AppConnectCandidate[]> {
            const sdk = await getEvoSdk(resolveNetwork())
            // indexOnly: entries are keyed (appEphemeralPubKeyHash, $ownerId) and the
            // synthesized $id is no cursor, so pages continue after the last owner.
            const where: DocumentWhereClause[] = [['appEphemeralPubKeyHash', '==', bytesToBase64(requestHash)]]
            if (hint) where.push(['$ownerId', '==', hint])
            else if (startAfter) where.push(['$ownerId', '>', startAfter])
            const response = await sdk.documents.query({
                dataContractId: APP_CONNECT_RESPONSE_CONTRACT_ID,
                documentTypeName: APP_CONNECT_RESPONSE_DOCUMENT_TYPE,
                where,
                orderBy: [['$ownerId', 'asc']],
                limit,
            })
            const candidates: AppConnectCandidate[] = []
            for (const document of response.values()) {
                if (!document) continue
                const plain = documentToPlainObject(document)
                const ownerId = identifierToBase58(plain.$ownerId)
                if (typeof ownerId !== 'string') continue
                try {
                    candidates.push({
                        ownerId,
                        walletEphemeralPubKey: requireBytes(plain.walletEphemeralPubKey, 'walletEphemeralPubKey'),
                        encryptedPayload: requireBytes(plain.encryptedPayload, 'encryptedPayload'),
                    })
                } catch {
                    // A malformed entry is just not a candidate.
                }
            }
            // The poller relies on owner order; Platform returns it, but a Map's order is the SDK's.
            return candidates.sort((a, b) => compareIds(a.ownerId, b.ownerId))
        },

        async chainStatus() {
            const sdk = await getEvoSdk(resolveNetwork())
            const { metadata } = await sdk.protocol.versionUpgradeStateWithProof()
            if (!metadata) throw new Error('chain status unavailable: no proved response metadata')
            return { protocolVersion: metadata.protocolVersion, blockTimeMs: Number(metadata.timeMs) }
        },
    }
}

function compareIds(a: string, b: string): number {
    const left = bs58.decode(a)
    const right = bs58.decode(b)
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
        if (left[i]! !== right[i]!) return left[i]! - right[i]!
    }
    return left.length - right.length
}
