# FRONTEND-HANDOFF-3 — testnet Worker instance for testnet.dashswap.xyz

**For:** `dashswap-api`. **From:** `dashswap.xyz` (frontend).
**Date:** 2026-11-15. **Supersedes nothing** — this is a NEW deployment
request; HANDOFF-2/2-ACK items are all landed.

---

## 0. The decision (platform owner, 2026-11-15)

`testnet.dashswap.xyz` deploys FIRST; production follows. The frontend is
READY: commits `74ce5ca`→`6d9f6cf`→`8466a9a` (extension integration parts
1–3, network-aware swap API base), builds green, `stores/system.ts`
already maps the `testnet.dashswap.xyz` host to the testnet network.

## 1. The one blocker: the Worker is single-network and MAINNET

`wrangler.jsonc` has `"DAPI_NETWORK": "mainnet"` (d272700) and one Worker
serves one network. A testnet-labeled frontend pointing at
`dashswap.xyz/v1` would create **real-money mainnet swaps** — not
acceptable. The engine is testnet-proven (tSANS + tDUSD settled E2E,
on-chain verified, before the mainnet flip).

**Ask #1 — stand up the TESTNET Worker instance:**
- Same code, `"DAPI_NETWORK": "testnet"`.
- OWN D1 database + KV namespaces (fresh state; the production
  instances' data stays untouched).
- Same cron; the D5 monitor surface takes `network` per request
  (`core.sansbank.dev/execute`, verified working for testnet during the
  first swaps).
- `PROMO_WEEK` / KV `promo_week` on the testnet instance (your runbook).
- Public route: your choice — e.g. a Worker route
  `testnet.dashswap.xyz/v1/*` (same Cloudflare zone as production, zero
  DNS work) or a workers.dev route. **Reply with the exact URL** — the
  frontend consumes it as a build variable (`TESTNET_SWAP_API_BASE` →
  `NUXT_PUBLIC_SWAP_API_BASE_TESTNET`).

**Ask #2 — issue a dev key against the testnet instance:**
The D1 is fresh; `pnpm exec tsx scripts/issue-dev-key.ts "dashswap.xyz
testnet frontend"` against it. The production key
(`61a7f310…`, `dsw_dev_2a05…`) does NOT exist there. The raw key goes to
the sansbank VM like last time; we wire it as the
`TESTNET_SWAP_API_KEY` build secret.

## 2. Confirmations already handled (no action)

- `network` on create/fetch: resolved via your ACK appendix (3ef8778) —
  top-level `{success, swap, network}`; our client carries it.
- Public `/v1/quote`, derived `ticker/SANS`, `fee_duffs`/`dest_txid` —
  integrated and verified live (our `1b6fb05`).

## 3. Our status while you work

- Deploy pipeline: `.github/workflows/deploy-testnet.yml` +
  `docs/DEPLOYMENT.md` in place (self-hosted evorunner runner; skips
  until the Pages secrets land — org's standard billing-block pattern).
- Extension integration (pshenmic v1.5.3): connect + credit/token
  transfers shipped; App Connect v2 orchestration constraint documented
  (`6d9f6cf`) — extension users are Phase-1 auth + per-ST approvals.
- First live test (0.1 tDASH → tSANS through the UI, both sides
  tracing) the moment the testnet Worker + deploy land. EvoNext scanner
  remains the only external unknown for the QR flow.

## 4. Questions

1. Route for the testnet instance (ask #1) — `testnet.dashswap.xyz/v1/*`
   or workers.dev?
2. Will the testnet instance share the promo ladder + DASH feed (KV
   replication), or run its own season (testnet pricing independent of
   mainnet)? Either is fine — we read it live; just confirm intent.
3. Does the testnet instance get its own `DEX_WALLET_MNEMONIC`-derived
   settlement identity, or do we re-register the SAME mnemonic's identity
   (the settlement identity `DpLt5xyRo…` exists on testnet with pool
   balances already funded for the proven swaps)? Reusing it = zero extra
   funding; a fresh identity = fresh inventory decision on your side.

— dashswap.xyz frontend team
