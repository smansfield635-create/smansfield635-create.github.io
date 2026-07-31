import { validatePackage } from "./package-validator.mjs";
import { classifyPaths, FRESHNESS } from "./freshness-classifier.mjs";
import { applyPlan } from "./application-engine.mjs";

const REQUIRED_PROFILE_KEYS = Object.freeze([
  "PROJECT_ID", "PROTOCOL_ID", "CHECKPOINT_ID", "TARGET_PR", "PACKAGE_ARTIFACT_ID",
  "PACKAGE_SOURCE_PARENT", "PACKAGE_MANIFEST_ID", "CANDIDATE_PATH_COUNT", "AUTHORIZED_PATHS",
  "MODEL_ADAPTER", "BENCHMARK_IDENTITY", "BENCHMARK_PATH", "REQUIRED_BENCHMARK_BLOB",
  "BENCHMARK_RESTORATION_COMMIT", "APPLICATION_MODE", "REQUIRE_EXACT_READBACK",
  "REQUIRE_FRESHNESS_CLASSIFICATION", "REQUIRE_PLAN_ONLY_RECEIPT", "REQUIRE_FINAL_BENCHMARK_RECEIPT",
  "MERGE_AUTHORIZED", "DEPLOYMENT_AUTHORIZED", "PHYSICAL_ACCEPTANCE_AUTHORIZED", "CHECKPOINT_SEMANTICS"
]);

export function validateProfile(profile, adapterRegistry = {}) {
  const errors = [];
  for (const key of REQUIRED_PROFILE_KEYS) if (!(key in (profile || {}))) errors.push(`PROFILE_KEY_MISSING:${key}`);
  if (!Array.isArray(profile?.AUTHORIZED_PATHS)) errors.push("AUTHORIZED_PATHS_INVALID");
  const unique = new Set(profile?.AUTHORIZED_PATHS || []);
  if (unique.size !== (profile?.AUTHORIZED_PATHS || []).length) errors.push("DUPLICATE_AUTHORIZED_PATH");
  if (profile?.CANDIDATE_PATH_COUNT !== unique.size) errors.push("CANDIDATE_PATH_COUNT_MISMATCH");
  if (profile?.APPLICATION_MODE !== "SEQUENTIAL_CONTENTS_API_WRITE") errors.push("APPLICATION_MODE_UNSUPPORTED");
  if (profile?.MERGE_AUTHORIZED !== false) errors.push("MERGE_MUST_REMAIN_UNAUTHORIZED");
  if (profile?.DEPLOYMENT_AUTHORIZED !== false) errors.push("DEPLOYMENT_MUST_REMAIN_UNAUTHORIZED");
  if (profile?.PHYSICAL_ACCEPTANCE_AUTHORIZED !== false) errors.push("PHYSICAL_ACCEPTANCE_MUST_REMAIN_UNAUTHORIZED");
  const adapter = adapterRegistry[profile?.MODEL_ADAPTER];
  if (!adapter) errors.push("MODEL_ADAPTER_MISSING");
  if (adapter?.validateProfileBinding) {
    for (const error of adapter.validateProfileBinding(profile)) errors.push(error);
  }
  return Object.freeze({ pass: errors.length === 0, errors: Object.freeze(errors), adapter: adapter || null });
}

export function createPlanOnlyReceipt({ profile, manifest, packageFiles, repositoryHead, parentBlobs, currentBlobs, benchmarkBlob, protectedPaths = [], adapterRegistry = {} }) {
  const profileValidation = validateProfile(profile, adapterRegistry);
  const packageValidation = validatePackage({
    manifest,
    files: packageFiles,
    authorizedPaths: profile.AUTHORIZED_PATHS,
    expectedManifestId: profile.PACKAGE_MANIFEST_ID,
    expectedParent: profile.PACKAGE_SOURCE_PARENT
  });
  const candidateBlobs = Object.fromEntries(
    packageValidation.checks
      .filter((entry) => profile.AUTHORIZED_PATHS.includes(entry.file))
      .map((entry) => [entry.file, entry.gitBlobSha])
  );
  const pathClassifications = classifyPaths({
    paths: profile.AUTHORIZED_PATHS,
    parentBlobs,
    currentBlobs,
    candidateBlobs
  });
  const protectedCollision = protectedPaths.filter((path) => profile.AUTHORIZED_PATHS.includes(path));
  const benchmarkPass = benchmarkBlob === profile.REQUIRED_BENCHMARK_BLOB;
  const unresolved = pathClassifications.filter((entry) => entry.classification === FRESHNESS.CONFLICT_REQUIRING_BOUNDED_RECONCILIATION);
  const pass = profileValidation.pass && packageValidation.pass && protectedCollision.length === 0 && benchmarkPass;

  return Object.freeze({
    instrument: "R&D_PACKAGE_RECONCILE_APPLY_VERIFY_v1",
    mode: "PLAN_ONLY",
    pass,
    protocolId: profile.PROTOCOL_ID,
    checkpoint: profile.CHECKPOINT_SEMANTICS.PLAN_ONLY,
    applicationCheckpoint: profile.CHECKPOINT_SEMANTICS.APPLICATION,
    exactHeadVerificationCheckpoint: profile.CHECKPOINT_SEMANTICS.EXACT_HEAD_VERIFICATION,
    physicalAcceptanceCheckpoint: profile.CHECKPOINT_SEMANTICS.PHYSICAL_ACCEPTANCE,
    projectId: profile.PROJECT_ID,
    targetPr: profile.TARGET_PR,
    repositoryHead,
    packageArtifactId: profile.PACKAGE_ARTIFACT_ID,
    packageValidation,
    profileValidation: { pass: profileValidation.pass, errors: profileValidation.errors },
    pathClassifications,
    plannedWriteSequence: Object.freeze(pathClassifications
      .filter((entry) => entry.classification !== FRESHNESS.CURRENTLY_EQUALS_CANDIDATE)
      .map((entry, index) => Object.freeze({ sequence: index + 1, path: entry.path, classification: entry.classification }))),
    unresolvedReconciliationPaths: Object.freeze(unresolved.map((entry) => entry.path)),
    benchmark: Object.freeze({ identity: profile.BENCHMARK_IDENTITY, path: profile.BENCHMARK_PATH, expectedBlob: profile.REQUIRED_BENCHMARK_BLOB, fetchedBlob: benchmarkBlob, pass: benchmarkPass }),
    protectedPathCollisions: Object.freeze(protectedCollision),
    productFilesApplied: false,
    repositoryHeadMutated: false,
    checkpoint5ExecutedVerification: false,
    merged: false,
    deployed: false,
    physicalAcceptance: "NOT_STARTED"
  });
}

export { applyPlan };
