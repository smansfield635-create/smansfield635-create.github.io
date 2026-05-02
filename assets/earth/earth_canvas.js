/* ASSET GENERATION 2 TERMS RENEWAL
   FILE: /assets/earth/earth_canvas.js
   VERSION: ASSET_GENERATION_2_TERMS_RENEWAL_TNT_v1

   ROLE:
   Earth asset canvas owns Demo Universe Earth visual rendering only.
   It uses local Earth surface and cloud assets.
   It does not own route runtime, global navigation, Gauges, or visual pass.
*/

(function attachEarthAssetCanvasGeneration2(global) {
  "use strict";

  var VERSION = "ASSET_GENERATION_2_TERMS_RENEWAL_TNT_v1";
  var ROLE = "DEMO_UNIVERSE_EARTH_ASSET_RENDERER";
  var SURFACE_URL = "/assets/earth/earth_surface_2048.jpg";
  var CLOUDS_URL = "/assets/earth/earth_clouds_2048.jpg";

  var state = {
    version: VERSION,
    loading: false,
    ready: false,
    surfaceImage: null,
    cloudsImage: null,
    surfaceData: null,
    cloudData: null,
    surfaceCanvas: null,
    cloudCanvas: null,
    lastCanvas: null,
    lastMount: null,
    lastOptions: null,
    lastRender: null,
    lastError: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function normalizeLon(lon) {
    var x = ((Number(lon) + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function radToDeg(value) {
    return value * 180 / Math.PI;
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("Image load failed: " + src)); };
      img.src = src;
    });
  }

  function prepareImageData(img) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return {
      canvas: canvas,
      context: ctx,
      imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      width: canvas.width,
      height: canvas.height
    };
  }

  function ensureAssets() {
    if (state.ready) return Promise.resolve(state);
    if (state.loading) return state.loading;

    state.loading = Promise.all([
      loadImage(SURFACE_URL),
      loadImage(CLOUDS_URL)
    ]).then(function (images) {
      var surface = prepareImageData(images[0]);
      var clouds = prepareImageData(images[1]);

      state.surfaceImage = images[0];
      state.cloudsImage = images[1];
      state.surfaceCanvas = surface.canvas;
      state.cloudCanvas = clouds.canvas;
      state.surfaceData = surface;
      state.cloudData = clouds;
      state.ready = true;
      state.loading = false;

      return state;
    }).catch(function (error) {
      state.lastError = String(error && error.message ? error.message : error);
      state.loading = false;
      throw error;
    });

    return state.loading;
  }

  function readPixel(dataObj, u, v) {
    var width = dataObj.width;
    var height = dataObj.height;
    var x = Math.floor((((u % 1) + 1) % 1) * (width - 1));
    var y = Math.floor(clamp(v, 0, 1) * (height - 1));
    var idx = (y * width + x) * 4;
    var d = dataObj.imageData.data;

    return [d[idx], d[idx + 1], d[idx + 2], d[idx + 3]];
  }

  function inverseOrthographic(x, y, viewLon, viewLat) {
    var rho = Math.sqrt(x * x + y * y);
    var c;
    var sinC;
    var cosC;
    var lat0;
    var lon0;
    var lat;
    var lon;

    if (rho > 1) return null;

    if (rho < 0.000001) {
      return { lon: normalizeLon(viewLon), lat: viewLat || 0, limb: 1 };
    }

    c = Math.asin(rho);
    sinC = Math.sin(c);
    cosC = Math.cos(c);
    lat0 = degToRad(viewLat || 0);
    lon0 = degToRad(viewLon || 0);

    lat = Math.asin(cosC * Math.sin(lat0) + (y * sinC * Math.cos(lat0)) / rho);
    lon = lon0 + Math.atan2(
      x * sinC,
      rho * Math.cos(lat0) * cosC - y * Math.sin(lat0) * sinC
    );

    return {
      lon: normalizeLon(radToDeg(lon)),
      lat: clamp(radToDeg(lat), -90, 90),
      limb: Math.sqrt(Math.max(0, 1 - rho * rho))
    };
  }

  function shadePixel(surface, cloud, limb, options) {
    options = options || {};

    var cloudAlpha = clamp((cloud[0] + cloud[1] + cloud[2]) / 765, 0, 1);
    var cloudStrength = clamp(options.cloudStrength == null ? 0.28 : options.cloudStrength, 0, 0.70);
    var brightness = clamp(options.brightness == null ? 1.13 : options.brightness, 0.60, 1.80);
    var contrast = clamp(options.contrast == null ? 1.10 : options.contrast, 0.70, 1.60);
    var limbShade = clamp(0.48 + limb * 0.62, 0.35, 1.10);
    var atmosphericLift = clamp(0.04 + (1 - limb) * 0.06, 0, 0.18);

    var r = surface[0];
    var g = surface[1];
    var b = surface[2];

    r = (r - 128) * contrast + 128;
    g = (g - 128) * contrast + 128;
    b = (b - 128) * contrast + 128;

    r = r * brightness * limbShade;
    g = g * brightness * limbShade;
    b = b * brightness * limbShade;

    r = r * (1 - cloudAlpha * cloudStrength) + 245 * cloudAlpha * cloudStrength;
    g = g * (1 - cloudAlpha * cloudStrength) + 250 * cloudAlpha * cloudStrength;
    b = b * (1 - cloudAlpha * cloudStrength) + 255 * cloudAlpha * cloudStrength;

    r = r + 105 * atmosphericLift;
    g = g + 150 * atmosphericLift;
    b = b + 230 * atmosphericLift;

    return [
      Math.round(clamp(r, 0, 255)),
      Math.round(clamp(g, 0, 255)),
      Math.round(clamp(b, 0, 255)),
      255
    ];
  }

  function drawFallback(canvas) {
    var ctx = canvas.getContext("2d");
    var size = Math.min(canvas.width, canvas.height);
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = size * 0.43;
    var gradient = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.36, radius * 0.08, cx, cy, radius);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gradient.addColorStop(0, "rgba(92,152,210,1)");
    gradient.addColorStop(0.45, "rgba(16,88,154,1)");
    gradient.addColorStop(0.78, "rgba(4,30,86,1)");
    gradient.addColorStop(1, "rgba(2,8,26,1)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(150,205,255,.24)";
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.stroke();

    state.lastRender = {
      ok: false,
      waitingForAssets: true,
      version: VERSION,
      visualPassClaimed: false
    };

    return state.lastRender;
  }

  function drawAtmosphere(ctx, cx, cy, radius, options) {
    var atmosphere = clamp(options.atmosphere == null ? 0.16 : options.atmosphere, 0, 0.45);
    var halo = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.08);

    halo.addColorStop(0, "rgba(120,185,255,0)");
    halo.addColorStop(0.84, "rgba(120,185,255," + (atmosphere * 0.20) + ")");
    halo.addColorStop(1, "rgba(120,185,255," + atmosphere + ")");

    ctx.save();
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function renderToCanvas(canvas, options) {
    options = options || {};

    if (!state.ready || !state.surfaceData || !state.cloudData) {
      return drawFallback(canvas);
    }

    var ctx = canvas.getContext("2d");
    var size = Math.min(canvas.width, canvas.height);
    var resolution = Math.max(320, Math.min(900, Math.round(size * clamp(options.resolutionScale || 0.88, 0.50, 1))));
    var off = document.createElement("canvas");
    var offCtx = off.getContext("2d", { willReadFrequently: true });
    var image;
    var data;
    var radius = resolution * 0.43;
    var cx = resolution / 2;
    var cy = resolution / 2;
    var viewLon = Number(options.viewLon == null ? -28 : options.viewLon);
    var viewLat = Number(options.viewLat || 0);
    var cloudDrift = Number(options.cloudDrift || 8);
    var x;
    var y;
    var dx;
    var dy;
    var idx;
    var geo;
    var u;
    var cloudU;
    var v;
    var surface;
    var cloud;
    var color;

    off.width = resolution;
    off.height = resolution;
    image = offCtx.createImageData(resolution, resolution);
    data = image.data;

    for (y = 0; y < resolution; y += 1) {
      for (x = 0; x < resolution; x += 1) {
        dx = (x - cx) / radius;
        dy = (cy - y) / radius;
        idx = (y * resolution + x) * 4;

        if (dx * dx + dy * dy > 1) {
          data[idx + 3] = 0;
          continue;
        }

        geo = inverseOrthographic(dx, dy, viewLon, viewLat);
        if (!geo) {
          data[idx + 3] = 0;
          continue;
        }

        u = (normalizeLon(geo.lon) + 180) / 360;
        cloudU = (normalizeLon(geo.lon + cloudDrift) + 180) / 360;
        v = (90 - geo.lat) / 180;

        surface = readPixel(state.surfaceData, u, v);
        cloud = readPixel(state.cloudData, cloudU, v);
        color = shadePixel(surface, cloud, geo.limb, options);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = color[3];
      }
    }

    offCtx.putImageData(image, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    drawAtmosphere(ctx, canvas.width / 2, canvas.height / 2, size * 0.43, options);

    state.lastCanvas = canvas;
    state.lastOptions = Object.assign({}, options);
    state.lastRender = {
      ok: true,
      version: VERSION,
      role: ROLE,
      source: SURFACE_URL,
      clouds: CLOUDS_URL,
      earthAssetBaseline: true,
      demoUniverseEarthBaseline: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return state.lastRender;
  }

  function resolveMount(target) {
    if (typeof target === "string") return document.querySelector(target);
    if (target) return target;

    return document.getElementById("planet-one-render") ||
      document.querySelector("[data-planet-one-mount='true']") ||
      document.querySelector("[data-earth-asset-mount='true']");
  }

  function ensureCanvas(mount, options) {
    var size;
    var canvas;

    options = options || {};
    mount = resolveMount(mount);
    if (!mount) return null;

    size = Math.max(320, Math.min(1400, Number(options.size || options.width || mount.clientWidth || 760)));

    canvas = mount.querySelector("canvas[data-earth-asset-canvas='true'], canvas[data-planet-one-render-canvas='true']");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("data-earth-asset-canvas", "true");
      canvas.setAttribute("data-planet-one-render-canvas", "true");
      canvas.setAttribute("data-earth-asset-version", VERSION);
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("aria-label", "Demo Universe Earth baseline globe");
      mount.innerHTML = "";
      mount.appendChild(canvas);
    }

    canvas.width = size;
    canvas.height = size;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = size + "px";
    canvas.style.height = "auto";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";

    state.lastMount = mount;
    state.lastCanvas = canvas;

    return canvas;
  }

  function mount(target, options) {
    var canvas = ensureCanvas(target, options);
    if (!canvas) {
      return {
        ok: false,
        reason: "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
    }

    var immediate = renderToCanvas(canvas, options || {});

    ensureAssets().then(function () {
      renderToCanvas(canvas, options || {});
    }).catch(function () {
      drawFallback(canvas);
    });

    return immediate;
  }

  function render(target, options) {
    if (target && target.getContext) return renderToCanvas(target, options || {});
    return mount(target, options || {});
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      role: ROLE,
      earthAssetBaseline: true,
      demoUniverseEarthBaseline: true,
      surfaceUrl: SURFACE_URL,
      cloudsUrl: CLOUDS_URL,
      ready: state.ready,
      loading: Boolean(state.loading),
      generatedImage: false,
      graphicBox: false,
      ownsRouteRuntime: false,
      ownsGauges: false,
      visualPassClaimed: false,
      lastRender: state.lastRender,
      lastError: state.lastError
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    ROLE: ROLE,
    surfaceUrl: SURFACE_URL,
    cloudsUrl: CLOUDS_URL,
    ensureAssets: ensureAssets,
    renderToCanvas: renderToCanvas,
    render: render,
    mount: mount,
    getStatus: getStatus,
    status: getStatus,
    visualPassClaimed: false
  };

  global.DGBEarthAssetCanvas = api;
  global.DGBDemoUniverseEarthCanvas = api;

  ensureAssets().catch(function () {});

  try {
    global.dispatchEvent(new CustomEvent("dgb:earth-asset:generation-2-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
