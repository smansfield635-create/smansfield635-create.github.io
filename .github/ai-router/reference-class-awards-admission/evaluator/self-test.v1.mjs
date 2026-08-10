#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate, withEvidenceDigest } from './evaluator.v1.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const FOUNDATION = path.resolve(DIR, '..');
const corpus = JSON.parse(fs.readFileSync(path.join(FOUNDATION, 'reference-corpus.v1.json'), 'utf8'));
const protocol = JSON.parse(fs.readFileSync(path.join(DIR, 'protocol.v1.json'), 'utf8'));
const activation = JSON.parse(fs.readFileSync(path.join(DIR, 'activation-criteria.v1.json'), 'utf8'));
const reference = corpus.positiveReferences.find(r => r.referenceId === 'R_C_LAWS_COMPASS_SIX_AUTHORITY');
if (!reference) throw new Error('R_C reference missing');

const H64 = c => c.repeat(64);
const H40 = c => c.repeat(40);
const DIMENSIONS = [
  'RESOLVED_AUTHORSHIP','VISUAL_SPATIAL_COHERENCE','COMPOSITIONAL_INTEGRITY','INTENTIONAL_HIERARCHY','INTERACTION_INTEGRATION','FINISH_AND_REFINEMENT','PURPOSE_FORM_FIT','RESPONSIVE_INTEGRITY','CLASS_SPECIFIC_SOPHISTICATION','ABSENCE_OF_PROTOTYPE_OR_DEBUG_RESIDUE'
];
const clone = value => structuredClone(value);

function baseBundle() {
  return withEvidenceDigest({
    schema: 'REFERENCE_CLASS_AWARDS_ADMISSION_EVIDENCE_BUNDLE_v1',
    candidate: {
      candidateId: 'SYNTHETIC_REFERENCE_CLASS_CANDIDATE',
      commitSha: H40('a'),
      manifestationClass: reference.manifestationClass
    },
    reference: {
      referenceId: reference.referenceId,
      commitSha: reference.exactCommitSha
    },
    pageExcellence: { result: 'PASS', receiptDigest: H64('1') },
    applicableDevices: ['PHONE','DESKTOP'],
    renderedEvidence: [
      { artifactId:'phone-initial', kind:'SCREENSHOT', stateClass:'INITIAL_RENDERED_STATE', deviceClass:'PHONE', sha256:H64('2') },
      { artifactId:'phone-interaction', kind:'VIDEO', stateClass:'MEANINGFUL_INTERACTION_STATE', deviceClass:'PHONE', sha256:H64('3') },
      { artifactId:'phone-result', kind:'SCREENSHOT', stateClass:'RESULT_OR_NAVIGATION_STATE', deviceClass:'PHONE', sha256:H64('4') },
      { artifactId:'desktop-initial', kind:'SCREENSHOT', stateClass:'INITIAL_RENDERED_STATE', deviceClass:'DESKTOP', sha256:H64('5') },
      { artifactId:'desktop-interaction', kind:'VIDEO', stateClass:'MEANINGFUL_INTERACTION_STATE', deviceClass:'DESKTOP', sha256:H64('6') },
      { artifactId:'desktop-result', kind:'SCREENSHOT', stateClass:'RESULT_OR_NAVIGATION_STATE', deviceClass:'DESKTOP', sha256:H64('7') }
    ],
    interactionTrace: { required:true, meaningfulConsequenceObserved:true, traceDigest:H64('8') },
    technicalContext: { webgl2:true, drag:true, pinch:true, accessibilityScore:100, performanceScore:100, featureCount:999 }
  });
}
function baseAdjudication(bundle) {
  return {
    schema: 'REFERENCE_CLASS_AWARDS_ADMISSION_PERCEPTUAL_ADJUDICATION_v1',
    candidateCommitSha: bundle.candidate.commitSha,
    referenceId: bundle.reference.referenceId,
    referenceCommitSha: bundle.reference.commitSha,
    evidenceBundleDigest: bundle.evidenceDigest,
    adjudicator: { id:'INDEPENDENT_TEST_REVIEWER', kind:'INDEPENDENT_MULTIMODAL_EVALUATOR', independentOfCandidateConstruction:true },
    dimensionVerdicts: Object.fromEntries(DIMENSIONS.map(d => [d,'PARITY_OR_ABOVE'])),
    wholeArtifactDisposition: { sameProfessionalConversation:true },
    catastrophicFailures: [],
    styleSimilarityUsedAsRequirement: false,
    featureInventoryUsedAsPassBasis: false
  };
}
function expect(name, expectedResult, expectedReason, mutateBundle = null, mutateAdjudication = null) {
  let bundle = baseBundle();
  if (mutateBundle) bundle = mutateBundle(clone(bundle));
  let adjudication = baseAdjudication(bundle);
  if (mutateAdjudication) adjudication = mutateAdjudication(clone(adjudication), bundle);
  const receipt = evaluate(bundle, adjudication);
  const pass = receipt.result === expectedResult && (expectedReason == null || receipt.reasonCode === expectedReason);
  return { name, pass, expectedResult, expectedReason, observedResult:receipt.result, observedReason:receipt.reasonCode };
}
function redigest(bundle) {
  delete bundle.evidenceDigest;
  return withEvidenceDigest(bundle);
}

