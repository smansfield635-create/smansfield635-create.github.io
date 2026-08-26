#!/usr/bin/env node
import fs from "node:fs";

const CONTRACT_PATH = "laws/room-carousel/preconstruction-contract.v1.json";
const contract = JSON.parse(fs.readFileSync(CONTRACT_PATH, "utf8"));
const targets = contract.routeInventory;
const failures = [];
const requireText = (path, needle, code) => {
  const source = fs.readFileSync(path, "utf8");
  if (!source.includes(needle)) failures.push(`${code}:${path}`);
  return source;
};

if (contract.schema !== "LAWS_FIVE_SCENE_CONTINUITY_CONTRACT_v1") failures.push("CONTRACT_SCHEMA");
if (contract.operationId !== "LAWS_CAROUSEL_CONTINUITY_FIVE_SCENE_BOTTOM_TABS_20260826_003" || contract.lockGeneration !== 1738) failures.push("GEN1738_BINDING");
if (contract.exactGoverningHead !== "2e7780f2cdde6b0d4d50ef3b271fd88f35d88720") failures.push("GOVERNING_HEAD_BINDING");
if (contract.candidateBranch !== "laws-carousel/gen1738-five-scene-successor-20260826") failures.push("CANDIDATE_BRANCH_BINDING");
if (contract.sceneCount !== 5 || contract.sceneSchema?.length !== 5) failures.push("SCENE_COUNT");
if (contract.bottomTabs?.detachedSixthState !== false) failures.push("SIXTH_STATE");
if (!Array.isArray(targets) || targets.length !== 16) failures.push("ROUTE_INVENTORY");

const runtime = requireText("laws/room-carousel/room-carousel.v1.js", "LAWS_FIVE_SCENE_CONTINUITY_CAROUSEL_v2", "RUNTIME_CONTRACT");
for (const label of ["Identity / Meaning","Primary Relationship","Reading / Evidence","Custody / Limits","Continuation / Handoff"]) {
  if (!runtime.includes(label)) failures.push(`RUNTIME_SCENE:${label}`);
}
for (const invariant of ["sceneCount: 5","bottomTabs: true","detachedSixthState: false","storyRouteNavigationExternal: true"]) {
  if (!runtime.includes(invariant)) failures.push(`RUNTIME_INVARIANT:${invariant}`);
}
if (!runtime.includes("viewport.after(tabs)")) failures.push("BOTTOM_TAB_RUNTIME_POSITION");
const css = requireText("laws/room-carousel/room-carousel.v1.css", "[data-lrc-tabs]", "BOTTOM_TABS_STYLE");
if (!css.includes("grid-template-columns:repeat(5")) failures.push("FIVE_TAB_GRID");
const depth = requireText("laws/room-carousel/information-depth.v1.css", "LAWS_METHODS_DERIVED_PROGRESSIVE_INFORMATION_DEPTH_v2", "DEPTH_CONTRACT");
if (!depth.includes("overflow-wrap:anywhere")) failures.push("LONG_IDENTIFIER_CONTAINMENT");

for (const path of targets) {
  const source = requireText(path, "data-laws-room-carousel", "CAROUSEL_CONSUMER");
  if (!source.includes("room-carousel.v1.css")) failures.push(`CAROUSEL_CSS:${path}`);
  if (!source.includes("room-carousel.v1.js")) failures.push(`CAROUSEL_JS:${path}`);
  if (!source.includes("information-depth.v1.css")) failures.push(`DEPTH_CSS:${path}`);
  if (!source.includes("lr-story-nav")) failures.push(`STORY_HANDOFF:${path}`);
}

for (const prohibited of contract.excludedUnregisteredStyles || []) {
  if (!fs.existsSync(prohibited)) failures.push(`EXCLUDED_STYLE_MISSING:${prohibited}`);
}

if (failures.length) {
  console.error(JSON.stringify({result:"FAIL", contract:contract.schema, failures}, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({result:"PASS", contract:contract.schema, operationId:contract.operationId, lockGeneration:contract.lockGeneration, sceneCount:5, routeCount:targets.length, bottomTabs:true, detachedSixthState:false, claimsMutated:false}, null, 2));
