import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const EXACT_MAIN_HEAD =
  process.env.EXACT_MAIN_HEAD ?? '59df682501f63aec8a263cef8e1a5adacbc2a1a2';
const PUBLIC_ORIGIN =
  process.env.PUBLIC_ORIGIN ?? 'https://diamondgatebridge.com';
const ROUTE_PATH = '/showroom/globe/h-earth/';
const OUTPUT_ROOT = path.resolve(
  process.env.C0_OUTPUT_ROOT ??
    'h-earth-3d/control-plane/coastal-morphology/c0/evidence'
);
const BODY_ROOT = path.resolve(
  process.env.C0_BODY_ROOT ?? '/tmp/h-earth-c0-public-occurrence-bodies'
);
const CHROME_PATH = process.env.CHROME_PATH;

if (!CHROME_PATH) throw new Error('C0_CHROME_PATH_REQUIRED');

const sha256 = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');
const now = () => new Date().toISOString();
const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8' }).trim();
const safeName = (pathname, index) =>
  `${String(index).padStart(3, '0')}-${pathname
    .replace(/^\/+/, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '_') || 'root'}`;

await fs.mkdir(OUTPUT_ROOT, { recursive: true });
await fs.rm(BODY_ROOT, { recursive: true, force: true });
await fs.mkdir(BODY_ROOT, { recursive: true });

const head = git('rev-parse', 'HEAD');
const mergeBase = git('merge-base', EXACT_MAIN_HEAD, head);
if (mergeBase !== EXACT_MAIN_HEAD) {
  throw new Error(`C0_BRANCH_NOT_BASED_ON_EXACT_MAIN:${mergeBase}`);
}
git('cat-file', '-e', `${EXACT_MAIN_HEAD}^{commit}`);

async function boundedFetch(initialUrl) {
  const redirectChain = [];
  let currentUrl = initialUrl;
  for (let redirectCount = 0; redirectCount <= 8; redirectCount += 1) {
    const started = now();
    const response = await fetch(currentUrl, {
      redirect: 'manual',
      cache: 'no-store',
      headers: {
        'cache-control': 'no-cache, no-store, max-age=0',
        pragma: 'no-cache',
        'user-agent': 'H-Earth-C0-Evidence-Capture/1.0'
      }
    });
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      const nextUrl = new URL(location, currentUrl).href;
      redirectChain.push({
        url: currentUrl,
        httpStatus: response.status,
        location: nextUrl,
        responseTimestamp: started
      });
      currentUrl = nextUrl;
      continue;
    }
    const body = Buffer.from(await response.arrayBuffer());
    return {
      requestedUrl: initialUrl,
      finalUrl: currentUrl,
      redirectChain,
      url: currentUrl,
      httpStatus: response.status,
      responseTimestamp: started,
      contentType: response.headers.get('content-type'),
      contentLengthHeader: response.headers.get('content-length'),
      contentLength: body.byteLength,
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      cacheControl: response.headers.get('cache-control'),
      age: response.headers.get('age'),
      bodySha256: sha256(body),
      body
    };
  }
  throw new Error(`C0_REDIRECT_LIMIT_EXCEEDED:${initialUrl}`);
}

function repositoryPathForUrl(url) {
  const parsed = new URL(url);
  let repositoryPath = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');
  if (repositoryPath.endsWith('/')) repositoryPath += 'index.html';
  return repositoryPath;
}

function readExactMainCounterpart(repoPath) {
  try {
    return Buffer.from(
      execFileSync('git', ['show', `${EXACT_MAIN_HEAD}:${repoPath}`], {
        encoding: null,
        maxBuffer: 128 * 1024 * 1024
      })
    );
  } catch {
    return null;
  }
}

function isTextual(contentType, pathname) {
  return (
    /^text\//i.test(contentType ?? '') ||
    /(?:javascript|json|xml|svg)/i.test(contentType ?? '') ||
    /\.(?:html?|css|m?js|json|txt|svg)$/i.test(pathname)
  );
}

