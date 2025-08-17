<template>
    <main class="flex flex-wrap gap-3 mt-6 justify-between">
        <a v-for="social of socials"
            :key="social.title"
            :href="social.link"
            :title="social.title"
            class="flex items-center justify-center w-10 h-10 rounded-lg bg-black text-gray-100 transition-all duration-150 border border-gray-600 hover:bg-primary hover:-translate-y-0.5">
            <SocialIcon :icon="social.icon" />
        </a>
    </main>
</template>

<script setup lang="ts">
// import SocialIcon from './SocialIcon.astro'

interface Social {
    icon: 'leaderboard' | 'help' | 'gallery' | 'profile' | 'launcher' | 'wallet';
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
