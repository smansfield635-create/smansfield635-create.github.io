// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1
// New reusable lab equipment.
// Runtime Table standard only.
// Purpose:
// - Provide a reusable pre-runtime coordination layer for dynamic animation systems.
// - Validate child authorities before visible runtime expression.
// - Coordinate shared coordinate bodies.
// - Optimize construction budgets.
// - Audit failures without false readiness.
// - Resolve handoff as FULL_PASS, OPTIMIZED_PASS, DEGRADED_PASS, FALLBACK_PASS, REJECTED, or BLOCKING.
// Does not own:
// - page truth
// - child channel truth
// - rendering truth
// - animation meaning
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_RECEIPT_v1";
  const VERSION = "2026-05-29.lab-runtime-table-multi-function-animation-standard-v1";

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

  const DEFAULT_COORDINATES = Object.freeze(["u", "v", "x", "y", "z"]);

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

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return { ...value };
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
    const required = asArray(requiredCoordinates).length
      ? asArray(requiredCoordinates)
      : DEFAULT_COORDINATES.slice();

    const missing = [];

    required.forEach((key) => {
      if (!Number.isFinite(Number(packet && packet[key]))) {
        missing.push(key);
      }
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
    const lawList = asArray(laws);

    lawList.forEach((law) => {
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
    if (!sampleResult.ok) {
      return options.sampleFailureBlocking === true ? STATUS.BLOCKING : STATUS.FALLBACK;
    }

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

        const status = severity;
        const optimization = optimizeBudget(status, registration.budget);

        return {
          key: registration.key,
          name: registration.name,
          status: optimization.status,
          rawStatus: status,
          authorityPresent: false,
          contractOk: false,
          methodsOk: false,
          coordinatesOk: false,
          lawsOk: false,
          sampleOk: false,
          sampleMethod: "",
          sample: null,
          receipt: null,
          issues,
          budget: optimization.budget,
          optimizationReason: optimization.reason,
          rejected: status === STATUS.REJECTED,
          blocking: status === STATUS.BLOCKING,
          fallback: status === STATUS.FALLBACK,
          optimized: optimization.status === STATUS.OPTIMIZED,
          degraded: status === STATUS.DEGRADED,
          ready: false,
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

      const laws = sampleResult.ok
        ? lawCheck(sampleResult.sample, registration.laws)
        : { ok: false, issues: [] };

      issues.push(...laws.issues);

      const rawStatus = decideStatus(issues, sampleResult, registration);
      const optimization = optimizeBudget(rawStatus, registration.budget);

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
        rejected: rawStatus === STATUS.REJECTED,
        blocking: rawStatus === STATUS.BLOCKING,
        fallback: rawStatus === STATUS.FALLBACK || optimization.status === STATUS.FALLBACK,
        optimized: optimization.status === STATUS.OPTIMIZED,
        degraded: rawStatus === STATUS.DEGRADED,
        ready: optimization.status === STATUS.READY,
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
          issues: record.issues.map((issue) => issue.code)
        }))
      });

      return reportLedger();
    }

    function reportLedger() {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
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
          blocking: record.blocking
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

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
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

      get state() {
        return state;
      },

      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
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
      expectedContract: "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1",
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
      expectedContract: "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
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
      expectedContract: "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1",
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

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "lab-runtime-table-standard",
      destinationFile: "/assets/lab/runtime-table.js",
      status: "active",
      role: "reusable-runtime-preparation-equipment",
      labEquipment: true,
      runtimeTable: true,
      purpose: "set the table before runtime performs in multi-function animation systems",
      sequence: [
        "validate",
        "coordinate",
        "optimize",
        "audit",
        "resolve",
        "handoff"
      ],
      statuses: Object.values(STATUS),
      handoffClasses: Object.values(HANDOFF),
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
      doesNotOwn: [
        "truth",
        "channel meaning",
        "route orchestration",
        "runtime motion",
        "final visual pass claim"
      ],
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,

    STATUS,
    HANDOFF,

    createTable,
    createHearthChannelTable,
    RuntimeTable,
    getReceipt,

    labEquipment: true,
    runtimeTable: true,
    validatesBeforeExpression: true,
    coordinatesBeforeRuntimePerforms: true,
    doesNotOwnTruth: true,
    visualPassClaimed: false
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.runtimeTable = api;

  root.LAB_RUNTIME_TABLE = api;
  root.DexterRuntimeTable = api;
  root.RUNTIME_TABLE = api;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.labRuntimeTableLoaded = "true";
    root.document.documentElement.dataset.labRuntimeTableContract = CONTRACT;
    root.document.documentElement.dataset.labRuntimeTableReceipt = RECEIPT;
    root.document.documentElement.dataset.labRuntimeTableEquipment = "true";
    root.document.documentElement.dataset.runtimeTableReusable = "true";
    root.document.documentElement.dataset.runtimeTableDoesNotOwnTruth = "true";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
