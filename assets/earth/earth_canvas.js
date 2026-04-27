/* TNT RENEWAL — /assets/earth/earth_canvas.js
   EARTH ASSET SPINE · CANVAS B2

   Owns Earth rendering only:
   - real surface texture
   - real cloud texture
   - spherical wrap
   - limb compression
   - atmosphere/terminator
   - Earth radius / zoom
   - auto-spin
   - manual drag
   - capped render budget
*/

(function () {
  "use strict";

  var DEFAULTS = {
    assetId: "earth-asset-b1",
    surface: "/assets/earth/earth_surface_2048.jpg",
    clouds: "/assets/earth/earth_clouds_2048.png",
    fallback: "/assets/earth/earth.svg",
    targetFrameMs: 42,
    sliceCount: 220,
    mobileDprCap: 1.5,
    desktopDprCap: 2,
    defaultRotation: 0.792,
    defaultVelocity: 0.008,
    defaultZoom: 1,
    minZoom: 0.72,
    maxZoom: 1.32,
    zoomStep: 0.08,
    cloudAlpha: 0.34
  };

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      var image = new Image();
      var done = false;
      var timer;

      function finish(result) {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        resolve(result);
      }

      timer = window.setTimeout(function () {
        finish({ ok: false, src: src, image: null, reason: "timeout" });
      }, 7000);

      image.onload = function () {
        finish({ ok: true, src: src, image: image, reason: "loaded" });
      };

      image.onerror = function () {
        finish({ ok: false, src: src, image: null, reason: "load-error" });
      };

      image.src = src;
    });
  }

  function createEarthRenderer(options) {
    var config = Object.assign({}, DEFAULTS, options || {});
    var mount = config.mount;
    var canvas = config.canvas;
    var ctx = null;
    var surfaceImage = null;
    var cloudImage = null;
    var surfaceReady = false;
    var cloudReady = false;
    var dragging = false;
    var paused = false;
    var lastX = 0;
    var lastTime = performance.now();
    var lastDrawTime = 0;
    var rotation = Number.isFinite(config.defaultRotation) ? config.defaultRotation : DEFAULTS.defaultRotation;
    var velocity = Number.isFinite(config.defaultVelocity) ? config.defaultVelocity : DEFAULTS.defaultVelocity;
    var zoom = clamp(Number(config.defaultZoom || DEFAULTS.defaultZoom), config.minZoom, config.maxZoom);
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!mount || !canvas) {
      return null;
    }

    function setStatus(value) {
      mount.setAttribute("data-earth-runtime-status", value);
      mount.setAttribute("data-earth-asset-id", config.assetId);
      mount.setAttribute("data-earth-zoom", zoom.toFixed(2));
      mount.setAttribute("data-earth-paused", paused ? "true" : "false");
    }

    function resizeCanvas() {
      var rect;
      var dpr;
      var cap;

      if (!canvas || !ctx) return;

      rect = canvas.getBoundingClientRect();
      cap = window.innerWidth <= 760 ? config.mobileDprCap : config.desktopDprCap;
      dpr = Math.min(cap, window.devicePixelRatio || 1);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
    }

    function wrappedSourceX(image, rawX) {
      var w = image.width || 1;
      var x = rawX % w;
      return x < 0 ? x + w : x;
    }

    function geometry() {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      var cx = width * 0.5;
      var cy = height * 0.5;
      var base = Math.min(width, height) * 0.498;

      return {
        width: width,
        height: height,
        cx: cx,
        cy: cy,
        r: base * zoom
      };
    }

    function drawWrappedLayer(image, rot, alpha, filterValue, sliceCount) {
      var geo;
      var step;
      var x;
      var nx;
      var limb;
      var lon;
      var sx;
      var sw;
      var dx;
      var dy;
      var dh;
      var dw;

      if (!image || !image.complete || !image.naturalWidth) return;

      geo = geometry();
      step = Math.max(2.2, (geo.r * 2) / sliceCount);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.filter = filterValue || "none";

      ctx.beginPath();
      ctx.arc(geo.cx, geo.cy, geo.r, 0, Math.PI * 2);
      ctx.clip();

      for (x = -geo.r; x <= geo.r; x += step) {
        nx = x / geo.r;
        limb = Math.sqrt(Math.max(0, 1 - nx * nx));
        lon = Math.asin(nx);

        sx = wrappedSourceX(image, (rot * image.width) + ((lon / (Math.PI * 2)) + 0.5) * image.width);
        sw = Math.max(1, image.width * (step / (Math.PI * geo.r)));

        dx = geo.cx + x;
        dy = geo.cy - geo.r * limb;
        dw = step + 1.2;
        dh = 2 * geo.r * limb;

        if (sx + sw <= image.width) {
          ctx.drawImage(image, sx, 0, sw, image.height, dx, dy, dw, dh);
        } else {
          var first = image.width - sx;
          var ratio = first / sw;

          ctx.drawImage(image, sx, 0, first, image.height, dx, dy, dw * ratio, dh);
          ctx.drawImage(image, 0, 0, sw - first, image.height, dx + dw * ratio, dy, dw * (1 - ratio), dh);
        }
      }

      ctx.restore();
    }

    function drawFallbackSphere() {
      var geo = geometry();
      var ocean = ctx.createRadialGradient(
        geo.cx - geo.r * 0.28,
        geo.cy - geo.r * 0.30,
        geo.r * 0.1,
        geo.cx,
        geo.cy,
        geo.r
      );

      ocean.addColorStop(0, "#315a99");
      ocean.addColorStop(0.44, "#0f2e6a");
      ocean.addColorStop(0.76, "#071742");
      ocean.addColorStop(1, "#010612");

      ctx.save();
      ctx.beginPath();
      ctx.arc(geo.cx, geo.cy, geo.r, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = ocean;
      ctx.fillRect(geo.cx - geo.r, geo.cy - geo.r, geo.r * 2, geo.r * 2);
      ctx.restore();
    }

    function drawSphere() {
      var geo;
      var shade;
      var rim;

      if (!ctx || !canvas) return;

      geo = geometry();

      ctx.clearRect(0, 0, geo.width, geo.height);
      drawFallbackSphere();

      if (surfaceReady) {
        drawWrappedLayer(surfaceImage, rotation, 1, "saturate(1.16) contrast(1.08) brightness(.98)", config.sliceCount);
      }

      if (cloudReady) {
        drawWrappedLayer(
          cloudImage,
          rotation * 0.82 + 0.11,
          config.cloudAlpha,
          "brightness(1.25) contrast(1.04)",
          Math.max(150, config.sliceCount - 30)
        );
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(geo.cx, geo.cy, geo.r, 0, Math.PI * 2);
      ctx.clip();

      shade = ctx.createRadialGradient(
        geo.cx - geo.r * 0.30,
        geo.cy - geo.r * 0.32,
        geo.r * 0.08,
        geo.cx + geo.r * 0.46,
        geo.cy + geo.r * 0.15,
        geo.r * 1.18
      );
      shade.addColorStop(0, "rgba(255,255,255,.15)");
      shade.addColorStop(0.38, "rgba(255,255,255,.02)");
      shade.addColorStop(0.68, "rgba(0,0,0,.06)");
      shade.addColorStop(1, "rgba(0,0,0,.76)");
      ctx.fillStyle = shade;
      ctx.fillRect(geo.cx - geo.r, geo.cy - geo.r, geo.r * 2, geo.r * 2);

      rim = ctx.createRadialGradient(geo.cx, geo.cy, geo.r * 0.76, geo.cx, geo.cy, geo.r * 1.03);
      rim.addColorStop(0, "rgba(147,197,253,0)");
      rim.addColorStop(0.82, "rgba(147,197,253,.05)");
      rim.addColorStop(0.93, "rgba(190,226,255,.20)");
      rim.addColorStop(1, "rgba(219,234,254,.42)");
      ctx.fillStyle = rim;
      ctx.fillRect(geo.cx - geo.r, geo.cy - geo.r, geo.r * 2, geo.r * 2);

      ctx.restore();

      ctx.beginPath();
      ctx.arc(geo.cx, geo.cy, geo.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(219,234,254,.32)";
      ctx.lineWidth = 2;
      ctx.stroke();

      setStatus(mount.getAttribute("data-earth-runtime-status") || "strong");
    }

    function drawNow() {
      drawSphere();
    }

    function setZoom(value) {
      zoom = clamp(Number(value), config.minZoom, config.maxZoom);
      setStatus(mount.getAttribute("data-earth-runtime-status") || "strong");
      drawNow();
      return zoom;
    }

    function zoomIn() {
      return setZoom(zoom + config.zoomStep);
    }

    function zoomOut() {
      return setZoom(zoom - config.zoomStep);
    }

    function resetView() {
      zoom = config.defaultZoom;
      rotation = config.defaultRotation;
      velocity = config.defaultVelocity;
      paused = false;
      setStatus("strong");
      drawNow();
      return getStatus();
    }

    function setPaused(value) {
      paused = value === true;
      setStatus(mount.getAttribute("data-earth-runtime-status") || "strong");
      drawNow();
      return paused;
    }

    function toggleSpin() {
      return setPaused(!paused);
    }

    function getStatus() {
      return {
        assetId: config.assetId,
        surfaceReady: surfaceReady,
        cloudReady: cloudReady,
        rotation: rotation,
        velocity: velocity,
        zoom: zoom,
        paused: paused,
        runtimeStatus: mount.getAttribute("data-earth-runtime-status")
      };
    }

    function animate(now) {
      var delta = Math.min(64, now - lastTime);
      lastTime = now;

      if (!reduceMotion && !dragging && !paused) {
        rotation = (rotation + velocity * delta * 0.001) % 1;
        velocity = velocity * 0.998 + config.defaultVelocity * 0.002;
      }

      if (now - lastDrawTime >= config.targetFrameMs || dragging) {
        lastDrawTime = now;
        drawSphere();
      }

      window.requestAnimationFrame(animate);
    }

    function bindDrag() {
      mount.addEventListener("pointerdown", function (event) {
        dragging = true;
        lastX = event.clientX;
        velocity = 0;
        mount.setPointerCapture(event.pointerId);
      });

      mount.addEventListener("pointermove", function (event) {
        var dx;

        if (!dragging) return;

        dx = event.clientX - lastX;
        lastX = event.clientX;

        velocity = dx * 0.0018;
        rotation = (rotation + dx * 0.0016) % 1;
        if (rotation < 0) rotation += 1;

        drawSphere();
      });

      mount.addEventListener("pointerup", function (event) {
        dragging = false;
        try {
          mount.releasePointerCapture(event.pointerId);
        } catch (error) {}
      });

      mount.addEventListener("pointercancel", function () {
        dragging = false;
      });
    }

    function init() {
      ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!ctx) {
        setStatus("canvas-unavailable");
        return;
      }

      resizeCanvas();
      bindDrag();
      setStatus("loading-assets");

      window.addEventListener("resize", function () {
        resizeCanvas();
        drawNow();
      }, { passive: true });

      Promise.all([
        loadImage(config.surface),
        loadImage(config.clouds)
      ]).then(function (results) {
        if (results[0].ok) {
          surfaceImage = results[0].image;
          surfaceReady = true;
        }

        if (results[1].ok) {
          cloudImage = results[1].image;
          cloudReady = true;
        }

        if (surfaceReady && cloudReady) {
          setStatus("strong");
        } else if (surfaceReady || cloudReady) {
          setStatus("partial-assets");
        } else {
          setStatus("asset-fallback-only");
        }

        drawNow();
        window.requestAnimationFrame(animate);
      });
    }

    init();

    return {
      assetId: config.assetId,
      mount: mount,
      canvas: canvas,
      draw: drawNow,
      setZoom: setZoom,
      zoomIn: zoomIn,
      zoomOut: zoomOut,
      resetView: resetView,
      setPaused: setPaused,
      toggleSpin: toggleSpin,
      getStatus: getStatus
    };
  }

  window.DGBEarthCanvas = {
    version: "earth-canvas-b2",
    create: createEarthRenderer
  };
})();
