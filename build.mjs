// DMC Immobilien – statischer Seitengenerator
// Aufruf: node build.mjs  → erzeugt den Ordner dist/ (wird von Vercel ausgeliefert)
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  site, icons, services, serviceBySlug, projects, projectGallery, homeSteps, homeFaq, homeTopics, districts, areas,
  processSteps, promises, processFaq, team, values, benefits, jobs, articles, neubau, immobilien, bauvorhaben, bewertungen, valuation,
  management, contactTopics
} from "./src/content.mjs";
import { md, plain, dateDe, euro } from "./src/cms.mjs";
import {
  layout, icon, check, ctaBand, pageHead, breadcrumb, ph, beforeAfter, faq, faqSchema, tile, refCard,
  quoteCard, lightbox, hamburgMap, imageFor, afterFor, imgSrc, esc
} from "./src/components.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "dist");
const pages = [];
const page = (path, html) => pages.push([path, html]);

// Kleine Bausteine, die mehrere Seiten nutzen
const darkSteps = (list, { cls = "" } = {}) => `<ol class="steps${cls ? " " + cls : ""}">${list.map(([t, x], i) => `<li><span class="steps__n">${i + 1}</span><span class="steps__body"><strong>${t}</strong><span class="steps__text">${x}</span></span></li>`).join("")}</ol>`;
const lightSteps = (list) => `<ol class="steps steps--light steps--3">${list.map(([t, x], i) => `<li><span class="steps__n">${i + 1}</span><span class="steps__body"><strong>${t}</strong><span class="steps__text">${x}</span></span></li>`).join("")}</ol>`;
const topicChips = (list) => `<ul class="topic-chips">${list.map(([l, h]) => `<li><a href="${h}">${esc(l)}</a></li>`).join("")}</ul>`;
const plainImg = (key, alt, cls = "") => `<img${cls ? ` class="${cls}"` : ""} src="${imgSrc(key)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const single = (name, list, def, { cls = "" } = {}) => `<div class="option-row${cls ? " " + cls : ""}" data-choice="single" role="group"><input type="hidden" name="${name}">${list.map((l) => `<button type="button" class="option" data-value="${esc(l)}" aria-pressed="${l === def}">${l}</button>`).join("")}</div>`;
const choiceField = (label, name, list, def) => `<div class="field" role="group" aria-label="${esc(label)}"><span class="label">${label}</span>${single(name, list, def)}</div>`;

// Immobilien & Bauvorhaben (Redaktionssystem)
const REGIONS = ["Elbvororte", "Alstertal", "Hamburg (weitere)", "Umland", "Ausland"];
const OBJEKTARTEN = ["Haus", "Wohnung", "Grundstück", "Gewerbe"];
const priceNum = (o) => { const n = Number(String(o.preis || "").replace(/\./g, "").replace(",", ".")); return Number.isFinite(n) && n > 0 ? n : 0; };
const priceLabel = (o) => { const v = euro(o.preis); return v ? (o.vermarktung === "Miete" ? `${v} / Monat` : v) : (o.preisText || "Preis auf Anfrage"); };
const listingFacts = (o) => o.kurzinfo || [o.zimmer && `${o.zimmer} Zi.`, (o.wohnflaeche || o.nutzflaeche) && String(o.wohnflaeche || o.nutzflaeche), o.objektart].filter(Boolean).join(" · ");
const objektartFilter = (t = "") => (/haus/i.test(t) ? "Haus" : t);
const SOLD = ["Verkauft", "Vermietet"];
const listingHref = (o) => `/immobilien/${o.slug}`;
const listingCard = (o, { plain: pl = false } = {}) => `<a class="listing${pl ? " listing--plain" : ""}" href="${listingHref(o)}"${pl ? "" : ` data-kind="${esc(o.vermarktung)}" data-region="${esc(o.region || "")}" data-type="${esc(objektartFilter(o.objektart))}" data-price="${priceNum(o)}"`}>
      <span class="listing__media">${plainImg(o.titelbild || "villa", o.title)}<span class="listing__badge">${o.status && o.status !== "Verfügbar" ? esc(o.status) : esc(o.vermarktung)}</span></span>
      <span class="listing__body"><span class="ref-card__tag">${esc(pl ? [o.vermarktung, o.ort].filter(Boolean).join(" · ") : o.ort)}</span><span class="listing__title">${esc(o.title)}</span>${pl ? "" : `<span class="ref-card__meta">${esc(listingFacts(o))}</span>`}<span class="listing__price">${esc(priceLabel(o))}</span></span>
    </a>`;
const simpleForm = ({ id, subject, heading, button = "Anfrage senden", done = `Wir melden uns innerhalb von ${site.response} bei Ihnen.` }) => `
    <h2 class="h3">${heading}</h2>
    <form class="stack stack--sm" data-simple-form data-success="#${id}-done" novalidate action="${site.formEndpoint}" method="post">
      <input type="hidden" name="objekt" value="${esc(subject)}">
      <div class="field"><label for="${id}-name">Name *</label><input class="input" id="${id}-name" name="name" type="text" autocomplete="name" data-required data-error-msg="Bitte geben Sie Ihren Namen an."></div>
      <div class="field"><label for="${id}-mail">E-Mail *</label><input class="input" id="${id}-mail" name="email" type="email" autocomplete="email" data-required data-error-msg="Bitte geben Sie Ihre E-Mail-Adresse an."></div>
      <div class="field"><label for="${id}-tel">Telefon</label><input class="input" id="${id}-tel" name="telefon" type="tel" autocomplete="tel"></div>
      <div class="field"><label for="${id}-msg">Nachricht</label><textarea class="textarea" id="${id}-msg" name="nachricht" rows="3" style="min-height:96px"></textarea></div>
      <p class="form-note" style="font-size:13px">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zu. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
      <p class="form-error" data-error role="alert"></p>
      <button class="btn btn--primary" type="submit">${button}</button>
    </form>
    <div class="form-success" id="${id}-done" hidden tabindex="-1"><strong>Danke für Ihre Anfrage!</strong><span class="muted">${done}</span></div>`;
const BV_CLS = { "In Planung": "plan", "Im Bau": "bau", "Fertiggestellt": "fertig" };
const bvBadge = (st) => (st ? `<span class="status-badge status-badge--${BV_CLS[st] || "plan"}">${esc(st)}</span>` : "");
const bvProgress = (n) => { const v = Math.max(0, Math.min(100, Number(n) || 0)); return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}" aria-label="Baufortschritt"><span style="width:${v}%"></span></div><span class="progress__label">Baufortschritt ${v} %</span>`; };
function bvCard(b) {
  return `<a class="ref-card" href="/bauvorhaben/${b.slug}" data-cat="${esc(b.status)}">${ph(b.title + " Neubau", { img: b.titelbild || "neubau" })}<span class="ref-card__body"><span class="ref-card__row"><span class="ref-card__tag">${esc(b.typ)}</span>${bvBadge(b.status)}</span><span class="ref-card__title">${esc(b.title)}</span><span class="ref-card__meta">${esc([b.ort, b.fertigstellung && "Fertigstellung " + b.fertigstellung].filter(Boolean).join(" · "))}</span>${b.status === "Im Bau" ? bvProgress(b.fortschritt) : ""}</span></a>`;
}

// ===========================================================================
// Startseite
// ===========================================================================
{
  const tiles = services.filter((s) => s.slug !== "komplettsanierung");
  const pickRefs = ["altbauwohnung-stadtteil", "familienbad-stadtteil", "reihenhaus-stadtteil"].map((k) => projects.find((p) => p.slug === k)).filter(Boolean);
  const refs = pickRefs.length === 3 ? pickRefs : projects.filter((p) => p.cat !== "Neubau").slice(0, 3);
  const pillar = ({ img, alt, eyebrow, title, text, topics, btn, more }) => `<article class="pillar">
      ${plainImg(img, alt, "pillar__img")}
      <div class="pillar__body">
        <span class="eyebrow">${eyebrow}</span>
        <h3 class="pillar__title">${title}</h3>
        <p class="pillar__text">${text}</p>
        ${topicChips(topics)}
        <div class="pillar__ctas"><a class="btn btn--primary btn--block-mobile" href="${btn[1]}">${btn[0]}</a><a class="link-arrow" href="${more[1]}">${more[0]}</a></div>
      </div>
    </article>`;
  const body = `
<section class="hero"><div class="container grid-2">
  <div class="hero__text">
    <span class="eyebrow">Neubau · Sanierung · Immobilien in Hamburg</span>
    <h1 class="h1">Bauen, sanieren, vermarkten – Ihr Immobilienpartner in Hamburg.</h1>
    <p class="lead">Wir bauen neu, sanieren mit eigenen Handwerkern und vermarkten Immobilien in Hamburg – mit einem festen Ansprechpartner von der ersten Idee bis zur Schlüsselübergabe.</p>
    <div class="hero__ctas"><a class="btn btn--primary btn--block-mobile" href="/kontakt">Kostenlos anfragen</a><a class="link-arrow" href="/referenzen">Aktuelle Sanierungen ansehen</a></div>
    <ul class="check-list">${check("Fester Ansprechpartner")}${check("Eigene Handwerker")}${check("Alles aus einer Hand")}</ul>
  </div>
  <div class="media-first">${beforeAfter({ caption: "Echtes Projektfoto · [Stadtteil]" })}</div>
</div></section>

<section class="trust" aria-label="Vertrauen"><div class="container trust__grid">
  <div class="trust__item"><strong>★ ${site.rating}</strong><span>aus ${site.reviews} Google-Bewertungen</span></div>
  <div class="trust__item"><strong>+100</strong><span>Projekte in Hamburg</span></div>
  <div class="trust__item"><strong>11 Jahre</strong><span>Erfahrung in Bau &amp; Immobilien</span></div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head"><span class="eyebrow">Zwei Geschäftsbereiche</span><h2 class="h2">Alles rund um Ihre Immobilie – aus einer Hand.</h2><p class="lead">Ob Sie bauen, sanieren, kaufen oder verkaufen möchten: Sie haben einen festen Ansprechpartner, und auf der Baustelle arbeiten unsere eigenen Handwerker.</p></div>
  <div class="pillars">
    ${pillar({ img: "wohnen", alt: "Fertig sanierter Wohnraum – Bauen und Sanieren", eyebrow: "Bauen &amp; Sanieren", title: "Neubau und Sanierung mit eigenen Handwerkern.", text: "Wir bauen massiv und sanieren Altbau, Bad und Haustechnik – mit fest angestellten Fachleuten für alle Gewerke und einem Ansprechpartner von der Besichtigung bis zur Abnahme.", topics: homeTopics.bauen, btn: ["Projekt anfragen", "/kontakt"], more: ["Mehr zu Bauen &amp; Sanieren", "/leistungen"] })}
    ${pillar({ img: "villa", alt: "Villa in Hamburg – Immobilien", eyebrow: "Immobilien", title: "Kaufen, mieten, verkaufen – und verwalten lassen.", text: "Wir vermarkten und vermieten Wohn- und Gewerbeimmobilien in Hamburg und Umgebung, bewerten Ihre Immobilie kostenlos und übernehmen auf Wunsch die Hausverwaltung.", topics: homeTopics.immobilien, btn: ["Immobilie bewerten", "/immobilie-verkaufen"], more: ["Aktuelle Angebote", "/immobilien"] })}
  </div>
  <h3 class="h3-sub" id="gewerke">Sanierung – alle Gewerke mit eigenen Handwerkern</h3>
  <div class="tiles tiles--compact">${tiles.map((s) => tile(s)).join("")}</div>
</div></section>

<section class="section section--sand"><div class="container">
  <div class="section-head section-head--row"><div><span class="eyebrow" style="margin-bottom:12px">Referenzen</span><h2 class="h2">Vorher. Nachher. Hamburg.</h2></div><a class="link-arrow" href="/referenzen">Alle Referenzen</a></div>
  <div class="scroller">${refs.map((p) => refCard(p)).join("")}</div>
</div></section>

<section class="section section--dark"><div class="container grid-2">
  <div class="stack stack--sm">
    <span class="eyebrow">Für Eigentümer</span>
    <h2 class="h2">Was ist Ihre Immobilie wert?</h2>
    <p class="lead lead--on-dark">Kostenlose, unverbindliche Ersteinschätzung von unseren Immobilienexperten – auf Wunsch mit Besichtigung vor Ort.</p>
  </div>
  <form class="quick-form" action="/immobilie-verkaufen" method="get">
    <div class="field"><label for="b-art">Objektart</label><select class="select select--full" id="b-art" name="art"><option>Haus</option><option>Wohnung</option><option>Grundstück</option><option>Gewerbe</option></select></div>
    <div class="form-grid">
      <div class="field"><label for="b-plz">PLZ</label><input class="input" id="b-plz" name="plz" type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code"></div>
      <div class="field"><label for="b-qm">Fläche ca. (m²)</label><input class="input" id="b-qm" name="flaeche" type="number" inputmode="numeric" min="1"></div>
    </div>
    <button class="btn btn--primary" type="submit">Kostenlos bewerten lassen</button>
  </form>
</div></section>

<section class="section"><div class="container grid-2">
  ${ph("Teamfoto auf der Baustelle (echtes Team, kein Stockfoto)", { h: "clamp(240px, 40vw, 520px)" })}
  <div class="stack" style="gap:28px">
    <div><span class="eyebrow" style="margin-bottom:12px">Warum DMC Immobilien</span><h2 class="h2">Handwerk, auf das Sie sich verlassen können.</h2></div>
    <div class="why-grid">
      <div class="why-item"><strong>Eigene Handwerker</strong><span>Fest angestellte Fachleute statt wechselnder Subunternehmer – ein Ansprechpartner für alles.</span></div>
      <div class="why-item"><strong>Termintreue</strong><span>Ein verbindlicher Zeitplan, den wir gemeinsam mit Ihnen festlegen.</span></div>
      <div class="why-item"><strong>Saubere Baustelle</strong><span>Böden und Möbel geschützt, jeden Abend aufgeräumt.</span></div>
      <div class="why-item"><strong>Transparente Kosten</strong><span>Schriftliches Angebot mit klaren Positionen – ohne Überraschungen.</span></div>
    </div>
  </div>
</div></section>

<section class="section section--dark"><div class="container">
  <div class="section-head" style="max-width:860px"><span class="eyebrow" style="margin-bottom:12px">Ablauf</span><h2 class="h2">In fünf Schritten zum fertigen Projekt – ob Zuhause oder Kapitalanlage.</h2></div>
  ${darkSteps(homeSteps)}
  <a class="link-arrow" href="/ablauf" style="margin-top:28px">Ablauf im Detail</a>
</div></section>

<section class="section"><div class="container">
  <div class="section-head section-head--row"><h2 class="h2">Was unsere Kunden sagen</h2><a class="link-arrow" href="#" rel="nofollow">Alle Bewertungen bei Google</a></div>
  <div class="scroller">${(bewertungen.length ? bewertungen.slice(0, 6) : ["[Stadtteil] · Badsanierung", "[Stadtteil] · Komplettsanierung", "[Stadtteil] · Malerarbeiten"]).map(quoteCard).join("")}</div>
</div></section>

<section class="section section--sand"><div class="container grid-2">
  <div class="stack">
    <span class="eyebrow">Einsatzgebiet</span>
    <h2 class="h2">Zu Hause in Hamburg und im Umland.</h2>
    <p class="muted">Unser Firmensitz liegt im Alstertal. Schwerpunkte sind die Elbvororte von Ottensen bis Blankenese und das Alstertal – wir arbeiten aber in ganz Hamburg und im Umland bis ca. [XX] km.</p>
    <div class="chip-row">${districts.map((d) => `<a class="chip chip--soft" href="/einsatzgebiet">${d}</a>`).join("")}</div>
    <a class="link-arrow" href="/einsatzgebiet">Zum Einsatzgebiet</a>
  </div>
  ${hamburgMap()}
</div></section>

<section class="section"><div class="container grid-2">
  ${ph("Porträt Inhaber / Team", { h: "clamp(280px, 36vw, 460px)" })}
  <div class="stack">
    <span class="eyebrow">Über uns</span>
    <h2 class="h2">Hinter jeder Baustelle stehen Menschen.</h2>
    <p class="lead">Wir sind ein Hamburger Team aus 18 Mitarbeiterinnen und Mitarbeitern – mit eigenen Handwerkern für alle Gewerke. Vom ersten Termin bis zur Abnahme haben Sie einen festen Ansprechpartner – und wissen immer, wer bei Ihnen arbeitet.</p>
    <p class="signature">Danilo Del Favero, Geschäftsführer · Tomasz Gajda, Bauleiter</p>
    <a class="link-arrow" href="/ueber-uns">Lernen Sie uns kennen</a>
  </div>
</div></section>

<section class="section section--sand"><div class="container container--narrow">
  <h2 class="h2" style="margin-bottom:24px">Häufige Fragen</h2>
  ${faq(homeFaq)}
</div></section>

${ctaBand()}`;
  page("/", layout({
    title: "Startseite", path: "/", description: "DMC Immobilien in Hamburg: Neubau, Sanierung mit eigenen Handwerkern sowie Kauf, Miete, Verkauf, Bewertung und Hausverwaltung – mit festem Ansprechpartner.",
    body, schema: [faqSchema(homeFaq)]
  }));
}

