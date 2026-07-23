import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shellRoot = path.join(repositoryRoot, "prototypes/universal-compass");
const outputRoot = path.join(repositoryRoot, ".audit-output");

const expectedShell = Object.freeze({
  "index.planet.js": "0d462361776288b88584a7272c8e42ea6b14f1fa",
  "index.crystals.js": "0bdf6bd08732d72935192dc211014cf7ec84dc15",
  "index.compositor.js": "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8",
  "index.controller.js": "7eae298304d53c711adc1714fbc44dcd94f6b065",
  "index.interactions.js": "cf06c107a23115a809826b949e306e5c810e60f0",
  "index.html": "cd1abe75ba93e5733514ad378f52223ec53805b2",
  "index.css": "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa"
});

const jsFiles = Object.keys(expectedShell).filter(name => name.endsWith(".js"));
const allSources = Object.fromEntries(
  Object.keys(expectedShell).map(name => [
    name,
    fs.readFileSync(path.join(shellRoot, name), "utf8")
  ])
);

function gitBlobSha(filePath) {
  const result = spawnSync("git", ["hash-object", filePath], {
    cwd: repositoryRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(`GIT_HASH_OBJECT_FAILED:${filePath}:${result.stderr}`);
  }
  return result.stdout.trim();
}

function relativeImports(source) {
  const imports = [];
  const pattern = /(?:from\s+|import\s*)["'](\.\.?\/[^"']+)["']/g;
  for (const match of source.matchAll(pattern)) imports.push(match[1]);
  return imports;
}

function localHtmlReferences(source) {
  const refs = [];
  const pattern = /(?:src|href)=["'](\.\/[^"']+)["']/g;
  for (const match of source.matchAll(pattern)) refs.push(match[1]);
  return refs;
}

function dynamicImportResult(fileName) {
  const script = `import(${JSON.stringify(`./prototypes/universal-compass/${fileName}`)})`;
  const result = spawnSync(
    process.execPath,
    ["--experimental-default-type=module", "--input-type=module", "--eval", script],
    { cwd: repositoryRoot, encoding: "utf8" }
  );
  const text = `${result.stderr || ""}\n${result.stdout || ""}`.trim();
  return Object.freeze({
    fileName,
    status: result.status,
    loaded: result.status === 0,
    output: text.split("\n").slice(0, 10).join("\n")
  });
}

const blobChecks = Object.entries(expectedShell).map(([fileName, expected]) => {
  const actual = gitBlobSha(path.join(shellRoot, fileName));
  return Object.freeze({ fileName, expected, actual, pass: actual === expected });
});

const dependencyEdges = [];
for (const fileName of jsFiles) {
  for (const specifier of relativeImports(allSources[fileName])) {
    const resolved = path.resolve(shellRoot, specifier);
    dependencyEdges.push(Object.freeze({
      from: fileName,
      specifier,
      resolved: path.relative(repositoryRoot, resolved),
      exists: fs.existsSync(resolved)
    }));
  }
}

const htmlReferences = localHtmlReferences(allSources["index.html"]).map(specifier => {
  const resolved = path.resolve(shellRoot, specifier);
  return Object.freeze({
    from: "index.html",
    specifier,
    resolved: path.relative(repositoryRoot, resolved),
    exists: fs.existsSync(resolved)
  });
});

const missingDependencies = [...dependencyEdges, ...htmlReferences]
  .filter(edge => !edge.exists)
  .map(edge => edge.resolved)
  .filter((value, index, values) => values.indexOf(value) === index)
  .sort();

const expectedMissingDependencies = [
  "prototypes/universal-compass/compass.contracts.js",
  "prototypes/universal-compass/compass.math.js",
  "prototypes/universal-compass/index.js"
].sort();

const authorityExports = Object.freeze({
  planet: /export function createWorldAuthority\s*\(/.test(allSources["index.planet.js"]),
  crystals: /export function createGeometryAuthority\s*\(/.test(allSources["index.crystals.js"]),
  compositor: /export function createCompositor\s*\(/.test(allSources["index.compositor.js"]),
  controller: /export function createCompassController\s*\(/.test(allSources["index.controller.js"]),
  interactions: /export function createInteractionAuthority\s*\(/.test(allSources["index.interactions.js"])
});

const crystalsSource = allSources["index.crystals.js"];
const crystalsPublicApiSource = crystalsSource.slice(
  crystalsSource.lastIndexOf("return Object.freeze({")
);

const interfaceFindings = Object.freeze({
  planetRequiresNodesForPresentation:
    /typeof nodes\.forPresentation === ["']function["']/.test(allSources["index.planet.js"]),
  controllerRequiresNodesGetAndHas:
    /typeof nodes\.get === ["']function["']/.test(allSources["index.controller.js"]) &&
    /typeof nodes\.has === ["']function["']/.test(allSources["index.controller.js"]),
  crystalsPublicApiHasGetNode: /\bgetNode\b/.test(crystalsPublicApiSource),
  crystalsPublicApiHasForPresentation: /\bforPresentation\b/.test(crystalsPublicApiSource),
  crystalsPublicApiHasHas: /\bhas\b/.test(crystalsPublicApiSource),
  crystalsConsumesWorldSnapshot: /consumeWorldSnapshot|worldSnapshot/.test(crystalsSource),
  compositorConsumesValidatedWorldSnapshot:
    /validateWorldSnapshot\(worldSnapshot\)/.test(allSources["index.compositor.js"]),
  interactionsSubmitWorldEvaluatedProposal:
    /world\.evaluateOrientationProposal/.test(allSources["index.interactions.js"])
});

const crossProjectTerms = /h-earth|project-awareness/i;
const crossProjectIntrusion = Object.entries(allSources)
  .filter(([, source]) => crossProjectTerms.test(source))
  .map(([fileName]) => fileName);

const dynamicImports = jsFiles.map(dynamicImportResult);
const moduleFailuresAreMissingSupport = dynamicImports.every(result =>
  !result.loaded && /compass\.contracts\.js|ERR_MODULE_NOT_FOUND/.test(result.output)
);

const exactMissingSet =
  JSON.stringify(missingDependencies) === JSON.stringify(expectedMissingDependencies);
const allBlobsMatch = blobChecks.every(check => check.pass);
const allAuthorityExportsPresent = Object.values(authorityExports).every(Boolean);
const interfaceClosureBlocked =
  interfaceFindings.planetRequiresNodesForPresentation &&
  interfaceFindings.controllerRequiresNodesGetAndHas &&
  interfaceFindings.crystalsPublicApiHasGetNode &&
  !interfaceFindings.crystalsPublicApiHasForPresentation &&
  !interfaceFindings.crystalsPublicApiHasHas &&
  !interfaceFindings.crystalsConsumesWorldSnapshot;

const auditPass =
  allBlobsMatch &&
  exactMissingSet &&
  allAuthorityExportsPresent &&
  moduleFailuresAreMissingSupport &&
  interfaceClosureBlocked &&
  crossProjectIntrusion.length === 0;

const receipt = Object.freeze({
  schema: "UNIVERSAL_COMPASS_SEVEN_FILE_SHELL_AUDIT_RECEIPT_v1",
  auditStatus: auditPass ? "PASS_FINDINGS_GROUNDED" : "FAIL_AUDIT_INCONSISTENT",
  prototypeStatus: "NOT_EXECUTABLE",
  executionBoundary: "MODULE_RESOLUTION",
  shellFileCount: Object.keys(expectedShell).length,
  shellBlobIdentityPass: allBlobsMatch,
  authorityExports,
  dependencyEdges,
  htmlReferences,
  missingDependencies,
  expectedMissingDependencies,
  exactMissingDependencySet: exactMissingSet,
  dynamicImports,
  moduleFailuresAreMissingSupport,
  interfaceFindings,
  interfaceClosureBlocked,
  crossProjectIntrusion,
  worldSnapshotProduced: false,
  projectionSnapshotProduced: false,
  controllerInteractionLoopExecuted: false,
  browserVisualAcceptance: false,
  productFilesMutatedByAudit: false,
  recommendedNextTarget:
    "UNIVERSAL_COMPASS_RUNTIME_DEPENDENCY_AND_INTERFACE_CLOSURE_CANDIDATE_v1"
});

fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(
  path.join(outputRoot, "universal-compass-shell-audit-receipt.json"),
  `${JSON.stringify(receipt, null, 2)}\n`,
  "utf8"
);

console.log(`AUDIT_STATUS=${receipt.auditStatus}`);
console.log(`PROTOTYPE_STATUS=${receipt.prototypeStatus}`);
console.log(`EXECUTION_BOUNDARY=${receipt.executionBoundary}`);
console.log(`MISSING_DEPENDENCIES=${receipt.missingDependencies.join(",")}`);
console.log(`INTERFACE_CLOSURE_BLOCKED=${receipt.interfaceClosureBlocked}`);
console.log(`CROSS_PROJECT_INTRUSION_COUNT=${receipt.crossProjectIntrusion.length}`);
console.log(`RECOMMENDED_NEXT_TARGET=${receipt.recommendedNextTarget}`);

if (!auditPass) process.exitCode = 1;