function stripTerminalNewline(buffer) {
  if (buffer.length >= 2 &&
      buffer[buffer.length - 2] === 13 &&
      buffer[buffer.length - 1] === 10) {
    return buffer.subarray(0, -2);
  }
  if (buffer.length >= 1 && buffer[buffer.length - 1] === 10) {
    return buffer.subarray(0, -1);
  }
  return buffer;
}

function classifyMatch(publicBody, counterpart, contentType, pathname) {
  if (!counterpart) return 'REPOSITORY_COUNTERPART_NOT_FOUND';
  if (publicBody.equals(counterpart)) return 'EXACT_BYTE_MATCH';
  if (
    isTextual(contentType, pathname) &&
    stripTerminalNewline(publicBody).equals(stripTerminalNewline(counterpart))
  ) {
    return 'CANONICAL_TEXT_MATCH';
  }
  return 'CONTENT_MISMATCH';
}

const routeCaptures = [];
for (let index = 1; index <= 3; index += 1) {
  const url =
    `${PUBLIC_ORIGIN}${ROUTE_PATH}?c0=${EXACT_MAIN_HEAD}-${index}`;
  const record = await boundedFetch(url);
  const repoPath = repositoryPathForUrl(record.finalUrl);
  const counterpart = readExactMainCounterpart(repoPath);
  const bodyFile = path.join(BODY_ROOT, `route-${index}.html`);
  await fs.writeFile(bodyFile, record.body);
  routeCaptures.push({
    ...record,
    body: undefined,
    bodyFile: path.relative(process.cwd(), bodyFile),
    repositoryPath: repoPath,
    exactMainCounterpartSha256: counterpart ? sha256(counterpart) : null,
    matchClassification: classifyMatch(
      record.body,
      counterpart,
      record.contentType,
      repoPath
    )
  });
}

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader-webgl',
    '--enable-unsafe-swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist'
  ]
});

const browserNetwork = [];
const consoleErrors = [];
const pageErrors = [];
const requestFailures = [];
const capturedByUrl = new Map();

try {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true
  });
  await page.setUserAgent(
    'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36'
  );
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));
  page.on('requestfailed', (request) => {
    requestFailures.push({
      url: request.url(),
      failure: request.failure()?.errorText ?? 'UNKNOWN'
    });
  });
  page.on('response', async (response) => {
    const url = response.url();
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return;
    }
    if (parsed.origin !== new URL(PUBLIC_ORIGIN).origin) return;
    const request = response.request();
    const headers = response.headers();
    const entry = {
      url,
      httpStatus: response.status(),
      resourceType: request.resourceType(),
      method: request.method(),
      responseTimestamp: now(),
      contentType: headers['content-type'] ?? null,
      contentLengthHeader: headers['content-length'] ?? null,
      etag: headers.etag ?? null,
      lastModified: headers['last-modified'] ?? null,
      cacheControl: headers['cache-control'] ?? null,
      age: headers.age ?? null,
      fromCache: response.fromCache(),
      fromServiceWorker: response.fromServiceWorker()
    };
    try {
      const body = await response.buffer();
      entry.contentLength = body.byteLength;
      entry.bodySha256 = sha256(body);
      if (!capturedByUrl.has(url)) capturedByUrl.set(url, body);
    } catch (error) {
      entry.bodyUnavailable = error.message;
    }
    browserNetwork.push(entry);
  });

  const liveUrl =
    `${PUBLIC_ORIGIN}${ROUTE_PATH}?c0=${EXACT_MAIN_HEAD}-browser`;
  const mainResponse = await page.goto(liveUrl, {
    waitUntil: 'networkidle0',
    timeout: 120_000
  });
  if (!mainResponse || mainResponse.status() >= 400) {
    throw new Error(`C0_PUBLIC_BROWSER_ROUTE_NOT_OK:${mainResponse?.status()}`);
  }
  await page.waitForFunction(
    () =>
      Boolean(
        window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true &&
        window.H_EARTH_RUN8E_PUBLIC_ROUTE
          ?.getLiveGpuReceipt?.()
          ?.counters?.gpuFramebufferPresentationCount >= 1
      ),
    { timeout: 120_000 }
  );
  await new Promise((resolve) => setTimeout(resolve, 3000));
} finally {
  await browser.close();
}

