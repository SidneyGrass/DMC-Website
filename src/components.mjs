// Wiederverwendbare Bausteine: Header, Footer, CTA, Seitenkopf, Platzhalter …
import { site, icons, menu, footerLinks } from "./content.mjs";

export const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const icon = (d, { size = 24, stroke = "currentColor", width = 1.6, cls = "" } = {}) =>
  `<svg aria-hidden="true"${cls ? ` class="${cls}"` : ""} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

const IMG = "/img/dmc/";
// key = DMC-Bild (z. B. "villa") oder Pfad eines hochgeladenen Fotos (/uploads/… bzw. /img/…)
export const imgSrc = (key = "") => (String(key).startsWith("/") ? key : IMG + key + ".jpg");

export const check = (txt) => `<li>${icon(icons.check, { size: 18, stroke: "#8A6A33", width: 2.2 })}<span>${txt}</span></li>`;

// ---------------------------------------------------------------------------
// Header mit Mega-Menü (Desktop) und Akkordeon-Menü (Tablet/Phone)
// active: "bauen" | "immobilien" | "referenzen" | "ueber" | "kontakt" | "ratgeber" | "karriere" | "einsatzgebiet"
// ---------------------------------------------------------------------------
const navLinks = [["referenzen", "Referenzen", "/referenzen"], ["ueber", "Über uns", "/ueber-uns"], ["kontakt", "Kontakt", "/kontakt"]];
const topLinks = [["ratgeber", "Ratgeber", "/ratgeber"], ["karriere", "Karriere", "/karriere"], ["einsatzgebiet", "Einsatzgebiet", "/einsatzgebiet"]];
const mobLinks = [["referenzen", "Referenzen", "/referenzen"], ["ueber", "Über uns", "/ueber-uns"], ["ratgeber", "Ratgeber", "/ratgeber"], ["karriere", "Karriere", "/karriere"], ["kontakt", "Kontakt", "/kontakt"]];
const megaKeys = ["bauen", "immobilien"];

function megaPanel(key) {
  const m = menu[key];
  const col = (title, list) => `<div class="mega__col"><strong class="mega__title">${title}</strong>${list.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join("")}</div>`;
  return `<div class="mega" id="mega-${key}" hidden>
    <div class="container mega__inner">
      <button type="button" class="icon-btn mega__close" data-mega-close aria-label="Menü ${esc(m.label)} schließen">${icon(icons.close, { size: 18, width: 2 })}</button>
      <div class="mega__grid">
        ${col(m.col1Title, m.col1)}
        ${col(m.col2Title, m.col2)}
        <div class="mega__teaser">
          <img src="${IMG}${m.teaserImg}.jpg" alt="${esc(m.teaserAlt)}" width="400" height="150" loading="lazy" decoding="async">
          <span class="mega__teaser-title">${m.teaserTitle}</span>
          <span class="mega__teaser-text">${m.teaserText}</span>
          <a class="link-arrow" href="${m.extra[1]}">${m.extra[0]}</a>
          <a class="btn btn--primary" href="${m.cta[1]}">${m.cta[0]}</a>
        </div>
      </div>
    </div>
  </div>`;
}

export function header(active = "") {
  const cur = (k) => (k === active ? ' aria-current="page"' : "");
  const isOn = (k) => (k === active ? " is-active" : "");
  const chevron = icon(icons.chevronDown, { size: 14, width: 2.2, cls: "chevron" });
  const desk = megaKeys.map((k) => `<button type="button" class="main-nav__btn${isOn(k)}" aria-expanded="false" aria-controls="mega-${k}" data-mega-toggle>${esc(menu[k].label)}${chevron}</button>`).join("")
    + navLinks.map(([k, label, href]) => `<a class="main-nav__link${isOn(k)}" href="${href}"${cur(k)}>${label}</a>`).join("");
  const acc = (k) => {
    const m = menu[k];
    const list = k === "bauen" ? [...m.col1, ...m.col2, m.extra] : [...m.col1, ...m.col2];
    return `<button type="button" class="mobile-menu__acc${isOn(k)}" aria-expanded="false" aria-controls="m-${k}" data-acc>${esc(m.label)}${icon(icons.chevronDown, { size: 20, width: 2.2, stroke: "#8A6A33", cls: "chevron" })}</button>
    <div class="mobile-menu__sub" id="m-${k}" hidden>${list.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join("")}</div>`;
  };
  const mob = megaKeys.map(acc).join("") + mobLinks.map(([k, label, href]) => `<a class="mobile-menu__link" href="${href}"${cur(k)}>${label}</a>`).join("");

  return `<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
