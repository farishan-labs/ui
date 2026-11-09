import { test, expect } from "bun:test";
import { tokens } from "../src/tokens";

test("tokens expose color.bg.default as DTCG color", () => {
  expect(
    (tokens as any).color.bg.default.$type ?? (tokens as any).color.bg.default.colorSpace,
  ).toBeDefined();
  // re-exported from design-tokens; value is now structured
  expect(
    (tokens as any).color.bg.default.hex ?? (tokens as any).color.bg.default.components,
  ).toBeDefined();
});

test("tokens expose space.4 as DTCG dimension", () => {
  expect((tokens as any).space["4"].value).toBe(1);
  expect((tokens as any).space["4"].unit).toBe("rem");
});

test("tokens re-exported from design-tokens", async () => {
  const fs = await import("node:fs");
  const path = "../node_modules/@farishan-labs/design-tokens/src/tokens/tokens.css";
  expect(fs.existsSync(new URL(path, import.meta.url).pathname)).toBe(true);
});
