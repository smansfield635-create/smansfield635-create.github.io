import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateState,receiveResult,selectContinuation,describeProgress,generateContinuation,ProgressionError} from '../progression.mjs';

const load=(file)=>JSON.parse(fs.readFileSync(new URL('../fixtures/'+file,import.meta.url),'utf8'));
const state=()=>load('sample-world-before.json');
const incoming=()=>load('sample-world-result.json');
const e=(id,milestoneId,kind='RESULT',verification='source_reported')=>({id,requirementId:'R1',milestoneId,kind,details:id+' diagnostic',verification});

test('latest diagnostic replaces stale latest reconciliation, preserves product release and history',()=>{
 const s=receiveResult(state(),incoming());
 assert.equal(s.latestActivity.id,'DEMO-REPORT-QUAL');
 assert.match(s.latestActivity.summary,/sample-renderer/);
 assert.equal(s.latestActivity.resultArtifact,'sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');
 assert.equal(s.productIdentity,'DEMO_RELEASE_HEAD');
 assert.equal(s.history.length,2);assert.equal(s.history[0].latest.summary,'Reconciled three disputed dependencies');
 assert.equal(s.requirements[0].standing,'proposed');
});

test('unassigned events retained exactly once with no milestone or requirement completion credit',()=>{
 const x=state(),r=incoming();const s=receiveResult(x,r);
 assert.equal(s.events.length,2);assert(s.events.every(q=>q.assignment==='UNASSIGNED'&&q.requirementId===null&&q.milestoneId===null));
 assert.equal(s.requirements[0].milestones[2].status,'active');
 assert.equal(s.requirements[0].milestones[2].evidenceIds.length,0);
 assert.equal(describeProgress(s).unassignedEvidenceCount,2);
 assert.equal(x.events.length,0);assert.deepEqual(receiveResult(s,r),s);
});

test('continuation selects active final qualification, never reopens worldwide diagnostic or stale receipts',()=>{
 const s=receiveResult(state(),incoming()),chosen=selectContinuation(s),prompt=generateContinuation(s);
 assert.equal(chosen.target.milestoneId,'CAM-FINAL');
 assert.match(prompt,/Final camera correction qualification/);
 assert.match(prompt,/3\.75/);
 assert.match(prompt,/DEMO-EVENT-027/);
 assert.match(prompt,/COMPLETED WITHIN RECORDED SCOPE/);
 assert.doesNotMatch(prompt,/Reconciled three disputed dependencies/);
 assert.doesNotMatch(prompt,/PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1/);
 assert.match(prompt,/PROPOSED/);
});

test('render and prompt use same selected state, preserve all relevant latest findings',()=>{
 const s=receiveResult(state(),incoming());const v=describeProgress(s),prompt=generateContinuation(s);
 assert.deepEqual(v.whatAdvanced.map(x=>x.eventId),['DEMO-EVENT-026','DEMO-EVENT-027']);
 assert.equal(v.whatRemains.milestoneId,v.continuation.target.milestoneId);
 assert(prompt.includes(v.whatRemains.title));
});

test('reload persistence and duplicate import do not modify state or duplicate findings',()=>{
 const s=receiveResult(state(),incoming());const recovered=JSON.parse(JSON.stringify(s));validateState(recovered);
 assert.deepEqual(receiveResult(recovered,incoming()),s);
 assert.equal(recovered.latestActivity.id,'DEMO-REPORT-QUAL');
});

test('changing content under same event ID fails atomically',()=>{
 const s=receiveResult(state(),incoming()),before=JSON.stringify(s),r={...incoming(),id:'HE-REPORT-CONFLICT',events:[{...incoming().events[0],details:'CHANGED'}]};
 assert.throws(()=>receiveResult(s,r),{code:'CONFLICTING_EVENT_ID'});
 assert.equal(JSON.stringify(s),before);
});

test('invalid requirement association fails; UNKNOWN remains safely unassigned',()=>{
 const r=incoming();r.events=[{...e('A','FAKE'),requirementId:'R1'}];
 assert.throws(()=>receiveResult(state(),r),{code:'INVALID_EVIDENCE_LINK'});
 const x=incoming();assert.equal(receiveResult(state(),x).events[0].assignment,'UNASSIGNED');
});

