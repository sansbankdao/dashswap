/* plugins/telemetry.client.ts
 *
 * Global error hooks → GlitchTip telemetry (libs/telemetry.ts).
 * Client-only: the hooks attach on mount; no-op without a DSN.
 */

import { setDsn, captureError } from '@/libs/telemetry'

export default defineNuxtPlugin((nuxtApp) => {
    /* Wire the runtime DSN (NUXT_PUBLIC_GLITCHTIP_DSN) into the telemetry
     * module — silent no-op while the self-host isn't deployed. */
    const config = useRuntimeConfig()
    setDsn(config?.public?.glitchtipDsn || '')

    const report = (message) => (error) => {
        captureError(message, error, { hook: message })
    }

    /* Vue component errors (uncaught in render/lifecycle). */
    nuxtApp.vueApp.config.errorHandler = (err, _instance, info) => {
        captureError(`Vue error (${info})`, err, { hook: 'vue:error' })
    }

    /* Nuxt-level errors: unhandled SSR-hydration gaps + route failures. */
    nuxtApp.hook('app:error', report('app:error'))
    nuxtApp.hook('vue:error', report('vue:error'))
})
