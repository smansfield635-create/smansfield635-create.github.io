export const H_EARTH_RENDERER_CORRIDOR_OBSERVATION_CONTRACT_ID =
  'H_EARTH_RENDERER_CORRIDOR_TERMINAL_AND_MEASUREMENT_OBSERVATION_v2';

export const LAWFUL_TERMINAL_ROUTE_STATUSES = Object.freeze([
  'PUBLIC_STAGE_RENDERER_MOUNTED',
  'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK',
  'PUBLIC_STAGE_ERROR'
]);

export const H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS = Object.freeze({
  RENDERER_MOUNTED: 'RENDERER_MOUNTED',
  SOURCE_PREVIEW_FALLBACK: 'SOURCE_PREVIEW_FALLBACK',
  PUBLIC_STAGE_ERROR: 'PUBLIC_STAGE_ERROR',
  HTML_ENTRY_FAILURE: 'HTML_ENTRY_FAILURE',
  NON_TERMINAL: 'NON_TERMINAL'
});

const TERMINAL_SIGNAL_BY_ROUTE_STATUS = Object.freeze({
  PUBLIC_STAGE_RENDERER_MOUNTED:
    H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.RENDERER_MOUNTED,
  PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK:
    H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.SOURCE_PREVIEW_FALLBACK,
  PUBLIC_STAGE_ERROR:
    H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.PUBLIC_STAGE_ERROR
});

const SOURCE_OBJECT_ID_PATTERN = /OBJ_\d{3}_[A-Z0-9_]+/g;

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort();
}

function isNonNegativeSafeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function collectSourceObjectIds(value, output, seen = new WeakSet()) {
  if (typeof value === 'string') {
    output.push(...(value.match(SOURCE_OBJECT_ID_PATTERN) ?? []));
    return;
  }
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);

  if (typeof value.sourceObjectId === 'string') output.push(value.sourceObjectId);
  if (Array.isArray(value.sourceObjectIds)) {
    output.push(...value.sourceObjectIds.filter((entry) => typeof entry === 'string'));
  }

  for (const nested of Object.values(value)) {
    collectSourceObjectIds(nested, output, seen);
  }
}

function resolveProjectedPlanFragmentCount(observation) {
  const receipt = observation?.constructReceipt;
  const candidates = [
    receipt?.projectedPrimitiveFragmentCount,
    receipt?.projectedPlanFragmentCount,
    receipt?.projectionPlan?.projectedPrimitiveFragmentCount,
    receipt?.projectionPlan?.projectedPlanFragmentCount,
    Array.isArray(receipt?.projectionPlan?.projectedFragments)
      ? receipt.projectionPlan.projectedFragments.length
      : null,
    observation?.counts?.projectedClippedFragments
  ];
  return candidates.find(isNonNegativeSafeInteger) ?? 0;
}

export function classifyHEarthTerminalRouteState({
  routeStatus = null,
  htmlEntryFailure = null
} = {}) {
  const normalizedRouteStatus =
    typeof routeStatus === 'string' && routeStatus.trim().length > 0
      ? routeStatus.trim()
      : null;
  const htmlEntryFailureObserved = Boolean(htmlEntryFailure);
  const routeSignal = normalizedRouteStatus
    ? TERMINAL_SIGNAL_BY_ROUTE_STATUS[normalizedRouteStatus] ?? null
    : null;
  const signal = htmlEntryFailureObserved
    ? H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.HTML_ENTRY_FAILURE
    : routeSignal ?? H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.NON_TERMINAL;

  return Object.freeze({
    terminal:
      htmlEntryFailureObserved ||
      routeSignal !== null,
    signal,
    routeStatus: normalizedRouteStatus,
    htmlEntryFailureObserved,
    lawfulTerminalRouteStatus: routeSignal !== null
  });
}

export function isHEarthTerminalRouteState(snapshot = {}) {
  return classifyHEarthTerminalRouteState(snapshot).terminal;
}

export async function waitForHEarthTerminalRouteState(
  page,
  { timeoutMs = 90_000 } = {}
) {
  if (!page || typeof page.waitForFunction !== 'function') {
    throw new TypeError('A Playwright-compatible page with waitForFunction is required.');
  }
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 0) {
    throw new TypeError('timeoutMs must be a non-negative safe integer.');
  }

  return page.waitForFunction(
    ({ terminalStatuses }) => {
      const status = document
        .getElementById('h-earth-3d-status')
        ?.textContent
        ?.trim();
      return (
        terminalStatuses.includes(status) ||
        Boolean(globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE)
      );
    },
    { terminalStatuses: LAWFUL_TERMINAL_ROUTE_STATUSES },
    { timeout: timeoutMs }
  );
}

export function enrichHEarthRouteObservation(observation = {}) {
  const identityRoots = [
    observation.constructReceipt,
    observation.mountReceipt,
    observation.htmlEntryReceipt,
    observation.bootstrapReceipt,
    observation.bootstrapCompletion,
    observation.bootstrapStatus
  ];
  const sourceObjectIds = [];
  for (const root of identityRoots) {
    collectSourceObjectIds(root, sourceObjectIds);
  }

  const projectedPlanFragmentCount =
    resolveProjectedPlanFragmentCount(observation);
  const mountedProjectedFragmentNodeCount =
    isNonNegativeSafeInteger(observation?.counts?.projectedFragmentDomNodes)
      ? observation.counts.projectedFragmentDomNodes
      : 0;
  const terminalState = classifyHEarthTerminalRouteState({
    routeStatus: observation.routeStatus,
    htmlEntryFailure: observation.htmlEntryFailure
  });

  return Object.freeze({
    ...observation,
    observedObjectIds: uniqueSorted(sourceObjectIds),
    counts: Object.freeze({
      ...(observation.counts ?? {}),
      projectedPlanFragmentCount,
      mountedProjectedFragmentNodeCount
    }),
    terminalState
  });
}
