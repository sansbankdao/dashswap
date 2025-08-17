<template>
    <main class="mt-10 border-t border-gray-200 pt-10">
        <h2 class="text-lg font-medium text-gray-900">
            Choose an Identity for Payment
        </h2>

        <fieldset class="mt-4">
            <legend class="sr-only">Payment type</legend>
            <div class="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                <div v-for="(paymentMethod, paymentMethodIdx) in paymentMethods" :key="paymentMethod.id" class="flex items-center">
                    <input
                        :id="paymentMethod.id"
                        name="payment-type"
                        type="radio"
                        :checked="paymentMethodIdx === 0"
                        class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                    />
                    <label :for="paymentMethod.id" class="ml-3 block text-sm/6 font-medium text-gray-700">{{ paymentMethod.title }}</label>
                </div>
            </div>
        </fieldset>

        <div class="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
            <div class="col-span-4">
                <label for="card-number" class="block text-sm/6 font-medium text-gray-700">
                    Identity
                </label>

                <div class="mt-2">
                    <input
                        type="text"
                        id="card-number"
                        name="card-number"
                        autocomplete="cc-number"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div class="col-span-4">
                <label for="name-on-card" class="block text-sm/6 font-medium text-gray-700">Name on card</label>
                <div class="mt-2">
                    <input
                        type="text"
                        id="name-on-card"
                        name="name-on-card"
                        autocomplete="cc-name"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div class="col-span-3">
                <label for="expiration-date" class="block text-sm/6 font-medium text-gray-700">Expiration date (MM/YY)</label>
                <div class="mt-2">
                    <input
                        type="text"
                        name="expiration-date"
                        id="expiration-date"
                        autocomplete="cc-exp"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <label for="cvc" class="block text-sm/6 font-medium text-gray-700">CVC</label>
                <div class="mt-2">
                    <input
                        type="text"
                        name="cvc"
                        id="cvc"
                        autocomplete="csc"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import { CheckCircleIcon, TrashIcon } from '@heroicons/vue/20/solid'

const paymentMethods = [
    { id: 'credit-card', title: 'Credit card' },
    { id: 'paypal', title: 'PayPal' },
    { id: 'etransfer', title: 'eTransfer' },
]
</script>
