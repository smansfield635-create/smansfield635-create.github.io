import {
  FLAG_STATUSES,
  PHASE_STATUSES,
  FakeClosureError,
  IdentityLossError,
  ParentBoundaryViolationError,
  PrivateGeometryError,
} from "./diamond_interface_spine.js";
import { ADAPTER_NAMESPACE } from "./kernel_adapter.js";

export const INSTRUMENT_FACTORY_NAMESPACE = "instrument_factory_v1";

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

function createInstrumentEnvelope({
  instrumentType,
  targetObjectId,
  payload,
}) {
  assertNonEmptyString(instrumentType, "instrumentType");
  assertNonEmptyString(targetObjectId, "targetObjectId");
  assertPlainObject(payload, "payload");

  return Object.freeze({
    factoryNamespace: INSTRUMENT_FACTORY_NAMESPACE,
    outputClass: instrumentType,
    targetObjectId,
    payload: cloneObject(payload),
  });
}

export function createStateInstrument({
  instrumentId,
  targetObjectId,
  scaleClass,
  positionRead,
  identityPreservationRead = true,
  regionRead = null,
} = {}) {
  assertNonEmptyString(instrumentId, "instrumentId");
  assertNonEmptyString(scaleClass, "scaleClass");

  return createInstrumentEnvelope({
    instrumentType: "state_instrument",
    targetObjectId,
    payload: {
      instrumentId,
      scaleClass,
      positionRead: cloneObject(positionRead),
      identityPreservationRead: Boolean(identityPreservationRead),
      regionRead,
    },
  });
}

export function createDiagnosticInstrument({
  instrumentId,
  targetObjectId,
  energyRead,
  coherenceRead,
  entropyRead,
  phaseRead,
  overlaySet = [],
} = {}) {
  assertNonEmptyString(instrumentId, "instrumentId");
  assert(
    Number.isFinite(energyRead) &&
      Number.isFinite(coherenceRead) &&
      Number.isFinite(entropyRead),
    IdentityLossError,
    "Diagnostic reads must be finite numbers.",
    { energyRead, coherenceRead, entropyRead },
  );
  assertArray(overlaySet, "overlaySet");

  return createInstrumentEnvelope({
    instrumentType: "diagnostic_instrument",
    targetObjectId,
    payload: {
      instrumentId,
      energyRead,
      coherenceRead,
      entropyRead,
      phaseRead,
      overlaySet: cloneObject(overlaySet),
    },
  });
}

export function createRouteInstrument({
  instrumentId,
  targetObjectId,
  pathId,
  pathClass,
  edgeSequence = [],
  fractureFlag = false,
  falseClosureFlag = false,
} = {}) {
  assertNonEmptyString(instrumentId, "instrumentId");
  assertNonEmptyString(pathId, "pathId");
  assertNonEmptyString(pathClass, "pathClass");
  assertArray(edgeSequence, "edgeSequence");

  return createInstrumentEnvelope({
    instrumentType: "route_instrument",
    targetObjectId,
    payload: {
      instrumentId,
      pathId,
      pathClass,
      edgeSequence: cloneObject(edgeSequence),
      fractureFlag: Boolean(fractureFlag),
      falseClosureFlag: Boolean(falseClosureFlag),
    },
  });
}

export function createEngineInstrument({
  instrumentId,
  targetObjectId,
  mesoEngineRead,
  macroFusionRead,
  compatibilityRead = true,
  scaleAlignmentRead = true,
} = {}) {
  assertNonEmptyString(instrumentId, "instrumentId");

  return createInstrumentEnvelope({
    instrumentType: "engine_instrument",
    targetObjectId,
    payload: {
      instrumentId,
      mesoEngineRead,
      macroFusionRead,
      compatibilityRead: Boolean(compatibilityRead),
      scaleAlignmentRead: Boolean(scaleAlignmentRead),
    },
  });
}

export function createFidelityInstrument({
  instrumentId,
  targetObjectId,
  kernelMatchRead = true,
  spineMatchRead = true,
  driftScore = 0,
  misfitLocus = null,
} = {}) {
  assertNonEmptyString(instrumentId, "instrumentId");
  assert(
    Number.isFinite(driftScore),
    IdentityLossError,
    "driftScore must be finite.",
    { driftScore },
  );

  return createInstrumentEnvelope({
    instrumentType: "fidelity_instrument",
    targetObjectId,
    payload: {
      instrumentId,
      kernelMatchRead: Boolean(kernelMatchRead),
      spineMatchRead: Boolean(spineMatchRead),
      driftScore,
      misfitLocus,
    },
  });
}

