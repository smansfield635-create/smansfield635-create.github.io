import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {closeHEarthBrowser,createHEarthBudget,hasHEarthPresentedPose,launchSurfaceBrowser,launchVerifiedBrowser,travelHEarthScene,pulseHEarthNavigation,aimHEarthAxis,observeHEarthFailure,waitForHEarthNavigation,validateHEarthPreEntryPolicy,runHEarthPreEntry,validateDeclaredInteractions,assessHEarthInputReadiness,validateHEarthScenePolicy,assessHEarthJacarandaScene,runHEarthSceneQualification,observeHEarthSceneAsset} from './publication-live-verify.mjs';

const POLICY='H_EARTH_CONTROL_TEST_ENTER_V1';
function fakePage({timeoutAt=0,initialReady='false',initialMode='test',observed={},post={}}={}){
  const calls=[];
  let waits=0,reads=0;
  const page={
    waitForFunction:async()=>{calls.push('wait');waits++;if(timeoutAt===waits)throw Error('synthetic timing failure');},
    evaluate:async()=>{
      calls.push('evaluate');reads++;
      if(reads===1)return {mode:initialMode,ready:initialReady};
      if(reads===2||(timeoutAt===2&&reads===3))return {mode:'ready',disabled:false,inputChanged:true,inputRendered:true,nextFrame:true,gpuFrames:2,...observed};
      return {ready:'true',mode:'entered',overlayMode:'ready',hidden:true,...post};
    },
    $:async()=>{calls.push('select');return {boundingBox:async()=>{calls.push('boundingBox');return {x:0,y:0,width:720,height:1280};}};},
    mouse:{move:async()=>calls.push('mouse.move'),down:async()=>calls.push('mouse.down'),up:async()=>calls.push('mouse.up'),wheel:async()=>calls.push('mouse.wheel')},
    click:async()=>calls.push('click')
  };
  return {page,calls};
}
test('other public surfaces cannot opt into H-Earth-only user-entry strategy',()=>{
  assert.equal(validateHEarthPreEntryPolicy('audralia',undefined),null);
  assert.throws(()=>validateHEarthPreEntryPolicy('audralia',POLICY),/PRE_ENTRY_POLICY_INVALID/);
  assert.throws(()=>validateHEarthPreEntryPolicy('h-earth','skip-ready'),/PRE_ENTRY_POLICY_INVALID/);
  assert.equal(validateHEarthPreEntryPolicy('h-earth',POLICY),POLICY);
  assert.deepEqual(validateDeclaredInteractions(undefined),[]);
});
test('H-Earth user controls must render before enabled Enter, then flag readiness',async()=>{
  const {page,calls}=fakePage();
  const receipt=await runHEarthPreEntry(page,'h-earth',POLICY);
  assert.equal(receipt.result,'PASS');
  assert.equal(receipt.gpuFramebufferPresentationCount,2);
  assert.ok(calls.indexOf('mouse.down')<calls.indexOf('mouse.up'));
  assert.ok(calls.indexOf('mouse.up')<calls.indexOf('mouse.wheel'));
  assert.ok(calls.indexOf('mouse.wheel')<calls.indexOf('click'));
  assert.deepEqual(calls.filter(x=>x==='wait'),['wait','wait','wait']);
});
test('absent H-Earth pre-ready policy preserves other public surfaces',async()=>{
  const {page,calls}=fakePage();
  assert.equal(await runHEarthPreEntry(page,'compass',undefined),null);
  assert.deepEqual(calls,[]);
});
test('already-ready bypass before human input is rejected',async()=>{
  const {page,calls}=fakePage({initialReady:'true'});
  await assert.rejects(runHEarthPreEntry(page,'h-earth',POLICY),/PRE_ENTRY_STATE_INVALID/);
  assert.ok(!calls.includes('mouse.down'));
});
test('original controls readiness timeout fails without invoking Enter',async()=>{
  const {page,calls}=fakePage({timeoutAt:1});
  await assert.rejects(runHEarthPreEntry(page,'h-earth',POLICY),/synthetic timing failure/);
  assert.ok(!calls.includes('click'));
});
test('unrendered camera pose cannot be treated as qualified entry',async()=>{
  const {page,calls}=fakePage({observed:{inputRendered:false}});
  await assert.rejects(runHEarthPreEntry(page,'h-earth',POLICY),/INPUT_FRAME_NOT_VERIFIED/);
  assert.ok(!calls.includes('click'));
});
test('disabled Enter cannot qualify a valid scene',async()=>{
  const {page,calls}=fakePage({observed:{disabled:true}});
  await assert.rejects(runHEarthPreEntry(page,'h-earth',POLICY),/INPUT_FRAME_NOT_VERIFIED/);
  assert.ok(!calls.includes('click'));
});
test('blank GPU presentation rejects entry',async()=>{
  const {page,calls}=fakePage({observed:{gpuFrames:0}});
  await assert.rejects(runHEarthPreEntry(page,'h-earth',POLICY),/INPUT_FRAME_NOT_VERIFIED/);
  assert.ok(!calls.includes('click'));
});
test('authentic entered receipt and hidden overlay pass despite stale data-mode attribute',async()=>{
  const {page}=fakePage({post:{mode:'entered',overlayMode:'ready',hidden:true}});
  const receipt=await runHEarthPreEntry(page,'h-earth',POLICY);
  assert.equal(receipt.entered,true);
});
test('loader receipt still ready rejects even with hidden overlay and world flag',async()=>{
  const {page}=fakePage({post:{mode:'ready',overlayMode:'ready',ready:'true',hidden:true}});
  await assert.rejects(runHEarthPreEntry(page,'h-earth',POLICY),/ENTER_CALLBACK_NOT_OBSERVED/);
});
test('missing authenticated post-click entry remains fail closed',async()=>{
  const {page}=fakePage({post:{ready:'false'}});
  await assert.rejects(runHEarthPreEntry(page,'h-earth',POLICY),/ENTER_CALLBACK_NOT_OBSERVED/);
});
test('registered full H-Earth manifest keeps true readiness and selected user interaction',()=>{
  const m=JSON.parse(fs.readFileSync('.github/ai-router/publication-surfaces/h-earth.json','utf8'));
  assert.equal(m.runtime.preReadyEntry,POLICY);
  assert.deepEqual(m.runtime.readyAttribute,{selector:'#h-earth-functional-landscape-route',name:'data-run8e-ready',contains:'true'});
  assert.ok(m.runtime.interactions.some(x=>x.assertions.some(a=>a.name==='data-run8e-ready'&&a.value==='true')));
});