const tests = [
  expect('POSITIVE_REFERENCE_PARITY', 'AWARDS_CONVERSATION_ADMISSIBLE', 'REFERENCE_CLASS_MATURITY_REACHED'),
  expect('BELOW_ONE_HOLISTIC_DIMENSION', 'BELOW_AWARDS_CONVERSATION', 'BELOW_REFERENCE_PARITY', null, a => { a.dimensionVerdicts.VISUAL_SPATIAL_COHERENCE='BELOW_PARITY'; return a; }),
  expect('CATASTROPHIC_FAILURE_NONCOMPENSATORY', 'BELOW_AWARDS_CONVERSATION', 'CATASTROPHIC_FAILURE_PRESENT', null, a => { a.catastrophicFailures=['PRIMARY_EXPERIENCE_IS_PROTOTYPE_OR_DEBUG_SURFACE']; return a; }),
  expect('TRIVIAL_INTERACTION_NONCOMPENSATORY', 'BELOW_AWARDS_CONVERSATION', 'CATASTROPHIC_FAILURE_PRESENT', b => redigest(Object.assign(b,{interactionTrace:{...b.interactionTrace,meaningfulConsequenceObserved:false}}))),
  expect('MISSING_RENDERED_STATE', 'UNEVALUABLE', 'REQUIRED_RENDERED_EVIDENCE_INCOMPLETE', b => redigest(Object.assign(b,{renderedEvidence:b.renderedEvidence.filter(x=>x.stateClass!=='RESULT_OR_NAVIGATION_STATE')}))),
  expect('MISSING_DEVICE_STATE', 'UNEVALUABLE', 'REQUIRED_RENDERED_EVIDENCE_INCOMPLETE', b => redigest(Object.assign(b,{renderedEvidence:b.renderedEvidence.filter(x=>!(x.deviceClass==='DESKTOP'&&x.stateClass==='MEANINGFUL_INTERACTION_STATE'))}))),
  expect('TAMPERED_EVIDENCE_DIGEST', 'UNEVALUABLE', 'EVIDENCE_DIGEST_MISMATCH', b => { b.technicalContext.featureCount=1000; return b; }),
  expect('REFERENCE_COMMIT_TAMPER', 'UNEVALUABLE', 'REFERENCE_IDENTITY_MISMATCH', b => redigest(Object.assign(b,{reference:{...b.reference,commitSha:H40('b')}}))),
  expect('UNBOUND_REFERENCE', 'UNEVALUABLE', 'REFERENCE_IDENTITY_UNBOUND', b => redigest(Object.assign(b,{reference:{referenceId:'UNKNOWN_REFERENCE',commitSha:H40('c')}}))),
  expect('ADJUDICATOR_NOT_INDEPENDENT', 'UNEVALUABLE', 'PERCEPTUAL_ADJUDICATION_INVALID', null, a => { a.adjudicator.independentOfCandidateConstruction=false; return a; }),
  expect('ADJUDICATION_EVIDENCE_BINDING_TAMPER', 'UNEVALUABLE', 'PERCEPTUAL_ADJUDICATION_INVALID', null, a => { a.evidenceBundleDigest=H64('9'); return a; }),
  expect('STYLE_IMITATION_REQUIREMENT_REJECTED', 'UNEVALUABLE', 'PERCEPTUAL_ADJUDICATION_INVALID', null, a => { a.styleSimilarityUsedAsRequirement=true; return a; }),
  expect('FEATURE_INVENTORY_PASS_BASIS_REJECTED', 'UNEVALUABLE', 'PERCEPTUAL_ADJUDICATION_INVALID', null, a => { a.featureInventoryUsedAsPassBasis=true; return a; }),
  expect('HIGH_TECHNICAL_SCORES_CANNOT_RESCUE_PERCEPTUAL_FAILURE', 'BELOW_AWARDS_CONVERSATION', 'BELOW_REFERENCE_PARITY', null, a => { a.dimensionVerdicts.FINISH_AND_REFINEMENT='BELOW_PARITY'; return a; }),
  expect('PAGE_EXCELLENCE_PREREQUISITE_REQUIRED', 'UNEVALUABLE', 'PAGE_EXCELLENCE_PREREQUISITE_NOT_SATISFIED', b => redigest(Object.assign(b,{pageExcellence:{result:'FAIL',receiptDigest:H64('1')}}))),
  expect('WHOLE_ARTIFACT_FALSE', 'BELOW_AWARDS_CONVERSATION', 'REFERENCE_CLASS_MATURITY_NOT_REACHED', null, a => { a.wholeArtifactDisposition.sameProfessionalConversation=false; return a; }),
  expect('WHOLE_ARTIFACT_UNRESOLVED', 'UNEVALUABLE', 'WHOLE_ARTIFACT_DISPOSITION_UNRESOLVED', null, a => { a.wholeArtifactDisposition.sameProfessionalConversation=null; return a; }),
  expect('DIMENSION_UNRESOLVED', 'UNEVALUABLE', 'PERCEPTUAL_ADJUDICATION_INCOMPLETE', null, a => { a.dimensionVerdicts.RESOLVED_AUTHORSHIP='UNEVALUABLE'; return a; }),
  expect('CLASS_MISMATCH', 'UNEVALUABLE', 'REFERENCE_CLASS_MISMATCH', b => redigest(Object.assign(b,{candidate:{...b.candidate,manifestationClass:'LIVE_ENVIRONMENTAL_INTERACTIVE_EXPERIENCE'}}))),
  expect('STYLE_DIFFERENCE_HAS_NO_NEGATIVE_INPUT', 'AWARDS_CONVERSATION_ADMISSIBLE', 'REFERENCE_CLASS_MATURITY_REACHED'),
  expect('SPARSE_RESOLVED_NOT_AUTO_FAILED', 'AWARDS_CONVERSATION_ADMISSIBLE', 'REFERENCE_CLASS_MATURITY_REACHED', b => redigest(Object.assign(b,{technicalContext:{objectCount:3,featureCount:3}})))
];

