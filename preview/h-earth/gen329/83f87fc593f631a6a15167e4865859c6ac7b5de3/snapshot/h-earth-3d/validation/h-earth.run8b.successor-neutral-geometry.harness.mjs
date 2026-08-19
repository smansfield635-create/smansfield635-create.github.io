import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION,
  evaluateHEarthRun8AContract
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField,
  evaluateHEarthRun8BFormerBoundaryContinuity,
  evaluateHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE,
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID,
  H_EARTH_RUN_8B_Z_BANDS,
  constructHEarthRun8BSuccessorTerrainAndMountain
} from '../../showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';

import {
  H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID
} from '../../showroom/globe/h-earth/render/geometry-distant-context.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  isHEarthNeutralPrimitiveRecord
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';

let assertionsPassed = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertionsPassed += 1;
};
const equal = (actual, expected, message) => {
  assert.equal(actual, expected, message);
  assertionsPassed += 1;
};
const near = (actual, expected, tolerance, message) => {
  assert.ok(
    Number.isFinite(actual) && Number.isFinite(expected) &&
    Math.abs(actual - expected) <= tolerance,
    `${message}: actual=${actual} expected=${expected} tolerance=${tolerance}`
  );
  assertionsPassed += 1;
};
const finiteVector = (value) => value &&
  Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z);

function deriveBounds(vertices) {
  return vertices.reduce((bounds, vertex) => ({
    xMinimum: Math.min(bounds.xMinimum, vertex.x),
    xMaximum: Math.max(bounds.xMaximum, vertex.x),
    yMinimum: Math.min(bounds.yMinimum, vertex.y),
    yMaximum: Math.max(bounds.yMaximum, vertex.y),
    zMinimum: Math.min(bounds.zMinimum, vertex.z),
    zMaximum: Math.max(bounds.zMaximum, vertex.z)
  }), {
    xMinimum: Infinity, xMaximum: -Infinity,
    yMinimum: Infinity, yMaximum: -Infinity,
    zMinimum: Infinity, zMaximum: -Infinity
  });
}

function primitiveDigest(result) {
  const hash = crypto.createHash('sha256');
  const primitive = result.primitive;
  hash.update(H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID);
  hash.update(H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID);
  hash.update(primitive.primitiveId);
  hash.update(String(result.topology.rowCount));
  hash.update(String(result.topology.columnCount));
  for (const vertex of primitive.geometry.vertices) {
    hash.update(`${vertex.x.toPrecision(17)},${vertex.y.toPrecision(17)},${vertex.z.toPrecision(17)};`);
  }
  for (const index of primitive.geometry.indices) hash.update(`${index},`);
  for (const normal of primitive.geometry.normals) {
    hash.update(`${normal.x.toPrecision(17)},${normal.y.toPrecision(17)},${normal.z.toPrecision(17)};`);
  }
  return hash.digest('hex');
}

// Historical Run 8A remains immutable. Gen329 legitimately expanded the canonical
// procedural world beyond the former Run 6 whole-world domain, so the historical
// evaluator may now report only that superseded whole-world-domain predicate.
const run8A = evaluateHEarthRun8AContract();
equal(run8A.contractId, H_EARTH_RUN_8A_CONTRACT_ID,
  'Historical Run 8A identity must remain unchanged');
check(
  run8A.issues.every((issue) => issue === 'RUN_6_TERRAIN_BASELINE_CHANGED'),
  `Run 8A may differ only at the superseded whole-world-domain predicate: ${run8A.issues.join('|')}`
);

// Gen329 must preserve the historical core while extending the same canonical world.
equal(H_EARTH_TERRAIN_FIELD.contractId, H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  'Canonical terrain field identity must remain unchanged');
equal(H_EARTH_TERRAIN_FIELD.coreDomain.xMinimum, -256, 'Historical core X minimum must remain unchanged');
equal(H_EARTH_TERRAIN_FIELD.coreDomain.xMaximum, 256, 'Historical core X maximum must remain unchanged');
equal(H_EARTH_TERRAIN_FIELD.coreDomain.zMinimum, -256, 'Historical core Z minimum must remain unchanged');
equal(H_EARTH_TERRAIN_FIELD.coreDomain.zMaximum, 64, 'Historical core Z maximum must remain unchanged');
equal(H_EARTH_TERRAIN_FIELD.boundaryPolicy.mode,
  'PROCEDURAL_CONTINUATION_BEYOND_CORE_DOMAIN',
  'Canonical world extension must remain procedural continuation');
