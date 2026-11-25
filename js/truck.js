/* Build v6, the thin layer (November 20, 2026): the small truck with its driver.
   What it does: a very small oxblood red truck and its driver, drawn with the Pixel FX engine ahead of time
   (fx/truck.webp, four wheel turn frames, and fx/puff.webp, one exhaust puff in eight frames; made by
   00_Knowledge/Growth/work/jobs/site_today_layer_offers_Nov20/build/pixelfx_render/render.mjs), rides the foot of the
   screen once the first screen is scrolled away. Its place is tied to how far down the page you are: it moves forward
   as you scroll down and backs up as you scroll up, its wheels turning with the distance and very small puffs of smoke
   leaving its stack while it moves. When the scroll stops, it stops; the last puffs thin out and nothing loops. It
   rides in front of plain words and pictures and steps aside only while a button or a link lies in its path (round five,
   the owner's word and the fresh check). It starts at the bottom right and drives left as the page goes down.
   What it reads: the two pictures, the page's scroll position and the positions of the first screen and the still beat.
   It asks the network for nothing beyond the two pictures in its own folder. What it writes: one fixed layer with one
   small canvas, and the class "truck-on" on the page, which hides the parked truck.
   What calls it: index.html, last. Round seven (November 21, 2026): it rides the same whatever the phone's Reduce
   Motion setting; with scripts off the parked truck shows at rest at the foot of peace of mind. */
