import fs from 'node:fs';
import assert from 'node:assert/strict';

const path='control-plane/methods-information-benchmark/f12-recursive-spatial-information-architecture-remediation-v1/f12-r8-r12-continuation-corridor-freeze.v1.json';
const c=JSON.parse(fs.readFileSync(path,'utf8'));

const exact=(actual,expected,label)=>assert.deepEqual(actual,expected,label);
const includesAll=(actual,expected,label)=>{for(const x of expected)assert(actual.includes(x),`${label}:${x}`)};

assert.equal(c.schema,'METHODS_MODELS_F12_R8_R12_CONTINUATION_CORRIDOR_FREEZE_v1');
assert.equal(c.program,'F12_RECURSIVE_SPATIAL_INFORMATION_ARCHITECTURE_REMEDIATION_v1');
assert.equal(c.operation,'F12_R8_R12_CONTINUATION_CORRIDOR_FREEZE_v1');
assert.equal(c.status,'FROZEN_ACTIVE');
assert.equal(c.constructionClass,'ADMINISTRATIVE_NONCHECKPOINT_SUCCESSOR_GOVERNANCE_FREEZE');
assert.equal(c.progressiveLaw,'R_n_PASS_IMPLIES_R_n_PLUS_1_BECOMES_ELIGIBLE');

assert.equal(c.parentAuthority.checkpoint,'R7_CONTINUITY_AND_ACCESSIBILITY');
assert.equal(c.parentAuthority.head,'723de3b034577693b04a41a1cbe2e3d5d82a884f');
assert.equal(c.parentAuthority.tree,'e67f442621214abf4304ada70c5631370d9c738b');
assert.equal(c.parentAuthority.contractGitBlobSha,'475aa283c3feb2fb6520f953c0a96d94285bc214');
assert.equal(c.parentAuthority.runtimeGitBlobSha,'966811ccf1f13f2d37f34bb5c49e5d89c12f7e0d');
assert.equal(c.parentAuthority.verifierGitBlobSha,'bdfd26836b26ca3658dd70acd656a94273fa2f72');
assert.equal(c.parentAuthority.r7Status,'PASS_CLOSED');
assert.equal(c.parentAuthority.r8OrdinalEligibility,'ELIGIBLE_READY_FOR_EXECUTION');
assert.equal(c.parentAuthority.r8ExactNameAtR7Closure,'NOT_ASSIGNED_BY_R7');

exact(c.canonicalRemainingSequence,[
  'R8_BOUNDED_EXPERIENTIAL_PROTOTYPE',
  'R9_FULL_ESTATE_MATERIALIZATION',
  'R10_ADVERSARIAL_DELIVERY_VERIFICATION',
  'R11_EXACT_REMEDIATION_CANDIDATE',
  'R12_USER_ACCEPTANCE'
],'canonical remaining sequence');

assert.equal(c.freezeAuthority.exactNamesSuppliedByDirective,true);
assert.equal(c.freezeAuthority.exactNamesInferredFromRepository,false);
assert.equal(c.freezeAuthority.mayReopenR0ThroughR7,false);
assert.equal(c.freezeAuthority.mayExecuteR8,false);
assert.equal(c.freezeAuthority.mayExecuteR9ThroughR12,false);
assert.equal(c.freezeAuthority.mayMutateMain,false);
assert.equal(c.freezeAuthority.mayMutatePublicMethods,false);
assert.equal(c.freezeAuthority.mayMutateScientificState,false);

assert.equal(c.phaseTransition.directUserExperientialJudgmentBecomesGatingAtR8,true);
assert.equal(c.phaseTransition.automatedVerificationAloneMayCloseR8OrR12,false);

