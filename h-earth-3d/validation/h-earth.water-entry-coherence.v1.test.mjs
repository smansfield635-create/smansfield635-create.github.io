import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
const root=new URL('../../',import.meta.url);
const renderer=new URL('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',root);
const source=fs.readFileSync(renderer,'utf8');
const edge=[...source.matchAll(/from\s*['"]([^'"]*geological-runtime-bridge\.v1\.js[^'"]*)['"]/g)];assert.equal(edge.length,1);
const bridge=await import(new URL(edge[0][1],renderer));
const navigation=await import(new URL('showroom/globe/h-earth/functional-landscape/navigation.js',root));
let model,triangles;
function setup(){
 if(model)return model;
 const bytes=fs.readFileSync(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',root));assert.equal(createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
 const pkg=JSON.parse(gunzipSync(bytes)).canonical,before=createHash('sha256').update(JSON.stringify(pkg)).digest('hex');model=bridge.constructGeologicalRuntimeBridge(pkg);assert.equal(createHash('sha256').update(JSON.stringify(pkg)).digest('hex'),before);bridge.installGeologicalRuntimeBridge(model);
 triangles=model.meshes.filter(p=>p.role==='FRESHWATER_RIVER'||p.role==='OASIS_WATER').flatMap(({role,mesh})=>{
  const out=[];for(let k=0;k<mesh.indices.length;k+=3){const [a,b,c]=[0,1,2].map(j=>unprojectPlanetVertex(...mesh.positions.slice(mesh.indices[k+j]*3,mesh.indices[k+j]*3+3)));const det=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(det)<1e-10)continue;out.push({role,a,b,c,det,x0:Math.min(a.x,b.x,c.x),x1:Math.max(a.x,b.x,c.x),z0:Math.min(a.z,b.z,c.z),z1:Math.max(a.z,b.z,c.z)});}return out;
 });return model;
}
function wetAt(x,z){const out=[];for(const t of triangles){if(x<t.x0-1e-6||x>t.x1+1e-6||z<t.z0-1e-6||z>t.z1+1e-6)continue;const{a,b,c,det}=t,u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/det,v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/det,w=1-u-v;if(Math.min(u,v,w)>=-1e-7)out.push({role:t.role,y:u*a.y+v*b.y+w*c.y});}return out;}

test('actual emitted basin and river have no competing elevated water surfaces',()=>{
 setup();let wetSamples=0;for(let z=-310;z<=-264;z+=.5)for(let x=18;x<=62;x+=.5){const q=wetAt(x,z);if(q.length)wetSamples++;if(q.some(v=>v.role==='OASIS_WATER')&&q.some(v=>v.role==='FRESHWATER_RIVER'))assert(Math.max(...q.map(v=>v.y))-Math.min(...q.map(v=>v.y))<.01,`Competing emitted water at ${x},${z}: ${JSON.stringify(q)}`);}
 assert(wetSamples>200,'Water was removed instead of joined');
 for(const[x,z]of [[34,-286],[30,-288],[24,-288]]){const q=wetAt(x,z);assert(q.some(v=>v.role==='OASIS_WATER'));assert(!q.some(v=>v.role==='FRESHWATER_RIVER'),'Old lower ribbon survives inside basin');}
});

test('published arrival through cavern mouth stays above actual water and inside shell',()=>{
 setup();let r=navigation.createHEarthFunctionalLandscapeNavigationState({waypointId:'GEOLOGICAL_CAVERN_REAR_APPROACH'});assert(r.ok);let state=r.state,interior=0;
 for(let i=0;i<=104;i++){
  const foot=state.position.y-2.25,waters=wetAt(state.position.x,state.position.z);assert(waters.every(w=>w.y<=foot+.05),`Camera route submerged at ${JSON.stringify(state.position)}: ${JSON.stringify(waters)}`);
  if(state.geologicalFloorClass==='INTERIOR'){interior++;const q=model.formation.caveSectionAt(state.position.x,state.position.z);assert(q&&state.position.y<q.ceilingY-.35);}
  if(state.position.z>=-240)break;
  const p=navigation.proposeHEarthFunctionalLandscapeNavigation(state,{action:'MOVE_FORWARD',magnitude:.25});assert(p.ok,`Dry mouth traversal blocked: ${JSON.stringify(p.issues)} at ${state.position.z}`);state=p.state;
 }
 assert.equal(state.position.z,-240);assert(interior>=20,'Insufficient actual interior travel');
});

test('basin support follows the active water presentation mode',()=>{
 setup();for(const[x,z]of [[34,-286],[30,-288],[24,-288]]){const water=wetAt(x,z),floor=model.formation.excavatedOutdoorTerrain(x,z);assert(water.some(w=>w.y>floor+.1),'Regression fixture no longer submerged');const support=bridge.resolveGeologicalRuntimeFootSupport(x,z);assert(support);if(bridge.H_EARTH_REAR_WATER_PRESENTATION_ENABLED===false)assert(support.eligible,'Hidden water creates an invisible barrier');else{assert(!support.eligible,`Submerged floor allowed at ${x},${z}`);assert(support.issues.some(s=>/WATER|SUBMERG|WET/.test(s)));}}
});


test('rear water is visible and the authored extension is continuously wet with dry banks',()=>{
 setup();assert.equal(bridge.H_EARTH_REAR_WATER_PRESENTATION_ENABLED,true);
 const points=model.formation.vegetationCorridorPoints.slice(18);let previous=Infinity,count=0;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],n=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.25);
  for(let j=0;j<n;j++){
   const x=a.x+(b.x-a.x)*j/n,z=a.z+(b.z-a.z)*j/n,w=model.sampleWaterAt(x,z),g=model.sampleOutdoorAt(x,z);
   assert(w&&g,`Missing water/ground ${x},${z}`);assert(w.y-g.y>.07,`Bed interrupts river ${x},${z}: ${w.y-g.y}`);assert(w.y<=previous+.001,'Upstream water step');previous=w.y;count++;
   const support=bridge.resolveGeologicalRuntimeFootSupport(x,z);assert(support&&!support.eligible,'Wet floor accepts walking');
  }
 }
 assert(count>1000);
 for(let i=0;i<points.length-1;i+=10)for(const side of [-1,1]){const p=points[i],q=points[i+1],dx=q.x-p.x,dz=q.z-p.z,l=Math.hypot(dx,dz),x=p.x-side*dz/l*7,z=p.z+side*dx/l*7,w=model.sampleWaterAt(x,z);assert(!w,'Water spills beyond reserved corridor');}
});

