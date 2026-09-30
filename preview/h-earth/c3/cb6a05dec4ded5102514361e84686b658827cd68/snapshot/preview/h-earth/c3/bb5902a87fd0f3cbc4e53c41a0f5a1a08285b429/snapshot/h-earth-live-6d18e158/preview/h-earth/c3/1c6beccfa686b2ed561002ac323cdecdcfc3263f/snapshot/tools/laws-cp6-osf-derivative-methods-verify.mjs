import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { get as httpGet } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const CONTRACT = 'LAWS_CP6_OSF_DERIVATIVE_METHODS_V1';
const SCOPE_MARKER = '<section aria-labelledby="scope-title" class="panel boundary">';
const OUT = path.join(ROOT, 'laws/control-plane/osf-derivative-methods');
const CHILDREN = [
  'laws/test/admission-and-baseline/index.html',
  'laws/test/forward-construction/index.html',
  'laws/test/reverse-audit/index.html',
  'laws/test/result-and-record/index.html',
  'laws/research/evidence-and-sources/index.html',
  'laws/research/methods-and-models/index.html'
];
const ROUTES = [
  '/laws/test/admission-and-baseline/',
  '/laws/test/forward-construction/',
  '/laws/test/reverse-audit/',
  '/laws/test/result-and-record/',
  '/laws/research/evidence-and-sources/',
  '/laws/research/methods-and-models/'
];
const PROTECTED = [
  'laws/index.html',
  'laws/index.controller.js',
  'laws/index.compositor.js',
  'laws/index.crystals.js',
  'laws/index.interactions.js',
  'laws/index.cosmos.js',
  'laws/index.planet.js',
  'assets/audralia/audralia.planet.js'
];
const EXPECTED_METADATA = {
  '7jnxq': '467beb4017f844fddd7328d69b654483324235d4f941b031e4a7eb20004c5530',
  '9ut2z': '82735851ff27ee32bb19c5ac5cf99da57805d8dc3be48bdad83dd24be6799a2f',
  '7vkgs': 'd77b87050afb73108e62c34aae8a54d93cc04756785c0bdc2dfc31b1900df979',
  'n82xh': '12d75fd447aa5686c695264bf9387d35546d02933644eafbdaed251ed141cada',
  'rjdms': '695a0d8ccb59b57135758a2ea89b54b5c27119f74024b98de6da1becc8bf437c'
};
const EXPECTED_FILES = {
  'Diagnostic_Rules_Coherence_Framework.pdf': '514175c7c619adf7d208260fe47702771895e199d5bef36fd18dd3a81d2c6ced',
  'Methods_Appendix_Diagnostic_Framework.pdf': '5bb824f8c4291403ab486fd9412f2069aa9d2e49fbd4f508ada68f54caceb18f',
  'Diagnostic_Protocol_Rulebook.pdf': '8c1e9e23d58f88c2922eb949db0a7da70fa1b33b50365da74b4c3b16273da1a6',
  'Case_Selection_and_Evidence_Windows-1.pdf': '6de1a6f746dc0c9bbcbdcdd2a7b3631418f46cfc9b31ba211e3960d34d2fe2e3',
  'Observer_Replication_Guide.pdf': 'd4d7d5a005f300d5230ee6ace3711f1689583202b17cfbc538fa42a0113e6b55',
  'Integral_Platform_HOW_TO-2.pdf': '6bf9d21f9e06768e2eb829dae5641ac76bc3b74f98b1d4061910b09bb4ab8e3a',
  'Integral_Platform_Method_Explained.pdf': '13adead582dfca3140137ac7eb9d32774c53a74920cc5c104dc99a9216250343'
};

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function baseline(rel) {
  return execFileSync('git', ['show', `HEAD:${rel}`], { cwd: ROOT, encoding: 'utf8' });
}
function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}
function ensureDir() {
  fs.mkdirSync(OUT, { recursive: true });
}