// ===========================================================================
// Leistungen – Übersicht
// ===========================================================================
{
  const feat = serviceBySlug["komplettsanierung"];
  const body = `
${pageHead({ crumbs: [["Bauen &amp; Sanieren"]], eyebrow: "Bauen &amp; Sanieren", heading: "Unsere Leistungen in Hamburg", lead: "Neubau, Komplettsanierung oder einzelnes Gewerk – mit eigenen Handwerkern für alle Gewerke und einem festen Ansprechpartner." })}
<section class="section"><div class="container">
  <a class="feature-card" href="/leistungen/${feat.slug}">
    <span class="feature-card__body"><span class="eyebrow" style="color:var(--messing-hell)">Alles aus einer Hand</span><span class="feature-card__title">Komplettsanierung</span><span class="feature-card__text">${feat.intro}</span><span class="feature-card__more">Mehr zur Komplettsanierung →</span></span>
    ${ph("Projektfoto Komplettsanierung", { tone: "blue", h: "100%" })}
  </a>
  <div class="tiles">${services.filter((s) => s.slug !== "komplettsanierung").map((s) => tile(s)).join("")}</div>
</div></section>
<section class="mid-cta"><div class="container">
  <div><strong>Sie planen einen Neubau?</strong><span>Vom Grundstück bis zur Schlüsselübergabe – massiv gebaut, mit eigenen Handwerkern für den Ausbau.</span></div>
  <a class="btn btn--light" href="/neubau">Neubau &amp; Projektierung</a>
</div></section>
${ctaBand("Nicht sicher, was Sie brauchen?", `Beschreiben Sie kurz Ihr Vorhaben – wir beraten Sie kostenlos und melden uns innerhalb von ${site.response}.`)}`;
  page("/leistungen", layout({ title: "Bauen & Sanieren", path: "/leistungen", active: "bauen", description: "Bauen & Sanieren mit DMC Immobilien: Neubau, Komplettsanierung, Altbausanierung, Badsanierung, Malerarbeiten, Elektro, Sanitär & Heizung, energetische Sanierung, Fenster, Boden, Trockenbau.", body }));
}

// ===========================================================================
// Leistungsseiten (Vorlage für alle 10)
// ===========================================================================
for (const s of services) {
  const related = s.related.map((k) => serviceBySlug[k]);
  const formHref = `/kontakt?leistung=${encodeURIComponent(s.form)}`;
  const body = `
<section class="section" style="padding-top:32px"><div class="container stack" style="gap:28px">
  ${breadcrumb([["Bauen &amp; Sanieren", "/leistungen"], [s.title]])}
  <div class="grid-2">
    <div class="stack">
      <span class="eyebrow">Leistung · ${s.title}</span>
      <h1 class="h1" style="font-size:calc(var(--h1) - 4px)">${s.h1}</h1>
      <p class="lead">${s.intro}</p>
      <div><a class="btn btn--primary btn--block-mobile" href="${formHref}">${s.title} anfragen</a></div>
      <ul class="check-list check-list--col">${s.bullets.map(check).join("")}</ul>
    </div>
    <div class="media-first">${ph(s.photo, { h: "clamp(240px, 38vw, 500px)" })}</div>
  </div>
</div></section>

<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Das übernehmen wir für Sie</h2>
  <ul class="scope-list">${s.scope.map(([t, x], i) => `<li><span class="scope-list__n">${String(i + 1).padStart(2, "0")}</span><span><strong>${t}</strong><span class="t">${x}</span></span></li>`).join("")}</ul>
</div></section>

<section class="section"><div class="container">
  <div class="section-head section-head--row"><h2 class="h2">${s.galleryTitle}</h2><a class="link-arrow" href="/referenzen">Alle Referenzen</a></div>
  <div class="gallery">${s.gallery.map((g, i) => `<div class="gallery-item">${beforeAfter({ small: true, after: (imageFor(s.title + " " + g) || imageFor(s.title + i) || { key: "wohnen" }).key })}<span>[Stadtteil] · ${g}</span></div>`).join("")}</div>
</div></section>

<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">So läuft Ihre ${s.title === "Boden" ? "Bodensanierung" : s.title} ab</h2>
  <ol class="steps-light">${s.steps.map(([dur, t, x], i) => `<li><span class="steps-light__top"><span class="steps-light__n">${i + 1}</span><span class="steps-light__dur">${dur}</span></span><strong>${t}</strong><span class="t">${x}</span></li>`).join("")}</ol>
</div></section>

<section class="section"><div class="container grid-2 grid-2--top">
  <div class="stack">
    <h2 class="h2">Was beeinflusst den Aufwand?</h2>
    <p class="lead">Jedes Projekt ist anders. Den genauen Preis nennen wir Ihnen nach der Besichtigung – schriftlich und mit allen Positionen.</p>
    ${s.funding ? `<p class="info-box"><strong>Förderung:</strong> ${s.funding}</p>` : ""}
  </div>
  <div class="factor-box"><ul class="factor-list">${s.factors.map(([t, x]) => `<li><span><strong>${t}</strong> – ${x}</span></li>`).join("")}</ul></div>
</div></section>

<section class="mid-cta"><div class="container">
  <div><strong>${s.midCta[0]}</strong><span>${s.midCta[1]}</span></div>
  <a class="btn btn--light" href="${formHref}">Fotos senden</a>
</div></section>

<section class="section"><div class="container">
  <figure class="big-quote"><span class="stars" aria-label="5 von 5 Sternen">★★★★★</span><blockquote>„[Echtes Zitat eines Kunden mit Einwilligung einsetzen]“</blockquote><figcaption><strong>[Vorname N.]</strong> · ${s.quoteMeta}</figcaption></figure>
</div></section>

<section class="section section--sand"><div class="container container--narrow">
  <h2 class="h2" style="margin-bottom:24px">Fragen zur ${s.title === "Boden" ? "Bodensanierung" : s.title === "Fenster & Türen" ? "Fenster- und Türsanierung" : s.title === "Sanitär & Heizung" ? "Sanitär- und Heizungsinstallation" : s.title === "Trockenbau" ? "Trockenbau-Leistung" : s.title}</h2>
  ${faq(s.faq)}
</div></section>

<section class="section"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Passt dazu</h2>
  <div class="related">${related.map((r) => tile(r)).join("")}</div>
</div></section>

${ctaBand(`${s.title} in Hamburg?`, "Schicken Sie uns ein paar Fotos und Ihre Wünsche – innerhalb von 48 Stunden erhalten Sie ein erstes Angebot.", formHref)}`;
  page(`/leistungen/${s.slug}`, layout({
    title: `${s.title} in Hamburg`, path: `/leistungen/${s.slug}`, active: "bauen",
    description: `${s.title} in Hamburg mit eigenen Handwerkern: ${s.teaser} Fester Ansprechpartner, schriftliches Angebot.`,
    body, schema: [faqSchema(s.faq), { "@context": "https://schema.org", "@type": "Service", name: `${s.title} in Hamburg`, areaServed: "Hamburg", provider: { "@type": "HomeAndConstructionBusiness", name: site.name } }]
  }));
}

