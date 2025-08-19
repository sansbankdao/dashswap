<template>
    <section class="flex flex-col gap-3 p-5">
        <h1 class="text-sky-200 text-6xl tracking-widest italic font-light">
            Leaderboard
        </h1>

        <p class="text-sky-400 text-xl tracking-wider">
            Compete for cash &amp; prizes against the other TOP traders in your class.
        </p>
    </section>

    <Bootstrap />
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

useHead({
    title: 'Leaderboard by DashSwap'
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
