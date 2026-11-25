/* The team's WhatsApp number (November 21, 2026, the team's decision passed on by the owner: WhatsApp Business is not in
   use today, so 780-209-1000 is the WhatsApp number as well as the call number).
   What it does: The Audit's engine (engine/audit.js) writes its own WhatsApp link on the result with the old number, and
   the engine stays byte for byte as approved. So this small script, loaded after the engine, swaps the number on every
   WhatsApp link the moment it is written, and again at the moment of a tap. The ready message is never touched.
   It also covers the Send button on the result: there the engine opens WhatsApp with window.open and no link, so this
   script wraps window.open and swaps the number on the way out. The engine's last fallback, a plain change of address,
   runs only when window.open throws, which a phone browser does not do.
   What it reads: every link to wa.me on the page, and every address handed to window.open. What it writes: the number only.
   What calls it: audit/index.html and audit/end/index.html, after engine/audit.js. */
(function () {
  "use strict";
  var OLD = /wa\.me\/17809097200/, NEW = "wa.me/17802091000";
  var open0 = window.open;
  window.open = function () { var args = [].slice.call(arguments); if (typeof args[0] === "string") args[0] = args[0].replace(OLD, NEW); return open0.apply(window, args); };
  function fix(a) { if (a && a.href && OLD.test(a.href)) a.href = a.href.replace(OLD, NEW); }
  function all() { [].forEach.call(document.querySelectorAll('a[href*="wa.me/"]'), fix); }
  all();
  new MutationObserver(all).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["href"], childList: true });
  document.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest('a[href*="wa.me/"]'); fix(a); }, true);
})();
