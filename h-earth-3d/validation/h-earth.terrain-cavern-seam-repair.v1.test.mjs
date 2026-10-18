import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {constructGeologicalRuntimeBridge,installGeologicalRuntimeBridge,resolveGeologicalRuntimeFootSupport,reconcileGeologicalTerrainRim} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';

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
  assert.deepEqual(model.localBounds,{xMin:-304,xMax:96,zMin:-568,zMax:-224});
  assert(ground.positions.every(Number.isFinite));
  for(let i=0;i<ground.indices.length;i+=3){
    const p=ground.positions,[a,b,c]=Array.from(ground.indices.slice(i,i+3),n=>n*3);
    const upward=(p[b+2]-p[a+2])*(p[c]-p[a])-(p[b]-p[a])*(p[c+2]-p[a+2]);
    assert(upward>1e-9,'reversed or collapsed exterior triangle');
  }
});

test('all emitted land perimeter vertices inherit full indexed source attributes, including corners',()=>{
  const channels=[['normals',3],['baseColorsLinear',4],['materialParameters',4],['coastDistances',1],['contactDistances',1]];
  const source={...canonical.buffers};
  // Distinct finite scalar fields exercise coastal/contact interpolation without
  // claiming this CPU fixture is a rendered shoreline or GPU qualification.
  const n=canonical.buffers.positions.length/3;
  source.coastDistances=Float32Array.from({length:n},(_,i)=>i%91-45);
  source.contactDistances=Float32Array.from({length:n},(_,i)=>i%67+.25);
  const b=model.localBounds;let samples=0,maxError=0;
  const perimeter=[[b.xMin,b.zMin,b.xMax,b.zMin],[b.xMax,b.zMin,b.xMax,b.zMax],[b.xMax,b.zMax,-120,b.zMax],[-120,b.zMax,-120,-440],[-120,-440,b.xMin,-440],[b.xMin,-440,b.xMin,b.zMin]];
  const segmentDistance=(p,s)=>{const [ax,az,bx,bz]=s,dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((p.x-ax)*dx+(p.z-az)*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-ax-dx*t,p.z-az-dz*t);};
  const sides=new Set(),corners=new Set();
  const betweenErrors=Object.fromEntries(channels.map(([key])=>[key,0]));let betweenSamples=0;
  for(const {role,mesh} of model.meshes){
    if(!['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(role))continue;
    const attrs=Object.fromEntries(channels.map(([key,size])=>[key,new Float32Array(mesh.vertexCount*size).fill(.321)]));
    reconcileGeologicalTerrainRim(model,role,mesh,attrs,source);
    for(let i=0;i<mesh.vertexCount;i++){
      const p=unprojectPlanetVertex(...mesh.positions.slice(i*3,i*3+3));
      const distances=perimeter.map(s=>segmentDistance(p,s));
      const edge=Math.min(...distances);
      if(edge>=12){for(const [key,size] of channels)for(let c=0;c<size;c++)assert.equal(attrs[key][i*size+c],Math.fround(.321));continue;}
      if(Math.abs(edge)>.001)continue;
      distances.forEach((d,k)=>{if(Math.abs(d)<.001)sides.add(k)});
      if(distances.filter(d=>Math.abs(d)<.001).length===2)corners.add(Math.round(p.x)+','+Math.round(p.z));
      // Independent vertical triangle intersections in the original indexed
      // package, not the bridge's contact/attribute sampler.
      let found=null;
      outer:for(const span of canonical.primitiveSpans.filter(s=>s.role==='TERRAIN'))for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){
        const ids=canonical.buffers.indices.slice(j,j+3);
        const points=ids.map(id=>unprojectPlanetVertex(...canonical.buffers.positions.slice(id*3,id*3+3).map(Math.fround)));
        if(p.x<Math.min(...points.map(q=>q.x))-1e-6||p.x>Math.max(...points.map(q=>q.x))+1e-6||p.z<Math.min(...points.map(q=>q.z))-1e-6||p.z>Math.max(...points.map(q=>q.z))+1e-6)continue;
        const [a,c,d]=points,det=(c.z-d.z)*(a.x-d.x)+(d.x-c.x)*(a.z-d.z);
        if(Math.abs(det)<1e-10)continue;
        const u=((c.z-d.z)*(p.x-d.x)+(d.x-c.x)*(p.z-d.z))/det;
        const v=((d.z-a.z)*(p.x-d.x)+(a.x-d.x)*(p.z-d.z))/det,w=1-u-v;
        if(Math.min(u,v,w)<-1e-6)continue;
        found={ids,weights:[u,v,w]};break outer;
      }
      assert(found,'perimeter source triangle missing');
      for(const [key,size] of channels)for(let c=0;c<size;c++){
        const expected=found.ids.reduce((sum,id,k)=>sum+found.weights[k]*source[key][id*size+c],0);
        const error=Math.abs(attrs[key][i*size+c]-expected);maxError=Math.max(maxError,error);
        assert(error<2e-5,`${role} ${key} at ${p.x},${p.z}: ${error}`);
      }
      samples++;
    }
    const edgeCounts=new Map();
    for(let j=0;j<mesh.indices.length;j+=3)for(let k=0;k<3;k++){
      const a=mesh.indices[j+k],c=mesh.indices[j+(k+1)%3],key=[Math.min(a,c),Math.max(a,c)].join(',');
      edgeCounts.set(key,(edgeCounts.get(key)??0)+1);
    }
    for(const [key,count] of edgeCounts){
      if(count!==1)continue;
      const [a,c]=key.split(',').map(Number);
      const p=unprojectPlanetVertex(...mesh.positions.slice(a*3,a*3+3));
      const q=unprojectPlanetVertex(...mesh.positions.slice(c*3,c*3+3));
      const onSide=(r,k)=>segmentDistance(r,perimeter[k])<.001;
      if(![0,1,2,3,4,5].some(k=>onSide(p,k)&&onSide(q,k)))continue;
      for(let k=1;k<16;k++){
        const t=k/16,x=p.x+(q.x-p.x)*t,z=p.z+(q.z-p.z)*t;
        const hit=model.originalTerrainContactAt(x,z);assert(hit);
        for(const [channel,size] of channels)for(let component=0;component<size;component++){
          const expected=hit.ids.reduce((sum,id,j)=>sum+hit.weights[j]*source[channel][id*size+component],0);
          const emitted=attrs[channel][a*size+component]*(1-t)+attrs[channel][c*size+component]*t;
          const error=Math.abs(expected-emitted);assert(Number.isFinite(error));
          betweenErrors[channel]=Math.max(betweenErrors[channel],error);
        }
        betweenSamples++;
      }
    }
  }
  assert.equal(sides.size,6);assert.equal(corners.size,6);assert(samples>300);
  console.log(JSON.stringify({check:'FULL_PERIMETER_VERTEX_ATTRIBUTES',samples,sides:sides.size,corners:corners.size,maximumError:maxError}));
  console.log(JSON.stringify({check:'BETWEEN_VERTEX_DIAGNOSTIC_NOT_PIXEL_ACCEPTANCE',samples:betweenSamples,maximumErrors:betweenErrors,coastContactFields:'DISTINCT_SYNTHETIC_INTERPOLATION_STRESS_FIELDS'}));
});

test('rim reconciliation leaves cavern, cliffs and water attributes untouched and rejects missing source channels',()=>{
  const mesh=model.meshes.find(p=>p.role==='ERODED_TERRAIN').mesh;
  const attrs={normals:new Float32Array(mesh.vertexCount*3).fill(.123)};
  for(const role of ['CAVERN_PHYSICAL_SHELL','NATURAL_CLIFF_FACE','FRESHWATER_RIVER','OASIS_WATER'])
    reconcileGeologicalTerrainRim(model,role,mesh,attrs,{});
  assert(attrs.normals.every(v=>v===Math.fround(.123)));
  assert.throws(()=>reconcileGeologicalTerrainRim(model,'ERODED_TERRAIN',mesh,attrs,canonical.buffers),/RIM_ATTRIBUTE_MISSING/);
});
