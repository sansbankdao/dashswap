<template>
    <main class="mt-10 border-t border-gray-200 pt-10">
        <fieldset>
            <legend class="text-lg font-medium text-gray-900">
                Delivery Method
            </legend>

            <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <label
                    v-for="deliveryMethod in deliveryMethods"
                    :key="deliveryMethod.id"
                    :aria-label="deliveryMethod.title"
                    :aria-description="`${deliveryMethod.turnaround} for ${deliveryMethod.price}`"
                    class="group relative flex rounded-lg border border-gray-300 bg-white p-4 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25 has-[:checked]:outline has-[:focus-visible]:outline has-[:checked]:outline-2 has-[:focus-visible]:outline-[3px] has-[:checked]:-outline-offset-2 has-[:focus-visible]:-outline-offset-1 has-[:checked]:outline-sky-600"
                >
                    <input type="radio" name="delivery-method" :value="deliveryMethod.id" :checked="deliveryMethod === deliveryMethods[0]" class="absolute inset-0 appearance-none focus:outline focus:outline-0" />
                    <div class="flex-1">
                        <span class="block text-sm font-medium text-gray-900">{{ deliveryMethod.title }}</span>
                        <span class="mt-1 block text-sm text-gray-500">{{ deliveryMethod.turnaround }}</span>
                        <span class="mt-6 block text-sm font-medium text-gray-900">{{ deliveryMethod.price }}</span>
                    </div>
                    <CheckCircleIcon class="invisible size-5 text-sky-600 group-has-[:checked]:visible" aria-hidden="true" />
                </label>
            </div>
        </fieldset>
    </main>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import { CheckCircleIcon, TrashIcon } from '@heroicons/vue/20/solid'

const deliveryMethods = [
    { id: 1, title: 'Creator', turnaround: '4–10 business days', price: '$5.00' },
    { id: 2, title: '3rd-Party', turnaround: '2–5 business days', price: '$16.00' },
]
</script>
