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
          gap: var(--ui-space-1);
          padding: var(--ui-space-1) var(--ui-space-2);
          border-radius: var(--ui-radius-full);
          font-size: var(--ui-font-size-sm);
          line-height: 1;
          background: var(--ui-color-bg-muted);
          color: var(--ui-color-fg-default);
        }
        .badge[data-variant="success"] { background: #dcfce7; color: #166534; }
        .badge[data-variant="danger"] { background: #fee2e2; color: #991b1b; }
        .badge[data-variant="warning"] { background: #fef9c3; color: #854d0e; }
        @media (prefers-color-scheme: dark) {
          .badge[data-variant="success"] { background: #14532d; color: #bbf7d0; }
          .badge[data-variant="danger"] { background: #7f1d1d; color: #fecaca; }
          .badge[data-variant="warning"] { background: #713f12; color: #fef08a; }
        }
      </style>
      <span class="badge" data-variant="${this.variant}"><slot></slot></span>
    `;
  }
}

if (!customElements.get("ui-badge")) {
  customElements.define("ui-badge", Badge);
}

export default Badge;
