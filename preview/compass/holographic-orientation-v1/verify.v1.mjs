#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const contract = JSON.parse(read("contract.v1.json"));
const html = read("index.html");
const css = read("index.css");
const js = read("index.js");
const descriptors = read("descriptors.v1.js");
const checks = [];
const failures = [];

function check(id, condition, detail = "") {
  checks.push(id);
  if (!condition) failures.push({ id, detail });
}

check("CONTRACT_SCHEMA", contract.schema === "COMPASS_HOLOGRAPHIC_VERTICAL_SLICE_CONTRACT_v1");
check("CONTRACT_FROZEN", contract.status === "CONSTRUCTION_AUTHORITY_FROZEN");
check("PUBLIC_BASE_HEAD", contract.operation?.publicBaseHead === "8ca9f9fcae3e975993f8c50a4c2524cee0de0f1c");
check("INTAKE_ADMITTED", contract.operation?.intakeResult === "ADMITTED_AND_LOCKED" && contract.operation?.lockGeneration === 415);
check("ISOLATED_PREVIEW_ONLY", contract.surface?.class === "ISOLATED_PREVIEW_ONLY" && contract.surface?.productionMutation === false);
check("VIDEO_REQUIREMENT_ZERO", contract.successorProgram?.physicalVideoClipsRequired === 0);
check("ONE_MASTER_RAF_CONTRACT", contract.runtimeInvariants?.masterRequestAnimationFrameAuthorities === 1);
check("ZERO_DESTINATION_GPU_CONTRACT", contract.runtimeInvariants?.destinationOwnedGpuContexts === 0);
check("ZERO_DESTINATION_SCHEDULERS_CONTRACT", contract.runtimeInvariants?.destinationOwnedAnimationSchedulers === 0);
check("NO_RUNTIME_IMPORT_CONTRACT", contract.runtimeInvariants?.destinationRuntimeImports === false);
check("NO_BLANK_FRAME_CONTRACT", contract.verticalSlice?.blankFrameAllowance === 0);
check("SELECTED_CONTROL_CONTINUITY", contract.verticalSlice?.selectedControlContinuityLaw === "SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER");
check("REDUCED_MOTION_CONTRACT", contract.reducedMotion?.stateSemanticsEquivalent === true && contract.reducedMotion?.flyingFragments === false);

check("ENTRY_COPY_BRAND", html.includes("Diamond Gate Bridge"));
check("ENTRY_COPY_FIND_WAY", html.includes("Find your way."));
check("ENTRY_COPY_DECK", html.includes("A short orientation before you enter."));
check("ENTRY_BEGIN_CONTROL", html.includes("data-begin-orientation"));
check("ENTRY_SKIP_CONTROL", html.includes("data-skip-orientation"));
check("SOURCE_COMPASS_GEOMETRY_LOADED", html.includes("/assets/compass/upstream-compass.geometry.js"));
check("NO_VIDEO_ELEMENT", !/<video\b/i.test(html));
check("NO_IMAGE_ELEMENT", !/<img\b/i.test(html));
check("NO_PRODUCTION_CINEMATIC_IMPORT", !html.includes("compass.orientation-cinematic"));