test('missing or malformed requirements fail closed with no changed input',()=>{
 const x=state();x.requirements='not an array';assert.throws(()=>validateState(x),{code:'INVALID_REQUIREMENTS'});
 const s=state(),before=JSON.stringify(s);assert.throws(()=>receiveResult(s,{id:'INVALID',events:'raw text'}),{code:'INVALID_REPORT'});
 assert.equal(JSON.stringify(s),before);
});

test('a finding never automatically advances milestone status or authorization',()=>{
 const x=state(),r={id:'HE-NEW',events:[e('NEWE','CAM-FINAL')],milestoneUpdates:[],attempts:[]};
 const s=receiveResult(x,r);assert.equal(s.requirements[0].milestones[2].status,'active');
 assert.equal(s.authorizations.implementation,false);
});

test('self-reported final qualification can advance *workflow* to authorization gate, without product completion',()=>{
 const s=receiveResult(state(),{id:'HE-FINAL-REPORT',events:[e('E1','CAM-FINAL')],milestoneUpdates:[{milestoneId:'CAM-FINAL',status:'reported_complete',evidenceEventIds:['E1']}],attempts:[],suggestedNextMilestoneId:'CAM-IMPLEMENT',summary:'Bounded qualification reported'});
 assert.equal(selectContinuation(s).target.milestoneId,'CAM-IMPLEMENT');
 assert.equal(selectContinuation(s).status,'AUTHORIZATION_REQUIRED');
 assert.match(generateContinuation(s),/not authorized/);
 assert.equal(s.requirements[0].standing,'proposed');
 assert.equal(s.productIdentity,state().productIdentity);
});

test('claiming independently verified completion without receipt fails closed',()=>{
 const s=state(),r={id:'HE-OVERCLAIM',events:[e('E2','CAM-FINAL')],milestoneUpdates:[{milestoneId:'CAM-FINAL',status:'verified_complete',evidenceEventIds:['E2']}],attempts:[]};
 assert.throws(()=>receiveResult(s,r),{code:'UNVERIFIED_COMPLETION'});
});

test('user acceptance cannot be manufactured by an AI report',()=>{
 const s=state();s.requirements[0].milestones[4].prerequisites=[];s.requirements[0].milestones[4].status='active';s.activeMilestoneId='CAM-VISUAL';
 const event={...e('E3','CAM-VISUAL'),verification:'independently_checked',artifact:'sha256:user-review'};
 s.verificationLedger=[{eventId:'E3',reference:'checked-photo-receipt',verified:true,evidenceDigest:'sha256:user-review'}];
 const r={id:'AI-SAYS-APPROVED',events:[event],milestoneUpdates:[{milestoneId:'CAM-VISUAL',status:'verified_complete',evidenceEventIds:['E3'],userAccepted:true,userAcceptanceReference:'made-up'}],attempts:[]};
 assert.throws(()=>receiveResult(s,r),{code:'USER_ACCEPTANCE_REQUIRED'});
});

test('failed execution attempt does not replace the objective or reset current phase',()=>{
 const s=receiveResult(state(),{id:'BLOCKED-BROWSER',events:[{id:'LIMIT',kind:'LIMITATION',details:'DNS failure',requirementId:'R1',milestoneId:'CAM-FINAL'}],attempts:[{id:'BROWSER-1',milestoneId:'CAM-FINAL',outcome:'BLOCKED',limitation:'DNS'}]});
 assert.equal(selectContinuation(s).target.milestoneId,'CAM-FINAL');
 assert.equal(s.attempts.length,1);
 assert.match(generateContinuation(s),/Final camera correction qualification/);
});

test('ordinary non-software project works without GitHub or publication artifacts',()=>{
 const x={projectId:'EVENT',projectName:'Community fundraiser',goal:'Hold a successful event',requirements:[{id:'E1',title:'Venue and setup',standing:'approved',milestones:[{id:'E-PLAN',title:'Plan space',objective:'Check available spaces',order:1,status:'active',acceptanceCriteria:['Venue plan checked'],evidenceIds:[],prerequisites:[]}]}],events:[],attempts:[],history:[],activeMilestoneId:'E-PLAN',authorizations:{}};
 const out=receiveResult(x,{id:'VENUE-RESULT',events:[{id:'PHOTO-1',requirementId:'E1',milestoneId:'E-PLAN',kind:'RESULT',details:'Venue seating plan photographed',artifact:'PHOTO'}],milestoneUpdates:[]});
 assert.equal(out.events[0].assignment,'EXPLICIT');assert.equal(selectContinuation(out).target.milestoneId,'E-PLAN');
 assert.equal(describeProgress(out).whatAdvanced[0].details,'Venue seating plan photographed');
});

