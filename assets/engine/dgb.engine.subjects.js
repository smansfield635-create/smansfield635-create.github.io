// /assets/engine/dgb.engine.subjects.js
// DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2
// Full-file replacement.
// Identity-preserving production renewal.

(function installDGBEngineSubjectRegistry(global) {
  "use strict";

  var root =
    global ||
    (typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
        ? globalThis
        : this);

  var CONTRACT =
    "DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2";

  var VERSION = "2.0.0";
  var FILE = "/assets/engine/dgb.engine.subjects.js";

  var REGISTRY_SCHEMA = "DGB_ENGINE_AND_AUTHORITY_REGISTRY_v2";
  var AUTHORITY_SCHEMA = "DGB_ENGINE_AUTHORITY_RECORD_v1";
  var ENGINE_SCHEMA = "DGB_ENGINE_SUBJECT_RECORD_v2";
  var RECEIPT_SCHEMA = "DGB_ENGINE_REGISTRY_RECEIPT_v2";
  var OBSERVATION_SCHEMA = "DGB_ENGINE_OBSERVATION_PACKET_v1";

  var GOVERNING_CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  var CORE_CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  var MODEL_SCHEMA = "DGB_MODEL_PACKAGE_v1";
  var CONTRACT_FILE = "/assets/engine/dgb.engine.contract.js";
  var CORE_FILE = "/assets/engine/dgb.engine.js";
  var SLOT_COUNT = 6;

  var DEFAULT_ENGINE_ID =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE";

  var AUTHORITY_ID =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_GOVERNING_CONTRACT";

  var STATUS = Object.freeze({
    AVAILABLE: "AVAILABLE",
    HELD: "HELD",
    ERROR: "ERROR",
    CONFLICT: "CONFLICT",
    RESERVED: "RESERVED",
    UNAVAILABLE: "UNAVAILABLE",
    UNKNOWN: "UNKNOWN"
  });

  var ROLE = Object.freeze({
    GOVERNING_CONTRACT: "GOVERNING_CONTRACT",
    RUNTIME_ENGINE: "RUNTIME_ENGINE",
    RESERVED_ENGINE_SLOT: "RESERVED_ENGINE_SLOT"
  });

  var observerBindings = Object.create(null);

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clonePlain(value, seen) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "bigint") return String(value);
    if (typeof value === "symbol") return String(value);
    if (typeof value === "function") {
      return { type: "Function", name: value.name || "anonymous" };
    }

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return "[Circular]";
    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function map(entry) {
        return clonePlain(entry, memory.slice());
      });
    }

    var output = {};
    Object.keys(value).forEach(function each(key) {
      try {
        output[key] = clonePlain(value[key], memory.slice());
      } catch (_error) {
        output[key] = null;
      }
    });

    return output;
  }

  function deepFreeze(value, seen) {
    if (!value || (typeof value !== "object" && typeof value !== "function")) {
      return value;
    }

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);

    try {
      Object.getOwnPropertyNames(value).forEach(function freezeKey(key) {
        try {
          deepFreeze(value[key], memory);
        } catch (_error) {}
      });
      Object.freeze(value);
    } catch (_error2) {}

    return value;
  }

  function frozenClone(value) {
    return deepFreeze(clonePlain(value));
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

      if (typeof item === "bigint") return String(item);
      if (typeof item === "symbol") return String(item);
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
    var result = 0x811c9dc5;

    for (var index = 0; index < text.length; index += 1) {
      result ^= text.charCodeAt(index);
      result = Math.imul(result, 0x01000193) >>> 0;
    }

    return "fnv1a32-" + ("00000000" + result.toString(16)).slice(-8);
  }

  function discoverContractGlobal() {
    var canonical = root.DGB_ENGINE_CONTRACT || null;
    var compatibility = root.DGBEngineContract || null;

    if (canonical && compatibility && canonical !== compatibility) {
      return { object: null, status: STATUS.CONFLICT, code: "CONTRACT_GLOBAL_CONFLICT" };
    }

    var authority = canonical || compatibility || null;

    if (!authority) {
      return { object: null, status: STATUS.HELD, code: "CONTRACT_NOT_LOADED" };
    }

    if (authority.contract !== GOVERNING_CONTRACT) {
      return { object: authority, status: STATUS.CONFLICT, code: "CONTRACT_IDENTITY_MISMATCH" };
    }

    return { object: authority, status: STATUS.AVAILABLE, code: "CONTRACT_DISCOVERED" };
  }

  function discoverEngineGlobal() {
    var canonical = root.DGB_ENGINE || null;
    var compatibility = root.DGBEngine || null;

    if (canonical && compatibility && canonical !== compatibility) {
      return { object: null, status: STATUS.CONFLICT, code: "ENGINE_GLOBAL_CONFLICT" };
    }

    var engine = canonical || compatibility || null;

    if (!engine) {
      return { object: null, status: STATUS.HELD, code: "ENGINE_NOT_LOADED" };
    }

    if (engine.CONTRACT !== CORE_CONTRACT) {
      return { object: engine, status: STATUS.CONFLICT, code: "ENGINE_IDENTITY_MISMATCH" };
    }

    return { object: engine, status: STATUS.AVAILABLE, code: "ENGINE_DISCOVERED" };
  }

  function safeCall(target, methodName, fallback) {
    if (!target || !isFunction(target[methodName])) return fallback || null;
    try {
      return frozenClone(target[methodName]());
    } catch (_error) {
      return fallback || null;
    }
  }

  function buildAuthorityRecord() {
    var discovery = discoverContractGlobal();
    var authority = discovery.object;

    var authorityReceipt = safeCall(authority, "getAuthorityReceipt", null);
    var authorityValidation = safeCall(authority, "getAuthorityValidation", null);

    var identityMatched = Boolean(authority && authority.contract === GOVERNING_CONTRACT);

    var validationPassed = Boolean(
      authorityValidation &&
      authorityValidation.passed === true &&
      Number(authorityValidation.failCount || 0) === 0
    );

    var authorityReady = Boolean(
      authorityReceipt &&
      authorityReceipt.ready === true &&
      authorityReceipt.status === "READY"
    );

    var status = discovery.status;
    var statusReason = discovery.code;

    if (status === STATUS.AVAILABLE && (!validationPassed || !authorityReady)) {
      status = STATUS.HELD;
      statusReason = "CONTRACT_AUTHORITY_NOT_READY";
    }

    return deepFreeze({
      schema: AUTHORITY_SCHEMA,
      authorityId: AUTHORITY_ID,
      authorityName: "DGB Interactive Runtime Engine Contract",
      role: ROLE.GOVERNING_CONTRACT,
      executableEngine: false,
      file: CONTRACT_FILE,
      contract: GOVERNING_CONTRACT,
      version:
        authorityReceipt && authorityReceipt.version
          ? authorityReceipt.version
          : authority && authority.version
            ? authority.version
            : null,
      modelSchema: MODEL_SCHEMA,
      globals: [
        "DGB_ENGINE_CONTRACT",
        "DGBEngineContract",
        "DGB_ENGINE_CONTRACT_RECEIPT"
      ],
      loaded: Boolean(authority),
      identityMatched: identityMatched,
      validationPassed: validationPassed,
      authorityReady: authorityReady,
      status: status,
      statusReason: statusReason,
      governsEngineIds: [DEFAULT_ENGINE_ID],
      receipt: authorityReceipt,
      validation: authorityValidation,
      boundaries: {
        createsRuntimeInstances: false,
        executesRendering: false,
        executesInput: false,
        executesFallback: false,
        ownsModelValidation: true,
        ownsSpecConstruction: true,
        ownsDeclaredOpsConstruction: true,
        ownsSpecOpsComparison: true,
        ownsGoverningInstanceReceipts: true
      }
    });
  }

  function buildPrimaryEngineRecord(authorityRecord) {
    var discovery = discoverEngineGlobal();
    var engine = discovery.object;

    var engineStatus = safeCall(engine, "getStatus", null);
    var runtimeReceipt =
      safeCall(engine, "getRuntimeReceipt", null) ||
      safeCall(engine, "getReceipt", null);

    var inspection = null;

    if (engine && isFunction(engine.inspect)) {
      try {
        inspection = frozenClone(
          engine.inspect({
            includeInstances: true,
            includeTombstones: false,
            includeAdapters: true,
            includeDiagnostics: false
          })
        );
      } catch (_error) {
        inspection = null;
      }
    }

    var identityMatched = Boolean(engine && engine.CONTRACT === CORE_CONTRACT);

    var governingContractMatched = Boolean(
      engineStatus && engineStatus.authorityMatched === true
    );

    var status = discovery.status;
    var statusReason = discovery.code;

    if (status === STATUS.AVAILABLE && !governingContractMatched) {
      status = STATUS.HELD;
      statusReason = "ENGINE_WAITING_FOR_GOVERNING_AUTHORITY";
    }

    if (
      discovery.status === STATUS.AVAILABLE &&
      governingContractMatched &&
      authorityRecord.authorityReady
    ) {
      status = STATUS.AVAILABLE;
      statusReason = "ENGINE_AND_AUTHORITY_AVAILABLE";
    }

    return deepFreeze({
      schema: ENGINE_SCHEMA,
      slot: 1,
      engineId: DEFAULT_ENGINE_ID,
      engineName: "DGB Interactive Runtime Engine Core",
      role: ROLE.RUNTIME_ENGINE,
      reserved: false,
      reservedEvidenceReadable: true,
      reservedEvidencePresent: true,
      selectable: Boolean(engine && identityMatched && governingContractMatched),
      defaultEngine: true,
      file: CORE_FILE,
      contract: CORE_CONTRACT,
      version: engine && engine.VERSION ? engine.VERSION : null,
      globalNames: ["DGB_ENGINE", "DGBEngine", "DGB_ENGINE_RECEIPT"],
      governingAuthorityId: authorityRecord.authorityId,
      governingContract: GOVERNING_CONTRACT,
      governingContractFile: CONTRACT_FILE,
      modelSchema: MODEL_SCHEMA,
      loaded: Boolean(engine),
      identityMatched: identityMatched,
      governingContractMatched: governingContractMatched,
      quietLoadExpected: true,
      f13InheritedConditionally: Boolean(
        runtimeReceipt && runtimeReceipt.f13InheritedConditionally === true
      ),
      f21Claimed: Boolean(runtimeReceipt && runtimeReceipt.f21Claimed === true),
      status: status,
      statusReason: statusReason,
      runtimeStatus: engineStatus,
      runtimeReceipt: runtimeReceipt,
      inspection: inspection,
      observer: {
        requiredSchema: OBSERVATION_SCHEMA,
        attached: Boolean(observerBindings[DEFAULT_ENGINE_ID]),
        status: observerBindings[DEFAULT_ENGINE_ID] ? STATUS.AVAILABLE : STATUS.HELD,
        statusReason: observerBindings[DEFAULT_ENGINE_ID]
          ? "OBSERVER_ATTACHED"
          : "OBSERVER_NOT_ATTACHED"
      },
      capabilities: {
        modelAdmission: Boolean(
          engine &&
          isFunction(engine.validateModelPackage) &&
          isFunction(engine.createInstance)
        ),
        instanceInspection: Boolean(
          engine &&
          isFunction(engine.listInstances) &&
          isFunction(engine.inspectInstance)
        ),
        opsInspection: Boolean(engine && isFunction(engine.getOps)),
        receiptInspection: Boolean(
          engine &&
          isFunction(engine.getInstanceReceipt) &&
          (isFunction(engine.getRuntimeReceipt) || isFunction(engine.getReceipt))
        ),
        adapterRegistration: Boolean(engine && isFunction(engine.registerAdapter)),
        observerSafeInspection: Boolean(engine && isFunction(engine.inspect))
      },
      boundaries: {
        registryCreatesInstances: false,
        registryStartsSchedulers: false,
        registryRegistersAdapters: false,
        registryMutatesEngine: false,
        registryClaimsReadiness: false,
        registryClaimsF21: false
      }
    });
  }

  function buildReservedEngineRecord(slot) {
    return deepFreeze({
      schema: ENGINE_SCHEMA,
      slot: slot,
      engineId: "DGB_ENGINE_RESERVED_SLOT_" + String(slot).padStart(2, "0"),
      engineName: null,
      role: ROLE.RESERVED_ENGINE_SLOT,
      reserved: true,
      reservedEvidenceReadable: true,
      reservedEvidencePresent: true,
      selectable: false,
      defaultEngine: false,
      file: null,
      contract: null,
      version: null,
      globalNames: [],
      governingAuthorityId: null,
      governingContract: null,
      governingContractFile: null,
      modelSchema: null,
      loaded: false,
      identityMatched: false,
      governingContractMatched: false,
      quietLoadExpected: true,
      f13InheritedConditionally: false,
      f21Claimed: false,
      status: STATUS.RESERVED,
      statusReason: "RESERVED_SLOT_NO_ENGINE_AUTHORITY_SUPPLIED",
      runtimeStatus: null,
      runtimeReceipt: null,
      inspection: null,
      observer: {
        requiredSchema: OBSERVATION_SCHEMA,
        attached: false,
        status: STATUS.UNAVAILABLE,
        statusReason: "NO_ENGINE_ASSIGNED"
      },
      capabilities: {},
      boundaries: {
        registryCreatesInstances: false,
        registryStartsSchedulers: false,
        registryRegistersAdapters: false,
        registryMutatesEngine: false,
        registryClaimsReadiness: false,
        registryClaimsF21: false
      }
    });
  }

  function buildSnapshot() {
    var authority = buildAuthorityRecord();

    var engines = [
      buildPrimaryEngineRecord(authority),
      buildReservedEngineRecord(2),
      buildReservedEngineRecord(3),
      buildReservedEngineRecord(4),
      buildReservedEngineRecord(5),
      buildReservedEngineRecord(6)
    ];

    var assignedEngines = engines.filter(function filter(engine) {
      return engine.reserved === false;
    });

    var selectableEngines = engines.filter(function filter(engine) {
      return engine.selectable === true;
    });

    var reservedEngines = engines.filter(function filter(engine) {
      return engine.reserved === true;
    });

    var core = {
      schema: REGISTRY_SCHEMA,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      generatedAt: nowIso(),
      slotCount: SLOT_COUNT,
      defaultEngineId: DEFAULT_ENGINE_ID,
      authorityCount: 1,
      assignedEngineCount: assignedEngines.length,
      selectableEngineCount: selectableEngines.length,
      reservedEngineCount: reservedEngines.length,
      authorities: [authority],
      engines: engines,
      relationships: [
        {
          schema: "DGB_ENGINE_AUTHORITY_RELATIONSHIP_v1",
          governingAuthorityId: authority.authorityId,
          governedEngineId: DEFAULT_ENGINE_ID,
          authorityIsEngine: false,
          engineIsAuthority: false
        }
      ],
      relationship: {
        governingAuthorityId: authority.authorityId,
        governedEngineId: DEFAULT_ENGINE_ID,
        authorityIsEngine: false,
        engineIsAuthority: false
      },
      boundaries: {
        metadataOnly: true,
        quietLoad: true,
        createsInstances: false,
        registersAdapters: false,
        attachesObserversAutomatically: false,
        startsSchedulers: false,
        mutatesRuntime: false,
        claimsReadiness: false,
        claimsF21: false
      }
    };

    core.registryHash = hash(core);
    return deepFreeze(core);
  }

  var currentSnapshot = buildSnapshot();

  function getSnapshot() {
    return frozenClone(currentSnapshot);
  }

  function refresh() {
    currentSnapshot = buildSnapshot();

    try {
      root.DGB_ENGINE_SUBJECT_REGISTRY_RECEIPT = getRegistryReceipt();
      root.__DGB_ENGINE_SUBJECT_REGISTRY_STATUS__ =
        currentSnapshot.selectableEngineCount > 0 ? STATUS.AVAILABLE : STATUS.HELD;
    } catch (_error) {}

    return getSnapshot();
  }

  function listAuthorities() {
    return frozenClone(currentSnapshot.authorities);
  }

  function getAuthority(authorityId) {
    var normalized = String(authorityId || "").trim();

    var authority = currentSnapshot.authorities.find(function find(record) {
      return record.authorityId === normalized;
    });

    return authority ? frozenClone(authority) : null;
  }

  function listEngines(options) {
    var settings = isObject(options) ? options : {};
    var includeReserved = settings.includeReserved !== false;
    var selectableOnly = settings.selectableOnly === true;

    return frozenClone(
      currentSnapshot.engines.filter(function filter(engine) {
        if (!includeReserved && engine.reserved) return false;
        if (selectableOnly && !engine.selectable) return false;
        return true;
      })
    );
  }

  function getEngine(engineId) {
    var normalized = String(engineId || "").trim();

    var engine = currentSnapshot.engines.find(function find(record) {
      return record.engineId === normalized;
    });

    return engine ? frozenClone(engine) : null;
  }

  function getEngineBySlot(slot) {
    var numericSlot = Number(slot);

    if (!Number.isInteger(numericSlot)) return null;

    var engine = currentSnapshot.engines.find(function find(record) {
      return record.slot === numericSlot;
    });

    return engine ? frozenClone(engine) : null;
  }

  function getDefaultEngine() {
    return getEngine(DEFAULT_ENGINE_ID);
  }

  function getSelectableEngines() {
    return listEngines({
      includeReserved: false,
      selectableOnly: true
    });
  }

  function getReservedSlots() {
    return frozenClone(
      currentSnapshot.engines.filter(function filter(engine) {
        return engine.reserved === true;
      })
    );
  }

  function normalizeObserver(observer) {
    if (isFunction(observer)) return { observe: observer };

    if (!isObject(observer)) return null;

    if (
      !isFunction(observer.observe) &&
      !isFunction(observer.getObservationPacket)
    ) {
      return null;
    }

    return observer;
  }

  function attachObserver(engineId, observer) {
    var engine = getEngine(engineId);
    var normalized = normalizeObserver(observer);

    if (!engine) {
      return deepFreeze({
        ok: false,
        code: "ENGINE_NOT_REGISTERED",
        engineId: engineId || null
      });
    }

    if (!engine.selectable) {
      return deepFreeze({
        ok: false,
        code: "ENGINE_NOT_SELECTABLE",
        engineId: engine.engineId,
        status: engine.status
      });
    }

    if (!normalized) {
      return deepFreeze({
        ok: false,
        code: "OBSERVER_INTERFACE_INVALID",
        engineId: engine.engineId
      });
    }

    observerBindings[engine.engineId] = normalized;
    refresh();

    return deepFreeze({
      ok: true,
      code: "OBSERVER_ATTACHED",
      engineId: engine.engineId,
      observationSchema: OBSERVATION_SCHEMA
    });
  }

  function detachObserver(engineId) {
    var engine = getEngine(engineId);

    if (!engine) {
      return deepFreeze({
        ok: false,
        code: "ENGINE_NOT_REGISTERED",
        engineId: engineId || null
      });
    }

    delete observerBindings[engine.engineId];
    refresh();

    return deepFreeze({
      ok: true,
      code: "OBSERVER_DETACHED",
      engineId: engine.engineId
    });
  }

  function hasObserver(engineId) {
    return Boolean(observerBindings[String(engineId || "").trim()]);
  }

  function requestObservation(engineId, request) {
    var engine = getEngine(engineId);

    if (!engine) {
      return Promise.resolve(
        deepFreeze({
          ok: false,
          status: STATUS.HELD,
          code: "ENGINE_NOT_REGISTERED",
          engineId: engineId || null
        })
      );
    }

    if (!engine.selectable) {
      return Promise.resolve(
        deepFreeze({
          ok: false,
          status: STATUS.HELD,
          code: "ENGINE_NOT_SELECTABLE",
          engineId: engine.engineId
        })
      );
    }

    var observer = observerBindings[engine.engineId];

    if (!observer) {
      return Promise.resolve(
        deepFreeze({
          ok: false,
          status: STATUS.HELD,
          code: "OBSERVER_NOT_ATTACHED",
          engineId: engine.engineId,
          requiredSchema: OBSERVATION_SCHEMA
        })
      );
    }

    var observe = isFunction(observer.observe)
      ? observer.observe
      : observer.getObservationPacket;

    try {
      return Promise.resolve(
        observe.call(
          observer,
          frozenClone(request || {}),
          getEngine(engine.engineId),
          getAuthority(engine.governingAuthorityId)
        )
      ).then(function observationReceived(packet) {
        if (!isObject(packet)) {
          return deepFreeze({
            ok: false,
            status: STATUS.ERROR,
            code: "OBSERVATION_PACKET_INVALID",
            engineId: engine.engineId
          });
        }

        if (packet.schema && packet.schema !== OBSERVATION_SCHEMA) {
          return deepFreeze({
            ok: false,
            status: STATUS.CONFLICT,
            code: "OBSERVATION_SCHEMA_CONFLICT",
            engineId: engine.engineId,
            expectedSchema: OBSERVATION_SCHEMA,
            receivedSchema: packet.schema
          });
        }

        return deepFreeze({
          ok: true,
          status: STATUS.AVAILABLE,
          code: "OBSERVATION_PACKET_RECEIVED",
          engineId: engine.engineId,
          packet: frozenClone(packet)
        });
      }).catch(function observationRejected(error) {
        return deepFreeze({
          ok: false,
          status: STATUS.ERROR,
          code: "OBSERVER_PROMISE_REJECTED",
          engineId: engine.engineId,
          detail: String(error && error.message ? error.message : error)
        });
      });
    } catch (error) {
      return Promise.resolve(
        deepFreeze({
          ok: false,
          status: STATUS.ERROR,
          code: "OBSERVER_THROW",
          engineId: engine.engineId,
          detail: String(error && error.message ? error.message : error)
        })
      );
    }
  }

  function getRegistryReceipt() {
    var authority = currentSnapshot.authorities[0];
    var engine = currentSnapshot.engines[0];

    return deepFreeze({
      schema: RECEIPT_SCHEMA,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      generatedAt: nowIso(),
      registryHash: currentSnapshot.registryHash,
      slotCount: SLOT_COUNT,
      authorityCount: currentSnapshot.authorityCount,
      engineCount: currentSnapshot.assignedEngineCount,
      assignedEngineCount: currentSnapshot.assignedEngineCount,
      selectableEngineCount: currentSnapshot.selectableEngineCount,
      reservedEngineCount: currentSnapshot.reservedEngineCount,
      defaultEngineId: DEFAULT_ENGINE_ID,
      relationships: frozenClone(currentSnapshot.relationships),
      governingContract: {
        authorityId: authority.authorityId,
        loaded: authority.loaded,
        identityMatched: authority.identityMatched,
        validationPassed: authority.validationPassed,
        authorityReady: authority.authorityReady,
        status: authority.status
      },
      coreEngine: {
        engineId: engine.engineId,
        loaded: engine.loaded,
        identityMatched: engine.identityMatched,
        governingContractMatched: engine.governingContractMatched,
        selectable: engine.selectable,
        status: engine.status,
        f13InheritedConditionally: engine.f13InheritedConditionally,
        f21Claimed: engine.f21Claimed
      },
      quietLoad: {
        registryCreatedInstances: false,
        registryRegisteredAdapters: false,
        registryStartedSchedulers: false,
        registryAttachedObservers: Object.keys(observerBindings).length > 0
      },
      boundaries: currentSnapshot.boundaries
    });
  }

  function getStatus() {
    return deepFreeze({
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      schema: REGISTRY_SCHEMA,
      loaded: true,
      slotCount: SLOT_COUNT,
      authorityCount: currentSnapshot.authorityCount,
      assignedEngineCount: currentSnapshot.assignedEngineCount,
      selectableEngineCount: currentSnapshot.selectableEngineCount,
      reservedEngineCount: currentSnapshot.reservedEngineCount,
      status: currentSnapshot.selectableEngineCount > 0 ? STATUS.AVAILABLE : STATUS.HELD,
      quietLoad: true,
      registryCreatesInstances: false,
      registryRegistersAdapters: false,
      registryStartsSchedulers: false,
      registryClaimsReadiness: false,
      registryClaimsF21: false
    });
  }

  var API = deepFreeze({
    CONTRACT: CONTRACT,
    VERSION: VERSION,
    FILE: FILE,
    SCHEMA: REGISTRY_SCHEMA,
    AUTHORITY_SCHEMA: AUTHORITY_SCHEMA,
    ENGINE_SCHEMA: ENGINE_SCHEMA,
    RECEIPT_SCHEMA: RECEIPT_SCHEMA,
    OBSERVATION_SCHEMA: OBSERVATION_SCHEMA,
    SLOT_COUNT: SLOT_COUNT,
    DEFAULT_ENGINE_ID: DEFAULT_ENGINE_ID,
    STATUS: STATUS,
    ROLE: ROLE,

    refresh: refresh,
    getSnapshot: getSnapshot,
    getRegistryReceipt: getRegistryReceipt,
    getStatus: getStatus,

    listAuthorities: listAuthorities,
    getAuthority: getAuthority,

    listEngines: listEngines,
    getEngine: getEngine,
    getEngineBySlot: getEngineBySlot,
    getDefaultEngine: getDefaultEngine,
    getSelectableEngines: getSelectableEngines,
    getReservedSlots: getReservedSlots,

    attachObserver: attachObserver,
    detachObserver: detachObserver,
    hasObserver: hasObserver,
    requestObservation: requestObservation
  });

  var existing = root.DGB_ENGINE_SUBJECT_REGISTRY;

  if (existing && existing.CONTRACT && existing.CONTRACT !== CONTRACT) {
    root.__DGB_ENGINE_SUBJECT_REGISTRY_CONFLICT__ =
      deepFreeze({
        schema: "DGB_ENGINE_SUBJECT_REGISTRY_INSTALLATION_CONFLICT_v1",
        expectedContract: CONTRACT,
        existingContract: existing.CONTRACT,
        file: FILE,
        replacementPerformed: false,
        generatedAt: nowIso()
      });

    return;
  }

  if (existing && existing.CONTRACT === CONTRACT) {
    root.DGBEngineSubjectRegistry = existing;

    if (typeof module !== "undefined" && module.exports) {
      module.exports = existing;
    }

    return;
  }

  root.DGB_ENGINE_SUBJECT_REGISTRY = API;
  root.DGBEngineSubjectRegistry = API;
  root.DGB_ENGINE_SUBJECT_REGISTRY_RECEIPT = getRegistryReceipt();

  root.__DGB_ENGINE_SUBJECT_REGISTRY_LOADED__ = true;
  root.__DGB_ENGINE_SUBJECT_REGISTRY_VERSION__ = VERSION;
  root.__DGB_ENGINE_SUBJECT_REGISTRY_STATUS__ =
    currentSnapshot.selectableEngineCount > 0 ? STATUS.AVAILABLE : STATUS.HELD;

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
