// Wiederverwendbare Bausteine: Header, Footer, CTA, Seitenkopf, Platzhalter …
import { site, icons, services } from "./content.mjs";

export const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const icon = (d, { size = 24, stroke = "currentColor", width = 1.6, cls = "" } = {}) =>
  `<svg aria-hidden="true"${cls ? ` class="${cls}"` : ""} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

export const check = (txt) => `<li>${icon(icons.check, { size: 18, stroke: "#8A6A33", width: 2.2 })}<span>${txt}</span></li>`;

const sealMini = `<svg class="brand__seal" aria-hidden="true" viewBox="0 0 100 100"><rect width="100" height="100" rx="4" fill="#5E6568"/><path d="M24 18V76H82" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="miter"/><g stroke="#5E6568" stroke-width="1.4"><line x1="24" y1="28" x2="27.5" y2="28"/><line x1="24" y1="38" x2="27.5" y2="38"/><line x1="24" y1="48" x2="27.5" y2="48"/><line x1="24" y1="58" x2="27.5" y2="58"/><line x1="36" y1="72.5" x2="36" y2="76"/><line x1="48" y1="72.5" x2="48" y2="76"/><line x1="60" y1="72.5" x2="60" y2="76"/><line x1="72" y1="72.5" x2="72" y2="76"/></g><text x="57" y="60" text-anchor="middle" font-family="Jost, system-ui, sans-serif" font-weight="500" font-size="24" letter-spacing="3" fill="#C7A56A">HH</text></svg>`;

const footerMark = `<svg class="footer-mark" role="img" aria-label="Bauwerk HH" viewBox="0 0 100 100"><rect width="100" height="100" rx="4" fill="#FFFFFF"/><path d="M24 18V76H82" fill="none" stroke="#5E6568" stroke-width="7" stroke-linejoin="miter"/><text x="57" y="60" text-anchor="middle" font-family="Jost, system-ui, sans-serif" font-weight="600" font-size="24" letter-spacing="3" fill="#8A6A33">HH</text></svg>`;

export const sealFull = (color = "#FFFFFF", accent = "#C7A56A", size = 96, id = "seal", cls = "") => `<svg role="img" aria-label="Bauwerk HH Siegel"${cls ? ` class="${cls}"` : ""} width="${size}" height="${size}" viewBox="0 0 120 120">
<defs><path id="${id}Top" d="M21 60A39 39 0 1 1 99 60"/><path id="${id}Bot" d="M13 60A47 47 0 0 0 107 60"/></defs>
<circle cx="60" cy="60" r="56" fill="none" stroke="${color}" stroke-width="1.6"/><circle cx="60" cy="60" r="52" fill="none" stroke="${color}" stroke-width="0.6"/><circle cx="60" cy="60" r="34" fill="none" stroke="${color}" stroke-width="0.8"/>
<text font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="11" letter-spacing="2.5" fill="${color}"><textPath href="#${id}Top" startOffset="50%" text-anchor="middle">BAUWERK HH</textPath></text>
<text font-family="Archivo, system-ui, sans-serif" font-weight="600" font-size="6.5" letter-spacing="1.6" fill="${accent}"><textPath href="#${id}Bot" startOffset="50%" text-anchor="middle">KERNSANIERUNG · NEUBAU</textPath></text>
<circle cx="17" cy="64" r="1.6" fill="${accent}"/><circle cx="103" cy="64" r="1.6" fill="${accent}"/>
<text x="60" y="71" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="32" fill="${color}">B</text>
<line x1="50" y1="78" x2="70" y2="78" stroke="${accent}" stroke-width="1"/></svg>`;

// ---------------------------------------------------------------------------
const nav = [
  ["leistung", "Leistungen", "/leistungen"],
  ["referenzen", "Referenzen", "/referenzen"],
  ["ablauf", "Ablauf", "/ablauf"],
  ["ueber", "Über uns", "/ueber-uns"],
  ["ratgeber", "Ratgeber", "/ratgeber"],
  ["kontakt", "Kontakt", "/kontakt"]
];

export function header(active = "") {
  const cur = (k) => (k === active ? ' class="is-active" aria-current="page"' : "");
  const desk = nav.map(([k, label, href]) => {
    if (k === "leistung") {
      return `<div class="nav-drop"><a href="${href}"${cur(k)}>${label}</a><div class="nav-drop__menu">${services.map((s) => `<a href="/leistungen/${s.slug}">${s.title}</a>`).join("")}<a class="nav-drop__all" href="/leistungen">Alle Leistungen im Überblick →</a></div></div>`;
    }
    return `<a href="${href}"${cur(k)}>${label}</a>`;
  }).join("");
  const mob = nav.map(([k, label, href]) => {
    const link = `<a class="mobile-menu__link" href="${href}">${label}</a>`;
    if (k === "leistung") return link + `<div class="mobile-menu__sub">${services.map((s) => `<a href="/leistungen/${s.slug}">${s.title}</a>`).join("")}</div>`;
    return link;
  }).join("") + `<a class="mobile-menu__link" href="/karriere">Karriere</a>`;

  return `<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
