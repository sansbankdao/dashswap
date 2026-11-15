/* libs/dashconnect/api-auth.ts
 *
 * Phase-2 API authentication per dashswap-api's APP-CONNECT-AUTH-SPEC.md:
 * session keys registered on the user's identity sign the canonical
 * string and travel in X-DashSwap-* headers — replacing the Phase-1 dev
 * key. This module is READY for the moment the Worker ships verification;
 * the call sites in libs/swap-api/client.js stay identical (headers are
 * added there).
 *
 * Canonical string (spec lines 44-56):
 *   dashswap-api:v1 \n METHOD \n PATH \n QUERY \n BODY_SHA \n TIMESTAMP \n NONCE
 * QUERY    = sorted "k=v" joined by "&"; empty when none
 * BODY_SHA = lowercase hex sha256(raw body); empty when no body
 * Signed message = sha256d(canonical) (Dash's double-SHA-256 signing
 * convention); ECDSA recoverable, 65 bytes, @noble compact encoding.
 */

import { sha256 } from '@noble/hashes/sha2.js'
import { hmac } from '@noble/hashes/hmac.js'
import { bytesToHex } from '@noble/hashes/utils.js'
import secp256k1 from '@noble/secp256k1'

import { hash256 } from './primitives'

/* noble 3.x: wire the SYNC hash bindings (browsers otherwise get the
 * WebCrypto async pair, which the sync sign() path cannot use). */
let hashesWired = false

function wireHashes(): void {
    if (hashesWired) return

    const module = secp256k1 as unknown as {
        hashes?: {
            hmacSha256?: ((key: Uint8Array, msg: Uint8Array) => Uint8Array) | undefined
            sha256?: ((msg: Uint8Array) => Uint8Array) | undefined
        }
    }

    if (module.hashes) {
        module.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg)
        module.hashes.sha256 = (msg) => sha256(msg)
    }

    hashesWired = true
}

/** Sort + join the query parameters exactly as the spec requires. */
export function canonicalQuery(params: Record<string, string>): string {
    return Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&')
}

/** The canonical string to sign for one API request. */
export function buildCanonical(
    method: string,
    path: string,
    query: string,
    bodyShaHex: string,
    timestamp: number,
    nonceHex: string,
): string {
    return [
        'dashswap-api:v1',
        method.toUpperCase(),
        path,
        query,
        bodyShaHex,
        String(timestamp),
        nonceHex,
    ].join('\n')
}

export interface DashSwapAuthHeaders {
    'X-DashSwap-Identity': string
    'X-DashSwap-KeyId': string
    'X-DashSwap-Timestamp': string
    'X-DashSwap-Nonce': string
    'X-DashSwap-Signature': string
}

/** Sign one API request with a session key (identity-scoped, contractGroup
 * CRITICAL binding). Returns the X-DashSwap-* headers per the spec. */
export function signApiRequest(options: {
    identityId: string
    keyId: number
    privateKey: Uint8Array
    method: string
    path: string
    query?: Record<string, string>
    body?: Uint8Array | string
}): DashSwapAuthHeaders {
    wireHashes()

    const timestamp = Math.floor(Date.now() / 1000)
    const nonce = crypto.getRandomValues(new Uint8Array(16))
    const nonceHex = bytesToHex(nonce)

    let bodyShaHex = ''
    if (options.body !== undefined) {
        const raw = typeof options.body === 'string'
            ? new TextEncoder().encode(options.body)
            : options.body
        bodyShaHex = bytesToHex(sha256(raw))
    }

    const query = canonicalQuery(options.query ?? {})
    const canonical = buildCanonical(options.method, options.path, query, bodyShaHex, timestamp, nonceHex)

    /* sha256d over the canonical bytes; recoverable ECDSA (65 bytes, noble
     * compact) — prehash: false because the message IS the hash. */
    const message = hash256(new TextEncoder().encode(canonical))
    const signature = secp256k1.sign(message, options.privateKey, {
        format: 'recovered',
        prehash: false,
    })

    return {
        'X-DashSwap-Identity': options.identityId,
        'X-DashSwap-KeyId': String(options.keyId),
        'X-DashSwap-Timestamp': String(timestamp),
        'X-DashSwap-Nonce': nonceHex,
        'X-DashSwap-Signature': bytesToHex(signature as Uint8Array),
    }
}
