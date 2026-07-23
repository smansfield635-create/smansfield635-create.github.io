import assert from "node:assert/strict";
import {
  CENTER_KIND,
  CLUSTER_RELATION,
  CONSTELLATION_RELATION,
  GEOMETRY_NODE_KIND,
  buildCartesianSeatTable,
  buildFacetedCrystalShape,
  buildRadialStarShape,
  buildStableEllipsoidalSeatTable,
  buildUvSphereShape,
  createGeometryAuthority,
  hashGeometryValue,
  stableGeometrySerialize
} from "../../assets/compass-model/compass.geometry.js";

const MATERIALS = Object.freeze([
  { id: "CRYSTAL_CAP", semanticRole: "FACET_CAP" },
  { id: "CRYSTAL_FACET", semanticRole: "FACET_SIDE" },
  { id: "STAR_FACE", semanticRole: "STAR_FACE" },
  { id: "STAR_EDGE", semanticRole: "STAR_EDGE" },
  { id: "CENTER_SURFACE", semanticRole: "CENTER_SURFACE" },
  { id: "THRESHOLD_FACE", semanticRole: "THRESHOLD_FACE" },
  { id: "THRESHOLD_EDGE", semanticRole: "THRESHOLD_EDGE" },
  { id: "COMPASS_FACE", semanticRole: "COMPASS_FACE" },
  { id: "COMPASS_EDGE", semanticRole: "COMPASS_EDGE" }
]);

const SHAPES = Object.freeze([
  buildFacetedCrystalShape({
    id: "SOURCE_DERIVED_FACETED_CRYSTAL",
    radialSegments: 8,
    capMaterialRegionId: "CRYSTAL_CAP",
    sideMaterialRegionId: "CRYSTAL_FACET"
  }),
  buildRadialStarShape({
    id: "SOURCE_DERIVED_CARDINAL_STAR",
    points: 5,
    outerRadius: 1,
    innerRadius: 0.42,
    depth: 0.32,
    faceMaterialRegionId: "STAR_FACE",
    edgeMaterialRegionId: "STAR_EDGE"
  }),
  buildUvSphereShape({
    id: "SOURCE_DERIVED_PLANET_SPHERE",
    radius: 1,
    longitudeSegments: 12,
    latitudeSegments: 8,
    materialRegionId: "CENTER_SURFACE"
  }),
  buildRadialStarShape({
    id: "SOURCE_DERIVED_MIRRORLAND_THRESHOLD",
    points: 4,
    outerRadius: 1,
    innerRadius: 0.52,
    depth: 0.20,
    faceMaterialRegionId: "THRESHOLD_FACE",
    edgeMaterialRegionId: "THRESHOLD_EDGE"
  }),
  buildRadialStarShape({
    id: "SOURCE_DERIVED_COMPASS_ROSE",
    points: 4,
    outerRadius: 1,
    innerRadius: 0.24,
    depth: 0.26,
    faceMaterialRegionId: "COMPASS_FACE",
    edgeMaterialRegionId: "COMPASS_EDGE"
  })
]);

const CARDINALS = Object.freeze([
  { id: "north", semanticId: "north", order: 0, baseVector: [0, 1, 0] },
  { id: "east", semanticId: "east", order: 1, baseVector: [1, 0, 0] },
  { id: "south", semanticId: "south", order: 2, baseVector: [0, -1, 0] },
  { id: "west", semanticId: "west", order: 3, baseVector: [-1, 0, 0] }
]);

function clone(value) {
  return structuredClone(value);
}

function seatsForCapacity(templateId, capacity, radii) {
  return buildStableEllipsoidalSeatTable({
    templateId,
    capacity,
    radii,
    latitudeAmplitude: 0.48,
    latitudeFrequency: 1.73
  }).seats;
}

