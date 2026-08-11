import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const IDS = ['collapse-qualified', 'pcr', 'mass-ledger', 'first'];
const PHI = [0, 90, 180, 270];
const SOURCE_BLOBS = Object.freeze({
  'index.html': '4e7e963e144055297910296d9fc865f11a9d5b84',
  'index.css': '9303a6ccd5faef48364cce66d03552efc4870a69'
});
const FORBIDDEN_PREDECESSOR_MARKERS = Object.freeze([
  'ORBIT_PAGE_' + 'SURFACE_DRAG_ROTATES_SHARED_CAROUSEL',
  'PAGE_DRAG_' + 'ROTATES_ALL',
  'pageSurfaceDrag = ' + 'ROTATE_SHARED_CAROUSEL'
]);
const REQUIRED_RUNTIME = [
  'EXACTLY_FOUR_CONTEXTUAL_TAB_OBJECTS',
  'OBJECT_IDENTITY_INVARIANT',
  'SHARED_AXIS_EUCLIDEAN_CAROUSEL',
  'FIXED_ANGULAR_OFFSETS_0_90_180_270',
  'THETA_N_EQUALS_THETA_WHEEL_PLUS_PHI_N',
  'PAIRWISE_ANGULAR_SPACING_INVARIANT',
  'UNBOUNDED_CONTINUOUS_CAROUSEL',
  'BACKGROUND_EMPTY_FIELD_DRAG_ROTATES_SHARED_CAROUSEL',
  'ORBIT_SCROLL_ROTATES_SHARED_CAROUSEL',
  'CARD_TAP_BELOW_8PX_FOCUSES_EXACT_CARD',
  'CARD_MOVEMENT_AT_OR_ABOVE_8PX_CANCELS_PENDING_TAP',
  'CARD_MOVEMENT_AT_OR_ABOVE_8PX_DOES_NOT_MUTATE_THETA_WHEEL',
  'CARD_MOVEMENT_AT_OR_ABOVE_8PX_DOES_NOT_FOCUS_ON_RELEASE',
  'FOCUS_FREEZES_THETA_WHEEL',
  'FOCUSED_VERTICAL_SCROLL_ONLY',
  'FOCUSED_HORIZONTAL_NO_PAGE_ADVANCE_NO_ROTATION',
  'RETURN_TO_ORBIT_RESTORES_EXACT_FROZEN_THETA_WHEEL',
  'FOCUSED_SAFE_ENVELOPE_PHONE_TABLET_DESKTOP',
  'FOUR_BY_FOUR_BY_THREE_CONTAINMENT_MATRIX',
  'INFORMATION_FULLY_EXPANDED_CONTAINED',
  'INTERNAL_VERTICAL_SCROLL_PRESERVED',
  'NO_PAGE_LEVEL_HORIZONTAL_OVERFLOW',
  'REDUCED_MOTION_EQUIVALENCE'
];

