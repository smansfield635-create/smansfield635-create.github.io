// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Internal renewal:
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_FINGER_EXTENSION_RETURN_SURFACE_INSPECTION_TNT_v1_1
// Full-file replacement.
// Diagnostic Probe South / packet-meaning and return-surface inspection only.
// Purpose:
// - Preserve the South probe public contract North v11 expects.
// - Preserve the diagnostic receipt return mechanism.
// - Preserve South as packet-meaning / return-surface authority.
// - Add downstream inspection for the canvas expression bridge and canvas finger extension chain.
// - Report whether the finger files exist, are script-present, publish aliases, expose receipts, and expose safe inspection APIs.
// - Return all finger-extension evidence through the existing South probe packet surface.
// Does not own:
// - diagnostic UI shell
// - North chronology
// - Canvas drawing
// - Canvas repair
// - Canvas release
// - runtime restart
// - route conductor repair
// - production mutation
// - finger implementation
// - terrain/material/hydrology truth
// - final visual pass
// - F13 claim
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_FINGER_EXTENSION_RETURN_SURFACE_INSPECTION_TNT_v1_1";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_FINGER_EXTENSION_RETURN_SURFACE_INSPECTION_RECEIPT_v1_1";

  const VERSION =
    "2026-06-06.hearth-diagnostic-probe-south-finger-extension-return-surface-inspection-v1-1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";
  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const PREVIOUS_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const LINEAGE_V9_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const LINEAGE_V8_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_TNT_v8";
  const LINEAGE_V7_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_SOUTH_NEWS_FIBONACCI_ALIGNMENT_ORCHESTRATOR_TNT_v7";
  const BASELINE_V6_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_BISHOP_QUEEN_ACCEPTANCE_SCHEMA_ORCHESTRATOR_TNT_v6";
  const FOUNDATION_V5_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_TNT_v5";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_CANVAS_SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const PROBE_SOUTH_FILE = FILE;

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const EXPECTED_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";
  const EXPECTED_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";
  const EXPECTED_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8";

  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT = CONTRACT;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const FINGER_FILES = Object.freeze([
    Object.freeze({
      id: "EXPRESSION_BRIDGE",
      label: "expression-bridge",
      file: "/assets/hearth/hearth.canvas.expression.bridge.js",
      aliases: [
        "HEARTH.canvasExpressionBridge",
        "HEARTH.hearthCanvasExpressionBridge",
        "HEARTH_CANVAS_EXPRESSION_BRIDGE",
        "HEARTH_CANVAS_EXPRESSION_BRIDGE_AUTHORITY",
        "DEXTER_LAB.hearthCanvasExpressionBridge",
        "DEXTER_LAB.hearthCanvasExpressionBridgeAuthority"
      ],
      methods: [
        "inspectExpressionBridge",
        "inspectCanvasExpressionBridge",
        "inspectExpression",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_ATMOSPHERE",
      label: "finger-atmosphere",
      file: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
      aliases: [
        "HEARTH.canvasFingerAtmosphere",
        "HEARTH.hearthCanvasFingerAtmosphere",
        "HEARTH_CANVAS_FINGER_ATMOSPHERE",
        "HEARTH_CANVAS_FINGER_ATMOSPHERE_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerAtmosphere"
      ],
      methods: [
        "inspectFingerAtmosphere",
        "inspectAtmosphere",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_BOUNDARY",
      label: "finger-boundary",
      file: "/assets/hearth/hearth.canvas.finger.boundary.js",
      aliases: [
        "HEARTH.canvasFingerBoundary",
        "HEARTH.hearthCanvasFingerBoundary",
        "HEARTH_CANVAS_FINGER_BOUNDARY",
        "HEARTH_CANVAS_FINGER_BOUNDARY_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerBoundary"
      ],
      methods: [
        "inspectFingerBoundary",
        "inspectBoundary",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_COMPOSITE",
      label: "finger-composite",
      file: "/assets/hearth/hearth.canvas.finger.composite.js",
      aliases: [
        "HEARTH.canvasFingerComposite",
        "HEARTH.hearthCanvasFingerComposite",
        "HEARTH_CANVAS_FINGER_COMPOSITE",
        "HEARTH_CANVAS_FINGER_COMPOSITE_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerComposite"
      ],
      methods: [
        "inspectFingerComposite",
        "inspectComposite",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_ELEVATION",
      label: "finger-elevation",
      file: "/assets/hearth/hearth.canvas.finger.elevation.js",
      aliases: [
        "HEARTH.canvasFingerElevation",
        "HEARTH.hearthCanvasFingerElevation",
        "HEARTH_CANVAS_FINGER_ELEVATION",
        "HEARTH_CANVAS_FINGER_ELEVATION_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerElevation"
      ],
      methods: [
        "inspectFingerElevation",
        "inspectElevation",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_HYDROLOGY",
      label: "finger-hydrology",
      file: "/assets/hearth/hearth.canvas.finger.hydrology.js",
      aliases: [
        "HEARTH.canvasFingerHydrology",
        "HEARTH.hearthCanvasFingerHydrology",
        "HEARTH_CANVAS_FINGER_HYDROLOGY",
        "HEARTH_CANVAS_FINGER_HYDROLOGY_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerHydrology"
      ],
      methods: [
        "inspectFingerHydrology",
        "inspectHydrology",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_INSPECT",
      label: "finger-inspect",
      file: "/assets/hearth/hearth.canvas.finger.inspect.js",
      aliases: [
        "HEARTH.canvasFingerInspect",
        "HEARTH.hearthCanvasFingerInspect",
        "HEARTH.canvasFingerInspector",
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_FINGER_INSPECTOR",
        "HEARTH_CANVAS_FINGER_INSPECT_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerInspect",
        "DEXTER_LAB.hearthCanvasFingerInspector"
      ],
      methods: [
        "inspectCanvasFingers",
        "inspectFingerChain",
        "inspectFingerExtensions",
        "inspectFingerInspect",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_LANDFORM",
      label: "finger-landform",
      file: "/assets/hearth/hearth.canvas.finger.landform.js",
      aliases: [
        "HEARTH.canvasFingerLandform",
        "HEARTH.hearthCanvasFingerLandform",
        "HEARTH_CANVAS_FINGER_LANDFORM",
        "HEARTH_CANVAS_FINGER_LANDFORM_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerLandform"
      ],
      methods: [
        "inspectFingerLandform",
        "inspectLandform",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_LIGHT",
      label: "finger-light",
      file: "/assets/hearth/hearth.canvas.finger.light.js",
      aliases: [
        "HEARTH.canvasFingerLight",
        "HEARTH.hearthCanvasFingerLight",
        "HEARTH_CANVAS_FINGER_LIGHT",
        "HEARTH_CANVAS_FINGER_LIGHT_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerLight"
      ],
      methods: [
        "inspectFingerLight",
        "inspectLight",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_LIGHTING",
      label: "finger-lighting",
      file: "/assets/hearth/hearth.canvas.finger.lighting.js",
      aliases: [
        "HEARTH.canvasFingerLighting",
        "HEARTH.hearthCanvasFingerLighting",
        "HEARTH_CANVAS_FINGER_LIGHTING",
        "HEARTH_CANVAS_FINGER_LIGHTING_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerLighting"
      ],
      methods: [
        "inspectFingerLighting",
        "inspectLighting",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_MASS",
      label: "finger-mass",
      file: "/assets/hearth/hearth.canvas.finger.mass.js",
      aliases: [
        "HEARTH.canvasFingerMass",
        "HEARTH.hearthCanvasFingerMass",
        "HEARTH_CANVAS_FINGER_MASS",
        "HEARTH_CANVAS_FINGER_MASS_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerMass"
      ],
      methods: [
        "inspectFingerMass",
        "inspectMass",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_MATERIAL",
      label: "finger-material",
      file: "/assets/hearth/hearth.canvas.finger.material.js",
      aliases: [
        "HEARTH.canvasFingerMaterial",
        "HEARTH.hearthCanvasFingerMaterial",
        "HEARTH_CANVAS_FINGER_MATERIAL",
        "HEARTH_CANVAS_FINGER_MATERIAL_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerMaterial"
      ],
      methods: [
        "inspectFingerMaterial",
        "inspectMaterial",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    }),
    Object.freeze({
      id: "FINGER_SURFACE",
      label: "finger-surface",
      file: "/assets/hearth/hearth.canvas.finger.surface.js",
      aliases: [
        "HEARTH.canvasFingerSurface",
        "HEARTH.hearthCanvasFingerSurface",
        "HEARTH_CANVAS_FINGER_SURFACE",
        "HEARTH_CANVAS_FINGER_SURFACE_AUTHORITY",
        "DEXTER_LAB.hearthCanvasFingerSurface"
      ],
      methods: [
        "inspectFingerSurface",
        "inspectSurface",
        "inspectFinger",
        "inspect",
        "getReport",
        "getReceipt",
        "getState"
      ]
    })
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastState = null;
  let lastReport = null;
  let lastPacketText = "";
  let lastCompactSummary = "";

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function clonePlain(value) {
    if (value === undefined || value === null) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function stringifyPacketValue(value, limit = 20000) {
    if (value === undefined || value === null || value === "") return "UNKNOWN";

    if (Array.isArray(value) || isObject(value)) {
      try {
        return JSON.stringify(value).slice(0, limit);
      } catch (_error) {
        return bounded(value, Math.min(limit, 4000)) || "UNKNOWN";
      }
    }

    return bounded(value, Math.min(limit, 4000)) || "UNKNOWN";
  }

  function packetValue(value, fallback = "UNKNOWN") {
    const text = stringifyPacketValue(value);
    return text === "UNKNOWN" ? fallback : text;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      return value === undefined || value === null ? fallback : value;
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        const value = source[candidate];
        return value === undefined || value === null ? fallback : value;
      }
    }

    return fallback;
  }

  function getValue(source, key, fallback = "UNKNOWN") {
    return packetValue(getRaw(source, key, undefined), fallback);
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value, 4000);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }

    return "UNKNOWN";
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "" || source === "none") continue;

      const values = Array.isArray(source) ? source : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1400);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function addNote(state, note) {
    const clean = bounded(note, 1400);
    if (!clean) return;
    if (!state.notes.includes(clean)) state.notes.push(clean);
  }

  function readPathFrom(base, path) {
    if (!base || !path) return null;

    const parts = safeString(path).split(".");
    let cursor = base;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function uniqueContexts(options = {}) {
    const contexts = [];
    const seen = new Set();

    function add(name, win, doc) {
      if (!win && !doc) return;

      const key = `${name}:${Boolean(win)}:${Boolean(doc)}:${doc && doc.URL ? doc.URL : ""}`;
      if (seen.has(key)) return;
      seen.add(key);

      contexts.push({
        name,
        window: win || null,
        document: doc || (win && win.document ? win.document : null)
      });
    }

    add("DIAGNOSTIC_ROOT", root, root.document || null);

    if (options.targetWindow || options.targetDocument) {
      add("NORTH_TARGET_CONTEXT", options.targetWindow || null, options.targetDocument || null);
    }

    if (options.frameElement) {
      try {
        add(
          "NORTH_FRAME_ELEMENT_CONTEXT",
          options.frameElement.contentWindow || null,
          options.frameElement.contentDocument || null
        );
      } catch (_error) {}
    }

    try {
      const doc = root.document || null;
      if (doc) {
        const frames = Array.from(doc.querySelectorAll("iframe"));
        for (const frame of frames) {
          const src = safeString(frame.getAttribute("src"));
          if (!src.includes(TARGET_ROUTE) && !src.includes("/showroom/globe/hearth")) continue;

          try {
            add("DISCOVERED_HEARTH_TARGET_FRAME", frame.contentWindow || null, frame.contentDocument || null);
          } catch (_error) {}
        }
      }
    } catch (_error) {}

    return contexts;
  }

  function findAliasInContexts(contexts, aliases) {
    for (const context of contexts) {
      const win = context.window || null;

      if (!win) continue;

      for (const alias of aliases || []) {
        const value = readPathFrom(win, alias);
        if (value) {
          return {
            observed: true,
            contextName: context.name,
            path: alias,
            value
          };
        }
      }
    }

    return {
      observed: false,
      contextName: "NONE",
      path: "NONE",
      value: null
    };
  }

  function scriptPresentInContexts(contexts, filePath) {
    const matches = [];

    for (const context of contexts) {
      const doc = context.document || null;
      if (!doc) continue;

      try {
        const scripts = Array.from(doc.querySelectorAll("script[src]"));
        for (const script of scripts) {
          const src = safeString(script.getAttribute("src"));
          let matched = false;

          try {
            const base =
              root.location && root.location.origin
                ? root.location.origin
                : "https://diamondgatebridge.com";
            const url = new URL(src, base);
            matched = url.pathname === filePath;
          } catch (_error) {
            matched = src.includes(filePath);
          }

          if (matched) {
            matches.push({
              contextName: context.name,
              src
            });
          }
        }
      } catch (_error) {}
    }

    return {
      present: matches.length > 0,
      matches
    };
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getState",
      "getStatus",
      "getFingerReceipt",
      "getFingerReport",
      "getExpressionBridgeReceipt",
      "getInspectionReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.state)) return authority.state;

    if (
      authority.contract ||
      authority.CONTRACT ||
      authority.receipt ||
      authority.RECEIPT ||
      authority.version ||
      authority.VERSION
    ) {
      return authority;
    }

    return null;
  }

  function extractEvidence(output) {
    if (!isObject(output)) return {};

    if (isObject(output.evidence)) return output.evidence;
    if (isObject(output.report)) return output.report;
    if (isObject(output.REPORT_OBJECT)) return output.REPORT_OBJECT;
    if (isObject(output.output) && isObject(output.output.REPORT_OBJECT)) return output.output.REPORT_OBJECT;
    if (isObject(output.output) && isObject(output.output.report)) return output.output.report;
    if (isObject(output.state) && isObject(output.state.reportObject)) return output.state.reportObject;

    return output;
  }

  function safeCallInspection(authority, spec, payload) {
    if (!authority || !isObject(authority)) {
      return {
        callable: false,
        callMethod: "NONE",
        callReturned: false,
        callStatus: "NOT_CALLED_NO_AUTHORITY",
        callError: "NONE",
        output: {}
      };
    }

    const methods = []
      .concat(spec.methods || [])
      .concat([
        "inspect",
        "getReport",
        "getReceipt",
        "getReceiptLight",
        "getState"
      ]);

    const seen = new Set();

    for (const method of methods) {
      if (seen.has(method)) continue;
      seen.add(method);

      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method](payload);
        return {
          callable: true,
          callMethod: method,
          callReturned: true,
          callStatus: "CALL_RETURNED",
          callError: "NONE",
          output: extractEvidence(output)
        };
      } catch (error) {
        return {
          callable: true,
          callMethod: method,
          callReturned: false,
          callStatus: "CALL_FAILED",
          callError: bounded(error && error.message ? error.message : error, 1000),
          output: {}
        };
      }
    }

    return {
      callable: false,
      callMethod: "NONE",
      callReturned: false,
      callStatus: "CALL_METHOD_NOT_FOUND",
      callError: "NONE",
      output: {}
    };
  }

  function sourceHeaderContract(text) {
    const source = safeString(text);
    const header = source.split(/\n/).slice(0, 40).join("\n");
    const tokens = header.match(/[A-Z0-9_]+_TNT_v[0-9][A-Z0-9_\.]*/g) || [];
    return tokens[0] || "UNKNOWN";
  }

  function sourceHeaderReceipt(text) {
    const source = safeString(text);
    const header = source.split(/\n/).slice(0, 60).join("\n");
    const tokens = header.match(/[A-Z0-9_]+_RECEIPT_v[0-9][A-Z0-9_\.]*/g) || [];
    return tokens[0] || "UNKNOWN";
  }

  async function fetchSource(filePath, options = {}) {
    if (options.sourceFetchAuthorized === false) {
      return {
        attempted: false,
        status: "SOURCE_FETCH_SKIPPED_BY_OPTIONS",
        httpStatus: "NONE",
        sourceAvailable: false,
        sourceBytes: 0,
        sourceContract: "UNKNOWN",
        sourceReceipt: "UNKNOWN"
      };
    }

    if (!isFunction(root.fetch)) {
      return {
        attempted: false,
        status: "FETCH_UNAVAILABLE",
        httpStatus: "NONE",
        sourceAvailable: false,
        sourceBytes: 0,
        sourceContract: "UNKNOWN",
        sourceReceipt: "UNKNOWN"
      };
    }

    try {
      const response = await root.fetch(`${filePath}?v=${encodeURIComponent(IMPLEMENTATION_CONTRACT)}`, {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin"
      });

      const text = await response.text();

      return {
        attempted: true,
        status: response.ok ? "SOURCE_FETCH_COMPLETE" : "SOURCE_FETCH_HTTP_NOT_OK",
        httpStatus: response.status,
        sourceAvailable: response.ok,
        sourceBytes: text.length,
        sourceContract: sourceHeaderContract(text),
        sourceReceipt: sourceHeaderReceipt(text)
      };
    } catch (error) {
      return {
        attempted: true,
        status: `SOURCE_FETCH_ERROR:${bounded(error && error.message ? error.message : error, 700)}`,
        httpStatus: "ERROR",
        sourceAvailable: false,
        sourceBytes: 0,
        sourceContract: "UNKNOWN",
        sourceReceipt: "UNKNOWN"
      };
    }
  }

  function makeState() {
    return {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_PROBE_SOUTH_RETURN_PACKET_v1",
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      PROBE_SOUTH_STATUS: "INITIALIZED",
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_CARRIER_FILE: FILE,
      PROBE_SOUTH_CHRONOLOGY_ORDER: 9,
      PROBE_SOUTH_FIBONACCI_STAGE: "F55",
      PROBE_SOUTH_GATE: "SOUTH_PACKET_MEANING_RETURN_SURFACE",
      PROBE_SOUTH_ROLE: "packet-meaning-file-composition-probe",
      PROBE_SOUTH_AUTHORITY: "DIAGNOSTIC_PROBE_SOUTH",
      PROBE_SOUTH_SOURCE_PATH: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PHYSICAL_FILE_OBSERVED: true,
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: true,
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: true,
      PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL: "UNKNOWN",
      PROBE_SOUTH_PUBLISHED_AS_PHYSICAL_FILE: true,
      PROBE_SOUTH_RUN_COMPLETE: false,
      PROBE_SOUTH_RUN_STATUS: "NOT_RUN",
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: true,
      PROBE_SOUTH_MEANING_STATUS: "PRESERVED",
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: "READY",
      PROBE_SOUTH_RETURN_PACKET_READY: false,

      RECEIPT_RETURN_MECHANISM_STATUS: "READY",
      DIAGNOSTIC_RECEIPT_RETURN_STATUS: "READY",
      RETURN_REPORT_OBJECT_AVAILABLE: true,
      RETURN_PACKET_TEXT_AVAILABLE: true,
      RETURN_COMPACT_SUMMARY_AVAILABLE: true,
      RETURN_RECEIPT_OBJECT_AVAILABLE: true,
      NORTH_READABLE_RECEIPT_SURFACE_READY: true,
      DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY: true,

      NORTH_CONTRACT,
      NORTH_RECEIPT,
      PREVIOUS_NORTH_CONTRACT,
      PREVIOUS_NORTH_RECEIPT,
      LINEAGE_V9_NORTH_CONTRACT,
      LINEAGE_V8_NORTH_CONTRACT,
      LINEAGE_V7_NORTH_CONTRACT,
      BASELINE_V6_NORTH_CONTRACT,
      FOUNDATION_V5_NORTH_CONTRACT,

      NORTH_CHRONOLOGY_HUB_ACTIVE: true,
      NORTH_IS_HUB_ONLY: true,
      NINE_STEP_CHRONOLOGY_ACTIVE: true,
      CANVAS_SURFACE_TRUTH_PROBE_EXPECTED: true,
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: false,
      RECEIVER_STILL_CALLS_NORTH_ONLY: true,

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_CANVAS_SURFACE_TRUTH_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_EAST_CONTRACT,
      EXPECTED_WEST_CONTRACT,
      EXPECTED_SOUTH_CONTRACT,
      EXPECTED_PROBE_NORTH_CONTRACT,
      EXPECTED_PROBE_EAST_CONTRACT,
      EXPECTED_PROBE_WEST_CONTRACT,
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      FINGER_EXTENSION_CHAIN_INSPECTION_ACTIVE: true,
      FINGER_EXTENSION_DYNAMIC_LOADING_OWNED: false,
      FINGER_EXTENSION_SOURCE_FETCH_AUTHORIZED: true,
      FINGER_EXTENSION_EXPECTED_COUNT: FINGER_FILES.length,
      FINGER_EXTENSION_EXPECTED_FILES: FINGER_FILES.map((item) => item.file),
      FINGER_EXTENSION_CHAIN_STATUS: "NOT_RUN",
      FINGER_EXPRESSION_BRIDGE_FILE_OBSERVED: "UNKNOWN",
      FINGER_INSPECT_FILE_OBSERVED: "UNKNOWN",
      FINGER_SURFACE_FILE_OBSERVED: "UNKNOWN",
      FINGER_CHAIN_SOURCE_PRESENT_COUNT: 0,
      FINGER_CHAIN_SCRIPT_PRESENT_COUNT: 0,
      FINGER_CHAIN_ALIAS_OBSERVED_COUNT: 0,
      FINGER_CHAIN_RECEIPT_COUNT: 0,
      FINGER_CHAIN_CALLABLE_COUNT: 0,
      FINGER_CHAIN_INSPECTION_RETURN_COUNT: 0,
      FINGER_CHAIN_FIRST_MISSING_FILE: "UNKNOWN",
      FINGER_CHAIN_FIRST_MISSING_ALIAS: "UNKNOWN",
      FINGER_CHAIN_FIRST_MISSING_RECEIPT: "UNKNOWN",
      FINGER_CHAIN_FIRST_MISSING_CALLABLE: "UNKNOWN",
      FINGER_CHAIN_FIRST_CALL_FAILURE: "NONE",
      FINGER_CHAIN_DIAGNOSTIC_STATUS: "NOT_RUN",
      FINGER_CHAIN_RECOMMENDED_OWNER: "DIAGNOSTIC_PROBE_SOUTH",
      FINGER_CHAIN_RECOMMENDED_FILE: FILE,
      FINGER_CHAIN_RECOMMENDED_ACTION: "RUN_PROBE_SOUTH",
      FINGER_CHAIN_INSPECTION_TABLE: [],

      CANVAS_EXPRESSION_INSTRUMENTATION_STATUS: "UNKNOWN",
      FILE_COMPOSITION_STATUS: "SOURCE_COMPOSITION_REACHES_PROBE_SOUTH_PACKET_MEANING_AND_RETURN_SURFACE",
      DIAGNOSTIC_INSTRUMENT_STATUS: "NINE_STEP_PROBE_BRIDGE_PRESENT_WITH_PROBE_SOUTH_RETURN_SURFACE",
      SOUTH_OUTPUT_STATUS: "COMPLETE",
      SOUTH_MEANING_PRESERVED: true,

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      notes: [
        "PROBE_SOUTH_PUBLIC_CONTRACT_PRESERVED",
        "PROBE_SOUTH_RETURN_SURFACE_PRESERVED",
        "FINGER_EXTENSION_INSPECTION_ADDED_TO_SOUTH_PROBE_PACKET",
        "NO_FINGER_DYNAMIC_LOADING_BY_SOUTH_PROBE",
        "NO_PRODUCTION_MUTATION_AUTHORIZED"
      ],

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function applyNorthPayload(state, payload = {}) {
    const currentReport =
      payload.currentReport ||
      payload.report ||
      payload.REPORT_OBJECT ||
      payload.northReport ||
      {};

    state.NORTH_CONTRACT = firstKnown(payload.northContract, getValue(currentReport, "NORTH_CONTRACT", ""), NORTH_CONTRACT);
    state.NORTH_RECEIPT = firstKnown(payload.northReceipt, getValue(currentReport, "NORTH_RECEIPT", ""), NORTH_RECEIPT);
    state.PREVIOUS_NORTH_CONTRACT = firstKnown(
      payload.previousNorthContract,
      getValue(currentReport, "PREVIOUS_NORTH_CONTRACT", ""),
      PREVIOUS_NORTH_CONTRACT
    );

    state.CHRONOLOGY_SEQUENCE = clonePlain(payload.chronology || getRaw(currentReport, "CHRONOLOGY_SEQUENCE", []));
    state.CHRONOLOGY_SEQUENCE_TEXT = firstKnown(getValue(currentReport, "CHRONOLOGY_SEQUENCE_TEXT", ""), "UNKNOWN");

    state.CANVAS_TRUTH_FIRST_FAILED_COORDINATE = getValue(currentReport, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN");
    state.CANVAS_TRUTH_FAILURE_CLASS = getValue(currentReport, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN");
    state.CANVAS_TRUTH_FAILURE_REASON = getValue(currentReport, "CANVAS_TRUTH_FAILURE_REASON", "UNKNOWN");
    state.CANVAS_TRUTH_RECOMMENDED_OWNER = getValue(currentReport, "CANVAS_TRUTH_RECOMMENDED_OWNER", "UNKNOWN");
    state.CANVAS_TRUTH_RECOMMENDED_FILE = getValue(currentReport, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN");
    state.CANVAS_TRUTH_RECOMMENDED_ACTION = getValue(currentReport, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN");

    state.CANVAS_ELEMENT_FOUND = getValue(currentReport, "CANVAS_ELEMENT_FOUND", "UNKNOWN");
    state.CANVAS_RECT_NONZERO = getValue(currentReport, "CANVAS_RECT_NONZERO", "UNKNOWN");
    state.CANVAS_COMPUTED_VISIBLE = getValue(currentReport, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN");
    state.CANVAS_VIEWPORT_INTERSECTING = getValue(currentReport, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN");
    state.CANVAS_CONTEXT_2D_READY = getValue(currentReport, "CANVAS_CONTEXT_2D_READY", "UNKNOWN");
    state.CANVAS_PIXEL_SAMPLE_STATUS = getValue(currentReport, "CANVAS_PIXEL_SAMPLE_STATUS", "UNKNOWN");
    state.CANVAS_PIXEL_VISIBLE = getValue(currentReport, "CANVAS_PIXEL_VISIBLE", "UNKNOWN");
    state.CANVAS_LAYER_BLOCKED = getValue(currentReport, "CANVAS_LAYER_BLOCKED", "UNKNOWN");

    const incomingNotes = normalizeNotes(
      getValue(currentReport, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(currentReport, "NORTH_SECONDARY_EVIDENCE_NOTES", "")
    );

    for (const note of incomingNotes) addNote(state, note);
  }

  async function inspectFingerSpec(state, spec, contexts, payload) {
    const scriptPresence = scriptPresentInContexts(contexts, spec.file);
    const alias = findAliasInContexts(contexts, spec.aliases);
    const receipt = getReceiptFromAuthority(alias.value) || {};
    const call = safeCallInspection(alias.value, spec, {
      source: "DIAGNOSTIC_PROBE_SOUTH",
      contract: CONTRACT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      file: spec.file,
      fingerId: spec.id,
      fingerLabel: spec.label,
      northPayload: clonePlain(payload),
      noClaims: clonePlain(NO_CLAIMS)
    });

    const source = await fetchSource(spec.file, payload || {});

    const contract = firstKnown(
      getValue(receipt, "CONTRACT", ""),
      getValue(receipt, "contract", ""),
      getValue(call.output, "CONTRACT", ""),
      getValue(call.output, "contract", ""),
      source.sourceContract
    );

    const receiptName = firstKnown(
      getValue(receipt, "RECEIPT", ""),
      getValue(receipt, "receipt", ""),
      getValue(call.output, "RECEIPT", ""),
      getValue(call.output, "receipt", ""),
      source.sourceReceipt
    );

    let status = "NOT_CONNECTED";

    if (source.sourceAvailable && alias.observed && receiptName !== "UNKNOWN" && call.callReturned) {
      status = "CONNECTED_AND_INSPECTABLE";
    } else if (source.sourceAvailable && alias.observed && receiptName !== "UNKNOWN") {
      status = "CONNECTED_RECEIPT_PRESENT_INSPECTION_API_INCOMPLETE";
    } else if (source.sourceAvailable && alias.observed) {
      status = "SOURCE_AND_ALIAS_PRESENT_RECEIPT_MISSING";
    } else if (source.sourceAvailable && scriptPresence.present) {
      status = "SOURCE_AND_SCRIPT_PRESENT_ALIAS_MISSING";
    } else if (source.sourceAvailable) {
      status = "SOURCE_PRESENT_NOT_SCRIPT_CONNECTED";
    } else if (scriptPresence.present || alias.observed) {
      status = "RUNTIME_TRACE_PRESENT_SOURCE_FETCH_FAILED";
    }

    const row = {
      id: spec.id,
      label: spec.label,
      file: spec.file,
      sourceFetchAttempted: source.attempted,
      sourceFetchStatus: source.status,
      sourceHttpStatus: source.httpStatus,
      sourceAvailable: source.sourceAvailable,
      sourceBytes: source.sourceBytes,
      sourceContract: source.sourceContract,
      sourceReceipt: source.sourceReceipt,
      scriptPresent: scriptPresence.present,
      scriptContexts: scriptPresence.matches.map((item) => item.contextName),
      aliasObserved: alias.observed,
      aliasContext: alias.contextName,
      aliasPath: alias.path,
      contract,
      receipt: receiptName,
      receiptPresent: receiptName !== "UNKNOWN",
      callable: call.callable,
      callMethod: call.callMethod,
      callReturned: call.callReturned,
      callStatus: call.callStatus,
      callError: call.callError,
      inspectionOutputKeys: Object.keys(call.output || {}).slice(0, 40).join(",") || "NONE",
      status
    };

    return row;
  }

  function applyFingerRows(state, rows) {
    state.FINGER_CHAIN_SOURCE_PRESENT_COUNT = rows.filter((row) => row.sourceAvailable).length;
    state.FINGER_CHAIN_SCRIPT_PRESENT_COUNT = rows.filter((row) => row.scriptPresent).length;
    state.FINGER_CHAIN_ALIAS_OBSERVED_COUNT = rows.filter((row) => row.aliasObserved).length;
    state.FINGER_CHAIN_RECEIPT_COUNT = rows.filter((row) => row.receiptPresent).length;
    state.FINGER_CHAIN_CALLABLE_COUNT = rows.filter((row) => row.callable).length;
    state.FINGER_CHAIN_INSPECTION_RETURN_COUNT = rows.filter((row) => row.callReturned).length;
    state.FINGER_CHAIN_INSPECTION_TABLE = clonePlain(rows);

    const expressionBridge = rows.find((row) => row.id === "EXPRESSION_BRIDGE");
    const inspectFinger = rows.find((row) => row.id === "FINGER_INSPECT");
    const surfaceFinger = rows.find((row) => row.id === "FINGER_SURFACE");

    state.FINGER_EXPRESSION_BRIDGE_FILE_OBSERVED = boolText(expressionBridge && expressionBridge.sourceAvailable, "false");
    state.FINGER_INSPECT_FILE_OBSERVED = boolText(inspectFinger && inspectFinger.sourceAvailable, "false");
    state.FINGER_SURFACE_FILE_OBSERVED = boolText(surfaceFinger && surfaceFinger.sourceAvailable, "false");

    const firstMissingFile = rows.find((row) => !row.sourceAvailable);
    const firstMissingAlias = rows.find((row) => row.sourceAvailable && !row.aliasObserved);
    const firstMissingReceipt = rows.find((row) => row.sourceAvailable && row.aliasObserved && !row.receiptPresent);
    const firstMissingCallable = rows.find((row) => row.sourceAvailable && row.aliasObserved && !row.callable);
    const firstCallFailure = rows.find((row) => row.callable && !row.callReturned && row.callStatus === "CALL_FAILED");

    state.FINGER_CHAIN_FIRST_MISSING_FILE = firstMissingFile ? firstMissingFile.file : "NONE";
    state.FINGER_CHAIN_FIRST_MISSING_ALIAS = firstMissingAlias ? firstMissingAlias.file : "NONE";
    state.FINGER_CHAIN_FIRST_MISSING_RECEIPT = firstMissingReceipt ? firstMissingReceipt.file : "NONE";
    state.FINGER_CHAIN_FIRST_MISSING_CALLABLE = firstMissingCallable ? firstMissingCallable.file : "NONE";
    state.FINGER_CHAIN_FIRST_CALL_FAILURE = firstCallFailure
      ? `${firstCallFailure.file}:${firstCallFailure.callError}`
      : "NONE";

    for (const row of rows) {
      const prefix = row.id;

      state[`${prefix}_FILE`] = row.file;
      state[`${prefix}_SOURCE_AVAILABLE`] = row.sourceAvailable;
      state[`${prefix}_SOURCE_FETCH_STATUS`] = row.sourceFetchStatus;
      state[`${prefix}_SCRIPT_PRESENT`] = row.scriptPresent;
      state[`${prefix}_ALIAS_OBSERVED`] = row.aliasObserved;
      state[`${prefix}_ALIAS_CONTEXT`] = row.aliasContext;
      state[`${prefix}_ALIAS_PATH`] = row.aliasPath;
      state[`${prefix}_CONTRACT`] = row.contract;
      state[`${prefix}_RECEIPT`] = row.receipt;
      state[`${prefix}_RECEIPT_PRESENT`] = row.receiptPresent;
      state[`${prefix}_CALLABLE`] = row.callable;
      state[`${prefix}_CALL_METHOD`] = row.callMethod;
      state[`${prefix}_CALL_RETURNED`] = row.callReturned;
      state[`${prefix}_CALL_STATUS`] = row.callStatus;
      state[`${prefix}_STATUS`] = row.status;
    }

    const expected = FINGER_FILES.length;
    const allSource = state.FINGER_CHAIN_SOURCE_PRESENT_COUNT === expected;
    const allAlias = state.FINGER_CHAIN_ALIAS_OBSERVED_COUNT === expected;
    const allReceipt = state.FINGER_CHAIN_RECEIPT_COUNT === expected;
    const allInspectable = state.FINGER_CHAIN_INSPECTION_RETURN_COUNT === expected;

    if (allSource && allAlias && allReceipt && allInspectable) {
      state.FINGER_EXTENSION_CHAIN_STATUS = "FINGER_EXTENSION_CHAIN_CONNECTED_AND_INSPECTABLE";
      state.FINGER_CHAIN_DIAGNOSTIC_STATUS = "COMPLETE";
      state.FINGER_CHAIN_RECOMMENDED_OWNER = "CANVAS_EXPRESSION_CHAIN_REVIEW";
      state.FINGER_CHAIN_RECOMMENDED_FILE = "/assets/hearth/hearth.canvas.expression.bridge.js";
      state.FINGER_CHAIN_RECOMMENDED_ACTION =
        "FINGER_CHAIN_CONNECTED_REVIEW_CANVAS_DRAW_PATH_OR_EXPRESSION_ADAPTER";
      state.CANVAS_EXPRESSION_INSTRUMENTATION_STATUS =
        "CANVAS_EXPRESSION_FINGER_CHAIN_CONNECTED_AND_INSPECTABLE";
      addNote(state, "FINGER_EXTENSION_CHAIN_CONNECTED_AND_INSPECTABLE");
      return;
    }

    if (allSource && allAlias && allReceipt) {
      state.FINGER_EXTENSION_CHAIN_STATUS = "FINGER_EXTENSION_CHAIN_CONNECTED_RECEIPTS_PRESENT_INSPECTION_API_PARTIAL";
      state.FINGER_CHAIN_DIAGNOSTIC_STATUS = "PARTIAL_INSPECTION_API";
      state.FINGER_CHAIN_RECOMMENDED_OWNER = "CANVAS_FINGER_INSPECTION_API";
      state.FINGER_CHAIN_RECOMMENDED_FILE = state.FINGER_CHAIN_FIRST_MISSING_CALLABLE;
      state.FINGER_CHAIN_RECOMMENDED_ACTION =
        "ADD_SAFE_INSPECT_GET_REPORT_GET_RECEIPT_SURFACE_TO_FINGER_FILE";
      state.CANVAS_EXPRESSION_INSTRUMENTATION_STATUS =
        "CANVAS_EXPRESSION_FINGER_CHAIN_RECEIPTS_PRESENT_INSPECTION_API_PARTIAL";
      addNote(state, "FINGER_EXTENSION_CHAIN_RECEIPTS_PRESENT_INSPECTION_API_PARTIAL");
      return;
    }

    if (allSource && allAlias) {
      state.FINGER_EXTENSION_CHAIN_STATUS = "FINGER_EXTENSION_CHAIN_ALIASES_PRESENT_RECEIPTS_PARTIAL";
      state.FINGER_CHAIN_DIAGNOSTIC_STATUS = "PARTIAL_RECEIPT_SURFACE";
      state.FINGER_CHAIN_RECOMMENDED_OWNER = "CANVAS_FINGER_RECEIPT_PUBLICATION";
      state.FINGER_CHAIN_RECOMMENDED_FILE = state.FINGER_CHAIN_FIRST_MISSING_RECEIPT;
      state.FINGER_CHAIN_RECOMMENDED_ACTION =
        "ADD_RECEIPT_PUBLICATION_TO_FINGER_FILE_WITHOUT_CHANGING_DRAWING_AUTHORITY";
      state.CANVAS_EXPRESSION_INSTRUMENTATION_STATUS =
        "CANVAS_EXPRESSION_FINGER_CHAIN_ALIASES_PRESENT_RECEIPTS_PARTIAL";
      addNote(state, "FINGER_EXTENSION_CHAIN_ALIASES_PRESENT_RECEIPTS_PARTIAL");
      return;
    }

    if (allSource) {
      state.FINGER_EXTENSION_CHAIN_STATUS = "FINGER_EXTENSION_FILES_EXIST_BUT_NOT_FULLY_CONNECTED_TO_RUNTIME_ALIASES";
      state.FINGER_CHAIN_DIAGNOSTIC_STATUS = "FILES_EXIST_ALIAS_CONNECTION_INCOMPLETE";
      state.FINGER_CHAIN_RECOMMENDED_OWNER = "CANVAS_EXPRESSION_BRIDGE_OR_FINGER_ALIAS_PUBLICATION";
      state.FINGER_CHAIN_RECOMMENDED_FILE = state.FINGER_CHAIN_FIRST_MISSING_ALIAS;
      state.FINGER_CHAIN_RECOMMENDED_ACTION =
        "CONNECT_EXISTING_FINGER_FILE_TO_DIAGNOSTIC_VISIBLE_ALIAS_AND_RECEIPT_SURFACE";
      state.CANVAS_EXPRESSION_INSTRUMENTATION_STATUS =
        "CANVAS_EXPRESSION_FINGER_FILES_EXIST_ALIAS_CONNECTION_INCOMPLETE";
      addNote(state, "FINGER_EXTENSION_FILES_EXIST_ALIAS_CONNECTION_INCOMPLETE");
      return;
    }

    state.FINGER_EXTENSION_CHAIN_STATUS = "FINGER_EXTENSION_CHAIN_PHYSICAL_FILES_INCOMPLETE";
    state.FINGER_CHAIN_DIAGNOSTIC_STATUS = "PHYSICAL_FILES_INCOMPLETE";
    state.FINGER_CHAIN_RECOMMENDED_OWNER = "CANVAS_FINGER_EXTENSION_FILE_CREATION_OR_DEPLOYMENT";
    state.FINGER_CHAIN_RECOMMENDED_FILE = state.FINGER_CHAIN_FIRST_MISSING_FILE;
    state.FINGER_CHAIN_RECOMMENDED_ACTION =
      "CRAFT_OR_DEPLOY_MISSING_FINGER_EXTENSION_FILE_BEFORE_CANVAS_DRAW_PATH_RENEWAL";
    state.CANVAS_EXPRESSION_INSTRUMENTATION_STATUS =
      "CANVAS_EXPRESSION_FINGER_EXTENSION_FILES_INCOMPLETE";
    addNote(state, "FINGER_EXTENSION_CHAIN_PHYSICAL_FILES_INCOMPLETE");
  }

  async function runProbeSouth(payload = {}) {
    const state = makeState();

    try {
      applyNorthPayload(state, payload);

      const contexts = uniqueContexts(payload);
      state.FINGER_EXTENSION_CONTEXTS_INSPECTED = contexts.map((context) => context.name).join(",") || "NONE";

      const rows = [];

      for (const spec of FINGER_FILES) {
        const row = await inspectFingerSpec(state, spec, contexts, payload);
        rows.push(row);
      }

      applyFingerRows(state, rows);

      state.PROBE_SOUTH_RUN_COMPLETE = true;
      state.PROBE_SOUTH_RUN_STATUS = "CALL_RETURNED";
      state.PROBE_SOUTH_RETURN_PACKET_READY = true;
      state.RECEIPT_RETURN_MECHANISM_STATUS = "RESTORED_AND_EXTENDED";
      state.DIAGNOSTIC_RECEIPT_RETURN_STATUS =
        "RETURN_SURFACE_READY_WITH_FINGER_EXTENSION_INSPECTION";
      state.RETURN_REPORT_OBJECT_AVAILABLE = true;
      state.RETURN_PACKET_TEXT_AVAILABLE = true;
      state.RETURN_COMPACT_SUMMARY_AVAILABLE = true;
      state.RETURN_RECEIPT_OBJECT_AVAILABLE = true;
      state.NORTH_READABLE_RECEIPT_SURFACE_READY = true;
      state.DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY = true;

      state.SECONDARY_EVIDENCE_NOTES = normalizeNotes(state.notes).join(" | ");
      state.PROBE_SOUTH_NOTES = state.SECONDARY_EVIDENCE_NOTES;

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        report: clonePlain(lastReport),
        REPORT_OBJECT: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        receiptObject: getReceipt(),
        state: getState(),
        ...clonePlain(lastReport)
      };
    } catch (error) {
      state.PROBE_SOUTH_RUN_COMPLETE = false;
      state.PROBE_SOUTH_RUN_STATUS = "CALL_FAILED";
      state.PROBE_SOUTH_RETURN_PACKET_READY = true;
      state.RECEIPT_RETURN_MECHANISM_STATUS = "RESTORED_WITH_PROBE_ERROR_PACKET";
      state.DIAGNOSTIC_RECEIPT_RETURN_STATUS =
        "RETURN_SURFACE_READY_WITH_PROBE_ERROR_PACKET";
      state.FINGER_EXTENSION_CHAIN_STATUS = "FINGER_EXTENSION_INSPECTION_ERROR";
      state.FINGER_CHAIN_DIAGNOSTIC_STATUS = "ERROR";
      state.FINGER_CHAIN_FIRST_CALL_FAILURE = bounded(error && error.message ? error.message : error, 1000);
      state.FINGER_CHAIN_RECOMMENDED_OWNER = "DIAGNOSTIC_PROBE_SOUTH";
      state.FINGER_CHAIN_RECOMMENDED_FILE = FILE;
      state.FINGER_CHAIN_RECOMMENDED_ACTION =
        "REVIEW_PROBE_SOUTH_FINGER_EXTENSION_INSPECTION_ERROR";
      addNote(state, `PROBE_SOUTH_TOP_LEVEL_ERROR:${state.FINGER_CHAIN_FIRST_CALL_FAILURE}`);

      state.SECONDARY_EVIDENCE_NOTES = normalizeNotes(state.notes).join(" | ");
      state.PROBE_SOUTH_NOTES = state.SECONDARY_EVIDENCE_NOTES;

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: state.FINGER_CHAIN_FIRST_CALL_FAILURE,
        report: clonePlain(lastReport),
        REPORT_OBJECT: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        receiptObject: getReceipt(),
        state: getState(),
        ...clonePlain(lastReport)
      };
    }
  }

  function buildReportObject(state) {
    const report = {
      ...clonePlain(state),

      PACKET_NAME: "HEARTH_DIAGNOSTIC_PROBE_SOUTH_RETURN_PACKET_v1",
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: state.DIAGNOSTIC_TIMESTAMP || nowIso(),

      PROBE_SOUTH_STATUS: "ACTIVE",
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_CARRIER_FILE: FILE,

      PROBE_SOUTH_PACKET_MEANING_PRESERVED: true,
      PROBE_SOUTH_MEANING_STATUS: "PRESERVED",
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: "READY",
      RETURN_REPORT_OBJECT_AVAILABLE: true,
      RETURN_PACKET_TEXT_AVAILABLE: true,
      RETURN_COMPACT_SUMMARY_AVAILABLE: true,
      RETURN_RECEIPT_OBJECT_AVAILABLE: true,
      NORTH_READABLE_RECEIPT_SURFACE_READY: true,
      DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY: true,

      FINGER_EXTENSION_CHAIN_INSPECTION_ACTIVE: true,
      FINGER_EXTENSION_DYNAMIC_LOADING_OWNED: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    delete report.notes;

    return report;
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",

      "PROBE_SOUTH_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_IMPLEMENTATION_CONTRACT",
      "PROBE_SOUTH_IMPLEMENTATION_RECEIPT",
      "PROBE_SOUTH_VERSION",
      "PROBE_SOUTH_CARRIER_FILE",
      "PROBE_SOUTH_CHRONOLOGY_ORDER",
      "PROBE_SOUTH_FIBONACCI_STAGE",
      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_ROLE",
      "PROBE_SOUTH_AUTHORITY",
      "PROBE_SOUTH_SOURCE_PATH",
      "PROBE_SOUTH_PHYSICAL_FILE_OBSERVED",
      "PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY",
      "PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED",
      "PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL",
      "PROBE_SOUTH_PUBLISHED_AS_PHYSICAL_FILE",
      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_PACKET_MEANING_PRESERVED",
      "PROBE_SOUTH_MEANING_STATUS",
      "PROBE_SOUTH_RETURN_TO_NORTH_STATUS",
      "PROBE_SOUTH_RETURN_PACKET_READY",

      "RECEIPT_RETURN_MECHANISM_STATUS",
      "DIAGNOSTIC_RECEIPT_RETURN_STATUS",
      "RETURN_REPORT_OBJECT_AVAILABLE",
      "RETURN_PACKET_TEXT_AVAILABLE",
      "RETURN_COMPACT_SUMMARY_AVAILABLE",
      "RETURN_RECEIPT_OBJECT_AVAILABLE",
      "NORTH_READABLE_RECEIPT_SURFACE_READY",
      "DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY",

      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "PREVIOUS_NORTH_RECEIPT",
      "LINEAGE_V9_NORTH_CONTRACT",
      "LINEAGE_V8_NORTH_CONTRACT",
      "LINEAGE_V7_NORTH_CONTRACT",
      "BASELINE_V6_NORTH_CONTRACT",
      "FOUNDATION_V5_NORTH_CONTRACT",

      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "NINE_STEP_CHRONOLOGY_ACTIVE",
      "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",

      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_WEST_FILE",
      "RAIL_SOUTH_FILE",
      "PROBE_NORTH_FILE",
      "PROBE_EAST_FILE",
      "PROBE_WEST_FILE",
      "PROBE_CANVAS_SURFACE_TRUTH_FILE",
      "PROBE_SOUTH_FILE",

      "FINGER_EXTENSION_CHAIN_INSPECTION_ACTIVE",
      "FINGER_EXTENSION_DYNAMIC_LOADING_OWNED",
      "FINGER_EXTENSION_SOURCE_FETCH_AUTHORIZED",
      "FINGER_EXTENSION_CONTEXTS_INSPECTED",
      "FINGER_EXTENSION_EXPECTED_COUNT",
      "FINGER_EXTENSION_EXPECTED_FILES",
      "FINGER_EXTENSION_CHAIN_STATUS",
      "FINGER_CHAIN_DIAGNOSTIC_STATUS",
      "FINGER_CHAIN_SOURCE_PRESENT_COUNT",
      "FINGER_CHAIN_SCRIPT_PRESENT_COUNT",
      "FINGER_CHAIN_ALIAS_OBSERVED_COUNT",
      "FINGER_CHAIN_RECEIPT_COUNT",
      "FINGER_CHAIN_CALLABLE_COUNT",
      "FINGER_CHAIN_INSPECTION_RETURN_COUNT",
      "FINGER_CHAIN_FIRST_MISSING_FILE",
      "FINGER_CHAIN_FIRST_MISSING_ALIAS",
      "FINGER_CHAIN_FIRST_MISSING_RECEIPT",
      "FINGER_CHAIN_FIRST_MISSING_CALLABLE",
      "FINGER_CHAIN_FIRST_CALL_FAILURE",
      "FINGER_CHAIN_RECOMMENDED_OWNER",
      "FINGER_CHAIN_RECOMMENDED_FILE",
      "FINGER_CHAIN_RECOMMENDED_ACTION",

      "FINGER_EXPRESSION_BRIDGE_FILE_OBSERVED",
      "FINGER_INSPECT_FILE_OBSERVED",
      "FINGER_SURFACE_FILE_OBSERVED",
      "FINGER_CHAIN_INSPECTION_TABLE",

      "EXPRESSION_BRIDGE_STATUS",
      "FINGER_ATMOSPHERE_STATUS",
      "FINGER_BOUNDARY_STATUS",
      "FINGER_COMPOSITE_STATUS",
      "FINGER_ELEVATION_STATUS",
      "FINGER_HYDROLOGY_STATUS",
      "FINGER_INSPECT_STATUS",
      "FINGER_LANDFORM_STATUS",
      "FINGER_LIGHT_STATUS",
      "FINGER_LIGHTING_STATUS",
      "FINGER_MASS_STATUS",
      "FINGER_MATERIAL_STATUS",
      "FINGER_SURFACE_STATUS",

      "CANVAS_EXPRESSION_INSTRUMENTATION_STATUS",
      "FILE_COMPOSITION_STATUS",
      "DIAGNOSTIC_INSTRUMENT_STATUS",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_MEANING_PRESERVED",

      "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",

      "SECONDARY_EVIDENCE_NOTES",
      "PROBE_SOUTH_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const out = [];
    const seen = new Set();

    for (const field of priority.concat(Object.keys(report || {}))) {
      if (seen.has(field)) continue;
      seen.add(field);
      out.push(field);
    }

    return out;
  }

  function composePacketText(report) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("PROBE_SOUTH_CONTRACT", getValue(report, "PROBE_SOUTH_CONTRACT", CONTRACT)),
      line("PROBE_SOUTH_IMPLEMENTATION_CONTRACT", getValue(report, "PROBE_SOUTH_IMPLEMENTATION_CONTRACT", IMPLEMENTATION_CONTRACT)),
      line("RECEIPT_RETURN_MECHANISM_STATUS", getValue(report, "RECEIPT_RETURN_MECHANISM_STATUS", "UNKNOWN")),
      line("DIAGNOSTIC_RECEIPT_RETURN_STATUS", getValue(report, "DIAGNOSTIC_RECEIPT_RETURN_STATUS", "UNKNOWN")),
      line("FINGER_EXTENSION_CHAIN_INSPECTION_ACTIVE", getValue(report, "FINGER_EXTENSION_CHAIN_INSPECTION_ACTIVE", "UNKNOWN")),
      line("FINGER_EXTENSION_CHAIN_STATUS", getValue(report, "FINGER_EXTENSION_CHAIN_STATUS", "UNKNOWN")),
      line("FINGER_CHAIN_SOURCE_PRESENT_COUNT", getValue(report, "FINGER_CHAIN_SOURCE_PRESENT_COUNT", "UNKNOWN")),
      line("FINGER_CHAIN_ALIAS_OBSERVED_COUNT", getValue(report, "FINGER_CHAIN_ALIAS_OBSERVED_COUNT", "UNKNOWN")),
      line("FINGER_CHAIN_RECEIPT_COUNT", getValue(report, "FINGER_CHAIN_RECEIPT_COUNT", "UNKNOWN")),
      line("FINGER_CHAIN_CALLABLE_COUNT", getValue(report, "FINGER_CHAIN_CALLABLE_COUNT", "UNKNOWN")),
      line("FINGER_CHAIN_INSPECTION_RETURN_COUNT", getValue(report, "FINGER_CHAIN_INSPECTION_RETURN_COUNT", "UNKNOWN")),
      line("FINGER_CHAIN_FIRST_MISSING_FILE", getValue(report, "FINGER_CHAIN_FIRST_MISSING_FILE", "UNKNOWN")),
      line("FINGER_CHAIN_FIRST_MISSING_ALIAS", getValue(report, "FINGER_CHAIN_FIRST_MISSING_ALIAS", "UNKNOWN")),
      line("FINGER_CHAIN_FIRST_MISSING_RECEIPT", getValue(report, "FINGER_CHAIN_FIRST_MISSING_RECEIPT", "UNKNOWN")),
      line("FINGER_CHAIN_FIRST_MISSING_CALLABLE", getValue(report, "FINGER_CHAIN_FIRST_MISSING_CALLABLE", "UNKNOWN")),
      line("FINGER_CHAIN_RECOMMENDED_FILE", getValue(report, "FINGER_CHAIN_RECOMMENDED_FILE", "UNKNOWN")),
      line("FINGER_CHAIN_RECOMMENDED_ACTION", getValue(report, "FINGER_CHAIN_RECOMMENDED_ACTION", "UNKNOWN"))
    ].join("\n");
  }

  function publish(state) {
    const report = buildReportObject(state);
    const packetText = composePacketText(report);
    const compactSummary = composeCompactSummary(report);

    lastState = clonePlain(state);
    lastReport = clonePlain(report);
    lastPacketText = packetText;
    lastCompactSummary = compactSummary;

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeSouth = api;
    root.HEARTH.diagnosticRailProbeSouth = api;
    root.HEARTH.diagnosticSouthProbe = api;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(report);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(report);

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = packetText;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = packetText;
  }

  function getReport() {
    return clonePlain(lastReport || buildReportObject(makeState()));
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;
    return composePacketText(getReport());
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;
    return composeCompactSummary(getReport());
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  function getReceiptLight() {
    const report = getReport();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      probeSouthStatus: getValue(report, "PROBE_SOUTH_STATUS", "ACTIVE"),
      probeSouthRunComplete: getValue(report, "PROBE_SOUTH_RUN_COMPLETE", "false"),
      probeSouthRunStatus: getValue(report, "PROBE_SOUTH_RUN_STATUS", "NOT_RUN"),
      probeSouthPacketMeaningPreserved: true,
      probeSouthReturnToNorthStatus: getValue(report, "PROBE_SOUTH_RETURN_TO_NORTH_STATUS", "READY"),

      receiptReturnMechanismStatus: getValue(report, "RECEIPT_RETURN_MECHANISM_STATUS", "READY"),
      diagnosticReceiptReturnStatus: getValue(report, "DIAGNOSTIC_RECEIPT_RETURN_STATUS", "READY"),
      returnReportObjectAvailable: true,
      returnPacketTextAvailable: true,
      returnCompactSummaryAvailable: true,
      returnReceiptObjectAvailable: true,
      northReadableReceiptSurfaceReady: true,
      diagnosticUiReadableReceiptSurfaceReady: true,

      fingerExtensionChainInspectionActive: true,
      fingerExtensionDynamicLoadingOwned: false,
      fingerExtensionExpectedCount: FINGER_FILES.length,
      fingerExtensionChainStatus: getValue(report, "FINGER_EXTENSION_CHAIN_STATUS", "NOT_RUN"),
      fingerChainDiagnosticStatus: getValue(report, "FINGER_CHAIN_DIAGNOSTIC_STATUS", "NOT_RUN"),
      fingerChainSourcePresentCount: getValue(report, "FINGER_CHAIN_SOURCE_PRESENT_COUNT", "0"),
      fingerChainAliasObservedCount: getValue(report, "FINGER_CHAIN_ALIAS_OBSERVED_COUNT", "0"),
      fingerChainReceiptCount: getValue(report, "FINGER_CHAIN_RECEIPT_COUNT", "0"),
      fingerChainCallableCount: getValue(report, "FINGER_CHAIN_CALLABLE_COUNT", "0"),
      fingerChainInspectionReturnCount: getValue(report, "FINGER_CHAIN_INSPECTION_RETURN_COUNT", "0"),
      fingerChainFirstMissingFile: getValue(report, "FINGER_CHAIN_FIRST_MISSING_FILE", "UNKNOWN"),
      fingerChainFirstMissingAlias: getValue(report, "FINGER_CHAIN_FIRST_MISSING_ALIAS", "UNKNOWN"),
      fingerChainRecommendedFile: getValue(report, "FINGER_CHAIN_RECOMMENDED_FILE", "UNKNOWN"),
      fingerChainRecommendedAction: getValue(report, "FINGER_CHAIN_RECOMMENDED_ACTION", "UNKNOWN"),

      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,

      ...NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      northContract: NORTH_CONTRACT,
      northReceipt: NORTH_RECEIPT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,
      previousNorthReceipt: PREVIOUS_NORTH_RECEIPT,

      railNorthFile: RAIL_NORTH_FILE,
      railEastFile: RAIL_EAST_FILE,
      railWestFile: RAIL_WEST_FILE,
      railSouthFile: RAIL_SOUTH_FILE,
      probeNorthFile: PROBE_NORTH_FILE,
      probeEastFile: PROBE_EAST_FILE,
      probeWestFile: PROBE_WEST_FILE,
      probeCanvasSurfaceTruthFile: PROBE_CANVAS_SURFACE_TRUTH_FILE,
      probeSouthFile: PROBE_SOUTH_FILE,

      fingerFiles: clonePlain(FINGER_FILES),
      reportObject: getReport(),
      packetText: getPacketText(),
      compactSummary: getCompactSummary(),

      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      inspectFingerExtensionsApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getStateApiAvailable: true
    };
  }

  async function inspectPacketMeaning(payload = {}) {
    return runProbeSouth(payload);
  }

  async function inspectPacketComposition(payload = {}) {
    return runProbeSouth(payload);
  }

  async function inspectFingerExtensions(payload = {}) {
    return runProbeSouth(payload);
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    probeSouthStatus: "ACTIVE",
    probeSouthRole: "packet-meaning-file-composition-probe",
    probeSouthAuthority: "DIAGNOSTIC_PROBE_SOUTH",
    probeSouthChronologyOrder: 9,
    probeSouthFibonacciStage: "F55",
    probeSouthPacketMeaningPreserved: true,
    probeSouthReturnToNorthStatus: "READY",

    fingerExtensionChainInspectionActive: true,
    fingerExtensionDynamicLoadingOwned: false,
    fingerFiles: FINGER_FILES,

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    inspectFingerExtensions,
    runProbe: runProbeSouth,
    inspect: runProbeSouth,
    runDiagnostic: runProbeSouth,

    getReport,
    getPacketText,
    getCompactSummary,
    getReceipt,
    getReceiptLight,
    getState,

    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,

    ...NO_CLAIMS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
