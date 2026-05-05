---
name: quality-gate
description: Run the project's TypeScript type-check, oxlint, and oxfmt formatting checks after editing any TypeScript or TSX file. Use whenever a change has been made to a `.ts`, `.tsx`, `.mts`, `.cts`, or `.d.ts` file in this repository (including new files, edits, refactors, renames, or moves). Acts as the local CI gate before reporting a task as complete.
license: MIT
metadata:
  version: '1.0.0'
---

# Quality Gate

Every change to a TypeScript or TSX file in this project must pass three gates before the task is considered done:

1. **Type-check** — `bun run typecheck` (runs `react-router typegen && tsc`)
2. **Lint** — `bun run lint` (runs `oxlint`)
3. **Format** — `bun run format` (runs `oxfmt .` in check mode)

There is a single composite script that runs all three sequentially: `bun run check`.

## When to run

Run the gate after **any** of the following:

- Editing the body of a `.ts` / `.tsx` / `.mts` / `.cts` / `.d.ts` file
- Creating a new `.ts` / `.tsx` file
- Renaming or moving a TypeScript file (imports may need updating)
- Editing `tsconfig.json`, `.oxlintrc.json`, `.oxfmtrc.json`, or `package.json` dependencies that affect type resolution or lint rules
- Editing route config (`react-router.config.ts`, `app/routes.ts`) — typegen output changes
- Before reporting a coding task complete to the user
- Before committing or opening a pull request

You do **not** need to run the gate when only non-TypeScript files changed (markdown, images, plain CSS without `@apply` type concerns, etc.). Use judgment: if the change cannot affect type-checking, linting, or formatting of TS/TSX, skip it.

## How to run

Always prefer the composite script. Run it from the project root:

```bash
bun run check
```

This runs `lint`, `format`, then `typecheck` in order. If you want to run them individually for debugging:

```bash
bun run lint        # oxlint
bun run format      # oxfmt . (check only)
bun run typecheck   # react-router typegen && tsc
```

## How to interpret results

The gate has three possible outcomes per step.

### Pass

All three steps exit `0`. Report success and continue.

### Auto-fixable failure

Lint or format failures that the project's auto-fix scripts can resolve cleanly. Use:

```bash
bun run check:fix   # runs `oxlint --fix` then `oxfmt --write .`
```

Then re-run `bun run check` to confirm everything is green. If `check:fix` resolves all failures, do not surface the original error to the user — just mention that the formatter/linter applied auto-fixes and the gate now passes.

**Important:** never run `check:fix` blindly when the failure is a *type* error. Auto-fix only addresses lint and format. Type errors require a real code change.

### Genuine failure

Type errors, lint rules that have no auto-fix, or format conflicts the formatter cannot reconcile. These require human judgment:

1. Read the full error output — do not truncate.
2. Diagnose the root cause. Do not silence the error with `// @ts-ignore`, `// @ts-expect-error`, `// oxlint-disable`, or `any` unless the user explicitly asks for a temporary suppression and there is a tracked follow-up.
3. Fix the underlying code.
4. Re-run `bun run check` until it passes.

## Reporting

After the gate runs, summarize the outcome in one line. Examples:

- `Quality gate: passed (typecheck, lint, format).`
- `Quality gate: passed after auto-fix (oxfmt rewrote 2 files).`
- `Quality gate: failing — 1 type error in [app/routes/home.tsx:42](app/routes/home.tsx:42). Fixing now.`

Do not paste the full tool output unless the user asks. Link to the offending file with `file_path:line_number` so the user can jump to it.

## Tooling notes specific to this project

- **Package manager:** `bun`. Lock file is `bun.lock`. Use `bun run <script>` rather than `npm`/`pnpm`/`yarn`.
- **TypeScript:** strict mode via `tsconfig.json`. Routes generate types via `react-router typegen` — running `typecheck` regenerates them, so do not commit stale `.react-router/types/` output.
- **oxlint config:** `.oxlintrc.json`. Project-specific rules live there; do not bypass with inline disables without justification.
- **oxfmt config:** `.oxfmtrc.json`. Quote style and other preferences are defined there. The check script does not write — use `bun run format:write` (or `bun run check:fix`) when you need to apply formatting.
- **CI parity:** `.github/workflows/` should call `bun run check`. If you add a new gate step here, mirror it in CI.

## Quick decision tree

1. Did this turn touch a `.ts` / `.tsx` file or related config? → If no, skip the gate.
2. Run `bun run check`.
3. Pass? → Report success, finish.
4. Fail with lint/format issues only? → Run `bun run check:fix`, re-run `bun run check`, then report.
5. Fail with type errors? → Diagnose, fix the code, re-run, then report.
6. Never report a TypeScript-affecting task as complete with a failing gate.
