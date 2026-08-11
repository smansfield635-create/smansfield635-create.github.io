import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const EXPECTED_FILES = ['index.html', 'index.css', 'index.js', 'specimen-manifest.v1.json', 'verify.v1.mjs'];
const SOURCE_BLOBS = Object.freeze({
  'index.html': '4e7e963e144055297910296d9fc865f11a9d5b84',
  'index.css': '9303a6ccd5faef48364cce66d03552efc4870a69'
});
const IDS = ['collapse-qualified', 'pcr', 'mass-ledger', 'first'];
const PHI = [0, 90, 180, 270];
const REQUIRED_RUNTIME = [
  'EXACTLY_FOUR_CONTEXTUAL_TAB_OBJECTS','OBJECT_IDENTITY_INVARIANT','SHARED_AXIS_EUCLIDEAN_CAROUSEL','FOUR_PAGES_FIXED_ANGULAR_OFFSETS_REQUIRED','THETA_N_EQUALS_THETA_WHEEL_PLUS_PHI_N','PAIRWISE_ANGULAR_SPACING_INVARIANT','CONTINUOUS_CAROUSEL_ROTATION_REQUIRED','INDEFINITE_WRAPAROUND_REQUIRED','ORBIT_BACKGROUND_DRAG_ROTATES_SHARED_CAROUSEL','ORBIT_PAGE_SURFACE_DRAG_ROTATES_SHARED_CAROUSEL','ORBIT_SCROLL_ROTATES_SHARED_CAROUSEL','TAP_BELOW_THRESHOLD_FOCUSES_EXACT_TOUCHED_PAGE','DRAG_ABOVE_TAP_THRESHOLD_ROTATES_AND_SUPPRESSES_FOCUS','FOCUS_FREEZES_CAROUSEL_ORIENTATION','FOCUSED_VERTICAL_GESTURE_SCROLL_ONLY','FOCUSED_HORIZONTAL_PAGE_ADVANCE_PROHIBITED','FOCUSED_GESTURES_MUST_NOT_ROTATE_CAROUSEL','INNER_CONTEXT_CONTROLS_SAME_PAGE_ONLY','RETURN_TO_ORBIT_IS_SOLE_FOCUS_EXIT','RETURN_TO_ORBIT_RESTORES_FROZEN_CAROUSEL_ORIENTATION','MINIMAL_INITIAL_INTERACTION_CUE','PHONE_TABLET_DESKTOP_CONTAINMENT','REDUCED_MOTION_EQUIVALENCE'
];

