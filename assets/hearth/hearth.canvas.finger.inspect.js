// /assets/hearth/hearth.canvas.finger.inspect.js
// HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1
// New file.
// Canvas finger inspect / downstream expression proof layer only.
// Purpose:
// - Provide a non-mutating under-hood inspection surface for the Canvas/Finger/Hex downstream expression set.
// - Inspect Boundary, Mass, Surface, Pointer, Light, Canvas Hub, Hex Surface bridge, and Four-Pair authority.
// - Separate "Canvas received usable expression but did not draw pixels" from "downstream expression packet not observed."
// - Preserve the active nine-cycle diagnostic chronology by publishing a readable auxiliary surface only.
// - Allow South / Probe South / future diagnostic adapters to read this file without making it a chronology owner.
// - Preserve no production mutation, no canvas drawing, no canvas repair, no runtime restart, no F13 claim, no F21 claim, no ready text, and no visual pass.
// Does not own:
// - diagnostic North chronology
// - diagnostic South packet output
// - production route repair
// - Canvas drawing
// - Canvas release
// - terrain/material/hydrology truth
// - final visual pass
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";
  const RECEIPT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_RECEIPT_v1";

  const VERSION =
    "2026-06-06.hearth-canvas-finger-inspect-downstream-expression-proof-v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const FOUR_PAIR_AUTHORITY_FILE =
    "/assets/hearth/hearth.hex.four-pair.authority.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
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

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastReport = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let lastState = null;

  const SAFE_GETTERS = Object.freeze([
    "getReceipt",
    "getReceiptLight",
    "getState",
    "getReport",
    "getSummary",
    "getPacket",
    "getLastPacket",
    "getFrame",
    "getLastFrame",
    "getSurfacePacket",
    "getExpressionPacket",
    "getProof",
    "getRenderedProof",
    "getCanvasProof"
  ]);

  const FINGER_SPECS = Object.freeze([
    Object.freeze({
      id: "BOUNDARY",
      label: "Boundary Finger",
      expectedRole: "boundary-expression-finger",
      terms: ["boundary"],
      paths: [
        "HEARTH.canvasBoundaryFinger",
        "HEARTH.boundaryFinger",
        "HEARTH.fingerBoundary",
        "HEARTH.canvasFingerBoundary",
        "HEARTH.hearthCanvasBoundaryFinger",
        "HEARTH.hearthBoundaryFinger",
        "DEXTER_LAB.hearthCanvasBoundaryFinger",
        "DEXTER_LAB.hearthBoundaryFinger",
        "HEARTH_CANVAS_BOUNDARY_FINGER",
        "HEARTH_BOUNDARY_FINGER"
      ],
      primaryFile: "UNKNOWN"
    }),
    Object.freeze({
      id: "MASS",
      label: "Mass Finger",
      expectedRole: "mass-expression-finger",
      terms: ["mass"],
      paths: [
        "HEARTH.canvasMassFinger",
        "HEARTH.massFinger",
        "HEARTH.fingerMass",
        "HEARTH.canvasFingerMass",
        "HEARTH.hearthCanvasMassFinger",
        "HEARTH.hearthMassFinger",
        "DEXTER_LAB.hearthCanvasMassFinger",
        "DEXTER_LAB.hearthMassFinger",
        "HEARTH_CANVAS_MASS_FINGER",
        "HEARTH_MASS_FINGER"
      ],
      primaryFile: "UNKNOWN"
    }),
    Object.freeze({
      id: "SURFACE",
      label: "Surface Finger",
      expectedRole: "surface-expression-finger",
      terms: ["surface"],
      paths: [
        "HEARTH.canvasSurfaceFinger",
        "HEARTH.surfaceFinger",
        "HEARTH.fingerSurface",
        "HEARTH.canvasFingerSurface",
        "HEARTH.hearthCanvasSurfaceFinger",
        "HEARTH.hearthSurfaceFinger",
        "HEARTH.surfaceExpression",
        "HEARTH.canvasSurfaceExpression",
        "DEXTER_LAB.hearthCanvasSurfaceFinger",
        "DEXTER_LAB.hearthSurfaceFinger",
        "HEARTH_CANVAS_SURFACE_FINGER",
        "HEARTH_SURFACE_FINGER",
        "HEARTH_SURFACE_EXPRESSION"
      ],
      primaryFile: "UNKNOWN"
    }),
    Object.freeze({
      id: "POINTER",
      label: "Pointer Finger",
      expectedRole: "pointer-transmission-finger",
      terms: ["pointer"],
      paths: [
        "HEARTH.canvasPointerFinger",
        "HEARTH.pointerFinger",
        "HEARTH.fingerPointer",
        "HEARTH.canvasFingerPointer",
        "HEARTH.hearthCanvasPointerFinger",
        "HEARTH.hearthPointerFinger",
        "HEARTH.pointerTransmission",
        "HEARTH.hexGatePointerFingerTransmission",
        "DEXTER_LAB.hearthCanvasPointerFinger",
        "DEXTER_LAB.hearthPointerFinger",
        "HEARTH_CANVAS_POINTER_FINGER",
        "HEARTH_POINTER_FINGER",
        "HEARTH_HEX_GATE_POINTER_FINGER_TRANSMISSION"
      ],
      primaryFile: "UNKNOWN"
    }),
    Object.freeze({
      id: "LIGHT",
      label: "Light Finger",
      expectedRole: "light-expression-finger",
      terms: ["light"],
      paths: [
        "HEARTH.canvasLightFinger",
        "HEARTH.lightFinger",
        "HEARTH.fingerLight",
        "HEARTH.canvasFingerLight",
        "HEARTH.hearthCanvasLightFinger",
        "HEARTH.hearthLightFinger",
        "DEXTER_LAB.hearthCanvasLightFinger",
        "DEXTER_LAB.hearthLightFinger",
        "HEARTH_CANVAS_LIGHT_FINGER",
        "HEARTH_LIGHT_FINGER"
      ],
      primaryFile: "UNKNOWN"
    })
  ]);

  const BRIDGE_SPECS = Object.freeze([
    Object.freeze({
      id: "CANVAS_HUB",
      label: "Canvas Hub",
      expectedRole: "canvas-render-receiver",
      terms: ["canvas"],
      paths: [
        "HEARTH.canvas",
        "HEARTH.canvasHub",
        "HEARTH.hearthCanvas",
        "HEARTH.hearthCanvasHub",
        "HEARTH.visibleCanvasHub",
        "HEARTH.canvasAuthority",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasHub",
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_HUB",
        "HEARTH_VISIBLE_CANVAS_HUB"
      ],
      expectedContract: EXPECTED_CANVAS_CONTRACT,
      primaryFile: CANVAS_FILE
    }),
    Object.freeze({
      id: "HEX_SURFACE_BRIDGE",
      label: "Hex Surface Bridge",
      expectedRole: "hex-surface-render-bridge",
      terms: ["hex", "surface"],
      paths: [
        "HEARTH.hexSurface",
        "HEARTH.hearthHexSurface",
        "HEARTH.canvasHexSurface",
        "HEARTH.hexSurfaceRenderer",
        "HEARTH.hearthHexSurfaceRenderer",
        "DEXTER_LAB.hearthHexSurface",
        "DEXTER_LAB.hearthHexSurfaceRenderer",
        "HEARTH_HEX_SURFACE",
        "HEARTH_HEX_SURFACE_RENDERER",
        "HEARTH_HEX_SURFACE_INTERACTIVE"
      ],
      expectedContract: EXPECTED_HEX_SURFACE_CONTRACT,
      primaryFile: HEX_SURFACE_FILE
    }),
    Object.freeze({
      id: "FOUR_PAIR_AUTHORITY",
      label: "Four-Pair Authority",
      expectedRole: "hex-four-pair-pixel-handshake-authority",
      terms: ["four", "pair"],
      paths: [
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hearthHexFourPairAuthority",
        "HEARTH.fourPairAuthority",
        "HEARTH.pixelHandshakeAuthority",
        "HEARTH.hexFourPairPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexFourPairAuthority",
        "DEXTER_LAB.hearthFourPairAuthority",
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_FOUR_PAIR_AUTHORITY",
        "HEARTH_PIXEL_HANDSHAKE_AUTHORITY"
      ],
      expectedContract: EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT,
      primaryFile: FOUR_PAIR_AUTHORITY_FILE
    }),
    Object.freeze({
      id: "BISHOP_QUEEN_FUNNEL",
      label: "Bishop Queen Recognition Funnel",
      expectedRole: "route-conductor-expression-funnel",
      terms: ["bishop", "queen"],
      paths: [
        "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
        "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
        "HEARTH.bishopQueenCanvasRecognitionFunnel",
        "HEARTH_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL"
      ],
      expectedContract:
        "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
      primaryFile: "/showroom/globe/hearth/hearth.js"
    })
  ]);

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

  function isCallable(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function bounded(value, limit = 2400) {
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
        return bounded(JSON.stringify(value), 20000) || fallback;
      } catch (_error) {
        return bounded(String(value), 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
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

  function safeKeys(value) {
    try {
      if (isObject(value) || isCallable(value)) return Object.keys(value);
    } catch (_error) {
      return [];
    }
    return [];
  }

  function safeGet(object, key) {
    try {
      if (object && key in object) return object[key];
    } catch (_error) {
      return undefined;
    }
    return undefined;
  }

  function getPath(path) {
    const clean = safeString(path).replace(/^window\./, "");
    if (!clean) return undefined;

    const parts = clean.split(".");
    let cursor = root;

    for (const part of parts) {
      cursor = safeGet(cursor, part);
      if (cursor === undefined || cursor === null) return undefined;
    }

    return cursor;
  }

  function directPathCandidate(path) {
    const value = getPath(path);
    if (value === undefined || value === null) return null;

    return {
      path,
      source: "DIRECT_ALIAS",
      value
    };
  }

  function uniqueCandidates(candidates) {
    const seenPaths = new Set();
    const out = [];

    for (const candidate of candidates) {
      if (!candidate || !candidate.path) continue;
      if (seenPaths.has(candidate.path)) continue;
      seenPaths.add(candidate.path);
      out.push(candidate);
    }

    return out;
  }

  function textHasAnyTerm(text, terms) {
    const lower = bounded(text, 5000).toLowerCase();
    return (terms || []).some((term) => lower.includes(safeString(term).toLowerCase()));
  }

  function textHasAllTerms(text, terms) {
    const lower = bounded(text, 5000).toLowerCase();
    return (terms || []).every((term) => lower.includes(safeString(term).toLowerCase()));
  }

  function contractLikeText(value) {
    if (!isObject(value) && !isCallable(value)) return "";
    const keys = safeKeys(value);
    const contractKeys = keys.filter((key) => /contract|receipt|version|role|file|status/i.test(key));
    const pairs = contractKeys.slice(0, 14).map((key) => {
      const raw = safeGet(value, key);
      if (isObject(raw) || Array.isArray(raw) || isCallable(raw)) return key;
      return `${key}:${bounded(raw, 180)}`;
    });

    return pairs.join(" ");
  }

  function discoverInNamespace(namespace, namespaceName, terms, requireAllTerms, limit) {
    const out = [];
    const visited = new Set();

    function walk(value, path, depth) {
      if (out.length >= limit) return;
      if (!value || (!isObject(value) && !isCallable(value))) return;
      if (visited.has(value)) return;
      visited.add(value);

      const keys = safeKeys(value);
      for (const key of keys) {
        if (out.length >= limit) break;

        const childPath = `${path}.${key}`;
        const child = safeGet(value, key);
        if (child === undefined || child === null) continue;

        const searchable = `${childPath} ${contractLikeText(child)}`;
        const matched = requireAllTerms
          ? textHasAllTerms(searchable, terms)
          : textHasAnyTerm(searchable, terms);

        if (matched && (isObject(child) || isCallable(child))) {
          out.push({
            path: childPath,
            source: "DISCOVERED_NAMESPACE",
            value: child
          });
        }

        if (depth > 0 && isObject(child)) {
          const skip =
            child === root ||
            child === root.document ||
            child === root.location ||
            child === root.navigator ||
            child === root.localStorage ||
            child === root.sessionStorage;

          if (!skip) walk(child, childPath, depth - 1);
        }
      }
    }

    walk(namespace, namespaceName, 2);
    return out;
  }

  function discoverRootCandidates(terms, requireAllTerms, limit = 24) {
    const candidates = [];

    const hearth = safeGet(root, "HEARTH");
    if (isObject(hearth)) {
      candidates.push(...discoverInNamespace(hearth, "HEARTH", terms, requireAllTerms, limit));
    }

    const dexter = safeGet(root, "DEXTER_LAB");
    if (isObject(dexter)) {
      candidates.push(...discoverInNamespace(dexter, "DEXTER_LAB", terms, requireAllTerms, limit));
    }

    const rootKeys = safeKeys(root);
    for (const key of rootKeys) {
      if (candidates.length >= limit) break;
      if (!/^HEARTH|DEXTER/i.test(key)) continue;

      const value = safeGet(root, key);
      if (!value || (!isObject(value) && !isCallable(value))) continue;

      const searchable = `${key} ${contractLikeText(value)}`;
      const matched = requireAllTerms
        ? textHasAllTerms(searchable, terms)
        : textHasAnyTerm(searchable, terms);

      if (matched) {
        candidates.push({
          path: key,
          source: "DISCOVERED_GLOBAL",
          value
        });
      }
    }

    return uniqueCandidates(candidates).slice(0, limit);
  }

  function findFirstValueByKeyNames(source, keyNames, depth = 2) {
    if (!source || (!isObject(source) && !isCallable(source))) return undefined;

    const keys = safeKeys(source);
    for (const key of keys) {
      if (keyNames.some((name) => key.toLowerCase() === name.toLowerCase())) {
        const value = safeGet(source, key);
        if (value !== undefined && value !== null && !isObject(value) && !Array.isArray(value) && !isCallable(value)) {
          return value;
        }
      }
    }

    if (depth <= 0) return undefined;

    for (const key of keys) {
      const child = safeGet(source, key);
      if (!isObject(child)) continue;

      const value = findFirstValueByKeyNames(child, keyNames, depth - 1);
      if (value !== undefined && value !== null) return value;
    }

    return undefined;
  }

  function readGetterSnapshot(object, getterName) {
    if (!object || !isCallable(object[getterName])) {
      return {
        getter: getterName,
        callable: false,
        called: false,
        status: "NOT_CALLABLE"
      };
    }

    try {
      const value = object[getterName]();
      return {
        getter: getterName,
        callable: true,
        called: true,
        status: "CALL_RETURNED",
        value: summarizeValue(value)
      };
    } catch (error) {
      return {
        getter: getterName,
        callable: true,
        called: true,
        status: "CALL_ERROR",
        error: bounded(error && error.message ? error.message : error, 1000)
      };
    }
  }

  function summarizeValue(value) {
    if (value === undefined || value === null) return "NULL";
    if (!isObject(value) && !Array.isArray(value)) return bounded(value, 600);
    if (Array.isArray(value)) return `ARRAY_LENGTH_${value.length}`;

    const keys = safeKeys(value);
    const contract = findFirstValueByKeyNames(value, ["contract", "CONTRACT"], 2);
    const receipt = findFirstValueByKeyNames(value, ["receipt", "RECEIPT"], 2);
    const status = findFirstValueByKeyNames(value, ["status", "STATUS"], 2);

    return {
      type: "OBJECT",
      keyCount: keys.length,
      sampleKeys: keys.slice(0, 24),
      contract: packetValue(contract, "UNKNOWN"),
      receipt: packetValue(receipt, "UNKNOWN"),
      status: packetValue(status, "UNKNOWN")
    };
  }

  function inspectCandidateValue(candidate) {
    const value = candidate.value;
    const keys = safeKeys(value);
    const methods = keys.filter((key) => isCallable(safeGet(value, key)));

    const contract = firstKnown(
      findFirstValueByKeyNames(value, [
        "contract",
        "CONTRACT",
        "currentContract",
        "canvasContract",
        "hexSurfaceContract",
        "authorityContract",
        "implementationContract"
      ]),
      "UNKNOWN"
    );

    const receipt = firstKnown(
      findFirstValueByKeyNames(value, [
        "receipt",
        "RECEIPT",
        "currentReceipt",
        "canvasReceipt",
        "hexSurfaceReceipt",
        "authorityReceipt",
        "implementationReceipt"
      ]),
      "UNKNOWN"
    );

    const role = firstKnown(
      findFirstValueByKeyNames(value, ["role", "ROLE", "authority", "AUTHORITY"]),
      "UNKNOWN"
    );

    const status = firstKnown(
      findFirstValueByKeyNames(value, ["status", "STATUS", "readyStatus", "runStatus"]),
      "UNKNOWN"
    );

    const readyRaw = findFirstValueByKeyNames(value, [
      "ready",
      "isReady",
      "loaded",
      "active",
      "surfaceReady",
      "canvasReady",
      "packetReady",
      "expressionReady",
      "bridgeReady",
      "authorityReady"
    ]);

    const getterSnapshots = SAFE_GETTERS
      .map((getter) => readGetterSnapshot(value, getter))
      .filter((snapshot) => snapshot.callable);

    const getterReturnedCount = getterSnapshots.filter(
      (snapshot) => snapshot.status === "CALL_RETURNED"
    ).length;

    const packetLikeKeys = keys.filter((key) =>
      /packet|frame|sample|surface|expression|proof|handoff|payload|data/i.test(key)
    );

    const drawMethods = methods.filter((key) =>
      /draw|render|paint|compose|mount|boot|init|start/i.test(key)
    );

    const safeGetterMethods = methods.filter((key) =>
      /get|read|inspect|probe|report|receipt|state|summary/i.test(key)
    );

    const hasContract = contract !== "UNKNOWN";
    const hasReceipt = receipt !== "UNKNOWN";
    const hasPacketSignal = packetLikeKeys.length > 0 || getterReturnedCount > 0;
    const hasCallableSurface = methods.length > 0;
    const readyText = boolText(readyRaw, "UNKNOWN");

    return {
      path: candidate.path,
      source: candidate.source,
      observed: true,
      type: isCallable(value) ? "FUNCTION" : "OBJECT",
      contract,
      receipt,
      role,
      status,
      ready: readyText,
      keyCount: keys.length,
      sampleKeys: keys.slice(0, 28),
      methodCount: methods.length,
      methods: methods.slice(0, 36),
      drawMethods,
      safeGetterMethods,
      getterReturnedCount,
      getterSnapshots,
      packetLikeKeyCount: packetLikeKeys.length,
      packetLikeKeys: packetLikeKeys.slice(0, 36),
      hasContract,
      hasReceipt,
      hasPacketSignal,
      hasCallableSurface
    };
  }

  function inspectSpec(spec, options = {}) {
    const directCandidates = [];
    for (const path of spec.paths || []) {
      const candidate = directPathCandidate(path);
      if (candidate) directCandidates.push(candidate);
    }

    const discoveredCandidates = discoverRootCandidates(
      spec.terms || [],
      Boolean((spec.terms || []).length > 1),
      options.discoveryLimit || 20
    );

    const candidates = uniqueCandidates(directCandidates.concat(discoveredCandidates));
    const inspected = candidates.map(inspectCandidateValue);
    const primary = inspected[0] || null;

    const observed = Boolean(primary);
    const ready =
      observed &&
      (
        primary.ready === "true" ||
        primary.hasPacketSignal ||
        primary.hasContract ||
        primary.hasCallableSurface
      );

    const status = !observed
      ? "NOT_OBSERVED"
      : ready
        ? "OBSERVED_WITH_USABLE_SIGNAL"
        : "OBSERVED_WITH_NO_USABLE_SIGNAL";

    return {
      id: spec.id,
      label: spec.label,
      expectedRole: spec.expectedRole,
      expectedContract: spec.expectedContract || "UNKNOWN",
      primaryFile: spec.primaryFile || "UNKNOWN",
      observed,
      ready,
      status,
      candidateCount: inspected.length,
      primaryPath: primary ? primary.path : "NONE",
      primarySource: primary ? primary.source : "NONE",
      primaryContract: primary ? primary.contract : "UNKNOWN",
      primaryReceipt: primary ? primary.receipt : "UNKNOWN",
      primaryRole: primary ? primary.role : "UNKNOWN",
      primaryReady: primary ? primary.ready : "UNKNOWN",
      primaryMethodCount: primary ? primary.methodCount : 0,
      primaryPacketLikeKeyCount: primary ? primary.packetLikeKeyCount : 0,
      primaryGetterReturnedCount: primary ? primary.getterReturnedCount : 0,
      primaryDrawMethods: primary ? primary.drawMethods : [],
      primarySafeGetterMethods: primary ? primary.safeGetterMethods : [],
      candidates: inspected
    };
  }

  function queryFirst(selectors) {
    if (!root.document || !root.document.querySelector) return null;

    for (const selector of selectors) {
      try {
        const node = root.document.querySelector(selector);
        if (node) return { selector, node };
      } catch (_error) {
        // Continue selector search.
      }
    }

    return null;
  }

  function inspectCanvasDom() {
    const found = queryFirst([
      "canvas[data-hearth-visible-canvas='true']",
      "#hearthCanvasMount canvas",
      "canvas[data-hearth-canvas='true']",
      "canvas.hearth-canvas",
      "canvas"
    ]);

    if (!found) {
      return {
        canvasElementFound: false,
        canvasSelector: "NONE",
        canvasRectNonzero: false,
        canvasComputedVisible: false,
        canvasContext2dReady: false,
        canvasViewportIntersecting: false,
        pixelSample: {
          status: "CANVAS_NOT_FOUND",
          visible: false,
          sampleCount: 0,
          visiblePixelCount: 0,
          alphaPixelCount: 0,
          uniqueColorCount: 0,
          reason: "NO_CANVAS_ELEMENT"
        }
      };
    }

    const canvas = found.node;
    let rect = null;
    let style = null;

    try {
      rect = canvas.getBoundingClientRect();
    } catch (_error) {
      rect = null;
    }

    try {
      style = root.getComputedStyle ? root.getComputedStyle(canvas) : null;
    } catch (_error) {
      style = null;
    }

    const rectWidth = rect ? Number(rect.width || 0) : 0;
    const rectHeight = rect ? Number(rect.height || 0) : 0;
    const rectNonzero = rectWidth > 0 && rectHeight > 0;

    const visible =
      rectNonzero &&
      (!style ||
        (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || 1) !== 0
        ));

    const viewportWidth = root.innerWidth || 0;
    const viewportHeight = root.innerHeight || 0;

    const intersecting =
      rectNonzero &&
      rect.left < viewportWidth &&
      rect.right > 0 &&
      rect.top < viewportHeight &&
      rect.bottom > 0;

    const contextProbe = getCanvas2dContext(canvas);
    const pixelSample = inspectCanvasPixels(canvas, contextProbe.context);

    return {
      canvasElementFound: true,
      canvasSelector: found.selector,
      canvasTag: canvas.tagName || "CANVAS",
      canvasId: canvas.id || "NONE",
      canvasClass: canvas.className || "NONE",
      canvasDatasetContract: canvas.dataset ? canvas.dataset.hearthCanvasContract || canvas.dataset.contract || "UNKNOWN" : "UNKNOWN",
      canvasDatasetReceipt: canvas.dataset ? canvas.dataset.hearthCanvasReceipt || canvas.dataset.receipt || "UNKNOWN" : "UNKNOWN",
      canvasWidthAttribute: canvas.width || 0,
      canvasHeightAttribute: canvas.height || 0,
      canvasRectLeft: rect ? rect.left : 0,
      canvasRectTop: rect ? rect.top : 0,
      canvasRectWidth: rectWidth,
      canvasRectHeight: rectHeight,
      canvasRectNonzero: rectNonzero,
      canvasComputedVisible: visible,
      canvasComputedDisplay: style ? style.display : "UNKNOWN",
      canvasComputedVisibility: style ? style.visibility : "UNKNOWN",
      canvasComputedOpacity: style ? style.opacity : "UNKNOWN",
      canvasComputedPointerEvents: style ? style.pointerEvents : "UNKNOWN",
      canvasViewportIntersecting: intersecting,
      canvasContext2dReady: contextProbe.ready,
      canvasContext2dStatus: contextProbe.status,
      pixelSample
    };
  }

  function getCanvas2dContext(canvas) {
    if (!canvas || !canvas.getContext) {
      return {
        ready: false,
        status: "CANVAS_CONTEXT_2D_NOT_AVAILABLE",
        context: null
      };
    }

    try {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) {
        return {
          ready: true,
          status: "CANVAS_CONTEXT_2D_READY",
          context
        };
      }
    } catch (_error) {
      try {
        const context = canvas.getContext("2d");
        if (context) {
          return {
            ready: true,
            status: "CANVAS_CONTEXT_2D_READY_FALLBACK",
            context
          };
        }
      } catch (error) {
        return {
          ready: false,
          status: `CANVAS_CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 600)}`,
          context: null
        };
      }
    }

    return {
      ready: false,
      status: "CANVAS_CONTEXT_2D_NULL",
      context: null
    };
  }

  function inspectCanvasPixels(canvas, context) {
    if (!canvas || !context) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        reason: "NO_CANVAS_CONTEXT"
      };
    }

    const width = Number(canvas.width || 0);
    const height = Number(canvas.height || 0);

    if (width <= 0 || height <= 0) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        reason: "CANVAS_DIMENSIONS_ZERO"
      };
    }

    const points = buildSamplePoints(width, height);
    let sampleCount = 0;
    let alphaPixelCount = 0;
    let visiblePixelCount = 0;
    const unique = new Set();

    try {
      for (const point of points) {
        const x = Math.max(0, Math.min(width - 1, Math.round(point.x)));
        const y = Math.max(0, Math.min(height - 1, Math.round(point.y)));
        const data = context.getImageData(x, y, 1, 1).data;

        sampleCount += 1;

        const r = data[0] || 0;
        const g = data[1] || 0;
        const b = data[2] || 0;
        const a = data[3] || 0;

        if (a > 0) alphaPixelCount += 1;
        if (a > 0 && (r > 0 || g > 0 || b > 0)) visiblePixelCount += 1;

        unique.add(`${r},${g},${b},${a}`);
      }
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_ERROR",
        visible: false,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        uniqueColorCount: unique.size,
        reason: bounded(error && error.message ? error.message : error, 1000)
      };
    }

    const visible = visiblePixelCount > 0;
    const status = visible
      ? "PIXEL_SAMPLE_VISIBLE"
      : alphaPixelCount > 0
        ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
        : "PIXEL_SAMPLE_BLANK";

    return {
      status,
      visible,
      sampleCount,
      visiblePixelCount,
      alphaPixelCount,
      uniqueColorCount: unique.size,
      reason: visible
        ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
        : alphaPixelCount > 0
          ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
          : "NO_VISIBLE_NON_BLANK_PIXELS_IN_SAMPLE_GRID"
    };
  }

  function buildSamplePoints(width, height) {
    const xs = [0.18, 0.32, 0.5, 0.68, 0.82];
    const ys = [0.18, 0.32, 0.5, 0.68, 0.82];
    const points = [];

    for (const y of ys) {
      for (const x of xs) {
        points.push({
          x: width * x,
          y: height * y
        });
      }
    }

    return points;
  }

  function inspectExpressionSurfaceDom() {
    const found = queryFirst([
      "[data-hearth-expression-surface='true']",
      "[data-hearth-surface-expression='true']",
      ".hearth-expression-surface",
      ".hearth-surface-expression",
      "#hearthExpressionSurface",
      "#hearthSurfaceExpression"
    ]);

    if (!found) {
      return {
        expressionSurfaceElementFound: false,
        expressionSurfaceSelector: "NONE",
        expressionSurfaceRectNonzero: false,
        expressionSurfaceVisible: false
      };
    }

    let rect = null;
    let style = null;

    try {
      rect = found.node.getBoundingClientRect();
    } catch (_error) {
      rect = null;
    }

    try {
      style = root.getComputedStyle ? root.getComputedStyle(found.node) : null;
    } catch (_error) {
      style = null;
    }

    const width = rect ? Number(rect.width || 0) : 0;
    const height = rect ? Number(rect.height || 0) : 0;
    const rectNonzero = width > 0 && height > 0;

    return {
      expressionSurfaceElementFound: true,
      expressionSurfaceSelector: found.selector,
      expressionSurfaceTag: found.node.tagName || "UNKNOWN",
      expressionSurfaceId: found.node.id || "NONE",
      expressionSurfaceClass: found.node.className || "NONE",
      expressionSurfaceRectWidth: width,
      expressionSurfaceRectHeight: height,
      expressionSurfaceRectNonzero: rectNonzero,
      expressionSurfaceVisible:
        rectNonzero &&
        (!style ||
          (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity || 1) !== 0
          ))
    };
  }

  function deriveDownstreamStatus(fingers, bridges, canvasDom, expressionDom) {
    const byId = {};
    for (const item of fingers.concat(bridges)) byId[item.id] = item;

    const boundaryReady = Boolean(byId.BOUNDARY && byId.BOUNDARY.ready);
    const massReady = Boolean(byId.MASS && byId.MASS.ready);
    const surfaceReady = Boolean(byId.SURFACE && byId.SURFACE.ready);
    const pointerReady = Boolean(byId.POINTER && byId.POINTER.ready);
    const lightReady = Boolean(byId.LIGHT && byId.LIGHT.ready);
    const hexReady = Boolean(byId.HEX_SURFACE_BRIDGE && byId.HEX_SURFACE_BRIDGE.ready);
    const fourPairReady = Boolean(byId.FOUR_PAIR_AUTHORITY && byId.FOUR_PAIR_AUTHORITY.ready);
    const canvasHubReady = Boolean(byId.CANVAS_HUB && byId.CANVAS_HUB.ready);

    const allFingersReady =
      boundaryReady && massReady && surfaceReady && pointerReady && lightReady;

    const requiredBridgeReady = hexReady || fourPairReady;
    const canvasPixelsVisible = Boolean(canvasDom.pixelSample && canvasDom.pixelSample.visible);

    if (canvasPixelsVisible) {
      return {
        status: "VISIBLE_PIXEL_PROOF_PRESENT",
        class: "NO_CANVAS_PIXEL_FAILURE_OBSERVED",
        recommendedOwner: "NONE",
        recommendedFile: "NONE",
        recommendedAction: "NO_CANVAS_PIXEL_REPAIR_RECOMMENDED_FROM_INSPECT"
      };
    }

    if (!surfaceReady) {
      return {
        status: "DOWNSTREAM_EXPRESSION_INCOMPLETE",
        class: "SURFACE_FINGER_OR_PACKET_NOT_READY",
        recommendedOwner: "CANVAS_SURFACE_FINGER_OR_SURFACE_EXPRESSION_ADAPTER",
        recommendedFile: FILE,
        recommendedAction:
          "WIRE_OR_EXPOSE_SURFACE_FINGER_PACKET_TO_INSPECTABLE_PUBLIC_SURFACE"
      };
    }

    if (!pointerReady) {
      return {
        status: "DOWNSTREAM_EXPRESSION_INCOMPLETE",
        class: "POINTER_FINGER_TRANSMISSION_NOT_READY",
        recommendedOwner: "POINTER_FINGER_OR_ROUTE_CONDUCTOR_TRANSMISSION_ADAPTER",
        recommendedFile: FILE,
        recommendedAction:
          "WIRE_OR_EXPOSE_POINTER_TRANSMISSION_PACKET_TO_INSPECTABLE_PUBLIC_SURFACE"
      };
    }

    if (!requiredBridgeReady) {
      return {
        status: "DOWNSTREAM_EXPRESSION_INCOMPLETE",
        class: "HEX_SURFACE_OR_FOUR_PAIR_BRIDGE_NOT_READY",
        recommendedOwner: "HEX_SURFACE_BRIDGE_OR_FOUR_PAIR_AUTHORITY",
        recommendedFile: HEX_SURFACE_FILE,
        recommendedAction:
          "VERIFY_HEX_SURFACE_AND_FOUR_PAIR_AUTHORITY_ARE_LOADED_AND_PUBLICLY_INSPECTABLE"
      };
    }

    if (!canvasHubReady) {
      return {
        status: "DOWNSTREAM_EXPRESSION_READY_CANVAS_HUB_NOT_INSPECTABLE",
        class: "CANVAS_HUB_PUBLIC_SURFACE_NOT_READY",
        recommendedOwner: "CANVAS_HUB_PUBLIC_API",
        recommendedFile: CANVAS_FILE,
        recommendedAction:
          "VERIFY_CANVAS_HUB_PUBLIC_API_EXPOSES_RENDER_OR_RECEIVE_STATE"
      };
    }

    if (allFingersReady && requiredBridgeReady && canvasHubReady) {
      return {
        status: "DOWNSTREAM_EXPRESSION_READY_PIXEL_BLANK",
        class: "CANVAS_DRAW_PATH_OR_FINAL_EXPRESSION_ADAPTER",
        recommendedOwner: "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
        recommendedFile: CANVAS_FILE,
        recommendedAction:
          "AUDIT_CANVAS_DRAW_PATH_AND_VERIFY_RECEIVED_EXPRESSION_WRITES_VISIBLE_PIXELS"
      };
    }

    return {
      status: "DOWNSTREAM_EXPRESSION_PARTIAL",
      class: "ONE_OR_MORE_NON_SURFACE_FINGERS_NOT_READY",
      recommendedOwner: "CANVAS_FINGER_EXPRESSION_SET",
      recommendedFile: FILE,
      recommendedAction:
        "EXPOSE_BOUNDARY_MASS_LIGHT_POINTER_SURFACE_PACKET_READS_BEFORE_CANVAS_MUTATION"
    };
  }

  function buildReport(input = {}) {
    const diagnosticTimestamp = firstKnown(input.diagnosticTimestamp, nowIso());

    const fingers = FINGER_SPECS.map((spec) => inspectSpec(spec, { discoveryLimit: 20 }));
    const bridges = BRIDGE_SPECS.map((spec) => inspectSpec(spec, { discoveryLimit: 20 }));
    const canvasDom = inspectCanvasDom();
    const expressionDom = inspectExpressionSurfaceDom();

    const downstream = deriveDownstreamStatus(fingers, bridges, canvasDom, expressionDom);

    const observedFingerCount = fingers.filter((entry) => entry.observed).length;
    const readyFingerCount = fingers.filter((entry) => entry.ready).length;
    const observedBridgeCount = bridges.filter((entry) => entry.observed).length;
    const readyBridgeCount = bridges.filter((entry) => entry.ready).length;

    const surface = fingers.find((entry) => entry.id === "SURFACE") || {};
    const pointer = fingers.find((entry) => entry.id === "POINTER") || {};
    const hex = bridges.find((entry) => entry.id === "HEX_SURFACE_BRIDGE") || {};
    const fourPair = bridges.find((entry) => entry.id === "FOUR_PAIR_AUTHORITY") || {};
    const canvasHub = bridges.find((entry) => entry.id === "CANVAS_HUB") || {};

    const notes = [
      "CANVAS_FINGER_INSPECT_AUXILIARY_LAYER_ACTIVE",
      "CANVAS_FINGER_INSPECT_DOES_NOT_MUTATE_PRODUCTION",
      "CANVAS_FINGER_INSPECT_DOES_NOT_DRAW_CANVAS",
      "CANVAS_FINGER_INSPECT_DOES_NOT_REPAIR_CANVAS",
      "CANVAS_FINGER_INSPECT_DOES_NOT_RESTART_RUNTIME",
      "CANVAS_FINGER_INSPECT_DOES_NOT_CLAIM_F13_OR_F21",
      "CANVAS_FINGER_INSPECT_DOES_NOT_CLAIM_READY_TEXT_OR_VISUAL_PASS",
      `BOUNDARY_STATUS:${statusOf(fingers, "BOUNDARY")}`,
      `MASS_STATUS:${statusOf(fingers, "MASS")}`,
      `SURFACE_STATUS:${statusOf(fingers, "SURFACE")}`,
      `POINTER_STATUS:${statusOf(fingers, "POINTER")}`,
      `LIGHT_STATUS:${statusOf(fingers, "LIGHT")}`,
      `HEX_SURFACE_BRIDGE_STATUS:${statusOf(bridges, "HEX_SURFACE_BRIDGE")}`,
      `FOUR_PAIR_AUTHORITY_STATUS:${statusOf(bridges, "FOUR_PAIR_AUTHORITY")}`,
      `CANVAS_PIXEL_SAMPLE_STATUS:${canvasDom.pixelSample.status}`,
      `DOWNSTREAM_CLASS:${downstream.class}`
    ];

    const report = {
      PACKET_NAME: "HEARTH_CANVAS_FINGER_INSPECT_REPORT_PACKET_v1",
      CONTRACT,
      RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: diagnosticTimestamp,

      CANVAS_FILE,
      HEX_SURFACE_FILE,
      FOUR_PAIR_AUTHORITY_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT,

      CANVAS_FINGER_INSPECT_STATUS: "COMPLETE",
      CANVAS_FINGER_INSPECT_ROLE:
        "AUXILIARY_DOWNSTREAM_EXPRESSION_PROOF_LAYER",
      CANVAS_FINGER_INSPECT_AUTHORITY:
        "READ_ONLY_INSPECTION_SURFACE_ONLY",
      CANVAS_FINGER_INSPECT_CHRONOLOGY_OWNER: "false",
      CANVAS_FINGER_INSPECT_NINE_CYCLE_MUTATION: "false",
      CANVAS_FINGER_INSPECT_CAN_BE_READ_BY_SOUTH_PROBE: "true",

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      CANVAS_REPAIR_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      FINGER_OBSERVED_COUNT: String(observedFingerCount),
      FINGER_READY_COUNT: String(readyFingerCount),
      FINGER_EXPECTED_COUNT: String(FINGER_SPECS.length),
      BRIDGE_OBSERVED_COUNT: String(observedBridgeCount),
      BRIDGE_READY_COUNT: String(readyBridgeCount),
      BRIDGE_EXPECTED_COUNT: String(BRIDGE_SPECS.length),

      BOUNDARY_FINGER_STATUS: statusOf(fingers, "BOUNDARY"),
      MASS_FINGER_STATUS: statusOf(fingers, "MASS"),
      SURFACE_FINGER_STATUS: statusOf(fingers, "SURFACE"),
      POINTER_FINGER_STATUS: statusOf(fingers, "POINTER"),
      LIGHT_FINGER_STATUS: statusOf(fingers, "LIGHT"),

      SURFACE_PRIMARY_PATH: surface.primaryPath || "NONE",
      SURFACE_PRIMARY_CONTRACT: surface.primaryContract || "UNKNOWN",
      SURFACE_PACKET_SIGNAL_READY: boolText(Boolean(surface.ready), "false"),
      SURFACE_PACKET_LIKE_KEY_COUNT: String(surface.primaryPacketLikeKeyCount || 0),
      SURFACE_GETTER_RETURNED_COUNT: String(surface.primaryGetterReturnedCount || 0),

      POINTER_PRIMARY_PATH: pointer.primaryPath || "NONE",
      POINTER_PRIMARY_CONTRACT: pointer.primaryContract || "UNKNOWN",
      POINTER_TRANSMISSION_READY: boolText(Boolean(pointer.ready), "false"),
      POINTER_PACKET_LIKE_KEY_COUNT: String(pointer.primaryPacketLikeKeyCount || 0),
      POINTER_GETTER_RETURNED_COUNT: String(pointer.primaryGetterReturnedCount || 0),

      CANVAS_HUB_STATUS: canvasHub.status || "NOT_OBSERVED",
      CANVAS_HUB_PRIMARY_PATH: canvasHub.primaryPath || "NONE",
      CANVAS_HUB_PRIMARY_CONTRACT: canvasHub.primaryContract || "UNKNOWN",
      CANVAS_HUB_READY: boolText(Boolean(canvasHub.ready), "false"),

      HEX_SURFACE_BRIDGE_STATUS: hex.status || "NOT_OBSERVED",
      HEX_SURFACE_PRIMARY_PATH: hex.primaryPath || "NONE",
      HEX_SURFACE_PRIMARY_CONTRACT: hex.primaryContract || "UNKNOWN",
      HEX_SURFACE_READY: boolText(Boolean(hex.ready), "false"),
      HEX_SURFACE_DRAW_PAIR_FRAME_METHOD_PRESENT: boolText(
        methodPresentInSpec(hex, "drawPairFrame"),
        "false"
      ),
      HEX_SURFACE_DRAW_INTERACTIVE_FRAME_METHOD_PRESENT: boolText(
        methodPresentInSpec(hex, "drawInteractiveFrame"),
        "false"
      ),

      FOUR_PAIR_AUTHORITY_STATUS: fourPair.status || "NOT_OBSERVED",
      FOUR_PAIR_AUTHORITY_PRIMARY_PATH: fourPair.primaryPath || "NONE",
      FOUR_PAIR_AUTHORITY_PRIMARY_CONTRACT: fourPair.primaryContract || "UNKNOWN",
      FOUR_PAIR_AUTHORITY_READY: boolText(Boolean(fourPair.ready), "false"),

      EXPRESSION_SURFACE_ELEMENT_FOUND: boolText(
        expressionDom.expressionSurfaceElementFound,
        "false"
      ),
      EXPRESSION_SURFACE_SELECTOR: expressionDom.expressionSurfaceSelector,
      EXPRESSION_SURFACE_RECT_NONZERO: boolText(
        expressionDom.expressionSurfaceRectNonzero,
        "false"
      ),
      EXPRESSION_SURFACE_VISIBLE: boolText(
        expressionDom.expressionSurfaceVisible,
        "false"
      ),

      CANVAS_ELEMENT_FOUND: boolText(canvasDom.canvasElementFound, "false"),
      CANVAS_SELECTOR: canvasDom.canvasSelector,
      CANVAS_DATASET_CONTRACT: canvasDom.canvasDatasetContract || "UNKNOWN",
      CANVAS_DATASET_RECEIPT: canvasDom.canvasDatasetReceipt || "UNKNOWN",
      CANVAS_RECT_NONZERO: boolText(canvasDom.canvasRectNonzero, "false"),
      CANVAS_COMPUTED_VISIBLE: boolText(canvasDom.canvasComputedVisible, "false"),
      CANVAS_VIEWPORT_INTERSECTING: boolText(
        canvasDom.canvasViewportIntersecting,
        "false"
      ),
      CANVAS_CONTEXT_2D_READY: boolText(canvasDom.canvasContext2dReady, "false"),
      CANVAS_CONTEXT_2D_STATUS: canvasDom.canvasContext2dStatus || "UNKNOWN",
      CANVAS_PIXEL_SAMPLE_STATUS: canvasDom.pixelSample.status,
      CANVAS_PIXEL_VISIBLE: boolText(canvasDom.pixelSample.visible, "false"),
      CANVAS_PIXEL_SAMPLE_COUNT: String(canvasDom.pixelSample.sampleCount || 0),
      CANVAS_VISIBLE_PIXEL_COUNT: String(canvasDom.pixelSample.visiblePixelCount || 0),
      CANVAS_ALPHA_PIXEL_COUNT: String(canvasDom.pixelSample.alphaPixelCount || 0),
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: String(canvasDom.pixelSample.uniqueColorCount || 0),
      CANVAS_PIXEL_SAMPLE_REASON: canvasDom.pixelSample.reason,

      DOWNSTREAM_EXPRESSION_SET_STATUS: downstream.status,
      DOWNSTREAM_EXPRESSION_VERDICT_CLASS: downstream.class,
      DOWNSTREAM_RECOMMENDED_OWNER: downstream.recommendedOwner,
      DOWNSTREAM_RECOMMENDED_FILE: downstream.recommendedFile,
      DOWNSTREAM_RECOMMENDED_ACTION: downstream.recommendedAction,

      FINGER_INSPECTION_RESULTS: clonePlain(fingers),
      BRIDGE_INSPECTION_RESULTS: clonePlain(bridges),
      CANVAS_DOM_INSPECTION: clonePlain(canvasDom),
      EXPRESSION_SURFACE_DOM_INSPECTION: clonePlain(expressionDom),

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    return report;
  }

  function statusOf(collection, id) {
    const entry = collection.find((item) => item.id === id);
    return entry ? entry.status : "NOT_OBSERVED";
  }

  function methodPresentInSpec(specResult, methodName) {
    if (!specResult || !Array.isArray(specResult.candidates)) return false;

    return specResult.candidates.some((candidate) => {
      return Array.isArray(candidate.methods) && candidate.methods.includes(methodName);
    });
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",

      "CANVAS_FINGER_INSPECT_STATUS",
      "CANVAS_FINGER_INSPECT_ROLE",
      "CANVAS_FINGER_INSPECT_AUTHORITY",
      "CANVAS_FINGER_INSPECT_CHRONOLOGY_OWNER",
      "CANVAS_FINGER_INSPECT_NINE_CYCLE_MUTATION",
      "CANVAS_FINGER_INSPECT_CAN_BE_READ_BY_SOUTH_PROBE",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_CREATION_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "FINAL_VISUAL_PASS_AUTHORITY",

      "FINGER_OBSERVED_COUNT",
      "FINGER_READY_COUNT",
      "FINGER_EXPECTED_COUNT",
      "BRIDGE_OBSERVED_COUNT",
      "BRIDGE_READY_COUNT",
      "BRIDGE_EXPECTED_COUNT",

      "BOUNDARY_FINGER_STATUS",
      "MASS_FINGER_STATUS",
      "SURFACE_FINGER_STATUS",
      "POINTER_FINGER_STATUS",
      "LIGHT_FINGER_STATUS",

      "SURFACE_PRIMARY_PATH",
      "SURFACE_PRIMARY_CONTRACT",
      "SURFACE_PACKET_SIGNAL_READY",
      "SURFACE_PACKET_LIKE_KEY_COUNT",
      "SURFACE_GETTER_RETURNED_COUNT",

      "POINTER_PRIMARY_PATH",
      "POINTER_PRIMARY_CONTRACT",
      "POINTER_TRANSMISSION_READY",
      "POINTER_PACKET_LIKE_KEY_COUNT",
      "POINTER_GETTER_RETURNED_COUNT",

      "CANVAS_HUB_STATUS",
      "CANVAS_HUB_PRIMARY_PATH",
      "CANVAS_HUB_PRIMARY_CONTRACT",
      "CANVAS_HUB_READY",

      "HEX_SURFACE_BRIDGE_STATUS",
      "HEX_SURFACE_PRIMARY_PATH",
      "HEX_SURFACE_PRIMARY_CONTRACT",
      "HEX_SURFACE_READY",
      "HEX_SURFACE_DRAW_PAIR_FRAME_METHOD_PRESENT",
      "HEX_SURFACE_DRAW_INTERACTIVE_FRAME_METHOD_PRESENT",

      "FOUR_PAIR_AUTHORITY_STATUS",
      "FOUR_PAIR_AUTHORITY_PRIMARY_PATH",
      "FOUR_PAIR_AUTHORITY_PRIMARY_CONTRACT",
      "FOUR_PAIR_AUTHORITY_READY",

      "EXPRESSION_SURFACE_ELEMENT_FOUND",
      "EXPRESSION_SURFACE_SELECTOR",
      "EXPRESSION_SURFACE_RECT_NONZERO",
      "EXPRESSION_SURFACE_VISIBLE",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_DATASET_CONTRACT",
      "CANVAS_DATASET_RECEIPT",
      "CANVAS_RECT_NONZERO",
      "CANVAS_COMPUTED_VISIBLE",
      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_CONTEXT_2D_STATUS",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_PIXEL_SAMPLE_COUNT",
      "CANVAS_VISIBLE_PIXEL_COUNT",
      "CANVAS_ALPHA_PIXEL_COUNT",
      "CANVAS_PIXEL_UNIQUE_COLOR_COUNT",
      "CANVAS_PIXEL_SAMPLE_REASON",

      "DOWNSTREAM_EXPRESSION_SET_STATUS",
      "DOWNSTREAM_EXPRESSION_VERDICT_CLASS",
      "DOWNSTREAM_RECOMMENDED_OWNER",
      "DOWNSTREAM_RECOMMENDED_FILE",
      "DOWNSTREAM_RECOMMENDED_ACTION",

      "SECONDARY_EVIDENCE_NOTES",

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
      .map((field) => line(field, report[field]))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("CONTRACT", CONTRACT),
      line("CANVAS_FINGER_INSPECT_STATUS", report.CANVAS_FINGER_INSPECT_STATUS),
      line("FINGER_READY_COUNT", report.FINGER_READY_COUNT),
      line("BRIDGE_READY_COUNT", report.BRIDGE_READY_COUNT),
      line("SURFACE_FINGER_STATUS", report.SURFACE_FINGER_STATUS),
      line("POINTER_FINGER_STATUS", report.POINTER_FINGER_STATUS),
      line("HEX_SURFACE_BRIDGE_STATUS", report.HEX_SURFACE_BRIDGE_STATUS),
      line("FOUR_PAIR_AUTHORITY_STATUS", report.FOUR_PAIR_AUTHORITY_STATUS),
      line("CANVAS_PIXEL_SAMPLE_STATUS", report.CANVAS_PIXEL_SAMPLE_STATUS),
      line("CANVAS_PIXEL_VISIBLE", report.CANVAS_PIXEL_VISIBLE),
      line("DOWNSTREAM_EXPRESSION_VERDICT_CLASS", report.DOWNSTREAM_EXPRESSION_VERDICT_CLASS),
      line("DOWNSTREAM_RECOMMENDED_FILE", report.DOWNSTREAM_RECOMMENDED_FILE),
      line("DOWNSTREAM_RECOMMENDED_ACTION", report.DOWNSTREAM_RECOMMENDED_ACTION)
    ].join("\n");
  }

  function publishReport(report) {
    lastReport = clonePlain(report);
    lastPacketText = composePacketText(report);
    lastCompactSummary = composeCompactSummary(report);
    lastState = {
      role: "CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_LAYER",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      status: report.CANVAS_FINGER_INSPECT_STATUS,
      downstreamExpressionSetStatus: report.DOWNSTREAM_EXPRESSION_SET_STATUS,
      downstreamExpressionVerdictClass: report.DOWNSTREAM_EXPRESSION_VERDICT_CLASS,
      downstreamRecommendedFile: report.DOWNSTREAM_RECOMMENDED_FILE,
      canvasPixelSampleStatus: report.CANVAS_PIXEL_SAMPLE_STATUS,
      canvasPixelVisible: report.CANVAS_PIXEL_VISIBLE,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };

    publishAllAliases();
  }

  function runCanvasFingerInspect(input = {}) {
    const report = buildReport(input);
    publishReport(report);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: CONTRACT,
      implementationReceipt: RECEIPT,
      CANVAS_FINGER_INSPECT_STATUS: report.CANVAS_FINGER_INSPECT_STATUS,
      DOWNSTREAM_EXPRESSION_SET_STATUS: report.DOWNSTREAM_EXPRESSION_SET_STATUS,
      DOWNSTREAM_EXPRESSION_VERDICT_CLASS: report.DOWNSTREAM_EXPRESSION_VERDICT_CLASS,
      DOWNSTREAM_RECOMMENDED_OWNER: report.DOWNSTREAM_RECOMMENDED_OWNER,
      DOWNSTREAM_RECOMMENDED_FILE: report.DOWNSTREAM_RECOMMENDED_FILE,
      DOWNSTREAM_RECOMMENDED_ACTION: report.DOWNSTREAM_RECOMMENDED_ACTION,
      CANVAS_PIXEL_SAMPLE_STATUS: report.CANVAS_PIXEL_SAMPLE_STATUS,
      CANVAS_PIXEL_VISIBLE: report.CANVAS_PIXEL_VISIBLE,
      FINGER_READY_COUNT: report.FINGER_READY_COUNT,
      BRIDGE_READY_COUNT: report.BRIDGE_READY_COUNT,
      evidence: report,
      REPORT_OBJECT: report,
      report,
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function runInspect(input = {}) {
    return runCanvasFingerInspect(input);
  }

  function inspect(input = {}) {
    return runCanvasFingerInspect(input);
  }

  function runDiagnostic(input = {}) {
    return runCanvasFingerInspect(input);
  }

  function probe(input = {}) {
    return runCanvasFingerInspect(input);
  }

  function getReport(options = {}) {
    if (options && options.refresh === false && lastReport) {
      return clonePlain(lastReport);
    }

    const result = runCanvasFingerInspect({
      diagnosticTimestamp: nowIso(),
      reason: "GET_REPORT_REFRESH"
    });

    return clonePlain(result.report);
  }

  function getPacketText(options = {}) {
    if (options && options.refresh === false && lastPacketText) return lastPacketText;
    getReport();
    return lastPacketText;
  }

  function getCompactSummary(options = {}) {
    if (options && options.refresh === false && lastCompactSummary) return lastCompactSummary;
    getReport();
    return lastCompactSummary;
  }

  function getState() {
    return clonePlain(lastState || baseState());
  }

  function baseState() {
    return {
      role: "CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_LAYER",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      status: "READY",
      downstreamExpressionSetStatus: "NOT_RUN",
      downstreamExpressionVerdictClass: "NOT_RUN",
      downstreamRecommendedFile: "UNKNOWN",
      canvasPixelSampleStatus: "NOT_RUN",
      canvasPixelVisible: "UNKNOWN",
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getReceiptLight() {
    return {
      role: "CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_LAYER",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      fourPairAuthorityFile: FOUR_PAIR_AUTHORITY_FILE,

      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedFourPairAuthorityContract: EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT,

      primaryCallableMethod: "runCanvasFingerInspect",
      runCanvasFingerInspectApiAvailable: true,
      runInspectApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      probeApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      auxiliaryLayerOnly: true,
      chronologyOwner: false,
      nineCycleMutation: false,
      readableBySouthProbe: true,

      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      CANVAS_FINGER_INSPECT_CONTRACT: CONTRACT,
      CANVAS_FINGER_INSPECT_RECEIPT: RECEIPT,
      CANVAS_FINGER_INSPECT_FILE: FILE,
      reportObject: clonePlain(lastReport || {}),
      state: clonePlain(lastState || baseState()),
      ...UPPER_NO_CLAIMS
    };
  }

  function publishAllAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvasFingerInspect = api;
    root.HEARTH.canvasFingerInspector = api;
    root.HEARTH.canvasFingerExpressionInspect = api;
    root.HEARTH.diagnosticCanvasFingerInspect = api;
    root.HEARTH.hearthCanvasFingerInspect = api;

    root.DEXTER_LAB.hearthCanvasFingerInspect = api;
    root.DEXTER_LAB.hearthCanvasFingerInspector = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasFingerInspect = api;

    root.HEARTH_CANVAS_FINGER_INSPECT = api;
    root.HEARTH_CANVAS_FINGER_INSPECTOR = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_FINGER_INSPECT = api;

    root.HEARTH_CANVAS_FINGER_INSPECT_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_INSPECT_REPORT = clonePlain(lastReport || {});
    root.HEARTH_CANVAS_FINGER_INSPECT_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_CANVAS_FINGER_INSPECT_COMPACT_SUMMARY =
      lastCompactSummary || "";
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    canvasFile: CANVAS_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    fourPairAuthorityFile: FOUR_PAIR_AUTHORITY_FILE,

    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedFourPairAuthorityContract: EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT,

    primaryCallableMethod: "runCanvasFingerInspect",

    runCanvasFingerInspect,
    runInspect,
    inspect,
    runDiagnostic,
    probe,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getReceipt,
    getReceiptLight,

    runCanvasFingerInspectApiAvailable: true,
    runInspectApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    probeApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    auxiliaryLayerOnly: true,
    chronologyOwner: false,
    nineCycleMutation: false,
    readableBySouthProbe: true,

    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  lastState = baseState();
  publishAllAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
