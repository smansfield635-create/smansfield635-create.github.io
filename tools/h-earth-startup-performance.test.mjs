import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchStartupAsset,loadPrecomputedOasisSoil} from '../showroom/globe/h-earth/render/precomputed-oasis-soil.v1.js';
import {loadPrecomputedGrass} from '../showroom/globe/h-earth/render/precomputed-grass.v1.js';
const url=new URL('https://example.test/assets/startup.bin?sha=bound');

test('startup transport retry is bounded and preserves resource identity',async()=>{
 let calls=0;const pauses=[];
 const bytes=await fetchStartupAsset(url,{fetchImpl:async received=>{assert.equal(received,url);if(++calls===1)throw new TypeError('network interrupted');return new Response(new Uint8Array([7,8]));},pause:async ms=>pauses.push(ms)});
 assert.deepEqual([...bytes],[7,8]);assert.equal(calls,2);assert.deepEqual(pauses,[250]);
});

test('startup body retry discards partial bytes and reads a fresh response',async()=>{
 let calls=0;const attempts=[];
 const bytes=await fetchStartupAsset(url,{pause:async()=>{},fetchImpl:async()=>{
  const attempt=++calls;let step=0;
  return new Response(new ReadableStream({pull(controller){if(step++===0)controller.enqueue(new Uint8Array(attempt===1?[99]:[2,3]));else if(attempt===1)controller.error(new TypeError('body interrupted'));else controller.close();}}));
 },readBody:async response=>{
  const chunks=[];attempts.push(chunks);const reader=response.body.getReader();
  try{for(;;){const {value,done}=await reader.read();if(done)break;chunks.push(...value);}return new Uint8Array(chunks);}finally{reader.releaseLock();}
 }});
 assert.equal(calls,2);assert.deepEqual(attempts,[[99],[2,3]]);assert.deepEqual([...bytes],[2,3]);
});

for(const status of [408,429,500,502,503,504])test(`startup HTTP ${status} retries once`,async()=>{
 let calls=0;const pauses=[];
 const result=await fetchStartupAsset(url,{fetchImpl:async()=>++calls===1?new Response('',{status}):new Response('ok'),pause:async ms=>pauses.push(ms)});
 assert.equal(new TextDecoder().decode(result),'ok');assert.equal(calls,2);assert.deepEqual(pauses,[250]);
});

for(const status of [400,401,403,404])test(`startup permanent HTTP ${status} fails with named resource without retry`,async()=>{
 let calls=0;
 await assert.rejects(fetchStartupAsset(url,{fetchImpl:async()=>{calls++;return new Response('',{status});},pause:async()=>assert.fail('unexpected retry')}),error=>error.message===`STARTUP_ASSET_FAILED:/assets/startup.bin:HTTP_${status}`&&error.cause.message===`HTTP_${status}`);
 assert.equal(calls,1);
});

test('repeated transport failure retains named resource and final cause',async()=>{
 let calls=0;const failure=new TypeError('offline');
 await assert.rejects(fetchStartupAsset(url,{fetchImpl:async()=>{calls++;throw failure;},pause:async()=>{}}),error=>error.message==='STARTUP_ASSET_FAILED:/assets/startup.bin:offline'&&error.cause===failure);
 assert.equal(calls,2);
});

test('stream integrity failures do not trigger transport retries',async()=>{
 let calls=0;
 await assert.rejects(fetchStartupAsset(url,{fetchImpl:async()=>{calls++;return new Response('bad');},readBody:async()=>{throw Error('COMPRESSED_INTEGRITY_LENGTH');},pause:async()=>assert.fail('unexpected retry')}),/STARTUP_ASSET_FAILED:\/assets\/startup.bin:COMPRESSED_INTEGRITY_LENGTH/);
 assert.equal(calls,1);
});

for(const [name,load,reason] of [
 ['soil',fetchImpl=>loadPrecomputedOasisSoil({}, {fetchImpl}),'OASIS_SOIL_ASSET_INTEGRITY'],
 ['grass',fetchImpl=>loadPrecomputedGrass({fetchImpl}),'MANIFEST_INTEGRITY']
])test(`${name} hash mismatch fails after one successful download`,async()=>{
 let calls=0;
 await assert.rejects(load(async()=>{calls++;return new Response('{}');}),new RegExp(reason));
 assert.equal(calls,1);
});
