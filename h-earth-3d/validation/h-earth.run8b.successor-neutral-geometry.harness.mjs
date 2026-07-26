import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT,
  H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION,
  evaluateHEarthRun8AMountainContribution,
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

import {
  H_EARTH_RUN_8B_CONTRACT_ID,
  evaluateHEarthRun8B
} from '../control-plane/run-8/h-earth.run8b.successor-neutral-geometry.js';

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
    Number.isFinite(actual) &&
    Number.isFinite(expected) &&
    Math.abs(actual - expected) <= tolerance,
    `${message}: actual=${actual} expected=${expected} tolerance=${tolerance}`
  );
  assertionsPassed += 1;
};

const finiteVector = (value) =>
  value &&
  Number.isFinite(value.x) &&
  Number.isFinite(value.y) &&
  Number.isFinite(value.z);

function deriveBounds(vertices) {
  return vertices.reduce(
    (bounds, vertex) => ({
      xMinimum: Math.min(bounds.xMinimum, vertex.x),
      xMaximum: Math.max(bounds.xMaximum, vertex.x),
      yMinimum: Math.min(bounds.yMinimum, vertex.y),
      yMaximum: Math.max(bounds.yMaximum, vertex.y),
      zMinimum: Math.min(bounds.zMinimum, vertex.z),
      zMaximum: Math.max(bounds.zMaximum, vertex.z)
    }),
    {
      xMinimum: Number.POSITIVE_INFINITY,
      xMaximum: Number.NEGATIVE_INFINITY,
      yMinimum: Number.POSITIVE_INFINITY,
      yMaximum: Number.NEGATIVE_INFINITY,
      zMinimum: Number.POSITIVE_INFINITY,
      zMaximum: Number.NEGATIVE_INFINITY
    }
  );
}

