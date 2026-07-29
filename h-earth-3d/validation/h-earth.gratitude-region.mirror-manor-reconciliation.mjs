import crypto from 'node:crypto';
import {
  deriveGRCRCandidateEnvelope,
  evaluateGRCRTerrainSightline,
  extractGRCRTerrainMetrics,
  resolveGRCRFormationMembership,
  resolveGRCRSemanticAddressProjection,
  searchGRCRConnectedSurface
} from './h-earth.gratitude-region.coordinate-reconciliation.harness.mjs';
import { identifyGRCREntryFirstLawfulInlandExit } from './h-earth.gratitude-region.entry-zone-reconciliation.mjs';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS } from '../../showroom/globe/h-earth/functional-landscape/navigation.js';

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
const round = (value, digits = 9) => Number(value.toFixed(digits));

const SEARCH = freeze({ xMinimum: 24, xMaximum: 176, zMinimum: -236, zMaximum: -132, step: 4 });
const BEACH_TARGET = freeze({ ...H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST.position });
const MOUNTAIN_TARGET = freeze({ x: -96, z: -264 });
const SUPPLIED_HILL_ADDRESSES = freeze(['H_EARTH_GROUND_CELL_001:R06:C11', 'H_EARTH_GROUND_CELL_001:R06:C12']);

export const H_EARTH_GRATITUDE_REGION_MIRROR_MANOR_RECONCILIATION = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_MIRROR_MANOR_RECONCILIATION_v1',
  checkpointId: 'GR-CR-03H',
  status: 'MIRROR_MANOR_SECTION_EXECUTION_ENABLED',
  completedMicroCheckpoints: freeze(['GR-CR-03A', 'GR-CR-03B', 'GR-CR-03C', 'GR-CR-03D', 'GR-CR-03E', 'GR-CR-03F', 'GR-CR-03G', 'GR-CR-03H']),
  candidateClass: 'MEASURED_OR_DERIVED_CANDIDATE_PENDING_LATER_MANIFEST_ACCEPTANCE',
  accepted: false,
  finalCoordinatesAssigned: false,
  terrainMutation: false,
  geometryConstruction: false
});

function sampleSearchFrame() {
  const samples = [];
  for (let z = SEARCH.zMinimum; z <= SEARCH.zMaximum; z += SEARCH.step) {
    for (let x = SEARCH.xMinimum; x <= SEARCH.xMaximum; x += SEARCH.step) {
      const metrics = extractGRCRTerrainMetrics(x, z);
      if (metrics.valid) samples.push(metrics);
    }
  }
  samples.sort((a, b) => a.world.z - b.world.z || a.world.x - b.world.x);
  return freeze({
    checkpointId: 'GR-CR-03A',
    eligible: samples.length > 0,
    status: samples.length > 0 ? 'MANOR_SEARCH_FRAME_SAMPLED' : 'MANOR_SEARCH_FRAME_EMPTY',
    searchBounds: SEARCH,
    suppliedSemanticHillAddresses: SUPPLIED_HILL_ADDRESSES,
    sampleCount: samples.length,
    samples: freeze(samples),
    issues: freeze(samples.length > 0 ? [] : ['NO_VALID_SEARCH_SAMPLES'])
  });
}

function traceLine(from, to, spacing = 2) {
  const distance = Math.hypot(to.x - from.x, to.z - from.z);
  const segments = Math.max(1, Math.ceil(distance / spacing));
  const samples = [];
  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const x = from.x + (to.x - from.x) * t;
    const z = from.z + (to.z - from.z) * t;
    const metrics = extractGRCRTerrainMetrics(x, z);
    if (metrics.valid) samples.push(freeze({ index, t, metrics }));
  }
  return freeze(samples);
}

