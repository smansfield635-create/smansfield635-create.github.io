import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateHEarthPreEntryPolicy,runHEarthPreEntry,validateDeclaredInteractions} from './publication-live-verify.mjs';

const POLICY='H_EARTH_CONTROL_TEST_ENTER_V1';
function fakePage({timeoutAt=0,initialReady='false',initialMode='test',observed={},post={}}={}){
  const calls=[];
  let waits=0,reads=0;
  const page={
    waitForFunction:async()=>{calls.push('wait');waits++;if(timeoutAt===waits)throw Error('synthetic timing failure');},
    evaluate:async()=>{
      calls.push('evaluate');reads++;
      if(reads===1)return {mode:initialMode,ready:initialReady};
      if(reads===2)return {mode:'ready',disabled:false,inputChanged:true,inputRendered:true,nextFrame:true,gpuFrames:2,...observed};
      return {ready:'true',mode:'entered',hidden:true,...post};
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
test('missing authenticated post-click entry remains fail closed',async()=>{
  const {page}=fakePage({post:{ready:'false'}});
  await assert.rejects(runHEarthPreEntry(page,'h-earth',POLICY),/ENTER_CALLBACK_NOT_OBSERVED/);
});
test('registered full H-Earth manifest keeps true readiness and selected user interaction',()=>{
  const m=JSON.parse(fs.readFileSync(new URL('../.github/ai-router/publication-surfaces/h-earth.json',import.meta.url),'utf8'));
  assert.equal(m.runtime.preReadyEntry,POLICY);
  assert.deepEqual(m.runtime.readyAttribute,{selector:'#h-earth-functional-landscape-route',name:'data-run8e-ready',contains:'true'});
  assert.ok(m.runtime.interactions.some(x=>x.assertions.some(a=>a.name==='data-run8e-ready'&&a.value==='true')));
});
