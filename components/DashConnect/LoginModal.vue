<template>
    <Teleport to="body">
        <Transition
            enter-active-class="duration-200 ease-out"
            enter-from-class="opacity-0"
            leave-active-class="duration-150 ease-in"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-label="Connect a Dash wallet"
                @keydown.escape="close"
            >
                <!-- Backdrop -->
                <div
                    class="absolute inset-0 bg-[#03040c]/80 backdrop-blur-md"
                    @click="close"
                ></div>

                <!-- Panel -->
                <div class="relative w-full max-w-md animate-pop-in">
                    <div class="absolute -inset-1 rounded-3xl bg-brand-gradient opacity-40 blur-lg animate-pulse-glow" aria-hidden="true"></div>

                    <div class="relative overflow-hidden rounded-3xl bg-glass-surface ring-1 ring-white/10 shadow-glass">
                        <!-- Header -->
                        <div class="relative px-6 pt-6 pb-4 border-b border-white/10">
                            <div class="flex items-center gap-3">
                                <img src="/icon.svg" class="size-9 drop-shadow-[0_0_10px_rgba(0,141,228,0.6)]" alt="DashSwap" />
                                <div class="flex-1">
                                    <h2 class="text-lg font-bold bg-text-gradient bg-clip-text text-transparent">
                                        Connect with DashConnect
                                    </h2>
                                    <p class="text-[11px] tracking-wider text-slate-400 uppercase">
                                        App Connect v2 · {{ networkDisplay }}
                                    </p>
                                </div>
                                <button
                                    class="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                    aria-label="Close"
                                    @click="close"
                                >
                                    <XMarkIcon class="size-5" />
                                </button>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="relative px-6 py-6 min-h-[22rem] flex flex-col items-center justify-center gap-4">

                            <!-- IDLE / GENERATING -->
                            <template v-if="status === 'idle' || status === 'generating'">
                                <div class="relative size-20">
                                    <div class="absolute inset-0 rounded-full border-2 border-dash-400/30 border-t-dash-300 animate-spin"></div>
                                    <div class="absolute inset-2 rounded-full border-2 border-space-400/20 border-b-space-300 animate-spin-slower"></div>
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <span class="size-3 rounded-full bg-dash-300 animate-pulse-glow"></span>
                                    </div>
                                </div>
                                <p class="text-sm text-slate-300 animate-fade-in">Generating a secure login request…</p>
                                <button
                                    v-if="status === 'idle'"
                                    class="mt-1 px-5 py-2 rounded-xl font-semibold text-white bg-brand-gradient shadow-glow-dash hover:brightness-110 transition-all"
                                    @click="start"
                                >
                                    Start connection
                                </button>
                            </template>

                            <!-- WAITING: QR + carrier tabs + countdown -->
                            <template v-else-if="status === 'waiting'">
                                <div class="relative animate-fade-up">
                                    <div class="absolute -inset-2 rounded-2xl bg-dash-500/15 blur-lg animate-pulse-glow" aria-hidden="true"></div>
                                    <div class="relative rounded-2xl bg-white p-2.5">
                                        <img v-if="qrDataUrl" :src="qrDataUrl" class="size-56" alt="DashConnect request QR code" />
                                        <div v-else class="size-56 flex items-center justify-center">
                                            <div class="size-8 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin"></div>
                                        </div>
                                        <div class="absolute inset-2.5 overflow-hidden rounded-lg" aria-hidden="true">
                                            <div class="h-1/4 w-full bg-gradient-to-b from-dash-400/30 to-transparent animate-scan"></div>
                                        </div>
                                    </div>
                                </div>

                                <p class="text-center text-sm text-slate-300">
                                    Scan with <span class="font-semibold text-dash-300">EvoNext</span>, Dash Evo Tool
                                    or any DashConnect wallet
                                </p>

                                <!-- Carrier switcher (both offered on testnet) -->
                                <div v-if="uris.length > 1" class="flex rounded-xl bg-white/5 ring-1 ring-white/10 p-1 text-xs font-medium">
                                    <button
                                        v-for="entry in uris"
                                        :key="entry.carrier"
                                        class="px-3 py-1.5 rounded-lg transition-all"
                                        :class="activeCarrier === entry.carrier ? 'bg-brand-gradient text-white shadow-glow-dash' : 'text-slate-400 hover:text-slate-200'"
                                        @click="activeCarrier = entry.carrier"
                                    >
                                        {{ entry.carrier === 'dash-key' ? 'dash-key: (wallets today)' : 'dashpay:// (new wallets)' }}
                                    </button>
                                </div>

                                <!-- Countdown -->
                                <div class="flex items-center gap-2 text-xs text-slate-400">
                                    <svg viewBox="0 0 36 36" class="size-9 -rotate-90">
                                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3" />
                                        <circle
                                            cx="18" cy="18" r="15.5" fill="none"
                                            stroke="#008de4" stroke-width="3" stroke-linecap="round"
                                            :stroke-dasharray="circumference"
                                            :stroke-dashoffset="circumference * (1 - remainingFraction)"
                                            style="transition: stroke-dashoffset 1s linear;"
                                        />
                                    </svg>
                                    <span class="font-mono">{{ countdownLabel }}</span>
                                </div>
                            </template>

                            <!-- VERIFYING -->
                            <template v-else-if="status === 'verifying'">
                                <div class="relative size-20 animate-fade-in">
                                    <div class="absolute inset-0 rounded-full bg-dash-500/20 blur-xl animate-pulse-glow"></div>
                                    <div class="absolute inset-0 rounded-full border-2 border-dash-400/40 border-t-dash-200 animate-spin"></div>
                                </div>
                                <p class="text-sm text-slate-300">Verifying the wallet's response on-chain…</p>
                            </template>

                            <!-- CONFIRM: "Continue as …" -->
                            <template v-else-if="status === 'confirm'">
                                <div class="flex flex-col items-center gap-4 animate-pop-in text-center">
                                    <img
                                        :src="pendingBlockie"
                                        class="size-16 rounded-2xl ring-2 ring-dash-400/60 shadow-glow-dash"
                                        alt="Identity avatar"
                                    />
                                    <div>
                                        <p class="text-sm text-slate-300">A wallet approved this request as</p>
                                        <p class="mt-1 font-mono text-sm text-dash-200 break-all">{{ shortPendingId }}</p>
                                    </div>
                                    <p class="text-xs text-slate-400">
                                        Anyone can answer a request — confirm this is you before signing in.
                                    </p>
                                    <div class="flex gap-3 mt-1">
                                        <button
                                            class="px-5 py-2 rounded-xl font-semibold text-white bg-brand-gradient shadow-glow-dash hover:brightness-110 transition-all"
                                            @click="confirm"
                                        >
                                            Continue
                                        </button>
                                        <button
                                            class="px-5 py-2 rounded-xl font-medium text-slate-300 ring-1 ring-white/15 hover:bg-white/10 transition-all"
                                            @click="decline"
                                        >
                                            That's not me
                                        </button>
                                    </div>
                                </div>
                            </template>

                            <!-- COMPLETE -->
                            <template v-else-if="status === 'complete'">
                                <div class="flex flex-col items-center gap-4 animate-pop-in text-center">
                                    <div class="relative size-20">
                                        <div class="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse-glow"></div>
                                        <svg viewBox="0 0 52 52" class="relative size-20">
                                            <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(52,211,153,0.35)" stroke-width="2" />
                                            <path
                                                d="M15 27l8 8 15-16"
                                                fill="none" stroke="#34d399" stroke-width="4"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                style="stroke-dasharray: 48; stroke-dashoffset: 48; animation: draw-check 0.5s 0.15s ease-out forwards;"
                                            />
                                        </svg>
                                    </div>
                                    <p class="font-semibold text-emerald-300">Connected!</p>
                                    <p class="text-xs text-slate-400">Your scoped session key is live — memory only, never on disk.</p>
                                </div>
                            </template>

                            <!-- ERROR -->
                            <template v-else-if="status === 'error'">
                                <div class="flex flex-col items-center gap-4 animate-fade-in text-center">
                                    <div class="size-14 rounded-2xl bg-rose-500/15 ring-1 ring-rose-400/40 flex items-center justify-center">
                                        <ExclamationTriangleIcon class="size-7 text-rose-300" />
                                    </div>
                                    <p class="text-sm text-rose-200 max-w-64 break-words">{{ error }}</p>
                                    <button
                                        class="px-5 py-2 rounded-xl font-semibold text-white bg-brand-gradient shadow-glow-dash hover:brightness-110 transition-all"
                                        @click="start"
                                    >
                                        Try again
                                    </button>
                                </div>
                            </template>
                        </div>

                        <!-- Footer note -->
                        <div class="px-6 pb-5">
                            <p class="text-[11px] leading-relaxed text-slate-500 text-center">
                                Approving grants DashSwap a <span class="text-slate-300">scoped, budgeted, expiring</span> key.
                                It cannot send your credits, register names or change your keys — the wallet keeps them.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
