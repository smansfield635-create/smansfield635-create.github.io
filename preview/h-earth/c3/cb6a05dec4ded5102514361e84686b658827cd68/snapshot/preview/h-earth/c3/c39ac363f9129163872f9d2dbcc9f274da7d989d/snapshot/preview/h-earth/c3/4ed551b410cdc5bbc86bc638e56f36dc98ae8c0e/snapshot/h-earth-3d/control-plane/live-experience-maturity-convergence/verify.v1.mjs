#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../../');
const expectedHead='9eb636d33cff36b2344bb721726db7b4e8dcd2bc';
const program='H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_v1';
const read=(name)=>JSON.parse(fs.readFileSync(path.join(here,name),'utf8'));
const files=read('changed-path-manifest.v1.json').paths;
const checks=[];
const check=(id,pass,detail=null)=>checks.push({id,pass:Boolean(pass),detail});
const canonical=(v)=>JSON.stringify(v);
const operation=read('operation-request.v1.json');
const procedure=read('construction-procedure.v1.json');
const locator=read('program.locator.v1.json');
const authority=read('authority-and-lineage.v1.json');
const strategy=read('strategy-contract.v1.json');
const runtime=read('protected-runtime-manifest.v1.json');
const page=read('page-excellence-binding.v1.json');
const checkpoints=read('checkpoint-registry.v1.json');
const state=read('current-state.v1.json');
const recovery=read('successor-room-recovery.v1.json');
const verification=read('verification-contract.v1.json');
const classification=read('shell-runtime-classification.schema.v1.json');

check('EXACT_PATH_MANIFEST',files.length===15 && new Set(files).size===15 && files.every(p=>p.startsWith('h-earth-3d/control-plane/live-experience-maturity-convergence/')));
check('PROGRAM_IDENTITY_COHERENCE',[locator.programId,authority.programId,strategy.programId,page.schema?program:null,checkpoints.programId,state.programId,recovery.programId,verification.programId].every(x=>x===program));
check('STARTING_HEAD_COHERENCE',locator.startingHead===expectedHead && authority.startingAuthority.exactGoverningHead===expectedHead && strategy.startingHead===expectedHead && runtime.baselineCommit===expectedHead && state.startingHead===expectedHead && operation.exactGoverningHead===expectedHead && procedure.exactGoverningHead===expectedHead);
check('STRATEGY_CORE_LAWS_PRESENT',strategy.laws.includes('UNBOX_THE_EXPERIENCE_NOT_EQUAL_REBUILD_THE_EXPERIENCE') && strategy.laws.includes('RUNTIME_PRESERVATION_NOT_EQUAL_PRESENTATION_PRESERVATION') && strategy.primaryAcceptance.includes('ENTERING_THE_PLACE'));
const ids=checkpoints.checkpoints.map(x=>x.id);
check('CHECKPOINT_ORDER_AND_CURRENT_POINTER',canonical(ids)===canonical(['HC00','HC01','HC02','HC03','HC04','HC05','HC06','HC07','HC08']) && state.currentCheckpoint.id==='HC00');
check('PROTECTED_RUNTIME_BLOB_IDENTITIES_FORMAT_AND_ROLE',runtime.protectedRuntimeCore.length>=5 && runtime.protectedRuntimeCore.every(x=>x.class==='R' && /^[0-9a-f]{40}$/.test(x.gitBlobSha)));
check('PAGE_EXCELLENCE_BINDING',page.mandatoryToolset.id==='MANDATORY_PAGE_TOOLSET' && page.mandatoryToolset.version==='1.1.0' && page.futureImplementationClassCandidate==='EXISTING_CONSTRUCT_ADOPTION' && page.rule.includes('DOES_NOT_REPLACE'));
check('RECOVERY_PRECEDENCE',recovery.recoveryPrecedence[0]==='CURRENT_REPOSITORY_MAIN' && recovery.recoveryPrecedence.at(-1)==='ROOM_PRIVATE_CONTEXT_LAST_AND_NONAUTHORITATIVE');
check('NO_PRODUCT_AUTHORITY',authority.authorityLimits.includes('NO_PRODUCT_MUTATION') && state.productState.liveRouteMutationStarted===false && operation.subjectIdentity.productMutation===false);
check('REQUEST_PROCEDURE_SCOPE_EQUALITY',canonical(operation.allowedPaths)===canonical(procedure.exactAllowedRepositoryPaths) && operation.exactTestCommand===procedure.exactTestRunnerCommand && canonical(operation.errorPrecedence)===canonical(procedure.errorCodeAndValidationPrecedence));
check('CLASSIFICATION_SCHEMA',classification.$id==='H_EARTH_LIVE_EXPERIENCE_SHELL_RUNTIME_CLASSIFICATION_SCHEMA_v1');
check('CLASSIFICATION_ENUM',canonical(classification.properties.entries.items.properties.category.enum)===canonical(['R','P','C','D']));
const sorted=[...files].sort();
const hash=crypto.createHash('sha256');
for(const repoPath of sorted){
  const rel=repoPath.slice('h-earth-3d/control-plane/live-experience-maturity-convergence/'.length);
  const bytes=fs.readFileSync(path.join(here,rel));
  hash.update(repoPath);hash.update('\0');hash.update(bytes);hash.update('\0');
}
const fingerprint=hash.digest('hex');
check('PACKAGE_FINGERPRINT',/^[0-9a-f]{64}$/.test(fingerprint),fingerprint);
const failures=checks.filter(x=>!x.pass);
const receipt={
  schema:'H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_VERIFICATION_RECEIPT_v1',
  result:failures.length?'FAIL_CLOSED':'PASS',
  programId:program,
  startingHead:expectedHead,
  exactPathCount:files.length,
  packageFingerprint:fingerprint,
  checks,
  failedChecks:failures.map(x=>x.id),
  productMutationPerformed:false,
  registryActivationPerformed:false,
  mergePerformed:false,
  repairPerformed:false
};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
process.exitCode=failures.length?1:0;
