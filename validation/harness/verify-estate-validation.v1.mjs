#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const ARGS = process.argv.slice(2);
const valueFor = (key, fallback = null) => {
  const index = ARGS.indexOf(key);
  return index >= 0 && ARGS[index + 1] ? ARGS[index + 1] : fallback;
};
const OUT = valueFor("--output");
const LOCAL = ARGS.includes("--local-preflight");
const ROOT = process.cwd();
const failures = [];
const checks = [];

const add = (name, pass, detail = "") => {
  checks.push({ name, pass, detail });
  if (!pass) failures.push(detail ? `${name}:${detail}` : name);
};
const text = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const json = (relativePath) => JSON.parse(text(relativePath));
const sha256 = (relativePath) =>
  crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, relativePath))).digest("hex");
const gitBlobSha = (relativePath) => {
  const bytes = fs.readFileSync(path.join(ROOT, relativePath));
  return crypto
    .createHash("sha1")
    .update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes]))
    .digest("hex");
};
const nonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const stable = (value) =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
      : value;
const deepEqual = (a, b) => JSON.stringify(stable(a)) === JSON.stringify(stable(b));
const subsetMatch = (actual, expected) => {
  if (expected === null || typeof expected !== "object") return deepEqual(actual, expected);
  if (Array.isArray(expected)) return deepEqual(actual, expected);
  if (!actual || typeof actual !== "object" || Array.isArray(actual)) return false;
  return Object.entries(expected).every(([key, value]) => subsetMatch(actual[key], value));
};
const getPath = (root, dottedPath) =>
  dottedPath.split(".").reduce((current, key) => (current == null ? undefined : current[key]), root);

const profilePaths = [
  "validation/profiles/narrative.v1.json",
  "validation/profiles/frontier.v1.json",
  "validation/profiles/products.v1.json",
  "validation/profiles/mirrorland.v1.json"
];

let classes;
let standards;
let master;
let crosswalks;
let validFixture;
let invalidFixture;
let manifest;
let coverageSchema;
let profiles = [];

try {
  classes = json("validation/claims/validation-classes.v1.json");
  standards = json("validation/standards/standards-registry.v1.json");
  master = json("validation/master-validation-register.v1.json");
  json("validation/schemas/asset-validation-record.schema.v1.json");
  coverageSchema = json("validation/schemas/coverage-profile.schema.v1.json");
  crosswalks = ["lrpv1", "imi", "general-software"].map((name) =>
    json(`validation/crosswalks/${name}.v1.json`)
  );
  validFixture = json("validation/harness/fixtures/valid-record.v1.json");
  invalidFixture = json("validation/harness/fixtures/invalid-overclaim.v1.json");
  manifest = json("validation/manifest.v1.json");
  profiles = profilePaths.map(json);
  add("LOAD", true);
} catch (error) {
  add("LOAD", false, error.message);
}

const validationClassIds = new Set(classes?.validationClasses?.map((entry) => entry.id) || []);
const statuses = new Set(classes?.statuses || []);
const evidenceSourceClasses = new Set(classes?.evidenceSourceClasses || []);
const standardIds = new Set(standards?.standards?.map((entry) => entry.standardId) || []);
const assetIds = new Set(master?.assets?.map((entry) => entry.assetId) || []);
const expectedValidationClasses = [
  "IDENTITY_BOUND",
  "IMPLEMENTATION_VERIFIED",
  "SPECIFICATION_CONFORMANT",
  "EXTERNALLY_BENCHMARKED",
  "INDEPENDENTLY_REPRODUCED",
  "SECURITY_REVIEWED",
  "EMPIRICALLY_VALIDATED",
  "CERTIFIED_OR_ACCREDITED"
];

add(
  "REGISTRIES",
  classes?.schema === "ESTATE_VALIDATION_CLASS_REGISTRY_v1" &&
    standards?.schema === "ESTATE_VALIDATION_STANDARDS_REGISTRY_v1" &&
    master?.schema === "ESTATE_MASTER_VALIDATION_REGISTER_v1"
);
add(
  "CLASS_SET",
  validationClassIds.size === expectedValidationClasses.length &&
    expectedValidationClasses.every((entry) => validationClassIds.has(entry))
);
add("NO_GENERIC_VALIDATED", !statuses.has("VALIDATED"));
add(
  "UNIQUE_IDS",
  standardIds.size === (standards?.standards?.length || -1) &&
    assetIds.size === (master?.assets?.length || -1)
);

