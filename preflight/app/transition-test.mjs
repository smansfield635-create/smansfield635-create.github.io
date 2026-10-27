import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectTransition,transitionContext,TRANSITION_STAGES} from './dist/transitions.mjs';
import {KEYS,projectBackup,decodeBackup} from './dist/packet.mjs';
import {ensureFlow,workflowDecision,continuation,recordUserDecision} from './dist/progression.mjs';
import {recordResponse} from './dist/response.mjs';

const clone=x=>structuredClone(x);
const c=(id,dependsOn=[],status='MISSING')=>({id,dependsOn,status,action:'Inspect '+id,criterion:'Return evidence for '+id,...(status==='SATISFIED'?{subject:'candidate-v1',reference:'evidence/'+id}:{})});
function report(){return {task:'build-repair',requirement:'R3',subject:'candidate-v1',stage:'EXECUTION',intendedAction:'Repair the companion transcript and labels',conditions:[c('receipt'),c('registration',['receipt']),c('product-route',['registration'])],attemptedRoute:'remote-router',executionConditions:'candidate-v1; global materialization'};}
function project(r=report()){return {id:'p1',checkpoints:[{id:'c1',fields:{resultIdentity:'candidate-v1',transition:JSON.stringify(r)}}],progress:{requirements:[{id:'R3',text:'Repair companion',criterion:'Works coherently',review:'NOT_REQUIRED',dependsOn:[]}],events:[],decisions:[]}};}
function append(p,r){p.checkpoints.push({id:'c'+(p.checkpoints.length+1),fields:{resultIdentity:r.subject,transition:JSON.stringify(r)}});}
const inspect=r=>inspectTransition(project(r));

