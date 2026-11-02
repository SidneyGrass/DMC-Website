// Bauwerk HH – zentrale Inhalte
// Alle Angaben in [eckigen Klammern] und mit „[prüfen]“ vor dem Livegang mit echten Werten füllen.

export const site = {
  name: "Bauwerk HH",
  legal: "Bauwerk HH [Rechtsform]",
  url: "https://bauwerk-hh.vercel.app",
  phoneDisplay: "[040 000 000]",
  phoneHref: "tel:+490000000",
  whatsapp: "https://wa.me/490000000",
  email: "info@[domain].de",
  emailHref: "mailto:info@example.de",
  street: "[Straße Nr.]",
  zip: "[PLZ]",
  city: "Hamburg",
  hours: "Mo–Fr [7–17 Uhr]",
  response: "[24 Stunden]",
  responseShort: "[24 h]",
  rating: "[4,9]",
  reviews: "[XX]",
  contactName: "[Name]",
  // Formular-Endpunkt (z. B. Formspree/Getform). "#" = Demo ohne Versand.
  formEndpoint: "#"
};

export const icons = {
  check: "M5 12l5 5 9-10",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  whatsapp: "M4 20l1.3-4A8 8 0 1 1 8 18.7z",
  camera: "M4 8h3l2-3h6l2 3h3v11H4z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  upload: "M12 16V4 M7 9l5-5 5 5 M4 16v4h16v-4",
  layers: "M12 3l9 5-9 5-9-5 9-5z M3 13l9 5 9-5 M3 17.5l9 5 9-5",
  plus: "M12 5v14 M5 12h14",
  mail: "M3 6h18v12H3z M3 7l9 7 9-7",
  pin: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
};

