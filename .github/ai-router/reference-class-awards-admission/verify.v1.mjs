#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const BASE = '.github/ai-router/reference-class-awards-admission';
const EXPECTED_GOVERNING_HEAD = 'eb9a1730f201ba8a8c3822b65ecb984592de38bd';
const EXPECTED_OPERATION = 'REFERENCE_CLASS_AWARDS_ADMISSION_INSTRUMENT_PREACTIVATION_V1_20260809_001';
const EXPECTED_GENERATION = 890;
const EXPECTED_PATHS = Object.freeze([
  `${BASE}/README.md`,
  `${BASE}/operation-request.v1.json`,
  `${BASE}/construction-procedure.v1.json`,
  `${BASE}/registration-surface-reconciliation.v1.json`,
  `${BASE}/substantive-contract.v1.json`,
  `${BASE}/reference-corpus.v1.json`,
  `${BASE}/decision-boundary.v1.json`,
  `${BASE}/calibration-fixtures.v1.json`,
  `${BASE}/current-state.v1.json`,
  `${BASE}/verify.v1.mjs`
]);
const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;
const failures = [];
const checks = [];

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
const canonical = value => JSON.stringify(stable(value));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
const check = (id, condition, detail = null) => {
  const pass = Boolean(condition);
  checks.push({ id, pass, detail });
  if (!pass) failures.push({ id, detail });
};
const git = args => childProcess.execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
const gitPasses = args => {
  try { childProcess.execFileSync('git', args, { cwd: ROOT, stdio: 'ignore' }); return true; }
  catch { return false; }
};

if (process.argv.length !== 3 || process.argv[2] !== '--verify-static') {
  process.stderr.write('Usage: node verify.v1.mjs --verify-static\n');
  process.exit(2);
}

const executionHead = git(['rev-parse', 'HEAD^{commit}']);
check('EXECUTION_HEAD_VALID', HEX40.test(executionHead), executionHead);
check('EXECUTION_HEAD_NOT_GOVERNING_BASE', executionHead !== EXPECTED_GOVERNING_HEAD, executionHead);
check('GOVERNING_HEAD_IS_ANCESTOR', gitPasses(['merge-base', '--is-ancestor', EXPECTED_GOVERNING_HEAD, executionHead]));
let observedChangedPaths = [];
try {
  observedChangedPaths = git(['diff', '--name-only', `${EXPECTED_GOVERNING_HEAD}...${executionHead}`]).split(/\r?\n/).map(x=>x.trim()).filter(Boolean).sort();
} catch (error) {
  check('EXACT_CANDIDATE_DIFF_AVAILABLE', false, String(error?.message ?? error));
}
check('EXACT_CANDIDATE_DIFF_TEN_PATHS', canonical(observedChangedPaths) === canonical([...EXPECTED_PATHS].sort()), { observedChangedPaths, expectedPaths: [...EXPECTED_PATHS].sort() });
check('WORKTREE_CLEAN', git(['status', '--porcelain=v1', '--untracked-files=all']) === '');

for (const relative of EXPECTED_PATHS) check(`FILE_PRESENT:${relative}`, fs.existsSync(path.join(ROOT, relative)));
if (failures.length) {
  console.log(JSON.stringify({ schema:'REFERENCE_CLASS_AWARDS_ADMISSION_STATIC_VERIFICATION_RECEIPT_v1', result:'FAIL', executionHead, failures, checks }, null, 2));
  process.exit(1);
}

const op = readJson(`${BASE}/operation-request.v1.json`);
const procedure = readJson(`${BASE}/construction-procedure.v1.json`);
const registration = readJson(`${BASE}/registration-surface-reconciliation.v1.json`);
const contract = readJson(`${BASE}/substantive-contract.v1.json`);
const corpus = readJson(`${BASE}/reference-corpus.v1.json`);
const boundary = readJson(`${BASE}/decision-boundary.v1.json`);
const fixtures = readJson(`${BASE}/calibration-fixtures.v1.json`);
const state = readJson(`${BASE}/current-state.v1.json`);