ensureDir();

const staticReport = {
  contract: CONTRACT,
  status: 'PASS',
  checked_at: new Date().toISOString(),
  destination_pages: CHILDREN.length,
  child_archive_byte_preservation: {},
  method_layer_counts: {},
  protected_runtime_diff: {},
  source_identity: {},
  claim_boundary: {}
};

assert.equal(CHILDREN.length, 6, 'DESTINATION_PAGE_COUNT');
assert.equal(ROUTES.length, 6, 'DESTINATION_ROUTE_COUNT');

for (const rel of CHILDREN) {
  const before = baseline(rel);
  const after = read(rel);
  const beforeMarker = before.indexOf(SCOPE_MARKER);
  const afterMarker = after.indexOf(SCOPE_MARKER);
  assert.ok(beforeMarker >= 0, `BASE_SCOPE_MARKER_MISSING:${rel}`);
  assert.ok(afterMarker >= 0, `CANDIDATE_SCOPE_MARKER_MISSING:${rel}`);
  assert.equal(after.slice(afterMarker), before.slice(beforeMarker), `CANONICAL_ARCHIVE_CHANGED:${rel}`);
  assert.equal(count(after, `data-laws-derivative-contract="${CONTRACT}"`), 1, `DERIVATIVE_LAYER_COUNT:${rel}`);
  assert.equal(count(after, 'data-laws-derivative-methods-css="true"'), 1, `DERIVATIVE_CSS_COUNT:${rel}`);
  assert.ok(after.indexOf(`data-laws-derivative-contract="${CONTRACT}"`) < afterMarker, `DERIVATIVE_LAYER_NOT_ABOVE_ARCHIVE:${rel}`);
  assert.ok(after.includes('data-empirical-validation-claimed="false"'), `EMPIRICAL_FALSE_FLAG_MISSING:${rel}`);
  staticReport.child_archive_byte_preservation[rel] = true;
  staticReport.method_layer_counts[rel] = 1;
}

