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

check(htmlBlob === '4e7e963e144055297910296d9fc865f11a9d5b84', 'HTML_BYTE_FREEZE', htmlBlob);
check(cssBlob === '9303a6ccd5faef48364cce66d03552efc4870a69', 'CSS_BYTE_FREEZE', cssBlob);
check(jsBlob === '78fd11c52f074897c19352c0c703cc44eb4578bc', 'EXPECTED_REPAIRED_JS_BLOB', jsBlob);
check(spawnSync(process.execPath, ['--check', join(here,'index.js')], {encoding:'utf8'}).status === 0, 'INDEX_JS_SYNTAX');

const tabIds = [...html.matchAll(/data-tab-object="([^"]+)"/g)].map(m => m[1]);
check(JSON.stringify(tabIds) === JSON.stringify(['collapse-qualified','pcr','mass-ledger','first']), 'EXACT_FOUR_OBJECT_IDENTITIES', JSON.stringify(tabIds));
check((html.match(/data-object-identity=/g)||[]).length === 4, 'FOUR_STABLE_IDENTITY_MARKERS');
check((html.match(/data-return-orbit/g)||[]).length === 4, 'FOUR_RETURN_TO_ORBIT_CONTROLS');
for (const category of ['Practical','Engineering','Evidence','Information']) check((html.match(new RegExp(`data-category-select="${category}"`,'g'))||[]).length === 4, `${category.toUpperCase()}_SAME_OBJECT_CONTROLS`);
for (const prohibited of ['<canvas','<svg','<img','<iframe','role="dialog"']) check(!html.includes(prohibited), 'NO_PROXY_OR_REPLACEMENT_SURFACE', prohibited);

for (const home of [
  'translate3d(calc(-50% - 21vw),calc(-50% - 13vh),165px)',
  'translate3d(calc(-50% + 21vw),calc(-50% - 9vh),-65px)',
  'translate3d(calc(-50% - 18vw),calc(-50% + 19vh),-145px)',
  'translate3d(calc(-50% + 20vw),calc(-50% + 20vh),65px)'
]) check(css.includes(home), 'SOURCE_HOME_GEOMETRY_PRESERVED', home);
check(css.includes('backface-visibility:hidden'), 'BACKFACE_POLICY_PRESERVED');
check(css.includes('--counter-ry:0deg') && css.includes('rotateY(var(--counter-ry))'), 'FULL_ORBIT_READABLE_FACE_COMPENSATION_PRESERVED');
check(css.includes('@media(prefers-reduced-motion:reduce)'), 'REDUCED_MOTION_EQUIVALENCE_PRESERVED');

