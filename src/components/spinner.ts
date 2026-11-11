import { Component } from "../core/component";

export class Spinner extends Component {
  static get observedAttributes(): string[] {
    return ["size"];
  }

  get size(): string {
    return this.getAttribute("size") || "md";
  }

  protected render(): void {
    this.root.innerHTML = this.html`
      <style>
        :host { display: inline-block; }
        .spinner {
          width: var(--ui-spinner-size, 1.25rem);
          height: var(--ui-spinner-size, 1.25rem);
          border: 2px solid var(--ui-color-border-default, #e4e4e7);
          border-top-color: var(--ui-color-fg-default, #09090b);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
      <div class="spinner" role="status" aria-label="Loading"></div>
    `;
  }
}

if (!customElements.get("ui-spinner")) {
  customElements.define("ui-spinner", Spinner);
}

export default Spinner;