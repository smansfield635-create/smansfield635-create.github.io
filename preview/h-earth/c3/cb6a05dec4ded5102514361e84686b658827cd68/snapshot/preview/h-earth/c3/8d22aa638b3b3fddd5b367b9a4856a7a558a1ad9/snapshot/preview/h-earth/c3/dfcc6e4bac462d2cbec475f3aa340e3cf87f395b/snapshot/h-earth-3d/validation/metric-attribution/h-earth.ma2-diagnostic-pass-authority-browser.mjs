import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState
} from '../../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../terrain/h-earth.successor-terrain-field.run8b.js';
import { createHEarthRun8ER3AFrameUniformPacket } from '../../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import { createHEarthRun8ER3CPersistentRenderer as createAcceptedRenderer } from '../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '../../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';
import { createHEarthRun8ER2DCanonicalGPUUploadViews } from '../../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma2-diagnostic-pass-authority.v1.mjs';
import ma1 from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma1-existing-metric-reproduction.v1.mjs';
import {
  exactBytes,
  hashBytes,
  extractAcceptedShaders,
  createMetricAttributionPassShaders,
  createMetricAttributionDiagnosticRenderer,
  readPresentedCanvas,
  readOfficialDepth,
  summarizeMaskedLuminance
} from './h-earth.metric-attribution-diagnostic-renderer.v1.mjs';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clone = (value) => JSON.parse(JSON.stringify(value));
const normalizeDegrees = (value) => {
  let result = value % 360;
  if (result > 180) result -= 360;
  if (result < -180) result += 360;
  return result;
};

function apply(state, intent) {
  const result = proposeHEarthFunctionalLandscapeNavigation(state, intent);
  if (result?.ok !== true) throw new Error(`MA2_NAVIGATION_REJECTED:${intent.action}:${result?.status}`);
  return result.state;
}
function setYaw(state, desired) {
  let delta = normalizeDegrees(desired - state.yawDegrees);
  while (Math.abs(delta) > 1e-8) {
    const amount = Math.min(8, Math.abs(delta));
    state = apply(state, { action: delta > 0 ? 'TURN_RIGHT' : 'TURN_LEFT', degrees: amount });
    delta = normalizeDegrees(desired - state.yawDegrees);
  }
  return state;
}
function setPitch(state, desired) {
  const bounded = clamp(desired, -42, 32);
  while (Math.abs(bounded - state.pitchDegrees) > 1e-8) {
    const delta = bounded - state.pitchDegrees;
    state = apply(state, { action: delta > 0 ? 'PITCH_UP' : 'PITCH_DOWN', degrees: Math.min(8, Math.abs(delta)) });
  }
  return state;
}
function setFov(state, desired) {
  while (Math.abs(desired - state.verticalFovDegrees) > 1e-8) {
    const delta = desired - state.verticalFovDegrees;
    state = apply(state, { action: delta < 0 ? 'ZOOM_IN' : 'ZOOM_OUT', degrees: Math.min(6, Math.abs(delta)) });
  }
  return state;
}
function stateForView(camera, target) {
  const initial = createHEarthFunctionalLandscapeNavigationState({ waypointId: 'COAST' });
  if (initial?.ok !== true) throw new Error('MA2_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = apply(initial.state, { action: 'SET_CAMERA_POSITION', position: { x: camera.x, y: null, z: camera.z } });
  const cameraTerrain = sampleHEarthRun8BSuccessorTerrainField(camera.x, camera.z);
  const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(target.x, target.z);
  if (cameraTerrain?.valid !== true || targetTerrain?.valid !== true) throw new Error('MA2_TERRAIN_SAMPLE_INVALID');
  const dx = target.x - camera.x;
  const dz = target.z - camera.z;
  const yaw = normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI);
  const pitch = Math.atan2(targetTerrain.elevation - (cameraTerrain.elevation + 2.25), Math.max(1e-8, Math.hypot(dx, dz))) * 180 / Math.PI;
  state = setYaw(state, yaw);
  state = setPitch(state, pitch);
  state = setFov(state, camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`MA2_SCENE_STATE_INELIGIBLE:${evaluation.issues.join(',')}`);
  return state;
}

