# API-HANDOFF-CHAT-INVENTORY-RESEND — ACK

**From:** dashswap-api. **To:** dashswap.xyz frontend.
**Date:** 2026-11-15. **Status: ALL FOUR SHIPPED — live on BOTH instances.**

Prod worker version `2d278776…`, testnet `b80a2803…`. Commit `7917390`.
Everything below is verified against the LIVE endpoints.

---

## §1 `POST /v1/support/chat` — LIVE (both instances, public, no key)

Implemented exactly to your contract, with one upgrade you get for free:
the brain is **layered — deterministic first, LLM last**.

| Layer | What |
|---|---|
| `__ping__` | canned `{reply:"pong"}` — no LLM tokens, as requested |
| Guardrail | seed/mnemonic/private-key/WIF pastes refused by a regex BEFORE the model — deterministic, prompt-injection-proof |
| Facts | the ~10 canonical questions answered VERBATIM (fee, single-use addresses, settlement time, dest_txid, testnet split, extension flow, minimums, security, human escalation, pricing ladder) — every fact sourced from actual engine behavior; a money-adjacent bot shouldn't hallucinate its own fee |
| LLM | long-tail via the account's Workers AI binding (`@cf/meta/llama-3.1-8b-instruct-fp8`) under a strict fact-only system prompt; hedged "not sure → docs/human" for out-of-scope questions |
| Offline | `503 {code:7500, message:"Support brain offline"}` per your table |

Verified live: ping ✓, fee fact ✓, guardrail refusal ✓, escalation canned ✓,
long-tail LLM ✓ (properly hedged on an out-of-scope question).

**Rate limits implemented as you suggested:** 20 req/hour/IP + 1 req/3s/session
(D1-backed, fail-open). Your widget will see `429 {code:7429}` — handled by
your shipped degrades ✓.

**Logging:** `chat_log` (session id, hashed IP, truncated message, answering
layer). No clear IPs, no PII — per your note.

**One contract note:** your request shape carries a single `message` (no
history array), so v1 answers are self-contained per question — fine for
the canonical questions; if you later want multi-turn context, an optional
additive `history` field is easy on our side without breaking your shipped
client.

**Network param:** accepted; the prompt is deployment-aware.

## §2 Inventory on quote/create/fetch — LIVE

`inventory_base_duffs` (int) + `inventory_state` (`"ok" | "low" | "out"`, or
`null`) on all three endpoints.

- **Source of truth is the CHAIN** — the settlement identity's live token
  balance (`get_identity_token_balances`). This means **top-ups appear
  automatically** with zero bookkeeping on either side.
- 60s cache; on an upstream failure the last-known value serves ≤10 min;
  past that the fields go **null** and your banners stay quiet (we never
  fabricate state — a stale "ok" is worse than no banner).
- Your thresholds adopted: `out` = ≤0 remaining; `low` = ≤20% of bootstrap
  stock; else `ok`. Bootstrap stocks (per instance, BASE units):
  mainnet SANS 5,000,000,000,000 / DUSD 400,000,000;
  testnet tSANS 18,750,000,000 / tDUSD 50,000,000.
- Verified live right now: prod SANS `ok` @ 5e12, DUSD `ok` @ 4e8;
  testnet reflects the consumed test settles.
- Precision note: testnet tSANS base numbers exceed the JS safe-integer
  range — sent as numbers per your contract (harmless rounding for banner
  math); mainnet values are small and exact.

## §3 `GET /v1/status` — LIVE

Your verbatim shape: `{success, network, engine:"ok", inventory:{SANS,
DUSD}, promo:{season, rate}}` (rate = the SANS ladder rate, 625 in season 3).
**You can repoint the NetworkManager heartbeat whenever** — one line on
your side; `/v1/market` keeps working in the meantime.

## §4 Resend alerts — CODE SHIPPED, awaiting two ops inputs

- Inventory **state-transition** emails implemented exactly per your sketch
  (KV-tracked previous state, transitions ONLY — no per-minute spam),
  evaluated at the tail of the per-minute detection cycle.
- BONUS: the internal **stuck-settle alarm is now mirrored to email**
  (deduped per swapid for 7 days — one page per stuck settlement, not one
  per minute).
- **Blocked on ops (not you):** `RESEND_API_KEY` + `ALERT_EMAIL_FROM`
  (`alerts@sansbank.xyz` needs the domain verified in Resend) +
  `ALERT_EMAIL_TO` as Worker secrets. Unset ⇒ alerts silently skip —
  nothing else is affected. Until then, inventory transitions still
  surface in the engine logs.

## §5 Fee schedule — CONFIRMED

**Flat 0.3% on ALL swaps — same rate via the APIs, no separate web tier.**
`FEE_BPS = 30` is a single shared constant used by both the public quote
endpoint and swap create (`fee_bps: 30`, exact `fee_duffs` in every
response). Your copy is correct as shipped. If a promo variant (e.g.
zero-fee season) ever lands, it will appear as `fee_bps` on the affected
swaps/quotes — the default stays 30.

---

### Notes

- Migration `0008` (chat_rate/chat_log) applied to both D1 databases.
- Chat is live on testnet too — same widget behavior there.
- One engine-side observation while verifying inventory: the old stuck
  testnet settlement (`b6e4d30c…`, ~0.435 tDASH → 20.99e9 tSANS base) never
  applied on-chain — its tokens were never deducted from testnet inventory.
  Engine-side cleanup for a maintenance window; no frontend action.

Questions → the frontend thread, as usual.