function identityInput(capacityByCardinal, seatRecordsByCardinal, prefix) {
  const clusters = {};
  CARDINALS.forEach(cardinal => {
    const capacity = capacityByCardinal[cardinal.id];
    clusters[cardinal.id] = Array.from({ length: capacity }, (_, index) => ({
      id: `${prefix}-${cardinal.id}-member-${index + 1}`,
      semanticId: `${prefix}-${cardinal.id}-semantic-${index + 1}`,
      seatId: seatRecordsByCardinal[cardinal.id][index].seatId
    }));
  });
  return {
    schema: "UNIVERSAL_COMPASS_GEOMETRY_IDENTITY_INPUT_v1",
    cardinals: CARDINALS.map(cardinal => ({ ...cardinal, id: `${prefix}-${cardinal.id}`, semanticId: `${prefix}-${cardinal.id}` })),
    clusters: Object.fromEntries(CARDINALS.map(cardinal => [
      `${prefix}-${cardinal.id}`,
      clusters[cardinal.id]
    ]))
  };
}

function remapSeatRecords(seatRecordsByCardinal, prefix) {
  return Object.fromEntries(CARDINALS.map(cardinal => [
    `${prefix}-${cardinal.id}`,
    seatRecordsByCardinal[cardinal.id]
  ]));
}

function ellipsoidalProfile({
  id,
  prefix,
  constellationRadii,
  clusterRadii,
  capacityByCardinal,
  center,
  cardinalShapeId = "SOURCE_DERIVED_CARDINAL_STAR",
  memberShapeId = "SOURCE_DERIVED_FACETED_CRYSTAL"
}) {
  const rawSeats = Object.fromEntries(CARDINALS.map(cardinal => [
    cardinal.id,
    seatsForCapacity(`${id}:${cardinal.id}`, capacityByCardinal[cardinal.id], clusterRadii)
  ]));
  const seatRecords = remapSeatRecords(rawSeats, prefix);
  const clusters = Object.fromEntries(CARDINALS.map(cardinal => {
    const cardinalId = `${prefix}-${cardinal.id}`;
    return [cardinalId, {
      relation: CLUSTER_RELATION.ELLIPSOIDAL_AROUND_CARDINAL,
      capacity: capacityByCardinal[cardinal.id],
      memberShapeId,
      seatRecords: seatRecords[cardinalId],
      materialRegionIds: ["CRYSTAL_CAP", "CRYSTAL_FACET"],
      localScale: [0.68, 0.68, 0.68],
      anchorOffsets: {},
      hitShape: null
    }];
  }));
  return {
    identity: identityInput(capacityByCardinal, rawSeats, prefix),
    profile: {
      id,
      coordinateSystem: {
        handedness: "RIGHT_HANDED",
        upAxis: [0, 1, 0],
        units: "PROFILE_UNITS"
      },
      center,
      constellation: {
        relation: CONSTELLATION_RELATION.ELLIPSOIDAL,
        radii: constellationRadii,
        positionsByCardinal: {},
        cardinalShapeId,
        materialRegionIds: ["STAR_FACE", "STAR_EDGE"],
        localScale: [0.72, 0.72, 0.72],
        anchorOffsets: {},
        hitShape: null
      },
      clusters
    }
  };
}

function makeCenter({ prefix, kind, shapeId, visualIdentity, semanticId, materials, scale = [0.74, 0.74, 0.74] }) {
  return {
    id: `${prefix}-center`,
    visualIdentity,
    semanticId,
    kind,
    shapeId,
    localPosition: [0, 0, 0],
    localOrientation: [0, 0, 0, 1],
    localScale: scale,
    materialRegionIds: materials,
    anchorOffsets: {},
    hitShape: null
  };
}

