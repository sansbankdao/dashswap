<template>
    <div class="bg-gradient-to-r from-green-950 to-lime-700">
        <div class="mx-auto max-w-2xl px-3 pb-12 pt-8 sm:px-4 lg:max-w-7xl">
            <h2 class="sr-only">Token Launcher</h2>

            <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                <div>
                    <legend class="text-2xl font-medium text-green-100">
                        Token Design Studio
                    </legend>

                    <LauncherTokenType :tokenType="tokenType" @tokenType="handleTokenType" />

                    <LauncherMetadata v-if="tokenType === 'FT'" />
                    <LauncherAdvanced v-if="tokenType === 'FT'" />
                    <!-- <LauncherDeliveryMethod v-if="tokenType === 'FT'" /> -->

                    <LauncherCollectible v-if="tokenType === 'NFT'" />

                    <section v-if="!tokenType" class="p-5">
                        <h2 class="text-6xl font-light text-lime-800 dark:text-lime-200 italic tracking-wider">
                            Select A Token Type To Get Started...
                        </h2>
                    </section>
                </div>

                <LauncherSummary />
                <!-- <LauncherPayment v-if="tokenType" /> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* Import modules. */

const tokenType = ref()

const handleTokenType = (_tokenType: string) => {
    // console.log('PARENT SEZ TOKEN CHANGED', _tokenType)
    tokenType.value = _tokenType
}

</script>
