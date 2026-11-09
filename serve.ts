import { extname, normalize, resolve, sep } from "node:path";

const ROOT = resolve(".");
const PORT = Number(process.env.PORT ?? 3000);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/demo/index.html";

    const candidate = resolve(ROOT, "." + pathname);
    if (candidate !== ROOT && !candidate.startsWith(ROOT + sep)) {
      return new Response("Forbidden", { status: 403 });
    }

    const file = Bun.file(candidate);
    if (!(await file.exists())) {
      return new Response("Not Found", { status: 404 });
    }

    const type = MIME[extname(candidate).toLowerCase()] ?? "application/octet-stream";
    return new Response(file, {
      headers: {
        "content-type": type,
        "cache-control": "no-cache",
      },
    });
  },
});

console.log(`Serving ${ROOT} on http://localhost:${server.port}`);
