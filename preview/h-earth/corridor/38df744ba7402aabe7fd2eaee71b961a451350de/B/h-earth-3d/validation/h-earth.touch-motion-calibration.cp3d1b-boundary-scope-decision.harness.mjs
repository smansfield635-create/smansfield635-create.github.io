import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { previewHEarthFunctionalLandscape } from '../../showroom/globe/h-earth/render/landscape-preview.js';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const moduleUrl = `${origin}/showroom/globe/h-earth/render/landscape-preview.js`;
const GRID = 16777216;

const canonicalize = value => {
  const result = Math.round(value * GRID) / GRID;
  return Object.is(result, -0) ? 0 : result;
};

function primitiveSnapshot(preview) {
  return preview.primitives.map((primitive, primitiveIndex) => ({
    primitiveIndex,
    primitiveId: primitive.primitiveId,
    geometryId: primitive.geometry.geometryId,
    vertices: primitive.geometry.vertices.map((vertex, localVertexIndex) => ({
      localVertexIndex,
      x: vertex.x,
      y: vertex.y,
      z: vertex.z
    }))
  }));
}

function firstCoordinateDifference(left, right, predicate = () => true) {
  for (let primitiveIndex = 0; primitiveIndex < left.length; primitiveIndex += 1) {
    const a = left[primitiveIndex];
    const b = right[primitiveIndex];
    if (!predicate(a)) continue;
    for (let localVertexIndex = 0; localVertexIndex < a.vertices.length; localVertexIndex += 1) {
      for (const component of ['x', 'y', 'z']) {
        const nodeValue = a.vertices[localVertexIndex][component];
        const browserValue = b.vertices[localVertexIndex][component];
        if (!Object.is(nodeValue, browserValue)) {
          return {
            primitiveIndex,
            primitiveId: a.primitiveId,
            geometryId: a.geometryId,
            localVertexIndex,
            component,
            nodeValue,
            browserValue,
            absoluteDifference: Math.abs(nodeValue - browserValue)
          };
        }
      }
    }
  }
  return null;
}

function canonicalSnapshot(snapshot, predicate) {
  return snapshot.map(primitive => ({
    ...primitive,
    vertices: primitive.vertices.map(vertex => predicate(primitive)
      ? {
          ...vertex,
          x: canonicalize(vertex.x),
          y: canonicalize(vertex.y),
          z: canonicalize(vertex.z)
        }
      : vertex)
  }));
}

await mkdir(evidenceDirectory, { recursive: true });
const nodePreview = previewHEarthFunctionalLandscape();
assert.equal(nodePreview.ok, true, 'CP3D1B_NODE_PREVIEW_INVALID');
const nodeSnapshot = primitiveSnapshot(nodePreview);

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=swiftshader', '--disable-dev-shm-usage']
});

try {
  const page = await browser.newPage();
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserSnapshot = await page.evaluate(async url => {
    const module = await import(`${url}?cp3d1b=${Date.now()}`);
    const preview = module.previewHEarthFunctionalLandscape();
    if (preview?.ok !== true) throw new Error('CP3D1B_BROWSER_PREVIEW_INVALID');
    return preview.primitives.map((primitive, primitiveIndex) => ({
      primitiveIndex,
      primitiveId: primitive.primitiveId,
      geometryId: primitive.geometry.geometryId,
      vertices: primitive.geometry.vertices.map((vertex, localVertexIndex) => ({
        localVertexIndex,
        x: vertex.x,
        y: vertex.y,
        z: vertex.z
      }))
    }));
  }, moduleUrl);

  const shoreline = primitive => primitive.primitiveId.startsWith('H_EARTH_FUNCTIONAL_SHORELINE:');
  const rawFirstDifference = firstCoordinateDifference(nodeSnapshot, browserSnapshot);
  const shorelineRawFirstDifference = firstCoordinateDifference(nodeSnapshot, browserSnapshot, shoreline);

  const nodeShorelineCanonical = canonicalSnapshot(nodeSnapshot, shoreline);
  const browserShorelineCanonical = canonicalSnapshot(browserSnapshot, shoreline);
  const afterShorelineOnly = firstCoordinateDifference(nodeShorelineCanonical, browserShorelineCanonical);

  const all = () => true;
  const nodeSharedCanonical = canonicalSnapshot(nodeSnapshot, all);
  const browserSharedCanonical = canonicalSnapshot(browserSnapshot, all);
  const afterSharedBoundary = firstCoordinateDifference(nodeSharedCanonical, browserSharedCanonical);

  const differingPrimitiveIds = [];
  for (let index = 0; index < nodeSnapshot.length; index += 1) {
    if (firstCoordinateDifference([nodeSnapshot[index]], [browserSnapshot[index]])) {
      differingPrimitiveIds.push(nodeSnapshot[index].primitiveId);
    }
  }

  const decision = afterShorelineOnly === null
    ? 'SHORELINE_SOURCE_LOCAL_BOUNDARY_SUFFICIENT_FOR_PREVIEW_POSITIONS'
    : afterSharedBoundary === null
      ? 'SHARED_NEUTRAL_VERTEX_BOUNDARY_REQUIRED'
      : 'SELECTED_GRID_INSUFFICIENT_AT_TESTED_BOUNDARIES';

  const receipt = {
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1B_CANONICALIZATION_BOUNDARY_SCOPE_DECISION_v1',
    eligible: afterSharedBoundary === null,
    status: afterSharedBoundary === null
      ? 'CP3D1B_BOUNDARY_SCOPE_DECISION_COMPLETE'
      : 'CP3D1B_BOUNDARY_SCOPE_DECISION_INCONCLUSIVE',
    law: {
      name: 'BINARY_GRID_2_NEGATIVE_24',
      multiplier: GRID,
      negativeZeroNormalized: true
    },
    primitiveCount: nodeSnapshot.length,
    rawFirstDifference,
    shorelineRawFirstDifference,
    differingPrimitiveIds,
    differingPrimitiveCount: differingPrimitiveIds.length,
    shorelineOnlyCandidate: {
      firstRemainingDifference: afterShorelineOnly,
      allPreviewPositionsEqual: afterShorelineOnly === null
    },
    sharedNeutralVertexCandidate: {
      firstRemainingDifference: afterSharedBoundary,
      allPreviewPositionsEqual: afterSharedBoundary === null
    },
    decision,
    boundary: {
      productionMutationPerformed: false,
      rendererExpectationUpdated: false,
      rendererGuardBypassed: false,
      mergeAuthorized: false,
      cp4Authorized: false
    }
  };

  await writeFile(
    `${evidenceDirectory}/cp3d1b-boundary-scope-decision.receipt.json`,
    `${JSON.stringify(receipt, null, 2)}\n`
  );
  console.log(JSON.stringify(receipt, null, 2));

  assert.equal(receipt.eligible, true, 'CP3D1B_SELECTED_GRID_FAILED_AT_SHARED_BOUNDARY');
  process.exitCode = 1;
} finally {
  await browser.close();
}
