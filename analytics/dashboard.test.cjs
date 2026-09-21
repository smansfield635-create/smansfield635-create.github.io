const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {validate,freshness,createController,POLL_MS}=require('./dashboard.js');
const base=JSON.parse(fs.readFileSync(__dirname+'/data/latest.json','utf8'));
const instant=Date.parse(base.generatedAt)+60000;
const copy=()=>structuredClone(base);
test('snapshot totals and time must be valid',()=>{
 assert.equal(validate(copy(),instant).summary.pageLoads,base.summary.pageLoads);
 for (const change of [d=>d.summary.nonBotPageLoads++,d=>d.summary.pageLoads=null,d=>d.generatedAt='garbage',d=>d.generatedAt=new Date(instant+3600000).toISOString(),d=>d.topPages[0].pageLoads=-1,d=>d.window30d.start=d.window30d.end]) {
  const d=copy();change(d);assert.throws(()=>validate(d,instant));
 }
});
test('fresh check cannot make old source data current',()=>{
 assert.equal(freshness(base,instant,false).state,'current');
 assert.equal(freshness(base,instant+7200000,false).state,'delayed');
 assert.equal(freshness(base,instant,true).state,'unavailable');
 assert.equal(freshness(null,instant,true).state,'unavailable');
 assert.equal(POLL_MS,60000);
});
test('unchanged, newer, malformed, failure and recovery preserve correct snapshot',async()=>{
 let response=copy(),broken=false,rendered=[],reports=[];
 const controller=createController({now:()=>instant+60000,fetchSnapshot:async()=>{if(broken)throw Error('network');return response;},render:d=>rendered.push(structuredClone(d)),report:d=>reports.push(d)});
 await controller.refresh();await controller.refresh();assert.equal(rendered.length,1);
 response=copy();response.generatedAt=new Date(instant).toISOString();response.window30d.end=response.generatedAt;response.summary.pageLoads+=5;response.summary.nonBotPageLoads+=5;
 await controller.refresh();assert.equal(rendered.length,2);
 const good=structuredClone(response);response={};await controller.refresh();assert.equal(reports.at(-1).error,true);assert.deepEqual(reports.at(-1).snapshot,good);
 broken=true;await controller.refresh();assert.deepEqual(reports.at(-1).snapshot,good);
 broken=false;response=good;await controller.refresh();assert.equal(reports.at(-1).error,false);assert.equal(rendered.length,2);
 response=copy();await controller.refresh();assert.equal(reports.at(-1).error,true);assert.deepEqual(reports.at(-1).snapshot,good);
});
test('overlapping requests are suppressed and failures release in-flight state',async()=>{
 let release,calls=0;
 const controller=createController({now:()=>instant,fetchSnapshot:()=>{calls++;return new Promise(r=>release=r)},render:()=>{},report:()=>{}});
 const first=controller.refresh();await controller.refresh();assert.equal(calls,1);release(copy());await first;
 const second=controller.refresh();assert.equal(calls,2);release(copy());await second;
});
test('daily history rejects invalid dates, duplicate dates and invalid values',()=>{
 for (const daily of [[{date:'bad',pageLoads:2}],[{date:'2026-02-31',pageLoads:2}],[{date:'2026-09-20',pageLoads:-2}],[{date:'2026-09-20',pageLoads:2},{date:'2026-09-20',pageLoads:2}]]){
 const d=copy();d.daily=daily;assert.throws(()=>validate(d,instant));
 }
});
test('automatic delivery is scoped to successful collector completion and current main',()=>{
 const s=fs.readFileSync(__dirname+'/../.github/workflows/pages-current-head-publisher.yml','utf8');
 assert.match(s,/workflow_run:/);assert.match(s,/workflows: \['Cloudflare Analytics Read-Only Bridge'\]/);assert.match(s,/conclusion == 'success'/);assert.match(s,/head_repository.full_name == github.repository/);assert.match(s,/head_branch == 'main'/);assert.match(s,/commits\/main/);assert.match(s,/pages-exact-head-deploy-v3.yml/);assert.doesNotMatch(s,/^  push:/m);
});

test('a failed initial request recovers without a reload',async()=>{
 let bad=true,draws=0,state;
 const c=createController({now:()=>instant,fetchSnapshot:async()=>{if(bad)throw Error('timeout');return copy()},render:()=>draws++,report:s=>state=s});
 await c.refresh();assert.equal(state.snapshot,null);assert.equal(state.error,true);assert.equal(draws,0);
 bad=false;await c.refresh();assert.equal(state.error,false);assert.equal(draws,1);
});
test('new generated time cannot conceal a regressive reporting end',async()=>{
 let payload=copy(),state;
 const c=createController({now:()=>instant,fetchSnapshot:async()=>payload,render:()=>{},report:s=>state=s});
 await c.refresh();payload=copy();payload.generatedAt=new Date(instant).toISOString();payload.window30d.end=new Date(Date.parse(base.window30d.end)-60000).toISOString();await c.refresh();assert.equal(state.error,true);assert.equal(state.snapshot.window30d.end,base.window30d.end);
});

test('daily history, when present, covers exactly 30 consecutive UTC dates through the reporting end',()=>{
 const d=copy(),last=Date.parse(d.window30d.end.slice(0,10));
 d.daily=Array.from({length:30},(_,i)=>({date:new Date(last-(29-i)*86400000).toISOString().slice(0,10),pageLoads:i}));
 assert.equal(validate(d,instant).daily.length,30);
 for(const daily of [[],d.daily.slice(1),d.daily.map((x,i)=>i===29?{...x,date:'2099-01-01'}:x),d.daily.map((x,i)=>i===0?{...x,date:'1900-01-01'}:x)]){const bad=copy();bad.daily=daily;assert.throws(()=>validate(bad,instant));}
});