<div class="topbar"><div class="container"><span>Eigene Handwerker · fester Ansprechpartner · Hamburg &amp; Umland</span><nav class="topbar__links" aria-label="Servicenavigation">${topLinks.map(([k, l, h]) => `<a href="${h}"${cur(k)}>${l}</a>`).join("")}<a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></nav></div></div>
<header class="site-header">
  <div class="container site-header__bar">
    <a class="brand" href="/" aria-label="DMC Immobilien – zur Startseite"><img class="brand__logo" src="/img/dmc/dmc-logo-grau.svg" alt="DMC Immobilien" width="247" height="186"></a>
    <nav class="main-nav" aria-label="Hauptnavigation">${desk}</nav>
    <div class="header-actions">
      <a class="header-phone" href="${site.phoneHref}">${icon(icons.phone, { size: 18, width: 1.8 })}${site.phoneDisplay}</a>
      <a class="btn btn--primary btn--sm" href="/kontakt">Anfragen</a>
    </div>
    <div class="header-mobile">
      <a class="icon-btn" href="${site.phoneHref}" aria-label="Anrufen">${icon(icons.phone, { size: 20, width: 1.8 })}</a>
      <button class="icon-btn icon-btn--solid" type="button" data-menu-toggle aria-controls="mobile-menu" aria-expanded="false" aria-label="Menü öffnen">${icon(icons.menu, { size: 22, width: 2 })}</button>
    </div>
  </div>
  ${megaKeys.map(megaPanel).join("\n  ")}
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
  const col = (title, aria, list) => `<nav class="footer-col" aria-label="${aria}"><h2>${title}</h2><div class="footer-links">${list.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join("")}</div></nav>`;
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col footer-col--wide">
        <div class="footer-brand"><img class="footer-logo" src="/img/dmc/dmc-logo-weiss.svg" alt="DMC Immobilien" width="247" height="186" loading="lazy"></div>
        <span>Bauen, sanieren und Immobilien – aus einer Hand in Hamburg.</span>
        <span>${site.legal}<br>${site.street}<br>${site.zip} ${site.city}</span>
        <span class="footer-contact"><a href="${site.phoneHref}"><strong>${site.phoneDisplay}</strong></a><a href="${site.emailHref}">${site.email}</a><a href="${site.instagram}" target="_blank" rel="noopener">${icon(icons.instagram, { size: 18, width: 1.8 })}Instagram @dmcimmobilien</a></span>
        <span class="footer-rating"><strong>★ ${site.rating}</strong><span>aus ${site.reviews} Google-Bewertungen</span></span>
        <span style="font-size:14px">${site.hours}</span>
      </div>
      ${col("Bauen &amp; Sanieren", "Bauen und Sanieren", footerLinks.bauen)}
      ${col("Immobilien", "Immobilien", footerLinks.immobilien)}
      ${col("Unternehmen", "Unternehmen", footerLinks.unternehmen)}
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${site.legal} · ${site.hrb}</span>
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
  <button type="button" class="link-btn" style="color:var(--blau);font-size:14px;align-self:center;min-height:44px" data-cookie="settings">Einstellungen</button>
</div>`;
}

// Abschluss-CTA (weißer Text auf #5E6568, Telefon/WhatsApp mobil über die Aktionsleiste)
export function ctaBand(heading = "Ihr Projekt in Hamburg?", lead = `Erzählen Sie uns kurz, was Sie vorhaben. Wir melden uns innerhalb von ${site.response} – kostenlos und unverbindlich.`, href = "/kontakt", { label = "Projekt anfragen", buttons = "" } = {}) {
  return `<section class="cta-band"><div class="container">
  <span class="cta-band__line" aria-hidden="true"></span>
  <h2>${heading}</h2>
  <p>${lead}</p>
  <div class="cta-band__btns">
    <a class="btn btn--light" href="${href}">${label}</a>
    ${buttons || `<a class="btn btn--outline-light btn--hide-phone" href="${site.phoneHref}">${site.phoneDisplay}</a>
    <a class="btn btn--outline-light btn--hide-phone" href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`}
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

