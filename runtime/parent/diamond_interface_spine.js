const INTERFACE_NAMESPACE = "diamond_interface_spine_v1";

export const SCALE_CLASSES = Object.freeze({
  NOTE: "note",
  NODE: "node",
  MICROSTATE: "microstate",
  MESO_ENGINE: "meso_engine",
  MACRO_ENGINE: "macro_engine",
  UNIVERSE_CONTEXT: "universe_context",
});

export const PATH_CLASSES = Object.freeze({
  STABILIZING: "stabilizing",
  ASCENDING: "ascending",
  REGRESSING: "regressing",
  FRACTURE: "fracture",
  FALSE_CLOSURE: "false_closure",
});

export const FLAG_STATUSES = Object.freeze({
  GREEN: "green",
  CAUTION: "caution",
  RED: "red",
  CHECKERED: "checkered",
});

export const PHASE_STATUSES = Object.freeze({
  FULL_MOON: "full_moon",
  NEW_MOON: "new_moon",
  MORNING_SUN: "morning_sun",
  NOON_SUN: "noon_sun",
  EVENING_SUN: "evening_sun",
  SETTING_SUN: "setting_sun",
  ECLIPSE: "eclipse",
});

export class ParentStackError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
  }
}

export class PrivateGeometryError extends ParentStackError {}
export class ScaleCollapseError extends ParentStackError {}
export class IdentityLossError extends ParentStackError {}
export class RouteMisclassificationError extends ParentStackError {}
export class FakeClosureError extends ParentStackError {}
export class SupportToBindDriftError extends ParentStackError {}
export class LocalWriteReleaseError extends ParentStackError {}
export class ParentBoundaryViolationError extends ParentStackError {}

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

