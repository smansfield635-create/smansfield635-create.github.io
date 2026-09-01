/*
 * Universal Compass immutable world authority.
 * Neutral seven-file compatibility implementation.
 *
 * Owns identity, membership, parentage, canonical order, and complete world
 * transforms. Owns no presentation, projection, rendering, interaction,
 * navigation, route, product, or production authority.
 */

function fail(code, details = null) {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

function assert(condition, code, details = null) {
  if (!condition) fail(code, details);
}

function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function") ||
    seen.has(value)
  ) return value;
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) deepFreeze(value[key], seen);
  return Object.freeze(value);
}

function plainRecord(value, code) {
  assert(
    value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      [Object.prototype, null].includes(Object.getPrototypeOf(value)),
    code,
    value
  );
  return value;
}

function exactKeys(value, keys, code) {
  plainRecord(value, code);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  assert(
    actual.length === expected.length &&
      actual.every((key, index) => key === expected[index]),
    code,
    deepFreeze({ actual, expected })
  );
  return value;
}

function finite(value, code) {
  const admitted = Number(value);
  assert(Number.isFinite(admitted), code, value);
  return Object.is(admitted, -0) ? 0 : admitted;
}

function id(value, code) {
  const admitted = String(value ?? "").trim();
  assert(admitted.length > 0, code, value);
  return admitted;
}

function vector3(value, code, positive = false) {
  assert(Array.isArray(value) && value.length === 3, code, value);
  const admitted = value.map(component => finite(component, code));
  assert(!positive || admitted.every(component => component > 0), code, admitted);
  return admitted;
}

function quaternion(value, code) {
  assert(Array.isArray(value) && value.length === 4, code, value);
  const admitted = value.map(component => finite(component, code));
  const length = Math.hypot(...admitted);
  assert(length > 1e-8, code, value);
  return admitted.map(component => component / length);
}

function quaternionFromZ(angle) {
  const half = finite(angle, "COMPASS_PLANET_ANGLE_INVALID") * 0.5;
  return quaternion([0, 0, Math.sin(half), Math.cos(half)], "COMPASS_PLANET_QUATERNION_INVALID");
}

function multiplyQuaternion(a, b) {
  const left = quaternion(a, "COMPASS_PLANET_QUATERNION_INVALID");
  const right = quaternion(b, "COMPASS_PLANET_QUATERNION_INVALID");
  return quaternion([
    left[3] * right[0] + left[0] * right[3] + left[1] * right[2] - left[2] * right[1],
    left[3] * right[1] - left[0] * right[2] + left[1] * right[3] + left[2] * right[0],
    left[3] * right[2] + left[0] * right[1] - left[1] * right[0] + left[2] * right[3],
    left[3] * right[3] - left[0] * right[0] - left[1] * right[1] - left[2] * right[2]
  ], "COMPASS_PLANET_QUATERNION_MULTIPLICATION_INVALID");
}

function add3(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, stableValue(value[key])])
    );
  }
  return typeof value === "number"
    ? finite(value, "COMPASS_PLANET_NONFINITE_NUMBER")
    : value;
}

export function stableWorldSerialize(value) {
  return JSON.stringify(stableValue(value));
}

