import crypto from 'node:crypto';
import {
  constructHEarthDistantContextGeometry,
  H_EARTH_PLANET_BODY_HORIZON_SHELL_ID
} from '../../showroom/globe/h-earth/render/geometry-distant-context.js';
import {
  H_EARTH_PLANETARY_WORLD_FRAME,
  H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  getHEarthDerivedHorizonDistance,
  regionToHEarthPlanetPoint
} from '../../showroom/globe/h-earth/render/planetary-world-frame.js';
import {
  buildHEarthRun8ENeutralPackage
} from '../../showroom/globe/h-earth/render/run8e-successor-environment.js';
import {
  getHEarthOW01CanonicalLiveRenderPackageOccurrence
} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

const OPERATION_ID = 'H_EARTH_PLANETARY_HORIZON_LEGIBILITY_SUCCESSOR_20260819_001';
const PROTECTED_PARENT = '10d046396d58c7cf7c38c7dad5121acdb8cd197d';
const SHELL_PRIMITIVE_ID = 'H_EARTH_PLANET_BODY:HORIZON_DEPTH_SHELL';
const issues = [];
const diagnostics = {
  shellVertexCount: 0,
  shellTriangleCount: 0,
  fixedShellVertexChecks: 0,
  horizonCoverageChecks: 0,
  packageChecks: 0,
  geographyAuthorityChecks: 0,
  minimumShellY: null,
  maximumShellY: null,
  maximumHorizonDistanceChecked: 0,
  perspectiveCurvatureSignal: null
};