const authorityChecks = [
  { name:'PROTOCOL_NOT_ACTIVE', pass:protocol.authorityBoundary?.active===false },
  { name:'PROTOCOL_NO_SELF_ACTIVATION', pass:protocol.authorityBoundary?.maySelfActivate===false },
  { name:'ACTIVATION_NOT_SATISFIED', pass:activation.status==='NOT_SATISFIED_PRECALIBRATION' },
  { name:'REAL_CALIBRATION_REQUIRED', pass:Array.isArray(activation.requiredRealCalibrationControls)&&activation.requiredRealCalibrationControls.length===4 },
  { name:'SEPARATE_RATIFICATION_REQUIRED', pass:activation.activationRequiresSeparateRatification===true }
];
const all = [...tests, ...authorityChecks];
const passed = all.filter(x=>x.pass).length;
const receipt = {
  schema:'REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_SELF_TEST_RECEIPT_v1',
  result:passed===all.length?'PASS':'FAIL',
  testCount:all.length,
  passCount:passed,
  failCount:all.length-passed,
  deterministicEvaluator:true,
  noncompensatory:true,
  featureInventoryCanCreatePass:false,
  styleSimilarityRequired:false,
  activationAuthorityCreated:false,
  awardWinnerAuthorityCreated:false,
  namedAwardReadinessAuthorityCreated:false,
  tests:all
};
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
if(receipt.result!=='PASS') process.exitCode=1;
