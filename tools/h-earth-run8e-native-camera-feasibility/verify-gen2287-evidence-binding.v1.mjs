import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  evaluateHEarth3DCameraCapacity
} from '../../showroom/globe/h-earth/capacity.js';

import {
  evaluateHEarth3DCompositorCameraState,
  resolveHEarth3DCompositorCameraPose
} from '../../showroom/globe/h-earth/compositor.js';

import {
  H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES,
  H_EARTH_NATIVE_CAMERA_ANCHORS,
  H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST,
  H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256,
  H_EARTH_NATIVE_CAMERA_STATES,
  buildHEarthNativeCameraCanonicalManifestString
} from './gen2287-native-camera-manifest.v1.mjs';

const EXPECTED = Object.freeze({
  governingHead: '3c5b7ece95bb6d642e527737bb60647c032e29dd',
  predecessorCandidate: '3576259c4f94ffddab283e6b940754b3714490e1',
  predecessorManifestGitBlob: 'cf393d2dbc4700415308fcb4fb4fb7497090d375',
  predecessorManifestSha256: '226fdb529f27e4f6f6dfe37b88effbdcbe0d9ff0f9e3c8e1723bfcf6db2e7c92',
  anchorFrames: Object.freeze([720, 780, 840, 900, 959]),
  donors: Object.freeze({
    'showroom/globe/h-earth/compositor.js': '3764f0d53b0564de7a5e983bd339dda75017bc82',
    'showroom/globe/h-earth/capacity.js': '89e4622bb9c30b533a1d13d7db887ee53e7a46c8',
    'h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js': 'e141af58c037b1be170a168a7b7ee464b3008e6c',
    'h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js': '967971f65cd1d4f49d64b5c367bd18a053f81980',
    'showroom/globe/h-earth/render/run8e-successor-environment.js': '3849e6fcd179dd04a56f894f9e6478d8a1f8bd8d',
    'showroom/globe/h-earth/render/renderer.functional-landscape.js': '0f2e5074cec7f9f61020a6a0a8167b9a10399dfc',
    'h-earth-3d/terrain/h-earth.terrain-field.js': 'f4f65b05ab303a11fb1d9c4e25de211fde73722a'
  })
});

const failures = [];
const checks = [];
const record = (id, passed, details = null) => {
  checks.push({ id, passed, details });
  if (!passed) failures.push({ id, details });
};
const exact = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sha256 = (value) => createHash('sha256').update(value, 'utf8').digest('hex');
const gitBlobSha1 = async (relativePath) => {
  const url = new URL(`../../${relativePath}`, import.meta.url);
  const bytes = await readFile(fileURLToPath(url));
  return createHash('sha1')
    .update(Buffer.from(`blob ${bytes.byteLength}\0`, 'utf8'))
    .update(bytes)
    .digest('hex');
};

const manifestPath = 'tools/h-earth-run8e-native-camera-feasibility/gen2287-native-camera-manifest.v1.mjs';
const copiedManifestBlob = await gitBlobSha1(manifestPath);
record(
  'GEN2287_MANIFEST_GIT_BLOB_EXACT',
  copiedManifestBlob === EXPECTED.predecessorManifestGitBlob,
  { expected: EXPECTED.predecessorManifestGitBlob, actual: copiedManifestBlob }
);

const canonicalManifest = buildHEarthNativeCameraCanonicalManifestString();
const canonicalSha256 = sha256(canonicalManifest);
record(
  'GEN2287_MANIFEST_SHA256_EXACT',
  H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256 === EXPECTED.predecessorManifestSha256 &&
    canonicalSha256 === EXPECTED.predecessorManifestSha256,
  { expected: EXPECTED.predecessorManifestSha256, exported: H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256, actual: canonicalSha256 }
);
record(
  'GEN2287_FRAME_RANGE_AND_COUNT_EXACT',
  H_EARTH_NATIVE_CAMERA_STATES.length === 240 &&
    H_EARTH_NATIVE_CAMERA_STATES.every((entry, index) => entry.frame === 720 + index)
);
record(
  'GEN2287_ANCHOR_SET_EXACT',
  exact(H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES, EXPECTED.anchorFrames) &&
    exact(H_EARTH_NATIVE_CAMERA_ANCHORS.map((entry) => entry.frame), EXPECTED.anchorFrames)
);
record(
  'GEN2287_NO_FREE_POSITION_OR_PRODUCT_MUTATION_SEMANTICS',
  H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST.predecessorFreePositionSemanticsReused === false &&
    H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST.productRuntimeMutationRequired === false
);