test('pre-entry diagnostic reports every individual missing readiness predicate',()=>{
  const ready={mode:'ready',disabled:false,inputChanged:true,inputRendered:true,nextFrame:true,gpuFrames:2};
  const clean=assessHEarthInputReadiness(ready);
  assert.equal(clean.pass,true);
  assert.deepEqual(clean.unmet,[]);
  const cases=[
    ['mode','test','loadingScreenReady'],
    ['disabled',true,'enterButtonEnabled'],
    ['inputChanged',false,'cameraInputRecorded'],
    ['inputRendered',false,'changedCameraFrameRendered'],
    ['nextFrame',false,'animationFrameOpportunityObserved'],
    ['gpuFrames',0,'gpuFramebufferPresented']
  ];
  for(const [key,value,reason] of cases){
    const result=assessHEarthInputReadiness({...ready,[key]:value});
    assert.equal(result.pass,false,reason);
    assert.deepEqual(result.unmet,[reason]);
    assert.equal(result.conditions[reason],false);
  }
  const missing=assessHEarthInputReadiness(null);
  assert.equal(missing.pass,false);
  assert.equal(missing.unmet.length,6);
});

test('pre-entry timeout diagnoses missing signals without clicking Enter or changing user gate',async()=>{
  const {page,calls}=fakePage({
    timeoutAt:2,
    observed:{mode:'test',disabled:true,inputChanged:true,inputRendered:false,nextFrame:false,gpuFrames:0}
  });
  await assert.rejects(
    runHEarthPreEntry(page,'h-earth',POLICY),
    /H_EARTH_INPUT_GATE_TIMEOUT:loadingScreenReady,enterButtonEnabled,changedCameraFrameRendered,animationFrameOpportunityObserved,gpuFramebufferPresented/
  );
  assert.ok(calls.includes('mouse.wheel'));
  assert.ok(!calls.includes('click'));
});

test('real all-pass deadline readback continues through actual Enter and post-entry checks',async()=>{
  const {page,calls}=fakePage({
    timeoutAt:2,
    observed:{
      rootPrototype:'controls-test',rootReady:'false',
      loaderReceiptMode:'ready',gpuReceiptPresent:true,rootError:null
    }
  });
  const receipt=await runHEarthPreEntry(page,'h-earth',POLICY);
  assert.equal(receipt.result,'PASS');
  assert.equal(receipt.entered,true);
  assert.ok(calls.includes('mouse.wheel'));
  assert.equal(calls.filter(x=>x==='click').length,1);
  assert.equal(calls.filter(x=>x==='wait').length,3);
});

test('all six signals cannot bypass failed authenticity or already-entered state',async()=>{
  const {page,calls}=fakePage({
    timeoutAt:2,
    observed:{
      rootPrototype:'failed',rootReady:'true',
      loaderReceiptMode:'entered',gpuReceiptPresent:true,rootError:'true'
    }
  });
  await assert.rejects(
    runHEarthPreEntry(page,'h-earth',POLICY),
    /H_EARTH_INPUT_GATE_TIMEOUT:AUTHENTIC_PRE_ENTRY_STATE_NOT_OBSERVED/
  );
  assert.ok(!calls.includes('click'));
});


