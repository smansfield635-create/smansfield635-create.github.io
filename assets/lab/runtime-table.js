// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_VISUAL_CARRIER_ATLAS_SEQUENCE_STANDARD_TNT_v3
// Full-file replacement.
// Canonical Dexter Lab equipment.
// Runtime Table + Triple G Coherence Diagnostic + Visual Carrier / Atlas Sequence procedural plan authority.
// Purpose:
// - Preserve reusable Runtime Table construction-readiness equipment.
// - Preserve reusable Triple G coherent-expression diagnostic equipment.
// - Promote visual carrier eligibility, atlas-start authorization, fallback/degraded/full mode classification, and renewal-target selection into the lab layer.
// - Return a procedural plan that downstream canvases consume instead of locally inventing procedural law.
// Does not own:
// - page truth
// - child channel truth
// - canvas drawing
// - atlas pixel painting
// - touch/drag controls
// - route orchestration
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_VISUAL_CARRIER_ATLAS_SEQUENCE_STANDARD_TNT_v3";
  const RECEIPT = "LAB_RUNTIME_TABLE_VISUAL_CARRIER_ATLAS_SEQUENCE_STANDARD_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_AND_TRIPLE_G_COHERENCE_DIAGNOSTIC_STANDARD_TNT_v2";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1";
  const VERSION = "2026-05-29.lab-runtime-table-visual-carrier-atlas-sequence-standard-v3";

  const root = typeof window !== "undefined" ? window : globalThis;

  const STATUS = Object.freeze({
    PENDING: "PENDING",
    READY: "READY",
    OPTIMIZED: "OPTIMIZED",
    DEGRADED: "DEGRADED",
    FALLBACK: "FALLBACK",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING"
  });

  const HANDOFF = Object.freeze({
    FULL_PASS: "FULL_PASS",
    OPTIMIZED_PASS: "OPTIMIZED_PASS",
    DEGRADED_PASS: "DEGRADED_PASS",
    FALLBACK_PASS: "FALLBACK_PASS",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING"
  });

  const COHERENCE_STATUS = Object.freeze({
    PASS: "PASS",
    WARNING: "WARNING",
    DEGRADED: "DEGRADED",
    FAIL: "FAIL",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING"
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
    DISTRIBUTION_SHAPE_CHECK: "DISTRIBUTION_SHAPE_CHECK",
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

  const DEFAULT_COORDINATES = Object.freeze(["u", "v", "x", "y", "z"]);

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

  const DEFAULT_SAMPLE_POINT = Object.freeze({
    u: 0.5,
    v: 0.5,
    lon: 0,
    lat: 0,
    x: 0,
    y: 0,
    z: 1
  });

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

  function createIssue(code, message, severity = STATUS.DEGRADED, detail = {}) {
    return {
      code,
      message,
      severity,
      detail: clonePlain(detail),
      at: nowIso()
    };
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

  function getGlobalByName(name) {
    if (!name || typeof name !== "string") return null;
    return root[name] || null;
  }

  function resolveAuthority(registration) {
    if (!registration) return null;

    if (registration.authority && isObject(registration.authority)) return registration.authority;

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

    return STATUS.READY;
  }

  function normalizeBudget(input = {}) {
    const raw = isObject(input) ? input : {};

    return {
      sampleRate: clamp(raw.sampleRate ?? 1, 0.05, 1),
      atlasWidth: clamp(raw.atlasWidth ?? 384, 32, 2048),
      atlasHeight: clamp(raw.atlasHeight ?? 192, 16, 1024),
      rowsPerChunk: clamp(raw.rowsPerChunk ?? 2, 1, 16),
      priority: clamp(raw.priority ?? 1, 0, 10),
      canDegrade: raw.canDegrade !== false,
      canFallback: raw.canFallback !== false
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

    if (status === STATUS.OPTIMIZED || status === STATUS.DEGRADED || status === STATUS.FALLBACK) {
      next.sampleRate = clamp(next.sampleRate * 0.72, 0.05, 1);
      next.atlasWidth = Math.max(32, Math.round(next.atlasWidth * 0.75));
      next.atlasHeight = Math.max(16, Math.round(next.atlasHeight * 0.75));
      next.rowsPerChunk = Math.max(1, Math.min(8, Math.round(next.rowsPerChunk)));

      return {
        status: status === STATUS.FALLBACK ? STATUS.FALLBACK : STATUS.OPTIMIZED,
        budget: next,
        reason: "Budget reduced to preserve runtime handoff."
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

    return HANDOFF.FULL_PASS;
  }

  function handoffAllowsRuntime(handoff) {
    return (
      handoff === HANDOFF.FULL_PASS ||
      handoff === HANDOFF.OPTIMIZED_PASS ||
      handoff === HANDOFF.DEGRADED_PASS ||
      handoff === HANDOFF.FALLBACK_PASS
    );
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
      runtimeTable: true
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
        records: state.records.map((record) => ({
          key: record.key,
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
        status: state.status,
        handoff: state.handoff,
        runtimeAllowed: state.runtimeAllowed,
        tableSet: state.tableSet,
        runtimeTable: true,
        childCount: state.registrations.length,
        records: state.records.map((record) => ({
          key: record.key,
          name: record.name,
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
          rejected: record.rejected,
          blocking: record.blocking,
          sample: clonePlain(record.sample),
          receipt: clonePlain(record.receipt)
        })),
        ledger: clonePlain(state.ledger),
        lastSamplePoint: clonePlain(state.lastSamplePoint),
        updatedAt: state.updatedAt,
        canvasDecidesTruth: false,
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
      return createVisualCarrierPlan({ ...input, runtimeTableLedger: ledger }, planOptions);
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
          authority: "lab-runtime-table-standard-instance",
          id: state.id,
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
          visualPassClaimed: false
        };
      }
    };
  }

  function createTable(options = {}) {
    return RuntimeTable(options);
  }

  function createHearthChannelTable(options = {}) {
    const table = RuntimeTable({
      id: options.id || "hearth-channel-runtime-table",
      budget: options.budget || {
        atlasWidth: 384,
        atlasHeight: 192,
        rowsPerChunk: 2,
        sampleRate: 1
      }
    });

    table.registerChild({
      key: "land",
      name: "Hearth Land Channel",
      globalName: "HEARTH_LAND_CHANNEL",
      expectedContract: HEARTH_CONTRACTS.land,
      requiredMethods: ["sample", "read"],
      requiredCoordinates: ["u", "v", "x", "y", "z"],
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
    });

    table.registerChild({
      key: "water",
      name: "Hearth Water Channel",
      globalName: "HEARTH_WATER_CHANNEL",
      expectedContract: HEARTH_CONTRACTS.water,
      requiredMethods: ["sample", "read"],
      requiredCoordinates: ["u", "v", "x", "y", "z"],
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
    });

    table.registerChild({
      key: "air",
      name: "Hearth Air Channel",
      globalName: "HEARTH_AIR_CHANNEL",
      expectedContract: HEARTH_CONTRACTS.air,
      requiredMethods: ["sample", "read"],
      requiredCoordinates: ["u", "v", "x", "y", "z"],
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
    });

    return table;
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

  function statusRank(status) {
    switch (status) {
      case COHERENCE_STATUS.BLOCKING: return 0;
      case COHERENCE_STATUS.REJECTED: return 1;
      case COHERENCE_STATUS.FAIL: return 2;
      case COHERENCE_STATUS.DEGRADED: return 3;
      case COHERENCE_STATUS.WARNING: return 4;
      case COHERENCE_STATUS.PASS: return 5;
      default: return 2;
    }
  }

  function statusScore(status) {
    switch (status) {
      case COHERENCE_STATUS.PASS: return 1;
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
      passed: config.status === COHERENCE_STATUS.PASS,
      probableCause: asArray(config.probableCause),
      renewalTarget: asArray(config.renewalTarget),
      nextStrategy: asArray(config.nextStrategy),
      detail: clonePlain(config.detail || {}),
      at: nowIso()
    };
  }

  function createGoalProfile(type = "hearth-channel-expression", overrides = {}) {
    const base = {
      id: type,
      label: "Hearth channel coherent-expression goal profile",
      expectedContracts: {
        runtimeTable: CONTRACT,
        previousRuntimeTable: PREVIOUS_CONTRACT,
        canvas: HEARTH_CONTRACTS.canvas,
        land: HEARTH_CONTRACTS.land,
        water: HEARTH_CONTRACTS.water,
        air: HEARTH_CONTRACTS.air
      },
      laws: {
        landBodyBound: true,
        waterSurfaceSeated: true,
        airFloatingOnly: true,
        airMayDefineLand: false,
        airMayDefineWater: false,
        visualCarrierFailureOnlyBlocksWhenStructurallyUnsafe: true,
        waterFailureDoesNotBlockAtlas: true,
        imageRenderedIsNotCoherencePass: true,
        runtimeTableLedgerMustAgreeWithFinalOutput: true
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
        minimumLandCoverageWhenExpected: 0.04
      },
      weights: {
        VISUAL_CARRIER_ELIGIBILITY_CHECK: 8,
        RECEIPT_VERIFICATION_CHECK: 12,
        COORDINATE_BODY_CHECK: 12,
        LAND_BODY_BINDING_CHECK: 12,
        WATER_SURFACE_SEATING_CHECK: 10,
        AIR_AUTHORITY_CHECK: 10,
        CHANNEL_SEPARATION_CHECK: 8,
        PROJECTION_SEATING_CHECK: 8,
        DISTRIBUTION_SHAPE_CHECK: 6,
        ATLAS_START_AUTHORIZATION_CHECK: 14
      },
      criticalChecks: [
        COHERENCE_CHECKS.VISUAL_CARRIER_ELIGIBILITY_CHECK,
        COHERENCE_CHECKS.RECEIPT_VERIFICATION_CHECK,
        COHERENCE_CHECKS.COORDINATE_BODY_CHECK,
        COHERENCE_CHECKS.AIR_AUTHORITY_CHECK,
        COHERENCE_CHECKS.PROJECTION_SEATING_CHECK,
        COHERENCE_CHECKS.ATLAS_START_AUTHORIZATION_CHECK
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };

    return mergePlain(base, overrides);
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
    const goalProfile = input.goalProfile || options.goalProfile || createGoalProfile(options.profile || "hearth-channel-expression");
    const canvasSample = input.canvasSample || {};
    const landSample = input.landSample || (canvasSample && canvasSample.land) || {};
    const waterSample = input.waterSample || (canvasSample && canvasSample.water) || {};
    const airSample = input.airSample || (canvasSample && canvasSample.air) || {};
    const runtimeTableLedger = input.runtimeTableLedger || input.ledger || null;
    const canvasReceipt = input.canvasReceipt || input.canvas || {};
    const renderMetadata = input.renderMetadata || input.render || {};
    const probePoints = Array.isArray(input.probePoints) ? input.probePoints.slice() : [];
    const probeSamples = Array.isArray(input.probeSamples) ? input.probeSamples.slice() : [];

    return {
      goalProfile,
      runtimeTableLedger,
      canvasReceipt,
      canvasSample,
      landSample,
      waterSample,
      airSample,
      renderMetadata,
      probePoints,
      probeSamples,
      imageRendered: safeBool(input.imageRendered, safeBool(renderMetadata.imageRendered, safeBool(renderMetadata.atlasReady, false))),
      constructionReady: Boolean(runtimeTableLedger && runtimeTableLedger.runtimeAllowed),
      generatedImage: false,
      graphicBox: false,
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
    const profile = ctx.goalProfile;
    const ledger = ctx.runtimeTableLedger;
    const canvasReceipt = ctx.canvasReceipt || {};
    const records = getRuntimeRecordsByKey(ledger);

    const checks = {
      runtimeTableLedgerPresent: Boolean(ledger),
      runtimeTableHandoffPresent: Boolean(ledger && ledger.handoff),
      canvasReceiptPresent: Boolean(canvasReceipt && Object.keys(canvasReceipt).length),
      canvasVisualPassNotClaimed: canvasReceipt.visualPassClaimed !== true,
      landContractOk: !ctx.landSample || !extractContract(ctx.landSample) || extractContract(ctx.landSample) === profile.expectedContracts.land,
      waterContractOk: !ctx.waterSample || !extractContract(ctx.waterSample) || extractContract(ctx.waterSample) === profile.expectedContracts.water,
      airContractOk: !ctx.airSample || !extractContract(ctx.airSample) || extractContract(ctx.airSample) === profile.expectedContracts.air,
      runtimeRecordsPresent: Boolean(records.land || records.water || records.air)
    };

    const failed = Object.keys(checks).filter((key) => !checks[key]);
    const status = failed.length ? COHERENCE_STATUS.FAIL : COHERENCE_STATUS.PASS;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.RECEIPT_VERIFICATION_CHECK,
      name: "Receipt Verification Check",
      goal: "Runtime Table, canvas, and child-channel receipts must be present and contract-compatible.",
      observed: failed.length ? `Failed receipt/contract fields: ${failed.join(", ")}.` : "Required receipts and contracts are compatible.",
      math: "Boolean contract/receipt alignment check; visualPassClaimed must remain false.",
      tolerance: { failedRequiredFields: 0 },
      value: {
        failed,
        checks,
        runtimeTableHandoff: ledger && ledger.handoff ? ledger.handoff : "",
        canvasContract: extractContract(canvasReceipt),
        landContract: extractContract(ctx.landSample),
        waterContract: extractContract(ctx.waterSample),
        airContract: extractContract(ctx.airSample)
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

    const samples = [
      ["canvas", ctx.canvasSample],
      ["land", ctx.landSample],
      ["water", ctx.waterSample],
      ["air", ctx.airSample]
    ].filter(([, sample]) => sample && Object.keys(sample).length);

    const metrics = samples.map(([key, sample]) => ({ key, ...coordinateMetrics(sample, reference) }));

    const failures = metrics.filter((item) => (
      item.vectorMagnitudeError > t.vectorMagnitudeError ||
      item.uError > t.uError ||
      item.vError > t.vError ||
      item.coordinateError > t.coordinateError
    ));

    const missingCoordinateSamples = samples.length < 3;
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

  function landBodyBindingCheck(ctx) {
    const t = ctx.goalProfile.tolerances;
    const land = ctx.landSample || {};
    const air = ctx.airSample || {};
    const canvas = ctx.canvasSample || {};

    const landAlpha = clamp01(safeNumber(land.landAlpha ?? land.landPresence ?? land.alpha ?? canvas.landWeight, 0));
    const airAlpha = clamp01(safeNumber(air.airAlpha ?? air.airPresence ?? air.alpha ?? canvas.airWeight, 0));
    const rawBodyBinding = land.bodyBinding !== undefined ? land.bodyBinding : land.bodyBound === true ? 1 : 0;
    const rawSurfaceAttachment = land.surfaceAttachment !== undefined ? land.surfaceAttachment : land.surfaceBound === true ? 1 : 0;
    const bodyBinding = clamp01(safeNumber(rawBodyBinding, 0));
    const surfaceAttachment = clamp01(safeNumber(rawSurfaceAttachment, 0));

    const landAtmosphericLeak = landAlpha * airAlpha * (1 - bodyBinding);
    const landBodyScore = landAlpha * bodyBinding * surfaceAttachment;
    const leakFail = landAtmosphericLeak > t.landAtmosphericLeak;
    const bodyFail = landAlpha > t.minimumVisibleLandAlpha && landBodyScore < t.minimumLandBodyScore;
    const lowSignal = landAlpha <= t.minimumVisibleLandAlpha;
    const status = leakFail || bodyFail ? COHERENCE_STATUS.FAIL : lowSignal ? COHERENCE_STATUS.WARNING : COHERENCE_STATUS.PASS;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.LAND_BODY_BINDING_CHECK,
      name: "Land Body-Binding Check",
      goal: "Land must remain seated on the planet body, not carried by the atmospheric layer.",
      observed: leakFail || bodyFail ? "Land body-binding failed or atmospheric leakage exceeded tolerance." : lowSignal ? "Land signal is too low to prove strong body-bound expression." : "Land appears body-bound within tolerance.",
      math: "landAtmosphericLeak = landAlpha × airAlpha × (1 - bodyBinding); landBodyScore = landAlpha × bodyBinding × surfaceAttachment.",
      tolerance: {
        maximumLandAtmosphericLeak: t.landAtmosphericLeak,
        minimumLandBodyScore: t.minimumLandBodyScore,
        visibleLandAlpha: t.minimumVisibleLandAlpha
      },
      value: {
        landAlpha,
        airAlpha,
        bodyBinding,
        surfaceAttachment,
        landAtmosphericLeak,
        landBodyScore,
        leakFail,
        bodyFail,
        lowSignal
      },
      status,
      probableCause: status !== COHERENCE_STATUS.PASS ? ["Land bodyBinding is too weak, air is over-compositing land-shaped data, or canvas blend order is letting air carry land expression."] : [],
      renewalTarget: status !== COHERENCE_STATUS.PASS ? ["land-channel-body-binding", "canvas-composite-weighting", "air-channel-land-rejection", "atlas-projection-seating"] : [],
      nextStrategy: status !== COHERENCE_STATUS.PASS ? ["Increase body-bound land weighting and suppress air contribution over land masks before renewing terrain shape."] : []
    });
  }

  function waterSurfaceSeatingCheck(ctx) {
    const t = ctx.goalProfile.tolerances;
    const water = ctx.waterSample || {};
    const air = ctx.airSample || {};
    const canvas = ctx.canvasSample || {};

    const waterAlpha = clamp01(safeNumber(water.waterAlpha ?? water.waterPresence ?? water.alpha ?? canvas.waterWeight, 0));
    const airAlpha = clamp01(safeNumber(air.airAlpha ?? air.airPresence ?? air.alpha ?? canvas.airWeight, 0));
    const rawHydrosphereBinding = water.hydrosphereBinding !== undefined ? water.hydrosphereBinding : water.bodyBound === true ? 1 : 0;
    const rawSurfaceSeat = water.surfaceSeat !== undefined ? water.surfaceSeat : water.surfaceBound === true ? 1 : 0;
    const hydrosphereBinding = clamp01(safeNumber(rawHydrosphereBinding, 0));
    const surfaceSeat = clamp01(safeNumber(rawSurfaceSeat, 0));

    const waterFloatingLeak = waterAlpha * airAlpha * (1 - hydrosphereBinding);
    const waterSeatScore = waterAlpha * hydrosphereBinding * surfaceSeat;
    const leakFail = waterFloatingLeak > t.waterFloatingLeak;
    const seatFail = waterAlpha > t.minimumVisibleWaterAlpha && waterSeatScore < t.minimumWaterSeatScore;
    const lowSignal = waterAlpha <= t.minimumVisibleWaterAlpha;
    const status = leakFail || seatFail ? COHERENCE_STATUS.FAIL : lowSignal ? COHERENCE_STATUS.WARNING : COHERENCE_STATUS.PASS;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.WATER_SURFACE_SEATING_CHECK,
      name: "Water Surface-Seating Check",
      goal: "Water must be surface-seated or depth-seated, not floating as haze.",
      observed: leakFail || seatFail ? "Water seating failed or floating leak exceeded tolerance." : lowSignal ? "Water signal is too low to prove hydrosphere seating." : "Water appears surface/depth-seated within tolerance.",
      math: "waterFloatingLeak = waterAlpha × airAlpha × (1 - hydrosphereBinding); waterSeatScore = waterAlpha × hydrosphereBinding × surfaceSeat.",
      tolerance: {
        maximumWaterFloatingLeak: t.waterFloatingLeak,
        minimumWaterSeatScore: t.minimumWaterSeatScore,
        visibleWaterAlpha: t.minimumVisibleWaterAlpha
      },
      value: {
        waterAlpha,
        airAlpha,
        hydrosphereBinding,
        surfaceSeat,
        waterFloatingLeak,
        waterSeatScore,
        leakFail,
        seatFail,
        lowSignal
      },
      status,
      probableCause: status !== COHERENCE_STATUS.PASS ? ["Water hydrosphereBinding is too weak, air is over-compositing water boundary, or canvas blend order is lifting water into haze."] : [],
      renewalTarget: status !== COHERENCE_STATUS.PASS ? ["water-channel-surface-seating", "hydrology-ocean-continuity", "canvas-water-weighting", "air-suppression-over-water-boundary"] : [],
      nextStrategy: status !== COHERENCE_STATUS.PASS ? ["Strengthen water surfaceSeat/hydrosphereBinding and cap air overlay over water before changing ocean color."] : []
    });
  }

  function airAuthorityCheck(ctx) {
    const air = ctx.airSample || {};
    const canvas = ctx.canvasSample || {};
    const landWeight = clamp01(safeNumber(canvas.landWeight ?? (ctx.landSample && ctx.landSample.landAlpha), 0));
    const waterWeight = clamp01(safeNumber(canvas.waterWeight ?? (ctx.waterSample && ctx.waterSample.waterAlpha), 0));
    const airAlpha = clamp01(safeNumber(air.airAlpha ?? air.airPresence ?? air.alpha ?? canvas.airWeight, 0));
    const allowedToFloat = safeBool(air.allowedToFloat, false);
    const mayDefineLand = safeBool(air.mayDefineLand, false);
    const mayDefineWater = safeBool(air.mayDefineWater, false);
    const landWaterRejectionFailure = mayDefineLand || mayDefineWater ? 1 : 0;
    const airSurfaceDefinitionLeak = airAlpha * Math.max(landWeight, waterWeight) * landWaterRejectionFailure;
    const fieldFail = !allowedToFloat || mayDefineLand || mayDefineWater;

    return makeCheckpointReceipt({
      id: COHERENCE_CHECKS.AIR_AUTHORITY_CHECK,
      name: "Air Authority Check",
      goal: "Air may float, but cannot define land or water.",
      observed: fieldFail ? "Air authority fields violate floating-only / non-surface-definition law." : "Air authority remains separated from land and water definition.",
      math: "landWaterRejectionFailure = air.mayDefineLand || air.mayDefineWater ? 1 : 0; airSurfaceDefinitionLeak = airAlpha × max(landWeight, waterWeight) × landWaterRejectionFailure.",
      tolerance: {
        allowedToFloat: true,
        mayDefineLand: false,
        mayDefineWater: false,
        maximumAirSurfaceDefinitionLeak: 0
      },
      value: {
        allowedToFloat,
        mayDefineLand,
        mayDefineWater,
        airAlpha,
        landWeight,
        waterWeight,
        landWaterRejectionFailure,
        airSurfaceDefinitionLeak
      },
      status: fieldFail ? COHERENCE_STATUS.REJECTED : COHERENCE_STATUS.PASS,
      probableCause: fieldFail ? ["Air channel is not explicitly barred from defining surface truth or is not marked as the only floating authority."] : [],
      renewalTarget: fieldFail ? ["air-channel-authority-law", "air-channel-humidity-pressure-weighting", "canvas-composite-order", "land-water-mask-protection"] : [],
      nextStrategy: fieldFail ? ["Renew air channel law fields before attempting color, exposure, or atlas changes."] : []
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
    const atlasReady = safeBool(render.atlasReady, safeBool(canvas.atlasReady, safeBool(render.imageRendered, ctx.imageRendered)));
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
    const samples = ctx.probeSamples.length
      ? ctx.probeSamples
      : [{ land: ctx.landSample, water: ctx.waterSample, air: ctx.airSample, canvas: ctx.canvasSample }];

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
      observed: status === COHERENCE_STATUS.PASS ? "Probe distribution is within initial tolerance." : "Probe distribution suggests low land visibility or excessive air dominance.",
      math: "landCoverage = visibleLandSamples / totalSamples; waterCoverage = visibleWaterSamples / totalSamples; airDominance = visibleAirSamples / totalSamples.",
      tolerance: {
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
        highAir
      },
      status,
      probableCause: status !== COHERENCE_STATUS.PASS ? ["Land may be too sparse, air may dominate surface readability, or child-channel alpha distribution is misbalanced."] : [],
      renewalTarget: status !== COHERENCE_STATUS.PASS ? ["land-channel-alpha", "water-channel-alpha", "air-channel-suppression", "composition-elevation-mask-later-if-required"] : [],
      nextStrategy: status !== COHERENCE_STATUS.PASS ? ["Use a wider probe grid before renewing upstream geography."] : []
    });
  }

  function collectRenewalTargets(checkpoints) {
    const seen = new Set();
    const targets = [];

    checkpoints.forEach((checkpoint) => {
      if (checkpoint.status === COHERENCE_STATUS.PASS) return;

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
      math: "Weighted checkpoint score. Critical failures override score. Image rendered does not imply coherent expression.",
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
      landBodyBindingCheck(ctx),
      waterSurfaceSeatingCheck(ctx),
      airAuthorityCheck(ctx),
      channelSeparationCheck(ctx),
      projectionSeatingCheck(ctx),
      contrastVisibilityCheck(ctx),
      distributionShapeCheck(ctx)
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

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-visual-carrier-atlas-sequence-standard",
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
      renewalTargets: collectRenewalTargets(checkpoints),
      nextStrategy: collectNextStrategy(checkpoints),
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createTripleGDiagnostic(options = {}) {
    const profile = options.goalProfile || createGoalProfile(options.profile || "hearth-channel-expression", options.profileOverrides || {});
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
        authority: "lab-triple-g-coherence-diagnostic-instance",
        id: state.id,
        goalProfileId: state.profile.id,
        reportCount: state.reports.length,
        tripleGDiagnostic: true,
        coherentExpressionDiagnostic: true,
        imageRenderedIsNotCoherencePass: true,
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

  function runCoherenceDiagnostic(input = {}, options = {}) {
    const diagnostic = options.diagnostic || createTripleGDiagnostic(options);
    return diagnostic.run(input);
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
    const contractOk = Boolean(record.contractOk || load.contractOk);
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
      rejected: Boolean(record.rejected || status === STATUS.REJECTED),
      blocking: Boolean(record.blocking || status === STATUS.BLOCKING),
      canRenderFallback: true,
      sample: clonePlain(record.sample || null),
      receipt: clonePlain(record.receipt || null),
      issues: clonePlain(record.issues || [])
    };
  }

  function extractWaterProof(input, waterPlan) {
    const supplied = input && input.waterConnectorProof ? clonePlain(input.waterConnectorProof) : null;
    const waterLoad = findChannelLoadResult(input, "water");
    const nested = waterLoad && waterLoad.waterConnectorProof ? clonePlain(waterLoad.waterConnectorProof) : null;
    const base = supplied || nested || {};

    const coordinate =
      base.waterChildLoadFailureCoordinate ||
      (waterLoad && waterLoad.failureCoordinate) ||
      (waterPlan && waterPlan.coordinate) ||
      (waterPlan && waterPlan.validationOk ? C_COORDINATES.C11_CHILD_VALIDATED : C_COORDINATES.C6_GLOBAL_ACTOR_MISSING);

    const scriptLoaded = safeBool(base.waterScriptLoaded, Boolean(waterLoad && waterLoad.loaded));
    const globalPresent = safeBool(base.waterGlobalPresent, Boolean(waterLoad && waterLoad.globalPresent));
    const contractOk = safeBool(base.waterContractOk, Boolean(waterLoad && waterLoad.contractOk));
    const validationOk = safeBool(base.waterValidationOk, Boolean(waterPlan && waterPlan.validationOk));

    return {
      connectorActive: safeBool(base.connectorActive, true),
      connectorMode: base.connectorMode || "conduct-request-verify-only",
      connectorOwnsWaterTruth: false,
      canvasOwnsWaterTruth: false,
      waterChildExternalAuthority: base.waterChildExternalAuthority || "/assets/hearth/hearth.water.channel.js",
      waterChildExpectedContract: base.waterChildExpectedContract || HEARTH_CONTRACTS.water,
      waterChildRequestPrepared: safeBool(base.waterChildRequestPrepared, Boolean(waterLoad && waterLoad.requested)),
      waterChildScriptElementCreated: safeBool(base.waterChildScriptElementCreated, Boolean(waterLoad && waterLoad.scriptElementCreated)),
      waterChildScriptElementAppended: safeBool(base.waterChildScriptElementAppended, Boolean(waterLoad && waterLoad.scriptElementAppended)),
      waterChildDocumentHeadAvailable: safeBool(base.waterChildDocumentHeadAvailable, Boolean(waterLoad && waterLoad.documentHeadAvailable)),
      waterChildScriptMarker: base.waterChildScriptMarker || "hearth-water-channel",
      waterChildScriptSrc: base.waterChildScriptSrc || (waterLoad && waterLoad.requestedSrc) || "",
      waterScriptRequested: safeBool(base.waterScriptRequested, Boolean(waterLoad && waterLoad.requested)),
      waterScriptLoaded: scriptLoaded,
      waterScriptError: base.waterScriptError || (waterLoad && waterLoad.error) || "",
      waterChildTimeoutCheck: safeBool(base.waterChildTimeoutCheck, Boolean(waterLoad && waterLoad.timeoutCheck)),
      waterChildLoadFailureCoordinate: coordinate,
      waterChildScriptElementPresent: safeBool(base.waterChildScriptElementPresent, Boolean(waterLoad && (waterLoad.scriptElementCreated || waterLoad.existing))),
      waterChildScriptElementErrored: safeBool(base.waterChildScriptElementErrored, Boolean(waterLoad && waterLoad.errorType === "error")),
      waterChildScriptErrorType: base.waterChildScriptErrorType || (waterLoad && waterLoad.errorType) || "",
      waterChildPathCandidateUsed: base.waterChildPathCandidateUsed || "/assets/hearth/hearth.water.channel.js",
      waterChildFallbackCandidateUsed: safeBool(base.waterChildFallbackCandidateUsed, false),
      waterGlobalPresent: globalPresent,
      waterActorName: base.waterActorName || "",
      waterActualContract: base.waterActualContract || (waterLoad && waterLoad.actualContract) || "",
      waterExpectedContract: base.waterExpectedContract || HEARTH_CONTRACTS.water,
      waterSampleProbeOk: safeBool(base.waterSampleProbeOk, Boolean(waterPlan && waterPlan.sample)),
      waterSampleProbeContract: base.waterSampleProbeContract || "",
      waterSampleProbeCoordinatesOk: safeBool(base.waterSampleProbeCoordinatesOk, Boolean(waterPlan && waterPlan.sample && waterPlan.sample.u !== undefined)),
      waterSampleProbeFlagsOk: safeBool(base.waterSampleProbeFlagsOk, validationOk),
      waterSampleProbeError: base.waterSampleProbeError || (validationOk ? "" : "HEARTH_WATER_CHANNEL global missing."),
      waterSampleProbeValue: base.waterSampleProbeValue || null,
      waterValidationOk: validationOk,
      waterContractOk: contractOk,
      waterFailureDoesNotBlockAtlas: true,
      lastCheckedAt: base.lastCheckedAt || nowIso()
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
        waterFailureDoesNotBlockAtlas: true
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
      math: "atlasStartAuthorized = visualCarrierAllowed && !visualizationBlocked && projectionSafe && no blocking/rejected structural child. Water C4 may degrade coherence but does not block atlas.",
      tolerance: {
        waterFailureDoesNotBlockAtlas: true,
        atlasStartBlockedReasonRequiredWhenBlocked: true
      },
      value: {
        atlasStartAuthorized: planDraft.atlasStartAuthorized,
        atlasStartMode: planDraft.atlasStartMode,
        atlasStartCoordinate: planDraft.atlasStartCoordinate,
        atlasStartBlockedReason: planDraft.atlasStartBlockedReason,
        waterFailureDoesNotBlockAtlas: true,
        channelPlan: clonePlain(planDraft.channelPlan)
      },
      status,
      probableCause: status === COHERENCE_STATUS.PASS ? [] : ["Runtime Table found a structural carrier, projection, or child-blocking condition."],
      renewalTarget: status === COHERENCE_STATUS.PASS ? [] : ["atlas-start-sequencing", "runtime-table-plan-consumption", "visual-carrier-safety"],
      nextStrategy: status === COHERENCE_STATUS.PASS ? [] : ["Use the atlas-start blocked reason before changing child visual code."]
    });
  }

  function chooseFirstFailedCoordinate(channelPlan, atlasCoordinate, runtimeCoordinate) {
    if (runtimeCoordinate && runtimeCoordinate !== R_COORDINATES.R3_PLAN_VALID_HANDOFF_READY) return runtimeCoordinate;
    if (atlasCoordinate && atlasCoordinate !== A_COORDINATES.A1_ATLAS_START_AUTHORIZED) return atlasCoordinate;

    const keys = ["land", "water", "air"];
    for (const key of keys) {
      const item = channelPlan[key];
      if (!item) continue;
      if (item.coordinate && item.coordinate !== C_COORDINATES.C11_CHILD_VALIDATED) return item.coordinate;
    }

    return R_COORDINATES.R3_PLAN_VALID_HANDOFF_READY;
  }

  function chooseRenewalTarget(planDraft) {
    if (!planDraft.planValid) return "runtime-table-plan-generation";
    if (planDraft.visualizationBlocked) return "visible-carrier-structural-safety";
    if (!planDraft.atlasStartAuthorized) return "atlas-start-sequencing";
    if (!planDraft.atlasStartAttempted && planDraft.atlasStartAuthorized) return "canvas-plan-directed-atlas-start-consumption";
    if (planDraft.waterConnectorProof && planDraft.waterConnectorProof.waterChildLoadFailureCoordinate === C_COORDINATES.C4_SCRIPT_NETWORK_LOAD_FAILURE) return "water-child-served-load-coordinate";
    if (planDraft.coherentExpressionPass === false) return "coherent-expression-diagnostic-target";
    return "none";
  }

  function normalizeLedger(input = {}, options = {}) {
    if (input.runtimeTableLedger || input.ledger) return input.runtimeTableLedger || input.ledger;

    if (options.ledger) return options.ledger;

    if (options.runHearthTable !== false) {
      const table = createHearthChannelTable(options.tableOptions || {});
      return table.run(input.samplePoint || DEFAULT_SAMPLE_POINT);
    }

    return null;
  }

  function createVisualCarrierPlan(input = {}, options = {}) {
    const ledger = normalizeLedger(input, options);
    const records = getRuntimeRecordsByKey(ledger);

    const channelPlan = {
      land: normalizeChildPlan("land", records.land, findChannelLoadResult(input, "land"), HEARTH_CONTRACTS.land),
      water: normalizeChildPlan("water", records.water, findChannelLoadResult(input, "water"), HEARTH_CONTRACTS.water),
      air: normalizeChildPlan("air", records.air, findChannelLoadResult(input, "air"), HEARTH_CONTRACTS.air)
    };

    const waterConnectorProof = extractWaterProof(input, channelPlan.water);
    channelPlan.water.coordinate = waterConnectorProof.waterValidationOk
      ? C_COORDINATES.C11_CHILD_VALIDATED
      : waterConnectorProof.waterChildLoadFailureCoordinate || channelPlan.water.coordinate;
    channelPlan.water.validationOk = Boolean(waterConnectorProof.waterValidationOk);
    channelPlan.water.contractOk = Boolean(waterConnectorProof.waterContractOk);
    channelPlan.water.fallback = !waterConnectorProof.waterValidationOk;

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
    if (channelPlan.land.blocking || channelPlan.land.rejected) structuralBlockers.push("land-structural-block");
    if (channelPlan.air.blocking || channelPlan.air.rejected) structuralBlockers.push("air-structural-block");

    const visualCarrierAllowed = structuralBlockers.length === 0;
    const visualizationBlocked = !visualCarrierAllowed;
    const visualizationBlockReason = structuralBlockers.join(",");

    const waterFailureDoesNotBlockAtlas = true;
    const atlasStructuralBlockers = [];
    if (!visualCarrierAllowed) atlasStructuralBlockers.push("visual-carrier-blocked");
    if (!projectionSafe) atlasStructuralBlockers.push("projection-unsafe");
    if (channelPlan.land.blocking || channelPlan.land.rejected) atlasStructuralBlockers.push("land-blocking-or-rejected");
    if (channelPlan.air.blocking || channelPlan.air.rejected) atlasStructuralBlockers.push("air-blocking-or-rejected");

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
        : waterConnectorProof.waterValidationOk
          ? "fallback-shell"
          : "fallback-diagnostic";

    const visualDiagnosticStatus = visualizationBlocked
      ? "BLOCKING"
      : waterConnectorProof.waterValidationOk && atlasStartAuthorized
        ? "READY"
        : "DEGRADED";

    const visualDiagnosticCue = visualizationBlocked
      ? "VISUAL_CARRIER_BLOCKED"
      : !atlasStartAuthorized
        ? "ATLAS_START_BLOCKED"
        : !waterConnectorProof.waterValidationOk
          ? "WATER_CHILD_LOAD_FAILURE"
          : "ATLAS_START_AUTHORIZED";

    const planDraft = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      planContract: "LAB_RUNTIME_TABLE_PROCEDURAL_VISUAL_CARRIER_PLAN_v3",
      planReceipt: "LAB_RUNTIME_TABLE_PROCEDURAL_VISUAL_CARRIER_PLAN_RECEIPT_v3",
      version: VERSION,
      authority: "runtime-table-procedural-plan-authority",
      planGenerated: true,
      planValid: Boolean(ledger),
      planGeneratedAt: nowIso(),
      runtimeTableContract: CONTRACT,
      runtimeTableReceipt: RECEIPT,
      runtimeTablePreviousContract: PREVIOUS_CONTRACT,
      runtimeCoordinate,
      visualCoordinate,
      atlasStartCoordinate,
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
      atlasStartMode: atlasStartAuthorized ? (channelPlan.water.validationOk ? "full-child-atlas" : "degraded-fallback-water-atlas") : "blocked",
      atlasStartAttempted,
      atlasStartActive: atlasStartAttempted && !atlasReady,
      atlasBuilderEntered,
      atlasProgressObserved,
      atlasProgressFirstValue: safeNumber(input.atlasProgressFirstValue ?? renderMetadata.atlasProgressFirstValue, 0),
      atlasProgressLastValue: safeNumber(input.atlasProgressLastValue ?? renderMetadata.atlasProgressLastValue ?? renderMetadata.atlasProgress, 0),
      atlasStartBlockedReason,
      waterFailureDoesNotBlockAtlas,
      externalStatusCallbackSafe: safeBool(input.externalStatusCallbackSafe, true),
      externalStatusCallbackErrors: Array.isArray(input.externalStatusCallbackErrors) ? input.externalStatusCallbackErrors.slice() : [],
      coherentExpressionEligible: visualCarrierAllowed && projectionSafe,
      coherentExpressionPass: false,
      visualPassClaimed: false,
      channelPlan,
      waterConnectorProof,
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
      renderMetadata,
      imageRendered: safeBool(input.imageRendered, safeBool(renderMetadata.imageRendered, false)),
      canvasReceipt: input.canvasReceipt || {
        contract: HEARTH_CONTRACTS.canvas,
        visualPassClaimed: false,
        sphereContainment: projectionSafe,
        outsideSphereTransparent: projectionSafe,
        noRectangularTextureSpill: projectionSafe,
        projectionReady
      },
      landSample: input.landSample || (channelPlan.land && channelPlan.land.sample) || {},
      waterSample: input.waterSample || (channelPlan.water && channelPlan.water.sample) || {},
      airSample: input.airSample || (channelPlan.air && channelPlan.air.sample) || {}
    }, options);

    planDraft.coherentExpressionPass = Boolean(diagnostic.coherentExpressionPass);
    planDraft.coherenceStatus = diagnostic.coherenceStatus;
    planDraft.coherenceScore = diagnostic.coherenceScore;
    planDraft.tripleGCheckpoints = diagnostic.checkpoints;
    planDraft.failedCheckpoints = diagnostic.failedCheckpoints;
    planDraft.warningCheckpoints = diagnostic.warningCheckpoints;
    planDraft.renewalTargets = diagnostic.renewalTargets;
    planDraft.nextStrategy = diagnostic.nextStrategy;
    planDraft.firstFailedCoordinate = chooseFirstFailedCoordinate(channelPlan, atlasStartCoordinate, runtimeCoordinate);
    planDraft.recommendedNextRenewalTarget = chooseRenewalTarget(planDraft);

    if (planDraft.atlasStartAuthorized && !planDraft.atlasStartAttempted) {
      planDraft.firstFailedCoordinate = A_COORDINATES.A1_ATLAS_START_AUTHORIZED;
      planDraft.recommendedNextRenewalTarget = "canvas-plan-directed-atlas-start-consumption";
    }

    return planDraft;
  }

  function createHearthVisualCarrierPlan(input = {}, options = {}) {
    return createVisualCarrierPlan({
      samplePoint: DEFAULT_SAMPLE_POINT,
      ...input
    }, {
      profile: "hearth-channel-expression",
      ...options
    });
  }

  function runProceduralPlan(input = {}, options = {}) {
    return createVisualCarrierPlan(input, options);
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-visual-carrier-atlas-sequence-standard",
      destinationFile: "/assets/lab/runtime-table.js",
      status: "active",
      role: "reusable-runtime-preparation-coherence-diagnostic-and-procedural-carrier-plan-equipment",
      labEquipment: true,
      runtimeTable: true,
      tripleGDiagnostic: true,
      visualCarrierPlanAuthority: true,
      atlasStartPlanAuthority: true,
      coherentExpressionDiagnostic: true,
      purpose: "set the table before runtime performs, generate a procedural visual-carrier plan, authorize atlas start, and verify whether rendered expression coheres with the goal profile",
      runtimeTableSequence: [
        "validate",
        "coordinate",
        "optimize",
        "audit",
        "resolve",
        "handoff"
      ],
      proceduralPlanSequence: [
        "runtime-coordinate-classification",
        "visual-carrier-eligibility",
        "channel-plan-normalization",
        "water-connector-proof-normalization",
        "atlas-start-authorization",
        "coherence-diagnostic-aggregation",
        "first-failed-coordinate-selection",
        "renewal-target-selection",
        "plan-export"
      ],
      tripleGSequence: [
        "visual-carrier-eligibility-check",
        "receipt-verification",
        "coordinate-body-check",
        "land-body-binding-check",
        "water-surface-seating-check",
        "air-authority-check",
        "channel-separation-check",
        "projection-seating-check",
        "contrast-visibility-check",
        "distribution-shape-check",
        "atlas-start-authorization-check",
        "coherent-expression-check"
      ],
      coordinates: {
        runtime: clonePlain(R_COORDINATES),
        visualCarrier: clonePlain(V_COORDINATES),
        atlas: clonePlain(A_COORDINATES),
        child: clonePlain(C_COORDINATES)
      },
      statuses: Object.values(STATUS),
      handoffClasses: Object.values(HANDOFF),
      coherenceStatuses: Object.values(COHERENCE_STATUS),
      coherenceChecks: Object.values(COHERENCE_CHECKS),
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
        "createGoalProfile"
      ],
      addedExports: [
        "createVisualCarrierPlan",
        "createHearthVisualCarrierPlan",
        "runProceduralPlan",
        "R_COORDINATES",
        "V_COORDINATES",
        "A_COORDINATES",
        "C_COORDINATES"
      ],
      reusableFor: [
        "Hearth channel rendering",
        "Audralia rendering",
        "Showroom planets",
        "orbit systems",
        "interactive gems",
        "Map Portal",
        "Frontier figure-eight systems",
        "Guide Desk route-choice mechanics",
        "multi-child animation families"
      ],
      coreLaw: [
        "Runtime Table decides procedural readiness",
        "Canvas consumes the plan and expresses locally",
        "constructionReady is not coherentExpressionPass",
        "imageRendered is not coherentExpressionPass",
        "coherentExpressionPass is not visualPassClaimed",
        "Water Child failure degrades coherence but does not automatically erase visualization",
        "Water Child C4 does not automatically block atlas start",
        "visualization blocks only when carrier structure is unsafe",
        "checkpoint receipts must include math and renewal targets"
      ],
      owns: [
        "runtime-table-child-validation",
        "triple-g-coherence-diagnostic",
        "visual-carrier-eligibility-law",
        "atlas-start-authorization-law",
        "fallback-degraded-full-mode-classification",
        "first-failed-coordinate-selection",
        "recommended-renewal-target-selection",
        "procedural-plan-export"
      ],
      doesNotOwn: [
        "truth",
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
      visualPassClaimed: false
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

    createTable,
    createHearthChannelTable,
    RuntimeTable,

    createGoalProfile,
    createTripleGDiagnostic,
    createHearthCoherenceDiagnostic,
    runCoherenceDiagnostic,

    createVisualCarrierPlan,
    createHearthVisualCarrierPlan,
    runProceduralPlan,

    getReceipt,

    labEquipment: true,
    runtimeTable: true,
    tripleGDiagnostic: true,
    coherentExpressionDiagnostic: true,
    visualCarrierPlanAuthority: true,
    atlasStartPlanAuthority: true,
    validatesBeforeExpression: true,
    coordinatesBeforeRuntimePerforms: true,
    verifiesCoherenceAfterRender: true,
    generatesProceduralPlan: true,
    imageRenderedIsNotCoherencePass: true,
    constructionReadyIsNotCoherencePass: true,
    coherentExpressionPassIsNotVisualPassClaim: true,
    waterFailureDoesNotBlockAtlas: true,
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

  root.LAB_RUNTIME_TABLE = api;
  root.DexterRuntimeTable = api;
  root.RUNTIME_TABLE = api;
  root.LAB_TRIPLE_G_DIAGNOSTIC = api;
  root.TripleGDiagnostic = api;
  root.LAB_VISUAL_CARRIER_PLAN_AUTHORITY = api;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.labRuntimeTableLoaded = "true";
    dataset.labRuntimeTableContract = CONTRACT;
    dataset.labRuntimeTablePreviousContract = PREVIOUS_CONTRACT;
    dataset.labRuntimeTableBaselineContract = BASELINE_CONTRACT;
    dataset.labRuntimeTableReceipt = RECEIPT;
    dataset.labRuntimeTableEquipment = "true";
    dataset.labTripleGDiagnosticLoaded = "true";
    dataset.labTripleGDiagnosticContract = CONTRACT;
    dataset.labVisualCarrierPlanAuthorityLoaded = "true";
    dataset.labVisualCarrierPlanAuthorityContract = CONTRACT;
    dataset.runtimeTableReusable = "true";
    dataset.tripleGDiagnosticReusable = "true";
    dataset.runtimeTableDoesNotOwnTruth = "true";
    dataset.runtimeTableOwnsProceduralPlan = "true";
    dataset.visualCarrierPlanAuthority = "true";
    dataset.atlasStartPlanAuthority = "true";
    dataset.waterFailureDoesNotBlockAtlas = "true";
    dataset.visualizationBlocksOnlyWhenCarrierUnsafe = "true";
    dataset.imageRenderedIsNotCoherencePass = "true";
    dataset.constructionReadyIsNotCoherencePass = "true";
    dataset.coherentExpressionPassIsNotVisualPassClaim = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
