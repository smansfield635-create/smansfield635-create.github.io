import test from 'node:test';
import assert from 'node:assert/strict';
import {createHEarthLoadingScreen} from '../showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js';
function harness(clipboard){
 const nodes=new Map(),frames=[];let time=100;
 const node=()=>({dataset:{},style:{},hidden:false,disabled:false,value:'',listeners:{},children:[],setAttribute(k,v){this[k]=v;if(k.startsWith('data-'))nodes.set(`[${k}]`,this);},addEventListener(k,f){this.listeners[k]=f;},appendChild(n){this.children.push(n);},focus(){this.focused=true;},select(){this.selected=true;},querySelector(k){if(!nodes.has(k))nodes.set(k,node());return nodes.get(k);}});
 const shell=node();nodes.set('[data-enter]',{...node(),disabled:true});
 const document={createElement:node,getElementById:()=>shell,body:node(),defaultView:{navigator:{clipboard},setInterval:()=>1,clearInterval(){}}};
 const loader=createHEarthLoadingScreen({document,now:()=>time,requestFrame:f=>frames.push(f),schedule:()=>1,cancelSchedule(){}});
 return {loader,nodes,frames,body:document.body,shell,setTime:t=>time=t};
}
const pose=sequence=>({sequence,position:{x:sequence,y:0,z:0},yawDegrees:0,pitchDegrees:0,verticalFovDegrees:60});

test('copy success writes valid report without changing loading readiness',async()=>{
 let copied;const h=harness({writeText:async text=>{copied=text;}});h.setTime(600);h.loader.update({phase:'FETCH',completed:2,total:4});h.loader.setReportProvider(()=>({marker:42}));
 const before=h.loader.getReceipt();assert.equal(await h.loader.copyLoadingReport(),true);
 const report=JSON.parse(copied);assert.equal(report.mode,'preparing');assert.equal(report.elapsedMilliseconds,500);assert.equal(report.details.marker,42);assert.equal(report.workUnits[0].completed,2);
 assert.deepEqual(h.loader.getReceipt(),before);assert.equal(h.nodes.get('[data-loading-report-text]').hidden,true);assert.match(h.nodes.get('[data-loading-report-status]').textContent,/copied/i);
});
for(const [name,clipboard] of [['denied',{writeText:async()=>{throw Error('NotAllowedError');}}],['absent',{}]])test(`clipboard ${name} exposes selectable report without changing readiness`,async()=>{
 const h=harness(clipboard),before=h.loader.getReceipt();assert.equal(await h.loader.copyLoadingReport(),false);
 const text=h.nodes.get('[data-loading-report-text]');assert.equal(text.hidden,false);assert.ok(text.focused&&text.selected);assert.equal(JSON.parse(text.value).mode,'preparing');assert.deepEqual(h.loader.getReceipt(),before);
});

test('report preserves controls-ready preparation duration while elapsed time advances',async()=>{
 const h=harness({writeText:async()=>{}});h.setTime(1100);h.loader.enableControls(pose(0));h.setTime(10100);
 assert.equal(h.loader.getLoadingReport().mode,'test');assert.equal(h.loader.getLoadingReport().preparationMilliseconds,1000);assert.equal(h.loader.getLoadingReport().elapsedMilliseconds,10000);
 const before=h.loader.getReceipt();await h.loader.copyLoadingReport();assert.deepEqual(h.loader.getReceipt(),before);assert.equal(h.nodes.get('[data-enter]').disabled,true);
 h.loader.observeInput({accepted:true},pose(1));h.loader.observePresentation(pose(1),{navigationSequence:1});h.frames.shift()();
 assert.equal(h.loader.getLoadingReport().mode,'ready');const ready=h.loader.getReceipt();await h.loader.copyLoadingReport();assert.deepEqual(h.loader.getReceipt(),ready);assert.equal(h.loader.getLoadingReport().preparationMilliseconds,1000);
});

test('failed preparation remains failed and report retains original failure time',async()=>{
 const h=harness({writeText:async()=>{}});h.setTime(2100);h.loader.fail(Error('STARTUP_ASSET_FAILED:/grass.bin:offline'));h.setTime(9100);
 const before=h.loader.getReceipt();await h.loader.copyLoadingReport();const report=h.loader.getLoadingReport();
 assert.equal(report.mode,'failed');assert.equal(report.preparationMilliseconds,2000);assert.equal(report.elapsedMilliseconds,9000);assert.match(report.failure.message,/grass.bin/);assert.deepEqual(h.loader.getReceipt(),before);assert.equal(h.nodes.get('[data-enter]').disabled,true);
});

test('diagnostic provider failure is reported without preventing copy',async()=>{
 let copied;const h=harness({writeText:async text=>copied=text});h.loader.setReportProvider(()=>{throw Error('diagnostic unavailable');});
 assert.equal(await h.loader.copyLoadingReport(),true);assert.equal(JSON.parse(copied).details.diagnosticError,'diagnostic unavailable');assert.equal(h.loader.getReceipt().mode,'preparing');
});

test('report stage and work snapshots cannot mutate loader receipt',()=>{
 const h=harness({});h.loader.beginStage('vegetation','Loading');h.loader.update({phase:'FETCH',completed:2,total:4});const before=h.loader.getReceipt();const report=h.loader.getLoadingReport();
 report.stages[0].stage='changed';report.workUnits[0].completed=999;report.phaseObservations['vegetation:FETCH'].firstObservedMilliseconds=-1;
 assert.deepEqual(h.loader.getReceipt(),before);
});

 test('report remains usable after entry and reads current asset state',async()=>{
 let copied,state='LOADING';const h=harness({writeText:async text=>copied=text});h.loader.setReportProvider(()=>({importedPlants:{state}}));
 h.loader.enableControls(pose(0));h.loader.observeInput({accepted:true},pose(1));h.loader.observePresentation(pose(1),{navigationSequence:1});h.frames.shift()();h.nodes.get('[data-enter]').listeners.click();
 assert.equal(h.shell.hidden,true);assert.ok(h.body.children.some(n=>n.style.cssText?.includes('position:fixed')));
 state='READY';assert.equal(await h.loader.copyLoadingReport(),true);assert.equal(JSON.parse(copied).details.importedPlants.state,'READY');
 });

test('entry timing remains distinct from copied elapsed and scene resource timing',()=>{
 const h=harness({});h.setTime(2100);h.loader.enableControls(pose(0));h.setTime(3100);h.loader.observeInput({accepted:true},pose(1));h.setTime(3200);h.loader.observePresentation(pose(1),{navigationSequence:1});h.frames.shift()();h.setTime(4000);h.nodes.get('[data-enter]').listeners.click();h.setTime(9000);
 const r=h.loader.getLoadingReport();assert.equal(r.entryTiming.controlsReady,2000);assert.equal(r.entryTiming.firstChangedViewSubmitted,3100);assert.equal(r.entryTiming.loaderDismissed,3900);assert.equal(r.elapsedMilliseconds,8900);assert.match(r.timingDefinitions.preparation,/does not include all imported plants/);
});
