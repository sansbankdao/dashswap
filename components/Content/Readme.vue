<template>
    <main class="flex flex-col gap-6 items-center text-center sm:items-start sm:text-left">

        <h1 class="text-sky-300 font-thin text-4xl">
            Welcome to DashSwap!
        </h1>

        <p class="text-slate-200">
            Introducing the <span class="text-lg font-bold text-amber-300">Pre-Alpha Preview</span> for the soon to be released DashSwap decentralized exchange (DEX).
        </p>

        <section class="flex flex-col gap-3 text-slate-200">
            <h3 class="text-lg font-bold text-amber-300">
                Features Services Include
            </h3>

            <ol class="pl-10 list-decimal">
                <li>Instant $TOKEN swap</li>
                <li>Custom $TOKEN launcher</li>
                <li>Paymaster (for $DASH-free transfers)</li>
            </ol>
        </section>

        <p class="text-slate-200">
            DashSwap will offer full 1st-class support for all <span class="font-bold">DASH $TOKENS</span>; following the Dash Platform v2.0 upgrade and the introduction of <span class="font-bold">"Native" Fungible Tokens</span>.
        </p>

        <NuxtLink to="/claim" class="px-5 py-3 flex flex-col gap-3 text-slate-200 bg-sky-800 border-2 border-rose-200 hover:bg-sky-700 rounded-xl">
            <h2 class="text-3xl font-bold text-rose-300">
                Claim Your Dash Username
            </h2>

            <h3 class="text-lg font-bold text-amber-300">
                Specially built assistant for iOS users to claim their Dash username TODAY!
            </h3>

            <p>
                We offer a step-by-step guide to get MOST usernames claimed in just a few minutes.
            </p>
        </NuxtLink>

        <section class="flex flex-col gap-3 text-slate-200">
            <h3 class="text-lg font-bold text-amber-300">
                Liquidity Pools (LPs)
            </h3>

            <p>
                Are you looking to EARN FEES on platform activity?
                Our on-chain order book manages a vast collection of provider pools.
                Each pool is a modern, auto-balancing, multi-asset pools for your convenience.
                Up to 500 $SANS are required to be staked per asset pool.
            </p>

            <p>
                Becoming a Liquidity Providers (LP) is permissionless.
                Get started TODAY!
            </p>
        </section>

        <section class="flex flex-col gap-3 text-slate-200">
            <h3 class="text-lg font-bold text-amber-300">
                Platform Fees
            </h3>

            <p>
                Web Users pay a 1% fee for ALL transactions.
                Builders and AI Agents pay a 0.3% fee ALL transactions (via any of our APIs).
            </p>
        </section>

        <section class="flex flex-col gap-3 text-slate-200">
            <h3 class="text-lg font-bold text-amber-300">
                Daily Payouts
            </h3>

            <p>
                $SANS stakers will receive up to 50% of ALL transaction fees collected by DashSwap users, EACH and EVERY day.
                Payout amount is based on the amount of your stake.
            </p>
        </section>

    </main>
</template>
