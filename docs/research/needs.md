# Farishan Labs Needs — what `@farishan-labs/ui` must actually serve

Research date: 2026-11-09. Companion to `README.md` (survey) and `gaps.md`
(gap audit). This file maps the UI system to the _real_ consumers, constraints,
and workflows of Farishan Han Labs so the design is driven by lab needs, not by
generic design-system fashion.

## 1. Who the lab is

- **One person (Faris Han) + AI agents** (CEO role + specialists/subagents). No
  L2 specialists staffed yet. Bus factor = 1 (mitigate via runbooks + OptMem +
  git-backed docs) (farishan-labs-toolkit E0064, E0025).
- **Burn cap ≤$300/mo for first 90 days**, ≤$500/mo after revenue justifies.
  No paid infra for a UI system (E0061).
- **Model-agnostic, open-source tooling** (OpenCode/pi) to avoid vendor lock-in
  (E0066, P-002).
- **Governance written before automation**; agents prep, humans decide on
  money/legal/public (E0063, P-010).
- **Principles P-001..P-022** (v1.3.0): never reinvent exact wheels; zero
  vendor lock-in; minimal core; programmable extensions not toggles; single
  static binary where applicable; open/shared (Apache-2.0); small and focused;
  research gate before new repo/feature; canonical files plain markdown/JSON;
  adapters only harness-aware code; CLIs follow open conventions; degrade
  gracefully.

## 2. What the lab builds (real consumers of UI)

From `~/dev/docs/PROJECTS.md` and local repos — projects that ship or prototype
interfaces:

| Consumer                         | Stack                                          | UI surface                                          | Status                                             |
| -------------------------------- | ---------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| growth-dashboard                 | Bun + React + Vite                             | Web dashboard (Gumroad MCP data, marketing tracker) | new                                                |
| side-hustle                      | Bun ws + React 19 + Tailwind v4 PWA            | Web dashboard (income, tasks)                       | pushed, M1 next (agent-readable CLI + JSON export) |
| os-sim                           | TS pnpm monorepo                               | Web renderer (React 19) + terminal (CLI)            | new (M1-M4 shipped)                                |
| nomenia                          | Bun monorepo                                   | Web app (React/Vite) + CLI                          | active (v2 AI naming)                              |
| cockpit                          | (paused)                                       | Web control plane                                   | M0 incomplete                                      |
| providers.farishan.com           | Astro                                          | Static site + data                                  | Phase 1 done                                       |
| bios-viewer                      | Python + GTK3 + WebKit                         | Native desktop (monokit design system already)      | shipped 0.2.0                                      |
| productivity-capital-dashboard   | WebKit (transparent widget)                    | Desktop widget (survives Super+D)                   | shipped                                            |
| ubuntu-native-app-starter        | Python + GTK3 + WebKit                         | Native app starter                                  | shipped                                            |
| chrome-extension-starter         | Vite + React 19 + Tailwind v4 + shadcn/base-ui | Browser extension popup/options                     | new                                                |
| web-components                   | Bun monorepo (vanilla)                         | Custom elements                                     | active                                             |
| monokit                          | CSS + playground                               | Static kit + theme playground                       | v0.2 PRD                                           |
| agent-tools / provider-dashboard | Python stdlib GUI / Astro                      | Dashboards                                          | active                                             |

Implication: the UI system must serve **web (React, Astro, vanilla), native
desktop (GTK/WebKit via Tauri/Electron-or-Python), TUI/terminal (os-sim,
OpenCode/OpenTUI), and browser extensions** — plus agent-driven surfaces. This
is the "all kinds of interfaces" requirement, and it is concrete, not aspirational.

## 3. Lab-specific needs (not generic)

### N1. Agent-readable interfaces (machine as user)

Cockpit, side-hustle M1, provider-dashboard, and os-sim all involve agents
reading/acting on UI. The UI system must expose semantic HTML + ARIA + stable
names so the accessibility tree is the agent interface (E0046-E0048). No
div-soup; text-only fallbacks where agents can't render (MCP Apps requires it,
E0039). This is a _first-class_ requirement, not polish.

### N2. Generative UI for dashboards

growth-dashboard, side-hustle, and cockpit need agent-driven surfaces: tool
results render as components, shared state, interrupts/approvals, thinking steps
(E0038, E0041-E0043). The UI system's rendering layer must be pluggable so
"agents write UI code" can replace tool-result rendering if that trend wins
(E0079).

### N3. Native desktop widgets that survive window-manager tricks

productivity-capital-dashboard and ubuntu-native-app-starter need tokens that
work in WebKit/GTK and survive Super+D (EWMH). bios-viewer already uses monokit
tokens in a GTK/WebKit app. Tokens must map to CSS vars in WebKit and to GTK
CSS where needed. No JS-heavy positioning assumptions.

### N4. TUI parity for os-sim + OpenCode

os-sim has a terminal renderer; OpenCode uses OpenTUI. The token system should
map to terminal colors/styles (ANSI) so TUI surfaces stay consistent with web.
Defer full TUI component set to v0.2; v0.1 only needs token mapping.

### N5. Fast prototyping loop (pui already proves the need)

`pui app.tsx` → scaffold+build+serve in seconds. The UI system must not slow
this down: drop-in CSS, no mandatory build step for tokens, copy-paste components
(shadcn-style open code) acceptable. Prototyping is the lab's primary UI
workflow.

### N6. Low maintenance / minimal core (P-003, P-001)

One person cannot maintain 50 components. Core must be tiny (tokens + a handful
of primitives: button, field, card, dialog, toast, empty/loading, command
palette). Everything else is composed or pulled from external libs (Base UI/
Radix patterns, Lucide icons) per P-001. Extensions are code with manifests
(P-004), not toggles.