/* components/DashConnect/LoginModal.vue
 *
 * DashConnect (App Connect v2) login experience:
 * QR + link per carrier, live countdown, state machine driven entirely by the
 * dashconnect store, "Continue as" confirmation for un-hinted grants.
 *
 * App Connect DIP dashpay/dips#181; see docs/DASHCONNECT_EVONEXT_HANDOFF.md.
 */

import QRCode from 'qrcode'
import blockies from 'ethereum-blockies-base64'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { selectCarrierUri } from '../../libs/dashconnect/config'

const DashConnect = useDashConnectStore()

const isOpen = useState('dashconnect:login-open', () => false)
const status = computed(() => DashConnect.status)
const uris = computed(() => DashConnect.uris ?? [])
const error = computed(() => DashConnect.error)

const activeCarrier = ref('dash-key')
const qrDataUrl = ref(null)
const nowTick = ref(Date.now())

/* Countdown ring (10-minute request lifetime). */
const circumference = 2 * Math.PI * 15.5
const elapsedMs = computed(() => Math.max(0, nowTick.value - (DashConnect._startedAt || nowTick.value)))
const remainingFraction = computed(() => {
    const total = 10 * 60_000
    return Math.max(0, Math.min(1, 1 - elapsedMs.value / total))
})
const countdownLabel = computed(() => {
    const remaining = Math.max(0, Math.ceil((10 * 60_000 - elapsedMs.value) / 1000))
    const minutes = Math.floor(remaining / 60)
    const seconds = remaining % 60
    return `${minutes}:${String(seconds).padStart(2, '0')}`
})

