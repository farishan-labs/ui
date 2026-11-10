# Layout rules — `@farishan-labs/ui`

Conventions for page/app-shell layout. These are _policies_, not token
values; values come from `@farishan-labs/design-tokens` (P4). Amend here
freely (no research gate required); promote to a principle in
`farishan-labs/principles` only if it becomes cross-cutting across all lab
web apps.

## App shell (non-marketing web app)

- Padding: `space.6` (24px) on all sides — i.e. `var(--ui-space-6, 1.5rem)`.
- **No max-width.** App shells are full-bleed; content flows to the viewport
  edge and manages its own internal measure (e.g. `max-width: 65ch` on prose).
- Rationale: dashboards/tools are not reading surfaces; constraining width
  wastes horizontal space and forces premature wrapping.

## Marketing / landing pages

- Padding: `space.6` (24px) horizontal minimum.
- Max-width: `48rem` (768px) centered, or the marketing template's chosen
  measure. Marketing pages _are_ reading surfaces, so a measure applies.

## Components / content measure

- Prose blocks inside any surface: `max-width: 65ch` (or `72ch`) regardless of
  shell width.
- Dialogs, cards, command palette: keep their own intrinsic max-width
  (see component specs), independent of the shell.

## Token references

- `space.6` = 1.5rem = 24px (`design-tokens/src/tokens/tokens.json`).
- If a semantic alias (`space.appShell`) is wanted, add it to
  `design-tokens` as a dimension alias of `space.6` — value stays in tokens,
  rule stays here.
