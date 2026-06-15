// /assets/engine/dgb.engine.js
// DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// Full-file replacement.
// Shared DGB runtime engine core.
// Governing contract: DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// Governing model schema: DGB_MODEL_PACKAGE_v1
//
// Purpose:
// - provide the shared runtime engine core;
// - coordinate exact contract admission;
// - coordinate model admission;
// - manage private precommit and committed instances;
// - coordinate renderer, input, and fallback adapters;
// - manage immutable evidence permissions;
// - manage deferred and monotonic evidence;
// - manage intent admission;
// - govern lifecycle transitions;
// - manage authorized surfaces, targets, and leases;
// - manage asynchronous scheduling;
// - manage receipts, disposal, and immutable tombstones.
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

var INTERNAL_INSTANCE_SCHEMA = "DGB_ENGINE_INTERNAL_INSTANCE_RECORD_v2";
var EVIDENCE_SCHEMA = "DGB_ENGINE_EVIDENCE_ENVELOPE_v1";
var INTENT_SCHEMA = "DGB_ENGINE_INTENT_ENVELOPE_v1";
var TRANSITION_SCHEMA = "DGB_ENGINE_TRANSITION_RECORD_v2";
var RUNTIME_CONTROL_SCHEMA = "DGB_ENGINE_RUNTIME_CONTROL_STATE_v1";
var ADAPTER_SESSION_SCHEMA = "DGB_ENGINE_ADAPTER_SESSION_v2";
var SURFACE_AUTH_SCHEMA = "DGB_ENGINE_SURFACE_AUTHORIZATION_v2";
var SURFACE_LEASE_SCHEMA = "DGB_ENGINE_SURFACE_LEASE_v2";
var TARGET_AUTH_SCHEMA = "DGB_ENGINE_TARGET_AUTHORIZATION_v2";
var RUNTIME_RECEIPT_SCHEMA = "DGB_ENGINE_RUNTIME_RECEIPT_v2";
var INSPECTION_SCHEMA = "DGB_ENGINE_INSPECTION_PACKET_v2";

var STATUS = deepFreeze({
HELD: "HELD",
READY: "READY",
CONFLICT: "CONFLICT",
ERROR: "ERROR"
});

var PROGRESS = deepFreeze({
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
});

var CONDITION = deepFreeze({
NONE: "NONE",
PAUSED: "PAUSED",
HELD: "HELD",
DEGRADED: "DEGRADED",
FALLBACK: "FALLBACK",
CONTEXT_LOST: "CONTEXT_LOST",
RECOVERING: "RECOVERING",
ERROR: "ERROR"
});

var EXECUTION = deepFreeze({
NONE: "NONE",
PRIMARY: "PRIMARY",
FALLBACK: "FALLBACK",
TRANSITION: "TRANSITION",
DISPOSING: "DISPOSING",
DESTROYED: "DESTROYED"
});

var ADAPTER_KIND = deepFreeze({
RENDERER: "renderer",
INPUT: "input",
FALLBACK: "fallback"
});

var EVIDENCE_CLASSIFICATION = deepFreeze({
PRODUCTION: "PRODUCTION",
DIAGNOSTIC_SYNTHETIC: "DIAGNOSTIC_SYNTHETIC",
DIAGNOSTIC_ISOLATED: "DIAGNOSTIC_ISOLATED",
REGISTERED_EXTERNAL_PROVIDER: "REGISTERED_EXTERNAL_PROVIDER",
UNKNOWN: "UNKNOWN"
});

var CUSTODY = deepFreeze({
BORROWED_READ_ONLY: "BORROWED_READ_ONLY",
COPIED_BY_ENGINE: "COPIED_BY_ENGINE",
TRANSFERRED_TO_ENGINE: "TRANSFERRED_TO_ENGINE"
});

var PROGRESS_ORDER = deepFreeze({
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
});

var NEXT_PROGRESS = deepFreeze({
DECLARED: "LOADED",
LOADED: "VALIDATED",
VALIDATED: "CREATED",
CREATED: "MOUNTED",
MOUNTED: "INITIALIZED",
INITIALIZED: "UPLOADED",
UPLOADED: "SUBMITTED",
SUBMITTED: "PRESENTED",
PRESENTED: "VISIBLE",
VISIBLE: "INTERACTIVE",
INTERACTIVE: "VERIFIED",
VERIFIED: "DESTROYED"
});

var REQUIRED_PUBLIC_METHODS = deepFreeze([
"getAuthorityStatus",
"refreshAuthority",
"getAuthorityReceipt",
"getAuthorityValidation",
"validateModelPackage",
"admitModelPackage",
"createInstance",
"getInstance",
"hasInstance",
"listInstances",
"inspectInstance",
"destroyInstance",
"destroyAll",
"registerAdapter",
"unregisterAdapter",
"listAdapters",
"registerRenderer",
"unregisterRenderer",
"registerInput",
"unregisterInput",
"registerFallback",
"unregisterFallback",
"mountInstance",
"initializeInstance",
"startInstance",
"renderInstanceOnce",
"pauseInstance",
"resumeInstance",
"stopInstance",
"recoverInstance",
"attachInput",
"getSpec",
"getOps",
"compareInstance",
"getInstanceReceipt",
"getRuntimeReceipt",
"getStatus",
"getReceipt",
"getPacket",
"getPacketText",
"inspect",
"getDiagnosticEvidence",
"runDiagnosticSelfTest",
"subscribe",
"unsubscribe",
"authorizeSurface",
"revokeSurfaceAuthorization",
"acquireSurfaceLease",
"releaseSurfaceLease",
"authorizeTarget",
"revokeTargetAuthorization",
"listAdapterSessions",
"inspectAdapterSession",
"selectFallback",
"preparePrimaryRecovery",
"hash",
"clone"
]);

var loadBaseline = {
liveInstanceCountOnLoad: 0,
activeSessionCountOnLoad: 0,
activeSchedulerCountOnLoad: 0,
activeObserverCountOnLoad: 0,
listenerCountOnLoad: 0,
acquiredContextCountOnLoad: 0,
contextCreatedByCoreOnLoad: 0,
listenersCreatedByCoreOnLoad: 0,
observersCreatedByCoreOnLoad: 0,
schedulersCreatedByCoreOnLoad: 0,
instancesCreatedByCoreOnLoad: 0,
capturedAt: nowIso()
};

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
tombstoneRepeatCounts: Object.create(null),
adapters: Object.create(null),
subscribers: Object.create(null),
diagnosticHistory: [],
installationConflict: null,
publicationVerified: false,
sequences: {
instance: 0,
adapter: 0,
session: 0,
evidence: 0,
intent: 0,
transition: 0,
subscription: 0,
surfaceAuthorization: 0,
surfaceLease: 0,
targetAuthorization: 0,
fallbackSelection: 0,
operation: 0
}
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

function isTypedArray(value) {
return Boolean(
value &&
typeof ArrayBuffer !== "undefined" &&
ArrayBuffer.isView &&
ArrayBuffer.isView(value) &&
!(typeof DataView !== "undefined" && value instanceof DataView)
);
}

function isArrayBuffer(value) {
return Boolean(
value &&
typeof ArrayBuffer !== "undefined" &&
value instanceof ArrayBuffer
);
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

function cloneForInspection(value, seen) {
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
if (typeof value === "function") return "[Function]";

if (isTypedArray(value)) {
  return {
    type:
      value.constructor && value.constructor.name
        ? value.constructor.name
        : "TypedArray",
    length: typeof value.length === "number" ? value.length : 0,
    byteLength:
      typeof value.byteLength === "number" ? value.byteLength : 0,
    byteOffset:
      typeof value.byteOffset === "number" ? value.byteOffset : 0
  };
}

if (isArrayBuffer(value)) {
  return {
    type: "ArrayBuffer",
    byteLength: value.byteLength || 0
  };
}

var memory = seen || [];
if (memory.indexOf(value) !== -1) return "[Circular]";
memory.push(value);

if (Array.isArray(value)) {
  return value.map(function map(entry) {
    return cloneForInspection(entry, memory.slice());
  });
}

if (value instanceof Date) {
  return value.toISOString();
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
    key === "disposalPromise" ||
    key === "pendingFrameOperation"
  ) {
    output[key] = describeReference(value[key]);
  } else {
    output[key] = cloneForInspection(value[key], memory.slice());
  }
});

return output;

}

function cloneExecutionValue(value, custody, seen) {
if (
value === null ||
value === undefined ||
typeof value === "string" ||
typeof value === "number" ||
typeof value === "boolean"
) {
return value;
}

if (typeof value === "bigint") return value;
if (typeof value === "function") return value;

if (isTypedArray(value)) {
  if (custody === CUSTODY.COPIED_BY_ENGINE) {
    try {
      return new value.constructor(value);
    } catch (_error) {
      return value;
    }
  }

  return value;
}

if (isArrayBuffer(value)) {
  if (custody === CUSTODY.COPIED_BY_ENGINE && value.slice) {
    try {
      return value.slice(0);
    } catch (_error2) {
      return value;
    }
  }

  return value;
}

var memory = seen || [];
if (memory.indexOf(value) !== -1) return value;
memory.push(value);

if (Array.isArray(value)) {
  return value.map(function map(entry) {
    return cloneExecutionValue(entry, custody, memory.slice());
  });
}

var output = {};

Object.keys(value).forEach(function each(key) {
  output[key] = cloneExecutionValue(value[key], custody, memory.slice());
});

return output;

}

function createRestrictedExecutionView(record) {
var custody =
record.resources && record.resources.custody
? record.resources.custody
: CUSTODY.BORROWED_READ_ONLY;

return {
  identity: cloneExecutionValue(record.identity, custody),
  modelPackage: cloneExecutionValue(
    record.admission.admittedModel,
    custody
  ),
  spec: cloneExecutionValue(record.specification.spec, custody),
  runtimeControlSnapshot: cloneExecutionValue(
    record.runtimeControl,
    custody
  ),
  resourceCustody: custody
};

}

function frozenInspection(value) {
return deepFreeze(cloneForInspection(value));
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

  if (isTypedArray(item)) {
    return {
      type:
        item.constructor && item.constructor.name
          ? item.constructor.name
          : "TypedArray",
      values: Array.prototype.slice.call(item)
    };
  }

  if (isArrayBuffer(item)) {
    return {
      type: "ArrayBuffer",
      byteLength: item.byteLength || 0
    };
  }

  var memory = seen || [];
  if (memory.indexOf(item) !== -1) return "[Circular]";
  memory.push(item);

  if (Array.isArray(item)) {
    return item.map(function map(entry) {
      return prepare(entry, memory.slice());
    });
  }

  var output = {};

  Object.keys(item)
    .sort()
    .forEach(function each(key) {
      output[key] = prepare(item[key], memory.slice());
    });

  return output;
}

var prepared = prepare(value, []);
return JSON.stringify(prepared === undefined ? null : prepared);

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

try {
  out.tagName = value.tagName || null;
} catch (_error1) {}

try {
  out.id = value.id || null;
} catch (_error2) {}

try {
  out.className =
    typeof value.className === "string" ? value.className : null;
} catch (_error3) {}

try {
  out.nodeType = value.nodeType || null;
} catch (_error4) {}

try {
  out.width =
    typeof value.width === "number" ? value.width : null;
} catch (_error5) {}

try {
  out.height =
    typeof value.height === "number" ? value.height : null;
} catch (_error6) {}

return out;

}

function promiseAllSettled(values) {
return Promise.all(
values.map(function map(value) {
return Promise.resolve(value).then(
function fulfilled(result) {
return {
status: "fulfilled",
value: result
};
},
function rejected(error) {
return {
status: "rejected",
reason: error
};
}
);
})
);
}

function normalizeAuthorityReceipt(receipt) {
return isObject(receipt) ? frozenInspection(receipt) : null;
}

function normalizeAuthorityValidation(validation) {
return isObject(validation) ? frozenInspection(validation) : null;
}

function readFirst(object, paths) {
if (!object) return undefined;

for (var i = 0; i < paths.length; i += 1) {
  var path = paths[i].split(".");
  var cursor = object;
  var valid = true;

  for (var j = 0; j < path.length; j += 1) {
    if (
      cursor === null ||
      cursor === undefined ||
      !(path[j] in Object(cursor))
    ) {
      valid = false;
      break;
    }

    cursor = cursor[path[j]];
  }

  if (valid && cursor !== undefined) return cursor;
}

return undefined;

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
    errors: [
      "DGB_ENGINE_CONTRACT and DGBEngineContract are not the same authority object."
    ],
    warnings: []
  };
}

if (candidate.contract !== GOVERNING_CONTRACT) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_CONTRACT_IDENTITY_MISMATCH",
    contract: null,
    errors: [
      "Unexpected governing contract: " +
        String(candidate.contract || "UNKNOWN")
    ],
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
    errors: [
      String(error && error.message ? error.message : error)
    ],
    warnings: []
  };
}

if (!isObject(authorityValidation)) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_CONTRACT_VALIDATION_MISSING",
    contract: null,
    errors: ["Authority validation packet is missing."],
    warnings: []
  };
}

if (
  authorityValidation.passed !== true ||
  Number(authorityValidation.failCount || 0) !== 0
) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_CONTRACT_SELF_VALIDATION_FAILED",
    contract: null,
    errors: ["Authority validation did not pass cleanly."],
    warnings: []
  };
}

if (!isObject(authorityReceipt)) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_CONTRACT_RECEIPT_MISSING",
    contract: null,
    errors: ["Authority receipt is missing."],
    warnings: []
  };
}

var receiptContract = readFirst(authorityReceipt, [
  "contract",
  "authorityContract",
  "identity.contract"
]);

var receiptVersion = readFirst(authorityReceipt, [
  "version",
  "authorityVersion",
  "identity.version"
]);

var receiptFile = readFirst(authorityReceipt, [
  "file",
  "authorityFile",
  "identity.file"
]);

var receiptModelSchema = readFirst(authorityReceipt, [
  "modelSchema",
  "governingModelSchema",
  "identity.modelSchema"
]);

var receiptReady = readFirst(authorityReceipt, [
  "ready",
  "status.ready",
  "authorityReady"
]);

if (
  receiptContract !== undefined &&
  receiptContract !== GOVERNING_CONTRACT
) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_RECEIPT_CONTRACT_MISMATCH",
    contract: null,
    errors: ["Authority receipt contract mismatch."],
    warnings: []
  };
}

if (
  candidate.version !== undefined &&
  receiptVersion !== undefined &&
  candidate.version !== receiptVersion
) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_RECEIPT_VERSION_MISMATCH",
    contract: null,
    errors: ["Authority version and receipt version differ."],
    warnings: []
  };
}

if (
  candidate.file !== undefined &&
  receiptFile !== undefined &&
  candidate.file !== receiptFile
) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_RECEIPT_FILE_MISMATCH",
    contract: null,
    errors: ["Authority file and receipt file differ."],
    warnings: []
  };
}

if (
  receiptModelSchema !== undefined &&
  receiptModelSchema !== GOVERNING_MODEL_SCHEMA
) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_MODEL_SCHEMA_MISMATCH",
    contract: null,
    errors: ["Authority receipt model schema mismatch."],
    warnings: []
  };
}

if (receiptReady !== undefined && receiptReady !== true) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_RECEIPT_NOT_READY",
    contract: null,
    errors: ["Authority receipt is not ready."],
    warnings: []
  };
}

var fibonacciGate = readFirst(authorityReceipt, [
  "fibonacci.gate",
  "fibonacci.currentGate",
  "fibonacciGate",
  "gate"
]);

var nextFibonacciGate = readFirst(authorityReceipt, [
  "fibonacci.nextGate",
  "nextFibonacciGate",
  "nextGate"
]);

if (
  fibonacciGate === undefined ||
  nextFibonacciGate === undefined
) {
  return {
    ok: false,
    held: false,
    code: "GOVERNING_FIBONACCI_PROOF_MISSING",
    contract: null,
    errors: [
      "Authority receipt does not expose current and next Fibonacci gates."
    ],
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
  identity: deepFreeze({
    contract: GOVERNING_CONTRACT,
    version:
      receiptVersion !== undefined
        ? receiptVersion
        : candidate.version || null,
    file:
      receiptFile !== undefined
        ? receiptFile
        : candidate.file || null,
    modelSchema: GOVERNING_MODEL_SCHEMA,
    fibonacciGate: fibonacciGate,
    nextFibonacciGate: nextFibonacciGate,
    receiptHash:
      authorityReceipt.contractHash ||
      authorityReceipt.receiptHash ||
      hash(authorityReceipt)
  }),
  errors: [],
  warnings: []
};

}

function refreshAuthority() {
var previousStatus = stores.authorityStatus;
var result = discoverContract();

stores.authorityErrors = result.errors || [];
stores.authorityWarnings = result.warnings || [];

if (result.ok) {
  stores.authority = result.contract;
  stores.authorityStatus = STATUS.READY;
  stores.authorityReceipt = result.receipt;
  stores.authorityValidation = result.validation;
  stores.authorityIdentity = result.identity;
} else {
  stores.authority = null;
  stores.authorityStatus = result.held ? STATUS.HELD : STATUS.ERROR;
  stores.authorityReceipt = null;
  stores.authorityValidation = null;
  stores.authorityIdentity = null;
}

if (
  previousStatus === STATUS.READY &&
  stores.authorityStatus !== STATUS.READY
) {
  propagateAuthorityLoss(result.code);
}

publishFlags();
updateGlobalReceipt();
emit("authority", getAuthorityStatus());

return getAuthorityStatus();

}

function requireAuthority() {
if (
stores.authorityStatus !== STATUS.READY ||
!stores.authority
) {
refreshAuthority();
}

return stores.authorityStatus === STATUS.READY &&
  stores.authority
  ? stores.authority
  : null;

}

function propagateAuthorityLoss(reason) {
Object.keys(stores.instances).forEach(function each(instanceId) {
var record = stores.instances[instanceId];

  stopScheduler(record, "AUTHORITY_LOSS");

  requestLifecycle(record, {
    conditionState:
      stores.authorityStatus === STATUS.ERROR
        ? CONDITION.ERROR
        : CONDITION.HELD,
    executionMode: EXECUTION.NONE,
    triggerType: "AUTHORITY",
    reason: reason || "AUTHORITY_LOSS"
  });

  record.hold.active = true;
  record.hold.code = "AUTHORITY_LOST";
  record.hold.stage = "AUTHORITY";
  record.hold.message =
    "Governing authority is no longer admitted.";
  record.hold.startedAt =
    record.hold.startedAt || nowIso();

  recomputeInstanceState(record);
});

emit("authorityLost", {
  reason: reason || "AUTHORITY_LOSS"
});

}

function allocateId(prefix, sequenceName, extra) {
stores.sequences[sequenceName] += 1;

return (
  prefix +
  "-" +
  stores.sequences[sequenceName] +
  "-" +
  hash({
    prefix: prefix,
    sequence: stores.sequences[sequenceName],
    extra: extra || null,
    at: nowIso()
  }).replace("fnv1a32-", "")
);

}

function allocateInstanceId(options) {
var requested =
options && typeof options.instanceId === "string"
? options.instanceId.trim()
: "";

if (requested) {
  if (
    stores.instances[requested] ||
    stores.tombstones[requested]
  ) {
    return null;
  }

  stores.sequences.instance += 1;
  return requested;
}

return allocateId(
  "dgb-engine-instance",
  "instance",
  null
);

}

