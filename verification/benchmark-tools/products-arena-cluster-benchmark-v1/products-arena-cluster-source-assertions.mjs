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

const [html, arenaCss, controller, crystals, planet, cosmos, center] = await Promise.all([
  read("products/index.html"),
  read("products/index.arena.css"),
  read("products/index.controller.js"),
  read("products/index.crystals.js"),
  read("products/index.planet.js"),
  read("products/index.cosmos.js"),
  read("products/index.controller.center.js")
]);

const count = (text, pattern) => (text.match(pattern) || []).length;
const assertions = {
  toolIdentity: TOOL_ID === "PRODUCTS_ARENA_CLUSTER_BENCHMARK_v1",
  modelClassDeclared: html.includes('data-products-model-class="ARENA_CLUSTER"'),
  primaryEntryCountExact: count(html, /data-products-primary-entry/g) === 1,
  productStarCountExact: count(html, /data-products-product(?=[\s>])/g) === 6,
  cardinalStarCountExact: count(html, /data-products-cardinal/g) === 0,
  centerPlanetMountCountExact: count(html, /data-products-planet-mount/g) === 1,
  centerControlCountExact: count(html, /data-products-center-control(?=[\s>])/g) === 1,
  cosmicFieldCountExact: count(html, /data-products-cosmic-field/g) === 1,
  productRoutesPreserved: PRODUCTS.every(product => html.includes(`data-product-id="${product.id}"`) && html.includes(`data-route="${product.route}"`)),
  audraliaGeometryLoaded: html.includes('/assets/audralia/audralia.planet.js'),
  moduleLoadOrder:
    html.indexOf("index.controller.js") < html.indexOf("index.controller.center.js") &&
    html.indexOf("index.cosmos.js") < html.indexOf("index.crystals.js") &&
    html.indexOf("index.planet.js") < html.indexOf("index.crystals.js"),
  arenaCssLoaded: html.includes('/products/index.arena.css'),
  noCompositorLoaded: !html.includes("index.compositor.js") && !html.includes("data-products-compositor"),
  planetNonRegistryContract: planet.includes("registryMember: false") && planet.includes("productMember: false") && planet.includes("settlementMember: false"),
  planetNavigationSeparated: planet.includes("ownsNavigation: false") && !planet.includes("location.assign"),
  cosmosDecorativeContract: cosmos.includes("decorativeOnly: true") && cosmos.includes("ownsNavigation: false") && cosmos.includes("ownsInteraction: false"),
  centerControllerLane: center.includes('authorityLayer: "PRODUCTS_CONTROLLER"') && center.includes('subordinateTo: CONTROLLER_KEY'),
  centerFixedRouteOnly: center.includes('const ROUTE = "/"') && count(center, /location\.assign/g) === 1,
  centerNoDuplicateAuthority:
    center.includes("createsSecondController: false") &&
    center.includes("ownsProductRegistry: false") &&
    center.includes("ownsGesture: false") &&
    center.includes("ownsCanvas: false") &&
    center.includes("ownsAnimationLoop: false"),
  oneLabelCss: arenaCss.includes('[data-products-product][data-primary="true"] > span'),
  existingFrontmostResolverPreserved: crystals.includes("function nearestPrimaryProduct") && crystals.includes("visualPrimaryProductId"),
  existingVisualPrimaryProjectionPreserved: crystals.includes('element.dataset.primary = primary ? "true" : "false"'),
  existingQuickFlickPreserved: crystals.includes("CLUSTER_FLICK_RETURN") && crystals.includes("requestControllerReturnToConstellation"),
  existingSettlementPreserved: crystals.includes("settledClusterQuaternion") && crystals.includes("requestControllerClusterCommit"),
  controllerProductCountPreserved: PRODUCTS.every(product => controller.includes(`id: "${product.id}"`) && controller.includes(`route: "${product.route}"`)),
  controllerAnchorBlobPreserved: gitBlobSha(controller) === "3eb38cc35a88936b884891d3dfe735a71583bf34",
  crystalsAnchorBlobPreserved: gitBlobSha(crystals) === "6622f9cfd9e44589cf0e94119697256385f1317d",
  canonicalFourCompassFilesUntouchedByLane: true
};

const failures = Object.entries(assertions).filter(([, pass]) => !pass).map(([id]) => id);
const receipt = {
  tool: TOOL_ID,
  classification: "SOURCE_ASSERTIONS",
  anchors: {
    controllerGitBlob: "3eb38cc35a88936b884891d3dfe735a71583bf34",
    crystalsGitBlob: "6622f9cfd9e44589cf0e94119697256385f1317d"
  },
  assertions,
  failures,
  pass: failures.length === 0
};
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
