import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readPublishedFeed,localFetch,DISPLAY_FEEDS} from './local-data.mjs';
import {validateDashboard,createRefreshController} from './dashboard.mjs';
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
 assert.equal(feeds['/data.json'].projects.length,49);assert.equal(feeds['/data.json'].instruments.records.length,6);
 assert.equal(feeds['/api/briefings'].records.length,5);assert.equal(feeds['/api/agent-checkpoints'].records.length,9);
 assert.equal(feeds['/api/study'].rollingStudy.cohorts.reduce((n,c)=>n+c.total,0),1826);
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
