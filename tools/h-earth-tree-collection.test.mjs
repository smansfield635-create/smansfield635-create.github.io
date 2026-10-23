import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parseApprovedJacarandaGLB,JACARANDA_APPROVED_SHA256,JACARANDA_APPROVED_LENGTH} from '../showroom/globe/h-earth/render/geometry-jacaranda.v1.js';
import {assessHEarthTreeCollection} from './publication-live-verify.mjs';
import {TREE_ASSETS,TREE_PLACEMENTS,planTreePlacement,retainedIndexRanges,createTreeCollection} from '../showroom/globe/h-earth/render/geometry-tree-collection.v1.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const approved=new Map([
 ['Tree-Small-02-Candidate.glb',['236b81e864c2079dabe4c119c89c7315f0fbc4a00c96f02600e7e875342c6dc6',244717]],
 ['Coastal-Tree-01-v2-Candidate.glb',['b74dd63e6ee121a6ae913719a08cb8b29e28fb3d6a4c97d2d986c92a79f23bc7',363451]],
 ['Coastal-Tree-02-Candidate.glb',['6a1497c91d4a66ed26c1b56c92cdf30b5b934e00dab123bdf990930bf2aad0c2',261708]],
 ['Coastal-Tree-03-Candidate.glb',['02aad9751e876d2ac2512324b13d81525048d71c6795740ab372cf8e4d27515c',486878]],
 ['Maple-Large-A-Candidate.glb',['56462cb37f7a9ecca707c7095b630af9fa617de4f228c5db0ee0798de6cf87d5',22490]],
 ['Maple-Medium-A-Candidate.glb',['28a52894e3f08e060ab9eedc7908174f9d98eabc9832ef5a0a999100de7b64fa',14577]],
 ['Searsia-Lucida-A-Candidate.glb',['4fbb63bff910b2875cf2353c83eef94d7b04c6987c949a91e7635315076070f0',113405]],
 ['Gratitude-Jacaranda-Candidate.glb',[JACARANDA_APPROVED_SHA256,454746]]
]);
const arrayBuffer=b=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);
const filename=a=>path.basename(String(a.url));
const assetFile=a=>path.join(root,'showroom/globe/h-earth/assets',filename(a)==='Gratitude-Jacaranda-Candidate.glb'?'jacaranda':'tree-collection',filename(a));
const raw=a=>arrayBuffer(fs.readFileSync(assetFile(a)));
const contract=a=>a.contract??a;
function editJson(bytes,edit){
 const old=Buffer.from(bytes),jsonLength=old.readUInt32LE(12),gltf=JSON.parse(old.subarray(20,20+jsonLength).toString());
 edit(gltf);
 const json=Buffer.from(JSON.stringify(gltf)),padded=Buffer.alloc(Math.ceil(json.length/4)*4,0x20);json.copy(padded);
 const tail=old.subarray(20+jsonLength),out=Buffer.alloc(20+padded.length+tail.length);old.copy(out,0,0,20);
 out.writeUInt32LE(out.length,8);out.writeUInt32LE(padded.length,12);padded.copy(out,20);tail.copy(out,20+padded.length);
 return arrayBuffer(out);
}
const jac=()=>TREE_ASSETS.find(a=>filename(a)==='Gratitude-Jacaranda-Candidate.glb');
const maple=()=>TREE_ASSETS.find(a=>filename(a)==='Maple-Medium-A-Candidate.glb');

for(const a of TREE_ASSETS)test(`approved source custody and real decoder: ${a.id}`,()=>{
 const expected=approved.get(filename(a));assert.ok(expected,`Unapproved asset ${filename(a)}`);
 const bytes=raw(a),hash=createHash('sha256').update(Buffer.from(bytes)).digest('hex');
 assert.equal(hash,expected[0]);assert.equal(a.sha256,expected[0]);
 const decoded=parseApprovedJacarandaGLB(bytes,contract(a));
 assert.equal(decoded.triangleCount,expected[1]);assert.equal(decoded.assetLength,bytes.byteLength);
 assert.ok(decoded.parts.every(p=>p.indices instanceof Uint32Array));
 assert.ok(decoded.bounds.min.every(Number.isFinite)&&decoded.bounds.max.every(Number.isFinite));
 assert.ok(decoded.textures.flat().every(t=>t.bytes.byteLength>0));
 for(let i=0;i<decoded.parts.length;i++)assert.equal(decoded.parts[i].materialId,i);
});