function createMainFixture() {
  return ellipsoidalProfile({
    id: "MAIN_GEOMETRY_COMPATIBILITY_PROFILE",
    prefix: "main",
    constellationRadii: [1.50, 1.34, 1.16],
    clusterRadii: [1.36, 1.18, 1.04],
    capacityByCardinal: { north: 5, east: 5, south: 4, west: 5 },
    center: makeCenter({
      prefix: "main",
      kind: CENTER_KIND.CUSTOM_MIRRORLAND_THRESHOLD,
      shapeId: "SOURCE_DERIVED_MIRRORLAND_THRESHOLD",
      visualIdentity: "MIRRORLAND_STAINED_GLASS_THRESHOLD",
      semanticId: "mirrorland-threshold",
      materials: ["THRESHOLD_FACE", "THRESHOLD_EDGE"]
    })
  });
}

function createLawFixture() {
  return ellipsoidalProfile({
    id: "LAW_GEOMETRY_MECHANISM_COMPATIBILITY_PROFILE",
    prefix: "law",
    constellationRadii: [1.46, 1.28, 1.14],
    clusterRadii: [1.04, 0.90, 0.84],
    capacityByCardinal: { north: 4, east: 4, south: 4, west: 4 },
    center: makeCenter({
      prefix: "law",
      kind: CENTER_KIND.PLANET,
      shapeId: "SOURCE_DERIVED_PLANET_SPHERE",
      visualIdentity: "AUDRALIA_PLANET_VISUAL",
      semanticId: "main-compass-return",
      materials: ["CENTER_SURFACE"]
    })
  });
}

function createArchcoinFixture() {
  return ellipsoidalProfile({
    id: "ARCHCOIN_GEOMETRY_COMPATIBILITY_PROFILE",
    prefix: "archcoin",
    constellationRadii: [1.46, 1.28, 1.14],
    clusterRadii: [1.04, 0.90, 0.84],
    capacityByCardinal: { north: 4, east: 4, south: 4, west: 4 },
    center: makeCenter({
      prefix: "archcoin",
      kind: CENTER_KIND.COMPASS,
      shapeId: "SOURCE_DERIVED_COMPASS_ROSE",
      visualIdentity: "UPSTREAM_FIXED_CENTER_COMPASS",
      semanticId: "home-compass",
      materials: ["COMPASS_FACE", "COMPASS_EDGE"]
    })
  });
}

function createShowroomFixture() {
  const prefix = "showroom";
  const capacityByCardinal = { north: 4, east: 4, south: 4, west: 4 };
  const cartesian = buildCartesianSeatTable({
    templateId: "SHOWROOM_EXPLICIT_ROOM_SEATS",
    positions: [
      [-1.06, 0.94, -0.46],
      [1.06, 0.94, 0.50],
      [1.06, -0.94, -0.42],
      [-1.06, -0.94, 0.46]
    ]
  });
  const rawSeats = Object.fromEntries(CARDINALS.map(cardinal => [cardinal.id, cartesian.seats]));
  const clusters = Object.fromEntries(CARDINALS.map(cardinal => [
    `${prefix}-${cardinal.id}`,
    {
      relation: CLUSTER_RELATION.CARTESIAN_SEAT_TABLE,
      capacity: 4,
      memberShapeId: "SOURCE_DERIVED_FACETED_CRYSTAL",
      seatRecords: cartesian.seats,
      materialRegionIds: ["CRYSTAL_CAP", "CRYSTAL_FACET"],
      localScale: [0.72, 0.72, 0.72],
      anchorOffsets: {},
      hitShape: null
    }
  ]));
  return {
    identity: identityInput(capacityByCardinal, rawSeats, prefix),
    profile: {
      id: "SHOWROOM_GEOMETRY_COMPATIBILITY_PROFILE",
      coordinateSystem: { handedness: "RIGHT_HANDED", upAxis: [0, 1, 0], units: "SHOWROOM_WORLD_UNITS" },
      center: makeCenter({
        prefix,
        kind: CENTER_KIND.PLANET,
        shapeId: "SOURCE_DERIVED_PLANET_SPHERE",
        visualIdentity: "AUDRALIA_PLANET_VISUAL",
        semanticId: "main-compass-return",
        materials: ["CENTER_SURFACE"],
        scale: [0.82, 0.82, 0.82]
      }),
      constellation: {
        relation: CONSTELLATION_RELATION.CARTESIAN_SEAT_TABLE,
        radii: null,
        positionsByCardinal: {
          "showroom-north": [0, 1.68, -0.48],
          "showroom-east": [1.86, 0, 0.54],
          "showroom-south": [0, -1.68, 0.44],
          "showroom-west": [-1.86, 0, -0.58]
        },
        cardinalShapeId: "SOURCE_DERIVED_CARDINAL_STAR",
        materialRegionIds: ["STAR_FACE", "STAR_EDGE"],
        localScale: [0.82, 0.82, 0.82],
        anchorOffsets: {},
        hitShape: null
      },
      clusters
    }
  };
}

