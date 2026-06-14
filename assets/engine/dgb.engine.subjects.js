// /assets/engine/dgb.engine.subjects.js
// DGB_ENGINE_SUBJECT_REGISTRY_SIX_ENGINE_CANONICAL_TNT_v1
// Full-file replacement.
// Shared engine-subject registry.
//
// Purpose:
// - Provide one canonical registry for six engine subjects.
// - Register the existing DGB Interactive Runtime Engine as confirmed compliant.
// - Reserve five engine positions without inventing names, contracts, or implementations.
// - Provide a stable selection and observer-binding interface for diagnostics.
// - Keep registry metadata separate from engine execution.
//
// Owns:
// - engine subject identity
// - engine slot assignment
// - contract and implementation references
// - compliance classification
// - diagnostic observer requirements
// - runtime-only observer bindings
// - default engine selection
//
// Does not own:
// - engine implementation
// - engine-contract implementation
// - engine loading
// - observer implementation
// - diagnostic execution
// - compliance testing
// - production mutation
// - runtime restart
// - renderer release
// - readiness or visual-pass claims
//
// Confirmed engine:
// - Contract:
//   DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// - Contract file:
//   /assets/engine/dgb.engine.contract.js
// - Implementation file:
//   /assets/engine/dgb.engine.js
//
// Important:
// - CONFIRMED_COMPLIANT describes the accepted contract-compliance state.
// - It does not claim that a live diagnostic observer adapter is already attached.
// - Reserved slots remain non-executable until exact engine authority is supplied.

