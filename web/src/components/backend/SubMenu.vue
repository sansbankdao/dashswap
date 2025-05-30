<template>
    <div class="w-full">
        <h3 class="pl-2 text-xs font-medium text-slate-300 uppercase">
            Back-end Frameworks Menu
        </h3>

        <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <li v-for="project in projects" :key="project.name" class="col-span-1 flex rounded-md shadow-sm">
                <div :class="[project.bgColor, 'flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white']">
                    {{ project.initials }}
                </div>

                <div class="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                    <div class="flex-1 truncate px-4 py-2 text-sm">
                        <a :href="project.href" class="font-medium text-gray-900 hover:text-gray-600">
                            {{ project.name }}
                        </a>

                        <div class="flex flex-row gap-4">
                            <p class="text-gray-500 text-xs">
                                {{ project.members }} Deployments
                            </p>

                            <p class="text-gray-500 text-xs">
                                {{ project.trades }} Trades
                            </p>
                        </div>

                    </div>

                    <div class="shrink-0 pr-2">
                        <button
                            type="button"
                            class="inline-flex size-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span class="sr-only">Open options</span>
                            <EllipsisVerticalIcon class="size-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

const projects = [
    {
        name: 'TypeScript | Node.js',
        initials: 'TN',
        href: '#',
        members: 8,
        trades: 808,
        bgColor: 'bg-green-500'
    },
    {
        name: 'Python | Django',
        initials: 'PD',
        href: '#',
        members: 16,
        trades: 1606,
        bgColor: 'bg-pink-600'
    },
    {
        name: 'PHP | Laravel',
        initials: 'PL',
        href: '#',
        members: 6,
        trades: 660,
        bgColor: 'bg-yellow-500'
    },
    {
        name: 'Rust | XXX',
        initials: 'RX',
        href: '#',
        members: 12,
        trades: 1202,
        bgColor: 'bg-purple-600'
    },
]
</script>
