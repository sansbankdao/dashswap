<template>
    <div class="px-4 pt-4">
        <div class="grid grid-cols-1 sm:hidden">
            <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
            <select
                aria-label="Select a tab"
                class="col-start-1 row-start-1 w-full appearance-none rounded-xl bg-surface-sunken ring-1 ring-line py-2.5 pl-3 pr-8 text-base text-ink1 focus:ring-2 focus:ring-dash-400 transition-all"
                @change="loadPage"
                v-model="activeTab"
            >
                <option v-for="tab in tabs" :key="tab.name" :selected="tab.current" class="text-slate-700">
                    {{ tab.name }}
                </option>
            </select>

            <ChevronDownIcon class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-slate-400" aria-hidden="true" />
        </div>

        <div class="hidden sm:block">
            <div class="border-b border-line">
                <nav class="pl-1 -mb-px flex xl:hidden gap-1 overflow-x-auto" aria-label="Tabs">
                    <a
                        v-for="tab in tabs"
                        :key="tab.name"
                        :href="tab.href"
                        :class="[tab.current
                            ? 'bg-brand-gradient text-white shadow-glow-dash ring-1 ring-white/20'
                            : 'text-ink2 hover:bg-surface-sunken hover:text-ink1 ring-1 ring-transparent hover:ring-line',
                            'group inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap']"
                        :aria-current="tab.current ? 'page' : undefined"
                    >
                        <component :is="tab.icon" :class="[tab.current ? 'text-white' : 'text-slate-400 group-hover:text-dash-300', 'size-4 transition-transform duration-200 group-hover:scale-110']" aria-hidden="true" />

                        <span>
                            {{ tab.name }}
                        </span>
                    </a>
                </nav>
                <nav class="pl-1 -mb-px hidden xl:flex gap-1" aria-label="Tabs">
                    <a
                        v-for="tab in alltabs"
                        :key="tab.name"
                        :href="tab.href"
                        :class="[tab.current
                            ? 'bg-brand-gradient text-white shadow-glow-dash ring-1 ring-white/20'
                            : 'text-ink2 hover:bg-surface-sunken hover:text-ink1 ring-1 ring-transparent hover:ring-line',
                            'group inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200']"
                        :aria-current="tab.current ? 'page' : undefined"
                    >
                        <component :is="tab.icon" :class="[tab.current ? 'text-white' : 'text-slate-400 group-hover:text-dash-300', 'size-4 transition-transform duration-200 group-hover:scale-110']" aria-hidden="true" />

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
// console.log('NAV ROUTE', route)

const path = route.path.slice(1)
// console.log('NAV PATH', path)

const activeTab = ref()

const tabs = [
    { name: 'Read Me', href: '/', icon: BookOpenIcon, current: path === '' ? true : false },
    { name: 'Gallery', href: '/gallery', icon: RectangleGroupIcon, current: path === 'gallery' ? true : false },
    { name: 'Swap', href: '/swap', icon: ArrowsRightLeftIcon, current: path === 'swap' ? true : false },
    { name: 'Pay', href: '/pay', icon: CreditCardIcon, current: path === 'pay' ? true : false },
    { name: 'Need help?', href: '/help', icon: InformationCircleIcon, current: path === 'help' ? true : false },
]

const alltabs = [
    { name: 'Read Me', href: '/', icon: BookOpenIcon, current: path === '' ? true : false },
    { name: 'Gallery', href: '/gallery', icon: RectangleGroupIcon, current: path === 'gallery' ? true : false },
    { name: 'Swap', href: '/swap', icon: ArrowsRightLeftIcon, current: path === 'swap' ? true : false },
    { name: 'Pay', href: '/pay', icon: CreditCardIcon, current: path === 'pay' ? true : false },
    { name: 'swap.jsx', href: '/frontend', icon: SparklesIcon, current: path === 'frontend' ? true : false },
    { name: 'swap.py', href: '/backend', icon: Square3Stack3DIcon, current: path === 'backend' ? true : false },
    { name: 'Need help?', href: '/help', icon: InformationCircleIcon, current: path === 'help' ? true : false },
]

const loadPage = () => {
    const tab = activeTab.value.toLowerCase()
    console.log('ACTIVE TAB', tab)

    const router = useRouter()

    switch(tab) {
    case 'gallery':
        router.push('/gallery')
        break
    case 'need help?':
        router.push('/help')
        break
    case 'pay':
        router.push('/pay')
        break
    case 'read me':
        router.push('/')
        break
    case 'swap':
        router.push('/swap')
        break
    }
}
</script>
