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
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.rma2-bounded-combination-classification.v1.mjs';
import {
  exactBytes,
  hashBytes,
  extractAcceptedShaders,
  createMetricAttributionPassShaders,
  createMetricAttributionDiagnosticRenderer,
  readPresentedCanvas,
  readOfficialDepth
} from './h-earth.metric-attribution-diagnostic-renderer.v1.mjs';
import { createRMA1FamilyShaders } from './h-earth.rma1-single-family-ablations-browser.mjs';
import { analyzeDirectionalFrame, summarizePassScenes } from './h-earth.metric-attribution-directional-metric.v1.mjs';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const clone = (value) => JSON.parse(JSON.stringify(value));
const ratio = (left, right) => Math.max(Math.abs(left), Math.abs(right)) > 1e-15
  ? Math.min(Math.abs(left), Math.abs(right)) / Math.max(Math.abs(left), Math.abs(right))
  : 1;
const pearson = (left, right) => {
  const leftMean = average(left);
  const rightMean = average(right);
  const leftCentered = left.map((value) => value - leftMean);
  const rightCentered = right.map((value) => value - rightMean);
  const denominator = Math.sqrt(
    leftCentered.reduce((sum, value) => sum + value * value, 0) *
    rightCentered.reduce((sum, value) => sum + value * value, 0)
  );
  return denominator > 1e-15
    ? leftCentered.reduce((sum, value, index) => sum + value * rightCentered[index], 0) / denominator
    : 0;
};
const normalizeDegrees = (value) => {
  let result = value % 360;
  if (result > 180) result -= 360;
  if (result < -180) result += 360;
  return result;
};

function apply(state, intent) {
  const result = proposeHEarthFunctionalLandscapeNavigation(state, intent);
  if (result?.ok !== true) throw new Error(`RMA2_NAVIGATION_REJECTED:${intent.action}:${result?.status}`);
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
  if (initial?.ok !== true) throw new Error('RMA2_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = apply(initial.state, { action: 'SET_CAMERA_POSITION', position: { x: camera.x, y: null, z: camera.z } });
  const cameraTerrain = sampleHEarthRun8BSuccessorTerrainField(camera.x, camera.z);
  const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(target.x, target.z);
  if (cameraTerrain?.valid !== true || targetTerrain?.valid !== true) throw new Error('RMA2_TERRAIN_SAMPLE_INVALID');
  const dx = target.x - camera.x;
  const dz = target.z - camera.z;
  state = setYaw(state, normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI));
  state = setPitch(state, Math.atan2(targetTerrain.elevation - (cameraTerrain.elevation + 2.25), Math.max(1e-8, Math.hypot(dx, dz))) * 180 / Math.PI);
  state = setFov(state, camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`RMA2_SCENE_STATE_INELIGIBLE:${evaluation.issues.join(',')}`);
  return state;
}

function removeManorBlock(family4Shader) {
  const startMarker = '    vec2 manorCenter=vec2(80.0,-172.0);';
  const endMarker = '    vec2 cavernCenter=vec2(40.0,-284.0);';
  const start = family4Shader.indexOf(startMarker);
  const secondStart = family4Shader.indexOf(startMarker, start + 1);
  const end = family4Shader.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || secondStart >= 0 || end < 0) throw new Error(`RMA2_COMBINATION_MANOR_BLOCK_NOT_UNIQUE:${start}:${secondStart}:${end}`);
  return family4Shader.slice(0, start) + '    // RMA2_COMBINATION_FAMILY_5_PLUS_FAMILY_4_MANOR_BLOCK_NEUTRALIZED\n' + family4Shader.slice(end);
}

function compareRecordSets(candidateRecords, referenceRecords) {
  const referenceByScene = new Map(referenceRecords.map((record) => [record.scene.id, record]));
  const gridPearsons = [];
  const peakRatios = [];
  let exactBandMatchCount = 0;
  let dominantSceneExactMatchCount = 0;
  for (const candidate of candidateRecords) {
    const reference = referenceByScene.get(candidate.scene.id);
    if (!reference) throw new Error(`RMA2_REFERENCE_SCENE_MISSING:${candidate.scene.id}`);
    for (const bandKey of ['micro', 'meso', 'macro']) {
      const candidateBand = candidate.metric.bands[bandKey];
      const referenceBand = reference.metric.bands[bandKey];
      if (candidateBand.dominantOrientationDegrees === referenceBand.dominantOrientationDegrees && candidateBand.dominantLagPixels === referenceBand.dominantLagPixels) exactBandMatchCount += 1;
      gridPearsons.push(pearson(candidateBand.grid.map((entry) => entry.peakStrength), referenceBand.grid.map((entry) => entry.peakStrength)));
      peakRatios.push(ratio(candidateBand.peakStrength, referenceBand.peakStrength));
    }
    if (candidate.metric.dominantOrientationDegrees === reference.metric.dominantOrientationDegrees && candidate.metric.dominantLagPixels === reference.metric.dominantLagPixels) dominantSceneExactMatchCount += 1;
  }
  const candidateScores = candidateRecords.map((record) => record.metric.sceneScore);
  const referenceScores = candidateRecords.map((record) => referenceByScene.get(record.scene.id).metric.sceneScore);
  const aggregateScore = average(candidateScores);
  const referenceAggregateScore = average(referenceScores);
  return {
    exactBandMatchCount,
    exactBandComparisonCount: candidateRecords.length * 3,
    meanBandGridPearson: average(gridPearsons),
    sceneScorePearson: pearson(candidateScores, referenceScores),
    meanPeakStrengthRatio: average(peakRatios),
    dominantSceneExactMatchCount,
    dominantSceneComparisonCount: candidateRecords.length,
    aggregateScore,
    referenceAggregateScore,
    aggregateScoreRatio: ratio(aggregateScore, referenceAggregateScore)
  };
}

