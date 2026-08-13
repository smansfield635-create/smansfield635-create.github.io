#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assess, stable } from './progressive-system-continuity-gate.v1.mjs';

const PROTOCOL='.github/ai-router/system-continuity/progressive-system-continuity-protocol.v1.json';
const REGISTRY='.github/ai-router/system-continuity/gap-registry.v1.json';
const ROUTER='.github/ai-router/router.v1.json';
const WORKFLOW='.github/workflows/progressive-system-continuity-v1.yml';
const EIGHT=['AGENTS.md','AI_ENTRYPOINT.json',ROUTER,PROTOCOL,'.github/ai-router/system-continuity/progressive-system-continuity-gate.v1.mjs','.github/ai-router/system-continuity/progressive-system-continuity-self-test.v1.mjs',REGISTRY,WORKFLOW];
const SUCCESSOR_GAP='SUCCESSOR_TO_CLOSED_WORLD_EXECUTION_CONTINUITY';
const SYNTHETIC_OPEN_GAP='SELF_TEST_OPEN_GAP';
const SYNTHETIC_OPEN_INTERFACE='SELF_TEST_OPEN_GAP_INTERFACE';
const proof=(status='PASS',tag='p')=>({status,refs:status==='PASS'?[`SELF_TEST:${tag}`]:[]});
function root(start){let c=path.resolve(start);for(;;){if(fs.existsSync(path.join(c,'AI_ENTRYPOINT.json')))return c;const p=path.dirname(c);if(p===c)throw new Error('REPOSITORY_ROOT_NOT_FOUND');c=p}}
const read=(r,p)=>JSON.parse(fs.readFileSync(path.join(r,p),'utf8'));
function request(head='1'.repeat(40)){return {schema:'PROGRESSIVE_SYSTEM_CONTINUITY_ASSESSMENT_REQUEST_v1',assessmentId:'BASE',subjectHead:head,systemId:'SYNTHETIC_SYSTEM',changedPaths:['.github/ai-router/system-continuity/synthetic.v1.json'],interfaceKeys:['SYNTHETIC_INTERFACE'],relatedGapIds:[],producerContracts:[{contractId:'P',operationIdPolicy:'STABLE_OPERATION_ID',outputReceiptSchemas:['SYNTHETIC_RECEIPT_v1'],interfaceKeys:['SYNTHETIC_INTERFACE']}],consumerContracts:[{contractId:'C',operationIdPolicy:'EXACT_REGISTERED_OPERATION_ID',acceptedReceiptSchemas:['SYNTHETIC_RECEIPT_v1'],interfaceKeys:['SYNTHETIC_INTERFACE']}],edges:[{edgeId:'P_C',producerContractId:'P',consumerContractId:'C',producerReceiptSchema:'SYNTHETIC_RECEIPT_v1'}],adapters:[],proofs:{localCorrectness:proof('PASS','local'),interfaceCompatibility:proof('PASS','interface'),transitionSimulation:proof('PASS','transition'),remoteInvocation:proof('PASS','remote'),postMergeContinuity:proof('PASS','postmerge')},requestedClosure:'SYSTEM_GAP_CLOSED'}}
function t(id,fn){try{const d=fn();return{id,pass:d?.pass===true,detail:d}}catch(e){return{id,pass:false,detail:{error:e.message}}}}
function routerPass(r){const out=path.join(process.env.RUNNER_TEMP||'/tmp','psc-router.json');const args=['tools/repository-ai-entry-router.mjs','--mutation-intent','--task','Progressive system continuity installation route verification'];for(const p of EIGHT)args.push('--path',p);args.push('--output',out);const x=cp.spawnSync(process.execPath,args,{cwd:r,encoding:'utf8'});let receipt=null;try{receipt=JSON.parse(fs.readFileSync(out,'utf8'))}catch{}return{pass:x.status===0&&receipt?.disposition==='PASS'&&receipt.routes?.length===8&&receipt.routes.every(v=>v.disposition==='PASS'&&v.projectId==='REPOSITORY_AI_ROUTER_INFRASTRUCTURE'),status:x.status,receipt}}
function syntheticOpenGapRegistry(registry){
 const x=structuredClone(registry);
 x.records=x.records.filter(g=>g.gapId!==SYNTHETIC_OPEN_GAP);
 x.records.push({gapId:SYNTHETIC_OPEN_GAP,status:'OPEN',discoveredAtHead:'0'.repeat(40),summary:'Synthetic self-test open gap used only to verify reconciliation behavior independent of production gap lifecycle state.',interfaceKeys:[SYNTHETIC_OPEN_INTERFACE],pathScopes:['.github/ai-router/system-continuity/self-test-open-gap/'],evidenceRefs:['SELF_TEST:synthetic-open-gap'],closureRequirements:['SELF_TEST_RECONCILIATION_REQUIRED'],authorityCreated:false});
 return x;
}
function successorClosedRegistry(registry,head){
 const x=structuredClone(registry);
 const g=x.records.find(v=>v.gapId===SUCCESSOR_GAP);
 if(!g)throw new Error('SUCCESSOR_GAP_MISSING');
 g.status='CLOSED_BOUNDED';
 g.closedAtHead=head;
 g.closureRequirements=[];
 g.authorityCreated=false;
 g.evidenceRefs=Array.isArray(g.evidenceRefs)?[...g.evidenceRefs]:[];
 if(!g.evidenceRefs.includes('SELF_TEST:closed-bounded-successor-gap'))g.evidenceRefs.push('SELF_TEST:closed-bounded-successor-gap');
 return x;
}
function successorLifecycleStateValid(g){
 if(!g||g.authorityCreated!==false)return false;
 if(g.status==='OPEN')return g.closedAtHead===undefined&&Array.isArray(g.closureRequirements)&&g.closureRequirements.length>0;
 if(g.status==='CLOSED_BOUNDED')return /^[0-9a-f]{40}$/.test(g.closedAtHead??'')&&Array.isArray(g.closureRequirements)&&g.closureRequirements.length===0&&Array.isArray(g.evidenceRefs)&&g.evidenceRefs.length>0;
 return false;
}
function main(){const a=process.argv.slice(2);if(a.length!==2||a[0]!=='--output'||!a[1])throw new Error('USAGE:--output <file>');const out=a[1],r=root(path.dirname(fileURLToPath(import.meta.url))),protocol=read(r,PROTOCOL),registry=read(r,REGISTRY),entry=read(r,'AI_ENTRYPOINT.json'),router=read(r,ROUTER),agents=fs.readFileSync(path.join(r,'AGENTS.md'),'utf8');const head=cp.spawnSync('git',['rev-parse','HEAD^{commit}'],{cwd:r,encoding:'utf8'}).stdout.trim();const tests=[];
 tests.push(t('ROOT_INTEGRATION',()=>({pass:protocol.protocolId==='REPOSITORY_PROGRESSIVE_SYSTEM_CONTINUITY_TRACK_v1'&&entry.systemContinuityTrack?.protocol===PROTOCOL&&entry.systemContinuityTrack?.remoteInvocationMarker==='PROGRESSIVE_SYSTEM_CONTINUITY_REQUEST_V1'&&router.routerInfrastructure.ownedExactPaths.includes(WORKFLOW)&&agents.includes('## Progressive system continuity')})));
 tests.push(t('EIGHT_PATH_ROUTER_PASS',()=>routerPass(r)));
 tests.push(t('LOCAL_PASS_IS_NOT_SYSTEM_CLOSURE',()=>{const q=request(head);q.requestedClosure='LOCAL_CAPABILITY_CLOSED';q.proofs.transitionSimulation=proof('NOT_PROVEN');q.proofs.remoteInvocation=proof('NOT_PROVEN');q.proofs.postMergeContinuity=proof('NOT_PROVEN');const x=assess(q,registry);return{pass:x.result==='PASS'&&x.classification==='LOCAL_CAPABILITY_CLOSED'&&x.systemClosureGranted===false,receipt:x}}));
 tests.push(t('FULL_SYSTEM_CLOSURE_SYNTHETIC',()=>{const x=assess(request(head),registry);return{pass:x.result==='PASS'&&x.classification==='SYSTEM_GAP_CLOSED'&&x.systemClosureGranted===true,receipt:x}}));
 tests.push(t('REMOTE_PROOF_REQUIRED',()=>{const q=request(head);q.proofs.remoteInvocation=proof('NOT_PROVEN');const x=assess(q,registry);return{pass:x.result==='BLOCK'&&x.errorCode==='REMOTE_INVOCATION_PROOF_MISSING',receipt:x}}));
 tests.push(t('RECEIPT_SCHEMA_MISMATCH_BLOCKS',()=>{const q=request(head);q.consumerContracts[0].acceptedReceiptSchemas=['OTHER_v1'];const x=assess(q,registry);return{pass:x.result==='BLOCK'&&x.errorCode==='PRODUCER_CONSUMER_INTERFACE_MISMATCH',receipt:x}}));
 tests.push(t('FRESH_SUCCESSOR_TO_EXACT_ID_BLOCKS',()=>{const q=request(head);q.producerContracts[0].operationIdPolicy='FRESH_SUCCESSOR_OPERATION_ID_REQUIRED';const x=assess(q,registry);return{pass:x.result==='BLOCK'&&x.errorCode==='PRODUCER_CONSUMER_INTERFACE_MISMATCH'&&x.interfaceResults?.[0]?.reasons?.includes('OPERATION_ID_POLICY_MISMATCH'),receipt:x}}));
 tests.push(t('PROVEN_ADAPTER_MAY_BRIDGE',()=>{const q=request(head);q.requestedClosure='INTERFACE_CONTINUITY_CLOSED';q.producerContracts[0].operationIdPolicy='FRESH_SUCCESSOR_OPERATION_ID_REQUIRED';q.consumerContracts[0].acceptedReceiptSchemas=['ADAPTED_v1'];q.edges[0].adapterId='A';q.adapters=[{adapterId:'A',status:'PROVEN',fromOperationIdPolicy:'FRESH_SUCCESSOR_OPERATION_ID_REQUIRED',toOperationIdPolicy:'EXACT_REGISTERED_OPERATION_ID',fromReceiptSchema:'SYNTHETIC_RECEIPT_v1',toReceiptSchema:'ADAPTED_v1',evidenceRefs:['SELF_TEST:adapter']}];const x=assess(q,registry);return{pass:x.result==='PASS'&&x.classification==='INTERFACE_CONTINUITY_CLOSED'&&x.interfaceResults[0].adapterId==='A',receipt:x}}));
 tests.push(t('UNDECLARED_OPEN_GAP_REQUIRES_RECONCILIATION',()=>{const q=request(head);q.interfaceKeys=[SYNTHETIC_OPEN_INTERFACE];const x=assess(q,syntheticOpenGapRegistry(registry));return{pass:x.result==='BLOCK'&&x.errorCode==='ACTIVE_GAP_RECONCILIATION_REQUIRED'&&x.gapHits?.some(g=>g.gapId===SYNTHETIC_OPEN_GAP),receipt:x}}));
 tests.push(t('DECLARED_OPEN_GAP_PREVENTS_SYSTEM_CLOSURE',()=>{const q=request(head);q.interfaceKeys=[SYNTHETIC_OPEN_INTERFACE];q.relatedGapIds=[SYNTHETIC_OPEN_GAP];const x=assess(q,syntheticOpenGapRegistry(registry));return{pass:x.result==='BLOCK'&&x.errorCode==='RELATED_OPEN_GAP_PREVENTS_SYSTEM_CLOSURE'&&x.gapHits?.some(g=>g.gapId===SYNTHETIC_OPEN_GAP&&g.declared===true),receipt:x}}));
 tests.push(t('CLOSED_BOUNDED_SUCCESSOR_GAP_NO_LONGER_BLOCKS_SYSTEM_CLOSURE',()=>{const q=request(head);q.interfaceKeys=['operationId'];q.relatedGapIds=[SUCCESSOR_GAP];const x=assess(q,successorClosedRegistry(registry,head));return{pass:x.result==='PASS'&&x.classification==='SYSTEM_GAP_CLOSED'&&x.systemClosureGranted===true&&x.gapHits?.length===0,receipt:x}}));
 tests.push(t('NO_AUTHORITY_CREATED',()=>{const x=assess(request(head),registry),keys=['repositoryWritesAuthorized','lifecycleAuthorityGranted','terminalClosureAuthorityGranted','successorAuthorityGranted','mergeAuthorityGranted','deploymentAuthorityGranted','productMutationAuthorityGranted','semanticAuthorityGranted','scientificClaimAuthorityGranted','genericCommandAuthority'];return{pass:keys.every(k=>x[k]===false),receipt:x}}));
 tests.push(t('REMOTE_CLOSURE_GAP_CLOSED_BOUNDED',()=>{const g=registry.records.find(v=>v.gapId==='REMOTE_OPERATION_TERMINAL_CLOSURE_OPERATIONAL_PROOF');return{pass:g?.status==='CLOSED_BOUNDED'&&g.closedAtHead==='0cd88a4965f354de93e37a8cb9ab607263536b46'&&g.evidenceRefs?.includes('RUN_31323108429')}}));
 tests.push(t('SUCCESSOR_EXECUTION_GAP_LIFECYCLE_STATE_VALID',()=>{const g=registry.records.find(v=>v.gapId===SUCCESSOR_GAP);return{pass:successorLifecycleStateValid(g),status:g?.status,closedAtHead:g?.closedAtHead??null,closureRequirementCount:g?.closureRequirements?.length??null,authorityCreated:g?.authorityCreated}}));
 const bad=tests.filter(v=>!v.pass);const receipt=stable({schema:'PROGRESSIVE_SYSTEM_CONTINUITY_SELF_TEST_RECEIPT_v1',result:bad.length?'FAIL':'PASS',head,scenarioCount:tests.length,passedCount:tests.length-bad.length,failedCount:bad.length,scenarios:tests,productMutationPerformed:false,repositoryMutationPerformedBySelfTest:false,lifecycleMutationPerformed:false,genericCommandAuthority:false});fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});fs.writeFileSync(path.resolve(out),JSON.stringify(receipt,null,2)+'\n');process.stdout.write(JSON.stringify(receipt,null,2)+'\n');if(bad.length)process.exitCode=1}
try{main()}catch(e){process.stderr.write(JSON.stringify({schema:'PROGRESSIVE_SYSTEM_CONTINUITY_SELF_TEST_RECEIPT_v1',result:'FAIL',error:e.message,productMutationPerformed:false,lifecycleMutationPerformed:false,genericCommandAuthority:false},null,2)+'\n');process.exitCode=1}