function createAuthority(fixture, geometryRevision = 1) {
  return createGeometryAuthority({
    identityInput: fixture.identity,
    geometryProfile: fixture.profile,
    shapeDefinitions: SHAPES,
    materialRegionDefinitions: MATERIALS,
    geometryRevision
  });
}

const tests = [];
function test(name, run) {
  tests.push({ name, run });
}

function expectContractError(run, code) {
  assert.throws(run, error => error && error.code === code);
}

const mainFixture = createMainFixture();
const lawFixture = createLawFixture();
const showroomFixture = createShowroomFixture();
const archcoinFixture = createArchcoinFixture();

const mainAuthority = createAuthority(mainFixture, 1);
const lawAuthority = createAuthority(lawFixture, 2);
const showroomAuthority = createAuthority(showroomFixture, 3);
const archcoinAuthority = createAuthority(archcoinFixture, 4);

for (const [label, authority] of Object.entries({ mainAuthority, lawAuthority, showroomAuthority, archcoinAuthority })) {
  test(`${label.toUpperCase()}_VALIDATION_PASS`, () => {
    assert.equal(authority.validate().status, "PASS");
  });
}

test("EXACTLY_FOUR_CARDINAL_RECORDS", () => {
  assert.equal(mainAuthority.getModel().cardinalRecords.length, 4);
});

test("MAIN_VARIABLE_CLUSTER_CAPACITY_5_5_4_5", () => {
  const templates = mainAuthority.getModel().clusterTemplates;
  assert.deepEqual(
    Object.values(templates).map(template => template.capacity),
    [5, 5, 4, 5]
  );
  assert.equal(Object.values(templates).reduce((sum, template) => sum + template.capacity, 0), 19);
});

test("MAIN_CENTER_IS_CUSTOM_MIRRORLAND_THRESHOLD", () => {
  assert.equal(mainAuthority.getModel().centerRecord.shapeId, "SOURCE_DERIVED_MIRRORLAND_THRESHOLD");
  assert.equal(mainFixture.profile.center.kind, CENTER_KIND.CUSTOM_MIRRORLAND_THRESHOLD);
});

test("LAW_CENTER_VISUAL_SEMANTIC_IDENTITIES_DIFFER", () => {
  assert.notEqual(lawFixture.profile.center.visualIdentity, lawFixture.profile.center.semanticId);
});

test("SHOWROOM_EXPLICIT_CARDINAL_POSITIONS_PRESERVED", () => {
  const byId = Object.fromEntries(showroomAuthority.getModel().cardinalRecords.map(record => [record.id, record.localPosition]));
  assert.deepEqual(byId["showroom-north"], [0, 1.68, -0.48]);
  assert.deepEqual(byId["showroom-east"], [1.86, 0, 0.54]);
  assert.deepEqual(byId["showroom-south"], [0, -1.68, 0.44]);
  assert.deepEqual(byId["showroom-west"], [-1.86, 0, -0.58]);
});

test("ARCHCOIN_ELLIPSOIDAL_CARDINAL_EMBEDDING", () => {
  const byId = Object.fromEntries(archcoinAuthority.getModel().cardinalRecords.map(record => [record.id, record.localPosition]));
  assert.deepEqual(byId["archcoin-north"], [0, 1.28, 0]);
  assert.deepEqual(byId["archcoin-east"], [1.46, 0, 0]);
});