function compactMetric(metric) {
  return {
    sceneScore: metric.sceneScore,
    dominantBand: metric.dominantBand,
    dominantOrientationDegrees: metric.dominantOrientationDegrees,
    dominantLagPixels: metric.dominantLagPixels,
    peakStrength: metric.peakStrength,
    eligiblePixelCount: metric.eligiblePixelCount,
    eligibleFraction: metric.eligibleFraction,
    bands: Object.fromEntries(Object.entries(metric.bands).map(([key, band]) => [key, {
      peakStrength: band.peakStrength,
      signedCorrelation: band.signedCorrelation,
      dominantOrientationDegrees: band.dominantOrientationDegrees,
      dominantLagPixels: band.dominantLagPixels,
      pairCount: band.pairCount
    }]))
  };
}

export async function createRMA2BoundedCombinationSuite({ officialCanvas, passCanvases }) {
  for (const key of ['G', 'H', 'COMBINATION']) {
    if (!(passCanvases[key] instanceof HTMLCanvasElement)) throw new Error(`RMA2_PASS_CANVAS_REQUIRED:${key}`);
  }
  const response = await fetch('/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js', { cache: 'no-store' });
  if (!response.ok) throw new Error(`RMA2_ACCEPTED_RENDERER_SOURCE_FETCH_FAILED:${response.status}`);
  const acceptedShaders = extractAcceptedShaders(await response.text());
  const maPassShaders = createMetricAttributionPassShaders(acceptedShaders.FS);
  const family4Shader = createRMA1FamilyShaders(maPassShaders.G).FAMILY_4;
  const combinationShader = removeManorBlock(family4Shader);
  if (!combinationShader.includes('RMA1_FAMILY_4_CONTOUR_NEUTRAL') || !combinationShader.includes('RMA2_COMBINATION_FAMILY_5_PLUS_FAMILY_4')) {
    throw new Error('RMA2_COMBINATION_MARKERS_INCOMPLETE');
  }
  const shaderMap = { G: maPassShaders.G, H: maPassShaders.H, COMBINATION: combinationShader };
  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const uploadViews = createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage);
  let sequence = 1;
  const initialScene = control.scenes[0];
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({ navigationState: stateForView(initialScene.camera, initialScene.target), viewport: control.viewport, frameSequence: sequence });
  const official = createAcceptedRenderer({ canvas: officialCanvas, width: control.viewport.width, height: control.viewport.height });
  official.initialize(initialPacket);
  const renderers = {};
  for (const key of Object.keys(shaderMap)) {
    renderers[key] = createMetricAttributionDiagnosticRenderer({
      canvas: passCanvases[key], width: control.viewport.width, height: control.viewport.height,
      vertexShader: acceptedShaders.VS, fragmentShader: shaderMap[key],
      depthVertexShader: acceptedShaders.DVS, depthFragmentShader: acceptedShaders.DFS,
      uploadViews, renderPackage
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
    if (!scene) throw new Error(`RMA2_SCENE_UNKNOWN:${sceneId}`);
    const packet = createHEarthRun8ER3AFrameUniformPacket({ navigationState: stateForView(scene.camera, scene.target), viewport: control.viewport, frameSequence: ++sequence });
    official.renderFrame(packet);
    official.presentColorFrame();
    const officialBytes = readPresentedCanvas(officialCanvas);
    const officialDepth = readOfficialDepth(official, officialCanvas);
    const passes = {};
    const firstBytesByKey = {};
    for (const key of Object.keys(shaderMap)) {
      const renderer = renderers[key];
      renderer.renderFrame(packet);
      const firstBytes = renderer.readColor();
      const firstDepth = renderer.readDepth();
      renderer.present();
      renderer.renderFrame(packet);
      const secondBytes = renderer.readColor();
      const secondDepth = renderer.readDepth();
      renderer.present();
      firstBytesByKey[key] = firstBytes;
      passes[key] = {
        key,
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
    passes.COMBINATION.distinctFromG = !exactBytes(firstBytesByKey.COMBINATION, firstBytesByKey.G);
    const record = { scene: clone(scene), official: { frameHash: hashBytes(officialBytes), depthMaskHash: hashBytes(officialDepth.mask) }, passes };
    records.push(record);
    return clone({ scene: record.scene, official: record.official, passes: Object.fromEntries(Object.entries(passes).map(([key, value]) => [key, { ...value, metric: compactMetric(value.metric) }])) });
  };

  const finalize = () => {
    const keys = ['G', 'H', 'COMBINATION'];
    const byKey = Object.fromEntries(keys.map((key) => [key, records.map((record) => ({ scene: record.scene, ...record.passes[key] }))]));
    const summaries = Object.fromEntries(keys.map((key) => [key, summarizePassScenes(byKey[key].map((record) => ({ scene: record.scene, metric: record.metric })))]));
    const gToH = compareRecordSets(byKey.G, byKey.H);
    const compareToG = compareRecordSets(byKey.COMBINATION, byKey.G);
    const compareToH = compareRecordSets(byKey.COMBINATION, byKey.H);
    const aggregateRepetitionReductionFromG = (summaries.G.aggregateScore - summaries.COMBINATION.aggregateScore) / Math.max(1e-15, summaries.G.aggregateScore);
    const meanBandGridPearsonDropFromG = 1 - compareToG.meanBandGridPearson;
    const exactBandMatchDropFromG = compareToG.exactBandComparisonCount - compareToG.exactBandMatchCount;
    const sceneScoreReductionCount = byKey.COMBINATION.filter((record, index) => record.metric.sceneScore < byKey.G[index].metric.sceneScore).length;
    const causalImpactComposite = average([
      Math.max(0, aggregateRepetitionReductionFromG),
      Math.max(0, meanBandGridPearsonDropFromG),
      exactBandMatchDropFromG / compareToG.exactBandComparisonCount,
      sceneScoreReductionCount / control.scenes.length
    ]);
    const gateTerms = {
      aggregateRepetitionReduction: aggregateRepetitionReductionFromG >= control.causalGate.aggregateRepetitionReductionMinimum,
      meanBandGridPearsonDropFromG: meanBandGridPearsonDropFromG >= control.causalGate.meanBandGridPearsonDropFromGMinimum,
      exactBandMatchDropFromG: exactBandMatchDropFromG >= control.causalGate.exactBandMatchDropFromGMinimum,
      sceneScoreReductionCount: sceneScoreReductionCount >= control.causalGate.sceneScoreReductionCountMinimum,
      causalImpactComposite: causalImpactComposite >= control.causalGate.causalImpactCompositeMinimum
    };
    const combinationPassesCausalGate = Object.values(gateTerms).every(Boolean);
    const allPassRecords = records.flatMap((record) => Object.values(record.passes));
    return clone({
      checkpoint: 'RMA2',
      operation: control.operation,
      result: control.result,
      sceneCount: records.length,
      passCount: keys.length,
      outputCount: allPassRecords.length,
      combination: clone(control.combination),
      reference: { G: summaries.G, H: summaries.H, gToH },
      combinationResult: {
        summary: summaries.COMBINATION,
        compareToG,
        compareToH,
        aggregateRepetitionReductionFromG,
        meanBandGridPearsonDropFromG,
        exactBandMatchDropFromG,
        sceneScoreReductionCount,
        causalImpactComposite,
        gateTerms,
        combinationPassesCausalGate,
        classification: combinationPassesCausalGate ? 'BOUNDED_COMBINATION_REPETITION_CAUSAL' : 'NO_SINGLE_OR_BOUNDED_COMBINATION_PASSES_CAUSAL_GATE',
        distinctSceneCount: byKey.COMBINATION.filter((record) => record.distinctFromG).length,
        perScene: byKey.COMBINATION.map((record) => ({ sceneId: record.scene.id, frameHash: record.frameHash, depthMaskHash: record.depthMaskHash, distinctFromG: record.distinctFromG, metric: compactMetric(record.metric) }))
      },
      allOutputsDeterministic: allPassRecords.every((record) => record.deterministic),
      hOfficialColorEquivalenceSceneCount: records.filter((record) => record.passes.H.officialFrameEquivalent).length,
      hOfficialDepthEquivalenceSceneCount: records.filter((record) => record.passes.H.officialDepthEquivalent).length,
      allMetricsFinite: allPassRecords.every((record) => [record.metric.sceneScore, record.metric.peakStrength, record.metric.eligibleFraction, ...Object.values(record.metric.bands).flatMap((band) => [band.peakStrength, band.signedCorrelation])].every(Number.isFinite)),
      allOutputsHaveCoverage: allPassRecords.every((record) => record.metric.eligiblePixelCount >= control.gates.minimumEligiblePixelCount),
      productMutationPerformed: false,
      exactCombinationCount: 1,
      liveRouteChanged: false,
      stoppingBoundary: control.boundaries.stop
    });
  };

  return Object.freeze({ listSceneIds: () => [...sceneMap.keys()], renderScene, finalize });
}

export default createRMA2BoundedCombinationSuite;
