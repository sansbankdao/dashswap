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
    icon: 'leaderboard' | 'help' | 'gallery' | 'profile' | 'trollbox' | 'wallet';
    link: string;
    title?: string;
}

const socials: Social[] = ref([
    {
        icon: 'gallery',
        link: '/gallery',
        title: 'Open Gallery View'
    },
    {
        icon: 'wallet',
        link: '/wallet',
        title: 'Open Wallet'
    },
    {
        icon: 'trollbox',
        link: '/trollbox',
        title: 'Enter Trollbox'
    },
    {
        icon: 'leaderboard',
        link: '/leaderboard',
        title: 'View Leaderboard'
    },
    {
        icon: 'profile',
        link: '/profile',
        title: 'Open My Profile'
    },
    {
        icon: 'help',
        link: '/help',
        title: 'Get Help & Support'
    },
])
</script>
