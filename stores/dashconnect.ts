/* stores/dashconnect.ts
 *
 * DashConnect (App Connect v2) login store. Builds the request v2 QR/link,
 * polls the App Connect system contract for wallet responses, verifies every
 * candidate against the chain, and turns a verified grant into an in-memory
 * key-ring session.
 *
 * SECRETS POLICY: private keys (the request's ephemeral key and granted
 * session keys) live in memory only — they are never written to localStorage,
 * sessionStorage or any other persistent store. A page reload ends the
 * session; the user logs in again with a wallet scan (or, later, a passkey).
 *
 * Spec: App Connect DIP dashpay/dips#181 + DIP-13 dashpay/dips#191
 * Reference: yappr vendor/platform-auth/src/app-connect/ + lib/app-connect/
 */

import { defineStore } from 'pinia'
import bs58 from 'bs58'
import {
    APP_CONNECT_SESSION_BUDGET,
    APP_CONNECT_SESSION_LIFETIME_MS,
    buildAppConnectUri,
    listAppConnectCandidates,
    appConnectCandidateKey,
    appConnectPollDelayMs,
    appConnectRequestHash,
    buildAppConnectSession,
    clearSensitiveBytes,
    generateEphemeralKeyPair,
    parseAppConnectCarriers,
    verifyAppConnectCandidate,
    type AppConnectCandidate,
    type AppConnectCarrier,
    type AppConnectGrant,
    type AppConnectRequest,
    type AppConnectSession,
    type AppConnectVerification,
} from '../libs/dashconnect/index'

import { useSystemStore } from '@/stores/system'
import { DASHSWAP_APP_ID as DASHSWAP_APP_ID_TESTNET, DASHSWAP_GROUP_ID as DASHSWAP_GROUP_ID_TESTNET } from '../libs/dashconnect/config'
import { useIdentityStore } from '@/stores/identity'

/**
 * Login flow states:
 *   idle        nothing in flight
 *   generating  building the request (spinner)
 *   waiting     QR/link shown, polling for the wallet's response
 *   verifying   a candidate is being checked against the chain
 *   confirm     a grant verified; the app asks "Continue as @name?"
 *               (no IDENTITY_HINT was sent, so anyone may have answered)
 *   complete    the session is live
 *   error       terminal for this attempt (timeout, truncated, refused)
 */
export type DashConnectStatus =
    | 'idle'
    | 'generating'
    | 'waiting'
    | 'verifying'
    | 'confirm'
    | 'complete'
    | 'error'

export interface DashConnectCarrierUri {
    carrier: AppConnectCarrier
    uri: string
}

interface DashConnectConfig {
    appId: string
    groupId: string
    label: string
    callbackUrl: string
    carrierSetting: string
}

/* In-memory key store: handles → private keys. Never persisted. */
const keyStore = new Map<string, Uint8Array>()

/* Poll-loop cancellation. */
let pollAbort: AbortController | null = null

/** Terminal poll-loop outcomes; a function boundary keeps TS from narrowing the state mid-loop. */
const isSettled = (status: DashConnectStatus): boolean => status === 'confirm' || status === 'complete'

const sleep = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort)
        resolve()
    }, ms)
    const onAbort = () => {
        clearTimeout(timeout)
        signal?.removeEventListener('abort', onAbort)
        reject(new Error('Cancelled'))
    }
    signal?.addEventListener('abort', onAbort)
})

