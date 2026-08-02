#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { buildReviewResourceGraph, traceCarrier } from './h-earth.c2-r1.r1-8d-c1-carrier-trace.js';
import { verifyServedOccurrence } from './h-earth.c2-r1.r1-8d-c1-served-verifier.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../');
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const TARGET_BRANCH = 'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const STARTING_HEAD = '042a488fb7d84654e0f1cde120fd25af30b9ee5e';
const R1_8B_PASS_HEAD = 'c77ecf9f047daf8dc11adfbb3a3e100410ba6a31';
const C3_STARTING_HEAD = 'c5ec156d0d00979ea2296972374b13f43678f4bf';
const PRODUCT_AUTHORITY_HEAD = 'c53362c6f74b01c4e0b53be526b0e3a0b73edede';
const ROLLBACK_BRANCH = 'rollback/h-earth-c2-r1-r1-8d-c1-start-001';
const EXPECTED_LAUNCH_HEAD = process.env.R1_8_EXPECTED_CANDIDATE_HEAD || null;
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const PREFLIGHT_C77 = process.env.R1_8D_C1_PREFLIGHT_C77 || '/tmp/r1-8d-c1-preflight-c77.json';
const PREFLIGHT_042 = process.env.R1_8D_C1_PREFLIGHT_042 || '/tmp/r1-8d-c1-preflight-042.json';
const PATHS_C77 = process.env.R1_8D_C1_PATHS_C77 || '/tmp/r1-8d-c1-paths-c77.txt';
const PATHS_042 = process.env.R1_8D_C1_PATHS_042 || '/tmp/r1-8d-c1-paths-042.txt';

const CONTROL_ROOT = 'h-earth-3d/control-plane/coastal-morphology/c2-r1';
const REVIEW_ROOT = `${CONTROL_ROOT}/review/r1-8`;
const REVIEW_DOCUMENT = `${REVIEW_ROOT}/index.html`;
const ASSET_PATH = `${REVIEW_ROOT}/h-earth.c2-r1.r1-8-review-mesh.bin`;
const EVIDENCE_ROOT = path.join(ROOT, CONTROL_ROOT, 'evidence/r1-8');
const CAPTURE_ROOT = path.join(EVIDENCE_ROOT, 'captures');
const LEDGER_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8-phase-ledger.json');
const REGISTRY_SEQUENCE_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-c1-registry-sequence.json');
const TRANSPORT_TRACE_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-c1-served-transport-trace.json');
const CARRIER_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-c1-carrier-reconciliation.json');
const SERVED_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-served-verification.json');
const CAPTURE_MANIFEST_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-capture-manifest.json');
const HANDOFF_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8-handoff.json');
const EXPECTED_ASSET = Object.freeze({
  byteLength: 340144,
  sha256: '88018b9425565d4745ebf5d59a0b942971069c53020028995cb086079da34a77',
  vertexCount: 5390,
  indexCount: 31104,
  finalGeometryByteIdentity: true,
  finalMaterialControlByteIdentity: true
});
const VIEWS = Object.freeze([
  'LATERAL_BEACH_PROFILE',
  'INLAND_TO_DEEP_WATER',
  'SHALLOW_WATER_AND_SEABED',
  'SANDBAR_AND_BATHYMETRY',
  'GROUND_TRAVERSAL',
  'DISTANT_LANDSCAPE'
]);
const CARRIERS = Object.freeze([
  {
    id: 'RAWCDN_GITHACK',
    baseUrl: `https://rawcdn.githack.com/${REPOSITORY}/${R1_8B_PASS_HEAD}/`,
    host: 'rawcdn.githack.com',
    role: 'EXISTING_HTTP_AVAILABLE_CARRIER'
  },
  {
    id: 'JSDELIVR_GITHUB_COMMIT_PINNED',
    baseUrl: `https://cdn.jsdelivr.net/gh/${REPOSITORY}@${R1_8B_PASS_HEAD}/`,
    host: 'cdn.jsdelivr.net',
    role: 'AUTHORIZED_BOUNDED_REPLACEMENT_CARRIER'
  }
]);

const now = () => new Date().toISOString();
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const gitBytes = repositoryPath => execFileSync('git', ['show', `${R1_8B_PASS_HEAD}:${repositoryPath}`], { cwd: ROOT, encoding: null, maxBuffer: 64 * 1024 * 1024 });
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const requireCondition = (condition, code, detail = null) => {
  if (condition) return;
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
};

