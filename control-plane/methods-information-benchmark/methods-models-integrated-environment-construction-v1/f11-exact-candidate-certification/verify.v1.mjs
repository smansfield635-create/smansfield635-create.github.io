import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {assembleIntegratedEnvironment} from '../f9-integrated-environment-assembly/integrated-environment-runtime.v1.mjs';
import {executeAdversarialGauntlet} from '../f10-adversarial-verification/adversarial-harness.v1.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root='control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1';
const read=name=>JSON.parse(fs.readFileSync(path.join(here,name),'utf8'));
const contract=read('exact-candidate-certification-contract.v1.json');
const manifest=read('certified-candidate-manifest.v1.json');
const rollback=read('rollback-contract.v1.json');
const ledger=read('certification-integrity-ledger.v1.json');
const receipt=read('f11-terminal-receipt.v1.json');
const assert=(condition,message)=>{if(!condition) throw new Error(message);};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const sha256=text=>crypto.createHash('sha256').update(text,'utf8').digest('hex');

assert(contract.operation==='F11_EXACT_CANDIDATE_CERTIFICATION_v1','F11_OPERATION_MISMATCH');
assert(contract.requiredInputF10Head===manifest.certifiedEnvironmentHead,'F11_HEAD_CONTRACT_MANIFEST_MISMATCH');
assert(contract.requiredInputF10Tree===manifest.certifiedEnvironmentTree,'F11_TREE_CONTRACT_MANIFEST_MISMATCH');
assert(receipt.inputF10Head===manifest.certifiedEnvironmentHead&&receipt.inputF10Tree===manifest.certifiedEnvironmentTree,'F11_RECEIPT_INPUT_MISMATCH');
assert(['CANDIDATE_AWAITING_EXACT_HEAD_VERIFICATION','PASS_CLOSED'].includes(receipt.status),'F11_RECEIPT_STATUS_INVALID');
assert(receipt.candidatePayloadFingerprintSha256===manifest.candidatePayloadFingerprintSha256,'F11_RECEIPT_FINGERPRINT_MISMATCH');
assert(rollback.rollbackTargetHead===manifest.certifiedEnvironmentHead&&rollback.rollbackTargetTree===manifest.certifiedEnvironmentTree,'F11_ROLLBACK_TARGET_MISMATCH');
assert(rollback.automaticRollbackAuthorized===false&&rollback.destructiveResetAuthorized===false,'F11_ROLLBACK_AUTHORITY_LEAK');
assert(ledger.history.some(v=>v.runId===31217689014&&v.admissibleAsPassingEvidence===false),'F11_QUARANTINED_HISTORY_NOT_PRESERVED');
assert(receipt.quarantinedHistoricalRunPreserved===31217689014,'F11_RECEIPT_QUARANTINE_MISMATCH');

const inputTree=git('rev-parse',`${manifest.certifiedEnvironmentHead}^{tree}`);
assert(inputTree===manifest.certifiedEnvironmentTree,'F11_CERTIFIED_INPUT_TREE_MISMATCH');
execFileSync('git',['merge-base','--is-ancestor',manifest.certifiedEnvironmentHead,'HEAD'],{stdio:'ignore'});

let fingerprintSource='';
for(const item of manifest.frozenPackageTrees){
  const atInput=git('rev-parse',`${manifest.certifiedEnvironmentHead}:${root}/${item.name}`);
  const atHead=git('rev-parse',`HEAD:${root}/${item.name}`);
  assert(atInput===item.tree,`F11_INPUT_PACKAGE_TREE_MISMATCH:${item.name}`);
  assert(atHead===item.tree,`F11_CURRENT_PACKAGE_TREE_DRIFT:${item.name}`);
  fingerprintSource+=`${item.name}=${item.tree}\n`;
}
assert(sha256(fingerprintSource)===manifest.candidatePayloadFingerprintSha256,'F11_PACKAGE_FINGERPRINT_MISMATCH');

