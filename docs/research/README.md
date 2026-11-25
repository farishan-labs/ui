---
id: farishan-labs-ui
title: Farishan Labs UI — a UI system for the AI era
research_date: "2026-11-09"
mode: personal
timebox: ~2 hours (standard)
status: Research complete (2026-11-09). Validated against local assets (monokit, pui,
  web-components) and principles P-001..P-022.
evidence_status: mixed
---

# Farishan Labs UI — a UI system for the AI era

Research date: 2026-11-09
Mode: personal
Timebox: ~2 hours (standard)
Status: Research complete (2026-11-09). Validated against local assets (monokit, pui, web-components) and principles P-001..P-022.
Evidence status: mixed (gap audit E0001-E0080; needs.md N1-N11)

## Problem & Scope

Farishan Labs needs a UI system for `@farishan-labs/ui`: a user interface for the
AI era that is "far better than monokit", with solid philosophy and principles
that last (like BaseUI) — but not only for React; for **all kinds of interfaces**
(web, native desktop, CLI/TUI, agents, generative UI, etc.).

Inputs: existing `monokit` (CSS token kit), `pui` (single-React-tsx bundler),
`web-components` (vanilla custom elements), `nomenia` (naming tool UI); lab
constraints (Bun/TS, oxlint/oxfmt, one-person AI-assisted, ≤$300/mo burn,
P-001..P-022); grounding in HCI/HAI research, not just component libraries.

In scope: survey UI systems across frameworks/platforms; identify durable
philosophies/principles; map AI-era interaction paradigms; identify gaps Farishan
Labs must fill; recommend architecture/philosophy for `@farishan-labs/ui`.

Out of scope: implementing the library; picking a single framework binding
(strategy recommended only); visual design/theming details beyond tokens.

## TL;DR

- **Durable bet = headless primitives + W3C DTCG tokens + framework-agnostic
  core + accessibility-first**, with React wrappers for the pui flow. This is
  what Base UI/Radix/React Aria/Zag all converge on (E0001-E0005, E0007).
- **AI-era support is a protocol/adoption problem**, not a new component set:
  render tool results, shared state, interrupts, fallbacks per AG-UI + MCP Apps
  (E0038-E0040). Semantic HTML/ARIA accessibility tree doubles as the
  agent interface (E0046-E0048).
- **Consolidate, don't create a 4th asset**: extend `web-components` core +
  `monokit` tokens + `pui` React path under one philosophy (P-001, P-009).
- **Phase cross-platform**: web first (web components + tokens) → TUI/CLI →
  native (Tauri/Electron reuse web; native frameworks only if a native app ships).
- **Trust must be calibrated, not maximized**; "human in the loop" is
  insufficient framing — meaningful human control needs governance + design-time
  structures (E0067, E0068).
- **"Lasts forever" is an overclaim**; durability = separation + standards +
  maintenance, not immutability (E0072). Write a PHILOSOPHY.md to anchor it.
- **Fix CI/testing/versioning/docs gaps before feature expansion** (G17-G23).

## Definition / Context

**UI system** here = the full stack a lab uses to build interfaces: design
tokens, accessible component primitives, framework bindings, theming, testing,
docs, and (new) agent-facing surfaces. Not a single CSS file or a single
component library.

**AI era** = interfaces where (a) an agent may generate or drive UI, (b) users
interact via chat/voice/canvas, (c) tool results render as components, (d) both
humans and machines must read/act on the UI.

**Farishan Labs constraints** (from principles + toolkit research):

- Bun/TS runtime; oxlint + oxfmt; devDeps only; 100% line/function coverage per
  file; ≤$300/mo burn initially; one-person AI-assisted.
- P-001 never reinvent exact wheels; P-002 zero vendor lock-in; P-003 minimal
  core; P-004 programmable extensions not toggles; P-005 single static binary
  where applicable; P-006 open/shared (Apache-2.0); P-009 small and focused;
  P-011/P-021 research gate before new repo/feature; P-012 canonical files
  plain markdown/JSON; P-013 adapters only harness-aware code; P-020 CLIs follow
  open conventions; P-022 degrade gracefully.
- CI gap: only `workflow-kit` has GitHub Actions; UI repos have none.

**Existing assets**: monokit (CSS tokens, no tests, MCP/CLI deferred to v0.3),
pui (React 19 + Tailwind 4 bundler, strong coverage discipline), web-components
(vanilla custom elements, `core` base class, happy-dom tests, a11y intent but
only 3 toy components).

