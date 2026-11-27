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
          padding: var(--ui-space-3) var(--ui-space-4);
          border-radius: var(--ui-radius-md);
          border: 1px solid var(--ui-color-border-default);
          background: var(--ui-color-bg-muted);
          color: var(--ui-color-fg-default);
        }
        .alert[data-variant="success"] { background: var(--ui-color-success-bg); color: var(--ui-color-success-fg); border-color: var(--ui-color-success-border); }
        .alert[data-variant="warning"] { background: var(--ui-color-warning-bg); color: var(--ui-color-warning-fg); border-color: var(--ui-color-warning-border); }
        .alert[data-variant="danger"] { background: var(--ui-color-danger-bg); color: var(--ui-color-danger-fg); border-color: var(--ui-color-danger-border); }
      </style>
      <div class="alert" data-variant="${this.variant}" role="alert"><slot></slot></div>
    `;
  }
}

if (!customElements.get("ui-alert")) {
  customElements.define("ui-alert", Alert);
}

export default Alert;
