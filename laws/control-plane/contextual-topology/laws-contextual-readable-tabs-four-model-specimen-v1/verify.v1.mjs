import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const files = await readdir(here);
const expectedFiles = ['index.css','index.html','index.js','specimen-manifest.v1.json','verify.v1.mjs'].sort();
const failures = [];
const pass = (condition, code, detail='') => { if (!condition) failures.push({code, detail}); };

pass(JSON.stringify(files.filter((name)=>!name.startsWith('.')).sort()) === JSON.stringify(expectedFiles), 'EXACT_FIVE_FILE_SPECIMEN_SCOPE', files.join(','));

const [html, css, js, manifestText] = await Promise.all([
  readFile(join(here,'index.html'),'utf8'),
  readFile(join(here,'index.css'),'utf8'),
  readFile(join(here,'index.js'),'utf8'),
  readFile(join(here,'specimen-manifest.v1.json'),'utf8')
]);
const manifest = JSON.parse(manifestText);

const tabIds = [...html.matchAll(/data-tab-object="([^"]+)"/g)].map((m)=>m[1]);
const expectedIds = ['collapse-qualified','pcr','mass-ledger','first'];
pass(tabIds.length === 4, 'EXACTLY_FOUR_TAB_OBJECTS', String(tabIds.length));
pass(JSON.stringify(tabIds) === JSON.stringify(expectedIds), 'EXACT_MODEL_ORDER', JSON.stringify(tabIds));
pass((html.match(/data-object-identity=/g)||[]).length === 4, 'STABLE_OBJECT_IDENTITY_MARKERS');
pass((html.match(/data-return-orbit/g)||[]).length === 4, 'RETURN_TO_ORBIT_PER_OBJECT');
pass((html.match(/data-category-select="Practical"/g)||[]).length === 4, 'PRACTICAL_CONTROLS');
pass((html.match(/data-category-select="Engineering"/g)||[]).length === 4, 'ENGINEERING_CONTROLS');
pass((html.match(/data-category-select="Evidence"/g)||[]).length === 4, 'EVIDENCE_CONTROLS');
pass((html.match(/data-category-select="Information"/g)||[]).length === 4, 'INFORMATION_CONTROLS');
pass((html.match(/data-category-panel="Information"/g)||[]).length === 4, 'INFORMATION_PANELS');
pass((html.match(/<details class="info-disclosure"/g)||[]).length === 12, 'BOUNDED_VERTICAL_DISCLOSURE');

for (const prohibited of ['<canvas','<svg','<img','<iframe','role="dialog"']) {
  pass(!html.includes(prohibited), 'NO_PROXY_OR_REPLACEMENT_SURFACE', prohibited);
}
pass(!html.includes('Previous') && !html.includes('Next'), 'NO_VISIBLE_PREVIOUS_NEXT_PRIMARY_UI');

pass(css.includes('perspective:1500px') || css.includes('perspective:1050px'), 'REAL_PERSPECTIVE');
pass(css.includes('transform-style:preserve-3d'), 'PRESERVE_3D');
pass(css.includes('max-width:calc(100vw - 32px)') && css.includes('width:calc(100vw - 20px)'), 'FOCUSED_VIEWPORT_CONTAINMENT');
pass(css.includes('overflow-x:hidden'), 'NO_HORIZONTAL_CONTENT_OVERFLOW_CSS');
pass(css.includes('@media(prefers-reduced-motion:reduce)'), 'REDUCED_MOTION_EQUIVALENT');
pass(css.includes('.category-tabs'), 'INNER_CONTEXT_TAB_PRESENTATION');

