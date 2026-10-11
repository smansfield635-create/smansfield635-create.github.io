import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const expectedFiles = ['index.css','index.html','index.js','specimen-manifest.v1.json','verify.v1.mjs'].sort();
const failures = [];
const check = (condition, code, detail='') => { if (!condition) failures.push({ code, detail }); };
const blob = text => createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');

const files = (await readdir(here)).filter(name => !name.startsWith('.')).sort();
check(JSON.stringify(files) === JSON.stringify(expectedFiles), 'EXACT_FIVE_FILE_SCOPE', files.join(','));
const [html, css, js, manifestText] = await Promise.all([
  readFile(join(here,'index.html'),'utf8'), readFile(join(here,'index.css'),'utf8'),
  readFile(join(here,'index.js'),'utf8'), readFile(join(here,'specimen-manifest.v1.json'),'utf8')
]);
const manifest = JSON.parse(manifestText);
const htmlBlob = blob(html), cssBlob = blob(css), jsBlob = blob(js);

check(htmlBlob === '4e7e963e144055297910296d9fc865f11a9d5b84', 'PRESERVED_SOURCE_HTML', htmlBlob);
check(cssBlob === '9303a6ccd5faef48364cce66d03552efc4870a69', 'FINAL_CSS_BLOB', cssBlob);
check(jsBlob === 'c8da097983c5e2978c52421dfa415091beea7ef8', 'FINAL_JS_BLOB', jsBlob);
check(spawnSync(process.execPath, ['--check', join(here,'index.js')], {encoding:'utf8'}).status === 0, 'INDEX_JS_SYNTAX');

const tabIds = [...html.matchAll(/data-tab-object="([^"]+)"/g)].map(m => m[1]);
check(JSON.stringify(tabIds) === JSON.stringify(['collapse-qualified','pcr','mass-ledger','first']), 'EXACT_FOUR_OBJECT_IDENTITIES', JSON.stringify(tabIds));
check((html.match(/data-object-identity=/g)||[]).length === 4, 'FOUR_STABLE_IDENTITY_MARKERS');
check((html.match(/data-return-orbit/g)||[]).length === 4, 'FOUR_RETURN_TO_ORBIT_CONTROLS');
for (const category of ['Practical','Engineering','Evidence','Information']) check((html.match(new RegExp(`data-category-select="${category}"`,'g'))||[]).length === 4, `${category.toUpperCase()}_DIRECT_TAP_CONTROLS`);
for (const prohibited of ['<canvas','<svg','<img','<iframe','role="dialog"']) check(!html.includes(prohibited), 'NO_PROXY_OR_REPLACEMENT_SURFACE', prohibited);

for (const home of [
  'translate3d(calc(-50% - 21vw),calc(-50% - 13vh),165px)',
  'translate3d(calc(-50% + 21vw),calc(-50% - 9vh),-65px)',
  'translate3d(calc(-50% - 18vw),calc(-50% + 19vh),-145px)',
  'translate3d(calc(-50% + 20vw),calc(-50% + 20vh),65px)'
]) check(css.includes(home), 'SOURCE_HOME_GEOMETRY_PRESERVED', home);
check(css.includes('backface-visibility:hidden'), 'BACKFACE_POLICY_PRESERVED');
check(css.includes('--counter-ry:0deg') && css.includes('rotateY(var(--counter-ry))'), 'FULL_ORBIT_READABLE_FACE_COMPENSATION');
check(css.includes('max-width:calc(100vw - 32px)') && css.includes('width:calc(100vw - 20px)'), 'FOCUSED_VIEWPORT_CONTAINMENT');
check(css.includes('@media(prefers-reduced-motion:reduce)'), 'REDUCED_MOTION_EQUIVALENCE');

check(js.includes('const ORBIT_DRAG_THRESHOLD = 8;'), 'ORBIT_THRESHOLD_8PX');
check(js.includes("const targetTab = event.target.closest('.context-tab');"), 'CARD_SURFACE_ORBIT_ENTRY');
check(js.includes('space.setPointerCapture?.(event.pointerId);'), 'STABLE_POINTER_CAPTURE');
check(js.includes('Math.hypot(totalDx, totalDy) >= ORBIT_DRAG_THRESHOLD'), 'THRESHOLD_ARBITRATION');
check(js.includes('const focusTarget = shouldFocusTouchedTab ? p.targetTab : null;'), 'TAP_FOCUS_DEFERRED_AFTER_CAPTURE');
check(js.includes('if (p.crossedThreshold) state.orbitClickSuppressed = true;'), 'DRAG_RELEASE_FOCUS_SUPPRESSION');
check(js.includes('const normalizeYaw = (degrees) => ((degrees % 360) + 360) % 360;'), 'MODULO_360_YAW');
check(js.includes('state.ry = normalizeYaw(state.ry + dx * .14);') && !js.includes('state.ry = clamp(state.ry'), 'UNRESTRICTED_CONTINUOUS_YAW');
check(js.includes("document.documentElement.style.setProperty('--counter-ry', `${(-state.ry).toFixed(2)}deg`);"), 'COUNTER_YAW_BOUND_TO_ORBIT');
check(js.includes('const next = (current + direction + tabs.length) % tabs.length;'), 'MODULO4_BIDIRECTIONAL_ADJACENCY');
check(js.includes("gesture.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'horizontal' : 'vertical'"), 'FOCUSED_AXIS_LOCK_PRESERVED');
check(js.includes("if (gesture.axis === 'horizontal' && Math.abs(dx) >= 60)"), 'HORIZONTAL_FOCUSED_TRAVERSAL_PRESERVED');
check(js.includes('proxyObjectCount: 0'), 'ZERO_PROXY_RUNTIME');

