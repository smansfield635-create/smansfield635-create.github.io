import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = '.fd05/generated-deployed-browser-trace.json';
const outputPath = '.fd05/generated-deployed-browser-summary.json';
const trace = JSON.parse(await readFile(sourcePath, 'utf8'));

function compactSnapshot(snapshot) {
  if (!snapshot) return null;
  return {
    elapsedMs: snapshot.elapsedMs ?? null,
    finalConfirmation: snapshot.finalConfirmation ?? false,
    href: snapshot.href ?? null,
    documentReadyState: snapshot.documentReadyState ?? null,
    statusText: snapshot.statusText ?? null,
    fallbackText: snapshot.fallbackText ?? null,
    dataset: snapshot.rootDataset
      ? {
          importDiagnosticComplete:
            snapshot.rootDataset.hEarthPrebootstrapImportDiagnosticComplete ?? null,
          failedImportBranch:
            snapshot.rootDataset.hEarthFailedImportBranch ?? null,
          previewImported:
            snapshot.rootDataset.hEarthPreviewModuleImported ?? null,
          previewExecuted:
            snapshot.rootDataset.hEarthPreviewExecuted ?? null,
          kernelImported:
            snapshot.rootDataset.hEarthKernelModuleImported ?? null,
          westEligible:
            snapshot.rootDataset.hEarthWestAdmissionEligible ?? null,
          packet002Imported:
            snapshot.rootDataset.hEarthPacket002ModuleImported ?? null,
          packet002Eligible:
            snapshot.rootDataset.hEarthPacket002Eligible ?? null,
          admittedFrameImported:
            snapshot.rootDataset.hEarthAdmittedFrameModuleImported ?? null,
          indexImported:
            snapshot.rootDataset.hEarthIndexModuleImported ?? null,
          indexInitializationStarted:
            snapshot.rootDataset.hEarthIndexInitializationStarted ?? null,
          rendererBootstrapRequested:
            snapshot.rootDataset.hEarthRendererBootstrapRequested ?? null,
          htmlEntryTaskComplete:
            snapshot.rootDataset.hEarthHtmlEntryTaskComplete ?? null,
          compositorImportSucceeded:
            snapshot.rootDataset.hEarthCompositorImportSucceeded ?? null,
          rendererImportSucceeded:
            snapshot.rootDataset.hEarthRendererImportSucceeded ?? null,
          rendererConstructed:
            snapshot.rootDataset.hEarthRendererConstructed ?? null,
          rendererMounted:
            snapshot.rootDataset.hEarthRendererMounted ?? null,
          sourcePreviewMounted:
            snapshot.rootDataset.hEarthSourcePreviewMounted ?? null,
          sourcePreviewTakenOver:
            snapshot.rootDataset.hEarthSourcePreviewTakenOver ?? null
        }
      : null,
    mount: snapshot.mount ?? null,
    failure: snapshot.failure ?? null,
    entryReceipt: snapshot.entryReceipt ?? null,
    importReceipt: snapshot.importReceipt
      ? {
          attemptedBranchCount: snapshot.importReceipt.attemptedBranchCount,
          successfulBranchCount: snapshot.importReceipt.successfulBranchCount,
          failedBranchCount: snapshot.importReceipt.failedBranchCount,
          failedBranch: snapshot.importReceipt.failedBranch,
          allRequiredImportsSucceeded:
            snapshot.importReceipt.allRequiredImportsSucceeded,
          branches: snapshot.importReceipt.branches
        }
      : null,
    routeReceipt: snapshot.routeReceipt ?? null,
    rendererReceipt: snapshot.rendererReceipt ?? null
  };
}

function classifyTarget(targetTrace) {
  const final = targetTrace.finalSnapshot;
  const timeline = targetTrace.timeline ?? [];
  const last = final ?? timeline.at(-1) ?? null;
  const imports = last?.importReceipt;
  const allImportsSucceeded = imports?.allRequiredImportsSucceeded === true;
  const rendererMounted = last?.rendererReceipt?.mounted === true;
  const failure = last?.failure ?? null;
  const routeStatus = last?.statusText ?? null;
  const indexInitializationStarted =
    last?.rootDataset?.hEarthIndexInitializationStarted === 'true';
  const rendererBootstrapRequested =
    last?.rootDataset?.hEarthRendererBootstrapRequested === 'true';
  const compositorImportSucceeded =
    last?.rootDataset?.hEarthCompositorImportSucceeded === 'true';
  const rendererImportSucceeded =
    last?.rootDataset?.hEarthRendererImportSucceeded === 'true';

  if (rendererMounted) {
    return {
      classification: 'DEPLOYED_RENDERER_MOUNT_ESTABLISHED',
      firstDivergence: null
    };
  }

  if (failure) {
    return {
      classification: 'DEPLOYED_ROUTE_EXPLICIT_FAILURE',
      firstDivergence: {
        phase: failure.phase,
        failureClass: failure.failureClass,
        failedBranch: failure.failedBranch,
        errorName: failure.errorName,
        errorMessage: failure.errorMessage
      }
    };
  }

  if (
    allImportsSucceeded &&
    indexInitializationStarted &&
    rendererBootstrapRequested &&
    !compositorImportSucceeded &&
    !rendererImportSucceeded
  ) {
    return {
      classification: 'STEP_034Q_MODULE_RESPONSE_PROBE_STALL_OR_LONG_PENDING_STATE',
      firstDivergence: {
        boundary:
          'index.initializeHEarthRoute -> independent compositor/renderer deployed-response probes',
        observedStatus: routeStatus,
        importsCompleted: true,
        rendererBootstrapRequested: true,
        compositorImportSucceeded: false,
        rendererImportSucceeded: false,
        explicitFailurePublished: false
      }
    };
  }

  if (!allImportsSucceeded) {
    return {
      classification: 'PREBOOTSTRAP_IMPORT_INCOMPLETE_OR_REJECTED',
      firstDivergence: {
        boundary: 'HTML sequential dynamic import corridor',
        importReceipt: imports ?? null
      }
    };
  }

  return {
    classification: 'DEPLOYED_ROUTE_INCOMPLETE_UNCLASSIFIED',
    firstDivergence: {
      observedStatus: routeStatus,
      indexInitializationStarted,
      rendererBootstrapRequested,
      compositorImportSucceeded,
      rendererImportSucceeded
    }
  };
}

