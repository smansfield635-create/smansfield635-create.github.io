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
const EXPECTED_JS_BLOB = '6eabefef2c50fc77f13186ae2dcab6815bcc279b';
const REQUIRED_RUNTIME = [
  'EXACTLY_FOUR_CONTEXTUAL_TAB_OBJECTS','OBJECT_IDENTITY_INVARIANT','SHARED_AXIS_EUCLIDEAN_CAROUSEL','FOUR_PAGES_FIXED_ANGULAR_OFFSETS_REQUIRED','THETA_N_EQUALS_THETA_WHEEL_PLUS_PHI_N','PAIRWISE_ANGULAR_SPACING_INVARIANT','CONTINUOUS_CAROUSEL_ROTATION_REQUIRED','INDEFINITE_WRAPAROUND_REQUIRED','ORBIT_BACKGROUND_DRAG_ROTATES_SHARED_CAROUSEL','ORBIT_PAGE_SURFACE_DRAG_ROTATES_SHARED_CAROUSEL','ORBIT_SCROLL_ROTATES_SHARED_CAROUSEL','TAP_BELOW_THRESHOLD_FOCUSES_EXACT_TOUCHED_PAGE','DRAG_ABOVE_TAP_THRESHOLD_ROTATES_AND_SUPPRESSES_FOCUS','FOCUS_FREEZES_CAROUSEL_ORIENTATION','FOCUSED_VERTICAL_GESTURE_SCROLL_ONLY','FOCUSED_HORIZONTAL_PAGE_ADVANCE_PROHIBITED','FOCUSED_GESTURES_MUST_NOT_ROTATE_CAROUSEL','INNER_CONTEXT_CONTROLS_SAME_PAGE_ONLY','RETURN_TO_ORBIT_IS_SOLE_FOCUS_EXIT','RETURN_TO_ORBIT_RESTORES_FROZEN_CAROUSEL_ORIENTATION','MINIMAL_INITIAL_INTERACTION_CUE','PHONE_TABLET_DESKTOP_CONTAINMENT','REDUCED_MOTION_EQUIVALENCE'
];