const SCENE_POLICY='H_EARTH_APPROVED_JACARANDA_SCENE_V1';
function qualifiedScene(){
  const sha256='46b65326f75c29b1f076fdd161213a226bae3f519c92a3ac9d9a1972398b7189';
  const companions=['PROPOSED_OASIS_02','PROPOSED_OASIS_03','PROPOSED_OASIS_04'];
  return {asset:{status:200,bytes:33184612,sha256},resources:{
    jacaranda:{assetSha256:sha256,focusId:'PROPOSED_OASIS_01',state:'READY',ready:true,fallbackUsed:false,drawCount:1,
      loadedGeometry:{triangles:454746,vertices:651794,assetLength:33184612},textureCount:9,vertexArrayCount:3,programCount:1,
      threeCompanionsPreserved:true,placement:{companionsPreserved:true,gaps:companions.map(id=>({id,gapMeters:1}))},
      originalHydratedWorldUnchanged:true,perFrameGeometryConstruction:false},
    geologicalFormation:{attachedMeshCount:4,designedFreshwaterRendered:true},singleOwnerVegetation:{drawCallCount:2,installedRootCount:100},woodlandFineGrass:null,oasisTrees:{drawCount:1,placements:companions.map(id=>({id}))},cavernUnderstory:{drawCount:1,placements:['flower','fern','broadleaf'].map(kind=>({kind}))},cavernIvy:{drawCount:1},cavernPalms:{drawCount:1}
  }};
}
test('target scene qualification is fixed, optional and exclusive to full H-Earth',async()=>{
  assert.equal(validateHEarthScenePolicy('h-earth',SCENE_POLICY),SCENE_POLICY);
  assert.throws(()=>validateHEarthScenePolicy('audralia',SCENE_POLICY),/SCENE_POLICY_INVALID/);
  assert.throws(()=>validateHEarthScenePolicy('h-earth','caller-controlled'),/SCENE_POLICY_INVALID/);
  assert.equal(await runHEarthSceneQualification(null,'compass',undefined),null);
  assert.equal(observeHEarthSceneAsset(null,'compass',undefined),null);
});
test('qualified imported tree requires fetched bytes, actual drawing and retained ecology',()=>{
  const {resources,asset}=qualifiedScene();
  assert.deepEqual(assessHEarthJacarandaScene(resources,asset).unmet,[]);
  assert.equal(assessHEarthJacarandaScene(resources,asset).pass,true);
  const cases=[
    ['asset byte substitution',s=>s.asset.sha256='0'.repeat(64),'exactFetchedAsset'],
    ['wrong response length',s=>s.asset.bytes--,'exactFetchedAsset'],
    ['resource substitution',s=>s.resources.jacaranda.assetSha256='0'.repeat(64),'approvedResource'],
    ['fallback tree',s=>s.resources.jacaranda.fallbackUsed=true,'readyWithoutFallback'],
    ['ready but never drawn',s=>s.resources.jacaranda.drawCount=0,'actualDraw'],
    ['partial geometry',s=>s.resources.jacaranda.loadedGeometry.triangles--,'geometry'],
    ['missing texture',s=>s.resources.jacaranda.textureCount--,'gpuResources'],
    ['companions never drawn',s=>s.resources.oasisTrees.drawCount=0,'threeCompanions'],
    ['invalid companion separation',s=>s.resources.jacaranda.placement.gaps[0].gapMeters=-1,'threeCompanions'],
    ['flower placement absent',s=>s.resources.cavernUnderstory.placements.shift(),'existingEcology'],
    ['missing companion',s=>s.resources.oasisTrees.placements.pop(),'threeCompanions'],
    ['unverified companion gap',s=>s.resources.jacaranda.placement.gaps.pop(),'threeCompanions'],
    ['missing flowers/understory draw',s=>s.resources.cavernUnderstory.drawCount=0,'existingEcology'],
    ['world rebuilt',s=>s.resources.jacaranda.originalHydratedWorldUnchanged=false,'unchangedWorld']
  ];
  for(const [label,change,condition] of cases){
    const scene=qualifiedScene();change(scene);const result=assessHEarthJacarandaScene(scene.resources,scene.asset);
    assert.equal(result.pass,false,label);assert.ok(result.unmet.includes(condition),label);
  }
  assert.equal(assessHEarthJacarandaScene(null,null).pass,false);
});
test('target inspection cannot bypass genuine public entry or missing asset observation',async()=>{
  const page={evaluate:async()=>({mode:'diagnostic-replay',entered:true,ready:true})};
  await assert.rejects(runHEarthSceneQualification(page,'h-earth',SCENE_POLICY,{}),/REQUIRES_GENUINE_ENTRY/);
  page.evaluate=async()=>({mode:'manual-public',entered:true,ready:true});
  await assert.rejects(runHEarthSceneQualification(page,'h-earth',SCENE_POLICY,null),/ASSET_OBSERVER_REQUIRED/);
});
test('owner-approved release keeps entry contract without requiring extended camera tour',()=>{
  const m=JSON.parse(fs.readFileSync('.github/ai-router/publication-surfaces/h-earth.json','utf8'));
  assert.equal(m.runtime.sceneQualification,undefined);
  assert.equal(m.runtime.preReadyEntry,POLICY);
  assert.equal(m.runtime.failOnPageErrors,true);
  assert.equal(m.runtime.failOnConsoleErrors,true);
});

