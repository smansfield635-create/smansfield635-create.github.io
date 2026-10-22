import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {waitForHEarthNavigation,validateHEarthPreEntryPolicy,runHEarthPreEntry,validateDeclaredInteractions,assessHEarthInputReadiness,validateHEarthScenePolicy,assessHEarthJacarandaScene,runHEarthSceneQualification,observeHEarthSceneAsset} from './publication-live-verify.mjs';

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
    oasisTrees:{drawCount:1,placements:companions.map(id=>({id}))},cavernUnderstory:{drawCount:1,placements:['flower','fern','broadleaf'].map(kind=>({kind}))},cavernIvy:{drawCount:1},cavernPalms:{drawCount:1}
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
test('full H-Earth manifest selects bounded target proof while keeping entry contract',()=>{
  const m=JSON.parse(fs.readFileSync('.github/ai-router/publication-surfaces/h-earth.json','utf8'));
  assert.equal(m.runtime.sceneQualification,SCENE_POLICY);
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
