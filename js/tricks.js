/* The four tricks (Nov 19, 2026, evening): the tap on the four areas. A tap shows the two things The Audit asks about
   that area, in the team's own question titles (copied unchanged from audit/engine/check.data.js). No advice is invented
   here. Round four, the repeat cuts (November 20, 2026, gate row 20): the panel no longer adds its own Start The Audit
   and WhatsApp line, and the hint "Tap an area..." hides while a panel is open and comes back when it closes, so the
   heading never sits under a hint that says the same thing. Round five (November 20, 2026, the fresh review's note 4):
   when the four tiles stand in one column, as on a phone, the panel opens right under the tapped tile, and goes back
   under the row when it closes or the tiles stand side by side. The four area photos keep their lighting up
   (the class px, revealed by js/v2.js), as the owner asked for it (SOJI_WORDS.md, line 18).
   Round six (November 20, 2026): on a phone the panel also carries the area's lines on what your office does, copied
   from the hidden .area-do lines in index.html (word for word from the services rewrite).
   What it reads: the area buttons, their .area-do lines and the hint in index.html. What it writes: the panel's heading,
   list and lines, the hint's hidden state. What calls it: index.html. */
(function () {
  "use strict";
  /* Watch first opens the first film that is ready, today the thin layer explainer, straight in the film window
     (round two: that film has no card in Films any more, so it is opened from the list itself) */
  var watch = document.getElementById("watchFirst");
  if (watch) watch.addEventListener("click", function (e) {
    var first = (window.PRIME_VIDEOS || []).filter(function (v) { return v.file && v.ready !== false && v.place !== "advisory"; })[0];
    if (first && window.primeOpenFilm) { e.preventDefault(); window.primeOpenFilm(first); }
  });
  /* question 1 on the first screen: its full text sits behind one tap, as in The Audit itself */
  var more = document.querySelector(".q1-more"), qtext = document.getElementById("q1-q");
  if (more && qtext) more.addEventListener("click", function () { qtext.hidden = false; more.hidden = true; more.setAttribute("aria-expanded", "true"); });
  var ASKS = {
    Company: ["Safety program and accountability", "Company records and renewals"],
    Drivers: ["Hiring and driver files", "Training and driving-hours checks"],
    Equipment: ["Maintenance and inspection records", "Daily inspections and defects"],
    Compliance: ["Monitoring and follow-up", "Ready before dispatch"]
  };
  var box = document.getElementById("areaAsk");
  var taps = document.querySelectorAll(".area-tap");
  var hint = document.querySelector(".area-hint");
  var row = document.querySelector(".area-row"), home = box ? box.parentNode : null, homeNext = box ? box.nextSibling : null;
  if (!box || !taps.length) return;
  function oneColumn() { return !!row && getComputedStyle(row).gridTemplateColumns.trim().split(/\s+/).length === 1; }
  function place(fig) {
    if (fig && oneColumn()) { if (fig.nextElementSibling !== box) fig.after(box); }
    else if (box.parentNode !== home) home.insertBefore(box, homeNext);
  }
  function show(btn) {
    var name = btn.getAttribute("data-area");
    var open = btn.getAttribute("aria-expanded") === "true";
    taps.forEach(function (t) { t.setAttribute("aria-expanded", "false"); t.parentNode.classList.remove("on"); });
    if (open) { box.hidden = true; if (hint) hint.hidden = false; place(null); return; }
    btn.setAttribute("aria-expanded", "true"); btn.parentNode.classList.add("on");
    box.innerHTML = "";
    var h = document.createElement("h3"); h.textContent = name + ": what The Audit asks"; box.appendChild(h);
    var ul = document.createElement("ul");
    ASKS[name].forEach(function (t) { var li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
    box.appendChild(ul);
    /* round six: where the department paragraphs under the pictures are not shown (a phone), the tap also gives what your
       office does there, word for word from the services rewrite, read from the hidden .area-do lines of the tapped area */
    var desk = document.querySelector(".area-desk");
    if (!desk || getComputedStyle(desk).display === "none") {
      [].slice.call(btn.parentNode.querySelectorAll(".area-do")).forEach(function (d) { var p = document.createElement("p"); p.className = "area-do-line"; p.textContent = d.textContent; box.appendChild(p); });
    }
    place(btn.parentNode);
    box.hidden = false; if (hint) hint.hidden = true;
    var r = box.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight) {
      var still = false; /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting */
      box.scrollIntoView({ block: "nearest", behavior: still ? "auto" : "smooth" });
    }
  }
  taps.forEach(function (t) { t.addEventListener("click", function () { show(t); }); });
})();
