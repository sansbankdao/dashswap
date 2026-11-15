# DEPLOYMENT.md — dashswap.xyz deploy pipeline (self-hosted, no GitHub Actions minutes)

**Why this exists**: GitHub Actions minutes are blocked on the account
(billing block). The org's answer — verified live on `evorunner` — is
**self-hosted runners**: `actions.runner.sansbankdao-<repo>.<runner>.service`
units for `btcpay-dash-evolution`, `dash-intents`, `evonext-desktop`, plus a
Gitea act-runner for evonext-mobile. Self-hosted runner minutes are FREE, so
the billing block never applies. This repo gets the same pattern.

**Target**: a SINGLE Cloudflare Pages project bound to BOTH hostnames —
`dashswap.xyz` (mainnet) and `testnet.dashswap.xyz` (testnet). Hostname
detection in `stores/system.ts` picks the network at runtime; the
per-network Worker routes + dev keys are BAKED into the single build
(nuxt.config: `swapApiBaseTestnet` = `https://testnet.dashswap.xyz/v1`,
live per HANDOFF-3-ACK; keys via CI secrets). One push deploys both.

---

## 1. Register the runner (evorunner, root)

Follow the existing per-repo pattern (repo-scoped registration):

```bash
ssh evorunner
cd ~
# From GitHub → repo Settings (sansbankdao/dashswap) → Actions → Runners →
# New self-hosted runner (Linux x64) — copy the config command with a fresh
# REG_TOKEN:
mkdir actions-runner-dashswap && cd actions-runner-dashswap
curl -sLO https://github.com/actions/runner/releases/download/v2.338.2/actions-runner-linux-x64-2.338.2.tar.gz
tar xzf actions-runner-linux-x64-2.338.2.tar.gz
./config.sh --url https://github.com/sansbankdao/dashswap \
    --token <REG_TOKEN> \
    --name evorunner-dashswap \
    --labels self-hosted,linux,x64,evorunner \
    --work /mnt/runner-data/_work-dashswap     # work dir ON the volume
sudo ./svc.sh install ubuntu && sudo ./svc.sh start
# systemd unit: actions.runner.sansbankdao-dashswap.evorunner-dashswap.service
```

The workflow matches `runs-on: [self-hosted, evorunner]` — the `evorunner`
custom label is REQUIRED (plain `self-hosted` would race the other repos'
runners if any are ever converted to org-level).

## 2. evorunner prerequisites

- **DISK: SOLVED 2026-11-15** — a 100 GB volume mounted at
  `/mnt/runner-data` (nofail); the regenerable masses relocated there
  (`~/builds` → volume, `~/evonext-bundle-test` → volume); root now ~58%
  with 52 G free. Runner `_work` dirs live on the volume too.
- **NODE: the runner uses Node 24 at `/mnt/runner-data/node24/bin`**
  (installed 2026-11-15; the system node 20 is kept untouched for the
  other repos' runners — the modern toolchain needs `node:module`
  `findPackageJSON` ≥22.14). The workflow prepends that PATH; pnpm is the
  system 10.34.5 (reads the pnpm-9 lockfile ✓ — validated by the dry-run).
- **DRY-RUN VALIDATED 2026-11-15**: full `pnpm install --frozen-lockfile`
  + `NITRO_PRESET=cloudflare-pages pnpm build` on evorunner with node
  24.22.3 — build ✓, output at `./dist` (`_worker.js` + `_nuxt` +
  `_routes.json` — the shape `wrangler pages deploy dist` consumes).

## 3. Cloudflare Pages + secrets

1. Create the Pages project (dashboard): name e.g. `dashswap-testnet`,
   build it EMPTY (`wrangler pages deploy` pushes the artifact — no git
   integration needed).
2. Bind the custom domain `testnet.dashswap.xyz` to the project.
3. Repo secrets (Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_API_TOKEN` — token with **Cloudflare Pages: Edit**.
   - `CLOUDFLARE_ACCOUNT_ID`.
   - `PAGES_PROJECT` — the single Pages project bound to both hostnames.
   - `MAINNET_SWAP_API_KEY` — the production dev key
     (`dsw_dev_2a05…`, raw at sansbank VM
     `~/.cloudflare/dashswap-frontend-devkey.txt`).
   - `TESTNET_SWAP_API_KEY` — the testnet-instance dev key
     (`dsw_dev_e25c…`, raw at sansbank VM
     `~/.cloudflare/dashswap-frontend-testnet-devkey.txt`; fresh D1 per
     HANDOFF-3-ACK).
4. Optional VARIABLE: `NITRO_PRESET` — default `cloudflare-pages`.

SAFETY: while the testnet Worker route is baked, the testnet host creates
swaps ONLY against the testnet instance (no fallback to mainnet — the
store's `testnetWorkerMissing` guard blocks creation if the route is ever
removed).

> Hosting-model note: `dashswap.xyz` production is SSR Nuxt behind
> Cloudflare (`x-powered-by: Nuxt`, DYNAMIC caching — headers alone cannot
> distinguish Pages from a proxied node origin). The testnet workflow
> assumes **Cloudflare Pages + `NITRO_PRESET=cloudflare-pages`**. If
> production turns out to run a node server on a VM, tell the frontend
> team and the deploy step becomes rsync + service restart instead — one
> step in the workflow.

## 4. What the workflow does

- Skips gracefully (no failure) until the secrets exist.
- `pnpm install --frozen-lockfile` + `pnpm build` with
  `NITRO_PRESET=cloudflare-pages`, `NUXT_PUBLIC_SWAP_API_BASE_TESTNET`,
  `NUXT_PUBLIC_SWAP_API_KEY` (build-time `runtimeConfig.public`).
- `wrangler pages deploy dist` — the cloudflare-pages preset's output
  (`_worker.js` SSR bundle + static client + `_routes.json`).
- Concurrency-grouped; every push to `master` deploys testnet. Production
  deploys: copy the job, rename (secrets `PAGES_PROJECT` /
  `MAINNET_*`), protect the branch.