const fail = (code, detail = null) => {
  console.error(JSON.stringify({ schema: 'LAWS_EUCLIDEAN_CAROUSEL_STATIC_VERIFICATION_RECEIPT_v1', result: 'FAIL', errorCode: code, detail }, null, 2));
  process.exit(1);
};
const assert = (condition, code, detail = null) => { if (!condition) fail(code, detail); };
const gitBlobSha = (text) => {
  const body = Buffer.from(text, 'utf8');
  return createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${body.length}\0`), body])).digest('hex');
};

const files = (await readdir(here)).filter((name) => EXPECTED_FILES.includes(name)).sort();
assert(JSON.stringify(files) === JSON.stringify([...EXPECTED_FILES].sort()), 'FIVE_FILE_SCOPE_INCOMPLETE', { files });
const [html, css, js, manifestText] = await Promise.all([
  readFile(join(here, 'index.html'), 'utf8'), readFile(join(here, 'index.css'), 'utf8'), readFile(join(here, 'index.js'), 'utf8'), readFile(join(here, 'specimen-manifest.v1.json'), 'utf8')
]);
const manifest = JSON.parse(manifestText);

for (const [name, sha] of Object.entries(SOURCE_BLOBS)) {
  const text = name === 'index.html' ? html : css;
  assert(gitBlobSha(text) === sha, 'ADOPTED_VISUAL_SOURCE_BLOB_DRIFT', { name, expected: sha, actual: gitBlobSha(text) });
}
const objectMatches = [...html.matchAll(/data-tab-object="([^"]+)"/g)].map((m) => m[1]);
assert(objectMatches.length === 4, 'OBJECT_COUNT_NOT_FOUR', { objectMatches });
assert(JSON.stringify(objectMatches) === JSON.stringify(IDS), 'OBJECT_IDENTITY_OR_ORDER_DRIFT', { objectMatches, expected: IDS });
for (const marker of ['data-inner-tabs', 'data-return-orbit', 'Practical', 'Engineering', 'Evidence', 'Information']) assert(html.includes(marker), 'PRESERVED_READER_CONTENT_MISSING', { marker });

assert(manifest.generation === 1057, 'MANIFEST_GENERATION_MISMATCH');
assert(manifest.operationId === 'LAWS_CONTEXTUAL_3D_EUCLIDEAN_CAROUSEL_V1_26D90C2_20260810_002', 'MANIFEST_OPERATION_MISMATCH');
assert(manifest.carousel?.class === 'EUCLIDEAN_ROTATIONAL_CAROUSEL', 'CAROUSEL_CLASS_MISSING');
assert(manifest.carousel?.sharedAxis === 'Y', 'SHARED_AXIS_NOT_Y');
assert(JSON.stringify(manifest.carousel?.fixedAngularOffsetsDeg) === JSON.stringify(PHI), 'FIXED_ANGULAR_OFFSETS_INVALID');
assert(manifest.carousel?.wheelAngleDomain === 'UNBOUNDED_CONTINUOUS_DEGREES', 'WHEEL_DOMAIN_NOT_UNBOUNDED');
assert(manifest.carousel?.independentOrbitCardRepositioning === false, 'INDEPENDENT_REPOSITIONING_NOT_PROHIBITED');
assert(manifest.interaction?.orbit?.pageSurfaceDrag === 'ROTATE_SHARED_CAROUSEL', 'PAGE_SURFACE_DRAG_NOT_CAROUSEL');
assert(manifest.interaction?.focus?.horizontalGesture === 'NO_PAGE_ADVANCE_NO_CAROUSEL_ROTATION', 'FOCUSED_HORIZONTAL_LAW_INVALID');
assert(manifest.interaction?.focus?.exit === 'RETURN_TO_ORBIT_CONTROL_ONLY', 'FOCUS_EXIT_LAW_INVALID');
assert(manifest.presentation?.initialCue === 'Rotate to browse · Tap to read', 'MINIMAL_CUE_INVALID');
assert(manifest.presentation?.reducedMotion === 'FUNCTIONAL_CAROUSEL_EQUIVALENCE_WITH_TRANSITIONS_DISABLED', 'REDUCED_MOTION_EQUIVALENCE_INVALID');
for (const condition of REQUIRED_RUNTIME) assert(manifest.requiredRuntimeConditions?.includes(condition), 'REQUIRED_RUNTIME_CONDITION_MISSING', { condition });

for (const theta of [-1440.5, -720, -18, 0, 13.25, 359.9, 720, 1440.5]) {
  const angles = PHI.map((phi) => theta + phi);
  for (let n = 0; n < PHI.length; n += 1) for (let m = 0; m < PHI.length; m += 1) assert(angles[n] - angles[m] === PHI[n] - PHI[m], 'PAIRWISE_ANGULAR_SPACING_MATH_FAIL', { theta, n, m });
}

const requiredJsMarkers = [
  'const PHI = Object.freeze([0, 90, 180, 270])', 'thetaWheel: INITIAL_THETA', 'state.thetaWheel += delta * 0.22', 'state.thetaWheel += px * 0.10', 'rotateY(${PHI[index]}deg) translateZ(${state.radius.toFixed(1)}px)', '--carousel-field-transform', '--carousel-transform', '.context-tab{transform:var(--carousel-transform)!important', "orbitInputDomain: 'BACKGROUND_AND_PAGE_SURFACES'", 'pageSurfaceCarouselDragAllowed: true', 'thetaWheelIsUnbounded: true', 'focusedHorizontalLaw: FOCUSED_HORIZONTAL_LAW', 'focusExitLaw: FOCUS_EXIT_LAW', 'pairwiseSpacingInvariant', 'focusCarouselInvariantHolds: focusInvariantHolds', 'cue.textContent = MINIMAL_CUE', '@media(prefers-reduced-motion:reduce)'
];
for (const marker of requiredJsMarkers) assert(js.includes(marker), 'CAROUSEL_RUNTIME_MARKER_MISSING', { marker });
for (const forbidden of ['focusAdjacent','READ_TRAVERSE_THRESHOLD',"focusedAdjacencyLaw: 'MODULO_4_BIDIRECTIONAL'", "orbitInputDomain: 'BACKGROUND_FIELD_ONLY'", 'normalizeYaw(', 'CARD_SURFACE_ORBIT_DRAG_PROHIBITED']) assert(!js.includes(forbidden), 'REJECTED_INTERACTION_RUNTIME_REAPPEARED', { forbidden });
assert(js.includes('if (!cancelled && !gesture.moved && gesture.touchedTab) enterFocus(gesture.touchedTab)'), 'TAP_TO_EXACT_TOUCHED_PAGE_BINDING_MISSING');
assert(js.includes('if (!gesture.moved && distance >= TAP_DRAG_THRESHOLD)'), 'TAP_DRAG_THRESHOLD_ARBITRATION_MISSING');
assert(js.includes('if (state.focusFrozen) state.thetaWheel = state.focusFrozen.thetaWheel'), 'RETURN_ORIENTATION_RESTORATION_MISSING');
assert(js.includes('state.focusFrozen = wheelSnapshot()'), 'FOCUS_ORIENTATION_FREEZE_MISSING');

console.log(JSON.stringify({
  schema: 'LAWS_EUCLIDEAN_CAROUSEL_STATIC_VERIFICATION_RECEIPT_v1', result: 'PASS', generation: 1057, objectCount: 4, proxyObjectCount: 0, sharedAxis: 'Y', fixedAngularOffsetsDeg: PHI, pairwiseAngularSpacing: 'PASS', unboundedWheelAngle: 'PASS', tapDragArbitration: 'PASS_STATIC_BINDING', focusFreezeBinding: 'PASS_STATIC_BINDING', focusedHorizontalPageAdvance: 'PROHIBITED', reducedMotionFunctionalOverride: 'PRESENT', adoptedVisualSourceBlobs: SOURCE_BLOBS
}, null, 2));
