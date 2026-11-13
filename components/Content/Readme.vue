<template>
    <main class="p-5 sm:p-8 flex flex-col gap-8">
        <!-- Hero -->
        <section class="flex flex-col items-center text-center gap-4 animate-fade-up">
            <span class="inline-flex items-center gap-2 rounded-full bg-surface-sunken ring-1 ring-line px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-dash-400">
                <span class="size-1.5 rounded-full bg-dash-400 animate-pulse" aria-hidden="true"></span>
                Pre-Alpha Preview
            </span>

            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-text-gradient bg-clip-text text-transparent">
                Welcome to DashSwap!
            </h1>

            <p class="max-w-2xl text-ink2 leading-relaxed">
                Introducing the <span class="font-bold text-ink1">Pre-Alpha Preview</span> for the soon to be released DashSwap decentralized exchange (DEX).
            </p>
        </section>

        <!-- Feature snapshot -->
        <section class="animate-fade-up" style="animation-delay: 80ms;">
            <div class="rounded-2xl bg-surface-sunken ring-1 ring-line p-5 sm:p-6">
                <h3 class="text-sm font-bold tracking-widest uppercase text-dash-400 mb-4">
                    Features Services Include
                </h3>

                <ol class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <li class="group flex items-center gap-3 rounded-xl bg-surface ring-1 ring-line p-3.5 transition-all duration-200 hover:ring-dash-300/50 hover:-translate-y-0.5">
                        <span class="flex items-center justify-center size-9 rounded-lg bg-dash-500/15 text-dash-400 shrink-0">
                            <ArrowsRightLeftIcon class="size-5" />
                        </span>
                        <span class="text-sm font-medium text-ink1">Instant $TOKEN swap</span>
                    </li>
                    <li class="group flex items-center gap-3 rounded-xl bg-surface ring-1 ring-line p-3.5 transition-all duration-200 hover:ring-dash-300/50 hover:-translate-y-0.5">
                        <span class="flex items-center justify-center size-9 rounded-lg bg-violet-500/15 text-violet-400 shrink-0">
                            <RocketLaunchIcon class="size-5" />
                        </span>
                        <span class="text-sm font-medium text-ink1">Custom $TOKEN launcher</span>
                    </li>
                    <li class="group flex items-center gap-3 rounded-xl bg-surface ring-1 ring-line p-3.5 transition-all duration-200 hover:ring-dash-300/50 hover:-translate-y-0.5">
                        <span class="flex items-center justify-center size-9 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                            <BanknotesIcon class="size-5" />
                        </span>
                        <span class="text-sm font-medium text-ink1">Paymaster (for $DASH-free transfers)</span>
                    </li>
                </ol>

                <p class="mt-5 text-sm text-ink2 leading-relaxed">
                    DashSwap will offer full 1st-class support for all <span class="font-bold text-ink1">DASH $TOKENS</span>; following the Dash Platform v2.0 upgrade and the introduction of <span class="font-bold text-ink1">"Native" Fungible Tokens</span>.
                </p>
            </div>
        </section>

        <!-- Claim CTA -->
        <section class="animate-fade-up" style="animation-delay: 140ms;">
            <NuxtLink to="/claim" class="group relative block rounded-2xl">
                <span class="absolute -inset-px rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-border-flow bg-brand-gradient bg-[length:200%_200%]" aria-hidden="true"></span>
                <span class="absolute -inset-3 rounded-3xl bg-dash-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></span>
                <span class="relative flex flex-col gap-2 rounded-2xl bg-surface-strong ring-1 ring-line p-6 text-center transition-transform duration-300 group-hover:-translate-y-0.5">
                    <h2 class="text-2xl sm:text-3xl font-extrabold bg-text-gradient bg-clip-text text-transparent">
                        Claim Your Dash Username
                    </h2>

                    <h3 class="text-base font-bold text-amber-400">
                        Specially built assistant for iOS users to claim their Dash username TODAY!
                    </h3>

                    <p class="text-sm text-ink2">
                        We offer a step-by-step guide to get MOST usernames claimed in just a few minutes.
                    </p>
                </span>
            </NuxtLink>
        </section>

        <!-- Detail sections -->
        <section class="animate-fade-up" style="animation-delay: 200ms;">
            <div class="flex flex-col gap-3">
                <h3 class="flex items-center gap-2.5 text-lg font-bold text-ink1">
                    <span class="flex items-center justify-center size-8 rounded-lg bg-dash-500/15 text-dash-400">
                        <CircleStackIcon class="size-5" />
                    </span>
                    Liquidity Pools (LPs)
                </h3>

                <p class="text-ink2 leading-relaxed">
                    Are you looking to EARN FEES on platform activity?
                    Our on-chain order book manages a vast collection of provider pools.
                    Each pool is a modern, auto-balancing, multi-asset pools for your convenience.
                    Up to 500 $SANS are required to be staked per asset pool.
                </p>

                <p class="text-ink2 leading-relaxed">
                    Becoming a Liquidity Providers (LP) is permissionless.
                    <span class="font-bold text-ink1">Get started TODAY!</span>
                </p>
            </div>
        </section>

        <section class="animate-fade-up" style="animation-delay: 260ms;">
            <div class="flex flex-col gap-3">
                <h3 class="flex items-center gap-2.5 text-lg font-bold text-ink1">
                    <span class="flex items-center justify-center size-8 rounded-lg bg-violet-500/15 text-violet-400">
                        <ReceiptPercentIcon class="size-5" />
                    </span>
                    Platform Fees
                </h3>

                <p class="text-ink2 leading-relaxed">
                    Web Users pay a <span class="font-bold text-ink1">1% fee</span> for ALL transactions.
                    Builders and AI Agents pay a <span class="font-bold text-ink1">0.3% fee</span> ALL transactions (via any of our APIs).
                </p>
            </div>
        </section>

        <section class="animate-fade-up" style="animation-delay: 320ms;">
            <div class="flex flex-col gap-3">
                <h3 class="flex items-center gap-2.5 text-lg font-bold text-ink1">
                    <span class="flex items-center justify-center size-8 rounded-lg bg-amber-500/15 text-amber-400">
                        <BoltIcon class="size-5" />
                    </span>
                    Daily Payouts
                </h3>

                <p class="text-ink2 leading-relaxed">
                    $SANS stakers will receive up to <span class="font-bold text-ink1">50% of ALL transaction fees</span> collected by DashSwap users, EACH and EVERY day.
                    Payout amount is based on the amount of your stake.
                </p>
            </div>
        </section>
    </main>
</template>

<script setup>
/* components/Content/Readme.vue
 *
 * Landing copy — restyled for the Evolution theme (adaptive light/dark).
 * All copy and links preserved verbatim from the original version.
 */

import {
    ArrowsRightLeftIcon,
    BanknotesIcon,
    BoltIcon,
    CircleStackIcon,
    ReceiptPercentIcon,
    RocketLaunchIcon,
} from '@heroicons/vue/24/outline'
</script>
