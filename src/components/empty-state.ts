import { Component } from "../core/component";

export class EmptyState extends Component {
  static get observedAttributes(): string[] {
    return ["title", "description"];
  }

  protected render(): void {
    const title = this.getAttribute("title") ?? "Nothing here yet";
    const description = this.getAttribute("description") ?? "";
    this.root.innerHTML = this.html`
      <style>
        :host { display: block; }
        .empty {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: var(--ui-space-2, 0.5rem); padding: var(--ui-space-8, 2rem);
          color: var(--ui-color-fg-muted, #71717a);
        }
        .title { font-size: var(--ui-font-size-lg, 1.125rem); font-weight: 600; color: var(--ui-color-fg-default, #09090b); }
        .description { font-size: var(--ui-font-size-sm, 0.875rem); max-width: 32rem; }
      </style>
      <div class="empty" role="status">
        <div class="title">${this.escapeHtml(title)}</div>
        ${description ? `<div class="description">${this.escapeHtml(description)}</div>` : ""}
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("ui-empty-state")) {
  customElements.define("ui-empty-state", EmptyState);
}

export default EmptyState;