## Candidates / Findings

### 1. Durable foundations (HCI/HAI)

Classic HCI (Norman, Shneiderman, Nielsen) and HAI guidelines (Microsoft 18
HAI, Google PAIR, Apple HIG ML/GenAI, IBM Design for AI) converge on:
visibility/discoverability, immediate feedback, affordances/signifiers, coherent
conceptual model, mapping, constraints, consistency, error prevention,
recognition > recall, user control/autonomy, reduced memory load (E0030-E0036).
HAI adds: make clear what system can do/how well (G1-G2), scope when in doubt
(G10), efficient invocation/dismissal/correction (G7-G9), remember recent,
learn from behavior, update cautiously, granular feedback, convey consequences,
global controls, notify changes (E0014); unique value over rules, calibrated
trust, graceful failure (E0016); communicate limitations, latency handling,
multiple options, corrections, model/UX separation (E0017); augment not replace,
transparency/explainability (E0018).

Human-agent research: SAT transparency improves shared understanding/trust
calibration (E0019); trust calibration needs both over- and under-trust avoided
(E0020); mixed-initiative adjustable autonomy (E0021); HITL/HOTL/HIC and ISO
42105 avoiding "loop"/"command" terms (E0022); meaningful human control needs
info/time/expertise/authority (E0023); controllability via stop/rollback/
escalation (E0024); actionable in-the-loop explainability (E0025); shared
autonomy as teammates (E0026). Cross-cultural: core principles universal,
details differ (RTL, color meaning, text expansion ~300%) (E0027-E0029).
Accessibility: semantic HTML > ARIA; keyboard+focus baseline; cognitive a11y
incomplete; WCAG 3 draft (E0011-E0013, E0037). Fitts vs Hick: Fitts durable,
Hick less influential (E0032-E0033).

### 2. Design systems & component libraries

Headless/unstyled primitives converge on: behavior + a11y only, zero CSS, full
visual control, composable open APIs, direct node access, uncontrolled-by-default
but controllable, polymorphic `as`/`asChild`/`render` prop, slots, render props,
prop getters, data attributes, state machines. Leaders: Base UI (MUI, v1 Feb
2026, 35 components, "built to last", WAI-ARIA+WCAG 2.2, native CSS Anchor
Positioning/Popover API) (E0001); Radix (WorkOS) (E0002); React Aria (Adobe,
50+ components, i18n 30+ langs) (E0003); Headless UI (Tailwind Labs) (E0004);
Ark UI/Zag.js (framework-agnostic, state machines) (E0005); Downshift. Styled
systems (shadcn, Chakra, Mantine, MUI, Ant, Carbon, Fluent, Polaris, Material 3)
trade speed for fidelity; shadcn's "open code / you own the code" + AI-Ready is
a notable distribution model (E0006). Token standards: W3C DTCG stable 2025-10-28
(E0007); Style Dictionary (E0008); Tailwind v4 CSS-based (E0009); Open Props
(E0010). Durable principles: behavior/presentation separation, a11y baked in at
primitive layer, framework-agnostic core, versioned standardized tokens, open code/
ownership, composability over configuration, native platform leverage, sustainable
maintenance (subagent 2 §5).

### 3. Cross-platform / cross-framework

Web Components standards (Custom Elements, Shadow DOM, slots, Declarative Shadow
DOM, ElementInternals, FACE) are the browser-native universal primitive
(E0050). Libraries: Lit (E0051), Stencil (E0052), FAST (E0053), Shoelace→Web
Awesome (E0054), Spectrum WC (E0055), Carbon WC (E0056). Native: SwiftUI,
Jetpack Compose, Flutter, Qt/QML, GTK, Tauri, Electron, React Native,
NativeScript (E0057). TUI: Ink, Bubble Tea, Textual, Ratatui, Clack, OpenTUI
(E0058). Agent terminal patterns: streaming text, spinners, tool-call rendering,
diff views, inline vs fullscreen (E0059). Most portable bets: web components +
tokens for web; headless TS cores with adapters; native declarative UI or
terminal renderers where needed (E0060).

### 4. AI-era interaction paradigms