check(js.includes("mode: 'ORBIT'"), 'EXPLICIT_MODE_STATE_MACHINE');
check(js.includes("const INTERACTION_DOMAIN_INVARIANT = 'ORBIT_INPUT_DOMAIN_INTERSECT_FOCUSED_READER_INPUT_DOMAIN=EMPTY';"), 'INTERACTION_DOMAIN_INVARIANT');
check(js.includes("const FOCUS_TRANSFORM_INVARIANT = 'FOCUS_START_IMPLIES_T_ORBIT_EQUALS_T_FROZEN_UNTIL_RETURN_TO_ORBIT';"), 'FOCUS_TRANSFORM_INVARIANT');
check(js.includes('state.focusFrozen = orbitSnapshot();'), 'FOCUS_ENTRY_FULL_TRANSFORM_SNAPSHOT');
check(js.includes("if (event.target.closest('.context-tab')) return;"), 'BACKGROUND_ONLY_ORBIT_ENTRY');
check(js.includes('tab.setPointerCapture?.(event.pointerId);'), 'CARD_GESTURE_CAPTURE_ON_CARD');
check(js.includes('gesture.cancelled = true;'), 'CARD_THRESHOLD_CANCELS_PENDING_TAP');
check(js.includes('if (!gesture.cancelled && !platformCancelled) setFocused(tab);'), 'CARD_CANCEL_CONSUMED_NO_FOCUS');
check(js.includes("tab.addEventListener('pointercancel', (event) => endTabPointer(event, true));"), 'POINTER_CANCEL_NON_ACTION');
check(js.includes("orbitInputDomain: 'BACKGROUND_FIELD_ONLY'"), 'RUNTIME_BACKGROUND_ONLY_DOMAIN');
check(js.includes('cardSurfaceOrbitDragAllowed: false'), 'RUNTIME_CARD_ORBIT_PROHIBITION');
check(js.includes("cardDragThresholdDisposition: 'CANCEL_AND_CONSUME_WITHOUT_ORBIT_MUTATION'"), 'RUNTIME_CARD_CANCEL_DISPOSITION');
check(js.includes("focusExitLaw: 'RETURN_TO_ORBIT_CONTROL_ONLY'"), 'RUNTIME_SOLE_FOCUS_EXIT');
check(js.includes('escapeMayExitFocus: false'), 'RUNTIME_ESCAPE_NO_EXIT');
check((js.match(/returnToOrbit\(\);/g)||[]).length === 1, 'SOLE_CALLSITE_RETURN_TO_ORBIT', String((js.match(/returnToOrbit\(\);/g)||[]).length));
check(js.includes("if (event.key === 'Escape' && state.mode === 'FOCUS')"), 'ESCAPE_CONSUMED_WHILE_FOCUSED');
check(!js.includes("if (event.key === 'Escape') restore();"), 'REJECT_GEN1045_DOCUMENT_ESCAPE_EXIT');
check(!js.includes("const targetTab = event.target.closest('.context-tab');"), 'REJECT_GEN1045_CARD_SURFACE_ORBIT_ENTRY');
check(!js.includes('p.targetTab'), 'REJECT_GEN1045_ORBIT_TARGET_INHERITANCE');
check(js.includes('const next = (current + direction + tabs.length) % tabs.length;'), 'MODULO4_BIDIRECTIONAL_ADJACENCY');
check(js.includes("gesture.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'horizontal' : 'vertical'"), 'FOCUSED_AXIS_LOCK');
check(js.includes('focusOrbitInvariant: focusOrbitInvariantHolds()'), 'RUNTIME_FOCUS_TRANSFORM_ASSERTION_SURFACE');
check(js.includes('proxyObjectCount: 0'), 'ZERO_PROXY_RUNTIME');

check(manifest.operationId === 'LAWS_CONTEXTUAL_3D_FOUR_TAB_INTERACTION_REPAIR_V1_9476A_20260810_006' && manifest.lockGeneration === 1048, 'GEN1048_IDENTITY');
check(manifest.governingHead === '9476afe595b85f7e0e4bb696f7978bc0c62cc04d', 'GOVERNING_HEAD');
check(manifest.preservedVisualImplementationSource?.head === '45fc593408d766504e5a1f74c1e53fb7f33b74a4', 'VISUAL_SOURCE_HEAD');
check(manifest.rejectedInteractionReference?.positiveInteractionAuthority === false, 'REJECTED_INTERACTION_NOT_POSITIVE_AUTHORITY');
check(manifest.candidateBlobs?.['index.html'] === htmlBlob && manifest.candidateBlobs?.['index.css'] === cssBlob && manifest.candidateBlobs?.['index.js'] === jsBlob, 'EXACT_CANDIDATE_BLOB_BINDING');
check(manifest.router?.result === 'PASS' && manifest.router?.nativeReceiptDigest === '7cddd52a79a92b2816beff8bf60fe139b499ac10298b95901a91ae4d6e7282ea', 'ROUTER_PASS');
check(manifest.pageExcellence?.result === 'PASS' && manifest.pageExcellence?.implementationClass === 'EXISTING_CONSTRUCT_ADOPTION' && manifest.pageExcellence?.nativeReceiptDigest === '94f62901d57166823fd8b0cfd075c099100c503c41c0e7e3ddc9ebfcfb7dcac2', 'PAGE_EXCELLENCE_ARCHITECTURE_PASS');
check(manifest.designLaw?.interactionDomainInvariant === 'ORBIT_INPUT_DOMAIN_INTERSECT_FOCUSED_READER_INPUT_DOMAIN=EMPTY', 'MANIFEST_INTERACTION_DOMAIN_INVARIANT');
check(manifest.designLaw?.focusTransformInvariant === 'FOCUS_START_IMPLIES_T_ORBIT_EQUALS_T_FROZEN_UNTIL_RETURN_TO_ORBIT', 'MANIFEST_FOCUS_TRANSFORM_INVARIANT');
check(manifest.repairContract?.orbitTapDragArbitration?.cardSurfaceOrbitDrag === false, 'MANIFEST_CARD_SURFACE_ORBIT_PROHIBITED');
check(manifest.repairContract?.orbitTapDragArbitration?.crossThreshold === 'CANCEL_AND_CONSUME_CARD_GESTURE_WITHOUT_FOCUS_OR_ORBIT_MUTATION', 'MANIFEST_CARD_CANCEL_CONSUME');
check(manifest.repairContract?.orbit?.inputDomain === 'BACKGROUND_FIELD_ONLY' && manifest.repairContract?.orbit?.continuous === true, 'MANIFEST_BACKGROUND_ONLY_CONTINUOUS_ORBIT');
check(manifest.repairContract?.focus?.soleExit === 'RETURN_TO_ORBIT_CONTROL' && manifest.repairContract?.focus?.escapeMayExit === false && manifest.repairContract?.focus?.immutableUntilReturn === true, 'MANIFEST_STICKY_FOCUS_AND_IMMUTABLE_ORBIT');
check(manifest.repairContract?.focusedAdjacency?.minimumConsecutiveEachDirection === 8 && manifest.repairContract?.focusedAdjacency?.wrapIndefinitelyBothDirections === true, 'MANIFEST_MOD4_STRESS_REQUIREMENT');
check(manifest.frozenBoundaries?.htmlByteFrozen === true && manifest.frozenBoundaries?.cssByteFrozen === true && manifest.frozenBoundaries?.htmlBlob === htmlBlob && manifest.frozenBoundaries?.cssBlob === cssBlob, 'FROZEN_VISUAL_BYTES');

