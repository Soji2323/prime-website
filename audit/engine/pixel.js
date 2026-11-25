/* pixel.js, The Audit revamp (November 19, 2026).
   The pixel break between states. The outgoing screen is rasterised into a canvas, split into
   square pixels, and those pixels scatter away to settle into the next screen. About 400 ms.
   With prefers-reduced-motion it is a plain swap. No library, no network. */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* the visual properties the pixel break needs, copied from computed style so the raster
     matches the screen even inside a foreignObject with no stylesheet */
  var PROPS = [
    "display", "position", "top", "right", "bottom", "left", "width", "height",
    "min-width", "min-height", "max-width", "max-height",
    "margin-top", "margin-right", "margin-bottom", "margin-left",
    "padding-top", "padding-right", "padding-bottom", "padding-left",
    "box-sizing", "overflow", "overflow-x", "overflow-y",
    "flex-direction", "flex-wrap", "flex-basis", "flex-grow", "flex-shrink",
    "align-items", "align-self", "justify-content", "order", "gap", "row-gap", "column-gap",
    "grid-template-columns", "grid-template-rows", "grid-auto-flow", "grid-column", "grid-row",
    "justify-items", "justify-self", "align-content",
    "text-align", "line-height", "letter-spacing", "word-spacing", "white-space",
    "text-transform", "text-decoration", "vertical-align",
    "font-family", "font-size", "font-style", "font-weight", "color",
    "background-color", "background-image", "background-position", "background-size", "background-repeat",
    "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
    "border-top-style", "border-right-style", "border-bottom-style", "border-left-style",
    "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
    "border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius",
    "box-shadow", "opacity", "transform", "transform-origin", "z-index",
    "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin",
    "fill-opacity", "stroke-opacity", "stroke-dasharray"
  ];

  function copyStyles(src, dst) {
    if (src.nodeType !== 1 || dst.nodeType !== 1) return;
    var cs = window.getComputedStyle(src);
    var parts = [];
    for (var i = 0; i < PROPS.length; i++) {
      var v = cs.getPropertyValue(PROPS[i]);
      if (v) parts.push(PROPS[i] + ":" + v);
    }
    if (parts.length) dst.setAttribute("style", parts.join(";"));
    var sc = src.children, dc = dst.children;
    for (var i = 0; i < sc.length; i++) if (dc[i]) copyStyles(sc[i], dc[i]);
  }

  /* rasterise the visible page and return a canvas of the current viewport, or null */
  function capture(cb) {
    try {
      var vw = window.innerWidth, vh = window.innerHeight;
      var body = document.body;
      var w = Math.max(vw, document.documentElement.scrollWidth);
      var h = Math.max(vh, document.documentElement.scrollHeight);

      var clone = body.cloneNode(true);
      copyStyles(body, clone);

      var html = new XMLSerializer().serializeToString(clone);
      var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0;width:' + w + 'px;height:' + h + 'px">' +
        html +
        '</div></foreignObject></svg>';

      var img = new Image();
      var done = false;
      img.onload = function () {
        if (done) return; done = true;
        try {
          var full = document.createElement("canvas");
          full.width = w; full.height = h;
          var fctx = full.getContext("2d");
          fctx.drawImage(img, 0, 0);
          var view = document.createElement("canvas");
          view.width = vw; view.height = vh;
          var vctx = view.getContext("2d");
          vctx.drawImage(full, 0, window.scrollY, vw, vh, 0, 0, vw, vh);
          var sample = vctx.getImageData(Math.floor(vw / 2), Math.floor(vh / 2), 1, 1).data;
          cb(sample[3] > 0 ? view : null);
        } catch (e) { cb(null); }
      };
      img.onerror = function () { if (done) return; done = true; cb(null); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
      setTimeout(function () { if (!done) { done = true; cb(null); } }, 500);
    } catch (e) {
      cb(null);
    }
  }

  function scatter(shot, done) {
    window.__pixelBreaks = (window.__pixelBreaks || 0) + 1;
    window.__pixelStage = "scatter";
    var vw = window.innerWidth, vh = window.innerHeight;
    var dpr = window.devicePixelRatio || 1;
    var layer = document.createElement("canvas");
    layer.width = vw * dpr;
    layer.height = vh * dpr;
    layer.style.cssText = "position:fixed;left:0;top:0;width:" + vw + "px;height:" + vh + "px;z-index:9999;pointer-events:none;";
    var ctx = layer.getContext("2d");
    document.body.appendChild(layer);

    var size = Math.max(12, Math.round(Math.min(vw, vh) / 24));
    var cols = Math.ceil(vw / size), rows = Math.ceil(vh / size);
    var cells = [];
    var src = shot;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var c = document.createElement("canvas");
        c.width = size; c.height = size;
        c.getContext("2d").drawImage(src, x * size, y * size, size, size, 0, 0, size, size);
        cells.push({
          c: c, x: x * size, y: y * size,
          dx: (Math.random() * 2 - 1) * 64,
          dy: (Math.random() * 2 - 1) * 110 + 26,
          rot: (Math.random() * 2 - 1) * 0.55
        });
      }
    }

    var t0 = null, dur = 420;
    function frame(now) {
      if (!t0) t0 = now;
      var k = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      window.__pixelStage = k < 0.3 ? "scatter" : (k < 0.9 ? "mid" : "late");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        ctx.save();
        ctx.globalAlpha = 1 - e;
        ctx.translate(cell.x + cell.dx * e + size / 2, cell.y + cell.dy * e + size / 2);
        ctx.rotate(cell.rot * e);
        ctx.drawImage(cell.c, -size / 2, -size / 2);
        ctx.restore();
      }
      if (k < 1) requestAnimationFrame(frame);
      else { window.__pixelStage = "done"; layer.parentNode.removeChild(layer); if (done) done(); }
    }
    requestAnimationFrame(frame);
  }

  /* the one entry point the engine calls: capture the old screen, apply the new state, scatter */
  function break_(applyFn, done) {
    if (reduce) { applyFn(); if (done) done(); return; }
    var finished = false;
    function proceed(shot) {
      if (finished) return; finished = true;
      applyFn();
      if (shot) scatter(shot, done);
      else if (done) done();
    }
    capture(function (shot) { proceed(shot); });
  }

  /* Look E2: a photo band fades in by the pixel effect as it enters the viewport.
     A grid of dark squares is laid over the band and each square fades out in a slightly
     random order, so the band appears pixel by pixel. With reduced motion it is a plain show. */
  function reveal(el) {
    if (!el) return;
    el.classList.add("revealed");
    if (reduce) return;
    var r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    var dpr = window.devicePixelRatio || 1;
    var layer = document.createElement("canvas");
    layer.width = Math.ceil(r.width * dpr);
    layer.height = Math.ceil(r.height * dpr);
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:absolute;left:0;top:0;width:" + r.width + "px;height:" + r.height + "px;z-index:6;pointer-events:none;";
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.appendChild(layer);
    var ctx = layer.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var size = Math.max(10, Math.round(Math.min(r.width, r.height) / 18));
    var cols = Math.ceil(r.width / size), rows = Math.ceil(r.height / size);
    var cells = [];
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        cells.push({ x: x * size, y: y * size, d: Math.random() * 0.55 });
      }
    }
    var t0 = null, dur = 700;
    function frame(now) {
      if (!t0) t0 = now;
      var k = Math.min(1, (now - t0) / dur);
      ctx.clearRect(0, 0, r.width, r.height);
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        var a = Math.max(0, Math.min(1, (1 - (k - c.d) / 0.5)));
        if (a <= 0) continue;
        ctx.fillStyle = "rgba(13,13,17," + a.toFixed(3) + ")";
        ctx.fillRect(c.x, c.y, size, size);
      }
      if (k < 1) requestAnimationFrame(frame);
      else if (layer.parentNode) layer.parentNode.removeChild(layer);
    }
    requestAnimationFrame(frame);
  }

  window.Pixel = { break: break_, capture: capture, scatter: scatter, reveal: reveal };
})();
