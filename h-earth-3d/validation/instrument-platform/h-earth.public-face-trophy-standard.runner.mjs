import fs from 'node:fs';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';

import reconciliation from '../../control-plane/instrument-platform/H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_RECONCILIATION_001.v1.mjs';

const RECEIPT_PATH = process.env.H_EARTH_B10_STATIC_RECEIPT
  || '/tmp/h-earth-public-face-trophy-standard-b10.static.receipt.json';

const assertions = [];
const check = (id, condition, detail = null) => {
  const entry = { id, pass: Boolean(condition), detail };
  assertions.push(entry);
  if (!entry.pass) {
    console.error(JSON.stringify(entry, null, 2));
  }
};

const read = (path) => fs.readFileSync(path, 'utf8');
const exec = (command) => childProcess.execSync(command, { encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const allowedPaths = [...reconciliation.exactAllowedPaths].sort();
const changedPaths = exec(`git diff --name-only ${reconciliation.exactBase}...HEAD`)
  .split('\n')
  .map((value) => value.trim())
  .filter(Boolean)
  .sort();

const expectedChangedPaths = [...reconciliation.expectedChangedPaths].sort();
const unauthorizedChangedPaths = changedPaths.filter((path) => !allowedPaths.includes(path));

const indexHtml = read('showroom/globe/h-earth/index.html');
const awardsHtml = read('showroom/globe/h-earth/awards/index.html');
const workflow = read('.github/workflows/h-earth-public-face-trophy-standard.yml');
const browserRunner = read('h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.browser.mjs');

check('CONTROL_CHECKPOINT_B10', reconciliation.checkpoint === 'B10_PUBLIC_FACE_TROPHY_STANDARD_RECONCILIATION');
check('B8_CLOSED', reconciliation.authority.b8 === 'PASS_CLOSED');
check('B9_RECONCILE_RECORDED', reconciliation.authority.b9 === 'RECONCILE_RECORDED');
check('DEFAULT_PROMOTION_HELD', reconciliation.authority.defaultPromotion === false);
check('ALLOWED_PATH_MANIFEST_SEVEN', allowedPaths.length === 7, allowedPaths);
check('ACTUAL_CHANGED_PATHS_EXPECTED_SIX', JSON.stringify(changedPaths) === JSON.stringify(expectedChangedPaths), { changedPaths, expectedChangedPaths });
check('UNAUTHORIZED_CHANGED_PATHS_ZERO', unauthorizedChangedPaths.length === 0, unauthorizedChangedPaths);

const baseCssBlob = exec(`git rev-parse ${reconciliation.exactBase}:showroom/globe/h-earth/index.css`);
const headCssBlob = exec('git rev-parse HEAD:showroom/globe/h-earth/index.css');
check('PUBLIC_STYLESHEET_AUTHORITY_REUSED', baseCssBlob === reconciliation.reusedUnchangedAuthorities.indexCssBlob && headCssBlob === baseCssBlob, { baseCssBlob, headCssBlob });

check('B10_CANDIDATE_ID_PRESENT', indexHtml.includes(reconciliation.candidateId));
check('B10_DEFAULT_INACTIVE', indexHtml.includes('data-h-earth-public-face-candidate="inactive"'));
check('B10_HERO_PRESENT', indexHtml.includes('id="h-earth-b10-hero"'));
check('WELCOME_TO_H_EARTH_PRESENT', indexHtml.includes('Welcome to H-Earth.'));
check('INTERACTIVE_NOW_PRESENT', indexHtml.includes('Interactive now'));
check('IN_ACTIVE_DEVELOPMENT_PRESENT', indexHtml.includes('In active development'));
check('LIVE_WORLD_ARRIVAL_PRESENT', indexHtml.includes('id="h-earth-live-world"'));
check('ENTER_AND_EXPLORE_PRESENT', indexHtml.includes('Enter and explore'));
check('AWARDS_TAB_PRESENT_AND_GATED', indexHtml.includes('id="h-earth-awards-link"') && indexHtml.includes('awards.hidden = !publicFaceActive'));

const publicLenses = [...indexHtml.matchAll(/data-b10-lens="([^"]+)"/g)].map((match) => match[1]);
check('SIX_PUBLIC_CATEGORY_LENSES', JSON.stringify(publicLenses) === JSON.stringify(reconciliation.publicFace.categoryLenses), publicLenses);
check('PUBLIC_LENSES_CLOSED_IN_SOURCE', !/<details[^>]*class="h-earth-b10-lens"[^>]*\sopen(?:\s|>)/i.test(indexHtml));
check('ONE_PUBLIC_LENS_AT_A_TIME_IMPLEMENTED', indexHtml.includes('if (other !== lens) other.open = false'));
check('TECHNICAL_PANELS_RELOCATED_ONLY_IN_CANDIDATE', indexHtml.includes("document.getElementById('h-earth-b10-technical-host').append(runtimeDiagnostics)") && indexHtml.includes("document.getElementById('h-earth-b10-evidence-host').append(startupReceipt, environmentDetails)"));
check('BASELINE_ARRIVAL_PRESERVED', indexHtml.includes('id="h-earth-baseline-arrival"') && indexHtml.includes("document.getElementById('h-earth-baseline-arrival').hidden = true"));
check('OBSERVATORY_CANDIDATE_PRESERVED', indexHtml.includes('H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001'));
check('RUN8E_RUNTIME_MODULE_PRESERVED', indexHtml.includes('./functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js?v=renderer-startup-receipt-v1'));
check('CANVAS_ID_PRESERVED', indexHtml.includes('id="h-earth-functional-landscape-canvas"'));
check('GESTURE_MOUNT_ID_PRESERVED', indexHtml.includes('id="h-earth-functional-landscape-mount"'));

check('AWARDS_ROUTE_IDENTITY', awardsHtml.includes('data-awards-overview="DIAMOND_GATE_BRIDGE_AWARD_LANDSCAPE"'));
check('AWARDS_CLAIM_BOUNDARY', awardsHtml.includes('data-claim-boundary="TARGETS_AND_RATIONALE_NOT_NOMINATIONS_OR_WINS"'));
const awardLenses = [...awardsHtml.matchAll(/data-award-lens="([^"]+)"/g)].map((match) => match[1]);
check('SIX_AWARD_LENSES', JSON.stringify(awardLenses) === JSON.stringify(reconciliation.awardsOverview.lenses), awardLenses);
check('AWARD_LENSES_CLOSED_IN_SOURCE', !/<details[^>]*class="h-earth-award-lens"[^>]*\sopen(?:\s|>)/i.test(awardsHtml));
check('FIVE_TARGET_PROGRAMS', (awardsHtml.match(/data-award-program=/g) || []).length === 5);
check('AWARD_TARGETS_NOT_WINS', awardsHtml.includes('does not claim that a submission, nomination, shortlist, or win has already occurred') && !/data-award-state="(?:WIN|WON|NOMINATED|SHORTLISTED)"/i.test(awardsHtml));
check('AWARDS_RETURN_PRESERVES_B10_CANDIDATE', awardsHtml.includes(`/showroom/globe/h-earth/?candidate=${reconciliation.candidateId}`));

check('WORKFLOW_LOCAL_AND_PUBLIC_MODES', workflow.includes('PUBLIC_VERIFICATION') && workflow.includes('https://diamondgatebridge.com'));
check('WORKFLOW_NO_PR_COMMENT_TRANSPORT', !workflow.includes('issues.createComment'));
check('BROWSER_RUNNER_COVERS_DESKTOP', browserRunner.includes('DESKTOP_POINTER_DRAG_LOOK'));
check('BROWSER_RUNNER_COVERS_MOBILE', browserRunner.includes('MOBILE_ONE_FINGER_LOOK'));
check('BROWSER_RUNNER_COVERS_AWARDS', browserRunner.includes('AWARDS_ROUTE_REACHABLE'));
check('BROWSER_RUNNER_COVERS_ZERO_ERRORS', browserRunner.includes('PAGE_ERRORS_ZERO') && browserRunner.includes('CONSOLE_ERRORS_ZERO') && browserRunner.includes('OWNED_HTTP_ERRORS_ZERO'));

const failedAssertions = assertions.filter((entry) => !entry.pass);
const receiptBody = {
  schemaVersion: 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_B10_STATIC_RECEIPT_v1',
  checkpoint: reconciliation.checkpoint,
  status: failedAssertions.length === 0 ? 'PASS_CLOSED' : 'FAIL',
  exactBase: reconciliation.exactBase,
  candidateHead: process.env.CANDIDATE_HEAD || exec('git rev-parse HEAD'),
  candidateId: reconciliation.candidateId,
  allowedPaths,
  changedPaths,
  unauthorizedChangedPaths,
  reusedUnchangedAuthorities: {
    indexCssBlob: headCssBlob
  },
  assertionCount: assertions.length,
  failedAssertionCount: failedAssertions.length,
  assertions
};
const receiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, receiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));

if (failedAssertions.length > 0) {
  process.exit(1);
}