const fail = (condition, code) => {
  if (!condition) issues.push(code);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const hashJson = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const bodyFrom = (geometry) => geometry.primitives.find((primitive) =>
  primitive?.metadata?.planetBodyHorizonShellId === H_EARTH_PLANET_BODY_HORIZON_SHELL_ID ||
  primitive?.primitiveId === SHELL_PRIMITIVE_ID
);

fail(H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID === 'H_EARTH_PLANETARY_SPATIAL_COHERENCE_GEN326_v1', 'GEN327_PLANETARY_FRAME_CONTRACT_DRIFT');
fail(H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius === 420000, 'GEN327_PLANET_RADIUS_DRIFT');
fail(H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius === 1100, 'GEN327_TANGENT_RADIUS_DRIFT');

const geometryA = constructHEarthDistantContextGeometry({ cameraWorld: { x: 0, y: 120, z: -40 } });
const geometryB = constructHEarthDistantContextGeometry({ cameraWorld: { x: 180, y: 165, z: -220 } });
fail(geometryA?.ok === true, 'DISTANT_CONTEXT_A_INVALID');
fail(geometryB?.ok === true, 'DISTANT_CONTEXT_B_INVALID');
fail(geometryA?.planetBodyHorizonShellMaterialized === true, 'PLANET_BODY_SHELL_NOT_MATERIALIZED_A');
fail(geometryB?.planetBodyHorizonShellMaterialized === true, 'PLANET_BODY_SHELL_NOT_MATERIALIZED_B');

const bodyA = bodyFrom(geometryA);
const bodyB = bodyFrom(geometryB);
fail(Boolean(bodyA), 'PLANET_BODY_PRIMITIVE_MISSING_A');
fail(Boolean(bodyB), 'PLANET_BODY_PRIMITIVE_MISSING_B');

if (bodyA && bodyB) {
  const verticesA = bodyA.geometry?.vertices ?? [];
  const verticesB = bodyB.geometry?.vertices ?? [];
  const indicesA = bodyA.geometry?.indices ?? [];
  diagnostics.shellVertexCount = verticesA.length;
  diagnostics.shellTriangleCount = indicesA.length / 3;
  fail(verticesA.length === verticesB.length && verticesA.length >= 700, 'PLANET_BODY_VERTEX_COUNT_INVALID');
  fail(indicesA.length === (7 * 96 * 6), 'PLANET_BODY_INDEX_COUNT_INVALID');

  const stride = Math.max(1, Math.floor(verticesA.length / 256));
  for (let index = 0; index < verticesA.length; index += stride) {
    const a = verticesA[index];
    const b = verticesB[index];
    diagnostics.fixedShellVertexChecks += 1;
    fail(
      Math.abs(a.x - b.x) <= 1e-9 &&
      Math.abs(a.y - b.y) <= 1e-9 &&
      Math.abs(a.z - b.z) <= 1e-9,
      `PLANET_BODY_CAMERA_RECENTERED:${index}`
    );
  }

  const ys = verticesA.map((vertex) => vertex.y).filter(finite);
  diagnostics.minimumShellY = Math.min(...ys);
  diagnostics.maximumShellY = Math.max(...ys);
  fail(diagnostics.minimumShellY < -300, 'PLANET_BODY_SPHERICAL_FALLOFF_TOO_WEAK');
  fail(diagnostics.maximumShellY < 0, 'PLANET_BODY_NOT_BELOW_GEOGRAPHIC_SURFACE');

  const metadata = bodyA.metadata ?? {};
  const source = bodyA.source ?? {};
  const authorityPredicates = [
    metadata.representationClass === 'PLANET_BODY',
    metadata.planetBodyOnly === true,
    metadata.independentGeographyAuthority === false,
    metadata.surfaceClassificationAuthority === false,
    metadata.topologyAuthority === false,
    metadata.geographicIdentity == null,
    metadata.playableRegionIdentity == null,
    metadata.navigable === false,
    metadata.collisionAuthority === false,
    metadata.accessibleRegionExpansion === false,
    metadata.boundedGeographyExtension === false,
    metadata.fixedPlanetaryAnchor === true,
    metadata.worldRecenteredForCamera === false,
    source.geographySource == null,
    source.topologySourceId == null
  ];
  for (const predicate of authorityPredicates) {
    diagnostics.geographyAuthorityChecks += 1;
    fail(predicate, `PLANET_BODY_AUTHORITY_BOUNDARY_FAILED:${diagnostics.geographyAuthorityChecks}`);
  }

  const innerRadius = Number(metadata.innerRadius);
  const outerRadius = Number(metadata.outerRadius);
  fail(Math.abs(innerRadius - 6000) <= 1e-9, 'PLANET_BODY_INNER_RADIUS_NOT_MANIFOLD_EDGE');
  fail(outerRadius >= 18000, 'PLANET_BODY_OUTER_RADIUS_INSUFFICIENT');

  for (const observerHeight of [60, 90, 120, 180, 240]) {
    const horizonDistance = getHEarthDerivedHorizonDistance(observerHeight);
    diagnostics.maximumHorizonDistanceChecked = Math.max(diagnostics.maximumHorizonDistanceChecked, horizonDistance);
    diagnostics.horizonCoverageChecks += 1;
    fail(horizonDistance > innerRadius, `ELEVATED_HORIZON_DOES_NOT_EXCEED_MANIFOLD:${observerHeight}`);
    fail(horizonDistance < outerRadius, `PLANET_BODY_DOES_NOT_COVER_HORIZON:${observerHeight}`);
  }

  const lowObserverHorizon = getHEarthDerivedHorizonDistance(20);
  diagnostics.horizonCoverageChecks += 1;
  fail(lowObserverHorizon < innerRadius, 'LOW_OBSERVER_SHOULD_REMAIN_COVERED_BY_BOUNDED_MANIFOLD');

  const centerSurface = regionToHEarthPlanetPoint({ x: 0, y: 0, z: -10000 });
  const sideAzimuth = 30 * Math.PI / 180;
  const sideSurface = regionToHEarthPlanetPoint({
    x: Math.sin(sideAzimuth) * 10000,
    y: 0,
    z: -Math.cos(sideAzimuth) * 10000
  });
  const observerY = 120;
  const centerProjectedY = (centerSurface.y - observerY) / Math.abs(centerSurface.z);
  const sideProjectedY = (sideSurface.y - observerY) / Math.abs(sideSurface.z);
  diagnostics.perspectiveCurvatureSignal = Math.abs(sideProjectedY - centerProjectedY);
  fail(diagnostics.perspectiveCurvatureSignal > 0.002, 'PLANETARY_HORIZON_PERSPECTIVE_CURVATURE_SIGNAL_TOO_WEAK');
}

const neutral = buildHEarthRun8ENeutralPackage({ cameraWorld: { x: 0, y: 120, z: -40 } });
fail(neutral?.ok === true, 'RUN8E_NEUTRAL_PACKAGE_REJECTED');
if (neutral?.ok === true) {
  diagnostics.packageChecks += 1;
  fail(neutral.primitiveIds.includes(SHELL_PRIMITIVE_ID), 'RUN8E_NEUTRAL_PACKAGE_OMITS_PLANET_BODY');
  const body = neutral.primitives.find((primitive) => primitive.primitiveId === SHELL_PRIMITIVE_ID);
  diagnostics.packageChecks += 1;
  fail(body?.metadata?.planetBodyOnly === true, 'RUN8E_NEUTRAL_PACKAGE_LOST_PLANET_BODY_IDENTITY');
}

const livePackage = getHEarthOW01CanonicalLiveRenderPackageOccurrence();
fail(livePackage?.eligible === true, 'CANONICAL_LIVE_PACKAGE_REJECTED');
if (livePackage?.eligible === true) {
  diagnostics.packageChecks += 1;
  fail(livePackage.primitiveIds.includes(SHELL_PRIMITIVE_ID), 'CANONICAL_LIVE_PACKAGE_OMITS_PLANET_BODY');
  diagnostics.packageChecks += 1;
  const shellDrawRange = (livePackage.drawRanges ?? []).find((range) =>
    (range.primitiveIds ?? []).includes(SHELL_PRIMITIVE_ID)
  );
  fail(Boolean(shellDrawRange), 'PLANET_BODY_NOT_PRESENT_IN_GPU_DRAW_RANGES');
}

const receipt = {
  schema: 'H_EARTH_PLANETARY_HORIZON_LEGIBILITY_RECEIPT_v1',
  operationId: OPERATION_ID,
  protectedParentHead: PROTECTED_PARENT,
  result: issues.length === 0 ? 'PASS' : 'FAIL',
  planetBodyHorizonShellId: H_EARTH_PLANET_BODY_HORIZON_SHELL_ID,
  planetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  diagnostics,
  issues
};
receipt.receiptSha256 = hashJson(receipt);
process.stdout.write(JSON.stringify(receipt));
if (issues.length) process.exitCode = 1;
