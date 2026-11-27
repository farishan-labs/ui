import { test, expect } from "bun:test";
import "../src/components/dialog";
import "../src/components/toast";
import "../src/components/command-palette";
import "../src/components/field";
import "../src/components/accordion";

test("dialog: ESC closes and restores focus target", () => {
  const el = document.createElement("ui-dialog") as any;
  el.setAttribute("label", "Confirm");
  document.body.appendChild(el);
  el.setAttribute("open", "");
  const dialog = el.shadowRoot.querySelector('[role="dialog"]') as HTMLElement;
  expect(dialog).not.toBeNull();
  const ev = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
  el.shadowRoot.querySelector(".backdrop")?.dispatchEvent(ev);
  expect(el.hasAttribute("open")).toBe(false);
});

test("toast: dismiss button has aria-label and emits dismiss", () => {
  const el = document.createElement("ui-toast") as any;
  el.setAttribute("message", "Saved");
  el.setAttribute("open", "");
  document.body.appendChild(el);
  const btn = el.shadowRoot.querySelector('[data-action="dismiss"]') as HTMLElement;
  expect(btn.getAttribute("aria-label")).toBe("Dismiss toast");
  let dismissed = false;
  el.addEventListener("dismiss", () => (dismissed = true));
  btn.click();
  expect(dismissed).toBe(true);
});

test("command-palette: backdrop click closes", () => {
  const el = document.createElement("ui-command-palette") as any;
  el.setAttribute("open", "");
  document.body.appendChild(el);
  const backdrop = el.shadowRoot.querySelector(".backdrop") as HTMLElement;
  const ev = new MouseEvent("click", { bubbles: true });
  Object.defineProperty(ev, "target", { value: backdrop });
  backdrop.dispatchEvent(ev);
  expect(el.hasAttribute("open")).toBe(false);
});

test("field: error sets aria-invalid and describedby", () => {
  const el = document.createElement("ui-field") as any;
  el.setAttribute("label", "Email");
  el.setAttribute("error", "Invalid email");
  document.body.appendChild(el);
  const input = el.shadowRoot.querySelector("input") as HTMLElement;
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.getAttribute("aria-describedby")).toContain("-error");
  expect(el.shadowRoot.querySelector('[role="alert"]')).not.toBeNull();
});

test("accordion: triggers expose aria-expanded", () => {
  const el = document.createElement("ui-accordion") as any;
  el.setAttribute("items", JSON.stringify([{ value: "a", title: "A", content: "content a" }]));
  document.body.appendChild(el);
  const btn = el.shadowRoot.querySelector(".trigger") as HTMLElement;
  expect(btn.getAttribute("aria-expanded")).toBe("false");
  btn.click();
  const btn2 = el.shadowRoot.querySelector(".trigger") as HTMLElement;
  expect(btn2.getAttribute("aria-expanded")).toBe("true");
});
