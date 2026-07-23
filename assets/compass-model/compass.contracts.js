/*
 * Universal cross-compass model contract root.
 * Candidate research architecture only. No live rebuild or production authority.
 */

export const COMPASS_MODEL_CONTRACT = Object.freeze({
  id: "DGB_UNIVERSAL_COMPASS_MODEL_CANDIDATE_v2",
  status: "CANDIDATE_NOT_ADMITTED",
  sourceFamilies: Object.freeze([
    "MAIN_COMPASS",
    "LAW_COMPASS",
    "SHOWROOM_COMPASS",
    "ARCHCOIN_COMPASS"
  ]),
  templateCompass: null,
  sourceFamilyPrecedence: null,
  canonicalPrimaryOwner: "WORLD",
  depthConvention: "POSITIVE_CAMERA_FORWARD_DISTANCE",
  heldModel: "CONTROLLER_BOOLEAN_OVERLAY",
  unknownFieldPolicy: "REJECT",
  recordImmutability: "DEEP",
  productionAuthorized: false,
  liveRebuildAuthorized: false
});

export const AUTHORITY = Object.freeze({
  WORLD: "WORLD",
  NODES: "NODES",
  COMPOSITOR: "COMPOSITOR",
  CONTROLLER: "CONTROLLER",
  INTERACTIONS: "INTERACTIONS",
  PROFILE: "PROFILE",
  ADAPTER: "ADAPTER",
  VALIDATION: "VALIDATION"
});

export const PRESENTATION = Object.freeze({
  CONSTELLATION: "CONSTELLATION",
  CLUSTER: "CLUSTER",
  HELD: "HELD"
});

export const CANONICAL_PRESENTATIONS = Object.freeze([
  PRESENTATION.CONSTELLATION,
  PRESENTATION.CLUSTER
]);

export const ORIENTATION_PHASE = Object.freeze({
  IDLE: "IDLE",
  PREVIEW: "PREVIEW",
  COMMITTED: "COMMITTED",
  CANCELLED: "CANCELLED"
});

export const TRANSACTION_PHASE = Object.freeze({
  ORIENTATION: "ORIENTATION",
  SELECTION: "SELECTION",
  PREVIEW: "PREVIEW",
  CONFIRMATION: "CONFIRMATION",
  SETTLEMENT: "SETTLEMENT",
  ROUTE_COMMIT: "ROUTE_COMMIT",
  CANCELLED: "CANCELLED"
});

export const DEPTH_LAYER = Object.freeze({
  REAR: "REAR",
  CENTER: "CENTER",
  FRONT: "FRONT",
  UNKNOWN: "UNKNOWN"
});

export const DEPTH_CONVENTION = Object.freeze({
  POSITIVE_CAMERA_FORWARD_DISTANCE: "POSITIVE_CAMERA_FORWARD_DISTANCE"
});

export const POINTER_KIND = Object.freeze({
  MOUSE: "mouse",
  TOUCH: "touch",
  PEN: "pen",
  KEYBOARD: "keyboard"
});

export const VALIDATION_STATUS = Object.freeze({
  PASS: "PASS",
  FAIL: "FAIL",
  PENDING: "PENDING"
});

export const REQUIRED_INVARIANTS = Object.freeze([
  "AUTHORITY_SEPARATION",
  "INTERFACE_COMPLETENESS",
  "TRANSACTION_DETERMINISM",
  "PROFILE_ISOLATION",
  "PAGE_IDENTITY_EXCLUSION",
  "WORLD_PROJECTION_CONSISTENCY",
  "VISUAL_SEMANTIC_ALIGNMENT",
  "POINTER_AND_DEVICE_BEHAVIOR",
  "INTERRUPTION_RECOVERY",
  "REDUCED_MOTION_FUNCTIONALITY",
  "OPTIONAL_PARTICIPANT_ISOLATION",
  "ADAPTER_REVERSIBILITY",
  "BASELINE_MIGRATION_SAFETY"
]);

