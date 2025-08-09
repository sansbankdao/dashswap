<template>
    <div class="mx-auto max-w-7xl px-6 py-6 sm:py-8 lg:px-8 lg:py-10">
        <div class="mx-auto max-w-4xl">
            <h2 class="text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
                Frequently asked questions
            </h2>

            <dl class="mt-16 divide-y divide-slate-100/10">
                <Disclosure as="div" v-for="faq in faqs" :key="faq.question" class="py-6 first:pt-0 last:pb-0" v-slot="{ open }">
                    <dt>
                        <DisclosureButton class="flex w-full items-start justify-between text-left text-slate-100">
                            <span class="text-base/7 font-semibold">
                                {{ faq.question }}
                            </span>

                            <span class="ml-6 flex h-7 items-center">
                                <PlusSmallIcon v-if="!open" class="size-6" aria-hidden="true" />
                                <MinusSmallIcon v-else class="size-6" aria-hidden="true" />
                            </span>
                        </DisclosureButton>
                    </dt>

                    <DisclosurePanel as="dd" class="mt-2 pr-12">
                        <p class="text-base/7 text-gray-600">
                            {{ faq.answer }}
                        </p>
                    </DisclosurePanel>
                </Disclosure>
            </dl>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/vue/24/outline'

const faqs = [
    {
        question: `Is this platform 100% non-custodial?`,
        answer: `Yes! All wallets are client-side and retain 100% control of ALL private keys used to manage assets.`,
    },
    {
        question: `How much does it cost for $TOKEN swaps?`,
        answer: `Token swaps incur a flat fee of 0.3% (or 30 basis points) for each swap.`,
    },
    {
        question: `How much does it cost for NFT swaps?`,
        answer: `NFT swaps are 100% FREE for all assets listed on the platform.`,
    },
    {
        question: `How does Community Moderation work?`,
        answer: `70% of the User's Escrow is paid out to Reports on a rolling scale (based on time of report).`,
    },
    {
        question: `How much does it cost to use a Paymaster?`,
        answer: `NA`,
    },
    {
        question: `Why are there no annoying ads everywhere?`,
        answer: `NA`,
    },
    {
        question: `How do I become a Liquidity Provider?`,
        answer: `NA`,
    },
]
</script>
