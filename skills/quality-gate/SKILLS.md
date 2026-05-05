---
name: quality-gate
description: Run the project's TypeScript type-check, oxlint, oxfmt formatting, and Vitest test suite after editing any TypeScript, TSX, or Markdown file. Use whenever a change has been made to a `.ts`, `.tsx`, `.mts`, `.cts`, `.d.ts`, or `.md` file in this repository (including new files, edits, refactors, renames, or moves). Acts as the local CI gate before reporting a task as complete.
license: MIT
metadata:
  version: "1.1.0"
---

# Quality Gate

Every change to a TypeScript, TSX, or Markdown file in this project must pass four gates before the task is considered done:

1. **Type-check** — `bun run typecheck` (runs `react-router typegen && tsc`)
2. **Lint** — `bun run lint` (runs `oxlint`)
3. **Format** — `bun run format` (runs `oxfmt .` in check mode — covers `.ts`, `.tsx`, `.md`, etc.)
4. **Test** — `bun run test` (runs `vitest run --passWithNoTests`)

There is a single composite script that runs all four sequentially: `bun run check`.

## When to run

Run the gate after **any** of the following:

- Editing the body of a `.ts` / `.tsx` / `.mts` / `.cts` / `.d.ts` file
- Editing any `.md` file (e.g. `README.md`, `CLAUDE.md`, `AGENTS.md`, skill docs) — oxfmt formats markdown
- Creating a new `.ts` / `.tsx` / `.md` file
- Renaming or moving a TypeScript or Markdown file (imports or links may need updating)
- Editing `tsconfig.json`, `.oxlintrc.json`, `.oxfmtrc.json`, `vitest.config.ts`, or `package.json` dependencies that affect type resolution, lint rules, formatting, or tests
- Editing route config (`react-router.config.ts`, `app/routes.ts`) — typegen output changes
- Adding, removing, or modifying any `*.test.ts(x)` / `*.spec.ts(x)` file under `app/` or `tests/`
- Before reporting a coding task complete to the user
- Before committing or opening a pull request

You do **not** need to run the gate when only non-source files changed (images, binary assets, plain CSS without `@apply` type concerns, etc.). Use judgment: if the change cannot affect type-checking, linting, formatting, or tests, skip it.

## How to run

Always prefer the composite script. Run it from the project root:

```bash
bun run check
```

This runs `typecheck`, `lint`, `format`, then `test` in order. If you want to run them individually for debugging:

```bash
bun run typecheck   # react-router typegen && tsc
bun run lint        # oxlint
bun run format      # oxfmt . (check only)
bun run test        # vitest run --passWithNoTests
```

For iterative test-driven work, use `bun run test:watch` — but the gate itself uses the one-shot `test` script.

## How to interpret results

The gate has three possible outcomes per step.

### Pass

All four steps exit `0`. Report success and continue.

### Auto-fixable failure

Lint or format failures that the project's auto-fix scripts can resolve cleanly. Use:

```bash
bun run check:fix   # runs `oxlint --fix` then `oxfmt --write .`
```

Then re-run `bun run check` to confirm everything is green. If `check:fix` resolves all failures, do not surface the original error to the user — just mention that the formatter/linter applied auto-fixes and the gate now passes.

**Important:** never run `check:fix` blindly when the failure is a _type_ or _test_ error. Auto-fix only addresses lint and format. Type errors and test failures require a real code change.

### Genuine failure

Type errors, lint rules with no auto-fix, format conflicts the formatter cannot reconcile, or failing Vitest assertions. These require human judgment:

1. Read the full error output — do not truncate.
2. Diagnose the root cause. Do not silence the error with `// @ts-ignore`, `// @ts-expect-error`, `// oxlint-disable`, `any`, `it.skip`, or `expect.assertions(0)` unless the user explicitly asks for a temporary suppression and there is a tracked follow-up.
3. Fix the underlying code (or the test, if the test is genuinely wrong — but prefer fixing production code).
4. Re-run `bun run check` until it passes.

## Reporting

After the gate runs, summarize the outcome in one line. Examples:

- `Quality gate: passed (typecheck, lint, format, test).`
- `Quality gate: passed after auto-fix (oxfmt rewrote 2 files).`
- `Quality gate: failing — 1 type error in [app/routes/home.tsx:42](app/routes/home.tsx:42). Fixing now.`
- `Quality gate: failing — 1 test failure in [app/lib/foo.test.ts:18](app/lib/foo.test.ts:18). Fixing now.`

Do not paste the full tool output unless the user asks. Link to the offending file with `file_path:line_number` so the user can jump to it.

## Tooling notes specific to this project

- **Package manager:** `bun`. Lock file is `bun.lock`. Use `bun run <script>` rather than `npm`/`pnpm`/`yarn`.
- **TypeScript:** strict mode via `tsconfig.json`. Routes generate types via `react-router typegen` — running `typecheck` regenerates them, so do not commit stale `.react-router/types/` output.
- **oxlint config:** `.oxlintrc.json`. Project-specific rules live there; do not bypass with inline disables without justification.
- **oxfmt config:** `.oxfmtrc.json`. Quote style and other preferences are defined there; it formats markdown as well as TypeScript. The check script does not write — use `bun run format:write` (or `bun run check:fix`) when you need to apply formatting.
- **Vitest config:** `vitest.config.ts`. Picks up `app/**/*.{test,spec}.{ts,tsx}` and `tests/**/*.{test,spec}.{ts,tsx}`, runs in `node` environment. The `--passWithNoTests` flag means an empty suite is not a failure — but a real failing assertion is.
- **CI parity:** `.github/workflows/` should call `bun run check`. If you add a new gate step here, mirror it in CI.

## Quick decision tree

1. Did this turn touch a `.ts` / `.tsx` / `.md` file or related config? → If no, skip the gate.
2. Run `bun run check`.
3. Pass? → Report success, finish.
4. Fail with lint/format issues only? → Run `bun run check:fix`, re-run `bun run check`, then report.
5. Fail with type errors or test failures? → Diagnose, fix the code, re-run, then report.
6. Never report a TypeScript-, Markdown-, or test-affecting task as complete with a failing gate.
