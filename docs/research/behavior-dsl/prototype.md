# BML prototype report (accordion)

## Deliverables

- Atoms: `src/behaviors/atoms/disclosure.ts`, `src/behaviors/atoms/roving-tabindex.ts`
- Composite: `src/behaviors/accordion.ts` + generated `src/behaviors/generated/accordion.ts`
- Compiler: `scripts/compile-bml.ts`
- Example IR: `examples/bml/accordion.bml.json`
- Tests: `tests/behaviors.test.ts`

## Token efficiency

- BML IR: 29 lines, ~177 tokens (chars/4)
- Generated TS module: 63 lines, ~426 tokens
- Reduction: ~0.42x (BML ~42% of generated TS size), roughly 2.4x fewer tokens.
- Hand-written accordion matches generated output byte-for-byte after formatting.

## Findings

- JSON-schema-first IR maps cleanly to existing atomic behaviors (disclosure, roving).
- a11y pattern tag (`a11y: accordion`) is descriptive only in this prototype; roles/keys are encoded in the atoms and composite.
- Compiler is deterministic and idempotent: re-running produces identical output.
- Generated module imports atoms via relative paths computed from output location.
- No CSS or framework coupling in atoms; safe to reuse across adapters.

## Test results

- `bun run check`: pass (lint, format, typecheck)
- `bun test`: 33 pass, 0 fail