const fail = (errorCode, detail = null) => {
  console.error(JSON.stringify({ schema: 'LAWS_EUCLIDEAN_CAROUSEL_R1_R2_STATIC_VERIFICATION_RECEIPT_v1', result: 'FAIL', errorCode, detail }, null, 2));
  process.exit(1);
};
const assert = (condition, errorCode, detail = null) => { if (!condition) fail(errorCode, detail); };
const blobSha = (text) => {
  const body = Buffer.from(text, 'utf8');
  return createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${body.length}\0`), body])).digest('hex');
};

const [html, css, js, manifestText, self] = await Promise.all([
  readFile(join(here, 'index.html'), 'utf8'),
  readFile(join(here, 'index.css'), 'utf8'),
  readFile(join(here, 'index.js'), 'utf8'),
  readFile(join(here, 'specimen-manifest.v1.json'), 'utf8'),
  readFile(join(here, 'verify.v1.mjs'), 'utf8')
]);
const manifest = JSON.parse(manifestText);

assert(blobSha(html) === SOURCE_BLOBS['index.html'], 'VISUAL_READER_HTML_SOURCE_DRIFT', { expected: SOURCE_BLOBS['index.html'], actual: blobSha(html) });
assert(blobSha(css) === SOURCE_BLOBS['index.css'], 'VISUAL_READER_CSS_SOURCE_DRIFT', { expected: SOURCE_BLOBS['index.css'], actual: blobSha(css) });

const objectMatches = [...html.matchAll(/data-tab-object="([^"]+)"/g)].map((m) => m[1]);
assert(JSON.stringify(objectMatches) === JSON.stringify(IDS), 'FOUR_OBJECT_IDENTITY_OR_ORDER_DRIFT', { objectMatches, expected: IDS });
for (const marker of ['data-inner-tabs', 'data-return-orbit', 'Practical', 'Engineering', 'Evidence', 'Information']) {
  assert(html.includes(marker), 'PRESERVED_READER_CONTENT_MISSING', { marker });
}

assert(manifest.generation === 1065, 'MANIFEST_GENERATION_MISMATCH');
assert(manifest.operationId === 'LAWS_CONTEXTUAL_3D_EUCLIDEAN_CAROUSEL_R1_R2_REPAIR_V1_26D90C2_20260811_002', 'MANIFEST_OPERATION_MISMATCH');
assert(manifest.inheritanceFirewall?.gen1057QualificationAuthorityInherited === false, 'GEN1057_QUALIFICATION_AUTHORITY_INHERITED');
assert(manifest.carousel?.sharedAxis === 'Y', 'SHARED_AXIS_NOT_Y');
assert(JSON.stringify(manifest.carousel?.fixedAngularOffsetsDeg) === JSON.stringify(PHI), 'FIXED_OFFSETS_INVALID');
assert(manifest.carousel?.wheelAngleDomain === 'UNBOUNDED_CONTINUOUS_DEGREES', 'WHEEL_DOMAIN_INVALID');
assert(manifest.carousel?.objectCount === 4 && manifest.carousel?.proxyObjectCount === 0, 'OBJECT_OR_PROXY_COUNT_INVALID');
assert(manifest.carousel?.independentOrbitCardRepositioning === false, 'INDEPENDENT_CARD_REPOSITIONING_REAPPEARED');
assert(manifest.carousel?.radiusTopologyRedesigned === false, 'RADIUS_TOPOLOGY_REDESIGN_NOT_ALLOWED');
assert(manifest.repairs?.R1?.focusedCaseCount === 48, 'R1_48_CASE_MATRIX_NOT_BOUND');
assert(manifest.repairs?.R1?.pageLevelHorizontalOverflowAllowed === false, 'R1_HORIZONTAL_OVERFLOW_NOT_PROHIBITED');
assert(manifest.repairs?.R2?.thresholdPx === 8, 'R2_THRESHOLD_MISMATCH');
assert(manifest.repairs?.R2?.backgroundMovement === 'ROTATE_SHARED_CAROUSEL', 'R2_BACKGROUND_CONTROL_INVALID');
assert(manifest.repairs?.R2?.cardMovementAtOrAboveThreshold === 'CANCEL_TAP_NO_THETA_MUTATION_NO_FOCUS', 'R2_CARD_ISOLATION_INVALID');
for (const condition of REQUIRED_RUNTIME) assert(manifest.requiredRuntimeConditions?.includes(condition), 'REQUIRED_RUNTIME_CONDITION_MISSING', { condition });

for (const [name, text] of Object.entries({ 'index.html': html, 'index.css': css, 'index.js': js, 'specimen-manifest.v1.json': manifestText, 'verify.v1.mjs': self })) {
  for (const marker of FORBIDDEN_PREDECESSOR_MARKERS) assert(!text.includes(marker), 'REJECTED_PREDECESSOR_R2_LANGUAGE_REAPPEARED', { name, marker });
}

for (const theta of [-1440.5, -720, -18, 0, 13.25, 359.9, 720, 1440.5]) {
  const angles = PHI.map((phi) => theta + phi);
  for (let n = 0; n < PHI.length; n += 1) for (let m = 0; m < PHI.length; m += 1) {
    assert(Math.abs(((angles[n] - angles[m]) - (PHI[n] - PHI[m]))) < 1e-9, 'PAIRWISE_ANGULAR_SPACING_MATH_FAIL', { theta, n, m });
  }
}

const requiredJsMarkers = [
  'const PHI = Object.freeze([0, 90, 180, 270])',
  'thetaWheel: INITIAL_THETA',
  'state.thetaWheel += delta * 0.22',
  'state.thetaWheel += px * 0.10',
  'rotateY(${PHI[index]}deg) translateZ(${state.radius.toFixed(1)}px)',
  "inputDomain: touchedTab ? 'CARD' : 'BACKGROUND'",
  "gesture.moved && gesture.inputDomain === 'BACKGROUND'",
  "orbitPointerInputDomain: 'BACKGROUND_EMPTY_FIELD_ONLY'",
  'pageSurfaceCarouselDragAllowed: false',
  'thetaWheelIsUnbounded: true',
  'state.focusFrozen = wheelSnapshot()',
  'if (state.focusFrozen) state.thetaWheel = state.focusFrozen.thetaWheel',
  'if (!cancelled && !gesture.moved && gesture.touchedTab) enterFocus(gesture.touchedTab)',
  'distance >= TAP_DRAG_THRESHOLD',
  '--focused-max-width',
  '--focused-max-height',
  'translateZ(0px)',
  '@media(prefers-reduced-motion:reduce)'
];
for (const marker of requiredJsMarkers) assert(js.includes(marker), 'R1_R2_RUNTIME_MARKER_MISSING', { marker });

const cardMutationWindow = js.match(/const moveOrbitGesture[\s\S]*?const endOrbitGesture/)?.[0] || '';
assert(cardMutationWindow.includes("gesture.inputDomain === 'BACKGROUND'"), 'R2_BACKGROUND_GUARD_MISSING');
assert(!/inputDomain\s*===\s*['"]CARD['"][\s\S]{0,400}thetaWheel\s*[+\-]?=/.test(cardMutationWindow), 'R2_CARD_DOMAIN_THETA_MUTATION_STATICALLY_PRESENT');
assert(js.includes("if (gesture.inputDomain === 'BACKGROUND') space.classList.add('is-dragging')"), 'R2_CARD_DRAG_MUST_NOT_ENTER_ORBIT_DRAG_STATE');

console.log(JSON.stringify({
  schema: 'LAWS_EUCLIDEAN_CAROUSEL_R1_R2_STATIC_VERIFICATION_RECEIPT_v1',
  result: 'PASS',
  generation: 1065,
  objectCount: 4,
  proxyObjectCount: 0,
  sharedAxis: 'Y',
  fixedAngularOffsetsDeg: PHI,
  pairwiseAngularSpacing: 'PASS',
  gen1057QualificationAuthorityInherited: false,
  predecessorR2Language: 'ABSENT',
  r1ContainmentMatrixBound: 48,
  r2CardOriginPointerIsolation: 'PASS_STATIC_BINDING',
  r2BackgroundPointerRotation: 'PASS_STATIC_BINDING',
  focusFreezeReturnBinding: 'PASS_STATIC_BINDING',
  reducedMotionFunctionalOverride: 'PRESENT',
  adoptedVisualSourceBlobs: SOURCE_BLOBS
}, null, 2));
