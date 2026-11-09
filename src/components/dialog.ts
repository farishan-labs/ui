import { Component } from "../core/component";

export class Dialog extends Component {
  static get observedAttributes(): string[] {
    return ["open", "label"];
  }

  get open(): boolean {
    return this.hasAttribute("open");
  }

  set open(value: boolean) {
    if (value) this.setAttribute("open", "");
    else this.removeAttribute("open");
  }

  private previouslyFocused: Element | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.sync();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    super.attributeChangedCallback(name, oldVal, newVal);
    this.sync();
  }

  private sync(): void {
    if (!this.root) return;
    if (this.open) {
      this.previouslyFocused = document.activeElement;
      const dialog = this.root.querySelector('[role="dialog"]') as HTMLElement | null;
      dialog?.focus();
    } else if (this.previouslyFocused instanceof HTMLElement) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
  }

  protected render(): void {
    const label = this.getAttribute("label") ?? "Dialog";
    this.root.innerHTML = this.html`
      <style>
        :host { display: ${this.open ? "block" : "none"}; }
        .backdrop {
          position: fixed; inset: 0; background: rgb(0 0 0 / 0.4);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .dialog {
          background: var(--ui-color-bg-default, #fff);
          color: var(--ui-color-fg-default, #09090b);
          border-radius: var(--ui-radius-lg, 0.5rem);
          padding: var(--ui-space-6, 1.5rem);
          max-width: 32rem; width: 90%;
          box-shadow: var(--ui-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--ui-space-3, 0.75rem); }
        .title { font-size: var(--ui-font-size-lg, 1.125rem); font-weight: 600; }
        .close { background: transparent; border: none; cursor: pointer; font-size: var(--ui-font-size-lg, 1.125rem); }
        .close:focus-visible { outline: 2px solid var(--ui-color-accent-default, #2563eb); outline-offset: 2px; }
      </style>
      <div class="backdrop" ${this.open ? "" : "hidden"} aria-hidden="${this.open ? "false" : "true"}">
        <div class="dialog" role="dialog" aria-modal="true" aria-label="${this.escapeHtml(label)}" tabindex="-1">
          <div class="header">
            <span class="title">${this.escapeHtml(label)}</span>
            <button class="close" type="button" aria-label="Close dialog" data-action="close">&times;</button>
          </div>
          <div class="body"><slot></slot></div>
        </div>
      </div>
    `;
    const closeBtn = this.root.querySelector('[data-action="close"]');
    closeBtn?.addEventListener("click", () => {
      this.open = false;
      this.emit("close");
    });
    // ESC to close
    this.root.querySelector(".backdrop")?.addEventListener("keydown", (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === "Escape") {
        this.open = false;
        this.emit("close");
      }
    });
  }
}

if (!customElements.get("ui-dialog")) {
  customElements.define("ui-dialog", Dialog);
}

export default Dialog;
