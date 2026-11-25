/* Round four, the repeat cuts (November 20, 2026, gate row 29). What it does: when The Audit is opened from the home
   page's Start The Audit, whose address ends in #start, it presses the start button once, so the owner lands on
   question 1 and does not meet the first screen's photo, clock and start button a second time. Anyone who opens The
   Audit by itself still sees its start screen. It sits outside the engine and changes nothing in it.
   What it reads: location.hash, the start button #startBtn and window.Pixel. What it writes: that one press, the class
   skip-landing taken off the html, and #start taken off the address, so a reload or the back button behaves as before.
   What calls it: audit/index.html and audit/end/index.html, after engine/audit.js. */
(function () {
  "use strict";
  var html = document.documentElement;
  /* the second repeat gate (round five): the page's head hid the start screen before its first paint when the address
     ends in #start or #q1-0 to #q1-2. For #q1-n the engine has already opened the question; for #start the start button
     is pressed here with the engine's pixel break held back for this one press (window.Pixel is set aside and put back),
     because that break paints a picture of the start screen as it scatters. Only then does the start screen's cover go. */
  if (location.hash === "#start") {
    var btn = document.getElementById("startBtn");
    if (btn) {
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
      var px = window.Pixel; window.Pixel = null;
      try { btn.click(); } finally { window.Pixel = px; }
    }
  }
  html.classList.remove("skip-landing");
})();
