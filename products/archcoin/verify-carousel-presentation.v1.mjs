#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const BASE = "f9016815118f24e8f0697581da7a9f6aed3bd043";
const ROOT = process.cwd();
const DOMAINS = Object.freeze([
  { id: "contract", symbol: "ARCC", name: "ARCHCOIN Contract" },
  { id: "receivable", symbol: "ARCR", name: "ARCHCOIN Receivable" },
  { id: "payable", symbol: "ARCP", name: "ARCHCOIN Payable" },
  { id: "allocation", symbol: "ARCA", name: "ARCHCOIN Allocation" }
]);
const PLANES = Object.freeze(["overview", "engineering", "platform", "governance"]);
const ALLOWED = Object.freeze([
  "products/archcoin/index.html",
  "products/archcoin/index.controller.js",
  "products/archcoin/carousel.css",
  "products/archcoin/carousel.js",
  ...DOMAINS.map(({ id }) => `products/archcoin/${id}/index.html`),
  ...DOMAINS.flatMap(({ id }) => PLANES.map(plane => `products/archcoin/${id}/${plane}/index.html`)),
  "products/archcoin/verify-carousel-presentation.v1.mjs"
].sort());

const fail = (code, detail = "") => {
  process.stderr.write(`${code}${detail ? `: ${detail}` : ""}\n`);
  process.exit(1);
};
const assert = (condition, code, detail) => { if (!condition) fail(code, detail); };
const read = relative => fs.readFileSync(path.join(ROOT, relative), "utf8");
const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
const lines = value => value.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
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

const mapPath = "products/archcoin/carousel-conversion-map.v1.json";
const mapBlob = git("hash-object", mapPath);
const baseMapBlob = git("rev-parse", `${BASE}:${mapPath}`);
assert(mapBlob === baseMapBlob, "FROZEN_MAP_IDENTITY_MISMATCH", `${mapBlob} != ${baseMapBlob}`);
const map = JSON.parse(read(mapPath));
assert(map.semanticPreservation?.existingChamberCount === 16, "FROZEN_MAP_CHAMBER_COUNT");
assert(map.semanticPreservation?.targetPlaneCount === 16, "FROZEN_MAP_PLANE_COUNT");
assert(map.fourAssetEvmBinding?.websiteStatusSpine?.currentBoundary === "SEPOLIA_PENDING", "STATUS_BOUNDARY_DRIFT");
assert(map.fourAssetEvmBinding?.websiteStatusSpine?.cryptocurrencyClaimAllowed === false, "CLAIM_BOUNDARY_DRIFT");

const sharedJs = read("products/archcoin/carousel.js");
for (const token of [
  "SITE_CONTINUITY_V3_ONE_STAGE_TABS_SWIPE_KEYBOARD",
  "ArrowLeft", "ArrowRight", "Home", "End",
  "pointerdown", "pointerup", "aria-selected", "inert",
  "hashchange", "popstate"
]) assert(sharedJs.includes(token), "CAROUSEL_BEHAVIOR_MISSING", token);
assert(!sharedJs.includes("compass.carousel.js"), "RETIRED_CAROUSEL_SELECTED");

const sharedCss = read("products/archcoin/carousel.css");
for (const token of ["@media (max-width: 760px)", "prefers-reduced-motion", "touch-action: pan-y", ".carousel-plane[hidden]"])
  assert(sharedCss.includes(token), "DISPLAY_CONTINUITY_MISSING", token);

