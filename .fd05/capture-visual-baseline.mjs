import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repositoryRoot = process.cwd();
const outputDir = path.join(repositoryRoot, '.fd05', 'visual-baseline-output');
await mkdir(outputDir, { recursive: true });

const repositoryCommit = '637733701f845cdff6bd802b1b94ab7bee5eb299';
const routeUrl = 'https://diamondgatebridge.com/showroom/globe/h-earth/';
const token = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const configurations = [
  {
    id: 'mobile',
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 16; FD05VisualBaseline) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'
  },
  {
    id: 'desktop',
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64; FD05VisualBaseline) AppleWebKit/537.36 Chrome/140 Safari/537.36'
  }
];

const identityDefinitions = [
  ['HTML', 'showroom/globe/h-earth/index.html', './'],
  ['INDEX', 'showroom/globe/h-earth/index.js', './index.js?v=034q'],
  ['PREVIEW', 'showroom/globe/h-earth/render/geometry-preview.js', './render/geometry-preview.js?v=034o6'],
  ['ADMITTED_FRAME', 'showroom/globe/h-earth/admitted-geometry-frame.js', './admitted-geometry-frame.js?v=034o7'],
  ['COMPOSITOR', 'showroom/globe/h-earth/compositor.js', './compositor.js'],
  ['RENDERER', 'showroom/globe/h-earth/renderer.js', './renderer.js'],
  ['CSS', 'showroom/globe/h-earth/index.css', './index.css?v=034r']
];

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function compactHeaders(headers) {
  return {
    cacheControl: headers.get('cache-control'),
    age: headers.get('age'),
    cfCacheStatus: headers.get('cf-cache-status'),
    xCache: headers.get('x-cache'),
    etag: headers.get('etag'),
    lastModified: headers.get('last-modified'),
    contentType: headers.get('content-type')
  };
}

async function captureIdentities() {
  const output = {};
  for (const [id, repositoryPath, publicPath] of identityDefinitions) {
    const localBytes = await readFile(path.join(repositoryRoot, repositoryPath));
    const url = new URL(publicPath, routeUrl);
    url.searchParams.set('fd05BaselineIdentity', token);
    const startedAt = Date.now();
    try {
      const response = await fetch(url.href, {
        redirect: 'follow',
        cache: 'no-store',
        headers: {
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'user-agent': 'H-Earth-FD05-Visual-Baseline-Capture/1.0'
        },
        signal: AbortSignal.timeout(60000)
      });
      const publicBytes = Buffer.from(await response.arrayBuffer());
      const publicDigest = sha256(publicBytes);
      const localDigest = sha256(localBytes);
      output[id] = {
        repositoryPath,
        requestedUrl: url.href,
        finalUrl: response.url,
        status: response.status,
        ok: response.ok,
        elapsedMs: Date.now() - startedAt,
        localByteLength: localBytes.length,
        publicByteLength: publicBytes.length,
        localSha256: localDigest,
        publicSha256: publicDigest,
        exactMainMatch:
          response.ok &&
          localBytes.length === publicBytes.length &&
          localDigest === publicDigest,
        headers: compactHeaders(response.headers)
      };
    } catch (error) {
      output[id] = {
        repositoryPath,
        requestedUrl: url.href,
        ok: false,
        elapsedMs: Date.now() - startedAt,
        localByteLength: localBytes.length,
        localSha256: sha256(localBytes),
        exactMainMatch: false,
        errorName: error?.name ?? 'UnknownError',
        errorMessage: error?.message ?? String(error)
      };
    }
  }
  return output;
}

