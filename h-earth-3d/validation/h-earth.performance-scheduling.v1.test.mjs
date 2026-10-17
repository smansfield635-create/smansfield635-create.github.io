import test from 'node:test';
import assert from 'node:assert/strict';
import {createFramePresenter,uploadInSlices} from '../../showroom/globe/h-earth/render/performance-scheduling.v1.js';
import {installHEarthRun8ER3D2PointerTouchIntake} from '../../showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js';

function animation(){let id=0;const queue=new Map();return {request:fn=>{queue.set(++id,fn);return id;},cancel:id=>queue.delete(id),tick:time=>{const batch=[...queue.values()];queue.clear();batch.forEach(fn=>fn(time));},size:()=>queue.size};}
test('coalescing preserves actual intake substeps, proposals and final poses under slow frames',async()=>{
 class Surface{style={};clientWidth=960;clientHeight=540;listeners=new Map();addEventListener(t,f){this.listeners.set(t,f);}removeEventListener(t){this.listeners.delete(t);}setPointerCapture(){}emit(t,d){this.listeners.get(t)?.({preventDefault(){},pointerType:'touch',...d});}}
 const originals=Object.fromEntries(['HTMLElement','document','location','requestAnimationFrame','cancelAnimationFrame','performance'].map(k=>[k,globalThis[k]]));
 try{
  globalThis.HTMLElement=Surface;globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};globalThis.location={search:'?arrival=approved-four-trees'};
  for(const mode of ['TURN','TRAVEL'])for(const elapsed of [16.6667,50,100,150,250]){
   const run=async coalesce=>{
    const raf=animation();let clock=0;globalThis.performance={now:()=>clock};globalThis.requestAnimationFrame=raf.request;globalThis.cancelAnimationFrame=raf.cancel;
    const proposals=[],draws=[],presenter=createFramePresenter({present:s=>draws.push(structuredClone(s)),requestFrame:raf.request,cancelFrame:raf.cancel});
    const surface=new Surface(),intake=installHEarthRun8ER3D2PointerTouchIntake({surface,onProposal:(p,s)=>{proposals.push(structuredClone(p));if(coalesce)presenter.request(s);else draws.push(structuredClone(s));}});
    surface.emit('pointerdown',{pointerId:1,clientX:400,clientY:300});
    if(mode==='TURN')surface.emit('pointermove',{pointerId:1,clientX:560,clientY:300});
    else{surface.emit('pointerdown',{pointerId:2,clientX:500,clientY:300});surface.emit('pointermove',{pointerId:1,clientX:400,clientY:200});surface.emit('pointermove',{pointerId:2,clientX:500,clientY:200});}
    clock=elapsed;raf.tick(clock);await Promise.resolve();
    const state=structuredClone(intake.getNavigationState());presenter.flush();intake.destroy();presenter.cancel();return {state,proposals,draws};
   };
   const old=await run(false),next=await run(true);
   assert.deepEqual(next.state,old.state);assert.deepEqual(next.proposals,old.proposals);assert.equal(next.proposals.length,Math.ceil(Math.min(elapsed/1000,.15)/.05));assert.equal(next.draws.length,1);assert.deepEqual(next.draws[0],old.draws.at(-1));
  }
 }finally{for(const [k,v]of Object.entries(originals)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}}
});
test('presentation failure cannot emit success; cancel and flush leave no stale pose',()=>{
 const raf=animation();let successes=0;const p=createFramePresenter({present:()=>{throw Error('GL failure');},requestFrame:raf.request,cancelFrame:raf.cancel,onPresented:()=>successes++});
 p.request({sequence:1});assert.throws(()=>raf.tick(1),/GL failure/);assert.equal(successes,0);p.request({sequence:2});p.cancel();assert.equal(raf.size(),0);assert.equal(p.flush(),null);
});
test('uploads preserve offsets/bytes with strict byte slices and time checks between atomic calls',async()=>{
 const items=Array.from({length:100},(_,i)=>({first:i*4,packed:new Float32Array([i,i+.5,-i,1])})),before=items.map(i=>Buffer.from(i.packed.buffer).toString('hex'));
 let clock=0,yields=0;const calls=[],progress=[];
 const receipt=await uploadInSlices(items,{maxBytes:64,maxMilliseconds:3,now:()=>clock,upload:t=>{calls.push({offset:t.first*4,hex:Buffer.from(t.packed.buffer).toString('hex')});clock+=1.25;},yieldControl:async()=>{yields++;clock+=16;},onProgress:p=>progress.push(p)});
 assert.deepEqual(calls.map(c=>c.hex),before);assert.deepEqual(calls.map(c=>c.offset),items.map(t=>t.first*4));assert.equal(receipt.uploadedBytes,1600);assert.ok(receipt.maxSliceBytes<=64);assert.ok(receipt.maxSliceMilliseconds<=receipt.maxMilliseconds+receipt.maxAtomicMilliseconds);assert.equal(yields,33);assert.equal(progress.at(-1).completed,100);
 assert.deepEqual(items.map(i=>Buffer.from(i.packed.buffer).toString('hex')),before);
});
test('byte limit alone batches many small tiles and oversized tile fails before mutation',async()=>{
 let uploads=0,yields=0;
 const items=Array.from({length:1621},()=>({packed:new Float32Array(4)}));
 const r=await uploadInSlices(items,{now:()=>0,maxBytes:256,upload:()=>uploads++,yieldControl:async()=>yields++});
 assert.equal(uploads,1621);assert.equal(yields,101);assert.equal(r.maxSliceBytes,256);
 uploads=0;await assert.rejects(uploadInSlices([{packed:new Float32Array(100)}],{maxBytes:32,upload:()=>uploads++,yieldControl:async()=>{}}),/EXCEEDS_BYTE/);assert.equal(uploads,0);
});

