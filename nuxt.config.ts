// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application */
    app: {
        head: {
            title: 'DashSwap Buy. Sell. Collect by Sansbank',
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

    /* Progressive Web Application Settings */
    pwa: {
        manifest: {
            name: 'DashSwap Buy. Sell. Collect by Sansbank',
            short_name: 'DashSwap',
            description: `Instantly swap ANY Dash native $TOKEN in a permissionless marketplace—liquidity providers (LP) offers 24x7 convenience.`,
            // lang: 'en',
            // useWebmanifestExtension: false,
        },
        meta: {
            name: 'DashSwap Buy. Sell. Collect by Sansbank',
            description: `Instantly swap ANY Dash native $TOKEN in a permissionless marketplace—liquidity providers (LP) offers 24x7 convenience.`,
            author: `Sansbank DAO`,
            // nativeUI: true,
        },
        // icon: false, // disables the icon module
        workbox: {
            // workboxURL: 'TBD',
            // enabled: true, // FOR DEV PURPOSES ONLY
        },
    },

    /* Modules */
    modules: [
        /* Tailwind CSS */
        '@nuxtjs/tailwindcss',

        /* Pinia */
        '@pinia/nuxt'
    ],

    loading: {
        component: '~/components/Loading.vue',
        duration:5000,
        throttle: 200,
    },

    /* Additional Options */
    ssr: false,
    devtools: { enabled: true },
    compatibilityDate: '2025-07-15',
})
