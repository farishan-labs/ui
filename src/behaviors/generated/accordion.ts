import { Disclosure } from "../atoms/disclosure";
import { RovingTabindex } from "../atoms/roving-tabindex";

export interface AccordionOptions {
  multiple?: boolean;
  collapsible?: boolean;
  disabled?: (value: string) => boolean;
  initialOpen?: string[];
}

export class Accordion {
  open: string[];
  multiple: boolean;
  collapsible: boolean;
  private disabledFn: (value: string) => boolean;
  private roving: RovingTabindex;

  constructor(options: AccordionOptions = {}, count = 0) {
    this.multiple = options.multiple ?? false;
    this.collapsible = options.collapsible ?? true;
    this.disabledFn = options.disabled ?? (() => false);
    this.open = [...(options.initialOpen ?? [])];
    this.roving = new RovingTabindex(count);
  }

  isDisabled(value: string): boolean {
    return this.disabledFn(value);
  }

  isExpanded(value: string): boolean {
    return this.open.includes(value);
  }

  toggle(value: string): void {
    if (this.isDisabled(value)) return;
    const disclosure = new Disclosure(this.open.includes(value));
    if (disclosure.open) {
      if (this.collapsible || this.open.length > 1) {
        disclosure.closePanel();
        this.open = this.open.filter((v) => v !== value);
      }
    } else {
      disclosure.openPanel();
      this.open = this.multiple ? [...this.open, value] : [value];
    }
  }

  get focusIndex(): number {
    return this.roving.index;
  }

  setItemCount(count: number): void {
    this.roving.setCount(count);
  }

  moveFocus(key: string): number {
    return this.roving.handleKey(key);
  }
}

export function createAccordion(options?: AccordionOptions, count?: number): Accordion {
  return new Accordion(options, count);
}
