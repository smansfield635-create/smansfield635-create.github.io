import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const files = await readdir(here);
const expectedFiles = ['index.css','index.html','index.js','specimen-manifest.v1.json','verify.v1.mjs'].sort();
const failures = [];
const pass = (condition, code, detail='') => { if (!condition) failures.push({code, detail}); };
const gitBlobSha = (text) => createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');

pass(JSON.stringify(files.filter((name)=>!name.startsWith('.')).sort()) === JSON.stringify(expectedFiles), 'EXACT_FIVE_FILE_SPECIMEN_SCOPE', files.join(','));

const [html, css, js, manifestText] = await Promise.all([
  readFile(join(here,'index.html'),'utf8'),
  readFile(join(here,'index.css'),'utf8'),
  readFile(join(here,'index.js'),'utf8'),
  readFile(join(here,'specimen-manifest.v1.json'),'utf8')
]);
const manifest = JSON.parse(manifestText);

pass(gitBlobSha(html) === '4e7e963e144055297910296d9fc865f11a9d5b84', 'PRESERVED_3744DF38_HTML_BLOB', gitBlobSha(html));
pass(gitBlobSha(css) === '0544dba0e40d899bd3c50469a7134f03475bab80', 'PRESERVED_3744DF38_CSS_BLOB', gitBlobSha(css));

const syntax = spawnSync(process.execPath, ['--check', join(here,'index.js')], { encoding:'utf8' });
pass(syntax.status === 0, 'INDEX_JS_SYNTAX', syntax.stderr || syntax.stdout || '');

const tabIds = [...html.matchAll(/data-tab-object="([^"]+)"/g)].map((m)=>m[1]);
const expectedIds = ['collapse-qualified','pcr','mass-ledger','first'];
pass(tabIds.length === 4, 'EXACTLY_FOUR_TAB_OBJECTS', String(tabIds.length));
pass(JSON.stringify(tabIds) === JSON.stringify(expectedIds), 'EXACT_MODEL_ORDER', JSON.stringify(tabIds));
pass((html.match(/data-object-identity=/g)||[]).length === 4, 'STABLE_OBJECT_IDENTITY_MARKERS');
pass((html.match(/data-return-orbit/g)||[]).length === 4, 'RETURN_TO_ORBIT_PER_OBJECT');
for (const category of ['Practical','Engineering','Evidence','Information']) {
  pass((html.match(new RegExp(`data-category-select="${category}"`,'g'))||[]).length === 4, `${category.toUpperCase()}_CONTROLS`);
}
pass((html.match(/data-category-panel="Information"/g)||[]).length === 4, 'INFORMATION_PANELS');
pass((html.match(/<details class="info-disclosure"/g)||[]).length === 12, 'BOUNDED_VERTICAL_DISCLOSURE');
for (const prohibited of ['<canvas','<svg','<img','<iframe','role="dialog"']) pass(!html.includes(prohibited), 'NO_PROXY_OR_REPLACEMENT_SURFACE', prohibited);
pass(!html.includes('Previous') && !html.includes('Next'), 'NO_VISIBLE_PREVIOUS_NEXT_PRIMARY_UI');

pass(css.includes('perspective:1500px') || css.includes('perspective:1050px'), 'REAL_PERSPECTIVE');
pass(css.includes('transform-style:preserve-3d'), 'PRESERVE_3D');
pass(css.includes('max-width:calc(100vw - 32px)') && css.includes('width:calc(100vw - 20px)'), 'FOCUSED_VIEWPORT_CONTAINMENT');
pass(css.includes('overflow-x:hidden'), 'NO_HORIZONTAL_CONTENT_OVERFLOW_CSS');
pass(css.includes('@media(prefers-reduced-motion:reduce)'), 'REDUCED_MOTION_EQUIVALENT');
pass(css.includes('.category-tabs'), 'INNER_CONTEXT_TAB_PRESENTATION');