### N7. Published, versioned, consumable package (G20-G21)

Multiple repos (side-hustle, nomenia, os-sim, cockpit, chrome-extension-starter)
need to consume `@farishan-labs/ui`. It must be published (npm/CDN) with
lockstep token+component versions and a changelog. Currently monokit is CSS-only
drop-in and web-components points at TS source — no publish pipeline.

### N8. CI/testing discipline (G17-G19)

Only workflow-kit has CI. The UI system must ship with oxlint/oxfmt + bun test

- a11y assertions in CI from day one, and serve as the template other repos
  copy (P-001: reuse the pattern).

### N9. Bun/TS ecosystem consistency

Tooling must be Bun-native (oxlint/oxfmt, bun test, bun build) and TypeScript
strict, matching pui/web-components/monokit conventions. No Node-only or Python
build steps in the core (native bindings can be separate).

### N10. Burn-cap compliance

No paid infra, no SaaS dependencies for the core. Self-hosted, open source
(Apache-2.0, P-006). Reuse existing tooling (Style Dictionary or a small
Bun-native generator) rather than buying.

### N11. Research gate (P-021) already satisfied

This research topic is the gate. Any implementation must cite it.

## 4. What the lab does NOT need (avoid scope creep)

- A 50-component styled library (Material/Ant scale) — too much maintenance.
- A design tool / Figma plugin — out of scope; tokens are hand-authored JSON.
- Multi-framework bindings beyond React + vanilla web components in v0.1 (Vue/
  Svelte/Angular defer).
- Native (SwiftUI/Compose/Flutter) in v0.1 — only if a native app ships.
- Data visualization — defer; use an external lib when needed.
- Auth, backend, database — UI system is presentation only.

## 5. Priority ranking (by lab value × cost)

1. **Tokens as SSOT (W3C DTCG)** → generated CSS (monokit) + TS constants.
   Unblocks consistency across all consumers. Cost: medium.
2. **Accessible primitives (web components)** + React wrappers. Unblocks
   side-hustle/nomenia/os-sim/cockpit UI. Cost: high but foundational.
3. **Publish pipeline (npm/CDN) + versioning**. Unblocks multi-repo consumption.
   Cost: low-medium.
4. **CI + a11y tests template**. Unblocks quality discipline. Cost: low.
5. **GenUI/agent surfaces** (AG-UI-shaped). Unblocks cockpit/side-hustle M1.
   Cost: medium-high; can be incremental.
6. **Icon system (reuse Lucide/Phosphor)**. Low cost, high polish.
7. **Theming runtime + presets** (monokit v0.2 already planned). Reuse.
8. **TUI token mapping**. Low cost, high consistency.
9. **Native token mapping (GTK/WebKit)**. Needed for bios-viewer/widgets.
10. **PHILOSOPHY.md**. Low cost, high alignment value.

## 6. Success criteria for v0.1

- A new project can `bun add @farishan-labs/ui` (or drop in CSS) and get
  consistent tokens + accessible button/field/card/dialog/toast/empty/loading.
- side-hustle or nomenia migrates at least one screen to the new system
  without regressions.
- CI (lint+test+a11y) green on the UI repo and copied to ≥1 other repo.
- tokens published as W3C DTCG JSON with generated CSS + TS.
- PHILOSOPHY.md written and referenced by AGENTS.md in consuming repos.
- No paid infra; Apache-2.0.

## 7. Questions to settle before implementation (for Faris)

1. Which consumer project should be the **first migration** to validate the
   system — side-hustle (M1, agent-readable CLI), nomenia (v2), or
   growth-dashboard (newest)?
2. Should v0.1 ship **React wrappers** or stay **web-components-only** and let
   pui consume custom elements directly?
3. Is the UI repo created **now** (research gate satisfied) or folded into
   `web-components` (avoid a new repo per P-011)?
4. Which icon set — Lucide or Phosphor — and should it be a peer dependency?
5. Should theming be **CSS-vars-only (v0.1)** with runtime provider deferred,
   or include a minimal runtime provider now (monokit v0.2 already planned)?
6. Who is the "Dita" (non-dev stakeholder) for the playground — is the
   playground even needed, or is token editing done in code?
7. GenUI scope in v0.1: token+primitive rendering only, or a minimal
   AG-UI-shaped event adapter too?
8. TUI token mapping: needed for os-sim v0.1 or deferred?

## 8. Decisions (2026-11-09, from drill-down)

1. **First validation target**: the `@farishan-labs/ui` repo's own demos/playground
   (not an external project first).
2. **React wrappers in v0.1**: none — web-components only; pui consumes custom
   elements directly (React 19 interop). Keeps core minimal (P-003).
3. **Repo strategy**: create new repo `@farishan-labs/ui` (research gate
   satisfied by this topic).
4. **Theming v0.1**: CSS-vars-only; runtime theme provider deferred (monokit v0.2
   playground covers editing).
5. **GenUI scope v0.1**: tokens + primitives only; AG-UI-shaped adapter deferred
   to v0.2.
6. **Icons**: Lucide as peer dependency (reuse, not reinvent — P-001).

Implications:

- v0.1 = W3C DTCG tokens (JSON) + generated CSS/TS + accessible web-component
  primitives (button, field, card, dialog, toast, empty/loading, command palette)
  - Lucide peer dep + CI/a11y tests + published package + PHILOSOPHY.md.
- No React wrappers, no GenUI adapter, no runtime theming in v0.1 — keeps the
  core tiny and shippable by one person.
- First external migration happens after v0.1 ships, against the repo's own
  demos as the proof.
