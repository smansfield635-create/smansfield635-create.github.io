import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';

const require = createRequire(import.meta.url);
const protocol = require('../../tools/imi-empirical-platform/generalizability/imi-generalizability-protocol.v1.json');
const manifest = require('../../tools/imi-empirical-platform/generalizability/imi-phase3-parallel-external-tests-manifest.v1.json');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
function assert(condition, code) {
  if (!condition) throw new Error(code);
}
const outputDir = argValue('--output-dir', '/tmp/imi-phase3-parallel-external-tests-collective');
const clock = () => new Date(argValue('--clock', '2026-08-05T17:45:00.000Z'));
const trackDirs = {
  HOSPITAL_EXTERNAL_OR_NEXT_RELEASE_REPLICATION: argValue('--hospital-dir'),
  SPEECH_HELD_OUT_DATASET_REPRODUCTION: argValue('--speech-dir'),
  BEE_LONGER_PANEL_AND_ROUTE_DISCRIMINATION: argValue('--bee-dir'),
  DSSI_REMAINING_COUNTRY_CONTINUATION: argValue('--dssi-dir')
};
const receiptFiles = {
  HOSPITAL_EXTERNAL_OR_NEXT_RELEASE_REPLICATION: 'hospital-phase3-track-receipt.v1.json',
  SPEECH_HELD_OUT_DATASET_REPRODUCTION: 'speech-phase3-track-receipt.v1.json',
  BEE_LONGER_PANEL_AND_ROUTE_DISCRIMINATION: 'bee-phase3-track-receipt.v1.json',
  DSSI_REMAINING_COUNTRY_CONTINUATION: 'dssi-phase3-track-receipt.v1.json'
};

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}
function receiptBodyDigestMatches(receipt) {
  const { receiptDigest, ...body } = receipt;
  return receiptDigest === canonicalDigest(body);
}
function dispositionClass(receipt) {
  const value = String(receipt.terminalDisposition || '');
  if (value.startsWith('PASS_CLOSED')) return 'PASS_CLOSED';
  if (value.startsWith('HELD_OPEN')) return 'HELD_OPEN';
  if (value.startsWith('FAIL')) return 'FAIL_CLOSED';
  return 'UNKNOWN';
}

assert(protocol.status === 'FROZEN', 'PHASE3_PROTOCOL_NOT_FROZEN');
assert(canonicalDigest(protocol) === manifest.protocolDigest, 'PHASE3_PROTOCOL_DIGEST_MISMATCH');
assert(manifest.status === 'AUTHORIZED_EXECUTION_MANIFEST_FROZEN', 'PHASE3_MANIFEST_NOT_FROZEN');
assert(manifest.tracks.length === 4, 'PHASE3_MANIFEST_TRACK_COUNT_MISMATCH');

const tracks = [];
for (const expected of protocol.phase3Gate.authorizedTracks) {
  const dir = trackDirs[expected];
  assert(dir, `PHASE3_TRACK_DIRECTORY_REQUIRED:${expected}`);
  const receipt = await readJson(path.join(dir, receiptFiles[expected]));
  assert(receipt.operation === 'IMI_PARALLEL_EXTERNAL_TESTS_v1', `PHASE3_TRACK_OPERATION_MISMATCH:${expected}`);
  assert(receipt.track === expected, `PHASE3_TRACK_IDENTITY_MISMATCH:${expected}`);
  assert(receiptBodyDigestMatches(receipt), `PHASE3_TRACK_RECEIPT_DIGEST_MISMATCH:${expected}`);
  const classification = dispositionClass(receipt);
  assert(classification !== 'UNKNOWN', `PHASE3_TRACK_DISPOSITION_UNKNOWN:${expected}`);
  tracks.push({
    track: expected,
    result: receipt.result,
    terminalDisposition: receipt.terminalDisposition,
    classification,
    minimumEvidenceSatisfied: Boolean(receipt.minimumEvidenceSatisfied),
    phase4Candidate: Boolean(receipt.phase4Candidate),
    routeDigest: receipt.routeDigest,
    sourceDigest: receipt.sourceDigest || null,
    executionDigest: receipt.executionDigest || null,
    summaryDigest: receipt.summaryDigest || null,
    receiptDigest: receipt.receiptDigest
  });
}

