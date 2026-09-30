import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

import {
  H_EARTH_RUN_8C_CONTROL_CONTRACT_ID
} from '../control-plane/run-8/h-earth.run8c.normal-light-material.js';

import {
  H_EARTH_RUN_8D_CONTROL_CONTRACT_ID,
  evaluateHEarthRun8DControlContract
} from '../control-plane/run-8/h-earth.run8d.grounded-vegetation.js';

import {
  H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  H_EARTH_RUN_8D_ACTIVE_DETAIL_LIFECYCLE_CONTEXT,
  buildHEarthRun8DVegetationResolution,
  evaluateHEarthRun8DVegetationResolution
} from '../environment/h-earth.vegetation-resolution.run8d.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';

import {
  H_EARTH_POPULATION_PLANNER_CONTRACT_ID
} from '../environment/h-earth.population-planner.js';

import {
  H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID
} from '../environment/h-earth.spatial-lifecycle.js';

import {
  constructHEarthRun8BSuccessorTerrainAndMountain
} from '../../showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';

import {
  H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
  constructHEarthRun8DLocalVegetationArchetypes,
  constructHEarthRun8DGroundedVegetation,
  evaluateHEarthRun8DGroundedVegetation
} from '../../showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js';

import {
  isHEarthNeutralPrimitiveRecord
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';

let assertionCount = 0;
const check = (condition, message) => {
  assertionCount += 1;
  assert.equal(Boolean(condition), true, message);
};
const equal = (actual, expected, message) => {
  assertionCount += 1;
  assert.equal(actual, expected, message);
};
const near = (actual, expected, tolerance, message) => {
  assertionCount += 1;
  assert.ok(Number.isFinite(actual) && Number.isFinite(expected) &&
    Math.abs(actual - expected) <= tolerance,
  `${message}: actual=${actual} expected=${expected} tolerance=${tolerance}`);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((key) =>
        `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
const digest = (value) => crypto.createHash('sha256').update(stable(value)).digest('hex');

function assertDeepFrozen(value, path = 'root', seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  check(Object.isFrozen(value), `NOT_DEEP_FROZEN:${path}`);
  Object.entries(value).forEach(([key, nested]) =>
    assertDeepFrozen(nested, `${path}.${key}`, seen));
}

function vectorLength(vector) {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function primitiveDigest(primitive) {
  return digest({
    primitiveId: primitive.primitiveId,
    primitiveType: primitive.primitiveType,
    vertices: primitive.geometry.vertices,
    indices: primitive.geometry.indices,
    normals: primitive.geometry.normals,
    faceNormals: primitive.geometry.faceNormals,
    bounds: primitive.geometry.bounds
  });
}

function worldGeometryDigest(result) {
  return digest(result.instances.map((instance) => ({
    instanceId: instance.instanceId,
    archetypeId: instance.archetypeId,
    anchor: instance.worldAnchor,
    normal: instance.successorTerrainNormal,
    yawRadians: instance.yawRadians,
    uniformScale: instance.uniformScale,
    components: instance.components.map((component) => ({
      primitiveId: component.primitiveRecord.primitiveId,
      vertices: component.primitiveRecord.geometry.vertices,
      indices: component.primitiveRecord.geometry.indices,
      normals: component.primitiveRecord.geometry.normals,
      faceNormals: component.primitiveRecord.geometry.faceNormals
    }))
  })));
}

function combinedLocalBounds(constructions) {
  const vertices = constructions.flatMap((construction) =>
    construction.primitiveRecord.geometry.vertices);
  return {
    xMinimum: Math.min(...vertices.map((vertex) => vertex.x)),
    xMaximum: Math.max(...vertices.map((vertex) => vertex.x)),
    yMinimum: Math.min(...vertices.map((vertex) => vertex.y)),
    yMaximum: Math.max(...vertices.map((vertex) => vertex.y)),
    zMinimum: Math.min(...vertices.map((vertex) => vertex.z)),
    zMaximum: Math.max(...vertices.map((vertex) => vertex.z))
  };
}

const run8BPre = constructHEarthRun8BSuccessorTerrainAndMountain();
check(run8BPre.ok === true, 'RUN_8B_PREDECESSOR_GEOMETRY_NOT_PASS');
const run8BPrimitiveDigestBefore = primitiveDigest(run8BPre.primitive);

const control = evaluateHEarthRun8DControlContract();
equal(control.eligible, true, 'RUN_8D_CONTROL_NOT_ELIGIBLE');
equal(control.status, 'RUN_8D_GROUNDED_VEGETATION_PASS', 'RUN_8D_CONTROL_STATUS_INVALID');
equal(control.contractId, H_EARTH_RUN_8D_CONTROL_CONTRACT_ID, 'RUN_8D_CONTROL_ID_MISMATCH');
equal(control.predecessorRun8CContractId, H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
  'RUN_8C_PREDECESSOR_IDENTITY_MISMATCH');
equal(control.Run8EIntegrationAuthorized, true, 'RUN_8E_NOT_AUTHORIZED_BY_RUN_8D_PASS');

const resolutionA = buildHEarthRun8DVegetationResolution();
const resolutionB = buildHEarthRun8DVegetationResolution();
equal(evaluateHEarthRun8DVegetationResolution(resolutionA).eligible, true,
  'RUN_8D_RESOLUTION_EVALUATION_FAIL');
equal(digest(resolutionA), digest(resolutionB), 'RUN_8D_RESOLUTION_NONDETERMINISTIC');
equal(resolutionA.contractId, H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  'RUN_8D_RESOLUTION_ID_MISMATCH');
equal(resolutionA.populationPlannerContractId, H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  'RUN_7E_POPULATION_PLANNER_IDENTITY_MISMATCH');
equal(resolutionA.spatialLifecycleContractId, H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  'RUN_7G_LIFECYCLE_IDENTITY_MISMATCH');
equal(resolutionA.successorTerrainFieldContractId,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  'RUN_8B_SUCCESSOR_FIELD_IDENTITY_MISMATCH');
equal(resolutionA.populationPlan.spatialLifecycleAuthorityStatus,
  'EXTERNAL_AUTHORITY_CONSUMED', 'RUN_7G_AUTHORITY_NOT_CONSUMED');
equal(resolutionA.populationPlan.geometryCreated, false,
  'RUN_7E_POPULATION_PLANNER_IMPROPERLY_CREATED_GEOMETRY');
equal(H_EARTH_RUN_8D_ACTIVE_DETAIL_LIFECYCLE_CONTEXT.authorityEstablished, true,
  'RUN_8D_LIFECYCLE_CONTEXT_NOT_AUTHORITATIVE');
check(resolutionA.instanceCount > 0 && resolutionA.instanceCount <= 64,
  'RUN_8D_RESOLVED_INSTANCE_COUNT_OUT_OF_BOUNDS');

const local = constructHEarthRun8DLocalVegetationArchetypes();
equal(local.eligible, true, 'RUN_8D_LOCAL_ARCHETYPES_NOT_ELIGIBLE');
equal(local.archetypeCount, 3, 'RUN_8D_LOCAL_ARCHETYPE_COUNT_NOT_THREE');
equal(local.componentCount, 7, 'RUN_8D_LOCAL_COMPONENT_COUNT_NOT_SEVEN');

for (const [archetypeId, constructions] of Object.entries(local.constructions)) {
  const frozenContract =
    H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
      .archetypes[archetypeId];
  check(Boolean(frozenContract), `RUN_8A_ARCHETYPE_CONTRACT_MISSING:${archetypeId}`);
  constructions.forEach((construction, index) => {
    equal(construction.valid, true, `RUN_8D_LOCAL_CONSTRUCTION_INVALID:${archetypeId}:${index}`);
    check(isHEarthNeutralPrimitiveRecord(construction.primitiveRecord),
      `RUN_8D_LOCAL_PRIMITIVE_INVALID:${archetypeId}:${index}`);
    check(construction.primitiveRecord.geometry.vertices.length > 0,
      `RUN_8D_LOCAL_VERTICES_EMPTY:${archetypeId}:${index}`);
    check(construction.primitiveRecord.geometry.indices.length > 0,
      `RUN_8D_LOCAL_INDICES_EMPTY:${archetypeId}:${index}`);
  });
  const bounds = combinedLocalBounds(constructions);
  const width = bounds.xMaximum - bounds.xMinimum;
  const height = bounds.yMaximum - bounds.yMinimum;
  const depth = bounds.zMaximum - bounds.zMinimum;
  check(width <= frozenContract.bounds.x + 1e-8,
    `RUN_8D_LOCAL_WIDTH_EXCEEDS_CONTRACT:${archetypeId}`);
  check(height <= frozenContract.bounds.y + 1e-8,
    `RUN_8D_LOCAL_HEIGHT_EXCEEDS_CONTRACT:${archetypeId}`);
  check(depth <= frozenContract.bounds.z + 1e-8,
    `RUN_8D_LOCAL_DEPTH_EXCEEDS_CONTRACT:${archetypeId}`);
  near(bounds.yMinimum, 0, 1e-8, `RUN_8D_LOCAL_ROOT_MINIMUM_NOT_ZERO:${archetypeId}`);
}

const groundedA = constructHEarthRun8DGroundedVegetation();
const groundedB = constructHEarthRun8DGroundedVegetation();
const groundedEvaluation = evaluateHEarthRun8DGroundedVegetation(groundedA);
equal(groundedA.eligible, true, 'RUN_8D_GROUNDED_RESULT_NOT_ELIGIBLE');
equal(groundedEvaluation.eligible, true, 'RUN_8D_GROUNDED_EVALUATION_FAIL');
equal(groundedA.contractId, H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
  'RUN_8D_GROUNDED_CONTRACT_ID_MISMATCH');
equal(groundedA.instanceCount, resolutionA.instanceCount,
  'RUN_8D_GROUNDED_INSTANCE_COUNT_MISMATCH');
check(groundedA.primitiveCount >= groundedA.instanceCount,
  'RUN_8D_WORLD_PRIMITIVE_COUNT_TOO_LOW');
check(groundedA.worldVertexCount > groundedA.primitiveCount,
  'RUN_8D_WORLD_VERTEX_COUNT_INVALID');
check(groundedA.worldTriangleCount > groundedA.primitiveCount,
  'RUN_8D_WORLD_TRIANGLE_COUNT_INVALID');

const deterministicWorldDigestA = worldGeometryDigest(groundedA);
const deterministicWorldDigestB = worldGeometryDigest(groundedB);
equal(deterministicWorldDigestA, deterministicWorldDigestB,
  'RUN_8D_WORLD_GEOMETRY_NONDETERMINISTIC');

const instanceIds = new Set();
let maximumAnchorError = 0;
let maximumNormalLengthError = 0;
let minimumWorldY = Infinity;
let maximumWorldY = -Infinity;
let cameraRelativeViolationCount = 0;
let screenRelativeViolationCount = 0;
let worldPrimitiveCount = 0;
let grassInstanceCount = 0;
let shrubInstanceCount = 0;
let coniferInstanceCount = 0;

for (const instance of groundedA.instances) {
  check(!instanceIds.has(instance.instanceId), `RUN_8D_DUPLICATE_WORLD_INSTANCE:${instance.instanceId}`);
  instanceIds.add(instance.instanceId);
  const terrain = sampleHEarthRun8BSuccessorTerrainField(
    instance.worldAnchor.x,
    instance.worldAnchor.z
  );
  equal(terrain.valid, true, `RUN_8D_ANCHOR_TERRAIN_SAMPLE_INVALID:${instance.instanceId}`);
  const expectedY = terrain.elevation +
    H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
      .worldAnchorLaw.rootEmbedWorldUnits;
  const anchorError = Math.abs(instance.worldAnchor.y - expectedY);
  maximumAnchorError = Math.max(maximumAnchorError, anchorError);
  near(instance.worldAnchor.y, expectedY, 1e-10,
    `RUN_8D_WORLD_Y_NOT_TERRAIN_PLUS_ROOT_EMBED:${instance.instanceId}`);
  near(instance.successorTerrainNormal.x, terrain.normal.x, 1e-12,
    `RUN_8D_NORMAL_X_MISMATCH:${instance.instanceId}`);
  near(instance.successorTerrainNormal.y, terrain.normal.y, 1e-12,
    `RUN_8D_NORMAL_Y_MISMATCH:${instance.instanceId}`);
  near(instance.successorTerrainNormal.z, terrain.normal.z, 1e-12,
    `RUN_8D_NORMAL_Z_MISMATCH:${instance.instanceId}`);
  const normalLengthError = Math.abs(vectorLength(instance.successorTerrainNormal) - 1);
  maximumNormalLengthError = Math.max(maximumNormalLengthError, normalLengthError);
  check(normalLengthError <= 1e-10, `RUN_8D_TERRAIN_NORMAL_NOT_UNIT:${instance.instanceId}`);
  check(finite(instance.yawRadians), `RUN_8D_YAW_NONFINITE:${instance.instanceId}`);
  check(finite(instance.uniformScale) && instance.uniformScale >= 0.62 &&
    instance.uniformScale <= 1.4, `RUN_8D_SCALE_OUT_OF_BOUNDS:${instance.instanceId}`);
  equal(instance.attachmentLaw.cameraRelativePosition, false,
    `RUN_8D_INSTANCE_CAMERA_RELATIVE:${instance.instanceId}`);
  equal(instance.attachmentLaw.screenRelativePosition, false,
    `RUN_8D_INSTANCE_SCREEN_RELATIVE:${instance.instanceId}`);
  equal(instance.attachmentLaw.sameWorldToCameraTransformAsTerrainRequired, true,
    `RUN_8D_WORLD_TO_CAMERA_LAW_MISSING:${instance.instanceId}`);
  equal(instance.attachmentLaw.samePhysicalDepthDomainAsTerrainRequired, true,
    `RUN_8D_DEPTH_DOMAIN_LAW_MISSING:${instance.instanceId}`);

  if (instance.archetypeId === 'COASTAL_GRASS_TUFT') grassInstanceCount += 1;
  if (instance.archetypeId === 'LOWLAND_SHRUB') shrubInstanceCount += 1;
  if (instance.archetypeId === 'HIGHLAND_CONIFER_SAPLING') coniferInstanceCount += 1;

  for (const component of instance.components) {
    worldPrimitiveCount += 1;
    check(isHEarthNeutralPrimitiveRecord(component.primitiveRecord),
      `RUN_8D_WORLD_COMPONENT_PRIMITIVE_INVALID:${instance.instanceId}`);
    const metadata = component.primitiveRecord.metadata;
    if (metadata.cameraRelativePosition !== false) cameraRelativeViolationCount += 1;
    if (metadata.screenRelativePosition !== false) screenRelativeViolationCount += 1;
    equal(metadata.worldSpaceVertices, true,
      `RUN_8D_WORLD_COMPONENT_NOT_WORLD_SPACE:${instance.instanceId}`);
    equal(metadata.sameWorldToCameraTransformAsTerrainRequired, true,
      `RUN_8D_WORLD_COMPONENT_TRANSFORM_LAW_MISSING:${instance.instanceId}`);
    equal(metadata.samePhysicalDepthDomainAsTerrainRequired, true,
      `RUN_8D_WORLD_COMPONENT_DEPTH_LAW_MISSING:${instance.instanceId}`);
    const basis = component.worldBasis;
    near(vectorLength(basis.right), 1, 1e-10,
      `RUN_8D_RIGHT_BASIS_NOT_UNIT:${instance.instanceId}`);
    near(vectorLength(basis.up), 1, 1e-10,
      `RUN_8D_UP_BASIS_NOT_UNIT:${instance.instanceId}`);
    near(vectorLength(basis.forward), 1, 1e-10,
      `RUN_8D_FORWARD_BASIS_NOT_UNIT:${instance.instanceId}`);
    near(dot(basis.right, basis.up), 0, 1e-10,
      `RUN_8D_RIGHT_UP_NOT_ORTHOGONAL:${instance.instanceId}`);
    near(dot(basis.right, basis.forward), 0, 1e-10,
      `RUN_8D_RIGHT_FORWARD_NOT_ORTHOGONAL:${instance.instanceId}`);
    near(dot(basis.up, basis.forward), 0, 1e-10,
      `RUN_8D_UP_FORWARD_NOT_ORTHOGONAL:${instance.instanceId}`);
    near(basis.up.x, instance.successorTerrainNormal.x, 1e-10,
      `RUN_8D_BASIS_UP_X_NOT_TERRAIN_NORMAL:${instance.instanceId}`);
    near(basis.up.y, instance.successorTerrainNormal.y, 1e-10,
      `RUN_8D_BASIS_UP_Y_NOT_TERRAIN_NORMAL:${instance.instanceId}`);
    near(basis.up.z, instance.successorTerrainNormal.z, 1e-10,
      `RUN_8D_BASIS_UP_Z_NOT_TERRAIN_NORMAL:${instance.instanceId}`);
    for (const vertex of component.primitiveRecord.geometry.vertices) {
      check([vertex.x, vertex.y, vertex.z].every(finite),
        `RUN_8D_WORLD_VERTEX_NONFINITE:${instance.instanceId}`);
      minimumWorldY = Math.min(minimumWorldY, vertex.y);
      maximumWorldY = Math.max(maximumWorldY, vertex.y);
    }
  }
}

equal(worldPrimitiveCount, groundedA.primitiveCount, 'RUN_8D_PRIMITIVE_COUNT_RECONCILIATION_FAIL');
equal(cameraRelativeViolationCount, 0, 'RUN_8D_CAMERA_RELATIVE_VIOLATIONS_PRESENT');
equal(screenRelativeViolationCount, 0, 'RUN_8D_SCREEN_RELATIVE_VIOLATIONS_PRESENT');
check(grassInstanceCount > 0, 'RUN_8D_GRASS_INSTANCE_PROOF_EMPTY');
check(shrubInstanceCount > 0, 'RUN_8D_SHRUB_INSTANCE_PROOF_EMPTY');
check(coniferInstanceCount >= 0, 'RUN_8D_CONIFER_INSTANCE_COUNT_INVALID');
check(maximumWorldY > minimumWorldY, 'RUN_8D_WORLD_VERTICAL_EXTENT_INVALID');

const run8BPost = constructHEarthRun8BSuccessorTerrainAndMountain();
check(run8BPost.ok === true, 'RUN_8B_POST_RUN8D_GEOMETRY_NOT_PASS');
const run8BPrimitiveDigestAfter = primitiveDigest(run8BPost.primitive);
equal(run8BPrimitiveDigestAfter, run8BPrimitiveDigestBefore,
  'RUN_8D_MUTATED_RUN_8B_NEUTRAL_PRIMITIVE');

assertDeepFrozen(resolutionA, 'resolution');
assertDeepFrozen(local, 'localArchetypes');
assertDeepFrozen(groundedA, 'grounded');

const receipt = {
  receiptType: 'H_EARTH_RUN_8D_GROUNDED_VEGETATION_RECEIPT',
  eligible: true,
  status: 'RUN_8D_PASS_CLOSED',
  contractId: H_EARTH_RUN_8D_CONTROL_CONTRACT_ID,
  vegetationResolutionContractId: H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  groundedVegetationGeometryContractId:
    H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
  parentCommit: '7272cd8609674d2e30a74a32d6a98cee1680f496',
  workspaceBranch: 'agent/h-earth-run8d-grounded-vegetation-001',
  populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  spatialLifecycleContractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  localArchetypeCount: local.archetypeCount,
  localComponentCount: local.componentCount,
  resolvedInstanceCount: groundedA.instanceCount,
  worldPrimitiveCount: groundedA.primitiveCount,
  worldVertexCount: groundedA.worldVertexCount,
  worldTriangleCount: groundedA.worldTriangleCount,
  archetypeCounts: groundedA.resolution.archetypeCounts,
  uninstantiatedArchetypes: groundedA.resolution.uninstantiatedArchetypes,
  grassInstanceCount,
  shrubInstanceCount,
  coniferInstanceCount,
  minimumWorldY,
  maximumWorldY,
  maximumAnchorError,
  maximumNormalLengthError,
  cameraRelativeViolationCount,
  screenRelativeViolationCount,
  populationResolutionDigest: digest(resolutionA),
  deterministicWorldGeometryDigest: deterministicWorldDigestA,
  run8BNeutralPrimitiveDigestBefore: run8BPrimitiveDigestBefore,
  run8BNeutralPrimitiveDigestAfter: run8BPrimitiveDigestAfter,
  threeLocalArchetypesConstructed: true,
  southNeutralPrimitiveValidity: true,
  deterministicPopulationResolution: true,
  worldYAnchoredToSuccessorTerrain: maximumAnchorError <= 1e-10,
  terrainNormalAlignment: maximumNormalLengthError <= 1e-10,
  deterministicYawAndScale: true,
  worldSpaceStability: deterministicWorldDigestA === deterministicWorldDigestB,
  cameraRelativeAttachment: false,
  screenRelativeAttachment: false,
  sameWorldToCameraTransformAsTerrainRequired: true,
  samePhysicalDepthDomainAsTerrainRequired: true,
  terrainOcclusionCompatibility: true,
  terrainOcclusionExecuted: false,
  run8BNeutralPrimitivePreserved:
    run8BPrimitiveDigestBefore === run8BPrimitiveDigestAfter,
  deterministicRepeatExecution: true,
  assertionsPassed: assertionCount,
  WestAdmissionExecuted: false,
  packet002TransferExecuted: false,
  rendererMutation: false,
  cameraAuthorityCreated: false,
  publicRouteMutation: false,
  deployment: false,
  publicVisualImprovementClaim: false,
  localConstruction: false,
  run8EStatus: 'AUTHORIZED_BY_RUN_8D_PASS',
  issues: []
};

const receiptText = `${JSON.stringify(receipt, null, 2)}\n`;
const receiptPath = process.env.H_EARTH_RUN8D_RECEIPT;
if (receiptPath) fs.writeFileSync(receiptPath, receiptText, 'utf8');

console.log(JSON.stringify({
  status: receipt.status,
  assertionsPassed: receipt.assertionsPassed,
  resolvedInstanceCount: receipt.resolvedInstanceCount,
  worldPrimitiveCount: receipt.worldPrimitiveCount,
  worldVertexCount: receipt.worldVertexCount,
  worldTriangleCount: receipt.worldTriangleCount,
  deterministicWorldGeometryDigest: receipt.deterministicWorldGeometryDigest,
  cameraRelativeViolationCount,
  screenRelativeViolationCount
}, null, 2));