check(
  H_EARTH_TERRAIN_FIELD.worldDomain.xMinimum <= H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.xMinimum &&
  H_EARTH_TERRAIN_FIELD.worldDomain.xMaximum >= H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.xMaximum &&
  H_EARTH_TERRAIN_FIELD.worldDomain.zMinimum <= H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.zMinimum &&
  H_EARTH_TERRAIN_FIELD.worldDomain.zMaximum >= H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.zMaximum,
  'Current canonical world must contain the complete historical successor domain'
);

// Current Gen329 Run 8B is a derivative representation of G_world, not an
// independent successor geography authority and not the historical R2 package.
equal(H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.sourceAuthority,
  'DERIVATIVE_OVERLAY_ON_G_WORLD',
  'Run 8B must remain a G_world derivative overlay');
check(H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.identityLaw.canonicalWorldFieldIsSoleGeographyAuthority === true,
  'Canonical world field must remain sole geography authority');
equal(H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.identityLaw.predecessorAndSuccessorIdentityCollapse,
  'PROHIBITED',
  'Predecessor/successor identity collapse must remain prohibited');
check(H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.zMinimum <= -320,
  'Gen329 Run 8B derivative must still cover the historical rear successor witness');
equal(H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.formerBoundaryZ, -256,
  'Former Run 6 boundary identity must remain explicit');

const fieldEvaluation = evaluateHEarthRun8BSuccessorTerrainField();
check(fieldEvaluation.eligible === true,
  `Current Run 8B G_world derivative must pass: ${fieldEvaluation.issues.join('|')}`);
check(fieldEvaluation.predecessorMutated === false,
  'Run 8B derivative must not mutate its predecessor');
equal(fieldEvaluation.sourceAuthority, 'DERIVATIVE_OVERLAY_ON_G_WORLD',
  'Run 8B evaluation must report derivative-only authority');

const continuity = evaluateHEarthRun8BFormerBoundaryContinuity();
check(continuity.eligible === true,
  `Former boundary continuity must pass: ${continuity.issues.join('|')}`);
check(continuity.maximumDelta <= continuity.tolerance,
  'Former boundary G_world elevation delta must remain within canonical tolerance');
check(continuity.predecessorMutated === false,
  'Former boundary continuity proof must not mutate predecessor state');

const constructionA = constructHEarthRun8BSuccessorTerrainAndMountain();
check(constructionA.ok === true,
  `Current Run 8B neutral geometry must construct: ${constructionA.issues.join('|')}`);
equal(constructionA.status, 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_COMPLETE',
  'Current Run 8B construction must close successfully');
equal(constructionA.contractId, H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  'Current Run 8B geometry contract identity must match');
equal(constructionA.representationClass, 'NEAR_TO_MID_OVERLAP',
  'Gen329 Run 8B must remain the near-to-mid G_world representation');
equal(constructionA.southKernelContractId, H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  'South neutral kernel must remain the geometry constructor');
check(isHEarthNeutralPrimitiveRecord(constructionA.primitive),
  'Constructed primitive must remain South-neutral');
equal(constructionA.primitive.primitiveId, H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID,
  'Neutral primitive identity must remain stable');
equal(constructionA.legacyProxyContractId, H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
  'Legacy proxy identity must remain referenced without mutation');
check(constructionA.legacyProxyMutated === false, 'Legacy proxy must remain unmutated');
check(constructionA.WestAdmissionExecuted === false, 'West admission must not execute');
check(constructionA.packet002TransferExecuted === false, 'Packet 002 transfer must not execute');
check(constructionA.rendererMutation === false, 'Renderer mutation must remain false');
check(constructionA.publicRouteMutation === false, 'Public route mutation must remain false');
check(constructionA.deployment === false, 'Deployment must remain false');