test('original Jacaranda default parser retains approved identity and counts',()=>{
 const bytes=raw(jac());assert.equal(bytes.byteLength,JACARANDA_APPROVED_LENGTH);
 const d=parseApprovedJacarandaGLB(bytes);
 assert.equal(d.triangleCount,454746);assert.equal(d.vertexCount,651794);
 assert.deepEqual(d.alphaCutoffs,[0,0,.45]);assert.equal(d.textures.flat().length,9);
});

test('new model cannot pass through the original Jacaranda identity contract',()=>{
 assert.throws(()=>parseApprovedJacarandaGLB(raw(maple())),/ASSET_LENGTH_MISMATCH/);
});

test('contract mismatch rejects byte count, geometry census and leaf alpha drift',()=>{
 const a=maple(),bytes=raw(a),c=contract(a);
 assert.throws(()=>parseApprovedJacarandaGLB(bytes,{...c,bytes:c.bytes-1}),/ASSET_LENGTH_MISMATCH/);
 assert.throws(()=>parseApprovedJacarandaGLB(bytes,{...c,triangles:c.triangles+1}),/APPROVED_GEOMETRY_CENSUS_DRIFT/);
 assert.throws(()=>parseApprovedJacarandaGLB(bytes,{...c,alphaCutoffs:c.alphaCutoffs.map(()=>0)}),/LEAF_ALPHA_IDENTITY_DRIFT/);
});

test('out-of-range indices are rejected before GPU upload',()=>{
 const a=maple(),bytes=raw(a),dv=new DataView(bytes),len=dv.getUint32(12,true),g=JSON.parse(new TextDecoder().decode(new Uint8Array(bytes,20,len)));
 const accessor=g.accessors[g.meshes[0].primitives[0].indices],view=g.bufferViews[accessor.bufferView],offset=28+len+(view.byteOffset??0);
 if(accessor.componentType===5123)dv.setUint16(offset,65535,true);else dv.setUint32(offset,4294967295,true);
 assert.throws(()=>parseApprovedJacarandaGLB(bytes,contract(a)),/INDEX_OUT_OF_RANGE/);
});

test('unbaked transforms and unavailable image dependencies fail closed',()=>{
 const a=maple();
 for(const [mutate,expected] of [[g=>{g.nodes[0].translation=[1,0,0];},/UNBAKED_NODE_TRANSFORM/],[g=>{g.images[0].bufferView=999999;},/BUFFER_VIEW_RANGE/]]){
  const bytes=editJson(raw(a),mutate);
  assert.throws(()=>parseApprovedJacarandaGLB(bytes,{...contract(a),bytes:bytes.byteLength}),expected);
 }
});

test('collection replaces exactly seven legacy trees and retains original Jacaranda',()=>{
 const replacements=TREE_PLACEMENTS.filter(p=>p.replaces);
 assert.equal(replacements.length,7);
 assert.deepEqual(replacements.map(p=>p.replaces).sort(),['P2_TREE_A_03','P2_TREE_A_06','P2_TREE_A_08','P2_TREE_A_11','PROPOSED_OASIS_02','PROPOSED_OASIS_03','PROPOSED_OASIS_04'].sort());
 assert.ok(!replacements.some(p=>p.replaces==='PROPOSED_OASIS_01'));
 assert.equal(new Set(replacements.map(p=>p.assetId)).size,7);
 assert.equal(replacements.filter(p=>p.assetId==='jacaranda').length,1);
 assert.deepEqual(TREE_PLACEMENTS.filter(p=>!p.replaces).map(p=>p.assetId),['searsia']);
 assert.deepEqual([...new Set(TREE_PLACEMENTS.map(p=>p.group))].sort(),['oasis','woodland']);
 assert.equal(new Set(TREE_ASSETS.map(a=>a.id)).size,8);
 assert.equal(new Set(TREE_PLACEMENTS.map(p=>p.assetId)).size,8);
 assert.ok(TREE_ASSETS.every(a=>TREE_PLACEMENTS.some(p=>p.assetId===a.id)));
 assert.ok(!TREE_ASSETS.some(a=>/fir|pine|waterberry/i.test(a.id)));
});

