import test from 'node:test';
import assert from 'node:assert/strict';
import {KEYS,parsePacket,projectBackup,decodeBackup,mergePacket} from './dist/packet.mjs';
import {ensureFlow,continuation,projectSummary} from './dist/progression.mjs';
import {recordResponse} from './dist/response.mjs';
import {currentAttempt,automaticSnapshot} from './dist/automatic-tracking.mjs';
const req=[{id:'A',text:'Investigate a reported behavior',criterion:'Occurrence and cause documented',review:'REQUIRED',dependsOn:[],standing:'PROPOSED'}];
function seed(){const fields={...Object.fromEntries(KEYS.map(k=>[k,''])),project:'Controlled non-software study',goal:'Document occurrence and obtain human judgment',completed:'Historical reconciliation',resultIdentity:'published-work-v1',artifacts:'Governing work edition: published-work-v1',remaining:'Establish occurrence\nCorrect and obtain user review',next:'Establish occurrence',requirements:JSON.stringify(req),progressEvents:'[]',authorization:'Investigation only. No publication permission.'};const p={id:'current-test',title:fields.project,automaticTracking:true,request:'',checkpoints:[{id:'base',parent:null,at:'2026-10-24T00:00:00Z',raw:'PROJECT: '+fields.project,fields}]};ensureFlow(p,'qa');return p;}
const events=[{id:'diag-result',requirement:'UNKNOWN',kind:'RESULT',details:'Controlled diagnostic produced new evidence; occurrence unverified.',artifact:'study-report-edition-2',reference:'Study notebook page 2'},{id:'diag-finding',requirement:'UNKNOWN',kind:'FINDING',details:'Related interpretation; field validation unfinished.',reference:'Study notebook page 3'}];
const response='PROJECT: Controlled non-software study\nBASELINE: base\nTASK OUTCOME: PARTIAL\nPRODUCT CHANGES: UNCHANGED\nCOMPLETED WORK: Historical reconciliation\nRESULT IDENTITY: published-work-v1\nPROGRESS EVENTS: '+JSON.stringify(events);
test('related events share current projection; historical identities and proposed requirements survive reload and repeat',async()=>{
 let p=seed();const backup=projectBackup(p),result=recordResponse(p,response);assert(result.result);
 const a=currentAttempt(p);assert.equal(a.latest.length,2);assert(!a.latest.join(' ').includes('Historical reconciliation'));assert.deepEqual(a.identities,['study-report-edition-2']);assert.equal(a.sourceIdentity,'published-work-v1');assert.equal(a.warnings.length,2);
 assert.equal(p.progress.requirements[0].standing,'PROPOSED');assert.equal(p.progress.events.length,2);assert.equal(a.unassigned.length,2);assert.equal(p.progress.decisions.length,0);assert.notEqual(p.flow.status,'COMPLETE');assert.equal(p.checkpoints.at(-1).fields.artifacts,'Governing work edition: published-work-v1');
 assert.equal(projectSummary(p).latest,a.latest.join('\n'));for(const d of a.latest)assert(continuation(p).text.includes(d));assert(continuation(p).text.includes(a.identities[0]));
 p=await decodeBackup(projectBackup(p));ensureFlow(p,'qa');assert.deepEqual(currentAttempt(p),a);const n=p.progress.events.length;assert(recordResponse(p,response).duplicate);assert.equal(p.progress.events.length,n);assert.equal(p.checkpoints.at(-1).raw,response);
 const restored=await decodeBackup(backup);assert.equal(restored.progress.events.length,0);assert.deepEqual(restored.progress.requirements,req);
});
test('malformed requirement warns without replacing valid requirements; response retained',()=>{
 const p=seed(),before=JSON.stringify(p.progress);const raw=response+'\nREQUIREMENTS: [{"id":"bad"}]';const result=recordResponse(p,raw);
 assert(result.result);assert(result.assessment.validationErrors.length);assert.match(result.assessment.validationErrors[0],/review/i);assert.equal(JSON.stringify(p.progress),before);assert.equal(p.checkpoints.at(-1).fields.requirements,JSON.stringify(req));assert.equal(p.checkpoints.at(-1).raw,raw);assert(currentAttempt(p).warnings.some(x=>/review/i.test(x)));assert.equal(currentAttempt(p).unassigned.length,2);assert(continuation(p).text.includes('diag-result'));
});
test('merge exposes current fields separately without destroying carried history',()=>{const p=seed(),incoming=parsePacket('PROJECT: '+p.title+'\nBASELINE: base\nCURRENT STATE: New attempt');const m=mergePacket(p.checkpoints[0],incoming);assert.equal(m.fields.completed,'Historical reconciliation');assert.equal(m.currentFields.completed,'');assert(m.carried.includes('completed'));});

test('labelled and fenced events retain every finding in display and continuation',async()=>{
 const formats=["```json\n"+JSON.stringify(events)+"\n```",events.map(e=>Object.entries(e).map(([k,v])=>k.toUpperCase()+': '+v).join('\n')).join('\n\n')];
 for(const format of formats){let p=seed();const raw=response.slice(0,response.indexOf('PROGRESS EVENTS:'))+'PROGRESS EVENTS: '+format;assert(recordResponse(p,raw).result);assert.equal(p.progress.events.length,2);assert.equal(currentAttempt(p).latest.length,2);for(const e of events){assert(projectSummary(p).latest.includes(e.details));assert(continuation(p).text.includes(e.details));assert(automaticSnapshot(p).observations.some(x=>x.includes(e.details)));}p=await decodeBackup(projectBackup(p));ensureFlow(p,'qa');assert.equal(currentAttempt(p).latest.length,2);assert(recordResponse(p,raw).duplicate);assert.equal(p.progress.events.length,2);}
});
