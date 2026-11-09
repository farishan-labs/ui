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
          font-family: var(--ui-font-family-sans, inherit);
          font-size: var(--ui-font-size-${size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}, 1rem);
          line-height: 1.25;
          padding: ${size === "sm" ? "var(--ui-space-1,0.25rem) var(--ui-space-2,0.5rem)" : size === "lg" ? "var(--ui-space-3,0.75rem) var(--ui-space-6,1.5rem)" : "var(--ui-space-2,0.5rem) var(--ui-space-4,1rem)"};
          border-radius: var(--ui-radius-md, 0.375rem);
          border: 1px solid transparent;
          cursor: ${disabled ? "not-allowed" : "pointer"};
          opacity: ${disabled ? "0.5" : "1"};
          transition: background var(--ui-motion-duration-fast, 100ms), color var(--ui-motion-duration-fast, 100ms);
          background: var(--ui-color-accent-default, #2563eb);
          color: var(--ui-color-accent-fg, #fff);
        }
        button.secondary { background: var(--ui-color-bg-muted, #f4f4f5); color: var(--ui-color-fg-default, #09090b); border-color: var(--ui-color-border-default, #e4e4e7); }
        button.ghost { background: transparent; color: var(--ui-color-fg-default, #09090b); }
        button.danger { background: var(--ui-color-danger-default, #dc2626); color: var(--ui-color-danger-fg, #fff); }
        button:hover:not(:disabled) { filter: brightness(0.95); }
        button:focus-visible { outline: 2px solid var(--ui-color-accent-default, #2563eb); outline-offset: 2px; }
        button:disabled { pointer-events: none; }
      </style>
      <button type="${this.escapeHtml(type)}" class="${variant}" ${disabled ? "disabled" : ""} aria-disabled="${disabled}">${label !== null ? this.escapeHtml(label) : ""}<slot></slot></button>
    `;
  }
}

if (!customElements.get("ui-button")) {
  customElements.define("ui-button", Button);
}

export default Button;
