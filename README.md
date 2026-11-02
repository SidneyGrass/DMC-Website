# DMC Immobilien – Website

Website nach dem Wireframe „Bauwerk HH Wireframe“ (Stand 02.11.2026) – mit Logo, Fotos und Grau-Farbwelt von DMC Immobilien (dmc-realestate.de).

- Logo und Fotos: `public/img/dmc/` (Zuordnung der Fotos über die Bildbeschreibung in `src/components.mjs` → `imageFor()`)
- Farben: `public/css/style.css` (`:root`), Grau abgeleitet vom DMC-Logo (#7D8486)

## Aufbau

- **Statisches HTML/CSS/JS** – keine Frameworks, keine externen Abhängigkeiten, Schriften lokal eingebunden (DSGVO).
- `src/content.mjs` – feste Texte und Daten (Leistungen, Neubau, Verkaufen, Hausverwaltung, Menü …). Hier Platzhalter in `[eckigen Klammern]` ersetzen.
- `content/` – **pflegbare Inhalte aus dem Redaktionssystem `/admin`** (Bauvorhaben, Immobilienangebote, Ratgeber, Referenzen, Stellen, Kundenstimmen, Firmendaten).
- `src/components.mjs` – Bausteine: Header, Footer, Abschluss-CTA, Seitenkopf, Foto-Platzhalter, Vorher/Nachher-Slider, Karte.
- `build.mjs` – erzeugt alle Seiten nach `dist/`.
- `public/` – CSS, JavaScript, Schriften, Favicon.

## Seiten (43)

Startseite · Bauen & Sanieren: Leistungen (Übersicht + 10 Leistungsseiten), Neubau, Ablauf · Immobilien: Angebote (Filter Kaufen/Mieten), Exposé-Seite je Angebot, Bauvorhaben (Übersicht + Detailseiten mit Bautagebuch), Verkaufen/Bewerten (3-stufiges Formular), Hausverwaltung · Referenzen (+ 10 Projektseiten) · Über uns · Einsatzgebiet · Ratgeber (+ 6 Artikel) · Karriere · Kontakt (mehrstufiges Formular mit Verzweigung nach Anliegen) · Impressum · Datenschutz · 404 · Cookie-Banner

Navigation: Mega-Menü „Bauen & Sanieren“ / „Immobilien“ (Linklisten in `src/content.mjs` → `menu`, Footer → `footerLinks`).

## Lokal starten

```bash
npm run build      # erzeugt dist/
npm run dev        # baut und startet http://localhost:3000
```

## Deployment

Vercel baut automatisch bei jedem Push auf `main` (`vercel.json`: Build `node build.mjs`, Ausgabe `dist/`, saubere URLs).

## Redaktionssystem (/admin)

Der Kunde pflegt Inhalte selbst unter **`/admin`** (Passwort-Login, kein GitHub-Konto nötig):

| Bereich | Dateien | Seiten |
| --- | --- | --- |
| Bauvorhaben (mit Baufortschritt & Bautagebuch) | `content/bauvorhaben/*.json` | `/bauvorhaben`, `/bauvorhaben/<slug>`, Abschnitt auf `/neubau` |
| Immobilienangebote (Kauf/Miete, Exposé-Seite, Energieausweis, PDF) | `content/immobilien/*.json` | `/immobilien`, `/immobilien/<slug>` |
| Ratgeber / Blog | `content/ratgeber/*.json` | `/ratgeber`, `/ratgeber/<slug>` |
| Referenzen (Vorher/Nachher, Galerie) | `content/referenzen/*.json` | `/referenzen`, `/referenzen/<slug>` |
| Kundenstimmen | `content/bewertungen/*.json` | Startseite |
| Stellenangebote | `content/jobs/*.json` | `/karriere` |
| Firmendaten | `content/einstellungen.json` | alle Seiten |

**So funktioniert es:** Beim Speichern schreibt `api/cms.js` (Vercel Function) die JSON-Datei und hochgeladene Fotos (`public/uploads/`) als **einen Commit** in das GitHub-Repo. Vercel baut daraufhin automatisch neu (ca. 1 Minute). Die Oberfläche zeigt den Veröffentlichungsstatus an.

- Oberfläche: `public/admin/` (`schema.js` = Felder je Bereich, `admin.js` = Editor)
- Ausgabe auf der Website: `build.mjs` (Abschnitt „Bauvorhaben & Immobilienangebote“) und `src/cms.mjs` (Laden + Textformatierung)
- Texte erlauben einfache Formatierung: Leerzeile = Absatz, `**fett**`, `*kursiv*`, `[Link](/kontakt)`, `- Liste`, `| Tabelle |`

### Einrichtung (einmalig, in Vercel → Settings → Environment Variables)

| Variable | Wert |
| --- | --- |
| `ADMIN_PASSWORD` | Passwort für `/admin` (lang, nur an den Kunden geben) |
| `GITHUB_TOKEN` | Fine-grained Personal Access Token, nur für `SidneyGrass/DMC-Website`: **Contents: Read and write**, **Commit statuses: Read-only** |
| `GITHUB_BRANCH` | optional – Standard ist der Branch des Deployments (Produktion = `main`) |

Danach einmal neu deployen. Ohne diese Variablen zeigt `/admin` einen Hinweis.

### Lokal testen

```bash
ADMIN_PASSWORD=test node tools/cms-dev.mjs   # → http://localhost:3000/admin
```
Lokal wird direkt in `content/` und `public/uploads/` gespeichert und neu gebaut (kein GitHub).

### Hinweis für Entwickler

Inhalte, die im Redaktionssystem gepflegt werden, **nicht mehr in `src/content.mjs`** ändern, sondern in den JSON-Dateien (bzw. im /admin). Vor eigenen Änderungen `git pull`, weil der Kunde ebenfalls Commits erzeugt.

## Wireframe-Abgleich

Der Ordner `wireframe/` enthält den Stand des Wireframes, nach dem die Website zuletzt angepasst wurde.
`tools/wireframe-sync.sh "<Pfad zum Wireframe-Ordner>"` übernimmt den aktuellen Stand und zeigt die geänderten Dateien.
Die Änderungen (`git diff --cached wireframe/`) werden dann in `src/` umgesetzt und zusammen mit dem neuen Wireframe-Stand committet und gepusht – Vercel veröffentlicht automatisch.

## Vor dem Livegang

1. Firmendaten im Redaktionssystem (`/admin` → Firmendaten) und Platzhalter in `src/content.mjs` und alle `[prüfen]`-Angaben füllen.
2. Echte Vorher-Fotos und Projektfotos einsetzen (aktuell DMC-Website-Bilder; Vorher-Bild ist überall gleich). iStock-Lizenzen für die neue Seite prüfen.
3. Formular-Versand anbinden: `site.formEndpoint` auf einen Dienst setzen (z. B. Formspree) – aktuell Demo ohne Versand.
4. Impressum & Datenschutz per Generator erstellen und einfügen.
5. Eigene Domain in Vercel verbinden und `site.url` anpassen.
