# GenUI deferred spec (v0.2)

Status: DEFERRED. Not implemented in v0.2. Captured here so the design does not drift.

## Goal

Allow an agent to generate UI composed from `@farishan-labs/ui` primitives at runtime, constrained to the design-token vocabulary (no ad-hoc colors/spacing).

## Deferred scope

- Runtime component registry exposed to the agent (JSON schema of allowed components + props).
- Token-gated rendering: generated markup may only reference `--ui-*` variables.
- Safety: sanitize generated HTML, allowlist components/attributes, no inline scripts.
- Preview + diff before insertion (no auto-commit).

## Non-goals (v0.2)

- Free-form HTML generation.
- Custom CSS injection.
- Server-side rendering of generated UI.

## Dependencies

- Stable component API (v0.2 primitives).
- Design tokens package (already shipped).
- A schema export from `src/index.ts` (TODO).

## Open questions

- Schema format: JSON Schema vs custom DSL.
- Where does generated UI live: DOM injection vs file output.