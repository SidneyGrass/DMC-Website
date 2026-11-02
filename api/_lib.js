// Redaktionssystem – gemeinsame Funktionen (Anmeldung, Speicher auf GitHub)
// Dateien mit „_“ am Anfang sind auf Vercel keine eigenen Endpunkte.
//
// Benötigte Umgebungsvariablen (Vercel → Project → Settings → Environment Variables):
//   ADMIN_PASSWORD  Passwort für /admin
//   GITHUB_TOKEN    Fine-grained Token, nur für dieses Repo: Contents (Read & write), Commit statuses (Read)
// Optional:
//   GITHUB_REPO     z. B. SidneyGrass/DMC-Website (Standard: das Repo, aus dem Vercel baut)
//   GITHUB_BRANCH   Branch, in den gespeichert wird (Standard: der Branch dieses Deployments)
//   CMS_LOCAL_DIR   nur lokal: speichert direkt ins Dateisystem statt auf GitHub
import { createHmac, timingSafeEqual, createHash, randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import { join, dirname } from "node:path";

export const COLLECTIONS = ["bauvorhaben", "immobilien", "ratgeber", "referenzen", "bewertungen", "jobs"];
export const SINGLETONS = { einstellungen: "content/einstellungen.json" };
export const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

const env = (k, d = "") => process.env[k] || d;
export const config = () => ({
  password: env("ADMIN_PASSWORD"),
  token: env("GITHUB_TOKEN"),
  repo: env("GITHUB_REPO", process.env.VERCEL_GIT_REPO_OWNER ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}` : "SidneyGrass/DMC-Website"),
  branch: env("GITHUB_BRANCH", env("VERCEL_GIT_COMMIT_REF", "main")),
  local: env("CMS_LOCAL_DIR")
});

// ---------------------------------------------------------------------------
// Sitzung (signiertes Cookie, 12 Stunden)
// ---------------------------------------------------------------------------
const COOKIE = "dmc_cms";
const secret = () => { const c = config(); return createHash("sha256").update(`dmc-cms|${c.password}|${c.token}`).digest(); };
const sign = (v) => createHmac("sha256", secret()).update(v).digest("base64url");

export function checkPassword(input) {
  const pw = config().password;
  if (!pw) return false;
  const a = createHash("sha256").update(String(input || "")).digest();
  const b = createHash("sha256").update(pw).digest();
  return timingSafeEqual(a, b);
}
export function sessionCookie(req) {
  const exp = Date.now() + 12 * 3600 * 1000;
  const v = `${exp}.${randomBytes(8).toString("hex")}`;
  const secure = !/^localhost|^127\./.test(req.headers.host || "") ? "; Secure" : "";
  return `${COOKIE}=${v}.${sign(v)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200${secure}`;
}
export const clearCookie = `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
export function isLoggedIn(req) {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(req.headers.cookie || "");
  if (!m) return false;
  const parts = m[1].split(".");
  if (parts.length !== 3) return false;
  const v = `${parts[0]}.${parts[1]}`;
  const sig = Buffer.from(parts[2]);
  const exp = Buffer.from(sign(v));
  if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) return false;
  return Number(parts[0]) > Date.now();
}

// ---------------------------------------------------------------------------
// Speicher: GitHub (Git Data API → ein Commit pro Speichern) oder lokal
// ---------------------------------------------------------------------------
async function gh(path, { method = "GET", body, raw = false } = {}) {
  const c = config();
  const r = await fetch(`https://api.github.com/repos/${c.repo}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${c.token}`,
      Accept: raw ? "application/vnd.github.raw" : "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "dmc-cms",
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!r.ok) {
    const t = await r.text();
    const err = new Error(`GitHub ${r.status}: ${t.slice(0, 300)}`);
    err.status = r.status;
    throw err;
  }
  return raw ? Buffer.from(await r.arrayBuffer()) : r.status === 204 ? null : r.json();
}
const ref = () => encodeURIComponent(config().branch);
const localBlobs = join(process.env.TMPDIR || "/tmp", "dmc-cms-blobs");

export const store = {
  /** Dateinamen in einem Ordner */
  async list(dir) {
    const c = config();
    if (c.local) {
      try { return (await fs.readdir(join(c.local, dir))).map((name) => ({ name, path: `${dir}/${name}` })); } catch { return []; }
    }
    try {
      const items = await gh(`/contents/${dir}?ref=${ref()}`);
      return items.filter((x) => x.type === "file").map((x) => ({ name: x.name, path: x.path, sha: x.sha }));
    } catch (e) { if (e.status === 404) return []; throw e; }
  },
  /** Dateiinhalt als Buffer (null, wenn nicht vorhanden) */
  async read(path) {
    const c = config();
    if (c.local) { try { return await fs.readFile(join(c.local, path)); } catch { return null; } }
    try { return await gh(`/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${ref()}`, { raw: true }); } catch (e) { if (e.status === 404) return null; throw e; }
  },
  /** Binärdatei vorab hochladen (noch kein Commit) → Kennung */
  async blob(buffer) {
    const c = config();
    if (c.local) {
      const id = createHash("sha1").update(buffer).digest("hex");
      await fs.mkdir(localBlobs, { recursive: true });
      await fs.writeFile(join(localBlobs, id), buffer);
      return id;
    }
    const b = await gh(`/git/blobs`, { method: "POST", body: { content: buffer.toString("base64"), encoding: "base64" } });
    return b.sha;
  },
  /** Ein Commit mit allen Änderungen: files = [{ path, text } | { path, blob }], remove = [path] */
  async commit({ files = [], remove = [], message }) {
    const c = config();
    if (c.local) {
      for (const f of files) {
        const p = join(c.local, f.path);
        await fs.mkdir(dirname(p), { recursive: true });
        await fs.writeFile(p, f.text != null ? f.text : await fs.readFile(join(localBlobs, f.blob)));
      }
      for (const p of remove) await fs.rm(join(c.local, p), { force: true });
      if (typeof globalThis.__cmsAfterCommit === "function") await globalThis.__cmsAfterCommit();
      return { sha: "local-" + Date.now() };
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      const head = await gh(`/git/ref/heads/${ref()}`);
      const parent = await gh(`/git/commits/${head.object.sha}`);
      const tree = [
        ...files.map((f) => (f.text != null
          ? { path: f.path, mode: "100644", type: "blob", content: f.text }
          : { path: f.path, mode: "100644", type: "blob", sha: f.blob })),
        ...remove.map((p) => ({ path: p, mode: "100644", type: "blob", sha: null }))
      ];
      const t = await gh(`/git/trees`, { method: "POST", body: { base_tree: parent.tree.sha, tree } });
      const commit = await gh(`/git/commits`, { method: "POST", body: { message, tree: t.sha, parents: [head.object.sha], author: { name: "DMC Redaktion", email: "redaktion@dmc-realestate.de" } } });
      try {
        await gh(`/git/refs/heads/${ref()}`, { method: "PATCH", body: { sha: commit.sha, force: false } });
        return { sha: commit.sha };
      } catch (e) {
        if (e.status !== 422 || attempt === 2) throw e; // Branch hat sich inzwischen bewegt → erneut versuchen
      }
    }
  },
  /** Veröffentlichungsstatus (Vercel meldet ihn als Commit-Status an GitHub) */
  async status(sha) {
    const c = config();
    if (c.local) return { state: "success" };
    try {
      const s = await gh(`/commits/${sha}/status`);
      const v = (s.statuses || []).find((x) => /vercel/i.test(x.context));
      return { state: v ? v.state : s.state === "pending" && !s.statuses?.length ? "unknown" : s.state, url: v?.target_url || "" };
    } catch { return { state: "unknown" }; }
  }
};

// ---------------------------------------------------------------------------
export function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}