test('completion without evidence and invalid later phase skipping are rejected',()=>{
 const s=state();assert.throws(()=>receiveResult(s,{id:'EMPTY-UPDATE',events:[],milestoneUpdates:[{milestoneId:'CAM-FINAL',status:'reported_complete',evidenceEventIds:[]}]}),{code:'COMPLETION_WITHOUT_EVIDENCE'});
 assert.throws(()=>receiveResult(s,{id:'JUMP',suggestedNextMilestoneId:'CAM-IMPLEMENT'}),{code:'UNMET_PREREQUISITES'});
});

test('later receiving-AI correspondence proposal links UNKNOWN event without claiming verification or completion',()=>{
 const s=receiveResult(state(),incoming());
 const after=receiveResult(s,{id:'HE-ASSOC',evidenceAssignments:[
   {eventId:'DEMO-EVENT-026',requirementId:'R1',milestoneId:'CAM-FINAL',rationale:'The evidence evaluates the current camera-height candidate'},
   {eventId:'DEMO-EVENT-027',requirementId:'R1',milestoneId:'CAM-FINAL',rationale:'The conclusion addresses unresolved smoothing and safety'}
 ],events:[],milestoneUpdates:[],attempts:[],summary:'Evidence correspondence proposed'});
 assert.equal(after.events[0].assignment,'EXPLICIT');
 assert.equal(after.events[0].assignmentBasis,'RECEIVING_AI_PROPOSAL');
 assert.deepEqual(after.requirements[0].milestones[2].evidenceIds,['DEMO-EVENT-026','DEMO-EVENT-027']);
 assert.equal(after.requirements[0].milestones[2].status,'active');
 assert.equal(after.requirements[0].standing,'proposed');
 assert.equal(describeProgress(after).unassignedEvidenceCount,0);
});

test('a trusted verification ledger (not a self-claim) may substantiate scoped verification',()=>{
 const s=state();s.verificationLedger=[{eventId:'E-VERIFIED',reference:'qualified-native-receipt',verified:true,evidenceDigest:'sha256:abc'}];
 const event={...e('E-VERIFIED','CAM-FINAL','RESULT','independently_checked'),artifact:'sha256:abc'};
 const after=receiveResult(s,{id:'TRUSTED-CHECK',events:[event],milestoneUpdates:[{milestoneId:'CAM-FINAL',status:'verified_complete',evidenceEventIds:['E-VERIFIED']}],suggestedNextMilestoneId:'CAM-IMPLEMENT'});
 assert.equal(after.requirements[0].milestones[2].status,'verified_complete');
 assert.equal(selectContinuation(after).status,'AUTHORIZATION_REQUIRED');
});

test('self-asserted approval, result hash, or release permission cannot bypass saved authority',()=>{
 const s=state();
 const event={...e('E-VERIFY','CAM-FINAL','RESULT','independently_checked'),artifact:'sha256:different',verificationReference:'claimed-by-AI'};
 const report={id:'FALSE-VERIFIED',events:[event],milestoneUpdates:[{milestoneId:'CAM-FINAL',status:'verified_complete',evidenceEventIds:['E-VERIFY']}],authorizations:{implementation:true}};
 assert.throws(()=>receiveResult(s,report),{code:'UNVERIFIED_COMPLETION'});
 assert.equal(s.authorizations.implementation,false);
});

