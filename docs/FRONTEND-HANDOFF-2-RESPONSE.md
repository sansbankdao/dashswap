# FRONTEND-HANDOFF-2-RESPONSE — the frontend is mainnet-ready

**For:** the `dashswap-api` team. **From:** `dashswap.xyz` (frontend).
**Date:** 2026-11-14. **Re:** `FRONTEND-HANDOFF-2.md` (mainnet live).
**Frontend state:** `dashswap.xyz` master `c7210ca` — build verified on the
sansbank VM (precache 59 entries, 18.3 MiB).

---

## 1. Compliance shipped on receipt of HANDOFF-2

| Handoff item | Status | Where |
| --- | --- | --- |
| §0/§6 mainnet live, real value | **Done** — stale testnet banner ("TESTNET addresses, usernames will NOT resolve") replaced with the MAINNET LIVE real-value warning; deposit labels read the ENGINE phase, not the UI network toggle | `components/Swap/Menu.vue` |
| §1/§3 promo rate + fee transparency (REQUIRED) | **Done** — quote panel shows "1 SANS = 0.0016 DASH — Season 3" derived live from the API's `rate` (season resolved against the mirrored ladder), the **0.30% platform-fee line** with the fee in DASH when `amount_in` is known, payouts formatted in token units (SANS ÷10⁸, DUSD ÷10⁶) | `components/Swap/Menu.vue` |
| §1 quote math | Acknowledged — we do NOT re-derive `amount_out`; we display `expected_out`/`amount_out` as returned. Our fee math (`fee = floor(amount_in × 30/10,000)`) is for the fee LINE only | `stores/swap.ts` (`FEE_BPS`, `feeDuffs`) |
| §2 lifecycle + polling | Already compliant (pending→detected→confirmed→settling→settled; failed/refunded forward-compatible; 10 s poll; stops on terminal) | `stores/swap.ts`, `Menu.vue` timeline |
| §2 `dash:` QR | Already compliant (`dash:<deposit_address>`, generated client-side) | `Menu.vue` |
| §4 SANS/DUSD naming | **Done** — pair labels, asset panel names ('Sansnote'/'Dash USD' → 'SANS'/'DUSD' on mainnet; the `[TEST]` testnet branch untouched — that cleanup is your v2) | `stores/swap.ts`, `stores/identity.ts` |
| §4 stale `SANS_PRICE = 0.01` | **Dead.** SANS-USD now derives from the promo ladder × the LIVE DASH ticker (fetched from `GET /v1/ticker/DASH` at init; display-only fallback for ticker outages). The DASH-credit fiat line is live-priced too | `stores/identity.ts` |
| §5 keep the UI off market/asset stubs | Confirmed — never wired | — |
| §7 standing rule | Acknowledged — see §3.1 below: we can only FULLY comply once the API exposes the rate publicly | — |

## 2. Verified on our side (live probes, 2026-11-14)

- `GET /v1/openapi.json` live; create/fetch schemas read from it
- `GET /v1/ticker/DASH` → live CMC feed ✓
- Dev key `dsw_dev_2a05…` verified against production: authenticated
  `GET /v1/swap?platformid=…` → `{"success":true,"swaps":[]}`; missing-scope
  and 404/422 error shapes match HANDOFF-1 §3/§4.4 exactly
- Key wiring: build-time `runtimeConfig.public.swapApiKey` (+ per-network
  localStorage override); swap records keyed per network in localStorage

## 3. Requests back (blockers / near-blockers for §7 compliance)

### 3.1 Public rate endpoint — REQUIRED
`GET /v1/ticker/SANS` returns the stale seed **$0.01** while §4 says the
live price is the ladder and §7 says the API is the source of truth and
rates must never be hardcoded. Today the ONLY way to learn the current
season rate is `POST /v1/swap` — which mints a REAL mainnet money record.
Please ship either:
- (a) derive `GET /v1/ticker/SANS` from the ladder × the DASH feed, or
- (b) a public `GET /v1/quote?dest=SANS|DUSD` → `{rate, season, fee_bps}`.

Until one lands, the frontend mirrors the ladder table and the season-3
constant with TODOs pinned to this request (`stores/swap.ts` `PROMO_LADDER`,
`stores/identity.ts` `SANS_DASH_PER`).

### 3.2 `fee_duffs` in create/fetch responses — nice-to-have
We re-derive the fee from §1 today. An explicit `fee_duffs` field removes
the re-derivation risk on both sides.

### 3.3 Expose the engine phase — nice-to-have
One Worker serves one network; we currently pin it as a constant
(`SWAP_PHASE = 'MAINNET'` in `stores/swap.ts`). If you ever flip
`DAPI_NETWORK` our UI goes stale silently. A `network` field on the create
response (or `GET /v1/phase`) closes that.

## 4. Integration state on our side (so your ops tests know what to expect)

- **Login (QR flow):** DashConnect v2 — ready and deployed; the gating item
  is the **EvoNext wallet scanner** (their handoff: our
  `docs/DASHCONNECT_EVONEXT_HANDOFF.md` — includes the live testnet anchor
  `HntqfEu3PZsPDcg8ERXenx4nP8ghWMxrBej2EQ58ewc7`, group
  `CXkQP3VELmmEe1YUCCH3Yhh4jZxCu7Jh3zdSDjm29kD2`).
- **Login (browser extension):** INTEGRATION IN PROGRESS — Pshenmic's Dash
  Platform Extension v1.5.3 (`window.dashPlatformExtension.signer`):
  `connect()` binds the identity; STs via `signAndBroadcast` (extension
  signs AND broadcasts; string hex/base64 only). We aligned our
  `pshenmic-dpp` to the extension's exact serialization line
  (`2.0.1-dev.6` via `dash-platform-sdk@1.6.2`) for byte parity.
- **Phase 2 auth (your `APP-CONNECT-AUTH-SPEC.md`):** we orchestrate App
  Connect v2 OURSELVES on top of the extension — we build the
  IdentityUpdate that registers our session keys, the user approves it in
  the extension popup, it broadcasts on-chain, then our session key ring
  signs `X-DashSwap-*` headers. Same Phase-2 target for QR-flow users.
- **Swap auth today:** Phase-1 dev key (per HANDOFF-1 §3). platformid =
  the connected identity (extension `currentIdentity` or DashConnect
  session). Note: the dev-key registry is network-agnostic — the same key
  is valid against whichever network the Worker serves.

## 5. Outstanding items (ours)

1. **Deploy decision (§6.1)** — production vs `testnet.dashswap.xyz` first:
   with our platform owner. The UI handles real addresses and real value
   from the first deploy either way.
2. **EvoNext scanner** — waiting on the wallet team (unchanged).
3. **First live test (§6.3)** — we will signal readiness once the deploy
   target is confirmed; we ask that you trace API-side while we trace
   UI-side, on a small amount (e.g. 0.1 DASH → SANS).

## 6. Questions for you

1. Confirm the season/ladder rate will be publicly readable (§3.1) — and
   whether `GET /v1/ticker/SANS` will then track it.
2. Any objection to us adding a tiny "what this address is" caption under
   the deposit QR (e.g. "single-use deposit address, watch-only")? No API
   dependency — pure copy.
3. When the first mainnet swap settles, will `GET /v1/swap/:id` carry
   `dest_txid` (the on-chain token movement)? Our UI can then deep-link
   the settlement proof in the tracker. (Not in the OpenAPI today.)

— dashswap.xyz frontend team
