/**
 * Atomic behavior: roving tabindex keyboard navigation.
 */
export interface RovingOptions {
  loop?: boolean;
  index?: number;
}
export interface RovingState {
  index: number;
  count: number;
  loop: boolean;
}
export function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  if (index < 0) return 0;
  if (index > count - 1) return count - 1;
  return index;
}
export function rovingIndex(
  current: number,
  key: string,
  count: number,
  options: RovingOptions = {},
): number {
  const loop = options.loop ?? true;
  if (count <= 0) return 0;
  let next = clampIndex(current, count);
  switch (key) {
    case "ArrowDown":
    case "ArrowRight":
      next = loop ? (next + 1) % count : Math.min(next + 1, count - 1);
      break;
    case "ArrowUp":
    case "ArrowLeft":
      next = loop ? (next - 1 + count) % count : Math.max(next - 1, 0);
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = count - 1;
      break;
    default:
      break;
  }
  return next;
}
export class RovingTabindex {
  count: number;
  loop: boolean;
  private _index: number;
  constructor(count = 0, options: RovingOptions = {}) {
    this.count = count;
    this.loop = options.loop ?? true;
    this._index = clampIndex(options.index ?? 0, count);
  }
  get index(): number {
    return this._index;
  }
  set index(value: number) {
    this._index = clampIndex(value, this.count);
  }
  setCount(count: number): void {
    this.count = count;
    this._index = clampIndex(this._index, count);
  }
  handleKey(key: string): number {
    this._index = rovingIndex(this._index, key, this.count, { loop: this.loop });
    return this._index;
  }
}
export function createRovingTabindex(count = 0, options: RovingOptions = {}): RovingTabindex {
  return new RovingTabindex(count, options);
}
