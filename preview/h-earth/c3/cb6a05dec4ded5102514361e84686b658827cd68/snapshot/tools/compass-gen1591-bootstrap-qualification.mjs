import fs from 'node:fs';
import crypto from 'node:crypto';

const read = path => fs.readFileSync(path, 'utf8');
const sha256 = text => crypto.createHash('sha256').update(text).digest('hex');
const index = read('index.html');
const loader = read('assets/compass/compass.capability-carousel.js');
const presentation = read('assets/compass/compass.presentation-convergence.js');

const presentationTag = '/assets/compass/compass.presentation-convergence.js?v=presentation-convergence-v8&g=1591-root-owner&cb=20260822-1591-r4';
const loaderTag = '/assets/compass/compass.capability-carousel.js?v=compass-root-award-finish-successor-v1&g=1591-single-owner&cb=20260822-1591-r4';
const controllerTag = '/assets/compass/compass.controller.js?v=gen1532-live-binding-v1&cb=0333a10d5b595426';

const checks = {
  freshRootBootstrapIdentity: index.includes(loaderTag) && !index.includes('g=1577-single-owner&cb=20260821-1577'),
  presentationFirstBootstrap: index.includes(presentationTag) && index.indexOf(presentationTag) < index.indexOf(controllerTag) && index.indexOf(presentationTag) < index.indexOf(loaderTag),
  legacyGuardClearedBeforePresentation: index.indexOf('globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2=undefined') < index.indexOf(presentationTag),
  rootOwnerReceiptDeclared: index.includes('DGB_COMPASS_PRESENTATION_OWNER_GEN1591') && index.includes("version:'presentation-convergence-v8-root-bound-gen1591'") && index.includes("legacyGuardClearedBeforeFetch:true"),
  dependentLoaderRequiresOwner: loader.includes("const PRESENTATION_OWNER='DGB_COMPASS_PRESENTATION_OWNER_GEN1591'") && loader.includes('COMPASS_GEN1591_PRESENTATION_OWNER_NOT_MOUNTED'),
  noDynamicPresentationLoadInDependentLoader: !loader.includes("load('/assets/compass/compass.presentation-convergence.js"),
  presentationKeepsAllCardinals: presentation.includes('.compass-object--wing[data-compass-cardinal]{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}'),
  exactlyOneSettledReadableLabelRule: presentation.includes("wing.classList.toggle('is-readable-cardinal',active)") && presentation.includes("label.setAttribute('aria-hidden',active?'false':'true')"),
  mirrorlandBodyPortal: presentation.includes('document.body.append(state.portal)') && presentation.includes('document.body.append(state.backdrop)'),
  mirrorlandUnfilteredChooser: presentation.includes('filter:none!important;backdrop-filter:none!important;transform:none!important'),
  mirrorlandTeardownBeforeReturn: presentation.includes('hideMirrorlandBeforeReturn(routes)') && presentation.includes('routes.hidden=true') && presentation.includes('requestAnimationFrame(()=>requestAnimationFrame(()=>canonicalBack?.click()))'),
  routeNarrative: index.includes('<a href="/showroom/">Enter the Narrative</a>'),
  routeDemo: index.includes('<a href="/showroom/globe/h-earth/">Enter the Demo</a>'),
  routeWorldMap: index.includes('<a href="/showroom/globe/audralia/">See the World Map</a>'),
  routeReturn: index.includes('data-compass-mirrorland-inline-back>Return to Compass</a>'),
  noDuplicateCaptureNavigationShim: !loader.includes('window.location.assign') && !loader.includes('stopImmediatePropagation'),
};

const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
const receipt = {
  schema: 'GEN1591_BOOTSTRAP_QUALIFICATION_RECEIPT_v1',
  result: failed.length ? 'FAIL' : 'PASS',
  contract: 'ONE_ROOT_BOOTSTRAP_TO_ONE_PRESENTATION_OWNER_TO_DEPENDENT_RUNTIMES',
  checks,
  failed,
  fingerprints: {
    indexSha256: sha256(index),
    loaderSha256: sha256(loader),
    presentationSha256: sha256(presentation),
  },
  acceptanceBoundary: 'SOURCE_BOOTSTRAP_QUALIFIED_RENDERED_OWNER_EVIDENCE_STILL_REQUIRED',
};

fs.writeFileSync('gen1591-bootstrap-qualification.json', `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failed.length) process.exit(1);
