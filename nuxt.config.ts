// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application */
    app: {
        head: {
            title: 'DashSwap by Sansbank DAO',
            meta: [
                { name: 'description', content: 'Instantly swap ANY Dash native $TOKEN in a permissionless marketplace—liquidity providers (LP) offers 24x7 convenience.' },
                { name: 'keywords', content: 'dash, crypto, dex, instaswap' },
            ],
            link: [
                { rel: 'canonical', href: 'https://dashswap.xyz' },
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
        },
    },

    /* Modules */
    modules: [
        /* Tailwind CSS */
        '@nuxtjs/tailwindcss',

        /* Pinia */
        '@pinia/nuxt'
    ],

    /* Additional Options */
    ssr: false,
    devtools: { enabled: true },
    compatibilityDate: '2025-07-15',
})