// Minimal DOM harness isolates readiness from WebGL and browser display claims.
import {createHEarthLoadingScreen} from '../../showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js';
function loadingHarness(){
 const nodes=new Map();for(const key of ['[data-loading-activity]','[data-loading-progress]','[data-loading-units]','[data-loading-instructions]','button'])nodes.set(key,{textContent:'',hidden:false,disabled:true,addEventListener(type,fn){this[type]=fn;}});
 const shell={setAttribute(){},dataset:{},querySelector:key=>nodes.get(key)},raf=animation();let clock=0,entries=0;
 const loader=createHEarthLoadingScreen({document:{createElement:()=>shell,body:{appendChild(){}}},now:()=>++clock,requestFrame:raf.request,onEnter:()=>entries++});
 return {loader,nodes,shell,raf,entries:()=>entries,button:nodes.get('button')};
}
const cameraState=(sequence,x=0)=>({sequence,position:{x,y:1,z:0},yawDegrees:0,pitchDegrees:0,verticalFovDegrees:56});
test('loader percentages use explicit per-phase work and never regress within that phase',()=>{
 const {loader,nodes}=loadingHarness(),bar=nodes.get('[data-loading-progress]');
 loader.update({phase:'ROOTS',completed:5,total:10,unit:'roots'});loader.update({phase:'ROOTS',completed:3,total:10,unit:'roots'});assert.equal(bar.value,5);assert.equal(bar.max,10);
 loader.update({phase:'UNKNOWN',progress:99});assert.equal(bar.hidden,true);
 loader.beginStage('upload','Uploading');loader.update({phase:'UPLOAD',completed:1,total:4,unit:'tiles'});assert.equal(bar.value,1);assert.equal(bar.max,4);
 loader.update({phase:'ROOTS',completed:1,total:10,unit:'roots'});assert.equal(bar.value,1); // Different stage, separately measured work.
 loader.update({phase:'INVALID',completed:12,total:10});assert.equal(bar.hidden,true);
});
test('loader rejects absent, rejected, unchanged and mismatched input presentations',()=>{
 const {loader,raf,button,entries}=loadingHarness();loader.enableControls(cameraState(1));
 loader.observePresentation(cameraState(1),{navigationSequence:1});button.click();assert.equal(entries(),0);assert.equal(raf.size(),0);
 loader.observeInput({accepted:false},cameraState(2,1));loader.observePresentation(cameraState(2,1),{navigationSequence:2});assert.equal(raf.size(),0);
 loader.observeInput({accepted:true},cameraState(2));loader.observePresentation(cameraState(2),{navigationSequence:2});assert.equal(raf.size(),0);
 loader.observeInput({accepted:true},cameraState(3,1));
 loader.observePresentation(cameraState(2,1),{navigationSequence:2});assert.equal(raf.size(),0);
 loader.observePresentation(cameraState(3,2),{navigationSequence:3});assert.equal(raf.size(),0);
 loader.observePresentation(cameraState(3,1),{navigationSequence:4});assert.equal(raf.size(),0);assert.equal(button.disabled,true);
});
test('Enter waits for successful changed-pose submission and next frame opportunity; receipt is isolated',()=>{
 const {loader,raf,button,entries,shell}=loadingHarness();loader.enableControls(cameraState(1));const changed=cameraState(2,1);
 loader.observeInput({accepted:true},changed);
 const p=createFramePresenter({present:s=>({frameSequence:7,navigationSequence:s.sequence}),requestFrame:raf.request,cancelFrame:raf.cancel,onPresented:loader.observePresentation});
 p.request(changed);raf.tick(1);assert.equal(button.disabled,true);assert.equal(raf.size(),1);button.click();assert.equal(entries(),0);
 raf.tick(2);assert.equal(button.disabled,false);button.click();assert.equal(entries(),1);assert.equal(shell.hidden,true);
 const r=loader.getReceipt();assert.ok(r.controlsEnabledMilliseconds<r.firstInputCameraChangeMilliseconds);assert.ok(r.firstInputCameraChangeMilliseconds<r.firstInputPoseRenderedMilliseconds);assert.ok(r.firstInputPoseRenderedMilliseconds<r.nextAnimationFrameOpportunityMilliseconds);assert.ok(r.nextAnimationFrameOpportunityMilliseconds<r.loaderDismissedMilliseconds);
 assert.equal(r.gpuExecutionVerified,false);assert.equal(r.displayedPixelsVerified,false);assert.equal(r.firstConsistentlyResponsiveTraversalMilliseconds,null);
 r.firstInputPose.pose='MUTATED';r.firstInputPresentedFrame.navigationSequence=-1;assert.notEqual(loader.getReceipt().firstInputPose.pose,'MUTATED');assert.equal(loader.getReceipt().firstInputPresentedFrame.navigationSequence,2);
});
test('failed present cannot unlock loader and failures stay visible before or after submission',()=>{
 for(const afterSubmit of [false,true]){
  const {loader,raf,button,entries,shell,nodes}=loadingHarness();loader.enableControls(cameraState(1));const changed=cameraState(2,1);loader.observeInput({accepted:true},changed);
  if(afterSubmit){loader.observePresentation(changed,{navigationSequence:2});assert.equal(raf.size(),1);}
  else{
   const presenter=createFramePresenter({present:()=>{throw Error('GL failure');},requestFrame:raf.request,cancelFrame:raf.cancel,onPresented:loader.observePresentation});
   presenter.request(changed);assert.throws(()=>raf.tick(1),/GL failure/);assert.equal(loader.getReceipt().firstInputPoseRenderedMilliseconds,null);
  }
  loader.fail(Error('GL failure'));raf.tick(2);button.click();assert.equal(entries(),0);assert.equal(button.disabled,true);assert.equal(shell.hidden,false);assert.equal(loader.getReceipt().mode,'failed');assert.match(nodes.get('[data-loading-instructions]').textContent,/GL failure/);
 }
});

