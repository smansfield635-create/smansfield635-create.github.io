import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const H_EARTH_RENDERER_CORRIDOR_COMMON_CONTRACT_ID =
  'H_EARTH_RENDERER_CORRIDOR_BROWSER_OBSERVATION_COMMON_v1';

export const EXPECTED_ROUTE_STATUS = 'PUBLIC_STAGE_RENDERER_MOUNTED';

export const REQUIRED_PRODUCTION_MODULE_PATHS = Object.freeze([
  '/showroom/globe/h-earth/index.html',
  '/showroom/globe/h-earth/render/shoreline-preview.js',
  '/showroom/globe/h-earth/render/geometry-kernel.js',
  '/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',
  '/showroom/globe/h-earth/admitted-geometry-frame.js',
  '/showroom/globe/h-earth/index.js',
  '/showroom/globe/h-earth/compositor.js',
  '/showroom/globe/h-earth/renderer.js',
  '/showroom/globe/h-earth/capacity.js'
]);

const MIME_TYPES = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
});

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function stableNormalize(value, seen = new WeakSet()) {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : String(value);
  }

  if (typeof value === 'bigint') {
    return String(value);
  }

  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') {
    return null;
  }

  if (seen.has(value)) {
    return '[Circular]';
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((entry) => stableNormalize(entry, seen));
  }

  const output = {};
  for (const key of Object.keys(value).sort()) {
    output[key] = stableNormalize(value[key], seen);
  }
  return output;
}

export function stableStringify(value) {
  return JSON.stringify(stableNormalize(value), null, 2);
}

export function sha256Text(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

export function attachDeterministicDigest(receipt) {
  const normalized = stableNormalize(receipt);
  const canonicalJson = JSON.stringify(normalized);
  return Object.freeze({
    ...normalized,
    deterministicReceiptSha256: sha256Text(canonicalJson)
  });
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${stableStringify(value)}\n`, 'utf8');
}

export function uniqueSorted(values) {
  return Array.from(new Set(values)).sort();
}

export function pathnameFromUrl(value) {
  try {
    return new URL(value).pathname;
  } catch (_error) {
    return null;
  }
}

export function moduleGraphEvaluation(requestUrls) {
  const observedPaths = uniqueSorted(
    requestUrls
      .map(pathnameFromUrl)
      .filter((value) => typeof value === 'string')
      .map((value) =>
        value === '/showroom/globe/h-earth/'
          ? '/showroom/globe/h-earth/index.html'
          : value
      )
  );

  const missingRequiredPaths = REQUIRED_PRODUCTION_MODULE_PATHS.filter(
    (requiredPath) => !observedPaths.includes(requiredPath)
  );

  return Object.freeze({
    eligible: missingRequiredPaths.length === 0,
    requiredPaths: REQUIRED_PRODUCTION_MODULE_PATHS,
    observedPaths,
    missingRequiredPaths
  });
}

export function collectImportRejections(value) {
  const failures = [];
  const seen = new WeakSet();

  function visit(input, pathValue) {
    if (input === null || typeof input !== 'object') return;
    if (seen.has(input)) return;
    seen.add(input);

    if (input.importSucceeded === false || input.importStatus === 'REJECTED') {
      failures.push({
        path: pathValue,
        branchId: input.branchId ?? null,
        requestedPath: input.requestedPath ?? null,
        resolvedUrl: input.resolvedUrl ?? null,
        importStatus: input.importStatus ?? null,
        errorName: input.errorName ?? null,
        errorMessage: input.errorMessage ?? null
      });
    }

    if (Array.isArray(input.failedBranches) && input.failedBranches.length > 0) {
      failures.push({
        path: `${pathValue}.failedBranches`,
        failedBranches: [...input.failedBranches]
      });
    }

    for (const [key, nested] of Object.entries(input)) {
      visit(nested, `${pathValue}.${key}`);
    }
  }

  visit(value, 'root');
  return failures;
}

export function createStaticRepositoryServer({
  repositoryRoot = process.cwd(),
  host = '127.0.0.1'
} = {}) {
  const resolvedRoot = path.resolve(repositoryRoot);
  let server = null;

  return Object.freeze({
    async start() {
      if (server) throw new Error('Static repository server already started.');

      server = http.createServer(async (request, response) => {
        try {
          const requestUrl = new URL(request.url ?? '/', `http://${host}`);
          let pathname = decodeURIComponent(requestUrl.pathname);
          if (pathname.endsWith('/')) pathname += 'index.html';

          const candidate = path.resolve(resolvedRoot, `.${pathname}`);
          const withinRoot =
            candidate === resolvedRoot || candidate.startsWith(`${resolvedRoot}${path.sep}`);

          if (!withinRoot) {
            response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
            response.end('Forbidden');
            return;
          }

          const file = await fs.readFile(candidate);
          const extension = path.extname(candidate).toLowerCase();

          response.writeHead(200, {
            'cache-control': 'no-store, max-age=0',
            'content-type': MIME_TYPES[extension] ?? 'application/octet-stream',
            'x-content-type-options': 'nosniff'
          });
          response.end(file);
        } catch (error) {
          const status = error?.code === 'ENOENT' ? 404 : 500;
          response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
          response.end(status === 404 ? 'Not found' : 'Internal server error');
        }
      });

      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, host, resolve);
      });

      const address = server.address();
      if (!address || typeof address === 'string') {
        throw new Error('Static repository server did not expose a TCP address.');
      }

      return Object.freeze({
        host,
        port: address.port,
        baseUrl: `http://${host}:${address.port}`
      });
    },

    async stop() {
      if (!server) return;
      const active = server;
      server = null;
      await new Promise((resolve, reject) => {
        active.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });
}

