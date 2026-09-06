import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SCENE_SPEC } from "./scene-spec.js";

const here = dirname(fileURLToPath(import.meta.url));
const files = {
  html: await readFile(join(here, "index.html"), "utf8"),
  css: await readFile(join(here, "styles.css"), "utf8"),
  app: await readFile(join(here, "app.js"), "utf8"),
  renderer: await readFile(join(here, "renderer-webgl2.js"), "utf8"),
  readme: await readFile(join(here, "README.md"), "utf8")
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const expectedPrimitives = ["field", "path", "gate", "lattice", "volume", "orbit", "fracture", "crystal", "ledger"];
const actualPrimitives = SCENE_SPEC.primitives.map((primitive) => primitive.id);

assert(SCENE_SPEC.sceneId, "Scene specification must have an ID.");
assert(actualPrimitives.length === 9, "Exactly nine canonical primitives are required.");
assert(expectedPrimitives.every((id) => actualPrimitives.includes(id)), "Canonical primitive registry is incomplete.");
assert(SCENE_SPEC.evidenceStatus === "SYNTHETIC_ILLUSTRATIVE_FIXTURE", "Synthetic evidence boundary is required.");
assert(SCENE_SPEC.longDescription.length > 300, "A substantial long description is required.");
assert(SCENE_SPEC.typedRelationships.length >= 9, "Typed relationships must be explicit.");

for (const primitive of SCENE_SPEC.primitives) {
  for (const field of ["semanticMeaning", "practical", "trajectory", "engineering", "relation", "motionPurpose", "staticEquivalent", "empirical"]) {
    assert(Boolean(primitive[field]), `${primitive.id} is missing ${field}.`);
  }
}

for (const method of ["initialize", "resize", "setState", "setParameters", "setMotionMode", "render", "hitTest", "captureReceipt", "suspend", "resume", "dispose"]) {
  assert(files.renderer.includes(`${method}(`), `Renderer adapter contract method missing: ${method}`);
}

assert(files.html.includes('<math display="block"'), "Native MathML formal surface is required.");
assert(files.html.includes('role="tablist"'), "Practical, engineering, and empirical lens separation is required.");
assert(files.html.includes('id="geometry-canvas"'), "Advanced spatial presentation surface is required.");
assert(files.html.includes('id="static-fallback"'), "Static equivalent is required.");
assert(files.html.includes("No real study, dataset, engineering certification, or empirical validation is represented."), "Visible empirical boundary is required.");
assert(files.app.includes('prefers-reduced-motion'), "Reduced-motion authority must be consumed.");
assert(files.app.includes("IntersectionObserver"), "Offscreen suspension is required.");
assert(files.app.includes("ResizeObserver"), "Element-based resize is required.");
assert(files.css.includes('html[data-motion-mode="static"]'), "Static presentation mode styling is required.");
assert(files.readme.includes("not a tutorial about constructing 3D objects"), "Practical-purpose boundary must be explicit in the README.");

const prohibitedLivePaths = [
  "laws/index.html",
  "laws/index.css",
  "laws/index.controller.js",
  "laws/index.compositor.js",
  "laws/index.crystals.js",
  "laws/index.interactions.js",
  "laws/index.planet.js"
];
for (const path of prohibitedLivePaths) {
  assert(!files.app.includes(path) && !files.renderer.includes(path), `Prototype must not import protected live path: ${path}`);
}

console.log(JSON.stringify({
  status: "PASS",
  sceneSpecId: SCENE_SPEC.sceneId,
  primitiveCount: actualPrimitives.length,
  typedRelationshipCount: SCENE_SPEC.typedRelationships.length,
  lenses: ["PRACTICAL", "ENGINEERING", "EMPIRICAL"],
  motionModes: ["FULL", "REDUCED", "STATIC"],
  rendererAdapter: "DGB_LAWS_NATIVE_WEBGL2_RESEARCH_ADAPTER_v1",
  evidenceStatus: SCENE_SPEC.evidenceStatus,
  productionMutationAuthorized: false
}, null, 2));
