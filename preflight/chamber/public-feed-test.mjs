import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readPublishedFeed,localFetch,DISPLAY_FEEDS} from './local-data.mjs';
import {validateDashboard,createRefreshController,freshness,captureStatus,centralTime,publicationNotice,renderProjectTiles,projectWorkspace,renderInstruments} from './dashboard.mjs';
import {render as renderStudy,studyStamp,validateStudy,mountStudy} from './study-view.mjs';
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
 const controller=createRefreshController({load:async()=>{if(fail)throw Error('offline');return structuredClone(original);},onState:s=>state=s,now:()=>Date.parse(original.observedAt)+60000});
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

test('dated captures never become stale solely from crossing 75 minutes',async()=>{
 const original=feeds['/data.json'],before=structuredClone(original),observed=Date.parse(original.observedAt);
 let now=observed,state;
 const controller=createRefreshController({load:async()=>structuredClone(original),now:()=>now,onState:s=>state=s});
 await controller.refresh();
 for(const offset of [75*60000-1,75*60000,75*60000+1,30*86400000]){
  now=observed+offset;controller.tick();assert.equal(state.freshness,'DATED_CAPTURE');assert.equal(state.error,false);
  assert.doesNotMatch(captureStatus(state),/stale|75 minutes|outdated/i);assert.deepEqual(state.data,before);
 }
 assert.equal(centralTime('2026-10-26T15:42:07.333Z'),'October 26 at 10:42 AM Central');
 assert.equal(centralTime('2026-12-26T16:42:07.333Z'),'December 26 at 10:42 AM Central');
});

test('invalid and future control-plane records preserve the last valid capture and recover',async()=>{
 const original=feeds['/data.json'],now=Date.parse(original.observedAt)+60000;
 let next=original,state;const controller=createRefreshController({load:async()=>structuredClone(next),now:()=>now,onState:s=>state=s});
 await controller.refresh();
 for(const observedAt of ['invalid',new Date(now+30001).toISOString()]){
  next={...original,observedAt};await controller.refresh();assert.equal(state.error,true);assert.deepEqual(state.data,original);
  assert.match(captureStatus(state),/update unavailable/);
 }
 next=original;await controller.refresh();assert.equal(state.error,false);
 assert.equal(freshness({observedAt:'invalid'},now),'INVALID_CLOCK');
});

test('study dates stay explicit and schema, checkpoint and clock guards reject invalid replacements',()=>{
 const original=feeds['/api/study'],before=structuredClone(original),now=Math.max(...[original.capturedAt,original.hostedStoredAt,original.rollingStudy.through].map(Date.parse))+86400000;
 assert.equal(validateStudy(original,now),original);
 assert.equal(studyStamp(original),'Study evidence through: October 26 at 11:26 AM Central');
 assert.doesNotMatch(renderStudy(original),/stale|over 75 minutes/i);assert.deepEqual(original,before);
 for(const changed of [
  {...original,schema:'WRONG'},
  {...original,capturedAt:'invalid'},
  {...original,hostedStoredAt:new Date(now+30001).toISOString()},
  {...original,rollingStudy:{...original.rollingStudy,through:'invalid'}},
  {...original,rollingStudy:{...original.rollingStudy,checkpoint:{...original.rollingStudy.checkpoint,savedThrough:'2026-10-25T00:00:00Z'}}}
 ])assert.throws(()=>validateStudy(changed,now));
});

test('mounted study warns on failed refresh, retains evidence and clears warning after recovery',async()=>{
 const original=feeds['/api/study'],now=Math.max(...[original.capturedAt,original.hostedStoredAt,original.rollingStudy.through].map(Date.parse))+30*86400000;
 const node=()=>({innerHTML:'',textContent:'',classList:{warning:false,toggle(k,v){this[k]=v;}},setAttribute(){},style:{},append(){},addEventListener(){},removeEventListener(){}});
 const nodes=Object.fromEntries(['home-view','evidence-view','dialog-continuing-study','study-freshness','refresh'].map(k=>[k,node()]));
 const document={getElementById:id=>nodes[id],createElement:node};let fail=false,count=0;
 const mounted=mountStudy(document,{now:()=>now,fetchImpl:async(route,options)=>{count++;assert.equal(route,'/api/study');assert.equal(options.cache,'no-store');if(fail)throw Error('offline');return {ok:true,json:async()=>structuredClone(original)};}});
 try{
  await new Promise(resolve=>setImmediate(resolve));
  const stamp=nodes['study-freshness'],root=nodes['dialog-continuing-study'];
  assert.equal(stamp.textContent,studyStamp(original));assert.equal(stamp.classList.warning,false);
  fail=true;await mounted.refresh();assert.equal(stamp.classList.warning,true);assert.match(stamp.textContent,/update unavailable/);assert.match(root.innerHTML,/last loaded study/);assert.match(root.innerHTML,/October 26 at 11:26 AM Central/);
  fail=false;await mounted.refresh();assert.equal(stamp.classList.warning,false);assert.equal(stamp.textContent,studyStamp(original));assert.equal(count,3);
 }finally{mounted.destroy();}
});

test('unpublished warning requires confirmed source evidence bound to the displayed cutoff',async()=>{
 const original=feeds['/data.json'],cutoff=original.observedAt,base=Date.parse(cutoff),now=base+3600000;
 const annotation={status:'CONFIRMED_NOT_PUBLISHED',publishedThrough:cutoff,evidenceThrough:new Date(base+60000).toISOString(),verifiedAt:new Date(base+120000).toISOString(),sourceUrl:'https://github.com/smansfield635-create/smansfield635-create.github.io/pull/6867'};
 const pending={...original,confirmedNewerEvidence:annotation};
 assert(publicationNotice(pending,cutoff,now));
 for(const change of [{status:'UNCONFIRMED'},{publishedThrough:'2026-01-01T00:00:00Z'},{evidenceThrough:cutoff},{verifiedAt:cutoff},{verifiedAt:'invalid'},{evidenceThrough:new Date(now+60000).toISOString(),verifiedAt:new Date(now+60000).toISOString()},{sourceUrl:'javascript:alert(1)'},{sourceUrl:'https://user:pass@github.com/owner/repo'}])assert.equal(publicationNotice({...pending,confirmedNewerEvidence:{...annotation,...change}},cutoff,now),null);
 assert.equal(publicationNotice(pending,annotation.evidenceThrough,now),null);
 let next=pending,state,fail=false;
 const controller=createRefreshController({load:async()=>{if(fail)throw Error('offline');return structuredClone(next);},now:()=>now,onState:s=>state=s});
 await controller.refresh();assert.match(captureStatus(state),/Newer evidence confirmed/);
 fail=true;await controller.refresh();assert.match(captureStatus(state),/update unavailable/);assert.deepEqual(state.data,pending);
 fail=false;next=original;await controller.refresh();assert.equal(state.publicationNotice,null);assert.doesNotMatch(captureStatus(state),/Newer evidence/);
 const study=feeds['/api/study'],through=study.rollingStudy.through,t=Date.parse(through),annotated={...study,confirmedNewerEvidence:{...annotation,publishedThrough:through,evidenceThrough:new Date(t+60000).toISOString(),verifiedAt:new Date(t+120000).toISOString()}};
 assert.match(studyStamp(annotated,t+3600000),/Newer evidence confirmed/);assert.match(renderStudy(annotated,t+3600000),/Source evidence/);
 assert.doesNotMatch(studyStamp(study,t+3600000),/Newer evidence/);
});