export function createDriftInstrument({
  instrumentId,
  targetObjectId,
  driftDetected = false,
  driftClass = null,
  driftDetails = {},
} = {}) {
  assertNonEmptyString(instrumentId, "instrumentId");
  assertPlainObject(driftDetails, "driftDetails");

  return createInstrumentEnvelope({
    instrumentType: "drift_instrument",
    targetObjectId,
    payload: {
      instrumentId,
      driftDetected: Boolean(driftDetected),
      driftClass,
      driftDetails: cloneObject(driftDetails),
    },
  });
}

export function createFractureInstrument({
  instrumentId,
  targetObjectId,
  fractureDetected = false,
  fractureClass = null,
  discontinuityMap = [],
} = {}) {
  assertNonEmptyString(instrumentId, "instrumentId");
  assertArray(discontinuityMap, "discontinuityMap");

  return createInstrumentEnvelope({
    instrumentType: "fracture_instrument",
    targetObjectId,
    payload: {
      instrumentId,
      fractureDetected: Boolean(fractureDetected),
      fractureClass,
      discontinuityMap: cloneObject(discontinuityMap),
    },
  });
}

export function createClosureInstrument({
  instrumentId,
  targetObjectId,
  checkeredFlagRead = false,
  settingSunRead = false,
  eclipseRead = false,
  depthBoundClosureRead = "open",
  returnStatusRead = "pending",
} = {}) {
  assertNonEmptyString(instrumentId, "instrumentId");

  if (eclipseRead && !checkeredFlagRead) {
    throw new FakeClosureError(
      "Closure instruments cannot assert eclipse without checkered status.",
      { targetObjectId, checkeredFlagRead, eclipseRead },
    );
  }

  return createInstrumentEnvelope({
    instrumentType: "closure_instrument",
    targetObjectId,
    payload: {
      instrumentId,
      checkeredFlagRead: Boolean(checkeredFlagRead),
      settingSunRead: Boolean(settingSunRead),
      eclipseRead: Boolean(eclipseRead),
      depthBoundClosureRead,
      returnStatusRead,
    },
  });
}

export function createReturnAudit({
  auditId,
  targetObjectId,
  stateSummary = {},
  diagnosticSummary = {},
  routeSummary = {},
  fidelitySummary = {},
  closureSummary = {},
  orchestrationReadyFlag = false,
} = {}) {
  assertNonEmptyString(auditId, "auditId");
  assertPlainObject(stateSummary, "stateSummary");
  assertPlainObject(diagnosticSummary, "diagnosticSummary");
  assertPlainObject(routeSummary, "routeSummary");
  assertPlainObject(fidelitySummary, "fidelitySummary");
  assertPlainObject(closureSummary, "closureSummary");

  return createInstrumentEnvelope({
    instrumentType: "return_audit",
    targetObjectId,
    payload: {
      auditId,
      stateSummary: cloneObject(stateSummary),
      diagnosticSummary: cloneObject(diagnosticSummary),
      routeSummary: cloneObject(routeSummary),
      fidelitySummary: cloneObject(fidelitySummary),
      closureSummary: cloneObject(closureSummary),
      orchestrationReadyFlag: Boolean(orchestrationReadyFlag),
    },
  });
}

export function assertInstrumentFactoryOutput(output, { adapterBundle = null } = {}) {
  assertPlainObject(output, "output");
  assert(
    output.factoryNamespace === INSTRUMENT_FACTORY_NAMESPACE,
    ParentBoundaryViolationError,
    "Output does not belong to instrument_factory_v1.",
    { output },
  );

  if (adapterBundle) {
    assert(
      adapterBundle.adapterNamespace === ADAPTER_NAMESPACE,
      ParentBoundaryViolationError,
      "Instrument factory comparisons must use kernel_adapter_v1 inputs.",
      { adapterBundle },
    );
  }

  const supportedClasses = new Set([
    "state_instrument",
    "diagnostic_instrument",
    "route_instrument",
    "engine_instrument",
    "fidelity_instrument",
    "drift_instrument",
    "fracture_instrument",
    "closure_instrument",
    "return_audit",
  ]);

  assert(
    supportedClasses.has(output.outputClass),
    ParentBoundaryViolationError,
    "Unsupported instrument factory output class.",
    { outputClass: output.outputClass },
  );

  if ("geometryNamespace" in output && output.geometryNamespace !== undefined) {
    throw new PrivateGeometryError(
      "Instrument factory outputs must not declare private geometry.",
      { output },
    );
  }

  const payload = output.payload ?? {};
  if ("flagStatus" in payload) {
    assert(
      Object.values(FLAG_STATUSES).includes(payload.flagStatus),
      IdentityLossError,
      "flagStatus must be canonical.",
      { payload },
    );
  }
  if ("phaseStatus" in payload) {
    assert(
      Object.values(PHASE_STATUSES).includes(payload.phaseStatus),
      IdentityLossError,
      "phaseStatus must be canonical.",
      { payload },
    );
  }

  return true;
}
