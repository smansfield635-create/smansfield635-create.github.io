/**
 * /h-earth-3d/integration/h-earth.functional-environment-composite.js
 * H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_RUN_7H_v1
 * Read-only aggregation and correspondence layer. No source authority is replaced.
 */

import { H_EARTH_TERRAIN_FIELD_CONTRACT_ID, sampleHEarthTerrainField } from '../terrain/h-earth.terrain-field.js';
import { H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID, sampleHEarthSurfaceState } from '../environment/h-earth.surface-state-field.js';
import { H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID, sampleHEarthAtmosphereState } from '../environment/h-earth.atmosphere-state.js';
import { H_EARTH_WATER_STATE_CONTRACT_ID, sampleHEarthWaterState } from '../environment/h-earth.water-state.js';
import { H_EARTH_BIOME_FIELD_CONTRACT_ID, sampleHEarthBiomeField } from '../environment/h-earth.biome-field.js';
import { H_EARTH_POPULATION_PLANNER_CONTRACT_ID, planHEarthPopulation } from '../environment/h-earth.population-planner.js';
import { H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID, sampleHEarthTraversalSurface } from '../environment/h-earth.traversal-surface.js';
import {
  H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  sampleHEarthSpatialLifecycle,
  projectHEarthSpatialLifecycleToPopulationContext
} from '../environment/h-earth.spatial-lifecycle.js';
import {
  H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
  buildHEarthAtmospherePresentation,
  evaluateHEarthAtmospherePresentation
} from '../../showroom/globe/h-earth/render/environment-atmosphere.js';
import {
  H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
  buildHEarthWaterPresentation,
  evaluateHEarthWaterPresentation
} from '../../showroom/globe/h-earth/render/environment-water.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_RUN_7H_v1';
export const H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_REVISION = 1;

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE = deepFreeze({
  contractId: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
  revision: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_REVISION,
  operation: 'AGGREGATION_AND_CORRESPONDENCE_ONLY',
  sourceContracts: {
    terrain: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    surface: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    atmosphere: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    water: H_EARTH_WATER_STATE_CONTRACT_ID,
    biome: H_EARTH_BIOME_FIELD_CONTRACT_ID,
    population: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    traversal: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
    lifecycle: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    atmospherePresentation: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
    waterPresentation: H_EARTH_WATER_PRESENTATION_CONTRACT_ID
  },
  ownership: {
    ownsAggregation: true,
    ownsCorrespondenceAudit: true,
    ownsTerrainTruth: false,
    ownsSurfaceTruth: false,
    ownsAtmosphereTruth: false,
    ownsWaterTruth: false,
    ownsBiomeTruth: false,
    ownsPopulationPlanning: false,
    ownsTraversalTruth: false,
    ownsSpatialLifecycleTruth: false,
    ownsCamera: false,
    ownsNavigation: false,
    ownsGeometry: false,
    ownsRenderer: false,
    ownsPublicRoute: false,
    ownsDeployment: false
  }
});

function reject(input, issues) {
  return deepFreeze({
    eligible: false,
    status: 'FUNCTIONAL_ENVIRONMENT_COMPOSITE_REJECTED',
    contractId: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
    input,
    issues
  });
}

