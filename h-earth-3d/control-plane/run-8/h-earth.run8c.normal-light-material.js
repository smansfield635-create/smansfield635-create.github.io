/**
 * H_EARTH_NORMAL_DRIVEN_LIGHT_AND_MATERIAL_REALIZATION_RUN_8C_v1
 *
 * Run 8C consumes the closed Run 8A interface law and the closed Run 8B South
 * neutral geometry. It creates bounded material/light presentation records only.
 */

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT
} from './h-earth.run8a.dimensional-reconciliation.js';

import {
  H_EARTH_RUN_8B_CONTRACT_ID,
  H_EARTH_RUN_8B_PACKAGE
} from './h-earth.run8b.successor-neutral-geometry.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID
} from '../../../showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';

import {
  H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
  H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE
} from '../../environment/h-earth.successor-surface-material.run8c.js';

import {
  H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID,
  H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_PROFILE
} from '../../../showroom/globe/h-earth/render/lighting-material-successor-terrain.run8c.js';

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID
} from '../../environment/h-earth.atmosphere-state.js';

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID
} from '../../environment/h-earth.surface-state-field.js';

import {
  H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID
} from '../../../showroom/globe/h-earth/render/environment-atmosphere.js';

const freeze = (value, seen = new WeakSet()) => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value) ||
    seen.has(value)
  ) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8C_CONTROL_CONTRACT_ID =
  'H_EARTH_NORMAL_DRIVEN_LIGHT_AND_MATERIAL_REALIZATION_RUN_8C_v1';

export const H_EARTH_RUN_8C_CONTROL_SOURCE_FILE =
  '/h-earth-3d/control-plane/run-8/h-earth.run8c.normal-light-material.js';

export const H_EARTH_RUN_8C_INPUT_AUTHORITY_LEDGER = freeze([
  {
    authority: 'RUN_8A_NORMAL_LIGHT_MATERIAL_INTERFACE',
    identity: H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId,
    disposition: 'CONSUME_FROZEN_NO_REOPENING'
  },
  {
    authority: 'RUN_8B_SUCCESSOR_SOUTH_NEUTRAL_GEOMETRY',
    identity: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
    disposition: 'CONSUME_IMMUTABLY'
  },
  {
    authority: 'RUN_7B_INTRINSIC_SURFACE_STATE',
    identity: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    disposition: 'PRESERVE_AND_PROJECT'
  },
  {
    authority: 'RUN_7C_NATIVE_ATMOSPHERE_STATE',
    identity: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    disposition: 'PRESERVE_AND_CONSUME'
  },
  {
    authority: 'RUN_7C_ATMOSPHERE_PRESENTATION',
    identity: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
    disposition: 'PRESERVE_AND_COMPOSE'
  }
]);

export const H_EARTH_RUN_8C_REQUIRED_REALIZATIONS = freeze({
  diffuseLightFactor: 'MAX_0_DOT_WORLD_NORMAL_SUN_DIRECTION_TIMES_SUN_INTENSITY',
  ambientLightFactor: 'BOUNDED_NONZERO_SKY_GROUND_AMBIENT',
  slopeShadeFactor: 'WORLD_NORMAL_Y_DEPENDENT',
  curvatureOcclusionFactor: 'CONCAVITY_DEPENDENT_BOUNDED_OCCLUSION',
  distanceHazeFactor: 'RUN_7C_ATMOSPHERE_MONOTONIC_DISTANCE_FUNCTION',
  wetnessResponse: 'RUN_7B_INTRINSIC_WETNESS_PROJECTED_ON_SUCCESSOR_SURFACE',
  roughnessResponse: 'RUN_7B_INTRINSIC_ROUGHNESS_PROJECTED_ON_SUCCESSOR_SURFACE',
  materialBaseResponse: 'RUN_7B_CLASS_BASE_COLOR_PROJECTED_ON_SUCCESSOR_SURFACE',
  sunDisc: 'RUN_7C_ATMOSPHERE_PRESENTATION_REQUIRED',
  dayNightDifferentiation: 'EXECUTED_MULTI_TIME_STATE_REQUIRED',
  geometryPrecedesLighting: true,
  flatColorAsDepthSubstitute: 'PROHIBITED'
});

