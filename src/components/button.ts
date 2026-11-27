import { Component } from "../core/component";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export class Button extends Component {
  static get observedAttributes(): string[] {
    return ["variant", "size", "disabled", "type", "label"];
  }

  get variant(): ButtonVariant {
    const v = this.getAttribute("variant");
    return v === "secondary" || v === "ghost" || v === "danger" ? v : "primary";
  }

  get size(): ButtonSize {
    const s = this.getAttribute("size");
    return s === "sm" || s === "lg" ? s : "md";
  }

  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }

  set disabled(value: boolean) {
    if (value) this.setAttribute("disabled", "");
    else this.removeAttribute("disabled");
  }

  protected render(): void {
    const variant = this.variant;
    const size = this.size;
    const disabled = this.disabled;
    const type = this.getAttribute("type") ?? "button";
    const label = this.getAttribute("label");

    this.root.innerHTML = this.html`
      <style>
        :host { display: inline-block; }
        button {
          font-family: var(--ui-font-family-sans);
          font-size: var(--ui-font-size-${size === "sm" ? "sm" : size === "lg" ? "lg" : "md"});
          line-height: 1.25;
          padding: ${size === "sm" ? "var(--ui-space-1) var(--ui-space-2)" : size === "lg" ? "var(--ui-space-3) var(--ui-space-6)" : "var(--ui-space-2) var(--ui-space-4)"};
          border-radius: var(--ui-radius-md);
          border: 1px solid transparent;
          cursor: ${disabled ? "not-allowed" : "pointer"};
          opacity: ${disabled ? "0.5" : "1"};
          transition: background var(--ui-motion-duration-fast), color var(--ui-motion-duration-fast);
          background: var(--ui-color-accent-default);
          color: var(--ui-color-accent-fg);
        }
        button.secondary { background: var(--ui-color-bg-muted); color: var(--ui-color-fg-default); border-color: var(--ui-color-border-default); }
        button.ghost { background: transparent; color: var(--ui-color-fg-default); }
        button.danger { background: var(--ui-color-danger-default); color: var(--ui-color-danger-fg); }
        button:hover:not(:disabled) { filter: brightness(0.95); }
        button:focus-visible { outline: 2px solid var(--ui-color-accent-default); outline-offset: 2px; }
        button:disabled { pointer-events: none; }
        @media (prefers-reduced-motion: reduce) {
          button { transition: none; }
        }
      </style>
      <button type="${this.escapeHtml(type)}" class="${variant}" ${disabled ? "disabled" : ""} aria-disabled="${disabled}">${label !== null ? this.escapeHtml(label) : ""}<slot></slot></button>
    `;
  }
}

if (!customElements.get("ui-button")) {
  customElements.define("ui-button", Button);
}

export default Button;
