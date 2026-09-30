// /showroom/globe/hearth/index.js
// HEARTH_SHOWROOM_GATE_CONTROLLER_19X19_HOUSE_INTERFACE_AWARE_TNT_v2
// Full-file replacement.
// Owns: Hearth public route page behavior, route receipt, Bishop observation, mount observation, Jeeves path launcher, diagnostic door.
// Does not own: canvas drawing, planet generation, WebGL, runtime restart, controls mutation, final visual pass, Jeeves FAQ engine.

(function hearthShowroomGateController19x19(global) {
  "use strict";

  var root = global || window;
  var doc = root.document || null;

  var CONTRACT =
    "HEARTH_SHOWROOM_GATE_CONTROLLER_19X19_HOUSE_INTERFACE_AWARE_TNT_v2";
  var RECEIPT =
    "HEARTH_SHOWROOM_GATE_CONTROLLER_19X19_HOUSE_INTERFACE_AWARE_RECEIPT_v2";
  var PREVIOUS_CONTRACT =
    "HEARTH_SHOWROOM_GATE_CONTROLLER_CHAPEL_ONE_BISHOP_AWARE_TNT_v1";
  var VERSION =
    "2026-06-09.hearth-showroom-gate-controller-19x19-house-interface-aware-v2";

  var FILE = "/showroom/globe/hearth/index.js";
  var ROUTE = "/showroom/globe/hearth/";
  var CSS_FILE = "/showroom/globe/hearth/index.css";
  var HTML_FILE = "/showroom/globe/hearth/index.html";
  var JEEVES_ROUTE = "/showroom/globe/hearth/jeeves/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  var GLOBE_WINDOW_ROUTE = "/showroom/globe/";
  var AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  var FRONTIER_ROUTE = "/explore/frontier/";
  var CHARACTERS_ROUTE = "/characters/";

  var CANVAS_BISHOP_FILE = "/assets/hearth/hearth.canvas.js";
  var CANVAS_BISHOP_EXPECTED_CONTRACT =
    "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HEAD_MOUNT_GOVERNOR_TNT_v2";

  var REGISTRY_PLANE = "19x19";
  var MISSIONARY_ROLE = "js-page-behavior";
  var PRIMARY_ALIAS = "HEARTH_SHOWROOM_GATE_CONTROLLER";

  var NO_TOUCH = {
    productionMutationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    routeRepairAuthorized: false,
    targetRouteRendererMutationAuthorized: false,
    readyTextClaimed: false,
    f13Claimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false
  };

  var CANVAS_BISHOP_ALIASES = [
    "HEARTH_CANVAS_BISHOP",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_CHAPEL_ONE_BISHOP",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasBishop",
    "HEARTH.chapelOneBishop",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasBishop",
    "DEXTER_LAB.hearthChapelOneBishop"
  ];

  var SELECTORS = {
    mount: [
      "#hearthCanvasMount",
      "[data-hearth-canvas-mount='true']",
      "[data-hearth-showroom-surface='true']",
      "[data-hearth-visible-surface='true']",
      "[data-hearth-dom-surface='true']",
      "[data-hearth-canvas-stage='true']"
    ],
    planetStage: [
      "[data-hearth-planet-stage='true']",
      ".hearth-planet-stage"
    ],
    liveChamber: [
      "[data-hearth-live-globe-chamber='true']",
      ".hearth-live-chamber",
      "#hearth-window"
    ],
    jeevesLinks: [
      "[data-hearth-open-jeeves]",
      "[data-hearth-nav='jeeves']",
      "a[href='/showroom/globe/hearth/jeeves/']"
    ],
    diagnosticLinks: [
      "[data-hearth-open-diagnostic]",
      "[data-hearth-nav='diagnostics']",
      "a[href='/showroom/globe/hearth/diagnostic/']"
    ],
    jumpWindow: [
      "[data-hearth-jump='window']"
    ],
    returnGlobeWindow: [
      "[data-hearth-return-globe-window]"
    ],
    statusOutput: [
      "#hearthStatusOutput",
      "[data-hearth-status-output]"
    ],
    statusRoute: [
      "[data-hearth-status-route]"
    ],
    statusMount: [
      "[data-hearth-status-mount]"
    ],
    statusDiagnostics: [
      "[data-hearth-status-diagnostics]"
    ],
    statusRelease: [
      "[data-hearth-status-release]"
    ]
  };

  var state = {
    booted: false,
    bootedAt: "",
    updatedAt: "",
    lastReceipt: null,
    lastMeasurement: null,
    localEvents: [],
    errors: []
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function asString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      var out = {};
      Object.keys(value).forEach(function copy(key) {
        out[key] = value[key];
      });
      return out;
    }
  }

  function trim(list, max) {
    if (!Array.isArray(list)) return;
    if (max === undefined) max = 120;
    if (list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function recordLocal(event, detail) {
    var item = {
      at: nowIso(),
      event: asString(event, "LOCAL_EVENT"),
      detail: clonePlain(detail || {})
    };

    state.localEvents.push(item);
    trim(state.localEvents);
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail) {
    var item = {
      at: nowIso(),
      code: asString(code, "HEARTH_SHOWROOM_GATE_CONTROLLER_ERROR"),
      message: error && error.message ? asString(error.message) : asString(error),
      detail: clonePlain(detail || {})
    };

    state.errors.push(item);
    trim(state.errors);
    state.updatedAt = item.at;

    return item;
  }

  function readPath(path) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) {
        return null;
      }
      cursor = cursor[parts[i]];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;

    var cursor = root;
    for (var i = 0; i < parts.length - 1; i += 1) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") {
        cursor[parts[i]] = {};
      }
      cursor = cursor[parts[i]];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function queryFirst(selectors) {
    if (!doc) return null;

    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var node = doc.querySelector(selectors[i]);
        if (node) return node;
      } catch (_error) {}
    }

    return null;
  }

  function queryAll(selectors) {
    var out = [];
    if (!doc) return out;

    selectors.forEach(function each(selector) {
      try {
        Array.prototype.slice.call(doc.querySelectorAll(selector)).forEach(function add(node) {
          if (out.indexOf(node) === -1) out.push(node);
        });
      } catch (_error) {}
    });

    return out;
  }

  function methodKeys(value) {
    if (!isObject(value) && !isFunction(value)) return [];

    try {
      return Object.keys(value).filter(function filter(key) {
        return isFunction(value[key]);
      });
    } catch (_error) {
      return [];
    }
  }

  function readAuthority(paths, file, expectedContract) {
    for (var i = 0; i < paths.length; i += 1) {
      var value = readPath(paths[i]);

      if (value) {
        return {
          found: true,
          aliasPath: paths[i],
          file: file,
          methodCount: methodKeys(value).length,
          contract: asString(value.CONTRACT || value.contract || "UNKNOWN"),
          receipt: asString(value.RECEIPT || value.receipt || "UNKNOWN"),
          version: asString(value.VERSION || value.version || "UNKNOWN"),
          expectedContract: expectedContract || "",
          expectedContractObserved: expectedContract
            ? asString(value.CONTRACT || value.contract || "") === expectedContract
            : false
        };
      }
    }

    return {
      found: false,
      aliasPath: "NONE",
      file: file,
      methodCount: 0,
      contract: "UNKNOWN",
      receipt: "UNKNOWN",
      version: "UNKNOWN",
      expectedContract: expectedContract || "",
      expectedContractObserved: false
    };
  }

  function normalizeSrc(src) {
    return asString(src).split("?")[0].split("#")[0];
  }

  function inspectScriptInclusion() {
    var scripts = [];
    var matching = [];

    if (!doc) {
      return {
        bishopScriptTagFound: false,
        bishopScriptTagCount: 0,
        bishopScriptSrcMatches: [],
        bishopExpectedFile: CANVAS_BISHOP_FILE
      };
    }

    try {
      scripts = Array.prototype.slice.call(doc.scripts || []);
    } catch (_error) {
      scripts = [];
    }

    scripts.forEach(function each(script) {
      var src = asString(script.getAttribute("src") || script.src || "");
      var normalized = normalizeSrc(src);

      if (normalized === CANVAS_BISHOP_FILE || src.indexOf(CANVAS_BISHOP_FILE) !== -1) {
        matching.push(src);
      }
    });

    return {
      bishopScriptTagFound: matching.length > 0,
      bishopScriptTagCount: matching.length,
      bishopScriptSrcMatches: matching,
      bishopExpectedFile: CANVAS_BISHOP_FILE
    };
  }

  function readRect(node) {
    if (!node || !isFunction(node.getBoundingClientRect)) {
      return {
        exists: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        nonzero: false
      };
    }

    try {
      var rect = node.getBoundingClientRect();
      var width = Number(rect.width || 0);
      var height = Number(rect.height || 0);

      return {
        exists: true,
        left: Number(rect.left || 0),
        top: Number(rect.top || 0),
        width: width,
        height: height,
        nonzero: width > 0 && height > 0
      };
    } catch (_error) {
      return {
        exists: true,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        nonzero: false
      };
    }
  }

  function inspectMount() {
    var mount = queryFirst(SELECTORS.mount);
    var planetStage = queryFirst(SELECTORS.planetStage);
    var liveChamber = queryFirst(SELECTORS.liveChamber);
    var mountRect = readRect(mount);
    var stageRect = readRect(planetStage);
    var chamberRect = readRect(liveChamber);

    return {
      mountExists: Boolean(mount),
      mountSelector: mount ? "#" + (mount.id || "unknown") : "NONE",
      mountRect: mountRect,
      mountRectNonzero: mountRect.nonzero,
      planetStageExists: Boolean(planetStage),
      planetStageRect: stageRect,
      planetStageRectNonzero: stageRect.nonzero,
      liveChamberExists: Boolean(liveChamber),
      liveChamberRect: chamberRect,
      liveChamberRectNonzero: chamberRect.nonzero,
      canvasExists: Boolean(mount && mount.querySelector && mount.querySelector("canvas")),
      canvasCount: mount && mount.querySelectorAll ? mount.querySelectorAll("canvas").length : 0,
      placeholderExists: Boolean(mount && mount.querySelector && mount.querySelector("[data-hearth-mount-placeholder='true']")),
      hiddenByLensPanel: Boolean(mount && mount.closest && mount.closest("[data-hearth-lens-panel]:not([data-active='true'])")),
      diagnosticOccupiesMount: Boolean(mount && mount.querySelector && mount.querySelector("[data-hearth-open-diagnostic], iframe, .diagnostic-door"))
    };
  }

  function inspectJeeves() {
    var links = queryAll(SELECTORS.jeevesLinks);
    var preview = doc ? doc.querySelector("[data-hearth-jeeves-preview='true']") : null;

    return {
      jeevesHouseInterfacePathDeclared: links.length > 0,
      jeevesHouseInterfaceAvailable: links.length > 0,
      jeevesRoute: JEEVES_ROUTE,
      jeevesLinkCount: links.length,
      jeevesPreviewExists: Boolean(preview),
      mapPortalReplacementSeedActive: true,
      faqEngineOwnedHere: false,
      faqEngineRoute: JEEVES_ROUTE
    };
  }

  function inspectDiagnostics() {
    var links = queryAll(SELECTORS.diagnosticLinks);

    return {
      diagnosticDoorAvailable: links.length > 0,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticLinkCount: links.length,
      diagnosticOccupiesGlobeMount: inspectMount().diagnosticOccupiesMount
    };
  }

  function inspectPublicLanguage() {
    var text = "";

    try {
      text = doc && doc.body ? doc.body.innerText || "" : "";
    } catch (_error) {
      text = "";
    }

    var forbiddenPublicTerms = [
      "hand and finger",
      "hands and fingers",
      "canvas release",
      "threshold proof",
      "future globe mount",
      "globe seat",
      "release-gated planet body"
    ];

    var hits = forbiddenPublicTerms.filter(function hit(term) {
      return text.toLowerCase().indexOf(term.toLowerCase()) !== -1;
    });

    return {
      publicFacilityLanguageActive: true,
      forbiddenBuildLanguageHitCount: hits.length,
      forbiddenBuildLanguageHits: hits,
      publicLanguageStatus: hits.length ? "PUBLIC_LANGUAGE_NEEDS_REVIEW" : "PUBLIC_LANGUAGE_ALIGNED"
    };
  }

  function inspectManifest() {
    var script = inspectScriptInclusion();
    var bishop = readAuthority(
      CANVAS_BISHOP_ALIASES,
      CANVAS_BISHOP_FILE,
      CANVAS_BISHOP_EXPECTED_CONTRACT
    );
    var mount = inspectMount();
    var jeeves = inspectJeeves();
    var diagnostics = inspectDiagnostics();
    var language = inspectPublicLanguage();

    var firstHold = "NONE";
    var status = "HEARTH_PUBLIC_ROUTE_19X19_READY_FOR_DOWNSTREAM";

    if (!script.bishopScriptTagFound) {
      status = "HELD_CANVAS_BISHOP_SCRIPT_NOT_DECLARED";
      firstHold = "BISHOP_SCRIPT_TAG_FOUND";
    } else if (!bishop.found) {
      status = "HELD_CANVAS_BISHOP_ALIAS_NOT_PUBLISHED";
      firstHold = "BISHOP_ALIAS_PUBLISHED";
    } else if (!mount.mountExists) {
      status = "HELD_CANONICAL_MOUNT_MISSING";
      firstHold = "CANONICAL_MOUNT_EXISTS";
    } else if (!mount.mountRectNonzero) {
      status = "HELD_CANONICAL_MOUNT_RECT_ZERO";
      firstHold = "CANONICAL_MOUNT_RECT_NONZERO";
    } else if (!jeeves.jeevesHouseInterfacePathDeclared) {
      status = "HELD_JEEVES_HOUSE_INTERFACE_PATH_MISSING";
      firstHold = "JEEVES_HOUSE_INTERFACE_PATH_DECLARED";
    } else if (!diagnostics.diagnosticDoorAvailable) {
      status = "HELD_DIAGNOSTIC_DOOR_MISSING";
      firstHold = "DIAGNOSTIC_DOOR_AVAILABLE";
    } else if (language.forbiddenBuildLanguageHitCount > 0) {
      status = "DEGRADED_PUBLIC_LANGUAGE_REVIEW";
      firstHold = "PUBLIC_LANGUAGE_ALIGNED";
    }

    return {
      status: status,
      firstHold: firstHold,
      script: script,
      canvasBishop: bishop,
      mount: mount,
      jeeves: jeeves,
      diagnostics: diagnostics,
      language: language
    };
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    try {
      doc.documentElement.dataset[key] =
        value === undefined || value === null ? "" : String(value);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function writeText(selectors, value) {
    var nodes = queryAll(selectors);
    nodes.forEach(function each(node) {
      node.textContent = value;
    });
    return nodes.length;
  }

  function publishDataset(receipt) {
    setDataset("hearthShowroomGateController", "active");
    setDataset("hearthShowroomGateContract", CONTRACT);
    setDataset("hearthShowroomGateReceipt", RECEIPT);
    setDataset("hearthShowroomGateVersion", VERSION);
    setDataset("hearthShowroomGateFile", FILE);

    setDataset("hearthRegistryPlane", REGISTRY_PLANE);
    setDataset("hearthMissionaryRole", MISSIONARY_ROLE);
    setDataset("hearthJsMissionaryMember", "true");
    setDataset("hearthChapelMember", "false");

    setDataset("hearthCanvasBishopScriptTagFound", receipt.BISHOP_SCRIPT_TAG_FOUND);
    setDataset("hearthCanvasBishopPresent", receipt.CANVAS_BISHOP_PRESENT);
    setDataset("hearthCanvasBishopAliasPath", receipt.CANVAS_BISHOP_ALIAS_PATH);

    setDataset("hearthCanonicalMountExists", receipt.CANONICAL_MOUNT_EXISTS);
    setDataset("hearthCanonicalMountRectNonzero", receipt.CANONICAL_MOUNT_RECT_NONZERO);
    setDataset("hearthCanonicalCanvasExists", receipt.CANONICAL_CANVAS_EXISTS);

    setDataset("hearthJeevesHouseInterfaceAvailable", receipt.JEEVES_HOUSE_INTERFACE_AVAILABLE);
    setDataset("hearthJeevesHouseInterfacePathDeclared", receipt.JEEVES_HOUSE_INTERFACE_PATH_DECLARED);
    setDataset("hearthDiagnosticDoorAvailable", receipt.DIAGNOSTIC_DOOR_AVAILABLE);
    setDataset("hearthMapPortalReplacementSeedActive", receipt.MAP_PORTAL_REPLACEMENT_SEED_ACTIVE);

    setDataset("hearthPublicLanguageStatus", receipt.PUBLIC_LANGUAGE_STATUS);
    setDataset("hearthRouteStatus", receipt.ROUTE_STATUS);
    setDataset("hearthFirstHold", receipt.FIRST_HOLD);

    setDataset("hearthProductionMutationAuthorized", "false");
    setDataset("hearthCanvasBuildAuthorized", "false");
    setDataset("hearthCanvasReleaseAuthorized", "false");
    setDataset("hearthRuntimeRestartAuthorized", "false");
    setDataset("hearthControlsMutationAuthorized", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function updateVisibleStatus(receipt) {
    writeText(SELECTORS.statusRoute, receipt.ROUTE_STATUS === "HEARTH_PUBLIC_ROUTE_19X19_READY_FOR_DOWNSTREAM" ? "active" : "held");
    writeText(SELECTORS.statusMount, receipt.CANONICAL_MOUNT_RECT_NONZERO ? "visible" : "held");
    writeText(SELECTORS.statusDiagnostics, receipt.DIAGNOSTIC_DOOR_AVAILABLE ? "linked" : "held");
    writeText(SELECTORS.statusRelease, "held");
  }

  function packetText(packet) {
    return Object.keys(packet || {}).map(function line(key) {
      var value = packet[key];

      if (value === undefined || value === null || value === "") value = "UNKNOWN";

      if (Array.isArray(value) || isObject(value)) {
        try {
          value = JSON.stringify(value);
        } catch (_error) {
          value = "[object]";
        }
      }

      return key + "=" + asString(value);
    }).join("\n");
  }

  function getReceipt() {
    var manifest = inspectManifest();

    var receipt = {
      PACKET: "HEARTH_SHOWROOM_GATE_CONTROLLER_19X19_RECEIPT_PACKET_v2",
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      HTML_FILE: HTML_FILE,
      CSS_FILE: CSS_FILE,
      ROUTE: ROUTE,

      REGISTRY_PLANE: REGISTRY_PLANE,
      MISSIONARY_ROLE: MISSIONARY_ROLE,
      MISSIONARY_MEMBER: true,
      CHAPEL_MEMBER: false,
      PRIMARY_ALIAS: PRIMARY_ALIAS,

      ROUTE_STATUS: manifest.status,
      FIRST_HOLD: manifest.firstHold,

      BISHOP_EXPECTED_FILE: CANVAS_BISHOP_FILE,
      BISHOP_EXPECTED_CONTRACT: CANVAS_BISHOP_EXPECTED_CONTRACT,
      BISHOP_SCRIPT_TAG_FOUND: manifest.script.bishopScriptTagFound,
      BISHOP_SCRIPT_TAG_COUNT: manifest.script.bishopScriptTagCount,
      BISHOP_SCRIPT_SRC_MATCHES: manifest.script.bishopScriptSrcMatches,

      CANVAS_BISHOP_PRESENT: manifest.canvasBishop.found,
      CANVAS_BISHOP_ALIAS_PATH: manifest.canvasBishop.aliasPath,
      CANVAS_BISHOP_CONTRACT: manifest.canvasBishop.contract,
      CANVAS_BISHOP_RECEIPT: manifest.canvasBishop.receipt,
      CANVAS_BISHOP_VERSION: manifest.canvasBishop.version,
      CANVAS_BISHOP_METHOD_COUNT: manifest.canvasBishop.methodCount,
      CANVAS_BISHOP_EXPECTED_CONTRACT_OBSERVED: manifest.canvasBishop.expectedContractObserved,

      CANONICAL_MOUNT_EXISTS: manifest.mount.mountExists,
      CANONICAL_MOUNT_SELECTOR: manifest.mount.mountSelector,
      CANONICAL_MOUNT_RECT_NONZERO: manifest.mount.mountRectNonzero,
      CANONICAL_MOUNT_RECT: manifest.mount.mountRect,
      CANONICAL_CANVAS_EXISTS: manifest.mount.canvasExists,
      CANONICAL_CANVAS_COUNT: manifest.mount.canvasCount,
      HEARTH_PLANET_STAGE_EXISTS: manifest.mount.planetStageExists,
      HEARTH_PLANET_STAGE_RECT_NONZERO: manifest.mount.planetStageRectNonzero,
      HEARTH_LIVE_CHAMBER_EXISTS: manifest.mount.liveChamberExists,
      HEARTH_LIVE_CHAMBER_RECT_NONZERO: manifest.mount.liveChamberRectNonzero,
      MOUNT_HIDDEN_BY_LENS_PANEL: manifest.mount.hiddenByLensPanel,
      DIAGNOSTIC_OCCUPIES_GLOBE_MOUNT: manifest.mount.diagnosticOccupiesMount,

      JEEVES_HOUSE_INTERFACE_PATH_DECLARED: manifest.jeeves.jeevesHouseInterfacePathDeclared,
      JEEVES_HOUSE_INTERFACE_AVAILABLE: manifest.jeeves.jeevesHouseInterfaceAvailable,
      JEEVES_ROUTE: manifest.jeeves.jeevesRoute,
      JEEVES_LINK_COUNT: manifest.jeeves.jeevesLinkCount,
      JEEVES_PREVIEW_EXISTS: manifest.jeeves.jeevesPreviewExists,
      JEEVES_FAQ_ENGINE_OWNED_HERE: manifest.jeeves.faqEngineOwnedHere,
      JEEVES_FAQ_ENGINE_ROUTE: manifest.jeeves.faqEngineRoute,

      DIAGNOSTIC_DOOR_AVAILABLE: manifest.diagnostics.diagnosticDoorAvailable,
      DIAGNOSTIC_ROUTE: manifest.diagnostics.diagnosticRoute,
      DIAGNOSTIC_LINK_COUNT: manifest.diagnostics.diagnosticLinkCount,

      MAP_PORTAL_REPLACEMENT_SEED_ACTIVE: manifest.jeeves.mapPortalReplacementSeedActive,

      PUBLIC_FACILITY_LANGUAGE_ACTIVE: manifest.language.publicFacilityLanguageActive,
      PUBLIC_LANGUAGE_STATUS: manifest.language.publicLanguageStatus,
      FORBIDDEN_BUILD_LANGUAGE_HIT_COUNT: manifest.language.forbiddenBuildLanguageHitCount,
      FORBIDDEN_BUILD_LANGUAGE_HITS: manifest.language.forbiddenBuildLanguageHits,

      WEBSITE_LAYER: "Diamond Gate Bridge public route",
      IN_WORLD_LAYER: "Hearth facility house interface",
      WORLD_BEYOND_WINDOW: "Audralia",
      FRONTIER_ROUTE: FRONTIER_ROUTE,
      CHARACTERS_ROUTE: CHARACTERS_ROUTE,
      AUDRALIA_ROUTE: AUDRALIA_ROUTE,
      GLOBE_WINDOW_ROUTE: GLOBE_WINDOW_ROUTE,

      NEXT_FILE: "/showroom/globe/hearth/jeeves/index.html",
      NEXT_CONTRACT: "HEARTH_JEEVES_HOUSE_INTERFACE_FAQ_PATH_HTML_TNT_v1",

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      UPDATED_AT: nowIso()
    };

    Object.assign(receipt, NO_TOUCH);

    state.lastReceipt = clonePlain(receipt);
    state.lastMeasurement = clonePlain(manifest);
    state.updatedAt = receipt.UPDATED_AT;

    publishDataset(receipt);
    updateVisibleStatus(receipt);

    return receipt;
  }

  function getReceiptLight() {
    var receipt = getReceipt();

    return {
      CONTRACT: receipt.CONTRACT,
      RECEIPT: receipt.RECEIPT,
      VERSION: receipt.VERSION,
      FILE: receipt.FILE,
      ROUTE: receipt.ROUTE,
      REGISTRY_PLANE: receipt.REGISTRY_PLANE,
      MISSIONARY_ROLE: receipt.MISSIONARY_ROLE,
      ROUTE_STATUS: receipt.ROUTE_STATUS,
      FIRST_HOLD: receipt.FIRST_HOLD,
      BISHOP_SCRIPT_TAG_FOUND: receipt.BISHOP_SCRIPT_TAG_FOUND,
      CANVAS_BISHOP_PRESENT: receipt.CANVAS_BISHOP_PRESENT,
      CANVAS_BISHOP_ALIAS_PATH: receipt.CANVAS_BISHOP_ALIAS_PATH,
      CANONICAL_MOUNT_EXISTS: receipt.CANONICAL_MOUNT_EXISTS,
      CANONICAL_MOUNT_RECT_NONZERO: receipt.CANONICAL_MOUNT_RECT_NONZERO,
      CANONICAL_CANVAS_EXISTS: receipt.CANONICAL_CANVAS_EXISTS,
      JEEVES_HOUSE_INTERFACE_AVAILABLE: receipt.JEEVES_HOUSE_INTERFACE_AVAILABLE,
      DIAGNOSTIC_DOOR_AVAILABLE: receipt.DIAGNOSTIC_DOOR_AVAILABLE,
      MAP_PORTAL_REPLACEMENT_SEED_ACTIVE: receipt.MAP_PORTAL_REPLACEMENT_SEED_ACTIVE,
      PUBLIC_LANGUAGE_STATUS: receipt.PUBLIC_LANGUAGE_STATUS,
      NEXT_FILE: receipt.NEXT_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      UPDATED_AT: receipt.UPDATED_AT
    };
  }

  function getReceiptText() {
    return packetText(getReceipt());
  }

  function writeStatus() {
    var output = queryFirst(SELECTORS.statusOutput);
    if (!output) return false;

    output.textContent = getReceiptText();
    return true;
  }

  function copyReceipt() {
    var text = getReceiptText();

    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(text).catch(function noop() {});
      return text;
    }

    if (!doc || !doc.body) return text;

    var area = doc.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    area.style.top = "-9999px";
    doc.body.appendChild(area);
    area.select();

    try {
      doc.execCommand("copy");
    } catch (_error) {}

    try {
      doc.body.removeChild(area);
    } catch (_error2) {}

    return text;
  }

  function openRoute(route) {
    if (!route) return false;
    root.location.href = route;
    return true;
  }

  function openJeeves() {
    return openRoute(JEEVES_ROUTE);
  }

  function openDiagnostic() {
    return openRoute(DIAGNOSTIC_ROUTE);
  }

  function scrollToWindow() {
    var target = queryFirst(["#hearth-window", "[data-hearth-live-globe-chamber='true']"]);
    if (!target) return false;

    try {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (_error) {
      target.scrollIntoView();
    }

    return true;
  }

  function bindClick(selectors, handler, options) {
    var nodes = queryAll(selectors);
    options = options || {};

    nodes.forEach(function bind(node) {
      if (node.dataset.hearthGateBound === "true") return;
      node.dataset.hearthGateBound = "true";

      node.addEventListener("click", function click(event) {
        if (options.preventDefault !== false) {
          event.preventDefault();
        }

        handler(event, node);
      });
    });

    return nodes.length;
  }

  function bindMainInteractions() {
    bindClick(SELECTORS.jumpWindow, scrollToWindow);

    bindClick(SELECTORS.jeevesLinks, function open(event, node) {
      if (node && node.tagName && node.tagName.toLowerCase() === "a") {
        return openJeeves();
      }
      return openJeeves();
    });

    bindClick(SELECTORS.diagnosticLinks, function open(event, node) {
      if (node && node.tagName && node.tagName.toLowerCase() === "a") {
        return openDiagnostic();
      }
      return openDiagnostic();
    });

    bindClick(SELECTORS.returnGlobeWindow, function goHome() {
      return openRoute(GLOBE_WINDOW_ROUTE);
    });

    recordLocal("HEARTH_PUBLIC_ROUTE_INTERACTIONS_BOUND", {
      jeevesLinks: queryAll(SELECTORS.jeevesLinks).length,
      diagnosticLinks: queryAll(SELECTORS.diagnosticLinks).length,
      windowJumpLinks: queryAll(SELECTORS.jumpWindow).length
    });
  }

  function publishApi() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    var api = {
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      ROUTE: ROUTE,
      REGISTRY_PLANE: REGISTRY_PLANE,
      MISSIONARY_ROLE: MISSIONARY_ROLE,

      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,

      inspectScriptInclusion: inspectScriptInclusion,
      inspectMount: inspectMount,
      inspectJeeves: inspectJeeves,
      inspectDiagnostics: inspectDiagnostics,
      inspectPublicLanguage: inspectPublicLanguage,
      inspectManifest: inspectManifest,

      getReceipt: getReceipt,
      getReceiptLight: getReceiptLight,
      getReceiptText: getReceiptText,
      getStatus: getReceipt,
      getState: function getState() {
        return clonePlain(state);
      },

      writeStatus: writeStatus,
      copyReceipt: copyReceipt,
      openJeeves: openJeeves,
      openDiagnostic: openDiagnostic,
      scrollToWindow: scrollToWindow,
      publishApi: publishApi,

      missionaryMember: true,
      chapelMember: false,
      jeevesHouseInterfaceAware: true,
      jeevesHouseInterfacePath: JEEVES_ROUTE,
      mapPortalReplacementSeedActive: true,

      ownsPageBehavior: true,
      ownsRouteReceipt: true,
      ownsBishopObservation: true,
      ownsMountObservation: true,
      ownsJeevesLauncher: true,
      ownsDiagnosticDoor: true,

      ownsCanvasDrawing: false,
      ownsPlanetGeneration: false,
      ownsCanvasBishopAuthority: false,
      ownsRuntimeRestart: false,
      ownsControlsMutation: false,
      ownsFinalVisualPass: false
    };

    Object.assign(api, NO_TOUCH);

    root.HEARTH_SHOWROOM_GATE_CONTROLLER = api;
    root.HEARTH_SHOWROOM_GATE_CONTROLLER_19X19 = api;
    root.HEARTH_HOUSE_INTERFACE_ROUTE_CONTROLLER = api;

    root.HEARTH.showroomGateController = api;
    root.HEARTH.showroomGate = api;
    root.HEARTH.houseInterfaceRouteController = api;
    root.HEARTH.jeevesHouseInterfaceSeed = api;

    root.DEXTER_LAB.hearthShowroomGateController = api;
    root.DEXTER_LAB.hearthHouseInterfaceRouteController = api;
    root.DEXTER_LAB.hearthJeevesHouseInterfaceSeed = api;

    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_LOADED__ = true;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_CONTRACT__ = CONTRACT;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_RECEIPT__ = RECEIPT;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_VERSION__ = VERSION;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_REGISTRY_PLANE__ = REGISTRY_PLANE;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_MISSIONARY_ROLE__ = MISSIONARY_ROLE;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_SEED_ACTIVE__ = true;
    root.__HEARTH_MAP_PORTAL_REPLACEMENT_SEED_ACTIVE__ = true;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_VISUAL_PASS_CLAIMED__ = false;

    return api;
  }

  function refresh() {
    var receipt = getReceipt();
    writeStatus();
    return receipt;
  }

  function boot() {
    if (state.booted) return publishApi();

    state.booted = true;
    state.bootedAt = nowIso();
    state.updatedAt = state.bootedAt;

    bindMainInteractions();
    var api = publishApi();

    try {
      refresh();
    } catch (error) {
      recordError("INITIAL_HEARTH_ROUTE_REFRESH_FAILED", error);
    }

    try {
      root.setTimeout(refresh, 120);
      root.setTimeout(refresh, 520);
      root.setTimeout(refresh, 1200);
    } catch (_error) {}

    try {
      root.addEventListener("resize", function resizeRefresh() {
        refresh();
      }, { passive: true });
    } catch (_error2) {}

    recordLocal("HEARTH_SHOWROOM_GATE_CONTROLLER_19X19_HOUSE_INTERFACE_AWARE_LOADED", {
      contract: CONTRACT,
      file: FILE,
      route: ROUTE,
      jeevesRoute: JEEVES_ROUTE
    });

    return api;
  }

  if (!doc) {
    publishApi();
    return;
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = publishApi();
  }
})(typeof window !== "undefined" ? window : globalThis);
