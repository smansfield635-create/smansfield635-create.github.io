import assert from 'node:assert/strict';

import {
  constructHEarthFunctionalLandscapeTerrain
} from '../../showroom/globe/h-earth/render/geometry-landscape.js';

import {
  constructHEarthFunctionalShorelineGeometry
} from '../../showroom/globe/h-earth/render/geometry-shoreline.js';

import {
  constructHEarthDistantContextGeometry
} from '../../showroom/globe/h-earth/render/geometry-distant-context.js';

import {
  previewHEarthFunctionalLandscape
} from '../../showroom/globe/h-earth/render/landscape-preview.js';

const terrain = constructHEarthFunctionalLandscapeTerrain();
const shoreline = constructHEarthFunctionalShorelineGeometry();
const distant = constructHEarthDistantContextGeometry();
const preview = previewHEarthFunctionalLandscape();

console.log(JSON.stringify({
  diagnosticType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6C_DIAGNOSTIC',
  terrain: {
    ok: terrain.ok,
    status: terrain.status,
    requestedChunkCount: terrain.requestedChunkCount,
    constructedChunkCount: terrain.constructedChunkCount,
    realizedTerrainAddressCount: terrain.realizedTerrainAddressCount,
    issues: terrain.issues,
    chunkFailures: (terrain.chunkResults ?? [])
      .filter((result) => result.ok !== true)
      .map((result) => ({
        chunkId: result.chunkId,
        issues: result.issues
      }))
  },
  shoreline: {
    ok: shoreline.ok,
    status: shoreline.status,
    bandCount: shoreline.bandCount,
    issues: shoreline.issues,
    bandFailures: (shoreline.results ?? [])
      .filter((result) => result.ok !== true)
      .map((result) => ({
        bandId: result.bandId,
        issues: result.issues
      }))
  },
  distant: {
    ok: distant.ok,
    status: distant.status,
    primitiveCount: distant.primitives?.length ?? 0,
    issues: distant.issues
  },
  preview: {
    ok: preview.ok,
    status: preview.status,
    primitiveCount: preview.primitiveCount,
    semanticAddressCount: preview.semanticAddressCount,
    terrainAddressCount: preview.terrainAddressCount,
    shorelineWaterAddressCount: preview.shorelineWaterAddressCount,
    proxySummarizedAddressCount: preview.proxySummarizedAddressCount,
    issues: preview.issues
  }
}, null, 2));

assert.equal(terrain.ok, true);
assert.equal(terrain.requestedChunkCount, 10);
assert.equal(terrain.constructedChunkCount, 10);
assert.equal(terrain.realizedTerrainAddressCount, 124);
assert.equal(terrain.chunkResults.every((result) => result.ok), true);
assert.equal(shoreline.ok, true);
assert.equal(shoreline.bandCount, 7);
assert.equal(distant.ok, true);
assert.equal(distant.primitives.length, 1);
assert.equal(preview.ok, true);
assert.equal(preview.primitiveCount, 18);
assert.equal(preview.semanticAddressCount, 256);
assert.equal(preview.semanticAddressIds.length, 256);
assert.equal(preview.terrainAddressCount, 124);
assert.equal(preview.terrainAddressIds.length, 124);
assert.equal(preview.shorelineWaterAddressCount, 96);
assert.equal(preview.shorelineWaterAddressIds.length, 96);
assert.equal(preview.proxySummarizedAddressCount, 36);
assert.equal(preview.proxySummarizedAddressIds.length, 36);
assert.equal(preview.admitted, false);
assert.equal(preview.WestAdmissionPerformed, false);
assert.equal(preview.compositorNodeCreated, false);
assert.equal(preview.renderInstanceCreated, false);

const receipt = {
  receiptType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6C_RECEIPT',
  contractId: preview.contractId,
  eligible: true,
  status: preview.status,
  terrainChunkCount: terrain.constructedChunkCount,
  shorelineBandCount: shoreline.bandCount,
  distantProxyCount: distant.primitives.length,
  primitiveCount: preview.primitiveCount,
  semanticAddressCount: preview.semanticAddressCount,
  terrainAddressCount: preview.terrainAddressCount,
  shorelineWaterAddressCount: preview.shorelineWaterAddressCount,
  proxySummarizedAddressCount: preview.proxySummarizedAddressCount,
  sharedEdgeValidation: 'PASS',
  admissionPerformed: false,
  issues: []
};

console.log(JSON.stringify(receipt, null, 2));