function analyzePng(bytes) {
  const png = PNG.sync.read(bytes);
  const { width, height, data } = png;
  const pixelCount = width * height;
  const sampleStride = Math.max(1, Math.floor(pixelCount / 200000));
  const colors = new Set();
  let sampled = 0;
  let luminanceSum = 0;
  let luminanceSquaredSum = 0;
  let opaqueCount = 0;
  let transparentCount = 0;
  let horizontalTransitions = 0;
  let verticalTransitions = 0;
  let priorHorizontal = null;
  const priorVertical = new Array(width).fill(null);

  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += sampleStride) {
    const offset = pixelIndex * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const a = data[offset + 3];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sampled += 1;
    luminanceSum += luminance;
    luminanceSquaredSum += luminance * luminance;
    if (a > 0) opaqueCount += 1;
    else transparentCount += 1;
    colors.add(`${r >> 3}:${g >> 3}:${b >> 3}:${a >> 5}`);

    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const compact = [r >> 4, g >> 4, b >> 4, a >> 4];
    if (priorHorizontal && x !== 0) {
      const difference =
        Math.abs(compact[0] - priorHorizontal[0]) +
        Math.abs(compact[1] - priorHorizontal[1]) +
        Math.abs(compact[2] - priorHorizontal[2]) +
        Math.abs(compact[3] - priorHorizontal[3]);
      if (difference >= 3) horizontalTransitions += 1;
    }
    priorHorizontal = compact;

    if (priorVertical[x]) {
      const difference =
        Math.abs(compact[0] - priorVertical[x][0]) +
        Math.abs(compact[1] - priorVertical[x][1]) +
        Math.abs(compact[2] - priorVertical[x][2]) +
        Math.abs(compact[3] - priorVertical[x][3]);
      if (difference >= 3) verticalTransitions += 1;
    }
    priorVertical[x] = compact;
    if (x === width - 1) priorHorizontal = null;
  }

  const meanLuminance = luminanceSum / sampled;
  const luminanceVariance =
    luminanceSquaredSum / sampled - meanLuminance * meanLuminance;

  return {
    width,
    height,
    pixelCount,
    sampledPixelCount: sampled,
    sampledOpaqueCount: opaqueCount,
    sampledTransparentCount: transparentCount,
    quantizedUniqueColorCount: colors.size,
    meanLuminance,
    luminanceVariance,
    horizontalTransitions,
    verticalTransitions,
    nonBlankHeuristic:
      colors.size >= 24 &&
      luminanceVariance >= 8 &&
      horizontalTransitions + verticalTransitions >= 40
  };
}

async function saveScreenshot(page, locator, filename) {
  const outputPath = path.join(outputDir, filename);
  if (locator) {
    await locator.screenshot({ path: outputPath, animations: 'disabled' });
  } else {
    await page.screenshot({ path: outputPath, fullPage: true, animations: 'disabled' });
  }
  const bytes = await readFile(outputPath);
  return {
    filename,
    byteLength: bytes.length,
    sha256: sha256(bytes),
    png: analyzePng(bytes)
  };
}

async function getSnapshot(page) {
  return page.evaluate(() => {
    const byId = (id) => document.getElementById(id);
    const root = byId('h-earth-3d-route-root');
    const mount = byId('h-earth-3d-renderer-mount');
    const stage = byId('h-earth-3d-world-stage');
    const status = byId('h-earth-3d-status')?.textContent?.trim() ?? null;
    const fallback = byId('h-earth-3d-fallback')?.textContent?.trim() ?? null;
    const rendererRelatedGlobals = Object.keys(globalThis)
      .filter((key) =>
        key.startsWith('H_EARTH') &&
        (key.includes('RENDERER') || key.includes('PUBLIC_ROUTE') || key.includes('ROUTE_BOOTSTRAP'))
      )
      .sort();

    const summarizeElement = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const computed = getComputedStyle(element);
      return {
        tagName: element.tagName,
        id: element.id || null,
        className: typeof element.className === 'string' ? element.className : null,
        childElementCount: element.childElementCount,
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
        boundingRect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left
        },
        computed: {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          overflow: computed.overflow,
          position: computed.position,
          backgroundColor: computed.backgroundColor
        },
        dataset: { ...element.dataset },
        textPrefix: element.textContent?.trim()?.slice(0, 500) ?? '',
        childSummary: [...element.children].slice(0, 20).map((child) => ({
          tagName: child.tagName,
          id: child.id || null,
          className: typeof child.className === 'string' ? child.className : null,
          dataset: { ...child.dataset },
          childElementCount: child.childElementCount
        }))
      };
    };

    return {
      href: location.href,
      readyState: document.readyState,
      status,
      fallback,
      rootDataset: root ? { ...root.dataset } : null,
      stage: summarizeElement(stage),
      mount: summarizeElement(mount),
      canvasCount: mount?.querySelectorAll('canvas').length ?? 0,
      svgCount: mount?.querySelectorAll('svg').length ?? 0,
      iframeCount: mount?.querySelectorAll('iframe').length ?? 0,
      imageCount: mount?.querySelectorAll('img').length ?? 0,
      rendererOwnedCount:
        mount?.querySelectorAll('[data-h-earth-renderer-owned="true"]').length ?? 0,
      sourcePreviewOwnedCount:
        mount?.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length ?? 0,
      rendererRelatedGlobals,
      publicRouteFailure:
        globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE ?? null,
      publicRouteEntryReceipt:
        globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT ?? null,
      publicImportReceipt:
        globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT ?? null
    };
  });
}

