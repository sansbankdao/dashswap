// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application */
    app: {
        head: {
            title: 'DashSwap — Instant DASH token swaps by Sansbank',
            meta: [
                { name: 'description', content: 'Instantly swap DASH for native Dash Platform tokens. On-chain settlement, self-custody wallets, flat 0.3% engine fee — live in seconds.' },
                { name: 'keywords', content: 'dash, crypto, dex, instaswap, sansbank' },
            ],
            link: [
                { rel: 'canonical', href: 'https://dashswap.xyz' },
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
        },
    },

    /* Runtime config (public env — bakeable at build, overridable per
     * deployment). GlitchTip DSN: empty until the self-host lands. */
    runtimeConfig: {
        public: {
            glitchtipDsn: process.env.NUXT_PUBLIC_GLITCHTIP_DSN || '',
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
            name: 'DashSwap — Instant DASH token swaps',
            short_name: 'DashSwap',
            description: `Instantly swap DASH for native Dash Platform tokens. On-chain settlement, self-custody wallets, flat 0.3% engine fee.`,
            // lang: 'en',
        },
        meta: {
            name: 'DashSwap — Instant DASH token swaps',
            description: `Instantly swap DASH for native Dash Platform tokens. On-chain settlement, self-custody wallets, flat 0.3% engine fee.`,
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
            /* Per-network Worker instances (one Worker = one network),
             * FRONTEND-HANDOFF-3-ACK: the testnet instance is LIVE at the
             * zone route; both bases are baked (single Pages project serves
             * both hostnames — stores/system.ts host detection picks). */
            swapApiBaseTestnet: 'https://testnet.dashswap.xyz/v1',
            swapApiBaseMainnet: 'https://dashswap.xyz/v1',
            /* Network-aware dev keys: one build bakes BOTH instances' keys
             * (each instance's D1 knows only its own; CI supplies them via
             * MAINNET_SWAP_API_KEY / TESTNET_SWAP_API_KEY secrets). */
            swapApiKeyMainnet: '',
            swapApiKeyTestnet: '',
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