// ===========================================================================
// Referenzen
// ===========================================================================
{
  const known = ["Neubau", "Komplettsanierung", "Bad", "Altbau", "Energetisch", "Maler", "Fenster", "Boden"];
  const cats = ["Alle", ...known.filter((c) => projects.some((p) => p.cat === c)), ...[...new Set(projects.map((p) => p.cat))].filter((c) => c && !known.includes(c))];
  const bezirke = [...new Set(projects.map((p) => p.bezirk).filter(Boolean))].sort((a, b) => (a === "Elbvororte" ? -1 : b === "Elbvororte" ? 1 : a === "Alstertal" ? -1 : b === "Alstertal" ? 1 : a.localeCompare(b, "de")));
  const body = `
${pageHead({ crumbs: [["Referenzen"]], eyebrow: "Referenzen", heading: "Unsere Projekte in Hamburg", lead: "[XX] abgeschlossene Neubauten und Sanierungen – mit echten Fotos, Stadtteil, Umfang und Dauer." })}
<section class="section" style="padding-top:48px"><div class="container">
  <div class="filter-bar">
    <div class="chip-row chip-row--scroll" role="group" aria-label="Projekte filtern" data-filter-group data-filter-target="#project-grid" data-filter-count="#project-count" data-filter-select="#ref-stadtteil">
      ${cats.map((c, i) => `<button type="button" class="chip" data-value="${c}" aria-pressed="${i === 0}">${c}</button>`).join("")}
    </div>
    <div class="filter-meta"><span id="project-count" aria-live="polite">${projects.length} Projekte</span>
      <label class="select-wrap" for="ref-stadtteil">Stadtteil <select class="select" id="ref-stadtteil"><option value="">Alle</option>${bezirke.map((b) => `<option value="${esc(b)}">${b === "Elbvororte" ? "Elbvororte (Ottensen–Blankenese)" : esc(b)}</option>`).join("")}</select></label>
    </div>
  </div>
  <div class="project-grid" id="project-grid">
    ${projects.map((p) => `<a class="ref-card" href="/referenzen/${p.slug}" data-cat="${esc(p.cat)}" data-area="${esc(p.bezirk || "")}">${ph(p.title, { img: p.foto || p.nachher || "" })}<span class="ref-card__body"><span class="ref-card__tag">${esc(p.cat)}</span><span class="ref-card__title">${esc(p.title)}</span><span class="ref-card__meta">${esc(p.meta)}</span></span></a>`).join("")}
  </div>
  <p class="muted" data-filter-empty hidden style="margin-top:24px">Für diese Auswahl gibt es noch keine Projekte. Bitte Filter anpassen.</p>
  <div class="center"><a class="btn btn--outline btn--block-mobile" href="/kontakt">Ihr Projekt anfragen</a></div>
</div></section>
${ctaBand("Ihr Projekt könnte das nächste sein.", `Erzählen Sie uns, was Sie vorhaben – wir melden uns innerhalb von ${site.response}.`)}`;
  page("/referenzen", layout({ title: "Referenzen", path: "/referenzen", active: "referenzen", description: "Referenzen von DMC Immobilien: abgeschlossene Neubauten und Sanierungen in Hamburg mit Vorher-Nachher-Fotos, Stadtteil, Umfang und Dauer.", body }));
}

// Projekt-Detailseiten
projects.forEach((p, i) => {
  const next = projects[(i + 1) % projects.length];
  // Neubau-Projekte haben keine Leistungsseite unter /leistungen, sondern /neubau
  const svc = serviceBySlug[p.service] ? { ...serviceBySlug[p.service], href: `/leistungen/${p.service}`, ask: `/kontakt?leistung=${encodeURIComponent(serviceBySlug[p.service].form)}` } : { title: "Neubau & Projektierung", href: "/neubau", ask: "/kontakt?anliegen=neubau" };
  const gal = (p.galerie || []).filter(Boolean);
  const det = (p.detailbilder || []).filter(Boolean);
  const body = `
<section class="section" style="padding-top:32px;padding-bottom:64px"><div class="container stack" style="gap:28px">
  ${breadcrumb([["Referenzen", "/referenzen"], [esc(p.title)]])}
  <div class="proj-head">
    <div class="stack"><span class="eyebrow">${svc.title}</span><h1 class="h1" style="font-size:calc(var(--h1) - 6px)">${esc(p.h1 || p.title)}</h1></div>
    <dl class="fact-sheet">
      <div><dt>Stadtteil</dt><dd>${esc(p.stadtteil || "[Stadtteil]")}</dd></div>
      <div><dt>Objekt</dt><dd>${esc(p.objekt)}</dd></div>
      <div><dt>Fläche / Umfang</dt><dd>${esc(p.flaeche)}</dd></div>
      <div><dt>Dauer</dt><dd>${esc(p.dauer)}</dd></div>
      <div><dt>Gewerke</dt><dd>${esc(p.gewerke)}</dd></div>
    </dl>
  </div>
</div></section>
<section><div class="container">${p.foto ? ph(p.h1 || p.title, { img: p.foto, h: "clamp(280px, 45vw, 620px)" }) : beforeAfter({ h: "clamp(280px, 45vw, 620px)", caption: "Vorher / Nachher · Regler verschieben", after: afterFor(p), ...(p.vorher ? { before: p.vorher } : {}) })}</div></section>
<section class="section"><div class="container grid-2 grid-2--top">
  <div class="stack"><span class="eyebrow">Ausgangslage</span><h2 class="h2" style="font-size:calc(var(--h2) - 6px)">Die Ausgangslage</h2>${p.ausgangslage ? `<div class="lead cms-text">${md(p.ausgangslage)}</div>` : `<p class="lead">[2–3 Sätze: Zustand vorher, z. B. alte Elektrik, Bad aus den 70ern, abgenutzte Dielen. Was wollte der Kunde? z. B. Einzug in 8 Wochen, offene Küche, modernes Bad.]</p>`}</div>
  <div class="stack"><span class="eyebrow">Umsetzung</span><h2 class="h2" style="font-size:calc(var(--h2) - 6px)">Was wir gemacht haben</h2>${p.umsetzung ? `<div class="lead cms-text">${md(p.umsetzung)}</div>` : `<p class="lead">[Was gemacht wurde, Besonderheiten und Herausforderungen – z. B. Stuck erhalten, Leitungen unter Putz neu verlegt, Dielen aufgearbeitet statt ersetzt.]</p>`}
    <div class="duo">${[0, 1].map((k) => ph(`Baustelle: Detail ${k + 1}`, { tone: "dark", img: det[k] || "", attrs: ` data-lightbox="${esc(p.title)} – Detail ${k + 1}"` })).join("")}</div>
  </div>
</div></section>
<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:28px">Galerie</h2>
  <div class="photo-grid">${gal.length ? gal.map((g, k) => ph(`${p.title} – Foto ${k + 1}`, { img: g, attrs: ` data-lightbox="${esc(p.title)} – Foto ${k + 1}"` })).join("") : projectGallery.map((g) => ph(g, { attrs: ` data-lightbox="${g}"` })).join("")}</div>
</div></section>
<section class="section"><div class="container container--narrow">
  <figure class="quote-box" style="margin:0"><span class="stars" aria-label="5 von 5 Sternen">★★★★★</span><blockquote>„[Zitat des Kunden zu diesem Projekt einsetzen]“</blockquote><figcaption class="muted"><strong style="color:var(--text)">[Vorname N.]</strong> · Eigentümer/-in, [Stadtteil]</figcaption></figure>
</div></section>
<section class="section section--tight-top"><div class="container">
  <div class="next-links">
    <a class="next-link" href="${svc.href}"><span>Passende Leistung</span><span>${svc.title} →</span></a>
    <a class="next-link" href="/referenzen/${next.slug}"><span>Nächstes Projekt</span><span>${esc(next.title)} →</span></a>
  </div>
  <div class="center"><a class="btn btn--primary btn--block-mobile" href="${svc.ask}">Ähnliches Projekt anfragen</a></div>
</div></section>
${lightbox}`;
  page(`/referenzen/${p.slug}`, layout({ title: p.title, path: `/referenzen/${p.slug}`, active: "referenzen", description: `Referenzprojekt von DMC Immobilien: ${p.title} – ${p.gewerke}. ${p.foto ? "Fotos" : "Vorher-Nachher"}, Umfang und Dauer.`, body }));
});

// ===========================================================================
// Ablauf
// ===========================================================================
{
  const body = `
${pageHead({ crumbs: [["Ablauf"]], eyebrow: "Ablauf", heading: "So läuft Ihre Sanierung ab", lead: "Transparent von der ersten Anfrage bis zur Abnahme – mit einem festen Ansprechpartner, der Sie durch jeden Schritt begleitet." })}
<section class="section"><div class="container">
  <ol class="timeline">${processSteps.map(([t, what, you, dur], i) => `<li><span class="steps-light__top"><span class="steps-light__n">${i + 1}</span><span class="steps-light__dur">${dur}</span></span><strong style="font-size:20px;color:var(--tiefsee)">${t}</strong><span class="muted">${what}</span><span class="timeline__you"><strong>Ihre Aufgabe:</strong> ${you}</span></li>`).join("")}</ol>
</div></section>
<section class="section section--sand"><div class="container grid-2">
  <div class="stack"><h2 class="h2">Gut geplant ist halb saniert.</h2><p class="lead">Beim Aufmaß halten wir jedes Detail fest. Daraus entsteht ein Plan, in dem alle Gewerke in der richtigen Reihenfolge stehen – so greift ein Schritt in den nächsten. Bei größeren Umbauten arbeiten wir mit Architekten und Energieberatern zusammen [prüfen].</p><a class="link-arrow" href="/leistungen/komplettsanierung">Zur Komplettsanierung</a></div>
  ${ph("Planungsgespräch beim Kunden", { h: "clamp(240px, 30vw, 380px)" })}
</div></section>
<section class="section"><div class="container grid-2 grid-2--top">
  <div class="factor-box stack"><h2 class="h2" style="font-size:calc(var(--h2) - 8px)">Förderung mitdenken</h2><p class="muted">Für energetische Maßnahmen und barrierefreie Umbauten gibt es oft Zuschüsse oder günstige Kredite, z. B. über KfW oder BAFA. Wichtig: Viele Anträge müssen <strong>vor</strong> Auftragsvergabe gestellt werden.</p><a class="link-arrow" href="/ratgeber/foerderung-energetische-sanierung">Zum Ratgeber Förderung</a></div>
  <div class="stack"><h2 class="h2" style="font-size:calc(var(--h2) - 8px)">Darauf können Sie sich verlassen</h2><ul class="check-list check-list--col">${promises.map(check).join("")}</ul></div>
</div></section>
<section class="section section--sand"><div class="container container--narrow"><h2 class="h2" style="margin-bottom:24px">Fragen zum Ablauf</h2>${faq(processFaq)}</div></section>
${ctaBand("Bereit für den ersten Schritt?", `Die Anfrage dauert zwei Minuten. Wir melden uns innerhalb von ${site.response} für einen Termin vor Ort.`)}`;
  page("/ablauf", layout({ title: "Ablauf", path: "/ablauf", active: "bauen", description: "So läuft Ihre Sanierung mit DMC Immobilien ab: von der Anfrage über Besichtigung und Angebot bis zur Abnahme – mit festem Ansprechpartner.", body, schema: [faqSchema(processFaq)] }));
}

// ===========================================================================
// Über uns
// ===========================================================================
{
  const body = `
<section class="section section--sand" style="padding-top:32px"><div class="container stack" style="gap:28px">
  ${breadcrumb([["Über uns"]])}
  ${ph("Großes Teamfoto vor Firmenfahrzeug mit Logo", { tone: "dark", h: "clamp(240px, 40vw, 540px)" })}
  <div class="stack" style="max-width:860px"><h1 class="h1">Ihr Partner für Bauen, Sanieren und Immobilien in Hamburg.</h1><p class="lead">Ein Hamburger Unternehmen mit eigenen Handwerkern und Immobilienexperten – hier lernen Sie das Team kennen.</p></div>
</div></section>
<section class="section"><div class="container grid-2 grid-2--story">
  <div class="stack"><span class="eyebrow">Unsere Geschichte</span><h2 class="h2">Aus Hamburg, für Hamburg.</h2>
    <p class="lead">[Gründung: Wann und warum ist DMC Immobilien entstanden?]</p>
    <p class="lead">[Entwicklung: Vom ersten Auftrag bis heute – welche Gewerke kamen dazu, wie ist das Team gewachsen?]</p>
    <p class="lead">[Haltung: Was ist Ihnen wichtig? z. B. „Wir hinterlassen jede Baustelle so, wie wir selbst eine vorfinden möchten.“]</p>
    <p class="signature">Danilo Del Favero, Geschäftsführer · Tomasz Gajda, Bauleiter</p></div>
  ${ph("Porträt Geschäftsführung", { h: "clamp(300px, 34vw, 480px)" })}
</div></section>
<section class="section section--dark" style="padding:64px 0"><div class="container numbers">
  <div><strong>11</strong><span>Jahre Erfahrung</span></div><div><strong>+100</strong><span>Projekte in Hamburg</span></div><div><strong>18</strong><span>Mitarbeitende</span></div><div><strong>10</strong><span>Gewerke aus einer Hand</span></div>
</div></section>
<section class="section"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Das Team</h2>
  <div class="team-grid">${team.map((r) => `<div class="team-card">${ph(r, { art: "portrait" })}<strong>[Name]</strong><span>${r}</span></div>`).join("")}</div>
</div></section>
<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">So arbeiten wir</h2>
  <div class="values">${values.map(([t, x, d]) => `<div class="value">${icon(d, { size: 32, stroke: "#8A6A33" })}<strong>${t}</strong><span>${x}</span></div>`).join("")}</div>
</div></section>
<section class="section"><div class="container grid-2 grid-2--top">
  <div class="stack"><h2 class="h2" style="font-size:calc(var(--h2) - 8px)">Qualifikation &amp; Nachweise</h2>
    <ul class="plain-list"><li>Erlaubnis nach § 34c GewO (Makler &amp; Bauträger)</li><li>[Meisterbrief / Handwerksrolle – nur falls vorhanden]</li><li>Betriebshaftpflicht: [Versicherer]</li></ul></div>
  <div class="stack"><h2 class="h2" style="font-size:calc(var(--h2) - 8px)">Eigene Handwerker</h2><p class="muted">Unsere Handwerker sind fest bei DMC angestellt – keine wechselnden Subunternehmer. So wissen Sie immer, wer bei Ihnen arbeitet, und wir können für Qualität und Termine geradestehen.</p>
    <ul class="plain-list"><li>Sanitär &amp; Heizung, Elektro, Maler, Boden, Trockenbau</li><li>Feste Teams mit eigener Bauleitung</li><li>[Anzahl] Handwerkerinnen und Handwerker</li></ul></div>
</div></section>
${ctaBand("Lernen Sie uns kennen.", "Ob als Kunde oder als neuer Kollege – wir freuen uns auf Sie.", "/kontakt", { buttons: `<a class="btn btn--outline-light" href="/karriere">Karriere bei uns</a>` })}`;
  page("/ueber-uns", layout({ title: "Über uns", path: "/ueber-uns", active: "ueber", description: "DMC Immobilien – Ihr Partner für Bauen, Sanieren und Immobilien in Hamburg. 18 Mitarbeitende, eigene Handwerker und Immobilienexperten.", body }));
}