async function runConfiguration(browser, configuration) {
  const context = await browser.newContext({
    viewport: configuration.viewport,
    deviceScaleFactor: configuration.deviceScaleFactor,
    isMobile: configuration.isMobile,
    hasTouch: configuration.hasTouch,
    userAgent: configuration.userAgent,
    colorScheme: 'dark'
  });
  const page = await context.newPage();
  const consoleEvents = [];
  const pageErrors = [];
  const requestFailures = [];
  const relevantResponses = [];

  page.on('console', (message) => {
    consoleEvents.push({
      type: message.type(),
      text: message.text().slice(0, 4000),
      at: new Date().toISOString()
    });
  });
  page.on('pageerror', (error) => {
    pageErrors.push({
      name: error?.name ?? 'Error',
      message: error?.message ?? String(error),
      stack: error?.stack?.slice(0, 6000) ?? null,
      at: new Date().toISOString()
    });
  });
  page.on('requestfailed', (request) => {
    requestFailures.push({
      url: request.url(),
      resourceType: request.resourceType(),
      failure: request.failure(),
      at: new Date().toISOString()
    });
  });
  page.on('response', async (response) => {
    const url = response.url();
    if (
      url.includes('/showroom/globe/h-earth/') ||
      url.includes('/h-earth-3d/')
    ) {
      const headers = await response.allHeaders().catch(() => ({}));
      relevantResponses.push({
        url,
        status: response.status(),
        fromServiceWorker: response.fromServiceWorker(),
        contentType: headers['content-type'] ?? null,
        cacheControl: headers['cache-control'] ?? null,
        age: headers.age ?? null,
        cfCacheStatus: headers['cf-cache-status'] ?? null,
        xCache: headers['x-cache'] ?? null,
        etag: headers.etag ?? null,
        lastModified: headers['last-modified'] ?? null
      });
    }
  });

  const navigationUrl = new URL(routeUrl);
  navigationUrl.searchParams.set('fd05VisualBaseline', `${token}-${configuration.id}`);
  const startedAt = Date.now();
  const response = await page.goto(navigationUrl.href, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  const timeline = [];
  let priorKey = null;
  const timeoutMs = 120000;
  let terminalSnapshot = null;

  while (Date.now() - startedAt <= timeoutMs) {
    const snapshot = await getSnapshot(page);
    const entry = {
      elapsedMs: Date.now() - startedAt,
      status: snapshot.status,
      fallback: snapshot.fallback,
      rootDataset: snapshot.rootDataset,
      mount: snapshot.mount,
      publicRouteFailure: snapshot.publicRouteFailure
    };
    const key = JSON.stringify({
      status: entry.status,
      fallback: entry.fallback,
      rootDataset: entry.rootDataset,
      mount: entry.mount,
      failure: entry.publicRouteFailure
    });
    if (key !== priorKey) {
      timeline.push(entry);
      priorKey = key;
    }

    if (snapshot.status === 'PUBLIC_STAGE_RENDERER_MOUNTED') {
      terminalSnapshot = snapshot;
      break;
    }

    if (
      snapshot.publicRouteFailure ||
      snapshot.status === 'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK' ||
      snapshot.status === 'PUBLIC_ROUTE_HTML_ENTRY_FAILURE'
    ) {
      terminalSnapshot = snapshot;
      break;
    }

    await page.waitForTimeout(250);
  }

  if (!terminalSnapshot) {
    terminalSnapshot = await getSnapshot(page);
  }

  const terminalReached =
    terminalSnapshot.status === 'PUBLIC_STAGE_RENDERER_MOUNTED';

  if (terminalReached) {
    await page.waitForTimeout(3000);
    terminalSnapshot = await getSnapshot(page);
  }

  const fullScreenshot = await saveScreenshot(
    page,
    null,
    `${configuration.id}-full-page.png`
  );
  const stageScreenshot = await saveScreenshot(
    page,
    page.locator('#h-earth-3d-world-stage'),
    `${configuration.id}-world-stage.png`
  );
  const mountScreenshot = await saveScreenshot(
    page,
    page.locator('#h-earth-3d-renderer-mount'),
    `${configuration.id}-renderer-mount.png`
  );

  const performanceResources = await page.evaluate(() =>
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
  );

  await context.close();

  return {
    id: configuration.id,
    configuration,
    navigation: {
      requestedUrl: navigationUrl.href,
      finalUrl: page.url(),
      status: response?.status() ?? null,
      ok: response?.ok() ?? false,
      elapsedToTerminalMs: Date.now() - startedAt
    },
    terminalReached,
    terminalSnapshot,
    timeline,
    screenshots: {
      fullPage: fullScreenshot,
      worldStage: stageScreenshot,
      rendererMount: mountScreenshot
    },
    consoleEvents,
    pageErrors,
    requestFailures,
    relevantResponses,
    longestResources: [...performanceResources]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 25)
  };
}