// img = DMC-Bild oder hochgeladenes Foto (/uploads/…) – hat Vorrang vor der automatischen Zuordnung
export function ph(label, { h = "", tone = "", attrs = "", art = "objekt", img = "" } = {}) {
  const pic = img ? { src: imgSrc(img), pos: POS[img] || "50% 50%" } : imageFor(label, art);
  const style = h ? ` style="--h:${h}"` : "";
  if (pic) return `<div class="ph ph--photo"${style}${attrs}><img src="${pic.src}" alt="${esc(label)}" loading="lazy" decoding="async" style="object-position:${pic.pos}"></div>`;
  const cls = tone ? ` ph--${tone}` : "";
  return `<div class="ph${cls}"${style}${attrs}><span class="ph__label">${icon(icons.camera, { size: 16 })}<span>${label}</span></span></div>`;
}

export function beforeAfter({ caption = "", small = false, h = "", after = "wohnen", before = "altbau-vorher" } = {}) {
  return `<div class="ba${small ? " ba--sm" : ""}"${h ? ` style="--h:${h}"` : ""}>
  <div class="ba__img ba__img--before"><img src="${imgSrc(before)}" alt="Vorher" loading="lazy" decoding="async"><span class="ba__tag">Vorher</span></div>
  <div class="ba__img ba__img--after"><img src="${imgSrc(after)}" alt="Nachher" loading="lazy" decoding="async"><span class="ba__tag">Nachher</span></div>
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

const afterFor = (p) => p.nachher || ({ Bad: p.slug.startsWith("dusch") ? "bad-dusche" : "bad-holz", Energetisch: "haus-weiss", Fenster: "villa", Maler: "treppe", Boden: "wohnen", Altbau: "schlafen" }[p.cat] || (p.slug.startsWith("einfamilien") ? "villa" : "wohnen"));
export { afterFor };

export function refCard(p, { bordered = false } = {}) {
  return `<a class="ref-card${bordered ? " ref-card--bordered" : ""}" href="/referenzen/${p.slug}">
  ${p.foto ? ph(p.title, { img: p.foto, h: "240px" }) : beforeAfter({ small: true, after: afterFor(p), ...(p.vorher ? { before: p.vorher } : {}) })}
  <span class="ref-card__body"><span class="ref-card__tag">${esc(p.cat)}</span><span class="ref-card__title">${esc(p.title)}</span><span class="ref-card__meta">${esc(p.meta)}</span></span>
</a>`;
}

export function quoteCard(meta) {
  if (meta && typeof meta === "object") {
    const n = Math.max(1, Math.min(5, Number(meta.sterne) || 5));
    return `<figure class="quote-card"><span class="stars" aria-label="${n} von 5 Sternen">${"★".repeat(n)}${"☆".repeat(5 - n)}</span><blockquote>„${esc(meta.text)}“</blockquote><figcaption><strong>${esc(meta.title)}</strong>${meta.meta ? ` · ${esc(meta.meta)}` : ""}</figcaption></figure>`;
  }
  return `<figure class="quote-card"><span class="stars" aria-label="5 von 5 Sternen">★★★★★</span><blockquote>„[Echtes Kundenzitat mit Einwilligung einsetzen]“</blockquote><figcaption><strong>[Vorname N.]</strong> · ${meta}</figcaption></figure>`;
}

export const lightbox = `<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Bildansicht"><button class="lightbox__close" type="button" aria-label="Schließen">×</button><div class="lightbox__inner">${ph("Foto", { h: "min(70vh, 620px)" })}<p class="lightbox__cap"></p></div></div>`;

// Statische Karte Hamburg (schematisch, kein Maps-Embed) – alle Bezirke sind Einsatzgebiet,
// Elbvororte Ottensen–Blankenese einzeln, Firmensitz im Alstertal.
export function hamburgMap() {
  const areas = [
    "M18 252 L92 238 L102 304 L22 312 Z", "M92 238 L146 230 L156 300 L102 304 Z", "M92 190 L190 178 L196 226 L146 230 L92 238 Z",
    "M146 230 L196 226 L204 296 L156 300 Z", "M196 226 L246 220 L254 290 L204 296 Z", "M190 178 L262 166 L272 214 L246 220 L196 226 Z",
    "M180 100 L276 86 L292 160 L262 166 L190 178 Z", "M262 166 L362 150 L420 200 L402 272 L254 290 L246 220 L272 214 Z",
    "M276 86 L380 72 L396 140 L362 150 L292 160 Z", "M330 22 L472 16 L484 72 L380 72 L334 64 Z",
    "M380 72 L484 72 L542 150 L472 210 L420 200 L362 150 L396 140 Z", "M472 210 L542 150 L622 230 L584 296 L462 290 L402 272 L420 200 Z"
  ];
  const small = [[58, 280, "Blankenese"], [126, 268, "Nien-"], [126, 280, "stedten"], [142, 212, "Groß Flottbek"], [180, 262, "Oth-"], [180, 274, "marschen"], [226, 262, "Ottensen"]];
  const big = [[230, 202, "Altona"], [234, 136, "Eimsbüttel"], [334, 118, "Hamburg-Nord"], [330, 232, "Hamburg-Mitte"], [410, 40, "Alstertal"], [458, 140, "Wandsbek"], [520, 250, "Bergedorf"]];
  return `<div class="map-card"><svg viewBox="0 0 640 380" role="img" aria-label="Schematische Karte von Hamburg: alle dargestellten Bezirke einschließlich der Elbvororte von Ottensen bis Blankenese sind Einsatzgebiet, Firmensitz im Alstertal" font-family="Archivo, system-ui, sans-serif">
  <rect x="0" y="0" width="640" height="380" fill="#ECEEEF"/>
  <path d="M0 318 C 80 300, 150 312, 240 304 S 420 286, 640 300 L640 326 C 470 312, 380 330, 250 330 S 90 330, 0 344 Z" fill="#D3D7D8"/>
  <text x="560" y="322" font-size="11" font-style="italic" fill="#565C5F">Elbe</text>
  ${areas.map((d) => `<path d="${d}" fill="#C7A56A" fill-opacity="0.6" stroke="#5E6568" stroke-width="1.2"/>`).join("")}
  <g font-size="11" font-weight="700" fill="#2F3437" text-anchor="middle">${small.map(([x, y, t]) => `<text x="${x}" y="${y}">${t}</text>`).join("")}</g>
  <g font-size="15" font-weight="700" fill="#2F3437" text-anchor="middle">${big.map(([x, y, t]) => `<text x="${x}" y="${y}">${t}</text>`).join("")}</g>
  <circle cx="412" cy="56" r="7" fill="#2F3437" stroke="#FFFFFF" stroke-width="2.5"/>
  <line x1="419" y1="56" x2="500" y2="56" stroke="#2F3437" stroke-width="1"/>
  <rect x="500" y="44" width="128" height="24" rx="2" fill="#2F3437"/>
  <text x="564" y="60" font-size="11" font-weight="600" fill="#FFFFFF" text-anchor="middle">Firmensitz DMC</text>
  <path d="M22 350 L22 358 L250 358 L250 350" fill="none" stroke="#8A6A33" stroke-width="1.2"/>
  <text x="136" y="373" font-size="11" font-weight="600" fill="#6E5428" text-anchor="middle">Elbvororte: Ottensen bis Blankenese</text>
</svg><div class="map-card__legend"><span><i class="map-card__key"></i>Unser Einsatzgebiet – inklusive Elbvororte (Ottensen bis Blankenese) und Alstertal</span><span><i class="map-card__key map-card__key--pin"></i>Firmensitz: ${site.street}, ${site.zip} ${site.city}</span></div></div>`;
}

// ---------------------------------------------------------------------------
export function layout({ title, description, path = "/", active = "", body, schema = [], noindex = false }) {
  const full = path === "/" ? `${site.name} – Bauen, Sanieren & Immobilien in Hamburg` : `${title} | ${site.name}`;
  const canonical = site.url + (path === "/" ? "" : path);
  const org = {
    "@context": "https://schema.org", "@type": ["HomeAndConstructionBusiness", "RealEstateAgent"], name: site.name, url: site.url,
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