export const RECORD_SCHEMAS = Object.freeze({
  UNIVERSAL_NODE_DEFINITION: Object.freeze([
    "id", "kind", "presentation", "baseVector", "domain", "routeKey", "semantic"
  ]),
  WORLD_NODE_RECORD: Object.freeze([
    "id", "index", "kind", "presentation", "domain", "routeKey", "semantic",
    "baseVector", "rotatedUnitVector", "worldPosition", "alignmentScore", "depthScore"
  ]),
  WORLD_SNAPSHOT: Object.freeze([
    "schema", "worldRevision", "presentation", "orientation", "primaryId", "records"
  ]),
  ORIENTATION_PROPOSAL_EVALUATION: Object.freeze([
    "schema", "presentation", "quaternion", "primaryId", "primaryScore",
    "records", "worldBasisRevision"
  ]),
  CONTROLLER_PREVIEW_PROPOSAL: Object.freeze([
    "quaternion", "primaryId", "worldBasisRevision"
  ]),
  VISUAL_NODE_RECORD: Object.freeze([
    "id", "visible", "scale", "opacity", "prominence", "materialKey", "labelMode"
  ]),
  PROJECTION_NODE_RECORD: Object.freeze([
    "id", "worldRevision", "screenX", "screenY", "radiusPx", "viewDepth",
    "normalizedDepth", "visible", "depthLayer", "hitEligible"
  ]),
  COMPOSITE_NODE_RECORD: Object.freeze([
    "id", "world", "visual", "projection"
  ]),
  CAMERA_RECORD: Object.freeze([
    "eye", "target", "near", "far"
  ]),
  ADAPTER_PROJECTION_INPUT: Object.freeze([
    "nodeId", "worldRevision", "worldPosition", "camera"
  ]),
  ADAPTER_PROJECTION_OUTPUT: Object.freeze([
    "nodeId", "worldRevision", "screenX", "screenY", "radiusPx",
    "viewDepth", "normalizedDepth", "visible"
  ]),
  VALIDATION_FINDING: Object.freeze([
    "id", "status", "pass", "details"
  ]),
  VALIDATION_RECEIPT: Object.freeze([
    "schema", "status", "summary", "findings", "productionAuthority",
    "referenceModelAuthority"
  ])
});

export function assertContract(condition, code, details = null) {
  if (condition) return;
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

export function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  ) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  Reflect.ownKeys(value).forEach(key => {
    deepFreeze(value[key], seen);
  });

  return Object.freeze(value);
}

export function freezeRecord(record) {
  assertPlainRecord(record, "COMPASS_RECORD_REQUIRED");
  return deepFreeze({ ...record });
}

export function assertPlainRecord(value, code = "COMPASS_PLAIN_RECORD_REQUIRED") {
  assertContract(
    value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      (Object.getPrototypeOf(value) === Object.prototype ||
        Object.getPrototypeOf(value) === null),
    code
  );
}

export function assertExactKeys(record, keys, code = "COMPASS_RECORD_KEYS_INVALID") {
  assertPlainRecord(record, code);
  const actual = Object.keys(record).sort();
  const expected = Array.from(keys).sort();

  assertContract(
    actual.length === expected.length &&
      actual.every((key, index) => key === expected[index]),
    code,
    Object.freeze({ actual, expected })
  );
}

export function assertFiniteNumber(value, code = "COMPASS_FINITE_NUMBER_REQUIRED") {
  assertContract(Number.isFinite(Number(value)), code, value);
  return Number(value);
}

export function assertFiniteVector(
  value,
  length,
  code = "COMPASS_FINITE_VECTOR_REQUIRED"
) {
  assertContract(
    Array.isArray(value) &&
      value.length === length &&
      value.every(component => Number.isFinite(Number(component))),
    code,
    value
  );
  return value.map(Number);
}

export function assertNonZeroVector3(
  value,
  code = "COMPASS_NONZERO_VECTOR_REQUIRED"
) {
  const vector = assertFiniteVector(value, 3, code);
  assertContract(Math.hypot(...vector) > 1e-8, code, value);
  return vector;
}

