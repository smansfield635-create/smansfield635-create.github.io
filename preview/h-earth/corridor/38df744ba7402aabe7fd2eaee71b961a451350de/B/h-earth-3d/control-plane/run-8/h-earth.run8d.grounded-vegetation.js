/**
 * H_EARTH_GROUNDED_VEGETATION_GEOMETRY_AND_WORLD_ATTACHMENT_RUN_8D_v1
 *
 * Run 8D consumes the closed Run 8A vegetation law, Run 8B successor terrain,
 * Run 8C light/material interface, Run 7E deterministic population planner and
 * Run 7G lifecycle budget. It constructs grounded South-neutral vegetation
 * geometry only and withholds all Run 8E integration authority.
 */

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT,
  H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION
} from './h-earth.run8a.dimensional-reconciliation.js';

import {
  H_EARTH_RUN_8B_CONTRACT_ID
} from './h-earth.run8b.successor-neutral-geometry.js';

import {
  H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
  evaluateHEarthRun8CControlContract
} from './h-earth.run8c.normal-light-material.js';

import {
  H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  buildHEarthRun8DVegetationResolution,
  evaluateHEarthRun8DVegetationResolution
} from '../../environment/h-earth.vegetation-resolution.run8d.js';

import {
  H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
  H_EARTH_RUN_8D_GROUNDED_VEGETATION_PROFILE,
  constructHEarthRun8DGroundedVegetation,
  evaluateHEarthRun8DGroundedVegetation
} from '../../../showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js';

import {
  H_EARTH_POPULATION_PLANNER_CONTRACT_ID
} from '../../environment/h-earth.population-planner.js';

import {
  H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID
} from '../../environment/h-earth.spatial-lifecycle.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8D_CONTROL_CONTRACT_ID =
  'H_EARTH_GROUNDED_VEGETATION_GEOMETRY_AND_WORLD_ATTACHMENT_RUN_8D_v1';

export const H_EARTH_RUN_8D_CONTROL_SOURCE_FILE =
  '/h-earth-3d/control-plane/run-8/h-earth.run8d.grounded-vegetation.js';

export const H_EARTH_RUN_8D_INPUT_AUTHORITY_LEDGER = freeze([
  {
    authority: 'RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR',
    identity: H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT.contractId,
    disposition: 'CONSUME_FROZEN_NO_REOPENING'
  },
  {
    authority: 'RUN_8B_SUCCESSOR_TERRAIN_AND_MOUNTAIN',
    identity: H_EARTH_RUN_8B_CONTRACT_ID,
    disposition: 'CONSUME_IMMUTABLY_FOR_WORLD_ANCHOR'
  },
  {
    authority: 'RUN_8C_NORMAL_LIGHT_MATERIAL',
    identity: H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
    disposition: 'PRESERVE_AND_REFERENCE_FOR_FUTURE_RENDERING'
  },
  {
    authority: 'RUN_7E_DETERMINISTIC_POPULATION_PLANNER',
    identity: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    disposition: 'CONSUME_INSTANCE_IDENTITY_POSITION_YAW_AND_SCALE'
  },
  {
    authority: 'RUN_7G_SPATIAL_LIFECYCLE',
    identity: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    disposition: 'CONSUME_ACTIVE_DETAIL_DENSITY_AND_INSTANCE_BUDGET'
  }
]);

export const H_EARTH_RUN_8D_REQUIRED_PROOFS = freeze([
  'THREE_LOCAL_ARCHETYPE_GEOMETRY_CONTRACTS',
  'COASTAL_GRASS_TUFT_THREE_CROSSED_TAPERED_RIBBON_PAIRS',
  'LOWLAND_SHRUB_RADIAL_BRANCH_CORE_AND_LAYERED_CANOPY_SHELL',
  'HIGHLAND_CONIFER_TRUNK_PRISM_AND_THREE_RADIAL_CANOPY_TIERS',
  'SOUTH_NEUTRAL_PRIMITIVE_VALIDITY',
  'DETERMINISTIC_POPULATION_INSTANCE_RESOLUTION',
  'WORLD_Y_EQUALS_SUCCESSOR_TERRAIN_ELEVATION_PLUS_ROOT_EMBED',
  'UP_ALIGNMENT_EQUALS_SUCCESSOR_TERRAIN_NORMAL',
  'DETERMINISTIC_YAW_AND_BOUNDED_SCALE',
  'CAMERA_RELATIVE_ATTACHMENT_PROHIBITED',
  'SCREEN_RELATIVE_ATTACHMENT_PROHIBITED',
  'WORLD_SPACE_STABILITY',
  'SAME_WORLD_TO_CAMERA_TRANSFORM_AS_TERRAIN_REQUIRED',
  'SAME_PHYSICAL_DEPTH_DOMAIN_AS_TERRAIN_REQUIRED',
  'TERRAIN_OCCLUSION_COMPATIBILITY_FOR_RUN_8E',
  'DETERMINISTIC_REPEAT_EXECUTION'
]);