// ===========================================================================
// Einsatzgebiet
// ===========================================================================
{
  const body = `
${pageHead({ crumbs: [["Einsatzgebiet"]], eyebrow: "Einsatzgebiet", heading: "Unser Einsatzgebiet in Hamburg und Umgebung", lead: "Wir arbeiten in Hamburg und im Umland – bis ca. [XX] km rund um unseren Firmensitz im Alstertal." })}
<section class="section" style="padding-bottom:0"><div class="container">${hamburgMap()}</div></section>
<section class="section"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Gebiete &amp; Stadtteile</h2>
  <div class="areas">${areas.map(([t, parts, core, inArea]) => `<div class="area${core ? " area--core" : ""}"><div class="area__head"><strong>${t}</strong>${core ? '<span class="area__badge">Kerngebiet</span>' : ""}</div><span class="area__parts">${parts}</span><a class="link-arrow" href="/kontakt?anliegen=sanierung">Sanierung ${inArea}</a></div>`).join("")}</div>
</div></section>
${ctaBand("Ihr Stadtteil fehlt?", `Fragen Sie trotzdem – oft finden wir eine Lösung. Wir melden uns innerhalb von ${site.response}.`)}`;
  page("/einsatzgebiet", layout({ title: "Einsatzgebiet", path: "/einsatzgebiet", active: "einsatzgebiet", description: "DMC Immobilien baut und saniert in ganz Hamburg – Schwerpunkte Elbvororte (Ottensen bis Blankenese) und Alstertal, außerdem Altona, Eimsbüttel, Hamburg-Nord, Wandsbek, Mitte, Bergedorf und Umland.", body }));
}

// ===========================================================================
// Ratgeber
// ===========================================================================
{
  const known = ["Kosten", "Altbau", "Bad", "Förderung", "Planung"];
  const cats = ["Alle", ...known.filter((c) => articles.some((a) => a.cat === c)), ...[...new Set(articles.map((a) => a.cat))].filter((c) => c && !known.includes(c))];
  const body = `
${pageHead({ crumbs: [["Ratgeber"]], eyebrow: "Ratgeber", heading: "Wissen rund um Ihre Sanierung", lead: "Ehrliche Antworten auf die Fragen, die uns Kunden am häufigsten stellen – zu Kosten, Altbau, Bad, Förderung und Planung." })}
<section class="section" style="padding-top:48px"><div class="container">
  <div class="chip-row chip-row--scroll" role="group" aria-label="Kategorien" style="margin-bottom:32px" data-filter-group data-filter-target="#article-grid">
    ${cats.map((c, i) => `<button type="button" class="chip" data-value="${c}" aria-pressed="${i === 0}">${c}</button>`).join("")}
  </div>
  <div class="article-grid" id="article-grid">
    ${articles.map((a) => `<a class="article-card" href="/ratgeber/${a.slug}" data-cat="${esc(a.cat)}">${ph(a.title, { img: a.cover || "" })}<span class="article-card__meta"><span>${esc(a.cat)}</span><span>${esc(a.time)}</span></span><span class="article-card__title">${esc(a.title)}</span><span class="article-card__teaser">${esc(a.teaser)}</span></a>`).join("")}
  </div>
</div></section>
${ctaBand("Ihre Frage ist nicht dabei?", `Fragen Sie uns direkt – wir beraten Sie kostenlos und melden uns innerhalb von ${site.response}.`)}`;
  page("/ratgeber", layout({ title: "Ratgeber", path: "/ratgeber", active: "ratgeber", description: "Ratgeber rund um Sanierung in Hamburg: Kosten, Altbau, Bad, Förderung und Planung – ehrlich erklärt vom Fachbetrieb.", body }));
}

// Artikel
articles.forEach((a) => {
  const svc = serviceBySlug[a.service] || services[0];
  const others = articles.filter((x) => x.slug !== a.slug).slice(0, 2);
  const sections = a.sections || [];
  const faqItems = (a.faq || []).filter((f) => f.q).map((f) => [esc(f.q), esc(f.a)]);
  const toc = sections.map((x) => x.heading.replace(/^\d+\.\s*/, ""));
  const half = Math.ceil(sections.length / 2);
  const sect = sections.map((x, i) => {
    const h = /^\d+\./.test(x.heading) ? x.heading : `${i + 1}. ${x.heading}`;
    let html = `<h2 id="abschnitt-${i + 1}">${esc(h)}</h2>${md(x.text)}`;
    if (x.image) html += `<figure class="cms-figure">${ph(x.imageCaption || a.title, { img: x.image, h: "clamp(220px, 30vw, 340px)" })}${x.imageCaption ? `<figcaption>${esc(x.imageCaption)}</figcaption>` : ""}</figure>`;
    else if (x.imageCaption) html += ph(x.imageCaption, { h: "clamp(220px, 30vw, 340px)" });
    if (i === half - 1) html += `<div class="inline-cta"><strong>Genaue Kosten für Ihr Projekt?</strong><span>Schicken Sie uns Fotos – wir geben Ihnen eine erste Einschätzung.</span><a class="btn btn--light" href="/kontakt?leistung=${encodeURIComponent(svc.form)}">Jetzt anfragen</a></div>`;
    return html;
  }).join("");
  const author = a.author ? `<strong>${esc(a.author)}</strong>${a.authorRole ? `, ${esc(a.authorRole)}` : ""}` : `<strong>[Name]</strong>, [Rolle, z. B. Projektleitung]`;
  const body = `
<article class="article-layout">
  <div class="article-body">
    ${breadcrumb([["Ratgeber", "/ratgeber"], [esc(a.cat)]])}
    <span class="eyebrow">${esc(a.tags || a.cat)}</span>
    <h1>${esc(a.title)}</h1>
    <div class="author"><span class="author__img" aria-hidden="true"></span><span>${author}<br>Aktualisiert am ${a.date ? dateDe(a.date) : "[TT.MM.JJJJ]"}${a.time ? ` · ${esc(a.time)} Lesezeit` : ""}</span></div>
    ${a.short ? `<div class="short-answer"><strong>Kurz gesagt</strong>${md(a.short)}</div>` : ""}
    ${sections.length > 1 ? `<details class="toc"><summary>Inhalt</summary><ol>${toc.map((t, i) => `<li><a href="#abschnitt-${i + 1}">${esc(t)}</a></li>`).join("")}</ol></details>` : ""}
    ${sect}
    ${faqItems.length ? `<div class="article-faq"><h2>Häufige Fragen</h2>${faq(faqItems)}</div>` : ""}
  </div>
  <aside class="sticky-cta" aria-label="Anfrage">
    <strong>${esc(a.ctaTitle || "Fragen zu Ihrem Projekt?")}</strong>
    <span>Kostenlose Besichtigung und schriftliches Angebot.</span>
    <a class="btn btn--primary" href="/kontakt?leistung=${encodeURIComponent(svc.form)}">Kostenlos anfragen</a>
    <a class="btn btn--outline" href="${site.phoneHref}">${site.phoneDisplay}</a>
  </aside>
</article>
<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:28px">Weiterlesen</h2>
  <div class="read-more">
    ${others.map((o) => `<a class="next-link" href="/ratgeber/${o.slug}"><span>${esc(o.cat)}</span><span>${esc(o.title)}</span></a>`).join("")}
    <a class="next-link" href="/leistungen/${svc.slug}"><span>Leistung</span><span>${svc.title} in Hamburg →</span></a>
  </div>
</div></section>`;
  const article = { "@context": "https://schema.org", "@type": "Article", headline: a.title, author: a.author ? { "@type": "Person", name: a.author } : { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } };
  if (a.date) article.dateModified = a.date;
  if (a.cover) article.image = site.url + a.cover;
  page(`/ratgeber/${a.slug}`, layout({
    title: a.title, path: `/ratgeber/${a.slug}`, active: "ratgeber", description: plain(a.teaser), body,
    schema: [...(faqItems.length ? [faqSchema(faqItems)] : []), article]
  }));
});

