import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readPublishedFeed,localFetch,DISPLAY_FEEDS} from './local-data.mjs';
import {validateDashboard,createRefreshController,renderProjectTiles,projectWorkspace,renderInstruments} from './dashboard.mjs';
import {evaluateBriefing,REVIEW_AFTER_MS} from './presentation-guard.mjs';
import {renderProjectBriefing} from './project-briefings.mjs';
import {createEmptyWorkspace,validateWorkspace} from '../app/dist/workspace-bridge.mjs';
const get=name=>JSON.parse(fs.readFileSync(new URL('./data/'+name,import.meta.url)));
const feeds=Object.fromEntries(Object.entries(DISPLAY_FEEDS).map(([route,[file]])=>[route,get(file)]));
for(const route of Object.keys(DISPLAY_FEEDS))test('published reader loads '+route+' without local storage or credentials',async()=>{
 let count=0;const original=structuredClone(feeds[route]);
 const response=await localFetch(route,{request:async(url,options)=>{count++;assert.equal(url.href,new URL('./data/'+DISPLAY_FEEDS[route][0],import.meta.url).href);assert.equal(options.cache,'no-store');assert.equal(options.credentials,'omit');assert.equal(options.redirect,'error');return {ok:true,json:async()=>structuredClone(original)};}});
 assert.deepEqual(await response.json(),original);assert.equal(count,1);
});
test('feed routes are closed and wrong schemas, HTTP errors and invalid JSON reject',async()=>{
 for(const route of ['constructor','__proto__','/api/capture','https://example.com'])await assert.rejects(readPublishedFeed(route,{request:()=>assert.fail('must not request')}));
 for(const request of [async()=>({ok:false}),async()=>({ok:true,json:async()=>({schema:'WRONG'})}),async()=>({ok:true,json:async()=>{throw Error('Invalid JSON')}})])await assert.rejects(readPublishedFeed('/data.json',{request}));
});
test('published snapshots validate together and retain complete source populations',()=>{
 const db=createEmptyWorkspace();db.chamber={schema:'diamondgate.chamber-local.v1',captures:{controlPlane:feeds['/data.json'],study:feeds['/api/study'],briefings:feeds['/api/briefings'],agents:feeds['/api/agent-checkpoints']},links:[],updatedAt:'2026-10-26T00:00:00Z'};
 validateWorkspace(db);validateDashboard(feeds['/data.json']);
 const capture=feeds['/data.json'],briefings=feeds['/api/briefings'].records,agents=feeds['/api/agent-checkpoints'].records;
 const before=structuredClone(feeds);
 for(const rows of [capture.projects,capture.instruments.records,briefings,agents])assert(rows.length>0);
 assert.equal(new Set(capture.projects.map(p=>p.repository+'|'+p.id)).size,capture.projects.length);
 assert.equal(new Set(briefings.map(b=>b.projectId)).size,briefings.length);
 assert.equal(new Set(agents.map(r=>[r.event.projectId,r.event.operationId,r.event.agentId,r.event.phase,r.event.sequence].join('|'))).size,agents.length);
 const tiles=renderProjectTiles(projectWorkspace(capture.projects,briefings));
 const visibleIds=new Set([...capture.projects.map(p=>p.id),...briefings.filter(b=>!capture.projects.some(p=>p.id===b.projectId||(p.id==='PRIVATE_PUBLIC_BRIDGE'&&b.projectId==='OPERATIONS_CHAMBER'))).map(b=>b.projectId)]);
 assert.equal((tiles.match(/class="project-tile/g)||[]).length,visibleIds.size);
 for(const id of visibleIds)assert(tiles.includes('data-project="'+id+'"'));
 assert.equal((renderInstruments(capture.instruments.records).match(/class="run-card"/g)||[]).length,capture.instruments.records.length);
 const study=feeds['/api/study'].rollingStudy;
 assert(study.cohorts.length>0);assert.equal(study.through,study.checkpoint.savedThrough);
 for(const c of study.cohorts){for(const key of ['total','SUPPORT','STANDARD','PARAMOUNT','UNRESOLVED','materialUnits'])assert(Number.isSafeInteger(c[key])&&c[key]>=0);assert.equal(c.total,c.SUPPORT+c.STANDARD+c.PARAMOUNT+c.UNRESOLVED);assert.equal(c.materialUnits,c.STANDARD+c.PARAMOUNT);}
 assert.deepEqual(feeds,before);
 assert.equal(feeds['/api/agent-checkpoints'].continuation,undefined);
});
test('refresh retains last good capture on source failure without changing evidence dates',async()=>{
 let fail=false,state;const original=feeds['/data.json'];
 const controller=createRefreshController({load:async()=>{if(fail)throw Error('offline');return structuredClone(original);},onState:s=>state=s,now:()=>Date.parse('2026-10-26T00:00:00Z')});
 await controller.refresh();assert.equal(state.data.observedAt,original.observedAt);fail=true;await controller.refresh();assert(state.error);assert.deepEqual(state.data,original);
});
test('published feed values exclude credentials, raw files and non-display continuation',()=>{
 const check=v=>{if(typeof v==='string')assert.doesNotMatch(v,/github_pat_|gh[pousr]_[A-Za-z0-9]{20}|sk-proj-|-----BEGIN .*PRIVATE KEY|Bearer\s+[A-Za-z0-9._-]{20}/);else if(v&&typeof v==='object')for(const [key,value]of Object.entries(v)){assert(!/^(password|token|secret|privateKey|raw|content|fileContents|drafts|inbox|continuation)$/i.test(key),key);check(value);}};
 Object.values(feeds).forEach(check);
 const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');assert(html.includes("connect-src 'self'"));
});

test('refresh accepts a later source record without rewriting its observation time',async()=>{
 const original=feeds['/data.json'],later=structuredClone(original);
 later.observedAt=new Date(Date.parse(original.observedAt)+60000).toISOString();
 let next=original,state;
 const controller=createRefreshController({load:async()=>structuredClone(next),onState:s=>state=s,now:()=>Date.parse(later.observedAt)+60000});
 await controller.refresh();next=later;await controller.refresh();
 assert.deepEqual(state.data,later);assert.equal(state.data.observedAt,later.observedAt);
});

test('record age changes next-step caution without changing evidence or authorizing execution',()=>{
 const record=structuredClone(feeds['/api/briefings'].records.find(r=>r.nextStep.basis==='PROPOSED_NEXT_STEP'));
 const before=structuredClone(record),observed=Date.parse(record.observedAt);
 const initial=renderProjectBriefing(record,observed);
 const facts=html=>html.slice(html.indexOf('<div class="brief-facts">'),html.indexOf('<details class="brief-instruments">'));
 for(const [offset,expected]of [[REVIEW_AFTER_MS-1,'SOURCE_REVIEWED'],[REVIEW_AFTER_MS,'SOURCE_REVIEWED'],[REVIEW_AFTER_MS+1,'SOURCE_CHECK_AGED']]){
  const review=evaluateBriefing(record,{nowMs:observed+offset});
  assert.equal(review.state,expected);assert.equal(review.executionAuthorized,false);
  assert.equal(review.sourceCheckedAt,record.observedAt);assert.equal(review.historicalNextStep,record.nextStep.text);
  const rendered=renderProjectBriefing(record,observed+offset);
  assert.equal(facts(rendered),facts(initial));
  assert(rendered.includes('Latest verified accomplishment'));
  assert(rendered.includes(record.sourceHeads[0].head));
  if(expected==='SOURCE_CHECK_AGED'){
   assert.equal(review.proposedNextStep,null);
   assert(rendered.includes('Recorded next step · reconcile before execution'));
   assert(rendered.includes('Age alone does not establish a project change.'));
  }
 }
 assert.deepEqual(record,before);
});

test('age wording preserves failed-read, verified-change, invalid and future-time safeguards',()=>{
 const record=structuredClone(feeds['/api/briefings'].records.find(r=>r.nextStep.basis==='PROPOSED_NEXT_STEP'));
 const observed=Date.parse(record.observedAt),nowMs=observed+REVIEW_AFTER_MS+1;
 const options=[
  {sourceReadStatus:'READ_FAILED',state:'SOURCE_CHECK_UNAVAILABLE'},
  {linkedDependencies:['test'],verifiedDependencyEvents:[{projectId:record.projectId,status:'CHANGED_VERIFIED',sourceReadStatus:'READ_OK',dependencyKey:'test',observedAt:new Date(observed+1).toISOString()}],state:'REVALIDATION_REQUIRED'}
 ];
 for(const {state,...option}of options){const review=evaluateBriefing(record,{nowMs,...option});assert.equal(review.state,state);assert.equal(review.executionAuthorized,false);assert.equal(review.proposedNextStep,null);}
 for(const observedAt of ['invalid',new Date(nowMs+6*60000).toISOString()]){const review=evaluateBriefing({...record,observedAt},{nowMs});assert.equal(review.state,'UNKNOWN');assert.equal(review.executionAuthorized,false);}
});