export function buildHEarthFunctionalEnvironmentComposite({
  worldX,
  worldZ,
  observerWorld,
  lifecycleSubjectWorld = null,
  previousLifecycleState = null,
  visibilityClass = 'VISIBLE',
  importance = 0,
  memoryPressure = 0,
  viewportWidth = 640,
  viewportHeight = 360,
  cameraFarPlane = 512,
  renderSequence = 0,
  populationRadius = 48,
  populationSampleStep = 24,
  populationSeed = 'H_EARTH_RUN_7H_ROUTE_POPULATION_v1'
} = {}) {
  const input = {
    worldX, worldZ, observerWorld, lifecycleSubjectWorld,
    previousLifecycleState, viewportWidth, viewportHeight,
    cameraFarPlane, renderSequence
  };
  const issues = [];
  if (![worldX, worldZ, viewportWidth, viewportHeight, cameraFarPlane,
    renderSequence, populationRadius, populationSampleStep, importance,
    memoryPressure].every(finite)) {
    issues.push('COMPOSITE_NUMERIC_INPUT_NOT_FINITE');
  }
  if (!observerWorld || ![observerWorld.x, observerWorld.y, observerWorld.z].every(finite)) {
    issues.push('COMPOSITE_OBSERVER_WORLD_INVALID');
  }
  if (viewportWidth <= 0 || viewportHeight <= 0 || cameraFarPlane <= 0 ||
      populationRadius <= 0 || populationSampleStep <= 0 ||
      importance < 0 || importance > 1 || memoryPressure < 0 || memoryPressure > 1) {
    issues.push('COMPOSITE_INPUT_RANGE_INVALID');
  }
  if (issues.length > 0) return reject(input, issues);

  const atmosphere = sampleHEarthAtmosphereState();
  const terrain = sampleHEarthTerrainField(worldX, worldZ);
  const surface = sampleHEarthSurfaceState(worldX, worldZ);
  const water = sampleHEarthWaterState(worldX, worldZ, {
    atmosphereState: atmosphere,
    observerY: observerWorld.y
  });
  const biome = sampleHEarthBiomeField(worldX, worldZ, { atmosphereState: atmosphere });
  const traversal = sampleHEarthTraversalSurface(worldX, worldZ, { waterState: water });

  for (const [name, sample] of Object.entries({ atmosphere, terrain, surface, water, biome, traversal })) {
    if (sample?.valid !== true) issues.push(`UPSTREAM_SAMPLE_INVALID:${name}`);
  }
  if (issues.length > 0) return reject(input, issues);

  const subjectWorld = lifecycleSubjectWorld ?? {
    x: worldX,
    y: terrain.elevation,
    z: worldZ
  };
  const lifecycle = sampleHEarthSpatialLifecycle({
    subjectId: 'H_EARTH_RUN_7H_LOCAL_ENVIRONMENT_POPULATION',
    subjectWorld,
    observerWorld,
    boundsRadius: 24,
    previousState: previousLifecycleState,
    visibilityClass,
    importance,
    memoryPressure
  });
  const lifecycleContext = projectHEarthSpatialLifecycleToPopulationContext(lifecycle);
  if (lifecycle?.valid !== true) issues.push('SPATIAL_LIFECYCLE_INVALID');
  if (lifecycleContext?.eligible === false) issues.push('LIFECYCLE_POPULATION_CONTEXT_INVALID');
  if (issues.length > 0) return reject(input, issues);

  const population = planHEarthPopulation({
    bounds: {
      xMinimum: worldX - populationRadius,
      xMaximum: worldX + populationRadius,
      zMinimum: worldZ - populationRadius,
      zMaximum: worldZ + populationRadius
    },
    sampleStep: populationSampleStep,
    deterministicSeed: populationSeed,
    atmosphereState: atmosphere,
    spatialLifecycleContext: lifecycleContext
  });
  if (population?.eligible !== true) issues.push('POPULATION_PLAN_INVALID');

  const atmospherePresentation = buildHEarthAtmospherePresentation(atmosphere, {
    viewportWidth,
    viewportHeight,
    cameraFarPlane
  });
  const waterPresentation = buildHEarthWaterPresentation(water, {
    atmosphereState: atmosphere,
    timeSeconds: renderSequence / 30,
    cameraDistance: lifecycle.centerDistance,
    horizonDistance: cameraFarPlane
  });
  if (!evaluateHEarthAtmospherePresentation(atmospherePresentation).eligible) {
    issues.push('ATMOSPHERE_PRESENTATION_INVALID');
  }
  if (!evaluateHEarthWaterPresentation(waterPresentation).eligible) {
    issues.push('WATER_PRESENTATION_INVALID');
  }
  if (issues.length > 0) return reject(input, issues);

  const semanticCorrespondence = [
    surface.semanticAddressId,
    water.semanticAddressId,
    biome.semanticAddressId,
    traversal.semanticAddressId
  ].every((value) => value === surface.semanticAddressId) && [
    surface.chunkId,
    water.chunkId,
    biome.chunkId,
    traversal.chunkId
  ].every((value) => value === surface.chunkId);
  if (!semanticCorrespondence) {
    return reject(input, ['SEMANTIC_OR_CHUNK_CORRESPONDENCE_FAILED']);
  }

  return deepFreeze({
    eligible: true,
    status: 'FUNCTIONAL_ENVIRONMENT_COMPOSITE_COMPLETE',
    contractId: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
    revision: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_REVISION,
    world: { x: worldX, y: terrain.elevation, z: worldZ },
    observerWorld: { ...observerWorld },
    terrain,
    surface,
    atmosphere,
    water,
    biome,
    traversal,
    lifecycle,
    lifecyclePopulationContext: lifecycleContext,
    population,
    presentation: {
      atmosphere: atmospherePresentation,
      water: waterPresentation
    },
    correspondence: {
      semanticAddressId: surface.semanticAddressId,
      chunkId: surface.chunkId,
      formationIds: surface.formationIds,
      semanticCorrespondence,
      authorityCollapse: false
    },
    sourceIdentities: {
      ...H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE.sourceContracts,
      composite: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID
    },
    authority: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE.ownership,
    issues: []
  });
}

export function evaluateHEarthFunctionalEnvironmentComposite(composite) {
  const issues = [];
  if (composite?.eligible !== true) issues.push('COMPOSITE_NOT_ELIGIBLE');
  if (composite?.contractId !== H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID) {
    issues.push('COMPOSITE_CONTRACT_ID_MISMATCH');
  }
  if (composite?.correspondence?.semanticCorrespondence !== true) {
    issues.push('COMPOSITE_CORRESPONDENCE_NOT_PASSED');
  }
  if (composite?.correspondence?.authorityCollapse !== false) {
    issues.push('COMPOSITE_AUTHORITY_COLLAPSE');
  }
  if (composite?.population?.eligible !== true) issues.push('COMPOSITE_POPULATION_INVALID');
  if (composite?.lifecycle?.valid !== true) issues.push('COMPOSITE_LIFECYCLE_INVALID');
  if (composite?.authority?.ownsRenderer !== false ||
      composite?.authority?.ownsPublicRoute !== false ||
      composite?.authority?.ownsGeometry !== false) {
    issues.push('COMPOSITE_AUTHORITY_LEAK');
  }
  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'FUNCTIONAL_ENVIRONMENT_COMPOSITE_PASS'
      : 'FUNCTIONAL_ENVIRONMENT_COMPOSITE_FAIL',
    issues
  });
}

export default H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE;
