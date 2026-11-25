/* Round five (November 20, 2026): the closing block's tiles, every way to reach us.
   What it does: draws one tile for each line of js/channels.js into #chMain (Call, WhatsApp, Website) and #chSocial
   (the six social accounts), each with its mark from js/channel_marks.js drawn inline in one colour, sharp. A line with
   an address becomes a link. A line with no address is not drawn on the public page; with PREVIEW true it is drawn with
   no link and reads "being set up". The tiles rise in once as the block reaches the view, softly, with the vendored
   window.Motion; with no Motion they simply stand (round seven: the same whatever the phone's Reduce Motion setting).
   What it reads: window.PRIME_CHANNELS, window.PRIME_CHANNELS_PREVIEW, window.PRIME_CHANNEL_MARKS, window.Motion.
   What it writes: the tiles inside #chMain and #chSocial, and the hidden state of #chSocial.
   What calls it: index.html, after js/channels.js and js/channel_marks.js. With scripts off the three main tiles show
   from the noscript copy in index.html. Round eight (November 21, 2026, the owner's words on the lag): nothing it moves starts hidden; each part waits at 60 in a hundred of its light and the movement adds the rest (css/round8.css). */
(function () {
  "use strict";
  var list = window.PRIME_CHANNELS || [], marks = window.PRIME_CHANNEL_MARKS || {}, preview = window.PRIME_CHANNELS_PREVIEW === true;
  /* round five, the owner's word ("human decide on emotions"; round5/CLOSING_WORDS.md): the closing heading and its line
     flow in, one after the other, once, as the block comes into view */
  var flowReduce = false; /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting */
  var block = document.getElementById("contact");
  if (block && !flowReduce && "IntersectionObserver" in window) {
    block.classList.add("cl-armed");
    var fio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fio.disconnect(); block.classList.add("cl-in"); } }); }, { threshold: 0.25 });
    fio.observe(block);
  }
  var main = document.getElementById("chMain"), social = document.getElementById("chSocial");
  if (!main || !social) return;
  var NS = "http://www.w3.org/2000/svg";
  function mark(key) {
    var m = marks[key]; if (!m) return null;
    var svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "ch-mark");
    var path = document.createElementNS(NS, "path");
    if (typeof m === "object") { path.setAttribute("d", m.d); path.setAttribute("fill", "none"); path.setAttribute("stroke", "currentColor"); path.setAttribute("stroke-width", "2"); /* round five polish: the line globe at 2 reads at the weight of the filled marks */ path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round"); }
    else { path.setAttribute("d", m); path.setAttribute("fill", "currentColor"); }
    svg.appendChild(path); return svg;
  }
  var isMain = function (c) { return c.key === "call" || c.key === "whatsapp" || c.key === "website"; };
  main.textContent = "";
  var drawn = [], socialCount = 0;
  list.forEach(function (c) {
    var href = (c.href || "").trim();
    if (!href && !preview) return;
    var el = document.createElement(href ? "a" : "div");
    el.className = "tile-s ch-tile ch-" + c.key + (href ? "" : " ch-off");
    el.setAttribute("data-channel", c.key);
    if (href) { el.href = href; if (/^https?:/.test(href)) { el.target = "_blank"; el.rel = "noopener"; } }
    var mk = mark(c.mark); if (mk) el.appendChild(mk); else el.classList.add("ch-nomark");
    var txt = document.createElement("span"); txt.className = "ch-txt";
    var b = document.createElement("b"); b.textContent = c.name; txt.appendChild(b);
    if (c.detail) { var d = document.createElement("span"); d.className = "ch-d"; d.textContent = c.detail; txt.appendChild(d); }
    if (c.pa) { var pa = document.createElement("span"); pa.className = "ch-pa"; pa.lang = "pa"; pa.textContent = c.pa; txt.appendChild(pa); }
    if (!href) { var o = document.createElement("span"); o.className = "ch-soon"; o.textContent = "being set up"; txt.appendChild(o); }
    el.appendChild(txt);
    if (isMain(c)) main.appendChild(el); else { social.appendChild(el); socialCount++; }
    drawn.push(el);
  });
  social.hidden = socialCount === 0;

  /* the calm rise, once, as the block reaches the view (pieces 4 and 7) */
  var reduce = false /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting */, M = window.Motion;
  if (reduce || !M || !M.inView || !M.animate || !drawn.length) return;
  drawn.forEach(function (el) { el.style.opacity = "0.6"; el.style.transform = "translateY(14px)"; }); /* round eight: the tiles are seen from the first moment */
  M.inView("#channels", function () {
    drawn.forEach(function (el, i) {
      var a = M.animate(el, { opacity: [0.6, 1], transform: ["translateY(14px)", "translateY(0px)"] }, { duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] });
      if (a && a.then) a.then(function () { el.style.opacity = ""; el.style.transform = ""; });
    });
  }, { amount: 0.2 });
})();
