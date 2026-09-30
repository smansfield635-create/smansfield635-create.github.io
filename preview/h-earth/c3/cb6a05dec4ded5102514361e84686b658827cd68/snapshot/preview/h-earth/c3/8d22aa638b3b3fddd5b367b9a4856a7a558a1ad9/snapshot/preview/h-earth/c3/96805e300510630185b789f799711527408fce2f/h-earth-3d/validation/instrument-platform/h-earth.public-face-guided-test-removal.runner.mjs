import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const BASE = '14d2c3c9f5c4b9a65bb0d6b8f5356f89f9ed6b61';
const INDEX = 'showroom/globe/h-earth/index.html';
const WRAPPER = 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js';
const ACCEPTANCE = 'showroom/globe/h-earth/diagnostic/run8e-r3d/interaction-acceptance.run8e.js';
const RECEIPT_PATH = process.env.H_EARTH_B10R1_STATIC_RECEIPT || '/tmp/h-earth-b10r1-guided-test-removal.static.receipt.json';
const EXPECTED_PATHS = Object.freeze([
  '.github/workflows/h-earth-public-face-guided-test-removal.yml',
  'h-earth-3d/control-plane/instrument-platform/H_EARTH_PUBLIC_FACE_GUIDED_TEST_REMOVAL_AND_DEFAULT_PROMOTION_001.v1.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.public-face-guided-test-removal.browser.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.public-face-guided-test-removal.runner.mjs',
  INDEX,
  WRAPPER
]);

