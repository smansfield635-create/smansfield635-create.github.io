// /assets/hearth/hearth.diagnostic.west.js
// HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1
// Full-file replacement.
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_WEST_LABWEST_CHRONOLOGY_CYCLE_BRIDGE_OBSERVATORY_TNT_v8
//
// Purpose:
// - Preserve the public WEST diagnostic rail contract expected by NORTH chronology.
// - Preserve WEST as rendered-target evidence authority only.
// - Add direct LabWest observability without making LabWest the diagnostic rail.
// - Read the real Hearth target document, not the diagnostic receiver document.
// - Track the current production cycle:
//   Route Conductor -> Controls Queen -> Canvas Public Receiver -> Hex Gate Surface
//   -> Pointer Finger -> Canvas Public Receiver artifact return.
// - Publish cycle, LabWest, route, controls, canvas, hex, pointer, DOM, and pixel evidence
//   for NORTH / Probe WEST / Probe NORTH consumption.
// - Recognize Route Conductor v10/v10_7/v10_5/v10_4/v10_3/v10_2/v10_1 and v9 lineage.
// - Recognize LabWest v4_9 and accepted lineage.
// - Recognize Canvas v12_4 candidate, v12_3 current, v12_2, v12_1, v12, and v11 lineage.
// - Preserve no production mutation, no runtime restart, no canvas repair, no lifecycle ignition,
//   no F13 claim, no F21 claim, no ready text, no final visual pass, no generated image,
//   no GraphicBox, and no WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_LABWEST_CHRONOLOGY_CYCLE_BRIDGE_OBSERVATORY_TNT_v8";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_WEST_LABWEST_CHRONOLOGY_CYCLE_BRIDGE_OBSERVATORY_RECEIPT_v8";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";
  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_BISHOP_QUEEN_CANVAS_RENDERED_PROOF_ALIGNMENT_TNT_v6";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_LAB_CANVAS_BRIDGE_RENDERED_PROOF_ALIGNMENT_TNT_v5";

  const VERSION =
    "2026-06-07.hearth-diagnostic-west-labwest-chronology-cycle-bridge-observatory-v8";

  const FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";

  const CURRENT_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const CURRENT_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_RENEWAL_CANDIDATE =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_CANVAS_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_POINTER_FINGER_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    CURRENT_HTML_CONTRACT,
    "HEARTH_HTML_CONTROL_HANDSHAKE_ROUTE_SHELL_INTEGRATION_TNT_v5",
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4",
    "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3"
  ]);

  const ACCEPTED_INDEX_CONTRACTS = Object.freeze([
    CURRENT_INDEX_CONTRACT,
    "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2",
    "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1",
    "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3"
  ]);

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10",
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5",
    "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4",
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3",
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const ACCEPTED_LABWEST_CONTRACTS = Object.freeze([
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_TNT_v4_8",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_2"
  ]);

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_RENEWAL_CANDIDATE,
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const ROUTE_CONDUCTOR_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH.routeConductor",
    "HEARTH.routeNorthBishop",
    "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
    "HEARTH.routeConductorControlFileAdmissionAndHandshakeDelivery",
    "HEARTH.routeConductorHexGatePointerFingerTransmission",
    "HEARTH.routeConductorPassiveUiSafeManualScan",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteNorthBishop",
    "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
  ]);

  const CONTROLS_ALIASES = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthPlanetaryControls"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasExpressionHub"
  ]);

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "DEXTER_LAB.hearthHexAuthority"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_GATE",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceGate",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceGate"
  ]);

  const POINTER_FINGER_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER",
    "HEARTH.canvasFingerInspect",
    "HEARTH.pointerFinger",
    "HEARTH.canvasPointerFinger",
    "HEARTH.canvasFingerSurfacePointer",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthPointerFinger"
  ]);

  const LABWEST_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_WEST",
    "RUNTIME_TABLE_WEST",
    "LAB_CARDINAL_RUNTIME_TABLE_WEST",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST",
    "HEARTH_RUNTIME_TABLE_WEST",
    "HEARTH_WEST_ADMISSIBILITY",
    "HEARTH_MACRO_WEST_AUTHORITY",
    "LAB_RUNTIME_TABLE_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",
    "HEARTH_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",
    "LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "HEARTH.runtimeTableWest",
    "HEARTH.westRuntimeTable",
    "HEARTH.westAdmissibility",
    "HEARTH.macroWestAuthority",
    "HEARTH.westCanvasV123PointerSurfaceBishopReleaseBridge",
    "HEARTH.westBishopChordCanvasReleaseBridge",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.hearthRuntimeTableWest",
    "DEXTER_LAB.westAdmissibility",
    "DEXTER_LAB.hearthWestCanvasV123PointerSurfaceBishopReleaseBridge"
  ]);

  const TARGET_FRAME_SELECTORS = Object.freeze([
    "#hearthDiagnosticTargetFrame",
    "iframe[data-hearth-diagnostic-target-frame='true']",
    "iframe[data-hearth-target-frame='true']",
    "iframe[data-diagnostic-target-frame='true']",
    "iframe[src='/showroom/globe/hearth/']",
    "iframe[src*='/showroom/globe/hearth/']"
  ]);

  const STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-visible-globe-stage]",
    "[data-hearth-planet-engine-stage]",
    "[data-hearth-expression-stage]",
    "[data-hearth-canvas-stage]"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-expression-mount]",
    "[data-hearth-canvas-expression-mount]"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "#hearthCanvasMount canvas",
    "[data-hearth-canvas-mount] canvas",
    "[data-hearth-expression-mount] canvas",
    "canvas"
  ]);

  const EXPRESSION_SURFACE_SELECTORS = Object.freeze([
    "[data-hearth-expression-surface]",
    "[data-hearth-canvas-surface]",
    "[data-hearth-visible-planet='true']",
    "[data-hearth-visible-globe='true']",
    "[data-hearth-base-globe-carrier]",
    "[data-hearth-visible-globe-carrier]",
    "[data-hearth-surface-layer]",
    "[data-hearth-land-layer]",
    "[data-hearth-water-layer]",
    "[data-hearth-ocean-layer]",
    "[data-hearth-atmosphere-layer]",
    "svg[data-hearth-planet-svg]",
    "svg[data-hearth-visible-globe]"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByDiagnosticRail: false,
    f13ClaimedByProbeWest: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedByProbeWest: false,
    f21SubmittedToNorth: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    productionMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    syntheticActivationAuthorized: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_CANVAS_CLAIMED: false,
    F13_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F13_CLAIMED_BY_PROBE_WEST: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_CLAIMED_BY_PROBE_WEST: false,
    F21_SUBMITTED_TO_NORTH: false,
    READY_TEXT_PERMISSION_GRANTED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,
    PRODUCTION_MUTATION_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    MACRO_WEST_RELEASE_AUTHORIZED: false,
    SYNTHETIC_ACTIVATION_AUTHORIZED: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastState = null;
  let lastEvidencePacket = null;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function text(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value).replace(/\s+/g, " ").trim();
  }

  function bounded(value, limit = 2400) {
    return text(value).slice(0, limit);
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function toBool(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function addNote(state, note) {
    const n = bounded(note, 1800);
    if (!n || !state || !Array.isArray(state.notes)) return;
    if (!state.notes.includes(n)) state.notes.push(n);
  }

  function readPath(base, path) {
    try {
      const parts = String(path || "").split(".");
      let cursor = base;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function setPath(path, value) {
    try {
      const parts = String(path || "").split(".");
      let cursor = root;

      for (let index = 0; index < parts.length - 1; index += 1) {
        const part = parts[index];
        if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
        cursor = cursor[part];
      }

      cursor[parts[parts.length - 1]] = value;
      return true;
    } catch (_error) {
      return false;
    }
  }

  function q(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelector)) return null;
      return context.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelectorAll)) return [];
      return Array.from(context.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function qFirst(context, selectors) {
    for (const selector of selectors || []) {
      const found = q(context, selector);
      if (found) return found;
    }
    return null;
  }

  function dataset(targetDocument) {
    try {
      return targetDocument && targetDocument.documentElement
        ? targetDocument.documentElement.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function bodyDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.body
        ? targetDocument.body.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function getCase(source, keys, fallback = "") {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") return source[key];

      const lower = key.toLowerCase();
      for (const candidate of Object.keys(source)) {
        if (candidate.toLowerCase() === lower) {
          const value = source[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function callReceipt(authority) {
    if (!authority || !isObject(authority)) return {};

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getWestReceipt",
      "getProbeWestReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getRouteCycleReceipt",
      "getRoutePrimaryGateReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? authority[method](false)
          : authority[method]();

        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.state)) return authority.state;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return {};
  }

  function contractFrom(authority, receipt) {
    const r = isObject(receipt) ? receipt : {};
    const a = isObject(authority) ? authority : {};

    return text(firstDefined(
      getCase(r, [
        "contract",
        "CONTRACT",
        "currentContract",
        "renewalContract",
        "implementationContract",
        "currentRouteConductorContract",
        "routeConductorContract",
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
        "hexSurfaceContract",
        "pointerFingerContract"
      ], ""),
      a.contract,
      a.CONTRACT,
      a.currentContract,
      a.renewalContract,
      a.implementationContract
    ), "");
  }

  function receiptNameFrom(authority, receipt) {
    const r = isObject(receipt) ? receipt : {};
    const a = isObject(authority) ? authority : {};

    return text(firstDefined(
      getCase(r, ["receipt", "RECEIPT", "renewalReceipt", "implementationReceipt"], ""),
      a.receipt,
      a.RECEIPT,
      a.renewalReceipt,
      a.implementationReceipt
    ), "");
  }

  function accepted(contract, list) {
    const c = text(contract);
    if (!c) return false;
    if ((list || []).includes(c)) return true;
    if (/^HEARTH_CANVAS_/i.test(c) && list === ACCEPTED_CANVAS_CONTRACTS) return true;
    return false;
  }

  function findAuthority(paths, targetWindow) {
    const contexts = [];

    if (targetWindow) contexts.push(["target", targetWindow]);
    contexts.push(["root", root]);

    for (const [contextName, context] of contexts) {
      for (const path of paths || []) {
        const authority = readPath(context, path);
        if (!authority || !isObject(authority)) continue;

        const receipt = callReceipt(authority);
        return {
          contextName,
          path,
          authority,
          receipt,
          contract: contractFrom(authority, receipt),
          receiptName: receiptNameFrom(authority, receipt)
        };
      }
    }

    return {
      contextName: "NONE",
      path: "NONE",
      authority: null,
      receipt: {},
      contract: "",
      receiptName: ""
    };
  }

  function normalizeSrc(rawSrc, targetWindow) {
    const raw = text(rawSrc);
    if (!raw) return "";

    try {
      const origin =
        targetWindow && targetWindow.location && targetWindow.location.origin
          ? targetWindow.location.origin
          : root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";

      const url = new URL(raw, origin);
      return `${url.pathname}${url.search || ""}`;
    } catch (_error) {
      return raw;
    }
  }

  function cacheKeyFromSrc(rawSrc, targetWindow) {
    const raw = text(rawSrc);

    try {
      const origin =
        targetWindow && targetWindow.location && targetWindow.location.origin
          ? targetWindow.location.origin
          : root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";

      const url = new URL(raw, origin);
      return url.searchParams.get("v") || url.searchParams.get("cache") || url.searchParams.get("version") || "";
    } catch (_error) {
      const match = raw.match(/[?&](?:v|cache|version)=([^&]+)/);
      return match ? decodeURIComponent(match[1]) : "";
    }
  }

  function scriptInfo(targetDocument, targetWindow, filePath) {
    const scripts = qa(targetDocument, "script[src]");
    const fileName = String(filePath || "").split("/").filter(Boolean).pop();

    const found = scripts.find((script) => {
      const src = normalizeSrc(script.getAttribute("src"), targetWindow);
      return src.includes(filePath) || (fileName && src.includes(`/${fileName}`));
    });

    if (!found) {
      return {
        present: false,
        src: "NOT_FOUND",
        cacheKey: ""
      };
    }

    const rawSrc = found.getAttribute("src") || "";

    return {
      present: true,
      src: normalizeSrc(rawSrc, targetWindow),
      cacheKey: cacheKeyFromSrc(rawSrc, targetWindow)
    };
  }

  function pathMatches(targetWindow, route) {
    try {
      const path = targetWindow && targetWindow.location ? targetWindow.location.pathname : "";
      const normal = String(route || "").replace(/\/$/, "");
      return path === route || path === normal;
    } catch (_error) {
      return false;
    }
  }

  function documentIsDiagnostic(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;

      const ds = dataset(targetDocument);
      const html = targetDocument.documentElement;
      const route = text(firstDefined(ds.route, html.getAttribute("data-route")), "");
      const page = text(firstDefined(ds.page, html.getAttribute("data-page")), "");
      const contract = text(firstDefined(ds.contract, html.getAttribute("data-contract")), "");

      return Boolean(
        pathMatches(targetWindow, DIAGNOSTIC_ROUTE) ||
        route === DIAGNOSTIC_ROUTE ||
        route === DIAGNOSTIC_ROUTE.replace(/\/$/, "") ||
        /diagnostic/i.test(page) ||
        /HEARTH_DIAGNOSTIC_ROUTE/i.test(contract)
      );
    } catch (_error) {
      return false;
    }
  }

  function documentLooksLikeHearth(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;
      if (documentIsDiagnostic(targetDocument, targetWindow)) return false;

      const ds = dataset(targetDocument);
      const bds = bodyDataset(targetDocument);
      const html = targetDocument.documentElement;
      const body = targetDocument.body;

      const route = text(firstDefined(ds.route, bds.route, html.getAttribute("data-route"), body && body.getAttribute("data-route")), "");
      const page = text(firstDefined(ds.page, html.getAttribute("data-page")), "");
      const alias = text(firstDefined(ds.pageAlias, html.getAttribute("data-page-alias")), "");
      const context = text(firstDefined(ds.pageContext, html.getAttribute("data-page-context")), "");

      return Boolean(
        pathMatches(targetWindow, TARGET_ROUTE) ||
        route === TARGET_ROUTE ||
        route === TARGET_ROUTE.replace(/\/$/, "") ||
        /hearth/i.test(page) ||
        /hearth/i.test(alias) ||
        /planet engine|visible globe|canvas expression|mirrorland formation/i.test(context) ||
        qFirst(targetDocument, STAGE_SELECTORS) ||
        qFirst(targetDocument, MOUNT_SELECTORS) ||
        qFirst(targetDocument, CANVAS_SELECTORS) ||
        qFirst(targetDocument, EXPRESSION_SURFACE_SELECTORS)
      );
    } catch (_error) {
      return false;
    }
  }

  function readFrame(frame, state) {
    try {
      if (!frame || !frame.contentWindow) return null;

      const targetWindow = frame.contentWindow;
      const targetDocument = targetWindow.document;

      if (!targetDocument || !targetDocument.documentElement) {
        addNote(state, "WEST_TARGET_FRAME_DOCUMENT_INACCESSIBLE");
        return null;
      }

      if (!documentLooksLikeHearth(targetDocument, targetWindow)) {
        addNote(state, "WEST_TARGET_FRAME_REJECTED_NOT_HEARTH_TARGET");
        return null;
      }

      return {
        targetDocument,
        targetWindow,
        frameElement: frame,
        source: "FRAME"
      };
    } catch (error) {
      addNote(state, `WEST_TARGET_FRAME_BLOCKED:${bounded(error && error.message ? error.message : error, 1000)}`);
      return null;
    }
  }

  function findTargetFrame(sourceDocument, state) {
    if (!sourceDocument) return null;

    for (const selector of TARGET_FRAME_SELECTORS) {
      const frame = q(sourceDocument, selector);
      if (!frame) continue;

      const target = readFrame(frame, state);
      if (target) {
        target.source = `FRAME_SELECTOR:${selector}`;
        return target;
      }
    }

    const frames = qa(sourceDocument, "iframe");

    for (const frame of frames) {
      const src = normalizeSrc(frame.getAttribute("src") || "", root);
      if (!src.includes("/showroom/globe/hearth/")) continue;

      const target = readFrame(frame, state);
      if (target) {
        target.source = "FRAME_SRC_SCAN";
        return target;
      }
    }

    for (const frame of frames) {
      const target = readFrame(frame, state);
      if (target) {
        target.source = "FRAME_HEARTH_SIGNAL_SCAN";
        return target;
      }
    }

    return null;
  }

  function resolveTarget(options, state) {
    const opts = options || {};

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetDocument = opts.targetDocument;
      const targetWindow = opts.targetWindow || targetDocument.defaultView || null;

      if (documentLooksLikeHearth(targetDocument, targetWindow)) {
        return {
          targetDocument,
          targetWindow,
          frameElement: opts.frameElement || null,
          source: "OPTIONS_TARGET_DOCUMENT"
        };
      }

      addNote(state, "WEST_OPTIONS_TARGET_DOCUMENT_REJECTED");
    }

    if (opts.targetWindow) {
      try {
        const targetWindow = opts.targetWindow;
        const targetDocument = targetWindow.document;

        if (targetDocument && targetDocument.documentElement && documentLooksLikeHearth(targetDocument, targetWindow)) {
          return {
            targetDocument,
            targetWindow,
            frameElement: opts.frameElement || null,
            source: "OPTIONS_TARGET_WINDOW"
          };
        }

        addNote(state, "WEST_OPTIONS_TARGET_WINDOW_REJECTED");
      } catch (error) {
        addNote(state, `WEST_OPTIONS_TARGET_WINDOW_BLOCKED:${bounded(error && error.message ? error.message : error, 1000)}`);
      }
    }

    if (opts.frameElement) {
      const target = readFrame(opts.frameElement, state);
      if (target) {
        target.source = "OPTIONS_FRAME_ELEMENT";
        return target;
      }
    }

    const currentDocument = root.document || null;

    if (currentDocument && currentDocument.documentElement && documentLooksLikeHearth(currentDocument, root)) {
      return {
        targetDocument: currentDocument,
        targetWindow: root,
        frameElement: null,
        source: "CURRENT_HEARTH_DOCUMENT"
      };
    }

    const frameTarget = findTargetFrame(currentDocument, state);
    if (frameTarget) return frameTarget;

    return {
      targetDocument: null,
      targetWindow: null,
      frameElement: null,
      source: "NONE"
    };
  }

  function rectPacket(el) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return "NOT_FOUND";
      const rect = el.getBoundingClientRect();

      return [
        `left:${Math.round(rect.left)}`,
        `top:${Math.round(rect.top)}`,
        `right:${Math.round(rect.right)}`,
        `bottom:${Math.round(rect.bottom)}`,
        `width:${Math.round(rect.width)}`,
        `height:${Math.round(rect.height)}`
      ].join(";");
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function rectNonZero(el) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return false;
      const rect = el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    } catch (_error) {
      return false;
    }
  }

  function viewportIntersecting(el, targetWindow) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return false;

      const win = targetWindow || root;
      const rect = el.getBoundingClientRect();
      const width = Number(win.innerWidth || 0);
      const height = Number(win.innerHeight || 0);

      return Boolean(
        rect.width > 0 &&
        rect.height > 0 &&
        rect.right > 0 &&
        rect.bottom > 0 &&
        rect.left < width &&
        rect.top < height
      );
    } catch (_error) {
      return false;
    }
  }

  function selectorName(el) {
    try {
      if (!el) return "NOT_FOUND";
      const tag = el.tagName ? el.tagName.toLowerCase() : "node";
      if (el.id) return `${tag}#${el.id}`;
      const attrs = [
        "data-hearth-globe-stage",
        "data-hearth-canvas-mount",
        "data-hearth-expression-surface",
        "data-hearth-canvas-surface",
        "data-hearth-visible-canvas",
        "data-hearth-canvas",
        "data-hearth-canvas-texture",
        "data-hearth-visible-planet",
        "data-hearth-visible-globe"
      ];

      for (const attr of attrs) {
        if (el.hasAttribute && el.hasAttribute(attr)) return `${tag}[${attr}]`;
      }

      return tag;
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function readPixelSample(canvas, state) {
    if (!canvas) {
      state.canvasPixelSampleStatus = "NO_CANVAS_ELEMENT";
      state.canvasPixelSampleReadable = "false";
      state.canvasPixelVisible = "false";
      state.canvasPixelNonEmpty = "false";
      state.canvasPixelUniqueColorCount = "0";
      state.canvasPixelVarianceStatus = "NO_PIXEL_SAMPLE";
      return;
    }

    const w = Number(canvas.width || 0);
    const h = Number(canvas.height || 0);

    if (!(w > 0 && h > 0)) {
      state.canvasPixelSampleStatus = "CANVAS_ZERO_ATTRIBUTE_SIZE";
      state.canvasPixelSampleReadable = "false";
      state.canvasPixelVisible = "false";
      state.canvasPixelNonEmpty = "false";
      state.canvasPixelUniqueColorCount = "0";
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNAVAILABLE_ZERO_SIZE";
      return;
    }

    if (!isFunction(canvas.getContext)) {
      state.canvasPixelSampleStatus = "CANVAS_GET_CONTEXT_UNAVAILABLE";
      state.canvasPixelSampleReadable = "false";
      state.canvasPixelVisible = "false";
      state.canvasPixelNonEmpty = "UNKNOWN";
      state.canvasPixelUniqueColorCount = "0";
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNAVAILABLE_NO_CONTEXT";
      return;
    }

    try {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx || !isFunction(ctx.getImageData)) {
        state.canvasPixelSampleStatus = "CANVAS_2D_CONTEXT_UNAVAILABLE";
        state.canvasPixelSampleReadable = "false";
        state.canvasPixelVisible = "false";
        state.canvasPixelNonEmpty = "UNKNOWN";
        state.canvasPixelUniqueColorCount = "0";
        state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNAVAILABLE_NO_2D_CONTEXT";
        return;
      }

      const cols = Math.max(1, Math.min(10, Math.floor(w)));
      const rows = Math.max(1, Math.min(10, Math.floor(h)));
      const colors = new Set();
      let alphaCount = 0;
      let total = 0;
      let minLum = 255;
      let maxLum = 0;

      for (let yy = 0; yy < rows; yy += 1) {
        for (let xx = 0; xx < cols; xx += 1) {
          const x = Math.max(0, Math.min(w - 1, Math.round((xx + 0.5) * w / cols)));
          const y = Math.max(0, Math.min(h - 1, Math.round((yy + 0.5) * h / rows)));
          const data = ctx.getImageData(x, y, 1, 1).data;

          const r = data[0] || 0;
          const g = data[1] || 0;
          const b = data[2] || 0;
          const a = data[3] || 0;

          total += 1;
          if (a > 0) alphaCount += 1;

          colors.add(`${r >> 4},${g >> 4},${b >> 4},${a > 0 ? 1 : 0}`);

          const lum = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
          minLum = Math.min(minLum, lum);
          maxLum = Math.max(maxLum, lum);
        }
      }

      const range = Math.max(0, maxLum - minLum);

      state.canvasPixelSampleStatus = "PIXEL_SAMPLE_READ";
      state.canvasPixelSampleReadable = "true";
      state.canvasPixelVisible = boolText(alphaCount > 0 && colors.size >= 2);
      state.canvasPixelNonEmpty = boolText(alphaCount > 0);
      state.canvasPixelUniqueColorCount = String(colors.size);
      state.canvasPixelLuminanceRange = String(range);
      state.canvasPixelVarianceStatus =
        alphaCount > 0 && colors.size >= 4 && range >= 8
          ? "PIXEL_VARIANCE_PRESENT"
          : alphaCount > 0
            ? "PIXEL_NONEMPTY_LOW_VARIANCE"
            : "PIXEL_EMPTY_OR_TRANSPARENT";

      if (state.canvasPixelVisible === "true") addNote(state, "CANVAS_PIXEL_VISIBLE_BY_WEST_SAMPLE");
      if (state.canvasPixelVarianceStatus === "PIXEL_EMPTY_OR_TRANSPARENT") addNote(state, "CANVAS_PIXEL_SAMPLE_BLANK_OR_TRANSPARENT");
    } catch (error) {
      state.canvasPixelSampleStatus = `PIXEL_SAMPLE_BLOCKED:${bounded(error && error.message ? error.message : error, 900)}`;
      state.canvasPixelSampleReadable = "false";
      state.canvasPixelVisible = "UNKNOWN";
      state.canvasPixelNonEmpty = "UNKNOWN";
      state.canvasPixelUniqueColorCount = "0";
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNREADABLE_NON_CONTROLLING";
      addNote(state, "CANVAS_PIXEL_SAMPLE_UNREADABLE_NON_CONTROLLING");
    }
  }

  function makeState() {
    return {
      westStatus: "READY",
      westRenderedReadComplete: "false",
      westRenderedReadStatus: "WAITING_RUN",
      diagnosticTargetAccessStatus: "UNKNOWN",
      diagnosticTargetAccessError: "UNKNOWN",
      targetSource: "UNKNOWN",
      hearthTargetConfirmed: false,

      renderedHtmlContract: "UNKNOWN",
      renderedHtmlContractRecognized: "UNKNOWN",
      renderedIndexScriptPresent: "UNKNOWN",
      renderedIndexScriptSrc: "UNKNOWN",
      renderedIndexContract: "UNKNOWN",
      renderedIndexContractRecognized: "UNKNOWN",

      routeConductorScriptPresent: "UNKNOWN",
      routeConductorScriptSrc: "UNKNOWN",
      routeConductorScriptCacheKey: "UNKNOWN",
      routeConductorAuthorityObserved: "UNKNOWN",
      routeConductorAuthoritySource: "UNKNOWN",
      routeConductorContract: "UNKNOWN",
      routeConductorReceipt: "UNKNOWN",
      routeConductorContractRecognized: "UNKNOWN",

      controlScriptPresent: "UNKNOWN",
      controlScriptSrc: "UNKNOWN",
      controlAuthorityObserved: "UNKNOWN",
      controlAuthoritySource: "UNKNOWN",
      controlContract: "UNKNOWN",
      controlReceipt: "UNKNOWN",
      controlContractRecognized: "UNKNOWN",
      controlFileStatus: "EXPECTED_NOT_YET_BUILT",
      controlHandshakeStatus: "EXPECTED_NOT_YET_WIRED",
      motionTouchStatus: "WAITING_CONTROL_FILE",
      dragStatus: "WAITING_CONTROL_FILE",
      viewControlStatus: "WAITING_CONTROL_FILE",

      canvasScriptPresent: "UNKNOWN",
      canvasScriptSrc: "UNKNOWN",
      canvasAuthorityObserved: "UNKNOWN",
      canvasAuthoritySource: "UNKNOWN",
      canvasContract: "UNKNOWN",
      canvasReceipt: "UNKNOWN",
      canvasParentContractRecognized: "UNKNOWN",
      canvasNamespacePresent: "UNKNOWN",
      canvasNamespaceMatchesDomSurface: "UNKNOWN",

      hexAuthorityScriptPresent: "UNKNOWN",
      hexAuthorityScriptSrc: "UNKNOWN",
      hexAuthorityObserved: "UNKNOWN",
      hexAuthoritySource: "UNKNOWN",
      hexAuthorityContract: "UNKNOWN",
      hexAuthorityRecognized: "UNKNOWN",

      hexSurfaceScriptPresent: "UNKNOWN",
      hexSurfaceScriptSrc: "UNKNOWN",
      hexSurfaceObserved: "UNKNOWN",
      hexSurfaceSource: "UNKNOWN",
      hexSurfaceContract: "UNKNOWN",
      hexSurfaceRecognized: "UNKNOWN",

      pointerFingerScriptPresent: "UNKNOWN",
      pointerFingerScriptSrc: "UNKNOWN",
      pointerFingerObserved: "UNKNOWN",
      pointerFingerSource: "UNKNOWN",
      pointerFingerContract: "UNKNOWN",
      pointerFingerRecognized: "UNKNOWN",

      labWestScriptPresent: "UNKNOWN",
      labWestScriptSrc: "UNKNOWN",
      labWestObserved: "UNKNOWN",
      labWestAuthoritySource: "UNKNOWN",
      labWestContract: "UNKNOWN",
      labWestReceipt: "UNKNOWN",
      labWestContractRecognized: "UNKNOWN",
      labWestReadMethod: "NONE",
      labWestDecision: "UNKNOWN",
      labWestGapClass: "UNKNOWN",
      labWestNorthC2Aligned: "UNKNOWN",
      labWestCycleRoute: "UNKNOWN",
      labWestCycleTwoSouthOutputAdmissible: "UNKNOWN",
      labWestBishopChordAdmissible: "UNKNOWN",
      labWestPreReleaseCarrierAdmissible: "UNKNOWN",
      labWestCanvasReleaseApproved: "UNKNOWN",
      labWestReleasePacketReady: "UNKNOWN",
      labWestRecommendedNextFile: "UNKNOWN",
      labWestPostgameStatus: "UNKNOWN",
      labWestDiagnosticTrackConnectionStatus: "UNKNOWN",

      planetStagePresent: "UNKNOWN",
      planetStageSelector: "UNKNOWN",
      planetStageRect: "UNKNOWN",
      planetStageRectNonzero: "UNKNOWN",
      canvasMountPresent: "UNKNOWN",
      canvasMountSelector: "UNKNOWN",
      canvasMountRect: "UNKNOWN",
      canvasMountRectNonzero: "UNKNOWN",
      canvasElementPresent: "UNKNOWN",
      canvasElementFound: "UNKNOWN",
      canvasElementSelector: "UNKNOWN",
      canvasRect: "UNKNOWN",
      canvasRectNonzero: "UNKNOWN",
      canvasInMount: "UNKNOWN",
      canvasComputedVisible: "UNKNOWN",
      canvasViewportIntersecting: "UNKNOWN",
      canvasContext2dReady: "UNKNOWN",
      expressionSurfacePresent: "UNKNOWN",
      expressionSurfaceSelector: "UNKNOWN",
      expressionSurfaceRect: "UNKNOWN",
      expressionSurfaceRectNonzero: "UNKNOWN",

      canvasPixelSampleStatus: "UNKNOWN",
      canvasPixelSampleReadable: "UNKNOWN",
      canvasPixelVisible: "UNKNOWN",
      canvasPixelNonEmpty: "UNKNOWN",
      canvasPixelUniqueColorCount: "0",
      canvasPixelLuminanceRange: "UNKNOWN",
      canvasPixelVarianceStatus: "UNKNOWN",

      visiblePlanetProofReady: "UNKNOWN",
      visiblePlanetProofSource: "UNKNOWN",
      renderedPlanetProofReady: "UNKNOWN",
      renderedPlanetProofInspected: "UNKNOWN",
      renderedPlanetProofFullyInspected: "UNKNOWN",
      westRenderedProofSpreadComplete: "UNKNOWN",
      canvasExpressionProofStatus: "UNKNOWN",
      canvasExpressionBottleneckClass: "UNKNOWN",
      canvasExpressionSurfaceReady: "UNKNOWN",
      canvasExpressionRichnessReady: "UNKNOWN",

      canvasSurfaceTruthStatus: "UNKNOWN",
      canvasSurfaceTruthAvailable: "UNKNOWN",
      canvasSurfaceTruthFirstFailedCoordinate: "UNKNOWN",
      canvasSurfaceTruthFailureClass: "UNKNOWN",
      canvasSurfaceTruthFailureReason: "UNKNOWN",
      canvasSurfaceTruthRecommendedOwner: "UNKNOWN",
      canvasSurfaceTruthRecommendedFile: "UNKNOWN",
      canvasSurfaceTruthRecommendedAction: "UNKNOWN",

      diagnosticTrackNewsAlignmentStatus: "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_COMPLETE",
      diagnosticTrackNewsAlignmentScore: "100",
      diagnosticTrackNewsAlignmentFirstFailedStage: "NONE",
      diagnosticTrackFibonacciSynchronizationStatus: "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_COMPLETE",
      diagnosticTrackFibonacciSynchronizationScore: "100",
      diagnosticTrackFibonacciSynchronizationFirstFailedStage: "NONE",
      canvasStandardNewsAlignmentStatus: "UNKNOWN",
      canvasStandardNewsAlignmentScore: "0",
      canvasStandardNewsAlignmentFirstFailedStage: "UNKNOWN",
      canvasStandardFibonacciSynchronizationStatus: "UNKNOWN",
      canvasStandardFibonacciSynchronizationScore: "0",
      canvasStandardFibonacciSynchronizationFirstFailedStage: "UNKNOWN",

      productionCycleObserved: "false",
      productionCycleStatus: "UNKNOWN",
      productionCycleFirstGap: "UNKNOWN",
      delegatoryRelationships: [],
      threeFileConstructStrategy: {},

      recommendedNextOwner: "UNKNOWN",
      recommendedNextFile: "UNKNOWN",
      recommendedNextAction: "UNKNOWN",
      primaryCaseCandidate: "UNKNOWN",
      notes: [],
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function readContracts(targetDocument, targetWindow, state) {
    const ds = dataset(targetDocument);
    const bds = bodyDataset(targetDocument);
    const html = targetDocument.documentElement;

    const htmlContract = text(firstDefined(
      ds.contract,
      ds.hearthHtmlContract,
      ds.hearthShellContract,
      html && html.getAttribute("data-contract"),
      bds.hearthHtmlContract
    ), "UNKNOWN");

    state.renderedHtmlContract = htmlContract;
    state.renderedHtmlContractRecognized = boolText(ACCEPTED_HTML_CONTRACTS.includes(htmlContract), "UNKNOWN");

    const indexScript = scriptInfo(targetDocument, targetWindow, INDEX_FILE);
    const indexContract = text(firstDefined(
      indexScript.cacheKey,
      ds.hearthIndexJsContract,
      ds.expectedIndexJsContract,
      bds.hearthIndexJsContract
    ), "UNKNOWN");

    state.renderedIndexScriptPresent = boolText(indexScript.present);
    state.renderedIndexScriptSrc = indexScript.src;
    state.renderedIndexContract = indexContract;
    state.renderedIndexContractRecognized = boolText(ACCEPTED_INDEX_CONTRACTS.includes(indexContract), "UNKNOWN");

    if (state.renderedHtmlContractRecognized === "true") addNote(state, "WEST_RENDERED_HTML_CONTRACT_RECOGNIZED_CURRENT_OR_ACCEPTED_LINEAGE");
    if (state.renderedIndexContractRecognized === "true") addNote(state, "WEST_RENDERED_INDEX_JS_CONTRACT_RECOGNIZED_CURRENT_OR_ACCEPTED_LINEAGE");
  }

  function readAuthoritySpread(targetDocument, targetWindow, state) {
    const routeScript = scriptInfo(targetDocument, targetWindow, ROUTE_CONDUCTOR_FILE);
    const controlScript = scriptInfo(targetDocument, targetWindow, CONTROL_FILE);
    const canvasScript = scriptInfo(targetDocument, targetWindow, CANVAS_FILE);
    const hexAuthorityScript = scriptInfo(targetDocument, targetWindow, HEX_AUTHORITY_FILE);
    const hexSurfaceScript = scriptInfo(targetDocument, targetWindow, HEX_SURFACE_FILE);
    const pointerScript = scriptInfo(targetDocument, targetWindow, POINTER_FINGER_FILE);
    const labWestScript = scriptInfo(targetDocument, targetWindow, LABWEST_FILE);

    const route = findAuthority(ROUTE_CONDUCTOR_ALIASES, targetWindow);
    const controls = findAuthority(CONTROLS_ALIASES, targetWindow);
    const canvas = findAuthority(CANVAS_ALIASES, targetWindow);
    const hexAuthority = findAuthority(HEX_AUTHORITY_ALIASES, targetWindow);
    const hexSurface = findAuthority(HEX_SURFACE_ALIASES, targetWindow);
    const pointer = findAuthority(POINTER_FINGER_ALIASES, targetWindow);
    const labWest = findAuthority(LABWEST_ALIASES, targetWindow);

    state.routeConductorScriptPresent = boolText(routeScript.present);
    state.routeConductorScriptSrc = routeScript.src;
    state.routeConductorScriptCacheKey = routeScript.cacheKey;
    state.routeConductorAuthorityObserved = boolText(Boolean(route.authority));
    state.routeConductorAuthoritySource = route.path;
    state.routeConductorContract = text(firstDefined(
      route.contract,
      getCase(route.receipt, ["contract", "CONTRACT", "renewalContract", "currentRouteConductorContract"], ""),
      routeScript.cacheKey
    ), "UNKNOWN");
    state.routeConductorReceipt = route.receiptName || text(getCase(route.receipt, ["receipt", "RECEIPT", "renewalReceipt"], ""), "UNKNOWN");
    state.routeConductorContractRecognized = boolText(accepted(state.routeConductorContract, ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS), "UNKNOWN");

    state.controlScriptPresent = boolText(controlScript.present);
    state.controlScriptSrc = controlScript.src;
    state.controlAuthorityObserved = boolText(Boolean(controls.authority));
    state.controlAuthoritySource = controls.path;
    state.controlContract = text(firstDefined(controls.contract, controlScript.cacheKey), "UNKNOWN");
    state.controlReceipt = controls.receiptName || "UNKNOWN";
    state.controlContractRecognized = boolText(
      state.controlContract === EXPECTED_CONTROL_CONTRACT ||
      state.controlContract === EXPECTED_CONTROL_RENEWAL_CANDIDATE ||
      /^HEARTH_CONTROLS_/i.test(state.controlContract),
      "UNKNOWN"
    );

    const controlMotionReady = Boolean(
      controls.authority &&
      (
        isFunction(controls.authority.attach) ||
        isFunction(controls.authority.mount) ||
        isFunction(controls.authority.start) ||
        isFunction(controls.authority.boot) ||
        isFunction(controls.authority.enableMotionTouch) ||
        isFunction(controls.authority.bindMotionTouch) ||
        isFunction(controls.authority.bindDrag) ||
        toBool(getCase(controls.receipt, ["motionTouchReady", "dragReady", "viewControlReady", "controlsReady"], false), false)
      )
    );

    state.controlFileStatus =
      controlScript.present || controls.authority
        ? controlMotionReady
          ? "CONTROL_FILE_LOADED_AND_MOTION_TOUCH_READY"
          : "CONTROL_FILE_PRESENT_HANDSHAKE_PENDING"
        : "EXPECTED_NOT_YET_BUILT";

    state.controlHandshakeStatus =
      controlScript.present || controls.authority
        ? controlMotionReady
          ? "HANDSHAKE_VALID"
          : "HANDSHAKE_PENDING"
        : "EXPECTED_NOT_YET_WIRED";

    state.motionTouchStatus = controlMotionReady ? "ACTIVE" : "WAITING_CONTROL_FILE";
    state.dragStatus = controlMotionReady ? "ACTIVE" : "WAITING_CONTROL_FILE";
    state.viewControlStatus = controlMotionReady ? "ACTIVE" : "WAITING_CONTROL_FILE";

    state.canvasScriptPresent = boolText(canvasScript.present);
    state.canvasScriptSrc = canvasScript.src;
    state.canvasAuthorityObserved = boolText(Boolean(canvas.authority));
    state.canvasAuthoritySource = canvas.path;
    state.canvasContract = text(firstDefined(
      canvas.contract,
      getCase(canvas.receipt, ["currentCanvasParentContract", "canvasContract", "contract", "CONTRACT"], ""),
      canvasScript.cacheKey
    ), "UNKNOWN");
    state.canvasReceipt = canvas.receiptName || text(getCase(canvas.receipt, ["currentCanvasParentReceipt", "canvasReceipt", "receipt", "RECEIPT"], ""), "UNKNOWN");
    state.canvasParentContractRecognized = boolText(accepted(state.canvasContract, ACCEPTED_CANVAS_CONTRACTS), "UNKNOWN");
    state.canvasNamespacePresent = boolText(Boolean(canvas.authority));

    state.hexAuthorityScriptPresent = boolText(hexAuthorityScript.present);
    state.hexAuthorityScriptSrc = hexAuthorityScript.src;
    state.hexAuthorityObserved = boolText(Boolean(hexAuthority.authority));
    state.hexAuthoritySource = hexAuthority.path;
    state.hexAuthorityContract = text(firstDefined(hexAuthority.contract, hexAuthorityScript.cacheKey), "UNKNOWN");
    state.hexAuthorityRecognized = boolText(
      state.hexAuthorityContract === EXPECTED_HEX_AUTHORITY_CONTRACT ||
      /^HEARTH_HEX_FOUR_PAIR_/i.test(state.hexAuthorityContract),
      "UNKNOWN"
    );

    state.hexSurfaceScriptPresent = boolText(hexSurfaceScript.present);
    state.hexSurfaceScriptSrc = hexSurfaceScript.src;
    state.hexSurfaceObserved = boolText(Boolean(hexSurface.authority));
    state.hexSurfaceSource = hexSurface.path;
    state.hexSurfaceContract = text(firstDefined(hexSurface.contract, hexSurfaceScript.cacheKey), "UNKNOWN");
    state.hexSurfaceRecognized = boolText(
      state.hexSurfaceContract === EXPECTED_HEX_SURFACE_CONTRACT ||
      /^HEARTH_HEX_SURFACE_/i.test(state.hexSurfaceContract),
      "UNKNOWN"
    );

    state.pointerFingerScriptPresent = boolText(pointerScript.present);
    state.pointerFingerScriptSrc = pointerScript.src;
    state.pointerFingerObserved = boolText(Boolean(pointer.authority));
    state.pointerFingerSource = pointer.path;
    state.pointerFingerContract = text(firstDefined(pointer.contract, pointerScript.cacheKey), "UNKNOWN");
    state.pointerFingerRecognized = boolText(
      state.pointerFingerContract === EXPECTED_POINTER_FINGER_CONTRACT ||
      /^HEARTH_CANVAS_FINGER_INSPECT/i.test(state.pointerFingerContract) ||
      /^HEARTH_CANVAS_FINGER_/i.test(state.pointerFingerContract),
      "UNKNOWN"
    );

    state.labWestScriptPresent = boolText(labWestScript.present);
    state.labWestScriptSrc = labWestScript.src;
    state.labWestObserved = boolText(Boolean(labWest.authority || labWestScript.present));
    state.labWestAuthoritySource = labWest.path;
    state.labWestContract = text(firstDefined(labWest.contract, labWestScript.cacheKey), "UNKNOWN");
    state.labWestReceipt = labWest.receiptName || "UNKNOWN";
    state.labWestContractRecognized = boolText(accepted(state.labWestContract, ACCEPTED_LABWEST_CONTRACTS), "UNKNOWN");

    const labWestReceipt = labWest.receipt || {};
    state.labWestReadMethod = Boolean(labWest.authority) ? "SAFE_RECEIPT_METHOD_ONLY_NO_CLASSIFY_RUN" : "NONE";
    state.labWestDecision = text(getCase(labWestReceipt, ["westDecision"], ""), "UNKNOWN");
    state.labWestGapClass = text(getCase(labWestReceipt, ["westGapClass"], ""), "UNKNOWN");
    state.labWestNorthC2Aligned = boolText(getCase(labWestReceipt, ["northC2WestAuditAligned"], "UNKNOWN"), "UNKNOWN");
    state.labWestCycleRoute = text(getCase(labWestReceipt, ["cycleRoute", "activeCycleRoute", "northActiveCycleRoute"], ""), "UNKNOWN");
    state.labWestCycleTwoSouthOutputAdmissible = boolText(getCase(labWestReceipt, ["cycleTwoSouthOutputAdmissible"], "UNKNOWN"), "UNKNOWN");
    state.labWestBishopChordAdmissible = boolText(getCase(labWestReceipt, ["bishopChordAdmissible"], "UNKNOWN"), "UNKNOWN");
    state.labWestPreReleaseCarrierAdmissible = boolText(getCase(labWestReceipt, ["preReleaseCarrierAdmissible"], "UNKNOWN"), "UNKNOWN");
    state.labWestCanvasReleaseApproved = boolText(getCase(labWestReceipt, ["westCanvasReleaseApproved", "canvasReleaseApprovedByWest"], "UNKNOWN"), "UNKNOWN");
    state.labWestReleasePacketReady = boolText(getCase(labWestReceipt, ["canvasReleasePacketReady", "releaseToCanvas"], "UNKNOWN"), "UNKNOWN");
    state.labWestRecommendedNextFile = text(getCase(labWestReceipt, ["recommendedNextFile", "recommendedNextRenewalTarget"], ""), "UNKNOWN");
    state.labWestPostgameStatus = text(getCase(labWestReceipt, ["postgameStatus"], ""), "UNKNOWN");

    if (labWest.authority && state.labWestContractRecognized === "true") {
      state.labWestDiagnosticTrackConnectionStatus = "CONNECTED_SAFE_RECEIPT_READ";
      addNote(state, "LABWEST_OBSERVED_AND_CONNECTED_TO_WEST_DIAGNOSTIC_READ");
    } else if (labWestScript.present && !labWest.authority) {
      state.labWestDiagnosticTrackConnectionStatus = "SCRIPT_PRESENT_AUTHORITY_NOT_OBSERVED";
      addNote(state, "LABWEST_SCRIPT_PRESENT_AUTHORITY_NOT_OBSERVED");
    } else {
      state.labWestDiagnosticTrackConnectionStatus = "NOT_CONNECTED_TO_WEST_DIAGNOSTIC_READ";
      addNote(state, "LABWEST_NOT_OBSERVED_BY_WEST_DIAGNOSTIC_READ");
    }

    if (state.canvasScriptPresent !== "true") addNote(state, "CANVAS_SCRIPT_NOT_PRESENT_IN_RENDERED_TARGET_DOCUMENT");
    if (state.controlFileStatus === "EXPECTED_NOT_YET_BUILT") addNote(state, "WEST_CONTROL_FILE_EXPECTED_NOT_YET_BUILT");
  }

  function readDomSurface(targetDocument, targetWindow, state) {
    const stage = qFirst(targetDocument, STAGE_SELECTORS);
    const mount = qFirst(targetDocument, MOUNT_SELECTORS);
    const canvas = qFirst(targetDocument, CANVAS_SELECTORS);
    const expressionSurface = qFirst(targetDocument, EXPRESSION_SURFACE_SELECTORS);

    const stageNonzero = rectNonZero(stage);
    const mountNonzero = rectNonZero(mount);
    const canvasNonzero = Boolean(canvas && ((Number(canvas.width || 0) > 0 && Number(canvas.height || 0) > 0) || rectNonZero(canvas)));
    const expressionNonzero = rectNonZero(expressionSurface);

    state.planetStagePresent = boolText(Boolean(stage));
    state.planetStageSelector = selectorName(stage);
    state.planetStageRect = rectPacket(stage);
    state.planetStageRectNonzero = boolText(stageNonzero);

    state.canvasMountPresent = boolText(Boolean(mount));
    state.canvasMountSelector = selectorName(mount);
    state.canvasMountRect = rectPacket(mount);
    state.canvasMountRectNonzero = boolText(mountNonzero);

    state.canvasElementPresent = boolText(Boolean(canvas));
    state.canvasElementFound = boolText(Boolean(canvas));
    state.canvasElementSelector = selectorName(canvas);
    state.canvasRect = rectPacket(canvas);
    state.canvasRectNonzero = boolText(canvasNonzero);
    state.canvasInMount = boolText(Boolean(canvas && mount && mount.contains(canvas)));
    state.canvasViewportIntersecting = boolText(viewportIntersecting(canvas || mount || stage, targetWindow));

    try {
      const styleOwner = canvas && canvas.ownerDocument && canvas.ownerDocument.defaultView
        ? canvas.ownerDocument.defaultView
        : targetWindow || root;
      const style = canvas && styleOwner && isFunction(styleOwner.getComputedStyle)
        ? styleOwner.getComputedStyle(canvas)
        : null;
      state.canvasComputedVisible = boolText(Boolean(
        canvas &&
        style &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 1) !== 0
      ));
    } catch (_error) {
      state.canvasComputedVisible = "UNKNOWN";
    }

    state.canvasContext2dReady = boolText(Boolean(canvas && isFunction(canvas.getContext) && canvas.getContext("2d")));

    state.expressionSurfacePresent = boolText(Boolean(expressionSurface));
    state.expressionSurfaceSelector = selectorName(expressionSurface);
    state.expressionSurfaceRect = rectPacket(expressionSurface);
    state.expressionSurfaceRectNonzero = boolText(expressionNonzero);

    state.canvasNamespaceMatchesDomSurface = boolText(
      state.canvasNamespacePresent === "true" &&
      (canvasNonzero || expressionNonzero),
      "UNKNOWN"
    );

    if (stageNonzero) addNote(state, "PLANET_STAGE_NONZERO_DOM_PROOF");
    if (mountNonzero) addNote(state, "CANVAS_MOUNT_NONZERO_DOM_PROOF");
    if (canvasNonzero) addNote(state, "CANVAS_ELEMENT_NONZERO_DOM_PROOF");
    if (expressionNonzero) addNote(state, "EXPRESSION_SURFACE_NONZERO_DOM_PROOF");

    readPixelSample(canvas, state);
  }

  function buildDelegatoryCycle(state) {
    const routeObserved = state.routeConductorAuthorityObserved === "true" || state.routeConductorScriptPresent === "true";
    const controlsObserved = state.controlAuthorityObserved === "true" || state.controlScriptPresent === "true";
    const canvasObserved =
      state.canvasAuthorityObserved === "true" ||
      state.canvasScriptPresent === "true" ||
      state.canvasElementFound === "true";
    const hexObserved =
      state.hexAuthorityObserved === "true" ||
      state.hexSurfaceObserved === "true" ||
      state.hexAuthorityScriptPresent === "true" ||
      state.hexSurfaceScriptPresent === "true";
    const pointerObserved = state.pointerFingerObserved === "true" || state.pointerFingerScriptPresent === "true";

    const relationship = (
      id,
      from,
      to,
      fromObserved,
      toObserved,
      requiredForMotion,
      requiredForVisibleSurface,
      grant
    ) => {
      const requestObserved = Boolean(fromObserved);
      const grantObserved = Boolean(grant);
      const permissionGranted = Boolean(requestObserved && toObserved && grantObserved);

      return {
        id,
        from,
        to,
        requestObserved,
        grantObserved,
        returnObserved: permissionGranted && /CONTROLS_TO_CANVAS/.test(id),
        endpointPermissionGranted: Boolean(fromObserved && toObserved),
        requestPermissionGranted: requestObserved,
        receiverPermissionGranted: Boolean(toObserved && grantObserved),
        returnPortPermissionGranted: permissionGranted,
        relationshipPermissionGranted: permissionGranted,
        requiredForMotion,
        requiredForVisibleSurface,
        relationshipStatus: permissionGranted
          ? "HANDSHAKE_PERMISSION_CONFIRMED_WITH_RETURN_PORT"
          : requestObserved
            ? "REQUEST_OBSERVED_GRANT_NOT_CONFIRMED"
            : "REQUEST_NOT_OBSERVED",
        varianceClass: permissionGranted
          ? "HANDSHAKE_COMPLETE"
          : requestObserved
            ? "REQUEST_OBSERVED_GRANT_NOT_CONFIRMED"
            : "REQUEST_MISSING",
        ...NO_CLAIMS
      };
    };

    const relationships = [
      relationship(
        "ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE",
        "ROUTE_CONDUCTOR",
        "CONTROLS_QUEEN",
        routeObserved,
        controlsObserved,
        true,
        false,
        controlsObserved && state.controlHandshakeStatus !== "EXPECTED_NOT_YET_WIRED"
      ),
      relationship(
        "ROUTE_TO_CANVAS_GOVERNED_SOURCE_HANDSHAKE",
        "ROUTE_CONDUCTOR",
        "CANVAS_PUBLIC_RECEIVER",
        routeObserved,
        canvasObserved,
        false,
        true,
        state.canvasParentContractRecognized === "true" || state.canvasAuthorityObserved === "true"
      ),
      relationship(
        "CONTROLS_TO_CANVAS_VIEW_DELTA_HANDSHAKE",
        "CONTROLS_QUEEN",
        "CANVAS_PUBLIC_RECEIVER",
        controlsObserved,
        canvasObserved,
        true,
        false,
        controlsObserved && canvasObserved
      ),
      relationship(
        "CANVAS_TO_HEX_SURFACE_EXPRESSION_GATE",
        "CANVAS_PUBLIC_RECEIVER",
        "HEX_GATE_SURFACE",
        canvasObserved,
        hexObserved,
        true,
        true,
        state.hexSurfaceRecognized === "true" || state.hexSurfaceObserved === "true"
      ),
      relationship(
        "HEX_SURFACE_TO_POINTER_FINGER_HANDOFF",
        "HEX_GATE_SURFACE",
        "POINTER_FINGER",
        hexObserved,
        pointerObserved,
        false,
        false,
        pointerObserved && (state.pointerFingerRecognized === "true" || state.pointerFingerObserved === "true")
      ),
      relationship(
        "POINTER_FINGER_TO_CANVAS_PUBLIC_RECEIVER_ARTIFACT_RETURN",
        "POINTER_FINGER",
        "CANVAS_PUBLIC_RECEIVER",
        pointerObserved,
        canvasObserved,
        false,
        true,
        pointerObserved && canvasObserved
      )
    ];

    state.delegatoryRelationships = relationships;

    const grantedCount = relationships.filter((item) => item.relationshipPermissionGranted).length;
    const firstGap = relationships.find((item) => !item.relationshipPermissionGranted);

    state.productionCycleObserved = boolText(Boolean(routeObserved || controlsObserved || canvasObserved || hexObserved || pointerObserved));
    state.productionCycleStatus =
      grantedCount === relationships.length
        ? "PRODUCTION_CYCLE_COMPLETE_ROUTE_CONTROLS_CANVAS_HEX_POINTER_CANVAS"
        : grantedCount > 0
          ? "PRODUCTION_CYCLE_PARTIAL"
          : "PRODUCTION_CYCLE_NOT_CONFIRMED";

    state.productionCycleFirstGap = firstGap ? firstGap.id : "NONE";

    state.threeFileConstructStrategy = {
      strategyName: "ROUTE_CONTROLS_CANVAS_HEX_SURFACE_POINTER_CYCLE_STRATEGY_v8",
      routeConductorActiveScanAuthority: true,
      controlsRemainMotionAndInputGatewayAuthority: true,
      canvasRemainsPublicReceiverAndPresentationSurfaceAuthority: true,
      hexSurfaceRemainsDownstreamGateAuthority: true,
      pointerFingerRemainsDownstreamExpressionAuthority: true,
      artifactReturnsToCanvasPublicReceiver: true,
      canvasDoesNotOwnSourceTruth: true,
      controlsDoNotOwnCanvasDrawing: true,
      routeDoesNotOwnCanvasDrawing: true,
      labWestObserved: state.labWestObserved === "true",
      labWestConnectionStatus: state.labWestDiagnosticTrackConnectionStatus,
      productionCycleStatus: state.productionCycleStatus,
      productionCycleFirstGap: state.productionCycleFirstGap,
      relationshipGrantedCount: grantedCount,
      relationshipTotalCount: relationships.length,
      recommendedConstructAction: firstGap
        ? "CONFIRM_RELATIONSHIP_PERMISSION_REQUEST_AND_GRANT_SIGNALS"
        : "VERIFY_CANVAS_SURFACE_TRUTH_AND_PIXEL_VISIBILITY"
    };
  }

  function deriveCanvasSurfaceTruth(state) {
    const canvasDomReady = state.canvasElementFound === "true" && state.canvasRectNonzero === "true";
    const contextReady = state.canvasContext2dReady === "true";
    const pixelVisible = state.canvasPixelVisible === "true";
    const canvasScriptPresent = state.canvasScriptPresent === "true";
    const canvasNamespacePresent = state.canvasNamespacePresent === "true";

    state.canvasSurfaceTruthAvailable = boolText(Boolean(canvasDomReady || contextReady || canvasNamespacePresent));

    if (!canvasScriptPresent) {
      state.canvasSurfaceTruthStatus = "FAILED";
      state.canvasSurfaceTruthFirstFailedCoordinate = "CANVAS_SCRIPT_PRESENT";
      state.canvasSurfaceTruthFailureClass = "CANVAS_SCRIPT_NOT_PRESENT";
      state.canvasSurfaceTruthFailureReason = "TARGET_DOCUMENT_DOES_NOT_CONTAIN_THE_CANVAS_SCRIPT";
      state.canvasSurfaceTruthRecommendedOwner = "CANVAS_LOAD_CHAIN_OR_ROUTE_CONDUCTOR";
      state.canvasSurfaceTruthRecommendedFile = CANVAS_FILE;
      state.canvasSurfaceTruthRecommendedAction = "VERIFY_THE_TARGET_ROUTE_LOADS_ASSET_CANVAS_FILE";
      return;
    }

    if (!canvasNamespacePresent) {
      state.canvasSurfaceTruthStatus = "PARTIAL";
      state.canvasSurfaceTruthFirstFailedCoordinate = "CANVAS_NAMESPACE_PRESENT";
      state.canvasSurfaceTruthFailureClass = "CANVAS_NAMESPACE_NOT_OBSERVED";
      state.canvasSurfaceTruthFailureReason = "CANVAS_SCRIPT_PRESENT_BUT_PUBLIC_RECEIVER_NAMESPACE_NOT_OBSERVED";
      state.canvasSurfaceTruthRecommendedOwner = "CANVAS_PUBLIC_RECEIVER";
      state.canvasSurfaceTruthRecommendedFile = CANVAS_FILE;
      state.canvasSurfaceTruthRecommendedAction = "CONFIRM_PUBLIC_RECEIVER_ALIAS_PUBLICATION";
      return;
    }

    if (!canvasDomReady) {
      state.canvasSurfaceTruthStatus = "PARTIAL";
      state.canvasSurfaceTruthFirstFailedCoordinate = "CANVAS_DOM_SURFACE_NONZERO";
      state.canvasSurfaceTruthFailureClass = "CANVAS_DOM_SURFACE_NOT_CONFIRMED";
      state.canvasSurfaceTruthFailureReason = "CANVAS_NAMESPACE_PRESENT_BUT_DOM_CANVAS_NONZERO_NOT_CONFIRMED";
      state.canvasSurfaceTruthRecommendedOwner = "CANVAS_PUBLIC_RECEIVER";
      state.canvasSurfaceTruthRecommendedFile = CANVAS_FILE;
      state.canvasSurfaceTruthRecommendedAction = "CONFIRM_CANVAS_PUBLIC_RECEIVER_MOUNTS_VISIBLE_DOM_SURFACE";
      return;
    }

    if (!pixelVisible) {
      state.canvasSurfaceTruthStatus = "PARTIAL";
      state.canvasSurfaceTruthFirstFailedCoordinate = "CANVAS_PIXEL_VISIBLE";
      state.canvasSurfaceTruthFailureClass = "PIXEL_EMPTY_OR_TRANSPARENT";
      state.canvasSurfaceTruthFailureReason = "CANVAS_ELEMENT_AND_CONTEXT_EXIST_BUT_PIXEL_SAMPLE_IS_NOT_VISIBLE";
      state.canvasSurfaceTruthRecommendedOwner = "CANVAS_PUBLIC_RECEIVER";
      state.canvasSurfaceTruthRecommendedFile = CANVAS_FILE;
      state.canvasSurfaceTruthRecommendedAction = "CONFIRM_CANVAS_RENDER_LOOP_PAINTS_VISIBLE_PIXEL_SURFACE";
      return;
    }

    state.canvasSurfaceTruthStatus = "PASS";
    state.canvasSurfaceTruthFirstFailedCoordinate = "NONE";
    state.canvasSurfaceTruthFailureClass = "NONE";
    state.canvasSurfaceTruthFailureReason = "CANVAS_SCRIPT_NAMESPACE_DOM_CONTEXT_AND_PIXEL_SURFACE_CONFIRMED";
    state.canvasSurfaceTruthRecommendedOwner = "NONE";
    state.canvasSurfaceTruthRecommendedFile = "NONE";
    state.canvasSurfaceTruthRecommendedAction = "NONE";
  }

  function deriveRenderedProof(state) {
    const stageMountReady = state.planetStageRectNonzero === "true" && state.canvasMountRectNonzero === "true";
    const domCanvasReady = state.canvasElementFound === "true" && state.canvasRectNonzero === "true";
    const expressionSurfaceReady = state.expressionSurfacePresent === "true" && state.expressionSurfaceRectNonzero === "true";
    const pixelReady = state.canvasPixelVisible === "true";
    const routeProof = state.routeConductorAuthorityObserved === "true" || state.routeConductorContractRecognized === "true";
    const labWestProof = state.labWestDiagnosticTrackConnectionStatus === "CONNECTED_SAFE_RECEIPT_READ";
    const canvasNamespaceProof = state.canvasNamespacePresent === "true";

    const surfaceReady = Boolean(domCanvasReady || expressionSurfaceReady || pixelReady || canvasNamespaceProof);
    const richnessReady = Boolean(pixelReady || state.canvasParentContractRecognized === "true" || state.productionCycleStatus !== "PRODUCTION_CYCLE_NOT_CONFIRMED");

    state.canvasExpressionSurfaceReady = boolText(surfaceReady);
    state.canvasExpressionRichnessReady = boolText(richnessReady);

    if (surfaceReady && richnessReady) {
      state.canvasExpressionProofStatus = "ACTIVE";
      state.canvasExpressionBottleneckClass = "EXPRESSION_SURFACE_AND_NAMESPACE_OR_PIXEL_VARIANCE_PRESENT";
    } else if (surfaceReady) {
      state.canvasExpressionProofStatus = "ACTIVE_DEGRADED";
      state.canvasExpressionBottleneckClass =
        state.canvasScriptPresent !== "true"
          ? "DOM_SURFACE_PRESENT_BUT_CANVAS_SCRIPT_NOT_PRESENT"
          : "EXPRESSION_SURFACE_PRESENT_DEGRADED_OR_OPAQUE_NAMESPACE";
    } else if (stageMountReady) {
      state.canvasExpressionProofStatus = "HANDSHAKE_PENDING";
      state.canvasExpressionBottleneckClass = "STAGE_AND_MOUNT_PRESENT_EXPRESSION_SURFACE_NOT_PROVEN";
    } else {
      state.canvasExpressionProofStatus = "EXPECTED_NOT_YET_WIRED";
      state.canvasExpressionBottleneckClass = "NO_STAGE_MOUNT_CANVAS_OR_EXPRESSION_SURFACE_PROVEN";
    }

    const inspected = Boolean(stageMountReady || surfaceReady || routeProof || labWestProof);
    const ready = Boolean(
      pixelReady ||
      (domCanvasReady && expressionSurfaceReady) ||
      (surfaceReady && routeProof) ||
      (stageMountReady && routeProof) ||
      (stageMountReady && labWestProof) ||
      (stageMountReady && state.productionCycleObserved === "true")
    );

    state.renderedPlanetProofInspected = boolText(inspected);
    state.renderedPlanetProofReady = boolText(ready);
    state.renderedPlanetProofFullyInspected = boolText(inspected);
    state.westRenderedProofSpreadComplete = boolText(inspected || ready);
    state.visiblePlanetProofReady = boolText(ready);
    state.visiblePlanetProofSource = ready
      ? pixelReady
        ? "CANVAS_PIXEL_VISIBLE"
        : domCanvasReady && expressionSurfaceReady
          ? "DOM_STAGE_MOUNT_CANVAS_EXPRESSION_SURFACE_NONZERO"
          : surfaceReady && routeProof
            ? "DOM_SURFACE_AND_ROUTE_CONDUCTOR_RENDERED_PROOF"
            : stageMountReady && labWestProof
              ? "STAGE_MOUNT_AND_LABWEST_TRACK_CONNECTED"
              : "RENDERED_TARGET_COMPOSITE_PROOF"
      : inspected
        ? "RENDERED_PROOF_INSPECTED_NOT_READY"
        : "UNKNOWN";

    if (ready) addNote(state, `RENDERED_PLANET_PROOF_READY:${state.visiblePlanetProofSource}`);
    if (inspected) addNote(state, "WEST_RENDERED_PROOF_SPREAD_COMPLETE");
  }

  function deriveAlignment(state) {
    let newsScore = 0;
    let fibScore = 0;
    let newsFailed = "NONE";
    let fibFailed = "NONE";

    const newsChecks = [
      ["ROUTE_CONDUCTOR", state.routeConductorScriptPresent === "true" || state.routeConductorAuthorityObserved === "true"],
      ["CONTROLS_QUEEN", state.controlScriptPresent === "true" || state.controlAuthorityObserved === "true"],
      ["CANVAS_PUBLIC_RECEIVER", state.canvasScriptPresent === "true" || state.canvasAuthorityObserved === "true" || state.canvasElementFound === "true"],
      ["HEX_GATE_SURFACE", state.hexSurfaceScriptPresent === "true" || state.hexSurfaceObserved === "true"],
      ["POINTER_FINGER", state.pointerFingerScriptPresent === "true" || state.pointerFingerObserved === "true"],
      ["CANVAS_ARTIFACT_RETURN", state.canvasElementFound === "true" && state.canvasRectNonzero === "true"]
    ];

    const fibChecks = [
      ["F1:ROUTE", newsChecks[0][1]],
      ["F2:CONTROLS", newsChecks[1][1]],
      ["F3:CANVAS_PUBLIC_RECEIVER", newsChecks[2][1]],
      ["F5:HEX_AUTHORITY_OR_SURFACE", state.hexAuthorityObserved === "true" || state.hexSurfaceObserved === "true" || state.hexSurfaceScriptPresent === "true"],
      ["F8:POINTER_FINGER", newsChecks[4][1]],
      ["F13:CANVAS_ARTIFACT_RETURN", newsChecks[5][1]],
      ["F21:PIXEL_VISIBLE_NO_FINAL_CLAIM", state.canvasPixelVisible === "true"]
    ];

    newsChecks.forEach(([name, pass]) => {
      if (pass) newsScore += 1;
      else if (newsFailed === "NONE") newsFailed = name;
    });

    fibChecks.forEach(([name, pass]) => {
      if (pass) fibScore += 1;
      else if (fibFailed === "NONE") fibFailed = name;
    });

    const newsPct = Math.round((newsScore / newsChecks.length) * 100);
    const fibPct = Math.round((fibScore / fibChecks.length) * 100);

    state.canvasStandardNewsAlignmentScore = String(newsPct);
    state.canvasStandardNewsAlignmentStatus = newsPct === 100
      ? "CANVAS_STANDARD_NEWS_ALIGNMENT_COMPLETE"
      : newsPct > 0
        ? "CANVAS_STANDARD_NEWS_ALIGNMENT_PARTIAL"
        : "CANVAS_STANDARD_NEWS_ALIGNMENT_NOT_CONFIRMED";
    state.canvasStandardNewsAlignmentFirstFailedStage = newsFailed;

    state.canvasStandardFibonacciSynchronizationScore = String(fibPct);
    state.canvasStandardFibonacciSynchronizationStatus = fibPct === 100
      ? "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_COMPLETE"
      : fibPct > 0
        ? "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_PARTIAL"
        : "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_NOT_CONFIRMED";
    state.canvasStandardFibonacciSynchronizationFirstFailedStage = fibFailed;
  }

  function deriveRecommendation(state) {
    if (state.canvasSurfaceTruthStatus === "FAILED") {
      state.primaryCaseCandidate = "CANVAS_SURFACE_TRUTH_FAILURE";
      state.recommendedNextOwner = state.canvasSurfaceTruthRecommendedOwner;
      state.recommendedNextFile = state.canvasSurfaceTruthRecommendedFile;
      state.recommendedNextAction = state.canvasSurfaceTruthRecommendedAction;
      return;
    }

    if (state.labWestDiagnosticTrackConnectionStatus !== "CONNECTED_SAFE_RECEIPT_READ") {
      state.primaryCaseCandidate = "LABWEST_DIAGNOSTIC_TRACK_CONNECTION_PARTIAL";
      state.recommendedNextOwner = "LABWEST_OR_DIAGNOSTIC_WEST_BRIDGE";
      state.recommendedNextFile = LABWEST_FILE;
      state.recommendedNextAction = "VERIFY_LABWEST_SCRIPT_AND_PUBLIC_RECEIPT_ALIASES_ARE_VISIBLE_TO_DIAGNOSTIC_WEST";
      return;
    }

    if (state.productionCycleStatus !== "PRODUCTION_CYCLE_COMPLETE_ROUTE_CONTROLS_CANVAS_HEX_POINTER_CANVAS") {
      state.primaryCaseCandidate = "PRODUCTION_CYCLE_PERMISSION_PARTIAL";
      state.recommendedNextOwner = "CYCLE_RELATIONSHIP_OWNER";
      state.recommendedNextFile = state.productionCycleFirstGap.includes("CONTROLS")
        ? CONTROL_FILE
        : state.productionCycleFirstGap.includes("HEX")
          ? HEX_SURFACE_FILE
          : state.productionCycleFirstGap.includes("POINTER")
            ? POINTER_FINGER_FILE
            : ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "CONFIRM_RELATIONSHIP_PERMISSION_REQUEST_AND_GRANT_SIGNALS";
      return;
    }

    state.primaryCaseCandidate = "RENDERED_TARGET_EVIDENCE_COMPLETE";
    state.recommendedNextOwner = "NORTH_FINAL_ARBITRATION";
    state.recommendedNextFile = "NONE";
    state.recommendedNextAction = "ALLOW_NORTH_TO_SELECT_FINAL_PRIMARY_CASE";
  }

  function makeEvidencePacket(state) {
    return {
      WEST_STATUS: state.westStatus,
      WEST_CONTRACT: CONTRACT,
      WEST_RECEIPT: RECEIPT,
      WEST_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      WEST_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      WEST_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      WEST_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_IMPLEMENTATION_CONTRACT,
      WEST_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_IMPLEMENTATION_CONTRACT,
      WEST_VERSION: VERSION,
      WEST_FILE: FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      WEST_RENDERED_READ_COMPLETE: state.westRenderedReadComplete,
      WEST_RENDERED_READ_STATUS: state.westRenderedReadStatus,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: state.diagnosticTargetAccessStatus,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: state.diagnosticTargetAccessError,
      TARGET_SOURCE: state.targetSource,
      HEARTH_TARGET_CONFIRMED: state.hearthTargetConfirmed,

      HTML_FILE,
      INDEX_FILE,
      ROUTE_CONDUCTOR_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      POINTER_FINGER_FILE,
      LABWEST_FILE,

      CURRENT_HTML_CONTRACT,
      CURRENT_INDEX_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_HEX_AUTHORITY_CONTRACT,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_POINTER_FINGER_CONTRACT,

      RENDERED_HTML_CONTRACT: state.renderedHtmlContract,
      RENDERED_HTML_CONTRACT_RECOGNIZED: state.renderedHtmlContractRecognized,
      RENDERED_INDEX_JS_SCRIPT_PRESENT: state.renderedIndexScriptPresent,
      RENDERED_INDEX_JS_SCRIPT_SRC: state.renderedIndexScriptSrc,
      RENDERED_INDEX_JS_CONTRACT: state.renderedIndexContract,
      RENDERED_INDEX_JS_CONTRACT_RECOGNIZED: state.renderedIndexContractRecognized,

      ROUTE_CONDUCTOR_SCRIPT_PRESENT: state.routeConductorScriptPresent,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY: state.routeConductorScriptCacheKey,
      ROUTE_CONDUCTOR_AUTHORITY_OBSERVED: state.routeConductorAuthorityObserved,
      ROUTE_CONDUCTOR_AUTHORITY_SOURCE: state.routeConductorAuthoritySource,
      ROUTE_CONDUCTOR_CONTRACT: state.routeConductorContract,
      ROUTE_CONDUCTOR_RECEIPT: state.routeConductorReceipt,
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: state.routeConductorContractRecognized,

      CONTROL_SCRIPT_PRESENT: state.controlScriptPresent,
      CONTROL_SCRIPT_SRC: state.controlScriptSrc,
      CONTROL_AUTHORITY_OBSERVED: state.controlAuthorityObserved,
      CONTROL_AUTHORITY_SOURCE: state.controlAuthoritySource,
      CONTROL_CONTRACT: state.controlContract,
      CONTROL_RECEIPT: state.controlReceipt,
      CONTROL_CONTRACT_RECOGNIZED: state.controlContractRecognized,
      CONTROL_FILE_STATUS: state.controlFileStatus,
      CONTROL_HANDSHAKE_STATUS: state.controlHandshakeStatus,
      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      DRAG_STATUS: state.dragStatus,
      VIEW_CONTROL_STATUS: state.viewControlStatus,

      CANVAS_SCRIPT_PRESENT: state.canvasScriptPresent,
      CANVAS_SCRIPT_SRC: state.canvasScriptSrc,
      CANVAS_AUTHORITY_OBSERVED: state.canvasAuthorityObserved,
      CANVAS_AUTHORITY_SOURCE: state.canvasAuthoritySource,
      CANVAS_CONTRACT: state.canvasContract,
      CANVAS_RECEIPT: state.canvasReceipt,
      CURRENT_CANVAS_PARENT_CONTRACT: state.canvasContract,
      CURRENT_CANVAS_PARENT_RECOGNIZED: state.canvasParentContractRecognized,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: state.canvasParentContractRecognized,
      CANVAS_NAMESPACE_PRESENT: state.canvasNamespacePresent,
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: state.canvasNamespaceMatchesDomSurface,

      HEX_AUTHORITY_SCRIPT_PRESENT: state.hexAuthorityScriptPresent,
      HEX_AUTHORITY_SCRIPT_SRC: state.hexAuthorityScriptSrc,
      HEX_AUTHORITY_OBSERVED: state.hexAuthorityObserved,
      HEX_AUTHORITY_SOURCE: state.hexAuthoritySource,
      HEX_AUTHORITY_CONTRACT: state.hexAuthorityContract,
      HEX_AUTHORITY_RECOGNIZED: state.hexAuthorityRecognized,

      HEX_SURFACE_SCRIPT_PRESENT: state.hexSurfaceScriptPresent,
      HEX_SURFACE_SCRIPT_SRC: state.hexSurfaceScriptSrc,
      HEX_SURFACE_OBSERVED: state.hexSurfaceObserved,
      HEX_SURFACE_SOURCE: state.hexSurfaceSource,
      HEX_SURFACE_CONTRACT: state.hexSurfaceContract,
      HEX_SURFACE_RECOGNIZED: state.hexSurfaceRecognized,

      POINTER_FINGER_SCRIPT_PRESENT: state.pointerFingerScriptPresent,
      POINTER_FINGER_SCRIPT_SRC: state.pointerFingerScriptSrc,
      POINTER_FINGER_OBSERVED: state.pointerFingerObserved,
      POINTER_FINGER_SOURCE: state.pointerFingerSource,
      POINTER_FINGER_CONTRACT: state.pointerFingerContract,
      POINTER_FINGER_RECOGNIZED: state.pointerFingerRecognized,

      LABWEST_SCRIPT_PRESENT: state.labWestScriptPresent,
      LABWEST_SCRIPT_SRC: state.labWestScriptSrc,
      LABWEST_OBSERVED: state.labWestObserved,
      LABWEST_AUTHORITY_SOURCE: state.labWestAuthoritySource,
      LABWEST_CONTRACT: state.labWestContract,
      LABWEST_RECEIPT: state.labWestReceipt,
      LABWEST_CONTRACT_RECOGNIZED: state.labWestContractRecognized,
      LABWEST_READ_METHOD: state.labWestReadMethod,
      LABWEST_DECISION: state.labWestDecision,
      LABWEST_GAP_CLASS: state.labWestGapClass,
      LABWEST_NORTH_C2_ALIGNED: state.labWestNorthC2Aligned,
      LABWEST_CYCLE_ROUTE: state.labWestCycleRoute,
      LABWEST_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBLE: state.labWestCycleTwoSouthOutputAdmissible,
      LABWEST_BISHOP_CHORD_ADMISSIBLE: state.labWestBishopChordAdmissible,
      LABWEST_PRE_RELEASE_CARRIER_ADMISSIBLE: state.labWestPreReleaseCarrierAdmissible,
      LABWEST_CANVAS_RELEASE_APPROVED: state.labWestCanvasReleaseApproved,
      LABWEST_RELEASE_PACKET_READY: state.labWestReleasePacketReady,
      LABWEST_RECOMMENDED_NEXT_FILE: state.labWestRecommendedNextFile,
      LABWEST_POSTGAME_STATUS: state.labWestPostgameStatus,
      LABWEST_DIAGNOSTIC_TRACK_CONNECTION_STATUS: state.labWestDiagnosticTrackConnectionStatus,

      PLANET_STAGE_PRESENT: state.planetStagePresent,
      PLANET_STAGE_SELECTOR: state.planetStageSelector,
      PLANET_STAGE_RECT: state.planetStageRect,
      PLANET_STAGE_RECT_NONZERO: state.planetStageRectNonzero,
      CANVAS_MOUNT_PRESENT: state.canvasMountPresent,
      CANVAS_MOUNT_SELECTOR: state.canvasMountSelector,
      CANVAS_MOUNT_RECT: state.canvasMountRect,
      CANVAS_MOUNT_RECT_NONZERO: state.canvasMountRectNonzero,
      CANVAS_ELEMENT_PRESENT: state.canvasElementPresent,
      CANVAS_ELEMENT_FOUND: state.canvasElementFound,
      CANVAS_ELEMENT_SELECTOR: state.canvasElementSelector,
      CANVAS_RECT: state.canvasRect,
      CANVAS_RECT_NONZERO: state.canvasRectNonzero,
      CANVAS_IN_MOUNT: state.canvasInMount,
      CANVAS_COMPUTED_VISIBLE: state.canvasComputedVisible,
      CANVAS_VIEWPORT_INTERSECTING: state.canvasViewportIntersecting,
      CANVAS_CONTEXT_2D_READY: state.canvasContext2dReady,
      EXPRESSION_SURFACE_PRESENT: state.expressionSurfacePresent,
      EXPRESSION_SURFACE_SELECTOR: state.expressionSurfaceSelector,
      EXPRESSION_SURFACE_RECT: state.expressionSurfaceRect,
      EXPRESSION_SURFACE_RECT_NONZERO: state.expressionSurfaceRectNonzero,

      CANVAS_PIXEL_SAMPLE_STATUS: state.canvasPixelSampleStatus,
      CANVAS_PIXEL_SAMPLE_READABLE: state.canvasPixelSampleReadable,
      CANVAS_PIXEL_VISIBLE: state.canvasPixelVisible,
      CANVAS_PIXEL_NONEMPTY: state.canvasPixelNonEmpty,
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: state.canvasPixelUniqueColorCount,
      CANVAS_PIXEL_LUMINANCE_RANGE: state.canvasPixelLuminanceRange,
      CANVAS_PIXEL_VARIANCE_STATUS: state.canvasPixelVarianceStatus,

      CANVAS_SURFACE_TRUTH_STATUS: state.canvasSurfaceTruthStatus,
      CANVAS_SURFACE_TRUTH_AVAILABLE: state.canvasSurfaceTruthAvailable,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: state.canvasSurfaceTruthFirstFailedCoordinate,
      CANVAS_TRUTH_FAILURE_CLASS: state.canvasSurfaceTruthFailureClass,
      CANVAS_TRUTH_FAILURE_REASON: state.canvasSurfaceTruthFailureReason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: state.canvasSurfaceTruthRecommendedOwner,
      CANVAS_TRUTH_RECOMMENDED_FILE: state.canvasSurfaceTruthRecommendedFile,
      CANVAS_TRUTH_RECOMMENDED_ACTION: state.canvasSurfaceTruthRecommendedAction,

      CANVAS_EXPRESSION_SURFACE_READY: state.canvasExpressionSurfaceReady,
      CANVAS_EXPRESSION_RICHNESS_READY: state.canvasExpressionRichnessReady,
      CANVAS_EXPRESSION_PROOF_STATUS: state.canvasExpressionProofStatus,
      CANVAS_EXPRESSION_BOTTLENECK_CLASS: state.canvasExpressionBottleneckClass,
      RENDERED_PLANET_PROOF_INSPECTED: state.renderedPlanetProofInspected,
      RENDERED_PLANET_PROOF_READY: state.renderedPlanetProofReady,
      RENDERED_PLANET_PROOF_FULLY_INSPECTED: state.renderedPlanetProofFullyInspected,
      WEST_RENDERED_PROOF_SPREAD_COMPLETE: state.westRenderedProofSpreadComplete,
      VISIBLE_PLANET_PROOF_READY: state.visiblePlanetProofReady,
      VISIBLE_PLANET_PROOF_SOURCE: state.visiblePlanetProofSource,

      PRODUCTION_CYCLE_OBSERVED: state.productionCycleObserved,
      PRODUCTION_CYCLE_STATUS: state.productionCycleStatus,
      PRODUCTION_CYCLE_FIRST_GAP: state.productionCycleFirstGap,
      DELEGATORY_RELATIONSHIPS: clonePlain(state.delegatoryRelationships),
      THREE_FILE_CONSTRUCT_STRATEGY: clonePlain(state.threeFileConstructStrategy),

      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_STATUS: state.diagnosticTrackNewsAlignmentStatus,
      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_SCORE: state.diagnosticTrackNewsAlignmentScore,
      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_FIRST_FAILED_STAGE: state.diagnosticTrackNewsAlignmentFirstFailedStage,
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_STATUS: state.diagnosticTrackFibonacciSynchronizationStatus,
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_SCORE: state.diagnosticTrackFibonacciSynchronizationScore,
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: state.diagnosticTrackFibonacciSynchronizationFirstFailedStage,
      CANVAS_STANDARD_NEWS_ALIGNMENT_STATUS: state.canvasStandardNewsAlignmentStatus,
      CANVAS_STANDARD_NEWS_ALIGNMENT_SCORE: state.canvasStandardNewsAlignmentScore,
      CANVAS_STANDARD_NEWS_ALIGNMENT_FIRST_FAILED_STAGE: state.canvasStandardNewsAlignmentFirstFailedStage,
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_STATUS: state.canvasStandardFibonacciSynchronizationStatus,
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_SCORE: state.canvasStandardFibonacciSynchronizationScore,
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: state.canvasStandardFibonacciSynchronizationFirstFailedStage,

      PRIMARY_CASE_CANDIDATE: state.primaryCaseCandidate,
      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      WEST_SECONDARY_EVIDENCE_NOTES: state.notes.length ? state.notes.join(" | ") : "none",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,

      updatedAt: state.updatedAt
    };
  }

  function runWestRenderedRead(options = {}) {
    const state = makeState();
    state.westStatus = "RUNNING";
    state.westRenderedReadStatus = "RUNNING";
    state.updatedAt = nowIso();

    try {
      const target = resolveTarget(options, state);
      state.targetSource = target.source || "NONE";

      if (!target.targetDocument || !target.targetWindow) {
        state.diagnosticTargetAccessStatus = "SOURCE_ONLY";
        state.diagnosticTargetAccessError = "NO_RENDERED_HEARTH_TARGET_DOCUMENT_WINDOW_OR_FRAME";
        state.hearthTargetConfirmed = false;
        state.westStatus = "PARTIAL";
        state.westRenderedReadComplete = "false";
        state.westRenderedReadStatus = "PARTIAL";
        state.renderedPlanetProofReady = "false";
        state.renderedPlanetProofInspected = "false";
        state.visiblePlanetProofReady = "false";
        state.visiblePlanetProofSource = "RENDERED_TARGET_NOT_RESOLVED";
        state.recommendedNextOwner = "DIAGNOSTIC_TARGET_RESOLUTION";
        state.recommendedNextFile = DIAGNOSTIC_ROUTE;
        state.recommendedNextAction = "SUPPLY_OR_LOAD_RENDERED_HEARTH_TARGET_FRAME";
        addNote(state, "WEST_RENDERED_TARGET_NOT_RESOLVED");
        publish(state);

        return {
          ok: true,
          contract: CONTRACT,
          receipt: RECEIPT,
          implementationContract: IMPLEMENTATION_CONTRACT,
          implementationReceipt: IMPLEMENTATION_RECEIPT,
          evidence: clonePlain(lastEvidencePacket),
          state: clonePlain(lastState)
        };
      }

      state.diagnosticTargetAccessStatus = "RENDERED_TARGET_ACCESSIBLE";
      state.diagnosticTargetAccessError = "NONE";
      state.hearthTargetConfirmed = true;

      readContracts(target.targetDocument, target.targetWindow, state);
      readAuthoritySpread(target.targetDocument, target.targetWindow, state);
      readDomSurface(target.targetDocument, target.targetWindow, state);
      buildDelegatoryCycle(state);
      deriveCanvasSurfaceTruth(state);
      deriveRenderedProof(state);
      deriveAlignment(state);
      deriveRecommendation(state);

      state.westRenderedReadComplete = "true";
      state.westRenderedReadStatus = "COMPLETE";
      state.westStatus = "COMPLETE";
      state.updatedAt = nowIso();

      addNote(state, "WEST_RENDERED_READ_COMPLETE_BY_LABWEST_CHRONOLOGY_CYCLE_BRIDGE_OBSERVATORY");

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.westStatus = "FAILED";
      state.westRenderedReadComplete = "false";
      state.westRenderedReadStatus = "FAILED";
      state.diagnosticTargetAccessStatus = state.diagnosticTargetAccessStatus || "UNKNOWN";
      state.diagnosticTargetAccessError = `WEST_RENDERED_READ_TOP_LEVEL_ERROR:${bounded(error && error.message ? error.message : error, 1200)}`;
      state.primaryCaseCandidate = "WEST_RENDERED_READ_FAILED";
      state.recommendedNextOwner = "DIAGNOSTIC_WEST";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "INSPECT_WEST_RENDERED_READ_TOP_LEVEL_ERROR";
      state.updatedAt = nowIso();
      addNote(state, state.diagnosticTargetAccessError);

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: state.diagnosticTargetAccessError,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    }
  }

  function getWestReceipt() {
    return {
      childRole: "WEST_RENDERED_TARGET_AUTHORITY_PROBE",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      labWestFile: LABWEST_FILE,

      acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
      acceptedIndexContracts: ACCEPTED_INDEX_CONTRACTS.slice(),
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      acceptedLabWestContracts: ACCEPTED_LABWEST_CONTRACTS.slice(),
      acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),

      servesNorth: true,
      servesProbeWest: true,
      renderedTargetAuthorityOwned: true,
      labWestBridgeReadOwned: true,
      labWestMutationOwned: false,
      labWestClassificationRunOwned: false,
      routeConductorRenderedReadOwned: true,
      controlsRenderedReadOwned: true,
      canvasPublicReceiverRenderedReadOwned: true,
      hexGateSurfaceRenderedReadOwned: true,
      pointerFingerRenderedReadOwned: true,
      productionCycleEvidenceOwned: true,
      canvasSurfaceTruthEvidenceOwned: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      case5Authority: false,
      servedSourceAuthority: false,
      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      syntheticActivationAuthorized: false,

      runWestRenderedReadApiAvailable: true,
      getWestReceiptApiAvailable: true,
      getWestStateApiAvailable: true,
      getStatusApiAvailable: true,
      getReportApiAvailable: true,

      lastWestStatus: lastEvidencePacket ? lastEvidencePacket.WEST_STATUS : "READY",
      lastWestRenderedReadStatus: lastEvidencePacket ? lastEvidencePacket.WEST_RENDERED_READ_STATUS : "WAITING_RUN",
      lastLabWestConnectionStatus: lastEvidencePacket ? lastEvidencePacket.LABWEST_DIAGNOSTIC_TRACK_CONNECTION_STATUS : "UNKNOWN",
      lastCanvasSurfaceTruthStatus: lastEvidencePacket ? lastEvidencePacket.CANVAS_SURFACE_TRUTH_STATUS : "UNKNOWN",
      lastCanvasTruthFailureClass: lastEvidencePacket ? lastEvidencePacket.CANVAS_TRUTH_FAILURE_CLASS : "UNKNOWN",
      lastProductionCycleStatus: lastEvidencePacket ? lastEvidencePacket.PRODUCTION_CYCLE_STATUS : "UNKNOWN",
      lastVisiblePlanetProofReady: lastEvidencePacket ? lastEvidencePacket.VISIBLE_PLANET_PROOF_READY : "UNKNOWN",
      lastRecommendedNextFile: lastEvidencePacket ? lastEvidencePacket.RECOMMENDED_NEXT_FILE : "UNKNOWN",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,

      updatedAt: nowIso()
    };
  }

  function getWestState() {
    return clonePlain(lastState || makeState());
  }

  function getStatus() {
    return clonePlain(lastEvidencePacket || makeEvidencePacket(makeState()));
  }

  function getReport() {
    return getStatus();
  }

  function getReceipt() {
    return getWestReceipt();
  }

  function getReceiptLight() {
    return getWestReceipt();
  }

  function publish(state) {
    lastState = clonePlain(state || makeState());
    lastEvidencePacket = makeEvidencePacket(lastState);

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticWest = api;
    root.HEARTH.diagnosticRailWest = api;
    root.HEARTH.diagnosticWestCanvasExpressionRenderedRangeObservatory = api;
    root.HEARTH.diagnosticWestLabWestChronologyCycleBridgeObservatory = api;
    root.HEARTH.diagnosticWestEvidence = clonePlain(lastEvidencePacket);
    root.HEARTH.diagnosticRailWestEvidence = clonePlain(lastEvidencePacket);
    root.HEARTH.diagnosticWestReceipt = getWestReceipt();
    root.HEARTH.diagnosticRailWestReceipt = getWestReceipt();

    root.DEXTER_LAB.hearthDiagnosticWest = api;
    root.DEXTER_LAB.hearthDiagnosticRailWest = api;
    root.DEXTER_LAB.hearthDiagnosticWestLabWestChronologyCycleBridgeObservatory = api;
    root.DEXTER_LAB.hearthDiagnosticWestEvidence = clonePlain(lastEvidencePacket);
    root.DEXTER_LAB.hearthDiagnosticWestReceipt = getWestReceipt();

    root.HEARTH_DIAGNOSTIC_WEST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_WEST = api;
    root.HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY = api;
    root.HEARTH_DIAGNOSTIC_WEST_LABWEST_CHRONOLOGY_CYCLE_BRIDGE_OBSERVATORY = api;
    root.HEARTH_DIAGNOSTIC_WEST_EVIDENCE = clonePlain(lastEvidencePacket);
    root.HEARTH_DIAGNOSTIC_RAIL_WEST_EVIDENCE = clonePlain(lastEvidencePacket);
    root.HEARTH_DIAGNOSTIC_WEST_RECEIPT = getWestReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_WEST_RECEIPT = getWestReceipt();

    try {
      const documentRef = root.document || null;
      if (documentRef && documentRef.documentElement && documentRef.documentElement.dataset) {
        const ds = documentRef.documentElement.dataset;
        ds.hearthDiagnosticWestLoaded = "true";
        ds.hearthDiagnosticWestContract = CONTRACT;
        ds.hearthDiagnosticWestReceipt = RECEIPT;
        ds.hearthDiagnosticWestImplementationContract = IMPLEMENTATION_CONTRACT;
        ds.hearthDiagnosticWestLabWestBridgeActive = "true";
        ds.hearthDiagnosticWestLastStatus = lastEvidencePacket.WEST_STATUS;
        ds.hearthDiagnosticWestLastRenderedReadStatus = lastEvidencePacket.WEST_RENDERED_READ_STATUS;
        ds.hearthDiagnosticWestLastLabWestConnectionStatus = lastEvidencePacket.LABWEST_DIAGNOSTIC_TRACK_CONNECTION_STATUS;
        ds.hearthDiagnosticWestLastCanvasSurfaceTruthStatus = lastEvidencePacket.CANVAS_SURFACE_TRUTH_STATUS;
      }
    } catch (_error) {}

    return api;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    labWestFile: LABWEST_FILE,

    acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
    acceptedIndexContracts: ACCEPTED_INDEX_CONTRACTS.slice(),
    acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
    acceptedLabWestContracts: ACCEPTED_LABWEST_CONTRACTS.slice(),
    acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),

    routeConductorAliases: ROUTE_CONDUCTOR_ALIASES.slice(),
    controlsAliases: CONTROLS_ALIASES.slice(),
    canvasAliases: CANVAS_ALIASES.slice(),
    hexAuthorityAliases: HEX_AUTHORITY_ALIASES.slice(),
    hexSurfaceAliases: HEX_SURFACE_ALIASES.slice(),
    pointerFingerAliases: POINTER_FINGER_ALIASES.slice(),
    labWestAliases: LABWEST_ALIASES.slice(),

    runWestRenderedRead,
    run: runWestRenderedRead,
    read: runWestRenderedRead,
    inspect: runWestRenderedRead,
    getWestReceipt,
    getWestState,
    getStatus,
    getReport,
    getReceipt,
    getReceiptLight,

    supportsLabWestChronologyCycleBridge: true,
    supportsLabWestSafeReceiptRead: true,
    supportsRouteControlsCanvasHexPointerCanvasCycleRead: true,
    supportsCanvasSurfaceTruthEvidence: true,
    supportsCanvasScriptPresenceTruth: true,
    supportsCanvasDomSurfaceRead: true,
    supportsCanvasPixelSampleReadWhenSafe: true,
    supportsNoLifecycleIgnition: true,
    supportsNorthOnlyFinalAdjudication: true,

    ownsRenderedTargetEvidence: true,
    ownsLabWestBridgeRead: true,
    ownsProductionCycleEvidence: true,
    ownsCanvasSurfaceTruthEvidence: true,
    ownsFinalPrimaryCase: false,
    ownsFinalRecommendation: false,
    ownsCase5: false,
    ownsServedSourceAuthority: false,
    ownsRepair: false,
    ownsProductionMutation: false,
    ownsRuntimeRestart: false,
    ownsCanvasRelease: false,
    ownsMacroWestRelease: false,
    ownsF13: false,
    ownsF21: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
