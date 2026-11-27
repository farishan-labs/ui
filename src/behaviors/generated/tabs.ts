import { RovingTabindex } from "../atoms/roving-tabindex";

export interface TabsOptions {
  initialActive?: string;
}

export class Tabs {
  active: string;
  private roving: RovingTabindex;

  constructor(options: TabsOptions = {}, count = 0) {
    this.active = options.initialActive ?? "";
    this.roving = new RovingTabindex(count);
  }

  isActive(value: string): boolean {
    return this.active === value;
  }

  select(value: string): void {
    this.active = value;
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

export function createTabs(options?: TabsOptions, count?: number): Tabs {
  return new Tabs(options, count);
}