pass(js.includes("OBJECT_IDENTITY_INVARIANT = 'ORBIT=FOCUS=SCROLL=PRACTICAL=ENGINEERING=EVIDENCE=INFORMATION'"), 'OBJECT_IDENTITY_INVARIANT_BOUND');
pass(js.includes('const ORBIT_DRAG_THRESHOLD = 8;'), 'ORBIT_THRESHOLD_BOUND');
pass(js.includes("const targetTab = event.target.closest('.context-tab');"), 'CARD_SURFACE_ORBIT_POINTER_ENTRY');
pass(js.includes('space.setPointerCapture?.(event.pointerId);'), 'STABLE_ORBIT_POINTER_CAPTURE');
pass(js.includes('Math.hypot(totalDx, totalDy) >= ORBIT_DRAG_THRESHOLD'), 'TAP_DRAG_THRESHOLD_ARBITRATION');
pass(js.includes('const shouldFocusTouchedTab = wasLastPointer && !p.crossedThreshold && p.targetTab instanceof Element;'), 'BELOW_THRESHOLD_TAP_FOCUS_ONLY');
pass(js.includes('if (p.crossedThreshold) state.orbitClickSuppressed = true;'), 'CROSSED_THRESHOLD_RELEASE_FOCUS_SUPPRESSED');
pass(js.includes('const normalizeYaw = (degrees) => ((degrees % 360) + 360) % 360;'), 'YAW_MODULO_360_LAW');
pass(js.includes('state.ry = normalizeYaw(state.ry + dx * .14);'), 'CONTINUOUS_YAW_IMPLEMENTED');
pass(!js.includes('state.ry = clamp(state.ry'), 'NO_NARROW_YAW_CLAMP');
pass(js.includes('const next = (current + direction + tabs.length) % tabs.length;'), 'MODULO4_FOCUSED_ADJACENCY');
pass(js.includes("gesture.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'horizontal' : 'vertical'"), 'AXIS_LOCK_PRESERVED');
pass(js.includes("if (gesture.axis === 'horizontal' && Math.abs(dx) >= 60)"), 'HORIZONTAL_ADJACENCY_THRESHOLD_PRESERVED');
pass(js.includes("state.focused !== tab"), 'ACTIVE_TAB_DOES_NOT_TOGGLE_DISMISS');
pass(js.includes("setCategory(tab, button.dataset.categorySelect)"), 'INNER_CATEGORY_DIRECT_TAP');
pass(js.includes("stableIdentity.get(state.focused.dataset.tabObject) === state.focused"), 'RUNTIME_IDENTITY_ASSERTION');
pass(js.includes('proxyObjectCount: 0'), 'RUNTIME_ZERO_PROXY_DECLARATION');
pass(js.includes("yawLaw: 'THETA_Y_MOD_360_DEGREES'"), 'RUNTIME_YAW_LAW_DECLARATION');
pass(js.includes("focusedAdjacencyLaw: 'MODULO_4_BIDIRECTIONAL'"), 'RUNTIME_ADJACENCY_LAW_DECLARATION');

