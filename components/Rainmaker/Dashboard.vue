<template>
    <main class="h-full p-3 bg-fuchsia-950 text-slate-200">
        <header>
            <h1 class="text-5xl font-medium text-slate-200">
                Rainmaker ☔
            </h1>

            <h2 class="pl-1 text-xl font-medium">
                Airdrop Coins and Collectibles to your online communities
            </h2>
        </header>

        <fieldset class="mt-5">
            <legend class="pl-3 text-xs font-medium tracking-widest text-gray-400 uppercase">
                Choose a Manager
            </legend>

            <div class="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <!-- Active: "border-indigo-600 ring-2 ring-indigo-600", Not Active: "border-gray-300" -->
                <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none border-indigo-600 ring-2 ring-indigo-600">
                    <input type="radio" name="project-type" value="Existing Customers" class="sr-only" aria-labelledby="project-type-1-label" aria-describedby="project-type-1-description-0 project-type-1-description-1" />
                    <span class="flex flex-1">
                        <span class="flex flex-col">
                            <span id="project-type-1-label" class="block text-lg font-medium text-gray-900">
                                Campaign Manager
                            </span>

                            <span id="project-type-1-description-0" class="-mt-1 flex items-center text-xs text-gray-500 italic">
                                Last campaign updated 2 minutes ago
                            </span>

                            <span v-if="campaigns" id="project-type-0-description-1" class="mt-2 text-xl font-medium text-slate-200">
                                <span class="text-3xl text-fuchsia-500">{{campaigns.length}}</span> campaigns
                            </span>
                            <span v-else id="project-type-0-description-1" class="mt-2 text-xl font-medium text-slate-200 italic">
                                loading...
                            </span>
                        </span>
                    </span>
                    <!-- Not Checked: "invisible" -->
                    <svg class="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                    </svg>
                    <!--
                Active: "border", Not Active: "border-2"
                Checked: "border-indigo-600", Not Checked: "border-transparent"
            -->
                    <span class="pointer-events-none absolute -inset-px rounded-lg border border-indigo-600" aria-hidden="true"></span>
                </label>

                <!-- Active: "border-indigo-600 ring-2 ring-indigo-600", Not Active: "border-gray-300" -->
                <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                    <input type="radio" name="project-type" value="Newsletter" class="sr-only" aria-labelledby="project-type-0-label" aria-describedby="project-type-0-description-0 project-type-0-description-1" />
                    <span class="flex flex-1">
                        <span class="flex flex-col">
                            <span id="project-type-0-label" class="block text-lg font-medium text-gray-900">
                                Identity Manager
                            </span>

                            <span id="project-type-0-description-0" class="-mt-1 flex items-center text-xs text-gray-500 italic">
                                Last identity added an hour ago
                            </span>

                            <span id="project-type-0-description-1" class="mt-2 text-xl font-medium text-slate-200">
                                <span class="text-3xl text-fuchsia-500">69</span> Identities
                            </span>
                        </span>
                    </span>
                    <!-- Not Checked: "invisible" -->
                    <svg class="h-5 w-5 text-indigo-600 invisible" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                    </svg>
                    <!--
                Active: "border", Not Active: "border-2"
                Checked: "border-indigo-600", Not Checked: "border-transparent"
            -->
                    <span class="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent" aria-hidden="true"></span>
                </label>
            </div>
        </fieldset>

        <div class="my-5 px-3 sm:flex sm:items-center">
            <div class="mt-4 mx-5 sm:mt-0 sm:flex-none">
                <button
                    @click="isAddingCampaign = true"
                    type="button"
                    class="block rounded-md bg-lime-600 px-3 py-2 text-center text-lg font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
                >
                    Add Campaign
                </button>
            </div>
        </div>

        <div class="my-5 px-5 border-t border-gray-300" />

        <section class="mt-5">
            <legend class="pl-3 text-xs font-medium tracking-widest text-gray-400 uppercase">
                Select a Campaign
            </legend>

            <div class="mt-3 flex flex-col gap-6">
                <NuxtLink
                    v-for="campaign of sortedCampaigns" :key="campaign.id"
                    :to="'/rainmaker/' + campaign.id"
                    class="px-5 py-5 flex flex-row items-start bg-fuchsia-50 border-2 border-fuchsia-300 rounded-xl shadow hover:bg-fuchsia-100"
                >
                    <img
                        class="h-16 w-auto lg:h-20 rounded-full object-cover"
                        :src="makeBlockie(campaign.id)"
                        :alt="campaign.id"
                    />

                    <section class="ml-4 flex flex-col gap-2">
                        <h3 class="text-xl font-medium text-gray-500 tracking-tighter">
                            {{campaign?.title}}
                        </h3>

                        <div class="text-gray-500 truncate">
                            Campaign Id: {{campaign?.id}}
                        </div>

                        <div class="text-gray-500 truncate">
                            Owner Id: {{campaign?.ownerid}}
                        </div>

                        <div class="text-gray-500 truncate">
                            # of receivers {{Object.keys(campaign?.receivers || {}).length}}
                        </div>

                        <div class="text-gray-500 truncate">
                            Completed? {{campaign?.isComplete}}
                        </div>

                        <div class="text-gray-500 truncate">
                            Created {{moment.unix(campaign?.createdAt).format('llll')}}
                        </div>

                        <div v-if="campaign?.updatedAt" class="text-gray-500 truncate">
                            Updated {{moment.unix(campaign?.updatedAt).format('llll')}}
                        </div>
                    </section>
                </NuxtLink>
            </div>
        </section>