// ---------------------------------------------------------------------------
// Leistungen
// ---------------------------------------------------------------------------
export const services = [
  {
    slug: "komplettsanierung", title: "Komplettsanierung", short: "Komplettsanierung", form: "Komplettsanierung",
    teaser: "Wohnung oder Haus komplett erneuern: Wir planen, koordinieren alle Gewerke und übergeben Ihnen ein fertiges Zuhause.",
    d: icons.layers,
    h1: "Komplettsanierung in Hamburg – alle Gewerke aus einer Hand.",
    intro: "Von der Elektrik bis zum letzten Anstrich: Wir sanieren Ihre Wohnung oder Ihr Haus komplett. Sie haben einen festen Ansprechpartner, einen verbindlichen Zeitplan und am Ende ein fertiges Zuhause.",
    bullets: ["Ein Ansprechpartner für alle Gewerke", "Schriftliches Angebot nach Besichtigung", "Typische Dauer: ca. [X–X] Wochen"],
    photo: "Projektfoto: komplett sanierte Altbauwohnung in Hamburg",
    scope: [
      ["Bestandsaufnahme & Planung", "Aufmaß, Zustand, Wünsche – daraus entsteht ein Gesamtplan mit Zeitachse."],
      ["Rückbau & Entsorgung", "Alte Böden, Fliesen, Leitungen und Einbauten raus, Schutt fachgerecht entsorgt."],
      ["Elektroinstallation", "Neue Leitungen, Unterverteilung, Steckdosen und Licht nach aktuellem Stand."],
      ["Sanitär & Heizung", "Wasser-, Abwasser- und Heizungsleitungen, Heizkörper, Anschlüsse."],
      ["Trockenbau & Grundriss", "Neue Wände, Decken, Durchbrüche [Statik prüfen] und Vorwände."],
      ["Bad & Küche", "Neues Bad komplett, Küchenanschlüsse vorbereitet."],
      ["Böden & Malerarbeiten", "Parkett, Vinyl oder Dielen, Wände und Decken gespachtelt und gestrichen."],
      ["Endreinigung & Übergabe", "Besenrein, mit Abnahmeprotokoll und Dokumentation."]
    ],
    galleryTitle: "Wohnungen und Häuser, die wir saniert haben",
    gallery: ["Altbauwohnung", "Einfamilienhaus", "Dachgeschoss", "Stadtwohnung", "Reihenhaus", "Etagenwohnung"],
    steps: [
      ["1 Termin", "Besichtigung & Beratung", "Wir sehen uns alles an und besprechen Ihre Wünsche."],
      ["ca. [X] Tage", "Planung & Angebot", "Gesamtplan, Zeitplan und schriftliches Angebot."],
      ["ca. [X] Tage", "Rückbau", "Alles raus, was erneuert wird – Treppenhaus geschützt."],
      ["ca. [X] Wochen", "Rohinstallation", "Elektro, Sanitär, Heizung und Trockenbau."],
      ["ca. [X] Wochen", "Ausbau", "Bad, Böden, Malerarbeiten, Türen."],
      ["1 Termin", "Abnahme", "Gemeinsamer Rundgang und Übergabe."]
    ],
    factors: [["Fläche & Grundriss", "Wohnfläche, Anzahl der Räume, Grundrissänderungen"], ["Zustand der Substanz", "Leitungen, Estrich, Feuchtigkeit, Altbau-Besonderheiten"], ["Ausstattung", "Bodenbeläge, Bad, Türen, Elektro-Komfort"], ["Umfang der Gewerke", "Was bleibt, was wird erneuert?"], ["Zeitrahmen", "Fester Einzugstermin, Arbeiten im bewohnten Zustand"]],
    funding: "Wenn Sie energetische Maßnahmen einplanen, kommen unter Umständen Förderprogramme infrage. [Aktuelle Programme prüfen und verlinken]",
    midCta: ["Grundriss schicken, Einschätzung erhalten.", "Ein Grundriss und ein paar Fotos genügen für eine erste Einschätzung."],
    quoteMeta: "[Stadtteil] · Komplettsanierung",
    faq: [
      ["Wie lange dauert eine Komplettsanierung?", "Je nach Größe und Zustand meist [X–X] Wochen. Den genauen Zeitplan erhalten Sie mit dem Angebot."],
      ["Muss ich während der Sanierung ausziehen?", "Bei einer Komplettsanierung ist die Wohnung in der Regel nicht bewohnbar. Wir planen die Bauzeit so, dass Sie verlässlich wissen, wann Sie wieder einziehen können."],
      ["Koordinieren Sie wirklich alle Handwerker?", "Ja. Ihr fester Ansprechpartner stimmt alle Gewerke und Termine ab – Sie müssen sich um nichts kümmern."],
      ["Bekomme ich einen Festpreis?", "Sie erhalten ein schriftliches Angebot mit allen Positionen. [Festpreis-Regelung prüfen]"]
    ],
    related: ["altbausanierung", "badsanierung", "energetische-sanierung"]
  },
  {
    slug: "altbausanierung", title: "Altbausanierung", short: "Altbausanierung", form: "Altbausanierung",
    teaser: "Altbau mit Charme erhalten und technisch auf heutigen Stand bringen.",
    d: "M4 21V10l8-6 8 6v11 M3 21h18 M10 21v-5h4v5 M15 6.5V4h2v4",
    h1: "Altbausanierung in Hamburg – Charme erhalten, Technik erneuern.",
    intro: "Stuck, Dielen, hohe Decken: Wir erhalten, was den Altbau ausmacht, und bringen Elektrik, Leitungen und Bäder auf den heutigen Stand. Mit Erfahrung in Hamburger Gründerzeit- und Nachkriegsbauten.",
    bullets: ["Erfahrung mit Hamburger Altbauten", "Schriftliches Angebot nach Besichtigung", "Typische Dauer: ca. [X–X] Wochen"],
    photo: "Projektfoto: Altbauwohnung mit Stuck und Dielen",
    scope: [
      ["Substanzprüfung", "Leitungen, Balkenlage, Feuchtigkeit und Putz – bevor geplant wird."],
      ["Elektrik erneuern", "Alte Leitungen raus, neue Verteilung, mehr Steckdosen."],
      ["Leitungen & Bad", "Steigleitungen, Anschlüsse und ein modernes Bad im Altbau."],
      ["Stuck & Putz", "Stuck erhalten oder ergänzen, Wände und Decken instand setzen."],
      ["Dielen & Parkett", "Aufarbeiten statt ersetzen – schleifen, ausbessern, ölen."],
      ["Holzfenster & Türen", "Kastenfenster und Kassettentüren aufarbeiten und lackieren."],
      ["Schallschutz", "Trittschall und Deckenaufbau verbessern [prüfen]."],
      ["Übergabe", "Besenrein, mit Abnahmeprotokoll und Pflegehinweisen."]
    ],
    galleryTitle: "Altbauten, die wir saniert haben",
    gallery: ["Gründerzeitwohnung", "Jugendstilwohnung", "Stuckdecke", "Dielenboden", "Kastenfenster", "Altbau-Bad"],
    steps: [
      ["1 Termin", "Besichtigung & Substanzcheck", "Wir prüfen, was erhalten werden kann."],
      ["ca. [X] Tage", "Planung & Angebot", "Plan mit allen Gewerken und schriftliches Angebot."],
      ["ca. [X] Tage", "Rückbau & Schutz", "Erhaltenswertes wird geschützt, der Rest rückgebaut."],
      ["ca. [X] Wochen", "Installation", "Elektro, Leitungen, Bad."],
      ["ca. [X] Wochen", "Aufarbeitung & Ausbau", "Stuck, Dielen, Fenster, Malerarbeiten."],
      ["1 Termin", "Abnahme", "Gemeinsamer Rundgang und Übergabe."]
    ],
    factors: [["Baujahr & Zustand", "Alter der Leitungen, Feuchtigkeit, Holzbalkendecken"], ["Erhalt oder Ersatz", "Stuck, Dielen und Fenster aufarbeiten oder erneuern"], ["Denkmalschutz", "Auflagen und Abstimmungen mit dem Amt [prüfen]"], ["Fläche & Raumhöhe", "Hohe Decken bedeuten mehr Wand- und Gerüstfläche"], ["Umfang", "Einzelne Räume oder die ganze Wohnung"]],
    funding: "Für energetische Verbesserungen am Altbau gibt es unter Umständen Zuschüsse. [Aktuelle Programme prüfen und verlinken]",
    midCta: ["Fotos schicken, Einschätzung erhalten.", "Ein paar Handyfotos von Leitungen, Böden und Fenstern genügen für den Anfang."],
    quoteMeta: "[Stadtteil] · Altbausanierung",
    faq: [
      ["Können Stuck und Dielen erhalten bleiben?", "In den meisten Fällen ja. Wir prüfen den Zustand bei der Besichtigung und sagen Ihnen ehrlich, was sich lohnt."],
      ["Was ist bei Denkmalschutz zu beachten?", "Bei denkmalgeschützten Gebäuden stimmen wir Maßnahmen vorab ab. [Vorgehen prüfen]"],
      ["Muss die alte Elektrik komplett raus?", "Oft ja, vor allem bei Leitungen ohne Schutzleiter. Das klären wir bei der Besichtigung."],
      ["Wie lange dauert eine Altbausanierung?", "Je nach Umfang meist [X–X] Wochen. Den genauen Zeitplan erhalten Sie mit dem Angebot."]
    ],
    related: ["komplettsanierung", "fenster-tueren", "boden"]
  },
  {
    slug: "badsanierung", title: "Badsanierung", short: "Badsanierung", form: "Badsanierung",
    teaser: "Altes Bad raus, neues Bad rein – geplant, gefliest, fertig.",
    d: "M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z M6 12V6a2 2 0 0 1 4 0 M7 19l-1 2 M17 19l1 2",
    h1: "Badsanierung in Hamburg – komplett aus einer Hand.",
    intro: "Wir erneuern Ihr Bad vom ersten Entwurf bis zur letzten Fuge. Sanitär, Elektro, Fliesen und Trockenbau koordinieren wir – Sie haben einen Ansprechpartner und einen festen Zeitplan.",
    bullets: ["Alle Gewerke koordiniert – ein Ansprechpartner", "Schriftliches Angebot nach Besichtigung", "Typische Dauer: ca. [X] Wochen"],
    photo: "Projektfoto: fertiges Bad aus Hamburg",
    scope: [
      ["Beratung & Planung", "Wünsche, Maße, Ausstattung – auf Wunsch mit 3D-Skizze [prüfen]."],
      ["Demontage & Entsorgung", "Altes Bad sauber raus, Schutt fachgerecht entsorgt."],
      ["Sanitärinstallation", "Neue Wasser- und Abwasserleitungen, Vorwandinstallation."],
      ["Elektro", "Licht, Steckdosen, Spiegelschrank und Lüftung."],
      ["Abdichtung & Fliesen", "Normgerechte Abdichtung, Fliesen in Ihrem Wunschformat."],
      ["Trockenbau", "Vorwände, Ablagen und Nischen nach Maß."],
      ["Montage", "Dusche, Wanne, WC, Waschtisch und Armaturen."],
      ["Endreinigung & Übergabe", "Besenrein, mit Abnahmeprotokoll und Pflegehinweisen."]
    ],
    galleryTitle: "Bäder, die wir saniert haben",
    gallery: ["Duschbad", "Familienbad", "Gäste-WC", "Barrierefrei", "Altbau-Bad", "Dachgeschoss"],
    steps: [
      ["1 Termin", "Besichtigung & Beratung", "Wir sehen uns Ihr Bad an und besprechen Ihre Wünsche."],
      ["ca. [X] Tage", "Planung & Angebot", "Sie erhalten Plan und schriftliches Angebot."],
      ["ca. [X] Tage", "Demontage", "Rückbau bis auf den Rohbau, Schutz der Wohnung."],
      ["ca. [X] Tage", "Installation", "Leitungen, Elektro, Vorwände und Abdichtung."],
      ["ca. [X] Tage", "Fliesen & Montage", "Fliesen, Sanitärobjekte und Armaturen."],
      ["1 Termin", "Abnahme", "Gemeinsamer Rundgang und Übergabe."]
    ],
    factors: [["Größe des Bades", "Fläche und Raumhöhe"], ["Ausstattung", "Dusche, Wanne, Armaturen, Fliesenformat"], ["Zustand im Altbau", "alte Leitungen, Untergrund, Abdichtung"], ["Barrierefreiheit", "bodengleiche Dusche, breitere Türen"], ["Grundriss", "bleiben Anschlüsse, wo sie sind?"]],
    funding: "Für barrierefreie Umbauten gibt es unter Umständen Zuschüsse. [Aktuelle Programme prüfen und verlinken]",
    midCta: ["Fotos schicken, Einschätzung erhalten.", "Ein paar Handyfotos von Ihrem Bad genügen für eine erste Einschätzung."],
    quoteMeta: "[Stadtteil] · Badsanierung",
    faq: [
      ["Wie lange dauert eine Badsanierung?", "Meist [X–X] Wochen, je nach Größe und Umfang. Den genauen Zeitplan erhalten Sie mit dem Angebot."],
      ["Kann ich das Bad während der Sanierung nutzen?", "Nein, in dieser Zeit ist das Bad nicht nutzbar. Wir besprechen mit Ihnen Übergangslösungen [prüfen]."],
      ["Kümmern Sie sich auch um Elektro und Fliesen?", "Ja. Alle Gewerke kommen aus einer Hand – Sie haben einen Ansprechpartner."],
      ["Kann ich Fliesen und Armaturen selbst aussuchen?", "Selbstverständlich. Wir beraten Sie und zeigen Muster [Ausstellung/Partner prüfen]."],
      ["Was passiert mit dem Schutt?", "Wir entsorgen alles fachgerecht – das ist im Angebot enthalten."]
    ],
    related: ["sanitaer-heizung", "trockenbau", "komplettsanierung"]
  },
  {
    slug: "malerarbeiten", title: "Malerarbeiten", short: "Malerarbeiten", form: "Malerarbeiten",
    teaser: "Wände, Decken, Fassaden und Holzfenster – sauber gestrichen und lackiert.",
    d: "M3 3h14v6H3z M17 6h3v5h-8v3 M10.5 14h3v7h-3z",
    h1: "Malerarbeiten in Hamburg – sauber gestrichen, ordentlich hinterlassen.",
    intro: "Wände und Decken, Treppenhäuser, Fassaden und Holzfenster: Wir spachteln, streichen und lackieren – mit abgeklebten Kanten, geschützten Böden und einer Baustelle, die jeden Abend aufgeräumt ist.",
    bullets: ["Böden und Möbel geschützt", "Schriftliches Angebot nach Besichtigung", "Typische Dauer: ca. [X] Tage pro Wohnung"],
    photo: "Projektfoto: frisch gestrichenes Treppenhaus",
    scope: [
      ["Beratung & Farbwahl", "Farbtöne, Glanzgrad und geeignete Farben für jeden Raum."],
      ["Abdecken & Schützen", "Böden, Möbel und Fenster sorgfältig abgedeckt."],
      ["Spachteln & Schleifen", "Risse, Löcher und Unebenheiten glatt gespachtelt."],
      ["Tapezieren", "Raufaser, Vlies oder Glattvlies – auch Tapeten entfernen."],
      ["Streichen", "Wände und Decken, auch hohe Altbaudecken."],
      ["Lackieren", "Türen, Zargen, Heizkörper und Holzfenster schleifen und lackieren."],
      ["Fassade & Treppenhaus", "Außenanstrich und Treppenhäuser für Eigentümergemeinschaften."],
      ["Reinigung & Übergabe", "Abgeklebtes entfernt, alles sauber hinterlassen."]
    ],
    galleryTitle: "Räume, die wir gestrichen haben",
    gallery: ["Treppenhaus", "Wohnzimmer", "Holzfenster", "Fassade", "Altbaudecke", "Kinderzimmer"],
    steps: [
      ["1 Termin", "Besichtigung & Aufmaß", "Wir sehen uns Flächen und Untergründe an."],
      ["ca. [X] Tage", "Angebot", "Schriftlich, mit Flächen und Materialien."],
      ["½ Tag", "Abdecken", "Möbel und Böden geschützt."],
      ["ca. [X] Tage", "Vorarbeiten", "Spachteln, Schleifen, Grundieren."],
      ["ca. [X] Tage", "Anstrich & Lack", "Zwei Anstriche, Lackarbeiten."],
      ["1 Termin", "Abnahme", "Rundgang und saubere Übergabe."]
    ],
    factors: [["Fläche", "Wand- und Deckenfläche, Raumhöhe"], ["Untergrund", "Risse, alte Tapeten, Feuchtigkeitsschäden"], ["Material", "Farbqualität, Tapetenart, Lack"], ["Holzfenster & Türen", "Anzahl und Zustand der Lackflächen"], ["Zugänglichkeit", "Treppenhaus, Gerüst, bewohnte Räume"]],
    funding: "Bei Fassadenanstrichen in Verbindung mit Dämmung kommen unter Umständen Förderprogramme infrage. [prüfen]",
    midCta: ["Fotos schicken, Angebot erhalten.", "Ein paar Fotos der Räume und grobe Maße genügen für eine erste Einschätzung."],
    quoteMeta: "[Stadtteil] · Malerarbeiten",
    faq: [
      ["Muss ich die Möbel selbst ausräumen?", "Nein. Wir rücken Möbel zur Seite und decken sie ab. Empfindliche Gegenstände räumen Sie am besten vorher weg."],
      ["Lohnt sich das Aufarbeiten von Holzfenstern?", "Oft ja – Schleifen und Lackieren verlängert die Lebensdauer deutlich. Wir sagen Ihnen ehrlich, wann ein Tausch sinnvoller ist."],
      ["Welche Farben verwenden Sie?", "Hochwertige, emissionsarme Farben [Hersteller prüfen]. Auf Wunsch auch Lehm- oder Kalkfarben."],
      ["Streichen Sie auch Treppenhäuser für WEGs?", "Ja, wir arbeiten auch für Eigentümergemeinschaften und Hausverwaltungen."]
    ],
    related: ["fenster-tueren", "trockenbau", "altbausanierung"]
  },
  {
    slug: "elektroarbeiten", title: "Elektroarbeiten", short: "Elektroarbeiten", form: "Elektro",
    teaser: "Neue Leitungen, Zählerschrank, Licht und Steckdosen nach aktuellem Stand.",
    d: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
    h1: "Elektroarbeiten in Hamburg – sicher, sauber, nach aktuellem Stand.",
    intro: "Neue Leitungen, Zählerschrank, Licht und Steckdosen: Wir erneuern Ihre Elektroinstallation fachgerecht – als Einzelauftrag oder im Rahmen einer Sanierung. Mit Prüfprotokoll bei der Übergabe.",
    bullets: ["Fachgerechte Installation [Elektromeister prüfen]", "Schriftliches Angebot nach Besichtigung", "Prüfprotokoll bei der Übergabe"],
    photo: "Projektfoto: neue Unterverteilung",
    scope: [
      ["Bestandsprüfung", "Wir prüfen Leitungen, Absicherung und Zählerschrank."],
      ["Planung", "Steckdosen, Schalter, Licht und Netzwerk nach Ihrem Bedarf."],
      ["Leitungen erneuern", "Neue Leitungen unter Putz, Schlitze sauber verschlossen."],
      ["Zählerschrank & Verteilung", "Neue Unterverteilung mit FI-Schutzschaltern."],
      ["Licht", "Deckenauslässe, Spots, LED-Beleuchtung."],
      ["Netzwerk & Medien", "LAN, TV und Lautsprecher vorbereitet."],
      ["Smart Home", "Vorbereitung für smarte Steuerung [prüfen]."],
      ["Prüfung & Übergabe", "Messung, Prüfprotokoll und Einweisung."]
    ],
    galleryTitle: "Elektroarbeiten aus unseren Projekten",
    gallery: ["Unterverteilung", "Küchenelektrik", "LED-Spots", "Altbau-Elektrik", "Netzwerk", "Außenbeleuchtung"],
    steps: [
      ["1 Termin", "Besichtigung & Prüfung", "Bestand prüfen und Wünsche aufnehmen."],
      ["ca. [X] Tage", "Plan & Angebot", "Elektroplan und schriftliches Angebot."],
      ["ca. [X] Tage", "Schlitzen & Verlegen", "Neue Leitungen und Dosen."],
      ["ca. [X] Tage", "Verteilung", "Zählerschrank und Unterverteilung."],
      ["ca. [X] Tage", "Feininstallation", "Schalter, Steckdosen, Leuchten."],
      ["1 Termin", "Prüfung & Abnahme", "Messprotokoll und Übergabe."]
    ],
    factors: [["Umfang", "Einzelne Räume oder ganze Wohnung"], ["Zustand", "Alter der Leitungen, Schutzleiter, Absicherung"], ["Ausstattung", "Anzahl Steckdosen, Licht, Netzwerk, Smart Home"], ["Zählerschrank", "Erneuerung nötig? Abstimmung mit dem Netzbetreiber"], ["Putz & Oberflächen", "Schlitze verschließen, Malerarbeiten danach"]],
    funding: "Im Rahmen energetischer Sanierungen können einzelne Maßnahmen förderfähig sein. [prüfen]",
    midCta: ["Fotos vom Zählerschrank schicken.", "Ein Foto vom Sicherungskasten sagt uns schon viel über den Zustand."],
    quoteMeta: "[Stadtteil] · Elektroarbeiten",
    faq: [
      ["Woran erkenne ich, dass meine Elektrik erneuert werden muss?", "Häufige Anzeichen: alte Schraubsicherungen, fehlender FI-Schutzschalter, zweiadrige Leitungen. Wir prüfen das vor Ort."],
      ["Wird es sehr schmutzig?", "Beim Schlitzen entsteht Staub. Wir arbeiten mit Absaugung und schützen die Räume."],
      ["Übernehmen Sie auch das Verputzen und Streichen?", "Ja – auf Wunsch kommen Putz- und Malerarbeiten aus einer Hand."],
      ["Erhalte ich ein Prüfprotokoll?", "Ja, nach Abschluss erhalten Sie ein Messprotokoll."]
    ],
    related: ["komplettsanierung", "altbausanierung", "trockenbau"]
  },
  {
    slug: "sanitaer-heizung", title: "Sanitär & Heizung", short: "Sanitär & Heizung", form: "Sanitär & Heizung",
    teaser: "Wasserleitungen, Heizkörper und Anschlüsse – vom Austausch bis zur Neuinstallation.",
    d: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
    h1: "Sanitär & Heizung in Hamburg – Leitungen, Heizkörper, Anschlüsse.",
    intro: "Ob neue Wasserleitungen, Heizkörpertausch oder Küchenanschlüsse: Wir erneuern Sanitär- und Heizungsinstallationen – sauber geplant und mit festen Terminen.",
    bullets: ["Fachgerechte Installation [Meister prüfen]", "Schriftliches Angebot nach Besichtigung", "Koordination mit allen weiteren Gewerken"],
    photo: "Projektfoto: neue Heizkörper und Leitungen",
    scope: [
      ["Bestandsaufnahme", "Zustand von Leitungen, Heizung und Anschlüssen."],
      ["Wasserleitungen", "Neue Trinkwasser- und Abwasserleitungen."],
      ["Heizkörper", "Austausch, Versetzen und hydraulischer Abgleich [prüfen]."],
      ["Fußbodenheizung", "Nachrüstung im Bestand [prüfen]."],
      ["Küchenanschlüsse", "Spüle, Geschirrspüler und Waschmaschine."],
      ["Vorwandinstallation", "Für WC, Waschtisch und Dusche."],
      ["Heizungstausch", "Beratung und Umsetzung mit Partnern [prüfen]."],
      ["Dichtheitsprüfung & Übergabe", "Druckprüfung, Protokoll und Einweisung."]
    ],
    galleryTitle: "Sanitär- und Heizungsarbeiten aus unseren Projekten",
    gallery: ["Heizkörpertausch", "Vorwand-WC", "Küchenanschluss", "Fußbodenheizung", "Steigleitung", "Duschanschluss"],
    steps: [
      ["1 Termin", "Besichtigung", "Bestand prüfen, Wünsche aufnehmen."],
      ["ca. [X] Tage", "Angebot", "Schriftlich, mit allen Positionen."],
      ["ca. [X] Tage", "Vorbereitung", "Material, Wasser absperren, Schutz."],
      ["ca. [X] Tage", "Installation", "Leitungen, Heizkörper, Anschlüsse."],
      ["1 Tag", "Prüfung", "Druck- und Dichtheitsprüfung."],
      ["1 Termin", "Abnahme", "Einweisung und Übergabe."]
    ],
    factors: [["Umfang", "Einzelne Heizkörper oder ganze Stränge"], ["Leitungsführung", "Auf oder unter Putz, Zugang zu Steigleitungen"], ["Material", "Rohrsysteme, Heizkörper, Armaturen"], ["Heizsystem", "Gas, Fernwärme, Wärmepumpe [prüfen]"], ["Folgearbeiten", "Putz, Fliesen, Malerarbeiten"]],
    funding: "Für den Heizungstausch und Optimierungen gibt es unter Umständen Förderprogramme. [Aktuelle Programme prüfen und verlinken]",
    midCta: ["Fotos schicken, Einschätzung erhalten.", "Fotos von Heizkörpern und Anschlüssen genügen für eine erste Einschätzung."],
    quoteMeta: "[Stadtteil] · Sanitär & Heizung",
    faq: [
      ["Kann ich während der Arbeiten Wasser nutzen?", "Meist nur eingeschränkt. Wir planen Absperrzeiten so kurz wie möglich und kündigen sie an."],
      ["Lohnt sich ein Heizkörpertausch?", "Bei alten Heizkörpern oft ja – vor allem in Verbindung mit neuen Thermostatventilen. Wir beraten Sie."],
      ["Übernehmen Sie auch den Heizungstausch?", "Wir beraten und setzen um – teils mit festen Partnerbetrieben [prüfen]."],
      ["Wer kümmert sich um Fliesen und Putz?", "Das übernehmen wir gleich mit – alles aus einer Hand."]
    ],
    related: ["badsanierung", "energetische-sanierung", "komplettsanierung"]
  },
  {
    slug: "energetische-sanierung", title: "Energetische Sanierung", short: "Energetische Sanierung", form: "Energetisch",
    teaser: "Dämmung, Fenster und Heizung: weniger Energiekosten, mehr Wohnkomfort.",
    d: "M3 11l9-7 9 7 M5 10v10h14V10 M9 18c0-3.5 2.5-6 6.5-6 0 4-2.5 6.5-6.5 6z",
    h1: "Energetische Sanierung in Hamburg – weniger Verbrauch, mehr Komfort.",
    intro: "Dämmung, neue Fenster, moderne Heiztechnik: Wir setzen energetische Maßnahmen um – abgestimmt mit Energieberatern und mit Blick auf mögliche Förderungen [prüfen].",
    bullets: ["Zusammenarbeit mit Energieberatern [prüfen]", "Förderung von Anfang an mitgedacht", "Schriftliches Angebot nach Besichtigung"],
    photo: "Projektfoto: Reihenhaus nach Fassadendämmung",
    scope: [
      ["Erstberatung", "Wo geht die meiste Energie verloren? Welche Schritte lohnen sich?"],
      ["Abstimmung Energieberatung", "Gemeinsam mit Energieberatern zum Sanierungsfahrplan [prüfen]."],
      ["Dachdämmung", "Zwischensparren- oder Aufsparrendämmung, oberste Geschossdecke."],
      ["Fassadendämmung", "Wärmedämmverbundsystem oder Innendämmung im Altbau."],
      ["Fenster & Türen", "Neue Fenster mit Wärmeschutzverglasung."],
      ["Heizung", "Heizkörper, Abgleich und Heizungstausch mit Partnern."],
      ["Kellerdecke", "Dämmung der Kellerdecke – oft mit wenig Aufwand."],
      ["Dokumentation", "Nachweise für Förderanträge [prüfen]."]
    ],
    galleryTitle: "Energetische Sanierungen aus unseren Projekten",
    gallery: ["Fassadendämmung", "Dachausbau", "Neue Fenster", "Kellerdecke", "Reihenhaus", "Heizkörper"],
    steps: [
      ["1 Termin", "Erstberatung vor Ort", "Wir sehen uns das Gebäude an."],
      ["ca. [X] Wochen", "Energieberatung & Förderung", "Plan und Förderantrag – vor Auftragsvergabe."],
      ["ca. [X] Tage", "Angebot", "Schriftlich, mit allen Positionen."],
      ["ca. [X] Wochen", "Umsetzung", "Dämmung, Fenster, Heizung nach Plan."],
      ["ca. [X] Tage", "Nachweise", "Unterlagen für die Förderung."],
      ["1 Termin", "Abnahme", "Rundgang und Übergabe."]
    ],
    factors: [["Gebäudetyp & Baujahr", "Einfamilienhaus, Reihenhaus, Mehrfamilienhaus"], ["Maßnahmen", "Dach, Fassade, Fenster, Heizung – einzeln oder kombiniert"], ["Dämmstoffe", "Material und Dämmstärke"], ["Gerüst & Zugang", "Bei Fassade und Dach"], ["Förderung", "Kann einen Teil der Kosten abdecken [prüfen]"]],
    funding: "Für energetische Maßnahmen gibt es oft Zuschüsse oder günstige Kredite, z. B. über KfW oder BAFA. Wichtig: Viele Anträge müssen vor Auftragsvergabe gestellt werden. [Inhalte aktuell halten]",
    midCta: ["Gebäudedaten schicken, Einschätzung erhalten.", "Baujahr, Fotos und grobe Maße genügen für eine erste Einschätzung."],
    quoteMeta: "[Stadtteil] · Energetische Sanierung",
    faq: [
      ["Welche Maßnahme bringt am meisten?", "Das hängt vom Gebäude ab. Oft lohnen sich Dach und oberste Geschossdecke zuerst. Wir beraten Sie gemeinsam mit Energieberatern [prüfen]."],
      ["Helfen Sie bei Fördermitteln?", "Wir zeigen Ihnen, welche Maßnahmen förderfähig sein können, und arbeiten dafür mit Energieberatern zusammen [prüfen]."],
      ["Muss ich den Förderantrag vor dem Auftrag stellen?", "Bei vielen Programmen ja. Deshalb planen wir die Förderung von Anfang an mit ein."],
      ["Geht Dämmung auch im Altbau?", "Ja, zum Beispiel mit Innendämmung, wenn die Fassade erhalten bleiben soll."]
    ],
    related: ["fenster-tueren", "sanitaer-heizung", "altbausanierung"]
  },
  {
    slug: "fenster-tueren", title: "Fenster & Türen", short: "Fenster & Türen", form: "Fenster & Türen",
    teaser: "Neue Fenster und Türen einbauen oder alte Holzfenster aufarbeiten.",
    d: "M5 3h14v18H5z M12 3v18 M5 12h14",
    h1: "Fenster & Türen in Hamburg – einbauen oder aufarbeiten.",
    intro: "Neue Fenster mit besserer Dämmung oder alte Holzfenster, die wieder schließen und gut aussehen: Wir beraten ehrlich, was sich lohnt – und setzen es sauber um.",
    bullets: ["Aufarbeiten oder Tausch – ehrliche Beratung", "Schriftliches Angebot nach Aufmaß", "Saubere Anschlüsse innen und außen"],
    photo: "Projektfoto: aufgearbeitete Holzfenster im Altbau",
    scope: [
      ["Aufmaß & Beratung", "Zustand prüfen, Maße nehmen, Varianten zeigen."],
      ["Holzfenster aufarbeiten", "Schleifen, Kitt erneuern, lackieren, Dichtungen einsetzen."],
      ["Beschläge & Dichtungen", "Gangbar machen, nachstellen, abdichten."],
      ["Neue Fenster", "Holz, Kunststoff oder Holz-Alu – mit Wärmeschutzverglasung."],
      ["Fachgerechter Einbau", "Luftdichte Anschlüsse nach aktuellem Stand."],
      ["Innentüren", "Neue Türen und Zargen oder Altbautüren aufarbeiten."],
      ["Haus- & Wohnungstüren", "Sicherheit, Dämmung und Optik."],
      ["Beiputz & Übergabe", "Laibungen verputzt und gestrichen."]
    ],
    galleryTitle: "Fenster und Türen aus unseren Projekten",
    gallery: ["Kastenfenster", "Holzfenster", "Neue Fenster", "Haustür", "Kassettentür", "Dachfenster"],
    steps: [
      ["1 Termin", "Aufmaß & Beratung", "Zustand prüfen, Varianten besprechen."],
      ["ca. [X] Tage", "Angebot", "Schriftlich, mit allen Positionen."],
      ["ca. [X] Wochen", "Fertigung / Vorbereitung", "Lieferzeit neuer Fenster [prüfen]."],
      ["ca. [X] Tage", "Ausbau & Einbau", "Bzw. Aufarbeitung vor Ort oder in der Werkstatt."],
      ["ca. [X] Tage", "Beiputz & Anstrich", "Laibungen fertigstellen."],
      ["1 Termin", "Abnahme", "Funktion prüfen, Übergabe."]
    ],
    factors: [["Anzahl & Größe", "Wie viele Fenster und Türen?"], ["Material", "Holz, Kunststoff, Holz-Alu"], ["Zustand", "Lohnt sich die Aufarbeitung?"], ["Verglasung & Schallschutz", "Zweifach, dreifach, Schallschutzglas"], ["Denkmalschutz", "Auflagen zu Teilung und Profilen [prüfen]"]],
    funding: "Neue Fenster können im Rahmen energetischer Sanierungen förderfähig sein. [Aktuelle Programme prüfen und verlinken]",
    midCta: ["Fotos Ihrer Fenster schicken.", "Ein paar Fotos genügen, um zu sagen, ob sich das Aufarbeiten lohnt."],
    quoteMeta: "[Stadtteil] · Fenster & Türen",
    faq: [
      ["Aufarbeiten oder neue Fenster – was lohnt sich?", "Gut erhaltene Holzfenster lassen sich oft aufarbeiten. Bei morschem Holz oder schlechter Dämmung sind neue Fenster sinnvoller. Wir beraten ehrlich."],
      ["Wie lange dauert der Fenstertausch?", "Der Einbau selbst dauert meist nur [X] Stunden pro Fenster. Die Lieferzeit beträgt ca. [X] Wochen."],
      ["Wird es beim Einbau schmutzig?", "Wir schützen Böden und Möbel und hinterlassen alles sauber."],
      ["Arbeiten Sie Altbautüren auf?", "Ja, Kassettentüren schleifen, ausbessern und lackieren wir gern."]
    ],
    related: ["malerarbeiten", "energetische-sanierung", "altbausanierung"]
  },
  {
    slug: "boden", title: "Boden", short: "Boden", form: "Boden",
    teaser: "Parkett, Vinyl, Fliesen oder Dielen – verlegt, geschliffen, versiegelt.",
    d: "M4 4h16v16H4z M4 12h8V4 M12 20v-8h8",
    h1: "Bodenarbeiten in Hamburg – verlegt, geschliffen, versiegelt.",
    intro: "Ob neues Parkett, robuster Vinylboden oder alte Dielen, die wieder glänzen sollen: Wir bereiten den Untergrund vor, verlegen und versiegeln – sauber und termintreu.",
    bullets: ["Untergrund geprüft und vorbereitet", "Schriftliches Angebot nach Aufmaß", "Typische Dauer: ca. [X] Tage pro Wohnung"],
    photo: "Projektfoto: geschliffener Dielenboden",
    scope: [
      ["Beratung & Aufmaß", "Material, Optik und Nutzung – passend zum Raum."],
      ["Alten Belag entfernen", "Teppich, Laminat oder Fliesen raus, Entsorgung inklusive."],
      ["Untergrund vorbereiten", "Ausgleichen, Spachteln, Feuchtemessung."],
      ["Parkett", "Verlegen, schleifen, ölen oder versiegeln."],
      ["Vinyl & Designboden", "Klick- oder Klebevinyl, auch für Bad und Küche."],
      ["Dielen aufarbeiten", "Schleifen, Fugen schließen, ölen."],
      ["Fliesen", "Boden- und Wandfliesen in vielen Formaten."],
      ["Sockelleisten & Übergänge", "Saubere Abschlüsse und Übergangsprofile."]
    ],
    galleryTitle: "Böden, die wir verlegt haben",
    gallery: ["Dielenboden", "Eichenparkett", "Vinylboden", "Fischgrät", "Fliesenboden", "Treppe"],
    steps: [
      ["1 Termin", "Aufmaß & Beratung", "Untergrund prüfen, Muster zeigen."],
      ["ca. [X] Tage", "Angebot", "Schriftlich, mit Flächen und Material."],
      ["ca. [X] Tag", "Rückbau", "Alten Belag entfernen."],
      ["ca. [X] Tage", "Untergrund", "Ausgleichen und trocknen lassen."],
      ["ca. [X] Tage", "Verlegen & Oberfläche", "Verlegen, schleifen, ölen."],
      ["1 Termin", "Abnahme", "Pflegehinweise und Übergabe."]
    ],
    factors: [["Fläche", "Quadratmeter und Zuschnitt"], ["Material", "Parkett, Vinyl, Fliesen, Dielen"], ["Untergrund", "Unebenheiten, Feuchtigkeit, alter Belag"], ["Verlegemuster", "Schiffsboden, Fischgrät, Großformat"], ["Oberfläche", "Geölt, lackiert, versiegelt"]],
    funding: "",
    midCta: ["Fotos vom Boden schicken.", "Ein Foto und die ungefähre Fläche genügen für eine erste Einschätzung."],
    quoteMeta: "[Stadtteil] · Boden",
    faq: [
      ["Kann man alte Dielen noch retten?", "Oft ja. Durch Schleifen und Ölen werden alte Dielen wieder schön. Wir prüfen den Zustand vor Ort."],
      ["Wie lange dauert das Schleifen?", "Für eine Wohnung meist [X] Tage, je nach Fläche und Oberfläche."],
      ["Ist Vinyl auch fürs Bad geeignet?", "Ja, es gibt wasserfeste Vinylböden für Bad und Küche."],
      ["Wird beim Schleifen viel Staub entstehen?", "Wir arbeiten mit Absaugung und schließen die Räume ab."]
    ],
    related: ["malerarbeiten", "altbausanierung", "komplettsanierung"]
  },
  {
    slug: "trockenbau", title: "Trockenbau", short: "Trockenbau", form: "Trockenbau",
    teaser: "Neue Wände, abgehängte Decken und Dachausbau – schnell und sauber.",
    d: "M3 4h18v16H3z M9 4v16 M15 4v16",
    h1: "Trockenbau in Hamburg – neue Räume, schnell und sauber.",
    intro: "Ein zusätzliches Zimmer, eine abgehängte Decke mit Spots oder der Ausbau des Dachgeschosses: Mit Trockenbau verändern wir Räume schnell, sauber und ohne lange Trocknungszeiten.",
    bullets: ["Schnell und ohne Trocknungszeit", "Schriftliches Angebot nach Aufmaß", "Schall- und Brandschutz nach Bedarf"],
    photo: "Projektfoto: neue Trennwand im Altbau",
    scope: [
      ["Beratung & Planung", "Raumaufteilung, Türen, Schall- und Brandschutz."],
      ["Trennwände", "Neue Zimmer, Nischen und Raumteiler."],
      ["Abgehängte Decken", "Mit Spots, Lüftung oder Schallschutz."],
      ["Vorwände", "Für Bad, WC und Installationen."],
      ["Dachausbau", "Dämmung, Dampfbremse und Beplankung."],
      ["Schallschutz", "Bessere Ruhe zwischen Räumen und Etagen."],
      ["Spachteln", "Fugen und Flächen in Qualitätsstufe Q2–Q4."],
      ["Übergabe", "Bereit zum Streichen oder fertig gestrichen."]
    ],
    galleryTitle: "Trockenbau aus unseren Projekten",
    gallery: ["Trennwand", "Abgehängte Decke", "Dachausbau", "Vorwand", "Nische", "Schallschutzwand"],
    steps: [
      ["1 Termin", "Aufmaß & Beratung", "Wünsche, Maße und Anforderungen."],
      ["ca. [X] Tage", "Angebot", "Schriftlich, mit allen Positionen."],
      ["ca. [X] Tag", "Unterkonstruktion", "Ständerwerk oder Abhängung."],
      ["ca. [X] Tage", "Dämmung & Beplankung", "Platten, Dämmung, Installationen."],
      ["ca. [X] Tage", "Spachteln", "Fugen und Flächen glatt."],
      ["1 Termin", "Abnahme", "Rundgang und Übergabe."]
    ],
    factors: [["Fläche & Höhe", "Wand- und Deckenfläche"], ["Anforderungen", "Schall-, Brand- oder Feuchtraumschutz"], ["Oberfläche", "Qualitätsstufe der Spachtelung"], ["Installationen", "Elektro, Lüftung, Sanitär in der Wand"], ["Türen & Öffnungen", "Anzahl und Größe"]],
    funding: "",
    midCta: ["Grundriss schicken, Einschätzung erhalten.", "Ein Grundriss oder eine Skizze genügt für eine erste Einschätzung."],
    quoteMeta: "[Stadtteil] · Trockenbau",
    faq: [
      ["Wie schnell ist eine Trockenbauwand fertig?", "Eine einfache Wand steht oft in [X] Tagen inklusive Spachteln."],
      ["Wie gut ist der Schallschutz?", "Mit Dämmung und doppelter Beplankung erreichen Trockenbauwände einen guten Schallschutz. Wir beraten Sie je nach Anforderung."],
      ["Kann ich an Trockenbauwände etwas aufhängen?", "Ja – mit passenden Dübeln oder vorher eingebauten Verstärkungen."],
      ["Übernehmen Sie auch Elektro und Malerarbeiten?", "Ja, alles aus einer Hand."]
    ],
    related: ["badsanierung", "elektroarbeiten", "malerarbeiten"]
  }
];

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

