export const H_EARTH_RENDERER_CORRIDOR_OBSERVATION_CONTRACT_ID =
  'H_EARTH_RENDERER_CORRIDOR_TERMINAL_AND_MEASUREMENT_OBSERVATION_v3';

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

export const H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES = Object.freeze({
  EXPLICIT_MEASUREMENT: 'EXPLICIT_MEASUREMENT',
  EXPLICIT_COUNT: 'EXPLICIT_COUNT',
  CONSTRUCT_RECEIPT: 'CONSTRUCT_RECEIPT',
  MOUNT_RECEIPT: 'MOUNT_RECEIPT',
  LEGACY_CONSTRUCT_RECEIPT_COUNT: 'LEGACY_CONSTRUCT_RECEIPT_COUNT',
  MOUNTED_DOM_QUERY: 'MOUNTED_DOM_QUERY',
  ZERO_MOUNTED_DEFAULT: 'ZERO_MOUNTED_DEFAULT',
  UNRESOLVED: 'UNRESOLVED'
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

function firstResolvedCount(candidates) {
  for (const candidate of candidates) {
    if (isNonNegativeSafeInteger(candidate.value)) {
      return Object.freeze({
        value: candidate.value,
        source: candidate.source
      });
    }
  }

  return Object.freeze({
    value: null,
    source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.UNRESOLVED
  });
}

export function resolveHEarthRendererCorridorMeasurements(observation = {}) {
  const constructReceipt = observation?.constructReceipt;
  const mountReceipt = observation?.mountReceipt;

  const projectedPlan = firstResolvedCount([
    {
      value: observation?.measurements?.projectedPlanFragmentCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.EXPLICIT_MEASUREMENT
    },
    {
      value: observation?.counts?.projectedPlanFragmentCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.EXPLICIT_COUNT
    },
    {
      value: constructReceipt?.projectedPrimitiveFragmentCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.CONSTRUCT_RECEIPT
    },
    {
      value: constructReceipt?.projectedPlanFragmentCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.CONSTRUCT_RECEIPT
    },
    {
      value: constructReceipt?.projectionPlan?.projectedPrimitiveFragmentCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.CONSTRUCT_RECEIPT
    },
    {
      value: constructReceipt?.projectionPlan?.projectedPlanFragmentCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.CONSTRUCT_RECEIPT
    },
    {
      value: Array.isArray(constructReceipt?.projectionPlan?.projectedFragments)
        ? constructReceipt.projectionPlan.projectedFragments.length
        : null,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.CONSTRUCT_RECEIPT
    },
    {
      value: mountReceipt?.projectedPrimitiveFragmentCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.MOUNT_RECEIPT
    },
    {
      value: mountReceipt?.projectedPlanFragmentCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.MOUNT_RECEIPT
    },
    {
      value: constructReceipt
        ? observation?.counts?.projectedClippedFragments
        : null,
      source:
        H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES
          .LEGACY_CONSTRUCT_RECEIPT_COUNT
    }
  ]);

  const mountedProjected = firstResolvedCount([
    {
      value: observation?.measurements?.mountedProjectedFragmentNodeCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.EXPLICIT_MEASUREMENT
    },
    {
      value: observation?.counts?.mountedProjectedFragmentNodeCount,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.EXPLICIT_COUNT
    },
    {
      value: observation?.counts?.projectedFragmentDomNodes,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.MOUNTED_DOM_QUERY
    },
    {
      value: 0,
      source: H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.ZERO_MOUNTED_DEFAULT
    }
  ]);

  const rendererConstructionSucceeded =
    observation?.rendererConstructionSucceeded === true;
  const rendererMountSucceeded =
    observation?.rendererMountSucceeded === true;

  const countsEqual =
    projectedPlan.value !== null &&
    projectedPlan.value === mountedProjected.value;

  const relation =
    projectedPlan.value === null
      ? 'PROJECTED_PLAN_COUNT_UNRESOLVED'
      : rendererMountSucceeded
        ? countsEqual
          ? 'MOUNTED_COUNT_MATCHES_PROJECTED_PLAN'
          : 'MOUNTED_COUNT_DIVERGES_FROM_PROJECTED_PLAN'
        : mountedProjected.value === 0
          ? 'PREMOUNT_PROJECTED_PLAN_WITH_ZERO_MOUNTED_NODES'
          : 'PREMOUNT_STATE_HAS_UNEXPECTED_MOUNTED_NODES';

  return Object.freeze({
    projectedPlanFragmentCount: projectedPlan.value,
    projectedPlanFragmentCountSource: projectedPlan.source,
    mountedProjectedFragmentNodeCount: mountedProjected.value,
    mountedProjectedFragmentNodeCountSource: mountedProjected.source,
    rendererConstructionSucceeded,
    rendererMountSucceeded,
    countsEqual,
    relation,
    measurementSeparationEstablished:
      projectedPlan.value !== null &&
      (
        rendererMountSucceeded
          ? countsEqual
          : mountedProjected.value === 0
      )
  });
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

  const measurements =
    resolveHEarthRendererCorridorMeasurements(observation);
  const terminalState = classifyHEarthTerminalRouteState({
    routeStatus: observation.routeStatus,
    htmlEntryFailure: observation.htmlEntryFailure
  });

  return Object.freeze({
    ...observation,
    observedObjectIds: uniqueSorted(sourceObjectIds),
    measurements,
    counts: Object.freeze({
      ...(observation.counts ?? {}),
      projectedPlanFragmentCount:
        measurements.projectedPlanFragmentCount,
      mountedProjectedFragmentNodeCount:
        measurements.mountedProjectedFragmentNodeCount
    }),
    terminalState
  });
}
