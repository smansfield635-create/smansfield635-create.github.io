import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

import {
  createHEarthFunctionalLandscapeNavigationState
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';

const BASE_MAIN_HEAD = '343b0c269dd343a57c6ecb7e785141134cc5660f';
const DISPOSITION_PATH =
  'h-earth-3d/control-plane/region-001-reconciliation/' +
  'h-earth.region-001.gratitude-region-final-spatial-placement-disposition.v1.json';
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

function executeBaselineOnce() {
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
  const issues = [...fp00.issues, ...fp01.issues];

  return freeze({
    schemaVersion:
      'H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_BASELINE_RECEIPT_v1',
    operation:
      'GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_BASELINE',
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'FP_00_AND_FP_01_PASS_CLOSED'
      : 'FINAL_PLACEMENT_BASELINE_FAIL_STOPPED',
    fp00,
    fp01,
    nextCheckpoint: issues.length === 0
      ? 'FP-02_MIRROR_MANOR_SITE_DISPOSITION'
      : 'STOP_AND_RECONCILE_BASELINE',
    pendingCheckpoints: freeze(['FP-02', 'FP-03', 'FP-04', 'FP-05']),
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
  const first = executeBaselineOnce();
  const second = executeBaselineOnce();
  const firstExecutionDigest = digest(first);
  const secondExecutionDigest = digest(second);
  const issues = [...first.issues];
  if (firstExecutionDigest !== secondExecutionDigest) {
    issues.push('FINAL_PLACEMENT_BASELINE_NONDETERMINISTIC');
  }
  return freeze({
    ...first,
    eligible: first.eligible && issues.length === 0,
    status: first.eligible && issues.length === 0
      ? 'FP_00_AND_FP_01_PASS_CLOSED'
      : 'FINAL_PLACEMENT_BASELINE_FAIL_STOPPED',
    firstExecutionDigest,
    secondExecutionDigest,
    deterministicRepeatExecution:
      firstExecutionDigest === secondExecutionDigest,
    issues: freeze(issues)
  });
}

export default executeGratitudeRegionFinalPlacementBaseline;