// ---------------------------------------------------------------------------
// Referenzen / Projekte
// ---------------------------------------------------------------------------
export const projects = [
  { slug: "altbauwohnung-stadtteil", cat: "Komplettsanierung", area: "a", title: "Altbauwohnung [Stadtteil]", meta: "[m²] · [Dauer] · alle Gewerke", h1: "Altbauwohnung in [Stadtteil]: aus 1920 wird heute.", objekt: "Altbauwohnung, Bj. [1920]", flaeche: "[85] m²", dauer: "[7] Wochen", gewerke: "Elektro, Sanitär, Trockenbau, Boden, Maler", service: "komplettsanierung" },
  { slug: "familienbad-stadtteil", cat: "Bad", area: "e", title: "Familienbad [Stadtteil]", meta: "[m²] · [Dauer] · Sanitär, Fliesen", h1: "Familienbad in [Stadtteil]: Platz für alle.", objekt: "Wohnung, Bj. [1965]", flaeche: "[9] m²", dauer: "[3] Wochen", gewerke: "Sanitär, Elektro, Fliesen, Trockenbau", service: "badsanierung" },
  { slug: "reihenhaus-stadtteil", cat: "Energetisch", area: "w", title: "Reihenhaus [Stadtteil]", meta: "[Baujahr] · [Dauer] · Dämmung, Fenster", h1: "Reihenhaus in [Stadtteil]: warm durch den Winter.", objekt: "Reihenhaus, Bj. [1972]", flaeche: "[120] m²", dauer: "[6] Wochen", gewerke: "Dämmung, Fenster, Heizung", service: "energetische-sanierung" },
  { slug: "jugendstilwohnung-stadtteil", cat: "Altbau", area: "e", title: "Jugendstilwohnung [Stadtteil]", meta: "[m²] · [Dauer] · Boden, Maler, Elektro", h1: "Jugendstilwohnung in [Stadtteil]: Stuck bleibt, Technik neu.", objekt: "Altbauwohnung, Bj. [1908]", flaeche: "[110] m²", dauer: "[8] Wochen", gewerke: "Elektro, Boden, Maler", service: "altbausanierung" },
  { slug: "treppenhaus-stadtteil", cat: "Maler", area: "a", title: "Treppenhaus [Stadtteil]", meta: "[Etagen] · [Dauer] · Malerarbeiten", h1: "Treppenhaus in [Stadtteil]: frisch für alle Parteien.", objekt: "Mehrfamilienhaus, [5] Etagen", flaeche: "[400] m² Wandfläche", dauer: "[2] Wochen", gewerke: "Malerarbeiten, Lackierarbeiten", service: "malerarbeiten" },
  { slug: "holzfenster-stadtteil", cat: "Fenster", area: "w", title: "Holzfenster [Stadtteil]", meta: "[Anzahl] Fenster · aufgearbeitet", h1: "Holzfenster in [Stadtteil]: aufgearbeitet statt ersetzt.", objekt: "Altbau, Bj. [1912]", flaeche: "[14] Fenster", dauer: "[2] Wochen", gewerke: "Schleifen, Kitt, Lack, Dichtungen", service: "fenster-tueren" },
  { slug: "duschbad-stadtteil", cat: "Bad", area: "a", title: "Duschbad [Stadtteil]", meta: "[m²] · [Dauer] · barrierefrei", h1: "Duschbad in [Stadtteil]: bodengleich und barrierefrei.", objekt: "Wohnung, Bj. [1958]", flaeche: "[6] m²", dauer: "[3] Wochen", gewerke: "Sanitär, Fliesen, Elektro", service: "badsanierung" },
  { slug: "einfamilienhaus-stadtteil", cat: "Komplettsanierung", area: "w", title: "Einfamilienhaus [Stadtteil]", meta: "[m²] · [Dauer] · alle Gewerke", h1: "Einfamilienhaus in [Stadtteil]: einmal alles neu.", objekt: "Einfamilienhaus, Bj. [1964]", flaeche: "[150] m²", dauer: "[12] Wochen", gewerke: "Alle Gewerke", service: "komplettsanierung" },
  { slug: "dielenboden-stadtteil", cat: "Boden", area: "e", title: "Dielenboden [Stadtteil]", meta: "[m²] · geschliffen & geölt", h1: "Dielenboden in [Stadtteil]: 100 Jahre alt, wie neu.", objekt: "Altbauwohnung, Bj. [1925]", flaeche: "[70] m²", dauer: "[5] Tage", gewerke: "Schleifen, Ölen", service: "boden" }
];

