import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const rendererPath=process.env.INTEGRATION_RENDERER??'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const routePath=process.env.INTEGRATION_ROUTE??'showroom/globe/h-earth/vegetation-prototype/route.js';
const source=fs.readFileSync(rendererPath,'utf8'),route=fs.readFileSync(routePath,'utf8');
const start=source.indexOf('async function loadAtlases('),end=source.indexOf('\n}',start)+2;
const loaderSource=source.slice(start,end);
function setup(failure){
 const bytes=new Uint8Array([1,2,3]),hash=crypto.createHash('sha256').update(bytes).digest('hex');
 const manifest={atlases:[{file:'a.png',width:2,height:2,sha256:hash},{file:'b.png',width:2,height:2,sha256:hash}]};
 let fetches=0,allocations=0,closes=0,disposed=false;
 const deleted=[],state=new Map([[1,8192],[2,'original'],[3,true],[4,true],[5,99],[6,4]]);
 const gl={MAX_TEXTURE_SIZE:1,TEXTURE_BINDING_2D:2,UNPACK_FLIP_Y_WEBGL:3,UNPACK_PREMULTIPLY_ALPHA_WEBGL:4,UNPACK_COLORSPACE_CONVERSION_WEBGL:5,UNPACK_ALIGNMENT:6,TEXTURE_2D:7,RGB8:8,RGB:9,UNSIGNED_BYTE:10,NONE:0,LINEAR:11,CLAMP_TO_EDGE:12,TEXTURE_MIN_FILTER:13,TEXTURE_MAG_FILTER:14,TEXTURE_WRAP_S:15,TEXTURE_WRAP_T:16,
 getParameter:p=>state.get(p),createTexture:()=>failure==='null'?null:{id:++allocations},deleteTexture:t=>deleted.push(t.id),bindTexture:(_,t)=>state.set(2,t),pixelStorei:(p,v)=>state.set(p,v),texImage2D:()=>{if(failure==='upload')throw Error('upload');},texParameteri:()=>{}};
 const context={Uint8Array,Blob,globalThis:{crypto:crypto.webcrypto},fetch:async()=>{fetches++;if(failure==='disposed'&&fetches===2)disposed=true;return {ok:!(failure==='http'&&fetches===2),arrayBuffer:async()=>bytes.buffer};},createImageBitmap:async()=>({width:failure==='dimensions'?3:2,height:2,close:()=>closes++})};
 const load=vm.runInNewContext('('+loaderSource+')',context);
 return {run:()=>load(gl,manifest,'/assets/',()=>disposed),deleted,state,manifest,stats:()=>({allocations,closes}),gl};
}
test('two atlases load and exact GL state is restored',async()=>{const f=setup();const textures=await f.run();assert.equal(textures.length,2);assert.deepEqual(f.stats(),{allocations:2,closes:2});assert.equal(f.state.get(2),'original');assert.deepEqual([3,4,5,6].map(k=>f.state.get(k)),[true,true,99,4]);});
for(const kind of ['http','dimensions','upload','null','disposed'])test('transactional cleanup on '+kind,async()=>{const f=setup(kind);await assert.rejects(f.run());assert.equal(f.deleted.length,f.stats().allocations);if(['upload','null','dimensions'].includes(kind))assert.equal(f.stats().closes,1);assert.equal(f.state.get(2),'original');});
test('hash failure rejects before GPU allocation',async()=>{const f=setup();f.manifest.atlases[0].sha256='bad';await assert.rejects(f.run(),/HASH/);assert.equal(f.stats().allocations,0);});
test('disposal is idempotent and prevents asynchronous installation',()=>{const a=source.indexOf('  function disposeCorrectedMaterial(){'),b=source.indexOf('\n  }',a)+4;const deleted=[],context={resources:{correctedTextures:[1,2]},correctedMaterialDisposed:false,gl:{deleteTexture:x=>deleted.push(x)}};vm.runInNewContext(source.slice(a,b)+'\ndisposeCorrectedMaterial();disposeCorrectedMaterial();',context);assert.deepEqual(deleted,[1,2]);assert.equal(context.correctedMaterialDisposed,true);assert.match(source,/loadAtlases\(gl,CORRECTED_MANIFEST,new URL\("\.\/corrected-material-v1\/",import.meta.url\).href,\(\)=>correctedMaterialDisposed,createTexture\)/);});
test('active route uses production cache identity and disposal, never refinement',()=>{assert.match(route,/gen2973-corrected-material-v1/);assert.match(route,/presenter\?\.cancel\(\);renderer\?\.disposeCorrectedMaterial\(\)/);assert.match(route,/pagehide.*!event.persisted/);assert.doesNotMatch(route,/activateInitialRefinement\s*\(/);});
test('frozen support, current-main soil and contact refresh preserved',()=>{const manifest=JSON.parse(source.split('\n')[0].slice('const CORRECTED_MANIFEST='.length,-1));assert.equal(manifest.charts.length,358);assert.deepEqual(manifest.atlases.map(x=>x.sha256),['b955d44ec908cdc1ea3ca18fc51f6dc513bbad5d5d8823da95a78e9c9bc83da7','78a1031c9cdcf9d9649bede330e50f18b192ccba40d49ec5af1f293fc70a8d5f']);assert.match(source,/fertilePatch=smoothstep\(\s*0\.42,0\.68,/);assert.match(source,/resources.corrected.expandAttribute\('contactDistances',contactField.packageDistances\)/);assert.match(source,/gl.vertexAttribI4ui\(11,0,0,0,0\)/);assert.doesNotMatch(source,/\/__h-earth-corrected-material\//);});