function legalProgressTarget(record, requestedProgress) {
if (!requestedProgress) {
return {
ok: true,
code: "NO_PROGRESS_CHANGE"
};
}

var current = record.lifecycle.progressState;

if (current === PROGRESS.DESTROYED) {
  return {
    ok: requestedProgress === PROGRESS.DESTROYED,
    code:
      requestedProgress === PROGRESS.DESTROYED
        ? "DESTROYED_IDEMPOTENT"
        : "DGB_TRANSITION_DESTROYED_TERMINAL"
  };
}

if (requestedProgress === current) {
  return {
    ok: true,
    code: "PROGRESS_IDEMPOTENT"
  };
}

if (requestedProgress === PROGRESS.DESTROYED) {
  return {
    ok: true,
    code: "DESTROY_TERMINAL"
  };
}

var expected = NEXT_PROGRESS[current];

if (
  current === PROGRESS.VISIBLE &&
  record.specification.requiresInteraction !== true &&
  requestedProgress === PROGRESS.VERIFIED
) {
  return {
    ok: true,
    code: "NONINTERACTIVE_VISIBLE_TO_VERIFIED"
  };
}

if (expected !== requestedProgress) {
  return {
    ok: false,
    code: "DGB_TRANSITION_NONADJACENT_PROGRESS"
  };
}

return {
  ok: true,
  code: "ADJACENT_PROGRESS"
};

}

function createTransitionRecord(record, request) {
stores.sequences.transition += 1;

return {
  schema: TRANSITION_SCHEMA,
  transitionId:
    "dgb-transition-" + stores.sequences.transition,
  transitionSequence: stores.sequences.transition,
  instanceId: record.identity.instanceId,
  from: {
    progressState: record.lifecycle.progressState,
    conditionState: record.lifecycle.conditionState,
    executionMode: record.lifecycle.executionMode
  },
  to: {
    progressState:
      request.progressState ||
      record.lifecycle.progressState,
    conditionState:
      request.conditionState ||
      record.lifecycle.conditionState,
    executionMode:
      request.executionMode ||
      record.lifecycle.executionMode
  },
  triggerType: request.triggerType || "CORE_OPERATION",
  triggerId: request.triggerId || null,
  reason: request.reason || "",
  evidenceIds: Array.isArray(request.evidenceIds)
    ? request.evidenceIds.slice()
    : [],
  missingEvidence: Array.isArray(request.missingEvidence)
    ? request.missingEvidence.slice()
    : [],
  accepted: false,
  rejectionCode: null,
  blocking: false,
  timestamp: nowIso()
};

}

function requestLifecycle(record, request) {
var transition = createTransitionRecord(
record,
request || {}
);

var progressCheck = legalProgressTarget(
  record,
  request && request.progressState
);

if (!progressCheck.ok) {
  transition.rejectionCode = progressCheck.code;
  record.transitions.rejectedCount += 1;
  record.transitions.history.push(transition);
  emit("transitionRejected", frozenInspection(transition));
  return frozenInspection(transition);
}

if (
  transition.to.progressState === PROGRESS.VERIFIED &&
  !verificationAllowed(record)
) {
  transition.rejectionCode =
    "DGB_TRANSITION_COMPARISON_NOT_READY";
  record.transitions.rejectedCount += 1;
  record.transitions.history.push(transition);
  emit("transitionRejected", frozenInspection(transition));
  return frozenInspection(transition);
}

transition.accepted = true;

record.lifecycle.previousProgressState =
  record.lifecycle.progressState;

record.lifecycle.progressState =
  transition.to.progressState;

record.lifecycle.conditionState =
  transition.to.conditionState;

record.lifecycle.executionMode =
  transition.to.executionMode;

record.lifecycle.transitionSequence += 1;
record.lifecycle.lastTransitionId =
  transition.transitionId;
record.lifecycle.lastTransitionAt =
  transition.timestamp;
record.lifecycle.stateEnteredAt =
  transition.timestamp;

if (
  transition.to.progressState !== PROGRESS.DESTROYED &&
  transition.to.conditionState === CONDITION.NONE
) {
  record.lifecycle.lastStableProgressState =
    transition.to.progressState;
}

if (
  transition.to.progressState === PROGRESS.VERIFIED
) {
  record.lifecycle.verifiedAt = transition.timestamp;
  record.timestamps.verifiedAt = transition.timestamp;
}

if (
  transition.to.progressState === PROGRESS.DESTROYED
) {
  record.lifecycle.destroyedAt = transition.timestamp;
  record.timestamps.destroyedAt = transition.timestamp;
}

record.transitions.acceptedCount += 1;
record.transitions.history.push(transition);

recomputeInstanceState(record);

emit("transition", frozenInspection(transition));

return frozenInspection(transition);

}

function verificationAllowed(record) {
return Boolean(
record.ops.comparison &&
record.ops.comparison.ready === true &&
Number(record.ops.comparison.failCount || 0) === 0 &&
Number(record.ops.comparison.conflictCount || 0) === 0 &&
!record.hold.active &&
!record.blockingError.active &&
record.lifecycle.conditionState !== CONDITION.HELD &&
record.lifecycle.conditionState !== CONDITION.ERROR &&
record.lifecycle.conditionState !== CONDITION.CONTEXT_LOST &&
record.proofs.current.visible === true &&
(
record.specification.requiresInteraction !== true ||
record.proofs.current.interactive === true
)
);
}