export const projectGallery = ["Wohnzimmer", "Küche", "Bad", "Flur", "Schlafzimmer", "Detail Stuck", "Detail Dielen", "Detail Bad"];

// ---------------------------------------------------------------------------
// Startseite
// ---------------------------------------------------------------------------
export const homeSteps = [
  ["Anfrage", "Online, per Telefon oder WhatsApp – gern mit Fotos."],
  ["Besichtigung", "Wir kommen vorbei, beraten und nehmen Maß."],
  ["Angebot", "Schriftlich, mit allen Positionen und Zeitplan."],
  ["Umsetzung", "Koordiniert, sauber und mit regelmäßigen Updates."],
  ["Abnahme", "Gemeinsamer Rundgang, Protokoll und Gewährleistung."]
];

export const homeFaq = [
  ["Übernehmen Sie auch einzelne Arbeiten?", "Ja. Neben Komplettsanierungen übernehmen wir auch einzelne Gewerke – zum Beispiel ein neues Bad, Böden oder Malerarbeiten."],
  ["Was kostet eine Sanierung?", "Das hängt von Fläche, Zustand und Ausstattung ab. Nach der Besichtigung erhalten Sie ein schriftliches Angebot mit allen Positionen."],
  ["Wie schnell können Sie anfangen?", "[Aktuelle Vorlaufzeit einsetzen]. Beim Vor-Ort-Termin nennen wir Ihnen einen verbindlichen Starttermin."],
  ["Kann ich während der Sanierung in der Wohnung bleiben?", "Bei einzelnen Gewerken meist ja. Bei Komplettsanierungen planen wir mit Ihnen, welche Räume nutzbar bleiben."],
  ["Koordinieren Sie alle Handwerker?", "Ja. Ihr fester Ansprechpartner stimmt alle Gewerke und Termine ab – Sie müssen sich um nichts kümmern."],
  ["Helfen Sie bei Fördermitteln?", "Wir zeigen Ihnen, welche Maßnahmen förderfähig sein können, und arbeiten dafür mit Energieberatern zusammen [prüfen]."]
];

