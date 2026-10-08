/** Presentation-only landscape identity. New geometry is constructed by deferred batches. */
import { buildHEarthWoodlandGrassTuft, H_EARTH_OASIS_FOLIAGE_SAMPLE } from './grass-lowland-trial.js';
import { sampleHEarthRun8CSuccessorSurfaceMaterial } from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import { sampleHEarthGen311PlacementStructureDisposition, H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate } from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';

export const H_EARTH_LANDSCAPE_COVER = Object.freeze({
  id:'H_EARTH_DRY_COASTAL_LANDSCAPE_IDENTITY_v1',
  bounds:Object.freeze({minX:-384,maxX:384,minZ:-736,maxZ:128}),
  maximumTufts:8192, maximumTriangles:196608, bladesPerTuft:4,
  canonicalBatchCount:108, maximumTuftsPerBatch:128,
  seed:'H_EARTH_LANDSCAPE_IDENTITY_20261008',
  geometryAdmission:'POST_READY_EXISTING_VEGETATION_BATCHES',
  terrainAuthorityChanged:false, canonicalPopulationChanged:false
});
const P=H_EARTH_LANDSCAPE_COVER, contexts=new WeakMap(), plans=new WeakMap();
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
function hash(id,channel){let h=2166136261;for(const c of `${P.seed}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0)/4294967296;}
function field(x,z,step,channel){const fx=x/step,fz=z/step,ix=Math.floor(fx),iz=Math.floor(fz),u=smooth(0,1,fx-ix),v=smooth(0,1,fz-iz),a=(x,z)=>hash(`${x}:${z}`,channel);return a(ix,iz)*(1-u)*(1-v)+a(ix+1,iz)*u*(1-v)+a(ix,iz+1)*(1-u)*v+a(ix+1,iz+1)*u*v;}
function segmentDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,l=dx*dx+dz*dz,t=l?clamp(((x-a.x)*dx+(z-a.z)*dz)/l):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
const inside=(x,z)=>x>=P.bounds.minX+1&&x<=P.bounds.maxX-1&&z>=P.bounds.minZ+1&&z<=P.bounds.maxZ-1;
function footprintClear(x,z,r=.8){
  for(const b of [estate.manorCore,estate.gardens,estate.outbuildingProposal,estate.acceptedEnvelope])if(Math.hypot(x-Math.max(b.minX,Math.min(b.maxX,x)),z-Math.max(b.minZ,Math.min(b.maxZ,z)))<=r)return false;
  if(estate.footRoute.slice(1).some((b,i)=>segmentDistance(x,z,estate.footRoute[i],b)<=estate.footRouteRadius+r))return false;
  return segmentDistance(x,z,{x:-145,z:-194},{x:-145,z:-230})>1.5+r;
}
function preservedPatch(x,z,r=.8){
  // Preserve accepted connected woodland geometry and fine oasis envelope.
  if(Math.hypot((x+141)/33,(z+226)/32)<=1.25+r/32)return true;
  const b=H_EARTH_OASIS_FOLIAGE_SAMPLE;
  return x>=b.minX-r&&x<=b.maxX+r&&z>=b.minZ-r&&z<=b.maxZ+r;
}
function contextFor(pkg){
  if(contexts.has(pkg))return contexts.get(pkg);
  const positions=pkg?.buffers?.positions,indices=pkg?.buffers?.indices;if(!positions||!indices)throw Error('LANDSCAPE_COVER_RENDERED_TERRAIN_REQUIRED');
  const bins=new Map(),triangles=[],size=16,key=(x,z)=>`${x}:${z}`;
  for(const span of pkg.primitiveSpans??[]){if(span.role!=='TERRAIN')continue;
    for(let offset=span.indexStart;offset<span.indexStart+span.indexCount;offset+=3){
      const vertices=[0,1,2].map(k=>{const i=indices[offset+k]*3;return{x:Math.fround(positions[i]),y:Math.fround(positions[i+1]),z:Math.fround(positions[i+2])};});
      const [a,b,c]=vertices,ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=c.x-a.x,vy=c.y-a.y,vz=c.z-a.z,ny=uz*vx-ux*vz;
      const triangle={vertices,triangleId:offset/3,terrainPrimitiveId:span.primitiveId,slope:Math.abs(ny)>1e-12?Math.hypot(uy*vz-uz*vy,ux*vy-uy*vx)/Math.abs(ny):Infinity};triangles.push(triangle);
      const xs=vertices.map(v=>v.x),zs=vertices.map(v=>v.z);
      for(let iz=Math.floor(Math.min(...zs)/size);iz<=Math.floor(Math.max(...zs)/size);iz++)for(let ix=Math.floor(Math.min(...xs)/size);ix<=Math.floor(Math.max(...xs)/size);ix++){const k=key(ix,iz);if(!bins.has(k))bins.set(k,[]);bins.get(k).push(triangle);}
    }
  }
  if(!triangles.length)throw Error('LANDSCAPE_COVER_TERRAIN_EMPTY');
  const sample=(x,z)=>{if(!inside(x,z))return null;
    for(const triangle of bins.get(key(Math.floor(x/size),Math.floor(z/size)))??[]){const[a,b,c]=triangle.vertices,det=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(det)<1e-12)continue;const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/det,v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/det,w=1-u-v;if(Math.min(u,v,w)<-1e-8)continue;return{x,y:Math.fround(u*a.y+v*b.y+w*c.y),z,triangleId:triangle.triangleId,terrainPrimitiveId:triangle.terrainPrimitiveId,slope:triangle.slope};}return null;};
  const obstacles=pkg.landscapeCoverFootprints??(pkg.landscapeFloorFootprints??[]).map(t=>({...t,radius:t.trunkRadius+.5}));
  const eligible=(x,z)=>{if(!inside(x,z)||!footprintClear(x,z,0)||preservedPatch(x,z,0))return false;const root=sample(x,z);if(!root||root.slope>.45)return false;const m=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);if(m?.valid!==true||!['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)||m.soilDepth<.20)return false;const r=sampleHEarthGen311PlacementStructureDisposition(x,z);return !r.hardExclusions.length&&!r.planningHolds.length&&!obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<t.radius+.8);};
  const context={sample,eligible,triangles,bins};contexts.set(pkg,context);return context;
}
/** Continuous palette field, sampled in the existing terrain-color loop; no geometry work. */
export function landscapeSoilColor(material,x,z,original=[material.baseColorProfile.linearR,material.baseColorProfile.linearG,material.baseColorProfile.linearB]){
  if(!['LOWLAND_SOIL','COASTAL_SOIL'].includes(material.surfaceClass)||preservedPatch(x,z))return original;
  const moisture=clamp((material.shelterMoisture??0)*.45+(material.drainageRetention??0)*.35+(material.waterSaturation??0)*.2),pocket=field(x,z,32,'soil'),t=.20+.16*pocket;
  // Warm dry soil and darker sheltered ground share the accepted grass palette.
  const dry=[.23,.185,.105],sheltered=[.13,.145,.075],green=smooth(.28,.55,moisture),target=dry.map((v,i)=>v+(sheltered[i]-v)*green);
  return original.map((v,i)=>v+(target[i]-v)*t);
}
export function buildHEarthLandscapeCoverPlan(pkg,{order='FORWARD'}={}){
  if(!['FORWARD','REVERSE','CHUNKED'].includes(order))throw Error('LANDSCAPE_COVER_ORDER_INVALID');
  const context=contextFor(pkg),cells=[];
  // Irregular elongated sweeps on every represented tile, with exposed-soil gaps.
  for(let tz=-12;tz<=1;tz++)for(let tx=-6;tx<=5;tx++){
    const tile=`${tx}:${tz}`,cx=tx*64+32+(hash(tile,'x')-.5)*24,cz=tz*64+32+(hash(tile,'z')-.5)*24,angle=hash(tile,'heading')*Math.PI,rx=13+hash(tile,'length')*10,rz=5+hash(tile,'width')*4,cos=Math.cos(angle),sin=Math.sin(angle);
    for(let iz=-3;iz<=3;iz++)for(let ix=-8;ix<=8;ix++){const id=`LANDSCAPE_COVER:${tile}:${ix}:${iz}`,dx=ix*2.8+(iz%2)*1.4+(hash(id,'jitter-x')-.5)*.8,dz=iz*2.8+(hash(id,'jitter-z')-.5)*.8,radial=Math.hypot(dx/rx,dz/rz);if(radial>=1)continue;cells.push({id,x:cx+dx*cos-dz*sin,z:cz+dx*sin+dz*cos,edge:1-smooth(.65,1,radial),patch:tile});}
  }
  // Connected shoulder beside the existing woodland, following the same fan recipe.
  for(let iz=0;iz<=47;iz++)for(let ix=0;ix<=52;ix++){const id=`LANDSCAPE_SHOULDER:${ix}:${iz}`,x=-220+ix*3+(iz%2)*1.5+(hash(id,'x')-.5)*.7,z=-292+iz*3*Math.sqrt(3)/2+(hash(id,'z')-.5)*.7,radial=Math.hypot((x+141)/68,(z+226)/62);if(radial>=1.15)continue;cells.push({id,x,z,edge:1-smooth(.85,1.15,radial),patch:'WOODLAND_SHOULDER'});}
  if(order==='REVERSE')cells.reverse();if(order==='CHUNKED')cells.sort((a,b)=>hash(a.id,'chunk')-hash(b.id,'chunk'));
  const placements=[],rejections={};
  for(const cell of cells){const {id,x,z,edge}=cell;let reason=!inside(x,z)?'OUTSIDE_RENDERED_DOMAIN':!footprintClear(x,z)?'FOOTPRINT_CLEARANCE':preservedPatch(x,z)?'ACCEPTED_PATCH_PRESERVED':!context.eligible(x,z)?'HABITAT_OR_SUPPORT':null;
    const m=reason?null:sampleHEarthRun8CSuccessorSurfaceMaterial(x,z),moisture=m?clamp((m.shelterMoisture??0)*.45+(m.drainageRetention??0)*.35+(m.waterSaturation??0)*.2):0,density=edge*(.40+.30*moisture),selection=field(x,z,9,'cover');
    if(!reason&&selection>density)reason='DENSITY_FEATHER';if(reason){rejections[reason]=(rejections[reason]??0)+1;continue;}
    const palette=field(x,z,12,'palette'),pocket=palette<.32?'BROWN':palette>.67?'OLIVE':'GOLD';placements.push({...cell,x:Math.fround(x),z:Math.fround(z),pocket,moisture,density,batchIndex:Math.floor(hash(id,'batch')*P.canonicalBatchCount)});
  }
  placements.sort((a,b)=>a.id.localeCompare(b.id));const batchCounts=Array(P.canonicalBatchCount).fill(0);for(const p of placements)batchCounts[p.batchIndex]++;
  if(placements.length>P.maximumTufts||placements.length*24>P.maximumTriangles||Math.max(...batchCounts)>P.maximumTuftsPerBatch)throw Error('LANDSCAPE_COVER_BUDGET_EXCEEDED');
  return Object.freeze({id:P.id,placements:Object.freeze(placements.map(Object.freeze)),candidateCount:cells.length,tuftCount:placements.length,maximumTriangles:placements.length*24,batchCounts:Object.freeze(batchCounts),rejections:Object.freeze(Object.fromEntries(Object.entries(rejections).sort())),cameraIndependent:true,canonicalPopulationChanged:false});
}
export function buildHEarthLandscapeCoverBatch(pkg,batchIndex,{plan=null}={}){
  if(!Number.isInteger(batchIndex)||batchIndex<0||batchIndex>=P.canonicalBatchCount)throw Error('LANDSCAPE_COVER_BATCH_INVALID');
  if(!plan){if(!plans.has(pkg))plans.set(pkg,buildHEarthLandscapeCoverPlan(pkg));plan=plans.get(pkg);}
  const context=contextFor(pkg),memo=new Map(),sample=(x,z)=>{const key=`${x}:${z}`;if(!memo.has(key))memo.set(key,context.sample(x,z));return memo.get(key);},primitives=[],rejections=[];
  for(const p of plan.placements.filter(p=>p.batchIndex===batchIndex)){
    let tuft;try{tuft=buildHEarthWoodlandGrassTuft({...p,bladeCount:4,sample,eligible:context.eligible,inside});}catch(error){if(String(error.message).startsWith('GRASS_TRIAL_INSUFFICIENT_ELIGIBLE_ROOTS:')||String(error.message).startsWith('WOODLAND_FAN_ROOT_INVALID:')){rejections.push({id:p.id,reason:'ROOT_COLLAR_NOT_QUALIFIED'});continue;}throw error;}
    if(tuft.geometry.vertices.length!==28||tuft.geometry.indices.length!==72||tuft.metadata.oasisFoliage.rootPoints.length!==12)throw Error('LANDSCAPE_COVER_RECIPE_DRIFT');
    primitives.push(Object.freeze({...tuft,metadata:Object.freeze({...tuft.metadata,landscapeIdentity:Object.freeze({id:P.id,patch:p.patch,batchIndex,sourceRecipe:'ACCEPTED_WOODLAND_FOUR_BLADE_FAN',canonicalPopulationChanged:false})})}));
  }
  return Object.freeze({id:P.id,batchIndex,primitives:Object.freeze(primitives),rejections:Object.freeze(rejections),tuftCount:primitives.length,triangleCount:primitives.length*24,vertexCount:primitives.length*28,canonicalPopulationChanged:false});
}
export function applyHEarthLandscapeCoverBatch(batch,pkg,batchIndex){
  const added=buildHEarthLandscapeCoverBatch(pkg,batchIndex);
  return Object.freeze({...batch,primitives:Object.freeze([...batch.primitives,...added.primitives]),landscapeIdentity:Object.freeze({id:P.id,addedTuftCount:added.tuftCount,addedTriangleCount:added.triangleCount,rootRejectionCount:added.rejections.length,canonicalPopulationChanged:false})});
}
