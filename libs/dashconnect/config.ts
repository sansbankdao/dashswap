/* libs/dashconnect/config.ts
 *
 * Build-time switches and pinned data for DashConnect (App Connect v2) login
 * (dashswap.xyz/docs/DASHCONNECT_EVONEXT_HANDOFF.md,
 * yappr docs/APP_CONNECT_PROFILE.md).
 *
 * The anchor contract (the App Connect `appId`) is DashSwap's own contract and
 * is registered per network; until then DASHSWAP_APP_ID stays empty and the
 * login flow refuses to start.
 */

import type { AppConnectCarrier } from './request'
import type { AppConnectNetworkName } from './types'

/** Platform's App Connect system contract, where wallets publish `loginKeyResponse` documents. */
export const APP_CONNECT_RESPONSE_CONTRACT_ID = 'H8F9mP1BM55TE1ShsxPZHzhyinaMdY9bMmP85mkDhcJJ'
export const APP_CONNECT_RESPONSE_DOCUMENT_TYPE = 'loginKeyResponse'
/** Bound V1 keys and the anchor's encryption opt-in exist from protocol 14. */
export const APP_CONNECT_MIN_PROTOCOL_VERSION = 14
/** The DashPay contract and `profile` document type (a future second binding). */
export const DASHPAY_CONTRACT_ID = 'Bwr4WHCPz5rFVAD87RqTs3izo4zpzwsEdKPWUT1NS1C7'
export const DASHPAY_PROFILE_DOCUMENT_TYPE = 'profile'

/**
 * DashSwap's anchor contract (the App Connect `appId`) and its contract group.
 *
 * STATUS: DEPLOYED on testnet (2026-11-13) by
 * `dashswap-api/scripts/register-testnet-anchor.ts` from the settlement
 * mnemonic. Owner identity: BCZnXhWvJ2oCfFe39eokWBopoGtiCGAd9dHhLaPg65ny
 * (the anchor registers the group at its own create; single owner, no admins;
 * `requiresIdentityEncryptionBoundedKey: 2`). Mainnet: pending deployment.
 */
export const DASHSWAP_APP_ID = 'HntqfEu3PZsPDcg8ERXenx4nP8ghWMxrBej2EQ58ewc7'
export const DASHSWAP_GROUP_ID = 'CXkQP3VELmmEe1YUCCH3Yhh4jZxCu7Jh3zdSDjm29kD2'
export const DASHSWAP_APP_OWNER_ID = 'BCZnXhWvJ2oCfFe39eokWBopoGtiCGAd9dHhLaPg65ny'

const DAY_MS = 24 * 60 * 60_000
/** Session key budget/expiry proposals; the wallet clamps and offers presets. */
export const APP_CONNECT_SESSION_BUDGET = 10_000_000n // 10,000 credits
export const APP_CONNECT_SESSION_LIFETIME_MS = 90 * DAY_MS
/** 0.5 DASH for 90 days — the policy once a CRITICAL group key is available. */
export const APP_CONNECT_GROUP_BUDGET = 50_000_000_000n
export const APP_CONNECT_GROUP_LIFETIME_MS = 90 * DAY_MS

/**
 * The carriers a build offers, the default first (DIP dashpay/dips#181):
 * `dashpay://connect` or the transitional `dash-key:`. Current testnet and
 * devnet wallets accept only `dash-key:`, so that is the default there; `both`
 * offers the two for the same request so old and new wallets can be tried side
 * by side. Mainnet is always `dashpay` alone, whatever the configuration says.
 */
export function parseAppConnectCarriers(
    value: string | undefined,
    network: AppConnectNetworkName,
): AppConnectCarrier[] {
    if (network === 'mainnet') return ['dashpay']
    switch (value?.trim()) {
    case 'dashpay':
        return ['dashpay']
    case 'both':
        return ['dash-key', 'dashpay']
    default:
        return ['dash-key']
    }
}

/** The URI to show: the `wanted` carrier's when present, else the first. */
export function selectCarrierUri<T extends { carrier: AppConnectCarrier }>(uris: readonly [T, ...T[]], wanted: AppConnectCarrier | null): T {
    return uris.find((entry) => entry.carrier === wanted) ?? uris[0]
}
