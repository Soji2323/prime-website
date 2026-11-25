/* Build three, the first build made of today (November 19, 2026): the motion of the page.
   What it does: the clean vector clock arrives once, sharp from its first frame, with its words and the four area names
   (round four; nothing on it moves afterwards); the first screen's words arrive
   once with a plain fade and rise (round five, the owner: no blur anywhere; the blur values are now brightness(1)); every heading does the same as it comes into view; the four thin layer sentences
   light word by word as they are read; every button and card answers a press with a light spring.
   What it reads: the page's own elements and two vendored libraries, js/vendor/motion.js (Motion 12.43.0, window.Motion)
   and js/vendor/anime.umd.min.js (anime.js 4.5.0, window.anime). It writes only inline styles and classes. It asks the
   network for nothing.
   What calls it: index.html, after home.js, v2.js and tricks.js. Round seven (November 21, 2026): it plays the same
   whatever the phone's Reduce Motion setting. Formerly: with reduced motion it showed everything at rest at
   once; with scripts off it never runs and the page shows whole (css/modern.css).
   Values: MotionSites recipes 1 (blur and rise), 4 (soft word rise), 10 (scroll linked words) and 13 (count up, in
   v2.js); React Bits BlurText (blur 10 px, per word step), MaskedHeading (stagger 0.09 s) and ScrollReveal (start
   opacity 0.15); Emil Kowalski's rules (ease out on entry, small moves under about 300 ms, nothing loops). Round eight (November 21, 2026, the owner's words on the lag): nothing it moves starts hidden; each part waits at 60 in a hundred of its light and the movement adds the rest (css/round8.css). */
