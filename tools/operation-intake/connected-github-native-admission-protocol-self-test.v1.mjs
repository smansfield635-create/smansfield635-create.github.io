import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const load = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const locator = load('.github/operation-intake/locator.v1.json');
const contract = load('.github/operation-intake/owner-connector-admission-contract.v1.json');
const registry = load('.github/operation-intake/authorized-intake-transports.v1.json');
const protocol = load('.github/operation-intake/connected-github-native-admission-protocol.v1.json');

const failures = [];
const results = [];
function check(name, fn) {
  try { fn(); results.push({name, pass:true}); }
  catch (error) { failures.push({name, error:error?.message ?? String(error)}); results.push({name, pass:false, error:error?.message ?? String(error)}); }
}
function assert(condition, code) { if (!condition) throw new Error(code); }
function eq(a,b,code){ assert(a===b, code); }
function sameArray(a,b,code){ assert(Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>v===b[i]), code); }

const TRANSPORT='OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_V1';
const PROFILE='CONNECTED_GITHUB_NATIVE_PRIMITIVES_V1';
const LEDGER='.github/operation-intake/active-operation-ledger.v1.json';
const LOCK='refs/heads/operation-locks/repository-operation-intake-v1';
const MESSAGE='Acquire operation lock <LOCK_GENERATION>: <OPERATION_ID>';
const REQUIRED=[
  'FETCH_OWNER_SOURCE_COMMENT','FETCH_CURRENT_MAIN_HEAD','FETCH_LOCK_REF','FETCH_LEDGER_BLOB_AND_CONTENT',
  'CREATE_BLOB','CREATE_TREE_FROM_EXACT_LOCK_HEAD_TREE','CREATE_SINGLE_PARENT_COMMIT','UPDATE_LOCK_REF_NON_FORCE',
  'FETCH_RESULTING_LOCK_REF','FETCH_RESULTING_COMMIT','FETCH_RESULTING_LEDGER'
];

check('AI Entry locator exposes connected native profile',()=>{
  eq(locator.connectedGithubNativeAdmissionProtocol,'.github/operation-intake/connected-github-native-admission-protocol.v1.json','LOCATOR_PROTOCOL_MISSING');
  eq(locator.standardConnectedRoomAdmissionProfile,PROFILE,'LOCATOR_PROFILE_MISMATCH');
  eq(locator.ownerConnectorAdmissionPlanner,'tools/operation-intake/owner-connector-canonical-intake.v1.mjs','PLANNER_DRIFT');
  eq(locator.ledgerPath,LEDGER,'LEDGER_DRIFT'); eq(locator.lockRef,LOCK,'LOCK_REF_DRIFT');
});

check('contract has two invocation profiles over one semantic transport',()=>{
  eq(contract.transportId,TRANSPORT,'TRANSPORT_DRIFT');
  eq(contract.invocationProfiles.connectedGithubNative.profileId,PROFILE,'CONNECTED_PROFILE_MISSING');
  eq(contract.invocationProfiles.connectedGithubNative.protocol,'.github/operation-intake/connected-github-native-admission-protocol.v1.json','CONNECTED_PROTOCOL_MISMATCH');
  eq(contract.invocationProfiles.connectedGithubNative.rawGithubTokenRequiredFromRoom,false,'RAW_TOKEN_STILL_REQUIRED');
  eq(contract.invocationProfiles.localNativeNode.executor,'tools/operation-intake/owner-connector-canonical-intake-executor.v1.mjs','LOCAL_EXECUTOR_DRIFT');
  eq(contract.semantics.planner,'tools/operation-intake/owner-connector-canonical-intake.v1.mjs','CONTRACT_PLANNER_DRIFT');
});

check('transport registry does not create a second backend',()=>{
  const matches=registry.transports.filter(t=>t.transportId===TRANSPORT);
  eq(matches.length,1,'SECOND_OWNER_CONNECTOR_TRANSPORT_CREATED');
  assert(matches[0].invocationProfiles.includes(PROFILE),'REGISTRY_PROFILE_MISSING');
  eq(matches[0].canonicalLedger,LEDGER,'REGISTRY_LEDGER_DRIFT');
  eq(matches[0].canonicalLockRef,LOCK,'REGISTRY_LOCK_DRIFT');
  eq(matches[0].admissionSemanticsDuplicated,false,'SEMANTICS_DUPLICATED');
});

