import test from 'node:test';
import assert from 'node:assert/strict';
import {KEYS, projectBackup, decodeBackup, captureRequest} from './dist/packet.mjs';
import {ensureFlow, workflowDecision, continuation, nonBlockingStatement, recordUserDecision} from './dist/progression.mjs';
import {progressContext, progressSnapshot, recordRequirementAdoption, validateProgress} from './dist/progress-record.mjs';

// Cross-domain acceptance cases chosen independently of the Operations Chamber
// specimen. These exercise behavior rather than particular project names.
const requirement=(id,text,criterion,review='NOT_REQUIRED',dependsOn=[])=>({id,text,criterion,review,dependsOn,standing:'PROPOSED'});
const first=requirement('R1','Verify the exhibition catalogue','The printed catalogue matches the approved exhibit list');
const result=(r,id='ART1',artifact='catalogue:v3')=>({id,requirement:r.id,kind:'RESULT',details:'A revised catalogue was produced.',artifact,reference:'print-proof/2026-10-25'});
const check=(r,outcome='PASS',id='CHK1',resultId='ART1',artifact='catalogue:v3')=>({id,requirement:r.id,kind:'CHECK',details:'Comparison completed.',artifact,result:resultId,criterion:r.criterion,outcome,reference:'catalogue-comparison/2026-10-25'});
function seed({requirements=[first],events=[],fields={},mode='structured'}={}){
 const base={...Object.fromEntries(KEYS.map(k=>[k,''])),project:'Exhibition catalogue',goal:'Deliver an accurate exhibition catalogue',state:'Catalogue prepared; comparison remains',remaining:'Verify the catalogue',next:'Verify the exhibition catalogue against the approved exhibit list',phase:'VERIFICATION',authorization:'User permitted inspection and comparison. No changes or publication.',access:'Saved exhibit list is available',requirements:mode==='structured'?JSON.stringify(requirements):'',progressEvents:mode==='structured'?JSON.stringify(events):'',...fields};
 const p={id:'cross-domain',title:base.project,automaticTracking:mode!=='legacy',request:'',checkpoints:[{id:'base',parent:null,at:'2026-10-25T00:00:00Z',raw:'PROJECT: Exhibition catalogue',fields:base}]};
 ensureFlow(p,'test-owner');return p;
}

for(const mode of ['structured','automatic','legacy'])test(mode+': a receiving room checks its own visual capability without claiming prior limitation resolved',()=>{
 const limitation={id:'L1',requirement:'R1',kind:'LIMITATION',details:'The previous room had no interactive browser for the private catalogue preview.',route:'Previous room web reader',reference:'preview-access-attempt-1'};
 const p=seed({mode,events:[limitation],fields:{blockers:'Interactive preview access was unavailable in the previous room.',access:'An authenticated browser is required to inspect the preview.'}});
 const w=workflowDecision(p),prompt=continuation(p).text;
 assert.equal(w.phase,'VERIFICATION');
 assert(w.action.startsWith(p.checkpoints[0].fields.next),'the intended action must remain first, before access commentary');
 assert.match(prompt,/browser|access/i);
 assert.doesNotMatch(prompt,/access (?:has been|was) restored/i);
 assert.equal(p.checkpoints[0].fields.resolved,'');
 if(mode==='structured')assert(p.progress.events.some(e=>e.id==='L1'),'the actual historical limitation remains saved');
});

test('exact Operations Chamber access statement preserves intended verification and later permits checked review',()=>{
 const human={...first,review:'REQUIRED'};
 const blocker='Owner-authenticated interactive access to the original Site is unavailable in this session. That access, or sufficiently complete fresh visual evidence, is needed to establish the remaining live-interface completion conditions.';
 const p=seed({requirements:[human],fields:{blockers:blocker}});
 assert.equal(workflowDecision(p).phase,'VERIFICATION');
 p.progress.events.push({...result(human),source:'later-capable-room'},{...check(human),source:'later-capable-room'});
 const w=workflowDecision(p);
 assert.equal(w.phase,'USER REVIEW');
 assert.equal(w.canReviewResult,true);
 recordUserDecision(p,'ACCEPTED','The catalogue is correct.');
 assert.equal(p.progress.decisions.at(-1).value,'ACCEPTED');
 assert.equal(p.checkpoints[0].fields.resolved,'','later review does not fabricate a dependency-resolution receipt');
});

for(const blocker of [
 'The printer is broken and cannot produce the required physical proof.',
 'The archive service returned HTTP 503 in this session; the required exhibit list is unavailable.',
 'The site is unavailable in this session; browser access cannot continue.',
 'The signed release form is missing; the gallery has not supplied it.'
])test('a real dependency remains recovery: '+blocker,()=>{
 const p=seed({fields:{blockers:blocker}});
 assert.equal(workflowDecision(p).phase,'RECOVERY');
 assert.match(continuation(p).action,new RegExp(blocker.includes('printer')?'printer':blocker.includes('archive')?'archive':blocker.includes('site')?'site':'release form','i'));
});

