<template>

    <!-- Start: Terminal -->
    <div class="mt-6 bg-black rounded-lg p-4 border border-gray-600 text-xs">

        <div class="mt-2 text-slate-200">
            Initializing Platform v2.0...
            <br />
            All systems are now ONLINE!
            <br />
            Current epoch is {{epoch}}
        </div>

        <div class="flex items-center">
            <span class="text-slate-200 mr-2">↳</span>
            <span class="flex items-center text-sky-300">
                Dash Network
                <svg class="mx-1 inline size-3" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path>
                </svg>
                <span class="text-sm font-bold">{{networkDisplay}}</span>
            </span>
        </div>

        <div class="mt-0 text-slate-200">
            Waiting for your next request...
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

/* Initialize stores. */
// import { useWalletStore } from '@/stores/wallet'
import { useSystemStore } from '@/stores/system'
// const Wallet = useWalletStore()
const System = useSystemStore()

const sdk = new DashPlatformSDK({ network: 'testnet' })

const status = await sdk.node.status()

const epoch = ref(0)

const network = computed(() => {
    return System.network
})

const networkDisplay = computed(() => {
    if (System.network.slice(0, 9) === 'localhost') {
        return 'LOCALHOST'
    }

    switch(System.network) {
    case 'mainnet':
        return 'MAINNET'
    case 'testnet':
        return 'TESTNET'
    default:
        return 'UNKNOWN'
    }
})

// console.log('STATUS CHAIN', status.chain)
// console.log('LAST BLOCK HASH', status.chain.latestBlockHash)
// console.log('EPOCH', status.time.epoch)




const init = async () => {
    epoch.value = numeral(status.time?.epoch).format('0,0')

    // network.value = System.network
}

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
