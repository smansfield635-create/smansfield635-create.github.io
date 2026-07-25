import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";

const sourcePath = "verification/benchmark-corpus/inventory-pass-v1/checkpoint-05/runtime-capture.mjs";
const generatedPath = "verification/benchmark-corpus/inventory-pass-v1/checkpoint-05/runtime-capture.v3.generated.mjs";
let source = await fs.readFile(sourcePath, "utf8");

function replaceRequired(before, after, id) {
  if (!source.includes(before)) throw new Error(`CP5_V3_REQUIRED_PATTERN_MISSING:${id}`);
  source = source.replace(before, after);
}

replaceRequired(
  '    if (!DEPLOYED_ORIGINS.has(u.origin)) return null;',
  '    if (u.protocol === "blob:" || !DEPLOYED_ORIGINS.has(u.origin)) return null;',
  "BLOB_URL_EXCLUSION"
);

replaceRequired(
  '      scrollTo(0, 0);\n    });\n    await wait(3000);',
  '      scrollTo(0, 0);\n    });\n    await page.keyboard.press("Tab");\n    await wait(4500);',
  "NON_SEMANTIC_INTERACTION_LOAD_TRIGGER"
);

replaceRequired(
`    const captured = observations.filter(x => x.bodyStatus === "CAPTURED");
    const exact = captured.filter(x => x.rawGitBlobMatch);
    const bounded = captured.filter(x => !x.rawGitBlobMatch && x.boundedTransformMatch);
    return {
      path, expectedGitBlobSha1, observationCount:observations.length, capturedCount:captured.length,
      observed:observations.length>0, bodyCaptured:captured.length>0,
      exactDeployedBodyMatchCount:exact.length, boundedEdgeTransformationCount:bounded.length,
      allCapturedBodiesCustodyResolved:captured.length>0 && captured.every(x => x.custodyMatch),
      rawMismatchObserved:captured.some(x => !x.rawGitBlobMatch), observations
    };`,
`    const captured = observations.filter(x => x.bodyStatus === "CAPTURED");
    const boundedRawHashes = new Set(captured.filter(x => x.boundedTransformMatch).map(x => x.gitBlobSha1));
    for (const item of captured) {
      if (!item.custodyMatch && boundedRawHashes.has(item.gitBlobSha1)) {
        item.custodyMatch = true;
        item.boundedTransformMatch = true;
        item.boundedTransform = { transform:"INHERITED_FROM_IDENTICAL_RAW_BODY_HASH_WITH_EXACT_COLD_NORMALIZATION", gitBlobSha1:item.gitBlobSha1 };
        item.matchClassification = "BOUNDED_CLOUDFLARE_HTML_TRANSFORMATION_INHERITED_FOR_IDENTICAL_304_BODY";
      }
    }
    const exact = captured.filter(x => x.rawGitBlobMatch);
    const bounded = captured.filter(x => !x.rawGitBlobMatch && x.boundedTransformMatch);
    return {
      path, expectedGitBlobSha1, observationCount:observations.length, capturedCount:captured.length,
      observed:observations.length>0, bodyCaptured:captured.length>0,
      exactDeployedBodyMatchCount:exact.length, boundedEdgeTransformationCount:bounded.length,
      allCapturedBodiesCustodyResolved:captured.length>0 && captured.every(x => x.custodyMatch),
      rawMismatchObserved:captured.some(x => !x.rawGitBlobMatch), observations
    };`,
  "WARM_304_IDENTITY_INHERITANCE"
);

replaceRequired(
  'dynamicExecution:"NETWORK_RESPONSE_DEBUGGER_SCRIPT_PARSED_AND_DOM_SCRIPT_STATE",boundedTransformation:',
  'dynamicExecution:"NETWORK_RESPONSE_DEBUGGER_SCRIPT_PARSED_AND_DOM_SCRIPT_STATE",interactionLoadTrigger:"NON_SEMANTIC_TAB_KEY_ONLY_NO_ROUTE_SELECTION",warm304IdentityPolicy:"INHERIT_BOUNDED_TRANSFORM_ONLY_WHEN_RAW_BODY_GIT_HASH_EQUALS_A_COLD_BODY_WITH_EXACT_NORMALIZATION",runtimeBlobPolicy:"RECORDED_AS_GENERATED_EXECUTION_SURFACE_NOT_REPOSITORY_PATH",boundedTransformation:',
  "EVIDENCE_METHOD_DISCLOSURE"
);

await fs.writeFile(generatedPath, source, "utf8");
await import(`${pathToFileURL(generatedPath).href}?v=3`);