const specimen={bounds:{min:[-2,-1,-4],max:[3,9,5]},trunkMinY:-1};
const specimenPlacement={id:'test-tree',x:10,z:20,scale:1,rotation:0};
const flat=()=>({y:12});
test('placement grounds trunk base and uses rotated canopy bounds',()=>{
 const p=planTreePlacement(specimen,{...specimenPlacement,rotation:Math.PI/2},flat);
 assert.equal(p.sourceBaseY,-1);assert.equal(p.anchor.y,11.94);assert.equal(p.heightMeters,10);
 assert.equal(p.groundWitnesses.length,5);
 const expected={minX:6,maxX:15,minZ:17,maxZ:22};
 for(const [k,v] of Object.entries(expected))assert.ok(Math.abs(p.canopy[k]-v)<1e-10,`${k}: ${p.canopy[k]}`);
});

test('placement rejects missing ground, root water, steep ground and invalid transforms',()=>{
 assert.throws(()=>planTreePlacement(specimen,specimenPlacement,()=>null),/GROUND_MISSING/);
 assert.throws(()=>planTreePlacement(specimen,specimenPlacement,flat,()=>({y:12})),/ROOT_IN_WATER/);
 assert.throws(()=>planTreePlacement(specimen,specimenPlacement,(x)=>({y:x===10?12:13})),/ROOT_SLOPE/);
 assert.throws(()=>planTreePlacement(specimen,specimenPlacement,(x)=>x===10?{y:12}:null),/ROOT_SUPPORT_MISSING/);
 for(const bad of [{x:NaN},{z:Infinity},{scale:0},{scale:-1},{scale:2},{rotation:NaN}])assert.throws(()=>planTreePlacement(specimen,{...specimenPlacement,...bad},flat),/PLACEMENT_TRANSFORM/);
});

test('draw subtraction preserves unrelated triangles across overlapping and clipped exclusions',()=>{
 const spans=[{indexStart:27,indexCount:9},{indexStart:9,indexCount:9},{indexStart:15,indexCount:9},{indexStart:60,indexCount:9}];
 assert.deepEqual(retainedIndexRanges(6,42,spans),[{indexStart:6,indexCount:3},{indexStart:24,indexCount:3},{indexStart:36,indexCount:12}]);
 assert.deepEqual(retainedIndexRanges(12,9,[{indexStart:0,indexCount:60}]),[]);
 assert.deepEqual(retainedIndexRanges(12,9,[{indexStart:0,indexCount:12},{indexStart:21,indexCount:3}]),[{indexStart:12,indexCount:9}]);
 assert.deepEqual(retainedIndexRanges(0,0,[]),[]);
});

test('triangle draw spans reject fractional, negative and unaligned index ranges',()=>{
 for(const args of [[-3,6,[]],[0,4,[]],[1,6,[]],[0,6,[{indexStart:0,indexCount:2}]]])assert.throws(()=>retainedIndexRanges(...args),/INDEX_RANGE|EXCLUSION_RANGE/);
});


test('unloaded collection cannot retire legacy trees or start distant downloads',()=>{
 const collection=createTreeCollection({}, {model:{sampleOutdoorAt:flat,sampleWaterAt:()=>null},raw:{buffers:{positions:[],indices:[]},primitiveSpans:[]},projectWorld:p=>p,originalJacaranda:{getReceipt:()=>({state:'READY'})}});
 assert.equal(collection.requestIfNear({x:10000,y:0,z:10000}),false);
 assert.equal(collection.woodlandReady(),false);
 for(const p of TREE_PLACEMENTS.filter(p=>p.replaces))assert.equal(collection.isReplaced(p.replaces),false);
 assert.equal(collection.isReplaced('PROPOSED_OASIS_01'),false);
 assert.ok(collection.getReceipt().entries.every(e=>e.state==='IDLE'&&!e.replacementActive));
 collection.dispose();collection.dispose();
 assert.equal(collection.requestIfNear({x:43,y:0,z:-315}),false);
 assert.ok(collection.getReceipt().entries.every(e=>e.state==='DISPOSED'));
});

test('collection waits while original Jacaranda is loading',()=>{
 const collection=createTreeCollection({}, {model:{sampleOutdoorAt:flat,sampleWaterAt:()=>null},raw:{buffers:{positions:[],indices:[]},primitiveSpans:[]},projectWorld:p=>p,originalJacaranda:{getReceipt:()=>({state:'LOADING'})}});
 assert.equal(collection.requestIfNear({x:43,y:0,z:-315}),false);
 assert.ok(collection.getReceipt().entries.every(e=>e.state==='IDLE'));
 collection.dispose();
});