const hex = (bytes: Uint8Array): string =>
    [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')

const unhex = (text: string): Uint8Array =>
    Uint8Array.from((text.match(/.{2}/g) ?? []).map((byte) => parseInt(byte, 16)))

/**
 * DashConnect Store
 */
export const useDashConnectStore = defineStore('dashconnect', {
    state: () => ({
        /* Login flow. */
        _status: 'idle' as DashConnectStatus,
        _error: null as string | null,

        /* Build configuration, captured in init() while the Nuxt context is live. */
        _config: null as DashConnectConfig | null,

        /* The request in flight (memory only; the ephemeral key never persists). */
        _request: null as AppConnectRequest | null,
        _ephemeralPrivateKey: null as Uint8Array | null,
        _uris: null as DashConnectCarrierUri[] | null,
        _startedAt: 0,
        _seenCandidates: new Set<string>(),

        /* A verified grant parked for the user's "Continue as" confirmation. */
        _pendingGrant: null as AppConnectGrant | null,

        /* The verified session (key ring). */
        _session: null as AppConnectSession | null,

        /**
         * Connection ID
         *
         * Hex, 16 random bytes per (install, network). Persisted — it is not a
         * secret; it lets the wallet supersede the previous grant on re-login.
         */
        _connectionId: null as string | null,
    }),

    getters: {
        status(_state) {
            return _state._status
        },

        error(_state) {
            return _state._error
        },

        uris(_state) {
            return _state._uris
        },

        request(_state) {
            return _state._request
        },

        session(_state) {
            return _state._session
        },

        isAuthenticated(_state) {
            return _state._session !== null
        },

        /** The parked grant's identity, shown by the "Continue as" prompt. */
        pendingIdentityId(_state) {
            return _state._pendingGrant?.identityId ?? null
        },

        /**
         * Whether a login attempt can start: build configuration captured and
         * the anchor contract (appId) present for this network.
         */
        configured(_state) {
            return !!(_state._config && _state._config.appId)
        },
    },

    actions: {
        /**
         * Initialize
         *
         * Captures build configuration and loads (or generates) this install's
         * CONNECTION_ID per network. Call once per app boot.
         */
        init() {
            /* Defensive: a runtime-config failure must never break the boot
             * sequence (the layout continues with Identity.init()). */
            try {
                const runtimeConfig = useRuntimeConfig()
                /* Network-aware: the anchor is testnet-only for now; mainnet
                 * deploys its own anchor later. runtimeConfig can still
                 * override explicitly. */
                const System = useSystemStore()
                const network = System.network === 'mainnet' ? 'mainnet' : 'testnet'
                this._config = {
                    appId: (runtimeConfig.public.appConnectAppId as string) || (network === 'mainnet' ? '' : DASHSWAP_APP_ID_TESTNET),
                    groupId: (runtimeConfig.public.appConnectGroupId as string) || (network === 'mainnet' ? '' : DASHSWAP_GROUP_ID_TESTNET),
                    label: (runtimeConfig.public.appConnectLabel as string) || 'DashSwap',
                    callbackUrl: (runtimeConfig.public.appConnectCallback as string) || '',
                    carrierSetting: (runtimeConfig.public.appConnectCarrier as string) || 'both',
                }
            } catch (err) {
                console.error('DashConnect: runtime config unavailable', err)
                this._config = null
            }

            const System = useSystemStore()
            const network = System.network === 'mainnet' ? 'mainnet' : 'testnet'
            const storageKey = `dashswap_dc_connid_${network}`

            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem(storageKey)
                if (saved && /^[0-9a-f]{32}$/.test(saved)) {
                    this._connectionId = saved
                }
            }

            if (!this._connectionId) {
                this._connectionId = hex(crypto.getRandomValues(new Uint8Array(16)))
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(storageKey, this._connectionId)
                }
            }
        },

        /**
         * Start Login
         *
         * Builds the App Connect request v2 and the carrier URIs, then begins
         * polling for the wallet's response.
         */
        startLogin() {
            /* Validate any in-flight attempt first. */
            this.cancel()

            const config = this._config
            if (!config || !config.appId) {
                this._status = 'error'
                this._error = 'DashConnect is not configured yet: the DashSwap anchor contract (appId) is not deployed.'
                return
            }

            const System = useSystemStore()
            const network = System.network === 'mainnet' ? 'mainnet' : 'testnet'

            this._status = 'generating'
            this._error = null
            this._seenCandidates = new Set()
            this._startedAt = Date.now()

            try {
                /* Fresh ephemeral keypair per request; memory only. */
                const ephemeral = generateEphemeralKeyPair()
                this._ephemeralPrivateKey = ephemeral.privateKey

                const appIdBytes = bs58.decode(config.appId)
                const connectionIdBytes = unhex(this._connectionId ?? '')

                /* Primary binding: a CRITICAL contractGroup key when the anchor's
                 * group is configured, else a HIGH singleContract key. */
                const authBindings = config.groupId
                    ? [{
                        kind: 'contractGroup' as const,
                        id: bs58.decode(config.groupId),
                        securityLevel: 1, // CRITICAL
                        totalBudget: 50_000_000_000n, // 0.5 DASH
                        expiresAt: Date.now() + (90 * 24 * 60 * 60_000),
                    }]
                    : [{
                        kind: 'singleContract' as const,
                        id: appIdBytes,
                        securityLevel: 2, // HIGH
                        totalBudget: APP_CONNECT_SESSION_BUDGET,
                        expiresAt: Date.now() + APP_CONNECT_SESSION_LIFETIME_MS,
                    }]

                const request: AppConnectRequest = {
                    appEphemeralPubKey: ephemeral.publicKey,
                    appId: appIdBytes,
                    label: config.label,
                    authBindings,
                    encBindings: [{
                        contractId: appIdBytes,
                        purpose: 1, // ENCRYPTION (the anchor opts in via requiresIdentityEncryptionBoundedKey)
                    }],
                    createdAt: Date.now(),
                    connectionId: connectionIdBytes.length === 16 ? connectionIdBytes : undefined,
                }
                this._request = request

                /* One request, every configured carrier's URI. */
                const carriers = parseAppConnectCarriers(config.carrierSetting, network)
                this._uris = carriers.map((carrier) => ({
                    carrier,
                    uri: buildAppConnectUri(request, network, config.callbackUrl || undefined, carrier),
                }))

                this._status = 'waiting'
                this._pollLoop(network)
            } catch (err) {
                this._status = 'error'
                this._error = err instanceof Error ? err.message : String(err)
                this._wipeRequest()
            }
        },

        /**
         * Poll Loop
         *
         * Every 2 s for the first minute, then every 4 s; gives up after 10
         * minutes or 20 candidates. Each unseen candidate is verified against
         * the chain; a verified grant moves to `confirm` (or straight to
         * `complete` when the request carried an IDENTITY_HINT).
         */
        async _pollLoop(network: 'mainnet' | 'testnet') {
            const { createAppConnectPlatformPort } = await import('../libs/dashconnect/platform-port')
            const port = createAppConnectPlatformPort(() => network)
            pollAbort = new AbortController()

            try {
                for (;;) {
                    const elapsed = Date.now() - this._startedAt
                    const delay = appConnectPollDelayMs(elapsed)
                    if (delay === null) {
                        this._status = 'error'
                        this._error = 'No wallet response within 10 minutes. Start again to generate a new request.'
                        this._wipeRequest()
                        return
                    }
                    await sleep(delay, pollAbort.signal)

                    if (!this._request || !this._ephemeralPrivateKey) return

                    const requestHash = appConnectRequestHash(this._request)
                    const hint = this._request.identityHint ? bs58.encode(this._request.identityHint) : undefined
                    const { candidates, truncated } = await listAppConnectCandidates(port, requestHash, { hint })

                    if (truncated) {
                        this._status = 'error'
                        this._error = 'Too many responses for this request. Start again.'
                        this._wipeRequest()
                        return
                    }

                    this._status = 'verifying'
                    for (const candidate of candidates) {
                        await this._considerCandidate(port, candidate)
                        if (isSettled(this._status)) return
                    }
                    if (this._status === 'verifying') this._status = 'waiting'
                }
            } catch (err) {
                if (this._status !== 'complete' && this._status !== 'confirm') {
                    /* Cancelled by the user, or a poll failure. */
                    if (!(err instanceof Error && err.message === 'Cancelled')) {
                        this._status = 'error'
                        this._error = err instanceof Error ? err.message : String(err)
                        this._wipeRequest()
                    }
                }
            } finally {
                pollAbort = null
            }
        },

        /**
         * Consider Candidate
         *
         * Verifies one response. Retryable rejections (a lagging read) are
         * re-checked on the next poll; anything else is skipped forever via
         * the seen-set, keyed on the candidate's exact contents.
         */
        async _considerCandidate(
            port: import('../libs/dashconnect/platform-port').AppConnectPlatformPort,
            candidate: AppConnectCandidate,
        ) {
            if (!this._request || !this._ephemeralPrivateKey) return

            const candidateKey = appConnectCandidateKey(candidate)
            let verification: AppConnectVerification
            try {
                verification = await verifyAppConnectCandidate({
                    request: this._request,
                    appEphemeralPrivateKey: this._ephemeralPrivateKey,
                    candidate,
                    identity: port,
                    now: Date.now(),
                })
            } catch (err) {
                console.error('DashConnect: candidate verification crashed', err)
                this._seenCandidates.add(candidateKey)
                return
            }

            if (verification.ok) {
                this._onGrantVerified(verification.grant)
                return
            }

            if (verification.retryable) {
                /* The identity read may lag the wallet's update: retry shortly. */
                this._seenCandidates.delete(candidateKey)
                return
            }

            this._seenCandidates.add(candidateKey)
        },

        /**
         * On Grant Verified
         *
         * With an IDENTITY_HINT the login completes; without one the app must
         * ask "Continue as @name?" — the grant parks in `_pendingGrant` until
         * the user confirms.
         */
        _onGrantVerified(grant: AppConnectGrant) {
            const hint = this._request?.identityHint ? bs58.encode(this._request.identityHint) : undefined

            if (!hint) {
                this._pendingGrant = grant
                this._status = 'confirm'
                return
            }

            this._completeLogin(grant)
        },

        /**
         * Build Session
         *
         * Turns a verified grant into a session; private keys move into the
         * in-memory key store and are wiped from the grant by the builder.
         */
        _buildSession(grant: AppConnectGrant, network: 'mainnet' | 'testnet'): AppConnectSession {
            const config = this._config
            return buildAppConnectSession(grant, {
                network,
                appId: bs58.encode(this._request?.appId ?? new Uint8Array(32)),
                groupId: config?.groupId ?? '',
                connectionId: this._connectionId ?? '',
                grantedAt: Date.now(),
                keyRef: (privateKey, keyId) => {
                    const handle = `${grant.identityId}:${keyId}`
                    keyStore.set(handle, privateKey)
                    return handle
                },
            })
        },

        /** Point the Identity store at the authenticated identity. */
        async _activateIdentity(identityId: string) {
            const Identity = useIdentityStore()
            Identity.setIdentity(identityId)
            await Identity.init().catch((err) => console.error('DashConnect: identity init failed', err))
        },

        /**
         * Confirm Identity
         *
         * The user accepted the "Continue as @name?" prompt (no hint case).
         */
        async confirmIdentity() {
            const parked = this._pendingGrant
            if (!parked) return
            this._pendingGrant = null

            const System = useSystemStore()
            const network = System.network === 'mainnet' ? 'mainnet' : 'testnet'
            this._session = this._buildSession(parked, network)
            this._status = 'complete'

            await this._activateIdentity(this._session.identityId)
        },

        /** The user declined the "Continue as @name?" prompt. */
        declineIdentity() {
            this._pendingGrant = null
            this._status = 'error'
            this._error = 'Declined. Start again to generate a new request.'
            this._wipeRequest()
        },

        /** Completes the login for a hinted request. */
        async _completeLogin(grant: AppConnectGrant) {
            const System = useSystemStore()
            const network = System.network === 'mainnet' ? 'mainnet' : 'testnet'
            this._session = this._buildSession(grant, network)
            this._status = 'complete'

            await this._activateIdentity(this._session.identityId)
        },

        /**
         * Cancel
         *
         * Stops the poll loop and wipes the in-flight request's ephemeral key.
         */
        cancel() {
            pollAbort?.abort()
            pollAbort = null
            this._wipeRequest()
            this._pendingGrant = null
            if (this._status !== 'complete') this._status = 'idle'
            this._error = null
        },

        /**
         * Logout
         *
         * Wipes the session and every key it referenced. The CONNECTION_ID
         * persists on purpose: the next login supersedes the old grant.
         */
        logout() {
            pollAbort?.abort()
            pollAbort = null
            if (this._session) {
                for (const key of [...this._session.authKeys, ...this._session.encKeys]) {
                    keyStore.delete(key.keyRef)
                }
            }
            this._session = null
            this._pendingGrant = null
            this._wipeRequest()
            this._status = 'idle'
        },

        /** Retrieve a session private key by its handle (memory only). */
        getKey(keyRef: string): Uint8Array | null {
            return keyStore.get(keyRef) ?? null
        },

        /* Internal: clear the in-flight request and its secrets. */
        _wipeRequest() {
            if (this._ephemeralPrivateKey) {
                clearSensitiveBytes(this._ephemeralPrivateKey)
            }
            this._ephemeralPrivateKey = null
            this._request = null
            this._uris = null
            this._seenCandidates = new Set()
        },
    },
})