const publicIdentities = await captureIdentities();
const browser = await chromium.launch({ headless: true });
const captures = [];
for (const configuration of configurations) {
  captures.push(await runConfiguration(browser, configuration));
}
await browser.close();

const allIdentitiesMatch = Object.values(publicIdentities).every(
  (identity) => identity.exactMainMatch === true
);
const allTerminalReached = captures.every((capture) => capture.terminalReached);
const allScreenshotsNonBlank = captures.every((capture) =>
  Object.values(capture.screenshots).every(
    (screenshot) => screenshot.png.nonBlankHeuristic === true
  )
);
const anyErrors = captures.some(
  (capture) =>
    capture.pageErrors.length > 0 ||
    capture.requestFailures.length > 0 ||
    capture.terminalSnapshot.publicRouteFailure
);

const report = {
  reportId: 'H_EARTH_FD05_VISUAL_BASELINE_CAPTURE_REPORT_001',
  generatedAt: new Date().toISOString(),
  workflowStatus: 'CAPTURE_COMPLETE',
  repositoryCommit,
  repositoryModified: false,
  routeUrl,
  token,
  publicIdentities,
  captures,
  mechanicalDisposition: {
    allTestedPublicIdentitiesMatchMain: allIdentitiesMatch,
    mobileRendererMounted: captures.find((capture) => capture.id === 'mobile')?.terminalReached ?? false,
    desktopRendererMounted: captures.find((capture) => capture.id === 'desktop')?.terminalReached ?? false,
    allScreenshotsMechanicallyNonBlank: allScreenshotsNonBlank,
    explicitFailureOrRequestErrorObserved: anyErrors,
    rendererMountMechanicallyEstablished:
      allIdentitiesMatch && allTerminalReached && !anyErrors,
    visualQualityPass: 'REQUIRES_IMAGE_REVIEW',
    visualBaselineAcceptance: 'PENDING_IMAGE_REVIEW',
    productionClaim: false
  }
};

await writeFile(
  path.join(outputDir, 'visual-baseline-capture-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify({
  reportId: report.reportId,
  mechanicalDisposition: report.mechanicalDisposition,
  captures: captures.map((capture) => ({
    id: capture.id,
    finalStatus: capture.terminalSnapshot.status,
    elapsedToTerminalMs: capture.navigation.elapsedToTerminalMs,
    mount: capture.terminalSnapshot.mount,
    screenshots: capture.screenshots,
    pageErrorCount: capture.pageErrors.length,
    requestFailureCount: capture.requestFailures.length
  }))
}, null, 2));
