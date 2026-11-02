// Lokaler Testserver für Website + Redaktionssystem
// Aufruf: ADMIN_PASSWORD=test node tools/cms-dev.mjs   → http://localhost:3000/admin
// Speichert direkt in content/ und public/uploads/ (kein GitHub) und baut die Seite danach neu.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.env.CMS_LOCAL_DIR = root;
process.env.ADMIN_PASSWORD ||= "test";
const build = () => execFileSync(process.execPath, ["build.mjs"], { cwd: root, stdio: "inherit" });
globalThis.__cmsAfterCommit = build;
build();
const { default: cms } = await import("../api/cms.js");

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".pdf": "application/pdf", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain" };
const port = Number(process.env.PORT || 3000);

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/cms") {
    let raw = "";
    for await (const c of req) raw += c;
    req.query = Object.fromEntries(url.searchParams);
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    return cms(req, res);
  }
  const dist = join(root, "dist");
  const p = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/index";
  for (const cand of [p, p + ".html", p + "/index.html"]) {
    const f = join(dist, cand);
    if (!f.startsWith(dist)) break;
    try { if ((await stat(f)).isFile()) { res.writeHead(200, { "Content-Type": MIME[extname(f)] || "application/octet-stream" }); return res.end(await readFile(f)); } } catch {}
  }
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(await readFile(join(dist, "404.html")).catch(() => "404"));
}).listen(port, () => console.log(`→ http://localhost:${port}/admin  (Passwort: ${process.env.ADMIN_PASSWORD})`));
