import { Component } from "../core/component";

export class Toast extends Component {
  static get observedAttributes(): string[] {
    return ["message", "variant", "open"];
  }

  get open(): boolean {
    return this.hasAttribute("open");
  }

  set open(value: boolean) {
    if (value) this.setAttribute("open", "");
    else this.removeAttribute("open");
  }

  get variant(): string {
    const v = this.getAttribute("variant");
    return v === "success" || v === "danger" ? v : "default";
  }

  protected render(): void {
    const message = this.getAttribute("message") ?? "";
    const variant = this.variant;
    const role = variant === "danger" ? "alert" : "status";
    this.root.innerHTML = this.html`
      <style>
        :host { display: ${this.open ? "block" : "none"}; }
        .toast {
          display: inline-flex; align-items: center; gap: var(--ui-space-3);
          padding: var(--ui-space-2) var(--ui-space-4);
          border-radius: var(--ui-radius-md);
          background: var(--ui-color-bg-inverse);
          color: var(--ui-color-fg-inverse);
          box-shadow: var(--ui-shadow-md);
          font-size: var(--ui-font-size-sm);
        }
        .toast.success { background: var(--ui-color-success-default); color: var(--ui-color-success-fg); }
        .toast.danger { background: var(--ui-color-danger-default); color: var(--ui-color-danger-fg); }
        button { background: transparent; border: none; color: inherit; cursor: pointer; font-size: 1rem; }
        button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
      </style>
      <div class="toast ${variant}" role="${role}" aria-live="polite">
        <span class="message">${this.escapeHtml(message)}<slot></slot></span>
        <button type="button" aria-label="Dismiss toast" data-action="dismiss">&times;</button>
      </div>
    `;
    this.root.querySelector('[data-action="dismiss"]')?.addEventListener("click", () => {
      this.open = false;
      this.emit("dismiss");
    });
  }
}

if (!customElements.get("ui-toast")) {
  customElements.define("ui-toast", Toast);
}

export default Toast;
