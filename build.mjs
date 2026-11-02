// Bauwerk HH – statischer Seitengenerator
// Aufruf: node build.mjs  → erzeugt den Ordner dist/ (wird von Vercel ausgeliefert)
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  site, icons, services, serviceBySlug, projects, projectGallery, homeSteps, homeFaq, districts, areas,
  processSteps, promises, processFaq, team, values, benefits, jobs, articles
} from "./src/content.mjs";
import {
  layout, icon, check, ctaBand, pageHead, breadcrumb, ph, beforeAfter, faq, faqSchema, tile, refCard,
  quoteCard, lightbox, hamburgMap, sealFull, imageFor, afterFor
} from "./src/components.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "dist");
const pages = [];
const page = (path, html) => pages.push([path, html]);

// ===========================================================================
// Startseite
// ===========================================================================
{
  const feat = serviceBySlug["komplettsanierung"];
  const tiles = services.filter((s) => s.slug !== "komplettsanierung");
  const refs = [projects[0], projects[1], projects[2]];
  const body = `
<section class="hero"><div class="container grid-2">
  <div class="hero__text">
    <span class="eyebrow">Kernsanierung &amp; Neubau in Hamburg</span>
    <h1 class="h1" style="color:#C0262D">Sanierung in Hamburg – aus einer Hand, sauber und termintreu.</h1>
    <p class="lead">Wir sanieren Wohnungen und Häuser in Hamburg und Umgebung: komplett mit allen Gewerken oder genau das, was Sie brauchen – vom Bad bis zur Fassade.</p>
    <div class="hero__ctas"><a class="btn btn--primary btn--block-mobile" href="/kontakt">Kostenlos anfragen</a><a class="link-arrow" href="/referenzen">Referenzen ansehen</a></div>
    <ul class="check-list">${check("Fester Ansprechpartner")}${check("Schriftliches Angebot")}${check("[Meisterbetrieb – nur mit Nachweis]")}</ul>
  </div>
  <div class="media-first">${beforeAfter({ caption: "Echtes Projektfoto · [Stadtteil]" })}</div>
</div></section>

<section class="trust" aria-label="Vertrauen"><div class="container trust__grid">
  <div class="trust__item"><strong>★ ${site.rating}</strong><span>aus ${site.reviews} Google-Bewertungen</span></div>
  <div class="trust__item"><strong>[XXX]</strong><span>Projekte in Hamburg</span></div>
  <div class="trust__item"><strong>[XX] Jahre</strong><span>Erfahrung im Handwerk</span></div>
  <div class="trust__item badges"><span class="badge-box">HWK</span><span class="badge-box">Innung</span></div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head"><span class="eyebrow">Leistungen</span><h2 class="h2">Was dürfen wir für Sie sanieren?</h2><p class="lead">Ob ganze Wohnung oder einzelnes Gewerk: Sie bekommen alles aus einer Hand und einen festen Ansprechpartner.</p></div>
  <a class="feature-card" href="/leistungen/${feat.slug}">
    <span class="feature-card__body"><span class="eyebrow" style="color:var(--messing-hell)">Alles aus einer Hand</span><span class="feature-card__title">Komplettsanierung</span><span class="feature-card__text">Wohnung oder Haus komplett erneuern: Wir planen, koordinieren alle Gewerke und übergeben Ihnen ein fertiges Zuhause – mit einem Ansprechpartner und einem Zeitplan.</span><span class="feature-card__more">Mehr zur Komplettsanierung →</span></span>
    ${ph("Projektfoto Komplettsanierung", { tone: "blue", h: "100%" })}
  </a>
  <div class="tiles tiles--compact">${tiles.map((s) => tile(s)).join("")}</div>
</div></section>

<section class="section section--sand"><div class="container">
  <div class="section-head section-head--row"><div><span class="eyebrow" style="margin-bottom:12px">Referenzen</span><h2 class="h2">Vorher. Nachher. Hamburg.</h2></div><a class="link-arrow" href="/referenzen">Alle Referenzen</a></div>
  <div class="scroller">${refs.map((p) => refCard(p)).join("")}</div>
</div></section>

<section class="section"><div class="container grid-2">
  ${ph("Teamfoto auf der Baustelle (echtes Team, kein Stockfoto)", { h: "clamp(240px, 40vw, 520px)" })}
  <div class="stack" style="gap:28px">
    <div><span class="eyebrow" style="margin-bottom:12px">Warum Bauwerk HH</span><h2 class="h2">Handwerk, auf das Sie sich verlassen können.</h2></div>
    <div class="why-grid">
      <div class="why-item"><strong>Komplett aus einer Hand</strong><span>Ein Ansprechpartner koordiniert alle Gewerke und Termine.</span></div>
      <div class="why-item"><strong>Termintreue</strong><span>Ein verbindlicher Zeitplan, den wir gemeinsam mit Ihnen festlegen.</span></div>
      <div class="why-item"><strong>Saubere Baustelle</strong><span>Böden und Möbel geschützt, jeden Abend aufgeräumt.</span></div>
      <div class="why-item"><strong>Transparente Kosten</strong><span>Schriftliches Angebot mit klaren Positionen – ohne Überraschungen.</span></div>
    </div>
  </div>
</div></section>

<section class="section section--dark"><div class="container">
  <div class="section-head"><span class="eyebrow" style="margin-bottom:12px">Ablauf</span><h2 class="h2">In fünf Schritten zum fertigen Zuhause.</h2></div>
  <ol class="steps">${homeSteps.map(([t, x], i) => `<li><span class="steps__n">${i + 1}</span><span class="steps__body"><strong>${t}</strong><span class="steps__text">${x}</span></span></li>`).join("")}</ol>
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
    <p class="muted">Wir arbeiten in Hamburg und im Umland bis ca. [XX] km.</p>
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
    <p class="lead">Wir sind ein Hamburger Team aus [XX] Handwerkerinnen und Handwerkern. Vom ersten Termin bis zur Abnahme haben Sie einen festen Ansprechpartner – und wissen immer, wer bei Ihnen arbeitet.</p>
    <p class="signature">[Name], Inhaber</p>
    <a class="link-arrow" href="/ueber-uns">Lernen Sie uns kennen</a>
  </div>
</div></section>

<section class="section section--sand"><div class="container container--narrow">
  <h2 class="h2" style="margin-bottom:24px">Häufige Fragen</h2>
  ${faq(homeFaq)}
</div></section>

${ctaBand()}`;
  page("/", layout({
    title: "Startseite", path: "/", description: "Sanierung in Hamburg aus einer Hand: Komplettsanierung, Bad, Altbau, Maler, Elektro, Boden und mehr – mit festem Ansprechpartner und schriftlichem Angebot.",
    body, schema: [faqSchema(homeFaq)]
  }));
}