var EVIDENCE_RULES = deepFreeze({
SURFACE_NONZERO: {
kinds: ["renderer", "fallback", "core"],
requiresSession: false,
monotonic: false,
invalidation: false,
valueType: "boolean",
deferUntil: [],
projection: "surfaceNonzero"
},

SURFACE_ZERO: {
  kinds: ["renderer", "fallback", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: true,
  valueType: "boolean",
  deferUntil: [],
  projection: "surfaceZero"
},

RENDERER_INITIALIZED: {
  kinds: ["renderer"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["MOUNTED"],
  projection: "rendererInitialized"
},

RESOURCES_UPLOADED: {
  kinds: ["renderer"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["RENDERER_INITIALIZED"],
  projection: "resourcesUploaded"
},

FRAME_SUBMITTED: {
  kinds: ["renderer"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["RESOURCES_UPLOADED"],
  projection: "frameSubmitted"
},

FRAME_PRESENTED: {
  kinds: ["renderer"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["FRAME_SUBMITTED"],
  projection: "framePresented"
},

VISIBLE_PIXEL_OBSERVED: {
  kinds: ["renderer"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["FRAME_PRESENTED"],
  projection: "visiblePixelObserved"
},

INPUT_ATTACHED: {
  kinds: ["input"],
  requiresSession: true,
  requiresTargetAuthorization: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["MOUNTED"],
  projection: "inputAttached"
},

INPUT_DETACHED: {
  kinds: ["input", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: true,
  valueType: "boolean",
  deferUntil: [],
  projection: "inputDetached"
},

INTERACTION_OBSERVED: {
  kinds: ["input"],
  requiresSession: true,
  requiresTargetAuthorization: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["INPUT_ATTACHED"],
  projection: "interactionObserved"
},

FALLBACK_AVAILABLE: {
  kinds: ["fallback"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  requiresFallbackSelection: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: [],
  projection: "fallbackAvailable"
},

FALLBACK_INITIALIZED: {
  kinds: ["fallback"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  requiresFallbackSelection: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["FALLBACK_AVAILABLE"],
  projection: "fallbackInitialized"
},

FALLBACK_REPRESENTATION_READY: {
  kinds: ["fallback"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  requiresFallbackSelection: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["FALLBACK_INITIALIZED"],
  projection: "fallbackRepresentationReady"
},

FALLBACK_OUTPUT_WRITTEN: {
  kinds: ["fallback"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  requiresFallbackSelection: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["FALLBACK_REPRESENTATION_READY"],
  projection: "fallbackOutputWritten"
},

FALLBACK_PRESENTATION_OBSERVED: {
  kinds: ["fallback"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  requiresFallbackSelection: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["FALLBACK_OUTPUT_WRITTEN"],
  projection: "fallbackPresentationObserved"
},

FALLBACK_VISIBLE_OUTPUT_OBSERVED: {
  kinds: ["fallback"],
  requiresSession: true,
  requiresSurfaceAuthorization: true,
  requiresSurfaceLease: true,
  requiresFallbackSelection: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["FALLBACK_PRESENTATION_OBSERVED"],
  projection: "fallbackVisibleOutputObserved"
},

CONTEXT_RECOVERY_AVAILABLE: {
  kinds: ["renderer"],
  requiresSession: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: [],
  projection: "contextRecoveryAvailable"
},

CONTEXT_LOST: {
  kinds: ["renderer", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: true,
  valueType: "boolean",
  deferUntil: [],
  projection: "contextLost"
},

RECOVERY_SUCCEEDED: {
  kinds: ["renderer"],
  requiresSession: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: ["CONTEXT_LOST"],
  projection: "recoverySucceeded"
},

SESSION_DETACHED: {
  kinds: ["renderer", "input", "fallback", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: true,
  valueType: "boolean",
  deferUntil: [],
  projection: "sessionDetached"
},

TARGET_REVOKED: {
  kinds: ["input", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: true,
  valueType: "boolean",
  deferUntil: [],
  projection: "targetRevoked"
},

AUTHORIZATION_REVOKED: {
  kinds: ["renderer", "fallback", "input", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: true,
  valueType: "boolean",
  deferUntil: [],
  projection: "authorizationRevoked"
},

RESOURCE_INVALIDATED: {
  kinds: ["renderer", "fallback", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: true,
  valueType: "boolean",
  deferUntil: [],
  projection: "resourceInvalidated"
},

BLOCKING_ERROR: {
  kinds: ["renderer", "input", "fallback", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: true,
  valueType: "any",
  deferUntil: [],
  projection: "blockingError"
},

NONBLOCKING_WARNING: {
  kinds: ["renderer", "input", "fallback", "core"],
  requiresSession: false,
  monotonic: false,
  invalidation: false,
  valueType: "any",
  deferUntil: [],
  projection: "warning"
},

RENDERER_DISPOSED: {
  kinds: ["renderer"],
  requiresSession: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: [],
  projection: "rendererDisposed"
},

INPUT_DISPOSED: {
  kinds: ["input"],
  requiresSession: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: [],
  projection: "inputDisposed"
},

FALLBACK_DISPOSED: {
  kinds: ["fallback"],
  requiresSession: true,
  monotonic: true,
  invalidation: false,
  valueType: "boolean",
  deferUntil: [],
  projection: "fallbackDisposed"
}

});

function createEmptyInternalRecord(
instanceId,
model,
validation,
spec,
declaredOps,
options
) {
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
    governingContractVersion:
      stores.authorityIdentity &&
      stores.authorityIdentity.version,
    governingContractFile:
      stores.authorityIdentity &&
      stores.authorityIdentity.file,
    governingModelSchema: GOVERNING_MODEL_SCHEMA,
    authorityMatched: true,
    authorityReady: true,
    authorityReceiptHash:
      stores.authorityIdentity &&
      stores.authorityIdentity.receiptHash,
    authorityValidatedAt: now,
    fibonacciGate:
      stores.authorityIdentity &&
      stores.authorityIdentity.fibonacciGate,
    nextFibonacciGate:
      stores.authorityIdentity &&
      stores.authorityIdentity.nextFibonacciGate,
    f21Claimed: false
  },

  admission: {
    candidateReceived: true,
    validationAttempted: true,
    validationPassed: validation.passed === true,
    validationFailCount:
      Number(validation.failCount || 0),
    validationWarningCount:
      Number(validation.warningCount || 0),
    validation: frozenInspection(validation),
    normalizedModel: frozenInspection(model),
    admittedModel: model,
    admittedAt: now,
    rejected: false,
    rejection: null
  },

  resources: {
    custody:
      options.resourceCustody ||
      CUSTODY.BORROWED_READ_ONLY,
    copiedResourceCount: 0,
    transferredResourceCount: 0,
    borrowedResourceCount: 0,
    released: false
  },

  specification: {
    spec: deepFreeze(cloneExecutionValue(
      spec,
      CUSTODY.COPIED_BY_ENGINE
    )),
    specHash: hash(spec),
    interactionMode:
      spec.metadata &&
      spec.metadata.interactionMode ||
      "NONE",
    requiresInteraction: Boolean(
      spec.metadata &&
      spec.metadata.requiresInteraction
    ),
    fallbackPermitted:
      options.fallbackPermitted !== false,
    fallbackRequired:
      Boolean(options.fallbackRequired),
    fallbackMaySatisfyBackend:
      Boolean(options.fallbackMaySatisfyBackend),
    requiredBackends:
      spec.backend &&
      Array.isArray(spec.backend.requiredAny)
        ? spec.backend.requiredAny.slice()
        : ["WEBGL2"],
    preferredBackends:
      spec.backend &&
      Array.isArray(spec.backend.preferred)
        ? spec.backend.preferred.slice()
        : ["WEBGPU", "WEBGL2"],
    fallbackBackends:
      spec.backend &&
      Array.isArray(spec.backend.fallback)
        ? spec.backend.fallback.slice()
        : ["CANVAS2D", "SVG", "HTML"],
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
    draft: cloneExecutionValue(
      declaredOps,
      CUSTODY.COPIED_BY_ENGINE
    ),
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
    observedAt: null
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
    initializationAttempted: false,
    initializationResolved: false,
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
    required:
      Boolean(
        spec.metadata &&
        spec.metadata.requiresInteraction
      ),
    mode:
      spec.metadata &&
      spec.metadata.interactionMode ||
      "NONE",
    adapterId: null,
    sessionId: null,
    targetAuthorizationId: null,
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
    permitted:
      options.fallbackPermitted !== false,
    required:
      Boolean(options.fallbackRequired),
    available: false,
    selected: false,
    adapterId: null,
    sessionId: null,
    fallbackType: "NONE",
    selectionId: null,
    selectionGeneration: 0,
    selectionReason: null,
    priorBackend: null,
    surfaceAuthorizationId: null,
    surfaceLeaseId: null,
    initialized: false,
    representationReady: false,
    outputWritten: false,
    presentationObserved: false,
    visibleOutputObserved: false,
    maySatisfyBackend:
      Boolean(options.fallbackMaySatisfyBackend),
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
    frameGeneration: 0,
    lastTimestamp: null,
    lastDeltaTime: 0,
    startedAt: null,
    stoppedAt: null,
    stopReason: null,
    callbackActive: false,
    pendingFrameOperation: null,
    pendingFrameSessionId: null
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
    disposalPromise: null
  },

  proofs: {
    historical: {
      rendererInitialized: false,
      resourcesUploaded: false,
      frameSubmitted: false,
      framePresented: false,
      visible: false,
      interactive: false,
      fallbackAvailable: false,
      fallbackInitialized: false,
      fallbackRepresentationReady: false,
      fallbackOutputWritten: false,
      fallbackPresentationObserved: false,
      fallbackVisible: false,
      recoverySucceeded: false
    },
    current: {
      surfaceNonzero: false,
      rendererInitialized: false,
      resourcesUploaded: false,
      frameSubmitted: false,
      framePresented: false,
      visible: false,
      inputAttached: false,
      interactive: false,
      fallbackAvailable: false,
      fallbackInitialized: false,
      fallbackRepresentationReady: false,
      fallbackOutputWritten: false,
      fallbackPresentationObserved: false,
      fallbackVisible: false,
      contextLost: false,
      authorizationValid: true,
      targetValid: true,
      resourcesValid: true
    }
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
    schedulerStopped: false,
    observersDisconnected: false,
    inputDetached: false,
    inputDisposed: false,
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
    attempts: [],
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
    return destroyInstance(
      record.identity.instanceId,
      options
    );
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

if (
  !validation ||
  validation.passed !== true ||
  !validation.normalized
) {
  return deepFreeze({
    admitted: false,
    status: "REJECTED",
    validation: frozenInspection(validation)
  });
}

return deepFreeze({
  admitted: true,
  status: "ADMITTED",
  normalized: frozenInspection(validation.normalized),
  validation: frozenInspection(validation),
  options: frozenInspection(options || {})
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

if (
  !validation ||
  validation.passed !== true ||
  !validation.normalized
) {
  return deepFreeze({
    ok: false,
    status: "REJECTED",
    code: "MODEL_VALIDATION_FAILED",
    validation: frozenInspection(validation)
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
var fallbackPermitted =
  settings.fallbackPermitted !== false;

var requiredBackends =
  Array.isArray(settings.requiredBackend)
    ? settings.requiredBackend
    : ["WEBGL2"];

var spec;
var declaredOps;

try {
  spec = contract.createInstanceSpec({
    interactionMode:
      settings.interactionMode ||
      (
        model.interaction &&
        model.interaction.mode
      ) ||
      "NONE",

    requiresInteraction:
      typeof settings.requiresInteraction === "boolean"
        ? settings.requiresInteraction
        : Boolean(
          model.interaction &&
          model.interaction.mode &&
          model.interaction.mode !== "NONE"
        ),

    requiresFallback: fallbackRequired,
    requiredBackend: requiredBackends,
    preferredBackend:
      settings.preferredBackend ||
      ["WEBGPU", "WEBGL2"],
    fallbackBackend:
      settings.fallbackBackend ||
      ["CANVAS2D", "SVG", "HTML"],

    metadata: {
      modelId: model.identity.modelId,
      coreContract: CORE_CONTRACT
    }
  });

  declaredOps = contract.createDeclaredOps({
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
      fallbackAvailable: false,
      contextRecoveryAvailable: false,
      disposalObserved: false,
      noBlockingError: true
    }
  });
} catch (error) {
  return deepFreeze({
    ok: false,
    status: "REJECTED",
    code: "INSTANCE_PRECOMMIT_BUILD_FAILED",
    error: String(
      error && error.message
        ? error.message
        : error
    )
  });
}

var provisional = createEmptyInternalRecord(
  instanceId,
  model,
  validation,
  spec,
  declaredOps,
  {
    fallbackRequired: fallbackRequired,
    fallbackPermitted: fallbackPermitted,
    fallbackMaySatisfyBackend:
      Boolean(settings.fallbackMaySatisfyBackend),
    resourceCustody:
      settings.resourceCustody ||
      CUSTODY.BORROWED_READ_ONLY
  }
);

requestLifecycle(provisional, {
  progressState: PROGRESS.LOADED,
  triggerType: "PRECOMMIT",
  reason: "CORE_FILE_AND_CONTRACT_LOADED"
});

provisional.timestamps.loadedAt = nowIso();

requestLifecycle(provisional, {
  progressState: PROGRESS.VALIDATED,
  triggerType: "PRECOMMIT",
  reason: "MODEL_VALIDATED"
});

provisional.timestamps.validatedAt = nowIso();

recomputeInstanceState(provisional);

if (
  provisional.lifecycle.progressState !==
    PROGRESS.VALIDATED ||
  provisional.blockingError.active
) {
  return deepFreeze({
    ok: false,
    status: "REJECTED",
    code: "INSTANCE_PRECOMMIT_FAILED"
  });
}

stores.instances[instanceId] = provisional;

requestLifecycle(provisional, {
  progressState: PROGRESS.CREATED,
  triggerType: "COMMIT",
  reason: "INSTANCE_COMMITTED"
});

provisional.timestamps.createdAt = nowIso();

recomputeInstanceState(provisional);

emit("instanceCreated", {
  instanceId: instanceId,
  modelId: model.identity.modelId
});

updateGlobalReceipt();

return createRestrictedFacade(provisional);

}

function getRecord(instanceId, includeTombstone) {
if (stores.instances[instanceId]) {
return stores.instances[instanceId];
}

if (
  includeTombstone &&
  stores.tombstones[instanceId]
) {
  return stores.tombstones[instanceId];
}

return null;

}

function hasInstance(instanceId) {
return Boolean(stores.instances[instanceId]);
}

function getInstance(instanceId) {
var record = getRecord(instanceId, false);
return record ? createRestrictedFacade(record) : null;
}

function summarizeInstance(record) {
return {
instanceId: record.identity.instanceId,
modelId: record.identity.modelId,
progressState: record.lifecycle.progressState,
conditionState: record.lifecycle.conditionState,
executionMode: record.lifecycle.executionMode,
ready: Boolean(
record.ops.receipt &&
record.ops.receipt.ready
),
status:
record.ops.receipt
? record.ops.receipt.status
: "UNKNOWN",
destroyed:
record.lifecycle.progressState ===
PROGRESS.DESTROYED
};
}

function listInstances(options) {
var settings = isObject(options) ? options : {};
var list = Object.keys(stores.instances).map(
function map(id) {
return summarizeInstance(stores.instances[id]);
}
);

if (settings.includeTombstones) {
  list = list.concat(
    Object.keys(stores.tombstones).map(
      function map(id) {
        return summarizeInstance(
          stores.tombstones[id]
        );
      }
    )
  );
}

return deepFreeze(list);

}

function inspectInstance(instanceId) {
if (stores.tombstones[instanceId]) {
return stores.tombstones[instanceId].terminalInspection;
}

var record = stores.instances[instanceId];

if (!record) {
  return deepFreeze({
    found: false,
    instanceId: instanceId || null,
    status: "NOT_FOUND"
  });
}

return frozenInspection({
  found: true,
  schema: record.schema,
  identity: record.identity,
  authority: record.authority,
  admission: record.admission,
  resources: record.resources,

  specification: {
    specHash: record.specification.specHash,
    interactionMode:
      record.specification.interactionMode,
    requiresInteraction:
      record.specification.requiresInteraction,
    fallbackPermitted:
      record.specification.fallbackPermitted,
    fallbackRequired:
      record.specification.fallbackRequired,
    requiredBackends:
      record.specification.requiredBackends,
    preferredBackends:
      record.specification.preferredBackends,
    fallbackBackends:
      record.specification.fallbackBackends
  },

  lifecycle: record.lifecycle,
  hold: record.hold,
  blockingError: record.blockingError,

  ops: {
    snapshot: record.ops.snapshot,
    snapshotHash: record.ops.snapshotHash,
    comparison: record.ops.comparison,
    comparisonHash: record.ops.comparisonHash,
    receipt: record.ops.receipt,
    receiptHash: record.ops.receiptHash
  },

  mount: record.mount,
  surfaces: record.surfaces,
  targets: record.targets,
  renderer: record.renderer,
  input: record.input,
  fallback: record.fallback,
  runtimeControl: record.runtimeControl,
  scheduler: record.scheduler,
  proofs: record.proofs,

  evidence: {
    acceptedCount:
      record.evidence.acceptedCount,
    deferredCount:
      record.evidence.deferredCount,
    rejectedCount:
      record.evidence.rejectedCount,
    lastEvidenceId:
      record.evidence.lastEvidenceId,
    lastEvidenceAt:
      record.evidence.lastEvidenceAt,
    byType: record.evidence.byType,
    byAdapter: record.evidence.byAdapter,
    history: record.evidence.history,
    pending: record.evidence.pending
  },

  intents: record.intents,
  transitions: record.transitions,
  errors: record.errors,
  warnings: record.warnings,
  metrics: record.metrics,
  eligibility: record.eligibility.snapshot,
  timestamps: record.timestamps,
  disposal: record.disposal
});

}

function getSpec(instanceId) {
if (stores.tombstones[instanceId]) {
return stores.tombstones[instanceId].terminalSpec;
}

var record = stores.instances[instanceId];

return record
  ? frozenInspection(record.specification.spec)
  : null;

}

function getOps(instanceId) {
if (stores.tombstones[instanceId]) {
return stores.tombstones[instanceId].terminalOps;
}

var record = stores.instances[instanceId];

return record
  ? frozenInspection(record.ops.snapshot)
  : null;

}

function compareInstance(instanceId) {
if (stores.tombstones[instanceId]) {
return stores.tombstones[instanceId]
.terminalComparison;
}

var record = stores.instances[instanceId];

return record
  ? frozenInspection(record.ops.comparison)
  : null;

}

function getInstanceReceipt(instanceId) {
if (stores.tombstones[instanceId]) {
return stores.tombstones[instanceId]
.terminalReceipt;
}

var record = stores.instances[instanceId];

return record
  ? frozenInspection(record.ops.receipt)
  : null;

}

function validateAdapterOperations(kind, descriptor) {
var missing = [];

if (kind === ADAPTER_KIND.RENDERER) {
  if (!isFunction(descriptor.initialize)) {
    missing.push("initialize");
  }

  if (
    !isFunction(descriptor.render) &&
    !isFunction(descriptor.renderOnce) &&
    !isFunction(descriptor.submitFrame)
  ) {
    missing.push(
      "render|renderOnce|submitFrame"
    );
  }

  if (!isFunction(descriptor.dispose)) {
    missing.push("dispose");
  }
}

if (kind === ADAPTER_KIND.INPUT) {
  if (!isFunction(descriptor.attach)) {
    missing.push("attach");
  }

  if (!isFunction(descriptor.detach)) {
    missing.push("detach");
  }

  if (!isFunction(descriptor.dispose)) {
    missing.push("dispose");
  }
}

if (kind === ADAPTER_KIND.FALLBACK) {
  if (!isFunction(descriptor.initialize)) {
    missing.push("initialize");
  }

  if (
    !isFunction(descriptor.render) &&
    !isFunction(descriptor.renderOnce)
  ) {
    missing.push("render|renderOnce");
  }

  if (!isFunction(descriptor.dispose)) {
    missing.push("dispose");
  }
}

return missing;

}

function registerAdapter(descriptor) {
if (!isObject(descriptor)) {
return deepFreeze({
ok: false,
code: "ADAPTER_DESCRIPTOR_REQUIRED"
});
}

var kind = descriptor.kind;

if (
  kind !== ADAPTER_KIND.RENDERER &&
  kind !== ADAPTER_KIND.INPUT &&
  kind !== ADAPTER_KIND.FALLBACK
) {
  return deepFreeze({
    ok: false,
    code: "ADAPTER_KIND_INVALID"
  });
}

var missing = validateAdapterOperations(
  kind,
  descriptor
);

if (missing.length) {
  return deepFreeze({
    ok: false,
    code: "ADAPTER_REQUIRED_OPERATIONS_MISSING",
    missing: missing
  });
}

var adapterId =
  typeof descriptor.adapterId === "string" &&
  descriptor.adapterId.trim()
    ? descriptor.adapterId.trim()
    : allocateId(
      "dgb-" + kind + "-adapter",
      "adapter",
      descriptor.contract || null
    );

if (stores.adapters[adapterId]) {
  return deepFreeze({
    ok: false,
    code: "ADAPTER_ID_DUPLICATE",
    adapterId: adapterId
  });
}

stores.adapters[adapterId] = {
  adapterId: adapterId,
  kind: kind,
  contract: descriptor.contract || null,
  version: descriptor.version || null,
  capabilities: frozenInspection(
    descriptor.capabilities || {}
  ),
  operations: {
    probe:
      isFunction(descriptor.probe)
        ? descriptor.probe
        : null,
    initialize:
      isFunction(descriptor.initialize)
        ? descriptor.initialize
        : null,
    upload:
      isFunction(descriptor.upload)
        ? descriptor.upload
        : null,
    submitFrame:
      isFunction(descriptor.submitFrame)
        ? descriptor.submitFrame
        : null,
    render:
      isFunction(descriptor.render)
        ? descriptor.render
        : null,
    renderOnce:
      isFunction(descriptor.renderOnce)
        ? descriptor.renderOnce
        : null,
    recover:
      isFunction(descriptor.recover)
        ? descriptor.recover
        : null,
    resize:
      isFunction(descriptor.resize)
        ? descriptor.resize
        : null,
    pause:
      isFunction(descriptor.pause)
        ? descriptor.pause
        : null,
    resume:
      isFunction(descriptor.resume)
        ? descriptor.resume
        : null,
    detach:
      isFunction(descriptor.detach)
        ? descriptor.detach
        : null,
    dispose:
      isFunction(descriptor.dispose)
        ? descriptor.dispose
        : null,
    attach:
      isFunction(descriptor.attach)
        ? descriptor.attach
        : null
  },
  registeredAt: nowIso()
};

emit("adapterRegistered", {
  adapterId: adapterId,
  kind: kind
});

updateGlobalReceipt();

return deepFreeze({
  ok: true,
  adapterId: adapterId,
  kind: kind
});

}

function adapterHasLiveReferences(adapterId) {
return Object.keys(stores.instances).some(
function some(instanceId) {
var sessions =
stores.instances[instanceId]
.adapters.sessions;

    return Object.keys(sessions).some(
      function someSession(sessionId) {
        var session = sessions[sessionId];

        return (
          session.adapterId === adapterId &&
          session.disposed !== true
        );
      }
    );
  }
);

}

function unregisterAdapter(adapterId) {
if (!stores.adapters[adapterId]) {
return deepFreeze({
ok: true,
code: "ADAPTER_ALREADY_ABSENT",
adapterId: adapterId
});
}

if (adapterHasLiveReferences(adapterId)) {
  return deepFreeze({
    ok: false,
    code: "ADAPTER_ACTIVE_SESSION_REFERENCE",
    adapterId: adapterId
  });
}

delete stores.adapters[adapterId];

emit("adapterUnregistered", {
  adapterId: adapterId
});

updateGlobalReceipt();

return deepFreeze({
  ok: true,
  adapterId: adapterId
});

}

function listAdapters(options) {
var settings = isObject(options) ? options : {};
var kind = settings.kind || null;

return deepFreeze(
  Object.keys(stores.adapters)
    .filter(function filter(id) {
      return (
        !kind ||
        stores.adapters[id].kind === kind
      );
    })
    .map(function map(id) {
      var adapter = stores.adapters[id];

      return {
        adapterId: adapter.adapterId,
        kind: adapter.kind,
        contract: adapter.contract,
        version: adapter.version,
        capabilities: cloneForInspection(
          adapter.capabilities
        ),
        registeredAt: adapter.registeredAt
      };
    })
);

}

function registerRenderer(descriptor) {
var d = Object.assign(
{},
descriptor || {},
{ kind: ADAPTER_KIND.RENDERER }
);

return registerAdapter(d);

}

function unregisterRenderer(adapterId) {
return unregisterAdapter(adapterId);
}

function registerInput(descriptor) {
var d = Object.assign(
{},
descriptor || {},
{ kind: ADAPTER_KIND.INPUT }
);

return registerAdapter(d);

}

function unregisterInput(adapterId) {
return unregisterAdapter(adapterId);
}

function registerFallback(descriptor) {
var d = Object.assign(
{},
descriptor || {},
{ kind: ADAPTER_KIND.FALLBACK }
);

return registerAdapter(d);

}

function unregisterFallback(adapterId) {
return unregisterAdapter(adapterId);
}

function readRect(reference) {
var rect = {
width: 0,
height: 0,
top: 0,
left: 0,
right: 0,
bottom: 0
};

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
    rect.width =
      Number(reference.width) ||
      Number(reference.clientWidth) ||
      0;

    rect.height =
      Number(reference.height) ||
      Number(reference.clientHeight) ||
      0;
  }
} catch (_error) {}

return rect;

}

function isConnected(reference) {
try {
if (
typeof reference.isConnected === "boolean"
) {
return reference.isConnected;
}

  return true;
} catch (_error) {
  return false;
}

}

function mountInstance(instanceId, mountBinding) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

var binding = isObject(mountBinding)
  ? mountBinding
  : {};

var reference = binding.reference || null;

if (
  !reference &&
  typeof binding.selector === "string" &&
  root.document
) {
  try {
    reference = root.document.querySelector(
      binding.selector
    );
  } catch (_error) {
    reference = null;
  }
}

if (!reference && isFunction(binding.resolver)) {
  try {
    reference = binding.resolver();
  } catch (error) {
    return enterBlockingError(
      record,
      "MOUNT_RESOLVER_THROW",
      "MOUNT",
      String(
        error && error.message
          ? error.message
          : error
      )
    );
  }
}

if (!reference) {
  return enterHold(
    record,
    "MOUNT_NOT_RESOLVED",
    "MOUNT",
    "Explicit mount could not be resolved.",
    ["mount.reference"]
  );
}

var rect = readRect(reference);

record.mount.supplied = true;
record.mount.sourceKind = binding.selector
  ? "SELECTOR"
  : binding.resolver
    ? "RESOLVER"
    : "REFERENCE";

record.mount.selector = binding.selector || null;
record.mount.reference = reference;
record.mount.resolved = true;
record.mount.connected = isConnected(reference);
record.mount.width = rect.width;
record.mount.height = rect.height;
record.mount.nonzero =
  rect.width > 0 && rect.height > 0;
record.mount.rect = rect;
record.mount.observedAt = nowIso();

if (!record.mount.nonzero) {
  reportEvidence(
    instanceId,
    {
      schema: EVIDENCE_SCHEMA,
      evidenceType: "SURFACE_ZERO",
      value: true,
      classification:
        EVIDENCE_CLASSIFICATION.PRODUCTION,
      stage: "MOUNT"
    },
    {
      adapterId: "CORE",
      adapterKind: "core",
      sessionId: null
    }
  );

  return enterHold(
    record,
    "MOUNT_SURFACE_ZERO",
    "MOUNT",
    "Mount resolved but has zero surface.",
    ["surfaceNonzero"]
  );
}

record.proofs.current.surfaceNonzero = true;
record.timestamps.mountedAt = nowIso();

resolveHold(record);

var transition = requestLifecycle(record, {
  progressState: PROGRESS.MOUNTED,
  triggerType: "MOUNT",
  reason: "MOUNT_RESOLVED"
});

return deepFreeze({
  ok: transition.accepted === true,
  transition: transition,
  mount: describeReference(reference)
});

}

function normalizeRole(role) {
var normalized = String(role || "PRIMARY").toUpperCase();

if (
  normalized !== "PRIMARY" &&
  normalized !== "FALLBACK" &&
  normalized !== "DIAGNOSTIC"
) {
  return null;
}

return normalized;

}

function authorizeSurface(instanceId, request) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

var source = isObject(request) ? request : {};
var role = normalizeRole(source.role);

if (!role) {
  return deepFreeze({
    ok: false,
    code: "SURFACE_ROLE_INVALID"
  });
}

var contextKinds =
  Array.isArray(source.contextKinds)
    ? source.contextKinds.slice()
    : [source.contextKind || "WEBGL2"];

var authorizationId = allocateId(
  "surface-auth",
  "surfaceAuthorization",
  {
    instanceId: instanceId,
    role: role,
    adapterId: source.adapterId || null
  }
);

var auth = {
  schema: SURFACE_AUTH_SCHEMA,
  authorizationId: authorizationId,
  instanceId: instanceId,
  adapterId: source.adapterId || null,
  adapterKind: source.adapterKind || null,
  role: role,
  surface: source.surface || null,
  surfaceIdentity:
    source.surfaceIdentity ||
    hash(describeReference(source.surface)),
  surfaceType: source.surfaceType || "CUSTOM",
  ownership:
    source.ownership || "SURFACE_BORROWED",
  contextKindsAuthorized: contextKinds,
  resizeAuthorized:
    Boolean(source.resizeAuthorized),
  exclusive: source.exclusive !== false,
  sharingPolicy:
    source.sharingPolicy || "EXCLUSIVE",
  targetId: source.targetId || null,
  generation:
    stores.sequences.surfaceAuthorization,
  issuedAt: nowIso(),
  revokedAt: null,
  active: true
};

record.surfaces[role.toLowerCase()] = auth;

recomputeInstanceState(record);

return frozenInspection(auth);

}

function findSurfaceAuthorization(
record,
authorizationId
) {
var roles = [
"primary",
"fallback",
"diagnostic"
];

for (var i = 0; i < roles.length; i += 1) {
  var auth = record.surfaces[roles[i]];

  if (
    auth &&
    auth.authorizationId === authorizationId
  ) {
    return auth;
  }
}

return null;

}

function acquireSurfaceLease(instanceId, request) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

var source = isObject(request) ? request : {};
var authorizationId =
  source.authorizationId || null;

var auth = findSurfaceAuthorization(
  record,
  authorizationId
);

if (!auth || !auth.active) {
  return deepFreeze({
    ok: false,
    code: "SURFACE_AUTHORIZATION_NOT_FOUND"
  });
}

if (
  auth.adapterId &&
  source.adapterId &&
  auth.adapterId !== source.adapterId
) {
  return deepFreeze({
    ok: false,
    code: "SURFACE_AUTHORIZATION_ADAPTER_MISMATCH"
  });
}

var contextKind =
  source.contextKind ||
  auth.contextKindsAuthorized[0];

if (
  auth.contextKindsAuthorized.indexOf(
    contextKind
  ) === -1
) {
  return deepFreeze({
    ok: false,
    code: "SURFACE_CONTEXT_NOT_AUTHORIZED"
  });
}

var surfaceIdentity = auth.surfaceIdentity;
var existingLeaseId =
  record.surfaces.leaseBySurface[
    surfaceIdentity
  ];

if (existingLeaseId) {
  var existingLease =
    record.surfaces.leases[
      existingLeaseId
    ];

  if (
    existingLease &&
    existingLease.active &&
    (
      existingLease.exclusive ||
      auth.exclusive
    )
  ) {
    return deepFreeze({
      ok: false,
      code: "SURFACE_LEASE_EXCLUSIVE_COLLISION",
      activeLeaseId: existingLeaseId
    });
  }
}

var leaseId = allocateId(
  "surface-lease",
  "surfaceLease",
  {
    instanceId: instanceId,
    authorizationId: authorizationId,
    contextKind: contextKind
  }
);

var lease = {
  schema: SURFACE_LEASE_SCHEMA,
  leaseId: leaseId,
  authorizationId: auth.authorizationId,
  instanceId: instanceId,
  adapterId:
    source.adapterId ||
    auth.adapterId ||
    null,
  adapterKind:
    source.adapterKind ||
    auth.adapterKind ||
    null,
  surfaceIdentity: surfaceIdentity,
  role: auth.role,
  contextKind: contextKind,
  exclusive: auth.exclusive,
  active: true,
  generation:
    stores.sequences.surfaceLease,
  acquiredAt: nowIso(),
  releasedAt: null,
  releaseReason: null
};

record.surfaces.leases[leaseId] = lease;
record.surfaces.leaseBySurface[
  surfaceIdentity
] = leaseId;

recomputeInstanceState(record);

return frozenInspection(lease);

}

function releaseSurfaceLease(
instanceId,
leaseId,
reason
) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

var lease = record.surfaces.leases[leaseId];

if (!lease) {
  return deepFreeze({
    ok: true,
    code: "LEASE_ALREADY_ABSENT"
  });
}

lease.active = false;
lease.releasedAt = nowIso();
lease.releaseReason =
  reason || "RELEASED";

if (
  record.surfaces.leaseBySurface[
    lease.surfaceIdentity
  ] === leaseId
) {
  delete record.surfaces.leaseBySurface[
    lease.surfaceIdentity
  ];
}

invalidateSessionsForLease(
  record,
  leaseId,
  "LEASE_RELEASED"
);

recomputeInstanceState(record);

return deepFreeze({
  ok: true,
  leaseId: leaseId
});

}

function revokeSurfaceAuthorization(
instanceId,
authorizationId
) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

var auth = findSurfaceAuthorization(
  record,
  authorizationId
);

if (!auth) {
  return deepFreeze({
    ok: true,
    code: "AUTHORIZATION_ALREADY_ABSENT"
  });
}

auth.active = false;
auth.revokedAt = nowIso();

Object.keys(record.surfaces.leases).forEach(
  function each(leaseId) {
    var lease =
      record.surfaces.leases[leaseId];

    if (
      lease.authorizationId ===
      authorizationId &&
      lease.active
    ) {
      releaseSurfaceLease(
        instanceId,
        leaseId,
        "AUTHORIZATION_REVOKED"
      );
    }
  }
);

invalidateSessionsForAuthorization(
  record,
  authorizationId,
  "AUTHORIZATION_REVOKED"
);

reportEvidence(
  instanceId,
  {
    schema: EVIDENCE_SCHEMA,
    evidenceType:
      "AUTHORIZATION_REVOKED",
    value: true,
    stage: "AUTHORIZATION",
    classification:
      EVIDENCE_CLASSIFICATION.PRODUCTION
  },
  {
    adapterId: "CORE",
    adapterKind: "core",
    sessionId: null,
    authorizationId: authorizationId
  }
);

stopScheduler(
  record,
  "SURFACE_AUTHORIZATION_REVOKED"
);

return deepFreeze({
  ok: true,
  authorizationId: authorizationId
});

}

function authorizeTarget(instanceId, request) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

var source = isObject(request) ? request : {};

var authorizationId = allocateId(
  "target-auth",
  "targetAuthorization",
  {
    instanceId: instanceId,
    adapterId: source.adapterId || null
  }
);

var auth = {
  schema: TARGET_AUTH_SCHEMA,
  authorizationId: authorizationId,
  instanceId: instanceId,
  adapterId: source.adapterId || null,
  target: source.target || null,
  targetIdentity:
    source.targetIdentity ||
    hash(describeReference(source.target)),
  targetRole: source.targetRole || "CUSTOM",
  interactionMode:
    source.interactionMode ||
    record.specification.interactionMode,
  permittedEventTypes:
    Array.isArray(source.permittedEventTypes)
      ? source.permittedEventTypes.slice()
      : [],
  permittedCapabilities:
    Array.isArray(source.permittedCapabilities)
      ? source.permittedCapabilities.slice()
      : [],
  focusPolicy:
    source.focusPolicy || "NONE",
  capturePolicy:
    source.capturePolicy || "NONE",
  preventDefaultPolicy:
    source.preventDefaultPolicy || "NONE",
  sharingPolicy:
    source.sharingPolicy || "SHARED",
  generation:
    stores.sequences.targetAuthorization,
  issuedAt: nowIso(),
  revokedAt: null,
  active: true
};

record.targets.input = auth;
record.targets.authorizations[
  authorizationId
] = auth;
record.input.targetAuthorized = true;
record.input.targetAuthorizationId =
  authorizationId;

recomputeInstanceState(record);

return frozenInspection(auth);

}

function revokeTargetAuthorization(
instanceId,
authorizationId
) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

var auth =
  record.targets.authorizations[
    authorizationId
  ];

if (!auth) {
  return deepFreeze({
    ok: true,
    code: "TARGET_AUTH_ALREADY_ABSENT"
  });
}

auth.active = false;
auth.revokedAt = nowIso();

invalidateSessionsForTarget(
  record,
  authorizationId,
  "TARGET_REVOKED"
);

record.input.targetAuthorized = false;

reportEvidence(
  instanceId,
  {
    schema: EVIDENCE_SCHEMA,
    evidenceType: "TARGET_REVOKED",
    value: true,
    stage: "TARGET",
    classification:
      EVIDENCE_CLASSIFICATION.PRODUCTION
  },
  {
    adapterId: "CORE",
    adapterKind: "core",
    sessionId: null,
    targetAuthorizationId:
      authorizationId
  }
);

return deepFreeze({
  ok: true,
  authorizationId: authorizationId
});

}

function createAdapterSession(
record,
adapter,
binding
) {
var sessionId = allocateId(
"dgb-session",
"session",
{
instanceId: record.identity.instanceId,
adapterId: adapter.adapterId,
kind: adapter.kind
}
);

var session = {
  schema: ADAPTER_SESSION_SCHEMA,
  sessionId: sessionId,
  sessionGeneration:
    stores.sequences.session,
  instanceId: record.identity.instanceId,
  adapterId: adapter.adapterId,
  adapterKind: adapter.kind,
  contract: adapter.contract,
  version: adapter.version,
  status: "DECLARED",
  classification:
    EVIDENCE_CLASSIFICATION.PRODUCTION,
  surfaceAuthorizationId:
    binding.surfaceAuthorizationId || null,
  surfaceLeaseId:
    binding.surfaceLeaseId || null,
  targetAuthorizationId:
    binding.targetAuthorizationId || null,
  selectionId:
    binding.selectionId || null,
  selectionGeneration:
    binding.selectionGeneration || 0,
  targetId:
    binding.targetId || null,
  initialized: false,
  attached: false,
  active: false,
  paused: false,
  detached: false,
  disposing: false,
  disposed: false,
  stale: false,
  callbacksValid: true,
  pendingOperationCount: 0,
  errors: [],
  warnings: [],
  createdAt: nowIso(),
  initializedAt: null,
  detachedAt: null,
  disposedAt: null
};

record.adapters.sessions[sessionId] = session;
session.status = "ATTACHED";
session.attached = true;

emit("sessionAttached", {
  instanceId: record.identity.instanceId,
  sessionId: sessionId,
  adapterId: adapter.adapterId,
  kind: adapter.kind
});

return session;

}

function sessionIsCurrent(record, session) {
if (!session || session.disposed || session.stale) {
return false;
}

if (
  session.adapterKind === ADAPTER_KIND.RENDERER
) {
  return (
    record.adapters.rendererSessionId ===
    session.sessionId
  );
}

if (
  session.adapterKind === ADAPTER_KIND.INPUT
) {
  return (
    record.adapters.inputSessionId ===
    session.sessionId
  );
}

if (
  session.adapterKind === ADAPTER_KIND.FALLBACK
) {
  return (
    record.adapters.fallbackSessionId ===
    session.sessionId &&
    record.fallback.selectionId ===
    session.selectionId &&
    record.fallback.selectionGeneration ===
    session.selectionGeneration
  );
}

return false;

}

function validateSessionBinding(
record,
session
) {
if (!sessionIsCurrent(record, session)) {
return {
ok: false,
code: "SESSION_STALE_OR_NOT_CURRENT"
};
}

if (!session.callbacksValid) {
  return {
    ok: false,
    code: "SESSION_CALLBACKS_INVALID"
  };
}

if (
  session.surfaceAuthorizationId
) {
  var auth = findSurfaceAuthorization(
    record,
    session.surfaceAuthorizationId
  );

  if (!auth || !auth.active) {
    return {
      ok: false,
      code: "SESSION_AUTHORIZATION_INVALID"
    };
  }
}

if (session.surfaceLeaseId) {
  var lease =
    record.surfaces.leases[
      session.surfaceLeaseId
    ];

  if (!lease || !lease.active) {
    return {
      ok: false,
      code: "SESSION_LEASE_INVALID"
    };
  }
}

if (
  session.targetAuthorizationId
) {
  var target =
    record.targets.authorizations[
      session.targetAuthorizationId
    ];

  if (!target || !target.active) {
    return {
      ok: false,
      code: "SESSION_TARGET_INVALID"
    };
  }
}

return {
  ok: true,
  code: "SESSION_BINDING_VALID"
};

}

function makeSessionCallbacks(record, session) {
return {
reportEvidence: function reportBoundEvidence(
envelope
) {
var bindingCheck =
validateSessionBinding(
record,
session
);

    if (!bindingCheck.ok) {
      return deepFreeze({
        ok: false,
        code: bindingCheck.code
      });
    }

    return reportEvidence(
      record.identity.instanceId,
      envelope,
      {
        adapterId: session.adapterId,
        adapterKind:
          session.adapterKind,
        sessionId: session.sessionId,
        authorizationId:
          session.surfaceAuthorizationId,
        leaseId:
          session.surfaceLeaseId,
        targetAuthorizationId:
          session.targetAuthorizationId,
        selectionId:
          session.selectionId,
        selectionGeneration:
          session.selectionGeneration
      }
    );
  },

  emitIntent: function emitBoundIntent(
    envelope
  ) {
    var bindingCheck =
      validateSessionBinding(
        record,
        session
      );

    if (!bindingCheck.ok) {
      return deepFreeze({
        ok: false,
        code: bindingCheck.code
      });
    }

    return acceptIntent(
      record.identity.instanceId,
      envelope,
      {
        adapterId: session.adapterId,
        adapterKind:
          session.adapterKind,
        sessionId: session.sessionId,
        targetAuthorizationId:
          session.targetAuthorizationId
      }
    );
  }
};

}

function callAdapterOperation(
adapter,
method,
record,
session,
options
) {
var op = adapter.operations[method];

if (!isFunction(op)) {
  return Promise.resolve({
    ok: true,
    skipped: true,
    reason: "OPERATION_NOT_AVAILABLE"
  });
}

var bindingCheck =
  validateSessionBinding(record, session);

if (!bindingCheck.ok) {
  return Promise.resolve({
    ok: false,
    code: bindingCheck.code
  });
}

stores.sequences.operation += 1;

var operationId =
  "dgb-operation-" +
  stores.sequences.operation;

var callbacks =
  makeSessionCallbacks(record, session);

var executionView =
  createRestrictedExecutionView(record);

var context = {
  bindingContract:
    "DGB_ADAPTER_BINDING_CONTEXT_v2",
  operationId: operationId,
  classification:
    session.classification,
  instanceId:
    record.identity.instanceId,
  adapterId: adapter.adapterId,
  adapterKind: adapter.kind,
  sessionId: session.sessionId,
  surfaceAuthorizationId:
    session.surfaceAuthorizationId,
  surfaceLeaseId:
    session.surfaceLeaseId,
  targetAuthorizationId:
    session.targetAuthorizationId,
  selectionId:
    session.selectionId,
  selectionGeneration:
    session.selectionGeneration,
  modelIdentity:
    executionView.identity,
  modelPackage:
    executionView.modelPackage,
  spec:
    executionView.spec,
  runtimeControlSnapshot:
    executionView.runtimeControlSnapshot,
  resourceCustody:
    executionView.resourceCustody,
  lifecycleState:
    frozenInspection(record.lifecycle),
  mount: record.mount.reference,
  mountDimensions: {
    width: record.mount.width,
    height: record.mount.height,
    nonzero: record.mount.nonzero
  },
  timestamp: nowIso(),
  reportEvidence:
    callbacks.reportEvidence,
  emitIntent:
    callbacks.emitIntent
};

session.pendingOperationCount += 1;
record.async.pendingOperationCount += 1;

var operationResult;

try {
  operationResult = op.call(
    null,
    context,
    options || {}
  );
} catch (error) {
  session.pendingOperationCount -= 1;
  record.async.pendingOperationCount -= 1;

  session.errors.push(
    String(
      error && error.message
        ? error.message
        : error
    )
  );

  return Promise.resolve({
    ok: false,
    error: String(
      error && error.message
        ? error.message
        : error
    )
  });
}

return Promise.resolve(operationResult)
  .then(function fulfilled(result) {
    session.pendingOperationCount -= 1;
    record.async.pendingOperationCount -= 1;

    var staleCheck =
      validateSessionBinding(
        record,
        session
      );

    if (!staleCheck.ok) {
      return {
        ok: false,
        code:
          "STALE_OPERATION_COMPLETION",
        staleReason:
          staleCheck.code
      };
    }

    if (
      result &&
      Array.isArray(result.evidence)
    ) {
      result.evidence.forEach(
        function each(envelope) {
          callbacks.reportEvidence(envelope);
        }
      );
    } else if (
      result &&
      result.evidence
    ) {
      callbacks.reportEvidence(
        result.evidence
      );
    }

    session.active = true;
    session.status = "ACTIVE";

    return result || { ok: true };
  })
  .catch(function rejected(error) {
    session.pendingOperationCount -= 1;
    record.async.pendingOperationCount -= 1;

    session.errors.push(
      String(
        error && error.message
          ? error.message
          : error
      )
    );

    return {
      ok: false,
      error: String(
        error && error.message
          ? error.message
          : error
      )
    };
  });

}

function resolveSurfaceBinding(
record,
role,
adapterId,
backend,
request
) {
var normalizedRole =
normalizeRole(role);

var auth =
  normalizedRole
    ? record.surfaces[
      normalizedRole.toLowerCase()
    ]
    : null;

if (!auth || !auth.active) {
  return {
    ok: false,
    code: "SURFACE_AUTHORIZATION_REQUIRED"
  };
}

if (
  auth.adapterId &&
  auth.adapterId !== adapterId
) {
  return {
    ok: false,
    code:
      "SURFACE_AUTHORIZATION_ADAPTER_MISMATCH"
  };
}

if (
  auth.contextKindsAuthorized.indexOf(
    backend
  ) === -1
) {
  return {
    ok: false,
    code: "BACKEND_CONTEXT_NOT_AUTHORIZED"
  };
}

var leaseId =
  request.leaseId ||
  record.surfaces.leaseBySurface[
    auth.surfaceIdentity
  ];

var lease =
  leaseId
    ? record.surfaces.leases[leaseId]
    : null;

if (!lease || !lease.active) {
  return {
    ok: false,
    code: "ACTIVE_SURFACE_LEASE_REQUIRED"
  };
}

if (lease.adapterId !== adapterId) {
  return {
    ok: false,
    code: "SURFACE_LEASE_ADAPTER_MISMATCH"
  };
}

if (lease.contextKind !== backend) {
  return {
    ok: false,
    code: "SURFACE_LEASE_CONTEXT_MISMATCH"
  };
}

var rect = readRect(auth.surface);

if (
  rect.width <= 0 ||
  rect.height <= 0
) {
  return {
    ok: false,
    code: "AUTHORIZED_SURFACE_ZERO"
  };
}

return {
  ok: true,
  auth: auth,
  lease: lease,
  rect: rect
};

}

function initializeInstance(
instanceId,
options
) {
var record = getRecord(instanceId, false);

if (!record) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "INSTANCE_NOT_FOUND"
    })
  );
}

var settings = isObject(options)
  ? options
  : {};

var adapterId =
  settings.adapterId ||
  record.adapters.rendererAdapterId ||
  null;

var adapter =
  adapterId
    ? stores.adapters[adapterId]
    : null;

if (
  !adapter ||
  adapter.kind !== ADAPTER_KIND.RENDERER
) {
  return Promise.resolve(
    enterHold(
      record,
      "RENDERER_ADAPTER_NOT_AVAILABLE",
      "INITIALIZE",
      "No compatible renderer adapter is registered.",
      ["renderer"]
    )
  );
}

if (
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] <
  PROGRESS_ORDER[PROGRESS.MOUNTED]
) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "INSTANCE_NOT_MOUNTED"
    })
  );
}

var backend =
  settings.backend || "WEBGL2";

if (
  record.specification.requiredBackends
    .indexOf(backend) === -1 &&
  record.specification.preferredBackends
    .indexOf(backend) === -1
) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "BACKEND_NOT_ALLOWED_BY_SPEC"
    })
  );
}

var binding = resolveSurfaceBinding(
  record,
  "PRIMARY",
  adapterId,
  backend,
  settings
);

if (!binding.ok) {
  return Promise.resolve(
    enterHold(
      record,
      binding.code,
      "INITIALIZE",
      "Renderer surface custody is incomplete.",
      [
        "surfaceAuthorization",
        "surfaceLease",
        "surfaceNonzero"
      ]
    )
  );
}

if (record.adapters.rendererSessionId) {
  invalidateSession(
    record,
    record.adapters.rendererSessionId,
    "RENDERER_SESSION_REPLACED"
  );
}

var session = createAdapterSession(
  record,
  adapter,
  {
    surfaceAuthorizationId:
      binding.auth.authorizationId,
    surfaceLeaseId:
      binding.lease.leaseId,
    targetId:
      binding.auth.targetId || null
  }
);

record.adapters.rendererAdapterId =
  adapter.adapterId;

record.adapters.rendererSessionId =
  session.sessionId;

record.renderer.selected = true;
record.renderer.adapterId =
  adapter.adapterId;
record.renderer.sessionId =
  session.sessionId;
record.renderer.requestedBackend =
  backend;
record.renderer.selectedBackend =
  backend;
record.renderer.backendAvailable =
  true;
record.renderer.initializationAttempted =
  true;

requestLifecycle(record, {
  executionMode: EXECUTION.PRIMARY,
  triggerType: "INITIALIZE",
  reason: "PRIMARY_SESSION_SELECTED"
});

var promise = callAdapterOperation(
  adapter,
  "initialize",
  record,
  session,
  settings
).then(function afterInitialize(result) {
  record.renderer.initializationResolved =
    true;

  if (!result || result.ok === false) {
    return enterBlockingError(
      record,
      "RENDERER_INITIALIZE_FAILED",
      "INITIALIZE",
      result && result.error
        ? result.error
        : "Renderer initialize failed."
    );
  }

  recomputeInstanceState(record);

  return deepFreeze({
    ok: true,
    status:
      record.proofs.current.rendererInitialized
        ? "INITIALIZED"
        : "AWAITING_RENDERER_INITIALIZED_EVIDENCE",
    sessionId: session.sessionId
  });
});

record.async.initializationPromise =
  promise;

return promise;

}