if (manifest.runtimeEvidence?.status === 'PASS') {
  const c = manifest.runtimeEvidence.checks || {};
  for (const key of ['backgroundOrbitContinuous360','eachCardTapFocusExact','eachCardDragCancelNoOrbitMutation','eightLeftModulo4','eightRightModulo4','mixedFocusOperationsTransformImmutable','returnToOrbitSoleExit','escapeNoExit','returnPreservesFrozenOrientation','phonePass','tabletPass','desktopPass','reducedMotionPass']) check(c[key] === true, `RUNTIME_${key.toUpperCase()}`);
  check(typeof manifest.runtimeEvidence.sha256 === 'string' && /^[0-9a-f]{64}$/.test(manifest.runtimeEvidence.sha256), 'RUNTIME_EVIDENCE_DIGEST');
}
if (manifest.visualMotionAdmission?.status === 'PASS') {
  check(manifest.visualMotionAdmission?.disposition === 'PASS_FOR_COMMIT_PINNED_INSPECTION', 'INSPECTION_ADMISSION');
  check(typeof manifest.visualMotionAdmission.sha256 === 'string' && /^[0-9a-f]{64}$/.test(manifest.visualMotionAdmission.sha256), 'VISUAL_MOTION_EVIDENCE_DIGEST');
  check(manifest.visualMotionAdmission?.fullOrbit?.compositionDisposition === 'PASS', 'FULL_ORBIT_COMPOSITION_PASS');
}
check(manifest.authority?.merge === false && manifest.authority?.production === false && manifest.authority?.semanticMutation === false && manifest.authority?.architectureRedesign === false && manifest.authority?.templateExtraction === false, 'AUTHORITY_CEILING');

const receipt = {
  schema:'LAWS_CONTEXTUAL_FOUR_TAB_INTERACTION_STATE_ISOLATION_STATIC_VERIFICATION_RECEIPT_v3',
  result: failures.length ? 'FAIL' : 'PASS',
  operationId: manifest.operationId,
  lockGeneration: manifest.lockGeneration,
  candidateBlobs:{'index.html':htmlBlob,'index.css':cssBlob,'index.js':jsBlob},
  tabObjectCount:tabIds.length,
  proxyObjectCount:0,
  runtimeEvidenceStatus:manifest.runtimeEvidence?.status,
  visualMotionAdmissionStatus:manifest.visualMotionAdmission?.status,
  negativeRegressionAssertions:6,
  failures
};
console.log(JSON.stringify(receipt,null,2));
if (failures.length) process.exit(1);