GenUI: Vercel AI SDK (tool parts with input-available/output-available/
output-error) (E0041); CopilotKit (3 GenUI modes, AG-UI, WebMCP, memories/
learning/trajectories) (E0042); assistant-ui (chat primitives, GenUI, inline
approvals, voice, a11y) (E0043); Tambo shutting down cloud Oct 2026 — models
now generate front-end code reliably enough that GenUI framework less necessary
(E0044, E0079); Thesys/OpenUI (claims 3×/67%/83%, error handling/fallbacks,
bring your own design system, MCP/DB/API) (E0045, E0080). Agent protocols:
AG-UI (streaming, multimodality, GenUI static+declarative, shared state,
thinking steps, frontend/backend tool calls, interrupts/HITL, sub-agents,
steering, tool output streaming, custom events) (E0038); MCP Apps (ui://
resources, sandboxed iframes, JSON-RPC, text-only fallback required) (E0039);
OpenAI Apps SDK (presentations, decoupled data/render, 3 state types, widget
state, model-visible context) (E0040, E0078). Adaptive/personalized: context-
aware rendering, preference learning, progressive disclosure via tool-gated UI.
Conversational+multimodal: chat, voice, attachments, canvas/artifacts, inline
editing, fullscreen/pip. Streaming/partial: token streaming, skeleton states,
optimistic updates, reconnection/catch-up (E0077). Evaluation: fallbacks,
approvals/consent, error states, schema-adherent structured outputs (E0049);
usability metrics (mostly vendor self-report). "Interfaces for agents":
accessibility tree as agent interface (Playwright ariaSnapshot) (E0046);
semantic HTML > ARIA (E0047); WAI-ARIA ontology → platform a11y APIs (E0048);
structured outputs as machine-readable UI contract (E0049); MCP ui:// resources.

### 5. Local asset audit

monokit: drop-in CSS, tokens-only rule, `--mk-version` mirrored in package.json,
dark mode, monochrome-first; v0.2 theme playground PRD (presets, token editor,
export, localStorage); no tests; no a11y beyond basic tab ARIA; MCP/CLI deferred
to v0.3; bespoke CSS vars not W3C DTCG (E0061). pui: single-command prototype
loop (Bun+React19+Tailwind4), 100% line/function coverage, oxlint/oxfmt gate,
no a11y lint in generated apps (E0062). web-components: framework-free custom
elements, TS strict, Bun workspace, `core` base class (Shadow DOM, render(),
escapeHtml, emit), happy-dom tests, a11y intent but only 3 toy components, no
React interop (E0063). Principles P-001..P-022 (E0064). Toolkit: ≤$300/mo burn,
CI gap (E0065).

### 6. Contradictions & tensions (preserve disagreement)

- Trust: maximize vs. calibrate (E0067).
- "Human in the loop" sufficient vs. meaningful control needs governance (E0068).
- Hick vs. Fitts (E0069).
- Base UI vs. Radix: similar APIs; Base claims more robust a11y + dedicated
  team; Radix battle-tested foundation of shadcn; neither objectively better
  (E0070).
- shadcn "not a library" yet most popular library; manual upstream updates
  (E0071).
- "Lasts forever" vs. reality: durability = separation + standards + maintenance
  (E0072).
- Native browser features vs. JS positioning (Floating UI) cross-browser gap
  (E0073).
- Universal design vs. localization unresolved (E0074).
- Recognition vs. recall tension (E0075).
- Styled vs. headless "lasts forever": styled encode visual language that ages;
  headless more durable but require styling effort per project.
- GenUI transitional: Tambo pivot suggests agents writing UI code may supersede
  tool-result rendering (E0079) — unresolved.

## Recommendation / Decision

**Adopt a headless-primitives + W3C-DTCG-tokens + framework-agnostic-core +
accessibility-first architecture**, consolidated under `@farishan-labs/ui`, phased
web → TUI → native, with AG-UI/MCP-Apps-shaped agent support and a written
PHILOSOPHY.md.

Concretely:

1. **Consolidate, don't create a 4th asset** (P-001, P-009): merge monokit
   tokens + web-components `core` + pui React path under one repo/philosophy.
2. **Canonical token source = W3C DTCG JSON** → generate CSS (monokit) + TS
   constants + (later) native/TUI outputs (E0007, E0008). Keep monokit's
   drop-in CSS as a generated artifact.
3. **Component core = framework-free web components** extending the existing
   `core` base class (Shadow DOM, slots, FACE, ElementInternals) with
   accessibility-first patterns borrowed from Base UI/React Aria (keyboard,
   focus, ARIA, AT testing) (E0001-E0003, E0050).
4. **React wrappers** (thin) for the pui flow; document custom-element usage in
   React 19; defer Vue/Svelte until needed (P-009).
