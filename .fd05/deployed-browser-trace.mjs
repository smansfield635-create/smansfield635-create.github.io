import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repositoryRoot = process.cwd();
const generatedDir = path.join(repositoryRoot, '.fd05');
await mkdir(generatedDir, { recursive: true });

const deploymentTargets = [
  {
    id: 'CUSTOM_DOMAIN',
    baseUrl: 'https://diamondgatebridge.com/showroom/globe/h-earth/'
  },
  {
    id: 'GITHUB_PAGES_DOMAIN',
    baseUrl: 'https://smansfield635-create.github.io/showroom/globe/h-earth/'
  }
];

const resourceDefinitions = [
  {
    id: 'HTML',
    repositoryPath: 'showroom/globe/h-earth/index.html',
    publicPath: './'
  },
  {
    id: 'INDEX',
    repositoryPath: 'showroom/globe/h-earth/index.js',
    publicPath: './index.js?v=034q'
  },
  {
    id: 'PREVIEW',
    repositoryPath: 'showroom/globe/h-earth/render/geometry-preview.js',
    publicPath: './render/geometry-preview.js?v=034o6'
  },
  {
    id: 'KERNEL',
    repositoryPath: 'showroom/globe/h-earth/render/geometry-kernel.js',
    publicPath: './render/geometry-kernel.js?v=034o4f'
  },
  {
    id: 'PACKET_002',
    repositoryPath: 'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',
    publicPath: '../../../h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js?v=packet002'
  },
  {
    id: 'ADMITTED_FRAME',
    repositoryPath: 'showroom/globe/h-earth/admitted-geometry-frame.js',
    publicPath: './admitted-geometry-frame.js?v=034o7'
  },
  {
    id: 'COMPOSITOR',
    repositoryPath: 'showroom/globe/h-earth/compositor.js',
    publicPath: './compositor.js'
  },
  {
    id: 'RENDERER',
    repositoryPath: 'showroom/globe/h-earth/renderer.js',
    publicPath: './renderer.js'
  },
  {
    id: 'CSS',
    repositoryPath: 'showroom/globe/h-earth/index.css',
    publicPath: './index.css?v=034r'
  }
];

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function normalizeHeaders(headers) {
  const output = {};
  for (const [key, value] of headers.entries()) {
    output[key.toLowerCase()] = value;
  }
  return output;
}

async function buildLocalIdentities() {
  const output = {};
  for (const definition of resourceDefinitions) {
    const bytes = await readFile(
      path.join(repositoryRoot, definition.repositoryPath)
    );
    output[definition.id] = {
      repositoryPath: definition.repositoryPath,
      byteLength: bytes.length,
      sha256: sha256(bytes)
    };
  }
  return output;
}

async function fetchWithIdentity(url, localIdentity) {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'user-agent': 'H-Earth-FD05-Deployed-Browser-Trace/1.0'
      },
      signal: AbortSignal.timeout(45000)
    });
    const bytes = Buffer.from(await response.arrayBuffer());
    const responseSha256 = sha256(bytes);
    return {
      requestedUrl: url,
      finalUrl: response.url,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      elapsedMs: Date.now() - startedAt,
      headers: normalizeHeaders(response.headers),
      byteLength: bytes.length,
      sha256: responseSha256,
      localByteLength: localIdentity.byteLength,
      localSha256: localIdentity.sha256,
      exactMainMatch:
        response.ok &&
        bytes.length === localIdentity.byteLength &&
        responseSha256 === localIdentity.sha256,
      textPrefix: bytes
        .subarray(0, Math.min(bytes.length, 240))
        .toString('utf8')
    };
  } catch (error) {
    return {
      requestedUrl: url,
      ok: false,
      elapsedMs: Date.now() - startedAt,
      errorName: error?.name ?? 'UnknownError',
      errorMessage: error?.message ?? String(error),
      localByteLength: localIdentity.byteLength,
      localSha256: localIdentity.sha256,
      exactMainMatch: false
    };
  }
}

