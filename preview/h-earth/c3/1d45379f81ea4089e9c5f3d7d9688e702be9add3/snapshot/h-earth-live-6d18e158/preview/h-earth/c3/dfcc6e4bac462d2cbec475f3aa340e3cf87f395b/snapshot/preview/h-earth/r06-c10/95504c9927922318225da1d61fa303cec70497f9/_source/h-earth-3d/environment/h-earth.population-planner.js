/**
 * /h-earth-3d/environment/h-earth.population-planner.js
 *
 * H_EARTH_DETERMINISTIC_POPULATION_PLANNER_RUN_7E_v1
 *
 * Deterministic environmental-instance planning authority. It consumes the
 * canonical biome field, intrinsic surface state, and an externally supplied
 * spatial-lifecycle context. Run 7E does not establish the Run 7G lifecycle
 * authority; its bounded small-instance proof uses an explicitly provisional
 * lifecycle fixture. This module creates no geometry, renderer, traversal,
 * audio, route, or deployment authority.
 */

import {
  H_EARTH_BIOME_FIELD_CONTRACT_ID,
  sampleHEarthBiomeField
} from './h-earth.biome-field.js';

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  sampleHEarthSurfaceState
} from './h-earth.surface-state-field.js';

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState
} from './h-earth.atmosphere-state.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);

export const H_EARTH_POPULATION_PLANNER_CONTRACT_ID =
  'H_EARTH_DETERMINISTIC_POPULATION_PLANNER_RUN_7E_v1';

export const H_EARTH_POPULATION_PLAN_REVISION = 1;

export const H_EARTH_POPULATION_PLANNER_FORBIDDEN_NATIVE_OUTPUTS = deepFreeze([
  'geometry',
  'mesh',
  'renderPlan',
  'cameraState',
  'traversalClass',
  'traversalCost',
  'ambientAudioClass',
  'audioLayerSelection',
  'chunkState',
  'proxyState',
  'loadingState'
]);