function primitiveDigest(result) {
  const hash = crypto.createHash('sha256');
  const primitive = result.primitive;
  hash.update(H_EARTH_RUN_8B_CONTRACT_ID);
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

const run8A = evaluateHEarthRun8AContract();
check(run8A.eligible === true, 'Run 8A predecessor must remain PASS');
equal(run8A.contractId, H_EARTH_RUN_8A_CONTRACT_ID, 'Run 8A identity must remain controlling');

check(H_EARTH_TERRAIN_FIELD.worldDomain.zMinimum === -256, 'Run 6 terrain baseline must remain unchanged');
equal(
  H_EARTH_TERRAIN_FIELD.contractId,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  'Run 6 terrain field identity must remain unchanged'
);
check(
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID !== H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  'Predecessor and successor field identities must remain distinct'
);
equal(
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.predecessorContractId,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  'Successor field must identify the preserved predecessor'
);
equal(
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.zMinimum,
  -320,
  'Successor field must cover Z=-320'
);

const fieldEvaluation = evaluateHEarthRun8BSuccessorTerrainField();
check(fieldEvaluation.eligible === true, 'Successor field revision must pass');
check(fieldEvaluation.predecessorMutated === false, 'Successor field must not mutate predecessor');

const continuity = evaluateHEarthRun8BFormerBoundaryContinuity();
check(continuity.eligible === true, 'Former boundary continuity must pass');
check(continuity.maximumHeightDiscontinuity <= 0.05, 'Former boundary C0 tolerance must pass');
check(continuity.maximumGradientDiscontinuity <= 0.5, 'Former boundary C1 tolerance must pass');

const constructionA = constructHEarthRun8BSuccessorTerrainAndMountain();
check(constructionA.ok === true, `First Run 8B construction failed: ${constructionA.issues.join('|')}`);
equal(
  constructionA.status,
  'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_COMPLETE',
  'Run 8B construction status must close'
);
equal(
  constructionA.contractId,
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  'Run 8B geometry contract identity must match'
);
equal(
  constructionA.southKernelContractId,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  'Existing South kernel must construct the geometry'
);
check(isHEarthNeutralPrimitiveRecord(constructionA.primitive), 'South neutral primitive must be valid');
equal(
  constructionA.primitive.primitiveId,
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID,
  'Neutral primitive identity must be stable'
);
check(constructionA.primitive.admitted === false, 'Run 8B primitive must remain unadmitted');
equal(constructionA.primitive.admissionAuthority, 'WEST_ONLY', 'West must remain sole admission authority');
check(constructionA.WestAdmissionExecuted === false, 'West admission must not execute in Run 8B');
check(constructionA.packet002TransferExecuted === false, 'Packet 002 transfer must not execute in Run 8B');
check(constructionA.rendererMutation === false, 'Renderer mutation must remain false');
check(constructionA.materialAndLightingPresentation === false, 'Material and lighting presentation must remain false');
check(constructionA.vegetationInstanceConstruction === false, 'Vegetation instance construction must remain false');
check(constructionA.publicRouteMutation === false, 'Public route mutation must remain false');
check(constructionA.deployment === false, 'Deployment must remain false');
check(constructionA.visualImprovementClaim === false, 'Visual claim must remain false');
equal(
  constructionA.legacyProxyContractId,
  H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
  'Legacy proxy contract identity must remain referenced'
);
check(constructionA.legacyProxyMutated === false, 'Legacy Run 6 proxy must remain unmutated');

const primitive = constructionA.primitive;
const geometry = primitive.geometry;
const { xValues, zValues, rowCount, columnCount, vertexCount, indexCount, triangleCount } =
  constructionA.topology;

check(Array.isArray(xValues) && xValues.length === columnCount, 'X sampling axis must match column count');
check(Array.isArray(zValues) && zValues.length === rowCount, 'Z sampling axis must match row count');
equal(vertexCount, rowCount * columnCount, 'Vertex count must equal the full Cartesian grid');
equal(indexCount, (rowCount - 1) * (columnCount - 1) * 6, 'Index count must cover every grid cell');
equal(triangleCount, (rowCount - 1) * (columnCount - 1) * 2, 'Triangle count must cover every grid cell');
equal(geometry.vertices.length, vertexCount, 'Geometry vertex count must match topology');
equal(geometry.indices.length, indexCount, 'Geometry index count must match topology');
equal(geometry.normals.length, vertexCount, 'Every vertex must receive one South normal');
check(Array.isArray(geometry.faceNormals), 'South face normals must be present');
equal(geometry.faceNormals.length, triangleCount, 'Every triangle must receive one South face normal');
check(geometry.metadata.openNeutralMeshConstructionValid === true, 'Mesh must be a valid open neutral manifold');

const spacings = (values) => values.slice(1).map((value, index) => value - values[index]);
const xSpacings = spacings(xValues);
const zSpacings = spacings(zValues);
check(xSpacings.every((spacing) => spacing === 2 || spacing === 4), 'X spacing must obey Run 8A 2/4 law');
check(zSpacings.every((spacing) => spacing === 2 || spacing === 4), 'Z spacing must obey Run 8A 2/4 law');
check(xSpacings.includes(2) && xSpacings.includes(4), 'X axis must contain base and refined spacing');
check(zSpacings.includes(2) && zSpacings.includes(4), 'Z axis must contain base and refined spacing');
check(xValues.includes(-240) && xValues.includes(56), 'X refinement region boundaries must be represented');
check(zValues.includes(-312) && zValues.includes(-220), 'Z refinement region boundaries must be represented');
check(zValues.includes(-256), 'Former boundary Z=-256 must be represented exactly');

const derivedBounds = deriveBounds(geometry.vertices);
near(derivedBounds.xMinimum, -256, 1e-12, 'World X minimum must conform');
near(derivedBounds.xMaximum, 256, 1e-12, 'World X maximum must conform');
near(derivedBounds.zMinimum, -320, 1e-12, 'World Z minimum must conform');
near(derivedBounds.zMaximum, 64, 1e-12, 'World Z maximum must conform');
check(derivedBounds.yMinimum >= -16, 'Successor minimum elevation must remain bounded');
check(derivedBounds.yMaximum <= 124, 'Successor maximum elevation must remain within Run 8A envelope');

for (let index = 0; index < geometry.vertices.length; index += 1) {
  const vertex = geometry.vertices[index];
  check(finiteVector(vertex), `Vertex ${index} must be finite`);
  const sample = sampleHEarthRun8BSuccessorTerrainField(vertex.x, vertex.z);
  check(sample.valid === true, `Vertex ${index} must correspond to a valid successor sample`);
  near(vertex.y, sample.elevation, 1e-10, `Vertex ${index} must preserve successor field Y`);
}

for (let index = 0; index < geometry.normals.length; index += 1) {
  const normal = geometry.normals[index];
  check(finiteVector(normal), `Normal ${index} must be finite`);
  const length = Math.hypot(normal.x, normal.y, normal.z);
  near(length, 1, 1e-8, `Normal ${index} must be normalized`);
  check(normal.y > 0, `Normal ${index} must preserve upward terrain orientation`);
}

for (let offset = 0; offset < geometry.indices.length; offset += 1) {
  const index = geometry.indices[offset];
  check(Number.isSafeInteger(index), `Index ${offset} must be a safe integer`);
  check(index >= 0 && index < geometry.vertices.length, `Index ${offset} must reference a vertex`);
}

let minimumDoubleArea = Number.POSITIVE_INFINITY;
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
  check(Number.isFinite(doubleArea) && doubleArea > 1e-9, `Triangle ${offset / 3} must be nondegenerate`);
}

