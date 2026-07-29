import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

import {
  createHEarthFunctionalLandscapeNavigationState
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import {
  deriveGRCRMirrorManorCandidate
} from './h-earth.gratitude-region.mirror-manor-reconciliation.mjs';

const BASE_MAIN_HEAD = '343b0c269dd343a57c6ecb7e785141134cc5660f';
const DISPOSITION_PATH =
  'h-earth-3d/control-plane/region-001-reconciliation/' +
  'h-earth.region-001.gratitude-region-final-spatial-placement-disposition.v1.json';
const MANOR_RECEIPT_PATH =
  'h-earth-3d/validation/' +
  'h-earth.gratitude-region.mirror-manor-reconciliation.receipt.v1.json';
const TEMPORARY_WORKFLOW_PATH =
  '.github/workflows/h-earth-gratitude-region-final-placement-freeze.yml';

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
    : `{${Object.keys(value).sort().map((key) =>
      `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;

const digest = (value) =>
  crypto.createHash('sha256').update(stable(value)).digest('hex');

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8' }).trim();

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

const gitBlob = (path) => git('hash-object', path);

const contains = (bounds, point) =>
  point.x >= bounds.xMinimum &&
  point.x <= bounds.xMaximum &&
  point.z >= bounds.zMinimum &&
  point.z <= bounds.zMaximum;

const exact = (left, right) => stable(left) === stable(right);

const uniqueSorted = (values) => [...new Set(values)].sort();

function executeFP00InputFreeze(disposition) {
  const issues = [];
  const actualHead = git('rev-parse', 'HEAD');
  const mergeBase = git('merge-base', 'HEAD', BASE_MAIN_HEAD);
  const changedPaths = uniqueSorted(
    git('diff', '--name-only', `${BASE_MAIN_HEAD}..HEAD`)
      .split('\n')
      .filter(Boolean)
  );
  const allowedPaths = new Set([
    ...disposition.plannedDurableCandidatePaths,
    TEMPORARY_WORKFLOW_PATH
  ]);

  const frozenInputs = disposition.frozenInputInventory.map((record) => {
    const exists = fs.existsSync(record.path);
    const actualBlob = exists ? gitBlob(record.path) : null;
    const matches = actualBlob === record.gitBlob;
    if (!exists) issues.push(`FROZEN_INPUT_MISSING:${record.path}`);
    else if (!matches) issues.push(
      `FROZEN_INPUT_BLOB_MISMATCH:${record.path}:${actualBlob}:${record.gitBlob}`
    );
    return freeze({
      scope: record.scope,
      path: record.path,
      expectedBlob: record.gitBlob,
      actualBlob,
      exists,
      matches
    });
  });

  if (mergeBase !== BASE_MAIN_HEAD) {
    issues.push(`BASE_MAIN_MERGE_BASE_MISMATCH:${mergeBase}`);
  }
  if (changedPaths.some((path) => !allowedPaths.has(path))) {
    issues.push(
      `UNAUTHORIZED_CHANGED_PATHS:${changedPaths
        .filter((path) => !allowedPaths.has(path)).join(',')}`
    );
  }

  const protectedPaths = new Set(
    disposition.frozenInputInventory.map((record) => record.path)
  );
  const protectedMutations = changedPaths.filter((path) => protectedPaths.has(path));
  if (protectedMutations.length > 0) {
    issues.push(`PRIOR_AUTHORITY_MUTATION:${protectedMutations.join(',')}`);
  }

  return freeze({
    checkpointId: 'FP-00',
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'FP_00_FREEZE_INPUT_AUTHORITY_PASS_CLOSED'
      : 'FP_00_FREEZE_INPUT_AUTHORITY_FAIL_STOPPED',
    baseMainHead: BASE_MAIN_HEAD,
    actualHead,
    mergeBase,
    frozenInputCount: frozenInputs.length,
    exactFrozenInputMatchCount:
      frozenInputs.filter((record) => record.matches).length,
    changedPaths,
    allowedPaths: uniqueSorted([...allowedPaths]),
    protectedMutationPaths: protectedMutations,
    frozenInputs,
    priorAuthorityMutation: protectedMutations.length > 0,
    grCr01To04Mutation: protectedMutations.some((path) =>
      path.includes('gratitude-region.') ||
      path.includes('gratitude-region-')
    ),
    issues: freeze(issues)
  });
}

function executeFP01EntryArrival(disposition) {
  const issues = [];
  const entry = disposition.targetDispositionMatrix.find(
    (record) => record.areaId === 'GRATITUDE_REGION_ENTRY_ZONE'
  );
  const initial = createHEarthFunctionalLandscapeNavigationState({
    waypointId: entry?.activeInitialState?.waypointId ?? 'COAST'
  });
  const state = initial?.state ?? null;
  const expected = entry?.activeInitialState ?? null;
  const bounds = entry?.sourceCandidateBounds ?? null;

  if (initial?.ok !== true || !state) {
    issues.push(...(initial?.issues ?? ['INITIAL_NAVIGATION_STATE_REJECTED']));
  }
  if (!expected || !bounds) {
    issues.push('ENTRY_DISPOSITION_INPUT_MISSING');
  }
  if (state && expected) {
    if (state.position.x !== expected.x || state.position.z !== expected.z) {
      issues.push(
        `ENTRY_INITIAL_POSITION_MISMATCH:${state.position.x},${state.position.z}`
      );
    }
    if (state.yawDegrees !== expected.yawDegrees) {
      issues.push(`ENTRY_INITIAL_YAW_MISMATCH:${state.yawDegrees}`);
    }
    if (state.pitchDegrees !== expected.pitchDegrees) {
      issues.push(`ENTRY_INITIAL_PITCH_MISMATCH:${state.pitchDegrees}`);
    }
    if (state.verticalFovDegrees !== expected.verticalFovDegrees) {
      issues.push(`ENTRY_INITIAL_FOV_MISMATCH:${state.verticalFovDegrees}`);
    }
    if (!contains(bounds, state.position)) {
      issues.push('ENTRY_INITIAL_STATE_OUTSIDE_CANDIDATE_BOUNDS');
    }
  }

  return freeze({
    checkpointId: 'FP-01',
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'FP_01_ENTRY_ARRIVAL_CORRESPONDENCE_PASS_CLOSED'
      : 'FP_01_ENTRY_ARRIVAL_CORRESPONDENCE_FAIL_STOPPED',
    disposition: issues.length === 0
      ? 'ACCEPT_EXISTING_INITIAL_CAMERA_BOUND_ARRIVAL'
      : 'STOPPED',
    sourceCandidateId: entry?.sourceCandidateId ?? null,
    entryBounds: bounds,
    activeInitialState: state ? freeze({
      stateId: state.stateId,
      position: state.position,
      yawDegrees: state.yawDegrees,
      pitchDegrees: state.pitchDegrees,
      verticalFovDegrees: state.verticalFovDegrees,
      terrainElevation: state.terrainElevation,
      minimumCameraY: state.minimumCameraY,
      clearance: state.clearance,
      chunkId: state.chunkId,
      formationIds: state.formationIds,
      selectedSemanticAddressId: state.selectedSemanticAddressId,
      action: state.action
    }) : null,
    initialStateWithinEntryBounds:
      Boolean(state && bounds && contains(bounds, state.position)),
    cameraStartRelocation: false,
    cameraAuthorityMutation: false,
    issues: freeze(issues)
  });
}

function resolveEnvelopeCorridorClearance(bounds, corridor) {
  if (!bounds || !corridor?.origin || !corridor?.pairAxis) {
    return freeze({
      eligible: false,
      minimumAbsoluteAcrossCorridor: null,
      envelopeIntersectsProtectedCorridor: null,
      cornerProjections: freeze([])
    });
  }

  const corners = [
    { x: bounds.xMinimum, z: bounds.zMinimum },
    { x: bounds.xMinimum, z: bounds.zMaximum },
    { x: bounds.xMaximum, z: bounds.zMinimum },
    { x: bounds.xMaximum, z: bounds.zMaximum }
  ];
  const projections = corners.map((corner) => {
    const dx = corner.x - corridor.origin.x;
    const dz = corner.z - corridor.origin.z;
    return freeze({
      ...corner,
      acrossCorridor:
        dx * corridor.pairAxis.x +
        dz * corridor.pairAxis.z
    });
  });
  const values = projections.map((record) => record.acrossCorridor);
  const allPositive = values.every((value) => value > 0);
  const allNegative = values.every((value) => value < 0);
  const minimumAbsoluteAcrossCorridor =
    Math.min(...values.map((value) => Math.abs(value)));
  const envelopeIntersectsProtectedCorridor =
    !(allPositive || allNegative) ||
    minimumAbsoluteAcrossCorridor < corridor.noBuildHalfWidth;

  return freeze({
    eligible: true,
    minimumAbsoluteAcrossCorridor,
    protectedNoBuildHalfWidth: corridor.noBuildHalfWidth,
    envelopeIntersectsProtectedCorridor,
    cornerProjections: freeze(projections)
  });
}

function executeFP02MirrorManorSiteDisposition(disposition) {
  const issues = [];
  const target = disposition.targetDispositionMatrix.find(
    (record) => record.areaId === 'GRATITUDE_REGION_MIRROR_MANOR_PRECINCT'
  );
  const durableReceipt = readJson(MANOR_RECEIPT_PATH);
  const candidate = deriveGRCRMirrorManorCandidate();
  const durableCandidate = durableReceipt?.mirrorManorCandidate ?? null;
  const expectedCenter = target?.center ?? null;
  const expectedBounds = target?.bounds ?? null;
  const actualCenter = candidate?.envelope?.center ?? null;
  const actualBounds = candidate?.envelope?.bounds ?? null;
  const corridor = candidate?.lowCorridor ?? null;
  const selectedSite = candidate?.selectedSite ?? null;
  const corridorClearance = resolveEnvelopeCorridorClearance(
    actualBounds,
    corridor
  );

  if (!target) issues.push('MIRROR_MANOR_TARGET_DISPOSITION_MISSING');
  if (target?.targetDisposition !== 'ACCEPT') {
    issues.push(`MIRROR_MANOR_TARGET_NOT_ACCEPT:${target?.targetDisposition}`);
  }
  if (target?.acceptedScope !== 'UPPER_CONNECTED_HILL_SITE_ENVELOPE_ONLY') {
    issues.push(`MIRROR_MANOR_SCOPE_MISMATCH:${target?.acceptedScope}`);
  }
  if (candidate?.eligible !== true) {
    issues.push('MIRROR_MANOR_SOURCE_CANDIDATE_INELIGIBLE');
  }
  if (candidate?.candidateId !== target?.sourceCandidateId) {
    issues.push(
      `MIRROR_MANOR_CANDIDATE_ID_MISMATCH:${candidate?.candidateId}`
    );
  }
  if (candidate?.candidateDigest !== durableCandidate?.candidateDigest) {
    issues.push(
      `MIRROR_MANOR_CANDIDATE_DIGEST_MISMATCH:` +
      `${candidate?.candidateDigest}:${durableCandidate?.candidateDigest}`
    );
  }
  if (!exact(actualCenter, expectedCenter) ||
      !exact(actualCenter, durableCandidate?.center)) {
    issues.push('MIRROR_MANOR_CENTER_MISMATCH');
  }
  if (!exact(actualBounds, expectedBounds) ||
      !exact(actualBounds, durableCandidate?.bounds)) {
    issues.push('MIRROR_MANOR_BOUNDS_MISMATCH');
  }
  if (corridor?.eligible !== true || corridor?.noBuildHalfWidth !== 6) {
    issues.push('MIRROR_MANOR_LOW_CORRIDOR_LAW_MISMATCH');
  }
  if (!candidate?.hillPair?.left ||
      !candidate?.hillPair?.right ||
      !candidate?.hillPair?.saddle ||
      !(candidate?.hillPair?.drop > 0)) {
    issues.push('MIRROR_MANOR_TWO_HILL_RELATION_NOT_ESTABLISHED');
  }
  if (!(selectedSite?.terrain?.elevation > corridor?.origin?.elevation)) {
    issues.push('MIRROR_MANOR_SITE_NOT_ABOVE_LOW_CORRIDOR');
  }
  if (candidate?.viewSummary?.beachwardClear !== true) {
    issues.push('MIRROR_MANOR_BEACHWARD_VIEW_NOT_CLEAR');
  }
  if (candidate?.viewSummary?.mountainwardClear !== true) {
    issues.push('MIRROR_MANOR_MOUNTAINWARD_VIEW_NOT_CLEAR');
  }
  if (candidate?.approachSummary?.eligible !== true) {
    issues.push('MIRROR_MANOR_LOWER_NATURAL_APPROACH_NOT_ELIGIBLE');
  }
  if (corridorClearance.eligible !== true ||
      corridorClearance.envelopeIntersectsProtectedCorridor !== false) {
    issues.push('MIRROR_MANOR_ENVELOPE_BLOCKS_LOW_CORRIDOR');
  }

  const footprints = selectedSite?.footprints ?? [];
  const footprintClasses = footprints.map((record) => ({
    width: record.width,
    depth: record.depth
  }));
  if (!exact(footprintClasses, [
    { width: 12, depth: 12 },
    { width: 20, depth: 16 },
    { width: 28, depth: 20 }
  ])) {
    issues.push('MIRROR_MANOR_SUPPORTED_FOOTPRINT_DOMAIN_MISMATCH');
  }
  if (footprints.some((record) => record.finalFootprint !== false)) {
    issues.push('MIRROR_MANOR_FOOTPRINT_PREMATURELY_SELECTED');
  }

  const requiredPreservation = new Set([
    'LOWER_NATURAL_APPROACH_REMAINS_OPEN',
    'LOW_CORRIDOR_NO_BUILD_HALF_WIDTH_REMAINS_6',
    'TWO_HILL_RELATION_REMAINS_LEGIBLE',
    'BEACHWARD_VIEW_REMAINS_CLEAR',
    'MOUNTAINWARD_VIEW_REMAINS_CLEAR'
  ]);
  const actualPreservation = new Set(target?.preservationRequirements ?? []);
  if ([...requiredPreservation].some((value) => !actualPreservation.has(value))) {
    issues.push('MIRROR_MANOR_PRESERVATION_REQUIREMENTS_INCOMPLETE');
  }

  const constructionRequirements =
    new Set(target?.downstreamConstructionRequirements ?? []);
  if (!constructionRequirements.has('MINIMUM_FOUR_ENTRANCES') ||
      !constructionRequirements.has(
        'AT_LEAST_ONE_ENTRANCE_RELATES_TO_LOWER_NATURAL_APPROACH'
      )) {
    issues.push('MIRROR_MANOR_ENTRANCE_REQUIREMENTS_NOT_PRESERVED');
  }

  const requiredUnassigned = new Set([
    'EXACT_BUILDING_FOOTPRINT',
    'BUILDING_ORIENTATION',
    'ATRIUM_GEOMETRY',
    'ENTRANCE_COORDINATES',
    'GARDEN_LAYOUT',
    'SCULPTURE_POSITIONS'
  ]);
  const actualUnassigned = new Set(target?.unassigned ?? []);
  if ([...requiredUnassigned].some((value) => !actualUnassigned.has(value))) {
    issues.push('MIRROR_MANOR_UNASSIGNED_ARCHITECTURE_INCOMPLETE');
  }

  if (candidate?.accepted !== false ||
      candidate?.finalPlacement !== false ||
      candidate?.finalCoordinatesAssigned !== false) {
    issues.push('MIRROR_MANOR_SOURCE_AUTHORITY_REINTERPRETED');
  }

  const passed = issues.length === 0;
  return freeze({
    checkpointId: 'FP-02',
    eligible: passed,
    status: passed
      ? 'FP_02_MIRROR_MANOR_SITE_DISPOSITION_PASS_CLOSED'
      : 'FP_02_MIRROR_MANOR_SITE_DISPOSITION_FAIL_STOPPED',
    disposition: passed
      ? 'ACCEPT_UPPER_CONNECTED_HILL_SITE_ENVELOPE_ONLY'
      : 'STOPPED',
    sourceCandidateId: candidate?.candidateId ?? null,
    sourceCandidateDigest: candidate?.candidateDigest ?? null,
    durableCandidateDigest: durableCandidate?.candidateDigest ?? null,
    acceptedSiteEnvelope: passed ? freeze({
      center: actualCenter,
      bounds: actualBounds,
      elevationRange: candidate?.envelope?.elevationRange ?? null,
      slopeRange: candidate?.envelope?.slopeRange ?? null,
      connectedSampleCount: candidate?.envelope?.sampleCount ?? null,
      approximateSampleAreaWorldUnitsSquared:
        candidate?.envelope?.approximateSampleAreaWorldUnitsSquared ?? null,
      formationMembership:
        candidate?.centerFormationMembership?.formationIds ?? null,
      centerSemanticAddressId:
        candidate?.centerSemanticProjection?.selectedSemanticAddressId ?? null,
      centerPhysicalChunkId:
        candidate?.centerSemanticProjection?.physicalChunkId ?? null
    }) : null,
    twoHillRelationPreserved: passed,
    lowerNaturalApproachPreserved:
      candidate?.approachSummary?.eligible === true,
    lowCorridorPreserved: passed ? freeze({
      origin: corridor?.origin ?? null,
      pairAxis: corridor?.pairAxis ?? null,
      corridorAxis: corridor?.corridorAxis ?? null,
      noBuildHalfWidth: corridor?.noBuildHalfWidth ?? null,
      envelopeClearance: corridorClearance
    }) : null,
    beachwardViewPreserved:
      candidate?.viewSummary?.beachwardClear === true,
    mountainwardViewPreserved:
      candidate?.viewSummary?.mountainwardClear === true,
    gullyOrLowCorridorBlocked:
      corridorClearance.envelopeIntersectsProtectedCorridor,
    supportedFootprintClasses: freeze(footprintClasses),
    selectedFootprintClass: null,
    downstreamConstructionRequirements: freeze({
      minimumEntrances: 4,
      oneEntranceRelatesToLowerNaturalApproach: true,
      exactEntranceCoordinatesAssigned: false,
      exactFootprintClassSelected: false,
      exactBuildingOrientationAssigned: false,
      atriumGeometryAssigned: false,
      gardenLayoutAssigned: false,
      sculpturePositionsAssigned: false,
      historicalProgramImplementationAssigned: false
    }),
    sourceCandidateRemainsUnmodified: true,
    terrainMutation: false,
    buildingGeometry: false,
    cameraMutation: false,
    productConstruction: false,
    livePageChange: false,
    issues: freeze(issues)
  });
}

function executeDispositionOnce() {
  const disposition = readJson(DISPOSITION_PATH);
  const fp00 = executeFP00InputFreeze(disposition);
  const fp01 = fp00.eligible
    ? executeFP01EntryArrival(disposition)
    : freeze({
        checkpointId: 'FP-01',
        eligible: false,
        status: 'FP_01_NOT_EXECUTED_FP_00_REQUIRED',
        issues: freeze(['FP_00_PASS_REQUIRED'])
      });
  const fp02 = fp01.eligible
    ? executeFP02MirrorManorSiteDisposition(disposition)
    : freeze({
        checkpointId: 'FP-02',
        eligible: false,
        status: 'FP_02_NOT_EXECUTED_FP_01_REQUIRED',
        issues: freeze(['FP_01_PASS_REQUIRED'])
      });
  const issues = [...fp00.issues, ...fp01.issues, ...fp02.issues];

  return freeze({
    schemaVersion:
      'H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_THROUGH_FP02_RECEIPT_v1',
    operation:
      'GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_THROUGH_FP02',
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'FP_00_THROUGH_FP_02_PASS_CLOSED'
      : 'FINAL_PLACEMENT_THROUGH_FP02_FAIL_STOPPED',
    fp00,
    fp01,
    fp02,
    nextCheckpoint: issues.length === 0
      ? 'FP-03_CAVERN_FIRST_RAVINE_TERMINUS_CORRESPONDENCE'
      : 'STOP_AND_RECONCILE_CURRENT_CHECKPOINT',
    pendingCheckpoints: freeze(['FP-03', 'FP-04', 'FP-05']),
    authorityBoundary: freeze({
      priorAuthorityMutation: false,
      grCr01To04Mutation: false,
      terrainMutation: false,
      cameraAuthorityMutation: false,
      buildingGeometry: false,
      cavernExcavation: false,
      roadOrCorridorGeometry: false,
      runtimeIntegration: false,
      publicRouteMutation: false,
      livePageChange: false,
      productConstruction: false,
      mergeAuthorityCreated: false
    }),
    issues: freeze(issues)
  });
}

export function executeGratitudeRegionFinalPlacementBaseline() {
  const first = executeDispositionOnce();
  const second = executeDispositionOnce();
  const firstExecutionDigest = digest(first);
  const secondExecutionDigest = digest(second);
  const issues = [...first.issues];
  if (firstExecutionDigest !== secondExecutionDigest) {
    issues.push('FINAL_PLACEMENT_THROUGH_FP02_NONDETERMINISTIC');
  }
  return freeze({
    ...first,
    eligible: first.eligible && issues.length === 0,
    status: first.eligible && issues.length === 0
      ? 'FP_00_THROUGH_FP_02_PASS_CLOSED'
      : 'FINAL_PLACEMENT_THROUGH_FP02_FAIL_STOPPED',
    firstExecutionDigest,
    secondExecutionDigest,
    deterministicRepeatExecution:
      firstExecutionDigest === secondExecutionDigest,
    issues: freeze(issues)
  });
}

export default executeGratitudeRegionFinalPlacementBaseline;
