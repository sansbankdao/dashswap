<template>
    <div class="w-full">
        <h3 class="pl-2 text-xs font-medium text-slate-300 uppercase">
            $TOKEN Assets Menu
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

                        <p class="text-gray-500 text-xs">
                            {{ project.members }} Members
                        </p>
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
    { name: 'Now Trending', initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600' },
    { name: 'New & Noteworthy', initials: 'CD', href: '#', members: 12, bgColor: 'bg-purple-600' },
    { name: 'Token Launcher', initials: 'T', href: '#', members: 16, bgColor: 'bg-yellow-500' },
    { name: 'Airdrops!', initials: 'RC', href: '#', members: 8, bgColor: 'bg-green-500' },
]
</script>
