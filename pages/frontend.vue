<template>
    <main class="">
        <NavMenu />

        <section class="p-3">
            <FrontendMenu />

            <pre v-html="code" class="px-3 py-5 text-amber-100 text-sm" />
        </section>
    </main>
</template>

<script setup lang="ts">
const code = ref(`/* Front-end Integration for React/Next.js */
import { swap, type OrderType } from 'dashswap'

interface Order {
    orderid: string;
    baseAsset: string;
    quoteAsset: string;
    notes: string[];
};

interface Provider {
    providerid: string;
};

// type OrderType = 'buy' | 'sell';

const mySwap: Order = {
    devOps: [
        'Cloudflare',
        'Docker'
    ],
    frontend: [
        'Astro',
        'JavaScript',
        'TypeScript',
        'WordPress'
    ],
}

// Developer profile
const me: Developer = {
    name: 'Dejan Vi.',
    skills: [
        ...techStack.devOps,
        ...techStack.backend,
        ...techStack.frontend
    ],
    interests: [
        'Open Source',
        'Security',
        'Privacy',
        'Performance',
        'Self-Hosting',
        'Networking'
    ]
};

// Order function
const order = (type: OrderType): string => {
    switch (type) {
        case 'buy':
            return 'https://github.com/devidevio';
        case 'sell':
            return 'https://x.com/devidev_io';
        default:
            return 'Send fax.';
    }
}
`)
</script>
