<template>
    <main class="flex flex-wrap gap-0.5 mt-6 justify-between">
        <a
            key="gallery"
            href="/gallery"
            title="Explore the Gallery"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <RectangleGroupIcon class="w-full h-full" />
        </a>

        <a
            key="identity"
            href="/id"
            title="Identity"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <UserIcon class="w-full h-full" />
        </a>

        <a
            key="launcher"
            href="/launcher"
            title="Token Launcher"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <RocketLaunchIcon class="w-full h-full" />
        </a>

        <a
            key="rainmaker"
            href="/rainmaker"
            title="Rainmaker"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <BoltIcon class="w-full h-full" />
        </a>

        <a
            key="trollbox"
            href="/trollbox"
            title="Trollbox"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <ChatBubbleLeftRightIcon class="w-full h-full" />
        </a>

        <a
            key="help"
            href="/help"
            title="Help & Support"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <InformationCircleIcon class="w-full h-full" />
        </a>
    </main>
</template>

<script setup lang="ts">
import {
    BoltIcon,
    ChatBubbleLeftRightIcon,
    InformationCircleIcon,
    RectangleGroupIcon,
    RocketLaunchIcon,
    UserIcon,
} from '@heroicons/vue/24/outline'
</script>
