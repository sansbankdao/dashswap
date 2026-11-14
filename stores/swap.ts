/* stores/swap.ts
 *
 * InstaSwap store — talks to the dashswap-api Worker (FRONTEND-HANDOFF.md).
 *
 * Identity binding: swaps belong to the DashConnect session's identity
 * (`platformid`). A wallet connection is REQUIRED to create a swap — the API
 * is not reachable without a dev key and the swap record is identity-bound.
 *
 * Auth: Phase 1 uses a dev key (runtimeConfig or localStorage override).
 * Phase 2 (APP-CONNECT-AUTH-SPEC.md) replaces the key with X-DashSwap-*
 * signature headers produced from the session key ring — the call sites in
 * this store stay identical.
 */

import { defineStore } from 'pinia'
import {
    createSwap,
    listSwaps,
    fetchSwap,
    SwapApiError,
} from '../libs/swap-api/client.js'

import { useDashConnectStore } from '@/stores/dashconnect'
import { useSystemStore } from '@/stores/system'

/** Bootstrap allowlist (server-enforced; mirrored for the UI).
 * Naming per FRONTEND-HANDOFF-2 §4: mainnet displays SANS / DUSD
 * (the testnet tSANS/tDUSD prefixes are gone). */
export const SWAP_PAIRS = [
    { direction: 'DASH->SANS', from: 'DASH', to: 'SANS', label: 'Dash → SANS' },
    { direction: 'DASH->DUSD', from: 'DASH', to: 'DUSD', label: 'Dash → DUSD' },
] as const

/** The engine phase the API currently settles on. ONE Worker serves ONE
 * network (FRONTEND-HANDOFF-2 §0: mainnet live); production base
 * dashswap.xyz/v1 IS mainnet today.
 * TODO: read from the API once the phase is exposed publicly (a field on
 * the create response or a public endpoint) instead of this constant. */
export const SWAP_PHASE = 'MAINNET' as const

/** Destination display decimals (FRONTEND-HANDOFF-2 §1: /10^8 SANS,
 * /10^6 DUSD). */
export const TOKEN_DECIMALS = { SANS: 8, DUSD: 6 } as const

/** Platform fee: 30 bps OF THE BASE (DASH), taken before pricing
 * (FRONTEND-HANDOFF-2 §1 — do not re-derive the payout math; the API's
 * expected_out/amount_out already carry it. This is for the FEE LINE
 * display only). */
export const FEE_BPS = 30

export const feeDuffs = (amountInDuffs: number): number =>
    Math.floor((amountInDuffs * FEE_BPS) / 10_000)

/** The bootstrap promo ladder, mirrored from FRONTEND-HANDOFF-2 §1 (SANS
 * in DASH terms, doubles weekly). The API exposes NO public rate endpoint
 * yet — a swap quote is the only live source — so this mirror feeds the
 * season display until one ships.
 * TODO: drop once a public quote/rate endpoint exists (§7). */
export const PROMO_LADDER = [0.0004, 0.0008, 0.0016, 0.0032, 0.0064, 0.0128, 0.0256, 0.0512] as const

/** DASH per 1 destination token, from the API's base-per-duff rate. */
export const dashPerToken = (rate: number): number => (rate > 0 ? 1 / rate : 0)

/** Season index from a base-per-duff SANS rate (exact ladder match;
 * 0 = no match). */
export const seasonFromRate = (rate: number): number => {
    const dashPer = dashPerToken(rate)
    const idx = PROMO_LADDER.findIndex((entry) => Math.abs(entry - dashPer) < entry * 1e-9)
    return idx + 1
}

/** Format destination base units for display (FRONTEND-HANDOFF-2 §1). */
export const formatTokenUnits = (symbol: string, baseUnits: number | string | null | undefined): string => {
    const value = typeof baseUnits === 'string' ? Number(baseUnits) : baseUnits
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    const decimals = TOKEN_DECIMALS[symbol as keyof typeof TOKEN_DECIMALS] ?? 8
    return `${(Number(value) / 10 ** decimals).toLocaleString('en-US', { maximumFractionDigits: decimals })} ${symbol}`
}

