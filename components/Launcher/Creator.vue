<template>
    <div class="bg-stone-400">
        <div class="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 class="sr-only">Token Launcher</h2>

            <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                <div>
                    <div>
                        <h2 class="text-lg font-medium text-gray-900">
                            Token Launcher
                        </h2>

                        <div class="mt-4">
                            <label for="email-address" class="block text-sm/6 font-medium text-gray-700">Email address</label>
                            <div class="mt-2">
                                <input
                                    type="email"
                                    id="email-address"
                                    name="email-address"
                                    autocomplete="email"
                                    class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>

                    <LauncherTokenType />

                    <div class="mt-10 border-t border-gray-200 pt-10">
                        <h2 class="text-lg font-medium text-gray-900">Shipping information</h2>

                        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            <div>
                                <label for="first-name" class="block text-sm/6 font-medium text-gray-700">First name</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        id="first-name"
                                        name="first-name"
                                        autocomplete="given-name"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label for="last-name" class="block text-sm/6 font-medium text-gray-700">Last name</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        id="last-name"
                                        name="last-name"
                                        autocomplete="family-name"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="company" class="block text-sm/6 font-medium text-gray-700">Company</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        name="company"
                                        id="company"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="address" class="block text-sm/6 font-medium text-gray-700">Address</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        autocomplete="street-address"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="apartment" class="block text-sm/6 font-medium text-gray-700">Apartment, suite, etc.</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        name="apartment"
                                        id="apartment"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label for="city" class="block text-sm/6 font-medium text-gray-700">City</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autocomplete="address-level2"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label for="country" class="block text-sm/6 font-medium text-gray-700">Country</label>
                                <div class="mt-2 grid grid-cols-1">
                                    <select
                                        id="country"
                                        name="country"
                                        autocomplete="country-name"
                                        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                    <ChevronDownIcon class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" aria-hidden="true" />
                                </div>
                            </div>

                            <div>
                                <label for="region" class="block text-sm/6 font-medium text-gray-700">State / Province</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        name="region"
                                        id="region"
                                        autocomplete="address-level1"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label for="postal-code" class="block text-sm/6 font-medium text-gray-700">Postal code</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        name="postal-code"
                                        id="postal-code"
                                        autocomplete="postal-code"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="phone" class="block text-sm/6 font-medium text-gray-700">Phone</label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        autocomplete="tel"
                                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

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
