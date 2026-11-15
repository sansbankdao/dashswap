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
# From GitHub → repo Settings → Actions → Runners → New self-hosted runner
# (Linux x64) — copy the config command with a fresh REG_TOKEN:
mkdir actions-runner-dashswap && cd actions-runner-dashswap
./config.sh --url https://github.com/nyusternie/dashswap \
    --token <REG_TOKEN> \
    --name evorunner-dashswap \
    --labels self-hosted,linux,x64,evorunner \
    --work _work
sudo ./svc.sh install evorunner-dashswap   # systemd unit:
sudo ./svc.sh start                        #   actions.runner.nyusternie-dashswap.evorunner-dashswap.service
```

The workflow matches `runs-on: [self-hosted, evorunner]` — the `evorunner`
custom label is REQUIRED (plain `self-hosted` would race the other repos'
runners if any are ever converted to org-level).

## 2. evorunner prerequisites

- **DISK: currently 880 MB free of 121 G (100% full).** One build needs
  ~2 GB (node_modules + .nuxt + .output). Clean ≥3 GB before the first
  run — candidates: stale `_work` artifact caches of the other runners,
  old `act-runner` caches, journal logs. (Owner decision — nothing here
  touches other repos' files.)
- node v20.20.2 ✓, corepack (`corepack enable`, one-time) — the workflow
  activates the pinned pnpm@9.15.4 via corepack.

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
- `wrangler pages deploy .output/client` — the static client assets +
  the `_worker.js` SSR bundle (cloudflare-pages preset shape).
- Concurrency-grouped; every push to `master` deploys testnet. Production
  deploys: copy the job, rename (secrets `PAGES_PROJECT` /
  `MAINNET_*`), protect the branch.
