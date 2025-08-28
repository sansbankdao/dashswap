<template>
    <div class="bg-gradient-to-r from-green-950 to-lime-700">
        <div class="mx-auto max-w-2xl px-3 pb-12 pt-8 sm:px-4 lg:max-w-7xl">
            <h2 class="sr-only">Asset Launcher</h2>

            <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                <div>
                    <legend class="text-2xl font-medium text-green-100">
                        Asset Design Studio
                    </legend>

                    <LauncherAssetType :assetType="assetType" @assetType="handleAssetType" />

                    <LauncherMetadata v-if="assetType === 'FT'" />
                    <LauncherAdvanced v-if="assetType === 'FT'" />
                    <!-- <LauncherDeliveryMethod v-if="assetType === 'FT'" /> -->

                    <LauncherCollectible v-if="assetType === 'NFT'" />

                    <section v-if="!assetType" class="p-5">
                        <h2 class="text-6xl font-light text-lime-800 dark:text-lime-200 italic tracking-wider">
                            Select A Token Type To Get Started...
                        </h2>
                    </section>
                </div>

                <LauncherSummary />
                <!-- <LauncherPayment v-if="assetType" /> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* Import modules. */

const assetType = ref()

const handleAssetType = (_assetType: string) => {
    // console.log('PARENT SEZ TOKEN CHANGED', _assetType)
    assetType.value = _assetType
}

</script>
