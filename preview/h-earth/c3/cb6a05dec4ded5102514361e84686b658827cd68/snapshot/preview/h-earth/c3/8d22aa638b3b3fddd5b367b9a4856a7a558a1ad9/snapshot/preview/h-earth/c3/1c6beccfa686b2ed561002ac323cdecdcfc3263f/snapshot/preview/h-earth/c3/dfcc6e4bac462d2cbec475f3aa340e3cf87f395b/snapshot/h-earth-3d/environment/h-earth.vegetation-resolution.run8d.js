/**
 * /h-earth-3d/environment/h-earth.vegetation-resolution.run8d.js
 *
 * H_EARTH_GROUNDED_VEGETATION_ARCHETYPE_AND_INSTANCE_RESOLUTION_RUN_8D_v1
 *
 * Resolves accepted Run 7E deterministic population instances into the frozen
 * Run 8A vegetation archetypes and re-anchors every resolved instance to the
 * Run 8B successor terrain field. This file creates no geometry, admission,
 * renderer, camera, route, deployment, or merge authority.
 */

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';

import {
  H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  planHEarthPopulation,
  evaluateHEarthPopulationPlan
} from './h-earth.population-planner.js';

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState
} from './h-earth.atmosphere-state.js';

import {
  H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  H_EARTH_SPATIAL_LIFECYCLE_PROFILE
} from './h-earth.spatial-lifecycle.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID =
  'H_EARTH_GROUNDED_VEGETATION_ARCHETYPE_AND_INSTANCE_RESOLUTION_RUN_8D_v1';

export const H_EARTH_RUN_8D_VEGETATION_RESOLUTION_SOURCE_FILE =
  '/h-earth-3d/environment/h-earth.vegetation-resolution.run8d.js';

export const H_EARTH_RUN_8D_POPULATION_BOUNDS = freeze({
  xMinimum: -160,
  xMaximum: 160,
  zMinimum: -224,
  zMaximum: -32
});

export const H_EARTH_RUN_8D_ACTIVE_DETAIL_LIFECYCLE_CONTEXT = freeze({
  contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  state: 'ACTIVE_DETAIL',
  densityScale:
    H_EARTH_SPATIAL_LIFECYCLE_PROFILE.statePolicies.ACTIVE_DETAIL.densityScale,
  maxInstances: Math.min(
    64,
    H_EARTH_SPATIAL_LIFECYCLE_PROFILE.statePolicies.ACTIVE_DETAIL.maxInstances
  ),
  authorityEstablished: true,
  provisional: false,
  profileId: H_EARTH_SPATIAL_LIFECYCLE_PROFILE.profileId
});

export const H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION = freeze({
  COASTAL_GRASS_TUFT: {
    acceptedInstanceClasses: [
      'AQUATIC_MICROHABITAT_MARKER',
      'AQUATIC_GROUNDCOVER',
      'INTERTIDAL_GROUNDCOVER',
      'COASTAL_SEDGE',
      'DUNE_GROUNDCOVER',
      'MEADOW_GROUNDCOVER',
      'MEADOW_FORB',
      'LOWLAND_SEDGE',
      'COASTAL_GROUNDCOVER',
      'COASTAL_FORB',
      'UPLAND_GROUNDCOVER',
      'LICHEN_PATCH',
      'ROCK_CREVICE_GROUNDCOVER'
    ],
    materialIntent: 'VEGETATION_GRASS_SEDGE_FORB_AND_GROUNDCOVER'
  },
  LOWLAND_SHRUB: {
    acceptedInstanceClasses: ['LOW_SHRUB', 'SHRUB', 'UPLAND_SHRUB'],
    materialIntent: 'VEGETATION_WOODY_SHRUB'
  },
  HIGHLAND_CONIFER_SAPLING: {
    acceptedInstanceClasses: ['HIGHLAND_CONIFER_SAPLING'],
    materialIntent: 'VEGETATION_CONIFER_TRUNK_AND_CANOPY'
  }
});

