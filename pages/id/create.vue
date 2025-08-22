<template>
    <section class="flex flex-col gap-3 p-5">
        <h1 class="text-sky-200 text-6xl tracking-widest italic font-light">
            Create a NEW Identity
        </h1>

        <p class="text-sky-400 text-xl tracking-wider">
            A Dash Platform Identity is very similar to an Ethereum Account.
            Create a NEW Platform Identity right from the WEB!
        </p>

        <h3 class="text-rose-400 text-2xl tracking-wider">
            This feature is COMING SOON!
        </h3>
    </section>

    <Bootstrap />
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

/* Initialize stores. */
import { useIdentityStore } from '@/stores/identity'
const Identity = useIdentityStore()

const init = async () => {
    console.log('TEST ID CREATOR')

    // const response = await Identity.createIdentity('entropy')
    const response = await Identity.pshenmic()
        .catch(err => console.error(err))
console.log('ID CREATE TEST', response)
}

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
