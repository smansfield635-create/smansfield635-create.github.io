import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const EXPECTED_MAIN_HEAD = process.env.H_EARTH_EXPECTED_PROMOTED_MAIN_HEAD;
const LIVE_ORIGIN = process.env.H_EARTH_LIVE_ORIGIN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const VERIFIED_ON = '2026-07-26';
const RECEIPT_PATH = 'h-earth-3d/validation/h-earth.run8.phase2-deployment-reconciliation.receipt.json';
const LOG_PATH = 'h-earth-3d/validation/h-earth.run8.phase2-deployment-reconciliation.log';
const MAX_ATTEMPTS = 40;
const POLL_INTERVAL_MS = 15_000;

if (!EXPECTED_MAIN_HEAD || !LIVE_ORIGIN || !GITHUB_TOKEN) {
  throw new Error('Phase 2 deployment reconciliation environment is incomplete.');
}

const TRACKED_PATHS = Object.freeze([
  '/showroom/globe/h-earth/index.html',
  '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
  '/showroom/globe/h-earth/render/run8e-successor-environment.js',
  '/h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js',
  '/h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js',
  '/h-earth-3d/validation/h-earth.run8.phase1-main-promotion.receipt.json'
]);

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const ensureOutputDirectory = () => fs.mkdirSync(path.dirname(RECEIPT_PATH), { recursive: true });
const appendLog = (line) => fs.appendFileSync(LOG_PATH, `${line}\n`, 'utf8');

async function fetchBytes(url, headers = {}) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'cache-control': 'no-cache',
      'user-agent': 'h-earth-run8-phase2-deployment-reconciliation',
      ...headers
    }
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get('content-type'),
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
    bytes
  };
}

async function githubJson(apiPath) {
  const response = await fetchBytes(`https://api.github.com${apiPath}`, {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${GITHUB_TOKEN}`,
    'x-github-api-version': '2022-11-28'
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${apiPath} returned ${response.status}: ${response.bytes.toString('utf8').slice(0, 400)}`);
  }
  return JSON.parse(response.bytes.toString('utf8'));
}

async function inspectTrackedPath(repositoryPath, attempt) {
  const sourceUrl = `https://raw.githubusercontent.com/${REPOSITORY}/${EXPECTED_MAIN_HEAD}${repositoryPath}`;
  const liveUrl = new URL(repositoryPath, LIVE_ORIGIN);
  liveUrl.searchParams.set('run8phase2', `${EXPECTED_MAIN_HEAD.slice(0, 12)}-${attempt}`);

  const [source, live] = await Promise.all([
    fetchBytes(sourceUrl.toString()),
    fetchBytes(liveUrl.toString())
  ]);

  const sourceSha256 = sha256(source.bytes);
  const liveSha256 = sha256(live.bytes);

  return {
    path: repositoryPath,
    sourceStatus: source.status,
    liveStatus: live.status,
    sourceContentType: source.contentType,
    liveContentType: live.contentType,
    sourceByteCount: source.bytes.length,
    liveByteCount: live.bytes.length,
    sourceSha256,
    liveSha256,
    exactByteIdentity: source.ok && live.ok && sourceSha256 === liveSha256,
    sourceText: source.bytes.toString('utf8'),
    liveText: live.bytes.toString('utf8'),
    volatile: {
      liveEtag: live.etag,
      liveLastModified: live.lastModified
    }
  };
}

async function inspectPagesMetadata() {
  const pages = await githubJson(`/repos/${REPOSITORY}/pages`);
  const latestBuild = await githubJson(`/repos/${REPOSITORY}/pages/builds/latest`);
  const deployments = await githubJson(`/repos/${REPOSITORY}/deployments?environment=github-pages&per_page=10`)
    .catch(() => []);

  return {
    pages,
    latestBuild,
    deployments: Array.isArray(deployments) ? deployments : []
  };
}

function stableFileEvidence(entry) {
  return {
    path: entry.path,
    sourceStatus: entry.sourceStatus,
    liveStatus: entry.liveStatus,
    sourceByteCount: entry.sourceByteCount,
    liveByteCount: entry.liveByteCount,
    sourceSha256: entry.sourceSha256,
    liveSha256: entry.liveSha256,
    exactByteIdentity: entry.exactByteIdentity
  };
}

