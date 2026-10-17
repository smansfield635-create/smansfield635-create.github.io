import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {
  populatedContinuityEntryState,
  waitForPopulatedContinuity,
  reconcilePopulatedContinuity,
  qualifyVegetationContinuity,
} from './h-earth.cavern-vegetation-browser.v1.mjs';

// Resource names and nesting follow the retained exact-browser receipt. No
// invented trace-summary readiness flag substitutes for actual GPU resources.
function fixture(){
  return {
    receipt:{resources:{
      vegetationResidency:{preparationComplete:true,globalCoverComplete:true,
        woodlandFineGrassReady:true,complete:true,totalBatchCount:108,
        totalInstanceCount:27585,residentBatchCount:108,residentInstanceCount:27585,
        nearbyFineGrassError:null,nearbyFineCache:{key:'2:-98:24:32',requestRevision:18,stickyError:null,
          errorCount:0,lastPresentation:{key:'2:-98:24:32',requestRevision:18,complete:true,stickyError:null}}},
      woodlandFineGrass:{ready:true,visibleContacts:8,drawCallCount:1},
    }},
    probe:{enabled:true,x:0,z:-96,radius:2,
      installedFine:{rootCount:8,membershipDigest:'installed-8',digest:'ordered-installed-8'},
      selectedFine:{rootCount:8,membershipDigest:'selected-8',digest:'ordered-selected-8'}},
  };
}
function entry(f=fixture()){return populatedContinuityEntryState(f.receipt,f.probe);}

test('populated entry requires actual complete, installed and drawn resources',()=>{
  const r=entry();assert.equal(r.passed,true);assert.deepEqual(r.unmet,[]);
});

for(const field of ['preparationComplete','globalCoverComplete','woodlandFineGrassReady','complete']){
  test(`entry blocks incomplete ${field}`,()=>{
    const f=fixture();f.receipt.resources.vegetationResidency[field]=false;
    assert.equal(entry(f).passed,false);assert.ok(entry(f).unmet.length);
  });
}
for(const [field,value] of [['residentBatchCount',107],['residentInstanceCount',27584],['totalBatchCount',0],['totalInstanceCount',0]]){
  test(`entry blocks invalid residency ${field}=${value}`,()=>{
    const f=fixture();f.receipt.resources.vegetationResidency[field]=value;
    assert.equal(entry(f).passed,false);
  });
}
for(const [field,value] of [['ready',false],['visibleContacts',0],['drawCallCount',0]]){
  test(`entry blocks fine grass ${field}=${value}`,()=>{
    const f=fixture();f.receipt.resources.woodlandFineGrass[field]=value;
    assert.equal(entry(f).passed,false);
  });
}
test('entry rejects completed but stale camera-cell presentation',()=>{
  const f=fixture();f.receipt.resources.vegetationResidency.nearbyFineCache.lastPresentation.key='6:-98:24:32';
  assert.equal(entry(f).passed,false);
});
test('entry rejects incomplete current presentation',()=>{
  const f=fixture();f.receipt.resources.vegetationResidency.nearbyFineCache.lastPresentation.complete=false;
  assert.equal(entry(f).passed,false);
});
for(const mutate of [
  v=>{v.nearbyFineGrassError='build failed';},
  v=>{v.nearbyFineCache.stickyError='sticky cache error';},
  v=>{v.nearbyFineCache.lastPresentation.stickyError='sticky presentation error';},
])test('entry blocks nearby error despite ready flags',()=>{
  const f=fixture();mutate(f.receipt.resources.vegetationResidency);assert.equal(entry(f).passed,false);
});
for(const mutate of [p=>{p.enabled=false;},p=>{p.installedFine.rootCount=0;},p=>{p.selectedFine.rootCount=0;}]){
  test('entry blocks absent local probe population',()=>{const f=fixture();mutate(f.probe);assert.equal(entry(f).passed,false);});
}
test('missing resources do not become a successful entry',()=>{
  assert.equal(populatedContinuityEntryState({},{}).passed,false);
});
test('real-shaped empty completed nearby cache remains a blocked entry',()=>{
  const f=fixture();const v=f.receipt.resources.vegetationResidency;
  v.nearbyFineCache.lastPresentation.contactCount=0;
  f.probe.installedFine.rootCount=0;f.probe.selectedFine.rootCount=0;
  f.receipt.resources.woodlandFineGrass.visibleContacts=0;
  f.receipt.resources.woodlandFineGrass.drawCallCount=0;
  assert.equal(entry(f).passed,false);
});

