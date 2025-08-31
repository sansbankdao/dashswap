<template>
    <!-- <Loading v-if="Identity.isLoading" /> -->

    <IdentitySetup v-if="!Identity.isReady" />

<!-- SHOULD WE SUPPORT (2) SCREEN SIZES?? -->
    <!-- <main v-else class="grid grid-cols-1 lg:grid-cols-7 gap-8"> -->
    <main v-else class="grid grid-cols-1 gap-8">
        <div class="col-span-4">
            <section @click="setTab('assets')" class="cursor-pointer group px-5 py-3 bg-gradient-to-b from-sky-100 to-sky-50 border-t border-x border-sky-400 rounded-x-lg shadow-md hover:bg-sky-100">
                <div class="flex flex-row w-full justify-between items-center mb-1" :class="[ isShowingAssets ? 'visible' : 'hidden' ]">
                    <h3 class="text-base tracking-tight uppercase text-sky-600 font-medium text-center opacity-40 group-hover:opacity-100 group-hover:scale-105 duration-300 ease-in-out">
                        My Identity Dashboard
                    </h3>

                    <img :src="Identity.asset?.iconUrl" class="-mt-3 -mr-2 p-2 h-10 w-auto opacity-40 group-hover:opacity-100 group-hover:h-11 duration-300 ease-in-out" />
                </div>

                <div class="flex flex-col items-end">
                    <h3 class="text-xs tracking-widest text-sky-700 font-medium uppercase">
                        Spendable ${{Identity.asset?.ticker}}
                    </h3>

                    <h2 class="text-3xl text-gray-600 font-medium">
                        {{displayBalance}}
                    </h2>

                    <h3 class="text-xl text-gray-500 font-medium">
                        {{displayBalanceUsd}}
                    </h3>
                </div>

                <section :class="[ isShowingAssets ? 'visible' : 'hidden' ]">
                    <div class="my-2 border-t border-sky-500" />

                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <h3 class="text-xs tracking-widest text-sky-700 font-medium uppercase">
                                Tokens
                            </h3>

                            <h2 v-if="tokens" class="text-base text-gray-600 font-medium">
                                {{tokensBalanceUsd}} <small class="text-sky-400">x{{Object.keys(tokens).length}}</small>
                            </h2>
                            <h2 v-else class="text-base text-gray-600 font-medium">
                                none
                            </h2>
                        </div>

                        <div>
                            <h3 class="text-xs tracking-widest text-sky-700 font-medium uppercase">
                                Collectibles
                            </h3>

                            <h2 class="text-base text-gray-600 font-medium">
                                none
                            </h2>
                        </div>
                    </div>
                </section>
            </section>

            <div class="block">
                <nav class="isolate grid grid-cols-4 divide-x divide-gray-200 rounded-x-lg rounded-b-lg shadow" aria-label="Tabs">
                    <div @click="setTab('deposit')" class="cursor-pointer bg-gray-700 rounded-bl-lg group relative min-w-0 flex flex-row justify-center items-center gap-1 overflow-hidden py-2 px-2 text-sm font-medium hover:bg-gray-50 hover:text-gray-600 focus:z-10" aria-current="page" :class="[ isShowingSend ? 'text-gray-100' : 'text-gray-400' ]">
                        <svg class="w-4 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path>
                        </svg>
                        <span class="text-xs sm:text-sm">Deposit</span>
                        <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5" :class="[ isShowingSend ? 'bg-sky-500' : 'bg-transparent' ]"></span>
                    </div>

                    <div @click="setTab('send')" class="cursor-pointer bg-gray-700 text-gray-400 group relative min-w-0 flex flex-row justify-center items-center gap-1 overflow-hidden py-2 px-2 text-center text-sm font-medium hover:bg-gray-50 hover:text-gray-600 focus:z-10">
                        <svg class="w-4 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
                        </svg>
                        <span class="text-xs sm:text-sm">Send</span>
                        <span aria-hidden="true" class="bg-transparent absolute inset-x-0 bottom-0 h-0.5"></span>
                    </div>

                    <div @click="setTab('history')" class="cursor-pointer bg-gray-700 text-gray-400 group relative min-w-0 flex flex-row justify-center items-center gap-1 overflow-hidden py-2 px-2 text-center text-sm font-medium hover:bg-gray-50 hover:text-gray-600 focus:z-10">
                        <svg class="w-5 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                        </svg>
                        <span class="text-xs sm:text-sm">History</span>
                        <span aria-hidden="true" class="bg-transparent absolute inset-x-0 bottom-0 h-0.5"></span>
                    </div>

                    <div @click="setTab('assistant')" class="cursor-pointer bg-gray-700 text-gray-400 group relative min-w-0 flex flex-row justify-center items-center gap-1 overflow-hidden py-2 px-2 text-center text-sm font-medium hover:bg-gray-50 hover:text-gray-600 focus:z-10">
                        <svg class="w-5 h-auto" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"></path>
                        </svg>
                        <span class="text-xs sm:text-sm">Assistant</span>
                        <span aria-hidden="true" class="bg-transparent absolute inset-x-0 bottom-0 h-0.5"></span>
                    </div>
                </nav>
            </div>

            <div class="my-5">
                <IdentityAssets
                    v-if="isShowingAssets"
                    :isFullScreen="isFullScreen"
                />

                <IdentitySend
                    v-if="isShowingSend"
                    :isFullScreen="isFullScreen"
                />

                <IdentityDeposit
                    v-if="isShowingDeposit"
                    :isFullScreen="isFullScreen"
                />

                <IdentityHistory
                    v-if="isShowingHistory"
                    :isFullScreen="isFullScreen"
                />

                <IdentityAssistant
                    v-if="isShowingAssistant"
                    :isFullScreen="isFullScreen"
                />
            </div>
        </div>

        <Bootstrap class="col-span-4" />

        <!-- <section class="px-5 py-2 col-span-3 flex flex-col gap-3 text-slate-200">
            <h2 class="text-2xl font-light">
                Are you ready for an <span class="text-3xl font-medium italic">Evolution</span> in finance?
            </h2>

            <NuxtLink to="https://sansbank.org/bootstrap" target="_blank" class="text-xl text-blue-300 font-bold hover:underline">
                See what we're building at Sansbank
            </NuxtLink>
        </section> -->
    </main>
