import assert from 'node:assert/strict';

import {
  EXPECTED_PACKET_002_SOURCE_OBJECT_IDS
} from './h-earth-renderer-corridor-capacity-law.mjs';

import {
  H_EARTH_RENDERER_CORRIDOR_IDENTITY_PRESERVATION_STATES,
  enrichHEarthRouteObservation,
  resolveHEarthRendererCorridorObjectIdentity
} from './h-earth-renderer-corridor-observation.mjs';

const expectedIds = [...EXPECTED_PACKET_002_SOURCE_OBJECT_IDS];

const constructionFailureObservation = Object.freeze({
  routeStatus: 'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK',
  constructReceipt: Object.freeze({
    receiptType: 'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',
    constructed: false,
    status: 'RENDERER_NODE_BUDGET_NOT_ELIGIBLE',
    projectedPrimitiveFragmentCount: 514,
    projectionPlan: Object.freeze({
      projectedFragments: Object.freeze([
        Object.freeze({ sourceObjectId: expectedIds[2] }),
        Object.freeze({ sourceObjectId: expectedIds[0] }),
        Object.freeze({ sourceObjectId: expectedIds[1] }),
        Object.freeze({ sourceObjectId: expectedIds[0] })
      ])
    })
  }),
  htmlEntryReceipt: Object.freeze({
    packet002SourceObjectIds: Object.freeze([
      expectedIds[1],
      expectedIds[2],
      expectedIds[0]
    ])
  }),
  bootstrapReceipt: Object.freeze({
    nestedEvidence: Object.freeze({ sourceObjectId: expectedIds[2] })
  }),
  bootstrapCompletion: null,
  bootstrapStatus: null,
  mountReceipt: null,
  rendererConstructionSucceeded: false,
  rendererMountSucceeded: false,
  counts: Object.freeze({ projectedFragmentDomNodes: 0 })
});

const constructionFailureIdentity =
  resolveHEarthRendererCorridorObjectIdentity(constructionFailureObservation);
assert.deepEqual(
  constructionFailureIdentity.preMountObservedObjectIds,
  expectedIds
);
assert.deepEqual(
  constructionFailureIdentity.mountObservedObjectIds,
  []
);
assert.deepEqual(
  constructionFailureIdentity.observedObjectIds,
  expectedIds
);
assert.equal(
  constructionFailureIdentity.identityEstablishedBeforeMount,
  true
);
assert.equal(
  constructionFailureIdentity.mountEvidenceRequiredForIdentity,
  false
);
assert.equal(
  constructionFailureIdentity.rendererConstructionSucceeded,
  false
);
assert.equal(
  constructionFailureIdentity.rendererMountSucceeded,
  false
);
assert.equal(
  constructionFailureIdentity.preservationState,
  H_EARTH_RENDERER_CORRIDOR_IDENTITY_PRESERVATION_STATES
    .PREMOUNT_IDENTITY_PRESERVED_WITHOUT_MOUNT
);

const enrichedFailure =
  enrichHEarthRouteObservation(constructionFailureObservation);
assert.deepEqual(enrichedFailure.observedObjectIds, expectedIds);
assert.deepEqual(
  enrichedFailure.objectIdentity.preMountObservedObjectIds,
  expectedIds
);
assert.equal(
  enrichedFailure.objectIdentity.identityEstablishedBeforeMount,
  true
);
assert.equal(enrichedFailure.counts.mountedProjectedFragmentNodeCount, 0);

const mountOnlyObservation = Object.freeze({
  constructReceipt: null,
  htmlEntryReceipt: null,
  bootstrapReceipt: null,
  bootstrapCompletion: null,
  bootstrapStatus: null,
  mountReceipt: Object.freeze({ sourceObjectIds: Object.freeze(expectedIds) }),
  rendererConstructionSucceeded: true,
  rendererMountSucceeded: true
});
const mountOnlyIdentity =
  resolveHEarthRendererCorridorObjectIdentity(mountOnlyObservation);
assert.deepEqual(mountOnlyIdentity.preMountObservedObjectIds, []);
assert.deepEqual(mountOnlyIdentity.mountObservedObjectIds, expectedIds);
assert.equal(mountOnlyIdentity.identityEstablishedBeforeMount, false);
assert.equal(mountOnlyIdentity.mountEvidenceRequiredForIdentity, true);
assert.equal(
  mountOnlyIdentity.preservationState,
  H_EARTH_RENDERER_CORRIDOR_IDENTITY_PRESERVATION_STATES
    .MOUNT_ONLY_IDENTITY_OBSERVED
);

const throughMountObservation = Object.freeze({
  htmlEntryReceipt: Object.freeze({ sourceObjectIds: Object.freeze(expectedIds) }),
  mountReceipt: Object.freeze({ sourceObjectIds: Object.freeze([...expectedIds].reverse()) }),
  rendererConstructionSucceeded: true,
  rendererMountSucceeded: true
});
const throughMountIdentity =
  resolveHEarthRendererCorridorObjectIdentity(throughMountObservation);
assert.deepEqual(throughMountIdentity.preMountObservedObjectIds, expectedIds);
assert.deepEqual(throughMountIdentity.mountObservedObjectIds, expectedIds);
assert.deepEqual(throughMountIdentity.observedObjectIds, expectedIds);
assert.equal(throughMountIdentity.mountEvidenceRequiredForIdentity, false);
assert.equal(
  throughMountIdentity.preservationState,
  H_EARTH_RENDERER_CORRIDOR_IDENTITY_PRESERVATION_STATES
    .PREMOUNT_IDENTITY_PRESERVED_THROUGH_MOUNT
);

assert.equal(Object.isFrozen(constructionFailureIdentity), true);
assert.equal(Object.isFrozen(constructionFailureIdentity.evidenceRoots), true);
assert.equal(Object.isFrozen(constructionFailureIdentity.observedObjectIds), true);

process.stdout.write(`${JSON.stringify({
  status: 'PASS',
  contract: 'H_EARTH_RENDERER_CORRIDOR_PREMOUNT_IDENTITY_FIXTURE_v1',
  expectedObjectIds: expectedIds,
  constructionFailure: {
    rendererConstructionSucceeded:
      constructionFailureIdentity.rendererConstructionSucceeded,
    rendererMountSucceeded:
      constructionFailureIdentity.rendererMountSucceeded,
    preMountObservedObjectIds:
      constructionFailureIdentity.preMountObservedObjectIds,
    mountObservedObjectIds:
      constructionFailureIdentity.mountObservedObjectIds,
    preservationState:
      constructionFailureIdentity.preservationState
  },
  mountOnlyEvidenceRejectedAsPremountProof:
    mountOnlyIdentity.mountEvidenceRequiredForIdentity,
  identityPreservedThroughSuccessfulMount:
    throughMountIdentity.preservationState ===
      H_EARTH_RENDERER_CORRIDOR_IDENTITY_PRESERVATION_STATES
        .PREMOUNT_IDENTITY_PRESERVED_THROUGH_MOUNT
}, null, 2)}\n`);
