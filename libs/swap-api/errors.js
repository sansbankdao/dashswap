/* libs/swap-api/errors.js
 *
 * Friendly error messaging for the swap API.
 *
 * The engine returns raw chanfana errors (422 refine shapes, 7001
 * validation codes) and transport failures; users shouldn't read those.
 * `friendlySwapError()` maps the KNOWN shapes to human copy and falls
 * back to the raw message when it is already readable. UI layers should
 * render the friendly text and keep the raw message for console/debug.
 *
 * Sources of truth:
 *   - libs/swap-api/client.js (SwapApiError shapes)
 *   - dashswap-api OpenAPI (chanfana { success, errors: [{code,message,path}] })
 */

/**
 * Map a swap-API error to a human sentence.
 *
 * @param {Error|SwapApiError|string} err
 * @param {{ network?: string }} [opts]
 * @returns {string}
 */
export function friendlySwapError(err, opts = {}) {
    const raw = err instanceof Error ? err.message : String(err || '')
    const status = err?.status ?? null
    const code = err?.code ?? null
    const path = err?.path ?? ''

    /* Transport: the engine didn't answer at all. */
    if (status === 0) {
        return 'The swap engine is not reachable right now — check your connection and try again in a moment.'
    }

    /* Rate limiting. */
    if (status === 429 || code === 429) {
        return 'Too many requests — give it a few seconds and try again.'
    }

    /* Auth: bad or expired key. */
    if (status === 401 || status === 403) {
        return 'This swap key was rejected by the engine — open Advanced settings and paste a valid key.'
    }

    /* Third-party destination missing / unresolvable. */
    if (path.includes('dest') || /dest(_platformid)? is required/i.test(raw)) {
        return 'Enter the recipient — a .dash name, bare label or identity id.'
    }

    if (/does not resolve|could not resolve/i.test(raw)) {
        return 'That name doesn’t resolve on this network — check the spelling, or paste the recipient’s identity id.'
    }

    /* Inventory exhaustion / low pool. */
    if (/inventory|sold.?out|insufficient (inventory|funds)|pool is (empty|exhausted)/i.test(raw)) {
        return 'The engine is out of inventory for this token right now — try a smaller amount or check back soon.'
    }

    /* Validation envelope (chanfana 7001s) — point at the field. */
    if (status === 422) {
        if (path.includes('amount')) {
            return 'That amount isn’t valid — enter an amount within the quoted limits.'
        }
        return 'Some fields need attention: ' + raw
    }

    /* Already-human fallback (the store's own guards, engine wording). */
    return raw
}
