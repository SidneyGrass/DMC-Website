# DMC Immobilien – Website

Website nach dem Wireframe „Bauwerk HH Wireframe“ (Stand 02.11.2026) – mit Logo, Fotos und Grau-Farbwelt von DMC Immobilien (dmc-realestate.de).

- Logo und Fotos: `public/img/dmc/` (Zuordnung der Fotos über die Bildbeschreibung in `src/components.mjs` → `imageFor()`)
- Farben: `public/css/style.css` (`:root`), Grau abgeleitet vom DMC-Logo (#7D8486)

## Aufbau

- **Statisches HTML/CSS/JS** – keine Frameworks, keine externen Abhängigkeiten, Schriften lokal eingebunden (DSGVO).
- `src/content.mjs` – **alle Texte und Daten** (Leistungen, Referenzen, Ratgeber, Kontaktdaten). Hier Platzhalter in `[eckigen Klammern]` ersetzen.
- `src/components.mjs` – Bausteine: Header, Footer, Abschluss-CTA, Seitenkopf, Foto-Platzhalter, Vorher/Nachher-Slider, Karte.
- `build.mjs` – erzeugt alle Seiten nach `dist/`.
- `public/` – CSS, JavaScript, Schriften, Favicon.

## Seiten (43)

Startseite · Bauen & Sanieren: Leistungen (Übersicht + 10 Leistungsseiten), Neubau, Ablauf · Immobilien: Angebote (Filter Kaufen/Mieten), Exposé (Beispiel Sasel), Verkaufen/Bewerten (3-stufiges Formular), Hausverwaltung · Referenzen (+ 10 Projektseiten) · Über uns · Einsatzgebiet · Ratgeber (+ 6 Artikel) · Karriere · Kontakt (mehrstufiges Formular mit Verzweigung nach Anliegen) · Impressum · Datenschutz · 404 · Cookie-Banner

Navigation: Mega-Menü „Bauen & Sanieren“ / „Immobilien“ (Linklisten in `src/content.mjs` → `menu`, Footer → `footerLinks`).

## Lokal starten

```bash
npm run build      # erzeugt dist/
npm run dev        # baut und startet http://localhost:3000
```

## Deployment

Vercel baut automatisch bei jedem Push auf `main` (`vercel.json`: Build `node build.mjs`, Ausgabe `dist/`, saubere URLs).

## Wireframe-Abgleich

Der Ordner `wireframe/` enthält den Stand des Wireframes, nach dem die Website zuletzt angepasst wurde.
`tools/wireframe-sync.sh "<Pfad zum Wireframe-Ordner>"` übernimmt den aktuellen Stand und zeigt die geänderten Dateien.
Die Änderungen (`git diff --cached wireframe/`) werden dann in `src/` umgesetzt und zusammen mit dem neuen Wireframe-Stand committet und gepusht – Vercel veröffentlicht automatisch.

## Vor dem Livegang

1. Platzhalter in `src/content.mjs` (Telefon, Adresse, E-Mail, WhatsApp, Bewertungen, Zahlen) und alle `[prüfen]`-Angaben füllen.
2. Echte Vorher-Fotos und Projektfotos einsetzen (aktuell DMC-Website-Bilder; Vorher-Bild ist überall gleich). iStock-Lizenzen für die neue Seite prüfen.
3. Formular-Versand anbinden: `site.formEndpoint` auf einen Dienst setzen (z. B. Formspree) – aktuell Demo ohne Versand.
4. Impressum & Datenschutz per Generator erstellen und einfügen.
5. Eigene Domain in Vercel verbinden und `site.url` anpassen.
