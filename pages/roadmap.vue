<template>
    <section class="flex flex-col gap-3 p-5">
        <h1 class="text-sky-200 text-6xl tracking-widest italic font-light">
            Roadmap
        </h1>

        <p class="text-sky-400 text-xl tracking-wider">
            Follow along with our team building progress and major/minor milestones.
        </p>

        <ol class="pl-5 pt-5 text-slate-200 text-2xl font-bold space-y-3">
            <li>📌 Rainmaker</li>
            <li>📌 Asset gallery</li>
            <li>📌 Token launcher</li>
            <li>📌 Identity manager</li>
            <li>📌 Profile manager</li>
            <li>📌 Asset swap</li>
            <li>📌 Chrome browser extension integration</li>
            <li>📌 Ledger HW support</li>
            <li>📌 Trezor/OneKey HW support</li>
            <li>📌 Trollbox</li>
            <li>📌 PRO subscriptions</li>
            <li>📌 Paymaster</li>
            <li>📌 Leaderboard</li>
            <li>📌 Help &amp; support</li>
            <li>📌 Front-end frameworks</li>
            <li>📌 Back-end frameworks</li>
            <li>✅ Bip-34 (seed phrase) support</li>
            <li>✅ Self-custodial Platform web wallet</li>
        </ol>
    </section>

    <Bootstrap />
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

useHead({
    title: 'Roadmap for DashSwap DEX'
})

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