function selectDataset(dataset = {}) {
  const selectedKeys = [
    'hEarthPrebootstrapImportDiagnosticComplete',
    'hEarthFailedImportBranch',
    'hEarthFailedImportRequestedPath',
    'hEarthFailedImportResolvedUrl',
    'hEarthPreviewModuleImported',
    'hEarthPreviewContractVerified',
    'hEarthPreviewExecuted',
    'hEarthPreviewResultEligible',
    'hEarthKernelModuleImported',
    'hEarthKernelContractVerified',
    'hEarthWestAdmissionExecuted',
    'hEarthWestAdmissionEligible',
    'hEarthPacket002ModuleImported',
    'hEarthPacket002ContractVerified',
    'hEarthPacket002Constructed',
    'hEarthPacket002Eligible',
    'hEarthAdmittedFrameModuleImported',
    'hEarthAdmittedFrameContractVerified',
    'hEarthIndexModuleImported',
    'hEarthIndexContractVerified',
    'hEarthIndexInitializationStarted',
    'hEarthRendererBootstrapRequested',
    'hEarthHtmlEntryTaskComplete'
  ];
  return Object.fromEntries(
    selectedKeys.map((key) => [key, dataset[key] ?? null])
  );
}

async function snapshotPage(page) {
  return page.evaluate(() => {
    const byId = (id) => document.getElementById(id);
    const root = byId('h-earth-3d-route-root');
    const mount = byId('h-earth-3d-renderer-mount');
    const statusText = byId('h-earth-3d-status')?.textContent?.trim() ?? null;
    const fallbackText = byId('h-earth-3d-fallback')?.textContent?.trim() ?? null;
    const failure = globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE ?? null;
    const entryReceipt = globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT ?? null;
    const importReceipt = globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT ?? null;
    const routeReceipt = globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT ?? null;
    const rendererReceipt = globalThis.H_EARTH_3D_RENDERER_BOOTSTRAP_RECEIPT ?? null;

    return {
      href: location.href,
      documentReadyState: document.readyState,
      statusText,
      fallbackText,
      rootDataset: root ? { ...root.dataset } : null,
      mount: mount
        ? {
            clientWidth: mount.clientWidth,
            clientHeight: mount.clientHeight,
            childElementCount: mount.childElementCount,
            sourcePreviewCount: mount.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length,
            rendererOwnedCount: mount.querySelectorAll('[data-h-earth-renderer-owned="true"]').length,
            rendererRootCount: mount.querySelectorAll('[data-h-earth-renderer-root="true"]').length,
            textPrefix: mount.textContent?.trim()?.slice(0, 300) ?? ''
          }
        : null,
      failure: failure
        ? {
            phase: failure.phase ?? null,
            status: failure.status ?? null,
            failureClass: failure.failureClass ?? null,
            failedBranch: failure.failedBranch ?? null,
            requestedPath: failure.requestedPath ?? null,
            resolvedUrl: failure.resolvedUrl ?? null,
            errorName: failure.errorName ?? null,
            errorMessage: failure.errorMessage ?? null
          }
        : null,
      entryReceipt: entryReceipt
        ? {
            status: entryReceipt.status ?? null,
            initialized: entryReceipt.initialized ?? null,
            rendererBootstrapRequested: entryReceipt.rendererBootstrapRequested ?? null
          }
        : null,
      importReceipt: importReceipt
        ? {
            attemptedBranchCount: importReceipt.attemptedBranchCount ?? null,
            successfulBranchCount: importReceipt.successfulBranchCount ?? null,
            failedBranchCount: importReceipt.failedBranchCount ?? null,
            failedBranch: importReceipt.failedBranch ?? null,
            allRequiredImportsSucceeded: importReceipt.allRequiredImportsSucceeded ?? null,
            branches: Array.isArray(importReceipt.branchReceipts)
              ? importReceipt.branchReceipts.map((receipt) => ({
                  branchId: receipt.branchId ?? null,
                  requestedPath: receipt.requestedPath ?? null,
                  resolvedUrl: receipt.resolvedUrl ?? null,
                  importStatus: receipt.importStatus ?? null,
                  importSucceeded: receipt.importSucceeded ?? null,
                  errorName: receipt.errorName ?? null,
                  errorMessage: receipt.errorMessage ?? null
                }))
              : []
          }
        : null,
      routeReceipt: routeReceipt
        ? {
            status: routeReceipt.status ?? null,
            rendererBootstrapStatus: routeReceipt.rendererBootstrapStatus ?? null,
            sourcePreviewStatus: routeReceipt.sourcePreviewStatus ?? null
          }
        : null,
      rendererReceipt: rendererReceipt
        ? {
            status: rendererReceipt.status ?? null,
            mounted: rendererReceipt.mounted ?? null,
            failureVariant: rendererReceipt.failureVariant ?? null
          }
        : null
    };
  });
}

