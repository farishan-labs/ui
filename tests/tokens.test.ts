import { test, expect } from "bun:test";
import { tokens } from "../src/tokens";

test("tokens expose color.bg.default", () => {
  expect((tokens as any).color.bg.default).toBe("#ffffff");
});

test("tokens expose space.4", () => {
  expect((tokens as any).space["4"]).toBe("1rem");
});

test("tokens re-exported from design-tokens", async () => {
  const fs = await import("node:fs");
  const path = "../node_modules/@farishan-labs/design-tokens/src/tokens/tokens.css";
  expect(fs.existsSync(new URL(path, import.meta.url).pathname)).toBe(true);
});
