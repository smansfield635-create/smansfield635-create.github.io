/* G1 PLANET 1 BODY SYSTEM BOUNDARY ENGINE
   FILE: /world/render/planet-one.body-system.render.js
   VERSION: G1_PLANET_1_BODY_SYSTEM_BOUNDARY_ENGINE_TNT_v1
*/

(function attachPlanetOneBodySystemRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_BODY_SYSTEM_BOUNDARY_ENGINE_TNT_v1";
  var STATE_FORMULA = "4x4x4x4";
  var BODY_SYSTEM_STATE_COUNT = 256;

  var BODY_DOMAIN = {
    OCEAN_BODY: 0,
    COASTAL_BODY: 1,
    LAND_BODY: 2,
    POLAR_BODY: 3
  };

  var STRUCTURAL_SYSTEM = {
    BONE_FRAME: 0,
    MUSCLE_FIELD: 1,
    FAT_BUFFER: 2,
    FASCIA_BOUNDARY: 3
  };

  var FLOW_SYSTEM = {
    VEINS: 0,
    ARTERIES: 1,
    LYMPH_DRAINAGE: 2,
    PRESSURE_CHANNELS: 3
  };

  var BOUNDARY_STATE = {
    LOOSE: 0,
    TRIMMED: 1,
    DEFINED: 2,
    LOCKED: 3
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round(value * m) / m;
  }

  function get(sample, camelName, snakeName, fallback) {
    if (!sample) return fallback;
    if (sample[camelName] != null) return Number(sample[camelName]);
    if (sample[snakeName] != null) return Number(sample[snakeName]);
    return fallback;
  }

  function bodyStateId(bodyDomain, structuralSystem, flowSystem, boundaryState) {
    return (((bodyDomain * 4 + structuralSystem) * 4 + flowSystem) * 4 + boundaryState);
  }

  function buildBodySystemStateSpace() {
    var states = [];
    var bodyDomain;
    var structuralSystem;
    var flowSystem;
    var boundaryState;

    for (bodyDomain = 0; bodyDomain < 4; bodyDomain += 1) {
      for (structuralSystem = 0; structuralSystem < 4; structuralSystem += 1) {
        for (flowSystem = 0; flowSystem < 4; flowSystem += 1) {
          for (boundaryState = 0; boundaryState < 4; boundaryState += 1) {
            states.push({
              body_system_state_id: bodyStateId(bodyDomain, structuralSystem, flowSystem, boundaryState),
              bodyDomain: bodyDomain,
              structuralSystem: structuralSystem,
              flowSystem: flowSystem,
              boundaryState: boundaryState
            });
          }
        }
      }
    }

    return {
      ok: states.length === BODY_SYSTEM_STATE_COUNT,
      bodySystemFormula: STATE_FORMULA,
      bodySystemStateCount: BODY_SYSTEM_STATE_COUNT,
      requiredBodySystemStateCount: BODY_SYSTEM_STATE_COUNT,
      bodyDomainAxisActive: true,
      structuralSystemAxisActive: true,
      flowSystemAxisActive: true,
      boundaryStateAxisActive: true,
      states: states
    };
  }

  function sampleBodySystem(lon, lat, surfaceSample) {
    var s = surfaceSample || {};
    var domain = Number(s.domain == null ? 0 : s.domain);
    var height = get(s, "height", "height", 0);
    var slope = get(s, "slope", "slope", 0);
    var waterDepth = get(s, "waterDepth", "water_depth", 0);
    var coastDistance = get(s, "coastDistance", "coast_distance", 0);
    var coastBand = get(s, "coastBand", "coast_band", 0);
    var landMask = get(s, "landMask", "land_mask", 0);
    var moisture = get(s, "moisture", "moisture", 0.4);
    var ridgeHint = get(s, "ridgeHint", "ridge_hint", 0);
    var basinPressure = get(s, "basinPressure", "basin_pressure", 0);
    var riverVein = get(s, "riverVein", "river_vein", 0);
    var riverBranch = get(s, "riverBranch", "river_branch", 0);
    var lakeBasin = get(s, "lakeBasin", "lake_basin", 0);
    var pondPocket = get(s, "pondPocket", "pond_pocket", 0);
    var wetland = get(s, "wetland", "wetland_field", 0);
    var waterfallDrop = get(s, "waterfallDrop", "waterfall_drop", 0);
    var drainagePath = get(s, "drainagePath", "drainage_path", 0);

    var bodyDomain = BODY_DOMAIN.OCEAN_BODY;
    if (domain === 1) bodyDomain = BODY_DOMAIN.COASTAL_BODY;
    if (domain === 2) bodyDomain = BODY_DOMAIN.LAND_BODY;
    if (domain === 3) bodyDomain = BODY_DOMAIN.POLAR_BODY;

    var boneFrame = clamp(ridgeHint * 0.72 + slope * 0.35 + Math.max(0, height - 0.22) * 0.56, 0, 1);
    var muscleField = clamp(landMask * (0.35 + height * 0.75 + slope * 0.22) * (1 - wetland * 0.28), 0, 1);
    var fatBuffer = clamp(
      coastBand * 0.55 +
      wetland * 0.64 +
      lakeBasin * 0.40 +
      pondPocket * 0.36 +
      basinPressure * 0.24,
      0,
      1
    );
    var fasciaBoundary = clamp(
      coastBand * 0.72 +
      riverVein * 0.36 +
      riverBranch * 0.28 +
      lakeBasin * 0.42 +
      Math.abs(height) < 0.08 ? 0.18 : 0,
      0,
      1
    );

    var arteryFlow = clamp(riverVein * 0.88 + drainagePath * 0.42 + waterfallDrop * 0.36, 0, 1);
    var veinFlow = clamp(riverBranch * 0.72 + drainagePath * 0.24 + wetland * 0.22, 0, 1);
    var lymphDrainage = clamp(pondPocket * 0.68 + wetland * 0.58 + lakeBasin * 0.24 + basinPressure * 0.20, 0, 1);
    var pressureChannel = clamp(waterfallDrop * 0.82 + slope * 0.38 + ridgeHint * 0.42, 0, 1);

    var structuralSystem = STRUCTURAL_SYSTEM.MUSCLE_FIELD;
    if (boneFrame >= muscleField && boneFrame >= fatBuffer && boneFrame >= fasciaBoundary) structuralSystem = STRUCTURAL_SYSTEM.BONE_FRAME;
    if (fatBuffer >= boneFrame && fatBuffer >= muscleField && fatBuffer >= fasciaBoundary) structuralSystem = STRUCTURAL_SYSTEM.FAT_BUFFER;
    if (fasciaBoundary >= boneFrame && fasciaBoundary >= muscleField && fasciaBoundary >= fatBuffer) structuralSystem = STRUCTURAL_SYSTEM.FASCIA_BOUNDARY;

    var flowSystem = FLOW_SYSTEM.ARTERIES;
    if (veinFlow >= arteryFlow && veinFlow >= lymphDrainage && veinFlow >= pressureChannel) flowSystem = FLOW_SYSTEM.VEINS;
    if (lymphDrainage >= arteryFlow && lymphDrainage >= veinFlow && lymphDrainage >= pressureChannel) flowSystem = FLOW_SYSTEM.LYMPH_DRAINAGE;
    if (pressureChannel >= arteryFlow && pressureChannel >= veinFlow && pressureChannel >= lymphDrainage) flowSystem = FLOW_SYSTEM.PRESSURE_CHANNELS;

    var boundaryStrength = clamp(fasciaBoundary * 0.54 + boneFrame * 0.22 + arteryFlow * 0.12 + pressureChannel * 0.12, 0, 1);
    var boundaryState = BOUNDARY_STATE.LOOSE;
    if (boundaryStrength > 0.24) boundaryState = BOUNDARY_STATE.TRIMMED;
    if (boundaryStrength > 0.48) boundaryState = BOUNDARY_STATE.DEFINED;
    if (boundaryStrength > 0.74) boundaryState = BOUNDARY_STATE.LOCKED;

    var trimFatPressure = clamp(fatBuffer - muscleField * 0.44 - fasciaBoundary * 0.25, 0, 1);
    var replaceFatWithMuscle = clamp(muscleField * 0.55 + boneFrame * 0.25 - fatBuffer * 0.35, 0, 1);
    var blobSuppression = clamp(fasciaBoundary * 0.42 + boneFrame * 0.28 + arteryFlow * 0.16 + pressureChannel * 0.14, 0, 1);

    return {
      version: VERSION,

      bodySystemLayerActive: true,
      anatomicalBoundaryModelActive: true,

      bodyDomain: bodyDomain,
      structuralSystem: structuralSystem,
      flowSystem: flowSystem,
      boundaryState: boundaryState,
      bodySystemStateId: bodyStateId(bodyDomain, structuralSystem, flowSystem, boundaryState),

      boneFrame: round(boneFrame, 4),
      muscleField: round(muscleField, 4),
      fatBuffer: round(fatBuffer, 4),
      fasciaBoundary: round(fasciaBoundary, 4),

      veinFlow: round(veinFlow, 4),
      arteryFlow: round(arteryFlow, 4),
      lymphDrainage: round(lymphDrainage, 4),
      pressureChannel: round(pressureChannel, 4),

      trimFatPressure: round(trimFatPressure, 4),
      replaceFatWithMuscle: round(replaceFatWithMuscle, 4),
      blobSuppression: round(blobSuppression, 4),
      boundaryStrength: round(boundaryStrength, 4),

      boneFrameFieldActive: true,
      muscleFieldActive: true,
      fatBufferFieldActive: true,
      fasciaBoundaryFieldActive: true,
      veinFlowFieldActive: true,
      arteryFlowFieldActive: true,
      lymphDrainageFieldActive: true,
      pressureChannelFieldActive: true,

      bodyDomainAxisActive: true,
      structuralSystemAxisActive: true,
      flowSystemAxisActive: true,
      boundaryStateAxisActive: true,
      bodySystemStateCount: BODY_SYSTEM_STATE_COUNT,

      visualPassClaimed: false
    };
  }

  function getBodySystemStatus() {
    var receipt = buildBodySystemStateSpace();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,

      bodySystemLayerActive: true,
      anatomicalBoundaryModelActive: true,
      boneFrameFieldActive: true,
      muscleFieldActive: true,
      fatBufferFieldActive: true,
      fasciaBoundaryFieldActive: true,
      veinFlowFieldActive: true,
      arteryFlowFieldActive: true,
      lymphDrainageFieldActive: true,
      pressureChannelFieldActive: true,

      bodyDomainAxisActive: true,
      structuralSystemAxisActive: true,
      flowSystemAxisActive: true,
      boundaryStateAxisActive: true,

      bodySystemFormula: STATE_FORMULA,
      bodySystemStateCount: BODY_SYSTEM_STATE_COUNT,
      requiredBodySystemStateCount: BODY_SYSTEM_STATE_COUNT,
      stateSpace: receipt.states,
      stateSpacePreview: receipt.states.slice(0, 16),

      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BODY_DOMAIN: BODY_DOMAIN,
    STRUCTURAL_SYSTEM: STRUCTURAL_SYSTEM,
    FLOW_SYSTEM: FLOW_SYSTEM,
    BOUNDARY_STATE: BOUNDARY_STATE,

    sampleBodySystem: sampleBodySystem,
    sampleBodySystemSurface: sampleBodySystem,
    getBodySystemStatus: getBodySystemStatus,
    getBodySystemStateSpace: buildBodySystemStateSpace,
    status: getBodySystemStatus
  };

  global.DGBPlanetOneBodySystemRender = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:body-system-ready", {
      detail: getBodySystemStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
