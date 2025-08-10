<template>
    <main class="tab-controls">
        <input type="radio" id="tab1" name="tabs" class="tab-radio" checked />
        <input type="radio" id="tab2" name="tabs" class="tab-radio" />
        <input type="radio" id="tab3" name="tabs" class="tab-radio" />
        <input type="radio" id="tab4" name="tabs" class="tab-radio" />
        <input type="radio" id="tab5" name="tabs" class="tab-radio" />
        <input type="radio" id="tab6" name="tabs" class="tab-radio" />
        <input type="radio" id="tab7" name="tabs" class="tab-radio" />

        <div class="flex bg-black border-b border-gray-600 sticky top-0 z-10">
            <ContentLink contentId="tab1" contentName="Read Me" contentUrl="/" />
            <ContentLink contentId="tab2" contentName="Gallery" contentUrl="/gallery" />
            <ContentLink contentId="tab3" contentName="Swap" contentUrl="/swap" />
            <ContentLink contentId="tab4" contentName="Pay" contentUrl="/pay" />
            <ContentLink contentId="tab5" contentName="swap.jsx" contentUrl="/frontend" />
            <ContentLink contentId="tab6" contentName="swap.py" contentUrl="/backend" />
            <ContentLink contentId="tab7" contentName="Need help?" contentUrl="/help" />
        </div>

        <div class="p-6 flex-grow overflow-y-auto bg-black">
            <div id="content1" class="tab-content"><ContentReadme /></div>
            <div id="content4" class="tab-content"><ContentGallery /></div>
            <div id="content2" class="tab-content"><ContentSwap /></div>
            <div id="content3" class="tab-content"><ContentPay /></div>
            <div id="content5" class="tab-content"><ContentFrontend /></div>
            <div id="content6" class="tab-content"><ContentBackend /></div>
            <div id="content7" class="tab-content"><ContentHelp /></div>
        </div>
    </main>
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
