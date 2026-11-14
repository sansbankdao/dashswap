# DashConnect (App Connect v2) Handoff — EvoNext Wallet

**For**: EvoNext wallet team (mobile + desktop)
**From**: DashSwap (dashswap.xyz)
**Status**: dApp side in development (Testnet first). Wallet side is the scope of this handoff.
**Spec**: App Connect DIP, dashpay/dips#181 (draft) + DIP-13 derivation paths, dashpay/dips#191
**Authoritative profile doc**: `yappr` repo, branch `staging`, `docs/APP_CONNECT_PROFILE.md` (Yappr's profile of the DIP; the DIP is the reference)
**Shared implementation**: `yappr/vendor/platform-auth/src/app-connect/` (request codec, crypto, verifier, poller, key-ring selector)
**Supersedes**: the legacy v1 `dash-key:`/`dash-st:` key exchange handoff (obsolete; no wallet may accept v1 on mainnet)

---

## 1. Protocol in one paragraph

A Platform dApp shows a QR containing a **request v2** body. The user's wallet decodes it,
shows an approval sheet, derives app-scoped session keys at normative DIP-13 paths,
registers them on the user's identity with a MASTER-signed IdentityUpdate, waits for
confirmation, then publishes an encrypted `loginKeyResponse` under the **App Connect system
contract**. The dApp polls, decrypts, verifies every granted key on-chain, and the user is
signed in. The dApp never receives the wallet seed; the wallet never grants MASTER or
TRANSFER keys.

## 2. Deployment facts (verified live via `@dashevo/evo-sdk@5.0.3`)

| Item | Network | Status |
|---|---|---|
| App Connect system contract `H8F9mP1BM55TE1ShsxPZHzhyinaMdY9bMmP85mkDhcJJ` | Testnet | **Deployed** (v1, owner `1111…1111`) |
| Same system contract | Mainnet | **Deployed** (v1, owner `1111…1111`) |
| **DashSwap anchor** `HntqfEu3PZsPDcg8ERXenx4nP8ghWMxrBej2EQ58ewc7` (the request `appId`) | Testnet | **Deployed** 2026-11-13 (v1, `requiresIdentityEncryptionBoundedKey: 2`, owner-only `appInfo`) — LIVE for wallet testing |
| Same anchor | Mainnet | Not deployed yet (the dApp then shows its "not configured" state) |
| DashSwap contract group `CXkQP3VELmmEe1YUCCH3Yhh4jZxCu7Jh3zdSDjm29kD2` | Testnet | **Registered** at anchor create (single owner, no admins; the anchor is its first member) |
| Legacy mailbox `7UaqHGBJBbRLJ4fUWS45cnud8PPUugJWoGTt1SKwHJ2P` | Testnet only | Legacy v1; ignore for new work |

Identity map on testnet (both from the settlement mnemonic; non-unique key
hashes across identities are legal on Platform — do not "merge" them):
- `DpLt5xyRoACYkXjbVa95nzzG7ZtpiEcTGWR5W6es4xmh` — settlement identity
  (Platform-credit funded; holds the tSANS/tDUSD pools; signs transfers).
- `BCZnXhWvJ2oCfFe39eokWBopoGtiCGAd9dHhLaPg65ny` — asset-lock identity
  (1e8 credits; owns the anchor contract + group).

Wallets shipping the protocol today (per Yappr's status box, 2026-10-28):
dashwallet-ios TestFlight 9.1.4 (12) (unmerged PRs #1202/#1204/#1210), and dash-wallet
(Android) PR #1604 — open; branches `feat/app-connect-dashpay-carrier` etc. exist on both
remotes (verified via `git ls-remote`). **No wallet accepts `dashpay://connect` yet** — it
is the protocol carrier, required on mainnet; on testnet the transitional `dash-key:` v2
carrier is what works today.

## 3. What EvoNext implements (priority order)

1. **`dash-key:` v2 carrier** (testnet/devnet only) — unblocks testing now.
2. **`dashpay://connect` carrier** — same body; register the scheme; ship when ready
   (required on mainnet).
3. **`dashpay://sign`** — sign one app-built state transition (replaces legacy `dash-st:`).
   Not implemented by any wallet yet; dApps keep using `dash-st:` until it exists.

## 4. Request v2 body

```
body = 0x02 ‖ appEphPub (33) ‖ appId (32) ‖ labelLen (1) ‖ label ‖ TLV*
TLV  = type (1) ‖ length (1) ‖ value (length)
```

- `appEphPub`: fresh compressed secp256k1 point, per request.
- `appId`: the app's contract id (32 B). **IDs are base58, ≤45 chars.**
- label: UTF-8 ≤64 B, no C0/C1 control or bidirectional-format characters.
- TLVs in **ascending type order**; unknown **even** type → refuse `unsupported`;
  unknown **odd** type → skip; repeats of known singleton types or out-of-order → `invalid`;
  integers big-endian; exactly one encoding exists per request.

| Type | Name | Count | Value |
|---|---|---|---|
| `0x01` | `IDENTITY_HINT` | 0–1 | identity id (32 B) the app expects |
| `0x02` | `AUTH_BINDING` | 1–4 | see below |
| `0x03` | `CONNECTION_ID` | 0–1 | 16 random bytes per (install, network) |
| `0x04` | `ENC_BINDING` | 0–8 | contractId (32) ‖ purpose (1): `1` ENCRYPTION, `2` DECRYPTION; duplicate (contract,purpose) → invalid |
| `0x05` | `MODE` | 0–1 | `1` renew (no app sends it yet) |
| `0x06` | `CREATED_AT` | 1 | u64 ms since epoch — **required**, with ≥1 `AUTH_BINDING` |

**`AUTH_BINDING`**:
`kind (1) ‖ securityLevel (1) ‖ id (32) ‖ totalBudget (u64) ‖ expiresAt (u64) [‖ nameLen (1) ‖ name]`

| Field | Rule |
|---|---|
| kind | `0` singleContract, `1` documentType, `2` contractGroup (Platform `ContractBounds` tags); unknown kind → `unsupported` |
| securityLevel | `1` CRITICAL, `2` HIGH — on any kind. **Today's wallets grant CRITICAL on contractGroup only** and refuse it elsewhere as `invalid` |
| id | contract id, or group id for contractGroup |
| totalBudget | lifetime budget in credits; `0` = none; **contractGroup must carry one** |
| expiresAt | block time in ms; `0` = none (wallet still applies one — reference policy 90 days) |
| name | documentType only, 1–64 B of `[A-Za-z0-9_-]` |

First `AUTH_BINDING` is primary (declining it declines the request); the user may toggle
the rest. Budget/expiry are proposals — the wallet clamps/offers presets but must not drop
a limit the binding asked for.

## 5. Carriers

```
dash-key:<base58(body)>?n=<m|t|d>&v=2[&cb=<https URL>]          (transitional; testnet/devnet)
dashpay://connect?v=2&n=<m|t|d>&r=<base64url(body)>[&cb=...]    (protocol carrier; mainnet)
```

- `r`: canonical base64url (RFC 4648 §5, no padding; `=`, `+`, `/`, 1-mod-4 length, non-zero
  trailing bits all refused), ≤1,366 chars, decoding to ≤1,024 B.
- `n` must equal the wallet's current network (checked before any network read).
- Freshness: refuse when `CREATED_AT` is >10 min behind or >2 min ahead of wallet clock
  → `stale`.
- Whole URI ≤4,096 B UTF-8 (checked on the raw string before decoding).
- `cb`: absolute `https`, no credentials, ≤512 chars decoded. Wallet appends `ac=<status>`
  and follows one rule for every app. Opening it is the wallet's decision; the app polls
  regardless.

Statuses (`ac`), shared by both verbs: `ok`, `declined`, `stale`, `unsupported`,
`invalid`, `failed`. Unknown `ac` maps to `failed` on the app side.

## 6. Wallet duties on `connect` (approval → response)

1. **Decode strictly** (§4). Multiple identities → ask which; `IDENTITY_HINT` limits to it.
2. **Owner consistency**: `appId` must be an existing contract; a contractGroup binding's
   group must exist; group/singleContract bindings must be owned by `appId`'s owner;
   documentType binding on a foreign contract allowed **only** for DashPay `profile`
   (never `contactRequest`, never DPNS); a system contract is never a valid `appId`.
3. **Derive + register keys** (normative DIP-13 paths — see §7) via MASTER-signed
   `IdentityUpdate`(s); Platform allows ≤6 keys per update; wait for confirmation.
4. **Publish**: delete the previous response for this (identity, appId, CONNECTION_ID)
   (index-only delete, best effort), then create the new one — **two transitions**. Both
   signed by an unbound, unbudgeted, non-expiring AUTHENTICATION key at HIGH or CRITICAL.
5. **Open `cb`** if present (after the decision; wallet's choice).
6. Never grant MASTER, unbound auth, or TRANSFER keys through App Connect.

## 7. Normative derivation paths (DIP-13, dips#191)

**Auth (session) key** — sub-feature `6'`:

```
m / 9' / coin' / 5' / 6' / 0' / identityId' / requestId'
coin'      = 5' mainnet, 1' otherwise
identityId', requestId' = 256-bit hardened levels (DIP-14)
requestId  = hash256(appEphPub33 ‖ u8(bindingIndex))   // binding position in the request,
                                                       // declined bindings included
```

Registered as `ECDSA_SECP256K1` (DIP: SHOULD) or `ECDSA_HASH160` (MAY — both wallets today
register HASH160). Keys under `6'` are never recovered from the seed during identity
recovery. Deterministic per (request, binding): a retry re-derives the same key.

**Encryption key** — sub-feature `7'`:

```
m / 9' / coin' / 5' / 7' / 0' / identityId' / contractId' / purpose' / rotation'
purpose 1' = ENCRYPTION, 2' = DECRYPTION; rotation 0' = first key
```

`contractId'` = the contract the `ENC_BINDING` names. `ECDSA_SECP256K1`, MEDIUM, bound
`singleContract(contractId)`. One key per (identity, contract, purpose), shared across
devices/apps. If the identity already has a current key the wallet holds, send it; if it
exists but the wallet does not hold it (another wallet made it), omit the slot; otherwise
register rotation `0'`. Rotation is a separate explicit wallet action, never part of login.

## 8. Response (system contract)

Contract `H8F9mP1BM55TE1ShsxPZHzhyinaMdY9bMmP85mkDhcJJ`, document type `loginKeyResponse`:

| Property | Rule |
|---|---|
| `appEphemeralPubKeyHash` | 20 B, `hash160(appEphPub)` |
| `walletEphemeralPubKey` | 33 B compressed wallet ephemeral point |
| `encryptedPayload` | 60–572 B = `28 + 32n` envelope, 1–17 keys |

(On-chain schema `required: [appEphemeralPubKeyHash, walletEphemeralPubKey, encryptedPayload]`;
single index `byRequest`. The legacy fields `contractId`/`keyIndex` are gone in v2.)

**Crypto**:

```
shared = ECDH(walletEphPriv, appEphPub).x                      (32 B)
key    = HKDF-SHA256(ikm = shared, salt = "dash:key-exchange:v1",
                     info = "app-connect:v2", 32 B)
aad    = "dash:app-connect:v2" ‖ hash160(appEphPub) ‖ $ownerId  (19 + 20 + 32 B)
body   = AES-256-GCM(key, nonce(12 random), aad, slot₀ ‖ … ‖ slotₙ₋₁)
```

Each slot is a 32-byte secp256k1 private key: granted auth bindings in request order, then
granted encryption bindings in request order (a declined binding has no slot). The app does
not rely on slot order — it classifies each key by finding it on chain. `$ownerId` is the
approving identity. Clear `shared` from memory after use.

**Test vectors**: `yappr/vendor/platform-auth/src/app-connect/vectors.json` +
`docs/APP_CONNECT_PROFILE.md` "Test vectors" — EvoNext must reproduce them byte for byte
(request bytes/URI, session key, AAD, plaintext, encrypted payload, slot public keys).

## 9. Approval sheet (what the user must see)

App id line (shortened id + full id + copy, "Not a known app" note for unknown ids —
neutral, never a refusal), the label in quotes marked as the app's own claim, one line per
binding (toggle for non-primary), budget in DASH, expiry as a date, request age, callback
host, and for CRITICAL (group) keys a warning that it can claim/spend the app's tokens.
The wallet's brand map is label-only and must never change what is accepted.

## 10. Wallet must never

- Expose seed, MASTER or TRANSFER keys to the dApp.
- Grant an unbound auth key or a MASTER key via App Connect.
- Sign a `dash-st:`/`dashpay://sign` transition without a review screen showing decoded fields.
- Reuse ephemeral keypairs; persist the ephemeral private key beyond the request.
- Refuse an unknown app id; refuse a valid `cb` because of a name-map mismatch.

## 11. `dashpay://sign` (future; replaces `dash-st:`)

```
dashpay://sign?v=2&n=<m|t|d>&exp=<unix s>&st=<base64url(transition)>[&app=<b58 id>][&cb=...]
```

Wallet: bounded decode; refuse already-signed transitions; must be for the wallet's active
identity; pick the lowest eligible **unbound, unbudgeted, non-expiring** key of the required
level (MASTER for IdentityUpdate, CRITICAL for token batches, TRANSFER for credit
transfers); describe in plain words; sign canonical bytes (overwrite
`signaturePublicKeyId`); broadcast; report via `cb?ac=`. No response document — the app
polls for the effect until `exp`.

## 12. Test plan (Testnet first)

1. Vector check: reproduce `vectors.json` exactly (codec + crypto).
2. Round-trip vs DashSwap test build: `dash-key:` v2 QR → EvoNext scans → sheet → keys
   registered → response published → dApp verifies → logged in.
3. Carrier parity: same request via `dashpay://connect` once implemented.
4. Negative: wrong network, stale `CREATED_AT`, unknown even TLV, duplicate ENC_BINDING,
   CRITICAL on non-group, unsigned `sign` transitions, replayed request (same
   CONNECTION_ID) — expect `stale`/`unsupported`/`invalid`/`failed` per §5/§6.
5. Multi-identity wallet: `IDENTITY_HINT` honored; without hint, chooser shown.

## 13. Reference code map (all verified paths, yappr branch `staging`)

| Concern | File |
|---|---|
| Full protocol profile doc | `docs/APP_CONNECT_PROFILE.md` |
| Contracts doc (anchor/group pattern) | `docs/APP_CONNECT_CONTRACTS.md` |
| Request codec, crypto, verifier, poller | `vendor/platform-auth/src/app-connect/` |
| App-side login flow + hooks | `lib/app-connect/login-flow.ts`, `hooks/use-app-connect-login.ts` |
| dApp key-ring / signing selector | `lib/app-connect/key-ring-store.ts` |
| Wallet-side reference (iOS) | `dashwallet-ios` branches `feat/app-connect-*` (TestFlight 9.1.4) |
| Wallet-side reference (Android) | `dash-wallet` branch `feat/app-connect-dashpay-carrier` (PR #1604) |

## 14. Open items

1. DIP #181/#191 are drafts — track them; carrier `dashpay://connect` required on mainnet.
2. EvoNext needs DIP-14 256-bit hardened derivation (`identityId'`, `requestId'`,
   `contractId'`) — verify the key-derivation stack in `evonext-mobile` supports it.
3. DashSwap will deploy its own anchor contract (appId) on testnet before launch — the id
   will be published in this repo's docs; wallets treat unknown app ids neutrally, so no
   wallet change is needed for that.
