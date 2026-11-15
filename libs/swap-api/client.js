/* libs/swap-api/client.js
 *
 * Thin client for the dashswap-api Worker (FRONTEND-HANDOFF.md).
 * Normalizes BOTH error shapes the API returns:
 *   - plain:      { "error": "Oops! …" }
 *   - chanfana:   { "success": false, "errors": [{ "code", "message", "path" }], "result": null }
 * Everything throws SwapApiError so the store/UI handle one shape.
 *
 * Phase 1 auth: `X-API-Key` (dev key). Phase 2 (APP-CONNECT-AUTH-SPEC.md):
 * the same client gains X-DashSwap-* signature headers — the call sites and
 * error handling stay identical.
 */

/**
 * Normalized API error.
 */
export class SwapApiError extends Error {
    constructor(status, message, code, path) {
        super(message)
        this.name = 'SwapApiError'
        this.status = status
        this.code = code
        this.path = path
    }
}

const joinBase = (base, path) => `${(base || '').replace(/\/+$/, '')}${path}`

export async function request(base, apiKey, path, options = {}) {
    const headers = { 'content-type': 'application/json' }
    if (apiKey) headers['x-api-key'] = apiKey

    let response
    try {
        response = await fetch(joinBase(base, path), { headers, ...options })
    } catch (err) {
        throw new SwapApiError(0, `Network error reaching the swap API: ${err.message}`)
    }

    let payload = null
    try {
        payload = await response.json()
    } catch (err) {
        /* Non-JSON body (e.g. an HTML error page) — keep the status. */
    }

    if (!response.ok) {
        /* chanfana schema shape. */
        if (payload && payload.success === false && Array.isArray(payload.errors) && payload.errors.length > 0) {
            const first = payload.errors[0]
            throw new SwapApiError(response.status, first.message, first.code, (first.path || []).join('.'))
        }
        /* Plain shape. */
        throw new SwapApiError(response.status, payload?.error || `Swap API error ${response.status}`)
    }

    return payload
}

/**
 * POST /v1/swap — create a swap request.
 *
 * @param {object} params
 * @param {string} params.base         API base, e.g. https://dashswap.xyz/v1
 * @param {string} params.apiKey       dev key (Phase 1)
 * @param {'DASH->SANS'|'DASH->DUSD'} params.direction   bootstrap allowlist
 * @param {string} params.platformid   caller identity (audit; Phase 2: verified)
 * @param {string} [params.dest]       .dash name / bare label / identity id
 * @param {string} [params.dest_platformid]  recipient identity id (as-given)
 * @param {number} [params.amount_in]  duffs (1e8 = 1 DASH); omit = open swap
 */
export async function createSwap(params) {
    const { base, apiKey, direction, platformid, dest, dest_platformid, amount_in } = params

    const body = { direction, platformid }
    if (dest) body.dest = dest
    if (dest_platformid) body.dest_platformid = dest_platformid
    if (amount_in !== undefined && amount_in !== null) body.amount_in = amount_in

    const payload = await request(base, apiKey, '/swap', {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return payload?.swap
}

/**
 * GET /v1/swap — list swaps (50 per page, newest first).
 * NOTE (Phase 1): dev-key callers MUST pass platformid.
 */
export async function listSwaps(params) {
    const { base, apiKey, page = 0, platformid } = params

    const search = new URLSearchParams({ page: String(page) })
    if (platformid) search.set('platformid', platformid)

    const payload = await request(base, apiKey, `/swap?${search.toString()}`)

    return payload?.swaps || []
}

/**
 * GET /v1/swap/:SwapID — fetch one swap (adds amount_out + updated_at).
 */
export async function fetchSwap(params) {
    const { base, apiKey, swapid } = params

    const payload = await request(base, apiKey, `/swap/${encodeURIComponent(swapid)}`)

    return payload?.swap
}
