<!-- bun tooling -->

# @farishan-labs/ui — Bun + oxlint/oxfmt

This project uses Bun as runtime, package manager, test runner, and bundler.
Dev tooling is standalone `oxlint` (lint) and `oxfmt` (format).

## Commands

- `bun install` — install dependencies
- `bun test` — run tests
- `bun test --coverage` — run tests with coverage (100% lines + functions per file)
- `bun run lint` — lint with oxlint
- `bun run fmt` — format with oxfmt (writes in place)
- `bun run fmt:check` — check formatting
- `bun run check` — lint + format check + typecheck (CI gate)
- `bun run gen:tokens` — regenerate CSS/TS from tokens/tokens.json

## Notes

- Runtime stays dependency-free; `oxlint`/`oxfmt`/`happy-dom` are devDependencies only.
- Coverage thresholds are enforced per file (Bun behavior), 100% lines + functions.
- Branch/statement coverage is advisory (Bun does not enforce them).
- No pre-commit hook; CI (`bun run check` + tests) is the gate.
- Philosophy: see PHILOSOPHY.md. Research basis: research/topics/farishan-labs-ui/.
- v0.1 scope: W3C DTCG tokens + accessible web-component primitives
  (button, field, card, dialog, toast, empty/loading, command palette) +
  Lucide peer dep + CI/a11y tests + published package. No React wrappers,
  no GenUI adapter, no runtime theming in v0.1.
