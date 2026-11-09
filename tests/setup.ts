import { Window } from "happy-dom";

const window = new Window();
const globals: Record<string, unknown> = {
  window,
  document: window.document,
  customElements: window.customElements,
  HTMLElement: window.HTMLElement,
  ShadowRoot: window.ShadowRoot,
  Event: window.Event,
  CustomEvent: window.CustomEvent,
  Node: window.Node,
  Element: window.Element,
  KeyboardEvent: window.KeyboardEvent,
  MouseEvent: window.MouseEvent,
};
for (const [key, value] of Object.entries(globals)) {
  Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
}