check("NO_BACKDROP_FILTER", !/backdrop-filter\s*:/i.test(css) && !/backdropFilter/.test(js));
check("NO_CSS_FILTER_PROPERTY", !/(^|[;{])\s*filter\s*:/mi.test(css));
check("NO_JS_FILTER_WRITE", !/\.style\.filter\b/.test(js));
check("NO_WEBGL_CONTEXT", !/getContext\s*\(\s*["']webgl2?["']/i.test(js));
check("NO_DESTINATION_WEBGL_SYMBOL", !/WebGLRenderingContext|WebGL2RenderingContext/.test(js));
check("NO_SET_INTERVAL", !/\bsetInterval\s*\(/.test(js));
check("NO_MEDIA_PLAYBACK_CLOCK", !/\.play\s*\(|currentTime\s*=/.test(js));
check("ONE_RAF_CALL_SITE", (js.match(/requestAnimationFrame\s*\(/g) || []).length === 1);
check("MASTER_CLOCK_PERFORMANCE_NOW", js.includes("performance.now()"));
check("CANVAS_2D_ONLY", js.includes('getContext("2d"'));
check("REDUCED_MOTION_IMPLEMENTED", js.includes("prefers-reduced-motion: reduce") && js.includes("renderReduced"));
check("SOURCE_FRONT_PROJECTION_USED", js.includes("createFrontProjectionSchema"));
check("SOURCE_GEOMETRY_MODULE_ASSERTED", js.includes('authority.moduleId !== "DGB_UPSTREAM_COMPASS_GEOMETRY"'));
check("CANVAS_DIMENSION_ASSIGNMENT_BOUNDED", (js.match(/canvas\.width\s*=/g) || []).length === 1 && (js.match(/canvas\.height\s*=/g) || []).length === 1);
const resizeStart = js.indexOf("function resizeCanvas");
const renderStart = js.indexOf("function renderFrame");
const widthAssignment = js.indexOf("canvas.width =");
check("CANVAS_DIMENSIONS_OUTSIDE_RENDER_LOOP", resizeStart >= 0 && widthAssignment > resizeStart && (renderStart < 0 || widthAssignment < renderStart));
check("TESSELLATION_NATIVE", js.includes("drawIsoCell") && js.includes("buildTessellation"));
check("TESSELLATION_TO_SOURCE_MATTER", js.includes("compassScreenPoint") && js.includes("state.stars"));
check("NO_HISTORY_MUTATION", !/history\.(pushState|replaceState)|location\s*=|location\.href\s*=/.test(js));
check("NO_ANALYTICS", !/gtag\s*\(|dataLayer|analytics/i.test(js));

const requiredBindings = [
  ["P1", "93a9fc9989b53ef75319dc1af0206ebc6a2b537c"],
  ["P2", "fe35d8d844859a6af810684ace53d2c65258522f"],
  ["P3", "ac955931681b46e39706d298f4f83d4cf50a50c5"],
  ["P4", "06a82735deec6e577b71cf47b2d7246a9d853f0f"],
  ["P5", "bef36f101c15fe949b89dd6ecea6117cd471680e"],
  ["P6", "325b9486d0ab2136d425aed9468c22c28c67a57b"],
  ["P7A", "a82e3c963a10808b9f8f1922faab45155ea4a62b"],
  ["P7B", "fb3ee8ab92fa4b08e7708b83780de75d1a6f8595"],
  ["P7C", "fe909379190431baaf825df1b776ec1d66c305f2"],
  ["P8", "7875a6a220fa44da24fe2ad805bb1e146440b5d6"],
  ["P9", "872d20b17bb0cd89d9613ca0262b25350890a617"],
  ["P10", "d281e18b06128671ffe2a19e8fdb272cc5544e31"],
  ["P11", "fe35d8d844859a6af810684ace53d2c65258522f"]
];
for (const [passage, blob] of requiredBindings) {
  check(`DESCRIPTOR_${passage}`, descriptors.includes(`passage: "${passage}"`) && descriptors.includes(blob));
}
check("P1_ACTIVE", descriptors.includes('P1: Object.freeze') && descriptors.includes('implementation: "VERTICAL_SLICE_ACTIVE"'));
check("P2_ACTIVE", descriptors.includes('P2: Object.freeze') && descriptors.includes('mode: "PURE_GEOMETRY_EXTRACTION"'));
check("FIBONACCI_SEED", descriptors.includes("0x44474243"));
check("FIBONACCI_GOLDEN_ANGLE", descriptors.includes("Math.PI * (3 - Math.sqrt(5))"));
check("COMMUNITY_BRAND_SEPARATE", contract.entryGatePersonality?.communityBrandBoundary?.includes("CONSIDER_THE_ENERGY_IS_SEPARATE_COMMUNITY_IDENTITY"));

const prohibited = [
  "assets/compass/compass.controller.js",
  "assets/compass/compass.crystals.js",
  "assets/compass/compass.orientation-cinematic.js",
  "assets/compass/compass.orientation-cinematic.css"
];
for (const entry of prohibited) {
  check(`PROHIBITED_RUNTIME_${entry}`, !html.includes(entry) && !js.includes(entry));
}

const result = failures.length ? "FAIL" : "PASS";
console.log(JSON.stringify({
  schema: "COMPASS_HOLOGRAPHIC_VERTICAL_SLICE_VERIFICATION_v1",
  result,
  checkCount: checks.length,
  failureCount: failures.length,
  failures
}, null, 2));
if (failures.length) process.exit(1);
