/* clock.js, The Audit revamp (November 19, 2026).
   One SVG clock drawn in code and shared by every look, the result and the end page.
   It is a picture of how short the check is, never a timer:
   4 segments for the 4 areas, 8 dots for the 8 questions, one hand, "under 1 min" in the centre.
   On load the hand sweeps once (about 1.2 s, ease out). On each answer one dot fills and the
   matching quarter of its segment fills. On the result the dial is full.
   The two centre words are drawn only on the large hero clock; on the small question and result
   clocks the dial is a pure picture so no text falls under 14 px after scaling.
   Colours come from CSS variables with fallbacks, so each look themes the same drawing. */
(function () {
  "use strict";

  var CX = 100, CY = 100, R0 = 55, R1 = 76, DOT_R = 87, DOT_r = 3.4, HAND_LEN = 46;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rad(a) { return a * Math.PI / 180; }
  function pt(a, r) {
    return [CX + r * Math.cos(rad(a)), CY + r * Math.sin(rad(a))];
  }
  function num(n) { return String(Math.round(n * 100) / 100); }

  /* one annular sector, the filled quarter of a segment */
  function sector(a0, a1) {
    var p0 = pt(a0, R0), p1 = pt(a0, R1), p2 = pt(a1, R1), p3 = pt(a1, R0);
    return "M" + num(p0[0]) + " " + num(p0[1]) +
      " L" + num(p1[0]) + " " + num(p1[1]) +
      " A" + R1 + " " + R1 + " 0 0 1 " + num(p2[0]) + " " + num(p2[1]) +
      " L" + num(p3[0]) + " " + num(p3[1]) +
      " A" + R0 + " " + R0 + " 0 0 0 " + num(p0[0]) + " " + num(p0[1]) + " Z";
  }

  /* one faint segment ring, drawn as an arc so the 4 areas read as 4 segments */
  function segArc(a0, a1) {
    var p0 = pt(a0, R1), p1 = pt(a1, R1);
    return "M" + num(p0[0]) + " " + num(p0[1]) +
      " A" + R1 + " " + R1 + " 0 0 1 " + num(p1[0]) + " " + num(p1[1]);
  }

  function make(el, small) {
    if (!el) return { setProgress: function () {}, sweep: function () {}, fill: function () {} };

    var cells = "", dots = "", segs = "", i;
    for (i = 0; i < 8; i++) {
      var start = -90 + i * 45;
      var gapIn = (i % 2 === 0) ? 3.6 : 1.4;   /* a wider gap marks the 4 area boundaries */
      var gapOut = ((i + 1) % 2 === 0) ? 3.6 : 1.4;
      cells += '<path class="ck-fill" d="' + sector(start + gapIn, start + 45 - gapOut) + '" style="fill:var(--clock-fill,#F6CA18)" />';
      var dp = pt(start + 22.5, DOT_R);
      dots += '<circle class="ck-dot" cx="' + num(dp[0]) + '" cy="' + num(dp[1]) + '" r="' + DOT_r + '" style="fill:var(--clock-dot,#ffffff)" />';
    }
    for (i = 0; i < 4; i++) {
      var s0 = -90 + i * 90;
      segs += '<path class="ck-seg" d="' + segArc(s0 + 2.4, s0 + 90 - 2.4) + '" style="stroke:var(--clock-track,#e5e7eb)" fill="none" stroke-width="3" stroke-linecap="round" />';
    }

    var text = "";
    if (!small) {
      text =
        '<text class="ck-text" x="' + CX + '" y="118" text-anchor="middle" style="fill:var(--clock-text,#231F20)">' +
        '<tspan x="' + CX + '" y="118" style="font-size:15px;font-weight:400">under</tspan>' +
        '<tspan class="ck-big" x="' + CX + '" y="140" style="font-size:22px;font-weight:510">1 min</tspan>' +
        '</text>';
    }

    var svg =
      '<svg class="clock" viewBox="0 0 200 200" role="img" aria-label="A clock picture: four areas, eight questions, under 1 min">' +
      segs +
      cells +
      dots +
      '<g class="ck-hand"><circle cx="' + CX + '" cy="' + CY + '" r="4.5" style="fill:var(--clock-hand,#231F20)" />' +
      '<line x1="' + CX + '" y1="' + CY + '" x2="' + CX + '" y2="' + (CY - HAND_LEN) + '" style="stroke:var(--clock-hand,#231F20)" stroke-width="3.4" stroke-linecap="round" /></g>' +
      text +
      '</svg>';

    el.innerHTML = svg;

    var fills = el.querySelectorAll(".ck-fill");
    var dotsAll = el.querySelectorAll(".ck-dot");
    var hand = el.querySelector(".ck-hand");

    function setProgress(n) {
      n = Math.max(0, Math.min(8, n));
      for (var i = 0; i < 8; i++) {
        var on = i < n;
        fills[i].style.opacity = on ? "1" : "0";
        dotsAll[i].style.fill = on ? "var(--clock-fill,#F6CA18)" : "var(--clock-dot,#ffffff)";
      }
    }

    function sweep() {
      if (reduce || !hand) { if (hand) hand.setAttribute("transform", "rotate(0 100 100)"); return; }
      var t0 = null, dur = 1200, from = -90;
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        hand.setAttribute("transform", "rotate(" + (from * (1 - e)) + " 100 100)");
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    setProgress(0);
    sweep();

    return { setProgress: setProgress, sweep: sweep };
  }

  window.Clock = { make: make };
})();