export function assertCanonicalPresentation(
  value,
  code = "COMPASS_CANONICAL_PRESENTATION_REQUIRED"
) {
  assertContract(CANONICAL_PRESENTATIONS.includes(value), code, value);
  return value;
}

export function validateWorldNodeRecord(record) {
  assertExactKeys(
    record,
    RECORD_SCHEMAS.WORLD_NODE_RECORD,
    "COMPASS_WORLD_NODE_RECORD_KEYS_INVALID"
  );
  assertContract(typeof record.id === "string" && record.id.length > 0, "COMPASS_WORLD_NODE_ID_INVALID");
  assertContract(Number.isInteger(record.index) && record.index >= 0, "COMPASS_WORLD_NODE_INDEX_INVALID");
  assertContract(typeof record.kind === "string" && record.kind.length > 0, "COMPASS_WORLD_NODE_KIND_INVALID");
  assertCanonicalPresentation(record.presentation);
  assertPlainRecord(record.semantic, "COMPASS_WORLD_NODE_SEMANTIC_INVALID");
  assertNonZeroVector3(record.baseVector, "COMPASS_WORLD_NODE_BASE_VECTOR_INVALID");
  assertNonZeroVector3(record.rotatedUnitVector, "COMPASS_WORLD_NODE_ROTATED_VECTOR_INVALID");
  assertFiniteVector(record.worldPosition, 3, "COMPASS_WORLD_NODE_POSITION_INVALID");
  assertFiniteNumber(record.alignmentScore, "COMPASS_WORLD_NODE_ALIGNMENT_INVALID");
  assertFiniteNumber(record.depthScore, "COMPASS_WORLD_NODE_DEPTH_INVALID");
  return deepFreeze(structuredClone(record));
}

export function validateWorldSnapshot(snapshot) {
  assertExactKeys(
    snapshot,
    RECORD_SCHEMAS.WORLD_SNAPSHOT,
    "COMPASS_WORLD_SNAPSHOT_KEYS_INVALID"
  );
  assertContract(
    snapshot.schema === "UNIVERSAL_COMPASS_WORLD_SNAPSHOT_v1",
    "COMPASS_WORLD_SNAPSHOT_SCHEMA_INVALID"
  );
  assertContract(
    Number.isInteger(snapshot.worldRevision) && snapshot.worldRevision >= 0,
    "COMPASS_WORLD_REVISION_INVALID"
  );
  assertCanonicalPresentation(snapshot.presentation);
  assertFiniteVector(snapshot.orientation, 4, "COMPASS_WORLD_ORIENTATION_INVALID");
  assertContract(typeof snapshot.primaryId === "string", "COMPASS_WORLD_PRIMARY_ID_INVALID");
  assertContract(Array.isArray(snapshot.records), "COMPASS_WORLD_RECORDS_INVALID");

  const records = snapshot.records.map(validateWorldNodeRecord);
  assertContract(
    snapshot.primaryId === "" ||
      records.some(record => record.id === snapshot.primaryId),
    "COMPASS_WORLD_PRIMARY_ID_UNKNOWN"
  );

  return deepFreeze({
    ...structuredClone(snapshot),
    records
  });
}

export function validateVisualNodeRecord(record) {
  assertExactKeys(
    record,
    RECORD_SCHEMAS.VISUAL_NODE_RECORD,
    "COMPASS_VISUAL_NODE_RECORD_KEYS_INVALID"
  );
  assertContract(typeof record.id === "string" && record.id.length > 0, "COMPASS_VISUAL_NODE_ID_INVALID");
  assertContract(typeof record.visible === "boolean", "COMPASS_VISUAL_NODE_VISIBLE_INVALID");
  ["scale", "opacity", "prominence"].forEach(key =>
    assertFiniteNumber(record[key], `COMPASS_VISUAL_NODE_${key.toUpperCase()}_INVALID`)
  );
  assertContract(typeof record.materialKey === "string", "COMPASS_VISUAL_NODE_MATERIAL_INVALID");
  assertContract(typeof record.labelMode === "string", "COMPASS_VISUAL_NODE_LABEL_MODE_INVALID");
  return deepFreeze(structuredClone(record));
}

