import { Component } from "../core/component";

export class LoadingState extends Component {
  static get observedAttributes(): string[] {
    return ["label"];
  }

  protected render(): void {
    const label = this.getAttribute("label") ?? "Loading…";
    this.root.innerHTML = this.html`
      <style>
        :host { display: block; }
        .loading {
          display: flex; align-items: center; gap: var(--ui-space-2, 0.5rem);
          padding: var(--ui-space-4, 1rem); color: var(--ui-color-fg-muted, #71717a);
          font-size: var(--ui-font-size-sm, 0.875rem);
        }
        .spinner {
          width: 1rem; height: 1rem; border: 2px solid var(--ui-color-border-default, #e4e4e7);
          border-top-color: var(--ui-color-accent-default, #2563eb);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .spinner { animation: none; }
        }
      </style>
      <div class="loading" role="status" aria-live="polite" aria-busy="true">
        <span class="spinner" aria-hidden="true"></span>
        <span>${this.escapeHtml(label)}</span>
      </div>
    `;
  }
}

if (!customElements.get("ui-loading-state")) {
  customElements.define("ui-loading-state", LoadingState);
}

export default LoadingState;
