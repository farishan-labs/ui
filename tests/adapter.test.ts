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