const resourceCorrespondence = {};
for (const [targetId, resources] of Object.entries(trace.publicFetches ?? {})) {
  resourceCorrespondence[targetId] = Object.fromEntries(
    Object.entries(resources).map(([resourceId, resource]) => [
      resourceId,
      {
        requestedUrl: resource.requestedUrl ?? null,
        finalUrl: resource.finalUrl ?? null,
        status: resource.status ?? null,
        elapsedMs: resource.elapsedMs ?? null,
        byteLength: resource.byteLength ?? null,
        sha256: resource.sha256 ?? null,
        exactMainMatch: resource.exactMainMatch ?? false,
        cacheControl: resource.headers?.['cache-control'] ?? null,
        age: resource.headers?.age ?? null,
        cfCacheStatus: resource.headers?.['cf-cache-status'] ?? null,
        xCache: resource.headers?.['x-cache'] ?? null,
        lastModified: resource.headers?.['last-modified'] ?? null,
        errorName: resource.errorName ?? null,
        errorMessage: resource.errorMessage ?? null
      }
    ])
  );
}

const browserTargets = (trace.browserTraces ?? []).map((targetTrace) => {
  const timeline = (targetTrace.timeline ?? []).map(compactSnapshot);
  const longestResources = [...(targetTrace.performanceResources ?? [])]
    .sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0))
    .slice(0, 20);
  const relevantResponses = (targetTrace.responses ?? [])
    .filter((response) =>
      response.url.includes('/compositor.js') ||
      response.url.includes('/renderer.js') ||
      response.url.includes('/index.js') ||
      response.url.includes('/geometry-preview.js')
    )
    .map((response) => ({
      url: response.url,
      status: response.status,
      fromServiceWorker: response.fromServiceWorker,
      cacheControl: response.headers?.['cache-control'] ?? null,
      age: response.headers?.age ?? null,
      cfCacheStatus: response.headers?.['cf-cache-status'] ?? null,
      xCache: response.headers?.['x-cache'] ?? null,
      etag: response.headers?.etag ?? null,
      lastModified: response.headers?.['last-modified'] ?? null
    }));

  return {
    target: targetTrace.target,
    navigation: targetTrace.navigation,
    classification: classifyTarget(targetTrace),
    timeline,
    finalSnapshot: compactSnapshot(targetTrace.finalSnapshot),
    consoleEvents: targetTrace.consoleEvents,
    pageErrors: targetTrace.pageErrors,
    requestFailures: targetTrace.requestFailures,
    injectedEvents: targetTrace.injectedEvents,
    relevantResponses,
    longestResources
  };
});

const exactMatchSummary = Object.fromEntries(
  Object.entries(resourceCorrespondence).map(([targetId, resources]) => [
    targetId,
    {
      allExactMainMatches: Object.values(resources).every(
        (resource) => resource.exactMainMatch === true
      ),
      mismatches: Object.entries(resources)
        .filter(([, resource]) => resource.exactMainMatch !== true)
        .map(([resourceId, resource]) => ({ resourceId, ...resource }))
    }
  ])
);

const summary = {
  reportId: 'H_EARTH_FD05_DEPLOYED_BROWSER_CORRESPONDENCE_PREWORK_SUMMARY_001',
  generatedAt: new Date().toISOString(),
  status: 'READ_ONLY_PREWORK_COMPLETE',
  repositoryCommit: trace.repositoryCommit,
  repositoryModified: false,
  sourceTraceReportId: trace.reportId,
  exactMatchSummary,
  resourceCorrespondence,
  browserTargets,
  overallDisposition: {
    additionalSceneDefinitionAuthorized: false,
    visualBaselineEstablished: browserTargets.some(
      (target) =>
        target.classification.classification ===
        'DEPLOYED_RENDERER_MOUNT_ESTABLISHED'
    ),
    sourceRepairWorkflowAuthorizedBySummary: false,
    operatorManualReceiptRetrievalRequired: false
  }
};

await writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  reportId: summary.reportId,
  exactMatchSummary: summary.exactMatchSummary,
  browserTargets: summary.browserTargets.map((target) => ({
    id: target.target.id,
    classification: target.classification,
    finalStatus: target.finalSnapshot?.statusText ?? null,
    finalFallback: target.finalSnapshot?.fallbackText ?? null,
    pageErrorCount: target.pageErrors.length,
    requestFailureCount: target.requestFailures.length
  })),
  overallDisposition: summary.overallDisposition
}, null, 2));
