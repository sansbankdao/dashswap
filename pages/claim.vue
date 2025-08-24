<template>
    <section class="flex flex-col gap-3 p-5">
        <h1 class="text-sky-200 text-6xl tracking-widest italic font-light">
            Claim My Username Assistant
        </h1>

        <p class="text-sky-400 text-xl tracking-wider">
            Are you ready to preserve your space of the DASH Evolution?
        </p>

        <p class="text-sky-400 text-xl tracking-wider">
            This guide was prepared especially for iOS users whom currently DO NOT have access to DashPay.
        </p>
    </section>

    <ClaimProgress />

    <section class="p-5 flex flex-col gap-6">
        <p class="text-slate-200">
            DashSwap introduces the simplest way to secure your Dash username to your new or existing wallet.
            Simply begin below by searching for your preferred username.
        </p>

        <input
            type="text"
            placeholder="Enter your username"
            class="w-full h-20 px-5 text-3xl font-medium bg-amber-100 rounded-lg border-4 border-sky-200"
        />

        <button class="w-fit px-5 py-3 text-3xl font-bold tracking-wider border-4 border-sky-200 bg-sky-100 rounded-xl hover:bg-sky-300">
            Find it!
        </button>
    </section>
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

useHead({
    title: 'Claim My Username Assistant by DashSwap'
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