export const districts = ["Altona", "Bergedorf", "Eimsbüttel", "Hamburg-Mitte", "Hamburg-Nord", "Alstertal", "Wandsbek", "Umland"];

export const areas = [
  ["Altona", "Altona-Altstadt, Ottensen, Bahrenfeld, Othmarschen, Blankenese, Lurup …", false],
  ["Bergedorf", "Bergedorf, Lohbrügge, Curslack, Neuallermöhe …", false],
  ["Eimsbüttel", "Eimsbüttel, Lokstedt, Niendorf, Stellingen, Eidelstedt, Schnelsen …", true],
  ["Hamburg-Mitte", "St. Georg, St. Pauli, Hamm, Horn, Billstedt, Wilhelmsburg …", false],
  ["Hamburg-Nord", "Winterhude, Eppendorf, Barmbek, Uhlenhorst, Fuhlsbüttel, Langenhorn …", true],
  ["Alstertal", "Poppenbüttel, Sasel, Wellingsbüttel, Hummelsbüttel, Bergstedt, Duvenstedt …", false],
  ["Wandsbek", "Wandsbek, Bramfeld, Volksdorf, Rahlstedt, Farmsen-Berne, Marienthal …", true],
  ["Umland", "[z. B. Norderstedt, Ahrensburg, Pinneberg – nur wo Sie wirklich arbeiten]", false]
];

