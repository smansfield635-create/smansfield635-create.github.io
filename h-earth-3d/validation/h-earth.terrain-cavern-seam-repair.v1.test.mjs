import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {constructGeologicalRuntimeBridge,installGeologicalRuntimeBridge,resolveGeologicalRuntimeFootSupport} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';

const world=readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url));
assert.equal(createHash('sha256').update(world).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const canonical=JSON.parse(gunzipSync(world)).canonical;
const model=constructGeologicalRuntimeBridge(canonical),shell=model.formation.kernelCaveBoundary;
const ground=model.portal.terrainWithoutAperture,z0=model.site.portalZ;
const hash=mesh=>createHash('sha256').update(mesh.positions).update(mesh.indices).digest('hex');

// Independent vertical intersections with actual indexed triangles. No field
// or runtime sampler is used as the contact oracle.
function heights(mesh,x,z){
  const out=[],p=mesh.positions;
  for(let i=0;i<mesh.indices.length;i+=3){
    const [a,b,c]=Array.from(mesh.indices.slice(i,i+3),n=>n*3);
    const det=(p[b+2]-p[c+2])*(p[a]-p[c])+(p[c]-p[b])*(p[a+2]-p[c+2]);
    if(Math.abs(det)<1e-10)continue;
    const u=((p[b+2]-p[c+2])*(x-p[c])+(p[c]-p[b])*(z-p[c+2]))/det;
    const v=((p[c+2]-p[a+2])*(x-p[c])+(p[a]-p[c])*(z-p[c+2]))/det,w=1-u-v;
    if(Math.min(u,v,w)>=-1e-7)out.push(u*p[a+1]+v*p[b+1]+w*p[c+1]);
  }
  return out;
}
function top(mesh,x,z){const h=heights(mesh,x,z);assert(h.length,`triangle support missing at ${x},${z}`);return Math.max(...h);}

test('canonical world, complete gallery and mountain roof remain byte-identical',()=>{
  assert.equal(hash(shell),'708f8c281da7af1d520355e81e4462edb3f31384d508bcbfe26b0888567bf1bd');
  assert.equal(hash(model.portal.upperMantle),'b51280de6f32ad82ed78dc413f2e512e82a234aebaea7367e09754710c6158c0');
  assert.equal(model.site.galleryLength,24);assert.equal(shell.entranceClosed,false);
  assert.equal(model.portal.rimCorrespondence.sideMaxError,0);assert.equal(model.portal.rimCorrespondence.backMaxError,0);
});

test('emitted exterior boundary meets the entire lower ring between every grid/ring breakpoint',()=>{
  const xs=Array.from({length:shell.profileVertexCount},(_,i)=>shell.positions[i*3]);
  const lo=Math.min(...xs),hi=Math.max(...xs);
  for(let x=Math.ceil(lo/2)*2;x<hi;x+=2)xs.push(x);
  const cuts=[...new Set(xs)].sort((a,b)=>a-b);let count=0,maxError=0;
  for(let i=0;i<cuts.length-1;i++)for(let k=1;k<8;k++){
    const x=cuts[i]+(cuts[i+1]-cuts[i])*k/8;
    const cave=heights(shell,x,z0);assert(cave.length>=2);
    const error=Math.abs(top(ground,x,z0)-Math.min(...cave));
    maxError=Math.max(maxError,error);assert(error<2e-5,`threshold gap ${error} at ${x}`);count++;
  }
  assert(count>100);console.log(JSON.stringify({check:'FULL_MOUTH_TRIANGLE_CONTACT',samples:count,maximumErrorMeters:maxError}));
  assert.equal(model.portal.diagnostics.lowerEntranceSeamTriangleCount,0,'raised lower cap must be absent');
});

test('real emitted support crosses the threshold in both directions with headroom',()=>{
  installGeologicalRuntimeBridge(model);let maxRise=0,minHeadroom=Infinity,count=0;
  for(const x of [38,38.5,39,39.5,40,40.5,41,41.5,42]){
    const supports=[];
    for(let i=0;i<=100;i++){
      const z=z0-4+i*.05,q=resolveGeologicalRuntimeFootSupport(x,z);
      assert(q?.eligible,`unsupported ${x},${z}: ${q?.issues}`);
      const h=heights(z<z0?ground:shell,x,z),floor=z<z0?Math.max(...h):Math.min(...h);
      assert(h.length);assert(Math.abs(q.footY-floor)<2e-4,'navigation differs from emitted triangles');
      if(z>=z0){minHeadroom=Math.min(minHeadroom,q.headroom);assert(q.ceilingY>=q.eyeY+.35);}
      supports.push(q.footY);count++;
    }
    for(const list of [supports,[...supports].reverse()])for(let i=1;i<list.length;i++){
      const rise=Math.abs(list[i]-list[i-1]);maxRise=Math.max(maxRise,rise);assert(rise<.65*.05+.005,`unwalkable step ${rise}`);
    }
  }
  console.log(JSON.stringify({check:'THRESHOLD_TRAVERSAL',samples:count,maximumStepMeters:maxRise,minimumHeadroomMeters:minHeadroom}));
});

test('approach correction leaves surrounding land and terrain patch limits unchanged',()=>{
  for(const [x,z,y] of [[20,-266,11.947017207625684],[40,-274,8.609688422531722],[60,-260,21.63742337209275],[40,-252,22.397696867752387]])
    assert.equal(model.formation.excavatedOutdoorTerrain(x,z),y);
  assert.deepEqual(model.localBounds,{xMin:-120,xMax:96,zMin:-376,zMax:-224});
  assert(ground.positions.every(Number.isFinite));
  for(let i=0;i<ground.indices.length;i+=3){
    const p=ground.positions,[a,b,c]=Array.from(ground.indices.slice(i,i+3),n=>n*3);
    const upward=(p[b+2]-p[a+2])*(p[c]-p[a])-(p[b]-p[a])*(p[c+2]-p[a+2]);
    assert(upward>1e-9,'reversed or collapsed exterior triangle');
  }
});
