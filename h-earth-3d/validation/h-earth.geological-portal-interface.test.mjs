import test from 'node:test';import assert from 'node:assert/strict';
import {GEOLOGICAL_FORMATION_SITES,createGeologicalFormation,unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
import {constructGeologicalPortalAssembly,sampleFormationWalkable,sweepFormationWalk,projectGeologicalMeshForRenderer} from '../terrain/h-earth.geological-portal-interface.v1.mjs';
const site=GEOLOGICAL_FORMATION_SITES.A_EASTERN_REAR_ESCARPMENT;
function fixture(s=site){
  const terrain=(x,z)=>25+.7*(z-s.portalZ)+.012*(x-s.x);
  const path=Array.from({length:20},(_,i)=>({x:s.x,z:s.drainageHeadZ-i*2,height:terrain(s.x,s.drainageHeadZ)-i*.4}));
  const f=createGeologicalFormation({terrainAt:terrain,site:s,surveyRoute:{path,result:'NO_STRICT_LOWER_NEIGHBOR_IN_STUDY'}});
  return {f,terrain};
}
test('upper mantle derives from same actual topographic sampler, not a fake mouth cap',()=>{const {f,terrain}=fixture(),m=constructGeologicalPortalAssembly(f,terrain);const p=m.upperMantle.positions;for(let i=0;i<p.length;i+=3)assert(Math.abs(p[i+1]-terrain(p[i],p[i+2]))<1e-5)});
test('32 grid cells retired in source terrain, replaced by 64 mantle triangles',()=>{const {f,terrain}=fixture(),m=constructGeologicalPortalAssembly(f,terrain);assert.equal(m.retiredReplacementTriangleCount,64);assert.equal(m.upperMantle.triangleCount,64);assert.equal(m.terrainWithoutAperture.triangleCount+64,9792)});
test('replacement top grid has actual hole, not an overpainted black cave',()=>{const {f,terrain}=fixture(),m=constructGeologicalPortalAssembly(f,terrain);const p=m.terrainWithoutAperture.positions,ids=m.terrainWithoutAperture.indices,a=m.aperture;for(let i=0;i<ids.length;i+=3){let x=0,z=0;for(let k=0;k<3;k++){x+=p[ids[i+k]*3]/3;z+=p[ids[i+k]*3+2]/3;}assert(!(x>a.xMin&&x<a.xMax&&z>a.zMin&&z<a.zMax))}});
test('mantle is crack-free to unchanged terrain on both flanks and behind',()=>{const {f,terrain}=fixture(),m=constructGeologicalPortalAssembly(f,terrain);assert.equal(m.rimCorrespondence.sideMaxError,0);assert.equal(m.rimCorrespondence.backMaxError,0);assert(m.rimCorrespondence.frontCliffBottomOpen)});
test('real front cliff faces bind original surface to cave ceiling, not decorative stand-alone arch',()=>{const {f,terrain}=fixture(),m=constructGeologicalPortalAssembly(f,terrain);const p=m.exposedCliffFace.positions;assert.equal(m.exposedCliffFace.triangleCount,32);assert.equal(p[0],m.aperture.xMin);assert.equal(p[p.length-3],m.aperture.xMax);assert(m.diagnostics.frontMaximumExteriorCut>0);assert(terrain(site.x,site.portalZ)>f.roofAt(site.x,site.portalZ))});
test('interior foot plane shares physical cavity occupancy and roof',()=>{const {f}=fixture();const q=sampleFormationWalkable(f,{x:site.x,z:site.portalZ+8});assert(q.eligible&&q.class==='INTERIOR');assert(f.insideVoid(site.x,q.eyeY,site.portalZ+8));assert(q.ceilingY-q.eyeY>0)});
test('wall and ceiling collision rejects displacement without lifting camera onto mountain roof',()=>{const {f}=fixture();assert(!sampleFormationWalkable(f,{x:site.x+site.width*1.1,z:site.portalZ+8}).eligible);assert.throws(()=>sampleFormationWalkable(f,{x:site.x,z:site.portalZ+8,eyeHeight:site.roofClearance+1}),/WALK_EYE_BOUNDS/);assert(!sampleFormationWalkable(f,{x:site.x,z:site.portalZ+site.galleryLength}).eligible)});
test('swept passage outside into interior succeeds, lateral wall sweep fails',()=>{const {f}=fixture();const q=sweepFormationWalk(f,{x:site.x,z:site.portalZ-6},{x:site.x,z:site.portalZ+site.galleryLength-1});assert(q.accepted);const wall=sweepFormationWalk(f,{x:site.x,z:site.portalZ+6},{x:site.x+site.width*1.2,z:site.portalZ+6});assert(!wall.accepted&&wall.reason==='CAVERN_SOLID_OR_HEADROOM_COLLISION')});
test('sweep rejects excessive cliff step under independent grade ceiling',()=>{const {f}=fixture();const q=sweepFormationWalk(f,{x:site.x,z:site.portalZ-6},{x:site.x,z:site.portalZ+2},{maximumStepRisePerMeter:0.001});assert(!q.accepted)});
test('projection returns spherical GPU-ready positions and leaves local source untouched',()=>{const {f,terrain}=fixture(),m=constructGeologicalPortalAssembly(f,terrain);const first=m.cave.positions.slice(0,3),projected=projectGeologicalMeshForRenderer(m.cave);assert.equal(projected.triangleCount,m.cave.triangleCount);const back=unprojectPlanetVertex(...projected.positions.slice(0,3));assert(Math.hypot(back.x-first[0],back.y-first[1],back.z-first[2])<0.002);assert.deepEqual(Array.from(m.cave.positions.slice(0,3)),Array.from(first))});
test('B site uses B-local terrain patch, not an A-only region',()=>{const s=GEOLOGICAL_FORMATION_SITES.B_REAR_RAVINE,{f,terrain}=fixture(s),m=constructGeologicalPortalAssembly(f,terrain);assert(m.aperture.xMin<s.x&&m.aperture.xMax>s.x);assert.equal(m.terrainWithoutAperture.triangleCount,9728)});
test('invalid configuration fails closed and does not touch input geometry',()=>{const {f,terrain}=fixture();assert.throws(()=>constructGeologicalPortalAssembly(f,terrain,{apertureDepth:7}),/FIXED_LOCAL_MESH_QUANTUM/);assert.throws(()=>constructGeologicalPortalAssembly(f,terrain,{bounds:{xMin:76,xMax:92,zMin:-268,zMax:-252}}),/APERTURE_TOUCHES_PATCH_PERIMETER/)});
// Synthetic line-of-sight proof is geometrical, not a WebGL or Android pixel claim.
function rayHits(origin,target,mesh){
  const p=mesh.positions,ids=mesh.indices,d=target.map((v,i)=>v-origin[i]),len=Math.hypot(...d),dir=d.map(v=>v/len);let nearest=Infinity;
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a.reduce((q,v,i)=>q+v*b[i],0);
  for(let i=0;i<ids.length;i+=3){const vertex=n=>Array.from(p.slice(ids[n]*3,ids[n]*3+3)),a=vertex(i),b=vertex(i+1),c=vertex(i+2),e1=b.map((v,j)=>v-a[j]),e2=c.map((v,j)=>v-a[j]);const h=cross(dir,e2),det=dot(e1,h);if(Math.abs(det)<1e-9)continue;const inv=1/det,s=origin.map((v,j)=>v-a[j]),u=inv*dot(s,h);if(u<0||u>1)continue;const q=cross(s,e1),v=inv*dot(dir,q);if(v<0||u+v>1)continue;const t=inv*dot(e2,q);if(t>0.0001&&t<len-0.0001)nearest=Math.min(nearest,t)}return nearest;
}
test('rear valley sight line crosses real rock aperture into gallery; roof blocks downward sky ray',()=>{
  const {f,terrain}=fixture(),g=constructGeologicalPortalAssembly(f,terrain),s=f.site;
  const eye=sampleFormationWalkable(f,{x:s.x,z:s.portalZ-10});const inside=sampleFormationWalkable(f,{x:s.x,z:s.portalZ+7});
  const origin=[s.x,eye.eyeY,s.portalZ-10],target=[s.x,inside.eyeY,s.portalZ+7];
  for(const key of ['terrainWithoutAperture','upperMantle','exposedCliffFace','cave'])assert.equal(rayHits(origin,target,g[key]),Infinity,`OCCLUDED_BY_${key}`);
  const above=[s.x,terrain(s.x,s.portalZ+4)+12,s.portalZ+4],below=[s.x,s.entranceFloorY,s.portalZ+4];
  assert(Number.isFinite(rayHits(above,below,g.upperMantle)));
});
