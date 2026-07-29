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

export const H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION_v1',
  checkpointId: 'GR-CR-02C',
  status: 'LOCAL_SHORELINE_TRACE_ENABLED',
  completedMicroCheckpoints: freeze(['GR-CR-02A', 'GR-CR-02B', 'GR-CR-02C']),
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
      if (!previous.valid || !current.valid) {
        previous = current;
        continue;
      }
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

export default H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION;
