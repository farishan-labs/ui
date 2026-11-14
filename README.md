# @farishan-labs/ui

![License](https://img.shields.io/github/license/farishan-labs/ui) ![Stars](https://img.shields.io/github/stars/farishan-labs/ui)

## Get the toolkit

[![npm](https://img.shields.io/npm/v/@farishan-labs/ui)](https://www.npmjs.com/package/@farishan-labs/ui)
[![npm downloads](https://img.shields.io/npm/dm/@farishan-labs/ui)](https://www.npmjs.com/package/@farishan-labs/ui)
[![Gumroad](https://img.shields.io/badge/Gumroad-OpenCode%20Dev%20Toolkit-ff90e8)](https://farishan1.gumroad.com/l/sknrfm)

Part of Faris Han Labs. Buy the OpenCode Dev Toolkit on Gumroad.


Headless UI primitives + W3C DTCG tokens for Faris Han Labs. Web components
(first), a11y-first, framework-agnostic core. GPL-3.0.

![preview](demo/preview.png)

## Status

v0.1 in progress. See `PHILOSOPHY.md` for the durable principles and
`AGENTS.md` for tooling.

## Install

```bash
bun add @farishan-labs/ui
# tokens are provided by @farishan-labs/design-tokens (pulled in as a dependency)
```

Or drop in the generated CSS:

```html
<link rel="stylesheet" href="node_modules/@farishan-labs/design-tokens/src/tokens/tokens.css" />
```

## Usage

```ts
import "@farishan-labs/ui"; // registers custom elements
import { tokens } from "@farishan-labs/ui"; // re-exported from design-tokens
```

```html
<ui-button variant="primary">Save</ui-button>
```

## Development

```bash
bun install
bun run check
bun test
```

## Research basis

`research/topics/farishan-labs-ui/` (README, findings E0001–E0080, gaps G1–G31,
needs N1–N11). Research gate satisfied 2026-11-09.

## Installation

```bash
npm install ui
```
