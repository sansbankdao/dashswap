<template>
    <main class="p-5 sm:p-8 flex flex-col gap-6">
        <!-- Engine phase banner (FRONTEND-HANDOFF-2 §0: real value) -->
        <div class="flex items-center gap-2.5 rounded-xl bg-amber-400/10 ring-1 ring-amber-400/40 px-4 py-2.5 text-xs text-amber-300 animate-fade-in">
            <InformationCircleIcon class="size-4 shrink-0" />
            <span>
                <span class="font-bold uppercase">{{ Swap.enginePhase }} LIVE</span> — swaps settle
                <span class="font-semibold">real DASH → real SANS / DUSD</span>.
                Deposit addresses are Dash <span class="font-mono">{{ Swap.enginePhase }}</span> L1 addresses —
                double-check every detail before sending.
            </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <!-- LEFT: swap form -->
            <section class="flex flex-col gap-5 animate-fade-up">
                <EffectsSectionTitle>
                    I Want to Receive ↴
                </EffectsSectionTitle>

                <!-- Pair selector (bootstrap allowlist; reverse rejected server-side) -->
                <div class="flex flex-col gap-2.5">
                    <button
                        v-for="pair in Swap.pairs"
                        :key="pair.direction"
                        class="group relative flex items-center justify-between rounded-xl px-4 py-3.5 text-left ring-1 transition-all duration-200"
                        :class="Swap.direction === pair.direction
                            ? 'ring-dash-400/60 bg-dash-500/10 shadow-glow-dash'
                            : 'ring-line bg-surface-sunken hover:ring-dash-300/40'"
                        @click="Swap.setDirection(pair.direction)"
                    >
                        <span class="flex items-center gap-3">
                            <span class="flex items-center justify-center size-9 rounded-lg bg-dash-500/15 text-dash-400 text-xs font-bold">DASH</span>
                            <ArrowRightIcon class="size-4 text-ink3" />
                            <span
                                class="flex items-center justify-center size-9 rounded-lg text-xs font-bold"
                                :class="pair.to === 'SANS' ? 'bg-amber-500/15 text-amber-400' : 'bg-lime-500/15 text-lime-400'"
                            >{{ pair.to }}</span>
                        </span>
                        <span class="text-xs text-ink3">
                            {{ pair.direction === Swap.direction ? 'selected' : pair.label }}
                        </span>
                    </button>

                    <p class="text-[11px] text-ink3 px-1">
                        Bootstrap phase runs <span class="text-ink2">ONE WAY</span> — receiving DASH back opens after revenue generation
                        (the allowlist is enforced server-side either way).
                    </p>
                </div>

                <!-- Amount -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-medium tracking-widest uppercase text-ink3">Amount of DASH to send</label>
                    <div class="relative">
                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0.00 — leave empty for an OPEN swap"
                            v-model="amountDisplay"
                            class="w-full rounded-xl bg-surface-sunken ring-1 ring-line px-4 py-3 text-xl font-semibold text-ink1 placeholder:text-ink3 placeholder:font-normal placeholder:text-base focus:ring-2 focus:ring-dash-400 outline-none transition-all"
                        />
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dash-400">DASH</span>
                    </div>
                </div>

                <!-- Engine inventory (API-HANDOFF-CHAT-INVENTORY §2):
                     hidden until the engine exposes inventory_state. -->
                <div
                    v-if="Swap.inventoryState === 'out'"
                    class="rounded-xl bg-rose-500/10 ring-1 ring-rose-400/40 p-3 flex gap-2.5"
                >
                    <ExclamationTriangleIcon class="size-5 text-rose-300 shrink-0 mt-0.5" />
                    <div>
                        <p class="text-sm font-semibold text-rose-200">Sold out</p>
                        <p class="text-xs text-ink3">The engine's inventory for this token is exhausted — new swaps pause until the pool is topped up.</p>
                    </div>
                </div>
                <div
                    v-else-if="Swap.inventoryState === 'low'"
                    class="rounded-xl bg-amber-500/10 ring-1 ring-amber-400/40 p-3 flex gap-2.5"
                >
                    <ExclamationTriangleIcon class="size-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                        <p class="text-sm font-semibold text-amber-200">Low inventory</p>
                        <p class="text-xs text-ink3">The pool is running thin — swaps still settle, but top-ups are coming.</p>
                    </div>
                </div>

                <!-- Destination (prominent: who receives the swapped tokens) -->
                <div class="flex flex-col gap-2.5">
                    <div class="flex items-center justify-between">
                        <label class="text-xs font-medium tracking-widest uppercase text-ink3">Deliver the tokens to</label>
                        <span
                            class="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full"
                            :class="Swap._sendToSelf ? 'bg-dash-500/15 text-dash-300' : 'bg-violet-500/15 text-violet-300'"
                        >{{ Swap._sendToSelf ? 'self' : 'third party' }}</span>
                    </div>

                    <button
                        class="flex items-center gap-3 rounded-xl bg-surface-sunken ring-1 p-3.5 text-left transition-all"
                        :class="Swap._sendToSelf ? 'ring-dash-400/60 bg-dash-500/10' : 'ring-line hover:ring-dash-300/40'"
                        @click="Swap.setSendToSelf(true)"
                    >
                        <UserCircleIcon class="size-9 text-dash-400 shrink-0" />
                        <span class="min-w-0">
                            <span class="block text-sm font-semibold text-ink1">My identity</span>
                            <span class="block font-mono text-xs text-ink3 truncate">{{ shortPlatformid || 'connect a wallet to swap' }}</span>
                        </span>
                        <CheckCircleIcon
                            v-if="Swap._sendToSelf"
                            class="ml-auto size-5 text-dash-300 shrink-0"
                        />
                    </button>

                    <button
                        class="flex items-center gap-3 rounded-xl bg-surface-sunken ring-1 p-3.5 text-left transition-all"
                        :class="!Swap._sendToSelf ? 'ring-violet-400/60 bg-violet-500/10' : 'ring-line hover:ring-violet-300/40'"
                        @click="Swap.setSendToSelf(false)"
                    >
                        <PaperAirplaneIcon class="size-9 text-violet-400 shrink-0" />
                        <span class="min-w-0">
                            <span class="block text-sm font-semibold text-ink1">Someone else</span>
                            <span class="block text-xs text-ink3">A `.dash` name, bare label or identity id —
                                perfect for gifts and invoices</span>
                        </span>
                        <CheckCircleIcon
                            v-if="!Swap._sendToSelf"
                            class="ml-auto size-5 text-violet-300 shrink-0"
                        />
                    </button>

                    <div
                        v-if="!Swap._sendToSelf"
                        class="rounded-xl bg-violet-500/5 ring-1 ring-violet-400/40 p-3 flex flex-col gap-2 animate-fade-in"
                    >
                        <label class="text-[10px] uppercase tracking-widest text-violet-300 font-semibold">Recipient</label>
                        <input
                            ref="customDestInput"
                            type="text"
                            placeholder="alice.dash · alice · or a bare identity id"
                            v-model="customDestDisplay"
                            class="w-full rounded-lg bg-surface ring-1 ring-violet-400/40 px-3 py-2.5 font-mono text-sm text-ink1 focus:ring-2 focus:ring-violet-400 outline-none transition-all"
                        />
                        <p class="text-[11px] text-ink3">
                            The name resolves to its identity on the platform when the swap is created
                            — the tokens land there the moment the deposit confirms.
                        </p>
                    </div>
                </div>

                <!-- Testnet Worker not wired (safety guard) -->
                <div v-if="Swap.testnetWorkerMissing" class="rounded-xl bg-amber-400/10 ring-1 ring-amber-400/40 px-4 py-3 text-xs text-amber-300 animate-fade-in">
                    <span class="font-semibold">Swap creation is disabled on this host</span> —
                    the testnet Worker route is not baked into this build, and falling back to the
                    mainnet Worker would move real value. Wire it and rebuild.
                </div>

                <!-- Create -->
                <button
                    class="group relative w-full rounded-xl px-5 py-3.5 font-bold text-white overflow-hidden transition-all duration-300 enabled:hover:scale-[1.01] enabled:active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!canCreate || Swap.creating"
                    @click="onCreate"
                >
                    <span class="absolute inset-0 bg-brand-gradient bg-[length:200%_200%] animate-border-flow" aria-hidden="true"></span>
                    <span class="relative flex items-center justify-center gap-2">
                        <ArrowPathIcon v-if="Swap.creating" class="size-5 animate-spin" />
                        <BoltIcon v-else class="size-5" />
                        {{ Swap.creating ? 'Creating swap request…' : 'Create Swap Request' }}
                    </span>
                </button>

                <p v-if="Swap.error" class="text-sm text-rose-300">{{ Swap.error }}</p>

                <!-- No wallet -->
                <div v-if="!platformid" class="rounded-xl bg-surface-sunken ring-1 ring-line p-4 text-sm text-ink2">
                    Swaps are <span class="font-semibold text-ink1">identity-bound</span> — connect a DashConnect wallet first.
                    <button class="ml-1 text-dash-400 font-semibold hover:text-dash-300" @click="openConnect">
                        Connect ↗
                    </button>
                </div>

                <!-- Phase 1 key setup -->
                <details v-if="!Swap.hasApiKey" class="rounded-xl bg-surface-sunken ring-1 ring-line p-4">
                    <summary class="text-sm font-medium text-ink1 cursor-pointer">Advanced — swap API key (Phase 1)</summary>
                    <p class="mt-2 text-xs text-ink3">
                        The browser needs a <span class="font-mono">dsw_dev_…</span> key to reach the API
                        (server-enforced: scope <span class="font-mono">swap</span> + per-identity list filter).
                        Phase 2 replaces this with wallet signatures — the key never outlives the interim.
                    </p>
                    <div class="mt-2.5 flex gap-2">
                        <input
                            type="password"
                            placeholder="dsw_dev_…"
                            v-model="apiKeyInput"
                            class="flex-1 rounded-lg bg-surface ring-1 ring-line px-3 py-2 font-mono text-xs text-ink1 focus:ring-2 focus:ring-dash-400 outline-none"
                        />
                        <button
                            class="rounded-lg px-3 py-2 text-xs font-semibold text-white bg-brand-gradient"
                            @click="saveApiKey"
                        >Save</button>
                    </div>
                </details>
            </section>

            <!-- RIGHT: tracker -->
            <section class="flex flex-col gap-5 animate-fade-up" style="animation-delay: 90ms;">
                <EffectsSectionTitle>Your swaps</EffectsSectionTitle>

                <!-- Active swap detail -->
                <div v-if="Swap.activeSwap" class="relative rounded-2xl ring-1 ring-line bg-surface-sunken p-5 flex flex-col gap-4 animate-pop-in">
                    <div class="flex items-center justify-between gap-3">
                        <span class="font-mono text-xs text-ink3">{{ shortSwapId }}</span>
                        <SwapStatusBadge :status="Swap.activeSwap.status" />
                    </div>

                    <!-- Deposit step -->
                    <div class="rounded-xl bg-surface ring-1 ring-line p-4 flex items-center gap-4">
                        <img v-if="depositQr" :src="depositQr" class="size-24 rounded-lg bg-white p-1.5" alt="Deposit address QR code" />
                        <div class="min-w-0 flex-1">
                            <p class="text-[10px] uppercase tracking-widest text-ink3">Send DASH to ({{ Swap.enginePhase }})</p>
                            <p class="mt-1 font-mono text-sm text-ink1 break-all">{{ Swap.activeSwap.deposit_address }}</p>
                            <button
                                class="mt-1.5 text-xs font-semibold text-dash-400 hover:text-dash-300 transition-colors"
                                @click="copyDeposit"
                            >{{ copied ? 'Copied ✓' : 'Copy address' }}</button>
                            <p class="mt-1 text-[11px] text-ink3">
                                Single-use deposit address — watch-only for you; settlement is custodied on the platform side.
                            </p>
                        </div>
                    </div>

                    <!-- Status timeline -->
                    <div class="flex items-center gap-1.5">
                        <template v-for="(step, idx) in timeline" :key="step.name">
                            <span
                                class="h-1.5 flex-1 rounded-full transition-all duration-500"
                                :class="step.done ? 'bg-brand-gradient' : 'bg-line'"
                                :title="step.name"
                            ></span>
                        </template>
                    </div>
                    <div class="flex justify-between text-[10px] uppercase tracking-wider text-ink3 -mt-2.5">
                        <span :class="timelineClass('pending')">pending</span>
                        <span :class="timelineClass('detected')">detected</span>
                        <span :class="timelineClass('confirmed')">confirmed</span>
                        <span :class="timelineClass('settling')">settling</span>
                        <span :class="timelineClass('settled')">settled</span>
                    </div>

                    <!-- Quote (FRONTEND-HANDOFF-2 §1/§3: promo rate + fee transparency) -->
                    <div class="flex flex-col gap-2">
                        <div class="rounded-lg bg-surface ring-1 ring-line p-3">
                            <p class="text-[10px] uppercase tracking-widest text-ink3">Promo rate</p>
                            <p class="mt-0.5 font-semibold text-ink1">{{ rateDisplay }}</p>
                        </div>
                        <div class="rounded-lg bg-surface ring-1 ring-line p-3">
                            <p class="text-[10px] uppercase tracking-widest text-ink3">Payout (net of fee)</p>
                            <p class="mt-0.5 font-semibold text-ink1">
                                {{ formatTokenUnits(destSymbol, Swap.activeSwap.expected_out ?? Swap.activeSwap.amount_out) }}
                            </p>
                        </div>
                    </div>
                    <p class="text-[11px] text-ink3">
                        Includes <span class="font-semibold text-ink2">{{ Swap.activeSwap.fee_bps ? (Swap.activeSwap.fee_bps / 100) : 0.30 }}% platform fee</span><template v-if="feeDisplay"> — fee ≈ {{ feeDisplay }} DASH</template>.
                        The FINAL rate is fixed at settlement
                        <template v-if="Swap.activeSwap.amount_out">
                            — settled output: <span class="font-semibold text-ink1">{{ formatTokenUnits(destSymbol, Swap.activeSwap.amount_out) }}</span>
                        </template>.
                    </p>

                    <!-- Settled on-chain proof (ACK Q3: dest_txid) -->
                    <div v-if="settledTxid" class="rounded-lg bg-surface ring-1 ring-line p-3">
                        <p class="text-[10px] uppercase tracking-widest text-ink3">Settled on-chain — state transition</p>
                        <p class="mt-0.5 font-mono text-xs text-ink1 break-all">{{ settledTxid }}</p>
                        <button class="mt-1 text-xs font-semibold text-dash-400 hover:text-dash-300 transition-colors" @click="copyTxid">
                            {{ copiedTxid ? 'Copied ✓' : 'Copy hash' }}
                        </button>
                    </div>

                    <!-- Live poll indicator -->
                    <p v-if="isPolling" class="flex items-center gap-2 text-[11px] text-ink3">
                        <span class="size-1.5 rounded-full bg-dash-400 animate-pulse"></span>
                        Polling every 10 s — the deposit is monitored on-chain (ChainLock-gated finality).
                    </p>
                </div>

                <!-- Empty state -->
                <div v-else class="rounded-2xl bg-surface-sunken ring-1 ring-line p-8 text-center animate-fade-in">
                    <ArrowsRightLeftIcon class="size-10 mx-auto text-ink3" />
                    <p class="mt-3 text-sm text-ink2">Create a swap request to get a deposit address.</p>
                </div>

                <!-- List -->
                <div class="flex flex-col gap-2">
                    <button
                        v-for="swap in Swap.swaps"
                        :key="swap.swapid"
                        class="flex items-center justify-between gap-3 rounded-xl bg-surface-sunken ring-1 p-3 text-left transition-all hover:ring-dash-300/50"
                        :class="swap.swapid === Swap._activeSwapId ? 'ring-dash-400/50' : 'ring-line'"
                        @click="Swap.select(swap.swapid)"
                    >
                        <span class="min-w-0">
                            <span class="block font-mono text-xs text-ink1">{{ swap.swapid.slice(0, 8) }}…{{ swap.swapid.slice(-6) }}</span>
                            <span class="block text-[11px] text-ink3">{{ swap.direction }} · {{ swap.amount_in ? (swap.amount_in / 1e8) + ' DASH' : 'open' }}</span>
                        </span>
                        <SwapStatusBadge :status="swap.status" />
                    </button>

                    <p v-if="Swap.swaps.length === 0" class="text-xs text-ink3 text-center py-2">
                        {{ platformid ? 'No swaps yet for this identity.' : 'Your swaps will appear here once a wallet is connected.' }}
                    </p>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup>
