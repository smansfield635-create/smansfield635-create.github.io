import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { PRODUCTS, TOOL_ID } from "./products-arena-cluster-benchmark.config.mjs";

const root = process.cwd();
const read = relative => fs.readFile(path.join(root, relative), "utf8");
const gitBlobSha = text => {
  const content = Buffer.from(text, "utf8");
  return crypto
    .createHash("sha1")
    .update(`blob ${content.length}\0`)
    .update(content)
    .digest("hex");
};
const count = (text, pattern) => (text.match(pattern) || []).length;

const [html, arenaCss, controller, crystals, planet, center] = await Promise.all([
  read("products/index.html"),
  read("products/index.arena.css"),
  read("products/index.controller.js"),
  read("products/index.crystals.js"),
  read("products/index.planet.js"),
  read("products/index.controller.center.js")
]);

const assertions = {
  toolIdentity: TOOL_ID === "PRODUCTS_ARENA_CLUSTER_BENCHMARK_v1",
  productCountExact: count(html, /data-products-product(?=[\s>])/g) === 6,
  cardinalCountExact: count(html, /data-products-cardinal/g) === 0,
  allSixRoutesPreserved: PRODUCTS.every(product =>
    html.includes(`data-product-id="${product.id}"`) &&
    html.includes(`data-route="${product.route}"`)
  ),
  centerDisclosureSemantics:
    html.includes('data-products-center-role="MAIN_COMPASS_RETURN_DISCLOSURE"') &&
    html.includes('aria-controls="products-context"') &&
    html.includes('aria-expanded="false"'),
  explicitReturnOption:
    html.includes('data-products-return-main-compass') &&
    html.includes('href="/"') &&
    html.includes('Return to Main Compass'),
  singleTapDisclosureContract:
    center.includes("activateDisclosure(event, \"single-tap\")") &&
    center.includes("setDisclosure(!state.disclosureOpen") &&
    !center.includes('lastAction: "main-compass-navigation-requested"'),
  secondSingleTapClosesDisclosure:
    center.includes("setDisclosure(!state.disclosureOpen") &&
    center.includes('aria-expanded", state.disclosureOpen ? "true" : "false"'),
  explicitReturnNavigation:
    center.includes('navigateToMainCompass("explicit-main-compass-navigation-requested"') &&
    count(center, /location\.assign/g) === 1,
  doubleTapBounded:
    center.includes("const DOUBLE_TAP_WINDOW_MS = 300") &&
    center.includes('navigateToMainCompass("double-tap-main-compass-navigation-requested"'),
  movementCancellation:
    center.includes("const TAP_MAX_MOVEMENT_PX = 10") &&
    center.includes('lastAction: "center-tap-cancelled-for-drag"'),
  pointerCancelClearsPendingTap:
    center.includes("function onPointerCancel") &&
    center.includes("state.lastTapAt = 0") &&
    center.includes('lastAction: "center-pointer-cancelled"'),
  noSecondProductsAuthority:
    center.includes("createsSecondController: false") &&
    center.includes("ownsProductRegistry: false") &&
    center.includes("ownsGesture: false") &&
    center.includes("ownsCanvas: false") &&
    center.includes("ownsAnimationLoop: false"),
  sharedCenterSize:
    arenaCss.includes("--products-center-size: clamp(4.5rem, 9vw, 7rem)") &&
    count(arenaCss, /width:\s*var\(--products-center-size\)/g) === 2,
  mobileSizeAuthority:
    arenaCss.includes("--products-center-size: clamp(4.25rem, 18vw, 5.5rem)"),
  oversizedGoldenRingAbsent:
    !arenaCss.includes("inset: -8px") &&
    arenaCss.includes(".products-center-control:focus-visible::after") &&
    arenaCss.includes("inset: .18rem"),
  touchFootprintMatchesVisiblePlanet:
    count(arenaCss, /width:\s*var\(--products-center-size\)/g) === 2,
  planetVisualAuthorityPreserved:
    planet.includes("ownsNavigation: false") &&
    planet.includes("fallback: false") &&
    !planet.includes("location.assign"),
  quickFlickSourcePreserved:
    crystals.includes("CLUSTER_FLICK_RETURN") &&
    crystals.includes("requestControllerReturnToConstellation"),
  dragAndSettlementSourcePreserved:
    crystals.includes("requestControllerClusterCommit") &&
    crystals.includes("settledClusterQuaternion"),
  oneFrontmostLabelResolverPreserved:
    crystals.includes("function nearestPrimaryProduct") &&
    crystals.includes('element.dataset.primary = primary ? "true" : "false"'),
  controllerAnchorBlobPreserved:
    gitBlobSha(controller) === "3eb38cc35a88936b884891d3dfe735a71583bf34",
  crystalsAnchorBlobPreserved:
    gitBlobSha(crystals) === "6622f9cfd9e44589cf0e94119697256385f1317d"
};

const failures = Object.entries(assertions)
  .filter(([, pass]) => !pass)
  .map(([id]) => id);

const receipt = {
  tool: TOOL_ID,
  checkpoint: "PRODUCTS_ARENA_CLUSTER_CORRECTIVE_CONTINUITY_CHECKPOINT_3",
  classification: "CORRECTIVE_CONTINUITY_SOURCE_ASSERTIONS",
  anchors: {
    controllerGitBlob: "3eb38cc35a88936b884891d3dfe735a71583bf34",
    crystalsGitBlob: "6622f9cfd9e44589cf0e94119697256385f1317d"
  },
  contract: {
    singleTapDisclosure: true,
    secondSingleTapClose: true,
    explicitReturnNavigation: true,
    doubleTapWindowMs: 300,
    tapMaximumMovementPx: 10,
    sharedPlanetControlSize: true,
    mobileSizeAuthority: "clamp(4.25rem, 18vw, 5.5rem)",
    desktopSizeAuthority: "clamp(4.5rem, 9vw, 7rem)",
    productCount: 6,
    cardinalCount: 0,
    visiblePrimaryLabelCount: 1,
    horizontalOverflowMaximum: 0
  },
  assertions,
  failures,
  pass: failures.length === 0
};

console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