// ---------------------------------------------------------------------------
// Ablauf
// ---------------------------------------------------------------------------
export const processSteps = [
  ["Anfrage", "Sie schildern kurz Ihr Vorhaben – online, telefonisch oder per WhatsApp.", "Ein paar Fotos und grobe Maße helfen uns sehr.", "ca. 5 Minuten"],
  ["Rückruf", "Wir melden uns, klären erste Fragen und vereinbaren einen Termin.", "Einen Termin vor Ort auswählen.", "innerhalb [24 h]"],
  ["Besichtigung & Aufmaß", "Wir sehen uns alles an, beraten Sie und nehmen Maß.", "Wünsche und Budgetrahmen mitteilen.", "ca. 1 Stunde"],
  ["Angebot", "Sie erhalten ein schriftliches Angebot mit allen Positionen und Zeitplan.", "In Ruhe prüfen, Fragen stellen.", "ca. [X] Werktage"],
  ["Planung & Vorbereitung", "Wir stimmen Gewerke, Material und Termine verbindlich ab.", "Auftrag erteilen, Zugang klären.", "ca. [X] Wochen"],
  ["Umsetzung", "Unsere Handwerker arbeiten nach Plan – Sie erhalten regelmäßige Updates.", "Für Rückfragen erreichbar sein.", "je nach Umfang"],
  ["Abnahme & Übergabe", "Gemeinsamer Rundgang, Abnahmeprotokoll, Pflegehinweise und Gewährleistung.", "Mängel offen ansprechen.", "1 Termin"]
];
export const promises = ["Schriftliches Angebot mit allen Positionen", "Verbindlicher Terminplan", "Ein fester Ansprechpartner für alles", "Abnahmeprotokoll bei der Übergabe", "Gewährleistung nach [BGB/VOB – prüfen]"];
export const processFaq = [
  ["Wie lange dauert eine Sanierung insgesamt?", "Das hängt vom Umfang ab: ein Bad dauert meist [X] Wochen, eine Komplettsanierung [X–X] Wochen. Den Zeitplan erhalten Sie mit dem Angebot."],
  ["Kann ich während der Arbeiten in der Wohnung wohnen?", "Bei einzelnen Gewerken meist ja. Bei Komplettsanierungen planen wir gemeinsam, welche Räume nutzbar bleiben."],
  ["Wer ist mein Ansprechpartner?", "Sie haben vom ersten Termin bis zur Abnahme eine feste Person – mit direkter Telefonnummer."],
  ["Was passiert, wenn etwas Unvorhergesehenes auftaucht?", "Wir informieren Sie sofort und besprechen Lösung und Kosten, bevor wir weiterarbeiten."]
];

