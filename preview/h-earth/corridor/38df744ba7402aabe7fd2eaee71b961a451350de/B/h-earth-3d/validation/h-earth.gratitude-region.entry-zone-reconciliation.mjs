import crypto from 'node:crypto';
import {
  deriveGRCRCandidateEnvelope,
  extractGRCRTerrainMetrics,
  resolveGRCRFormationMembership,
  resolveGRCRSemanticAddressProjection
} from './h-earth.gratitude-region.coordinate-reconciliation.harness.mjs';
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
const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
const digest = (value) => crypto.createHash('sha256').update(stable(value)).digest('hex');
const keyOf = (x, z) => `${x},${z}`;

export const H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION_v1',
  checkpointId: 'GR-CR-02H',
  status: 'ENTRY_ZONE_SECTION_EXECUTION_ENABLED',
  completedMicroCheckpoints: freeze(['GR-CR-02A', 'GR-CR-02B', 'GR-CR-02C', 'GR-CR-02D', 'GR-CR-02E', 'GR-CR-02F', 'GR-CR-02G', 'GR-CR-02H']),
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
    let nearest = previous.valid ? { z: previous.world.z, elevation: previous.elevation, distance: Math.abs(previous.elevation - seaLevel) } : null;
    const candidates = [];
    for (let z = landwardZ + zStep; z <= waterwardZ; z += zStep) {
      const current = extractGRCRTerrainMetrics(x, z);
      if (current.valid) {
        const distance = Math.abs(current.elevation - seaLevel);
        if (!nearest || distance < nearest.distance || (distance === nearest.distance && current.world.z > nearest.z)) nearest = { z: current.world.z, elevation: current.elevation, distance };
      }
      if (!previous.valid || !current.valid) { previous = current; continue; }
      if (previous.elevation > seaLevel && current.elevation <= seaLevel) {
        const denominator = current.elevation - previous.elevation;
        const fraction = denominator === 0 ? 0 : (seaLevel - previous.elevation) / denominator;
        candidates.push(freeze({ x, z: previous.world.z + fraction * (current.world.z - previous.world.z), seaLevel, method: 'WATERWARD_MOST_ZERO_CROSSING_INTERPOLATION', landElevation: previous.elevation, waterElevation: current.elevation }));
      }
      previous = current;
    }
    const crossing = candidates.sort((left, right) => right.z - left.z)[0]
      ?? (nearest ? freeze({ x, z: nearest.z, seaLevel, method: 'NEAREST_SEA_LEVEL_SAMPLE', sampleElevation: nearest.elevation, absoluteSeaLevelDistance: nearest.distance }) : null);
    traces.push(freeze({ x, crossing, zeroCrossingCandidateCount: candidates.length }));
  }
  const crossings = traces.filter((entry) => entry.crossing !== null).map((entry) => entry.crossing).sort((a, b) => a.x - b.x);
  return freeze({ checkpointId: 'GR-CR-02C', eligible: crossings.length >= 3, traceCount: traces.length, crossingCount: crossings.length, exactCrossingCount: crossings.filter((entry) => entry.method === 'WATERWARD_MOST_ZERO_CROSSING_INTERPOLATION').length, approximateCrossingCount: crossings.filter((entry) => entry.method === 'NEAREST_SEA_LEVEL_SAMPLE').length, crossings: freeze(crossings), unresolvedX: freeze(traces.filter((entry) => entry.crossing === null).map((entry) => entry.x)), selectionRule: 'WATERWARD_MOST_POSITIVE_TO_NONPOSITIVE_SEA_LEVEL_CROSSING', finalBoundary: false });
}

function interpolateTraceZ(trace, x) {
  if (!Array.isArray(trace) || trace.length === 0) return Number.NaN;
  if (x <= trace[0].x) return trace[0].z;
  if (x >= trace[trace.length - 1].x) return trace[trace.length - 1].z;
  for (let index = 1; index < trace.length; index += 1) {
    const right = trace[index];
    const left = trace[index - 1];
    if (x <= right.x) {
      const t = (x - left.x) / (right.x - left.x);
      return left.z + (right.z - left.z) * t;
    }
  }
  return trace[trace.length - 1].z;
}

export function deriveGRCREntryWaterwardExclusion(shoreline = traceGRCREntryShoreline(), { landwardSafetyBuffer = 2 } = {}) {
  if (shoreline.eligible !== true || shoreline.crossings.length === 0) return freeze({ checkpointId: 'GR-CR-02D', eligible: false, status: 'SHORELINE_REQUIRED', issues: freeze(['SHORELINE_TRACE_INELIGIBLE']) });
  const trace = shoreline.crossings.map((crossing) => freeze({ x: crossing.x, shorelineZ: crossing.z, z: crossing.z - landwardSafetyBuffer, sourceMethod: crossing.method }));
  const zs = trace.map((point) => point.z);
  const shorelineZs = trace.map((point) => point.shorelineZ);
  const referenceX = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST.position.x;
  return freeze({ checkpointId: 'GR-CR-02D', eligible: true, status: 'WATERWARD_EXCLUSION_TRACE_DERIVED_NONFINAL', waterwardDirection: 'INCREASING_WORLD_Z', exclusionTrace: freeze(trace), referenceAtCoast: freeze({ x: referenceX, exclusionStartZ: interpolateTraceZ(trace, referenceX) }), xRange: freeze({ minimum: trace[0].x, maximum: trace[trace.length - 1].x }), exclusionZRange: freeze({ minimum: Math.min(...zs), maximum: Math.max(...zs) }), shorelineZRange: freeze({ minimum: Math.min(...shorelineZs), maximum: Math.max(...shorelineZs) }), landwardSafetyBuffer, accepted: false, finalBoundary: false, issues: freeze([]) });
}

