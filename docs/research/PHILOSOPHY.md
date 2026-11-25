# Philosophy — `@farishan-labs/ui`

> Draft v0.1 — 2026-11-09. Research basis: `research/topics/farishan-labs-ui/`
> (README.md, findings.md E0001–E0080, gaps.md G1–G31, needs.md N1–N11).
> This document is the anchor for the library. It is intended to move into the
> `@farishan-labs/ui` repo as `PHILOSOPHY.md` at repo creation.

## 0. Why this exists

Farishan Han Labs builds many small interfaces across many surfaces: web
dashboards (React, Astro, vanilla), native desktop widgets (GTK/WebKit), browser
extensions, terminal UIs, and agent-driven surfaces. Today these are served by
three overlapping, partial assets (`monokit`, `pui`, `web-components`) with no
shared philosophy, no accessibility baseline, no published package, and no
agent-facing contract.

`@farishan-labs/ui` exists to be the **one** UI system for the lab: a small,
durable, framework-agnostic foundation that works for humans _and_ for agents,
across all of those surfaces, maintained by one person with AI assistance.

It is not a 50-component styled library. It is not a design tool. It is the
glue + primitives + tokens that everything else is built on (P-001).

## 1. Core principles (in priority order)

### P1 — Behavior is separate from presentation

The single most durable principle in the field (E0001–E0005, E0060). Components
ship behavior, accessibility, and state management only. They ship **no CSS
opinions**. Visuals come from tokens + the consumer's styling engine. This is
what lets a component outlive any visual trend.

### P2 — Accessibility is a primitive-layer requirement, not polish

Every primitive implements the relevant WAI-ARIA pattern, keyboard navigation,
focus management, visible focus indicators, reduced-motion, and high-contrast
support (E0011, E0012, E0030, E0031). Accessibility is tested (axe-style) in
CI, not reviewed later. If a primitive is not accessible, it does not ship.

### P3 — The accessibility tree is the agent interface

Semantic HTML first; ARIA only to supplement (E0047). Stable roles, names,
states, and landmarks so that both assistive technology _and_ agents can parse
and act on the UI (E0046, E0048). No div-soup. Text-only fallbacks where a
host cannot render rich UI (E0039). Agent readability is a first-class
requirement, not an afterthought (N1).

### P4 — Tokens are the single source of truth

All visual values (color, spacing, radius, typography, motion, elevation) live in
**W3C Design Tokens (DTCG)** JSON (E0007). CSS, TypeScript constants, and
(nater) native/TUI outputs are _generated_ from that JSON (E0008). No hex
values, no magic numbers, no bespoke CSS variables as the canonical source.
Monokit's `--mk-version` lineage continues as a generated artifact.

### P5 — Framework-agnostic core, thin adapters

The core is plain TypeScript + web components (Custom Elements, Shadow DOM,
slots, `ElementInternals`, FACE) (E0050). React, and any future framework, is
a thin adapter layer — not a fork. One implementation of behavior; many
bindings. This is what makes "all kinds of interfaces" achievable (E0060).

### P6 — Minimal core, composable primitives

The core ships a small set: tokens, button, field, card, dialog, toast,
empty/loading state, command palette. Everything else is composed by the
consumer or pulled from external libraries (P-001). Extensions are code with a
manifest and hook points, not configuration toggles (P-004). A one-person lab
cannot maintain 50 components.

### P7 — Reuse before build

If a proven tool already does it, depend on it, aggregate it, or extend it
(P-001, P-007). Icons come from Lucide (peer dependency), not a bespoke set.
Positioning, state machines, and ARIA patterns are borrowed from Base UI /
React Aria / Radix / Zag, not reinvented. We build only the glue and the
control plane.

### P8 — Zero vendor lock-in

Open formats (DTCG, web components, semantic HTML), portable code,
self-hostable (P-002). No dependency on a single giant's proprietary service.
Consumers can fork and run fully offline. Published to npm/CDN, but the source
is the authority.

### P9 — Open and shared

Apache-2.0 (P-006). Others self-host and fork freely. Documentation and
decisions are plain markdown/JSON (P-012) so they survive any tool.

### P10 — Degrade gracefully

Every rich surface has a simpler fallback (P-022). An MCP Apps-style text-only
fallback (E0039), a no-JS token-only stylesheet, a reduced-motion path. The
system works on the lowest common denominator and enhances from there.

## 2. Human–AI interaction constraints

These are non-negotiable design constraints, not nice-to-haves. They come from
HCI/HAI research (E0014–E0026, E0067, E0068) and are enforced in review.

### H1 — Trust is calibrated, not maximized

Over-trust causes misuse; under-trust causes abandonment (E0016, E0020, E0067).
The UI makes capability and confidence visible (what the system can do, how well,
and why), supports efficient correction and dismissal, and never implies certainty
the system does not have (G1, G2, G9, G11, G16 of the HAI guidelines).

### H2 — Meaningful human control

"Humans in the loop" is not enough (E0022, E0068). Control must be timely,
informed, and effective: clear affordances to stop, override, roll back, and
escalate; recorded overrides; safe-state halting (E0023, E0024). High-impact
actions require approval. Automation bias and complacency are treated as
failure modes to design against.