export const H_EARTH_POPULATION_SPECIES_CATALOG = deepFreeze({
  PELAGIC_MICROHABITAT: {
    speciesId: 'COASTAL_PLANKTON_FIELD_v1',
    instanceClass: 'AQUATIC_MICROHABITAT_MARKER',
    baseDensity: 0.12,
    scaleRange: [0.7, 1.25]
  },
  SHALLOW_SEAGRASS: {
    speciesId: 'SHALLOW_SEAGRASS_CLUSTER_v1',
    instanceClass: 'AQUATIC_GROUNDCOVER',
    baseDensity: 0.72,
    scaleRange: [0.72, 1.35]
  },
  TIDAL_ALGAE: {
    speciesId: 'TIDAL_ALGAE_PATCH_v1',
    instanceClass: 'INTERTIDAL_GROUNDCOVER',
    baseDensity: 0.5,
    scaleRange: [0.65, 1.2]
  },
  SALT_TOLERANT_SEDGE: {
    speciesId: 'SALT_TOLERANT_SEDGE_CLUSTER_v1',
    instanceClass: 'COASTAL_SEDGE',
    baseDensity: 0.58,
    scaleRange: [0.72, 1.28]
  },
  DUNE_GRASS: {
    speciesId: 'DUNE_GRASS_CLUSTER_v1',
    instanceClass: 'DUNE_GROUNDCOVER',
    baseDensity: 0.8,
    scaleRange: [0.7, 1.34]
  },
  SAND_BINDING_GROUNDCOVER: {
    speciesId: 'SAND_BINDING_GROUNDCOVER_PATCH_v1',
    instanceClass: 'DUNE_GROUNDCOVER',
    baseDensity: 0.56,
    scaleRange: [0.68, 1.22]
  },
  MEADOW_GRASS: {
    speciesId: 'LOWLAND_MEADOW_GRASS_CLUSTER_v1',
    instanceClass: 'MEADOW_GROUNDCOVER',
    baseDensity: 0.9,
    scaleRange: [0.78, 1.38]
  },
  LOWLAND_FORB: {
    speciesId: 'LOWLAND_FORB_CLUSTER_v1',
    instanceClass: 'MEADOW_FORB',
    baseDensity: 0.52,
    scaleRange: [0.72, 1.22]
  },
  RIPARIAN_SEDGE: {
    speciesId: 'RIPARIAN_SEDGE_CLUSTER_v1',
    instanceClass: 'LOWLAND_SEDGE',
    baseDensity: 0.48,
    scaleRange: [0.8, 1.3]
  },
  COASTAL_GRASS: {
    speciesId: 'COASTAL_GRASS_CLUSTER_v1',
    instanceClass: 'COASTAL_GROUNDCOVER',
    baseDensity: 0.78,
    scaleRange: [0.72, 1.32]
  },
  COASTAL_FORB: {
    speciesId: 'COASTAL_FORB_CLUSTER_v1',
    instanceClass: 'COASTAL_FORB',
    baseDensity: 0.46,
    scaleRange: [0.72, 1.2]
  },
  LOW_SHRUB: {
    speciesId: 'LOW_COASTAL_SHRUB_v1',
    instanceClass: 'LOW_SHRUB',
    baseDensity: 0.34,
    scaleRange: [0.76, 1.26]
  },
  COASTAL_SHRUB: {
    speciesId: 'COASTAL_SHRUB_CLUSTER_v1',
    instanceClass: 'SHRUB',
    baseDensity: 0.56,
    scaleRange: [0.76, 1.34]
  },
  UPLAND_GRASS: {
    speciesId: 'UPLAND_GRASS_CLUSTER_v1',
    instanceClass: 'UPLAND_GROUNDCOVER',
    baseDensity: 0.52,
    scaleRange: [0.68, 1.24]
  },
  LICHEN: {
    speciesId: 'COASTAL_LICHEN_PATCH_v1',
    instanceClass: 'LICHEN_PATCH',
    baseDensity: 0.4,
    scaleRange: [0.62, 1.18]
  },
  ROCK_LICHEN: {
    speciesId: 'ROCK_LICHEN_PATCH_v1',
    instanceClass: 'LICHEN_PATCH',
    baseDensity: 0.66,
    scaleRange: [0.62, 1.16]
  },
  UPLAND_SHRUB: {
    speciesId: 'UPLAND_SHRUB_CLUSTER_v1',
    instanceClass: 'UPLAND_SHRUB',
    baseDensity: 0.42,
    scaleRange: [0.72, 1.3]
  },
  CREVICE_GRASS: {
    speciesId: 'CREVICE_GRASS_CLUSTER_v1',
    instanceClass: 'ROCK_CREVICE_GROUNDCOVER',
    baseDensity: 0.48,
    scaleRange: [0.64, 1.18]
  }
});

export const H_EARTH_POPULATION_PLANNER = deepFreeze({
  contractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  populationPlanRevision: H_EARTH_POPULATION_PLAN_REVISION,
  coordinateFrame: 'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',
  deterministicHash: 'FNV1A_32_WITH_COORDINATE_AND_SPECIES_SALT',
  ownership: {
    ownsDeterministicInstancePlan: true,
    ownsInstanceIdentity: true,
    ownsSpeciesSelectionFromEligibleGuilds: true,
    ownsBiomeClassification: false,
    ownsSurfaceState: false,
    ownsSpatialLifecycle: false,
    ownsGeometry: false,
    ownsRenderer: false,
    ownsTraversal: false,
    ownsAmbientAudioProjection: false,
    ownsCamera: false,
    ownsNavigation: false,
    ownsPublicRoute: false
  }
});

const LIFECYCLE_STATES = deepFreeze([
  'ACTIVE_DETAIL',
  'ACTIVE_REDUCED',
  'DISTANT_PROXY',
  'DORMANT',
  'UNAVAILABLE'
]);

