import assert from 'node:assert/strict';
import path from 'node:path';
import process from 'node:process';

import {
  EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
  evaluateHEarthRendererCorridorBudgets
} from './h-earth-renderer-corridor-capacity-law.mjs';

import {
  EXPECTED_ROUTE_STATUS,
  attachDeterministicDigest,
  classifyObservation,
  repositoryRootFromThisModule,
  writeJson
} from './h-earth-renderer-corridor-common.mjs';

import {
  enrichHEarthRouteObservation
} from './h-earth-renderer-corridor-observation.mjs';

export const H_EARTH_RENDERER_CORRIDOR_CONTROL_SUITE_CONTRACT_ID =
  'H_EARTH_RENDERER_CORRIDOR_POSITIVE_AND_NEGATIVE_CONTROL_SUITE_v1';

const BASELINE_COUNTS = Object.freeze({
  admittedPrimitiveCount: 3,
  projectedPlanFragmentCount: 288,
  mountedProjectedFragmentNodeCount: 288,
  semanticContainerCount: 15,
  interactionNodeCount: 1,
  finalRendererOwnedDomNodeCount: 306
});

const BASELINE_FRAME_IDENTITY = Object.freeze({
  packet002TransferOccurrenceId: 'CONTROL_PACKET_002_TRANSFER_OCCURRENCE',
  compositorFrameOccurrenceId: 'CONTROL_COMPOSITOR_FRAME_OCCURRENCE',
  compositorFrameRevision: 1,
  cameraRevision: 1,
  compositorViewportRevision: 1,
  visibilityRevision: 1
});

const BASELINE_FRAME_VIEWPORT = Object.freeze({
  widthPx: 1440,
  heightPx: 900,
  pixelRatio: 1
});

const BASELINE_PROJECTION_CONTEXT = Object.freeze({
  projectionType: 'PERSPECTIVE',
  nearPlane: 0.1,
  farPlane: 10000
});

const MODULE_GRAPH_PASS = Object.freeze({
  eligible: true,
  requiredPaths: Object.freeze([]),
  observedPaths: Object.freeze([]),
  missingRequiredPaths: Object.freeze([])
});

function createObservation({
  sourceObjectIds = EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
  admittedPrimitiveCount = BASELINE_COUNTS.admittedPrimitiveCount,
  projectedPlanFragmentCount = BASELINE_COUNTS.projectedPlanFragmentCount,
  mountedProjectedFragmentNodeCount =
    BASELINE_COUNTS.mountedProjectedFragmentNodeCount,
  semanticContainerCount = BASELINE_COUNTS.semanticContainerCount,
  interactionNodeCount = BASELINE_COUNTS.interactionNodeCount,
  finalRendererOwnedDomNodeCount =
    BASELINE_COUNTS.finalRendererOwnedDomNodeCount,
  rendererConstructionSucceeded = true,
  rendererMountSucceeded = true,
  routeStatus = EXPECTED_ROUTE_STATUS,
  fallbackRestored = false,
  compositorImportSucceeded = true,
  rendererImportSucceeded = true,
  frameIdentity = BASELINE_FRAME_IDENTITY,
  frameViewport = BASELINE_FRAME_VIEWPORT,
  projectionContext = BASELINE_PROJECTION_CONTEXT,
  bootstrapStatus = null
} = {}) {
  const normalizedObjectIds = Object.freeze([...sourceObjectIds]);
  const constructReceipt = Object.freeze({
    receiptType: 'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',
    status: rendererConstructionSucceeded
      ? 'RENDERER_CONSTRUCTION_SUCCEEDED'
      : 'RENDERER_CONSTRUCTION_REJECTED',
    constructed: rendererConstructionSucceeded,
    sourceObjectIds: normalizedObjectIds,
    admittedPrimitiveCount,
    projectedPrimitiveFragmentCount: projectedPlanFragmentCount,
    projectionPlan: Object.freeze({
      projectedPlanFragmentCount,
      projectionContext
    })
  });
  const mountReceipt = Object.freeze({
    receiptType: 'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',
    status: rendererMountSucceeded
      ? 'RENDERER_MOUNT_SUCCEEDED'
      : 'RENDERER_MOUNT_REJECTED',
    mounted: rendererMountSucceeded,
    sourceObjectIds: normalizedObjectIds,
    projectedPrimitiveFragmentCount: projectedPlanFragmentCount
  });

  return enrichHEarthRouteObservation({
    routeStatus,
    routeDataset: Object.freeze({}),
    fallbackText: fallbackRestored ? 'Synthetic source preview fallback.' : null,
    htmlEntryReceipt: Object.freeze({
      sourceObjectIds: normalizedObjectIds,
      packet002TransferOccurrenceId:
        frameIdentity?.packet002TransferOccurrenceId ?? null
    }),
    htmlEntryFailure: null,
    bootstrapStatus,
    bootstrapReceipt: null,
    bootstrapCompletion: null,
    moduleImportDiagnosticReceipt: null,
    htmlImportDiagnosticReceipt: null,
    constructReceipt,
    mountReceipt,
    frameIdentity,
    frameViewport,
    projectionContext,
    counts: Object.freeze({
      admittedSourcePrimitives: admittedPrimitiveCount,
      projectedClippedFragments: projectedPlanFragmentCount,
      projectedFragmentDomNodes: mountedProjectedFragmentNodeCount,
      semanticContainers: semanticContainerCount,
      interactionNodes: interactionNodeCount,
      finalRendererOwnedDomNodes: finalRendererOwnedDomNodeCount
    }),
    clippingTotals: Object.freeze({}),
    rendererConstructionSucceeded,
    rendererMountSucceeded,
    fallbackRestored,
    compositorImportSucceeded,
    rendererImportSucceeded
  });
}

