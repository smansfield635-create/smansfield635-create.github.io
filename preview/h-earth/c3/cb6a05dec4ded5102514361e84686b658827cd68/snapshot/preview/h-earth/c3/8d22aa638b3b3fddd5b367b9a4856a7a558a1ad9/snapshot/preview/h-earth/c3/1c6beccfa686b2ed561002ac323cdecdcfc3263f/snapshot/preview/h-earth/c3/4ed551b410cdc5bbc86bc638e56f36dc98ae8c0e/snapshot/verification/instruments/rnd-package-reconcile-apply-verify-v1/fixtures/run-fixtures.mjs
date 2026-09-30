import assert from "node:assert/strict";
import { createPlanOnlyReceipt, validateProfile, applyPlan } from "../core.mjs";
import { gitBlobSha, sha256Hex } from "../package-validator.mjs";
import { InMemoryRepositoryAdapter } from "../repository-adapter.mjs";
import SIX from "../adapters/six-object-model.adapter.mjs";
import FOUR_INSTRUMENT from "../adapters/four-object-compass.instrument.mjs";
import SIX_INSTRUMENT from "../adapters/six-object-compass.instrument.mjs";

const adapters = { [SIX.id]: SIX };
const candidate = { "synthetic/a.txt": "candidate-a", "synthetic/b.txt": "candidate-b" };
const parent = { "synthetic/a.txt": "parent-a", "synthetic/b.txt": "parent-b" };
const manifest = {
  packet: "SYNTHETIC_PACKAGE_v1",
  parentCommit: "p".repeat(40),
  checks: Object.entries(candidate).map(([file, content]) => ({ file, bytes: Buffer.byteLength(content), sha256: sha256Hex(content), gitBlobSha: gitBlobSha(content) }))
};
const profile = {
  PROJECT_ID: "SYNTHETIC", PROTOCOL_ID: "SYNTHETIC_PROTOCOL_v1", CHECKPOINT_ID: "CP5", TARGET_PR: 1,
  PACKAGE_ARTIFACT_ID: 100, PACKAGE_SOURCE_PARENT: manifest.parentCommit, PACKAGE_MANIFEST_ID: manifest.packet,
  CANDIDATE_PATH_COUNT: 2, AUTHORIZED_PATHS: Object.keys(candidate), MODEL_ADAPTER: SIX.id,
  BENCHMARK_IDENTITY: "SYNTHETIC_BENCHMARK_v1", BENCHMARK_PATH: "verification/synthetic.mjs",
  REQUIRED_BENCHMARK_BLOB: "b".repeat(40), BENCHMARK_RESTORATION_COMMIT: "c".repeat(40),
  APPLICATION_MODE: "SEQUENTIAL_CONTENTS_API_WRITE", REQUIRE_EXACT_READBACK: true,
  REQUIRE_FRESHNESS_CLASSIFICATION: true, REQUIRE_PLAN_ONLY_RECEIPT: true, REQUIRE_FINAL_BENCHMARK_RECEIPT: true,
  MERGE_AUTHORIZED: false, DEPLOYMENT_AUTHORIZED: false, PHYSICAL_ACCEPTANCE_AUTHORIZED: false,
  CHECKPOINT_SEMANTICS: { PLAN_ONLY: "CP5_PLAN", APPLICATION: "CP5", EXACT_HEAD_VERIFICATION: "CP3_REPEAT", PHYSICAL_ACCEPTANCE: "CP6" }
};
function plan({ current = parent, packageFiles = candidate, manifestValue = manifest, profileValue = profile, benchmarkBlob = profile.REQUIRED_BENCHMARK_BLOB, protectedPaths = [] } = {}) {
  return createPlanOnlyReceipt({
    profile: profileValue, manifest: manifestValue, packageFiles, repositoryHead: "h".repeat(40),
    parentBlobs: Object.fromEntries(Object.entries(parent).map(([p, c]) => [p, gitBlobSha(c)])),
    currentBlobs: Object.fromEntries(Object.entries(current).map(([p, c]) => [p, gitBlobSha(c)])),
    benchmarkBlob, protectedPaths, adapterRegistry: adapters
  });
}
const tests = [];
function test(name, fn) { tests.push([name, fn]); }