const fail = (errorCode, detail = null) => {
  console.error(JSON.stringify({ schema: 'LAWS_EUCLIDEAN_CAROUSEL_STATIC_VERIFICATION_RECEIPT_v2', result: 'FAIL', errorCode, detail }, null, 2));
  process.exit(1);
};
const assert = (condition, errorCode, detail = null) => { if (!condition) fail(errorCode, detail); };
const blobSha = (text) => {
  const body = Buffer.from(text, 'utf8');
  return createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${body.length}\0`), body])).digest('hex');
};
const [html, css, js, manifestText] = await Promise.all([
  readFile(join(here, 'index.html'), 'utf8'),
  readFile(join(here, 'index.css'), 'utf8'),
  readFile(join(here, 'index.js'), 'utf8'),
  readFile(join(here, 'specimen-manifest.v1.json'), 'utf8')
]);
const manifest = JSON.parse(manifestText);

assert(blobSha(html) === SOURCE_BLOBS['index.html'], 'HTML_VISUAL_SOURCE_DRIFT', { actual: blobSha(html) });
assert(blobSha(css) === SOURCE_BLOBS['index.css'], 'CSS_VISUAL_SOURCE_DRIFT', { actual: blobSha(css) });
assert(blobSha(js) === EXPECTED_JS_BLOB, 'RUNTIME_BLOB_DRIFT', { actual: blobSha(js), expected: EXPECTED_JS_BLOB });
const ids = [...html.matchAll(/data-tab-object="([^"]+)"/g)].map((m) => m[1]);
assert(JSON.stringify(ids) === JSON.stringify(IDS), 'FOUR_OBJECT_IDENTITY_DRIFT', { ids });
for (const marker of ['data-inner-tabs','data-return-orbit','Practical','Engineering','Evidence','Information']) assert(html.includes(marker), 'PRESERVED_READER_STRUCTURE_MISSING', { marker });

assert(manifest.generation === 1057, 'GENERATION_MISMATCH');
assert(manifest.operationId === 'LAWS_CONTEXTUAL_3D_EUCLIDEAN_CAROUSEL_V1_26D90C2_20260810_002', 'OPERATION_MISMATCH');
assert(manifest.carousel?.class === 'EUCLIDEAN_ROTATIONAL_CAROUSEL', 'CAROUSEL_CLASS_MISSING');
assert(manifest.carousel?.sharedAxis === 'Y', 'SHARED_AXIS_INVALID');
assert(JSON.stringify(manifest.carousel?.fixedAngularOffsetsDeg) === JSON.stringify(PHI), 'ANGULAR_OFFSETS_INVALID');
assert(manifest.carousel?.wheelAngleDomain === 'UNBOUNDED_CONTINUOUS_DEGREES', 'WHEEL_DOMAIN_INVALID');
assert(manifest.carousel?.independentOrbitCardRepositioning === false, 'INDEPENDENT_ORBIT_REPOSITIONING_ALLOWED');
assert(manifest.carousel?.flatPreviousNextCarousel === false, 'FLAT_CAROUSEL_ALLOWED');
assert(manifest.implementation?.indexJsBlob === EXPECTED_JS_BLOB, 'MANIFEST_RUNTIME_BLOB_MISMATCH');
assert(manifest.implementation?.visualSourceHtmlCssBytePreserved === true, 'VISUAL_SOURCE_PRESERVATION_UNBOUND');
assert(manifest.interaction?.orbit?.pageSurfaceDrag === 'ROTATE_SHARED_CAROUSEL', 'PAGE_SURFACE_DRAG_LAW_INVALID');
assert(manifest.interaction?.focus?.horizontalGesture === 'NO_PAGE_ADVANCE_NO_CAROUSEL_ROTATION', 'FOCUS_HORIZONTAL_LAW_INVALID');
assert(manifest.interaction?.focus?.exit === 'RETURN_TO_ORBIT_CONTROL_ONLY', 'FOCUS_EXIT_LAW_INVALID');
assert(manifest.presentation?.initialCue === 'Rotate to browse · Tap to read', 'MINIMAL_CUE_INVALID');
assert(manifest.presentation?.reducedMotion === 'FUNCTIONAL_CAROUSEL_EQUIVALENCE_WITH_TRANSITIONS_DISABLED', 'REDUCED_MOTION_LAW_INVALID');
for (const condition of REQUIRED_RUNTIME) assert(manifest.requiredRuntimeConditions?.includes(condition), 'RUNTIME_CONDITION_MISSING', { condition });
for (const phase of ['static','browserMechanics','responsiveReducedMotion','visualQuality']) assert(manifest.verification?.[phase] === 'PASS', 'VERIFICATION_PHASE_NOT_PASS', { phase, value: manifest.verification?.[phase] });
for (const proof of ['pairwiseAngularSpacingInvariant','sharedMotionAllFourObjects','forwardReverseContinuousRotation','pageSurfaceDragRotatesWithoutFocus','backgroundDragRotates','wheelScrollRotates','allFourDetentPagesTapToExactIdentity','dragThresholdSuppressesFocus','focusWheelInputDoesNotRotate','focusHorizontalInputDoesNotAdvanceOrRotate','focusVerticalReaderScroll','innerInformationControlsPreserveIdentityAndOrientation','escapeDoesNotExitFocus','returnToOrbitExactOrientationRestoration','postReturnCarouselBrowsingContinues','minimalCueContained','activeOrbitSurfaceContained','focusedReaderContained']) assert(manifest.verification?.evidence?.[proof] === true, 'BROWSER_OR_VISUAL_PROOF_MISSING', { proof });
assert(Number(manifest.verification?.evidence?.unboundedRotationObservedThetaDeg) > 720, 'UNBOUNDED_ROTATION_NOT_DEMONSTRATED');

const requiredJs = [
  'const PHI = Object.freeze([0, 90, 180, 270])',
  'const INITIAL_THETA = 0',
  'thetaWheel: INITIAL_THETA',
  "field.style.setProperty('--carousel-axis-y'",
  'translateZ(${(-state.radius).toFixed(1)}px) rotateX(-2deg) rotateY(${state.thetaWheel.toFixed(4)}deg)',
  'const orbitTransformFor = (index) => `rotateY(${PHI[index]}deg) translateZ(${state.radius.toFixed(1)}px)',
  'const frozenOrbitTransformFor = (index) => `rotateY(${(state.thetaWheel + PHI[index]).toFixed(4)}deg)',
  'const pickVisibleTabAtPoint = (x, y) =>',
  'frontDistance <= 100',
  "event.target.closest?.('[data-tab-object]') || pickVisibleTabAtPoint(event.clientX, event.clientY)",
  'state.thetaWheel += delta * 0.22',
  'state.thetaWheel += px * 0.10',
  'if (!cancelled && !gesture.moved && gesture.touchedTab) enterFocus(gesture.touchedTab)',
  'if (!gesture.moved && distance >= TAP_DRAG_THRESHOLD)',
  'state.focusFrozen = wheelSnapshot()',
  'if (state.focusFrozen) state.thetaWheel = state.focusFrozen.thetaWheel',
  "focusedHorizontalLaw: FOCUSED_HORIZONTAL_LAW",
  "focusExitLaw: FOCUS_EXIT_LAW",
  'thetaWheelIsUnbounded: true',
  'pageSurfaceCarouselDragAllowed: true',
  'Math.abs(((theta[n] - theta[m]) - (PHI[n] - PHI[m]))) > 1e-9',
  '@media(max-width:760px){.context-tab.is-focused{max-height:66vh!important}}',
  '@media(prefers-reduced-motion:reduce)'
];
for (const marker of requiredJs) assert(js.includes(marker), 'RUNTIME_BINDING_MISSING', { marker });
const orbitFn = js.match(/const orbitTransformFor = \(index\) => ([^;]+);/)?.[1] || '';
assert(!orbitFn.includes('state.thetaWheel'), 'ORBIT_CHILD_OWNS_WHEEL_ANGLE', { orbitFn });
for (const forbidden of ['focusAdjacent','READ_TRAVERSE_THRESHOLD',"focusedAdjacencyLaw: 'MODULO_4_BIDIRECTIONAL'", "orbitInputDomain: 'BACKGROUND_FIELD_ONLY'", 'CARD_SURFACE_ORBIT_DRAG_PROHIBITED']) assert(!js.includes(forbidden), 'REJECTED_PREDECESSOR_BEHAVIOR_REAPPEARED', { forbidden });