function attachInput(instanceId, options) {
var record = getRecord(instanceId, false);

if (!record) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "INSTANCE_NOT_FOUND"
    })
  );
}

var settings = isObject(options)
  ? options
  : {};

var adapterId =
  settings.adapterId ||
  record.adapters.inputAdapterId ||
  null;

var adapter =
  adapterId
    ? stores.adapters[adapterId]
    : null;

if (
  !adapter ||
  adapter.kind !== ADAPTER_KIND.INPUT
) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "INPUT_ADAPTER_NOT_AVAILABLE"
    })
  );
}

var targetAuthorizationId =
  settings.targetAuthorizationId ||
  (
    record.targets.input &&
    record.targets.input.authorizationId
  );

var target =
  targetAuthorizationId
    ? record.targets.authorizations[
      targetAuthorizationId
    ]
    : null;

if (!target || !target.active) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "TARGET_AUTHORIZATION_REQUIRED"
    })
  );
}

if (
  target.adapterId &&
  target.adapterId !== adapterId
) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "TARGET_AUTHORIZATION_ADAPTER_MISMATCH"
    })
  );
}

if (record.adapters.inputSessionId) {
  invalidateSession(
    record,
    record.adapters.inputSessionId,
    "INPUT_SESSION_REPLACED"
  );
}

var session = createAdapterSession(
  record,
  adapter,
  {
    targetAuthorizationId:
      target.authorizationId,
    targetId:
      target.targetIdentity
  }
);

record.adapters.inputAdapterId =
  adapter.adapterId;

record.adapters.inputSessionId =
  session.sessionId;

record.input.adapterId =
  adapter.adapterId;

record.input.sessionId =
  session.sessionId;

record.input.targetAuthorizationId =
  target.authorizationId;

return callAdapterOperation(
  adapter,
  "attach",
  record,
  session,
  settings
).then(function afterAttach(result) {
  if (!result || result.ok === false) {
    return enterBlockingError(
      record,
      "INPUT_ATTACH_FAILED",
      "INPUT",
      result && result.error
        ? result.error
        : "Input attach failed."
    );
  }

  recomputeInstanceState(record);

  return deepFreeze({
    ok: true,
    status:
      record.proofs.current.inputAttached
        ? "ATTACHED"
        : "AWAITING_INPUT_ATTACHED_EVIDENCE",
    sessionId: session.sessionId
  });
});

}

function evidencePrerequisiteSatisfied(
record,
token
) {
if (token in PROGRESS_ORDER) {
return (
PROGRESS_ORDER[
record.lifecycle.progressState
] >= PROGRESS_ORDER[token]
);
}

switch (token) {
  case "RENDERER_INITIALIZED":
    return record.proofs.current.rendererInitialized;
  case "RESOURCES_UPLOADED":
    return record.proofs.current.resourcesUploaded;
  case "FRAME_SUBMITTED":
    return record.proofs.current.frameSubmitted;
  case "FRAME_PRESENTED":
    return record.proofs.current.framePresented;
  case "INPUT_ATTACHED":
    return record.proofs.current.inputAttached;
  case "FALLBACK_AVAILABLE":
    return record.proofs.current.fallbackAvailable;
  case "FALLBACK_INITIALIZED":
    return record.proofs.current.fallbackInitialized;
  case "FALLBACK_REPRESENTATION_READY":
    return record.proofs.current.fallbackRepresentationReady;
  case "FALLBACK_OUTPUT_WRITTEN":
    return record.proofs.current.fallbackOutputWritten;
  case "FALLBACK_PRESENTATION_OBSERVED":
    return record.proofs.current.fallbackPresentationObserved;
  case "CONTEXT_LOST":
    return record.proofs.current.contextLost;
  default:
    return false;
}

}

