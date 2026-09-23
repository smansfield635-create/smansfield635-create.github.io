import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { evaluateBoundedLiveAdmission } from '../../tools/instrument-platform/terminal-controllers.mjs';

const BASE = 'eb016b641ce49e1321111529f3eec5c4ae71f771';
const CANDIDATE_ID = 'H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001';
const CANDIDATE_ROUTE = `/showroom/globe/h-earth/?candidate=${CANDIDATE_ID}`;
const EXPECTED_PATHS = Object.freeze([
  '.github/workflows/h-earth-narrative-observatory.yml',
  'h-earth-3d/control-plane/instrument-platform/H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001.v1.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.narrative-observatory.browser.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.narrative-observatory.runner.mjs',
  'showroom/globe/h-earth/index.html',
  'showroom/globe/h-earth/observatory/index.html',
  'showroom/globe/h-earth/observatory/observatory.mjs'
]);
const SECTION_IDS = Object.freeze([
  'H_EARTH_WITHIN_MIRRORLAND',
  'SHADOWS_NEVER_SHATTER_IN_MIRRORLAND',
  'THE_LIVE_ENVIRONMENT',
  'HOW_THE_WORLD_IS_PRESERVED',
  'ONE_REAL_ENGINEERING_SESSION',
  'OPTIONAL_TECHNICAL_EVIDENCE',
  'RETURN_TO_H_EARTH'
]);
const REPLAY_IDS = Object.freeze([
  'PR_400_PLATFORM_PROOF',
  'ENGINEERING_PASS',
  'REPOSITORY_INTEGRATION',
  'PUBLIC_OBSERVATION',
  'USER_DIFFERENTIAL_RECONCILE',
  'AUTOMATIC_PROMOTION_REFUSAL',
  'LEGACY_GAUGE_CONTRACT_DRIFT',
  'SPECIALIZED_GAUGE_RECONCILIATION'
]);
const DESTINATIONS = Object.freeze(['H_EARTH_GAUGES', 'FD_05', 'RUN_8E_R1_PROFILER', 'TERRAIN_WORKBENCH']);
const PROTECTED_BLOBS = Object.freeze({
  'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js': 'de55609b0b0bd66601445a369c727ff7a6d7065d',
  'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js': '0bd36eec01a75311bf6441d575bae5a057195bbc',
  'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js': '5eb1b6f2e72ac0525f608850234182b2c646f66f',
  'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js': '98c768be0cfb2ec4bc82e2b634913d91cc73a32f',
  'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js': 'c9f5ad33bebcf13793c9a0ef37ac363f7b4391ce',
  'showroom/globe/h-earth/functional-landscape/navigation.js': '8ab3446c536fc24423d5601acce232b19fa71c91',
  'showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js': 'aae214ddbc4cd18aa8c737ee7bbb3de44322da96',
  'showroom/globe/h-earth/capacity.js': '89e4622bb9c30b533a1d13d7db887ee53e7a46c8',
  'showroom/globe/h-earth/render/geometry-kernel.js': '91eabcc240b54ef01a52d59a237dff629d90a722',
  'showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js': 'cd7a15e9cc67dbb598ae68c26027fd4ea26bdd5b',
  'gauges/h-earth/index.html': '303d65d17f401bc031001c89cd261a81a065144a',
  'gauges/h-earth/h-earth.current-authority-gauge.v3.mjs': '4ed06be233a2c4d83caaeeb722901509054fec63'
});

const text = (path) => fs.readFileSync(path, 'utf8');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const assertions = [];
const check = (id, condition, detail = null) => {
  assertions.push({ id, pass: Boolean(condition), detail });
  if (!condition) throw new Error(`${id}:${detail ?? 'FAILED'}`);
};

