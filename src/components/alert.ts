import { Component } from "../core/component";

export class Alert extends Component {
  static get observedAttributes(): string[] {
    return ["variant"];
  }

  get variant(): string {
    return this.getAttribute("variant") || "info";
  }

  protected render(): void {
    this.root.innerHTML = this.html`
      <style>
        :host { display: block; }
        .alert {
          padding: var(--ui-space-3, 0.75rem) var(--ui-space-4, 1rem);
          border-radius: var(--ui-radius-md, 0.375rem);
          border: 1px solid var(--ui-color-border-default, #e4e4e7);
          background: var(--ui-color-bg-muted, #f4f4f5);
          color: var(--ui-color-fg-default, #09090b);
        }
        .alert[data-variant="success"] { background: var(--ui-color-success-bg, #dcfce7); color: var(--ui-color-success-fg, #166534); border-color: var(--ui-color-success-border, #86efac); }
        .alert[data-variant="warning"] { background: var(--ui-color-warning-bg, #fef9c3); color: var(--ui-color-warning-fg, #854d0e); border-color: var(--ui-color-warning-border, #fde047); }
        .alert[data-variant="danger"] { background: var(--ui-color-danger-bg, #fee2e2); color: var(--ui-color-danger-fg, #991b1b); border-color: var(--ui-color-danger-border, #fca5a5); }
      </style>
      <div class="alert" data-variant="${this.variant}" role="alert"><slot></slot></div>
    `;
  }
}

if (!customElements.get("ui-alert")) {
  customElements.define("ui-alert", Alert);
}

export default Alert;