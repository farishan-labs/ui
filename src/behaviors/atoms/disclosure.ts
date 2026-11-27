/**
 * Atomic behavior: disclosure (open/closed toggle).
 */
export interface DisclosureState {
  open: boolean;
}
export type DisclosureAction = "toggle" | "open" | "close";
export function initialDisclosure(open = false): DisclosureState {
  return { open };
}
export function reduceDisclosure(
  state: DisclosureState,
  action: DisclosureAction,
): DisclosureState {
  switch (action) {
    case "toggle":
      return { open: !state.open };
    case "open":
      return { open: true };
    case "close":
      return { open: false };
  }
}
export class Disclosure {
  private _open: boolean;
  constructor(initialOpen = false) {
    this._open = initialOpen;
  }
  get open(): boolean {
    return this._open;
  }
  toggle(): boolean {
    this._open = !this._open;
    return this._open;
  }
  openPanel(): void {
    this._open = true;
  }
  closePanel(): void {
    this._open = false;
  }
}
export function createDisclosure(initialOpen = false): Disclosure {
  return new Disclosure(initialOpen);
}
