/* Prime home: the solid bar on scroll, the dial ticks, reveal as sections scroll in, and the video window. No outside script.
   It reads js/videos.js; since round three (November 20, 2026) it draws a card only for a film set ready: true. */
(function () {
  "use strict";
  var nav = document.getElementById("nav");
  function onScroll() { nav.classList.toggle("solid", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* eight ticks round the dial: one per question */
  var g = document.querySelector(".ticks");
  if (g) {
    for (var i = 0; i < 8; i++) {
      var a = (i * 45 + 22.5) * Math.PI / 180;
      var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", 200 + Math.sin(a) * 178); l.setAttribute("y1", 200 - Math.cos(a) * 178);
      l.setAttribute("x2", 200 + Math.sin(a) * 190); l.setAttribute("y2", 200 - Math.cos(a) * 190);
      g.appendChild(l);
    }
  }

  /* the film cards */
  var grid = document.getElementById("vidGrid");
  var list = window.PRIME_VIDEOS || [];
  list.forEach(function (v) {
    if (v.card === false || v.place === "advisory") return; /* opened from Watch first only, so its story is not told twice */
    if (!v.file || v.ready === false) return; /* round three: only a film that passed its gate is drawn, never a "Coming soon" card */
    var b = document.createElement("button");
    b.type = "button";
    b.className = "vid reveal" + (v.poster ? "" : " plain");
    b.setAttribute("aria-label", "Play " + v.title + ", " + v.sub);
    b.innerHTML = (v.poster ? '<img src="' + v.poster + '" alt="" loading="lazy">' : "") +
      '<span class="vid-play" aria-hidden="true"></span><span class="vid-text"><span class="vid-title"></span><span class="vid-sub"></span></span>';
    b.querySelector(".vid-title").textContent = v.title;
    b.querySelector(".vid-sub").textContent = v.sub;
    b.addEventListener("click", function () { openVideo(v); });
    grid.appendChild(b);
    showFilms();
    /* round three polish: a film set ready but not yet on the server takes its card away, never a "Coming soon" card
       and never a play that fails; when no card is left, Films and its menu link go too */
    if (window.fetch) fetch(v.file, { method: "HEAD" }).then(function (r) { if (!r.ok) gone(); }).catch(gone);
    function gone() { if (b.parentNode) b.parentNode.removeChild(b); if (!grid.querySelector(".vid")) hideFilms(); }
  });

  /* round five: a film with place: "advisory" shows only in the Transformation Advisory teaser (js/advisory.js) */
  var anyReady = list.some(function (v) { return v.file && v.ready !== false && v.place !== "advisory"; });
  var watch = document.getElementById("watchFirst"); if (watch && anyReady) watch.hidden = false;
  /* while no film is ready, the Films section and its menu link stay hidden, so nothing says "Coming soon" five times */
  /* after the fresh review (note 5): Films and its menu link start hidden in the page, so with scripts off no heading stands
     over nothing; they are shown when a ready film's card is drawn, and hidden again if its file proves missing */
  function showFilms() { var fs = document.getElementById("films"); if (fs) fs.hidden = false; [].slice.call(document.querySelectorAll('a[href="#films"]:not(#watchFirst)')).forEach(function (a) { a.hidden = false; }); }
  function hideFilms() { var fs = document.getElementById("films"); if (fs) fs.hidden = true; [].slice.call(document.querySelectorAll('a[href="#films"]')).forEach(function (a) { a.hidden = true; }); }
  if (!anyReady) hideFilms();
  window.primeOpenFilm = function (v) { openVideo(v); };
  var modal = document.getElementById("vidModal"), player = document.getElementById("vidPlayer"), closeBtn = document.getElementById("vidClose");
  var lastFocus = null;
  function openVideo(v) {
    if (!v.file) return;
    lastFocus = document.activeElement;
    player.src = v.file;
    if (v.poster) player.poster = v.poster; else player.removeAttribute("poster");
    /* round three: the window takes the film's shape (wide 16 by 9 or tall 9 by 16) from the list, and from the film
       itself once it loads, so a wide film fills the phone's width and a tall one as much height as fits */
    modal.classList.remove("wide", "tall");
    if (v.shape) modal.classList.add(v.shape);
    player.onloadedmetadata = function () { if (!player.videoWidth) return; modal.classList.remove("wide", "tall"); modal.classList.add(player.videoWidth > player.videoHeight ? "wide" : "tall"); };
    modal.hidden = false;
    closeBtn.focus();
    var p = player.play(); if (p && p.catch) p.catch(function () {});
  }
  function closeVideo() {
    player.pause(); player.removeAttribute("src"); player.load();
    modal.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  closeBtn.addEventListener("click", closeVideo);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeVideo(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeVideo(); });
  /* a film that is not on the server yet keeps its card but stops offering play */
  player.addEventListener("error", function () { if (!modal.hidden) closeVideo(); });

  /* reveal as each part scrolls in */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
})();