function evaluateCapacity(observation) {
  return evaluateHEarthRendererCorridorBudgets({
    admittedPrimitiveCount: observation.counts.admittedSourcePrimitives,
    projectedFragmentCount: observation.counts.projectedPlanFragmentCount,
    semanticContainerCount: observation.counts.semanticContainers,
    interactionNodeCount: observation.counts.interactionNodes,
    finalRendererOwnedDomNodeCount:
      observation.counts.finalRendererOwnedDomNodes,
    requireExactProductionPacket002: true
  });
}

function executeControl({
  id,
  kind,
  observationOptions = Object.freeze({}),
  requestFailures = Object.freeze([]),
  errorResponses = Object.freeze([]),
  pageErrors = Object.freeze([]),
  consoleErrors = Object.freeze([]),
  expectedIssueIds = Object.freeze([])
}) {
  const observation = createObservation(observationOptions);
  const capacityEvaluation = evaluateCapacity(observation);
  const classification = classifyObservation({
    observation,
    moduleGraph: MODULE_GRAPH_PASS,
    capacityEvaluation,
    expectedObjectIds: EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
    requestFailures,
    errorResponses,
    pageErrors,
    consoleErrors
  });
  const actualIssueIds = classification.issues
    .map((issue) => issue.id)
    .sort();
  const expectedSortedIssueIds = [...expectedIssueIds].sort();

  if (kind === 'POSITIVE') {
    assert.equal(classification.passed, true, `${id} must pass.`);
    assert.deepEqual(actualIssueIds, [], `${id} emitted unexpected issues.`);
    assert.equal(capacityEvaluation.eligible, true, `${id} capacity must pass.`);
  } else {
    assert.equal(classification.passed, false, `${id} must fail closed.`);
    assert.deepEqual(
      actualIssueIds,
      expectedSortedIssueIds,
      `${id} failed for an unintended reason.`
    );
  }

  return Object.freeze({
    id,
    kind,
    passed: classification.passed,
    classificationStatus: classification.status,
    expectedIssueIds: expectedSortedIssueIds,
    actualIssueIds,
    capacityEligible: capacityEvaluation.eligible,
    terminalSignal: observation.terminalState.signal,
    measurementRelation: observation.measurements.relation,
    preMountIdentityState: observation.objectIdentity.preservationState
  });
}

