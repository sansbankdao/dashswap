<template>
    <main class="flex flex-wrap gap-2.5 mt-4 justify-between">
        <a
            key="gallery"
            href="/gallery"
            title="Explore the Gallery"
            class="group relative flex items-center justify-center size-14 p-2.5 rounded-xl text-slate-200 transition-all duration-200 ring-1 ring-white/10 bg-white/5 hover:text-white hover:ring-dash-300/60 hover:-translate-y-1 hover:shadow-glow-dash active:translate-y-0">
            <span class="absolute inset-0 rounded-xl bg-dash-500/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true"></span>
            <RectangleGroupIcon class="relative w-full h-full" />
        </a>

        <a
            key="identity"
            href="/id"
            title="Identity"
            class="group relative flex items-center justify-center size-14 p-2.5 rounded-xl text-slate-200 transition-all duration-200 ring-1 ring-white/10 bg-white/5 hover:text-white hover:ring-dash-300/60 hover:-translate-y-1 hover:shadow-glow-dash active:translate-y-0">
            <span class="absolute inset-0 rounded-xl bg-dash-500/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true"></span>
            <UserIcon class="relative w-full h-full" />
        </a>

        <a
            key="launcher"
            href="/launcher"
            title="Token Launcher"
            class="group relative flex items-center justify-center size-14 p-2.5 rounded-xl text-slate-200 transition-all duration-200 ring-1 ring-white/10 bg-white/5 hover:text-white hover:ring-dash-300/60 hover:-translate-y-1 hover:shadow-glow-dash active:translate-y-0">
            <span class="absolute inset-0 rounded-xl bg-dash-500/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true"></span>
            <RocketLaunchIcon class="relative w-full h-full" />
        </a>

        <a
            key="rainmaker"
            href="/rainmaker"
            title="Rainmaker"
            class="group relative flex items-center justify-center size-14 p-2.5 rounded-xl text-slate-200 transition-all duration-200 ring-1 ring-white/10 bg-white/5 hover:text-white hover:ring-amber-300/60 hover:-translate-y-1 hover:shadow-glow-dash active:translate-y-0">
            <span class="absolute inset-0 rounded-xl bg-amber-400/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true"></span>
            <BoltIcon class="relative w-full h-full" />
        </a>

        <a
            key="trollbox"
            href="/trollbox"
            title="Trollbox"
            class="group relative flex items-center justify-center size-14 p-2.5 rounded-xl text-slate-200 transition-all duration-200 ring-1 ring-white/10 bg-white/5 hover:text-white hover:ring-fuchsia-300/60 hover:-translate-y-1 hover:shadow-glow-dash active:translate-y-0">
            <span class="absolute inset-0 rounded-xl bg-fuchsia-500/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true"></span>
            <ChatBubbleLeftRightIcon class="relative w-full h-full" />
        </a>

        <a
            key="help"
            href="/help"
            title="Help & Support"
            class="group relative flex items-center justify-center size-14 p-2.5 rounded-xl text-slate-200 transition-all duration-200 ring-1 ring-white/10 bg-white/5 hover:text-white hover:ring-violet-300/60 hover:-translate-y-1 hover:shadow-glow-dash active:translate-y-0">
            <span class="absolute inset-0 rounded-xl bg-violet-500/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true"></span>
            <InformationCircleIcon class="relative w-full h-full" />
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