for(const changed of [true,false])test(`navigation deadline readback ${changed?'accepts actual progress':'rejects unchanged state'}`,async()=>{
  const timeout=Object.assign(new Error('deadline'),{name:'TimeoutError'});
  let reads=0;
  const page={waitForFunction:async(fn,options,sequence)=>{
    assert.equal(options.polling,100);assert.equal(options.timeout,15000);assert.equal(sequence,6);throw timeout;
  },evaluate:async(fn,sequence)=>{reads++;assert.equal(sequence,6);return changed;}};
  if(changed)await waitForHEarthNavigation(page,6);
  else await assert.rejects(waitForHEarthNavigation(page,6),error=>error===timeout);
  assert.equal(reads,1);
});
test('navigation execution errors cannot be overridden by deadline readback',async()=>{
  const error=new Error('execution context destroyed');let read=false;
  await assert.rejects(waitForHEarthNavigation({waitForFunction:async()=>{throw error;},evaluate:async()=>{read=true;return true;}},6),e=>e===error);
  assert.equal(read,false);
});

test('aim tracks actual pitch progress to target with bounded genuine-input pulses',async()=>{
 let value=16,sequence=1,pulses=0;const trace=[];
 await aimHEarthAxis({axis:'pitchDegrees',target:4,tolerance:2.2,trace,read:async()=>({navigation:{pitchDegrees:value,sequence}}),pulse:async(dx,dy,goal)=>{assert.equal(dx,0);assert.ok(dy>0);assert.equal(goal.target,4);value-=4;sequence++;pulses++;}});
 assert.equal(pulses,3);assert.equal(trace.length,3);
});
test('aim rejects unchanged angles despite advancing sequence after three pulses',async()=>{
 let sequence=0;const trace=[];
 await assert.rejects(aimHEarthAxis({axis:'pitchDegrees',target:4,tolerance:2.2,trace,read:async()=>({navigation:{pitchDegrees:16,sequence}}),pulse:async()=>{sequence++;}}),/NO_PROGRESS/);
 assert.equal(sequence,3);
});
test('aim rejects repeated overshoot instead of consuming the scene budget',async()=>{
 let value=10,sequence=0;const trace=[];
 await assert.rejects(aimHEarthAxis({axis:'pitchDegrees',target:4,tolerance:2.2,trace,read:async()=>({navigation:{pitchDegrees:value,sequence}}),pulse:async()=>{value=value===10?-2:10;sequence++;}}),/NO_PROGRESS|OSCILLATION/);
 assert.ok(sequence<=6);
});
test('yaw takes the short path across wraparound',async()=>{
 let value=179;const trace=[];
 await aimHEarthAxis({axis:'yawDegrees',target:-170,tolerance:6,trace,read:async()=>({navigation:{yawDegrees:value,sequence:1}}),pulse:async(dx)=>{assert.ok(dx>0);value=-173;}});
 assert.equal(trace.length,1);
});
test('failure observation survives expired scene budget and exposes read errors',async()=>{
 assert.deepEqual(await observeHEarthFailure(async()=>({navigation:{pitchDegrees:32}})),{observation:{navigation:{pitchDegrees:32}},error:null});
 const r=await observeHEarthFailure(async()=>{throw Error('page closed');});assert.equal(r.observation,null);assert.match(r.error,/page closed/);
});

test('large turns target the final heading without artificial small-angle restarts',async()=>{
 let value=-4,sequence=1;const trace=[],goals=[];
 await aimHEarthAxis({axis:'yawDegrees',target:72,tolerance:6,trace,read:async()=>({navigation:{yawDegrees:value,sequence}}),pulse:async(dx,dy,goal)=>{assert.ok(dx>0);assert.equal(dy,0);assert.equal(goal.target,72);goals.push(goal.target);value=goal.target;sequence++;}});
 assert.equal(goals.length,1);assert.ok(Math.abs(value-72)<=6);assert.equal(goals[0],72);
});

