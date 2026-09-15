#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  sampleHEarthTerrainElevation
} from '../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  regionToHEarthPlanetPoint,
  getHEarthPlanetRelativeUp,
  getHEarthDerivedHorizonDistance
} from '../../showroom/globe/h-earth/render/planetary-world-frame.js';

export const OPERATION_ID = 'H_EARTH_CINEMATIC_CAMERA_FEASIBILITY_20260915_001';
export const EXACT_GOVERNING_HEAD = '3c5b7ece95bb6d642e527737bb60647c032e29dd';
export const FRAME_START = 720;
export const FRAME_END = 959;
export const FPS = 30;
export const VIEWPORT = Object.freeze({ width: 1280, height: 720, pixelRatio: 1 });
export const ANCHOR_FRAMES = Object.freeze([720, 780, 840, 900, 959]);
export const SPARSE_FRAMES = Object.freeze(Array.from({ length: 30 }, (_, k) => 720 + 8 * k));
export const SHARDS = Object.freeze(Array.from({ length: 8 }, (_, k) =>
  Object.freeze({ index: k, startFrame: 720 + 30 * k, endFrame: 749 + 30 * k })));
export const LOCAL_LOOK_DISTANCE = 18;
export const VERTICAL_FOV_DEGREES = 56;
export const NEAR_PLANE = 0.25;
export const LOCAL_FAR_PLANE = 512;
export const MINIMUM_PLANETARY_FAR_PLANE = 20000;
export const MINIMUM_CANONICAL_TERRAIN_CLEARANCE = 4;
export const NUMERIC_TOLERANCE = 1e-8;
export const PROGRESS_TOLERANCE = 1e-9;
export const C1_TOLERANCE = 1e-10;

export const WORLD_IDENTITY_ID =
  'H_EARTH_RUN8E_G_WORLD_3C5B7ECE_OW01_SINGLE_SPHERICAL_MANIFOLD';
export const RENDERER_IDENTITY_ID =
  'H_EARTH_RUN8E_R3C_CP2_BAND_LIMITED_RELIEF_V2_715B641F';

export const AUTHORED_POSES = Object.freeze([
  Object.freeze({
    frame: 720,
    position: Object.freeze({ x: 24, y: 14, z: -150 }),
    focusPoint: Object.freeze({ x: 72, y: 30, z: -180 })
  }),
  Object.freeze({
    frame: 780,
    position: Object.freeze({ x: 50, y: 27, z: -166 }),
    focusPoint: Object.freeze({ x: 100, y: 34, z: -197 })
  }),
  Object.freeze({
    frame: 840,
    position: Object.freeze({ x: 78, y: 35, z: -184 }),
    focusPoint: Object.freeze({ x: 122, y: 37, z: -211 })
  }),
  Object.freeze({
    frame: 900,
    position: Object.freeze({ x: 108, y: 39, z: -202 }),
    focusPoint: Object.freeze({ x: 140, y: 40.5, z: -220 })
  }),
  Object.freeze({
    frame: 959,
    position: Object.freeze({ x: 132, y: 41, z: -216 }),
    focusPoint: Object.freeze({ x: 148, y: 41.89091649760447, z: -224.5 })
  })
]);

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const sign = (value) => value < 0 ? -1 : value > 0 ? 1 : 0;
const round = (value, digits = 12) => {
  const factor = 10 ** digits;
  const result = Math.round(value * factor) / factor;
  return Object.is(result, -0) ? 0 : result;
};
const vector = (x, y, z) => ({ x, y, z });
const subtract = (a, b) => vector(a.x - b.x, a.y - b.y, a.z - b.z);
const add = (a, b) => vector(a.x + b.x, a.y + b.y, a.z + b.z);
const scale = (a, s) => vector(a.x * s, a.y * s, a.z * s);
const length = (a) => Math.hypot(a.x, a.y, a.z);
const normalize = (a) => {
  const n = length(a);
  if (!(n > Number.EPSILON)) throw new Error('CAMERA_VECTOR_DEGENERATE');
  return scale(a, 1 / n);
};
const cleanVector = (a) => vector(round(a.x), round(a.y), round(a.z));