function fnv1a32(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

const hash01 = (text) => fnv1a32(text) / 0xffffffff;
const quantize = (value) => Math.round(value * 1000) / 1000;

function validateLifecycleContext(context) {
  const issues = [];
  if (!context || typeof context !== 'object') {
    return ['SPATIAL_LIFECYCLE_CONTEXT_MISSING'];
  }
  if (typeof context.contractId !== 'string' || context.contractId.length === 0) {
    issues.push('SPATIAL_LIFECYCLE_CONTRACT_ID_MISSING');
  }
  if (!LIFECYCLE_STATES.includes(context.state)) {
    issues.push('SPATIAL_LIFECYCLE_STATE_INVALID');
  }
  if (!finite(context.densityScale) || context.densityScale < 0 ||
      context.densityScale > 1) {
    issues.push('SPATIAL_LIFECYCLE_DENSITY_SCALE_INVALID');
  }
  if (!Number.isInteger(context.maxInstances) || context.maxInstances < 0 ||
      context.maxInstances > 4096) {
    issues.push('SPATIAL_LIFECYCLE_MAX_INSTANCES_INVALID');
  }
  if (typeof context.authorityEstablished !== 'boolean') {
    issues.push('SPATIAL_LIFECYCLE_AUTHORITY_STATUS_MISSING');
  }
  return issues;
}

function rejectPopulationPlan(issues) {
  return deepFreeze({
    eligible: false,
    status: 'POPULATION_PLAN_REJECTED',
    contractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    populationPlanRevision: H_EARTH_POPULATION_PLAN_REVISION,
    instances: [],
    instanceCount: 0,
    speciesCounts: {},
    issues
  });
}

function validateBounds(bounds) {
  if (!bounds || ![
    bounds.xMinimum,
    bounds.xMaximum,
    bounds.zMinimum,
    bounds.zMaximum
  ].every(finite)) {
    return ['POPULATION_BOUNDS_NOT_FINITE'];
  }
  if (bounds.xMaximum <= bounds.xMinimum ||
      bounds.zMaximum <= bounds.zMinimum) {
    return ['POPULATION_BOUNDS_ORDER_INVALID'];
  }
  return [];
}

function lifecycleDensity(context) {
  switch (context.state) {
    case 'ACTIVE_DETAIL': return context.densityScale;
    case 'ACTIVE_REDUCED': return context.densityScale * 0.42;
    case 'DISTANT_PROXY': return 0;
    case 'DORMANT': return 0;
    case 'UNAVAILABLE': return 0;
    default: return 0;
  }
}

function buildInstance({
  seed,
  gridX,
  gridZ,
  biome,
  surface,
  guild,
  species
}) {
  const identitySalt = `${seed}|${gridX}|${gridZ}|${guild}|${species.speciesId}`;
  const identityHash = fnv1a32(identitySalt).toString(16).padStart(8, '0');
  const offsetX = (hash01(`${identitySalt}|OFFSET_X`) - 0.5) * 8;
  const offsetZ = (hash01(`${identitySalt}|OFFSET_Z`) - 0.5) * 8;
  const rotationY = hash01(`${identitySalt}|ROTATION`) * Math.PI * 2;
  const [minimumScale, maximumScale] = species.scaleRange;
  const scale = minimumScale +
    (maximumScale - minimumScale) * hash01(`${identitySalt}|SCALE`);

  return deepFreeze({
    instanceId: `H_EARTH_POPULATION:${species.speciesId}:${identityHash}`,
    speciesId: species.speciesId,
    guild,
    instanceClass: species.instanceClass,
    world: {
      x: quantize(gridX + offsetX),
      y: quantize(biome.world.y),
      z: quantize(gridZ + offsetZ)
    },
    rotationY: quantize(rotationY),
    uniformScale: quantize(scale),
    biomeClass: biome.biomeClass,
    ecologicalEligibility: biome.ecologicalEligibility,
    vegetationCapacity: biome.vegetationCapacity,
    surfaceClass: surface.surfaceClass,
    semanticAddressId: biome.semanticAddressId,
    chunkId: biome.chunkId,
    formationIds: biome.formationIds,
    sourceIdentities: {
      biomeFieldContractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
      surfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
      populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
      populationPlanRevision: H_EARTH_POPULATION_PLAN_REVISION
    }
  });
}

export function planHEarthPopulation({
  bounds,
  sampleStep = 24,
  deterministicSeed = 'H_EARTH_RUN_7E_DEFAULT_SEED',
  atmosphereState = null,
  spatialLifecycleContext
} = {}) {
  const issues = [
    ...validateBounds(bounds),
    ...validateLifecycleContext(spatialLifecycleContext)
  ];
  if (!finite(sampleStep) || sampleStep <= 0 || sampleStep > 128) {
    issues.push('POPULATION_SAMPLE_STEP_INVALID');
  }
  if (typeof deterministicSeed !== 'string' || deterministicSeed.length === 0) {
    issues.push('POPULATION_SEED_INVALID');
  }
  if (issues.length > 0) return rejectPopulationPlan(issues);

  const atmosphere = atmosphereState ?? sampleHEarthAtmosphereState();
  if (atmosphere?.valid !== true ||
      atmosphere?.contractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID) {
    return rejectPopulationPlan(['ATMOSPHERE_STATE_INVALID']);
  }

  const densityScale = lifecycleDensity(spatialLifecycleContext);
  const samples = [];
  const instances = [];
  let candidateCount = 0;

  outer:
  for (let z = bounds.zMinimum; z <= bounds.zMaximum + 1e-8; z += sampleStep) {
    for (let x = bounds.xMinimum; x <= bounds.xMaximum + 1e-8; x += sampleStep) {
      const biome = sampleHEarthBiomeField(x, z, { atmosphereState: atmosphere });
      const surface = sampleHEarthSurfaceState(x, z);
      if (biome?.valid !== true || surface?.valid !== true) continue;
      samples.push(deepFreeze({
        worldX: x,
        worldZ: z,
        biomeClass: biome.biomeClass,
        vegetationCapacity: biome.vegetationCapacity,
        speciesGuilds: biome.speciesGuilds,
        semanticAddressId: biome.semanticAddressId,
        chunkId: biome.chunkId
      }));

      for (const guild of biome.speciesGuilds) {
        const species = H_EARTH_POPULATION_SPECIES_CATALOG[guild];
        if (!species) continue;
        candidateCount += 1;
        const suitability = clamp01(
          biome.ecologicalEligibility *
          Math.max(biome.vegetationCapacity, biome.groundCoverCapacity) *
          Math.max(surface.vegetationSupport, biome.waterPresent ? 0.5 : 0) *
          species.baseDensity *
          densityScale
        );
        const selectionScore = hash01(
          `${deterministicSeed}|${x}|${z}|${guild}|SELECT`
        );
        if (selectionScore > suitability) continue;
        instances.push(buildInstance({
          seed: deterministicSeed,
          gridX: x,
          gridZ: z,
          biome,
          surface,
          guild,
          species
        }));
        if (instances.length >= spatialLifecycleContext.maxInstances) break outer;
      }
    }
  }

  const speciesCounts = {};
  instances.forEach((instance) => {
    speciesCounts[instance.speciesId] =
      (speciesCounts[instance.speciesId] ?? 0) + 1;
  });
  const orderedSpeciesCounts = Object.fromEntries(
    Object.entries(speciesCounts).sort(([left], [right]) =>
      left.localeCompare(right))
  );

  return deepFreeze({
    eligible: true,
    status: 'POPULATION_PLAN_COMPLETE',
    contractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    populationPlanRevision: H_EARTH_POPULATION_PLAN_REVISION,
    deterministicSeed,
    bounds: { ...bounds },
    sampleStep,
    sampleCount: samples.length,
    candidateCount,
    instanceCount: instances.length,
    speciesCount: Object.keys(orderedSpeciesCounts).length,
    speciesCounts: orderedSpeciesCounts,
    instances,
    sampleSummaries: samples,
    spatialLifecycleContext: {
      contractId: spatialLifecycleContext.contractId,
      state: spatialLifecycleContext.state,
      densityScale: spatialLifecycleContext.densityScale,
      maxInstances: spatialLifecycleContext.maxInstances,
      authorityEstablished: spatialLifecycleContext.authorityEstablished,
      provisional: spatialLifecycleContext.provisional === true
    },
    spatialLifecycleAuthorityStatus:
      spatialLifecycleContext.authorityEstablished
        ? 'EXTERNAL_AUTHORITY_CONSUMED'
        : 'PROVISIONAL_CONTEXT_RUN_7G_NOT_YET_ESTABLISHED',
    sourceIdentities: {
      biomeFieldContractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
      surfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
      atmosphereStateContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
      spatialLifecycleContractId: spatialLifecycleContext.contractId,
      populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
      populationPlanRevision: H_EARTH_POPULATION_PLAN_REVISION
    },
    geometryCreated: false,
    rendererMutation: false,
    publicRouteMutation: false,
    issues: []
  });
}

export const H_EARTH_RUN_7E_SMALL_INSTANCE_PROOF_CONTEXT = deepFreeze({
  contractId: 'H_EARTH_SPATIAL_LIFECYCLE_PROOF_CONTEXT_RUN_7E_ONLY',
  state: 'ACTIVE_DETAIL',
  densityScale: 1,
  maxInstances: 64,
  authorityEstablished: false,
  provisional: true
});

export function buildHEarthRun7ESmallInstanceProof({
  atmosphereState = null
} = {}) {
  return planHEarthPopulation({
    bounds: {
      xMinimum: -160,
      xMaximum: 160,
      zMinimum: -224,
      zMaximum: -32
    },
    sampleStep: 24,
    deterministicSeed: 'H_EARTH_RUN_7E_SMALL_INSTANCE_PROOF_v1',
    atmosphereState,
    spatialLifecycleContext: H_EARTH_RUN_7E_SMALL_INSTANCE_PROOF_CONTEXT
  });
}

export function evaluateHEarthPopulationPlan(plan) {
  const issues = [];
  if (plan?.eligible !== true) issues.push('POPULATION_PLAN_NOT_ELIGIBLE');
  if (plan?.contractId !== H_EARTH_POPULATION_PLANNER_CONTRACT_ID) {
    issues.push('POPULATION_PLANNER_CONTRACT_ID_MISMATCH');
  }
  if (!Number.isInteger(plan?.instanceCount) || plan.instanceCount < 0) {
    issues.push('POPULATION_INSTANCE_COUNT_INVALID');
  }
  if (!Array.isArray(plan?.instances) ||
      plan.instances.length !== plan?.instanceCount) {
    issues.push('POPULATION_INSTANCE_ARRAY_MISMATCH');
  }
  if (plan?.spatialLifecycleContext?.contractId == null) {
    issues.push('SPATIAL_LIFECYCLE_SOURCE_IDENTITY_MISSING');
  }
  const identities = new Set();
  for (const instance of plan?.instances ?? []) {
    if (typeof instance.instanceId !== 'string' || instance.instanceId.length === 0) {
      issues.push('POPULATION_INSTANCE_ID_MISSING');
    } else if (identities.has(instance.instanceId)) {
      issues.push(`POPULATION_INSTANCE_ID_DUPLICATE:${instance.instanceId}`);
    }
    identities.add(instance.instanceId);
    if (![instance.world?.x, instance.world?.y, instance.world?.z,
      instance.rotationY, instance.uniformScale].every(finite)) {
      issues.push(`POPULATION_INSTANCE_NONFINITE:${instance.instanceId}`);
    }
    H_EARTH_POPULATION_PLANNER_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(instance, field)) {
        issues.push(`FORBIDDEN_INSTANCE_OUTPUT:${field}`);
      }
    });
  }
  H_EARTH_POPULATION_PLANNER_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(plan ?? {}, field)) {
      issues.push(`FORBIDDEN_PLAN_OUTPUT:${field}`);
    }
  });
  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'POPULATION_PLAN_PASS'
      : 'POPULATION_PLAN_FAIL',
    issues
  });
}

export function getHEarthPopulationPlannerReceipt() {
  const issues = [];
  if (H_EARTH_POPULATION_PLANNER.ownership.ownsSpatialLifecycle !== false) {
    issues.push('SPATIAL_LIFECYCLE_AUTHORITY_LEAK');
  }
  if (Object.keys(H_EARTH_POPULATION_SPECIES_CATALOG).length < 12) {
    issues.push('SPECIES_CATALOG_TOO_SMALL');
  }
  return deepFreeze({
    receiptType: 'H_EARTH_POPULATION_PLANNER_RECEIPT',
    contractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    populationPlanRevision: H_EARTH_POPULATION_PLAN_REVISION,
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'POPULATION_PLANNER_READY'
      : 'POPULATION_PLANNER_HELD',
    speciesCatalogCount: Object.keys(H_EARTH_POPULATION_SPECIES_CATALOG).length,
    spatialLifecycleAuthorityEstablishedByRun7E: false,
    issues
  });
}

export default H_EARTH_POPULATION_PLANNER;