check('protocol binds existing semantic backend exactly',()=>{
  eq(protocol.transportId,TRANSPORT,'PROTOCOL_TRANSPORT_DRIFT');
  eq(protocol.semanticBackend.planner,'tools/operation-intake/owner-connector-canonical-intake.v1.mjs','PROTOCOL_PLANNER_DRIFT');
  eq(protocol.semanticBackend.gate,'tools/operation-intake/repository-operation-intake-gate.v1.mjs#prepare','PROTOCOL_GATE_DRIFT');
  eq(protocol.semanticBackend.lockManager,'tools/operation-intake/repository-operation-lock-manager.v1.mjs#acquireLocal','PROTOCOL_LOCK_MANAGER_DRIFT');
  eq(protocol.semanticBackend.canonicalLedger,LEDGER,'PROTOCOL_LEDGER_DRIFT');
  eq(protocol.semanticBackend.canonicalLockRef,LOCK,'PROTOCOL_LOCK_REF_DRIFT');
  eq(protocol.semanticBackend.secondBackendCreated,false,'SECOND_BACKEND_CREATED');
  eq(protocol.semanticBackend.secondLedgerCreated,false,'SECOND_LEDGER_CREATED');
});

check('required connector primitive set is closed',()=>sameArray(protocol.requiredConnectorPrimitives,REQUIRED,'PRIMITIVE_SET_DRIFT'));
check('canonical commit and non-force law preserved',()=>{eq(protocol.writeLaw.canonicalCommitMessage,MESSAGE,'COMMIT_MESSAGE_DRIFT');eq(protocol.writeLaw.lockRefUpdateForce,false,'FORCE_UPDATE_ENABLED');eq(protocol.writeLaw.exactChangedPaths?.length ?? 0,0,'UNEXPECTED_WRITE_LAW_SHAPE');sameArray(protocol.writeLaw.exactAllowedPaths,[LEDGER],'WRITE_PATH_EXPANSION');});
check('readback and lineage remain mandatory',()=>{eq(protocol.readbackLaw.required,true,'READBACK_OPTIONAL');eq(protocol.readbackLaw.receiptBeforeReadbackAllowed,false,'RECEIPT_BEFORE_READBACK');eq(protocol.readbackLaw.lineageVerificationRequired,true,'LINEAGE_OPTIONAL');eq(protocol.readbackLaw.independentAuthorityProvenanceRequired,true,'PROVENANCE_OPTIONAL');});
check('GitHub Actions remain prohibited for agent execution',()=>{eq(protocol.githubActions.agentExecutionAllowed,false,'ACTIONS_AGENT_EXECUTION_ENABLED');assert(protocol.prohibitions.includes('NO_GITHUB_ACTIONS_AGENT_EXECUTION_TRANSPORT'),'ACTIONS_PROHIBITION_MISSING');});
check('planner remains plan not receipt',()=>{eq(contract.semantics.planIsReceipt,false,'CONTRACT_PLAN_AS_RECEIPT');const step=protocol.executionSequence.find(x=>x.action==='RUN_EXISTING_OWNER_CONNECTOR_PLANNER_UNCHANGED');eq(step?.plannerOutputIsReceipt,false,'PROTOCOL_PLAN_AS_RECEIPT');});

