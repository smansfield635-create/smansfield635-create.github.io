/**
 * /h-earth-3d/environment/h-earth.vegetation-resolution.run8d.js
 *
 * H_EARTH_GROUNDED_VEGETATION_ARCHETYPE_AND_INSTANCE_RESOLUTION_RUN_8D_v2
 * HC05 whole-environment maturity renewal. Deterministic vegetation remains
 * rooted to the accepted Gratitude presentation surface, but the active-detail
 * population now spans the mountain/foothill corridor instead of stopping at
 * the former -224 Z boundary. This is a presentation/runtime population
 * expansion only; accepted terrain/world truth remains read-only.
 */

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import { H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID } from '../terrain/h-earth.successor-terrain-field.run8b.js';
import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import {
  H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  planHEarthPopulation,
  evaluateHEarthPopulationPlan
} from './h-earth.population-planner.js';
import { H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID, sampleHEarthAtmosphereState } from './h-earth.atmosphere-state.js';
import { H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID, H_EARTH_SPATIAL_LIFECYCLE_PROFILE } from './h-earth.spatial-lifecycle.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID =
  'H_EARTH_GROUNDED_VEGETATION_ARCHETYPE_AND_INSTANCE_RESOLUTION_RUN_8D_v2';
export const H_EARTH_RUN_8D_VEGETATION_RESOLUTION_SOURCE_FILE =
  '/h-earth-3d/environment/h-earth.vegetation-resolution.run8d.js';
export const H_EARTH_RUN_8D_POPULATION_BOUNDS = freeze({
  xMinimum: -224,
  xMaximum: 192,
  zMinimum: -304,
  zMaximum: -24
});
export const H_EARTH_RUN_8D_ACTIVE_DETAIL_LIFECYCLE_CONTEXT = freeze({
  contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  state: 'ACTIVE_DETAIL',
  densityScale: H_EARTH_SPATIAL_LIFECYCLE_PROFILE.statePolicies.ACTIVE_DETAIL.densityScale,
  maxInstances: Math.min(27, H_EARTH_SPATIAL_LIFECYCLE_PROFILE.statePolicies.ACTIVE_DETAIL.maxInstances),
  authorityEstablished: true,
  provisional: false,
  profileId: H_EARTH_SPATIAL_LIFECYCLE_PROFILE.profileId
});
export const H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION = freeze({
  COASTAL_GRASS_TUFT: {
    acceptedInstanceClasses: ['AQUATIC_MICROHABITAT_MARKER','AQUATIC_GROUNDCOVER','INTERTIDAL_GROUNDCOVER','COASTAL_SEDGE','DUNE_GROUNDCOVER','MEADOW_GROUNDCOVER','MEADOW_FORB','LOWLAND_SEDGE','COASTAL_GROUNDCOVER','COASTAL_FORB','UPLAND_GROUNDCOVER','LICHEN_PATCH','ROCK_CREVICE_GROUNDCOVER'],
    materialIntent: 'VEGETATION_GRASS_SEDGE_FORB_AND_GROUNDCOVER',
    presentationScaleMultiplier: 1.12,
    minimumPresentationScale: 0.82,
    maximumPresentationScale: 1.65
  },
  LOWLAND_SHRUB: {
    acceptedInstanceClasses: ['LOW_SHRUB','SHRUB','UPLAND_SHRUB'],
    materialIntent: 'VEGETATION_WOODY_SHRUB',
    presentationScaleMultiplier: 1.2,
    minimumPresentationScale: 0.92,
    maximumPresentationScale: 1.95
  },
  HIGHLAND_CONIFER_SAPLING: {
    acceptedInstanceClasses: ['HIGHLAND_CONIFER_SAPLING'],
    materialIntent: 'VEGETATION_CONIFER_TRUNK_AND_CANOPY',
    presentationScaleMultiplier: 1.42,
    minimumPresentationScale: 1.08,
    maximumPresentationScale: 2.5
  }
});
const CLASS_TO_ARCHETYPE = new Map(Object.entries(H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION)
  .flatMap(([archetypeId, descriptor]) => descriptor.acceptedInstanceClasses.map((instanceClass) => [instanceClass, archetypeId])));

function rejectResolution(issues) {
  return freeze({ eligible: false, status: 'RUN_8D_VEGETATION_RESOLUTION_REJECTED', contractId: H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
    populationPlan: null, instances: [], instanceCount: 0, archetypeCounts: {}, issues: freeze(issues) });
}