const geometry = constructionA.primitive.geometry;
const { xValues, zValues, rowCount, columnCount, vertexCount, indexCount, triangleCount } = constructionA.topology;
check(Array.isArray(xValues) && xValues.length === columnCount,
  'X sampling axis must match column count');
check(Array.isArray(zValues) && zValues.length === rowCount,
  'Z sampling axis must match row count');
equal(vertexCount, rowCount * columnCount,
  'Vertex count must equal the full Cartesian grid');
equal(indexCount, (rowCount - 1) * (columnCount - 1) * 6,
  'Index count must cover every grid cell');
equal(triangleCount, (rowCount - 1) * (columnCount - 1) * 2,
  'Triangle count must cover every grid cell');
equal(geometry.vertices.length, vertexCount,
  'Geometry vertex count must match topology');
equal(geometry.indices.length, indexCount,
  'Geometry index count must match topology');
equal(geometry.normals.length, vertexCount,
  'Every vertex must have one normal');

const xSpacings = xValues.slice(1).map((value, index) => value - xValues[index]);
const zSpacings = zValues.slice(1).map((value, index) => value - zValues[index]);
check(xSpacings.every((spacing) => spacing === H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.baseSpacingWorldUnits),
  'X sampling must obey the current Gen329 Run 8B representation spacing');
check(zSpacings.every((spacing) => spacing === H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.baseSpacingWorldUnits),
  'Z sampling must obey the current Gen329 Run 8B representation spacing');
check(zValues.includes(-256), 'Former boundary Z=-256 must remain sampled exactly');

const derivedBounds = deriveBounds(geometry.vertices);
near(derivedBounds.xMinimum, H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.worldDomain.xMinimum, 1e-12,
  'Run 8B geometry X minimum must match current representation domain');
near(derivedBounds.xMaximum, H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.worldDomain.xMaximum, 1e-12,
  'Run 8B geometry X maximum must match current representation domain');
near(derivedBounds.zMinimum, H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.worldDomain.zMinimum, 1e-12,
  'Run 8B geometry Z minimum must match current representation domain');
near(derivedBounds.zMaximum, H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.worldDomain.zMaximum, 1e-12,
  'Run 8B geometry Z maximum must match current representation domain');

for (let index = 0; index < geometry.vertices.length; index += 1) {
  const vertex = geometry.vertices[index];
  check(finiteVector(vertex), `Vertex ${index} must be finite`);
  const sample = sampleHEarthRun8BSuccessorTerrainField(vertex.x, vertex.z);
  check(sample.valid === true, `Vertex ${index} must correspond to a valid G_world derivative sample`);
  near(vertex.y, sample.elevation, 1e-10,
    `Vertex ${index} must preserve current G_world-derived elevation`);
}

for (let index = 0; index < geometry.normals.length; index += 1) {
  const normal = geometry.normals[index];
  check(finiteVector(normal), `Normal ${index} must be finite`);
  near(Math.hypot(normal.x, normal.y, normal.z), 1, 1e-8,
    `Normal ${index} must remain normalized`);
}

for (let offset = 0; offset < geometry.indices.length; offset += 1) {
  const index = geometry.indices[offset];
  check(Number.isSafeInteger(index) && index >= 0 && index < geometry.vertices.length,
    `Index ${offset} must safely reference a vertex`);
}

let minimumDoubleArea = Infinity;
for (let offset = 0; offset < geometry.indices.length; offset += 3) {
  const a = geometry.vertices[geometry.indices[offset]];
  const b = geometry.vertices[geometry.indices[offset + 1]];
  const c = geometry.vertices[geometry.indices[offset + 2]];
  const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
  const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
  const cross = {
    x: ab.y * ac.z - ab.z * ac.y,
    y: ab.z * ac.x - ab.x * ac.z,
    z: ab.x * ac.y - ab.y * ac.x
  };
  const doubleArea = Math.hypot(cross.x, cross.y, cross.z);
  minimumDoubleArea = Math.min(minimumDoubleArea, doubleArea);
  check(Number.isFinite(doubleArea) && doubleArea > 1e-9,
    `Triangle ${offset / 3} must remain nondegenerate`);
}