assert.equal(c.R8.checkpoint,'R8_BOUNDED_EXPERIENTIAL_PROTOTYPE');
assert.equal(c.R8.status,'ELIGIBLE_READY_FOR_EXECUTION');
assert.equal(c.R8.scopeClass,'ISOLATED_VISIBLE_PROTOTYPE_ONLY');
includesAll(c.R8.authorized,[
  'CONSTRUCT_ISOLATED_VISIBLE_PROTOTYPE',
  'CONSUME_R3_INTERPRETER',
  'CONSUME_R4_RECURSIVE_NAVIGATION',
  'CONSUME_R5_CONTEXT_BOUND_RELATION_DISCLOSURE',
  'CONSUME_R6_TRANSFORMATION_SEMANTICS',
  'CONSUME_R7_CONTINUITY_AND_ACCESSIBILITY',
  'IMPLEMENT_TOUCH_POINTER_KEYBOARD_EQUIVALENT_CONTROLS',
  'IMPLEMENT_FOREGROUND_BACKGROUND_HIERARCHY',
  'IMPLEMENT_RECURSIVE_DEPTH',
  'IMPLEMENT_RETURN_PATH',
  'IMPLEMENT_CONTEXT_LOCAL_RELATION_DISCLOSURE',
  'EXPOSE_PHONE_USABLE_REVIEW_SURFACE'
],'R8 authorized');
includesAll(c.R8.prohibited,[
  'FULL_ESTATE_MATERIALIZATION','PUBLIC_METHODS_REPLACEMENT','LIVE_DEPLOYMENT','MERGE_TO_MAIN','F1_THROUGH_F11_MUTATION','SCIENTIFIC_REOPENING','SCIENTIFIC_CLAIM_UPGRADE','UNDECLARED_RELATION_CREATION','GLOBAL_RELATION_DUMP_AS_DEFAULT','DECORATIVE_TRANSFORM_AS_PRIMARY_NAVIGATION'
],'R8 prohibited');
exact(c.R8.requiredStructuralDiversity,[
  'FAMILY_TRAVERSAL','RECURSIVE_DEPTH','FOREGROUND_BACKGROUND_CHANGE','ONE_OR_MORE_TYPED_RELATIONS','ADVERSE_OR_MIXED_EVIDENCE','BACKTRACKING','ORIENTATION_RETENTION','TEXT_FIRST_ACCESSIBILITY_EQUIVALENCE','MEANINGFUL_SPATIAL_TRANSFORMATION'
],'R8 required structural diversity');
assert.equal(c.R8.exampleTraversal.binding,false);
assert.equal(c.R8.userDifferentialRequired,true);
exact(c.R8.authorizedUserDifferentials,['MATERIAL_IMPROVEMENT','NO_MATERIAL_IMPROVEMENT','REGRESSION','MIXED','NOT_YET_REVIEWED'],'R8 user differentials');
assert.equal(c.R8.terminalPassLaw,'R8_PASS_CLOSED_IFF_ENGINEERING_PASS_AND_AUTHORITY_PASS_AND_TRACEABILITY_PASS_AND_USER_DIFFERENTIAL_MATERIAL_IMPROVEMENT');
assert.equal(c.R8.unlockR9OnlyWhen.engineeringPass,true);
assert.equal(c.R8.unlockR9OnlyWhen.authorityPass,true);
assert.equal(c.R8.unlockR9OnlyWhen.traceabilityPass,true);
assert.equal(c.R8.unlockR9OnlyWhen.userDifferential,'MATERIAL_IMPROVEMENT');
exact(c.R8.nonUnlockingDifferentials,['NOT_YET_REVIEWED','MIXED','NO_MATERIAL_IMPROVEMENT','REGRESSION'],'R8 non-unlocking differentials');
assert.equal(c.R8.visibleReconstructionAuthority,'AUTHORIZED_ONLY_INSIDE_BOUNDED_R8_PROTOTYPE');
assert.equal(c.R8.publicMutationAuthority,false);
assert.equal(c.R8.mainMutationAuthority,false);

assert.equal(c.R9.checkpoint,'R9_FULL_ESTATE_MATERIALIZATION');
assert.equal(c.R9.status,'BLOCKED_BY_R8');
assert.equal(c.R9.prerequisite,'R8_PASS_CLOSED_WITH_USER_DIFFERENTIAL_MATERIAL_IMPROVEMENT');
assert.equal(c.R9.scaleOutLaw,'R9_MAY_NOT_REDESIGN_THE_INTERACTION_LANGUAGE_DURING_SCALE_OUT');
assert.equal(c.R9.redesignRequiredDisposition,'RETURN_TO_APPROPRIATE_EARLIER_CHECKPOINT');
assert.equal(c.R9.mayQuietlyMutateAcceptedR8Grammar,false);

assert.equal(c.R10.checkpoint,'R10_ADVERSARIAL_DELIVERY_VERIFICATION');
assert.equal(c.R10.status,'BLOCKED_BY_R9');
exact(c.R10.attackSet,[
  'CLAIM_PROMOTION','RELATION_FABRICATION','VISUAL_PROXIMITY_INFERENCE','ADVERSE_EVIDENCE_SUPPRESSION','RETURN_PATH_FAILURE','ORIENTATION_LOSS','DEEP_LINK_DRIFT','ACCESSIBILITY_DIVERGENCE','TEXT_FIRST_DIVERGENCE','SCIENTIFIC_STATE_MUTATION','UNAUTHORIZED_PROJECTION','CLAIM_CEILING_VIOLATION','NONDETERMINISTIC_CONTEXT','MODALITY_DEPENDENCE','GLOBAL_RELATION_OVEREXPOSURE'
],'R10 attack set');

assert.equal(c.R11.checkpoint,'R11_EXACT_REMEDIATION_CANDIDATE');
assert.equal(c.R11.status,'BLOCKED_BY_R10');
exact(c.R11.requiredFreezeIdentity,['EXACT_HEAD','EXACT_TREE','FILE_MANIFEST','PAYLOAD_FINGERPRINT','SCIENTIFIC_DIGESTS','INTERPRETER_VERSION','NAVIGATION_VERSION','PRESENTATION_VERSION','TEST_RESULTS','EVIDENCE_ARTIFACTS','ROLLBACK_TARGET'],'R11 freeze identity');
assert.equal(c.R11.afterFreeze,'NO_CANDIDATE_MUTATION');