export function validateProjectionNodeRecord(record) {
  assertExactKeys(
    record,
    RECORD_SCHEMAS.PROJECTION_NODE_RECORD,
    "COMPASS_PROJECTION_NODE_RECORD_KEYS_INVALID"
  );
  assertContract(typeof record.id === "string" && record.id.length > 0, "COMPASS_PROJECTION_NODE_ID_INVALID");
  assertContract(Number.isInteger(record.worldRevision) && record.worldRevision >= 0, "COMPASS_PROJECTION_WORLD_REVISION_INVALID");
  ["screenX", "screenY", "radiusPx", "viewDepth", "normalizedDepth"].forEach(key =>
    assertFiniteNumber(record[key], `COMPASS_PROJECTION_${key.toUpperCase()}_INVALID`)
  );
  assertContract(typeof record.visible === "boolean", "COMPASS_PROJECTION_VISIBLE_INVALID");
  assertContract(Object.values(DEPTH_LAYER).includes(record.depthLayer), "COMPASS_PROJECTION_DEPTH_LAYER_INVALID");
  assertContract(typeof record.hitEligible === "boolean", "COMPASS_PROJECTION_HIT_ELIGIBLE_INVALID");
  return deepFreeze(structuredClone(record));
}

export function createCompositeNodeRecord({ world, visual, projection }) {
  const admittedWorld = validateWorldNodeRecord(world);
  const admittedVisual = validateVisualNodeRecord(visual);
  const admittedProjection = validateProjectionNodeRecord(projection);

  assertContract(
    admittedWorld.id === admittedVisual.id &&
      admittedWorld.id === admittedProjection.id,
    "COMPASS_COMPOSITE_NODE_ID_MISMATCH"
  );

  return deepFreeze({
    id: admittedWorld.id,
    world: admittedWorld,
    visual: admittedVisual,
    projection: admittedProjection
  });
}

export function validateCameraRecord(record) {
  assertExactKeys(
    record,
    RECORD_SCHEMAS.CAMERA_RECORD,
    "COMPASS_CAMERA_RECORD_KEYS_INVALID"
  );
  assertFiniteVector(record.eye, 3, "COMPASS_CAMERA_EYE_INVALID");
  assertFiniteVector(record.target, 3, "COMPASS_CAMERA_TARGET_INVALID");
  const near = assertFiniteNumber(record.near, "COMPASS_CAMERA_NEAR_INVALID");
  const far = assertFiniteNumber(record.far, "COMPASS_CAMERA_FAR_INVALID");
  assertContract(near > 0 && far > near, "COMPASS_CAMERA_RANGE_INVALID");
  return deepFreeze(structuredClone(record));
}

export function validateAdapterProjectionOutput(record, expected) {
  assertExactKeys(
    record,
    RECORD_SCHEMAS.ADAPTER_PROJECTION_OUTPUT,
    "COMPASS_ADAPTER_PROJECTION_OUTPUT_KEYS_INVALID"
  );
  assertContract(record.nodeId === expected.nodeId, "COMPASS_ADAPTER_NODE_ID_MISMATCH");
  assertContract(record.worldRevision === expected.worldRevision, "COMPASS_ADAPTER_WORLD_REVISION_MISMATCH");
  ["screenX", "screenY", "radiusPx", "viewDepth", "normalizedDepth"].forEach(key =>
    assertFiniteNumber(record[key], `COMPASS_ADAPTER_${key.toUpperCase()}_INVALID`)
  );
  assertContract(typeof record.visible === "boolean", "COMPASS_ADAPTER_VISIBLE_INVALID");
  return deepFreeze(structuredClone(record));
}

export function createValidationFinding({ id, status, details = "" }) {
  assertContract(REQUIRED_INVARIANTS.includes(id), "COMPASS_VALIDATION_ID_UNKNOWN", id);
  assertContract(Object.values(VALIDATION_STATUS).includes(status), "COMPASS_VALIDATION_STATUS_INVALID", status);
  return deepFreeze({
    id,
    status,
    pass: status === VALIDATION_STATUS.PASS,
    details: String(details)
  });
}
