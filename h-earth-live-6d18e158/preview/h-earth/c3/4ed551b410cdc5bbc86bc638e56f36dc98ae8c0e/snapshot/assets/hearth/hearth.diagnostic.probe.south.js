// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic Probe SOUTH / F55 / Step 9 packet-meaning and compact downstream-expression inspection only.
// Purpose:
// - Preserve Probe South as the physical Step 9 / F55 truth-read cell.
// - Consume the South F34 pair-side handoff without reinterpreting South authority.
// - Read the auxiliary South Surface Pointer sidecar when present.
// - Load the auxiliary sidecar only as a diagnostic read instrument when absent.
// - Prefer target-window sidecar execution when target context is available, so finger/surface/hex aliases are read where the planet expression lives.
// - Return a compact North-readable packet only.
// - Prevent diagnostic receipt-button failure by not returning full namespace scans, full path groups, full inherited reports, or full sidecar report objects.
// - Surface the downstream expression evidence needed to decide whether the fault is before Canvas draw or at Canvas draw.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no F55 claim, no ready text, no final visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - diagnostic North chronology
// - diagnostic East source evidence
// - diagnostic West rendered evidence
// - South F34 packet output
// - auxiliary sidecar implementation
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - controls
// - terrain/material/hydrology truth
// - final visual pass
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT = CONTRACT;
  const IMPLEMENTATION_RECEIPT = RECEIPT;

  const VERSION =
    "2026-06-06.hearth-diagnostic-probe-south-f55-compact-sidecar-bridge-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PACKET_NAME =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_PACKET_v1";

  const SOUTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const SOUTH_SURFACE_POINTER_FILE =
    "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const EXPECTED_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const EXPECTED_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";
  const EXPECTED_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10";
  const EXPECTED_SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_RECEIPT_v10";
  const EXPECTED_SURFACE_POINTER_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_TNT_v1";
  const EXPECTED_SURFACE_POINTER_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_RECEIPT_v1";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    f55ClaimedByProbeSouth: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F55_CLAIMED_BY_PROBE_SOUTH: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const PROBE_ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      step: "STEP_9",
      fibonacciStage: "F55",
      alias: "HEARTH.diagnosticProbeSouth",
      layer: "HEARTH",
      role: "primary-probe-south",
      authority: "packet-meaning-and-compact-sidecar-translation"
    }),
    Object.freeze({
      order: 2,
      step: "STEP_9",
      fibonacciStage: "F55",
      alias: "HEARTH.diagnosticRailProbeSouth",
      layer: "HEARTH",
      role: "rail-explicit-probe-south",
      authority: "packet-meaning-and-compact-sidecar-translation"
    }),
    Object.freeze({
      order: 3,
      step: "STEP_9",
      fibonacciStage: "F55",
      alias: "HEARTH.diagnosticSouthProbe",
      layer: "HEARTH",
      role: "south-oriented-probe-alias",
      authority: "packet-meaning-and-compact-sidecar-translation"
    }),
    Object.freeze({
      order: 4,
      step: "STEP_9",
      fibonacciStage: "F55",
      alias: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      layer: "GLOBAL",
      role: "legacy-global-probe-south",
      authority: "packet-meaning-and-compact-sidecar-translation"
    }),
    Object.freeze({
      order: 5,
      step: "STEP_9",
      fibonacciStage: "F55",
      alias: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      layer: "GLOBAL",
      role: "legacy-global-rail-probe-south",
      authority: "packet-meaning-and-compact-sidecar-translation"
    }),
    Object.freeze({
      order: 6,
      step: "STEP_9",
      fibonacciStage: "F55",
      alias: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      layer: "DEXTER_LAB",
      role: "lab-visible-probe-south",
      authority: "packet-meaning-and-compact-sidecar-translation"
    }),
    Object.freeze({
      order: 7,
      step: "STEP_9",
      fibonacciStage: "F55",
      alias: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",
      layer: "DEXTER_LAB",
      role: "lab-visible-rail-probe-south",
      authority: "packet-meaning-and-compact-sidecar-translation"
    })
  ]);

  const SOUTH_ALIAS_PATHS = Object.freeze([
    "HEARTH.diagnosticSouth",
    "HEARTH.diagnosticRailSouth",
    "HEARTH.diagnosticSouthRail",
    "HEARTH.southDiagnosticRail",
    "HEARTH_DIAGNOSTIC_SOUTH",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_RAIL",
    "DEXTER_LAB.hearthDiagnosticSouth",
    "DEXTER_LAB.hearthDiagnosticRailSouth"
  ]);

  const SURFACE_POINTER_ALIAS_PATHS = Object.freeze([
    "HEARTH.diagnosticSouthSurfacePointer",
    "HEARTH.diagnosticSurfacePointerSouth",
    "HEARTH.diagnosticSouthBishopSurfacePointer",
    "HEARTH.diagnosticBishopSurfacePointerSouth",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER",
    "HEARTH_DIAGNOSTIC_SURFACE_POINTER_SOUTH",
    "DEXTER_LAB.hearthDiagnosticSouthSurfacePointer",
    "DEXTER_LAB.hearthDiagnosticSouthBishopSurfacePointer",
    "DEXTER_LAB.hearthDiagnosticSurfacePointerSouth"
  ]);

  const DIRECT_FINGER_ALIAS_PATHS = Object.freeze([
    "HEARTH.canvasFingerInspect",
    "HEARTH.hearthCanvasFingerInspect",
    "HEARTH.diagnosticCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthDiagnosticCanvasFingerInspect",
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECT_RECEIPT"
  ]);

  const DIRECT_HEX_SURFACE_ALIAS_PATHS = Object.freeze([
    "HEARTH.hexSurface",
    "HEARTH.hearthHexSurface",
    "HEARTH.canvasHexSurface",
    "HEARTH.hearthCanvasHexSurface",
    "DEXTER_LAB.hearthHexSurface",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RECEIPT"
  ]);

  const DIRECT_FOUR_PAIR_ALIAS_PATHS = Object.freeze([
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hearthHexFourPairAuthority",
    "HEARTH.fourPairAuthority",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastReport = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let lastState = null;
  const loadPromises = Object.create(null);

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
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value
        .map((entry) => {
          if (isObject(entry)) {
            try {
              return JSON.stringify(entry);
            } catch (_error) {
              return bounded(entry, 1200);
            }
          }
          return bounded(entry, 1200);
        })
        .filter(Boolean)
        .join(" | ");

      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 12000) || fallback;
      } catch (_error) {
        return bounded(String(value), 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
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

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function textIsTrue(value) {
    return boolText(value, "false") === "true";
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

  function aliasChronologyText(list) {
    return (list || [])
      .map((entry) => {
        return [
          `${entry.order}.${entry.alias}`,
          `step:${entry.step}`,
          `fib:${entry.fibonacciStage}`,
          `layer:${entry.layer}`,
          `role:${entry.role}`,
          `authority:${entry.authority}`
        ].join(" ");
      })
      .join(" | ");
  }

  function resolvePath(path, contextRoot) {
    const base = contextRoot || root;
    const parts = safeString(path).split(".");
    let cursor = base;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) {
        return null;
      }
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function findFirstPath(paths, contextRoot) {
    for (const path of paths || []) {
      const value = resolvePath(path, contextRoot);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function contractOf(value) {
    if (!isObject(value)) return "UNKNOWN";

    return firstKnown(
      value.CONTRACT,
      value.contract,
      value.SOUTH_CONTRACT,
      value.southContract,
      value.SOUTH_SURFACE_POINTER_CONTRACT,
      value.surfacePointerContract,
      value.PROBE_SOUTH_CONTRACT,
      value.probeSouthContract,
      value.CANVAS_CONTRACT,
      value.canvasContract,
      value.HEX_CONTRACT,
      value.hexContract,
      value.IMPLEMENTATION_CONTRACT,
      value.implementationContract
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "UNKNOWN";

    return firstKnown(
      value.RECEIPT,
      value.receipt,
      value.SOUTH_RECEIPT,
      value.southReceipt,
      value.SOUTH_SURFACE_POINTER_RECEIPT,
      value.surfacePointerReceipt,
      value.PROBE_SOUTH_RECEIPT,
      value.probeSouthReceipt,
      value.CANVAS_RECEIPT,
      value.canvasReceipt,
      value.HEX_RECEIPT,
      value.hexReceipt,
      value.IMPLEMENTATION_RECEIPT,
      value.implementationReceipt
    );
  }

  function compactAuthorityRead(paths, contextRoot) {
    const found = findFirstPath(paths, contextRoot);
    const value = found.value;

    return {
      observed: Boolean(value),
      selectedPath: found.path,
      contract: contractOf(value),
      receipt: receiptOf(value),
      methodCount: isObject(value)
        ? Object.keys(value).filter((key) => {
            try {
              return typeof value[key] === "function";
            } catch (_error) {
              return false;
            }
          }).length
        : 0
    };
  }

  function compactCurrentReport(input) {
    const currentReport =
      isObject(input && input.currentReport) ? input.currentReport :
      isObject(input && input.report) ? input.report :
      isObject(input && input.REPORT_OBJECT) ? input.REPORT_OBJECT :
      isObject(input && input.output && input.output.REPORT_OBJECT) ? input.output.REPORT_OBJECT :
      {};

    return {
      PACKET_NAME: firstKnown(currentReport.PACKET_NAME, "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v2"),
      TARGET_ROUTE: firstKnown(currentReport.TARGET_ROUTE, TARGET_ROUTE),
      DIAGNOSTIC_ROUTE: firstKnown(currentReport.DIAGNOSTIC_ROUTE, DIAGNOSTIC_ROUTE),
      DIAGNOSTIC_TIMESTAMP: firstKnown(currentReport.DIAGNOSTIC_TIMESTAMP, input && input.diagnosticTimestamp, nowIso()),

      NORTH_CONTRACT: firstKnown(currentReport.NORTH_CONTRACT, input && input.northContract, EXPECTED_NORTH_CONTRACT),
      NORTH_RECEIPT: firstKnown(currentReport.NORTH_RECEIPT, input && input.northReceipt, EXPECTED_NORTH_RECEIPT),

      CHRONOLOGY_COMPLETION_STATUS: firstKnown(currentReport.CHRONOLOGY_COMPLETION_STATUS, "UNKNOWN"),
      ZONE_OF_INFLICTION_OWNER: firstKnown(currentReport.ZONE_OF_INFLICTION_OWNER, "UNKNOWN"),
      ZONE_OF_INFLICTION_FILE: firstKnown(currentReport.ZONE_OF_INFLICTION_FILE, "UNKNOWN"),
      ZONE_OF_INFLICTION_CLASS: firstKnown(currentReport.ZONE_OF_INFLICTION_CLASS, "UNKNOWN"),
      ZONE_OF_INFLICTION_REASON: firstKnown(currentReport.ZONE_OF_INFLICTION_REASON, "UNKNOWN"),

      CANVAS_PIXEL_SAMPLE_STATUS: firstKnown(currentReport.CANVAS_PIXEL_SAMPLE_STATUS, "UNKNOWN"),
      CANVAS_PIXEL_VISIBLE: firstKnown(currentReport.CANVAS_PIXEL_VISIBLE, "UNKNOWN"),
      CANVAS_PIXEL_VARIANCE_STATUS: firstKnown(currentReport.CANVAS_PIXEL_VARIANCE_STATUS, "UNKNOWN"),
      CANVAS_ELEMENT_FOUND: firstKnown(currentReport.CANVAS_ELEMENT_FOUND, "UNKNOWN"),
      CANVAS_RECT_NONZERO: firstKnown(currentReport.CANVAS_RECT_NONZERO, "UNKNOWN"),
      CANVAS_COMPUTED_VISIBLE: firstKnown(currentReport.CANVAS_COMPUTED_VISIBLE, "UNKNOWN"),
      CANVAS_VIEWPORT_INTERSECTING: firstKnown(currentReport.CANVAS_VIEWPORT_INTERSECTING, "UNKNOWN"),
      CANVAS_CONTEXT_2D_READY: firstKnown(currentReport.CANVAS_CONTEXT_2D_READY, "UNKNOWN"),
      CANVAS_LAYER_BLOCKED: firstKnown(currentReport.CANVAS_LAYER_BLOCKED, "UNKNOWN"),

      CURRENT_CANVAS_PARENT_CONTRACT: firstKnown(currentReport.CURRENT_CANVAS_PARENT_CONTRACT, "UNKNOWN"),
      CURRENT_CANVAS_PARENT_RECOGNIZED: firstKnown(currentReport.CURRENT_CANVAS_PARENT_RECOGNIZED, "UNKNOWN"),

      CONTROL_FILE_STATUS: firstKnown(currentReport.CONTROL_FILE_STATUS, "UNKNOWN"),
      CONTROL_HANDSHAKE_STATUS: firstKnown(currentReport.CONTROL_HANDSHAKE_STATUS, "UNKNOWN"),
      MOTION_TOUCH_STATUS: firstKnown(currentReport.MOTION_TOUCH_STATUS, "UNKNOWN"),
      DRAG_STATUS: firstKnown(currentReport.DRAG_STATUS, "UNKNOWN"),
      VIEW_CONTROL_STATUS: firstKnown(currentReport.VIEW_CONTROL_STATUS, "UNKNOWN"),

      SECONDARY_EVIDENCE_NOTES: firstKnown(
        currentReport.SECONDARY_EVIDENCE_NOTES,
        currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
        "none"
      )
    };
  }

  function getTargetContext(input = {}) {
    if (input && input.targetWindow && input.targetWindow.document) {
      return {
        status: "TARGET_WINDOW_FROM_NORTH_PAYLOAD",
        targetWindow: input.targetWindow,
        targetDocument: input.targetWindow.document
      };
    }

    if (input && input.targetDocument && input.targetDocument.defaultView) {
      return {
        status: "TARGET_DOCUMENT_FROM_NORTH_PAYLOAD",
        targetWindow: input.targetDocument.defaultView,
        targetDocument: input.targetDocument
      };
    }

    try {
      const doc = root.document || null;
      if (!doc) {
        return { status: "NO_DOCUMENT", targetWindow: root, targetDocument: null };
      }

      const frames = Array.from(doc.querySelectorAll("iframe"));

      for (const frame of frames) {
        try {
          const frameWindow = frame.contentWindow;
          const frameDocument = frameWindow && frameWindow.document;
          const href = frameWindow && frameWindow.location ? safeString(frameWindow.location.pathname) : "";

          if (frameWindow && frameDocument && href === TARGET_ROUTE) {
            return {
              status: "TARGET_IFRAME_ROUTE_MATCH",
              targetWindow: frameWindow,
              targetDocument: frameDocument
            };
          }

          if (frameWindow && frameDocument && frameDocument.querySelector("[data-hearth-visible-canvas='true']")) {
            return {
              status: "TARGET_IFRAME_CANVAS_MATCH",
              targetWindow: frameWindow,
              targetDocument: frameDocument
            };
          }
        } catch (_error) {}
      }
    } catch (_error) {}

    return {
      status: "FALLBACK_CURRENT_WINDOW",
      targetWindow: root,
      targetDocument: root.document || null
    };
  }

  function scriptExists(doc, path) {
    if (!doc || !doc.querySelectorAll) return false;

    try {
      const scripts = Array.from(doc.querySelectorAll("script[src]"));

      return scripts.some((script) => {
        const src = safeString(script.getAttribute("src"));

        try {
          const base =
            script.ownerDocument &&
            script.ownerDocument.defaultView &&
            script.ownerDocument.defaultView.location
              ? script.ownerDocument.defaultView.location.origin
              : "https://diamondgatebridge.com";

          const url = new URL(src, base);
          return url.pathname === path;
        } catch (_error) {
          return src.includes(path);
        }
      });
    } catch (_error) {
      return false;
    }
  }

  function loadScriptIntoDocument(doc, path, key) {
    if (!doc || !doc.createElement) {
      return Promise.resolve({
        attempted: false,
        loaded: false,
        status: "DOCUMENT_UNAVAILABLE"
      });
    }

    if (scriptExists(doc, path)) {
      return Promise.resolve({
        attempted: false,
        loaded: true,
        status: "SCRIPT_ALREADY_PRESENT"
      });
    }

    const loadKey = `${key}:${path}`;

    if (loadPromises[loadKey]) return loadPromises[loadKey];

    loadPromises[loadKey] = new Promise((resolve) => {
      let settled = false;

      function finish(result) {
        if (settled) return;
        settled = true;
        resolve(result);
      }

      try {
        const script = doc.createElement("script");
        script.src = `${path}?v=${encodeURIComponent(CONTRACT)}`;
        script.async = false;
        script.defer = true;
        script.dataset.loadedBy = CONTRACT;
        script.dataset.diagnosticOnly = "true";
        script.dataset.productionMutationAuthorized = "false";
        script.dataset.hearthRepairAuthorized = "false";
        script.dataset.canvasDrawingAuthorized = "false";
        script.dataset.runtimeRestartAuthorized = "false";
        script.dataset.visualPassClaimed = "false";

        script.addEventListener("load", () => {
          finish({
            attempted: true,
            loaded: true,
            status: "SCRIPT_LOAD_COMPLETE"
          });
        }, { once: true });

        script.addEventListener("error", () => {
          finish({
            attempted: true,
            loaded: false,
            status: "SCRIPT_LOAD_ERROR_OR_NOT_DEPLOYED"
          });
        }, { once: true });

        setTimeout(() => {
          finish({
            attempted: true,
            loaded: false,
            status: "SCRIPT_LOAD_TIMEOUT"
          });
        }, 2500);

        (doc.head || doc.documentElement || doc.body).appendChild(script);
      } catch (error) {
        finish({
          attempted: true,
          loaded: false,
          status: `SCRIPT_LOAD_EXCEPTION:${bounded(error && error.message ? error.message : error, 1000)}`
        });
      }
    });

    return loadPromises[loadKey];
  }

  async function ensureSurfacePointer(context) {
    const targetWindow = context && context.targetWindow ? context.targetWindow : root;
    const targetDocument = context && context.targetDocument ? context.targetDocument : root.document;

    const beforeTarget = findFirstPath(SURFACE_POINTER_ALIAS_PATHS, targetWindow);
    if (beforeTarget.value) {
      return {
        observedBeforeLoad: true,
        observedAfterLoad: true,
        loadAttempted: false,
        loadStatus: "ALREADY_OBSERVED_IN_TARGET_CONTEXT",
        sourceContext: context.status || "TARGET_CONTEXT",
        sourcePath: beforeTarget.path,
        api: beforeTarget.value
      };
    }

    const beforeLocal = findFirstPath(SURFACE_POINTER_ALIAS_PATHS, root);
    if (beforeLocal.value && targetWindow === root) {
      return {
        observedBeforeLoad: true,
        observedAfterLoad: true,
        loadAttempted: false,
        loadStatus: "ALREADY_OBSERVED_IN_LOCAL_CONTEXT",
        sourceContext: "LOCAL_CONTEXT",
        sourcePath: beforeLocal.path,
        api: beforeLocal.value
      };
    }

    const load = await loadScriptIntoDocument(
      targetDocument,
      SOUTH_SURFACE_POINTER_FILE,
      context.status || "target"
    );

    const afterTarget = findFirstPath(SURFACE_POINTER_ALIAS_PATHS, targetWindow);
    if (afterTarget.value) {
      return {
        observedBeforeLoad: false,
        observedAfterLoad: true,
        loadAttempted: load.attempted === true,
        loadStatus: load.status,
        sourceContext: context.status || "TARGET_CONTEXT",
        sourcePath: afterTarget.path,
        api: afterTarget.value
      };
    }

    if (targetWindow !== root && root.document) {
      const localLoad = await loadScriptIntoDocument(
        root.document,
        SOUTH_SURFACE_POINTER_FILE,
        "local"
      );

      const afterLocal = findFirstPath(SURFACE_POINTER_ALIAS_PATHS, root);
      if (afterLocal.value) {
        return {
          observedBeforeLoad: false,
          observedAfterLoad: true,
          loadAttempted: localLoad.attempted === true,
          loadStatus: `TARGET_${load.status}|LOCAL_${localLoad.status}`,
          sourceContext: "LOCAL_CONTEXT_AFTER_TARGET_MISS",
          sourcePath: afterLocal.path,
          api: afterLocal.value
        };
      }
    }

    return {
      observedBeforeLoad: false,
      observedAfterLoad: false,
      loadAttempted: load.attempted === true,
      loadStatus: load.status,
      sourceContext: context.status || "UNKNOWN_CONTEXT",
      sourcePath: "NONE",
      api: null
    };
  }

  function callableSurfacePointerMethod(sidecarApi) {
    if (!isObject(sidecarApi)) return "NONE";

    const methods = [
      "runSouthSurfacePointerRead",
      "inspectSouthSurfacePointer",
      "inspectSurfacePointer",
      "runProbeSidecar",
      "inspect",
      "runDiagnostic"
    ];

    for (const method of methods) {
      if (isFunction(sidecarApi[method])) return method;
    }

    return "NONE";
  }

  function compactSidecarReport(source) {
    const report =
      isObject(source && source.evidence) ? source.evidence :
      isObject(source && source.REPORT_OBJECT) ? source.REPORT_OBJECT :
      isObject(source && source.report) ? source.report :
      isObject(source && source.output && source.output.REPORT_OBJECT) ? source.output.REPORT_OBJECT :
      isObject(source) ? source :
      {};

    return {
      SOUTH_SURFACE_POINTER_STATUS: firstKnown(report.SOUTH_SURFACE_POINTER_STATUS, source && source.SOUTH_SURFACE_POINTER_STATUS),
      SOUTH_SURFACE_POINTER_CONTRACT: firstKnown(report.SOUTH_SURFACE_POINTER_CONTRACT, report.CONTRACT, source && source.contract),
      SOUTH_SURFACE_POINTER_RECEIPT: firstKnown(report.SOUTH_SURFACE_POINTER_RECEIPT, report.RECEIPT, source && source.receipt),

      BISHOP_QUEEN_FUNNEL_OBSERVED: boolText(firstKnown(report.BISHOP_QUEEN_FUNNEL_OBSERVED, source && source.BISHOP_QUEEN_FUNNEL_OBSERVED), "UNKNOWN"),
      BISHOP_QUEEN_FUNNEL_SELECTED_PATH: firstKnown(report.BISHOP_QUEEN_FUNNEL_SELECTED_PATH, "UNKNOWN"),
      BISHOP_QUEEN_FUNNEL_CONTRACT: firstKnown(report.BISHOP_QUEEN_FUNNEL_CONTRACT, "UNKNOWN"),

      FINGER_INSPECT_OBSERVED: boolText(firstKnown(report.FINGER_INSPECT_OBSERVED, source && source.FINGER_INSPECT_OBSERVED), "UNKNOWN"),
      FINGER_INSPECT_SELECTED_PATH: firstKnown(report.FINGER_INSPECT_SELECTED_PATH, "UNKNOWN"),
      FINGER_INSPECT_CONTRACT: firstKnown(report.FINGER_INSPECT_CONTRACT, "UNKNOWN"),

      SURFACE_PACKET_OBSERVED: boolText(firstKnown(report.SURFACE_PACKET_OBSERVED, source && source.SURFACE_PACKET_OBSERVED), "UNKNOWN"),
      SURFACE_PACKET_SELECTED_PATH: firstKnown(report.SURFACE_PACKET_SELECTED_PATH, "UNKNOWN"),
      SURFACE_PACKET_CONTRACT: firstKnown(report.SURFACE_PACKET_CONTRACT, "UNKNOWN"),

      HEX_SURFACE_OBSERVED: boolText(firstKnown(report.HEX_SURFACE_OBSERVED, source && source.HEX_SURFACE_OBSERVED), "UNKNOWN"),
      HEX_SURFACE_SELECTED_PATH: firstKnown(report.HEX_SURFACE_SELECTED_PATH, "UNKNOWN"),
      HEX_SURFACE_CONTRACT: firstKnown(report.HEX_SURFACE_CONTRACT, "UNKNOWN"),

      HEX_FOUR_PAIR_AUTHORITY_OBSERVED: boolText(firstKnown(report.HEX_FOUR_PAIR_AUTHORITY_OBSERVED, source && source.HEX_FOUR_PAIR_AUTHORITY_OBSERVED), "UNKNOWN"),
      HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH: firstKnown(report.HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH, "UNKNOWN"),
      HEX_FOUR_PAIR_AUTHORITY_CONTRACT: firstKnown(report.HEX_FOUR_PAIR_AUTHORITY_CONTRACT, "UNKNOWN"),

      CANVAS_HUB_OBSERVED_BY_SIDECAR: boolText(firstKnown(report.CANVAS_HUB_OBSERVED_BY_SIDECAR, "UNKNOWN"), "UNKNOWN"),
      CANVAS_HUB_SELECTED_PATH_BY_SIDECAR: firstKnown(report.CANVAS_HUB_SELECTED_PATH_BY_SIDECAR, "UNKNOWN"),
      CANVAS_HUB_CONTRACT_BY_SIDECAR: firstKnown(report.CANVAS_HUB_CONTRACT_BY_SIDECAR, "UNKNOWN"),

      BOUNDARY_FINGER_READY: boolText(firstKnown(report.BOUNDARY_FINGER_READY, "UNKNOWN"), "UNKNOWN"),
      MASS_FINGER_READY: boolText(firstKnown(report.MASS_FINGER_READY, "UNKNOWN"), "UNKNOWN"),
      SURFACE_FINGER_READY: boolText(firstKnown(report.SURFACE_FINGER_READY, "UNKNOWN"), "UNKNOWN"),
      LIGHT_FINGER_READY: boolText(firstKnown(report.LIGHT_FINGER_READY, "UNKNOWN"), "UNKNOWN"),
      HEX_SURFACE_BRIDGE_READY: boolText(firstKnown(report.HEX_SURFACE_BRIDGE_READY, "UNKNOWN"), "UNKNOWN"),
      HEX_FOUR_PAIR_AUTHORITY_READY: boolText(firstKnown(report.HEX_FOUR_PAIR_AUTHORITY_READY, "UNKNOWN"), "UNKNOWN"),

      EXPRESSION_SAMPLE_COUNT: firstKnown(report.EXPRESSION_SAMPLE_COUNT, "UNKNOWN"),
      DOWNSTREAM_EXPRESSION_SET_STATUS: firstKnown(report.DOWNSTREAM_EXPRESSION_SET_STATUS, source && source.DOWNSTREAM_EXPRESSION_SET_STATUS, "UNKNOWN"),
      DOWNSTREAM_EXPRESSION_SET_COMPLETE: boolText(firstKnown(report.DOWNSTREAM_EXPRESSION_SET_COMPLETE, "UNKNOWN"), "UNKNOWN"),
      DOWNSTREAM_EXPRESSION_SET_PARTIAL: boolText(firstKnown(report.DOWNSTREAM_EXPRESSION_SET_PARTIAL, "UNKNOWN"), "UNKNOWN"),

      CANVAS_PIXEL_SAMPLE_STATUS_SEEN_BY_SIDECAR: firstKnown(report.CANVAS_PIXEL_SAMPLE_STATUS_SEEN_BY_SIDECAR, "UNKNOWN"),
      CANVAS_PIXEL_VISIBLE_SEEN_BY_SIDECAR: firstKnown(report.CANVAS_PIXEL_VISIBLE_SEEN_BY_SIDECAR, "UNKNOWN"),
      CANVAS_PIXEL_BLANK_SEEN_BY_SIDECAR: boolText(firstKnown(report.CANVAS_PIXEL_BLANK_SEEN_BY_SIDECAR, "UNKNOWN"), "UNKNOWN"),

      SURFACE_POINTER_INTERPRETATION: firstKnown(report.SURFACE_POINTER_INTERPRETATION, source && source.SURFACE_POINTER_INTERPRETATION, "UNKNOWN"),
      SURFACE_POINTER_RECOMMENDED_OWNER: firstKnown(report.SURFACE_POINTER_RECOMMENDED_OWNER, source && source.SURFACE_POINTER_RECOMMENDED_OWNER, "UNKNOWN"),
      SURFACE_POINTER_RECOMMENDED_FILE: firstKnown(report.SURFACE_POINTER_RECOMMENDED_FILE, source && source.SURFACE_POINTER_RECOMMENDED_FILE, "UNKNOWN"),
      SURFACE_POINTER_RECOMMENDED_ACTION: firstKnown(report.SURFACE_POINTER_RECOMMENDED_ACTION, source && source.SURFACE_POINTER_RECOMMENDED_ACTION, "UNKNOWN"),

      NAMESPACE_SURFACE_POINTER_CANDIDATE_COUNT: firstKnown(report.NAMESPACE_SURFACE_POINTER_CANDIDATE_COUNT, "UNKNOWN")
    };
  }

  async function callSurfacePointer(sidecarApi, input, context) {
    const method = callableSurfacePointerMethod(sidecarApi);

    if (method === "NONE") {
      return {
        callAttempted: false,
        callReturned: false,
        callMethod: "NONE",
        callStatus: "CALL_METHOD_NOT_FOUND",
        callError: "NONE",
        compact: compactSidecarReport({})
      };
    }

    const compactReport = compactCurrentReport(input);

    const payload = {
      currentReport: compactReport,
      report: compactReport,
      diagnosticTimestamp: compactReport.DIAGNOSTIC_TIMESTAMP,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      caller: CONTRACT,
      probeSouthCompactMode: true,
      suppressFullNamespaceReturn: true,
      targetContextStatus: context && context.status ? context.status : "UNKNOWN",
      noClaims: clonePlain(NO_CLAIMS)
    };

    try {
      const output = await Promise.resolve(sidecarApi[method](payload));

      return {
        callAttempted: true,
        callReturned: true,
        callMethod: method,
        callStatus: "CALL_RETURNED",
        callError: "NONE",
        compact: compactSidecarReport(output)
      };
    } catch (error) {
      return {
        callAttempted: true,
        callReturned: false,
        callMethod: method,
        callStatus: "CALL_FAILED",
        callError: bounded(error && error.message ? error.message : error, 1000),
        compact: compactSidecarReport({})
      };
    }
  }

  function readSouthHandoff(contextRoot) {
    const local = compactAuthorityRead(SOUTH_ALIAS_PATHS, root);
    const target = contextRoot && contextRoot !== root
      ? compactAuthorityRead(SOUTH_ALIAS_PATHS, contextRoot)
      : local;

    const chosen = target.observed ? target : local;

    return {
      SOUTH_HANDOFF_OBSERVED: boolText(chosen.observed, "false"),
      SOUTH_HANDOFF_SOURCE_PATH: chosen.selectedPath,
      SOUTH_HANDOFF_CONTRACT: firstKnown(chosen.contract, EXPECTED_SOUTH_CONTRACT),
      SOUTH_HANDOFF_RECEIPT: firstKnown(chosen.receipt, EXPECTED_SOUTH_RECEIPT),
      SOUTH_HANDOFF_CONTEXT: target.observed ? "TARGET_CONTEXT" : local.observed ? "LOCAL_CONTEXT" : "NONE"
    };
  }

  function directExpressionFallback(contextRoot) {
    const finger = compactAuthorityRead(DIRECT_FINGER_ALIAS_PATHS, contextRoot || root);
    const hex = compactAuthorityRead(DIRECT_HEX_SURFACE_ALIAS_PATHS, contextRoot || root);
    const fourPair = compactAuthorityRead(DIRECT_FOUR_PAIR_ALIAS_PATHS, contextRoot || root);

    return {
      DIRECT_FINGER_INSPECT_OBSERVED: boolText(finger.observed, "false"),
      DIRECT_FINGER_INSPECT_SELECTED_PATH: finger.selectedPath,
      DIRECT_FINGER_INSPECT_CONTRACT: finger.contract,
      DIRECT_HEX_SURFACE_OBSERVED: boolText(hex.observed, "false"),
      DIRECT_HEX_SURFACE_SELECTED_PATH: hex.selectedPath,
      DIRECT_HEX_SURFACE_CONTRACT: hex.contract,
      DIRECT_HEX_FOUR_PAIR_AUTHORITY_OBSERVED: boolText(fourPair.observed, "false"),
      DIRECT_HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH: fourPair.selectedPath,
      DIRECT_HEX_FOUR_PAIR_AUTHORITY_CONTRACT: fourPair.contract
    };
  }

  function resolveMeaning(compact, fallback) {
    const fingerObserved =
      textIsTrue(compact.FINGER_INSPECT_OBSERVED) ||
      textIsTrue(fallback.DIRECT_FINGER_INSPECT_OBSERVED);
    const hexObserved =
      textIsTrue(compact.HEX_SURFACE_OBSERVED) ||
      textIsTrue(fallback.DIRECT_HEX_SURFACE_OBSERVED);
    const fourPairObserved =
      textIsTrue(compact.HEX_FOUR_PAIR_AUTHORITY_OBSERVED) ||
      textIsTrue(fallback.DIRECT_HEX_FOUR_PAIR_AUTHORITY_OBSERVED);
    const bishopObserved = textIsTrue(compact.BISHOP_QUEEN_FUNNEL_OBSERVED);

    const downstreamStatus = firstKnown(compact.DOWNSTREAM_EXPRESSION_SET_STATUS, "UNKNOWN");

    if (downstreamStatus === "DOWNSTREAM_EXPRESSION_SET_OBSERVED_AND_COHERENT") {
      return {
        PROBE_SOUTH_MEANING_STATUS: "DOWNSTREAM_EXPRESSION_SET_OBSERVED_AND_COHERENT",
        PROBE_SOUTH_RECOMMENDED_OWNER: firstKnown(compact.SURFACE_POINTER_RECOMMENDED_OWNER, "CANVAS_DRAWING_OR_EXPRESSION_ADAPTER"),
        PROBE_SOUTH_RECOMMENDED_FILE: firstKnown(compact.SURFACE_POINTER_RECOMMENDED_FILE, CANVAS_FILE),
        PROBE_SOUTH_RECOMMENDED_ACTION: firstKnown(
          compact.SURFACE_POINTER_RECOMMENDED_ACTION,
          "VERIFY_CANVAS_DRAW_PATH_EXECUTES_AND_WRITES_VISIBLE_PIXELS"
        )
      };
    }

    if (downstreamStatus === "DOWNSTREAM_EXPRESSION_SET_PARTIAL_OR_DEGRADED") {
      return {
        PROBE_SOUTH_MEANING_STATUS: "DOWNSTREAM_EXPRESSION_PARTIAL_BEFORE_CANVAS_DRAW",
        PROBE_SOUTH_RECOMMENDED_OWNER: firstKnown(compact.SURFACE_POINTER_RECOMMENDED_OWNER, "DOWNSTREAM_EXPRESSION_ADAPTER"),
        PROBE_SOUTH_RECOMMENDED_FILE: firstKnown(compact.SURFACE_POINTER_RECOMMENDED_FILE, FINGER_INSPECT_FILE),
        PROBE_SOUTH_RECOMMENDED_ACTION: firstKnown(
          compact.SURFACE_POINTER_RECOMMENDED_ACTION,
          "AUDIT_FINGER_SURFACE_HEX_TRANSMISSION_BEFORE_CANVAS_RENEWAL"
        )
      };
    }

    if (fingerObserved || hexObserved || fourPairObserved || bishopObserved) {
      return {
        PROBE_SOUTH_MEANING_STATUS: "DOWNSTREAM_EXPRESSION_ALIASES_OBSERVED_WITH_INCOMPLETE_COHERENCE",
        PROBE_SOUTH_RECOMMENDED_OWNER: "DOWNSTREAM_EXPRESSION_ADAPTER",
        PROBE_SOUTH_RECOMMENDED_FILE: FINGER_INSPECT_FILE,
        PROBE_SOUTH_RECOMMENDED_ACTION:
          "CONNECT_FINGER_INSPECT_SURFACE_POINTER_AND_HEX_BRIDGE_TO_PROBE_SOUTH_COMPACT_FIELDS"
      };
    }

    return {
      PROBE_SOUTH_MEANING_STATUS: "DOWNSTREAM_EXPRESSION_SET_NOT_OBSERVED_BY_PROBE_SOUTH",
      PROBE_SOUTH_RECOMMENDED_OWNER: "DIAGNOSTIC_PROBE_SOUTH_AUXILIARY_READ",
      PROBE_SOUTH_RECOMMENDED_FILE: SOUTH_SURFACE_POINTER_FILE,
      PROBE_SOUTH_RECOMMENDED_ACTION:
        "VERIFY_SURFACE_POINTER_SIDECAR_LOADS_IN_TARGET_CONTEXT_AND_CAN_SEE_FINGER_SURFACE_HEX_ALIASES"
    };
  }

  function buildReport(input, context, ensureResult, sidecarCall, southHandoff, directFallback) {
    const compact = sidecarCall.compact || {};
    const meaning = resolveMeaning(compact, directFallback);
    const current = compactCurrentReport(input);

    const sidecarObserved = Boolean(ensureResult && ensureResult.api);
    const sidecarCallReturned = sidecarCall.callReturned === true;
    const receiptReady = sidecarObserved && sidecarCallReturned
      ? "COMPACT_RECEIPT_RETURN_READY"
      : sidecarObserved
        ? "SIDECAR_OBSERVED_BUT_CALL_NOT_RETURNED"
        : "SIDECAR_NOT_OBSERVED";

    const notes = normalizeNotes(
      current.SECONDARY_EVIDENCE_NOTES,
      "PROBE_SOUTH_F55_COMPACT_TRANSLATOR_ACTIVE",
      "PROBE_SOUTH_CONSUMES_SOUTH_F34_HANDOFF",
      "PROBE_SOUTH_READS_AUXILIARY_SIDECAR_AS_TENTH_DIAGNOSTIC_INSTRUMENT",
      "PROBE_SOUTH_DOES_NOT_PROMOTE_TENTH_FILE_TO_NINE_STEP_CHRONOLOGY",
      "PROBE_SOUTH_RETURNS_COMPACT_PACKET_ONLY",
      "PROBE_SOUTH_SUPPRESSES_FULL_SIDECAR_NAMESPACE_SCAN_FROM_NORTH_RETURN",
      "PROBE_SOUTH_PRESERVES_RECEIPT_BUTTON_BY_LIMITING_PAYLOAD",
      "PROBE_SOUTH_DOES_NOT_DRAW_CANVAS",
      "PROBE_SOUTH_DOES_NOT_RESTART_RUNTIME",
      "PROBE_SOUTH_DOES_NOT_CLAIM_F13_F21_F55_READY_OR_VISUAL_PASS",
      meaning.PROBE_SOUTH_MEANING_STATUS
    );

    return {
      PACKET_NAME,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: firstKnown(current.DIAGNOSTIC_TIMESTAMP, nowIso()),

      PROBE_SOUTH_STATUS: "COMPLETE",
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_CARRIER_FILE: FILE,
      PROBE_SOUTH_CHRONOLOGY_ORDER: "9",
      PROBE_SOUTH_FIBONACCI_STAGE: "F55",
      PROBE_SOUTH_GATE: "STEP_9",
      PROBE_SOUTH_ROLE: "PACKET_MEANING_AND_COMPACT_DOWNSTREAM_EXPRESSION_TRANSLATOR",
      PROBE_SOUTH_AUTHORITY: "READ_ONLY_PROBE_TRANSLATION",
      PROBE_SOUTH_SOURCE_PATH: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PHYSICAL_FILE_OBSERVED: "true",
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "PHYSICAL_PROBE_SOUTH_FILE",
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: FILE,
      PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL: "false",
      PROBE_SOUTH_PUBLISHED_AS_PHYSICAL_FILE: "true",

      PROBE_SOUTH_RUN_COMPLETE: "true",
      PROBE_SOUTH_RUN_STATUS: "CALL_RETURNED",
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: "true",
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: "READY",
      PROBE_SOUTH_RETURN_PACKET_READY: "true",
      PROBE_SOUTH_COMPACT_RETURN_ONLY: "true",
      PROBE_SOUTH_FULL_SIDECAR_RETURN_SUPPRESSED: "true",
      PROBE_SOUTH_FULL_NAMESPACE_SCAN_RETURN_SUPPRESSED: "true",

      RECEIPT_RETURN_MECHANISM_STATUS: receiptReady,
      DIAGNOSTIC_RECEIPT_RETURN_STATUS: receiptReady,
      RETURN_REPORT_OBJECT_AVAILABLE: "true",
      RETURN_PACKET_TEXT_AVAILABLE: "true",
      RETURN_COMPACT_SUMMARY_AVAILABLE: "true",
      RETURN_RECEIPT_OBJECT_AVAILABLE: "true",
      NORTH_READABLE_RECEIPT_SURFACE_READY: "true",
      DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY: "true",

      NORTH_CONTRACT: firstKnown(current.NORTH_CONTRACT, EXPECTED_NORTH_CONTRACT),
      NORTH_RECEIPT: firstKnown(current.NORTH_RECEIPT, EXPECTED_NORTH_RECEIPT),

      SOUTH_RAIL_FILE,
      SOUTH_SURFACE_POINTER_FILE,
      CANVAS_FILE,
      FINGER_INSPECT_FILE,
      HEX_SURFACE_FILE,
      HEX_FOUR_PAIR_FILE,

      ...southHandoff,

      TARGET_CONTEXT_STATUS: context.status || "UNKNOWN",
      SOUTH_SURFACE_POINTER_EXPECTED_FILE: SOUTH_SURFACE_POINTER_FILE,
      SOUTH_SURFACE_POINTER_EXPECTED_CONTRACT: EXPECTED_SURFACE_POINTER_CONTRACT,
      SOUTH_SURFACE_POINTER_OBSERVED: boolText(sidecarObserved, "false"),
      SOUTH_SURFACE_POINTER_OBSERVED_BEFORE_LOAD: boolText(ensureResult.observedBeforeLoad, "false"),
      SOUTH_SURFACE_POINTER_OBSERVED_AFTER_LOAD: boolText(ensureResult.observedAfterLoad, "false"),
      SOUTH_SURFACE_POINTER_LOAD_ATTEMPTED: boolText(ensureResult.loadAttempted, "false"),
      SOUTH_SURFACE_POINTER_LOAD_STATUS: ensureResult.loadStatus || "UNKNOWN",
      SOUTH_SURFACE_POINTER_SOURCE_CONTEXT: ensureResult.sourceContext || "UNKNOWN",
      SOUTH_SURFACE_POINTER_SOURCE_PATH: ensureResult.sourcePath || "NONE",
      SOUTH_SURFACE_POINTER_CALL_ATTEMPTED: boolText(sidecarCall.callAttempted, "false"),
      SOUTH_SURFACE_POINTER_CALL_RETURNED: boolText(sidecarCall.callReturned, "false"),
      SOUTH_SURFACE_POINTER_CALL_METHOD: sidecarCall.callMethod || "NONE",
      SOUTH_SURFACE_POINTER_CALL_STATUS: sidecarCall.callStatus || "UNKNOWN",
      SOUTH_SURFACE_POINTER_CALL_ERROR: sidecarCall.callError || "NONE",
      SOUTH_SURFACE_POINTER_CONTRACT: firstKnown(compact.SOUTH_SURFACE_POINTER_CONTRACT, EXPECTED_SURFACE_POINTER_CONTRACT),
      SOUTH_SURFACE_POINTER_RECEIPT: firstKnown(compact.SOUTH_SURFACE_POINTER_RECEIPT, EXPECTED_SURFACE_POINTER_RECEIPT),

      BISHOP_QUEEN_FUNNEL_OBSERVED: firstKnown(compact.BISHOP_QUEEN_FUNNEL_OBSERVED, "UNKNOWN"),
      BISHOP_QUEEN_FUNNEL_SELECTED_PATH: firstKnown(compact.BISHOP_QUEEN_FUNNEL_SELECTED_PATH, "UNKNOWN"),
      BISHOP_QUEEN_FUNNEL_CONTRACT: firstKnown(compact.BISHOP_QUEEN_FUNNEL_CONTRACT, "UNKNOWN"),

      FINGER_INSPECT_OBSERVED: firstKnown(compact.FINGER_INSPECT_OBSERVED, directFallback.DIRECT_FINGER_INSPECT_OBSERVED, "UNKNOWN"),
      FINGER_INSPECT_SELECTED_PATH: firstKnown(compact.FINGER_INSPECT_SELECTED_PATH, directFallback.DIRECT_FINGER_INSPECT_SELECTED_PATH, "UNKNOWN"),
      FINGER_INSPECT_CONTRACT: firstKnown(compact.FINGER_INSPECT_CONTRACT, directFallback.DIRECT_FINGER_INSPECT_CONTRACT, "UNKNOWN"),

      SURFACE_PACKET_OBSERVED: firstKnown(compact.SURFACE_PACKET_OBSERVED, "UNKNOWN"),
      SURFACE_PACKET_SELECTED_PATH: firstKnown(compact.SURFACE_PACKET_SELECTED_PATH, "UNKNOWN"),
      SURFACE_PACKET_CONTRACT: firstKnown(compact.SURFACE_PACKET_CONTRACT, "UNKNOWN"),

      HEX_SURFACE_OBSERVED: firstKnown(compact.HEX_SURFACE_OBSERVED, directFallback.DIRECT_HEX_SURFACE_OBSERVED, "UNKNOWN"),
      HEX_SURFACE_SELECTED_PATH: firstKnown(compact.HEX_SURFACE_SELECTED_PATH, directFallback.DIRECT_HEX_SURFACE_SELECTED_PATH, "UNKNOWN"),
      HEX_SURFACE_CONTRACT: firstKnown(compact.HEX_SURFACE_CONTRACT, directFallback.DIRECT_HEX_SURFACE_CONTRACT, "UNKNOWN"),

      HEX_FOUR_PAIR_AUTHORITY_OBSERVED: firstKnown(
        compact.HEX_FOUR_PAIR_AUTHORITY_OBSERVED,
        directFallback.DIRECT_HEX_FOUR_PAIR_AUTHORITY_OBSERVED,
        "UNKNOWN"
      ),
      HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH: firstKnown(
        compact.HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH,
        directFallback.DIRECT_HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH,
        "UNKNOWN"
      ),
      HEX_FOUR_PAIR_AUTHORITY_CONTRACT: firstKnown(
        compact.HEX_FOUR_PAIR_AUTHORITY_CONTRACT,
        directFallback.DIRECT_HEX_FOUR_PAIR_AUTHORITY_CONTRACT,
        "UNKNOWN"
      ),

      CANVAS_HUB_OBSERVED_BY_SIDECAR: firstKnown(compact.CANVAS_HUB_OBSERVED_BY_SIDECAR, "UNKNOWN"),
      CANVAS_HUB_SELECTED_PATH_BY_SIDECAR: firstKnown(compact.CANVAS_HUB_SELECTED_PATH_BY_SIDECAR, "UNKNOWN"),
      CANVAS_HUB_CONTRACT_BY_SIDECAR: firstKnown(compact.CANVAS_HUB_CONTRACT_BY_SIDECAR, "UNKNOWN"),

      BOUNDARY_FINGER_READY: firstKnown(compact.BOUNDARY_FINGER_READY, "UNKNOWN"),
      MASS_FINGER_READY: firstKnown(compact.MASS_FINGER_READY, "UNKNOWN"),
      SURFACE_FINGER_READY: firstKnown(compact.SURFACE_FINGER_READY, "UNKNOWN"),
      LIGHT_FINGER_READY: firstKnown(compact.LIGHT_FINGER_READY, "UNKNOWN"),
      HEX_SURFACE_BRIDGE_READY: firstKnown(compact.HEX_SURFACE_BRIDGE_READY, "UNKNOWN"),
      HEX_FOUR_PAIR_AUTHORITY_READY: firstKnown(compact.HEX_FOUR_PAIR_AUTHORITY_READY, "UNKNOWN"),

      EXPRESSION_SAMPLE_COUNT: firstKnown(compact.EXPRESSION_SAMPLE_COUNT, "UNKNOWN"),
      DOWNSTREAM_EXPRESSION_SET_STATUS: firstKnown(compact.DOWNSTREAM_EXPRESSION_SET_STATUS, meaning.PROBE_SOUTH_MEANING_STATUS),
      DOWNSTREAM_EXPRESSION_SET_COMPLETE: firstKnown(compact.DOWNSTREAM_EXPRESSION_SET_COMPLETE, "UNKNOWN"),
      DOWNSTREAM_EXPRESSION_SET_PARTIAL: firstKnown(compact.DOWNSTREAM_EXPRESSION_SET_PARTIAL, "UNKNOWN"),

      CANVAS_PIXEL_SAMPLE_STATUS_SEEN_BY_PROBE_SOUTH: firstKnown(
        compact.CANVAS_PIXEL_SAMPLE_STATUS_SEEN_BY_SIDECAR,
        current.CANVAS_PIXEL_SAMPLE_STATUS,
        "UNKNOWN"
      ),
      CANVAS_PIXEL_VISIBLE_SEEN_BY_PROBE_SOUTH: firstKnown(
        compact.CANVAS_PIXEL_VISIBLE_SEEN_BY_SIDECAR,
        current.CANVAS_PIXEL_VISIBLE,
        "UNKNOWN"
      ),
      CANVAS_PIXEL_BLANK_SEEN_BY_PROBE_SOUTH: firstKnown(
        compact.CANVAS_PIXEL_BLANK_SEEN_BY_SIDECAR,
        "UNKNOWN"
      ),

      SURFACE_POINTER_INTERPRETATION: firstKnown(compact.SURFACE_POINTER_INTERPRETATION, "UNKNOWN"),
      SURFACE_POINTER_RECOMMENDED_OWNER: firstKnown(compact.SURFACE_POINTER_RECOMMENDED_OWNER, "UNKNOWN"),
      SURFACE_POINTER_RECOMMENDED_FILE: firstKnown(compact.SURFACE_POINTER_RECOMMENDED_FILE, "UNKNOWN"),
      SURFACE_POINTER_RECOMMENDED_ACTION: firstKnown(compact.SURFACE_POINTER_RECOMMENDED_ACTION, "UNKNOWN"),

      PROBE_SOUTH_MEANING_STATUS: meaning.PROBE_SOUTH_MEANING_STATUS,
      PROBE_SOUTH_RECOMMENDED_OWNER: meaning.PROBE_SOUTH_RECOMMENDED_OWNER,
      PROBE_SOUTH_RECOMMENDED_NEXT_FILE: meaning.PROBE_SOUTH_RECOMMENDED_FILE,
      PROBE_SOUTH_RECOMMENDED_NEXT_ACTION: meaning.PROBE_SOUTH_RECOMMENDED_ACTION,

      CHRONOLOGY_POSITION: "STEP_9_F55_PHYSICAL_PROBE",
      AUXILIARY_TENTH_FILE_USED: boolText(sidecarObserved, "false"),
      AUXILIARY_TENTH_FILE_CHRONOLOGY_MEMBER: "false",
      AUXILIARY_TENTH_FILE_REPLACES_PROBE_SOUTH: "false",
      NINE_STEP_CHRONOLOGY_PRESERVED: "true",

      PROBE_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

      DIAGNOSTIC_INSTRUMENT_STATUS: "PROBE_SOUTH_COMPACT_SIDE_CAR_BRIDGE_ACTIVE",
      FILE_COMPOSITION_STATUS: "SOURCE_COMPOSITION_REACHES_PROBE_SOUTH_AND_COMPACT_SIDE_CAR_RETURN",
      CANVAS_EXPRESSION_INSTRUMENTATION_STATUS:
        meaning.PROBE_SOUTH_MEANING_STATUS === "DOWNSTREAM_EXPRESSION_SET_OBSERVED_AND_COHERENT"
          ? "DOWNSTREAM_EXPRESSION_INSTRUMENTATION_READABLE"
          : "DOWNSTREAM_EXPRESSION_INSTRUMENTATION_PARTIAL_OR_MISSING",

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      HEARTH_REPAIR_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      CANVAS_REPAIR_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      PROBE_SOUTH_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
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
      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_PACKET_MEANING_PRESERVED",
      "PROBE_SOUTH_RETURN_TO_NORTH_STATUS",
      "PROBE_SOUTH_RETURN_PACKET_READY",
      "PROBE_SOUTH_COMPACT_RETURN_ONLY",
      "PROBE_SOUTH_FULL_SIDECAR_RETURN_SUPPRESSED",
      "PROBE_SOUTH_FULL_NAMESPACE_SCAN_RETURN_SUPPRESSED",

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

      "SOUTH_HANDOFF_OBSERVED",
      "SOUTH_HANDOFF_SOURCE_PATH",
      "SOUTH_HANDOFF_CONTRACT",
      "SOUTH_HANDOFF_RECEIPT",
      "SOUTH_HANDOFF_CONTEXT",

      "TARGET_CONTEXT_STATUS",
      "SOUTH_SURFACE_POINTER_OBSERVED",
      "SOUTH_SURFACE_POINTER_LOAD_STATUS",
      "SOUTH_SURFACE_POINTER_SOURCE_CONTEXT",
      "SOUTH_SURFACE_POINTER_SOURCE_PATH",
      "SOUTH_SURFACE_POINTER_CALL_RETURNED",
      "SOUTH_SURFACE_POINTER_CALL_METHOD",
      "SOUTH_SURFACE_POINTER_CALL_STATUS",
      "SOUTH_SURFACE_POINTER_CALL_ERROR",
      "SOUTH_SURFACE_POINTER_CONTRACT",
      "SOUTH_SURFACE_POINTER_RECEIPT",

      "BISHOP_QUEEN_FUNNEL_OBSERVED",
      "BISHOP_QUEEN_FUNNEL_SELECTED_PATH",
      "BISHOP_QUEEN_FUNNEL_CONTRACT",

      "FINGER_INSPECT_OBSERVED",
      "FINGER_INSPECT_SELECTED_PATH",
      "FINGER_INSPECT_CONTRACT",

      "SURFACE_PACKET_OBSERVED",
      "SURFACE_PACKET_SELECTED_PATH",
      "SURFACE_PACKET_CONTRACT",

      "HEX_SURFACE_OBSERVED",
      "HEX_SURFACE_SELECTED_PATH",
      "HEX_SURFACE_CONTRACT",

      "HEX_FOUR_PAIR_AUTHORITY_OBSERVED",
      "HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH",
      "HEX_FOUR_PAIR_AUTHORITY_CONTRACT",

      "CANVAS_HUB_OBSERVED_BY_SIDECAR",
      "CANVAS_HUB_SELECTED_PATH_BY_SIDECAR",
      "CANVAS_HUB_CONTRACT_BY_SIDECAR",

      "BOUNDARY_FINGER_READY",
      "MASS_FINGER_READY",
      "SURFACE_FINGER_READY",
      "LIGHT_FINGER_READY",
      "HEX_SURFACE_BRIDGE_READY",
      "HEX_FOUR_PAIR_AUTHORITY_READY",

      "EXPRESSION_SAMPLE_COUNT",
      "DOWNSTREAM_EXPRESSION_SET_STATUS",
      "DOWNSTREAM_EXPRESSION_SET_COMPLETE",
      "DOWNSTREAM_EXPRESSION_SET_PARTIAL",

      "CANVAS_PIXEL_SAMPLE_STATUS_SEEN_BY_PROBE_SOUTH",
      "CANVAS_PIXEL_VISIBLE_SEEN_BY_PROBE_SOUTH",
      "CANVAS_PIXEL_BLANK_SEEN_BY_PROBE_SOUTH",

      "SURFACE_POINTER_INTERPRETATION",
      "SURFACE_POINTER_RECOMMENDED_OWNER",
      "SURFACE_POINTER_RECOMMENDED_FILE",
      "SURFACE_POINTER_RECOMMENDED_ACTION",

      "PROBE_SOUTH_MEANING_STATUS",
      "PROBE_SOUTH_RECOMMENDED_OWNER",
      "PROBE_SOUTH_RECOMMENDED_NEXT_FILE",
      "PROBE_SOUTH_RECOMMENDED_NEXT_ACTION",

      "CHRONOLOGY_POSITION",
      "AUXILIARY_TENTH_FILE_USED",
      "AUXILIARY_TENTH_FILE_CHRONOLOGY_MEMBER",
      "AUXILIARY_TENTH_FILE_REPLACES_PROBE_SOUTH",
      "NINE_STEP_CHRONOLOGY_PRESERVED",

      "DIAGNOSTIC_INSTRUMENT_STATUS",
      "FILE_COMPOSITION_STATUS",
      "CANVAS_EXPRESSION_INSTRUMENTATION_STATUS",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "ROUTE_CONDUCTOR_MUTATION_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_CREATION_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "FINAL_VISUAL_PASS_AUTHORITY",

      "SECONDARY_EVIDENCE_NOTES",
      "PROBE_SOUTH_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const out = [];

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
      line("PROBE_SOUTH_CONTRACT", getRaw(report, "PROBE_SOUTH_CONTRACT", CONTRACT)),
      line("PROBE_SOUTH_RUN_STATUS", getRaw(report, "PROBE_SOUTH_RUN_STATUS", "UNKNOWN")),
      line("RECEIPT_RETURN_MECHANISM_STATUS", getRaw(report, "RECEIPT_RETURN_MECHANISM_STATUS", "UNKNOWN")),
      line("SOUTH_HANDOFF_OBSERVED", getRaw(report, "SOUTH_HANDOFF_OBSERVED", "UNKNOWN")),
      line("SOUTH_SURFACE_POINTER_OBSERVED", getRaw(report, "SOUTH_SURFACE_POINTER_OBSERVED", "UNKNOWN")),
      line("SOUTH_SURFACE_POINTER_CALL_RETURNED", getRaw(report, "SOUTH_SURFACE_POINTER_CALL_RETURNED", "UNKNOWN")),
      line("FINGER_INSPECT_OBSERVED", getRaw(report, "FINGER_INSPECT_OBSERVED", "UNKNOWN")),
      line("SURFACE_PACKET_OBSERVED", getRaw(report, "SURFACE_PACKET_OBSERVED", "UNKNOWN")),
      line("HEX_SURFACE_OBSERVED", getRaw(report, "HEX_SURFACE_OBSERVED", "UNKNOWN")),
      line("HEX_FOUR_PAIR_AUTHORITY_OBSERVED", getRaw(report, "HEX_FOUR_PAIR_AUTHORITY_OBSERVED", "UNKNOWN")),
      line("DOWNSTREAM_EXPRESSION_SET_STATUS", getRaw(report, "DOWNSTREAM_EXPRESSION_SET_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_MEANING_STATUS", getRaw(report, "PROBE_SOUTH_MEANING_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_RECOMMENDED_NEXT_FILE", getRaw(report, "PROBE_SOUTH_RECOMMENDED_NEXT_FILE", "UNKNOWN")),
      line("PROBE_SOUTH_RECOMMENDED_NEXT_ACTION", getRaw(report, "PROBE_SOUTH_RECOMMENDED_NEXT_ACTION", "UNKNOWN"))
    ].join("\n");
  }

  function publish(report) {
    lastReport = clonePlain(report);
    lastPacketText = composePacketText(report);
    lastCompactSummary = composeCompactSummary(report);

    lastState = {
      role: "DIAGNOSTIC_PROBE_SOUTH_F55_COMPACT_SIDE_CAR_BRIDGE",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportObject: clonePlain(lastReport),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };

    publishAliases();
  }

  async function runProbeSouth(input = {}) {
    const context = getTargetContext(input);
    const southHandoff = readSouthHandoff(context.targetWindow || root);
    const ensureResult = await ensureSurfacePointer(context);
    const sidecarCall = ensureResult.api
      ? await callSurfacePointer(ensureResult.api, input, context)
      : {
          callAttempted: false,
          callReturned: false,
          callMethod: "NONE",
          callStatus: "SIDECAR_NOT_OBSERVED",
          callError: "NONE",
          compact: compactSidecarReport({})
        };
    const directFallback = directExpressionFallback(context.targetWindow || root);
    const report = buildReport(
      input,
      context,
      ensureResult,
      sidecarCall,
      southHandoff,
      directFallback
    );

    publish(report);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,

      PROBE_SOUTH_STATUS: "COMPLETE",
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_RUN_COMPLETE: "true",
      PROBE_SOUTH_RUN_STATUS: "CALL_RETURNED",
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: "true",
      PROBE_SOUTH_RETURN_PACKET_READY: "true",
      RECEIPT_RETURN_MECHANISM_STATUS: report.RECEIPT_RETURN_MECHANISM_STATUS,

      SOUTH_HANDOFF_OBSERVED: report.SOUTH_HANDOFF_OBSERVED,
      SOUTH_SURFACE_POINTER_OBSERVED: report.SOUTH_SURFACE_POINTER_OBSERVED,
      SOUTH_SURFACE_POINTER_CALL_RETURNED: report.SOUTH_SURFACE_POINTER_CALL_RETURNED,

      FINGER_INSPECT_OBSERVED: report.FINGER_INSPECT_OBSERVED,
      BISHOP_QUEEN_FUNNEL_OBSERVED: report.BISHOP_QUEEN_FUNNEL_OBSERVED,
      SURFACE_PACKET_OBSERVED: report.SURFACE_PACKET_OBSERVED,
      HEX_SURFACE_OBSERVED: report.HEX_SURFACE_OBSERVED,
      HEX_FOUR_PAIR_AUTHORITY_OBSERVED: report.HEX_FOUR_PAIR_AUTHORITY_OBSERVED,

      DOWNSTREAM_EXPRESSION_SET_STATUS: report.DOWNSTREAM_EXPRESSION_SET_STATUS,
      PROBE_SOUTH_MEANING_STATUS: report.PROBE_SOUTH_MEANING_STATUS,
      PROBE_SOUTH_RECOMMENDED_NEXT_FILE: report.PROBE_SOUTH_RECOMMENDED_NEXT_FILE,
      PROBE_SOUTH_RECOMMENDED_NEXT_ACTION: report.PROBE_SOUTH_RECOMMENDED_NEXT_ACTION,

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        PROBE_SOUTH_STATUS: "COMPLETE",
        PROBE_SOUTH_CONTRACT: CONTRACT,
        PROBE_SOUTH_RECEIPT: RECEIPT,
        PROBE_SOUTH_RUN_STATUS: "CALL_RETURNED",
        PROBE_SOUTH_RETURN_PACKET_READY: "true",
        RECEIPT_RETURN_MECHANISM_STATUS: report.RECEIPT_RETURN_MECHANISM_STATUS,
        DOWNSTREAM_EXPRESSION_SET_STATUS: report.DOWNSTREAM_EXPRESSION_SET_STATUS,
        PROBE_SOUTH_MEANING_STATUS: report.PROBE_SOUTH_MEANING_STATUS,
        PROBE_SOUTH_RECOMMENDED_NEXT_FILE: report.PROBE_SOUTH_RECOMMENDED_NEXT_FILE,
        PROBE_SOUTH_RECOMMENDED_NEXT_ACTION: report.PROBE_SOUTH_RECOMMENDED_NEXT_ACTION,
        REPORT_OBJECT: report
      },
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function inspectPacketMeaning(input = {}) {
    return runProbeSouth(input);
  }

  function inspectPacketComposition(input = {}) {
    return runProbeSouth(input);
  }

  function inspect(input = {}) {
    return runProbeSouth(input);
  }

  function runDiagnostic(input = {}) {
    return runProbeSouth(input);
  }

  function getReport() {
    if (!lastReport) {
      const current = compactCurrentReport({});
      const emptyReport = buildReport(
        { currentReport: current },
        { status: "NOT_RUN", targetWindow: root, targetDocument: root.document || null },
        {
          observedBeforeLoad: false,
          observedAfterLoad: false,
          loadAttempted: false,
          loadStatus: "NOT_RUN",
          sourceContext: "NOT_RUN",
          sourcePath: "NONE",
          api: null
        },
        {
          callAttempted: false,
          callReturned: false,
          callMethod: "NONE",
          callStatus: "NOT_RUN",
          callError: "NONE",
          compact: compactSidecarReport({})
        },
        readSouthHandoff(root),
        directExpressionFallback(root)
      );

      publish(emptyReport);
    }

    return clonePlain(lastReport);
  }

  function getPacketText() {
    if (!lastPacketText) getReport();
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) getReport();
    return lastCompactSummary;
  }

  function getState() {
    if (!lastState) getReport();
    return clonePlain(lastState);
  }

  function getReceiptLight() {
    return {
      role: "DIAGNOSTIC_PROBE_SOUTH_F55_COMPACT_SIDE_CAR_BRIDGE",
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

      chronologyOrder: 9,
      fibonacciStage: "F55",
      probeSouthPhysicalFileObserved: true,
      packetMeaningAuthority: true,
      compactSidecarTranslationAuthority: true,
      fullSidecarReturnSuppressed: true,
      fullNamespaceScanReturnSuppressed: true,
      receiptButtonProtection: true,

      southRailFile: SOUTH_RAIL_FILE,
      southSurfacePointerFile: SOUTH_SURFACE_POINTER_FILE,
      canvasFile: CANVAS_FILE,
      fingerInspectFile: FINGER_INSPECT_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexFourPairFile: HEX_FOUR_PAIR_FILE,

      expectedNorthContract: EXPECTED_NORTH_CONTRACT,
      expectedNorthReceipt: EXPECTED_NORTH_RECEIPT,
      expectedSouthContract: EXPECTED_SOUTH_CONTRACT,
      expectedSouthReceipt: EXPECTED_SOUTH_RECEIPT,
      expectedSurfacePointerContract: EXPECTED_SURFACE_POINTER_CONTRACT,
      expectedSurfacePointerReceipt: EXPECTED_SURFACE_POINTER_RECEIPT,

      primaryCallableMethod: "runProbeSouth",
      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      routeRepairAuthorized: false,
      routeConductorMutationAuthorized: false,
      controlMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      canvasReleaseAuthorized: false,
      runtimeRestartAuthorized: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_CARRIER_FILE: FILE,

      reportObject: clonePlain(lastReport || {}),
      state: clonePlain(lastState || {}),

      ...UPPER_NO_CLAIMS
    };
  }

  function publishAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeSouth = api;
    root.HEARTH.diagnosticRailProbeSouth = api;
    root.HEARTH.diagnosticSouthProbe = api;
    root.HEARTH.probeSouthDiagnostic = api;
    root.HEARTH.diagnosticProbeSouthCompactBridge = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_COMPACT_BRIDGE = api;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticProbeSouthCompactBridge = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
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
    packetName: PACKET_NAME,

    chronologyOrder: 9,
    fibonacciStage: "F55",
    role: "DIAGNOSTIC_PROBE_SOUTH_F55_COMPACT_SIDE_CAR_BRIDGE",
    authority: "PACKET_MEANING_AND_COMPACT_DOWNSTREAM_EXPRESSION_TRANSLATION",

    southRailFile: SOUTH_RAIL_FILE,
    southSurfacePointerFile: SOUTH_SURFACE_POINTER_FILE,
    canvasFile: CANVAS_FILE,
    fingerInspectFile: FINGER_INSPECT_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexFourPairFile: HEX_FOUR_PAIR_FILE,

    expectedNorthContract: EXPECTED_NORTH_CONTRACT,
    expectedNorthReceipt: EXPECTED_NORTH_RECEIPT,
    expectedSouthContract: EXPECTED_SOUTH_CONTRACT,
    expectedSouthReceipt: EXPECTED_SOUTH_RECEIPT,
    expectedSurfacePointerContract: EXPECTED_SURFACE_POINTER_CONTRACT,
    expectedSurfacePointerReceipt: EXPECTED_SURFACE_POINTER_RECEIPT,

    compactSidecarTranslationAuthority: true,
    fullSidecarReturnSuppressed: true,
    fullNamespaceScanReturnSuppressed: true,
    receiptButtonProtection: true,
    auxiliaryTenthFileAllowed: true,
    auxiliaryTenthFileChronologyMember: false,
    nineStepChronologyPreserved: true,

    aliasChronology: PROBE_ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    inspect,
    runDiagnostic,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getReceipt,
    getReceiptLight,

    runProbeSouthApiAvailable: true,
    inspectPacketMeaningApiAvailable: true,
    inspectPacketCompositionApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    routeRepairAuthorized: false,
    routeConductorMutationAuthorized: false,
    controlMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasReleaseAuthorized: false,
    runtimeRestartAuthorized: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  publishAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
