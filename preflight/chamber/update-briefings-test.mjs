import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateBriefings,prepareBriefingUpdate} from './update-briefings.mjs';
const nowMs=Date.parse('2026-10-26T16:00:00Z');
const fact=basis=>({text:'Source-reviewed display summary',basis,sources:[{label:'Exact source',url:'https://github.com/example/project/commit/'+'a'.repeat(40)}]});
const record=projectId=>({projectId,observedAt:'2026-10-25T12:00:00Z',sourceHeads:[{repository:'example/project',head:'a'.repeat(40)}],accomplishment:fact('VERIFIED_RECORD'),publication:fact('NOT_ESTABLISHED'),unfinished:fact('VERIFIED_RECORD'),blocker:fact('NOT_ESTABLISHED'),nextStep:fact('PROPOSED_NEXT_STEP'),instruments:[]});
const feed=()=>({schema:'DGB_PROJECT_BRIEFINGS_v1',updatedAt:'2026-10-25T12:00:00Z',records:[record('PROJECT_ONE'),record('PROJECT_TWO')]});
test('one reviewed event replaces only its project and does not manufacture source dates',()=>{
 const base=feed(),before=structuredClone(base),replacement=record('PROJECT_ONE');
 replacement.observedAt='2026-10-26T15:00:00Z';replacement.accomplishment.text='Verified project update';
 const next=prepareBriefingUpdate(base,replacement,{nowMs});
 assert.deepEqual(base,before);assert.deepEqual(next.records[0],replacement);assert.deepEqual(next.records[1],before.records[1]);
 assert.equal(next.updatedAt,new Date(nowMs).toISOString());assert.equal(next.records[0].observedAt,replacement.observedAt);
 replacement.accomplishment.text='Later edit';assert.equal(next.records[0].accomplishment.text,'Verified project update');
});
test('unchanged event is a no-op and a new project requires explicit identity disposition',()=>{
 const base=feed();assert.deepEqual(prepareBriefingUpdate(base,base.records[0],{nowMs}),base);
 const reordered=Object.fromEntries(Object.entries(base.records[0]).reverse());
 reordered.accomplishment=Object.fromEntries(Object.entries(reordered.accomplishment).reverse());
 assert.deepEqual(prepareBriefingUpdate(base,reordered,{nowMs}),base);
 assert.throws(()=>prepareBriefingUpdate(base,record('PROJECT_NEW'),{nowMs}),/Unknown project/);
 const next=prepareBriefingUpdate(base,record('PROJECT_NEW'),{nowMs,allowNew:true});
 assert.deepEqual(next.records.slice(0,2),base.records);assert.equal(next.records.length,3);
});
test('older source observations and reversed packaging clocks fail without changing input',()=>{
 const base=feed(),before=structuredClone(base),r=record('PROJECT_ONE');r.observedAt='2026-10-24T12:00:00Z';
 assert.throws(()=>prepareBriefingUpdate(base,r,{nowMs}),/Older source/);
 r.observedAt=base.records[0].observedAt;r.accomplishment.text='Correction';
 assert.throws(()=>prepareBriefingUpdate(base,r,{nowMs:Date.parse(base.updatedAt)-1000}),/Packaging clock/);assert.deepEqual(base,before);
});
test('invalid, duplicate, unsafe and non-display records are rejected',()=>{
 const mutations=[
  x=>x.records.push(structuredClone(x.records[0])),
  x=>x.records[0].sourceHeads[0].head='main',
  x=>x.records[0].sourceHeads.push(structuredClone(x.records[0].sourceHeads[0])),
  x=>x.records[0].observedAt='2026-02-30T12:00:00Z',
  x=>x.records[0].observedAt='2026-10-27T12:00:00Z',
  x=>x.records[0].accomplishment.sources[0].url='javascript:alert(1)',
  x=>x.records[0].accomplishment.sources[0].url='https://user:password@github.com/example/project',
  x=>x.records[0].accomplishment.sources[0].url='https://github.com/example/project?token=hidden',
  x=>x.records[0].accomplishment.sources=[],
  x=>x.records[0].accomplishment.text='github_pat_'+'x'.repeat(30),
  x=>x.records[0].raw='private source',
  x=>x.records[0].nextStep.basis='VERIFIED_RECORD',
  x=>x.records[0].instruments=[{name:'tool',use:'display',result:{text:'missing proof',basis:'VERIFIED_RECORD',sources:[]}}]
 ];
 for(const mutate of mutations){const value=feed();mutate(value);assert.throws(()=>validateBriefings(value,{nowMs}));}
});
test('committed briefing payload meets strict display and provenance validation',()=>{
 validateBriefings(JSON.parse(fs.readFileSync(new URL('./data/briefings.json',import.meta.url))));
});