check('OPERATION_SCHEMA', op.schema === 'REPOSITORY_OPERATION_REQUEST_v1');
check('PROCEDURE_SCHEMA', procedure.schema === 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1');
check('OPERATION_ID', op.operationId === EXPECTED_OPERATION);
check('GOVERNING_HEAD_REQUEST', op.exactGoverningHead === EXPECTED_GOVERNING_HEAD);
check('GOVERNING_HEAD_PROCEDURE', procedure.exactGoverningHead === EXPECTED_GOVERNING_HEAD);
check('EXACT_TEN_ALLOWED_PATHS', op.allowedPaths.length === 10 && new Set(op.allowedPaths).size === 10);
check('REQUEST_PROCEDURE_PATH_EQUALITY', canonical(op.allowedPaths) === canonical(procedure.exactAllowedRepositoryPaths));
check('REQUEST_PATH_SET_EXACT', canonical([...op.allowedPaths].sort()) === canonical([...EXPECTED_PATHS].sort()));
check('TEST_COMMAND_EQUALITY', op.exactTestCommand === procedure.exactTestRunnerCommand);
check('WORKFLOW_EQUALITY', op.workflowPath === procedure.workflowAndArtifactPackagingPaths.workflowPath);
check('ARTIFACT_PATH_EQUALITY', canonical(op.artifactPaths) === canonical(procedure.workflowAndArtifactPackagingPaths.artifactPaths));
check('FINGERPRINT_DOMAIN_EQUALITY', canonical(op.fingerprintDomain) === canonical(procedure.bridgeOutputFingerprintDomain));
check('ERROR_PRECEDENCE_EQUALITY', canonical(op.errorPrecedence) === canonical(procedure.errorCodeAndValidationPrecedence));
const observedRequestDigest = sha256(canonical(op));
const observedProcedureDigest = sha256(canonical(procedure));
check('REQUEST_DIGEST_MATCHES_ADMISSION', observedRequestDigest === state.admission.requestDigest, { observed: observedRequestDigest, expected: state.admission.requestDigest });
check('PROCEDURE_DIGEST_MATCHES_ADMISSION', observedProcedureDigest === state.admission.procedureLocatorDigest, { observed: observedProcedureDigest, expected: state.admission.procedureLocatorDigest });

check('REGISTRATION_SCHEMA', registration.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_REGISTRATION_SURFACE_RECONCILIATION_v1');
check('SHARED_CONTROL_PLANE_HOME', registration.resolvedHome?.projectId === 'REPOSITORY_AI_ROUTER_INFRASTRUCTURE');
check('PAGE_EXCELLENCE_COUNT_PRESERVED', registration.existingSurfaces?.find(x=>x.id==='PAGE_EXCELLENCE_TOOLCHAIN')?.registeredInstrumentCount === 9 && registration.laws?.noPageExcellenceInstrumentCountMutation === true);
check('H_EARTH_COUNT_PRESERVED', registration.existingSurfaces?.find(x=>x.id==='H_EARTH_INSTRUMENT_PLATFORM')?.registeredToolCount === 4 && registration.laws?.noHEarthToolCountMutation === true);
check('NO_REGISTRATION_AUTHORITY_LEAK', registration.laws?.noAwardsAuthorityCreated === true && registration.laws?.activationRequiresSeparateOperation === true);

const dispositions = ['AWARDS_CONVERSATION_ADMISSIBLE','BELOW_AWARDS_CONVERSATION','UNEVALUABLE'];
check('CONTRACT_SCHEMA', contract.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_SUBSTANTIVE_CONTRACT_v1');
check('CONTRACT_EXACT_DISPOSITIONS', canonical(contract.allowedDispositions) === canonical(dispositions));
check('PAGE_EXCELLENCE_NOT_ADMISSION', contract.prerequisite?.pageExcellencePassCreatesAdmission === false && contract.prerequisite?.technicalConformanceCreatesAdmission === false);
check('REFERENCE_PARITY_NOT_IMITATION', contract.decisionLaws?.referenceParityMeansMaturityParityNotImitation === true && contract.decisionLaws?.styleSimilarityRequired === false);
check('WHOLE_NOT_INGREDIENT_CHECKLIST', contract.decisionLaws?.featureInventoryMayCreatePass === false && contract.decisionLaws?.atomicCapabilityChecklistMayCreatePass === false && contract.decisionLaws?.wholeRenderedExperienceIsPrimaryUnitOfJudgment === true);
check('CATASTROPHIC_FAILURES_NONCOMPENSATORY', contract.decisionLaws?.catastrophicFailuresAreNoncompensatory === true && contract.decisionLaws?.weightedAverageMayOverrideCatastrophicFailure === false);
check('CONTRACT_NOT_ACTIVE', contract.authorityBoundary?.currentlyActive === false);
check('NO_AWARD_AUTHORITY', contract.authorityBoundary?.mayDeclareAwardWinner === false && contract.authorityBoundary?.mayDeclareNamedAwardReadiness === false);

check('BOUNDARY_SCHEMA', boundary.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_DECISION_BOUNDARY_v1');
check('BOUNDARY_EXACT_DISPOSITIONS', canonical(boundary.allowedDispositions) === canonical(dispositions));
check('BOUNDARY_NONCOMPENSATORY', boundary.noncompensation?.enabled === true && Object.entries(boundary.noncompensation).filter(([key])=>key!=='enabled').every(([,value])=>value===false));
check('BOUNDARY_REJECTS_FEATURE_PASS', boundary.explicitProhibitions?.includes('PASS_FROM_ATOMIC_FEATURE_INVENTORY'));
check('BOUNDARY_REJECTS_STYLE_TEMPLATE', boundary.explicitProhibitions?.includes('PASS_FROM_STYLE_SIMILARITY_TO_REFERENCE') && boundary.explicitProhibitions?.includes('FAIL_FROM_STYLE_DIFFERENCE_ALONE'));

check('CORPUS_SCHEMA', corpus.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_REFERENCE_CORPUS_v1');
check('THREE_POSITIVE_REFERENCES', Array.isArray(corpus.positiveReferences) && corpus.positiveReferences.length === 3);
check('ONE_NEGATIVE_CONTROL', Array.isArray(corpus.negativeControls) && corpus.negativeControls.length === 1);
check('REFERENCE_IDS_UNIQUE', new Set([...corpus.positiveReferences,...corpus.negativeControls].map(x=>x.referenceId)).size === 4);
for (const ref of [...corpus.positiveReferences, ...corpus.negativeControls]) {
  check(`REFERENCE_COMMIT_SHA:${ref.referenceId}`, HEX40.test(ref.exactCommitSha ?? ''), ref.exactCommitSha);
  check(`REFERENCE_SOURCE_FILES:${ref.referenceId}`, Array.isArray(ref.sourceFiles) && ref.sourceFiles.length > 0);
  for (const source of ref.sourceFiles ?? []) {
    check(`REFERENCE_BLOB_SHA:${ref.referenceId}:${source.path}`, HEX40.test(source.gitBlobSha ?? ''), source.gitBlobSha);
    try {
      const observed = git(['rev-parse', `${ref.exactCommitSha}:${source.path}`]);
      check(`REFERENCE_BLOB_IDENTITY:${ref.referenceId}:${source.path}`, observed === source.gitBlobSha, { observed, expected: source.gitBlobSha });
    } catch {
      check(`REFERENCE_BLOB_IDENTITY:${ref.referenceId}:${source.path}`, false, 'REFERENCE_COMMIT_OR_PATH_UNAVAILABLE');
    }
  }
}
const negative = corpus.negativeControls[0];
check('FAILED_PHI1_IS_NEGATIVE_ONLY', negative.referenceId === 'N_PHI1_FAILED_MANIFESTATION' && negative.expectedCalibrationDisposition === 'BELOW_AWARDS_CONVERSATION' && negative.authorityInheritance === false && negative.designInheritance === false && negative.priorAutomatedPassMayCreatePositiveStatus === false);
check('ALL_POSITIVE_EXPECT_ADMISSIBLE', corpus.positiveReferences.every(x=>x.expectedCalibrationDisposition==='AWARDS_CONVERSATION_ADMISSIBLE'));
check('NO_REFERENCE_STYLE_AUTHORITY', corpus.positiveReferences.every(x=>x.styleTemplateAuthority===false));

check('FIXTURE_SCHEMA', fixtures.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_CALIBRATION_FIXTURES_v1');
check('KNOWN_CONTROL_COUNT', fixtures.knownControls?.length === 4);
check('FAILED_PHI1_FIXTURE_EXPECTATION', fixtures.knownControls?.find(x=>x.id==='N_PHI1_FAILED_MANIFESTATION')?.expected === 'BELOW_AWARDS_CONVERSATION');
check('ADVERSARIAL_FIXTURE_COVERAGE', fixtures.adversarialFixtureSpecifications?.length >= 9);
check('NO_SELF_ACTIVATION', fixtures.activationCalibrationRequirements?.instrumentMayActivateOnSelfDeclaredCalibration === false);

check('STATE_SCHEMA', state.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_CURRENT_STATE_v1');
check('STATE_OPERATION_ID', state.operationId === EXPECTED_OPERATION);
check('STATE_GENERATION', state.lockGeneration === EXPECTED_GENERATION);
check('STATE_GOVERNING_HEAD', state.exactGoverningHead === EXPECTED_GOVERNING_HEAD);
check('STATE_ROUTER_PASS', state.preMutationRouter?.result === 'PASS' && state.preMutationRouter?.routeCount === 10 && state.preMutationRouter?.exactHeadVerified === true);
check('STATE_NOT_ACTIVE', state.authority?.candidateInstrumentActive === false && state.authority?.productionEnforcementActive === false && state.authority?.awardsAdmissionAuthorityCreated === false && state.authority?.namedAwardReadinessAuthorityCreated === false && state.authority?.mergeAuthorityCreated === false);
check('ADMISSION_DIGESTS_HEX', HEX64.test(state.admission?.requestDigest ?? '') && HEX64.test(state.admission?.procedureLocatorDigest ?? '') && HEX64.test(state.admission?.scopeHash ?? ''));

const packageFingerprint = sha256(Buffer.concat(EXPECTED_PATHS.map(relative => fs.readFileSync(path.join(ROOT, relative)))));
const receipt = {
  schema: 'REFERENCE_CLASS_AWARDS_ADMISSION_STATIC_VERIFICATION_RECEIPT_v1',
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  instrumentId: 'REFERENCE_CLASS_AWARDS_ADMISSION_INSTRUMENT_v1',
  operationId: EXPECTED_OPERATION,
  lockGeneration: EXPECTED_GENERATION,
  governingHead: EXPECTED_GOVERNING_HEAD,
  executionHead,
  observedChangedPaths,
  packagePathCount: EXPECTED_PATHS.length,
  checkCount: checks.length,
  passedCheckCount: checks.filter(x=>x.pass).length,
  failedCheckCount: failures.length,
  requestDigest: observedRequestDigest,
  procedureDigest: observedProcedureDigest,
  packageFingerprint,
  activationAuthorityCreated: false,
  awardsAuthorityCreated: false,
  failures,
  checks
};
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
