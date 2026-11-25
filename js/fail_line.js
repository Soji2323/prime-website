/* Round four of the thin layer build (November 20, 2026): "Fail to inspect, expect to fail." typed in, one letter at a
   time, the way "compliance" is typed in the first beat.
   What it does: once, when the line is well inside the screen, the letters arrive one by one with a red caret.
   "Fail to inspect," types at a steady pace, there is a short breath, "expect to" types, there is a longer breath, and
   then the last word "fail." types slowly in the truck's red. A stroke in the same red then draws under it (css/round4.css) and nothing
   moves again. The words never change: every letter stays in the page as text, a screen reader gets the whole line once
   from a visually hidden copy, and both "fail" words are red in the markup itself, so the colour shows with scripts
   off. Clean type only: no pixel drawing, no soft focus, no shaking.
   What it reads: the .still-line paragraph. What it writes: a visually hidden copy of the line, one span per letter
   (hidden from screen readers) and the classes fl-armed, in, cur and fl-done.
   What calls it: index.html, after js/layer.js. It types the same whatever the phone's Reduce Motion setting (round
   seven, November 21, 2026); with scripts off it does nothing and the line stands whole. Values: 55 ms a letter, 420 ms after the comma, 620 ms before the last word, 150 ms a letter for the last word.
   Round five (November 20, 2026, Soji: "Inspect is a profound word, can you bring that character by character in
   appropriate speed"): a 350 ms pause before "inspect", its letters 140 ms apart, the comma after it at the steady pace;
   Since the owner's next word ("character by character in a contrast color"): "inspect" is the page's yellow (in the
   markup, so it shows with scripts off), 400 ms pause before it, its letters 180 ms apart with a soft yellow caret.
   The whole line types in about 3.8 s, the stroke then draws in 0.6 s. */
(function () {
  "use strict";
  var reduce = false; /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting */
  var line = document.querySelector(".still-line");
  if (!line || reduce || !("IntersectionObserver" in window)) return;
  var whole = line.textContent;

  /* wrap every letter of every text node in a span, keeping the markup and the words as they are */
  var chars = [];
  (function walk(node) {
    [].slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.nodeValue.split("").forEach(function (c) {
          if (c === " ") { frag.appendChild(document.createTextNode(" ")); return; }
          var s = document.createElement("span"); s.className = "fl-c"; s.textContent = c; frag.appendChild(s);
          var insp = !!(n.parentNode.closest && n.parentNode.closest(".fl-insp"));
          chars.push({ el: s, last: !!(n.parentNode.closest && n.parentNode.closest(".fl-end")), comma: c === ",", insp: insp });
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1) walk(n);
    });
  })(line);
  [].slice.call(line.children).forEach(function (k) { k.setAttribute("aria-hidden", "true"); });
  var sr = document.createElement("span"); sr.className = "sr-only fl-sr"; sr.textContent = whole;
  line.insertBefore(sr, line.firstChild);
  line.classList.add("fl-armed");

  var played = false;
  function play() {
    if (played) return; played = true;
    var i = 0;
    (function next() {
      if (i > 0) chars[i - 1].el.classList.remove("cur");
      if (i >= chars.length) { line.classList.add("fl-done"); return; }
      var c = chars[i];
      c.el.classList.add("in", "cur");
      i++;
      var wait = c.last ? 150 : 55;
      if (c.insp && chars[i] && chars[i].insp) wait = 180;   /* inspect, letter by letter, weighed, in the yellow */
      if (!c.insp && chars[i] && chars[i].insp) wait = 400;  /* a short pause before it */
      if (c.comma) wait = 420;
      if (chars[i] && chars[i].last && !c.last) wait = 620;
      setTimeout(next, wait);
    })();
  }
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); play(); } });
  }, { threshold: 0.6, rootMargin: "0px 0px -8% 0px" }).observe(line); /* round five, review 7: it starts as soon as the line is well on screen, and its letters wait faintly visible (css/round5.css), so the space never reads as empty */ /* round five: it starts only once the whole line stands in the upper three quarters of the screen, so on a phone it is seen typing */
  /* failsafe: if the observer never fires, the line still shows whole */
  setTimeout(function () { if (!played) { var r = line.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) play(); } }, 6000);
})();