function identifyPeakCandidates(frame) {
  const byKey = new Map(frame.samples.map((sample) => [keyOf(sample.world.x, sample.world.z), sample]));
  const offsets = [-SEARCH.step, 0, SEARCH.step];
  const peaks = [];
  for (const sample of frame.samples) {
    const onSearchBoundary = sample.world.x === SEARCH.xMinimum || sample.world.x === SEARCH.xMaximum || sample.world.z === SEARCH.zMinimum || sample.world.z === SEARCH.zMaximum;
    if (onSearchBoundary || sample.elevation < 6 || sample.slope > 1.25) continue;
    const neighbors = [];
    for (const dx of offsets) for (const dz of offsets) {
      if (dx === 0 && dz === 0) continue;
      const neighbor = byKey.get(keyOf(sample.world.x + dx, sample.world.z + dz));
      if (neighbor) neighbors.push(neighbor);
    }
    const maximumNeighbor = neighbors.length > 0 ? Math.max(...neighbors.map((entry) => entry.elevation)) : sample.elevation;
    const localProminence = sample.elevation - maximumNeighbor;
    if (localProminence >= -0.75) peaks.push(freeze({ ...sample, localProminence }));
  }
  if (peaks.length < 2) {
    return freeze([...frame.samples]
      .filter((sample) => sample.elevation >= 4 && sample.slope <= 1.5)
      .sort((a, b) => b.elevation - a.elevation || a.world.x - b.world.x || a.world.z - b.world.z)
      .slice(0, 24)
      .map((sample) => freeze({ ...sample, localProminence: 0 })));
  }
  return freeze(peaks.sort((a, b) => b.elevation - a.elevation || a.world.x - b.world.x || a.world.z - b.world.z));
}

function evaluatePair(leftInput, rightInput) {
  const left = leftInput.world.x <= rightInput.world.x ? leftInput : rightInput;
  const right = leftInput.world.x <= rightInput.world.x ? rightInput : leftInput;
  const distance = Math.hypot(right.world.x - left.world.x, right.world.z - left.world.z);
  if (distance < 16 || distance > 96) return null;
  const crossSection = traceLine(left.world, right.world, 2);
  if (crossSection.length < 3) return null;
  const saddle = [...crossSection].sort((a, b) => a.metrics.elevation - b.metrics.elevation || Math.abs(a.t - 0.5) - Math.abs(b.t - 0.5))[0];
  const lowerPeak = Math.min(left.elevation, right.elevation);
  const drop = lowerPeak - saddle.metrics.elevation;
  const midpoint = { x: (left.world.x + right.world.x) / 2, z: (left.world.z + right.world.z) / 2 };
  const midpointDistance = Math.hypot(saddle.metrics.world.x - midpoint.x, saddle.metrics.world.z - midpoint.z);
  const score = drop * 12 + Math.min(distance, 64) * 0.18 + lowerPeak * 0.2 - midpointDistance * 0.35 - Math.abs(left.world.z - right.world.z) * 0.08;
  return freeze({ left, right, distance, lowerPeakElevation: lowerPeak, crossSection, saddle, drop, midpoint: freeze(midpoint), score });
}

function deriveSuppliedSemanticPair(frame) {
  const buckets = new Map(SUPPLIED_HILL_ADDRESSES.map((address) => [address, []]));
  for (const sample of frame.samples) {
    const projection = resolveGRCRSemanticAddressProjection(sample.world.x, sample.world.z);
    const selected = projection.valid ? projection.selectedSemanticAddressId : null;
    if (selected && buckets.has(selected)) buckets.get(selected).push(freeze({ sample, projection }));
  }
  const selectedPeaks = SUPPLIED_HILL_ADDRESSES.map((address) => {
    const candidates = buckets.get(address)
      .filter((entry) => entry.sample.slope <= 1.5)
      .sort((a, b) => b.sample.elevation - a.sample.elevation || a.sample.slope - b.sample.slope || a.sample.world.x - b.sample.world.x || a.sample.world.z - b.sample.world.z);
    return candidates[0] ?? null;
  });
  const pair = selectedPeaks.every(Boolean) ? evaluatePair(selectedPeaks[0].sample, selectedPeaks[1].sample) : null;
  return freeze({
    eligible: pair !== null && pair.drop >= 0.25,
    basis: 'SUPPLIED_SEMANTIC_HILL_ADDRESS_PAIR',
    addresses: SUPPLIED_HILL_ADDRESSES,
    addressCandidateCounts: freeze(Object.fromEntries(SUPPLIED_HILL_ADDRESSES.map((address) => [address, buckets.get(address).length]))),
    selectedAddressPeaks: freeze(selectedPeaks),
    pair,
    issues: freeze(pair && pair.drop >= 0.25 ? [] : ['SUPPLIED_SEMANTIC_PAIR_NOT_TERRAIN_ELIGIBLE'])
  });
}