function auditAssetRecord(record, full = true) {
  const reasons = [];
  for (const key of [
    "assetId",
    "assetName",
    "assetClass",
    "identity",
    "claims",
    "validation",
    "limitations",
    "evidenceRefs"
  ]) {
    if (!(key in (record || {}))) reasons.push(`MISSING:${key}`);
  }
  if (!nonEmptyString(record?.assetId) || !nonEmptyString(record?.assetName) || !nonEmptyString(record?.assetClass)) {
    reasons.push("EMPTY_ID");
  }
  if (!record?.identity || typeof record.identity !== "object" || Array.isArray(record.identity)) {
    reasons.push("BAD_IDENTITY");
  }
  if (!Array.isArray(record?.claims) || !record.claims.length) reasons.push("NO_CLAIMS");
  if (!Array.isArray(record?.limitations) || !record.limitations.length) reasons.push("NO_LIMITS");

  const entries = Object.entries(record?.validation || {});
  if (
    full &&
    (entries.length !== validationClassIds.size ||
      [...validationClassIds].some((key) => !(key in (record?.validation || {}))))
  ) {
    reasons.push("INCOMPLETE_CLASS_SET");
  }

  for (const [validationClass, state] of entries) {
    if (!validationClassIds.has(validationClass)) reasons.push(`UNKNOWN_CLASS:${validationClass}`);
    if (!statuses.has(state?.status)) reasons.push(`UNKNOWN_STATUS:${state?.status}`);
    const refs = state?.evidenceRefs || [];
    const sourceClasses = state?.evidenceSourceClasses || [];
    if (state?.status === "ESTABLISHED" && !refs.length) reasons.push(`NO_EVIDENCE:${validationClass}`);
    for (const sourceClass of sourceClasses) {
      if (!evidenceSourceClasses.has(sourceClass)) reasons.push(`UNKNOWN_SOURCE:${sourceClass}`);
    }
    if (
      validationClass === "INDEPENDENTLY_REPRODUCED" &&
      state?.status === "ESTABLISHED" &&
      !sourceClasses.some((sourceClass) =>
        ["EXTERNAL_INDEPENDENT_IMPLEMENTATION", "EXTERNAL_INDEPENDENT_REVIEW"].includes(sourceClass)
      )
    ) {
      reasons.push("FALSE_INDEPENDENCE");
    }
    if (
      validationClass === "SECURITY_REVIEWED" &&
      state?.status === "ESTABLISHED" &&
      !sourceClasses.includes("EXTERNAL_INDEPENDENT_REVIEW")
    ) {
      reasons.push("FALSE_SECURITY_REVIEW");
    }
    if (
      validationClass === "CERTIFIED_OR_ACCREDITED" &&
      state?.status === "ESTABLISHED" &&
      !sourceClasses.includes("ACCREDITED_BODY")
    ) {
      reasons.push("FALSE_CERTIFICATION");
    }
  }

  return [...new Set(reasons)].sort();
}

for (const record of master?.assets || []) {
  const reasons = auditAssetRecord(record);
  add(`ASSET:${record.assetId}`, !reasons.length, reasons.join(","));
}
const validReasons = auditAssetRecord(validFixture, false);
const invalidReasons = auditAssetRecord(invalidFixture, false);
add("VALID_FIXTURE", !validReasons.length, validReasons.join(","));
add(
  "NEGATIVE_OVERCLAIM_REJECTED",
  invalidReasons.includes("FALSE_CERTIFICATION"),
  invalidReasons.join(",")
);

for (const crosswalk of crosswalks) {
  add(`CROSSWALK:${crosswalk?.crosswalkId}`, crosswalk?.schema === "ESTATE_VALIDATION_CROSSWALK_v1");
  if (crosswalk?.assetId !== "MULTI_ASSET_SOFTWARE_REFERENCE") {
    add(`CROSSWALK_ASSET:${crosswalk?.crosswalkId}`, assetIds.has(crosswalk?.assetId), crosswalk?.assetId);
  }
  for (const mapping of crosswalk?.mappings || []) {
    add(`STANDARD:${mapping.standardId}`, standardIds.has(mapping.standardId), mapping.standardId);
  }
}

