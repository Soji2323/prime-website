/* Stage five of the desktop website (November 24, 2026; TOP_PIECES.md effects 1 and 5, brief item 18).
   What it does: (1) the climax: once the Compliance & Safety panel of the lighting up has lit (the class "lit" on beat d,
   set by js/layer.js), three small gold fireworks open one after another around the panel, top left, right and bottom
   left, 0.9 s apart, behind it, once; (2) the Greenlight window: when half of it is in view, and only after the circle
   of fireworks has finished, its five rows light one after another, 180 ms apart, and rest lit without breath;
   (3) the index of "Everything else you call us for" marks the group in view.
   What it reads: the page's own elements; the picture strip fx/firework_gold.webp, the Pixel FX firework burst drawn
   ahead of time in the page's yellow ramp (fx/firework_gold_render.mjs.txt). It asks the network for nothing else.
   What it writes: classes and inline positions only. What calls it: index.html, after js/layer.js.
   With scripts off nothing is drawn: the panel and its words stand, and every Greenlight row stands lit. */
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  var beatD = document.querySelector('[data-beat="d"]');
  var panel = beatD && beatD.querySelector(".art-card");
  var box = document.getElementById("climaxFireworks");
  var gl = document.getElementById("greenlight");
  var climaxDone = false, waiters = [];
  function finishClimax() { if (climaxDone) return; climaxDone = true; waiters.splice(0).forEach(function (f) { f(); }); }

  /* ---------- 1. the three gold fireworks ---------- */
  function place() {
    if (!box || !panel) return;
    var b = beatD.getBoundingClientRect(), p = panel.getBoundingClientRect(), small = window.innerWidth <= 1000;
    var k = small ? 0.75 : 1, ox = 120 * k, oy = 100 * k, out = 26;
    /* stage five, after the fresh check: on a phone the panel fills the width, so the shells open in the open ground
       above it (left, then right) and below it, inside the screen; at a computer the third shell ends above the Greenlight window */
    var pts = small
      ? [[p.left - b.left + 70, p.top - b.top - 40], [p.right - b.left - 70, p.top - b.top - 22], [p.left - b.left + p.width / 2, p.bottom - b.top + 40]]
      : [[p.left - b.left - out, p.top - b.top - out * 0.6], [p.right - b.left + out, p.top - b.top + p.height * 0.48], [p.left - b.left - out, p.bottom - b.top - 110]];
    [].slice.call(box.children).forEach(function (s, i) { s.style.left = Math.round(pts[i][0] - ox) + "px"; s.style.top = Math.round(pts[i][1] - oy) + "px"; });
  }
  function fire() {
    if (!box) { finishClimax(); return; }
    place();
    var shells = [].slice.call(box.children);
    shells.forEach(function (s, i) {
      setTimeout(function () { s.classList.add("go"); }, i * 900);
      setTimeout(function () { s.classList.add("gone"); }, i * 900 + 3300);
    });
    setTimeout(finishClimax, 2 * 900 + 3000);
  }
  if (beatD && panel && box) {
    var img = new Image(); /* the strip loads only as the story nears the lighting up */
    var near = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { near.disconnect(); img.src = "fx/firework_gold.webp"; } }, { rootMargin: "900px 0px" });
    near.observe(beatD);
    var mo = new MutationObserver(function () {
      if (!beatD.classList.contains("lit")) return;
      mo.disconnect();
      setTimeout(fire, 500); /* after the band has drawn and the panel has lit */
    });
    if (beatD.classList.contains("lit")) setTimeout(fire, 500); else mo.observe(beatD, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", place);
  } else finishClimax();

  /* ---------- 2. the Greenlight rows light one by one, after the climax ---------- */
  if (gl) {
    var rows = [].slice.call(gl.querySelectorAll(".gl-r"));
    gl.classList.add("gl-armed");
    var started = false;
    function light() {
      if (started) return; started = true;
      rows.forEach(function (r, i) { setTimeout(function () { r.classList.add("gl-on"); }, 200 + i * 180); });
      setTimeout(function () { gl.classList.add("gl-lit"); }, 200 + rows.length * 180 + 400);
    }
    var seenGl = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      seenGl.disconnect();
      if (climaxDone) light();
      else { waiters.push(light); setTimeout(light, 7000); } /* never left waiting if the climax was not seen */
    }, { threshold: 0.5 });
    seenGl.observe(gl);
  }

  /* ---------- 3. the index of the services marks the group in view ---------- */
  var links = [].slice.call(document.querySelectorAll(".svc-index a"));
  if (links.length) {
    var groups = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
    function mark() {
      var cur = 0, y = window.innerHeight * 0.35; /* the group whose heading has passed the upper third of the window */
      groups.forEach(function (g, i) { if (g && g.getBoundingClientRect().top <= y) cur = i; });
      var body = document.querySelector(".svc-body"); /* at the foot of the part, the last group is the one in view */
      if (body && body.getBoundingClientRect().bottom <= window.innerHeight) cur = groups.length - 1;
      links.forEach(function (a, i) { a.setAttribute("aria-current", i === cur ? "true" : "false"); });
    }
    var ticking = false;
    window.addEventListener("scroll", function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; mark(); }); }, { passive: true });
    mark();
  }
})();
