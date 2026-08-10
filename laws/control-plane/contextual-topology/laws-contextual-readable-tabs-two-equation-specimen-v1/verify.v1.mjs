import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const repoRoot = path.resolve(root, '../../../..');
const expected = ['index.html','index.css','index.js','specimen-manifest.v1.json','verify.v1.mjs'];
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('index.html');
const css = read('index.css');
const js = read('index.js');
const manifest = JSON.parse(read('specimen-manifest.v1.json'));
const checks = [];
const check = (id, pass, detail='') => checks.push({ id, pass:Boolean(pass), detail });
const gitBlob = (text) => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');

check('EXACT_LOCAL_FILE_SET', expected.every((n) => fs.existsSync(path.join(root,n))) && fs.readdirSync(root).filter((n)=>!n.startsWith('.')).sort().join('|') === expected.slice().sort().join('|'));
const tabMatches = [...html.matchAll(/<article\s+class="context-tab"[^>]+data-tab-object="([^"]+)"/g)].map((m)=>m[1]);
check('EXACTLY_TWO_CONTEXTUAL_TAB_OBJECTS', tabMatches.length === 2 && tabMatches.join('|') === 'collapse-qualified|pcr', tabMatches.join('|'));
check('CONTENT_EQUALS_OBJECT_MANIFEST', manifest.designLaw?.contentEqualsObject === true && manifest.designLaw?.tabObjectCount === 2 && manifest.designLaw?.proxyObjectCount === 0);
check('EXACT_COLLAPSE_EQUATION', html.includes('CollapseQualified<sub>d</sub> = (B256<sub>d</sub> ≥ 256) ∧ (P192<sub>d</sub> ≥ 192) ∧ (min(E<sub>d</sub>, I<sub>d</sub>, V<sub>d</sub>) ≤ ε<sub>d</sub>)'));
check('EXACT_PCR_EQUATION', html.includes('PCR = Π / max(K, ε<sub>K</sub>)'));
check('SOURCE_TEXT_PRESERVED', html.includes('The predicate is conjunctive and noncompensatory. Every clause must be true at the same evaluation state.') && html.includes('SAFE_MODE is triggered by K ≤ ε<sub>K</sub>, not by PCR alone.'));
check('REAL_CSS_3D_SURFACES', css.includes('perspective:1500px') && css.includes('transform-style:preserve-3d') && css.includes('translate3d(') && css.includes('rotateY('));
check('SAME_TAB_FOCUS', js.includes("classList.toggle('is-focused'") && js.includes('state.focused = state.focused === tab ? null : tab') && !html.includes('<dialog'));
check('DIRECT_POINTER_TOUCH_PATH', js.includes("addEventListener('pointerdown'") && js.includes("addEventListener('pointermove'") && js.includes('state.pointers.size >= 2'));
check('KEYBOARD_EQUIVALENCE', js.includes("event.key === 'Enter'") && js.includes("event.key === 'Escape'"));
check('REDUCED_MOTION_EQUIVALENCE', css.includes('@media(prefers-reduced-motion:reduce)'));
check('NO_PROXY_RENDER_SURFACE', !/<(?:canvas|svg|img|iframe|object|video)\b/i.test(html));
check('NO_PROXY_CLASS_OR_ID', !/(class|id|data-[\w-]+)="[^"]*(sphere|crystal|orbital|planet|node)[^"]*"/i.test(html));
check('NO_CAROUSEL_CONTROL', !/(carousel|previous|next|data-axis|axis-control)/i.test(`${html}\n${js}`));
check('NO_POPUP_READER', !/(modal|popup|dialog)/i.test(`${html}\n${js}`));
check('RUNTIME_CONTRACT_ZERO_PROXY', js.includes('proxyObjectCount: 0') && js.includes('tabObjectCount: tabs.length'));

for (const source of [manifest.contentSource, ...manifest.implementationSources]) {
  const sourcePath = path.join(repoRoot, source.path);
  if (!fs.existsSync(sourcePath)) { check(`SOURCE_PRESENT:${source.path}`, false, 'missing'); continue; }
  const actual = gitBlob(fs.readFileSync(sourcePath, 'utf8'));
  check(`SOURCE_BLOB:${source.path}`, actual === source.gitBlobSha, `${actual}`);
}

check('GOVERNING_HEAD_BOUND', manifest.governingHead === 'b79537c9a4541cebe634cb674caaba6bdf394f97' && manifest.lockGeneration === 1012);
check('REJECTED_COMPASS_NEGATIVE_ONLY', manifest.rejectedPredecessor?.terminalDisposition === 'REJECTED_CLOSED' && manifest.rejectedPredecessor?.failureClass === 'COMPASS_REPLICATION' && manifest.rejectedPredecessor?.use === 'NEGATIVE_REFERENCE_ONLY');
check('NO_AUTHORITY_INFLATION', Object.values(manifest.authority || {}).every((v) => v === false));

const failed = checks.filter((c)=>!c.pass);
const receipt = { schema:'LAWS_CONTEXTUAL_READABLE_TAB_STATIC_VERIFICATION_RECEIPT_v1', result: failed.length ? 'FAIL' : 'PASS', specimenId:manifest.specimenId, lockGeneration:manifest.lockGeneration, checks, failedCheckIds:failed.map((c)=>c.id) };
const outArg = process.argv.indexOf('--output');
if (outArg >= 0 && process.argv[outArg+1]) fs.writeFileSync(process.argv[outArg+1], JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
process.exit(failed.length ? 1 : 0);
