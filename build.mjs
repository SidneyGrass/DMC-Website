// DMC Immobilien – statischer Seitengenerator
// Aufruf: node build.mjs  → erzeugt den Ordner dist/ (wird von Vercel ausgeliefert)
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  site, icons, services, serviceBySlug, projects, projectGallery, homeSteps, homeFaq, homeTopics, districts, areas,
  processSteps, promises, processFaq, team, values, benefits, jobs, articles, neubau, listings, expose, valuation,
  management, contactTopics
} from "./src/content.mjs";
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

// ===========================================================================
// Startseite
// ===========================================================================
{
  const tiles = services.filter((s) => s.slug !== "komplettsanierung");
  const refs = ["altbauwohnung-stadtteil", "familienbad-stadtteil", "reihenhaus-stadtteil"].map((k) => projects.find((p) => p.slug === k));
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
  <div class="scroller">${["[Stadtteil] · Badsanierung", "[Stadtteil] · Komplettsanierung", "[Stadtteil] · Malerarbeiten"].map(quoteCard).join("")}</div>
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
  const cats = ["Alle", "Neubau", "Komplettsanierung", "Bad", "Altbau", "Energetisch", "Maler", "Fenster", "Boden"];
  const body = `
${pageHead({ crumbs: [["Referenzen"]], eyebrow: "Referenzen", heading: "Unsere Projekte in Hamburg", lead: "[XX] abgeschlossene Neubauten und Sanierungen – mit echten Fotos, Stadtteil, Umfang und Dauer." })}
<section class="section" style="padding-top:48px"><div class="container">
  <div class="filter-bar">
    <div class="chip-row chip-row--scroll" role="group" aria-label="Projekte filtern" data-filter-group data-filter-target="#project-grid" data-filter-count="#project-count" data-filter-select="#ref-stadtteil">
      ${cats.map((c, i) => `<button type="button" class="chip" data-value="${c}" aria-pressed="${i === 0}">${c}</button>`).join("")}
    </div>
    <div class="filter-meta"><span id="project-count" aria-live="polite">${projects.length} Projekte</span>
      <label class="select-wrap" for="ref-stadtteil">Stadtteil <select class="select" id="ref-stadtteil"><option value="">Alle</option><option value="elb">Elbvororte (Ottensen–Blankenese)</option><option value="als">Alstertal</option><option value="a">Altona</option><option value="e">Eimsbüttel</option><option value="w">Wandsbek</option></select></label>
    </div>
  </div>
  <div class="project-grid" id="project-grid">
    ${projects.map((p) => `<a class="ref-card" href="/referenzen/${p.slug}" data-cat="${p.cat}" data-area="${p.area}">${ph(p.title, { img: p.img || "" })}<span class="ref-card__body"><span class="ref-card__tag">${p.cat}</span><span class="ref-card__title">${p.title}</span><span class="ref-card__meta">${p.meta}</span></span></a>`).join("")}
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
  const svc = p.service ? { ...serviceBySlug[p.service], href: `/leistungen/${p.service}`, ask: `/kontakt?leistung=${encodeURIComponent(serviceBySlug[p.service].form)}` } : { title: "Neubau & Projektierung", href: "/neubau", ask: "/kontakt?anliegen=neubau" };
  const body = `
<section class="section" style="padding-top:32px;padding-bottom:64px"><div class="container stack" style="gap:28px">
  ${breadcrumb([["Referenzen", "/referenzen"], [p.title]])}
  <div class="proj-head">
    <div class="stack"><span class="eyebrow">${svc.title}</span><h1 class="h1" style="font-size:calc(var(--h1) - 6px)">${p.h1}</h1></div>
    <dl class="fact-sheet">
      <div><dt>Stadtteil</dt><dd>[Stadtteil]</dd></div>
      <div><dt>Objekt</dt><dd>${p.objekt}</dd></div>
      <div><dt>Fläche / Umfang</dt><dd>${p.flaeche}</dd></div>
      <div><dt>Dauer</dt><dd>${p.dauer}</dd></div>
      <div><dt>Gewerke</dt><dd>${p.gewerke}</dd></div>
    </dl>
  </div>
</div></section>
<section><div class="container">${p.img ? ph(p.h1, { img: p.img, h: "clamp(280px, 45vw, 620px)" }) : beforeAfter({ h: "clamp(280px, 45vw, 620px)", caption: "Vorher / Nachher · Regler verschieben", after: afterFor(p) })}</div></section>
<section class="section"><div class="container grid-2 grid-2--top">
  <div class="stack"><span class="eyebrow">Ausgangslage</span><h2 class="h2" style="font-size:calc(var(--h2) - 6px)">Die Ausgangslage</h2><p class="lead">[2–3 Sätze: Zustand vorher, z. B. alte Elektrik, Bad aus den 70ern, abgenutzte Dielen. Was wollte der Kunde? z. B. Einzug in 8 Wochen, offene Küche, modernes Bad.]</p></div>
  <div class="stack"><span class="eyebrow">Umsetzung</span><h2 class="h2" style="font-size:calc(var(--h2) - 6px)">Was wir gemacht haben</h2><p class="lead">[Was gemacht wurde, Besonderheiten und Herausforderungen – z. B. Stuck erhalten, Leitungen unter Putz neu verlegt, Dielen aufgearbeitet statt ersetzt.]</p>
    <div class="duo">${ph("Baustelle: Detail 1", { tone: "dark", attrs: ' data-lightbox="Baustelle: Detail 1"' })}${ph("Baustelle: Detail 2", { tone: "dark", attrs: ' data-lightbox="Baustelle: Detail 2"' })}</div>
  </div>
</div></section>
<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:28px">Galerie</h2>
  <div class="photo-grid">${projectGallery.map((g) => ph(g, { attrs: ` data-lightbox="${g}"` })).join("")}</div>
</div></section>
<section class="section"><div class="container container--narrow">
  <figure class="quote-box" style="margin:0"><span class="stars" aria-label="5 von 5 Sternen">★★★★★</span><blockquote>„[Zitat des Kunden zu diesem Projekt einsetzen]“</blockquote><figcaption class="muted"><strong style="color:var(--text)">[Vorname N.]</strong> · Eigentümer/-in, [Stadtteil]</figcaption></figure>
</div></section>
<section class="section section--tight-top"><div class="container">
  <div class="next-links">
    <a class="next-link" href="${svc.href}"><span>Passende Leistung</span><span>${svc.title} →</span></a>
    <a class="next-link" href="/referenzen/${next.slug}"><span>Nächstes Projekt</span><span>${next.title} →</span></a>
  </div>
  <div class="center"><a class="btn btn--primary btn--block-mobile" href="${svc.ask}">Ähnliches Projekt anfragen</a></div>
</div></section>
${lightbox}`;
  page(`/referenzen/${p.slug}`, layout({ title: p.title, path: `/referenzen/${p.slug}`, active: "referenzen", description: `Referenzprojekt von DMC Immobilien: ${p.title} – ${p.gewerke}. ${p.img ? "Fotos" : "Vorher-Nachher"}, Umfang und Dauer.`, body }));
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
  const cats = ["Alle", "Kosten", "Altbau", "Bad", "Förderung", "Planung"];
  const body = `
${pageHead({ crumbs: [["Ratgeber"]], eyebrow: "Ratgeber", heading: "Wissen rund um Ihre Sanierung", lead: "Ehrliche Antworten auf die Fragen, die uns Kunden am häufigsten stellen – zu Kosten, Altbau, Bad, Förderung und Planung." })}
<section class="section" style="padding-top:48px"><div class="container">
  <div class="chip-row chip-row--scroll" role="group" aria-label="Kategorien" style="margin-bottom:32px" data-filter-group data-filter-target="#article-grid">
    ${cats.map((c, i) => `<button type="button" class="chip" data-value="${c}" aria-pressed="${i === 0}">${c}</button>`).join("")}
  </div>
  <div class="article-grid" id="article-grid">
    ${articles.map((a) => `<a class="article-card" href="/ratgeber/${a.slug}" data-cat="${a.cat}">${ph(a.title)}<span class="article-card__meta"><span>${a.cat}</span><span>${a.time}</span></span><span class="article-card__title">${a.title}</span><span class="article-card__teaser">${a.teaser}</span></a>`).join("")}
  </div>
</div></section>
${ctaBand("Ihre Frage ist nicht dabei?", `Fragen Sie uns direkt – wir beraten Sie kostenlos und melden uns innerhalb von ${site.response}.`)}`;
  page("/ratgeber", layout({ title: "Ratgeber", path: "/ratgeber", active: "ratgeber", description: "Ratgeber rund um Sanierung in Hamburg: Kosten, Altbau, Bad, Förderung und Planung – ehrlich erklärt vom Fachbetrieb.", body }));
}

// Artikel
articles.forEach((a) => {
  const svc = serviceBySlug[a.service];
  const others = articles.filter((x) => x.slug !== a.slug).slice(0, 2);
  const toc = a.sections.map(([t]) => t.replace(/^\d+\.\s*/, ""));
  const half = Math.ceil(a.sections.length / 2);
  const sect = a.sections.map(([t, paras, photo, kind], i) => {
    const h = /^\d+\./.test(t) ? t : `${i + 1}. ${t}`;
    let html = `<h2 id="abschnitt-${i + 1}">${h}</h2>`;
    if (kind === "table") {
      html += `<div class="table-wrap"><table class="table"><thead><tr><th>Posten</th><th>Kleines Bad (ca. [X] m²)</th><th>Großes Bad (ca. [X] m²)</th></tr></thead><tbody><tr><td>Demontage &amp; Entsorgung</td><td>[€]</td><td>[€]</td></tr><tr><td>Sanitär &amp; Elektro</td><td>[€]</td><td>[€]</td></tr><tr><td>Fliesen &amp; Abdichtung</td><td>[€]</td><td>[€]</td></tr><tr><td>Gesamt (Richtwert)</td><td>[€]</td><td>[€]</td></tr></tbody></table></div><p class="muted" style="font-size:15px">Richtwerte für Hamburg, Stand [MM/JJJJ]. Der genaue Preis hängt von Ihrem Bad ab.</p>`;
    } else {
      html += paras.map((p) => `<p>${p}</p>`).join("");
      if (photo) html += ph(photo, { h: "clamp(220px, 30vw, 340px)" });
    }
    if (i === half - 1) html += `<div class="inline-cta"><strong>Genaue Kosten für Ihr Projekt?</strong><span>Schicken Sie uns Fotos – wir geben Ihnen eine erste Einschätzung.</span><a class="btn btn--light" href="/kontakt?leistung=${encodeURIComponent(svc.form)}">Jetzt anfragen</a></div>`;
    return html;
  }).join("");
  const body = `
<article class="article-layout">
  <div class="article-body">
    ${breadcrumb([["Ratgeber", "/ratgeber"], [a.cat]])}
    <span class="eyebrow">${a.tags}</span>
    <h1>${a.title}</h1>
    <div class="author"><span class="author__img" aria-hidden="true"></span><span><strong>[Name]</strong>, [Rolle, z. B. Projektleitung]<br>Aktualisiert am [TT.MM.JJJJ] · ${a.time} Lesezeit</span></div>
    <div class="short-answer"><strong>Kurz gesagt</strong><p>${a.short}</p></div>
    <details class="toc"><summary>Inhalt</summary><ol>${toc.map((t, i) => `<li><a href="#abschnitt-${i + 1}">${t}</a></li>`).join("")}</ol></details>
    ${sect}
    <div class="article-faq"><h2>Häufige Fragen</h2>${faq(a.faq)}</div>
  </div>
  <aside class="sticky-cta" aria-label="Anfrage">
    <strong>${a.ctaTitle}</strong>
    <span>Kostenlose Besichtigung und schriftliches Angebot.</span>
    <a class="btn btn--primary" href="/kontakt?leistung=${encodeURIComponent(svc.form)}">Kostenlos anfragen</a>
    <a class="btn btn--outline" href="${site.phoneHref}">${site.phoneDisplay}</a>
  </aside>
</article>
<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:28px">Weiterlesen</h2>
  <div class="read-more">
    ${others.map((o) => `<a class="next-link" href="/ratgeber/${o.slug}"><span>${o.cat}</span><span>${o.title}</span></a>`).join("")}
    <a class="next-link" href="/leistungen/${svc.slug}"><span>Leistung</span><span>${svc.title} in Hamburg →</span></a>
  </div>
</div></section>`;
  page(`/ratgeber/${a.slug}`, layout({
    title: a.title, path: `/ratgeber/${a.slug}`, active: "ratgeber", description: a.teaser, body,
    schema: [faqSchema(a.faq), { "@context": "https://schema.org", "@type": "Article", headline: a.title, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } }]
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
  <div class="jobs">${jobs.map((j) => `<details><summary><span>${j.title}</span><span class="job-type">${j.type}</span></summary>
    <div class="job-body"><div><strong>Ihre Aufgaben</strong><ul>${j.tasks.map((t) => `<li>${t}</li>`).join("")}</ul></div><div><strong>Das bringen Sie mit</strong><ul>${j.profile.map((t) => `<li>${t}</li>`).join("")}</ul></div></div>
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
<section class="section"><div class="container">
  <div class="section-head section-head--row"><h2 class="h2">Von uns gebaut</h2><a class="link-arrow" href="/referenzen">Alle Referenzen</a></div>
  <div class="project-grid">${neubau.refs.map(([t, place, meta, img, href]) => `<a class="ref-card" href="${href}">${ph(t, { img })}<span class="ref-card__body"><span class="ref-card__tag">Neubau · ${place}</span><span class="ref-card__title">${t}</span><span class="ref-card__meta">${meta}</span></span></a>`).join("")}</div>
</div></section>
<section class="section section--sand"><div class="container container--narrow">
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
// Immobilien – aktuelle Angebote (Filter Kaufen/Mieten in main.js)
// ===========================================================================
const listingHref = (l) => (l.slug ? `/immobilien/${l.slug}` : `/kontakt?anliegen=suchen`);
{
  const body = `
${pageHead({ crumbs: [["Immobilien"]], eyebrow: "Immobilien", heading: "Aktuelle Angebote", lead: "Häuser, Wohnungen und Gewerbeflächen zur Miete und zum Kauf – in Hamburg, im Umland und ausgewählt im Ausland." })}
<section class="section" style="padding-top:48px"><div class="container">
  <form class="immo-filter" data-immo-filter data-target="#listing-grid" data-count="#listing-count" role="search" aria-label="Angebote filtern">
    <div class="seg" role="group" aria-label="Vermarktungsart">${["Alle", "Kaufen", "Mieten"].map((l, i) => `<button type="button" class="seg__btn" data-kind="${l === "Kaufen" ? "Kauf" : l === "Mieten" ? "Miete" : ""}" data-param-value="${l.toLowerCase()}" aria-pressed="${i === 0}">${l}</button>`).join("")}</div>
    <div class="immo-filter__fields">
      <div class="field"><label for="i-ort">Ort / Region</label><select class="select select--full" id="i-ort" name="region"><option value="">Alle Orte</option><option>Elbvororte</option><option>Alstertal</option><option>Hamburg (weitere)</option><option>Umland</option><option>Ausland</option></select></div>
      <div class="field"><label for="i-art">Objektart</label><select class="select select--full" id="i-art" name="objektart"><option value="">Alle</option><option>Haus</option><option>Wohnung</option><option>Grundstück</option><option>Gewerbe</option></select></div>
      <div class="field"><label for="i-preis">Preis bis</label><input class="input" id="i-preis" name="preis" type="text" inputmode="numeric" placeholder="z. B. 3.000 €"></div>
      <button class="btn btn--primary" type="submit">Suchen</button>
    </div>
  </form>
  <p class="listing-count" id="listing-count" aria-live="polite">${listings.length} Angebote</p>
  <div class="listing-grid" id="listing-grid">
    ${listings.map((l) => `<a class="listing" href="${listingHref(l)}" data-kind="${l.kind}" data-region="${esc(l.region)}" data-type="${esc(l.type)}" data-price="${l.priceNum}">
      <span class="listing__media">${plainImg(l.img, l.title)}<span class="listing__badge">${l.kind}</span></span>
      <span class="listing__body"><span class="ref-card__tag">${l.place}</span><span class="listing__title">${l.title}</span><span class="ref-card__meta">${l.facts}</span><span class="listing__price">${l.price}</span></span>
    </a>`).join("")}
  </div>
  <p class="muted" data-filter-empty hidden style="margin-top:24px">Für diese Auswahl gibt es gerade keine Angebote. Legen Sie gern einen <a href="/kontakt?anliegen=suchen">Suchauftrag</a> an.</p>
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
// Exposé (Beispiel: Exklusiv wohnen im schönen Sasel)
// ===========================================================================
{
  const l = listings.find((x) => x.slug === expose.slug);
  const similar = listings.filter((x) => x !== l && x.kind === "Miete").slice(0, 2).concat(listings.filter((x) => x.kind === "Kauf").slice(0, 1));
  const body = `
<section class="section" style="padding:28px 0 0"><div class="container stack" style="gap:16px">
  ${breadcrumb([["Immobilien", "/immobilien"], ["Hamburg-Sasel"]])}
  <div class="expose-gallery">
    <div class="expose-gallery__main" data-lightbox="Außenansicht des Hauses in Hamburg-Sasel">${plainImg(l.img, "Außenansicht des Hauses in Hamburg-Sasel")}</div>
    <div class="expose-gallery__thumbs">
      ${expose.thumbs.map(([t, img], i) => `<div class="expose-gallery__thumb" data-lightbox="${t}">${plainImg(img, t)}${i === expose.thumbs.length - 1 ? `<span class="expose-gallery__more">Alle Fotos · Grundriss</span>` : ""}</div>`).join("")}
    </div>
  </div>
</div></section>
<section class="section" style="padding-top:48px"><div class="container expose-layout">
  <div class="expose-main">
    <div class="stack stack--sm"><span class="eyebrow">${l.kind} · ${l.place}</span><h1 class="h1 expose-main__h1">${l.title}</h1></div>
    <dl class="fact-grid">${expose.facts.map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join("")}</dl>
    <div class="stack stack--sm"><h2 class="h3">Objektbeschreibung</h2><p class="muted">${expose.description}</p></div>
    <div class="stack stack--sm"><h2 class="h3">Ausstattung</h2><ul class="feature-list">${expose.features.map((f) => `<li>${f}</li>`).join("")}</ul></div>
    <div class="stack stack--sm"><h2 class="h3">Lage</h2><p class="muted">${expose.location}</p></div>
    <div class="stack stack--sm"><h2 class="h3">Energieausweis</h2><dl class="energy-list">${expose.energy.map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join("")}</dl></div>
  </div>
  <aside class="expose-aside" aria-label="Besichtigung anfragen">
    <div class="agent">${plainImg("avatar-2", "Ihr Ansprechpartner")}<div><span class="muted" style="font-size:13px">Ihr Ansprechpartner</span><strong>${site.contactName}</strong><a href="${site.phoneHref}">${site.phoneDisplay}</a></div></div>
    <h2 class="h3">Besichtigung anfragen</h2>
    <form class="stack stack--sm" data-simple-form data-success="#expose-done" novalidate action="${site.formEndpoint}" method="post">
      <input type="hidden" name="objekt" value="${esc(l.title)} (${esc(l.place)})">
      <div class="field"><label for="e-name">Name *</label><input class="input" id="e-name" name="name" type="text" autocomplete="name" data-required data-error-msg="Bitte geben Sie Ihren Namen an."></div>
      <div class="field"><label for="e-mail">E-Mail *</label><input class="input" id="e-mail" name="email" type="email" autocomplete="email" data-required data-error-msg="Bitte geben Sie Ihre E-Mail-Adresse an."></div>
      <div class="field"><label for="e-tel">Telefon</label><input class="input" id="e-tel" name="telefon" type="tel" autocomplete="tel"></div>
      <div class="field"><label for="e-msg">Nachricht</label><textarea class="textarea" id="e-msg" name="nachricht" rows="3" style="min-height:96px"></textarea></div>
      <p class="form-note" style="font-size:13px">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zu. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
      <p class="form-error" data-error role="alert"></p>
      <button class="btn btn--primary" type="submit">Anfrage senden</button>
    </form>
    <div class="form-success" id="expose-done" hidden tabindex="-1"><strong>Danke für Ihre Anfrage!</strong><span class="muted">Wir melden uns innerhalb von ${site.response} mit Terminvorschlägen für die Besichtigung.</span></div>
    <a class="link-arrow" href="#" rel="nofollow" style="justify-content:center">Exposé als PDF herunterladen [PDF einbinden]</a>
  </aside>
</div></section>
<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:24px">Ähnliche Angebote</h2>
  <div class="listing-grid">${similar.map((x) => `<a class="listing listing--plain" href="${listingHref(x)}"><span class="listing__media">${plainImg(x.img, x.title)}</span><span class="listing__body"><span class="ref-card__tag">${x.kind} · ${x.place.replace(/ \(.*\)$/, "")}</span><span class="listing__title">${x.title}</span><span class="listing__price">${x.price}</span></span></a>`).join("")}</div>
</div></section>
${lightbox}`;
  page(`/immobilien/${expose.slug}`, layout({ title: `${l.title} – ${l.kind}`, path: `/immobilien/${expose.slug}`, active: "immobilien", description: `${l.title}: ${l.kind} in ${l.place}, ${l.price}. Exposé, Ausstattung, Lage und Besichtigungsanfrage bei DMC Immobilien.`, body }));
}

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
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`✓ ${pages.length + 1} Seiten erzeugt in dist/`);
