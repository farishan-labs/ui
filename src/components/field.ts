import { Component } from "../core/component";

let fieldCounter = 0;

export class Field extends Component {
  static get observedAttributes(): string[] {
    return [
      "label",
      "hint",
      "error",
      "name",
      "type",
      "placeholder",
      "value",
      "disabled",
      "required",
    ];
  }

  private fieldId = `ui-field-${++fieldCounter}`;

  get label(): string {
    return this.getAttribute("label") ?? "";
  }

  get hint(): string {
    return this.getAttribute("hint") ?? "";
  }

  get error(): string {
    return this.getAttribute("error") ?? "";
  }

  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }

  get required(): boolean {
    return this.hasAttribute("required");
  }

  protected render(): void {
    const id = this.fieldId;
    const type = this.getAttribute("type") ?? "text";
    const name = this.getAttribute("name") ?? "";
    const placeholder = this.getAttribute("placeholder") ?? "";
    const value = this.getAttribute("value") ?? "";
    const hint = this.hint;
    const error = this.error;
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : "";

    this.root.innerHTML = this.html`
      <style>
        :host { display: block; }
        .field { display: flex; flex-direction: column; gap: var(--ui-space-1, 0.25rem); }
        label { font-size: var(--ui-font-size-sm, 0.875rem); color: var(--ui-color-fg-default, #09090b); }
        input {
          font-family: var(--ui-font-family-sans, inherit);
          font-size: var(--ui-font-size-md, 1rem);
          padding: var(--ui-space-2, 0.5rem) var(--ui-space-3, 0.75rem);
          border: 1px solid var(--ui-color-border-default, #e4e4e7);
          border-radius: var(--ui-radius-md, 0.375rem);
          background: var(--ui-color-bg-default, #fff);
          color: var(--ui-color-fg-default, #09090b);
        }
        input:focus-visible { outline: 2px solid var(--ui-color-accent-default, #2563eb); outline-offset: 1px; border-color: var(--ui-color-accent-default, #2563eb); }
        input[aria-invalid="true"] { border-color: var(--ui-color-danger-default, #dc2626); }
        .hint { font-size: var(--ui-font-size-xs, 0.75rem); color: var(--ui-color-fg-muted, #71717a); }
        .error { font-size: var(--ui-font-size-xs, 0.75rem); color: var(--ui-color-danger-default, #dc2626); }
      </style>
      <div class="field">
        ${this.label ? `<label for="${id}">${this.escapeHtml(this.label)}${this.required ? " *" : ""}</label>` : ""}
        <input id="${id}" type="${this.escapeHtml(type)}" name="${this.escapeHtml(name)}" placeholder="${this.escapeHtml(placeholder)}" value="${this.escapeHtml(value)}" ${this.disabled ? "disabled" : ""} ${this.required ? "required" : ""} aria-invalid="${error ? "true" : "false"}" ${describedBy ? `aria-describedby="${describedBy}"` : ""} />
        ${hint && !error ? `<span id="${id}-hint" class="hint">${this.escapeHtml(hint)}</span>` : ""}
        ${error ? `<span id="${id}-error" class="error" role="alert">${this.escapeHtml(error)}</span>` : ""}
      </div>
    `;
  }
}

if (!customElements.get("ui-field")) {
  customElements.define("ui-field", Field);
}

export default Field;