</template>

<script setup lang="ts">
/* Import modules. */
import numeral from 'numeral'

import { DashPlatformSDK } from 'dash-platform-sdk'

// FOR DEV PURPOSES ONLY
const isFullScreen = true

/* Initialize stores. */
import { useProfileStore } from '@/stores/profile'
import { useSystemStore } from '@/stores/system'
import { useIdentityStore } from '@/stores/identity'
const Profile = useProfileStore()
const System = useSystemStore()
const Identity = useIdentityStore()

const tokens = ref(null)

const isShowingAssets = ref(false)
const isShowingDeposit = ref(false)
const isShowingSend = ref(false)
const isShowingHistory = ref(false)
const isShowingAssistant = ref(false)

const displayBalance = computed(() => {
    /* Validate asset. */
    if (!Identity.asset || !Identity.asset.amount) {
        return '0.00'
    }

    let decimalValue
    let bigIntValue

    if (Identity.asset.group === '0') {
        decimalValue = Identity.asset.satoshis * BigInt(1e4)
    } else {
        /* Validate amount type. */
        if (typeof Identity.asset.amount !== 'bigint') {
            decimalValue = BigInt(0)
        } else {
            decimalValue = Identity.asset.amount * BigInt(1e4)
        }
        decimalValue = Identity.asset.amount * BigInt(1e4)
    }

    if (Identity.asset?.decimal_places > 0) {
        bigIntValue = decimalValue / BigInt(10**Identity.asset.decimal_places)
    } else {
        bigIntValue = decimalValue
    }

    return numeral(parseFloat(bigIntValue) / 1e4).format('0,0[.]00[0000]')
})

const displayBalanceUsd = computed(() => {
    /* Validate asset. */
    if (!Identity.asset || !Identity.asset.fiat || !Identity.asset.fiat.USD) {
        return '0.00'
    }

    /* Initialize locals. */
    let balanceUsd

    /* Set balance. */
    balanceUsd = Identity.asset.fiat.USD || 0.00

    /* Return formatted value. */
    return numeral(balanceUsd).format('$0,0.00[0000]')
})

