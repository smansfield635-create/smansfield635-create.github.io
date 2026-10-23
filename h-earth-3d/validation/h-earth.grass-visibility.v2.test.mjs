import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {boundGrassTiles,grassFrustumPlanes,selectVisibleGrassTiles,mergeGrassRanges,GRASS_BLADE_BOUND_METERS} from '../../showroom/globe/h-earth/render/grass-visibility.v2.js';
import {createSingleOwnerVegetation,runtimePlantingBaselineTiles} from '../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';
const identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
const tile=(x,y,z,first=0)=>({id:String(first),minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,first,count:1,packed:new Float32Array([x,y,z,.5])});
const clip=(m,p)=>[0,1,2,3].map(row=>m[row]*p[0]+m[4+row]*p[1]+m[8+row]*p[2]+m[12+row]);
const inside=p=>p.slice(0,3).every(v=>v>=-p[3]&&v<=p[3]);
function oracleOutside(b,m){
 const vertices=[];for(const x of [b.min[0],b.max[0]])for(const y of [b.min[1],b.max[1]])for(const z of [b.min[2],b.max[2]])vertices.push(clip(m,[x,y,z]));
 return [0,1,2].some(axis=>vertices.every(v=>v[axis]<-v[3])||vertices.every(v=>v[axis]>v[3]));
}
test('bounds use all actual packed XYZ extrema and preserve root buffers',()=>{
 const t={...tile(0,0,0),count:2,packed:new Float32Array([1,-20,3,.5,2,30,-4,.8])},before=t.packed.slice();
 const [b]=boundGrassTiles([t]);assert.deepEqual(b.min,[1-2.2,-20-2.2,-4-2.2]);assert.deepEqual(b.max,[2+2.2,30+2.2,3+2.2]);assert.equal(b.tile,t);assert.deepEqual(t.packed,before);
 assert.throws(()=>boundGrassTiles([{...t,packed:new Float32Array([NaN,0,0,0])}]));
});
test('maximum shader extrusion fits conservative expansion for any radial orientation',()=>{
 const source=readFileSync(new URL('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js',import.meta.url),'utf8');
 assert(source.includes('mix(1.15,1.65,h)'));assert(source.includes('height*mix(.12,.30,h)'));assert(source.includes('mix(.010,.016,h)'));
 // Triangle inequality bounds every axis, both lobes, every h and detail weight.
 assert(.003+1.65+1.65*.30+.016<GRASS_BLADE_BOUND_METERS);
});
test('every frustum boundary grazing blade and camera-inside tile remains selected',()=>{
 const {planes}=grassFrustumPlanes(identity);
 for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
  const p=[0,0,0];p[axis]=sign*3.2;
  assert.equal(selectVisibleGrassTiles(boundGrassTiles([tile(...p)]),planes).length,1);
  p[axis]=sign*3.3;assert.equal(selectVisibleGrassTiles(boundGrassTiles([tile(...p)]),planes).length,0);
 }
 assert.equal(selectVisibleGrassTiles(boundGrassTiles([tile(0,0,0)]),planes).length,1);
 assert.equal(selectVisibleGrassTiles(boundGrassTiles([tile(100,100,100)]),grassFrustumPlanes(new Array(16).fill(0)).planes).length,1);
 assert.throws(()=>grassFrustumPlanes(identity.map((v,i)=>i===2?NaN:v)));
 assert.throws(()=>grassFrustumPlanes([1,2]));
});
test('independent clip-space corner oracle: rotations, pitches, translations and perspective never lose visible bounds',()=>{
 let seed=2875;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 let rejected=0,accepted=0;
 for(let trial=0;trial<300;trial++){
  const yaw=random()*Math.PI*2,pitch=(random()-.5)*Math.PI,c=Math.cos(yaw),s=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),near=.1,far=1000,f=1/Math.tan(.3+random()*.7);
  const view=[c,s*sp,s*cp,0,0,cp,-sp,0,-s,c*sp,c*cp,0,(random()-.5)*100,(random()-.5)*100,-random()*100,1];
  const projection=[f/1.6,0,0,0,0,f,0,0,0,0,-(far+near)/(far-near),-1,0,0,-2*far*near/(far-near),0];
  const matrix=Array.from({length:16},(_,i)=>{const row=i%4,col=Math.floor(i/4);return [0,1,2,3].reduce((n,k)=>n+projection[k*4+row]*view[col*4+k],0);});
  const frustum=grassFrustumPlanes(matrix);assert.deepEqual(frustum.matrix,new Float32Array(matrix));
  for(let point=0;point<40;point++){
   const bounds=boundGrassTiles([tile((random()-.5)*300,(random()-.5)*100,(random()-.5)*300)]),selected=selectVisibleGrassTiles(bounds,frustum.planes);
   if(!selected.length){rejected++;assert(oracleOutside(bounds[0],frustum.matrix),'culling rejected a clip-space intersecting AABB');}
   else accepted++;
   const root=Array.from(bounds[0].tile.packed.slice(0,3));if(inside(clip(frustum.matrix,root)))assert.equal(selected.length,1);
  }
 }
 assert(rejected>1000&&accepted>1000);
});
test('merged immutable ranges preserve exactly selected roots with no duplicates',()=>{
 const selected=[{first:0,count:2},{first:2,count:3},{first:9,count:4},{first:13,count:1}];
 assert.deepEqual(mergeGrassRanges(selected),[{first:0,count:5},{first:9,count:5}]);
 assert.deepEqual(mergeGrassRanges([]),[]);assert.throws(()=>mergeGrassRanges([{first:2,count:3},{first:4,count:2}]));
});
test('owner culls submitted ranges while retaining full residency and zero camera-dependent uploads',async()=>{
 let offset=0,fine=0;const uploads=[],draws=[],matrices=[];
 const gl=new Proxy({ARRAY_BUFFER:1,STATIC_DRAW:2,FLOAT:3,TRIANGLES:4,VERTEX_SHADER:5,FRAGMENT_SHADER:6,COMPILE_STATUS:7,LINK_STATUS:8,BUFFER_SIZE:9,NO_ERROR:0,
  createShader:()=>({}),createProgram:()=>({}),createVertexArray:()=>({}),createBuffer:()=>({}),getShaderParameter:()=>true,getProgramParameter:()=>true,isContextLost:()=>false,getUniformLocation:(_p,n)=>n,
  getBufferParameter:()=>32,getError:()=>0,bufferData:(_t,n)=>uploads.push(n),bufferSubData:(_t,o,b)=>uploads.push([o,...b]),vertexAttribPointer:(_l,_s,_t,_n,_stride,o)=>{offset=o;},uniform1i:(_n,v)=>{fine=v;},uniformMatrix4fv:(_n,_t,m)=>matrices.push([...m]),drawArraysInstanced:(_m,_f,_v,count)=>draws.push({offset,fine,count})
 },{get:(o,k)=>k in o?o[k]:()=>{}});
 const root=(x,z,seed)=>({x,y:2,z,angle:.5,seed,slope:0,triangleId:1});
 const presentation={tiles:[{id:'control',minX:-140,minZ:-196,roots:[root(-139.4,-194.5,1)]},{id:'remote',minX:100,minZ:100,roots:[root(101,101,2)]}],receipt:{contactCount:2}};
 const environment={sunDirection:{x:0,y:1,z:0},sunColor:[1,1,1],groundHazeColor:[.5,.5,.5],sunIntensity:1,fogStartDistance:100,fogFalloff:.001,maximumFogFactor:.6};
 const owner=await createSingleOwnerVegetation(gl,presentation,{environment,planetRadius:420000}),uploadCount=uploads.length;
 const view=x=>({camera:{position:{x:x===139.4?-139.4:101,y:2,z:x===139.4?-194.5:101},viewProjectionMatrix:[.1,0,0,0,0,.1,0,0,0,0,.1,0,x*.1,-.2,(x===139.4?194.5:-101)*.1,1]}});
 const a=owner.draw(view(139.4));assert.equal(a.visibleCoarseRoots,1);assert.equal(a.selectedFineRoots,1);assert.equal(a.culledTiles,1);assert.deepEqual(draws,[{offset:0,fine:0,count:1},{offset:0,fine:1,count:1}]);
 const b=owner.draw(view(-101));assert.equal(b.visibleCoarseRoots,1);assert.equal(draws.at(-1).offset,16);
 owner.draw(view(139.4));assert.deepEqual(draws.slice(0,2),draws.slice(-2));assert.equal(uploads.length,uploadCount);
 assert.deepEqual(matrices[0],[...new Float32Array(view(139.4).camera.viewProjectionMatrix)]);
 assert.equal(owner.getReceipt().gpuAllocationVerified,true);assert.equal(owner.getReceipt().gpuRequestedBytes,32);assert.equal(owner.getReceipt().gpuObservedBufferBytes,32);assert.equal(owner.getReceipt().allocationGlError,0);assert.equal(owner.getReceipt().uploadGlError,0);assert(owner.getReceipt().cpuDrawSubmissionMilliseconds>=0);
 assert.equal(owner.getReceipt().installedRootCount,2);assert.equal(owner.getReceipt().gpuAllocatedBytes,32);assert.equal(owner.getReceipt().perFrameUploadBytes,0);owner.dispose();
});
test('owner rejects failed allocation, GL upload errors and context loss instead of claiming verified residency',async()=>{
 const presentation={tiles:[{id:'control',minX:-140,minZ:-196,roots:[{x:-139.4,y:2,z:-194.5,angle:.5,seed:1,slope:0,triangleId:1}]}],receipt:{contactCount:1}};
 const environment={sunDirection:{x:0,y:1,z:0},sunColor:[1,1,1],groundHazeColor:[.5,.5,.5],sunIntensity:1,fogStartDistance:100,fogFalloff:.001,maximumFogFactor:.6};
 for(const scenario of ['size','allocationError','uploadError','contextLost']){
  let uploaded=false,allocated=false,deleted=0;
  const gl=new Proxy({ARRAY_BUFFER:1,STATIC_DRAW:2,FLOAT:3,TRIANGLES:4,VERTEX_SHADER:5,FRAGMENT_SHADER:6,COMPILE_STATUS:7,LINK_STATUS:8,BUFFER_SIZE:9,NO_ERROR:0,
   createShader:()=>({}),createProgram:()=>({}),createVertexArray:()=>({}),createBuffer:()=>({}),getShaderParameter:()=>true,getProgramParameter:()=>true,
   isContextLost:()=>scenario==='contextLost'&&allocated,
   bufferData:()=>{allocated=true;},bufferSubData:()=>{uploaded=true;},
   getBufferParameter:()=>scenario==='size'?0:16,
   getError:()=>scenario==='allocationError'||(scenario==='uploadError'&&uploaded)?1285:0,
   deleteBuffer:()=>{deleted++;}
  },{get:(o,k)=>k in o?o[k]:()=>{}});
  const expected={size:/OWNER_BUFFER_SIZE_MISMATCH/,allocationError:/OWNER_BUFFER_ALLOCATION_GL_ERROR/,uploadError:/OWNER_BUFFER_UPLOAD_GL_ERROR/,contextLost:/OWNER_CONTEXT_LOST/}[scenario];
  await assert.rejects(createSingleOwnerVegetation(gl,presentation,{environment,planetRadius:420000}),expected);assert.equal(deleted,1);
 }
});

test('runtime planting sees only authenticated baseline prefixes while all resident roots remain intact',()=>{
 const a={...tile(1,2,3),id:'original',count:2,baselineCount:1,packed:new Float32Array([1,2,3,.5,7,8,9,.75])};
 const b={...tile(10,11,12,2),id:'added-only',baselineCount:0};
 const original=a.packed.slice(),selected=runtimePlantingBaselineTiles([a,b]);
 assert.equal(selected.length,1);assert.equal(selected[0].id,a.id);assert.equal(selected[0].minX,a.minX);assert.equal(selected[0].minZ,a.minZ);
 assert.equal(selected[0].count,1);assert.deepEqual([...selected[0].packed],[1,2,3,.5]);assert.equal(selected[0].packed.buffer,a.packed.buffer);
 assert.equal(a.count,2);assert.deepEqual(a.packed,original);assert.equal(b.count,1);
 for(const baselineCount of [undefined,-1,3,.5])assert.throws(()=>runtimePlantingBaselineTiles([{...a,baselineCount}]),/RUNTIME_PLANTING_BASELINE_INVALID/);
});
