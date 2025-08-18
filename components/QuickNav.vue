<template>
    <main class="flex flex-wrap gap-1 mt-6 justify-between">
        <a
            key="gallery"
            href="/gallery"
            title="Explore the Gallery"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <RectangleGroupIcon />
        </a>

        <a
            key="identity"
            href="/id"
            title="Identity"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <UserIcon />
        </a>

        <a
            key="launcher"
            href="/launcher"
            title="Token Launcher"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <RocketLaunchIcon />
        </a>

        <a
            key="leaderboard"
            href="/leaderboard"
            title="Leaderboard"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <TrophyIcon />
        </a>

        <a
            key="trollbox"
            href="/trollbox"
            title="Trollbox"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <ChatBubbleLeftRightIcon />
        </a>

        <a
            key="help"
            href="/help"
            title="Help & Support"
            class="flex items-center justify-center size-14 p-2 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <InformationCircleIcon />
        </a>
    </main>
</template>

<script setup lang="ts">
import {
    ChatBubbleLeftRightIcon,
    InformationCircleIcon,
    RectangleGroupIcon,
    RocketLaunchIcon,
    TrophyIcon,
    UserIcon,
} from '@heroicons/vue/24/outline'

// import SocialIcon from './SocialIcon.astro'

interface Social {
    // icon: 'leaderboard' | 'help' | 'gallery' | 'profile' | 'launcher' | 'wallet';
    icon: string;
    link: string;
    title?: string;
}

const socials: Social[] = ref([
    {
        icon: 'gallery',
        link: '/gallery',
        title: 'Gallery View'
    },
    {
        icon: 'wallet',
        link: '/wallet',
        title: 'Trading Wallet'
    },
    {
        icon: 'launcher',
        link: '/launcher',
        title: 'Token Launcher'
    },
    {
        icon: 'leaderboard',
        link: '/leaderboard',
        title: 'Leaderboard'
    },
    {
        icon: 'profile',
        link: '/profile',
        title: 'Profile Manager'
    },
    {
        icon: 'help',
        link: '/help',
        title: 'Need help?'
    },
])
</script>
