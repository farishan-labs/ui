import { Component } from "../core/component";

export class JsonViewer extends Component {
  static get observedAttributes(): string[] {
    return ["value", "collapsed"];
  }

  get value(): string {
    return this.getAttribute("value") ?? this.textContent?.trim() ?? "";
  }

  protected render(): void {
    let pretty = this.value;
    try {
      pretty = JSON.stringify(JSON.parse(this.value), null, 2);
    } catch {
      // keep raw
    }
    this.root.innerHTML = this.html`
      <style>
        :host { display: block; }
        .viewer {
          background: var(--ui-color-bg-muted, #f4f4f5);
          color: var(--ui-color-fg-default, #09090b);
          border: 1px solid var(--ui-color-border-default, #e4e4e7);
          border-radius: var(--ui-radius-md, 0.375rem);
          padding: var(--ui-space-3, 0.75rem);
          font-family: var(--ui-font-mono, monospace);
          font-size: var(--ui-text-sm, 0.875rem);
          overflow: auto;
          max-height: 24rem;
        }
        pre { margin: 0; white-space: pre-wrap; word-break: break-word; }
        .toolbar { display: flex; justify-content: flex-end; margin-bottom: var(--ui-space-2, 0.5rem); }
        button { font: inherit; cursor: pointer; border: 1px solid var(--ui-color-border-default, #e4e4e7); background: transparent; border-radius: var(--ui-radius-sm, 0.25rem); padding: 0.25rem 0.5rem; }
      </style>
      <div class="toolbar"><button type="button" part="copy">Copy</button></div>
      <div class="viewer" part="viewer"><pre>${this.escapeHtml(pretty)}</pre></div>
    `;
    const btn = this.root.querySelector("button");
    btn?.addEventListener("click", () => {
      navigator.clipboard?.writeText(pretty);
      this.emit("copy", pretty);
    });
  }
}

if (!customElements.get("ui-json-viewer")) {
  customElements.define("ui-json-viewer", JsonViewer);
}

export default JsonViewer;
