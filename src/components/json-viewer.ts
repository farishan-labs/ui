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
          background: var(--ui-color-bg-muted);
          color: var(--ui-color-fg-default);
          border: 1px solid var(--ui-color-border-default);
          border-radius: var(--ui-radius-md);
          padding: var(--ui-space-3);
          font-family: var(--ui-font-mono);
          font-size: var(--ui-text-sm);
          overflow: auto;
          max-height: 24rem;
        }
        pre { margin: 0; white-space: pre-wrap; word-break: break-word; }
        .toolbar { display: flex; justify-content: flex-end; margin-bottom: var(--ui-space-2); }
        button { font: inherit; cursor: pointer; border: 1px solid var(--ui-color-border-default); background: transparent; border-radius: var(--ui-radius-sm); padding: 0.25rem 0.5rem; }
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