function validateTranscript(t){
  for(const p of REQUIRED) assert(t.primitives?.includes(p),`MISSING_PRIMITIVE:${p}`);
  eq(t.source?.authorLogin,'smansfield635-create','SOURCE_LOGIN_INVALID'); eq(t.source?.authorAssociation,'OWNER','SOURCE_ASSOCIATION_INVALID'); eq(t.source?.marker,'CANONICAL_OPERATION_INTAKE_REQUEST_V1','SOURCE_MARKER_INVALID');
  eq(t.currentMain,t.expectedMain,'GOVERNING_HEAD_MISMATCH');
  eq(t.plan?.schema,'OWNER_CONNECTOR_CANONICAL_INTAKE_PLAN_v1','PLAN_SCHEMA_INVALID'); eq(t.plan?.plannerIsAdmissionReceipt,false,'PLAN_AS_RECEIPT'); eq(t.plan?.result,'ADMITTED_AND_LOCKED','PLANNER_NON_ADMISSION');
  sameArray(t.plan?.changedPaths,[LEDGER],'PLAN_PATH_EXPANSION');
  eq(t.prewriteMain,t.currentMain,'STALE_MAIN_AT_WRITE'); eq(t.prewriteLockRef,t.observedLockRef,'STALE_LOCK_REF_AT_WRITE'); eq(t.prewriteLedgerBlob,t.observedLedgerBlob,'STALE_LEDGER_AT_WRITE');
  eq(t.commit?.parent,t.observedLockRef,'WRONG_PARENT'); eq(t.commit?.message,`Acquire operation lock ${t.plan.lockGeneration}: ${t.plan.operationId}`,'WRONG_COMMIT_MESSAGE'); sameArray(t.commit?.changedPaths,[LEDGER],'COMMIT_PATH_EXPANSION');
  eq(t.refUpdate?.force,false,'FORCE_REF_UPDATE'); eq(t.readback?.lockRef,t.commit.sha,'LOCK_REF_READBACK_MISMATCH'); eq(t.readback?.ledgerOperationId,t.plan.operationId,'LEDGER_READBACK_MISMATCH'); eq(t.readback?.lineageVerified,true,'LINEAGE_FAILURE'); eq(t.readback?.independentAuthorityProvenanceVerified,true,'PROVENANCE_FAILURE');
  return 'ADMITTED_AND_LOCKED';
}
const base={
  primitives:[...REQUIRED], source:{authorLogin:'smansfield635-create',authorAssociation:'OWNER',marker:'CANONICAL_OPERATION_INTAKE_REQUEST_V1'}, expectedMain:'a'.repeat(40), currentMain:'a'.repeat(40), observedLockRef:'b'.repeat(40), observedLedgerBlob:'c'.repeat(40),
  plan:{schema:'OWNER_CONNECTOR_CANONICAL_INTAKE_PLAN_v1',plannerIsAdmissionReceipt:false,result:'ADMITTED_AND_LOCKED',operationId:'TEST_OPERATION',lockGeneration:479,changedPaths:[LEDGER]}, prewriteMain:'a'.repeat(40),prewriteLockRef:'b'.repeat(40),prewriteLedgerBlob:'c'.repeat(40),
  commit:{sha:'d'.repeat(40),parent:'b'.repeat(40),message:'Acquire operation lock 479: TEST_OPERATION',changedPaths:[LEDGER]},refUpdate:{force:false},readback:{lockRef:'d'.repeat(40),ledgerOperationId:'TEST_OPERATION',lineageVerified:true,independentAuthorityProvenanceVerified:true}
};
const clone=()=>structuredClone(base);
check('simulated happy path admits only after readback',()=>eq(validateTranscript(clone()),'ADMITTED_AND_LOCKED','HAPPY_PATH_FAILED'));
const negative=[
  ['missing primitive','MISSING_PRIMITIVE',t=>{t.primitives=t.primitives.filter(x=>x!=='CREATE_BLOB');}],
  ['stale main','GOVERNING_HEAD_MISMATCH',t=>{t.currentMain='e'.repeat(40);}],
  ['stale main at write','STALE_MAIN_AT_WRITE',t=>{t.prewriteMain='e'.repeat(40);}],
  ['stale lock ref','STALE_LOCK_REF_AT_WRITE',t=>{t.prewriteLockRef='e'.repeat(40);}],
  ['stale ledger','STALE_LEDGER_AT_WRITE',t=>{t.prewriteLedgerBlob='e'.repeat(40);}],
  ['wrong owner source','SOURCE_LOGIN_INVALID',t=>{t.source.authorLogin='other';}],
  ['path expansion','PLAN_PATH_EXPANSION',t=>{t.plan.changedPaths.push('build/index.html');}],
  ['force ref update','FORCE_REF_UPDATE',t=>{t.refUpdate.force=true;}],
  ['wrong parent','WRONG_PARENT',t=>{t.commit.parent='e'.repeat(40);}],
  ['wrong commit message','WRONG_COMMIT_MESSAGE',t=>{t.commit.message='Acquire lock';}],
  ['plan as receipt','PLAN_AS_RECEIPT',t=>{t.plan.plannerIsAdmissionReceipt=true;}],
  ['incomplete readback','LOCK_REF_READBACK_MISMATCH',t=>{t.readback.lockRef='e'.repeat(40);}],
  ['lineage failure','LINEAGE_FAILURE',t=>{t.readback.lineageVerified=false;}],
  ['provenance failure','PROVENANCE_FAILURE',t=>{t.readback.independentAuthorityProvenanceVerified=false;}]
];
for(const [name,expected,mutate] of negative) check(`fail closed: ${name}`,()=>{const t=clone();mutate(t);let error=null;try{validateTranscript(t);}catch(e){error=e;}assert(error,`NEGATIVE_DID_NOT_FAIL:${name}`);assert(error.message.startsWith(expected),`WRONG_FAILURE:${name}:${error.message}`);});

const receipt={schema:'CONNECTED_GITHUB_NATIVE_ADMISSION_PROTOCOL_SELF_TEST_RECEIPT_v1',result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',scenarioCount:results.length,passedCount:results.filter(x=>x.pass).length,failedCount:failures.length,canonicalTransportId:TRANSPORT,connectedProfileId:PROFILE,canonicalLedger:LEDGER,canonicalLockRef:LOCK,secondBackendCreated:false,secondLedgerCreated:false,githubActionsAgentExecutionEnabled:false,results};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failures.length) process.exitCode=1;
