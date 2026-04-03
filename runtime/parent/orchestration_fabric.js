import {
  FakeClosureError,
  IdentityLossError,
  LocalWriteReleaseError,
  ParentBoundaryViolationError,
  SupportToBindDriftError,
} from "./diamond_interface_spine.js";
import { UNIVERSE_FACTORY_NAMESPACE } from "./universe_engine_factory.js";
import { INSTRUMENT_FACTORY_NAMESPACE } from "./instrument_factory.js";

export const ORCHESTRATION_NAMESPACE = "orchestration_fabric_v1";

function assert(condition, ErrorType, message, context = {}) {
  if (!condition) {
    throw new ErrorType(message, context);
  }
}

function assertNonEmptyString(value, fieldName) {
  assert(
    typeof value === "string" && value.trim().length > 0,
    IdentityLossError,
    `${fieldName} must be a non-empty string.`,
    { fieldName, value },
  );
}

function assertArray(value, fieldName) {
  assert(
    Array.isArray(value),
    IdentityLossError,
    `${fieldName} must be an array.`,
    { fieldName, value },
  );
}

function assertPlainObject(value, fieldName) {
  assert(
    value !== null && typeof value === "object" && !Array.isArray(value),
    IdentityLossError,
    `${fieldName} must be a plain object.`,
    { fieldName, value },
  );
}

function cloneObject(value) {
  return JSON.parse(JSON.stringify(value));
}

function createDecisionEnvelope({
  decisionType,
  targetObjectId,
  payload,
}) {
  assertNonEmptyString(decisionType, "decisionType");
  assertNonEmptyString(targetObjectId, "targetObjectId");
  assertPlainObject(payload, "payload");

  return Object.freeze({
    factoryNamespace: ORCHESTRATION_NAMESPACE,
    outputClass: decisionType,
    targetObjectId,
    payload: cloneObject(payload),
  });
}

export function createAdmissionDecision({
  decisionId,
  targetObjectId,
  admissionStrength,
  trackAssignment,
  burdenStatus,
  rationaleTags = [],
} = {}) {
  assertNonEmptyString(decisionId, "decisionId");
  assertNonEmptyString(admissionStrength, "admissionStrength");
  assertNonEmptyString(trackAssignment, "trackAssignment");
  assertNonEmptyString(burdenStatus, "burdenStatus");
  assertArray(rationaleTags, "rationaleTags");

  if (admissionStrength === "full_bind" && burdenStatus !== "cleared") {
    throw new SupportToBindDriftError(
      "Full-bind admission cannot be issued while burdenStatus is uncleared.",
      { decisionId, targetObjectId, admissionStrength, burdenStatus },
    );
  }

  return createDecisionEnvelope({
    decisionType: "admission_decision",
    targetObjectId,
    payload: {
      decisionId,
      admissionStrength,
      trackAssignment,
      burdenStatus,
      rationaleTags: cloneObject(rationaleTags),
    },
  });
}

export function createRoutingDecision({
  decisionId,
  targetObjectId,
  currentTrack,
  nextTrack,
  expressStatus = false,
  returnRequiredFlag = false,
} = {}) {
  assertNonEmptyString(decisionId, "decisionId");
  assertNonEmptyString(currentTrack, "currentTrack");
  assertNonEmptyString(nextTrack, "nextTrack");

  return createDecisionEnvelope({
    decisionType: "routing_decision",
    targetObjectId,
    payload: {
      decisionId,
      currentTrack,
      nextTrack,
      expressStatus: Boolean(expressStatus),
      returnRequiredFlag: Boolean(returnRequiredFlag),
    },
  });
}

export function createMonitoringState({
  monitorId,
  targetObjectId,
  locationRead,
  diagnosticSummary = {},
  routeSummary = {},
  flagStatus = null,
  phaseStatus = null,
  driftAlerts = [],
  fractureAlerts = [],
} = {}) {
  assertNonEmptyString(monitorId, "monitorId");
  assertPlainObject(locationRead, "locationRead");
  assertPlainObject(diagnosticSummary, "diagnosticSummary");
  assertPlainObject(routeSummary, "routeSummary");
  assertArray(driftAlerts, "driftAlerts");
  assertArray(fractureAlerts, "fractureAlerts");

  return createDecisionEnvelope({
    decisionType: "monitoring_state",
    targetObjectId,
    payload: {
      monitorId,
      locationRead: cloneObject(locationRead),
      diagnosticSummary: cloneObject(diagnosticSummary),
      routeSummary: cloneObject(routeSummary),
      flagStatus,
      phaseStatus,
      driftAlerts: cloneObject(driftAlerts),
      fractureAlerts: cloneObject(fractureAlerts),
    },
  });
}

export function createLockDecision({
  lockId,
  targetObjectId,
  lockClass,
  lockStatus,
  thresholdRead,
  lowerLayerOverrideRefused = true,
} = {}) {
  assertNonEmptyString(lockId, "lockId");
  assertNonEmptyString(lockClass, "lockClass");
  assertNonEmptyString(lockStatus, "lockStatus");

  return createDecisionEnvelope({
    decisionType: "lock_decision",
    targetObjectId,
    payload: {
      lockId,
      lockClass,
      lockStatus,
      thresholdRead: cloneObject(thresholdRead),
      lowerLayerOverrideRefused: Boolean(lowerLayerOverrideRefused),
    },
  });
}

