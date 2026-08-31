import assert from 'node:assert/strict';

import {
  H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS,
  LAWFUL_TERMINAL_ROUTE_STATUSES,
  classifyHEarthTerminalRouteState,
  enrichHEarthRouteObservation,
  isHEarthTerminalRouteState,
  waitForHEarthTerminalRouteState
} from './h-earth-renderer-corridor-observation.mjs';

const cases = Object.freeze([
  Object.freeze({
    id: 'RENDERER_MOUNTED',
    input: Object.freeze({ routeStatus: 'PUBLIC_STAGE_RENDERER_MOUNTED' }),
    expectedSignal: H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.RENDERER_MOUNTED,
    expectedTerminal: true
  }),
  Object.freeze({
    id: 'SOURCE_PREVIEW_FALLBACK',
    input: Object.freeze({ routeStatus: 'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK' }),
    expectedSignal: H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.SOURCE_PREVIEW_FALLBACK,
    expectedTerminal: true
  }),
  Object.freeze({
    id: 'PUBLIC_STAGE_ERROR',
    input: Object.freeze({ routeStatus: 'PUBLIC_STAGE_ERROR' }),
    expectedSignal: H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.PUBLIC_STAGE_ERROR,
    expectedTerminal: true
  }),
  Object.freeze({
    id: 'HTML_ENTRY_FAILURE',
    input: Object.freeze({
      routeStatus: 'PUBLIC_STAGE_INITIALIZING',
      htmlEntryFailure: Object.freeze({ status: 'HTML_ENTRY_FAILED' })
    }),
    expectedSignal: H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.HTML_ENTRY_FAILURE,
    expectedTerminal: true
  }),
  Object.freeze({
    id: 'NON_TERMINAL',
    input: Object.freeze({ routeStatus: 'PUBLIC_STAGE_INITIALIZING' }),
    expectedSignal: H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.NON_TERMINAL,
    expectedTerminal: false
  })
]);

const results = [];
for (const fixture of cases) {
  const classification = classifyHEarthTerminalRouteState(fixture.input);
  assert.equal(classification.signal, fixture.expectedSignal, fixture.id);
  assert.equal(classification.terminal, fixture.expectedTerminal, fixture.id);
  assert.equal(isHEarthTerminalRouteState(fixture.input), fixture.expectedTerminal, fixture.id);
  results.push(Object.freeze({
    id: fixture.id,
    signal: classification.signal,
    terminal: classification.terminal
  }));
}

assert.deepEqual(
  LAWFUL_TERMINAL_ROUTE_STATUSES,
  [
    'PUBLIC_STAGE_RENDERER_MOUNTED',
    'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK',
    'PUBLIC_STAGE_ERROR'
  ]
);

const enrichedFailure = enrichHEarthRouteObservation({
  routeStatus: 'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK',
  htmlEntryFailure: null,
  counts: Object.freeze({ projectedFragmentDomNodes: 0 })
});
assert.equal(enrichedFailure.terminalState.terminal, true);
assert.equal(
  enrichedFailure.terminalState.signal,
  H_EARTH_RENDERER_CORRIDOR_TERMINAL_SIGNALS.SOURCE_PREVIEW_FALLBACK
);

function createFakePage({ routeStatus = null, htmlEntryFailure = null } = {}) {
  let callCount = 0;
  let observedTimeout = null;

  return Object.freeze({
    async waitForFunction(predicate, argument, options) {
      callCount += 1;
      observedTimeout = options?.timeout ?? null;

      const previousDocument = globalThis.document;
      const previousFailure = globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE;
      globalThis.document = {
        getElementById(id) {
          if (id !== 'h-earth-3d-status' || routeStatus === null) return null;
          return { textContent: routeStatus };
        }
      };
      globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE = htmlEntryFailure;

      try {
        if (!predicate(argument)) {
          const error = new Error('Synthetic nonterminal timeout.');
          error.name = 'TimeoutError';
          throw error;
        }
        return Object.freeze({ resolved: true });
      } finally {
        if (previousDocument === undefined) delete globalThis.document;
        else globalThis.document = previousDocument;

        if (previousFailure === undefined) {
          delete globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE;
        } else {
          globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE = previousFailure;
        }
      }
    },
    get callCount() {
      return callCount;
    },
    get observedTimeout() {
      return observedTimeout;
    }
  });
}

for (const fixture of cases.filter((entry) => entry.expectedTerminal)) {
  const page = createFakePage({
    routeStatus: fixture.input.routeStatus ?? null,
    htmlEntryFailure: fixture.input.htmlEntryFailure ?? null
  });
  const startedAt = performance.now();
  await waitForHEarthTerminalRouteState(page, { timeoutMs: 90_000 });
  const elapsedMilliseconds = performance.now() - startedAt;
  assert.equal(page.callCount, 1, fixture.id);
  assert.equal(page.observedTimeout, 90_000, fixture.id);
  assert.ok(elapsedMilliseconds < 100, `${fixture.id} did not resolve immediately.`);
}

const nonterminalPage = createFakePage({ routeStatus: 'PUBLIC_STAGE_INITIALIZING' });
await assert.rejects(
  () => waitForHEarthTerminalRouteState(nonterminalPage, { timeoutMs: 1 }),
  (error) => error?.name === 'TimeoutError'
);

process.stdout.write(`${JSON.stringify({
  status: 'PASS',
  contract: 'H_EARTH_RENDERER_CORRIDOR_TERMINAL_STATE_FIXTURE_v1',
  terminalCaseCount: 4,
  nonterminalCaseCount: 1,
  sharedWaitHelperVerified: true,
  knownTerminalStatesResolveImmediately: true,
  results
}, null, 2)}\n`);