assert.equal(c.R12.checkpoint,'R12_USER_ACCEPTANCE');
assert.equal(c.R12.status,'BLOCKED_BY_R11');
assert.equal(c.R12.input,'EXACT_R11_CANDIDATE');
exact(c.R12.authorizedDispositions,['ACCEPTED','REJECTED','MIXED_REQUIRES_REMEDIATION'],'R12 dispositions');
assert.equal(c.R12.engineeringPassCannotOverrideUserRejection,true);
assert.equal(c.R12.maySubstituteDifferentCandidateAfterR11Freeze,false);

assert.equal(c.scientificInvariants.scientificStateDigest,'dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5');
assert.equal(c.scientificInvariants.relationGraphDigest,'4dabc8872082535d01d9bfae3cd9661be68dcf7e1cd6aed5280a9028d4b8137b');
assert.equal(c.scientificInvariants.projectionGraphDigest,'9ebef4a6b8102ffd251c8e7809d379bff560d09fe9c75baa3f707768927b6ce8');
assert.equal(c.scientificInvariants.mutationPermittedByThisFreeze,false);

exact(c.currentLedger,{
  R0:'PASS_CLOSED',R1:'PASS_CLOSED',R2:'PASS_CLOSED',R3:'PASS_CLOSED',R4:'PASS_CLOSED',R5:'PASS_CLOSED',R6:'PASS_CLOSED',R7:'PASS_CLOSED',R8:'ELIGIBLE_READY_FOR_EXECUTION',R9:'BLOCKED_BY_R8',R10:'BLOCKED_BY_R9',R11:'BLOCKED_BY_R10',R12:'BLOCKED_BY_R11',currentAuthorizedGate:'R8_BOUNDED_EXPERIENTIAL_PROTOTYPE',scientificMutation:'NONE',publicMutation:'NONE',mainMutation:'NONE',visibleReconstruction:'AUTHORIZED_ONLY_INSIDE_BOUNDED_R8_PROTOTYPE',userDifferentialRequiredAtR8:true
},'current ledger');

assert.equal(c.administrativeEffect.consumesR8Ordinal,false);
assert.equal(c.administrativeEffect.executesR8,false);
assert.equal(c.administrativeEffect.executesAnyR9ThroughR12,false);
assert.equal(c.administrativeEffect.changesR7Status,false);
assert.equal(c.administrativeEffect.createsPublicExperience,false);
assert.equal(c.administrativeEffect.createsPrototype,false);
assert.equal(c.administrativeEffect.createsPresentationRuntime,false);
assert.equal(c.administrativeEffect.authorizesR8EnvelopeForNextOperation,true);
assert.equal(c.administrativeEffect.requiredAdministrativeAncestorForR8Candidate,true);

console.log(JSON.stringify({
  schema:'METHODS_MODELS_F12_R8_R12_CONTINUATION_CORRIDOR_FREEZE_VERIFICATION_RESULT_v1',
  status:'PASS',
  program:c.program,
  operation:c.operation,
  parentR7Head:c.parentAuthority.head,
  canonicalRemainingSequence:c.canonicalRemainingSequence,
  currentAuthorizedGate:c.currentLedger.currentAuthorizedGate,
  r8UserDifferentialRequired:c.R8.userDifferentialRequired,
  r8UnlockDifferential:c.R8.unlockR9OnlyWhen.userDifferential,
  r9Status:c.R9.status,
  r10Status:c.R10.status,
  r11Status:c.R11.status,
  r12Status:c.R12.status,
  scientificStateDigest:c.scientificInvariants.scientificStateDigest,
  relationGraphDigest:c.scientificInvariants.relationGraphDigest,
  projectionGraphDigest:c.scientificInvariants.projectionGraphDigest,
  administrativeEffect:c.administrativeEffect,
  checks:[
    'R7_EXACT_PARENT_AUTHORITY_PASS',
    'R8_R12_CANONICAL_SEQUENCE_FREEZE_PASS',
    'R8_BOUNDED_VISIBLE_AUTHORITY_PASS',
    'R8_STRUCTURAL_DIVERSITY_REQUIREMENTS_PASS',
    'R8_USER_DIFFERENTIAL_GATE_PASS',
    'R9_SCALE_OUT_NONREDESIGN_LAW_PASS',
    'R10_ADVERSARIAL_ATTACK_SET_PASS',
    'R11_EXACT_CANDIDATE_FREEZE_LAW_PASS',
    'R12_USER_ACCEPTANCE_SUPREMACY_PASS',
    'SCIENTIFIC_INVARIANCE_PASS',
    'NO_R8_EXECUTION_BY_FREEZE_PASS',
    'NO_R9_THROUGH_R12_EXECUTION_PASS',
    'NO_PUBLIC_OR_MAIN_MUTATION_AUTHORITY_PASS'
  ]
},null,2));
