import path from 'node:path';
import crypto from 'node:crypto';

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function importSpecifiers(source) {
  const values = new Set();
  const staticPattern = /\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  const dynamicPattern = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const match of source.matchAll(staticPattern)) values.add(match[1]);
  for (const match of source.matchAll(dynamicPattern)) values.add(match[1]);
  return [...values];
}

export function buildReviewResourceGraph({ gitBytes, reviewRoot, reviewDocument, assetPath }) {
  const queue = [
    reviewDocument,
    `${reviewRoot}/review.css`,
    `${reviewRoot}/review.js`,
    `${reviewRoot}/identity.json`,
    `${reviewRoot}/h-earth.c2-r1.r1-8-review-mesh-materializer.js`,
    assetPath
  ];
  const visited = new Set();
  while (queue.length) {
    const repositoryPath = path.posix.normalize(queue.shift());
    if (visited.has(repositoryPath)) continue;
    visited.add(repositoryPath);
    if (!repositoryPath.endsWith('.js') && !repositoryPath.endsWith('.html')) continue;
    const source = gitBytes(repositoryPath).toString('utf8');
    for (const specifier of importSpecifiers(source)) {
      if (!specifier.startsWith('.')) continue;
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(repositoryPath), specifier));
      if (!visited.has(resolved)) queue.push(resolved);
    }
  }
  return [...visited].sort();
}

function mimeMatches(repositoryPath, contentType) {
  const value = String(contentType || '').toLowerCase();
  if (repositoryPath.endsWith('.html')) return value.includes('text/html');
  if (repositoryPath.endsWith('.css')) return value.includes('text/css');
  if (repositoryPath.endsWith('.js')) return value.includes('javascript') || value.includes('ecmascript');
  if (repositoryPath.endsWith('.json')) return value.includes('json');
  if (repositoryPath.endsWith('.bin')) return value.includes('octet-stream') || value.includes('application/binary');
  return true;
}

async function fetchResource({ carrier, repositoryPath, gitBytes, assetPath }) {
  const requestedUrl = new URL(repositoryPath, carrier.baseUrl).href;
  const response = await fetch(requestedUrl, {
    redirect: 'follow',
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' }
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  const expected = gitBytes(repositoryPath);
  const prefix = bytes.toString('utf8', 0, Math.min(bytes.length, 128));
  return {
    repositoryPath,
    requestedUrl,
    finalUrlAfterRedirects: response.url,
    httpStatus: response.status,
    contentType: response.headers.get('content-type'),
    contentLength: response.headers.get('content-length'),
    contentEncoding: response.headers.get('content-encoding'),
    etag: response.headers.get('etag'),
    cacheControl: response.headers.get('cache-control'),
    age: response.headers.get('age'),
    accessControlAllowOrigin: response.headers.get('access-control-allow-origin'),
    contentSecurityPolicy: response.headers.get('content-security-policy'),
    responseByteLength: bytes.length,
    responseSha256: sha256(bytes),
    expectedRepositoryByteLength: expected.length,
    expectedRepositorySha256: sha256(expected),
    byteIdentityMatch: bytes.equals(expected),
    mimeIdentityMatch: mimeMatches(repositoryPath, response.headers.get('content-type')),
    htmlFallbackReturned: !repositoryPath.endsWith('.html') && /^\s*<!doctype html/i.test(prefix),
    redirectedToDifferentHost: new URL(response.url).host !== carrier.host,
    assetResource: repositoryPath === assetPath
  };
}

async function installInstrumentation(page) {
  await page.addInitScript(() => {
    const events = [];
    let sequence = 0;
    const emit = (event, detail = null) => events.push({
      sequence: ++sequence,
      event,
      performanceMilliseconds: Number(performance.now().toFixed(3)),
      detail
    });
    Object.defineProperty(window, '__R1_8_CARRIER_TRACE__', { value: { events, emit } });
    document.addEventListener('securitypolicyviolation', event => emit('SECURITY_POLICY_VIOLATION', {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      effectiveDirective: event.effectiveDirective,
      disposition: event.disposition,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber
    }));
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const requested = String(args[0]?.url || args[0]);
      const mesh = requested.includes('h-earth.c2-r1.r1-8-review-mesh.bin');
      if (mesh) emit('MESH_FETCH_STARTED', { requested });
      try {
        const response = await originalFetch(...args);
        if (mesh) emit('MESH_FETCH_COMPLETED', {
          requested,
          finalUrl: response.url,
          status: response.status,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length')
        });
        return response;
      } catch (error) {
        if (mesh) emit('MESH_FETCH_FAILED', { requested, message: error?.message || String(error) });
        throw error;
      }
    };
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      const context = originalGetContext.call(this, type, ...args);
      if (type === 'webgl2') emit('WEBGL_CONTEXT_ESTABLISHED', { established: Boolean(context) });
      return context;
    };
    const observe = () => {
      const root = document.documentElement;
      if (!root) return;
      const observer = new MutationObserver(() => {
        if (root.dataset.r1_8Review === 'ready') {
          emit('READY_SENTINEL_WRITTEN', { value: root.dataset.r1_8Review });
          observer.disconnect();
        }
      });
      observer.observe(root, { attributes: true, attributeFilter: ['data-r1-8-review'] });
    };
    if (document.documentElement) observe();
    else document.addEventListener('DOMContentLoaded', observe, { once: true });
  });
}