export async function observeHEarthRoute(page) {
  return page.evaluate(({ expectedStatus }) => {
    const copy = (value) => {
      try {
        return JSON.parse(JSON.stringify(value));
      } catch (_error) {
        return null;
      }
    };

    const roots = [
      globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT,
      globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE,
      globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS,
      globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT,
      globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_COMPLETION,
      globalThis.H_EARTH_3D_MODULE_IMPORT_DIAGNOSTIC_RECEIPT,
      globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT
    ].filter(Boolean);

    const seen = new WeakSet();
    const records = [];

    function visit(input) {
      if (input === null || typeof input !== 'object') return;
      if (seen.has(input)) return;
      seen.add(input);

      if (!Array.isArray(input)) records.push(input);
      for (const nested of Object.values(input)) visit(nested);
    }

    roots.forEach(visit);

    const constructReceipt = records.find(
      (record) => record.receiptType === 'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT'
    ) ?? null;

    const mountReceipt = records.find(
      (record) => record.receiptType === 'H_EARTH_3D_RENDERER_MOUNT_RECEIPT'
    ) ?? null;

    const routeRoot = document.getElementById('h-earth-3d-route-root');
    const rendererMount = document.getElementById('h-earth-3d-renderer-mount');
    const statusNode = document.getElementById('h-earth-3d-status');
    const fallbackNode = document.getElementById('h-earth-3d-fallback');

    const primitiveNodes = rendererMount
      ? Array.from(rendererMount.querySelectorAll('[data-primitive-id]'))
      : [];
    const semanticNodes = rendererMount
      ? Array.from(rendererMount.querySelectorAll('[data-semantic-layer-container-id]'))
      : [];
    const interactionNodes = rendererMount
      ? Array.from(rendererMount.querySelectorAll('[data-renderer-interaction-boundary="true"]'))
      : [];
    const allRendererNodes = rendererMount
      ? Array.from(rendererMount.querySelectorAll('*'))
      : [];

    const primitiveIds = primitiveNodes
      .map((node) => node.dataset.primitiveId)
      .filter(Boolean);

    const depthClippedFragmentCount = primitiveNodes.filter(
      (node) => node.dataset.depthClipped === 'true'
    ).length;
    const viewportClippedFragmentCount = primitiveNodes.filter(
      (node) => node.dataset.viewportClipped === 'true'
    ).length;
    const depthAndViewportClippedFragmentCount = primitiveNodes.filter(
      (node) =>
        node.dataset.depthClipped === 'true' &&
        node.dataset.viewportClipped === 'true'
    ).length;

    const sourceObjectIds = [];
    const sourceIdentitySeen = new WeakSet();

    function collectSourceObjectIds(input) {
      if (input === null || typeof input !== 'object') return;
      if (sourceIdentitySeen.has(input)) return;
      sourceIdentitySeen.add(input);

      if (typeof input.sourceObjectId === 'string') {
        sourceObjectIds.push(input.sourceObjectId);
      }
      if (Array.isArray(input.sourceObjectIds)) {
        for (const value of input.sourceObjectIds) {
          if (typeof value === 'string') sourceObjectIds.push(value);
        }
      }

      for (const nested of Object.values(input)) collectSourceObjectIds(nested);
    }

    collectSourceObjectIds(constructReceipt);
    collectSourceObjectIds(mountReceipt);

    if (sourceObjectIds.length === 0) {
      const serializedIdentityRoots = JSON.stringify(copy([
        constructReceipt,
        mountReceipt,
        globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT
      ]) ?? []);
      sourceObjectIds.push(
        ...(serializedIdentityRoots.match(/OBJ_\d{3}_[A-Z0-9_]+/g) ?? [])
      );
    }

    const routeStatus = statusNode?.textContent?.trim() ?? null;
    const routeDataset = routeRoot ? { ...routeRoot.dataset } : {};

    const admittedPrimitiveCount =
      constructReceipt?.admittedPrimitiveCount ??
      globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT
        ?.packet002AdmittedPrimitiveCount ??
      null;

    const projectedPrimitiveFragmentCount =
      constructReceipt?.projectedPrimitiveFragmentCount ??
      mountReceipt?.projectedPrimitiveFragmentCount ??
      primitiveNodes.length;

    const frameViewport =
      constructReceipt?.frameViewport ??
      mountReceipt?.frameViewport ??
      null;

    const projectionContext =
      constructReceipt?.projectionPlan?.projectionContext ?? null;

    return {
      routeStatus,
      expectedRouteStatus: expectedStatus,
      routeRootPresent: Boolean(routeRoot),
      rendererMountPresent: Boolean(rendererMount),
      routeDataset,
      fallbackText: fallbackNode?.textContent?.trim() ?? null,
      htmlEntryReceipt: copy(globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT),
      htmlEntryFailure: copy(globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE),
      bootstrapStatus: copy(globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS),
      bootstrapReceipt: copy(globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT),
      bootstrapCompletion: copy(globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_COMPLETION),
      moduleImportDiagnosticReceipt: copy(
        globalThis.H_EARTH_3D_MODULE_IMPORT_DIAGNOSTIC_RECEIPT
      ),
      htmlImportDiagnosticReceipt: copy(
        globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT
      ),
      constructReceipt: copy(constructReceipt),
      mountReceipt: copy(mountReceipt),
      frameIdentity: {
        packet002TransferOccurrenceId:
          constructReceipt?.packet002TransferOccurrenceId ??
          globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT
            ?.packet002TransferOccurrenceId ??
          null,
        compositorFrameOccurrenceId:
          constructReceipt?.compositorFrameOccurrenceId ??
          mountReceipt?.compositorFrameOccurrenceId ??
          globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT
            ?.compositorFrameOccurrenceId ??
          null,
        compositorFrameRevision:
          constructReceipt?.compositorFrameRevision ??
          mountReceipt?.compositorFrameRevision ??
          null,
        cameraRevision:
          constructReceipt?.cameraRevision ??
          mountReceipt?.cameraRevision ??
          null,
        compositorViewportRevision:
          constructReceipt?.compositorViewportRevision ??
          mountReceipt?.compositorViewportRevision ??
          null,
        visibilityRevision:
          constructReceipt?.visibilityRevision ??
          mountReceipt?.visibilityRevision ??
          null
      },
      frameViewport: copy(frameViewport),
      projectionContext: copy(projectionContext),
      counts: {
        admittedSourcePrimitives: admittedPrimitiveCount,
        projectedClippedFragments: projectedPrimitiveFragmentCount,
        projectedFragmentDomNodes: primitiveNodes.length,
        uniqueProjectedSourcePrimitiveIds: Array.from(new Set(primitiveIds)).sort(),
        semanticContainers: semanticNodes.length,
        interactionNodes: interactionNodes.length,
        finalRendererOwnedDomNodes: allRendererNodes.length,
        rendererInfrastructureNodes:
          allRendererNodes.length -
          primitiveNodes.length -
          semanticNodes.length -
          interactionNodes.length
      },
      clippingTotals: {
        depthClippedFragments: depthClippedFragmentCount,
        viewportClippedFragments: viewportClippedFragmentCount,
        depthAndViewportClippedFragments:
          depthAndViewportClippedFragmentCount,
        unclippedFragments:
          primitiveNodes.length -
          new Set([
            ...primitiveNodes
              .filter((node) => node.dataset.depthClipped === 'true')
              .map((node) => node),
            ...primitiveNodes
              .filter((node) => node.dataset.viewportClipped === 'true')
              .map((node) => node)
          ]).size,
        projectionExpansionCount:
          Number.isInteger(admittedPrimitiveCount)
            ? primitiveNodes.length - admittedPrimitiveCount
            : null
      },
      observedObjectIds: Array.from(new Set(sourceObjectIds)).sort(),
      rendererConstructionSucceeded: constructReceipt?.constructed === true,
      rendererMountSucceeded: mountReceipt?.mounted === true,
      fallbackRestored:
        routeDataset.hEarthSourcePreviewMounted === 'true' ||
        routeDataset.hEarthSourcePreviewTakenOver !== 'true' ||
        globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS?.sourcePreviewStatus ===
          'SOURCE_PREVIEW_RESTORED_AFTER_RENDERER_FAILURE',
      compositorImportSucceeded:
        routeDataset.hEarthCompositorImportSucceeded === 'true',
      rendererImportSucceeded:
        routeDataset.hEarthRendererImportSucceeded === 'true'
    };
  }, { expectedStatus: EXPECTED_ROUTE_STATUS });
}