// ===========================================================================
// Leistungen – Übersicht
// ===========================================================================
{
  const feat = serviceBySlug["komplettsanierung"];
  const body = `
${pageHead({ crumbs: [["Leistungen"]], eyebrow: "Leistungen", heading: "Unsere Leistungen in Hamburg", lead: "Komplettsanierung oder einzelnes Gewerk – Sie bekommen alles aus einer Hand und einen festen Ansprechpartner." })}
<section class="section"><div class="container">
  <a class="feature-card" href="/leistungen/${feat.slug}">
    <span class="feature-card__body"><span class="eyebrow" style="color:var(--messing-hell)">Alles aus einer Hand</span><span class="feature-card__title">Komplettsanierung</span><span class="feature-card__text">${feat.intro}</span><span class="feature-card__more">Mehr zur Komplettsanierung →</span></span>
    ${ph("Projektfoto Komplettsanierung", { tone: "blue", h: "100%" })}
  </a>
  <div class="tiles">${services.filter((s) => s.slug !== "komplettsanierung").map((s) => tile(s)).join("")}</div>
</div></section>
${ctaBand("Nicht sicher, was Sie brauchen?", `Beschreiben Sie kurz Ihr Vorhaben – wir beraten Sie kostenlos und melden uns innerhalb von ${site.response}.`)}`;
  page("/leistungen", layout({ title: "Leistungen", path: "/leistungen", active: "leistung", description: "Alle Leistungen von Bauwerk HH: Komplettsanierung, Altbausanierung, Badsanierung, Malerarbeiten, Elektro, Sanitär & Heizung, energetische Sanierung, Fenster, Boden, Trockenbau.", body }));
}