async function browserTrace({ browser, carrier, reviewDocument }) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await installInstrumentation(page);
  const observed = { requests: [], responses: [], requestFailures: [], console: [], pageErrors: [], crashes: [] };
  page.on('request', request => observed.requests.push({ url: request.url(), method: request.method(), resourceType: request.resourceType() }));
  page.on('response', response => observed.responses.push({ url: response.url(), status: response.status() }));
  page.on('requestfailed', request => observed.requestFailures.push({ url: request.url(), failure: request.failure() }));
  page.on('console', message => observed.console.push({ type: message.type(), text: message.text() }));
  page.on('pageerror', error => observed.pageErrors.push(String(error?.stack || error)));
  page.on('crash', () => observed.crashes.push({ at: new Date().toISOString() }));
  const requestedUrl = new URL(reviewDocument, carrier.baseUrl).href;
  const started = performance.now();
  let navigation = null;
  let navigationError = null;
  let ready = false;
  let readyError = null;
  try {
    const response = await page.goto(requestedUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    navigation = { status: response?.status() ?? null, finalUrl: response?.url() ?? page.url(), durationMs: performance.now() - started };
  } catch (error) {
    navigationError = String(error?.stack || error);
  }
  if (!navigationError) {
    try {
      await page.waitForFunction(() => document.documentElement.dataset.r1_8Review === 'ready', null, { timeout: 60000 });
      ready = true;
    } catch (error) {
      readyError = String(error?.stack || error);
    }
  }
  const pageState = await page.evaluate(() => ({
    href: location.href,
    ready: document.documentElement.dataset.r1_8Review || null,
    bootstrap: document.documentElement.dataset.r1_8Bootstrap || null,
    runtimeTrace: window.__R1_8_RUNTIME_TRACE__?.rows || [],
    carrierTrace: window.__R1_8_CARRIER_TRACE__?.events || [],
    receipt: window.H_EARTH_C2_R1_R1_8_REVIEW?.getReceipt?.() || null
  })).catch(error => ({ evaluationError: String(error) }));
  await context.close();
  return {
    requestedUrl,
    navigation,
    navigationError,
    ready,
    readyError,
    readyDurationMs: performance.now() - started,
    observed,
    pageState
  };
}

export function classifyCarrier({ direct, browser, assetPath }) {
  const rows = direct.resources;
  const classes = [];
  if (rows.some(row => row.redirectedToDifferentHost)) classes.push('REDIRECT_TO_NON_RAW_CONTENT');
  if (rows.some(row => row.htmlFallbackReturned)) classes.push('HTML_FALLBACK_RETURNED_FOR_JS_OR_BINARY_ASSET');
  if (rows.some(row => !row.mimeIdentityMatch)) classes.push('INCORRECT_MIME_TYPE');
  if (rows.some(row => row.responseByteLength < row.expectedRepositoryByteLength)) classes.push('TRUNCATED_RESPONSE');
  if (rows.some(row => row.repositoryPath === assetPath && !row.byteIdentityMatch)) classes.push('BINARY_ASSET_TRANSFORMATION');
  if (rows.some(row => !row.byteIdentityMatch)) classes.push('SERVED_BYTE_IDENTITY_MISMATCH');
  if (rows.find(row => row.repositoryPath.endsWith('/index.html'))?.byteIdentityMatch === false) classes.push('STALE_COMMIT_OR_CACHE_RESPONSE');
  const text = JSON.stringify(browser).toLowerCase();
  if (browser.pageState?.carrierTrace?.some(row => row.event === 'SECURITY_POLICY_VIOLATION') || text.includes('content security policy')) classes.push('CONTENT_SECURITY_POLICY_REJECTION');
  if (text.includes('cors') || text.includes('cross-origin')) classes.push('CORS_REJECTION');
  if (browser.observed.responses.some(row => row.status >= 400) || browser.observed.requestFailures.length) classes.push('RELATIVE_PATH_OR_BASE_URL_FAILURE');
  if (!browser.ready && direct.allByteIdentical && direct.allMimeCompatible) {
    const webgl = browser.pageState?.runtimeTrace?.find(row => row.event === 'WEBGL_CONTEXT_ESTABLISHED');
    if (webgl?.detail?.established === false) classes.push('THIRD_PARTY_CARRIER_WEBGL_RESTRICTION');
    else if (browser.pageState?.bootstrap === 'failed') classes.push('THIRD_PARTY_CARRIER_MODULE_INCOMPATIBILITY');
    else if (browser.observed.pageErrors.length) classes.push('ACTUAL_SERVED_RUNTIME_FAILURE');
    else classes.push('THIRD_PARTY_CARRIER_MODULE_INCOMPATIBILITY');
  }
  return [...new Set(classes)];
}

export async function traceCarrier({ browser, carrier, graph, gitBytes, reviewDocument, assetPath }) {
  const resources = [];
  for (const repositoryPath of graph) resources.push(await fetchResource({ carrier, repositoryPath, gitBytes, assetPath }));
  const direct = {
    carrier: carrier.id,
    baseUrl: carrier.baseUrl,
    resourceCount: resources.length,
    allHttp200: resources.every(row => row.httpStatus === 200),
    allByteIdentical: resources.every(row => row.byteIdentityMatch),
    allMimeCompatible: resources.every(row => row.mimeIdentityMatch),
    resources
  };
  const browserResult = await browserTrace({ browser, carrier, reviewDocument });
  return {
    carrier,
    direct,
    browser: browserResult,
    classifications: classifyCarrier({ direct, browser: browserResult, assetPath })
  };
}