function validateEvidenceEnvelope(
record,
evidence,
binding
) {
if (
evidence.schema &&
evidence.schema !== EVIDENCE_SCHEMA
) {
return {
ok: false,
code: "EVIDENCE_SCHEMA_MISMATCH"
};
}

var rule =
  EVIDENCE_RULES[evidence.evidenceType];

if (!rule) {
  return {
    ok: false,
    code: "EVIDENCE_TYPE_UNKNOWN"
  };
}

if (
  evidence.classification !==
  EVIDENCE_CLASSIFICATION.PRODUCTION
) {
  return {
    ok: false,
    code: "DIAGNOSTIC_EVIDENCE_NOT_GOVERNING"
  };
}

if (
  rule.kinds.indexOf(
    binding.adapterKind
  ) === -1
) {
  return {
    ok: false,
    code: "EVIDENCE_ADAPTER_KIND_FORBIDDEN"
  };
}

if (
  rule.valueType === "boolean" &&
  typeof evidence.value !== "boolean"
) {
  return {
    ok: false,
    code: "EVIDENCE_VALUE_TYPE_INVALID"
  };
}

var session = null;

if (rule.requiresSession) {
  session =
    binding.sessionId
      ? record.adapters.sessions[
        binding.sessionId
      ]
      : null;

  if (!session) {
    return {
      ok: false,
      code: "EVIDENCE_SESSION_REQUIRED"
    };
  }

  var sessionCheck =
    validateSessionBinding(
      record,
      session
    );

  if (!sessionCheck.ok) {
    return {
      ok: false,
      code: sessionCheck.code
    };
  }

  if (
    session.adapterId !==
    binding.adapterId
  ) {
    return {
      ok: false,
      code: "EVIDENCE_ADAPTER_SESSION_MISMATCH"
    };
  }
}

if (
  rule.requiresSurfaceAuthorization &&
  (
    !binding.authorizationId ||
    !session ||
    session.surfaceAuthorizationId !==
      binding.authorizationId
  )
) {
  return {
    ok: false,
    code: "EVIDENCE_SURFACE_AUTH_REQUIRED"
  };
}

if (
  rule.requiresSurfaceLease &&
  (
    !binding.leaseId ||
    !session ||
    session.surfaceLeaseId !==
      binding.leaseId
  )
) {
  return {
    ok: false,
    code: "EVIDENCE_SURFACE_LEASE_REQUIRED"
  };
}

if (
  rule.requiresTargetAuthorization &&
  (
    !binding.targetAuthorizationId ||
    !session ||
    session.targetAuthorizationId !==
      binding.targetAuthorizationId
  )
) {
  return {
    ok: false,
    code: "EVIDENCE_TARGET_AUTH_REQUIRED"
  };
}

if (
  rule.requiresFallbackSelection &&
  (
    !binding.selectionId ||
    !session ||
    session.selectionId !==
      binding.selectionId ||
    session.selectionGeneration !==
      binding.selectionGeneration ||
    record.fallback.selectionId !==
      binding.selectionId ||
    record.fallback.selectionGeneration !==
      binding.selectionGeneration
  )
) {
  return {
    ok: false,
    code: "EVIDENCE_FALLBACK_SELECTION_STALE"
  };
}

var deferred = rule.deferUntil.some(
  function some(token) {
    return !evidencePrerequisiteSatisfied(
      record,
      token
    );
  }
);

return {
  ok: true,
  deferred: deferred,
  rule: rule
};

}

function reportEvidence(
instanceId,
envelope,
binding
) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

if (
  record.lifecycle.progressState ===
  PROGRESS.DESTROYED
) {
  return deepFreeze({
    ok: false,
    code: "POST_DESTROY_EVIDENCE_REJECTED"
  });
}

if (
  stores.authorityStatus !== STATUS.READY
) {
  return deepFreeze({
    ok: false,
    code: "AUTHORITY_NOT_READY"
  });
}

var source = isObject(envelope)
  ? envelope
  : {};

var sourceBinding = isObject(binding)
  ? binding
  : {};

stores.sequences.evidence += 1;
record.evidence.sequence += 1;

var evidence = {
  schema: EVIDENCE_SCHEMA,
  evidenceId:
    "dgb-evidence-" +
    stores.sequences.evidence,
  instanceId:
    record.identity.instanceId,
  adapterId:
    sourceBinding.adapterId ||
    "UNKNOWN",
  adapterKind:
    sourceBinding.adapterKind ||
    "UNKNOWN",
  sessionId:
    sourceBinding.sessionId || null,
  authorizationId:
    sourceBinding.authorizationId || null,
  leaseId:
    sourceBinding.leaseId || null,
  targetAuthorizationId:
    sourceBinding.targetAuthorizationId ||
    null,
  selectionId:
    sourceBinding.selectionId || null,
  selectionGeneration:
    sourceBinding.selectionGeneration || 0,
  evidenceType:
    source.evidenceType || "UNKNOWN",
  value: source.value,
  stage:
    source.stage || "UNKNOWN",
  timestamp:
    source.timestamp || nowIso(),
  sequence:
    record.evidence.sequence,
  classification:
    source.classification ||
    EVIDENCE_CLASSIFICATION.UNKNOWN,
  details:
    cloneForInspection(
      source.details || {}
    ),
  receivedAt: nowIso(),
  disposition: "REJECTED",
  rejectionCode: null
};

var validation =
  validateEvidenceEnvelope(
    record,
    evidence,
    sourceBinding
  );

if (!validation.ok) {
  evidence.rejectionCode =
    validation.code;
  record.evidence.rejectedCount += 1;
  record.evidence.history.push(evidence);

  emit(
    "evidenceRejected",
    frozenInspection(evidence)
  );

  return frozenInspection({
    ok: false,
    evidence: evidence
  });
}

if (validation.deferred) {
  evidence.disposition =
    "ACCEPTED_DEFERRED";

  record.evidence.deferredCount += 1;
  record.evidence.pending.push(evidence);
} else {
  evidence.disposition =
    "ACCEPTED_GOVERNING";

  record.evidence.acceptedCount += 1;
  applyEvidence(
    record,
    evidence,
    validation.rule
  );
}

record.evidence.lastEvidenceId =
  evidence.evidenceId;

record.evidence.lastEvidenceAt =
  evidence.receivedAt;

if (
  !record.evidence.byType[
    evidence.evidenceType
  ]
) {
  record.evidence.byType[
    evidence.evidenceType
  ] = [];
}

record.evidence.byType[
  evidence.evidenceType
].push(evidence.evidenceId);

if (
  !record.evidence.byAdapter[
    evidence.adapterId
  ]
) {
  record.evidence.byAdapter[
    evidence.adapterId
  ] = [];
}

record.evidence.byAdapter[
  evidence.adapterId
].push(evidence.evidenceId);

record.evidence.history.push(evidence);
record.timestamps.updatedAt = nowIso();

processDeferredEvidence(record);
runPromotion(record);
recomputeInstanceState(record);

emit(
  "evidenceAccepted",
  frozenInspection(evidence)
);

return frozenInspection({
  ok: true,
  evidence: evidence
});

}

function applyEvidence(record, evidence, rule) {
var value = evidence.value;
var historical = record.proofs.historical;
var current = record.proofs.current;

switch (evidence.evidenceType) {
  case "SURFACE_NONZERO":
    if (value === true) {
      current.surfaceNonzero = true;

      if (
        evidence.adapterKind ===
        ADAPTER_KIND.RENDERER
      ) {
        record.renderer.surfaceNonzero = true;
      }

      if (
        evidence.adapterKind ===
        ADAPTER_KIND.FALLBACK
      ) {
        record.fallback.surfaceNonzero = true;
      }
    }
    break;

  case "SURFACE_ZERO":
    if (value === true) {
      current.surfaceNonzero = false;
      current.visible = false;
      current.fallbackVisible = false;
      record.renderer.surfaceNonzero = false;
      record.fallback.surfaceNonzero = false;
    }
    break;

  case "RENDERER_INITIALIZED":
    if (value === true) {
      historical.rendererInitialized = true;
      current.rendererInitialized = true;
      record.renderer.initialized = true;
      record.renderer.initializedAt = nowIso();
      record.timestamps.initializedAt = nowIso();

      var rendererSession =
        record.adapters.sessions[
          evidence.sessionId
        ];

      if (rendererSession) {
        rendererSession.initialized = true;
        rendererSession.initializedAt = nowIso();
      }
    }
    break;

  case "RESOURCES_UPLOADED":
    if (value === true) {
      historical.resourcesUploaded = true;
      current.resourcesUploaded = true;
      record.renderer.resourcesUploaded = true;
      record.timestamps.uploadedAt = nowIso();
    }
    break;

  case "FRAME_SUBMITTED":
    if (value === true) {
      historical.frameSubmitted = true;
      current.frameSubmitted = true;
      record.renderer.firstFrameSubmitted = true;
      record.metrics.frameCount += 1;
      record.timestamps.submittedAt = nowIso();
    }
    break;

  case "FRAME_PRESENTED":
    if (value === true) {
      historical.framePresented = true;
      current.framePresented = true;
      record.renderer.firstFramePresented = true;
      record.metrics.presentationCount += 1;
      record.timestamps.presentedAt = nowIso();
    }
    break;

  case "VISIBLE_PIXEL_OBSERVED":
    if (value === true) {
      historical.visible = true;
      current.visible = true;
      record.renderer.visiblePixelObserved = true;
      record.metrics.visibleObservationCount += 1;
      record.timestamps.visibleAt = nowIso();
    }
    break;

  case "INPUT_ATTACHED":
    if (value === true) {
      current.inputAttached = true;
      record.input.attached = true;
      record.input.enabled = true;
    }
    break;

  case "INPUT_DETACHED":
    if (value === true) {
      current.inputAttached = false;
      current.interactive = false;
      record.input.attached = false;
      record.input.enabled = false;
    }
    break;

  case "INTERACTION_OBSERVED":
    if (value === true) {
      historical.interactive = true;
      current.interactive = true;
      record.input.interactionObserved = true;
      record.input.acceptedEventCount += 1;
      record.metrics.interactionCount += 1;
      record.input.lastInteractionType =
        evidence.details &&
        evidence.details.type ||
        "UNKNOWN";
      record.input.lastInteractionAt = nowIso();
      record.timestamps.interactiveAt =
        record.input.lastInteractionAt;
    }
    break;

  case "FALLBACK_AVAILABLE":
    if (value === true) {
      historical.fallbackAvailable = true;
      current.fallbackAvailable = true;
      record.fallback.available = true;
    }
    break;

  case "FALLBACK_INITIALIZED":
    if (value === true) {
      historical.fallbackInitialized = true;
      current.fallbackInitialized = true;
      record.fallback.initialized = true;
    }
    break;

  case "FALLBACK_REPRESENTATION_READY":
    if (value === true) {
      historical.fallbackRepresentationReady = true;
      current.fallbackRepresentationReady = true;
      record.fallback.representationReady = true;
    }
    break;

  case "FALLBACK_OUTPUT_WRITTEN":
    if (value === true) {
      historical.fallbackOutputWritten = true;
      current.fallbackOutputWritten = true;
      record.fallback.outputWritten = true;
      record.metrics.fallbackRenderCount += 1;
    }
    break;

  case "FALLBACK_PRESENTATION_OBSERVED":
    if (value === true) {
      historical.fallbackPresentationObserved = true;
      current.fallbackPresentationObserved = true;
      record.fallback.presentationObserved = true;
      record.metrics.presentationCount += 1;
    }
    break;

  case "FALLBACK_VISIBLE_OUTPUT_OBSERVED":
    if (value === true) {
      historical.fallbackVisible = true;
      current.fallbackVisible = true;
      record.fallback.visibleOutputObserved = true;
      record.metrics.visibleObservationCount += 1;
    }
    break;

  case "CONTEXT_RECOVERY_AVAILABLE":
    if (value === true) {
      record.renderer.recoveryAvailable = true;
    }
    break;

  case "CONTEXT_LOST":
    if (value === true) {
      current.contextLost = true;
      current.rendererInitialized = false;
      current.resourcesUploaded = false;
      current.frameSubmitted = false;
      current.framePresented = false;
      current.visible = false;
      record.renderer.contextLost = true;
      record.timestamps.contextLostAt = nowIso();
      record.metrics.contextLossCount += 1;

      stopScheduler(
        record,
        "CONTEXT_LOST"
      );

      requestLifecycle(record, {
        conditionState:
          CONDITION.CONTEXT_LOST,
        executionMode:
          EXECUTION.NONE,
        triggerType: "EVIDENCE",
        triggerId:
          evidence.evidenceId,
        reason: "CONTEXT_LOST"
      });
    }
    break;

  case "RECOVERY_SUCCEEDED":
    if (value === true) {
      historical.recoverySucceeded = true;
      current.contextLost = false;
      record.renderer.contextLost = false;
      record.renderer.recoveryPending = false;
      record.renderer.recoverySucceeded = true;
      record.metrics.recoverySuccessCount += 1;

      requestLifecycle(record, {
        conditionState:
          CONDITION.NONE,
        executionMode:
          EXECUTION.PRIMARY,
        triggerType: "EVIDENCE",
        triggerId:
          evidence.evidenceId,
        reason: "RECOVERY_SUCCEEDED"
      });
    }
    break;

  case "SESSION_DETACHED":
    if (value === true) {
      invalidateSession(
        record,
        evidence.sessionId,
        "SESSION_DETACHED_EVIDENCE"
      );
    }
    break;

  case "TARGET_REVOKED":
    if (value === true) {
      current.targetValid = false;
      current.inputAttached = false;
      current.interactive = false;
    }
    break;

  case "AUTHORIZATION_REVOKED":
    if (value === true) {
      current.authorizationValid = false;
      current.visible = false;
      current.fallbackVisible = false;
    }
    break;

  case "RESOURCE_INVALIDATED":
    if (value === true) {
      current.resourcesValid = false;
      current.resourcesUploaded = false;
      current.frameSubmitted = false;
      current.framePresented = false;
      current.visible = false;
      current.fallbackRepresentationReady = false;
      current.fallbackOutputWritten = false;
      current.fallbackPresentationObserved = false;
      current.fallbackVisible = false;
    }
    break;

  case "BLOCKING_ERROR":
    enterBlockingError(
      record,
      "ADAPTER_BLOCKING_ERROR",
      evidence.stage,
      String(
        evidence.value ||
        "Blocking error"
      )
    );
    break;

  case "NONBLOCKING_WARNING":
    record.warnings.push({
      code: "ADAPTER_WARNING",
      message: String(
        evidence.value || "Warning"
      ),
      at: nowIso()
    });
    break;

  case "RENDERER_DISPOSED":
    if (value === true) {
      record.renderer.disposed = true;
    }
    break;

  case "INPUT_DISPOSED":
    if (value === true) {
      record.input.disposed = true;
    }
    break;

  case "FALLBACK_DISPOSED":
    if (value === true) {
      record.fallback.disposed = true;
    }
    break;

  default:
    break;
}

if (
  rule &&
  rule.monotonic &&
  value === false
) {
  return;
}

}

function processDeferredEvidence(record) {
if (!record.evidence.pending.length) {
return;
}

var remaining = [];
var progressed = true;
var safety = 0;

while (progressed && safety < 100) {
  progressed = false;
  safety += 1;

  var nextRound = [];

  record.evidence.pending.forEach(
    function each(evidence) {
      var rule =
        EVIDENCE_RULES[
          evidence.evidenceType
        ];

      var session =
        evidence.sessionId
          ? record.adapters.sessions[
            evidence.sessionId
          ]
          : null;

      if (
        rule.requiresSession &&
        (
          !session ||
          !sessionIsCurrent(
            record,
            session
          )
        )
      ) {
        evidence.disposition =
          "REJECTED_STALE_DEFERRED";

        evidence.rejectionCode =
          "DEFERRED_EVIDENCE_STALE";

        record.evidence.rejectedCount += 1;
        record.evidence.deferredCount -= 1;
        progressed = true;
        return;
      }

      var unmet = rule.deferUntil.some(
        function some(token) {
          return !evidencePrerequisiteSatisfied(
            record,
            token
          );
        }
      );

      if (unmet) {
        nextRound.push(evidence);
        return;
      }

      evidence.disposition =
        "ACCEPTED_GOVERNING";

      record.evidence.acceptedCount += 1;
      record.evidence.deferredCount -= 1;

      applyEvidence(
        record,
        evidence,
        rule
      );

      progressed = true;
    }
  );

  record.evidence.pending = nextRound;
}

remaining = record.evidence.pending;
record.evidence.pending = remaining;

}

function runPromotion(record) {
var current = record.proofs.current;

if (
  current.rendererInitialized &&
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] <
  PROGRESS_ORDER[PROGRESS.INITIALIZED]
) {
  requestLifecycle(record, {
    progressState:
      PROGRESS.INITIALIZED,
    executionMode:
      EXECUTION.PRIMARY,
    triggerType: "EVIDENCE",
    reason: "RENDERER_INITIALIZED"
  });
}

if (
  current.resourcesUploaded &&
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] <
  PROGRESS_ORDER[PROGRESS.UPLOADED]
) {
  requestLifecycle(record, {
    progressState:
      PROGRESS.UPLOADED,
    triggerType: "EVIDENCE",
    reason: "RESOURCES_UPLOADED"
  });
}

if (
  current.frameSubmitted &&
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] <
  PROGRESS_ORDER[PROGRESS.SUBMITTED]
) {
  requestLifecycle(record, {
    progressState:
      PROGRESS.SUBMITTED,
    triggerType: "EVIDENCE",
    reason: "FRAME_SUBMITTED"
  });
}

if (
  current.framePresented &&
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] <
  PROGRESS_ORDER[PROGRESS.PRESENTED]
) {
  requestLifecycle(record, {
    progressState:
      PROGRESS.PRESENTED,
    triggerType: "EVIDENCE",
    reason: "FRAME_PRESENTED"
  });
}

if (
  (
    current.visible ||
    current.fallbackVisible
  ) &&
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] <
  PROGRESS_ORDER[PROGRESS.VISIBLE]
) {
  requestLifecycle(record, {
    progressState:
      PROGRESS.VISIBLE,
    triggerType: "EVIDENCE",
    reason:
      current.visible
        ? "VISIBLE_PIXEL_OBSERVED"
        : "FALLBACK_VISIBLE_OUTPUT_OBSERVED"
  });
}

if (
  current.interactive &&
  record.specification.requiresInteraction &&
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] <
  PROGRESS_ORDER[PROGRESS.INTERACTIVE]
) {
  requestLifecycle(record, {
    progressState:
      PROGRESS.INTERACTIVE,
    triggerType: "EVIDENCE",
    reason: "INTERACTION_OBSERVED"
  });
}

recomputeInstanceState(record);

if (
  verificationAllowed(record) &&
  record.lifecycle.progressState !==
  PROGRESS.VERIFIED
) {
  requestLifecycle(record, {
    progressState:
      PROGRESS.VERIFIED,
    triggerType: "COMPARISON",
    reason:
      "GOVERNING_COMPARISON_READY"
  });
}

}

function acceptIntent(
instanceId,
envelope,
binding
) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

if (
  stores.authorityStatus !== STATUS.READY
) {
  return deepFreeze({
    ok: false,
    code: "AUTHORITY_NOT_READY"
  });
}

if (
  record.lifecycle.conditionState ===
    CONDITION.PAUSED ||
  record.lifecycle.conditionState ===
    CONDITION.HELD ||
  record.lifecycle.conditionState ===
    CONDITION.ERROR
) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_CONDITION_REJECTS_INTENT"
  });
}

var source = isObject(envelope)
  ? envelope
  : {};

var sourceBinding = isObject(binding)
  ? binding
  : {};

stores.sequences.intent += 1;
record.intents.sequence += 1;

