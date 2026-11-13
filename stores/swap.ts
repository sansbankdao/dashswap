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

/** Bootstrap allowlist (server-enforced; mirrored for the UI). */
export const SWAP_PAIRS = [
    { direction: 'DASH->SANS', from: 'DASH', to: 'SANS', label: 'Dash → Sansnote' },
    { direction: 'DASH->DUSD', from: 'DASH', to: 'DUSD', label: 'Dash → Dash USD' },
] as const

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
