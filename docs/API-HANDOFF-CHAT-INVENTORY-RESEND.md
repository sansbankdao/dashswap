# API HANDOFF — Support Chat + Inventory Exposure + Resend Alerts + Status

**From:** dashswap.xyz (frontend) — `sansbankdao/dashswap`
**To:** dashswap-api (Worker) team
**Date:** post-launch prep, v1
**Repo boundary:** this document proposes endpoints in YOUR repo; the frontend side is ALREADY built and shipped against these contracts (no-op until you deploy). Nothing in this doc requires frontend changes.

---

## 0. Context

The frontend (deployed on `dashswap.xyz` + `testnet.dashswap.xyz` via a single Cloudflare Pages project) now includes:

1. **AI support chat** (bottom-right floating widget, every page) — targets your API
2. **Inventory banners** on the swap form — render the moment your quote exposes inventory fields
3. **Engine status dot** (side rail) — heartbeat against your public market endpoint
4. **Resend-powered low-inventory alerts** — proposed Worker-side (your repo)

All four are contract-first: the frontend ships the UI now, silent no-op until the endpoints/fields exist.

---

## 1. `POST /v1/support/chat` — AI support assistant

### Request
```json
{
  "session_id": "uuid-v4",          // client-generated, per browser tab session
  "message": "how do fees work?",   // string, ≤ 2000 chars
  "network": "mainnet"              // "mainnet" | "testnet"
}
```
Special value `message: "__ping__"` — the frontend probes with it to decide
whether to show "Live chat" or "Coming online". Reply with a cheap canned
response; do NOT bill tokens for pings.

### Response (200)
```json
{ "success": true, "reply": "Every swap pays a flat 0.3% engine fee...", "session_id": "..." }
```

### Errors
| Status | When | Shape |
|---|---|---|
| 429 | rate limit (suggest 20 req/hour/IP + 1 req/3 s/session) | chanfana errors envelope |
| 503 | model/brain unavailable | `{ "success": false, "errors": [{ "code": 7500, "message": "Support brain offline" }] }` |

### Backend notes
- Public endpoint — NO API key (the widget serves guests). Rate-limit per IP; the frontend already degrades gracefully on 429.
- Store nothing PII. Log `session_id` + truncated messages for abuse review only.
- System-prompt content the assistant should know (copy already on the site):
  - swaps pay a **flat 0.3% engine fee**, quoted before confirm
  - deposit addresses are **single-use, watch-only, custodied settlement** — send the exact quoted amount
  - settlement is on-chain; `dest_txid` is exposed on the swap record
  - testnet vs mainnet are separate deployments (`testnet.dashswap.xyz` ↔ testnet Worker)
  - the browser extension flow: connect → approve once → each send approved individually
  - App Connect (QR) is coming for mobile wallets — currently browser-extension + DashConnect desktop
- **Guardrails (non-negotiable):** never give financial advice; never ask for or accept mnemonics/WIF/private keys; if a user pastes one, refuse + tell them to rotate that wallet. Escalate legal/compliance questions to a human (canned reply).

### Frontend behavior already shipped
- `components/Support/Chat.vue` — probe on open, transcript in sessionStorage, 429 + 503 handled, 30 s timeout
- The widget queues user questions locally while you're not live — nothing is sent to you until the endpoint exists

---

## 2. Inventory exposure on `/v1/quote` (+ create/fetch responses)

Add two fields wherever you quote:
```json
{
  "dest": "SANS",
  "rate": 625,
  "season": 3,
  "fee_bps": 30,
  "inventory_base_duffs": 49123450000,   // int, remaining engine inventory in base units
  "inventory_state": "ok"                 // "ok" | "low" | "out"
}
```
Suggested thresholds (relative to your initial inventory, e.g. SANS 50k / DUSD 400):
- `ok`  — > 20% remaining
- `low` — ≤ 20% remaining
- `out` — 0 (or below minimum viable swap output)

**Frontend behavior already shipped:** the swap form renders an amber "Low inventory" banner for `low`, a rose "Sold out" banner (blocking copy) for `out`, and nothing when the fields are absent.

---

## 3. `GET /v1/status` — engine heartbeat (optional but cheap)

The side-rail status dot currently heartbeats `GET /v1/market` (public, stub returns `{success:true}`) every 60 s and maps:
- 200 + `success:true` → green "Swap engine is live"
- answered but not success → amber "syncing"
- no answer (8 s timeout) → red "unreachable"

If you'd rather serve a real status document:
```json
{
  "success": true,
  "network": "mainnet",
  "engine": "ok",
  "inventory": { "SANS": { "state": "ok", "base_duffs": 49123450000 }, "DUSD": { "state": "out", "base_duffs": 0 } },
  "promo": { "season": 3, "rate": 625 }
}
```
Tell us when `/v1/status` lands and we'll repoint the heartbeat (one-line change in `components/NetworkManager.vue`).

---

## 4. Resend low-inventory alerts (Worker-side, your repo)

Sansbank's Resend account is available for transactional alerts. Proposed wiring in YOUR cron (the 1-min settle cron or a 5-min one):

- Secret: `RESEND_API_KEY` in `.dev.vars` (NEVER committed) + `ALERT_EMAIL_TO` (e.g. `ops@sansbank.xyz`) + `ALERT_EMAIL_FROM` (`alerts@sansbank.xyz` — needs a verified domain in Resend)
- Trigger: track the previous `inventory_state` per token in KV (`inventory_alert_state`); send an email ONLY on state transitions (`ok→low`, `low→out`, `out→ok` recovery) — avoids duplicate spam from the per-minute poll
- Email sketch (Resend REST):
  ```js
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'authorization': `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.ALERT_EMAIL_FROM,
      to: [env.ALERT_EMAIL_TO],
      subject: `[dashswap ${network}] ${ticker} inventory ${state}`,
      text: `${ticker} on ${network}: inventory crossed to "${state}". Remaining: ${base_duffs} base units. Top up the settlement inventory.`,
    }),
  })
  ```
- Same pattern can notify on **stuck settles** (you already alarm internally — mirror it to email if you want ops eyes)

---

## 5. One confirmation request — the fee schedule

Frontend copy now states **"flat 0.3% engine fee — same rate via our APIs"** everywhere (landing, roadmap, chat fallback, meta tags). The mainnet quote endpoint already returns `fee_bps: 30`. Confirm the web-facing engine fee is 0.3% on ALL swaps (no separate 1% web tier) — if a different web fee lands later, we'll sync the copy.

---

## 6. What the frontend already shipped for this handoff

| Piece | File | State |
|---|---|---|
| Chat widget (launcher + panel + queue fallback) | `components/Support/Chat.vue` | live |
| Inventory banners (low / out) | `components/Swap/Menu.vue` | live, hidden until fields exist |
| Inventory capture in quote | `stores/swap.ts` (`_inventoryState`) | live |
| Friendly API errors | `libs/swap-api/errors.js` | live |
| Engine status dot | `components/NetworkManager.vue` | live (market heartbeat) |
| GlitchTip telemetry (Sentry-protocol, DSN-gated) | `libs/telemetry.ts` + `plugins/telemetry.client.ts` | live, no-op until `NUXT_PUBLIC_GLITCHTIP_DSN` |

Questions → ping the frontend thread. Nice-to-have responses (none block launch): `/v1/status` landing note, inventory field ETA, chat brain ETA.
