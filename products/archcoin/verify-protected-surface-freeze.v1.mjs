#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const BASE = "1cffd15dcae866416fb967ced61b236b1b2bf68a";
const ROOT = process.cwd();
const MANIFEST_PATH = "products/archcoin/protected-surface-freeze.v1.json";
const VERIFIER_PATH = "products/archcoin/verify-protected-surface-freeze.v1.mjs";
const ALLOWED = Object.freeze([MANIFEST_PATH, VERIFIER_PATH].sort());
const DOMAINS = Object.freeze(["contract", "receivable", "payable", "allocation"]);
const PLANES = Object.freeze(["overview", "engineering", "platform", "governance"]);

const fail = (code, detail = "") => {
  process.stderr.write(`${code}${detail ? `: ${detail}` : ""}\n`);
  process.exit(1);
};
const assert = (condition, code, detail = "") => {
  if (!condition) fail(code, detail);
};
const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
const lines = value => value.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
const read = relative => fs.readFileSync(path.join(ROOT, relative), "utf8");
const show = (ref, relative) => git("show", `${ref}:${relative}`);
const blobAt = (ref, relative) => git("rev-parse", `${ref}:${relative}`);
const occurrences = (text, token) => text.split(token).length - 1;

assert(git("rev-parse", "--is-inside-work-tree") === "true", "NOT_GIT_WORKTREE");
assert(git("cat-file", "-t", BASE) === "commit", "GOVERNING_HEAD_MISSING", BASE);

const head = git("rev-parse", "HEAD");
if (head !== BASE) {
  assert(git("rev-parse", `${head}^`) === BASE, "GOVERNING_HEAD_MISMATCH", `${head} parent is not ${BASE}`);
}

