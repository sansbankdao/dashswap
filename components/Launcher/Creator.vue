<template>
    <div class="bg-stone-600">
        <div class="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 class="sr-only">Token Launcher</h2>

            <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                <div>
                    <LauncherTokenType />

                    <LauncherMetadata />

                    <LauncherAdvanced />

                    <LauncherDeliveryMethod />

                    <LauncherPayment />
                </div>

                <LauncherSummary />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import { CheckCircleIcon, TrashIcon } from '@heroicons/vue/20/solid'

const products = [
    {
        id: 1,
        title: 'Basic Tee',
        href: '#',
        price: '$32.00',
        color: 'Black',
        size: 'Large',
        imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/checkout-page-02-product-01.jpg',
        imageAlt: `Front of men's Basic Tee in black.`,
    },
    {
        id: 2,
        title: 'Basic Tee',
        href: '#',
        price: '$32.00',
        color: 'Sienna',
        size: 'Large',
        imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/checkout-page-02-product-02.jpg',
        imageAlt: `Front of men's Basic Tee in sienna.`,
    },
]

const deliveryMethods = [
    { id: 1, title: 'Standard', turnaround: '4–10 business days', price: '$5.00' },
    { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
]

const paymentMethods = [
    { id: 'credit-card', title: 'Credit card' },
    { id: 'paypal', title: 'PayPal' },
    { id: 'etransfer', title: 'eTransfer' },
]
</script>
