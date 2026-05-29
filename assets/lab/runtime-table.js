// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_CARDINAL_NORTH_PRECEDENT_FACADE_TNT_v1
// Full-file replacement.
// North file first.
// Canonical Dexter Lab equipment.
// Runtime Table + Triple G Diagnostic + Visual Carrier Plan + Loading Optimization + Cardinal Checkpoint Governor facade.
// Purpose:
// - Preserve /assets/lab/runtime-table.js as the public North authority.
// - Keep Hearth and future routes consuming North only.
// - Add cardinal split readiness without requiring East/West/South files to exist yet.
// - Provide internal East/West/South fallbacks until branch files are created.
// - Stop over-blocking: assess gaps quickly, block only structural/false-completion failures, allow degraded-forward progress when safe.
// Does not own:
// - planet truth
// - child channel truth
// - canvas drawing
// - atlas pixel painting
// - touch/drag controls
// - route orchestration
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_NORTH_PRECEDENT_FACADE_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_NORTH_PRECEDENT_FACADE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_NEWS_FIBONACCI_CHRONOLOGICAL_CHECKPOINT_GOVERNOR_TNT_v1";
  const BASELINE_CONTRACT = "RUNTIME_TABLE_NEWS_CARDINAL_FOUR_FILE_SPLIT_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-29.lab-runtime-table-cardinal-north-precedent-facade-v1";

  const root = typeof window !== "undefined" ? window : globalThis;

  const BRANCH_PATHS = Object.freeze({
    east: "/assets/lab/runtime-table.east.js",
    west: "/assets/lab/runtime-table.west.js",
    south: "/assets/lab/runtime-table.south.js"
  });

  const STATUS = Object.freeze({
    PENDING: "PENDING",
    READY: "READY",
    OPTIMIZED: "OPTIMIZED",
    DEGRADED: "DEGRADED",
    FALLBACK: "FALLBACK",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING",
    HELD: "HELD"
  });

  const HANDOFF = Object.freeze({
    FULL_PASS: "FULL_PASS",
    OPTIMIZED_PASS: "OPTIMIZED_PASS",
    DEGRADED_PASS: "DEGRADED_PASS",
    FALLBACK_PASS: "FALLBACK_PASS",
    HELD_PASS: "HELD_PASS",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING"
  });

  const COHERENCE_STATUS = Object.freeze({
    PASS: "PASS",
    WARNING: "WARNING",
    HELD_PENDING_WIDE_PROBE: "HELD_PENDING_WIDE_PROBE",
    DEGRADED: "DEGRADED",
    FAIL: "FAIL",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING"
  });

  const CHECKPOINT_EVENT_ACTIONS = Object.freeze({
    ADMIT: "ADMIT",
    QUEUE: "QUEUE",
    ARCHIVE: "ARCHIVE",
    BLOCK: "BLOCK",
    DEGRADED_FORWARD: "DEGRADED_FORWARD"
  });

  const CHECKPOINT_STATUS = Object.freeze({
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    COMPLETE: "COMPLETE",
    DEGRADED_COMPLETE: "DEGRADED_COMPLETE",
    BLOCKED: "BLOCKED",
    QUEUED: "QUEUED",
    ARCHIVED: "ARCHIVED",
    FAILED: "FAILED",
    HELD: "HELD"
  });

  const GAP_CLASS = Object.freeze({
    NONE: "NONE",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK",
    FALSE_COMPLETION_BLOCK: "FALSE_COMPLETION_BLOCK",
    DIAGNOSTIC_BLOCK: "DIAGNOSTIC_BLOCK",
    DEGRADED_GAP: "DEGRADED_GAP",
    HELD_GAP: "HELD_GAP",
    PROGRESS_ONLY: "PROGRESS_ONLY",
    DUPLICATE_ARCHIVE: "DUPLICATE_ARCHIVE"
  });

  const COHERENCE_CHECKS = Object.freeze({
    VISUAL_CARRIER_ELIGIBILITY_CHECK: "VISUAL_CARRIER_ELIGIBILITY_CHECK",
    RECEIPT_VERIFICATION_CHECK: "RECEIPT_VERIFICATION_CHECK",
    COORDINATE_BODY_CHECK: "COORDINATE_BODY_CHECK",
    LAND_BODY_BINDING_CHECK: "LAND_BODY_BINDING_CHECK",
    WATER_SURFACE_SEATING_CHECK: "WATER_SURFACE_SEATING_CHECK",
    AIR_AUTHORITY_CHECK: "AIR_AUTHORITY_CHECK",
    CHANNEL_SEPARATION_CHECK: "CHANNEL_SEPARATION_CHECK",
    PROJECTION_SEATING_CHECK: "PROJECTION_SEATING_CHECK",
    CONTRAST_VISIBILITY_CHECK: "CONTRAST_VISIBILITY_CHECK",
    DISTRIBUTION_SHAPE_CHECK: "DISTRIBUTION_SHAPE_CHECK",
    WIDE_PROBE_READINESS_CHECK: "WIDE_PROBE_READINESS_CHECK",
    LOADING_OPTIMIZATION_CHECK: "LOADING_OPTIMIZATION_CHECK",
    ATLAS_START_AUTHORIZATION_CHECK: "ATLAS_START_AUTHORIZATION_CHECK",
    COHERENT_EXPRESSION_CHECK: "COHERENT_EXPRESSION_CHECK"
  });

  const R_COORDINATES = Object.freeze({
    R0_RUNTIME_TABLE_NOT_LOADED: "R0_RUNTIME_TABLE_NOT_LOADED",
    R1_RUNTIME_TABLE_LOADED_NO_PLAN: "R1_RUNTIME_TABLE_LOADED_NO_PLAN",
    R2_PLAN_GENERATED_INVALID: "R2_PLAN_GENERATED_INVALID",
    R3_PLAN_VALID_HANDOFF_READY: "R3_PLAN_VALID_HANDOFF_READY"
  });

  const V_COORDINATES = Object.freeze({
    V0_VISUAL_CARRIER_NOT_MOUNTED: "V0_VISUAL_CARRIER_NOT_MOUNTED",
    V1_FALLBACK_SHELL_MOUNTED: "V1_FALLBACK_SHELL_MOUNTED",
    V2_DIAGNOSTIC_CARRIER_VISIBLE: "V2_DIAGNOSTIC_CARRIER_VISIBLE",
    V3_ATLAS_CARRIER_VISIBLE: "V3_ATLAS_CARRIER_VISIBLE",
    V4_COHERENT_VISUAL_CARRIER_ELIGIBLE: "V4_COHERENT_VISUAL_CARRIER_ELIGIBLE"
  });

  const A_COORDINATES = Object.freeze({
    A0_ATLAS_SEQUENCE_NOT_STARTED: "A0_ATLAS_SEQUENCE_NOT_STARTED",
    A1_ATLAS_START_AUTHORIZED: "A1_ATLAS_START_AUTHORIZED",
    A2_ATLAS_BUILDER_ENTERED: "A2_ATLAS_BUILDER_ENTERED",
    A3_ATLAS_PROGRESS_OBSERVED: "A3_ATLAS_PROGRESS_OBSERVED",
    A4_ATLAS_COMPLETED: "A4_ATLAS_COMPLETED",
    A5_ATLAS_PROJECTED_TO_SPHERE: "A5_ATLAS_PROJECTED_TO_SPHERE"
  });

  const C_COORDINATES = Object.freeze({
    C0_CHILD_CONNECTOR_NOT_STARTED: "C0_CHILD_CONNECTOR_NOT_STARTED",
    C1_CHILD_REQUEST_PREPARED: "C1_CHILD_REQUEST_PREPARED",
    C2_SCRIPT_ELEMENT_CREATED: "C2_SCRIPT_ELEMENT_CREATED",
    C3_SCRIPT_APPENDED: "C3_SCRIPT_APPENDED",
    C4_SCRIPT_NETWORK_LOAD_FAILURE: "C4_SCRIPT_NETWORK_LOAD_FAILURE",
    C5_SCRIPT_LOAD_TIMEOUT: "C5_SCRIPT_LOAD_TIMEOUT",
    C6_GLOBAL_ACTOR_MISSING: "C6_GLOBAL_ACTOR_MISSING",
    C7_CONTRACT_MISMATCH: "C7_CONTRACT_MISMATCH",
    C8_SAMPLE_API_FAILURE: "C8_SAMPLE_API_FAILURE",
    C9_COORDINATE_PACKET_FAILURE: "C9_COORDINATE_PACKET_FAILURE",
    C10_AUTHORITY_FLAG_FAILURE: "C10_AUTHORITY_FLAG_FAILURE",
    C11_CHILD_VALIDATED: "C11_CHILD_VALIDATED"
  });

  const L_COORDINATES = Object.freeze({
    L0_LOADING_NOT_STARTED: "L0_LOADING_NOT_STARTED",
    L1_VISIBLE_CARRIER_FIRST: "L1_VISIBLE_CARRIER_FIRST",
    L2_CHILD_CONTRACT_VALIDATION: "L2_CHILD_CONTRACT_VALIDATION",
    L3_ANCHOR_SAMPLE_LOCAL_PROOF: "L3_ANCHOR_SAMPLE_LOCAL_PROOF",
    L4_ATLAS_OR_CACHE_RENDER: "L4_ATLAS_OR_CACHE_RENDER",
    L5_WIDE_PROBE_IDLE_CHUNKS: "L5_WIDE_PROBE_IDLE_CHUNKS",
    L6_OPTIMIZED_STABLE: "L6_OPTIMIZED_STABLE"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    F21: "F21"
  });

  const DEFAULT_SAMPLE_POINT = Object.freeze({
    u: 0.5,
    v: 0.5,
    lon: 0,
    lat: 0,
    x: 0,
    y: 0,
    z: 1
  });

  const DEFAULT_COORDINATES = Object.freeze(["u", "v", "x", "y", "z"]);

  const UNIVERSAL_CHANNEL_KEYS = Object.freeze([
    "land",
    "water",
    "air",
    "elevation",
    "hydrology",
    "composition",
    "materials",
    "climate",
    "terrain",
    "atmosphere",
    "state",
    "city",
    "summit"
  ]);

  const HEARTH_CONTRACTS = Object.freeze({
    runtimeTable: CONTRACT,
    previousRuntimeTable: PREVIOUS_CONTRACT,
    baselineRuntimeTable: BASELINE_CONTRACT,
    canvas: "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1",
    previousCanvas: "HEARTH_CANVAS_ATLAS_START_SEQUENCING_HARDENING_TNT_v1",
    land: "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1",
    water: "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
    air: "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1"
  });

  const PROGRESS_ONLY_EVENTS = Object.freeze([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS",
    "WIDE_PROBE_PROGRESS",
    "RECONCILE_PROGRESS"
  ]);

  const FIBONACCI_CHECKPOINTS = Object.freeze([
    {
      id: "F1A_HTML_SHELL_RENDERED",
      event: "HTML_SHELL_RENDERED",
      rank: 1,
      fibonacci: "F1A",
      value: 1,
      lane: "shell",
      progress: 6,
      label: "HTML shell rendered"
    },
    {
      id: "F1B_LOAD_LEDGER_INITIALIZED",
      event: "LOAD_LEDGER_INITIALIZED",
      aliases: ["HEARTH_LOAD_LEDGER_MONOTONIC_INITIALIZED", "NEWS_FIBONACCI_LEDGER_GUARD_ACTIVE"],
      rank: 2,
      fibonacci: "F1B",
      value: 1,
      lane: "ledger",
      progress: 12,
      label: "Load ledger initialized"
    },
    {
      id: "F2_FIRST_PAINT_COCKPIT_VISIBLE",
      event: "FIRST_PAINT_COCKPIT_VISIBLE",
      rank: 3,
      fibonacci: "F2",
      value: 2,
      lane: "staticCockpit",
      progress: 22,
      label: "First-paint cockpit visible"
    },
    {
      id: "F3_SCRIPT_ORDER_COMPLETE",
      event: "SCRIPT_ORDER_COMPLETE",
      aliases: ["SCRIPT_LOADED", "SCRIPT_ORDER_VISIBLE"],
      rank: 4,
      fibonacci: "F3",
      value: 3,
      lane: "scriptOrder",
      progress: 36,
      label: "Script order complete"
    },
    {
      id: "F5_AUTHORITY_AVAILABILITY_READY",
      event: "AUTHORITY_AVAILABILITY_READY",
      aliases: ["RUNTIME_TABLE_AVAILABLE", "AUTHORITY_AVAILABLE"],
      rank: 5,
      fibonacci: "F5",
      value: 5,
      lane: "authorityAvailability",
      progress: 55,
      label: "Authority availability ready"
    },
    {
      id: "F8_CONDUCTOR_HYDRATED",
      event: "CONDUCTOR_HYDRATED",
      aliases: ["CONDUCTOR_HYDRATED_EXISTING_COCKPIT", "COHERENCE_SEMICONDUCTOR_BOOTED"],
      rank: 6,
      fibonacci: "F8",
      value: 8,
      lane: "conductorHydration",
      progress: 72,
      label: "Conductor hydrated"
    },
    {
      id: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
      event: "CANVAS_COOPERATIVE_BOOT_STARTED",
      rank: 7,
      fibonacci: "F13A",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 78,
      label: "Canvas cooperative boot started"
    },
    {
      id: "F13B_CANVAS_MOUNT_CREATED",
      event: "CANVAS_MOUNT_CREATED",
      rank: 8,
      fibonacci: "F13B",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 81,
      label: "Canvas mount created"
    },
    {
      id: "F13C_CANVAS_CONTEXT_READY",
      event: "CANVAS_CONTEXT_READY",
      rank: 9,
      fibonacci: "F13C",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 84,
      label: "Canvas context ready"
    },
    {
      id: "F13D_DRAG_INSPECTION_BOUND",
      event: "DRAG_INSPECTION_BOUND",
      rank: 10,
      fibonacci: "F13D",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 86,
      label: "Drag inspection bound"
    },
    {
      id: "F13E_ATLAS_BUILD_STARTED",
      event: "ATLAS_BUILD_STARTED",
      rank: 11,
      fibonacci: "F13E",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 88,
      label: "Atlas build started"
    },
    {
      id: "F13F_ATLAS_BUILD_COMPLETE",
      event: "ATLAS_BUILD_COMPLETE",
      rank: 12,
      fibonacci: "F13F",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 91,
      label: "Atlas build complete"
    },
    {
      id: "F13G_TEXTURE_COMPOSE_STARTED",
      event: "TEXTURE_COMPOSE_STARTED",
      rank: 13,
      fibonacci: "F13G",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 93,
      label: "Texture compose started"
    },
    {
      id: "F13H_TEXTURE_COMPOSE_COMPLETE",
      event: "TEXTURE_COMPOSE_COMPLETE",
      rank: 14,
      fibonacci: "F13H",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 96,
      label: "Texture compose complete"
    },
    {
      id: "F13I_FIRST_FRAME_REQUESTED",
      event: "FIRST_FRAME_REQUESTED",
      rank: 15,
      fibonacci: "F13I",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 97,
      label: "First frame requested"
    },
    {
      id: "F13J_FIRST_FRAME_DETECTED",
      event: "FIRST_FRAME_DETECTED",
      rank: 16,
      fibonacci: "F13J",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 98,
      label: "First frame detected"
    },
    {
      id: "F13K_CANVAS_READY",
      event: "CANVAS_READY",
      rank: 17,
      fibonacci: "F13K",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 98,
      label: "Canvas ready"
    },
    {
      id: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
      event: "VISIBLE_CONTENT_PROOF_STARTED",
      rank: 18,
      fibonacci: "F13L",
      value: 13,
      lane: "visiblePlanetProof",
      progress: 98,
      label: "Visible content proof started"
    },
    {
      id: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      event: "VISIBLE_CONTENT_PROOF_PASSED",
      aliases: ["DEGRADED_VISIBLE_CONTENT_ACCEPTED"],
      rank: 19,
      fibonacci: "F13M",
      value: 13,
      lane: "visiblePlanetProof",
      progress: 98,
      label: "Visible content proof passed or degraded-forward accepted"
    },
    {
      id: "F13N_INSPECT_MODE_READY",
      event: "INSPECT_MODE_READY",
      aliases: ["DEGRADED_INSPECT_MODE_ACCEPTED"],
      rank: 20,
      fibonacci: "F13N",
      value: 13,
      lane: "inspectMode",
      progress: 98,
      label: "Inspect mode ready or degraded-forward accepted"
    },
    {
      id: "F21_COMPLETION_LATCHED",
      event: "COMPLETION_LATCHED",
      aliases: ["COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF", "COMPLETION_LATCHED_AFTER_CANVAS_READY", "F21_DEGRADED_COMPLETION_LATCHED"],
      rank: 21,
      fibonacci: "F21",
      value: 21,
      lane: "completionLatch",
      progress: 100,
      label: "Completion latched"
    }
  ]);

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null) return [];
    return [value];
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function mergePlain(base, overrides) {
    const output = { ...(base || {}) };

    Object.keys(overrides || {}).forEach((key) => {
      if (
        isObject(output[key]) &&
        isObject(overrides[key]) &&
        !Array.isArray(output[key]) &&
        !Array.isArray(overrides[key])
      ) {
        output[key] = mergePlain(output[key], overrides[key]);
      } else {
        output[key] = overrides[key];
      }
    });

    return output;
  }

  function safeCall(fn, fallback = null) {
    try {
      return fn();
    } catch (error) {
      return {
        __runtimeTableError: true,
        message: error && error.message ? error.message : String(error),
        fallback
      };
    }
  }

  function createIssue(code, message, severity = STATUS.DEGRADED, detail = {}) {
    return {
      code,
      message,
      severity,
      detail: clonePlain(detail),
      at: nowIso()
    };
  }

  function getGlobalByName(name) {
    if (!name || typeof name !== "string") return null;
    return root[name] || null;
  }

  function resolveAuthority(registration) {
    if (!registration) return null;

    if (registration.authority && isObject(registration.authority)) {
      return registration.authority;
    }

    if (registration.globalName) {
      const direct = getGlobalByName(registration.globalName);
      if (direct) return direct;
    }

    if (isFunction(registration.resolve)) {
      const resolved = safeCall(() => registration.resolve(), null);
      if (resolved && !resolved.__runtimeTableError) return resolved;
    }

    return null;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      const receipt = safeCall(() => authority.getReceipt(), null);
      if (receipt && !receipt.__runtimeTableError && isObject(receipt)) return receipt;
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;

    return null;
  }

  function hasAnyMethod(authority, methods) {
    return asArray(methods).some((name) => isFunction(authority && authority[name]));
  }

  function sampleAuthority(authority, samplePoint, methods) {
    const methodList = asArray(methods).length ? asArray(methods) : ["sample", "read"];

    for (const method of methodList) {
      if (!isFunction(authority && authority[method])) continue;

      const result = safeCall(() => authority[method](samplePoint), null);

      if (result && !result.__runtimeTableError && isObject(result)) {
        return {
          ok: true,
          method,
          sample: result
        };
      }

      if (result && result.__runtimeTableError) {
        return {
          ok: false,
          method,
          error: result.message
        };
      }
    }

    return {
      ok: false,
      method: "",
      error: "No callable sample/read method returned an object packet."
    };
  }

  function coordinateCheck(packet, requiredCoordinates) {
    const required = asArray(requiredCoordinates).length ? asArray(requiredCoordinates) : DEFAULT_COORDINATES.slice();
    const missing = [];

    required.forEach((key) => {
      if (!Number.isFinite(Number(packet && packet[key]))) missing.push(key);
    });

    return {
      ok: missing.length === 0,
      missing,
      required
    };
  }

  function contractCheck(authority, receipt, expectedContract) {
    if (!expectedContract) {
      return {
        ok: true,
        expected: "",
        actual: authority && authority.contract ? authority.contract : receipt && receipt.contract ? receipt.contract : ""
      };
    }

    const actual =
      (authority && typeof authority.contract === "string" && authority.contract) ||
      (receipt && typeof receipt.contract === "string" && receipt.contract) ||
      "";

    return {
      ok: actual === expectedContract,
      expected: expectedContract,
      actual
    };
  }

  function lawCheck(sample, laws) {
    const issues = [];

    asArray(laws).forEach((law) => {
      if (!law) return;

      if (typeof law === "function") {
        const result = safeCall(() => law(sample), true);

        if (result === false) {
          issues.push(createIssue(
            "LAW_FUNCTION_FALSE",
            "A supplied law predicate returned false.",
            STATUS.REJECTED
          ));
        } else if (result && result.__runtimeTableError) {
          issues.push(createIssue(
            "LAW_FUNCTION_ERROR",
            `A supplied law predicate threw: ${result.message}`,
            STATUS.REJECTED
          ));
        }

        return;
      }

      if (!isObject(law)) return;

      const field = law.field;
      const expected = law.expected;
      const severity = law.severity || STATUS.REJECTED;
      const code = law.code || `LAW_${String(field || "UNKNOWN").toUpperCase()}`;

      if (!field) return;

      const actual = sample ? sample[field] : undefined;

      if (actual !== expected) {
        issues.push(createIssue(
          code,
          law.message || `Law mismatch: ${field} expected ${String(expected)} but received ${String(actual)}.`,
          severity,
          { field, expected, actual }
        ));
      }
    });

    return {
      ok: issues.length === 0,
      issues
    };
  }

  function decideStatus(issues, sampleResult, options = {}) {
    if (!sampleResult.ok) return options.sampleFailureBlocking === true ? STATUS.BLOCKING : STATUS.FALLBACK;

    const severities = issues.map((issue) => issue.severity);

    if (severities.includes(STATUS.BLOCKING)) return STATUS.BLOCKING;
    if (severities.includes(STATUS.REJECTED)) return STATUS.REJECTED;
    if (severities.includes(STATUS.FALLBACK)) return STATUS.FALLBACK;
    if (severities.includes(STATUS.DEGRADED)) return STATUS.DEGRADED;
    if (severities.includes(STATUS.OPTIMIZED)) return STATUS.OPTIMIZED;
    if (severities.includes(STATUS.HELD)) return STATUS.HELD;

    return STATUS.READY;
  }

  function normalizeBudget(input = {}) {
    const raw = isObject(input) ? input : {};

    return {
      sampleRate: clamp(raw.sampleRate ?? 1, 0.05, 1),
      atlasWidth: clamp(raw.atlasWidth ?? 384, 32, 2048),
      atlasHeight: clamp(raw.atlasHeight ?? 192, 16, 1024),
      rowsPerChunk: clamp(raw.rowsPerChunk ?? 2, 1, 16),
      probeRowsPerChunk: clamp(raw.probeRowsPerChunk ?? 2, 1, 12),
      wideProbeMinPoints: clamp(raw.wideProbeMinPoints ?? 25, 1, 4096),
      priority: clamp(raw.priority ?? 1, 0, 10),
      canDegrade: raw.canDegrade !== false,
      canFallback: raw.canFallback !== false,
      visibleCarrierFirst: raw.visibleCarrierFirst !== false,
      deferWideProbe: raw.deferWideProbe !== false
    };
  }

  function optimizeBudget(status, budget) {
    const next = { ...budget };

    if (status === STATUS.READY) {
      return {
        status,
        budget: next,
        reason: "No optimization required."
      };
    }

    if (
      status === STATUS.OPTIMIZED ||
      status === STATUS.DEGRADED ||
      status === STATUS.FALLBACK ||
      status === STATUS.HELD
    ) {
      next.sampleRate = clamp(next.sampleRate * 0.72, 0.05, 1);
      next.atlasWidth = Math.max(32, Math.round(next.atlasWidth * 0.75));
      next.atlasHeight = Math.max(16, Math.round(next.atlasHeight * 0.75));
      next.rowsPerChunk = Math.max(1, Math.min(8, Math.round(next.rowsPerChunk)));
      next.probeRowsPerChunk = Math.max(1, Math.min(6, Math.round(next.probeRowsPerChunk)));

      return {
        status: status === STATUS.FALLBACK ? STATUS.FALLBACK : status === STATUS.HELD ? STATUS.HELD : STATUS.OPTIMIZED,
        budget: next,
        reason: status === STATUS.HELD
          ? "Wide-probe held; first visible render remains allowed."
          : "Budget reduced to preserve runtime handoff."
      };
    }

    return {
      status,
      budget: next,
      reason: "No safe optimization available."
    };
  }

  function resolveHandoff(childRecords) {
    const statuses = childRecords.map((record) => record.status);

    if (statuses.includes(STATUS.BLOCKING)) return HANDOFF.BLOCKING;
    if (statuses.includes(STATUS.REJECTED)) return HANDOFF.REJECTED;
    if (statuses.includes(STATUS.FALLBACK)) return HANDOFF.FALLBACK_PASS;
    if (statuses.includes(STATUS.DEGRADED)) return HANDOFF.DEGRADED_PASS;
    if (statuses.includes(STATUS.OPTIMIZED)) return HANDOFF.OPTIMIZED_PASS;
    if (statuses.includes(STATUS.HELD)) return HANDOFF.HELD_PASS;

    return HANDOFF.FULL_PASS;
  }

  function handoffAllowsRuntime(handoff) {
    return (
      handoff === HANDOFF.FULL_PASS ||
      handoff === HANDOFF.OPTIMIZED_PASS ||
      handoff === HANDOFF.DEGRADED_PASS ||
      handoff === HANDOFF.FALLBACK_PASS ||
      handoff === HANDOFF.HELD_PASS
    );
  }

  function extractContract(packet) {
    if (!packet || !isObject(packet)) return "";
    return packet.contract || packet.CONTRACT || packet.runtimeTableContract || "";
  }

  function extractRgb(packet, fallback = [0, 0, 0]) {
    const keys = ["rgb", "color", "landRgb", "waterRgb", "oceanRgb", "airRgb", "atmosphereRgb", "finalColorHint", "baseColor"];

    for (const key of keys) {
      const value = packet && packet[key];

      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((item) => Number.isFinite(Number(item)))
      ) {
        return [
          clamp(Math.round(Number(value[0])), 0, 255),
          clamp(Math.round(Number(value[1])), 0, 255),
          clamp(Math.round(Number(value[2])), 0, 255)
        ];
      }
    }

    return fallback.slice();
  }

  function luminance(rgb) {
    const color = extractRgb({ rgb }, [0, 0, 0]);
    return 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
  }

  function statusScore(status) {
    switch (status) {
      case COHERENCE_STATUS.PASS: return 1;
      case COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE: return 0.96;
      case COHERENCE_STATUS.WARNING: return 0.78;
      case COHERENCE_STATUS.DEGRADED: return 0.62;
      case COHERENCE_STATUS.FAIL: return 0.35;
      case COHERENCE_STATUS.REJECTED: return 0.10;
      case COHERENCE_STATUS.BLOCKING: return 0;
      default: return 0.35;
    }
  }

  function makeCheckpointReceipt(config) {
    return {
      id: config.id,
      name: config.name || config.id,
      goal: config.goal || "",
      observed: config.observed || "",
      math: config.math || "",
      tolerance: clonePlain(config.tolerance || {}),
      value: clonePlain(config.value || {}),
      status: config.status || COHERENCE_STATUS.FAIL,
      passed: config.status === COHERENCE_STATUS.PASS || config.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
      held: config.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
      nonBlocking: config.nonBlocking === true || config.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
      probableCause: asArray(config.probableCause),
      renewalTarget: asArray(config.renewalTarget),
      nextStrategy: asArray(config.nextStrategy),
      detail: clonePlain(config.detail || {}),
      at: nowIso()
    };
  }

  function normalizeEventSnapshot(event = {}) {
    const detail = isObject(event.detail) ? event.detail : {};
    const snapshot = isObject(event.snapshot) ? event.snapshot : {};

    return {
      ...snapshot,
      ...detail,
      ...event
    };
  }

  function proofFromSnapshot(snapshot, key, fallback = false) {
    return safeBool(snapshot && snapshot[key], fallback);
  }

  function numericFromSnapshot(snapshot, key, fallback = 0) {
    return safeNumber(snapshot && snapshot[key], fallback);
  }

  function hasVisibleSurfaceSignal(snapshot = {}) {
    const classCount = numericFromSnapshot(snapshot, "visibleContentClassCount", 0);
    const land = numericFromSnapshot(snapshot, "visibleContentLandSampleCount", 0);
    const water = numericFromSnapshot(snapshot, "visibleContentWaterSampleCount", 0);
    const other = numericFromSnapshot(snapshot, "visibleContentOtherSampleCount", 0);
    const nonblank = proofFromSnapshot(snapshot, "nonblankPlanetVisible", false);
    const imageRendered = proofFromSnapshot(snapshot, "imageRendered", false);
    const textureComplete = proofFromSnapshot(snapshot, "textureComposeComplete", false);
    const canvasReady = proofFromSnapshot(snapshot, "canvasReady", false);
    const firstFrame = proofFromSnapshot(snapshot, "firstFrameDetected", false);

    return Boolean(
      canvasReady &&
      firstFrame &&
      imageRendered &&
      textureComplete &&
      nonblank &&
      (classCount > 0 || land > 0 || water > 0 || other > 0)
    );
  }

  function hasInspectFallbackSignal(snapshot = {}) {
    return Boolean(
      proofFromSnapshot(snapshot, "copyDiagnosticPreserved", false) &&
      proofFromSnapshot(snapshot, "receiptToggleReady", false) &&
      proofFromSnapshot(snapshot, "diagnosticDockRestorable", false)
    );
  }

  function hasStructuralCarrier(snapshot = {}) {
    return Boolean(
      proofFromSnapshot(snapshot, "planetCanvasPresent", true) &&
      proofFromSnapshot(snapshot, "planetCanvasNonZeroSize", true) &&
      proofFromSnapshot(snapshot, "canvasCarrierMounted", true) &&
      proofFromSnapshot(snapshot, "canvasCarrierHandoffOk", true)
    );
  }

  function isProgressOnlyEventName(name = "") {
    return PROGRESS_ONLY_EVENTS.includes(String(name || ""));
  }

  function isFalseCompletionMutation(event = {}) {
    const text = JSON.stringify(event || {});
    return (
      text.includes('"visualPassClaimed":true') ||
      text.includes("visualPassClaimed=true") ||
      text.includes('"readyTextAllowed":true') ||
      text.includes('"mainDisplayProgress":100') ||
      text.includes('"progress":100') ||
      text.includes("READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE") ||
      text.includes("COMPLETION_LATCHED")
    );
  }

  function defaultExpectedContractsForPlanet(planetId = "") {
    if (planetId === "hearth") {
      return {
        runtimeTable: CONTRACT,
        previousRuntimeTable: PREVIOUS_CONTRACT,
        canvas: HEARTH_CONTRACTS.canvas,
        land: HEARTH_CONTRACTS.land,
        water: HEARTH_CONTRACTS.water,
        air: HEARTH_CONTRACTS.air
      };
    }

    return {
      runtimeTable: CONTRACT,
      previousRuntimeTable: PREVIOUS_CONTRACT
    };
  }

  function createPlanetGoalProfile(type = "universal-planet-channel-expression", overrides = {}) {
    const planetId = overrides.planetId || "";
    const expectedContracts = mergePlain(defaultExpectedContractsForPlanet(planetId), overrides.expectedContracts || {});

    const base = {
      id: type,
      label: overrides.label || "Universal planet channel coherent-expression goal profile",
      planetId,
      planetLabel: overrides.planetLabel || "",
      expectedContracts,
      channelKeys: asArray(overrides.channelKeys).length ? asArray(overrides.channelKeys) : UNIVERSAL_CHANNEL_KEYS.slice(),
      laws: {
        bodyChannelsCannotFloat: true,
        waterSurfaceSeated: true,
        airFloatingOnly: true,
        airMayDefineLand: false,
        airMayDefineWater: false,
        visualCarrierFailureOnlyBlocksWhenStructurallyUnsafe: true,
        childFailureDegradesButDoesNotAutomaticallyEraseVisualization: true,
        imageRenderedIsNotCoherencePass: true,
        runtimeTableLedgerMustAgreeWithFinalOutput: true,
        singleAnchorIsLocalProofOnly: true,
        wideProbeRequiredForGlobalDistribution: true,
        wideProbeNeverBlocksFirstVisibleRender: true,
        cardinalSplitActive: true,
        northPrecedent: true
      },
      tolerances: {
        vectorMagnitudeError: 0.015,
        uError: 0.025,
        vError: 0.025,
        coordinateError: 0.08,
        landAtmosphericLeak: 0.08,
        waterFloatingLeak: 0.08,
        minimumLandBodyScore: 0.08,
        minimumWaterSeatScore: 0.07,
        minimumChannelSeparation: 0.12,
        maximumDominantAirRisk: 0.18,
        minimumContrastDelta: 18,
        minimumCoherenceScore: 86,
        minimumVisibleLandAlpha: 0.20,
        minimumVisibleWaterAlpha: 0.20,
        maximumAirDominance: 0.52,
        minimumLandCoverageWhenExpected: 0.04,
        minimumWideProbePoints: 25
      },
      weights: {
        VISUAL_CARRIER_ELIGIBILITY_CHECK: 8,
        RECEIPT_VERIFICATION_CHECK: 12,
        COORDINATE_BODY_CHECK: 12,
        LAND_BODY_BINDING_CHECK: 10,
        WATER_SURFACE_SEATING_CHECK: 10,
        AIR_AUTHORITY_CHECK: 10,
        CHANNEL_SEPARATION_CHECK: 8,
        PROJECTION_SEATING_CHECK: 8,
        CONTRAST_VISIBILITY_CHECK: 6,
        DISTRIBUTION_SHAPE_CHECK: 4,
        WIDE_PROBE_READINESS_CHECK: 4,
        LOADING_OPTIMIZATION_CHECK: 8,
        ATLAS_START_AUTHORIZATION_CHECK: 14
      },
      criticalChecks: [
        COHERENCE_CHECKS.VISUAL_CARRIER_ELIGIBILITY_CHECK,
        COHERENCE_CHECKS.RECEIPT_VERIFICATION_CHECK,
        COHERENCE_CHECKS.COORDINATE_BODY_CHECK,
        COHERENCE_CHECKS.AIR_AUTHORITY_CHECK,
        COHERENCE_CHECKS.PROJECTION_SEATING_CHECK,
        COHERENCE_CHECKS.LOADING_OPTIMIZATION_CHECK,
        COHERENCE_CHECKS.ATLAS_START_AUTHORIZATION_CHECK
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    return mergePlain(base, overrides);
  }

  function createGoalProfile(type = "hearth-channel-expression", overrides = {}) {
    if (type === "hearth-channel-expression") {
      return createPlanetGoalProfile(type, mergePlain({
        planetId: "hearth",
        planetLabel: "Hearth",
        label: "Hearth channel coherent-expression goal profile",
        expectedContracts: {
          runtimeTable: CONTRACT,
          previousRuntimeTable: PREVIOUS_CONTRACT,
          canvas: HEARTH_CONTRACTS.canvas,
          land: HEARTH_CONTRACTS.land,
          water: HEARTH_CONTRACTS.water,
          air: HEARTH_CONTRACTS.air
        },
        channelKeys: ["land", "water", "air"]
      }, overrides));
    }

    return createPlanetGoalProfile(type, overrides);
  }

  function getRuntimeRecordsByKey(ledger) {
    const map = {};

    if (ledger && Array.isArray(ledger.records)) {
      ledger.records.forEach((record) => {
        if (record && record.key) map[record.key] = record;
      });
    }

    return map;
  }

  function normalizeDiagnosticInput(input = {}, options = {}) {
    const goalProfile = input.goalProfile || options.goalProfile || createGoalProfile(options.profile || "universal-planet-channel-expression");
    const canvasSample = input.canvasSample || {};
    const landSample = input.landSample || (canvasSample && canvasSample.land) || {};
    const waterSample = input.waterSample || (canvasSample && canvasSample.water) || {};
    const airSample = input.airSample || (canvasSample && canvasSample.air) || {};
    const runtimeTableLedger = input.runtimeTableLedger || input.ledger || null;
    const canvasReceipt = input.canvasReceipt || input.canvas || {};
    const renderMetadata = input.renderMetadata || input.render || {};
    const probeSamples = Array.isArray(input.probeSamples) ? input.probeSamples.slice() : [];
    const loadingPlan = input.loadingPlan || input.visualCarrierPlan || null;

    return {
      goalProfile,
      runtimeTableLedger,
      canvasReceipt,
      canvasSample,
      landSample,
      waterSample,
      airSample,
      channelSamples: clonePlain(input.channelSamples || {}),
      renderMetadata,
      probeSamples,
      loadingPlan,
      imageRendered: safeBool(input.imageRendered, safeBool(renderMetadata.imageRendered, safeBool(renderMetadata.atlasReady, false))),
      constructionReady: Boolean(runtimeTableLedger && runtimeTableLedger.runtimeAllowed),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function coordinateMetrics(sample, reference) {
    const x = safeNumber(sample && sample.x, NaN);
    const y = safeNumber(sample && sample.y, NaN);
    const z = safeNumber(sample && sample.z, NaN);

    const vectorMagnitude = Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)
      ? Math.sqrt(x * x + y * y + z * z)
      : NaN;

    const vectorMagnitudeError = Number.isFinite(vectorMagnitude) ? Math.abs(1 - vectorMagnitude) : Infinity;

    const lon = safeNumber(sample && (sample.lon ?? sample.longitude), NaN);
    const lat = safeNumber(sample && (sample.lat ?? sample.latitude), NaN);
    const u = safeNumber(sample && sample.u, NaN);
    const v = safeNumber(sample && sample.v, NaN);

    const expectedU = Number.isFinite(lon) ? ((lon + 180) / 360) : NaN;
    const expectedV = Number.isFinite(lat) ? ((90 - lat) / 180) : NaN;

    const uError = Number.isFinite(u) && Number.isFinite(expectedU) ? Math.abs(u - expectedU) : 0;
    const vError = Number.isFinite(v) && Number.isFinite(expectedV) ? Math.abs(v - expectedV) : 0;

    const rx = safeNumber(reference && reference.x, NaN);
    const ry = safeNumber(reference && reference.y, NaN);
    const rz = safeNumber(reference && reference.z, NaN);

    const coordinateError =
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      Number.isFinite(z) &&
      Number.isFinite(rx) &&
      Number.isFinite(ry) &&
      Number.isFinite(rz)
        ? Math.sqrt((x - rx) ** 2 + (y - ry) ** 2 + (z - rz) ** 2)
        : 0;

    return {
      vectorMagnitude,
      vectorMagnitudeError,
      uError,
      vError,
      coordinateError
    };
  }

  function receiptVerificationCheck(ctx) {
    const ledger = ctx.runtimeTableLedger;
    const canvasReceipt = ctx.canvasReceipt || {};
    const checks = {
      runtimeTableLedgerPresent: Boolean(ledger),
      runtimeTableHandoffPresent: Boolean(ledger && ledger.handoff),
      canvasReceiptPresent: Boolean(canvasReceipt && Object.keys(canvasReceipt).length),
      canvasVisualPassNotClaimed: canvasReceipt.visualPassClaimed !== true
    };

    const failed = Object.keys(checks).filter((key) => !checks[key]);
    const status = failed.length ? COHERENCE_STATUS.FAIL : COHERENCE_STATUS.PASS;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.RECEIPT_VERIFICATION_CHECK,
      name: "Receipt Verification Check",
      goal: "Runtime Table, canvas, and channel receipts must be present and contract-compatible.",
      observed: failed.length ? `Failed receipt/contract fields: ${failed.join(", ")}.` : "Required receipts and contracts are compatible.",
      math: "Boolean contract/receipt alignment check; visualPassClaimed must remain false.",
      tolerance: { failedRequiredFields: 0 },
      value: {
        failed,
        checks,
        runtimeTableHandoff: ledger && ledger.handoff ? ledger.handoff : "",
        canvasContract: extractContract(canvasReceipt)
      },
      status,
      probableCause: failed.length ? ["Stale file, missing receipt, mismatched contract, or canvas over-claiming final visual status."] : [],
      renewalTarget: failed.length ? ["runtime-table-receipt-alignment", "canvas-consumption-status", "child-export-receipts", "contract-cache-refresh"] : [],
      nextStrategy: failed.length ? ["Verify active script cache keys and exported receipt fields before renewing visual code."] : []
    });
  }

  function coordinateBodyCheck(ctx) {
    const profile = ctx.goalProfile;
    const t = profile.tolerances;
    const reference = ctx.canvasSample && Number.isFinite(Number(ctx.canvasSample.x))
      ? ctx.canvasSample
      : DEFAULT_SAMPLE_POINT;

    const baseSamples = [
      ["canvas", ctx.canvasSample],
      ["land", ctx.landSample],
      ["water", ctx.waterSample],
      ["air", ctx.airSample]
    ];

    Object.keys(ctx.channelSamples || {}).forEach((key) => {
      baseSamples.push([key, ctx.channelSamples[key]]);
    });

    const samples = baseSamples.filter(([, sample]) => sample && Object.keys(sample).length);
    const metrics = samples.map(([key, sample]) => ({ key, ...coordinateMetrics(sample, reference) }));

    const failures = metrics.filter((item) => (
      item.vectorMagnitudeError > t.vectorMagnitudeError ||
      item.uError > t.uError ||
      item.vError > t.vError ||
      item.coordinateError > t.coordinateError
    ));

    const missingCoordinateSamples = samples.length < 2;
    const status = failures.length ? COHERENCE_STATUS.FAIL : missingCoordinateSamples ? COHERENCE_STATUS.WARNING : COHERENCE_STATUS.PASS;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.COORDINATE_BODY_CHECK,
      name: "Coordinate Body Check",
      goal: "All children must sample the same planetary coordinate body.",
      observed: failures.length
        ? `${failures.length} coordinate sample(s) exceeded tolerance.`
        : missingCoordinateSamples
          ? "Coordinate body appears usable, but too few samples were available for full certainty."
          : "Coordinate body samples are within tolerance.",
      math: "vectorMagnitudeError = abs(1 - sqrt(x² + y² + z²)); uError = abs(u - ((lon + 180) / 360)); vError = abs(v - ((90 - lat) / 180)); coordinateError = sqrt((child.x-canvas.x)² + (child.y-canvas.y)² + (child.z-canvas.z)²).",
      tolerance: {
        vectorMagnitudeError: t.vectorMagnitudeError,
        uError: t.uError,
        vError: t.vError,
        coordinateError: t.coordinateError
      },
      value: {
        metrics,
        failures: failures.map((item) => item.key)
      },
      status,
      probableCause: failures.length ? ["One or more files may be sampling a different coordinate point or projection basis."] : [],
      renewalTarget: failures.length ? ["child-parse-input", "shared-coordinate-adapter", "canvas-projection-mapping", "atlas-coordinate-conversion"] : [],
      nextStrategy: failures.length ? ["Renew the coordinate adapter before changing visual colors or terrain fields."] : []
    });
  }

  function channelSeparationCheck(ctx) {
    const t = ctx.goalProfile.tolerances;
    const canvas = ctx.canvasSample || {};
    const landWeight = clamp01(safeNumber(canvas.landWeight ?? (ctx.landSample && ctx.landSample.landAlpha), 0));
    const waterWeight = clamp01(safeNumber(canvas.waterWeight ?? (ctx.waterSample && ctx.waterSample.waterAlpha), 0));
    const airWeight = clamp01(safeNumber(canvas.airWeight ?? (ctx.airSample && ctx.airSample.airAlpha), 0));
    const channelSeparation = Math.abs(landWeight - airWeight) + Math.abs(waterWeight - airWeight);
    const dominantAirRisk = airWeight - Math.max(landWeight, waterWeight);
    const separationFail = channelSeparation < t.minimumChannelSeparation;
    const airRiskFail = dominantAirRisk > t.maximumDominantAirRisk;
    const status = separationFail || airRiskFail ? COHERENCE_STATUS.DEGRADED : COHERENCE_STATUS.PASS;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.CHANNEL_SEPARATION_CHECK,
      name: "Channel Separation Check",
      goal: "Land, water, and air must remain visually separable enough to read as different authorities.",
      observed: status === COHERENCE_STATUS.PASS ? "Channel weights remain separable." : "Channel weights are too compressed or air dominates surface readability.",
      math: "channelSeparation = abs(landWeight - airWeight) + abs(waterWeight - airWeight); dominantAirRisk = airWeight - max(landWeight, waterWeight).",
      tolerance: {
        minimumChannelSeparation: t.minimumChannelSeparation,
        maximumDominantAirRisk: t.maximumDominantAirRisk
      },
      value: {
        landWeight,
        waterWeight,
        airWeight,
        channelSeparation,
        dominantAirRisk,
        separationFail,
        airRiskFail
      },
      status,
      probableCause: status !== COHERENCE_STATUS.PASS ? ["Air, land, and water blend weights are too close, producing a merged expression."] : [],
      renewalTarget: status !== COHERENCE_STATUS.PASS ? ["channel-weighting", "air-alpha-cap", "land-contrast", "water-depth-color", "canvas-blend-order"] : [],
      nextStrategy: status !== COHERENCE_STATUS.PASS ? ["Separate channel weights before renewing geological detail."] : []
    });
  }

  function projectionSeatingCheck(ctx) {
    const canvas = ctx.canvasReceipt || {};
    const render = ctx.renderMetadata || {};
    const sphereContainment = safeBool(render.sphereContainment, safeBool(canvas.sphereContainment, safeBool(canvas.supportsSphereContainment, true)));
    const outsideSphereTransparent = safeBool(render.outsideSphereTransparent, safeBool(canvas.outsideSphereTransparent, safeBool(canvas.supportsOutsideSphereTransparency, true)));
    const noRectangularTextureSpill = safeBool(render.noRectangularTextureSpill, safeBool(canvas.noRectangularTextureSpill, true));
    const atlasReady = safeBool(render.atlasReady, false) || safeBool(canvas.atlasReady, false) || safeBool(render.imageRendered, ctx.imageRendered);
    const projectionReady = safeBool(render.projectionReady, safeBool(canvas.projectionReady, atlasReady || safeBool(render.imageRendered, false)));
    const failures = [];

    if (!sphereContainment) failures.push("sphereContainment");
    if (!outsideSphereTransparent) failures.push("outsideSphereTransparent");
    if (!noRectangularTextureSpill) failures.push("noRectangularTextureSpill");
    if (ctx.imageRendered && !projectionReady) failures.push("projectionReady");

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.PROJECTION_SEATING_CHECK,
      name: "Projection Seating Check",
      goal: "Atlas or fallback output must seat to the sphere and not leak as a raw rectangle or detached layer.",
      observed: failures.length ? `Projection seating failed fields: ${failures.join(", ")}.` : "Projection seating fields are coherent or fallback-safe.",
      math: "Boolean projection gate: sphereContainment && outsideSphereTransparent && noRectangularTextureSpill && projectionReady when imageRendered is true.",
      tolerance: { allProjectionFlags: true },
      value: {
        sphereContainment,
        outsideSphereTransparent,
        noRectangularTextureSpill,
        atlasReady,
        projectionReady,
        failures
      },
      status: failures.length ? COHERENCE_STATUS.FAIL : COHERENCE_STATUS.PASS,
      probableCause: failures.length ? ["Canvas projection, atlas sampling, or sphere containment metadata is not aligned."] : [],
      renewalTarget: failures.length ? ["canvas-projection-mapping", "atlas-sampling", "spherePixelToVector", "renderSphereFromAtlas"] : [],
      nextStrategy: failures.length ? ["Repair projection seating before adjusting channel colors."] : []
    });
  }

  function contrastVisibilityCheck(ctx) {
    const t = ctx.goalProfile.tolerances;
    const landRgb = extractRgb(ctx.landSample, extractRgb(ctx.canvasSample && ctx.canvasSample.land, [92, 86, 58]));
    const waterRgb = extractRgb(ctx.waterSample, extractRgb(ctx.canvasSample && ctx.canvasSample.water, [8, 35, 86]));
    const landLum = luminance(landRgb);
    const waterLum = luminance(waterRgb);
    const contrastDelta = Math.abs(landLum - waterLum);
    const status = contrastDelta >= t.minimumContrastDelta ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.DEGRADED;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.CONTRAST_VISIBILITY_CHECK,
      name: "Contrast Visibility Check",
      goal: "Land and water must be legible.",
      observed: status === COHERENCE_STATUS.PASS ? "Land/water contrast is above minimum tolerance." : "Land/water contrast is too low for reliable visual readability.",
      math: "luminance = 0.2126r + 0.7152g + 0.0722b; contrastDelta = abs(luminance(landRgb) - luminance(waterRgb)).",
      tolerance: { minimumContrastDelta: t.minimumContrastDelta },
      value: {
        landRgb,
        waterRgb,
        landLum,
        waterLum,
        contrastDelta
      },
      status,
      probableCause: status !== COHERENCE_STATUS.PASS ? ["Land and water color/exposure are too close, even if the channels technically render."] : [],
      renewalTarget: status !== COHERENCE_STATUS.PASS ? ["land-exposure", "water-depth-color", "overall-illumination", "canvas-final-lighting", "atlas-color-calibration"] : [],
      nextStrategy: status !== COHERENCE_STATUS.PASS ? ["Increase land/water luminance separation after body-binding and seating checks pass."] : []
    });
  }

  function distributionShapeCheck(ctx) {
    const t = ctx.goalProfile.tolerances;
    const minimumWideProbePoints = Math.max(1, Math.round(safeNumber(t.minimumWideProbePoints, 25)));
    const samples = ctx.probeSamples.length ? ctx.probeSamples : [];

    if (samples.length < minimumWideProbePoints) {
      return makeCheckpointReceipt({
        id: COHERENCE_CHECKS.DISTRIBUTION_SHAPE_CHECK,
        name: "Distribution Shape Check",
        goal: "Global land, water, and air distribution must be judged only from a wide probe.",
        observed: `Distribution check held. Probe total ${samples.length} is below required minimum ${minimumWideProbePoints}. Anchor samples remain local proof only.`,
        math: "Single anchor samples are valid for load, contract, method, coordinate, and local safety checks only. Global distribution requires total >= minimumWideProbePoints.",
        tolerance: {
          minimumWideProbePoints,
          singleAnchorMayJudgeDistribution: false
        },
        value: {
          total: samples.length,
          minimumWideProbePoints,
          heldReason: "INSUFFICIENT_WIDE_PROBE",
          anchorSampleIsLocalProofOnly: true,
          globalDistributionWarningEmitted: false
        },
        status: COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
        nonBlocking: true,
        probableCause: [],
        renewalTarget: [],
        nextStrategy: ["Run wide-probe diagnostic in idle/chunked mode after first visible render."]
      });
    }

    let landCount = 0;
    let waterCount = 0;
    let airCount = 0;
    let total = 0;

    samples.forEach((sample) => {
      const land = sample.land || (sample.canvas && sample.canvas.land) || sample;
      const water = sample.water || (sample.canvas && sample.canvas.water) || sample;
      const air = sample.air || (sample.canvas && sample.canvas.air) || sample;
      const canvas = sample.canvas || sample;
      const landSignal = clamp01(safeNumber(canvas.landWeight ?? land.landAlpha ?? land.landPresence, 0));
      const waterSignal = clamp01(safeNumber(canvas.waterWeight ?? water.waterAlpha ?? water.waterPresence, 0));
      const airSignal = clamp01(safeNumber(canvas.airWeight ?? air.airAlpha ?? air.airPresence, 0));

      if (landSignal > 0.12) landCount += 1;
      if (waterSignal > 0.12) waterCount += 1;
      if (airSignal > 0.12) airCount += 1;
      total += 1;
    });

    total = Math.max(1, total);
    const landCoverage = landCount / total;
    const waterCoverage = waterCount / total;
    const airDominance = airCount / total;
    const lowLand = landCoverage < t.minimumLandCoverageWhenExpected;
    const highAir = airDominance > t.maximumAirDominance && airDominance > landCoverage + waterCoverage;
    const status = lowLand || highAir ? COHERENCE_STATUS.WARNING : COHERENCE_STATUS.PASS;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.DISTRIBUTION_SHAPE_CHECK,
      name: "Distribution Shape Check",
      goal: "Land, water, and air distribution should match the goal profile.",
      observed: status === COHERENCE_STATUS.PASS ? "Wide-probe distribution is within initial tolerance." : "Wide-probe distribution suggests low land visibility or excessive air dominance.",
      math: "landCoverage = visibleLandSamples / totalSamples; waterCoverage = visibleWaterSamples / totalSamples; airDominance = visibleAirSamples / totalSamples.",
      tolerance: {
        minimumWideProbePoints,
        minimumLandCoverageWhenExpected: t.minimumLandCoverageWhenExpected,
        maximumAirDominance: t.maximumAirDominance
      },
      value: {
        landCoverage,
        waterCoverage,
        airDominance,
        landCount,
        waterCount,
        airCount,
        total,
        lowLand,
        highAir,
        anchorSampleIsLocalProofOnly: true
      },
      status,
      probableCause: status !== COHERENCE_STATUS.PASS ? ["Land may be too sparse, air may dominate surface readability, or child-channel alpha distribution is misbalanced."] : [],
      renewalTarget: status !== COHERENCE_STATUS.PASS ? ["land-channel-alpha", "water-channel-alpha", "air-channel-suppression", "composition-elevation-mask-later-if-required"] : [],
      nextStrategy: status !== COHERENCE_STATUS.PASS ? ["Use wide-probe results to choose the next single-file renewal target."] : []
    });
  }

  function wideProbeReadinessCheck(ctx) {
    const t = ctx.goalProfile.tolerances;
    const minimumWideProbePoints = Math.max(1, Math.round(safeNumber(t.minimumWideProbePoints, 25)));
    const total = ctx.probeSamples.length;

    const status = total >= minimumWideProbePoints
      ? COHERENCE_STATUS.PASS
      : COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.WIDE_PROBE_READINESS_CHECK,
      name: "Wide-Probe Readiness Check",
      goal: "Wide probe must be separated from first visible render and must not block carrier visibility.",
      observed: status === COHERENCE_STATUS.PASS
        ? "Wide-probe sample count is sufficient."
        : "Wide-probe is pending; first visible render remains valid.",
      math: "wideProbeReady = probeSamples.length >= minimumWideProbePoints. If false, status is HELD_PENDING_WIDE_PROBE, not FAIL.",
      tolerance: {
        minimumWideProbePoints,
        blocksFirstVisibleRender: false
      },
      value: {
        probeSampleCount: total,
        minimumWideProbePoints,
        wideProbeReady: total >= minimumWideProbePoints,
        blocksFirstVisibleRender: false
      },
      status,
      nonBlocking: true,
      probableCause: [],
      renewalTarget: [],
      nextStrategy: status === COHERENCE_STATUS.PASS ? [] : ["Schedule wide-probe chunks after visible carrier and atlas/cache render."]
    });
  }

  function loadingOptimizationCheck(ctx) {
    const plan = ctx.loadingPlan && ctx.loadingPlan.loadingOptimizationPlan
      ? ctx.loadingPlan.loadingOptimizationPlan
      : createLoadingOptimizationPlan(ctx, { goalProfile: ctx.goalProfile });

    const blocksFirstVisibleRender = plan.wideProbeBlocksFirstVisibleRender === true || plan.firstVisibleRenderAllowed === false;
    const status = blocksFirstVisibleRender ? COHERENCE_STATUS.BLOCKING : COHERENCE_STATUS.PASS;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.LOADING_OPTIMIZATION_CHECK,
      name: "Loading Optimization Check",
      goal: "First visible render must not wait for global wide-probe distribution.",
      observed: status === COHERENCE_STATUS.PASS
        ? "Loading order is valid: visible carrier first; wide-probe deferred."
        : "Loading order blocks visible carrier incorrectly.",
      math: "validLoading = visibleCarrierFirst && wideProbeBlocksFirstVisibleRender === false.",
      tolerance: {
        visibleCarrierFirst: true,
        wideProbeBlocksFirstVisibleRender: false
      },
      value: {
        loadingCoordinate: plan.loadingCoordinate,
        visibleCarrierFirst: plan.visibleCarrierFirst,
        firstVisibleRenderAllowed: plan.firstVisibleRenderAllowed,
        wideProbeBlocksFirstVisibleRender: plan.wideProbeBlocksFirstVisibleRender,
        wideProbeReady: plan.wideProbeReady
      },
      status,
      probableCause: status === COHERENCE_STATUS.PASS ? [] : ["Wide-probe or child diagnostics are being treated as first-render blockers."],
      renewalTarget: status === COHERENCE_STATUS.PASS ? [] : ["loading-order", "canvas-shell-first-render", "wide-probe-deferment"],
      nextStrategy: status === COHERENCE_STATUS.PASS ? [] : ["Restore visible carrier first and defer wide-probe to idle chunks."]
    });
  }

  function collectRenewalTargets(checkpoints) {
    const seen = new Set();
    const targets = [];

    checkpoints.forEach((checkpoint) => {
      if (checkpoint.status === COHERENCE_STATUS.PASS || checkpoint.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE) return;

      asArray(checkpoint.renewalTarget).forEach((target) => {
        if (!seen.has(target)) {
          seen.add(target);
          targets.push(target);
        }
      });
    });

    return targets;
  }

  function collectNextStrategy(checkpoints) {
    const seen = new Set();
    const strategies = [];

    checkpoints.forEach((checkpoint) => {
      if (checkpoint.status === COHERENCE_STATUS.PASS) return;

      asArray(checkpoint.nextStrategy).forEach((strategy) => {
        if (!seen.has(strategy)) {
          seen.add(strategy);
          strategies.push(strategy);
        }
      });
    });

    return strategies;
  }

  function aggregateCoherence(ctx, checkpoints) {
    const profile = ctx.goalProfile;
    const weights = profile.weights || {};
    const criticalChecks = asArray(profile.criticalChecks);
    let totalWeight = 0;
    let earned = 0;

    checkpoints.forEach((checkpoint) => {
      if (checkpoint.id === COHERENCE_CHECKS.COHERENT_EXPRESSION_CHECK) return;
      const weight = safeNumber(weights[checkpoint.id], 1);
      totalWeight += weight;
      earned += weight * statusScore(checkpoint.status);
    });

    const coherenceScore = totalWeight ? Math.round((earned / totalWeight) * 100) : 0;
    const criticalFailures = checkpoints.filter((checkpoint) => (
      criticalChecks.includes(checkpoint.id) &&
      (
        checkpoint.status === COHERENCE_STATUS.FAIL ||
        checkpoint.status === COHERENCE_STATUS.REJECTED ||
        checkpoint.status === COHERENCE_STATUS.BLOCKING
      )
    ));

    const anyBlocking = checkpoints.some((checkpoint) => checkpoint.status === COHERENCE_STATUS.BLOCKING);
    const anyRejected = checkpoints.some((checkpoint) => checkpoint.status === COHERENCE_STATUS.REJECTED);
    const anyFail = checkpoints.some((checkpoint) => checkpoint.status === COHERENCE_STATUS.FAIL);
    const coherentExpressionPass = coherenceScore >= profile.tolerances.minimumCoherenceScore && !criticalFailures.length && !anyBlocking && !anyRejected;

    let status = COHERENCE_STATUS.PASS;
    if (anyBlocking) status = COHERENCE_STATUS.BLOCKING;
    else if (anyRejected) status = COHERENCE_STATUS.REJECTED;
    else if (criticalFailures.length || anyFail) status = COHERENCE_STATUS.FAIL;
    else if (coherenceScore < 70) status = COHERENCE_STATUS.FAIL;
    else if (coherenceScore < profile.tolerances.minimumCoherenceScore) status = COHERENCE_STATUS.DEGRADED;

    return {
      coherenceScore,
      coherentExpressionPass,
      status,
      criticalFailures: criticalFailures.map((item) => item.id)
    };
  }

  function coherentExpressionCheck(ctx, checkpoints) {
    const aggregate = aggregateCoherence(ctx, checkpoints);

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.COHERENT_EXPRESSION_CHECK,
      name: "Coherent Expression Check",
      goal: "Aggregate construction, render, and expression checkpoints into a final coherence gate.",
      observed: aggregate.coherentExpressionPass ? "Coherent expression passed." : "Rendered image does not yet qualify as coherent expression.",
      math: "Weighted checkpoint score. Critical failures override score. Image rendered does not imply coherent expression. HELD_PENDING_WIDE_PROBE is non-blocking.",
      tolerance: {
        minimumCoherenceScore: ctx.goalProfile.tolerances.minimumCoherenceScore,
        criticalFailureCount: 0
      },
      value: {
        coherenceScore: aggregate.coherenceScore,
        coherentExpressionPass: aggregate.coherentExpressionPass,
        criticalFailures: aggregate.criticalFailures,
        imageRendered: ctx.imageRendered,
        constructionReady: ctx.constructionReady
      },
      status: aggregate.status,
      probableCause: aggregate.coherentExpressionPass ? [] : ["At least one expression checkpoint failed, degraded, or produced insufficient proof."],
      renewalTarget: aggregate.coherentExpressionPass ? [] : collectRenewalTargets(checkpoints),
      nextStrategy: aggregate.coherentExpressionPass ? [] : ["Use failed checkpoint receipts to select the next single-file renewal target."]
    });
  }

  function runChecks(input = {}, options = {}) {
    const ctx = normalizeDiagnosticInput(input, options);
    const checkpoints = [];

    if (input.visualCarrierPlan && input.visualCarrierPlan.visualCarrierEligibilityCheckpoint) {
      checkpoints.push(input.visualCarrierPlan.visualCarrierEligibilityCheckpoint);
    }

    checkpoints.push(
      receiptVerificationCheck(ctx),
      coordinateBodyCheck(ctx),
      channelSeparationCheck(ctx),
      projectionSeatingCheck(ctx),
      contrastVisibilityCheck(ctx),
      distributionShapeCheck(ctx),
      wideProbeReadinessCheck(ctx),
      loadingOptimizationCheck(ctx)
    );

    if (input.visualCarrierPlan && input.visualCarrierPlan.atlasStartAuthorizationCheckpoint) {
      checkpoints.push(input.visualCarrierPlan.atlasStartAuthorizationCheckpoint);
    }

    const finalCheckpoint = coherentExpressionCheck(ctx, checkpoints);
    checkpoints.push(finalCheckpoint);

    const failedCheckpoints = checkpoints.filter((checkpoint) => (
      checkpoint.status === COHERENCE_STATUS.FAIL ||
      checkpoint.status === COHERENCE_STATUS.REJECTED ||
      checkpoint.status === COHERENCE_STATUS.BLOCKING
    ));

    const warningCheckpoints = checkpoints.filter((checkpoint) => (
      checkpoint.status === COHERENCE_STATUS.WARNING ||
      checkpoint.status === COHERENCE_STATUS.DEGRADED
    ));

    const heldCheckpoints = checkpoints.filter((checkpoint) => (
      checkpoint.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE
    ));

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-cardinal-north-diagnostic-facade",
      goalProfileId: ctx.goalProfile.id,
      goalProfile: clonePlain(ctx.goalProfile),
      constructionReady: ctx.constructionReady,
      imageRendered: ctx.imageRendered,
      coherentExpressionPass: finalCheckpoint.value.coherentExpressionPass,
      coherenceScore: finalCheckpoint.value.coherenceScore,
      coherenceStatus: finalCheckpoint.status,
      runtimeTableHandoff: ctx.runtimeTableLedger && ctx.runtimeTableLedger.handoff ? ctx.runtimeTableLedger.handoff : "",
      checkpoints,
      failedCheckpoints: failedCheckpoints.map((checkpoint) => checkpoint.id),
      warningCheckpoints: warningCheckpoints.map((checkpoint) => checkpoint.id),
      heldCheckpoints: heldCheckpoints.map((checkpoint) => checkpoint.id),
      renewalTargets: collectRenewalTargets(checkpoints),
      nextStrategy: collectNextStrategy(checkpoints),
      singleAnchorIsLocalProofOnly: true,
      wideProbeNeverBlocksFirstVisibleRender: true,
      chronologicalCheckpointGovernorAvailable: true,
      cardinalSplitActive: true,
      northPrecedent: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  const cardinalState = {
    northLoaded: true,
    eastLoaded: false,
    westLoaded: false,
    southLoaded: false,
    eastFallbackUsed: true,
    westFallbackUsed: true,
    southFallbackUsed: true,
    eastError: "",
    westError: "",
    southError: "",
    attemptedScriptLoad: false,
    lastBindAt: "",
    branches: {
      east: null,
      west: null,
      south: null
    }
  };

  function createEastFallback() {
    function createChronologicalFibonacciPlan(options = {}) {
      const sequence = asArray(options.sequence).length ? asArray(options.sequence) : FIBONACCI_CHECKPOINTS.slice();

      return sequence
        .map((checkpoint) => ({
          ...checkpoint,
          aliases: asArray(checkpoint.aliases),
          complete: false,
          degraded: false,
          status: CHECKPOINT_STATUS.PENDING
        }))
        .sort((a, b) => a.rank - b.rank);
    }

    function createNewsFibonacciCheckpointPlan(options = {}) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: "runtime-table-east-fallback-news-fibonacci-checkpoint-plan",
        sequence: createChronologicalFibonacciPlan(options),
        newsGates: clonePlain(NEWS_GATES),
        f13CompoundSequenceRequired: true,
        f13MVisibleContentProofOrDegradedForwardRequired: true,
        f13NInspectModeOrDegradedForwardRequired: true,
        f21RequiresNewsGatesOrDegradedForward: true,
        oneActiveCheckpointAtATime: true,
        blockedProgressCap: 98,
        readyTextRequiresCompletionLatch: true,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    function normalizeCheckpointEvent(event = {}) {
      const detail = isObject(event.detail) ? event.detail : {};
      const id =
        event.checkpointId ||
        event.phase ||
        event.id ||
        event.event ||
        detail.checkpointId ||
        detail.phase ||
        detail.id ||
        detail.event ||
        "";

      return {
        ...event,
        id: String(id),
        phase: String(event.phase || detail.phase || id || ""),
        event: String(event.event || event.id || detail.event || detail.id || id || ""),
        detail
      };
    }

    function checkpointMatchesEvent(checkpoint, normalizedEvent) {
      const candidates = [
        normalizedEvent.id,
        normalizedEvent.phase,
        normalizedEvent.event,
        normalizedEvent.checkpointId
      ].filter(Boolean);

      return candidates.some((candidate) => (
        candidate === checkpoint.id ||
        candidate === checkpoint.event ||
        asArray(checkpoint.aliases).includes(candidate)
      ));
    }

    function findCheckpointForEvent(sequence, normalizedEvent) {
      return sequence.find((checkpoint) => checkpointMatchesEvent(checkpoint, normalizedEvent)) || null;
    }

    function getCheckpointAt(sequence, index) {
      return sequence[Math.max(0, Math.min(sequence.length - 1, index))] || null;
    }

    function evaluateNewsGateState(snapshot = {}) {
      const fullNorth = Boolean(
        safeBool(snapshot.canvasReady) &&
        safeBool(snapshot.atlasBuildComplete) &&
        safeBool(snapshot.textureComposeComplete) &&
        safeBool(snapshot.visibleContentProof) &&
        safeBool(snapshot.visiblePlanetAvailable)
      );

      const degradedNorth = Boolean(
        fullNorth ||
        (
          safeBool(snapshot.canvasReady) &&
          safeBool(snapshot.atlasBuildComplete) &&
          safeBool(snapshot.textureComposeComplete) &&
          safeBool(snapshot.imageRendered) &&
          safeBool(snapshot.firstFrameDetected) &&
          safeBool(snapshot.nonblankPlanetVisible) &&
          hasVisibleSurfaceSignal(snapshot)
        )
      );

      const eastGateReady = Boolean(
        safeBool(snapshot.cooperativeBootUsed) &&
        !safeBool(snapshot.syncBootFallbackUsed) &&
        safeBool(snapshot.canvasCarrierRequested) &&
        safeBool(snapshot.canvasCarrierHandoffOk)
      );

      const fullWest = Boolean(
        safeBool(snapshot.copyDiagnosticPreserved) &&
        safeBool(snapshot.receiptToggleReady) &&
        safeBool(snapshot.inspectPlanetControlAvailable) &&
        safeBool(snapshot.diagnosticDockRestorable) &&
        safeBool(snapshot.buttonsReachable) &&
        safeBool(snapshot.receiptOverlayIndependent, true)
      );

      const degradedWest = Boolean(
        fullWest ||
        hasInspectFallbackSignal(snapshot)
      );

      const fullSouth = Boolean(
        safeBool(snapshot.imageRendered) &&
        safeBool(snapshot.firstFrameDetected) &&
        safeBool(snapshot.dragInspectionBound) &&
        safeBool(snapshot.visiblePlanetAvailable) &&
        safeBool(snapshot.diagnosticCanLeavePlanetFrame)
      );

      const degradedSouth = Boolean(
        fullSouth ||
        (
          safeBool(snapshot.imageRendered) &&
          safeBool(snapshot.firstFrameDetected) &&
          safeBool(snapshot.dragInspectionBound) &&
          safeBool(snapshot.nonblankPlanetVisible)
        )
      );

      const newsGatePassedBeforeF21 = Boolean(fullNorth && eastGateReady && fullWest && fullSouth);
      const newsGateDegradedBeforeF21 = Boolean(degradedNorth && eastGateReady && degradedWest && degradedSouth);

      return {
        northGateReady: fullNorth,
        eastGateReady,
        westGateReady: fullWest,
        southGateReady: fullSouth,
        newsGatePassedBeforeF21,
        northGateDegradedReady: degradedNorth,
        westGateDegradedReady: degradedWest,
        southGateDegradedReady: degradedSouth,
        newsGateDegradedBeforeF21,
        degradedForwardAvailable: newsGateDegradedBeforeF21 && !newsGatePassedBeforeF21
      };
    }

    function classifyCheckpointEvent(event = {}, sessionLike = {}) {
      const sequence = asArray(sessionLike.sequence).length ? sessionLike.sequence : createChronologicalFibonacciPlan();
      const normalized = normalizeCheckpointEvent(event);
      const activeIndex = Number.isFinite(Number(sessionLike.activeIndex)) ? Number(sessionLike.activeIndex) : 0;
      const activeCheckpoint = getCheckpointAt(sequence, activeIndex);
      const completionLatched = safeBool(sessionLike.completionLatched, false);
      const eventName = normalized.event || normalized.id || normalized.phase;

      if (isProgressOnlyEventName(eventName)) {
        return {
          action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
          gapClass: GAP_CLASS.PROGRESS_ONLY,
          checkpointId: "",
          checkpointRank: 0,
          activeCheckpointId: activeCheckpoint ? activeCheckpoint.id : "",
          activeRank: activeCheckpoint ? activeCheckpoint.rank : 0,
          reason: "progress-only-event-archived-after-parent-truth",
          visibleUpdateAllowed: false,
          mayAdvance: false,
          maySetProgress: false,
          maySetReadyText: false
        };
      }

      const checkpoint = findCheckpointForEvent(sequence, normalized);

      if (!checkpoint) {
        return {
          action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
          gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
          checkpointId: "",
          checkpointRank: 0,
          activeCheckpointId: activeCheckpoint ? activeCheckpoint.id : "",
          activeRank: activeCheckpoint ? activeCheckpoint.rank : 0,
          reason: "unknown-checkpoint-event-archived",
          visibleUpdateAllowed: false,
          mayAdvance: false,
          maySetProgress: false,
          maySetReadyText: false
        };
      }

      if (completionLatched && checkpoint.id !== "F21_COMPLETION_LATCHED") {
        return {
          action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
          gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
          checkpointId: checkpoint.id,
          checkpointRank: checkpoint.rank,
          activeCheckpointId: activeCheckpoint ? activeCheckpoint.id : "",
          activeRank: activeCheckpoint ? activeCheckpoint.rank : 0,
          reason: "post-f21-event-archived",
          visibleUpdateAllowed: false,
          mayAdvance: false,
          maySetProgress: false,
          maySetReadyText: false
        };
      }

      if (!activeCheckpoint) {
        return {
          action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
          gapClass: GAP_CLASS.STRUCTURAL_BLOCK,
          checkpointId: checkpoint.id,
          checkpointRank: checkpoint.rank,
          activeCheckpointId: "",
          activeRank: 0,
          reason: "active-checkpoint-missing",
          visibleUpdateAllowed: false,
          mayAdvance: false,
          maySetProgress: false,
          maySetReadyText: false
        };
      }

      if (checkpoint.id === "F21_COMPLETION_LATCHED") {
        const f21Allowed = safeBool(sessionLike.f21Allowed, false) || safeBool(event.f21Allowed, false) || safeBool(event.detail && event.detail.f21Allowed, false);
        const f21DegradedAllowed = safeBool(sessionLike.f21DegradedAllowed, false) || safeBool(event.f21DegradedAllowed, false) || safeBool(event.detail && event.detail.f21DegradedAllowed, false);

        if (!f21Allowed && !f21DegradedAllowed) {
          return {
            action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
            gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
            checkpointId: checkpoint.id,
            checkpointRank: checkpoint.rank,
            activeCheckpointId: activeCheckpoint.id,
            activeRank: activeCheckpoint.rank,
            reason: "f21-blocked-until-f13n-and-news-gates-pass-or-degrade-forward",
            visibleUpdateAllowed: false,
            mayAdvance: false,
            maySetProgress: false,
            maySetReadyText: false
          };
        }
      }

      if (checkpoint.rank === activeCheckpoint.rank) {
        return {
          action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
          gapClass: GAP_CLASS.NONE,
          checkpointId: checkpoint.id,
          checkpointRank: checkpoint.rank,
          activeCheckpointId: activeCheckpoint.id,
          activeRank: activeCheckpoint.rank,
          reason: "event-matches-active-checkpoint",
          visibleUpdateAllowed: true,
          mayAdvance: true,
          maySetProgress: checkpoint.id === "F21_COMPLETION_LATCHED" ? (safeBool(sessionLike.f21Allowed, false) || safeBool(sessionLike.f21DegradedAllowed, false)) : true,
          maySetReadyText: checkpoint.id === "F21_COMPLETION_LATCHED" && (safeBool(sessionLike.f21Allowed, false) || safeBool(sessionLike.f21DegradedAllowed, false))
        };
      }

      if (checkpoint.rank > activeCheckpoint.rank) {
        return {
          action: CHECKPOINT_EVENT_ACTIONS.QUEUE,
          gapClass: GAP_CLASS.HELD_GAP,
          checkpointId: checkpoint.id,
          checkpointRank: checkpoint.rank,
          activeCheckpointId: activeCheckpoint.id,
          activeRank: activeCheckpoint.rank,
          reason: "future-event-queued-until-prior-checkpoint-completes",
          visibleUpdateAllowed: false,
          mayAdvance: false,
          maySetProgress: false,
          maySetReadyText: false
        };
      }

      if (isFalseCompletionMutation(event)) {
        return {
          action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
          gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
          checkpointId: checkpoint.id,
          checkpointRank: checkpoint.rank,
          activeCheckpointId: activeCheckpoint.id,
          activeRank: activeCheckpoint.rank,
          reason: "past-event-attempted-false-completion-visible-mutation",
          visibleUpdateAllowed: false,
          mayAdvance: false,
          maySetProgress: false,
          maySetReadyText: false
        };
      }

      return {
        action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
        checkpointId: checkpoint.id,
        checkpointRank: checkpoint.rank,
        activeCheckpointId: activeCheckpoint.id,
        activeRank: activeCheckpoint.rank,
        reason: "duplicate-or-late-completed-event-archived",
        visibleUpdateAllowed: false,
        mayAdvance: false,
        maySetProgress: false,
        maySetReadyText: false
      };
    }

    function createCheckpointSession(sequenceInput = null, options = {}) {
      const sequence = createChronologicalFibonacciPlan({
        sequence: sequenceInput || options.sequence || FIBONACCI_CHECKPOINTS
      });

      const sessionId = options.id || `${options.planetId || "planet"}-checkpoint-session-${Math.random().toString(36).slice(2, 9)}`;

      const state = {
        sessionId,
        contract: CONTRACT,
        receipt: RECEIPT,
        planetId: options.planetId || "",
        planetLabel: options.planetLabel || "",
        route: options.route || "",
        sequence,
        activeIndex: 0,
        highestCompletedIndex: -1,
        completedCheckpoints: [],
        degradedCheckpoints: [],
        queuedEvents: [],
        archivedEvents: [],
        blockedEvents: [],
        admittedEvents: [],
        degradedForwardEvents: [],
        regressionPrevented: 0,
        futureEventsQueued: 0,
        duplicateEventsArchived: 0,
        progressOnlyEventsArchived: 0,
        f13Events: [],
        fibonacciSequenceActive: true,
        chronologicalFibonacciAlignment: true,
        newsProtocolActive: true,
        newsGateState: evaluateNewsGateState({}),
        completionLatched: false,
        degradedCompletionLatched: false,
        progressCap: 98,
        visibleProgress: 0,
        readyTextAllowed: false,
        firstFailedCoordinate: "CHECKPOINT_SESSION_CREATED",
        recommendedNextRenewalTarget: "submit-first-checkpoint",
        latestClassification: null,
        latestGap: null,
        snapshot: {},
        errors: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };

      function activeCheckpoint() {
        return getCheckpointAt(state.sequence, state.activeIndex);
      }

      function updateNews(snapshot = {}) {
        state.snapshot = { ...state.snapshot, ...(snapshot || {}) };
        state.newsGateState = evaluateNewsGateState({
          ...state.snapshot,
          f13mComplete: state.completedCheckpoints.includes("F13M_VISIBLE_CONTENT_PROOF_PASSED"),
          f13nComplete: state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY")
        });
        return state.newsGateState;
      }

      function getWestApi() {
        return getWestBranch();
      }

      function getSouthApi() {
        return getSouthBranch();
      }

      function f13SubsequenceComplete() {
        return state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY");
      }

      function f13LastRequiredEvent() {
        return state.f13Events[state.f13Events.length - 1] || "";
      }

      function f21Allowed() {
        return Boolean(
          f13SubsequenceComplete() &&
          state.newsGateState.newsGatePassedBeforeF21 === true
        );
      }

      function f21DegradedAllowed() {
        const west = getWestApi();
        const gap = west.classifyGap(state.snapshot, {
          checkpointId: "F21_COMPLETION_LATCHED",
          activeCheckpointId: activeCheckpoint() ? activeCheckpoint().id : "",
          completedCheckpoints: state.completedCheckpoints,
          newsGateState: state.newsGateState
        });

        return Boolean(
          f13SubsequenceComplete() &&
          state.newsGateState.newsGateDegradedBeforeF21 === true &&
          gap.hardBlock !== true
        );
      }

      function progressForCheckpoint(checkpoint) {
        if (!checkpoint) return 0;
        if (state.completionLatched) return 100;
        if (checkpoint.id === "F21_COMPLETION_LATCHED") return 98;
        return Math.min(98, checkpoint.progress || 0);
      }

      function setFailureFromGap(gap, fallback = "") {
        if (!gap) {
          state.firstFailedCoordinate = fallback || "NONE";
          state.recommendedNextRenewalTarget = "none";
          return;
        }

        state.latestGap = clonePlain(gap);
        state.firstFailedCoordinate = gap.firstFailedCoordinate || fallback || "NONE";
        state.recommendedNextRenewalTarget = gap.recommendedNextRenewalTarget || options.coherenceSemiconductor || "/showroom/globe/hearth/hearth.js";
      }

      function setFirstFailureFromActive() {
        const active = activeCheckpoint();
        const west = getWestApi();

        if (!active) {
          state.firstFailedCoordinate = "NONE";
          state.recommendedNextRenewalTarget = "none";
          return;
        }

        const gap = west.classifyGap(state.snapshot, {
          checkpointId: active.id,
          activeCheckpointId: active.id,
          completedCheckpoints: state.completedCheckpoints,
          newsGateState: state.newsGateState
        });

        setFailureFromGap(gap, `WAITING_${active.event || active.id}`);
      }

      function completionDecision(checkpoint, event = {}) {
        const snapshot = {
          ...state.snapshot,
          ...normalizeEventSnapshot(event)
        };

        const west = getWestApi();
        const gap = west.classifyGap(snapshot, {
          checkpointId: checkpoint.id,
          activeCheckpointId: checkpoint.id,
          completedCheckpoints: state.completedCheckpoints,
          newsGateState: evaluateNewsGateState(snapshot),
          event
        });

        if (gap.hardBlock) {
          return {
            complete: false,
            degraded: false,
            gap
          };
        }

        switch (checkpoint.id) {
          case "F1A_HTML_SHELL_RENDERED":
          case "F1B_LOAD_LEDGER_INITIALIZED":
          case "F2_FIRST_PAINT_COCKPIT_VISIBLE":
          case "F3_SCRIPT_ORDER_COMPLETE":
          case "F5_AUTHORITY_AVAILABILITY_READY":
          case "F8_CONDUCTOR_HYDRATED":
          case "F13A_CANVAS_COOPERATIVE_BOOT_STARTED":
          case "F13B_CANVAS_MOUNT_CREATED":
          case "F13C_CANVAS_CONTEXT_READY":
          case "F13D_DRAG_INSPECTION_BOUND":
          case "F13E_ATLAS_BUILD_STARTED":
          case "F13F_ATLAS_BUILD_COMPLETE":
          case "F13G_TEXTURE_COMPOSE_STARTED":
          case "F13H_TEXTURE_COMPOSE_COMPLETE":
          case "F13I_FIRST_FRAME_REQUESTED":
          case "F13J_FIRST_FRAME_DETECTED":
            return { complete: true, degraded: false, gap };

          case "F13K_CANVAS_READY":
            return {
              complete: Boolean(
                safeBool(snapshot.canvasReady, true) &&
                safeBool(snapshot.canvasCarrierMounted, true) &&
                safeBool(snapshot.firstFrameDetected, true) &&
                safeBool(snapshot.imageRendered, true)
              ),
              degraded: false,
              gap
            };

          case "F13L_VISIBLE_CONTENT_PROOF_STARTED":
            return { complete: true, degraded: false, gap };

          case "F13M_VISIBLE_CONTENT_PROOF_PASSED":
            if (safeBool(snapshot.visibleContentProof)) {
              return { complete: true, degraded: false, gap };
            }

            if (gap.canDegradeForward && hasVisibleSurfaceSignal(snapshot)) {
              return { complete: true, degraded: true, gap };
            }

            return { complete: false, degraded: false, gap };

          case "F13N_INSPECT_MODE_READY":
            if (
              safeBool(snapshot.inspectModeAvailable) &&
              safeBool(snapshot.inspectPlanetControlAvailable) &&
              safeBool(snapshot.diagnosticDockRestorable) &&
              safeBool(snapshot.diagnosticCanLeavePlanetFrame) &&
              safeBool(snapshot.showDiagnosticTabVisibleWhenHidden) &&
              safeBool(snapshot.copyDiagnosticPreserved) &&
              safeBool(snapshot.receiptToggleReady) &&
              safeBool(snapshot.buttonsReachable)
            ) {
              return { complete: true, degraded: false, gap };
            }

            if (gap.canDegradeForward && hasInspectFallbackSignal(snapshot)) {
              return { complete: true, degraded: true, gap };
            }

            return { complete: false, degraded: false, gap };

          case "F21_COMPLETION_LATCHED":
            if (f21Allowed()) {
              return { complete: true, degraded: false, gap };
            }

            if (f21DegradedAllowed()) {
              return { complete: true, degraded: true, gap };
            }

            return { complete: false, degraded: false, gap };

          default:
            return { complete: true, degraded: false, gap };
        }
      }

      function completeCheckpoint(checkpoint, event = {}, degraded = false, gap = null) {
        checkpoint.complete = true;
        checkpoint.degraded = degraded === true;
        checkpoint.status = degraded ? CHECKPOINT_STATUS.DEGRADED_COMPLETE : CHECKPOINT_STATUS.COMPLETE;
        checkpoint.completedAt = nowIso();

        if (!state.completedCheckpoints.includes(checkpoint.id)) {
          state.completedCheckpoints.push(checkpoint.id);
        }

        if (degraded && !state.degradedCheckpoints.includes(checkpoint.id)) {
          state.degradedCheckpoints.push(checkpoint.id);
        }

        state.highestCompletedIndex = Math.max(state.highestCompletedIndex, state.sequence.indexOf(checkpoint));

        if (checkpoint.value === 13 && !state.f13Events.includes(checkpoint.event)) {
          state.f13Events.push(checkpoint.event);
        }

        if (checkpoint.id === "F21_COMPLETION_LATCHED") {
          state.completionLatched = true;
          state.degradedCompletionLatched = degraded === true || state.degradedCheckpoints.length > 0;
          state.progressCap = 100;
          state.visibleProgress = 100;
          state.readyTextAllowed = true;

          if (state.degradedCompletionLatched) {
            state.firstFailedCoordinate = gap && gap.firstFailedCoordinate
              ? "DEGRADED_F21_LATCHED_WITH_GAP_RECEIPT"
              : "DEGRADED_F21_LATCHED_WITH_KNOWN_GAPS";
            state.recommendedNextRenewalTarget = gap && gap.recommendedNextRenewalTarget
              ? gap.recommendedNextRenewalTarget
              : options.coherenceSemiconductor || "/showroom/globe/hearth/hearth.js";
          } else {
            state.firstFailedCoordinate = "NONE_F21_FULL_LATCHED";
            state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
          }
        } else {
          state.progressCap = 98;
          state.visibleProgress = Math.max(state.visibleProgress, progressForCheckpoint(checkpoint));
          state.readyTextAllowed = false;

          const nextIndex = state.sequence.indexOf(checkpoint) + 1;
          state.activeIndex = Math.min(nextIndex, state.sequence.length - 1);
          const next = activeCheckpoint();
          if (next && !next.complete) {
            next.status = CHECKPOINT_STATUS.ACTIVE;
          }

          if (gap) {
            setFailureFromGap(gap, `WAITING_${next ? next.event || next.id : "NEXT"}`);
          } else {
            setFirstFailureFromActive();
          }
        }

        state.updatedAt = nowIso();
        flushQueue();
        return checkpoint;
      }

      function reconcileActive(reason = "reconcile-active") {
        const active = activeCheckpoint();
        if (!active || active.complete || state.completionLatched) return false;

        const decision = completionDecision(active, {
          event: active.event,
          id: active.event,
          checkpointId: active.id,
          detail: {
            reconcileReason: reason,
            ...state.snapshot
          }
        });

        if (decision.complete) {
          completeCheckpoint(active, {
            event: active.event,
            id: active.event,
            checkpointId: active.id,
            detail: {
              reconcileReason: reason
            }
          }, decision.degraded, decision.gap);

          if (decision.degraded) {
            state.degradedForwardEvents.push({
              checkpointId: active.id,
              reason,
              gap: clonePlain(decision.gap),
              at: nowIso()
            });
          }

          return true;
        }

        if (decision.gap) setFailureFromGap(decision.gap, `WAITING_${active.id}`);
        return false;
      }

      function flushQueue() {
        let advanced = true;
        let guard = 0;

        while (advanced && guard < 64) {
          advanced = false;
          guard += 1;

          const active = activeCheckpoint();
          if (!active) return;

          const index = state.queuedEvents.findIndex((entry) => entry.classification.checkpointId === active.id);
          if (index < 0) {
            reconcileActive("queue-flush-reconcile");
            return;
          }

          const [entry] = state.queuedEvents.splice(index, 1);
          const result = submitEvent(entry.event, { fromQueue: true });

          if (result && (result.action === CHECKPOINT_EVENT_ACTIONS.ADMIT || result.action === CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD)) {
            advanced = true;
          }
        }
      }

      function submitEvent(rawEvent = {}, submitOptions = {}) {
        const event = normalizeCheckpointEvent(rawEvent);
        const eventSnapshot = normalizeEventSnapshot(event);
        updateNews(eventSnapshot);

        const classification = classifyCheckpointEvent(event, {
          sequence: state.sequence,
          activeIndex: state.activeIndex,
          completionLatched: state.completionLatched,
          f21Allowed: f21Allowed(),
          f21DegradedAllowed: f21DegradedAllowed()
        });

        state.latestClassification = classification;

        const checkpoint = state.sequence.find((item) => item.id === classification.checkpointId) || null;
        const record = {
          event: clonePlain(event),
          classification: clonePlain(classification),
          at: nowIso()
        };

        if (classification.action === CHECKPOINT_EVENT_ACTIONS.QUEUE) {
          if (!submitOptions.fromQueue) {
            state.queuedEvents.push(record);
            state.futureEventsQueued += 1;
          }

          if (checkpoint) checkpoint.status = CHECKPOINT_STATUS.QUEUED;

          state.firstFailedCoordinate = `WAITING_${classification.activeCheckpointId}`;
          state.recommendedNextRenewalTarget = "complete-active-checkpoint-first";
        }

        if (classification.action === CHECKPOINT_EVENT_ACTIONS.ARCHIVE) {
          state.archivedEvents.push(record);
          state.duplicateEventsArchived += 1;
          if (classification.gapClass === GAP_CLASS.PROGRESS_ONLY) {
            state.progressOnlyEventsArchived += 1;
          }
        }

        if (classification.action === CHECKPOINT_EVENT_ACTIONS.BLOCK) {
          state.blockedEvents.push(record);
          state.regressionPrevented += 1;
          if (checkpoint) checkpoint.status = CHECKPOINT_STATUS.BLOCKED;

          const west = getWestApi();
          const gap = west.classifyGap(state.snapshot, {
            checkpointId: checkpoint ? checkpoint.id : classification.checkpointId,
            activeCheckpointId: activeCheckpoint() ? activeCheckpoint().id : "",
            completedCheckpoints: state.completedCheckpoints,
            newsGateState: state.newsGateState,
            event
          });

          setFailureFromGap(gap, classification.reason);

          if (checkpoint && checkpoint.id === "F21_COMPLETION_LATCHED") {
            state.progressCap = 98;
            state.visibleProgress = Math.min(98, Math.max(state.visibleProgress, 98));
            state.readyTextAllowed = false;
          }
        }

        if (classification.action === CHECKPOINT_EVENT_ACTIONS.ADMIT) {
          state.admittedEvents.push(record);

          if (checkpoint) {
            checkpoint.status = CHECKPOINT_STATUS.ACTIVE;
            state.visibleProgress = Math.max(state.visibleProgress, progressForCheckpoint(checkpoint));

            const decision = completionDecision(checkpoint, event);

            if (decision.complete) {
              completeCheckpoint(checkpoint, event, decision.degraded, decision.gap);

              if (decision.degraded) {
                state.degradedForwardEvents.push({
                  event: clonePlain(event),
                  checkpointId: checkpoint.id,
                  gap: clonePlain(decision.gap),
                  at: nowIso()
                });

                classification.action = CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD;
                classification.gapClass = GAP_CLASS.DEGRADED_GAP;
              }
            } else if (decision.gap) {
              setFailureFromGap(decision.gap, `WAITING_${checkpoint.id}`);
            }
          }
        }

        if (state.admittedEvents.length > 300) state.admittedEvents.splice(0, state.admittedEvents.length - 300);
        if (state.queuedEvents.length > 300) state.queuedEvents.splice(0, state.queuedEvents.length - 300);
        if (state.archivedEvents.length > 300) state.archivedEvents.splice(0, state.archivedEvents.length - 300);
        if (state.blockedEvents.length > 300) state.blockedEvents.splice(0, state.blockedEvents.length - 300);
        if (state.degradedForwardEvents.length > 300) state.degradedForwardEvents.splice(0, state.degradedForwardEvents.length - 300);

        if (!state.completionLatched) {
          state.progressCap = 98;
          state.visibleProgress = Math.min(98, state.visibleProgress);
          state.readyTextAllowed = false;
          reconcileActive("post-submit-reconcile");
        }

        updateNews(state.snapshot);
        if (!state.completionLatched) setFirstFailureFromActive();
        state.updatedAt = nowIso();

        return {
          ...classification,
          sessionId: state.sessionId,
          activeCheckpoint: clonePlain(activeCheckpoint()),
          completionLatched: state.completionLatched,
          degradedCompletionLatched: state.degradedCompletionLatched,
          visibleProgress: state.visibleProgress,
          progressCap: state.progressCap,
          readyTextAllowed: state.readyTextAllowed,
          firstFailedCoordinate: state.firstFailedCoordinate,
          recommendedNextRenewalTarget: state.recommendedNextRenewalTarget
        };
      }

      function submitMany(events = []) {
        return asArray(events).map((event) => submitEvent(event));
      }

      function completeActive(event = {}) {
        const active = activeCheckpoint();
        if (!active) return null;
        return submitEvent({
          ...event,
          id: active.event,
          checkpointId: active.id,
          event: active.event
        });
      }

      function canAdvanceTo(checkpointId) {
        const target = state.sequence.find((checkpoint) => checkpoint.id === checkpointId);
        const active = activeCheckpoint();
        if (!target || !active) return false;
        return target.rank <= active.rank + 1;
      }

      function getActiveCheckpoint() {
        reconcileActive("get-active-checkpoint");
        return clonePlain(activeCheckpoint());
      }

      function getCheckpointState() {
        reconcileActive("get-checkpoint-state");
        return clonePlain(state.sequence);
      }

      function getNewsGateState() {
        updateNews(state.snapshot);
        return clonePlain(state.newsGateState);
      }

      function reset() {
        state.activeIndex = 0;
        state.highestCompletedIndex = -1;
        state.completedCheckpoints = [];
        state.degradedCheckpoints = [];
        state.queuedEvents = [];
        state.archivedEvents = [];
        state.blockedEvents = [];
        state.admittedEvents = [];
        state.degradedForwardEvents = [];
        state.regressionPrevented = 0;
        state.futureEventsQueued = 0;
        state.duplicateEventsArchived = 0;
        state.progressOnlyEventsArchived = 0;
        state.f13Events = [];
        state.completionLatched = false;
        state.degradedCompletionLatched = false;
        state.progressCap = 98;
        state.visibleProgress = 0;
        state.readyTextAllowed = false;
        state.firstFailedCoordinate = "CHECKPOINT_SESSION_RESET";
        state.recommendedNextRenewalTarget = "submit-first-checkpoint";
        state.updatedAt = nowIso();

        state.sequence.forEach((checkpoint) => {
          checkpoint.complete = false;
          checkpoint.degraded = false;
          checkpoint.status = CHECKPOINT_STATUS.PENDING;
          delete checkpoint.completedAt;
        });

        if (state.sequence[0]) state.sequence[0].status = CHECKPOINT_STATUS.ACTIVE;

        return getReceipt();
      }

      function getReceipt() {
        reconcileActive("get-receipt");
        updateNews(state.snapshot);

        const active = activeCheckpoint();
        const highestCompleted = state.sequence[state.highestCompletedIndex] || null;
        const f21IsAllowed = f21Allowed();
        const f21IsDegradedAllowed = f21DegradedAllowed();
        const south = getSouthApi();
        const visibleState = south.composeVisibleState({
          state,
          active,
          highestCompleted,
          newsGateState: state.newsGateState,
          latestGap: state.latestGap
        });

        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          checkpointSessionContract: "LAB_RUNTIME_TABLE_CARDINAL_NORTH_CHECKPOINT_SESSION_v1",
          checkpointSessionReceipt: "LAB_RUNTIME_TABLE_CARDINAL_NORTH_CHECKPOINT_SESSION_RECEIPT_v1",
          sessionId: state.sessionId,
          planetId: state.planetId,
          planetLabel: state.planetLabel,
          route: state.route,

          northPrecedent: true,
          cardinalSplitActive: true,
          northLoaded: true,
          eastLoaded: cardinalState.eastLoaded,
          westLoaded: cardinalState.westLoaded,
          southLoaded: cardinalState.southLoaded,
          eastFallbackUsed: cardinalState.eastFallbackUsed,
          westFallbackUsed: cardinalState.westFallbackUsed,
          southFallbackUsed: cardinalState.southFallbackUsed,
          hearthConsumesNorthOnly: true,

          checkpointGovernorActive: true,
          chronologicalCheckpointSession: true,
          chronologicalFibonacciAlignment: true,
          newsFibonacciAlignment: true,
          oneActiveCheckpointAtATime: true,
          futureEventsQueued: true,
          completedEventsArchived: true,
          progressOnlyEventsArchived: true,
          regressiveEventsBlocked: true,
          degradedForwardAvailable: true,
          hardBlockReservedForStructuralOrFalseCompletion: true,
          blockedProgressCap: 98,
          readyTextRequiresCompletionLatch: true,
          f13CompoundSequenceEnforced: true,
          f13MVisibleContentProofOrDegradedForwardRequired: true,
          f13NInspectModeOrDegradedForwardRequired: true,
          newsGatesRequiredBeforeF21: true,

          activeCheckpointId: active ? active.id : "",
          activeCheckpointRank: active ? active.rank : 0,
          activeCheckpointLabel: active ? active.label : "",
          activeFibonacciStage: active ? active.fibonacci : "",
          highestCompletedCheckpointId: highestCompleted ? highestCompleted.id : "",
          highestCompletedRank: highestCompleted ? highestCompleted.rank : 0,

          completionLatched: state.completionLatched,
          degradedCompletionLatched: state.degradedCompletionLatched,
          readyTextAllowed: state.readyTextAllowed,
          visibleProgress: visibleState.visibleProgress,
          progressCap: visibleState.progressCap,
          mainProgressCap: visibleState.progressCap,
          postgameStatus: visibleState.postgameStatus,
          visibleStatusText: visibleState.visibleStatusText,

          queuedEventsCount: state.queuedEvents.length,
          archivedEventsCount: state.archivedEvents.length,
          blockedEventsCount: state.blockedEvents.length,
          admittedEventsCount: state.admittedEvents.length,
          degradedForwardEventsCount: state.degradedForwardEvents.length,
          regressionPrevented: state.regressionPrevented,
          futureEventsQueuedCount: state.futureEventsQueued,
          duplicateEventsArchived: state.duplicateEventsArchived,
          progressOnlyEventsArchivedCount: state.progressOnlyEventsArchived,

          newsGateState: clonePlain(state.newsGateState),
          northGateReady: state.newsGateState.northGateReady,
          eastGateReady: state.newsGateState.eastGateReady,
          westGateReady: state.newsGateState.westGateReady,
          southGateReady: state.newsGateState.southGateReady,
          newsGatePassedBeforeF21: state.newsGateState.newsGatePassedBeforeF21,
          northGateDegradedReady: state.newsGateState.northGateDegradedReady,
          westGateDegradedReady: state.newsGateState.westGateDegradedReady,
          southGateDegradedReady: state.newsGateState.southGateDegradedReady,
          newsGateDegradedBeforeF21: state.newsGateState.newsGateDegradedBeforeF21,

          f13SubsequenceComplete: f13SubsequenceComplete(),
          f13LastRequiredEvent: f13LastRequiredEvent(),
          f13Events: clonePlain(state.f13Events),
          f21Allowed: f21IsAllowed,
          f21DegradedAllowed: f21IsDegradedAllowed,

          firstFailedCoordinate: visibleState.firstFailedCoordinate,
          recommendedNextRenewalTarget: visibleState.recommendedNextRenewalTarget,
          latestClassification: clonePlain(state.latestClassification),
          latestGap: clonePlain(state.latestGap),

          completedCheckpoints: clonePlain(state.completedCheckpoints),
          degradedCheckpoints: clonePlain(state.degradedCheckpoints),
          queuedEvents: clonePlain(state.queuedEvents),
          archivedEvents: clonePlain(state.archivedEvents),
          blockedEvents: clonePlain(state.blockedEvents),
          admittedEvents: clonePlain(state.admittedEvents.slice(-80)),
          degradedForwardEvents: clonePlain(state.degradedForwardEvents.slice(-80)),
          sequence: clonePlain(state.sequence),
          snapshot: clonePlain(state.snapshot),
          errors: clonePlain(state.errors),

          constructionReady: true,
          imageRendered: safeBool(state.snapshot.imageRendered, false),
          coherentExpressionPass: state.degradedCompletionLatched ? "degraded" : state.completionLatched,
          visualPassClaimed: false,
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          createdAt: state.createdAt,
          updatedAt: state.updatedAt
        };
      }

      function getReceiptText() {
        const receipt = getReceipt();
        return getSouthApi().composeReceiptText(receipt);
      }

      if (state.sequence[0]) state.sequence[0].status = CHECKPOINT_STATUS.ACTIVE;

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        sessionId: state.sessionId,
        submitEvent,
        submitMany,
        completeActive,
        canAdvanceTo,
        getActiveCheckpoint,
        getCheckpointState,
        getNewsGateState,
        getReceipt,
        getReceiptText,
        reset,
        get state() {
          return state;
        }
      };
    }

    function createHearthCheckpointSession(options = {}) {
      return createCheckpointSession(FIBONACCI_CHECKPOINTS, {
        planetId: "hearth",
        planetLabel: "Hearth",
        route: "/showroom/globe/hearth/",
        constraintSemiconductor: "/showroom/globe/hearth/index.js",
        coherenceSemiconductor: "/showroom/globe/hearth/hearth.js",
        canvasAuthority: "/assets/hearth/hearth.canvas.js",
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        ...options
      });
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      role: "east-fallback-chronological-checkpoint-motion",
      fallback: true,
      createChronologicalFibonacciPlan,
      createNewsFibonacciCheckpointPlan,
      classifyCheckpointEvent,
      createCheckpointSession,
      createHearthCheckpointSession,
      evaluateNewsGateState,
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          role: "east-fallback",
          eastFallbackUsed: true,
          chronologicalFibonacciAlignment: true,
          oneActiveCheckpointAtATime: true,
          degradedForwardAvailable: true,
          hardBlockReservedForStructuralOrFalseCompletion: true,
          visualPassClaimed: false,
          updatedAt: nowIso()
        };
      }
    };
  }

  function createWestFallback() {
    function classifyGap(snapshot = {}, context = {}) {
      const checkpointId = context.checkpointId || "";
      const event = context.event || {};
      const eventName = event.event || event.id || event.phase || "";
      const completed = asArray(context.completedCheckpoints);
      const news = context.newsGateState || {};

      if (isProgressOnlyEventName(eventName)) {
        return {
          gapClass: GAP_CLASS.PROGRESS_ONLY,
          hardBlock: false,
          canDegradeForward: true,
          severity: STATUS.HELD,
          firstFailedCoordinate: "PROGRESS_ONLY_EVENT_ARCHIVED",
          recommendedNextRenewalTarget: "none",
          reason: "Progress-only event does not mutate checkpoint truth."
        };
      }

      if (isFalseCompletionMutation(event) && checkpointId !== "F21_COMPLETION_LATCHED") {
        return {
          gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
          hardBlock: true,
          canDegradeForward: false,
          severity: STATUS.BLOCKING,
          firstFailedCoordinate: "FALSE_COMPLETION_MUTATION_BLOCKED",
          recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
          reason: "Event attempted false ready/100/visual pass before lawful F21."
        };
      }

      if (!hasStructuralCarrier(snapshot)) {
        return {
          gapClass: GAP_CLASS.STRUCTURAL_BLOCK,
          hardBlock: true,
          canDegradeForward: false,
          severity: STATUS.BLOCKING,
          firstFailedCoordinate: "STRUCTURAL_CARRIER_MISSING_OR_UNSAFE",
          recommendedNextRenewalTarget: "/showroom/globe/hearth/index.js",
          reason: "Carrier or canvas structure is missing or unsafe."
        };
      }

      if (checkpointId === "F13M_VISIBLE_CONTENT_PROOF_PASSED") {
        if (safeBool(snapshot.visibleContentProof)) {
          return {
            gapClass: GAP_CLASS.NONE,
            hardBlock: false,
            canDegradeForward: false,
            severity: STATUS.READY,
            firstFailedCoordinate: "NONE_VISIBLE_CONTENT_PROOF_PASSED",
            recommendedNextRenewalTarget: "none",
            reason: "Visible content proof passed."
          };
        }

        if (hasVisibleSurfaceSignal(snapshot)) {
          return {
            gapClass: GAP_CLASS.DEGRADED_GAP,
            hardBlock: false,
            canDegradeForward: true,
            severity: STATUS.DEGRADED,
            firstFailedCoordinate: "DEGRADED_VISIBLE_CONTENT_CARRIER_HEAVY_BUT_SURFACE_SIGNAL_EXISTS",
            recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
            reason: "Visible content is carrier-heavy but nonblank surface classes exist; forward progress is lawful with degraded receipt."
          };
        }

        return {
          gapClass: GAP_CLASS.STRUCTURAL_BLOCK,
          hardBlock: true,
          canDegradeForward: false,
          severity: STATUS.BLOCKING,
          firstFailedCoordinate: "VISIBLE_CONTENT_ABSENT",
          recommendedNextRenewalTarget: "/assets/hearth/hearth.canvas.js",
          reason: "Visible content proof failed and no usable surface signal exists."
        };
      }

      if (checkpointId === "F13N_INSPECT_MODE_READY") {
        const fullInspect = Boolean(
          safeBool(snapshot.inspectModeAvailable) &&
          safeBool(snapshot.inspectPlanetControlAvailable) &&
          safeBool(snapshot.diagnosticCanLeavePlanetFrame) &&
          safeBool(snapshot.buttonsReachable)
        );

        if (fullInspect) {
          return {
            gapClass: GAP_CLASS.NONE,
            hardBlock: false,
            canDegradeForward: false,
            severity: STATUS.READY,
            firstFailedCoordinate: "NONE_INSPECT_MODE_READY",
            recommendedNextRenewalTarget: "none",
            reason: "Inspect mode is fully ready."
          };
        }

        if (hasInspectFallbackSignal(snapshot)) {
          return {
            gapClass: GAP_CLASS.DEGRADED_GAP,
            hardBlock: false,
            canDegradeForward: true,
            severity: STATUS.DEGRADED,
            firstFailedCoordinate: "DEGRADED_INSPECT_MODE_COPY_RECEIPT_AVAILABLE",
            recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
            reason: "Inspect controls are incomplete, but receipt/copy diagnostic remains available; forward progress is lawful with degraded receipt."
          };
        }

        return {
          gapClass: GAP_CLASS.DIAGNOSTIC_BLOCK,
          hardBlock: true,
          canDegradeForward: false,
          severity: STATUS.BLOCKING,
          firstFailedCoordinate: "INSPECT_AND_RECEIPT_ACCESS_MISSING",
          recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
          reason: "Inspect mode and receipt fallback are both unavailable."
        };
      }

      if (checkpointId === "F21_COMPLETION_LATCHED") {
        if (completed.includes("F13N_INSPECT_MODE_READY") && news.newsGatePassedBeforeF21) {
          return {
            gapClass: GAP_CLASS.NONE,
            hardBlock: false,
            canDegradeForward: false,
            severity: STATUS.READY,
            firstFailedCoordinate: "NONE_F21_FULL_LATCH_READY",
            recommendedNextRenewalTarget: "read-postgame-canvas-or-triple-g-receipt",
            reason: "Full F21 latch is lawful."
          };
        }

        if (completed.includes("F13N_INSPECT_MODE_READY") && news.newsGateDegradedBeforeF21) {
          return {
            gapClass: GAP_CLASS.DEGRADED_GAP,
            hardBlock: false,
            canDegradeForward: true,
            severity: STATUS.DEGRADED,
            firstFailedCoordinate: "DEGRADED_F21_NEWS_GATE_FORWARD_ALLOWED",
            recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
            reason: "F21 is not full-pass, but NEWS degraded-forward gates are sufficient and no structural block remains."
          };
        }

        return {
          gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
          hardBlock: true,
          canDegradeForward: false,
          severity: STATUS.BLOCKING,
          firstFailedCoordinate: "F21_BLOCKED_NEWS_OR_F13N_INCOMPLETE",
          recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
          reason: "F21 attempted before F13N and NEWS gates were resolved."
        };
      }

      return {
        gapClass: GAP_CLASS.NONE,
        hardBlock: false,
        canDegradeForward: false,
        severity: STATUS.READY,
        firstFailedCoordinate: checkpointId ? `WAITING_${checkpointId}` : "NONE",
        recommendedNextRenewalTarget: "none",
        reason: "No hard gap detected."
      };
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      role: "west-fallback-gap-classification",
      fallback: true,
      classifyGap,
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          role: "west-fallback",
          westFallbackUsed: true,
          gapClassificationActive: true,
          degradedForwardAvailable: true,
          hardBlockReservedForStructuralOrFalseCompletion: true,
          visualPassClaimed: false,
          updatedAt: nowIso()
        };
      }
    };
  }

  function createSouthFallback() {
    function composeVisibleState(input = {}) {
      const state = input.state || {};
      const active = input.active || null;
      const latestGap = input.latestGap || null;

      let progressCap = state.completionLatched ? 100 : 98;
      let visibleProgress = state.completionLatched ? 100 : Math.min(98, safeNumber(state.visibleProgress, 0));

      let postgameStatus = "LOADING_CHECKPOINTS_ACTIVE";
      let visibleStatusText = active ? `Loading ${active.label || active.id}` : "Loading";

      if (state.completionLatched && state.degradedCompletionLatched) {
        postgameStatus = "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
        visibleStatusText = "Ready with diagnostic gaps";
      } else if (state.completionLatched) {
        postgameStatus = "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
        visibleStatusText = "Ready";
      } else if (latestGap && latestGap.hardBlock) {
        postgameStatus = `BLOCKED_${latestGap.firstFailedCoordinate || "CHECKPOINT"}`;
        visibleStatusText = "Blocked by structural checkpoint";
      } else if (latestGap && latestGap.gapClass === GAP_CLASS.DEGRADED_GAP) {
        postgameStatus = `DEGRADED_FORWARD_${latestGap.firstFailedCoordinate || "CHECKPOINT"}`;
        visibleStatusText = "Continuing with diagnostic gap";
      } else if (active) {
        postgameStatus = `WAITING_${active.id}`;
      }

      let firstFailedCoordinate = state.firstFailedCoordinate || "NONE";
      let recommendedNextRenewalTarget = state.recommendedNextRenewalTarget || "none";

      if (state.completionLatched && state.degradedCompletionLatched) {
        firstFailedCoordinate = "DEGRADED_F21_LATCHED_WITH_GAP_RECEIPT";
        recommendedNextRenewalTarget = recommendedNextRenewalTarget === "none"
          ? "/showroom/globe/hearth/hearth.js"
          : recommendedNextRenewalTarget;
      } else if (state.completionLatched) {
        firstFailedCoordinate = "NONE_F21_FULL_LATCHED";
        recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
      }

      return {
        progressCap,
        visibleProgress,
        postgameStatus,
        visibleStatusText,
        firstFailedCoordinate,
        recommendedNextRenewalTarget
      };
    }

    function composeReceiptText(receipt = {}) {
      const sequenceText = Array.isArray(receipt.sequence)
        ? receipt.sequence.map((checkpoint) => (
          `- ${checkpoint.id}: rank=${checkpoint.rank}; fibonacci=${checkpoint.fibonacci}; status=${checkpoint.status}; complete=${checkpoint.complete === true}; degraded=${checkpoint.degraded === true}; progress=${checkpoint.progress}; event=${checkpoint.event}`
        )).join("\n")
        : "- none";

      const archived = Array.isArray(receipt.archivedEvents)
        ? receipt.archivedEvents.map((item) => (
          `- ${item.at} :: ${item.classification && item.classification.checkpointId ? item.classification.checkpointId : ""} :: ${item.classification && item.classification.reason ? item.classification.reason : ""}`
        )).join("\n") || "- none"
        : "- none";

      const blocked = Array.isArray(receipt.blockedEvents)
        ? receipt.blockedEvents.map((item) => (
          `- ${item.at} :: ${item.classification && item.classification.checkpointId ? item.classification.checkpointId : ""} :: ${item.classification && item.classification.reason ? item.classification.reason : ""}`
        )).join("\n") || "- none"
        : "- none";

      return [
        "LAB_RUNTIME_TABLE_CARDINAL_NORTH_CHECKPOINT_SESSION_RECEIPT",
        "",
        `contract=${receipt.contract}`,
        `receipt=${receipt.receipt}`,
        `sessionId=${receipt.sessionId}`,
        `planetId=${receipt.planetId}`,
        `route=${receipt.route}`,
        "",
        `northPrecedent=${receipt.northPrecedent}`,
        `cardinalSplitActive=${receipt.cardinalSplitActive}`,
        `northLoaded=${receipt.northLoaded}`,
        `eastLoaded=${receipt.eastLoaded}`,
        `westLoaded=${receipt.westLoaded}`,
        `southLoaded=${receipt.southLoaded}`,
        `eastFallbackUsed=${receipt.eastFallbackUsed}`,
        `westFallbackUsed=${receipt.westFallbackUsed}`,
        `southFallbackUsed=${receipt.southFallbackUsed}`,
        `hearthConsumesNorthOnly=${receipt.hearthConsumesNorthOnly}`,
        "",
        `checkpointGovernorActive=${receipt.checkpointGovernorActive}`,
        `chronologicalFibonacciAlignment=${receipt.chronologicalFibonacciAlignment}`,
        `newsFibonacciAlignment=${receipt.newsFibonacciAlignment}`,
        `oneActiveCheckpointAtATime=${receipt.oneActiveCheckpointAtATime}`,
        `futureEventsQueued=${receipt.futureEventsQueued}`,
        `completedEventsArchived=${receipt.completedEventsArchived}`,
        `progressOnlyEventsArchived=${receipt.progressOnlyEventsArchived}`,
        `regressiveEventsBlocked=${receipt.regressiveEventsBlocked}`,
        `degradedForwardAvailable=${receipt.degradedForwardAvailable}`,
        `hardBlockReservedForStructuralOrFalseCompletion=${receipt.hardBlockReservedForStructuralOrFalseCompletion}`,
        `blockedProgressCap=${receipt.blockedProgressCap}`,
        `readyTextRequiresCompletionLatch=${receipt.readyTextRequiresCompletionLatch}`,
        "",
        `activeCheckpointId=${receipt.activeCheckpointId}`,
        `activeCheckpointRank=${receipt.activeCheckpointRank}`,
        `activeFibonacciStage=${receipt.activeFibonacciStage}`,
        `highestCompletedCheckpointId=${receipt.highestCompletedCheckpointId}`,
        `highestCompletedRank=${receipt.highestCompletedRank}`,
        "",
        `completionLatched=${receipt.completionLatched}`,
        `degradedCompletionLatched=${receipt.degradedCompletionLatched}`,
        `visibleProgress=${receipt.visibleProgress}`,
        `progressCap=${receipt.progressCap}`,
        `postgameStatus=${receipt.postgameStatus}`,
        `visibleStatusText=${receipt.visibleStatusText}`,
        "",
        `northGateReady=${receipt.northGateReady}`,
        `eastGateReady=${receipt.eastGateReady}`,
        `westGateReady=${receipt.westGateReady}`,
        `southGateReady=${receipt.southGateReady}`,
        `newsGatePassedBeforeF21=${receipt.newsGatePassedBeforeF21}`,
        `northGateDegradedReady=${receipt.northGateDegradedReady}`,
        `westGateDegradedReady=${receipt.westGateDegradedReady}`,
        `southGateDegradedReady=${receipt.southGateDegradedReady}`,
        `newsGateDegradedBeforeF21=${receipt.newsGateDegradedBeforeF21}`,
        "",
        `f13SubsequenceComplete=${receipt.f13SubsequenceComplete}`,
        `f13LastRequiredEvent=${receipt.f13LastRequiredEvent}`,
        `f21Allowed=${receipt.f21Allowed}`,
        `f21DegradedAllowed=${receipt.f21DegradedAllowed}`,
        "",
        `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
        `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
        "",
        `queuedEventsCount=${receipt.queuedEventsCount}`,
        `archivedEventsCount=${receipt.archivedEventsCount}`,
        `blockedEventsCount=${receipt.blockedEventsCount}`,
        `admittedEventsCount=${receipt.admittedEventsCount}`,
        `degradedForwardEventsCount=${receipt.degradedForwardEventsCount}`,
        `regressionPrevented=${receipt.regressionPrevented}`,
        `duplicateEventsArchived=${receipt.duplicateEventsArchived}`,
        `progressOnlyEventsArchivedCount=${receipt.progressOnlyEventsArchivedCount}`,
        "",
        "CHECKPOINT_SEQUENCE",
        sequenceText,
        "",
        "ARCHIVED_EVENTS",
        archived,
        "",
        "BLOCKED_EVENTS",
        blocked,
        "",
        `constructionReady=${receipt.constructionReady}`,
        `imageRendered=${receipt.imageRendered}`,
        `coherentExpressionPass=${receipt.coherentExpressionPass}`,
        `generatedImage=${receipt.generatedImage}`,
        `graphicBox=${receipt.graphicBox}`,
        `webGL=${receipt.webGL}`,
        `visualPassClaimed=${receipt.visualPassClaimed}`,
        "",
        `updatedAt=${receipt.updatedAt}`
      ].join("\n");
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      role: "south-fallback-visible-state-and-receipt-composition",
      fallback: true,
      composeVisibleState,
      composeReceiptText,
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          role: "south-fallback",
          southFallbackUsed: true,
          visibleStateCompositionActive: true,
          postgameCoordinateFixActive: true,
          visualPassClaimed: false,
          updatedAt: nowIso()
        };
      }
    };
  }

  const eastFallback = createEastFallback();
  const westFallback = createWestFallback();
  const southFallback = createSouthFallback();

  function bindCardinalBranches() {
    const east =
      root.LAB_RUNTIME_TABLE_EAST ||
      root.RUNTIME_TABLE_EAST ||
      root.DEXTER_LAB_RUNTIME_TABLE_EAST ||
      null;

    const west =
      root.LAB_RUNTIME_TABLE_WEST ||
      root.RUNTIME_TABLE_WEST ||
      root.DEXTER_LAB_RUNTIME_TABLE_WEST ||
      null;

    const south =
      root.LAB_RUNTIME_TABLE_SOUTH ||
      root.RUNTIME_TABLE_SOUTH ||
      root.DEXTER_LAB_RUNTIME_TABLE_SOUTH ||
      null;

    cardinalState.branches.east = east || eastFallback;
    cardinalState.branches.west = west || westFallback;
    cardinalState.branches.south = south || southFallback;

    cardinalState.eastLoaded = Boolean(east);
    cardinalState.westLoaded = Boolean(west);
    cardinalState.southLoaded = Boolean(south);

    cardinalState.eastFallbackUsed = !east;
    cardinalState.westFallbackUsed = !west;
    cardinalState.southFallbackUsed = !south;

    cardinalState.lastBindAt = nowIso();

    return getCardinalReceipt();
  }

  function getEastBranch() {
    bindCardinalBranches();
    return cardinalState.branches.east || eastFallback;
  }

  function getWestBranch() {
    bindCardinalBranches();
    return cardinalState.branches.west || westFallback;
  }

  function getSouthBranch() {
    bindCardinalBranches();
    return cardinalState.branches.south || southFallback;
  }

  function loadCardinalBranchScripts() {
    if (cardinalState.attemptedScriptLoad) return;
    cardinalState.attemptedScriptLoad = true;

    if (!root.document || !root.document.head) return;

    Object.keys(BRANCH_PATHS).forEach((key) => {
      const id = `lab-runtime-table-${key}-branch`;

      if (root.document.getElementById(id)) return;

      const script = root.document.createElement("script");
      script.id = id;
      script.async = false;
      script.defer = false;
      script.src = `${BRANCH_PATHS[key]}?v=${encodeURIComponent(CONTRACT)}`;

      script.onload = () => {
        bindCardinalBranches();
      };

      script.onerror = () => {
        cardinalState[`${key}Error`] = `Unable to load ${BRANCH_PATHS[key]}; North fallback remains active.`;
        cardinalState[`${key}FallbackUsed`] = true;
        bindCardinalBranches();
      };

      root.document.head.appendChild(script);
    });
  }

  function getCardinalReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-cardinal-north-precedent-facade",
      northPrecedent: true,
      cardinalSplitActive: true,
      northLoaded: true,
      eastLoaded: cardinalState.eastLoaded,
      westLoaded: cardinalState.westLoaded,
      southLoaded: cardinalState.southLoaded,
      eastFallbackUsed: cardinalState.eastFallbackUsed,
      westFallbackUsed: cardinalState.westFallbackUsed,
      southFallbackUsed: cardinalState.southFallbackUsed,
      eastError: cardinalState.eastError,
      westError: cardinalState.westError,
      southError: cardinalState.southError,
      branchPaths: clonePlain(BRANCH_PATHS),
      hearthConsumesNorthOnly: true,
      oneActiveCheckpointAtATime: true,
      futureEventsQueued: true,
      completedEventsArchived: true,
      progressOnlyEventsArchived: true,
      degradedForwardAvailable: true,
      hardBlockReservedForStructuralOrFalseCompletion: true,
      f13mSupportsDegradedForward: true,
      f13nSupportsDegradedForward: true,
      f21SupportsDegradedCompletion: true,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function RuntimeTable(options = {}) {
    const tableId = options.id || `runtime-table-${Math.random().toString(36).slice(2, 9)}`;

    const state = {
      id: tableId,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      registrations: [],
      records: [],
      ledger: [],
      handoff: HANDOFF.BLOCKING,
      runtimeAllowed: false,
      lastSamplePoint: null,
      status: STATUS.PENDING,
      budget: normalizeBudget(options.budget || {}),
      tableSet: false,
      canvasDecidesTruth: false,
      runtimeTable: true,
      planetId: options.planetId || "",
      planetLabel: options.planetLabel || ""
    };

    function log(event, detail = {}) {
      const entry = {
        event,
        detail: clonePlain(detail),
        at: nowIso()
      };

      state.ledger.push(entry);
      state.updatedAt = entry.at;
      return entry;
    }

    function registerChild(registration = {}) {
      const record = {
        key: registration.key || registration.name || `child-${state.registrations.length + 1}`,
        name: registration.name || registration.key || `Child ${state.registrations.length + 1}`,
        planetId: registration.planetId || state.planetId || "",
        channelType: registration.channelType || registration.key || "",
        expectedContract: registration.expectedContract || registration.contract || "",
        globalName: registration.globalName || "",
        requiredMethods: asArray(registration.requiredMethods).length ? asArray(registration.requiredMethods) : ["sample", "read"],
        requiredCoordinates: asArray(registration.requiredCoordinates).length ? asArray(registration.requiredCoordinates) : DEFAULT_COORDINATES.slice(),
        laws: asArray(registration.laws),
        budget: normalizeBudget(registration.budget || state.budget),
        sampleFailureBlocking: registration.sampleFailureBlocking === true,
        canFallback: registration.canFallback !== false,
        canDegrade: registration.canDegrade !== false,
        authority: registration.authority || null,
        resolve: registration.resolve || null,
        metadata: clonePlain(registration.metadata || {})
      };

      state.registrations.push(record);

      log("REGISTER_CHILD", {
        key: record.key,
        planetId: record.planetId,
        channelType: record.channelType,
        expectedContract: record.expectedContract,
        requiredMethods: record.requiredMethods,
        requiredCoordinates: record.requiredCoordinates
      });

      return record;
    }

    function validateChild(registration, samplePoint = {}) {
      const authority = resolveAuthority(registration);
      const issues = [];

      if (!authority) {
        const severity = registration.canFallback ? STATUS.FALLBACK : STATUS.BLOCKING;
        issues.push(createIssue(
          "CHILD_MISSING",
          `${registration.name || registration.key} missing or unavailable.`,
          severity,
          { key: registration.key, globalName: registration.globalName }
        ));

        const optimization = optimizeBudget(severity, registration.budget);

        return {
          key: registration.key,
          name: registration.name,
          planetId: registration.planetId || "",
          channelType: registration.channelType || registration.key,
          status: optimization.status,
          rawStatus: severity,
          authorityPresent: false,
          contractOk: false,
          expectedContract: registration.expectedContract || "",
          actualContract: "",
          methodsOk: false,
          coordinatesOk: false,
          coordinateMissing: registration.requiredCoordinates.slice(),
          lawsOk: false,
          sampleOk: false,
          sampleMethod: "",
          sample: null,
          receipt: null,
          issues,
          budget: optimization.budget,
          optimizationReason: optimization.reason,
          ready: false,
          optimized: optimization.status === STATUS.OPTIMIZED,
          degraded: severity === STATUS.DEGRADED,
          fallback: severity === STATUS.FALLBACK || optimization.status === STATUS.FALLBACK,
          held: severity === STATUS.HELD || optimization.status === STATUS.HELD,
          rejected: severity === STATUS.REJECTED,
          blocking: severity === STATUS.BLOCKING,
          coordinate: C_COORDINATES.C6_GLOBAL_ACTOR_MISSING,
          at: nowIso()
        };
      }

      const receipt = readReceipt(authority);
      const contract = contractCheck(authority, receipt, registration.expectedContract);

      if (!contract.ok) {
        issues.push(createIssue(
          "WRONG_CONTRACT",
          `${registration.name || registration.key} wrong contract: expected ${contract.expected}, received ${contract.actual || "missing"}.`,
          STATUS.REJECTED,
          contract
        ));
      }

      const methodsOk = hasAnyMethod(authority, registration.requiredMethods);

      if (!methodsOk) {
        issues.push(createIssue(
          "MISSING_SAMPLE_METHOD",
          `${registration.name || registration.key} missing required sample/read method.`,
          registration.sampleFailureBlocking ? STATUS.BLOCKING : STATUS.FALLBACK,
          { requiredMethods: registration.requiredMethods }
        ));
      }

      const sampleResult = methodsOk
        ? sampleAuthority(authority, samplePoint, registration.requiredMethods)
        : { ok: false, method: "", error: "No valid sample/read method." };

      if (!sampleResult.ok) {
        issues.push(createIssue(
          "SAMPLE_FAILED",
          `${registration.name || registration.key} sample failed: ${sampleResult.error}`,
          registration.sampleFailureBlocking ? STATUS.BLOCKING : STATUS.FALLBACK,
          { method: sampleResult.method, error: sampleResult.error }
        ));
      }

      const coordinate = sampleResult.ok
        ? coordinateCheck(sampleResult.sample, registration.requiredCoordinates)
        : { ok: false, missing: registration.requiredCoordinates, required: registration.requiredCoordinates };

      if (sampleResult.ok && !coordinate.ok) {
        issues.push(createIssue(
          "COORDINATE_MISMATCH",
          `${registration.name || registration.key} coordinate frame missing: ${coordinate.missing.join(", ")}.`,
          STATUS.REJECTED,
          coordinate
        ));
      }

      const laws = sampleResult.ok ? lawCheck(sampleResult.sample, registration.laws) : { ok: false, issues: [] };
      issues.push(...laws.issues);

      const rawStatus = decideStatus(issues, sampleResult, registration);
      const optimization = optimizeBudget(rawStatus, registration.budget);

      let childCoordinate = C_COORDINATES.C11_CHILD_VALIDATED;
      if (!contract.ok) childCoordinate = C_COORDINATES.C7_CONTRACT_MISMATCH;
      else if (!methodsOk || !sampleResult.ok) childCoordinate = C_COORDINATES.C8_SAMPLE_API_FAILURE;
      else if (!coordinate.ok) childCoordinate = C_COORDINATES.C9_COORDINATE_PACKET_FAILURE;
      else if (!laws.ok) childCoordinate = C_COORDINATES.C10_AUTHORITY_FLAG_FAILURE;

      return {
        key: registration.key,
        name: registration.name,
        planetId: registration.planetId || "",
        channelType: registration.channelType || registration.key,
        status: optimization.status,
        rawStatus,
        authorityPresent: true,
        contractOk: contract.ok,
        expectedContract: contract.expected,
        actualContract: contract.actual,
        methodsOk,
        coordinatesOk: coordinate.ok,
        coordinateMissing: coordinate.missing,
        lawsOk: laws.ok,
        sampleOk: sampleResult.ok,
        sampleMethod: sampleResult.method,
        sample: sampleResult.ok ? clonePlain(sampleResult.sample) : null,
        receipt: clonePlain(receipt),
        issues,
        budget: optimization.budget,
        optimizationReason: optimization.reason,
        ready: optimization.status === STATUS.READY,
        optimized: optimization.status === STATUS.OPTIMIZED,
        degraded: rawStatus === STATUS.DEGRADED,
        fallback: rawStatus === STATUS.FALLBACK || optimization.status === STATUS.FALLBACK,
        held: rawStatus === STATUS.HELD || optimization.status === STATUS.HELD,
        rejected: rawStatus === STATUS.REJECTED,
        blocking: rawStatus === STATUS.BLOCKING,
        coordinate: childCoordinate,
        at: nowIso()
      };
    }

    function run(samplePoint = {}) {
      state.lastSamplePoint = clonePlain(samplePoint);
      state.records = state.registrations.map((registration) => validateChild(registration, samplePoint));
      state.handoff = resolveHandoff(state.records);
      state.runtimeAllowed = handoffAllowsRuntime(state.handoff);
      state.tableSet = state.runtimeAllowed;
      state.status = state.runtimeAllowed ? STATUS.READY : state.handoff === HANDOFF.REJECTED ? STATUS.REJECTED : STATUS.BLOCKING;
      state.updatedAt = nowIso();

      log("RUN_TABLE", {
        handoff: state.handoff,
        runtimeAllowed: state.runtimeAllowed,
        tableSet: state.tableSet,
        planetId: state.planetId,
        records: state.records.map((record) => ({
          key: record.key,
          channelType: record.channelType,
          status: record.status,
          coordinate: record.coordinate,
          issues: record.issues.map((issue) => issue.code)
        }))
      });

      return reportLedger();
    }

    function reportLedger() {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        id: state.id,
        planetId: state.planetId,
        planetLabel: state.planetLabel,
        status: state.status,
        handoff: state.handoff,
        runtimeAllowed: state.runtimeAllowed,
        tableSet: state.tableSet,
        runtimeTable: true,
        childCount: state.registrations.length,
        records: state.records.map((record) => ({
          key: record.key,
          name: record.name,
          planetId: record.planetId,
          channelType: record.channelType,
          status: record.status,
          rawStatus: record.rawStatus,
          authorityPresent: record.authorityPresent,
          contractOk: record.contractOk,
          expectedContract: record.expectedContract,
          actualContract: record.actualContract,
          methodsOk: record.methodsOk,
          coordinatesOk: record.coordinatesOk,
          coordinateMissing: record.coordinateMissing,
          lawsOk: record.lawsOk,
          sampleOk: record.sampleOk,
          sampleMethod: record.sampleMethod,
          coordinate: record.coordinate,
          issues: record.issues.map((issue) => ({
            code: issue.code,
            message: issue.message,
            severity: issue.severity,
            detail: issue.detail
          })),
          budget: record.budget,
          optimizationReason: record.optimizationReason,
          ready: record.ready,
          optimized: record.optimized,
          degraded: record.degraded,
          fallback: record.fallback,
          held: record.held,
          rejected: record.rejected,
          blocking: record.blocking,
          sample: clonePlain(record.sample),
          receipt: clonePlain(record.receipt)
        })),
        ledger: clonePlain(state.ledger),
        lastSamplePoint: clonePlain(state.lastSamplePoint),
        updatedAt: state.updatedAt,
        canvasDecidesTruth: false,
        cardinalSplitActive: true,
        northPrecedent: true,
        visualPassClaimed: false
      };
    }

    function allowHandoff() {
      const result = reportLedger();
      return {
        allowed: result.runtimeAllowed,
        handoff: result.handoff,
        reason: result.runtimeAllowed ? "Runtime Table set." : "Runtime Table not set.",
        ledger: result
      };
    }

    function rejectHandoff(reason = "Manual rejection.") {
      state.handoff = HANDOFF.REJECTED;
      state.runtimeAllowed = false;
      state.tableSet = false;
      state.status = STATUS.REJECTED;
      log("MANUAL_REJECT_HANDOFF", { reason });
      return reportLedger();
    }

    function fallbackHandoff(reason = "Manual fallback handoff.") {
      state.handoff = HANDOFF.FALLBACK_PASS;
      state.runtimeAllowed = true;
      state.tableSet = true;
      state.status = STATUS.READY;
      log("MANUAL_FALLBACK_HANDOFF", { reason });
      return reportLedger();
    }

    function setBudget(nextBudget = {}) {
      state.budget = normalizeBudget({ ...state.budget, ...nextBudget });
      log("SET_BUDGET", state.budget);
      return state.budget;
    }

    function reset() {
      state.records = [];
      state.ledger = [];
      state.handoff = HANDOFF.BLOCKING;
      state.runtimeAllowed = false;
      state.status = STATUS.PENDING;
      state.tableSet = false;
      state.lastSamplePoint = null;
      state.updatedAt = nowIso();
      log("RESET_TABLE", { id: state.id });
      return reportLedger();
    }

    function createPlan(input = {}, planOptions = {}) {
      const ledger = state.records.length ? reportLedger() : run(input.samplePoint || DEFAULT_SAMPLE_POINT);
      return createUniversalPlanetVisualCarrierPlan({ ...input, runtimeTableLedger: ledger }, planOptions);
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      id: state.id,
      registerChild,
      validateChild,
      run,
      reportLedger,
      allowHandoff,
      rejectHandoff,
      fallbackHandoff,
      setBudget,
      reset,
      createPlan,
      get state() {
        return state;
      },
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          previousContract: PREVIOUS_CONTRACT,
          baselineContract: BASELINE_CONTRACT,
          version: VERSION,
          authority: "lab-runtime-table-north-standard-instance",
          id: state.id,
          planetId: state.planetId,
          planetLabel: state.planetLabel,
          runtimeTable: true,
          tableSet: state.tableSet,
          handoff: state.handoff,
          runtimeAllowed: state.runtimeAllowed,
          status: state.status,
          childCount: state.registrations.length,
          doesNotOwnTruth: true,
          validatesBeforeExpression: true,
          coordinatesBeforeRuntimePerforms: true,
          visualCarrierPlanAuthority: true,
          atlasStartPlanAuthority: true,
          checkpointGovernorAvailable: true,
          cardinalSplitActive: true,
          northPrecedent: true,
          eastFallbackUsed: cardinalState.eastFallbackUsed,
          westFallbackUsed: cardinalState.westFallbackUsed,
          southFallbackUsed: cardinalState.southFallbackUsed,
          chronologicalFibonacciAlignment: true,
          newsFibonacciAlignment: true,
          wideProbeDeferred: true,
          visualPassClaimed: false
        };
      }
    };
  }

  function createTable(options = {}) {
    return RuntimeTable(options);
  }

  function normalizeChannelRegistration(channel = {}, planet = {}) {
    const key = channel.key || channel.channel || channel.name || "";
    const normalizedKey = key || `channel-${Math.random().toString(36).slice(2, 7)}`;

    return {
      key: normalizedKey,
      name: channel.name || `${planet.label || planet.id || "Planet"} ${normalizedKey} Channel`,
      planetId: channel.planetId || planet.id || "",
      channelType: channel.channelType || normalizedKey,
      globalName: channel.globalName || "",
      expectedContract: channel.expectedContract || channel.contract || "",
      requiredMethods: channel.requiredMethods || ["sample", "read"],
      requiredCoordinates: channel.requiredCoordinates || DEFAULT_COORDINATES.slice(),
      laws: channel.laws || [],
      budget: channel.budget || planet.budget || {},
      sampleFailureBlocking: channel.sampleFailureBlocking === true,
      canFallback: channel.canFallback !== false,
      canDegrade: channel.canDegrade !== false,
      authority: channel.authority || null,
      resolve: channel.resolve || null,
      metadata: channel.metadata || {}
    };
  }

  function createPlanetChannelTable(options = {}) {
    const planet = options.planet || {
      id: options.planetId || "",
      label: options.planetLabel || ""
    };

    const table = RuntimeTable({
      id: options.id || `${planet.id || "planet"}-channel-runtime-table`,
      planetId: planet.id || options.planetId || "",
      planetLabel: planet.label || options.planetLabel || "",
      budget: options.budget || {
        atlasWidth: 384,
        atlasHeight: 192,
        rowsPerChunk: 2,
        probeRowsPerChunk: 2,
        wideProbeMinPoints: 25,
        sampleRate: 1
      }
    });

    asArray(options.channels).forEach((channel) => {
      table.registerChild(normalizeChannelRegistration(channel, planet));
    });

    return table;
  }

  function createHearthChannelTable(options = {}) {
    return createPlanetChannelTable({
      id: options.id || "hearth-channel-runtime-table",
      planet: {
        id: "hearth",
        label: "Hearth"
      },
      budget: options.budget || {
        atlasWidth: 384,
        atlasHeight: 192,
        rowsPerChunk: 2,
        probeRowsPerChunk: 2,
        wideProbeMinPoints: 25,
        sampleRate: 1
      },
      channels: [
        {
          key: "land",
          name: "Hearth Land Channel",
          globalName: "HEARTH_LAND_CHANNEL",
          expectedContract: HEARTH_CONTRACTS.land,
          laws: [
            {
              field: "allowedToFloat",
              expected: false,
              code: "LAND_CANNOT_FLOAT",
              message: "Land channel cannot float above the body.",
              severity: STATUS.REJECTED
            },
            {
              field: "isLandChannel",
              expected: true,
              code: "LAND_CHANNEL_FLAG_MISSING",
              message: "Land channel must identify as land channel.",
              severity: STATUS.REJECTED
            }
          ],
          canFallback: true
        },
        {
          key: "water",
          name: "Hearth Water Channel",
          globalName: "HEARTH_WATER_CHANNEL",
          expectedContract: HEARTH_CONTRACTS.water,
          laws: [
            {
              field: "allowedToFloat",
              expected: false,
              code: "WATER_CANNOT_FLOAT",
              message: "Water channel cannot float as atmosphere.",
              severity: STATUS.REJECTED
            },
            {
              field: "isWaterChannel",
              expected: true,
              code: "WATER_CHANNEL_FLAG_MISSING",
              message: "Water channel must identify as water channel.",
              severity: STATUS.REJECTED
            }
          ],
          canFallback: true
        },
        {
          key: "air",
          name: "Hearth Air Channel",
          globalName: "HEARTH_AIR_CHANNEL",
          expectedContract: HEARTH_CONTRACTS.air,
          laws: [
            {
              field: "allowedToFloat",
              expected: true,
              code: "AIR_MUST_BE_FLOATING_CHANNEL",
              message: "Air channel must be the floating channel.",
              severity: STATUS.REJECTED
            },
            {
              field: "mayDefineLand",
              expected: false,
              code: "AIR_CANNOT_DEFINE_LAND",
              message: "Air channel cannot define landmass.",
              severity: STATUS.REJECTED
            },
            {
              field: "mayDefineWater",
              expected: false,
              code: "AIR_CANNOT_DEFINE_WATER",
              message: "Air channel cannot define water boundaries.",
              severity: STATUS.REJECTED
            }
          ],
          canFallback: true
        }
      ],
      ...options
    });
  }

  function createLoadingOptimizationPlan(input = {}, options = {}) {
    const budget = normalizeBudget(options.budget || input.budget || {});
    const render = input.renderMetadata || input.render || {};
    const ledger = input.runtimeTableLedger || input.ledger || null;

    const visibleCarrierAvailable = safeBool(input.visibleCarrierAvailable, safeBool(render.visibleCarrierAllowed, safeBool(render.visualCarrierAllowed, true)));
    const childValidationAvailable = Boolean(ledger && Array.isArray(ledger.records) && ledger.records.length);
    const anchorSampleAvailable = Boolean(ledger && ledger.lastSamplePoint);
    const atlasOrCacheReady = safeBool(render.atlasReady, false) || safeBool(render.cachedAtlasProjection, false) || safeBool(render.imageRendered, false);
    const wideProbeReady = Array.isArray(input.probeSamples) && input.probeSamples.length >= budget.wideProbeMinPoints;

    let loadingCoordinate = L_COORDINATES.L0_LOADING_NOT_STARTED;
    if (visibleCarrierAvailable) loadingCoordinate = L_COORDINATES.L1_VISIBLE_CARRIER_FIRST;
    if (visibleCarrierAvailable && childValidationAvailable) loadingCoordinate = L_COORDINATES.L2_CHILD_CONTRACT_VALIDATION;
    if (visibleCarrierAvailable && childValidationAvailable && anchorSampleAvailable) loadingCoordinate = L_COORDINATES.L3_ANCHOR_SAMPLE_LOCAL_PROOF;
    if (visibleCarrierAvailable && childValidationAvailable && anchorSampleAvailable && atlasOrCacheReady) loadingCoordinate = L_COORDINATES.L4_ATLAS_OR_CACHE_RENDER;
    if (visibleCarrierAvailable && childValidationAvailable && anchorSampleAvailable && atlasOrCacheReady && !wideProbeReady) loadingCoordinate = L_COORDINATES.L5_WIDE_PROBE_IDLE_CHUNKS;
    if (visibleCarrierAvailable && childValidationAvailable && anchorSampleAvailable && atlasOrCacheReady && wideProbeReady) loadingCoordinate = L_COORDINATES.L6_OPTIMIZED_STABLE;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      loadingOptimizationContract: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_v1",
      loadingOptimizationReceipt: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_RECEIPT_v1",
      version: VERSION,
      authority: "lab-runtime-table-cardinal-north-loading-optimization-authority",
      loadingCoordinate,
      sequence: [
        {
          step: 1,
          name: "visible-carrier-first",
          coordinate: L_COORDINATES.L1_VISIBLE_CARRIER_FIRST,
          requiredBeforeFirstVisibleRender: true,
          blocksFirstVisibleRender: !visibleCarrierAvailable,
          complete: visibleCarrierAvailable
        },
        {
          step: 2,
          name: "child-contract-validation",
          coordinate: L_COORDINATES.L2_CHILD_CONTRACT_VALIDATION,
          requiredBeforeFirstVisibleRender: false,
          blocksFirstVisibleRender: false,
          complete: childValidationAvailable
        },
        {
          step: 3,
          name: "anchor-sample-local-proof",
          coordinate: L_COORDINATES.L3_ANCHOR_SAMPLE_LOCAL_PROOF,
          requiredBeforeFirstVisibleRender: false,
          blocksFirstVisibleRender: false,
          complete: anchorSampleAvailable,
          law: "anchor sample proves only load, contract, method, coordinate, and local safety"
        },
        {
          step: 4,
          name: "atlas-or-cache-render",
          coordinate: L_COORDINATES.L4_ATLAS_OR_CACHE_RENDER,
          requiredBeforeFirstVisibleRender: false,
          blocksFirstVisibleRender: false,
          complete: atlasOrCacheReady
        },
        {
          step: 5,
          name: "wide-probe-idle-chunks",
          coordinate: L_COORDINATES.L5_WIDE_PROBE_IDLE_CHUNKS,
          requiredBeforeFirstVisibleRender: false,
          blocksFirstVisibleRender: false,
          complete: wideProbeReady,
          minimumWideProbePoints: budget.wideProbeMinPoints,
          deferUntilAfterVisibleCarrier: true
        }
      ],
      visibleCarrierFirst: true,
      wideProbeBlocksFirstVisibleRender: false,
      firstVisibleRenderAllowed: visibleCarrierAvailable,
      childValidationAvailable,
      anchorSampleAvailable,
      atlasOrCacheReady,
      wideProbeReady,
      budget,
      recommendedChunking: {
        rowsPerChunk: budget.rowsPerChunk,
        probeRowsPerChunk: budget.probeRowsPerChunk,
        deferWideProbe: true,
        useIdleFrames: true
      },
      chronologicalCheckpointGovernorAvailable: true,
      cardinalSplitActive: true,
      northPrecedent: true,
      recommendedCheckpointSession: "createHearthCheckpointSession",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function createVisualCarrierEligibilityCheckpoint(planDraft) {
    const status = planDraft.visualCarrierAllowed && !planDraft.visualizationBlocked ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.BLOCKING;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.VISUAL_CARRIER_ELIGIBILITY_CHECK,
      name: "Visual Carrier Eligibility Check",
      goal: "Visualization is blocked only when the carrier itself is structurally unsafe.",
      observed: status === COHERENCE_STATUS.PASS
        ? "Visual carrier remains active; diagnostic failures do not erase the planet."
        : `Visualization blocked: ${planDraft.visualizationBlockReason || "carrier unsafe"}.`,
      math: "Coherence failure blocks visual-pass claim, not visual carrier expression. Carrier blocks only when structurally unsafe or route/canvas mount is unavailable.",
      tolerance: { visualizationBlocked: false },
      value: {
        visualCarrierAllowed: planDraft.visualCarrierAllowed,
        visualizationBlocked: planDraft.visualizationBlocked,
        visualizationBlockReason: planDraft.visualizationBlockReason,
        visualCarrierMode: planDraft.visualCarrierMode,
        visualDiagnosticStatus: planDraft.visualDiagnosticStatus,
        visualDiagnosticCue: planDraft.visualDiagnosticCue,
        childFailureDoesNotEraseVisualization: true,
        wideProbeBlocksFirstVisibleRender: false
      },
      status,
      probableCause: status === COHERENCE_STATUS.PASS ? [] : ["Carrier structure, mount, or projection safety is unavailable."],
      renewalTarget: status === COHERENCE_STATUS.PASS ? [] : ["visual-carrier-mount", "canvas-shell-first-render", "projection-safety"],
      nextStrategy: status === COHERENCE_STATUS.PASS ? [] : ["Restore shell-first visible carrier before child or visual tuning."]
    });
  }

  function createAtlasStartAuthorizationCheckpoint(planDraft) {
    const status = planDraft.atlasStartAuthorized ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.BLOCKING;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.ATLAS_START_AUTHORIZATION_CHECK,
      name: "Atlas Start Authorization Check",
      goal: "Atlas start must be authorized or explicitly blocked by a named coordinate and reason.",
      observed: planDraft.atlasStartAuthorized
        ? "Atlas start is authorized by Runtime Table plan."
        : `Atlas start blocked: ${planDraft.atlasStartBlockedReason || "unknown reason"}.`,
      math: "atlasStartAuthorized = visualCarrierAllowed && !visualizationBlocked && projectionSafe && no blocking/rejected structural child. Child C4 may degrade coherence but does not automatically block atlas.",
      tolerance: {
        childFailureDoesNotEraseVisualization: true,
        atlasStartBlockedReasonRequiredWhenBlocked: true
      },
      value: {
        atlasStartAuthorized: planDraft.atlasStartAuthorized,
        atlasStartMode: planDraft.atlasStartMode,
        atlasStartCoordinate: planDraft.atlasStartCoordinate,
        atlasStartBlockedReason: planDraft.atlasStartBlockedReason,
        childFailureDoesNotEraseVisualization: true,
        channelPlan: clonePlain(planDraft.channelPlan)
      },
      status,
      probableCause: status === COHERENCE_STATUS.PASS ? [] : ["Runtime Table found a structural carrier, projection, or child-blocking condition."],
      renewalTarget: status === COHERENCE_STATUS.PASS ? [] : ["atlas-start-sequencing", "runtime-table-plan-consumption", "visual-carrier-safety"],
      nextStrategy: status === COHERENCE_STATUS.PASS ? [] : ["Use the atlas-start blocked reason before changing child visual code."]
    });
  }

  function findChannelLoadResult(input, key) {
    const results = Array.isArray(input && input.channelLoadResults) ? input.channelLoadResults : [];
    return results.find((item) => item && item.key === key) || null;
  }

  function normalizeChildPlan(key, ledgerRecord, loadResult, expectedContract) {
    const record = ledgerRecord || {};
    const load = loadResult || {};
    const coordinate =
      load.failureCoordinate ||
      record.coordinate ||
      (record.ready || record.status === STATUS.READY ? C_COORDINATES.C11_CHILD_VALIDATED : C_COORDINATES.C6_GLOBAL_ACTOR_MISSING);

    const status = record.status || (load.validationOk ? STATUS.READY : load.requested ? STATUS.FALLBACK : STATUS.PENDING);
    const present = Boolean(record.authorityPresent || load.globalPresent || load.validationOk);
    const contractOk = Boolean(record.contractOk || load.contractOk || (!expectedContract && present));
    const validationOk = Boolean(record.ready || record.status === STATUS.READY || load.validationOk);

    return {
      key,
      status,
      coordinate,
      authorityPresent: present,
      contractOk,
      validationOk,
      expectedContract,
      actualContract: record.actualContract || load.actualContract || "",
      fallback: Boolean(record.fallback || status === STATUS.FALLBACK || !validationOk),
      degraded: Boolean(record.degraded || status === STATUS.DEGRADED),
      held: Boolean(record.held || status === STATUS.HELD),
      rejected: Boolean(record.rejected || status === STATUS.REJECTED),
      blocking: Boolean(record.blocking || status === STATUS.BLOCKING),
      canRenderFallback: true,
      sample: clonePlain(record.sample || null),
      receipt: clonePlain(record.receipt || null),
      issues: clonePlain(record.issues || [])
    };
  }

  function normalizeLedger(input = {}, options = {}) {
    if (input.runtimeTableLedger || input.ledger) return input.runtimeTableLedger || input.ledger;
    if (options.ledger) return options.ledger;

    if (options.channels && options.channels.length) {
      const table = createPlanetChannelTable({
        planetId: options.planetId || "",
        planetLabel: options.planetLabel || "",
        channels: options.channels,
        budget: options.budget || {}
      });
      return table.run(input.samplePoint || DEFAULT_SAMPLE_POINT);
    }

    if (options.runHearthTable !== false && (options.profile === "hearth-channel-expression" || options.planetId === "hearth")) {
      const table = createHearthChannelTable(options.tableOptions || {});
      return table.run(input.samplePoint || DEFAULT_SAMPLE_POINT);
    }

    return null;
  }

  function chooseRenewalTarget(planDraft) {
    if (!planDraft.planValid) return "runtime-table-plan-generation";
    if (planDraft.visualizationBlocked) return "visible-carrier-structural-safety";
    if (!planDraft.atlasStartAuthorized) return "atlas-start-sequencing";
    if (!planDraft.atlasStartAttempted && planDraft.atlasStartAuthorized) return "canvas-plan-directed-atlas-start-consumption";
    if (planDraft.coherentExpressionPass === false && planDraft.failedCheckpoints && planDraft.failedCheckpoints.length) return "coherent-expression-diagnostic-target";
    if (planDraft.heldCheckpoints && planDraft.heldCheckpoints.includes(COHERENCE_CHECKS.DISTRIBUTION_SHAPE_CHECK)) return "wide-probe-idle-diagnostic-later";
    return "none";
  }

  function createUniversalPlanetVisualCarrierPlan(input = {}, options = {}) {
    const ledger = normalizeLedger(input, options);
    const records = getRuntimeRecordsByKey(ledger);
    const expectedContracts = (input.goalProfile && input.goalProfile.expectedContracts) || (options.goalProfile && options.goalProfile.expectedContracts) || {};
    const recordKeys = Object.keys(records);
    const loadKeys = Array.isArray(input.channelLoadResults) ? input.channelLoadResults.map((item) => item && item.key).filter(Boolean) : [];
    const optionKeys = asArray(options.channelKeys);
    const channelKeys = Array.from(new Set([
      ...optionKeys,
      ...recordKeys,
      ...loadKeys,
      "land",
      "water",
      "air"
    ]));

    const channelPlan = {};
    channelKeys.forEach((key) => {
      channelPlan[key] = normalizeChildPlan(key, records[key], findChannelLoadResult(input, key), expectedContracts[key] || "");
    });

    const renderMetadata = input.renderMetadata || input.render || {};
    const routeMounted = safeBool(input.routeMounted, safeBool(renderMetadata.routeMounted, true));
    const canvasMounted = safeBool(input.canvasMounted, safeBool(renderMetadata.canvasMounted, true));
    const fallbackShellAvailable = safeBool(input.fallbackShellAvailable, safeBool(renderMetadata.fallbackShellAvailable, true));
    const projectionSafe = safeBool(renderMetadata.sphereContainment, true) && safeBool(renderMetadata.outsideSphereTransparent, true) && safeBool(renderMetadata.noRectangularTextureSpill, true);
    const runtimeAllowed = Boolean(ledger && ledger.runtimeAllowed);
    const handoffClass = ledger && ledger.handoff ? ledger.handoff : HANDOFF.BLOCKING;

    const structuralBlockers = [];
    if (!routeMounted) structuralBlockers.push("route-not-mounted");
    if (!canvasMounted) structuralBlockers.push("canvas-not-mounted");
    if (!fallbackShellAvailable) structuralBlockers.push("fallback-shell-unavailable");
    if (!projectionSafe) structuralBlockers.push("projection-unsafe");

    Object.keys(channelPlan).forEach((key) => {
      if (channelPlan[key].blocking || channelPlan[key].rejected) {
        structuralBlockers.push(`${key}-structural-block`);
      }
    });

    const visualCarrierAllowed = structuralBlockers.length === 0;
    const visualizationBlocked = !visualCarrierAllowed;
    const visualizationBlockReason = structuralBlockers.join(",");

    const atlasStructuralBlockers = [];
    if (!visualCarrierAllowed) atlasStructuralBlockers.push("visual-carrier-blocked");
    if (!projectionSafe) atlasStructuralBlockers.push("projection-unsafe");

    Object.keys(channelPlan).forEach((key) => {
      if (channelPlan[key].blocking || channelPlan[key].rejected) {
        atlasStructuralBlockers.push(`${key}-blocking-or-rejected`);
      }
    });

    const atlasStartAuthorized = atlasStructuralBlockers.length === 0;
    const atlasStartBlockedReason = atlasStructuralBlockers.join(",");

    const atlasStartAttempted = safeBool(input.atlasStartAttempted, safeBool(renderMetadata.atlasStartAttempted, false));
    const atlasBuilderEntered = safeBool(input.atlasBuilderEntered, safeBool(renderMetadata.atlasBuilderEntered, false));
    const atlasProgressObserved = safeBool(input.atlasProgressObserved, safeBool(renderMetadata.atlasProgressObserved, false));
    const atlasReady = safeBool(renderMetadata.atlasReady, false);
    const projectionReady = safeBool(renderMetadata.projectionReady, safeBool(renderMetadata.imageRendered, false));

    let atlasStartCoordinate = A_COORDINATES.A0_ATLAS_SEQUENCE_NOT_STARTED;
    if (atlasStartAuthorized) atlasStartCoordinate = A_COORDINATES.A1_ATLAS_START_AUTHORIZED;
    if (atlasBuilderEntered) atlasStartCoordinate = A_COORDINATES.A2_ATLAS_BUILDER_ENTERED;
    if (atlasProgressObserved) atlasStartCoordinate = A_COORDINATES.A3_ATLAS_PROGRESS_OBSERVED;
    if (atlasReady) atlasStartCoordinate = A_COORDINATES.A4_ATLAS_COMPLETED;
    if (atlasReady && projectionReady) atlasStartCoordinate = A_COORDINATES.A5_ATLAS_PROJECTED_TO_SPHERE;

    const runtimeCoordinate = ledger ? R_COORDINATES.R3_PLAN_VALID_HANDOFF_READY : R_COORDINATES.R1_RUNTIME_TABLE_LOADED_NO_PLAN;
    const visualCoordinate = visualizationBlocked
      ? V_COORDINATES.V0_VISUAL_CARRIER_NOT_MOUNTED
      : atlasReady
        ? V_COORDINATES.V3_ATLAS_CARRIER_VISIBLE
        : fallbackShellAvailable
          ? V_COORDINATES.V2_DIAGNOSTIC_CARRIER_VISIBLE
          : V_COORDINATES.V1_FALLBACK_SHELL_MOUNTED;

    const visualCarrierMode = visualizationBlocked
      ? "blocked"
      : atlasReady
        ? "atlas-carrier"
        : "fallback-shell";

    const visualDiagnosticStatus = visualizationBlocked
      ? "BLOCKING"
      : atlasStartAuthorized
        ? "READY"
        : "DEGRADED";

    const visualDiagnosticCue = visualizationBlocked
      ? "VISUAL_CARRIER_BLOCKED"
      : !atlasStartAuthorized
        ? "ATLAS_START_BLOCKED"
        : "ATLAS_START_AUTHORIZED";

    const loadingOptimizationPlan = createLoadingOptimizationPlan({
      ...input,
      runtimeTableLedger: ledger,
      renderMetadata,
      visibleCarrierAvailable: visualCarrierAllowed
    }, options);

    const planDraft = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      planContract: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_v1",
      planReceipt: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_RECEIPT_v1",
      version: VERSION,
      authority: "runtime-table-cardinal-north-universal-planet-procedural-plan-authority",
      planetId: input.planetId || options.planetId || (ledger && ledger.planetId) || "",
      planetLabel: input.planetLabel || options.planetLabel || (ledger && ledger.planetLabel) || "",
      planGenerated: true,
      planValid: Boolean(ledger),
      planGeneratedAt: nowIso(),
      runtimeTableContract: CONTRACT,
      runtimeTableReceipt: RECEIPT,
      runtimeTablePreviousContract: PREVIOUS_CONTRACT,
      runtimeCoordinate,
      visualCoordinate,
      atlasStartCoordinate,
      loadingCoordinate: loadingOptimizationPlan.loadingCoordinate,
      firstFailedCoordinate: "",
      recommendedNextRenewalTarget: "",
      visualCarrierAllowed,
      visualizationBlocked,
      visualizationBlockReason,
      visualCarrierMode,
      visualDiagnosticStatus,
      visualDiagnosticCue,
      constructionReady: runtimeAllowed,
      runtimeAllowed,
      handoffClass,
      atlasStartAuthorized,
      atlasStartMode: atlasStartAuthorized ? "universal-planet-atlas" : "blocked",
      atlasStartAttempted,
      atlasStartActive: atlasStartAttempted && !atlasReady,
      atlasBuilderEntered,
      atlasProgressObserved,
      atlasProgressFirstValue: safeNumber(input.atlasProgressFirstValue ?? renderMetadata.atlasProgressFirstValue, 0),
      atlasProgressLastValue: safeNumber(input.atlasProgressLastValue ?? renderMetadata.atlasProgressLastValue ?? renderMetadata.atlasProgress, 0),
      atlasStartBlockedReason,
      childFailureDoesNotEraseVisualization: true,
      wideProbeBlocksFirstVisibleRender: false,
      singleAnchorIsLocalProofOnly: true,
      externalStatusCallbackSafe: safeBool(input.externalStatusCallbackSafe, true),
      externalStatusCallbackErrors: Array.isArray(input.externalStatusCallbackErrors) ? input.externalStatusCallbackErrors.slice() : [],
      coherentExpressionEligible: visualCarrierAllowed && projectionSafe,
      coherentExpressionPass: false,
      visualPassClaimed: false,
      channelPlan,
      loadingOptimizationPlan,
      checkpointGovernorAvailable: true,
      cardinalSplitActive: true,
      northPrecedent: true,
      recommendedCheckpointSessionFactory: "createHearthCheckpointSession",
      runtimeTableLedger: clonePlain(ledger),
      tripleGCheckpoints: [],
      renewalTargets: [],
      nextStrategy: [],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false
    };

    planDraft.visualCarrierEligibilityCheckpoint = createVisualCarrierEligibilityCheckpoint(planDraft);
    planDraft.atlasStartAuthorizationCheckpoint = createAtlasStartAuthorizationCheckpoint(planDraft);

    const diagnostic = runChecks({
      ...input,
      runtimeTableLedger: ledger,
      visualCarrierPlan: planDraft,
      loadingPlan: { loadingOptimizationPlan },
      renderMetadata,
      imageRendered: safeBool(input.imageRendered, safeBool(renderMetadata.imageRendered, false)),
      canvasReceipt: input.canvasReceipt || {
        contract: expectedContracts.canvas || "",
        visualPassClaimed: false,
        sphereContainment: projectionSafe,
        outsideSphereTransparent: projectionSafe,
        noRectangularTextureSpill: projectionSafe,
        projectionReady
      },
      landSample: input.landSample || (channelPlan.land && channelPlan.land.sample) || {},
      waterSample: input.waterSample || (channelPlan.water && channelPlan.water.sample) || {},
      airSample: input.airSample || (channelPlan.air && channelPlan.air.sample) || {},
      probeSamples: Array.isArray(input.probeSamples) ? input.probeSamples : []
    }, options);

    planDraft.coherentExpressionPass = Boolean(diagnostic.coherentExpressionPass);
    planDraft.coherenceStatus = diagnostic.coherenceStatus;
    planDraft.coherenceScore = diagnostic.coherenceScore;
    planDraft.tripleGCheckpoints = diagnostic.checkpoints;
    planDraft.failedCheckpoints = diagnostic.failedCheckpoints;
    planDraft.warningCheckpoints = diagnostic.warningCheckpoints;
    planDraft.heldCheckpoints = diagnostic.heldCheckpoints;
    planDraft.renewalTargets = diagnostic.renewalTargets;
    planDraft.nextStrategy = diagnostic.nextStrategy;
    planDraft.firstFailedCoordinate = runtimeCoordinate;
    planDraft.recommendedNextRenewalTarget = chooseRenewalTarget(planDraft);

    if (planDraft.atlasStartAuthorized && !planDraft.atlasStartAttempted) {
      planDraft.firstFailedCoordinate = A_COORDINATES.A1_ATLAS_START_AUTHORIZED;
      planDraft.recommendedNextRenewalTarget = "canvas-plan-directed-atlas-start-consumption";
    }

    return planDraft;
  }

  function createVisualCarrierPlan(input = {}, options = {}) {
    return createUniversalPlanetVisualCarrierPlan(input, options);
  }

  function createHearthVisualCarrierPlan(input = {}, options = {}) {
    return createUniversalPlanetVisualCarrierPlan({
      samplePoint: DEFAULT_SAMPLE_POINT,
      planetId: "hearth",
      planetLabel: "Hearth",
      ...input
    }, {
      profile: "hearth-channel-expression",
      planetId: "hearth",
      planetLabel: "Hearth",
      ...options
    });
  }

  function runProceduralPlan(input = {}, options = {}) {
    return createUniversalPlanetVisualCarrierPlan(input, options);
  }

  function createTripleGDiagnostic(options = {}) {
    const profile = options.goalProfile || createGoalProfile(options.profile || "universal-planet-channel-expression", options.profileOverrides || {});
    const diagnosticId = options.id || `triple-g-diagnostic-${Math.random().toString(36).slice(2, 9)}`;

    const state = {
      id: diagnosticId,
      profile,
      reports: [],
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    function run(input = {}) {
      const report = runChecks({ ...input, goalProfile: input.goalProfile || state.profile }, { ...options, goalProfile: input.goalProfile || state.profile });
      state.reports.push(report);
      state.updatedAt = nowIso();
      return report;
    }

    function getLastReport() {
      return state.reports[state.reports.length - 1] || null;
    }

    function getReceipt() {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        authority: "lab-triple-g-coherence-diagnostic-cardinal-north-instance",
        id: state.id,
        goalProfileId: state.profile.id,
        reportCount: state.reports.length,
        tripleGDiagnostic: true,
        coherentExpressionDiagnostic: true,
        imageRenderedIsNotCoherencePass: true,
        singleAnchorIsLocalProofOnly: true,
        wideProbeNeverBlocksFirstVisibleRender: true,
        checkpointGovernorAvailable: true,
        cardinalSplitActive: true,
        northPrecedent: true,
        visualPassClaimed: false
      };
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      id: state.id,
      profile: state.profile,
      run,
      getLastReport,
      getReceipt,
      get state() {
        return state;
      }
    };
  }

  function createHearthCoherenceDiagnostic(options = {}) {
    return createTripleGDiagnostic({
      ...options,
      profile: "hearth-channel-expression",
      profileOverrides: options.profileOverrides || {}
    });
  }

  function createPlanetWideProbeDiagnostic(options = {}) {
    return createTripleGDiagnostic({
      ...options,
      profile: options.profile || "universal-planet-channel-expression",
      profileOverrides: mergePlain({
        planetId: options.planetId || "",
        planetLabel: options.planetLabel || "",
        tolerances: {
          minimumWideProbePoints: options.minimumWideProbePoints || 25
        }
      }, options.profileOverrides || {})
    });
  }

  function runCoherenceDiagnostic(input = {}, options = {}) {
    const diagnostic = options.diagnostic || createTripleGDiagnostic(options);
    return diagnostic.run(input);
  }

  function runPlanetWideProbe(input = {}, options = {}) {
    const diagnostic = options.diagnostic || createPlanetWideProbeDiagnostic(options);
    return diagnostic.run({
      ...input,
      probeSamples: Array.isArray(input.probeSamples) ? input.probeSamples : []
    });
  }

  function createChronologicalFibonacciPlan(options = {}) {
    return getEastBranch().createChronologicalFibonacciPlan(options);
  }

  function createNewsFibonacciCheckpointPlan(options = {}) {
    return getEastBranch().createNewsFibonacciCheckpointPlan(options);
  }

  function classifyCheckpointEvent(event = {}, sessionLike = {}) {
    return getEastBranch().classifyCheckpointEvent(event, sessionLike);
  }

  function evaluateNewsGateState(snapshot = {}) {
    return getEastBranch().evaluateNewsGateState(snapshot);
  }

  function createCheckpointSession(sequenceInput = null, options = {}) {
    return getEastBranch().createCheckpointSession(sequenceInput, options);
  }

  function createHearthCheckpointSession(options = {}) {
    return getEastBranch().createHearthCheckpointSession(options);
  }

  function getReceipt() {
    bindCardinalBranches();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-cardinal-north-precedent-facade",
      destinationFile: "/assets/lab/runtime-table.js",
      status: "active",
      role: "north-precedent-public-runtime-table-facade-with-east-west-south-fallbacks",
      labEquipment: true,
      runtimeTable: true,
      tripleGDiagnostic: true,
      visualCarrierPlanAuthority: true,
      atlasStartPlanAuthority: true,
      coherentExpressionDiagnostic: true,
      universalPlanetStandard: true,
      hearthIsFirstConsumerNotOwner: true,

      northPrecedent: true,
      cardinalSplitActive: true,
      northLoaded: true,
      eastLoaded: cardinalState.eastLoaded,
      westLoaded: cardinalState.westLoaded,
      southLoaded: cardinalState.southLoaded,
      eastFallbackUsed: cardinalState.eastFallbackUsed,
      westFallbackUsed: cardinalState.westFallbackUsed,
      southFallbackUsed: cardinalState.southFallbackUsed,
      hearthConsumesNorthOnly: true,

      checkpointGovernorActive: true,
      chronologicalCheckpointSessionSupported: true,
      chronologicalFibonacciAlignment: true,
      newsFibonacciAlignment: true,
      oneActiveCheckpointAtATime: true,
      futureEventsQueued: true,
      completedEventsArchived: true,
      progressOnlyEventsArchived: true,
      regressiveEventsBlocked: true,
      degradedForwardAvailable: true,
      hardBlockReservedForStructuralOrFalseCompletion: true,
      blockedProgressCap: 98,
      readyTextRequiresCompletionLatch: true,
      f13CompoundSequenceEnforced: true,
      f13mSupportsDegradedForward: true,
      f13nSupportsDegradedForward: true,
      f21SupportsDegradedCompletion: true,
      newsGatesRequiredBeforeF21: true,

      purpose: "preserve North as the public Runtime Table authority, bind East/West/South when available, provide safe internal fallbacks, classify gaps before blocking, and allow degraded-forward progress when structurally safe",
      branchPaths: clonePlain(BRANCH_PATHS),
      runtimeTableSequence: [
        "validate",
        "coordinate",
        "optimize",
        "audit",
        "resolve",
        "handoff"
      ],
      loadingOptimizationSequence: [
        "visible-carrier-first",
        "child-contract-validation-second",
        "anchor-sample-local-proof-third",
        "atlas-or-cache-render-fourth",
        "wide-probe-idle-chunks-later"
      ],
      chronologicalCheckpointSequence: FIBONACCI_CHECKPOINTS.map((checkpoint) => ({
        id: checkpoint.id,
        event: checkpoint.event,
        aliases: asArray(checkpoint.aliases),
        rank: checkpoint.rank,
        fibonacci: checkpoint.fibonacci,
        value: checkpoint.value,
        lane: checkpoint.lane,
        progress: checkpoint.progress,
        label: checkpoint.label
      })),
      cardinalRoles: {
        north: "precedent-public-table-final-composition",
        east: "chronological-motion-checkpoint-admission",
        west: "gap-classification-renewal-target",
        south: "visible-state-postgame-receipt-language"
      },
      coordinates: {
        runtime: clonePlain(R_COORDINATES),
        visualCarrier: clonePlain(V_COORDINATES),
        atlas: clonePlain(A_COORDINATES),
        child: clonePlain(C_COORDINATES),
        loading: clonePlain(L_COORDINATES)
      },
      statuses: Object.values(STATUS),
      handoffClasses: Object.values(HANDOFF),
      coherenceStatuses: Object.values(COHERENCE_STATUS),
      checkpointEventActions: Object.values(CHECKPOINT_EVENT_ACTIONS),
      checkpointStatuses: Object.values(CHECKPOINT_STATUS),
      gapClasses: Object.values(GAP_CLASS),
      coherenceChecks: Object.values(COHERENCE_CHECKS),
      newsGates: clonePlain(NEWS_GATES),
      preservedExports: [
        "createTable",
        "createHearthChannelTable",
        "RuntimeTable",
        "STATUS",
        "HANDOFF",
        "getReceipt",
        "createTripleGDiagnostic",
        "createHearthCoherenceDiagnostic",
        "runCoherenceDiagnostic",
        "createGoalProfile",
        "createVisualCarrierPlan",
        "createHearthVisualCarrierPlan",
        "runProceduralPlan",
        "R_COORDINATES",
        "V_COORDINATES",
        "A_COORDINATES",
        "C_COORDINATES",
        "L_COORDINATES",
        "createPlanetChannelTable",
        "createPlanetGoalProfile",
        "createPlanetWideProbeDiagnostic",
        "runPlanetWideProbe",
        "createLoadingOptimizationPlan",
        "createUniversalPlanetVisualCarrierPlan",
        "createCheckpointSession",
        "createHearthCheckpointSession",
        "createChronologicalFibonacciPlan",
        "createNewsFibonacciCheckpointPlan",
        "classifyCheckpointEvent",
        "CHECKPOINT_EVENT_ACTIONS",
        "CHECKPOINT_STATUS",
        "FIBONACCI_CHECKPOINTS",
        "NEWS_GATES"
      ],
      addedExports: [
        "bindCardinalBranches",
        "loadCardinalBranchScripts",
        "getCardinalReceipt",
        "GAP_CLASS"
      ],
      coreLaw: [
        "North remains the only required public consumer authority",
        "East, West, and South are branch authorities behind North",
        "If branches are missing, North internal fallbacks preserve continuity",
        "Runtime Table decides procedural readiness",
        "Runtime Table governs chronological checkpoint admission",
        "Canvas consumes the plan and expresses locally",
        "constructionReady is not coherentExpressionPass",
        "imageRendered is not coherentExpressionPass",
        "coherentExpressionPass is not visualPassClaimed",
        "single anchor samples prove local load/contract/method/coordinate/safety only",
        "global distribution requires wide-probe minimum sample count",
        "wide-probe diagnostics never block first visible render",
        "one active checkpoint may animate at a time",
        "future checkpoint events are queued",
        "completed checkpoint duplicates are archived",
        "progress-only events are archived instead of hard-blocked",
        "regressive false completion is blocked",
        "CANVAS_READY is necessary but not sufficient for F21",
        "F13M may complete as degraded-forward when carrier-heavy surface signal exists",
        "F13N may complete as degraded-forward when receipt/copy diagnostic fallback exists",
        "F21 may complete as degraded-forward when NEWS degraded gates pass and no hard block remains",
        "blocked F21 progress caps at 98",
        "READY text requires completionLatched true",
        "visualPassClaimed remains false"
      ],
      owns: [
        "runtime-table-child-validation",
        "triple-g-coherence-diagnostic",
        "visual-carrier-eligibility-law",
        "atlas-start-authorization-law",
        "fallback-degraded-full-mode-classification",
        "wide-probe-readiness-law",
        "loading-optimization-sequence-law",
        "north-public-api-facade",
        "cardinal-branch-binding",
        "fallback-cardinal-authorities",
        "first-failed-coordinate-selection",
        "recommended-renewal-target-selection",
        "procedural-plan-export"
      ],
      doesNotOwn: [
        "planet truth",
        "channel meaning",
        "canvas mounting",
        "canvas drawing",
        "atlas pixel painting",
        "touch drag controls",
        "route orchestration",
        "runtime motion",
        "final visual pass claim"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    STATUS,
    HANDOFF,
    COHERENCE_STATUS,
    COHERENCE_CHECKS,
    R_COORDINATES,
    V_COORDINATES,
    A_COORDINATES,
    C_COORDINATES,
    L_COORDINATES,

    CHECKPOINT_EVENT_ACTIONS,
    CHECKPOINT_STATUS,
    GAP_CLASS,
    FIBONACCI_CHECKPOINTS,
    NEWS_GATES,

    createTable,
    createHearthChannelTable,
    createPlanetChannelTable,
    RuntimeTable,

    createGoalProfile,
    createPlanetGoalProfile,
    createTripleGDiagnostic,
    createHearthCoherenceDiagnostic,
    createPlanetWideProbeDiagnostic,
    runCoherenceDiagnostic,
    runPlanetWideProbe,

    createVisualCarrierPlan,
    createHearthVisualCarrierPlan,
    createUniversalPlanetVisualCarrierPlan,
    createLoadingOptimizationPlan,
    runProceduralPlan,

    createCheckpointSession,
    createHearthCheckpointSession,
    createChronologicalFibonacciPlan,
    createNewsFibonacciCheckpointPlan,
    classifyCheckpointEvent,
    evaluateNewsGateState,

    bindCardinalBranches,
    loadCardinalBranchScripts,
    getCardinalReceipt,
    getReceipt,

    labEquipment: true,
    runtimeTable: true,
    tripleGDiagnostic: true,
    coherentExpressionDiagnostic: true,
    visualCarrierPlanAuthority: true,
    atlasStartPlanAuthority: true,
    loadingOptimizationAuthority: true,
    wideProbeDiagnosticAuthority: true,
    universalPlanetStandard: true,
    hearthIsFirstConsumerNotOwner: true,

    northPrecedent: true,
    cardinalSplitActive: true,
    northLoaded: true,
    get eastLoaded() {
      bindCardinalBranches();
      return cardinalState.eastLoaded;
    },
    get westLoaded() {
      bindCardinalBranches();
      return cardinalState.westLoaded;
    },
    get southLoaded() {
      bindCardinalBranches();
      return cardinalState.southLoaded;
    },
    get eastFallbackUsed() {
      bindCardinalBranches();
      return cardinalState.eastFallbackUsed;
    },
    get westFallbackUsed() {
      bindCardinalBranches();
      return cardinalState.westFallbackUsed;
    },
    get southFallbackUsed() {
      bindCardinalBranches();
      return cardinalState.southFallbackUsed;
    },

    checkpointGovernorActive: true,
    chronologicalCheckpointSessionSupported: true,
    chronologicalFibonacciAlignment: true,
    newsFibonacciAlignment: true,
    oneActiveCheckpointAtATime: true,
    futureEventsQueued: true,
    completedEventsArchived: true,
    progressOnlyEventsArchived: true,
    regressiveEventsBlocked: true,
    degradedForwardAvailable: true,
    hardBlockReservedForStructuralOrFalseCompletion: true,
    blockedProgressCap: 98,
    readyTextRequiresCompletionLatch: true,
    f13CompoundSequenceEnforced: true,
    f13mSupportsDegradedForward: true,
    f13nSupportsDegradedForward: true,
    f21SupportsDegradedCompletion: true,
    newsGatesRequiredBeforeF21: true,

    validatesBeforeExpression: true,
    coordinatesBeforeRuntimePerforms: true,
    verifiesCoherenceAfterRender: true,
    generatesProceduralPlan: true,
    imageRenderedIsNotCoherencePass: true,
    constructionReadyIsNotCoherencePass: true,
    coherentExpressionPassIsNotVisualPassClaim: true,
    singleAnchorIsLocalProofOnly: true,
    wideProbeRequiredForGlobalDistribution: true,
    wideProbeNeverBlocksFirstVisibleRender: true,
    childFailureDoesNotEraseVisualization: true,
    visualizationBlocksOnlyWhenCarrierUnsafe: true,
    doesNotOwnTruth: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.runtimeTable = api;
  root.DEXTER_LAB.tripleGDiagnostic = api;
  root.DEXTER_LAB.visualCarrierPlanAuthority = api;
  root.DEXTER_LAB.loadingOptimizationAuthority = api;
  root.DEXTER_LAB.wideProbeDiagnosticAuthority = api;
  root.DEXTER_LAB.checkpointGovernor = api;
  root.DEXTER_LAB.cardinalRuntimeTableNorth = api;

  root.LAB_RUNTIME_TABLE = api;
  root.DexterRuntimeTable = api;
  root.RUNTIME_TABLE = api;
  root.LAB_TRIPLE_G_DIAGNOSTIC = api;
  root.TripleGDiagnostic = api;
  root.LAB_VISUAL_CARRIER_PLAN_AUTHORITY = api;
  root.LAB_LOADING_OPTIMIZATION_AUTHORITY = api;
  root.LAB_WIDE_PROBE_DIAGNOSTIC = api;
  root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE = api;
  root.LAB_CHECKPOINT_GOVERNOR = api;
  root.LAB_NEWS_FIBONACCI_CHECKPOINT_GOVERNOR = api;
  root.LAB_RUNTIME_TABLE_NORTH = api;
  root.LAB_CARDINAL_RUNTIME_TABLE_NORTH = api;

  bindCardinalBranches();

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.labRuntimeTableLoaded = "true";
    dataset.labRuntimeTableContract = CONTRACT;
    dataset.labRuntimeTablePreviousContract = PREVIOUS_CONTRACT;
    dataset.labRuntimeTableBaselineContract = BASELINE_CONTRACT;
    dataset.labRuntimeTableReceipt = RECEIPT;
    dataset.labRuntimeTableEquipment = "true";
    dataset.labRuntimeTableNorthLoaded = "true";
    dataset.labRuntimeTableNorthContract = CONTRACT;
    dataset.labTripleGDiagnosticLoaded = "true";
    dataset.labTripleGDiagnosticContract = CONTRACT;
    dataset.labVisualCarrierPlanAuthorityLoaded = "true";
    dataset.labVisualCarrierPlanAuthorityContract = CONTRACT;
    dataset.labLoadingOptimizationAuthorityLoaded = "true";
    dataset.labLoadingOptimizationAuthorityContract = CONTRACT;
    dataset.labWideProbeDiagnosticLoaded = "true";
    dataset.labWideProbeDiagnosticContract = CONTRACT;
    dataset.labCheckpointGovernorLoaded = "true";
    dataset.labCheckpointGovernorContract = CONTRACT;
    dataset.runtimeTableReusable = "true";
    dataset.tripleGDiagnosticReusable = "true";
    dataset.runtimeTableDoesNotOwnTruth = "true";
    dataset.runtimeTableOwnsProceduralPlan = "true";
    dataset.visualCarrierPlanAuthority = "true";
    dataset.atlasStartPlanAuthority = "true";
    dataset.loadingOptimizationAuthority = "true";
    dataset.wideProbeDiagnosticAuthority = "true";
    dataset.checkpointGovernorActive = "true";
    dataset.cardinalSplitActive = "true";
    dataset.northPrecedent = "true";
    dataset.hearthConsumesNorthOnly = "true";
    dataset.eastFallbackAvailable = "true";
    dataset.westFallbackAvailable = "true";
    dataset.southFallbackAvailable = "true";
    dataset.chronologicalCheckpointSessionSupported = "true";
    dataset.chronologicalFibonacciAlignment = "true";
    dataset.newsFibonacciAlignment = "true";
    dataset.oneActiveCheckpointAtATime = "true";
    dataset.futureEventsQueued = "true";
    dataset.completedEventsArchived = "true";
    dataset.progressOnlyEventsArchived = "true";
    dataset.regressiveEventsBlocked = "true";
    dataset.degradedForwardAvailable = "true";
    dataset.hardBlockReservedForStructuralOrFalseCompletion = "true";
    dataset.blockedProgressCap = "98";
    dataset.readyTextRequiresCompletionLatch = "true";
    dataset.f13CompoundSequenceEnforced = "true";
    dataset.f13mSupportsDegradedForward = "true";
    dataset.f13nSupportsDegradedForward = "true";
    dataset.f21SupportsDegradedCompletion = "true";
    dataset.newsGatesRequiredBeforeF21 = "true";
    dataset.universalPlanetStandard = "true";
    dataset.hearthIsFirstConsumerNotOwner = "true";
    dataset.singleAnchorIsLocalProofOnly = "true";
    dataset.wideProbeRequiredForGlobalDistribution = "true";
    dataset.wideProbeNeverBlocksFirstVisibleRender = "true";
    dataset.distributionShapeCheckHoldsUntilWideProbe = "true";
    dataset.minimumWideProbePoints = "25";
    dataset.visibleCarrierFirst = "true";
    dataset.childContractValidationSecond = "true";
    dataset.anchorSampleThird = "true";
    dataset.atlasCacheRenderFourth = "true";
    dataset.wideProbeIdleChunksLater = "true";
    dataset.childFailureDoesNotEraseVisualization = "true";
    dataset.visualizationBlocksOnlyWhenCarrierUnsafe = "true";
    dataset.imageRenderedIsNotCoherencePass = "true";
    dataset.constructionReadyIsNotCoherencePass = "true";
    dataset.coherentExpressionPassIsNotVisualPassClaim = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  loadCardinalBranchScripts();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