// Exercise the production pulse adapter, including pointer release and the exact
// browser predicate. These fixtures model receipt timing, not GPU acceptance.
const pulseHarness=({initial=2.341926056139427,final=-4.685275481946448,axis='yawDegrees',failure='TimeoutError',sequence=11}={})=>{
 const state={yawDegrees:initial,pitchDegrees:0,sequence:5};const events=[];
 const evaluate=(fn,args)=>{
  const previous=globalThis.window;
  globalThis.window={H_EARTH_RUN8E_PUBLIC_ROUTE:{getIntakeReceipt:()=>({currentNavigationState:state})}};
  try{return fn(args);}finally{globalThis.window=previous;}
 };
 const error=Object.assign(Error(failure),{name:failure});
 const page={mouse:{move:async()=>events.push('move'),down:async()=>events.push('down'),up:async()=>{events.push('up');state[axis]=final;state.sequence=sequence;}},
  waitForFunction:async(fn,options,args)=>{events.push('wait');assert.equal(evaluate(fn,args),false);if(failure)throw error;state[axis]=final;state.sequence=sequence;assert.equal(evaluate(fn,args),true);},
  evaluate:async(fn,args)=>{events.push('readback');assert.equal(events.at(-2),'up');return evaluate(fn,args);}};
 return {adapter:{page,read:async()=>({navigation:{...state}}),box:{x:0,y:0,width:1000,height:800},bounded:()=>{}},events,error};
};
const recordedGoal={axis:'yawDegrees',target:-1.6580739438605732,tolerance:.5,error:-4};
test('production pulse reconciles recorded completed turn only after pointer release',async()=>{
 const h=pulseHarness();await pulseHEarthNavigation(h.adapter,-.061,0,recordedGoal);
 assert.deepEqual(h.events,['move','down','move','wait','up','readback']);
});
for(const [label,options] of Object.entries({stalled:{final:2.341926056139427},wrongDirection:{final:8},wrongAxis:{axis:'pitchDegrees'},staleSequence:{sequence:5}})){
 test('production pulse rejects timeout with '+label,async()=>{
  const h=pulseHarness(options);await assert.rejects(pulseHEarthNavigation(h.adapter,-.061,0,recordedGoal),e=>e===h.error);
  assert.ok(h.events.includes('up'));
 });
}
test('production pulse propagates context loss without timeout reconciliation',async()=>{
 const h=pulseHarness({failure:'ProtocolError'});await assert.rejects(pulseHEarthNavigation(h.adapter,-.061,0,recordedGoal),e=>e===h.error);
 assert.equal(h.events.at(-1),'up');assert.ok(!h.events.includes('readback'));
});
test('production pulse normal completion releases without recovery read',async()=>{
 const h=pulseHarness({failure:null});await pulseHEarthNavigation(h.adapter,-.061,0,recordedGoal);
 assert.equal(h.events.at(-1),'up');assert.ok(!h.events.includes('readback'));
});
test('production pulse reconciles yaw wrap and pitch separately',async()=>{
 const h=pulseHarness({initial:179,final:-176});await pulseHEarthNavigation(h.adapter,.061,0,{axis:'yawDegrees',target:183,tolerance:.5,error:4});
 const p=pulseHarness({axis:'pitchDegrees',final:-5});await pulseHEarthNavigation(p.adapter,0,.061,{axis:'pitchDegrees',target:-4,tolerance:.5,error:-4});
});

