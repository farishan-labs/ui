/**
 * Minimal base class for web components in @farishan-labs/ui.
 *
 * Provides an open shadow root, a tiny html/css/escapeHtml helper, and an
 * emit() for CustomEvents. Components ship behavior + accessibility only;
 * styling comes from tokens (P1).
 */
export abstract class Component extends HTMLElement {
  protected root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  /** Override in subclasses. */
  protected abstract render(): void;

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null,
  ): void {
    if (this.root) this.render();
  }

  protected html(strings: TemplateStringsArray, ...values: unknown[]): string {
    return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ""), "");
  }

  protected escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (c) => {
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return map[c] ?? c;
    });
  }

  protected emit(name: string, detail?: unknown): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }
}