function evaluateOccurrence(metadata, entries) {
  const issues = [];
  const pageSourceBranch = metadata.pages?.source?.branch ?? null;
  const pageSourcePath = metadata.pages?.source?.path ?? null;
  const pageStatus = metadata.pages?.status ?? null;
  const pageBuildType = metadata.pages?.build_type ?? null;
  const latestBuildCommit = metadata.latestBuild?.commit ?? null;
  const latestBuildStatus = metadata.latestBuild?.status ?? null;
  const deploymentCommitMatch = metadata.deployments.some((deployment) =>
    deployment?.sha === EXPECTED_MAIN_HEAD && deployment?.environment === 'github-pages');
  const latestBuildCommitMatch = latestBuildCommit === EXPECTED_MAIN_HEAD;

  if (pageSourceBranch !== 'main') issues.push('GITHUB_PAGES_SOURCE_BRANCH_NOT_MAIN');
  if (pageSourcePath !== '/') issues.push('GITHUB_PAGES_SOURCE_PATH_NOT_ROOT');
  if (!['built', 'building'].includes(pageStatus)) issues.push('GITHUB_PAGES_SITE_STATUS_NOT_ACTIVE');
  if (latestBuildStatus !== 'built') issues.push('GITHUB_PAGES_LATEST_BUILD_NOT_BUILT');
  if (!latestBuildCommitMatch && !deploymentCommitMatch) issues.push('GITHUB_PAGES_DEPLOYMENT_COMMIT_MISMATCH');

  for (const entry of entries) {
    if (entry.sourceStatus !== 200) issues.push(`MAIN_SOURCE_NOT_FETCHABLE:${entry.path}`);
    if (entry.liveStatus !== 200) issues.push(`LIVE_PATH_NOT_FETCHABLE:${entry.path}`);
    if (!entry.exactByteIdentity) issues.push(`DEPLOYED_BYTE_IDENTITY_MISMATCH:${entry.path}`);
  }

  const indexEntry = entries.find((entry) => entry.path.endsWith('/showroom/globe/h-earth/index.html'));
  const environmentEntry = entries.find((entry) => entry.path.endsWith('/functional-landscape/environment-integration.js'));
  const rendererEntry = entries.find((entry) => entry.path.endsWith('/render/run8e-successor-environment.js'));
  const transferEntry = entries.find((entry) => entry.path.endsWith('/h-earth.run8e-successor-environment-transfer.js'));
  const controlEntry = entries.find((entry) => entry.path.endsWith('/h-earth.run8e.integration-and-live-delivery.js'));
  const phase1ReceiptEntry = entries.find((entry) => entry.path.endsWith('/h-earth.run8.phase1-main-promotion.receipt.json'));

  const routeReferencesIntegration = indexEntry?.liveText.includes('./functional-landscape/environment-integration.js') === true;
  const liveEnvironmentIsRun8E = environmentEntry?.liveText.includes('H_EARTH_RUN_8E_PUBLIC_ROUTE_SUCCESSOR_ENVIRONMENT_INTEGRATION_v1') === true;
  const liveEnvironmentImportsRun8ERenderer = environmentEntry?.liveText.includes('../render/run8e-successor-environment.js') === true;
  const liveRendererIsRun8E = rendererEntry?.liveText.includes('H_EARTH_RUN_8E_SUCCESSOR_ENVIRONMENT_FRAME_AND_RENDER_INTEGRATION_v1') === true;
  const liveTransferIsRun8E = transferEntry?.liveText.includes('H_EARTH_RUN_8E_PACKET_002_SUCCESSOR_ENVIRONMENT_TRANSFER_v1') === true;
  const liveControlRecordsPhase1Pass = controlEntry?.liveText.includes("run8StackPromotionToMain: 'PASS'") === true;

  let phase1ReceiptValid = false;
  try {
    const phase1Receipt = JSON.parse(phase1ReceiptEntry?.liveText ?? '{}');
    phase1ReceiptValid =
      phase1Receipt?.status === 'RUN_8_PHASE_1_MAIN_PROMOTION_PASS' &&
      phase1Receipt?.eligible === true &&
      phase1Receipt?.verification?.missingCheckpointCount === 0;
  } catch {
    phase1ReceiptValid = false;
  }

  if (!routeReferencesIntegration) issues.push('PUBLIC_ROUTE_DOES_NOT_REFERENCE_ENVIRONMENT_INTEGRATION');
  if (!liveEnvironmentIsRun8E) issues.push('LIVE_ENVIRONMENT_INTEGRATION_NOT_RUN_8E');
  if (!liveEnvironmentImportsRun8ERenderer) issues.push('LIVE_ENVIRONMENT_DOES_NOT_IMPORT_RUN_8E_RENDERER');
  if (!liveRendererIsRun8E) issues.push('LIVE_RENDERER_NOT_RUN_8E');
  if (!liveTransferIsRun8E) issues.push('LIVE_PACKET_002_TRANSFER_NOT_RUN_8E');
  if (!liveControlRecordsPhase1Pass) issues.push('LIVE_CONTROL_DOES_NOT_RECORD_PHASE_1_PASS');
  if (!phase1ReceiptValid) issues.push('LIVE_PHASE_1_PROMOTION_RECEIPT_INVALID');

  const eligible = issues.length === 0;
  return {
    eligible,
    status: eligible
      ? 'RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PASS'
      : 'RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PENDING_OR_FAIL',
    pages: {
      htmlUrl: metadata.pages?.html_url ?? null,
      sourceBranch: pageSourceBranch,
      sourcePath: pageSourcePath,
      siteStatus: pageStatus,
      buildType: pageBuildType,
      latestBuildCommit,
      latestBuildStatus,
      latestBuildCommitMatchesExpectedMain: latestBuildCommitMatch,
      matchingGithubPagesDeploymentPresent: deploymentCommitMatch
    },
    publicRoute: {
      routeReferencesEnvironmentIntegration: routeReferencesIntegration,
      environmentIntegrationIsRun8E: liveEnvironmentIsRun8E,
      environmentImportsRun8ERenderer: liveEnvironmentImportsRun8ERenderer,
      rendererIsRun8E: liveRendererIsRun8E,
      packet002TransferIsRun8E: liveTransferIsRun8E,
      controlRecordsPhase1PromotionPass: liveControlRecordsPhase1Pass,
      phase1PromotionReceiptValid: phase1ReceiptValid
    },
    files: entries.map(stableFileEvidence),
    issues
  };
}