for(const text of [
 'There is no confirmed printing, layout, or publication blocker for this inspection.',
 'No confirmed editorial blocker remains.',
 'No access blocker is established.'
])test('explicit non-blocker is excluded: '+text,()=>{
 assert.equal(nonBlockingStatement(text),true);
 assert.equal(workflowDecision(seed({fields:{blockers:text}})).phase,'VERIFICATION');
});

for(const text of [
 'No printing blocker remains, but the signed release is missing.',
 'No publication blocker; the physical proof is unavailable.',
 'There is no layout blocker. However, the archive service is down.'
])test('mixed statement cannot erase its genuine dependency: '+text,()=>{
 assert.equal(nonBlockingStatement(text),false);
 assert.equal(workflowDecision(seed({fields:{blockers:text}})).phase,'RECOVERY');
});

test('an independent failed check is actionable before unrelated human judgment',()=>{
 const art=requirement('R1','Approve the cover artwork','The owner approves the cover appearance','REQUIRED');
 const copy=requirement('R2','Check artist names','All printed names match the approved list');
 const p=seed({requirements:[art,copy],events:[result(art),check(art),result(copy,'ART2','catalogue:v4'),check(copy,'FAIL','CHK2','ART2','catalogue:v4')],fields:{authorization:'User authorized correction of the catalogue text.'}});
 assert.equal(progressSnapshot(p.progress).next.id,'R2');
 assert.equal(workflowDecision(p).phase,'CORRECTION');
 assert.equal(p.progress.decisions.length,0,'selection cannot grant acceptance to the cover');
});

test('true prerequisite acceptance is not bypassed to execute a dependent correction',()=>{
 const approval=requirement('R1','Approve the exhibit list','The owner approves the exhibit list','REQUIRED');
 const copy=requirement('R2','Correct the catalogue','Catalogue names match the approved exhibit list','NOT_REQUIRED',['R1']);
 const p=seed({requirements:[approval,copy],events:[result(approval),check(approval),result(copy,'ART2','catalogue:v4'),check(copy,'FAIL','CHK2','ART2','catalogue:v4')],fields:{authorization:'User authorized correction after exhibit list approval.'}});
 const s=progressSnapshot(p.progress);
 assert.equal(s.rows.find(r=>r.id==='R2').status,'BLOCKED_DEPENDENCY');
 assert.equal(s.next.id,'R1');
 assert.deepEqual(p.progress.requirements[1].dependsOn,['R1']);
});

test('compact evidence preserves exact check correspondence and avoids duplicate narration',()=>{
 const p=seed({events:[result(first),check(first,'FAIL')]});
 const context=progressContext(p);
 assert.match(context,/FAIL/);
 assert.match(context,/ART1/);
 assert.match(context,/CHK1/);
 assert.match(context,/catalogue:v3/);
 assert(context.includes(first.criterion));
 assert.match(context,/catalogue-comparison\/2026-10-25/);
 assert.equal(context.split('Comparison completed.').length-1,1);
 assert.equal(p.progress.decisions.length,0);
});

test('source-reported pass never creates human result acceptance',()=>{
 const human={...first,review:'REQUIRED'};
 const p=seed({requirements:[human],events:[result(human),check(human)]});
 const s=progressSnapshot(p.progress);
 assert.equal(s.allSatisfied,false);
 assert.equal(s.rows[0].status,'CHECK_REPORTED');
 assert.equal(p.progress.decisions.length,0);
});

test('historical proposed requirement payload survives portable backup unchanged',async()=>{
 const p=seed({events:[result(first),check(first)]});
 const restored=await decodeBackup(projectBackup(p));ensureFlow(restored,'test-owner');
 assert.deepEqual(restored.progress.requirements,p.progress.requirements);
 assert.equal(restored.progress.requirements[0].standing,'PROPOSED');
 assert.deepEqual(restored.progress.events,p.progress.events);
 assert.equal(restored.progress.decisions.length,0);
});

test('explicit requirement adoption exports separately from unchanged source proposal and survives backup',async()=>{
 const p=seed();
 assert.doesNotMatch(progressContext(p),/^ADOPTED REQUIREMENT MAP$/m);
 recordRequirementAdoption(p,{at:'2026-10-25T12:00:00Z'});
 assert.equal(p.progress.requirements[0].standing,'PROPOSED');
 assert.match(progressContext(p),/^ADOPTED REQUIREMENT MAP$/m);
 assert.equal(p.progress.decisions.length,0,'scope adoption is not result acceptance');
 const restored=await decodeBackup(projectBackup(p));ensureFlow(restored,'test-owner');
 assert.deepEqual(restored.progress.adoptions,p.progress.adoptions);
 assert.equal(restored.progress.requirements[0].standing,'PROPOSED');
 assert.match(progressContext(restored),/^ADOPTED REQUIREMENT MAP$/m);
});

test('malformed adoption metadata cannot fabricate accepted scope on restore',()=>{
 const p=seed();
 p.progress.adoptions=[{requirements:['MISSING'],baseline:'base',at:'2026-10-25T12:00:00Z'}];
 assert.throws(()=>validateProgress(p.progress),/adopt/i);
});

test('fresh intake keeps human intent first while continuation does not restart intent intake',()=>{
 assert.match(captureRequest('start'),/What do you want to create or achieve/);
 assert.doesNotMatch(continuation(seed()).text,/Your first reply.*one short question/);
});
