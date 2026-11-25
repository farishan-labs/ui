# Gap Audit — Farishan Labs UI vs. needs

Research date: 2026-11-09. Scope: what Farishan Labs must fill that existing
UI systems do not, given lab constraints (Bun/TS, oxlint/oxfmt, one-person
AI-assisted, ≤$300/mo burn, P-001..P-022).

## Method

Cross-referenced: (a) subagent survey of headless/styled/token/cross-platform/AI-era
systems; (b) HCI/HAI foundations; (c) local audit of monokit/pui/web-components/
principles/toolkit. Each gap tagged with what would close it.

## Per-area findings

### A. Accessibility (biggest gap)

Strengths: web-components `core` notes a11y (aria labels, live regions, escaping);
React Aria/Base UI/Radix set the bar (WAI-ARIA + WCAG 2.2, keyboard, focus, AT
testing).
Gaps:

- G1: No systematic keyboard navigation/focus management/focus rings/reduced-motion/contrast guarantees in monokit or web-components.
- G2: No a11y assertions in tests (axe-style) anywhere.
- G3: AI-generated content accessibility (alt text/captions/transcripts) has few norms (E0076).
- G4: Cognitive accessibility (plain language, reduced memory) only supplemental (E0013).
  Close by: adopt WAI-ARIA patterns from Base UI/React Aria as the primitive spec;
  add axe tests in CI; define reduced-motion + contrast tokens; author content
  guidelines for AI-generated media.

### B. Framework bindings

Strengths: web-components are framework-free (P-002); pui gives React fast path.
Gaps:

- G5: No React interop for custom elements in pui flow; no Vue/Svelte wrappers.
- G6: No documented custom-element usage in React 19 (ref forwarding, events).
  Close by: ship React wrappers (thin) over web-components core; document
  custom-element consumption; keep core framework-free.

### C. AI-era / agent integration

Strengths: monokit v0.3 plans MCP + CLI; AG-UI/MCP Apps define protocols.
Gaps:

- G7: No machine-readable component/token metadata (schema) today.
- G8: No GenUI rendering path (tool result → component) in any lab asset.
- G9: No interrupts/HITL/approval flows, no shared state/streaming, no
  thinking steps, no agent steering.
- G10: No text-only fallback requirement enforced (MCP Apps requires it).
- G11: No accessibility-tree/agent-friendly DOM contract (semantic HTML,
  ARIA, stable names) enforced.
  Close by: define a component/token JSON schema (W3C DTCG + component manifest);
  implement MCP server + `pull` CLI (monokit v0.3); add GenUI adapter examples;
  enforce semantic-HTML/ARIA in component authoring guide and tests.

### D. Cross-platform

Strengths: native-gui-rendering topic covers X11/Wayland/GTK/WebKit; Tauri/Electron
available.
Gaps:

- G12: All UI assets web-only; no responsive token scale, motion/spacing scales
  beyond 6 steps, no high-contrast/print.
- G13: No native (SwiftUI/Compose/Flutter) or TUI (Ink/Bubble Tea/Textual/Ratatui/
  OpenTUI) bindings; "all kinds of interfaces" unfulfilled.
- G14: No color modes beyond binary dark/light.
  Close by: responsive + motion tokens; high-contrast mode; document how tokens
  map to native/TUI (design-token pipeline per platform); defer native bindings
  until web core stable (P-001/P-009).

### E. Tokens standard

Strengths: monokit token versioning (`--mk-version`); W3C DTCG stable 2025-10.
Gaps:

- G15: Bespoke CSS vars, not W3C DTCG JSON; no multi-theme resolver; no
  color-space support (P3/Oklch).
- G16: No generated outputs (CSS/TS/iOS/Android) from a canonical source.
  Close by: migrate canonical token source to W3C DTCG JSON; use Style Dictionary
  (or a Bun-native generator) to emit CSS (monokit) + TS constants + docs.

### F. Testing

Strengths: pui 100% line/function coverage; web-components happy-dom tests.
Gaps:

- G17: monokit has zero tests.
- G18: No visual regression anywhere.
- G19: CI gap — only workflow-kit has GitHub Actions; UI repos have no CI.
  Close by: add oxlint/oxfmt + bun test to every UI repo; a11y assertions;
  visual regression (optional, later); branch protection.

