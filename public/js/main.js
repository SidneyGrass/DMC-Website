/* Bauwerk HH – Interaktion (ohne Abhängigkeiten) */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignorieren */ } }
  };

  /* ---------- Mobiles Menü ---------- */
  var toggle = $("[data-menu-toggle]");
  var menu = $("#mobile-menu");
  if (toggle && menu) {
    var iconOpen = "M4 7h16M4 12h16M4 17h16";
    var iconClose = "M6 6l12 12M18 6L6 18";
    toggle.addEventListener("click", function () {
      var open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      var p = toggle.querySelector("path");
      if (p) p.setAttribute("d", open ? iconClose : iconOpen);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) toggle.click();
    });
  }

  /* ---------- Vorher/Nachher-Slider ---------- */
  $$(".ba").forEach(function (el) {
    var range = el.querySelector(".ba__range");
    if (!range) return;
    var set = function () { el.style.setProperty("--pos", range.value + "%"); };
    range.addEventListener("input", set);
    set();
  });

  /* ---------- Filter (Referenzen & Ratgeber) ---------- */
  $$("[data-filter-group]").forEach(function (group) {
    var target = $(group.getAttribute("data-filter-target"));
    if (!target) return;
    var counter = $(group.getAttribute("data-filter-count") || "#__none");
    var extra = $(group.getAttribute("data-filter-select") || "#__none");
    var current = "Alle";
    var apply = function () {
      var area = extra ? extra.value : "";
      var n = 0;
      $$("[data-cat]", target).forEach(function (item) {
        var okCat = current === "Alle" || item.getAttribute("data-cat") === current;
        var okArea = !area || item.getAttribute("data-area") === area;
        var show = okCat && okArea;
        item.hidden = !show;
        if (show) n++;
      });
      if (counter) counter.textContent = n + (n === 1 ? " Projekt" : " Projekte");
      var empty = $("[data-filter-empty]", target.parentNode);
      if (empty) empty.hidden = n !== 0;
    };
    $$("button[data-value]", group).forEach(function (btn) {
      btn.addEventListener("click", function () {
        current = btn.getAttribute("data-value");
        $$("button[data-value]", group).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        apply();
      });
    });
    if (extra) extra.addEventListener("change", apply);
  });

  /* „Mehr laden“ */
  $$("[data-load-more]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var grid = $(btn.getAttribute("data-load-more"));
      $$("[data-more]", grid).forEach(function (el) { el.removeAttribute("data-more"); el.classList.remove("is-more"); });
      btn.parentNode.removeChild(btn);
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox");
  if (lb) {
    var lbPh = $(".ph__label span", lb);
    var lbCap = $(".lightbox__cap", lb);
    var lastFocus = null;
    var close = function () { lb.classList.remove("is-open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
    $$("[data-lightbox]").forEach(function (el) {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      var open = function () {
        lastFocus = el;
        var label = el.getAttribute("data-lightbox");
        if (lbPh) lbPh.textContent = label;
        if (lbCap) lbCap.textContent = label;
        lb.classList.add("is-open");
        document.body.style.overflow = "hidden";
        $(".lightbox__close", lb).focus();
      };
      el.addEventListener("click", open);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    $(".lightbox__close", lb).addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("is-open")) close(); });
  }

  /* ---------- Datei-Upload: Dateinamen anzeigen ---------- */
  $$(".upload input[type=file]").forEach(function (input) {
    input.addEventListener("change", function () {
      var out = input.parentNode.querySelector(".upload__files");
      if (!out) return;
      var files = Array.prototype.slice.call(input.files || []);
      if (files.length > 10) { out.textContent = "Bitte maximal 10 Bilder auswählen."; input.value = ""; return; }
      out.textContent = files.length ? files.length + " Datei(en): " + files.map(function (f) { return f.name; }).join(", ") : "";
    });
  });

  /* ---------- Mehrstufiges Anfrageformular ---------- */
  var wizard = $("[data-wizard]");
  if (wizard) {
    var steps = $$(".wizard__step", wizard);
    var names = ["Leistung", "Objekt", "Zeitraum", "Beschreibung & Fotos", "Kontakt"];
    var idx = 0;
    var bar = $(".progress__bar div", wizard);
    var stepNo = $("[data-step-no]", wizard);
    var stepName = $("[data-step-name]", wizard);
    var back = $("[data-back]", wizard);
    var next = $("[data-next]", wizard);
    var err = $("[data-error]", wizard);
    var progress = $(".progress", wizard);
    var nav = $(".wizard__nav", wizard);
    var done = $("[data-done]", wizard);

    // Auswahl-Buttons (mehrfach / einfach)
    $$("[data-choice]", wizard).forEach(function (group) {
      var multi = group.getAttribute("data-choice") === "multi";
      var hidden = $("input[type=hidden]", group);
      var sync = function () {
        var vals = $$(".option[aria-pressed=true]", group).map(function (b) { return b.getAttribute("data-value"); });
        if (hidden) hidden.value = vals.join(", ");
      };
      $$(".option", group).forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (multi) {
            btn.setAttribute("aria-pressed", String(btn.getAttribute("aria-pressed") !== "true"));
          } else {
            $$(".option", group).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
          }
          sync();
        });
      });
      sync();
    });

    // Vorauswahl über ?leistung=
    var params = new URLSearchParams(window.location.search);
    var pre = params.get("leistung");
    if (pre) {
      var b = $('[data-choice=multi] .option[data-value="' + pre.replace(/"/g, "") + '"]', wizard);
      if (b) { $$("[data-choice=multi] .option", wizard).forEach(function (o) { o.setAttribute("aria-pressed", "false"); }); b.click(); }
    }

    var validate = function () {
      err.textContent = "";
      if (idx === 0) {
        if (!$$("[data-choice=multi] .option[aria-pressed=true]", wizard).length) { err.textContent = "Bitte wählen Sie mindestens eine Leistung."; return false; }
      }
      if (idx === 1) {
        var plz = $("#f-plz", wizard);
        if (!/^\d{5}$/.test(plz.value.trim())) { err.textContent = "Bitte geben Sie eine gültige 5-stellige PLZ ein."; plz.focus(); return false; }
      }
      if (idx === 4) {
        var name = $("#f-name", wizard), tel = $("#f-tel", wizard), mail = $("#f-mail", wizard);
        if (!name.value.trim()) { err.textContent = "Bitte geben Sie Ihren Namen an."; name.focus(); return false; }
        if (!tel.value.trim() && !mail.value.trim()) { err.textContent = "Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an."; tel.focus(); return false; }
        if (mail.value.trim() && !mail.checkValidity()) { err.textContent = "Bitte prüfen Sie die E-Mail-Adresse."; mail.focus(); return false; }
      }
      return true;
    };

    var render = function () {
      steps.forEach(function (s, i) { s.hidden = i !== idx; });
      bar.style.width = ((idx + 1) * 20) + "%";
      stepNo.textContent = String(idx + 1);
      stepName.textContent = names[idx];
      back.disabled = idx === 0;
      next.textContent = idx === steps.length - 1 ? "Anfrage senden" : "Weiter →";
    };

    back.addEventListener("click", function () { if (idx > 0) { idx--; err.textContent = ""; render(); wizard.scrollIntoView({ block: "start" }); } });

    wizard.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      if (idx < steps.length - 1) { idx++; render(); var f = $("input, textarea, button.option", steps[idx]); if (f) f.focus({ preventScroll: true }); return; }

      // Absenden
      var endpoint = wizard.getAttribute("action");
      var finish = function () {
        steps.forEach(function (s) { s.hidden = true; });
        progress.hidden = true; nav.hidden = true; done.hidden = false;
        done.scrollIntoView({ block: "center" });
      };
      if (endpoint && endpoint !== "#") {
        next.disabled = true; next.textContent = "Wird gesendet …";
        fetch(endpoint, { method: "POST", body: new FormData(wizard), headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw new Error(); finish(); })
          .catch(function () { err.textContent = "Senden fehlgeschlagen. Bitte rufen Sie uns an oder versuchen Sie es erneut."; })
          .then(function () { next.disabled = false; next.textContent = "Anfrage senden"; });
      } else {
        finish();
      }
    });

    var restart = $("[data-restart]", wizard);
    if (restart) restart.addEventListener("click", function () { wizard.reset(); idx = 0; progress.hidden = false; nav.hidden = false; done.hidden = true; $$(".upload__files", wizard).forEach(function (o) { o.textContent = ""; }); render(); });
    render();
  }

  /* ---------- Schnellbewerbung ---------- */
  var apply = $("[data-apply]");
  if (apply) {
    apply.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("[data-error]", apply);
      msg.textContent = "";
      if (!$("#k-name", apply).value.trim() || !$("#k-tel", apply).value.trim()) { msg.textContent = "Bitte Name und Telefon angeben."; return; }
      apply.hidden = true;
      var ok = $("#apply-done");
      if (ok) { ok.hidden = false; ok.focus(); }
    });
  }

  /* ---------- 404-Suche ---------- */
  var search = $("[data-search]");
  if (search) {
    search.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = ($("input", search).value || "").toLowerCase().trim();
      var map = [["bad", "/leistungen/badsanierung"], ["komplett", "/leistungen/komplettsanierung"], ["altbau", "/leistungen/altbausanierung"], ["maler", "/leistungen/malerarbeiten"], ["elektr", "/leistungen/elektroarbeiten"], ["sanit", "/leistungen/sanitaer-heizung"], ["heiz", "/leistungen/sanitaer-heizung"], ["energ", "/leistungen/energetische-sanierung"], ["fenster", "/leistungen/fenster-tueren"], ["tür", "/leistungen/fenster-tueren"], ["boden", "/leistungen/boden"], ["parkett", "/leistungen/boden"], ["trocken", "/leistungen/trockenbau"], ["referenz", "/referenzen"], ["projekt", "/referenzen"], ["kontakt", "/kontakt"], ["anfrage", "/kontakt"], ["job", "/karriere"], ["karriere", "/karriere"], ["ausbildung", "/karriere"], ["förder", "/ratgeber"], ["kosten", "/ratgeber"], ["ablauf", "/ablauf"]];
      for (var i = 0; i < map.length; i++) { if (q.indexOf(map[i][0]) !== -1) { window.location.href = map[i][1]; return; } }
      window.location.href = "/leistungen";
    });
  }

  /* ---------- Cookie-Banner ---------- */
  var cookie = $("#cookie");
  if (cookie) {
    var KEY = "bwhh-consent";
    var stat = $("#c-stat", cookie);
    var saveConsent = function (val) { store.set(KEY, JSON.stringify({ stat: val, t: Date.now() })); cookie.classList.remove("is-open"); };
    if (!store.get(KEY)) cookie.classList.add("is-open");
    $("[data-cookie=deny]", cookie).addEventListener("click", function () { saveConsent(false); });
    $("[data-cookie=accept]", cookie).addEventListener("click", function () { saveConsent(true); });
    $("[data-cookie=settings]", cookie).addEventListener("click", function () {
      var s = $(".cookie__settings", cookie);
      var open = !s.classList.contains("is-open");
      s.classList.toggle("is-open", open);
      this.textContent = open ? "Auswahl speichern" : "Einstellungen";
      if (!open) saveConsent(stat.checked);
    });
    $$("[data-cookie-open]").forEach(function (b) {
      b.addEventListener("click", function () {
        try { var c = JSON.parse(store.get(KEY) || "{}"); stat.checked = !!c.stat; } catch (e) { /* leer */ }
        cookie.classList.add("is-open");
      });
    });
  }
})();
