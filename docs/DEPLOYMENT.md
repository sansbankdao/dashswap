# DEPLOYMENT.md — dashswap.xyz deploy pipeline (self-hosted, no GitHub Actions minutes)

**Why this exists**: GitHub Actions minutes are blocked on the account
(billing block). The org's answer — verified live on `evorunner` — is
**self-hosted runners**: `actions.runner.sansbankdao-<repo>.<runner>.service`
units for `btcpay-dash-evolution`, `dash-intents`, `evonext-desktop`, plus a
Gitea act-runner for evonext-mobile. Self-hosted runner minutes are FREE, so
the billing block never applies. This repo gets the same pattern.

**Target**: `testnet.dashswap.xyz` (Cloudflare Pages project +
custom-domain binding). Production (`dashswap.xyz`) follows later with the
same workflow pattern — a separate Pages project + branch protection.

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
   - `PAGES_PROJECT_TESTNET` — the project name from step 1.
   - `TESTNET_SWAP_API_KEY` — the dev key **issued against the testnet
     Worker instance** (fresh D1; ask the API team — see
     `docs/FRONTEND-HANDOFF-3-TESTNET-WORKER.md`). The production key is
     NOT valid on a separate instance.
4. Repo VARIABLE: `TESTNET_SWAP_API_BASE` — the testnet Worker's public
   route (empty until the API team confirms HANDOFF-3).
5. Optional VARIABLE: `NITRO_PRESET` — default `cloudflare-pages`.

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
