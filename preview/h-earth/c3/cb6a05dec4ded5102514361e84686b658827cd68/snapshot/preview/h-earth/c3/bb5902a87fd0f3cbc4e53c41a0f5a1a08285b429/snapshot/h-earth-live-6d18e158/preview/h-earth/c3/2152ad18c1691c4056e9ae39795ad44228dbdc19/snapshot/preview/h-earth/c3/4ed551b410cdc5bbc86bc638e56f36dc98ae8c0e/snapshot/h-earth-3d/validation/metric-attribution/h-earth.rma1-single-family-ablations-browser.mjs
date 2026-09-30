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
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.rma1-single-family-ablations.v1.mjs';
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
  if (result?.ok !== true) throw new Error(`RMA1_NAVIGATION_REJECTED:${intent.action}:${result?.status}`);
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
  if (initial?.ok !== true) throw new Error('RMA1_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = apply(initial.state, { action: 'SET_CAMERA_POSITION', position: { x: camera.x, y: null, z: camera.z } });
  const cameraTerrain = sampleHEarthRun8BSuccessorTerrainField(camera.x, camera.z);
  const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(target.x, target.z);
  if (cameraTerrain?.valid !== true || targetTerrain?.valid !== true) throw new Error('RMA1_TERRAIN_SAMPLE_INVALID');
  const dx = target.x - camera.x;
  const dz = target.z - camera.z;
  state = setYaw(state, normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI));
  state = setPitch(state, Math.atan2(targetTerrain.elevation - (cameraTerrain.elevation + 2.25), Math.max(1e-8, Math.hypot(dx, dz))) * 180 / Math.PI);
  state = setFov(state, camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`RMA1_SCENE_STATE_INELIGIBLE:${evaluation.issues.join(',')}`);
  return state;
}

function replaceUnique(source, search, replacement, label) {
  const first = source.indexOf(search);
  const last = source.lastIndexOf(search);
  if (first < 0 || first !== last) throw new Error(`RMA1_SHADER_REPLACEMENT_NOT_UNIQUE:${label}:${first}:${last}`);
  return source.slice(0, first) + replacement + source.slice(first + search.length);
}
function replaceBetween(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  const secondStart = source.indexOf(startMarker, start + 1);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || secondStart >= 0 || end < 0) throw new Error(`RMA1_SHADER_BLOCK_NOT_UNIQUE:${label}:${start}:${secondStart}:${end}`);
  return source.slice(0, start) + replacement + source.slice(end);
}