const environment=assembleIntegratedEnvironment();
assert(environment.environmentScienceDigest===manifest.environmentScienceDigest,'F11_ENVIRONMENT_SCIENCE_DIGEST_DRIFT');
assert(environment.scene.scienceDigest===manifest.sceneScienceDigest,'F11_SCENE_SCIENCE_DIGEST_DRIFT');
const gauntlet=executeAdversarialGauntlet();
assert(gauntlet.disposition==='PASS_F10_ADVERSARIAL_GAUNTLET_v1','F11_F10_GAUNTLET_REPRODUCTION_FAILED');
assert(gauntlet.attackCount===manifest.f10AttackCount,'F11_F10_ATTACK_COUNT_DRIFT');
assert(gauntlet.attacksRejectedOrConstrained===manifest.f10AttacksRejectedOrConstrained,'F11_F10_ATTACK_REJECTION_DRIFT');
assert(gauntlet.environmentScienceDigest===manifest.environmentScienceDigest,'F11_F10_ENVIRONMENT_DIGEST_DRIFT');
assert(gauntlet.sceneScienceDigest===manifest.sceneScienceDigest,'F11_F10_SCENE_DIGEST_DRIFT');

assert(receipt.f1ThroughF10Rewrite===false,'F11_UPSTREAM_REWRITE_RECORDED');
assert(receipt.scientificClaimUpgrade===false,'F11_CLAIM_UPGRADE_RECORDED');
assert(receipt.publicMethodsMutation===false&&receipt.publicLawsMutation===false&&receipt.pr541Mutation===false,'F11_PUBLIC_OR_PR541_MUTATION_RECORDED');
assert(contract.f12ExecutionAuthorizedByConstruction===false,'F12_EXECUTION_AUTHORITY_LEAK');
assert(receipt.f12AuthorityAfterEffectivePass===true,'F12_SUCCESSOR_AUTHORITY_NOT_DECLARED');

if(receipt.status==='PASS_CLOSED'){
  assert(typeof receipt.candidateVerificationHead==='string'&&/^[a-f0-9]{40}$/.test(receipt.candidateVerificationHead),'F11_VERIFICATION_HEAD_MISSING');
  assert(Number.isInteger(receipt.candidateVerificationRunId),'F11_VERIFICATION_RUN_MISSING');
  assert(Number.isInteger(receipt.candidateVerificationArtifactId),'F11_VERIFICATION_ARTIFACT_MISSING');
  assert(typeof receipt.candidateVerificationArtifactDigest==='string'&&/^sha256:[a-f0-9]{64}$/.test(receipt.candidateVerificationArtifactDigest),'F11_VERIFICATION_ARTIFACT_DIGEST_MISSING');
}

process.stdout.write(JSON.stringify({
  disposition:'PASS_F11_EXACT_CANDIDATE_CERTIFICATION_v1',
  receiptStatus:receipt.status,
  certifiedEnvironmentHead:manifest.certifiedEnvironmentHead,
  certifiedEnvironmentTree:manifest.certifiedEnvironmentTree,
  candidatePayloadFingerprintSha256:manifest.candidatePayloadFingerprintSha256,
  environmentScienceDigest:manifest.environmentScienceDigest,
  sceneScienceDigest:manifest.sceneScienceDigest,
  frozenPackageTreesVerified:manifest.frozenPackageTrees.length,
  f10AttacksReproduced:gauntlet.attackCount,
  f10AttacksRejectedOrConstrained:gauntlet.attacksRejectedOrConstrained,
  quarantinedHistoricalRunPreserved:31217689014,
  f12AuthorityAfterEffectivePass:true,
  f12Execution:'NOT_STARTED_REQUIRES_SEPARATE_USER_VISUAL_EXPERIENTIAL_REVIEW_AUTHORIZATION'
},null,2)+'\n');