function readyCollectionFixture(){
 const entries=TREE_PLACEMENTS.map(p=>{
  const a=TREE_ASSETS.find(a=>a.id===p.assetId);
  return {...p,assetSha256:a.sha256,ready:true,state:'READY',fallbackUsed:false,drawCount:2,
   loadedGeometry:{assetLength:a.bytes,triangles:a.triangles,vertices:a.vertices},
   vertexArrayCount:a.materials,textureCount:a.images,programCount:1,
   replacementActive:!!p.replaces,placement:{groundWitnesses:Array.from({length:5},(_,i)=>({x:p.x+(i-2)*.1,z:p.z,y:0}))},
   gpuResourceBytes:p.assetId==='jacaranda'?0:100,
   sharedGpuResources:p.assetId==='jacaranda',resourceOwner:p.assetId==='jacaranda'?'PROPOSED_OASIS_01':undefined};
 });
 return {resources:{treeCollection:{replacementCount:7,additionalShrubCount:1,entries,parkedAssetsIncluded:false},
   jacaranda:{ready:true,assetSha256:JACARANDA_APPROVED_SHA256,drawCount:4,gpuResourceBytes:1234},
   cavernUnderstory:{drawCount:3},cavernIvy:{drawCount:3},cavernPalms:{drawCount:3},geologicalFormation:{designedFreshwaterRendered:true}},
  assets:TREE_ASSETS.map(a=>({url:a.url,status:200,sha256:a.sha256,bytes:a.bytes}))};
}

test('collection assessment accepts exact ready assets and counts shared Jacaranda GPU memory once',()=>{
 const {resources,assets}=readyCollectionFixture(),assessment=assessHEarthTreeCollection(resources,assets,TREE_ASSETS);
 assert.equal(assessment.pass,true);assert.deepEqual(assessment.unmet,[]);
 assert.equal(assessment.gpuResourceBytes,1934);
});

for(const [name,change,condition] of [
 ['missing actual draw',r=>{r.treeCollection.entries[0].drawCount=0;},'allDrawn'],
 ['wrong resource hash',r=>{r.treeCollection.entries[0].assetSha256='0'.repeat(64);},'allApprovedResources'],
 ['missing texture',r=>{r.treeCollection.entries[0].textureCount=0;},'allApprovedResources'],
 ['fallback active',r=>{r.treeCollection.entries[0].fallbackUsed=true;},'allDrawn'],
 ['replacement inactive',r=>{r.treeCollection.entries[0].replacementActive=false;},'sevenReplacementsActive'],
 ['missing ground witness',r=>{r.treeCollection.entries[0].placement.groundWitnesses.pop();},'grounded'],
 ['original Jacaranda absent',r=>{delete r.jacaranda;},'originalJacaranda'],
 ['palms no longer drawn',r=>{r.cavernPalms.drawCount=0;},'existingEcology'],
 ['parked asset included',r=>{r.treeCollection.parkedAssetsIncluded=true;},'noParkedAssets'],
 ['missing collection member',r=>{r.treeCollection.entries.pop();},'exactPopulation']
])test(`collection assessment rejects ${name}`,()=>{
 const {resources,assets}=readyCollectionFixture();change(resources);
 const assessment=assessHEarthTreeCollection(resources,assets,TREE_ASSETS);
 assert.equal(assessment.pass,false);assert.ok(assessment.unmet.includes(condition),assessment.unmet.join(','));
});

for(const [name,change] of [
 ['missing fetched file',a=>a.pop()],
 ['wrong fetched hash',a=>{a[0].sha256='0'.repeat(64);}],
 ['wrong fetched byte count',a=>{a[0].bytes--;}],
 ['unsuccessful fetch status',a=>{a[0].status=404;}]
])test(`collection assessment rejects ${name}`,()=>{
 const {resources,assets}=readyCollectionFixture();change(assets);
 const assessment=assessHEarthTreeCollection(resources,assets,TREE_ASSETS);
 assert.equal(assessment.pass,false);assert.ok(assessment.unmet.includes('exactFetchedFiles'));
});