add(
  "STANDARD_TEXT_BOUNDARY",
  standards?.registryBoundary ===
    "STANDARD_IDENTIFIERS_AND_PUBLIC_SCOPE_DESCRIPTIONS_ONLY_NO_PROPRIETARY_STANDARD_TEXT_REPRODUCED"
);
add(
  "ANTI_OVERCLAIM",
  master?.globalBoundaries?.includes("NO_EXTERNAL_STANDARD_REFERENCE_MAY_BE_RELABELED_AS_CERTIFICATION") &&
    master?.globalBoundaries?.includes("NO_SOFTWARE_CONFORMANCE_RESULT_MAY_BE_RELABELED_AS_SCIENTIFIC_VALIDITY")
);

const allowedProfileClasses = new Set([
  "NARRATIVE_CONSTITUTION",
  "APPLICATION_SURFACE",
  "IMPLEMENTATION_SURFACE",
  "MIRRORLAND_ORIENTATION_SURFACE"
]);
const allowedAssertionKinds = new Set([
  "TEXT_INCLUDES",
  "TEXT_EXCLUDES",
  "JSON_VALUE_EQUALS",
  "JSON_ARRAY_INCLUDES",
  "JSON_ARRAY_LENGTH",
  "JSON_ARRAY_OBJECT_MATCH",
  "JSON_ARRAY_OBJECT_SEQUENCE"
]);
const profileTopLevelKeys = [
  "schema",
  "profileId",
  "version",
  "subjectClass",
  "purpose",
  "subjectIdentity",
  "assertionPolicy",
  "assertions",
  "claimBoundary",
  "limitations",
  "publicMutationAuthorized"
].sort();
const policyKeys = [
  "mode",
  "exactIdentityRequired",
  "semanticAssertionsBounded",
  "runtimeAcceptanceClaimed",
  "visualAcceptanceClaimed",
  "scientificValidityClaimed",
  "externalValidationClaimed"
].sort();

function auditProfile(profile) {
  const reasons = [];
  if (profile?.schema !== "ESTATE_VALIDATION_COVERAGE_PROFILE_v1") reasons.push("SCHEMA");
  if (!/^[A-Z0-9][A-Z0-9_]{2,127}$/.test(profile?.profileId || "")) reasons.push("PROFILE_ID");
  if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(profile?.version || "")) reasons.push("VERSION");
  if (!allowedProfileClasses.has(profile?.subjectClass)) reasons.push("SUBJECT_CLASS");
  if (!nonEmptyString(profile?.purpose)) reasons.push("PURPOSE");
  if (JSON.stringify(Object.keys(profile || {}).sort()) !== JSON.stringify(profileTopLevelKeys)) {
    reasons.push("TOP_LEVEL_KEYS");
  }
  if (!Array.isArray(profile?.subjectIdentity) || !profile.subjectIdentity.length) {
    reasons.push("SUBJECT_IDENTITY");
  } else {
    const subjectPaths = new Set();
    for (const identity of profile.subjectIdentity) {
      if (
        !identity ||
        JSON.stringify(Object.keys(identity).sort()) !== JSON.stringify(["gitBlobSha", "path"]) ||
        !nonEmptyString(identity.path) ||
        !/^[0-9a-f]{40}$/.test(identity.gitBlobSha || "")
      ) {
        reasons.push("SUBJECT_IDENTITY_ENTRY");
      }
      if (subjectPaths.has(identity?.path)) reasons.push("DUPLICATE_SUBJECT_PATH");
      subjectPaths.add(identity?.path);
    }
    for (const assertion of profile?.assertions || []) {
      if (!subjectPaths.has(assertion?.subjectPath)) reasons.push(`UNBOUND_ASSERTION_SUBJECT:${assertion?.id}`);
    }
  }

  const policy = profile?.assertionPolicy;
  if (!policy || JSON.stringify(Object.keys(policy).sort()) !== JSON.stringify(policyKeys)) {
    reasons.push("ASSERTION_POLICY_KEYS");
  } else if (
    policy.mode !== "READ_ONLY_SIDECAR" ||
    policy.exactIdentityRequired !== true ||
    policy.semanticAssertionsBounded !== true ||
    policy.runtimeAcceptanceClaimed !== false ||
    policy.visualAcceptanceClaimed !== false ||
    policy.scientificValidityClaimed !== false ||
    policy.externalValidationClaimed !== false
  ) {
    reasons.push("ASSERTION_POLICY_BOUNDARY");
  }

  if (!Array.isArray(profile?.assertions) || !profile.assertions.length) {
    reasons.push("ASSERTIONS");
  } else {
    const assertionIds = new Set();
    for (const assertion of profile.assertions) {
      const keys = Object.keys(assertion || {}).sort();
      const expectedKeys = (assertion?.jsonPath
        ? ["expected", "id", "jsonPath", "kind", "subjectPath"]
        : ["expected", "id", "kind", "subjectPath"]
      ).sort();
      if (JSON.stringify(keys) !== JSON.stringify(expectedKeys)) reasons.push(`ASSERTION_KEYS:${assertion?.id}`);
      if (!/^[A-Z0-9][A-Z0-9_]{2,127}$/.test(assertion?.id || "")) reasons.push("ASSERTION_ID");
      if (assertionIds.has(assertion?.id)) reasons.push(`DUPLICATE_ASSERTION_ID:${assertion?.id}`);
      assertionIds.add(assertion?.id);
      if (!allowedAssertionKinds.has(assertion?.kind)) reasons.push(`ASSERTION_KIND:${assertion?.id}`);
      if (!nonEmptyString(assertion?.subjectPath)) reasons.push(`ASSERTION_SUBJECT:${assertion?.id}`);
      if (assertion?.kind.startsWith("JSON_") && !nonEmptyString(assertion?.jsonPath)) {
        reasons.push(`ASSERTION_JSON_PATH:${assertion?.id}`);
      }
    }
  }

  if (!Array.isArray(profile?.claimBoundary) || !profile.claimBoundary.length) reasons.push("CLAIM_BOUNDARY");
  if (!Array.isArray(profile?.limitations) || !profile.limitations.length) reasons.push("LIMITATIONS");
  if (profile?.publicMutationAuthorized !== false) reasons.push("PUBLIC_MUTATION_AUTHORITY");
  return [...new Set(reasons)].sort();
}