/* components/Swap/Menu.vue
 *
 * InstaSwap — real dashswap-api integration (FRONTEND-HANDOFF.md §8):
 * pair selector (bootstrap allowlist), duffs amount input, identity-bound
 * destination, dash: deposit QR, full status lifecycle, 10 s polling.
 * Replaces the previous mock UI (fake rates / dead buttons removed).
 */

import QRCode from 'qrcode'
import {
    feeDuffs,
    formatTokenUnits,
} from '@/stores/swap'
import {
    ArrowPathIcon,
    ArrowRightIcon,
    ArrowsRightLeftIcon,
    BoltIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    PaperAirplaneIcon,
    UserCircleIcon,
} from '@heroicons/vue/24/outline'

const Swap = useSwapStore()
const DashConnect = useDashConnectStore()

const apiKeyInput = ref('')
const copied = ref(false)
const depositQr = ref(null)

const platformid = computed(() => Swap.platformid)
const isPolling = computed(() => Swap._pollTimer !== null)

const shortPlatformid = computed(() => {
    const id = platformid.value
    if (!id) return ''
    return `${id.slice(0, 10)}…${id.slice(-10)}`
})

const shortSwapId = computed(() => {
    const id = Swap.activeSwap?.swapid
    if (!id) return ''
    return `${id.slice(0, 8)}…${id.slice(-6)}`
})