const manifest = JSON.parse(read('laws/control-plane/osf-derivative-methods/manifest.json'));
assert.equal(manifest.contract, CONTRACT);
assert.equal(manifest.source_registry.registry_id, 'OSF_LAWS_CHAMBER_SOURCE_REGISTRY_v1');
assert.equal(manifest.source_registry.pull_request_head, 'ae2ccedd4f74ef1afdcc5181a4056c30c83fa20d');
assert.equal(manifest.source_registry.source_snapshot_head, 'dbd508fc5cacaa463abed0c159812a1e02635c1d');
assert.equal(manifest.status, 'VERIFIED_PUBLISHED_CANDIDATE', 'MANIFEST_STATUS_NOT_VERIFIED_PUBLISHED');
assert.equal(manifest.landing_page_mutation, false, 'LANDING_PAGE_MUTATION_RECORD_FALSE_REQUIRED');
assert.equal(Object.hasOwn(manifest, 'landing_change'), false, 'STALE_LANDING_CHANGE_RECORD_PROHIBITED');
assert.equal(manifest.source_admission_receipt.receipt_id, 'OSF_LAWS_CP6_PINNED_SOURCE_ADMISSION_RECEIPT_v1');
assert.equal(manifest.source_admission_receipt.admission_mode, 'EXPLICIT_PINNED_SOURCE_ADMISSION');
assert.equal(manifest.source_admission_receipt.source_count, 5);
assert.equal(manifest.source_admission_receipt.registry_pull_request_head, 'ae2ccedd4f74ef1afdcc5181a4056c30c83fa20d');
assert.equal(manifest.source_admission_receipt.source_snapshot_head, 'dbd508fc5cacaa463abed0c159812a1e02635c1d');
const receiptPath = 'laws/control-plane/osf-derivative-methods/PINNED_SOURCE_ADMISSION_RECEIPT.json';
const receipt = JSON.parse(read(receiptPath));
assert.equal(receipt.receipt_id, 'OSF_LAWS_CP6_PINNED_SOURCE_ADMISSION_RECEIPT_v1');
assert.equal(receipt.status, 'PINNED_SOURCE_ADMITTED');
assert.equal(receipt.admission_mode, 'EXPLICIT_PINNED_SOURCE_ADMISSION');
assert.equal(receipt.admission_scope, 'PR_483_SOURCE_DERIVATIVE_USE_ONLY');
assert.equal(receipt.source_registry.pull_request_head, 'ae2ccedd4f74ef1afdcc5181a4056c30c83fa20d');
assert.equal(receipt.source_registry.source_snapshot_head, 'dbd508fc5cacaa463abed0c159812a1e02635c1d');
assert.equal(receipt.source_registry.registry_state_at_admission, 'OPEN_DRAFT_UNMERGED');
assert.equal(receipt.authorized_product.contract, CONTRACT);
assert.equal(receipt.authorized_product.pull_request, 483);
assert.equal(receipt.authorized_product.destination_count, 6);
assert.equal(receipt.authorized_product.landing_page_mutation, false);
assert.equal(receipt.authority.source_identity_admitted_for_this_candidate, true);
assert.equal(receipt.authority.product_merge_requires_technical_pass, true);
assert.equal(receipt.authority.merge_requires_expected_head_guard, true);
assert.equal(receipt.authority.correctness_or_validation_established, false);
assert.deepEqual(Object.keys(receipt.admitted_sources).sort(), Object.keys(EXPECTED_METADATA).sort());
for (const [id, hash] of Object.entries(EXPECTED_METADATA)) {
  assert.equal(receipt.admitted_sources[id].metadata_sha256, hash, `PINNED_SOURCE_HASH_MISMATCH:${id}`);
}
staticReport.pinned_source_admission = {
  receipt_id: receipt.receipt_id,
  status: receipt.status,
  source_count: Object.keys(receipt.admitted_sources).length,
  registry_pull_request_head: receipt.source_registry.pull_request_head,
  source_snapshot_head: receipt.source_registry.source_snapshot_head
};
assert.deepEqual(Object.keys(manifest.first_slice_sources).sort(), Object.keys(EXPECTED_METADATA).sort());
for (const [id, hash] of Object.entries(EXPECTED_METADATA)) {
  assert.equal(manifest.first_slice_sources[id].metadata_sha256, hash, `METADATA_SHA256_MISMATCH:${id}`);
  staticReport.source_identity[id] = { metadata_sha256: hash, status: 'PASS' };
}
const allFiles = Object.assign({}, ...Object.values(manifest.first_slice_sources).map((source) => source.public_files));
for (const [name, hash] of Object.entries(EXPECTED_FILES)) {
  assert.equal(allFiles[name], hash, `FILE_SHA256_MISMATCH:${name}`);
}
assert.equal(manifest.claim_boundary.empirical_validation_claimed, false);
assert.equal(manifest.claim_boundary.independent_replication_established, false);
assert.equal(manifest.claim_boundary.executed_study_established, false);
assert.equal(manifest.claim_boundary.derivative_is_new_method, false);
staticReport.claim_boundary = manifest.claim_boundary;

for (const rel of PROTECTED) {
  const diff = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', rel], { cwd: ROOT, encoding: 'utf8' }).trim();
  assert.equal(diff, '', `PROTECTED_OR_OUT_OF_SCOPE_PATH_CHANGED:${rel}`);
  staticReport.protected_runtime_diff[rel] = 'ZERO';
}

const changed = execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const allowed = new Set([
  ...CHILDREN,
  'laws/derivative-methods.css',
  'laws/control-plane/osf-derivative-methods/manifest.json',
  'laws/control-plane/osf-derivative-methods/PINNED_SOURCE_ADMISSION_RECEIPT.json'
]);
for (const rel of changed) assert.ok(allowed.has(rel), `UNAUTHORIZED_TRANSFORM_PATH:${rel}`);
assert.equal(changed.includes('laws/index.html'), false, 'LANDING_PAGE_MUTATION_PROHIBITED');
staticReport.changed_paths = changed;
fs.writeFileSync(path.join(OUT, 'static.json'), `${JSON.stringify(staticReport, null, 2)}\n`, 'utf8');

