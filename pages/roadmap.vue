<template>
    <main class="p-5 sm:p-8 flex flex-col gap-8">
        <!-- Hero -->
        <section class="flex flex-col items-center text-center gap-4 animate-fade-up">
            <span class="inline-flex items-center gap-2 rounded-full bg-surface-sunken ring-1 ring-line px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-amber-400">
                <span class="size-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true"></span>
                Roadmap
            </span>

            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-text-gradient bg-clip-text text-transparent">
                What's next for DashSwap
            </h1>

            <p class="max-w-2xl text-ink2 leading-relaxed">
                Swaps are live today. Here's what we're building next — in the order the community asked for it.
            </p>
        </section>

        <!-- Phase 1 (live) -->
        <section class="animate-fade-up" style="animation-delay: 80ms;">
            <GlowCard>
                <div class="p-5 sm:p-6 flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <span class="inline-flex items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40 px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-emerald-300">Live now</span>
                        <h2 class="text-xl font-bold text-ink1">Instant swaps</h2>
                    </div>
                    <p class="text-ink2 leading-relaxed">
                        DASH ↔ native platform-token swaps with on-chain settlement, single-use deposit addresses, flat 0.3% engine fee, and self-custody sends from the browser wallet. Live on mainnet and testnet.
                    </p>
                </div>
            </GlowCard>
        </section>

        <!-- Phase 2 -->
        <section class="animate-fade-up" style="animation-delay: 140ms;">
            <GlowCard>
                <div class="p-5 sm:p-6 flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <span class="inline-flex items-center rounded-full bg-dash-500/15 ring-1 ring-dash-400/40 px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-dash-300">Next</span>
                        <h2 class="text-xl font-bold text-ink1">Liquidity provider pools &amp; daily payouts</h2>
                    </div>
                    <div class="text-ink2 leading-relaxed flex flex-col gap-3">
                        <p>
                            Our on-chain order book manages a collection of provider pools — modern, auto-balancing, multi-asset pools for your convenience. Up to <span class="font-bold text-ink1">500 $SANS</span> are required to be staked per asset pool.
                        </p>
                        <p>
                            Becoming a liquidity provider (LP) is permissionless. <span class="font-bold text-ink1">Get started soon!</span>
                        </p>
                        <p>
                            $SANS stakers will receive up to <span class="font-bold text-ink1">50% of ALL transaction fees</span> collected by DashSwap users, each and every day. Payout amount is based on the amount of your stake.
                        </p>
                    </div>
                </div>
            </GlowCard>
        </section>

        <!-- Phase 3 -->
        <section class="animate-fade-up" style="animation-delay: 200ms;">
            <GlowCard>
                <div class="p-5 sm:p-6 flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <span class="inline-flex items-center rounded-full bg-violet-500/15 ring-1 ring-violet-400/40 px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-violet-300">Later</span>
                        <h2 class="text-xl font-bold text-ink1">Token launcher &amp; paymaster</h2>
                    </div>
                    <div class="text-ink2 leading-relaxed flex flex-col gap-3">
                        <p>
                            A custom <span class="font-bold text-ink1">$TOKEN launcher</span>: spin up native fungible tokens on Dash Platform without writing contracts.
                        </p>
                        <p>
                            A <span class="font-bold text-ink1">paymaster</span> for $DASH-free transfers — let your users pay fees in tokens while the protocol covers the DASH.
                        </p>
                    </div>
                </div>
            </GlowCard>
        </section>
    </main>
</template>

<script setup>
/* pages/roadmap.vue
 *
 * Forward-looking feature copy, split out of the landing page at launch
 * (LP pools, daily payouts, token launcher, paymaster). The landing now
 * shows only shipped features plus a teaser linking here.
 */
</script>
