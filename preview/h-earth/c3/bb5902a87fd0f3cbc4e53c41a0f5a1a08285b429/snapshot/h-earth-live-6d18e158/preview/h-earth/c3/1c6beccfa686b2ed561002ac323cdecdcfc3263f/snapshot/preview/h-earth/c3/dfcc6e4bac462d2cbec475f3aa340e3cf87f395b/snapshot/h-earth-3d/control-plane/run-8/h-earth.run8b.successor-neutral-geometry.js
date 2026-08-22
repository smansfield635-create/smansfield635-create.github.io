/**
 * H_EARTH_SUCCESSOR_TERRAIN_AND_MOUNTAIN_NEUTRAL_GEOMETRY_CONSTRUCTION_RUN_8B_v1
 *
 * Run 8B consumes the closed Run 8A laws without reopening them. It authorizes
 * and evaluates only the successor field revision and South neutral geometry
 * construction checkpoint.
 */

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  evaluateHEarthRun8AContract
} from './h-earth.run8a.dimensional-reconciliation.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  evaluateHEarthRun8BSuccessorTerrainField
} from '../../terrain/h-earth.successor-terrain-field.run8b.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE,
  constructHEarthRun8BSuccessorTerrainAndMountain
} from '../../../showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';

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

export const H_EARTH_RUN_8B_CONTRACT_ID =
  'H_EARTH_SUCCESSOR_TERRAIN_AND_MOUNTAIN_NEUTRAL_GEOMETRY_CONSTRUCTION_RUN_8B_v1';

export const H_EARTH_RUN_8B_SOURCE_FILE =
  '/h-earth-3d/control-plane/run-8/h-earth.run8b.successor-neutral-geometry.js';

export const H_EARTH_RUN_8B_PACKAGE = freeze({
  contractId: H_EARTH_RUN_8B_CONTRACT_ID,
  predecessorRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  successorTerrainFieldContractId:
    H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  successorNeutralGeometryContractId:
    H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  programClass: 'SUCCESSOR_FIELD_REVISION_AND_SOUTH_NEUTRAL_GEOMETRY_CONSTRUCTION',
  authorizedResponsibilities: [
    'MATERIALIZE_SUCCESSOR_TERRAIN_FIELD_REVISION',
    'CONSTRUCT_CONTINUOUS_XZ_TERRAIN_FOOTPRINT',
    'REALIZE_AUTHORIZED_Y_ELEVATION_SURFACE',
    'CONSTRUCT_PRIMARY_RIDGE_SUMMIT_SECONDARY_RIDGE_FOOTHILLS_VALLEY_CUTS_AND_REAR_FALLOFF',
    'APPLY_RUN_8A_SAMPLING_AND_REFINEMENT_LAW',
    'PRESERVE_SHARED_EDGE_POSITION_AND_NORMAL_CONTINUITY',
    'PRODUCE_SOUTH_NEUTRAL_GEOMETRY_ONLY',
    'PRESERVE_LEGACY_RUN_6_PROXY_UNCHANGED'
  ],
  prohibitedResponsibilities: [
    'RUN_8A_REOPENING',
    'RUN_6_TERRAIN_FIELD_IN_PLACE_MUTATION',
    'LEGACY_PROXY_RECLASSIFICATION',
    'WEST_ADMISSION',
    'PACKET_002_SUCCESSOR_TRANSFER',
    'RENDERER_MUTATION',
    'MATERIAL_AND_LIGHT_PRESENTATION',
    'VEGETATION_INSTANCE_REALIZATION',
    'PUBLIC_ROUTE_MUTATION',
    'DEPLOYMENT',
    'VISUAL_IMPROVEMENT_CLAIM'
  ],
  geometryProfile: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE,
  stoppingBoundary: {
    run8C: 'WITHHELD_PENDING_RUN_8B_PASS',
    run8D: 'WITHHELD_PENDING_REQUIRED_PREDECESSORS',
    run8E: 'WITHHELD_PENDING_INTEGRATION_READINESS'
  }
});

export function evaluateHEarthRun8B() {
  const issues = [];
  const run8A = evaluateHEarthRun8AContract();
  if (run8A.eligible !== true) issues.push('RUN_8A_PREDECESSOR_NOT_PASS');

  const field = evaluateHEarthRun8BSuccessorTerrainField();
  if (field.eligible !== true) issues.push('RUN_8B_SUCCESSOR_FIELD_NOT_PASS');

  const geometry = constructHEarthRun8BSuccessorTerrainAndMountain();
  if (geometry.ok !== true) issues.push('RUN_8B_NEUTRAL_GEOMETRY_NOT_PASS');

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PASS'
      : 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_FAIL',
    contractId: H_EARTH_RUN_8B_CONTRACT_ID,
    predecessorRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
    run8A,
    field,
    geometry,
    run8CStatus: issues.length === 0
      ? 'AUTHORIZED_BY_RUN_8B_PASS'
      : 'WITHHELD_PENDING_RUN_8B_PASS',
    WestAdmissionExecuted: false,
    packet002TransferExecuted: false,
    rendererMutation: false,
    materialAndLightingPresentation: false,
    vegetationInstanceConstruction: false,
    publicRouteMutation: false,
    deployment: false,
    visualImprovementClaim: false,
    issues: freeze(issues)
  });
}

export default H_EARTH_RUN_8B_PACKAGE;