const tracked = lines(git("diff", "--name-only", BASE));
const untracked = lines(git("ls-files", "--others", "--exclude-standard"));
const changed = [...new Set([...tracked, ...untracked])].sort();
assert(JSON.stringify(changed) === JSON.stringify(ALLOWED), "DECLARED_PATH_SET_MISMATCH", JSON.stringify(changed));
const pathExistsAt = (ref, relative) => {
  try {
    execFileSync("git", ["cat-file", "-e", `${ref}:${relative}`], { cwd: ROOT, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};
assert(!pathExistsAt(BASE, MANIFEST_PATH), "FREEZE_PATH_ALREADY_EXISTED", MANIFEST_PATH);
assert(!pathExistsAt(BASE, VERIFIER_PATH), "FREEZE_PATH_ALREADY_EXISTED", VERIFIER_PATH);

const manifest = JSON.parse(read(MANIFEST_PATH));
assert(manifest.schema === "ARCHCOIN_PROTECTED_SURFACE_FREEZE_v1", "FREEZE_SCHEMA_INVALID", manifest.schema);
assert(manifest.status === "FROZEN_EXACT_PUBLISHED_BASELINE", "FREEZE_STATUS_INVALID", manifest.status);
assert(manifest.operation?.operationId === "ARCHCOIN_PROTECTED_SURFACE_FREEZE_20260920_001", "OPERATION_ID_MISMATCH");
assert(manifest.operation?.lockGeneration === 2450, "LOCK_GENERATION_MISMATCH");
assert(manifest.operation?.governingHead === BASE, "MANIFEST_GOVERNING_HEAD_MISMATCH");
assert(JSON.stringify([...manifest.operation.allowedPaths].sort()) === JSON.stringify(ALLOWED), "MANIFEST_ALLOWED_PATHS_MISMATCH");
assert(manifest.purpose?.repairIncluded === false, "REPAIR_LEAKED_INTO_FREEZE");
assert(manifest.purpose?.publicBytesChangedByFreeze === false, "PUBLIC_MUTATION_CLAIM_INVALID");

assert(Array.isArray(manifest.immutablePaths), "IMMUTABLE_PATHS_MISSING");
assert(manifest.immutablePaths.length === 48, "IMMUTABLE_PATH_COUNT_MISMATCH", String(manifest.immutablePaths.length));
const immutableNames = new Set();
for (const entry of manifest.immutablePaths) {
  assert(entry && typeof entry.path === "string" && /^[0-9a-f]{40}$/.test(entry.blob), "IMMUTABLE_ENTRY_INVALID", JSON.stringify(entry));
  assert(!immutableNames.has(entry.path), "IMMUTABLE_PATH_DUPLICATE", entry.path);
  immutableNames.add(entry.path);
  assert(blobAt(BASE, entry.path) === entry.blob, "BASELINE_BLOB_IDENTITY_MISMATCH", entry.path);
  assert(blobAt(head, entry.path) === entry.blob, "PROTECTED_BLOB_IDENTITY_MISMATCH", entry.path);
}

const seams = manifest.controlledFuturePresentationSeams;
assert(Array.isArray(seams) && seams.length === 4, "CONTROLLED_SEAM_COUNT_MISMATCH");
const expectedSeams = [
  ["products/archcoin/index.html", "c1e3a7fa1d0bbada82adac485db92dbb11aeb22c"],
  ["products/archcoin/index.presentation.css", "d5feb3bb5b1b763804df13b8a1224fa35a7b1df6"],
  ["products/archcoin/carousel.js", "82b44869d922ebe6a0be9aed621f3f4bd2ced13e"],
  ["products/archcoin/carousel.css", "eee06c48e45ba47d7198b423bfe58701f7659fb2"]
];
assert(JSON.stringify(seams.map(({ path: seamPath, baselineBlob }) => [seamPath, baselineBlob])) === JSON.stringify(expectedSeams), "CONTROLLED_SEAM_IDENTITY_MISMATCH");
for (const [seamPath, seamBlob] of expectedSeams) {
  assert(!immutableNames.has(seamPath), "SEAM_MARKED_IMMUTABLE", seamPath);
  assert(blobAt(BASE, seamPath) === seamBlob, "SEAM_BASELINE_BLOB_MISMATCH", seamPath);
  assert(blobAt(head, seamPath) === seamBlob, "FREEZE_OPERATION_MUTATED_SEAM", seamPath);
}

assert(manifest.futureOperationLaw?.freshCanonicalAdmissionRequired === true, "FRESH_ADMISSION_LAW_MISSING");
assert(manifest.futureOperationLaw?.mutationLimitedToDeclaredPresentationSeams === true, "SEAM_SCOPE_LAW_MISSING");
assert(manifest.futureOperationLaw?.immutablePathMutationRequiresNewOwnerScope === true, "IMMUTABLE_SCOPE_LAW_MISSING");
assert(manifest.futureOperationLaw?.compassAndCarouselRepairsMustQualifyIndependentlyBeforeCombinedRegression === true, "INDEPENDENT_QUALIFICATION_LAW_MISSING");

const rootHtml = show(head, "products/archcoin/index.html");
const controller = show(head, "products/archcoin/index.controller.js");
assert(occurrences(rootHtml, "data-archcoin-coin\n") === 4, "CARDINAL_DOMAIN_COUNT_MISMATCH");
assert(occurrences(rootHtml, "data-archcoin-room\n") === 16, "ROOM_DECLARATION_COUNT_MISMATCH");
for (const token of [
  "7.0.0-controller-interaction-semantic-priority",
  "AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",
  "ROOM_BY_ROUTE.size === 16",
  "beginOrbitGesture()",
  "beginClusterGesture(wing)",
  "requestOrbitCommit()",
  "requestClusterCommit(wing)"
]) assert(controller.includes(token), "COMPASS_AUTHORITY_INVARIANT_MISSING", token);

const carouselJs = show(head, "products/archcoin/carousel.js");
for (const token of [
  "SITE_CONTINUITY_V3_ONE_STAGE_TABS_SWIPE_KEYBOARD",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "pointerdown",
  "aria-selected",
  "toggleAttribute(\"inert\"",
  "hashchange",
  "popstate"
]) assert(carouselJs.includes(token), "CAROUSEL_BEHAVIOR_INVARIANT_MISSING", token);

let planeCount = 0;
let redirectCount = 0;
for (const domain of DOMAINS) {
  const domainHtml = show(head, `products/archcoin/${domain}/index.html`);
  assert(occurrences(domainHtml, "data-carousel-tab") === 4, "DOMAIN_TAB_COUNT_MISMATCH", domain);
  assert(occurrences(domainHtml, "data-carousel-plane=") === 4, "DOMAIN_PLANE_COUNT_MISMATCH", domain);
  assert(domainHtml.includes("Signed transaction qualified") && domainHtml.includes("Sepolia pending"), "STATUS_SPINE_MISSING", domain);
  assert(!/0x[a-fA-F0-9]{40}/.test(domainHtml), "UNSUPPORTED_CONTRACT_ADDRESS", domain);
  for (const plane of PLANES) {
    assert(domainHtml.includes(`data-carousel-plane="${plane}"`), "PLANE_ID_MISSING", `${domain}/${plane}`);
    const legacy = show(head, `products/archcoin/${domain}/${plane}/index.html`);
    assert(legacy.includes(`rel="canonical" href="../#${plane}"`), "LEGACY_CANONICAL_MISMATCH", `${domain}/${plane}`);
    assert(legacy.includes(`content="0; url=../#${plane}"`), "LEGACY_REDIRECT_MISMATCH", `${domain}/${plane}`);
    planeCount += 1;
    redirectCount += 1;
  }
}
assert(planeCount === 16 && redirectCount === 16, "FOUR_BY_FOUR_TOPOLOGY_MISMATCH");

const conversionMap = JSON.parse(show(head, "products/archcoin/carousel-conversion-map.v1.json"));
assert(conversionMap.semanticPreservation?.existingChamberCount === 16, "FROZEN_SOURCE_CHAMBER_COUNT_MISMATCH");
assert(conversionMap.semanticPreservation?.targetPlaneCount === 16, "FROZEN_SOURCE_PLANE_COUNT_MISMATCH");
assert(conversionMap.fourAssetEvmBinding?.websiteStatusSpine?.currentBoundary === "SEPOLIA_PENDING", "NETWORK_BOUNDARY_DRIFT");
assert(conversionMap.fourAssetEvmBinding?.websiteStatusSpine?.cryptocurrencyClaimAllowed === false, "CRYPTOCURRENCY_CLAIM_BOUNDARY_DRIFT");

assert(!changed.some(item => /\.(?:html|css|js)$/.test(item) && !ALLOWED.includes(item)), "PUBLIC_RUNTIME_MUTATION_DETECTED");
assert(!changed.some(item => item.startsWith("economy/archcoin/")), "EVM_IMPLEMENTATION_MUTATED");
assert(!changed.some(item => item.startsWith("assets/compass/")), "SHARED_COMPASS_RUNTIME_MUTATED");
assert(!changed.some(item => item.startsWith(".github/")), "CONTROL_PLANE_MUTATED");

const receipt = {
  schema: "ARCHCOIN_PROTECTED_SURFACE_FREEZE_VERIFICATION_RECEIPT_v1",
  result: "PASS_CLOSED",
  governingHead: BASE,
  candidate: head === BASE ? "WORKTREE_PRECOMMIT" : head,
  operationId: manifest.operation.operationId,
  lockGeneration: manifest.operation.lockGeneration,
  changedPathCount: changed.length,
  changedPathsExact: true,
  immutablePathCount: manifest.immutablePaths.length,
  controlledFuturePresentationSeamCount: seams.length,
  cardinalDomainCount: DOMAINS.length,
  semanticPlaneCount: planeCount,
  legacyDeepLinkCount: redirectCount,
  compassRuntimeMutated: false,
  carouselRuntimeMutated: false,
  evmImplementationMutated: false,
  publicRuntimeMutated: false,
  repairIncluded: false,
  networkBoundary: "SEPOLIA_PENDING"
};
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
