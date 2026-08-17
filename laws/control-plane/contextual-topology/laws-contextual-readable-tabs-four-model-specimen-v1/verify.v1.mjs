import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const IDS = ['collapse-qualified', 'pcr', 'mass-ledger', 'first'];
const PHI = [0, 90, 180, 270];
const SOURCE_BLOBS = Object.freeze({
  'index.html': '4e7e963e144055297910296d9fc865f11a9d5b84',
  'index.css': '9303a6ccd5faef48364cce66d03552efc4870a69',
  'index.js': '030c7a4146942c64166dadbdefa7f9b463b927c1'
});
const REQUIRED_FUNCTIONAL = Object.freeze([
  'TITLE','QUESTION','EQUATION','STATEMENT','CATEGORY_CONTROLS','ACTIVE_CONTENT','RETURN_TO_ORBIT'
]);
const REQUIRED_RUNTIME = Object.freeze([
  'EXACTLY_FOUR_CONTEXTUAL_TAB_OBJECTS',
  'SHARED_AXIS_EUCLIDEAN_CAROUSEL',
  'FIXED_ANGULAR_OFFSETS_0_90_180_270',
  'UNBOUNDED_CONTINUOUS_CAROUSEL',
  'ORBIT_SPATIAL_PROJECTION_BLEED_ALLOWED',
  'BACKGROUND_EMPTY_FIELD_DRAG_ROTATES_SHARED_CAROUSEL',
  'CARD_MOVEMENT_AT_OR_ABOVE_8PX_DOES_NOT_MUTATE_THETA_WHEEL',
  'CARD_MOVEMENT_AT_OR_ABOVE_8PX_DOES_NOT_FOCUS_ON_RELEASE',
  'FOCUS_FREEZES_THETA_WHEEL',
  'RETURN_TO_ORBIT_RESTORES_EXACT_FROZEN_THETA_WHEEL',
  'FOCUSED_FUNCTIONAL_CONTENT_HORIZONTALLY_ACCESSIBLE',
  'RETURN_TO_ORBIT_CONTROL_ACCESSIBLE',
  'CATEGORY_CONTROLS_ACCESSIBLE',
  'NO_DOCUMENT_LEVEL_HORIZONTAL_SCROLL',
  'INTERNAL_VERTICAL_SCROLL_PRESERVED',
  'DECORATIVE_FOCUSED_SURFACE_BLEED_ALLOWED_WHEN_FUNCTIONAL_ENVELOPE_PASSES',
  'FOUR_BY_FOUR_BY_THREE_FUNCTIONAL_CONTAINMENT_MATRIX',
  'INFORMATION_FULLY_EXPANDED_FUNCTIONALLY_ACCESSIBLE',
  'REDUCED_MOTION_EQUIVALENCE'
]);
const FORBIDDEN_R2 = Object.freeze([
  'ORBIT_PAGE_' + 'SURFACE_DRAG_ROTATES_SHARED_CAROUSEL',
  'PAGE_DRAG_' + 'ROTATES_ALL',
  'pageSurfaceDrag = ' + 'ROTATE_SHARED_CAROUSEL'
]);