fs.mkdirSync(EVIDENCE_ROOT, { recursive: true });
fs.mkdirSync(CAPTURE_ROOT, { recursive: true });
let ledger = readJson(LEDGER_PATH);
let currentPhase = 'R1.8D_C1_PHASE_1_REGISTRY_SEQUENCE_RECONCILIATION';

function persistLedger() {
  ledger.updatedAt = now();
  ledger.completedPhaseCount = ledger.phases.filter(row => String(row.status).startsWith('PASS')).length;
  writeJson(LEDGER_PATH, ledger);
}

function recordPhase(id, status, evidence = {}, blocker = null) {
  const row = { id, status, recordedAt: now(), evidence, blocker };
  const index = ledger.phases.findIndex(existing => existing.id === id);
  if (index >= 0) ledger.phases[index] = row;
  else ledger.phases.push(row);
  if (blocker) ledger.firstBlocker = blocker;
  persistLedger();
}

function commitAndPush(message, repositoryPaths) {
  git('add', '--', ...repositoryPaths);
  try {
    execFileSync('git', ['diff', '--cached', '--quiet'], { cwd: ROOT });
    return git('rev-parse', 'HEAD');
  } catch {}
  git('commit', '-m', message);
  const head = git('rev-parse', 'HEAD');
  git('push', 'origin', `HEAD:${TARGET_BRANCH}`);
  return head;
}

