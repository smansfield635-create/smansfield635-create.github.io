/* TNT RENEWAL — /assets/earth/earth_canvas.js
   EARTH ASSET SPINE · CANVAS B18 · DIMENSIONAL GLOBE RENDERER

   CONTRACT:
     - Render Earth as a dimensional globe first.
     - Map the local satellite Earth JPG onto the sphere second.
     - Use inverse orthographic sphere sampling instead of vertical slice wrapping.
     - Remove lower-left pinch / fold distortion.
     - Remove detached crescent artifacts.
     - Remove outer circular stroke / atmosphere ring.
     - Preserve local B5 JPG paths.
     - Preserve runtime API.
     - Preserve zoom, drag, spin, reset, pause.
     - Preserve targetFrameMs frame-budget marker.
*/

(function () {
  "use strict";

  var TAU = Math.PI * 2;

  var DEFAULTS = {
    assetId: "earth-asset-b5-dimensional-globe",
    surface: "/assets/earth/earth_surface_2048.jpg",
    clouds: "/assets/earth/earth_clouds_2048.jpg",
    fallback: "/assets/earth/earth.svg",

    targetFrameMs: 42,

    textureWidth: 1024,
    textureHeight: 512,

    mobileDprCap: 1.35,
    desktopDprCap: 1.75,
    mobileRenderCap: 620,
    desktopRenderCap: 860,

    defaultRotation: 0.35,
    defaultVelocity: 0.006,

    defaultZoom: 1,
    minZoom: 0.72,
    maxZoom: 1.38,
    zoomStep: 0.08,

    cloudAlpha: 0
  };

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  function wrap01(value) {
    value = value % 1;
    return value < 0 ? value + 1 : value;
  }

  function normalize3(x, y, z) {
    var length = Math.sqrt(x * x + y * y + z * z) || 1;
    return {
      x: x / length,
      y: y / length,
      z: z / length
    };
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
        finish({
          ok: false,
          src: src,
          image: null,
          reason: "timeout"
        });
      }, 7000);

      image.onload = function () {
        finish({
          ok: true,
          src: src,
          image: image,
          reason: "loaded"
        });
      };

      image.onerror = function () {
        finish({
          ok: false,
          src: src,
          image: null,
          reason: "load-error"
        });
      };

      image.src = src + (src.indexOf("?") === -1 ? "?v=" : "&v=") + "earth-canvas-b18-" + Date.now();
    });
  }

  function makeTexture(image, width, height) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", {
      willReadFrequently: true
    });

    canvas.width = width;
    canvas.height = height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);

    return {
      width: width,
      height: height,
      data: ctx.getImageData(0, 0, width, height).data
    };
  }

  function sampleTexture(texture, u, v) {
    var x;
    var y;
    var x0;
    var y0;
    var x1;
    var y1;
    var tx;
    var ty;
    var i00;
    var i10;
    var i01;
    var i11;
    var d = texture.data;
    var w = texture.width;
    var h = texture.height;
    var r;
    var g;
    var b;

    u = wrap01(u);
    v = clamp(v, 0, 1);

    x = u * (w - 1);
    y = v * (h - 1);

    x0 = Math.floor(x);
    y0 = Math.floor(y);
    x1 = (x0 + 1) % w;
    y1 = Math.min(h - 1, y0 + 1);

    tx = x - x0;
    ty = y - y0;

    i00 = (y0 * w + x0) * 4;
    i10 = (y0 * w + x1) * 4;
    i01 = (y1 * w + x0) * 4;
    i11 = (y1 * w + x1) * 4;

    r =
      d[i00] * (1 - tx) * (1 - ty) +
      d[i10] * tx * (1 - ty) +
      d[i01] * (1 - tx) * ty +
      d[i11] * tx * ty;

    g =
      d[i00 + 1] * (1 - tx) * (1 - ty) +
      d[i10 + 1] * tx * (1 - ty) +
      d[i01 + 1] * (1 - tx) * ty +
      d[i11 + 1] * tx * ty;

    b =
      d[i00 + 2] * (1 - tx) * (1 - ty) +
      d[i10 + 2] * tx * (1 - ty) +
      d[i01 + 2] * (1 - tx) * ty +
      d[i11 + 2] * tx * ty;

    return {
      r: r,
      g: g,
      b: b
    };
  }

  function createEarthRenderer(options) {
    var config = Object.assign({}, DEFAULTS, options || {});
    var mount = config.mount;
    var canvas = config.canvas;
    var ctx = null;

    var surfaceTexture = null;
    var cloudTexture = null;
    var surfaceReady = false;
    var cloudReady = false;

    var imageData = null;
    var lastCanvasWidth = 0;
    var lastCanvasHeight = 0;

    var dragging = false;
    var paused = false;
    var lastX = 0;
    var lastTime = performance.now();
    var lastDrawTime = 0;

    var rotation = Number.isFinite(config.defaultRotation) ? config.defaultRotation : DEFAULTS.defaultRotation;
    var velocity = Number.isFinite(config.defaultVelocity) ? config.defaultVelocity : DEFAULTS.defaultVelocity;
    var zoom = clamp(Number(config.defaultZoom || DEFAULTS.defaultZoom), config.minZoom, config.maxZoom);

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!mount || !canvas) return null;

    function setStatus(value) {
      mount.setAttribute("data-earth-runtime-status", value);
      mount.setAttribute("data-earth-asset-id", config.assetId);
      mount.setAttribute("data-earth-zoom", zoom.toFixed(2));
      mount.setAttribute("data-earth-paused", paused ? "true" : "false");
      mount.setAttribute("data-earth-target-frame-ms", String(config.targetFrameMs));
      mount.setAttribute("data-earth-renderer-version", "earth-canvas-b18-dimensional-globe");
      mount.setAttribute("data-earth-projection", "inverse-orthographic-sphere");
      mount.setAttribute("data-earth-lattice-scope", "256");
      mount.setAttribute("data-earth-cloud-overlay", config.cloudAlpha > 0 ? "subtle" : "surface-composite");
    }

    function resizeCanvas() {
      var rect;
      var dpr;
      var cap;
      var renderCap;
      var desiredWidth;
      var desiredHeight;
      var maxSide;
      var ratio;

      if (!canvas || !ctx) return;

      rect = canvas.getBoundingClientRect();
      cap = window.innerWidth <= 760 ? config.mobileDprCap : config.desktopDprCap;
      renderCap = window.innerWidth <= 760 ? config.mobileRenderCap : config.desktopRenderCap;
      dpr = Math.min(cap, window.devicePixelRatio || 1);

      desiredWidth = Math.max(1, Math.floor(rect.width * dpr));
      desiredHeight = Math.max(1, Math.floor(rect.height * dpr));

      maxSide = Math.max(desiredWidth, desiredHeight);
      ratio = maxSide > renderCap ? renderCap / maxSide : 1;

      canvas.width = Math.max(1, Math.floor(desiredWidth * ratio));
      canvas.height = Math.max(1, Math.floor(desiredHeight * ratio));

      if (canvas.width !== lastCanvasWidth || canvas.height !== lastCanvasHeight) {
        imageData = ctx.createImageData(canvas.width, canvas.height);
        lastCanvasWidth = canvas.width;
        lastCanvasHeight = canvas.height;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }

    function geometry() {
      var width = canvas.width;
      var height = canvas.height;
      var cx = width * 0.5;
      var cy = height * 0.5;
      var r = Math.min(width, height) * 0.492 * zoom;

      return {
        width: width,
        height: height,
        cx: cx,
        cy: cy,
        r: r
      };
    }

    function clearImageData(data) {
      data.fill(0);
    }

    function renderFallback(data, geo) {
      var minX = Math.max(0, Math.floor(geo.cx - geo.r - 2));
      var maxX = Math.min(geo.width - 1, Math.ceil(geo.cx + geo.r + 2));
      var minY = Math.max(0, Math.floor(geo.cy - geo.r - 2));
      var maxY = Math.min(geo.height - 1, Math.ceil(geo.cy + geo.r + 2));
      var x;
      var y;
      var nx;
      var ny;
      var d2;
      var z;
      var i;
      var shade;

      for (y = minY; y <= maxY; y += 1) {
        ny = (geo.cy - y) / geo.r;

        for (x = minX; x <= maxX; x += 1) {
          nx = (x - geo.cx) / geo.r;
          d2 = nx * nx + ny * ny;

          if (d2 > 1) continue;

          z = Math.sqrt(Math.max(0, 1 - d2));
          shade = 0.45 + 0.45 * z;

          i = (y * geo.width + x) * 4;
          data[i] = 15 * shade;
          data[i + 1] = 48 * shade;
          data[i + 2] = 112 * shade;
          data[i + 3] = 255;
        }
      }
    }

    function renderGlobe() {
      var geo;
      var data;
      var minX;
      var maxX;
      var minY;
      var maxY;
      var light;
      var x;
      var y;
      var nx;
      var ny;
      var d2;
      var nz;
      var lon;
      var lat;
      var u;
      var v;
      var sample;
      var cloud;
      var i;
      var diffuse;
      var limb;
      var shade;
      var edgeFeather;
      var alpha;
      var r;
      var g;
      var b;

      if (!ctx || !canvas || !imageData) return;

      geo = geometry();
      data = imageData.data;
      clearImageData(data);

      if (!surfaceReady || !surfaceTexture) {
        renderFallback(data, geo);
        ctx.putImageData(imageData, 0, 0);
        return;
      }

      light = normalize3(-0.38, 0.32, 0.86);

      minX = Math.max(0, Math.floor(geo.cx - geo.r - 2));
      maxX = Math.min(geo.width - 1, Math.ceil(geo.cx + geo.r + 2));
      minY = Math.max(0, Math.floor(geo.cy - geo.r - 2));
      maxY = Math.min(geo.height - 1, Math.ceil(geo.cy + geo.r + 2));

      for (y = minY; y <= maxY; y += 1) {
        ny = (geo.cy - y) / geo.r;

        for (x = minX; x <= maxX; x += 1) {
          nx = (x - geo.cx) / geo.r;
          d2 = nx * nx + ny * ny;

          if (d2 > 1.0008) continue;

          if (d2 > 1) {
            edgeFeather = Math.max(0, 1 - (d2 - 1) / 0.0008);
            d2 = 1;
          } else {
            edgeFeather = 1;
          }

          nz = Math.sqrt(Math.max(0, 1 - d2));

          lon = Math.atan2(nx, nz) + rotation * TAU;
          lat = Math.asin(clamp(ny, -1, 1));

          u = wrap01(0.5 + lon / TAU);
          v = clamp(0.5 - lat / Math.PI, 0, 1);

          sample = sampleTexture(surfaceTexture, u, v);

          r = sample.r;
          g = sample.g;
          b = sample.b;

          if (cloudReady && cloudTexture && config.cloudAlpha > 0) {
            cloud = sampleTexture(cloudTexture, u, v);
            r = r * (1 - config.cloudAlpha) + cloud.r * config.cloudAlpha;
            g = g * (1 - config.cloudAlpha) + cloud.g * config.cloudAlpha;
            b = b * (1 - config.cloudAlpha) + cloud.b * config.cloudAlpha;
          }

          diffuse = clamp(nx * light.x + ny * light.y + nz * light.z, 0, 1);
          limb = clamp(nz, 0, 1);

          shade = 0.40 + diffuse * 0.58;
          shade *= 0.72 + limb * 0.28;

          r = clamp(r * shade + 4, 0, 255);
          g = clamp(g * shade + 4, 0, 255);
          b = clamp(b * shade + 6, 0, 255);

          alpha = Math.round(255 * edgeFeather);

          i = (y * geo.width + x) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = alpha;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setStatus(mount.getAttribute("data-earth-runtime-status") || "strong");
    }

    function drawNow() {
      renderGlobe();
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
        cloudOverlayAlpha: config.cloudAlpha,
        projection: "inverse-orthographic-sphere",
        latticeScope: 256,
        rotation: rotation,
        velocity: velocity,
        zoom: zoom,
        paused: paused,
        targetFrameMs: config.targetFrameMs,
        runtimeStatus: mount.getAttribute("data-earth-runtime-status")
      };
    }

    function animate(now) {
      var delta = Math.min(64, now - lastTime);
      lastTime = now;

      if (!reduceMotion && !dragging && !paused) {
        rotation = wrap01(rotation + velocity * delta * 0.001);
        velocity = velocity * 0.998 + config.defaultVelocity * 0.002;
      }

      if (now - lastDrawTime >= config.targetFrameMs || dragging) {
        lastDrawTime = now;
        renderGlobe();
      }

      window.requestAnimationFrame(animate);
    }

    function bindDrag() {
      mount.addEventListener("pointerdown", function (event) {
        dragging = true;
        lastX = event.clientX;
        velocity = 0;

        try {
          mount.setPointerCapture(event.pointerId);
        } catch (error) {}
      });

      mount.addEventListener("pointermove", function (event) {
        var dx;

        if (!dragging) return;

        dx = event.clientX - lastX;
        lastX = event.clientX;

        velocity = dx * 0.0018;
        rotation = wrap01(rotation + dx * 0.0016);

        renderGlobe();
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
      ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true,
        willReadFrequently: false
      });

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
          surfaceTexture = makeTexture(results[0].image, config.textureWidth, config.textureHeight);
          surfaceReady = true;
        }

        if (results[1].ok) {
          cloudTexture = makeTexture(results[1].image, config.textureWidth, config.textureHeight);
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
    version: "earth-canvas-b18-dimensional-globe",
    create: createEarthRenderer
  };
})();
