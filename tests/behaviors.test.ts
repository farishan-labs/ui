import { test, expect } from "bun:test";
import { Disclosure, reduceDisclosure, initialDisclosure } from "../src/behaviors/atoms/disclosure";
import { RovingTabindex, rovingIndex } from "../src/behaviors/atoms/roving-tabindex";
import { Accordion, createAccordion } from "../src/behaviors/generated/accordion";
import { Tabs, createTabs } from "../src/behaviors/tabs";
import { Tabs as GeneratedTabs } from "../src/behaviors/generated/tabs";
import { compileBml } from "../packages/bml/compile-bml";
import { readFileSync } from "node:fs";

test("disclosure toggles", () => {
  const d = new Disclosure(false);
  expect(d.open).toBe(false);
  expect(d.toggle()).toBe(true);
  expect(d.open).toBe(true);
  d.toggle();
  expect(d.open).toBe(false);
  const s = reduceDisclosure(initialDisclosure(false), "toggle");
  expect(s.open).toBe(true);
});

test("roving keydown moves index", () => {
  const r = new RovingTabindex(4);
  expect(r.handleKey("ArrowDown")).toBe(1);
  expect(r.handleKey("ArrowDown")).toBe(2);
  expect(r.handleKey("End")).toBe(3);
  expect(r.handleKey("Home")).toBe(0);
  expect(rovingIndex(0, "ArrowUp", 4)).toBe(3);
  expect(rovingIndex(0, "ArrowDown", 1)).toBe(0);
});

test("accordion single mode", () => {
  const a = createAccordion({}, 3);
  a.toggle("a");
  expect(a.open).toEqual(["a"]);
  a.toggle("b");
  expect(a.open).toEqual(["b"]);
  a.toggle("b");
  expect(a.open).toEqual([]);
});

test("accordion multiple mode", () => {
  const a = new Accordion({ multiple: true });
  a.toggle("a");
  a.toggle("b");
  expect(a.open).toEqual(["a", "b"]);
  a.toggle("a");
  expect(a.open).toEqual(["b"]);
});

test("accordion collapsible false", () => {
  const a = new Accordion({ collapsible: false });
  a.toggle("a");
  expect(a.open).toEqual(["a"]);
  a.toggle("a");
  expect(a.open).toEqual(["a"]);
});

test("accordion collapsible false but multiple allows closing when more than one", () => {
  const a = new Accordion({ multiple: true, collapsible: false });
  a.toggle("a");
  a.toggle("b");
  expect(a.open).toEqual(["a", "b"]);
  a.toggle("a");
  expect(a.open).toEqual(["b"]);
});

test("accordion disabled prevents toggle", () => {
  const a = new Accordion({ disabled: (v) => v === "x" });
  a.toggle("x");
  expect(a.open).toEqual([]);
  a.toggle("y");
  expect(a.open).toEqual(["y"]);
  expect(a.isDisabled("x")).toBe(true);
});

test("accordion initialOpen and focus", () => {
  const a = createAccordion({ initialOpen: ["a"] }, 3);
  expect(a.isExpanded("a")).toBe(true);
  a.setItemCount(3);
  expect(a.moveFocus("ArrowDown")).toBe(1);
  expect(a.focusIndex).toBe(1);
});

test("compiler output equality", () => {
  const generatedPath = "src/behaviors/generated/accordion.ts";
  const before = readFileSync(generatedPath, "utf8");
  const code = compileBml("packages/bml/examples/accordion.bml.json", generatedPath);
  const after = readFileSync(generatedPath, "utf8");
  expect(code).toBe(before);
  expect(after).toBe(before);
});

test("tabs single active", () => {
  const t = createTabs({ initialActive: "a" }, 3);
  expect(t.isActive("a")).toBe(true);
  t.select("b");
  expect(t.isActive("b")).toBe(true);
  expect(t.isActive("a")).toBe(false);
});

test("tabs focus movement", () => {
  const t = new Tabs({}, 4);
  t.setItemCount(4);
  expect(t.moveFocus("ArrowDown")).toBe(1);
  expect(t.focusIndex).toBe(1);
  expect(t.moveFocus("End")).toBe(3);
});

test("compiler output equality (tabs)", () => {
  const generatedPath = "src/behaviors/generated/tabs.ts";
  const before = readFileSync(generatedPath, "utf8");
  const code = compileBml("packages/bml/examples/tabs.bml.json", generatedPath);
  const after = readFileSync(generatedPath, "utf8");
  expect(code).toBe(before);
  expect(after).toBe(before);
});

test("generated tabs matches hand-written behavior", () => {
  const h = new Tabs({ initialActive: "a" }, 3);
  const g = new GeneratedTabs({ initialActive: "a" }, 3);
  expect(g.active).toEqual(h.active);
  h.select("b");
  g.select("b");
  expect(g.active).toEqual(h.active);
  expect(g.isActive("b")).toBe(h.isActive("b"));
});