(function () {
  "use strict";
  /* round seven (Nov 21, 2026): moves on every phone, whatever its Reduce Motion setting; the early stop for reduced motion is removed */
  var canvasOk = !!document.createElement("canvas").getContext;
  if (!canvasOk) return;
  var TW = 66, TH = 27, STACK_X = 42.5, STACK_Y = 1, LEFT = 44, TOP = 12, AW = TW + LEFT + 12, AH = TH + TOP;
  var truckImg = new Image(), puffImg = new Image(), loaded = 0;
  var hero = document.querySelector(".hero"), still = document.querySelector(".beat-c");
  /* after the fresh review of round three (note 8, carried from round two note 6): it also steps aside while the peace of
     mind beat or the Films and offers headings are on screen, so it never sits on "Hence, peace of mind." or a heading */
  /* round five, the owner's word ("the bottom truck being there was the reason someone would understand it's a truck"): it
     stays in sight at the foot all the way down, in front of plain words and pictures, and steps aside only for a button or
     a link in its path, so it never sits on a control; no section and no still beat makes it step aside any more */
  var quiet = [];
  still = null;
  /* after the fresh review of round four (note 4): it also steps aside whenever any heading, story sentence or the Fail
     line touches the band at the foot of the screen where it rides, so it never covers a heading at any width */
  /* round five (the fresh review's note 1): it steps aside for any words, button or tile in its band, not only headings,
     wherever it would ride over them, from where it stands to where it is going */
  var WORDS = 'main a, main button:not(.offer-tap):not(.area-tap), main summary, .foot a'; /* the offer and area cards' whole-card tap buttons count as pictures: the truck takes no taps, so a tap on a card under it still lands */
  /* round six (November 20, 2026): the service chips of part 9 that open on a tap are summary elements, buttons in all but
     name, so the truck steps aside for them too, as it does for every button and link */
  var heads = []; /* looked up again on each move, since some links (the closing block's tiles) are drawn after this script runs */
  var ride, cv, g, dps = 2, cssPer = 1, worldX = 0, targetX = 0, dist = 0, puffs = [], lastSpawn = 0, running = false, lastT = 0, shown = false;

  function setup() {
    ride = document.createElement("div"); ride.className = "truck-ride"; ride.setAttribute("aria-hidden", "true");
    cv = document.createElement("canvas"); ride.appendChild(cv); document.body.appendChild(ride);
    g = cv.getContext("2d");
    document.documentElement.classList.add("truck-on");
    size(); place(true); draw();
    window.addEventListener("scroll", function () { place(false); }, { passive: true });
    window.addEventListener("resize", function () { size(); place(true); draw(); });
    /* the truck never covers what the keyboard has focused near the foot of the screen */
    document.addEventListener("focusin", function (e) { var r = e.target.getBoundingClientRect ? e.target.getBoundingClientRect() : null; ride.classList.toggle("aside", !!r && r.bottom > window.innerHeight - AH * cssPer - 12); });
    document.addEventListener("focusout", function () { ride.classList.remove("aside"); });
  }
  function size() {
    var dpr = window.devicePixelRatio || 1, scale = window.innerWidth <= 1000 ? 1.5 : 2;
    dps = Math.max(1, Math.floor(scale * dpr + 0.01)); /* whole device pixels per art pixel, never larger than asked */
    cssPer = dps / dpr;
    cv.width = AW * dps; cv.height = AH * dps;
    cv.style.width = (AW * cssPer) + "px"; cv.style.height = (AH * cssPer) + "px";
    g.imageSmoothingEnabled = false;
  }
  /* how far down the page, from the end of the first screen to the end of the page, as 0 to 1 */
  function progress() {
    var start = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
    var end = Math.max(start + 1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, (window.scrollY - start * 0.85) / (end - start * 0.85)));
  }
  function place(jump) {
    var gutter = window.innerWidth <= 560 ? 14 : 28;
    var run = window.innerWidth - TW * cssPer - gutter * 2;
    /* round five, the owner's word ("when the yellow truck comes down, the reddish truck should start moving from bottom
       right to left, both need not ever come close"): it starts at the bottom right and drives left as the page goes down,
       while the yellow truck travels down the right edge, so the two are never near each other */
    targetX = (gutter + (1 - progress()) * run) / cssPer;
    if (jump) worldX = targetX;
    var past = hero ? window.scrollY > hero.offsetTop + hero.offsetHeight * 0.85 : true;
    var calm = false; /* round five: it no longer steps aside; it rides beneath the words (css/round5.css), so the old rules below are kept switched off */
    var OFF = false;
    if (!OFF && still) { var r = still.getBoundingClientRect(); calm = r.top < window.innerHeight * 0.72 && r.bottom > window.innerHeight * 0.28; }
    /* it also steps aside while the audit band or the offers are on screen, so it never sits over their words or buttons */
    for (var i = 0; !OFF && i < quiet.length && !calm; i++) { var q = quiet[i].getBoundingClientRect(); calm = q.top < window.innerHeight && q.bottom > 0; }
    var want = past && !calm && !controlInPath();
    if (want !== shown) { shown = want; ride.classList.toggle("show", want); }
    if (!running) { running = true; lastT = 0; requestAnimationFrame(tick); }
  }
  /* is a button or link in the truck's band, from where it stands to where it is going */
  function controlInPath() {
    heads = document.querySelectorAll(WORDS);
    var band = window.innerHeight - 6 - AH * cssPer - 10, hit = false;
    var x0 = (Math.min(worldX, targetX) - LEFT) * cssPer - 24, x1 = (Math.max(worldX, targetX) - LEFT + AW) * cssPer + 24;
    for (var j = 0; j < heads.length && !hit; j++) { var h = heads[j].getBoundingClientRect(); hit = h.width > 0 && h.bottom > band && h.top < window.innerHeight && h.right > x0 && h.left < x1; }
    return hit;
  }
  /* stage five (November 24, 2026): when the truck comes to rest, its path is looked at again where it now stands, so a
     control it only passed on the way no longer keeps it out of sight; it still never stands over a button or a link */
  function settle() {
    var past = hero ? window.scrollY > hero.offsetTop + hero.offsetHeight * 0.85 : true;
    var want = past && !controlInPath();
    if (want !== shown) { shown = want; ride.classList.toggle("show", want); }
  }
  function tick(now) {
    var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now;
    var before = worldX;
    worldX += (targetX - worldX) * Math.min(1, dt * 9);
    if (Math.abs(targetX - worldX) < 0.05) worldX = targetX;
    var moved = worldX - before;
    dist += moved;
    /* a puff about every four art pixels of travel, from the top of the stack */
    if (Math.abs(dist - lastSpawn) >= 4 && shown) {
      lastSpawn = dist;
      var seed = puffs.length + Math.round(dist * 7);
      puffs.push({ x: worldX + STACK_X - 6, y: STACK_Y - 9, age: 0, vx: (((seed * 37) % 9) - 4) * 0.8 - (moved > 0 ? 3 : -2), vy: -9 - (seed % 4) });
    }
    puffs.forEach(function (p) { p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; });
    puffs = puffs.filter(function (p) { return p.age < 0.8; });
    ride.setAttribute("data-puffs", String(puffs.length)); /* read by home_test_v6.js */
    ride.style.transform = "translate3d(" + ((worldX - LEFT) * cssPer).toFixed(2) + "px,0,0)";
    draw();
    if (worldX !== targetX || puffs.length) requestAnimationFrame(tick); else { running = false; settle(); }
  }
  function draw() {
    if (loaded < 2) return;
    g.clearRect(0, 0, cv.width, cv.height);
    var f = ((Math.floor(dist / 2.4) % 4) + 4) % 4;
    g.drawImage(truckImg, f * TW, 0, TW, TH, LEFT * dps, TOP * dps, TW * dps, TH * dps);
    puffs.forEach(function (p) {
      var k = Math.min(7, Math.floor(p.age / 0.8 * 8));
      var ax = Math.round(p.x - worldX + LEFT), ay = Math.round(p.y + TOP);
      g.drawImage(puffImg, k * 12, 0, 12, 12, ax * dps, ay * dps, 12 * dps, 12 * dps);
    });
  }
  function ready() { loaded++; if (loaded === 2) setup(); }
  truckImg.onload = ready; puffImg.onload = ready;
  truckImg.src = "fx/truck.webp"; puffImg.src = "fx/puff.webp";
})();