// ---------------------------------------------------------------------------
// Über uns
// ---------------------------------------------------------------------------
export const team = ["Geschäftsführung", "Projektleitung", "[Meister] Sanitär", "Elektro", "Malerei", "Bodenleger", "Trockenbau", "Büro & Termine"];
export const values = [
  ["Ehrlich", "Wir sagen, was geht – und was nicht. Auch beim Preis.", "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M9 12l2 2 4-4"],
  ["Ordentlich", "Saubere Baustelle, geschützte Räume, jeden Abend aufgeräumt.", "M4 20h16 M6 20V9l6-5 6 5v11 M10 20v-5h4v5"],
  ["Verbindlich", "Termine und Absprachen gelten – schriftlich.", "M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4 M8 14l2 2 4-4"],
  ["Handwerklich", "Gelernte Fachleute, sorgfältige Arbeit, langlebige Ergebnisse.", "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"]
];

// ---------------------------------------------------------------------------
// Karriere
// ---------------------------------------------------------------------------
export const benefits = [
  ["Pünktlicher Lohn", "Faire Bezahlung, immer pünktlich [Tarif prüfen].", "M4 7h16v12H4z M4 11h16 M8 15h3"],
  ["Firmenwagen", "Mit Werkzeug ausgestattet [prüfen].", "M3 16V8h11l3 4h4v4 M3 16h18 M7 18a2 2 0 1 0 0-4 M17 18a2 2 0 1 0 0-4"],
  ["Weiterbildung", "Kurse, Meisterschule, neue Techniken [prüfen].", "M3 8l9-4 9 4-9 4z M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5"],
  ["Feste Teams", "Sie arbeiten mit Kollegen, die Sie kennen.", "M8 11a3 3 0 1 0 0-6 M16 11a3 3 0 1 0 0-6 M3 20c0-3 2.5-5 5-5s5 2 5 5 M11 20c0-3 2.5-5 5-5s5 2 5 5"],
  ["Gutes Werkzeug", "Professionelle Maschinen statt Baumarkt.", "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"],
  ["Kurze Wege", "Baustellen in Hamburg statt Montage quer durchs Land.", icons.pin]
];
export const jobs = [
  { title: "Maler und Lackierer (m/w/d)", type: "Vollzeit", tasks: ["Spachtel-, Streich- und Lackierarbeiten in Wohnungen und Treppenhäusern", "Tapezieren und Aufarbeiten von Holzfenstern", "Sorgfältiger Umgang mit Kundeneigentum"], profile: ["Abgeschlossene Ausbildung als Maler/-in und Lackierer/-in", "Erfahrung im Innenausbau [prüfen]", "Führerschein Klasse B"] },
  { title: "Anlagenmechaniker SHK (m/w/d)", type: "Vollzeit", tasks: ["Installation von Sanitär- und Heizungsanlagen", "Badsanierungen im Team", "Wartung und Austausch von Heizkörpern"], profile: ["Abgeschlossene Ausbildung als Anlagenmechaniker/-in SHK", "Selbstständige, saubere Arbeitsweise", "Führerschein Klasse B"] },
  { title: "Elektroniker (m/w/d)", type: "Vollzeit", tasks: ["Elektroinstallationen in Sanierungsprojekten", "Aufbau von Unterverteilungen", "Prüfung und Dokumentation"], profile: ["Abgeschlossene Ausbildung als Elektroniker/-in für Energie- und Gebäudetechnik", "Erfahrung im Altbau von Vorteil", "Führerschein Klasse B"] },
  { title: "Ausbildung 2027 (m/w/d)", type: "Ausbildung", tasks: ["Mitarbeit auf echten Baustellen von Anfang an", "Feste Ansprechperson während der gesamten Ausbildung", "Berufsschule in Hamburg"], profile: ["Schulabschluss [prüfen]", "Freude am Handwerk", "Zuverlässigkeit und Teamgeist"] }
];