add(
  "COVERAGE_SCHEMA",
  coverageSchema?.$id === "ESTATE_VALIDATION_COVERAGE_PROFILE_SCHEMA_v1" &&
    coverageSchema?.properties?.publicMutationAuthorized?.const === false
);

const profileIds = new Set(profiles.map((profile) => profile.profileId));
add("PROFILE_ID_UNIQUENESS", profileIds.size === profiles.length);

for (const profile of profiles) {
  const reasons = auditProfile(profile);
  add(`PROFILE_SCHEMA:${profile?.profileId || "UNKNOWN"}`, !reasons.length, reasons.join(","));
}

const manifestFiles = manifest?.files || [];
const manifestPaths = new Set();
add(
  "MANIFEST",
  manifest?.schema === "ESTATE_VALIDATION_MANIFEST_v1" &&
    manifest?.fileCount === manifestFiles.length
);
for (const file of manifestFiles) {
  if (!nonEmptyString(file?.path) || !/^[0-9a-f]{64}$/.test(file?.sha256 || "")) {
    add(`FILE:${file?.path || "?"}`, false, "MALFORMED");
    continue;
  }
  if (manifestPaths.has(file.path)) {
    add(`FILE:${file.path}`, false, "DUPLICATE");
    continue;
  }
  manifestPaths.add(file.path);
  const absolute = path.join(ROOT, file.path);
  if (!fs.existsSync(absolute)) {
    add(`FILE:${file.path}`, false, "MISSING");
    continue;
  }
  const actual = sha256(file.path);
  add(
    `FILE:${file.path}`,
    actual === file.sha256,
    actual === file.sha256 ? "" : `EXPECTED_${file.sha256}_ACTUAL_${actual}`
  );
}

const requiredManifestPaths = [
  "validation/README.md",
  "validation/master-validation-register.v1.json",
  "validation/standards/standards-registry.v1.json",
  "validation/claims/validation-classes.v1.json",
  "validation/schemas/asset-validation-record.schema.v1.json",
  "validation/schemas/coverage-profile.schema.v1.json",
  "validation/crosswalks/lrpv1.v1.json",
  "validation/crosswalks/imi.v1.json",
  "validation/crosswalks/general-software.v1.json",
  "validation/harness/verify-estate-validation.v1.mjs",
  "validation/harness/fixtures/valid-record.v1.json",
  "validation/harness/fixtures/invalid-overclaim.v1.json",
  "validation/profiles/narrative.v1.json",
  "validation/profiles/frontier.v1.json",
  "validation/profiles/products.v1.json",
  "validation/profiles/mirrorland.v1.json",
  "validation/reproduction/README.md",
  "validation/threat-model/README.md"
];
add(
  "MANIFEST_SET",
  requiredManifestPaths.length === manifestPaths.size &&
    requiredManifestPaths.every((entry) => manifestPaths.has(entry)) &&
    !manifestPaths.has("validation/manifest.v1.json")
);

