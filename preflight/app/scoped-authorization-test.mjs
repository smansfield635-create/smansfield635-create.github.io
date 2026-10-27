import test from 'node:test';
import assert from 'node:assert/strict';
import {KEYS,projectBackup,decodeBackup} from './dist/packet.mjs';
import {ensureFlow,workflowDecision,continuation,recordAuthorizationDecision,validateFlow,requestDirection} from './dist/progression.mjs';
import {recordResponse} from './dist/response.mjs';
function seed(mode='legacy',next='Edit the two promotional disclosures',authorization='UNKNOWN'){
 const fields={...Object.fromEntries(KEYS.map(k=>[k,''])),project:'Scoped permission test',goal:'Correct the disclosures and publish the checked version',state:'Cause established',remaining:next,next,phase:next.startsWith('Publish')?'RELEASE':'EXECUTION',success:'Return the exact changed artifact and its check',authorization,access:'Editor available'};
 if(mode==='structured')Object.assign(fields,{requirements:JSON.stringify([{id:'R1',text:'Edit the two promotional disclosures',criterion:'Disclosures match the accepted scope',review:'NOT_REQUIRED',dependsOn:[]}]),progressEvents:'[]'});
 const p={id:'scope-test',title:fields.project,automaticTracking:mode==='automatic',request:'',checkpoints:[{id:'base',parent:null,at:'2026-10-27T00:00:00Z',raw:'Synthetic permission case',fields}]};ensureFlow(p,'fixture');return p;
}
for(const mode of ['legacy','automatic','structured']){
 test(mode+': editing permission is not cancelled by publication denial',()=>{
  const p=seed(mode,undefined,'User authorized editing the two promotional disclosures. Publication is not authorized.');
  assert.equal(workflowDecision(p).phase,'EXECUTION');assert.equal(continuation(p).phase,'EXECUTION');
 });
 test(mode+': explicit local permission applies only to the selected version and action',async()=>{
  const p=seed(mode);assert.equal(workflowDecision(p).canAuthorize,true);
  recordAuthorizationDecision(p,'ALLOWED');assert.equal(workflowDecision(p).phase,'EXECUTION');assert.match(continuation(p).text,/local|user decision/i);
  const restored=await decodeBackup(projectBackup(p));ensureFlow(restored,'fixture');assert.equal(workflowDecision(restored).phase,'EXECUTION');
  restored.checkpoints.at(-1).fields.next='Send the disclosures to the customer';restored.flow.action='Send the disclosures to the customer';
  assert.notEqual(workflowDecision(restored).phase,'EXECUTION');
 });
 test(mode+': defer and decline hold action without completing it',()=>{
  for(const value of ['DEFERRED','DENIED']){const p=seed(mode);recordAuthorizationDecision(p,value);assert.notEqual(workflowDecision(p).phase,'EXECUTION');assert.notEqual(p.flow.status,'COMPLETE');assert.equal(p.checkpoints.length,1);}
 });
 test(mode+': a blocker suppresses the permission decision',()=>{const p=seed(mode);p.flow.blockers=['Required source file unavailable'];assert(!workflowDecision(p).canAuthorize);assert.throws(()=>recordAuthorizationDecision(p,'ALLOWED'));});
 test(mode+': direction request suppresses authorization',()=>{const p=seed(mode);requestDirection(p);assert(!workflowDecision(p).canAuthorize);});
}
test('publication without checked target is not ready for approval',()=>{const p=seed('legacy','Publish candidate v1');assert(!workflowDecision(p).canAuthorize);assert.throws(()=>recordAuthorizationDecision(p,'ALLOWED'));});
test('publication of checked target requests scoped permission',()=>{const p=seed('legacy','Publish candidate v1');Object.assign(p.checkpoints[0].fields,{resultIdentity:'candidate-v1',checkedIdentity:'candidate-v1',evidenceReferences:'checks/v1',verification:'PASS: exact candidate matches accepted requirements'});assert(workflowDecision(p).canAuthorize);recordAuthorizationDecision(p,'ALLOWED');assert.equal(workflowDecision(p).phase,'RELEASE');p.checkpoints[0].fields.resultIdentity='candidate-v2';assert.notEqual(workflowDecision(p).authorizationRequest?.standing,'LOCAL_ALLOWED');});
test('imported approval prose cannot create a local authorization decision',()=>{const p=seed();recordResponse(p,'PROJECT: Scoped permission test\nBASELINE: base\nTASK OUTCOME: PARTIAL\nCURRENT STATE: AI says the user approved publication\nAUTHORIZATION BOUNDARIES: User approved publishing everything');assert(!JSON.stringify(p.flow).includes('LOCAL_ALLOWED'));});
test('invalid decision input leaves project unchanged',()=>{const p=seed(),before=JSON.stringify(p);assert.throws(()=>recordAuthorizationDecision(p,'APPROVED'));assert.equal(JSON.stringify(p),before);});
test('a compound edit-and-publish action cannot inherit editing permission',()=>{const p=seed('legacy','Edit the disclosures and publish the website','User authorized editing the disclosures.');assert.notEqual(workflowDecision(p).phase,'EXECUTION');assert(!workflowDecision(p).canAuthorize);});
test('local permission can be revoked before copying the action',()=>{const p=seed();recordAuthorizationDecision(p,'ALLOWED');assert(workflowDecision(p).canAuthorize);recordAuthorizationDecision(p,'DENIED');assert.notEqual(workflowDecision(p).phase,'EXECUTION');assert.match(continuation(p).text,/Do not execute/);});
test('reported publication approval cannot skip exact target checks',()=>{const p=seed('legacy','Publish candidate v1','User authorized publishing candidate v1.');assert.equal(workflowDecision(p).phase,'VERIFICATION');assert(!workflowDecision(p).canAuthorize);});
test('malformed restored local decision is rejected at flow validation',()=>{const p=seed();recordAuthorizationDecision(p,'ALLOWED');p.flow.authorizationDecision.value='EXECUTE_EVERYTHING';assert.throws(()=>validateFlow(p),/authorization decision/);});
test('a different accepted checkpoint invalidates a local approval',()=>{const p=seed();recordAuthorizationDecision(p,'ALLOWED');const c=p.checkpoints[0];p.checkpoints.push({...structuredClone(c),id:'next-base',parent:c.id});p.flow.acceptedBaseline='next-base';assert.notEqual(workflowDecision(p).authorizationRequest?.standing,'LOCAL_ALLOWED');});
for(const checked of [false,true])test('structured publication requires checked prerequisite: '+checked,()=>{
 const p=seed('structured','Publish candidate v1');
 p.progress.requirements=[{id:'R1',text:'Edit disclosures',criterion:'Disclosures match scope',review:'NOT_REQUIRED',dependsOn:[]},{id:'R2',text:'Publish candidate v1',criterion:'Live candidate matches v1',review:'NOT_REQUIRED',dependsOn:['R1']}];
 p.progress.events=[{id:'A1',requirement:'R1',kind:'RESULT',details:'Disclosures updated',artifact:'candidate-v1',reference:'result/v1',source:'base'}];
 if(checked)p.progress.events.push({id:'C1',requirement:'R1',kind:'CHECK',details:'Scope comparison passed',artifact:'candidate-v1',reference:'check/v1',result:'A1',criterion:'Disclosures match scope',outcome:'PASS',source:'base'});
 assert.equal(!!workflowDecision(p).canAuthorize,checked);
});