function pollingFixture(f){
  let milliseconds=0,probes=[];
  const binding={getReceipt:()=>f.receipt,getVegetationProbe:control=>{probes.push({...control});return f.probe;}};
  const intake={getNavigationState:()=>({position:{x:12,y:3,z:-80},yawDegrees:0,pitchDegrees:0})};
  return {binding,intake,now:()=>milliseconds,delay:async ms=>{milliseconds+=ms;},probes};
}
test('entry waiter returns fixed world control without navigating',async()=>{
  const clock=pollingFixture(fixture());const r=await waitForPopulatedContinuity({...clock,timeoutMilliseconds:100,pollMilliseconds:10});
  assert.equal(r.passed,true);assert.deepEqual(r.control,{x:12,z:-80,radius:2});
  assert.ok(clock.probes.length);assert.ok(clock.probes.every(p=>p.x===12&&p.z===-80&&p.radius===2));
});
test('timeout preserves failed entry evidence and never invokes wheel movement',async()=>{
  const f=fixture();f.probe.installedFine.rootCount=0;f.probe.selectedFine.rootCount=0;
  const clock=pollingFixture(f);let movement=0;clock.intake.dispatchEvent=()=>{movement++;};
  const r=await waitForPopulatedContinuity({...clock,timeoutMilliseconds:30,pollMilliseconds:10});
  assert.equal(r.passed,false);assert.ok(r.unmet.length);assert.equal(r.elapsedMilliseconds,30);assert.equal(movement,0);
});
test('waiter allows actual resources to become populated during bounded polling',async()=>{
  const f=fixture();f.receipt.resources.woodlandFineGrass.ready=false;
  const clock=pollingFixture(f);const tick=clock.delay;
  clock.delay=async ms=>{await tick(ms);f.receipt.resources.woodlandFineGrass.ready=true;};
  const r=await waitForPopulatedContinuity({...clock,timeoutMilliseconds:100,pollMilliseconds:10});
  assert.equal(r.passed,true);assert.equal(r.elapsedMilliseconds,10);
});
for(const value of [NaN,Infinity,-1])test(`non-finite or negative residency count cannot pass (${value})`,()=>{
  const f=fixture();const v=f.receipt.resources.vegetationResidency;
  v.totalBatchCount=value;v.residentBatchCount=value;assert.equal(entry(f).passed,false);
});
test('readiness function does not mutate the receipt or probe',()=>{
  const f=fixture(),before=structuredClone(f);entry(f);assert.deepEqual(f,before);
});

