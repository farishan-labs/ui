/**
 * Adapter: ui-sdk.dev (remote component SDK) behind FHL UI's token/a11y contract.
 *
 * This is an ADAPTER, not a foundation (see PHILOSOPHY.md P5, P7, P8, P10):
 *  - It is OPT-IN. It is NOT imported by `src/index.ts`; consumers pull it via
 *    `import "@farishan-labs/ui/adapters/ui-sdk"` (or the subpath export).
 *  - It keeps FHL UI's core self-contained and offline-capable (P8, P10). The
 *    remote SDK is loaded lazily and only enhances; if it is unavailable the
 *    consumer falls back to FHL's own primitives / native elements.
 *  - It maps FHL design tokens onto the remote SDK's CSS variables so that
 *    remote components inherit the lab's visual language (P4).
 *
 * Remote dependency: https://ui-sdk.dev (Vercel-hosted, versioned loader).
 * Self-hosting the loader is supported via `base` to satisfy P8.
 */

export interface UiSdkLoadOptions {
  /** Base URL of the ui-sdk.dev loader. Default: https://ui-sdk.dev/ */
  base?: string;
  /** Timeout in ms before giving up. Default: 8000. */
  timeoutMs?: number;
  /** Target document. Default: global document. */
  doc?: Document;
}

const DEFAULT_BASE = "https://ui-sdk.dev/";
const DEFAULT_TIMEOUT = 8000;

let cachedPromise: Promise<void> | null = null;
let cachedBase: string | null = null;

function normalizeBase(base: string): string {
  return base.endsWith("/") ? base : base + "/";
}

/**
 * Inject the ui-sdk.dev loader script and resolve once it has executed.
 * Idempotent for a given base URL.
 */
export function loadUiSdk(options: UiSdkLoadOptions = {}): Promise<void> {
  const base = normalizeBase(options.base ?? DEFAULT_BASE);
  const doc = options.doc ?? (typeof document !== "undefined" ? document : null);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT;

  if (!doc) {
    return Promise.reject(new Error("loadUiSdk: no document available"));
  }

  // Reuse in-flight promise for the same base.
  if (cachedPromise && cachedBase === base) return cachedPromise;

  cachedBase = base;
  cachedPromise = new Promise<void>((resolve, reject) => {
    // Already loaded?
    if (doc.querySelector(`script[data-fhl-ui-sdk="${base}"]`)) {
      resolve();
      return;
    }

    const script = doc.createElement("script");
    script.type = "module";
    script.src = `${base}web.js`;
    script.setAttribute("data-fhl-ui-sdk", base);
    script.async = true;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`loadUiSdk: timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error(`loadUiSdk: failed to load ${script.src}`));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    doc.head.appendChild(script);
  });

  // Reset cache on failure so callers can retry.
  cachedPromise = cachedPromise.catch((err) => {
    cachedPromise = null;
    cachedBase = null;
    throw err;
  });

  return cachedPromise;
}

/**
 * Idempotent helper. Resolves when the remote SDK is ready, rejects on failure.
 * Consumers should handle rejection and fall back to FHL primitives / native.
 */
export function ensureUiSdk(options: UiSdkLoadOptions = {}): Promise<void> {
  return loadUiSdk(options);
}

/**
 * Bridge FHL design tokens onto the remote SDK's CSS variable namespace.
 * Both currently share the `--ui-*` prefix, so this is mostly an identity
 * copy/normalization step; it also lets consumers override the source root.
 */
export function applyTokenBridge(root: HTMLElement | Document = document): void {
  if (typeof document === "undefined") return;
  const target = (root as Document).documentElement ?? (root as HTMLElement);
  if (!target) return;
  // ui-sdk.dev reads the same --ui-* variables FHL tokens define, so no
  // translation is required today. This function exists as the single seam
  // where future divergence would be handled.
  target.setAttribute("data-fhl-ui-sdk-bridge", "ready");
}

/**
 * Whether the remote SDK appears to be present in the current document.
 */
export function uiSdkPresent(doc: Document = document): boolean {
  return !!doc.querySelector("script[data-fhl-ui-sdk]");
}

export const UI_SDK_DEFAULT_BASE = DEFAULT_BASE;
export default { loadUiSdk, ensureUiSdk, applyTokenBridge, uiSdkPresent };
