<template>
    <main class="bg-white py-6 sm:py-8 dark:bg-gray-900">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                    Dash Galleria
                </h2>

                <p class="mt-2 text-lg/8 text-gray-600 dark:text-slate-300">
                    Discover the DASH Evolution in a Showcase
                </p>
            </div>

            <div class="mx-auto mt-8 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-10 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <article v-for="post in posts" :key="post.id" class="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-48 dark:bg-gray-800">
                    <img
                        :src="post.imageUrl"
                        alt=""
                        class="absolute inset-0 -z-10 size-full object-cover"
                    />

                    <div class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40 dark:from-black/80 dark:via-black/40" />

                    <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />

                    <div class="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                        <time :datetime="post.datetime" class="mr-8">{{ post.date }}</time>

                        <div class="-ml-4 flex items-center gap-x-4">
                            <svg viewBox="0 0 2 2" class="-ml-0.5 size-0.5 flex-none fill-white/50 dark:fill-gray-300/50">
                                <circle cx="1" cy="1" r="1" />
                            </svg>

                            <div class="flex gap-x-2.5">
                                <img :src="post.author.imageUrl" alt="" class="size-6 flex-none rounded-full bg-white/10 dark:bg-gray-800/10" />
                                {{ post.author.name }}
                            </div>
                        </div>
                    </div>

                    <h3 class="mt-3 text-4xl font-semibold text-slate-200">
                        <a :href="'/gallery/' + post.id">
                            <span class="absolute inset-0" />
                            {{ post.title }}
                        </a>
                    </h3>
                </article>
            </div>
        </div>
    </main>

    <section class="px-10 py-5">
        <nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 dark:border-white/10">
            <div class="-mt-px flex w-0 flex-1">
                <a
                    href="#"
                    class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-base font-medium text-slate-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-gray-200"
                >
                    <ArrowLongLeftIcon class="mr-3 size-5 text-gray-400 dark:text-slate-500" aria-hidden="true" />
                    Previous
                </a>
            </div>

            <div class="hidden md:-mt-px md:flex">
                <a
                    href="#"
                    class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-base font-medium text-slate-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-gray-200"
                >
                    1
                </a>
                <!-- Current: "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400", Default: "border-transparent text-slate-500 hover:text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-white/20" -->
                <a href="#" class="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-base font-medium text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" aria-current="page">2</a>
                <a
                    href="#"
                    class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-base font-medium text-slate-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-gray-200"
                >
                    3
                </a>
                <span class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-base font-medium text-slate-500">...</span>
                <a
                    href="#"
                    class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-base font-medium text-slate-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-gray-200"
                >
                    8
                </a>
                <a
                    href="#"
                    class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-base font-medium text-slate-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-gray-200"
                >
                    9
                </a>
                <a
                    href="#"
                    class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-base font-medium text-slate-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-gray-200"
                >
                    10
                </a>
            </div>

            <div class="-mt-px flex w-0 flex-1 justify-end">
                <a
                    href="#"
                    class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-base font-medium text-slate-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-gray-200"
                >
                    Next
                    <ArrowLongRightIcon class="ml-3 size-5 text-gray-400 dark:text-slate-500" aria-hidden="true" />
                </a>
            </div>
        </nav>
    </section>


    <Bootstrap />
</template>

<script setup lang="ts">
/* Import modules. */
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid'

const posts = [
    {
        id: '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz',
        title: 'Dash USD',
        href: '#',
        description: 'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl: 'https://dashusd.org/icon.svg',
        date: 'DUSD',
        datetime: '2020-03-16',
        author: {
            name: '$0.01 | 0.0432 DASH',
            imageUrl: 'https://dashusd.org/icon.svg',
        },
    },
    {
        id: 'A36eJF2kyYXwxCtJGsgbR3CTAscUFaNxZN19UqUfM1kw',
        title: 'Sansnote',
        href: '#',
        description: 'Optio cum necessitatibus dolor voluptatum provident commodi et. Qui aperiam fugiat nemo cumque.',
        imageUrl: 'https://sansbank.org/icon.svg',
        date: 'SANS',
        datetime: '2020-03-10',
        author: {
            name: '$0.01 | 0.0004 DASH',
            imageUrl: 'https://sansbank.org/icon.svg',
        },
    },
    {
        id: 'TBD',
        title: 'Gm, Evo!',
        href: '#',
        description: 'Ready to build your own community and economic empire? Cupiditate maiores ullam eveniet adipisci in doloribus nulla minus. Voluptas iusto libero adipisci rem et corporis.',
        imageUrl: 'https://i.ibb.co/W4yCCTHZ/gm-evo.webp',
        date: 'TBD',
        datetime: '2020-02-12',
        author: {
            name: 'TBD',
            imageUrl: 'https://i.ibb.co/W4yCCTHZ/gm-evo.webp',
        },
    },
]
</script>
