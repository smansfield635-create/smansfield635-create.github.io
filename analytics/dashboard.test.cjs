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
const {compareWeeks,safeDestination,groupPages,groupReferrers}=require('./dashboard.js');
const days=()=>Array.from({length:30},(_,i)=>({date:new Date(Date.UTC(2026,8,1+i)).toISOString().slice(0,10),pageLoads:i<22?10:i<29?20:9999}));
test('weekly comparison uses equal complete UTC periods and ignores the partial day',()=>{const result=compareWeeks(days());assert.equal(result.total,140);assert.equal(result.baseline,70);assert.equal(result.percent,100);assert.equal(result.currentStart,'2026-09-23');assert.equal(result.currentEnd,'2026-09-29');assert.equal(result.previousStart,'2026-09-16');assert.equal(result.previousEnd,'2026-09-22');assert.equal(compareWeeks(undefined),null)});
test('weekly comparison handles zero baselines and decline without misleading percentages',()=>{const d=days().map(x=>({...x,pageLoads:0}));assert.equal(compareWeeks(d).percent,null);assert.equal(compareWeeks(d).delta,0);d[28].pageLoads=12;assert.equal(compareWeeks(d).total,12);assert.equal(compareWeeks(d).percent,null);d[21].pageLoads=24;assert.equal(compareWeeks(d).percent,-50)});
test('destination links reject foreign origins, backslashes, controls and executable URLs',()=>{for(const value of ['//evil.example','/\\evil.example','javascript:alert(1)','https://evil.example','/x\n//evil.example'])assert.equal(safeDestination(value),null);assert.equal(safeDestination('/products/education/'),'/products/education/');assert.equal(safeDestination('/a%20b'),'/a%20b')});
test('homepage aggregation conserves counts and original source paths',()=>{const rows=[{path:'/',pageLoads:10},{path:'/index.html',pageLoads:4},{path:'/products/education/',pageLoads:8},{path:'//evil.example',pageLoads:2}];const grouped=groupPages(rows);assert.equal(grouped[0].label,'Home');assert.equal(grouped[0].value,14);assert.equal(grouped[0].sources.length,2);assert.equal(grouped.find(x=>x.key==='//evil.example').href,null);assert.equal(grouped.reduce((n,x)=>n+x.value,0),24)});
test('referrer grouping combines only exact platform domains and preserves reported contributions',()=>{const grouped=groupReferrers([{host:'m.facebook.com',visits:4},{host:'lm.facebook.com',visits:1},{host:'facebook.com.evil.example',visits:2},{host:'notfacebook.com',visits:3},{host:'(none)',visits:12}]);assert.equal(grouped.find(x=>x.label==='Facebook').value,5);assert.equal(grouped.find(x=>x.label==='Facebook').sources.length,2);assert.equal(grouped.length,4);assert.equal(grouped.reduce((n,x)=>n+x.value,0),22)});

test('normalized dot segments cannot turn a local path into a foreign-origin link',()=>{for(const value of ['/a/..//evil.example','/%2e%2e//evil.example'])assert.equal(safeDestination(value),null)});

const {reportingWindow}=require('./dashboard.js');
test('rolling window labels preserve UTC timestamps across viewer timezones',()=>{
 const {execFileSync}=require('node:child_process');
 const window={start:'2026-08-23T00:15:00Z',end:'2026-09-22T00:15:00Z'};
 const script='process.stdout.write(require('+JSON.stringify(__dirname+'/dashboard.js')+').reportingWindow('+JSON.stringify(window)+',"en-US"))';
 for(const TZ of ['America/Chicago','Pacific/Honolulu','Asia/Tokyo']){
  const label=execFileSync(process.execPath,['-e',script],{env:{...process.env,TZ},encoding:'utf8'});
  assert.equal(label,'Aug 23, 2026, 00:15 – Sep 22, 2026, 00:15 UTC');
 }
});
test('reporting labels retain year boundaries and do not substitute daily chart dates',()=>{
 const window={start:'2025-12-15T20:46:00Z',end:'2026-01-14T20:46:00Z'};
 assert.equal(reportingWindow(window,'en-US'),'Dec 15, 2025, 20:46 – Jan 14, 2026, 20:46 UTC');
 const chartStart=new Date(Date.parse('2026-01-14T00:00:00Z')-29*86400000).toISOString().slice(0,10);
 assert.equal(chartStart,'2025-12-16');
 assert.equal(window.start,'2025-12-15T20:46:00Z');
});