const tokensBalanceUsd = computed(() => {
    let totalTokens = BigInt(0)
    let totalUsd = 0.0

    let decimals
    let fiat
    let tokenAmount
    let tokenUsd

    Object.keys(tokens.value).forEach(_tokenid => {
        decimals = 0 // FOR DEV PURPOSES ONLY
        tokenUsd = 0.00 // FOR DEV PURPOSES ONLY

        /* Set total tokens. */
        totalTokens += tokens.value[_tokenid]
        // console.log('TOTAL TOKENS', totalTokens)

        /* Calculate decimal value. */
        tokenAmount = totalTokens * BigInt(tokenUsd * 100) // convert to cents
        tokenAmount = tokenAmount / BigInt(1e6) // reduce to 4 decimals (+ restore cents)
        // console.log('TOKEN AMOUNT', tokenAmount)

        fiat = parseFloat(tokenAmount) / 1e4
        // console.log('FIAT AMOUNT', fiat)

        /* Add (fiat) value. */
        totalUsd += fiat
    })

    /* Return (fiat) value. */
    return '~' + numeral(totalUsd).format('$0,0.00')
})

/**
 * Set Tab
 */
const setTab = (_tab) => {
    /* Clear all tabs. */
    isShowingAssets.value = false
    isShowingSend.value = false
    isShowingDeposit.value = false
    isShowingHistory.value = false
    isShowingAssistant.value = false

    if (_tab === 'assets') {
        isShowingAssets.value = true
    }

    if (_tab === 'send') {
        isShowingSend.value = true
    }

    if (_tab === 'deposit') {
        isShowingDeposit.value = true
    }

    if (_tab === 'history') {
        isShowingHistory.value = true
    }

    if (_tab === 'assistant') {
        isShowingAssistant.value = true
    }
}

const init = async () => {
    /* Initialize locals. */
    let sdk
    let tokenid

    /* Handle network. */
    if (System.network === 'mainnet') {
        /* Initialize Dash Platform SDK. */
        sdk = new DashPlatformSDK({ network: 'mainnet' })

        /* Set token ID. */
        tokenid = 'DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd' // DUSD
    } else {
        /* Initialize Dash Platform SDK. */
        sdk = new DashPlatformSDK({ network: 'testnet' })

        /* Set token ID. */
        tokenid = '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz' // tDUSD
    }

    /* Set (default) tab. */
    setTab('assets')

const publicKeyId = 3 // 03 => Transfer (Critical)

if (typeof Identity.id === 'undefined' || Identity.id === null) {
    throw new Error('MUST provide an Identity to continue.')
}
console.log('Identity.id', typeof Identity.id, Identity.id)

const balance = await sdk.identities.getIdentityBalance(Identity.id)
console.log('CREDIT BALANCE', balance)
console.log('DASH BALANCE (approx)', balance / 100000000000n)


const tokenContractInfo = await sdk.tokens.getTokenContractInfo(tokenid)
const dataContract = await sdk.dataContracts.getDataContractByIdentifier(tokenContractInfo.dataContractId)

const tokenConfiguration = dataContract.tokens[tokenContractInfo.tokenContractPosition]
const conventions = tokenConfiguration.conventions

const baseSupply = tokenConfiguration.baseSupply
const maxSupply = tokenConfiguration.maxSupply
const decimals = conventions.decimals
const description = tokenConfiguration.description
const name = conventions.localizations['en'].singularForm

console.log(baseSupply, maxSupply, decimals, description, name)


console.log('IDENTITY (assets)', Identity.assets)
console.log('IDENTITY (assetid)', Identity.assetid)
console.log('IDENTITY (asset)', Identity.asset)

// watch(() => Identity.assets, (_assets) => {
//     console.log('ASSETS CHANGED', _assets)
// })
// watch(() => Identity.assetid, (_assetid) => {
//     console.log('ASSET ID CHANGED', _assetid)
// })
// watch(() => Identity.asset, (_asset) => {
//     console.log('ASSET CHANGED', _asset)
// })
}

onMounted(() => {
    // init()
    Identity.findIdentity()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
// })
</script>