const candidateHead = process.env.CANDIDATE_HEAD || git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${BASE}...${candidateHead}`).split('\n').filter(Boolean).sort();
check('EXACT_CHANGED_PATH_COUNT', changedPaths.length === 7, changedPaths);
check('EXACT_CHANGED_PATHS_MATCH_MANIFEST', JSON.stringify(changedPaths) === JSON.stringify([...EXPECTED_PATHS].sort()), changedPaths);
check('UNAUTHORIZED_CHANGED_PATHS_ZERO', changedPaths.every((path) => EXPECTED_PATHS.includes(path)), changedPaths);

for (const [path, blob] of Object.entries(PROTECTED_BLOBS)) {
  const observed = git('hash-object', path);
  check(`PROTECTED_BLOB_${path}`, observed === blob, { expected: blob, observed });
}

const html = text('showroom/globe/h-earth/observatory/index.html');
const moduleSource = text('showroom/globe/h-earth/observatory/observatory.mjs');
const hEarth = text('showroom/globe/h-earth/index.html');
const control = text('h-earth-3d/control-plane/instrument-platform/H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001.v1.mjs');

check('OBSERVATORY_ROUTE_CONTRACT', html.includes('data-route="/showroom/globe/h-earth/observatory/"') && html.includes('data-observatory="THE_H_EARTH_OBSERVATORY"'));
const foundSections = [...html.matchAll(/data-observatory-section="([A-Z0-9_]+)"/g)].map((match) => match[1]);
check('SEVEN_SECTION_STRUCTURE', JSON.stringify(foundSections) === JSON.stringify(SECTION_IDS), foundSections);
check('NARRATIVE_HIERARCHY', html.includes('H-Earth is the Survival path inside') && html.includes('Shadows Never Shatter in Mirrorland') && html.includes('does not claim an equal or separate narrative authority'));
check('RETURN_TO_H_EARTH', (html.match(/href="\/showroom\/globe\/h-earth\/"/g) ?? []).length >= 4);
check('READ_ONLY_REPLAY', REPLAY_IDS.every((id) => moduleSource.includes(`id: '${id}'`)));
check('REPLAY_CHAPTER_COUNT', (moduleSource.match(/title: '/g) ?? []).length === 8);
check('PROGRESSIVE_DISCLOSURE', html.includes('session-replay-disclosure') && html.includes('technical-evidence-disclosure') && moduleSource.includes('UNIFIED_INSTRUMENT_PLATFORM') && moduleSource.includes('SPECIALIZED_DIAGNOSTICS'));
check('FOUR_SPECIALIZED_DESTINATIONS', DESTINATIONS.every((id) => moduleSource.includes(`id: '${id}'`)));
check('SPECIALIZED_GAUGE_STATE_TRUTHFUL', moduleSource.includes("['PUBLIC_POST_MERGE_RECEIPT', 'OPEN']") && moduleSource.includes("['PROGRAM_CLOSURE', 'FALSE']"));
check('FALSE_CLAIM_EXCLUSION', ['PRODUCT_FAILURE_CONFIRMED', 'PRODUCT_ACCEPTANCE_GRANTED', 'DEFAULT_PROMOTION_COMPLETED', 'PUBLIC_DEFAULT_REVERIFIED'].every((name) => moduleSource.includes(`${name}: false`)));
check('REPOSITORY_CONTROLS_NOT_EXPOSED', !html.includes('REPOSITORY_WRITE') && moduleSource.includes("dataset.repositoryControlsExposed = 'false'"));
check('DIAGNOSTIC_AUTO_LAUNCH_PROHIBITED', moduleSource.includes("dataset.diagnosticAutoLaunch = 'false'"));
check('H_EARTH_ENTRY_TEXT_PRESENT', hEarth.includes('>How this world is preserved</a>'));
check('DEFAULT_FD05_ENTRY_PRESERVED', hEarth.includes('id="h-earth-3d-diagnostic-link"') && hEarth.includes('>FD_05 Diagnostics</a>'));
check('CANDIDATE_OBSERVATORY_ENTRY_HIDDEN_BY_DEFAULT', hEarth.includes('id="h-earth-observatory-link"') && hEarth.includes('hidden>How this world is preserved</a>'));
check('CANDIDATE_GATE_IDENTITY', hEarth.includes(`const candidateId = '${CANDIDATE_ID}'`) && hEarth.includes("dataset.hEarthObservatoryCandidate = active ? 'active' : 'inactive'"));
check('CANDIDATE_FD05_RELOCATION_LOGIC', hEarth.includes('if (fd05) fd05.hidden = active;') && hEarth.includes('if (observatory) observatory.hidden = !active;'));
check('OBSERVATORY_RETURN_PRESERVES_CANDIDATE', moduleSource.includes('candidateReturn') && moduleSource.includes('candidateActive'));
check('OBSERVATORY_FD05_DESTINATION_PRESENT', moduleSource.includes("route: '/showroom/globe/h-earth/diagnostic/'"));
check('LIVE_CANVAS_PRESERVED', hEarth.includes('id="h-earth-functional-landscape-canvas"'));
check('LIVE_RUNTIME_DIAGNOSTICS_PRESERVED', hEarth.includes('class="h-earth-runtime-diagnostics" open'));
check('RENDERER_STARTUP_RECEIPT_PRESERVED', hEarth.includes('class="h-earth-startup-receipt" open'));
check('ENVIRONMENT_DETAILS_PRESERVED', hEarth.includes('class="h-earth-live-details"'));
check('RUN8E_BINDING_PRESERVED', hEarth.includes('public-live-gpu-integration.run8e-r3e.receipt.js?v=renderer-startup-receipt-v1'));
check('CONTROL_BASE_AND_ROLLBACK', control.includes(`exactBase: '${BASE}'`) && control.includes(`rollbackTarget: '${BASE}'`));
check('KEYBOARD_TRAVERSAL_NOT_ADDED', !html.includes('keyboard traversal') && !moduleSource.includes('KEYBOARD_TRAVERSAL'));

const admission = evaluateBoundedLiveAdmission({
  currentAuthorityState: 'ENGINEERING_PASS',
  candidateId: CANDIDATE_ID,
  engineeringReceipt: { verificationMatrixPassed: true, candidateHead },
  admissionManifest: {
    bounded: true,
    candidateRoute: CANDIDATE_ROUTE,
    candidateBinding: candidateHead,
    acceptedDefaultRoute: '/showroom/globe/h-earth/',
    defaultPresentationPreservedByCandidateGate: true
  },
  rollbackRelation: { rollbackTarget: BASE },
  presumesAcceptance: false
});
check('BOUNDED_LIVE_ADMISSION_CONTROLLER_AUTHORIZES', admission.authorized === true, admission);
check('ADMISSION_DOES_NOT_ACCEPT_OR_PROMOTE', admission.productAccepted === false && admission.defaultPromoted === false, admission);

const receiptBody = {
  schemaVersion: 'H_EARTH_NARRATIVE_OBSERVATORY_B5_STATIC_RECEIPT_v1',
  status: 'PASS_CLOSED',
  exactBase: BASE,
  candidateHead,
  candidateId: CANDIDATE_ID,
  candidateRoute: CANDIDATE_ROUTE,
  exactChangedPaths: changedPaths,
  assertionCount: assertions.length,
  failedAssertionCount: assertions.filter((entry) => !entry.pass).length,
  protectedPathMutations: 0,
  unauthorizedChangedPaths: 0,
  specializedGaugeContractMutation: false,
  baselinePublicDefaultPresentationPreserved: true,
  boundedLiveAdmission: admission,
  assertions
};
const receipt = { ...receiptBody, receiptSha256: sha256(JSON.stringify(receiptBody)) };
const outputPath = process.env.H_EARTH_OBSERVATORY_B5_RECEIPT || '/tmp/h-earth-narrative-observatory-b5.receipt.json';
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`H_EARTH_NARRATIVE_OBSERVATORY_B5_PASS:${candidateHead}:${receipt.receiptSha256}:${assertions.length}`);