pass(js.includes("OBJECT_IDENTITY_INVARIANT = 'ORBIT=FOCUS=SCROLL=PRACTICAL=ENGINEERING=EVIDENCE=INFORMATION'"), 'OBJECT_IDENTITY_INVARIANT_BOUND');
pass(js.includes("gesture.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'horizontal' : 'vertical'"), 'AXIS_LOCK_IMPLEMENTED');
pass(js.includes("if (gesture.axis === 'horizontal' && Math.abs(dx) >= 60)"), 'HORIZONTAL_ADJACENCY_THRESHOLD');
pass(js.includes("state.focused !== tab"), 'ACTIVE_TAB_DOES_NOT_TOGGLE_DISMISS');
pass(js.includes("setCategory(tab, button.dataset.categorySelect)"), 'INNER_CATEGORY_DIRECT_TAP');
pass(js.includes("stableIdentity.get(state.focused.dataset.tabObject) === state.focused"), 'RUNTIME_IDENTITY_ASSERTION');
pass(js.includes("proxyObjectCount: 0"), 'RUNTIME_ZERO_PROXY_DECLARATION');

pass(manifest.schema === 'LAWS_CONTEXTUAL_READABLE_TAB_SPECIMEN_MANIFEST_v1', 'MANIFEST_SCHEMA');
pass(manifest.lockGeneration === 1026, 'LOCK_GENERATION_BINDING', String(manifest.lockGeneration));
pass(manifest.governingHead === '4d8ba163f23e29a7c3cccb701ccf69e9ae04958e', 'GOVERNING_HEAD_BINDING');
pass(manifest.donor?.head === '63ee26c78eb564b0229e84c30fd110c45618457b', 'PR888_DONOR_HEAD_BINDING');
pass(manifest.donor?.use === 'POSITIVE_IMPLEMENTATION_DONOR_NO_AUTHORITY_INHERITANCE', 'NO_DONOR_AUTHORITY_INHERITANCE');
pass(manifest.contentSource?.gitBlobSha === '5037da7a0ad32dcb6eee2d25dc2b236bd9574965', 'CONTENT_SOURCE_BLOB_BINDING');
pass(manifest.pageExcellence?.implementationClass === 'EXISTING_CONSTRUCT_ADOPTION', 'IMPLEMENTATION_CLASS_FROZEN');
pass(manifest.pageExcellence?.architectureBundleDigest === '1dc966ec8b739a39fc0513d63bc3b0c4a75846afa4c435f779981121f1f9b625', 'PAGE_ARCHITECTURE_BUNDLE_BINDING');
pass(manifest.designLaw?.tabObjectCount === 4 && manifest.designLaw?.proxyObjectCount === 0, 'FOUR_OBJECT_ZERO_PROXY_MANIFEST');
pass(manifest.designLaw?.objectIdentityInvariant === 'ORBIT=FOCUS=SCROLL=PRACTICAL=ENGINEERING=EVIDENCE=INFORMATION', 'MANIFEST_IDENTITY_INVARIANT');
pass(manifest.authority?.merge === false && manifest.authority?.production === false && manifest.authority?.visualAcceptance === false && manifest.authority?.semanticMutation === false, 'AUTHORITY_CEILING');

const exactSemanticSnippets = [
  'Qualified Collapse Predicate',
  'Collapse requires simultaneous saturation of burden and pressure plus failure of the weakest required spine axis.',
  'Pressure-to-Capacity Ratio',
  'The ratio compares pressure with protected usable capacity while preserving the reason a safety floor exists.',
  'Industrial Closure Equation',
  'A closure claim must reconcile input, output, destruction, inventory change, and uncertainty.',
  'F.I.R.S.T. Research Method',
  'Research asks what changed, what remained intact, what evidence shows, what shaped the result, and what was tested.'
];
for (const snippet of exactSemanticSnippets) pass(html.includes(snippet), 'EXACT_SOURCE_CONTENT_SNIPPET', snippet);

const receipt = {
  schema:'LAWS_CONTEXTUAL_READABLE_TAB_STATIC_VERIFICATION_RECEIPT_v1',
  result: failures.length ? 'FAIL' : 'PASS',
  exactFileCount: expectedFiles.length,
  tabObjectCount: tabIds.length,
  proxyObjectCount: 0,
  selectedModelIds: tabIds,
  governingHead: manifest.governingHead,
  operationId: manifest.operationId,
  failures
};
console.log(JSON.stringify(receipt,null,2));
if (failures.length) process.exit(1);
