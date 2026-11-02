/* Redaktionssystem DMC Immobilien – welche Bereiche und Felder gepflegt werden können.
   Neue Felder hier ergänzen und in build.mjs ausgeben. */
(function () {
  var SERVICES = [
    ["komplettsanierung", "Komplettsanierung"], ["altbausanierung", "Altbausanierung"], ["badsanierung", "Badsanierung"],
    ["malerarbeiten", "Malerarbeiten"], ["elektroarbeiten", "Elektroarbeiten"], ["sanitaer-heizung", "Sanitär & Heizung"],
    ["energetische-sanierung", "Energetische Sanierung"], ["fenster-tueren", "Fenster & Türen"], ["boden", "Boden"], ["trockenbau", "Trockenbau"]
  ];
  var BEZIRKE = ["Elbvororte", "Alstertal", "Altona", "Eimsbüttel", "Hamburg-Nord", "Wandsbek", "Hamburg-Mitte", "Bergedorf", "Harburg", "Umland"];
  var REGIONEN = ["Elbvororte", "Alstertal", "Hamburg (weitere)", "Umland", "Ausland"];
  var published = { key: "published", type: "toggle", label: "Auf der Website anzeigen", hint: "Aus = Entwurf, nur hier sichtbar", def: true };
  var order = { key: "order", type: "number", label: "Reihenfolge", hint: "Kleinere Zahl = weiter vorne", width: "s" };

  window.CMS_SCHEMA = {
    bauvorhaben: {
      label: "Bauvorhaben", one: "Bauvorhaben", icon: "M3 21h18 M5 21V9l7-5 7 5v12 M9 21v-6h6v6", path: "/bauvorhaben/",
      intro: "Neubauprojekte mit Baufortschritt und Bautagebuch. Neue Einträge im Bautagebuch halten die Seite aktuell.",
      columns: ["status", "fertigstellung"],
      fields: [
        { key: "title", type: "text", label: "Name / Adresse", required: true, placeholder: "z. B. Fichtenkamp 23" },
        published,
        { key: "typ", type: "text", label: "Art des Bauvorhabens", placeholder: "z. B. 6 Doppelhaushälften", width: "m" },
        { key: "ort", type: "text", label: "Ort", placeholder: "z. B. 22393 Hamburg-Sasel", width: "m" },
        { key: "status", type: "select", label: "Status", options: ["In Planung", "Im Bau", "Fertiggestellt"], width: "m" },
        { key: "fertigstellung", type: "text", label: "Fertigstellung", placeholder: "z. B. Q1 2027", width: "m" },
        { key: "fortschritt", type: "range", label: "Baufortschritt", min: 0, max: 100, step: 5, unit: "%" },
        { key: "teaser", type: "textarea", label: "Kurzbeschreibung", hint: "1–2 Sätze für die Übersicht und Google", rows: 2, max: 240 },
        { key: "titelbild", type: "image", label: "Titelbild" },
        { key: "beschreibung", type: "md", label: "Beschreibung", rows: 8 },
        { key: "eckdaten", type: "repeater", label: "Eckdaten", add: "Eckdatum hinzufügen", inline: true, fields: [
          { key: "label", type: "text", label: "Bezeichnung", placeholder: "z. B. Wohnfläche" },
          { key: "value", type: "text", label: "Wert", placeholder: "z. B. ca. 140 m²" }
        ] },
        { key: "updates", type: "repeater", label: "Bautagebuch", add: "Neuen Eintrag hinzufügen", addTop: true, hint: "Neuester Eintrag oben", fields: [
          { key: "datum", type: "date", label: "Datum", width: "m", today: true },
          { key: "titel", type: "text", label: "Überschrift", placeholder: "z. B. Richtfest gefeiert", width: "m" },
          { key: "text", type: "md", label: "Text", rows: 3 },
          { key: "bild", type: "image", label: "Foto (optional)" }
        ] },
        { key: "galerie", type: "images", label: "Galerie" },
        order
      ]
    },
    immobilien: {
      label: "Immobilien", one: "Immobilienangebot", icon: "M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-5h4v5", path: "/immobilien/",
      intro: "Angebote zum Kauf und zur Miete. Verkaufte oder vermietete Objekte entweder als „Verkauft/Vermietet“ markieren oder ausblenden.",
      columns: ["vermarktung", "status"],
      fields: [
        { key: "title", type: "text", label: "Titel des Angebots", required: true, placeholder: "z. B. Doppelhaushälfte mit Garten in Sasel" },
        published,
        { key: "vermarktung", type: "select", label: "Kauf oder Miete", options: ["Kauf", "Miete"], width: "s" },
        { key: "objektart", type: "select", label: "Objektart", options: ["Haus", "Doppelhaushälfte", "Reihenhaus", "Wohnung", "Gewerbe", "Grundstück"], width: "s" },
        { key: "status", type: "select", label: "Status", options: ["Verfügbar", "Reserviert", "Verkauft", "Vermietet"], width: "s", hint: "Reserviert/Verkauft erscheint als Hinweis auf dem Foto" },
        { key: "ort", type: "text", label: "Ort / Stadtteil (wird angezeigt)", placeholder: "z. B. Hamburg-Sasel", width: "m" },
        { key: "region", type: "select", label: "Region (für den Filter)", options: REGIONEN, width: "m" },
        { type: "heading", label: "Preis" },
        { key: "preis", type: "text", label: "Kaufpreis bzw. Kaltmiete (€)", placeholder: "z. B. 649000", width: "m", inputmode: "decimal" },
        { key: "preisText", type: "text", label: "Text, wenn kein Preis", placeholder: "auf Anfrage", width: "m" },
        { key: "nebenkosten", type: "text", label: "Nebenkosten bzw. Hausgeld (€)", width: "m", inputmode: "decimal" },
        { key: "kaution", type: "text", label: "Kaution (nur Miete)", placeholder: "z. B. 3 Kaltmieten", width: "m" },
        { key: "provision", type: "text", label: "Provision", placeholder: "z. B. provisionsfrei", width: "m" },
        { type: "heading", label: "Objektdaten" },
        { key: "wohnflaeche", type: "text", label: "Wohnfläche", placeholder: "z. B. ca. 145 m²", width: "s" },
        { key: "nutzflaeche", type: "text", label: "Nutzfläche", width: "s" },
        { key: "grundstueck", type: "text", label: "Grundstück", placeholder: "z. B. ca. 320 m²", width: "s" },
        { key: "zimmer", type: "text", label: "Zimmer", placeholder: "z. B. 5", width: "s" },
        { key: "baujahr", type: "text", label: "Baujahr", width: "s" },
        { key: "verfuegbarAb", type: "text", label: "Verfügbar ab", placeholder: "z. B. sofort", width: "s" },
        { key: "kurzinfo", type: "text", label: "Kurzinfo auf der Karte (optional)", placeholder: "z. B. 5 Zi. · 145 m² · Haus", hint: "Leer lassen = wird aus Zimmern, Fläche und Objektart gebildet" },
        { key: "teaser", type: "textarea", label: "Kurzbeschreibung für Google (optional)", rows: 2, max: 240 },
        { key: "titelbild", type: "image", label: "Titelbild" },
        { key: "galerie", type: "images", label: "Weitere Fotos", hint: "Die ersten 4 erscheinen neben dem Titelbild" },
        { key: "beschreibung", type: "md", label: "Objektbeschreibung", rows: 8 },
        { key: "ausstattung", type: "list", label: "Ausstattung", hint: "Ein Punkt pro Zeile" },
        { key: "lage", type: "md", label: "Lage", rows: 4 },
        { key: "energie", type: "group", label: "Energieausweis", hint: "Pflichtangaben in Immobilienanzeigen (GEG § 87)", fields: [
          { key: "ausweis", type: "select", label: "Art des Ausweises", options: ["", "Bedarfsausweis", "Verbrauchsausweis", "liegt zur Besichtigung vor", "nicht erforderlich (Neubau in Planung)"], width: "m" },
          { key: "kennwert", type: "text", label: "Endenergie (kWh/(m²·a))", width: "m" },
          { key: "klasse", type: "select", label: "Effizienzklasse", options: ["", "A+", "A", "B", "C", "D", "E", "F", "G", "H"], width: "s" },
          { key: "traeger", type: "text", label: "Wesentlicher Energieträger", placeholder: "z. B. Wärmepumpe (Strom)", width: "m" },
          { key: "baujahrHeizung", type: "text", label: "Baujahr (laut Ausweis)", width: "s" }
        ] },
        { key: "expose", type: "file", label: "Exposé (PDF, optional)" },
        { key: "bauvorhaben", type: "ref", label: "Gehört zum Bauvorhaben", collection: "bauvorhaben", width: "m" },
        { type: "heading", label: "Ansprechpartner (optional – sonst die allgemeinen Firmendaten)" },
        { key: "adresse", type: "text", label: "Genaue Adresse (intern, wird nicht angezeigt)", width: "full" },
        { key: "kontaktName", type: "text", label: "Name", width: "s" },
        { key: "kontaktTelefon", type: "text", label: "Telefon", width: "s" },
        { key: "kontaktEmail", type: "text", label: "E-Mail", width: "s" },
        order
      ]
    },
    ratgeber: {
      label: "Ratgeber / Blog", one: "Artikel", icon: "M4 4h12l4 4v12H4z M8 10h8 M8 14h8 M8 18h5", path: "/ratgeber/",
      intro: "Blog-Artikel mit Abschnitten, Bildern und FAQ. Gute Artikel beantworten eine konkrete Kundenfrage.",
      columns: ["cat", "date"],
      fields: [
        { key: "title", type: "text", label: "Überschrift", required: true, placeholder: "z. B. Was kostet eine Badsanierung in Hamburg?" },
        published,
        { key: "date", type: "date", label: "Datum (aktualisiert am)", width: "s", today: true },
        { key: "cat", type: "text", label: "Kategorie", options: ["Kosten", "Altbau", "Bad", "Förderung", "Planung", "Neubau", "Immobilien"], width: "s" },
        { key: "time", type: "text", label: "Lesezeit", placeholder: "z. B. 5 Min.", width: "s" },
        { key: "tags", type: "text", label: "Schlagworte (über der Überschrift)", placeholder: "z. B. Kosten · Bad", width: "m" },
        { key: "service", type: "select", label: "Passende Leistung (für Anfrage-Button)", options: SERVICES, width: "m" },
        { key: "teaser", type: "textarea", label: "Teaser", hint: "Für die Übersicht und Google (max. 160 Zeichen ideal)", rows: 2, max: 240 },
        { key: "cover", type: "image", label: "Vorschaubild" },
        { key: "short", type: "md", label: "Kurz gesagt", hint: "Die Antwort in 2–3 Sätzen", rows: 3 },
        { key: "sections", type: "repeater", label: "Abschnitte", add: "Abschnitt hinzufügen", fields: [
          { key: "heading", type: "text", label: "Zwischenüberschrift" },
          { key: "text", type: "md", label: "Text", rows: 6 },
          { key: "image", type: "image", label: "Bild (optional)", width: "m" },
          { key: "imageCaption", type: "text", label: "Bildunterschrift", width: "m" }
        ] },
        { key: "faq", type: "repeater", label: "Häufige Fragen", add: "Frage hinzufügen", fields: [
          { key: "q", type: "text", label: "Frage" },
          { key: "a", type: "textarea", label: "Antwort", rows: 2 }
        ] },
        { key: "ctaTitle", type: "text", label: "Überschrift im Anfrage-Kasten", placeholder: "z. B. Ihr Bad, Ihr Preis.", width: "m" },
        { key: "author", type: "text", label: "Autor/-in", width: "s" },
        { key: "authorRole", type: "text", label: "Rolle", placeholder: "z. B. Projektleitung", width: "s" },
        order
      ]
    },
    referenzen: {
      label: "Referenzen", one: "Referenz", icon: "M4 5h16v14H4z M4 15l4-4 4 4 3-3 5 5", path: "/referenzen/",
      intro: "Abgeschlossene Projekte mit Vorher-/Nachher-Fotos.",
      columns: ["cat", "bezirk"],
      fields: [
        { key: "title", type: "text", label: "Titel", required: true, placeholder: "z. B. Altbauwohnung Ottensen" },
        published,
        { key: "cat", type: "text", label: "Kategorie (Filter)", options: ["Neubau", "Komplettsanierung", "Bad", "Altbau", "Energetisch", "Maler", "Fenster", "Boden"], width: "s" },
        { key: "bezirk", type: "select", label: "Gebiet (Filter)", options: [""].concat(BEZIRKE), width: "s" },
        { key: "stadtteil", type: "text", label: "Stadtteil", placeholder: "z. B. Ottensen", width: "s" },
        { key: "service", type: "select", label: "Leistung", options: [["", "Neubau & Projektierung"]].concat(SERVICES), width: "m" },
        { key: "meta", type: "text", label: "Kurzinfo auf der Karte", placeholder: "z. B. 85 m² · 7 Wochen · alle Gewerke", width: "m" },
        { key: "h1", type: "text", label: "Überschrift auf der Projektseite", placeholder: "z. B. Altbauwohnung in Ottensen: aus 1920 wird heute." },
        { key: "objekt", type: "text", label: "Objekt", placeholder: "z. B. Altbauwohnung, Bj. 1920", width: "m" },
        { key: "flaeche", type: "text", label: "Fläche / Umfang", width: "m" },
        { key: "dauer", type: "text", label: "Dauer", width: "m" },
        { key: "gewerke", type: "text", label: "Gewerke", width: "m" },
        { key: "foto", type: "image", label: "Hauptfoto (z. B. bei Neubau)", hint: "Wenn gesetzt, wird statt Vorher/Nachher dieses Foto gezeigt" },
        { key: "vorher", type: "image", label: "Vorher-Foto", width: "m" },
        { key: "nachher", type: "image", label: "Nachher-Foto", width: "m" },
        { key: "ausgangslage", type: "md", label: "Die Ausgangslage", rows: 4 },
        { key: "umsetzung", type: "md", label: "Was wir gemacht haben", rows: 4 },
        { key: "detailbilder", type: "images", label: "Detailfotos (2)", max: 2 },
        { key: "galerie", type: "images", label: "Galerie" },
        order
      ]
    },
    bewertungen: {
      label: "Kundenstimmen", one: "Kundenstimme", icon: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z", path: "/",
      intro: "Erscheinen auf der Startseite (max. 6). Bitte nur echte Bewertungen mit Einverständnis der Kunden verwenden.",
      columns: ["meta", "sterne"],
      fields: [
        { key: "title", type: "text", label: "Name", required: true, placeholder: "z. B. Anna K." },
        published,
        { key: "meta", type: "text", label: "Stadtteil · Leistung", placeholder: "z. B. Ottensen · Badsanierung", width: "m" },
        { key: "sterne", type: "select", label: "Sterne", options: ["5", "4", "3", "2", "1"], width: "s" },
        { key: "text", type: "textarea", label: "Zitat", rows: 4, required: true },
        order
      ]
    },
    jobs: {
      label: "Stellenangebote", one: "Stelle", icon: "M4 8h16v11H4z M9 8V5h6v3", path: "/karriere",
      intro: "Offene Stellen auf der Karriere-Seite. Besetzte Stellen einfach ausblenden.",
      columns: ["type"],
      fields: [
        { key: "title", type: "text", label: "Stellenbezeichnung", required: true, placeholder: "z. B. Maler und Lackierer (m/w/d)" },
        published,
        { key: "type", type: "select", label: "Art", options: ["Vollzeit", "Teilzeit", "Minijob", "Ausbildung", "Praktikum"], width: "s" },
        { key: "tasks", type: "list", label: "Ihre Aufgaben", hint: "Ein Punkt pro Zeile" },
        { key: "profile", type: "list", label: "Das bringen Sie mit", hint: "Ein Punkt pro Zeile" },
        order
      ]
    },
    einstellungen: {
      label: "Firmendaten", one: "Firmendaten", single: true, icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19 12l2-1-1-3-2 .3-1.4-1.4.3-2-3-1-1 2h-2l-1-2-3 1 .3 2L5.9 8.3 4 8l-1 3 2 1v2l-2 1 1 3 2-.3 1.4 1.4-.3 2 3 1 1-2h2l1 2 3-1-.3-2 1.4-1.4 2 .3 1-3-2-1z",
      intro: "Kontaktdaten erscheinen auf allen Seiten (Kopfzeile, Fußzeile, Kontakt).",
      fields: [
        { type: "heading", label: "Kontakt" },
        { key: "phoneDisplay", type: "text", label: "Telefon", placeholder: "040 22 63 19 620", width: "m" },
        { key: "email", type: "text", label: "E-Mail", width: "m" },
        { key: "whatsapp", type: "text", label: "WhatsApp-Link", placeholder: "https://wa.me/49…", width: "m" },
        { key: "instagram", type: "text", label: "Instagram-Link", width: "m" },
        { key: "street", type: "text", label: "Straße", width: "m" },
        { key: "zip", type: "text", label: "PLZ", width: "s" },
        { key: "city", type: "text", label: "Ort", width: "s" },
        { key: "hours", type: "text", label: "Öffnungszeiten", placeholder: "Mo–Fr 7–17 Uhr", width: "m" },
        { key: "contactName", type: "text", label: "Ansprechpartner/-in", width: "m" },
        { key: "managers", type: "text", label: "Geschäftsführung (Impressum)", width: "m" },
        { type: "heading", label: "Versprechen & Bewertungen" },
        { key: "response", type: "text", label: "Rückmeldung innerhalb von (lang)", placeholder: "24 Stunden", width: "s" },
        { key: "responseShort", type: "text", label: "… (kurz)", placeholder: "24 h", width: "s" },
        { key: "rating", type: "text", label: "Google-Bewertung", placeholder: "4,9", width: "s" },
        { key: "reviews", type: "text", label: "Anzahl Bewertungen", placeholder: "37", width: "s" },
        { type: "heading", label: "Technik" },
        { key: "formEndpoint", type: "text", label: "Formular-Empfänger (URL)", hint: "z. B. Formspree-Adresse. „#“ = Formulare werden nicht versendet." }
      ]
    }
  };
  window.CMS_ORDER = ["bauvorhaben", "immobilien", "ratgeber", "referenzen", "bewertungen", "jobs", "einstellungen"];
})();