const uniqueNetwork = [];
const seenNetwork = new Set();
for (const record of browserNetwork) {
  const key = `${record.method}:${record.url}:${record.bodySha256 ?? ''}`;
  if (seenNetwork.has(key)) continue;
  seenNetwork.add(key);
  uniqueNetwork.push(record);
}

const assetRecords = [];
let fileIndex = 0;
for (const [url, body] of [...capturedByUrl.entries()].sort(([a], [b]) =>
  a.localeCompare(b))) {
  const parsed = new URL(url);
  const pathname = parsed.pathname;
  const networkRecord = uniqueNetwork.find((record) => record.url === url) ?? {};
  const repoPath = repositoryPathForUrl(url);
  const counterpart = readExactMainCounterpart(repoPath);
  const filename = safeName(pathname, ++fileIndex);
  await fs.writeFile(path.join(BODY_ROOT, filename), body);
  assetRecords.push({
    url,
    pathname,
    repositoryPath: repoPath,
    bodyFile: filename,
    httpStatus: networkRecord.httpStatus ?? null,
    contentType: networkRecord.contentType ?? null,
    contentLength: body.byteLength,
    etag: networkRecord.etag ?? null,
    lastModified: networkRecord.lastModified ?? null,
    cacheControl: networkRecord.cacheControl ?? null,
    age: networkRecord.age ?? null,
    responseTimestamp: networkRecord.responseTimestamp ?? null,
    publicBodySha256: sha256(body),
    exactMainCounterpartSha256: counterpart ? sha256(counterpart) : null,
    matchClassification: classifyMatch(
      body,
      counterpart,
      networkRecord.contentType,
      pathname
    )
  });
}

const byPath = (pattern) =>
  assetRecords.filter((record) => pattern.test(record.pathname));
const criticalAssets = {
  PUBLIC_H_EARTH_HTML: routeCaptures,
  PUBLIC_H_EARTH_CSS: byPath(
    /\/showroom\/globe\/h-earth\/(?:functional-landscape\/)?index\.css$/i
  ),
  PUBLIC_RUNTIME_WRAPPER: byPath(
    /public-live-gpu-integration\.run8e-r3e\.receipt\.js$/i
  ),
  LIVE_RENDERER_ENTRY: byPath(
    /persistent-live-renderer\.run8e-r3c(?:\.cp2-round1-1f520809)?\.js$/i
  ),
  TERRAIN_OR_HEIGHTFIELD_ENTRY_ASSETS: byPath(
    /(?:terrain-field|successor-terrain|live-render-package|gpu-upload-views)/i
  ),
  WATER_OR_OCEAN_ENTRY_ASSETS: byPath(
    /(?:water|ocean|hydrology|live-render-package|persistent-live-renderer)/i
  )
};

const minimumClasses = Object.entries(criticalAssets).filter(
  ([name]) => name !== 'PUBLIC_H_EARTH_HTML'
);
const missingCriticalClasses = minimumClasses
  .filter(([, records]) => records.length === 0)
  .map(([name]) => name);
const criticalComparisonRecords = [
  ...routeCaptures,
  ...minimumClasses.flatMap(([, records]) => records)
];
const criticalClassifications = criticalComparisonRecords.map(
  (record) => record.matchClassification
);
let sourceOccurrenceLinkage = 'UNRESOLVED';
if (criticalClassifications.includes('CONTENT_MISMATCH')) {
  sourceOccurrenceLinkage = 'LIVE_SOURCE_DIVERGENCE';
} else if (
  missingCriticalClasses.length === 0 &&
  criticalClassifications.length > 0 &&
  criticalClassifications.every((classification) =>
    ['EXACT_BYTE_MATCH', 'CANONICAL_TEXT_MATCH'].includes(classification)
  )
) {
  sourceOccurrenceLinkage = 'VERIFIED_BY_CONTENT_IDENTITY';
}

const routeBodyHashes = routeCaptures.map((record) => record.bodySha256);
const boundedRetrievalsDeterministic =
  new Set(routeBodyHashes).size === 1;
if (!boundedRetrievalsDeterministic &&
    sourceOccurrenceLinkage === 'VERIFIED_BY_CONTENT_IDENTITY') {
  sourceOccurrenceLinkage = 'UNRESOLVED';
}