const CLASS_TO_ARCHETYPE = new Map(
  Object.entries(H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION)
    .flatMap(([archetypeId, descriptor]) =>
      descriptor.acceptedInstanceClasses.map((instanceClass) => [instanceClass, archetypeId])
    )
);

function rejectResolution(issues) {
  return freeze({
    eligible: false,
    status: 'RUN_8D_VEGETATION_RESOLUTION_REJECTED',
    contractId: H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
    populationPlan: null,
    instances: [],
    instanceCount: 0,
    archetypeCounts: {},
    issues: freeze(issues)
  });
}

export function buildHEarthRun8DVegetationResolution({
  atmosphereState = sampleHEarthAtmosphereState({
    timeOfDayHours: 15.25,
    observerElevation: 2.25,
    viewDistance: 320
  })
} = {}) {
  if (atmosphereState?.valid !== true ||
      atmosphereState?.contractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID) {
    return rejectResolution(['RUN_8D_ATMOSPHERE_STATE_INVALID']);
  }

  const populationPlan = planHEarthPopulation({
    bounds: H_EARTH_RUN_8D_POPULATION_BOUNDS,
    sampleStep: 24,
    deterministicSeed: 'H_EARTH_RUN_8D_GROUNDED_VEGETATION_v1',
    atmosphereState,
    spatialLifecycleContext: H_EARTH_RUN_8D_ACTIVE_DETAIL_LIFECYCLE_CONTEXT
  });
  const populationEvaluation = evaluateHEarthPopulationPlan(populationPlan);
  if (populationEvaluation.eligible !== true) {
    return rejectResolution([
      'RUN_8D_POPULATION_PLAN_INVALID',
      ...populationEvaluation.issues
    ]);
  }

  const issues = [];
  const instances = [];
  const archetypeCounts = Object.fromEntries(
    Object.keys(H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION).map((id) => [id, 0])
  );
  const rootEmbed =
    H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
      .worldAnchorLaw.rootEmbedWorldUnits;

  for (const populationInstance of populationPlan.instances) {
    const archetypeId = CLASS_TO_ARCHETYPE.get(populationInstance.instanceClass) ?? null;
    if (!archetypeId) {
      issues.push(`RUN_8D_UNRESOLVED_INSTANCE_CLASS:${populationInstance.instanceClass}`);
      continue;
    }
    const terrain = sampleHEarthRun8BSuccessorTerrainField(
      populationInstance.world.x,
      populationInstance.world.z
    );
    if (terrain?.valid !== true || !finite(terrain.elevation) ||
        ![terrain.normal?.x, terrain.normal?.y, terrain.normal?.z].every(finite)) {
      issues.push(`RUN_8D_SUCCESSOR_TERRAIN_ANCHOR_INVALID:${populationInstance.instanceId}`);
      continue;
    }

    const sourceBounds =
      H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
        .archetypes[archetypeId].bounds;
    const boundedScale = clamp(populationInstance.uniformScale, 0.62, 1.4);

    instances.push(freeze({
      instanceId: `H_EARTH_RUN_8D:${populationInstance.instanceId}`,
      sourcePopulationInstanceId: populationInstance.instanceId,
      speciesId: populationInstance.speciesId,
      guild: populationInstance.guild,
      sourceInstanceClass: populationInstance.instanceClass,
      archetypeId,
      worldAnchor: {
        x: populationInstance.world.x,
        y: terrain.elevation + rootEmbed,
        z: populationInstance.world.z
      },
      successorTerrainElevation: terrain.elevation,
      successorTerrainNormal: { ...terrain.normal },
      rootEmbedWorldUnits: rootEmbed,
      yawRadians: populationInstance.rotationY,
      uniformScale: boundedScale,
      localBounds: { ...sourceBounds },
      worldBoundsRadius: Math.hypot(
        sourceBounds.x * boundedScale,
        sourceBounds.y * boundedScale,
        sourceBounds.z * boundedScale
      ) * 0.5,
      semanticAddressId: populationInstance.semanticAddressId,
      chunkId: populationInstance.chunkId,
      formationIds: populationInstance.formationIds,
      biomeClass: populationInstance.biomeClass,
      surfaceClass: populationInstance.surfaceClass,
      attachmentLaw: {
        worldY: 'SUCCESSOR_TERRAIN_ELEVATION_PLUS_ROOT_EMBED',
        upAlignment: 'SUCCESSOR_TERRAIN_NORMAL',
        yaw: 'RUN_7E_DETERMINISTIC_INSTANCE_HASH',
        scale: 'RUN_7E_DETERMINISTIC_BOUNDED_ARCHETYPE_SCALE',
        cameraRelativePosition: false,
        screenRelativePosition: false,
        sameWorldToCameraTransformAsTerrainRequired: true,
        samePhysicalDepthDomainAsTerrainRequired: true,
        terrainOcclusionRequiredAtRun8E: true
      },
      sourceIdentities: {
        run8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
        vegetationAnchorContractId:
          H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT.contractId,
        successorTerrainFieldContractId:
          H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
        populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
        spatialLifecycleContractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
        sourcePopulationPlanRevision: populationPlan.populationPlanRevision
      }
    }));
    archetypeCounts[archetypeId] += 1;
  }

  return freeze({
    eligible: issues.length === 0 && instances.length > 0,
    status: issues.length === 0 && instances.length > 0
      ? 'RUN_8D_VEGETATION_RESOLUTION_COMPLETE'
      : 'RUN_8D_VEGETATION_RESOLUTION_FAILED',
    contractId: H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
    controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
    successorTerrainFieldContractId:
      H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    spatialLifecycleContractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    populationPlan,
    instanceCount: instances.length,
    archetypeCounts: freeze(archetypeCounts),
    uninstantiatedArchetypes: freeze(
      Object.entries(archetypeCounts)
        .filter(([, count]) => count === 0)
        .map(([id]) => id)
    ),
    instances: freeze(instances),
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
  if (resolution?.contractId !== H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID) {
    issues.push('RUN_8D_RESOLUTION_CONTRACT_ID_MISMATCH');
  }
  if (!Array.isArray(resolution?.instances) ||
      resolution.instances.length !== resolution.instanceCount ||
      resolution.instanceCount <= 0) {
    issues.push('RUN_8D_RESOLVED_INSTANCE_SET_INVALID');
  }
  const identities = new Set();
  for (const instance of resolution?.instances ?? []) {
    if (identities.has(instance.instanceId)) issues.push(`RUN_8D_DUPLICATE_INSTANCE:${instance.instanceId}`);
    identities.add(instance.instanceId);
    if (!H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION[instance.archetypeId]) {
      issues.push(`RUN_8D_ARCHETYPE_UNKNOWN:${instance.archetypeId}`);
    }
    if (![instance.worldAnchor?.x, instance.worldAnchor?.y, instance.worldAnchor?.z,
      instance.successorTerrainElevation, instance.successorTerrainNormal?.x,
      instance.successorTerrainNormal?.y, instance.successorTerrainNormal?.z,
      instance.yawRadians, instance.uniformScale].every(finite)) {
      issues.push(`RUN_8D_INSTANCE_NONFINITE:${instance.instanceId}`);
    }
    if (instance.attachmentLaw?.cameraRelativePosition !== false ||
        instance.attachmentLaw?.screenRelativePosition !== false ||
        instance.attachmentLaw?.sameWorldToCameraTransformAsTerrainRequired !== true ||
        instance.attachmentLaw?.samePhysicalDepthDomainAsTerrainRequired !== true) {
      issues.push(`RUN_8D_WORLD_ATTACHMENT_LAW_INVALID:${instance.instanceId}`);
    }
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8D_VEGETATION_RESOLUTION_PASS'
      : 'RUN_8D_VEGETATION_RESOLUTION_FAIL',
    issues: freeze(issues)
  });
}

export default H_EARTH_RUN_8D_ARCHETYPE_RESOLUTION;
