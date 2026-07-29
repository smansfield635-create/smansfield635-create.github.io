import { extractGRCRTerrainMetrics } from './h-earth.gratitude-region.coordinate-reconciliation.harness.mjs';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD } from '../terrain/h-earth.successor-terrain-field.run8b.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const keyOf = (x, z) => `${x},${z}`;

export const H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION_v1',
  checkpointId: 'GR-CR-02E',
  status: 'SAFE_ORIENTATION_SURFACE_SEARCH_ENABLED',
  completedMicroCheckpoints: freeze(['GR-CR-02A', 'GR-CR-02B', 'GR-CR-02C', 'GR-CR-02D', 'GR-CR-02E']),
  finalCoordinatesAssigned: false,
  terrainMutation: false,
  geometryConstruction: false
});

function sampleWaypoint(waypointId, checkpointId) {
  const waypoint = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[waypointId];
  const terrain = extractGRCRTerrainMetrics(waypoint.position.x, waypoint.position.z);
  return freeze({ checkpointId, navigationContractId: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID, eyeHeight: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.eyeHeight, waypoint, terrain, eligible: terrain.valid === true, finalCoordinate: false });
}

export const sampleGRCREntryCoastAnchor = () => sampleWaypoint('COAST', 'GR-CR-02A');
export const sampleGRCREntryBermAnchor = () => sampleWaypoint('BERM', 'GR-CR-02B');

export function traceGRCREntryShoreline({ xMinimum = -96, xMaximum = 96, xStep = 8, landwardZ = -120, waterwardZ = 20, zStep = 1 } = {}) {
  const seaLevel = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.seaLevelY;
  const traces = [];
  for (let x = xMinimum; x <= xMaximum; x += xStep) {
    let previous = extractGRCRTerrainMetrics(x, landwardZ);
    let crossing = null;
    for (let z = landwardZ + zStep; z <= waterwardZ; z += zStep) {
      const current = extractGRCRTerrainMetrics(x, z);
      if (!previous.valid || !current.valid) { previous = current; continue; }
      if (previous.elevation > seaLevel && current.elevation <= seaLevel) {
        const denominator = current.elevation - previous.elevation;
        const fraction = denominator === 0 ? 0 : (seaLevel - previous.elevation) / denominator;
        crossing = freeze({ x, z: previous.world.z + fraction * (current.world.z - previous.world.z), seaLevel, landElevation: previous.elevation, waterElevation: current.elevation });
        break;
      }
      previous = current;
    }
    traces.push(freeze({ x, crossing }));
  }
  const crossings = traces.filter((entry) => entry.crossing !== null).map((entry) => entry.crossing);
  return freeze({ checkpointId: 'GR-CR-02C', eligible: crossings.length >= 3, traceCount: traces.length, crossingCount: crossings.length, crossings: freeze(crossings), unresolvedX: freeze(traces.filter((entry) => entry.crossing === null).map((entry) => entry.x)), finalBoundary: false });
}

export function deriveGRCREntryWaterwardExclusion(shoreline = traceGRCREntryShoreline(), { landwardSafetyBuffer = 2 } = {}) {
  if (shoreline.eligible !== true || shoreline.crossings.length === 0) return freeze({ checkpointId: 'GR-CR-02D', eligible: false, status: 'SHORELINE_REQUIRED', issues: freeze(['SHORELINE_TRACE_INELIGIBLE']) });
  const zs = shoreline.crossings.map((crossing) => crossing.z);
  const xs = shoreline.crossings.map((crossing) => crossing.x);
  const exclusionStartZ = Math.min(...zs) - landwardSafetyBuffer;
  return freeze({ checkpointId: 'GR-CR-02D', eligible: true, status: 'WATERWARD_EXCLUSION_DERIVED_NONFINAL', waterwardDirection: 'INCREASING_WORLD_Z', exclusionRule: `WORLD_Z_GREATER_THAN_OR_EQUAL_TO_${exclusionStartZ}`, exclusionStartZ, xRange: freeze({ minimum: Math.min(...xs), maximum: Math.max(...xs) }), shorelineZRange: freeze({ minimum: Math.min(...zs), maximum: Math.max(...zs) }), landwardSafetyBuffer, accepted: false, finalBoundary: false, issues: freeze([]) });
}

export function searchGRCREntrySafeOrientationSurface({ radius = 24, step = 4, maximumSlope = 0.45, maximumNeighborElevationDelta = 3, minimumElevationAboveSea = 0.25 } = {}) {
  const coast = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST;
  const shoreline = traceGRCREntryShoreline();
  const exclusion = deriveGRCREntryWaterwardExclusion(shoreline);
  if (!exclusion.eligible) return freeze({ checkpointId: 'GR-CR-02E', eligible: false, status: 'WATERWARD_EXCLUSION_REQUIRED', samples: freeze([]), issues: freeze(['WATERWARD_EXCLUSION_INELIGIBLE']) });
  const seaLevel = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.seaLevelY;
  const points = new Map();
  for (let z = coast.position.z - radius; z <= coast.position.z + radius; z += step) {
    for (let x = coast.position.x - radius; x <= coast.position.x + radius; x += step) {
      if (Math.hypot(x - coast.position.x, z - coast.position.z) > radius + 1e-8) continue;
      const metrics = extractGRCRTerrainMetrics(x, z);
      if (!metrics.valid) continue;
      if (metrics.elevation < seaLevel + minimumElevationAboveSea) continue;
      if (metrics.slope > maximumSlope) continue;
      if (z >= exclusion.exclusionStartZ) continue;
      points.set(keyOf(x, z), metrics);
    }
  }
  const seed = points.get(keyOf(coast.position.x, coast.position.z)) ?? null;
  if (!seed) return freeze({ checkpointId: 'GR-CR-02E', eligible: false, status: 'COAST_SEED_NOT_SAFE', samples: freeze([]), issues: freeze(['COAST_SEED_INELIGIBLE']) });
  const visited = new Map([[keyOf(seed.world.x, seed.world.z), seed]]);
  const queue = [seed];
  const offsets = [[step, 0], [-step, 0], [0, step], [0, -step]];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const [dx, dz] of offsets) {
      const neighbor = points.get(keyOf(current.world.x + dx, current.world.z + dz));
      if (!neighbor) continue;
      const key = keyOf(neighbor.world.x, neighbor.world.z);
      if (visited.has(key)) continue;
      if (Math.abs(neighbor.elevation - current.elevation) > maximumNeighborElevationDelta) continue;
      visited.set(key, neighbor);
      queue.push(neighbor);
    }
  }
  const samples = [...visited.values()].sort((a, b) => a.world.z - b.world.z || a.world.x - b.world.x);
  return freeze({ checkpointId: 'GR-CR-02E', eligible: samples.length >= 5, status: samples.length >= 5 ? 'SAFE_ORIENTATION_SURFACE_DERIVED_NONFINAL' : 'SAFE_ORIENTATION_SURFACE_INSUFFICIENT', orientationBasis: freeze({ yawDegrees: coast.yawDegrees, pitchDegrees: coast.pitchDegrees, eyeHeight: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.eyeHeight }), centerAnchor: freeze({ ...coast.position }), radius, step, maximumSlope, minimumElevationAboveSea, waterwardExclusionStartZ: exclusion.exclusionStartZ, sampleCount: samples.length, samples: freeze(samples), accepted: false, finalBoundary: false, issues: freeze(samples.length >= 5 ? [] : ['INSUFFICIENT_SAFE_SURFACE']) });
}

export default H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION;
