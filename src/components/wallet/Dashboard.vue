<template>
    <main class="w-full flex flex-col gap-4">
        <section class="grid grid-cols-2 gap-3">
            <h2 class="col-span-2 text-2xl font-medium">
                THIS WALLET WILL BE GLORIOUS-TOO!!
            </h2>
        </section>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import numeral from 'numeral'
console.log('BEFORE IMPORT')
// import init, {
//     WasmSdkBuilder,
//     identity_fetch,
//     prefetch_trusted_quorums_testnet,
// } from '../../libs/dash/wasm_sdk.js'
console.log('AFTER IMPORT')
/* Initialize stores. */
// import { useSystemStore } from '@/stores/system'
// const System = useSystemStore()

const search = ref(null)

const isShowingSans = ref(false)
const isShowingDash = ref(false)

const makeSwap = async () => {
    const msg = `Are you sure you want to continue with this Swap:

        ↪ You are sending ( 1.00 ) $SANS
        ↪ You are receiving ( ~1,337.88 ) $DASH
    `
    if (confirm(msg)) {
        alert('done!')
    }
}

const startup = async () => {
    const MAINNET_IP_ADDRESS = ''
    const MAINNET_PORT = ''
    const TESTNET_IP_ADDRESS = '52.12.176.90'
    const TESTNET_PORT = '1443'
    const ACTIVE_NETWORK = 'testnet'

    /* Initialize WASM module. */
    await init()

    /* Initialize transport handler. */
    const transport = {
        url: `https://${TESTNET_IP_ADDRESS}:${TESTNET_PORT}`,
        network: ACTIVE_NETWORK
    }
    // console.log('TRANSPORT', transport)

    /* Pre-fretch trusted (TESTNET) quorums. */
    await prefetch_trusted_quorums_testnet()

    /* Initialize SDK. */
    const sdk = await WasmSdkBuilder
        .new_testnet_trusted()
        .build()
    // console.log('SDK', sdk)

    // FIXME FOR DEV PURPOSES ONLY
    const identityid = '35SD29sWhmKEeQt1h87B2yXQVvBPDhevUYeubpAwGEow'

    // FIXME FOR DEV PURPOSES ONLY
    const identity = await identity_fetch(sdk, identityid)
        .catch(err => {
            console.error(err)
            console.error('HANDLE NOT FOUND!!')
        })
    console.log('IDENTITY', identity)
    console.log('IDENTITY (balance)', identity.balance)
}

onMounted(() => {
    console.log('Mounted!')
    startup()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })

</script>