for(const frameMs of [50,1000])test('production traversal with real intake and '+frameMs+'ms simulated frames',async()=>{
 const {installHEarthRun8ER3D2PointerTouchIntake}=await import('../showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js');
 const keys=['HTMLElement','location','document','requestAnimationFrame','cancelAnimationFrame','performance','window'];
 const originals=Object.fromEntries(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 let clock=0,frame,controller,polls=0,recoveries=0,x=500,y=400;
 class Surface{
  style={};clientWidth=1000;clientHeight=800;listeners=new Map();
  addEventListener(k,fn){this.listeners.set(k,fn);}removeEventListener(k){this.listeners.delete(k);}
  emit(k,extra={}){this.listeners.get(k)?.({preventDefault(){},pointerId:1,pointerType:'mouse',clientX:x,clientY:y,...extra});}
 }
 const surface=new Surface();
 const globals={HTMLElement:Surface,location:{search:'?arrival=approved-four-trees'},document:{hidden:false},performance:{now:()=>clock},requestAnimationFrame:fn=>{frame=fn;return 1;},cancelAnimationFrame:()=>{},window:{H_EARTH_RUN8E_PUBLIC_ROUTE:{getIntakeReceipt:()=>controller.getReceipt()}}};
 for(const [k,value] of Object.entries(globals))Object.defineProperty(globalThis,k,{value,configurable:true,writable:true});
 try{
  controller=installHEarthRun8ER3D2PointerTouchIntake({surface});
  const read=async()=>({navigation:controller.getNavigationState()});
  const page={mouse:{move:async(a,b)=>{x=a;y=b;surface.emit('pointermove');},down:async()=>surface.emit('pointerdown'),up:async()=>surface.emit('pointerup'),wheel:async extra=>surface.emit('wheel',extra)},
   evaluate:async(fn,args)=>{assert.equal(controller.getReceipt().activeIntent,'NONE');recoveries++;return fn(args);},
   waitForFunction:async(fn,options,args)=>{
    const end=clock+options.timeout;polls++;
    while(clock<end){clock+=frameMs;frame(clock);await Promise.resolve();if(fn(args)){
     // Reproduce lost completion delivery after genuine controller progress.
     if(polls===1){clock=end;throw Object.assign(Error('recorded completion race'),{name:'TimeoutError'});}
     return;
    }}
    throw Object.assign(Error('simulated stalled control'),{name:'TimeoutError'});
   }};
  const trace=[];const bounded=()=>assert.ok(clock<600000);
  const pulse=(dx,dy,goal)=>pulseHEarthNavigation({page,read,box:{x:0,y:0,width:1000,height:800},bounded},dx,dy,goal);
  const aim=async(yaw,pitch)=>{
   await aimHEarthAxis({axis:'yawDegrees',target:yaw,tolerance:6,read,pulse,trace,now:()=>clock});
   if(pitch!==undefined)await aimHEarthAxis({axis:'pitchDegrees',target:pitch,tolerance:2.2,read,pulse,trace,now:()=>clock});
  };
  for(const [tx,tz] of [[-145,-280],[-60,-310]])await travelHEarthScene({page,read,aim,bounded},tx,tz);
  await aim(89,4);
  await travelHEarthScene({page,read,aim,bounded},40,-300);
  await aim(64,8);await aim(160,2);
  const n=controller.getNavigationState();assert.ok(Math.hypot(n.position.x-40,n.position.z+300)<3);
  assert.ok(Math.abs(n.yawDegrees-160)<=6);assert.ok(Math.abs(n.pitchDegrees-2)<=2.2);
  assert.equal(controller.getReceipt().activeIntent,'NONE');assert.equal(recoveries,1);
  assert.ok(trace.length>0);assert.ok(clock<600000);
 }finally{
  controller?.destroy();for(const k of keys){if(originals[k])Object.defineProperty(globalThis,k,originals[k]);else delete globalThis[k];}
 }
});

test('production pulse does not hide post-timeout readback failure',async()=>{
 const h=pulseHarness(),error=Error('receipt unavailable');h.adapter.page.evaluate=async()=>{throw error;};
 await assert.rejects(pulseHEarthNavigation(h.adapter,-.061,0,recordedGoal),e=>e===error);
 assert.equal(h.events.at(-1),'up');
});
test('production pulse does not accept a failed pointer release',async()=>{
 const h=pulseHarness(),error=Error('pointer release failed');h.adapter.page.mouse.up=async()=>{throw error;};
 await assert.rejects(pulseHEarthNavigation(h.adapter,-.061,0,recordedGoal),e=>e===error);
 assert.ok(!h.events.includes('readback'));
});

const browserStartupHarness=()=>{
 const events=[],reports=[];let options;
 const page={goto:async url=>{events.push(url);},evaluate:async()=>true,close:async()=>events.push('probe-close')};
 const browser={newPage:async()=>page,process:()=>({kill:signal=>events.push(signal)})};
 const args={executablePath:'/alias/chrome',inspect:()=>({requestedPath:'/alias/chrome',resolvedPath:'/exact/chrome',version:'fixture'}),report:r=>reports.push(r),puppeteer:{launch:async o=>{options=o;events.push('launch');return browser;}}};
 return {events,reports,page,browser,args,options:()=>options};
};
test('browser startup records exact executable and probes blank page before returning browser',async()=>{
 const h=browserStartupHarness();assert.equal(await launchVerifiedBrowser(h.args),h.browser);
 assert.deepEqual(h.events,['launch','about:blank','probe-close']);
 assert.equal(h.options().executablePath,'/exact/chrome');assert.equal(h.options().dumpio,true);assert.equal(h.options().timeout,30000);
 assert.equal(h.reports.at(-1).result,'PASS');
});
test('browser identity failure stops before launch',async()=>{
 const h=browserStartupHarness();h.args.inspect=()=>{throw Error('missing executable');};
 await assert.rejects(launchVerifiedBrowser(h.args),/missing executable/);assert.deepEqual(h.events,[]);assert.equal(h.reports.at(-1).phase,'EXECUTABLE_IDENTITY');
});
test('browser launch failure preserves cause and does not retry',async()=>{
 const h=browserStartupHarness();let attempts=0;const error=Error('endpoint timeout');h.args.puppeteer.launch=async()=>{attempts++;throw error;};
 await assert.rejects(launchVerifiedBrowser(h.args),e=>e===error);assert.equal(attempts,1);assert.equal(h.reports.at(-1).phase,'BROWSER_LAUNCH');
});
test('invalid blank page fails closed and terminates browser',async()=>{
 const h=browserStartupHarness();h.page.evaluate=async()=>false;
 await assert.rejects(launchVerifiedBrowser(h.args),/PROBE_FAILED/);assert.equal(h.events.at(-1),'SIGKILL');
});
test('unresponsive blank-page connection has a bounded deadline',async()=>{
 const h=browserStartupHarness();h.browser.newPage=()=>new Promise(()=>{});h.args.probeTimeoutMs=10;
 await assert.rejects(launchVerifiedBrowser(h.args),/PROBE_TIMEOUT/);assert.equal(h.events.at(-1),'SIGKILL');assert.equal(h.reports.at(-1).phase,'BLANK_PAGE_CONNECTION');
});

test('H-Earth startup diagnostics remain enabled with and without optional scene qualification',async()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../.github/ai-router/publication-surfaces/h-earth.json',import.meta.url),'utf8'));
 let normal=0,diagnostic=0;
 const args={executablePath:'/fixture',puppeteer:{launch:async options=>{normal++;assert.equal(options.dumpio,undefined);assert.equal(options.timeout,undefined);}},diagnosticLaunch:async()=>{diagnostic++;}};
 await launchSurfaceBrowser({...args,surfaceId:'h-earth',scenePolicy:manifest.runtime.sceneQualification});
 await launchSurfaceBrowser({...args,surfaceId:'audralia',scenePolicy:manifest.runtime.sceneQualification});
 await launchSurfaceBrowser({...args,surfaceId:'h-earth'});
 assert.equal(diagnostic,2);assert.equal(normal,1);
});