const networkDisplay = computed(() => {
    const System = useSystemStore()
    return System.network === 'mainnet' ? 'MAINNET' : 'TESTNET'
})

const activeUri = computed(() => {
    if (uris.value.length === 0) return null
    return selectCarrierUri(uris.value, activeCarrier.value).uri
})

const pendingBlockie = computed(() => {
    const id = DashConnect.pendingIdentityId
    if (!id) return ''
    try {
        return blockies(id)
    } catch (err) {
        return ''
    }
})

const shortPendingId = computed(() => {
    const id = DashConnect.pendingIdentityId
    if (!id) return ''
    return `${id.slice(0, 8)}…${id.slice(-8)}`
})

/* QR generation for the active carrier URI. */
watch([activeUri, isOpen], async ([uri, open]) => {
    if (!open || !uri) {
        qrDataUrl.value = null
        return
    }
    try {
        qrDataUrl.value = await QRCode.toDataURL(uri, {
            margin: 1,
            width: 448,
            errorCorrectionLevel: 'L',
            color: { dark: '#0b1220', light: '#ffffff' },
        })
    } catch (err) {
        console.error('DashConnect: QR generation failed', err)
        qrDataUrl.value = null
    }
}, { immediate: true })

/* Countdown ticker + auto-close on success. */
let tickTimer = null
let successTimer = null

watch(isOpen, (open) => {
    if (open) {
        activeCarrier.value = uris.value[0]?.carrier ?? 'dash-key'
        tickTimer = setInterval(() => {
            nowTick.value = Date.now()
        }, 1000)
    } else {
        clearInterval(tickTimer)
        tickTimer = null
    }
})

watch(status, (value, previous) => {
    if (value === 'confirm') {
        /* Reset to the default carrier view in case a retry follows. */
    }
    if (value === 'complete' && previous !== 'complete') {
        successTimer = setTimeout(() => close(), 1600)
    }
})

onBeforeUnmount(() => {
    clearInterval(tickTimer)
    clearTimeout(successTimer)
})

const start = () => {
    DashConnect.startLogin()
}

const confirm = async () => {
    await DashConnect.confirmIdentity()
}

const decline = () => {
    DashConnect.declineIdentity()
}

const close = () => {
    clearTimeout(successTimer)
    successTimer = null
    /* An unfinished attempt is cancelled; a finished one is left intact. */
    if (status.value !== 'complete') {
        DashConnect.cancel()
    }
    isOpen.value = false
}
</script>

<style scoped>
@keyframes draw-check {
    to {
        stroke-dashoffset: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    [class*='animate-'] {
        animation: none !important;
    }
}
</style>