test("STABLE_SEAT_BINDING_INDEPENDENT_OF_MEMBER_ARRAY_ORDER", () => {
  const shuffled = clone(archcoinFixture);
  Object.keys(shuffled.identity.clusters).forEach(cardinalId => {
    shuffled.identity.clusters[cardinalId].reverse();
  });
  const shuffledAuthority = createAuthority(shuffled, 4);
  assert.equal(shuffledAuthority.getHash(), archcoinAuthority.getHash());
});

test("SEAT_ID_TO_MEMBER_BINDING_IS_EXPLICIT", () => {
  const template = archcoinAuthority.getClusterTemplate("archcoin-north");
  assert.equal(template.memberRecords[0].seatId, template.seatRecords[0].seatId);
  assert.equal(template.memberRecords[0].seatIndex, 0);
});

test("ONE_SHARED_TRANSFORM_POLICY_PER_CLUSTER", () => {
  assert.ok(Object.values(mainAuthority.getModel().spatialRelations.clusters).every(record => record.transformPolicy === "ONE_SHARED_TRANSFORM_PER_CLUSTER"));
});

test("NO_MEMBER_SPECIFIC_CANONICAL_DRIFT_FIELDS", () => {
  const serialized = stableGeometrySerialize(mainAuthority.getModel());
  assert.equal(serialized.includes("floatOffset"), false);
  assert.equal(serialized.includes("spinState"), false);
  assert.equal(serialized.includes("currentPosition"), false);
  assert.equal(serialized.includes("targetPosition"), false);
});

test("SHAPE_NORMALS_FINITE_AND_NORMALIZED", () => {
  for (const shape of SHAPES) {
    for (const normal of shape.normals) {
      assert.ok(normal.every(Number.isFinite));
      assert.ok(Math.abs(Math.hypot(...normal) - 1) <= 1e-7);
    }
  }
});

test("SHAPE_BOUNDS_NONDEGENERATE", () => {
  for (const shape of SHAPES) {
    assert.ok(shape.bounds.size.every(value => value > 0));
  }
});

test("NODE_BOUNDS_AND_ANCHORS_FINITE", () => {
  const model = showroomAuthority.getModel();
  const records = [model.centerRecord, ...model.cardinalRecords, ...Object.values(model.clusterTemplates).flatMap(template => template.memberRecords)];
  for (const record of records) {
    assert.ok(record.bounds.min.every(Number.isFinite));
    assert.ok(record.visualAnchor.every(Number.isFinite));
    assert.ok(record.semanticAnchor.every(Number.isFinite));
    assert.ok(record.labelAnchor.every(Number.isFinite));
  }
});

test("LOCAL_HIT_SHAPES_EXCLUDE_PROJECTED_PIXELS", () => {
  const record = archcoinAuthority.getNode("archcoin-north");
  assert.equal(Object.hasOwn(record.hitShape, "radiusPx"), false);
  assert.equal(Object.hasOwn(record.hitShape, "screenX"), false);
});

test("MATERIAL_REGION_REFERENTIAL_INTEGRITY", () => {
  const materialIds = new Set(MATERIALS.map(material => material.id));
  for (const shape of SHAPES) {
    assert.ok(shape.triangleMaterialRegionIds.every(id => materialIds.has(id)));
  }
});

test("GEOMETRY_PUBLICATION_DEEPLY_IMMUTABLE", () => {
  const model = mainAuthority.getModel();
  assert.equal(Object.isFrozen(model), true);
  assert.equal(Object.isFrozen(model.cardinalRecords), true);
  assert.equal(Object.isFrozen(model.cardinalRecords[0]), true);
  assert.throws(() => { model.cardinalRecords[0].localPosition[0] = 99; }, TypeError);
});

