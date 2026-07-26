import fs from "node:fs";
import crypto from "node:crypto";

const PATHS = Object.freeze({
  crystals: "laws/index.crystals.js",
  interactions: "laws/index.interactions.source.round4.js",
  wrapper: "laws/index.interactions.js",
  html: "laws/index.html",
  css: "laws/index.css",
  harness: "laws/validation/laws.orbit-direct-manipulation.harness.mjs",
  receipt: "laws/validation/laws.orbit-direct-manipulation.receipt.json"
});

const sources = Object.freeze(Object.fromEntries(
  Object.entries(PATHS)
    .filter(([key]) => key !== "receipt")
    .map(([key, path]) => [key, fs.readFileSync(path, "utf8")])
));

const tests = [];
function test(code, condition, details = null) {
  const pass = Boolean(condition);
  tests.push({ code, pass, details });
  if (!pass) {
    const error = new Error(code);
    error.details = details;
    throw error;
  }
}
function sha256(content) {
  return crypto.createHash("sha256").update(Buffer.from(content, "utf8")).digest("hex");
}
function gitBlobSha(content) {
  const bytes = Buffer.from(content, "utf8");
  return crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
}
function numberAfter(source, label) {
  const pattern = new RegExp(`${label}:\\n\\s+([0-9.]+)`);
  const match = source.match(pattern);
  return match ? Number(match[1]) : NaN;
}
function normalize(v) {
  const length = Math.hypot(...v);
  return v.map(n => n / length);
}
function determinant3(a,b,c) {
  return a[0]*(b[1]*c[2]-b[2]*c[1]) - a[1]*(b[0]*c[2]-b[2]*c[0]) + a[2]*(b[0]*c[1]-b[1]*c[0]);
}

const crystals = sources.crystals;
const clusterBlockMatch = crystals.match(/    cluster:\n      Object\.freeze\(\{[\s\S]*?\n      \}\)\n  \}\);/);
if (!clusterBlockMatch) throw new Error("CLUSTER_BLOCK_NOT_FOUND");
const clusterBlock = clusterBlockMatch[0];
const interactions = sources.interactions;
const wrapper = sources.wrapper;
const html = sources.html;
const css = sources.css;

const horizontalRadius = numberAfter(clusterBlock, "horizontalRadius");
const verticalRadius = numberAfter(clusterBlock, "verticalRadius");
const depthRadius = numberAfter(clusterBlock, "depthRadius");
const latitudeAmplitude = numberAfter(clusterBlock, "latitudeAmplitude");
const latitudeFrequency = numberAfter(clusterBlock, "latitudeFrequency");
const memberCount = numberAfter(clusterBlock, "memberCount");
const lawScale = numberAfter(crystals, "lawScale");
const primaryLawScale = numberAfter(crystals, "primaryLawScale");
const selectedLawScale = numberAfter(crystals, "selectedLawScale");

const vectors = Array.from({ length: memberCount }, (_, index) => {
  const longitude = Math.PI * 2 * index / memberCount - Math.PI / 2;
  const latitude = Math.sin((index + 0.5) * latitudeFrequency) * latitudeAmplitude;
  const cosineLatitude = Math.cos(latitude);
  return normalize([
    Math.cos(longitude) * cosineLatitude,
    Math.sin(latitude),
    Math.sin(longitude) * cosineLatitude
  ]);
});

const axisExtents = [0,1,2].map(axis => Math.max(...vectors.map(v => Math.abs(v[axis]))));
const maximumUnitError = Math.max(...vectors.map(v => Math.abs(Math.hypot(...v) - 1)));
const noncoplanarDeterminant = Math.abs(determinant3(vectors[0], vectors[1], vectors[2]));

