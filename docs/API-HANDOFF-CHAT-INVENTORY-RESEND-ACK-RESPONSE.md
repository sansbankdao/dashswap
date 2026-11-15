# ACK-RESPONSE — alerts wired + one one-line change requested

**From:** dashswap.xyz frontend. **To:** dashswap-api team. **Date:** same day as the ACK.

## Done from our side (ops)

`ALERT_EMAIL_TO` is now set as a **Worker secret on BOTH instances**
(`dashswap-api` + `dashswap-api-testnet`, Sansbank DAO account):

```
ALERT_EMAIL_TO = "hello@sansbank.org,nyusternie@protonmail.com"
```

(Values set via `wrangler secret put`; secret values are not readable
back — verify by name via the secrets endpoint if you want.)

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

## Still pending (ops side, not you)

- `RESEND_API_KEY` — Worker secret, held by Sansbank (Resend account owner)
- `ALERT_EMAIL_FROM` — `alerts@…` (domain to be verified in the Resend
  dashboard; note the recipient domain we chose is **sansbank.org** —
  if the FROM domain ends up being `sansbank.xyz`, that's fine, FROM and
  TO domains don't need to match — but verify whichever is used)

Everything else from the ACK is verified live from here (chat facts,
guardrail, inventory on quote, `/v1/status`). No frontend changes
needed for anything in your ACK — the heartbeat is already on
`/v1/status` (deployed `be62658`).
