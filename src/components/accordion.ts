import { Component } from "../core/component";
import { Accordion as AccordionBehavior } from "../behaviors/generated/accordion";

interface AccordionItem {
  value: string;
  title: string;
  content: string;
}

export class AccordionComponent extends Component {
  static get observedAttributes(): string[] {
    return ["items", "multiple", "collapsible"];
  }

  private behavior: AccordionBehavior | null = null;

  private getItems(): AccordionItem[] {
    try {
      const raw = this.getAttribute("items");
      return raw ? (JSON.parse(raw) as AccordionItem[]) : [];
    } catch {
      return [];
    }
  }

  private getBehavior(): AccordionBehavior {
    const items = this.getItems();
    if (!this.behavior) {
      this.behavior = new AccordionBehavior(
        {
          multiple: this.hasAttribute("multiple"),
          collapsible:
            !this.hasAttribute("collapsible") || this.getAttribute("collapsible") !== "false",
        },
        items.length,
      );
    }
    this.behavior.setItemCount(items.length);
    return this.behavior;
  }

  protected render(): void {
    const items = this.getItems();
    const behavior = this.getBehavior();
    behavior.multiple = this.hasAttribute("multiple");
    behavior.collapsible =
      !this.hasAttribute("collapsible") || this.getAttribute("collapsible") !== "false";

    this.root.innerHTML = this.html`
      <style>
        :host { display: block; }
        .item { border-bottom: 1px solid var(--ui-color-border-default); }
        .trigger {
          width: 100%; text-align: left; background: transparent; border: none;
          padding: var(--ui-space-3, 0.75rem) var(--ui-space-4, 1rem); cursor: pointer;
          font: inherit; color: var(--ui-color-fg-default);
        }
        .trigger:focus-visible { outline: 2px solid var(--ui-color-accent-default); outline-offset: 2px; }
        .panel { padding: var(--ui-space-3, 0.75rem) var(--ui-space-4, 1rem); }
      </style>
      ${items
        .map((item, i) => {
          const expanded = behavior.isExpanded(item.value);
          return `
            <div class="item">
              <button class="trigger" type="button" data-index="${i}" data-value="${this.escapeHtml(item.value)}" aria-expanded="${expanded}">
                ${this.escapeHtml(item.title)}
              </button>
              <div class="panel" role="region" ${expanded ? "" : "hidden"}>${this.escapeHtml(item.content)}</div>
            </div>
          `;
        })
        .join("")}
    `;

    this.root.querySelectorAll(".trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-value") ?? "";
        behavior.toggle(value);
        this.render();
      });
    });
  }
}

if (!customElements.get("ui-accordion")) {
  customElements.define("ui-accordion", AccordionComponent);
}

export default AccordionComponent;
