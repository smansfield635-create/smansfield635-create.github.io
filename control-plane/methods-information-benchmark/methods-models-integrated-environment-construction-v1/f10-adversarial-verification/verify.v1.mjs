import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {assembleIntegratedEnvironment} from '../f9-integrated-environment-assembly/integrated-environment-runtime.v1.mjs';
import {executeAdversarialGauntlet} from './adversarial-harness.v1.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(here,name),'utf8'));
const assert=(condition,message)=>{if(!condition) throw new Error(message);};
const contract=read('adversarial-verification-contract.v1.json');
const matrix=read('attack-matrix.v1.json');
const integrity=read('verification-integrity-ledger.v1.json');
const receipt=read('f10-terminal-receipt.v1.json');

assert(contract.operation==='F10_ADVERSARIAL_VERIFICATION_v1','F10_OPERATION_MISMATCH');
assert(contract.inputF9Head==='858ddf423be1ea42e3b456230f2e1b05b474abf3','F10_INPUT_HEAD_MISMATCH');
assert(contract.inputF9Tree==='87967285cc334e585746d9b4981fb8d932bf9a0d','F10_INPUT_TREE_MISMATCH');
assert(contract.attackClasses.length===15,'F10_ATTACK_CLASS_COUNT_MISMATCH');
assert(matrix.attacks.length===15,'F10_ATTACK_MATRIX_COUNT_MISMATCH');
assert(integrity.records.some(r=>r.runId===31217689014&&r.classification==='QUARANTINED_NONTERMINAL_VERIFICATION'&&r.admissibleAsPassEvidence===false),'F9_MASKED_FAILURE_NOT_PRESERVED');
assert(integrity.f10Requirement==='ALL_PIPELINED_VERIFIER_COMMANDS_MUST_RUN_UNDER_FAIL_PROPAGATING_SHELL_SEMANTICS','F10_PIPEFAIL_REQUIREMENT_MISSING');
assert(['CANDIDATE_AWAITING_EXACT_HEAD_VERIFICATION','PASS_CLOSED'].includes(receipt.status),'F10_RECEIPT_STATUS_INVALID');
assert(receipt.f11ExecutionAfterEffectivePass==='NOT_STARTED_REQUIRES_SEPARATE_AUTHORIZATION','F11_EXECUTION_BOUNDARY_MISMATCH');
assert(receipt.f12Authority===false,'F12_AUTHORITY_LEAK');
assert(receipt.f1ThroughF9Rewrite===false&&receipt.scientificClaimUpgrade===false,'UPSTREAM_OR_CLAIM_MUTATION_RECORDED');
assert(receipt.publicMethodsMutation===false&&receipt.publicLawsMutation===false&&receipt.pr541Mutation===false,'PUBLIC_OR_PR541_MUTATION_RECORDED');
if(receipt.status==='PASS_CLOSED'){
  assert(Number.isInteger(receipt.candidateVerificationRunId)&&receipt.candidateVerificationRunId>0,'CANDIDATE_RUN_ID_MISSING');
  assert(Number.isInteger(receipt.candidateVerificationArtifactId)&&receipt.candidateVerificationArtifactId>0,'CANDIDATE_ARTIFACT_ID_MISSING');
  assert(typeof receipt.candidateVerificationArtifactDigest==='string'&&/^sha256:[a-f0-9]{64}$/.test(receipt.candidateVerificationArtifactDigest),'CANDIDATE_ARTIFACT_DIGEST_MISSING');
}

const environment=assembleIntegratedEnvironment();
assert(environment.environmentScienceDigest==='dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5','F9_ENVIRONMENT_SCIENCE_DIGEST_DRIFT');
assert(environment.scene.scienceDigest==='82ad07a6e99424229c9fdee014de0e764474fb0fc382383aae06cb15dfb797ff','F8_SCENE_SCIENCE_DIGEST_DRIFT');
assert(environment.portfolioStudyCount===22,'PORTFOLIO_STUDY_COUNT_DRIFT');
assert(environment.statefulEntryCount===16,'STATEFUL_ENTRY_COUNT_DRIFT');
assert(environment.scene.counts.claims===19,'CANONICAL_CLAIM_COUNT_DRIFT');
assert(environment.scene.counts.typedRelations===38,'TYPED_RELATION_COUNT_DRIFT');

const result=executeAdversarialGauntlet();
assert(result.disposition==='PASS_F10_ADVERSARIAL_GAUNTLET_v1','F10_GAUNTLET_NOT_PASS');
assert(result.attackCount===15,'F10_ATTACK_EXECUTION_COUNT_MISMATCH');
assert(result.attacksRejectedOrConstrained===15,'F10_ATTACK_REJECTION_COUNT_MISMATCH');
assert(result.authorizedScientificRelationsPreserved===true,'AUTHORIZED_RELATIONS_NOT_PRESERVED');
assert(result.authorizedEstateProjectionsPreserved===true,'AUTHORIZED_PROJECTIONS_NOT_PRESERVED');

process.stdout.write(JSON.stringify({
  disposition:'PASS_F10_ADVERSARIAL_VERIFICATION_v1',
  receiptStatus:receipt.status,
  environmentScienceDigest:result.environmentScienceDigest,
  sceneScienceDigest:result.sceneScienceDigest,
  attackCount:result.attackCount,
  attacksRejectedOrConstrained:result.attacksRejectedOrConstrained,
  quarantinedF9RunPreserved:31217689014,
  f11AuthorityAfterEffectivePass:true,
  f11Execution:'NOT_STARTED_REQUIRES_SEPARATE_AUTHORIZATION',
  f12Authority:false
},null,2)+'\n');