<div class="topbar"><div class="container"><span>[Meisterbetrieb – nur mit Nachweis] · Hamburg &amp; Umland · Rückmeldung in ${site.responseShort}</span><span class="topbar__links"><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="/karriere">Karriere</a></span></div></div>
<header class="site-header">
  <div class="container site-header__bar">
    <a class="brand" href="/" aria-label="DMC Immobilien – zur Startseite"><img class="brand__logo" src="/img/dmc/dmc-logo-grau.svg" alt="DMC Immobilien" width="247" height="186"></a>
    <nav class="main-nav" aria-label="Hauptnavigation">${desk}</nav>
    <div class="header-actions">
      <a class="header-phone" href="${site.phoneHref}">${icon(icons.phone, { size: 18, width: 1.8 })}${site.phoneDisplay}</a>
      <a class="btn btn--primary btn--sm" href="/kontakt">Kostenlos anfragen</a>
    </div>
    <div class="header-mobile">
      <a class="icon-btn" href="${site.phoneHref}" aria-label="Anrufen">${icon(icons.phone, { size: 20, width: 1.8 })}</a>
      <button class="icon-btn icon-btn--solid" type="button" data-menu-toggle aria-controls="mobile-menu" aria-expanded="false" aria-label="Menü öffnen">${icon("M4 7h16M4 12h16M4 17h16", { size: 22, width: 2 })}</button>
    </div>
  </div>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobiles Menü">
    ${mob}
    <div class="mobile-menu__actions">
      <a class="btn btn--outline" href="${site.phoneHref}">Anrufen: ${site.phoneDisplay}</a>
      <a class="btn btn--primary" href="/kontakt">Kostenlos anfragen</a>
    </div>
  </nav>
</header>`;
}

export function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col footer-col--wide">
        <div class="footer-brand"><img class="footer-logo" src="/img/dmc/dmc-logo-weiss.svg" alt="DMC Immobilien" width="247" height="186" loading="lazy"></div>
        <span>Kernsanierung und Neubau aus einer Hand – für Hamburg und das Umland.</span>
        <span>${site.street}<br>${site.zip} ${site.city}</span>
        <span><a href="${site.phoneHref}"><strong>${site.phoneDisplay}</strong></a><br><a href="${site.emailHref}">${site.email}</a></span>
        <span style="font-size:14px">${site.hours}</span>
      </div>
      <nav class="footer-col" aria-label="Leistungen">
        <h2>Leistungen</h2>
        <div class="footer-links">${services.map((s) => `<a href="/leistungen/${s.slug}">${s.title}</a>`).join("")}</div>
      </nav>
      <nav class="footer-col" aria-label="Unternehmen">
        <h2>Unternehmen</h2>
        <div class="footer-links footer-links--1">
          <a href="/ueber-uns">Über uns</a><a href="/referenzen">Referenzen</a><a href="/ablauf">Ablauf</a><a href="/ratgeber">Ratgeber</a><a href="/karriere">Karriere</a><a href="/einsatzgebiet">Einsatzgebiet</a><a href="/kontakt">Kontakt</a>
        </div>
      </nav>
      <div class="footer-col footer-col--wide">
        <h2>Vertrauen</h2>
        <span class="footer-rating">★ ${site.rating}</span>
        <span style="font-size:14px">${site.reviews} Google-Bewertungen</span>
        <div class="badges"><span class="badge-box">HWK</span><span class="badge-box">Innung</span></div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${site.legal}</span>
      <nav aria-label="Rechtliches"><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><button type="button" class="link-btn" data-cookie-open>Cookie-Einstellungen</button></nav>
    </div>
  </div>
</footer>
<nav class="action-bar" aria-label="Schnellkontakt">
  <a href="${site.phoneHref}">${icon(icons.phone, { size: 19, width: 1.8 })}Anrufen</a>
  <a href="${site.whatsapp}" target="_blank" rel="noopener">${icon(icons.whatsapp, { size: 19, width: 1.8 })}WhatsApp</a>
  <a href="/kontakt">${icon("M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z M14 3v5h5 M9 13h6 M9 17h4", { size: 19, width: 1.8 })}Anfragen</a>
</nav>
<div class="cookie" id="cookie" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
  <strong id="cookie-title">Ihre Privatsphäre</strong>
  <p>Wir verwenden notwendige Cookies für den Betrieb der Website. Mit Ihrer Zustimmung nutzen wir zusätzlich eine datenschutzfreundliche Statistik, um die Seite zu verbessern. <a href="/datenschutz">Mehr erfahren</a></p>
  <div class="cookie__settings">
    <label><input type="checkbox" checked disabled> <span><strong style="font-family:var(--sans);font-size:14px">Notwendig</strong> – für den Betrieb der Seite erforderlich.</span></label>
    <label><input type="checkbox" id="c-stat"> <span><strong style="font-family:var(--sans);font-size:14px">Statistik</strong> – anonyme Nutzungsstatistik [Tool prüfen].</span></label>
  </div>
  <div class="cookie__btns"><button type="button" class="btn btn--outline" data-cookie="deny">Ablehnen</button><button type="button" class="btn btn--primary" data-cookie="accept">Alle akzeptieren</button></div>
  <button type="button" class="link-btn" style="color:var(--blau);font-size:14px;align-self:center" data-cookie="settings">Einstellungen</button>
</div>`;
}