var intent = {
  schema: INTENT_SCHEMA,
  intentId:
    "dgb-intent-" +
    stores.sequences.intent,
  instanceId:
    record.identity.instanceId,
  adapterId:
    sourceBinding.adapterId ||
    "UNKNOWN",
  adapterKind:
    sourceBinding.adapterKind ||
    "UNKNOWN",
  sessionId:
    sourceBinding.sessionId || null,
  targetAuthorizationId:
    sourceBinding.targetAuthorizationId ||
    null,
  intentType:
    source.intentType || "CUSTOM",
  phase:
    source.phase || "INSTANT",
  origin:
    cloneForInspection(
      source.origin || null
    ),
  delta:
    cloneForInspection(
      source.delta || null
    ),
  scale: source.scale,
  rotation:
    cloneForInspection(
      source.rotation || null
    ),
  selection:
    cloneForInspection(
      source.selection || null
    ),
  command: source.command || null,
  custom:
    cloneForInspection(
      source.custom || {}
    ),
  timestamp:
    source.timestamp || nowIso(),
  sequence:
    record.intents.sequence,
  classification:
    source.classification ||
    EVIDENCE_CLASSIFICATION.PRODUCTION,
  details:
    cloneForInspection(
      source.details || {}
    ),
  receivedAt: nowIso(),
  accepted: false,
  rejectionCode: null
};

if (
  source.schema &&
  source.schema !== INTENT_SCHEMA
) {
  intent.rejectionCode =
    "INTENT_SCHEMA_MISMATCH";
} else if (
  intent.classification !==
  EVIDENCE_CLASSIFICATION.PRODUCTION
) {
  intent.rejectionCode =
    "DIAGNOSTIC_INTENT_NOT_GOVERNING";
} else if (
  sourceBinding.adapterKind !==
  ADAPTER_KIND.INPUT
) {
  intent.rejectionCode =
    "INTENT_INPUT_ADAPTER_REQUIRED";
} else {
  var session =
    sourceBinding.sessionId
      ? record.adapters.sessions[
        sourceBinding.sessionId
      ]
      : null;

  var sessionCheck =
    session
      ? validateSessionBinding(
        record,
        session
      )
      : {
        ok: false,
        code: "INTENT_SESSION_REQUIRED"
      };

  if (!sessionCheck.ok) {
    intent.rejectionCode =
      sessionCheck.code;
  } else if (
    record.adapters.inputSessionId !==
    session.sessionId
  ) {
    intent.rejectionCode =
      "INTENT_SESSION_NOT_CURRENT";
  } else {
    var target =
      record.targets.authorizations[
        session.targetAuthorizationId
      ];

    if (!target || !target.active) {
      intent.rejectionCode =
        "INTENT_TARGET_AUTH_INVALID";
    } else if (
      target.permittedCapabilities.length &&
      target.permittedCapabilities
        .indexOf(intent.intentType) === -1
    ) {
      intent.rejectionCode =
        "INTENT_CAPABILITY_NOT_PERMITTED";
    }
  }
}

if (intent.rejectionCode) {
  record.intents.rejectedCount += 1;
  record.intents.history.push(intent);

  return frozenInspection({
    ok: false,
    intent: intent
  });
}

applyIntent(record, intent);

intent.accepted = true;
record.intents.acceptedCount += 1;
record.intents.lastIntentId =
  intent.intentId;
record.intents.lastIntentAt =
  intent.receivedAt;
record.intents.history.push(intent);

emit(
  "intentAccepted",
  frozenInspection(intent)
);

return frozenInspection({
  ok: true,
  intent: intent
});

}

function applyIntent(record, intent) {
var control = record.runtimeControl;

control.revision += 1;
control.lastIntentId = intent.intentId;
control.lastIntentAt = intent.receivedAt;

if (
  intent.intentType === "ROTATE" &&
  isObject(intent.delta)
) {
  control.rotation.x +=
    Number(intent.delta.x) || 0;
  control.rotation.y +=
    Number(intent.delta.y) || 0;
  control.rotation.z +=
    Number(intent.delta.z) || 0;
}

if (
  intent.intentType === "PAN" &&
  isObject(intent.delta)
) {
  control.pan.x +=
    Number(intent.delta.x) || 0;
  control.pan.y +=
    Number(intent.delta.y) || 0;
}

if (intent.intentType === "ZOOM") {
  control.zoom *=
    Number(intent.scale) || 1;
}

if (intent.intentType === "SELECT") {
  control.selection =
    cloneForInspection(
      intent.selection
    );
}

if (intent.intentType === "RESET_VIEW") {
  control.rotation = {
    x: 0,
    y: 0,
    z: 0
  };

  control.pan = {
    x: 0,
    y: 0
  };

  control.zoom = 1;
}

if (intent.intentType === "CUSTOM") {
  control.custom = Object.assign(
    {},
    control.custom,
    intent.custom || {}
  );
}

}

function enterHold(
record,
code,
stage,
message,
missingEvidence
) {
record.hold.active = true;
record.hold.code = code;
record.hold.stage = stage;
record.hold.message = message;
record.hold.missingEvidence =
Array.isArray(missingEvidence)
? missingEvidence.slice()
: [];
record.hold.startedAt =
record.hold.startedAt || nowIso();
record.hold.resumeProgressState =
record.lifecycle.progressState;
record.timestamps.heldAt = nowIso();

requestLifecycle(record, {
  conditionState: CONDITION.HELD,
  triggerType: "HOLD",
  reason: code,
  missingEvidence:
    record.hold.missingEvidence
});

return deepFreeze({
  ok: false,
  status: "HELD",
  code: code,
  message: message
});

}

function resolveHold(record) {
if (!record.hold.active) {
return deepFreeze({
ok: true,
status: "NO_ACTIVE_HOLD"
});
}

record.hold.active = false;
record.hold.resolvedAt = nowIso();

if (
  record.lifecycle.conditionState ===
  CONDITION.HELD
) {
  requestLifecycle(record, {
    conditionState: CONDITION.NONE,
    triggerType: "HOLD",
    reason: "HOLD_RESOLVED"
  });
}

return deepFreeze({
  ok: true,
  status: "HOLD_RESOLVED"
});

}

function enterBlockingError(
record,
code,
stage,
message,
details
) {
record.blockingError.active = true;
record.blockingError.code = code;
record.blockingError.stage = stage;
record.blockingError.message = message;
record.blockingError.startedAt = nowIso();
record.blockingError.details =
cloneForInspection(details || null);

record.errors.push({
  code: code,
  stage: stage,
  message: message,
  at: nowIso(),
  details:
    cloneForInspection(details || null)
});

stopScheduler(
  record,
  "BLOCKING_ERROR"
);

requestLifecycle(record, {
  conditionState: CONDITION.ERROR,
  executionMode: EXECUTION.NONE,
  triggerType: "ERROR",
  reason: code
});

emit("error", {
  instanceId:
    record.identity.instanceId,
  code: code,
  message: message
});

return deepFreeze({
  ok: false,
  status: "ERROR",
  code: code,
  message: message
});

}

function invalidateSession(
record,
sessionId,
reason
) {
var session =
record.adapters.sessions[sessionId];

if (!session) return;

session.stale = true;
session.callbacksValid = false;
session.active = false;
session.detached = true;
session.detachedAt =
  session.detachedAt || nowIso();
session.status = "STALE";
session.warnings.push(
  reason || "SESSION_INVALIDATED"
);

}

function invalidateSessionsForAuthorization(
record,
authorizationId,
reason
) {
Object.keys(
record.adapters.sessions
).forEach(function each(sessionId) {
var session =
record.adapters.sessions[sessionId];

  if (
    session.surfaceAuthorizationId ===
    authorizationId
  ) {
    invalidateSession(
      record,
      sessionId,
      reason
    );
  }
});

}

function invalidateSessionsForLease(
record,
leaseId,
reason
) {
Object.keys(
record.adapters.sessions
).forEach(function each(sessionId) {
var session =
record.adapters.sessions[sessionId];

  if (
    session.surfaceLeaseId === leaseId
  ) {
    invalidateSession(
      record,
      sessionId,
      reason
    );
  }
});

}

function invalidateSessionsForTarget(
record,
targetAuthorizationId,
reason
) {
Object.keys(
record.adapters.sessions
).forEach(function each(sessionId) {
var session =
record.adapters.sessions[sessionId];

  if (
    session.targetAuthorizationId ===
    targetAuthorizationId
  ) {
    invalidateSession(
      record,
      sessionId,
      reason
    );
  }
});

}

function pauseInstance(instanceId, reason) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

if (
  record.lifecycle.conditionState ===
  CONDITION.ERROR
) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_ERROR"
  });
}

if (
  record.lifecycle.conditionState ===
  CONDITION.PAUSED
) {
  return deepFreeze({
    ok: true,
    code: "ALREADY_PAUSED"
  });
}

record.lifecycle.resumeProgressState =
  record.lifecycle.progressState;

record.timestamps.pausedAt = nowIso();
record.metrics.pauseCount += 1;

stopScheduler(
  record,
  reason || "PAUSE"
);

requestLifecycle(record, {
  conditionState: CONDITION.PAUSED,
  triggerType: "CONTROL",
  reason: reason || "PAUSE"
});

return deepFreeze({
  ok: true,
  status: "PAUSED"
});

}

function resumeInstance(instanceId) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

if (
  record.lifecycle.conditionState !==
  CONDITION.PAUSED
) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_PAUSED"
  });
}

if (record.blockingError.active) {
  return deepFreeze({
    ok: false,
    code: "BLOCKING_ERROR_ACTIVE"
  });
}

record.timestamps.resumedAt = nowIso();
record.metrics.resumeCount += 1;

requestLifecycle(record, {
  conditionState: CONDITION.NONE,
  triggerType: "CONTROL",
  reason: "RESUME"
});

return deepFreeze({
  ok: true,
  status: "RESUMED"
});

}

function stopInstance(instanceId, reason) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

return stopScheduler(
  record,
  reason || "EXPLICIT_STOP"
);

}

function recoverInstance(instanceId) {
var record = getRecord(instanceId, false);

if (!record) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "INSTANCE_NOT_FOUND"
    })
  );
}

if (
  record.lifecycle.conditionState !==
  CONDITION.CONTEXT_LOST
) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "CONTEXT_LOSS_NOT_ACTIVE"
    })
  );
}

if (!record.renderer.recoveryAvailable) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "RECOVERY_NOT_AVAILABLE"
    })
  );
}

var session =
  record.adapters.sessions[
    record.adapters.rendererSessionId
  ];

var adapter =
  session
    ? stores.adapters[session.adapterId]
    : null;

if (
  !adapter ||
  !isFunction(adapter.operations.recover)
) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "RECOVERY_OPERATION_NOT_AVAILABLE"
    })
  );
}

record.renderer.recoveryPending = true;
record.metrics.recoveryAttemptCount += 1;

requestLifecycle(record, {
  conditionState: CONDITION.RECOVERING,
  executionMode: EXECUTION.TRANSITION,
  triggerType: "RECOVERY",
  reason: "RECOVERY_STARTED"
});

var promise = callAdapterOperation(
  adapter,
  "recover",
  record,
  session,
  {}
).then(function afterRecover(result) {
  if (!result || result.ok === false) {
    record.renderer.recoveryPending = false;

    return enterBlockingError(
      record,
      "RECOVERY_FAILED",
      "RECOVERY",
      result && result.error
        ? result.error
        : "Recovery failed."
    );
  }

  recomputeInstanceState(record);

  return deepFreeze({
    ok: true,
    status:
      record.renderer.recoverySucceeded
        ? "RECOVERED"
        : "AWAITING_RECOVERY_SUCCEEDED_EVIDENCE"
  });
});

record.async.recoveryPromise = promise;

return promise;

}

function selectFallback(instanceId, request) {
var record = getRecord(instanceId, false);

if (!record) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "INSTANCE_NOT_FOUND"
    })
  );
}

if (!record.fallback.permitted) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "FALLBACK_NOT_PERMITTED"
    })
  );
}

var settings = isObject(request)
  ? request
  : {};

var adapterId =
  settings.adapterId ||
  record.adapters.fallbackAdapterId ||
  null;

var adapter =
  adapterId
    ? stores.adapters[adapterId]
    : null;

if (
  !adapter ||
  adapter.kind !== ADAPTER_KIND.FALLBACK
) {
  return Promise.resolve(
    enterHold(
      record,
      "FALLBACK_ADAPTER_NOT_AVAILABLE",
      "FALLBACK",
      "No compatible fallback adapter is registered.",
      ["fallback"]
    )
  );
}

var fallbackType =
  settings.fallbackType || "CANVAS2D";

if (
  record.specification.fallbackBackends
    .indexOf(fallbackType) === -1
) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "FALLBACK_TYPE_NOT_ALLOWED_BY_SPEC"
    })
  );
}

var binding = resolveSurfaceBinding(
  record,
  "FALLBACK",
  adapterId,
  fallbackType,
  settings
);

if (!binding.ok) {
  return Promise.resolve(
    enterHold(
      record,
      binding.code,
      "FALLBACK",
      "Fallback surface custody is incomplete.",
      [
        "fallbackSurfaceAuthorization",
        "fallbackSurfaceLease"
      ]
    )
  );
}

if (record.adapters.fallbackSessionId) {
  invalidateSession(
    record,
    record.adapters.fallbackSessionId,
    "FALLBACK_SELECTION_RETIRED"
  );
}

stores.sequences.fallbackSelection += 1;

var selectionId =
  "fallback-selection-" +
  stores.sequences.fallbackSelection +
  "-" +
  hash({
    instanceId: instanceId,
    generation:
      stores.sequences.fallbackSelection
  }).replace("fnv1a32-", "");

record.fallback.selected = true;
record.fallback.adapterId = adapterId;
record.fallback.fallbackType = fallbackType;
record.fallback.selectionGeneration += 1;
record.fallback.selectionId = selectionId;
record.fallback.selectionReason =
  settings.reason || "REQUESTED";
record.fallback.priorBackend =
  record.renderer.selectedBackend;
record.fallback.surfaceAuthorizationId =
  binding.auth.authorizationId;
record.fallback.surfaceLeaseId =
  binding.lease.leaseId;
record.timestamps.fallbackSelectedAt =
  nowIso();

var session = createAdapterSession(
  record,
  adapter,
  {
    surfaceAuthorizationId:
      binding.auth.authorizationId,
    surfaceLeaseId:
      binding.lease.leaseId,
    selectionId: selectionId,
    selectionGeneration:
      record.fallback.selectionGeneration
  }
);

record.adapters.fallbackAdapterId =
  adapterId;
record.adapters.fallbackSessionId =
  session.sessionId;
record.fallback.sessionId =
  session.sessionId;

stopScheduler(
  record,
  "FALLBACK_SELECTION"
);

requestLifecycle(record, {
  executionMode: EXECUTION.TRANSITION,
  triggerType: "FALLBACK",
  reason: "FALLBACK_SELECTION_STARTED"
});

emit("fallbackSelected", {
  instanceId: instanceId,
  selectionId: selectionId
});

return callAdapterOperation(
  adapter,
  "initialize",
  record,
  session,
  settings
).then(function afterFallbackInitialize(result) {
  if (!result || result.ok === false) {
    return enterBlockingError(
      record,
      "FALLBACK_INITIALIZE_FAILED",
      "FALLBACK",
      result && result.error
        ? result.error
        : "Fallback initialize failed."
    );
  }

  if (
    record.proofs.current.fallbackInitialized &&
    record.proofs.current.fallbackRepresentationReady
  ) {
    requestLifecycle(record, {
      conditionState: CONDITION.FALLBACK,
      executionMode: EXECUTION.FALLBACK,
      triggerType: "FALLBACK",
      reason: "FALLBACK_READY"
    });
  }

  recomputeInstanceState(record);

  return deepFreeze({
    ok: true,
    status:
      record.lifecycle.executionMode ===
      EXECUTION.FALLBACK
        ? "FALLBACK_ACTIVE"
        : "AWAITING_FALLBACK_EVIDENCE",
    selectionId: selectionId,
    sessionId: session.sessionId
  });
});

}

function preparePrimaryRecovery(
instanceId,
request
) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

stopScheduler(
  record,
  "PRIMARY_RECOVERY_PREPARED"
);

requestLifecycle(record, {
  executionMode: EXECUTION.TRANSITION,
  triggerType: "RECOVERY",
  reason:
    request && request.reason ||
    "PRIMARY_RECOVERY_PREPARED"
});

return deepFreeze({
  ok: true,
  status:
    "PRIMARY_RECOVERY_PREPARED"
});

}

function computeEligibility(record) {
var live =
record.lifecycle.progressState !==
PROGRESS.DESTROYED;

var noBlock =
  !record.blockingError.active;

var notHeld =
  record.lifecycle.conditionState !==
  CONDITION.HELD;

var notError =
  record.lifecycle.conditionState !==
  CONDITION.ERROR;

var notContextLost =
  record.lifecycle.conditionState !==
  CONDITION.CONTEXT_LOST;

var snapshot = {
  create:
    stores.authorityStatus ===
    STATUS.READY,

  mount:
    live &&
    record.lifecycle.progressState ===
    PROGRESS.CREATED,

  authorizePrimarySurface:
    live,

  authorizeFallbackSurface:
    live &&
    record.fallback.permitted,

  authorizeInputTarget:
    live &&
    record.input.required,

  initializePrimary:
    live &&
    PROGRESS_ORDER[
      record.lifecycle.progressState
    ] >=
    PROGRESS_ORDER[PROGRESS.MOUNTED] &&
    noBlock,

  initializeFallback:
    live &&
    record.fallback.permitted &&
    noBlock,

  upload:
    live &&
    record.proofs.current.rendererInitialized &&
    noBlock,

  start:
    live &&
    (
      record.proofs.current.resourcesUploaded ||
      record.proofs.current.fallbackRepresentationReady
    ) &&
    notHeld &&
    notError &&
    notContextLost &&
    noBlock,

  renderOnce:
    live &&
    (
      record.lifecycle.executionMode ===
        EXECUTION.PRIMARY ||
      record.lifecycle.executionMode ===
        EXECUTION.FALLBACK
    ) &&
    notHeld &&
    notError &&
    notContextLost &&
    noBlock,

  attachInput:
    live &&
    record.input.required &&
    PROGRESS_ORDER[
      record.lifecycle.progressState
    ] >=
    PROGRESS_ORDER[PROGRESS.MOUNTED],

  acceptInteraction:
    live &&
    record.proofs.current.inputAttached &&
    record.input.enabled &&
    record.lifecycle.conditionState !==
      CONDITION.PAUSED &&
    notHeld &&
    notError,

  selectFallback:
    live &&
    record.fallback.permitted &&
    noBlock,

  pause:
    live &&
    record.lifecycle.conditionState !==
      CONDITION.ERROR &&
    record.lifecycle.conditionState !==
      CONDITION.PAUSED,

  resume:
    live &&
    record.lifecycle.conditionState ===
      CONDITION.PAUSED &&
    noBlock,

  stop:
    live &&
    record.scheduler.active,

  recover:
    live &&
    record.lifecycle.conditionState ===
      CONDITION.CONTEXT_LOST &&
    record.renderer.recoveryAvailable &&
    !record.renderer.recoveryPending,

  verify:
    live &&
    verificationAllowed(record),

  destroy: live,

  reasons: {},
  computedAt: nowIso()
};

record.eligibility.lastComputedAt =
  snapshot.computedAt;

record.eligibility.snapshot =
  deepFreeze(
    cloneForInspection(snapshot)
  );

return record.eligibility.snapshot;

}

function renderInstanceOnce(
instanceId,
options
) {
var record = getRecord(instanceId, false);

if (!record) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "INSTANCE_NOT_FOUND"
    })
  );
}

if (
  record.lifecycle.executionMode !==
    EXECUTION.PRIMARY &&
  record.lifecycle.executionMode !==
    EXECUTION.FALLBACK
) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "NO_ACTIVE_VISUAL_PATH"
    })
  );
}

var sessionId =
  record.lifecycle.executionMode ===
  EXECUTION.PRIMARY
    ? record.adapters.rendererSessionId
    : record.adapters.fallbackSessionId;

var session =
  record.adapters.sessions[sessionId];

if (!session) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "VISUAL_SESSION_NOT_FOUND"
    })
  );
}

var adapter =
  stores.adapters[session.adapterId];

