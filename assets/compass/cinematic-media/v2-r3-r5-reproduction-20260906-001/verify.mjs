import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => fs.readFileSync(path.join(here, name));
const gitBlobSha1 = (buf) => crypto.createHash("sha1")
  .update(Buffer.from(`blob ${buf.length}\0`, "utf8"))
  .update(buf)
  .digest("hex");
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const assert = (condition, code) => {
  if (!condition) {
    console.error(JSON.stringify({
      schema: "COMPASS_V2_R3_PERSISTED_SOURCE_STATIC_VERIFICATION_v1",
      result: "FAIL",
      code
    }));
    process.exit(1);
  }
};

const manifestBytes = read("source-manifest.v2.json");
const htmlBytes = read("capture-source.html");
const moduleBytes = read("capture-source.mjs");
const manifest = JSON.parse(manifestBytes.toString("utf8"));
const html = htmlBytes.toString("utf8");
const source = moduleBytes.toString("utf8");

assert(manifest.schema === "COMPASS_V2_R3_R5_DURABLE_REPRODUCTION_SOURCE_MANIFEST_v2", "MANIFEST_SCHEMA");
assert(manifest.operation?.operationId === "COMPASS_V2_R3_R5_REPRODUCTION_AND_DURABLE_CAPTURE_20260906_001", "OPERATION_ID");
assert(manifest.operation?.generation === 1981, "GENERATION");
assert(manifest.operation?.governingMain === "24eba044e3c4943756ee2412cb81f35a440f9608", "GOVERNING_MAIN");
assert(manifest.authority?.r1R2SourceBase === "f6dfa02fbb1d15ee4093d696f4ce3f6fe99a6d9c", "R1_R2_BASE");
assert(manifest.authority?.prewriteIdentityDisposition === "PREWRITE_IDENTITY_NOT_DURABLY_RECOVERABLE", "PREWRITE_DISPOSITION");
assert(manifest.authority?.broadArchaeologyAllowed === false, "BROAD_ARCHAEOLOGY");
assert(manifest.r3Candidate?.sourceCommit === "55db08e8a1c47ed95029314dcae825a56c984b72", "R3_CANDIDATE_COMMIT");
assert(manifest.r3Candidate?.reconstructionPerformed === false, "UNEXPECTED_RECONSTRUCTION");

assert(manifest.profile?.masterDurationMs === 38000, "DURATION");
assert(manifest.profile?.frameRate === 30, "FRAME_RATE");
assert(manifest.profile?.frameCount === 1140, "FRAME_COUNT");
assert(manifest.profile?.viewport?.width === 1280 && manifest.profile?.viewport?.height === 720, "VIEWPORT");
assert(manifest.profile?.frameTimeRule === "ROUND(frameIndex*1000/30)", "FRAME_TIME_RULE");
assert(manifest.profile?.lastFrameTimeMs === 37967, "LAST_FRAME_TIME");

const expectedMap = {
  S01:[250,900,3500,4850],
  S02:[4500,5150,8550,9850],
  S03:[9500,10150,13550,14850],
  S04_A:[14500,15050,16150,16850],
  S04_B:[16500,17050,18550,19850],
  S05:[19500,20150,23150,24850],
  S06:[24500,25050,28050,29350],
  S07_A:[29000,29450,30550,31350],
  S07_B:[31000,31450,32550,33350],
  S07_C:[33000,33450,34550,35350],
  S08:[35000,35400,37200,38000]
};
assert(JSON.stringify(manifest.editorialEventMap) === JSON.stringify(expectedMap), "EDITORIAL_EVENT_MAP");
for (const [beat, [textIn, imageIn, textOut, imageOut]] of Object.entries(expectedMap)) {
  assert(textIn < imageIn && imageIn < textOut && textOut < imageOut, `TRANSITION_LAW_${beat}`);
}
assert(manifest.transitionLaw === "TEXT_IN < IMAGE_IN < TEXT_OUT < IMAGE_OUT", "TRANSITION_LAW_DECLARATION");
assert(manifest.carryLaw?.carryMs === 350 && manifest.carryLaw?.maxPrecedingImages === 1, "CARRY_LAW");
assert(manifest.continuity?.S05_S06 === "ONE_IDENTICAL_AUDRALIA_AUTHORITY_PACKET_A1_AND_ONE_PERSISTENT_WORLD_INSTANCE", "AUDRALIA_CONTINUITY");
assert(manifest.protectedSurfaces?.mode === "READ_ONLY", "PROTECTED_SURFACES");
assert(manifest.execution?.r4Authorized === true && manifest.execution?.r5Authorized === true, "R4_R5_AUTHORITY");
assert(manifest.execution?.mergeAuthorized === false && manifest.execution?.deploymentAuthorized === false && manifest.execution?.publicationAuthorized === false, "PUBLICATION_CEILING");
assert(manifest.execution?.transientLocalAcceptanceAuthority === false, "TRANSIENT_ACCEPTANCE_AUTHORITY");

const htmlSha = gitBlobSha1(htmlBytes);
const moduleSha = gitBlobSha1(moduleBytes);
assert(htmlSha === "3a065c463c047f176575ef47617b3426afcca5dc", "HTML_GIT_BLOB");
assert(moduleSha === "c08e7a8db3e41d6dee1dbae11c0dd81fe9fd3819", "MODULE_GIT_BLOB");
assert(manifest.acceptedSource?.["capture-source.html"]?.gitBlobSha1 === htmlSha, "MANIFEST_HTML_BINDING");
assert(manifest.acceptedSource?.["capture-source.mjs"]?.gitBlobSha1 === moduleSha, "MANIFEST_MODULE_BINDING");

for (const required of [
  "/assets/shared/mirrorland-window.geometry.js",
  "/assets/compass/compass.hra-brain-scene.js",
  "/assets/compass/compass.trophy-scene.js",
  "/assets/compass/compass.house-scene.js",
  "./capture-source.mjs"
]) {
  assert(html.includes(required), `HTML_BINDING_${required}`);
}
assert(source.includes("38000"), "SOURCE_DURATION_BINDING");
assert(source.includes("CompassV2R3Capture"), "SOURCE_CAPTURE_API");
assert(source.includes("/inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs"), "SOURCE_AUDRALIA_BINDING");

for (const forbidden of ["Date.now(", "performance.now(", "setInterval(", "location.href", "history.pushState(", "history.replaceState("]) {
  assert(!source.includes(forbidden), `FORBIDDEN_SOURCE_TOKEN_${forbidden}`);
}
assert(!html.includes("<video"), "DETACHED_SOURCE_MUST_NOT_EMBED_VIDEO");

const receipt = {
  schema: "COMPASS_V2_R3_PERSISTED_SOURCE_STATIC_VERIFICATION_v1",
  result: "PASS",
  operationId: manifest.operation.operationId,
  generation: manifest.operation.generation,
  source: {
    htmlGitBlobSha1: htmlSha,
    moduleGitBlobSha1: moduleSha,
    manifestSha256: sha256(manifestBytes)
  },
  profile: manifest.profile,
  checks: [
    "EXACT_SOURCE_BYTES",
    "R1_R2_AUTHORITY_BINDINGS",
    "R2_EVENT_MAP",
    "TRANSITION_LAW",
    "AUDRALIA_CONTINUITY_RULE",
    "PROTECTED_SURFACES_READ_ONLY",
    "NO_TRANSIENT_ACCEPTANCE_AUTHORITY",
    "NO_WALL_CLOCK_OR_NAVIGATION_SIDE_EFFECT_TOKENS"
  ]
};
console.log(JSON.stringify(receipt));
