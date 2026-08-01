import fs from 'node:fs';

const CSS_PATH = 'laws/index.css';
const VERIFY_PATH = 'tools/laws-cp6-lane1-verify.mjs';
const CSS_SENTINEL = 'LAWS_CP6_LANE1_PHONE_CRYSTAL_FIT_v1';

function assert(condition, message) {
  if (!condition) throw new Error(`[laws-cp6-lane1-browser-correction] ${message}`);
}

let css = fs.readFileSync(CSS_PATH, 'utf8');
let verifier = fs.readFileSync(VERIFY_PATH, 'utf8');
let cssChanged = false;
let verifierChanged = false;

if (!css.includes(CSS_SENTINEL)) {
  css += `

/* ${CSS_SENTINEL}
   Presentation-only fit for live crystal canvases and their matching semantic
   hit layer. Runtime projection, geometry authority, routes, and interaction
   sequencing remain unchanged. */
@media (max-width: 430px) {
  .laws-orbit__field > canvas[data-laws-compositor-layer],
  .laws-orbit__field > .laws-object-layer,
  .laws-orbit__field > [data-laws-objects] {
    transform: scale(0.72);
    transform-origin: 50% 50%;
  }
}
`;
  cssChanged = true;
}

const allowlistNeedle = "      file === 'tools/laws-cp6-lane1-verify.mjs' ||\n      file === '.github/workflows/laws-cp6-lane1-build-verify.yml' ||";
const allowlistReplacement = "      file === 'tools/laws-cp6-lane1-verify.mjs' ||\n      file === 'tools/laws-cp6-lane1-browser-correction.mjs' ||\n      file === '.github/workflows/laws-cp6-lane1-build-verify.yml' ||";
if (!verifier.includes("file === 'tools/laws-cp6-lane1-browser-correction.mjs'")) {
  assert(verifier.includes(allowlistNeedle), 'changed-path allowlist insertion point not found');
  verifier = verifier.replace(allowlistNeedle, allowlistReplacement);
  verifierChanged = true;
}

const metricNeedle = '        immediateCapabilityRouteDeckCount: document.querySelectorAll(\'.laws-value-deck\').length,\n        duplicateRouteLinks,';
const metricReplacement = '        immediateCapabilityRouteDeckCount: document.querySelectorAll(\'.laws-value-deck\').length,\n        duplicateRouteDirectoryCount: document.querySelectorAll(\'.laws-value-deck\').length,\n        duplicateRouteLinks,';
if (!verifier.includes('duplicateRouteDirectoryCount: document.querySelectorAll')) {
  assert(verifier.includes(metricNeedle), 'browser metric insertion point not found');
  verifier = verifier.replace(metricNeedle, metricReplacement);
  verifierChanged = true;
}

const comparisonNeedle = '      duplicateRouteLinkCountBefore: before.duplicateRouteLinkCount,\n      duplicateRouteLinkCountAfter: after.duplicateRouteLinkCount,\n      offscreenControlsBefore:';
const comparisonReplacement = '      duplicateRouteLinkCountBefore: before.duplicateRouteLinkCount,\n      duplicateRouteLinkCountAfter: after.duplicateRouteLinkCount,\n      duplicateRouteDirectoryCountBefore: before.duplicateRouteDirectoryCount,\n      duplicateRouteDirectoryCountAfter: after.duplicateRouteDirectoryCount,\n      offscreenControlsBefore:';
if (!verifier.includes('duplicateRouteDirectoryCountAfter: after.duplicateRouteDirectoryCount')) {
  assert(verifier.includes(comparisonNeedle), 'comparison insertion point not found');
  verifier = verifier.replace(comparisonNeedle, comparisonReplacement);
  verifierChanged = true;
}

const failureNeedle = "    if (comparison.duplicateRouteLinkCountAfter !== 0) browserFailures.push(`${viewportName}: duplicate visible route links`);";
const failureReplacement = "    if (comparison.duplicateRouteDirectoryCountAfter !== 0) browserFailures.push(`${viewportName}: duplicate route directories`);";
if (verifier.includes(failureNeedle)) {
  verifier = verifier.replace(failureNeedle, failureReplacement);
  verifierChanged = true;
}
assert(verifier.includes(failureReplacement), 'duplicate-directory acceptance rule not established');

const summaryNeedle = '; open panels ${item.initialExpandedPanelsAfter}; overflow ${item.horizontalOverflowAfter}px; off-screen controls ${item.offscreenControlsAfter}.`),';
const summaryReplacement = '; open panels ${item.initialExpandedPanelsAfter}; duplicate directories ${item.duplicateRouteDirectoryCountAfter}; repeated visible links reported ${item.duplicateRouteLinkCountAfter}; overflow ${item.horizontalOverflowAfter}px; off-screen controls ${item.offscreenControlsAfter}.`),';
if (verifier.includes(summaryNeedle)) {
  verifier = verifier.replace(summaryNeedle, summaryReplacement);
  verifierChanged = true;
}

if (cssChanged) fs.writeFileSync(CSS_PATH, css, 'utf8');
if (verifierChanged) fs.writeFileSync(VERIFY_PATH, verifier, 'utf8');

console.log(JSON.stringify({
  cssChanged,
  verifierChanged,
  phoneCrystalFit: css.includes(CSS_SENTINEL),
  duplicateRouteDirectoryAcceptance: verifier.includes(failureReplacement),
  repeatedRouteLinksStillMeasured: verifier.includes('duplicateRouteLinkCountAfter: after.duplicateRouteLinkCount')
}, null, 2));