pass(manifest.schema === 'LAWS_CONTEXTUAL_READABLE_TAB_SPECIMEN_MANIFEST_v1', 'MANIFEST_SCHEMA');
pass(manifest.operationId === 'LAWS_CONTEXTUAL_3D_FOUR_TAB_INTERACTION_REPAIR_V1_9476A_20260810_003', 'OPERATION_ID_BINDING');
pass(manifest.lockGeneration === 1045, 'LOCK_GENERATION_BINDING', String(manifest.lockGeneration));
pass(manifest.governingHead === '9476afe595b85f7e0e4bb696f7978bc0c62cc04d', 'GOVERNING_HEAD_BINDING');
pass(manifest.branch === 'agent/laws-four-tab-interaction-repair-9476a-003', 'BRANCH_BINDING');
pass(manifest.preservedPositiveImplementationSource?.head === '3744df3801a536c6cc0f1153f4dff23408a893aa', 'PRESERVED_SOURCE_HEAD_BINDING');
pass(manifest.preservedPositiveImplementationSource?.frozenBlobs?.['index.html'] === '4e7e963e144055297910296d9fc865f11a9d5b84', 'PRESERVED_HTML_BLOB_BINDING');
pass(manifest.preservedPositiveImplementationSource?.frozenBlobs?.['index.css'] === '0544dba0e40d899bd3c50469a7134f03475bab80', 'PRESERVED_CSS_BLOB_BINDING');
pass(manifest.preservedPositiveImplementationSource?.frozenBlobs?.['index.js'] === '1f3a6f5ba7152b16a1164fcd48ccb11220329f98', 'SOURCE_RUNTIME_BLOB_BINDING');
pass(manifest.router?.result === 'PASS' && manifest.router?.nativeReceiptDigest === '21d64f9d13d3996fb6e1ce257f4c278c68ea0c2be681a87d6be143c923cd1491', 'GEN1045_ROUTER_BINDING');
pass(manifest.pageExcellence?.implementationClass === 'EXISTING_CONSTRUCT_ADOPTION' && manifest.pageExcellence?.result === 'PASS', 'IMPLEMENTATION_CLASS_AND_PAGE_ARCH_PASS');
pass(manifest.pageExcellence?.architectureBundleDigest === '11d79a00094932f7c8ce2086b443bac75ba69f3f665757077d2d6528dfcdd711', 'GEN1045_PAGE_ARCHITECTURE_BUNDLE_BINDING');
pass(manifest.designLaw?.tabObjectCount === 4 && manifest.designLaw?.proxyObjectCount === 0, 'FOUR_OBJECT_ZERO_PROXY_MANIFEST');
pass(manifest.designLaw?.objectIdentityInvariant === 'ORBIT=FOCUS=SCROLL=PRACTICAL=ENGINEERING=EVIDENCE=INFORMATION', 'MANIFEST_IDENTITY_INVARIANT');
pass(manifest.repairContract?.orbitTapDragArbitration?.crossThresholdReleaseMayFocus === false, 'MANIFEST_DRAG_RELEASE_NO_FOCUS');
pass(manifest.repairContract?.orbitYaw?.law === 'THETA_Y_MOD_360_DEGREES' && manifest.repairContract?.orbitYaw?.continuous === true, 'MANIFEST_FULL_YAW');
pass(manifest.repairContract?.focusedAdjacency?.wrapIndefinitelyBothDirections === true, 'MANIFEST_MODULO4_WRAP');
pass(manifest.frozenBoundaries?.htmlSemanticContent === true && manifest.frozenBoundaries?.cssGeometryAndComposition === true, 'PRESERVED_ARCHITECTURE_FROZEN');
pass(manifest.authority?.merge === false && manifest.authority?.production === false && manifest.authority?.semanticMutation === false && manifest.authority?.architectureRedesign === false && manifest.authority?.templateExtraction === false, 'AUTHORITY_CEILING');

for (const snippet of [
  'Qualified Collapse Predicate',
  'Collapse requires simultaneous saturation of burden and pressure plus failure of the weakest required spine axis.',
  'Pressure-to-Capacity Ratio',
  'The ratio compares pressure with protected usable capacity while preserving the reason a safety floor exists.',
  'Industrial Closure Equation',
  'A closure claim must reconcile input, output, destruction, inventory change, and uncertainty.',
  'F.I.R.S.T. Research Method',
  'Research asks what changed, what remained intact, what evidence shows, what shaped the result, and what was tested.'
]) pass(html.includes(snippet), 'EXACT_SOURCE_CONTENT_SNIPPET', snippet);

const receipt = {
  schema:'LAWS_CONTEXTUAL_FOUR_TAB_INTERACTION_REPAIR_STATIC_VERIFICATION_RECEIPT_v1',
  result: failures.length ? 'FAIL' : 'PASS',
  exactFileCount: expectedFiles.length,
  tabObjectCount: tabIds.length,
  proxyObjectCount: 0,
  selectedModelIds: tabIds,
  preservedHtmlBlob: gitBlobSha(html),
  preservedCssBlob: gitBlobSha(css),
  governingHead: manifest.governingHead,
  operationId: manifest.operationId,
  lockGeneration: manifest.lockGeneration,
  runtimeEvidenceStatus: manifest.runtimeEvidence?.status ?? null,
  visualMotionAdmissionStatus: manifest.visualMotionAdmission?.status ?? null,
  failures
};
console.log(JSON.stringify(receipt,null,2));
if (failures.length) process.exit(1);
