/* The quiet music (round five, November 20, 2026).
   What it does: plays one soft, warm music loop under the browsing, only after the visitor taps the small speaker button.
   It is off at first, and nothing is loaded before the first tap: no audio element, no audio context, no request for the
   file. A tap fades the music in over two seconds; a second tap fades it out over two seconds and pauses it. When the tab
   is hidden it fades out and pauses; when the tab comes back it resumes only if the visitor had it on. The visitor's
   choice is remembered in localStorage, inside try and catch, and is never used to start sound by itself: a visitor who
   had it on sees a small dot on the button and taps to bring it back.
   What it reads: the button #snd and its data-src (the loop, audio/peace_loop.mp3, "Peaceful Ambiance Music" by TheoJT,
   CC BY 4.0; the owner took the credit lines off the footer on November 21, 2026, and his team places them from CREDITS.md), and localStorage key "prime-sound". What it writes: one hidden <audio> element
   appended to the body on the first tap, the button's aria-pressed, and the localStorage key.
   What calls it: index.html, after the other scripts. With scripts off the button does nothing and no sound plays. */
(function () {
  "use strict";
  var btn = document.getElementById("snd");
  if (!btn) return;
  var KEY = "prime-sound", LEVEL = 0.8, FADE = 2;   /* the file is mastered near -25 LUFS; 0.8 sits a little under it */
  var audio = null, ctx = null, gain = null, on = false, stopTimer = 0, hiddenPause = false;

  function remember(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked: the choice is not kept */ } }
  function recalled() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  if (recalled() === "on") btn.classList.add("was-on");

  function build() {
    audio = document.createElement("audio");
    audio.src = btn.getAttribute("data-src");
    audio.loop = true; audio.preload = "auto"; audio.hidden = true;
    audio.setAttribute("aria-hidden", "true");
    document.body.appendChild(audio);
    var AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {   /* a gain node fades smoothly everywhere, including phones where audio.volume is fixed */
      try { ctx = new AC(); gain = ctx.createGain(); gain.gain.value = 0; ctx.createMediaElementSource(audio).connect(gain); gain.connect(ctx.destination); }
      catch (e) { ctx = null; gain = null; }
    }
    if (!gain) audio.volume = 0;
  }

  function ramp(to, secs) {
    if (gain) {
      var t = ctx.currentTime, g = gain.gain;
      g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(to, t + secs);
    } else {
      var from = audio.volume, t0 = performance.now();
      (function step(now) { var k = Math.min(1, (now - t0) / (secs * 1000)); audio.volume = from + (to - from) * k; if (k < 1) requestAnimationFrame(step); })(t0);
    }
  }

  function play() {
    clearTimeout(stopTimer);
    if (ctx && ctx.state === "suspended") ctx.resume();
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setState(false); });   /* blocked or failed: the button shows off again */
    ramp(LEVEL, FADE);
  }
  function stop(then) {
    ramp(0, FADE);
    clearTimeout(stopTimer);
    stopTimer = setTimeout(function () { audio.pause(); if (then) then(); }, FADE * 1000 + 60);
  }
  function setState(v) {
    on = v;
    btn.setAttribute("aria-pressed", v ? "true" : "false");
    btn.classList.remove("was-on");
    remember(v ? "on" : "off");
  }

  btn.addEventListener("click", function () {
    if (!audio) build();
    if (on) { setState(false); stop(); } else { setState(true); play(); }
  });

  document.addEventListener("visibilitychange", function () {
    if (!audio) return;
    if (document.hidden && on) { hiddenPause = true; stop(); }
    else if (!document.hidden && on && hiddenPause) { hiddenPause = false; play(); }
  });
})();