check(constructionA.sharedEdges.eligible === true, 'Virtual shared-edge proof must pass');
check(constructionA.sharedEdges.sharedEdgePairCount > 0, 'Shared-edge proof must cover adjacent partitions');
equal(
  constructionA.sharedEdges.sharedVertexIdentityLaw,
  'ADJACENT_PARTITIONS_REFERENCE_THE_SAME_GLOBAL_VERTEX_INDICES',
  'Shared-edge position identity law must be explicit'
);
equal(
  constructionA.sharedEdges.normalContinuityLaw,
  'ONE_GLOBAL_VERTEX_HAS_ONE_SOUTH_VERTEX_NORMAL',
  'Shared-edge normal identity law must be explicit'
);

check(H_EARTH_RUN_8B_Z_BANDS.length >= 6, 'Multiple Z depth bands must be established');
for (const band of H_EARTH_RUN_8B_Z_BANDS) {
  check(
    constructionA.topology.zBandVertexCounts[band.bandId] > 0,
    `Z band ${band.bandId} must contain vertices`
  );
}

const mountainWitnesses = [
  [-96, -300],
  [-96, -286],
  [-96, -270],
  [-20, -252],
  [-180, -232]
].map(([x, z]) => ({ x, z, contribution: evaluateHEarthRun8AMountainContribution(x, z) }));
for (const witness of mountainWitnesses) {
  check(
    witness.contribution > 0,
    `Mountain witness ${witness.x}:${witness.z} must carry positive connected mass`
  );
}
check(
  evaluateHEarthRun8AMountainContribution(-241, -266) === 0,
  'Mountain contribution must fail closed immediately outside the X transition bound'
);
check(
  evaluateHEarthRun8AMountainContribution(-96, -312) === 0,
  'Mountain rear transition boundary must fall to terrain truth'
);
check(
  evaluateHEarthRun8AMountainContribution(-96, -220) === 0,
  'Mountain forward transition boundary must fall to terrain truth'
);

