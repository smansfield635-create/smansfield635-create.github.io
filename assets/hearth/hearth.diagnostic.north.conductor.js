// /assets/hearth/hearth.diagnostic.north.conductor.js
// HEARTH_DIAGNOSTIC_NORTH_CANVAS_EXPRESSION_WEST_BRIDGE_CONDUCTOR_TNT_v1
// Full-file addition.
// Diagnostic NORTH conductor / bridge file only.
// Purpose:
// - Take bridge-weight off /assets/hearth/hearth.diagnostic.rail.js.
// - Preserve NORTH rail as canonical diagnostic authority.
// - Preserve WEST v7 as rendered Canvas-expression observatory standard.
// - Prepare NORTH v8 renewal by publishing a stable conductor packet.
// - Prepare EAST renewal to conform to WEST v7 source-footprint standard.
// - Prepare SOUTH renewal to conform to NORTH final-report meaning preservation.
// - Expose bridge truth without requiring other files to read this file.
// - Publish only optional public globals and receipts.
// Does not own:
// - NORTH canonical verdict authority
// - EAST served-source parsing
// - WEST rendered-target probing
// - SOUTH packet formatting
// - diagnostic UI
// - Hearth repair
// - production mutation
// - runtime restart
// - Canvas release
// - Macro West release
// - control implementation
// - route-conductor implementation
// - terrain/material/hydrology truth
// - motion/touch/drag execution
// - visual pass claims
// - F13/F21 claims

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_NORTH_CANVAS_EXPRESSION_WEST_BRIDGE_CONDUCTOR_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_NORTH_CANVAS_EXPRESSION_WEST_BRIDGE_CONDUCTOR_RECEIPT_v1";

  const VERSION =
    "2026-06-05.hearth-diagnostic-north-canvas-expression-west-bridge-conductor-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.north.conductor.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";

  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";

  const NORTH_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_TNT_v8";
  const NORTH_PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_SOUTH_NEWS_FIBONACCI_ALIGNMENT_ORCHESTRATOR_TNT_v7";

  const EAST_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";
  const EAST_CURRENT_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CURRENT_SERVED_SPREAD_BISHOP_CANVAS_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v7";

  const WEST_RAIL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const WEST_STANDARD_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";

  const SOUTH_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_NORTH_V8_CANVAS_EXPRESSION_PACKET_CONFORMANCE_TNT_v8";
  const SOUTH_CURRENT_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";

  const HTML_CURRENT_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const INDEX_CURRENT_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const ROUTE_CURRENT_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";

  const ROUTE_ACCEPTED_LINEAGE = Object.freeze([
    ROUTE_CURRENT_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    HELD: "HELD",
    FAILED: "FAILED",
    UNKNOWN: "UNKNOWN"
  });

  const BRIDGE = Object.freeze({
    READY: "BRIDGE_READY",
    PARTIAL: "BRIDGE_PARTIAL",
    HELD: "BRIDGE_HELD",
    MISSING: "BRIDGE_MISSING",
    NOT_AUTHORITY: "NOT_AUTHORITY"
  });

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NOT_FOUND: "NOT_FOUND",
    UNREADABLE: "UNREADABLE",
    INACCESSIBLE: "INACCESSIBLE",
    INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
    EXPECTED_NOT_YET_BUILT: "EXPECTED_NOT_YET_BUILT",
    EXPECTED_NOT_YET_WIRED: "EXPECTED_NOT_YET_WIRED",
    HANDSHAKE_PENDING: "HANDSHAKE_PENDING",
    ACTIVE: "ACTIVE",
    ACTIVE_DEGRADED: "ACTIVE_DEGRADED",
    READY: "READY",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    HELD: "HELD",
    NONE: "none"
  });

  const NO_CLAIM_FIELDS = Object.freeze({
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

  const UPPER_NO_CLAIM_FIELDS = Object.freeze({
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

  let lastState = null;
  let lastPacket = null;
  let lastReceipt = null;

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

  function bounded(value, limit = 5000) {
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

  function boolText(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function toBool(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }

    return "";
  }

  function readPath(base, path) {
    try {
      const parts = safeString(path).split(".");
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

  function findFirstPath(paths) {
    for (const path of paths || []) {
      const found = readPath(root, path);
      if (found && isObject(found)) return { path, value: found };
    }

    return { path: "NONE", value: null };
  }

  function getReceiptFromAuthority(authority) {
    try {
      if (!authority || !isObject(authority)) return null;

      const methods = [
        "getReceiptLight",
        "getReceipt",
        "getState",
        "getWestReceipt",
        "getEastReceipt",
        "getSouthReceipt",
        "getNorthVerdict",
        "getReport",
        "getCanvasStationSummary",
        "getCanvasStationReceiptLight",
        "getRoutePrimaryGateReceipt",
        "getRouteCycleReceipt"
      ];

      for (const method of methods) {
        if (!isFunction(authority[method])) continue;
        const value = authority[method]();
        if (isObject(value)) return value;
      }

      if (isObject(authority.receiptObject)) return authority.receiptObject;
      if (isObject(authority.receipt)) return authority.receipt;
      if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

      return null;
    } catch (error) {
      return {
        error: bounded(error && error.message ? error.message : error, 1000)
      };
    }
  }

  function getValue(source, keys, fallback = FALLBACK.UNKNOWN) {
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

  function addNote(state, note) {
    const clean = bounded(note, 1600);
    if (!clean) return;
    if (!state.notes.includes(clean)) state.notes.push(clean);
  }

  function contractMatches(value, expected) {
    return safeString(value).includes(expected);
  }

  function contractInLineage(value, lineage) {
    const text = safeString(value);
    return lineage.some((contract) => text.includes(contract));
  }

  function makeState() {
    return {
      status: STATUS.READY,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      updatedAt: nowIso(),

      northFile: NORTH_FILE,
      northTargetContract: NORTH_TARGET_CONTRACT,
      northPreviousContract: NORTH_PREVIOUS_CONTRACT,
      northAuthorityObserved: false,
      northAuthoritySource: "NONE",
      northObservedContract: FALLBACK.UNKNOWN,
      northObservedReceipt: FALLBACK.UNKNOWN,
      northBridgeStatus: BRIDGE.HELD,

      westFile: WEST_FILE,
      westRailContract: WEST_RAIL_CONTRACT,
      westStandardContract: WEST_STANDARD_CONTRACT,
      westAuthorityObserved: false,
      westAuthoritySource: "NONE",
      westObservedContract: FALLBACK.UNKNOWN,
      westObservedImplementationContract: FALLBACK.UNKNOWN,
      westObservedReceipt: FALLBACK.UNKNOWN,
      westStandardAccepted: "false",
      westRenderedReadStatus: FALLBACK.UNKNOWN,
      westCanvasExpressionProofStatus: FALLBACK.UNKNOWN,
      westCanvasExpressionBottleneckClass: FALLBACK.UNKNOWN,
      westRenderedPlanetProofReady: FALLBACK.UNKNOWN,
      westRenderedPlanetProofInspected: FALLBACK.UNKNOWN,
      westVisiblePlanetProofReady: FALLBACK.UNKNOWN,
      westVisiblePlanetProofSource: FALLBACK.UNKNOWN,
      westFourWayCanvasHandoffStatus: FALLBACK.UNKNOWN,
      westBridgeStatus: BRIDGE.HELD,

      eastFile: EAST_FILE,
      eastCurrentContract: EAST_CURRENT_CONTRACT,
      eastTargetContract: EAST_TARGET_CONTRACT,
      eastAuthorityObserved: false,
      eastAuthoritySource: "NONE",
      eastObservedContract: FALLBACK.UNKNOWN,
      eastObservedImplementationContract: FALLBACK.UNKNOWN,
      eastObservedReceipt: FALLBACK.UNKNOWN,
      eastConformityStatus: FALLBACK.EXPECTED_NOT_YET_WIRED,
      eastRecommendedNextAction:
        "RENEW_EAST_TO_CONFORM_TO_WEST_V7_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_STANDARD",
      eastBridgeStatus: BRIDGE.HELD,

      southFile: SOUTH_FILE,
      southCurrentContract: SOUTH_CURRENT_CONTRACT,
      southTargetContract: SOUTH_TARGET_CONTRACT,
      southAuthorityObserved: false,
      southAuthoritySource: "NONE",
      southObservedContract: FALLBACK.UNKNOWN,
      southObservedImplementationContract: FALLBACK.UNKNOWN,
      southObservedReceipt: FALLBACK.UNKNOWN,
      southConformityStatus: FALLBACK.EXPECTED_NOT_YET_WIRED,
      southRecommendedNextAction:
        "RENEW_SOUTH_TO_PRESERVE_NORTH_V8_FINAL_PACKET_MEANING_AND_CANVAS_EXPRESSION_FIELDS",
      southBridgeStatus: BRIDGE.HELD,

      htmlCurrentContract: HTML_CURRENT_CONTRACT,
      indexCurrentContract: INDEX_CURRENT_CONTRACT,
      routeCurrentContract: ROUTE_CURRENT_CONTRACT,
      routeAcceptedLineage: ROUTE_ACCEPTED_LINEAGE.slice(),

      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      indexFile: INDEX_FILE,
      canvasFile: CANVAS_FILE,
      controlFile: CONTROL_FILE,

      routeConductorObserved: false,
      routeConductorSource: "NONE",
      routeConductorContract: FALLBACK.UNKNOWN,
      routeConductorLineageAccepted: FALLBACK.UNKNOWN,

      canvasObserved: false,
      canvasSource: "NONE",
      canvasContract: FALLBACK.UNKNOWN,
      canvasBridgeStatus: BRIDGE.HELD,

      controlObserved: false,
      controlSource: "NONE",
      controlContract: FALLBACK.UNKNOWN,
      controlStatus: FALLBACK.EXPECTED_NOT_YET_BUILT,
      motionTouchStatus: FALLBACK.WAITING_CONTROL_FILE,
      controlsBlockVisiblePlanet: "false",

      conductorBridgeMode:
        "WEST_STANDARD_ANCHORS_NORTH_RENEWAL_EAST_AND_SOUTH_CONFORM_AFTERWARD",
      conductorStatus: BRIDGE.HELD,
      nextFile: EAST_FILE,
      nextOwner: "DIAGNOSTIC_SOURCE_SCHEMA_ALIGNMENT",
      nextAction:
        "RENEW_EAST_TO_CONFORM_TO_NORTH_V8_AND_WEST_V7_CANVAS_EXPRESSION_STANDARD",

      northRailShouldRemainCanonicalAuthority: true,
      conductorDoesNotNeedToBeReadByOtherFiles: true,
      westIsBridgeStandardForNorthRenewal: true,
      eastWillConformAfterNorth: true,
      southWillConformAfterEast: true,

      notes: [],

      ...NO_CLAIM_FIELDS
    };
  }

  function readNorth(state) {
    const found = findFirstPath([
      "HEARTH.diagnosticRail",
      "HEARTH.parallelDiagnosticRail",
      "HEARTH.diagnosticNorth",
      "HEARTH.diagnosticRailNorth",
      "HEARTH.diagnosticNorthCanvasExpressionWestStandard",
      "HEARTH_DIAGNOSTIC_RAIL",
      "HEARTH_PARALLEL_DIAGNOSTIC_RAIL",
      "HEARTH_DIAGNOSTIC_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD",
      "DEXTER_LAB.hearthDiagnosticRail",
      "DEXTER_LAB.hearthDiagnosticNorth"
    ]);

    const receipt = getReceiptFromAuthority(found.value) || {};

    state.northAuthorityObserved = Boolean(found.value || receipt.contract || receipt.CONTRACT);
    state.northAuthoritySource = found.path;
    state.northObservedContract = firstNonEmpty(
      receipt.contract,
      receipt.CONTRACT,
      receipt.northContract,
      found.value && found.value.contract,
      FALLBACK.UNKNOWN
    );
    state.northObservedReceipt = firstNonEmpty(
      receipt.receipt,
      receipt.RECEIPT,
      receipt.northReceipt,
      found.value && found.value.receipt,
      FALLBACK.UNKNOWN
    );

    if (contractMatches(state.northObservedContract, NORTH_TARGET_CONTRACT)) {
      state.northBridgeStatus = BRIDGE.READY;
      addNote(state, "NORTH_V8_TARGET_ALREADY_OBSERVED");
      return;
    }

    if (contractMatches(state.northObservedContract, NORTH_PREVIOUS_CONTRACT)) {
      state.northBridgeStatus = BRIDGE.PARTIAL;
      addNote(state, "NORTH_V7_OBSERVED_READY_FOR_V8_RENEWAL");
      return;
    }

    if (state.northAuthorityObserved) {
      state.northBridgeStatus = BRIDGE.PARTIAL;
      addNote(state, `NORTH_AUTHORITY_OBSERVED_NON_TARGET:${state.northObservedContract}`);
      return;
    }

    state.northBridgeStatus = BRIDGE.HELD;
    addNote(state, "NORTH_AUTHORITY_NOT_OBSERVED_CONDUCTOR_REMAINS_OPTIONAL");
  }

  function readWest(state) {
    const found = findFirstPath([
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "HEARTH.diagnosticWestCanvasExpressionRenderedRangeObservatory",
      "HEARTH_DIAGNOSTIC_WEST",
      "HEARTH_DIAGNOSTIC_RAIL_WEST",
      "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY",
      "DEXTER_LAB.hearthDiagnosticWest",
      "DEXTER_LAB.hearthDiagnosticRailWest",
      "DEXTER_LAB.hearthDiagnosticWestCanvasExpressionRenderedRangeObservatory"
    ]);

    const receipt = getReceiptFromAuthority(found.value) || {};
    const stateObject = found.value && isFunction(found.value.getWestState)
      ? found.value.getWestState()
      : {};

    state.westAuthorityObserved = Boolean(found.value || receipt.contract || receipt.CONTRACT);
    state.westAuthoritySource = found.path;
    state.westObservedContract = firstNonEmpty(
      receipt.contract,
      receipt.CONTRACT,
      stateObject.contract,
      found.value && found.value.contract,
      FALLBACK.UNKNOWN
    );
    state.westObservedImplementationContract = firstNonEmpty(
      receipt.implementationContract,
      receipt.WEST_IMPLEMENTATION_CONTRACT,
      stateObject.implementationContract,
      stateObject.westImplementationContract,
      FALLBACK.UNKNOWN
    );
    state.westObservedReceipt = firstNonEmpty(
      receipt.receipt,
      receipt.RECEIPT,
      receipt.implementationReceipt,
      found.value && found.value.receipt,
      FALLBACK.UNKNOWN
    );

    state.westRenderedReadStatus = firstNonEmpty(
      receipt.lastWestRenderedReadStatus,
      receipt.WEST_RENDERED_READ_STATUS,
      stateObject.westRenderedReadStatus,
      FALLBACK.UNKNOWN
    );

    state.westCanvasExpressionProofStatus = firstNonEmpty(
      receipt.lastCanvasExpressionProofStatus,
      receipt.CANVAS_EXPRESSION_PROOF_STATUS,
      stateObject.canvasExpressionProofStatus,
      FALLBACK.UNKNOWN
    );

    state.westCanvasExpressionBottleneckClass = firstNonEmpty(
      receipt.lastCanvasExpressionBottleneckClass,
      receipt.CANVAS_EXPRESSION_BOTTLENECK_CLASS,
      stateObject.canvasExpressionBottleneckClass,
      FALLBACK.UNKNOWN
    );

    state.westRenderedPlanetProofReady = firstNonEmpty(
      receipt.lastRenderedPlanetProofReady,
      receipt.RENDERED_PLANET_PROOF_READY,
      stateObject.renderedPlanetProofReady,
      FALLBACK.UNKNOWN
    );

    state.westRenderedPlanetProofInspected = firstNonEmpty(
      receipt.lastRenderedPlanetProofFullyInspected,
      receipt.RENDERED_PLANET_PROOF_FULLY_INSPECTED,
      stateObject.renderedPlanetProofFullyInspected,
      FALLBACK.UNKNOWN
    );

    state.westVisiblePlanetProofReady = firstNonEmpty(
      receipt.lastVisiblePlanetProofReady,
      receipt.VISIBLE_PLANET_PROOF_READY,
      stateObject.visiblePlanetProofReady,
      FALLBACK.UNKNOWN
    );

    state.westVisiblePlanetProofSource = firstNonEmpty(
      receipt.VISIBLE_PLANET_PROOF_SOURCE,
      stateObject.visiblePlanetProofSource,
      FALLBACK.UNKNOWN
    );

    state.westFourWayCanvasHandoffStatus = firstNonEmpty(
      receipt.lastFourWayCanvasHandoffStatus,
      receipt.FOUR_WAY_CANVAS_HANDOFF_STATUS,
      stateObject.fourWayCanvasHandoffStatus,
      FALLBACK.UNKNOWN
    );

    const contractOk =
      state.westObservedContract === WEST_RAIL_CONTRACT ||
      state.westObservedContract.includes("HEARTH_DIAGNOSTIC_WEST");

    const implementationOk =
      state.westObservedImplementationContract === WEST_STANDARD_CONTRACT ||
      state.westObservedContract === WEST_STANDARD_CONTRACT;

    const expressionFieldsObserved =
      state.westCanvasExpressionProofStatus !== FALLBACK.UNKNOWN ||
      state.westCanvasExpressionBottleneckClass !== FALLBACK.UNKNOWN ||
      state.westRenderedPlanetProofReady !== FALLBACK.UNKNOWN ||
      state.westFourWayCanvasHandoffStatus !== FALLBACK.UNKNOWN;

    state.westStandardAccepted = boolText(Boolean(contractOk && implementationOk && expressionFieldsObserved), "false");

    if (state.westStandardAccepted === "true") {
      state.westBridgeStatus = BRIDGE.READY;
      addNote(state, "WEST_V7_CANVAS_EXPRESSION_STANDARD_ACCEPTED_AS_BRIDGE");
      return;
    }

    if (state.westAuthorityObserved && contractOk) {
      state.westBridgeStatus = BRIDGE.PARTIAL;
      addNote(state, "WEST_AUTHORITY_OBSERVED_BUT_V7_EXPRESSION_STANDARD_NOT_FULLY_PROVEN");
      return;
    }

    state.westBridgeStatus = BRIDGE.HELD;
    addNote(state, "WEST_STANDARD_NOT_OBSERVED_CONDUCTOR_HOLDS_WITHOUT_MUTATION");
  }

  function readEast(state) {
    const found = findFirstPath([
      "HEARTH.diagnosticEast",
      "HEARTH.diagnosticRailEast",
      "HEARTH_DIAGNOSTIC_EAST",
      "HEARTH_DIAGNOSTIC_RAIL_EAST",
      "DEXTER_LAB.hearthDiagnosticEast",
      "DEXTER_LAB.hearthDiagnosticRailEast"
    ]);

    const receipt = getReceiptFromAuthority(found.value) || {};

    state.eastAuthorityObserved = Boolean(found.value || receipt.contract || receipt.CONTRACT);
    state.eastAuthoritySource = found.path;
    state.eastObservedContract = firstNonEmpty(
      receipt.contract,
      receipt.CONTRACT,
      receipt.EAST_ALIGNMENT_CONTRACT,
      found.value && found.value.contract,
      FALLBACK.UNKNOWN
    );
    state.eastObservedImplementationContract = firstNonEmpty(
      receipt.implementationContract,
      receipt.EAST_IMPLEMENTATION_CONTRACT,
      FALLBACK.UNKNOWN
    );
    state.eastObservedReceipt = firstNonEmpty(
      receipt.receipt,
      receipt.RECEIPT,
      found.value && found.value.receipt,
      FALLBACK.UNKNOWN
    );

    if (contractMatches(state.eastObservedContract, EAST_TARGET_CONTRACT)) {
      state.eastConformityStatus = "EAST_ALREADY_CONFORMS_TO_NORTH_V8_WEST_V7_STANDARD";
      state.eastBridgeStatus = BRIDGE.READY;
      addNote(state, "EAST_TARGET_CONTRACT_ALREADY_OBSERVED");
      return;
    }

    if (state.eastAuthorityObserved) {
      state.eastConformityStatus = "EAST_OBSERVED_BUT_RENEWAL_REQUIRED_TO_CONFORM_TO_WEST_STANDARD";
      state.eastBridgeStatus = BRIDGE.PARTIAL;
      addNote(state, "EAST_RENEWAL_REQUIRED_AFTER_NORTH_CONDUCTOR");
      return;
    }

    state.eastConformityStatus = FALLBACK.EXPECTED_NOT_YET_WIRED;
    state.eastBridgeStatus = BRIDGE.HELD;
    addNote(state, "EAST_NOT_OBSERVED_CONDUCTOR_PUBLISHES_FORWARD_STANDARD");
  }

  function readSouth(state) {
    const found = findFirstPath([
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH_DIAGNOSTIC_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "DEXTER_LAB.hearthDiagnosticSouth",
      "DEXTER_LAB.hearthDiagnosticRailSouth"
    ]);

    const receipt = getReceiptFromAuthority(found.value) || {};

    state.southAuthorityObserved = Boolean(found.value || receipt.contract || receipt.CONTRACT);
    state.southAuthoritySource = found.path;
    state.southObservedContract = firstNonEmpty(
      receipt.contract,
      receipt.CONTRACT,
      receipt.SOUTH_IMPLEMENTATION_CONTRACT,
      found.value && found.value.contract,
      FALLBACK.UNKNOWN
    );
    state.southObservedImplementationContract = firstNonEmpty(
      receipt.implementationContract,
      receipt.SOUTH_IMPLEMENTATION_CONTRACT,
      FALLBACK.UNKNOWN
    );
    state.southObservedReceipt = firstNonEmpty(
      receipt.receipt,
      receipt.RECEIPT,
      found.value && found.value.receipt,
      FALLBACK.UNKNOWN
    );

    if (contractMatches(state.southObservedContract, SOUTH_TARGET_CONTRACT)) {
      state.southConformityStatus = "SOUTH_ALREADY_CONFORMS_TO_NORTH_V8_PACKET_MEANING";
      state.southBridgeStatus = BRIDGE.READY;
      addNote(state, "SOUTH_TARGET_CONTRACT_ALREADY_OBSERVED");
      return;
    }

    if (state.southAuthorityObserved) {
      state.southConformityStatus = "SOUTH_OBSERVED_BUT_RENEWAL_REQUIRED_AFTER_EAST";
      state.southBridgeStatus = BRIDGE.PARTIAL;
      addNote(state, "SOUTH_RENEWAL_REQUIRED_AFTER_EAST_CONFORMANCE");
      return;
    }

    state.southConformityStatus = FALLBACK.EXPECTED_NOT_YET_WIRED;
    state.southBridgeStatus = BRIDGE.HELD;
    addNote(state, "SOUTH_NOT_OBSERVED_CONDUCTOR_PUBLISHES_LATER_PACKET_STANDARD");
  }

  function readRouteConductor(state) {
    const found = findFirstPath([
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH_ROUTE_CONDUCTOR",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthRouteConductor"
    ]);

    const receipt = getReceiptFromAuthority(found.value) || {};

    state.routeConductorObserved = Boolean(found.value || receipt.contract || receipt.CONTRACT);
    state.routeConductorSource = found.path;
    state.routeConductorContract = firstNonEmpty(
      receipt.contract,
      receipt.CONTRACT,
      receipt.currentRouteConductorContract,
      found.value && found.value.contract,
      FALLBACK.UNKNOWN
    );
    state.routeConductorLineageAccepted = boolText(
      contractInLineage(state.routeConductorContract, ROUTE_ACCEPTED_LINEAGE),
      "false"
    );

    if (state.routeConductorLineageAccepted === "true") {
      addNote(state, "ROUTE_CONDUCTOR_V9_9_OR_ACCEPTED_LINEAGE_OBSERVED");
    }
  }

  function readCanvas(state) {
    const found = findFirstPath([
      "HEARTH.canvas",
      "HEARTH.canvasHub",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasLocalStation",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_HUB",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH_CANVAS_LOCAL_STATION",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvasExpressionHub"
    ]);

    const receipt = getReceiptFromAuthority(found.value) || {};

    state.canvasObserved = Boolean(found.value || receipt.contract || receipt.CONTRACT);
    state.canvasSource = found.path;
    state.canvasContract = firstNonEmpty(
      receipt.contract,
      receipt.CONTRACT,
      receipt.canvasContract,
      receipt.currentCanvasParentContract,
      found.value && found.value.contract,
      FALLBACK.UNKNOWN
    );

    if (state.canvasObserved && state.canvasContract.includes("HEARTH_CANVAS")) {
      state.canvasBridgeStatus = BRIDGE.PARTIAL;
      addNote(state, "CANVAS_AUTHORITY_OBSERVED_OPTIONAL_BRIDGE_PROOF");
    }
  }

  function readControls(state) {
    const found = findFirstPath([
      "HEARTH.controls",
      "HEARTH.planetControls",
      "HEARTH.motionTouchControls",
      "HEARTH.viewControls",
      "HEARTH_CONTROLS",
      "HEARTH_PLANET_CONTROLS",
      "HEARTH_MOTION_TOUCH_CONTROLS",
      "DEXTER_LAB.hearthControls"
    ]);

    const receipt = getReceiptFromAuthority(found.value) || {};

    state.controlObserved = Boolean(found.value || receipt.contract || receipt.CONTRACT);
    state.controlSource = found.path;
    state.controlContract = firstNonEmpty(
      receipt.contract,
      receipt.CONTRACT,
      receipt.controlsContract,
      found.value && found.value.contract,
      FALLBACK.UNKNOWN
    );

    const motionReady = Boolean(
      toBool(receipt.motionTouchReady, false) ||
      toBool(receipt.dragReady, false) ||
      toBool(receipt.viewControlReady, false) ||
      isFunction(found.value && found.value.bindDrag) ||
      isFunction(found.value && found.value.bindMotionTouch) ||
      isFunction(found.value && found.value.enableMotionTouch)
    );

    if (state.controlObserved && motionReady) {
      state.controlStatus = "CONTROL_FILE_PRESENT_AND_MOTION_TOUCH_READY";
      state.motionTouchStatus = FALLBACK.ACTIVE;
      addNote(state, "CONTROL_FILE_PRESENT_AND_MOTION_TOUCH_READY");
      return;
    }

    if (state.controlObserved) {
      state.controlStatus = FALLBACK.HANDSHAKE_PENDING;
      state.motionTouchStatus = FALLBACK.WAITING_CONTROL_FILE;
      addNote(state, "CONTROL_FILE_PRESENT_HANDSHAKE_PENDING");
      return;
    }

    state.controlStatus = FALLBACK.EXPECTED_NOT_YET_BUILT;
    state.motionTouchStatus = FALLBACK.WAITING_CONTROL_FILE;
    state.controlsBlockVisiblePlanet = "false";
    addNote(state, "CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET");
  }

  function resolveConductorStatus(state) {
    const westReady = state.westBridgeStatus === BRIDGE.READY;
    const northReadyOrPartial =
      state.northBridgeStatus === BRIDGE.READY ||
      state.northBridgeStatus === BRIDGE.PARTIAL ||
      state.northBridgeStatus === BRIDGE.HELD;

    if (westReady && northReadyOrPartial) {
      state.conductorStatus = BRIDGE.READY;
      state.status = STATUS.COMPLETE;
      state.nextOwner = "DIAGNOSTIC_SOURCE_SCHEMA_ALIGNMENT";
      state.nextFile = EAST_FILE;
      state.nextAction =
        "RENEW_EAST_TO_CONFORM_TO_NORTH_V8_AND_WEST_V7_CANVAS_EXPRESSION_STANDARD";
      addNote(state, "CONDUCTOR_READY_WEST_STANDARD_CAN_ANCHOR_NORTH_AND_EAST");
      return;
    }

    if (state.westBridgeStatus === BRIDGE.PARTIAL) {
      state.conductorStatus = BRIDGE.PARTIAL;
      state.status = STATUS.PARTIAL;
      state.nextOwner = "DIAGNOSTIC_RENDERED_CANVAS_EXPRESSION_STANDARD";
      state.nextFile = WEST_FILE;
      state.nextAction =
        "VERIFY_OR_RENEW_WEST_V7_CANVAS_EXPRESSION_STANDARD_BEFORE_NORTH_RENEWAL";
      addNote(state, "CONDUCTOR_PARTIAL_WEST_PRESENT_BUT_STANDARD_NOT_FULLY_ACCEPTED");
      return;
    }

    state.conductorStatus = BRIDGE.HELD;
    state.status = STATUS.HELD;
    state.nextOwner = "DIAGNOSTIC_RENDERED_CANVAS_EXPRESSION_STANDARD";
    state.nextFile = WEST_FILE;
    state.nextAction =
      "LOAD_OR_VERIFY_WEST_V7_BEFORE_USING_CONDUCTOR_AS_NORTH_RENEWAL_BRIDGE";
    addNote(state, "CONDUCTOR_HELD_WEST_STANDARD_NOT_OBSERVED");
  }

  function makePacket(state) {
    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_NORTH_CANVAS_EXPRESSION_WEST_BRIDGE_CONDUCTOR_PACKET_v1",
      CONTRACT,
      RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,

      NORTH_FILE,
      NORTH_TARGET_CONTRACT,
      NORTH_PREVIOUS_CONTRACT,
      NORTH_AUTHORITY_OBSERVED: state.northAuthorityObserved,
      NORTH_AUTHORITY_SOURCE: state.northAuthoritySource,
      NORTH_OBSERVED_CONTRACT: state.northObservedContract,
      NORTH_BRIDGE_STATUS: state.northBridgeStatus,

      WEST_FILE,
      WEST_RAIL_CONTRACT,
      WEST_STANDARD_CONTRACT,
      WEST_AUTHORITY_OBSERVED: state.westAuthorityObserved,
      WEST_AUTHORITY_SOURCE: state.westAuthoritySource,
      WEST_OBSERVED_CONTRACT: state.westObservedContract,
      WEST_OBSERVED_IMPLEMENTATION_CONTRACT: state.westObservedImplementationContract,
      WEST_STANDARD_ACCEPTED: state.westStandardAccepted,
      WEST_RENDERED_READ_STATUS: state.westRenderedReadStatus,
      WEST_CANVAS_EXPRESSION_PROOF_STATUS: state.westCanvasExpressionProofStatus,
      WEST_CANVAS_EXPRESSION_BOTTLENECK_CLASS: state.westCanvasExpressionBottleneckClass,
      WEST_RENDERED_PLANET_PROOF_READY: state.westRenderedPlanetProofReady,
      WEST_RENDERED_PLANET_PROOF_INSPECTED: state.westRenderedPlanetProofInspected,
      WEST_VISIBLE_PLANET_PROOF_READY: state.westVisiblePlanetProofReady,
      WEST_VISIBLE_PLANET_PROOF_SOURCE: state.westVisiblePlanetProofSource,
      WEST_FOUR_WAY_CANVAS_HANDOFF_STATUS: state.westFourWayCanvasHandoffStatus,
      WEST_BRIDGE_STATUS: state.westBridgeStatus,

      EAST_FILE,
      EAST_CURRENT_CONTRACT,
      EAST_TARGET_CONTRACT,
      EAST_AUTHORITY_OBSERVED: state.eastAuthorityObserved,
      EAST_AUTHORITY_SOURCE: state.eastAuthoritySource,
      EAST_OBSERVED_CONTRACT: state.eastObservedContract,
      EAST_CONFORMITY_STATUS: state.eastConformityStatus,
      EAST_RECOMMENDED_NEXT_ACTION: state.eastRecommendedNextAction,
      EAST_BRIDGE_STATUS: state.eastBridgeStatus,

      SOUTH_FILE,
      SOUTH_CURRENT_CONTRACT,
      SOUTH_TARGET_CONTRACT,
      SOUTH_AUTHORITY_OBSERVED: state.southAuthorityObserved,
      SOUTH_AUTHORITY_SOURCE: state.southAuthoritySource,
      SOUTH_OBSERVED_CONTRACT: state.southObservedContract,
      SOUTH_CONFORMITY_STATUS: state.southConformityStatus,
      SOUTH_RECOMMENDED_NEXT_ACTION: state.southRecommendedNextAction,
      SOUTH_BRIDGE_STATUS: state.southBridgeStatus,

      HTML_CURRENT_CONTRACT,
      INDEX_CURRENT_CONTRACT,
      ROUTE_CURRENT_CONTRACT,
      ROUTE_ACCEPTED_LINEAGE,
      ROUTE_CONDUCTOR_FILE,
      INDEX_FILE,
      CANVAS_FILE,
      CONTROL_FILE,

      ROUTE_CONDUCTOR_OBSERVED: state.routeConductorObserved,
      ROUTE_CONDUCTOR_SOURCE: state.routeConductorSource,
      ROUTE_CONDUCTOR_CONTRACT: state.routeConductorContract,
      ROUTE_CONDUCTOR_LINEAGE_ACCEPTED: state.routeConductorLineageAccepted,

      CANVAS_OBSERVED: state.canvasObserved,
      CANVAS_SOURCE: state.canvasSource,
      CANVAS_CONTRACT: state.canvasContract,
      CANVAS_BRIDGE_STATUS: state.canvasBridgeStatus,

      CONTROL_OBSERVED: state.controlObserved,
      CONTROL_SOURCE: state.controlSource,
      CONTROL_CONTRACT: state.controlContract,
      CONTROL_STATUS: state.controlStatus,
      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      CONTROLS_BLOCK_VISIBLE_PLANET: state.controlsBlockVisiblePlanet,

      CONDUCTOR_BRIDGE_MODE: state.conductorBridgeMode,
      CONDUCTOR_STATUS: state.conductorStatus,
      NEXT_OWNER: state.nextOwner,
      NEXT_FILE: state.nextFile,
      NEXT_ACTION: state.nextAction,

      NORTH_RAIL_SHOULD_REMAIN_CANONICAL_AUTHORITY:
        state.northRailShouldRemainCanonicalAuthority,
      CONDUCTOR_DOES_NOT_NEED_TO_BE_READ_BY_OTHER_FILES:
        state.conductorDoesNotNeedToBeReadByOtherFiles,
      WEST_IS_BRIDGE_STANDARD_FOR_NORTH_RENEWAL:
        state.westIsBridgeStandardForNorthRenewal,
      EAST_WILL_CONFORM_AFTER_NORTH: state.eastWillConformAfterNorth,
      SOUTH_WILL_CONFORM_AFTER_EAST: state.southWillConformAfterEast,

      NOTES: state.notes.join(" | ") || FALLBACK.NONE,

      ...NO_CLAIM_FIELDS,
      ...UPPER_NO_CLAIM_FIELDS,
      UPDATED_AT: state.updatedAt
    };
  }

  function composePacketText(packet) {
    return Object.keys(packet)
      .map((key) => {
        const value = packet[key];
        if (Array.isArray(value)) return `${key}=${value.join(" | ")}`;
        if (isObject(value)) return `${key}=${bounded(JSON.stringify(value), 12000)}`;
        return `${key}=${bounded(value)}`;
      })
      .join("\n");
  }

  function inspect() {
    const state = makeState();

    state.status = STATUS.RUNNING;
    state.updatedAt = nowIso();

    addNote(state, "CONDUCTOR_READ_ONLY_INSPECTION_STARTED");
    addNote(state, "WEST_STANDARD_ANCHORS_NORTH_RENEWAL");
    addNote(state, "EAST_AND_SOUTH_ARE_EXPECTED_TO_CONFORM_AFTER_NORTH");

    readNorth(state);
    readWest(state);
    readEast(state);
    readSouth(state);
    readRouteConductor(state);
    readCanvas(state);
    readControls(state);
    resolveConductorStatus(state);

    state.updatedAt = nowIso();
    publish(state);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      status: state.status,
      conductorStatus: state.conductorStatus,
      nextOwner: state.nextOwner,
      nextFile: state.nextFile,
      nextAction: state.nextAction,
      packet: clonePlain(lastPacket),
      packetText: composePacketText(lastPacket),
      state: clonePlain(lastState)
    };
  }

  function getPacket() {
    if (!lastPacket) publish(makeState());
    return clonePlain(lastPacket);
  }

  function getPacketText() {
    return composePacketText(getPacket());
  }

  function getState() {
    if (!lastState) publish(makeState());
    return clonePlain(lastState);
  }

  function getReceiptLight() {
    const state = lastState || makeState();

    return {
      conductorRole: "NORTH_CANVAS_EXPRESSION_WEST_BRIDGE_CONDUCTOR",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      northFile: NORTH_FILE,
      northTargetContract: NORTH_TARGET_CONTRACT,
      northPreviousContract: NORTH_PREVIOUS_CONTRACT,
      westFile: WEST_FILE,
      westRailContract: WEST_RAIL_CONTRACT,
      westStandardContract: WEST_STANDARD_CONTRACT,
      eastFile: EAST_FILE,
      eastTargetContract: EAST_TARGET_CONTRACT,
      southFile: SOUTH_FILE,
      southTargetContract: SOUTH_TARGET_CONTRACT,

      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      indexFile: INDEX_FILE,
      canvasFile: CANVAS_FILE,
      controlFile: CONTROL_FILE,

      conductorBridgeMode: state.conductorBridgeMode,
      conductorStatus: state.conductorStatus,
      lastStatus: state.status,

      westStandardAccepted: state.westStandardAccepted,
      westBridgeStatus: state.westBridgeStatus,
      northBridgeStatus: state.northBridgeStatus,
      eastBridgeStatus: state.eastBridgeStatus,
      southBridgeStatus: state.southBridgeStatus,

      nextOwner: state.nextOwner,
      nextFile: state.nextFile,
      nextAction: state.nextAction,

      inspectApiAvailable: true,
      getPacketApiAvailable: true,
      getPacketTextApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      northRailShouldRemainCanonicalAuthority: true,
      conductorDoesNotNeedToBeReadByOtherFiles: true,
      westIsBridgeStandardForNorthRenewal: true,
      eastWillConformAfterNorth: true,
      southWillConformAfterEast: true,

      northCanonicalVerdictAuthority: false,
      westRenderedTargetProbeAuthority: false,
      eastServedSourceParsingAuthority: false,
      southPacketFormattingAuthority: false,
      diagnosticUiAuthority: false,
      hearthRepairAuthorized: false,
      productionMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      controlImplementationAuthority: false,
      routeConductorImplementationAuthority: false,
      terrainMaterialHydrologyAuthority: false,
      motionTouchExecutionAuthority: false,

      ...NO_CLAIM_FIELDS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    if (!lastReceipt) {
      publish(lastState || makeState());
    }

    return clonePlain(lastReceipt);
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastPacket = makePacket(state);
    lastReceipt = {
      ...getReceiptLight(),
      packet: clonePlain(lastPacket),
      packetTextAvailable: true
    };

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticNorthConductor = api;
    root.HEARTH.diagnosticNorthCanvasExpressionWestBridgeConductor = api;
    root.HEARTH.diagnosticNorthConductorReceipt = clonePlain(lastReceipt);
    root.HEARTH.diagnosticNorthConductorPacket = clonePlain(lastPacket);

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthDiagnosticNorthConductor = api;
    root.DEXTER_LAB.hearthDiagnosticNorthCanvasExpressionWestBridgeConductor = api;

    root.HEARTH_DIAGNOSTIC_NORTH_CONDUCTOR = api;
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_EXPRESSION_WEST_BRIDGE_CONDUCTOR = api;
    root.HEARTH_DIAGNOSTIC_NORTH_CONDUCTOR_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_NORTH_CONDUCTOR_PACKET = clonePlain(lastPacket);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    northFile: NORTH_FILE,
    northTargetContract: NORTH_TARGET_CONTRACT,
    northPreviousContract: NORTH_PREVIOUS_CONTRACT,

    eastFile: EAST_FILE,
    eastTargetContract: EAST_TARGET_CONTRACT,
    eastCurrentContract: EAST_CURRENT_CONTRACT,

    westFile: WEST_FILE,
    westRailContract: WEST_RAIL_CONTRACT,
    westStandardContract: WEST_STANDARD_CONTRACT,

    southFile: SOUTH_FILE,
    southTargetContract: SOUTH_TARGET_CONTRACT,
    southCurrentContract: SOUTH_CURRENT_CONTRACT,

    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    canvasFile: CANVAS_FILE,
    controlFile: CONTROL_FILE,

    htmlCurrentContract: HTML_CURRENT_CONTRACT,
    indexCurrentContract: INDEX_CURRENT_CONTRACT,
    routeCurrentContract: ROUTE_CURRENT_CONTRACT,
    routeAcceptedLineage: ROUTE_ACCEPTED_LINEAGE.slice(),

    inspect,
    run: inspect,
    boot: inspect,
    init: inspect,
    start: inspect,

    getPacket,
    getPacketText,
    getState,
    getReceipt,
    getReceiptLight,

    conductorDoesNotNeedToBeReadByOtherFiles: true,
    northRailShouldRemainCanonicalAuthority: true,
    westIsBridgeStandardForNorthRenewal: true,
    eastWillConformAfterNorth: true,
    southWillConformAfterEast: true,

    northCanonicalVerdictAuthority: false,
    westRenderedTargetProbeAuthority: false,
    eastServedSourceParsingAuthority: false,
    southPacketFormattingAuthority: false,
    diagnosticUiAuthority: false,
    hearthRepairAuthorized: false,
    productionMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    controlImplementationAuthority: false,
    routeConductorImplementationAuthority: false,
    terrainMaterialHydrologyAuthority: false,
    motionTouchExecutionAuthority: false,

    ...NO_CLAIM_FIELDS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
