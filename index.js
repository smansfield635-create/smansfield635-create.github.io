/* TNT RENEWAL — /index.js
   ROOT INDEX JS · COMPASS COCKPIT VENUE-BRIDGE RENEWAL B3

   ROOT_BOOT_ID = "root-sun-asset-b1"
   COCKPIT_CONTRACT = "root-compass-cockpit-b1"
   SOURCE_MARKER=ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1
   RENEWAL_MARKER=ROOT_COMPASS_COCKPIT_VENUE_BRIDGE_RENEWAL_B3

   PURPOSE:
     - Renew /index.js only.
     - Preserve cockpit button binding.
     - Preserve visible sun fallback.
     - Preserve DGBIndexBoot.
     - Preserve DGBCompassCockpit.
     - Add optional venue bridge to /world/control.js.
     - Use /world/control.js as venue geometry authority when available.
     - Do not require /world/control.js for basic cockpit function.
     - Do not move the galaxy/environment.
     - Cockpit repositions view posture relative to the fixed field.

   REQUIRED GAUGE MARKERS:
     DGBSpineCanopy
     DGBCompassCockpit
     DGBIndexBoot
     ensureFallbackSun
     held-by-canopy
     root-compass-cockpit-b1
     ROOT_COMPASS_COCKPIT_VENUE_BRIDGE_RENEWAL_B3
*/