check(manifest.operationId === 'LAWS_CONTEXTUAL_3D_FOUR_TAB_INTERACTION_REPAIR_V1_9476A_20260810_003' && manifest.lockGeneration === 1045, 'GEN1045_IDENTITY');
check(manifest.governingHead === '9476afe595b85f7e0e4bb696f7978bc0c62cc04d', 'GOVERNING_HEAD');
check(manifest.preservedPositiveImplementationSource?.head === '3744df3801a536c6cc0f1153f4dff23408a893aa', 'POSITIVE_SOURCE_HEAD');
check(manifest.preservedPositiveImplementationSource?.sourceBlobs?.['index.css'] === '0544dba0e40d899bd3c50469a7134f03475bab80', 'SOURCE_CSS_PROVENANCE');
check(manifest.candidateBlobs?.['index.html'] === htmlBlob && manifest.candidateBlobs?.['index.css'] === cssBlob && manifest.candidateBlobs?.['index.js'] === jsBlob, 'EXACT_CANDIDATE_BLOB_BINDING');
check(manifest.router?.result === 'PASS' && manifest.pageExcellence?.result === 'PASS' && manifest.pageExcellence?.implementationClass === 'EXISTING_CONSTRUCT_ADOPTION', 'PRECONSTRUCTION_GATES_PASS');
check(manifest.repairContract?.orbitTapDragArbitration?.crossThresholdReleaseMayFocus === false, 'MANIFEST_DRAG_NO_FOCUS');
check(manifest.repairContract?.orbitYaw?.continuous === true && manifest.repairContract?.focusedAdjacency?.wrapIndefinitelyBothDirections === true, 'MANIFEST_CONTINUOUS_YAW_AND_WRAP');
check(manifest.repairContract?.directlyNecessarySupport?.id === 'FULL_ORBIT_READABLE_FACE_COMPENSATION', 'SUPPORT_CHANGE_EXPLICITLY_BOUNDED');
check(manifest.runtimeEvidence?.status === 'PASS' && manifest.runtimeEvidence?.sha256 === '875e2c7eb09950f0e92f829ccd0f8aeb4d15f4553b514180e1fca382a2228086', 'RUNTIME_REQUALIFICATION_PASS');
check(manifest.visualMotionAdmission?.status === 'PASS' && manifest.visualMotionAdmission?.sha256 === '018cf7d99d8f4c6b899c8ca394544c4ffda5181aaaad38020bd34abeb8525566', 'FULL_ORBIT_VISUAL_MOTION_PASS');
check(manifest.visualMotionAdmission?.disposition === 'PASS_FOR_COMMIT_PINNED_INSPECTION', 'INSPECTION_ADMISSION');
check(manifest.frozenBoundaries?.htmlSemanticContent === true && manifest.frozenBoundaries?.sourceGeometryAndCompositionPreserved === true && manifest.frozenBoundaries?.fullOrbitFacingCompensationOnly === true, 'FROZEN_BOUNDARIES');
check(manifest.authority?.merge === false && manifest.authority?.production === false && manifest.authority?.semanticMutation === false && manifest.authority?.architectureRedesign === false && manifest.authority?.templateExtraction === false, 'AUTHORITY_CEILING');

const receipt = {
  schema:'LAWS_CONTEXTUAL_FOUR_TAB_INTERACTION_REPAIR_STATIC_VERIFICATION_RECEIPT_v2',
  result: failures.length ? 'FAIL' : 'PASS',
  operationId: manifest.operationId,
  lockGeneration: manifest.lockGeneration,
  candidateBlobs:{'index.html':htmlBlob,'index.css':cssBlob,'index.js':jsBlob},
  tabObjectCount:tabIds.length,
  proxyObjectCount:0,
  runtimeEvidenceSha256:manifest.runtimeEvidence?.sha256,
  visualMotionAdmissionSha256:manifest.visualMotionAdmission?.sha256,
  visualMotionDisposition:manifest.visualMotionAdmission?.disposition,
  failures
};
console.log(JSON.stringify(receipt,null,2));
if (failures.length) process.exit(1);