<section class="p-5">
    <button @click="runBootstrap" class="px-5 py-3 text-sky-800 font-bold bg-sky-200 hover:bg-sky-800 hover:text-sky-200">
        RUN BOOTSTRAP
    </button>

<pre v-if="status" class="m-3">{{status}}</pre>
<pre v-if="bootstrap" class="m-3">{{bootstrap}}</pre>
</section>

    </main>

    <!-- <RainmakerAddCampaign
        v-if="isAddingCampaign"
        @close="isAddingCampaign = false"
        :campaign="Rainmaker.campaign"
    /> -->
</template>

<script setup lang="ts">
/* Import modules. */
import makeBlockie from 'ethereum-blockies-base64'
import moment from 'moment'

/* Initialize stores. */
import { useIdentityStore } from '@/stores/identity'
import { useProfileStore } from '@/stores/profile'
import { useRainmakerStore } from '@/stores/rainmaker'
// import HelpIdentity from '../Help/Identity.vue'
const Identity = useIdentityStore()
const Profile = useProfileStore()
const Rainmaker = useRainmakerStore()

const campaign = ref(null)
const campaigns = ref(null)
const profiles = ref(null)
const txidem = ref(null)

const bootstrap = ref()
const status = ref()

const isAddingCampaign = ref(false)

const sortedCampaigns = computed(() => {
    /* Validate campaigns. */
    if (!campaigns.value) {
        return []
    }

    /* Sort campaigns. */
    let sorted = campaigns.value.sort((a, b) => {
        return b.updatedAt - a.updatedAt
    })

    /* Return (sorted) campaigns. */
    return sorted
})

/* Set constant. */
const SANS_BAG_VALUE = BigInt(1000 * 10**8)

const runBootstrap = async () => {
    /* Initialize locals. */
    let error

    bootstrap.value = null
    status.value = null

    const result = await Rainmaker.runBootstrap()
// console.log('RAINMAKER (result)', result)
    bootstrap.value = result

    /* Initialize Identity. */
    await Identity.init()

// FIXME FOR DEVELOPMENT PURPOSES ONLY
    /* Set (active) asset to SANS. */
    Identity.setAsset('AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB')

    /* Validate result. */
    if (typeof result !== 'undefined' && result !== null && result.platformid) {
        const assetName = Identity?.asset?.name
        console.log('READY TO SEND', assetName)
        status.value = `READY TO SEND ${assetName}`

        // LET'S VERIFY WE HAVE THE CORRECT CAMPAIGN
        if (assetName === 'Sansnote') {
            const response = await Identity
                .transfer(result.platformid, SANS_BAG_VALUE)
                .catch(err => {
                    console.error(err)
                    error = err
                    status.value = `ERROR: ${JSON.stringify(err)}`
                })
console.log('AIRDROP RESPONSE', response)

            /* Validate status (has no errors). */
            if (typeof error === 'undefined' || error === null) {
                status.value = `RESPONSE: ${JSON.stringify(response)}`
            }
        }
    }
}

const reset = () => {
    // TODO
}

const init = async () => {
    /* Initialize locals. */
    let response

    /* Initialize globals. */
    campaigns.value = []

    /* Request campaigns. */
    // response = await $fetch('/api/rainmaker/campaigns', {
    //     method: 'POST',
    //     body: {
    //         sessionid: Profile.sessionid,
    //     },
    // }).catch(err => console.error(err))
    // console.log('RAINMAKER (campaigns):', response)

    /* Set campaigns. */
    // campaigns.value = response

    const campaign1 = new Array(69)
    campaign1.fill()
    const campaign2 = new Array(50)
    campaign2.fill()

    campaigns.value.push({
        id: '36b4f6a8-d0fc-4b18-91c3-e83b169b52eb',
        ownerid: 'BkEqcgfmNFY5TEy2atDhhFsDY1NZ6oPa4XPrDGuuWLVT',
        title: 'Sansnote (SANS) Community Airdrop',
        receivers: campaign1,
        isComplete: true,
        createdAt: 1755688985,
    })

    campaigns.value.push({
        id: 'e56f48da-66c1-4894-99a5-6f29bfef2f5b',
        ownerid: 'BkEqcgfmNFY5TEy2atDhhFsDY1NZ6oPa4XPrDGuuWLVT',
        title: 'Sansnote (SANS) Validator Airdrop',
        receivers: campaign2,
        isComplete: true,
        createdAt: 1756226004,
    })
}

onMounted(() => {
    /* Initialize Rainmaker (store). */
    // Rainmaker.init()

    /* Initialize campaigns. */
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
