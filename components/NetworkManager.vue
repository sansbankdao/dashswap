<template>
    <main class="mt-6 bg-black rounded-lg p-4 border border-gray-600 text-xs">
        <div class="flex items-center">
            <span class="flex items-center text-sky-300">
                Dash Platform v2.0
                <svg class="mx-1 inline size-3" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path>
                </svg>
                <span class="text-sm font-bold">{{networkDisplay}}</span>
            </span>
        </div>

        <div class="text-slate-200">
            <span class="block">
                <span class="text-slate-200 mr-2">↳</span>
                <span class="inline-flex">
                    Initializing connections...
                </span>
            </span>

            <span class="block">
                <span class="text-slate-200 mr-2">↳</span>
                <span class="inline-flex">
                    All systems are now online
                </span>
            </span>

            <span class="block">
                <span class="text-slate-200 mr-2">↳</span>
                <span class="inline-flex">
                    Current network epoch is <span class="px-1 font-bold">{{epoch}}</span>
                </span>
            </span>

            <span class="block">
                <span class="text-slate-200 mr-2">↳</span>
                <span class="inline-flex">
                    Dash is trading @ <span class="px-1 font-bold">{{dashUsdTickerDisplay}}</span> USD
                </span>
            </span>
        </div>

        <div class="mt-0 text-slate-200">
            Waiting for your next request...
        </div>

    </main>
</template>

<script setup lang="ts">
/* Import modules. */
import numeral from 'numeral'
import { DashPlatformSDK } from 'dash-platform-sdk'

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

const epoch = ref(0)
const dashUsdTickerDisplay = ref('$0.00')

const networkDisplay = computed(() => {
    /* Validate network. */
    if (typeof System.network === 'undefined' || System.network === null) {
        return 'n/a'
    }

    /* Validate localhost. */
    if (System.network.slice(0, 9) === 'localhost') {
        return 'LOCALHOST'
    }

    /* Handle network. */
    switch(System.network) {
    case 'mainnet':
        return 'MAINNET'
    case 'testnet':
        return 'TESTNET'
    default:
        return 'UNKNOWN'
    }
})

const init = async () => {
    /* Request (latest) ticker. */
    const response = await fetch('https://dashswap.xyz/v1/ticker/dash')
        .catch(err => console.error(err))

    /* Validate response. */
    if (typeof response !== 'undefined' && response !== null) {
        /* Decode JSON data. */
        const json = await response.json()
            .catch(err => console.error(err))

        /* Set DASH/USD ticker display. */
        dashUsdTickerDisplay.value = numeral(json.quote.USD.price).format('$0,0.00[00]')
    }

    /* Initialize SDK. */
    const sdk = new DashPlatformSDK({
        network: System.network === 'mainnet' ? 'mainnet' : 'testnet',
    })

    /* Request node status. */
    const status = await sdk.node.status()

    /* Set (formatted) epoch. */
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