const server = spawn('python3', ['-m', 'http.server', '4173', '--directory', ROOT], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverError = '';
server.stderr.on('data', (chunk) => { serverError += chunk.toString(); });

function probeServer(url) {
  return new Promise((resolve) => {
    const request = httpGet(url, { headers: { Connection: 'close' } }, (response) => {
      const statusCode = response.statusCode ?? 0;
      response.resume();
      response.once('end', () => resolve(statusCode >= 200 && statusCode < 400));
      response.once('error', () => resolve(false));
    });
    request.setTimeout(1000, () => request.destroy(new Error('LOCAL_SERVER_PROBE_TIMEOUT')));
    request.once('error', () => resolve(false));
  });
}

async function waitForServer() {
  for (let i = 0; i < 40; i += 1) {
    if (await probeServer('http://127.0.0.1:4173/laws/test/admission-and-baseline/')) return;
    await delay(250);
  }
  throw new Error(`LOCAL_SERVER_NOT_READY:${serverError}`);
}

async function stopServer() {
  if (server.exitCode !== null) return;
  let exited = false;
  const exitPromise = new Promise((resolve) => {
    server.once('exit', () => {
      exited = true;
      resolve();
    });
  });
  server.kill('SIGTERM');
  await Promise.race([exitPromise, delay(2000)]);
  if (!exited && server.exitCode === null) {
    server.kill('SIGKILL');
    await Promise.race([exitPromise, delay(1000)]);
  }
}

const profiles = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'desktop', width: 1440, height: 1000 }
];

