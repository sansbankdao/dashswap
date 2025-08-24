<template>
    <section class="flex flex-col gap-3 p-5">
        <h1 class="text-sky-200 text-6xl tracking-widest italic font-light">
            Connect Your Profile
        </h1>

        <p class="text-sky-400 text-xl tracking-wider">
            Get connected what ever way works best for YOU!
        </p>

        <ul class="pl-10 list-disc text-sky-400 text-xl tracking-wider">
            <li>
                Passkey
            </li>

            <li>
                Seed phrase
            </li>

            <li>
                Web browser extension
            </li>

            <li>
                Identity keys
            </li>
        </ul>
    </section>

    <IdentitySetup />
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

useHead({
    title: 'Connect by DashSwap'
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
