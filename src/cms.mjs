// Inhalte aus dem Redaktionssystem (/admin)
// Alle pflegbaren Inhalte liegen als JSON-Dateien im Ordner content/.
// Das Redaktionssystem speichert dort per GitHub – Vercel baut danach automatisch neu.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "content");

const readJson = (file, fallback) => {
  try { return JSON.parse(readFileSync(file, "utf8")); } catch (e) {
    if (existsSync(file)) console.warn(`⚠ ${file}: ${e.message}`);
    return fallback;
  }
};

/** Alle veröffentlichten Einträge einer Sammlung, sortiert nach „order“, dann Titel */
export function collection(name, { all = false } = {}) {
  const d = join(dir, name);
  if (!existsSync(d)) return [];
  return readdirSync(d)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ slug: f.replace(/\.json$/, ""), ...readJson(join(d, f), {}) }))
    .filter((x) => all || x.published !== false)
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999) || String(a.title).localeCompare(String(b.title), "de"));
}

export const settings = readJson(join(dir, "einstellungen.json"), {});

// ---------------------------------------------------------------------------
// Einfache, sichere Textformatierung für Texte aus dem Redaktionssystem
//   Leerzeile = neuer Absatz · **fett** · *kursiv* · [Linktext](https://…)
//   Zeilen mit „- “ = Aufzählung · Tabellen mit | Spalte | Spalte |
// ---------------------------------------------------------------------------
const escHtml = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function inline(s = "") {
  return escHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|mailto:|tel:)[^)\s]+)\)/g, (m, t, u) => {
      const ext = /^https?:/.test(u);
      return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;
    });
}

export function md(text = "") {
  const blocks = String(text).replace(/\r\n/g, "\n").trim().split(/\n\s*\n/);
  return blocks.filter((b) => b.trim()).map((b) => {
    const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.every((l) => /^[-•*]\s+/.test(l))) {
      return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^[-•*]\s+/, ""))}</li>`).join("")}</ul>`;
    }
    if (lines.length >= 2 && lines.every((l) => l.startsWith("|"))) {
      const cells = (l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const rows = lines.filter((l) => !/^\|[\s:|-]+\|$/.test(l)).map(cells);
      const [head, ...body] = rows;
      return `<div class="table-wrap"><table class="table"><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    return `<p>${lines.map(inline).join("<br>")}</p>`;
  }).join("");
}

/** Text ohne Formatierung (für Meta-Beschreibungen) */
export const plain = (s = "") => String(s).replace(/\*\*?|\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();

/** Datum 2026-11-02 → 02.11.2026 */
export const dateDe = (iso = "") => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso); return m ? `${m[3]}.${m[2]}.${m[1]}` : iso; };

/** Preis 450000 → 450.000 € */
export const euro = (v) => {
  if (v === "" || v == null) return "";
  const n = Number(String(v).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n.toLocaleString("de-DE", { maximumFractionDigits: 2 }) + " €" : String(v);
};