export function ctaBand(heading = "Ihr Projekt in Hamburg?", lead = `Erzählen Sie uns kurz, was Sie vorhaben. Wir melden uns innerhalb von ${site.response} – kostenlos und unverbindlich.`, href = "/kontakt") {
  return `<section class="cta-band"><div class="container">
  <span class="cta-band__line" aria-hidden="true"></span>
  <h2>${heading}</h2>
  <p>${lead}</p>
  <div class="cta-band__btns">
    <a class="btn btn--light" href="${href}">Projekt anfragen</a>
    <a class="btn btn--outline-gold" href="${site.phoneHref}">${site.phoneDisplay}</a>
    <a class="btn btn--outline-gold" href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
  </div>
</div></section>`;
}

export function breadcrumb(items) {
  // items: [[label, href?], ...]
  const all = [["Start", "/"], ...items];
  return `<nav class="breadcrumb" aria-label="Brotkrumen"><ol>${all.map(([l, h], i) => `<li>${h && i < all.length - 1 ? `<a href="${h}">${l}</a>` : `<span aria-current="page">${l}</span>`}</li>`).join("")}</ol></nav>`;
}

export function pageHead({ crumbs, eyebrow, heading, lead }) {
  return `<section class="page-head"><div class="container">
  ${breadcrumb(crumbs)}
  <span class="eyebrow">${eyebrow}</span>
  <h1>${heading}</h1>
  ${lead ? `<p class="lead">${lead}</p>` : ""}
</div></section>`;
}