test('new river polygons meet actual emitted land without submerged or hovering banks',()=>{
 setup();let count=0;const mesh=model.meshes.find(p=>p.role==='FRESHWATER_RIVER').mesh;
 for(let k=0;k<mesh.indices.length;k+=3){
  const p=[0,1,2].map(j=>unprojectPlanetVertex(...mesh.positions.slice(mesh.indices[k+j]*3,mesh.indices[k+j]*3+3)));
  const x=p.reduce((s,q)=>s+q.x,0)/3,z=p.reduce((s,q)=>s+q.z,0)/3,y=p.reduce((s,q)=>s+q.y,0)/3,g=model.sampleOutdoorAt(x,z);
  assert(g&&y>=g.y-.002,`Submerged emitted water ${x},${z}`);count++;
 }
 assert(count>100);assert(mesh.indices.length/3<15000,'Unbounded triangle cost');assert(mesh.vertexCount*69+mesh.indices.byteLength<1024*1024,'Unbounded uploaded water buffer cost');assert(model.meshes.reduce((sum,p)=>sum+p.mesh.vertexCount*69+p.mesh.indices.byteLength,0)<4*1024*1024,'Geological renderer GPU budget exceeded');
});

test('accepted land geometry is byte-for-byte unchanged',()=>{
 setup();const expected=[{"role": "ERODED_TERRAIN", "hash": "b9a683dfab0548298e7bfd9c4aebc3ea08c97685a1a075953c1cc1bb8022c9b8"}, {"role": "MOUNTAIN_OVERBURDEN", "hash": "2ae4a3fc6122f4158898b0990ac9833c0f198af0db4484315601367729a22281"}, {"role": "NATURAL_CLIFF_FACE", "hash": "9097a287ae17e53da9a32c9439d7aae2754f699dda20a2119a50fc81d8cb25a0"}, {"role": "CAVERN_PHYSICAL_SHELL", "hash": "5a5e35fe1f23565900ffd5a416f7d6ed4762220c40304c2f6fd6898bf7b13335"}];
 for(const {role,hash}of expected){const mesh=model.meshes.find(p=>p.role===role).mesh;assert.equal(createHash('sha256').update(JSON.stringify({p:Array.from(mesh.positions),i:Array.from(mesh.indices)})).digest('hex'),hash,role);}
});