// ===========================================================================
// Leistungsseiten (Vorlage für alle 10)
// ===========================================================================
for (const s of services) {
  const related = s.related.map((k) => serviceBySlug[k]);
  const formHref = `/kontakt?leistung=${encodeURIComponent(s.form)}`;
  const body = `
<section class="section" style="padding-top:32px"><div class="container stack" style="gap:28px">
  ${breadcrumb([["Leistungen", "/leistungen"], [s.title]])}
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
  <a class="btn btn--primary" href="${formHref}">Fotos senden</a>
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

${ctaBand(`${s.title} in Hamburg?`, `Schicken Sie uns ein paar Fotos und Ihre Wünsche. Wir melden uns innerhalb von ${site.response} und vereinbaren einen Termin vor Ort.`, formHref)}`;
  page(`/leistungen/${s.slug}`, layout({
    title: `${s.title} in Hamburg`, path: `/leistungen/${s.slug}`, active: "leistung",
    description: `${s.title} in Hamburg vom Fachbetrieb: ${s.teaser} Fester Ansprechpartner, schriftliches Angebot.`,
    body, schema: [faqSchema(s.faq), { "@context": "https://schema.org", "@type": "Service", name: `${s.title} in Hamburg`, areaServed: "Hamburg", provider: { "@type": "HomeAndConstructionBusiness", name: site.name } }]
  }));
}

// ===========================================================================
// Referenzen
// ===========================================================================
{
  const cats = ["Alle", "Komplettsanierung", "Bad", "Altbau", "Energetisch", "Maler", "Fenster", "Boden"];
  const body = `
${pageHead({ crumbs: [["Referenzen"]], eyebrow: "Referenzen", heading: "Unsere Projekte in Hamburg", lead: "[XX] abgeschlossene Sanierungen – mit echten Fotos, Stadtteil, Umfang und Dauer." })}
<section class="section" style="padding-top:48px"><div class="container">
  <div class="filter-bar">
    <div class="chip-row chip-row--scroll" role="group" aria-label="Projekte filtern" data-filter-group data-filter-target="#project-grid" data-filter-count="#project-count" data-filter-select="#ref-stadtteil">
      ${cats.map((c, i) => `<button type="button" class="chip" data-value="${c}" aria-pressed="${i === 0}">${c}</button>`).join("")}
    </div>
    <div class="filter-meta"><span id="project-count" aria-live="polite">${projects.length} Projekte</span>
      <label class="select-wrap" for="ref-stadtteil">Stadtteil <select class="select" id="ref-stadtteil"><option value="">Alle</option><option value="a">Altona</option><option value="e">Eimsbüttel</option><option value="w">Wandsbek</option></select></label>
    </div>
  </div>
  <div class="project-grid" id="project-grid">
    ${projects.map((p) => `<a class="ref-card" href="/referenzen/${p.slug}" data-cat="${p.cat}" data-area="${p.area}">${ph(p.title)}<span class="ref-card__body"><span class="ref-card__tag">${p.cat}</span><span class="ref-card__title">${p.title}</span><span class="ref-card__meta">${p.meta}</span></span></a>`).join("")}
  </div>
  <p class="muted" data-filter-empty hidden style="margin-top:24px">Für diese Auswahl gibt es noch keine Projekte. Bitte Filter anpassen.</p>
  <div class="center"><a class="btn btn--outline btn--block-mobile" href="/kontakt">Ihr Projekt anfragen</a></div>
</div></section>
${ctaBand("Ihr Projekt könnte das nächste sein.", `Erzählen Sie uns, was Sie vorhaben – wir melden uns innerhalb von ${site.response}.`)}`;
  page("/referenzen", layout({ title: "Referenzen", path: "/referenzen", active: "referenzen", description: "Referenzen von Bauwerk HH: abgeschlossene Sanierungen in Hamburg mit Vorher-Nachher-Fotos, Stadtteil, Umfang und Dauer.", body }));
}