export function createSealDecision({
  sealId,
  targetObjectId,
  checkeredStatus = false,
  settingSunStatus = false,
  eclipseStatus = false,
  sealStatus = "open",
  falseClosureFlag = false,
} = {}) {
  assertNonEmptyString(sealId, "sealId");
  assertNonEmptyString(sealStatus, "sealStatus");

  if (eclipseStatus && !checkeredStatus) {
    throw new FakeClosureError(
      "Eclipse cannot be sealed without checkered status.",
      { sealId, targetObjectId, checkeredStatus, eclipseStatus },
    );
  }

  if (falseClosureFlag) {
    throw new FakeClosureError(
      "Seal decisions cannot be issued while falseClosureFlag is active.",
      { sealId, targetObjectId },
    );
  }

  return createDecisionEnvelope({
    decisionType: "seal_decision",
    targetObjectId,
    payload: {
      sealId,
      checkeredStatus: Boolean(checkeredStatus),
      settingSunStatus: Boolean(settingSunStatus),
      eclipseStatus: Boolean(eclipseStatus),
      sealStatus,
      falseClosureFlag: Boolean(falseClosureFlag),
    },
  });
}

export function createReturnDecision({
  returnId,
  targetObjectId,
  returnStatus,
  inheritanceObjectId,
  nextCycleAttachments = [],
  memoryPreservationRead = "preserved",
} = {}) {
  assertNonEmptyString(returnId, "returnId");
  assertNonEmptyString(returnStatus, "returnStatus");
  assertNonEmptyString(inheritanceObjectId, "inheritanceObjectId");
  assertArray(nextCycleAttachments, "nextCycleAttachments");

  return createDecisionEnvelope({
    decisionType: "return_decision",
    targetObjectId,
    payload: {
      returnId,
      returnStatus,
      inheritanceObjectId,
      nextCycleAttachments: cloneObject(nextCycleAttachments),
      memoryPreservationRead,
    },
  });
}

export function createParentAuditTrail({
  auditId,
  targetObjectId,
  admissionHistory = [],
  routingHistory = [],
  monitoringHistory = [],
  lockHistory = [],
  sealHistory = [],
  returnHistory = [],
} = {}) {
  assertNonEmptyString(auditId, "auditId");
  assertArray(admissionHistory, "admissionHistory");
  assertArray(routingHistory, "routingHistory");
  assertArray(monitoringHistory, "monitoringHistory");
  assertArray(lockHistory, "lockHistory");
  assertArray(sealHistory, "sealHistory");
  assertArray(returnHistory, "returnHistory");

  return createDecisionEnvelope({
    decisionType: "parent_audit_trail",
    targetObjectId,
    payload: {
      auditId,
      admissionHistory: cloneObject(admissionHistory),
      routingHistory: cloneObject(routingHistory),
      monitoringHistory: cloneObject(monitoringHistory),
      lockHistory: cloneObject(lockHistory),
      sealHistory: cloneObject(sealHistory),
      returnHistory: cloneObject(returnHistory),
    },
  });
}

export function createPhaseGate({
  gateId,
  targetObjectId,
  requiredFlagStatus = null,
  requiredPhaseStatus = null,
  pass = false,
} = {}) {
  assertNonEmptyString(gateId, "gateId");

  return createDecisionEnvelope({
    decisionType: "phase_gate",
    targetObjectId,
    payload: {
      gateId,
      requiredFlagStatus,
      requiredPhaseStatus,
      pass: Boolean(pass),
    },
  });
}

export function createTrackPermission({
  permissionId,
  targetObjectId,
  currentTrack,
  nextTrack,
  granted = false,
  rationaleTags = [],
} = {}) {
  assertNonEmptyString(permissionId, "permissionId");
  assertNonEmptyString(currentTrack, "currentTrack");
  assertNonEmptyString(nextTrack, "nextTrack");
  assertArray(rationaleTags, "rationaleTags");

  return createDecisionEnvelope({
    decisionType: "track_permission",
    targetObjectId,
    payload: {
      permissionId,
      currentTrack,
      nextTrack,
      granted: Boolean(granted),
      rationaleTags: cloneObject(rationaleTags),
    },
  });
}

export function assertOrchestrationDecision(
  output,
  { universeFactoryNamespace = UNIVERSE_FACTORY_NAMESPACE, instrumentFactoryNamespace = INSTRUMENT_FACTORY_NAMESPACE } = {},
) {
  assertPlainObject(output, "output");
  assert(
    output.factoryNamespace === ORCHESTRATION_NAMESPACE,
    ParentBoundaryViolationError,
    "Output does not belong to orchestration_fabric_v1.",
    { output },
  );

  const supportedClasses = new Set([
    "admission_decision",
    "routing_decision",
    "monitoring_state",
    "lock_decision",
    "seal_decision",
    "return_decision",
    "parent_audit_trail",
    "phase_gate",
    "track_permission",
  ]);

  assert(
    supportedClasses.has(output.outputClass),
    ParentBoundaryViolationError,
    "Unsupported orchestration output class.",
    { outputClass: output.outputClass },
  );

  assertNonEmptyString(universeFactoryNamespace, "universeFactoryNamespace");
  assertNonEmptyString(instrumentFactoryNamespace, "instrumentFactoryNamespace");

  if (output.payload?.localWriteRelease === true) {
    throw new LocalWriteReleaseError(
      "Parent orchestration may not grant local file-write release.",
      { output },
    );
  }

  return true;
}