async function traceTarget(browser, target, traceToken) {
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 16; FD05Trace) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'
  });

  const page = await context.newPage();
  const consoleEvents = [];
  const pageErrors = [];
  const requestFailures = [];
  const responses = [];

  page.on('console', (message) => {
    consoleEvents.push({
      atMs: Date.now(),
      type: message.type(),
      text: message.text().slice(0, 4000)
    });
  });

  page.on('pageerror', (error) => {
    pageErrors.push({
      atMs: Date.now(),
      name: error?.name ?? 'Error',
      message: error?.message ?? String(error),
      stack: error?.stack?.slice(0, 6000) ?? null
    });
  });

  page.on('requestfailed', (request) => {
    requestFailures.push({
      atMs: Date.now(),
      url: request.url(),
      resourceType: request.resourceType(),
      method: request.method(),
      failure: request.failure()
    });
  });

  page.on('response', async (response) => {
    const url = response.url();
    if (
      url.includes('/showroom/globe/h-earth/') ||
      url.includes('/h-earth-3d/')
    ) {
      responses.push({
        atMs: Date.now(),
        url,
        status: response.status(),
        fromServiceWorker: response.fromServiceWorker(),
        headers: await response.allHeaders().catch(() => ({}))
      });
    }
  });

  await page.addInitScript(() => {
    globalThis.__FD05_TRACE_EVENTS = [];
    addEventListener('error', (event) => {
      globalThis.__FD05_TRACE_EVENTS.push({
        type: 'window.error',
        message: event.message ?? null,
        filename: event.filename ?? null,
        lineno: event.lineno ?? null,
        colno: event.colno ?? null,
        at: Date.now()
      });
    });
    addEventListener('unhandledrejection', (event) => {
      globalThis.__FD05_TRACE_EVENTS.push({
        type: 'window.unhandledrejection',
        reason:
          event.reason instanceof Error
            ? {
                name: event.reason.name,
                message: event.reason.message,
                stack: event.reason.stack ?? null
              }
            : String(event.reason),
        at: Date.now()
      });
    });
  });

  const navigationUrl = new URL(target.baseUrl);
  navigationUrl.searchParams.set('fd05Trace', traceToken);
  const startedAt = Date.now();
  let navigationResult;
  try {
    const response = await page.goto(navigationUrl.href, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    navigationResult = {
      ok: Boolean(response?.ok()),
      status: response?.status() ?? null,
      finalUrl: page.url(),
      elapsedMs: Date.now() - startedAt,
      headers: response ? await response.allHeaders().catch(() => ({})) : {}
    };
  } catch (error) {
    navigationResult = {
      ok: false,
      finalUrl: page.url(),
      elapsedMs: Date.now() - startedAt,
      errorName: error?.name ?? 'UnknownError',
      errorMessage: error?.message ?? String(error)
    };
  }

  const timeline = [];
  let priorKey = null;
  const traceDurationMs = 75000;
  const pollIntervalMs = 500;
  const pollStartedAt = Date.now();

  while (Date.now() - pollStartedAt <= traceDurationMs) {
    let snapshot;
    try {
      snapshot = await snapshotPage(page);
    } catch (error) {
      snapshot = {
        snapshotError: {
          name: error?.name ?? 'UnknownError',
          message: error?.message ?? String(error)
        }
      };
    }
    const compact = {
      elapsedMs: Date.now() - startedAt,
      ...snapshot
    };
    const key = JSON.stringify({
      statusText: compact.statusText,
      fallbackText: compact.fallbackText,
      failure: compact.failure,
      entryReceipt: compact.entryReceipt,
      importReceipt: compact.importReceipt,
      routeReceipt: compact.routeReceipt,
      rendererReceipt: compact.rendererReceipt,
      mount: compact.mount,
      rootDataset: compact.rootDataset
    });
    if (key !== priorKey) {
      timeline.push(compact);
      priorKey = key;
    }

    const terminalStatus = compact.statusText ?? '';
    const terminal =
      terminalStatus.includes('PUBLIC_STAGE_READY') ||
      terminalStatus.includes('PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK') ||
      terminalStatus.includes('PUBLIC_ROUTE_HTML_ENTRY_FAILURE') ||
      compact.failure !== null ||
      compact.rendererReceipt?.mounted === true;

    if (terminal && Date.now() - startedAt > 5000) {
      await page.waitForTimeout(3000);
      const finalSnapshot = await snapshotPage(page).catch(() => null);
      if (finalSnapshot) {
        timeline.push({
          elapsedMs: Date.now() - startedAt,
          finalConfirmation: true,
          ...finalSnapshot
        });
      }
      break;
    }

    await page.waitForTimeout(pollIntervalMs);
  }

  const performanceResources = await page
    .evaluate(() =>
      performance.getEntriesByType('resource').map((entry) => ({
        name: entry.name,
        initiatorType: entry.initiatorType,
        startTime: entry.startTime,
        duration: entry.duration,
        responseEnd: entry.responseEnd,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize,
        nextHopProtocol: entry.nextHopProtocol
      }))
    )
    .catch(() => []);

  const injectedEvents = await page
    .evaluate(() => globalThis.__FD05_TRACE_EVENTS ?? [])
    .catch(() => []);

  const finalSnapshot = await snapshotPage(page).catch(() => null);
  await page.screenshot({
    path: path.join(generatedDir, `deployed-browser-${target.id.toLowerCase()}.png`),
    fullPage: true
  }).catch(() => null);

  await context.close();

  return {
    target,
    navigation: navigationResult,
    timeline,
    finalSnapshot,
    consoleEvents,
    pageErrors,
    requestFailures,
    injectedEvents,
    responses,
    performanceResources
  };
}

