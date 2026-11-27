import { test, expect } from "bun:test";
import { applyTokenBridge, uiSdkPresent, loadUiSdk } from "../src/adapters/ui-sdk";

test("applyTokenBridge marks the document", () => {
  applyTokenBridge();
  expect(document.documentElement.getAttribute("data-fhl-ui-sdk-bridge")).toBe("ready");
});

test("uiSdkPresent is false before loading", () => {
  expect(uiSdkPresent()).toBe(false);
});

test("loadUiSdk rejects without network (fallback path)", async () => {
  let threw = false;
  try {
    await loadUiSdk({ timeoutMs: 50 });
  } catch {
    threw = true;
  }
  expect(threw).toBe(true);
});

test("loadUiSdk resolves when already loaded", async () => {
  const { loadUiSdk } = await import("../src/adapters/ui-sdk");
  const base = "https://example.com/";
  const doc = document;
  const script = doc.createElement("script");
  script.setAttribute("data-fhl-ui-sdk", base);
  doc.head.appendChild(script);
  await expect(loadUiSdk({ base, doc })).resolves.toBeUndefined();
  script.remove();
});

test("ensureUiSdk resolves when already loaded", async () => {
  const { ensureUiSdk } = await import("../src/adapters/ui-sdk");
  const base = "https://example2.com/";
  const doc = document;
  const script = doc.createElement("script");
  script.setAttribute("data-fhl-ui-sdk", base);
  doc.head.appendChild(script);
  await expect(ensureUiSdk({ base, doc })).resolves.toBeUndefined();
  script.remove();
});