if (!adapter) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "VISUAL_ADAPTER_NOT_FOUND"
    })
  );
}

var method;

if (
  isFunction(adapter.operations.renderOnce)
) {
  method = "renderOnce";
} else if (
  isFunction(adapter.operations.render)
) {
  method = "render";
} else if (
  isFunction(
    adapter.operations.submitFrame
  )
) {
  method = "submitFrame";
} else {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "RENDER_OPERATION_NOT_AVAILABLE"
    })
  );
}

return callAdapterOperation(
  adapter,
  method,
  record,
  session,
  options || {}
).then(function afterRender(result) {
  if (!result || result.ok === false) {
    return deepFreeze({
      ok: false,
      code: "RENDER_OPERATION_FAILED",
      error:
        result && result.error || null
    });
  }

  return deepFreeze({
    ok: true,
    result:
      cloneForInspection(result)
  });
});

}

function startInstance(instanceId) {
var record = getRecord(instanceId, false);

if (!record) {
  return deepFreeze({
    ok: false,
    code: "INSTANCE_NOT_FOUND"
  });
}

return startScheduler(record);

}

function startScheduler(record) {
if (record.scheduler.active) {
return deepFreeze({
ok: true,
code: "SCHEDULER_ALREADY_ACTIVE"
});
}

var eligibility =
  computeEligibility(record);

if (!eligibility.start) {
  return deepFreeze({
    ok: false,
    code: "SCHEDULER_NOT_ELIGIBLE",
    eligibility: eligibility
  });
}

if (
  !isFunction(root.requestAnimationFrame)
) {
  return deepFreeze({
    ok: false,
    code: "REQUEST_ANIMATION_FRAME_UNAVAILABLE"
  });
}

record.scheduler.status = "ACTIVE";
record.scheduler.active = true;
record.scheduler.startedAt = nowIso();
record.scheduler.stopReason = null;
record.scheduler.frameGeneration += 1;

var generation =
  record.scheduler.frameGeneration;

function scheduleNext() {
  if (
    !record.scheduler.active ||
    generation !==
      record.scheduler.frameGeneration
  ) {
    return;
  }

  record.scheduler.requestId =
    root.requestAnimationFrame(tick);
}

function tick(timestamp) {
  if (
    !record.scheduler.active ||
    record.lifecycle.progressState ===
      PROGRESS.DESTROYED ||
    generation !==
      record.scheduler.frameGeneration
  ) {
    record.scheduler.callbackActive = false;
    return;
  }

  if (
    record.scheduler.pendingFrameOperation
  ) {
    scheduleNext();
    return;
  }

  record.scheduler.callbackActive = true;
  record.scheduler.frameSequence += 1;

  record.scheduler.lastDeltaTime =
    record.scheduler.lastTimestamp === null
      ? 0
      : Number(timestamp) -
        Number(
          record.scheduler.lastTimestamp
        );

  record.scheduler.lastTimestamp = timestamp;

  var sessionId =
    record.lifecycle.executionMode ===
    EXECUTION.FALLBACK
      ? record.adapters.fallbackSessionId
      : record.adapters.rendererSessionId;

  var session =
    record.adapters.sessions[sessionId];

  var adapter =
    session
      ? stores.adapters[
        session.adapterId
      ]
      : null;

  if (!session || !adapter) {
    stopScheduler(
      record,
      "SCHEDULER_SESSION_UNAVAILABLE"
    );

    enterHold(
      record,
      "SCHEDULER_SESSION_UNAVAILABLE",
      "SCHEDULER",
      "No active visual session exists.",
      ["visualSession"]
    );

    return;
  }

  var method =
    isFunction(adapter.operations.render)
      ? "render"
      : isFunction(
        adapter.operations.renderOnce
      )
        ? "renderOnce"
        : isFunction(
          adapter.operations.submitFrame
        )
          ? "submitFrame"
          : null;

  if (!method) {
    stopScheduler(
      record,
      "SCHEDULER_RENDER_OPERATION_UNAVAILABLE"
    );

    enterHold(
      record,
      "SCHEDULER_RENDER_OPERATION_UNAVAILABLE",
      "SCHEDULER",
      "Adapter has no render operation.",
      ["renderOperation"]
    );

    return;
  }

  record.scheduler.pendingFrameSessionId =
    session.sessionId;

  record.scheduler.pendingFrameOperation =
    callAdapterOperation(
      adapter,
      method,
      record,
      session,
      {
        timestamp: timestamp,
        deltaTime:
          record.scheduler.lastDeltaTime,
        frameSequence:
          record.scheduler.frameSequence
      }
    )
      .then(function frameResolved(result) {
        if (
          generation !==
            record.scheduler.frameGeneration ||
          !record.scheduler.active
        ) {
          return;
        }

        if (!result || result.ok === false) {
          stopScheduler(
            record,
            "FRAME_OPERATION_FAILED"
          );

          enterBlockingError(
            record,
            "FRAME_OPERATION_FAILED",
            "SCHEDULER",
            result && result.error
              ? result.error
              : "Frame operation failed."
          );
        }
      })
      .catch(function frameRejected(error) {
        stopScheduler(
          record,
          "FRAME_OPERATION_REJECTED"
        );

        enterBlockingError(
          record,
          "FRAME_OPERATION_REJECTED",
          "SCHEDULER",
          String(
            error && error.message
              ? error.message
              : error
          )
        );
      })
      .then(function frameComplete() {
        record.scheduler.pendingFrameOperation =
          null;

        record.scheduler.pendingFrameSessionId =
          null;

        if (
          record.scheduler.active &&
          generation ===
            record.scheduler.frameGeneration
        ) {
          scheduleNext();
        }
      });
}

scheduleNext();

emit("schedulerStarted", {
  instanceId:
    record.identity.instanceId
});

return deepFreeze({
  ok: true,
  status: "STARTED"
});

}

function stopScheduler(record, reason) {
record.scheduler.frameGeneration += 1;

if (
  record.scheduler.requestId !== null &&
  isFunction(root.cancelAnimationFrame)
) {
  try {
    root.cancelAnimationFrame(
      record.scheduler.requestId
    );
  } catch (_error) {}
}

record.scheduler.status = "STOPPED";
record.scheduler.active = false;
record.scheduler.requestId = null;
record.scheduler.stoppedAt = nowIso();
record.scheduler.stopReason =
  reason || "STOPPED";
record.scheduler.callbackActive = false;

emit("schedulerStopped", {
  instanceId:
    record.identity.instanceId,
  reason:
    record.scheduler.stopReason
});

return deepFreeze({
  ok: true,
  status: "STOPPED",
  reason:
    record.scheduler.stopReason
});

}

function performSessionCleanup(
record,
session,
adapter
) {
var tasks = [];

session.disposing = true;
session.callbacksValid = false;
session.active = false;

if (
  isFunction(adapter.operations.pause)
) {
  tasks.push(
    callAdapterOperation(
      adapter,
      "pause",
      record,
      session,
      { reason: "DESTROY" }
    )
  );
}

if (
  session.adapterKind ===
    ADAPTER_KIND.INPUT &&
  isFunction(adapter.operations.detach)
) {
  tasks.push(
    callAdapterOperation(
      adapter,
      "detach",
      record,
      session,
      { reason: "DESTROY" }
    )
  );
}

if (
  isFunction(adapter.operations.dispose)
) {
  tasks.push(
    callAdapterOperation(
      adapter,
      "dispose",
      record,
      session,
      { reason: "DESTROY" }
    )
  );
}

return promiseAllSettled(tasks).then(
  function afterCleanup(results) {
    var success = results.every(
      function every(result) {
        return (
          result.status === "fulfilled" &&
          (
            !result.value ||
            result.value.ok !== false
          )
        );
      }
    );

    session.detached = true;
    session.detachedAt = nowIso();
    session.disposed = success;
    session.disposedAt =
      success ? nowIso() : null;
    session.status =
      success ? "DISPOSED" : "DISPOSAL_FAILED";

    record.disposal.attempts.push({
      sessionId: session.sessionId,
      adapterId: adapter.adapterId,
      adapterKind:
        session.adapterKind,
      success: success,
      results:
        cloneForInspection(results),
      completedAt: nowIso()
    });

    if (
      session.adapterKind ===
      ADAPTER_KIND.INPUT
    ) {
      record.disposal.inputDetached =
        success;
      record.disposal.inputDisposed =
        success;
    }

    if (
      session.adapterKind ===
      ADAPTER_KIND.RENDERER
    ) {
      record.disposal.rendererDisposed =
        success;
    }

    if (
      session.adapterKind ===
      ADAPTER_KIND.FALLBACK
    ) {
      record.disposal.fallbackDisposed =
        success;
    }

    if (!success) {
      record.disposal.errors.push({
        code:
          "SESSION_DISPOSAL_INCOMPLETE",
        sessionId: session.sessionId
      });
    }

    return success;
  }
);

}

function createTombstone(record) {
var terminalInspection =
frozenInspection({
found: true,
schema: record.schema,
identity: record.identity,
authority: record.authority,
admission: record.admission,
resources: record.resources,
specification:
record.specification,
lifecycle: record.lifecycle,
hold: record.hold,
blockingError:
record.blockingError,
ops: record.ops,
mount: record.mount,
surfaces: record.surfaces,
targets: record.targets,
renderer: record.renderer,
input: record.input,
fallback: record.fallback,
runtimeControl:
record.runtimeControl,
scheduler: record.scheduler,
proofs: record.proofs,
evidence: record.evidence,
intents: record.intents,
transitions:
record.transitions,
errors: record.errors,
warnings: record.warnings,
metrics: record.metrics,
eligibility:
record.eligibility.snapshot,
timestamps: record.timestamps,
disposal: record.disposal
});

return deepFreeze({
  identity:
    frozenInspection(record.identity),
  lifecycle:
    frozenInspection(record.lifecycle),
  terminalSpec:
    frozenInspection(
      record.specification.spec
    ),
  terminalOps:
    frozenInspection(
      record.ops.snapshot
    ),
  terminalComparison:
    frozenInspection(
      record.ops.comparison
    ),
  terminalReceipt:
    frozenInspection(
      record.ops.receipt
    ),
  terminalSessions:
    frozenInspection(
      record.adapters.sessions
    ),
  terminalInspection:
    terminalInspection
});

}

function destroyInstance(
instanceId,
options
) {
if (stores.tombstones[instanceId]) {
stores.tombstoneRepeatCounts[
instanceId
] =
Number(
stores.tombstoneRepeatCounts[
instanceId
] || 0
) + 1;

  return Promise.resolve(
    deepFreeze({
      ok: true,
      status: "ALREADY_DESTROYED",
      tombstone:
        stores.tombstones[
          instanceId
        ].terminalInspection,
      repeatCount:
        stores.tombstoneRepeatCounts[
          instanceId
        ]
    })
  );
}

var record = stores.instances[instanceId];

if (!record) {
  return Promise.resolve(
    deepFreeze({
      ok: false,
      code: "INSTANCE_NOT_FOUND"
    })
  );
}

if (record.async.disposalPromise) {
  return record.async.disposalPromise;
}

record.disposal.requested = true;
record.disposal.started = true;
record.metrics.disposalCount += 1;

requestLifecycle(record, {
  executionMode: EXECUTION.DISPOSING,
  triggerType: "DISPOSAL",
  reason:
    options && options.reason ||
    "DESTROY_INSTANCE"
});

stopScheduler(record, "DESTROY");
record.disposal.schedulerStopped = true;

Object.keys(
  record.adapters.sessions
).forEach(function each(sessionId) {
  record.adapters.sessions[
    sessionId
  ].callbacksValid = false;
});

record.disposal.callbacksCleared = true;

var cleanupTasks = [];

Object.keys(
  record.adapters.sessions
).forEach(function each(sessionId) {
  var session =
    record.adapters.sessions[sessionId];

  var adapter =
    stores.adapters[
      session.adapterId
    ];

  if (adapter) {
    cleanupTasks.push(
      performSessionCleanup(
        record,
        session,
        adapter
      )
    );
  } else {
    session.stale = true;
    session.active = false;
    session.callbacksValid = false;
    session.status =
      "ADAPTER_MISSING_DURING_DISPOSAL";

    record.disposal.errors.push({
      code:
        "ADAPTER_MISSING_DURING_DISPOSAL",
      sessionId: sessionId
    });
  }
});

var disposalPromise =
  promiseAllSettled(cleanupTasks)
    .then(function afterSessions() {
      Object.keys(
        record.surfaces.leases
      ).forEach(function each(leaseId) {
        var lease =
          record.surfaces.leases[
            leaseId
          ];

        if (lease.active) {
          lease.active = false;
          lease.releasedAt = nowIso();
          lease.releaseReason =
            "DESTROY";
        }
      });

      record.surfaces.leaseBySurface =
        Object.create(null);

      ["primary", "fallback", "diagnostic"]
        .forEach(function each(role) {
          var auth =
            record.surfaces[role];

          if (auth && auth.active) {
            auth.active = false;
            auth.revokedAt = nowIso();
          }
        });

      Object.keys(
        record.targets.authorizations
      ).forEach(
        function each(authorizationId) {
          var auth =
            record.targets.authorizations[
              authorizationId
            ];

          if (auth.active) {
            auth.active = false;
            auth.revokedAt = nowIso();
          }
        }
      );

      if (
        record.mount.observer &&
        isFunction(
          record.mount.observer.disconnect
        )
      ) {
        try {
          record.mount.observer.disconnect();
          record.disposal.observersDisconnected =
            true;
        } catch (error) {
          record.disposal.errors.push({
            code:
              "OBSERVER_DISCONNECT_FAILED",
            message:
              String(
                error && error.message
                  ? error.message
                  : error
              )
          });
        }
      } else {
        record.disposal.observersDisconnected =
          !record.mount.observerActive;
      }

      if (
        record.resources.custody ===
        CUSTODY.COPIED_BY_ENGINE
      ) {
        record.resources.released = true;
        record.disposal.copiedBuffersReleased =
          true;
      }

      if (
        record.resources.custody ===
        CUSTODY.TRANSFERRED_TO_ENGINE
      ) {
        record.resources.released = true;
        record.disposal.transferredBuffersReleased =
          true;
      }

      record.disposal.borrowedBuffersPreserved =
        record.resources.custody ===
        CUSTODY.BORROWED_READ_ONLY;

      record.disposal.residualScheduleCount =
        record.scheduler.active ? 1 : 0;

      record.disposal.residualSessionCount =
        Object.keys(
          record.adapters.sessions
        ).filter(function filter(sessionId) {
          return !record.adapters.sessions[
            sessionId
          ].disposed;
        }).length;

      record.disposal.residualObserverCount =
        record.mount.observerActive &&
        !record.disposal.observersDisconnected
          ? 1
          : 0;

      record.proofs.current.visible = false;
      record.proofs.current.fallbackVisible = false;
      record.proofs.current.interactive = false;
      record.proofs.current.inputAttached = false;

      record.disposal.completed =
        record.disposal.residualScheduleCount === 0 &&
        record.disposal.residualSessionCount === 0 &&
        record.disposal.residualObserverCount === 0 &&
        record.disposal.errors.length === 0;

      recomputeInstanceState(record);

      record.disposal.terminalReceiptComposed =
        true;

      requestLifecycle(record, {
        progressState: PROGRESS.DESTROYED,
        conditionState:
          record.disposal.completed
            ? CONDITION.NONE
            : CONDITION.ERROR,
        executionMode:
          EXECUTION.DESTROYED,
        triggerType: "DISPOSAL",
        reason:
          options && options.reason ||
          "DESTROY_INSTANCE"
      });

      recomputeInstanceState(record);

      var tombstone =
        createTombstone(record);

      delete stores.instances[instanceId];
      stores.tombstones[instanceId] =
        tombstone;

      if (
        !stores.tombstoneRepeatCounts[
          instanceId
        ]
      ) {
        stores.tombstoneRepeatCounts[
          instanceId
        ] = 0;
      }

      updateGlobalReceipt();

      emit("instanceDestroyed", {
        instanceId: instanceId,
        completed:
          record.disposal.completed
      });

      return deepFreeze({
        ok:
          record.disposal.completed,
        status:
          record.disposal.completed
            ? "DESTROYED"
            : "DESTROYED_WITH_DISPOSAL_ERRORS",
        tombstone:
          tombstone.terminalInspection
      });
    });

record.async.disposalPromise =
  disposalPromise;

return disposalPromise;

}

function destroyAll(options) {
return Promise.all(
Object.keys(stores.instances).map(
function map(instanceId) {
return destroyInstance(
instanceId,
options
);
}
)
).then(function complete(results) {
return deepFreeze(results);
});
}

function recomputeInstanceState(record) {
if (
record.lifecycle.progressState ===
PROGRESS.DESTROYED &&
record.ops.snapshot
) {
return;
}

var observed =
  record.ops.draft.observed || {};

observed.fileLoaded =
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] >= PROGRESS_ORDER[PROGRESS.LOADED];

observed.contractMatched =
  record.authority.authorityMatched === true;

observed.modelValidated =
  record.admission.validationPassed === true;

observed.instanceCreated =
  PROGRESS_ORDER[
    record.lifecycle.progressState
  ] >= PROGRESS_ORDER[PROGRESS.CREATED];

observed.mountPresent =
  record.mount.resolved === true &&
  record.mount.connected !== false;

observed.surfaceNonzero =
  record.proofs.current.surfaceNonzero;

observed.backendInitialized =
  record.proofs.current.rendererInitialized ||
  record.proofs.current.fallbackInitialized;

observed.resourcesUploaded =
  record.proofs.current.resourcesUploaded ||
  record.proofs.current.fallbackRepresentationReady;

observed.firstFrameSubmitted =
  record.proofs.current.frameSubmitted ||
  record.proofs.current.fallbackOutputWritten;

observed.firstFramePresented =
  record.proofs.current.framePresented ||
  record.proofs.current.fallbackPresentationObserved;

observed.visiblePixelObserved =
  record.proofs.current.visible ||
  record.proofs.current.fallbackVisible;

observed.interactionObserved =
  record.proofs.current.interactive;

observed.fallbackAvailable =
  record.proofs.current.fallbackAvailable;

observed.contextRecoveryAvailable =
  record.renderer.recoveryAvailable === true;

observed.disposalObserved =
  record.disposal.completed === true;

observed.noBlockingError =
  !record.blockingError.active;

record.ops.draft.observed = observed;

record.ops.draft.state =
  projectOpsState(record);

record.ops.draft.loaded =
  observed.fileLoaded;

record.ops.draft.initialized =
  observed.backendInitialized;

record.ops.draft.backend =
  record.lifecycle.executionMode ===
  EXECUTION.FALLBACK
    ? record.fallback.fallbackType
    : record.renderer.selectedBackend ||
      "NONE";

var snapshot =
  cloneForInspection(record.ops.draft);

record.ops.snapshot =
  deepFreeze(snapshot);

record.ops.snapshotHash =
  hash(snapshot);

var contract =
  stores.authorityStatus === STATUS.READY
    ? stores.authority
    : null;

if (contract) {
  try {
    var comparison =
      contract.compareSpecAndOps(
        record.specification.spec,
        record.ops.snapshot
      );

    var receipt =
      contract.composeReceipt({
        identity: {
          instanceId:
            record.identity.instanceId,
          modelId:
            record.identity.modelId,
          modelClass:
            record.identity.modelClass,
          modelContract:
            record.identity.modelContract,
          modelVersion:
            record.identity.modelVersion
        },

        news:
          record.admission.admittedModel.news,

        fibonacci:
          record.admission.admittedModel.fibonacci,

        spec:
          record.specification.spec,

        ops:
          record.ops.snapshot,

        comparison: comparison,

        metadata: {
          coreContract: CORE_CONTRACT,
          coreVersion: VERSION,
          f21Claimed: false
        }
      });

    record.ops.comparison =
      frozenInspection(comparison);

    record.ops.comparisonHash =
      hash(comparison);

    record.ops.receipt =
      frozenInspection(receipt);

    record.ops.receiptHash =
      receipt &&
      receipt.receiptHash
        ? receipt.receiptHash
        : hash(receipt);

    record.ops.lastComparedAt =
      nowIso();

    record.ops.lastReceiptAt =
      record.ops.lastComparedAt;
  } catch (error) {
    record.errors.push({
      code:
        "RECOMPUTE_RECEIPT_FAILED",
      message:
        String(
          error && error.message
            ? error.message
            : error
        ),
      at: nowIso()
    });
  }
}