test('recorded progressing turn survives delayed calls within shared budget',async()=>{
 const values=[-10.385162542606775,4.007637457392805,18.407637457392806,32.80043745739449,47.200437457394486,61.600437457394484,69];let index=0,clock=0;
 const budget=createHEarthBudget(600000,()=>clock),trace=[];
 await aimHEarthAxis({axis:'yawDegrees',target:69.8823026634447,tolerance:6,read:async()=>({navigation:{yawDegrees:values[index],sequence:index}}),pulse:async()=>{index++;clock+=19000;},trace,now:()=>clock,bounded:budget.check});
 assert.equal(clock,114000);assert.equal(trace.length,6);assert.ok(trace.every(t=>t.elapsedMs===19000));
});
test('shared budget rejects a hung browser call without awaiting its completion',async()=>{
 const budget=createHEarthBudget(15);await assert.rejects(budget.run('hung',()=>new Promise(()=>{})),/OPERATION_DEADLINE:hung/);
 assert.equal(budget.timings[0].label,'hung');
});
test('frame proof rejects absent metadata, wrong pose and stale drawing',()=>{
 const old=globalThis.window;let receipt={};globalThis.window={H_EARTH_RUN8E_PUBLIC_ROUTE:{getLiveGpuReceipt:()=>receipt}};
 try{
  const proof={sequence:4,minimumFrame:3,minimumDraw:5};assert.equal(hasHEarthPresentedPose(proof),false);
  receipt={frameRecords:[{frameSequence:4,navigationSequence:3}],resources:{jacaranda:{drawCount:6}}};assert.equal(hasHEarthPresentedPose(proof),false);
  receipt.frameRecords[0].navigationSequence=4;receipt.resources.jacaranda.drawCount=5;assert.equal(hasHEarthPresentedPose(proof),false);
  receipt.resources.jacaranda.drawCount=6;assert.equal(hasHEarthPresentedPose(proof),true);
 }finally{globalThis.window=old;}
});