function assertPlainObject(value, fieldName) {
  assert(
    value !== null && typeof value === "object" && !Array.isArray(value),
    IdentityLossError,
    `${fieldName} must be a plain object.`,
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

function assertNamespace(value, fieldName = "object") {
  assertPlainObject(value, fieldName);
  assert(
    value.interfaceNamespace === INTERFACE_NAMESPACE,
    PrivateGeometryError,
    `${fieldName} must be created through ${INTERFACE_NAMESPACE}.`,
    { fieldName, value },
  );
}

function cloneObject(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createTopologyObject({
  formClass = "diamond",
  regionSet = [],
  containmentRelations = [],
  partitionRules = [],
  boundaryFlags = [],
} = {}) {
  assertNonEmptyString(formClass, "formClass");
  assertArray(regionSet, "regionSet");
  assertArray(containmentRelations, "containmentRelations");
  assertArray(partitionRules, "partitionRules");
  assertArray(boundaryFlags, "boundaryFlags");

  return Object.freeze({
    interfaceNamespace: INTERFACE_NAMESPACE,
    objectClass: "topology",
    formClass,
    regionSet: cloneObject(regionSet),
    containmentRelations: cloneObject(containmentRelations),
    partitionRules: cloneObject(partitionRules),
    boundaryFlags: cloneObject(boundaryFlags),
  });
}

export function createCoordinateObject({
  objectId,
  scaleClass,
  positionVector,
  regionId = null,
  orientationRead = null,
  phaseTag = null,
} = {}) {
  assertNonEmptyString(objectId, "objectId");
  assertNonEmptyString(scaleClass, "scaleClass");
  assertPlainObject(positionVector, "positionVector");

  return Object.freeze({
    interfaceNamespace: INTERFACE_NAMESPACE,
    objectClass: "coordinate",
    objectId,
    scaleClass,
    positionVector: cloneObject(positionVector),
    regionId,
    orientationRead,
    phaseTag,
  });
}

export function createAdjacencyObject({
  sourceId,
  targetId,
  localReachability = true,
  edgeClass = "adjacent",
  fractureFlag = false,
} = {}) {
  assertNonEmptyString(sourceId, "sourceId");
  assertNonEmptyString(targetId, "targetId");
  assertNonEmptyString(edgeClass, "edgeClass");

  return Object.freeze({
    interfaceNamespace: INTERFACE_NAMESPACE,
    objectClass: "adjacency",
    sourceId,
    targetId,
    localReachability: Boolean(localReachability),
    edgeClass,
    fractureFlag: Boolean(fractureFlag),
  });
}

export function createScaleObject({
  lowerScaleId,
  upperScaleId,
  preservationRule,
  compilationRule = null,
  projectionRule = null,
} = {}) {
  assertNonEmptyString(lowerScaleId, "lowerScaleId");
  assertNonEmptyString(upperScaleId, "upperScaleId");
  assertNonEmptyString(preservationRule, "preservationRule");

  return Object.freeze({
    interfaceNamespace: INTERFACE_NAMESPACE,
    objectClass: "scale",
    lowerScaleId,
    upperScaleId,
    preservationRule,
    compilationRule,
    projectionRule,
  });
}

export function createDiagnosticObject({
  energy = 0,
  coherence = 0,
  entropy = 0,
  phase = null,
  overlayTags = [],
} = {}) {
  assertArray(overlayTags, "overlayTags");
  assert(
    Number.isFinite(energy) && Number.isFinite(coherence) && Number.isFinite(entropy),
    IdentityLossError,
    "energy, coherence, and entropy must be finite numbers.",
    { energy, coherence, entropy },
  );

  return Object.freeze({
    interfaceNamespace: INTERFACE_NAMESPACE,
    objectClass: "diagnostic",
    energy,
    coherence,
    entropy,
    phase,
    overlayTags: cloneObject(overlayTags),
  });
}

export function createRouteObject({
  pathId,
  pathClass,
  edgeSequence = [],
  ascentFlag = false,
  regressionFlag = false,
  fractureFlag = false,
  falseClosureFlag = false,
} = {}) {
  assertNonEmptyString(pathId, "pathId");
  assertNonEmptyString(pathClass, "pathClass");
  assertArray(edgeSequence, "edgeSequence");

  return Object.freeze({
    interfaceNamespace: INTERFACE_NAMESPACE,
    objectClass: "route",
    pathId,
    pathClass,
    edgeSequence: cloneObject(edgeSequence),
    ascentFlag: Boolean(ascentFlag),
    regressionFlag: Boolean(regressionFlag),
    fractureFlag: Boolean(fractureFlag),
    falseClosureFlag: Boolean(falseClosureFlag),
  });
}

export function createClosureObject({
  closureStatus = "open",
  returnStatus = "pending",
  checkeredFlag = false,
  eclipseFlag = false,
  preservationRead = "unbound",
} = {}) {
  assertNonEmptyString(closureStatus, "closureStatus");
  assertNonEmptyString(returnStatus, "returnStatus");
  assertNonEmptyString(preservationRead, "preservationRead");

  if (eclipseFlag && !checkeredFlag) {
    throw new FakeClosureError(
      "Eclipse cannot be asserted without checkered pass-complete status.",
      { closureStatus, returnStatus, checkeredFlag, eclipseFlag },
    );
  }

  return Object.freeze({
    interfaceNamespace: INTERFACE_NAMESPACE,
    objectClass: "closure",
    closureStatus,
    returnStatus,
    checkeredFlag: Boolean(checkeredFlag),
    eclipseFlag: Boolean(eclipseFlag),
    preservationRead,
  });
}

export function assertSpineLegibility(candidate, label = "candidate") {
  assertPlainObject(candidate, label);

  if ("geometryNamespace" in candidate && candidate.geometryNamespace !== INTERFACE_NAMESPACE) {
    throw new PrivateGeometryError(
      `${label} declares private geometry outside ${INTERFACE_NAMESPACE}.`,
      { label, geometryNamespace: candidate.geometryNamespace },
    );
  }

  if ("interfaceNamespace" in candidate) {
    assertNamespace(candidate, label);
    return true;
  }

  const knownKeys = [
    "topology",
    "coordinate",
    "adjacency",
    "scale",
    "diagnostic",
    "route",
    "closure",
  ];

  const presentKeys = knownKeys.filter((key) => key in candidate);
  assert(
    presentKeys.length > 0,
    ParentBoundaryViolationError,
    `${label} is not spine-legible and does not expose any recognized spine modules.`,
    { label, keys: Object.keys(candidate) },
  );

  for (const key of presentKeys) {
    assertNamespace(candidate[key], `${label}.${key}`);
  }

  return true;
}
