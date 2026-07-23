import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shell = path.join(root, "prototypes/universal-compass");
const out = path.join(root, ".audit-output");

const expected = {
  "index.planet.js": "0d462361776288b88584a7272c8e42ea6b14f1fa",
  "index.crystals.js": "0bdf6bd08732d72935192dc211014cf7ec84dc15",
  "index.compositor.js": "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8",
  "index.controller.js": "7eae298304d53c711adc1714fbc44dcd94f6b065",
  "index.interactions.js": "cf06c107a23115a809826b949e306e5c810e60f0",
  "index.html": "cd1abe75ba93e5733514ad378f52223ec53805b2",
  "index.css": "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa"
};

const read = name => fs.readFileSync(path.join(shell, name), "utf8");
const sources = Object.fromEntries(Object.keys(expected).map(name => [name, read(name)]));
const jsFiles = Object.keys(expected).filter(name => name.endsWith(".js"));

const blobChecks = Object.entries(expected).map(([name, expectedSha]) => {
  const result = spawnSync("git", ["hash-object", path.join(shell, name)], {
    cwd: root,
    encoding: "utf8"
  });
  const actualSha = result.stdout.trim();
  return { name, expectedSha, actualSha, pass: result.status === 0 && actualSha === expectedSha };
});

const edges = [];
for (const name of jsFiles) {
  for (const match of sources[name].matchAll(/(?:from\s+|import\s*)["'](\.\.?\/[^"']+)["']/g)) {
    const resolvedPath = path.resolve(shell, match[1]);
    edges.push({
      from: name,
      specifier: match[1],
      resolved: path.relative(root, resolvedPath),
      exists: fs.existsSync(resolvedPath)
    });
  }
}
for (const match of sources["index.html"].matchAll(/(?:src|href)=["'](\.\/[^"']+)["']/g)) {
  const resolvedPath = path.resolve(shell, match[1]);
  edges.push({
    from: "index.html",
    specifier: match[1],
    resolved: path.relative(root, resolvedPath),
    exists: fs.existsSync(resolvedPath)
  });
}

const missing = [...new Set(edges.filter(edge => !edge.exists).map(edge => edge.resolved))].sort();
const expectedMissing = [
  "prototypes/universal-compass/compass.contracts.js",
  "prototypes/universal-compass/compass.math.js",
  "prototypes/universal-compass/index.js"
].sort();

const dynamicImports = jsFiles.map(name => {
  const expression = `import(${JSON.stringify(`./prototypes/universal-compass/${name}`)})`;
  const result = spawnSync(process.execPath, ["--input-type=module", "--eval", expression], {
    cwd: root,
    encoding: "utf8"
  });
  return {
    name,
    loaded: result.status === 0,
    status: result.status,
    output: `${result.stderr || ""}\n${result.stdout || ""}`.trim().split("\n").slice(0, 12).join("\n")
  };
});

const crystalPublic = sources["index.crystals.js"].slice(
  sources["index.crystals.js"].lastIndexOf("return Object.freeze({")
);
const authorityExports = {
  planet: /export function createWorldAuthority\s*\(/.test(sources["index.planet.js"]),
  crystals: /export function createGeometryAuthority\s*\(/.test(sources["index.crystals.js"]),
  compositor: /export function createCompositor\s*\(/.test(sources["index.compositor.js"]),
  controller: /export function createCompassController\s*\(/.test(sources["index.controller.js"]),
  interactions: /export function createInteractionAuthority\s*\(/.test(sources["index.interactions.js"])
};
const interfaceFindings = {
  planetRequiresNodesForPresentation: /typeof nodes\.forPresentation === ["']function["']/.test(sources["index.planet.js"]),
  controllerRequiresNodesGetAndHas: /typeof nodes\.get === ["']function["']/.test(sources["index.controller.js"]) && /typeof nodes\.has === ["']function["']/.test(sources["index.controller.js"]),
  crystalsPublicApiHasGetNode: /\bgetNode\b/.test(crystalPublic),
  crystalsPublicApiHasForPresentation: /\bforPresentation\b/.test(crystalPublic),
  crystalsPublicApiHasHas: /\bhas\b/.test(crystalPublic),
  crystalsConsumesWorldSnapshot: /consumeWorldSnapshot|worldSnapshot/.test(sources["index.crystals.js"]),
  compositorConsumesValidatedWorldSnapshot: /validateWorldSnapshot\(worldSnapshot\)/.test(sources["index.compositor.js"]),
  interactionsSubmitWorldEvaluatedProposal: /world\.evaluateOrientationProposal/.test(sources["index.interactions.js"])
};

const moduleFailuresAreMissingSupport = dynamicImports.every(result =>
  !result.loaded && /ERR_MODULE_NOT_FOUND|compass\.contracts\.js/.test(result.output)
);
const interfaceClosureBlocked =
  interfaceFindings.planetRequiresNodesForPresentation &&
  interfaceFindings.controllerRequiresNodesGetAndHas &&
  interfaceFindings.crystalsPublicApiHasGetNode &&
  !interfaceFindings.crystalsPublicApiHasForPresentation &&
  !interfaceFindings.crystalsPublicApiHasHas &&
  !interfaceFindings.crystalsConsumesWorldSnapshot;
const crossProjectIntrusion = Object.entries(sources)
  .filter(([, source]) => /h-earth|project-awareness/i.test(source))
  .map(([name]) => name);
const pass =
  blobChecks.every(check => check.pass) &&
  JSON.stringify(missing) === JSON.stringify(expectedMissing) &&
  Object.values(authorityExports).every(Boolean) &&
  moduleFailuresAreMissingSupport &&
  interfaceClosureBlocked &&
  crossProjectIntrusion.length === 0;

const receipt = {
  schema: "UNIVERSAL_COMPASS_SEVEN_FILE_SHELL_AUDIT_RECEIPT_v2",
  auditStatus: pass ? "PASS_FINDINGS_GROUNDED" : "FAIL_AUDIT_INCONSISTENT",
  prototypeStatus: "NOT_EXECUTABLE",
  executionBoundary: "MODULE_RESOLUTION",
  shellFileCount: Object.keys(expected).length,
  shellBlobIdentityPass: blobChecks.every(check => check.pass),
  authorityExports,
  dependencyEdges: edges,
  missingDependencies: missing,
  exactMissingDependencySet: JSON.stringify(missing) === JSON.stringify(expectedMissing),
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
  recommendedNextTarget: "UNIVERSAL_COMPASS_RUNTIME_DEPENDENCY_AND_INTERFACE_CLOSURE_CANDIDATE_v1"
};

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "universal-compass-shell-audit-receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({
  auditStatus: receipt.auditStatus,
  prototypeStatus: receipt.prototypeStatus,
  executionBoundary: receipt.executionBoundary,
  missingDependencies: receipt.missingDependencies,
  moduleFailuresAreMissingSupport: receipt.moduleFailuresAreMissingSupport,
  interfaceClosureBlocked: receipt.interfaceClosureBlocked,
  crossProjectIntrusionCount: receipt.crossProjectIntrusion.length,
  recommendedNextTarget: receipt.recommendedNextTarget
}, null, 2));
if (!pass) process.exitCode = 1;
