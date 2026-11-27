import { Component } from "../core/component";

export class Card extends Component {
  static get observedAttributes(): string[] {
    return ["elevated"];
  }

  get elevated(): boolean {
    return this.hasAttribute("elevated");
  }

  protected render(): void {
    this.root.innerHTML = this.html`
      <style>
        :host { display: block; }
        .card {
          background: var(--ui-color-bg-default);
          color: var(--ui-color-fg-default);
          border: 1px solid var(--ui-color-border-default);
          border-radius: var(--ui-radius-lg);
          padding: var(--ui-space-4);
          box-shadow: ${this.elevated ? "var(--ui-shadow-md)" : "none"};
        }
        .header { margin-bottom: var(--ui-space-3); font-weight: 600; }
        .footer { margin-top: var(--ui-space-3); }
      </style>
      <div class="card" part="card">
        <div class="header"><slot name="header"></slot></div>
        <div class="body"><slot></slot></div>
        <div class="footer"><slot name="footer"></slot></div>
      </div>
    `;
  }
}

if (!customElements.get("ui-card")) {
  customElements.define("ui-card", Card);
}

export default Card;
