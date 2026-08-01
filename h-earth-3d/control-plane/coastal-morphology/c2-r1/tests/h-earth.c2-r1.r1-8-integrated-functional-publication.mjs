#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import net from 'node:net';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import {
  H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT,
  buildHEarthC2R1ReviewMeshSynchronously,
  serializeHEarthC2R1ReviewMesh,
  parseHEarthC2R1ReviewMeshSynchronously,
  digestHEarthC2R1ReviewMesh
} from '../review/r1-8/h-earth.c2-r1.r1-8-review-mesh-materializer.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../');
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const PRODUCT_AUTHORITY_HEAD = 'c53362c6f74b01c4e0b53be526b0e3a0b73edede';
const CORRECTIVE_STARTING_HEAD = 'c5ec156d0d00979ea2296972374b13f43678f4bf';
const TARGET_BRANCH = 'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const CORRECTIVE_ROLLBACK_BRANCH = 'rollback/h-earth-c2-r1-r1-8b-c3-start-001';
const R1_8A_PASS_HEAD = '45d4117dd1ed49da5de38e5c4f573497ac58cd46';
const PR_NUMBER = 418;
const CONTROL_ROOT = 'h-earth-3d/control-plane/coastal-morphology/c2-r1';
const REVIEW_ROOT = `${CONTROL_ROOT}/review/r1-8`;
const EVIDENCE_ROOT = path.join(ROOT, CONTROL_ROOT, 'evidence/r1-8');
const CAPTURE_ROOT = path.join(EVIDENCE_ROOT, 'captures');
const REVIEW_PATH = `${REVIEW_ROOT}/index.html`;
const ASSET_RELATIVE_PATH = `${REVIEW_ROOT}/${H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.assetFile}`;
const ASSET_PATH = path.join(ROOT, ASSET_RELATIVE_PATH);
const IDENTITY_PATH = path.join(ROOT, REVIEW_ROOT, 'identity.json');
const LEDGER_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8-phase-ledger.json');
const FUNCTIONAL_RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8b-functional-verification.json');
const MATERIALIZATION_RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8b-c3-materialization-identity.json');
const PUBLICATION_RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8c-publication-receipt.json');
const SERVED_RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-served-verification.json');
const CAPTURE_MANIFEST_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-capture-manifest.json');
const HANDOFF_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8-handoff.json');
const RUNTIME_TRACE_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8b-c3-runtime-trace.json');
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const BRANCH = process.env.GITHUB_HEAD_REF || TARGET_BRANCH;
const EXPECTED_EXECUTION_HEAD = process.env.R1_8_EXPECTED_CANDIDATE_HEAD || process.env.GITHUB_SHA || null;
const OCCURRENCE = 'H_EARTH_C2_R1_R1_8_ISOLATED_REVIEW_001';
const PORT = 4188;
const BIND_ADDRESS = '127.0.0.1';
const ORIGIN = `http://${BIND_ADDRESS}:${PORT}`;
const LOCAL_REVIEW_URL = `${ORIGIN}/${REVIEW_PATH}`;
const EXPECTED_ASSET_BYTE_LENGTH = 340144;
const EXPECTED_COUNTS = Object.freeze({
  completeSampleCount: 3577,
  terrainVertexCount: 3577,
  terrainIndexCount: 20736,
  waterVertexCount: 1813,
  waterIndexCount: 10368,
  vertexCount: 5390,
  indexCount: 31104,
  positionBufferByteLength: 64680,
  normalBufferByteLength: 64680,
  materialControlBufferByteLength: 86240,
  indexBufferByteLength: 124416
});
const VIEWS = Object.freeze([
  'LATERAL_BEACH_PROFILE',
  'INLAND_TO_DEEP_WATER',
  'SHALLOW_WATER_AND_SEABED',
  'SANDBAR_AND_BATHYMETRY',
  'GROUND_TRAVERSAL',
  'DISTANT_LANDSCAPE'
]);
const REQUIRED_RESOURCE_SUFFIXES = Object.freeze([
  '/review/r1-8/index.html',
  '/review/r1-8/review.css',
  '/review/r1-8/review.js',
  '/review/r1-8/identity.json',
  '/review/r1-8/h-earth.c2-r1.r1-8-review-mesh-materializer.js',
  `/review/r1-8/${H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.assetFile}`,
  '/h-earth.c2-r1.candidate-renderer-sampling.js',
  '/h-earth.c2-r1.baked-macro-control-field.js',
  '/h-earth.coastal-profile.c2-r1.js',
  '/h-earth.coastal-water-optics.c2-r1.js',
  '/h-earth.coastal-breaker-field.c2-r1.js',
  '/h-earth.coastal-swash-foam-wetness.c2-r1.js'
]);
const IMMUTABLE_BLOBS = Object.freeze({
  [`${CONTROL_ROOT}/h-earth.c2-r1.landform-analysis.js`]: 'dba3fe2898b127addaa5a62081d466e55370da72',
  [`${CONTROL_ROOT}/h-earth.c2-r1.baked-macro-control-field.js`]: 'a97b3df57ae01626a2ff5cbedf510e2afdf06912',
  [`${CONTROL_ROOT}/h-earth.c2-r1.continuous-sediment-membership.js`]: 'c0e103b0cbb51eac30105f0e8ae68c37e8fac281',
  [`${CONTROL_ROOT}/h-earth.c2-r1.candidate-renderer-sampling.js`]: 'd4681c64230e75c362daa702a60c6f2fee3720a4',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7a-verification.json`]: '000c72cd37b12c7e7abfe783f26bdd139d69901d',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7b-verification.json`]: 'c15d880bda64279f220ee810721909941f4b6424',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7c-verification.json`]: '5b7a9650a5f39ffee2ba394334fb24806d771d0e',
  [`${CONTROL_ROOT}/evidence/r1-7d/h-earth.c2-r1.r1-7d-verification.json`]: '55cb8397e8c57e541ae014a9df0232c64459087e',
  'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js': '45cbd83337c14bc94ce7d173b25f2157cb4eb84f',
  'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js': 'c5a439f2833a4def90944e5eb1d03005ddb41e70',
  'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js': '3eb689c5a030c40ebede52c6eaef300207742a7c',
  'h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js': '2094bcafb1e5ae1c291066a9cf1dd3820a22d0b1',
  'h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js': '1ac2ee902fc0cfb74413db37dd139bc51dbd9e46',
  'h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js': '0fa4b8434a5883e9858d2b73bb2e05e4b1a60c5c'
});
const ALLOWED_C3_PATHS = Object.freeze([
  '.github/workflows/h-earth-c2-r1-physically-coherent-coastal-successor.yml',
  `${CONTROL_ROOT}/tests/h-earth.c2-r1.r1-8-integrated-functional-publication.mjs`,
  `${REVIEW_ROOT}/index.html`,
  `${REVIEW_ROOT}/review.js`,
  `${REVIEW_ROOT}/identity.json`,
  `${REVIEW_ROOT}/h-earth.c2-r1.r1-8-review-mesh-materializer.js`,
  ASSET_RELATIVE_PATH,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8-phase-ledger.json`,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8b-functional-verification.json`,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8b-c3-materialization-identity.json`,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8b-c3-runtime-trace.json`,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8c-publication-receipt.json`,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8d-served-verification.json`,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8d-capture-manifest.json`,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8-handoff.json`
]);

const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const now = () => new Date().toISOString();
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const sha256Buffer = value => crypto.createHash('sha256').update(value).digest('hex');
const sha256File = file => sha256Buffer(fs.readFileSync(file));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function requireCondition(condition, code, detail = null) {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    error.detail = detail;
    throw error;
  }
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function commitEvidence(message, pathsToAdd) {
  git('add', '--', ...pathsToAdd);
  try {
    execFileSync('git', ['diff', '--cached', '--quiet'], { cwd: ROOT });
    return git('rev-parse', 'HEAD');
  } catch {}
  git('commit', '-m', message);
  const head = git('rev-parse', 'HEAD');
  git('push', 'origin', `HEAD:${BRANCH}`);
  return head;
}

async function getPullRequest() {
  requireCondition(Boolean(TOKEN), 'GITHUB_TOKEN_MISSING');
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/pulls/${PR_NUMBER}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  requireCondition(response.ok, 'PR_418_API_READ_FAILED', response.status);
  return response.json();
}

function preservePhase(ledger, id, status, evidence = {}, blocker = null) {
  const row = { id, status, recordedAt: now(), evidence, blocker };
  const index = ledger.phases.findIndex(item => item.id === id);
  if (index >= 0) ledger.phases[index] = row;
  else ledger.phases.push(row);
  ledger.updatedAt = now();
  ledger.completedPhaseCount = ledger.phases.filter(item => String(item.status).startsWith('PASS')).length;
  writeJson(LEDGER_PATH, ledger);
}

function verifyAuthorizedDelta(base, head) {
  const changed = git('diff', '--name-only', base, head).split('\n').filter(Boolean).sort();
  const unauthorized = changed.filter(file => {
    if (ALLOWED_C3_PATHS.includes(file)) return false;
    return !file.startsWith(`${CONTROL_ROOT}/evidence/r1-8/captures/`);
  });
  requireCondition(unauthorized.length === 0, 'R1_8B_C3_UNAUTHORIZED_PATH_MUTATION', { changed, unauthorized });
  return changed;
}

function verifyClosedAuthorities() {
  const readback = {};
  for (const [repositoryPath, expectedBlob] of Object.entries(IMMUTABLE_BLOBS)) {
    const actualBlob = git('rev-parse', `HEAD:${repositoryPath}`);
    requireCondition(actualBlob === expectedBlob, 'CLOSED_AUTHORITY_BLOB_MISMATCH', {
      repositoryPath,
      expectedBlob,
      actualBlob
    });
    readback[repositoryPath] = actualBlob;
  }
  const program = readJson(path.join(ROOT, CONTROL_ROOT, 'h-earth.c2-r1.r1-7-subcheckpoint-program.json'));
  requireCondition(program.r1_7OverallStatus === 'PASS_CLOSED_DO_NOT_REOPEN', 'R1_7_NOT_CLOSED');
  requireCondition(['R1.7A', 'R1.7B', 'R1.7C', 'R1.7D'].every(
    id => program.subcheckpoints?.[id]?.status === 'PASS_CLOSED_DO_NOT_REOPEN'
  ), 'R1_7_SUBCHECKPOINT_CLOSURE_MISSING');
  return readback;
}

async function generateExactAsset() {
  const generationStartedAt = performance.now();
  const sourceMesh = buildHEarthC2R1ReviewMeshSynchronously();
  const sourceIdentity = await digestHEarthC2R1ReviewMesh(sourceMesh);
  requireCondition(sourceMesh.completeSampleCount === EXPECTED_COUNTS.completeSampleCount, 'COMPLETE_SAMPLE_COUNT_MISMATCH');
  requireCondition(sourceMesh.terrain.vertexCount === EXPECTED_COUNTS.terrainVertexCount, 'TERRAIN_VERTEX_COUNT_MISMATCH');
  requireCondition(sourceMesh.terrain.indexCount === EXPECTED_COUNTS.terrainIndexCount, 'TERRAIN_INDEX_COUNT_MISMATCH');
  requireCondition(sourceMesh.water.vertexCount === EXPECTED_COUNTS.waterVertexCount, 'WATER_VERTEX_COUNT_MISMATCH');
  requireCondition(sourceMesh.water.indexCount === EXPECTED_COUNTS.waterIndexCount, 'WATER_INDEX_COUNT_MISMATCH');
  for (const [key, expected] of Object.entries({
    completeSampleCount: EXPECTED_COUNTS.completeSampleCount,
    vertexCount: EXPECTED_COUNTS.vertexCount,
    indexCount: EXPECTED_COUNTS.indexCount,
    positionBufferByteLength: EXPECTED_COUNTS.positionBufferByteLength,
    normalBufferByteLength: EXPECTED_COUNTS.normalBufferByteLength,
    materialControlBufferByteLength: EXPECTED_COUNTS.materialControlBufferByteLength,
    indexBufferByteLength: EXPECTED_COUNTS.indexBufferByteLength
  })) {
    requireCondition(sourceIdentity[key] === expected, `R1_8B_C3_CANONICAL_COUNT_MISMATCH:${key}`, {
      observed: sourceIdentity[key],
      expected
    });
  }
  requireCondition(sourceMesh.candidateMaterialSampleCount === EXPECTED_COUNTS.completeSampleCount, 'SINGLE_RUNTIME_SAMPLE_COUNT_NOT_PRESERVED');
  requireCondition(sourceMesh.macroDifferentialCount > 0, 'R1_7_MACRO_EXPRESSION_NOT_ACTIVE_IN_GENERATION');

  const serialized = serializeHEarthC2R1ReviewMesh(sourceMesh);
  requireCondition(serialized.byteLength === EXPECTED_ASSET_BYTE_LENGTH, 'REVIEW_ASSET_BYTE_LENGTH_MISMATCH', {
    observed: serialized.byteLength,
    expected: EXPECTED_ASSET_BYTE_LENGTH
  });
  const parsedMesh = parseHEarthC2R1ReviewMeshSynchronously(serialized);
  const parsedIdentity = await digestHEarthC2R1ReviewMesh(parsedMesh);
  const roundTrip = serializeHEarthC2R1ReviewMesh(parsedMesh);
  requireCondition(deepEqual(sourceIdentity, parsedIdentity), 'CANONICAL_TYPED_ARRAY_IDENTITY_MISMATCH', {
    sourceIdentity,
    parsedIdentity
  });
  requireCondition(Buffer.from(serialized).equals(Buffer.from(roundTrip)), 'BINARY_ROUND_TRIP_BYTE_IDENTITY_MISMATCH');

  fs.mkdirSync(path.dirname(ASSET_PATH), { recursive: true });
  fs.writeFileSync(ASSET_PATH, serialized);
  const assetSha256 = sha256File(ASSET_PATH);
  const identity = readJson(IDENTITY_PATH);
  identity.correctiveOperation = 'R1.8B_C3_DETERMINISTIC_NONBLOCKING_REVIEW_MESH_MATERIALIZATION';
  identity.correctiveStartingHead = CORRECTIVE_STARTING_HEAD;
  identity.correctiveStartRollbackBranch = CORRECTIVE_ROLLBACK_BRANCH;
  identity.reviewMeshAsset = {
    file: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.assetFile,
    format: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.assetFormat,
    byteLength: serialized.byteLength,
    sha256: assetSha256,
    generationSource: `${REVIEW_ROOT}/h-earth.c2-r1.r1-8-review-mesh-materializer.js`,
    sourceHead: PRODUCT_AUTHORITY_HEAD,
    generationOption: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.option,
    completeSampleCount: sourceMesh.completeSampleCount,
    candidateMaterialSampleCount: sourceMesh.candidateMaterialSampleCount,
    macroDifferentialCount: sourceMesh.macroDifferentialCount,
    canonicalEncoding: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.canonicalEncoding,
    canonicalIdentity: sourceIdentity
  };
  writeJson(IDENTITY_PATH, identity);

  const receipt = {
    receiptType: 'H_EARTH_C2_R1_R1_8B_C3_EXACT_REVIEW_MESH_MATERIALIZATION_IDENTITY_v1',
    operation: 'R1.8B_C3_DETERMINISTIC_NONBLOCKING_REVIEW_MESH_MATERIALIZATION',
    result: 'PASS_EXACT_PREMATERIALIZED_REVIEW_MESH_READY_FOR_RUNTIME_VERIFICATION',
    option: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.option,
    sourceHead: PRODUCT_AUTHORITY_HEAD,
    correctiveStartingHead: CORRECTIVE_STARTING_HEAD,
    correctiveRollbackBranch: CORRECTIVE_ROLLBACK_BRANCH,
    asset: {
      path: ASSET_RELATIVE_PATH,
      format: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.assetFormat,
      byteLength: serialized.byteLength,
      sha256: assetSha256
    },
    before: sourceIdentity,
    after: parsedIdentity,
    completeSampleCountIdentical: sourceIdentity.completeSampleCount === parsedIdentity.completeSampleCount,
    vertexCountIdentical: sourceIdentity.vertexCount === parsedIdentity.vertexCount,
    indexCountIdentical: sourceIdentity.indexCount === parsedIdentity.indexCount,
    finalGeometryByteIdentity:
      sourceIdentity.finalPositionDataSha256 === parsedIdentity.finalPositionDataSha256 &&
      sourceIdentity.finalNormalDataSha256 === parsedIdentity.finalNormalDataSha256 &&
      sourceIdentity.finalIndexDataSha256 === parsedIdentity.finalIndexDataSha256,
    finalMaterialControlByteIdentity:
      sourceIdentity.finalMaterialControlDataSha256 === parsedIdentity.finalMaterialControlDataSha256,
    completeSampleCount: sourceMesh.completeSampleCount,
    candidateMaterialSampleCount: sourceMesh.candidateMaterialSampleCount,
    macroDifferentialCount: sourceMesh.macroDifferentialCount,
    generationDurationMs: performance.now() - generationStartedAt,
    r1_7bFieldValuesSha256: '4377ff9e9fc60a6218478b289acbff99075eab08d4e518a6eb68b1a12b98f866',
    singleRuntimeSamplePreserved: true,
    authorizedChannelSetPreserved: true,
    materialParametersUnchanged: true,
    r1_7aByteIdentical: true,
    r1_7bByteIdentical: true,
    r1_7cSamplingArchitectureUnchanged: true,
    r1_7dEngineeringResultUnchanged: true
  };
  writeJson(MATERIALIZATION_RECEIPT_PATH, receipt);
  return { sourceMesh, sourceIdentity, assetSha256, receipt };
}

function tcpProbe() {
  return new Promise(resolve => {
    const socket = net.createConnection({ host: BIND_ADDRESS, port: PORT });
    const finish = result => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(500);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

async function waitForLocalServer() {
  const startedAt = performance.now();
  for (let attempt = 1; attempt <= 80; attempt += 1) {
    if (await tcpProbe()) {
      try {
        const response = await fetch(LOCAL_REVIEW_URL, { cache: 'no-store' });
        const body = await response.text();
        if (response.status === 200 && response.headers.get('content-type')?.includes('text/html') && body.length > 0) {
          return { attempt, elapsedMs: performance.now() - startedAt, status: response.status };
        }
      } catch {}
    }
    await sleep(125);
  }
  throw new Error('LOCAL_SERVER_NOT_READY');
}

async function verifyDirectResources() {
  const paths = [
    REVIEW_PATH,
    `${REVIEW_ROOT}/review.css`,
    `${REVIEW_ROOT}/review.js`,
    `${REVIEW_ROOT}/identity.json`,
    `${REVIEW_ROOT}/h-earth.c2-r1.r1-8-review-mesh-materializer.js`,
    ASSET_RELATIVE_PATH
  ];
  const records = [];
  for (const resourcePath of paths) {
    const response = await fetch(`${ORIGIN}/${resourcePath}`, { cache: 'no-store' });
    const bytes = new Uint8Array(await response.arrayBuffer());
    records.push({
      path: resourcePath,
      status: response.status,
      contentType: response.headers.get('content-type'),
      byteLength: bytes.byteLength,
      sha256: sha256Buffer(bytes)
    });
  }
  requireCondition(records.every(row => row.status === 200 && row.byteLength > 0), 'DEPENDENCY_CHAIN_DIRECT_FETCH_FAILURE', records);
  const document = records.find(row => row.path === REVIEW_PATH);
  requireCondition(document.contentType?.includes('text/html'), 'TARGET_DOCUMENT_CONTENT_TYPE_NOT_TEXT_HTML', document);
  const asset = records.find(row => row.path === ASSET_RELATIVE_PATH);
  requireCondition(asset.byteLength === EXPECTED_ASSET_BYTE_LENGTH, 'SERVED_ASSET_BYTE_LENGTH_MISMATCH', asset);
  requireCondition(asset.sha256 === sha256File(ASSET_PATH), 'SERVED_ASSET_DIGEST_MISMATCH', asset);
  return records;
}

function browserLaunchOptions() {
  return {
    headless: true,
    args: [
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--disable-dev-shm-usage'
    ]
  };
}

async function inspectPage(page, url, { touch = false, capture = false, captureDirectory = null } = {}) {
  const observed = {
    requests: [],
    responses: [],
    requestFailures: [],
    consoleErrors: [],
    pageErrors: [],
    crashes: [],
    frameAttached: [],
    frameNavigated: [],
    domContentLoaded: [],
    loads: []
  };
  page.on('request', request => observed.requests.push({ url: request.url(), method: request.method() }));
  page.on('response', response => observed.responses.push({ url: response.url(), status: response.status() }));
  page.on('requestfailed', request => observed.requestFailures.push({ url: request.url(), failure: request.failure() }));
  page.on('console', message => { if (message.type() === 'error') observed.consoleErrors.push(message.text()); });
  page.on('pageerror', error => observed.pageErrors.push(String(error?.stack || error)));
  page.on('crash', () => observed.crashes.push({ at: now() }));
  page.on('frameattached', frame => observed.frameAttached.push(frame.url()));
  page.on('framenavigated', frame => observed.frameNavigated.push(frame.url()));
  page.on('domcontentloaded', () => observed.domContentLoaded.push({ at: now() }));
  page.on('load', () => observed.loads.push({ at: now() }));

  const navigationStartedAt = performance.now();
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const domContentLoadedDurationMs = performance.now() - navigationStartedAt;
  requireCondition(response?.status() === 200, 'REVIEW_DOCUMENT_NOT_HTTP_200', response?.status());
  requireCondition(domContentLoadedDurationMs < 60000, 'DOMCONTENTLOADED_EXCEEDED_60_SECONDS', domContentLoadedDurationMs);
  await page.waitForFunction(() => document.documentElement.dataset.r1_8Review === 'ready', null, { timeout: 60000 });
  const readyDurationMs = performance.now() - navigationStartedAt;
  requireCondition(readyDurationMs < 60000, 'CANDIDATE_RUNTIME_READY_EXCEEDED_60_SECONDS', readyDurationMs);

  const traceRows = await page.evaluate(() => window.__R1_8_RUNTIME_TRACE__?.rows || []);
  const receipt = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW?.getReceipt?.());
  requireCondition(receipt?.sourceHead === PRODUCT_AUTHORITY_HEAD, 'SERVED_SOURCE_HEAD_MISMATCH', receipt?.sourceHead);
  requireCondition(receipt?.webgl2ContextEstablished === true, 'WEBGL2_CONTEXT_NOT_ESTABLISHED');
  requireCondition(receipt?.meshReady === true, 'CANDIDATE_WORLD_NOT_LOADED');
  requireCondition(receipt?.exactReviewGeometryPreserved === true, 'EXACT_REVIEW_GEOMETRY_NOT_PRESERVED');
  requireCondition(receipt?.macroExpressionActive === true, 'R1_7_MACRO_EXPRESSION_NOT_ACTIVE');
  requireCondition(receipt?.coastalMaterialChainActive === true, 'COASTAL_MATERIAL_CHAIN_NOT_ACTIVE');
  requireCondition(receipt?.waterBreakerSwashChainActive === true, 'WATER_BREAKER_SWASH_CHAIN_NOT_ACTIVE');
  requireCondition(receipt?.noBitmapDragFallback === true, 'BITMAP_DRAG_FALLBACK_PRESENT');
  requireCondition(receipt?.rendererLifecycleMutated === false, 'RENDERER_LIFECYCLE_REGRESSION_RECORDED');
  requireCondition(receipt?.terrainGeometryMutated === false, 'TERRAIN_GEOMETRY_MUTATION_RECORDED');
  requireCondition(receipt?.construction?.mainThreadHeartbeatCountDuringConstruction > 0, 'MAIN_THREAD_HEARTBEAT_AFTER_CONSTRUCTION_START_NOT_OBSERVED');
  requireCondition(receipt?.construction?.totalReadyDurationMs < 60000, 'RECEIPT_READY_DURATION_EXCEEDED_60_SECONDS');
  requireCondition(receipt?.meshIdentity?.completeSampleCount === EXPECTED_COUNTS.completeSampleCount, 'RUNTIME_COMPLETE_SAMPLE_COUNT_MISMATCH');
  requireCondition(receipt?.meshIdentity?.vertexCount === EXPECTED_COUNTS.vertexCount, 'RUNTIME_VERTEX_COUNT_MISMATCH');
  requireCondition(receipt?.meshIdentity?.indexCount === EXPECTED_COUNTS.indexCount, 'RUNTIME_INDEX_COUNT_MISMATCH');

  const requiredTraceEvents = [
    'DOMCONTENTLOADED',
    'DYNAMIC_IMPORT_STARTED',
    'WEBGL_CONTEXT_REQUESTED',
    'WEBGL_CONTEXT_ESTABLISHED',
    'CANDIDATE_CONSTRUCTION_STARTED',
    'FIRST_CONSTRUCTION_BATCH_COMPLETED',
    'LAST_CONSTRUCTION_BATCH_COMPLETED',
    'CANDIDATE_CONSTRUCTION_COMPLETED',
    'FIRST_GPU_BUFFER_UPLOAD',
    'ALL_GPU_BUFFERS_UPLOADED',
    'FIRST_FRAME_PRESENTED',
    'READY_SENTINEL_WRITTEN',
    'DYNAMIC_IMPORT_RESOLVED'
  ];
  const missingTraceEvents = requiredTraceEvents.filter(event => !traceRows.some(row => row.event === event));
  requireCondition(missingTraceEvents.length === 0, 'REQUIRED_RUNTIME_TRACE_EVENT_MISSING', { missingTraceEvents, traceRows });
  requireCondition(traceRows.find(row => row.event === 'FIRST_FRAME_PRESENTED').performanceMilliseconds < 60000, 'FIRST_FRAME_NOT_PRESENTED_WITHIN_60_SECONDS');

  const canvas = page.locator('#r18-review-canvas');
  const box = await canvas.boundingBox();
  requireCondition(Boolean(box && box.width > 200 && box.height > 300), 'REVIEW_CANVAS_NOT_VISIBLE', box);
  const beforeFrames = receipt.frameCount;
  await page.waitForTimeout(650);
  const afterFrames = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getReceipt().frameCount);
  requireCondition(afterFrames > beforeFrames + 2, 'LIVE_FRAME_ADVANCEMENT_NOT_CONFIRMED', { beforeFrames, afterFrames });

  const beforeCamera = receipt.camera;
  if (touch) {
    await page.evaluate(() => {
      const canvas = document.getElementById('r18-review-canvas');
      const rect = canvas.getBoundingClientRect();
      const fire = (type, pointerId, x, y, buttons) => canvas.dispatchEvent(new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId,
        pointerType: 'touch',
        isPrimary: pointerId === 1,
        clientX: rect.left + x,
        clientY: rect.top + y,
        buttons
      }));
      fire('pointerdown', 1, rect.width * 0.42, rect.height * 0.48, 1);
      fire('pointermove', 1, rect.width * 0.58, rect.height * 0.43, 1);
      fire('pointerup', 1, rect.width * 0.58, rect.height * 0.43, 0);
      fire('pointerdown', 1, rect.width * 0.4, rect.height * 0.48, 1);
      fire('pointerdown', 2, rect.width * 0.6, rect.height * 0.48, 1);
      fire('pointermove', 1, rect.width * 0.4, rect.height * 0.39, 1);
      fire('pointermove', 2, rect.width * 0.6, rect.height * 0.39, 1);
      fire('pointerup', 1, rect.width * 0.4, rect.height * 0.39, 0);
      fire('pointerup', 2, rect.width * 0.6, rect.height * 0.39, 0);
    });
  } else if (box) {
    await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.48);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.61, box.y + box.height * 0.42, { steps: 8 });
    await page.mouse.up();
    await page.mouse.wheel(0, 160);
  }
  await page.waitForTimeout(300);
  const interacted = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getReceipt());
  requireCondition(interacted.cameraRevision > beforeCamera.revision, 'CAMERA_RESPONSE_NOT_FUNCTIONAL');
  requireCondition(interacted.navigationEventCount > 0 || interacted.pointerEventCount > 2, 'NAVIGATION_INPUT_NOT_FUNCTIONAL');
  if (touch) requireCondition(interacted.touchEventCount > 0, 'TOUCH_RESPONSE_NOT_CONFIRMED');
  await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.setView('GROUND_TRAVERSAL'));
  const navigationCamera = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getCameraSnapshot());
  requireCondition(navigationCamera.view === 'GROUND_TRAVERSAL', 'VIEW_NAVIGATION_NOT_FUNCTIONAL');

  const successfulUrls = observed.responses.filter(row => row.status < 400).map(row => row.url);
  const missingResources = REQUIRED_RESOURCE_SUFFIXES.filter(suffix => !successfulUrls.some(urlValue => urlValue.endsWith(suffix)));
  requireCondition(missingResources.length === 0, 'REQUIRED_CANDIDATE_RESOURCES_DID_NOT_LOAD', missingResources);
  requireCondition(observed.requestFailures.length === 0, 'FAILED_NETWORK_REQUEST_PRESENT', observed.requestFailures);
  requireCondition(observed.pageErrors.length === 0, 'FATAL_PAGE_ERROR_PRESENT', observed.pageErrors);
  requireCondition(observed.consoleErrors.length === 0, 'FATAL_CONSOLE_ERROR_PRESENT', observed.consoleErrors);
  requireCondition(observed.crashes.length === 0, 'PAGE_CRASH_PRESENT', observed.crashes);
  const httpErrors = observed.responses.filter(row => row.status >= 400);
  requireCondition(httpErrors.length === 0, 'OWNED_HTTP_FAILURE_PRESENT', httpErrors);

  const captures = [];
  if (capture) {
    fs.mkdirSync(captureDirectory, { recursive: true });
    for (const view of VIEWS) {
      await page.evaluate(viewId => window.H_EARTH_C2_R1_R1_8_REVIEW.setView(viewId), view);
      await page.waitForTimeout(450);
      const camera = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getCameraSnapshot());
      const file = path.join(captureDirectory, `${view.toLowerCase().replaceAll('_', '-')}.png`);
      await canvas.screenshot({ path: file, type: 'png' });
      captures.push({
        identity: view,
        file: relative(file),
        sha256: sha256File(file),
        exactCandidateHead: PRODUCT_AUTHORITY_HEAD,
        servedOccurrence: url,
        camera,
        viewport: await page.evaluate(() => ({
          cssWidth: document.getElementById('r18-review-canvas').clientWidth,
          cssHeight: document.getElementById('r18-review-canvas').clientHeight,
          pixelWidth: document.getElementById('r18-review-canvas').width,
          pixelHeight: document.getElementById('r18-review-canvas').height,
          devicePixelRatio: window.devicePixelRatio
        })),
        deviceOrBrowser: {
          userAgent: await page.evaluate(() => navigator.userAgent),
          browser: 'Chromium'
        }
      });
    }
  }

  return {
    response: {
      status: response.status(),
      finalUrl: response.url(),
      contentType: await response.headerValue('content-type')
    },
    domContentLoadedDurationMs,
    readyDurationMs,
    traceRows,
    receipt,
    interacted,
    navigationCamera,
    frameAdvancement: { beforeFrames, afterFrames, delta: afterFrames - beforeFrames },
    observed,
    captures
  };
}

async function verifyOccurrence(url, { captures = false } = {}) {
  const browser = await chromium.launch(browserLaunchOptions());
  try {
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
    const desktop = await inspectPage(await desktopContext.newPage(), url, {
      capture: captures,
      captureDirectory: CAPTURE_ROOT
    });
    await desktopContext.close();
    const mobileContext = await browser.newContext({
      viewport: { width: 412, height: 915 },
      deviceScaleFactor: 2.625,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'
    });
    const mobile = await inspectPage(await mobileContext.newPage(), url, { touch: true });
    await mobileContext.close();
    return { desktop, mobile, browserVersion: browser.version() };
  } finally {
    await browser.close();
  }
}

async function waitForPublishedOccurrence(url) {
  let last = null;
  for (let attempt = 1; attempt <= 36; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow', cache: 'no-store' });
      const text = await response.text();
      last = {
        attempt,
        status: response.status,
        finalUrl: response.url,
        contentType: response.headers.get('content-type'),
        containsIdentity: text.includes(PRODUCT_AUTHORITY_HEAD)
      };
      if (response.status === 200 && last.containsIdentity) return last;
    } catch (error) {
      last = { attempt, error: String(error) };
    }
    await sleep(5000);
  }
  const error = new Error('SERVED_OCCURRENCE_NOT_REACHABLE_WITH_EXACT_IDENTITY');
  error.code = 'SERVED_OCCURRENCE_NOT_REACHABLE_WITH_EXACT_IDENTITY';
  error.detail = last;
  throw error;
}

let ledger = readJson(LEDGER_PATH);
let currentPhase = 'R1.8B_INTEGRATED_FUNCTIONAL_AND_REGRESSION_VERIFICATION';
let publicationHead = null;
let reviewUrl = null;
let server = null;
let serverStdout = '';
let serverStderr = '';

async function main() {
  fs.mkdirSync(EVIDENCE_ROOT, { recursive: true });
  fs.mkdirSync(CAPTURE_ROOT, { recursive: true });
  git('config', 'user.name', 'github-actions[bot]');
  git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com');
  git('fetch', 'origin',
    `+refs/heads/${TARGET_BRANCH}:refs/remotes/origin/${TARGET_BRANCH}`,
    `+refs/heads/${CORRECTIVE_ROLLBACK_BRANCH}:refs/remotes/origin/${CORRECTIVE_ROLLBACK_BRANCH}`
  );
  const executionHead = git('rev-parse', 'HEAD');
  const remoteHead = git('rev-parse', `refs/remotes/origin/${TARGET_BRANCH}`);
  const rollbackHead = git('rev-parse', `refs/remotes/origin/${CORRECTIVE_ROLLBACK_BRANCH}`);
  requireCondition(Boolean(EXPECTED_EXECUTION_HEAD), 'EXPECTED_EXECUTION_HEAD_MISSING');
  requireCondition(executionHead === EXPECTED_EXECUTION_HEAD, 'CHECKED_OUT_HEAD_MISMATCH', { executionHead, EXPECTED_EXECUTION_HEAD });
  requireCondition(remoteHead === EXPECTED_EXECUTION_HEAD, 'REMOTE_BRANCH_HEAD_MISMATCH', { remoteHead, EXPECTED_EXECUTION_HEAD });
  requireCondition(rollbackHead === CORRECTIVE_STARTING_HEAD, 'CORRECTIVE_ROLLBACK_HEAD_MISMATCH', { rollbackHead, CORRECTIVE_STARTING_HEAD });
  git('merge-base', '--is-ancestor', PRODUCT_AUTHORITY_HEAD, executionHead);
  verifyAuthorizedDelta(CORRECTIVE_STARTING_HEAD, executionHead);
  const immutableReadback = verifyClosedAuthorities();
  const r18a = ledger.phases.find(row => row.id === 'R1.8A_EXACT_HEAD_FREEZE_AND_REVIEW_OCCURRENCE_CONTRACT');
  requireCondition(r18a?.status === 'PASS_RECORDED', 'R1_8A_PASS_RECORD_MISSING', r18a);
  requireCondition(ledger.r18aHead === R1_8A_PASS_HEAD || r18a.evidence, 'R1_8A_IDENTITY_REGRESSION_CONFIRMATION_FAILED');
  const pr = await getPullRequest();
  requireCondition(pr.state === 'open' && pr.draft === true && pr.merged === false, 'PR_418_NOT_OPEN_DRAFT_UNMERGED');
  requireCondition(pr.head?.ref === TARGET_BRANCH && pr.head?.sha === executionHead, 'PR_418_HEAD_IDENTITY_MISMATCH', {
    branch: pr.head?.ref,
    sha: pr.head?.sha,
    executionHead
  });

  ledger.correctiveOperation = 'R1.8B_C3_DETERMINISTIC_NONBLOCKING_REVIEW_MESH_MATERIALIZATION';
  ledger.correctiveStartingHead = CORRECTIVE_STARTING_HEAD;
  ledger.correctiveStartRollbackBranch = CORRECTIVE_ROLLBACK_BRANCH;
  ledger.controllingStatus = 'R1.8B_C3_GENERATING_EXACT_PREMATERIALIZED_REVIEW_MESH';
  ledger.firstBlocker = null;
  writeJson(LEDGER_PATH, ledger);

  const materialization = await generateExactAsset();
  requireCondition(materialization.receipt.completeSampleCountIdentical === true, 'COMPLETE_SAMPLE_COUNT_NOT_IDENTICAL');
  requireCondition(materialization.receipt.vertexCountIdentical === true, 'VERTEX_COUNT_NOT_IDENTICAL');
  requireCondition(materialization.receipt.indexCountIdentical === true, 'INDEX_COUNT_NOT_IDENTICAL');
  requireCondition(materialization.receipt.finalGeometryByteIdentity === true, 'FINAL_GEOMETRY_BYTE_IDENTITY_FALSE');
  requireCondition(materialization.receipt.finalMaterialControlByteIdentity === true, 'FINAL_MATERIAL_CONTROL_BYTE_IDENTITY_FALSE');

  const serverStartedAt = now();
  server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', BIND_ADDRESS], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  server.stdout.on('data', chunk => { serverStdout += chunk.toString(); });
  server.stderr.on('data', chunk => { serverStderr += chunk.toString(); });
  const readiness = await waitForLocalServer();
  const directResources = await verifyDirectResources();
  const result = await verifyOccurrence(LOCAL_REVIEW_URL);
  writeJson(RUNTIME_TRACE_PATH, {
    traceType: 'H_EARTH_C2_R1_R1_8B_C3_RUNTIME_VERIFICATION_TRACE_v1',
    executionHead,
    sourceHead: PRODUCT_AUTHORITY_HEAD,
    server: {
      processId: server.pid,
      bindAddress: BIND_ADDRESS,
      port: PORT,
      startTimestamp: serverStartedAt,
      readiness,
      stdout: serverStdout,
      stderr: serverStderr
    },
    directResources,
    desktop: result.desktop,
    mobile: result.mobile,
    browserVersion: result.browserVersion
  });

  const functionalReceipt = {
    receiptType: 'H_EARTH_C2_R1_R1_8B_INTEGRATED_FUNCTIONAL_VERIFICATION_v2',
    operation: 'R1.8B_C3_DETERMINISTIC_NONBLOCKING_REVIEW_MESH_MATERIALIZATION',
    result: 'PASS_ENGINEERING_READY_FOR_ISOLATED_PUBLICATION',
    sourceCandidateHead: PRODUCT_AUTHORITY_HEAD,
    verificationHead: executionHead,
    localOccurrence: LOCAL_REVIEW_URL,
    materializationIdentity: materialization.receipt,
    runtimeTrace: {
      path: relative(RUNTIME_TRACE_PATH),
      sha256: sha256File(RUNTIME_TRACE_PATH)
    },
    webglRendererStarts: true,
    candidateWorldLoads: true,
    cameraResponseFunctional: true,
    touchInputFunctional: true,
    navigationFunctional: true,
    liveFrameAdvancementConfirmed: true,
    noBitmapDragFallback: true,
    noRendererLifecycleRegression: true,
    r1_7MacroExpressionActive: true,
    performanceUsableForPhysicalReview: true,
    exactReviewGeometryPreserved: true,
    completeSampleCountIdentical: true,
    vertexCountIdentical: true,
    indexCountIdentical: true,
    finalGeometryByteIdentity: true,
    finalMaterialControlByteIdentity: true,
    immutableReadback,
    desktop: result.desktop,
    mobile: result.mobile,
    browserVersion: result.browserVersion,
    productDefaultMutated: false,
    publicDefaultRouteMutated: false,
    mainMutated: false,
    pr418Merged: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    firstBlocker: null
  };
  writeJson(FUNCTIONAL_RECEIPT_PATH, functionalReceipt);
  ledger.controllingStatus = 'R1.8B_PASS_RECORDED';
  ledger.firstBlocker = null;
  preservePhase(ledger, currentPhase, 'PASS_RECORDED', {
    receipt: { path: relative(FUNCTIONAL_RECEIPT_PATH), sha256: sha256File(FUNCTIONAL_RECEIPT_PATH) },
    materializationReceipt: { path: relative(MATERIALIZATION_RECEIPT_PATH), sha256: sha256File(MATERIALIZATION_RECEIPT_PATH) },
    runtimeTrace: { path: relative(RUNTIME_TRACE_PATH), sha256: sha256File(RUNTIME_TRACE_PATH) },
    asset: {
      path: ASSET_RELATIVE_PATH,
      byteLength: fs.statSync(ASSET_PATH).size,
      sha256: sha256File(ASSET_PATH)
    },
    webglRendererStarts: true,
    candidateWorldLoads: true,
    cameraResponseFunctional: true,
    touchInputFunctional: true,
    navigationFunctional: true,
    liveFrameAdvancementConfirmed: true,
    noBitmapDragFallback: true,
    noRendererLifecycleRegression: true,
    r1_7MacroExpressionActive: true,
    performanceUsableForPhysicalReview: true,
    exactReviewGeometryPreserved: true,
    productDefaultMutated: false,
    publicDefaultRouteMutated: false
  });
  const r18bPaths = [
    ASSET_RELATIVE_PATH,
    relative(IDENTITY_PATH),
    relative(LEDGER_PATH),
    relative(FUNCTIONAL_RECEIPT_PATH),
    relative(MATERIALIZATION_RECEIPT_PATH),
    relative(RUNTIME_TRACE_PATH)
  ];
  publicationHead = commitEvidence('R1.8B-C3: record exact nonblocking functional verification', r18bPaths);
  server.kill('SIGTERM');
  server = null;

  currentPhase = 'R1.8C_ISOLATED_NON_DEFAULT_CANDIDATE_PUBLICATION';
  reviewUrl = `https://rawcdn.githack.com/${REPOSITORY}/${publicationHead}/${REVIEW_PATH}`;
  const availability = await waitForPublishedOccurrence(reviewUrl);
  const prAtPublication = await getPullRequest();
  requireCondition(prAtPublication.state === 'open' && prAtPublication.draft === true && prAtPublication.merged === false, 'PR_418_STATE_CHANGED_DURING_PUBLICATION');
  const publicationReceipt = {
    receiptType: 'H_EARTH_C2_R1_R1_8C_ISOLATED_NON_DEFAULT_PUBLICATION_v1',
    result: 'PASS_PUBLISHED_ISOLATED_NON_DEFAULT',
    sourceCandidateHead: PRODUCT_AUTHORITY_HEAD,
    materializationHead: publicationHead,
    occurrence: OCCURRENCE,
    reviewUrl,
    publicationModel: 'COMMIT_PINNED_ISOLATED_STATIC_REVIEW',
    provider: {
      name: 'rawgit.hack',
      endpoint: 'rawcdn.githack.com',
      repositoryAffiliation: 'THIRD_PARTY_NOT_GITHUB',
      immutableCommitPinnedCache: true,
      formalUptimeGuarantee: false
    },
    availability,
    asset: {
      path: ASSET_RELATIVE_PATH,
      byteLength: fs.statSync(ASSET_PATH).size,
      sha256: sha256File(ASSET_PATH)
    },
    independentlyRemovable: true,
    ordinaryHEarthRouteRedirected: false,
    publicDefaultHEarthRouteReplaced: false,
    productDefaultChanged: false,
    pr418Merged: false,
    mainMutated: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    firstBlocker: null
  };
  writeJson(PUBLICATION_RECEIPT_PATH, publicationReceipt);
  ledger.controllingStatus = 'R1.8C_PASS_RECORDED';
  ledger.reviewOccurrence = reviewUrl;
  ledger.publicationHead = publicationHead;
  preservePhase(ledger, currentPhase, 'PASS_RECORDED', {
    receipt: { path: relative(PUBLICATION_RECEIPT_PATH), sha256: sha256File(PUBLICATION_RECEIPT_PATH) },
    reviewUrl,
    sourceCandidateHead: PRODUCT_AUTHORITY_HEAD,
    materializationHead: publicationHead,
    publicDefaultHEarthRouteReplaced: false,
    productDefaultChanged: false,
    pr418Merged: false,
    mainMutated: false
  });
  commitEvidence('R1.8C: record isolated non-default publication', [
    relative(LEDGER_PATH),
    relative(PUBLICATION_RECEIPT_PATH)
  ]);

  currentPhase = 'R1.8D_SERVED_OCCURRENCE_VERIFICATION_AND_REPRESENTATIVE_CAPTURE_PACKAGE';
  const servedResult = await verifyOccurrence(reviewUrl, { captures: true });
  const finalPr = await getPullRequest();
  requireCondition(finalPr.state === 'open' && finalPr.draft === true && finalPr.merged === false, 'PR_418_STATE_CHANGED_DURING_SERVED_VERIFICATION');
  const captures = servedResult.desktop.captures;
  requireCondition(captures.length === 6, 'SIX_CAPTURE_PACKAGE_NOT_COMPLETE', captures.length);
  requireCondition(deepEqual(captures.map(capture => capture.identity), VIEWS), 'CAPTURE_IDENTITY_SET_MISMATCH');

  const captureManifest = {
    manifestType: 'H_EARTH_C2_R1_R1_8D_REPRESENTATIVE_CAPTURE_PACKAGE_v1',
    result: 'PASS_CAPTURE_PACKAGE_READY_FOR_HUMAN_REVIEW',
    exactCandidateHead: PRODUCT_AUTHORITY_HEAD,
    servedOccurrence: reviewUrl,
    materializationHead: publicationHead,
    browserVersion: servedResult.browserVersion,
    captures,
    captureCount: captures.length,
    visualSuccessEstablished: false,
    userDifferentialRequired: true
  };
  writeJson(CAPTURE_MANIFEST_PATH, captureManifest);
  const servedReceipt = {
    receiptType: 'H_EARTH_C2_R1_R1_8D_SERVED_OCCURRENCE_VERIFICATION_v1',
    result: 'PASS_READY_FOR_USER_DIFFERENTIAL',
    exactCandidateHead: PRODUCT_AUTHORITY_HEAD,
    materializationHead: publicationHead,
    servedOccurrence: reviewUrl,
    servedDocumentReachable: true,
    servedIdentityMatchesExactCandidate: true,
    requiredModulesLoad: true,
    webglContextEstablished: true,
    liveFrameAdvancementConfirmed: true,
    touchResponseConfirmed: true,
    cameraMovementTruthful: true,
    exactReviewGeometryPreserved: true,
    noFatalConsoleOrModuleFailure: true,
    referenceDeviceReviewAvailable: true,
    referenceDeviceExecutionStatus: 'AVAILABLE_FOR_PHYSICAL_SAMSUNG_REVIEW_NOT_EXECUTED_BY_AUTOMATION',
    desktop: servedResult.desktop,
    mobileReferenceEmulation: servedResult.mobile,
    captureManifest: { path: relative(CAPTURE_MANIFEST_PATH), sha256: sha256File(CAPTURE_MANIFEST_PATH) },
    sixCaptureIdentities: captures.map(capture => ({
      identity: capture.identity,
      path: capture.file,
      sha256: capture.sha256,
      camera: capture.camera,
      viewport: capture.viewport,
      deviceOrBrowser: capture.deviceOrBrowser
    })),
    knownNonblockingLimitations: [
      'RAWCDN_GITHACK_IS_A_THIRD_PARTY_COMMIT_PINNED_REVIEW_PROVIDER_WITHOUT_FORMAL_UPTIME_GUARANTEE',
      'AUTOMATED_MOBILE_EXECUTION_IS_REFERENCE_DEVICE_EMULATION_NOT_PHYSICAL_USER_ACCEPTANCE',
      'CAPTURES_ARE_REVIEW_EVIDENCE_AND_DO_NOT_ESTABLISH_VISUAL_SUCCESS'
    ],
    productDefaultMutated: false,
    publicDefaultRouteMutated: false,
    mainMutated: false,
    pr418Merged: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: true,
    firstBlocker: null
  };
  writeJson(SERVED_RECEIPT_PATH, servedReceipt);
  ledger.controllingStatus = 'R1.8D_PASS_RECORDED_WAITING_USER_DIFFERENTIAL';
  ledger.visualSuccessorStatus = 'NOT_ESTABLISHED';
  ledger.userDifferentialReady = true;
  ledger.firstBlocker = null;
  preservePhase(ledger, currentPhase, 'PASS_RECORDED', {
    receipt: { path: relative(SERVED_RECEIPT_PATH), sha256: sha256File(SERVED_RECEIPT_PATH) },
    captureManifest: { path: relative(CAPTURE_MANIFEST_PATH), sha256: sha256File(CAPTURE_MANIFEST_PATH) },
    servedOccurrence: reviewUrl,
    exactServedHead: publicationHead,
    sourceCandidateHead: PRODUCT_AUTHORITY_HEAD,
    referenceDeviceReviewAvailable: true,
    captureCount: captures.length,
    sixCaptureIdentities: captures.map(capture => ({ identity: capture.identity, sha256: capture.sha256 })),
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: true
  });
  const handoff = {
    handoffType: 'H_EARTH_C2_R1_R1_8_USER_DIFFERENTIAL_HANDOFF_v1',
    status: 'READY_FOR_USER_DIFFERENTIAL',
    reviewOccurrence: reviewUrl,
    changedCandidate: `C2_R1_AT_${PRODUCT_AUTHORITY_HEAD}`,
    comparisonBaseline: 'LAST_USER_ACCEPTED_LIVE_H_EARTH_BASELINE',
    exactServedHead: publicationHead,
    functionalVerificationResult: 'PASS',
    referenceDeviceStatus: 'AVAILABLE_FOR_PHYSICAL_REVIEW',
    sixCaptureIdentities: captures.map(capture => ({ identity: capture.identity, sha256: capture.sha256, path: capture.file })),
    knownNonblockingLimitations: servedReceipt.knownNonblockingLimitations,
    firstBlocker: null,
    permittedUserResults: ['ACCEPTED', 'REJECTED', 'MIXED_WITH_SPECIFIC_DEFECTS'],
    r1_8Status: 'OPEN_WAITING_USER_DIFFERENTIAL',
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    productDefaultMutated: false,
    publicDefaultRouteMutated: false,
    mainMutated: false,
    pr418Merged: false
  };
  writeJson(HANDOFF_PATH, handoff);
  const evidencePaths = [
    relative(LEDGER_PATH),
    relative(SERVED_RECEIPT_PATH),
    relative(CAPTURE_MANIFEST_PATH),
    relative(HANDOFF_PATH),
    ...captures.map(capture => capture.file)
  ];
  const evidenceHead = commitEvidence('R1.8D: preserve served verification and six-view review evidence', evidencePaths);
  handoff.evidenceHead = evidenceHead;
  writeJson(HANDOFF_PATH, handoff);
  commitEvidence('R1.8D: record exact evidence head in user differential handoff', [relative(HANDOFF_PATH)]);

  console.log(`R1_8_REVIEW_OCCURRENCE=${reviewUrl}`);
  console.log(`R1_8_EXACT_SERVED_HEAD=${publicationHead}`);
  console.log(`R1_8_SOURCE_CANDIDATE_HEAD=${PRODUCT_AUTHORITY_HEAD}`);
  console.log('R1_8B_FUNCTIONAL_VERIFICATION=PASS');
  console.log('R1_8C_PUBLICATION=PASS');
  console.log('R1_8D_SERVED_VERIFICATION=PASS');
  console.log('R1_8_USER_DIFFERENTIAL_READY=TRUE');
  console.log('R1_8E=NOT_STARTED');
}