function deriveHillPair(frame) {
  const supplied = deriveSuppliedSemanticPair(frame);
  const peaks = identifyPeakCandidates(frame).slice(0, 48);
  const pairs = [];
  if (supplied.eligible) pairs.push(freeze({ ...supplied.pair, selectionBasis: supplied.basis }));
  if (!supplied.eligible) {
    for (let leftIndex = 0; leftIndex < peaks.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < peaks.length; rightIndex += 1) {
        const pair = evaluatePair(peaks[leftIndex], peaks[rightIndex]);
        if (pair && pair.drop >= 0.5) pairs.push(freeze({ ...pair, selectionBasis: 'BROAD_TERRAIN_DERIVED_FALLBACK' }));
      }
    }
  }
  if (pairs.length === 0) {
    const interiorSamples = frame.samples.filter((sample) => sample.world.x > SEARCH.xMinimum && sample.world.x < SEARCH.xMaximum && sample.world.z > SEARCH.zMinimum && sample.world.z < SEARCH.zMaximum);
    const left = [...interiorSamples].filter((sample) => sample.world.x <= 96).sort((a, b) => b.elevation - a.elevation || a.world.x - b.world.x)[0] ?? null;
    const right = [...interiorSamples].filter((sample) => sample.world.x > 96).sort((a, b) => b.elevation - a.elevation || a.world.x - b.world.x)[0] ?? null;
    const fallback = left && right ? evaluatePair(left, right) : null;
    if (fallback) pairs.push(freeze({ ...fallback, selectionBasis: 'BROAD_TERRAIN_MAXIMA_LAST_RESORT' }));
  }
  pairs.sort((a, b) => {
    const basisDifference = (a.selectionBasis === supplied.basis ? 0 : 1) - (b.selectionBasis === supplied.basis ? 0 : 1);
    return basisDifference || b.score - a.score || a.left.world.x - b.left.world.x || a.right.world.x - b.right.world.x;
  });
  const selected = pairs[0] ?? null;
  return freeze({
    checkpointId: 'GR-CR-03B',
    eligible: selected !== null,
    status: selected ? 'TWO_HILL_ENCLOSURE_DERIVED_NONFINAL' : 'TWO_HILL_ENCLOSURE_NOT_FOUND',
    suppliedSemanticEvidence: supplied,
    peakCandidateCount: peaks.length,
    pairCandidateCount: pairs.length,
    selectedPair: selected,
    selectionBasis: selected?.selectionBasis ?? null,
    accepted: false,
    finalHillIdentity: false,
    issues: freeze(selected ? [] : ['NO_ELIGIBLE_HILL_PAIR'])
  });
}

function deriveLowCorridor(hillPair) {
  if (!hillPair.eligible) return freeze({ checkpointId: 'GR-CR-03C', eligible: false, status: 'HILL_PAIR_REQUIRED', issues: freeze(['HILL_PAIR_REQUIRED']) });
  const pair = hillPair.selectedPair;
  const dx = pair.right.world.x - pair.left.world.x;
  const dz = pair.right.world.z - pair.left.world.z;
  const length = Math.max(1e-9, Math.hypot(dx, dz));
  const pairAxis = freeze({ x: dx / length, z: dz / length });
  const corridorAxis = freeze({ x: -pairAxis.z, z: pairAxis.x });
  const origin = pair.saddle.metrics.world;
  const trace = [];
  for (let offset = -48; offset <= 48; offset += 4) {
    const x = origin.x + corridorAxis.x * offset;
    const z = origin.z + corridorAxis.z * offset;
    const metrics = extractGRCRTerrainMetrics(x, z);
    if (metrics.valid) trace.push(freeze({ offset, metrics }));
  }
  const elevations = trace.map((entry) => entry.metrics.elevation);
  return freeze({
    checkpointId: 'GR-CR-03C',
    eligible: trace.length >= 5,
    status: trace.length >= 5 ? 'LOW_CORRIDOR_TRACE_DERIVED_NONFINAL' : 'LOW_CORRIDOR_TRACE_INSUFFICIENT',
    origin: freeze({ x: origin.x, z: origin.z, elevation: origin.elevation }),
    pairAxis,
    corridorAxis,
    trace: freeze(trace),
    traceElevationRange: freeze({ minimum: elevations.length ? Math.min(...elevations) : null, maximum: elevations.length ? Math.max(...elevations) : null }),
    noBuildHalfWidth: 6,
    accepted: false,
    finalCenterline: false,
    issues: freeze(trace.length >= 5 ? [] : ['INSUFFICIENT_CORRIDOR_TRACE'])
  });
}

