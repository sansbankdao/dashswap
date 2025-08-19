<template>
    <section class="flex flex-col gap-3 p-5">
        <h1 class="text-sky-200 text-6xl tracking-widest italic font-light">
            Leaderboard
        </h1>

        <p class="text-sky-400 text-xl tracking-wider">
            Chat in real-time with you frens and foes about "financial advice".
        </p>
    </section>

    <Bootstrap />
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

useHead({
    title: 'PAGE_TITLE by DashSwap'
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
