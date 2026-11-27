---
id: behavior-dsl
title: Compact, agent-friendly behavior DSL (BML)
research_date: "2026-11-27"
mode: personal
timebox: exploration
status: Seed / draft
evidence_status: mixed
---

# Compact, agent-friendly behavior DSL (BML)

Seed exploration: a compact, agent-friendly behavior DSL that describes component
behavior in ~1/3 the tokens of equivalent TS/JS, compiles to FHL atomic behavior
atoms, and preserves P1 (behavior ≠ presentation), P2/P3 (a11y + agent-readable).

## Problem & Scope

FHL UI's atomic behaviors (disclosure, roving-tabindex, focus-trap, dismiss, …)
are small and composable, but authoring them in TypeScript still costs ~60 lines
per component and is error-prone for a11y. LLMs can generate them, but token
cost and a11y correctness are the bottlenecks. There is no compact, agent-friendly
behavior DSL today (classical statecharts/BTs predate LLMs; A2UI/BAML/TOON target
output/contracts, not internal component behavior).

In scope: define a compact behavior description format + compiler that targets
FHL atomic behaviors; measure token reduction; validate a11y auto-derivation.

Out of scope: shipping a full component library; replacing Zag.js as an engine;
production compiler.

## Core idea

**JSON-schema-first, not a new language.** LLMs are far more reliable at JSON
with a strict schema than at novel syntax. So the DSL is a constrained JSON
dialect ("BML" — Behavior Markup Language) with an optional compact shorthand for
humans. Both compile to the same IR.

## Compact shorthand (accordion)
```
behavior accordion {
  atoms: disclosure, roving
  state open: string[]
  prop multiple: bool = false
  prop collapsible: bool = true
  on toggle(v) when !disabled(v):
    if open.has(v): if collapsible or open.len>1: open.remove(v)
    else: open = multiple ? open + [v] : [v]
  a11y: accordion        // auto-derives roles, keys, focus
}
```

## JSON IR (what the LLM emits)
```json
{
  "name": "accordion",
  "atoms": ["disclosure", "roving"],
  "state": { "open": { "type": "string[]", "default": [] } },
  "props": {
    "multiple": { "type": "boolean", "default": false },
    "collapsible": { "type": "boolean", "default": true }
  },
  "transitions": [
    { "event": "toggle", "param": "v", "guard": "!disabled(v)",
      "actions": [
        { "if": "open.includes(v)",
          "then": [{ "if": "collapsible || open.length > 1", "do": "open.remove(v)" }] },
        { "else": { "set": "open", "value": "multiple ? [...open, v] : [v]" } }
      ] }
  ],
  "a11y": "accordion"
}
```

## Token-efficiency mechanisms
1. Atom references expand to full a11y/keyboard logic at compile time.
2. `a11y: <pattern>` auto-generates roles, states, keyboard map, focus mgmt.
3. Named transitions reference atom verbs instead of inline implementations.
4. Schema-validated output (constrained decoding) eliminates retry/repair tokens.
5. Compact shorthand for humans; JSON IR for machines.

## Compilation pipeline
BML (JSON IR) → Behavior IR (atoms + transitions) → TS behavior module
→ framework adapters (web component, React, …) → token-bound rendering.

## Relation to FHL principles
- P1: behavior described independently of presentation (zero styling in BML).
- P2/P3: a11y auto-derived from `a11y:` tag, so it can't be skipped in review.
- P4: presentation stays in tokens; BML references token names only.
- P6: minimal — small atom set + transitions + a11y tag.
- P7: reuses Zag/Radix patterns as the bundled `a11y:` pattern library.
- P8: open format, self-hostable compiler, no vendor service.

## Open questions
- Separate repo/product vs. live in `@farishan-labs/ui`?
- Versioning the `a11y:` pattern library as ARIA evolves.
- Can the shorthand be made unambiguous enough for LLMs to emit directly?
- Declarative transitions vs. small code expressions (injection/complexity risk).

## Next steps
1. Prototype compiler on accordion end-to-end.
2. Measure token reduction vs. hand-written TS.
3. Decide productization.

## Sources

Primary (official docs/specs):
- A2UI (Google) — declarative agent-to-UI format: https://a2ui.org / google.github.io/A2UI
- MCP Apps — https://blog.modelcontextprotocol.io (2025-11-21) + spec (ui:// resources, text-only fallback)
- AG-UI protocol — https://docs.ag-ui.com
- XState / statecharts — https://stately.ai/docs, David Harel (1987), SCXML (W3C)
- Zag.js — https://zagjs.com (framework-agnostic state machines)
- React Aria — https://react-spectrum.adobe.com (atomic hooks)
- Base UI — https://base-ui.com (headless primitives)
- BAML — https://docs.boundaryml.com (LLM function DSL)
- TOON — https://github.com/toon-format/toon (token-oriented object notation)
- Outlines / XGrammar / Guidance — constrained decoding for LLMs
- W3C Design Tokens (DTCG) — https://www.w3.org/community/design-tokens (stable 2025-10-28)
- WAI-ARIA 1.2/1.3 + WCAG — https://www.w3.org/TR/wai-aria-1.2

Secondary:
- Vercel AI SDK UI (json-render, streaming component trees) — https://ai-sdk.dev
- CopilotKit — https://docs.copilotkit.ai (AG-UI, GenUI)
- assistant-ui — https://github.com/assistant-ui/assistant-ui

Internal:
- `docs/research/README.md` (FHL UI research, E0001-E0080)
- `PHILOSOPHY.md` (P1-P10)
- `src/behaviors/` (atomic behaviors — to be scaffolded)
- `src/adapters/ui-sdk.ts` (adapter pattern reference)

## Related
- `docs/research/README.md` (FHL UI research)
- `PHILOSOPHY.md` (P1-P10)
- `src/behaviors/` (atomic behaviors — to be scaffolded)
- `src/adapters/ui-sdk.ts` (adapter pattern reference)
```

I'll write this file.<|end|><|start|>startup to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="path">
/home/faris/dev/labs/ui/docs/research/behavior-dsl/README.md