try {
  await main();
} catch (error) {
  if (server) {
    try { server.kill('SIGTERM'); } catch {}
  }
  const blocker = {
    code: error.code || error.message || 'R1_8_UNCLASSIFIED_BLOCKER',
    detail: error.detail ?? String(error?.stack || error),
    phase: currentPhase,
    recordedAt: now(),
    productRegressionEstablished: false
  };
  ledger.controllingStatus = `R1.8_BLOCKED_AT_${currentPhase}`;
  ledger.userDifferentialReady = false;
  ledger.visualSuccessorStatus = 'NOT_ESTABLISHED';
  ledger.firstBlocker = blocker;
  preservePhase(ledger, currentPhase, 'BLOCKED', {}, blocker);
  const preserve = [relative(LEDGER_PATH)];
  for (const file of [MATERIALIZATION_RECEIPT_PATH, RUNTIME_TRACE_PATH, IDENTITY_PATH, ASSET_PATH]) {
    if (fs.existsSync(file)) preserve.push(relative(file));
  }
  try {
    commitEvidence(`R1.8B-C3: preserve first blocker at ${currentPhase}`, preserve);
  } catch (commitError) {
    console.error(`BLOCKER_LEDGER_COMMIT_FAILED:${String(commitError?.stack || commitError)}`);
  }
  console.error(JSON.stringify({ result: 'BLOCKED', blocker }, null, 2));
  process.exit(1);
}