const amountDisplay = computed({
    get: () => Swap.amount,
    set: (value) => Swap.setAmount(value),
})

const customDestDisplay = computed({
    get: () => Swap._customDest,
    set: (value) => Swap.setCustomDest(value),
})

const canCreate = computed(() => !!platformid.value)

/* Lifecycle steps (FRONTEND-HANDOFF §5) — render forward-compatibly. */
const STEPS = ['pending', 'detected', 'confirmed', 'settling', 'settled']

const timeline = computed(() => {
    const status = Swap.activeSwap?.status
    const activeIndex = STEPS.indexOf(status)
    return STEPS.map((name, index) => ({
        name,
        done: status === 'failed' || status === 'refunded'
            ? index === 0
            : activeIndex >= index && activeIndex !== -1,
    }))
})

const timelineClass = (name) => {
    const status = Swap.activeSwap?.status
    const activeIndex = STEPS.indexOf(status)
    const index = STEPS.indexOf(name)
    if (activeIndex >= index) return 'text-dash-300 font-semibold'
    return ''
}

/* Destination symbol of the active swap (§1 display semantics). */
const destSymbol = computed(() =>
    ((Swap.activeSwap?.direction ?? Swap.direction).split('->')[1] ?? 'SANS'))

/* §1: the API's rate is base-units-per-duff of the destination — display
 * it in customer terms. SANS: the promo ladder ("1 SANS = 0.0016 DASH —
 * Season 3"; season read LIVE from the public quote — ACK §3.1);
 * DUSD: the $1.00 peg. */