function family1(shader) {
  const replacements = [
    ['    float broad=noise2(world*0.035);', '    float broad=0.5; // RMA1_FAMILY_1_BROAD_NEUTRAL'],
    ['    float medium=noise2(world*0.13+vec2(17.0,-9.0));', '    float medium=0.5; // RMA1_FAMILY_1_MEDIUM_NEUTRAL'],
    ['    float grain=noise2(world*0.55+vec2(-31.0,23.0));', '    float grain=0.5; // RMA1_FAMILY_1_GRAIN_NEUTRAL'],
    ['    float macroField=noise2(world*0.018+vec2(5.0,-11.0));', '    float macroField=0.5; // RMA1_FAMILY_1_MACRO_NEUTRAL'],
    ['    float mesoField=noise2(world*0.082+vec2(-13.0,7.0));', '    float mesoField=0.5; // RMA1_FAMILY_1_MESO_NEUTRAL'],
    ['    float detailField=noise2(world*0.29+vec2(29.0,-17.0));', '    float detailField=0.5; // RMA1_FAMILY_1_DETAIL_NEUTRAL']
  ];
  return replacements.reduce((result, [search, replacement], index) => replaceUnique(result, search, replacement, `FAMILY_1_${index}`), shader);
}
function family2(shader) {
  const replacements = [
    ['    float strata=stableWave(world.x*0.47+world.y*0.33+vWorldPosition.y*0.79+medium*3.2);', '    float strata=0.5; // RMA1_FAMILY_2_STRATA_NEUTRAL'],
    ['    float crossGrain=stableWave(world.x*0.83-world.y*0.61+broad*4.8);', '    float crossGrain=0.5; // RMA1_FAMILY_2_CROSS_GRAIN_NEUTRAL'],
    ['    float faceBandA=stableWave(world.x*0.61+world.y*0.39+vWorldPosition.y*0.57+mesoField*4.1);', '    float faceBandA=0.5; // RMA1_FAMILY_2_FACE_A_NEUTRAL'],
    ['    float faceBandB=stableWave(world.x*1.07-world.y*0.73+vWorldPosition.y*0.31+macroField*5.3);', '    float faceBandB=0.5; // RMA1_FAMILY_2_FACE_B_NEUTRAL'],
    ['    float faceBandC=stableWave(world.x*1.71+world.y*1.23+vWorldPosition.y*0.18+detailField*2.7);', '    float faceBandC=0.5; // RMA1_FAMILY_2_FACE_C_NEUTRAL']
  ];
  return replacements.reduce((result, [search, replacement], index) => replaceUnique(result, search, replacement, `FAMILY_2_${index}`), shader);
}
function family3(shader) {
  return replaceBetween(
    shader,
    '    float crestSignal=stableWave(world.x*0.22-world.y*0.16+vWorldPosition.y*0.88+macroField*2.1);',
    '    float faceBreak=clamp(',
    `    float crestSignal=0.5; // RMA1_FAMILY_3_CREST_NEUTRAL\n    float terraceSignal=0.5; // RMA1_FAMILY_3_TERRACE_NEUTRAL\n    float crestContact=0.0;\n    float terraceContact=0.0;\n    float sharedFaceContact=0.0;\n`,
    'FAMILY_3'
  );
}
function family4(shader) {
  let result = replaceUnique(shader, '    float contourLine=contour(vWorldPosition.y);', '    float contourLine=0.0; // RMA1_FAMILY_4_CONTOUR_NEUTRAL', 'FAMILY_4_CONTOUR');
  result = replaceUnique(result, '    float slopeRake=stableWave(vWorldPosition.x*0.31+vWorldPosition.z*0.22+vWorldPosition.y*0.58);', '    float slopeRake=0.5; // RMA1_FAMILY_4_SLOPE_RAKE_NEUTRAL', 'FAMILY_4_SLOPE_RAKE');
  return result;
}
function family5(shader) {
  return replaceBetween(
    shader,
    '    vec2 manorCenter=vec2(80.0,-172.0);',
    '    vec2 cavernCenter=vec2(40.0,-284.0);',
    '    // RMA1_FAMILY_5_MANOR_LOCAL_BLOCK_NEUTRALIZED\n',
    'FAMILY_5'
  );
}
function family6(shader) {
  return replaceBetween(
    shader,
    '    vec2 cavernCenter=vec2(40.0,-284.0);',
    '    float ravineAxis=exp(-pow((vWorldPosition.x-40.0)/18.0,2.0));',
    '    // RMA1_FAMILY_6_CAVERN_LOCAL_BLOCK_NEUTRALIZED\n',
    'FAMILY_6'
  );
}
function family7(shader) {
  let result = replaceUnique(shader, '  vec3 base=max(vBaseColor.rgb,vec3(0.004));', '  vec3 base=vec3(0.34); // RMA1_FAMILY_7_BASE_COLOR_NEUTRAL', 'FAMILY_7_BASE');
  result = replaceBetween(
    result,
    '  }else if(vRoleCode==2u){',
    '  // MA2_FLAT_LIGHTING_REPLACEMENT_BEGIN',
    `  }else if(vRoleCode==2u){\n    base=vec3(0.34);\n  }else{\n    base=vec3(0.34);\n  }\n\n`,
    'FAMILY_7_ROLE_BLEND'
  );
  return result;
}

export function createRMA1FamilyShaders(flatMaterialShader) {
  const shaders = {
    FAMILY_1: family1(flatMaterialShader),
    FAMILY_2: family2(flatMaterialShader),
    FAMILY_3: family3(flatMaterialShader),
    FAMILY_4: family4(flatMaterialShader),
    FAMILY_5: family5(flatMaterialShader),
    FAMILY_6: family6(flatMaterialShader),
    FAMILY_7: family7(flatMaterialShader)
  };
  for (const family of control.materialFamilies) {
    if (!shaders[family.key]?.includes(`RMA1_${family.key}`)) throw new Error(`RMA1_FAMILY_MARKER_MISSING:${family.key}`);
  }
  return Object.freeze(shaders);
}