(function dgbEngineSubjectRegistry(global) {
  "use strict";

  var root =
    global ||
    (typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
        ? globalThis
        : this);

  var CONTRACT =
    "DGB_ENGINE_SUBJECT_REGISTRY_SIX_ENGINE_CANONICAL_TNT_v1";

  var VERSION = "1.0.0";

  var FILE = "/assets/engine/dgb.engine.subjects.js";

  var SCHEMA = "DGB_ENGINE_SUBJECT_REGISTRY_v1";

  var SUBJECT_SCHEMA = "DGB_ENGINE_SUBJECT_v1";

  var OBSERVATION_SCHEMA = "DGB_ENGINE_OBSERVATION_PACKET_v1";

  var SLOT_COUNT = 6;

  var DEFAULT_ENGINE_ID = "DGB_INTERACTIVE_RUNTIME_ENGINE";

  var STATUS = Object.freeze({
    CONFIRMED: "CONFIRMED",
    RESERVED: "RESERVED",
    PROSPECTIVE: "PROSPECTIVE",
    BLOCKED: "BLOCKED",
    RETIRED: "RETIRED"
  });

  var COMPLIANCE_STATUS = Object.freeze({
    CONFIRMED_COMPLIANT: "CONFIRMED_COMPLIANT",
    PENDING_REVIEW: "PENDING_REVIEW",
    UNASSESSED: "UNASSESSED",
    NONCOMPLIANT: "NONCOMPLIANT",
    NOT_APPLICABLE: "NOT_APPLICABLE"
  });

  var OBSERVER_STATUS = Object.freeze({
    AVAILABLE: "AVAILABLE",
    ADAPTER_REQUIRED: "ADAPTER_REQUIRED",
    NOT_DECLARED: "NOT_DECLARED",
    UNAVAILABLE: "UNAVAILABLE"
  });

  var observerBindings = Object.create(null);

  function isObject(value) {
    return Boolean(
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    );
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clonePlain(value, seen) {
    var visited = seen || [];

    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "function") {
      return null;
    }

    if (visited.indexOf(value) !== -1) {
      return null;
    }

    visited.push(value);

    if (Array.isArray(value)) {
      return value.map(function cloneArrayItem(item) {
        return clonePlain(item, visited.slice());
      });
    }

    if (isObject(value)) {
      var output = {};

      Object.keys(value).forEach(function cloneObjectKey(key) {
        output[key] = clonePlain(value[key], visited.slice());
      });

      return output;
    }

    return String(value);
  }

  function deepFreeze(value, seen) {
    var visited = seen || [];

    if (
      !value ||
      (typeof value !== "object" && typeof value !== "function")
    ) {
      return value;
    }

    if (visited.indexOf(value) !== -1) {
      return value;
    }

    visited.push(value);

    Object.getOwnPropertyNames(value).forEach(function freezeProperty(key) {
      var child;

      try {
        child = value[key];
      } catch (_error) {
        child = null;
      }

      deepFreeze(child, visited);
    });

    try {
      Object.freeze(value);
    } catch (_error) {
      // Host objects may reject freezing.
    }

    return value;
  }

  function createConfirmedEngineSubject() {
    return {
      schema: SUBJECT_SCHEMA,

      slot: 1,

      engineId: "DGB_INTERACTIVE_RUNTIME_ENGINE",

      engineName: "DGB Interactive Runtime Engine",

      engineClass: "INTERACTIVE_RUNTIME_ENGINE",

      status: STATUS.CONFIRMED,

      defaultSubject: true,

      contract: {
        name:
          "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1",

        version: "1.1.0",

        file: "/assets/engine/dgb.engine.contract.js",

        modelSchema: "DGB_MODEL_PACKAGE_v1"
      },

      implementation: {
        file: "/assets/engine/dgb.engine.js",

        globalEntryPoint: null,

        loadRequiredByRegistry: false,

        implementationClaimedPresent: true
      },

      compliance: {
        status: COMPLIANCE_STATUS.CONFIRMED_COMPLIANT,

        standard:
          "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1",

        basis: "USER_CONFIRMED_COMPLIANT_TO_STANDARD",

        confirmedAt: null,

        registryPerformsComplianceTest: false
      },

      diagnosticObserver: {
        requiredSchema: OBSERVATION_SCHEMA,

        status: OBSERVER_STATUS.ADAPTER_REQUIRED,

        entryPoint: null,

        adapterFile: null,

        liveEvidenceClaimed: false
      },

      diagnosticEligibility: {
        selectable: true,

        contractKnown: true,

        implementationKnown: true,

        complianceKnown: true,

        observerRequiredForLiveDiagnosis: true
      },

      boundaries: {
        registryLoadsEngine: false,

        registryExecutesEngine: false,

        registryMutatesEngine: false,

        registryClaimsReadiness: false,

        registryClaimsVisualPass: false
      }
    };
  }

  function createReservedEngineSubject(slot) {
    var paddedSlot = String(slot).padStart(2, "0");

    return {
      schema: SUBJECT_SCHEMA,

      slot: slot,

      engineId: "DGB_ENGINE_RESERVED_SLOT_" + paddedSlot,

      engineName: null,

      engineClass: null,

      status: STATUS.RESERVED,

      defaultSubject: false,

      contract: {
        name: null,

        version: null,

        file: null,

        modelSchema: null
      },

      implementation: {
        file: null,

        globalEntryPoint: null,

        loadRequiredByRegistry: false,

        implementationClaimedPresent: false
      },

      compliance: {
        status: COMPLIANCE_STATUS.UNASSESSED,

        standard: null,

        basis: "RESERVED_SLOT_NO_ENGINE_AUTHORITY_SUPPLIED",

        confirmedAt: null,

        registryPerformsComplianceTest: false
      },

      diagnosticObserver: {
        requiredSchema: OBSERVATION_SCHEMA,

        status: OBSERVER_STATUS.NOT_DECLARED,

        entryPoint: null,

        adapterFile: null,

        liveEvidenceClaimed: false
      },

      diagnosticEligibility: {
        selectable: false,

        contractKnown: false,

        implementationKnown: false,

        complianceKnown: false,

        observerRequiredForLiveDiagnosis: true
      },

      boundaries: {
        registryLoadsEngine: false,

        registryExecutesEngine: false,

        registryMutatesEngine: false,

        registryClaimsReadiness: false,

        registryClaimsVisualPass: false
      }
    };
  }

  var subjects = [
    createConfirmedEngineSubject(),
    createReservedEngineSubject(2),
    createReservedEngineSubject(3),
    createReservedEngineSubject(4),
    createReservedEngineSubject(5),
    createReservedEngineSubject(6)
  ];

  function validateRegistrySubjects(subjectList) {
    var issues = [];
    var slotMap = Object.create(null);
    var idMap = Object.create(null);
    var defaultCount = 0;

    if (!Array.isArray(subjectList)) {
      return [
        {
          code: "SUBJECT_LIST_INVALID",
          detail: "Engine subject list must be an array."
        }
      ];
    }

    if (subjectList.length !== SLOT_COUNT) {
      issues.push({
        code: "SLOT_COUNT_INVALID",
        expected: SLOT_COUNT,
        received: subjectList.length
      });
    }

    subjectList.forEach(function validateSubject(subject, index) {
      if (!isObject(subject)) {
        issues.push({
          code: "SUBJECT_INVALID",
          index: index
        });

        return;
      }

      if (subject.schema !== SUBJECT_SCHEMA) {
        issues.push({
          code: "SUBJECT_SCHEMA_INVALID",
          index: index,
          received: subject.schema || null
        });
      }

      if (
        !Number.isInteger(subject.slot) ||
        subject.slot < 1 ||
        subject.slot > SLOT_COUNT
      ) {
        issues.push({
          code: "SUBJECT_SLOT_INVALID",
          index: index,
          received: subject.slot
        });
      }

      if (slotMap[subject.slot]) {
        issues.push({
          code: "SUBJECT_SLOT_DUPLICATE",
          slot: subject.slot
        });
      }

      slotMap[subject.slot] = true;

      if (
        typeof subject.engineId !== "string" ||
        !subject.engineId.trim()
      ) {
        issues.push({
          code: "ENGINE_ID_INVALID",
          index: index
        });
      } else if (idMap[subject.engineId]) {
        issues.push({
          code: "ENGINE_ID_DUPLICATE",
          engineId: subject.engineId
        });
      }

      idMap[subject.engineId] = true;

      if (subject.defaultSubject === true) {
        defaultCount += 1;
      }
    });

    if (defaultCount !== 1) {
      issues.push({
        code: "DEFAULT_ENGINE_COUNT_INVALID",
        expected: 1,
        received: defaultCount
      });
    }

    if (!idMap[DEFAULT_ENGINE_ID]) {
      issues.push({
        code: "DEFAULT_ENGINE_MISSING",
        engineId: DEFAULT_ENGINE_ID
      });
    }

    return issues;
  }

  var registryIssues = validateRegistrySubjects(subjects);

  var canonicalRegistry = deepFreeze({
    schema: SCHEMA,

    contract: CONTRACT,

    version: VERSION,

    file: FILE,

    slotCount: SLOT_COUNT,

    defaultEngineId: DEFAULT_ENGINE_ID,

    observationSchema: OBSERVATION_SCHEMA,

    validStatuses: Object.keys(STATUS).map(function mapStatus(key) {
      return STATUS[key];
    }),

    validComplianceStatuses: Object.keys(COMPLIANCE_STATUS).map(
      function mapComplianceStatus(key) {
        return COMPLIANCE_STATUS[key];
      }
    ),

    validObserverStatuses: Object.keys(OBSERVER_STATUS).map(
      function mapObserverStatus(key) {
        return OBSERVER_STATUS[key];
      }
    ),

    valid: registryIssues.length === 0,

    issues: registryIssues,

    subjects: subjects,

    boundaries: {
      metadataOnly: true,

      loadsEngines: false,

      executesEngines: false,

      performsComplianceTesting: false,

      mutatesProduction: false,

      authorizesRepair: false,

      claimsReadiness: false,

      claimsVisualPass: false
    }
  });

  function findSubjectById(engineId) {
    var normalized = String(engineId || "").trim();

    if (!normalized) {
      return null;
    }

    for (var i = 0; i < canonicalRegistry.subjects.length; i += 1) {
      if (canonicalRegistry.subjects[i].engineId === normalized) {
        return canonicalRegistry.subjects[i];
      }
    }

    return null;
  }

  function findSubjectBySlot(slot) {
    var numericSlot = Number(slot);

    if (!Number.isInteger(numericSlot)) {
      return null;
    }

    for (var i = 0; i < canonicalRegistry.subjects.length; i += 1) {
      if (canonicalRegistry.subjects[i].slot === numericSlot) {
        return canonicalRegistry.subjects[i];
      }
    }

    return null;
  }

  function listEngineSubjects(options) {
    var settings = isObject(options) ? options : {};
    var includeReserved = settings.includeReserved !== false;

    return canonicalRegistry.subjects
      .filter(function filterSubject(subject) {
        if (includeReserved) {
          return true;
        }

        return subject.status !== STATUS.RESERVED;
      })
      .map(function cloneSubject(subject) {
        return clonePlain(subject);
      });
  }

  function getEngineSubject(engineId) {
    var subject = findSubjectById(engineId);

    return subject ? clonePlain(subject) : null;
  }

  function getEngineSubjectBySlot(slot) {
    var subject = findSubjectBySlot(slot);

    return subject ? clonePlain(subject) : null;
  }

  function getDefaultEngineSubject() {
    return getEngineSubject(DEFAULT_ENGINE_ID);
  }

  function getConfirmedCompliantEngines() {
    return canonicalRegistry.subjects
      .filter(function filterConfirmed(subject) {
        return (
          subject.compliance &&
          subject.compliance.status ===
            COMPLIANCE_STATUS.CONFIRMED_COMPLIANT
        );
      })
      .map(function cloneConfirmed(subject) {
        return clonePlain(subject);
      });
  }

  function getReservedEngineSlots() {
    return canonicalRegistry.subjects
      .filter(function filterReserved(subject) {
        return subject.status === STATUS.RESERVED;
      })
      .map(function cloneReserved(subject) {
        return clonePlain(subject);
      });
  }

  function isSelectableEngine(engineId) {
    var subject = findSubjectById(engineId);

    return Boolean(
      subject &&
      subject.diagnosticEligibility &&
      subject.diagnosticEligibility.selectable === true
    );
  }

  function isConfirmedCompliant(engineId) {
    var subject = findSubjectById(engineId);

    return Boolean(
      subject &&
      subject.compliance &&
      subject.compliance.status ===
        COMPLIANCE_STATUS.CONFIRMED_COMPLIANT
    );
  }

  function normalizeObserverApi(observerApi) {
    if (!observerApi) {
      return null;
    }

    if (isFunction(observerApi)) {
      return {
        observe: observerApi
      };
    }

    if (!isObject(observerApi)) {
      return null;
    }

    if (
      !isFunction(observerApi.observe) &&
      !isFunction(observerApi.getObservationPacket)
    ) {
      return null;
    }

    return observerApi;
  }

  function attachObserver(engineId, observerApi) {
    var subject = findSubjectById(engineId);
    var normalizedObserver = normalizeObserverApi(observerApi);

    if (!subject) {
      return {
        ok: false,

        code: "ENGINE_SUBJECT_NOT_FOUND",

        engineId: engineId || null
      };
    }

    if (
      !subject.diagnosticEligibility ||
      subject.diagnosticEligibility.selectable !== true
    ) {
      return {
        ok: false,

        code: "ENGINE_SUBJECT_NOT_SELECTABLE",

        engineId: subject.engineId,

        slot: subject.slot
      };
    }

    if (!normalizedObserver) {
      return {
        ok: false,

        code: "OBSERVER_API_INVALID",

        engineId: subject.engineId,

        requiredMethods: [
          "observe",
          "getObservationPacket"
        ]
      };
    }

    observerBindings[subject.engineId] = normalizedObserver;

    return {
      ok: true,

      code: "OBSERVER_ATTACHED",

      engineId: subject.engineId,

      observationSchema: OBSERVATION_SCHEMA
    };
  }

  function detachObserver(engineId) {
    var subject = findSubjectById(engineId);

    if (!subject) {
      return {
        ok: false,

        code: "ENGINE_SUBJECT_NOT_FOUND",

        engineId: engineId || null
      };
    }

    if (!observerBindings[subject.engineId]) {
      return {
        ok: true,

        code: "OBSERVER_ALREADY_DETACHED",

        engineId: subject.engineId
      };
    }

    delete observerBindings[subject.engineId];

    return {
      ok: true,

      code: "OBSERVER_DETACHED",

      engineId: subject.engineId
    };
  }

  function hasObserver(engineId) {
    var subject = findSubjectById(engineId);

    return Boolean(
      subject &&
      observerBindings[subject.engineId]
    );
  }

  function getObserverStatus(engineId) {
    var subject = findSubjectById(engineId);

    if (!subject) {
      return {
        engineId: engineId || null,

        subjectFound: false,

        attached: false,

        status: OBSERVER_STATUS.UNAVAILABLE,

        requiredSchema: OBSERVATION_SCHEMA
      };
    }

    return {
      engineId: subject.engineId,

      subjectFound: true,

      attached: hasObserver(subject.engineId),

      status: hasObserver(subject.engineId)
        ? OBSERVER_STATUS.AVAILABLE
        : subject.diagnosticObserver.status,

      requiredSchema: OBSERVATION_SCHEMA
    };
  }

  function requestObservation(engineId, request) {
    var subject = findSubjectById(engineId);
    var observer;
    var observe;

    if (!subject) {
      return Promise.resolve({
        ok: false,

        status: "HOLD",

        code: "ENGINE_SUBJECT_NOT_FOUND",

        engineId: engineId || null
      });
    }

    if (!isSelectableEngine(subject.engineId)) {
      return Promise.resolve({
        ok: false,

        status: "HOLD",

        code: "ENGINE_SUBJECT_NOT_SELECTABLE",

        engineId: subject.engineId,

        slot: subject.slot
      });
    }

    observer = observerBindings[subject.engineId];

    if (!observer) {
      return Promise.resolve({
        ok: false,

        status: "HOLD",

        code: "ENGINE_OBSERVER_NOT_ATTACHED",

        engineId: subject.engineId,

        requiredSchema: OBSERVATION_SCHEMA
      });
    }

    observe = isFunction(observer.observe)
      ? observer.observe
      : observer.getObservationPacket;

    try {
      return Promise.resolve(
        observe.call(
          observer,
          clonePlain(request || {}),
          clonePlain(subject)
        )
      ).then(function validateObservation(packet) {
        if (!isObject(packet)) {
          return {
            ok: false,

            status: "ERROR",

            code: "ENGINE_OBSERVATION_PACKET_INVALID",

            engineId: subject.engineId
          };
        }

        if (
          packet.schema &&
          packet.schema !== OBSERVATION_SCHEMA
        ) {
          return {
            ok: false,

            status: "CONFLICT",

            code: "ENGINE_OBSERVATION_SCHEMA_CONFLICT",

            engineId: subject.engineId,

            expectedSchema: OBSERVATION_SCHEMA,

            receivedSchema: packet.schema
          };
        }

        return {
          ok: true,

          status: "PASS",

          code: "ENGINE_OBSERVATION_RECEIVED",

          engineId: subject.engineId,

          packet: clonePlain(packet)
        };
      });
    } catch (error) {
      return Promise.resolve({
        ok: false,

        status: "ERROR",

        code: "ENGINE_OBSERVER_THROW",

        engineId: subject.engineId,

        detail: String(
          error && error.message
            ? error.message
            : error
        )
      });
    }
  }

  function getRegistryReceipt() {
    return clonePlain({
      schema: "DGB_ENGINE_SUBJECT_REGISTRY_RECEIPT_v1",

      contract: CONTRACT,

      version: VERSION,

      file: FILE,

      valid: canonicalRegistry.valid,

      issueCount: canonicalRegistry.issues.length,

      issues: canonicalRegistry.issues,

      slotCount: canonicalRegistry.slotCount,

      registeredSubjectCount:
        canonicalRegistry.subjects.length,

      selectableSubjectCount:
        canonicalRegistry.subjects.filter(
          function countSelectable(subject) {
            return (
              subject.diagnosticEligibility &&
              subject.diagnosticEligibility.selectable === true
            );
          }
        ).length,

      confirmedCompliantCount:
        getConfirmedCompliantEngines().length,

      reservedSlotCount:
        getReservedEngineSlots().length,

      defaultEngineId: DEFAULT_ENGINE_ID,

      observationSchema: OBSERVATION_SCHEMA,

      boundaries: canonicalRegistry.boundaries
    });
  }

  var api = deepFreeze({
    CONTRACT: CONTRACT,

    VERSION: VERSION,

    FILE: FILE,

    SCHEMA: SCHEMA,

    SUBJECT_SCHEMA: SUBJECT_SCHEMA,

    OBSERVATION_SCHEMA: OBSERVATION_SCHEMA,

    SLOT_COUNT: SLOT_COUNT,

    DEFAULT_ENGINE_ID: DEFAULT_ENGINE_ID,

    STATUS: STATUS,

    COMPLIANCE_STATUS: COMPLIANCE_STATUS,

    OBSERVER_STATUS: OBSERVER_STATUS,

    getRegistryReceipt: getRegistryReceipt,

    listEngineSubjects: listEngineSubjects,

    getEngineSubject: getEngineSubject,

    getEngineSubjectBySlot: getEngineSubjectBySlot,

    getDefaultEngineSubject: getDefaultEngineSubject,

    getConfirmedCompliantEngines:
      getConfirmedCompliantEngines,

    getReservedEngineSlots: getReservedEngineSlots,

    isSelectableEngine: isSelectableEngine,

    isConfirmedCompliant: isConfirmedCompliant,

    attachObserver: attachObserver,

    detachObserver: detachObserver,

    hasObserver: hasObserver,

    getObserverStatus: getObserverStatus,

    requestObservation: requestObservation
  });

  var existing = root.DGB_ENGINE_SUBJECT_REGISTRY;

  if (
    existing &&
    existing.CONTRACT &&
    existing.CONTRACT !== CONTRACT
  ) {
    root.__DGB_ENGINE_SUBJECT_REGISTRY_CONFLICT__ = deepFreeze({
      schema: "DGB_ENGINE_SUBJECT_REGISTRY_CONFLICT_v1",

      expectedContract: CONTRACT,

      existingContract: existing.CONTRACT,

      file: FILE,

      replacementPerformed: false
    });

    return;
  }

  root.DGB_ENGINE_SUBJECT_REGISTRY = api;

  if (!root.DGB || typeof root.DGB !== "object") {
    root.DGB = {};
  }

  root.DGB.engineSubjectRegistry = api;

  root.__DGB_ENGINE_SUBJECT_REGISTRY_LOADED__ = true;

  root.__DGB_ENGINE_SUBJECT_REGISTRY_VERSION__ = VERSION;
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