export function classifyObservation({
  observation,
  moduleGraph,
  capacityEvaluation,
  expectedObjectIds,
  requestFailures,
  errorResponses,
  pageErrors,
  consoleErrors
}) {
  const checks = [];
  const issues = [];

  function check(id, passed, details = null) {
    const record = { id, passed: passed === true, details };
    checks.push(record);
    if (!record.passed) issues.push(record);
  }

  const objectIds = uniqueSorted(observation.observedObjectIds ?? []);
  const expectedIds = uniqueSorted(expectedObjectIds);
  const exactObjectIdentity =
    objectIds.length === expectedIds.length &&
    objectIds.every((value, index) => value === expectedIds[index]);

  const importRejections = collectImportRejections({
    html: observation.htmlImportDiagnosticReceipt,
    route: observation.moduleImportDiagnosticReceipt,
    bootstrap: observation.bootstrapStatus
  });

  check('ACTUAL_PRODUCTION_INDEX_HTML_AND_MODULE_GRAPH_LOADED', moduleGraph.eligible, moduleGraph);
  check('EXACT_THREE_OBJECT_PACKET_002_IDENTITY', exactObjectIdentity, {
    expectedObjectIds: expectedIds,
    observedObjectIds: objectIds
  });
  check('EXACT_THREE_ADMITTED_SOURCE_PRIMITIVES',
    observation.counts.admittedSourcePrimitives === 3,
    observation.counts.admittedSourcePrimitives);
  check('PROJECTED_RECEIPT_AND_DOM_FRAGMENT_COUNTS_MATCH',
    observation.counts.projectedClippedFragments ===
      observation.counts.projectedFragmentDomNodes,
    observation.counts);
  check('RENDERER_CONSTRUCTION_SUCCEEDED',
    observation.rendererConstructionSucceeded === true,
    observation.constructReceipt?.status ?? null);
  check('RENDERER_MOUNT_SUCCEEDED',
    observation.rendererMountSucceeded === true,
    observation.mountReceipt?.status ?? null);
  check('ROUTE_STATUS_PUBLIC_STAGE_RENDERER_MOUNTED',
    observation.routeStatus === EXPECTED_ROUTE_STATUS,
    observation.routeStatus);
  check('FALLBACK_NOT_RESTORED', observation.fallbackRestored === false, {
    routeDataset: observation.routeDataset,
    fallbackText: observation.fallbackText
  });
  check('COMPOSITOR_IMPORT_SUCCEEDED', observation.compositorImportSucceeded === true);
  check('RENDERER_IMPORT_SUCCEEDED', observation.rendererImportSucceeded === true);
  check('NO_MODULE_IMPORT_REJECTIONS', importRejections.length === 0, importRejections);
  check('NO_REQUIRED_REQUEST_FAILURES', requestFailures.length === 0, requestFailures);
  check('NO_REQUIRED_HTTP_ERROR_RESPONSES', errorResponses.length === 0, errorResponses);
  check('NO_PAGE_ERRORS', pageErrors.length === 0, pageErrors);
  check('NO_CONSOLE_ERRORS', consoleErrors.length === 0, consoleErrors);
  check('ALL_STAGE_SPECIFIC_CAPACITY_BUDGETS_PASS',
    capacityEvaluation.eligible === true,
    capacityEvaluation);
  check('EXACT_FRAME_IDENTITY_RECORDED',
    typeof observation.frameIdentity.packet002TransferOccurrenceId === 'string' &&
      typeof observation.frameIdentity.compositorFrameOccurrenceId === 'string',
    observation.frameIdentity);
  check('FRAME_VIEWPORT_RECORDED', isPlainObject(observation.frameViewport), observation.frameViewport);
  check('FRAME_CAMERA_PROJECTION_CONTEXT_RECORDED',
    isPlainObject(observation.projectionContext),
    observation.projectionContext);

  return Object.freeze({
    passed: checks.every((entry) => entry.passed),
    status: checks.every((entry) => entry.passed)
      ? 'H_EARTH_RENDERER_CORRIDOR_PASS'
      : 'H_EARTH_RENDERER_CORRIDOR_FAIL',
    checks: Object.freeze(checks),
    issues: Object.freeze(issues),
    importRejections: Object.freeze(importRejections)
  });
}

export function repositoryRootFromThisModule(importMetaUrl) {
  const currentFile = fileURLToPath(importMetaUrl);
  return path.resolve(path.dirname(currentFile), '..');
}
