// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,

    app: {
        head: {
            title: 'DashSwap',
            meta: [
                { name: 'description', content: '' },
                { name: 'keywords', content: '' },
            ],
            link: [
                { rel: 'canonical', href: 'https://dashswap.xyz' },
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
        },
    },
    modules: ['@nuxtjs/tailwindcss'],
    devtools: { enabled: true },
    compatibilityDate: '2025-07-15',
})
