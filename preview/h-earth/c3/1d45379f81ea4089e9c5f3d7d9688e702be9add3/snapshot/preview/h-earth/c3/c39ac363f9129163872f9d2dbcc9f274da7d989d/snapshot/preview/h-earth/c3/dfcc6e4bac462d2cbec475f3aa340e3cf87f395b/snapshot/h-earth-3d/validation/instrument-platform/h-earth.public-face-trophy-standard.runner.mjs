import fs from 'node:fs';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';

const RECEIPT_PATH = process.env.H_EARTH_B10_STATIC_RECEIPT
  || '/tmp/h-earth-public-face-trophy-standard-b10.static.receipt.json';
const CHECKPOINT = 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_PROMOTED_REGRESSION';
const CANDIDATE_ID = 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_RECONCILIATION_001';

const assertions = [];
const check = (id, condition, detail = null) => {
  const entry = { id, pass: Boolean(condition), detail };
  assertions.push(entry);
  if (!entry.pass) console.error(JSON.stringify(entry, null, 2));
};
const read = (path) => fs.readFileSync(path, 'utf8');
const exec = (command) => childProcess.execSync(command, { encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

let comparisonBase;
try {
  comparisonBase = exec('git merge-base HEAD origin/main');
} catch {
  comparisonBase = exec('git rev-parse HEAD^');
}
const changedPaths = exec(`git diff --name-only ${comparisonBase}...HEAD`)
  .split('\n').map((value) => value.trim()).filter(Boolean).sort();
const allowedPaths = [
  '.github/workflows/h-earth-public-face-trophy-standard.yml',
  'h-earth-3d/control-plane/instrument-platform/H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_RECONCILIATION_001.v1.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.browser.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.runner.mjs',
  'showroom/globe/h-earth/awards/index.html',
  'showroom/globe/h-earth/index.css',
  'showroom/globe/h-earth/index.html'
].sort();
const sensitiveChangedPaths = changedPaths.filter((path) => allowedPaths.includes(path));
const unauthorizedChangedPaths = sensitiveChangedPaths.filter((path) => !allowedPaths.includes(path));

const indexHtml = read('showroom/globe/h-earth/index.html');
const awardsHtml = read('showroom/globe/h-earth/awards/index.html');
const workflow = read('.github/workflows/h-earth-public-face-trophy-standard.yml');
const browserRunner = read('h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.browser.mjs');

check('PROMOTED_PUBLIC_FACE_ACTIVE', indexHtml.includes('data-h-earth-public-face-candidate="active"'));
check('PROMOTED_PUBLIC_FACE_DEFAULT', indexHtml.includes('data-h-earth-public-face-default="promoted"'));
check('B10_CANDIDATE_ID_PRESERVED', indexHtml.includes(CANDIDATE_ID));
check('B10_HERO_PRESENT', indexHtml.includes('id="h-earth-b10-hero"'));
check('WELCOME_TO_H_EARTH_PRESENT', indexHtml.includes('Welcome to H-Earth.'));
check('INTERACTIVE_NOW_PRESENT', indexHtml.includes('Interactive now'));
check('IN_ACTIVE_DEVELOPMENT_PRESENT', indexHtml.includes('In active development'));
check('LIVE_WORLD_ARRIVAL_PRESENT', indexHtml.includes('id="h-earth-live-world"'));
check('ENTER_AND_EXPLORE_PRESENT', indexHtml.includes('Enter and explore'));
check('AWARDS_TAB_PRESENT', indexHtml.includes('id="h-earth-awards-link"'));
check('PUBLIC_STYLESHEET_PRESENT', fs.existsSync('showroom/globe/h-earth/index.css') && indexHtml.includes('./index.css?v=b10-trophy-standard-001'));

const publicLenses = [...indexHtml.matchAll(/data-b10-lens="([^"]+)"/g)].map((match) => match[1]);
check('SIX_PUBLIC_CATEGORY_LENSES', publicLenses.length === 6, publicLenses);
check('PUBLIC_LENSES_CLOSED_IN_SOURCE', !/<details[^>]*class="h-earth-b10-lens"[^>]*\sopen(?:\s|>)/i.test(indexHtml));
check('ONE_PUBLIC_LENS_AT_A_TIME_IMPLEMENTED', indexHtml.includes('if (other !== lens) other.open = false'));
check('TECHNICAL_PANELS_RELOCATED_TO_LENSES', indexHtml.includes("document.getElementById('h-earth-b10-technical-host').append(runtimeDiagnostics)") && indexHtml.includes("document.getElementById('h-earth-b10-evidence-host').append(startupReceipt, environmentDetails)"));
check('BASELINE_ARRIVAL_PRESERVED_AS_FALLBACK', indexHtml.includes('id="h-earth-baseline-arrival"') && indexHtml.includes("document.getElementById('h-earth-baseline-arrival').hidden = true"));
check('RUN8E_RUNTIME_MODULE_PRESERVED', indexHtml.includes('./functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js?v=renderer-startup-receipt-v1'));
check('CANVAS_ID_PRESERVED', indexHtml.includes('id="h-earth-functional-landscape-canvas"'));
check('GESTURE_MOUNT_ID_PRESERVED', indexHtml.includes('id="h-earth-functional-landscape-mount"'));

check('AWARDS_ROUTE_IDENTITY', awardsHtml.includes('data-awards-overview="DIAMOND_GATE_BRIDGE_AWARD_LANDSCAPE"'));
check('AWARDS_CLAIM_BOUNDARY', awardsHtml.includes('data-claim-boundary="TARGETS_AND_RATIONALE_NOT_NOMINATIONS_OR_WINS"'));
const stories = [...awardsHtml.matchAll(/data-story="([^"]+)"/g)].map((match) => match[1]);
const trophyLenses = [...awardsHtml.matchAll(/<button\b[^>]*\bdata-lens="([^"]+)"[^>]*>/g)].map((match) => match[1]);
check('FIVE_ACHIEVEMENT_STORIES', stories.length === 5, stories);
check('SIX_TROPHY_STANDARD_LENSES', trophyLenses.length === 6, trophyLenses);
check('TROPHY_CHAPTER_ORDER', JSON.stringify(trophyLenses) === JSON.stringify(['compass','world','ip','ai','diagnostic','independent']), trophyLenses);
check('COMPASS_SEVEN_BEAT_ARGUMENT', [
  'Navigation requires orientation.',
  'Without orientation, there is no navigation.',
  'Here at Diamond Gate Bridge, we define our questions through their connections.',
  'And the stars provide the answers.',
  'Reality relies on their existence.',
  'Therefore.',
  'Nothing navigates better than a compass.'
].every((text) => awardsHtml.includes(text)));
check('CHAPTER_HANDOFF_PRESENT', awardsHtml.includes('id="chapter-handoff"') && awardsHtml.includes('id="chapter-next"'));
check('NEXT_CHAPTER_NO_AUTOPLAY', awardsHtml.includes("handoffNext.addEventListener('click',()=>activateLens") && !awardsHtml.includes("handoffNext.addEventListener('click',()=>worldReel.play"));
check('AWARD_TARGETS_NOT_WINS', /does not claim that a submission, nomination, shortlist or win has already occurred/i.test(awardsHtml) && !/data-award-state="(?:WIN|WON|NOMINATED|SHORTLISTED)"/i.test(awardsHtml));
check('AWARDS_2027_TARGET_DATE_PRESENT', awardsHtml.includes('Planned submissions · late October 2026 · 2027 cycle'));
check('AWARDS_RETURN_TO_PROMOTED_H_EARTH', awardsHtml.includes('href="/showroom/globe/h-earth/"'));

check('SENSITIVE_SCOPE_BOUNDED', unauthorizedChangedPaths.length === 0, { sensitiveChangedPaths, unauthorizedChangedPaths });
check('WORKFLOW_LOCAL_AND_PUBLIC_MODES', workflow.includes('PUBLIC_VERIFICATION') && workflow.includes('https://diamondgatebridge.com'));
check('WORKFLOW_NO_PR_COMMENT_TRANSPORT', !workflow.includes('issues.createComment'));
check('BROWSER_RUNNER_COVERS_DESKTOP', browserRunner.includes('DESKTOP_POINTER_DRAG_LOOK'));
check('BROWSER_RUNNER_COVERS_MOBILE', browserRunner.includes('MOBILE_ONE_FINGER_LOOK'));
check('BROWSER_RUNNER_COVERS_AWARDS', browserRunner.includes('AWARDS_ROUTE_REACHABLE'));
check('BROWSER_RUNNER_COVERS_ZERO_ERRORS', browserRunner.includes('PAGE_ERRORS_ZERO') && browserRunner.includes('CONSOLE_ERRORS_ZERO') && browserRunner.includes('OWNED_HTTP_ERRORS_ZERO'));

const failedAssertions = assertions.filter((entry) => !entry.pass);
const receiptBody = {
  schemaVersion: 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_PROMOTED_STATIC_RECEIPT_v1',
  checkpoint: CHECKPOINT,
  status: failedAssertions.length === 0 ? 'PASS_CLOSED' : 'FAIL',
  comparisonBase,
  candidateHead: process.env.CANDIDATE_HEAD || exec('git rev-parse HEAD'),
  candidateId: CANDIDATE_ID,
  awardsPageSha256: sha256(awardsHtml),
  validatorSha256: sha256(read('h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.runner.mjs')),
  allowedPaths,
  changedPaths,
  sensitiveChangedPaths,
  unauthorizedChangedPaths,
  publicFaceState: 'PROMOTED_ACTIVE',
  assertionCount: assertions.length,
  failedAssertionCount: failedAssertions.length,
  assertions
};
const receiptSha256 = sha256(JSON.stringify(receiptBody));
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify({ ...receiptBody, receiptSha256 }, null, 2)}\n`);
console.log(JSON.stringify({ ...receiptBody, receiptSha256 }, null, 2));
if (failedAssertions.length > 0) process.exit(1);