// DMC-Bilder (von dmc-realestate.de) – Zuordnung über die Bildbeschreibung
const IMG = "/img/dmc/";
const RULES = [
  [/karte/i, null],
  [/geschäftsführung|inhaber/i, "inhaber"],
  [/firmenfahrzeug|großes teamfoto/i, "team-gespraech"],
  [/echtes team/i, "besprechung"],
  [/teamfoto/i, "team-gespraech"],
  [/planungsgespräch|beratung|erstgespräch/i, "beratung"],
  [/azubi|ausbildung|förderung|kosten/i, "planung"],
  [/rohbau|stuck|dielen|vorher|trennwand|detail 1/i, "altbau-vorher"],
  [/elektro|unterverteilung|baustelle|heizkörper|leitungen/i, "planung-helm"],
  [/küche/i, "kueche"],
  [/schlafzimmer/i, "schlafen"],
  [/flur|treppe/i, "treppe"],
  [/wohnzimmer|altbauwohnung|jugendstil|wohnung|altbau/i, "wohnen"],
  [/detail bad|dusch|gäste/i, "bad-dusche"],
  [/bad|wc/i, "bad-holz"],
  [/neubau/i, "neubau"],
  [/einfamilien/i, "villa"],
  [/reihenhaus|haus/i, "haus-weiss"],
  [/fassade|dach|fenster|energ|dämm/i, "haus-weiss"]
];
const POOL = {
  objekt: ["villen", "wohnen", "haus-weiss", "kueche", "villa", "neubau", "bad-holz", "schlafen", "neubau-luft", "treppe"],
  portrait: ["portrait-1", "portrait-2", "besprechung", "beratung", "team-gespraech", "inhaber"]
};
const POS = { "portrait-1": "62% 25%", "portrait-2": "58% 25%", inhaber: "50% 30%", "team-gespraech": "50% 35%" };
export function imageFor(label = "", art = "objekt") {
  let key;
  if (art !== "portrait") { const r = RULES.find(([re]) => re.test(label)); if (r) key = r[1]; }
  if (key === null) return null;
  if (!key) { let h = 0; for (const c of label) h = (h * 31 + c.charCodeAt(0)) >>> 0; const pool = POOL[art] || POOL.objekt; key = pool[h % pool.length]; }
  return { key, src: IMG + key + ".jpg", pos: POS[key] || "50% 50%" };
}

export function ph(label, { h = "", tone = "", attrs = "", art = "objekt", img = "" } = {}) {
  const pic = img ? { src: IMG + img + ".jpg", pos: POS[img] || "50% 50%" } : imageFor(label, art);
  const style = h ? ` style="--h:${h}"` : "";
  if (pic) return `<div class="ph ph--photo"${style}${attrs}><img src="${pic.src}" alt="${esc(label)}" loading="lazy" decoding="async" style="object-position:${pic.pos}"></div>`;
  const cls = tone ? ` ph--${tone}` : "";
  return `<div class="ph${cls}"${style}${attrs}><span class="ph__label">${icon(icons.camera, { size: 16 })}<span>${label}</span></span></div>`;
}

export function beforeAfter({ caption = "", small = false, h = "", after = "wohnen", before = "altbau-vorher" } = {}) {
  return `<div class="ba${small ? " ba--sm" : ""}"${h ? ` style="--h:${h}"` : ""}>
  <div class="ba__img ba__img--before"><img src="${IMG}${before}.jpg" alt="Vorher" loading="lazy" decoding="async"><span class="ba__tag">Vorher</span></div>
  <div class="ba__img ba__img--after"><img src="${IMG}${after}.jpg" alt="Nachher" loading="lazy" decoding="async"><span class="ba__tag">Nachher</span></div>
  <span class="ba__line" aria-hidden="true"></span><span class="ba__handle" aria-hidden="true">‹ ›</span>
  ${caption ? `<span class="ba__caption">${caption}</span>` : ""}
  <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Vorher-Nachher-Vergleich verschieben">
</div>`;
}