test("DETERMINISTIC_GEOMETRY_HASH", () => {
  const second = createAuthority(createMainFixture(), 1);
  assert.equal(second.getHash(), mainAuthority.getHash());
  assert.equal(hashGeometryValue({ b: 2, a: 1 }), hashGeometryValue({ a: 1, b: 2 }));
});

test("RENDERER_CONSUMPTION_SNAPSHOT_COMPLETE", () => {
  const snapshot = mainAuthority.getRendererConsumptionSnapshot();
  assert.equal(snapshot.schema, "UNIVERSAL_COMPASS_GEOMETRY_RENDERER_SNAPSHOT_v1");
  assert.equal(snapshot.geometryHash, mainAuthority.getHash());
  assert.ok(snapshot.shapeDefinitions.length >= 3);
});

test("COMPOSITOR_INPUT_EXCLUDES_PROJECTION_RESULTS", () => {
  const snapshot = mainAuthority.getCompositorProjectionInput();
  assert.equal(snapshot.schema, "UNIVERSAL_COMPASS_GEOMETRY_COMPOSITOR_INPUT_v1");
  const serialized = stableGeometrySerialize(snapshot);
  for (const prohibited of ["screenX", "screenY", "radiusPx", "depthLayer", "camera", "viewMatrix", "projectionMatrix"]) {
    assert.equal(serialized.includes(prohibited), false, prohibited);
  }
});

test("GEOMETRY_EXCLUDES_CONTROLLER_AND_NAVIGATION_STATE", () => {
  const serialized = stableGeometrySerialize(mainAuthority.getModel());
  for (const prohibited of ["selectedNode", "transactionPhase", "routeKey", "navigation", "pointerId", "gestureActive"]) {
    assert.equal(serialized.includes(prohibited), false, prohibited);
  }
});

test("GEOMETRY_EXCLUDES_RENDERER_RESOURCES", () => {
  const serialized = stableGeometrySerialize(showroomAuthority.getModel());
  for (const prohibited of ["WebGL", "canvas", "shader", "buffer", "requestAnimationFrame"]) {
    assert.equal(serialized.includes(prohibited), false, prohibited);
  }
});

test("OPTIONAL_CENTER_NONE_SUPPORTED", () => {
  const fixture = createArchcoinFixture();
  fixture.profile.center = null;
  const authority = createAuthority(fixture, 5);
  assert.equal(authority.getModel().centerRecord, null);
  assert.equal(authority.getModel().spatialRelations.centerToCardinal, "NO_CENTER_PARTICIPANT");
});

test("CENTER_NOT_IN_CARDINAL_REGISTRY", () => {
  const model = lawAuthority.getModel();
  assert.equal(model.cardinalRecords.some(record => record.id === model.centerRecord.id), false);
});

test("DUPLICATE_NODE_ID_REJECTED", () => {
  const fixture = createMainFixture();
  fixture.identity.clusters["main-north"][0].id = "main-north";
  expectContractError(() => createAuthority(fixture), "COMPASS_GEOMETRY_NODE_ID_DUPLICATE");
});

test("DUPLICATE_SEAT_ID_REJECTED", () => {
  const fixture = clone(createArchcoinFixture());
  const cluster = fixture.profile.clusters["archcoin-north"];
  cluster.seatRecords[1].seatId = cluster.seatRecords[0].seatId;
  expectContractError(() => createAuthority(fixture), "COMPASS_GEOMETRY_CLUSTER_SEAT_ID_DUPLICATE");
});

test("MISSING_MEMBER_SEAT_BINDING_REJECTED", () => {
  const fixture = createArchcoinFixture();
  fixture.identity.clusters["archcoin-north"][0].seatId = "unknown-seat";
  expectContractError(() => createAuthority(fixture), "COMPASS_GEOMETRY_CLUSTER_MEMBER_SEAT_UNKNOWN");
});

test("CLUSTER_CAPACITY_MISMATCH_REJECTED", () => {
  const fixture = createMainFixture();
  fixture.identity.clusters["main-north"].pop();
  expectContractError(() => createAuthority(fixture), "COMPASS_GEOMETRY_CLUSTER_IDENTITY_CAPACITY_MISMATCH");
});

