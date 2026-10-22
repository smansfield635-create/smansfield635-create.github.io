import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {applyHEarthVerifiedPlantingPackage} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate} from '../environment/h-earth.gen2514-qualified-placement-authority.js';
import * as oasis from '../../showroom/globe/h-earth/render/geometry-oasis-tree-group.v1.js';
import * as jacaranda from '../../showroom/globe/h-earth/render/geometry-jacaranda.v1.js';
const BASELINE='291b233f387f73599e38061de9260f6489ce6634';
const ORIGINALS=[{id:'PROPOSED_OASIS_01',x:55.5,z:-307.5},{id:'PROPOSED_OASIS_02',x:47.5,z:-317.5},{id:'PROPOSED_OASIS_03',x:71.5,z:-291.5},{id:'PROPOSED_OASIS_04',x:63.5,z:-301.5}];
const hash=value=>crypto.createHash('sha256').update(value instanceof Uint8Array?value:JSON.stringify(value)).digest('hex');
const baked=JSON.parse(zlib.gunzipSync(fs.readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url))));
const hydrated=applyHEarthVerifiedPlantingPackage(baked.raw,{canonicalBase:baked.canonical});
const originalPackageHash=hash(hydrated);
const originalIndexHash=hash(hydrated.buffers.indices),originalWorldHash=hash(hydrated.buffers.positions);
const model=constructGeologicalRuntimeBridge(hydrated);
const terrainHash=hash(model.meshes.map(p=>[p.role,Array.from(p.mesh.positions),Array.from(p.mesh.indices)]));
// API bindings are set to the actual admitted implementation below.
const started=performance.now(),group=oasis.buildOasisTreeGroup(model,hydrated),buildMs=performance.now()-started;
const retired=oasis.suppressOasisTreeGroupIndices(Uint32Array.from(hydrated.buffers.indices),hydrated.primitiveSpans);
const source=fs.readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const localVertices=part=>Array.from({length:part.mesh.vertexCount},(_,i)=>unprojectPlanetVertex(...part.mesh.positions.slice(i*3,i*3+3)));
const bark=group.meshes.find(p=>p.part==='BARK'),canopy=group.meshes.find(p=>p.part==='CANOPY');
const localBark=localVertices(bark),localCanopy=localVertices(canopy);
test('normal hydrated package retires precisely the eight cavern-group spans and preserves every other index',()=>{
 const expected=hydrated.primitiveSpans.filter(s=>ORIGINALS.some(t=>s.primitiveId==='H_EARTH_GEN2800_'+t.id+'_BARK'||s.primitiveId==='H_EARTH_GEN2800_'+t.id+'_CANOPY'));
 assert.equal(expected.length,8);assert.deepEqual([...retired.receipt.retiredSpanIds].sort(),expected.map(s=>s.primitiveId).sort());
 const mask=new Uint8Array(hydrated.buffers.indices.length);for(const s of expected)mask.fill(1,s.indexStart,s.indexStart+s.indexCount);
 assert.equal(retired.indices.length,hydrated.buffers.indices.length);let count=0;
 for(let i=0;i<mask.length;i+=3){if(mask[i]){assert.equal(retired.indices[i],retired.indices[i+1]);assert.equal(retired.indices[i],retired.indices[i+2]);count++;}else assert.deepEqual(Array.from(retired.indices.slice(i,i+3)),hydrated.buffers.indices.slice(i,i+3),'unrelated index changed at '+i);}
 assert.equal(retired.receipt.retiredTriangleCount,count);assert.equal(count,18400);
 assert.equal(hash(hydrated.buffers.indices),originalIndexHash);assert.equal(hash(hydrated.buffers.positions),originalWorldHash);assert.equal(hash(hydrated),originalPackageHash);
});
test('all four rendered replacements are deterministic and preserve actual ground meshes',()=>{
 assert.equal(group.meshes.length,2);assert.equal(group.receipt.drawBatchCount,2);assert.equal(group.receipt.shadowCasterBatchCount,0);
 assert.deepEqual(group.receipt.placements.map(p=>p.id).sort(),ORIGINALS.map(p=>p.id).sort());
 assert.ok(group.receipt.triangleCount<=36000);assert.ok(group.receipt.gpuByteLength<=5*1024*1024);assert.equal(group.receipt.perFrameGeneration,false);
 assert.equal(hash(model.meshes.map(p=>[p.role,Array.from(p.mesh.positions),Array.from(p.mesh.indices)])),terrainHash);
 const again=oasis.buildOasisTreeGroup(model,hydrated);assert.deepEqual(again.receipt,group.receipt);
 for(let i=0;i<2;i++){assert.deepEqual(again.meshes[i].mesh.positions,group.meshes[i].mesh.positions);assert.deepEqual(again.meshes[i].mesh.indices,group.meshes[i].mesh.indices);}
});
test('actual projected meshes have finite nondegenerate faces, usable normals, and existing bark/leaf atlas attributes',()=>{
 for(const part of group.meshes){const {positions:p,indices}=part.mesh,sums=new Float64Array(p.length);assert.ok(p.every(Number.isFinite));assert.equal(part.colors.length,part.mesh.vertexCount);assert.equal(part.clearingAttributes.length,part.mesh.vertexCount);
  for(let i=0;i<indices.length;i+=3){const ids=Array.from(indices.slice(i,i+3));assert.ok(ids.every(j=>j>=0&&j<part.mesh.vertexCount));const [a,b,c]=ids.map(j=>Array.from(p.slice(j*3,j*3+3))),u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-a[k]);const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];assert.ok(Math.hypot(...normal)>1e-10,'degenerate '+part.part+' face '+i/3);for(const j of ids)for(let k=0;k<3;k++)sums[j*3+k]+=normal[k];}
  for(let i=0;i<sums.length;i+=3)assert.ok(Math.hypot(...sums.slice(i,i+3))>1e-10,'cancelled normal');
  assert.ok(part.clearingAttributes.every(a=>a.length===3&&a.every(Number.isFinite)&&a[2]===(part.part==='CANOPY'?2:1)));
  if(part.part==='CANOPY')assert.ok(part.clearingAttributes.every(a=>a[0]>=0&&a[0]<=1&&a[1]>=0&&a[1]<=1));
 }
});
test('four retained tree identities use bounded irregular dry-ground placements',()=>{
 const offsets=[];for(const p of group.receipt.placements){const old=ORIGINALS.find(t=>t.id===p.id);assert.ok(old);assert.ok(Math.hypot(p.x-old.x,p.z-old.z)<=6.0001);const g=model.sampleOutdoorAt(p.x,p.z),w=model.sampleWaterAt(p.x,p.z);assert.ok(g);assert.ok(!w||w.y<g.y-.02);offsets.push([p.x-old.x,p.z-old.z]);}
 assert.ok(offsets.some(([x,z])=>Math.hypot(x,z)>.5),'row placement unchanged');
 assert.ok(new Set(offsets.map(v=>v.map(n=>n.toFixed(2)).join(','))).size>=3,'uniform relocation only');
 for(const a of group.receipt.placements)for(const b of group.receipt.placements)if(a.id<b.id)assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>4,'trunk spacing conflict');
});
test('reused precomputed startup, original tree geometry and planting packet remain byte-identical',()=>{
 const expected={'live-render-package.run8e-r2.canonical.js':'47b446b1a99136a610f1940971dfa23e34978466f05370d5e8196d6e2c1c38f5','live-render-package.run8e-r2.js':'95a4d661a238c7e3155093cd681e16d35a72b43c4b6c6d638713cb20f28a4876','verified-planting-packet.v1.js':'f586afa2ae1ec2ce6c6d923445258997d1959f3e5102d66653aa96efb029fc27','geometry-aged-woodland-tree.v1.js':'14256b21fc98315e5801b3efde46b2b7134b82ab76c33f729f18addf18b7a5db','assets/woodland-clearing-leaf.png':'ac6d40cae1fb958ea375d6c23f4297430eb30b8c1ffebaa93728416fde6b2a98'};
 for(const [name,sha] of Object.entries(expected))assert.equal(hash(fs.readFileSync(new URL('../../showroom/globe/h-earth/render/'+name,import.meta.url))),sha,name);
 assert.match(source,/buildOasisTreeGroup\(model,renderPackage\)/);assert.match(source,/suppressOasisTreeGroupIndices\(/);assert.match(source,/buildCoveragePreservingLeafMipmaps\(/);
});
function readRGBApng(buffer){
 assert.equal(buffer.subarray(1,4).toString(),'PNG');let width,height,bitDepth,colorType,interlace;const compressed=[];
 for(let o=8;o<buffer.length;){const length=buffer.readUInt32BE(o),type=buffer.subarray(o+4,o+8).toString(),data=buffer.subarray(o+8,o+8+length);if(type==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);bitDepth=data[8];colorType=data[9];interlace=data[12];}if(type==='IDAT')compressed.push(data);o+=length+12;}
 assert.equal(bitDepth,8);assert.equal(colorType,6);assert.equal(interlace,0);const input=zlib.inflateSync(Buffer.concat(compressed)),out=new Uint8Array(width*height*4),stride=width*4;
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const filter=input[y*(stride+1)];for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=4?out[i-4]:0,b=y?out[i-stride]:0,c=y&&x>=4?out[i-stride-4]:0,raw=input[y*(stride+1)+1+x];assert.ok(filter<=4);out[i]=(raw+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;}}
 return {pixels:out,width,height};
}
const leaf=readRGBApng(fs.readFileSync(new URL('../../showroom/globe/h-earth/render/assets/woodland-clearing-leaf.png',import.meta.url)));
test('actual existing leaf texture retains both atlas recipes through coarse minification without changing near texels',()=>{
 const levels=oasis.buildCoveragePreservingLeafMipmaps(leaf.pixels,leaf.width,leaf.height,.45);assert.equal(levels.length,9);assert.deepEqual(levels[0].pixels,leaf.pixels);
 for(const l of levels){assert.equal(l.pixels.length,l.width*l.height*4);if(l.width>=2){for(let side=0;side<2;side++){let survivors=0;for(let y=0;y<l.height;y++)for(let x=side*l.width/2;x<(side+1)*l.width/2;x++)survivors+=l.pixels[(y*l.width+x)*4+3]>=115;assert.ok(survivors>0,`atlas half${side} vanishes at${l.width}`);}}else assert.ok(l.pixels[3]>=115,'last mip is wholly transparent');}
 assert.deepEqual(oasis.buildCoveragePreservingLeafMipmaps(leaf.pixels,256,256,.45),levels);
});
test('root witnesses agree with actual outdoor triangles and stay dry',()=>{
 assert.ok(group.contacts.length>=4*3);
 for(const c of group.contacts){const ground=model.sampleOutdoorAt(c.x,c.z),water=model.sampleWaterAt(c.x,c.z);assert.ok(ground);assert.ok(Math.abs(ground.y-c.surfaceY)<1e-6,'root witness wrong surface');assert.ok(ground.y-c.meshY>=.029,'root edge floats');assert.ok(ground.y-c.meshY<=.351,'root deeply buried');assert.ok(!water||water.y<ground.y-.02,'wet root');}
 assert.throws(()=>oasis.buildOasisTreeGroup({...model,sampleOutdoorAt:()=>null},hydrated),/SUPPORT|CONTACT/);
 assert.throws(()=>oasis.buildOasisTreeGroup({...model,sampleWaterAt:()=>({y:1000})},hydrated),/WATER|DRY_SUPPORT/);
});
test('owner repair restores all four original hydrated shapes, topology, UVs and colors by rigid translation',()=>{
 const focus=group.receipt.placements.find(p=>p.id==='PROPOSED_OASIS_01');assert.equal(focus.x,55.5);assert.equal(focus.z,-307.5);
 for(const p of group.receipt.placements)for(const part of group.meshes){
  assert.equal(p.shapeTemplate,'HYDRATED_ORIGINAL');assert.equal(part.colorsAreLinear,true);
  const src=hydrated.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_GEN2800_'+p.id+'_'+part.part),dst=p.spans[part.part],out=part.part==='BARK'?localBark:localCanopy;
  assert.equal(dst.vertexCount,src.vertexCount);assert.equal(dst.indexCount,src.indexCount);
  for(let i=0;i<src.vertexCount;i++){
   const orig=unprojectPlanetVertex(...hydrated.buffers.positions.slice((src.vertexStart+i)*3,(src.vertexStart+i)*3+3).map(Math.fround)),v=out[dst.vertexStart+i];
   for(const [k,key]of ['x','y','z'].entries())assert.ok(Math.abs(v[key]-orig[key]-p.translation[key])<.001,'original form distorted '+p.id+' '+part.part+' '+key);
   assert.deepEqual(part.clearingAttributes[dst.vertexStart+i],hydrated.clearingAttributes.slice((src.vertexStart+i)*3,(src.vertexStart+i)*3+3));
   assert.deepEqual(part.colors[dst.vertexStart+i],hydrated.buffers.baseColorsLinear.slice((src.vertexStart+i)*4,(src.vertexStart+i)*4+3));
  }
  for(let i=0;i<src.indexCount;i++)assert.equal(part.mesh.indices[dst.indexStart+i]-dst.vertexStart,hydrated.buffers.indices[src.indexStart+i]-src.vertexStart);
 }
 const line=ORIGINALS[2],origin=ORIGINALS[1],dx=line.x-origin.x,dz=line.z-origin.z,len=Math.hypot(dx,dz);
 const side=p=>(dx*(p.z-origin.z)-dz*(p.x-origin.x))/len;
 const offsets=group.receipt.placements.map(p=>side(p)-side(ORIGINALS.find(o=>o.id===p.id)));
 assert.ok(Math.max(...offsets)>3&&Math.min(...offsets)<-3,'placements must break original alignment in both directions');
});
const boundsDistance=(a,b)=>Math.hypot(Math.max(0,a.min[0]-b.max[0],b.min[0]-a.max[0]),Math.max(0,a.min[2]-b.max[2],b.min[2]-a.max[2]));
const lowBounds=group.receipt.placements.map(p=>{const s=p.spans.BARK,vs=localBark.slice(s.vertexStart,s.vertexStart+s.vertexCount).filter(v=>v.y-p.rootY<2.5);return{id:p.id,min:['x','y','z'].map(k=>Math.min(...vs.map(v=>v[k]))),max:['x','y','z'].map(k=>Math.max(...vs.map(v=>v[k])))};});
test('low tree wood leaves open space between all companions and the walking corridor',()=>{
 const segmentDistance=(x,z,a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);};
 for(const p of group.receipt.placements){const s=p.spans.BARK;for(const v of localBark.slice(s.vertexStart,s.vertexStart+s.vertexCount).filter(v=>v.y-p.rootY<2.5))for(let i=1;i<estate.footRoute.length;i++)assert.ok(segmentDistance(v.x,v.z,estate.footRoute[i-1],estate.footRoute[i])>estate.footRouteRadius+.3,'walk corridor intrusion');}
 for(const a of lowBounds)for(const b of lowBounds)if(a.id<b.id)assert.ok(boundsDistance(a,b)>2.5,`low wood pinches between ${a.id}/${b.id}`);
});
if(process.env.H_EARTH_OASIS_REVIEW_OUTPUT){
 const shaFiles=['showroom/globe/h-earth/render/geometry-oasis-tree-group.v1.js','showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'];
 fs.writeFileSync(process.env.H_EARTH_OASIS_REVIEW_OUTPUT,JSON.stringify({status:'METRICS_ONLY_CONFIRM_TEST_RESULT',baseline:BASELINE,originalPackageHash,originalIndexHash,originalWorldHash,terrainHash,buildMs,receipt:group.receipt,retirement:retired.receipt,minimumRootBurial:Math.min(...group.contacts.map(c=>c.burial)),minimumLowWoodGap:Math.min(...lowBounds.flatMap((a,i)=>lowBounds.slice(i+1).map(b=>boundsDistance(a,b)))),sourceHashes:Object.fromEntries(shaFiles.map(p=>[p,hash(fs.readFileSync(new URL('../../'+p,import.meta.url)))])),visualAcceptance:false},null,2));
}


