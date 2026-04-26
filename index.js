/* TNT RENEWAL — /index.js
   ROOT INDEX · GENERATION 2 COMPASS · SATELLITE SUN RENDER B1
   ROOT_BOOT_ID=root-sun-asset-b1
   COCKPIT_VERSION=root-compass-cockpit-b1

   PURPOSE:
     - Preserve current passing Compass page.
     - Do not create a graphic box.
     - Do not rewrite page structure.
     - Paint a satellite-style sun inside the existing [data-dgb-sun-mount].
     - Keep the sun as background/field visual.
     - Keep filter behavior simple.
     - Preserve DGBIndexBoot and DGBCompassCockpit.
     - No endless animation loop.
*/

(function () {
  "use strict";

  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var COCKPIT_VERSION = "root-compass-cockpit-b1";
  var INDEX_VERSION = "root-sun-asset-b1-satellite-sun-render-b1";

  var FILTER_COPY = {
    flat: {
      title: "Flat view: what is right in front of me?",
      text: "Start with the surface. What is visible, immediate, and practical? This is the fastest way to stop spinning and take the next step.",
      one: "Simple view active",
      two: "Surface first",
      three: "Protected view active",
      view: "cinematic"
    },
    round: {
      title: "Round view: how are the pieces connected?",
      text: "Now look for relationship. What keeps circling back? What affects what? This view helps you see the pattern instead of chasing one loose piece.",
      one: "Pattern view active",
      two: "Connections visible",
      three: "Protected view active",
      view: "paths"
    },
    globe: {
      title: "Globe view: what is the whole system doing?",
      text: "Now zoom all the way out. What is the full field? What direction is the system moving? This view is for decisions that need the whole picture.",
      one: "Whole-field view active",
      two: "Big picture visible",
      three: "Protected view active",
      view: "galaxy"
    }
  };

  var state = {
    booted: false,
    filter: "flat",
    renderCount: 0,
    lastRenderAt: 0,
    resizeTimer: null
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function rootNode() {
    return document.getElementById("door-root") || $("[data-root-door]");
  }

  function sunMount() {
    return $("[data-dgb-sun-mount]");
  }

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function hashNoise(x, y, seed) {
    var n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function softNoise(x, y, seed) {
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var xf = x - x0;
    var yf = y - y0;

    var a = hashNoise(x0, y0, seed);
    var b = hashNoise(x0 + 1, y0, seed);
    var c = hashNoise(x0, y0 + 1, seed);
    var d = hashNoise(x0 + 1, y0 + 1, seed);

    var u = xf * xf * (3 - 2 * xf);
    var v = yf * yf * (3 - 2 * yf);

    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
  }

  function fractalNoise(x, y, seed) {
    var value = 0;
    var amp = 0.54;
    var freq = 1;
    var norm = 0;

    for (var i = 0; i < 5; i += 1) {
      value += softNoise(x * freq, y * freq, seed + i * 17) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.05;
    }

    return norm > 0 ? value / norm : 0;
  }

  function ensureCanvas(mount) {
    var canvas = mount.querySelector("canvas[data-satellite-sun-canvas]");

    if (canvas) return canvas;

    canvas = document.createElement("canvas");
    canvas.setAttribute("data-satellite-sun-canvas", "true");
    canvas.setAttribute("aria-hidden", "true");

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.borderRadius = "999px";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "2";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "visible";
    mount.appendChild(canvas);

    return canvas;
  }

  function paintSatelliteSun() {
    var mount = sunMount();
    if (!mount) return false;

    var rect = mount.getBoundingClientRect();
    var cssSize = Math.max(180, Math.min(900, Math.floor(Math.min(rect.width || 420, rect.height || 420))));
    var dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    var px = Math.floor(cssSize * dpr);

    var canvas = ensureCanvas(mount);
    var ctx = canvas.getContext("2d", { alpha: true });

    if (!ctx) return false;

    if (canvas.width !== px) canvas.width = px;
    if (canvas.height !== px) canvas.height = px;

    ctx.clearRect(0, 0, px, px);

    var cx = px * 0.5;
    var cy = px * 0.5;
    var r = px * 0.47;
    var image = ctx.createImageData(px, px);
    var data = image.data;

    for (var y = 0; y < px; y += 1) {
      for (var x = 0; x < px; x += 1) {
        var dx = (x - cx) / r;
        var dy = (y - cy) / r;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var index = (y * px + x) * 4;

        if (dist > 1) {
          data[index + 0] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 0;
          continue;
        }

        var limb = Math.pow(1 - dist, 0.38);
        var edge = Math.pow(1 - dist, 1.7);
        var angle = Math.atan2(dy, dx);

        var cellA = fractalNoise(dx * 9.0 + 12, dy * 9.0 - 3, 11);
        var cellB = fractalNoise(dx * 26.0 - 8, dy * 26.0 + 6, 23);
        var cellC = fractalNoise(dx * 58.0 + Math.cos(angle) * 2, dy * 58.0 + Math.sin(angle) * 2, 37);

        var granulation = (cellA * 0.48 + cellB * 0.34 + cellC * 0.18);
        var texture = (granulation - 0.5) * 0.34;

        var activeOne = Math.exp(-((dx + 0.34) * (dx + 0.34) / 0.012 + (dy - 0.18) * (dy - 0.18) / 0.007));
        var activeTwo = Math.exp(-((dx - 0.26) * (dx - 0.26) / 0.010 + (dy + 0.12) * (dy + 0.12) / 0.006));
        var activeThree = Math.exp(-((dx - 0.05) * (dx - 0.05) / 0.024 + (dy - 0.34) * (dy - 0.34) / 0.012));

        var sunspotOne = Math.exp(-((dx - 0.28) * (dx - 0.28) / 0.0034 + (dy + 0.05) * (dy + 0.05) / 0.0028));
        var sunspotTwo = Math.exp(-((dx + 0.18) * (dx + 0.18) / 0.0030 + (dy - 0.22) * (dy - 0.22) / 0.0025));

        var activity = activeOne * 0.18 + activeTwo * 0.14 + activeThree * 0.10;
        var spots = sunspotOne * 0.42 + sunspotTwo * 0.32;

        var radialWarm = 0.58 + edge * 0.34 + limb * 0.20;
        var brightness = clamp(radialWarm + texture + activity - spots, 0, 1.25);

        var limbDarkening = clamp(0.40 + Math.pow(1 - dist * 0.88, 0.48) * 0.72, 0, 1.1);
        brightness *= limbDarkening;

        var red = clamp(145 + brightness * 120 + activity * 60 - spots * 82, 0, 255);
        var green = clamp(64 + brightness * 150 + activity * 42 - spots * 58, 0, 255);
        var blue = clamp(18 + brightness * 42 + activity * 20 - spots * 24, 0, 255);

        if (dist > 0.82) {
          red *= 0.82;
          green *= 0.72;
          blue *= 0.62;
        }

        data[index + 0] = red;
        data[index + 1] = green;
        data[index + 2] = blue;
        data[index + 3] = Math.floor(255 * clamp((1 - dist) * 14, 0, 1));
      }
    }

    ctx.putImageData(image, 0, 0);

    var corona = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.34);
    corona.addColorStop(0, "rgba(255,190,74,0.22)");
    corona.addColorStop(0.36, "rgba(255,137,42,0.12)");
    corona.addColorStop(0.72, "rgba(255,217,138,0.045)");
    corona.addColorStop(1, "rgba(255,217,138,0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    var hotCore = ctx.createRadialGradient(cx - r * 0.18, cy - r * 0.15, 0, cx - r * 0.18, cy - r * 0.15, r * 0.62);
    hotCore.addColorStop(0, "rgba(255,252,207,0.34)");
    hotCore.addColorStop(0.22, "rgba(255,233,132,0.18)");
    hotCore.addColorStop(1, "rgba(255,233,132,0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = hotCore;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    var fallback = mount.querySelector("[data-sun-fallback]");
    if (fallback) {
      fallback.style.opacity = "0";
      fallback.style.visibility = "hidden";
    }

    mount.setAttribute("data-sun-mode", "satellite-canvas");
    mount.setAttribute("data-sun-visual-profile", "satellite-observational-b1");
    mount.setAttribute("data-sun-rendered-by", INDEX_VERSION);

    state.renderCount += 1;
    state.lastRenderAt = Date.now();

    return true;
  }

  function applyFilter(name) {
    var next = FILTER_COPY[name] ? name : "flat";
    var packet = FILTER_COPY[next];
    var root = rootNode();

    state.filter = next;

    document.body.setAttribute("data-world-filter", next);
    document.body.setAttribute("data-cockpit-view", packet.view);

    if (root) {
      root.setAttribute("data-world-filter", next);
      root.setAttribute("data-cockpit-view", packet.view);
    }

    all("[data-world-filter-button]").forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        button.getAttribute("data-world-filter-button") === next ? "true" : "false"
      );
    });

    all("[data-filter]").forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        button.getAttribute("data-filter") === next ? "true" : "false"
      );
    });

    setText("resultTitle", packet.title);
    setText("resultText", packet.text);
    setText("stateOne", packet.one);
    setText("stateTwo", packet.two);
    setText("stateThree", packet.three);

    try {
      window.dispatchEvent(new CustomEvent("dgb:cockpit:viewchange", {
        detail: getPublicState()
      }));
    } catch (error) {
      /* no-op */
    }
  }

  function bindFilters() {
    all("[data-world-filter-button]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.getAttribute("data-world-filter-button"));
      });
    });

    all("[data-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.getAttribute("data-filter"));
      });
    });
  }

  function markRoot() {
    var root = rootNode();

    if (!root) return;

    root.setAttribute("data-root-boot-id", ROOT_BOOT_ID);
    root.setAttribute("data-root-contract", "universe-sun");
    root.setAttribute("data-compass-cockpit", COCKPIT_VERSION);
    root.setAttribute("data-index-runtime", INDEX_VERSION);
    root.setAttribute("data-sun-render-authority", "index-js-satellite-canvas");
  }

  function getPublicState() {
    return {
      version: INDEX_VERSION,
      rootBootId: ROOT_BOOT_ID,
      cockpitVersion: COCKPIT_VERSION,
      booted: state.booted,
      filter: state.filter,
      renderCount: state.renderCount,
      lastRenderAt: state.lastRenderAt,
      sunMountPresent: Boolean(sunMount()),
      satelliteSunActive: Boolean(sunMount() && sunMount().querySelector("canvas[data-satellite-sun-canvas]"))
    };
  }

  function expose() {
    window.DGBIndexBoot = {
      version: INDEX_VERSION,
      rootBootId: ROOT_BOOT_ID,
      cockpitVersion: COCKPIT_VERSION,
      getPublicState: getPublicState,
      repaintSun: paintSatelliteSun,
      setFilter: applyFilter
    };

    window.DGBCompassCockpit = {
      version: COCKPIT_VERSION,
      indexVersion: INDEX_VERSION,
      getPublicState: getPublicState,
      repaintSun: paintSatelliteSun,
      setFilter: applyFilter
    };
  }

  function scheduleResizePaint() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(function () {
      paintSatelliteSun();
    }, 160);
  }

  function boot() {
    state.booted = true;

    expose();
    markRoot();
    bindFilters();
    applyFilter(document.body.getAttribute("data-world-filter") || "flat");

    window.setTimeout(paintSatelliteSun, 0);
    window.setTimeout(paintSatelliteSun, 120);
    window.setTimeout(paintSatelliteSun, 450);

    window.addEventListener("resize", scheduleResizePaint, { passive: true });
    window.addEventListener("orientationchange", scheduleResizePaint, { passive: true });

    try {
      window.dispatchEvent(new CustomEvent("dgb:index:boot", {
        detail: getPublicState()
      }));
    } catch (error) {
      /* no-op */
    }
  }

  expose();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
