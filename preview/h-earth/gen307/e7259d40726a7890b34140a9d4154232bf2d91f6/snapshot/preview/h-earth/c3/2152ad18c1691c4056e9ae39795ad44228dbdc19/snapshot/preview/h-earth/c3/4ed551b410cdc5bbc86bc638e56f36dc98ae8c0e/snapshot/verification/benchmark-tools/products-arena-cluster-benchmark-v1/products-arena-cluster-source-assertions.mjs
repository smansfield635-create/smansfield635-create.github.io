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

const [html, arenaCss, compassCss, controller, crystals, planet, compositor] = await Promise.all([
  read("products/index.html"),
  read("products/index.arena.css"),
  read("products/index.compass.css"),
  read("products/index.controller.js"),
  read("products/index.crystals.js"),
  read("products/index.planet.js"),
  read("products/index.compositor.js")
]);

const centerControlStart = html.indexOf('<button type="button" class="products-compass-control"');
const centerControlEnd = html.indexOf("</button>", centerControlStart);
const centerControlMarkup = centerControlStart >= 0 && centerControlEnd > centerControlStart
  ? html.slice(centerControlStart, centerControlEnd + "</button>".length)
  : "";

const assertions = {
  toolIdentity: TOOL_ID === "PRODUCTS_ARENA_CLUSTER_BENCHMARK_v1",
  productCountExact: count(html, /data-products-product(?=[\s>])/g) === 6,
  cardinalCountExact: count(html, /data-products-cardinal/g) === 0,
  allSixRoutesPreserved: PRODUCTS.every(product =>
    html.includes(`data-product-id="${product.id}"`) &&
    html.includes(`data-route="${product.route}"`)
  ),
  singleCenterControl:
    count(html, /data-products-center-control/g) === 1 &&
    count(html, /data-upstream-compass-control/g) === 1,
  centerDisclosureSemantics:
    centerControlMarkup.includes('data-products-center-role="MAIN_COMPASS_RETURN_DISCLOSURE"') &&
    centerControlMarkup.includes('data-products-compass-semantic-model') === false &&
    centerControlMarkup.includes('aria-label="Open Main Compass return options"') &&
    centerControlMarkup.includes('aria-controls="products-context"') &&
    centerControlMarkup.includes('aria-expanded="false"'),
  renderedGlobeOwnedByCenterControl:
    centerControlMarkup.includes("data-products-planet-mount") &&
    centerControlMarkup.includes("data-products-compass-visual-mount") &&
    centerControlMarkup.indexOf("data-products-planet-mount") < centerControlMarkup.lastIndexOf("</button>"),
  globeRemainsVisualOnly:
    centerControlMarkup.includes('data-products-compass-visual-only="true"') &&
    centerControlMarkup.includes('data-products-compass-pointer-authority="false"') &&
    centerControlMarkup.includes('aria-hidden="true"'),
  explicitReturnOption:
    html.includes("data-products-return-main-compass") &&
    html.includes('href="/"') &&
    html.includes("Return to Main Compass"),
  controllerOwnsDisclosure:
    controller.includes("function setCenterDisclosure(open)") &&
    controller.includes("state.centerDisclosureOpen = Boolean(open) && centerStateAllowed()") &&
    controller.includes('state.centerControl.setAttribute(\n        "aria-expanded"'),
  singleTapDisclosureContract:
    controller.includes("function requestCompassSelection(event)") &&
    controller.includes("setCenterDisclosure(true)") &&
    controller.includes('lastAction: "compass-selected-local"'),
  explicitReturnNavigation:
    controller.includes("function requestReturnToMainCompass(event)") &&
    controller.includes("globalThis.location.assign(CENTER_CONTINUITY.route)") &&
    count(controller, /globalThis\.location\.assign/g) === 2,
  noSecondProductsAuthority:
    count(controller, /const CONTROLLER_SYMBOL = "DGB_PRODUCTS_CONTROLLER"/g) === 1 &&
    !compassCss.includes("animation:") &&
    count(html, /data-products-center-control/g) === 1,
  archcoinControlAffordance:
    compassCss.includes(".products-compass-control:hover") &&
    compassCss.includes('.products-compass-control[aria-expanded="true"]') &&
    compassCss.includes("brightness(1.08)") &&
    compassCss.includes("drop-shadow(0 0 14px rgba(234, 208, 131, .16))"),
  keyboardFocusAffordance:
    compassCss.includes(".products-compass-control:focus-visible") &&
    compassCss.includes("outline: 3px solid rgba(234, 208, 131, .92)") &&
    compassCss.includes("outline-offset: 4px"),
  sharedCenterSize:
    arenaCss.includes("--products-center-size: clamp(4.5rem, 9vw, 7rem)") &&
    count(arenaCss, /width:\s*var\(--products-center-size\)/g) === 2,
  mobileSizeAuthority:
    arenaCss.includes("--products-center-size: clamp(4.25rem, 18vw, 5.5rem)"),
  touchFootprintMatchesVisiblePlanet:
    count(arenaCss, /width:\s*var\(--products-center-size\)/g) === 2,
  planetVisualAuthorityPreserved:
    planet.includes("ownsNavigation: false") &&
    planet.includes("fallback: false") &&
    !planet.includes("location.assign"),
  compositorArchitecturePreserved:
    compositor.includes("function beginFrame") &&
    compositor.includes("function partitionNodes") &&
    compositor.includes("rearTarget") &&
    compositor.includes("frontTarget"),
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
    gitBlobSha(controller) === "3bf31e29f6743a8660b12a30c5fb56d087ca3199",
  crystalsAnchorBlobPreserved:
    gitBlobSha(crystals) === "db6889500dccab53365a564feb1aa96f34b4200d"
};

const failures = Object.entries(assertions)
  .filter(([, pass]) => !pass)
  .map(([id]) => id);

const receipt = {
  tool: TOOL_ID,
  checkpoint: "PRODUCTS_ARENA_CLUSTER_ACCEPTED_COMPASS_CONTINUITY_CHECKPOINT_4",
  classification: "ACCEPTED_COMPASS_SOURCE_ASSERTIONS",
  anchors: {
    controllerGitBlob: "3bf31e29f6743a8660b12a30c5fb56d087ca3199",
    crystalsGitBlob: "db6889500dccab53365a564feb1aa96f34b4200d"
  },
  contract: {
    oneCenterControl: true,
    renderedGlobeInsideControl: true,
    accessibleName: "Open Main Compass return options",
    disclosureBeforeNavigation: true,
    explicitReturnNavigation: true,
    archcoinAffordanceModel: true,
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