function acceptedGroundAnchor(worldX, worldZ) {
  const center = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ);
  if (center?.valid !== true || !finite(center.presentationElevation)) return null;
  const step = 1;
  const elevation = (x, z) => {
    const sample = sampleHEarthMapWideEnvironmentTerrainCandidate(x, z);
    return sample?.valid === true && finite(sample.presentationElevation) ? sample.presentationElevation : center.presentationElevation;
  };
  const dx = (elevation(worldX + step, worldZ) - elevation(worldX - step, worldZ)) / (2 * step);
  const dz = (elevation(worldX, worldZ + step) - elevation(worldX, worldZ - step)) / (2 * step);
  const length = Math.hypot(dx, 1, dz);
  return freeze({
    elevation: center.presentationElevation,
    geometricElevation: center.elevation,
    normal: { x: -dx / length, y: 1 / length, z: -dz / length },
    source: center
  });
}

export function buildHEarthRun8DVegetationResolution({
  atmosphereState = sampleHEarthAtmosphereState({ timeOfDayHours: 15.25, observerElevation: 2.25, viewDistance: 420 })
} = {}) {
  if (atmosphereState?.valid !== true || atmosphereState?.contractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID) {
    return rejectResolution(['RUN_8D_ATMOSPHERE_STATE_INVALID']);
  }
  const populationPlan = planHEarthPopulation({
    bounds: H_EARTH_RUN_8D_POPULATION_BOUNDS,
    sampleStep: 16,
    deterministicSeed: 'H_EARTH_RUN_8D_GROUNDED_VEGETATION_v1',
    atmosphereState,
    spatialLifecycleContext: H_EARTH_RUN_8D_ACTIVE_DETAIL_LIFECYCLE_CONTEXT
  });
  const populationEvaluation = evaluateHEarthPopulationPlan(populationPlan);
  if (populationEvaluation.eligible !== true) return rejectResolution(['RUN_8D_POPULATION_PLAN_INVALID', ...populationEvaluation.issues]);

  const issues = [];
  const instances = [];
  const archetypeCounts = Object.fromEntries(Object.keys(H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION).map((id) => [id, 0]));
  const rootEmbed = H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT.worldAnchorLaw.rootEmbedWorldUnits;

  for (const populationInstance of populationPlan.instances) {
    const archetypeId = CLASS_TO_ARCHETYPE.get(populationInstance.instanceClass) ?? null;
    if (!archetypeId) { issues.push(`RUN_8D_UNRESOLVED_INSTANCE_CLASS:${populationInstance.instanceClass}`); continue; }
    const terrain = acceptedGroundAnchor(populationInstance.world.x, populationInstance.world.z);
    if (!terrain || !finite(terrain.elevation) || ![terrain.normal?.x,terrain.normal?.y,terrain.normal?.z].every(finite)) {
      issues.push(`RUN_8D_HC05_ACCEPTED_GROUND_ANCHOR_INVALID:${populationInstance.instanceId}`); continue;
    }
    const descriptor = H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION[archetypeId];
    const sourceBounds = H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT.archetypes[archetypeId].bounds;
    const scaled = populationInstance.uniformScale * descriptor.presentationScaleMultiplier;
    const boundedScale = clamp(scaled, descriptor.minimumPresentationScale, descriptor.maximumPresentationScale);
    instances.push(freeze({
      instanceId: `H_EARTH_RUN_8D:${populationInstance.instanceId}`,
      sourcePopulationInstanceId: populationInstance.instanceId,
      speciesId: populationInstance.speciesId,
      guild: populationInstance.guild,
      sourceInstanceClass: populationInstance.instanceClass,
      archetypeId,
      worldAnchor: { x: populationInstance.world.x, y: terrain.elevation + rootEmbed, z: populationInstance.world.z },
      successorTerrainElevation: terrain.elevation,
      geometricTerrainElevation: terrain.geometricElevation,
      successorTerrainNormal: { ...terrain.normal },
      rootEmbedWorldUnits: rootEmbed,
      yawRadians: populationInstance.rotationY,
      uniformScale: boundedScale,
      localBounds: { ...sourceBounds },
      worldBoundsRadius: Math.hypot(sourceBounds.x * boundedScale, sourceBounds.y * boundedScale, sourceBounds.z * boundedScale) * 0.5,
      semanticAddressId: populationInstance.semanticAddressId,
      chunkId: populationInstance.chunkId,
      formationIds: populationInstance.formationIds,
      biomeClass: populationInstance.biomeClass,
      surfaceClass: populationInstance.surfaceClass,
      attachmentLaw: {
        worldY: 'HC05_ACCEPTED_GRATITUDE_PRESENTATION_ELEVATION_PLUS_ROOT_EMBED',
        upAlignment: 'HC05_ACCEPTED_GRATITUDE_PRESENTATION_NORMAL',
        yaw: 'RUN_7E_DETERMINISTIC_INSTANCE_HASH',
        scale: 'RUN_7E_DETERMINISTIC_BOUNDED_ARCHETYPE_SCALE_WITH_RUN8D_PRESENTATION_MULTIPLIER',
        cameraRelativePosition: false,
        screenRelativePosition: false,
        sameWorldToCameraTransformAsTerrainRequired: true,
        samePhysicalDepthDomainAsTerrainRequired: true,
        terrainOcclusionRequiredAtRun8E: true
      },
      sourceIdentities: {
        run8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
        vegetationAnchorContractId: H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT.contractId,
        successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
        acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
        populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
        spatialLifecycleContractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
        sourcePopulationPlanRevision: populationPlan.populationPlanRevision
      }
    }));
    archetypeCounts[archetypeId] += 1;
  }

  return freeze({
    eligible: issues.length === 0 && instances.length > 0,
    status: issues.length === 0 && instances.length > 0 ? 'RUN_8D_VEGETATION_RESOLUTION_COMPLETE' : 'RUN_8D_VEGETATION_RESOLUTION_FAILED',
    contractId: H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
    controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
    successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    spatialLifecycleContractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    populationBounds: H_EARTH_RUN_8D_POPULATION_BOUNDS,
    activeDetailMaxInstances: H_EARTH_RUN_8D_ACTIVE_DETAIL_LIFECYCLE_CONTEXT.maxInstances,
    populationPlan,
    instanceCount: instances.length,
    archetypeCounts: freeze(archetypeCounts),
    uninstantiatedArchetypes: freeze(Object.entries(archetypeCounts).filter(([, count]) => count === 0).map(([id]) => id)),
    instances: freeze(instances),
    acceptedWorldSourceMutated: false,
    geometryCreated: false,
    cameraAuthorityCreated: false,
    rendererMutation: false,
    publicRouteMutation: false,
    issues: freeze(issues)
  });
}