function compareRecordSets(candidateRecords, referenceRecords) {
  const referenceByScene = new Map(referenceRecords.map((record) => [record.scene.id, record]));
  const gridPearsons = [];
  const peakRatios = [];
  let exactBandMatchCount = 0;
  let dominantSceneExactMatchCount = 0;
  for (const candidate of candidateRecords) {
    const reference = referenceByScene.get(candidate.scene.id);
    if (!reference) throw new Error(`RMA1_REFERENCE_SCENE_MISSING:${candidate.scene.id}`);
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

export async function createRMA1SingleFamilyAblationSuite({ officialCanvas, passCanvases }) {
  const passKeys = control.passKeys;
  for (const key of passKeys) {
    if (!(passCanvases[key] instanceof HTMLCanvasElement)) throw new Error(`RMA1_PASS_CANVAS_REQUIRED:${key}`);
  }
  const response = await fetch('/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js', { cache: 'no-store' });
  if (!response.ok) throw new Error(`RMA1_ACCEPTED_RENDERER_SOURCE_FETCH_FAILED:${response.status}`);
  const acceptedShaders = extractAcceptedShaders(await response.text());
  const maPassShaders = createMetricAttributionPassShaders(acceptedShaders.FS);
  const familyShaders = createRMA1FamilyShaders(maPassShaders.G);
  const shaderMap = { G: maPassShaders.G, H: maPassShaders.H, ...familyShaders };
  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const uploadViews = createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage);
  let sequence = 1;
  const initialScene = control.scenes[0];
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({
    navigationState: stateForView(initialScene.camera, initialScene.target),
    viewport: control.viewport,
    frameSequence: sequence
  });
  const official = createAcceptedRenderer({ canvas: officialCanvas, width: control.viewport.width, height: control.viewport.height });
  official.initialize(initialPacket);
  const renderers = {};
  for (const key of passKeys) {
    renderers[key] = createMetricAttributionDiagnosticRenderer({
      canvas: passCanvases[key],
      width: control.viewport.width,
      height: control.viewport.height,
      vertexShader: acceptedShaders.VS,
      fragmentShader: shaderMap[key],
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
    if (!scene) throw new Error(`RMA1_SCENE_UNKNOWN:${sceneId}`);
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
    const firstBytesByKey = {};
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
      firstBytesByKey[key] = firstBytes;
      passRecords[key] = {
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
    for (const family of control.materialFamilies) passRecords[family.key].distinctFromG = !exactBytes(firstBytesByKey[family.key], firstBytesByKey.G);
    const record = {
      scene: clone(scene),
      official: { frameHash: hashBytes(officialBytes), depthMaskHash: hashBytes(officialDepth.mask) },
      passes: passRecords
    };
    records.push(record);
    return clone({
      scene: record.scene,
      official: record.official,
      passes: Object.fromEntries(Object.entries(passRecords).map(([key, value]) => [key, { ...value, metric: compactMetric(value.metric) }]))
    });
  };

  const finalize = () => {
    const byKey = Object.fromEntries(passKeys.map((key) => [key, records.map((record) => ({ scene: record.scene, ...record.passes[key] }))]));
    const passSummaries = Object.fromEntries(passKeys.map((key) => [key, summarizePassScenes(byKey[key].map((record) => ({ scene: record.scene, metric: record.metric })))]));
    const gToH = compareRecordSets(byKey.G, byKey.H);
    const familyResults = control.materialFamilies.map((family) => {
      const candidate = byKey[family.key];
      const compareToG = compareRecordSets(candidate, byKey.G);
      const compareToH = compareRecordSets(candidate, byKey.H);
      const aggregateRepetitionReductionFromG = (passSummaries.G.aggregateScore - passSummaries[family.key].aggregateScore) / Math.max(1e-15, passSummaries.G.aggregateScore);
      const meanBandGridPearsonDropFromG = 1 - compareToG.meanBandGridPearson;
      const exactBandMatchDropFromG = compareToG.exactBandComparisonCount - compareToG.exactBandMatchCount;
      const sceneScoreReductionCount = candidate.filter((record, index) => record.metric.sceneScore < byKey.G[index].metric.sceneScore).length;
      const causalImpactComposite = average([
        Math.max(0, aggregateRepetitionReductionFromG),
        Math.max(0, meanBandGridPearsonDropFromG),
        exactBandMatchDropFromG / compareToG.exactBandComparisonCount,
        sceneScoreReductionCount / control.scenes.length
      ]);
      const terms = {
        aggregateRepetitionReduction: aggregateRepetitionReductionFromG >= control.singleFamilyCausalGate.aggregateRepetitionReductionMinimum,
        meanBandGridPearsonDropFromG: meanBandGridPearsonDropFromG >= control.singleFamilyCausalGate.meanBandGridPearsonDropFromGMinimum,
        exactBandMatchDropFromG: exactBandMatchDropFromG >= control.singleFamilyCausalGate.exactBandMatchDropFromGMinimum,
        sceneScoreReductionCount: sceneScoreReductionCount >= control.singleFamilyCausalGate.sceneScoreReductionCountMinimum,
        causalImpactComposite: causalImpactComposite >= control.singleFamilyCausalGate.causalImpactCompositeMinimum
      };
      return {
        family: clone(family),
        summary: passSummaries[family.key],
        compareToG,
        compareToH,
        aggregateRepetitionReductionFromG,
        meanBandGridPearsonDropFromG,
        exactBandMatchDropFromG,
        sceneScoreReductionCount,
        causalImpactComposite,
        gateTerms: terms,
        passesSingleFamilyCausalGate: Object.values(terms).every(Boolean),
        distinctSceneCount: candidate.filter((record) => record.distinctFromG).length,
        perScene: candidate.map((record) => ({ sceneId: record.scene.id, frameHash: record.frameHash, depthMaskHash: record.depthMaskHash, distinctFromG: record.distinctFromG, metric: compactMetric(record.metric) }))
      };
    });
    const allPassRecords = records.flatMap((record) => Object.values(record.passes));
    return clone({
      checkpoint: 'RMA1',
      operation: control.operation,
      result: control.result,
      sceneCount: records.length,
      referencePassCount: 2,
      familyCount: control.materialFamilies.length,
      diagnosticPassCount: passKeys.length,
      outputCount: allPassRecords.length,
      passKeys,
      reference: {
        G: passSummaries.G,
        H: passSummaries.H,
        gToH
      },
      familyResults,
      singleFamilyPassKeys: familyResults.filter((result) => result.passesSingleFamilyCausalGate).map((result) => result.family.key),
      rankedFamilyKeys: [...familyResults].sort((left, right) => right.causalImpactComposite - left.causalImpactComposite).map((result) => result.family.key),
      allOutputsDeterministic: allPassRecords.every((record) => record.deterministic),
      hOfficialColorEquivalenceSceneCount: records.filter((record) => record.passes.H.officialFrameEquivalent).length,
      hOfficialDepthEquivalenceSceneCount: records.filter((record) => record.passes.H.officialDepthEquivalent).length,
      allMetricsFinite: allPassRecords.every((record) => [
        record.metric.sceneScore,
        record.metric.peakStrength,
        record.metric.eligibleFraction,
        ...Object.values(record.metric.bands).flatMap((band) => [band.peakStrength, band.signedCorrelation])
      ].every(Number.isFinite)),
      allOutputsHaveCoverage: allPassRecords.every((record) => record.metric.eligiblePixelCount >= control.gates.minimumEligiblePixelCount),
      productMutationPerformed: false,
      multiFamilyAblationExecuted: false,
      liveRouteChanged: false,
      stoppingBoundary: control.boundaries.stop
    });
  };

  return Object.freeze({ listSceneIds: () => [...sceneMap.keys()], listPassKeys: () => [...passKeys], renderScene, finalize });
}

export default createRMA1SingleFamilyAblationSuite;
