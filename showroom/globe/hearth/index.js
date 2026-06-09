/*
  /showroom/globe/hearth/index.js
  HEARTH_FACILITY_AUDRALIA_PRODUCTION_CHAMBER_TED_ORBIT_CONTROLLER_TNT_v1
  Third-file replacement.
  Scope: public route controller only.
  Purpose:
  - Control TED-style facility orbit.
  - Control Return to Orbit.
  - Control Platform / Engineering lens.
  - Maintain people-friendly gauge text.
  - Preserve and measure #hearthCanvasMount and #hearthVisibleCanvas.
  - Optionally bridge to existing Hearth canvas authorities through public APIs only.
  Does not own:
  - canvas engine source
  - controls engine source
  - runtime loop source
  - diagnostic participant source
  - planet renderer source
*/

(function hearthFacilityAudraliaProductionChamberController() {
  "use strict";

  var root = window;
  var doc = document;

  var CONTRACT = "HEARTH_FACILITY_AUDRALIA_PRODUCTION_CHAMBER_TED_ORBIT_CONTROLLER_TNT_v1";
  var RECEIPT = "HEARTH_FACILITY_AUDRALIA_PRODUCTION_CHAMBER_TED_ORBIT_CONTROLLER_RECEIPT_v1";
  var VERSION = "2026-06-09.hearth-facility-audralia-production-chamber-ted-orbit-controller-v1";

  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var REQUIRED_MOUNT_ID = "hearthCanvasMount";
  var REQUIRED_CANVAS_ID = "hearthVisibleCanvas";

  var OPTIONAL_ENGINE_SCRIPTS = [
    "/assets/hearth/hearth.hex.four-pair.authority.js?v=2026-06-09-hearth-facility-optional-bridge-v1",
    "/assets/hearth/hearth.hex.surface.js?v=2026-06-09-hearth-facility-optional-bridge-v1",
    "/assets/hearth/hearth.canvas.js?v=2026-06-09-hearth-facility-optional-bridge-v1"
  ];

  var state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    route: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    initializedAt: "",
    updatedAt: "",
    activeLens: "platform",
    activeOrbit: "orbit",
    mountExists: false,
    mountRectNonZero: false,
    canvasExists: false,
    canvasRectNonZero: false,
    stagePrepared: false,
    canvasAuthorityFound: false,
    canvasAuthorityPath: "NONE",
    canvasBridgeAttempted: false,
    canvasBridgeStatus: "NOT_RUN",
    loadedOptionalScripts: [],
    failedOptionalScripts: [],
    productionMutationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    routeRepairAuthorized: false,
    targetRouteRendererMutationAuthorized: false,
    visualPassClaimed: false,
    webGL: false
  };

  var els = {
    body: doc.body,
    page: null,
    mount: null,
    canvas: null,
    fallback: null,
    stageStatus: null,
    orbit: null,
    orbitNodes: [],
    returnButton: null,
    lensButtons: [],
    panel: null,
    panelKicker: null,
    panelTitle: null,
    panelBody: null,
    panelActions: null,
    gaugeGrid: null,
    gauges: {}
  };

  var orbitCopy = {
    orbit: {
      platform: {
        kicker: "Facility Orbit",
        title: "Hearth is the chamber. Audralia is the first subject.",
        body: "Select a facility lens to focus the presentation. Each lens brings one part of the chamber forward while the rest of the orbit steps back.",
        actions: [
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "System View",
        title: "Route shell, stage surface, orbit controller, diagnostic bridge.",
        body: "The public route owns presentation and layout. The diagnostic route owns inspection. The canvas engine, controls engine, and runtime loop remain separate authorities.",
        actions: [
          { label: "Inspect the Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      }
    },

    unknown: {
      platform: {
        kicker: "The Unknown",
        title: "The facility is hidden before the world is visible.",
        body: "Hearth is the alias for a planetary production facility in the Unknown. The visitor is not entering a normal globe page. They are entering the observation room where a first world begins to take shape.",
        actions: [
          { label: "Return to Globe Window", href: "/showroom/globe/" },
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Route Identity",
        title: "Hearth is facility context, not planetary identity.",
        body: "The route presents a facility shell. Audralia is the first planetary subject. The page must preserve the measurable mount and canvas IDs while avoiding production mutation claims.",
        actions: [
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      }
    },

    audralia: {
      platform: {
        kicker: "First Planetary Subject",
        title: "Audralia is the possibility world entering production.",
        body: "Audralia is the frontier playground: a world where science, terrain, characters, thresholds, and future interaction can develop together without flattening into a standard demo.",
        actions: [
          { label: "Visit Audralia", href: "/showroom/globe/audralia/" },
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Planetary Subject",
        title: "Audralia is the public subject; Hearth is the production facility.",
        body: "The route should keep the subject/facility split clear. Hearth prepares the chamber and reads instruments. Audralia carries the world-object identity.",
        actions: [
          { label: "Visit Audralia", href: "/showroom/globe/audralia/" }
        ]
      }
    },

    frontier: {
      platform: {
        kicker: "Frontier Sciences",
        title: "The science lanes become buildable world thresholds.",
        body: "Closed Loop, Energy, Infrastructure, Lattice, Manual, Trajectory, Shimmer, Waste, Water, Vision, and Urban systems can become the frontier disciplines that shape Audralia.",
        actions: [
          { label: "Open Frontier", href: "/explore/frontier/" },
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Applied Science Lanes",
        title: "Frontier provides the category system; Hearth provides the chamber.",
        body: "The page should translate Frontier into readable chamber gauges and future interaction categories, not copy the full Frontier directory into this route.",
        actions: [
          { label: "Open Frontier", href: "/explore/frontier/" }
        ]
      }
    },

    characters: {
      platform: {
        kicker: "Character Builders",
        title: "The characters are the builders of frontier thresholds.",
        body: "The characters are not decoration. They become guides, builders, pressure points, and future interactive agents as Audralia develops its frontier sciences.",
        actions: [
          { label: "Meet the Characters", href: "/characters/" },
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Narrative Interface",
        title: "Character logic becomes interaction logic.",
        body: "The character layer should eventually connect user-facing narrative, world-state choices, and developing science lanes without confusing fiction with diagnostic proof.",
        actions: [
          { label: "Meet the Characters", href: "/characters/" }
        ]
      }
    },

    gauges: {
      platform: {
        kicker: "Facility Gauges",
        title: "The build state should be readable before it becomes technical.",
        body: "The public gauges explain what the facility is doing in human language: visual surface, motion and touch, narrative alignment, and diagnostic readiness.",
        actions: [
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Instrument Layer",
        title: "Friendly gauges summarize receipt-backed evidence.",
        body: "The gauges should never claim final visual success. They should summarize state while the diagnostic panel remains the source of direct proof.",
        actions: [
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      }
    },

    underhood: {
      platform: {
        kicker: "Under the Hood",
        title: "The engine room stays available without taking over the page.",
        body: "The public page explains the chamber. The diagnostic panel proves what the chamber can see, measure, and return.",
        actions: [
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Diagnostic Boundary",
        title: "Diagnostics inspect. The public route presents.",
        body: "This file can measure route layout and bridge to public canvas APIs, but it does not repair canvas internals, controls, runtime, or diagnostic participant files.",
        actions: [
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      }
    },

    diagnostic: {
      platform: {
        kicker: "Diagnostic Panel",
        title: "The instrument room shows what the chamber can prove.",
        body: "Open the diagnostic panel when you want direct receipts, route evidence, source checks, surface truth, and next lawful move synthesis.",
        actions: [
          { label: "Enter Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Proof Room",
        title: "Direct receipts remain separate from public presentation.",
        body: "Use the diagnostic panel for direct execution reports, surface measurements, no-touch boundary checks, and next-move synthesis.",
        actions: [
          { label: "Enter Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      }
    }
  };

  function now() {
    return new Date().toISOString();
  }

  function query(selector, scope) {
    return (scope || doc).querySelector(selector);
  }

  function queryAll(selector, scope) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(selector));
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function setClass(node, className, enabled) {
    if (!node) return;
    node.classList.toggle(className, Boolean(enabled));
  }

  function getRectStatus(node) {
    if (!node || typeof node.getBoundingClientRect !== "function") {
      return {
        exists: Boolean(node),
        width: 0,
        height: 0,
        nonzero: false
      };
    }

    var rect = node.getBoundingClientRect();
    var width = Math.max(0, Math.round(rect.width));
    var height = Math.max(0, Math.round(rect.height));

    return {
      exists: true,
      width: width,
      height: height,
      nonzero: width > 0 && height > 0
    };
  }

  function captureElements() {
    els.page = query("[data-hearth-page]");
    els.mount = doc.getElementById(REQUIRED_MOUNT_ID);
    els.canvas = doc.getElementById(REQUIRED_CANVAS_ID);
    els.fallback = query("[data-canvas-fallback]");
    els.stageStatus = query("[data-stage-status]");
    els.orbit = query(".facility-orbit");
    els.orbitNodes = queryAll("[data-orbit-node]");
    els.returnButton = query("[data-return-orbit]");
    els.lensButtons = queryAll("[data-lens]");
    els.panel = query("[data-orbit-panel]");
    els.panelKicker = query("[data-panel-kicker]");
    els.panelTitle = query("[data-panel-title]");
    els.panelBody = query("[data-panel-body]");
    els.panelActions = query("[data-panel-actions]");
    els.gaugeGrid = query("[data-gauge-grid]");

    els.gauges = {
      visual: query('[data-gauge="visual"]'),
      motion: query('[data-gauge="motion"]'),
      narrative: query('[data-gauge="narrative"]'),
      diagnostic: query('[data-gauge="diagnostic"]')
    };
  }

  function updateStageMeasurement() {
    var mountStatus = getRectStatus(els.mount);
    var canvasStatus = getRectStatus(els.canvas);

    state.mountExists = mountStatus.exists;
    state.mountRectNonZero = mountStatus.nonzero;
    state.canvasExists = canvasStatus.exists;
    state.canvasRectNonZero = canvasStatus.nonzero;
    state.stagePrepared = Boolean(
      state.mountExists &&
      state.mountRectNonZero &&
      state.canvasExists &&
      state.canvasRectNonZero
    );
    state.updatedAt = now();

    if (els.mount) {
      els.mount.dataset.mountExists = String(state.mountExists);
      els.mount.dataset.mountRectNonZero = String(state.mountRectNonZero);
      els.mount.dataset.canvasExists = String(state.canvasExists);
      els.mount.dataset.canvasRectNonZero = String(state.canvasRectNonZero);
    }

    if (els.canvas) {
      els.canvas.dataset.canvasRectNonZero = String(state.canvasRectNonZero);
      els.canvas.dataset.measuredWidth = String(canvasStatus.width);
      els.canvas.dataset.measuredHeight = String(canvasStatus.height);
    }

    setText(
      els.stageStatus,
      state.stagePrepared
        ? "Stage prepared · surface is measurable"
        : "Stage preparing · surface measurement pending"
    );

    updateGaugeText();
  }

  function updateGaugeText() {
    var visualStrong = els.gauges.visual ? query("strong", els.gauges.visual) : null;
    var visualText = els.gauges.visual ? query("p", els.gauges.visual) : null;

    if (state.stagePrepared) {
      setText(visualStrong, "Stage measurable");
      setText(
        visualText,
        "The chamber now gives the planetary viewport physical space for visible expression."
      );
    } else {
      setText(visualStrong, "Stage being renewed");
      setText(
        visualText,
        "The chamber is preparing a larger, cleaner place for the planetary view to appear."
      );
    }

    var motionStrong = els.gauges.motion ? query("strong", els.gauges.motion) : null;
    var motionText = els.gauges.motion ? query("p", els.gauges.motion) : null;
    setText(motionStrong, state.canvasAuthorityFound ? "Canvas bridge detected" : "Instrument pending");
    setText(
      motionText,
      state.canvasAuthorityFound
        ? "The page found a public Hearth canvas authority and attempted a safe mount bridge."
        : "Movement and interaction are measured separately from the public stage."
    );

    var diagnosticStrong = els.gauges.diagnostic ? query("strong", els.gauges.diagnostic) : null;
    var diagnosticText = els.gauges.diagnostic ? query("p", els.gauges.diagnostic) : null;
    setText(diagnosticStrong, "Diagnostic panel active");
    setText(
      diagnosticText,
      "The instrument room remains available for direct receipts and proof."
    );
  }

  function createActionLink(action) {
    var link = doc.createElement("a");
    link.className = "panel-link";
    link.href = action.href;
    link.textContent = action.label;
    return link;
  }

  function updatePanel() {
    var key = state.activeOrbit || "orbit";
    var lens = state.activeLens || "platform";
    var copyGroup = orbitCopy[key] || orbitCopy.orbit;
    var copy = copyGroup[lens] || copyGroup.platform || orbitCopy.orbit.platform;

    setText(els.panelKicker, copy.kicker);
    setText(els.panelTitle, copy.title);
    setText(els.panelBody, copy.body);

    if (els.panelActions) {
      els.panelActions.innerHTML = "";
      (copy.actions || []).forEach(function appendAction(action) {
        els.panelActions.appendChild(createActionLink(action));
      });
    }
  }

  function setLens(lens) {
    var nextLens = lens === "engineering" ? "engineering" : "platform";
    state.activeLens = nextLens;
    state.updatedAt = now();

    if (els.body) {
      els.body.dataset.hearthLens = nextLens;
    }

    els.lensButtons.forEach(function updateLensButton(button) {
      var isActive = button.getAttribute("data-lens") === nextLens;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    updatePanel();
  }

  function setOrbit(key) {
    var valid = Boolean(orbitCopy[key]);
    state.activeOrbit = valid ? key : "orbit";
    state.updatedAt = now();

    els.orbitNodes.forEach(function updateOrbitNode(button) {
      var isActive = button.getAttribute("data-orbit-node") === state.activeOrbit;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    setClass(els.orbit, "has-active", state.activeOrbit !== "orbit");
    updatePanel();

    if (state.activeOrbit !== "orbit" && els.panel) {
      els.panel.setAttribute("tabindex", "-1");
      try {
        els.panel.focus({ preventScroll: true });
      } catch (error) {
        els.panel.focus();
      }
    }
  }

  function returnToOrbit() {
    setOrbit("orbit");
  }

  function bindOrbitControls() {
    els.orbitNodes.forEach(function bindNode(button) {
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", function onOrbitClick() {
        setOrbit(button.getAttribute("data-orbit-node"));
      });
    });

    if (els.returnButton) {
      els.returnButton.addEventListener("click", returnToOrbit);
    }

    els.lensButtons.forEach(function bindLens(button) {
      button.addEventListener("click", function onLensClick() {
        setLens(button.getAttribute("data-lens"));
      });
    });

    doc.addEventListener("keydown", function onKeydown(event) {
      if (event.key === "Escape" && state.activeOrbit !== "orbit") {
        returnToOrbit();
      }
    });
  }

  function scriptAlreadyPresent(pathWithoutQuery) {
    return queryAll("script").some(function hasScript(script) {
      return Boolean(script.src && script.src.indexOf(pathWithoutQuery) !== -1);
    });
  }

  function loadScript(src) {
    return new Promise(function loadScriptPromise(resolve) {
      var pathWithoutQuery = src.split("?")[0];

      if (scriptAlreadyPresent(pathWithoutQuery)) {
        state.loadedOptionalScripts.push({
          src: src,
          status: "already-present"
        });
        resolve(true);
        return;
      }

      var script = doc.createElement("script");
      script.src = src;
      script.async = false;
      script.dataset.hearthFacilityOptionalBridge = "true";

      script.onload = function onLoad() {
        state.loadedOptionalScripts.push({
          src: src,
          status: "loaded"
        });
        resolve(true);
      };

      script.onerror = function onError() {
        state.failedOptionalScripts.push({
          src: src,
          status: "failed"
        });
        resolve(false);
      };

      doc.head.appendChild(script);
    });
  }

  function findCanvasAuthority() {
    var hearth = root.HEARTH || {};
    var dexter = root.DEXTER_LAB || {};

    var candidates = [
      { path: "HEARTH_CANVAS", value: root.HEARTH_CANVAS },
      { path: "HEARTH_CANVAS_HUB", value: root.HEARTH_CANVAS_HUB },
      { path: "HEARTH.canvas", value: hearth.canvas },
      { path: "HEARTH.canvasHub", value: hearth.canvasHub },
      { path: "HEARTH.hearthCanvas", value: hearth.hearthCanvas },
      { path: "HEARTH.mountHearthCanvas", value: hearth.mountHearthCanvas },
      { path: "DEXTER_LAB.hearthCanvas", value: dexter.hearthCanvas },
      { path: "DEXTER_LAB.hearthCanvasHub", value: dexter.hearthCanvasHub },
      { path: "mountHearthCanvas", value: root.mountHearthCanvas }
    ];

    for (var i = 0; i < candidates.length; i += 1) {
      if (candidates[i].value) {
        return candidates[i];
      }
    }

    return {
      path: "NONE",
      value: null
    };
  }

  function callAuthorityMethod(authority, methodName, payload) {
    if (!authority) return false;

    try {
      if (typeof authority === "function" && methodName === "mount") {
        authority(payload);
        return true;
      }

      if (authority && typeof authority[methodName] === "function") {
        authority[methodName](payload);
        return true;
      }
    } catch (error) {
      state.canvasBridgeStatus = "PUBLIC_API_CALL_ERROR:" + methodName;
      return false;
    }

    return false;
  }

  function bridgeToCanvasAuthority() {
    var found = findCanvasAuthority();

    state.canvasBridgeAttempted = true;
    state.canvasAuthorityFound = Boolean(found.value);
    state.canvasAuthorityPath = found.path;

    if (!found.value) {
      state.canvasBridgeStatus = "NO_PUBLIC_CANVAS_AUTHORITY_FOUND";
      updateGaugeText();
      return;
    }

    var payload = {
      route: TARGET_ROUTE,
      mount: els.mount,
      canvas: els.canvas,
      mountId: REQUIRED_MOUNT_ID,
      canvasId: REQUIRED_CANVAS_ID,
      source: CONTRACT
    };

    var booted = callAuthorityMethod(found.value, "boot", payload);
    var initialized = callAuthorityMethod(found.value, "init", payload);
    var mounted = callAuthorityMethod(found.value, "mount", payload);
    var started = callAuthorityMethod(found.value, "start", payload);

    state.canvasBridgeStatus = [
      "PUBLIC_CANVAS_AUTHORITY_FOUND",
      "boot=" + String(booted),
      "init=" + String(initialized),
      "mount=" + String(mounted),
      "start=" + String(started)
    ].join(";");

    if (mounted || started || booted || initialized) {
      setClass(els.mount, "is-live", true);
      if (els.mount) {
        els.mount.dataset.canvasState = "live";
      }
    }

    updateGaugeText();
  }

  function loadOptionalCanvasBridge() {
    if (!els.mount || !els.canvas) {
      state.canvasBridgeStatus = "SKIPPED_REQUIRED_SURFACE_MISSING";
      return Promise.resolve(false);
    }

    return OPTIONAL_ENGINE_SCRIPTS.reduce(function chain(promise, src) {
      return promise.then(function loadNext() {
        return loadScript(src);
      });
    }, Promise.resolve(true)).then(function afterScripts() {
      bridgeToCanvasAuthority();
      return true;
    });
  }

  function publishGlobals() {
    var api = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      getState: function getState() {
        updateStageMeasurement();
        return JSON.parse(JSON.stringify(state));
      },
      getReceiptLight: function getReceiptLight() {
        updateStageMeasurement();
        return {
          CONTRACT: CONTRACT,
          RECEIPT: RECEIPT,
          VERSION: VERSION,
          TARGET_ROUTE: TARGET_ROUTE,
          DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
          ACTIVE_LENS: state.activeLens,
          ACTIVE_ORBIT: state.activeOrbit,
          MOUNT_EXISTS: state.mountExists,
          MOUNT_RECT_NONZERO: state.mountRectNonZero,
          CANVAS_EXISTS: state.canvasExists,
          CANVAS_RECT_NONZERO: state.canvasRectNonZero,
          STAGE_PREPARED: state.stagePrepared,
          CANVAS_AUTHORITY_FOUND: state.canvasAuthorityFound,
          CANVAS_AUTHORITY_PATH: state.canvasAuthorityPath,
          CANVAS_BRIDGE_STATUS: state.canvasBridgeStatus,
          PRODUCTION_MUTATION_AUTHORIZED: false,
          CANVAS_REPAIR_AUTHORIZED: false,
          CANVAS_BUILD_AUTHORIZED: false,
          CANVAS_RELEASE_AUTHORIZED: false,
          CONTROLS_REPAIR_AUTHORIZED: false,
          RUNTIME_RESTART_AUTHORIZED: false,
          VISUAL_PASS_CLAIMED: false,
          WEBGL: false
        };
      },
      returnToOrbit: returnToOrbit,
      setOrbit: setOrbit,
      setLens: setLens,
      measureStage: updateStageMeasurement
    };

    root.HEARTH_FACILITY_AUDRALIA_PRODUCTION_CHAMBER = api;

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.facilityAudraliaProductionChamber = api;

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthFacilityAudraliaProductionChamber = api;
  }

  function bindResizeMeasurement() {
    root.addEventListener("resize", function onResize() {
      updateStageMeasurement();
    }, { passive: true });

    if ("ResizeObserver" in root && els.mount) {
      var observer = new ResizeObserver(function onObservedResize() {
        updateStageMeasurement();
      });

      observer.observe(els.mount);

      if (els.canvas) {
        observer.observe(els.canvas);
      }
    }
  }

  function readInitialHash() {
    var hash = (root.location.hash || "").replace("#", "").trim();
    if (hash && orbitCopy[hash]) {
      setOrbit(hash);
    }
  }

  function init() {
    state.initializedAt = now();
    state.updatedAt = state.initializedAt;

    captureElements();
    bindOrbitControls();
    bindResizeMeasurement();
    publishGlobals();

    setLens("platform");
    updateStageMeasurement();
    returnToOrbit();
    readInitialHash();

    loadOptionalCanvasBridge().then(function afterOptionalBridge() {
      updateStageMeasurement();
      publishGlobals();
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