async function evaluateAttempt(attempt) {
  const [metadata, entries] = await Promise.all([
    inspectPagesMetadata(),
    Promise.all(TRACKED_PATHS.map((repositoryPath) => inspectTrackedPath(repositoryPath, attempt)))
  ]);
  const evaluated = evaluateOccurrence(metadata, entries);
  appendLog(JSON.stringify({
    attempt,
    eligible: evaluated.eligible,
    status: evaluated.status,
    pages: evaluated.pages,
    issues: evaluated.issues,
    volatileLiveHeaders: entries.map((entry) => ({ path: entry.path, ...entry.volatile }))
  }));
  return evaluated;
}

ensureOutputDirectory();
fs.writeFileSync(LOG_PATH, '', 'utf8');

let finalEvaluation = null;
for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  try {
    finalEvaluation = await evaluateAttempt(attempt);
  } catch (error) {
    finalEvaluation = {
      eligible: false,
      status: 'RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PENDING_OR_FAIL',
      pages: {},
      publicRoute: {},
      files: [],
      issues: [`ATTEMPT_ERROR:${error instanceof Error ? error.message : String(error)}`]
    };
    appendLog(JSON.stringify({ attempt, eligible: false, issues: finalEvaluation.issues }));
  }

  if (finalEvaluation.eligible) break;
  if (attempt < MAX_ATTEMPTS) await sleep(POLL_INTERVAL_MS);
}

const receipt = {
  receiptType: 'H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_RECEIPT',
  eligible: finalEvaluation?.eligible === true,
  status: finalEvaluation?.status ?? 'RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_FAIL',
  repository: REPOSITORY,
  verifiedOn: VERIFIED_ON,
  expectedPromotedMainHead: EXPECTED_MAIN_HEAD,
  liveOrigin: LIVE_ORIGIN,
  pages: finalEvaluation?.pages ?? {},
  publicRoute: finalEvaluation?.publicRoute ?? {},
  deployedFileIdentity: finalEvaluation?.files ?? [],
  remainingRun8EClosure: {
    liveIdentityAndBrowserProof: 'NOT_EXECUTED_IN_PHASE_2',
    physicalSamsungExecution: 'NOT_EXECUTED',
    run8EPassClosed: false
  },
  issues: finalEvaluation?.issues ?? ['NO_FINAL_EVALUATION']
};

fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));

if (!receipt.eligible) {
  process.exitCode = 1;
}
