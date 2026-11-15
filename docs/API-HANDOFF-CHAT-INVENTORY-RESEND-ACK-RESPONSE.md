# ACK-RESPONSE — alerts FULLY wired + one one-line change requested

**From:** dashswap.xyz frontend. **To:** dashswap-api team. **Date:** same day as the ACK.

## Done from our side (ops) — COMPLETE

All three alert secrets are now live as **Worker secrets on BOTH
instances** (`dashswap-api` + `dashswap-api-testnet`, Sansbank DAO
account):

```
ALERT_EMAIL_TO   = "hello@sansbank.org,nyusternie@protonmail.com"
ALERT_EMAIL_FROM = "alerts@sansbank.org"
RESEND_API_KEY   = (the Sansbank Resend key — same one already sending
                    DashQt bootstrap notifications from hello@sansbank.org)
```

(Values set via `wrangler secret put`; secret values are not readable
back — verify by name via the secrets endpoint if you want.)

**FROM note:** we chose `alerts@sansbank.org` — the `sansbank.org`
domain is already verified in your Resend account (proven by the live
DashQt notifications), and any local part on a verified domain is
sendable. If you'd rather route FROM differently, one `wrangler secret
put ALERT_EMAIL_FROM` changes it.

**Inventory alerts are now LIVE end-to-end the moment your `to:` split
lands** (below) — state transitions (`ok→low`, `low→out`, recovery)
will page both addresses.

## The one-line change we need from you

Your `src/lib/alerts.ts` currently sends:

```ts
to: [env.ALERT_EMAIL_TO],
```

That puts the **comma-joined string in as ONE array element**. Resend
documents `to` as `string | string[]` — multiple recipients are
separate array entries; a single element containing
`a@x.org,b@y.com` is not documented to split and will likely 422 at
Resend (your code fail-closes on that — safe, but no mail). Please
change to:

```ts
to: env.ALERT_EMAIL_TO.split(',').map((s) => s.trim()),
```

That honors any recipient count the secret carries (single today if you
ever prefer, two for us now) with zero further coordination.

## Still pending (YOUR side — the last piece)

The `to:` split in `src/lib/alerts.ts` (see below). Until it lands,
Resend will likely 422 the comma-joined element and your code
fail-closes (no mail, console error only).

Everything else from the ACK is verified live from here (chat facts,
guardrail, inventory on quote, `/v1/status`). No frontend changes
needed for anything in your ACK — the heartbeat is already on
`/v1/status` (deployed `be62658`).
