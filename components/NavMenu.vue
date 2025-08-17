<template>
    <div>
        <div class="grid grid-cols-1 sm:hidden">
            <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
            <select
                aria-label="Select a tab"
                class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-slate-500 outline outline-1 -outline-offset-1 outline-slate-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-400"
            >
                <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">
                    {{ tab.name }}
                </option>
            </select>

            <ChevronDownIcon class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-slate-500" aria-hidden="true" />
        </div>

        <div class="hidden sm:block">
            <div class="border-b border-slate-200">
                <nav class="pl-3 -mb-px flex space-x-8" aria-label="Tabs">
                    <a
                        v-for="tab in tabs"
                        :key="tab.name"
                        :href="tab.href"
                        :class="[tab.current ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-200 hover:border-slate-50 hover:text-slate-400', 'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium']"
                        :aria-current="tab.current ? 'page' : undefined"
                    >
                        <component :is="tab.icon" :class="[tab.current ? 'text-sky-300' : 'text-slate-400 group-hover:text-slate-500', '-ml-0.5 mr-2 size-5']" aria-hidden="true" />

                        <span>
                            {{ tab.name }}
                        </span>
                    </a>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import {
    ArrowsRightLeftIcon,
    BookOpenIcon,
    CreditCardIcon,
    InformationCircleIcon,
    RectangleGroupIcon,
    SparklesIcon,
    Square3Stack3DIcon,
} from '@heroicons/vue/20/solid'

const route = useRoute()
console.log('NAV ROUTE', route)
const path = route.path.slice(1)
console.log('NAV PATH', path)

const tabs = [
    { name: 'Read Me', href: '/', icon: BookOpenIcon, current: path === '' ? true : false },
    { name: 'Gallery', href: '/gallery', icon: RectangleGroupIcon, current: path === 'gallery' ? true : false },
    { name: 'Swap', href: '/swap', icon: ArrowsRightLeftIcon, current: path === 'swap' ? true : false },
    { name: 'Pay', href: '/pay', icon: CreditCardIcon, current: path === 'pay' ? true : false },
    { name: 'swap.jsx', href: '/frontend', icon: SparklesIcon, current: path === 'frontend' ? true : false },
    { name: 'swap.py', href: '/backend', icon: Square3Stack3DIcon, current: path === 'backend' ? true : false },
    { name: 'Need help?', href: '/help', icon: InformationCircleIcon, current: path === 'help' ? true : false },
]
</script>
