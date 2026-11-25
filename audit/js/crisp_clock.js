/* Round four of the thin layer build (November 20, 2026): the clean clock on The Audit's own pages.
   What it does: css/crisp_clock.css draws the one vector clock in place of the engine's ring. This script only gives it
   its words. On the start screen it sets "8 questions" under the hand; "under a minute" is said once, in the screen's own heading
   above it (round four: "its all repeating"). It gives each clock a spoken
   label, since the engine's ring that carried one is hidden. Since the repeat cuts (November 20, 2026, gate row 32) the
   result shows no clock and no "8 of 8 answered" caption, so nothing is written there. The words "8 questions" also
   stand in each page's own markup (review note 5); the engine's drawing replaces them, and this script puts them back.
   The clock itself never moves and nothing here touches the engine.
   What it reads: #clockHero, #clockQ and #clockResult. What it writes: one small block of words inside #clockHero, role
   and aria-label on the three boxes. What calls it: audit/index.html and audit/end/index.html, after engine/audit.js. */
(function () {
  "use strict";
  var LABEL = "A clock: eight questions, under one minute";
  function label(el) { if (el) { el.setAttribute("role", "img"); el.setAttribute("aria-label", LABEL); } }

  var hero = document.getElementById("clockHero");
  label(hero);
  if (hero && !hero.querySelector(".cc-mid")) {
    var mid = document.createElement("div"); mid.className = "cc-mid"; mid.setAttribute("aria-hidden", "true");
    [["cc-big", "8"], ["cc-q", "questions"]].forEach(function (p) {
      var s = document.createElement("span"); s.className = p[0]; s.textContent = p[1]; mid.appendChild(s);
    });
    hero.appendChild(mid);
  }
  label(document.getElementById("clockQ"));

  label(document.getElementById("clockResult"));
})();
