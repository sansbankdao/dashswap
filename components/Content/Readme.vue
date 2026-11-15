<template>
    <main class="p-5 sm:p-8 flex flex-col gap-8">
        <!-- Hero -->
        <section class="flex flex-col items-center text-center gap-4 animate-fade-up">
            <span class="inline-flex items-center gap-2 rounded-full bg-surface-sunken ring-1 ring-line px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-dash-400">
                <span class="size-1.5 rounded-full bg-dash-400 animate-pulse" aria-hidden="true"></span>
                Instant swaps · Dash Platform
            </span>

            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-text-gradient bg-clip-text text-transparent">
                Welcome to DashSwap!
            </h1>

            <p class="max-w-2xl text-ink2 leading-relaxed">
                Introducing <span class="font-bold text-ink1">DashSwap</span> — the decentralized exchange (DEX) for Dash and Platform tokens. Swap in seconds; the network settles on-chain.
            </p>
        </section>

        <!-- Live today -->
        <section class="animate-fade-up" style="animation-delay: 80ms;">
            <div class="rounded-2xl bg-surface-sunken ring-1 ring-line p-5 sm:p-6">
                <h3 class="text-sm font-bold tracking-widest uppercase text-dash-400 mb-4">
                    Live today
                </h3>

                <ol class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <li class="group flex items-center gap-3 rounded-xl bg-surface ring-1 ring-line p-3.5 transition-all duration-200 hover:ring-dash-300/50 hover:-translate-y-0.5">
                        <span class="flex items-center justify-center size-9 rounded-lg bg-dash-500/15 text-dash-400 shrink-0">
                            <ArrowsRightLeftIcon class="size-5" />
                        </span>
                        <span class="text-sm font-medium text-ink1">Instant DASH ↔ token swaps</span>
                    </li>
                    <li class="group flex items-center gap-3 rounded-xl bg-surface ring-1 ring-line p-3.5 transition-all duration-200 hover:ring-dash-300/50 hover:-translate-y-0.5">
                        <span class="flex items-center justify-center size-9 rounded-lg bg-violet-500/15 text-violet-400 shrink-0">
                            <WalletIcon class="size-5" />
                        </span>
                        <span class="text-sm font-medium text-ink1">Browser wallet &amp; self-custody sends</span>
                    </li>
                    <li class="group flex items-center gap-3 rounded-xl bg-surface ring-1 ring-line p-3.5 transition-all duration-200 hover:ring-dash-300/50 hover:-translate-y-0.5">
                        <span class="flex items-center justify-center size-9 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                            <BoltIcon class="size-5" />
                        </span>
                        <span class="text-sm font-medium text-ink1">On-chain settlement, verified publicly</span>
                    </li>
                </ol>

                <p class="mt-5 text-sm text-ink2 leading-relaxed">
                    DashSwap supports <span class="font-bold text-ink1">DASH $TOKENS</span>; built on the Dash Platform v2.0 upgrade and <span class="font-bold text-ink1">"Native" Fungible Tokens</span>.
                </p>
            </div>
        </section>

        <!-- Fees -->
        <section class="animate-fade-up" style="animation-delay: 140ms;">
            <div class="flex flex-col gap-3">
                <h3 class="flex items-center gap-2.5 text-lg font-bold text-ink1">
                    <span class="flex items-center justify-center size-8 rounded-lg bg-violet-500/15 text-violet-400">
                        <ReceiptPercentIcon class="size-5" />
                    </span>
                    Platform Fees
                </h3>

                <p class="text-ink2 leading-relaxed">
                    Every swap pays a <span class="font-bold text-ink1">flat 0.3% engine fee</span> — quoted up front and shown before you confirm. The same 0.3% rate applies via our APIs for builders and AI agents.
                </p>
            </div>
        </section>

        <!-- Roadmap teaser -->
        <section class="animate-fade-up" style="animation-delay: 200ms;">
            <NuxtLink to="/roadmap" class="group block rounded-2xl bg-surface-sunken ring-1 ring-line p-5 sm:p-6 transition-all duration-200 hover:ring-dash-300/50">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-2.5">
                        <span class="flex items-center justify-center size-8 rounded-lg bg-amber-500/15 text-amber-400">
                            <MapIcon class="size-5" />
                        </span>
                        <h3 class="text-lg font-bold text-ink1">Roadmap</h3>
                    </div>
                    <span class="text-xs font-semibold tracking-widest uppercase text-dash-400 group-hover:translate-x-0.5 transition-transform">
                        View →
                    </span>
                </div>

                <p class="mt-3 text-sm text-ink2 leading-relaxed">
                    Liquidity provider pools, daily fee-share payouts for $SANS stakers, a token launcher and a paymaster for $DASH-free transfers are on the way.
                </p>
            </NuxtLink>
        </section>
    </main>
</template>

<script setup>
/* components/Content/Readme.vue
 *
 * Landing copy — restyled for the Evolution theme (adaptive light/dark).
 * Launch framing: features that SHIP are shown under "Live today";
 * forward-looking items (LP pools, payouts, launcher, paymaster) live on
 * /roadmap (see pages/roadmap.vue).
 */

import {
    ArrowsRightLeftIcon,
    BoltIcon,
    MapIcon,
    ReceiptPercentIcon,
    WalletIcon,
} from '@heroicons/vue/24/outline'
</script>