export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) =>
    `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

export function sha256Canonical(value) {
  return crypto.createHash('sha256').update(stableStringify(value), 'utf8').digest('hex');
}

function endpointDerivative(h0, h1, delta0, delta1) {
  let d = ((2 * h0 + h1) * delta0 - h0 * delta1) / (h0 + h1);
  if (sign(d) !== sign(delta0)) d = 0;
  else if (sign(delta0) !== sign(delta1) && Math.abs(d) > 3 * Math.abs(delta0)) d = 3 * delta0;
  return d;
}

export function createPchipModel(xs, ys) {
  if (!Array.isArray(xs) || !Array.isArray(ys) || xs.length !== ys.length || xs.length < 3) {
    throw new TypeError('PCHIP_INPUT_INVALID');
  }
  const n = xs.length;
  const h = Array.from({ length: n - 1 }, (_, i) => xs[i + 1] - xs[i]);
  if (h.some((v) => !(v > 0))) throw new Error('PCHIP_X_NOT_STRICTLY_INCREASING');
  const delta = h.map((v, i) => (ys[i + 1] - ys[i]) / v);
  const d = new Array(n).fill(0);
  d[0] = endpointDerivative(h[0], h[1], delta[0], delta[1]);
  d[n - 1] = endpointDerivative(
    h[n - 2], h[n - 3], delta[n - 2], delta[n - 3]
  );
  for (let i = 1; i < n - 1; i += 1) {
    if (delta[i - 1] === 0 || delta[i] === 0 || sign(delta[i - 1]) !== sign(delta[i])) {
      d[i] = 0;
    } else {
      const w1 = 2 * h[i] + h[i - 1];
      const w2 = h[i] + 2 * h[i - 1];
      d[i] = (w1 + w2) / (w1 / delta[i - 1] + w2 / delta[i]);
    }
  }
  return Object.freeze({
    xs: Object.freeze([...xs]),
    ys: Object.freeze([...ys]),
    derivatives: Object.freeze(d)
  });
}

function locateSegment(model, x) {
  const xs = model.xs;
  if (x <= xs[0]) return 0;
  if (x >= xs[xs.length - 1]) return xs.length - 2;
  let i = 0;
  while (i + 1 < xs.length && x > xs[i + 1]) i += 1;
  return Math.min(i, xs.length - 2);
}

export function evaluatePchip(model, x) {
  const i = locateSegment(model, x);
  const x0 = model.xs[i], x1 = model.xs[i + 1], h = x1 - x0;
  const t = (x - x0) / h;
  const t2 = t * t, t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return h00 * model.ys[i] + h10 * h * model.derivatives[i] +
    h01 * model.ys[i + 1] + h11 * h * model.derivatives[i + 1];
}

export function evaluatePchipDerivative(model, x, segmentOverride = null) {
  const i = segmentOverride ?? locateSegment(model, x);
  const x0 = model.xs[i], x1 = model.xs[i + 1], h = x1 - x0;
  const t = (x - x0) / h;
  const t2 = t * t;
  const dh00 = (6 * t2 - 6 * t) / h;
  const dh10 = 3 * t2 - 4 * t + 1;
  const dh01 = (-6 * t2 + 6 * t) / h;
  const dh11 = 3 * t2 - 2 * t;
  return dh00 * model.ys[i] + dh10 * model.derivatives[i] +
    dh01 * model.ys[i + 1] + dh11 * model.derivatives[i + 1];
}

function createVectorModels(records, key) {
  const xs = records.map((entry) => entry.frame);
  return Object.freeze({
    x: createPchipModel(xs, records.map((entry) => entry[key].x)),
    y: createPchipModel(xs, records.map((entry) => entry[key].y)),
    z: createPchipModel(xs, records.map((entry) => entry[key].z))
  });
}

function evaluateVectorModels(models, frame) {
  return vector(
    evaluatePchip(models.x, frame),
    evaluatePchip(models.y, frame),
    evaluatePchip(models.z, frame)
  );
}

function createLocalCamera(position, focusPoint) {
  const direction = normalize(subtract(focusPoint, position));
  const target = add(position, scale(direction, LOCAL_LOOK_DISTANCE));
  const yawDegrees = Math.atan2(direction.x, -direction.z) * 180 / Math.PI;
  const pitchDegrees = Math.asin(direction.y) * 180 / Math.PI;
  return {
    position: cleanVector(position),
    focusPoint: cleanVector(focusPoint),
    target: cleanVector(target),
    up: { x: 0, y: 1, z: 0 },
    yawDegrees: round(yawDegrees),
    pitchDegrees: round(pitchDegrees),
    verticalFovDegrees: VERTICAL_FOV_DEGREES,
    nearPlane: NEAR_PLANE,
    farPlane: LOCAL_FAR_PLANE
  };
}

function createPlanetaryCamera(localCamera) {
  const position = regionToHEarthPlanetPoint(localCamera.position);
  const target = regionToHEarthPlanetPoint(localCamera.target);
  const up = getHEarthPlanetRelativeUp(localCamera.position);
  const horizon = getHEarthDerivedHorizonDistance(Math.max(0, localCamera.position.y));
  return {
    position: cleanVector(position),
    target: cleanVector(target),
    up: cleanVector(up),
    verticalFovDegrees: VERTICAL_FOV_DEGREES,
    nearPlane: NEAR_PLANE,
    farPlane: round(Math.max(LOCAL_FAR_PLANE, MINIMUM_PLANETARY_FAR_PLANE, horizon + 1800))
  };
}

function identityRecords() {
  return {
    navigation: {
      contractId: 'H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_RUN_6F_v1',
      sourcePath: 'showroom/globe/h-earth/functional-landscape/navigation.js',
      sourceBlobSha: '7f0506771ed8d4ea66685e0ae21f9459f2746970'
    },
    world: {
      identityId: WORLD_IDENTITY_ID,
      topologySourceId: 'H_EARTH_CANONICAL_WORLD_TOPOLOGY_G_WORLD_v1',
      worldManifoldContractId: 'H_EARTH_WORLD_MANIFOLD_DOMAIN_v1',
      planetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
      terrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
      inlandMountainWatershedSystemId: H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM.systemId,
      r3aFrameContractId: 'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_v1',
      packageOccurrenceId: 'H_EARTH_OW01_GRATITUDE_COASTAL_ENTRY_LIVE_RENDER_PACKAGE_OCCURRENCE_001',
      canonicalPackageSourcePath: 'showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js',
      canonicalPackageSourceBlobSha: '74d53736d37754c609fbe8109be432b210ae5a1c',
      r3aSourcePath: 'showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js',
      r3aSourceBlobSha: 'a7a3af32eb82e8ea74102d3b912a1a7b719caf3a',
      worldManifoldSourceBlobSha: '09ceab4505c52c8bede19afb77343fc1f7ed2d7f',
      successorTerrainSourceBlobSha: '4f929cd467edb447e2116de745d9b02c28daf219'
    },
    renderer: {
      identityId: RENDERER_IDENTITY_ID,
      rendererId: 'H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1',
      presentationProfileId: 'H_EARTH_CURRENT_LIVE_BAND_LIMITED_TERRAIN_RELIEF_PRESENTATION_PROFILE_v2',
      sourcePath: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',
      sourceBlobSha: '715b641f1fdc5ab9c0d007c22ca6399e88c997e7',
      liveBindingId: 'H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_BINDING_v1',
      liveBindingSourcePath: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
      liveBindingSourceBlobSha: '16bc8c45fb5c2363326d05f7610e11387b3a4e38',
      publicIntegrationId: 'H_EARTH_RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION_v1',
      publicIntegrationSourcePath: 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
      publicIntegrationSourceBlobSha: '174f54441f0a9b084013317457bfa660de9a2328',
      selectedByPublicDefaultVisualQuery: 'terrain-relief-v2'
    }
  };
}

export function buildManifestCore() {
  const positionModels = createVectorModels(AUTHORED_POSES, 'position');
  const focusModels = createVectorModels(AUTHORED_POSES, 'focusPoint');
  const frames = [];
  for (let frame = FRAME_START; frame <= FRAME_END; frame += 1) {
    const position = evaluateVectorModels(positionModels, frame);
    const focusPoint = evaluateVectorModels(focusModels, frame);
    const localCamera = createLocalCamera(position, focusPoint);
    const canonicalTerrainElevation = sampleHEarthTerrainElevation(
      localCamera.position.x, localCamera.position.z
    );
    if (!finite(canonicalTerrainElevation)) throw new Error(`TERRAIN_SAMPLE_INVALID:${frame}`);
    const terrainClearance = localCamera.position.y - canonicalTerrainElevation;
    if (terrainClearance < MINIMUM_CANONICAL_TERRAIN_CLEARANCE) {
      throw new Error(`TERRAIN_CLEARANCE_TOO_SMALL:${frame}:${terrainClearance}`);
    }
    const planetaryCamera = createPlanetaryCamera(localCamera);
    frames.push({
      frame,
      timeSeconds: round(frame / FPS, 9),
      localAuthoring: {
        ...localCamera,
        canonicalTerrainElevationAtCamera: round(canonicalTerrainElevation),
        terrainClearance: round(terrainClearance)
      },
      position: planetaryCamera.position,
      target: planetaryCamera.target,
      up: planetaryCamera.up,
      verticalFovDegrees: planetaryCamera.verticalFovDegrees,
      nearPlane: planetaryCamera.nearPlane,
      farPlane: planetaryCamera.farPlane,
      worldIdentityId: WORLD_IDENTITY_ID,
      rendererIdentityId: RENDERER_IDENTITY_ID
    });
  }

  return {
    schema: 'H_EARTH_CINEMATIC_CAMERA_MANIFEST_v1',
    operationId: OPERATION_ID,
    exactGoverningHead: EXACT_GOVERNING_HEAD,
    masterCoordinateSystem: {
      fps: FPS,
      masterDurationSeconds: 42,
      startFrame: FRAME_START,
      endFrame: FRAME_END,
      startSeconds: FRAME_START / FPS,
      endExclusiveSeconds: (FRAME_END + 1) / FPS,
      frameCount: FRAME_END - FRAME_START + 1,
      viewport: VIEWPORT
    },
    identities: identityRecords(),
    laws: {
      interpolation: 'COMPONENTWISE_PCHIP_MONOTONE_CUBIC_HERMITE_C1',
      localLookDistance: LOCAL_LOOK_DISTANCE,
      noRoll: true,
      noLensAnimation: true,
      verticalFovDegrees: VERTICAL_FOV_DEGREES,
      nearPlane: NEAR_PLANE,
      localFarPlane: LOCAL_FAR_PLANE,
      minimumPlanetaryFarPlane: MINIMUM_PLANETARY_FAR_PLANE,
      minimumCanonicalTerrainClearance: MINIMUM_CANONICAL_TERRAIN_CLEARANCE,
      numericTolerance: NUMERIC_TOLERANCE,
      progressTolerance: PROGRESS_TOLERANCE,
      c1Tolerance: C1_TOLERANCE,
      frameIndependence:
        'MASTER_FRAME_TO_MANIFEST_LOOKUP_TO_EXPLICIT_STATE_TO_INDEPENDENT_DRAW_TO_CAPTURE',
      shardLaw: 'MAXIMUM_30_DRAWS_PER_RENDERER_CONTEXT_THEN_CONTEXT_MUST_BE_LOST_OR_PAGE_DISCARDED'
    },
    authoredPoses: AUTHORED_POSES.map((entry) => ({
      frame: entry.frame,
      position: { ...entry.position },
      focusPoint: { ...entry.focusPoint }
    })),
    pchipDerivatives: {
      position: Object.fromEntries(['x','y','z'].map((axis) =>
        [axis, positionModels[axis].derivatives.map((value) => round(value, 15))])),
      focusPoint: Object.fromEntries(['x','y','z'].map((axis) =>
        [axis, focusModels[axis].derivatives.map((value) => round(value, 15))]))
    },
    anchorFrames: [...ANCHOR_FRAMES],
    sparseFrames: [...SPARSE_FRAMES],
    shards: SHARDS.map((entry) => ({ ...entry })),
    frames
  };
}

export function buildManifest() {
  const core = buildManifestCore();
  return {
    ...core,
    manifestDigest: {
      algorithm: 'SHA-256',
      canonicalization: 'RECURSIVE_SORTED_KEYS_UTF8_NO_WHITESPACE',
      sha256: sha256Canonical(core)
    }
  };
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) throw new Error(`UNKNOWN_ARGUMENT:${key}`);
    out[key.slice(2)] = argv[i + 1] ?? true;
    if (argv[i + 1] && !argv[i + 1].startsWith('--')) i += 1;
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const output = path.resolve(args.output ?? path.join(path.dirname(fileURLToPath(import.meta.url)), 'manifest.json'));
  fs.writeFileSync(output, `${JSON.stringify(buildManifest(), null, 2)}\n`, 'utf8');
  process.stdout.write(`${output}\n`);
}