// ---------------------------------------------------------------------------
// Ratgeber
// ---------------------------------------------------------------------------
export const articles = [
  {
    slug: "was-kostet-eine-badsanierung", cat: "Kosten", tags: "Kosten · Bad", time: "6 Min.", title: "Was kostet eine Badsanierung in Hamburg?",
    teaser: "Wovon der Preis abhängt, welche Posten oft vergessen werden und wie Sie Angebote vergleichen.",
    short: "Eine Badsanierung in Hamburg kostet je nach Größe und Ausstattung meist zwischen [X] und [X] Euro. Die größten Preistreiber sind Fliesen, Sanitärobjekte und der Zustand der Leitungen – besonders im Altbau.",
    service: "badsanierung", ctaTitle: "Ihr Bad, Ihr Preis.",
    sections: [
      ["Was die Kosten bestimmt", ["Der Preis einer Badsanierung hängt vor allem von vier Dingen ab: der Größe des Bades, der gewünschten Ausstattung, dem Zustand der vorhandenen Leitungen und davon, ob Anschlüsse an ihrem Platz bleiben können.", "Ein kleines Duschbad mit Standardfliesen ist deutlich günstiger als ein großes Familienbad mit bodengleicher Dusche, freistehender Wanne und großformatigen Fliesen. Im Hamburger Altbau kommen oft alte Leitungen oder ein unebener Untergrund dazu – das sollte im Angebot von Anfang an berücksichtigt sein."], "Eigenes Foto: Bad im Rohbau"],
      ["Beispielrechnung", null, null, "table"],
      ["Versteckte Kosten", ["Manche Posten tauchen erst auf, wenn die alten Fliesen herunter sind: marode Leitungen, ein schadhafter Estrich oder eine fehlende Abdichtung. Auch die Entsorgung des Bauschutts und eine Übergangslösung während der Bauzeit sollten Sie einplanen.", "Fragen Sie deshalb bei jedem Angebot nach, ob Entsorgung, Abdichtung und Elektroarbeiten enthalten sind – und wie mit Unvorhergesehenem umgegangen wird."]],
      ["So sparen Sie, ohne zu pfuschen", ["Lassen Sie Anschlüsse möglichst dort, wo sie sind – das spart Installationsaufwand. Standardformate bei Fliesen sind günstiger zu verlegen als Großformate oder Mosaik.", "Eigenleistung ist möglich, sollte aber vorher abgesprochen werden, zum Beispiel beim Ausräumen oder beim Rückbau von Möbeln. Bei Abdichtung, Elektro und Sanitär gilt: lieber vom Fachbetrieb."]]
    ],
    faq: [["Gibt es Zuschüsse für eine Badsanierung?", "Für barrierefreie Umbauten gibt es unter Umständen Zuschüsse. [Programme prüfen und verlinken]"], ["Wie lange dauert eine Badsanierung?", "Meist [X–X] Wochen, je nach Größe und Umfang."], ["Ist ein Festpreis möglich?", "[Antwort einsetzen – nur zusagen, was ihr wirklich anbietet]"]]
  },
  {
    slug: "altbau-kaufen-worauf-achten", cat: "Altbau", tags: "Altbau · Kauf", time: "8 Min.", title: "Altbau kaufen – worauf achten?",
    teaser: "Leitungen, Feuchtigkeit, Fenster: die wichtigsten Punkte für die Besichtigung.",
    short: "Beim Altbaukauf lohnt sich ein genauer Blick auf Elektrik, Wasserleitungen, Feuchtigkeit, Fenster und Heizung. Diese Punkte entscheiden darüber, wie viel nach dem Kauf noch investiert werden muss.",
    service: "altbausanierung", ctaTitle: "Altbau gekauft?",
    sections: [
      ["Elektrik und Leitungen", ["Alte Schraubsicherungen, fehlende FI-Schutzschalter oder zweiadrige Leitungen sind Hinweise darauf, dass die Elektrik erneuert werden muss. Bei Wasserleitungen sollten Sie nach dem Material fragen – alte Bleileitungen müssen ersetzt werden.", "Ein Blick in den Sicherungskasten und in den Keller verrät oft schon viel."], "Eigenes Foto: alter Sicherungskasten"],
      ["Feuchtigkeit und Substanz", ["Achten Sie auf Stockflecken, abplatzenden Putz und muffigen Geruch – vor allem im Keller und im Erdgeschoss. Bei Holzbalkendecken lohnt es sich, auf Durchbiegungen und knarrende Stellen zu achten."]],
      ["Fenster, Dach und Heizung", ["Alte Holzfenster lassen sich oft aufarbeiten. Prüfen Sie aber, ob das Holz morsch ist. Beim Dach und bei der Heizung hilft ein Blick in die Unterlagen: Wann wurde zuletzt erneuert?", "Bei größeren Fragen empfiehlt sich ein Termin mit einem Sachverständigen oder Handwerksbetrieb vor dem Kauf."]]
    ],
    faq: [["Lohnt sich ein Gutachten vor dem Kauf?", "Bei älteren Gebäuden meist ja. [Empfehlung prüfen]"], ["Kommen Sie auch vor dem Kauf zur Besichtigung?", "[Angebot prüfen und einsetzen]"]]
  },
  {
    slug: "foerderung-energetische-sanierung", cat: "Förderung", tags: "Förderung · Energie", time: "7 Min.", title: "Förderung für energetische Sanierung",
    teaser: "KfW und BAFA im Überblick – und warum Sie den Antrag vor dem Auftrag stellen sollten.",
    short: "Für energetische Sanierungen gibt es Zuschüsse und günstige Kredite, zum Beispiel über KfW und BAFA. Wichtig: Bei vielen Programmen muss der Antrag vor der Auftragsvergabe gestellt werden. [Inhalte aktuell halten]",
    service: "energetische-sanierung", ctaTitle: "Förderung mitdenken.",
    sections: [
      ["Welche Programme es gibt", ["Grundsätzlich unterscheidet man zwischen Zuschüssen für Einzelmaßnahmen – etwa Dämmung, Fenster oder Heizungsoptimierung – und Förderungen für umfassende Sanierungen. Die genauen Konditionen ändern sich regelmäßig. [Aktuelle Programme prüfen und verlinken]"], "Eigenes Foto: Dämmarbeiten am Dach"],
      ["Die richtige Reihenfolge", ["Bei vielen Programmen gilt: erst Antrag, dann Auftrag. Häufig ist außerdem eine Energieberatung oder die Bestätigung durch eine Energie-Effizienz-Expertin bzw. einen -Experten nötig.", "Planen Sie die Förderung deshalb von Anfang an ein – wir stimmen uns dafür mit Energieberatern ab [prüfen]."]],
      ["Was Sie vorbereiten können", ["Sammeln Sie Unterlagen zu Baujahr, Wohnfläche, Heizung und bisherigen Sanierungen. Fotos und Grundrisse helfen bei der ersten Einschätzung."]]
    ],
    faq: [["Wer stellt den Förderantrag?", "In der Regel Sie als Eigentümer – oft mit Unterstützung der Energieberatung. [prüfen]"], ["Kann ich Förderungen kombinieren?", "Teilweise ja. [Aktuelle Regeln prüfen]"]]
  },
  {
    slug: "bodengleiche-dusche-im-altbau", cat: "Bad", tags: "Bad · Altbau", time: "5 Min.", title: "Bodengleiche Dusche im Altbau",
    teaser: "Was technisch möglich ist und welche Lösungen es bei geringer Aufbauhöhe gibt.",
    short: "Eine bodengleiche Dusche ist auch im Altbau oft möglich. Entscheidend sind die Aufbauhöhe des Bodens, die Lage des Abflusses und die Deckenkonstruktion.",
    service: "badsanierung", ctaTitle: "Neue Dusche geplant?",
    sections: [
      ["Die Herausforderung im Altbau", ["Für eine bodengleiche Dusche braucht der Abfluss Gefälle. Im Altbau ist die Aufbauhöhe aber oft gering – besonders bei Holzbalkendecken. Deshalb muss genau geplant werden."], "Eigenes Foto: bodengleiche Dusche"],
      ["Mögliche Lösungen", ["Flache Duschrinnen und Bodenabläufe mit geringer Einbauhöhe schaffen oft schon genug Spielraum. Wenn das nicht reicht, kann eine minimale Stufe oder ein leicht erhöhtes Bad eine Lösung sein. In manchen Fällen kommt eine Pumpe infrage [prüfen]."]],
      ["Abdichtung ist alles", ["Gerade bei bodengleichen Duschen ist eine normgerechte Abdichtung entscheidend. Sie sollte immer vom Fachbetrieb ausgeführt werden."]]
    ],
    faq: [["Geht das auch bei Holzbalkendecken?", "Oft ja – mit flachen Systemen. Wir prüfen das bei der Besichtigung."], ["Wie lange dauert der Umbau?", "Als Teil einer Badsanierung meist [X] Wochen."]]
  },
  {
    slug: "komplettsanierung-reihenfolge", cat: "Planung", tags: "Planung", time: "6 Min.", title: "Komplettsanierung: die richtige Reihenfolge",
    teaser: "Welches Gewerk wann dran ist – und wo sich Zeit sparen lässt.",
    short: "Bei einer Komplettsanierung gilt grob: von grob nach fein, von oben nach unten und von innen nach außen in der Wand. Erst Rückbau, dann Installation, dann Oberflächen.",
    service: "komplettsanierung", ctaTitle: "Alles aus einer Hand.",
    sections: [
      ["1. Rückbau und Bestandsaufnahme", ["Zuerst wird alles entfernt, was erneuert wird. Danach zeigt sich, in welchem Zustand Wände, Böden und Leitungen wirklich sind."], "Eigenes Foto: Wohnung im Rückbau"],
      ["2. Rohinstallation", ["Elektro, Sanitär und Heizung kommen vor dem Trockenbau und dem Putz. Jetzt werden Leitungen verlegt und Vorwände gestellt."]],
      ["3. Wände, Estrich, Fliesen", ["Danach folgen Trockenbau, Putz und gegebenenfalls Estrich – mit ausreichend Trocknungszeit. Anschließend werden Bad und Küche gefliest."]],
      ["4. Oberflächen und Montage", ["Malerarbeiten kommen vor dem Bodenbelag, damit der neue Boden geschützt bleibt. Zum Schluss werden Schalter, Steckdosen, Türen und Sanitärobjekte montiert."]]
    ],
    faq: [["Wie viel Zeit spart eine gute Koordination?", "Oft mehrere Wochen, weil Gewerke nahtlos ineinandergreifen."], ["Wer koordiniert die Gewerke?", "Bei uns Ihr fester Ansprechpartner."]]
  },
  {
    slug: "holzfenster-aufarbeiten-oder-tauschen", cat: "Altbau", tags: "Altbau · Fenster", time: "4 Min.", title: "Holzfenster aufarbeiten oder tauschen?",
    teaser: "Wann sich Schleifen und Lackieren lohnt und wann neue Fenster sinnvoller sind.",
    short: "Gut erhaltene Holzfenster lassen sich oft für einen Bruchteil der Kosten neuer Fenster aufarbeiten. Ist das Holz morsch oder soll die Dämmung deutlich besser werden, sind neue Fenster meist sinnvoller.",
    service: "fenster-tueren", ctaTitle: "Fenster prüfen lassen.",
    sections: [
      ["Wann sich Aufarbeiten lohnt", ["Wenn das Holz im Kern gesund ist, lohnt sich das Aufarbeiten: Alter Lack wird abgeschliffen, Kitt erneuert, das Fenster neu lackiert und mit Dichtungen versehen. So bleibt der Charakter des Hauses erhalten."], "Eigenes Foto: Holzfenster beim Schleifen"],
      ["Wann neue Fenster besser sind", ["Bei morschem Holz, verzogenen Rahmen oder wenn Sie Heizkosten deutlich senken möchten, sind neue Fenster oft die bessere Wahl. Bei denkmalgeschützten Häusern gibt es dafür spezielle Lösungen [prüfen]."]],
      ["Unser Tipp", ["Lassen Sie den Zustand vor Ort prüfen. Oft lassen sich einzelne Fenster aufarbeiten und nur die schlechtesten ersetzen."]]
    ],
    faq: [["Wie lange hält eine Aufarbeitung?", "Bei guter Pflege viele Jahre. [Erfahrungswert einsetzen]"], ["Kann man alte Fenster besser dämmen?", "Mit neuen Dichtungen und ggf. neuer Verglasung lässt sich einiges verbessern. [prüfen]"]]
  }
];