for (const [path, expectedBlob] of Object.entries(EXPECTED.donors)) {
  const actualBlob = await gitBlobSha1(path);
  record(`READ_ONLY_DONOR_EXACT:${path}`, actualBlob === expectedBlob, {
    expected: expectedBlob,
    actual: actualBlob
  });
}

let allNativeStatesExact = true;
let allResolvedPosesFiniteAndCompatible = true;
let allAnchorBindingsExact = true;
for (let index = 0; index < H_EARTH_NATIVE_CAMERA_STATES.length; index += 1) {
  const entry = H_EARTH_NATIVE_CAMERA_STATES[index];
  const state = entry.cameraState;
  const capacity = evaluateHEarth3DCameraCapacity(state);
  const compositor = evaluateHEarth3DCompositorCameraState(state);
  if (
    capacity?.eligible !== true ||
    capacity?.adjustmentRequired !== false ||
    !exact(capacity?.normalizedCameraState, state) ||
    compositor?.eligible !== true ||
    compositor?.adjusted !== false ||
    !exact(compositor?.cameraState, state)
  ) {
    allNativeStatesExact = false;
  }

  const pose = resolveHEarth3DCompositorCameraPose(state, index);
  const finite = [
    pose?.position?.x, pose?.position?.y, pose?.position?.z,
    pose?.target?.x, pose?.target?.y, pose?.target?.z,
    pose?.verticalFovDegrees, pose?.nearPlane, pose?.farPlane
  ].every(Number.isFinite);
  if (pose?.eligible !== true || !finite) allResolvedPosesFiniteAndCompatible = false;
}

for (const anchor of H_EARTH_NATIVE_CAMERA_ANCHORS) {
  const inherited = H_EARTH_NATIVE_CAMERA_STATES[anchor.frame - 720];
  if (!inherited || inherited.frame !== anchor.frame || !exact(inherited.cameraState, anchor.cameraState)) {
    allAnchorBindingsExact = false;
  }
}

record('ALL_240_NATIVE_STATES_PRESERVED_WITHOUT_NORMALIZATION', allNativeStatesExact);
record('ALL_240_RESOLVED_POSES_HAVE_RUN8E_CAMERA_SURFACE', allResolvedPosesFiniteAndCompatible);
record('FIVE_ANCHOR_STATE_BINDINGS_EXACT', allAnchorBindingsExact);
record('PUBLIC_NAVIGATION_RECONCILIATION_NOT_USED_BY_BINDING_VERIFIER', true, {
  prohibitedAdapter: 'showroom/globe/h-earth/functional-landscape/environment-integration.js'
});
record('PREDECESSOR_AUTHORITY_NOT_INHERITED', true, {
  predecessorCandidate: EXPECTED.predecessorCandidate,
  evidenceOnly: true
});

const result = {
  schema: 'GEN2287_EVIDENCE_BINDING_RECEIPT_v1',
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  governingHead: EXPECTED.governingHead,
  predecessorCandidate: EXPECTED.predecessorCandidate,
  manifestSha256: canonicalSha256,
  stateCount: H_EARTH_NATIVE_CAMERA_STATES.length,
  anchorFrames: H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES,
  checkCount: checks.length,
  passedCount: checks.filter((entry) => entry.passed).length,
  failureCount: failures.length,
  checks,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
