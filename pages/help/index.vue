<template>
    <main class="">
        <NavMenu />

        <HelpWelcome />

        <section class="px-5 py-2">
            <h2 class="text-slate-200 text-xl tracking-widest">
                Important Links
            </h2>

            <ul class="list-disc pl-5">
                <li>
                    <NuxtLink to="/roadmap" class="text-2xl text-blue-400 text-xl tracking-wider hover:underline">
                        Roadmap
                    </NuxtLink>
                </li>
            </ul>
        </section>
    </main>
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

useHead({
    title: 'Help & Support for DashSwap'
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
