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
          background: var(--ui-color-bg-default, #fff);
          color: var(--ui-color-fg-default, #09090b);
          border: 1px solid var(--ui-color-border-default, #e4e4e7);
          border-radius: var(--ui-radius-lg, 0.5rem);
          padding: var(--ui-space-4, 1rem);
          box-shadow: ${this.elevated ? "var(--ui-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1))" : "none"};
        }
        .header { margin-bottom: var(--ui-space-3, 0.75rem); font-weight: 600; }
        .footer { margin-top: var(--ui-space-3, 0.75rem); }
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