/** Terminal statuses — polling stops here (FRONTEND-HANDOFF §5). */
const TERMINAL_STATUSES = ['settled', 'failed', 'refunded'] as const

const isTerminal = (status: string): boolean =>
    TERMINAL_STATUSES.includes(status as (typeof TERMINAL_STATUSES)[number])

const networkStorageKey = (System: ReturnType<typeof useSystemStore>, name: string): string =>
    `${name}_${System.network === 'mainnet' ? 'mainnet' : 'testnet'}`

/**
 * Swap Store
 */
export const useSwapStore = defineStore('swap', {
    state: () => ({
        /* Build configuration, captured in init(). */
        _base: 'https://dashswap.xyz/v1' as string,
        _apiKey: '' as string,

        /* Form. */
        _direction: 'DASH->SANS' as 'DASH->SANS' | 'DASH->DUSD',
        _amount: '' as string,
        _customDest: '' as string,
        _sendToSelf: true as boolean,

        /* Records. */
        _swaps: [] as Array<Record<string, any>>,
        _activeSwapId: null as string | null,
        _activeSwap: null as Record<string, any> | null,

        /* Flow. */
        _creating: false,
        _loading: false,
        _error: null as string | null,

        /* Polling (10 s per FRONTEND-HANDOFF §5). */
        _pollTimer: null as ReturnType<typeof setInterval> | null,
    }),

    getters: {
        base(_state) {
            return _state._base
        },

        pairs() {
            return SWAP_PAIRS
        },

        direction(_state) {
            return _state._direction
        },

        amount(_state) {
            return _state._amount
        },

        swaps(_state) {
            return _state._swaps
        },

        activeSwap(_state) {
            return _state._activeSwap
        },

        creating(_state) {
            return _state._creating
        },

        error(_state) {
            return _state._error
        },

        /** The caller identity: the DashConnect session identity. */
        platformid() {
            const DashConnect = useDashConnectStore()
            return DashConnect.session?.identityId ?? null
        },

        hasApiKey(_state) {
            return _state._apiKey !== ''
        },

        /** A create is possible: identity bound + (amount or open swap). */
        canCreate(): boolean {
            return this.platformid !== null
                && (this._amount !== '' || true) // open swaps allowed when amount omitted
        },
    },

    actions: {
        /**
         * Initialize
         *
         * Captures the API base + dev key (runtimeConfig first, then a
         * localStorage override) and restores the caller's swap ids.
         */
        init() {
            try {
                const runtimeConfig = useRuntimeConfig()
                this._base = (runtimeConfig.public.swapApiBase as string) || this._base
                this._apiKey = (runtimeConfig.public.swapApiKey as string) || ''
            } catch (err) {
                console.error('Swap: runtime config unavailable', err)
            }

            const System = useSystemStore()
            if (typeof localStorage !== 'undefined') {
                const savedKey = localStorage.getItem(networkStorageKey(System, 'dashswap_swap_apikey'))
                if (savedKey) this._apiKey = savedKey
            }
        },

        /** Runtime dev-key override (Phase 1; Phase 2 removes this surface). */
        setApiKey(key: string) {
            this._apiKey = key
            const System = useSystemStore()
            if (typeof localStorage !== 'undefined') {
                if (key) localStorage.setItem(networkStorageKey(System, 'dashswap_swap_apikey'), key)
                else localStorage.removeItem(networkStorageKey(System, 'dashswap_swap_apikey'))
            }
        },

        setDirection(direction: 'DASH->SANS' | 'DASH->DUSD') {
            this._direction = direction
        },

        setAmount(amount: string) {
            this._amount = amount
        },

        setCustomDest(dest: string) {
            this._customDest = dest
        },

        setSendToSelf(sendToSelf: boolean) {
            this._sendToSelf = sendToSelf
        },

        /**
         * Load Swaps
         *
         * Lists the caller's swaps (platformid filter — required for dev keys).
         */
        async loadSwaps() {
            const platformid = this.platformid
            if (!platformid || !this._apiKey) return

            this._loading = true
            try {
                this._swaps = await listSwaps({
                    base: this._base,
                    apiKey: this._apiKey,
                    page: 0,
                    platformid,
                })

                /* Restore the tracked selection. */
                if (!this._activeSwapId && this._swaps.length > 0) {
                    await this.select(this._swaps[0]!.swapid)
                }
            } catch (err) {
                this._error = err instanceof SwapApiError ? err.message : String(err)
            } finally {
                this._loading = false
            }
        },

        /**
         * Create Swap
         *
         * POST /v1/swap with the session identity; bootstrap settle-to-self
         * unless a custom dest (.dash name / identity id) is provided.
         */
        async create() {
            const platformid = this.platformid
            if (!platformid) {
                this._error = 'Connect your wallet first — swaps are identity-bound.'
                return
            }
            if (!this._apiKey) {
                this._error = 'A swap API key is required (advanced settings below).'
                return
            }

            this._creating = true
            this._error = null

            try {
                const amountDuffs = this._amount !== ''
                    ? Math.floor(parseFloat(this._amount) * 1e8)
                    : undefined

                const swap = await createSwap({
                    base: this._base,
                    apiKey: this._apiKey,
                    direction: this._direction,
                    platformid,
                    dest_platformid: this._sendToSelf ? platformid : undefined,
                    dest: this._sendToSelf ? undefined : this._customDest,
                    amount_in: amountDuffs,
                })

                this._activeSwap = swap
                this._activeSwapId = swap?.swapid ?? null

                /* Track locally (bounded, newest last) so the list survives reloads. */
                this._trackSwapId(swap.swapid)

                /* Start polling for transitions. */
                this._startPolling()
            } catch (err) {
                this._error = err instanceof SwapApiError ? err.message : String(err)
            } finally {
                this._creating = false
            }
        },

        /** Select (and poll) a swap by id. */
        async select(swapid: string) {
            this._activeSwapId = swapid
            this._activeSwap = null
            this._error = null

            await this._refreshActive()
            this._startPolling()
        },

        /** Refresh the active swap once. */
        async _refreshActive() {
            if (!this._activeSwapId || !this._apiKey) return

            try {
                this._activeSwap = await fetchSwap({
                    base: this._base,
                    apiKey: this._apiKey,
                    swapid: this._activeSwapId,
                })
            } catch (err) {
                if (err instanceof SwapApiError && err.status === 404) {
                    this._error = 'That swap id no longer exists.'
                    this._stopPolling()
                    return
                }
                console.error('Swap: fetch failed', err)
            }
        },

        /** 10 s poll loop; stops on terminal statuses. */
        _startPolling() {
            this._stopPolling()
            if (!this._activeSwapId) return

            this._pollTimer = setInterval(async () => {
                await this._refreshActive()

                const status = this._activeSwap?.status
                if (status && isTerminal(status)) {
                    this._stopPolling()
                    /* Refresh the list so the settled/failed state shows. */
                    await this.loadSwaps()
                }
            }, 10_000)
        },

        _stopPolling() {
            if (this._pollTimer) {
                clearInterval(this._pollTimer)
                this._pollTimer = null
            }
        },

        /** Persist a swapid locally (bounded to the last 25, per the tracker UX). */
        _trackSwapId(swapid: string) {
            const System = useSystemStore()
            if (typeof localStorage === 'undefined') return

            const key = networkStorageKey(System, 'dashswap_swapids')
            const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]')
            const next = [swapid, ...existing.filter((id) => id !== swapid)].slice(0, 25)
            localStorage.setItem(key, JSON.stringify(next))
        },

        /** Tracked swap ids (localStorage), newest first. */
        trackedSwapIds(): string[] {
            const System = useSystemStore()
            if (typeof localStorage === 'undefined') return []
            return JSON.parse(localStorage.getItem(networkStorageKey(System, 'dashswap_swapids')) || '[]')
        },

        /** Clear transient flow state (keep records). */
        resetForm() {
            this._amount = ''
            this._customDest = ''
            this._sendToSelf = true
            this._error = null
        },
    },
})
