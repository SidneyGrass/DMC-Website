/* Redaktionssystem DMC Immobilien – Oberfläche (ohne Abhängigkeiten) */
(function () {
  "use strict";
  var S = window.CMS_SCHEMA, ORDER = window.CMS_ORDER;
  var app = document.getElementById("app");
  var state = { session: null, cache: {}, pending: [], previews: {}, dirty: false, publishing: null };

  // ---------------------------------------------------------------- Helfer
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else if (k === "value") el.value = v;
      else if (k === "checked") el.checked = !!v;
      else el.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(function (x) { add(el, x); });
    else el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  function svg(d, size) {
    var s = '<svg aria-hidden="true" width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
    var w = document.createElement("span"); w.className = "ico"; w.innerHTML = s; return w;
  }
  var I = {
    plus: "M12 5v14 M5 12h14", edit: "M4 20h4L19 9l-4-4L4 16z M14 6l4 4", trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", up: "M12 19V5 M6 11l6-6 6 6", down: "M12 5v14 M6 13l6 6 6-6",
    left: "M15 6l-6 6 6 6", right: "M9 6l6 6-6 6", x: "M6 6l12 12 M18 6L6 18", img: "M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M15 9.5a1.5 1.5 0 1 0 0-.01",
    home: "M3 11l9-7 9 7 M5 10v10h14V10", out: "M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10", ext: "M14 4h6v6 M20 4l-9 9 M18 14v6H4V6h6", file: "M6 3h8l4 4v14H6z M14 3v4h4",
    check: "M5 12l5 5 9-10", search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4", menu: "M4 7h16M4 12h16M4 17h16", help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14 M12 17.5v.01"
  };
  function toast(msg, kind) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.className = "toast" + (kind ? " toast--" + kind : ""); t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, kind === "error" ? 7000 : 3500);
  }
  function slugify(s) {
    return String(s || "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
  }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dateDe(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? m[3] + "." + m[2] + "." + m[1] : iso || ""; }
  function clone(o) { return JSON.parse(JSON.stringify(o == null ? null : o)); }

  function api(action, opts) {
    opts = opts || {};
    var qs = "action=" + action + (opts.query ? "&" + Object.keys(opts.query).map(function (k) { return k + "=" + encodeURIComponent(opts.query[k]); }).join("&") : "");
    return fetch("/api/cms?" + qs, {
      method: opts.body ? "POST" : "GET", credentials: "same-origin",
      headers: opts.body ? { "Content-Type": "application/json", "X-CMS": "1" } : {},
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401 && action !== "login") { state.session = { loggedIn: false, configured: true }; render(); }
        if (!r.ok) throw new Error(j.error || "Fehler " + r.status);
        return j;
      });
    });
  }
  function imgSrc(url) { return state.previews[url] || url; }
  function imgFallback(img, url) { img.onerror = function () { img.onerror = null; img.src = "/api/cms?action=raw&path=" + encodeURIComponent(url); }; }

  // ---------------------------------------------------------------- Upload
  function readAsBase64(blob) {
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result).split(",")[1]); }; r.onerror = rej; r.readAsDataURL(blob); });
  }
  function shrink(file) {
    if (file.type === "application/pdf") return Promise.resolve({ blob: file, mime: file.type });
    if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type) && !/\.(jpe?g|png|webp|heic)$/i.test(file.name)) return Promise.reject(new Error("Bitte ein Foto (JPG, PNG, WebP) oder eine PDF-Datei wählen."));
    if (file.type === "image/png" && file.size < 900 * 1024) return Promise.resolve({ blob: file, mime: "image/png" });
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var max = 2000, w = img.naturalWidth, hgt = img.naturalHeight, f = Math.min(1, max / Math.max(w, hgt));
        var c = document.createElement("canvas"); c.width = Math.round(w * f); c.height = Math.round(hgt * f);
        var ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? res({ blob: b, mime: "image/jpeg" }) : rej(new Error("Bild konnte nicht verarbeitet werden.")); }, "image/jpeg", 0.84);
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error("Dieses Bildformat wird vom Browser nicht unterstützt. Bitte als JPG speichern.")); };
      img.src = url;
    });
  }
  function upload(file) {
    return shrink(file).then(function (s) {
      if (s.blob.size > 3.2 * 1024 * 1024) throw new Error("„" + file.name + "“ ist zu groß (max. 3 MB).");
      return readAsBase64(s.blob).then(function (b64) {
        return api("upload", { body: { name: file.name, mime: s.mime, data: b64 } }).then(function (r) {
          state.pending.push({ path: r.path, blob: r.blob });
          state.previews[r.url] = URL.createObjectURL(s.blob);
          return r.url;
        });
      });
    });
  }

  // ---------------------------------------------------------------- Felder
  // Jedes Feld liefert { el, get }
  var FIELDS = {
    heading: function (f) { return { el: h("h3", { class: "f-heading", text: f.label }), get: null }; },
    text: function (f, v) {
      var id = "f" + Math.random().toString(36).slice(2, 8), dl;
      var inp = h("input", { class: "inp", id: id, type: "text", value: v || "", placeholder: f.placeholder, required: f.required, inputmode: f.inputmode, list: f.options ? id + "-l" : null, oninput: dirty });
      if (f.options) dl = h("datalist", { id: id + "-l" }, f.options.map(function (o) { return h("option", { value: o }); }));
      return { el: wrap(f, id, [inp, dl]), get: function () { return inp.value.trim(); }, input: inp };
    },
    number: function (f, v) {
      var id = uid(); var inp = h("input", { class: "inp", id: id, type: "number", value: v == null ? "" : v, oninput: dirty });
      return { el: wrap(f, id, inp), get: function () { return inp.value === "" ? "" : Number(inp.value); } };
    },
    date: function (f, v, isNew) {
      var id = uid(); var inp = h("input", { class: "inp", id: id, type: "date", value: v || (isNew && f.today ? today() : ""), oninput: dirty });
      return { el: wrap(f, id, inp), get: function () { return inp.value; } };
    },
    textarea: function (f, v) {
      var id = uid(); var ta = h("textarea", { class: "inp", id: id, rows: f.rows || 3, required: f.required, maxlength: f.max }, v || "");
      var cnt = f.max ? h("span", { class: "f-count" }) : null;
      var upd = function () { if (cnt) cnt.textContent = ta.value.length + " / " + f.max; };
      ta.addEventListener("input", function () { upd(); dirty(); }); upd();
      return { el: wrap(f, id, [ta, cnt]), get: function () { return ta.value.trim(); } };
    },
    md: function (f, v) {
      var id = uid(); var ta = h("textarea", { class: "inp inp--md", id: id, rows: f.rows || 5, oninput: dirty }, v || "");
      var wrapSel = function (a, b, ph) {
        var s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || ph;
        ta.setRangeText(a + sel + b, s, e, "select"); ta.focus(); dirty();
      };
      var bar = h("div", { class: "md-bar" },
        h("button", { type: "button", title: "Fett", onclick: function () { wrapSel("**", "**", "fetter Text"); } }, h("b", { text: "B" })),
        h("button", { type: "button", title: "Kursiv", onclick: function () { wrapSel("*", "*", "kursiver Text"); } }, h("i", { text: "I" })),
        h("button", { type: "button", title: "Link", onclick: function () { var u = prompt("Adresse des Links (https://… oder /kontakt):", "https://"); if (u) wrapSel("[", "](" + u + ")", "Linktext"); } }, "Link"),
        h("button", { type: "button", title: "Aufzählung", onclick: function () {
          var s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || "Punkt";
          ta.setRangeText(sel.split("\n").map(function (l) { return "- " + l.replace(/^[-•*]\s+/, ""); }).join("\n"), s, e, "select"); ta.focus(); dirty();
        } }, "• Liste"),
        h("span", { class: "md-hint", text: "Leerzeile = neuer Absatz" }));
      return { el: wrap(f, id, [bar, ta]), get: function () { return ta.value.trim(); } };
    },
    select: function (f, v) {
      var id = uid();
      var sel = h("select", { class: "inp", id: id, onchange: dirty }, f.options.map(function (o) {
        var val = Array.isArray(o) ? o[0] : o, lab = Array.isArray(o) ? o[1] : (o === "" ? "— bitte wählen —" : o);
        return h("option", { value: val, text: lab });
      }));
      if (v != null && v !== "") { if (![].some.call(sel.options, function (o) { return o.value === String(v); })) sel.appendChild(h("option", { value: v, text: v })); sel.value = String(v); }
      return { el: wrap(f, id, sel), get: function () { return sel.value; } };
    },
    ref: function (f, v) {
      var id = uid(); var sel = h("select", { class: "inp", id: id, onchange: dirty }, h("option", { value: "", text: "— keins —" }));
      loadList(f.collection).then(function (items) {
        items.forEach(function (it) { sel.appendChild(h("option", { value: it.slug, text: it.title || it.slug })); });
        sel.value = v || "";
      }).catch(function () {});
      return { el: wrap(f, id, sel), get: function () { return sel.value; } };
    },
    toggle: function (f, v, isNew) {
      var on = v == null ? (isNew ? f.def !== false : true) : !!v;
      var cb = h("input", { type: "checkbox", checked: on, onchange: function () { dirty(); txt.textContent = cb.checked ? "Ja – sichtbar" : "Nein – Entwurf"; } });
      var txt = h("span", { text: on ? "Ja – sichtbar" : "Nein – Entwurf" });
      return { el: h("div", { class: "field field--toggle" }, h("span", { class: "f-label", text: f.label }), h("label", { class: "switch" }, cb, h("i"), txt), f.hint ? h("span", { class: "f-hint", text: f.hint }) : null), get: function () { return cb.checked; } };
    },
    range: function (f, v) {
      var id = uid(); var val = v == null || v === "" ? 0 : Number(v);
      var out = h("output", { class: "range-out", text: val + (f.unit || "") });
      var r = h("input", { type: "range", id: id, min: f.min, max: f.max, step: f.step, value: val, oninput: function () { out.textContent = r.value + (f.unit || ""); dirty(); } });
      return { el: wrap(f, id, h("div", { class: "range" }, r, out)), get: function () { return Number(r.value); } };
    },
    list: function (f, v) {
      var id = uid(); var ta = h("textarea", { class: "inp", id: id, rows: Math.max(3, (v || []).length + 1), oninput: dirty }, (v || []).join("\n"));
      return { el: wrap(f, id, ta), get: function () { return ta.value.split("\n").map(function (x) { return x.replace(/^[-•*]\s+/, "").trim(); }).filter(Boolean); } };
    },
    image: function (f, v) {
      var value = v || "";
      var box = h("div", { class: "img-box" });
      var input = h("input", { type: "file", accept: "image/*", hidden: true, onchange: function () { if (input.files[0]) doUpload(input.files[0]); input.value = ""; } });
      function doUpload(file) {
        box.classList.add("is-busy"); paint("Wird hochgeladen …");
        upload(file).then(function (url) { value = url; dirty(); paint(); }).catch(function (e) { toast(e.message, "error"); paint(); }).then(function () { box.classList.remove("is-busy"); });
      }
      function paint(msg) {
        box.innerHTML = "";
        if (msg) { box.appendChild(h("span", { class: "img-box__msg", text: msg })); return; }
        if (value) {
          var img = h("img", { src: imgSrc(value), alt: "" }); imgFallback(img, value);
          add(box, [img, h("div", { class: "img-box__acts" },
            h("button", { type: "button", class: "btn btn--sm", onclick: function () { input.click(); } }, "Ersetzen"),
            h("button", { type: "button", class: "btn btn--sm btn--ghost", onclick: function () { value = ""; dirty(); paint(); } }, "Entfernen"))]);
        } else {
          box.appendChild(h("button", { type: "button", class: "img-box__empty", onclick: function () { input.click(); } }, svg(I.img, 28), h("span", { text: "Foto auswählen oder hierher ziehen" })));
        }
      }
      dropzone(box, function (files) { if (files[0]) doUpload(files[0]); });
      paint();
      return { el: wrap(f, null, [box, input]), get: function () { return value; } };
    },
    images: function (f, v) {
      var list = (v || []).slice();
      var grid = h("div", { class: "thumbs" });
      var input = h("input", { type: "file", accept: "image/*", multiple: true, hidden: true, onchange: function () { many([].slice.call(input.files)); input.value = ""; } });
      var addBtn = h("button", { type: "button", class: "btn btn--sm", onclick: function () { input.click(); } }, svg(I.plus, 16), "Fotos hinzufügen");
      var busy = h("span", { class: "f-hint" });
      function many(files) {
        if (f.max) files = files.slice(0, Math.max(0, f.max - list.length));
        var n = files.length, done = 0;
        if (!n) return;
        busy.textContent = "Lade 0 von " + n + " …";
        files.reduce(function (p, file) {
          return p.then(function () { return upload(file).then(function (url) { list.push(url); dirty(); paint(); }).catch(function (e) { toast(e.message, "error"); }).then(function () { done++; busy.textContent = done < n ? "Lade " + done + " von " + n + " …" : ""; }); });
        }, Promise.resolve());
      }
      function paint() {
        grid.innerHTML = "";
        list.forEach(function (url, i) {
          var img = h("img", { src: imgSrc(url), alt: "" }); imgFallback(img, url);
          grid.appendChild(h("div", { class: "thumb" }, img, h("div", { class: "thumb__acts" },
            h("button", { type: "button", title: "Nach vorne", disabled: i === 0, onclick: function () { list.splice(i - 1, 0, list.splice(i, 1)[0]); dirty(); paint(); } }, svg(I.left, 16)),
            h("button", { type: "button", title: "Nach hinten", disabled: i === list.length - 1, onclick: function () { list.splice(i + 1, 0, list.splice(i, 1)[0]); dirty(); paint(); } }, svg(I.right, 16)),
            h("button", { type: "button", title: "Entfernen", onclick: function () { list.splice(i, 1); dirty(); paint(); } }, svg(I.x, 16)))));
        });
        addBtn.hidden = f.max && list.length >= f.max;
      }
      dropzone(grid, many);
      paint();
      return { el: wrap(f, null, [grid, h("div", { class: "row" }, addBtn, busy), input]), get: function () { return list.slice(); } };
    },
    file: function (f, v) {
      var value = v || "";
      var info = h("div", { class: "file-row" });
      var input = h("input", { type: "file", accept: "application/pdf", hidden: true, onchange: function () {
        var file = input.files[0]; input.value = ""; if (!file) return;
        info.textContent = "Wird hochgeladen …";
        upload(file).then(function (url) { value = url; dirty(); paint(); }).catch(function (e) { toast(e.message, "error"); paint(); });
      } });
      function paint() {
        info.innerHTML = "";
        if (value) add(info, [svg(I.file, 18), h("a", { href: state.previews[value] || value, target: "_blank", rel: "noopener", text: value.split("/").pop() }),
          h("button", { type: "button", class: "btn btn--sm btn--ghost", onclick: function () { value = ""; dirty(); paint(); } }, "Entfernen")]);
        else add(info, h("button", { type: "button", class: "btn btn--sm", onclick: function () { input.click(); } }, svg(I.file, 16), "PDF auswählen (max. 3 MB)"));
      }
      paint();
      return { el: wrap(f, null, [info, input]), get: function () { return value; } };
    },
    group: function (f, v, isNew) {
      var sub = form(f.fields, v || {}, isNew);
      return { el: h("fieldset", { class: "group" }, h("legend", { text: f.label }), f.hint ? h("p", { class: "f-hint", text: f.hint }) : null, sub.el), get: sub.get };
    },
    repeater: function (f, v, isNew) {
      var rows = [];
      var holder = h("div", { class: "rep" + (f.inline ? " rep--inline" : "") });
      function addRow(data, top, fresh) {
        var sub = form(f.fields, data || {}, fresh);
        var row = { sub: sub };
        row.el = h("div", { class: "rep__row" },
          h("div", { class: "rep__body" }, sub.el),
          h("div", { class: "rep__acts" },
            h("button", { type: "button", title: "Nach oben", onclick: function () { move(row, -1); } }, svg(I.up, 16)),
            h("button", { type: "button", title: "Nach unten", onclick: function () { move(row, 1); } }, svg(I.down, 16)),
            h("button", { type: "button", title: "Löschen", class: "danger", onclick: function () { if (!f.inline && !confirm("Diesen Eintrag entfernen?")) return; rows.splice(rows.indexOf(row), 1); row.el.remove(); dirty(); } }, svg(I.trash, 16))));
        if (top) { rows.unshift(row); holder.insertBefore(row.el, holder.firstChild); } else { rows.push(row); holder.appendChild(row.el); }
        return row;
      }
      function move(row, d) {
        var i = rows.indexOf(row), j = i + d; if (j < 0 || j >= rows.length) return;
        rows.splice(i, 1); rows.splice(j, 0, row);
        holder.innerHTML = ""; rows.forEach(function (r) { holder.appendChild(r.el); }); dirty();
      }
      (v || []).forEach(function (d) { addRow(d, false, false); });
      var btn = h("button", { type: "button", class: "btn btn--sm", onclick: function () {
        var r = addRow({}, f.addTop, true); dirty();
        var first = r.el.querySelector("input:not([type=hidden]):not([type=date]), textarea"); if (first) first.focus();
      } }, svg(I.plus, 16), f.add || "Hinzufügen");
      return {
        el: h("div", { class: "field field--full", "data-key": f.key }, h("span", { class: "f-label", text: f.label }), f.hint ? h("span", { class: "f-hint", text: f.hint }) : null, f.addTop ? h("div", { class: "row" }, btn) : null, holder, f.addTop ? null : h("div", { class: "row" }, btn)),
        get: function () {
          return rows.map(function (r) { return r.sub.get(); }).filter(function (o) { return Object.keys(o).some(function (k) { var x = o[k]; return Array.isArray(x) ? x.length : x !== "" && x != null; }); });
        }
      };
    }
  };
  function uid() { return "f" + Math.random().toString(36).slice(2, 9); }
  function wrap(f, id, control) {
    return h("div", { class: "field" + (f.width ? " field--" + f.width : " field--full") },
      h(id ? "label" : "span", { class: "f-label", for: id }, f.label, f.required ? h("span", { class: "req", text: " *" }) : null),
      control, f.hint ? h("span", { class: "f-hint", text: f.hint }) : null);
  }
  function dropzone(el, cb) {
    el.addEventListener("dragover", function (e) { e.preventDefault(); el.classList.add("is-drop"); });
    el.addEventListener("dragleave", function () { el.classList.remove("is-drop"); });
    el.addEventListener("drop", function (e) { e.preventDefault(); el.classList.remove("is-drop"); cb([].slice.call(e.dataTransfer.files)); });
  }
  function form(fields, data, isNew) {
    var parts = [];
    var el = h("div", { class: "fgrid" });
    fields.forEach(function (f) {
      var r = FIELDS[f.type](f, f.key ? data[f.key] : null, isNew);
      parts.push([f, r]); el.appendChild(r.el);
    });
    return {
      el: el, parts: parts,
      get: function () {
        var o = {};
        parts.forEach(function (p) { if (p[1].get) o[p[0].key] = p[1].get(); });
        return o;
      }
    };
  }
  function dirty() { state.dirty = true; }
  window.addEventListener("beforeunload", function (e) { if (state.dirty) { e.preventDefault(); e.returnValue = ""; } });

  // ---------------------------------------------------------------- Daten
  function loadList(type, force) {
    if (!force && state.cache[type]) return Promise.resolve(state.cache[type]);
    return api("list", { query: { type: type } }).then(function (r) {
      var items = r.items.sort(function (a, b) { return (Number(a.order) || 999) - (Number(b.order) || 999) || String(a.title).localeCompare(String(b.title), "de"); });
      state.cache[type] = items; return items;
    });
  }

  // ---------------------------------------------------------------- Ansichten
  function shell(active, content) {
    var nav = h("nav", { class: "side__nav" },
      h("a", { href: "#/", class: active === "" ? "is-active" : null }, svg(I.home), "Übersicht"),
      ORDER.map(function (k) { return h("a", { href: "#/" + k, class: active === k ? "is-active" : null }, svg(S[k].icon), S[k].label); }),
      h("a", { href: "#/hilfe", class: active === "hilfe" ? "is-active" : null }, svg(I.help), "Hilfe"));
    var side = h("aside", { class: "side" },
      h("div", { class: "side__brand" }, h("img", { src: "/img/dmc/dmc-logo-weiss.svg", alt: "DMC Immobilien" }), h("span", { text: "Redaktion" })),
      h("button", { type: "button", class: "side__toggle", "aria-label": "Menü", onclick: function () { side.classList.toggle("is-open"); } }, svg(I.menu, 22)),
      nav,
      h("div", { class: "side__foot" },
        h("a", { href: "/", target: "_blank", rel: "noopener" }, svg(I.ext, 16), "Website ansehen"),
        h("button", { type: "button", onclick: logout }, svg(I.out, 16), "Abmelden"),
        state.session && state.session.branch && state.session.branch !== "main" ? h("span", { class: "side__branch", text: "Branch: " + state.session.branch }) : null));
    app.innerHTML = "";
    app.appendChild(h("div", { class: "layout" }, side, h("main", { class: "main" }, publishBar(), content)));
    window.scrollTo(0, 0);
  }
  function publishBar() {
    var p = state.publishing;
    if (!p) return null;
    var map = { pending: ["is-pending", "Gespeichert – die Website wird aktualisiert (ca. 1 Minute) …"], success: ["is-ok", "Online: Die Änderungen sind jetzt auf der Website."], failure: ["is-err", "Die Website konnte nicht aktualisiert werden. Bitte Inhalt prüfen oder Sidney Bescheid geben."], error: ["is-err", "Die Website konnte nicht aktualisiert werden. Bitte Inhalt prüfen oder Sidney Bescheid geben."], unknown: ["is-pending", "Gespeichert – die Website wird in 1–2 Minuten aktualisiert."] };
    var m = map[p.state] || map.unknown;
    return h("div", { class: "pubbar " + m[0], id: "pubbar" }, h("span", { text: m[1] }), p.state === "success" && p.path ? h("a", { href: p.path, target: "_blank", rel: "noopener" }, "Ansehen ", svg(I.ext, 14)) : null);
  }
  function watchPublish(sha, path) {
    state.publishing = { sha: sha, state: "pending", path: path, start: Date.now() };
    var tick = function () {
      var p = state.publishing; if (!p || p.sha !== sha) return;
      api("status", { query: { sha: sha } }).then(function (r) {
        if (!state.publishing || state.publishing.sha !== sha) return;
        var st = r.state === "unknown" && Date.now() - p.start < 30000 ? "pending" : r.state;
        p.state = st; refreshBar();
        if (st === "pending" && Date.now() - p.start < 300000) setTimeout(tick, 6000);
        else if (st === "success") setTimeout(function () { if (state.publishing && state.publishing.sha === sha) { state.publishing = null; refreshBar(); } }, 20000);
      }).catch(function () { setTimeout(tick, 10000); });
    };
    setTimeout(tick, 5000);
  }
  function refreshBar() {
    var old = document.getElementById("pubbar"), nu = publishBar(), main = document.querySelector(".main");
    if (old && nu) old.replaceWith(nu); else if (old) old.remove(); else if (nu && main) main.insertBefore(nu, main.firstChild);
  }

  function viewLogin() {
    var s = state.session || {};
    var pw = h("input", { class: "inp", type: "password", id: "pw", autocomplete: "current-password", required: true, autofocus: true });
    var err = h("p", { class: "login__err", role: "alert" });
    var btn = h("button", { class: "btn btn--primary", type: "submit" }, "Anmelden");
    var f = h("form", { class: "login", onsubmit: function (e) {
      e.preventDefault(); err.textContent = ""; btn.disabled = true; btn.textContent = "Bitte warten …";
      api("login", { body: { password: pw.value } }).then(function () { return api("session"); }).then(function (r) { state.session = r; route(); })
        .catch(function (e2) { err.textContent = e2.message; pw.select(); }).then(function () { btn.disabled = false; btn.textContent = "Anmelden"; });
    } },
      h("img", { src: "/img/dmc/dmc-logo-grau.svg", alt: "DMC Immobilien", class: "login__logo" }),
      h("h1", { text: "Redaktion" }),
      h("p", { class: "muted", text: "Hier pflegen Sie Bauvorhaben, Immobilienangebote, Ratgeber-Artikel und mehr." }),
      s.configured === false ? h("p", { class: "login__err", text: "Das Redaktionssystem ist noch nicht eingerichtet (ADMIN_PASSWORD / GITHUB_TOKEN fehlen in Vercel)." }) : null,
      h("label", { for: "pw", class: "f-label", text: "Passwort" }), pw, err, btn);
    app.innerHTML = ""; app.appendChild(h("div", { class: "login-wrap" }, f));
    pw.focus();
  }

  function viewDashboard() {
    var cards = h("div", { class: "cards" });
    var content = h("div", {},
      h("header", { class: "page-h" }, h("div", {}, h("h1", { text: "Willkommen in der Redaktion" }), h("p", { class: "muted", text: "Wählen Sie, was Sie bearbeiten möchten. Jede Änderung ist nach dem Speichern in ca. einer Minute online." }))),
      h("section", { class: "quick" }, h("h2", { text: "Schnell erledigt" }), h("div", { class: "quick__row" },
        h("a", { class: "quick__btn", href: "#/bauvorhaben/tagebuch" }, svg(I.plus), "Neuer Bautagebuch-Eintrag"),
        h("a", { class: "quick__btn", href: "#/immobilien/neu" }, svg(I.plus), "Neues Immobilienangebot"),
        h("a", { class: "quick__btn", href: "#/ratgeber/neu" }, svg(I.plus), "Neuer Ratgeber-Artikel"),
        h("a", { class: "quick__btn", href: "#/referenzen/neu" }, svg(I.plus), "Neue Referenz"))),
      cards);
    shell("", content);
    ORDER.forEach(function (k) {
      var c = S[k];
      var count = h("span", { class: "card__count", text: c.single ? "" : "…" });
      cards.appendChild(h("a", { class: "card", href: "#/" + k }, svg(c.icon, 26), h("strong", { text: c.label }), h("span", { class: "muted", text: c.intro }), count));
      if (!c.single) loadList(k).then(function (items) {
        var pub = items.filter(function (i) { return i.published !== false; }).length;
        count.textContent = items.length + (items.length === 1 ? " Eintrag" : " Einträge") + (items.length - pub ? " · " + (items.length - pub) + " Entwurf" + (items.length - pub > 1 ? "e" : "") : "");
      }).catch(function () { count.textContent = ""; });
    });
  }

  function viewList(type) {
    var c = S[type];
    var search = h("input", { class: "inp inp--search", type: "search", placeholder: "Suchen …", "aria-label": "Suchen", oninput: function () { paint(); } });
    var body = h("div", { class: "list" }, h("p", { class: "muted", text: "Wird geladen …" }));
    var content = h("div", {},
      h("header", { class: "page-h" },
        h("div", {}, h("h1", { text: c.label }), h("p", { class: "muted", text: c.intro })),
        h("a", { class: "btn btn--primary", href: "#/" + type + "/neu" }, svg(I.plus, 18), c.one + " anlegen")),
      h("div", { class: "toolbar" }, search), body);
    shell(type, content);
    var items = [];
    function paint() {
      var q = search.value.trim().toLowerCase();
      var shown = items.filter(function (it) { return !q || JSON.stringify(it).toLowerCase().indexOf(q) >= 0; });
      body.innerHTML = "";
      if (!items.length) { body.appendChild(h("div", { class: "empty" }, h("p", { text: "Noch keine Einträge." }), h("a", { class: "btn btn--primary", href: "#/" + type + "/neu" }, svg(I.plus, 18), "Ersten Eintrag anlegen"))); return; }
      if (!shown.length) { body.appendChild(h("p", { class: "muted", text: "Keine Treffer." })); return; }
      shown.forEach(function (it) {
        var thumbUrl = it.titelbild || it.cover || it.foto || it.nachher || (it.galerie && it.galerie[0]) || "";
        var thumb = thumbUrl ? h("img", { src: imgSrc(thumbUrl), alt: "", loading: "lazy" }) : svg(c.icon, 22);
        if (thumbUrl) imgFallback(thumb, thumbUrl);
        var meta = (c.columns || []).map(function (k) { var v = it[k]; return k === "date" ? dateDe(v) : k === "sterne" && v ? v + " ★" : v; }).filter(Boolean).join(" · ");
        body.appendChild(h("div", { class: "item" },
          h("a", { class: "item__main", href: "#/" + type + "/bearbeiten/" + it.slug },
            h("span", { class: "item__thumb" }, thumb),
            h("span", { class: "item__txt" }, h("strong", { text: it.title || it.slug }), h("span", { class: "muted", text: meta }))),
          it.published === false ? h("span", { class: "pill pill--draft", text: "Entwurf" }) : h("span", { class: "pill pill--live", text: "Online" }),
          h("div", { class: "item__acts" },
            h("a", { class: "icon-btn", href: "#/" + type + "/bearbeiten/" + it.slug, title: "Bearbeiten" }, svg(I.edit, 18)),
            it.published !== false && c.path ? h("a", { class: "icon-btn", href: c.path === "/" || c.path === "/karriere" ? c.path : c.path + it.slug, target: "_blank", rel: "noopener", title: "Auf der Website ansehen" }, svg(I.eye, 18)) : null,
            h("button", { type: "button", class: "icon-btn danger", title: "Löschen", onclick: function () { remove(type, it); } }, svg(I.trash, 18)))));
      });
    }
    loadList(type, true).then(function (r) { items = r; paint(); }).catch(function (e) { body.innerHTML = ""; body.appendChild(h("p", { class: "login__err", text: e.message })); });
  }

  function remove(type, it) {
    if (!confirm("„" + (it.title || it.slug) + "“ wirklich löschen?\n\nTipp: Statt zu löschen können Sie den Eintrag auch nur ausblenden (Entwurf).")) return;
    api("delete", { body: { type: type, slug: it.slug } }).then(function (r) {
      toast("Gelöscht.", "ok"); delete state.cache[type]; watchPublish(r.sha, ""); viewList(type);
    }).catch(function (e) { toast(e.message, "error"); });
  }

  function viewEdit(type, slug, opts) {
    opts = opts || {};
    var c = S[type], isNew = !slug && !c.single;
    shell(type, h("p", { class: "muted", text: "Wird geladen …" }));
    var load = c.single ? api("get", { query: { type: type } }).then(function (r) { return r.item || {}; })
      : isNew ? Promise.resolve({}) : api("get", { query: { type: type, slug: slug } }).then(function (r) { if (!r.item) throw new Error("Eintrag nicht gefunden."); return r.item; });
    load.then(function (data) { renderEditor(type, slug, data, isNew, opts); }).catch(function (e) { shell(type, h("p", { class: "login__err", text: e.message })); });
  }

  function renderEditor(type, slug, data, isNew, opts) {
    var c = S[type];
    state.pending = []; state.dirty = false;
    var f = form(c.fields, data, isNew);
    var slugTouched = !isNew;
    var slugInp = h("input", { class: "inp inp--slug", value: slug || "", "aria-label": "Adresse der Seite", oninput: function () { slugTouched = true; slugInp.value = slugify(slugInp.value).replace(/-$/, "") + (slugInp.value.slice(-1) === "-" ? "-" : ""); dirty(); } });
    var titlePart = f.parts.filter(function (p) { return p[0].key === "title"; })[0];
    if (titlePart && titlePart[1].input) titlePart[1].input.addEventListener("input", function () { if (!slugTouched) slugInp.value = slugify(titlePart[1].input.value); });
    var slugRow = !c.single && c.path && c.path !== "/" && c.path !== "/karriere" ? h("div", { class: "slug" }, h("span", { class: "muted", text: location.host + c.path }), slugInp) : null;
    var saveBtn = h("button", { type: "submit", class: "btn btn--primary" }, svg(I.check, 18), "Speichern & veröffentlichen");
    var el = h("form", { class: "editor", novalidate: true, onsubmit: function (e) { e.preventDefault(); save(); } },
      h("header", { class: "page-h page-h--sticky" },
        h("div", {}, h("a", { class: "back", href: c.single ? "#/" : "#/" + type, onclick: function (e) { if (state.dirty && !confirm("Änderungen verwerfen?")) e.preventDefault(); else state.dirty = false; } }, "← " + (c.single ? "Übersicht" : c.label)),
          h("h1", { text: c.single ? c.label : isNew ? c.one + " anlegen" : (data.title || slug) })),
        h("div", { class: "page-h__acts" },
          !isNew && !c.single && c.path && data.published !== false ? h("a", { class: "btn btn--ghost", href: c.path === "/" || c.path === "/karriere" ? c.path : c.path + slug, target: "_blank", rel: "noopener" }, svg(I.eye, 18), "Ansehen") : null,
          saveBtn)),
      c.intro && c.single ? h("p", { class: "muted", text: c.intro }) : null,
      slugRow, f.el,
      h("div", { class: "editor__foot" }, saveBtn.cloneNode(true)));
    shell(type, el);
    if (opts.focus) { var t = el.querySelector(opts.focus); if (t) setTimeout(function () { t.scrollIntoView({ block: "center" }); var i = t.querySelector("input:not([type=date]), textarea"); if (i) i.focus(); }, 50); }

    function save() {
      var d = f.get();
      var missing = c.fields.filter(function (x) { return x.required && !d[x.key]; });
      if (missing.length) { toast("Bitte ausfüllen: " + missing.map(function (x) { return x.label; }).join(", "), "error"); return; }
      var newSlug = c.single ? "" : slugify(slugInp.value || d.title);
      if (!c.single && !newSlug) { toast("Bitte einen Titel eingeben.", "error"); return; }
      [].forEach.call(el.querySelectorAll("button[type=submit]"), function (b) { b.disabled = true; b.lastChild.textContent = "Wird gespeichert …"; });
      // Felder, die das Formular nicht kennt, beibehalten
      var merged = Object.assign({}, data, d);
      api("save", { body: { type: type, slug: newSlug, oldSlug: isNew ? "" : slug, isNew: isNew, data: merged, uploads: state.pending } }).then(function (r) {
        state.dirty = false; state.pending = []; delete state.cache[type];
        toast("Gespeichert.", "ok");
        var path = c.single ? "/" : merged.published === false ? "" : (c.path === "/" || c.path === "/karriere" ? c.path : c.path + newSlug);
        watchPublish(r.sha, path);
        if (c.single) viewEdit(type); else location.hash = "#/" + type;
      }).catch(function (e) {
        toast(e.message, "error");
        [].forEach.call(el.querySelectorAll("button[type=submit]"), function (b) { b.disabled = false; b.lastChild.textContent = "Speichern & veröffentlichen"; });
      });
    }
  }

  // Schnellaktion: Bautagebuch-Eintrag
  function viewDiary() {
    var content = h("div", {}, h("header", { class: "page-h" }, h("div", {}, h("a", { class: "back", href: "#/" }, "← Übersicht"), h("h1", { text: "Neuer Bautagebuch-Eintrag" }), h("p", { class: "muted", text: "Für welches Bauvorhaben?" }))), h("div", { class: "list", id: "dl" }, h("p", { class: "muted", text: "Wird geladen …" })));
    shell("bauvorhaben", content);
    loadList("bauvorhaben", true).then(function (items) {
      var l = document.getElementById("dl"); l.innerHTML = "";
      if (!items.length) l.appendChild(h("p", { class: "muted", text: "Noch keine Bauvorhaben angelegt." }));
      items.forEach(function (it) {
        l.appendChild(h("a", { class: "item item--link", href: "#/bauvorhaben/bearbeiten/" + it.slug + "?tagebuch" }, h("span", { class: "item__main" }, h("span", { class: "item__thumb" }, svg(S.bauvorhaben.icon, 22)), h("span", { class: "item__txt" }, h("strong", { text: it.title }), h("span", { class: "muted", text: [it.status, it.ort].filter(Boolean).join(" · ") }))), svg(I.right, 18)));
      });
    });
  }

  function viewHelp() {
    var ex = function (a, b) { return h("tr", {}, h("td", {}, h("code", { text: a })), h("td", { html: b })); };
    shell("hilfe", h("div", { class: "help" },
      h("header", { class: "page-h" }, h("div", {}, h("h1", { text: "Hilfe" }))),
      h("section", {}, h("h2", { text: "So funktioniert’s" }), h("ol", {},
        h("li", { text: "Links einen Bereich wählen (z. B. Bauvorhaben)." }),
        h("li", { text: "Eintrag anlegen oder bearbeiten, Fotos einfach hineinziehen." }),
        h("li", { text: "„Speichern & veröffentlichen“ klicken – nach ca. 1 Minute ist die Änderung online. Oben erscheint dann „Online“." }),
        h("li", { text: "Noch nicht fertig? Schalter „Auf der Website anzeigen“ ausschalten = Entwurf." }))),
      h("section", {}, h("h2", { text: "Text formatieren" }), h("table", { class: "help__t" }, h("tbody", {},
        ex("**wichtig**", "<strong>wichtig</strong>"), ex("*betont*", "<em>betont</em>"), ex("[Kontakt](/kontakt)", '<a href="#">Kontakt</a>'),
        ex("- Punkt eins\n- Punkt zwei", "• Punkt eins<br>• Punkt zwei"), ex("(Leerzeile)", "neuer Absatz"),
        ex("| Posten | Preis |\n| --- | --- |\n| Bad | 15.000 € |", "Tabelle")))),
      h("section", {}, h("h2", { text: "Fotos" }), h("p", { text: "Fotos werden beim Hochladen automatisch verkleinert. Am besten querformatige Fotos verwenden. Bitte nur eigene Fotos oder Fotos mit Nutzungsrecht hochladen – und keine erkennbaren Personen ohne deren Einverständnis." })),
      h("section", {}, h("h2", { text: "Immobilienanzeigen" }), h("p", { text: "Bei Verkauf und Vermietung schreibt das Gebäudeenergiegesetz (§ 87 GEG) Angaben aus dem Energieausweis in der Anzeige vor: Art des Ausweises, Energiekennwert, wesentlicher Energieträger, Baujahr und – falls vorhanden – Effizienzklasse. Bitte im Abschnitt „Energieausweis“ ausfüllen." }))));
  }

  function logout() { api("logout", { body: {} }).catch(function () {}).then(function () { state.session = { loggedIn: false, configured: true }; location.hash = "#/"; render(); }); }

  // ---------------------------------------------------------------- Router
  function route() {
    var hash = location.hash.replace(/^#\/?/, "");
    var q = hash.split("?"), parts = q[0].split("/").filter(Boolean);
    var type = parts[0];
    if (!type) return viewDashboard();
    if (type === "hilfe") return viewHelp();
    if (!S[type]) { location.hash = "#/"; return; }
    if (S[type].single) return viewEdit(type);
    if (type === "bauvorhaben" && parts[1] === "tagebuch") return viewDiary();
    if (parts[1] === "neu") return viewEdit(type, "");
    if (parts[1] === "bearbeiten" && parts[2]) return viewEdit(type, parts[2], q[1] === "tagebuch" ? { focus: "[data-key=updates] .rep__row", diary: true } : {});
    return viewList(type);
  }
  var lastHash = location.hash;
  window.addEventListener("hashchange", function () {
    if (state.dirty && !confirm("Ungespeicherte Änderungen verwerfen?")) { history.replaceState(null, "", lastHash); return; }
    state.dirty = false; lastHash = location.hash;
    if (state.session && state.session.loggedIn) route();
  });
  function render() { if (!state.session || !state.session.loggedIn) viewLogin(); else route(); }

  // Bautagebuch-Schnellaktion: direkt neuen Eintrag oben öffnen
  var origRender = renderEditor;
  renderEditor = function (type, slug, data, isNew, opts) {
    if (opts && opts.diary) { data = clone(data); data.updates = [{ datum: today(), titel: "", text: "", bild: "" }].concat(data.updates || []); }
    origRender(type, slug, data, isNew, opts);
    if (opts && opts.diary) state.dirty = true;
  };

  api("session").then(function (s) { state.session = s; render(); }).catch(function () { state.session = { loggedIn: false }; render(); });
})();