### G. Versioning & distribution

Strengths: monokit `--mk-version` mirrored in package.json; SemVer changelog.
Gaps:

- G20: No npm package, no CDN, no publish pipeline; component versions not tracked.
- G21: web-components version 0.0.1, `main` points at TS source, no publish.
  Close by: publish versioned packages (npm/CDN) with lockstep token+component
  versions; automate via CI (P-005 single binary where applicable — CLI).

### H. Docs

Strengths: web-components per-package READMEs + USAGE; monokit README + PRD.
Gaps:

- G22: No component catalogue with props/events/slots.
- G23: No theming guide, migration notes, accessibility authoring guide.
  Close by: docs site (or README-per-component) with API tables; theming + a11y
  guides; keep canonical files plain markdown/JSON (P-012).

### I. Missing product surfaces

Gaps:

- G24: No icon system (hatched placeholders only).
- G25: No form validation patterns.
- G26: No data-viz.
- G27: No empty/loading/toast/notification/command palette states.
- G28: No runtime theme provider (CSS vars only).
  Close by: prioritize empty/loading/toast/command-palette as primitives; icon
  system via external (P-001 don't reinvent — use Lucide/Phosphor); defer data-viz.

### J. Durability / philosophy

Strengths: principles P-001..P-022; monokit monochrome-first; headless trend.
Gaps:

- G29: No written philosophy doc for @farishan-labs/ui (BaseUI-like) — risk of
  drift; need a PRINCIPLES/PHILOSOPHY.md in the repo.
- G30: "Lasts forever" is overclaim (E0072); must frame durability as
  separation + standards + maintenance, not immutability.
- G31: Trust calibration (not maximization) and meaningful human control must be
  first-class design constraints, not afterthoughts (E0067/E0068).
  Close by: author PHILOSOPHY.md with durable principles + HAI constraints;
  calibrate trust, meaningful control, accessibility tree as agent interface.

## Cross-cutting findings

1. The lab already has 3 partial UI assets (monokit, pui, web-components) that
   overlap; consolidation under one philosophy is needed, not a 4th asset (P-009).
2. The single most durable bet is **headless primitives + W3C DTCG tokens +
   framework-agnostic core + accessibility-first**, with React wrappers for the
   pui flow (E0001-E0010, E0060).
3. AI-era support is mostly a protocol/adoption problem (AG-UI, MCP Apps), not a
   new component set; the UI system's job is to render tool results, shared state,
   interrupts, and fallbacks (E0038-E0043).
4. "For all kinds of interfaces" should be phased: web first (web components +
   tokens), then TUI/CLI (OpenTUI/Ink/Textual patterns), then native (Tauri/Electron
   reuse web; SwiftUI/Compose/Flutter only if a native app ships).

## Strengths to preserve

- monokit tokens/versioning/drop-in CSS/no-build-step.
- web-components `core` base class + happy-dom test infra + a11y intent.
- pui React+Tailwind fast path + coverage discipline.
- principles P-001..P-022 and Apache-2.0 open/shared.

## Recommendations (maps to README §Recommendation)

1. Consolidate into `@farishan-labs/ui` rather than a 4th asset (P-001/P-009).
2. Canonical token source = W3C DTCG JSON → generate CSS (monokit) + TS (E0007).
3. Component core = framework-free web components (extend `core`) with React
   wrappers; accessibility-first per Base UI/React Aria (E0001-E0003).
4. Add GenUI/agent support via AG-UI-shaped event protocol + MCP Apps text
   fallback + semantic HTML/ARIA (E0038-E0040, E0046-E0048).
5. Author PHILOSOPHY.md with durable principles + HAI constraints (trust
   calibration, meaningful control) (E0014-E0024, E0067-E0068).
6. Phase cross-platform: web → TUI → native (E0057-E0060).
7. Fix CI/testing/versioning/docs gaps before feature expansion (G17-G23).
8. Reuse external icon sets (P-001); defer data-viz.

## Sources

- Subagent reports (HCI/HAI, design systems, cross-platform, AI-era, local audit).
- `topics/native-gui-rendering/`, `topics/farishan-labs-toolkit/`.
- `principles/TOP_PRINCIPLES.md`.
- Local repos: monokit, pui, web-components.
