import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractCatalogFromSourceText } from "./catalog-source.mjs";
import { buildSpatialRegistry } from "./descriptor-registry.mjs";
import { validateSpatialRegistry } from "./descriptor-schema.mjs";
import { resolveSceneState } from "./resolver.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const sourcePath = path.join(root, "laws/research/methods-and-models/showroom.js");
const outDir = process.env.OUT_DIR ? path.resolve(root, process.env.OUT_DIR) : path.join(here, "validation-output");

await fs.mkdir(outDir, { recursive: true });
const source = await fs.readFile(sourcePath, "utf8");
const catalog = extractCatalogFromSourceText(source);
const registry = buildSpatialRegistry(catalog);
const validation = validateSpatialRegistry(registry);

const firstFamily = catalog[0];
const firstModel = firstFamily.models[0];
const nativeState = Object.freeze({
  x: Object.freeze({ index: 0, count: firstFamily.models.length, modelId: firstModel.id }),
  y: Object.freeze({ index: 0, count: 3, lens: "practical" }),
  z: Object.freeze({ index: 0, count: catalog.length, familyId: firstFamily.id }),
  display: "expanded"
});
const overview = resolveSceneState({ registry, nativeState, cameraMode: "overview", inspectionOpen: false, viewport: { width: 1440, height: 1000 } });
const browse = resolveSceneState({ registry, nativeState, cameraMode: "browse", inspectionOpen: false, viewport: { width: 1440, height: 1000 } });
const mobile = resolveSceneState({ registry, nativeState, cameraMode: "browse", inspectionOpen: false, viewport: { width: 360, height: 800 } });
const engineering = resolveSceneState({
  registry,
  nativeState: Object.freeze({ ...nativeState, y: Object.freeze({ index: 1, count: 3, lens: "engineering" }) }),
  cameraMode: "browse",
  inspectionOpen: false,
  viewport: { width: 1440, height: 1000 }
});

const practicalActive = browse.nodes.find(node => node.active);
const engineeringActive = engineering.nodes.find(node => node.active);
const operationalChecks = Object.freeze({
  exactFamilyCount: registry.familyCount === 4,
  exactModelCount: registry.modelCount === 25,
  exactLensCount: registry.lensCount === 3,
  allNativeModelsResolveOnce: new Set(registry.descriptors.map(item => item.modelId)).size === registry.modelCount,
  overviewBrowseTargetsDiffer: JSON.stringify(overview.camera) !== JSON.stringify(browse.camera),
  overviewTracksActiveHorizontalPosition: overview.camera.target[0] === browse.activeDescriptor.fieldPosition[0],
  activeModelFullDetail: practicalActive?.detailClass === "FULL",
  perceptibleNeighborsPresent: browse.nodes.filter(node => node.lifecycle === "NEAR_NEIGHBOR" && node.visible).length >= 2,
  distantCorpusPresent: overview.nodes.some(node => node.lifecycle === "DISTANT_CORPUS" && node.visible),
  lensSpatialRelationChanges: JSON.stringify(practicalActive?.position) !== JSON.stringify(engineeringActive?.position) && JSON.stringify(browse.camera) !== JSON.stringify(engineering.camera),
  mobileDetailReduced: mobile.visibleCluster.length < browse.visibleCluster.length,
  optionalExpressionSlotsNonblocking: registry.descriptors.every(item => item.materialProfileSlot && item.atmosphereProfileSlot)
});

const result = Object.freeze({
  contract: "METHODS_MODELS_CATEGORICAL_SPATIAL_TEMPLATE_VALIDATION_v1",
  registryContract: registry.contract,
  validation,
  operationalChecks,
  result: validation.valid && Object.values(operationalChecks).every(Boolean) ? "PASS_OPERATIONAL_REGISTRY_AND_RESOLVER" : "FAIL",
  productAcceptanceGranted: false
});

await fs.writeFile(path.join(outDir, "methods-models-spatial-descriptor-registry-v1.generated.json"), `${JSON.stringify(registry, null, 2)}\n`);
await fs.writeFile(path.join(outDir, "validation-result.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (result.result !== "PASS_OPERATIONAL_REGISTRY_AND_RESOLVER") process.exitCode = 1;