test("UNKNOWN_SHAPE_REJECTED", () => {
  const fixture = createMainFixture();
  fixture.profile.constellation.cardinalShapeId = "missing-shape";
  expectContractError(() => createAuthority(fixture), "COMPASS_GEOMETRY_CARDINAL_SHAPE_UNKNOWN");
});

test("UNKNOWN_MATERIAL_REGION_REJECTED", () => {
  const fixture = createMainFixture();
  fixture.profile.constellation.materialRegionIds = ["missing-region"];
  expectContractError(() => createAuthority(fixture), "COMPASS_GEOMETRY_NODE_MATERIAL_REGION_UNKNOWN");
});

test("SPHERICAL_RELATION_REJECTS_UNEQUAL_RADII", () => {
  const fixture = createArchcoinFixture();
  fixture.profile.constellation.relation = CONSTELLATION_RELATION.SPHERICAL;
  expectContractError(() => createAuthority(fixture), "COMPASS_GEOMETRY_SPHERICAL_RADII_NOT_EQUAL");
});

test("ELLIPSOIDAL_RELATION_ACCEPTS_UNEQUAL_RADII", () => {
  assert.equal(archcoinAuthority.getModel().spatialRelations.constellation.relation, CONSTELLATION_RELATION.ELLIPSOIDAL);
});

test("GEOMETRY_REVISION_AND_HASH_PUBLISHED", () => {
  const model = showroomAuthority.getModel();
  assert.equal(model.geometryRevision, 3);
  assert.match(model.geometryHash, /^fnv1a32:[0-9a-f]{8}$/);
});

test("WORLD_SUPPLIED_SEMANTIC_IDENTITIES_PRESERVED", () => {
  assert.equal(archcoinAuthority.getNode("archcoin-east").semanticId, "archcoin-east");
  assert.equal(archcoinAuthority.getNode("archcoin-east-member-1").semanticId, "archcoin-east-semantic-1");
});

test("CARDINAL_AND_CLUSTER_GEOMETRY_KINDS_DISTINCT", () => {
  assert.equal(mainAuthority.getNode("main-north").kind, GEOMETRY_NODE_KIND.CARDINAL);
  assert.equal(mainAuthority.getNode("main-north-member-1").kind, GEOMETRY_NODE_KIND.CLUSTER_MEMBER);
  assert.equal(mainAuthority.getModel().centerRecord.kind, GEOMETRY_NODE_KIND.CENTER);
});

const results = [];
let failed = 0;
for (const entry of tests) {
  try {
    entry.run();
    results.push({ test: entry.name, status: "PASS" });
  } catch (error) {
    failed += 1;
    results.push({
      test: entry.name,
      status: "FAIL",
      code: error?.code || "",
      message: error?.message || String(error)
    });
  }
}

const receipt = {
  schema: "UNIVERSAL_COMPASS_GEOMETRY_AUTHORITY_FIXTURE_EXECUTION_v1",
  status: failed === 0 ? "PASS" : "FAIL",
  executionEnvironment: `Node.js ${process.version}`,
  testCount: results.length,
  passed: results.length - failed,
  failed,
  sourceFamilyCompatibility: {
    MAIN: mainAuthority.validate().status,
    LAW: lawAuthority.validate().status,
    SHOWROOM: showroomAuthority.validate().status,
    ARCHCOIN: archcoinAuthority.validate().status
  },
  geometryHashes: {
    MAIN: mainAuthority.getHash(),
    LAW: lawAuthority.getHash(),
    SHOWROOM: showroomAuthority.getHash(),
    ARCHCOIN: archcoinAuthority.getHash()
  },
  results,
  productionAuthority: false,
  referenceModelAuthority: false
};

console.log(JSON.stringify(receipt, null, 2));
if (failed > 0) process.exitCode = 1;