5. **Agent support**: implement an AG-UI-shaped event protocol (streaming,
   shared state, interrupts/HITL, tool calls, thinking steps, sub-agents) and
   MCP Apps text-only fallback + `ui://` resources; semantic HTML/ARIA so the
   accessibility tree is the agent interface (E0038-E0040, E0046-E0048). Add
   MCP server + `pull` CLI (monokit v0.3 scope) (G7).
6. **GenUI**: support tool-result → component binding with streaming states
   (input-available/output-available/output-error) and both static (app-controlled)
   and declarative (agent-proposed, app-validated) modes; keep an eye on the
   "agents write UI code" trend (E0041, E0079).
7. **Author PHILOSOPHY.md** with durable principles + HAI constraints: trust
   calibrated not maximized; meaningful human control; accessibility tree as
   agent interface; "durability = separation + standards + maintenance" (E0067,
   E0068, E0072).
8. **Phase cross-platform**: web first → TUI/CLI (OpenTUI/Ink/Textual patterns)
   → native (Tauri/Electron reuse web; SwiftUI/Compose/Flutter only if a native
   app ships) (E0057-E0060).
9. **Reuse external icon sets** (Lucide/Phosphor) per P-001; defer data-viz.
10. **Fix CI/testing/versioning/docs** before feature expansion: oxlint/oxfmt +
    bun test on every UI repo, a11y assertions, versioned published packages,
    component catalogue docs (G17-G23).

### Conditions / fallbacks

- If web-components interop with React 19 proves too painful, fall back to
  React Aria-style hooks + a React-only package, keeping tokens shared (P-002).
- If DTCG tooling (Style Dictionary) is too heavy for Bun, write a small
  Bun-native generator (P-003 minimal core) — but prefer existing (P-001).
- If AG-UI/MCP Apps adoption stalls, keep the event protocol internal and
  expose a simpler streaming-JSON contract; don't block on standards.

## Risks & Mitigations

- R1: **Scope creep / 4th asset duplication** → enforce research gate (P-021)
  and consolidate first.
- R2: **"Lasts forever" overclaim** → frame durability honestly in PHILOSOPHY.md
  (E0072); avoid marketing absolutes.
- R3: **Accessibility debt** → make a11y a primitive-layer requirement with
  tests, not a later polish (E0011-E0013).
- R4: **Trust miscalibration in AI UI** → design for calibrated trust, approvals,
  fallbacks, error states (E0016, E0067, E0045).
- R5: **Cross-browser/platform gaps** → use native browser features with
  fallbacks; don't assume Baseline (E0073).
- R6: **Maintenance sustainability** (one-person lab) → minimal core, extensions,
  reuse (P-001, P-003, P-004); avoid large component counts early.
- R7: **CI/testing gap** → add CI before features (G19).
- R8: **GenUI may be transitional** → keep rendering layer pluggable so
  "agents write code" can replace tool-result rendering (E0079).
- R9: **Localization/cognitive a11y** under-tested → plan i18n + cognitive
  accessibility from the start (E0027-E0029, E0013).

## Environment / Baseline

- Machine: oscar (Linux, Ubuntu, GNOME/X11). Personal mode.
- Existing assets: monokit, pui, web-components, principles (P-001..P-022 v1.3.0),
  research topics (native-gui-rendering, farishan-labs-toolkit, etc.).
- Tooling: Bun, oxlint, oxfmt, gh (personal farishan), git@github.com:farishan-labs.
- Budget: ≤$300/mo burn cap initially; no paid infra for UI system.

## Gaps & Open Questions

See `gaps.md` for the full gap audit (G1-G31). Headline open questions:

- OQ1: Should `@farishan-labs/ui` live in farishan-labs org as a new repo, or
  be folded into an existing repo (web-components or monokit)? (P-011 research
  gate — this research is the gate; recommend new repo only if consolidation
  proves infeasible.)
- OQ2: Web Components vs. React-first for the v0.1 — which ships first given
  pui's React fast path? (Recommend: tokens + web components core first, React
  wrappers second.)
- OQ3: Which GenUI protocol (AG-UI vs. MCP Apps vs. Vercel AI SDK) becomes
  the primary adapter? (Keep protocol-agnostic internal event model.)
- OQ4: Is a TUI surface (OpenTUI/Ink) in v0.1 or v0.2? (Recommend v0.2.)
- OQ5: Icon set choice (Lucide vs. Phosphor) — defer to implementation.
- OQ6: Cognitive accessibility testing method — no standard; needs a decision
  (E0013).