check(constructionA.sharedEdges.eligible === true,
  `Shared-edge proof must pass: ${constructionA.sharedEdges.issues.join('|')}`);
check(constructionA.sharedEdges.sharedEdgePairCount > 0,
  'Shared-edge proof must cover adjacent cells');
equal(constructionA.sharedEdges.sharedVertexIdentityLaw, 'ONE_GLOBAL_INDEXED_MESH',
  'Shared vertex identity law must match current Gen329 mesh');
equal(constructionA.sharedEdges.normalContinuityLaw, 'ONE_GLOBAL_VERTEX_NORMAL_SOURCE',
  'Shared normal identity law must match current Gen329 mesh');
equal(H_EARTH_RUN_8B_Z_BANDS.length, 3,
  'Current Gen329 near-to-mid representation must retain its three overlap bands');
for (const band of H_EARTH_RUN_8B_Z_BANDS) {
  check(constructionA.topology.zBandVertexCounts[band.bandId] > 0,
    `Z band ${band.bandId} must contain vertices`);
}

const formerBoundaryRow = zValues.indexOf(-256);
check(formerBoundaryRow >= 0, 'Former boundary row must exist');
for (let column = 0; column < columnCount; column += 1) {
  const vertex = geometry.vertices[formerBoundaryRow * columnCount + column];
  const sample = sampleHEarthRun8BSuccessorTerrainField(vertex.x, vertex.z);
  near(vertex.y, sample.elevation, 1e-10,
    `Former boundary vertex ${column} must remain identical to G_world-derived truth`);
}

const digestA = primitiveDigest(constructionA);
const constructionB = constructHEarthRun8BSuccessorTerrainAndMountain();
check(constructionB.ok === true,
  `Repeated Run 8B construction failed: ${constructionB.issues.join('|')}`);
equal(primitiveDigest(constructionB), digestA,
  'Repeated current Run 8B construction must be deterministic');

const receipt = {
  receiptType: 'H_EARTH_RUN_8B_GEN329_WORLD_MANIFOLD_GEOMETRY_REGRESSION_RECEIPT_v3',
  eligible: true,
  status: 'RUN8B_WORLD_MANIFOLD_GEOMETRY_REGRESSION_PASS',
  controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  historicalRun8AStatus: run8A.status,
  historicalRun8AIssues: run8A.issues,
  historicalWholeWorldDomainPredicateSuperseded:
    run8A.issues.includes('RUN_6_TERRAIN_BASELINE_CHANGED'),
  canonicalCoreDomainPreserved: true,
  currentCanonicalWorldUsesProceduralContinuation: true,
  successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  successorNeutralGeometryContractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  southKernelContractId: H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  primitiveId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID,
  representationClass: constructionA.representationClass,
  rowCount,
  columnCount,
  vertexCount,
  indexCount,
  triangleCount,
  minimumTriangleDoubleArea: minimumDoubleArea,
  samplingSpacingWorldUnits: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.baseSpacingWorldUnits,
  zBandCount: H_EARTH_RUN_8B_Z_BANDS.length,
  sharedEdgePairCount: constructionA.sharedEdges.sharedEdgePairCount,
  worldBounds: derivedBounds,
  maximumFormerBoundaryDelta: continuity.maximumDelta,
  formerBoundaryTolerance: continuity.tolerance,
  deterministicDigest: digestA,
  assertionsPassed,
  predecessorTerrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  legacyProxyContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
  currentRun8BDirectFieldEvaluationPassed: true,
  currentRun8BDirectNeutralGeometryConstructionPassed: true,
  validIndexTopology: true,
  nondegenerateTriangles: true,
  vertexNormalsValid: true,
  sharedEdgeContinuity: true,
  deterministicRepeatExecution: true,
  historicalRun8ARewritten: false,
  historicalR2CheckpointRewritten: false,
  Gen329ProductMutation: false,
  WestAdmissionExecuted: false,
  packet002TransferExecuted: false,
  rendererMutation: false,
  publicRouteMutation: false,
  deployment: false,
  visualImprovementClaim: false,
  issues: []
};

const outputPath = process.env.H_EARTH_RUN8B_RECEIPT;
if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
