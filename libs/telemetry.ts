/* libs/telemetry.ts
 *
 * Minimal error telemetry for GlitchTip (open source, Sentry-protocol).
 *
 * GlitchTip speaks the Sentry envelope protocol, so we POST a tiny
 * hand-built envelope — no SDK dependency. Activation is 100% config
 * driven: `NUXT_PUBLIC_GLITCHTIP_DSN`. When the DSN is unset (local dev,
 * self-host not deployed yet) every call is a silent no-op, so callers
 * can be wired unconditionally today and light up the moment the DSN
 * exists (LunaNode GlitchTip or a fresh deploy next week).
 *
 * DSN shape: https://<publicKey>@<host>/<projectId>
 * Envelope endpoint: <origin>/api/<projectId>/envelope/
 */

interface TelemetryExtra {
    [key: string]: unknown
}

let cachedDsn: string | null = null

/** Parse a Sentry-protocol DSN into its parts (null when unusable). */
function parseDsn(dsn) {
    try {
        const url = new URL(dsn)
        const publicKey = url.username
        const projectId = url.pathname.replace(/^\/+|\/+$/g, '')
        if (!publicKey || !projectId) return null
        return { origin: url.origin, publicKey, projectId }
    } catch {
        return null
    }
}

/** Explicit DSN injection (the client plugin wires runtimeConfig). */
export function setDsn(dsn) {
    cachedDsn = dsn || ''
}

/** Resolve the runtime DSN (set once, cached). */
function resolveDsn() {
    if (cachedDsn !== null) return cachedDsn
    cachedDsn = ''
    return cachedDsn
}

/**
 * Report an error event. Fire-and-forget; NEVER throws — telemetry must
 * not break the app that reports.
 */
export function captureError(message, error, extra = {}, level = 'error') {
    try {
        const dsn = resolveDsn()
        if (!dsn) return

        const parts = parseDsn(dsn)
        if (!parts) return

        const eventId = (crypto as any)?.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`

        const envelopeHeader = {
            event_id: eventId,
            sent_at: new Date().toISOString(),
        }

        const itemHeader = { type: 'event' }

        const event = {
            event_id: eventId,
            timestamp: Math.floor(Date.now() / 1000),
            platform: 'javascript',
            environment: typeof window !== 'undefined' ? (window as any).location?.host || 'unknown' : 'server',
            level,
            message: String(message).slice(0, 512),
            sdk: { name: 'dashswap.telemetry', version: '1.0.0' },
            extra: {
                ...extra,
                error_name: error instanceof Error ? error.name : undefined,
                error_message: error instanceof Error ? error.message : String(error ?? ''),
                stack: error instanceof Error ? error.stack?.slice(0, 4096) : undefined,
            },
        }

        const body =
            JSON.stringify(envelopeHeader) + '\n' +
            JSON.stringify(itemHeader) + '\n' +
            JSON.stringify(event)

        fetch(`${parts.origin}/api/${parts.projectId}/envelope/`, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-sentry-envelope',
                'x-sentry-auth':
                    `Sentry sentry_version=7, sentry_key=${parts.publicKey}, ` +
                    'sentry_client=dashswap-telemetry/1.0',
            },
            body,
        }).catch(() => { /* telemetry must never surface */ })
    } catch {
        /* swallow — reporting must not break the app */
    }
}

/** Convenience wrapper: captureError with a plain message. */
export function captureMessage(message, extra = {}, level = 'warning') {
    return captureError(message, null, extra, level)
}