test("valid package and unchanged parent", () => assert.equal(plan().pass, true));
test("valid package with one changed current path", () => assert.equal(plan({ current: { ...parent, "synthetic/a.txt": "newer" } }).pathClassifications[0].classification, "CONFLICT_REQUIRING_BOUNDED_RECONCILIATION"));
test("unauthorized package path", () => { const m = structuredClone(manifest); m.checks.push({ file: "laws/forbidden.js", bytes: 1, sha256: sha256Hex("x"), gitBlobSha: gitBlobSha("x") }); assert.equal(plan({ packageFiles: { ...candidate, "laws/forbidden.js": "x" }, manifestValue: m }).pass, false); });
test("package hash mismatch", () => assert.equal(plan({ packageFiles: { ...candidate, "synthetic/a.txt": "tampered" } }).pass, false));
test("package parent mismatch", () => assert.equal(plan({ manifestValue: { ...manifest, parentCommit: "x".repeat(40) } }).pass, false));
test("stale live head", async () => { const p = plan(); const repo = new InMemoryRepositoryAdapter({ head: "z".repeat(40), files: parent }); await assert.rejects(() => applyPlan({ plan: p, profile, packageFiles: candidate, repository: repo }), /STALE_LIVE_HEAD/); });
test("sequential write success", async () => { const p = plan(); const repo = new InMemoryRepositoryAdapter({ head: p.repositoryHead, files: parent }); const r = await applyPlan({ plan: p, profile, packageFiles: candidate, repository: repo, benchmark: async () => ({ pass: true }) }); assert.equal(r.pass, true); assert.equal(r.writes.length, 2); });
test("write failure before first mutation", async () => { const p = plan(); const repo = new InMemoryRepositoryAdapter({ head: p.repositoryHead, files: parent, failBeforeWrite: true }); await assert.rejects(() => applyPlan({ plan: p, profile, packageFiles: candidate, repository: repo }), /WRITE_FAILED_BEFORE/); assert.equal(repo.writeCount, 0); });
test("partial sequential-write failure", async () => { const p = plan(); const repo = new InMemoryRepositoryAdapter({ head: p.repositoryHead, files: parent, failAtWriteIndex: 1 }); await assert.rejects(() => applyPlan({ plan: p, profile, packageFiles: candidate, repository: repo }), /WRITE_FAILED_AT_INDEX/); assert.equal(repo.writeCount, 1); });
test("readback blob mismatch", async () => { const p = plan(); const repo = new InMemoryRepositoryAdapter({ head: p.repositoryHead, files: parent, corruptReadbackPath: "synthetic/a.txt" }); await assert.rejects(() => applyPlan({ plan: p, profile, packageFiles: candidate, repository: repo }), /STALE_PATH|READBACK_FAILED/); });
test("benchmark failure after successful application", async () => { const p = plan(); const repo = new InMemoryRepositoryAdapter({ head: p.repositoryHead, files: parent }); await assert.rejects(() => applyPlan({ plan: p, profile, packageFiles: candidate, repository: repo, benchmark: async () => ({ pass: false }) }), /BENCHMARK_FAILED/); });
test("benchmark success after successful application", async () => { const p = plan(); const repo = new InMemoryRepositoryAdapter({ head: p.repositoryHead, files: parent }); const r = await applyPlan({ plan: p, profile, packageFiles: candidate, repository: repo, benchmark: async () => ({ pass: true }) }); assert.equal(r.benchmarkReceipt.pass, true); });
test("malformed profile", () => assert.equal(validateProfile({}, adapters).pass, false));
test("missing model adapter", () => assert.equal(validateProfile({ ...profile, MODEL_ADAPTER: "MISSING" }, adapters).errors.includes("MODEL_ADAPTER_MISSING"), true));
test("duplicate authorized path", () => assert.equal(validateProfile({ ...profile, AUTHORIZED_PATHS: ["synthetic/a.txt", "synthetic/a.txt"] }, adapters).errors.includes("DUPLICATE_AUTHORIZED_PATH"), true));
test("benchmark identity mismatch", () => assert.equal(plan({ benchmarkBlob: "x".repeat(40) }).pass, false));
test("four-object fixed instrument", () => assert.equal(FOUR_INSTRUMENT.validateSelection({ instrumentId: FOUR_INSTRUMENT.id, outerAuthorities: [{}, {}, {}, {}] }).pass, true));
test("six-object fixed instrument and adapter", () => {
  const snapshot = {
    outerAuthorities: SIX.fixedIdentities.map((id, index) => ({ id, primary: index === 0 })), center: { fixed: true },
    lawAuthorityCount: 4, celestialAuthorityCount: 2, lawMemberCount: 16, nonLawMemberCount: 8, totalChildRouteCount: 24,
    test: { isLaw: false, memberCount: 4, depthPole: "FRONT" }, research: { isLaw: false, memberCount: 4, depthPole: "REAR" },
    testResearchOpposed: true, sharedRigidFieldTransform: true, selectedClusterMemberCount: 4
  };
  assert.equal(SIX_INSTRUMENT.validateSelection({ instrumentId: SIX_INSTRUMENT.id, snapshot }).pass, true);
});

let passed = 0;
const failures = [];
for (const [name, fn] of tests) {
  try { await fn(); passed += 1; }
  catch (error) { failures.push({ name, error: error.stack || error.message }); }
}
const receipt = {
  instrument: "R&D_PACKAGE_RECONCILE_APPLY_VERIFY_v1",
  fixtureSuite: "GENERIC_AND_FIXED_COUNT_FIXTURES_v1",
  total: tests.length,
  passed,
  failed: failures.length,
  pass: failures.length === 0,
  failures
};
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