export const H_EARTH_RUN_8C_STOPPING_BOUNDARIES = freeze({
  Run8AReopening: false,
  Run8BGeometryMutation: false,
  Run6TerrainMutation: false,
  legacyProxyMutation: false,
  WestAdmission: false,
  Packet002Transfer: false,
  vegetationInstanceConstruction: false,
  rendererLoopMutation: false,
  cameraAuthorityCreation: false,
  publicRouteMutation: false,
  deployment: false,
  publicVisualImprovementClaim: false
});

export function evaluateHEarthRun8CControlContract() {
  const issues = [];
  const requiredInputs = new Set(
    H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.requiredInputs
  );
  const requiredOutputs = new Set(
    H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.requiredOutputs
  );

  for (const input of [
    'WORLD_POSITION', 'WORLD_NORMAL', 'SLOPE', 'CURVATURE', 'SURFACE_STATE',
    'ATMOSPHERE_STATE', 'SUN_DIRECTION_NORMALIZED', 'SUN_ELEVATION', 'CAMERA_DISTANCE'
  ]) {
    if (!requiredInputs.has(input)) issues.push(`RUN_8A_REQUIRED_INPUT_MISSING:${input}`);
  }
  for (const output of [
    'DIFFUSE_LIGHT_FACTOR', 'AMBIENT_LIGHT_FACTOR', 'SLOPE_SHADE_FACTOR',
    'CURVATURE_OCCLUSION_FACTOR', 'DISTANCE_HAZE_FACTOR', 'WETNESS_RESPONSE',
    'ROUGHNESS_RESPONSE', 'MATERIAL_BASE_RESPONSE'
  ]) {
    if (!requiredOutputs.has(output)) issues.push(`RUN_8A_REQUIRED_OUTPUT_MISSING:${output}`);
  }
  if (
    H_EARTH_RUN_8B_PACKAGE?.contractId !== H_EARTH_RUN_8B_CONTRACT_ID ||
    H_EARTH_RUN_8B_PACKAGE?.successorNeutralGeometryContractId !==
      H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID
  ) {
    issues.push('RUN_8B_CONTROL_PACKAGE_IDENTITY_INVALID');
  }
  if (H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE.contractId !==
      H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID) {
    issues.push('RUN_8C_SURFACE_MATERIAL_PROFILE_IDENTITY_INVALID');
  }
  if (H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_PROFILE.contractId !==
      H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID) {
    issues.push('RUN_8C_LIGHT_MATERIAL_PROFILE_IDENTITY_INVALID');
  }
  if (H_EARTH_RUN_8A_CONTRACT_ID.length === 0 || H_EARTH_RUN_8B_CONTRACT_ID.length === 0) {
    issues.push('CONTROLLING_PREDECESSOR_IDENTITY_MISSING');
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8C_CONTROL_CONTRACT_PASS'
      : 'RUN_8C_CONTROL_CONTRACT_FAIL',
    contractId: H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
    issues
  });
}

export const H_EARTH_RUN_8C_PACKAGE = freeze({
  contractId: H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
  sourceFile: H_EARTH_RUN_8C_CONTROL_SOURCE_FILE,
  programClass: 'NORMAL_DRIVEN_LIGHT_AND_MATERIAL_REALIZATION',
  controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  controllingRun8BContractId: H_EARTH_RUN_8B_CONTRACT_ID,
  successorSurfaceMaterialContractId:
    H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
  successorNormalLightMaterialContractId:
    H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID,
  inputAuthorityLedger: H_EARTH_RUN_8C_INPUT_AUTHORITY_LEDGER,
  requiredRealizations: H_EARTH_RUN_8C_REQUIRED_REALIZATIONS,
  stoppingBoundaries: H_EARTH_RUN_8C_STOPPING_BOUNDARIES,
  Run8DConstructionAuthorized: false,
  Run8EIntegrationAuthorized: false
});

export default H_EARTH_RUN_8C_PACKAGE;
