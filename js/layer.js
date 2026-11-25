/* Build v6, the thin layer (November 20, 2026): the motion of the six beat story and the three offers.
   What it does: plays each beat once as it comes into view and leaves it at rest. (a) "compliance" types in one letter
   at a time in the page's yellow, 160 ms a letter, and the paper drops into the folder; (b) the expired paper breaks
   into blocks that settle as three silos: the Pixel FX pixel dissolve (00_Knowledge/SHELF/pixelfx, fx/transitions/
   pixel-dissolve.js, MIT, after Sprite Fusion by Hugo Duprez) with its own layout and timing, drawn here on a 320 by
   180 pixel canvas at twelve frames a second, because its pre drawn picture strip weighed 573 KB; (c) nothing, the still
   beat; (d) the yellow band is drawn across the silos, then the warm light, since the fresh review of round five a smooth glow drawn by the browser in place of the Pixel FX god rays still (fx/godrays.webp)
   and rising motes in the manner of the Pixel FX fireflies light a wide part of the screen and stay lit (round seven: the
   result phone above the drawing lights as it comes in, the band's words "Compliance & Safety" come in with the band);
   (e) gone in round seven, its two lines now the caption under the drawing; (f) the photo settles and a
   slow light passes once over "Hence, peace of mind." (React Bits ShinyText, by hand). It also wires the offers:
   a tap on an offer card lights it and writes that offer and its fleet size into the one WhatsApp message, and where the
   cards stand in one column it moves that WhatsApp and call directly under the lit card (round four, review note 3).
   What it reads: the page's own elements, and window.Motion when present for the press spring. It asks the network for
   nothing. What it writes: classes and inline styles only.
   What calls it: index.html, after js/modern.js. Round seven (November 21, 2026, the owner: "this is not 2005, this is
   November 2026"): it plays the same whatever the phone's Reduce Motion setting; with scripts off it never runs and
   every final picture and all words show. Round eight (November 21, 2026, the owner's words on the lag): nothing it moves starts hidden; each part waits at 60 in a hundred of its light and the movement adds the rest (css/round8.css). */