const browserReport = {
  contract: CONTRACT,
  status: 'PASS',
  checked_at: new Date().toISOString(),
  profiles: {},
  javascript_disabled: null
};

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height } });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console:${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`page:${error.message}`));
    const profileResult = {};
    for (const route of ROUTES) {
      const response = await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle' });
      assert.ok(response && response.ok(), `HTTP_FAILURE:${profile.name}:${route}`);
      const result = await page.evaluate((contract) => {
        const root = document.documentElement;
        const body = document.body;
        const viewportWidth = root.clientWidth;
        const documentWidth = Math.max(body.scrollWidth, root.scrollWidth);
        const overflow = documentWidth > viewportWidth + 1;

        const selectorFor = (element) => {
          if (element.id) return `${element.tagName.toLowerCase()}#${element.id}`;
          const methodId = element.getAttribute('data-laws-method-id');
          if (methodId) return `${element.tagName.toLowerCase()}[data-laws-method-id="${methodId}"]`;
          const contractId = element.getAttribute('data-laws-derivative-contract');
          if (contractId) return `${element.tagName.toLowerCase()}[data-laws-derivative-contract="${contractId}"]`;
          const classes = Array.from(element.classList).slice(0, 3);
          return `${element.tagName.toLowerCase()}${classes.map((name) => `.${name}`).join('')}`;
        };

        const overflowDiagnostics = Array.from(document.querySelectorAll('body *'))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const parent = element.parentElement;
            const parentStyle = parent ? getComputedStyle(parent) : null;
            const rightOverflow = Math.max(0, rect.right - viewportWidth);
            const leftOverflow = Math.max(0, -rect.left);
            const internalOverflow = Math.max(0, element.scrollWidth - element.clientWidth);
            const overflowAmount = Math.max(rightOverflow, leftOverflow, internalOverflow);
            return {
              overflowAmount,
              elementSelector: selectorFor(element),
              textOrComponentId: element.getAttribute('data-laws-method-id') || element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 180) || '',
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
              boundingRect: {
                left: Number(rect.left.toFixed(2)),
                right: Number(rect.right.toFixed(2)),
                width: Number(rect.width.toFixed(2))
              },
              computedMinWidth: style.minWidth,
              computedMaxWidth: style.maxWidth,
              computedWidth: style.width,
              whiteSpace: style.whiteSpace,
              overflowWrap: style.overflowWrap,
              wordBreak: style.wordBreak,
              overflowX: style.overflowX,
              display: style.display,
              boxSizing: style.boxSizing,
              gridOrFlexMinSize: {
                elementMinWidth: style.minWidth,
                parentDisplay: parentStyle?.display ?? null,
                parentMinWidth: parentStyle?.minWidth ?? null,
                parentGridTemplateColumns: parentStyle?.gridTemplateColumns ?? null,
                parentFlex: parentStyle?.flex ?? null
              }
            };
          })
          .filter((entry) => entry.overflowAmount > 1)
          .sort((a, b) => b.overflowAmount - a.overflowAmount)
          .slice(0, 12);

        return {
          overflow,
          viewportWidth,
          documentWidth,
          overflowDiagnostics,
          methodLayers: document.querySelectorAll(`[data-laws-derivative-contract="${contract}"]`).length,
          title: document.title
        };
      }, CONTRACT);
      if (result.overflow) {
        console.error(`HORIZONTAL_OVERFLOW_DIAGNOSTICS:${profile.name}:${route}:${JSON.stringify({
          viewportWidth: result.viewportWidth,
          documentWidth: result.documentWidth,
          nodes: result.overflowDiagnostics
        })}`);
      }
      assert.equal(result.overflow, false, `HORIZONTAL_OVERFLOW:${profile.name}:${route}`);
      assert.equal(result.methodLayers, 1, `METHOD_LAYER_BROWSER_COUNT:${profile.name}:${route}`);
      profileResult[route] = result;
    }
    assert.deepEqual(errors, [], `BROWSER_ERRORS:${profile.name}:${JSON.stringify(errors)}`);
    await page.goto('http://127.0.0.1:4173/laws/research/methods-and-models/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT, `${profile.name}-methods.png`), fullPage: true });
    browserReport.profiles[profile.name] = { viewport: profile, routes: profileResult, errors };
    await context.close();
  }

  const staticContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  const staticResponse = await staticPage.goto('http://127.0.0.1:4173/laws/test/admission-and-baseline/', { waitUntil: 'domcontentloaded' });
  assert.ok(staticResponse && staticResponse.ok(), 'STATIC_HTTP_FAILURE');
  const staticResult = await staticPage.evaluate((contract) => {
    const root = document.documentElement;
    return {
      methodLayers: document.querySelectorAll(`[data-laws-derivative-contract="${contract}"]`).length,
      overflow: Math.max(document.body.scrollWidth, root.scrollWidth) > root.clientWidth + 1
    };
  }, CONTRACT);
  assert.equal(staticResult.methodLayers, 1, 'STATIC_METHOD_LAYER_MISSING');
  assert.equal(staticResult.overflow, false, 'STATIC_HORIZONTAL_OVERFLOW');
  browserReport.javascript_disabled = staticResult;
  await staticPage.screenshot({ path: path.join(OUT, 'phone-static-admission.png'), fullPage: true });
  await staticContext.close();
} finally {
  if (browser) await browser.close();
  await stopServer();
}

fs.writeFileSync(path.join(OUT, 'browser.json'), `${JSON.stringify(browserReport, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  status: 'PASS',
  contract: CONTRACT,
  source_ids: Object.keys(EXPECTED_METADATA),
  destination_pages: CHILDREN.length,
  changed_paths: changed,
  profiles: Object.keys(browserReport.profiles),
  protected_runtime_diff: 'ZERO',
  landing_page_diff: 'ZERO',
  child_archive_byte_preservation: 'PASS'
}, null, 2));
