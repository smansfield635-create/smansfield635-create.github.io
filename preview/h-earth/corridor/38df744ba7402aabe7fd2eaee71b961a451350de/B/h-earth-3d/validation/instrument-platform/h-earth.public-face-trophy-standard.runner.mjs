import fs from 'node:fs';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';

const RECEIPT_PATH = process.env.H_EARTH_B10_STATIC_RECEIPT || '/tmp/h-earth-public-face-trophy-standard-b10.static.receipt.json';
const CHECKPOINT = 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_CURRENT_ARCHITECTURE_REGRESSION';
const CANDIDATE_ID = 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_RECONCILIATION_002';
const assertions = [];
const check = (id, condition, detail = null) => { const entry = { id, pass: Boolean(condition), detail }; assertions.push(entry); if (!entry.pass) console.error(JSON.stringify(entry)); };
const read = (path) => fs.readFileSync(path, 'utf8');
const exec = (command) => childProcess.execSync(command, { encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
let comparisonBase;
try { comparisonBase = exec('git merge-base HEAD origin/main'); } catch { comparisonBase = exec('git rev-parse HEAD^'); }
const changedPaths = exec(`git diff --name-only ${comparisonBase}...HEAD`).split('\n').map(v => v.trim()).filter(Boolean).sort();
const verifierPaths = [
  'h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.browser.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.runner.mjs'
].sort();
const productReleasePaths = [
  'showroom/globe/h-earth/awards/index.html',
  'showroom/globe/h-earth/awards/media/awards-cinematic-epilogue-first-picture-v1.mp4'
].sort();
const recognizedPaths = new Set([...verifierPaths, ...productReleasePaths]);
const unauthorizedChangedPaths = changedPaths.filter(path => !recognizedPaths.has(path));
const verifierChangedPaths = changedPaths.filter(path => verifierPaths.includes(path));
const releaseChangedPaths = changedPaths.filter(path => productReleasePaths.includes(path));
const indexHtml = read('showroom/globe/h-earth/index.html');
const awardsHtml = read('showroom/globe/h-earth/awards/index.html');
const workflow = read('.github/workflows/h-earth-public-face-trophy-standard.yml');
const browserRunner = read('h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.browser.mjs');

check('PROMOTED_PUBLIC_FACE_ACTIVE', indexHtml.includes('data-h-earth-public-face-candidate="active"'));
check('PROMOTED_PUBLIC_FACE_DEFAULT', indexHtml.includes('data-h-earth-public-face-default="promoted"'));
check('B10_HERO_PRESENT', indexHtml.includes('id="h-earth-b10-hero"'));
check('WELCOME_TO_H_EARTH_PRESENT', indexHtml.includes('Welcome to H-Earth.'));
check('AWARDS_TAB_PRESENT', indexHtml.includes('id="h-earth-awards-link"'));
check('CANVAS_ID_PRESERVED', indexHtml.includes('id="h-earth-functional-landscape-canvas"'));
check('GESTURE_MOUNT_ID_PRESERVED', indexHtml.includes('id="h-earth-functional-landscape-mount"'));

check('AWARDS_ROUTE_IDENTITY', awardsHtml.includes('data-awards-overview="DIAMOND_GATE_BRIDGE_AWARD_LANDSCAPE"'));
check('AWARDS_ARCHITECTURE_PRESERVED', awardsHtml.includes('data-awards-architecture="JUDGE_FACING_SPATIAL_INSTRUMENT_V1"'));
check('AWARDS_CLAIM_BOUNDARY', awardsHtml.includes('data-claim-boundary="TARGETS_AND_RATIONALE_NOT_NOMINATIONS_OR_WINS"'));
const stories = [...awardsHtml.matchAll(/data-story="([^"]+)"/g)].map(m => m[1]);
const trophyLenses = [...awardsHtml.matchAll(/<article\b[^>]*\bdata-lens-key="([^"]+)"[^>]*>/g)].map(m => m[1]);
check('FIVE_CURRENT_ACHIEVEMENT_STORIES', stories.length === 5, stories);
check('CURRENT_ACHIEVEMENT_STORY_ORDER', JSON.stringify(stories) === JSON.stringify(['experience','world','coherence','trust','estate']), stories);
check('SIX_TROPHY_STANDARD_LENSES', trophyLenses.length === 6, trophyLenses);
check('TROPHY_CHAPTER_ORDER', JSON.stringify(trophyLenses) === JSON.stringify(['compass','world','ip','ai','diagnostic','independent']), trophyLenses);
check('CURRENT_READER_ARCHITECTURE', awardsHtml.includes('class="reader"') && awardsHtml.includes('class="reader-body"') && awardsHtml.includes('class="reader-return"'));
check('RETIRED_FLIP_ARCHITECTURE_NOT_REQUIRED', !awardsHtml.includes('card-flip-shell') && !awardsHtml.includes('feature-back'));
check('STATE_DEPENDENT_DEPTH_BLUR_CONTRACT', awardsHtml.includes('--content-blur') && awardsHtml.includes('--content-opacity'));
check('VISIBLE_CARD_SELECTION_CONTRACT', awardsHtml.includes('data-achievement-stage') && awardsHtml.includes('data-story=') && awardsHtml.includes('data-trophy-stage') && awardsHtml.includes('data-lens-key='));
check('AWARD_TARGETS_NOT_WINS', /does not claim that a submission, nomination, shortlist or win has already occurred/i.test(awardsHtml) && !/data-award-state="(?:WIN|WON|NOMINATED|SHORTLISTED)"/i.test(awardsHtml));
check('AWARDS_2027_TARGET_DATE_PRESENT', awardsHtml.includes('Planned submissions · late October 2026 · 2027 cycle'));
check('AWARDS_RETURN_TO_PROMOTED_H_EARTH', awardsHtml.includes('href="/showroom/globe/h-earth/"'));

const hasOldWorldMedia = awardsHtml.includes('/showroom/globe/h-earth/awards/media/diamond-gate-h-earth-audralia-30s-vivaldi.mp4');
const hasGen2128Media = awardsHtml.includes('/showroom/globe/h-earth/awards/media/awards-cinematic-epilogue-first-picture-v1.mp4');
check('CHAPTER_02_MEDIA_IS_APPROVED_BASELINE_OR_GEN2128', hasOldWorldMedia || hasGen2128Media, { hasOldWorldMedia, hasGen2128Media });
if (hasGen2128Media) {
  check('GEN2128_EXPLICIT_CONTINUATION_PRESENT', awardsHtml.includes('Continue to Chapter 03') || awardsHtml.includes('chapter-continuation') || awardsHtml.includes('data-reader-continue'));
  check('GEN2128_NO_AUTOMATIC_CHAPTER_ADVANCE', !/addEventListener\(['"]ended['"][\s\S]{0,400}activateLens\(/.test(awardsHtml));
}

const verifierRepairShape = verifierChangedPaths.length >= 1 && verifierChangedPaths.length <= verifierPaths.length && verifierChangedPaths.length === changedPaths.length;
const releaseShape = changedPaths.length === 2 && productReleasePaths.every(path => changedPaths.includes(path));
const mainPushShape = changedPaths.length === 0;
check('CURRENT_OPERATION_SCOPE_RECOGNIZED', verifierRepairShape || releaseShape || mainPushShape, { changedPaths, verifierRepairShape, releaseShape, mainPushShape });
check('SCOPE_BOUNDED', unauthorizedChangedPaths.length === 0, { unauthorizedChangedPaths });
check('WORKFLOW_LOCAL_AND_PUBLIC_MODES', workflow.includes('PUBLIC_VERIFICATION') && workflow.includes('https://diamondgatebridge.com'));
check('WORKFLOW_NO_PR_COMMENT_TRANSPORT', !workflow.includes('issues.createComment'));
check('BROWSER_RUNNER_COVERS_DESKTOP', browserRunner.includes('DESKTOP_POINTER_DRAG_LOOK'));
check('BROWSER_RUNNER_COVERS_MOBILE', browserRunner.includes('MOBILE_ONE_FINGER_LOOK'));
check('BROWSER_RUNNER_COVERS_CURRENT_AWARDS', browserRunner.includes('CURRENT_ACHIEVEMENT_STORY_ORDER') && browserRunner.includes('AWARDS_ACTIVE_CARD_OPENS_READER'));
check('BROWSER_RUNNER_COVERS_ZERO_ERRORS', browserRunner.includes('PAGE_ERRORS_ZERO') && browserRunner.includes('CONSOLE_ERRORS_ZERO') && browserRunner.includes('OWNED_HTTP_ERRORS_ZERO'));

const failedAssertions = assertions.filter(entry => !entry.pass);
const receiptBody = {
  schemaVersion: 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_PROMOTED_STATIC_RECEIPT_v2', checkpoint: CHECKPOINT,
  status: failedAssertions.length === 0 ? 'PASS_CLOSED' : 'FAIL', comparisonBase,
  candidateHead: process.env.CANDIDATE_HEAD || exec('git rev-parse HEAD'), candidateId: CANDIDATE_ID,
  awardsPageSha256: sha256(awardsHtml), validatorSha256: sha256(read('h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.runner.mjs')),
  allowedPaths: [...recognizedPaths].sort(), changedPaths, verifierChangedPaths, releaseChangedPaths, unauthorizedChangedPaths,
  publicFaceState: 'PROMOTED_ACTIVE', assertionCount: assertions.length, failedAssertionCount: failedAssertions.length, assertions
};
const receiptSha256 = sha256(JSON.stringify(receiptBody));
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify({ ...receiptBody, receiptSha256 }, null, 2)}\n`);
console.log(JSON.stringify({ ...receiptBody, receiptSha256 }, null, 2));
if (failedAssertions.length) process.exit(1);