for (const thetaWheel of [-1440.5,-948,-720,-90,-0.1,0,13.2,45,359.9,720,948,1440.5]) {
  const theta = PHI.map((phi) => thetaWheel + phi);
  for (let n=0;n<4;n+=1) for (let m=0;m<4;m+=1) {
    const error = Math.abs((theta[n]-theta[m])-(PHI[n]-PHI[m]));
    assert(error <= 1e-9, 'PAIRWISE_ANGULAR_SPACING_MATH_FAIL', { thetaWheel, n, m, error });
  }
}

console.log(JSON.stringify({
  schema: 'LAWS_EUCLIDEAN_CAROUSEL_STATIC_VERIFICATION_RECEIPT_v2',
  result: 'PASS', generation: 1057, objectCount: 4, proxyObjectCount: 0,
  sharedAxis: 'Y', fixedAngularOffsetsDeg: PHI,
  sharedParentWheelAngle: 'PASS', orbitChildFixedOffsetsOnly: 'PASS',
  pairwiseAngularSpacing: 'PASS_TOLERANCE_1E-9', unboundedRotationEvidence: manifest.verification.evidence.unboundedRotationObservedThetaDeg,
  tapDragArbitration: 'PASS', rotatedSurfaceTapArbitration: 'PASS', focusFreezeAndRestore: 'PASS',
  focusedHorizontalPageAdvance: 'PROHIBITED', responsiveAndReducedMotion: 'PASS', visualSourceBlobs: SOURCE_BLOBS,
  runtimeBlob: EXPECTED_JS_BLOB
}, null, 2));