export function evaluateHEarthRun8DVegetationResolution(resolution) {
  const issues = [];
  if (resolution?.eligible !== true) issues.push('RUN_8D_RESOLUTION_NOT_ELIGIBLE');
  if (resolution?.contractId !== H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID) issues.push('RUN_8D_RESOLUTION_CONTRACT_ID_MISMATCH');
  if (!Array.isArray(resolution?.instances) || resolution.instances.length !== resolution.instanceCount || resolution.instanceCount <= 0) issues.push('RUN_8D_RESOLVED_INSTANCE_SET_INVALID');
  const identities = new Set();
  for (const instance of resolution?.instances ?? []) {
    if (identities.has(instance.instanceId)) issues.push(`RUN_8D_DUPLICATE_INSTANCE:${instance.instanceId}`);
    identities.add(instance.instanceId);
    if (!H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION[instance.archetypeId]) issues.push(`RUN_8D_ARCHETYPE_UNKNOWN:${instance.archetypeId}`);
    if (![instance.worldAnchor?.x,instance.worldAnchor?.y,instance.worldAnchor?.z,instance.successorTerrainElevation,instance.successorTerrainNormal?.x,instance.successorTerrainNormal?.y,instance.successorTerrainNormal?.z,instance.yawRadians,instance.uniformScale].every(finite)) issues.push(`RUN_8D_INSTANCE_NONFINITE:${instance.instanceId}`);
    if (instance.attachmentLaw?.cameraRelativePosition !== false || instance.attachmentLaw?.screenRelativePosition !== false ||
        instance.attachmentLaw?.sameWorldToCameraTransformAsTerrainRequired !== true || instance.attachmentLaw?.samePhysicalDepthDomainAsTerrainRequired !== true) {
      issues.push(`RUN_8D_WORLD_ATTACHMENT_LAW_INVALID:${instance.instanceId}`);
    }
    if (instance.sourceIdentities?.acceptedWorldProjectionContractId !== H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID) issues.push(`RUN_8D_HC05_ACCEPTED_WORLD_SOURCE_MISSING:${instance.instanceId}`);
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8D_SUCCESSOR_VEGETATION_PASS' : 'RUN_8D_SUCCESSOR_VEGETATION_FAIL',
    issues: freeze(issues)
  });
}

export default H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION;