const controls = Object.freeze([
  Object.freeze({
    id: 'POSITIVE_LAWFUL_RENDERER_MOUNTED',
    kind: 'POSITIVE'
  }),
  Object.freeze({
    id: 'NEGATIVE_PACKET_002_IDENTITY_MISMATCH',
    kind: 'NEGATIVE',
    observationOptions: Object.freeze({
      sourceObjectIds: Object.freeze([
        'OBJ_002_FOREGROUND_WET_SAND',
        'OBJ_005_SHORELINE_FOAM_LINE'
      ])
    }),
    expectedIssueIds: Object.freeze([
      'EXACT_THREE_OBJECT_PACKET_002_IDENTITY'
    ])
  }),
  Object.freeze({
    id: 'NEGATIVE_MOUNTED_FRAGMENT_COUNT_DIVERGENCE',
    kind: 'NEGATIVE',
    observationOptions: Object.freeze({
      mountedProjectedFragmentNodeCount: 287
    }),
    expectedIssueIds: Object.freeze([
      'PROJECTED_RECEIPT_AND_DOM_FRAGMENT_COUNTS_MATCH'
    ])
  }),
  Object.freeze({
    id: 'NEGATIVE_RENDERER_CONSTRUCTION_REJECTED',
    kind: 'NEGATIVE',
    observationOptions: Object.freeze({
      rendererConstructionSucceeded: false
    }),
    expectedIssueIds: Object.freeze([
      'RENDERER_CONSTRUCTION_SUCCEEDED'
    ])
  }),
  Object.freeze({
    id: 'NEGATIVE_RENDERER_MOUNT_REJECTED',
    kind: 'NEGATIVE',
    observationOptions: Object.freeze({
      rendererMountSucceeded: false
    }),
    expectedIssueIds: Object.freeze([
      'RENDERER_MOUNT_SUCCEEDED'
    ])
  }),
  Object.freeze({
    id: 'NEGATIVE_SOURCE_PREVIEW_FALLBACK',
    kind: 'NEGATIVE',
    observationOptions: Object.freeze({
      routeStatus: 'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK',
      fallbackRestored: true
    }),
    expectedIssueIds: Object.freeze([
      'ROUTE_STATUS_PUBLIC_STAGE_RENDERER_MOUNTED',
      'FALLBACK_NOT_RESTORED'
    ])
  }),
  Object.freeze({
    id: 'NEGATIVE_MODULE_IMPORT_REJECTION',
    kind: 'NEGATIVE',
    observationOptions: Object.freeze({
      bootstrapStatus: Object.freeze({
        importStatus: 'REJECTED',
        branchId: 'renderer',
        requestedPath: './renderer.js'
      })
    }),
    expectedIssueIds: Object.freeze([
      'NO_MODULE_IMPORT_REJECTIONS'
    ])
  }),
  Object.freeze({
    id: 'NEGATIVE_REQUIRED_REQUEST_FAILURE',
    kind: 'NEGATIVE',
    requestFailures: Object.freeze([
      Object.freeze({
        url: '/showroom/globe/h-earth/renderer.js',
        errorText: 'Synthetic request failure.'
      })
    ]),
    expectedIssueIds: Object.freeze([
      'NO_REQUIRED_REQUEST_FAILURES'
    ])
  }),
  Object.freeze({
    id: 'NEGATIVE_STAGE_CAPACITY_REJECTION',
    kind: 'NEGATIVE',
    observationOptions: Object.freeze({
      projectedPlanFragmentCount: 433,
      mountedProjectedFragmentNodeCount: 433,
      finalRendererOwnedDomNodeCount: 451
    }),
    expectedIssueIds: Object.freeze([
      'ALL_STAGE_SPECIFIC_CAPACITY_BUDGETS_PASS'
    ])
  })
]);

const results = controls.map(executeControl);
const positiveResults = results.filter((result) => result.kind === 'POSITIVE');
const negativeResults = results.filter((result) => result.kind === 'NEGATIVE');

assert.equal(positiveResults.length, 1);
assert.equal(positiveResults[0].passed, true);
assert.equal(negativeResults.length, 8);
assert.ok(negativeResults.every((result) => result.passed === false));

const receipt = attachDeterministicDigest({
  receiptType: 'H_EARTH_RENDERER_CORRIDOR_CONTROL_SUITE_RECEIPT',
  contractId: H_EARTH_RENDERER_CORRIDOR_CONTROL_SUITE_CONTRACT_ID,
  sourceCommit: process.env.GITHUB_SHA ?? 'LOCAL_UNCOMMITTED_WORKTREE',
  positiveControlCount: positiveResults.length,
  positiveControlPassCount:
    positiveResults.filter((result) => result.passed === true).length,
  negativeControlCount: negativeResults.length,
  negativeControlFailClosedCount:
    negativeResults.filter((result) => result.passed === false).length,
  positiveControlPassEstablished: true,
  negativeControlsFailClosed: true,
  controls: results
});

const repositoryRoot = repositoryRootFromThisModule(import.meta.url);
const receiptPath = path.join(
  repositoryRoot,
  'artifacts',
  'h-earth-renderer-corridor-controls',
  'aggregate.receipt.json'
);
await writeJson(receiptPath, receipt);

process.stdout.write(`${JSON.stringify({
  status: 'PASS',
  contractId: H_EARTH_RENDERER_CORRIDOR_CONTROL_SUITE_CONTRACT_ID,
  positiveControlCount: receipt.positiveControlCount,
  positiveControlPassCount: receipt.positiveControlPassCount,
  negativeControlCount: receipt.negativeControlCount,
  negativeControlFailClosedCount: receipt.negativeControlFailClosedCount,
  receipt: 'artifacts/h-earth-renderer-corridor-controls/aggregate.receipt.json',
  deterministicReceiptSha256: receipt.deterministicReceiptSha256
}, null, 2)}\n`);
