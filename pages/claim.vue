<template>
    <section class="flex flex-col gap-3 p-5">
        <h1 class="text-sky-200 text-6xl tracking-widest font-light">
            Claim My Username
        </h1>

        <p class="pl-1.5 text-fuchsia-300 text-lg tracking-widest uppercase">
            Stake your place in the DASH (R)Evolution
        </p>
    </section>

    <ClaimProgress />

    <section class="p-5 flex flex-col gap-6">
        <p class="text-slate-200 text-lg">
            DashSwap introduces the simplest way to <span class="font-bold text-amber-300">INSTANTLY</span> secure a Dash username for your existing, or ANY newly created account(s).
            The whole process takes less than FIVE (5) minutes.
            Simply begin by searching for your preferred username below↴
        </p>

        <input
            type="text"
            placeholder="Enter your username"
            class="w-full h-20 px-5 text-3xl font-medium bg-amber-100 rounded-lg border-4 border-sky-200 tracking-wider"
        />

        <small class="pl-2 -mt-3 text-rose-400 font-medium text-lg/5 tracking-wider">
            PLEASE NOTE:
            <br />Usernames are CaSe SeNsItIvE and PERMANENT
        </small>

        <button class="w-fit px-5 py-3 text-3xl font-bold tracking-wider border-4 border-sky-200 bg-sky-100 rounded-xl hover:bg-sky-300">
            Start searching...
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