export function searchGRCREntrySafeOrientationSurface({ radius = 24, step = 4, maximumSlope = 0.6, maximumNeighborElevationDelta = 4, minimumElevationAboveSea = 0.25 } = {}) {
  const coast = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST;
  const exclusion = deriveGRCREntryWaterwardExclusion();
  if (!exclusion.eligible) return freeze({ checkpointId: 'GR-CR-02E', eligible: false, status: 'WATERWARD_EXCLUSION_REQUIRED', samples: freeze([]), issues: freeze(['WATERWARD_EXCLUSION_INELIGIBLE']) });
  const seaLevel = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.seaLevelY;
  const points = new Map();
  for (let z = coast.position.z - radius; z <= coast.position.z + radius; z += step) {
    for (let x = coast.position.x - radius; x <= coast.position.x + radius; x += step) {
      if (Math.hypot(x - coast.position.x, z - coast.position.z) > radius + 1e-8) continue;
      const metrics = extractGRCRTerrainMetrics(x, z);
      const localExclusionStartZ = interpolateTraceZ(exclusion.exclusionTrace, x);
      if (!metrics.valid || metrics.elevation < seaLevel + minimumElevationAboveSea || metrics.slope > maximumSlope || !Number.isFinite(localExclusionStartZ) || z >= localExclusionStartZ) continue;
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
      if (visited.has(key) || Math.abs(neighbor.elevation - current.elevation) > maximumNeighborElevationDelta) continue;
      visited.set(key, neighbor);
      queue.push(neighbor);
    }
  }
  const samples = [...visited.values()].sort((a, b) => a.world.z - b.world.z || a.world.x - b.world.x);
  return freeze({ checkpointId: 'GR-CR-02E', eligible: samples.length >= 5, status: samples.length >= 5 ? 'SAFE_ORIENTATION_SURFACE_DERIVED_NONFINAL' : 'SAFE_ORIENTATION_SURFACE_INSUFFICIENT', orientationBasis: freeze({ yawDegrees: coast.yawDegrees, pitchDegrees: coast.pitchDegrees, eyeHeight: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.eyeHeight }), centerAnchor: freeze({ ...coast.position }), radius, step, maximumSlope, minimumElevationAboveSea, referenceWaterwardExclusionStartZ: exclusion.referenceAtCoast.exclusionStartZ, sampleCount: samples.length, samples: freeze(samples), accepted: false, finalBoundary: false, issues: freeze(samples.length >= 5 ? [] : ['INSUFFICIENT_SAFE_SURFACE']) });
}

export function identifyGRCREntryFirstLawfulInlandExit({ sampleSpacing = 2, minimumInlandDistance = 12, maximumSlope = 0.65, minimumElevationAboveSea = 0.25 } = {}) {
  const coast = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST;
  const berm = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.BERM;
  const seaLevel = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.seaLevelY;
  const distance = Math.hypot(berm.position.x - coast.position.x, berm.position.z - coast.position.z);
  const segments = Math.max(1, Math.ceil(distance / sampleSpacing));
  const pathSamples = [];
  let exit = null;
  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const x = coast.position.x + (berm.position.x - coast.position.x) * t;
    const z = coast.position.z + (berm.position.z - coast.position.z) * t;
    const metrics = extractGRCRTerrainMetrics(x, z);
    const traveled = distance * t;
    const lawful = metrics.valid === true && metrics.elevation >= seaLevel + minimumElevationAboveSea && metrics.slope <= maximumSlope;
    const sample = freeze({ index, t, traveled, x, z, lawful, metrics });
    pathSamples.push(sample);
    if (!exit && traveled >= minimumInlandDistance && lawful) exit = sample;
  }
  return freeze({ checkpointId: 'GR-CR-02F', eligible: exit !== null, status: exit ? 'FIRST_LAWFUL_INLAND_EXIT_DERIVED_NONFINAL' : 'NO_LAWFUL_INLAND_EXIT_FOUND', coastAnchor: freeze({ ...coast.position }), bermAnchor: freeze({ ...berm.position }), pathLength: distance, sampleSpacing, pathSampleCount: pathSamples.length, pathSamples: freeze(pathSamples), firstLawfulExit: exit, accepted: false, finalCoordinate: false, issues: freeze(exit ? [] : ['NO_LAWFUL_INLAND_EXIT']) });
}

