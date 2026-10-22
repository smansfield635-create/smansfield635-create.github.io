import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateHEarthPreEntryPolicy,runHEarthPreEntry,validateDeclaredInteractions,assessHEarthInputReadiness} from './publication-live-verify.mjs';

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