test('three-room success/failure/success preserves progress without modifying selection rules',()=>{
 const s=state();
 const roomA=receiveResult(s,{id:'ROOM-A',summary:'Candidate samples reported',events:[e('A-EVID','CAM-FINAL')],attempts:[{id:'A-ATT',milestoneId:'CAM-FINAL',outcome:'COMPLETED'}]});
 const roomB=receiveResult(roomA,{id:'ROOM-B',summary:'Failed browser route retained',events:[{id:'B-LIMIT',requirementId:'R1',milestoneId:'CAM-FINAL',kind:'LIMITATION',details:'No remote browser'}],attempts:[{id:'B-ATT',milestoneId:'CAM-FINAL',outcome:'BLOCKED',limitation:'No browser'}]});
 assert.equal(selectContinuation(roomB).target.milestoneId,'CAM-FINAL');
 const roomC=receiveResult(roomB,{id:'ROOM-C',summary:'Another method qualified source candidate',events:[e('C-RESULT','CAM-FINAL')],milestoneUpdates:[{milestoneId:'CAM-FINAL',status:'reported_complete',evidenceEventIds:['C-RESULT']}],suggestedNextMilestoneId:'CAM-IMPLEMENT'});
 assert.equal(selectContinuation(roomC).target.milestoneId,'CAM-IMPLEMENT');
 assert.equal(selectContinuation(roomC).status,'AUTHORIZATION_REQUIRED');
 assert.equal(roomC.events.length,3);assert.equal(roomC.attempts.length,2);
 assert.deepEqual(roomC.history.map(h=>h.id).slice(-3),['ROOM-A','ROOM-B','ROOM-C']);
 assert.match(roomC.latestActivity.summary,/C-RESULT diagnostic/);
 assert.equal(roomC.latestActivity.reportedSummary,'Another method qualified source candidate');
});

test('authorization gate does not silently turn pending implementation into active',()=>{
 const s=receiveResult(state(),{id:'READY-TO-ASK',events:[e('E-READY','CAM-FINAL')],milestoneUpdates:[{milestoneId:'CAM-FINAL',status:'reported_complete',evidenceEventIds:['E-READY']}],suggestedNextMilestoneId:'CAM-IMPLEMENT'});
 assert.equal(s.requirements[0].milestones[3].status,'pending');
 assert.equal(s.activeMilestoneId,'CAM-IMPLEMENT');
 assert.equal(describeProgress(s).whereUserComesIn,'Authorization required before material execution');
});


test('stale incoming accomplishment cannot replace the actual newly observed events',()=>{
 const r=incoming();r.id='STALE-REPORT';r.summary='Reconciled three disputed dependencies using existing evidence';r.resultArtifact='sha256:new-test';
 const s=receiveResult(state(),r);
 assert.match(s.latestActivity.summary,/sample-renderer presentation diagnostic/);
 assert.doesNotMatch(s.latestActivity.summary,/Reconciled three disputed dependencies/);
 assert.equal(s.latestActivity.reportedSummary,'Reconciled three disputed dependencies using existing evidence');
});

test('reported DNS failure is attempt limitation, not progress or a new project objective',()=>{
 const s=receiveResult(state(),{id:'DNS-ONLY',events:[{id:'DNS-ERR',kind:'LIMITATION',details:'DNS resolution failed',requirementId:'R1',milestoneId:'CAM-FINAL'}]});
 const v=describeProgress(s);
 assert.deepEqual(v.whatAdvanced,[]);assert.equal(v.attemptLimitations.length,1);
 assert.equal(v.whatRemains.milestoneId,'CAM-FINAL');
});

test('new candidate evaluation advances from earlier investigation phase to final qualification using explicit AI stage proposal',()=>{
 const s=state();s.activeMilestoneId='CAM-EXPLORE';s.requirements[0].milestones[1].status='active';
 const candidate={id:'AI-CANDIDATE-EVAL',summary:'Sixteen correction configurations explored',events:[{...e('E-CAND','CAM-EXPLORE'),details:'Sixteen candidates, 5280 movement + 2100 rotation steps; selected a provisional candidate',artifact:'candidate-qualification-receipt'}],milestoneUpdates:[{milestoneId:'CAM-EXPLORE',status:'reported_complete',evidenceEventIds:['E-CAND']}],suggestedNextMilestoneId:'CAM-FINAL'};
 const updated=receiveResult(s,candidate);
 assert.equal(selectContinuation(updated).target.milestoneId,'CAM-FINAL');
 assert.match(generateContinuation(updated),/provisional candidate/);
 assert.doesNotMatch(generateContinuation(updated),/Reconciled three disputed dependencies/);
});
