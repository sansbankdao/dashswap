# dashswap.xyz — local agent rules

## Repository boundary (PERMANENT RULE)

This repo — `dashswap.xyz` — is the ONLY repository assigned to agents in
this session. Every other repository is READ-ONLY:

- `dashswap-api` (the DAPI team's Worker)
- `dev-dapi-proxy`
- `yappr`
- anything else under `/Workspace` or on remote hosts

READ-ONLY means: no file edits, no `git add`/commit/push/revert/stash/
checkout, no branch or tag changes, no dependency or CI changes — even if
the change was discussed or approved in conversation. If a task seems to
require touching an external repo, STOP and ask; the owning team applies
changes there themselves.

In-flight/uncommitted work by others in an external repo is ABSOLUTELY
OFF-LIMITS — never stage it, never commit it, never push it.

Reviews of external repos stay read-only: report findings, never patch
them.

## Project workflow rules (carried from the user)

1. ONLY refactor file(s) after asking for the latest source(s).
2. Provide a (single) relative CLI command for ALL sources required.
3. ONLY output full and complete sources after refactoring.
4. DO NOT TRUNCATE any sources; use the MINIMUM DIFF required.
   Maintain 1:1 logic parity; do not omit secondary logic (debug
   sections, fallbacks, comments). Leave line-spacing unchanged.
5. ALWAYS include the relative file path in the header comment, only for
   file types that support it (e.g. no JSON).
6. NEVER read large binary payloads into context (images, PDFs, videos,
   archives) — verify via metadata only.
7. NEVER BUILD ON THIS HOST (overheating risk). Build only on the
   `sansbank` local VM (127.0.0.1:2223) or `evorunner`.
8. Commit + push when a task is completed; one item at a time; testnet
   first. Secrets are memory-only — never persisted, never logged.
