<template>
    <main class="min-h-[100vh] flex items-center justify-center p-4">

        <section class="flex flex-col md:flex-row w-full max-w-full md:max-w-7xl border border-gray-600 rounded-2xl overflow-hidden shadow-2xl relative bg-black mb-12 md:mb-4 lg:mb-20 xl:mb-4">
            <div class="px-8 md:px-6 pt-6 pb-6 lg:pb-16 xl:pb-6 flex flex-col justify-between w-full md:w-2/5 border-b md:border-b-0 md:border-r border-gray-600">
                <Profile />
                <Contact />
            </div>

            <div class="w-full md:w-4/5 p-0">
                <div class="min-h-full h-[90vh] flex flex-col overflow-y-scroll">

<!-- Dynamic Content SLOT Begins Here-->
                    <slot />
<!-- Dynamic Content SLOT Ends Here-->

                </div>
            </div>

        </section>

        <footer class="fixed md:absolute bottom-0 left-0 right-0 w-full text-center bg-black pt-2 pb-2 lg:pb-5 xl:pb-2">
            ⟡˙⋆ built with ❤️ by <a href="https://sansbank.org" target="_blank" title="Sansbank DAO" class="text-rose-300 hover:text-rose-400">
                Sansbank DAO
            </a>
            for the DASH community ⋆˙⟡
        </footer>
    </main>
</template>

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