// Full production orchestration with a deterministic browser port. Actual native
// controller dynamics are covered above; this covers the previously omitted
// asset, draw refresh, frame identity, screenshot and failure-packaging stages.
for(const scenario of ['pass','delayed-pass','fallback','stale-frame','asset-error','capture-error','packaging-error','missing-river','missing-grass'])test('complete scene orchestration: '+scenario,async()=>{
 let virtualTime=0;const realNow=Date.now;if(scenario==='delayed-pass')Date.now=()=>virtualTime;
 const scene=qualifiedScene(),r=scene.resources;let n={sequence:1,position:{x:-139.4,y:8,z:-194.5},yawDegrees:0,pitchDegrees:16};let frame=1,dx=0,dy=0,down=false,screens=0,fullReads=0,intakeReads=0;
 r.jacaranda.state='IDLE';r.jacaranda.drawCount=0;
 if(scenario==='missing-river')r.geologicalFormation.designedFreshwaterRendered=false;
 if(scenario==='missing-grass')r.singleOwnerVegetation.drawCallCount=0;
 const present=()=>{frame++;if(Math.hypot(n.position.x-55.5,n.position.z+307.5)<=180)r.jacaranda.state=scenario==='fallback'?'FALLBACK':'READY';if(r.jacaranda.state==='READY')r.jacaranda.drawCount++;};
 const gpu=()=>({resources:r,frameRecords:[{frameSequence:frame,navigationSequence:scenario==='stale-frame'?0:n.sequence}],counters:{}});
 const oldWindow=globalThis.window,oldDocument=globalThis.document,oldTemp=process.env.RUNNER_TEMP;
 const temp=fs.mkdtempSync('/tmp/gratitude-orchestration-');process.env.RUNNER_TEMP=temp;
 globalThis.window={H_EARTH_RUN8E_PUBLIC_ROUTE:{getIntakeReceipt:()=>{intakeReads++;return {currentNavigationState:n};},getLiveGpuReceipt:gpu,getReceipt:()=>{fullReads++;return {mode:'manual-public',intake:{currentNavigationState:n},liveGpu:gpu()};}},H_EARTH_STARTUP_LOADER:{getReceipt:()=>({mode:'entered'})}};
 globalThis.document={querySelector:()=>({dataset:{run8eReady:'true'}})};
 const clone=v=>JSON.parse(JSON.stringify(v));
 const sheet={setViewport:async()=>{},setContent:async()=>{if(scenario==='packaging-error')throw Error('sheet failed');},waitForFunction:async()=>{},screenshot:async({path})=>fs.writeFileSync(path,'test png'),close:async()=>{}};
 const page={evaluate:async(fn,args)=>clone(await fn(args)),$:async()=>({boundingBox:async()=>({x:0,y:0,width:1000,height:800})}),browser:()=>({newPage:async()=>sheet}),
  screenshot:async()=>{if(scenario==='capture-error')throw Error('capture failed');screens++;return Buffer.from('test capture');},
  mouse:{move:async(x,y)=>{dx=(x-500)/1000;dy=(y-400)/800;},down:async()=>{down=true;},up:async()=>{down=false;},wheel:async({deltaY})=>{const distance=Math.min(10,Math.abs(deltaY)/70),angle=n.yawDegrees*Math.PI/180;n={...n,sequence:n.sequence+1,position:{...n.position,x:n.position.x+Math.sin(angle)*distance,z:n.position.z-Math.cos(angle)*distance}};present();}},
  waitForFunction:async(fn,options,args)=>{
   for(let k=0;k<100;k++){
    if(fn(args))return;
    if(down){n={...n,sequence:n.sequence+1,yawDegrees:n.yawDegrees+Math.sign(dx)*2,pitchDegrees:n.pitchDegrees-Math.sign(dy)*2};present();}
    else break;
   }
   throw Object.assign(Error('fixture wait timeout'),{name:'TimeoutError'});
  }};
 try{
  const observer={finish:async()=>{if(scenario==='asset-error')throw Error('asset buffer failed');return [scene.asset];}};
  const delayed=target=>new Proxy(target,{get(t,k){const value=t[k];if(k==='mouse')return delayed(value);return typeof value==='function'?(...args)=>{virtualTime+=500;return value.apply(t,args);}:value;}});
  const result=await runHEarthSceneQualification(scenario==='delayed-pass'?delayed(page):page,'h-earth',SCENE_POLICY,observer);
  assert.equal(result.result,scenario.endsWith('pass')?'RUNTIME_PASS_VISUAL_REVIEW_PENDING':'FAIL');
  assert.equal(down,false);assert.ok(result.timings.length>0);
  if(scenario.endsWith('pass')){assert.equal(screens,4);assert.equal(result.views.length,4);assert.ok(result.screenshotEvidence);assert.ok(intakeReads>fullReads);assert.ok(result.views[2].resources.jacaranda.drawCount>result.views[1].resources.jacaranda.drawCount);}
  if(scenario==='packaging-error')assert.match(result.evidenceError,/sheet failed/);
  if(scenario==='asset-error')assert.match(result.failure,/asset buffer failed/);
 }finally{Date.now=realNow;globalThis.window=oldWindow;globalThis.document=oldDocument;if(oldTemp===undefined)delete process.env.RUNNER_TEMP;else process.env.RUNNER_TEMP=oldTemp;fs.rmSync(temp,{recursive:true,force:true});}
});

test('hung browser cleanup is bounded and attempts process termination',async()=>{
 let killed=false;await assert.rejects(closeHEarthBrowser({close:()=>new Promise(()=>{}),process:()=>({kill:()=>{killed=true;}})},10),/browser.close/);assert.equal(killed,true);
});
test('a partial angular timeout is progress, not final-angle acceptance',async()=>{
 const h=pulseHarness({final:1});await pulseHEarthNavigation(h.adapter,-.061,0,recordedGoal);assert.equal(h.events.at(-1),'readback');
});
test('the shared scene deadline still stops a progressing turn',async()=>{
 let clock=0,angle=0;const budget=createHEarthBudget(20,()=>clock);
 await assert.rejects(aimHEarthAxis({axis:'yawDegrees',target:90,tolerance:6,read:async()=>({navigation:{yawDegrees:angle,sequence:angle}}),pulse:async()=>{angle+=5;clock+=21;},trace:[],now:()=>clock,bounded:budget.check}),/TIME_BUDGET_EXCEEDED/);
});