let planeCount = 0;
let redirectCount = 0;
for (const domain of DOMAINS) {
  const pagePath = `products/archcoin/${domain.id}/index.html`;
  const html = read(pagePath);
  assert(html.includes(`data-domain="${domain.id}"`), "DOMAIN_IDENTITY_MISSING", domain.id);
  assert(html.includes(domain.symbol) && html.includes(domain.name), "TOKEN_IDENTITY_MISSING", domain.id);
  assert(occurrences(html, "data-carousel-tab") === 4, "TAB_COUNT_MISMATCH", domain.id);
  assert(occurrences(html, "data-carousel-plane=") === 4, "PLANE_COUNT_MISMATCH", domain.id);
  assert(html.includes('role="tablist"') && occurrences(html, 'role="tabpanel"') === 4, "ARIA_CONTRACT_MISSING", domain.id);
  assert(html.includes("Signed transaction qualified") && html.includes("Sepolia pending"), "STATUS_SPINE_MISSING", domain.id);
  assert(html.includes("Solidity 0.8.28") && html.includes("OpenZeppelin Contracts 5.4.0"), "ENGINEERING_DETAIL_MISSING", domain.id);
  assert(html.includes("18 decimal places") && html.includes("Hardhat 2.28.0"), "EVM_DETAIL_MISSING", domain.id);
  assert(html.includes("No post-deployment mint") && html.includes("No privileged token mutation"), "GOVERNANCE_CONSTRAINT_MISSING", domain.id);
  assert(!/0x[a-fA-F0-9]{40}/.test(html), "UNSUPPORTED_CONTRACT_ADDRESS", domain.id);
  for (const plane of PLANES) {
    assert(html.includes(`data-carousel-plane="${plane}"`), "PLANE_ID_MISSING", `${domain.id}/${plane}`);
    const legacyPath = `products/archcoin/${domain.id}/${plane}/index.html`;
    const legacy = read(legacyPath);
    const target = `../#${plane}`;
    assert(legacy.includes(`rel="canonical" href="${target}"`), "LEGACY_CANONICAL_MISMATCH", legacyPath);
    assert(legacy.includes(`content="0; url=${target}"`), "LEGACY_REDIRECT_MISMATCH", legacyPath);
    assert(legacy.includes(`href="${target}"`), "LEGACY_FALLBACK_MISSING", legacyPath);
    planeCount += 1;
    redirectCount += 1;
  }
}

const rootHtml = read("products/archcoin/index.html");
const rootController = read("products/archcoin/index.controller.js");
for (const domain of DOMAINS) {
  for (const plane of PLANES) {
    const target = `/products/archcoin/${domain.id}/#${plane}`;
    assert(rootHtml.includes(target), "ROOT_HTML_ROUTE_MISSING", target);
    assert(rootController.includes(target), "ROOT_CONTROLLER_ROUTE_MISSING", target);
    const retired = `/products/archcoin/${domain.id}/${plane}/`;
    assert(!rootHtml.includes(`data-route="${retired}"`), "ROOT_HTML_RETIRED_ROUTE", retired);
    assert(!rootController.includes(`route: "${retired}"`), "ROOT_CONTROLLER_RETIRED_ROUTE", retired);
  }
}

assert(!changed.some(item => item.startsWith("economy/archcoin/")), "EVM_IMPLEMENTATION_MUTATED");
assert(!changed.some(item => item.startsWith("assets/compass/")), "SHARED_COMPASS_RUNTIME_MUTATED");

const receipt = {
  schema: "ARCHCOIN_CAROUSEL_PRESENTATION_VERIFICATION_RECEIPT_v1",
  result: "PASS_CLOSED",
  governingHead: BASE,
  candidate: head === BASE ? "WORKTREE_PRECOMMIT" : head,
  changedPathCount: changed.length,
  changedPathsExact: true,
  domainDestinationCount: DOMAINS.length,
  semanticPlaneCount: planeCount,
  legacyDeepLinkCount: redirectCount,
  carouselContract: "SITE_CONTINUITY_V3_ONE_STAGE_TABS_SWIPE_KEYBOARD",
  networkBoundary: "SEPOLIA_PENDING",
  cryptocurrencyClaimAllowed: false,
  evmImplementationMutated: false,
  sharedCompassRuntimeMutated: false
};
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