### H3 — Mixed initiative, adjustable autonomy

Both human and agent can initiate; autonomy shifts with task difficulty,
uncertainty, and impact (E0021). The UI exposes who is acting and lets the
user take over at any point.

### H4 — Transparency without overload

Transparency improves shared understanding and trust calibration (E0019, E0026),
but raw reasoning dumps cause cognitive overload. Show _actionable_,
role-appropriate explanations in the loop, not verbose chain-of-thought (E0025).
Thinking steps are summarized, not streamed verbatim.

### H5 — Graceful failure and recovery

Errors are opportunities to calibrate trust (E0016). Every async surface has
loading, empty, error, and retry states. Model output is validated before
rendering; bad output falls back to text or a safe default (E0045). Schema-
adherent structured outputs reduce retry burden (E0049).

### H6 — Efficiency of invocation, dismissal, correction

Following the HAI guidelines: invoking and dismissing a service must be low-
friction; correcting mistakes must be easy (G7–G9). No modal traps, no
irreversible single-click destructive actions.

## 3. Durability stance

"Lasts forever" is an overclaim (E0072). Nothing is forever. What we _can_ do
is maximize the half-life of the system by:

1. **Separating behavior from presentation** (P1) — visuals change without
   rewriting logic.
2. **Building on standards, not trends** (P4, P5) — W3C DTCG, web components,
   semantic HTML, WAI-ARIA. Standards outlive frameworks.
3. **Keeping the core tiny** (P6) — less code, less rot.
4. **Reusing proven primitives** (P7) — borrow from Base UI / React Aria /
   Radix / Zag rather than maintaining a bespoke fork.
5. **Maintaining it** — a dedicated (if small) commitment to tests, versioning,
   and changelogs. Durability is an organizational property, not a technical one.

Durability is measured by: how long a component survives a restyle, a framework
change, or a maintainer change — not by whether the code is unchanged.

## 4. What we will not do

- Build a 50-component styled library (Material/Ant scale). Too much maintenance
  for one person.
- Build a design tool or Figma plugin. Tokens are hand-authored JSON.
- Ship React/Vue/Svelte bindings in v0.1. Web components only; adapters come
  later (N2 of needs.md).
- Ship GenUI/agent adapters in v0.1. Tokens + primitives first.
- Ship a runtime theme provider in v0.1. CSS variables only.
- Ship native (SwiftUI/Compose/Flutter) bindings in v0.1. Tokens map to native
  later, only if a native app ships.
- Ship data visualization. Use an external library when needed.
- Build auth, backend, or database features. This is a presentation system.
- Reinvent icons, positioning, or state machines that already exist (P-001).

## 5. How this relates to Farishan Labs principles

This philosophy is a specialization of `principles/` (P-001..P-022, v1.3.0):

- P-001 (never reinvent exact wheels) → P7
- P-002 (zero vendor lock-in) → P8
- P-003 (minimal core) → P6
- P-004 (programmable extensions, not toggles) → P6
- P-005 (single static binary) → CLI `pull`/`tokens` as a single binary where
  applicable
- P-006 (open and shared) → P9
- P-009 (small and focused) → P6
- P-010 (human sets direction, agents execute) → H2
- P-011/P-021 (research gate) → this document and its research topic
- P-012 (canonical files plain markdown/JSON) → P4, P9
- P-013 (adapters are the only harness-aware code) → P5
- P-020 (CLIs follow open conventions) → `pull`/`tokens` CLI
- P-022 (degrade gracefully) → P10

Where this philosophy adds to the principles: the HAI constraints (H1–H6) and
the accessibility/agent-readable requirements (P2, P3), which are specific to a
UI system and not covered by the general lab principles.

## 6. How to use this document

- **Contributors**: read this before writing code. If a PR conflicts with a
  principle here, the principle wins (or the principle is amended by a new
  research pass — P-021).
- **Consumers**: read §1 and §4 to know what to expect and what not to expect.
- **Reviewers**: check P2 (accessibility), P3 (agent readability), and H1–H6
  (HAI constraints) explicitly. These are the most commonly skipped.
- **Amendment**: changes to this document require a research pass and a version
  bump. Do not edit casually.

## 7. References

- Research topic: `research/topics/farishan-labs-ui/` (README, findings,
  gaps, needs).
- Principles: `farishan-labs/principles` (P-001..P-022, v1.3.0).
- Farishan Labs needs: `needs.md` (N1–N11, priorities, v0.1 success criteria).
- Key external references: Base UI (base-ui.com), Radix (radix-ui.com), React
  Aria (react-spectrum.adobe.com), Zag.js (zagjs.com), W3C DTCG
  (w3.org/community/design-tokens), AG-UI (docs.ag-ui.com), MCP Apps
  (blog.modelcontextprotocol.io), WAI-ARIA (w3.org/TR/wai-aria-1.2), Microsoft
  HAI Guidelines (CHI'19), Google PAIR (pair.withgoogle.com), Apple HIG
  (ML/GenAI), NN/G heuristics.
  "
  path: /home/faris/dev/labs/research/topics/farishan-labs-ui/PHILOSOPHY.md