test('entry rejects same-cell presentation from earlier request revision',()=>{
  const f=fixture(),c=f.receipt.resources.vegetationResidency.nearbyFineCache;
  c.requestRevision=18;c.lastPresentation.requestRevision=2;assert.equal(entry(f).passed,false);
});
function observation(label,{x=4,y=3,z=-96,yawDegrees=0,pitchDegrees=-8,installed='installed-8',selected='selected-8',controlX=0,draw=1}={}){
  return {label,position:{x,y,z},yawDegrees,pitchDegrees,
    fixedControl:{x:controlX,z:-96,radius:2,
      installedFine:{rootCount:8,membershipDigest:installed,sample:[]},
      selectedFine:{rootCount:8,membershipDigest:selected,sample:[]}},
    fineDraw:{visibleContacts:draw?8:0,drawCallCount:draw}};
}
function pair(options={}){return reconcilePopulatedContinuity([observation('FORWARD_1'),observation('RETURN_1',options)]);}
test('matching pose and fixed control reconcile installed and selected population',()=>{
  const r=pair();assert.equal(r.matchingPosePairCount,1);assert.equal(r.installedMembershipStable,true);
  assert.equal(r.pairs[0].classification,'INSTALLED_AND_SELECTED_MATCH_DRAW_SUBMITTED');
});
test('changed installed membership is classified before selection changes',()=>{
  const r=pair({installed:'replacement',selected:'replacement'});
  assert.equal(r.pairs[0].classification,'INSTALLED_MEMBERSHIP_CHANGED');assert.equal(r.installedMembershipStable,false);
});
test('same installed roots with altered selection isolates selection boundary',()=>{
  assert.equal(pair({selected:'different-selection'}).pairs[0].classification,'SELECTION_CHANGED_AT_MATCHING_POSE');
});
test('same membership without a global draw submission does not claim visible success',()=>{
  const r=pair({draw:0});assert.equal(r.pairs[0].classification,'NO_FINE_DRAW_SUBMISSION');assert.equal(r.visiblePixelsVerified,false);
});
for(const options of [{x:8},{yawDegrees:20},{pitchDegrees:4}])test('different camera pose cannot be paired as approach and return',()=>{
  assert.equal(pair(options).matchingPosePairCount,0);
});
test('different fixed world control is explicitly rejected',()=>{
  assert.equal(pair({controlX:4}).pairs[0].classification,'CONTROL_BINDING_MISMATCH');
});
test('ordered digest alone does not mark unchanged membership as replacement',()=>{
  const a=observation('FORWARD_1'),b=observation('RETURN_1');
  a.fixedControl.installedFine.digest='ordered-a';b.fixedControl.installedFine.digest='ordered-b';
  assert.equal(reconcilePopulatedContinuity([a,b]).pairs[0].installedEqual,true);
});
test('different root samples catch a noncryptographic membership digest collision',()=>{
  const a=observation('FORWARD_1'),b=observation('RETURN_1');
  a.fixedControl.installedFine.rootCount=b.fixedControl.installedFine.rootCount=1;
  a.fixedControl.installedFine.sample=[{x:0,z:0}];b.fixedControl.installedFine.sample=[{x:1,z:0}];
  assert.equal(reconcilePopulatedContinuity([a,b]).pairs[0].classification,'INSTALLED_MEMBERSHIP_CHANGED');
});

test('populated qualifier publishes empty-entry failure before constructing wheel events',async()=>{
  const f=fixture();f.probe.installedFine.rootCount=0;f.probe.selectedFine.rootCount=0;
  const clock=pollingFixture(f),priorWindow=globalThis.window,priorWheel=globalThis.WheelEvent;
  let wheels=0,moves=0;globalThis.window={};globalThis.WheelEvent=class{constructor(){wheels++;}};
  clock.binding.getVegetationTrace=()=>({enabled:true,events:[],lastSequence:0});
  const root={dataset:{}};
  try{
    const result=await qualifyVegetationContinuity({...clock,canvas:{dispatchEvent(){moves++;}},root,
      requirePopulated:true,entryTimeoutMilliseconds:0,stationaryMilliseconds:0,steps:1,stepDelayMilliseconds:100});
    assert.equal(result.result,'POPULATED_ENTRY_FAILED');assert.equal(result.movementAttempted,false);
    assert.equal(result.entryQualification.passed,false);assert.ok(result.entryQualification.unmet.length);
    assert.equal(root.dataset.vegetationContinuityReplay,'entry-failed');
    assert.equal(window.H_EARTH_VEGETATION_CONTINUITY_QUALIFICATION,result);assert.equal(wheels,0);assert.equal(moves,0);
  }finally{globalThis.window=priorWindow;globalThis.WheelEvent=priorWheel;}
});

