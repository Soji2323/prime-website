/* Round five (November 20, 2026): the Transformation Advisory teaser. Round eight (November 21, 2026, the owner: "this
   area ... feels a lot of lag"; "those 3 images ... why it got removed"): the teaser no longer pins or holds the screen
   on any width, and nothing in it waits.
   What it does: (1) the heading and the three steps stand lit along the yellow line from the first moment, whatever the
   phone's Reduce Motion setting; the yellow line draws down (across, on a computer) as the page moves past, each dot
   reached as it passes 85 in a hundred of the screen's height, while the steps stay lit. (2) Shows Varun's film in the
   teaser's film place only when its line in js/videos.js is ready and has place: "advisory"; until then the place stays
   hidden and nothing says coming soon. With scripts off the steps stand lit and the line stands whole.
   What it reads: the teaser's elements, window.PRIME_VIDEOS, window.primeOpenFilm (js/home.js), the scroll position.
   What it writes: the classes flow and on, the line's size, and the film button inside #advFilm.
   What calls it: index.html, last. */
(function () {
  "use strict";
  var sec = document.getElementById("advisory"); if (!sec) return;
  var stage = sec.querySelector(".adv-stage"), steps = [].slice.call(sec.querySelectorAll(".adv-step"));
  var box = sec.querySelector(".adv-pathbox"), line = sec.querySelector(".adv-line"), fill = sec.querySelector(".adv-fill");

  /* (2) the film place */
  var film = (window.PRIME_VIDEOS || []).filter(function (v) { return v.place === "advisory" && v.file && v.ready === true; })[0];
  var place = document.getElementById("advFilm");
  if (film && place) {
    var b = document.createElement("button"); b.type = "button"; b.className = "adv-film-btn";
    b.setAttribute("aria-label", "Play " + film.title);
    if (film.poster) { var im = document.createElement("img"); im.src = film.poster; im.alt = ""; im.loading = "lazy"; b.appendChild(im); }
    var pl = document.createElement("span"); pl.className = "vid-play"; pl.setAttribute("aria-hidden", "true"); b.appendChild(pl);
    b.addEventListener("click", function () { if (window.primeOpenFilm) window.primeOpenFilm(film); });
    place.appendChild(b); place.hidden = false;
  }

  /* the line between the first and the last dot, across or down, measured from the dots themselves */
  function dots() { return steps.map(function (s) { var r = s.querySelector(".adv-dot").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); }
  function layoutLine() {
    if (!line || !box) return;
    var d = dots(), o = box.getBoundingClientRect(), across = Math.abs(d[2].y - d[0].y) < 4;
    line.classList.toggle("across", across);
    if (across) { line.style.left = (d[0].x - o.left) + "px"; line.style.top = (d[0].y - o.top - 1) + "px"; line.style.width = (d[2].x - d[0].x) + "px"; line.style.height = "2px"; }
    else { line.style.left = (d[0].x - o.left - 1) + "px"; line.style.top = (d[0].y - o.top) + "px"; line.style.height = (d[2].y - d[0].y) + "px"; line.style.width = "2px"; }
    return { d: d, across: across };
  }
  /* (1) the steps stand lit; only the yellow line draws as the page moves past */
  steps.forEach(function (st) { st.classList.add("on"); });
  sec.classList.add("flow");
  function drawLine() {
    ticking = false;
    var g = layoutLine(); if (!g || !fill) return;
    var vh = window.innerHeight, at = vh * 0.85, p;
    if (g.across) p = (at - g.d[0].y) / (vh * 0.35);
    else { var len = g.d[2].y - g.d[0].y; p = len ? (at - g.d[0].y) / len : 1; }
    p = Math.min(1, Math.max(0, p));
    fill.style.transform = (g.across ? "scaleX(" : "scaleY(") + p.toFixed(4) + ")";
  }
  var ticking = false;
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(drawLine); } }, { passive: true });
  window.addEventListener("resize", drawLine);
  drawLine();
})();