let legacySubjectChecksPassed = true;
const subjectCheck = (name, pass, detail = "") => {
  add(`SUBJECT:${name}`, pass, detail);
  if (!pass) legacySubjectChecksPassed = false;
};

if (!LOCAL) {
  try {
    const pointer = json("research/route-operator-platform-v1/IMI_PACKAGE_POINTER.json");
    subjectCheck(
      "IMI_SHA",
      pointer?.zip_sha256 === "0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87",
      pointer?.zip_sha256 || "MISSING"
    );
  } catch (error) {
    subjectCheck("IMI_SHA", false, error.message);
  }

  try {
    const readme = text("infrastructure/lineage-receipt-protocol-v1/README.md");
    subjectCheck(
      "LRPV1",
      readme.includes("LINEAGE_RECEIPT_PROTOCOL_v1") &&
        readme.includes("content-addressed execution lineage")
    );
  } catch (error) {
    subjectCheck("LRPV1", false, error.message);
  }

  try {
    const readme = text("research/route-operator-platform-v1/README.md");
    subjectCheck(
      "ROUTE_OPERATOR",
      readme.includes("PRE_EMPIRICAL_RESEARCH_PLATFORM_v1") &&
        readme.includes("READ_ONLY_SHADOW_RESEARCH")
    );
  } catch (error) {
    subjectCheck("ROUTE_OPERATOR", false, error.message);
  }

  try {
    const projects = new Set(
      (json(".github/ai-router/router.v1.json")?.projects || []).map((entry) => entry.projectId)
    );
    for (const projectId of ["H_EARTH", "LAWS", "LINEAGE_RECEIPT_PROTOCOL", "ESTATE_VALIDATION"]) {
      subjectCheck(`ROUTER_${projectId}`, projects.has(projectId));
    }
  } catch (error) {
    subjectCheck("ROUTER", false, error.message);
  }
}

const jsonCache = new Map();
const readSubjectJson = (relativePath) => {
  if (!jsonCache.has(relativePath)) jsonCache.set(relativePath, json(relativePath));
  return jsonCache.get(relativePath);
};

function evaluateAssertion(assertion) {
  const sourceText = assertion.kind.startsWith("TEXT_") ? text(assertion.subjectPath) : null;
  const sourceJson = assertion.kind.startsWith("JSON_") ? readSubjectJson(assertion.subjectPath) : null;
  const value = assertion.jsonPath ? getPath(sourceJson, assertion.jsonPath) : undefined;

  switch (assertion.kind) {
    case "TEXT_INCLUDES":
      return typeof assertion.expected === "string" && sourceText.includes(assertion.expected);
    case "TEXT_EXCLUDES":
      return typeof assertion.expected === "string" && !sourceText.includes(assertion.expected);
    case "JSON_VALUE_EQUALS":
      return deepEqual(value, assertion.expected);
    case "JSON_ARRAY_INCLUDES":
      return Array.isArray(value) && value.some((entry) => deepEqual(entry, assertion.expected));
    case "JSON_ARRAY_LENGTH":
      return Array.isArray(value) && value.length === assertion.expected;
    case "JSON_ARRAY_OBJECT_MATCH":
      return Array.isArray(value) && value.some((entry) => subsetMatch(entry, assertion.expected));
    case "JSON_ARRAY_OBJECT_SEQUENCE":
      return (
        Array.isArray(value) &&
        Array.isArray(assertion.expected) &&
        value.length === assertion.expected.length &&
        assertion.expected.every((entry, index) => subsetMatch(value[index], entry))
      );
    default:
      return false;
  }
}

let profileSubjectChecksPassed = true;
const profileSummaries = [];

