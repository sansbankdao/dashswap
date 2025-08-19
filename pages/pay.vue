<template>
    <main class="">
        <NavMenu />

        <section class="flex flex-col gap-3 p-5">
            <h1 class="text-sky-200 text-6xl tracking-widest italic font-light">
                Paymaster
            </h1>

            <p class="text-sky-400 text-xl tracking-wider">
                Conveniently send payments from your Platform wallet to OVER 100+ crypto currencies, including stablecoins.
            </p>
        </section>

        <Bootstrap />
    </main>
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

useHead({
    title: 'Paymaster by DashSwap'
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
