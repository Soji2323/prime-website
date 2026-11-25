/* Round five, the owner's word (November 20, 2026, evening: "the diwali kind lighting up not just image, why all is just
   static"): the whole page lights up like lamps lit one after another. As each section, or each beat of the story, comes
   into view, its key parts light in turn, 180 ms apart: headings, cards, the clock ring, the offer cards, the teaser's
   steps, the services, the peace picture's words and the closing tiles. Each takes a warm glow that comes on in 0.5 s and
   settles to a faint glow over 1.6 s, once. The glow is a drop shadow or a text shadow in the page's yellow ramp, taken
   from the Pixel FX quest-complete seal's warm light (00_Knowledge/SHELF/pixelfx, ui family) and the MotionSites
   staggered reveal recipe; nothing is blurred, words stay sharp, and the four area photos keep their own lighting up.
   What it reads: the page's sections and beats. What it writes: the classes lamp and lamp-on and a --lamp-d delay.
   What calls it: index.html, after the other scripts. With scripts off it does nothing.
   Round seven (November 21, 2026, the owner: "the Diwali kind glow ... its not coming in the phone"): it runs whatever
   the phone's Reduce Motion setting; after the light comes on it stays lit and breathes slowly (css/round7.css), and
   each part pauses its breath while it is off screen (the class lamp-away). */
(function () {
  "use strict";
  /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting; the early stop for reduced motion is removed */
  if (!("IntersectionObserver" in window)) return;
  /* stage five (November 24, 2026, the owner: "Keep the glow only on the main button and the Greenlight rows", then of
     the lighting up, "this area is where we need the glow ... Climax is here"): the glow stands on three places only,
     at every width: the first screen's main button and the Compliance & Safety panel, lit here, and the Greenlight
     rows, lit by js/desk.js. Every other heading and card keeps its own calm light. */
  var PARTS = ".hero .cta-row .btn-yellow, .beat-d .art-card";
  var holders = [].slice.call(document.querySelectorAll(".hero, .beat-d"));
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var parts = [].slice.call(e.target.querySelectorAll(PARTS)).filter(function (p) { return !p.closest(".sr-only") && !p.classList.contains("lamp"); });
      parts.forEach(function (p, i) {
        p.classList.add("lamp", p.matches("h2, h3, .peace-big") ? "lamp-text" : "lamp-box");
        p.style.setProperty("--lamp-d", Math.min(i, 10) * 0.18 + "s");
        requestAnimationFrame(function () { p.classList.add("lamp-on"); });
        away.observe(p);
      });
    });
  }, { threshold: 0.18 });
  /* round seven: a lit part breathes only while it is on screen; off screen its breath pauses (class lamp-away) */
  var away = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle("lamp-away", !e.isIntersecting); });
  }, { rootMargin: "120px 0px 120px 0px" });
  holders.forEach(function (h) { io.observe(h); });
})();