const formerBoundaryRow = zValues.indexOf(
  H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.formerBoundaryZ
);
check(formerBoundaryRow >= 0, 'Former boundary row must exist');
for (let column = 0; column < columnCount; column += 1) {
  const vertex = geometry.vertices[formerBoundaryRow * columnCount + column];
  const sample = sampleHEarthRun8BSuccessorTerrainField(vertex.x, vertex.z);
  near(vertex.y, sample.elevation, 1e-10, `Former boundary vertex ${column} must match successor truth`);
}

const digestA = primitiveDigest(constructionA);
const constructionB = constructHEarthRun8BSuccessorTerrainAndMountain();
check(constructionB.ok === true, `Second Run 8B construction failed: ${constructionB.issues.join('|')}`);
const digestB = primitiveDigest(constructionB);
equal(digestB, digestA, 'Repeated Run 8B construction must be deterministic');
equal(constructionB.topology.vertexCount, vertexCount, 'Repeated vertex count must match');
equal(constructionB.topology.triangleCount, triangleCount, 'Repeated triangle count must match');

const packageEvaluation = evaluateHEarthRun8B();
check(packageEvaluation.eligible === true, `Run 8B package failed: ${packageEvaluation.issues.join('|')}`);
equal(packageEvaluation.status, 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PASS', 'Run 8B package must pass');
equal(packageEvaluation.run8CStatus, 'AUTHORIZED_BY_RUN_8B_PASS', 'Run 8C authorization must follow Run 8B pass');

const receipt = {
  receiptType: 'H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_RECEIPT',
  eligible: true,
  status: 'RUN_8B_PASS_CLOSED',
  contractId: H_EARTH_RUN_8B_CONTRACT_ID,
  controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  parentCommit: '88e2a3f8b5ff5fb8587ba95d2e13d3ea8504dfbd',
  workspaceBranch: 'agent/h-earth-run8b-successor-neutral-geometry-001',
  successorTerrainFieldContractId:
    H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  successorNeutralGeometryContractId:
    H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  southKernelContractId: H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  primitiveId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID,
  rowCount,
  columnCount,
  vertexCount,
  indexCount,
  triangleCount,
  faceNormalCount: geometry.faceNormals.length,
  vertexNormalCount: geometry.normals.length,
  minimumTriangleDoubleArea: minimumDoubleArea,
  xSpacingMinimum: Math.min(...xSpacings),
  xSpacingMaximum: Math.max(...xSpacings),
  zSpacingMinimum: Math.min(...zSpacings),
  zSpacingMaximum: Math.max(...zSpacings),
  zBandCount: H_EARTH_RUN_8B_Z_BANDS.length,
  sharedEdgePairCount: constructionA.sharedEdges.sharedEdgePairCount,
  worldBounds: derivedBounds,
  maximumHeightDiscontinuity: continuity.maximumHeightDiscontinuity,
  maximumGradientDiscontinuity: continuity.maximumGradientDiscontinuity,
  deterministicDigest: digestA,
  assertionsPassed,
  predecessorTerrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  predecessorTerrainFieldPreserved: true,
  legacyProxyContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
  legacyProxyPreserved: true,
  successorContinuousMountainConstructed: true,
  multipleZBandsConstructed: true,
  connectedXZFootprint: true,
  validIndexTopology: true,
  nondegenerateTriangles: true,
  vertexNormalsValid: true,
  sharedEdgeContinuity: true,
  worldSpaceStable: true,
  southNeutralPrimitiveValid: true,
  deterministicRepeatExecution: true,
  WestAdmissionExecuted: false,
  packet002TransferExecuted: false,
  rendererMutation: false,
  materialAndLightingPresentation: false,
  vegetationInstanceConstruction: false,
  publicRouteMutation: false,
  deployment: false,
  visualImprovementClaim: false,
  localConstruction: false,
  issues: []
};

const outputPath = process.env.H_EARTH_RUN8B_RECEIPT;
if (outputPath) {
  fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
}

console.log(JSON.stringify(receipt, null, 2));