export const H_EARTH_RUN_8D_STOPPING_BOUNDARIES = freeze({
  Run8AReopening: false,
  Run8BTerrainOrMountainMutation: false,
  Run8CMaterialOrLightMutation: false,
  Run6TerrainMutation: false,
  legacyProxyMutation: false,
  populationPlannerMutation: false,
  spatialLifecycleMutation: false,
  WestAdmission: false,
  Packet002Transfer: false,
  rendererLoopMutation: false,
  cameraAuthorityCreation: false,
  publicRouteMutation: false,
  deployment: false,
  publicVisualImprovementClaim: false
});

export function evaluateHEarthRun8DControlContract() {
  const issues = [];
  const run8C = evaluateHEarthRun8CControlContract();
  if (run8C.eligible !== true) issues.push('RUN_8C_PREDECESSOR_NOT_PASS');

  if (H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION.packet001.vegetationDisposition !==
      'NEW_OBJECT_ARCHETYPE_AND_INSTANCE_RESOLUTION_LANE_REQUIRED') {
    issues.push('RUN_8A_VEGETATION_PACKET_DISPOSITION_INVALID');
  }

  const resolution = buildHEarthRun8DVegetationResolution();
  const resolutionEvaluation = evaluateHEarthRun8DVegetationResolution(resolution);
  if (resolutionEvaluation.eligible !== true) {
    issues.push('RUN_8D_VEGETATION_RESOLUTION_NOT_PASS');
  }

  const geometry = constructHEarthRun8DGroundedVegetation();
  const geometryEvaluation = evaluateHEarthRun8DGroundedVegetation(geometry);
  if (geometryEvaluation.eligible !== true) {
    issues.push('RUN_8D_GROUNDED_VEGETATION_NOT_PASS');
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8D_GROUNDED_VEGETATION_PASS'
      : 'RUN_8D_GROUNDED_VEGETATION_FAIL',
    contractId: H_EARTH_RUN_8D_CONTROL_CONTRACT_ID,
    predecessorRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
    predecessorRun8BContractId: H_EARTH_RUN_8B_CONTRACT_ID,
    predecessorRun8CContractId: H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
    resolutionContractId: H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
    geometryContractId: H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
    run8C,
    resolutionEvaluation,
    geometryEvaluation,
    Run8EIntegrationAuthorized: issues.length === 0,
    WestAdmissionExecuted: false,
    packet002TransferExecuted: false,
    rendererMutation: false,
    cameraAuthorityCreated: false,
    publicRouteMutation: false,
    deployment: false,
    visualImprovementClaim: false,
    issues: freeze(issues)
  });
}

export const H_EARTH_RUN_8D_PACKAGE = freeze({
  contractId: H_EARTH_RUN_8D_CONTROL_CONTRACT_ID,
  sourceFile: H_EARTH_RUN_8D_CONTROL_SOURCE_FILE,
  programClass: 'GROUNDED_VEGETATION_GEOMETRY_AND_DETERMINISTIC_WORLD_ATTACHMENT',
  controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  controllingRun8BContractId: H_EARTH_RUN_8B_CONTRACT_ID,
  controllingRun8CContractId: H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
  vegetationResolutionContractId: H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  groundedVegetationGeometryContractId:
    H_EARTH_RUN_8D_GROUNDED_VEGETATION_GEOMETRY_CONTRACT_ID,
  geometryProfile: H_EARTH_RUN_8D_GROUNDED_VEGETATION_PROFILE,
  inputAuthorityLedger: H_EARTH_RUN_8D_INPUT_AUTHORITY_LEDGER,
  requiredProofs: H_EARTH_RUN_8D_REQUIRED_PROOFS,
  stoppingBoundaries: H_EARTH_RUN_8D_STOPPING_BOUNDARIES,
  Run8EIntegrationAuthorized: false
});

export default H_EARTH_RUN_8D_PACKAGE;