// Projekt-Detailseiten
projects.forEach((p, i) => {
  const next = projects[(i + 1) % projects.length];
  const svc = serviceBySlug[p.service];
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
<section><div class="container">${beforeAfter({ h: "clamp(280px, 45vw, 620px)", caption: "Vorher / Nachher · Regler verschieben", after: afterFor(p) })}</div></section>
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
    <a class="next-link" href="/leistungen/${svc.slug}"><span>Passende Leistung</span><span>${svc.title} →</span></a>
    <a class="next-link" href="/referenzen/${next.slug}"><span>Nächstes Projekt</span><span>${next.title} →</span></a>
  </div>
  <div class="center"><a class="btn btn--primary btn--block-mobile" href="/kontakt?leistung=${encodeURIComponent(svc.form)}">Ähnliches Projekt anfragen</a></div>
</div></section>
${lightbox}`;
  page(`/referenzen/${p.slug}`, layout({ title: p.title, path: `/referenzen/${p.slug}`, active: "referenzen", description: `Referenzprojekt von Bauwerk HH: ${p.title} – ${p.gewerke}. Vorher-Nachher, Umfang und Dauer.`, body }));
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
  <div class="factor-box stack"><h2 class="h2" style="font-size:calc(var(--h2) - 8px)">Förderung mitdenken</h2><p class="muted">Für energetische Maßnahmen und barrierefreie Umbauten gibt es oft Zuschüsse oder günstige Kredite, z. B. über KfW oder BAFA. Wichtig: Viele Anträge müssen <strong>vor</strong> Auftragsvergabe gestellt werden. [Inhalte aktuell halten]</p><a class="link-arrow" href="/ratgeber/foerderung-energetische-sanierung">Zum Ratgeber Förderung</a></div>
  <div class="stack"><h2 class="h2" style="font-size:calc(var(--h2) - 8px)">Darauf können Sie sich verlassen</h2><ul class="check-list check-list--col">${promises.map(check).join("")}</ul></div>
</div></section>
<section class="section section--sand"><div class="container container--narrow"><h2 class="h2" style="margin-bottom:24px">Fragen zum Ablauf</h2>${faq(processFaq)}</div></section>
${ctaBand("Bereit für den ersten Schritt?", `Die Anfrage dauert zwei Minuten. Wir melden uns innerhalb von ${site.response} für einen Termin vor Ort.`)}`;
  page("/ablauf", layout({ title: "Ablauf", path: "/ablauf", active: "ablauf", description: "So läuft Ihre Sanierung mit Bauwerk HH ab: von der Anfrage über Besichtigung und Angebot bis zur Abnahme – mit festem Ansprechpartner.", body, schema: [faqSchema(processFaq)] }));
}

// ===========================================================================
// Über uns
// ===========================================================================
{
  const body = `
<section class="section" style="padding-top:32px"><div class="container stack" style="gap:28px">
  ${breadcrumb([["Über uns"]])}
  ${ph("Großes Teamfoto vor Firmenfahrzeug mit Logo", { tone: "dark", h: "clamp(240px, 40vw, 540px)" })}
  <div class="stack" style="max-width:860px"><h1 class="h1">Ihr Sanierungsbetrieb aus Hamburg.</h1><p class="lead">Menschen statt Floskeln: Hier lernen Sie das Team kennen, das bei Ihnen zu Hause arbeitet.</p></div>
</div></section>
<section class="section section--sand"><div class="container grid-2 grid-2--story">
  <div class="stack"><span class="eyebrow">Unsere Geschichte</span><h2 class="h2">Aus Hamburg, für Hamburg.</h2>
    <p class="lead">[Gründung: Wann und warum ist Bauwerk HH entstanden?]</p>
    <p class="lead">[Entwicklung: Vom ersten Auftrag bis heute – welche Gewerke kamen dazu, wie ist das Team gewachsen?]</p>
    <p class="lead">[Haltung: Was ist Ihnen wichtig? z. B. „Wir hinterlassen jede Baustelle so, wie wir selbst eine vorfinden möchten.“]</p>
    <p class="signature">[Name], Geschäftsführung</p></div>
  ${ph("Porträt Geschäftsführung", { h: "clamp(300px, 34vw, 480px)" })}
</div></section>
<section class="section section--dark" style="padding:64px 0"><div class="container numbers">
  <div><strong>[XX]</strong><span>Jahre Erfahrung</span></div><div><strong>[XXX]</strong><span>Projekte in Hamburg</span></div><div><strong>[XX]</strong><span>Mitarbeitende</span></div><div><strong>10</strong><span>Gewerke aus einer Hand</span></div>
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
    <div class="badge-row"><span class="badge-box">HWK Hamburg</span><span class="badge-box">Innung</span><span class="badge-box">[Zertifikat]</span></div>
    <ul class="plain-list"><li>[Meisterbrief: Gewerk, Name]</li><li>Eintrag in die Handwerksrolle: [Nr.]</li><li>Betriebshaftpflicht: [Versicherer]</li></ul></div>
  <div class="stack"><h2 class="h2" style="font-size:calc(var(--h2) - 8px)">Feste Partner</h2><p class="muted">Für einzelne Gewerke arbeiten wir mit eingespielten Partnerbetrieben – koordiniert von uns, mit einem Ansprechpartner für Sie.</p>
    <ul class="plain-list"><li>[Gewerk] – [Partner]</li><li>[Gewerk] – [Partner]</li><li>[Gewerk] – [Partner]</li></ul></div>
</div></section>
<section class="cta-band"><div class="container">
  <span class="cta-band__line" aria-hidden="true"></span><h2>Lernen Sie uns kennen.</h2><p>Ob als Kunde oder als neuer Kollege – wir freuen uns auf Sie.</p>
  <div class="cta-band__btns"><a class="btn btn--light" href="/kontakt">Projekt anfragen</a><a class="btn btn--outline-gold" href="/karriere">Karriere bei uns</a></div>
</div></section>`;
  page("/ueber-uns", layout({ title: "Über uns", path: "/ueber-uns", active: "ueber", description: "Bauwerk HH – Ihr Sanierungsbetrieb aus Hamburg. Lernen Sie das Team, unsere Arbeitsweise und unsere Qualifikationen kennen.", body }));
}

// ===========================================================================
// Einsatzgebiet
// ===========================================================================
{
  const body = `
${pageHead({ crumbs: [["Einsatzgebiet"]], eyebrow: "Einsatzgebiet", heading: "Unser Einsatzgebiet in Hamburg und Umgebung", lead: "Wir arbeiten in Hamburg und im Umland – bis ca. [XX] km rund um unseren Standort in [Stadtteil]." })}
<section class="section" style="padding-bottom:0"><div class="container">${hamburgMap()}</div></section>
<section class="section"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Gebiete &amp; Stadtteile</h2>
  <div class="areas">${areas.map(([t, parts, core]) => `<div class="area${core ? " area--core" : ""}"><div class="area__head"><strong>${t}</strong>${core ? '<span class="area__badge">Kerngebiet</span>' : ""}</div><span class="area__parts">${parts}</span><a class="link-arrow" href="/kontakt">Sanierung in ${t}</a></div>`).join("")}</div>
</div></section>
${ctaBand("Ihr Stadtteil fehlt?", `Fragen Sie trotzdem – oft finden wir eine Lösung. Wir melden uns innerhalb von ${site.response}.`)}`;
  page("/einsatzgebiet", layout({ title: "Einsatzgebiet", path: "/einsatzgebiet", description: "Bauwerk HH saniert in Hamburg – Altona, Eimsbüttel, Hamburg-Nord, Alstertal, Wandsbek, Mitte, Bergedorf – und im Umland.", body }));
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
    <h1 class="h1">Arbeiten bei Bauwerk HH.</h1>
    <p class="lead">Gutes Handwerk braucht gute Leute. Bei uns arbeiten Sie in festen Teams an abwechslungsreichen Projekten in ganz Hamburg.</p>
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
    <form class="wizard" data-apply novalidate action="${site.formEndpoint}" method="post" enctype="multipart/form-data">
      <h2 class="h2" style="font-size:calc(var(--h2) - 8px);margin-bottom:8px">In 2 Minuten bewerben</h2>
      <p class="muted" style="margin-bottom:24px">Ohne Anschreiben. Wir melden uns innerhalb weniger Tage.</p>
      <div class="form-grid">
        <div class="field"><label for="k-name">Name *</label><input class="input" id="k-name" name="name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="k-tel">Telefon *</label><input class="input" id="k-tel" name="telefon" type="tel" autocomplete="tel" required></div>
        <div class="field"><label for="k-beruf">Beruf</label><select class="select select--full" id="k-beruf" name="beruf"><option value="">Bitte wählen</option><option>Maler/-in</option><option>Anlagenmechaniker/-in SHK</option><option>Elektroniker/-in</option><option>Ausbildung</option><option>Sonstiges</option></select></div>
        <div class="field"><label for="k-datei">Lebenslauf (optional)</label><input class="input" id="k-datei" name="lebenslauf" type="file" accept=".pdf,.doc,.docx,image/*" style="padding:10px"></div>
      </div>
      <p class="form-error" data-error role="alert" style="margin-top:12px"></p>
      <p class="form-note" style="margin:12px 0 20px">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zu. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
      <button class="btn btn--primary btn--block-mobile" type="submit">Bewerbung senden</button>
    </form>
    <div class="form-success" id="apply-done" hidden tabindex="-1"><strong>Danke für Ihre Bewerbung!</strong><span>Wir melden uns in den nächsten Tagen bei Ihnen.</span></div>
  </div>
  <div class="contact-person"><span class="contact-person__img" aria-hidden="true"></span><strong>[Name]</strong><span class="muted">[Rolle] – beantwortet Ihre Fragen gern vorab.</span><a class="btn btn--outline" href="${site.phoneHref}">${site.phoneDisplay}</a><a class="btn btn--outline" href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp schreiben</a></div>
</div></section>`;
  page("/karriere", layout({ title: "Karriere", path: "/karriere", description: "Jobs bei Bauwerk HH in Hamburg: Maler, Anlagenmechaniker SHK, Elektroniker und Ausbildung. Feste Teams, gutes Werkzeug, kurze Wege.", body }));
}

// ===========================================================================
// Kontakt – mehrstufiges Formular
// ===========================================================================
{
  const opts = [
    ["Komplettsanierung", icons.layers], ["Altbausanierung", "M4 21V10l8-6 8 6v11 M3 21h18 M10 21v-5h4v5"], ["Badsanierung", "M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z M6 12V6a2 2 0 0 1 4 0"],
    ["Malerarbeiten", "M3 3h14v6H3z M17 6h3v5h-8v3 M10.5 14h3v7h-3z"], ["Elektro", "M13 2L4 14h7l-1 8 9-12h-7l1-8z"], ["Sanitär & Heizung", "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"],
    ["Energetisch", "M3 11l9-7 9 7 M5 10v10h14V10"], ["Fenster & Türen", "M5 3h14v18H5z M12 3v18 M5 12h14"], ["Boden", "M4 4h16v16H4z M4 12h8V4 M12 20v-8h8"],
    ["Trockenbau", "M3 4h18v16H3z M9 4v16 M15 4v16"], ["Sonstiges", icons.plus]
  ];
  const single = (name, list, def) => `<div class="option-row" data-choice="single"><input type="hidden" name="${name}">${list.map((l) => `<button type="button" class="option" data-value="${l}" aria-pressed="${l === def}">${l}</button>`).join("")}</div>`;
  const body = `
${pageHead({ crumbs: [["Kontakt"]], eyebrow: "Kontakt", heading: "Projekt anfragen", lead: `Kostenlos &amp; unverbindlich · Rückmeldung innerhalb von ${site.response}` })}
<section class="section" style="padding-top:48px"><div class="container contact-grid">
  <form class="wizard" data-wizard novalidate action="${site.formEndpoint}" method="post" enctype="multipart/form-data">
    <div class="progress"><div class="progress__top"><span>Schritt <strong data-step-no>1</strong> von 5</span><span data-step-name>Leistung</span></div><div class="progress__bar"><div></div></div></div>

    <fieldset class="wizard__step">
      <legend>Was möchten Sie sanieren?</legend>
      <span class="form-note" style="margin-top:-14px">Mehrfachauswahl möglich</span>
      <div class="option-grid" data-choice="multi"><input type="hidden" name="leistungen">${opts.map(([l, d]) => `<button type="button" class="option" data-value="${l}" aria-pressed="${l === "Badsanierung"}">${icon(d, { size: 22, stroke: "#5E6568" })}${l}</button>`).join("")}</div>
    </fieldset>

    <fieldset class="wizard__step" hidden>
      <legend>Ihr Objekt</legend>
      <div class="field"><span class="label">Art des Objekts</span>${single("objekt", ["Haus", "Wohnung", "Gewerbe"], "Wohnung")}</div>
      <div class="form-grid">
        <div class="field"><label for="f-qm">Fläche ca. (m²)</label><input class="input" id="f-qm" name="flaeche" type="number" inputmode="numeric" min="1"></div>
        <div class="field"><label for="f-plz">PLZ des Objekts *</label><input class="input" id="f-plz" name="plz" type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code"></div>
      </div>
      <div class="field"><span class="label">Baujahr (grob)</span>${single("baujahr", ["vor 1950", "1950–1980", "nach 1980", "weiß nicht"], "vor 1950")}</div>
    </fieldset>

    <fieldset class="wizard__step" hidden>
      <legend>Wann soll es losgehen?</legend>
      ${single("zeitraum", ["So schnell wie möglich", "1–3 Monate", "3–6 Monate", "Noch offen"], "1–3 Monate")}
    </fieldset>

    <fieldset class="wizard__step" hidden>
      <legend>Beschreibung &amp; Fotos</legend>
      <div class="field"><label for="f-msg">Was haben Sie vor? (optional)</label><textarea class="textarea" id="f-msg" name="nachricht" rows="5" placeholder="z. B. 3-Zimmer-Altbau, 80 m², neues Bad und neue Böden"></textarea></div>
      <label class="upload" for="f-fotos">${icon(icons.upload, { size: 28, stroke: "#5E6568" })}<strong>Fotos hochladen</strong><span>bis zu 10 Bilder – direkt vom Handy</span><input id="f-fotos" name="fotos" type="file" multiple accept="image/*"><span class="upload__files" aria-live="polite"></span></label>
    </fieldset>

    <fieldset class="wizard__step" hidden>
      <legend>Wie erreichen wir Sie?</legend>
      <div class="form-grid form-grid--3">
        <div class="field"><label for="f-name">Name *</label><input class="input" id="f-name" name="name" type="text" autocomplete="name"></div>
        <div class="field"><label for="f-tel">Telefon *</label><input class="input" id="f-tel" name="telefon" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="f-mail">E-Mail</label><input class="input" id="f-mail" name="email" type="email" autocomplete="email"></div>
      </div>
      <span class="form-note">* Telefon oder E-Mail genügt</span>
      <div class="field"><span class="label">Bevorzugter Kontaktweg</span>${single("kontaktweg", ["Anruf", "WhatsApp", "E-Mail"], "Anruf")}</div>
      <p class="form-note">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur Bearbeitung der Anfrage zu. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
    </fieldset>

    <div class="form-success" data-done hidden>
      ${icon(icons.check, { size: 40, stroke: "#5E6568", width: 2.4 })}
      <strong>Danke für Ihre Anfrage!</strong>
      <span class="muted">Wir melden uns innerhalb von ${site.response} bei Ihnen. Ihr Ansprechpartner: ${site.contactName}, ${site.phoneDisplay}.</span>
      <button type="button" class="btn btn--outline" data-restart>Neue Anfrage</button>
    </div>

    <p class="form-error" data-error role="alert" style="margin-top:16px"></p>
    <div class="wizard__nav"><button type="button" class="btn btn--outline btn--back" data-back>← Zurück</button><button type="submit" class="btn btn--primary" data-next>Weiter →</button></div>
  </form>

  <aside class="contact-aside">
    <span class="contact-person__img" aria-hidden="true"></span>
    <div><strong style="font-family:var(--serif);font-size:26px;color:var(--tiefsee)">${site.contactName}</strong><br><span class="muted">Ihr Ansprechpartner</span></div>
    <a class="btn btn--primary" href="${site.phoneHref}">${icon(icons.phone, { size: 18, width: 1.8 })}${site.phoneDisplay}</a>
    <a class="btn btn--outline" href="${site.whatsapp}" target="_blank" rel="noopener">${icon(icons.whatsapp, { size: 18, width: 1.8 })}WhatsApp schreiben</a>
    <dl><dt>E-Mail</dt><dd><a href="${site.emailHref}">${site.email}</a></dd><dt>Adresse</dt><dd>${site.street}, ${site.zip} ${site.city}</dd><dt>Erreichbar</dt><dd>${site.hours}</dd></dl>
  </aside>
</div></section>
<section class="section section--sand"><div class="container">
  <h2 class="h2" style="margin-bottom:32px">Was passiert nach Ihrer Anfrage?</h2>
  <ol class="mini-steps"><li><b>1</b><strong>Rückruf</strong><span>Innerhalb von ${site.response} – wir klären erste Fragen.</span></li><li><b>2</b><strong>Besichtigung</strong><span>Wir kommen vorbei, beraten und nehmen Maß.</span></li><li><b>3</b><strong>Angebot</strong><span>Schriftlich, mit allen Positionen und Zeitplan.</span></li></ol>
</div></section>
<section class="section"><div class="container grid-2">
  <div class="stack"><h2 class="h2">So finden Sie uns</h2><p class="lead">Bauwerk HH<br>${site.street}<br>${site.zip} ${site.city}</p><a class="link-arrow" href="https://www.google.com/maps/search/?api=1&query=Hamburg" target="_blank" rel="noopener">In Google Maps öffnen</a></div>
  ${ph("Statisches Kartenbild Firmensitz", { h: "320px" })}
</div></section>`;
  page("/kontakt", layout({ title: "Kontakt & Anfrage", path: "/kontakt", active: "kontakt", description: "Projekt kostenlos anfragen: In wenigen Schritten zur Sanierung in Hamburg. Rückmeldung innerhalb von 24 Stunden – telefonisch, per WhatsApp oder E-Mail.", body }));
}

// ===========================================================================
// Impressum, Datenschutz, 404
// ===========================================================================
page("/impressum", layout({
  title: "Impressum", path: "/impressum", description: "Impressum von Bauwerk HH.", body: `
<section class="section"><div class="container container--read legal">
  ${breadcrumb([["Impressum"]])}
  <h1>Impressum</h1>
  <p><strong>${site.legal}</strong><br>${site.street}, ${site.zip} ${site.city}<br>Telefon: ${site.phoneDisplay} · E-Mail: ${site.email}</p>
  <p><strong>Vertreten durch:</strong> [Geschäftsführer/-in]<br><strong>Registergericht:</strong> Amtsgericht Hamburg, [HRB-Nr.]<br><strong>USt-IdNr.:</strong> [DE…]</p>
  <p><strong>Berufsbezeichnung:</strong> [z. B. Maler- und Lackierermeister], verliehen in Deutschland<br><strong>Zuständige Kammer:</strong> Handwerkskammer Hamburg, [Adresse]<br><strong>Handwerksrolle:</strong> [Nr.] · Berufsrechtliche Regelung: Handwerksordnung</p>
  <p><strong>Verbraucherstreitbeilegung:</strong> [Hinweis gemäß Generator]</p>
  <p class="placeholder-note">[Texte per Generator (z. B. eRecht24) erstellen und hier einfügen.]</p>
</div></section>`
}));

page("/datenschutz", layout({
  title: "Datenschutzerklärung", path: "/datenschutz", description: "Datenschutzerklärung von Bauwerk HH.", body: `
<section class="section"><div class="container container--read legal">
  ${breadcrumb([["Datenschutz"]])}
  <h1>Datenschutzerklärung</h1>
  <ol><li>Verantwortlicher</li><li>Hosting</li><li>Kontakt- und Anfrageformular inkl. Foto-Upload</li><li>WhatsApp-Link</li><li>Statistik (z. B. Matomo)</li><li>Schriftarten (lokal eingebunden)</li><li>Ihre Rechte</li></ol>
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
  <div class="chip-row" style="justify-content:center"><a class="chip" href="/leistungen">Leistungen</a><a class="chip" href="/referenzen">Referenzen</a><a class="chip" href="/kontakt">Kontakt</a></div>
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