test('legacy qualifier default still performs wheel replay without populated-entry resources',async()=>{
  const priorWindow=globalThis.window,priorWheel=globalThis.WheelEvent,priorTimer=globalThis.setTimeout;
  let z=-96,moves=0;
  globalThis.window={};globalThis.WheelEvent=class{constructor(type,options){Object.assign(this,{type,...options});}};
  globalThis.setTimeout=(resolve)=>{resolve();return 0;};
  const binding={getVegetationTrace:()=>({enabled:true,events:[],lastSequence:0}),
    getReceipt:()=>({}),getVegetationProbe:()=>({enabled:true,installedFine:{rootCount:0},selectedFine:{rootCount:0}})};
  const intake={getNavigationState:()=>({position:{x:0,y:3,z},yawDegrees:0,pitchDegrees:-8,sequence:moves})};
  try{
    const result=await qualifyVegetationContinuity({binding,intake,canvas:{dispatchEvent(e){moves++;z+=e.deltaY<0?4:-4;}},
      stationaryMilliseconds:0,steps:1,stepDelayMilliseconds:100});
    assert.equal(result.result,'TRACE_CAPTURED_VISUAL_VERDICT_NOT_ESTABLISHED');assert.equal(moves,2);
    assert.equal(result.returnDistanceMeters,0);assert.equal(result.entryQualification,undefined);
  }finally{globalThis.window=priorWindow;globalThis.WheelEvent=priorWheel;globalThis.setTimeout=priorTimer;}
});
test('missing request revisions cannot masquerade as matching current installation',()=>{
  const f=fixture(),c=f.receipt.resources.vegetationResidency.nearbyFineCache;
  delete c.requestRevision;delete c.lastPresentation.requestRevision;assert.equal(entry(f).passed,false);
});
test('camera eye elevation must match before selection comparisons are meaningful',()=>{
  assert.equal(pair({y:9}).matchingPosePairCount,0);
});
test('camera movement during entry wait invalidates fixed-control entry',async()=>{
  const f=fixture();f.receipt.resources.woodlandFineGrass.ready=false;
  const clock=pollingFixture(f);let x=12;
  clock.intake.getNavigationState=()=>({position:{x,y:3,z:-80},yawDegrees:0,pitchDegrees:0});
  const tick=clock.delay;clock.delay=async ms=>{await tick(ms);x=16;f.receipt.resources.woodlandFineGrass.ready=true;};
  const r=await waitForPopulatedContinuity({...clock,timeoutMilliseconds:100,pollMilliseconds:10});
  assert.equal(r.passed,false);assert.ok(r.unmet.includes('ENTRY_CAMERA_CHANGED'));assert.equal(r.elapsedMilliseconds,10);
});
test('truncated differing samples cannot prove installed replacement despite matching digest',()=>{
  const a=observation('FORWARD_1'),b=observation('RETURN_1');
  a.fixedControl.installedFine.sample=[{x:0,z:0}];b.fixedControl.installedFine.sample=[{x:1,z:0}];
  assert.equal(reconcilePopulatedContinuity([a,b]).pairs[0].classification,'INSTALLED_SUMMARY_OR_SAMPLE_CHANGED_UNRESOLVED');
});
test('reordered bounded samples preserve membership reconciliation',()=>{
  const a=observation('FORWARD_1'),b=observation('RETURN_1');
  a.fixedControl.installedFine.sample=[{x:0,z:0},{x:1,z:0}];
  b.fixedControl.installedFine.sample=[{x:1,z:0},{x:0,z:0}];
  assert.equal(reconcilePopulatedContinuity([a,b]).pairs[0].classification,'INSTALLED_AND_SELECTED_MATCH_DRAW_SUBMITTED');
});
test('integration startup gate bypasses nearby readiness only for explicit populated continuity',()=>{
  const source=readFileSync(new URL('../../showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',import.meta.url),'utf8');
  const selector=source.match(/const continuityReplayRequested=[\s\S]*?let continuityReplayStarted=/)?.[0].replace(/let continuityReplayStarted=$/,'');
  const guard=source.match(/if \((readyPublished \|\| !firstFramePublished[^\n]+)\) return false;/)?.[1];
  assert.ok(selector);assert.ok(guard);
  function blocked(search,{trace=true,first=true,ready=false,nearby=false}={}){
    const context={URLSearchParams,location:{search},continuityTraceRequested:trace,
      firstFramePublished:first,readyPublished:ready,nearbyGroundReady:nearby};
    return vm.runInNewContext(`${selector}\n(${guard})`,context);
  }
  const populated='?qualification=vegetation-continuity-v1&continuity-entry=populated-v1';
  assert.equal(blocked(populated),false,'explicit selected populated entry can diagnose empty patch');
  assert.equal(blocked(populated,{first:false}),true,'first frame remains required');
  assert.equal(blocked(populated,{ready:true}),true,'published readiness remains terminal');
  assert.equal(blocked(populated,{trace:false}),true,'trace must be explicitly enabled');
  assert.equal(blocked('?qualification=vegetation-continuity-v1'),true,'legacy continuity still waits for nearby readiness');
  assert.equal(blocked('?continuity-entry=populated-v1'),true,'populated token alone does not activate bypass');
  assert.equal(blocked(''),true,'default runtime still waits for nearby readiness');
  assert.equal(blocked('',{nearby:true}),false,'legacy ready resources continue normally');
});