function projectLocal(corridor, world) {
  const dx = world.x - corridor.origin.x;
  const dz = world.z - corridor.origin.z;
  return freeze({
    acrossCorridor: dx * corridor.pairAxis.x + dz * corridor.pairAxis.z,
    alongCorridor: dx * corridor.corridorAxis.x + dz * corridor.corridorAxis.z
  });
}

function evaluateApproach(to) {
  const entry = identifyGRCREntryFirstLawfulInlandExit();
  const from = entry.firstLawfulExit ? { x: entry.firstLawfulExit.x, z: entry.firstLawfulExit.z } : BEACH_TARGET;
  const samples = traceLine(from, to, 4);
  let maximumSlope = 0;
  let maximumNeighborDelta = 0;
  let previous = null;
  let lawfulCount = 0;
  for (const sample of samples) {
    maximumSlope = Math.max(maximumSlope, sample.metrics.slope);
    if (previous) maximumNeighborDelta = Math.max(maximumNeighborDelta, Math.abs(sample.metrics.elevation - previous.metrics.elevation));
    if (sample.metrics.elevation > -0.25 && sample.metrics.slope <= 1.1) lawfulCount += 1;
    previous = sample;
  }
  const eligible = samples.length >= 4 && lawfulCount === samples.length && maximumNeighborDelta <= 16;
  return freeze({ checkpointId: 'GR-CR-03F', eligible, status: eligible ? 'APPROACH_CORRIDOR_DERIVED_NONFINAL' : 'APPROACH_CORRIDOR_HELD', from: freeze(from), to: freeze(to), sampleCount: samples.length, lawfulSampleCount: lawfulCount, maximumSlope, maximumNeighborElevationDelta: maximumNeighborDelta, samples, accepted: false, finalRoute: false });
}

function evaluateFootprint(center, corridor, width, depth, step = 4) {
  const samples = [];
  let corridorConflictCount = 0;
  for (let z = center.z - depth / 2; z <= center.z + depth / 2 + 1e-8; z += step) {
    for (let x = center.x - width / 2; x <= center.x + width / 2 + 1e-8; x += step) {
      const metrics = extractGRCRTerrainMetrics(x, z);
      if (!metrics.valid) continue;
      const local = projectLocal(corridor, metrics.world);
      if (Math.abs(local.acrossCorridor) < corridor.noBuildHalfWidth) corridorConflictCount += 1;
      samples.push(metrics);
    }
  }
  const elevations = samples.map((sample) => sample.elevation);
  const slopes = samples.map((sample) => sample.slope);
  const expected = (Math.floor(width / step) + 1) * (Math.floor(depth / step) + 1);
  const elevationRange = elevations.length ? Math.max(...elevations) - Math.min(...elevations) : Number.POSITIVE_INFINITY;
  const maximumSlope = slopes.length ? Math.max(...slopes) : Number.POSITIVE_INFINITY;
  const compatible = samples.length === expected && corridorConflictCount === 0 && elevationRange <= 10 && maximumSlope <= 0.9;
  return freeze({ width, depth, sampleCount: samples.length, expectedSampleCount: expected, elevationRange, maximumSlope, corridorConflictCount, compatible, finalFootprint: false });
}

