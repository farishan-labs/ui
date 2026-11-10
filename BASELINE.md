# Global CSS baseline — `@farishan-labs/ui`

Cross-cutting CSS baselines applied to `body`/`:root` (or the app's root
element) on every Farishan Labs web surface. These are _policies_, not
token values (P4); values live in `design-tokens`.

Amend here freely (no research gate). Promote to a principle in
`farishan-labs/principles` only if it becomes cross-cutting across all
lab web apps and needs enforcement.

## Font smoothing (antialiased)

Always apply antialiased font smoothing on `body`:

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- Tailwind consumers: `class="antialiased"` on `<body>` (Tailwind's
  `antialiased` utility emits the same two declarations).
- Non-Tailwind consumers: paste the raw CSS above (or import a future
  `@farishan-labs/ui/baseline.css`).

## Other baselines (keep this list short)

- `box-sizing: border-box` on `*, *::before, *::after`.
- `:focus-visible` outline using `color.accent.default` (never remove
  focus outlines; P2).
- `prefers-reduced-motion: reduce` disables non-essential transitions.
- Respect `prefers-color-scheme` (light/dark via resolver).

## What does NOT belong here

- Layout (padding, max-width, measure) → `LAYOUT.md`.
- Token values (colors, spacing, radii) → `design-tokens`.
- Component-specific styles → the component.