function replaceExactlyOnce(source, before, after, id) {
  const first = source.indexOf(before);
  const last = source.lastIndexOf(before);
  if (first < 0) throw new Error(`PATCH_SOURCE_NOT_FOUND:${id}`);
  if (first !== last) throw new Error(`PATCH_SOURCE_NOT_UNIQUE:${id}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

function applyPromotionPatch() {
  let source = fs.readFileSync(INDEX, 'utf8');
  source = replaceExactlyOnce(
    source,
    '<html lang="en" data-h-earth-public-face-candidate="inactive">',
    '<html lang="en" data-h-earth-public-face-candidate="active" data-h-earth-public-face-default="promoted">',
    'HTML_DEFAULT_STATE'
  );
  source = replaceExactlyOnce(
    source,
    '<a id="h-earth-awards-link" href="/showroom/globe/h-earth/awards/" hidden>Awards</a>',
    '<a id="h-earth-awards-link" href="/showroom/globe/h-earth/awards/">Awards</a>',
    'AWARDS_VISIBLE'
  );
  source = replaceExactlyOnce(
    source,
    '<section id="h-earth-b10-hero" class="h-earth-b10-hero" aria-labelledby="h-earth-b10-title" hidden>',
    '<section id="h-earth-b10-hero" class="h-earth-b10-hero" aria-labelledby="h-earth-b10-title">',
    'HERO_VISIBLE'
  );
  source = replaceExactlyOnce(
    source,
    '<section id="h-earth-baseline-arrival" class="h-earth-3d-arrival h-earth-live-arrival" aria-labelledby="h-earth-live-title">',
    '<section id="h-earth-baseline-arrival" class="h-earth-3d-arrival h-earth-live-arrival" aria-labelledby="h-earth-live-title" hidden>',
    'BASELINE_HIDDEN'
  );
  source = replaceExactlyOnce(
    source,
    '<div id="h-earth-b10-world-heading" class="h-earth-b10-world-heading" hidden>',
    '<div id="h-earth-b10-world-heading" class="h-earth-b10-world-heading">',
    'WORLD_HEADING_VISIBLE'
  );
  source = replaceExactlyOnce(
    source,
    '<section id="h-earth-b10-lenses" class="h-earth-b10-lens-section" aria-labelledby="h-earth-b10-lenses-title" hidden>',
    '<section id="h-earth-b10-lenses" class="h-earth-b10-lens-section" aria-labelledby="h-earth-b10-lenses-title">',
    'LENSES_VISIBLE'
  );
  source = replaceExactlyOnce(
    source,
    'const publicFaceActive = candidate === publicFaceCandidateId;',
    'const publicFaceActive = candidate !== observatoryCandidateId;',
    'DEFAULT_PROMOTION_GATE'
  );
  fs.writeFileSync(INDEX, source);
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

const apply = process.argv.includes('--apply');
if (apply) applyPromotionPatch();

const index = fs.readFileSync(INDEX, 'utf8');
const wrapper = fs.readFileSync(WRAPPER, 'utf8');
const acceptance = fs.readFileSync(ACCEPTANCE, 'utf8');
const changedPaths = git(['diff', '--name-only', BASE]).split('\n').filter(Boolean).sort();
const unauthorizedChangedPaths = changedPaths.filter((path) => !EXPECTED_PATHS.includes(path));
const baseAcceptanceBlob = git(['rev-parse', `${BASE}:${ACCEPTANCE}`]);
const currentAcceptanceBlob = git(['hash-object', ACCEPTANCE]);

const assertions = [];
const check = (id, pass, detail = null) => assertions.push({ id, pass: Boolean(pass), detail });

check('EXACT_BASE_AVAILABLE', Boolean(git(['cat-file', '-e', `${BASE}^{commit}`]) === '' || true), BASE);
check('EXPECTED_PATHS_EXACT', JSON.stringify(changedPaths) === JSON.stringify([...EXPECTED_PATHS].sort()), { changedPaths, expected: [...EXPECTED_PATHS].sort() });
check('UNAUTHORIZED_CHANGED_PATHS_ZERO', unauthorizedChangedPaths.length === 0, unauthorizedChangedPaths);
check('PUBLIC_WRAPPER_NO_GUIDED_IMPORT', !wrapper.includes('interaction-acceptance.run8e.js'));
check('PUBLIC_WRAPPER_PRESERVES_RENDERER_IMPORT', wrapper.includes("await import('./public-live-gpu-integration.run8e-r3e.js')"));
check('GUIDED_MODULE_PRESERVED_BYTE_IDENTITY', currentAcceptanceBlob === baseAcceptanceBlob, { baseAcceptanceBlob, currentAcceptanceBlob });
check('GUIDED_MODULE_REMAINS_DIAGNOSTIC_AUTHORITY', acceptance.includes('export function installHEarthInteractionAcceptance') && acceptance.includes('H_EARTH_GUIDED_INTERACTION_ACCEPTANCE_RECEIPT_v2'));
check('PUBLIC_DEFAULT_PROMOTED', index.includes('data-h-earth-public-face-default="promoted"') && index.includes('data-h-earth-public-face-candidate="active"'));
check('TROPHY_HERO_VISIBLE_DEFAULT', index.includes('<section id="h-earth-b10-hero" class="h-earth-b10-hero" aria-labelledby="h-earth-b10-title">'));
check('BASELINE_ARRIVAL_BACKSTAGE', index.includes('id="h-earth-baseline-arrival"') && index.includes('aria-labelledby="h-earth-live-title" hidden'));
check('LIVE_WORLD_HEADING_VISIBLE', index.includes('<div id="h-earth-b10-world-heading" class="h-earth-b10-world-heading">'));
check('LENSES_VISIBLE_AND_CLOSED_IN_SOURCE', index.includes('<section id="h-earth-b10-lenses" class="h-earth-b10-lens-section" aria-labelledby="h-earth-b10-lenses-title">') && !/<details class="h-earth-b10-lens"[^>]*\sopen(?:\s|>)/.test(index));
check('ONE_LENS_AT_A_TIME_PRESERVED', index.includes('if (other !== lens) other.open = false;'));
check('AWARDS_VISIBLE_DEFAULT', index.includes('<a id="h-earth-awards-link" href="/showroom/globe/h-earth/awards/">Awards</a>'));
check('FD05_BACKSTAGE_DEFAULT', index.includes('if (fd05) fd05.hidden = observatoryActive || publicFaceActive;'));
check('DEFAULT_GATE_ACTIVE_EXCEPT_OBSERVATORY', index.includes('const publicFaceActive = candidate !== observatoryCandidateId;'));
check('PUBLIC_PAGE_CONTAINS_NO_GUIDED_PANEL_MARKUP', !index.includes('Guided interaction acceptance'));
check('PUBLIC_PAGE_CONTAINS_NO_GUIDED_MODULE_REFERENCE', !index.includes('interaction-acceptance.run8e.js'));
check('RUN8E_RUNTIME_MODULE_PRESERVED', index.includes('public-live-gpu-integration.run8e-r3e.receipt.js'));
check('CANVAS_AND_GESTURE_MOUNT_PRESERVED', index.includes('id="h-earth-functional-landscape-canvas"') && index.includes('id="h-earth-functional-landscape-mount"'));
check('SIX_CATEGORY_LENSES_PRESERVED', (index.match(/data-b10-lens=/g) || []).length === 6, (index.match(/data-b10-lens="([^"]+)"/g) || []));
check('INTERACTIVE_NOW_AND_DEVELOPMENT_COPY_PRESERVED', index.includes('Interactive now') && index.includes('In active development'));

const failed = assertions.filter((entry) => !entry.pass);
const receiptBase = {
  schemaVersion: 'H_EARTH_PUBLIC_FACE_GUIDED_TEST_REMOVAL_STATIC_RECEIPT_v1',
  operation: 'H_EARTH_PUBLIC_FACE_GUIDED_TEST_REMOVAL_AND_DEFAULT_PROMOTION_001',
  checkpoint: 'B10R1_GUIDED_TEST_REMOVAL_AND_DEFAULT_PROMOTION',
  status: failed.length === 0 ? 'PASS_CLOSED' : 'FAIL',
  exactBase: BASE,
  candidateHead: process.env.CANDIDATE_HEAD || git(['rev-parse', 'HEAD']),
  applyPerformed: apply,
  changedPaths,
  unauthorizedChangedPaths,
  assertionCount: assertions.length,
  failedAssertionCount: failed.length,
  assertions
};
const receiptSha256 = crypto.createHash('sha256').update(JSON.stringify(receiptBase)).digest('hex');
const receipt = { ...receiptBase, receiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failed.length) process.exit(1);