const localIdentities = await buildLocalIdentities();
const traceToken = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const publicFetches = {};

for (const target of deploymentTargets) {
  publicFetches[target.id] = {};
  for (const definition of resourceDefinitions) {
    const resourceUrl = new URL(definition.publicPath, target.baseUrl);
    resourceUrl.searchParams.set('fd05Identity', traceToken);
    publicFetches[target.id][definition.id] = await fetchWithIdentity(
      resourceUrl.href,
      localIdentities[definition.id]
    );
  }
}

const browser = await chromium.launch({ headless: true });
const browserTraces = [];
for (const target of deploymentTargets) {
  browserTraces.push(await traceTarget(browser, target, traceToken));
}
await browser.close();

const report = {
  reportId: 'H_EARTH_FD05_DEPLOYED_BROWSER_CORRESPONDENCE_PREWORK_TRACE_001',
  generatedAt: new Date().toISOString(),
  status: 'READ_ONLY_TRACE_COMPLETE',
  repositoryCommit: '637733701f845cdff6bd802b1b94ab7bee5eb299',
  repositoryModified: false,
  traceToken,
  localIdentities,
  publicFetches,
  browserTraces
};

await writeFile(
  path.join(generatedDir, 'generated-deployed-browser-trace.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify({
  reportId: report.reportId,
  status: report.status,
  targets: browserTraces.map((trace) => ({
    id: trace.target.id,
    navigation: trace.navigation,
    terminalStatus: trace.finalSnapshot?.statusText ?? null,
    terminalFallback: trace.finalSnapshot?.fallbackText ?? null,
    failure: trace.finalSnapshot?.failure ?? null,
    importReceipt: trace.finalSnapshot?.importReceipt ?? null,
    rendererReceipt: trace.finalSnapshot?.rendererReceipt ?? null,
    requestFailureCount: trace.requestFailures.length,
    pageErrorCount: trace.pageErrors.length
  }))
}, null, 2));