export function hashWorldValue(value) {
  const source = stableWorldSerialize(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, "0")}`;
}

export const WORLD_NODE_KIND = deepFreeze({
  CENTER: "CENTER",
  CARDINAL: "CARDINAL",
  CHILD: "CHILD"
});

export const CARDINAL_ID = deepFreeze({
  NORTH: "NORTH",
  EAST: "EAST",
  SOUTH: "SOUTH",
  WEST: "WEST"
});

export const UNIVERSAL_COMPASS_PLANET_CONTRACT = deepFreeze({
  id: "DGB_UNIVERSAL_COMPASS_PLANET_NEUTRAL_COMPATIBILITY_v1",
  namespace: "DGB_UNIVERSAL_COMPASS",
  schemaPrefix: "UNIVERSAL_COMPASS_",
  authority: "IMMUTABLE_WORLD_TRUTH",
  identityAuthority: true,
  membershipAuthority: true,
  parentageAuthority: true,
  canonicalOrderAuthority: true,
  worldTransformAuthority: true,
  presentationAuthority: false,
  visualGeometryAuthority: false,
  projectionAuthority: false,
  controllerAuthority: false,
  interactionAuthority: false,
  navigationAuthority: false,
  routeAuthority: false,
  productAuthority: false,
  productionAuthority: false,
  externalContractAuthority: false,
  externalMathAuthority: false,
  externalIdentityAuthority: false,
  externalProfileAuthority: false,
  recordImmutability: "DEEP"
});

const SCHEMA = deepFreeze({
  world: "UNIVERSAL_COMPASS_WORLD_SNAPSHOT_v1",
  validation: "UNIVERSAL_COMPASS_WORLD_VALIDATION_RECEIPT_v1",
  identities: "UNIVERSAL_COMPASS_IDENTITY_REGISTRY_v1",
  memberships: "UNIVERSAL_COMPASS_MEMBERSHIP_REGISTRY_v1",
  cluster: "UNIVERSAL_COMPASS_CLUSTER_MEMBERSHIP_v1"
});
const WORLD_REVISION = 1;
const PROFILE_REVISION = 1;
const RECORD_KEYS = deepFreeze([
  "id", "kind", "parentId", "canonicalOrder",
  "worldPosition", "worldOrientation", "worldScale"
]);
const PROHIBITED_FIELDS = deepFreeze([
  "routeKey", "route", "domain", "destination", "navigation",
  "product", "productId", "semantic", "presentation", "primaryId",
  "alignmentScore", "depthScore", "screenX", "screenY", "radiusPx",
  "visible", "depthLayer"
]);
const PROFILE = deepFreeze({
  id: "DGB_UNIVERSAL_COMPASS_LOCKED_NEUTRAL_WORLD_PROFILE_v1",
  centerPosition: [0, 0, 10],
  centerScale: [1, 1, 1],
  cardinalRadius: 2.4,
  cardinalScale: [1, 1, 1],
  childRadius: 0.7,
  childDepthOffset: 0.2,
  childScale: [0.5, 0.5, 0.5],
  cardinals: [
    { id: "NORTH", clusterId: "NORTH_CLUSTER", angle: Math.PI * 0.5, direction: [0, 1, 0] },
    { id: "EAST", clusterId: "EAST_CLUSTER", angle: 0, direction: [1, 0, 0] },
    { id: "SOUTH", clusterId: "SOUTH_CLUSTER", angle: -Math.PI * 0.5, direction: [0, -1, 0] },
    { id: "WEST", clusterId: "WEST_CLUSTER", angle: Math.PI, direction: [-1, 0, 0] }
  ],
  childAngles: [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]
});

function worldRecord(source) {
  const record = {
    id: id(source.id, "COMPASS_PLANET_WORLD_ID_REQUIRED"),
    kind: String(source.kind ?? "").toUpperCase(),
    parentId: String(source.parentId ?? "").trim(),
    canonicalOrder: source.canonicalOrder,
    worldPosition: vector3(source.worldPosition, "COMPASS_PLANET_WORLD_POSITION_INVALID"),
    worldOrientation: quaternion(source.worldOrientation, "COMPASS_PLANET_WORLD_ORIENTATION_INVALID"),
    worldScale: vector3(source.worldScale, "COMPASS_PLANET_WORLD_SCALE_INVALID", true)
  };
  assert(Object.values(WORLD_NODE_KIND).includes(record.kind), "COMPASS_PLANET_WORLD_KIND_INVALID", record.kind);
  assert(Number.isInteger(record.canonicalOrder) && record.canonicalOrder >= 0, "COMPASS_PLANET_CANONICAL_ORDER_INVALID", record.canonicalOrder);
  exactKeys(record, RECORD_KEYS, "COMPASS_PLANET_WORLD_RECORD_KEYS_INVALID");
  return deepFreeze(record);
}

function buildRecords() {
  const records = [worldRecord({
    id: "CENTER",
    kind: WORLD_NODE_KIND.CENTER,
    parentId: "",
    canonicalOrder: 0,
    worldPosition: PROFILE.centerPosition,
    worldOrientation: [0, 0, 0, 1],
    worldScale: PROFILE.centerScale
  })];
  const positions = new Map();
  const orientations = new Map();
  for (const cardinal of PROFILE.cardinals) {
    const position = add3(PROFILE.centerPosition, cardinal.direction.map(value => value * PROFILE.cardinalRadius));
    const orientation = quaternionFromZ(cardinal.angle);
    positions.set(cardinal.id, position);
    orientations.set(cardinal.id, orientation);
    records.push(worldRecord({
      id: cardinal.id,
      kind: WORLD_NODE_KIND.CARDINAL,
      parentId: "",
      canonicalOrder: records.length,
      worldPosition: position,
      worldOrientation: orientation,
      worldScale: PROFILE.cardinalScale
    }));
  }
  for (const cardinal of PROFILE.cardinals) {
    PROFILE.childAngles.forEach((angle, childIndex) => {
      const worldAngle = cardinal.angle + angle;
      records.push(worldRecord({
        id: `${cardinal.id}_CHILD_${childIndex + 1}`,
        kind: WORLD_NODE_KIND.CHILD,
        parentId: cardinal.id,
        canonicalOrder: records.length,
        worldPosition: add3(positions.get(cardinal.id), [
          Math.cos(worldAngle) * PROFILE.childRadius,
          Math.sin(worldAngle) * PROFILE.childRadius,
          PROFILE.childDepthOffset
        ]),
        worldOrientation: multiplyQuaternion(orientations.get(cardinal.id), quaternionFromZ(angle)),
        worldScale: PROFILE.childScale
      }));
    });
  }
  return deepFreeze(records);
}

function buildRegistries(records) {
  const centerId = records.find(record => record.kind === WORLD_NODE_KIND.CENTER)?.id || "";
  const cardinalIds = records.filter(record => record.kind === WORLD_NODE_KIND.CARDINAL).map(record => record.id);
  const childIds = records.filter(record => record.kind === WORLD_NODE_KIND.CHILD).map(record => record.id);
  const identities = deepFreeze({
    schema: SCHEMA.identities,
    centerId,
    cardinalIds,
    childIds,
    worldRecordIds: records.map(record => record.id),
    identityCount: records.length
  });
  const byId = new Map(records.map(record => [record.id, record]));
  const clusters = PROFILE.cardinals.map(cardinal => {
    const members = childIds.filter(childId => byId.get(childId).parentId === cardinal.id);
    return deepFreeze({
      schema: SCHEMA.cluster,
      id: cardinal.clusterId,
      cardinalId: cardinal.id,
      childIds: members,
      memberCount: members.length
    });
  });
  const memberships = deepFreeze({
    schema: SCHEMA.memberships,
    clusterCount: clusters.length,
    clusters,
    clusterIds: clusters.map(cluster => cluster.id),
    cardinalToClusterId: deepFreeze(Object.fromEntries(clusters.map(cluster => [cluster.cardinalId, cluster.id]))),
    childToCardinalId: deepFreeze(Object.fromEntries(childIds.map(childId => [childId, byId.get(childId).parentId])))
  });
  return deepFreeze({ identities, memberships });
}

function finding(id, pass, details = null) {
  return deepFreeze({ id, pass: Boolean(pass), status: pass ? "PASS" : "FAIL", details });
}

function validationReceipt(records, identities, memberships, worldHash) {
  const cardinalIds = new Set(identities.cardinalIds);
  const childIds = new Set(identities.childIds);
  const clusterChildren = memberships.clusters.flatMap(cluster => cluster.childIds);
  const counts = Object.fromEntries(identities.cardinalIds.map(cardinalId => [
    cardinalId,
    records.filter(record => record.kind === WORLD_NODE_KIND.CHILD && record.parentId === cardinalId).length
  ]));
  const findings = [
    finding("EXACT_RECORD_COUNT", records.length === 21, records.length),
    finding("UNIQUE_IDENTITIES", new Set(records.map(record => record.id)).size === 21),
    finding("EXACT_ONE_CENTER", records.filter(record => record.kind === WORLD_NODE_KIND.CENTER).length === 1),
    finding("EXACT_FOUR_CARDINALS", cardinalIds.size === 4, cardinalIds.size),
    finding("EXACT_SIXTEEN_CHILDREN", childIds.size === 16, childIds.size),
    finding("EXACT_FOUR_CLUSTERS", memberships.clusters.length === 4, memberships.clusters.length),
    finding("EXACT_FOUR_CHILDREN_PER_CARDINAL", Object.values(counts).every(count => count === 4), deepFreeze(counts)),
    finding("CENTER_PARENT_PROHIBITED", records.filter(record => record.kind === WORLD_NODE_KIND.CENTER).every(record => record.parentId === "")),
    finding("CARDINAL_PARENT_PROHIBITED", records.filter(record => record.kind === WORLD_NODE_KIND.CARDINAL).every(record => record.parentId === "")),
    finding("CHILD_PARENTAGE_VALID", records.filter(record => record.kind === WORLD_NODE_KIND.CHILD).every(record => cardinalIds.has(record.parentId))),
    finding("CANONICAL_ORDER_CONTIGUOUS", records.every((record, index) => record.canonicalOrder === index)),
    finding("EXACT_WORLD_RECORD_KEYS", records.every(record => JSON.stringify(Object.keys(record).sort()) === JSON.stringify([...RECORD_KEYS].sort()))),
    finding("COMPLETE_FINITE_WORLD_TRANSFORMS", records.every(record => [...record.worldPosition, ...record.worldOrientation, ...record.worldScale].every(Number.isFinite))),
    finding("NORMALIZED_WORLD_ORIENTATIONS", records.every(record => Math.abs(Math.hypot(...record.worldOrientation) - 1) <= 1e-7)),
    finding("POSITIVE_WORLD_SCALES", records.every(record => record.worldScale.every(component => component > 0))),
    finding("CLUSTER_CARDINAL_BIJECTION", new Set(memberships.clusters.map(cluster => cluster.cardinalId)).size === 4),
    finding("CLUSTER_CHILD_COVERAGE_EXACT", clusterChildren.length === 16 && new Set(clusterChildren).size === 16 && clusterChildren.every(childId => childIds.has(childId))),
    finding("NO_PROHIBITED_WORLD_FIELDS", records.every(record => PROHIBITED_FIELDS.every(field => !(field in record)))),
    finding("IMMUTABLE_WORLD_PUBLICATION", Object.isFrozen(records) && records.every(record => Object.isFrozen(record) && Object.isFrozen(record.worldPosition) && Object.isFrozen(record.worldOrientation) && Object.isFrozen(record.worldScale)) && Object.isFrozen(identities) && Object.isFrozen(memberships)),
    finding("WORLD_REVISION_LOCKED", WORLD_REVISION === 1, WORLD_REVISION),
    finding("DETERMINISTIC_WORLD_HASH_PRESENT", typeof worldHash === "string" && worldHash.startsWith("fnv1a32:"), worldHash)
  ];
  const failed = findings.filter(record => !record.pass);
  const body = {
    schema: SCHEMA.validation,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: {
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      worldRecordCount: records.length,
      centerCount: 1,
      cardinalCount: identities.cardinalIds.length,
      clusterCount: memberships.clusters.length,
      childCount: identities.childIds.length
    },
    worldRevision: WORLD_REVISION,
    worldProfileRevision: PROFILE_REVISION,
    worldHash,
    findings,
    productAuthority: false,
    runtimeAcceptanceAuthority: false,
    productionAuthority: false
  };
  return deepFreeze({ ...body, receiptHash: hashWorldValue(body) });
}

function buildWorld() {
  const records = buildRecords();
  const { identities, memberships } = buildRegistries(records);
  const hashBody = {
    schema: SCHEMA.world,
    worldRevision: WORLD_REVISION,
    worldProfileRevision: PROFILE_REVISION,
    records,
    identityRegistry: identities,
    membershipRegistry: memberships
  };
  const worldHash = hashWorldValue(hashBody);
  const receipt = validationReceipt(records, identities, memberships, worldHash);
  assert(receipt.status === "PASS", "COMPASS_PLANET_WORLD_VALIDATION_FAILED", receipt);
  const snapshot = deepFreeze({
    ...hashBody,
    worldHash,
    validationReceipt: receipt
  });
  return deepFreeze({ records, identities, memberships, worldHash, receipt, snapshot });
}

export function createPlanetAuthority(options = {}) {
  exactKeys(options, [], "COMPASS_PLANET_EXTERNAL_CONFIGURATION_PROHIBITED");
  const world = buildWorld();
  const byId = new Map(world.records.map(record => [record.id, record]));
  const clusterById = new Map(world.memberships.clusters.map(cluster => [cluster.id, cluster]));
  const clusterByCardinal = new Map(world.memberships.clusters.map(cluster => [cluster.cardinalId, cluster]));
  const getWorldRecord = identity => byId.get(String(identity ?? "")) || null;
  const hasKind = (identity, kind) => getWorldRecord(identity)?.kind === kind;
  const getChildrenForCardinal = cardinalId => {
    const cluster = clusterByCardinal.get(String(cardinalId ?? ""));
    return cluster ? deepFreeze(cluster.childIds.map(childId => byId.get(childId))) : deepFreeze([]);
  };
  const validate = (snapshot = world.snapshot) => {
    assert(snapshot === world.snapshot, "COMPASS_PLANET_FOREIGN_WORLD_SNAPSHOT_PROHIBITED");
    assert(snapshot.worldHash === world.worldHash, "COMPASS_PLANET_WORLD_HASH_MISMATCH");
    assert(snapshot.validationReceipt?.status === "PASS", "COMPASS_PLANET_WORLD_VALIDATION_RECEIPT_INVALID");
    return world.receipt;
  };
  return Object.freeze({
    contract: UNIVERSAL_COMPASS_PLANET_CONTRACT,
    getWorldSnapshot: () => world.snapshot,
    getWorldRevision: () => WORLD_REVISION,
    getRevision: () => WORLD_REVISION,
    getWorldProfileRevision: () => PROFILE_REVISION,
    getWorldHash: () => world.worldHash,
    getValidationReceipt: () => world.receipt,
    getIdentityRegistry: () => world.identities,
    getMembershipRegistry: () => world.memberships,
    getWorldRecord,
    getRecord: getWorldRecord,
    hasIdentity: identity => byId.has(String(identity ?? "")),
    hasCenter: (identity = world.identities.centerId) => hasKind(identity, WORLD_NODE_KIND.CENTER),
    hasCardinal: identity => hasKind(identity, WORLD_NODE_KIND.CARDINAL),
    hasChild: identity => hasKind(identity, WORLD_NODE_KIND.CHILD),
    isChildOfCardinal: (childId, cardinalId) => {
      const child = getWorldRecord(childId);
      return Boolean(child?.kind === WORLD_NODE_KIND.CHILD && child.parentId === String(cardinalId ?? "") && hasKind(cardinalId, WORLD_NODE_KIND.CARDINAL));
    },
    getChildrenForCardinal,
    getCluster: clusterId => clusterById.get(String(clusterId ?? "")) || null,
    getClusterForCardinal: cardinalId => clusterByCardinal.get(String(cardinalId ?? "")) || null,
    validate
  });
}

export const createWorldAuthority = createPlanetAuthority;
