// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,

    app: {
        head: {
            title: 'DashSwap by Sansbank DAO',
            meta: [
                { name: 'description', content: 'Instantly swap ANY Dash native $TOKEN in a permissioneless marketplace—liquidity providers (LP) offers 24x7 convenience.' },
                { name: 'keywords', content: 'dash, crypto, dex, instaswap' },
            ],
            link: [
                { rel: 'canonical', href: 'https://dashswap.xyz' },
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
        },
    },
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
    devtools: { enabled: true },
    compatibilityDate: '2025-07-15',
})