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

    /* Progressive Web Application Settings (@vite-pwa/nuxt) */
    pwa: {
        /* The bundled wasm SDKs (dash + pshenmic-dpp) ship as 12 MiB / 5 MiB
         * chunks — above workbox's 2 MiB default; precache them anyway so the
         * installed PWA is fully functional offline. (@unplugin-pwa/core reads
         * this from the pwa ROOT, not from workbox.) */
        maximumFileSizeToCacheInBytes: 20971520,

        manifest: {
            name: 'DashSwap Buy. Sell. Collect by Sansbank',
            short_name: 'DashSwap',
            description: `Instantly swap ANY Dash native $TOKEN in a permissionless marketplace—liquidity providers (LP) offers 24x7 convenience.`,
            // lang: 'en',
        },
        meta: {
            name: 'DashSwap Buy. Sell. Collect by Sansbank',
            description: `Instantly swap ANY Dash native $TOKEN in a permissionless marketplace—liquidity providers (LP) offers 24x7 convenience.`,
            author: `Sansbank DAO`,
            // nativeUI: true,
        },
        // icon: false, // disables the icon module
        workbox: {
            // enabled: true, // FOR DEV PURPOSES ONLY
        },
    },

    /* Modules */
    modules: [
        /* Tailwind CSS */
        '@nuxtjs/tailwindcss',

        /* Pinia */
        '@pinia/nuxt',

        /* PWA (successor of the deprecated @kevinmarrec/nuxt-pwa) */
        '@vite-pwa/nuxt'
    ],

    loading: {
        component: '~/components/Loading.vue',
        duration:5000,
        throttle: 200,
    },

    runtimeConfig: {
        public: {
            /* DashConnect (App Connect v2) — set after the anchor contract
             * deployment; see libs/dashconnect/config.ts. */
            appConnectAppId: '',
            appConnectGroupId: '',
            appConnectLabel: 'DashSwap',
            appConnectCallback: '',
            /* dash-key | dashpay | both (testnet; mainnet is always dashpay). */
            appConnectCarrier: 'both',

            /* dashswap-api (FRONTEND-HANDOFF.md). Base defaults to production;
             * a dev key is a Phase-1 interim (localStorage-overridable), Phase
             * 2 replaces it with App Connect signature headers. */
            swapApiBase: 'https://dashswap.xyz/v1',
            /* Per-network Worker instances (one Worker = one network). The
             * testnet route is set once the API team confirms where their
             * testnet Worker instance lives; empty falls back to the legacy
             * single base. */
            swapApiBaseTestnet: '',
            swapApiBaseMainnet: 'https://dashswap.xyz/v1',
            swapApiKey: '',
        },
    },

    /* Global styles (adaptive theme tokens). */
    css: [
        '~/assets/css/theme.css',
    ],

    /* Additional Options */
    ssr: false,
    devtools: { enabled: true },
    compatibilityDate: '2025-07-15',
})
