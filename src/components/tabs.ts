import { Component } from "../core/component";
import { Tabs as TabsBehavior } from "../behaviors/generated/tabs";

interface TabItem {
  value: string;
  title: string;
  content: string;
}

export class TabsComponent extends Component {
  static get observedAttributes(): string[] {
    return ["items", "active"];
  }

  private behavior: TabsBehavior | null = null;

  private getItems(): TabItem[] {
    try {
      const raw = this.getAttribute("items");
      return raw ? (JSON.parse(raw) as TabItem[]) : [];
    } catch {
      return [];
    }
  }

  private getBehavior(): TabsBehavior {
    const items = this.getItems();
    if (!this.behavior) {
      this.behavior = new TabsBehavior(
        { initialActive: this.getAttribute("active") ?? items[0]?.value ?? "" },
        items.length,
      );
    }
    this.behavior.setItemCount(items.length);
    const activeAttr = this.getAttribute("active");
    if (activeAttr !== null) this.behavior.active = activeAttr;
    return this.behavior;
  }

  protected render(): void {
    const items = this.getItems();
    const behavior = this.getBehavior();

    this.root.innerHTML = this.html`
      <style>
        :host { display: block; }
        .tablist { display: flex; gap: var(--ui-space-2, 0.5rem); border-bottom: 1px solid var(--ui-color-border-default); }
        .tab {
          background: transparent; border: none; padding: var(--ui-space-2, 0.5rem) var(--ui-space-3, 0.75rem);
          cursor: pointer; font: inherit; color: var(--ui-color-fg-default);
          border-bottom: 2px solid transparent;
        }
        .tab[aria-selected="true"] { border-bottom-color: var(--ui-color-accent-default); font-weight: 600; }
        .tab:focus-visible { outline: 2px solid var(--ui-color-accent-default); outline-offset: 2px; }
        .panel { padding: var(--ui-space-3, 0.75rem) var(--ui-space-4, 1rem); }
      </style>
      <div class="tablist" role="tablist">
        ${items
          .map((item) => {
            const selected = behavior.isActive(item.value);
            return `<button class="tab" type="button" role="tab" data-value="${this.escapeHtml(item.value)}" aria-selected="${selected}" tabindex="${selected ? "0" : "-1"}">${this.escapeHtml(item.title)}</button>`;
          })
          .join("")}
      </div>
      ${items
        .map((item) => {
          const selected = behavior.isActive(item.value);
          return `<div class="panel" role="tabpanel" ${selected ? "" : "hidden"}>${this.escapeHtml(item.content)}</div>`;
        })
        .join("")}
    `;

    this.root.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-value") ?? "";
        behavior.select(value);
        this.setAttribute("active", value);
        this.render();
      });
    });
  }
}

if (!customElements.get("ui-tabs")) {
  customElements.define("ui-tabs", TabsComponent);
}

export default TabsComponent;
