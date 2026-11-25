/* Version two: the thin layer stage, the count up, the pixel assembly of the area photos, and the services chips.
   Plain code, no outside script. The pixel assembly follows the pixel dissolve of the Pixel FX library (MIT, on our shelf):
   blocks wink in from dark, each glinting once, until the photo stands whole; once per photo, under a second. Round eight (November 21, 2026, the owner's words on the lag): nothing it moves starts hidden; each part waits at 60 in a hundred of its light and the movement adds the rest (css/round8.css). */
(function () {
  "use strict";
  var reduce = false; /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting */
  var wide = function () { return window.matchMedia("(min-width: 1001px)").matches; };

  /* services chips */
  var chips = document.getElementById("chips");
  (window.PRIME_SERVICES || []).forEach(function (name) {
    var a = document.createElement("a");
    a.className = "chip";
    a.href = "https://wa.me/17802091000?text=" + encodeURIComponent("Hello Prime, I need help with " + name + ".");
    a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = '<span class="wa-ico" aria-hidden="true"></span><span></span>';
    a.lastChild.textContent = name;
    chips.appendChild(a);
  });

  /* phone panels: each sentence above its own copy of the picture */
  var panels = document.getElementById("layerPanels"), svg = document.querySelector(".layer-svg");
  if (panels && svg) {
    [["s1", ".lw1", ""], ["s2", ".lw2", ""], ["s3", ".lw3", ""]].forEach(function (d) {
      var box = document.createElement("div"); box.className = "lp " + d[0];
      var p = document.createElement("p"); p.textContent = document.querySelector(d[1]).textContent; box.appendChild(p);
      var c = svg.cloneNode(true); c.removeAttribute("class"); c.setAttribute("aria-hidden", "true"); box.appendChild(c);
      panels.appendChild(box);
    });
    var last = document.createElement("div"); last.className = "lp";
    var lp = document.createElement("p"); lp.className = "y"; lp.textContent = document.querySelector(".lw4").textContent;
    last.appendChild(lp); panels.appendChild(last);
  }

  /* the thin layer: one step per quarter of the pinned scroll */
  var layer = document.getElementById("layer");
  function stepLayer() {
    if (!layer) return;
    if (reduce || !wide()) { layer.setAttribute("data-step", "4"); return; }
    var r = layer.getBoundingClientRect();
    var run = layer.offsetHeight - window.innerHeight;
    var p = Math.min(1, Math.max(0, -r.top / Math.max(1, run)));
    var step = p < 0.22 ? 1 : p < 0.47 ? 2 : p < 0.72 ? 3 : 4;
    if (layer.getAttribute("data-step") !== String(step)) layer.setAttribute("data-step", String(step));
  }
  window.addEventListener("scroll", stepLayer, { passive: true });
  window.addEventListener("resize", stepLayer);
  layer.setAttribute("data-step", "1");
  stepLayer();

  /* count up, once, and settle (build three: MotionSites recipe 13 and React Bits CountUp; duration 1500 + i x 80 ms,
     delay 480 + i x 90 ms, ease out cubic, tabular figures; the final value stays in the HTML; a light spring on landing) */
  function countUp(el) {
    var to = +el.getAttribute("data-count");
    var i = Math.max(0, [].indexOf.call(document.querySelectorAll("[data-count]"), el));
    var M = window.Motion;
    function settle() { if (M && M.animate) M.animate(el, { scale: [1.06, 1] }, { type: "spring", visualDuration: 0.3, bounce: 0.3, reduceMotion: false }); }
    if (reduce) { el.textContent = String(to); return; }
    if (!to) { el.textContent = String(to); setTimeout(settle, 480 + i * 90 + 1500 + i * 80); return; }
    var t0 = null, dur = 1500 + i * 80;
    function f(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(f); else settle(); }
    el.textContent = "0"; setTimeout(function () { requestAnimationFrame(f); }, 480 + i * 90);
  }

  /* pixel assembly */
  function assemble(fig) {
    var img = fig.querySelector("img");
    if (reduce) { fig.classList.add("in"); return; }
    var c = document.createElement("canvas");
    var w = fig.clientWidth, h = fig.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    fig.appendChild(c);
    var g = c.getContext("2d");
    var cell = Math.max(14, Math.round(Math.min(w, h) / 16)) * dpr;
    var cols = Math.ceil(c.width / cell), rows = Math.ceil(c.height / cell), cells = [];
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) cells.push([x, y]);
    for (var i = cells.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = cells[i]; cells[i] = cells[j]; cells[j] = tmp; }
    /* round eight (November 21, 2026): no dark cover; the photo stands from the first moment and the squares wink over it */
    fig.classList.add("in");
    var t0 = null, done = 0, dur = 850, glint = [];
    function frame(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), target = Math.floor(cells.length * (k * k * (3 - 2 * k)));
      glint.forEach(function (q) { g.clearRect(q[0] * cell, q[1] * cell, cell, cell); });
      glint = [];
      while (done < target) {
        var q = cells[done++];
        g.fillStyle = "rgba(246,202,24,0.55)"; g.fillRect(q[0] * cell + 1, q[1] * cell + 1, cell - 2, cell - 2);
        glint.push(q);
      }
      if (k < 1) requestAnimationFrame(frame);
      else { glint.forEach(function (q) { g.clearRect(q[0] * cell, q[1] * cell, cell, cell); }); c.remove(); }
    }
    if (img.complete) requestAnimationFrame(frame);
    else img.addEventListener("load", function () { requestAnimationFrame(frame); }, { once: true });
  }

  var nums = document.querySelectorAll("[data-count]");
  var areas = document.querySelectorAll(".area.px");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.target.hasAttribute("data-count")) countUp(e.target);
        else { var d = +e.target.getAttribute("data-i") * 180; setTimeout(function () { assemble(e.target); }, d); }
      });
    }, { rootMargin: "0px 0px -15% 0px" });
    nums.forEach(function (n) { io.observe(n); });
    areas.forEach(function (a, i) { a.setAttribute("data-i", i); io.observe(a); });
  } else {
    areas.forEach(function (a) { a.classList.add("in"); });
  }
})();