export function faq(items) {
  return `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;
}

export function faqSchema(items) {
  const strip = (s) => s.replace(/<[^>]+>/g, "");
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: strip(q), acceptedAnswer: { "@type": "Answer", text: strip(a) } }))
  };
}

export function tile(s, { compact = false } = {}) {
  return `<a class="tile" href="/leistungen/${s.slug}">
  ${icon(s.d, { size: 28, stroke: "#5E6568" })}
  <span class="tile__title">${s.title}</span>
  <span class="tile__text">${s.teaser}</span>
  <span class="tile__more">Mehr erfahren →</span>
</a>`;
}

const afterFor = (p) => ({ Bad: p.slug.startsWith("dusch") ? "bad-dusche" : "bad-holz", Energetisch: "haus-weiss", Fenster: "villa", Maler: "treppe", Boden: "wohnen", Altbau: "schlafen" }[p.cat] || (p.slug.startsWith("einfamilien") ? "villa" : "wohnen"));
export { afterFor };

export function refCard(p, { bordered = false } = {}) {
  return `<a class="ref-card${bordered ? " ref-card--bordered" : ""}" href="/referenzen/${p.slug}">
  ${beforeAfter({ small: true, after: afterFor(p) })}
  <span class="ref-card__body"><span class="ref-card__tag">${p.cat}</span><span class="ref-card__title">${p.title}</span><span class="ref-card__meta">${p.meta}</span></span>
</a>`;
}

export function quoteCard(meta) {
  return `<figure class="quote-card"><span class="stars" aria-label="5 von 5 Sternen">★★★★★</span><blockquote>„[Echtes Kundenzitat mit Einwilligung einsetzen]“</blockquote><figcaption><strong>[Vorname N.]</strong> · ${meta}</figcaption></figure>`;
}

export const lightbox = `<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Bildansicht"><button class="lightbox__close" type="button" aria-label="Schließen">×</button><div class="lightbox__inner">${ph("Foto", { h: "min(70vh, 620px)" })}<p class="lightbox__cap"></p></div></div>`;

// Statische Karte Hamburg (schematisch, kein Maps-Embed)
export function hamburgMap() {
  const d = [
    ["Altona", "M70 150 L150 120 L190 170 L170 230 L90 240 L50 200 Z", 120, 185, false],
    ["Eimsbüttel", "M150 120 L170 50 L240 40 L260 110 L230 160 L190 170 Z", 205, 105, true],
    ["Hamburg-Nord", "M240 40 L330 30 L360 110 L300 150 L260 110 Z", 300, 85, true],
    ["Wandsbek", "M330 30 L450 40 L470 150 L400 190 L360 110 Z", 410, 105, true],
    ["Hamburg-Mitte", "M190 170 L230 160 L260 110 L300 150 L360 110 L400 190 L360 250 L250 270 L170 230 Z", 285, 210, false],
    ["Bergedorf", "M400 190 L470 150 L540 220 L500 300 L400 290 L360 250 Z", 455, 240, false],
    ["Alstertal", "M292 33 L330 30 L450 40 L438 -12 L318 -16 Z", 375, 14, false]
  ];
  return `<div class="map-card"><svg viewBox="0 0 580 400" role="img" aria-label="Schematische Karte der Hamburger Bezirke mit Kerngebieten">
  <rect x="0" y="0" width="580" height="400" fill="#ECEEEF"/>
  <g transform="translate(0,46)"><path d="M0 268 C 90 250, 150 262, 230 262 S 380 238, 580 268 L580 286 C 420 262, 330 286, 230 282 S 80 270, 0 288 Z" fill="#D3D7D8" opacity=".9"/>
  ${d.map(([n, p, x, y, core]) => `<path d="${p}" fill="${core ? "#C7A56A" : "#FFFFFF"}" fill-opacity="${core ? ".55" : "1"}" stroke="#5E6568" stroke-width="1.2"/><text x="${x}" y="${y}" text-anchor="middle" font-family="Archivo, sans-serif" font-size="12" font-weight="600" fill="#2F3437">${n}</text>`).join("")}
  </g><g transform="translate(0,46)"><circle cx="205" cy="128" r="6" fill="#5E6568" stroke="#fff" stroke-width="2"/><text x="205" y="148" text-anchor="middle" font-family="Archivo, sans-serif" font-size="10" fill="#5E6568">[Firmensitz]</text></g>
  <text x="290" y="20" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11" fill="#565C5F">Umland bis ca. [XX] km</text>
</svg><div class="map-card__legend"><span><i style="background:#E2CFA9"></i>Kerngebiet</span><span><i style="background:#fff;border:1px solid #5E6568"></i>Einsatzgebiet</span><span><i style="background:#5E6568;border-radius:99px"></i>Firmensitz</span></div></div>`;
}

// ---------------------------------------------------------------------------
export function layout({ title, description, path = "/", active = "", body, schema = [], noindex = false }) {
  const full = path === "/" ? `${site.name} – Sanierung & Handwerk in Hamburg` : `${title} | ${site.name}`;
  const canonical = site.url + (path === "/" ? "" : path);
  const org = {
    "@context": "https://schema.org", "@type": "HomeAndConstructionBusiness", name: site.name, url: site.url,
    telephone: site.phoneDisplay, email: site.email, areaServed: "Hamburg",
    address: { "@type": "PostalAddress", streetAddress: site.street, postalCode: site.zip, addressLocality: site.city, addressCountry: "DE" }
  };
  const ld = [org, ...schema].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#2F3437">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/archivo-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/cormorant-garamond-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/style.css">
${ld}
</head>
<body>
${header(active)}
<main id="inhalt">
${body}
</main>
${footer()}
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}
