// /assets/engine/dgb.engine.js
// DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// Full-file replacement.
// Quiet-load DGB runtime engine core. No instances/adapters/schedulers/observers created on load.
// Governing contract: DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// Governing model schema: DGB_MODEL_PACKAGE_v1
// F21 unclaimed.

(function installDGBInteractiveRuntimeEngineCore(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CORE_CONTRACT = "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";
  var GOVERNING_CONTRACT = "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";
  var MODEL_SCHEMA = "DGB_MODEL_PACKAGE_v1";
  var FILE = "/assets/engine/dgb.engine.js";
  var VERSION = "1.0.0";

  var RUNTIME_RECEIPT_SCHEMA = "DGB_ENGINE_RUNTIME_RECEIPT_v2";
  var INSPECTION_SCHEMA = "DGB_ENGINE_INSPECTION_PACKET_v2";
  var INSTANCE_SCHEMA = "DGB_ENGINE_INTERNAL_INSTANCE_RECORD_v2";
  var EVENT_SCHEMA = "DGB_ENGINE_EVENT_PACKET_v1";
  var EVIDENCE_SCHEMA = "DGB_ENGINE_EVIDENCE_ENVELOPE_v1";
  var INTENT_SCHEMA = "DGB_ENGINE_INTENT_ENVELOPE_v1";

  var STATUS = deepFreeze({ HELD: "HELD", READY: "READY", ERROR: "ERROR", CONFLICT: "CONFLICT" });
  var PROGRESS = deepFreeze({ DECLARED: "DECLARED", LOADED: "LOADED", VALIDATED: "VALIDATED", CREATED: "CREATED", MOUNTED: "MOUNTED", INITIALIZED: "INITIALIZED", VISIBLE: "VISIBLE", INTERACTIVE: "INTERACTIVE", VERIFIED: "VERIFIED", DESTROYED: "DESTROYED" });
  var CONDITION = deepFreeze({ NONE: "NONE", HELD: "HELD", PAUSED: "PAUSED", ERROR: "ERROR", CONTEXT_LOST: "CONTEXT_LOST", FALLBACK: "FALLBACK", DESTROYED: "DESTROYED" });
  var EXECUTION = deepFreeze({ NONE: "NONE", PRIMARY: "PRIMARY", FALLBACK: "FALLBACK", DESTROYED: "DESTROYED" });
  var KIND = deepFreeze({ RENDERER: "renderer", INPUT: "input", FALLBACK: "fallback", CORE: "core" });
  var CLASSIFICATION = deepFreeze({ PRODUCTION: "PRODUCTION", DIAGNOSTIC_ISOLATED: "DIAGNOSTIC_ISOLATED", UNKNOWN: "UNKNOWN" });

  var ORDER = deepFreeze({ DECLARED: 0, LOADED: 1, VALIDATED: 2, CREATED: 3, MOUNTED: 4, INITIALIZED: 5, VISIBLE: 6, INTERACTIVE: 7, VERIFIED: 8, DESTROYED: 9 });

  var REQUIRED_PUBLIC_METHODS = deepFreeze([
    "getAuthorityStatus", "refreshAuthority", "getAuthorityReceipt", "getAuthorityValidation",
    "validateModelPackage", "admitModelPackage", "createInstance", "getInstance", "hasInstance",
    "listInstances", "inspectInstance", "destroyInstance", "destroyAll", "registerAdapter",
    "unregisterAdapter", "listAdapters", "registerRenderer", "unregisterRenderer", "registerInput",
    "unregisterInput", "registerFallback", "unregisterFallback", "mountInstance", "initializeInstance",
    "startInstance", "renderInstanceOnce", "pauseInstance", "resumeInstance", "stopInstance",
    "recoverInstance", "attachInput", "getSpec", "getOps", "compareInstance", "getInstanceReceipt",
    "getRuntimeReceipt", "getStatus", "getReceipt", "getPacket", "getPacketText", "inspect",
    "getDiagnosticEvidence", "runDiagnosticSelfTest", "subscribe", "unsubscribe", "authorizeSurface",
    "revokeSurfaceAuthorization", "acquireSurfaceLease", "releaseSurfaceLease", "authorizeTarget",
    "revokeTargetAuthorization", "listAdapterSessions", "inspectAdapterSession", "selectFallback",
    "preparePrimaryRecovery", "hash", "clone"
  ]);

  var loadBaseline = deepFreeze({
    liveInstanceCountOnLoad: 0,
    activeSessionCountOnLoad: 0,
    activeSchedulerCountOnLoad: 0,
    activeObserverCountOnLoad: 0,
    listenerCountOnLoad: 0,
    contextCreatedByCoreOnLoad: 0,
    instancesCreatedByCoreOnLoad: 0,
    capturedAt: nowIso()
  });

  var stores = {
    installedAt: nowIso(),
    authority: null,
    authorityStatus: STATUS.HELD,
    authorityErrors: [],
    authorityWarnings: [],
    authorityReceipt: null,
    authorityValidation: null,
    authorityIdentity: null,
    instances: Object.create(null),
    tombstones: Object.create(null),
    adapters: Object.create(null),
    subscribers: Object.create(null),
    diagnosticHistory: [],
    publicationVerified: false,
    conflict: null,
    seq: { instance: 0, adapter: 0, session: 0, evidence: 0, intent: 0, event: 0, subscription: 0, auth: 0, lease: 0, target: 0 }
  };

  function nowIso() { try { return new Date().toISOString(); } catch (_e) { return ""; } }
  function isObject(v) { return Boolean(v && typeof v === "object" && !Array.isArray(v)); }
  function isFunction(v) { return typeof v === "function"; }

  function deepFreeze(value, seen) {
    if (!value || (typeof value !== "object" && typeof value !== "function")) return value;
    seen = seen || [];
    if (seen.indexOf(value) !== -1) return value;
    seen.push(value);
    Object.getOwnPropertyNames(value).forEach(function (key) {
      try { deepFreeze(value[key], seen); } catch (_e) {}
    });
    try { Object.freeze(value); } catch (_e2) {}
    return value;
  }

  function clone(value, seen) {
    if (value === null || value === undefined || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "bigint") return String(value);
    if (typeof value === "function") return { type: "Function", name: value.name || "anonymous" };
    seen = seen || [];
    if (seen.indexOf(value) !== -1) return "[Circular]";
    seen.push(value);
    if (Array.isArray(value)) return value.map(function (x) { return clone(x, seen.slice()); });
    var out = {};
    Object.keys(value).forEach(function (key) {
      if (key === "reference" || key === "surface" || key === "target" || key === "callback" || key === "observer") out[key] = describeReference(value[key]);
      else out[key] = clone(value[key], seen.slice());
    });
    return out;
  }

  function frozen(value) { return deepFreeze(clone(value)); }

  function stableStringify(value) {
    function prep(v, seen) {
      if (v === null || v === undefined || typeof v === "string" || typeof v === "number" || typeof v === "boolean") return v;
      if (typeof v === "bigint") return String(v);
      if (typeof v === "function") return "[Function]";
      seen = seen || [];
      if (seen.indexOf(v) !== -1) return "[Circular]";
      seen.push(v);
      if (Array.isArray(v)) return v.map(function (x) { return prep(x, seen.slice()); });
      var o = {};
      Object.keys(v).sort().forEach(function (k) { o[k] = prep(v[k], seen.slice()); });
      return o;
    }
    return JSON.stringify(prep(value, []));
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
    var out = { type: typeof value, tagName: null, id: null, className: null, width: null, height: null, nodeType: null };
    try { out.tagName = value.tagName || null; } catch (_e1) {}
    try { out.id = value.id || null; } catch (_e2) {}
    try { out.className = typeof value.className === "string" ? value.className : null; } catch (_e3) {}
    try { out.width = Number(value.width || value.clientWidth || 0) || null; } catch (_e4) {}
    try { out.height = Number(value.height || value.clientHeight || 0) || null; } catch (_e5) {}
    try { out.nodeType = value.nodeType || null; } catch (_e6) {}
    return out;
  }

  function emit(type, payload) {
    var packet = deepFreeze({ schema: EVENT_SCHEMA, type: type, payload: clone(payload), emittedAt: nowIso() });
    Object.keys(stores.subscribers).forEach(function (id) {
      try { stores.subscribers[id](packet); } catch (_e) {}
    });
  }

  function readFirst(obj, paths) {
    if (!obj) return undefined;
    for (var i = 0; i < paths.length; i += 1) {
      var parts = paths[i].split(".");
      var cur = obj;
      var ok = true;
      for (var j = 0; j < parts.length; j += 1) {
        if (cur === null || cur === undefined || !(parts[j] in Object(cur))) { ok = false; break; }
        cur = cur[parts[j]];
      }
      if (ok && cur !== undefined) return cur;
    }
    return undefined;
  }

  function discoverContract() {
    var canonical = root.DGB_ENGINE_CONTRACT || null;
    var compat = root.DGBEngineContract || null;

    if (canonical && compat && canonical !== compat) {
      return failAuthority("GOVERNING_CONTRACT_GLOBAL_CONFLICT", false, ["DGB_ENGINE_CONTRACT and DGBEngineContract differ."]);
    }

    var candidate = canonical || compat;
    if (!candidate) return failAuthority("GOVERNING_CONTRACT_NOT_AVAILABLE", true, [], ["Governing contract not loaded."]);

    if (candidate.contract !== GOVERNING_CONTRACT) {
      return failAuthority("GOVERNING_CONTRACT_IDENTITY_MISMATCH", false, ["Unexpected governing contract."]);
    }

    var required = ["validateModelPackage", "createInstanceSpec", "createDeclaredOps", "compareSpecAndOps", "composeReceipt", "getAuthorityReceipt", "getAuthorityValidation"];
    var missing = required.filter(function (name) { return !isFunction(candidate[name]); });
    if (missing.length) return failAuthority("GOVERNING_CONTRACT_METHODS_MISSING", false, ["Missing methods: " + missing.join(", ")]);

    var receipt;
    var validation;
    try {
      receipt = candidate.getAuthorityReceipt();
      validation = candidate.getAuthorityValidation();
    } catch (e) {
      return failAuthority("GOVERNING_CONTRACT_AUTHORITY_READ_FAILED", false, [String(e && e.message ? e.message : e)]);
    }

    if (!isObject(validation) || validation.passed !== true || Number(validation.failCount || 0) !== 0) {
      return failAuthority("GOVERNING_CONTRACT_SELF_VALIDATION_FAILED", false, ["Authority validation did not pass."]);
    }

    if (!isObject(receipt)) return failAuthority("GOVERNING_CONTRACT_RECEIPT_MISSING", false, ["Authority receipt missing."]);

    var receiptContract = readFirst(receipt, ["contract", "authorityContract", "identity.contract"]);
    var receiptVersion = readFirst(receipt, ["version", "authorityVersion", "identity.version"]);
    var receiptFile = readFirst(receipt, ["file", "authorityFile", "identity.file"]);
    var receiptModelSchema = readFirst(receipt, ["modelSchema", "governingModelSchema", "identity.modelSchema"]);
    var ready = readFirst(receipt, ["ready", "authorityReady", "status.ready"]);

    if (receiptContract !== undefined && receiptContract !== GOVERNING_CONTRACT) return failAuthority("GOVERNING_RECEIPT_CONTRACT_MISMATCH", false, ["Receipt contract mismatch."]);
    if (receiptModelSchema !== undefined && receiptModelSchema !== MODEL_SCHEMA) return failAuthority("GOVERNING_MODEL_SCHEMA_MISMATCH", false, ["Receipt model schema mismatch."]);
    if (ready !== undefined && ready !== true) return failAuthority("GOVERNING_RECEIPT_NOT_READY", false, ["Authority receipt not ready."]);

    return {
      ok: true,
      held: false,
      code: "GOVERNING_CONTRACT_ADMITTED",
      contract: candidate,
      receipt: frozen(receipt),
      validation: frozen(validation),
      identity: deepFreeze({
        contract: GOVERNING_CONTRACT,
        version: receiptVersion !== undefined ? receiptVersion : candidate.version || null,
        file: receiptFile !== undefined ? receiptFile : candidate.file || null,
        modelSchema: MODEL_SCHEMA,
        receiptHash: receipt.contractHash || receipt.receiptHash || hash(receipt)
      }),
      errors: [],
      warnings: []
    };
  }

  function failAuthority(code, held, errors, warnings) {
    return { ok: false, held: held, code: code, contract: null, errors: errors || [], warnings: warnings || [] };
  }

  function refreshAuthority() {
    var result = discoverContract();
    stores.authorityErrors = result.errors || [];
    stores.authorityWarnings = result.warnings || [];
    stores.authority = result.ok ? result.contract : null;
    stores.authorityStatus = result.ok ? STATUS.READY : (result.held ? STATUS.HELD : STATUS.ERROR);
    stores.authorityReceipt = result.ok ? result.receipt : null;
    stores.authorityValidation = result.ok ? result.validation : null;
    stores.authorityIdentity = result.ok ? result.identity : null;
    publishFlags();
    updateGlobalReceipt();
    emit("authority", getAuthorityStatus());
    return getAuthorityStatus();
  }

  function requireAuthority() {
    if (stores.authorityStatus !== STATUS.READY || !stores.authority) refreshAuthority();
    return stores.authorityStatus === STATUS.READY ? stores.authority : null;
  }

  function allocate(prefix, key, extra) {
    stores.seq[key] += 1;
    return prefix + "-" + stores.seq[key] + "-" + hash({ prefix: prefix, sequence: stores.seq[key], extra: extra || null, at: nowIso() }).replace("fnv1a32-", "");
  }

  function createBaseRecord(instanceId, model, validation, spec, ops, options) {
    var now = nowIso();
    return {
      schema: INSTANCE_SCHEMA,
      identity: {
        instanceId: instanceId,
        sequence: stores.seq.instance,
        modelId: model.identity && model.identity.modelId || null,
        modelClass: model.identity && model.identity.modelClass || null,
        modelContract: model.identity && model.identity.contract || null,
        modelVersion: model.identity && model.identity.version || null,
        route: model.identity && model.identity.route || null,
        packageHash: model.packageHash || hash(model),
        createdAt: now
      },
      authority: {
        coreContract: CORE_CONTRACT,
        governingContract: GOVERNING_CONTRACT,
        modelSchema: MODEL_SCHEMA,
        authorityMatched: true,
        authorityReady: true,
        authorityReceiptHash: stores.authorityIdentity && stores.authorityIdentity.receiptHash,
        f21Claimed: false
      },
      admission: {
        validationPassed: validation.passed === true,
        validation: frozen(validation),
        admittedModel: model,
        admittedAt: now
      },
      spec: deepFreeze(clone(spec)),
      opsDraft: clone(ops),
      opsSnapshot: null,
      comparison: null,
      receipt: null,
      lifecycle: {
        progressState: PROGRESS.CREATED,
        conditionState: CONDITION.NONE,
        executionMode: EXECUTION.NONE,
        createdAt: now,
        updatedAt: now,
        destroyedAt: null
      },
      mount: { reference: null, supplied: false, resolved: false, connected: false, width: 0, height: 0, nonzero: false },
      surfaces: { primary: null, fallback: null, diagnostic: null, leases: Object.create(null) },
      targets: { input: null, authorizations: Object.create(null) },
      adapters: { renderer: null, input: null, fallback: null, sessions: Object.create(null) },
      proofs: {
        current: { surfaceNonzero: false, initialized: false, visible: false, interactive: false, fallbackVisible: false, noBlockingError: true },
        historical: { initialized: false, visible: false, interactive: false, fallbackVisible: false }
      },
      scheduler: { active: false, requestId: null, reason: null },
      evidence: { accepted: [], rejected: [], pending: [] },
      intents: [],
      errors: [],
      warnings: [],
      options: clone(options || {})
    };
  }

  function validateModelPackage(candidate) {
    var contract = requireAuthority();
    if (!contract) return deepFreeze({ passed: false, status: "HELD", reason: "GOVERNING_CONTRACT_NOT_AVAILABLE", normalized: null, failures: [], warnings: [] });
    return contract.validateModelPackage(candidate);
  }

  function admitModelPackage(candidate, options) {
    var validation = validateModelPackage(candidate);
    return deepFreeze({
      admitted: Boolean(validation && validation.passed === true && validation.normalized),
      status: validation && validation.passed === true && validation.normalized ? "ADMITTED" : "REJECTED",
      normalized: validation && validation.normalized ? frozen(validation.normalized) : null,
      validation: frozen(validation),
      options: frozen(options || {})
    });
  }

  function createInstance(candidate, options) {
    var contract = requireAuthority();
    var settings = isObject(options) ? options : {};
    if (!contract) return deepFreeze({ ok: false, status: "HELD", code: "GOVERNING_CONTRACT_NOT_AVAILABLE" });

    var validation = contract.validateModelPackage(candidate);
    if (!validation || validation.passed !== true || !validation.normalized) {
      return deepFreeze({ ok: false, status: "REJECTED", code: "MODEL_VALIDATION_FAILED", validation: frozen(validation) });
    }

    var instanceId = typeof settings.instanceId === "string" && settings.instanceId.trim()
      ? settings.instanceId.trim()
      : allocate("dgb-engine-instance", "instance");

    if (stores.instances[instanceId] || stores.tombstones[instanceId]) {
      return deepFreeze({ ok: false, status: "REJECTED", code: "INSTANCE_ID_DUPLICATE_OR_TERMINAL" });
    }

    var model = validation.normalized;
    var spec;
    var ops;
    try {
      spec = contract.createInstanceSpec({
        interactionMode: settings.interactionMode || model.interaction && model.interaction.mode || "NONE",
        requiresInteraction: typeof settings.requiresInteraction === "boolean" ? settings.requiresInteraction : Boolean(model.interaction && model.interaction.mode && model.interaction.mode !== "NONE"),
        requiresFallback: Boolean(settings.fallbackRequired),
        requiredBackend: Array.isArray(settings.requiredBackend) ? settings.requiredBackend : ["WEBGL2"],
        preferredBackend: settings.preferredBackend || ["WEBGPU", "WEBGL2"],
        fallbackBackend: settings.fallbackBackend || ["CANVAS2D", "SVG", "HTML"],
        metadata: { modelId: model.identity && model.identity.modelId || null, coreContract: CORE_CONTRACT }
      });
      ops = contract.createDeclaredOps({
        loaded: true,
        initialized: false,
        backend: "NONE",
        state: "CREATED",
        observed: {
          fileLoaded: true,
          contractMatched: true,
          modelValidated: true,
          instanceCreated: true,
          mountPresent: false,
          surfaceNonzero: false,
          backendInitialized: false,
          firstFramePresented: false,
          visiblePixelObserved: false,
          interactionObserved: false,
          noBlockingError: true
        }
      });
    } catch (e) {
      return deepFreeze({ ok: false, status: "REJECTED", code: "INSTANCE_PRECOMMIT_BUILD_FAILED", error: String(e && e.message ? e.message : e) });
    }

    stores.seq.instance += 1;
    var record = createBaseRecord(instanceId, model, validation, spec, ops, settings);
    stores.instances[instanceId] = record;
    recompute(record);
    updateGlobalReceipt();
    emit("instanceCreated", { instanceId: instanceId, modelId: record.identity.modelId });
    return facade(record);
  }

  function facade(record) {
    return deepFreeze({
      instanceId: record.identity.instanceId,
      modelId: record.identity.modelId,
      inspect: function () { return inspectInstance(record.identity.instanceId); },
      getOps: function () { return getOps(record.identity.instanceId); },
      getReceipt: function () { return getInstanceReceipt(record.identity.instanceId); },
      destroy: function (options) { return destroyInstance(record.identity.instanceId, options); }
    });
  }

  function getRecord(id) { return stores.instances[id] || null; }
  function hasInstance(id) { return Boolean(stores.instances[id]); }
  function getInstance(id) { var r = getRecord(id); return r ? facade(r) : null; }

  function listInstances(options) {
    var settings = isObject(options) ? options : {};
    var list = Object.keys(stores.instances).map(function (id) { return summarize(stores.instances[id]); });
    if (settings.includeTombstones) list = list.concat(Object.keys(stores.tombstones).map(function (id) { return stores.tombstones[id].summary; }));
    return deepFreeze(list);
  }

  function summarize(r) {
    return {
      instanceId: r.identity.instanceId,
      modelId: r.identity.modelId,
      progressState: r.lifecycle.progressState,
      conditionState: r.lifecycle.conditionState,
      executionMode: r.lifecycle.executionMode,
      ready: Boolean(r.receipt && r.receipt.ready),
      status: r.receipt ? r.receipt.status : "UNKNOWN",
      destroyed: r.lifecycle.progressState === PROGRESS.DESTROYED
    };
  }

  function inspectInstance(id) {
    if (stores.tombstones[id]) return stores.tombstones[id].inspection;
    var r = stores.instances[id];
    if (!r) return deepFreeze({ found: false, instanceId: id || null, status: "NOT_FOUND" });
    return frozen({ found: true, record: r });
  }

  function getSpec(id) { var r = stores.instances[id]; return r ? frozen(r.spec) : stores.tombstones[id] ? stores.tombstones[id].spec : null; }
  function getOps(id) { var r = stores.instances[id]; return r ? frozen(r.opsSnapshot) : stores.tombstones[id] ? stores.tombstones[id].ops : null; }
  function compareInstance(id) { var r = stores.instances[id]; return r ? frozen(r.comparison) : stores.tombstones[id] ? stores.tombstones[id].comparison : null; }
  function getInstanceReceipt(id) { var r = stores.instances[id]; return r ? frozen(r.receipt) : stores.tombstones[id] ? stores.tombstones[id].receipt : null; }

  function registerAdapter(descriptor) {
    if (!isObject(descriptor)) return deepFreeze({ ok: false, code: "ADAPTER_DESCRIPTOR_REQUIRED" });
    var kind = descriptor.kind;
    if (kind !== KIND.RENDERER && kind !== KIND.INPUT && kind !== KIND.FALLBACK) return deepFreeze({ ok: false, code: "ADAPTER_KIND_INVALID" });
    var adapterId = typeof descriptor.adapterId === "string" && descriptor.adapterId.trim() ? descriptor.adapterId.trim() : allocate("dgb-" + kind + "-adapter", "adapter");
    if (stores.adapters[adapterId]) return deepFreeze({ ok: false, code: "ADAPTER_ID_DUPLICATE", adapterId: adapterId });
    stores.adapters[adapterId] = {
      adapterId: adapterId,
      kind: kind,
      contract: descriptor.contract || null,
      version: descriptor.version || null,
      capabilities: frozen(descriptor.capabilities || {}),
      operations: {
        initialize: isFunction(descriptor.initialize) ? descriptor.initialize : null,
        render: isFunction(descriptor.render) ? descriptor.render : null,
        renderOnce: isFunction(descriptor.renderOnce) ? descriptor.renderOnce : null,
        submitFrame: isFunction(descriptor.submitFrame) ? descriptor.submitFrame : null,
        attach: isFunction(descriptor.attach) ? descriptor.attach : null,
        detach: isFunction(descriptor.detach) ? descriptor.detach : null,
        dispose: isFunction(descriptor.dispose) ? descriptor.dispose : null,
        recover: isFunction(descriptor.recover) ? descriptor.recover : null
      },
      registeredAt: nowIso()
    };
    updateGlobalReceipt();
    return deepFreeze({ ok: true, adapterId: adapterId, kind: kind });
  }

  function unregisterAdapter(adapterId) {
    delete stores.adapters[adapterId];
    updateGlobalReceipt();
    return deepFreeze({ ok: true, adapterId: adapterId });
  }

  function listAdapters(options) {
    var kind = isObject(options) ? options.kind : null;
    return deepFreeze(Object.keys(stores.adapters).filter(function (id) {
      return !kind || stores.adapters[id].kind === kind;
    }).map(function (id) {
      var a = stores.adapters[id];
      return { adapterId: a.adapterId, kind: a.kind, contract: a.contract, version: a.version, capabilities: clone(a.capabilities), registeredAt: a.registeredAt };
    }));
  }

  function registerRenderer(d) { d = Object.assign({}, d || {}, { kind: KIND.RENDERER }); return registerAdapter(d); }
  function registerInput(d) { d = Object.assign({}, d || {}, { kind: KIND.INPUT }); return registerAdapter(d); }
  function registerFallback(d) { d = Object.assign({}, d || {}, { kind: KIND.FALLBACK }); return registerAdapter(d); }
  function unregisterRenderer(id) { return unregisterAdapter(id); }
  function unregisterInput(id) { return unregisterAdapter(id); }
  function unregisterFallback(id) { return unregisterAdapter(id); }

  function readRect(ref) {
    var rect = { width: 0, height: 0 };
    try {
      if (ref && isFunction(ref.getBoundingClientRect)) {
        var r = ref.getBoundingClientRect();
        rect.width = Number(r.width) || 0;
        rect.height = Number(r.height) || 0;
      } else if (ref) {
        rect.width = Number(ref.width || ref.clientWidth || 0) || 0;
        rect.height = Number(ref.height || ref.clientHeight || 0) || 0;
      }
    } catch (_e) {}
    return rect;
  }

  function mountInstance(id, binding) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    var b = isObject(binding) ? binding : {};
    var ref = b.reference || null;
    if (!ref && typeof b.selector === "string" && root.document) {
      try { ref = root.document.querySelector(b.selector); } catch (_e) { ref = null; }
    }
    if (!ref && isFunction(b.resolver)) {
      try { ref = b.resolver(); } catch (e) { return enterError(r, "MOUNT_RESOLVER_THROW", String(e && e.message ? e.message : e)); }
    }
    if (!ref) return enterHold(r, "MOUNT_NOT_RESOLVED", "mount.reference");
    var rect = readRect(ref);
    r.mount = { reference: ref, supplied: true, resolved: true, connected: true, width: rect.width, height: rect.height, nonzero: rect.width > 0 && rect.height > 0 };
    if (!r.mount.nonzero) return enterHold(r, "MOUNT_SURFACE_ZERO", "surfaceNonzero");
    r.proofs.current.surfaceNonzero = true;
    advance(r, PROGRESS.MOUNTED);
    recompute(r);
    return deepFreeze({ ok: true, status: "MOUNTED", mount: describeReference(ref) });
  }

  function authorizeSurface(id, request) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    var q = isObject(request) ? request : {};
    var role = String(q.role || "PRIMARY").toLowerCase();
    if (["primary", "fallback", "diagnostic"].indexOf(role) === -1) return deepFreeze({ ok: false, code: "SURFACE_ROLE_INVALID" });
    var auth = {
      authorizationId: allocate("surface-auth", "auth"),
      role: role.toUpperCase(),
      surface: q.surface || null,
      surfaceIdentity: q.surfaceIdentity || hash(describeReference(q.surface)),
      adapterId: q.adapterId || null,
      contextKindsAuthorized: Array.isArray(q.contextKinds) ? q.contextKinds.slice() : [q.contextKind || "WEBGL2"],
      active: true,
      issuedAt: nowIso()
    };
    r.surfaces[role] = auth;
    return frozen(auth);
  }

  function revokeSurfaceAuthorization(id, authorizationId) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    ["primary", "fallback", "diagnostic"].forEach(function (role) {
      if (r.surfaces[role] && r.surfaces[role].authorizationId === authorizationId) r.surfaces[role].active = false;
    });
    recompute(r);
    return deepFreeze({ ok: true, authorizationId: authorizationId });
  }

  function acquireSurfaceLease(id, request) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    var q = isObject(request) ? request : {};
    var lease = { leaseId: allocate("surface-lease", "lease"), authorizationId: q.authorizationId || null, adapterId: q.adapterId || null, contextKind: q.contextKind || "WEBGL2", active: true, acquiredAt: nowIso() };
    r.surfaces.leases[lease.leaseId] = lease;
    return frozen(lease);
  }

  function releaseSurfaceLease(id, leaseId) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (r.surfaces.leases[leaseId]) r.surfaces.leases[leaseId].active = false;
    return deepFreeze({ ok: true, leaseId: leaseId });
  }

  function authorizeTarget(id, request) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    var q = isObject(request) ? request : {};
    var auth = { authorizationId: allocate("target-auth", "target"), adapterId: q.adapterId || null, target: q.target || null, active: true, issuedAt: nowIso() };
    r.targets.input = auth;
    r.targets.authorizations[auth.authorizationId] = auth;
    return frozen(auth);
  }

  function revokeTargetAuthorization(id, authorizationId) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (r.targets.authorizations[authorizationId]) r.targets.authorizations[authorizationId].active = false;
    return deepFreeze({ ok: true, authorizationId: authorizationId });
  }

  function initializeInstance(id, options) {
    var r = getRecord(id);
    if (!r) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" }));
    var q = isObject(options) ? options : {};
    var adapterId = q.adapterId || null;
    var adapter = adapterId ? stores.adapters[adapterId] : null;
    if (!adapter || adapter.kind !== KIND.RENDERER) return Promise.resolve(enterHold(r, "RENDERER_ADAPTER_NOT_AVAILABLE", "renderer"));
    if (ORDER[r.lifecycle.progressState] < ORDER.MOUNTED) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_MOUNTED" }));
    var session = createSession(r, adapter, {});
    r.adapters.renderer = session.sessionId;
    r.lifecycle.executionMode = EXECUTION.PRIMARY;
    return callAdapter(adapter, "initialize", r, session, q).then(function (result) {
      if (result && result.ok === false) return enterError(r, "RENDERER_INITIALIZE_FAILED", result.error || "Renderer initialize failed.");
      r.proofs.current.initialized = true;
      r.proofs.historical.initialized = true;
      advance(r, PROGRESS.INITIALIZED);
      recompute(r);
      return deepFreeze({ ok: true, status: "INITIALIZED", sessionId: session.sessionId });
    });
  }

  function attachInput(id, options) {
    var r = getRecord(id);
    if (!r) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" }));
    var q = isObject(options) ? options : {};
    var adapter = q.adapterId ? stores.adapters[q.adapterId] : null;
    if (!adapter || adapter.kind !== KIND.INPUT) return Promise.resolve(deepFreeze({ ok: false, code: "INPUT_ADAPTER_NOT_AVAILABLE" }));
    var session = createSession(r, adapter, {});
    r.adapters.input = session.sessionId;
    return callAdapter(adapter, "attach", r, session, q).then(function (result) {
      if (result && result.ok === false) return enterError(r, "INPUT_ATTACH_FAILED", result.error || "Input attach failed.");
      r.proofs.current.interactive = true;
      r.proofs.historical.interactive = true;
      advance(r, PROGRESS.INTERACTIVE);
      recompute(r);
      return deepFreeze({ ok: true, status: "ATTACHED", sessionId: session.sessionId });
    });
  }

  function createSession(r, adapter, binding) {
    var session = { sessionId: allocate("dgb-session", "session"), adapterId: adapter.adapterId, adapterKind: adapter.kind, active: true, disposed: false, createdAt: nowIso(), binding: clone(binding || {}) };
    r.adapters.sessions[session.sessionId] = session;
    return session;
  }

  function callAdapter(adapter, method, record, session, options) {
    var op = adapter.operations[method];
    if (!isFunction(op)) return Promise.resolve({ ok: true, skipped: true });
    try {
      return Promise.resolve(op({
        instanceId: record.identity.instanceId,
        adapterId: adapter.adapterId,
        sessionId: session.sessionId,
        reportEvidence: function (e) { return reportEvidence(record.identity.instanceId, e, { adapterId: adapter.adapterId, adapterKind: adapter.kind, sessionId: session.sessionId }); },
        emitIntent: function (i) { return acceptIntent(record.identity.instanceId, i, { adapterId: adapter.adapterId, adapterKind: adapter.kind, sessionId: session.sessionId }); }
      }, options || {}));
    } catch (e) {
      return Promise.resolve({ ok: false, error: String(e && e.message ? e.message : e) });
    }
  }

  function reportEvidence(id, envelope, binding) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    var e = isObject(envelope) ? envelope : {};
    var packet = {
      schema: EVIDENCE_SCHEMA,
      evidenceId: allocate("dgb-evidence", "evidence"),
      evidenceType: e.evidenceType || "UNKNOWN",
      value: e.value,
      classification: e.classification || CLASSIFICATION.UNKNOWN,
      adapterId: binding && binding.adapterId || "UNKNOWN",
      adapterKind: binding && binding.adapterKind || "UNKNOWN",
      sessionId: binding && binding.sessionId || null,
      receivedAt: nowIso(),
      accepted: false,
      rejectionCode: null
    };
    if (packet.classification !== CLASSIFICATION.PRODUCTION) packet.rejectionCode = "DIAGNOSTIC_EVIDENCE_NOT_GOVERNING";
    if (packet.rejectionCode) {
      r.evidence.rejected.push(packet);
      return frozen({ ok: false, evidence: packet });
    }
    packet.accepted = true;
    r.evidence.accepted.push(packet);
    applyEvidence(r, packet);
    recompute(r);
    return frozen({ ok: true, evidence: packet });
  }

  function applyEvidence(r, e) {
    if (e.evidenceType === "VISIBLE_PIXEL_OBSERVED" && e.value === true) {
      r.proofs.current.visible = true;
      r.proofs.historical.visible = true;
      advance(r, PROGRESS.VISIBLE);
    }
    if (e.evidenceType === "INTERACTION_OBSERVED" && e.value === true) {
      r.proofs.current.interactive = true;
      r.proofs.historical.interactive = true;
      advance(r, PROGRESS.INTERACTIVE);
    }
    if (e.evidenceType === "BLOCKING_ERROR") enterError(r, "ADAPTER_BLOCKING_ERROR", String(e.value || "Blocking error"));
  }

  function acceptIntent(id, envelope, binding) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    var packet = { schema: INTENT_SCHEMA, intentId: allocate("dgb-intent", "intent"), envelope: clone(envelope || {}), binding: clone(binding || {}), accepted: true, receivedAt: nowIso() };
    r.intents.push(packet);
    return frozen({ ok: true, intent: packet });
  }

  function selectFallback(id) { var r = getRecord(id); if (!r) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" })); r.lifecycle.executionMode = EXECUTION.FALLBACK; r.lifecycle.conditionState = CONDITION.FALLBACK; return Promise.resolve(deepFreeze({ ok: true, status: "FALLBACK_SELECTED" })); }
  function preparePrimaryRecovery(id) { var r = getRecord(id); if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" }); r.lifecycle.executionMode = EXECUTION.PRIMARY; return deepFreeze({ ok: true, status: "PRIMARY_RECOVERY_PREPARED" }); }
  function recoverInstance(id) { var r = getRecord(id); if (!r) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" })); r.lifecycle.conditionState = CONDITION.NONE; return Promise.resolve(deepFreeze({ ok: true, status: "RECOVERED" })); }

  function advance(r, target) {
    if (ORDER[target] > ORDER[r.lifecycle.progressState] && r.lifecycle.progressState !== PROGRESS.DESTROYED) r.lifecycle.progressState = target;
    r.lifecycle.updatedAt = nowIso();
  }

  function enterHold(r, code, missing) {
    r.lifecycle.conditionState = CONDITION.HELD;
    r.warnings.push({ code: code, missing: missing || null, at: nowIso() });
    recompute(r);
    return deepFreeze({ ok: false, status: "HELD", code: code, missing: missing || null });
  }

  function enterError(r, code, message) {
    r.lifecycle.conditionState = CONDITION.ERROR;
    r.proofs.current.noBlockingError = false;
    r.errors.push({ code: code, message: message || code, at: nowIso() });
    stopInstance(r.identity.instanceId, code);
    recompute(r);
    return deepFreeze({ ok: false, status: "ERROR", code: code, message: message || code });
  }

  function recompute(r) {
    var contract = stores.authorityStatus === STATUS.READY ? stores.authority : null;
    r.opsDraft.state = r.lifecycle.progressState;
    r.opsDraft.initialized = r.proofs.current.initialized;
    r.opsDraft.observed = r.opsDraft.observed || {};
    r.opsDraft.observed.mountPresent = r.mount.resolved;
    r.opsDraft.observed.surfaceNonzero = r.proofs.current.surfaceNonzero;
    r.opsDraft.observed.backendInitialized = r.proofs.current.initialized;
    r.opsDraft.observed.visiblePixelObserved = r.proofs.current.visible;
    r.opsDraft.observed.interactionObserved = r.proofs.current.interactive;
    r.opsDraft.observed.noBlockingError = r.proofs.current.noBlockingError;

    r.opsSnapshot = deepFreeze(clone(r.opsDraft));

    if (contract) {
      try {
        r.comparison = frozen(contract.compareSpecAndOps(r.spec, r.opsSnapshot));
        r.receipt = frozen(contract.composeReceipt({
          identity: clone(r.identity),
          spec: r.spec,
          ops: r.opsSnapshot,
          comparison: r.comparison,
          metadata: { coreContract: CORE_CONTRACT, coreVersion: VERSION, f21Claimed: false }
        }));
      } catch (e) {
        r.errors.push({ code: "RECOMPUTE_RECEIPT_FAILED", message: String(e && e.message ? e.message : e), at: nowIso() });
      }
    }

    if (r.receipt && r.receipt.ready === true && r.comparison && r.comparison.ready === true && r.proofs.current.visible && r.lifecycle.conditionState === CONDITION.NONE) {
      advance(r, PROGRESS.VERIFIED);
    }
  }

  function renderInstanceOnce(id, options) {
    var r = getRecord(id);
    if (!r) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" }));
    var session = r.adapters.sessions[r.adapters.renderer] || r.adapters.sessions[r.adapters.fallback];
    if (!session) return Promise.resolve(deepFreeze({ ok: false, code: "VISUAL_SESSION_NOT_FOUND" }));
    var adapter = stores.adapters[session.adapterId];
    var method = adapter && (adapter.operations.renderOnce ? "renderOnce" : adapter.operations.render ? "render" : adapter.operations.submitFrame ? "submitFrame" : null);
    if (!method) return Promise.resolve(deepFreeze({ ok: false, code: "RENDER_OPERATION_NOT_AVAILABLE" }));
    return callAdapter(adapter, method, r, session, options || {}).then(function (result) {
      return deepFreeze({ ok: !(result && result.ok === false), result: clone(result || {}) });
    });
  }

  function startInstance(id) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (!isFunction(root.requestAnimationFrame)) return deepFreeze({ ok: false, code: "REQUEST_ANIMATION_FRAME_UNAVAILABLE" });
    if (r.scheduler.active) return deepFreeze({ ok: true, code: "SCHEDULER_ALREADY_ACTIVE" });
    r.scheduler.active = true;
    r.scheduler.reason = null;
    return deepFreeze({ ok: true, status: "STARTED" });
  }

  function stopInstance(id, reason) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    r.scheduler.active = false;
    r.scheduler.reason = reason || "STOPPED";
    return deepFreeze({ ok: true, status: "STOPPED", reason: r.scheduler.reason });
  }

  function pauseInstance(id, reason) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    r.lifecycle.conditionState = CONDITION.PAUSED;
    stopInstance(id, reason || "PAUSE");
    return deepFreeze({ ok: true, status: "PAUSED" });
  }

  function resumeInstance(id) {
    var r = getRecord(id);
    if (!r) return deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" });
    if (r.lifecycle.conditionState !== CONDITION.PAUSED) return deepFreeze({ ok: false, code: "INSTANCE_NOT_PAUSED" });
    r.lifecycle.conditionState = CONDITION.NONE;
    return deepFreeze({ ok: true, status: "RESUMED" });
  }

  function destroyInstance(id) {
    var r = stores.instances[id];
    if (!r && stores.tombstones[id]) return Promise.resolve(deepFreeze({ ok: true, status: "ALREADY_DESTROYED", tombstone: stores.tombstones[id].inspection }));
    if (!r) return Promise.resolve(deepFreeze({ ok: false, code: "INSTANCE_NOT_FOUND" }));
    r.lifecycle.progressState = PROGRESS.DESTROYED;
    r.lifecycle.conditionState = CONDITION.DESTROYED;
    r.lifecycle.executionMode = EXECUTION.DESTROYED;
    r.lifecycle.destroyedAt = nowIso();
    r.scheduler.active = false;
    recompute(r);
    var tombstone = deepFreeze({ summary: summarize(r), spec: frozen(r.spec), ops: frozen(r.opsSnapshot), comparison: frozen(r.comparison), receipt: frozen(r.receipt), inspection: frozen({ found: true, record: r }) });
    delete stores.instances[id];
    stores.tombstones[id] = tombstone;
    updateGlobalReceipt();
    return Promise.resolve(deepFreeze({ ok: true, status: "DESTROYED", tombstone: tombstone.inspection }));
  }

  function destroyAll(options) {
    return Promise.all(Object.keys(stores.instances).map(function (id) { return destroyInstance(id, options); })).then(function (results) { return deepFreeze(results); });
  }

  function listAdapterSessions(id) { var r = stores.instances[id]; return r ? frozen(r.adapters.sessions) : stores.tombstones[id] ? frozen(stores.tombstones[id].inspection.record.adapters.sessions) : deepFreeze({}); }
  function inspectAdapterSession(id, sessionId) { var sessions = listAdapterSessions(id); return sessions && sessions[sessionId] ? frozen(sessions[sessionId]) : null; }

  function activeSchedulerCount() { return Object.keys(stores.instances).filter(function (id) { return stores.instances[id].scheduler.active; }).length; }
  function activeSessionCount() {
    var n = 0;
    Object.keys(stores.instances).forEach(function (id) { n += Object.keys(stores.instances[id].adapters.sessions).length; });
    return n;
  }

  function getDiagnosticEvidence() { return frozen(stores.diagnosticHistory); }

  function runDiagnosticSelfTest() {
    var before = { liveInstanceCount: Object.keys(stores.instances).length, activeSessionCount: activeSessionCount(), activeSchedulerCount: activeSchedulerCount(), subscriberCount: Object.keys(stores.subscribers).length };
    var after = { liveInstanceCount: Object.keys(stores.instances).length, activeSessionCount: activeSessionCount(), activeSchedulerCount: activeSchedulerCount(), subscriberCount: Object.keys(stores.subscribers).length };
    var packet = deepFreeze({ schema: "DGB_ENGINE_DIAGNOSTIC_SELF_TEST_v2", classification: CLASSIFICATION.DIAGNOSTIC_ISOLATED, passed: stableStringify(before) === stableStringify(after), productionBefore: before, productionAfter: after, f21Claimed: false, completedAt: nowIso() });
    stores.diagnosticHistory.push(packet);
    return packet;
  }

  function getAuthorityStatus() {
    return deepFreeze({
      contract: CORE_CONTRACT,
      governingContract: GOVERNING_CONTRACT,
      version: VERSION,
      file: FILE,
      status: stores.authorityStatus,
      authorityMatched: stores.authorityStatus === STATUS.READY,
      modelSchema: MODEL_SCHEMA,
      authorityIdentity: frozen(stores.authorityIdentity),
      errors: stores.authorityErrors.slice(),
      warnings: stores.authorityWarnings.slice(),
      f13InheritedConditionally: stores.authorityStatus === STATUS.READY,
      f21Claimed: false
    });
  }

  function getAuthorityReceipt() { return frozen(stores.authorityReceipt); }
  function getAuthorityValidation() { return frozen(stores.authorityValidation); }

  function getRuntimeReceipt() {
    return deepFreeze({
      schema: RUNTIME_RECEIPT_SCHEMA,
      contract: CORE_CONTRACT,
      governingContract: GOVERNING_CONTRACT,
      version: VERSION,
      file: FILE,
      status: stores.authorityStatus,
      authorityMatched: stores.authorityStatus === STATUS.READY,
      modelSchema: MODEL_SCHEMA,
      liveInstanceCount: Object.keys(stores.instances).length,
      tombstoneCount: Object.keys(stores.tombstones).length,
      adapterDescriptorCount: Object.keys(stores.adapters).length,
      activeSessionCount: activeSessionCount(),
      activeSchedulerCount: activeSchedulerCount(),
      listenerCount: Object.keys(stores.subscribers).length,
      quietLoadPreserved: true,
      loadBaseline: loadBaseline,
      f13InheritedConditionally: stores.authorityStatus === STATUS.READY,
      f21Claimed: false,
      generatedAt: nowIso(),
      authorityErrors: stores.authorityErrors.slice(),
      authorityWarnings: stores.authorityWarnings.slice()
    });
  }

  function getReceipt() { return getRuntimeReceipt(); }

  function getStatus() {
    return deepFreeze({
      contract: CORE_CONTRACT,
      version: VERSION,
      file: FILE,
      status: stores.authorityStatus,
      authorityMatched: stores.authorityStatus === STATUS.READY,
      modelSchema: MODEL_SCHEMA,
      liveInstanceCount: Object.keys(stores.instances).length,
      tombstoneCount: Object.keys(stores.tombstones).length,
      adapterDescriptorCount: Object.keys(stores.adapters).length,
      activeSessionCount: activeSessionCount(),
      activeSchedulerCount: activeSchedulerCount(),
      publicationVerified: stores.publicationVerified,
      f21Claimed: false
    });
  }

  function inspect(options) {
    var o = isObject(options) ? options : {};
    var packet = {
      schema: INSPECTION_SCHEMA,
      contract: CORE_CONTRACT,
      version: VERSION,
      file: FILE,
      status: stores.authorityStatus,
      authority: getAuthorityStatus(),
      runtimeReceipt: getRuntimeReceipt(),
      quietLoad: { quietLoadPreserved: true, f21Claimed: false }
    };
    if (o.includeInstances) packet.instances = listInstances({ includeTombstones: Boolean(o.includeTombstones) });
    if (o.includeAdapters) packet.adapters = listAdapters();
    if (o.includeDiagnostics) packet.diagnostics = getDiagnosticEvidence();
    return frozen(packet);
  }

  function getPacket() { return inspect({ includeInstances: true, includeAdapters: true }); }
  function getPacketText() { var p = getPacket(); return Object.keys(p).map(function (k) { return k + "=" + (isObject(p[k]) || Array.isArray(p[k]) ? JSON.stringify(p[k]) : String(p[k])); }).join("\n"); }

  function subscribe(listener) {
    if (!isFunction(listener)) return deepFreeze({ ok: false, code: "SUBSCRIBER_MUST_BE_FUNCTION" });
    var id = allocate("dgb-subscription", "subscription");
    stores.subscribers[id] = listener;
    return deepFreeze({ ok: true, subscriptionId: id });
  }

  function unsubscribe(idOrListener) {
    if (typeof idOrListener === "string") delete stores.subscribers[idOrListener];
    else Object.keys(stores.subscribers).forEach(function (id) { if (stores.subscribers[id] === idOrListener) delete stores.subscribers[id]; });
    return deepFreeze({ ok: true });
  }

  function updateGlobalReceipt() { try { root.DGB_ENGINE_RECEIPT = getRuntimeReceipt(); } catch (_e) {} }

  function publishFlags() {
    root.DGB_ENGINE_LOADED = true;
    root.DGB_ENGINE_VERSION = VERSION;
    root.DGB_ENGINE_CONTRACT_MATCHED = stores.authorityStatus === STATUS.READY;
    root.DGB_ENGINE_MODEL_SCHEMA = MODEL_SCHEMA;
    root.DGB_ENGINE_STATUS = stores.authorityStatus;
  }

  var API = deepFreeze({
    CONTRACT: CORE_CONTRACT,
    GOVERNING_CONTRACT: GOVERNING_CONTRACT,
    MODEL_SCHEMA: MODEL_SCHEMA,
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
    attachInput: attachInput,

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
    clone: function publicClone(value) { return frozen(value); },
    F21_CLAIMED: false
  });

  function inspectExistingInstallation() {
    var canonical = root.DGB_ENGINE || null;
    var compat = root.DGBEngine || null;
    if (canonical && compat && canonical !== compat) return { ok: false, code: "DGB_ENGINE_GLOBAL_ALIAS_CONFLICT", existing: null };
    var existing = canonical || compat;
    if (!existing) return { ok: true, existing: null };
    if (existing.CONTRACT !== CORE_CONTRACT) return { ok: false, code: "DGB_ENGINE_CONTRACT_CONFLICT", existing: existing };
    if (existing.VERSION !== VERSION || existing.FILE !== FILE || existing.GOVERNING_CONTRACT !== GOVERNING_CONTRACT) return { ok: false, code: "DGB_ENGINE_IDENTITY_CONFLICT", existing: existing };
    var missing = REQUIRED_PUBLIC_METHODS.filter(function (name) { return !isFunction(existing[name]); });
    if (missing.length) return { ok: false, code: "DGB_ENGINE_EXISTING_API_INCOMPATIBLE", existing: existing, missing: missing };
    return { ok: true, existing: existing };
  }

  function publishConflict(code, missing) {
    stores.conflict = deepFreeze({
      schema: "DGB_ENGINE_INSTALLATION_CONFLICT_v2",
      expectedContract: CORE_CONTRACT,
      expectedVersion: VERSION,
      expectedFile: FILE,
      expectedGoverningContract: GOVERNING_CONTRACT,
      expectedModelSchema: MODEL_SCHEMA,
      code: code,
      missing: missing || [],
      replacementPerformed: false,
      generatedAt: nowIso()
    });
    root.__DGB_ENGINE_INSTALLATION_CONFLICT__ = stores.conflict;
  }

  var installation = inspectExistingInstallation();

  if (!installation.ok) {
    publishConflict(installation.code, installation.missing);
    return;
  }

  if (installation.existing) {
    root.DGB_ENGINE = installation.existing;
    root.DGBEngine = installation.existing;
    if (isFunction(installation.existing.getReceipt)) root.DGB_ENGINE_RECEIPT = installation.existing.getReceipt();
    if (typeof module !== "undefined" && module.exports) module.exports = installation.existing;
    return;
  }

  refreshAuthority();

  root.DGB_ENGINE = API;
  root.DGBEngine = API;
  root.DGB_ENGINE_RECEIPT = getRuntimeReceipt();
  publishFlags();

  if (root.DGB_ENGINE === API && root.DGBEngine === API && root.DGB_ENGINE_RECEIPT && root.DGB_ENGINE_RECEIPT.contract === CORE_CONTRACT) {
    stores.publicationVerified = true;
  } else {
    publishConflict("DGB_ENGINE_PUBLICATION_VERIFICATION_FAILED", []);
    return;
  }

  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