(function () {
  "use strict";
  var M = window.Motion, A = window.anime;
  var reduce = false; /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting */
  var EASE = [0.16, 1, 0.3, 1];
  var heroCopy = document.querySelector(".hero-copy");
  var dial = document.querySelector(".dial");

  function settleAll() {
    if (heroCopy) heroCopy.classList.add("ready");
    if (dial) dial.classList.add("drawn");
  }
  if (reduce || !M) { settleAll(); if (reduce) return; }

  /* split the text of an element into word spans, keeping inner elements such as <span class="nw"> */
  function splitWords(el, cls) {
    if (!el || el.getAttribute("data-split")) return [];
    el.setAttribute("data-split", "1");
    var out = [];
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 1) { walk(n); return; }
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement("span"); s.className = cls; s.textContent = part;
          frag.appendChild(s); out.push(s);
        });
        node.replaceChild(frag, n);
      });
    })(el);
    return out;
  }

  /* ---------- the first screen: recipe 1, bold left aligned order, with BlurText per word on the headline ---------- */
  function heroIn() {
    if (!heroCopy || !M) return;
    var h1 = heroCopy.querySelector("h1");
    var words = splitWords(h1, "bw");
    var parts = [".eyebrow", ".lead", ".proof", ".cta-row"].map(function (s) { return heroCopy.querySelector(s); }).filter(Boolean);
    words.forEach(function (w) { w.style.opacity = "0.6"; w.style.filter = "brightness(1)"; w.style.transform = "translateY(24px)"; }); /* round eight: visible from the first moment */
    parts.forEach(function (p) { p.style.opacity = "0.6"; p.style.filter = "brightness(1)"; p.style.transform = "translateY(18px)"; });
    heroCopy.classList.add("ready");
    M.animate(parts[0], { opacity: 1, filter: "brightness(1)", transform: "translateY(0px)" }, { duration: 0.8, ease: EASE });
    M.animate(words, { opacity: [0.6, 0.8, 1], filter: ["brightness(1)", "brightness(1)", "brightness(1)"], transform: ["translateY(24px)", "translateY(-2px)", "translateY(0px)"] },
      { duration: 0.9, ease: EASE, delay: M.stagger(0.12, { startDelay: 0.15 }) });
    var at = 0.15 + words.length * 0.12 + 0.1;
    parts.slice(1).forEach(function (p, i) {
      M.animate(p, { opacity: 1, filter: "brightness(1)", transform: "translateY(0px)" }, { duration: 0.85, ease: EASE, delay: at + i * 0.15 });
    });
  }

  /* ---------- the clock (round four, November 20, 2026): one clean vector clock, fx/clock.svg. It arrives once, sharp
     from the first frame (no soft focus, nothing pixel drawn), then its words and the four area names, and then nothing
     on it moves. Without anime.js or with scripts off it simply shows. ---------- */
  function clockIn() {
    if (!dial) return;
    if (!A || !A.createTimeline) { dial.classList.add("drawn"); return; }
    var face = dial.querySelector(".dial-face");
    var tags = [].slice.call(dial.querySelectorAll(".dial-tag"));
    var mid = dial.querySelector(".dial-mid");
    A.set(face, { opacity: 0.6, scale: 0.96 }); /* round eight: the clock is seen from the first moment; the arrival adds light */
    A.set(tags, { opacity: 0.6, translateY: 6 });
    A.set(mid, { opacity: 0.6 });
    dial.classList.add("drawn");
    var tl = A.createTimeline({ defaults: { ease: "out(3)" } });
    tl.add(face, { opacity: [0.6, 1], scale: [0.96, 1], duration: 700 }, 150)
      .add(mid, { opacity: [0.6, 1], duration: 500 }, 550);
    tags.forEach(function (t, i) { tl.add(t, { opacity: [0.6, 1], translateY: [6, 0], duration: 450 }, 650 + i * 90); });
  }

  /* ---------- headings: once, as they come into view (MaskedHeading stagger 0.09 s, a soft blur and rise) ---------- */
  function headingsIn() {
    if (!M) return;
    var hs = [].slice.call(document.querySelectorAll("main h2:not(.sr-only)")).filter(function (h) { return !h.closest(".reveal"); });
    hs.forEach(function (h) {
      var words = splitWords(h, "bw");
      words.forEach(function (w) { w.style.opacity = "0.6"; w.style.filter = "brightness(1)"; w.style.transform = "translateY(20px)"; }); /* round eight: every heading is read from the first moment; the rise adds light */
      var done = false;
      M.inView(h, function () {
        if (done) return; done = true;
        M.animate(words, { opacity: 1, filter: "brightness(1)", transform: "translateY(0px)" }, { duration: 0.9, ease: EASE, delay: M.stagger(0.09) });
      }, { amount: 0.4 });
    });
  }

  /* ---------- the four thin layer sentences: word by word as they are read (recipe 10, ScrollReveal 0.15) ---------- */
  function light(words, p) {
    var N = words.length;
    words.forEach(function (w, i) {
      var a = i / N - 0.1, b = i / N + 0.05;
      var t = Math.min(1, Math.max(0, (p - a) / (b - a)));
      w.style.opacity = (0.15 + 0.85 * t).toFixed(3);
    });
  }
  function layerWords() {
    if (!M || !M.scroll) return;
    var layer = document.getElementById("layer");
    if (!layer) return;
    /* desktop: the pinned stage shows one sentence per quarter; each lights through the first part of its quarter */
    var bounds = [[0, 0.22], [0.22, 0.47], [0.47, 0.72], [0.72, 1]];
    var stage = [".lw1", ".lw2", ".lw3", ".lw4"].map(function (s) {
      var el = layer.querySelector(s); var w = splitWords(el, "sw"); if (el) el.classList.add("lit"); return w;
    });
    M.scroll(function (p) {
      stage.forEach(function (w, k) {
        var s = bounds[k][0], e = bounds[k][1];
        var local = (p - s) / (e - s);
        light(w, Math.min(1, Math.max(0, (local - 0.04) / 0.6)));
      });
    }, { target: layer, offset: ["start start", "end end"] });
    /* phone: four panels, each sentence lights as it crosses the middle of the screen */
    [].slice.call(layer.querySelectorAll(".lp p")).forEach(function (p) {
      var w = splitWords(p, "sw"); p.classList.add("lit");
      M.scroll(function (v) { light(w, v); }, { target: p, offset: ["start 0.85", "end 0.5"] });
    });
  }

  /* ---------- press: a light spring on every button and card ---------- */
  function pressSpring() {
    if (!M || !M.press) return;
    var spring = { type: "spring", visualDuration: 0.22, bounce: 0.35, reduceMotion: false }; /* round seven: Motion itself would skip a scale with Reduce Motion on */
    M.press(".btn, .pill, .chip, .row, .q1-b, .wa-big, .how-card, .vid, .area, .area-wa, .q1-more", function (el) {
      if (el.disabled) return;
      M.animate(el, { scale: el.matches(".area, .how-card, .vid") ? 0.985 : 0.96 }, spring);
      return function () {
        var a = M.animate(el, { scale: 1 }, spring);
        if (a && a.then) a.then(function () { el.style.transform = ""; });
      };
    });
    /* stage six (November 24, 2026): press() puts the area and step cards in the keyboard path, where they do nothing;
       the area's own button stays the one stop, and the spring stays */
    document.querySelectorAll(".area[tabindex], .how-card[tabindex]").forEach(function (e) { e.removeAttribute("tabindex"); });
  }

  function start() { heroIn(); clockIn(); }
  var started = false;
  function go() { if (started) return; started = true; start(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  setTimeout(go, 600);
  headingsIn();
  layerWords();
  pressSpring();
})();
