import { extractGRCRTerrainMetrics } from './h-earth.gratitude-region.coordinate-reconciliation.harness.mjs';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

export const H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION_v1',
  checkpointId: 'GR-CR-02A',
  status: 'COAST_ANCHOR_SAMPLE_ENABLED',
  completedMicroCheckpoints: freeze(['GR-CR-02A']),
  finalCoordinatesAssigned: false,
  terrainMutation: false,
  geometryConstruction: false
});

export function sampleGRCREntryCoastAnchor() {
  const waypoint = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST;
  const terrain = extractGRCRTerrainMetrics(waypoint.position.x, waypoint.position.z);
  return freeze({
    checkpointId: 'GR-CR-02A',
    navigationContractId: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
    eyeHeight: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.eyeHeight,
    waypoint,
    terrain,
    eligible: terrain.valid === true,
    finalCoordinate: false
  });
}

export default H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION;