test('Build recovery follows the immediate prerequisite and preserves the product action',()=>{
 const p=project();let t=inspectTransition(p);
 assert.equal(t.selected.id,'receipt');assert.equal(t.phase,'INVESTIGATION');assert.equal(t.report.intendedAction,'Repair the companion transcript and labels');
 const r=report();r.conditions[0]=c('receipt',[],'SATISFIED');r.conditions[1].stage='EXECUTION';append(p,r);t=inspectTransition(p);
 assert.equal(t.selected.id,'registration');assert.equal(t.phase,'EXECUTION');assert.equal(t.trace.delta,'PREREQUISITE_RESOLVED');assert.deepEqual(t.trace.resolved,['receipt']);
 r.conditions[1]=c('registration',['receipt'],'SATISFIED');append(p,r);assert.equal(inspectTransition(p).selected.id,'product-route');
 r.conditions[2]=c('product-route',['registration'],'SATISFIED');append(p,r);t=inspectTransition(p);
 assert.equal(t.selected,null);assert.equal(t.action,r.intendedAction);assert.equal(t.phase,'EXECUTION');assert.equal(t.trace.authorityEffect,'NONE');
});
test('repeated unresolved route with new prose does not manufacture a transition',()=>{
 const p=project(),r=report();r.conditions[0].criterion='A new explanatory phrasing for the same missing receipt';append(p,r);
 const t=inspectTransition(p);assert(t.repeated);assert.equal(t.trace.delta,'NO_TRANSITION');assert.match(t.action,/Test the availability/);assert.match(t.action,/Do not repeat/);
});
test('changed route or execution conditions permits another bounded attempt',()=>{
 for(const key of ['attemptedRoute','executionConditions']){const p=project(),r=report();r[key]='local exact-source runtime';append(p,r);assert.equal(inspectTransition(p).repeated,false);}
});
test('repeat detection survives archived history and stays local to the project',()=>{
 const p=project(),first=p.checkpoints[0];p.archives=[{checkpoints:[first]}];p.checkpoints=[];append(p,report());assert(inspectTransition(p).repeated);
 assert.equal(inspectTransition(project()).repeated,false);
});
test('all stages are requests, never authority, acceptance or completion',()=>{
 for(const stage of TRANSITION_STAGES){const r=report();r.stage=stage;r.conditions=[];const t=inspect(r);assert.equal(t.status,'VALID');assert.equal(t.phase,stage);assert.equal(t.trace.authorityEffect,'NONE');assert.equal(t.canClose,undefined);assert.equal(t.canAuthorize,undefined);}
 const r=report();r.stage='COMPLETE';assert.equal(inspect(r).status,'INVALID');
});
test('qualification requires current subject evidence rather than borrowed candidate checks',()=>{
 const r=report();r.stage='QUALIFICATION';r.conditions=[c('browser-gate',[],'SATISFIED')];assert.equal(inspect(r).status,'VALID');
 r.conditions[0].subject='candidate-v0';assert.equal(inspect(r).status,'INVALID');
 r.conditions[0].subject='candidate-v1';r.subject='candidate-v2';assert.equal(inspect(r).status,'INVALID');
});
test('satisfaction requires explicit reference and known current identity',()=>{
 const r=report();r.conditions=[c('receipt',[],'SATISFIED')];delete r.conditions[0].reference;assert.equal(inspect(r).status,'INVALID');
 const p=project();p.checkpoints[0].fields.resultIdentity='UNKNOWN';p.checkpoints[0].fields.transition=JSON.stringify({...report(),conditions:[c('receipt',[],'SATISFIED')]});assert.equal(inspectTransition(p).status,'INVALID');
});
test('cycles, dangling edges, duplicate IDs and premature satisfaction cannot advance',()=>{
 const cases=[[c('a',['b']),c('b',['a'])],[c('a',['missing'])],[c('a'),c('a')],[c('a'),c('b',['a'],'SATISFIED')]];
 for(const conditions of cases){const r=report();r.conditions=conditions;const p=project(r),before=JSON.stringify(p);assert.equal(inspectTransition(p).status,'INVALID');assert.equal(JSON.stringify(p),before);}
});
test('malformed and unknown requirement reports stay source data without state mutation',()=>{
 for(const value of ['{bad json','[]','null',JSON.stringify({...report(),requirement:'R99'})]){const p=project();p.checkpoints[0].fields.transition=value;const before=JSON.stringify(p);assert.equal(inspectTransition(p).status,'INVALID');assert.equal(JSON.stringify(p),before);assert.match(transitionContext(p),/NEEDS CORRECTION/);}
});
test('legacy backup without transition stays unchanged and requests no remapping ceremony',()=>{
 const p=project();delete p.checkpoints[0].fields.transition;const before=JSON.stringify(p);assert.deepEqual(inspectTransition(p),{status:'ABSENT'});assert.equal(JSON.stringify(p),before);assert.match(transitionContext(p),/do not create a separate mapping ceremony/);
});
test('non-software task identity and independent prerequisites use the same projection',()=>{
 const r={task:'report',requirement:'R3',subject:'draft-2',stage:'VERIFICATION',intendedAction:'Check the report against the agreed outline',conditions:[c('sources'),c('figures')],attemptedRoute:'',executionConditions:''};
 const p=project(r);p.checkpoints[0].fields.resultIdentity='draft-2';const t=inspectTransition(p);assert.equal(t.status,'VALID');assert.equal(t.selected.id,'sources');assert.match(t.reason,/Other independent ready prerequisites remain: figures/);assert.equal(t.report.intendedAction,r.intendedAction);
});
test('exact blocker association is retained for existing planner reconciliation',()=>{
 const r=report();r.conditions[0].blocker='Receipt runner failed before evaluating the selected paths.';assert.equal(inspect(r).selected.blocker,r.conditions[0].blocker);
});
test('diagnostic evidence is not itself product completion',()=>{
 const r=report();r.conditions=[c('diagnosis',[],'SATISFIED'),c('receipt',['diagnosis'])];const t=inspect(r);assert.equal(t.selected.id,'receipt');assert.equal(t.trace.authorityEffect,'NONE');assert.equal(t.phase,'INVESTIGATION');assert.deepEqual(t.trace.missing,['receipt']);
});
test('changed subject invalidates previous repetition and cannot preserve qualified prerequisites',()=>{
 const p=project(),r=report();r.subject='candidate-v2';append(p,r);const t=inspectTransition(p);assert.equal(t.trace.delta,'SUBJECT_CHANGED');assert.equal(t.repeated,false);assert.deepEqual(t.trace.satisfied,[]);
});
test('a completed requirement cannot redirect the next unfinished requirement',()=>{
 const p=project();p.progress.requirements.push({id:'R4',text:'Qualify release',criterion:'Applicable gates pass',review:'NOT_REQUIRED',dependsOn:['R3']});
 p.progress.events=[{id:'result',requirement:'R3',kind:'RESULT',artifact:'candidate-v1'},{id:'check',requirement:'R3',kind:'CHECK',result:'result',artifact:'candidate-v1',criterion:'Works coherently',outcome:'PASS'}];
 assert.equal(inspectTransition(p).status,'INVALID');assert.match(inspectTransition(p).error,/next unfinished/);
});
test('current requirement artifact overrides stale response-level identity',()=>{
 const p=project();p.progress.events=[{id:'result',requirement:'R3',kind:'RESULT',artifact:'candidate-v2'}];
 assert.equal(inspectTransition(p).status,'INVALID');
 const r=report();r.subject='candidate-v2';p.checkpoints[0].fields.transition=JSON.stringify(r);assert.equal(inspectTransition(p).status,'VALID');
});
test('prompt instrumentation reflects the final governing decision',()=>{
 const p=project(),decision={phase:'READY FOR EXECUTION',action:'Establish permission for the bounded action',condition:'Existing authorization must be established',reason:'Prerequisite evidence cannot authorize mutation'};
 const context=transitionContext(p,decision);assert.match(context,/"stage":"READY FOR EXECUTION"/);assert.match(context,/Selected action: Establish permission/);assert.match(context,/Prerequisite evidence cannot authorize mutation/);
});