(function () {
  "use strict";
  var reduce = false; /* round seven: the story moves on every phone, whatever its Reduce Motion setting */
  var story = document.querySelector(".story");
  var tails = [].slice.call(document.querySelectorAll(".story-tail")); /* round five: the peace beat stands second last, in its own story part */

  /* ---------- the offers (round four, November 20, 2026: "its all repeating"): one WhatsApp and one call for all
     three offers, under the cards, in place of a pair on every card, and no separate fleet size row. A tap on a card
     lights it, and the one WhatsApp message then names that offer and its fleet size; with nothing lit it asks about
     the three offers. They run with or without motion. ---------- */
  var WA = "https://wa.me/17802091000?text=";
  var cards = [].slice.call(document.querySelectorAll(".offer[id^='offer-']"));
  var shared = document.querySelector(".offers-acts .offer-wa");
  var ALL = "Hello Prime, I would like to understand your three offers.";
  /* the third repeat gate (round five, R1): Transformation Advisory has its one ask in the teaser, so the shared pair
     serves Basic, Standard and the general message only; a lit third card keeps the general message and the pair stays
     under the cards, and the card's own link leads to the teaser */
  var isAdv = function (c) { return !!c && c.id === "offer-transform"; };
  function message(card) {
    if (!card || isAdv(card)) return ALL;
    var name = card.getAttribute("data-name"), size = card.getAttribute("data-size");
    var head = name === "Transformation Advisory" ? "Hello Prime, I would like to understand Transformation Advisory." : "Hello Prime, I would like to understand " + name + ".";
    return head + (size ? " We run " + size + "." : " We want to grow our fleet.");
  }
  /* after the fresh review of round four (note 3): when the cards stand in one column, as on a phone, the one WhatsApp
     and call move directly under the card that is lit, so the way to ask is in view the moment the owner chooses; with
     nothing lit, or when the cards stand side by side, they sit under the cards. With scripts off they stay there. */
  var acts = document.querySelector(".offers-acts"), grid = document.querySelector(".offer-grid");
  function oneColumn() { return !!grid && getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length === 1; }
  function placeActs() {
    if (!acts || !grid) return;
    var lit = cards.filter(function (c) { return c.classList.contains("match"); })[0];
    if (lit && !isAdv(lit) && oneColumn()) { if (lit.nextElementSibling !== acts) lit.after(acts); acts.classList.add("under-card"); }
    else { if (grid.nextElementSibling !== acts) grid.after(acts); acts.classList.remove("under-card"); }
  }
  /* round five: each card's tap is a real button stretched over the card (.offer-tap), so the card's small link "See how
     it works" is never a control inside a control; the button carries aria-pressed and the card the class match */
  var tapOf = function (c) { return c.querySelector(".offer-tap"); };
  function pick(card) {
    var on = card && !card.classList.contains("match");
    cards.forEach(function (c) { c.classList.remove("match"); if (tapOf(c)) tapOf(c).setAttribute("aria-pressed", "false"); });
    if (on) { card.classList.add("match"); if (tapOf(card)) tapOf(card).setAttribute("aria-pressed", "true"); }
    if (shared) shared.href = WA + encodeURIComponent(message(on ? card : null));
    placeActs();
  }
  cards.forEach(function (c) { var t = tapOf(c); if (t) t.addEventListener("click", function () { pick(c); }); });
  window.addEventListener("resize", placeActs);
  var M = window.Motion;
  if (M && M.press && !reduce) {
    var spring = { type: "spring", visualDuration: 0.22, bounce: 0.35, reduceMotion: false };
    M.press(".offer-wa, .offer-call", function (el) {
      M.animate(el, { scale: 0.96 }, spring);
      return function () { var a = M.animate(el, { scale: 1 }, spring); if (a && a.then) a.then(function () { el.style.transform = ""; }); };
    });
  }

  if (!story || reduce || !("IntersectionObserver" in window)) return;
  story.classList.add("armed"); tails.forEach(function (t) { t.classList.add("armed"); });

  /* play each beat once, when about a third of it is in view */
  var plays = {};
  function watch(beat, at, fn, low) {
    if (!beat) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        beat.classList.add("on");
        fn(beat);
      });
    }, { threshold: at, rootMargin: "0px 0px -" + (low || 12) + "% 0px" });
    io.observe(beat);
  }
  var B = function (k) { return document.querySelector('[data-beat="' + k + '"]'); };

  /* ---------- a: the typewriter (React Bits SplitText, chars, rebuilt by hand) ---------- */
  var word = document.getElementById("typeWord"), chars = [];
  if (word) {
    var text = word.textContent; word.textContent = "";
    text.split("").forEach(function (c) { var s = document.createElement("span"); s.className = "ch"; s.textContent = c; word.appendChild(s); chars.push(s); });
  }
  watch(B("a"), 0.45, function (beat) {
    beat.classList.add("typing");
    chars.forEach(function (c) { c.style.opacity = "0.22"; }); /* round eight: the letters wait visible, dim at 0.22 since November 21 so each is seen to arrive; the typing adds the light */
    chars.forEach(function (c, i) { setTimeout(function () { c.style.opacity = "1"; if (i) chars[i - 1].classList.remove("cur"); c.classList.add("cur"); }, 500 + i * 160); });
    setTimeout(function () { chars.forEach(function (c) { c.classList.remove("cur"); }); }, 500 + chars.length * 160 + 500);
    setTimeout(function () { beat.classList.remove("typing"); }, 500 + chars.length * 160 + 500);
  });

  /* ---------- b: the Pixel FX pixel dissolve, its layout and choreography, on a 320 x 180 pixel canvas ---------- */
  function hash() { var h = 0x9e3779b9; for (var i = 0; i < arguments.length; i++) { h = Math.imul(h ^ (arguments[i] | 0), 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; } return h >>> 0; }
  function rand() { return hash.apply(null, arguments) / 4294967296; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function noise2(x, y, s) { var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy); return lerp(lerp(rand(ix, iy, s), rand(ix + 1, iy, s), ux), lerp(rand(ix, iy + 1, s), rand(ix + 1, iy + 1, s), ux), uy) * 2 - 1; }
  function fbm(x, y, s) { var t = 0, a = 0.5, n = 0; for (var o = 0; o < 3; o++) { t += noise2(x, y, s + o * 101) * a; n += a; x *= 2.03; y *= 2.03; a *= 0.5; } return t / n; }
  var W = 320, H = 180, CELL = 20, P = 0.17, IN0 = 0.04, IN1 = 0.8, OUT0 = 1.12, OUT1 = 1.85, DUR = 2.2, SEED = 4;
  /* the page's yellow ramp, dark to bright, and the card colour the blocks fill with */
  var RAMP = ["#1d1606", "#3b2d0a", "#6e5510", "#a8830f", "#d6aa12", "#f6ca18", "#ffe27a", "#fff6d2"], INK = "#15151b", WHITE = "#ffffff";
  function layout() {
    var bl = [], cx, cy, i, j;
    for (cy = 0; cy < H / CELL; cy++) for (cx = 0; cx < W / CELL; cx++) {
      var h = rand(cx, cy, SEED), n = h < 0.32 ? 1 : h < 0.74 ? 2 : 4, s = CELL / n;
      for (j = 0; j < n; j++) for (i = 0; i < n; i++) bl.push({ x: cx * CELL + i * s, y: cy * CELL + j * s, s: s });
    }
    function rank(key) { var v = bl.map(key), idx = v.map(function (_, k) { return k; }).sort(function (a, b) { return v[a] - v[b]; }), out = []; idx.forEach(function (k, r) { out[k] = r / (bl.length - 1); }); return out; }
    function at(b, sd) { return fbm((b.x + b.s / 2) / 64, (b.y + b.s / 2) / 64, sd); }
    var uin = rank(function (b) { return at(b, SEED) + 0.22 * rand(b.x, b.y, SEED + 1) + (b.s === 20 ? 0.12 : b.s === 5 ? -0.08 : 0); });
    var uout = rank(function (b) { return at(b, SEED + 7) + 0.22 * rand(b.x, b.y, SEED + 2) + (b.s === 20 ? -0.14 : b.s === 5 ? 0.1 : 0); });
    bl.forEach(function (b, k) {
      b.tin = IN0 + uin[k] * (IN1 - IN0); b.tout = OUT0 + uout[k] * (OUT1 - OUT0);
      b.glint = rand(b.x, b.y, SEED + 3) < (b.s >= 10 ? 0.32 : 0.1);
      b.gx = b.x + (rand(b.x, b.y, SEED + 4) < 0.5 ? 0 : b.s); b.gy = b.y + (rand(b.x, b.y, SEED + 5) < 0.5 ? 0 : b.s);
      b.L = b.s === 20 && rand(b.x, b.y, SEED + 8) < 0.45 ? 9 + 6 * rand(b.x, b.y, SEED + 9) : 2.5 + b.s * 0.32;
    });
    return bl;
  }
  function outBack(t) { var s = 1.70158; return t <= 0 ? 0 : t >= 1 ? 1 : 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); }
  function sq(g, x, y, s, fill, rim) {
    var X = Math.round(x), Y = Math.round(y), S = Math.max(1, Math.round(s));
    if (fill) { g.fillStyle = fill; g.fillRect(X, Y, S, S); }
    if (rim && S > 2) { g.fillStyle = rim; g.fillRect(X, Y, S, 1); g.fillRect(X, Y + S - 1, S, 1); g.fillRect(X, Y, 1, S); g.fillRect(X + S - 1, Y, 1, S); }
  }
  function glow(g, x, y, r, c, k) {
    if (k <= 0.01) return;
    var gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = Math.min(1, k); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
  }
  function star(g, x, y, L, c) {
    g.fillStyle = WHITE; g.fillRect(Math.round(x), Math.round(y), 1, 1);
    g.fillStyle = c;
    for (var d = 1; d <= L; d++) { var o = Math.round(d); g.fillRect(Math.round(x) + o, Math.round(y), 1, 1); g.fillRect(Math.round(x) - o, Math.round(y), 1, 1); g.fillRect(Math.round(x), Math.round(y) + o, 1, 1); g.fillRect(Math.round(x), Math.round(y) - o, 1, 1); }
    glow(g, x + 0.5, y + 0.5, 4 + L * 1.4, c, 0.45);
  }
  function drawDissolve(g, bl, t) {
    g.clearRect(0, 0, W, H);
    var frame = Math.floor(t * 15), stars = [];
    for (var n = 0; n < bl.length; n++) {
      var b = bl[n], ki = (t - b.tin) / P, ko = (t - b.tout) / P, x = b.x, y = b.y, s = b.s, cx = x + s / 2, cy = y + s / 2;
      if (ki < 0 || ko >= 1.6) continue;
      if (ko < 0) {
        if (ki >= 1) sq(g, x, y, s, INK);
        else {
          var gg = ki < 0.35 ? 0.35 + 0.65 * outBack(ki / 0.35) : 1, hh = s * gg;
          var rim = ki < 0.45 ? WHITE : ki < 0.6 ? RAMP[6] : ki < 0.75 ? RAMP[5] : ki < 0.9 ? RAMP[4] : RAMP[3];
          sq(g, cx - hh / 2, cy - hh / 2, hh, ki > 0.2 ? INK : 0, rim);
          glow(g, cx, cy, s * 0.8 + 4, RAMP[5], 0.45 * (1 - ki));
        }
        if (b.glint && ki > 0.15 && ki < 1.6) stars.push([b, (ki - 0.15) / 1.45]);
        if (ki < 1.4 && rand(frame, n, 9) < 0.3) { g.fillStyle = rand(frame, n, 12) < 0.5 ? WHITE : RAMP[6]; g.fillRect(Math.round(x + rand(frame, n, 10) * (s + 6) - 3), Math.round(y + rand(frame, n, 11) * (s + 6) - 3), 1, 1); }
      } else {
        if (ko < 0.35) { var q = ko / 0.35; sq(g, x, y, s, INK, q < 0.4 ? RAMP[4] : q < 0.75 ? RAMP[5] : RAMP[6]); glow(g, cx, cy, s * 0.8 + 3, RAMP[4], 0.35 * q); }
        else if (ko < 0.75) { var q2 = (ko - 0.35) / 0.4, h2 = s * (1 - q2 * q2 * 0.85); sq(g, cx - h2 / 2, cy - h2 / 2, h2, 0, q2 < 0.5 ? WHITE : RAMP[6]); glow(g, cx, cy, s * 0.8 + 4, RAMP[5], 0.45 * (1 - q2 * 0.5)); }
        else if (ko < 1) { g.fillStyle = WHITE; g.fillRect(Math.round(cx - 0.5), Math.round(cy - 0.5), 1, 1); glow(g, cx, cy, s * 0.5 + 3, RAMP[5], 0.35 * (1 - (ko - 0.75) / 0.25)); }
        if (b.glint && ko > 0.3) stars.push([b, (ko - 0.3) / 1.3]);
      }
    }
    stars.forEach(function (st) { var u = st[1]; if (u <= 0 || u >= 1) return; star(g, st[0].gx, st[0].gy, st[0].L * Math.pow(Math.sin(Math.PI * u), 0.7) * 0.6, RAMP[5]); });
  }
  watch(B("b"), 0.5, function (beat) {
    var cv = beat.querySelector(".px-cover"); if (!cv || !cv.getContext) { beat.classList.add("swapped"); return; }
    var g = cv.getContext("2d"), bl = layout(), t0 = null, last = -1, swapped = false;
    function step(now) {
      if (t0 === null) t0 = now;
      var t = Math.min(DUR, (now - t0) / 1000), f = Math.floor(t * 12);
      if (f !== last) { last = f; drawDissolve(g, bl, f / 12); }
      if (!swapped && t >= 1.0) { swapped = true; beat.classList.add("swapped"); }
      if (t < DUR) requestAnimationFrame(step); else { g.clearRect(0, 0, W, H); beat.classList.add("swapped"); }
    }
    setTimeout(function () { requestAnimationFrame(step); }, 350);
  }, 32); /* b waits until its picture reaches the middle of the screen, so it never plays unseen below beat a */

  /* ---------- d: the band, then the wide light that stays (god rays still and motes after the Pixel FX fireflies) ---------- */
  function motes(cv) {
    if (!cv || !cv.getContext) return;
    var g = cv.getContext("2d"), list = [], i;
    for (i = 0; i < 54; i++) list.push({ x: 8 + rand(i, 1, 21) * 304, y: 14 + rand(i, 2, 21) * 150, d: rand(i, 3, 21) * 1.3, rise: 18 + rand(i, 4, 21) * 30, rest: rand(i, 5, 21) < 0.55 ? 0.35 + rand(i, 6, 21) * 0.5 : 0, big: rand(i, 7, 21) < 0.25 });
    var t0 = null, last = -1, END = 2.8;
    function frame(t) {
      g.clearRect(0, 0, 320, 180);
      list.forEach(function (m) {
        var u = Math.max(0, Math.min(1, (t - m.d) / 1.3)); if (u <= 0) return;
        var e = 1 - Math.pow(1 - u, 3), y = m.y + m.rise * (1 - e);
        var k = u < 0.55 ? u / 0.55 : 1 - (1 - m.rest) * Math.min(1, (u - 0.55) / 0.45);
        if (k <= 0.02) return;
        var X = Math.round(m.x), Y = Math.round(y);
        glow(g, X + 0.5, Y + 0.5, m.big ? 11 : 7, "#f6ca18", 0.55 * k);
        g.globalAlpha = Math.min(1, 0.4 + k); g.fillStyle = k > 0.6 ? "#fff6d2" : "#ffe27a"; g.fillRect(X, Y, 1, 1);
        if (m.big && k > 0.5) { g.fillStyle = "#f6ca18"; g.fillRect(X - 1, Y, 1, 1); g.fillRect(X + 1, Y, 1, 1); g.fillRect(X, Y - 1, 1, 1); g.fillRect(X, Y + 1, 1, 1); }
        g.globalAlpha = 1;
      });
    }
    function step(now) {
      if (t0 === null) t0 = now;
      var t = Math.min(END, (now - t0) / 1000), f = Math.floor(t * 12);
      if (f !== last) { last = f; frame(f / 12); }
      if (t < END) requestAnimationFrame(step); else frame(END);
    }
    requestAnimationFrame(step);
  }
  /* round seven (November 21, 2026, the owner's corrections): the result phone now stands above the drawing, so each
     lights when it comes into view itself. The phone lights as it comes in; the band draws across with its words
     "Compliance & Safety" when the drawing comes in, and 1.4 s later the files and the wide warm light come on. */
  var beatD = B("d");
  function seen(el, at, fn) {
    if (!el) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; io.disconnect(); fn(); });
    }, { threshold: at, rootMargin: "0px 0px -12% 0px" });
    io.observe(el);
  }
  if (beatD) {
    var dPhone = beatD.querySelector(".lit-phone");
    seen(dPhone, 0.3, function () { setTimeout(function () { dPhone.classList.add("lit"); }, 400); });
    seen(beatD.querySelector(".art-card"), 0.45, function () {
      beatD.classList.add("on");
      setTimeout(function () { beatD.classList.add("lit"); }, 1400); /* round five: the pixel drawn motes are gone; the smooth glow carries the warmth */
    });
  }
  /* round seven: beat e, the separate Compliance and safety block, is gone; its two lines are the drawing's caption in beat d */

  /* ---------- f: the photo settles and the light passes once over the words ---------- */
  watch(B("f"), 0.4, function (beat) { requestAnimationFrame(function () { beat.classList.add("shone"); }); });
})();
