<template>
    <main class="w-full flex flex-col gap-4">
        <section class="grid grid-cols-2 gap-3">
            <h2 class="col-span-2 text-2xl font-medium">
                I Want to Receive ↴
            </h2>

            <div @click="isShowingSans = false; isShowingDash = true" class="px-2 flex-1 h-24 sm:h-32 flex justify-center items-center border border-sky-700 rounded-lg shadow bg-gradient-to-b from-sky-500 to-sky-300">
                <div class="flex flex-col items-center">
                    <h2 class="text-2xl sm:text-3xl text-sky-900 font-medium whitespace-nowrap">
                        Dash
                    </h2>

                    <h3 class="text-sm sm:text-base text-sky-700 font-medium">
                        DASH
                    </h3>
                </div>
            </div>

            <div @click="isShowingDash = false; isShowingSans = true" class="px-2 flex-1 h-24 sm:h-32 flex justify-center items-center border border-lime-500 rounded-lg shadow bg-gradient-to-b from-lime-400 to-lime-200">
                <div class="flex flex-col items-center">
                    <h2 class="text-2xl sm:text-3xl text-lime-900 font-medium whitespace-nowrap">
                        Dash USD
                    </h2>

                    <h3 class="text-sm sm:text-base text-lime-700 font-medium">
                        DUSD
                    </h3>
                </div>
            </div>

            <div class="col-span-2 w-full flex flex-row gap-3">
                <div @click="isShowingSans = false; isShowingDash = true" class="px-2 flex-1 h-20 sm:h-24 flex justify-center items-center border border-rose-900 rounded-lg shadow bg-gradient-to-b from-rose-700 to-rose-500">
                    <div class="flex flex-col items-center">
                        <h2 class="text-sm sm:text-lg text-rose-100 font-medium whitespace-nowrap">
                            Popular Token
                        </h2>

                        <h3 class="text-xs sm:text-sm text-rose-50 font-medium">
                            POP
                        </h3>
                    </div>
                </div>

                <div @click="isShowingSans = false; isShowingDash = true" class="flex-1 h-20 sm:h-24 flex justify-center items-center border border-violet-400 rounded-lg shadow bg-gradient-to-b from-violet-300 to-violet-100">
                    <div class="flex flex-col items-center">
                        <h2 class="text-sm sm:text-lg text-violet-900 font-medium whitespace-nowrap">
                            Famous Token
                        </h2>

                        <h3 class="text-xs sm:text-sm text-violet-700 font-medium">
                            FAME
                        </h3>
                    </div>
                </div>

                <div @click="isShowingSans = false; isShowingDash = true" class="flex-1 h-20 sm:h-24 flex justify-center items-center border border-yellow-500 rounded-lg shadow bg-gradient-to-b from-yellow-400 to-yellow-200">
                    <div class="flex flex-col items-center">
                        <h2 class="text-sm sm:text-lg text-yellow-900 font-medium whitespace-nowrap">
                            Sansfiat
                        </h2>

                        <h3 class="text-xs sm:text-sm text-yellow-700 font-medium">
                            SANS
                        </h3>
                    </div>
                </div>
            </div>
        </section>

        <div v-if="!isShowingSans && !isShowingDash" class="mx-10 my-3 border-t border-gray-300" />

        <section v-if="!isShowingSans && !isShowingDash" class="-mt-3 flex flex-col gap-3">
            <p class="px-3 text-xs sm:text-sm text-gray-500">
                Don't see your asset listed above?
                Not a problem.
                Search from <span class="text-indigo-500 font-medium">more than 400+</span> assets below.
            </p>

            <input
                type="text"
                placeholder="Search all supported assets"
                v-model="search"
                disabled
                class="px-3 py-1 w-full h-16 sm:h-20 border-b-4 border-sky-200 bg-gray-800 text-xl sm:text-2xl text-gray-300 rounded shadow focus:outline-none"
            />
        </section>

        <section v-if="isShowingSans || isShowingDash" class="grid grid-cols-2 gap-y-2">
            <div class="col-span-2 pb-3 flex justify-center">
                <span class="text-sm text-sky-700 font-medium tracking-widest">
                    1.00 $SANS = 0.1337 $DASH
                </span>
            </div>

            <h4 class="w-fit pr-3 py-1 flex items-center gap-1 text-xs sm:text-sm cursor-help">
                Slippage

                <svg class="w-4 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
            </h4>
            <h4 class="w-fit pl-3 py-1 flex place-self-end items-center justify-end gap-1 text-xs sm:text-sm text-blue-500 cursor-pointer hover:scale-105 duration-200 ease-in-out">
                Auto (1%)

                <svg class="w-3 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"></path>
                </svg>
            </h4>

            <h4 class="w-fit pr-3 py-1 flex items-center gap-1 text-xs sm:text-sm cursor-help">
                Price impact

                <svg class="w-4 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
            </h4>
            <h4 class="w-fit pl-3 py-1 flex place-self-end items-center justify-end gap-1 text-xs sm:text-sm cursor-default">
                &lt; 0.1%
            </h4>

            <h4 class="w-fit pr-3 py-1 flex items-center gap-1 text-xs sm:text-sm cursor-help">
                Receiving address

                <svg class="w-4 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
            </h4>
            <h4 class="w-fit pl-3 py-1 flex place-self-end items-center justify-end gap-1 text-xs sm:text-sm text-blue-500 cursor-pointer hover:scale-105 duration-200 ease-in-out">
                0x255824...9788997d

                <svg class="w-3 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                </svg>
            </h4>

            <h4 class="w-fit pr-3 py-1 flex items-center gap-1 text-xs sm:text-sm cursor-help">
                Min. quantity

                <svg class="w-4 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
            </h4>
            <h4 class="w-fit pl-3 py-1 flex place-self-end items-center justify-end gap-1 text-xs sm:text-sm cursor-default">
                3.92159754
            </h4>

            <h4 class="w-fit pr-3 py-1 flex items-center gap-1 text-xs sm:text-sm cursor-help">
                Transaction fee

                <svg class="w-4 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
            </h4>
            <h4 class="w-fit pl-3 py-1 flex place-self-end items-center justify-end gap-1 text-xs sm:text-sm cursor-default">
                {{ isShowingSans ? '0.01% - 1.0%' : '' }}
                {{ isShowingDash ? '2.9%' : '' }}
            </h4>

            <h4 class="w-fit pr-3 py-1 flex items-center gap-1 text-xs sm:text-sm cursor-help">
                Blockchain fees

                <svg class="w-4 h-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
            </h4>
            <h4 class="w-fit pl-3 py-1 flex place-self-end items-center justify-end gap-1 text-xs sm:text-sm cursor-default">
                $1.30
            </h4>
        </section>
    </main>
</template>

<script setup>
import { ref } from 'vue'
// import numeral from 'numeral'

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

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })

</script>