function deriveSiteCandidates(frame, hillPair, corridor) {
  if (!hillPair.eligible || !corridor.eligible) return freeze({ checkpointId: 'GR-CR-03D', eligible: false, status: 'HILL_AND_CORRIDOR_REQUIRED', candidates: freeze([]), issues: freeze(['HILL_AND_CORRIDOR_REQUIRED']) });
  const pair = hillPair.selectedPair;
  const halfDistance = pair.distance / 2;
  const strict = [];
  const relaxed = [];
  for (const sample of frame.samples) {
    if (sample.world.z < -220) continue;
    const local = projectLocal(corridor, sample.world);
    if (Math.abs(local.acrossCorridor) > Math.max(8, halfDistance - 6) || Math.abs(local.alongCorridor) > 36) continue;
    if (Math.abs(local.acrossCorridor) < corridor.noBuildHalfWidth) continue;
    if (sample.elevation < corridor.origin.elevation + 0.25) continue;
    const base = freeze({ sample, local });
    if (sample.slope <= 0.58 && sample.elevation <= Math.max(pair.left.elevation, pair.right.elevation) + 2) strict.push(base);
    if (sample.slope <= 0.9) relaxed.push(base);
  }
  const source = strict.length > 0 ? strict : relaxed;
  const evaluated = source.map((entry) => {
    const center = entry.sample.world;
    const connected = searchGRCRConnectedSurface({ centerX: center.x, centerZ: center.z, radius: 16, step: 4, maximumSlope: 0.9, maximumNeighborElevationDelta: 8 });
    const beachward = evaluateGRCRTerrainSightline({ from: center, to: BEACH_TARGET, sampleCount: 32, endpointEyeHeight: 2.25, terrainClearance: 0.15 });
    const mountainward = evaluateGRCRTerrainSightline({ from: center, to: MOUNTAIN_TARGET, sampleCount: 32, endpointEyeHeight: 2.25, terrainClearance: 0.15 });
    const approach = evaluateApproach(center);
    const footprints = freeze([
      evaluateFootprint(center, corridor, 12, 12),
      evaluateFootprint(center, corridor, 20, 16),
      evaluateFootprint(center, corridor, 28, 20)
    ]);
    const compatibleFootprintCount = footprints.filter((item) => item.compatible).length;
    const clearSightlineCount = [beachward, mountainward].filter((item) => item.valid && item.clear).length;
    const score = (connected.eligible ? connected.sampleCount : 0)
      + (1 / (1 + entry.sample.slope)) * 20
      + Math.min(12, Math.max(0, entry.sample.elevation - corridor.origin.elevation))
      + clearSightlineCount * 10
      + (approach.eligible ? 8 : 0)
      + compatibleFootprintCount * 6
      - Math.abs(entry.local.alongCorridor) * 0.08;
    return freeze({ center: freeze({ x: center.x, z: center.z }), terrain: entry.sample, local: entry.local, connected, beachward, mountainward, approach, footprints, compatibleFootprintCount, clearSightlineCount, score });
  }).sort((a, b) => b.clearSightlineCount - a.clearSightlineCount || b.compatibleFootprintCount - a.compatibleFootprintCount || b.score - a.score || a.center.x - b.center.x || a.center.z - b.center.z);
  return freeze({
    checkpointId: 'GR-CR-03D',
    eligible: evaluated.length > 0,
    status: evaluated.length > 0 ? 'MANOR_SITE_SURFACES_DERIVED_NONFINAL' : 'NO_MANOR_SITE_SURFACE_FOUND',
    strictCandidateCount: strict.length,
    relaxedCandidateCount: relaxed.length,
    evaluatedCandidateCount: evaluated.length,
    candidates: freeze(evaluated.slice(0, 24)),
    issues: freeze(evaluated.length > 0 ? [] : ['NO_ELIGIBLE_SITE_SURFACE'])
  });
}

