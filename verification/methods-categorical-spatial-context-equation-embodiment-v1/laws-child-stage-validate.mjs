import fs from "node:fs/promises";
import path from "node:path";

const directory = path.dirname(new URL(import.meta.url).pathname);
const outDir = path.resolve(process.env.OUT_DIR || "methods-categorical-spatial-context-equation-embodiment-v1-evidence");
await fs.mkdir(outDir, { recursive: true });

const [indexText, cssText, extensionText] = await Promise.all([
  fs.readFile(path.join(directory, "index.html"), "utf8"),
  fs.readFile(path.join(directory, "laws-child-stage.css"), "utf8"),
  fs.readFile(path.join(directory, "laws-child-stage.mjs"), "utf8")
]);

const checks = Object.freeze({
  LAWS_CHILD_SHELL_PRESENT: /data-laws-child-shell/.test(indexText),
  LAWS_CHILD_TOPBAR_PRESENT: /data-laws-child-topbar/.test(indexText),
  COMPACT_METHODS_HERO_PRESENT: /data-laws-hero/.test(indexText) && /How was the proposition specified, calculated, compared, and exposed to failure\?/.test(indexText),
  METHODS_SPATIAL_CHAMBER_PRESENT: /data-methods-chamber/.test(indexText) && /METHODS_CATEGORICAL_CORPUS_STAGE_v1/.test(indexText),
  GLOBAL_LAWS_RESEARCH_ORIGIN_PRESENT: /data-global-origin/.test(indexText) && />Laws</.test(indexText) && />Research</.test(indexText),
  LOCAL_METHODS_ORIGIN_PRESENT: /data-local-origin/.test(indexText) && /Methods equation core/.test(indexText),
  DISTINCT_GLOBAL_RETURN_PRESENT: /data-global-return/.test(indexText) && /href="\/laws\/"/.test(indexText),
  DISTINCT_LOCAL_RETURN_PRESENT: /data-local-return/.test(indexText) && /Return to corpus/.test(indexText),
  THREE_LENS_READING_INSTRUMENT_PRESENT: ["practical", "engineering", "evidence"].every(lens => indexText.includes(`data-lens-select="${lens}"`)),
  SUPPORTING_PUBLIC_CONTEXT_PRESENT: /data-supporting-public-context/.test(indexText),
  CLAIM_BOUNDARY_PRESENT: /data-claim-boundary/.test(indexText),
  RESEARCH_STORY_NAVIGATION_PRESENT: /class="research-story-navigation"/.test(indexText),
  CANONICAL_CUSTODY_COLLAPSED: /<details[^>]*data-canonical-custody(?![^>]*open)/.test(indexText),
  COMPLETE_INSPECTION_ORIGIN_PRESENT: ["data-inspection-origin-family", "data-inspection-origin-model", "data-inspection-origin-lens"].every(marker => indexText.includes(marker)),
  PAGE_SPECIFIC_STAGE_CSS_PRESENT: /Laws child-stage perceptual composition correction/.test(cssText) && /--stage-height:\s*clamp\(640px, calc\(100svh - 176px\), 840px\)/.test(cssText),
  MOBILE_STAGE_CONTINUITY_PRESENT: /--stage-height:\s*calc\(100svh - 164px\)/.test(cssText),
  FOUR_FAMILY_CANONICAL_ORDER_RING_PRESENT: /function overviewFamilyCenters\(/.test(extensionText) && /CANONICAL_ORDER_WITHOUT_DIRECTIONAL_AUTHORITY/.test(extensionText),
  CURVED_MODEL_TRAJECTORY_PRESENT: /CURVED_CANONICAL_ARC/.test(extensionText) && /Math\.pow\(Math\.abs\(normalized\), 1\.7\)/.test(extensionText),
  DETERMINISTIC_STAGE_COORDINATES_PRESENT: /node\.style\.left\s*=/.test(extensionText) && /plane\.style\.left\s*=/.test(extensionText) && /relation\.style\.left\s*=/.test(extensionText),
  LENS_AND_ORIGIN_RUNTIME_BINDING_PRESENT: /function selectLens\(/.test(extensionText) && /function updateLocalOrigin\(/.test(extensionText),
  PUBLIC_METHODS_SCRIPT_COPY_EMBEDDED_0: !/<script[^>]+src="\/laws\/research\/methods-and-models\/showroom\.js/.test(indexText),
  LAWS_COMPASS_SEMANTIC_REPLICATION_0: !/METHODS_FAMILIES_AS_LAWS_CARDINALS|Flow, Integrity, Reality, and Structure/.test(indexText)
});

const report = {
  contract: "LAWS_CHILD_SPATIAL_STAGE_SHELL_VALIDATION_v1",
  sharedShell: "LAWS_CHILD_SPATIAL_STAGE_SHELL_v1",
  methodsInstance: "METHODS_CATEGORICAL_CORPUS_STAGE_v1",
  globalOrigin: "LAWS_CHAMBER_AND_RESEARCH_GATEWAY",
  localOrigin: "METHODS_AND_MODELS_CORPUS",
  checks,
  result: Object.values(checks).every(Boolean) ? "PASS_LAWS_CHILD_STAGE_STATIC_GATE" : "FAIL_LAWS_CHILD_STAGE_STATIC_GATE",
  compassSemanticReplication: false,
  publicMethodsMutationAuthorized: false,
  mergeAuthorized: false,
  empiricalValidationClaimed: false,
  userReviewAuthorized: false
};

await fs.writeFile(path.join(outDir, "laws-child-stage-shell-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.result !== "PASS_LAWS_CHILD_STAGE_STATIC_GATE") process.exitCode = 1;