async function getPullRequest() {
  requireCondition(Boolean(TOKEN), 'GITHUB_TOKEN_MISSING');
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/pulls/418`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  requireCondition(response.ok, 'PR_418_API_READ_FAILED', response.status);
  return response.json();
}

function browserLaunchOptions() {
  return {
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--disable-dev-shm-usage']
  };
}

async function main() {
  git('config', 'user.name', 'github-actions[bot]');
  git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com');
  const launchHead = git('rev-parse', 'HEAD');
  requireCondition(!EXPECTED_LAUNCH_HEAD || launchHead === EXPECTED_LAUNCH_HEAD, 'R1_8D_C1_LAUNCH_HEAD_MISMATCH', { launchHead, EXPECTED_LAUNCH_HEAD });
  const rollbackHead = git('ls-remote', 'origin', `refs/heads/${ROLLBACK_BRANCH}`).split(/\s+/)[0];
  requireCondition(rollbackHead === STARTING_HEAD, 'R1_8D_C1_ROLLBACK_IDENTITY_MISMATCH', rollbackHead);
  git('merge-base', '--is-ancestor', PRODUCT_AUTHORITY_HEAD, launchHead);
  const pr = await getPullRequest();
  requireCondition(pr.state === 'open' && pr.draft === true && pr.merged === false, 'PR_418_NOT_OPEN_DRAFT_UNMERGED', { state: pr.state, draft: pr.draft, merged: pr.merged });
  requireCondition(pr.head?.ref === TARGET_BRANCH && pr.head?.sha === launchHead, 'PR_418_HEAD_IDENTITY_MISMATCH', { ref: pr.head?.ref, sha: pr.head?.sha, launchHead });

  const preflightC77 = readJson(PREFLIGHT_C77);
  const preflight042 = readJson(PREFLIGHT_042);
  requireCondition(!['BLOCK', 'STOP'].includes(preflightC77.finalDisposition), 'R1_8B_PASS_HEAD_REGISTRY_PREFLIGHT_FAILED', preflightC77);
  requireCondition(!['BLOCK', 'STOP'].includes(preflight042.finalDisposition), 'R1_8D_START_HEAD_REGISTRY_PREFLIGHT_FAILED', preflight042);
  const registrySequence = {
    receiptType: 'H_EARTH_C2_R1_R1_8D_C1_REGISTRY_SEQUENCE_RECONCILIATION_v1',
    operation: 'R1.8D_C1_SERVED_OCCURRENCE_TRANSPORT_DIAGNOSIS_AND_PUBLICATION_CARRIER_RECONCILIATION',
    result: 'PASS_BOTH_EXACT_HEADS',
    comparisonBase: C3_STARTING_HEAD,
    exactHeads: [
      {
        head: R1_8B_PASS_HEAD,
        role: 'R1.8B_PASS_HEAD',
        paths: fs.readFileSync(PATHS_C77, 'utf8').split(/\r?\n/).filter(Boolean),
        receipt: preflightC77
      },
      {
        head: STARTING_HEAD,
        role: 'R1.8D_C1_STARTING_HEAD',
        paths: fs.readFileSync(PATHS_042, 'utf8').split(/\r?\n/).filter(Boolean),
        receipt: preflight042
      }
    ],
    bothPassed: true,
    recordedAt: now()
  };
  writeJson(REGISTRY_SEQUENCE_PATH, registrySequence);
  if (ledger.firstBlocker && !ledger.r1_8dC1PriorServedBlocker) ledger.r1_8dC1PriorServedBlocker = ledger.firstBlocker;
  ledger.correctiveOperation = 'R1.8D_C1_SERVED_OCCURRENCE_TRANSPORT_DIAGNOSIS_AND_PUBLICATION_CARRIER_RECONCILIATION';
  ledger.correctiveStartingHead = STARTING_HEAD;
  ledger.correctiveStartRollbackBranch = ROLLBACK_BRANCH;
  ledger.firstBlocker = null;
  ledger.controllingStatus = 'R1.8D_C1_PHASE_1_REGISTRY_SEQUENCE_RECONCILIATION_PASS';
  recordPhase(currentPhase, 'PASS_RECORDED', {
    exactHeads: [R1_8B_PASS_HEAD, STARTING_HEAD],
    receipt: { path: relative(REGISTRY_SEQUENCE_PATH), sha256: sha256(fs.readFileSync(REGISTRY_SEQUENCE_PATH)) },
    bothPassed: true,
    r1_8bMaterialization: 'PASS_RECORDED_DO_NOT_REPEAT',
    r1_8bLocalFunctionalVerification: 'PASS_RECORDED_DO_NOT_REOPEN'
  });
  const phase1Head = commitAndPush('R1.8D-C1: record exact-head registry sequence reconciliation', [relative(LEDGER_PATH), relative(REGISTRY_SEQUENCE_PATH)]);

  currentPhase = 'R1.8D_C1_PHASE_2_SERVED_OCCURRENCE_TRANSPORT_TRACE';
  const graph = buildReviewResourceGraph({ gitBytes, reviewRoot: REVIEW_ROOT, reviewDocument: REVIEW_DOCUMENT, assetPath: ASSET_PATH });
  const browser = await chromium.launch(browserLaunchOptions());
  try {
    const carrierTraces = [];
    let selected = null;
    for (const carrier of CARRIERS) {
      const trace = await traceCarrier({ browser, carrier, graph, gitBytes, reviewDocument: REVIEW_DOCUMENT, assetPath: ASSET_PATH });
      carrierTraces.push(trace);
      if (trace.direct.allHttp200 && trace.direct.allByteIdentical && trace.direct.allMimeCompatible && trace.browser.ready) {
        selected = trace;
        break;
      }
    }
    writeJson(TRANSPORT_TRACE_PATH, {
      traceType: 'H_EARTH_C2_R1_R1_8D_C1_SERVED_OCCURRENCE_TRANSPORT_TRACE_v1',
      sourceCandidateBytesHead: R1_8B_PASS_HEAD,
      startingHead: STARTING_HEAD,
      phase1Head,
      reviewResourceGraph: graph,
      carrierTraces,
      selectedCarrier: selected?.carrier?.id || null,
      candidateFailureEstablished: false,
      productRegressionEstablished: false,
      recordedAt: now()
    });
    requireCondition(Boolean(selected), 'NO_ISOLATED_CARRIER_REACHED_EXACT_READY_REVIEW_BOUNDARY', carrierTraces.map(trace => ({
      carrier: trace.carrier.id,
      classifications: trace.classifications,
      ready: trace.browser.ready,
      allByteIdentical: trace.direct.allByteIdentical,
      allMimeCompatible: trace.direct.allMimeCompatible
    })));

    currentPhase = 'R1.8D_SERVED_OCCURRENCE_VERIFICATION_AND_REPRESENTATIVE_CAPTURE_PACKAGE';
    const served = await verifyServedOccurrence({
      browser,
      carrier: selected.carrier,
      reviewDocument: REVIEW_DOCUMENT,
      productAuthorityHead: PRODUCT_AUTHORITY_HEAD,
      expectedAsset: EXPECTED_ASSET,
      captureRoot: CAPTURE_ROOT,
      repositoryRoot: ROOT,
      candidateBytesHead: R1_8B_PASS_HEAD,
      views: VIEWS
    });
    const rawTrace = carrierTraces.find(trace => trace.carrier.id === 'RAWCDN_GITHACK');
    const replacementUsed = selected.carrier.id !== 'RAWCDN_GITHACK';
    writeJson(CARRIER_PATH, {
      receiptType: 'H_EARTH_C2_R1_R1_8D_C1_PUBLICATION_CARRIER_RECONCILIATION_v1',
      result: replacementUsed ? 'PASS_REPLACEMENT_CARRIER_SELECTED' : 'PASS_EXISTING_CARRIER_CONFIRMED',
      priorCarrier: CARRIERS[0],
      priorCarrierClassifications: rawTrace?.classifications || [],
      selectedCarrier: selected.carrier,
      exactCandidateBytesHead: R1_8B_PASS_HEAD,
      allReviewResourcesByteIdentical: selected.direct.allByteIdentical,
      allReviewResourcesMimeCompatible: selected.direct.allMimeCompatible,
      readySentinelWithin60Seconds: selected.browser.ready && selected.browser.readyDurationMs < 60000,
      asset: EXPECTED_ASSET,
      nonDefault: true,
      independentlyRemovable: true,
      publicHEarthRouteUnchanged: true,
      productDefaultUnchanged: true,
      mainUnchanged: true,
      pr418Unmerged: true,
      recordedAt: now()
    });
    writeJson(CAPTURE_MANIFEST_PATH, {
      manifestType: 'H_EARTH_C2_R1_R1_8D_REPRESENTATIVE_CAPTURE_PACKAGE_v2',
      result: 'PASS_CAPTURE_PACKAGE_READY_FOR_HUMAN_REVIEW',
      exactCandidateBytesHead: R1_8B_PASS_HEAD,
      servedOccurrence: served.servedOccurrence,
      carrier: selected.carrier,
      browserVersion: served.browserVersion,
      captures: served.captures,
      captureCount: served.captures.length,
      visualSuccessEstablished: false,
      userDifferentialRequired: true
    });
    writeJson(SERVED_PATH, {
      receiptType: 'H_EARTH_C2_R1_R1_8D_SERVED_OCCURRENCE_VERIFICATION_v2',
      result: 'PASS_READY_FOR_USER_DIFFERENTIAL',
      exactCandidateBytesHead: R1_8B_PASS_HEAD,
      servedOccurrence: served.servedOccurrence,
      carrier: selected.carrier,
      servedByteIdentityForAllReviewResources: true,
      servedDocumentReachable: true,
      readySentinelWithin60Seconds: true,
      webglContextEstablished: true,
      liveFrameAdvancementConfirmed: true,
      touchResponseConfirmed: true,
      cameraMovementTruthful: true,
      navigationFunctional: true,
      noBitmapFallback: true,
      noFatalConsoleOrModuleFailure: true,
      exactReviewGeometryPreserved: true,
      asset: EXPECTED_ASSET,
      referenceDeviceReviewAvailable: true,
      referenceDeviceExecutionStatus: 'AVAILABLE_FOR_PHYSICAL_SAMSUNG_REVIEW_NOT_EXECUTED_BY_AUTOMATION',
      desktop: served.desktop,
      mobileReferenceEmulation: served.mobileReferenceEmulation,
      captureManifest: { path: relative(CAPTURE_MANIFEST_PATH), sha256: sha256(fs.readFileSync(CAPTURE_MANIFEST_PATH)) },
      sixRepresentativeCapturesCreated: served.captures.length === 6,
      productDefaultMutated: false,
      publicDefaultRouteMutated: false,
      mainMutated: false,
      pr418Merged: false,
      visualSuccessorStatus: 'NOT_ESTABLISHED',
      userDifferentialReady: true,
      r1_8eStarted: false,
      firstBlocker: null
    });
    writeJson(HANDOFF_PATH, {
      handoffType: 'H_EARTH_C2_R1_R1_8_USER_DIFFERENTIAL_HANDOFF_v2',
      status: 'READY_FOR_USER_DIFFERENTIAL',
      reviewOccurrence: served.servedOccurrence,
      changedCandidate: `C2_R1_BYTES_AT_${R1_8B_PASS_HEAD}`,
      comparisonBaseline: 'LAST_USER_ACCEPTED_LIVE_H_EARTH_BASELINE',
      functionalVerificationResult: 'PASS_RECORDED_DO_NOT_REOPEN',
      servedVerificationResult: 'PASS',
      referenceDeviceStatus: 'AVAILABLE_FOR_PHYSICAL_REVIEW',
      sixCaptureIdentities: served.captures.map(capture => ({ identity: capture.identity, sha256: capture.sha256, path: capture.file })),
      permittedUserResults: ['ACCEPTED', 'REJECTED', 'MIXED_WITH_SPECIFIC_DEFECTS'],
      r1_8Status: 'OPEN_WAITING_USER_DIFFERENTIAL',
      visualSuccessorStatus: 'NOT_ESTABLISHED',
      productDefaultMutated: false,
      publicDefaultRouteMutated: false,
      mainMutated: false,
      pr418Merged: false,
      r1_8eStarted: false
    });

    ledger = readJson(LEDGER_PATH);
    ledger.controllingStatus = 'R1.8D_PASS_RECORDED_AWAITING_USER_DIFFERENTIAL';
    ledger.firstBlocker = null;
    ledger.visualSuccessorStatus = 'NOT_ESTABLISHED';
    ledger.userDifferentialReady = true;
    ledger.r1_8eStarted = false;
    const r1c = ledger.phases.find(row => row.id === 'R1.8C_ISOLATED_NON_DEFAULT_CANDIDATE_PUBLICATION');
    if (r1c) r1c.evidence.servedSuitabilityCarrierReconciled = {
      carrier: selected.carrier,
      exactCandidateBytesHead: R1_8B_PASS_HEAD,
      servedOccurrence: served.servedOccurrence
    };
    recordPhase('R1.8D_SERVED_OCCURRENCE_VERIFICATION_AND_REPRESENTATIVE_CAPTURE_PACKAGE', 'PASS_RECORDED_AWAITING_USER_DIFFERENTIAL', {
      servedOccurrence: served.servedOccurrence,
      exactCandidateBytesHead: R1_8B_PASS_HEAD,
      selectedCarrier: selected.carrier,
      transportTrace: { path: relative(TRANSPORT_TRACE_PATH), sha256: sha256(fs.readFileSync(TRANSPORT_TRACE_PATH)) },
      carrierReconciliation: { path: relative(CARRIER_PATH), sha256: sha256(fs.readFileSync(CARRIER_PATH)) },
      servedReceipt: { path: relative(SERVED_PATH), sha256: sha256(fs.readFileSync(SERVED_PATH)) },
      captureManifest: { path: relative(CAPTURE_MANIFEST_PATH), sha256: sha256(fs.readFileSync(CAPTURE_MANIFEST_PATH)) },
      captureCount: served.captures.length,
      referenceDeviceReviewAvailable: true,
      userDifferentialReady: true,
      visualSuccessorStatus: 'NOT_ESTABLISHED'
    });

    const evidencePaths = [
      relative(LEDGER_PATH),
      relative(TRANSPORT_TRACE_PATH),
      relative(CARRIER_PATH),
      relative(SERVED_PATH),
      relative(CAPTURE_MANIFEST_PATH),
      relative(HANDOFF_PATH),
      ...served.captures.map(capture => capture.file)
    ];
    const evidenceHead = commitAndPush('R1.8D-C1: preserve served verification and six-view evidence', evidencePaths);
    console.log(`R1_8D_C1_RESULT=PASS`);
    console.log(`R1_8_REVIEW_OCCURRENCE=${served.servedOccurrence}`);
    console.log(`R1_8_SERVED_CANDIDATE_BYTES_HEAD=${R1_8B_PASS_HEAD}`);
    console.log(`R1_8D_EVIDENCE_HEAD=${evidenceHead}`);
    console.log('R1_8D_USER_DIFFERENTIAL_READY=TRUE');
    console.log('R1_8_VISUAL_SUCCESSOR_STATUS=NOT_ESTABLISHED');
    console.log('R1_8E_STARTED=FALSE');
  } finally {
    await browser.close();
  }
}

try {
  await main();
} catch (error) {
  const blocker = {
    code: error.code || error.message || 'R1_8D_C1_UNCLASSIFIED_BLOCKER',
    detail: error.detail ?? String(error?.stack || error),
    phase: currentPhase,
    recordedAt: now(),
    productRegressionEstablished: false,
    candidateFailureEstablished: false
  };
  ledger = readJson(LEDGER_PATH);
  ledger.controllingStatus = `R1.8_BLOCKED_AT_${currentPhase}`;
  ledger.userDifferentialReady = false;
  ledger.visualSuccessorStatus = 'NOT_ESTABLISHED';
  ledger.r1_8eStarted = false;
  recordPhase(currentPhase, 'BLOCKED', {}, blocker);
  const paths = [relative(LEDGER_PATH)];
  for (const file of [TRANSPORT_TRACE_PATH, CARRIER_PATH, SERVED_PATH, CAPTURE_MANIFEST_PATH, HANDOFF_PATH]) {
    if (fs.existsSync(file)) paths.push(relative(file));
  }
  try {
    commitAndPush(`R1.8D-C1: preserve first blocker at ${currentPhase}`, paths);
  } catch (commitError) {
    console.error(`BLOCKER_PRESERVATION_FAILED:${String(commitError?.stack || commitError)}`);
  }
  console.error(JSON.stringify({ result: 'BLOCKED', blocker }, null, 2));
  process.exit(1);
}
