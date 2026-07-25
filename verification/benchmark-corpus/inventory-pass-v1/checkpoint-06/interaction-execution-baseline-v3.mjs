import fs from "node:fs/promises";

const sourceUrl = new URL("./interaction-execution-baseline-v2.mjs", import.meta.url);
const runtimeUrl = new URL("./interaction-execution-baseline-v3.runtime.mjs", import.meta.url);
let source = await fs.readFile(sourceUrl, "utf8");

const replacements = [
  [
    'const OUTPUT = "cp6-interaction-execution-baseline-v2.json";',
    'const OUTPUT = "cp6-interaction-execution-baseline-v3.json";'
  ],
  [
    'METAVERSE_3D_GOVERNED_BENCHMARK_CORPUS_INTERACTION_EXECUTION_BASELINE_v2',
    'METAVERSE_3D_GOVERNED_BENCHMARK_CORPUS_INTERACTION_EXECUTION_BASELINE_v3'
  ],
  [
    'const index = elements.findIndex(element => (element.textContent || "").replace(/\\s+/g, " ").trim().includes(expectedText));',
    'const normalizedExpected = String(expectedText || "").toLowerCase(); const index = elements.findIndex(element => (element.textContent || "").replace(/\\s+/g, " ").trim().toLowerCase().includes(normalizedExpected));'
  ],
  [
    'record.actions.push(await activateByText(page, "summary", "Open the orientation profile", "keyboard"));',
    'record.actions.push(await activate(page, "summary.profile-summary", "keyboard"));'
  ],
  [
    'record.actions.push(await activateByText(page, "a.button[href=\'/\']", "RETURN TO COMPASS", "pointer"));',
    'record.actions.push(await activateByText(page, "a[href=\'/\']", "Return to Compass", "pointer"));'
  ],
  [
    'correctionOf: {\n    workflowRunId: "30143757536",\n    reason: "AUTHORITATIVE_SEMANTIC_TARGETS_TEXT_STABLE_HOMEPAGE_TARGETS_AND_GESTURE_SURFACE_CORRECTION"\n  },',
    'correctionOf: {\n    workflowRunIds: ["30143757536", "30144111712"],\n    reason: "AUTHORITATIVE_SEMANTIC_TARGETS_GESTURE_SURFACES_CASE_INSENSITIVE_TEXT_MATCHING_AND_ACTIVE_PROFILE_DISCLOSURE_TARGET"\n  },'
  ]
];

for (const [before, after] of replacements) {
  if (!source.includes(before)) {
    throw new Error(`CP6_V3_REPLACEMENT_TARGET_MISSING:${before.slice(0, 80)}`);
  }
  source = source.replace(before, after);
}

await fs.writeFile(runtimeUrl, source, "utf8");
try {
  await import(`${runtimeUrl.href}?run=${Date.now()}`);
} finally {
  await fs.unlink(runtimeUrl).catch(() => {});
}
