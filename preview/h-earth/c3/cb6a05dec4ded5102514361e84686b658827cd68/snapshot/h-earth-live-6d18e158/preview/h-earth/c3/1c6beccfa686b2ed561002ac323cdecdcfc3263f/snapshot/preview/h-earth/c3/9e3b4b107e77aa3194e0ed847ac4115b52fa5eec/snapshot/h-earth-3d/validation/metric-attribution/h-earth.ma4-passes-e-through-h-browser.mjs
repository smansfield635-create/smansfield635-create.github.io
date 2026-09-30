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
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma4-passes-e-through-h.v1.mjs';
import {
  exactBytes,
  hashBytes,
  extractAcceptedShaders,
  createMetricAttributionPassShaders,
  createMetricAttributionDiagnosticRenderer,
  readPresentedCanvas,
  readOfficialDepth
} from './h-earth.metric-attribution-diagnostic-renderer.v1.mjs';
import {
  analyzeDirectionalFrame,
  summarizePassScenes
} from './h-earth.metric-attribution-directional-metric.v1.mjs';

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
  if (result?.ok !== true) throw new Error(`MA4_NAVIGATION_REJECTED:${intent.action}:${result?.status}`);
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
  if (initial?.ok !== true) throw new Error('MA4_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = apply(initial.state, { action: 'SET_CAMERA_POSITION', position: { x: camera.x, y: null, z: camera.z } });
  const cameraTerrain = sampleHEarthRun8BSuccessorTerrainField(camera.x, camera.z);
  const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(target.x, target.z);
  if (cameraTerrain?.valid !== true || targetTerrain?.valid !== true) throw new Error('MA4_TERRAIN_SAMPLE_INVALID');
  const dx = target.x - camera.x;
  const dz = target.z - camera.z;
  state = setYaw(state, normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI));
  state = setPitch(state, Math.atan2(targetTerrain.elevation - (cameraTerrain.elevation + 2.25), Math.max(1e-8, Math.hypot(dx, dz))) * 180 / Math.PI);
  state = setFov(state, camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`MA4_SCENE_STATE_INELIGIBLE:${evaluation.issues.join(',')}`);
  return state;
}

export async function createMA4PassesEThroughHSuite({ officialCanvas, passCanvases }) {
  const passKeys = Object.keys(control.passes);
  if (passKeys.join('') !== 'EFGH') throw new Error(`MA4_PASS_REGISTRY_INVALID:${passKeys.join(',')}`);
  for (const key of passKeys) {
    if (!(passCanvases[key] instanceof HTMLCanvasElement)) throw new Error(`MA4_PASS_CANVAS_REQUIRED:${key}`);
  }
  const response = await fetch('/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js', { cache: 'no-store' });
  if (!response.ok) throw new Error(`MA4_ACCEPTED_RENDERER_SOURCE_FETCH_FAILED:${response.status}`);
  const acceptedShaders = extractAcceptedShaders(await response.text());
  const passShaders = createMetricAttributionPassShaders(acceptedShaders.FS);
  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const uploadViews = createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage);
  let sequence = 1;
  const initialScene = control.scenes[0];
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({
    navigationState: stateForView(initialScene.camera, initialScene.target),
    viewport: control.viewport,
    frameSequence: sequence
  });
  const official = createAcceptedRenderer({
    canvas: officialCanvas,
    width: control.viewport.width,
    height: control.viewport.height
  });
  official.initialize(initialPacket);
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
    renderers[key].initialize(initialPacket);
  }
  const sceneMap = new Map(control.scenes.map((scene) => [scene.id, scene]));
  const records = [];
  const analysis = {
    normalizedAnalysisSize: control.normalizedAnalysisSize,
    gaussianSigmasPixels: control.finalFrameMetric.gaussianSigmasPixels,
    orientationsDegrees: control.finalFrameMetric.orientationsDegrees,
    lagsPixels: control.finalFrameMetric.lagsPixels
  };

  const renderScene = (sceneId) => {
    const scene = sceneMap.get(sceneId);
    if (!scene) throw new Error(`MA4_SCENE_UNKNOWN:${sceneId}`);
    const packet = createHEarthRun8ER3AFrameUniformPacket({
      navigationState: stateForView(scene.camera, scene.target),
      viewport: control.viewport,
      frameSequence: ++sequence
    });
    official.renderFrame(packet);
    official.presentColorFrame();
    const officialBytes = readPresentedCanvas(officialCanvas);
    const officialDepth = readOfficialDepth(official, officialCanvas);
    const passRecords = {};
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
      passRecords[key] = {
        key,
        pass: clone(control.passes[key]),
        frameHash: hashBytes(firstBytes),
        replayFrameHash: hashBytes(secondBytes),
        depthMaskHash: hashBytes(firstDepth.mask),
        replayDepthMaskHash: hashBytes(secondDepth.mask),
        deterministic: exactBytes(firstBytes, secondBytes) && exactBytes(firstDepth.mask, secondDepth.mask),
        officialFrameEquivalent: key === 'H' ? exactBytes(firstBytes, officialBytes) : false,
        officialDepthEquivalent: key === 'H' ? exactBytes(firstDepth.mask, officialDepth.mask) : false,
        metric: analyzeDirectionalFrame(firstBytes, firstDepth.mask, control.viewport.width, control.viewport.height, analysis)
      };
    }
    const record = {
      scene: clone(scene),
      official: { frameHash: hashBytes(officialBytes), depthMaskHash: hashBytes(officialDepth.mask) },
      passes: passRecords
    };
    records.push(record);
    return clone(record);
  };

  const finalize = () => {
    const passSummaries = {};
    for (const key of passKeys) {
      passSummaries[key] = {
        pass: clone(control.passes[key]),
        ...summarizePassScenes(records.map((record) => ({ scene: record.scene, metric: record.passes[key].metric })))
      };
    }
    const allPassRecords = records.flatMap((record) => Object.values(record.passes));
    const hAggregateScore = passSummaries.H.aggregateScore;
    return clone({
      checkpoint: 'MA4',
      result: control.result,
      sceneCount: records.length,
      passCount: passKeys.length,
      outputCount: allPassRecords.length,
      scenes: records,
      passSummaries,
      allOutputsDeterministic: allPassRecords.every((record) => record.deterministic),
      hOfficialColorEquivalenceSceneCount: records.filter((record) => record.passes.H.officialFrameEquivalent).length,
      hOfficialDepthEquivalenceSceneCount: records.filter((record) => record.passes.H.officialDepthEquivalent).length,
      hAggregateScore,
      expectedAcceptedAggregateScore: control.expectedAcceptedAggregateScore,
      hAggregateAbsoluteDifference: Math.abs(hAggregateScore - control.expectedAcceptedAggregateScore),
      hAggregateWithinTolerance: Math.abs(hAggregateScore - control.expectedAcceptedAggregateScore) <= control.acceptedAggregateAbsoluteTolerance,
      allMetricsFinite: allPassRecords.every((record) => [
        record.metric.sceneScore,
        record.metric.peakStrength,
        record.metric.eligibleFraction,
        ...Object.values(record.metric.bands).flatMap((band) => [band.peakStrength, band.signedCorrelation])
      ].every(Number.isFinite)),
      allOutputsHaveCoverage: allPassRecords.every((record) => record.metric.eligiblePixelCount >= control.gates.minimumEligiblePixelCount),
      productMutationPerformed: false,
      liveRouteChanged: false,
      stoppingBoundary: control.boundaries.stop
    });
  };

  return Object.freeze({ listSceneIds: () => [...sceneMap.keys()], renderScene, finalize });
}

export default createMA4PassesEThroughHSuite;