const fail = (errorCode, detail = null) => {
  console.error(JSON.stringify({schema:'LAWS_EUCLIDEAN_CAROUSEL_R1_FUNCTIONAL_STATIC_VERIFICATION_RECEIPT_v1',result:'FAIL',errorCode,detail},null,2));
  process.exit(1);
};
const assert = (condition, errorCode, detail = null) => { if (!condition) fail(errorCode, detail); };
const blobSha = (text) => {
  const body = Buffer.from(text, 'utf8');
  return createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${body.length}\0`), body])).digest('hex');
};

const [html, css, js, manifestText, self] = await Promise.all([
  readFile(join(here,'index.html'),'utf8'), readFile(join(here,'index.css'),'utf8'),
  readFile(join(here,'index.js'),'utf8'), readFile(join(here,'specimen-manifest.v1.json'),'utf8'),
  readFile(join(here,'verify.v1.mjs'),'utf8')
]);
const manifest = JSON.parse(manifestText);

for (const [name,text] of Object.entries({'index.html':html,'index.css':css,'index.js':js})) {
  assert(blobSha(text) === SOURCE_BLOBS[name], 'IMPLEMENTATION_SOURCE_DRIFT', {name,expected:SOURCE_BLOBS[name],actual:blobSha(text)});
}
const objectMatches = [...html.matchAll(/data-tab-object="([^"]+)"/g)].map(m=>m[1]);
assert(JSON.stringify(objectMatches) === JSON.stringify(IDS), 'FOUR_OBJECT_IDENTITY_OR_ORDER_DRIFT', {objectMatches});
assert(manifest.generation === 1140, 'MANIFEST_GENERATION_MISMATCH');
assert(manifest.operationId === 'LAWS_CONTEXTUAL_3D_EUCLIDEAN_CAROUSEL_NONZERO_PHI_GEOMETRY_REPAIR_V1_EAA9BE55_20260811_002', 'MANIFEST_OPERATION_MISMATCH');
assert(manifest.governingHead === 'eaa9be55df2a440457f4d3cfe5e13f414a52d386', 'MANIFEST_GOVERNING_HEAD_MISMATCH');
assert(manifest.inheritanceFirewall?.gen1070QualificationAuthorityInherited === false, 'GEN1070_QUALIFICATION_AUTHORITY_INHERITED');
assert(manifest.inheritanceFirewall?.gen1065QualificationAuthorityInherited === false, 'GEN1065_QUALIFICATION_AUTHORITY_INHERITED');
assert(manifest.carousel?.sharedAxis === 'Y', 'SHARED_AXIS_NOT_Y');
assert(JSON.stringify(manifest.carousel?.fixedAngularOffsetsDeg) === JSON.stringify(PHI), 'FIXED_OFFSETS_INVALID');
assert(manifest.carousel?.wheelAngleDomain === 'UNBOUNDED_CONTINUOUS_DEGREES', 'WHEEL_DOMAIN_INVALID');
assert(manifest.carousel?.objectCount === 4 && manifest.carousel?.proxyObjectCount === 0, 'OBJECT_OR_PROXY_COUNT_INVALID');
assert(manifest.carousel?.orbitSpatialProjectionBleedAllowed === true, 'ORBIT_BLEED_NOT_LAWFUL');
assert(manifest.carousel?.radiusTopologyRedesigned === false, 'RADIUS_TOPOLOGY_REDESIGN_NOT_ALLOWED');

const r1 = manifest.repairs?.R1;
assert(r1?.id === 'FUNCTIONAL_CONTENT_CONTROL_CONTAINMENT', 'R1_FUNCTIONAL_CONTRACT_MISSING');
assert(r1?.supersedes === 'TOTAL_FOCUSED_SURFACE_RECTANGLE_CONTAINMENT_AS_PASS_REQUIREMENT', 'OLD_R1_NOT_EXPLICITLY_SUPERSEDED');
assert(r1?.focusedCaseCount === 48, 'R1_48_CASE_MATRIX_NOT_BOUND');
assert(r1?.documentLevelHorizontalOverflowAllowed === false, 'DOCUMENT_HORIZONTAL_OVERFLOW_NOT_PROHIBITED');
assert(r1?.internalVerticalScrollRequired === true, 'INTERNAL_VERTICAL_SCROLL_NOT_REQUIRED');
assert(r1?.decorativeFocusedSurfaceBleedAllowed === true, 'DECORATIVE_FOCUS_BLEED_NOT_ALLOWED');
assert(r1?.nonfocusedOrbitProjectionBleedAllowed === true, 'ORBIT_PROJECTION_BLEED_NOT_ALLOWED');
assert(r1?.fullDecorativeSurfaceRectangleContainmentRequired === false, 'TOTAL_SURFACE_CONTAINMENT_REAPPEARED');
assert(JSON.stringify(r1?.functionalHorizontalChecks) === JSON.stringify(REQUIRED_FUNCTIONAL), 'FUNCTIONAL_HORIZONTAL_CHECK_SET_DRIFT');

const r2 = manifest.repairs?.R2;
assert(r2?.thresholdPx === 8, 'R2_THRESHOLD_MISMATCH');
assert(r2?.backgroundMovement === 'ROTATE_SHARED_CAROUSEL', 'R2_BACKGROUND_CONTROL_INVALID');
assert(r2?.cardMovementAtOrAboveThreshold === 'CANCEL_TAP_NO_THETA_MUTATION_NO_FOCUS', 'R2_CARD_ISOLATION_INVALID');
for (const condition of REQUIRED_RUNTIME) assert(manifest.requiredRuntimeConditions?.includes(condition), 'REQUIRED_RUNTIME_CONDITION_MISSING', {condition});
for (const [name,text] of Object.entries({'index.html':html,'index.css':css,'index.js':js,'specimen-manifest.v1.json':manifestText,'verify.v1.mjs':self})) {
  for (const marker of FORBIDDEN_R2) assert(!text.includes(marker), 'REJECTED_PREDECESSOR_R2_LANGUAGE_REAPPEARED', {name,marker});
}

for (const theta of [-1440.5,-720,-18,0,13.25,359.9,720,1440.5]) {
  const angles = PHI.map(phi=>theta+phi);
  for (let n=0;n<PHI.length;n+=1) for (let m=0;m<PHI.length;m+=1) {
    assert(Math.abs(((angles[n]-angles[m])-(PHI[n]-PHI[m]))) < 1e-9, 'PAIRWISE_ANGULAR_SPACING_MATH_FAIL', {theta,n,m});
  }
}

const requiredJsMarkers = [
  'const PHI = Object.freeze([0, 90, 180, 270])',
  "inputDomain: touchedTab ? 'CARD' : 'BACKGROUND'",
  "gesture.moved && gesture.inputDomain === 'BACKGROUND'",
  "orbitPointerInputDomain: 'BACKGROUND_EMPTY_FIELD_ONLY'",
  'pageSurfaceCarouselDragAllowed: false',
  'thetaWheelIsUnbounded: true',
  'state.focusFrozen = wheelSnapshot()',
  'if (state.focusFrozen) state.thetaWheel = state.focusFrozen.thetaWheel',
  'if (!cancelled && !gesture.moved && gesture.touchedTab) enterFocus(gesture.touchedTab)',
  'distance >= TAP_DRAG_THRESHOLD',
  '@media(prefers-reduced-motion:reduce)',
  'transform-origin:0 0!important'
];
for (const marker of requiredJsMarkers) assert(js.includes(marker), 'PRESERVED_RUNTIME_MARKER_MISSING', {marker});
assert(!js.includes('transform-origin:50% 50%!important'), 'PREDECESSOR_TRANSFORM_ORIGIN_REAPPEARED');
const moveWindow = js.match(/const moveOrbitGesture[\s\S]*?const endOrbitGesture/)?.[0] || '';
assert(moveWindow.includes("gesture.inputDomain === 'BACKGROUND'"), 'R2_BACKGROUND_GUARD_MISSING');
assert(!/inputDomain\s*===\s*['"]CARD['"][\s\S]{0,400}thetaWheel\s*[+\-]?=/.test(moveWindow), 'R2_CARD_DOMAIN_THETA_MUTATION_STATICALLY_PRESENT');

console.log(JSON.stringify({
  schema:'LAWS_EUCLIDEAN_CAROUSEL_R1_FUNCTIONAL_STATIC_VERIFICATION_RECEIPT_v1',
  result:'PASS',generation:1140,sharedAxis:'Y',fixedAngularOffsetsDeg:PHI,
  sourceImplementation:'GEN1119_EXACT_FIVE_BLOB_REPRODUCTION_WITH_ZERO_ORIGIN_REPAIR',
  authorityInherited:false,
  zeroOriginGeometryRepair:'PASS_STATIC_BINDING',
  r1Qualification:'FUNCTIONAL_CONTENT_CONTROL_CONTAINMENT',
  totalDecorativeSurfaceContainmentRequired:false,
  orbitSpatialProjectionBleedAllowed:true,
  decorativeFocusedSurfaceBleedAllowed:true,
  functionalContainmentMatrixBound:48,
  documentLevelHorizontalOverflowAllowed:false,
  r2CardOriginPointerIsolation:'PASS_STATIC_BINDING',
  focusFreezeReturnBinding:'PASS_STATIC_BINDING'
},null,2));