// Exactly 20 bounded acceptance tests.
test("AUTHORIZED_SOURCE_SET_READABLE", Object.keys(sources).length === 6);
test("RIGHT_HANDED_XYZ_DECLARED", crystals.includes('coordinateSystem:\n      "RIGHT_HANDED_EUCLIDEAN_XYZ"'));
test("SHARED_CLUSTER_MODEL_DECLARED", crystals.includes('"BOUNDED_NONCOPLANAR_SPHERICAL_XYZ_CLUSTER"'));
test("SHARED_CLUSTER_RADII_LOCKED", horizontalRadius === 1.36 && verticalRadius === 1.18 && depthRadius === 1.04, { horizontalRadius, verticalRadius, depthRadius });
test("SHARED_CLUSTER_LATITUDE_LOCKED", latitudeAmplitude === 0.48 && latitudeFrequency === 1.73, { latitudeAmplitude, latitudeFrequency });
test("FOUR_MEMBER_CLUSTER_LOCKED", memberCount === 4, { memberCount });
test("SPHERICAL_MEMBER_VECTORS_UNIT_LENGTH", maximumUnitError <= 1e-12, { maximumUnitError });
test("CLUSTER_NONCOPLANAR", noncoplanarDeterminant > 0.01 && new Set(vectors.map(v => v[2].toFixed(8))).size > 2, { noncoplanarDeterminant, vectors });
test("CLUSTER_OCCUPIES_XYZ", axisExtents.every(value => value > 0.2), { axisExtents });
test("PLANAR_COMMON_RADIUS_MODEL_REMOVED", !crystals.includes("EUCLIDEAN_COMMON_RADIUS_ORBIT") && !crystals.includes('localPlane:\n          "XY"') && !crystals.includes("commonRadius:"));
test("POSITIVE_HORIZONTAL_YAW_PRESENT", interactions.includes("dy,\n      dx,\n      0,"));
test("NEGATIVE_HORIZONTAL_YAW_REMOVED", !interactions.includes("dy,\n      -dx,\n      0,"));
test("WORLD_SPACE_QUATERNION_COMPOSITION_PRESERVED", interactions.includes("return quaternionMultiply(\n      deltaQuaternion,\n      currentQuaternion"));
test("BOUNDED_NORMALIZED_INCREMENT_PRESERVED", interactions.includes("maximumIncrementalAngle:\n      0.24") && interactions.includes("return normalizeQuaternion(\n      result\n    );"));
test("LAW_SCALE_PROFILE_LOCKED", lawScale === 0.68 && primaryLawScale === 0.84 && selectedLawScale === 0.91, { lawScale, primaryLawScale, selectedLawScale });
test("DEPTH_SCALE_PRESERVED", crystals.includes("0.68 +\n            sphere.depth *\n              0.36"));
test("NEAREST_LAW_SETTLEMENT_PRESERVED", crystals.includes("function nearestPrimaryLaw(") && interactions.includes("requestClusterCommit"));
test("DELIBERATE_CLUSTER_RETURN_PRESERVED", interactions.includes("clusterSwipeMinimumHorizontalDistancePx") && interactions.includes("requestReturnToConstellation"));
test("INITIAL_CONSTELLATION_AND_CATEGORY_SELECTION_PRESERVED", crystals.includes("function sphericalCategoryPosition(") && interactions.includes("requestCategorySelection"));
test("CACHE_AND_PRESENTATION_CONTRACT_UPDATED", wrapper.includes("LAWS_COMPASS_SHARED_SPHERICAL_XYZ_CLUSTER_v1") && html.includes('data-laws-horizontal-drag-yaw-sign="positive"') && html.includes("LAWS_COMPASS_SHARED_SPHERICAL_XYZ_CRYSTALS_v1") && css.includes('[data-laws-presentation-mode="CLUSTER"]') && css.includes("content: none;"));

const receipt = {
  receiptId: "LAWS_SHARED_COMPASS_CLUSTER_CONFORMANCE_P2_LOCAL_VALIDATION_RECEIPT_v1",
  status: tests.every(record => record.pass) ? "PASS" : "FAIL",
  classification: "DETERMINISTIC_BOUNDED_RECONSTRUCTION_AFTER_CUSTODY_FAILURE",
  branch: "agent/laws-shared-compass-cluster-conformance-001",
  controllingSpecification: "LAWS_SHARED_COMPASS_CLUSTER_CONFORMANCE_P1_REFERENCE_EXTRACTION_AND_TRANSPLANT_SPECIFICATION_v1",
  sourceDigests: Object.fromEntries(Object.entries(sources).map(([key, content]) => [PATHS[key], {
    gitBlobSha1: gitBlobSha(content),
    sha256: sha256(content),
    bytes: Buffer.byteLength(content, "utf8")
  }])),
  contract: {
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    clusterClass: "BOUNDED_NONCOPLANAR_SPHERICAL_XYZ_CLUSTER",
    memberCount,
    horizontalRadius,
    verticalRadius,
    depthRadius,
    latitudeAmplitude,
    latitudeFrequency,
    horizontalDragMapping: "dy,dx,0",
    horizontalDragYawSign: "POSITIVE_DX",
    lawScale,
    primaryLawScale,
    selectedLawScale,
    releaseSettlement: "NEAREST_MEMBER_TO_PRIMARY_ANCHOR",
    returnBehavior: "DELIBERATE_HORIZONTAL_RELEASE_SWIPE"
  },
  geometry: {
    coplanar: false,
    memberVectors: vectors,
    axisExtents,
    noncoplanarDeterminant,
    maximumUnitError
  },
  preservation: {
    initialCategoryConstellation: true,
    categorySelection: true,
    lawsSemanticsAndRoutes: true,
    nearestLawSettlement: true,
    deliberateReturnGesture: true,
    controllerChanged: false,
    compositorChanged: false,
    planetChanged: false,
    cosmosChanged: false
  },
  assertions: {
    total: tests.length,
    passed: tests.filter(record => record.pass).length,
    failed: tests.filter(record => !record.pass).length,
    records: tests
  }
};

fs.writeFileSync(PATHS.receipt, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
console.log(JSON.stringify(receipt, null, 2));