export function deriveGRCREntryCandidateEnvelope() {
  const coast = sampleGRCREntryCoastAnchor();
  const berm = sampleGRCREntryBermAnchor();
  const shoreline = traceGRCREntryShoreline();
  const exclusion = deriveGRCREntryWaterwardExclusion(shoreline);
  const safe = searchGRCREntrySafeOrientationSurface();
  const inland = identifyGRCREntryFirstLawfulInlandExit();
  const samplesByKey = new Map();
  for (const sample of safe.samples ?? []) samplesByKey.set(keyOf(sample.world.x, sample.world.z), sample);
  for (const sample of inland.pathSamples ?? []) if (sample.lawful && sample.metrics?.valid) samplesByKey.set(keyOf(sample.metrics.world.x, sample.metrics.world.z), sample.metrics);
  if (berm.terrain?.valid) samplesByKey.set(keyOf(berm.terrain.world.x, berm.terrain.world.z), berm.terrain);
  const samples = [...samplesByKey.values()].sort((a, b) => a.world.z - b.world.z || a.world.x - b.world.x);
  const surface = freeze({ eligible: samples.length > 0, step: 4, samples: freeze(samples) });
  const envelope = deriveGRCRCandidateEnvelope(surface, { envelopeId: 'GRATITUDE_REGION_ENTRY_ZONE_CANDIDATE_01', selfTestOnly: false });
  const centerMembership = envelope.eligible ? resolveGRCRFormationMembership(envelope.center.x, envelope.center.z) : null;
  const centerProjection = envelope.eligible ? resolveGRCRSemanticAddressProjection(envelope.center.x, envelope.center.z) : null;
  const candidate = freeze({
    checkpointId: 'GR-CR-02G',
    candidateClass: 'MEASURED_OR_DERIVED_CANDIDATE_PENDING_LATER_MANIFEST_ACCEPTANCE',
    eligible: [coast.eligible, berm.eligible, shoreline.eligible, exclusion.eligible, safe.eligible, inland.eligible, envelope.eligible].every(Boolean),
    accepted: false,
    finalCoordinatesAssigned: false,
    coastAnchor: coast,
    bermAnchor: berm,
    shorelineSummary: freeze({ traceCount: shoreline.traceCount, crossingCount: shoreline.crossingCount, exactCrossingCount: shoreline.exactCrossingCount, approximateCrossingCount: shoreline.approximateCrossingCount, selectionRule: shoreline.selectionRule }),
    waterwardExclusion: exclusion,
    safeOrientationSummary: freeze({ sampleCount: safe.sampleCount, orientationBasis: safe.orientationBasis, maximumSlope: safe.maximumSlope, referenceWaterwardExclusionStartZ: safe.referenceWaterwardExclusionStartZ }),
    firstLawfulInlandExit: inland.firstLawfulExit,
    beachExtent: freeze({ xRange: exclusion.xRange, landwardReferenceZ: H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.BERM.position.z, waterwardBoundaryTrace: exclusion.exclusionTrace }),
    envelope,
    centerFormationMembership: centerMembership,
    centerSemanticProjection: centerProjection,
    terrainMutation: false,
    geometryConstruction: false,
    issues: freeze([])
  });
  return freeze({ ...candidate, candidateDigest: digest(candidate) });
}

export function executeGRCREntryZoneSection() {
  const first = deriveGRCREntryCandidateEnvelope();
  const second = deriveGRCREntryCandidateEnvelope();
  const firstDigest = digest(first);
  const secondDigest = digest(second);
  const issues = [];
  if (!first.eligible) issues.push('ENTRY_CANDIDATE_INELIGIBLE');
  if (firstDigest !== secondDigest) issues.push('ENTRY_SECTION_NONDETERMINISTIC');
  if (first.accepted !== false || first.finalCoordinatesAssigned !== false) issues.push('ENTRY_CANDIDATE_AUTHORITY_OVERREACH');
  return freeze({ schemaVersion: 'H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION_RECEIPT_v1', checkpointId: 'GR-CR-02H', sectionId: 'GR-CR-02_ENTRY_ZONE', eligible: issues.length === 0, status: issues.length === 0 ? 'GR_CR_02H_ENTRY_ZONE_PASS' : 'GR_CR_02H_ENTRY_ZONE_FAIL', sectionStatus: issues.length === 0 ? 'PASS_CLOSED' : 'FAIL_STOPPED', completedMicroCheckpoints: freeze(['02A', '02B', '02C', '02D', '02E', '02F', '02G', '02H']), firstExecutionDigest: firstDigest, secondExecutionDigest: secondDigest, deterministicRepeatExecution: firstDigest === secondDigest, evidence: first, entryZoneMeasurementExecuted: true, areaCandidateCoordinatesDerived: true, finalCoordinatesAssigned: false, nextSection: 'GR-CR-03_MIRROR_MANOR', terrainMutation: false, geometryConstruction: false, runtimeMutation: false, gameplayMutation: false, publicRouteMutation: false, productionMutation: false, controllingManifestMutation: false, issues: freeze(issues) });
}

export default H_EARTH_GRATITUDE_REGION_ENTRY_ZONE_RECONCILIATION;