computeEligibility(record);

}

function projectOpsState(record) {
if (
record.lifecycle.progressState ===
PROGRESS.DESTROYED
) {
return "DESTROYED";
}

if (
  record.lifecycle.conditionState ===
  CONDITION.ERROR
) {
  return "ERROR";
}

if (
  record.lifecycle.conditionState ===
  CONDITION.CONTEXT_LOST
) {
  return "CONTEXT_LOST";
}

if (
  record.lifecycle.conditionState ===
  CONDITION.RECOVERING
) {
  return "RECOVERING";
}

if (
  record.lifecycle.conditionState ===
  CONDITION.HELD
) {
  return "HELD";
}

if (
  record.lifecycle.conditionState ===
  CONDITION.PAUSED
) {
  return "PAUSED";
}

if (
  record.lifecycle.conditionState ===
  CONDITION.FALLBACK
) {
  return "FALLBACK";
}

if (
  record.lifecycle.conditionState ===
  CONDITION.DEGRADED
) {
  return "DEGRADED";
}

return record.lifecycle.progressState;

}

function listAdapterSessions(instanceId) {
if (stores.tombstones[instanceId]) {
return stores.tombstones[
instanceId
].terminalSessions;
}

var record = stores.instances[instanceId];

if (!record) {
  return deepFreeze([]);
}

return frozenInspection(
  record.adapters.sessions
);

}

function inspectAdapterSession(
instanceId,
sessionId
) {
if (stores.tombstones[instanceId]) {
var terminalSessions =
stores.tombstones[
instanceId
].terminalSessions;

  return terminalSessions[
    sessionId
  ] || null;
}

var record = stores.instances[instanceId];

if (
  !record ||
  !record.adapters.sessions[sessionId]
) {
  return null;
}

return frozenInspection(
  record.adapters.sessions[sessionId]
);

}

function getDiagnosticEvidence() {
return frozenInspection(
stores.diagnosticHistory
);
}

function activeSchedulerCount() {
return Object.keys(stores.instances)
.filter(function filter(id) {
return stores.instances[id]
.scheduler.active;
})
.length;
}

function activeSessionCount() {
var count = 0;

Object.keys(stores.instances).forEach(
  function each(id) {
    var sessions =
      stores.instances[id]
        .adapters.sessions;

    Object.keys(sessions).forEach(
      function eachSession(sessionId) {
        if (
          sessions[sessionId].active &&
          !sessions[sessionId].disposed
        ) {
          count += 1;
        }
      }
    );
  }
);

return count;

}

function activeObserverCount() {
return Object.keys(stores.instances)
.filter(function filter(id) {
return stores.instances[id]
.mount.observerActive;
})
.length;
}

function runDiagnosticSelfTest() {
var started = nowIso();

var before = {
  liveInstanceCount:
    Object.keys(stores.instances).length,
  activeSessionCount:
    activeSessionCount(),
  activeSchedulerCount:
    activeSchedulerCount(),
  activeObserverCount:
    activeObserverCount(),
  subscriberCount:
    Object.keys(stores.subscribers).length
};

var isolated = {
  transitionHistory: [],
  evidenceHistory: [],
  disposed: false
};

isolated.transitionHistory.push({
  from: "DECLARED",
  to: "LOADED"
});

isolated.evidenceHistory.push({
  type: "UNKNOWN",
  accepted: false
});

isolated.disposed = true;

var after = {
  liveInstanceCount:
    Object.keys(stores.instances).length,
  activeSessionCount:
    activeSessionCount(),
  activeSchedulerCount:
    activeSchedulerCount(),
  activeObserverCount:
    activeObserverCount(),
  subscriberCount:
    Object.keys(stores.subscribers).length
};

var residualDifference = {
  liveInstanceCount:
    after.liveInstanceCount -
    before.liveInstanceCount,
  activeSessionCount:
    after.activeSessionCount -
    before.activeSessionCount,
  activeSchedulerCount:
    after.activeSchedulerCount -
    before.activeSchedulerCount,
  activeObserverCount:
    after.activeObserverCount -
    before.activeObserverCount,
  subscriberCount:
    after.subscriberCount -
    before.subscriberCount
};

var noResidual =
  residualDifference.liveInstanceCount === 0 &&
  residualDifference.activeSessionCount === 0 &&
  residualDifference.activeSchedulerCount === 0 &&
  residualDifference.activeObserverCount === 0 &&
  residualDifference.subscriberCount === 0 &&
  isolated.disposed === true;

var packet = deepFreeze({
  schema:
    "DGB_ENGINE_DIAGNOSTIC_SELF_TEST_v2",
  classification:
    EVIDENCE_CLASSIFICATION.DIAGNOSTIC_ISOLATED,
  startedAt: started,
  completedAt: nowIso(),
  passed: noResidual,
  productionBefore: before,
  isolatedResources: {
    transitionRecordCount:
      isolated.transitionHistory.length,
    evidenceRecordCount:
      isolated.evidenceHistory.length,
    disposed:
      isolated.disposed
  },
  productionAfter: after,
  residualDifference:
    residualDifference,
  forbiddenPublicMethodsAbsent:
    !API.setReady &&
    !API.setOps &&
    !API.claimF21,
  f21Claimed: false
});

stores.diagnosticHistory.push(packet);

return packet;

}

function getAuthorityStatus() {
return deepFreeze({
contract: CORE_CONTRACT,
governingContract:
GOVERNING_CONTRACT,
version: VERSION,
file: FILE,
status:
stores.authorityStatus,
authorityMatched:
stores.authorityStatus ===
STATUS.READY,
modelSchema:
GOVERNING_MODEL_SCHEMA,
authorityIdentity:
frozenInspection(
stores.authorityIdentity
),
authorityReceipt:
frozenInspection(
stores.authorityReceipt
),
authorityValidation:
frozenInspection(
stores.authorityValidation
),
errors:
stores.authorityErrors.slice(),
warnings:
stores.authorityWarnings.slice(),
f13InheritedConditionally:
stores.authorityStatus ===
STATUS.READY,
f21Claimed: false
});
}

function getAuthorityReceipt() {
return frozenInspection(
stores.authorityReceipt
);
}

function getAuthorityValidation() {
return frozenInspection(
stores.authorityValidation
);
}

function quietLoadPreserved() {
return Boolean(
loadBaseline.instancesCreatedByCoreOnLoad === 0 &&
loadBaseline.schedulersCreatedByCoreOnLoad === 0 &&
loadBaseline.observersCreatedByCoreOnLoad === 0 &&
loadBaseline.listenersCreatedByCoreOnLoad === 0 &&
loadBaseline.contextCreatedByCoreOnLoad === 0
);
}

function getRuntimeReceipt() {
return deepFreeze({
schema: RUNTIME_RECEIPT_SCHEMA,
contract: CORE_CONTRACT,
governingContract:
GOVERNING_CONTRACT,
version: VERSION,
file: FILE,
status:
stores.authorityStatus,
authorityMatched:
stores.authorityStatus ===
STATUS.READY,
modelSchema:
GOVERNING_MODEL_SCHEMA,
liveInstanceCount:
Object.keys(
stores.instances
).length,
tombstoneCount:
Object.keys(
stores.tombstones
).length,
adapterDescriptorCount:
Object.keys(
stores.adapters
).length,
activeSessionCount:
activeSessionCount(),
activeSchedulerCount:
activeSchedulerCount(),
activeObserverCount:
activeObserverCount(),
listenerCount:
Object.keys(
stores.subscribers
).length,
acquiredContextCount: 0,
selectedFallbackCount:
Object.keys(
stores.instances
).filter(function filter(id) {
return stores.instances[id]
.fallback.selected;
}).length,
f13InheritedConditionally:
stores.authorityStatus ===
STATUS.READY,
f21Claimed: false,
quietLoadPreserved:
quietLoadPreserved(),
loadBaseline:
frozenInspection(loadBaseline),
generatedAt: nowIso(),
authorityErrors:
stores.authorityErrors.slice(),
authorityWarnings:
stores.authorityWarnings.slice()
});
}

function getReceipt() {
return getRuntimeReceipt();
}

function getStatus() {
return deepFreeze({
contract: CORE_CONTRACT,
version: VERSION,
file: FILE,
status:
stores.authorityStatus,
authorityMatched:
stores.authorityStatus ===
STATUS.READY,
modelSchema:
GOVERNING_MODEL_SCHEMA,
liveInstanceCount:
Object.keys(
stores.instances
).length,
tombstoneCount:
Object.keys(
stores.tombstones
).length,
adapterDescriptorCount:
Object.keys(
stores.adapters
).length,
activeSessionCount:
activeSessionCount(),
activeSchedulerCount:
activeSchedulerCount(),
f21Claimed: false
});
}

function inspect(options) {
var settings = isObject(options)
? options
: {};

var packet = {
  schema: INSPECTION_SCHEMA,
  contract: CORE_CONTRACT,
  version: VERSION,
  file: FILE,
  status:
    stores.authorityStatus,
  authority:
    getAuthorityStatus(),
  runtimeReceipt:
    getRuntimeReceipt(),
  quietLoad: {
    liveInstanceCountOnLoad:
      loadBaseline.liveInstanceCountOnLoad,
    activeSessionCountOnLoad:
      loadBaseline.activeSessionCountOnLoad,
    activeSchedulerCountOnLoad:
      loadBaseline.activeSchedulerCountOnLoad,
    activeObserverCountOnLoad:
      loadBaseline.activeObserverCountOnLoad,
    listenerCountOnLoad:
      loadBaseline.listenerCountOnLoad,
    acquiredContextCountOnLoad:
      loadBaseline.acquiredContextCountOnLoad,
    quietLoadPreserved:
      quietLoadPreserved(),
    f21Claimed: false
  }
};

if (settings.includeInstances) {
  packet.instances = listInstances({
    includeTombstones:
      Boolean(
        settings.includeTombstones
      )
  });
}

if (settings.includeAdapters) {
  packet.adapters = listAdapters();
}

if (settings.includeDiagnostics) {
  packet.diagnostics =
    getDiagnosticEvidence();
}

return frozenInspection(packet);

}

function getPacket() {
return inspect({
includeInstances: true,
includeAdapters: true
});
}

function getPacketText() {
var packet = getPacket();

return Object.keys(packet)
  .map(function line(key) {
    var value = packet[key];

    if (
      isObject(value) ||
      Array.isArray(value)
    ) {
      value = JSON.stringify(value);
    }

    return key + "=" + String(value);
  })
  .join("\n");

}

function subscribe(listener) {
if (!isFunction(listener)) {
return deepFreeze({
ok: false,
code: "SUBSCRIBER_MUST_BE_FUNCTION"
});
}

stores.sequences.subscription += 1;

var id =
  "dgb-subscription-" +
  stores.sequences.subscription;

stores.subscribers[id] = listener;

return deepFreeze({
  ok: true,
  subscriptionId: id
});

}

function unsubscribe(
subscriptionIdOrListener
) {
if (
typeof subscriptionIdOrListener ===
"string"
) {
delete stores.subscribers[
subscriptionIdOrListener
];

  return deepFreeze({
    ok: true
  });
}

Object.keys(
  stores.subscribers
).forEach(function each(id) {
  if (
    stores.subscribers[id] ===
    subscriptionIdOrListener
  ) {
    delete stores.subscribers[id];
  }
});

return deepFreeze({
  ok: true
});

}

function emit(type, payload) {
var packet = deepFreeze({
schema:
"DGB_ENGINE_EVENT_PACKET_v1",
type: type,
payload:
cloneForInspection(payload),
emittedAt: nowIso()
});

Object.keys(
  stores.subscribers
).forEach(function each(id) {
  try {
    stores.subscribers[id](packet);
  } catch (_error) {}
});

}

function updateGlobalReceipt() {
try {
root.DGB_ENGINE_RECEIPT =
getRuntimeReceipt();
} catch (_error) {}
}

function publishFlags() {
root.DGB_ENGINE_LOADED = true;
root.DGB_ENGINE_VERSION = VERSION;
root.DGB_ENGINE_CONTRACT_MATCHED =
stores.authorityStatus === STATUS.READY;
root.DGB_ENGINE_MODEL_SCHEMA =
GOVERNING_MODEL_SCHEMA;
root.DGB_ENGINE_STATUS =
stores.authorityStatus;
}

var API = {
CONTRACT: CORE_CONTRACT,
GOVERNING_CONTRACT:
GOVERNING_CONTRACT,
MODEL_SCHEMA:
GOVERNING_MODEL_SCHEMA,
VERSION: VERSION,
FILE: FILE,

getAuthorityStatus:
  getAuthorityStatus,
refreshAuthority:
  refreshAuthority,
getAuthorityReceipt:
  getAuthorityReceipt,
getAuthorityValidation:
  getAuthorityValidation,

validateModelPackage:
  validateModelPackage,
admitModelPackage:
  admitModelPackage,
createInstance:
  createInstance,

getInstance:
  getInstance,
hasInstance:
  hasInstance,
listInstances:
  listInstances,
inspectInstance:
  inspectInstance,
destroyInstance:
  destroyInstance,
destroyAll:
  destroyAll,

registerAdapter:
  registerAdapter,
unregisterAdapter:
  unregisterAdapter,
listAdapters:
  listAdapters,
registerRenderer:
  registerRenderer,
unregisterRenderer:
  unregisterRenderer,
registerInput:
  registerInput,
unregisterInput:
  unregisterInput,
registerFallback:
  registerFallback,
unregisterFallback:
  unregisterFallback,

mountInstance:
  mountInstance,
initializeInstance:
  initializeInstance,
startInstance:
  startInstance,
renderInstanceOnce:
  renderInstanceOnce,
pauseInstance:
  pauseInstance,
resumeInstance:
  resumeInstance,
stopInstance:
  stopInstance,
recoverInstance:
  recoverInstance,
attachInput:
  attachInput,

getSpec:
  getSpec,
getOps:
  getOps,
compareInstance:
  compareInstance,
getInstanceReceipt:
  getInstanceReceipt,
getRuntimeReceipt:
  getRuntimeReceipt,
getStatus:
  getStatus,
getReceipt:
  getReceipt,
getPacket:
  getPacket,
getPacketText:
  getPacketText,
inspect:
  inspect,
getDiagnosticEvidence:
  getDiagnosticEvidence,
runDiagnosticSelfTest:
  runDiagnosticSelfTest,

subscribe:
  subscribe,
unsubscribe:
  unsubscribe,

authorizeSurface:
  authorizeSurface,
revokeSurfaceAuthorization:
  revokeSurfaceAuthorization,
acquireSurfaceLease:
  acquireSurfaceLease,
releaseSurfaceLease:
  releaseSurfaceLease,
authorizeTarget:
  authorizeTarget,
revokeTargetAuthorization:
  revokeTargetAuthorization,

listAdapterSessions:
  listAdapterSessions,
inspectAdapterSession:
  inspectAdapterSession,
selectFallback:
  selectFallback,
preparePrimaryRecovery:
  preparePrimaryRecovery,

hash: hash,

clone: function publicClone(value) {
  return frozenInspection(value);
},

F21_CLAIMED: false

};

deepFreeze(API);

function inspectExistingInstallation() {
var canonical = root.DGB_ENGINE || null;
var compat = root.DGBEngine || null;

if (canonical && compat && canonical !== compat) {
  return {
    ok: false,
    code: "DGB_ENGINE_GLOBAL_ALIAS_CONFLICT",
    existing: null
  };
}

var existing = canonical || compat;

if (!existing) {
  return {
    ok: true,
    existing: null
  };
}

if (existing.CONTRACT !== CORE_CONTRACT) {
  return {
    ok: false,
    code: "DGB_ENGINE_CONTRACT_CONFLICT",
    existing: existing
  };
}

if (
  existing.VERSION !== VERSION ||
  existing.FILE !== FILE ||
  existing.GOVERNING_CONTRACT !==
    GOVERNING_CONTRACT
) {
  return {
    ok: false,
    code: "DGB_ENGINE_IDENTITY_CONFLICT",
    existing: existing
  };
}

if (
  existing.MODEL_SCHEMA &&
  existing.MODEL_SCHEMA !==
    GOVERNING_MODEL_SCHEMA
) {
  return {
    ok: false,
    code: "DGB_ENGINE_MODEL_SCHEMA_CONFLICT",
    existing: existing
  };
}

var missing = REQUIRED_PUBLIC_METHODS.filter(
  function filter(method) {
    return !isFunction(existing[method]);
  }
);

if (missing.length) {
  return {
    ok: false,
    code:
      "DGB_ENGINE_EXISTING_API_INCOMPATIBLE",
    existing: existing,
    missing: missing
  };
}

return {
  ok: true,
  existing: existing
};

}

function publishTransactionally() {
var previousCanonical =
root.DGB_ENGINE;
var previousCompat =
root.DGBEngine;
var previousReceipt =
root.DGB_ENGINE_RECEIPT;

try {
  root.DGB_ENGINE = API;
  root.DGBEngine = API;
  root.DGB_ENGINE_RECEIPT =
    getRuntimeReceipt();
  publishFlags();

  if (
    root.DGB_ENGINE !== API ||
    root.DGBEngine !== API ||
    root.DGB_ENGINE !==
      root.DGBEngine ||
    !root.DGB_ENGINE_RECEIPT ||
    root.DGB_ENGINE_RECEIPT.contract !==
      CORE_CONTRACT
  ) {
    throw new Error(
      "DGB engine publication verification failed."
    );
  }

  stores.publicationVerified = true;
  return true;
} catch (error) {
  try {
    root.DGB_ENGINE =
      previousCanonical;
  } catch (_error1) {}

  try {
    root.DGBEngine =
      previousCompat;
  } catch (_error2) {}

  try {
    root.DGB_ENGINE_RECEIPT =
      previousReceipt;
  } catch (_error3) {}

  stores.installationConflict =
    deepFreeze({
      schema:
        "DGB_ENGINE_INSTALLATION_CONFLICT_v2",
      expectedContract:
        CORE_CONTRACT,
      file: FILE,
      replacementPerformed: false,
      generatedAt: nowIso(),
      error:
        String(
          error && error.message
            ? error.message
            : error
        )
    });

  root.__DGB_ENGINE_INSTALLATION_CONFLICT__ =
    stores.installationConflict;

  return false;
}

}

var installation =
inspectExistingInstallation();

if (!installation.ok) {
stores.installationConflict =
deepFreeze({
schema:
"DGB_ENGINE_INSTALLATION_CONFLICT_v2",
expectedContract:
CORE_CONTRACT,
expectedVersion:
VERSION,
expectedFile:
FILE,
expectedGoverningContract:
GOVERNING_CONTRACT,
expectedModelSchema:
GOVERNING_MODEL_SCHEMA,
code:
installation.code,
missing:
installation.missing || [],
replacementPerformed: false,
generatedAt: nowIso()
});

root.__DGB_ENGINE_INSTALLATION_CONFLICT__ =
  stores.installationConflict;

return;

}

if (installation.existing) {
root.DGB_ENGINE =
installation.existing;
root.DGBEngine =
installation.existing;

if (
  isFunction(
    installation.existing.getReceipt
  )
) {
  root.DGB_ENGINE_RECEIPT =
    installation.existing.getReceipt();
}

if (
  typeof module !== "undefined" &&
  module.exports
) {
  module.exports =
    installation.existing;
}

return;

}

refreshAuthority();

if (!publishTransactionally()) {
return;
}

if (
typeof module !== "undefined" &&
module.exports
) {
module.exports = API;
}
})(
typeof window !== "undefined"
? window
: typeof globalThis !== "undefined"
? globalThis
: this
);
