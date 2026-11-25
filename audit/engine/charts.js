/* charts.js, The Audit revamp (November 19, 2026).
   The result charts, drawn as SVG in code. Three pictures:
   1. the overall readiness ring, a filled ring with the result as one large number;
   2. four area bars side by side, one per area, drawn solid with the weakest outlined;
   3. the eight answers as eight small marks, two in each of their four areas.
   Colours come from CSS variables with fallbacks, so each look themes the same drawing.
   The bars and marks are drawn in a 340 unit wide box, a little wider than the 320 unit box,
   so the word Compliance fits at 16 px and nothing under 14 px survives the page scale. */
(function () {
  "use strict";

  var R = 78, C = 2 * Math.PI * R;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ring(el) {
    if (!el) return { set: function () {} };
    el.innerHTML =
      '<svg class="ring-svg" viewBox="0 0 180 180" role="img" aria-label="Your readiness result">' +
      '<circle class="ring-track" cx="90" cy="90" r="' + R + '" fill="none" style="stroke:var(--ring-track,rgba(35,31,32,.14))" stroke-width="13" />' +
      '<circle class="ring-fill" cx="90" cy="90" r="' + R + '" fill="none" style="stroke:var(--ring-fill,#F6CA18)" stroke-width="13" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" transform="rotate(-90 90 90)" />' +
      '<text class="ring-num" x="90" y="86" text-anchor="middle" style="fill:var(--ring-text,#231F20);font-size:44px;font-weight:800">0%</text>' +
      '<text class="ring-cap" x="90" y="120" text-anchor="middle" style="fill:var(--ring-cap,#231F20);font-size:18px;font-weight:400">readiness</text>' +
      '</svg>';
    var fill = el.querySelector(".ring-fill");
    var numEl = el.querySelector(".ring-num");
    return {
      set: function (pct, dur) {
        pct = Math.max(0, Math.min(100, pct));
        dur = dur || 1500;
        numEl.style.fontSize = (pct === 100) ? "40px" : "44px";
        if (reduce) {
          fill.style.strokeDashoffset = String(C * (1 - pct / 100));
          numEl.textContent = pct + "%";
          return;
        }
        var t0 = null;
        function step(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / dur);
          var e = 1 - Math.pow(1 - k, 3);
          var v = e * pct;
          fill.style.strokeDashoffset = String(C * (1 - v / 100));
          numEl.textContent = Math.round(v) + "%";
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    };
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* four vertical bars side by side, one per area, in a 340 unit wide box.
     Every bar is drawn solid; the weakest is marked by a thicker black outline and a small
     "weakest" label, never by fading the other bars. On the light looks every bar also gets a
     2 px black stroke so the yellow never sits pale on white. */
  function areas(el, data, opts) {
    if (!el) return;
    opts = opts || {};
    var w = 340, top = 36, base = 84, maxH = 48, barW = 40, xs = [40, 120, 200, 290];
    var cls = opts.stagger ? "bars-svg stagger" : "bars-svg";
    var html = '<svg class="' + cls + '" viewBox="0 0 ' + w + ' 110" role="img" aria-label="Your readiness by area">';
    data.forEach(function (ar, i) {
      var cx = xs[i];
      var x = cx - barW / 2;
      var h = Math.round(maxH * ar.pct / 100);
      var y = base - h;
      var weak = ar.weak;
      html += '<g class="bar">' +
        '<rect class="bar-track" x="' + x + '" y="' + top + '" width="' + barW + '" height="' + maxH + '" rx="6" style="fill:var(--bar-track,rgba(35,31,32,.10))" />' +
        '<rect class="bar-fill" x="' + x + '" y="' + y + '" width="' + barW + '" height="' + Math.max(h, 4) + '" rx="6" style="fill:var(--bar-fill,#F6CA18);stroke:var(--bar-stroke,#231F20);stroke-width:' + (weak ? "3" : "2") + ';opacity:' + (weak ? "1" : "var(--bar-dim-opacity,0.55)") + '" />' +
        (weak ? '<text class="bar-weak" x="' + cx + '" y="12" text-anchor="middle" style="fill:var(--bar-text,#231F20);font-size:15px;font-weight:400">weakest</text>' : '') +
        '<text class="bar-pct" x="' + cx + '" y="30" text-anchor="middle" style="fill:var(--bar-text,#231F20);font-size:15px;font-weight:400">' + ar.pct + '%</text>' +
        '<text class="bar-name" x="' + cx + '" y="104" text-anchor="middle" style="fill:var(--bar-text,#231F20);font-size:16px;font-weight:400">' + esc(ar.name) + '</text>' +
        '</g>';
    });
    html += '</svg>';
    el.innerHTML = html;
  }

  /* the third chart: the eight answers as eight small marks, two in each of their four areas.
     A full yellow mark is Yes, a half mark is Partly, an outline is No or not sure. */
  function answersMap(el, answers, opts) {
    if (!el) return;
    opts = opts || {};
    var names = opts.names || ["Company", "Drivers", "Equipment", "Compliance"];
    var xs = [40, 120, 200, 290], yHead = 20, y1 = 56, y2 = 86, r = 12;
    var html = '<svg class="answers-svg" viewBox="0 0 340 100" role="img" aria-label="Your eight answers in their four areas">';
    for (var a = 0; a < 4; a++) {
      html += '<text class="ans-name" x="' + xs[a] + '" y="' + yHead + '" text-anchor="middle" style="fill:var(--mark-text,#231F20);font-size:15px;font-weight:400">' + esc(names[a]) + '</text>';
      html += mark(xs[a], y1, answers[2 * a], r);
      html += mark(xs[a], y2, answers[2 * a + 1], r);
    }
    html += '</svg>';
    el.innerHTML = html;
  }

  function mark(x, y, val, r) {
    var s = 'class="ans-mark" style="fill:var(--mark-fill,#F6CA18);stroke:var(--mark-stroke,#231F20);stroke-width:2"';
    if (val === 0) return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" ' + s + ' />';
    if (val === 1) return '<path d="M ' + x + ' ' + (y - r) + ' A ' + r + ' ' + r + ' 0 0 0 ' + x + ' ' + (y + r) + ' Z" ' + s + ' />';
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" class="ans-mark" style="stroke:var(--mark-stroke,#231F20);stroke-width:2" />';
  }

  window.Charts = { ring: ring, areas: areas, answersMap: answersMap };
})();
