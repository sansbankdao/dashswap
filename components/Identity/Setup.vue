<template>
    <main class="p-3 flex flex-col gap-6">
        <section class="flex flex-col gap-5">
            <p class="px-3 py-2 bg-yellow-100 text-base font-medium border-2 border-yellow-200 rounded-lg shadow-md">
                Welcome to your DashSwap identity.
                Click the button below to create a NEW Identity and begin trading.
            </p>

            <div @click="createIdentity" class="cursor-pointer px-3 py-2 text-2xl text-blue-100 font-medium bg-blue-500 border-2 border-blue-700 rounded-lg shadow hover:bg-blue-400">
                Create New Identity
            </div>
        </section>

        <section class="mt-10 flex flex-col gap-5">
            <p class="px-3 py-2 bg-yellow-100 text-base font-medium border-2 border-yellow-200 rounded-lg shadow-md">
                Import your existing Identity into DashSwap.
            </p>

            <textarea
                placeholder="Seed #1 Seed #2 Seed #3 ..."
                v-model="mnemonic"
                disabled
                class="px-3 py-2 border-2 border-amber-500 rounded-lg shadow"
            />

            <div>
                <time datetime="2021-08" class="flex items-center text-lg font-semibold text-sky-600 dark:text-sky-200">
                    <svg viewBox="0 0 4 4" aria-hidden="true" class="mr-4 size-1 flex-none">
                        <circle r="2" cx="2" cy="2" fill="currentColor" />
                    </svg>
                    Choose One or the Other
                    <div aria-hidden="true" class="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0 dark:bg-white/15"></div>
                </time>
            </div>

            <input
                placeholder="Enter your Identity ID"
                v-model="identityid"
                class="px-3 py-2 border-2 border-amber-500 rounded-lg shadow"
            />

            <input
                placeholder="Enter your AUTHORITY private key"
                v-model="pkAuthority"
                class="px-3 py-2 border-2 border-amber-500 rounded-lg shadow"
            />

            <input
                placeholder="Enter your TRANSFER private key"
                v-model="pkTransfer"
                class="px-3 py-2 border-2 border-amber-500 rounded-lg shadow"
            />

            <div @click="importIdentity" class="cursor-pointer px-3 py-2 text-2xl text-blue-100 font-medium bg-blue-500 border-2 border-blue-700 rounded-lg shadow hover:bg-blue-400">
                Import Existing Identity
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
/* Initialize stores. */
import { useIdentityStore } from '@/stores/identity'
const Identity = useIdentityStore()

const mnemonic = ref(null)
const identityid = ref(null)
const pkAuthority = ref(null)
const pkTransfer = ref(null)

const createIdentity = () => {
    // NOTE: This confirmation is NOT REQUIRED for single-application
    //       wallet integration(s), and can be SAFELY removed.
    if (confirm('Before you continue, please close ALL other DashSwap browser windows. Failure to do so may result in LOSS OF ASSETS!\n\nWould you like to continue creating a NEW Identity?')) {
        /* Create a new wallet. */
        // Identity.createIdentity()
        document.location = '/wallet/create'
    }
}

const importIdentity = () => {
    // NOTE: This confirmation is NOT REQUIRED for single-application
    //       wallet integration(s), and can be SAFELY removed.
    if (confirm('Before you continue, please close ALL other DashSwap browser windows. Failure to do so may result in LOSS OF ASSETS!\n\nWould you like to continue importing an EXISTING Identity?')) {
        /* Set/save mnemonic. */
        // NOTE: Will save `entropy` to the local storage.
        Identity.setMnemonic(mnemonic.value)

        /* Set/save Identity ID. */
        // NOTE: Will save `entropy` to the local storage.
        Identity.setIdentity(identityid.value)

        /* Set/save AUTHORITY private key. */
        // NOTE: Will save `entropy` to the local storage.
        Identity.setPkAuthority(pkAuthority.value)

        /* Set/save TRANSFER private key. */
        // NOTE: Will save `entropy` to the local storage.
        Identity.setPkTransfer(pkTransfer.value)
    }
}

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
