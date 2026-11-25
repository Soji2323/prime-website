/* Round three of the thin layer build (November 20, 2026): the scroll bar is a small truck seen from above.
   Soji's words: "make the top part of scroll bar look like a truck and smoke going, so the same effect of below is
   received for this also".
   What it does: on a screen with a real scroll bar (a computer), css/round3.css already draws the truck at the top of the
   scroll thumb; this script only steps the html class sb-f1 to sb-f4 eight times a second while the page scrolls, so
   small puffs trail behind the van, and takes it away 250 ms after the scroll stops, so the truck rests without smoke.
   On a screen whose scroll bar is hidden (a phone), it draws a thin scroll bar of its own at the right edge: the same
   truck (fx/scroll_truck.webp, 7 by 42 art pixels, at whole device pixels per art pixel) as the thumb, placed by how far
   down the page you are, with the puffs while it moves; it never catches a tap and is hidden from screen readers.
   What it reads: fx/scroll_truck.webp and the page's scroll position. What it writes: the classes sb-f1 to sb-f4 on html,
   or one fixed layer with one small canvas. What calls it: index.html, after js/truck.js. Round seven (November 21, 2026): it
   smokes the same whatever the phone's Reduce Motion setting; with scripts off the computer's scroll bar shows the truck at rest. */
(function () {
  "use strict";
  var reduce = false; /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting */
  var root = document.documentElement, frame = 0, timer = null, idle = null;
  var real = window.innerWidth - root.clientWidth > 0;
  var AW = 7, AH = 42, ind = null, cv = null, g = null, img = null, cssPer = 1, h = 0;

  function show(k) {
    frame = k;
    if (real) { root.classList.remove("sb-f1", "sb-f2", "sb-f3", "sb-f4"); if (k) root.classList.add("sb-f" + k); }
    else if (g && img && img.complete && img.naturalWidth) { g.clearRect(0, 0, cv.width, cv.height); g.drawImage(img, k * AW, 0, AW, AH, 0, 0, cv.width, cv.height); }
    root.setAttribute("data-sb-frame", String(k));
  }
  function moving() {
    if (ind) ind.classList.add("moving");
    if (!reduce && !timer) timer = setInterval(function () { show(frame % 4 + 1); }, 125);
    clearTimeout(idle);
    idle = setTimeout(function () { clearInterval(timer); timer = null; show(0); if (ind) ind.classList.remove("moving"); }, 250);
  }
  function place() {
    if (!ind) return;
    var max = Math.max(1, root.scrollHeight - window.innerHeight), p = Math.min(1, Math.max(0, window.scrollY / max));
    var y = 4 + p * (window.innerHeight - h - 8);
    ind.style.transform = "translateY(" + y.toFixed(1) + "px)";
  }
  function size() {
    /* after the fresh review (note 6): on a sharp phone (three to one) each art pixel takes two screen pixels, six device
       pixels, so the cab and trailer read at a glance (14 by 84 px); below that it stays near one and a half */
    var dpr = window.devicePixelRatio || 1, dps = Math.max(1, Math.floor((dpr >= 2.5 ? 2 : 1.5) * dpr + 0.01));
    cssPer = dps / dpr;
    cv.width = AW * dps; cv.height = AH * dps;
    cv.style.width = (AW * cssPer) + "px"; cv.style.height = (AH * cssPer) + "px";
    h = AH * cssPer;
    g.imageSmoothingEnabled = false;
    show(frame); place();
  }
  if (!real) {
    if (!document.createElement("canvas").getContext) return;
    ind = document.createElement("div"); ind.className = "sb-truck"; ind.setAttribute("aria-hidden", "true");
    cv = document.createElement("canvas"); ind.appendChild(cv); document.body.appendChild(ind);
    g = cv.getContext("2d");
    img = new Image(); img.onload = function () { show(frame); }; img.src = "fx/scroll_truck.webp";
    size();
    window.addEventListener("resize", size);
  }
  window.addEventListener("scroll", function () { place(); moving(); }, { passive: true });
  show(0);
})();
