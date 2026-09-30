#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCHEMA = "ARCHCOIN_CAROUSEL_CONVERSION_MAP_VERIFICATION_RECEIPT_v1";
const GOVERNING_HEAD = "226c31e40d5eb323cd8c016fa1f3c7936cb75d49";
const COMPLETE_GENERATION = "a550aa1471971c1e9d9acd9e009b23293091cb70";
const MAP_PATH = "products/archcoin/carousel-conversion-map.v1.json";
const VERIFIER_PATH = "products/archcoin/verify-carousel-conversion-map.v1.mjs";
const ALLOWED_PATHS = [MAP_PATH, VERIFIER_PATH];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function git(args, { allowFailure = false } = {}) {
  const run = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (run.status !== 0 && !allowFailure) {
    throw new Error(`GIT_COMMAND_FAILED:${args.join(" ")}:${run.stderr.trim()}`);
  }
  return { status: run.status, stdout: run.stdout.trim(), stderr: run.stderr.trim() };
}

function fail(code, detail = null) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
}

function check(condition, code, detail = null) {
  if (!condition) fail(code, detail);
}

function blob(ref, repositoryPath) {
  return git(["rev-parse", `${ref}:${repositoryPath}`]).stdout;
}

function changedPaths() {
  const head = git(["rev-parse", "HEAD"]).stdout;
  if (head === GOVERNING_HEAD) {
    return git(["status", "--porcelain", "--untracked-files=all"]).stdout
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3))
      .sort();
  }
  const parents = git(["rev-list", "--parents", "-n", "1", "HEAD"]).stdout.split(" ");
  check(parents.length === 2, "CANDIDATE_PARENT_COUNT_INVALID", parents.length - 1);
  check(parents[1] === GOVERNING_HEAD, "GOVERNING_HEAD_MISMATCH", parents[1]);
  return git(["diff", "--name-only", `${GOVERNING_HEAD}..HEAD`]).stdout.split("\n").filter(Boolean).sort();
}

