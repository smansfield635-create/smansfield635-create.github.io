import assert from 'node:assert/strict';

import {
  H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES,
  enrichHEarthRouteObservation,
  resolveHEarthRendererCorridorMeasurements
} from './h-earth-renderer-corridor-observation.mjs';

const constructionFailureObservation = {
  rendererConstructionSucceeded: false,
  rendererMountSucceeded: false,
  constructReceipt: {
    receiptType: 'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',
    constructed: false,
    status: 'RENDERER_NODE_BUDGET_REJECTED',
    projectedPrimitiveFragmentCount: 514
  },
  mountReceipt: null,
  counts: {
    projectedClippedFragments: 514,
    projectedFragmentDomNodes: 0
  }
};

const constructionFailureMeasurements =
  resolveHEarthRendererCorridorMeasurements(
    constructionFailureObservation
  );

assert.equal(
  constructionFailureMeasurements.projectedPlanFragmentCount,
  514
);
assert.equal(
  constructionFailureMeasurements.mountedProjectedFragmentNodeCount,
  0
);
assert.equal(
  constructionFailureMeasurements.projectedPlanFragmentCountSource,
  H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.CONSTRUCT_RECEIPT
);
assert.equal(
  constructionFailureMeasurements.mountedProjectedFragmentNodeCountSource,
  H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.MOUNTED_DOM_QUERY
);
assert.equal(
  constructionFailureMeasurements.relation,
  'PREMOUNT_PROJECTED_PLAN_WITH_ZERO_MOUNTED_NODES'
);
assert.equal(
  constructionFailureMeasurements.measurementSeparationEstablished,
  true
);

const enrichedConstructionFailure =
  enrichHEarthRouteObservation(constructionFailureObservation);

assert.equal(
  enrichedConstructionFailure.counts.projectedPlanFragmentCount,
  514
);
assert.equal(
  enrichedConstructionFailure.counts.mountedProjectedFragmentNodeCount,
  0
);
assert.notEqual(
  enrichedConstructionFailure.counts.projectedPlanFragmentCount,
  enrichedConstructionFailure.counts.mountedProjectedFragmentNodeCount
);

const domOnlyObservation = {
  rendererConstructionSucceeded: false,
  rendererMountSucceeded: false,
  constructReceipt: null,
  mountReceipt: null,
  counts: {
    projectedClippedFragments: 514,
    projectedFragmentDomNodes: 514
  }
};

const domOnlyMeasurements =
  resolveHEarthRendererCorridorMeasurements(domOnlyObservation);

assert.equal(domOnlyMeasurements.projectedPlanFragmentCount, null);
assert.equal(
  domOnlyMeasurements.projectedPlanFragmentCountSource,
  H_EARTH_RENDERER_CORRIDOR_MEASUREMENT_SOURCES.UNRESOLVED
);
assert.equal(domOnlyMeasurements.mountedProjectedFragmentNodeCount, 514);
assert.equal(domOnlyMeasurements.measurementSeparationEstablished, false);

const mountedObservation = {
  rendererConstructionSucceeded: true,
  rendererMountSucceeded: true,
  constructReceipt: {
    projectedPrimitiveFragmentCount: 514,
    constructed: true
  },
  counts: {
    projectedFragmentDomNodes: 514
  }
};

const mountedMeasurements =
  resolveHEarthRendererCorridorMeasurements(mountedObservation);

assert.equal(mountedMeasurements.projectedPlanFragmentCount, 514);
assert.equal(mountedMeasurements.mountedProjectedFragmentNodeCount, 514);
assert.equal(
  mountedMeasurements.relation,
  'MOUNTED_COUNT_MATCHES_PROJECTED_PLAN'
);
assert.equal(mountedMeasurements.measurementSeparationEstablished, true);

process.stdout.write(`${JSON.stringify({
  status: 'PASS',
  fixtureCount: 3,
  constructionFailure: {
    projectedPlanFragmentCount:
      constructionFailureMeasurements.projectedPlanFragmentCount,
    mountedProjectedFragmentNodeCount:
      constructionFailureMeasurements.mountedProjectedFragmentNodeCount,
    relation: constructionFailureMeasurements.relation
  },
  domOnlyPlanCountRemainsUnresolved: true,
  mountedCountEqualityVerified: true
}, null, 2)}\n`);