export function deriveGRCRMirrorManorCandidate() {
  const frame = sampleSearchFrame();
  const hillPair = deriveHillPair(frame);
  const corridor = deriveLowCorridor(hillPair);
  const sites = deriveSiteCandidates(frame, hillPair, corridor);
  const selected = sites.candidates[0] ?? null;
  const connected = selected?.connected?.eligible ? selected.connected : null;
  const envelope = connected ? deriveGRCRCandidateEnvelope(connected, { envelopeId: 'GRATITUDE_REGION_MIRROR_MANOR_SITE_ENVELOPE_CANDIDATE_01', selfTestOnly: false }) : freeze({ eligible: false, status: 'SELECTED_CONNECTED_SURFACE_REQUIRED', issues: freeze(['SELECTED_CONNECTED_SURFACE_REQUIRED']) });
  const centerFormation = envelope.eligible ? resolveGRCRFormationMembership(envelope.center.x, envelope.center.z) : null;
  const centerProjection = envelope.eligible ? resolveGRCRSemanticAddressProjection(envelope.center.x, envelope.center.z) : null;
  const issues = [];
  if (!frame.eligible) issues.push('SEARCH_FRAME_INELIGIBLE');
  if (!hillPair.eligible) issues.push('TWO_HILL_ENCLOSURE_INELIGIBLE');
  if (!corridor.eligible) issues.push('LOW_CORRIDOR_INELIGIBLE');
  if (!sites.eligible || !selected) issues.push('SITE_CANDIDATES_INELIGIBLE');
  if (!envelope.eligible) issues.push('SITE_ENVELOPE_INELIGIBLE');
  const candidate = freeze({
    checkpointId: 'GR-CR-03G',
    candidateId: 'GRATITUDE_REGION_MIRROR_MANOR_SITE_ENVELOPE_CANDIDATE_01',
    candidateClass: 'MEASURED_OR_DERIVED_CANDIDATE_PENDING_LATER_MANIFEST_ACCEPTANCE',
    eligible: issues.length === 0,
    accepted: false,
    finalPlacement: false,
    finalCoordinatesAssigned: false,
    searchFrameSummary: freeze({ bounds: SEARCH, sampleCount: frame.sampleCount }),
    hillPairSelectionBasis: hillPair.selectionBasis,
    hillPair: hillPair.selectedPair,
    lowCorridor: corridor,
    selectedSite: selected,
    envelope,
    centerFormationMembership: centerFormation,
    centerSemanticProjection: centerProjection,
    viewSummary: selected ? freeze({ clearSightlineCount: selected.clearSightlineCount, beachwardGroundViewStatus: selected.beachward.clear ? 'CLEAR' : 'OBSTRUCTED_NONFINAL', beachwardClear: selected.beachward.clear, beachwardMaximumObstruction: selected.beachward.maximumObstruction, mountainwardGroundViewStatus: selected.mountainward.clear ? 'CLEAR' : 'OBSTRUCTED_NONFINAL', mountainwardClear: selected.mountainward.clear, mountainwardMaximumObstruction: selected.mountainward.maximumObstruction }) : null,
    approachSummary: selected ? freeze({ eligible: selected.approach.eligible, sampleCount: selected.approach.sampleCount, maximumSlope: selected.approach.maximumSlope, maximumNeighborElevationDelta: selected.approach.maximumNeighborElevationDelta }) : null,
    footprintSummary: selected ? freeze(selected.footprints.map((footprint) => ({ width: footprint.width, depth: footprint.depth, compatible: footprint.compatible, elevationRange: round(footprint.elevationRange), maximumSlope: round(footprint.maximumSlope), corridorConflictCount: footprint.corridorConflictCount }))) : freeze([]),
    preservationRules: freeze(['MANOR_MUST_NOT_FILL_LOW_CORRIDOR', 'TWO_HILL_ENCLOSURE_MUST_REMAIN_LEGIBLE', 'BEACHWARD_AND_MOUNTAINWARD_RELATIONS_MUST_BE_PRESERVED', 'FINAL_SCALE_MUST_BE_DERIVED_FROM_SITE_CAPACITY']),
    terrainMutation: false,
    geometryConstruction: false,
    issues: freeze(issues)
  });
  return freeze({ ...candidate, candidateDigest: digest(candidate) });
}

export function executeGRCRMirrorManorSection() {
  const first = deriveGRCRMirrorManorCandidate();
  const second = deriveGRCRMirrorManorCandidate();
  const firstDigest = digest(first);
  const secondDigest = digest(second);
  const issues = [...first.issues];
  if (!first.eligible) issues.push('MIRROR_MANOR_CANDIDATE_INELIGIBLE');
  if (firstDigest !== secondDigest) issues.push('MIRROR_MANOR_SECTION_NONDETERMINISTIC');
  if (first.accepted !== false || first.finalPlacement !== false || first.finalCoordinatesAssigned !== false) issues.push('MIRROR_MANOR_AUTHORITY_OVERREACH');
  return freeze({
    schemaVersion: 'H_EARTH_GRATITUDE_REGION_MIRROR_MANOR_RECONCILIATION_RECEIPT_v1',
    checkpointId: 'GR-CR-03H',
    sectionId: 'GR-CR-03_MIRROR_MANOR',
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'GR_CR_03H_MIRROR_MANOR_PASS' : 'GR_CR_03H_MIRROR_MANOR_FAIL',
    sectionStatus: issues.length === 0 ? 'PASS_CLOSED' : 'FAIL_STOPPED',
    completedMicroCheckpoints: freeze(['03A', '03B', '03C', '03D', '03E', '03F', '03G', '03H']),
    firstExecutionDigest: firstDigest,
    secondExecutionDigest: secondDigest,
    deterministicRepeatExecution: firstDigest === secondDigest,
    evidence: first,
    mirrorManorMeasurementExecuted: true,
    mirrorManorCandidateDerived: true,
    mirrorManorCandidateAccepted: false,
    finalCoordinatesAssigned: false,
    nextSection: 'GR-CR-04_CAVERN_PRECINCT',
    terrainMutation: false,
    geometryConstruction: false,
    runtimeMutation: false,
    gameplayMutation: false,
    publicRouteMutation: false,
    productionMutation: false,
    controllingManifestMutation: false,
    issues: freeze(issues)
  });
}

export default H_EARTH_GRATITUDE_REGION_MIRROR_MANOR_RECONCILIATION;