function verify() {
  const map = JSON.parse(fs.readFileSync(path.join(ROOT, MAP_PATH), "utf8"));
  check(map.schema === "ARCHCOIN_CAROUSEL_CONVERSION_MAP_v1", "MAP_SCHEMA_INVALID", map.schema);
  check(map.status === "FROZEN_PRECONSTRUCTION", "MAP_STATUS_INVALID", map.status);
  check(map.operation?.governingHead === GOVERNING_HEAD, "MAP_GOVERNING_HEAD_MISMATCH");
  check(map.sourceAuthority?.firstCompleteSixteenChamberGeneration === COMPLETE_GENERATION, "COMPLETE_GENERATION_MISMATCH");

  const changed = changedPaths();
  check(JSON.stringify(changed) === JSON.stringify([...ALLOWED_PATHS].sort()), "DECLARED_PATH_VIOLATION", changed);

  const expectedOrder = ["overview", "engineering", "platform", "governance"];
  const expectedDomains = [
    ["contract", "ARCHCOIN Contract", "ARCC"],
    ["receivable", "ARCHCOIN Receivable", "ARCR"],
    ["payable", "ARCHCOIN Payable", "ARCP"],
    ["allocation", "ARCHCOIN Allocation", "ARCA"]
  ];
  check(map.carousels?.length === 4, "CONVERSION_MAP_DOMAIN_COUNT_INVALID", map.carousels?.length);

  let canonicalMatches = 0;
  let generationMatches = 0;
  let recoveryMatches = 0;
  for (let domainIndex = 0; domainIndex < expectedDomains.length; domainIndex += 1) {
    const [domain, asset, symbol] = expectedDomains[domainIndex];
    const carousel = map.carousels[domainIndex];
    check(carousel.domain === domain, "DOMAIN_ORDER_MISMATCH", carousel.domain);
    check(carousel.asset === asset, "ASSET_NAME_MISMATCH", carousel.asset);
    check(carousel.symbol === symbol, "ASSET_SYMBOL_MISMATCH", carousel.symbol);
    check(carousel.destinationRoute === `/products/archcoin/${domain}/`, "DESTINATION_ROUTE_MISMATCH", carousel.destinationRoute);
    check(carousel.legacyRoutePolicy === "PRESERVE_AND_DEEP_LINK_TO_EQUIVALENT_PLANE", "LEGACY_ROUTE_POLICY_MISMATCH");
    check(carousel.planes?.length === 4, "PLANE_COUNT_INVALID", `${domain}:${carousel.planes?.length}`);

    for (let planeIndex = 0; planeIndex < expectedOrder.length; planeIndex += 1) {
      const plane = carousel.planes[planeIndex];
      const planeId = expectedOrder[planeIndex];
      const expectedPath = `products/archcoin/${domain}/${planeId}/index.html`;
      check(plane.id === planeId, "PLANE_ORDER_MISMATCH", `${domain}:${plane.id}`);
      check(plane.ordinal === planeIndex + 1, "PLANE_ORDINAL_MISMATCH", `${domain}:${plane.ordinal}`);
      check(plane.sourcePath === expectedPath, "PLANE_SOURCE_PATH_MISMATCH", plane.sourcePath);
      check(plane.sourceRoute === `/products/archcoin/${domain}/${planeId}/`, "PLANE_SOURCE_ROUTE_MISMATCH", plane.sourceRoute);
      const governingBlob = blob(GOVERNING_HEAD, expectedPath);
      check(governingBlob === plane.sourceBlob, "CHAMBER_SOURCE_IDENTITY_MISMATCH", expectedPath);
      canonicalMatches += 1;
      check(blob(COMPLETE_GENERATION, expectedPath) === plane.sourceBlob, "COMPLETE_GENERATION_IDENTITY_MISMATCH", expectedPath);
      generationMatches += 1;
      check(blob(GOVERNING_HEAD, `h-earth-live-6d18e158/${expectedPath}`) === plane.sourceBlob, "RECOVERY_COPY_IDENTITY_MISMATCH", expectedPath);
      recoveryMatches += 1;
    }
  }

  check(canonicalMatches === 16, "CANONICAL_MATCH_COUNT_INVALID", canonicalMatches);
  check(generationMatches === 16, "GENERATION_MATCH_COUNT_INVALID", generationMatches);
  check(recoveryMatches === 16, "RECOVERY_MATCH_COUNT_INVALID", recoveryMatches);

  const selected = map.presentationPrecedent?.selected;
  const excluded = map.presentationPrecedent?.excluded;
  check(selected?.path === "assets/compass/compass.presentation-convergence.js", "CAROUSEL_PRECEDENT_PATH_INVALID");
  check(selected?.blob === blob(GOVERNING_HEAD, selected.path), "CAROUSEL_PRECEDENT_IDENTITY_MISMATCH");
  check(selected?.contract === "SITE_CONTINUITY_V3_ONE_STAGE_TABS_SWIPE_KEYBOARD", "CAROUSEL_PRECEDENT_CONTRACT_INVALID");
  check(excluded?.path === "assets/compass/compass.carousel.js", "RETIRED_CAROUSEL_PATH_INVALID");
  check(excluded?.blob === blob(GOVERNING_HEAD, excluded.path), "RETIRED_CAROUSEL_IDENTITY_MISMATCH");
  check(excluded?.reason === "EXPLICITLY_RETIRED_NON_AUTHORITATIVE_GENERIC_CAROUSEL", "RETIRED_CAROUSEL_NOT_EXCLUDED");

  const evm = map.fourAssetEvmBinding;
  check(evm?.adoptionHead === GOVERNING_HEAD, "EVM_ADOPTION_HEAD_MISMATCH");
  check(evm.chainFamily === "EVM" && evm.standard === "ERC-20" && evm.decimals === 18, "EVM_SEMANTICS_MISMATCH");
  check(evm.testNetwork === "Ethereum Sepolia" && evm.testNetworkChainId === 11155111, "SEPOLIA_BINDING_MISMATCH");
  check(evm.websiteStatusSpine?.attainedThrough === "SIGNED_TRANSACTION_QUALIFIED", "LOCAL_QUALIFICATION_BOUNDARY_MISMATCH");
  check(evm.websiteStatusSpine?.currentBoundary === "SEPOLIA_PENDING", "NETWORK_BOUNDARY_MISMATCH");
  check(evm.websiteStatusSpine?.cryptocurrencyClaimAllowed === false, "CRYPTOCURRENCY_CLAIM_AUTHORITY_LEAK");
  check(evm.websiteStatusSpine?.sepoliaContractAddresses?.length === 0, "UNSUPPORTED_SEPOLIA_ADDRESS_PRESENT");
  check(evm.websiteStatusSpine?.sepoliaTransactionHashes?.length === 0, "UNSUPPORTED_SEPOLIA_TRANSACTION_PRESENT");
  check(evm.websiteStatusSpine?.testnetDeploymentAuthorized === false, "TESTNET_AUTHORITY_LEAK");
  check(evm.websiteStatusSpine?.mainnetDeploymentAuthorized === false, "MAINNET_AUTHORITY_LEAK");

  for (const binding of Object.values(evm.sourceBlobs || {})) {
    check(binding.blob === blob(GOVERNING_HEAD, binding.path), "EVM_BINDING_IDENTITY_MISMATCH", binding.path);
  }
  const tokenLaw = JSON.parse(git(["show", `${GOVERNING_HEAD}:economy/archcoin/token-law.v1.json`]).stdout);
  check(tokenLaw.chainProfile?.network === "Ethereum Sepolia", "TOKEN_LAW_NETWORK_MISMATCH");
  check(tokenLaw.chainProfile?.testnetDeploymentAuthorized === false, "TOKEN_LAW_TESTNET_AUTHORITY_MISMATCH");
  check(tokenLaw.chainProfile?.mainnetDeploymentAuthorized === false, "TOKEN_LAW_MAINNET_AUTHORITY_MISMATCH");
  check(tokenLaw.assets?.map((asset) => asset.symbol).join(",") === "ARCC,ARCR,ARCP,ARCA", "TOKEN_LAW_ASSET_ORDER_MISMATCH");

  check(blob(GOVERNING_HEAD, "products/archcoin/index.html") === map.sourceAuthority.canonicalRouteBlob, "PUBLIC_ROUTE_IDENTITY_MISMATCH");
  check(map.constructionBoundary?.publicPresentationMutationIncluded === false, "PUBLIC_PRESENTATION_MUTATION_DECLARED");
  check(map.constructionBoundary?.carouselRuntimeConstructed === false, "CAROUSEL_RUNTIME_PREMATURELY_CLAIMED");
  check(map.constructionBoundary?.merged === false && map.constructionBoundary?.deployed === false && map.constructionBoundary?.published === false, "RELEASE_BOUNDARY_LEAK");

  return {
    schema: SCHEMA,
    result: "PASS_CLOSED",
    governingHead: GOVERNING_HEAD,
    candidateHead: git(["rev-parse", "HEAD"]).stdout,
    changedPaths: changed,
    canonicalChamberMatches: canonicalMatches,
    completeGenerationMatches: generationMatches,
    recoveryCopyMatches: recoveryMatches,
    domainCount: map.carousels.length,
    planeCount: map.carousels.reduce((sum, carousel) => sum + carousel.planes.length, 0),
    selectedCarouselContract: selected.contract,
    retiredGenericCarouselExcluded: true,
    currentStatusBoundary: evm.websiteStatusSpine.currentBoundary,
    cryptocurrencyClaimAllowed: false,
    publicPresentationBytesChanged: false,
    mergeAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    publicationAuthorityCreated: false,
    authorityEffect: "NONE_VERIFICATION_ONLY"
  };
}

try {
  process.stdout.write(`${JSON.stringify(verify(), null, 2)}\n`);
} catch (error) {
  process.stdout.write(`${JSON.stringify({
    schema: SCHEMA,
    result: "FAIL_CLOSED",
    errorCode: error.code || "UNEXPECTED_VERIFICATION_FAILURE",
    detail: error.detail || error.message,
    authorityEffect: "NONE_VERIFICATION_ONLY"
  }, null, 2)}\n`);
  process.exitCode = 1;
}
