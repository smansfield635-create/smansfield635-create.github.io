import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "research/prototypes/laws-graphic-engineering-integration/PROGRAM.md",
  "research/prototypes/laws-graphic-engineering-integration/integration-manifest.json",
  "research/prototypes/laws-graphic-engineering-integration/shared/experience-runtime.js",
  "research/prototypes/laws-graphic-engineering-integration/shared/first-research-content.js",
  "research/prototypes/laws-graphic-engineering-integration/shared/first-research-webgl2.js",
  "research/prototypes/laws-graphic-engineering-integration/shared/first-research.css",
  "research/prototypes/laws-geometric-grammar-lab/slice-01-first-research.html",
  "research/prototypes/laws-geometric-grammar-lab/slice-01-first-research.js",
  "research/prototypes/laws-compass-page-delivery/index.html",
  "research/prototypes/laws-compass-page-delivery/styles.css",
  "research/prototypes/laws-compass-page-delivery/app.js",
  "research/prototypes/laws-compass-page-delivery/README.md"
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "research/prototypes/laws-graphic-engineering-integration/integration-manifest.json"), "utf8"));
if (manifest.program !== "LAWS_CHAMBER_GRAPHIC_ENGINEERING_INTEGRATION") throw new Error("Program identity mismatch.");
if (manifest.slice !== "SLICE_01_RESEARCH_COMES_FIRST_RELATIONSHIP") throw new Error("Slice identity mismatch.");
if (manifest.production_authorized !== false || manifest.protected_laws_mutation !== false) throw new Error("Production boundary is not closed.");

const componentIds = new Set(manifest.components.map((item) => item.component));
for (const id of ["FIRST_RESEARCH_CONTENT_RECORD", "FIRST_RESEARCH_SHARED_MECHANIC", "SHARED_EXPERIENCE_RUNTIME", "ACCEPTED_COMPASS_FRAME"]) {
  if (!componentIds.has(id)) throw new Error(`Missing integration component: ${id}`);
}

const contentSource = fs.readFileSync(path.join(root, "research/prototypes/laws-graphic-engineering-integration/shared/first-research-content.js"), "utf8");
for (const phrase of ["Research comes F.I.R.S.T.", "Flow", "Integrity", "Reality", "Structure", "Test", "Registration is not validation", "ORIENTATION_RELATIONSHIP_ONLY"]) {
  if (!contentSource.includes(phrase)) throw new Error(`Content boundary missing: ${phrase}`);
}

const sharedImport = "../laws-graphic-engineering-integration/shared/first-research-webgl2.js";
for (const file of [
  "research/prototypes/laws-geometric-grammar-lab/slice-01-first-research.js",
  "research/prototypes/laws-compass-page-delivery/app.js"
]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (!source.includes(sharedImport)) throw new Error(`${file} does not consume the shared mechanic.`);
}

const compassHtml = fs.readFileSync(path.join(root, "research/prototypes/laws-compass-page-delivery/index.html"), "utf8");
if (!compassHtml.includes('src="/laws/"')) throw new Error("Accepted Compass source is not /laws/.");
for (const lens of ["practical", "engineering", "empirical"]) {
  if (!compassHtml.includes(`data-lens-control="${lens}"`)) throw new Error(`Missing ${lens} lens control.`);
}
for (const mode of ["full", "reduced", "static"]) {
  if (!compassHtml.includes(`data-motion-control="${mode}"`)) throw new Error(`Missing ${mode} motion control.`);
}

const renderer = fs.readFileSync(path.join(root, "research/prototypes/laws-graphic-engineering-integration/shared/first-research-webgl2.js"), "utf8");
for (const contract of ["suspend()", "resume()", "resize(", "captureReceipt()", "dispose()", "STATIC_EQUIVALENT_ONLY"]) {
  if (!renderer.includes(contract)) throw new Error(`Shared renderer contract missing: ${contract}`);
}

console.log(JSON.stringify({
  result: "PASS",
  program: manifest.program,
  slice: manifest.slice,
  requiredFiles: required.length,
  components: [...componentIds],
  sharedMechanicConsumedBy: ["laboratory", "compass-page-prototype"],
  productionMutation: false
}, null, 2));