export async function createMA2DiagnosticPassAuthoritySuite({ officialCanvas, passCanvases }) {
  const fixtureScene = ma1.scenes.find((scene) => scene.id === control.fixtureSceneId);
  if (!fixtureScene) throw new Error(`MA2_FIXTURE_SCENE_NOT_FOUND:${control.fixtureSceneId}`);
  const passKeys = Object.keys(control.passes);
  if (passKeys.join('') !== 'ABCDEFGH') throw new Error(`MA2_PASS_REGISTRY_INVALID:${passKeys.join(',')}`);
  for (const key of passKeys) {
    if (!(passCanvases[key] instanceof HTMLCanvasElement)) throw new Error(`MA2_PASS_CANVAS_REQUIRED:${key}`);
  }

  const response = await fetch('/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js', { cache: 'no-store' });
  if (!response.ok) throw new Error(`MA2_ACCEPTED_RENDERER_SOURCE_FETCH_FAILED:${response.status}`);
  const acceptedSource = await response.text();
  const acceptedShaders = extractAcceptedShaders(acceptedSource);
  const passShaders = createMetricAttributionPassShaders(acceptedShaders.FS);
  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const uploadViews = createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage);
  const state = stateForView(fixtureScene.camera, fixtureScene.target);
  const packet = createHEarthRun8ER3AFrameUniformPacket({
    navigationState: state,
    viewport: control.viewport,
    frameSequence: 1
  });

  const official = createAcceptedRenderer({
    canvas: officialCanvas,
    width: control.viewport.width,
    height: control.viewport.height
  });
  official.initialize(packet);

  const renderers = {};
  for (const key of passKeys) {
    renderers[key] = createMetricAttributionDiagnosticRenderer({
      canvas: passCanvases[key],
      width: control.viewport.width,
      height: control.viewport.height,
      vertexShader: acceptedShaders.VS,
      fragmentShader: passShaders[key],
      depthVertexShader: acceptedShaders.DVS,
      depthFragmentShader: acceptedShaders.DFS,
      uploadViews,
      renderPackage
    });
    renderers[key].initialize(packet);
  }

  const executeFixture = () => {
    official.renderFrame(packet);
    official.presentColorFrame();
    const officialBytes = readPresentedCanvas(officialCanvas);
    const officialDepth = readOfficialDepth(official, officialCanvas);
    const records = [];

    for (const key of passKeys) {
      const renderer = renderers[key];
      renderer.renderFrame(packet);
      const firstBytes = renderer.readColor();
      const firstDepth = renderer.readDepth();
      renderer.present();
      renderer.renderFrame(packet);
      const secondBytes = renderer.readColor();
      const secondDepth = renderer.readDepth();
      renderer.present();
      const summary = summarizeMaskedLuminance(firstBytes, firstDepth.mask);
      records.push({
        key,
        pass: clone(control.passes[key]),
        frameHash: hashBytes(firstBytes),
        replayFrameHash: hashBytes(secondBytes),
        depthMaskHash: hashBytes(firstDepth.mask),
        replayDepthMaskHash: hashBytes(secondDepth.mask),
        deterministic: exactBytes(firstBytes, secondBytes) && exactBytes(firstDepth.mask, secondDepth.mask),
        officialFrameEquivalent: key === 'H' ? exactBytes(firstBytes, officialBytes) : false,
        officialDepthEquivalent: key === 'H' ? exactBytes(firstDepth.mask, officialDepth.mask) : false,
        distinctFromOfficialFrame: key === 'H' ? false : !exactBytes(firstBytes, officialBytes),
        luminance: summary,
        shaderFacts: {
          flatLightingReplacementPresent: key === 'G' ? passShaders.G.includes('MA2_FLAT_LIGHTING_REPLACEMENT_BEGIN') : false,
          exactAcceptedFragmentShader: key === 'H' ? passShaders.H === acceptedShaders.FS : false
        }
      });
    }

    return clone({
      checkpoint: 'MA2',
      result: control.result,
      fixtureScene: fixtureScene,
      official: {
        frameHash: hashBytes(officialBytes),
        depthMaskHash: hashBytes(officialDepth.mask)
      },
      passes: records,
      passCount: records.length,
      allPassesDeterministic: records.every((record) => record.deterministic),
      diagnosticHByteEquivalentToOfficialAccepted: records.find((record) => record.key === 'H')?.officialFrameEquivalent === true,
      diagnosticHDepthEquivalentToOfficialAccepted: records.find((record) => record.key === 'H')?.officialDepthEquivalent === true,
      allNonReferencePassesDistinctFromOfficial: records.filter((record) => record.key !== 'H').every((record) => record.distinctFromOfficialFrame),
      allPassesHaveCoverage: records.every((record) => record.luminance.eligiblePixelCount >= control.gates.minimumEligiblePixelCount),
      allPassesHaveNontrivialVariance: records.every((record) => record.luminance.variance >= control.gates.minimumMaskedLuminanceVariance),
      productMutationPerformed: false,
      liveRouteChanged: false,
      stoppingBoundary: control.boundaries.stop
    });
  };

  return Object.freeze({ executeFixture });
}

export default createMA2DiagnosticPassAuthoritySuite;
