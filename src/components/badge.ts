import { Component } from "../core/component";

export class Badge extends Component {
  static get observedAttributes(): string[] {
    return ["variant"];
  }

  get variant(): string {
    return this.getAttribute("variant") || "default";
  }

  protected render(): void {
    this.root.innerHTML = this.html`
      <style>
        :host { display: inline-block; }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: var(--ui-space-1, 0.25rem);
          padding: var(--ui-space-1, 0.25rem) var(--ui-space-2, 0.5rem);
          border-radius: var(--ui-radius-full, 9999px);
          font-size: var(--ui-font-size-sm, 0.875rem);
          line-height: 1;
          background: var(--ui-color-bg-muted, #f4f4f5);
          color: var(--ui-color-fg-default, #09090b);
        }
        .badge[data-variant="success"] { background: var(--ui-color-success-bg, #dcfce7); color: var(--ui-color-success-fg, #166534); }
        .badge[data-variant="warning"] { background: var(--ui-color-warning-bg, #fef9c3); color: var(--ui-color-warning-fg, #854d0e); }
        .badge[data-variant="danger"] { background: var(--ui-color-danger-bg, #fee2e2); color: var(--ui-color-danger-fg, #991b1b); }
      </style>
      <span class="badge" data-variant="${this.variant}"><slot></slot></span>
    `;
  }
}

if (!customElements.get("ui-badge")) {
  customElements.define("ui-badge", Badge);
}

export default Badge;