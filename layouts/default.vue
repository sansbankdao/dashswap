<template>
    <main class="min-h-[100vh] flex items-center justify-center p-2 bg-violet-950">

        <section class="flex flex-col md:flex-row w-full max-w-full md:max-w-7xl border border-gray-600 rounded-2xl overflow-hidden shadow-2xl relative bg-black mb-12 md:mb-4 lg:mb-20 xl:mb-4">
            <div class="px-8 md:px-6 pt-6 pb-6 lg:pb-16 xl:pb-6 flex flex-col justify-between w-full md:w-2/5 border-b md:border-b-0 md:border-r border-gray-600">
                <Profile />
                <NetworkManager />
            </div>

            <div class="w-full md:w-4/5 p-0">
                <div class="min-h-full lg:h-[90vh] flex flex-col lg:overflow-y-scroll">

<!-- Dynamic Content SLOT Begins Here-->
                    <slot />
<!-- Dynamic Content SLOT Ends Here-->

                </div>
            </div>

        </section>

        <footer class="fixed md:absolute bottom-0 left-0 right-0 w-full flex justify-center bg-black pt-2 pb-2 lg:pb-5 xl:pb-2 rounded-t-2xl lg:rounded-t-3xl border-t border-stone-700">
            <span class="text-slate-300 text-center text-sm tracking-wider">
                ⟡˙⋆ DashSwap was built with
                <svg class="inline size-5 text-rose-400" data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z"></path>
                </svg>
                by <a href="https://sansbank.org/bootstrap" target="_blank" title="Sansbank Bootstrap" class="text-rose-400 hover:text-rose-500">
                    Sansbank
                </a>
                <span class="hidden sm:inline">for the DASH Evolution</span> ⋆˙⟡
            </span>
        </footer>
    </main>
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

/* Initialize stores. */
// import { useWalletStore } from '@/stores/wallet'
import { useSystemStore } from '@/stores/system'
// const Wallet = useWalletStore()
const System = useSystemStore()

const init = async () => {
    console.log('init...')

    /* Initialize system. */
    System.init()
}

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>

<style>

    /* Hide the radio buttons */
    .tab-radio {
        @apply absolute opacity-0 pointer-events-none;
    }

    /* Default state - hide all tab content */
    .tab-content {
        @apply hidden opacity-0;
        transition: opacity 0.3s ease-in-out;
    }

    /* Default state for tab links */
    .tab-link {
        @apply border-b-2 border-transparent bg-transparent;
        transition: background-color 0.2s ease-in-out;
    }

    /* When tab1 is checked, show content1 and highlight its tab */
    #tab1:checked ~ * #content1 {
        @apply block opacity-100;
    }
    #tab1:checked ~ .flex .tab-link:nth-child(1) {
        @apply border-b-2 border-sky-700;
    }

    /* When tab2 is checked, show content2 and highlight its tab */
    #tab2:checked ~ * #content2 {
        @apply block opacity-100;
    }
    #tab2:checked ~ .flex .tab-link:nth-child(2) {
        @apply border-b-2 border-sky-700;
    }

    /* When tab3 is checked, show content3 and highlight its tab */
    #tab3:checked ~ * #content3 {
        @apply block opacity-100;
    }
    #tab3:checked ~ .flex .tab-link:nth-child(3) {
        @apply border-b-2 border-sky-700;
    }

    /* When tab4 is checked, show content4 and highlight its tab */
    #tab4:checked ~ * #content4 {
        @apply block opacity-100;
    }
    #tab4:checked ~ .flex .tab-link:nth-child(4) {
        @apply border-b-2 border-sky-700;
    }

    /* When tab5 is checked, show content5 and highlight its tab */
    #tab5:checked ~ * #content5 {
        @apply block opacity-100;
    }
    #tab5:checked ~ .flex .tab-link:nth-child(5) {
        @apply border-b-2 border-sky-700;
    }

    /* When tab6 is checked, show content6 and highlight its tab */
    #tab6:checked ~ * #content6 {
        @apply block opacity-100;
    }
    #tab6:checked ~ .flex .tab-link:nth-child(6) {
        @apply border-b-2 border-sky-700;
    }

    /* When tab7 is checked, show content7 and highlight its tab */
    #tab7:checked ~ * #content7 {
        @apply block opacity-100;
    }
    #tab7:checked ~ .flex .tab-link:nth-child(7) {
        @apply border-b-2 border-sky-700;
    }

</style>