const rateDisplay = computed(() => {
    const rate = Swap.activeSwap?.rate
    if (!rate || rate <= 0) return '—'
    if (destSymbol.value === 'DUSD') return '1 DUSD = $1.00 (USD peg)'
    const quoteSeason = (destSymbol.value === Swap.quote?.dest && Number.isInteger(Swap.quote?.season))
        ? Swap.quote.season
        : null
    const dashPer = Number((1 / rate).toPrecision(3))
    return `1 SANS = ${dashPer} DASH${quoteSeason ? ` — Season ${quoteSeason}` : ''}`
})

/* §3 fee line: the swap object's fee_duffs (ACK §3.2 — the API is the
 * source of truth); derived ONLY as a fallback for legacy rows whose
 * fee_duffs is null. Shown in DASH. */
const feeDisplay = computed(() => {
    const swap = Swap.activeSwap
    const amountIn = swap?.amount_in
    if (!amountIn || amountIn <= 0) return ''
    const duffs = (swap?.fee_duffs !== null && swap?.fee_duffs !== undefined)
        ? Number(swap.fee_duffs)
        : feeDuffs(amountIn, swap?.fee_bps ?? 30)
    return (duffs / 1e8).toLocaleString('en-US', { maximumFractionDigits: 8 })
})

/* ACK Q3: the settled on-chain movement (DPP state transition hash) —
 * shown + copyable in the tracker once settled. */