import {readFileSync} from 'node:fs';
import vm from 'node:vm';
// Execute the actual entrance orchestration with real loader/presenter and a
// controlled browser clock; only browser/GPU and navigation intake are stubs.
async function executeMeasuredEntrance({diagnostic=false,failPreparation=false,failMovementRender=false}={}){
 const source=readFileSync(new URL('../../showroom/globe/h-earth/vegetation-prototype/route.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
 const harness=loadingHarness(),raf=animation(),rootNode={dataset:{run8eReady:'false'}},statusNode={textContent:''},events=[],wheelEvents=[],historyChanges=[];
 const location={pathname:diagnostic?'/showroom/globe/h-earth/vegetation-prototype.html':'/showroom/globe/h-earth/',search:diagnostic?'?prototype=single-owner-v1&arrival=approved-four-trees':'',hash:'#world'};
 let proposal=null,state=null,presents=0,clock=0,initialized=false;
 const vegetation={controlRoots:['fixed-root'],installedRootCount:1,selectedFineRoots:1,drawCallCount:1,coarseRootCount:1,coarseTiles:1,perFrameUploadBytes:0};
 const canvas={style:{},clientWidth:640,clientHeight:360,dispatchEvent(event){wheelEvents.push(event);state={...state,sequence:state.sequence+1,position:{...state.position,z:state.position.z+(event.deltaY<0?-4:4)}};proposal({accepted:true},state);}};
 const document={createElement:()=>harness.shell,body:{appendChild(){}},getElementById:id=>id==='prototype-status'?statusNode:id==='h-earth-functional-landscape-canvas'?canvas:rootNode};
 const window={dispatchEvent:event=>events.push(event)};
 const renderer={getResourceReceipt:()=>({singleOwnerVegetation:vegetation,counters:{woodlandHabitatTextureUploadCount:1,woodlandHabitatUploadedBytes:73728}}),renderFrame:()=>{assert.equal(initialized,true);if(failMovementRender&&state.sequence>0)throw Error('SIMULATED_INPUT_FRAME_FAILURE');},presentColorFrame:()=>presents++,initialize:async()=>{initialized=true;},prepareReplacementVegetation:async()=>{if(failPreparation)throw Error('SIMULATED_PREPARATION_FAILURE');return {installed:true};}};
 const context={window,location,document,URLSearchParams,performance:{now:()=>++clock},requestAnimationFrame:raf.request,cancelAnimationFrame:raf.cancel,
  history:{state:{},replaceState(_state,_title,url){historyChanges.push(url);location.search=new URL(url,'https://example.test').search;}},setTimeout:callback=>{callback();},
  WheelEvent:class{constructor(type,options){Object.assign(this,{type},options);}},CustomEvent:class{constructor(type,options){Object.assign(this,{type},options);}},console:{error(){}},
  createHEarthLoadingScreen:options=>createHEarthLoadingScreen({...options,document,now:()=>++clock,requestFrame:raf.request}),
  createFramePresenter:options=>createFramePresenter({...options,requestFrame:raf.request,cancelFrame:raf.cancel}),
  prepareHEarthRun8ER2CanonicalLiveRenderPackage:async()=>{},createHEarthRun8ER3AFrameUniformPacket:({navigationState})=>({camera:{position:navigationState.position}}),
  installHEarthRun8ER3D2PointerTouchIntake:({onProposal})=>{proposal=onProposal;state={position:{x:-139.40267987050615,y:4,z:-194.5},yawDegrees:0,pitchDegrees:0,verticalFovDegrees:56,sequence:0};return {getNavigationState:()=>state,getReceipt:()=>({currentNavigationState:state})};},
  createHEarthRun8ER3CPersistentRenderer:async()=>{if(!diagnostic){assert.equal(canvas.style.pointerEvents,'none');proposal({accepted:true},state);}return renderer;}};
 await vm.runInNewContext(`(async()=>{${source}\n})()`,context);
 return {rootNode,statusNode,window,events,wheelEvents,historyChanges,canvas,raf,button:harness.button,shell:harness.shell,get presents(){return presents;},move({accepted=true,change=true}={}){if(change)state={...state,sequence:state.sequence+1,position:{...state.position,z:state.position.z-2}};proposal({accepted},state);},receipt:()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt()};
}
test('actual public route retains controls test until accepted changed pose renders, opportunity occurs and Enter is pressed',async()=>{
 const route=await executeMeasuredEntrance();assert.equal(route.wheelEvents.length,0);assert.equal(route.presents,2);assert.equal(route.rootNode.dataset.run8eReady,'false');assert.equal(route.events.length,0);assert.equal(route.canvas.style.pointerEvents,'auto');assert.equal(route.receipt().liveGpu.inputPresentationReadiness.mode,'test');assert.equal(route.receipt().automaticNavigation,false);assert.equal(route.receipt().eligible,false);
 route.button.click();assert.equal(route.events.length,0);
 route.move({accepted:false,change:false});route.raf.tick(1);assert.equal(route.button.disabled,true);
 route.move({change:false});route.raf.tick(2);assert.equal(route.button.disabled,true);
 const before=route.presents;route.move();assert.equal(route.presents,before);assert.equal(route.button.disabled,true);
 route.raf.tick(3);assert.equal(route.presents,before+1);assert.equal(route.button.disabled,true);assert.equal(route.events.length,0);assert.equal(route.rootNode.dataset.run8eReady,'false');
 route.raf.tick(4);assert.equal(route.button.disabled,false);assert.equal(route.events.length,0);assert.equal(route.rootNode.dataset.run8eReady,'false');
 route.button.click();assert.equal(route.rootNode.dataset.run8eReady,'true');assert.equal(route.events.length,1);assert.equal(route.events[0].type,'h-earth-run8e-ready');assert.equal(route.receipt().eligible,true);assert.equal(route.receipt().singleOwnerVegetationQualification,null);assert.equal(route.wheelEvents.length,0);
});
test('actual public route preparation or input-frame failure stays visible and never emits ready',async()=>{
 const preparation=await executeMeasuredEntrance({failPreparation:true});assert.equal(preparation.rootNode.dataset.run8eError,'true');assert.equal(preparation.rootNode.dataset.run8eReady,'false');assert.equal(preparation.events.length,0);assert.equal(preparation.receipt().eligible,false);assert.equal(preparation.wheelEvents.length,0);assert.equal(preparation.receipt().liveGpu.inputPresentationReadiness.mode,'failed');
 const rendering=await executeMeasuredEntrance({failMovementRender:true});rendering.move();assert.throws(()=>rendering.raf.tick(1),/SIMULATED_INPUT_FRAME_FAILURE/);rendering.raf.tick(2);rendering.button.click();assert.equal(rendering.events.length,0);assert.equal(rendering.button.disabled,true);assert.equal(rendering.receipt().eligible,false);assert.equal(rendering.receipt().liveGpu.inputPresentationReadiness.mode,'failed');
});
test('actual diagnostic route still qualifies all sixteen forward-return wheel observations',async()=>{
 const route=await executeMeasuredEntrance({diagnostic:true}),receipt=route.receipt();assert.equal(route.historyChanges.length,0);assert.equal(route.wheelEvents.length,16);assert.equal(route.events.length,1);assert.equal(receipt.eligible,true);assert.equal(receipt.singleOwnerVegetationQualification.result,'CAPTURED_POPULATED_CONTINUITY');assert.equal(receipt.singleOwnerVegetationQualification.returnDistanceMeters,0);assert.equal(receipt.singleOwnerVegetationQualification.observations.filter(o=>/^(FORWARD|RETURN)_/.test(o.label)).length,16);assert.equal(receipt.liveGpu.inputPresentationReadiness,null);assert.equal(receipt.intake.currentNavigationState.position.z,-194.5);
});

test('coalesced loader receipt distinguishes earliest input from actual rendered input pose',()=>{
 const {loader,raf}=loadingHarness();loader.enableControls(cameraState(1));
 const presenter=createFramePresenter({present:state=>({navigationSequence:state.sequence}),requestFrame:raf.request,cancelFrame:raf.cancel,onPresented:loader.observePresentation});
 for(const state of [cameraState(2,1),cameraState(3,2),cameraState(4,3)]){loader.observeInput({accepted:true},state);presenter.request(state);}
 raf.tick(1);const receipt=loader.getReceipt();assert.equal(presenter.getReceipt().presentations,1);assert.equal(receipt.firstInputPose.navigationSequence,2);assert.equal(receipt.renderedInputPose.navigationSequence,4);assert.equal(receipt.firstInputPresentedFrame.navigationSequence,4);assert.notEqual(receipt.firstInputPose.pose,receipt.renderedInputPose.pose);
 receipt.renderedInputPose.pose='MUTATED';assert.notEqual(loader.getReceipt().renderedInputPose.pose,'MUTATED');
});