(function () {
  "use strict";

  var VERSION = "root-compass-cockpit-b1";
  var RENEWAL = "ROOT_COMPASS_COCKPIT_VENUE_BRIDGE_RENEWAL_B3";
  var SOURCE_MARKER = "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var WORLD_CONTROL_PATH = "/world/control.js";
  var STATE_EVENT = "dgb:cockpit:viewchange";
  var VENUE_EVENT = "dgb:cockpit:venuebridge";

  var VIEW_ORDER = [
    "cinematic",
    "wide",
    "local",
    "axis",
    "paths",
    "galaxy",
    "nebula",
    "control"
  ];

  var DEFAULT_TOGGLES = Object.freeze({
    planets: true,
    paths: false,
    axes: false,
    nebula: true,
    milkyWay: true,
    solarWind: true
  });

  var VIEW_COPY = Object.freeze({
    cinematic: {
      label: "Cinematic",
      status: "Compass Cockpit B1 · cinematic posture · fixed galaxy truth",
      narrative: "Cockpit settled into cinematic posture. The ship is reading the existing galaxy without moving the field.",
      posture: {
        scale: 1,
        tilt: "0deg",
        panX: "0px",
        panY: "0px",
        hud: 0.72,
        axis: 0.08,
        paths: 0.12
      }
    },
    wide: {
      label: "Wide",
      status: "Compass Cockpit B1 · wide survey · venue frame expanded",
      narrative: "Cockpit widened its observation cone. The venue frame expands while the galaxy remains fixed.",
      posture: {
        scale: 0.92,
        tilt: "-0.7deg",
        panX: "0px",
        panY: "4px",
        hud: 0.62,
        axis: 0.08,
        paths: 0.13
      }
    },
    local: {
      label: "Local",
      status: "Compass Cockpit B1 · local solar proximity · sun spine protected",
      narrative: "Cockpit moved into local solar read. The venue frame keeps the sun protected while nearby pressure becomes easier to inspect.",
      posture: {
        scale: 1.035,
        tilt: "0.45deg",
        panX: "0px",
        panY: "0px",
        hud: 0.78,
        axis: 0.07,
        paths: 0.10
      }
    },
    axis: {
      label: "Axis",
      status: "Compass Cockpit B1 · Euclidean axis view · venue coordinates exposed",
      narrative: "Cockpit raised the Euclidean venue grid. This view reads coordinate position without pretending the environment moved.",
      posture: {
        scale: 0.98,
        tilt: "0deg",
        panX: "0px",
        panY: "0px",
        hud: 0.88,
        axis: 0.33,
        paths: 0.10
      }
    },
    paths: {
      label: "Paths",
      status: "Compass Cockpit B1 · route lanes visible · venue path read",
      narrative: "Cockpit opened path instrumentation. Travel lanes are visible as a navigation read over the same venue field.",
      posture: {
        scale: 0.96,
        tilt: "-1.2deg",
        panX: "0px",
        panY: "0px",
        hud: 0.86,
        axis: 0.16,
        paths: 0.38
      }
    },
    galaxy: {
      label: "Galaxy",
      status: "Compass Cockpit B1 · galaxy emphasis · external field fixed",
      narrative: "Cockpit pulled toward galactic emphasis. The Milky Way layer becomes legible while the ship changes posture around it.",
      posture: {
        scale: 0.90,
        tilt: "0.8deg",
        panX: "0px",
        panY: "6px",
        hud: 0.58,
        axis: 0.07,
        paths: 0.08
      }
    },
    nebula: {
      label: "Nebula",
      status: "Compass Cockpit B1 · nebula emphasis · environmental density read",
      narrative: "Cockpit tuned for nebula density. The view reads atmospheric color and depth without relocating the galaxy.",
      posture: {
        scale: 0.96,
        tilt: "-0.5deg",
        panX: "0px",
        panY: "0px",
        hud: 0.62,
        axis: 0.05,
        paths: 0.09
      }
    },
    control: {
      label: "Control",
      status: "Compass Cockpit B1 · instrument control · venue authority exposed",
      narrative: "Cockpit exposed control instrumentation. This is the technical view for verifying posture, toggles, venue geometry, and field protection.",
      posture: {
        scale: 0.99,
        tilt: "0deg",
        panX: "0px",
        panY: "0px",
        hud: 0.98,
        axis: 0.24,
        paths: 0.26
      }
    }
  });

  var REQUIRED_MARKERS = [
    'ROOT_BOOT_ID = "root-sun-asset-b1"',
    "DGBSpineCanopy",
    "DGBCompassCockpit",
    "DGBIndexBoot",
    "ensureFallbackSun",
    "held-by-canopy",
    "root-compass-cockpit-b1",
    "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1",
    "ROOT_COMPASS_COCKPIT_VENUE_BRIDGE_RENEWAL_B3",
    "/world/control.js"
  ];

  var state = {
    view: "cinematic",
    toggles: {
      planets: true,
      paths: false,
      axes: false,
      nebula: true,
      milkyWay: true,
      solarWind: true
    },
    rootPresent: false,
    sunVisible: false,
    fallbackVisible: false,
    canvasVisible: false,
    svgVisible: false,
    canopyPresent: false,
    heldByCanopy: false,
    lastAction: "boot",
    venue: {
      status: "pending",
      path: WORLD_CONTROL_PATH,
      available: false,
      imported: false,
      error: "",
      world: null,
      camera: null,
      solarPolicy: null,
      labelPolicy: null,
      controlPlan: null,
      lastViewport: null
    }
  };

  var worldControlModule = null;
  var venueImportStarted = false;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function rootNode() {
    return document.getElementById("door-root") || $("[data-root-door]") || $(".page") || document.body;
  }

  function setText(selector, value) {
    var node = $(selector);
    if (node) node.textContent = String(value);
  }

  function setCssVar(node, name, value) {
    if (node && node.style) node.style.setProperty(name, String(value));
  }

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function normalizeView(view) {
    var next = String(view || "").trim();
    return hasOwn(VIEW_COPY, next) ? next : "cinematic";
  }

  function normalizeToggleName(name) {
    var next = String(name || "").trim();

    if (hasOwn(DEFAULT_TOGGLES, next)) return next;
    if (next === "milkyway" || next === "milky_way" || next === "milky-way") return "milkyWay";
    if (next === "solarwind" || next === "solar_wind" || next === "solar-wind") return "solarWind";

    return null;
  }

  function readBooleanAttribute(node, name, fallback) {
    var value;

    if (!node) return Boolean(fallback);

    value = node.getAttribute(name);
    if (value === "true") return true;
    if (value === "false") return false;

    return Boolean(fallback);
  }

  function visibleNode(node) {
    var rect;
    var style;

    if (!node || !node.ownerDocument || !node.ownerDocument.defaultView) return false;

    rect = node.getBoundingClientRect();
    style = node.ownerDocument.defaultView.getComputedStyle(node);

    return Boolean(
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || 1) > 0
    );
  }

  function getViewport() {
    return {
      width: Math.max(1, Math.round(window.innerWidth || document.documentElement.clientWidth || 1280)),
      height: Math.max(1, Math.round(window.innerHeight || document.documentElement.clientHeight || 720)),
      dpr: Math.max(1, Number(window.devicePixelRatio || 1))
    };
  }

  function safeCall(fn, fallback) {
    try {
      return typeof fn === "function" ? fn() : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function ensureFallbackSun() {
    var mount = $("[data-dgb-sun-mount]");
    var fallback;

    if (!mount) return null;

    fallback = mount.querySelector("[data-sun-fallback]");

    if (!fallback) {
      fallback = document.createElement("div");
      fallback.className = "sun-fallback";
      fallback.setAttribute("data-sun-fallback", "");
      fallback.setAttribute("aria-hidden", "true");
      mount.appendChild(fallback);
    }

    return fallback;
  }

  function detectSunTruth() {
    var root = rootNode();
    var mount = $("[data-dgb-sun-mount]");
    var fallback = ensureFallbackSun();
    var canvas = mount ? mount.querySelector("canvas") : null;
    var svg = mount ? mount.querySelector("svg") : null;

    state.rootPresent = Boolean(root);
    state.fallbackVisible = Boolean(fallback && visibleNode(fallback));
    state.canvasVisible = Boolean(canvas && visibleNode(canvas));
    state.svgVisible = Boolean(svg && visibleNode(svg));
    state.sunVisible = Boolean(
      mount &&
      (
        state.fallbackVisible ||
        state.canvasVisible ||
        state.svgVisible ||
        visibleNode(mount)
      )
    );

    if (mount && (canvas || svg)) {
      mount.setAttribute("data-runtime-mounted", "true");
    }

    return state.sunVisible;
  }

  function detectCanopyTruth() {
    var canopy = window.DGBSpineCanopy;
    var canopyState = null;

    if (canopy && typeof canopy.getPublicState === "function") {
      try {
        canopyState = canopy.getPublicState();
      } catch (error) {
        canopyState = null;
      }
    }

    state.canopyPresent = Boolean(canopy || canopyState);
    state.heldByCanopy = state.canopyPresent;

    return state.heldByCanopy;
  }

  function readInitialStateFromDom() {
    var root = rootNode();
    var body = document.body;
    var activeViewButton;
    var rootView;
    var bodyView;

    bodyView = body ? body.getAttribute("data-cockpit-view") : "";
    rootView = root ? root.getAttribute("data-cockpit-view") : "";
    activeViewButton = $("[data-cockpit-view-button][aria-pressed='true'], [data-cosmic-view-button][aria-pressed='true']");

    state.view = normalizeView(
      rootView ||
      bodyView ||
      (activeViewButton && (activeViewButton.getAttribute("data-cockpit-view-button") || activeViewButton.getAttribute("data-cosmic-view-button"))) ||
      "cinematic"
    );

    state.toggles.planets = readBooleanAttribute(body, "data-layer-planets", true);
    state.toggles.paths = readBooleanAttribute(body, "data-layer-paths", false);
    state.toggles.axes = readBooleanAttribute(body, "data-layer-axes", false);
    state.toggles.nebula = readBooleanAttribute(body, "data-layer-nebula", true);
    state.toggles.milkyWay = readBooleanAttribute(body, "data-layer-milkyway", true);
    state.toggles.solarWind = readBooleanAttribute(body, "data-layer-solarwind", true);

    $all("[data-cockpit-toggle], [data-cosmic-toggle]").forEach(function (button) {
      var key = normalizeToggleName(button.getAttribute("data-cockpit-toggle") || button.getAttribute("data-cosmic-toggle"));
      if (!key) return;
      state.toggles[key] = button.getAttribute("aria-pressed") === "true";
    });
  }

  function requestVenueBridge() {
    if (venueImportStarted) return;

    venueImportStarted = true;
    state.venue.status = "loading";
    applyVenueDataset();

    if (typeof import !== "function") {
      state.venue.status = "unsupported";
      state.venue.error = "dynamic import unavailable";
      applyVenueDataset();
      applyNarrative();
      return;
    }

    import(WORLD_CONTROL_PATH)
      .then(function (module) {
        worldControlModule = module || null;
        state.venue.available = Boolean(worldControlModule);
        state.venue.imported = Boolean(worldControlModule);
        state.venue.status = worldControlModule ? "active" : "unavailable";
        state.venue.error = "";
        refreshVenueRead();
        sync({ dispatch: false });
        dispatchVenue();
      })
      .catch(function (error) {
        worldControlModule = null;
        state.venue.available = false;
        state.venue.imported = false;
        state.venue.status = "fallback";
        state.venue.error = error && error.message ? error.message : "world control import failed";
        applyVenueDataset();
        applyNarrative();
        dispatchVenue();
      });
  }

  function refreshVenueRead() {
    var viewport = getViewport();
    var module = worldControlModule;
    var receipt;
    var plan;
    var camera;
    var world;
    var solarPolicy;
    var labelPolicy;

    state.venue.lastViewport = viewport;

    if (!module) {
      state.venue.status = state.venue.status === "loading" ? "loading" : "fallback";
      applyVenueDataset();
      return state.venue;
    }

    receipt = safeCall(function () {
      return module.getControlReceipt({ viewport: viewport });
    }, null);

    plan = safeCall(function () {
      return module.getControlPlan({ viewport: viewport });
    }, null);

    camera = safeCall(function () {
      return module.getCameraFrame(viewport);
    }, receipt && receipt.camera ? receipt.camera : null);

    world = safeCall(function () {
      return module.getUniverseBoundsKm();
    }, receipt && receipt.world && receipt.world.boundsKm ? receipt.world.boundsKm : null);

    solarPolicy = safeCall(function () {
      return module.getSolarPolicy();
    }, receipt && receipt.solarPolicy ? receipt.solarPolicy : null);

    labelPolicy = safeCall(function () {
      return module.getLabelVisibilityPolicy(viewport);
    }, receipt && receipt.labelPolicy ? receipt.labelPolicy : null);

    state.venue.status = "active";
    state.venue.available = true;
    state.venue.imported = true;
    state.venue.camera = camera || null;
    state.venue.world = world || null;
    state.venue.solarPolicy = solarPolicy || null;
    state.venue.labelPolicy = labelPolicy || null;
    state.venue.controlPlan = plan || null;
    state.venue.error = "";

    applyVenueDataset();
    return state.venue;
  }

  function getVenueAdjustmentForView(view) {
    var camera = state.venue.camera;
    var viewport = state.venue.lastViewport || getViewport();
    var mobile = viewport.width <= 760;
    var ratio = camera && Number.isFinite(camera.pxPerKm) ? camera.pxPerKm : 0;
    var kmPerPx = camera && Number.isFinite(camera.kmPerPx) ? camera.kmPerPx : 0;
    var adjustment = {
      scaleBump: 0,
      panX: "0px",
      panY: "0px",
      axisBoost: 0,
      pathBoost: 0
    };

    if (!state.venue.available || !camera) return adjustment;

    if (view === "wide") {
      adjustment.scaleBump = mobile ? -0.02 : -0.035;
      adjustment.panY = mobile ? "2px" : "5px";
    }

    if (view === "local") {
      adjustment.scaleBump = mobile ? 0.025 : 0.045;
      adjustment.panY = "0px";
    }

    if (view === "axis") {
      adjustment.axisBoost = Math.min(0.08, Math.max(0.02, ratio * 1000000));
    }

    if (view === "paths") {
      adjustment.pathBoost = Math.min(0.10, Math.max(0.03, ratio * 1200000));
    }

    if (view === "galaxy") {
      adjustment.scaleBump = mobile ? -0.015 : -0.03;
      adjustment.panY = "6px";
    }

    if (view === "control") {
      adjustment.axisBoost = Math.min(0.10, Math.max(0.03, kmPerPx / 200000000));
      adjustment.pathBoost = Math.min(0.10, Math.max(0.03, kmPerPx / 200000000));
    }

    return adjustment;
  }

  function applyVenueDataset() {
    var root = rootNode();
    var camera = state.venue.camera;
    var world = state.venue.world;
    var solar = state.venue.solarPolicy;

    if (!root) return;

    root.setAttribute("data-venue-bridge", state.venue.status);
    root.setAttribute("data-venue-source", WORLD_CONTROL_PATH);
    root.setAttribute("data-venue-authority", state.venue.available ? "world-control" : "cockpit-fallback");

    if (camera) {
      root.setAttribute("data-venue-km-per-px", String(Number(camera.kmPerPx || 0)));
      root.setAttribute("data-venue-px-per-km", String(Number(camera.pxPerKm || 0)));
      root.setAttribute("data-venue-drawable-width", String(Math.round(Number(camera.drawableWidthPx || 0))));
      root.setAttribute("data-venue-drawable-height", String(Math.round(Number(camera.drawableHeightPx || 0))));
    }

    if (world) {
      root.setAttribute("data-venue-width-km", String(Math.round(Number(world.width || world.widthKm || 0))));
      root.setAttribute("data-venue-height-km", String(Math.round(Number(world.height || world.heightKm || 0))));
    }

    if (solar) {
      root.setAttribute("data-venue-solar-template", String(solar.template || "unknown"));
      root.setAttribute("data-venue-body-count", String(solar.bodyCount || "unknown"));
    }
  }

  function applyDataset() {
    var root = rootNode();
    var body = document.body;

    if (body) {
      body.setAttribute("data-cockpit-view", state.view);
      body.setAttribute("data-layer-planets", state.toggles.planets ? "true" : "false");
      body.setAttribute("data-layer-paths", state.toggles.paths ? "true" : "false");
      body.setAttribute("data-layer-axes", state.toggles.axes ? "true" : "false");
      body.setAttribute("data-layer-nebula", state.toggles.nebula ? "true" : "false");
      body.setAttribute("data-layer-milkyway", state.toggles.milkyWay ? "true" : "false");
      body.setAttribute("data-layer-solarwind", state.toggles.solarWind ? "true" : "false");
    }

    if (root) {
      root.setAttribute("data-cockpit-view", state.view);
      root.setAttribute("data-cosmic-view", state.view);
      root.setAttribute("data-compass-cockpit", VERSION);
      root.setAttribute("data-index-boot", VERSION);
      root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
      root.setAttribute("data-canopy-relationship", "held-by-canopy");
      root.setAttribute("data-js-source-marker", SOURCE_MARKER);
      root.setAttribute("data-js-renewal-marker", RENEWAL);

      root.setAttribute("data-layer-planets", state.toggles.planets ? "true" : "false");
      root.setAttribute("data-layer-paths", state.toggles.paths ? "true" : "false");
      root.setAttribute("data-layer-axes", state.toggles.axes ? "true" : "false");
      root.setAttribute("data-layer-nebula", state.toggles.nebula ? "true" : "false");
      root.setAttribute("data-layer-milkyway", state.toggles.milkyWay ? "true" : "false");
      root.setAttribute("data-layer-solarwind", state.toggles.solarWind ? "true" : "false");
    }

    applyVenueDataset();
  }

  function applyCockpitPosture() {
    var root = rootNode();
    var copy = VIEW_COPY[state.view] || VIEW_COPY.cinematic;
    var posture = copy.posture || VIEW_COPY.cinematic.posture;
    var venue = getVenueAdjustmentForView(state.view);
    var scale = Number(posture.scale || 1) + Number(venue.scaleBump || 0);
    var axis = Number(posture.axis || 0) + Number(venue.axisBoost || 0);
    var paths = Number(posture.paths || 0) + Number(venue.pathBoost || 0);

    setCssVar(root, "--cockpit-scale", Math.max(0.84, Math.min(1.12, scale)));
    setCssVar(root, "--cockpit-tilt", posture.tilt);
    setCssVar(root, "--cockpit-pan-x", venue.panX || posture.panX);
    setCssVar(root, "--cockpit-pan-y", venue.panY || posture.panY);
    setCssVar(root, "--hud-strength", posture.hud);
    setCssVar(root, "--axis-opacity", Math.max(0, Math.min(0.5, axis)));
    setCssVar(root, "--path-opacity", Math.max(0, Math.min(0.52, paths)));
  }

  function setButtonPressed(button, pressed) {
    if (!button) return;

    button.setAttribute("aria-pressed", pressed ? "true" : "false");

    if (pressed) {
      button.setAttribute("data-active", "true");
    } else {
      button.removeAttribute("data-active");
    }
  }

  function applyButtonState() {
    $all("[data-cockpit-view-button], [data-cosmic-view-button]").forEach(function (button) {
      var view = button.getAttribute("data-cockpit-view-button") || button.getAttribute("data-cosmic-view-button");
      setButtonPressed(button, normalizeView(view) === state.view);
    });

    $all("[data-cockpit-toggle], [data-cosmic-toggle]").forEach(function (button) {
      var key = normalizeToggleName(button.getAttribute("data-cockpit-toggle") || button.getAttribute("data-cosmic-toggle"));
      setButtonPressed(button, key ? Boolean(state.toggles[key]) : false);
    });
  }

  function venuePhrase() {
    if (state.venue.status === "active") return " Venue bridge active.";
    if (state.venue.status === "loading") return " Venue bridge loading.";
    if (state.venue.status === "fallback") return " Venue bridge unavailable; cockpit fallback active.";
    if (state.venue.status === "unsupported") return " Venue bridge unsupported; cockpit fallback active.";
    return "";
  }

  function applyNarrative() {
    var copy = VIEW_COPY[state.view] || VIEW_COPY.cinematic;
    var status = copy.status;

    if (!state.sunVisible) {
      status = status + " · visible sun fallback required";
    }

    if (!state.heldByCanopy) {
      status = status + " · canopy pending";
    }

    status = status + " · " + (state.venue.available ? "venue authority active" : "cockpit fallback venue");

    setText("[data-cockpit-view-label]", state.view);
    setText("[data-cosmic-control-view]", state.view);
    setText("[data-cockpit-mode-pill]", copy.label);
    setText("[data-cockpit-narrative]", copy.narrative + venuePhrase());
    setText("[data-cockpit-status]", status);
    setText("[data-cosmic-control-status]", status);
    setText("[data-door-boot-status]", state.heldByCanopy ? "Held by canopy" : "Visible-first fallback active");
  }

  function enforceModeSideEffects(view) {
    if (view === "axis") {
      state.toggles.axes = true;
    }

    if (view === "paths") {
      state.toggles.paths = true;
    }

    if (view === "galaxy") {
      state.toggles.milkyWay = true;
    }

    if (view === "nebula") {
      state.toggles.nebula = true;
    }

    if (view === "control") {
      state.toggles.axes = true;
      state.toggles.paths = true;
      state.toggles.planets = true;
    }

    if (view === "local") {
      state.toggles.planets = true;
    }
  }

  function sync(options) {
    refreshVenueRead();
    detectSunTruth();
    detectCanopyTruth();
    applyDataset();
    applyCockpitPosture();
    applyButtonState();
    applyNarrative();

    if (!options || options.dispatch !== false) {
      dispatchState();
    }
  }

  function applyView(view, options) {
    var next = normalizeView(view);

    state.view = next;
    state.lastAction = "view:" + next;

    enforceModeSideEffects(next);
    sync(options);
  }

  function toggleLayer(name, options) {
    var key = normalizeToggleName(name);

    if (!key) return;

    state.toggles[key] = !state.toggles[key];
    state.lastAction = "toggle:" + key;

    sync(options);
  }

  function setLayer(name, value, options) {
    var key = normalizeToggleName(name);

    if (!key) return;

    state.toggles[key] = Boolean(value);
    state.lastAction = "set:" + key;

    sync(options);
  }

  function actionFromButton(button) {
    var view;
    var toggle;

    if (!button) return false;

    view = button.getAttribute("data-cockpit-view-button") || button.getAttribute("data-cosmic-view-button");
    toggle = button.getAttribute("data-cockpit-toggle") || button.getAttribute("data-cosmic-toggle");

    if (view) {
      applyView(view);
      return true;
    }

    if (toggle) {
      toggleLayer(toggle);
      return true;
    }

    return false;
  }

  function findActionButton(target) {
    if (!target || !target.closest) return null;

    return target.closest(
      "[data-cockpit-view-button], [data-cosmic-view-button], [data-cockpit-toggle], [data-cosmic-toggle]"
    );
  }

  function delegatedCaptureHandler(event) {
    var button = findActionButton(event.target);

    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    actionFromButton(button);
  }

  function directButtonHandler(event) {
    var button = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    actionFromButton(button);
  }

  function bindControls() {
    if (!document.__dgbCockpitDelegatedCaptureBound) {
      document.__dgbCockpitDelegatedCaptureBound = true;
      document.addEventListener("click", delegatedCaptureHandler, true);
    }

    $all("[data-cockpit-view-button], [data-cosmic-view-button], [data-cockpit-toggle], [data-cosmic-toggle]").forEach(function (button) {
      if (button.__dgbCockpitBound) return;

      button.__dgbCockpitBound = true;
      button.addEventListener("click", directButtonHandler, false);
    });
  }

  function installRuntimeObserver() {
    var root = rootNode();
    var mount = $("[data-dgb-sun-mount]");

    if (mount && typeof MutationObserver !== "undefined" && !mount.__dgbCockpitObserver) {
      mount.__dgbCockpitObserver = true;

      new MutationObserver(function () {
        sync();
      }).observe(mount, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    if (root && typeof MutationObserver !== "undefined" && !root.__dgbCockpitRootObserver) {
      root.__dgbCockpitRootObserver = true;

      new MutationObserver(function () {
        applyButtonState();
        applyCockpitPosture();
        applyNarrative();
      }).observe(root, {
        attributes: true,
        attributeFilter: ["data-cockpit-view", "data-cosmic-view"]
      });
    }
  }

  function installResizeSync() {
    if (window.__dgbCockpitResizeBound) return;

    window.__dgbCockpitResizeBound = true;

    window.addEventListener("resize", function () {
      window.clearTimeout(window.__dgbCockpitResizeTimer);
      window.__dgbCockpitResizeTimer = window.setTimeout(function () {
        refreshVenueRead();
        applyCockpitPosture();
        applyNarrative();
        dispatchVenue();
      }, 120);
    }, { passive: true });
  }

  function schedulePostRuntimeSync() {
    window.requestAnimationFrame(function () {
      sync({ dispatch: false });
    });

    [80, 250, 750, 1500, 2600].forEach(function (delay) {
      window.setTimeout(function () {
        bindControls();
        sync({ dispatch: false });
      }, delay);
    });
  }

  function dispatchState() {
    try {
      window.dispatchEvent(new CustomEvent(STATE_EVENT, { detail: getPublicState() }));
    } catch (error) {
      /* no-op */
    }
  }

  function dispatchVenue() {
    try {
      window.dispatchEvent(new CustomEvent(VENUE_EVENT, { detail: getVenueState() }));
    } catch (error) {
      /* no-op */
    }
  }

  function getCameraPosture() {
    var copy = VIEW_COPY[state.view] || VIEW_COPY.cinematic;
    var venue = getVenueAdjustmentForView(state.view);

    return {
      view: state.view,
      label: copy.label,
      posture: {
        scale: copy.posture.scale,
        tilt: copy.posture.tilt,
        panX: venue.panX || copy.posture.panX,
        panY: venue.panY || copy.posture.panY,
        hud: copy.posture.hud,
        axis: copy.posture.axis + Number(venue.axisBoost || 0),
        paths: copy.posture.paths + Number(venue.pathBoost || 0)
      },
      venueBridge: state.venue.status,
      truth: "cockpit_repositions_relative_to_fixed_environment"
    };
  }

  function getVenueState() {
    return {
      status: state.venue.status,
      path: state.venue.path,
      available: state.venue.available,
      imported: state.venue.imported,
      error: state.venue.error,
      world: state.venue.world,
      camera: state.venue.camera,
      solarPolicy: state.venue.solarPolicy,
      labelPolicy: state.venue.labelPolicy,
      controlPlan: state.venue.controlPlan,
      lastViewport: state.venue.lastViewport
    };
  }

  function getPublicState() {
    return {
      version: VERSION,
      renewal: RENEWAL,
      sourceMarker: SOURCE_MARKER,
      rootBootId: ROOT_BOOT_ID,
      canopyVersion: CANOPY_VERSION,
      status: "held-by-canopy",
      view: state.view,
      lastAction: state.lastAction,
      cameraPosture: getCameraPosture(),
      venue: getVenueState(),
      toggles: {
        planets: state.toggles.planets,
        paths: state.toggles.paths,
        axes: state.toggles.axes,
        nebula: state.toggles.nebula,
        milkyWay: state.toggles.milkyWay,
        solarWind: state.toggles.solarWind
      },
      rootPresent: state.rootPresent,
      sunVisible: state.sunVisible,
      fallbackVisible: state.fallbackVisible,
      canvasVisible: state.canvasVisible,
      svgVisible: state.svgVisible,
      canopyPresent: state.canopyPresent,
      heldByCanopy: state.heldByCanopy,
      falseHealthBlocked: true,
      environmentMoved: false,
      cockpitRepositioned: true,
      sourceMarkers: REQUIRED_MARKERS.slice(),
      viewOrder: VIEW_ORDER.slice()
    };
  }

  function exposePublicApi() {
    window.DGBIndexBoot = {
      version: VERSION,
      renewal: RENEWAL,
      rootBootId: ROOT_BOOT_ID,
      status: "held-by-canopy",
      ensureFallbackSun: ensureFallbackSun,
      applyView: applyView,
      toggleLayer: toggleLayer,
      setLayer: setLayer,
      sync: sync,
      getPublicState: getPublicState
    };

    window.DGBCompassCockpit = {
      version: VERSION,
      renewal: RENEWAL,
      rootBootId: ROOT_BOOT_ID,
      status: "held-by-canopy",
      venueBridge: WORLD_CONTROL_PATH,
      ensureFallbackSun: ensureFallbackSun,
      applyView: applyView,
      toggleLayer: toggleLayer,
      setLayer: setLayer,
      sync: sync,
      refreshVenueRead: refreshVenueRead,
      getCameraPosture: getCameraPosture,
      getVenueState: getVenueState,
      getPublicState: getPublicState
    };
  }

  function boot() {
    var root = rootNode();

    if (root) {
      root.setAttribute("data-index-boot", VERSION);
      root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
      root.setAttribute("data-canopy-relationship", "held-by-canopy");
      root.setAttribute("data-js-source-marker", SOURCE_MARKER);
      root.setAttribute("data-js-renewal-marker", RENEWAL);
      root.setAttribute("data-compass-cockpit", VERSION);
      root.setAttribute("data-venue-bridge", "pending");
      root.setAttribute("data-venue-source", WORLD_CONTROL_PATH);
    }

    readInitialStateFromDom();
    ensureFallbackSun();
    exposePublicApi();
    bindControls();
    installRuntimeObserver();
    installResizeSync();
    requestVenueBridge();
    sync({ dispatch: false });
    schedulePostRuntimeSync();
    dispatchState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
