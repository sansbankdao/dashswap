<template>
    <main>
        <fieldset>
            <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <label
                    v-for="token in tokenProtocols"
                    :key="token.id"
                    :aria-label="token.title"
                    :aria-description="`${token.type} for ${token.summary}`"
                    class="group relative flex rounded-lg border border-slate-300 bg-white p-3 has-[:disabled]:border-slate-400 has-[:disabled]:bg-slate-200 has-[:disabled]:opacity-25 has-[:checked]:outline has-[:focus-visible]:outline has-[:checked]:outline-2 has-[:focus-visible]:outline-[3px] has-[:checked]:-outline-offset-2 has-[:focus-visible]:-outline-offset-1 has-[:checked]:outline-sky-600"
                >
                    <input
                        type="radio"
                        :value="token.id"
                        v-model="tokenType"
                        class="absolute inset-0 appearance-none focus:outline focus:outline-0"
                    />

                    <div class="flex-1">
                        <span class="block text-2xl font-medium text-slate-900">
                            {{ token.title }}
                        </span>

                        <span class="mt-1 block text-xs text-slate-500 uppercase tracking-wider">
                            {{ token.type }}
                        </span>

                        <span class="mt-4 block text-sm font-medium text-slate-700 tracking-tighter">
                            {{ token.summary }}
                        </span>
                    </div>

                    <CheckCircleIcon class="absolute right-2 invisible size-6 text-sky-600 group-has-[:checked]:visible" aria-hidden="true" />
                </label>
            </div>
        </fieldset>
    </main>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import { CheckCircleIcon, TrashIcon } from '@heroicons/vue/20/solid'

/* Define props. */
const props = defineProps(['tokenType'])

/* Define emits. */
const emit = defineEmits(['tokenType'])

/* Initialize local handlers. */
const tokenType = ref()

/* Watch token type. */
watch(tokenType, (_new, _old) => {
    // console.log('TOKEN TYPE CHANGED', _new, _old)
    emit('tokenType', _new)
})

const tokenProtocols = [
    {
        id: 'FT',
        title: 'Coin',
        type: 'Fungible',
        summary: 'Create a new economy for your community'
    },
    {
        id: 'NFT',
        title: 'Collectible',
        type: 'Non-fungible',
        summary: 'Create unique artwork and multimedia'
    },
]
</script>