const counts = {
  executed: tracks.length,
  passClosed: tracks.filter((entry) => entry.classification === 'PASS_CLOSED').length,
  heldOpen: tracks.filter((entry) => entry.classification === 'HELD_OPEN').length,
  failClosed: tracks.filter((entry) => entry.classification === 'FAIL_CLOSED').length,
  minimumEvidenceSatisfied: tracks.filter((entry) => entry.minimumEvidenceSatisfied).length,
  phase4Candidates: tracks.filter((entry) => entry.phase4Candidate).length
};
assert(counts.executed === 4, 'PHASE3_ALL_TRACKS_NOT_EXECUTED');
assert(counts.failClosed === 0, 'PHASE3_TRACK_EXECUTION_DEFECT_PRESENT');

const phase3Closed = counts.passClosed === 4 && counts.heldOpen === 0;
const phase3Status = phase3Closed ? 'PASS_CLOSED' : 'EXECUTED_WITH_OPEN_HELD_TRACKS';
const result = phase3Closed
  ? 'PASS_CLOSED_PHASE_3_PARALLEL_EXTERNAL_TESTS'
  : 'PHASE_3_EXECUTED_PARTIAL_TRACKS_HELD_OPEN';

const phase4TrackCandidates = tracks.filter((entry) => entry.phase4Candidate).map((entry) => entry.track);
const phase4AutomaticallyAuthorized = false;
const summary = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_PARALLEL_EXTERNAL_TESTS_SUMMARY_v1',
  operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
  result,
  phase3Status,
  generatedAt: clock().toISOString(),
  protocolDigest: canonicalDigest(protocol),
  manifestDigest: canonicalDigest(manifest),
  counts,
  tracks,
  phase3Closed,
  openHeldTracks: tracks.filter((entry) => entry.classification === 'HELD_OPEN').map((entry) => entry.track),
  phase4TrackCandidates,
  phase4AutomaticallyAuthorized,
  phase4Status: phase4TrackCandidates.length
    ? 'CANDIDATE_TRACKS_REQUIRE_SEPARATE_ROUTE_SPECIFIC_ADMISSION'
    : 'NOT_AUTHORIZED_NO_ADMISSIBLE_CANDIDATE_TRACK',
  nextLawfulAction: phase3Closed
    ? 'SEPARATE_PHASE_4_ROUTE_SPECIFIC_ADMISSION_DECISION'
    : 'RESOLVE_OPEN_PHASE_3_SOURCE_OR_MINIMUM_EVIDENCE_HOLDS_WITHOUT_ROUTE_RETUNING',
  boundaries: {
    allFourTrackRunnersExecuted: true,
    heldTracksTreatedAsScientificFailure: false,
    phase4AutomaticallyAuthorized: false,
    phase5Authorized: false,
    mathematicalKernelMutated: false,
    routeRetuningAuthorized: false,
    rawCrossRouteMagnitudeComparisonPerformed: false,
    universalPredictiveValidityClaimed: false,
    causalClaimsAuthorized: false,
    clinicalDiagnosticUseAuthorized: false,
    decisionUtilityClaimed: false,
    finalInstrumentValidationClaimed: false,
    mainMergeAuthorized: false,
    publicReleaseAuthorized: false
  }
});
const receiptBody = {
  schemaVersion: 'IMI_PHASE_3_PARALLEL_EXTERNAL_TESTS_RECEIPT_v1',
  operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
  result,
  phase3Status,
  protocolDigest: summary.protocolDigest,
  manifestDigest: summary.manifestDigest,
  summaryDigest: canonicalDigest(summary),
  trackReceiptDigests: Object.fromEntries(tracks.map((entry) => [entry.track, entry.receiptDigest])),
  counts,
  phase3Closed,
  phase4TrackCandidates,
  phase4AutomaticallyAuthorized,
  boundaries: summary.boundaries
};
const receipt = deepFreeze({ ...receiptBody, receiptDigest: canonicalDigest(receiptBody) });

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'imi-phase3-parallel-external-tests-summary.v1.json'), `${JSON.stringify(summary, null, 2)}\n`);
await writeFile(path.join(outputDir, 'imi-phase3-parallel-external-tests-receipt.v1.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
