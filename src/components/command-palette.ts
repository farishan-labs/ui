import { Component } from "../core/component";

export class CommandPalette extends Component {
  static get observedAttributes(): string[] {
    return ["open", "placeholder"];
  }

  get open(): boolean {
    return this.hasAttribute("open");
  }

  set open(value: boolean) {
    if (value) this.setAttribute("open", "");
    else this.removeAttribute("open");
  }

  protected render(): void {
    const placeholder = this.getAttribute("placeholder") ?? "Type a command…";
    this.root.innerHTML = this.html`
      <style>
        :host { display: ${this.open ? "block" : "none"}; }
        .backdrop {
          position: fixed; inset: 0; background: rgb(0 0 0 / 0.4);
          display: flex; align-items: flex-start; justify-content: center; padding-top: 10vh; z-index: 1000;
        }
        .palette {
          background: var(--ui-color-bg-default, #fff);
          color: var(--ui-color-fg-default, #09090b);
          border-radius: var(--ui-radius-lg, 0.5rem);
          width: 90%; max-width: 32rem;
          box-shadow: var(--ui-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
          overflow: hidden;
        }
        input {
          width: 100%; box-sizing: border-box;
          font-family: var(--ui-font-family-sans, inherit);
          font-size: var(--ui-font-size-md, 1rem);
          padding: var(--ui-space-3, 0.75rem) var(--ui-space-4, 1rem);
          border: none; border-bottom: 1px solid var(--ui-color-border-default, #e4e4e7);
          outline: none;
        }
        input:focus-visible { outline: none; }
        .list { max-height: 50vh; overflow: auto; padding: var(--ui-space-2, 0.5rem); }
      </style>
      <div class="backdrop">
        <div class="palette" role="dialog" aria-modal="true" aria-label="Command palette">
          <input type="text" placeholder="${this.escapeHtml(placeholder)}" aria-label="Search commands" />
          <div class="list" role="listbox"><slot></slot></div>
        </div>
      </div>
    `;
    const input = this.root.querySelector("input");
    input?.addEventListener("keydown", (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === "Escape") {
        this.open = false;
        this.emit("close");
      }
    });
    this.root.querySelector(".backdrop")?.addEventListener("click", (e: Event) => {
      if (e.target === this.root.querySelector(".backdrop")) {
        this.open = false;
        this.emit("close");
      }
    });
  }
}

if (!customElements.get("ui-command-palette")) {
  customElements.define("ui-command-palette", CommandPalette);
}

export default CommandPalette;
