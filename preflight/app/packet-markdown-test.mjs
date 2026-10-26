import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parsePacket,packetValue,projectBackup,decodeProjectBackup} from './dist/packet.mjs';
const raw=fs.readFileSync(new URL('./fixtures/build-renewal-response.txt',import.meta.url),'utf8');
test('complete owner response preserves every requirement, finding and original byte',async()=>{
 const p=parsePacket(raw),arrays=[...raw.matchAll(/```json\s*\n([\s\S]*?)\n```/g)].map(m=>JSON.parse(m[1]));
 assert.equal(p.raw,raw);assert.deepEqual(p.mappingIssues,[]);
 assert.equal(p.fields.project,'Build Your Own Website — Diamond Gate Bridge');
 assert.deepEqual(JSON.parse(p.fields.requirements),arrays[0]);assert.equal(arrays[0].length,6);
 assert.deepEqual(JSON.parse(p.fields.progressEvents),arrays[1]);assert.equal(arrays[1].length,4);
 assert(arrays[0].every(r=>r.standing==='PROPOSED'));assert(arrays[1].every(e=>e.kind==='FINDING'));
 assert.match(p.fields.organization,/Project: Build Your Own Website, registered as `BUILD`/);
 assert.match(p.fields.authorization,/does not authorize edits/);assert.match(p.fields.next,/Stop at a qualified draft/);
 assert.equal(packetValue(p.fields.outcome,['COMPLETED']),'COMPLETED');assert.equal(p.fields.productChanges,'UNCHANGED');
 const project={id:'fixture',title:p.fields.project,request:'',checkpoints:[{id:'first',parent:null,at:'2026-10-26T23:00:00Z',raw,fields:p.fields}]};
 assert.equal((await decodeProjectBackup(projectBackup(project))).project.checkpoints[0].raw,raw);
});
test('Markdown-only packet remains a packet rather than embedded JSON envelope',()=>{
 const p=parsePacket('### PROJECT\nExample\n### GOAL\nPreserve\n### CURRENT STATE\nPending\n### PROGRESS EVENTS\n```json\n[]\n```');
 assert.equal(p.fields.project,'Example');assert.equal(p.fields.goal,'Preserve');assert.equal(p.fields.progressEvents,'[]');
});
test('real repeated headings and aliases still fail',()=>{
 for(const duplicate of ['PROJECT: Another','Project: Another','### PROJECT\nAnother','**PROJECT:** Another'])assert.throws(()=>parsePacket('PROJECT: One\nGOAL: Keep\nCURRENT STATE: Pending\n'+duplicate),/repeats a section/);
 assert.throws(()=>parsePacket('PROJECT: One\n### REQUIREMENTS\n[]\n### REQUIREMENTS AND ACCEPTANCE CRITERIA\n[]'),/repeats a section/);
 assert.throws(()=>parsePacket('PROJECT ORGANIZATION: One\nProject: One\nProject: Another\nGOAL: Keep'),/repeats a section/);
});
test('fenced and quoted heading-shaped evidence stays literal',()=>{
 for(const fence of ['```json','```text','```','~~~text']){
  const close=fence.startsWith('~')?'~~~':'```';
  const p=parsePacket('PROJECT: One\nGOAL: Keep\nCURRENT STATE:\n'+fence+'\nPROJECT: Not a section\n### GOAL\nEvidence\n'+close+'\nNEXT STEP: Review');
  assert.equal(p.fields.project,'One');assert.equal(p.fields.goal,'Keep');assert.match(p.fields.state,/PROJECT: Not a section/);assert.equal(p.fields.next,'Review');
 }
 const p=parsePacket('PROJECT: One\nGOAL: Keep\nCURRENT STATE: ```text\nPROJECT: Literal\n```\nNEXT STEP: Review');assert.match(p.fields.state,/PROJECT: Literal/);
 assert.equal(parsePacket('PROJECT: One\nGOAL: Keep\nCURRENT STATE:\n> PROJECT: quote').fields.project,'One');
});
test('outer text fence and legacy title-case headings remain supported',()=>{
 const p=parsePacket('```text\nProject: One\nGoal: Keep\nCurrent State: Pending\n```');assert.equal(p.fields.project,'One');assert.equal(p.fields.state,'Pending');
});

test('literal hashes and joined outcome examples are preserved',()=>{
 const p=parsePacket('PROJECT: One\nGOAL: Preserve C ###\nCURRENT STATE:\n```text\nTASK OUTCOME: COMPLETED PRODUCT CHANGES: UNCHANGED\n```');
 assert.equal(p.fields.goal,'Preserve C ###');assert.match(p.fields.state,/TASK OUTCOME: COMPLETED PRODUCT CHANGES/);
 const wrapped=parsePacket('```text\nPROJECT: One\nGOAL: Keep\nCURRENT STATE:\n~~~text\nPROJECT: example\n~~~\nNEXT STEP: Review\n```');assert.equal(wrapped.fields.project,'One');assert.equal(wrapped.fields.next,'Review');
});
