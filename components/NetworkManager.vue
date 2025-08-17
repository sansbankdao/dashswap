<template>

    <!-- Start: Terminal -->
    <div class="mt-6 bg-black rounded-lg p-4 border border-gray-600 text-xs">

        <div class="flex items-center mb-2">
            <span class="text-slate-200 mr-2">↳</span>
            <span class="text-sky-300">Dash Network ⇒ <span class="text-sm font-bold">TESTNET</span></span>
        </div>

        <div class="mt-2 text-slate-200">
            Initializing Platform v2.0...
            <br />
            All systems are now ONLINE!
            <br />
            Waiting for the next swap request...
            <br />
            Epoch: {{epoch}}
        </div>

    </div>
    <!-- End: Terminal -->

    <!-- Start: Social Links -->
    <Socials />
    <!-- End: Social Links -->

</template>

<script setup lang="ts">
/* Import modules. */
import numeral from 'numeral'
import { DashPlatformSDK } from 'dash-platform-sdk'

const sdk = new DashPlatformSDK({ network: 'testnet' })

const status = await sdk.node.status()

const epoch = ref(0)

console.log('STATUS CHAIN', status.chain)
console.log('LAST BLOCK HASH', status.chain.latestBlockHash)
console.log('EPOCH', status.time.epoch)




const init = async () => {
    epoch.value = numeral(status.time?.epoch).format('0,0')
}

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