// ===========================================================================
// Karriere
// ===========================================================================
{
  const body = `
<section class="career-hero">
  ${ph("Teamfoto auf der Baustelle", { tone: "dark", h: "clamp(240px, 42vw, 560px)" })}
  <div class="container career-hero__box"><div class="inner">
    ${breadcrumb([["Karriere"]])}
    <span class="eyebrow">Karriere</span>
    <h1 class="h1">Arbeiten bei DMC Immobilien.</h1>
    <p class="lead">Gutes Handwerk braucht gute Leute. Bei uns arbeiten Sie fest angestellt in eigenen Teams – auf Neubau- und Sanierungsbaustellen in ganz Hamburg.</p>
    <div><a class="btn btn--primary btn--block-mobile" href="#stellen">Offene Stellen ansehen</a></div>
  </div></div>
</section>
<section class="section"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Was wir Ihnen bieten</h2>
  <div class="benefits">${benefits.map(([t, x, d]) => `<div class="benefit">${icon(d, { size: 30, stroke: "#8A6A33" })}<strong>${t}</strong><span>${x}</span></div>`).join("")}</div>
</div></section>
<section class="section section--sand" id="stellen"><div class="container container--narrow">
  <h2 class="h2" style="margin-bottom:28px">Offene Stellen</h2>
  <div class="jobs">${jobs.length ? "" : `<p class="muted">Aktuell sind alle Stellen besetzt – Initiativbewerbungen sind trotzdem jederzeit willkommen.</p>`}${jobs.map((j) => `<details><summary><span>${esc(j.title)}</span><span class="job-type">${esc(j.type)}</span></summary>
    <div class="job-body"><div><strong>Ihre Aufgaben</strong><ul>${(j.tasks || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div><div><strong>Das bringen Sie mit</strong><ul>${(j.profile || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div></div>
    <a class="btn btn--primary" href="#bewerben">Jetzt bewerben</a></details>`).join("")}</div>
</div></section>
<section class="section"><div class="container grid-2">
  <div class="stack"><h2 class="h2">Ausbildung bei uns</h2><p class="lead">Wir bilden aus in: [z. B. Maler/-in und Lackierer/-in, Anlagenmechaniker/-in SHK, Elektroniker/-in]. Sie lernen auf echten Baustellen – mit einer festen Ansprechperson, die Sie durch die Ausbildung begleitet.</p><p class="muted">[Ablauf: Start im August, Berufsschule, Prüfung, Übernahme?]</p></div>
  ${ph("Azubi bei der Arbeit", { h: "clamp(240px, 30vw, 380px)" })}
</div></section>
<section class="section section--sand" id="bewerben"><div class="container apply-grid">
  <div>
    <form class="wizard" data-apply data-simple-form data-success="#apply-done" novalidate action="${site.formEndpoint}" method="post" enctype="multipart/form-data">
      <h2 class="h2" style="font-size:calc(var(--h2) - 8px);margin-bottom:8px">In 2 Minuten bewerben</h2>
      <p class="muted" style="margin-bottom:24px">Ohne Anschreiben. Wir melden uns innerhalb weniger Tage.</p>
      <div class="form-grid">
        <div class="field"><label for="k-name">Name *</label><input class="input" id="k-name" name="name" type="text" autocomplete="name" required data-required data-error-msg="Bitte Name und Telefon angeben."></div>
        <div class="field"><label for="k-tel">Telefon *</label><input class="input" id="k-tel" name="telefon" type="tel" autocomplete="tel" required data-required data-error-msg="Bitte Name und Telefon angeben."></div>
        <div class="field"><label for="k-beruf">Beruf</label><select class="select select--full" id="k-beruf" name="beruf"><option value="">Bitte wählen</option><option>Maler/-in</option><option>Anlagenmechaniker/-in SHK</option><option>Elektroniker/-in</option><option>Immobilienkaufmann/-frau</option><option>Ausbildung</option><option>Sonstiges</option></select></div>
        <div class="field"><label for="k-datei">Lebenslauf (optional)</label><input class="input" id="k-datei" name="lebenslauf" type="file" accept=".pdf,.doc,.docx,image/*" style="padding:10px"></div>
      </div>
      <p class="form-error" data-error role="alert" style="margin-top:12px"></p>
      <p class="form-note" style="margin:12px 0 20px">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zu. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
      <button class="btn btn--primary btn--block-mobile" type="submit">Bewerbung senden</button>
    </form>
    <div class="form-success" id="apply-done" hidden tabindex="-1"><strong>Danke für Ihre Bewerbung!</strong><span>Wir melden uns in den nächsten Tagen bei Ihnen.</span></div>
  </div>
  <div class="contact-person">${plainImg("avatar-2", "Ansprechpartner Karriere", "contact-person__img")}<strong>[Name]</strong><span class="muted">[Rolle] – beantwortet Ihre Fragen gern vorab.</span><a class="btn btn--outline" href="${site.phoneHref}">${site.phoneDisplay}</a><a class="btn btn--outline" href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp schreiben</a></div>
</div></section>`;
  page("/karriere", layout({ title: "Karriere", path: "/karriere", active: "karriere", description: "Jobs bei DMC Immobilien in Hamburg: Maler, Anlagenmechaniker SHK, Elektroniker, Immobilienkaufmann/-frau und Ausbildung. Fest angestellt in eigenen Teams.", body }));
}

// ===========================================================================
// Kontakt – mehrstufiges Formular mit Verzweigung nach Anliegen
// ===========================================================================
{
  const opts = [
    ["Komplettsanierung", icons.layers], ["Altbausanierung", "M4 21V10l8-6 8 6v11 M3 21h18 M10 21v-5h4v5"], ["Badsanierung", "M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z M6 12V6a2 2 0 0 1 4 0"],
    ["Malerarbeiten", "M3 3h14v6H3z M17 6h3v5h-8v3 M10.5 14h3v7h-3z"], ["Elektro", "M13 2L4 14h7l-1 8 9-12h-7l1-8z"], ["Sanitär & Heizung", "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"],
    ["Energetisch", "M3 11l9-7 9 7 M5 10v10h14V10"], ["Fenster & Türen", "M5 3h14v18H5z M12 3v18 M5 12h14"], ["Boden", "M4 4h16v16H4z M4 12h8V4 M12 20v-8h8"],
    ["Trockenbau", "M3 4h18v16H3z M9 4v16 M15 4v16"], ["Sonstiges", icons.plus]
  ];
  const zeit = ["So schnell wie möglich", "1–3 Monate", "3–6 Monate", "Noch offen"];
  const objektarten = ["Haus", "Wohnung", "Grundstück", "Gewerbe"];
  const plzAttrs = 'type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code" data-pattern="^\\d{5}$" data-error-msg="Bitte geben Sie eine gültige 5-stellige PLZ ein."';
  const fld = (id, label, name, attrs = 'type="number" inputmode="numeric" min="1"') => `<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" name="${name}" ${attrs}></div>`;
  const body = `
${pageHead({ crumbs: [["Kontakt"]], eyebrow: "Kontakt", heading: "Wie können wir helfen?", lead: `Sanierung, Neubau, Verkauf oder Suche – kostenlos &amp; unverbindlich · Rückmeldung innerhalb von ${site.response}` })}
<section class="section" style="padding-top:48px"><div class="container contact-grid">
  <form class="wizard" data-wizard data-branch-input="anliegen" data-submit-label="Anfrage senden" novalidate action="${site.formEndpoint}" method="post" enctype="multipart/form-data">
    <input type="hidden" name="formular" value="Kontaktanfrage">
    <div class="progress"><div class="progress__top"><span>Schritt <strong data-step-no>1</strong> von <span data-step-total>4</span></span><span data-step-name>Anliegen</span></div><div class="progress__bar"><div></div></div></div>

    <fieldset class="wizard__step" data-name="Anliegen">
      <legend>Worum geht es?</legend>
      <div class="option-grid option-grid--topics" data-choice="single" data-param="anliegen" data-require-choice data-error-msg="Bitte wählen Sie Ihr Anliegen."><input type="hidden" name="anliegen">${contactTopics.map(([l, sub, d, key, msg], i) => `<button type="button" class="option option--topic" data-value="${esc(l)}" data-key="${key}" data-msg="${esc(msg)}" aria-pressed="${i === 0}">${icon(d, { size: 26, stroke: "#5E6568" })}<span><strong>${l}</strong><span>${sub}</span></span></button>`).join("")}</div>
    </fieldset>

    <fieldset class="wizard__step" data-name="Details" data-branch="Sanierung" hidden>
      <legend>Was möchten Sie sanieren?</legend>
      <span class="form-note" style="margin-top:-14px">Mehrfachauswahl möglich</span>
      <div class="option-grid" data-choice="multi" data-param="leistung" data-implies="anliegen:sanierung" data-require-choice data-error-msg="Bitte wählen Sie mindestens eine Leistung." role="group" aria-label="Leistungen"><input type="hidden" name="leistungen">${opts.map(([l, d]) => `<button type="button" class="option" data-value="${esc(l)}" aria-pressed="${l === "Badsanierung"}">${icon(d, { size: 22, stroke: "#5E6568" })}${l}</button>`).join("")}</div>
      ${choiceField("Art des Objekts", "objekt", ["Haus", "Wohnung", "Gewerbe"], "Wohnung")}
      <div class="form-grid">${fld("f-qm", "Fläche ca. (m²)", "flaeche")}${fld("f-plz", "PLZ des Objekts", "plz", plzAttrs)}</div>
      ${choiceField("Wann soll es losgehen?", "zeitraum", zeit, "1–3 Monate")}
    </fieldset>

    <fieldset class="wizard__step" data-name="Details" data-branch="Neubau" hidden>
      <legend>Ihr Neubau-Vorhaben</legend>
      ${choiceField("Grundstück vorhanden?", "grundstueck", ["Ja", "Nein, wir suchen noch", "In Prüfung"], "Ja")}
      ${choiceField("Was möchten Sie bauen?", "haustyp", ["Einfamilienhaus", "Doppelhaus", "Mehrfamilienhaus", "Gewerbe"], "Einfamilienhaus")}
      <div class="form-grid">${fld("f-wfl", "Wohnfläche ca. (m²)", "wohnflaeche")}${fld("f-ort", "Ort / PLZ des Grundstücks", "grundstueck_ort", 'type="text"')}</div>
      ${choiceField("Wann soll es losgehen?", "zeitraum", zeit, "1–3 Monate")}
    </fieldset>

    <fieldset class="wizard__step" data-name="Details" data-branch="Verkaufen / Vermieten" hidden>
      <legend>Ihre Immobilie</legend>
      ${choiceField("Was haben Sie vor?", "ziel", ["Verkaufen", "Vermieten", "Erst bewerten lassen"], "Verkaufen")}
      ${choiceField("Objektart", "objektart", objektarten, "Haus")}
      <div class="form-grid">${fld("f-vfl", "Wohn-/Nutzfläche ca. (m²)", "flaeche")}${fld("f-vplz", "PLZ der Immobilie", "plz", plzAttrs)}</div>
      ${choiceField("Zeitraum", "zeitraum", zeit, "1–3 Monate")}
    </fieldset>

    <fieldset class="wizard__step" data-name="Details" data-branch="Immobilie suchen" hidden>
      <legend>Was suchen Sie?</legend>
      ${choiceField("Kaufen oder mieten?", "suche", ["Kaufen", "Mieten"], "Kaufen")}
      ${choiceField("Objektart", "objektart", objektarten, "Haus")}
      <div class="form-grid">${fld("f-sort", "Ort / Region", "region", 'type="text" placeholder="z. B. Alstertal, Blankenese"')}${fld("f-budget", "Budget bis (€)", "budget", 'type="text" inputmode="numeric" placeholder="Kaufpreis oder Monatsmiete"')}</div>
    </fieldset>

    <fieldset class="wizard__step" data-name="Beschreibung &amp; Fotos" hidden>
      <legend>Beschreibung &amp; Fotos</legend>
      <div class="field"><label for="f-msg">Was haben Sie vor? (optional)</label><textarea class="textarea" id="f-msg" name="nachricht" rows="5" data-msg-target placeholder="${esc(contactTopics[0][4])}"></textarea></div>
      <label class="upload" for="f-fotos">${icon(icons.upload, { size: 28, stroke: "#5E6568" })}<strong>Fotos hochladen (optional)</strong><span>bis zu 10 Bilder – direkt vom Handy</span><input id="f-fotos" name="fotos" type="file" multiple accept="image/*"><span class="upload__files" aria-live="polite"></span></label>
    </fieldset>

    <fieldset class="wizard__step" data-name="Kontakt" data-one-of="#f-tel,#f-mail" data-error-msg="Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an." hidden>
      <legend>Wie erreichen wir Sie?</legend>
      <div class="form-grid form-grid--3">
        <div class="field"><label for="f-name">Name *</label><input class="input" id="f-name" name="name" type="text" autocomplete="name" data-required data-error-msg="Bitte geben Sie Ihren Namen an."></div>
        <div class="field"><label for="f-tel">Telefon</label><input class="input" id="f-tel" name="telefon" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="f-mail">E-Mail</label><input class="input" id="f-mail" name="email" type="email" autocomplete="email"></div>
      </div>
      <span class="form-note">* Pflichtfeld · Telefon oder E-Mail – eines davon genügt.</span>
      ${choiceField("Bevorzugter Kontaktweg", "kontaktweg", ["Anruf", "WhatsApp", "E-Mail"], "Anruf")}
      <p class="form-note">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur Bearbeitung der Anfrage zu. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
    </fieldset>

    <div class="form-success" data-done hidden tabindex="-1">
      ${icon(icons.check, { size: 40, stroke: "#5E6568", width: 2.4 })}
      <strong>Danke für Ihre Anfrage!</strong>
      <span class="muted">Wir melden uns innerhalb von ${site.response} bei Ihnen. Ihr Ansprechpartner: ${site.contactName}, ${site.phoneDisplay}.</span>
      <button type="button" class="btn btn--outline" data-restart>Neue Anfrage</button>
    </div>

    <p class="form-error" data-error role="alert" style="margin-top:16px"></p>
    <div class="wizard__nav"><button type="button" class="btn btn--outline btn--back" data-back>← Zurück</button><button type="submit" class="btn btn--primary" data-next>Weiter →</button></div>
  </form>

  <aside class="contact-aside">
    ${plainImg("avatar-1", "Ihr Ansprechpartner", "contact-person__img")}
    <div><strong style="font-family:var(--serif);font-size:26px;color:var(--tiefsee)">${site.contactName}</strong><br><span class="muted">Ihr Ansprechpartner</span></div>
    <a class="btn btn--primary" href="${site.phoneHref}">${icon(icons.phone, { size: 18, width: 1.8 })}${site.phoneDisplay}</a>
    <a class="btn btn--outline" href="${site.whatsapp}" target="_blank" rel="noopener">${icon(icons.whatsapp, { size: 18, width: 1.8 })}WhatsApp schreiben</a>
    <dl><dt>E-Mail</dt><dd><a href="${site.emailHref}">${site.email}</a></dd><dt>Adresse</dt><dd>${site.street}, ${site.zip} ${site.city}</dd><dt>Erreichbar</dt><dd>${site.hours}</dd></dl>
  </aside>
</div></section>
<section class="section section--dark"><div class="container">
  <h2 class="h2" style="margin-bottom:28px">Was passiert nach Ihrer Anfrage?</h2>
  <ol class="mini-steps"><li><b>1</b><strong>Rückruf</strong><span>Innerhalb von ${site.response} – wir klären erste Fragen.</span></li><li><b>2</b><strong>Besichtigung</strong><span>Wir kommen vorbei, beraten und nehmen Maß.</span></li><li><b>3</b><strong>Angebot</strong><span>Schriftlich, mit allen Positionen und Zeitplan.</span></li></ol>
</div></section>
<section class="section"><div class="container grid-2">
  <div class="stack"><h2 class="h2">So finden Sie uns</h2><p class="lead">${site.legal}<br>${site.street}<br>${site.zip} ${site.city}</p><a class="link-arrow" href="https://www.google.com/maps/search/?api=1&amp;query=Am+Bronzeh%C3%BCgel+101+22399+Hamburg" target="_blank" rel="noopener">In Google Maps öffnen</a></div>
  ${hamburgMap()}
</div></section>`;
  page("/kontakt", layout({ title: "Kontakt & Anfrage", path: "/kontakt", active: "kontakt", description: "Sanierung, Neubau, Verkauf oder Suche: In wenigen Schritten kostenlos anfragen. Rückmeldung innerhalb von 24 Stunden – telefonisch, per WhatsApp oder E-Mail.", body }));
}

// ===========================================================================
// Bauvorhaben (gepflegt im Redaktionssystem /admin)
// ===========================================================================
{
  const cats = ["Alle", ...["In Planung", "Im Bau", "Fertiggestellt"].filter((c) => bauvorhaben.some((b) => b.status === c))];
  const body = `
${pageHead({ crumbs: [["Bauen &amp; Sanieren", "/leistungen"], ["Bauvorhaben"]], eyebrow: "Bauvorhaben", heading: "Unsere aktuellen Bauvorhaben", lead: "Neubau in Massivbauweise mit eigenen Handwerkern: Hier sehen Sie, woran wir gerade bauen – mit Baufortschritt, Eckdaten und Fotos von der Baustelle." })}
<section class="section" style="padding-top:48px"><div class="container">
  ${cats.length > 2 ? `<div class="chip-row chip-row--scroll" role="group" aria-label="Status filtern" style="margin-bottom:32px" data-filter-group data-filter-target="#bv-grid">${cats.map((c, i) => `<button type="button" class="chip" data-value="${c}" aria-pressed="${i === 0}">${c}</button>`).join("")}</div>` : ""}
  <div class="project-grid" id="bv-grid">${bauvorhaben.map(bvCard).join("")}</div>
  ${bauvorhaben.length ? "" : `<p class="lead">Neue Bauvorhaben stellen wir hier in Kürze vor.</p>`}
</div></section>
${ctaBand("Interesse an einem Neubau?", `Sprechen Sie uns an – wir informieren Sie über Grundrisse, Preise und den Zeitplan.`, "/kontakt?anliegen=neubau")}`;
  page("/bauvorhaben", layout({ title: "Aktuelle Bauvorhaben", path: "/bauvorhaben", active: "bauen", description: "Aktuelle Bauvorhaben von DMC Immobilien in Hamburg: Neubau von Doppelhaushälften und Wohnhäusern – mit Baufortschritt, Eckdaten und Fotos.", body }));
}
bauvorhaben.forEach((b) => {
  const offers = immobilien.filter((o) => o.bauvorhaben === b.slug);
  const updates = (b.updates || []).filter((u) => u.titel || u.text).sort((x, y) => String(y.datum).localeCompare(String(x.datum)));
  const facts = [["Ort", b.ort], ["Bauvorhaben", b.typ], ["Status", b.status], ["Fertigstellung", b.fertigstellung], ...(b.eckdaten || []).filter((e) => e.label).map((e) => [e.label, e.value])];
  const gal = (b.galerie || []).filter(Boolean);
  const body = `
<section class="section" style="padding-top:32px;padding-bottom:56px"><div class="container stack" style="gap:28px">
  ${breadcrumb([["Bauvorhaben", "/bauvorhaben"], [esc(b.title)]])}
  <div class="proj-head">
    <div class="stack"><span class="eyebrow">Bauvorhaben · ${esc(b.typ)}</span><h1 class="h1" style="font-size:calc(var(--h1) - 6px)">${esc(b.title)}</h1>${b.teaser ? `<p class="lead">${esc(b.teaser)}</p>` : ""}${b.status !== "Fertiggestellt" ? `<div class="bv-progress">${bvProgress(b.fortschritt)}</div>` : ""}</div>
    <dl class="fact-sheet">${facts.filter(([, v]) => v).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
  </div>
</div></section>
<section><div class="container">${ph(b.title + " Neubau", { img: b.titelbild || "neubau", h: "clamp(260px, 42vw, 580px)" })}</div></section>
<section class="section"><div class="container expose-layout">
  <div class="expose-main">
    <div class="stack stack--sm"><span class="eyebrow">Das Projekt</span><h2 class="h2" style="font-size:calc(var(--h2) - 6px)">Über das Bauvorhaben</h2><div class="cms-text lead">${md(b.beschreibung)}</div></div>
  </div>
  <aside class="expose-aside" aria-label="Informationen anfordern">${simpleForm({ id: "bv", subject: `Bauvorhaben ${b.title}`, heading: "Infos zu diesem Bauvorhaben anfordern", button: "Infos anfordern" })}</aside>
</div></section>
${updates.length ? `<section class="section section--sand"><div class="container container--narrow">
  <span class="eyebrow" style="margin-bottom:12px">Bautagebuch</span><h2 class="h2" style="margin-bottom:32px">Baufortschritt</h2>
  <ol class="bv-updates">${updates.map((u) => `<li><time datetime="${esc(u.datum)}">${dateDe(u.datum)}</time><div class="bv-updates__body"><strong>${esc(u.titel)}</strong>${md(u.text)}${u.bild ? ph(u.titel || b.title, { img: u.bild, h: "clamp(200px, 28vw, 340px)", attrs: ` data-lightbox="${esc(u.titel || b.title)}"` }) : ""}</div></li>`).join("")}</ol>
</div></section>` : ""}
${gal.length ? `<section class="section"><div class="container"><h2 class="h2" style="margin-bottom:28px">Galerie</h2><div class="photo-grid">${gal.map((g, k) => ph(`${b.title} – Foto ${k + 1}`, { img: g, attrs: ` data-lightbox="${esc(b.title)} – Foto ${k + 1}"` })).join("")}</div></div></section>` : ""}
${offers.length ? `<section class="section section--sand"><div class="container"><h2 class="h2" style="margin-bottom:28px">Verfügbare Einheiten</h2><div class="listing-grid">${offers.map((x) => listingCard(x, { plain: true })).join("")}</div></div></section>` : ""}
<section class="section section--tight-top" style="padding-top:48px"><div class="container"><div class="next-links">
  <a class="next-link" href="/bauvorhaben"><span>Übersicht</span><span>Alle Bauvorhaben →</span></a>
  <a class="next-link" href="/neubau"><span>Leistung</span><span>Neubau &amp; Projektierung →</span></a>
</div></div></section>
${lightbox}`;
  page(`/bauvorhaben/${b.slug}`, layout({ title: `Bauvorhaben ${b.title}`, path: `/bauvorhaben/${b.slug}`, active: "bauen", description: plain(b.teaser) || `${b.typ} in ${b.ort} – Bauvorhaben von DMC Immobilien.`, body }));
});

// ===========================================================================
// Neubau & Projektierung
// ===========================================================================
{
  const body = `
<section class="section section--sand" style="padding-top:32px"><div class="container stack" style="gap:28px">
  ${breadcrumb([["Bauen &amp; Sanieren", "/leistungen"], ["Neubau &amp; Projektierung"]])}
  <div class="grid-2">
    <div class="stack">
      <span class="eyebrow">Neubau &amp; Projektierung</span>
      <h1 class="h1" style="font-size:calc(var(--h1) - 4px)">Ihr neues Zuhause – massiv gebaut, sicher geplant.</h1>
      <p class="lead">Wir realisieren Ihr Bauvorhaben in traditioneller Massivbauweise: mit kurzer Bauzeit, festem Ansprechpartner und eigenen Handwerkern für den Ausbau.</p>
      <div class="hero__ctas"><a class="btn btn--primary btn--block-mobile" href="/kontakt?anliegen=neubau">Neubau-Projekt anfragen</a><a class="link-arrow" href="/referenzen/doppelhaus-stadtteil">Neubau-Referenzen</a></div>
    </div>
    <div class="media-first">${ph("Neubau Doppelhaus", { img: "neubau", h: "clamp(240px, 36vw, 480px)" })}</div>
  </div>
</div></section>
<section class="section"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Das übernehmen wir für Sie</h2>
  <div class="card-grid">${neubau.scope.map(([t, x, d]) => `<div class="card">${icon(d, { size: 28, stroke: "#5E6568" })}<strong>${t}</strong><span>${x}</span></div>`).join("")}</div>
</div></section>
<section class="section section--dark"><div class="container">
  <div class="section-head"><span class="eyebrow" style="margin-bottom:12px">Ablauf</span><h2 class="h2">Vom Grundstück bis zur Schlüsselübergabe.</h2></div>
  ${darkSteps(neubau.steps)}
</div></section>
${bauvorhaben.length ? `<section class="section"><div class="container">
  <div class="section-head section-head--row"><div><span class="eyebrow" style="margin-bottom:12px">Gerade im Bau</span><h2 class="h2">Aktuelle Bauvorhaben</h2></div><a class="link-arrow" href="/bauvorhaben">Alle Bauvorhaben</a></div>
  <div class="project-grid">${bauvorhaben.slice(0, 3).map(bvCard).join("")}</div>
</div></section>` : ""}
<section class="section${bauvorhaben.length ? " section--sand" : ""}"><div class="container">
  <div class="section-head section-head--row"><h2 class="h2">Von uns gebaut</h2><a class="link-arrow" href="/referenzen">Alle Referenzen</a></div>
  <div class="project-grid">${neubau.refs.map(([t, place, meta, img, href]) => `<a class="ref-card" href="${href}">${ph(t, { img })}<span class="ref-card__body"><span class="ref-card__tag">Neubau · ${place}</span><span class="ref-card__title">${t}</span><span class="ref-card__meta">${meta}</span></span></a>`).join("")}</div>
</div></section>
<section class="section${bauvorhaben.length ? "" : " section--sand"}"><div class="container container--narrow">
  <h2 class="h2" style="margin-bottom:24px">Häufige Fragen zum Neubau</h2>
  ${faq(neubau.faq)}
</div></section>
${ctaBand("Sie planen einen Neubau?", `Erzählen Sie uns von Ihrem Vorhaben – mit oder ohne Grundstück. Wir melden uns innerhalb von ${site.response}.`, "/kontakt?anliegen=neubau")}`;
  page("/neubau", layout({
    title: "Neubau & Projektierung in Hamburg", path: "/neubau", active: "bauen",
    description: "Neubau in Hamburg mit DMC Immobilien: Massivbau mit kurzer Bauzeit, festem Ansprechpartner und eigenen Handwerkern für den Ausbau – vom Grundstück bis zur Schlüsselübergabe.",
    body, schema: [faqSchema(neubau.faq), { "@context": "https://schema.org", "@type": "Service", name: "Neubau & Projektierung in Hamburg", areaServed: "Hamburg", provider: { "@type": "HomeAndConstructionBusiness", name: site.name } }]
  }));
}

// ===========================================================================
// Immobilien – aktuelle Angebote (gepflegt im Redaktionssystem /admin, Filter in main.js)
// ===========================================================================
{
  const regions = [...REGIONS, ...new Set(immobilien.map((o) => o.region).filter((r) => r && !REGIONS.includes(r)))];
  const body = `
${pageHead({ crumbs: [["Immobilien"]], eyebrow: "Immobilien", heading: "Aktuelle Angebote", lead: "Häuser, Wohnungen und Gewerbeflächen zur Miete und zum Kauf – in Hamburg, im Umland und ausgewählt im Ausland." })}
<section class="section" style="padding-top:48px"><div class="container">
  <form class="immo-filter" data-immo-filter data-target="#listing-grid" data-count="#listing-count" role="search" aria-label="Angebote filtern">
    <div class="seg" role="group" aria-label="Vermarktungsart">${["Alle", "Kaufen", "Mieten"].map((l, i) => `<button type="button" class="seg__btn" data-kind="${l === "Kaufen" ? "Kauf" : l === "Mieten" ? "Miete" : ""}" data-param-value="${l.toLowerCase()}" aria-pressed="${i === 0}">${l}</button>`).join("")}</div>
    <div class="immo-filter__fields">
      <div class="field"><label for="i-ort">Ort / Region</label><select class="select select--full" id="i-ort" name="region"><option value="">Alle Orte</option>${regions.map((r) => `<option>${esc(r)}</option>`).join("")}</select></div>
      <div class="field"><label for="i-art">Objektart</label><select class="select select--full" id="i-art" name="objektart"><option value="">Alle</option>${OBJEKTARTEN.map((t) => `<option>${t}</option>`).join("")}</select></div>
      <div class="field"><label for="i-preis">Preis bis</label><input class="input" id="i-preis" name="preis" type="text" inputmode="numeric" placeholder="z. B. 3.000 €"></div>
      <button class="btn btn--primary" type="submit">Suchen</button>
    </div>
  </form>
  <p class="listing-count" id="listing-count" aria-live="polite">${immobilien.length} ${immobilien.length === 1 ? "Angebot" : "Angebote"}</p>
  <div class="listing-grid" id="listing-grid">
    ${immobilien.map((o) => listingCard(o)).join("")}
  </div>
  <p class="muted" data-filter-empty ${immobilien.length ? "hidden " : ""}style="margin-top:24px">${immobilien.length ? "Für diese Auswahl gibt es gerade keine Angebote." : "Aktuell sind alle Objekte vergeben."} Legen Sie gern einen <a href="/kontakt?anliegen=suchen">Suchauftrag</a> an.</p>
</div></section>
<section class="section section--sand"><div class="container duo-boxes">
  <div class="duo-box">
    <h2>Nichts Passendes dabei?</h2>
    <p class="muted">Hinterlassen Sie einen Suchauftrag – wir melden uns, sobald ein passendes Objekt in die Vermarktung geht, oft noch bevor es online steht.</p>
    <a class="btn btn--primary btn--block-mobile" href="/kontakt?anliegen=suchen">Suchauftrag anlegen</a>
  </div>
  <div class="duo-box duo-box--dark">
    <h2>Sie möchten verkaufen oder vermieten?</h2>
    <p>Wir bewerten Ihre Immobilie kostenlos und finden über unser Netzwerk schnell passende Käufer oder Mieter.</p>
    <a class="btn btn--light btn--block-mobile" href="/immobilie-verkaufen">Immobilie bewerten lassen</a>
  </div>
</div></section>`;
  page("/immobilien", layout({ title: "Immobilien kaufen & mieten", path: "/immobilien", active: "immobilien", description: "Aktuelle Immobilienangebote von DMC Immobilien: Häuser, Wohnungen und Gewerbeflächen zur Miete und zum Kauf in Hamburg, im Umland und im Ausland.", body }));
}

// ===========================================================================
// Exposé-Seiten (eine pro Angebot)
// ===========================================================================
immobilien.forEach((o) => {
  const miete = o.vermarktung === "Miete";
  const e = o.energie || {};
  const bv = bauvorhaben.find((b) => b.slug === o.bauvorhaben);
  const imgs = [o.titelbild, ...(o.galerie || [])].filter(Boolean);
  const main = imgs[0] || "villa";
  const thumbs = imgs.slice(1, 5);
  const similar = [...immobilien.filter((x) => x !== o && x.vermarktung === o.vermarktung), ...immobilien.filter((x) => x !== o && x.vermarktung !== o.vermarktung)].slice(0, 3);
  const rows = (list) => list.filter(([, v]) => v !== "" && v != null).map(([t, v]) => `<div><dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`).join("");
  const facts = [[miete ? "Kaltmiete" : "Kaufpreis", euro(o.preis) || o.preisText || "auf Anfrage"], ["Wohnfläche", o.wohnflaeche], ["Nutzfläche", o.nutzflaeche], ["Zimmer", o.zimmer], ["Grundstück", o.grundstueck], ["Baujahr", o.baujahr], ["Verfügbar ab", o.verfuegbarAb], [miete ? "Nebenkosten" : "Hausgeld", euro(o.nebenkosten)], ["Kaution", miete ? o.kaution : ""], [miete ? "Provision" : "Käuferprovision", o.provision], ["Status", o.status !== "Verfügbar" ? o.status : ""]];
  const energy = [["Ausweistyp", e.ausweis], ["Energiekennwert", e.kennwert && `${e.kennwert} kWh/(m²·a)`], ["Energieträger", e.traeger], ["Baujahr", e.baujahrHeizung], ["Effizienzklasse", e.klasse]];
  const agentName = o.kontaktName || site.contactName;
  const agentTel = o.kontaktTelefon || site.phoneDisplay;
  const body = `
<section class="section" style="padding:28px 0 0"><div class="container stack" style="gap:16px">
  ${breadcrumb([["Immobilien", "/immobilien"], [esc(o.ort || o.title)]])}
  <div class="expose-gallery${thumbs.length ? "" : " expose-gallery--single"}">
    <div class="expose-gallery__main" data-lightbox="${esc(o.title)}">${plainImg(main, o.title)}</div>
    ${thumbs.length ? `<div class="expose-gallery__thumbs expose-gallery__thumbs--${thumbs.length}">
      ${thumbs.map((g, i) => `<div class="expose-gallery__thumb" data-lightbox="${esc(o.title)} – Foto ${i + 2}">${plainImg(g, `${o.title} – Foto ${i + 2}`)}${i === thumbs.length - 1 && imgs.length > 5 ? `<span class="expose-gallery__more">+ ${imgs.length - 5} weitere Fotos</span>` : ""}</div>`).join("")}
    </div>` : ""}
  </div>
</div></section>
<section class="section" style="padding-top:48px"><div class="container expose-layout">
  <div class="expose-main">
    <div class="stack stack--sm"><span class="eyebrow">${esc([o.vermarktung, o.ort].filter(Boolean).join(" · "))}</span><h1 class="h1 expose-main__h1">${esc(o.title)}</h1></div>
    <dl class="fact-grid">${rows(facts)}${"<div aria-hidden=\"true\"></div>".repeat((4 - (facts.filter(([, v]) => v !== "" && v != null).length % 4)) % 4)}</dl>
    ${o.beschreibung ? `<div class="stack stack--sm"><h2 class="h3">Objektbeschreibung</h2><div class="muted cms-text">${md(o.beschreibung)}</div></div>` : ""}
    ${(o.ausstattung || []).filter(Boolean).length ? `<div class="stack stack--sm"><h2 class="h3">Ausstattung</h2><ul class="feature-list">${o.ausstattung.filter(Boolean).map((f) => `<li>${esc(f)}</li>`).join("")}</ul></div>` : ""}
    ${o.lage ? `<div class="stack stack--sm"><h2 class="h3">Lage</h2><div class="muted cms-text">${md(o.lage)}</div></div>` : ""}
    ${energy.some(([, v]) => v) ? `<div class="stack stack--sm"><h2 class="h3">Energieausweis</h2><dl class="energy-list">${rows(energy)}</dl></div>` : ""}
    ${imgs.length > 5 ? `<div class="stack stack--sm"><h2 class="h3">Alle Fotos</h2><div class="photo-grid">${imgs.map((g, k) => ph(`${o.title} – Foto ${k + 1}`, { img: g, attrs: ` data-lightbox="${esc(o.title)} – Foto ${k + 1}"` })).join("")}</div></div>` : ""}
    ${bv ? `<a class="next-link" href="/bauvorhaben/${bv.slug}"><span>Teil des Bauvorhabens</span><span>${esc(bv.title)} →</span></a>` : ""}
  </div>
  <aside class="expose-aside" aria-label="Besichtigung anfragen">
    <div class="agent">${plainImg("avatar-2", "Ihr Ansprechpartner")}<div><span class="muted" style="font-size:13px">Ihr Ansprechpartner</span><strong>${esc(agentName)}</strong><a href="tel:${esc(agentTel.replace(/[^\d+]/g, "").replace(/^0/, "+49"))}">${esc(agentTel)}</a>${o.kontaktEmail ? `<a href="mailto:${esc(o.kontaktEmail)}">${esc(o.kontaktEmail)}</a>` : ""}</div></div>
    ${SOLD.includes(o.status) ? `<p class="muted">Dieses Objekt ist bereits ${o.status.toLowerCase()}. Legen Sie gern einen <a href="/kontakt?anliegen=suchen">Suchauftrag</a> an.</p>` : simpleForm({ id: "e", subject: `${o.title} (${o.ort})`, heading: "Besichtigung anfragen", done: `Wir melden uns innerhalb von ${site.response} mit Terminvorschlägen für die Besichtigung.` })}
    ${o.expose ? `<a class="link-arrow" href="${esc(o.expose)}" target="_blank" rel="noopener" style="justify-content:center">Exposé als PDF herunterladen</a>` : ""}
  </aside>
</div></section>
${similar.length ? `<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:24px">Ähnliche Angebote</h2>
  <div class="listing-grid">${similar.map((x) => listingCard(x, { plain: true })).join("")}</div>
</div></section>` : ""}
${lightbox}`;
  page(`/immobilien/${o.slug}`, layout({
    title: `${o.title} – ${o.vermarktung}`, path: `/immobilien/${o.slug}`, active: "immobilien",
    description: plain(o.teaser) || `${o.title}: ${o.vermarktung} in ${o.ort}, ${priceLabel(o)}. Exposé, Ausstattung, Lage und Besichtigungsanfrage bei DMC Immobilien.`, body,
    schema: [{ "@context": "https://schema.org", "@type": "RealEstateListing", name: o.title, url: `${site.url}/immobilien/${o.slug}`, ...(o.titelbild ? { image: site.url + imgSrc(o.titelbild) } : {}) }]
  }));
});

// ===========================================================================
// Immobilie verkaufen / vermieten – Bewertung (3-stufiges Formular in main.js)
// ===========================================================================
{
  const body = `
<section class="section section--sand" style="padding-top:32px"><div class="container">
  <div style="margin-bottom:28px">${breadcrumb([["Immobilien", "/immobilien"], ["Verkaufen &amp; bewerten"]])}</div>
  <div class="grid-2 grid-2--top">
    <div class="stack">
      <span class="eyebrow">Für Eigentümer</span>
      <h1 class="h1">Was ist Ihre Immobilie wert?</h1>
      <p class="lead">Kostenlose Ersteinschätzung in [48 Stunden] – und wenn Sie möchten, verkaufen oder vermieten wir Ihre Immobilie mit unserem Netzwerk in Hamburg und Umgebung.</p>
      <ul class="check-list check-list--col">${valuation.usps.map(check).join("")}</ul>
    </div>
    <form class="wizard" id="bewertung" data-wizard data-submit-label="Bewertung anfordern" novalidate action="${site.formEndpoint}" method="post">
      <input type="hidden" name="formular" value="Immobilienbewertung">
      <div class="progress"><div class="progress__top"><span>Schritt <strong data-step-no>1</strong> von <span data-step-total>3</span></span><span data-step-name>Objekt</span></div><div class="progress__bar"><div></div></div></div>
      <fieldset class="wizard__step" data-name="Objekt">
        <legend>Was möchten Sie bewerten lassen?</legend>
        <div class="option-grid option-grid--2" data-choice="single" data-param="art" role="group" aria-label="Objektart"><input type="hidden" name="objektart">${["Haus", "Wohnung", "Grundstück", "Gewerbe"].map((l, i) => `<button type="button" class="option option--lg" data-value="${l}" aria-pressed="${i === 0}">${l}</button>`).join("")}</div>
        <div class="field" role="group" aria-label="Ihr Ziel"><span class="label">Ihr Ziel</span><div class="option-row" data-choice="single" data-param="ziel"><input type="hidden" name="ziel">${["Verkaufen", "Vermieten", "Nur Wert wissen"].map((l, i) => `<button type="button" class="option" data-value="${l}" aria-pressed="${i === 0}">${l}</button>`).join("")}</div></div>
      </fieldset>
      <fieldset class="wizard__step" data-name="Eckdaten" hidden>
        <legend>Eckdaten</legend>
        <div class="form-grid">
          <div class="field"><label for="w-plz">PLZ *</label><input class="input" id="w-plz" name="plz" type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code" data-param="plz" data-required data-pattern="^\\d{5}$" data-error-msg="Bitte geben Sie eine gültige 5-stellige PLZ ein."></div>
          <div class="field"><label for="w-fl">Wohnfläche ca. (m²)</label><input class="input" id="w-fl" name="wohnflaeche" type="number" inputmode="numeric" min="1" data-param="flaeche"></div>
          <div class="field"><label for="w-gr">Grundstück ca. (m²)</label><input class="input" id="w-gr" name="grundstueck" type="number" inputmode="numeric" min="1"></div>
          <div class="field"><label for="w-bj">Baujahr</label><input class="input" id="w-bj" name="baujahr" type="number" inputmode="numeric" min="1800" max="2100"></div>
        </div>
      </fieldset>
      <fieldset class="wizard__step" data-name="Kontakt" data-one-of="#w-mail,#w-tel" data-error-msg="Bitte geben Sie eine E-Mail-Adresse oder Telefonnummer an." hidden>
        <legend>Wohin dürfen wir die Einschätzung schicken?</legend>
        <div class="field"><label for="w-name">Name *</label><input class="input" id="w-name" name="name" type="text" autocomplete="name" data-required data-error-msg="Bitte geben Sie Ihren Namen an."></div>
        <div class="form-grid">
          <div class="field"><label for="w-mail">E-Mail</label><input class="input" id="w-mail" name="email" type="email" autocomplete="email"></div>
          <div class="field"><label for="w-tel">Telefon</label><input class="input" id="w-tel" name="telefon" type="tel" autocomplete="tel"></div>
        </div>
        <span class="form-note">* Pflichtfeld · Telefon oder E-Mail – eines davon genügt.</span>
        <p class="form-note" style="font-size:13px">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zu. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
      </fieldset>
      <div class="form-success form-success--center" data-done hidden tabindex="-1">
        <strong>Danke! Wir melden uns.</strong>
        <span class="muted">Ihre kostenlose Ersteinschätzung erhalten Sie innerhalb von [48 Stunden].</span>
        <button type="button" class="btn btn--outline" data-restart>Neue Bewertung</button>
      </div>
      <p class="form-error" data-error role="alert" style="margin-top:16px"></p>
      <div class="wizard__nav"><button type="button" class="btn btn--outline btn--back" data-back>← Zurück</button><button type="submit" class="btn btn--primary" data-next>Weiter →</button></div>
    </form>
  </div>
</div></section>
<section class="section section--dark"><div class="container">
  <h2 class="h2" style="margin-bottom:36px">So verkaufen und vermieten wir Ihre Immobilie.</h2>
  ${darkSteps(valuation.steps, { cls: "steps--4" })}
</div></section>
<section class="section"><div class="container grid-2">
  ${ph("Beratung beim Eigentümer", { img: "vertrag", h: "clamp(240px, 32vw, 420px)" })}
  <div class="stack">
    <h2 class="h2">Warum mit DMC verkaufen?</h2>
    <ul class="plain-list">${valuation.why.map((w) => `<li>${w}</li>`).join("")}</ul>
    <a class="link-arrow" href="/immobilien">Unsere aktuellen Angebote</a>
  </div>
</div></section>
${ctaBand("Lieber direkt sprechen?", "Rufen Sie uns an – wir beraten Sie persönlich zu Verkauf, Vermietung und Bewertung.")}`;
  page("/immobilie-verkaufen", layout({ title: "Immobilie verkaufen, vermieten & bewerten", path: "/immobilie-verkaufen", active: "immobilien", description: "Was ist Ihre Immobilie wert? Kostenlose Ersteinschätzung von DMC Immobilien – und auf Wunsch Verkauf oder Vermietung mit unserem Netzwerk in Hamburg und Umgebung.", body }));
}

// ===========================================================================
// Hausverwaltung
// ===========================================================================
{
  const plan = (eyebrow, title, text, list, btn) => `<div class="plan">
      <span class="eyebrow">${eyebrow}</span>
      <h3 class="plan__title">${title}</h3>
      <p class="muted" style="font-size:15px">${text}</p>
      <ul class="plan__list">${list.map(([t, d]) => `<li>${icon(icons.check, { size: 20, stroke: "#8A6A33", width: 2.2 })}<span><strong>${t}</strong><span>${d}</span></span></li>`).join("")}</ul>
      <span class="plan__price">Vergütung: [Platzhalter, z. B. ab XX € je Einheit und Monat]</span>
      <a class="btn btn--primary btn--block-mobile" href="/kontakt">${btn}</a>
    </div>`;
  const body = `
<section class="section section--sand" style="padding-top:32px"><div class="container">
  <div style="margin-bottom:28px">${breadcrumb([["Immobilien", "/immobilien"], ["Hausverwaltung"]])}</div>
  <div class="grid-2">
    <div class="stack">
      <span class="eyebrow">Hausverwaltung</span>
      <h1 class="h1" style="font-size:calc(var(--h1) - 4px)">Ihre Immobilie in guten Händen – verwaltet und instand gehalten.</h1>
      <p class="lead">Wir verwalten Miethäuser und Eigentümergemeinschaften in Hamburg und Umgebung. Der Unterschied: Reparaturen und Sanierungen erledigen unsere eigenen Handwerker – schnell, ohne Umwege, aus einer Hand.</p>
      <div class="hero__ctas"><a class="btn btn--primary btn--block-mobile" href="/kontakt">Verwaltung anfragen</a><a class="link-arrow" href="#leistungen">Leistungen im Überblick</a></div>
      <ul class="check-list">${management.usps.map(check).join("")}</ul>
    </div>
    <div class="media-first">${ph("Verwaltetes Mehrfamilienhaus in Hamburg", { img: "villen", h: "clamp(240px, 36vw, 480px)" })}</div>
  </div>
</div></section>
<section class="trust" aria-label="Kennzahlen"><div class="container trust__grid trust__grid--stack">
  ${management.facts.map(([n, t]) => `<div class="trust__item"><strong>${n}</strong><span>${t}</span></div>`).join("")}
</div></section>
<section class="section" id="leistungen"><div class="container">
  <div class="section-head"><span class="eyebrow">Leistungen</span><h2 class="h2">Welche Verwaltung passt zu Ihrer Immobilie?</h2><p class="lead">Ob Sie ein Mehrfamilienhaus vermieten oder eine Eigentümergemeinschaft vertreten – wir übernehmen Verwaltung, Abrechnung und Instandhaltung.</p></div>
  <div class="plans">
    ${plan("Für Vermieter", "Mietverwaltung", "Für Eigentümer von Mehrfamilienhäusern und vermieteten Wohnungen, die sich nicht selbst um Mieter, Abrechnungen und Reparaturen kümmern möchten.", management.miet, "Mietverwaltung anfragen")}
    ${plan("Für Eigentümergemeinschaften", "WEG-Verwaltung", "Für Wohnungseigentümergemeinschaften, die eine zuverlässige Verwaltung mit klaren Abrechnungen und einem festen Ansprechpartner suchen.", management.weg, "WEG-Verwaltung anfragen")}
  </div>
</div></section>
<section class="section section--dark"><div class="container">
  <div class="grid-2">
    <div class="stack">
      <span class="eyebrow">Ihr Vorteil</span>
      <h2 class="h2">Verwaltung + eigene Handwerker = schnelle Reparaturen.</h2>
      <p class="lead lead--on-dark">Tropfender Wasserhahn, defekte Heizung, Schaden im Treppenhaus: Statt Angebote einzuholen und auf Fremdfirmen zu warten, schicken wir unsere eigenen Fachleute. Sie sehen jeden Auftrag transparent in der Abrechnung.</p>
    </div>
    ${ph("Handwerker auf der Baustelle", { img: "planung-helm", h: "clamp(240px, 28vw, 400px)" })}
  </div>
  <div class="dark-benefits">${management.benefits.map(([t, x, d]) => `<div>${icon(d, { size: 28, stroke: "#C7A56A" })}<strong>${t}</strong><span>${x}</span></div>`).join("")}</div>
</div></section>
<section class="section"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Verwalterwechsel – einfacher als gedacht.</h2>
  ${lightSteps(management.steps)}
</div></section>
<section class="section section--sand"><div class="container container--narrow">
  <h2 class="h2" style="margin-bottom:24px">Häufige Fragen zur Hausverwaltung</h2>
  ${faq(management.faq)}
</div></section>
${ctaBand("Sie suchen eine neue Hausverwaltung?", `Schicken Sie uns kurz Objekt, Anzahl der Einheiten und Ihre Wünsche. Wir melden uns innerhalb von ${site.response} mit einem Angebot.`)}`;
  page("/hausverwaltung", layout({ title: "Hausverwaltung in Hamburg", path: "/hausverwaltung", active: "immobilien", description: "Hausverwaltung in Hamburg: Mietverwaltung und WEG-Verwaltung von DMC Immobilien – mit eigenen Handwerkern für schnelle Reparaturen und transparenter Abrechnung.", body, schema: [faqSchema(management.faq)] }));
}

// ===========================================================================
// Impressum, Datenschutz, 404
// ===========================================================================
page("/impressum", layout({
  title: "Impressum", path: "/impressum", description: "Impressum von DMC Immobilien.", body: `
<section class="section"><div class="container container--read legal">
  ${breadcrumb([["Impressum"]])}
  <h1>Impressum</h1>
  <p><strong>${site.legal}</strong><br>${site.street}, ${site.zip} ${site.city}<br>Telefon: +49 (0) 40 22 63 19 620 · E-Mail: <a href="${site.emailHref}">${site.email}</a></p>
  <p><strong>Vertreten durch:</strong> ${site.managers} (Geschäftsführer)<br><strong>Handelsregister:</strong> ${site.hrb}<br><strong>Registergericht:</strong> Amtsgericht Hamburg<br><strong>USt-IdNr.:</strong> ${site.vatId}</p>
  <p><strong>Erlaubnis nach § 34c GewO</strong> (Immobilienmakler, Bauträger)<br><strong>Zuständige Aufsichtsbehörde:</strong> Bezirksamt Hamburg-Nord [Anschrift prüfen]</p>
  <p><strong>Handwerksrolle / Kammer:</strong> [nur falls Eintrag vorhanden – sonst Zeile streichen]</p>
  <p><strong>Verbraucherstreitbeilegung:</strong> [Hinweis gemäß Generator]</p>
  <p class="placeholder-note">[Texte per Generator (z. B. eRecht24) erstellen und hier einfügen.]</p>
</div></section>`
}));

page("/datenschutz", layout({
  title: "Datenschutzerklärung", path: "/datenschutz", description: "Datenschutzerklärung von DMC Immobilien.", body: `
<section class="section"><div class="container container--read legal">
  ${breadcrumb([["Datenschutz"]])}
  <h1>Datenschutzerklärung</h1>
  <ol><li>Verantwortlicher</li><li>Hosting</li><li>Kontakt- und Anfrageformular inkl. Foto-Upload</li><li>WhatsApp-Link</li><li>Instagram- und Google-Maps-Links</li><li>Statistik (z. B. Matomo)</li><li>Schriftarten (lokal eingebunden)</li><li>Ihre Rechte</li></ol>
  <p class="placeholder-note">[Rechtstext aus Generator mit Update-Service einfügen]</p>
  <h2>Schriftarten</h2>
  <p>Diese Website verwendet die Schriftarten „Archivo“, „Cormorant Garamond“ und „Jost“. Sie sind lokal auf unserem Server eingebunden; beim Aufruf der Seite wird keine Verbindung zu Servern Dritter (z. B. Google) hergestellt.</p>
  <h2>Cookies</h2>
  <p>Ihre Auswahl im Cookie-Banner speichern wir lokal in Ihrem Browser. Sie können sie jederzeit ändern: <button type="button" class="link-btn" style="color:var(--blau);text-decoration:underline" data-cookie-open>Cookie-Einstellungen öffnen</button>.</p>
</div></section>`
}));

const notFound = layout({
  title: "Seite nicht gefunden", path: "/404", noindex: true, description: "Diese Seite gibt es leider nicht (mehr).", body: `
<section><div class="container not-found">
  <span class="not-found__code">404</span>
  <h1 class="h1" style="font-size:var(--h2)">Hier wird gerade nichts saniert.</h1>
  <p class="lead">Die Seite gibt es leider nicht (mehr). Vielleicht hilft Ihnen einer dieser Wege weiter:</p>
  <form class="search-row" data-search role="search"><label class="visually-hidden" for="s-suche">Suche</label><input class="input" id="s-suche" type="search" placeholder="Suche, z. B. Badsanierung"><button class="btn btn--primary" type="submit" style="min-height:48px">Suchen</button></form>
  <div class="chip-row" style="justify-content:center"><a class="chip" href="/leistungen">Leistungen</a><a class="chip" href="/immobilien">Immobilien</a><a class="chip" href="/referenzen">Referenzen</a><a class="chip" href="/kontakt">Kontakt</a></div>
  <span class="muted">Oder rufen Sie uns an: <a href="${site.phoneHref}">${site.phoneDisplay}</a></span>
</div></section>`
});

// ===========================================================================
// Ausgabe
// ===========================================================================
if (existsSync(out)) rmSync(out, { recursive: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, "public"), out, { recursive: true });

for (const [path, html] of pages) {
  const file = path === "/" ? join(out, "index.html") : join(out, path.slice(1) + ".html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync(join(out, "404.html"), notFound);

// sitemap.xml & robots.txt
const urls = pages.map(([p]) => `  <url><loc>${site.url}${p === "/" ? "/" : p}</loc></url>`).join("\n");
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`✓ ${pages.length + 1} Seiten erzeugt in dist/`);
