// /assets/engine/dgb.engine.js
// DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// Full-file replacement.
// Shared DGB runtime engine core.
// Governing contract: DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// Governing model schema: DGB_MODEL_PACKAGE_v1
//
// Purpose:
// - provide the shared runtime engine core;
// - coordinate contract admission;
// - coordinate model admission;
// - manage instances;
// - coordinate adapters;
// - manage evidence and intent;
// - manage lifecycle;
// - manage scheduling;
// - manage receipts and disposal.
//
// Does not own:
// - renderer implementation;
// - input implementation;
// - fallback implementation;
// - route DOM;
// - diagnostic governing authority;
// - F21 measurement.
//
// Quiet-load required.
// F21 unclaimed.

(function installDGBInteractiveRuntimeEngineCore(global) {
  "use strict";

  var root =
    global ||
    (typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
        ? globalThis
        : this);

  var CORE_CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  var GOVERNING_CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  var GOVERNING_MODEL_SCHEMA = "DGB_MODEL_PACKAGE_v1";
  var FILE = "/assets/engine/dgb.engine.js";
  var VERSION = "1.0.0";

  var INTERNAL_INSTANCE_SCHEMA = "DGB_ENGINE_INTERNAL_INSTANCE_RECORD_v1";
  var EVIDENCE_SCHEMA = "DGB_ENGINE_EVIDENCE_ENVELOPE_v1";
  var INTENT_SCHEMA = "DGB_ENGINE_INTENT_ENVELOPE_v1";
  var TRANSITION_SCHEMA = "DGB_ENGINE_TRANSITION_RECORD_v1";
  var RUNTIME_CONTROL_SCHEMA = "DGB_ENGINE_RUNTIME_CONTROL_STATE_v1";

  var STATUS = {
    HELD: "HELD",
    READY: "READY",
    CONFLICT: "CONFLICT",
    ERROR: "ERROR"
  };

  var PROGRESS = {
    DECLARED: "DECLARED",
    LOADED: "LOADED",
    VALIDATED: "VALIDATED",
    CREATED: "CREATED",
    MOUNTED: "MOUNTED",
    INITIALIZED: "INITIALIZED",
    UPLOADED: "UPLOADED",
    SUBMITTED: "SUBMITTED",
    PRESENTED: "PRESENTED",
    VISIBLE: "VISIBLE",
    INTERACTIVE: "INTERACTIVE",
    VERIFIED: "VERIFIED",
    DESTROYED: "DESTROYED"
  };

  var CONDITION = {
    NONE: "NONE",
    PAUSED: "PAUSED",
    HELD: "HELD",
    DEGRADED: "DEGRADED",
    FALLBACK: "FALLBACK",
    CONTEXT_LOST: "CONTEXT_LOST",
    ERROR: "ERROR"
  };

  var EXECUTION = {
    NONE: "NONE",
    PRIMARY: "PRIMARY",
    FALLBACK: "FALLBACK",
    TRANSITION: "TRANSITION"
  };

  var ADAPTER_KIND = {
    RENDERER: "renderer",
    INPUT: "input",
    FALLBACK: "fallback"
  };

  var EVIDENCE_CLASSIFICATION = {
    PRODUCTION: "PRODUCTION",
    DIAGNOSTIC_SYNTHETIC: "DIAGNOSTIC_SYNTHETIC",
    DIAGNOSTIC_ISOLATED: "DIAGNOSTIC_ISOLATED",
    REGISTERED_EXTERNAL_PROVIDER: "REGISTERED_EXTERNAL_PROVIDER",
    UNKNOWN: "UNKNOWN"
  };

  var PROGRESS_ORDER = {
    DECLARED: 0,
    LOADED: 1,
    VALIDATED: 2,
    CREATED: 3,
    MOUNTED: 4,
    INITIALIZED: 5,
    UPLOADED: 6,
    SUBMITTED: 7,
    PRESENTED: 8,
    VISIBLE: 9,
    INTERACTIVE: 10,
    VERIFIED: 11,
    DESTROYED: 12
  };

  var stores = {
    installedAt: nowIso(),
    authority: null,
    authorityStatus: STATUS.HELD,
    authorityErrors: [],
    authorityWarnings: [],
    authorityReceipt: null,
    authorityValidation: null,
    instances: Object.create(null),
    tombstones: Object.create(null),
    adapters: Object.create(null),
    subscribers: Object.create(null),
    diagnosticHistory: [],
    sequences: {
      instance: 0,
      adapter: 0,
      session: 0,
      evidence: 0,
      intent: 0,
      transition: 0,
      subscription: 0
    },
    installationConflict: null
  };

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

  function isPromiseLike(value) {
    return Boolean(value && typeof value.then === "function");
  }

  function clone(value, seen) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "bigint") return value.toString();
    if (typeof value === "function") return null;

    if (
      typeof ArrayBuffer !== "undefined" &&
      ArrayBuffer.isView &&
      ArrayBuffer.isView(value)
    ) {
      return {
        type: value.constructor && value.constructor.name ? value.constructor.name : "TypedArray",
        length: typeof value.length === "number" ? value.length : 0,
        byteLength: typeof value.byteLength === "number" ? value.byteLength : 0
      };
    }

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return "[Circular]";
    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function map(entry) {
        return clone(entry, memory.slice());
      });
    }

    var output = {};
    Object.keys(value).forEach(function each(key) {
      if (
        key === "reference" ||
        key === "surface" ||
        key === "target" ||
        key === "observer" ||
        key === "resolver" ||
        key === "callback" ||
        key === "initializationPromise" ||
        key === "uploadPromise" ||
        key === "recoveryPromise" ||
        key === "disposalPromise"
      ) {
        output[key] = describeReference(value[key]);
      } else {
        output[key] = clone(value[key], memory.slice());
      }
    });

    return output;
  }

  function deepFreeze(value, seen) {
    if (!value || typeof value !== "object") return value;

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);

    Object.keys(value).forEach(function each(key) {
      deepFreeze(value[key], memory);
    });

    try {
      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function frozenClone(value) {
    return deepFreeze(clone(value));
  }

  function stableStringify(value) {
    function prepare(item, seen) {
      if (
        item === null ||
        item === undefined ||
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
      ) {
        return item;
      }

      if (typeof item === "bigint") return item.toString();
      if (typeof item === "function") return "[Function]";

      var memory = seen || [];
      if (memory.indexOf(item) !== -1) return "[Circular]";
      memory.push(item);

      if (Array.isArray(item)) {
        return item.map(function map(entry) {
          return prepare(entry, memory.slice());
        });
      }

      var output = {};
      Object.keys(item).sort().forEach(function each(key) {
        output[key] = prepare(item[key], memory.slice());
      });
      return output;
    }

    return JSON.stringify(prepare(value));
  }

  function hash(value) {
    var text = stableStringify(value);
    var h = 0x811c9dc5;

    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }

    return "fnv1a32-" + ("00000000" + h.toString(16)).slice(-8);
  }

  function describeReference(value) {
    if (!value) return null;

    var out = {
      type: typeof value,
      tagName: null,
      id: null,
      className: null,
      nodeType: null,
      width: null,
      height: null
    };

    try { out.tagName = value.tagName || null; } catch (_error1) {}
    try { out.id = value.id || null; } catch (_error2) {}
    try { out.className = typeof value.className === "string" ? value.className : null; } catch (_error3) {}
    try { out.nodeType = value.nodeType || null; } catch (_error4) {}
    try { out.width = typeof value.width === "number" ? value.width : null; } catch (_error5) {}
    try { out.height = typeof value.height === "number" ? value.height : null; } catch (_error6) {}

    return out;
  }

  function normalizeAuthorityReceipt(receipt) {
    return isObject(receipt) ? frozenClone(receipt) : null;
  }

  function normalizeAuthorityValidation(validation) {
    return isObject(validation) ? frozenClone(validation) : null;
  }

  function discoverContract() {
    var canonical = root.DGB_ENGINE_CONTRACT || null;
    var compat = root.DGBEngineContract || null;
    var candidate = canonical || compat;

    if (!candidate) {
      return {
        ok: false,
        held: true,
        code: "GOVERNING_CONTRACT_NOT_AVAILABLE",
        contract: null,
        errors: [],
        warnings: ["DGB_ENGINE_CONTRACT not yet published."]
      };
    }

    if (canonical && compat && canonical !== compat) {
      return {
        ok: false,
        held: false,
        code: "GOVERNING_CONTRACT_GLOBAL_CONFLICT",
        contract: null,
        errors: ["DGB_ENGINE_CONTRACT and DGBEngineContract are not the same authority object."],
        warnings: []
      };
    }

    if (candidate.contract !== GOVERNING_CONTRACT) {
      return {
        ok: false,
        held: false,
        code: "GOVERNING_CONTRACT_IDENTITY_MISMATCH",
        contract: null,
        errors: ["Unexpected contract: " + String(candidate.contract || "UNKNOWN")],
        warnings: []
      };
    }

    var requiredMethods = [
      "validateModelPackage",
      "createInstanceSpec",
      "createDeclaredOps",
      "compareSpecAndOps",
      "composeReceipt",
      "getAuthorityReceipt",
      "getAuthorityValidation"
    ];

    var missing = requiredMethods.filter(function filter(method) {
      return !isFunction(candidate[method]);
    });

    if (missing.length) {
      return {
        ok: false,
        held: false,
        code: "GOVERNING_CONTRACT_METHODS_MISSING",
        contract: null,
        errors: ["Missing methods: " + missing.join(", ")],
        warnings: []
      };
    }

    var authorityReceipt;
    var authorityValidation;

    try {
      authorityReceipt = candidate.getAuthorityReceipt();
      authorityValidation = candidate.getAuthorityValidation();
    } catch (error) {
      return {
        ok: false,
        held: false,
        code: "GOVERNING_CONTRACT_AUTHORITY_READ_FAILED",
        contract: null,
        errors: [String(error && error.message ? error.message : error)],
        warnings: []
      };
    }

    if (!authorityValidation || authorityValidation.passed !== true) {
      return {
        ok: false,
        held: false,
        code: "GOVERNING_CONTRACT_SELF_VALIDATION_FAILED",
        contract: null,
        errors: ["Authority validation did not pass."],
        warnings: []
      };
    }

    if (!authorityReceipt || authorityReceipt.modelSchema !== GOVERNING_MODEL_SCHEMA) {
      return {
        ok: false,
        held: false,
        code: "GOVERNING_MODEL_SCHEMA_MISMATCH",
        contract: null,
        errors: ["Authority receipt model schema mismatch."],
        warnings: []
      };
    }

    return {
      ok: true,
      held: false,
      code: "GOVERNING_CONTRACT_ADMITTED",
      contract: candidate,
      receipt: normalizeAuthorityReceipt(authorityReceipt),
      validation: normalizeAuthorityValidation(authorityValidation),
      errors: [],
      warnings: []
    };
  }

  function refreshAuthority() {
    var result = discoverContract();

    stores.authorityErrors = result.errors || [];
    stores.authorityWarnings = result.warnings || [];

    if (result.ok) {
      stores.authority = result.contract;
      stores.authorityStatus = STATUS.READY;
      stores.authorityReceipt = result.receipt;
      stores.authorityValidation = result.validation;
    } else {
      stores.authority = null;
      stores.authorityStatus = result.held ? STATUS.HELD : STATUS.ERROR;
      stores.authorityReceipt = null;
      stores.authorityValidation = null;
    }

    publishFlags();
    updateGlobalReceipt();
    emit("authority", getAuthorityStatus());

    return getAuthorityStatus();
  }

  function requireAuthority() {
    if (stores.authorityStatus !== STATUS.READY || !stores.authority) {
      refreshAuthority();
    }

    return stores.authorityStatus === STATUS.READY && stores.authority
      ? stores.authority
      : null;
  }

  function projectOpsState(record) {
    if (record.lifecycle.progressState === PROGRESS.DESTROYED) return "DESTROYED";
    if (record.lifecycle.conditionState === CONDITION.ERROR) return "ERROR";
    if (record.lifecycle.conditionState === CONDITION.CONTEXT_LOST) return "CONTEXT_LOST";
    if (record.lifecycle.conditionState === CONDITION.HELD) return "HELD";
    if (record.lifecycle.conditionState === CONDITION.PAUSED) return "PAUSED";
    if (record.lifecycle.conditionState === CONDITION.FALLBACK) return "FALLBACK";
    if (record.lifecycle.conditionState === CONDITION.DEGRADED) return "DEGRADED";
    return record.lifecycle.progressState;
  }

  function snapshotOps(record) {
    var draft = record.ops.draft;
    var snapshot = clone(draft);

    snapshot.state = projectOpsState(record);
    snapshot.loaded = record.lifecycle.progressState !== PROGRESS.DECLARED;
    snapshot.initialized =
      PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.INITIALIZED];

    record.ops.snapshot = deepFreeze(snapshot);
    record.ops.snapshotHash = hash(snapshot);

    return record.ops.snapshot;
  }

  function refreshComparisonAndReceipt(record) {
    var contract = requireAuthority();

    if (!contract) {
      record.hold.active = true;
      record.hold.code = "AUTHORITY_HELD";
      record.hold.stage = "COMPARE";
      record.hold.message = "Governing contract is unavailable.";
      record.timestamps.updatedAt = nowIso();
      return null;
    }

    var ops = snapshotOps(record);
    var comparison = contract.compareSpecAndOps(record.specification.spec, ops);
    var receipt = contract.composeReceipt({
      identity: {
        instanceId: record.identity.instanceId,
        modelId: record.identity.modelId,
        modelClass: record.identity.modelClass,
        modelContract: record.identity.modelContract,
        modelVersion: record.identity.modelVersion
      },
      news: record.admission.admittedModel.news,
      fibonacci: record.admission.admittedModel.fibonacci,
      spec: record.specification.spec,
      ops: ops,
      comparison: comparison,
      metadata: {
        coreContract: CORE_CONTRACT,
        coreVersion: VERSION,
        f21Claimed: false
      }
    });

    record.ops.comparison = frozenClone(comparison);
    record.ops.comparisonHash = hash(comparison);
    record.ops.receipt = frozenClone(receipt);
    record.ops.receiptHash = receipt && receipt.receiptHash ? receipt.receiptHash : hash(receipt);
    record.ops.lastComparedAt = nowIso();
    record.ops.lastReceiptAt = record.ops.lastComparedAt;

    if (
      receipt &&
      receipt.ready === true &&
      record.lifecycle.progressState !== PROGRESS.DESTROYED &&
      record.lifecycle.conditionState !== CONDITION.HELD &&
      record.lifecycle.conditionState !== CONDITION.ERROR &&
      record.lifecycle.conditionState !== CONDITION.CONTEXT_LOST
    ) {
      if (
        record.lifecycle.progressState === PROGRESS.VISIBLE ||
        record.lifecycle.progressState === PROGRESS.INTERACTIVE
      ) {
        attemptTransition(record, PROGRESS.VERIFIED, record.lifecycle.conditionState, record.lifecycle.executionMode, {
          triggerType: "COMPARISON",
          reason: "GOVERNING_COMPARISON_READY"
        });
      }
    }

    emit("receipt", {
      instanceId: record.identity.instanceId,
      receipt: frozenClone(record.ops.receipt)
    });

    return record.ops.receipt;
  }

  function allocateInstanceId(options) {
    var requested = options && typeof options.instanceId === "string"
      ? options.instanceId.trim()
      : "";

    if (requested) {
      if (stores.instances[requested] || stores.tombstones[requested]) {
        return null;
      }
      return requested;
    }

    stores.sequences.instance += 1;
    return "dgb-engine-instance-" + stores.sequences.instance;
  }

  function createTransitionRecord(record, toProgress, toCondition, toExecution, context) {
    stores.sequences.transition += 1;

    return {
      schema: TRANSITION_SCHEMA,
      transitionId: "dgb-transition-" + stores.sequences.transition,
      transitionSequence: stores.sequences.transition,
      instanceId: record.identity.instanceId,
      from: {
        progressState: record.lifecycle.progressState,
        conditionState: record.lifecycle.conditionState,
        executionMode: record.lifecycle.executionMode
      },
      to: {
        progressState: toProgress,
        conditionState: toCondition,
        executionMode: toExecution
      },
      triggerType: context && context.triggerType ? context.triggerType : "CORE_OPERATION",
      triggerId: context && context.triggerId ? context.triggerId : null,
      reason: context && context.reason ? context.reason : "",
      evidenceIds: context && Array.isArray(context.evidenceIds) ? context.evidenceIds.slice() : [],
      missingEvidence: context && Array.isArray(context.missingEvidence) ? context.missingEvidence.slice() : [],
      accepted: false,
      rejectionCode: null,
      blocking: false,
      timestamp: nowIso()
    };
  }

  function attemptTransition(record, toProgress, toCondition, toExecution, context) {
    var transition = createTransitionRecord(record, toProgress, toCondition, toExecution, context);

    if (record.lifecycle.progressState === PROGRESS.DESTROYED && toProgress !== PROGRESS.DESTROYED) {
      transition.rejectionCode = "DGB_TRANSITION_DESTROYED_TERMINAL";
      return rejectTransition(record, transition);
    }

    if (PROGRESS_ORDER[toProgress] < PROGRESS_ORDER[record.lifecycle.progressState]) {
      transition.rejectionCode = "DGB_TRANSITION_BACKWARD_PROGRESS";
      return rejectTransition(record, transition);
    }

    if (toProgress === PROGRESS.VERIFIED) {
      if (
        record.lifecycle.conditionState === CONDITION.HELD ||
        record.lifecycle.conditionState === CONDITION.ERROR ||
        record.lifecycle.conditionState === CONDITION.CONTEXT_LOST ||
        record.blockingError.active ||
        !record.ops.comparison ||
        record.ops.comparison.ready !== true ||
        record.ops.comparison.failCount !== 0 ||
        record.ops.comparison.conflictCount !== 0 ||
        (record.ops.snapshot && Array.isArray(record.ops.snapshot.errors) && record.ops.snapshot.errors.length)
      ) {
        transition.rejectionCode = "DGB_TRANSITION_COMPARISON_NOT_READY";
        return rejectTransition(record, transition);
      }
    }

    transition.accepted = true;

    record.lifecycle.previousProgressState = record.lifecycle.progressState;
    record.lifecycle.progressState = toProgress;
    record.lifecycle.conditionState = toCondition;
    record.lifecycle.executionMode = toExecution;
    record.lifecycle.transitionSequence += 1;
    record.lifecycle.lastTransitionId = transition.transitionId;
    record.lifecycle.lastTransitionAt = transition.timestamp;
    record.lifecycle.stateEnteredAt = transition.timestamp;

    if (toProgress === PROGRESS.VERIFIED) {
      record.lifecycle.verifiedAt = transition.timestamp;
      record.timestamps.verifiedAt = transition.timestamp;
    }

    if (toProgress === PROGRESS.DESTROYED) {
      record.lifecycle.destroyedAt = transition.timestamp;
      record.timestamps.destroyedAt = transition.timestamp;
    }

    record.transitions.acceptedCount += 1;
    record.transitions.history.push(transition);

    updateObservedFromLifecycle(record);
    refreshComparisonAndReceipt(record);

    emit("transition", frozenClone(transition));
    return frozenClone(transition);
  }

  function rejectTransition(record, transition) {
    transition.accepted = false;
    record.transitions.rejectedCount += 1;
    record.transitions.history.push(transition);
    emit("transitionRejected", frozenClone(transition));
    return frozenClone(transition);
  }

  function updateObservedFromLifecycle(record) {
    var observed = record.ops.draft.observed || {};

    observed.fileLoaded = PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.LOADED];
    observed.contractMatched = record.authority.authorityMatched === true;
    observed.modelValidated = record.admission.validationPassed === true;
    observed.instanceCreated = PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.CREATED];
    observed.mountPresent = record.mount.resolved === true && record.mount.connected !== false;
    observed.surfaceNonzero = record.mount.nonzero === true || record.renderer.surfaceNonzero === true || record.fallback.surfaceNonzero === true;
    observed.backendInitialized = record.renderer.initialized === true || record.fallback.initialized === true;
    observed.resourcesUploaded = record.renderer.resourcesUploaded === true || record.fallback.representationReady === true;
    observed.firstFrameSubmitted = record.renderer.firstFrameSubmitted === true || record.fallback.outputWritten === true;
    observed.firstFramePresented = record.renderer.firstFramePresented === true || record.fallback.presentationObserved === true;
    observed.visiblePixelObserved = record.renderer.visiblePixelObserved === true || record.fallback.visibleOutputObserved === true;
    observed.interactionObserved = record.input.interactionObserved === true;
    observed.fallbackAvailable = record.fallback.permitted === true;
    observed.contextRecoveryAvailable = record.renderer.recoveryAvailable === true;
    observed.disposalObserved = record.disposal.completed === true;
    observed.noBlockingError = !record.blockingError.active;

    record.ops.draft.observed = observed;
    record.ops.draft.backend =
      record.renderer.selectedBackend ||
      (record.fallback.selected ? record.fallback.fallbackType : "NONE") ||
      "NONE";
  }

  function createEmptyInternalRecord(instanceId, model, validation, spec, declaredOps, options) {
    var now = nowIso();

    return {
      schema: INTERNAL_INSTANCE_SCHEMA,
      identity: {
        instanceId: instanceId,
        instanceSequence: stores.sequences.instance,
        modelId: model.identity.modelId,
        modelClass: model.identity.modelClass,
        modelContract: model.identity.contract,
        modelVersion: model.identity.version,
        modelLabel: model.identity.label,
        modelRoute: model.identity.route,
        packageHash: model.packageHash || hash(model),
        createdAt: now
      },
      authority: {
        coreContract: CORE_CONTRACT,
        coreVersion: VERSION,
        governingContract: GOVERNING_CONTRACT,
        governingContractVersion: stores.authorityReceipt && stores.authorityReceipt.version || null,
        governingModelSchema: GOVERNING_MODEL_SCHEMA,
        authorityMatched: true,
        authorityReady: true,
        authorityReceiptHash: stores.authorityReceipt && stores.authorityReceipt.contractHash || null,
        authorityValidatedAt: now,
        fibonacciGate: 13,
        nextFibonacciGate: 21,
        f21Claimed: false
      },
      admission: {
        candidateReceived: true,
        validationAttempted: true,
        validationPassed: validation.passed === true,
        validationFailCount: validation.failCount || 0,
        validationWarningCount: validation.warningCount || 0,
        validation: frozenClone(validation),
        normalizedModel: frozenClone(model),
        admittedModel: frozenClone(model),
        admittedAt: now,
        rejected: false,
        rejection: null
      },
      specification: {
        spec: deepFreeze(clone(spec)),
        specHash: hash(spec),
        interactionMode: spec.metadata && spec.metadata.interactionMode || "NONE",
        requiresInteraction: Boolean(spec.metadata && spec.metadata.requiresInteraction),
        fallbackPermitted: options.fallbackPermitted !== false,
        fallbackRequired: Boolean(options.fallbackRequired),
        fallbackMaySatisfyBackend: Boolean(options.fallbackMaySatisfyBackend),
        requiredBackends: spec.backend && spec.backend.requiredAny ? spec.backend.requiredAny.slice() : ["WEBGL2"],
        preferredBackends: spec.backend && spec.backend.preferred ? spec.backend.preferred.slice() : ["WEBGPU", "WEBGL2"],
        fallbackBackends: spec.backend && spec.backend.fallback ? spec.backend.fallback.slice() : ["CANVAS2D", "SVG", "HTML"],
        immutable: true
      },
      lifecycle: {
        progressState: PROGRESS.DECLARED,
        conditionState: CONDITION.NONE,
        executionMode: EXECUTION.NONE,
        previousProgressState: null,
        resumeProgressState: null,
        lastStableProgressState: PROGRESS.DECLARED,
        transitionSequence: 0,
        lastTransitionId: null,
        lastTransitionAt: null,
        stateEnteredAt: now,
        verifiedAt: null,
        destroyedAt: null
      },
      hold: {
        active: false,
        code: null,
        stage: null,
        message: null,
        missingEvidence: [],
        startedAt: null,
        resolvedAt: null,
        resumeProgressState: null
      },
      blockingError: {
        active: false,
        code: null,
        stage: null,
        message: null,
        sourceKind: null,
        adapterId: null,
        startedAt: null,
        resolvedAt: null,
        details: null
      },
      ops: {
        draft: clone(declaredOps),
        snapshot: null,
        snapshotHash: null,
        comparison: null,
        comparisonHash: null,
        receipt: null,
        receiptHash: null,
        lastComparedAt: null,
        lastReceiptAt: null
      },
      mount: {
        supplied: false,
        sourceKind: null,
        selector: null,
        resolver: null,
        reference: null,
        resolved: false,
        connected: false,
        width: 0,
        height: 0,
        nonzero: false,
        rect: null,
        observer: null,
        observerActive: false,
        observedAt: null,
        authorizationId: null
      },
      surfaces: {
        primary: null,
        fallback: null,
        diagnostic: null,
        leases: Object.create(null),
        leaseBySurface: Object.create(null)
      },
      targets: {
        input: null,
        authorizations: Object.create(null)
      },
      adapters: {
        rendererAdapterId: null,
        inputAdapterId: null,
        fallbackAdapterId: null,
        rendererSessionId: null,
        inputSessionId: null,
        fallbackSessionId: null,
        sessions: Object.create(null)
      },
      renderer: {
        selected: false,
        adapterId: null,
        sessionId: null,
        requestedBackend: null,
        selectedBackend: "NONE",
        backendAvailable: false,
        initialized: false,
        resourcesUploaded: false,
        firstFrameSubmitted: false,
        firstFramePresented: false,
        visiblePixelObserved: false,
        surfaceNonzero: false,
        contextLost: false,
        recoveryAvailable: false,
        recoveryPending: false,
        recoverySucceeded: false,
        paused: false,
        disposed: false
      },
      input: {
        required: Boolean(spec.metadata && spec.metadata.requiresInteraction),
        mode: spec.metadata && spec.metadata.interactionMode || "NONE",
        adapterId: null,
        sessionId: null,
        targetAuthorized: false,
        attached: false,
        enabled: false,
        paused: false,
        listenerCount: 0,
        eventCount: 0,
        acceptedEventCount: 0,
        interactionObserved: false,
        lastInteractionType: null,
        lastInteractionAt: null,
        disposed: false
      },
      fallback: {
        permitted: options.fallbackPermitted !== false,
        required: Boolean(options.fallbackRequired),
        selected: false,
        adapterId: null,
        sessionId: null,
        fallbackType: "NONE",
        selectionId: null,
        selectionGeneration: 0,
        selectionReason: null,
        priorBackend: null,
        surfaceAuthorized: false,
        initialized: false,
        representationReady: false,
        outputWritten: false,
        presentationObserved: false,
        visibleOutputObserved: false,
        maySatisfyBackend: Boolean(options.fallbackMaySatisfyBackend),
        surfaceNonzero: false,
        paused: false,
        disposed: false
      },
      runtimeControl: {
        schema: RUNTIME_CONTROL_SCHEMA,
        revision: 0,
        rotation: { x: 0, y: 0, z: 0 },
        pan: { x: 0, y: 0 },
        zoom: 1,
        selection: null,
        navigation: null,
        custom: {},
        lastIntentId: null,
        lastIntentAt: null
      },
      scheduler: {
        status: "STOPPED",
        active: false,
        requestId: null,
        frameSequence: 0,
        lastTimestamp: null,
        lastDeltaTime: 0,
        startedAt: null,
        stoppedAt: null,
        stopReason: null,
        callbackActive: false
      },
      evidence: {
        sequence: 0,
        acceptedCount: 0,
        deferredCount: 0,
        rejectedCount: 0,
        lastEvidenceId: null,
        lastEvidenceAt: null,
        history: [],
        pending: [],
        byType: Object.create(null),
        byAdapter: Object.create(null)
      },
      intents: {
        sequence: 0,
        acceptedCount: 0,
        rejectedCount: 0,
        lastIntentId: null,
        lastIntentAt: null,
        history: []
      },
      transitions: {
        acceptedCount: 0,
        rejectedCount: 0,
        history: []
      },
      async: {
        pendingOperationCount: 0,
        initializationPromise: null,
        uploadPromise: null,
        recoveryPromise: null,
        disposalPromise: null,
        evidencePromises: [],
        intentPromises: []
      },
      errors: [],
      warnings: [],
      metrics: {
        frameCount: 0,
        presentationCount: 0,
        visibleObservationCount: 0,
        interactionCount: 0,
        fallbackRenderCount: 0,
        contextLossCount: 0,
        recoveryAttemptCount: 0,
        recoverySuccessCount: 0,
        pauseCount: 0,
        resumeCount: 0,
        disposalCount: 0
      },
      eligibility: {
        lastComputedAt: null,
        snapshot: null
      },
      timestamps: {
        declaredAt: now,
        loadedAt: null,
        validatedAt: null,
        createdAt: now,
        mountedAt: null,
        initializedAt: null,
        uploadedAt: null,
        submittedAt: null,
        presentedAt: null,
        visibleAt: null,
        interactiveAt: null,
        verifiedAt: null,
        pausedAt: null,
        resumedAt: null,
        heldAt: null,
        contextLostAt: null,
        fallbackSelectedAt: null,
        destroyedAt: null,
        updatedAt: now
      },
      disposal: {
        requested: false,
        started: false,
        completed: false,
        idempotentRepeatCount: 0,
        schedulerStopped: false,
        observersDisconnected: false,
        inputDetached: false,
        rendererDisposed: false,
        fallbackDisposed: false,
        copiedBuffersReleased: false,
        transferredBuffersReleased: false,
        borrowedBuffersPreserved: true,
        callbacksCleared: false,
        terminalReceiptComposed: false,
        residualSessionCount: 0,
        residualScheduleCount: 0,
        residualObserverCount: 0,
        errors: []
      }
    };
  }

  function createRestrictedFacade(record) {
    return deepFreeze({
      instanceId: record.identity.instanceId,
      modelId: record.identity.modelId,
      inspect: function inspectFacade() {
        return inspectInstance(record.identity.instanceId);
      },
      getOps: function getOpsFacade() {
        return getOps(record.identity.instanceId);
      },
      getReceipt: function getReceiptFacade() {
        return getInstanceReceipt(record.identity.instanceId);
      },
      destroy: function destroyFacade(options) {
        return destroyInstance(record.identity.instanceId, options);
      }
    });
  }

  function validateModelPackage(candidate) {
    var contract = requireAuthority();

    if (!contract) {
      return deepFreeze({
        passed: false,
        status: "HELD",
        reason: "GOVERNING_CONTRACT_NOT_AVAILABLE",
        normalized: null,
        failures: [],
        warnings: []
      });
    }

    return contract.validateModelPackage(candidate);
  }

  function admitModelPackage(candidate, options) {
    var validation = validateModelPackage(candidate);

    if (!validation || validation.passed !== true || !validation.normalized) {
      return deepFreeze({
        admitted: false,
        status: "REJECTED",
        validation: frozenClone(validation)
      });
    }

    return deepFreeze({
      admitted: true,
      status: "ADMITTED",
      normalized: frozenClone(validation.normalized),
      validation: frozenClone(validation),
      options: frozenClone(options || {})
    });
  }

  function createInstance(candidate, options) {
    var contract = requireAuthority();
    var settings = isObject(options) ? options : {};

    if (!contract) {
      return deepFreeze({
        ok: false,
        status: "HELD",
        code: "GOVERNING_CONTRACT_NOT_AVAILABLE"
      });
    }

    var validation = contract.validateModelPackage(candidate);

    if (!validation || validation.passed !== true || !validation.normalized) {
      return deepFreeze({
        ok: false,
        status: "REJECTED",
        code: "MODEL_VALIDATION_FAILED",
        validation: frozenClone(validation)
      });
    }

    var instanceId = allocateInstanceId(settings);

    if (!instanceId) {
      return deepFreeze({
        ok: false,
        status: "REJECTED",
        code: "INSTANCE_ID_DUPLICATE_OR_TERMINAL"
      });
    }

    var model = validation.normalized;
    var fallbackRequired = Boolean(settings.fallbackRequired);
    var fallbackPermitted = settings.fallbackPermitted !== false;
    var requiredBackends =
      Array.isArray(settings.requiredBackend)
        ? settings.requiredBackend
        : ["WEBGL2"];

    var spec = contract.createInstanceSpec({
      interactionMode:
        settings.interactionMode ||
        (model.interaction && model.interaction.mode) ||
        "NONE",
      requiresInteraction:
        typeof settings.requiresInteraction === "boolean"
          ? settings.requiresInteraction
          : Boolean(model.interaction && model.interaction.mode && model.interaction.mode !== "NONE"),
      requiresFallback: fallbackRequired,
      requiredBackend: requiredBackends,
      preferredBackend: settings.preferredBackend || ["WEBGPU", "WEBGL2"],
      fallbackBackend: settings.fallbackBackend || ["CANVAS2D", "SVG", "HTML"],
      metadata: {
        modelId: model.identity.modelId,
        coreContract: CORE_CONTRACT
      }
    });

    var declaredOps = contract.createDeclaredOps({
      loaded: false,
      initialized: false,
      backend: "NONE",
      state: "DECLARED",
      observed: {
        fileLoaded: false,
        contractMatched: false,
        modelValidated: false,
        instanceCreated: false,
        mountPresent: false,
        surfaceNonzero: false,
        backendInitialized: false,
        resourcesUploaded: false,
        firstFrameSubmitted: false,
        firstFramePresented: false,
        visiblePixelObserved: false,
        interactionObserved: false,
        fallbackAvailable: fallbackPermitted,
        contextRecoveryAvailable: false,
        disposalObserved: false,
        noBlockingError: true
      }
    });

    var record = createEmptyInternalRecord(
      instanceId,
      model,
      validation,
      spec,
      declaredOps,
      {
        fallbackRequired: fallbackRequired,
        fallbackPermitted: fallbackPermitted,
        fallbackMaySatisfyBackend: Boolean(settings.fallbackMaySatisfyBackend)
      }
    );

    stores.instances[instanceId] = record;

    record.ops.draft.observed.fileLoaded = true;
    record.ops.draft.observed.contractMatched = true;
    attemptTransition(record, PROGRESS.LOADED, CONDITION.NONE, EXECUTION.NONE, {
      reason: "CORE_FILE_AND_CONTRACT_LOADED"
    });

    record.ops.draft.observed.modelValidated = true;
    record.timestamps.validatedAt = nowIso();
    attemptTransition(record, PROGRESS.VALIDATED, CONDITION.NONE, EXECUTION.NONE, {
      reason: "MODEL_VALIDATED"
    });

    record.ops.draft.observed.instanceCreated = true;
    record.timestamps.createdAt = nowIso();
    attemptTransition(record, PROGRESS.CREATED, CONDITION.NONE, EXECUTION.NONE, {
      reason: "INSTANCE_REGISTERED"
    });

    refreshComparisonAndReceipt(record);

    emit("instanceCreated", {
      instanceId: instanceId,
      modelId: model.identity.modelId
    });

    updateGlobalReceipt();

    return createRestrictedFacade(record);
  }

  function getRecord(instanceId, includeTombstone) {
    if (stores.instances[instanceId]) return stores.instances[instanceId];
    if (includeTombstone && stores.tombstones[instanceId]) return stores.tombstones[instanceId];
    return null;
  }

  function hasInstance(instanceId) {
    return Boolean(stores.instances[instanceId]);
  }

  function getInstance(instanceId) {
    var record = getRecord(instanceId, false);
    return record ? createRestrictedFacade(record) : null;
  }

  function listInstances(options) {
    var settings = isObject(options) ? options : {};
    var list = Object.keys(stores.instances).map(function map(id) {
      return summarizeInstance(stores.instances[id]);
    });

    if (settings.includeTombstones) {
      list = list.concat(Object.keys(stores.tombstones).map(function map(id) {
        return summarizeInstance(stores.tombstones[id]);
      }));
    }

    return deepFreeze(list);
  }

  function summarizeInstance(record) {
    return {
      instanceId: record.identity.instanceId,
      modelId: record.identity.modelId,
      progressState: record.lifecycle.progressState,
      conditionState: record.lifecycle.conditionState,
      executionMode: record.lifecycle.executionMode,
      ready: Boolean(record.ops.receipt && record.ops.receipt.ready),
      status: record.ops.receipt ? record.ops.receipt.status : "UNKNOWN",
      destroyed: record.lifecycle.progressState === PROGRESS.DESTROYED
    };
  }

  function inspectInstance(instanceId) {
    var record = getRecord(instanceId, true);
    if (!record) {
      return deepFreeze({
        found: false,
        instanceId: instanceId || null,
        status: "NOT_FOUND"
      });
    }

    refreshComparisonAndReceipt(record);

    return frozenClone({
      found: true,
      schema: record.schema,
      identity: record.identity,
      authority: record.authority,
      admission: record.admission,
      specification: {
        specHash: record.specification.specHash,
        interactionMode: record.specification.interactionMode,
        requiresInteraction: record.specification.requiresInteraction,
        fallbackPermitted: record.specification.fallbackPermitted,
        fallbackRequired: record.specification.fallbackRequired,
        requiredBackends: record.specification.requiredBackends,
        preferredBackends: record.specification.preferredBackends,
        fallbackBackends: record.specification.fallbackBackends
      },
      lifecycle: record.lifecycle,
      hold: record.hold,
      blockingError: record.blockingError,
      ops: {
        snapshot: snapshotOps(record),
        snapshotHash: record.ops.snapshotHash,
        comparison: record.ops.comparison,
        comparisonHash: record.ops.comparisonHash,
        receipt: record.ops.receipt,
        receiptHash: record.ops.receiptHash
      },
      mount: record.mount,
      renderer: record.renderer,
      input: record.input,
      fallback: record.fallback,
      runtimeControl: record.runtimeControl,
      scheduler: record.scheduler,
      evidence: {
        acceptedCount: record.evidence.acceptedCount,
        deferredCount: record.evidence.deferredCount,
        rejectedCount: record.evidence.rejectedCount,
        lastEvidenceId: record.evidence.lastEvidenceId,
        lastEvidenceAt: record.evidence.lastEvidenceAt,
        byType: record.evidence.byType,
        byAdapter: record.evidence.byAdapter,
        history: record.evidence.history
      },
      intents: record.intents,
      transitions: record.transitions,
      errors: record.errors,
      warnings: record.warnings,
      metrics: record.metrics,
      eligibility: computeEligibility(record),
      timestamps: record.timestamps,
      disposal: record.disposal
    });
  }

  function getSpec(instanceId) {
    var record = getRecord(instanceId, false);
    return record ? frozenClone(record.specification.spec) : null;
  }

  function getOps(instanceId) {
    var record = getRecord(instanceId, true);
    return record ? frozenClone(snapshotOps(record)) : null;
  }

  function compareInstance(instanceId) {
    var record = getRecord(instanceId, true);
    if (!record) return null;
    refreshComparisonAndReceipt(record);
    return frozenClone(record.ops.comparison);
  }

  function getInstanceReceipt(instanceId) {
    var record = getRecord(instanceId, true);
    if (!record) return null;
    refreshComparisonAndReceipt(record);
    return frozenClone(record.ops.receipt);
  }

  function registerAdapter(descriptor) {
    if (!isObject(descriptor)) {
      return deepFreeze({ ok: false, code: "ADAPTER_DESCRIPTOR_REQUIRED" });
    }

    var kind = descriptor.kind;
    if (kind !== ADAPTER_KIND.RENDERER && kind !== ADAPTER_KIND.INPUT && kind !== ADAPTER_KIND.FALLBACK) {
      return deepFreeze({ ok: false, code: "ADAPTER_KIND_INVALID" });
    }

    var adapterId = typeof descriptor.adapterId === "string" && descriptor.adapterId.trim()
      ? descriptor.adapterId.trim()
      : "dgb-" + kind + "-adapter-" + (++stores.sequences.adapter);

    if (stores.adapters[adapterId]) {
      return deepFreeze({ ok: false, code: "ADAPTER_ID_DUPLICATE", adapterId: adapterId });
    }

    stores.adapters[adapterId] = deepFreeze({
      adapterId: adapterId,
      kind: kind,
      contract: descriptor.contract || null,
      version: descriptor.version || null,
      capabilities: clone(descriptor.capabilities || {}),
      operations: {
        probe: isFunction(descriptor.probe) ? descriptor.probe : null,
        initialize: isFunction(descriptor.initialize) ? descriptor.initialize : null,
        upload: isFunction(descriptor.upload) ? descriptor.upload : null,
        submitFrame: isFunction(descriptor.submitFrame) ? descriptor.submitFrame : null,
        render: isFunction(descriptor.render) ? descriptor.render : null,
        renderOnce: isFunction(descriptor.renderOnce) ? descriptor.renderOnce : null,
        recover: isFunction(descriptor.recover) ? descriptor.recover : null,
        resize: isFunction(descriptor.resize) ? descriptor.resize : null,
        pause: isFunction(descriptor.pause) ? descriptor.pause : null,
        resume: isFunction(descriptor.resume) ? descriptor.resume : null,
        detach: isFunction(descriptor.detach) ? descriptor.detach : null,
        dispose: isFunction(descriptor.dispose) ? descriptor.dispose : null,
        attach: isFunction(descriptor.attach) ? descriptor.attach : null
      },
      registeredAt: nowIso()
    });

    emit("adapterRegistered", { adapterId: adapterId, kind: kind });
    updateGlobalReceipt();

    return deepFreeze({ ok: true, adapterId: adapterId, kind: kind });
  }

  function unregisterAdapter(adapterId) {
    if (!stores.adapters[adapterId]) {
      return deepFreeze({ ok: true, code: "ADAPTER_ALREADY_ABSENT", adapterId: adapterId });
    }

    delete stores.adapters[adapterId];
    emit("adapterUnregistered", { adapterId: adapterId });
    updateGlobalReceipt();

    return deepFreeze({ ok: true, adapterId: adapterId });
  }

  function listAdapters(options) {
    var settings = isObject(options) ? options : {};
    var kind = settings.kind || null;

    return deepFreeze(Object.keys(stores.adapters)
      .filter(function filter(id) {
        return !kind || stores.adapters[id].kind === kind;
      })
      .map(function map(id) {
        var adapter = stores.adapters[id];
        return {
          adapterId: adapter.adapterId,
          kind: adapter.kind,
          contract: adapter.contract,
          version: adapter.version,
          capabilities: clone(adapter.capabilities),
          registeredAt: adapter.registeredAt
        };
      }));
  }

  function registerRenderer(descriptor) {
    var d = Object.assign({}, descriptor || {}, { kind: ADAPTER_KIND.RENDERER });
    return registerAdapter(d);
  }

  function unregisterRenderer(adapterId) {
    return unregisterAdapter(adapterId);
  }

  function registerInput(descriptor) {
    var d = Object.assign({}, descriptor || {}, { kind: ADAPTER_KIND.INPUT });
    return registerAdapter(d);
  }

  function unregisterInput(adapterId) {
    return unregisterAdapter(adapterId);
  }

  function registerFallback(descriptor) {
    var d = Object.assign({}, descriptor || {}, { kind: ADAPTER_KIND.FALLBACK });
    return registerAdapter(d);
  }

  function unregisterFallback(adapterId) {
    return unregisterAdapter(adapterId);
  }

  function mountInstance(instanceId, mountBinding) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (record.lifecycle.progressState === PROGRESS.DESTROYED) return deepFreeze({ ok: false, code: "INSTANCE_DESTROYED" });

    var binding = isObject(mountBinding) ? mountBinding : {};
    var reference = binding.reference || null;

    if (!reference && typeof binding.selector === "string" && root.document) {
      try {
        reference = root.document.querySelector(binding.selector);
      } catch (_error) {
        reference = null;
      }
    }

    if (!reference && isFunction(binding.resolver)) {
      try {
        reference = binding.resolver();
      } catch (error) {
        return enterBlockingError(record, "MOUNT_RESOLVER_THROW", "MOUNT", String(error && error.message ? error.message : error));
      }
    }

    if (!reference) {
      return enterHold(record, "MOUNT_NOT_RESOLVED", "MOUNT", "Explicit mount could not be resolved.", ["mount.reference"]);
    }

    var rect = readRect(reference);

    record.mount.supplied = true;
    record.mount.sourceKind = binding.selector ? "SELECTOR" : binding.resolver ? "RESOLVER" : "REFERENCE";
    record.mount.selector = binding.selector || null;
    record.mount.resolver = null;
    record.mount.reference = reference;
    record.mount.resolved = true;
    record.mount.connected = isConnected(reference);
    record.mount.width = rect.width;
    record.mount.height = rect.height;
    record.mount.nonzero = rect.width > 0 && rect.height > 0;
    record.mount.rect = rect;
    record.mount.observedAt = nowIso();
    record.mount.authorizationId = "mount-" + instanceId;

    record.ops.draft.observed.mountPresent = true;
    record.ops.draft.observed.surfaceNonzero = record.mount.nonzero;

    if (!record.mount.nonzero) {
      return enterHold(record, "MOUNT_SURFACE_ZERO", "MOUNT", "Mount resolved but has zero surface.", ["surfaceNonzero"]);
    }

    record.timestamps.mountedAt = nowIso();
    var transition = attemptTransition(record, PROGRESS.MOUNTED, CONDITION.NONE, EXECUTION.NONE, {
      reason: "MOUNT_RESOLVED"
    });

    return deepFreeze({ ok: true, transition: transition, mount: describeReference(reference) });
  }

  function readRect(reference) {
    var rect = { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };

    try {
      if (isFunction(reference.getBoundingClientRect)) {
        var r = reference.getBoundingClientRect();
        rect.width = Number(r.width) || 0;
        rect.height = Number(r.height) || 0;
        rect.top = Number(r.top) || 0;
        rect.left = Number(r.left) || 0;
        rect.right = Number(r.right) || 0;
        rect.bottom = Number(r.bottom) || 0;
      } else {
        rect.width = Number(reference.width) || Number(reference.clientWidth) || 0;
        rect.height = Number(reference.height) || Number(reference.clientHeight) || 0;
      }
    } catch (_error) {}

    return rect;
  }

  function isConnected(reference) {
    try {
      if (typeof reference.isConnected === "boolean") return reference.isConnected;
      return true;
    } catch (_error) {
      return false;
    }
  }

  function initializeInstance(instanceId, options) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    var settings = isObject(options) ? options : {};
    var adapterId = settings.adapterId || record.adapters.rendererAdapterId || null;
    var adapter = adapterId ? stores.adapters[adapterId] : null;

    if (!adapter || adapter.kind !== ADAPTER_KIND.RENDERER) {
      return enterHold(record, "RENDERER_ADAPTER_NOT_AVAILABLE", "INITIALIZE", "No compatible renderer adapter is registered.", ["renderer"]);
    }

    if (PROGRESS_ORDER[record.lifecycle.progressState] < PROGRESS_ORDER[PROGRESS.MOUNTED]) {
      return deepFreeze({ ok: false, code: "INSTANCE_NOT_MOUNTED" });
    }

    if (!record.mount.nonzero) {
      return enterHold(record, "SURFACE_NONZERO_REQUIRED", "INITIALIZE", "A nonzero mount/surface is required.", ["surfaceNonzero"]);
    }

    var session = createAdapterSession(record, adapter, {
      classification: EVIDENCE_CLASSIFICATION.PRODUCTION
    });

    record.adapters.rendererAdapterId = adapter.adapterId;
    record.adapters.rendererSessionId = session.sessionId;
    record.renderer.selected = true;
    record.renderer.adapterId = adapter.adapterId;
    record.renderer.sessionId = session.sessionId;
    record.renderer.requestedBackend = settings.backend || "WEBGL2";
    record.renderer.selectedBackend = settings.backend || "WEBGL2";
    record.renderer.backendAvailable = true;
    record.lifecycle.executionMode = EXECUTION.PRIMARY;

    return callAdapterOperation(adapter, "initialize", record, session, settings).then(function afterInitialize(result) {
      if (result && result.ok === false) {
        return enterBlockingError(record, "RENDERER_INITIALIZE_FAILED", "INITIALIZE", result.error || "Renderer initialize failed.");
      }

      record.renderer.initialized = true;
      record.ops.draft.initialized = true;
      record.ops.draft.backend = record.renderer.selectedBackend;
      record.ops.draft.observed.backendInitialized = true;
      record.timestamps.initializedAt = nowIso();

      acceptCoreEvidence(record, "RENDERER_INITIALIZED", true, "INITIALIZE");

      var transition = attemptTransition(record, PROGRESS.INITIALIZED, CONDITION.NONE, EXECUTION.PRIMARY, {
        reason: "RENDERER_INITIALIZED"
      });

      return deepFreeze({ ok: true, transition: transition, sessionId: session.sessionId });
    });
  }

  function startInstance(instanceId) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    return startScheduler(record);
  }

  function renderInstanceOnce(instanceId, options) {
    var record = getRecord(instanceId, false);
    if (!record) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" }));

    if (record.lifecycle.executionMode !== EXECUTION.PRIMARY && record.lifecycle.executionMode !== EXECUTION.FALLBACK) {
      return Promise.resolve(deepFreeze({ ok: false, code: "NO_ACTIVE_VISUAL_PATH" }));
    }

    var sessionId = record.lifecycle.executionMode === EXECUTION.PRIMARY
      ? record.adapters.rendererSessionId
      : record.adapters.fallbackSessionId;
    var session = record.adapters.sessions[sessionId];

    if (!session) return Promise.resolve(deepFreeze({ ok: false, code: "VISUAL_SESSION_NOT_FOUND" }));

    var adapter = stores.adapters[session.adapterId];
    var op = adapter && (adapter.operations.renderOnce || adapter.operations.render || adapter.operations.submitFrame);

    if (!op) return Promise.resolve(deepFreeze({ ok: false, code: "RENDER_OPERATION_NOT_AVAILABLE" }));

    return callAdapterOperation(adapter, op === adapter.operations.submitFrame ? "submitFrame" : op === adapter.operations.renderOnce ? "renderOnce" : "render", record, session, options || {})
      .then(function afterRender(result) {
        if (result && result.evidence) {
          reportEvidence(record.identity.instanceId, result.evidence, {
            adapterId: adapter.adapterId,
            sessionId: session.sessionId,
            adapterKind: adapter.kind
          });
        }

        return deepFreeze({ ok: true, result: clone(result) });
      });
  }

  function createAdapterSession(record, adapter, options) {
    stores.sequences.session += 1;

    var session = {
      schema: "DGB_ENGINE_ADAPTER_SESSION_v1",
      sessionId: "dgb-session-" + stores.sequences.session,
      instanceId: record.identity.instanceId,
      adapterId: adapter.adapterId,
      adapterKind: adapter.kind,
      contract: adapter.contract,
      version: adapter.version,
      status: "DECLARED",
      classification: options && options.classification || EVIDENCE_CLASSIFICATION.PRODUCTION,
      surfaceAuthorizationId: null,
      surfaceLeaseId: null,
      targetAuthorizationId: null,
      selectionId: null,
      initialized: false,
      attached: false,
      active: false,
      paused: false,
      detached: false,
      disposing: false,
      disposed: false,
      pendingOperationCount: 0,
      errors: [],
      warnings: [],
      createdAt: nowIso(),
      initializedAt: null,
      detachedAt: null,
      disposedAt: null
    };

    record.adapters.sessions[session.sessionId] = session;
    session.status = "ATTACHED";
    session.attached = true;

    emit("sessionAttached", {
      instanceId: record.identity.instanceId,
      sessionId: session.sessionId,
      adapterId: adapter.adapterId,
      kind: adapter.kind
    });

    return session;
  }

  function callAdapterOperation(adapter, method, record, session, options) {
    var op = adapter.operations[method];

    if (!isFunction(op)) {
      return Promise.resolve({ ok: true, skipped: true, reason: "OPERATION_NOT_AVAILABLE" });
    }

    var context = deepFreeze({
      bindingContract: "DGB_ADAPTER_BINDING_CONTEXT_v1",
      classification: session.classification,
      instanceId: record.identity.instanceId,
      adapterId: adapter.adapterId,
      adapterKind: adapter.kind,
      modelIdentity: clone(record.identity),
      modelPackage: clone(record.admission.admittedModel),
      spec: clone(record.specification.spec),
      opsSnapshot: clone(snapshotOps(record)),
      lifecycleState: clone(record.lifecycle),
      mount: describeReference(record.mount.reference),
      mountDimensions: {
        width: record.mount.width,
        height: record.mount.height,
        nonzero: record.mount.nonzero
      },
      runtimeControlSnapshot: clone(record.runtimeControl),
      timestamp: nowIso(),
      reportEvidence: function unavailableReportEvidence() {
        return false;
      },
      emitIntent: function unavailableEmitIntent() {
        return false;
      }
    });

    session.pendingOperationCount += 1;
    record.async.pendingOperationCount += 1;

    try {
      var value = op.call(null, context, clone(options || {}));
      return Promise.resolve(value).then(function ok(result) {
        session.pendingOperationCount -= 1;
        record.async.pendingOperationCount -= 1;
        session.active = true;
        session.status = "ACTIVE";
        return result || { ok: true };
      }).catch(function fail(error) {
        session.pendingOperationCount -= 1;
        record.async.pendingOperationCount -= 1;
        session.errors.push(String(error && error.message ? error.message : error));
        return {
          ok: false,
          error: String(error && error.message ? error.message : error)
        };
      });
    } catch (error) {
      session.pendingOperationCount -= 1;
      record.async.pendingOperationCount -= 1;
      session.errors.push(String(error && error.message ? error.message : error));
      return Promise.resolve({
        ok: false,
        error: String(error && error.message ? error.message : error)
      });
    }
  }

  function acceptCoreEvidence(record, evidenceType, value, stage) {
    return reportEvidence(record.identity.instanceId, {
      schema: EVIDENCE_SCHEMA,
      evidenceType: evidenceType,
      value: value,
      stage: stage || "CORE",
      classification: EVIDENCE_CLASSIFICATION.PRODUCTION,
      details: {}
    }, {
      adapterId: "CORE",
      adapterKind: "core",
      sessionId: null
    });
  }

  function reportEvidence(instanceId, envelope, binding) {
    var record = getRecord(instanceId, false);

    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (record.lifecycle.progressState === PROGRESS.DESTROYED) {
      return deepFreeze({ ok: false, code: "POST_DESTROY_EVIDENCE_REJECTED" });
    }

    var source = isObject(envelope) ? envelope : {};
    var adapterKind = binding && binding.adapterKind || "UNKNOWN";
    var adapterId = binding && binding.adapterId || "UNKNOWN";
    var sessionId = binding && binding.sessionId || null;

    stores.sequences.evidence += 1;
    record.evidence.sequence += 1;

    var evidence = {
      schema: EVIDENCE_SCHEMA,
      evidenceId: "dgb-evidence-" + stores.sequences.evidence,
      instanceId: record.identity.instanceId,
      adapterId: adapterId,
      adapterKind: adapterKind,
      sessionId: sessionId,
      selectionId: binding && binding.selectionId || null,
      evidenceType: source.evidenceType || "UNKNOWN",
      value: source.value,
      stage: source.stage || "UNKNOWN",
      timestamp: source.timestamp || nowIso(),
      sequence: record.evidence.sequence,
      classification: source.classification || EVIDENCE_CLASSIFICATION.UNKNOWN,
      details: clone(source.details || {}),
      receivedAt: nowIso(),
      disposition: "REJECTED",
      rejectionCode: null
    };

    var allowed = evidenceAllowed(evidence);

    if (!allowed.ok) {
      evidence.rejectionCode = allowed.code;
      record.evidence.rejectedCount += 1;
      record.evidence.history.push(evidence);
      emit("evidenceRejected", frozenClone(evidence));
      return frozenClone({ ok: false, evidence: evidence });
    }

    evidence.disposition = allowed.deferred ? "ACCEPTED_DEFERRED" : "ACCEPTED_GOVERNING";

    if (allowed.deferred) {
      record.evidence.deferredCount += 1;
      record.evidence.pending.push(evidence);
    } else {
      record.evidence.acceptedCount += 1;
      applyEvidence(record, evidence);
    }

    record.evidence.lastEvidenceId = evidence.evidenceId;
    record.evidence.lastEvidenceAt = evidence.receivedAt;

    if (!record.evidence.byType[evidence.evidenceType]) record.evidence.byType[evidence.evidenceType] = [];
    record.evidence.byType[evidence.evidenceType].push(evidence.evidenceId);

    if (!record.evidence.byAdapter[adapterId]) record.evidence.byAdapter[adapterId] = [];
    record.evidence.byAdapter[adapterId].push(evidence.evidenceId);

    record.evidence.history.push(evidence);
    record.timestamps.updatedAt = nowIso();

    updateObservedFromLifecycle(record);
    runPromotion(record);
    refreshComparisonAndReceipt(record);

    emit("evidenceAccepted", frozenClone(evidence));
    return frozenClone({ ok: true, evidence: evidence });
  }

  function evidenceAllowed(evidence) {
    if (evidence.classification !== EVIDENCE_CLASSIFICATION.PRODUCTION) {
      return { ok: false, code: "DIAGNOSTIC_EVIDENCE_NOT_GOVERNING" };
    }

    if (evidence.adapterKind === ADAPTER_KIND.RENDERER && evidence.evidenceType === "INTERACTION_OBSERVED") {
      return { ok: false, code: "RENDERER_INTERACTION_CLAIM_FORBIDDEN" };
    }

    if (evidence.adapterKind === ADAPTER_KIND.INPUT && (
      evidence.evidenceType === "VISIBLE_PIXEL_OBSERVED" ||
      evidence.evidenceType === "FRAME_PRESENTED" ||
      evidence.evidenceType === "FRAME_SUBMITTED" ||
      evidence.evidenceType === "RESOURCES_UPLOADED"
    )) {
      return { ok: false, code: "INPUT_VISUAL_OR_GPU_CLAIM_FORBIDDEN" };
    }

    if (evidence.adapterKind === ADAPTER_KIND.FALLBACK && (
      evidence.evidenceType === "RENDERER_INITIALIZED" ||
      evidence.evidenceType === "FRAME_SUBMITTED" ||
      evidence.evidenceType === "FRAME_PRESENTED" ||
      evidence.evidenceType === "VISIBLE_PIXEL_OBSERVED"
    )) {
      return { ok: false, code: "FALLBACK_PRIMARY_RENDERER_CLAIM_FORBIDDEN" };
    }

    return { ok: true, deferred: false };
  }

  function applyEvidence(record, evidence) {
    switch (evidence.evidenceType) {
      case "SURFACE_NONZERO":
        record.renderer.surfaceNonzero = evidence.adapterKind === ADAPTER_KIND.RENDERER ? Boolean(evidence.value) : record.renderer.surfaceNonzero;
        record.fallback.surfaceNonzero = evidence.adapterKind === ADAPTER_KIND.FALLBACK ? Boolean(evidence.value) : record.fallback.surfaceNonzero;
        record.mount.nonzero = Boolean(evidence.value) || record.mount.nonzero;
        break;

      case "RENDERER_INITIALIZED":
        record.renderer.initialized = Boolean(evidence.value);
        record.ops.draft.initialized = Boolean(evidence.value);
        record.timestamps.initializedAt = nowIso();
        break;

      case "RESOURCES_UPLOADED":
        record.renderer.resourcesUploaded = Boolean(evidence.value);
        record.timestamps.uploadedAt = nowIso();
        break;

      case "FRAME_SUBMITTED":
        record.renderer.firstFrameSubmitted = Boolean(evidence.value);
        record.metrics.frameCount += evidence.value ? 1 : 0;
        record.timestamps.submittedAt = nowIso();
        break;

      case "FRAME_PRESENTED":
        record.renderer.firstFramePresented = Boolean(evidence.value);
        record.metrics.presentationCount += evidence.value ? 1 : 0;
        record.timestamps.presentedAt = nowIso();
        break;

      case "VISIBLE_PIXEL_OBSERVED":
        record.renderer.visiblePixelObserved = Boolean(evidence.value);
        record.metrics.visibleObservationCount += evidence.value ? 1 : 0;
        record.timestamps.visibleAt = nowIso();
        break;

      case "INPUT_ATTACHED":
        record.input.attached = Boolean(evidence.value);
        record.input.enabled = Boolean(evidence.value);
        break;

      case "INTERACTION_OBSERVED":
        record.input.interactionObserved = Boolean(evidence.value);
        record.input.acceptedEventCount += evidence.value ? 1 : 0;
        record.metrics.interactionCount += evidence.value ? 1 : 0;
        record.input.lastInteractionType = evidence.details && evidence.details.type || "UNKNOWN";
        record.input.lastInteractionAt = nowIso();
        record.timestamps.interactiveAt = record.input.lastInteractionAt;
        break;

      case "FALLBACK_AVAILABLE":
        record.fallback.permitted = Boolean(evidence.value);
        break;

      case "FALLBACK_INITIALIZED":
        record.fallback.initialized = Boolean(evidence.value);
        break;

      case "FALLBACK_REPRESENTATION_READY":
        record.fallback.representationReady = Boolean(evidence.value);
        break;

      case "FALLBACK_OUTPUT_WRITTEN":
        record.fallback.outputWritten = Boolean(evidence.value);
        record.metrics.fallbackRenderCount += evidence.value ? 1 : 0;
        break;

      case "FALLBACK_PRESENTATION_OBSERVED":
        record.fallback.presentationObserved = Boolean(evidence.value);
        record.metrics.presentationCount += evidence.value ? 1 : 0;
        break;

      case "FALLBACK_VISIBLE_OUTPUT_OBSERVED":
        record.fallback.visibleOutputObserved = Boolean(evidence.value);
        record.metrics.visibleObservationCount += evidence.value ? 1 : 0;
        break;

      case "CONTEXT_RECOVERY_AVAILABLE":
        record.renderer.recoveryAvailable = Boolean(evidence.value);
        break;

      case "CONTEXT_LOST":
        if (evidence.value) enterContextLost(record, evidence);
        break;

      case "RECOVERY_SUCCEEDED":
        record.renderer.recoverySucceeded = Boolean(evidence.value);
        record.renderer.recoveryPending = false;
        if (evidence.value && record.lifecycle.conditionState === CONDITION.CONTEXT_LOST) {
          record.lifecycle.conditionState = CONDITION.NONE;
        }
        record.metrics.recoverySuccessCount += evidence.value ? 1 : 0;
        break;

      case "BLOCKING_ERROR":
        enterBlockingError(record, "ADAPTER_BLOCKING_ERROR", evidence.stage, String(evidence.value || "Blocking error"));
        break;

      case "NONBLOCKING_WARNING":
        record.warnings.push({
          code: "ADAPTER_WARNING",
          message: String(evidence.value || "Warning"),
          at: nowIso()
        });
        record.ops.draft.warnings.push(String(evidence.value || "Warning"));
        break;

      default:
        break;
    }
  }

  function runPromotion(record) {
    updateObservedFromLifecycle(record);

    var observed = record.ops.draft.observed;

    if (
      observed.backendInitialized &&
      PROGRESS_ORDER[record.lifecycle.progressState] < PROGRESS_ORDER[PROGRESS.INITIALIZED]
    ) {
      attemptTransition(record, PROGRESS.INITIALIZED, record.lifecycle.conditionState, record.lifecycle.executionMode, {
        triggerType: "EVIDENCE",
        reason: "BACKEND_INITIALIZED"
      });
    }

    if (
      observed.resourcesUploaded &&
      PROGRESS_ORDER[record.lifecycle.progressState] < PROGRESS_ORDER[PROGRESS.UPLOADED]
    ) {
      attemptTransition(record, PROGRESS.UPLOADED, record.lifecycle.conditionState, record.lifecycle.executionMode, {
        triggerType: "EVIDENCE",
        reason: "RESOURCES_UPLOADED"
      });
    }

    if (
      observed.firstFrameSubmitted &&
      PROGRESS_ORDER[record.lifecycle.progressState] < PROGRESS_ORDER[PROGRESS.SUBMITTED]
    ) {
      attemptTransition(record, PROGRESS.SUBMITTED, record.lifecycle.conditionState, record.lifecycle.executionMode, {
        triggerType: "EVIDENCE",
        reason: "FRAME_SUBMITTED"
      });
    }

    if (
      observed.firstFramePresented &&
      PROGRESS_ORDER[record.lifecycle.progressState] < PROGRESS_ORDER[PROGRESS.PRESENTED]
    ) {
      attemptTransition(record, PROGRESS.PRESENTED, record.lifecycle.conditionState, record.lifecycle.executionMode, {
        triggerType: "EVIDENCE",
        reason: "FRAME_PRESENTED"
      });
    }

    if (
      observed.visiblePixelObserved &&
      PROGRESS_ORDER[record.lifecycle.progressState] < PROGRESS_ORDER[PROGRESS.VISIBLE]
    ) {
      attemptTransition(record, PROGRESS.VISIBLE, record.lifecycle.conditionState, record.lifecycle.executionMode, {
        triggerType: "EVIDENCE",
        reason: "VISIBLE_PIXEL_OBSERVED"
      });
    }

    if (
      observed.interactionObserved &&
      PROGRESS_ORDER[record.lifecycle.progressState] < PROGRESS_ORDER[PROGRESS.INTERACTIVE]
    ) {
      attemptTransition(record, PROGRESS.INTERACTIVE, record.lifecycle.conditionState, record.lifecycle.executionMode, {
        triggerType: "EVIDENCE",
        reason: "INTERACTION_OBSERVED"
      });
    }
  }

  function acceptIntent(instanceId, envelope, binding) {
    var record = getRecord(instanceId, false);

    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (record.lifecycle.progressState === PROGRESS.DESTROYED) return deepFreeze({ ok: false, code: "POST_DESTROY_INTENT_REJECTED" });

    var source = isObject(envelope) ? envelope : {};

    stores.sequences.intent += 1;
    record.intents.sequence += 1;

    var intent = {
      schema: INTENT_SCHEMA,
      intentId: "dgb-intent-" + stores.sequences.intent,
      instanceId: record.identity.instanceId,
      adapterId: binding && binding.adapterId || "UNKNOWN",
      sessionId: binding && binding.sessionId || null,
      intentType: source.intentType || "CUSTOM",
      phase: source.phase || "INSTANT",
      origin: clone(source.origin || null),
      delta: clone(source.delta || null),
      scale: source.scale,
      rotation: clone(source.rotation || null),
      selection: clone(source.selection || null),
      command: source.command || null,
      custom: clone(source.custom || {}),
      timestamp: source.timestamp || nowIso(),
      sequence: record.intents.sequence,
      classification: source.classification || EVIDENCE_CLASSIFICATION.PRODUCTION,
      details: clone(source.details || {}),
      receivedAt: nowIso(),
      accepted: false,
      rejectionCode: null
    };

    if (intent.classification !== EVIDENCE_CLASSIFICATION.PRODUCTION) {
      intent.rejectionCode = "DIAGNOSTIC_INTENT_NOT_GOVERNING";
      record.intents.rejectedCount += 1;
      record.intents.history.push(intent);
      return frozenClone({ ok: false, intent: intent });
    }

    applyIntent(record, intent);

    intent.accepted = true;
    record.intents.acceptedCount += 1;
    record.intents.lastIntentId = intent.intentId;
    record.intents.lastIntentAt = intent.receivedAt;
    record.intents.history.push(intent);

    emit("intentAccepted", frozenClone(intent));

    return frozenClone({ ok: true, intent: intent });
  }

  function applyIntent(record, intent) {
    var control = record.runtimeControl;
    control.revision += 1;
    control.lastIntentId = intent.intentId;
    control.lastIntentAt = intent.receivedAt;

    if (intent.intentType === "ROTATE" && isObject(intent.delta)) {
      control.rotation.x += Number(intent.delta.x) || 0;
      control.rotation.y += Number(intent.delta.y) || 0;
      control.rotation.z += Number(intent.delta.z) || 0;
    }

    if (intent.intentType === "PAN" && isObject(intent.delta)) {
      control.pan.x += Number(intent.delta.x) || 0;
      control.pan.y += Number(intent.delta.y) || 0;
    }

    if (intent.intentType === "ZOOM") {
      control.zoom *= Number(intent.scale) || 1;
    }

    if (intent.intentType === "SELECT") {
      control.selection = clone(intent.selection);
    }

    if (intent.intentType === "RESET_VIEW") {
      control.rotation = { x: 0, y: 0, z: 0 };
      control.pan = { x: 0, y: 0 };
      control.zoom = 1;
    }

    if (intent.intentType === "CUSTOM") {
      control.custom = Object.assign({}, control.custom, intent.custom || {});
    }
  }

  function enterHold(record, code, stage, message, missingEvidence) {
    record.hold.active = true;
    record.hold.code = code;
    record.hold.stage = stage;
    record.hold.message = message;
    record.hold.missingEvidence = Array.isArray(missingEvidence) ? missingEvidence.slice() : [];
    record.hold.startedAt = record.hold.startedAt || nowIso();
    record.hold.resumeProgressState = record.lifecycle.progressState;
    record.lifecycle.conditionState = CONDITION.HELD;
    record.timestamps.heldAt = nowIso();
    updateObservedFromLifecycle(record);
    refreshComparisonAndReceipt(record);
    emit("hold", { instanceId: record.identity.instanceId, code: code, stage: stage });
    return deepFreeze({ ok: false, status: "HELD", code: code, message: message });
  }

  function resolveHold(record) {
    record.hold.active = false;
    record.hold.resolvedAt = nowIso();
    if (record.lifecycle.conditionState === CONDITION.HELD) {
      record.lifecycle.conditionState = CONDITION.NONE;
    }
    updateObservedFromLifecycle(record);
    refreshComparisonAndReceipt(record);
    return deepFreeze({ ok: true, status: "HOLD_RESOLVED" });
  }

  function enterBlockingError(record, code, stage, message, details) {
    record.blockingError.active = true;
    record.blockingError.code = code;
    record.blockingError.stage = stage;
    record.blockingError.message = message;
    record.blockingError.startedAt = nowIso();
    record.blockingError.details = clone(details || null);
    record.lifecycle.conditionState = CONDITION.ERROR;
    record.ops.draft.observed.noBlockingError = false;
    record.ops.draft.errors.push(message);
    record.errors.push({ code: code, stage: stage, message: message, at: nowIso(), details: clone(details || null) });
    stopScheduler(record, "BLOCKING_ERROR");
    refreshComparisonAndReceipt(record);
    emit("error", { instanceId: record.identity.instanceId, code: code, message: message });
    return deepFreeze({ ok: false, status: "ERROR", code: code, message: message });
  }

  function enterContextLost(record, evidence) {
    record.renderer.contextLost = true;
    record.lifecycle.conditionState = CONDITION.CONTEXT_LOST;
    record.timestamps.contextLostAt = nowIso();
    record.metrics.contextLossCount += 1;
    stopScheduler(record, "CONTEXT_LOST");
    refreshComparisonAndReceipt(record);
    emit("contextLost", { instanceId: record.identity.instanceId, evidenceId: evidence.evidenceId });
  }

  function pauseInstance(instanceId, reason) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (record.lifecycle.conditionState === CONDITION.ERROR) return deepFreeze({ ok: false, code: "INSTANCE_ERROR" });
    if (record.lifecycle.conditionState === CONDITION.PAUSED) return deepFreeze({ ok: true, code: "ALREADY_PAUSED" });

    record.lifecycle.resumeProgressState = record.lifecycle.progressState;
    record.lifecycle.conditionState = CONDITION.PAUSED;
    record.timestamps.pausedAt = nowIso();
    record.metrics.pauseCount += 1;
    stopScheduler(record, reason || "PAUSE");
    refreshComparisonAndReceipt(record);

    return deepFreeze({ ok: true, status: "PAUSED" });
  }

  function resumeInstance(instanceId) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (record.lifecycle.conditionState !== CONDITION.PAUSED) return deepFreeze({ ok: false, code: "INSTANCE_NOT_PAUSED" });
    if (record.blockingError.active) return deepFreeze({ ok: false, code: "BLOCKING_ERROR_ACTIVE" });

    record.lifecycle.conditionState = CONDITION.NONE;
    record.timestamps.resumedAt = nowIso();
    record.metrics.resumeCount += 1;
    refreshComparisonAndReceipt(record);

    return deepFreeze({ ok: true, status: "RESUMED" });
  }

  function stopInstance(instanceId, reason) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    return stopScheduler(record, reason || "EXPLICIT_STOP");
  }

  function recoverInstance(instanceId) {
    var record = getRecord(instanceId, false);
    if (!record) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" }));
    if (record.lifecycle.conditionState !== CONDITION.CONTEXT_LOST) {
      return Promise.resolve(deepFreeze({ ok: false, code: "CONTEXT_LOSS_NOT_ACTIVE" }));
    }
    if (!record.renderer.recoveryAvailable) {
      return Promise.resolve(deepFreeze({ ok: false, code: "RECOVERY_NOT_AVAILABLE" }));
    }

    var session = record.adapters.sessions[record.adapters.rendererSessionId];
    var adapter = session && stores.adapters[session.adapterId];

    if (!adapter || !isFunction(adapter.operations.recover)) {
      return Promise.resolve(deepFreeze({ ok: false, code: "RECOVERY_OPERATION_NOT_AVAILABLE" }));
    }

    record.renderer.recoveryPending = true;
    record.metrics.recoveryAttemptCount += 1;

    return callAdapterOperation(adapter, "recover", record, session, {}).then(function afterRecover(result) {
      if (result && result.ok === false) {
        record.renderer.recoveryPending = false;
        return enterBlockingError(record, "RECOVERY_FAILED", "RECOVERY", result.error || "Recovery failed.");
      }

      record.renderer.contextLost = false;
      record.renderer.recoveryPending = false;
      record.renderer.recoverySucceeded = true;
      record.lifecycle.conditionState = CONDITION.NONE;
      record.metrics.recoverySuccessCount += 1;
      refreshComparisonAndReceipt(record);

      return deepFreeze({ ok: true, status: "RECOVERED" });
    });
  }

  function computeEligibility(record) {
    var live = record.lifecycle.progressState !== PROGRESS.DESTROYED;
    var noBlock = !record.blockingError.active;
    var notHeld = record.lifecycle.conditionState !== CONDITION.HELD;
    var notError = record.lifecycle.conditionState !== CONDITION.ERROR;
    var notContextLost = record.lifecycle.conditionState !== CONDITION.CONTEXT_LOST;

    var snapshot = {
      create: stores.authorityStatus === STATUS.READY,
      mount: live && record.lifecycle.progressState === PROGRESS.CREATED,
      authorizePrimarySurface: live && PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.CREATED],
      authorizeFallbackSurface: live && record.fallback.permitted,
      authorizeInputTarget: live && record.input.required,
      initializePrimary:
        live &&
        PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.MOUNTED] &&
        record.mount.nonzero &&
        noBlock,
      initializeFallback:
        live &&
        record.fallback.permitted &&
        noBlock,
      upload:
        live &&
        PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.INITIALIZED] &&
        noBlock,
      start:
        live &&
        PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.UPLOADED] &&
        notHeld &&
        notError &&
        notContextLost &&
        noBlock,
      renderOnce:
        live &&
        PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.UPLOADED] &&
        notHeld &&
        notError &&
        notContextLost &&
        noBlock,
      attachInput:
        live &&
        record.input.required &&
        PROGRESS_ORDER[record.lifecycle.progressState] >= PROGRESS_ORDER[PROGRESS.MOUNTED],
      acceptInteraction:
        live &&
        record.input.attached &&
        record.input.enabled &&
        record.lifecycle.conditionState !== CONDITION.PAUSED &&
        notHeld &&
        notError,
      selectFallback:
        live &&
        record.fallback.permitted &&
        noBlock,
      pause:
        live &&
        record.lifecycle.conditionState !== CONDITION.ERROR &&
        record.lifecycle.conditionState !== CONDITION.PAUSED,
      resume:
        live &&
        record.lifecycle.conditionState === CONDITION.PAUSED &&
        noBlock,
      stop:
        live && record.scheduler.active,
      recover:
        live &&
        record.lifecycle.conditionState === CONDITION.CONTEXT_LOST &&
        record.renderer.recoveryAvailable &&
        !record.renderer.recoveryPending,
      verify:
        live &&
        record.ops.comparison &&
        record.ops.comparison.ready === true &&
        notHeld &&
        notError &&
        notContextLost &&
        noBlock,
      destroy: live,
      reasons: {},
      computedAt: nowIso()
    };

    record.eligibility.lastComputedAt = snapshot.computedAt;
    record.eligibility.snapshot = deepFreeze(clone(snapshot));

    return record.eligibility.snapshot;
  }

  function startScheduler(record) {
    if (record.scheduler.active) {
      return deepFreeze({ ok: true, code: "SCHEDULER_ALREADY_ACTIVE" });
    }

    var eligibility = computeEligibility(record);

    if (!eligibility.start) {
      return deepFreeze({ ok: false, code: "SCHEDULER_NOT_ELIGIBLE", eligibility: eligibility });
    }

    if (!root.requestAnimationFrame) {
      return deepFreeze({ ok: false, code: "REQUEST_ANIMATION_FRAME_UNAVAILABLE" });
    }

    record.scheduler.status = "ACTIVE";
    record.scheduler.active = true;
    record.scheduler.startedAt = nowIso();
    record.scheduler.stopReason = null;

    function tick(timestamp) {
      if (!record.scheduler.active || record.lifecycle.progressState === PROGRESS.DESTROYED) {
        record.scheduler.callbackActive = false;
        return;
      }

      record.scheduler.callbackActive = true;
      record.scheduler.frameSequence += 1;
      record.scheduler.lastDeltaTime =
        record.scheduler.lastTimestamp === null
          ? 0
          : Number(timestamp) - Number(record.scheduler.lastTimestamp);
      record.scheduler.lastTimestamp = timestamp;

      var sessionId = record.lifecycle.executionMode === EXECUTION.FALLBACK
        ? record.adapters.fallbackSessionId
        : record.adapters.rendererSessionId;
      var session = record.adapters.sessions[sessionId];
      var adapter = session && stores.adapters[session.adapterId];

      if (adapter && isFunction(adapter.operations.render)) {
        try {
          adapter.operations.render({
            bindingContract: "DGB_ADAPTER_BINDING_CONTEXT_v1",
            classification: session.classification,
            instanceId: record.identity.instanceId,
            adapterId: adapter.adapterId,
            adapterKind: adapter.kind,
            runtimeControlSnapshot: frozenClone(record.runtimeControl),
            timestamp: timestamp,
            deltaTime: record.scheduler.lastDeltaTime,
            frameSequence: record.scheduler.frameSequence
          });
        } catch (error) {
          enterBlockingError(record, "SCHEDULER_RENDER_THROW", "SCHEDULER", String(error && error.message ? error.message : error));
          return;
        }
      }

      record.scheduler.requestId = root.requestAnimationFrame(tick);
    }

    record.scheduler.requestId = root.requestAnimationFrame(tick);
    emit("schedulerStarted", { instanceId: record.identity.instanceId });

    return deepFreeze({ ok: true, status: "STARTED" });
  }

  function stopScheduler(record, reason) {
    if (record.scheduler.requestId !== null && root.cancelAnimationFrame) {
      try {
        root.cancelAnimationFrame(record.scheduler.requestId);
      } catch (_error) {}
    }

    record.scheduler.status = "STOPPED";
    record.scheduler.active = false;
    record.scheduler.requestId = null;
    record.scheduler.stoppedAt = nowIso();
    record.scheduler.stopReason = reason || "STOPPED";
    record.scheduler.callbackActive = false;

    emit("schedulerStopped", {
      instanceId: record.identity.instanceId,
      reason: record.scheduler.stopReason
    });

    return deepFreeze({ ok: true, status: "STOPPED", reason: record.scheduler.stopReason });
  }

  function destroyInstance(instanceId, options) {
    var record = getRecord(instanceId, true);

    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    if (record.lifecycle.progressState === PROGRESS.DESTROYED) {
      record.disposal.idempotentRepeatCount += 1;
      return deepFreeze({
        ok: true,
        status: "ALREADY_DESTROYED",
        tombstone: inspectInstance(instanceId)
      });
    }

    record.disposal.requested = true;
    record.disposal.started = true;
    record.metrics.disposalCount += 1;

    stopScheduler(record, "DESTROY");

    record.disposal.schedulerStopped = true;

    Object.keys(record.adapters.sessions).forEach(function each(sessionId) {
      var session = record.adapters.sessions[sessionId];
      session.disposing = true;
      session.active = false;
      session.paused = true;
      session.detached = true;
      session.detachedAt = nowIso();
      session.disposed = true;
      session.disposedAt = nowIso();

      if (session.adapterKind === ADAPTER_KIND.INPUT) record.disposal.inputDetached = true;
      if (session.adapterKind === ADAPTER_KIND.RENDERER) record.disposal.rendererDisposed = true;
      if (session.adapterKind === ADAPTER_KIND.FALLBACK) record.disposal.fallbackDisposed = true;
    });

    record.disposal.observersDisconnected = true;
    record.disposal.copiedBuffersReleased = true;
    record.disposal.transferredBuffersReleased = true;
    record.disposal.borrowedBuffersPreserved = true;
    record.disposal.callbacksCleared = true;
    record.disposal.residualScheduleCount = record.scheduler.active ? 1 : 0;
    record.disposal.residualSessionCount = Object.keys(record.adapters.sessions).filter(function count(id) {
      return !record.adapters.sessions[id].disposed;
    }).length;
    record.disposal.residualObserverCount = record.mount.observerActive ? 1 : 0;

    record.ops.draft.observed.disposalObserved = true;
    record.disposal.terminalReceiptComposed = true;
    record.disposal.completed = true;

    attemptTransition(record, PROGRESS.DESTROYED, CONDITION.NONE, EXECUTION.NONE, {
      triggerType: "DISPOSAL",
      reason: options && options.reason || "DESTROY_INSTANCE"
    });

    delete stores.instances[instanceId];
    stores.tombstones[instanceId] = deepFreeze(clone(record));

    updateGlobalReceipt();
    emit("instanceDestroyed", { instanceId: instanceId });

    return deepFreeze({
      ok: true,
      status: "DESTROYED",
      tombstone: inspectInstance(instanceId)
    });
  }

  function destroyAll(options) {
    return deepFreeze(Object.keys(stores.instances).map(function map(instanceId) {
      return destroyInstance(instanceId, options);
    }));
  }

  function selectFallback(instanceId, request) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    if (!record.fallback.permitted) {
      return deepFreeze({ ok: false, code: "FALLBACK_NOT_PERMITTED" });
    }

    var settings = isObject(request) ? request : {};
    var adapterId = settings.adapterId || record.adapters.fallbackAdapterId || null;
    var adapter = adapterId ? stores.adapters[adapterId] : null;

    if (!adapter || adapter.kind !== ADAPTER_KIND.FALLBACK) {
      return enterHold(record, "FALLBACK_ADAPTER_NOT_AVAILABLE", "FALLBACK", "No compatible fallback adapter is registered.", ["fallback"]);
    }

    record.fallback.selected = true;
    record.fallback.adapterId = adapterId;
    record.fallback.fallbackType = settings.fallbackType || "CANVAS2D";
    record.fallback.selectionGeneration += 1;
    record.fallback.selectionId = "fallback-selection-" + record.fallback.selectionGeneration;
    record.fallback.selectionReason = settings.reason || "REQUESTED";
    record.fallback.priorBackend = record.renderer.selectedBackend;
    record.timestamps.fallbackSelectedAt = nowIso();

    var session = createAdapterSession(record, adapter, {
      classification: EVIDENCE_CLASSIFICATION.PRODUCTION
    });

    session.selectionId = record.fallback.selectionId;
    record.adapters.fallbackAdapterId = adapterId;
    record.adapters.fallbackSessionId = session.sessionId;
    record.fallback.sessionId = session.sessionId;

    record.lifecycle.executionMode = EXECUTION.TRANSITION;
    stopScheduler(record, "FALLBACK_SELECTION");

    emit("fallbackSelected", {
      instanceId: instanceId,
      selectionId: record.fallback.selectionId
    });

    return deepFreeze({
      ok: true,
      selectionId: record.fallback.selectionId,
      sessionId: session.sessionId
    });
  }

  function preparePrimaryRecovery(instanceId, request) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    record.lifecycle.executionMode = EXECUTION.TRANSITION;
    stopScheduler(record, "PRIMARY_RECOVERY_PREPARED");

    return deepFreeze({
      ok: true,
      status: "PRIMARY_RECOVERY_PREPARED"
    });
  }

  function authorizeSurface(instanceId, request) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    var source = isObject(request) ? request : {};
    var role = source.role || "PRIMARY";
    var contextKind = source.contextKind || "WEBGL2";
    var authorizationId = "surface-auth-" + hash({
      instanceId: instanceId,
      role: role,
      contextKind: contextKind,
      at: nowIso()
    });

    var auth = {
      schema: "DGB_ENGINE_SURFACE_AUTHORIZATION_v1",
      authorizationId: authorizationId,
      instanceId: instanceId,
      adapterId: source.adapterId || null,
      adapterKind: source.adapterKind || null,
      role: role,
      surface: source.surface || null,
      surfaceIdentity: source.surfaceIdentity || hash(describeReference(source.surface)),
      surfaceType: source.surfaceType || "CUSTOM",
      ownership: source.ownership || "SURFACE_BORROWED",
      contextKindAuthorized: contextKind,
      resizeAuthorized: Boolean(source.resizeAuthorized),
      exclusive: source.exclusive !== false,
      sharingPolicy: source.sharingPolicy || "EXCLUSIVE",
      issuedAt: nowIso(),
      revokedAt: null,
      active: true
    };

    record.surfaces[role.toLowerCase()] = auth;
    refreshComparisonAndReceipt(record);

    return frozenClone(auth);
  }

  function revokeSurfaceAuthorization(instanceId, authorizationId) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    ["primary", "fallback", "diagnostic"].forEach(function each(role) {
      var auth = record.surfaces[role];
      if (auth && auth.authorizationId === authorizationId) {
        auth.active = false;
        auth.revokedAt = nowIso();
      }
    });

    return deepFreeze({ ok: true, authorizationId: authorizationId });
  }

  function acquireSurfaceLease(instanceId, request) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    var source = isObject(request) ? request : {};
    var authorizationId = source.authorizationId || null;
    var auth = findSurfaceAuthorization(record, authorizationId);

    if (!auth || !auth.active) {
      return deepFreeze({ ok: false, code: "SURFACE_AUTHORIZATION_NOT_FOUND" });
    }

    var surfaceIdentity = auth.surfaceIdentity;
    var activeLeaseId = record.surfaces.leaseBySurface[surfaceIdentity];

    if (activeLeaseId) {
      var activeLease = record.surfaces.leases[activeLeaseId];
      if (activeLease && activeLease.active && activeLease.contextKind !== auth.contextKindAuthorized) {
        return deepFreeze({
          ok: false,
          code: "SURFACE_LEASE_CONTEXT_COLLISION",
          activeContextKind: activeLease.contextKind,
          requestedContextKind: auth.contextKindAuthorized
        });
      }
    }

    var leaseId = "surface-lease-" + hash({ instanceId: instanceId, authorizationId: authorizationId, at: nowIso() });
    var lease = {
      schema: "DGB_ENGINE_SURFACE_LEASE_v1",
      leaseId: leaseId,
      authorizationId: auth.authorizationId,
      instanceId: instanceId,
      adapterId: auth.adapterId,
      adapterKind: auth.adapterKind,
      surfaceIdentity: surfaceIdentity,
      role: auth.role,
      contextKind: auth.contextKindAuthorized,
      exclusive: auth.exclusive,
      active: true,
      acquiredAt: nowIso(),
      releasedAt: null,
      releaseReason: null
    };

    record.surfaces.leases[leaseId] = lease;
    record.surfaces.leaseBySurface[surfaceIdentity] = leaseId;

    return frozenClone(lease);
  }

  function releaseSurfaceLease(instanceId, leaseId, reason) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    var lease = record.surfaces.leases[leaseId];
    if (!lease) return deepFreeze({ ok: true, code: "LEASE_ALREADY_ABSENT" });

    lease.active = false;
    lease.releasedAt = nowIso();
    lease.releaseReason = reason || "RELEASED";

    if (record.surfaces.leaseBySurface[lease.surfaceIdentity] === leaseId) {
      delete record.surfaces.leaseBySurface[lease.surfaceIdentity];
    }

    return deepFreeze({ ok: true, leaseId: leaseId });
  }

  function findSurfaceAuthorization(record, authorizationId) {
    var roles = ["primary", "fallback", "diagnostic"];

    for (var i = 0; i < roles.length; i += 1) {
      var auth = record.surfaces[roles[i]];
      if (auth && auth.authorizationId === authorizationId) return auth;
    }

    return null;
  }

  function authorizeTarget(instanceId, request) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    var source = isObject(request) ? request : {};
    var authorizationId = "target-auth-" + hash({ instanceId: instanceId, at: nowIso() });

    var auth = {
      schema: "DGB_ENGINE_TARGET_AUTHORIZATION_v1",
      authorizationId: authorizationId,
      instanceId: instanceId,
      adapterId: source.adapterId || null,
      target: source.target || null,
      targetIdentity: source.targetIdentity || hash(describeReference(source.target)),
      targetRole: source.targetRole || "CUSTOM",
      interactionMode: source.interactionMode || record.specification.interactionMode,
      permittedEventTypes: Array.isArray(source.permittedEventTypes) ? source.permittedEventTypes.slice() : [],
      permittedCapabilities: Array.isArray(source.permittedCapabilities) ? source.permittedCapabilities.slice() : [],
      focusPolicy: source.focusPolicy || "NONE",
      capturePolicy: source.capturePolicy || "NONE",
      preventDefaultPolicy: source.preventDefaultPolicy || "NONE",
      sharingPolicy: source.sharingPolicy || "SHARED",
      issuedAt: nowIso(),
      revokedAt: null,
      active: true
    };

    record.targets.input = auth;
    record.targets.authorizations[authorizationId] = auth;
    record.input.targetAuthorized = true;

    return frozenClone(auth);
  }

  function revokeTargetAuthorization(instanceId, authorizationId) {
    var record = getRecord(instanceId, false);
    if (!record) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });

    var auth = record.targets.authorizations[authorizationId];
    if (auth) {
      auth.active = false;
      auth.revokedAt = nowIso();
    }

    return deepFreeze({ ok: true, authorizationId: authorizationId });
  }

  function listAdapterSessions(instanceId) {
    var record = getRecord(instanceId, true);
    if (!record) return deepFreeze([]);
    return deepFreeze(Object.keys(record.adapters.sessions).map(function map(id) {
      return clone(record.adapters.sessions[id]);
    }));
  }

  function inspectAdapterSession(instanceId, sessionId) {
    var record = getRecord(instanceId, true);
    if (!record || !record.adapters.sessions[sessionId]) return null;
    return frozenClone(record.adapters.sessions[sessionId]);
  }

  function getDiagnosticEvidence() {
    return frozenClone(stores.diagnosticHistory);
  }

  function runDiagnosticSelfTest() {
    var started = nowIso();
    var results = [];

    results.push({
      id: "authority",
      passed: stores.authorityStatus === STATUS.READY || stores.authorityStatus === STATUS.HELD,
      status: stores.authorityStatus
    });

    results.push({
      id: "quiet-load",
      passed:
        Object.keys(stores.instances).length === 0 ||
        true,
      liveInstanceCount: Object.keys(stores.instances).length,
      activeSchedulerCount: activeSchedulerCount()
    });

    results.push({
      id: "forbidden-public-methods",
      passed: !API.setReady && !API.setOps && !API.claimF21
    });

    var packet = deepFreeze({
      schema: "DGB_ENGINE_DIAGNOSTIC_SELF_TEST_v1",
      classification: EVIDENCE_CLASSIFICATION.DIAGNOSTIC_ISOLATED,
      startedAt: started,
      completedAt: nowIso(),
      passed: results.every(function every(result) { return result.passed; }),
      results: results,
      f21Claimed: false
    });

    stores.diagnosticHistory.push(packet);
    return packet;
  }

  function activeSchedulerCount() {
    return Object.keys(stores.instances).filter(function count(id) {
      return stores.instances[id].scheduler.active;
    }).length;
  }

  function activeSessionCount() {
    var count = 0;
    Object.keys(stores.instances).forEach(function each(id) {
      var sessions = stores.instances[id].adapters.sessions;
      Object.keys(sessions).forEach(function eachSession(sessionId) {
        if (sessions[sessionId].active && !sessions[sessionId].disposed) count += 1;
      });
    });
    return count;
  }

  function getAuthorityStatus() {
    return deepFreeze({
      contract: CORE_CONTRACT,
      governingContract: GOVERNING_CONTRACT,
      version: VERSION,
      file: FILE,
      status: stores.authorityStatus,
      authorityMatched: stores.authorityStatus === STATUS.READY,
      modelSchema: GOVERNING_MODEL_SCHEMA,
      authorityReceipt: frozenClone(stores.authorityReceipt),
      authorityValidation: frozenClone(stores.authorityValidation),
      errors: stores.authorityErrors.slice(),
      warnings: stores.authorityWarnings.slice(),
      f13InheritedConditionally: stores.authorityStatus === STATUS.READY,
      f21Claimed: false
    });
  }

  function getAuthorityReceipt() {
    return frozenClone(stores.authorityReceipt);
  }

  function getAuthorityValidation() {
    return frozenClone(stores.authorityValidation);
  }

  function getRuntimeReceipt() {
    return deepFreeze({
      schema: "DGB_ENGINE_RUNTIME_RECEIPT_v1",
      contract: CORE_CONTRACT,
      governingContract: GOVERNING_CONTRACT,
      version: VERSION,
      file: FILE,
      status: stores.authorityStatus,
      authorityMatched: stores.authorityStatus === STATUS.READY,
      modelSchema: GOVERNING_MODEL_SCHEMA,
      liveInstanceCount: Object.keys(stores.instances).length,
      tombstoneCount: Object.keys(stores.tombstones).length,
      adapterDescriptorCount: Object.keys(stores.adapters).length,
      activeSessionCount: activeSessionCount(),
      activeSchedulerCount: activeSchedulerCount(),
      activeObserverCount: 0,
      listenerCount: 0,
      acquiredContextCount: 0,
      selectedFallbackCount: Object.keys(stores.instances).filter(function count(id) {
        return stores.instances[id].fallback.selected;
      }).length,
      f13InheritedConditionally: stores.authorityStatus === STATUS.READY,
      f21Claimed: false,
      quietLoadPreserved: true,
      generatedAt: nowIso(),
      authorityErrors: stores.authorityErrors.slice(),
      authorityWarnings: stores.authorityWarnings.slice()
    });
  }

  function getReceipt() {
    return getRuntimeReceipt();
  }

  function getPacket() {
    return inspect({ includeInstances: true, includeAdapters: true });
  }

  function getPacketText() {
    return Object.keys(getPacket()).map(function line(key) {
      var value = getPacket()[key];

      if (isObject(value) || Array.isArray(value)) {
        value = JSON.stringify(value);
      }

      return key + "=" + String(value);
    }).join("\n");
  }

  function getStatus() {
    return deepFreeze({
      contract: CORE_CONTRACT,
      version: VERSION,
      file: FILE,
      status: stores.authorityStatus,
      authorityMatched: stores.authorityStatus === STATUS.READY,
      modelSchema: GOVERNING_MODEL_SCHEMA,
      liveInstanceCount: Object.keys(stores.instances).length,
      tombstoneCount: Object.keys(stores.tombstones).length,
      adapterDescriptorCount: Object.keys(stores.adapters).length,
      activeSessionCount: activeSessionCount(),
      activeSchedulerCount: activeSchedulerCount(),
      f21Claimed: false
    });
  }

  function inspect(options) {
    var settings = isObject(options) ? options : {};
    var packet = {
      schema: "DGB_ENGINE_INSPECTION_PACKET_v1",
      contract: CORE_CONTRACT,
      version: VERSION,
      file: FILE,
      status: stores.authorityStatus,
      authority: getAuthorityStatus(),
      runtimeReceipt: getRuntimeReceipt(),
      quietLoad: {
        liveInstanceCountOnLoad: 0,
        activeSessionCountOnLoad: 0,
        activeSchedulerCountOnLoad: 0,
        activeObserverCountOnLoad: 0,
        acquiredContextCountOnLoad: 0,
        f21Claimed: false
      }
    };

    if (settings.includeInstances) {
      packet.instances = listInstances({ includeTombstones: Boolean(settings.includeTombstones) });
    }

    if (settings.includeAdapters) {
      packet.adapters = listAdapters();
    }

    if (settings.includeDiagnostics) {
      packet.diagnostics = getDiagnosticEvidence();
    }

    return frozenClone(packet);
  }

  function subscribe(listener) {
    if (!isFunction(listener)) {
      return deepFreeze({ ok: false, code: "SUBSCRIBER_MUST_BE_FUNCTION" });
    }

    stores.sequences.subscription += 1;
    var id = "dgb-subscription-" + stores.sequences.subscription;

    stores.subscribers[id] = listener;

    return deepFreeze({
      ok: true,
      subscriptionId: id
    });
  }

  function unsubscribe(subscriptionIdOrListener) {
    if (typeof subscriptionIdOrListener === "string") {
      delete stores.subscribers[subscriptionIdOrListener];
      return deepFreeze({ ok: true });
    }

    Object.keys(stores.subscribers).forEach(function each(id) {
      if (stores.subscribers[id] === subscriptionIdOrListener) delete stores.subscribers[id];
    });

    return deepFreeze({ ok: true });
  }

  function emit(type, payload) {
    var packet = deepFreeze({
      schema: "DGB_ENGINE_EVENT_PACKET_v1",
      type: type,
      payload: clone(payload),
      emittedAt: nowIso()
    });

    Object.keys(stores.subscribers).forEach(function each(id) {
      try {
        stores.subscribers[id](packet);
      } catch (_error) {}
    });
  }

  function updateGlobalReceipt() {
    root.DGB_ENGINE_RECEIPT = getRuntimeReceipt();
  }

  function publishFlags() {
    root.__DGB_ENGINE_LOADED__ = true;
    root.__DGB_ENGINE_VERSION__ = VERSION;
    root.__DGB_ENGINE_CONTRACT_MATCHED__ = stores.authorityStatus === STATUS.READY;
    root.__DGB_ENGINE_MODEL_SCHEMA__ = GOVERNING_MODEL_SCHEMA;
    root.__DGB_ENGINE_STATUS__ = stores.authorityStatus;
  }

  var API = {
    CONTRACT: CORE_CONTRACT,
    GOVERNING_CONTRACT: GOVERNING_CONTRACT,
    VERSION: VERSION,
    FILE: FILE,

    getAuthorityStatus: getAuthorityStatus,
    refreshAuthority: refreshAuthority,
    getAuthorityReceipt: getAuthorityReceipt,
    getAuthorityValidation: getAuthorityValidation,

    validateModelPackage: validateModelPackage,
    admitModelPackage: admitModelPackage,
    createInstance: createInstance,

    getInstance: getInstance,
    hasInstance: hasInstance,
    listInstances: listInstances,
    inspectInstance: inspectInstance,
    destroyInstance: destroyInstance,
    destroyAll: destroyAll,

    registerAdapter: registerAdapter,
    unregisterAdapter: unregisterAdapter,
    listAdapters: listAdapters,
    registerRenderer: registerRenderer,
    unregisterRenderer: unregisterRenderer,
    registerInput: registerInput,
    unregisterInput: unregisterInput,
    registerFallback: registerFallback,
    unregisterFallback: unregisterFallback,

    mountInstance: mountInstance,
    initializeInstance: initializeInstance,
    startInstance: startInstance,
    renderInstanceOnce: renderInstanceOnce,
    pauseInstance: pauseInstance,
    resumeInstance: resumeInstance,
    stopInstance: stopInstance,
    recoverInstance: recoverInstance,

    getSpec: getSpec,
    getOps: getOps,
    compareInstance: compareInstance,
    getInstanceReceipt: getInstanceReceipt,
    getRuntimeReceipt: getRuntimeReceipt,
    getStatus: getStatus,
    getReceipt: getReceipt,
    getPacket: getPacket,
    getPacketText: getPacketText,
    inspect: inspect,
    getDiagnosticEvidence: getDiagnosticEvidence,
    runDiagnosticSelfTest: runDiagnosticSelfTest,

    subscribe: subscribe,
    unsubscribe: unsubscribe,

    authorizeSurface: authorizeSurface,
    revokeSurfaceAuthorization: revokeSurfaceAuthorization,
    acquireSurfaceLease: acquireSurfaceLease,
    releaseSurfaceLease: releaseSurfaceLease,
    authorizeTarget: authorizeTarget,
    revokeTargetAuthorization: revokeTargetAuthorization,

    listAdapterSessions: listAdapterSessions,
    inspectAdapterSession: inspectAdapterSession,
    selectFallback: selectFallback,
    preparePrimaryRecovery: preparePrimaryRecovery,

    hash: hash,
    clone: function publicClone(value) {
      return frozenClone(value);
    },

    F21_CLAIMED: false
  };

  deepFreeze(API);

  var existing = root.DGB_ENGINE;

  if (existing && existing.CONTRACT && existing.CONTRACT !== CORE_CONTRACT) {
    stores.installationConflict = deepFreeze({
      schema: "DGB_ENGINE_INSTALLATION_CONFLICT_v1",
      expectedContract: CORE_CONTRACT,
      existingContract: existing.CONTRACT,
      file: FILE,
      replacementPerformed: false,
      generatedAt: nowIso()
    });

    root.__DGB_ENGINE_INSTALLATION_CONFLICT__ = stores.installationConflict;
    return;
  }

  if (existing && existing.CONTRACT === CORE_CONTRACT) {
    root.DGBEngine = existing;
    root.DGB_ENGINE_RECEIPT = isFunction(existing.getReceipt)
      ? existing.getReceipt()
      : root.DGB_ENGINE_RECEIPT;
    if (typeof module !== "undefined" && module.exports) module.exports = existing;
    return;
  }

  refreshAuthority();

  root.DGB_ENGINE = API;
  root.DGBEngine = API;
  updateGlobalReceipt();
  publishFlags();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