function integrated(){
 const requirements=[{id:'R3',text:'Repair companion',criterion:'Works coherently',review:'REQUIRED',dependsOn:[]}];
 const fields={...Object.fromEntries(KEYS.map(k=>[k,''])),project:'Transition integration',goal:'Repair the companion',state:'Cause established',remaining:'Repair and qualify companion',next:'Repair the companion',phase:'EXECUTION',success:'A corrected candidate',authorization:'User authorized editing the companion.',access:'Editor available',resultIdentity:'candidate-v1',requirements:JSON.stringify(requirements),progressEvents:'[]'};
 const p={id:'transition-integration',title:fields.project,automaticTracking:true,request:'',checkpoints:[{id:'base',parent:null,at:'2026-10-27T00:00:00Z',raw:'PROJECT: Transition integration',fields}]};ensureFlow(p,'fixture');return p;
}
function receive(p,body){const x=recordResponse(p,'PROJECT: Transition integration\nBASELINE: '+p.checkpoints.at(-1).id+'\nTASK OUTCOME: PARTIAL\n'+body);assert(x.result,'Report should be recorded: '+JSON.stringify(x.reasons));return x;}
test('response processing saves transition and actual workflow audit; backup preserves it',async()=>{
 let p=integrated(),r=report();receive(p,'TASK TRANSITION: '+JSON.stringify(r)+'\nCURRENT STATE: Receipt route examined');
 const w=workflowDecision(p),audit=p.flow.log.at(-1).transition;
 assert.equal(w.transition.selected.id,'receipt');assert.equal(audit.phase,w.phase);assert.equal(audit.action,w.action);assert.equal(audit.condition,w.condition);assert.match(continuation(p).text,/"selectedPrerequisite":"receipt"/);
 p=await decodeBackup(projectBackup(p));ensureFlow(p,'fixture');assert.equal(workflowDecision(p).transition.selected.id,'receipt');
});
test('qualification condition holds review then unlocks existing checked-result review',()=>{
 const p=integrated(),events=[{id:'RSL',requirement:'R3',kind:'RESULT',details:'Corrected companion',artifact:'candidate-v1',reference:'result/v1'},{id:'CHK',requirement:'R3',kind:'CHECK',result:'RSL',artifact:'candidate-v1',criterion:'Works coherently',outcome:'PASS',details:'Browser regression passed',reference:'check/v1'}];
 const r={...report(),stage:'USER REVIEW',intendedAction:'Present the qualified companion for owner judgment',conditions:[{...c('selected-gates'),stage:'QUALIFICATION',action:'Qualify the exact candidate against selected applicable gates'}]};
 receive(p,'PROGRESS EVENTS: '+JSON.stringify(events)+'\nTASK TRANSITION: '+JSON.stringify(r));
 assert.equal(workflowDecision(p).phase,'QUALIFICATION');assert.equal(workflowDecision(p).canReviewResult,false);assert.throws(()=>recordUserDecision(p,'ACCEPTED'));
 r.conditions[0]={...r.conditions[0],status:'SATISFIED',reference:'qualification/v1',subject:'candidate-v1'};
 receive(p,'TASK TRANSITION: '+JSON.stringify(r)+'\nCURRENT STATE: Selected qualification gates passed');
 const w=workflowDecision(p);assert.equal(w.phase,'USER REVIEW');assert.equal(w.canReviewResult,true);assert.equal(w.canClose,false);assert.equal(p.progress.decisions.length,0);
 recordUserDecision(p,'ACCEPTED');assert.equal(workflowDecision(p).canClose,true);recordUserDecision(p,'ACCEPTED');assert.equal(p.flow.status,'COMPLETE');
});
test('new diagnostic prose with identical failed route retains repetition in controller and audit',()=>{
 const p=integrated(),r=report();receive(p,'TASK TRANSITION: '+JSON.stringify(r)+'\nCURRENT STATE: Runner failed before receipt');
 r.conditions[0].criterion='Return the same receipt with more explanatory detail';receive(p,'TASK TRANSITION: '+JSON.stringify(r)+'\nCURRENT STATE: Confirmed the same runner limitation');
 const w=workflowDecision(p);assert(w.transition.repeated);assert.equal(p.flow.log.at(-1).transition.delta,'NO_TRANSITION');assert.match(continuation(p).action,/materially different permitted route/);
});