if (!LOCAL) {
  for (const profile of profiles) {
    let profilePassed = true;
    for (const identity of profile.subjectIdentity) {
      let pass = false;
      let detail = "";
      try {
        const actual = gitBlobSha(identity.path);
        pass = actual === identity.gitBlobSha;
        detail = pass ? "" : `EXPECTED_${identity.gitBlobSha}_ACTUAL_${actual}`;
      } catch (error) {
        detail = error.message;
      }
      add(`PROFILE_IDENTITY:${profile.profileId}:${identity.path}`, pass, detail);
      if (!pass) profilePassed = false;
    }

    for (const assertion of profile.assertions) {
      let pass = false;
      let detail = "";
      try {
        pass = evaluateAssertion(assertion);
        if (!pass) detail = `${assertion.kind}:${assertion.subjectPath}`;
      } catch (error) {
        detail = error.message;
      }
      add(`PROFILE_ASSERT:${profile.profileId}:${assertion.id}`, pass, detail);
      if (!pass) profilePassed = false;
    }

    if (!profilePassed) profileSubjectChecksPassed = false;
    profileSummaries.push({
      profileId: profile.profileId,
      subjectClass: profile.subjectClass,
      assertionCount: profile.assertions.length,
      subjectIdentityCount: profile.subjectIdentity.length,
      passed: profilePassed
    });
  }
} else {
  for (const profile of profiles) {
    profileSummaries.push({
      profileId: profile.profileId,
      subjectClass: profile.subjectClass,
      assertionCount: profile.assertions.length,
      subjectIdentityCount: profile.subjectIdentity.length,
      passed: null
    });
  }
}

const HEAD =
  process.env.EXPECTED_HEAD ||
  process.env.ESTATE_VALIDATION_EXPECTED_HEAD ||
  (LOCAL ? "LOCAL_PREFLIGHT_NO_HEAD_CLAIM" : "UNRESOLVED");
if (!LOCAL) add("EXACT_HEAD", /^[0-9a-f]{40}$/.test(HEAD), HEAD);

const manifestSha = fs.existsSync(path.join(ROOT, "validation/manifest.v1.json"))
  ? sha256("validation/manifest.v1.json")
  : null;
const masterRegisterSha = fs.existsSync(path.join(ROOT, "validation/master-validation-register.v1.json"))
  ? sha256("validation/master-validation-register.v1.json")
  : null;

let lrpReceipt = null;
let lrpVerification = null;
if (!LOCAL && !failures.length) {
  try {
    const module = await import(
      pathToFileURL(
        path.join(
          ROOT,
          "infrastructure/lineage-receipt-protocol-v1/javascript/lineage_receipt_protocol_v1.mjs"
        )
      ).href
    );
    const payload = {
      validation_protocol: "ESTATE_VALIDATION_v1",
      candidate_head: HEAD,
      manifest_sha256: manifestSha,
      master_register_sha256: masterRegisterSha,
      asset_count: master.assets.length,
      standard_count: standards.standards.length,
      validation_class_count: classes.validationClasses.length,
      crosswalk_count: crosswalks.length,
      coverage_profile_count: profiles.length,
      invalid_overclaim_rejected: true,
      subject_identity_checks_passed: legacySubjectChecksPassed && profileSubjectChecksPassed,
      coverage_profile_checks_passed: profileSubjectChecksPassed
    };
    lrpReceipt = await module.createReceipt(payload);
    lrpVerification = await module.verifyReceipt(lrpReceipt);
    add("LRPV1_BINDING", lrpVerification?.state === "VALID", lrpVerification?.state || "NO_STATE");
  } catch (error) {
    add("LRPV1_BINDING", false, error.message);
  }
}

const result = failures.length ? "FAIL" : "PASS";
const receipt = {
  schema: "ESTATE_VALIDATION_VERIFICATION_RECEIPT_v1",
  result,
  validationVersion: "1.1.0",
  candidateHead: HEAD,
  localPreflight: LOCAL,
  checkedFileCount: manifestFiles.length,
  assetRecordCount: master?.assets?.length || 0,
  standardCount: standards?.standards?.length || 0,
  validationClassCount: classes?.validationClasses?.length || 0,
  crosswalkCount: crosswalks.length,
  coverageProfileCount: profiles.length,
  coverageProfiles: profileSummaries,
  subjectChecksExecuted: !LOCAL,
  manifestSha256: manifestSha,
  masterRegisterSha256: masterRegisterSha,
  checks,
  reasons: [...new Set(failures)].sort(),
  lrpReceipt,
  lrpVerification,
  externalThirdPartyValidationClaimed: false,
  certificationOrAccreditationClaimed: false,
  runtimeAcceptanceClaimed: false,
  visualAcceptanceClaimed: false,
  scientificValidityClaimed: false
};

const output = JSON.stringify(receipt, null, 2) + "\n";
if (OUT) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, output);
} else {
  process.stdout.write(output);
}
process.exit(result === "PASS" ? 0 : 1);