const publicOccurrence = {
  receiptType: 'H_EARTH_C0_PUBLIC_OCCURRENCE_AND_LINKAGE_RECEIPT_v1',
  operation: 'C0_A_PUBLIC_OCCURRENCE_AND_LINKAGE',
  exactMainHead: EXACT_MAIN_HEAD,
  executedHead: head,
  publicOrigin: PUBLIC_ORIGIN,
  publicRoute: ROUTE_PATH,
  publicOccurrenceCaptured: true,
  captureTimestamp: now(),
  routeCaptures,
  boundedRetrievalsDeterministic,
  publicRouteBodySha256: routeBodyHashes[0] ?? null,
  publicCriticalAssetSha256s: Object.fromEntries(
    Object.entries(criticalAssets).map(([name, records]) => [
      name,
      records.map((record) =>
        record.publicBodySha256 ?? record.bodySha256 ?? null)
    ])
  ),
  exactMainCounterpartSha256s: Object.fromEntries(
    Object.entries(criticalAssets).map(([name, records]) => [
      name,
      records.map((record) => record.exactMainCounterpartSha256 ?? null)
    ])
  ),
  assetByAssetMatchClassification: Object.fromEntries(
    Object.entries(criticalAssets).map(([name, records]) => [
      name,
      records.map((record) => ({
        url: record.url ?? record.finalUrl,
        repositoryPath: record.repositoryPath,
        classification: record.matchClassification
      }))
    ])
  ),
  missingCriticalClasses,
  sourceOccurrenceLinkage,
  repositoryRollbackTarget: EXACT_MAIN_HEAD,
  publicOccurrenceRollbackTarget:
    sourceOccurrenceLinkage === 'VERIFIED_BY_CONTENT_IDENTITY'
      ? EXACT_MAIN_HEAD
      : 'UNRESOLVED_PENDING_CONTENT_HISTORY_RECONCILIATION',
  staleCrawlerRecordAuthority: false,
  pagesSettingsAvailable: false,
  pagesSettingsLimitation:
    'ADMINISTRATIVE_DEPLOYMENT_METADATA_NOT_REQUIRED_FOR_CONTENT_IDENTITY_LINKAGE',
  runtimeEvidence: {
    consoleErrors,
    pageErrors,
    requestFailures,
    sameOriginNetworkAssetCount: assetRecords.length
  },
  productMutation: false,
  c1DiagnosisAuthorized: false,
  nextC0Step:
    sourceOccurrenceLinkage === 'LIVE_SOURCE_DIVERGENCE'
      ? 'C0_A_CONTENT_HISTORY_RECONCILIATION_THEN_C0_B'
      : 'C0_B_REPOSITORY_SOURCE_AND_AUTHORITY_CUSTODY'
};

const networkLog = {
  receiptType: 'H_EARTH_C0_PUBLIC_NETWORK_LOG_v1',
  exactMainHead: EXACT_MAIN_HEAD,
  captureTimestamp: now(),
  records: uniqueNetwork,
  assetRecords,
  consoleErrors,
  pageErrors,
  requestFailures
};

await fs.writeFile(
  path.join(OUTPUT_ROOT, 'h-earth.c0.public-occurrence.json'),
  `${JSON.stringify(publicOccurrence, null, 2)}\n`
);
await fs.writeFile(
  path.join(OUTPUT_ROOT, 'h-earth.c0.network-log.json'),
  `${JSON.stringify(networkLog, null, 2)}\n`
);

console.log(JSON.stringify({
  publicOccurrenceCaptured: publicOccurrence.publicOccurrenceCaptured,
  publicRouteBodySha256: publicOccurrence.publicRouteBodySha256,
  criticalAssetCount: criticalComparisonRecords.length,
  missingCriticalClasses,
  sourceOccurrenceLinkage,
  repositoryRollbackTarget: publicOccurrence.repositoryRollbackTarget,
  publicOccurrenceRollbackTarget:
    publicOccurrence.publicOccurrenceRollbackTarget,
  nextC0Step: publicOccurrence.nextC0Step
}, null, 2));

if (!publicOccurrence.publicOccurrenceCaptured) process.exitCode = 1;