- OQ7: How to measure trust calibration in the UI (no standard metric)
  (E0020).
- OQ8: Whether to ship a runtime theme provider in v0.1 or keep CSS-vars-only
  (G28).

## Related topics

- `topics/native-gui-rendering/` — native GUI stack on this machine.
- `topics/native-ubuntu-desktop-app-starter/` — native app starter choice.
- `topics/machine-aware-starter-chooser/` — starter chooser design.
- `topics/ai-assisted-one-person-company/` — org/subagent patterns.
- `topics/farishan-labs-toolkit/` — baseline toolkit + CI gap.
- `topics/how-to-name-things/` — naming (relevant to component/API naming).
- `topics/research-methodology/` — research process + templates.
- `topics/git-as-ssot-db/` — data layer patterns (relevant to token storage).
- `principles/` (repo) — P-001..P-022.

## Sources

Primary (official docs/specs/papers):

- Base UI: base-ui.com (v1 Feb 2026); MUI blog 2022-09-07.
- Radix: radix-ui.com/primitives.
- React Aria/Spectrum: react-spectrum.adobe.com.
- Headless UI: tailwindcss.com/blog 2020-10-06; headlessui.com.
- Ark UI/Zag.js: ark-ui.com, zagjs.com.
- shadcn/ui: ui.shadcn.com/docs.
- W3C Design Tokens: w3.org/community/design-tokens (stable 2025-10-28).
- Style Dictionary: styledictionary.com.
- Tailwind: tailwindcss.com.
- Open Props: open-props.style.
- W3C WAI: WCAG, WAI-ARIA 1.2/1.3, COGA, WCAG 3.
- Microsoft HAI Guidelines + HAX Toolkit (CHI'19, Amershi et al.).
- Google PAIR Guidebook.
- Apple HIG (ML/GenAI).
- IBM Design for AI.
- Chen et al. 2018 (SAT transparency); PMC 2021 "Let Me Take Over" / ISO 42105.
- NN/G cross-cultural + heuristics.
- Shneiderman golden rules; Norman DOET.
- AG-UI: docs.ag-ui.com.
- MCP Apps: blog.modelcontextprotocol.io 2025-11-21.
- OpenAI Apps SDK: developers.openai.com/plugins/build/chatgpt-ui.
- Vercel AI SDK: ai-sdk.dev.
- CopilotKit: docs.copilotkit.ai.
- assistant-ui: github.com/assistant-ui/assistant-ui.
- Tambo: tambo.co/blog.
- Thesys: thesys.dev.
- Playwright aria snapshots/accessibility testing.
- MDN ARIA; W3C WAI-ARIA 1.2.
- OpenAI Structured Outputs.
- Web Components: MDN/web.dev; Lit; Stencil; FAST; Shoelace/Web Awesome; Spectrum WC; Carbon WC.
- Native/TUI: vendor docs (SwiftUI, Compose, Flutter, Qt, GTK, Tauri, Electron, RN, NativeScript; Ink, Bubble Tea, Textual, Ratatui, Clack, OpenTUI).
- Local: monokit, pui, web-components, principles, farishan-labs-toolkit topic.

Secondary/commentary:

- builtux.com Base UI vs Radix vs React Aria (2026-10-02) — third-party analysis, star/download counts self-reported.
- medium.com Base UI vs Radix (2026-02-25).
- dev.to separation of concerns (2021-08-28).

Internal:

- `topics/native-gui-rendering/README.md`
- `topics/farishan-labs-toolkit/README.md`
- `topics/research-methodology/templates.md`
- `principles/TOP_PRINCIPLES.md`, `PRINCIPLES.md`

Notes:

- Volatile claims (star counts, prices, versions, marketing metrics) carry
  uncertainty in findings.md; self-reported figures marked and audited in gaps.md.
- Verification: standard depth; load-bearing claims (protocol specs, standards)
  cross-checked against primary docs; marketing metrics (Thesys, Tambo) are
  single-source and flagged (E0045, E0080, E0044).

## Files

- `README.md` (this file)
- `PROGRESS.md`
- `findings.md` (evidence ledger, E0001-E0080)
- `gaps.md` (gap audit, G1-G31)
- `needs.md` (lab-specific needs, consumers, priorities, success criteria)
- `PHILOSOPHY.md` (draft v0.1 philosophy for @farishan-labs/ui)