test('Gen2857: original focus remains exact prefix of both restored group batches for an atomic ready-only substitution',()=>{
 const focus=group.receipt.placements.find(p=>p.id===jacaranda.JACARANDA_FOCUS_ID);
 assert.ok(focus);assert.equal(focus.x,55.5);assert.equal(focus.z,-307.5);
 for(const part of group.meshes){
  const span=focus.spans[part.part];
  assert.equal(span.indexStart,0,'focus must be first in original batch');
  assert.equal(part.mesh.indices.length-span.indexCount,
   group.receipt.placements.filter(p=>p.id!==focus.id).reduce((n,p)=>n+p.spans[part.part].indexCount,0));
 }
 assert.match(source,/resources\.jacaranda\?\.ready/);
 assert.match(source,/resources\.jacaranda\.draw\(packet\)/);
 assert.match(source,/resources\.jacaranda\?\.dispose\(\)/);
});
test('Gen2857: exact approved asset identity is bound while absent transfer leaves the original focus intact',async()=>{
 assert.equal(jacaranda.JACARANDA_APPROVED_SHA256,'46b65326f75c29b1f076fdd161213a226bae3f519c92a3ac9d9a1972398b7189');
 const companions=group.receipt.placements.filter(p=>p.id!==jacaranda.JACARANDA_FOCUS_ID);
 const fixture={schema:jacaranda.JACARANDA_MODEL_CONTRACT,trunkMinY:-0.1464279741048813,
   bounds:{min:[-12.89729118347168,-.1464279741048813,-9.942540168762207],
           max:[11.443934440612793,19.289831161499023,9.182101249694824]}};
 const plan=jacaranda.planApprovedJacarandaPlacement(model,fixture,companions);
 assert.equal(plan.id,'PROPOSED_OASIS_01');assert.ok(plan.crownWidthMeters>14);
 for(const gap of plan.gaps)assert.ok(gap.gapMeters>=1.25);
 const original=jacaranda.createApprovedJacarandaOverlay({},{
   model,companions,projectWorld:p=>p,assetURL:'/missing-approved.glb',
   fetchAsset:async()=>({ok:false,status:404})
 });
 assert.equal(await original.start(),false);
 assert.equal(original.ready,false);
 assert.equal(original.getReceipt().fallbackUsed,true);
 original.dispose();
});
const approvedAssetURL=new URL('../../showroom/globe/h-earth/assets/jacaranda/Gratitude-Jacaranda-Candidate.glb',import.meta.url);
test('Gen2857: committed binary must be exactly approved before release',()=>{
 if(!fs.existsSync(approvedAssetURL))return;
 const bytes=fs.readFileSync(approvedAssetURL);
 assert.equal(bytes.byteLength,jacaranda.JACARANDA_APPROVED_LENGTH);
 assert.equal(hash(bytes),jacaranda.JACARANDA_APPROVED_SHA256);
 const buffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
 const decoded=jacaranda.parseApprovedJacarandaGLB(buffer);
 assert.equal(decoded.vertexCount,651794);assert.equal(decoded.triangleCount,454746);
});