const settledTxid = computed(() => Swap.activeSwap?.dest_txid ?? '')
const copiedTxid = ref(false)
const copyTxid = async () => {
    if (!settledTxid.value) return
    await navigator.clipboard.writeText(settledTxid.value).catch((err) => console.error(err))
    copiedTxid.value = true
    setTimeout(() => {
        copiedTxid.value = false
    }, 1600)
}

/* Live public quote (rate/season/network — no key) for the selected dest. */
watch(destSymbol, async (symbol) => {
    try {
        await Swap.fetchQuote(symbol)
    } catch (err) {
        console.error('Swap: public quote unavailable', err)
    }
}, { immediate: true })

/* Deposit QR — dash:<deposit_address> (FRONTEND-HANDOFF §2). */
watch(() => Swap.activeSwap?.deposit_address, async (address) => {
    if (!address) {
        depositQr.value = null
        return
    }
    try {
        depositQr.value = await QRCode.toDataURL(`dash:${address}`, {
            margin: 1,
            width: 240,
            errorCorrectionLevel: 'M',
            color: { dark: '#0b1220', light: '#ffffff' },
        })
    } catch (err) {
        console.error('Swap: QR generation failed', err)
        depositQr.value = null
    }
}, { immediate: true })

const onCreate = async () => {
    /* Guard: a third-party delivery needs a recipient (the API would 422
     * with a refine error; fail fast with a clear message instead). */
    if (!Swap._sendToSelf && !Swap._customDest.trim()) {
        Swap.setSendToSelf(true)
        Swap.setSendToSelf(false)
        Swap._error = 'Enter the recipient — a .dash name, bare label or identity id.'
        return
    }

    await Swap.create()
    await Swap.loadSwaps()
}

const openConnect = () => {
    useState('dashconnect:login-open').value = true
}

const saveApiKey = () => {
    Swap.setApiKey(apiKeyInput.value.trim())
    Swap.init()
    Swap.loadSwaps()
}

const copyDeposit = async () => {
    const address = Swap.activeSwap?.deposit_address
    if (!address) return
    await navigator.clipboard.writeText(address).catch((err) => console.error(err))
    copied.value = true
    setTimeout(() => {
        copied.value = false
    }, 1600)
}

/* Boot: capture config, restore selection, load records. */
onMounted(async () => {
    Swap.init()

    /* Reopen the last tracked swap (localStorage ids survive reloads). */
    const tracked = Swap.trackedSwapIds()
    if (tracked.length > 0 && !Swap.activeSwapId) {
        Swap._activeSwapId = tracked[0]
        await Swap._refreshActive()
        if (Swap.activeSwap && !['settled', 'failed', 'refunded'].includes(Swap.activeSwap.status)) {
            Swap._startPolling()
        }
    }

    await Swap.loadSwaps()
})

onBeforeUnmount(() => {
    Swap._stopPolling()
})
</script>
