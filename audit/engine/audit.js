/* audit.js, The Audit revamp (November 19, 2026).
   The one shared engine under the six pages. It runs the team's eight questions one at a time,
   scores them by the team's rule (Yes 100, Partly 50, No or not sure 0, averaged per area and
   overall), shows the result before any name or number is asked, and writes the WhatsApp link
   with the person's own result in English and Punjabi. The words live in check.data.js; this
   file holds none of the team's words, only the mechanics and the new Look E2 words the owner
   asked for on November 19.

   Look E2 (site/e and site/end) turns on a few extra pieces with window.AUDIT_E2 = true:
   the four area photos behind the check, the growth ladder, the contact step that must never be
   skipped, and the WhatsApp message that asks for the full result and a free consultation.
   Looks A, B, C and D do not set that flag, so their behaviour stays exactly as it was. */
(function () {
  "use strict";

  var C = window.CHECK;
  if (!C) return;
  var T = C.text.en, Q = C.questions, BANDS = C.bands;

  var E2 = !!window.AUDIT_E2;

  var CHOICES = [
    { label: "Yes", pts: 100 },
    { label: "Partly", pts: 50 },
    { label: "No or not sure", pts: 0 }
  ];

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var THEME = window.AUDIT_THEME || {};

  function $(id) { return document.getElementById(id); }

  var landing = $("landing"), check = $("check"), result = $("result");
  if (!landing || !check || !result) return;

  var startBtn = $("startBtn");
  var answersEl = $("answers");
  var qcount = $("qcount"), qarea = $("qarea"), qtitle = $("qtitle"), qtext = $("qtext"), qmore = $("qmore");
  var progressFill = $("progressFill");
  var bandEl = $("band"), weakEl = $("weak"), waBtn = $("waBtn");

  var checkBg = $("checkBg");
  var AREA_PHOTO = ["trucks_rockies", "drivers_mountain_snow", "unit_kenworth", "border_bridge"];

  var answers = new Array(Q.length).fill(null);
  var cur = 0;
  var lastResult = null;

  var clocks = {
    hero: window.Clock ? window.Clock.make($("clockHero"), false) : null,
    q: window.Clock ? window.Clock.make($("clockQ"), true) : null,
    result: window.Clock ? window.Clock.make($("clockResult"), true) : null
  };
  var ringChart = window.Charts ? window.Charts.ring($("ring")) : null;

  function countDone() {
    var n = 0;
    for (var i = 0; i < answers.length; i++) if (answers[i] !== null) n++;
    return n;
  }

  function updateProgress() {
    var n = countDone();
    if (progressFill) progressFill.style.width = (n / Q.length * 100) + "%";
    if (clocks.q) clocks.q.setProgress(n);
  }

  function focusTitle() { if (qtitle) qtitle.focus({ preventScroll: true }); }

  function showScreen(el) {
    landing.hidden = el !== landing;
    check.hidden = el !== check;
    result.hidden = el !== result;
    window.scrollTo(0, 0);
  }

  /* E2: dim the photo of the current area behind the glass question card. */
  function setAreaPhoto(area) {
    if (!checkBg) return;
    var imgs = checkBg.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.toggle("on", Number(imgs[i].getAttribute("data-area")) === area);
    }
  }

  function renderQuestion() {
    var q = Q[cur];
    if (qcount) qcount.textContent = "Question " + (cur + 1) + " of " + Q.length;
    if (qarea) qarea.textContent = T.areas[q.area];
    if (qtitle) qtitle.textContent = q.title;
    if (qtext) { qtext.textContent = q.text; qtext.hidden = true; }
    if (qmore) qmore.hidden = false;
    if (answersEl) {
      answersEl.innerHTML = "";
      CHOICES.forEach(function (choice, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "answer";
        b.textContent = choice.label;
        b.addEventListener("click", function () { pick(i); });
        answersEl.appendChild(b);
      });
    }
    if (E2) setAreaPhoto(q.area);
    updateProgress();
  }

  function transition(applyFn, after) {
    if (!window.Pixel) { applyFn(); if (after) after(); return; }
    window.Pixel.break(applyFn, after);
  }

  function pick(i) {
    if (answers[cur] !== null) return;   /* one tap only; a fast second tap must not double-step */
    answers[cur] = i;
    if (answersEl && answersEl.children[i]) answersEl.children[i].classList.add("chosen");
    updateProgress();
    setTimeout(function () {
      cur++;
      if (cur < Q.length) {
        transition(renderQuestion, focusTitle);
      } else {
        transition(function () { showScreen(result); renderResult(); }, function () {
          if (waBtn) waBtn.focus({ preventScroll: true });
        });
      }
    }, reduce ? 0 : 230);
  }

  function compute() {
    var total = 0, area = [0, 0, 0, 0];
    Q.forEach(function (q, i) {
      var p = CHOICES[answers[i]].pts;
      total += p;
      area[q.area] += p;
    });
    var overall = total / Q.length;
    var shown = Math.round(overall);
    var band = BANDS[overall >= 85 ? 0 : overall >= 60 ? 1 : 2];
    var areaPcts = area.map(function (t) { return Math.round(t / 2); });
    var weakIdx = 0;
    for (var a = 1; a < 4; a++) if (areaPcts[a] < areaPcts[weakIdx]) weakIdx = a;
    var allLevel = areaPcts.every(function (p) { return p === areaPcts[0]; });
    var weakest = allLevel ? null : T.areaNames[weakIdx];
    return { shown: shown, band: band, areaPcts: areaPcts, weakIdx: weakIdx, allLevel: allLevel, weakest: weakest };
  }

  /* the short names the bars use so no label is ever cut */
  var AREA_SHORT = ["Company", "Drivers", "Equipment", "Compliance"];

  function weakLine(r) {
    if (r.allLevel) return "All four areas level.";
    if (r.shown >= 85) return "Area to keep an eye on: " + r.weakest;
    return "Weakest area: " + r.weakest;
  }

  function weakLinePa(r) {
    if (r.allLevel) return "ਸਾਰੇ ਚਾਰੇ ਖੇਤਰ ਬਰਾਬਰ ਹਨ।";
    if (r.shown >= 85) return "ਨਜ਼ਰ ਰੱਖਣ ਵਾਲਾ ਖੇਤਰ: " + r.weakest;
    return "ਕਮਜ਼ੋਰ ਖੇਤਰ: " + r.weakest;
  }

  function waText(r) {
    var en = [
      "Hello Prime Compliance, I took the Are you audit ready? check.",
      "My readiness result: " + r.shown + "% (" + r.band.name + ")",
      weakLine(r),
      "I would like to join your small master class meeting."
    ].join("\n");
    var pa = [
      "ਸਤ ਸ੍ਰੀ ਅਕਾਲ Prime Compliance, ਮੈਂ Are you audit ready? ਚੈੱਕ ਕੀਤਾ।",
      "ਮੇਰਾ ਰਿਜ਼ਲਟ: " + r.shown + "% (" + r.band.name + ")",
      weakLinePa(r),
      "ਮੈਂ ਤੁਹਾਡੀ ਛੋਟੀ ਮਾਸਟਰ ਕਲਾਸ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।"
    ].join("\n");
    return en + "\n\n" + pa;
  }

  /* Look E2: the same result, but the request is the full result and a free consultation.
     The Punjabi line is a draft and is marked in NOTES.md for a native speaker's check. */
  function waTextE2(r) {
    var en = [
      "Hello Prime Compliance, I took the Are you audit ready? check.",
      "My readiness result: " + r.shown + "% (" + r.band.name + ")",
      weakLine(r),
      "I would like my full result and a free consultation."
    ].join("\n");
    var pa = [
      "ਸਤ ਸ੍ਰੀ ਅਕਾਲ Prime Compliance, ਮੈਂ Are you audit ready? ਚੈੱਕ ਕੀਤਾ।",
      "ਮੇਰਾ ਰਿਜ਼ਲਟ: " + r.shown + "% (" + r.band.name + ")",
      weakLinePa(r),
      "ਮੈਂ ਆਪਣਾ ਪੂਰਾ ਰਿਜ਼ਲਟ ਅਤੇ ਮੁਫ਼ਤ ਸਲਾਹ ਲੈਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।"
    ].join("\n");
    return en + "\n\n" + pa;
  }

  function waUrl(r) {
    return "https://wa.me/17809097200?text=" + encodeURIComponent(E2 ? waTextE2(r) : waText(r));
  }

  /* The growth ladder: the team's three bands drawn as three steps climbing left to right,
     with "You are here" on the person's step and a glowing arrow on the next step up. */
  var LADDER_RANGES = ["85 to 100", "60 to 84", "0 to 59"];   /* indexed like BANDS */

  function renderLadder(r) {
    var stepsEl = $("ladderSteps"), lineEl = $("ladderLine");
    if (!stepsEl) return;
    var idx = r.band === BANDS[0] ? 2 : r.band === BANDS[1] ? 1 : 0;   /* ascending: 0, 60, 85 */
    var order = [2, 1, 0];
    stepsEl.innerHTML = "";
    order.forEach(function (bi, i) {
      var b = BANDS[bi];
      var step = document.createElement("div");
      step.className = "step" + (i === idx ? " here" : "") + (i === idx + 1 ? " next" : "");
      step.setAttribute("data-band", String(i));
      var name = document.createElement("span");
      name.className = "step-name";
      name.textContent = b.name;
      var range = document.createElement("span");
      range.className = "step-range";
      range.textContent = LADDER_RANGES[bi];
      step.appendChild(name);
      step.appendChild(range);
      if (i === idx) {
        var marker = document.createElement("span");
        marker.className = "marker";
        marker.textContent = "You are here";
        step.appendChild(marker);
      }
      if (i === idx + 1) {
        var arrow = document.createElement("span");
        arrow.className = "up-arrow";
        arrow.setAttribute("aria-hidden", "true");
        step.appendChild(arrow);
      }
      stepsEl.appendChild(step);
    });
    if (lineEl) lineEl.textContent = idx === 2 ? "Stay at the top." : "Better standards are one step up.";
  }

  function renderResult() {
    var r = compute();
    lastResult = r;
    if (ringChart) ringChart.set(r.shown, THEME.ringDur);
    if (!E2 && window.Charts) {
      window.Charts.areas($("areaChart"), r.areaPcts.map(function (p, i) {
        return { name: AREA_SHORT[i], pct: p, weak: !r.allLevel && i === r.weakIdx };
      }), { stagger: !!THEME.staggerBars });
      window.Charts.answersMap($("answerChart"), answers);
    }
    if (clocks.result) clocks.result.setProgress(8);
    if (THEME.settle && result) {
      result.classList.add("settle");
      if (E2) {
        var head = result.querySelector(".result-head");
        if (head) head.classList.add("settle");
      }
    }
    if (bandEl) bandEl.textContent = r.band.name;
    if (weakEl) weakEl.textContent = weakLine(r);
    if (waBtn) waBtn.href = waUrl(r);
    if (E2) renderLadder(r);
  }

  /* ---------- Look E2: the contact step that must never be skipped ---------- */

  var contactForm, contactField, swapField, consent, sendBtn, sentEl, fieldMode = "phone";

  function phoneValid(v) {
    var digits = v.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }

  function emailValid(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function fieldValid() {
    if (!contactField) return false;
    var v = contactField.value.trim();
    return fieldMode === "phone" ? phoneValid(v) : emailValid(v);
  }

  function updateSend() {
    if (sendBtn) sendBtn.disabled = !(consent && consent.checked && fieldValid());
  }

  function initContact() {
    contactForm = $("contactForm");
    contactField = $("contactField");
    swapField = $("swapField");
    consent = $("consent");
    sendBtn = $("sendBtn");
    sentEl = $("sent");
    if (!contactForm || !contactField) return;

    contactField.addEventListener("input", updateSend);
    if (consent) consent.addEventListener("change", updateSend);

    if (swapField) swapField.addEventListener("click", function () {
      fieldMode = fieldMode === "phone" ? "email" : "phone";
      contactField.value = "";
      if (fieldMode === "email") {
        contactField.type = "email";
        contactField.autocomplete = "email";
        contactField.inputMode = "email";
        contactField.placeholder = "Your email";
        swapField.textContent = "Use phone instead";
      } else {
        contactField.type = "tel";
        contactField.autocomplete = "tel";
        contactField.inputMode = "tel";
        contactField.placeholder = "Your WhatsApp number";
        swapField.textContent = "Use email instead";
      }
      updateSend();
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!fieldValid() || !consent || !consent.checked) return;
      var value = contactField.value.trim();
      var r = lastResult || compute();
      var url = waUrl(r);

      /* Adarsh sets this to the CRM form address. It is intentionally empty here so that the
         page never waits on, and never depends on, the CRM. */
      var crm = window.AUDIT_CRM;
      if (crm && crm.endpoint) {
        try {
          var n = crm.names || {};
          var summary = "The Audit: " + r.shown + "%, " + r.band.name + ". " + weakLine(r) +
            ". Areas: " + T.areaNames.map(function (nm, i) { return nm + " " + r.areaPcts[i] + "%"; }).join(", ") +
            ". Answers: " + answers.map(function (a) { return CHOICES[a].label; }).join(" / ") +
            ". Consent ticked for WhatsApp. Page: " + (/\/end\//.test(location.pathname) ? "video end page" : "main") +
            ". " + new Date().toISOString();
          var fields = {};
          Object.keys(crm.fixed || {}).forEach(function (k) { fields[k] = crm.fixed[k]; });
          if (fieldMode === "phone") fields[n.phone || "phone"] = value;
          else fields[n.email || "email"] = value;
          fields[n.result || "message"] = summary;
          if (crm.as === "json") {
            window.fetch(crm.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) }).catch(function () {});
          } else {
            window.fetch(crm.endpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams(fields) }).catch(function () {});
          }
        } catch (err) {}
      } else if (window.AUDIT_ENDPOINT) {
        try {
          var payload = {
            result: r.shown,
            band: r.band.name,
            areas: r.areaPcts,
            answers: answers.map(function (a) { return CHOICES[a].label; }),
            consent: true,
            page: /\/end\//.test(location.pathname) ? "end" : "e",
            time: new Date().toISOString()
          };
          if (fieldMode === "phone") payload.phone = value;
          else payload.email = value;
          window.fetch(window.AUDIT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }).catch(function () {});
        } catch (err) {}
      }

      if (sentEl) sentEl.hidden = false;
      if (sendBtn) sendBtn.disabled = true;
      setTimeout(function () {
        try { window.open(url, "_blank", "noopener"); }
        catch (err) { window.location.href = url; }
      }, 120);
    });

    updateSend();
  }

  /* ---------- Look E2: the landing photos, parallax and pixel reveal ---------- */

  function initLandingFx() {
    var bands = Array.prototype.slice.call(document.querySelectorAll(".photo-band"));
    if (!bands.length) return;
    if (reduce) {
      bands.forEach(function (b) { b.classList.add("revealed"); });
      return;
    }

    var ticking = false;
    function parallax() {
      var y = window.pageYOffset || window.scrollY;
      for (var i = 0; i < bands.length; i++) {
        var img = bands[i].querySelector(".band-img");
        if (!img) continue;
        var rect = bands[i].getBoundingClientRect();
        var top = rect.top + y;
        var delta = y - top;
        if (Math.abs(delta) < window.innerHeight + rect.height) {
          img.style.transform = "translate3d(0," + (delta * -0.12).toFixed(1) + "px,0)";
        }
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
    }, { passive: true });
    parallax();

    if ("IntersectionObserver" in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.__revealed) {
            entry.target.__revealed = true;
            if (window.Pixel && window.Pixel.reveal) window.Pixel.reveal(entry.target);
            else entry.target.classList.add("revealed");
          }
        });
      }, { threshold: 0.2 });
      bands.forEach(function (b) { io.observe(b); });
    }
  }

  if (startBtn) startBtn.addEventListener("click", function () {
    transition(function () { showScreen(check); renderQuestion(); }, focusTitle);
  });

  if (qmore) qmore.addEventListener("click", function () {
    if (qtext) qtext.hidden = false;
    qmore.hidden = true;
    if (qtext) qtext.focus();
  });

  if (E2) {
    initContact();
    initLandingFx();
  }

  /* The home page's first question (Nov 19, 2026): a link ending in #q1-0, #q1-1 or #q1-2 keeps that answer
     to question 1 and opens The Audit at question 2. Any other address opens the landing as before. */
  var carried = /^#q1-([0-9])$/.exec(location.hash || "");
  if (carried && +carried[1] < CHOICES.length) {
    answers[0] = +carried[1];
    cur = 1;
    showScreen(check);
    renderQuestion();
    focusTitle();
  } else {
    showScreen(landing);
    renderQuestion();
  }
})();
