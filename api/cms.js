// Redaktionssystem – Schnittstelle für /admin
// Alle Aufrufe: /api/cms?action=…
import { randomBytes } from "node:crypto";
import { COLLECTIONS, SINGLETONS, SLUG_RE, config, checkPassword, sessionCookie, clearCookie, isLoggedIn, store, send } from "./_lib.js";

const MAX_JSON = 300 * 1024;
const MAX_FILE = 3.2 * 1024 * 1024;
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };
const RAW_TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", pdf: "application/pdf", json: "application/json" };

const fileFor = (type, slug) => (SINGLETONS[type] ? SINGLETONS[type] : `content/${type}/${slug}.json`);
const validType = (t) => COLLECTIONS.includes(t) || t in SINGLETONS;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const safeName = (n = "datei") => n.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "datei";

async function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  return {};
}

export default async function handler(req, res) {
  const action = (req.query && req.query.action) || new URL(req.url, "http://x").searchParams.get("action");
  const q = req.query || Object.fromEntries(new URL(req.url, "http://x").searchParams);
  const c = config();
  try {
    // ---- ohne Anmeldung -------------------------------------------------
    if (action === "session") {
      return send(res, 200, { loggedIn: isLoggedIn(req), configured: Boolean(c.password && (c.token || c.local)), branch: c.branch, local: Boolean(c.local) });
    }
    if (action === "login" && req.method === "POST") {
      const b = await body(req);
      if (!c.password) return send(res, 500, { error: "ADMIN_PASSWORD ist nicht gesetzt." });
      if (!checkPassword(b.password)) { await sleep(900); return send(res, 401, { error: "Passwort ist nicht korrekt." }); }
      res.setHeader("Set-Cookie", sessionCookie(req));
      return send(res, 200, { ok: true });
    }
    if (action === "logout") { res.setHeader("Set-Cookie", clearCookie); return send(res, 200, { ok: true }); }

    // ---- ab hier nur angemeldet -----------------------------------------
    if (!isLoggedIn(req)) return send(res, 401, { error: "Bitte neu anmelden." });
    if (req.method !== "GET" && req.headers["x-cms"] !== "1") return send(res, 403, { error: "Ungültige Anfrage." });
    if (!c.token && !c.local) return send(res, 500, { error: "GITHUB_TOKEN ist nicht gesetzt." });

    if (action === "list") {
      if (!COLLECTIONS.includes(q.type)) return send(res, 400, { error: "Unbekannter Bereich." });
      const files = (await store.list(`content/${q.type}`)).filter((f) => f.name.endsWith(".json"));
      const items = await Promise.all(files.map(async (f) => {
        try { return { ...JSON.parse((await store.read(f.path)).toString("utf8")), slug: f.name.replace(/\.json$/, "") }; }
        catch { return { slug: f.name.replace(/\.json$/, ""), title: f.name, _broken: true }; }
      }));
      return send(res, 200, { items });
    }

    if (action === "get") {
      if (!validType(q.type) || (!SINGLETONS[q.type] && !SLUG_RE.test(q.slug || ""))) return send(res, 400, { error: "Ungültig." });
      const buf = await store.read(fileFor(q.type, q.slug));
      return send(res, 200, { item: buf ? JSON.parse(buf.toString("utf8")) : null });
    }

    if (action === "save" && req.method === "POST") {
      const b = await body(req);
      if (!validType(b.type)) return send(res, 400, { error: "Unbekannter Bereich." });
      const single = Boolean(SINGLETONS[b.type]);
      if (!single && !SLUG_RE.test(b.slug || "")) return send(res, 400, { error: "Die Adresse (URL) darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten." });
      if (!b.data || typeof b.data !== "object" || Array.isArray(b.data)) return send(res, 400, { error: "Keine Daten." });
      const data = single ? b.data : { ...b.data, slug: b.slug };
      const text = JSON.stringify(data, null, 2) + "\n";
      if (text.length > MAX_JSON) return send(res, 413, { error: "Der Eintrag ist zu groß." });
      const path = fileFor(b.type, b.slug);
      const remove = [];
      if (!single && b.oldSlug && b.oldSlug !== b.slug) {
        if (!SLUG_RE.test(b.oldSlug)) return send(res, 400, { error: "Ungültig." });
        if (await store.read(path)) return send(res, 409, { error: "Diese Adresse (URL) ist schon vergeben." });
        remove.push(fileFor(b.type, b.oldSlug));
      } else if (!single && b.isNew && (await store.read(path))) {
        return send(res, 409, { error: "Diese Adresse (URL) ist schon vergeben. Bitte Titel oder URL ändern." });
      }
      const uploads = (Array.isArray(b.uploads) ? b.uploads : [])
        .filter((u) => u && /^public\/uploads\/[a-z0-9/_.-]+$/.test(u.path) && /^[a-f0-9]{40}$/.test(u.blob) && text.includes(u.path.replace(/^public/, "")));
      const label = single ? "Firmendaten" : `${b.type}: ${data.title || b.slug}`;
      const r = await store.commit({ files: [{ path, text }, ...uploads.map((u) => ({ path: u.path, blob: u.blob }))], remove, message: `Redaktion – ${label} gespeichert` });
      return send(res, 200, { ok: true, sha: r.sha });
    }

    if (action === "delete" && req.method === "POST") {
      const b = await body(req);
      if (!COLLECTIONS.includes(b.type) || !SLUG_RE.test(b.slug || "")) return send(res, 400, { error: "Ungültig." });
      const r = await store.commit({ remove: [fileFor(b.type, b.slug)], message: `Redaktion – ${b.type}: ${b.slug} gelöscht` });
      return send(res, 200, { ok: true, sha: r.sha });
    }

    if (action === "upload" && req.method === "POST") {
      const b = await body(req);
      const ext = TYPES[b.mime];
      if (!ext) return send(res, 400, { error: "Nur Bilder (JPG, PNG, WebP) und PDF-Dateien sind erlaubt." });
      const buf = Buffer.from(String(b.data || ""), "base64");
      if (!buf.length) return send(res, 400, { error: "Leere Datei." });
      if (buf.length > MAX_FILE) return send(res, 413, { error: "Datei ist zu groß (max. 3 MB). Bitte verkleinern." });
      const sig = buf.subarray(0, 4).toString("hex");
      const okSig = { jpg: /^ffd8ff/, png: /^89504e47/, webp: /^52494646/, pdf: /^25504446/ }[ext];
      if (!okSig.test(sig)) return send(res, 400, { error: "Die Datei ist beschädigt oder hat ein falsches Format." });
      const d = new Date();
      const path = `public/uploads/${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}/${safeName(b.name)}-${randomBytes(3).toString("hex")}.${ext}`;
      const blob = await store.blob(buf);
      return send(res, 200, { ok: true, path, blob, url: path.replace(/^public/, "") });
    }

    if (action === "raw") {
      const p = String(q.path || "").replace(/^\/uploads\//, "public/uploads/");
      if (!/^public\/uploads\/[a-z0-9/_.-]+$/.test(p) || p.includes("..")) return send(res, 400, { error: "Ungültig." });
      const buf = await store.read(p);
      if (!buf) return send(res, 404, { error: "Nicht gefunden." });
      res.statusCode = 200;
      res.setHeader("Content-Type", RAW_TYPES[p.split(".").pop()] || "application/octet-stream");
      res.setHeader("Cache-Control", "private, max-age=600");
      return res.end(buf);
    }

    if (action === "status") {
      if (!/^[a-z0-9-]{6,64}$/.test(q.sha || "")) return send(res, 400, { error: "Ungültig." });
      return send(res, 200, await store.status(q.sha));
    }

    return send(res, 404, { error: "Unbekannte Aktion." });
  } catch (e) {
    console.error(e);
    const auth = e.status === 401 || e.status === 403;
    return send(res, 500, { error: auth ? "Zugriff auf GitHub verweigert – bitte GITHUB_TOKEN prüfen." : "Speichern fehlgeschlagen. Bitte erneut versuchen." });
  }
}
