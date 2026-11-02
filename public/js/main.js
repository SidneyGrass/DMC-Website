/* DMC Immobilien – Interaktion (ohne Abhängigkeiten) */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignorieren */ } }
  };
  var params = new URLSearchParams(window.location.search);
  var norm = function (v) { return String(v || "").trim().toLowerCase(); };

  /* ---------- Mega-Menü (Desktop) ---------- */
  var megaBtns = $$("[data-mega-toggle]");
  var openMega = null;
  var closeMega = function (focusBtn) {
    if (!openMega) return;
    var btn = openMega;
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
    openMega = null;
    if (focusBtn) btn.focus();
  };
  var showMega = function (btn) {
    if (openMega && openMega !== btn) closeMega(false);
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    openMega = btn;
  };
  megaBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (openMega === btn) closeMega(false); else showMega(btn);
    });
  });
  $$("[data-mega-close]").forEach(function (b) { b.addEventListener("click", function () { closeMega(true); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && openMega) closeMega(true); });
  document.addEventListener("click", function (e) {
    if (!openMega) return;
    var panel = document.getElementById(openMega.getAttribute("aria-controls"));
    if (openMega.contains(e.target) || (panel && panel.contains(e.target))) return;
    closeMega(false);
  });
  window.addEventListener("resize", function () { if (openMega && window.innerWidth < 1140) closeMega(false); });

  /* ---------- Mobiles Menü + Akkordeons ---------- */
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
      if (e.key === "Escape" && menu.classList.contains("is-open")) { toggle.click(); toggle.focus(); }
    });
  }
  $$("[data-acc]").forEach(function (btn) {
    var sub = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      $$("[data-acc]").forEach(function (o) {
        if (o === btn) return;
        o.setAttribute("aria-expanded", "false");
        var s = document.getElementById(o.getAttribute("aria-controls"));
        if (s) s.hidden = true;
      });
      btn.setAttribute("aria-expanded", String(open));
      if (sub) sub.hidden = !open;
    });
  });

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

  /* ---------- Immobilien: Kaufen/Mieten, Ort, Objektart, Preis ---------- */
  $$("[data-immo-filter]").forEach(function (form) {
    var grid = $(form.getAttribute("data-target"));
    var counter = $(form.getAttribute("data-count"));
    if (!grid) return;
    var tabs = $$(".seg__btn", form);
    var region = $("#i-ort", form), type = $("#i-art", form), price = $("#i-preis", form);
    var kind = "";
    var apply = function () {
      var max = parseInt((price.value || "").replace(/[^\d]/g, ""), 10);
      var n = 0;
      $$("[data-kind]", grid).forEach(function (item) {
        var ok = (!kind || item.getAttribute("data-kind") === kind) &&
          (!region.value || item.getAttribute("data-region") === region.value) &&
          (!type.value || item.getAttribute("data-type") === type.value) &&
          (!max || Number(item.getAttribute("data-price")) <= max);
        item.hidden = !ok;
        if (ok) n++;
      });
      if (counter) counter.textContent = n + (n === 1 ? " Angebot" : " Angebote");
      var empty = $("[data-filter-empty]", grid.parentNode);
      if (empty) empty.hidden = n !== 0;
    };
    var pick = function (btn) {
      kind = btn.getAttribute("data-kind");
      tabs.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      apply();
    };
    tabs.forEach(function (btn) { btn.addEventListener("click", function () { pick(btn); }); });
    [region, type].forEach(function (el) { el.addEventListener("change", apply); });
    form.addEventListener("submit", function (e) { e.preventDefault(); apply(); });
    var pre = norm(params.get("art"));
    var preBtn = tabs.filter(function (b) { return b.getAttribute("data-param-value") === pre; })[0];
    if (preBtn) pick(preBtn);
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
    var lbImg = $(".ph img", lb);
    var lbCap = $(".lightbox__cap", lb);
    var lastFocus = null;
    var close = function () { lb.classList.remove("is-open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
    $$("[data-lightbox]").forEach(function (el) {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", "Bild vergrößern: " + el.getAttribute("data-lightbox"));
      var open = function () {
        lastFocus = el;
        var label = el.getAttribute("data-lightbox");
        var src = $("img", el);
        if (lbPh) lbPh.textContent = label;
        if (lbImg && src) { lbImg.src = src.currentSrc || src.src; lbImg.alt = src.alt || label; lbImg.style.objectPosition = src.style.objectPosition || ""; }
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

  /* ---------- Auswahl-Buttons (einfach / mehrfach) ---------- */
  var choiceGroups = $$("[data-choice]");
  var syncChoice = function (group) {
    var hidden = $("input[type=hidden]", group);
    var vals = $$(".option[aria-pressed=true]", group).map(function (b) { return b.getAttribute("data-value"); });
    if (hidden) hidden.value = vals.join(", ");
    group.dispatchEvent(new CustomEvent("choicechange", { bubbles: true }));
  };
  var pressOption = function (group, btn) {
    var multi = group.getAttribute("data-choice") === "multi";
    if (multi) btn.setAttribute("aria-pressed", String(btn.getAttribute("aria-pressed") !== "true"));
    else $$(".option", group).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
    syncChoice(group);
  };
  choiceGroups.forEach(function (group) {
    $$(".option", group).forEach(function (btn) {
      btn.setAttribute("data-default", btn.getAttribute("aria-pressed") || "false");
      btn.addEventListener("click", function () { pressOption(group, btn); });
    });
    syncChoice(group);
  });
  var resetChoices = function (ctx) {
    $$("[data-choice]", ctx).forEach(function (group) {
      $$(".option", group).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-default")); });
      syncChoice(group);
    });
  };
  // Vorauswahl per URL, z. B. ?anliegen=neubau, ?leistung=Badsanierung, ?art=Wohnung&plz=22399
  var prefill = function (form) {
    $$("[data-param]", form).forEach(function (el) {
      var val = params.get(el.getAttribute("data-param"));
      if (!val) return;
      if (el.hasAttribute("data-choice")) {
        var match = $$(".option", el).filter(function (b) { return norm(b.getAttribute("data-value")) === norm(val) || norm(b.getAttribute("data-key")) === norm(val); })[0];
        if (!match) return;
        if (el.getAttribute("data-choice") === "multi") $$(".option", el).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        else $$(".option", el).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        pressOption(el, match);
        var implies = el.getAttribute("data-implies");
        if (implies) {
          var parts = implies.split(":");
          var g = $('[data-param="' + parts[0] + '"]', form);
          var b = g && $$(".option", g).filter(function (o) { return o.getAttribute("data-key") === parts[1] || norm(o.getAttribute("data-value")) === parts[1]; })[0];
          if (b && b.getAttribute("aria-pressed") !== "true") pressOption(g, b);
        }
      } else if ("value" in el) {
        el.value = val;
      }
    });
  };

  /* ---------- Validierung (Kontakt, Bewertung, Exposé, Bewerbung) ---------- */
  var validate = function (scope, err) {
    err.textContent = "";
    var fail = function (msg, el) { err.textContent = msg; if (el && el.focus) el.focus(); return false; };
    var groups = $$("[data-require-choice]", scope);
    for (var i = 0; i < groups.length; i++) {
      if (!$$(".option[aria-pressed=true]", groups[i]).length) return fail(groups[i].getAttribute("data-error-msg") || "Bitte treffen Sie eine Auswahl.", $(".option", groups[i]));
    }
    var req = $$("[data-required]", scope);
    for (var j = 0; j < req.length; j++) {
      if (!req[j].value.trim()) return fail(req[j].getAttribute("data-error-msg") || "Bitte füllen Sie alle Pflichtfelder aus.", req[j]);
    }
    var pat = $$("[data-pattern]", scope);
    for (var k = 0; k < pat.length; k++) {
      var v = pat[k].value.trim();
      if (v && !new RegExp(pat[k].getAttribute("data-pattern")).test(v)) return fail(pat[k].getAttribute("data-error-msg") || "Bitte prüfen Sie Ihre Eingabe.", pat[k]);
    }
    var oneOf = (scope.hasAttribute && scope.hasAttribute("data-one-of") ? [scope] : []).concat($$("[data-one-of]", scope));
    for (var m = 0; m < oneOf.length; m++) {
      var fields = oneOf[m].getAttribute("data-one-of").split(",").map(function (s) { return $(s.trim()); }).filter(Boolean);
      if (!fields.some(function (f) { return f.value.trim(); })) return fail(oneOf[m].getAttribute("data-error-msg") || "Bitte geben Sie eine Kontaktmöglichkeit an.", fields[0]);
    }
    var mails = $$("input[type=email]", scope);
    for (var n = 0; n < mails.length; n++) {
      if (mails[n].value.trim() && !mails[n].checkValidity()) return fail("Bitte prüfen Sie die E-Mail-Adresse.", mails[n]);
    }
    return true;
  };

  var send = function (form, onDone, onFail) {
    var endpoint = form.getAttribute("action");
    if (endpoint && endpoint !== "#") {
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error(); onDone(); })
        .catch(onFail);
    } else {
      onDone();
    }
  };

  /* ---------- Mehrstufige Formulare (Kontakt mit Verzweigung, Bewertung) ---------- */
  $$("[data-wizard]").forEach(function (wizard) {
    var allSteps = $$(".wizard__step", wizard);
    var branchName = wizard.getAttribute("data-branch-input");
    var branchInput = branchName ? $('input[type=hidden][name="' + branchName + '"]', wizard) : null;
    var submitLabel = wizard.getAttribute("data-submit-label") || "Absenden";
    var idx = 0;
    var bar = $(".progress__bar div", wizard);
    var stepNo = $("[data-step-no]", wizard);
    var stepTotal = $("[data-step-total]", wizard);
    var stepName = $("[data-step-name]", wizard);
    var back = $("[data-back]", wizard);
    var next = $("[data-next]", wizard);
    var err = $("[data-error]", wizard);
    var progress = $(".progress", wizard);
    var nav = $(".wizard__nav", wizard);
    var done = $("[data-done]", wizard);
    var msgTarget = $("[data-msg-target]", wizard);

    var branch = function () { return branchInput ? branchInput.value : ""; };
    var steps = function () {
      return allSteps.filter(function (s) { return !s.hasAttribute("data-branch") || s.getAttribute("data-branch") === branch(); });
    };
    var render = function () {
      var list = steps();
      if (idx > list.length - 1) idx = list.length - 1;
      allSteps.forEach(function (s) {
        s.hidden = s !== list[idx];
        // Felder nicht gewählter Zweige werden nicht mitgesendet
        if (s.hasAttribute("data-branch")) s.disabled = s.getAttribute("data-branch") !== branch();
      });
      bar.style.width = Math.round((idx + 1) / list.length * 100) + "%";
      stepNo.textContent = String(idx + 1);
      if (stepTotal) stepTotal.textContent = String(list.length);
      stepName.textContent = list[idx].getAttribute("data-name") || "";
      back.disabled = idx === 0;
      next.textContent = idx === list.length - 1 ? submitLabel : "Weiter →";
    };
    var updateMsg = function () {
      if (!msgTarget || !branchInput) return;
      var b = $('[data-choice] .option[aria-pressed=true][data-msg]', wizard);
      if (b) msgTarget.setAttribute("placeholder", b.getAttribute("data-msg"));
    };
    wizard.addEventListener("choicechange", function () { updateMsg(); });

    prefill(wizard);
    updateMsg();

    back.addEventListener("click", function () { if (idx > 0) { idx--; err.textContent = ""; render(); wizard.scrollIntoView({ block: "start" }); } });

    wizard.addEventListener("submit", function (e) {
      e.preventDefault();
      var list = steps();
      if (!validate(list[idx], err)) return;
      if (idx < list.length - 1) {
        idx++; render();
        var f = $("input:not([type=hidden]), textarea, select, button.option", steps()[idx]);
        if (f) f.focus({ preventScroll: true });
        return;
      }
      next.disabled = true; next.textContent = "Wird gesendet …";
      send(wizard, function () {
        allSteps.forEach(function (s) { s.hidden = true; });
        progress.hidden = true; nav.hidden = true; err.textContent = ""; done.hidden = false;
        done.focus({ preventScroll: true });
        done.scrollIntoView({ block: "center" });
        next.disabled = false;
      }, function () {
        err.textContent = "Senden fehlgeschlagen. Bitte rufen Sie uns an oder versuchen Sie es erneut.";
        next.disabled = false; next.textContent = submitLabel;
      });
    });

    var restart = $("[data-restart]", wizard);
    if (restart) restart.addEventListener("click", function () {
      wizard.reset(); resetChoices(wizard); idx = 0;
      progress.hidden = false; nav.hidden = false; done.hidden = true;
      $$(".upload__files", wizard).forEach(function (o) { o.textContent = ""; });
      updateMsg(); render();
      var f = $("button.option", steps()[0]);
      if (f) f.focus();
    });
    render();
  });

  /* ---------- Einfache Formulare (Exposé-Anfrage, Schnellbewerbung) ---------- */
  $$("[data-simple-form]").forEach(function (form) {
    var err = $("[data-error]", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form, err)) return;
      send(form, function () {
        form.hidden = true;
        var ok = $(form.getAttribute("data-success"));
        if (ok) { ok.hidden = false; ok.focus(); }
      }, function () { err.textContent = "Senden fehlgeschlagen. Bitte rufen Sie uns an oder versuchen Sie es erneut."; });
    });
  });

  /* ---------- 404-Suche ---------- */
  var search = $("[data-search]");
  if (search) {
    search.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = ($("input", search).value || "").toLowerCase().trim();
      var map = [["bad", "/leistungen/badsanierung"], ["komplett", "/leistungen/komplettsanierung"], ["altbau", "/leistungen/altbausanierung"], ["maler", "/leistungen/malerarbeiten"], ["elektr", "/leistungen/elektroarbeiten"], ["sanit", "/leistungen/sanitaer-heizung"], ["heiz", "/leistungen/sanitaer-heizung"], ["energ", "/leistungen/energetische-sanierung"], ["fenster", "/leistungen/fenster-tueren"], ["tür", "/leistungen/fenster-tueren"], ["boden", "/leistungen/boden"], ["parkett", "/leistungen/boden"], ["trocken", "/leistungen/trockenbau"], ["neubau", "/neubau"], ["bauen", "/neubau"], ["verkauf", "/immobilie-verkaufen"], ["bewert", "/immobilie-verkaufen"], ["verwalt", "/hausverwaltung"], ["immobil", "/immobilien"], ["kauf", "/immobilien"], ["miet", "/immobilien"], ["wohnung", "/immobilien"], ["referenz", "/referenzen"], ["projekt", "/referenzen"], ["kontakt", "/kontakt"], ["anfrage", "/kontakt"], ["job", "/karriere"], ["karriere", "/karriere"], ["ausbildung", "/karriere"], ["förder", "/ratgeber"], ["kosten", "/ratgeber"], ["ablauf", "/ablauf"]];
      for (var i = 0; i < map.length; i++) { if (q.indexOf(map[i][0]) !== -1) { window.location.href = map[i][1]; return; } }
      window.location.href = "/leistungen";
    });
  }

  /* ---------- Cookie-Banner ---------- */
  var cookie = $("#cookie");
  if (cookie) {
    var KEY = "bwhh-consent"; // Schlüssel beibehalten, damit bestehende Einwilligungen gültig bleiben
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
