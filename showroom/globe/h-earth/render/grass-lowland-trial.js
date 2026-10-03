/** Gen2529: bounded presentation-only grass trial; no population or terrain authority. */
import { constructHEarthTriangleMesh, H_EARTH_3D_GEOMETRY_SOUTH_ENUMS as SOUTH } from './geometry-kernel.js';
import { sampleHEarthRun8CSuccessorSurfaceMaterial } from '../../../../h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';
import { sampleHEarthGen311PlacementStructureDisposition } from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';

export const H_EARTH_LOWLAND_GRASS_TRIAL = Object.freeze({
  id: 'H_EARTH_LOWLAND_GRASS_TRIAL_GEN2529_v1',
  minX: -32, maxX: -16, minZ: -158, maxZ: -142,
  bladesPerTuft: 48, maxSlope: 0.45
});
const P = H_EARTH_LOWLAND_GRASS_TRIAL;
const cache = new WeakMap();
const inside = (x,z) => Number.isFinite(x)&&Number.isFinite(z)&&x>=P.minX&&x<=P.maxX&&z>=P.minZ&&z<=P.maxZ;
const freeze = value => { if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value; };

/** Read the actual canonical package index stream, with the same Float32 position conversion as upload. */
export function buildHEarthGrassTrialTerrainIndex(renderPackage) {
  const positions=renderPackage?.buffers?.positions, indices=renderPackage?.buffers?.indices;
  if(!positions||!indices)throw new Error('GRASS_TRIAL_CANONICAL_TERRAIN_BUFFERS_REQUIRED');
  const triangles=[];
  for(const span of renderPackage.primitiveSpans??[]) {
    if(span.role!=='TERRAIN')continue;
    for(let offset=span.indexStart;offset<span.indexStart+span.indexCount;offset+=3) {
      const ids=[indices[offset],indices[offset+1],indices[offset+2]];
      const vertices=ids.map(id=>({x:Math.fround(positions[id*3]),y:Math.fround(positions[id*3+1]),z:Math.fround(positions[id*3+2])}));
      if(!vertices.every(v=>Object.values(v).every(Number.isFinite)))throw new Error('GRASS_TRIAL_NONFINITE_TERRAIN');
      const xs=vertices.map(v=>v.x),zs=vertices.map(v=>v.z);
      if(Math.max(...xs)<P.minX||Math.min(...xs)>P.maxX||Math.max(...zs)<P.minZ||Math.min(...zs)>P.maxZ)continue;
      triangles.push({triangleId:offset/3,primitiveId:span.primitiveId,indices:ids,vertices});
    }
  }
  if(!triangles.length)throw new Error('GRASS_TRIAL_TERRAIN_PATCH_NOT_FOUND');
  return freeze({triangles,positionEncoding:'CANONICAL_PACKAGE_THEN_FLOAT32',packageIdentity:renderPackage.packageIdentity});
}
export function sampleHEarthGrassTrialTerrain(index,x,z) {
  if(!inside(x,z))return null;
  for(const triangle of index.triangles) {
    const [a,b,c]=triangle.vertices;
    const determinant=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);
    if(Math.abs(determinant)<1e-12)continue;
    const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/determinant;
    const v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/determinant,w=1-u-v;
    if(Math.min(u,v,w)<-1e-8)continue;
    return {x,y:Math.fround(u*a.y+v*b.y+w*c.y),z,triangleId:triangle.triangleId,terrainPrimitiveId:triangle.primitiveId,barycentric:[u,v,w]};
  }
  return null;
}
function rootEligible(x,z) {
  if(!inside(x,z))return false;
  const material=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
  if(material?.valid!==true||!['LOWLAND_SOIL','COASTAL_SOIL'].includes(material.surfaceClass)||!Number.isFinite(material.slope)||material.slope>P.maxSlope)return false;
  const reservation=sampleHEarthGen311PlacementStructureDisposition(x,z);
  return reservation.status==='NO_KNOWN_ESTATE_FOOTPRINT_OVERLAP'&&reservation.hardExclusions.length===0&&reservation.planningHolds.length===0;
}
function randomFor(id) {
  let state=2166136261;
  for(const c of String(id)){state^=c.charCodeAt(0);state=Math.imul(state,16777619);}
  return ()=>{state+=0x6D2B79F5;let n=state;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return ((n^(n>>>14))>>>0)/4294967296;};
}
function eligiblePrimitive(primitive) {
  const anchor=primitive?.metadata?.worldAnchor;
  return primitive?.materialHint?.archetypeId==='COASTAL_GRASS_TUFT'&&anchor&&inside(anchor.x,anchor.z)&&rootEligible(anchor.x,anchor.z);
}
function replaceTuft(primitive,index) {
  const anchor=primitive.metadata.worldAnchor,random=randomFor(primitive.primitiveId);
  const vertices=[],indices=[],roots=[];let bladeCount=0;
  for(let attempt=0;attempt<P.bladesPerTuft*5&&bladeCount<P.bladesPerTuft;attempt++) {
    const angle=random()*Math.PI*2,radius=Math.sqrt(random())*.34;
    const x=Math.fround(anchor.x+Math.cos(angle)*radius),z=Math.fround(anchor.z+Math.sin(angle)*radius);
    const heading=angle+(random()-.5)*1.8,height=.25+random()*.40,width=.006+random()*.009;
    const bend=.06+random()*.21,dx=Math.cos(heading),dz=Math.sin(heading),sx=-dz,sz=dx;
    const root=sampleHEarthGrassTrialTerrain(index,x,z);
    if(!root||!rootEligible(x,z))continue;
    const blade=[],rootSamples=[];
    let valid=true;
    // Three columns form a shallow folded leaf. Five curved sections taper into one point.
    for(let section=0;section<5;section++) {
      const t=section/5,cx=x+dx*bend*t*t,cz=z+dz*bend*t*t;
      const half=width*.5*Math.pow(1-t,.8);
      for(let column=-1;column<=1;column++) {
        const vx=Math.fround(cx+sx*half*column),vz=Math.fround(cz+sz*half*column);
        if(!inside(vx,vz)){valid=false;break;}
        let vy=root.y+height*(t-.13*t*t)+(column===0?width*.24*Math.sin(Math.PI*t):0);
        if(section===0){const sample=sampleHEarthGrassTrialTerrain(index,vx,vz);if(!sample||!rootEligible(vx,vz)){valid=false;break;}vy=sample.y;rootSamples.push({...sample,bladeIndex:bladeCount,column});}
        blade.push({x:vx,y:Math.fround(vy),z:vz});
      }
      if(!valid)break;
    }
    const tip={x:Math.fround(x+dx*bend),y:Math.fround(root.y+height*.87),z:Math.fround(z+dz*bend)};
    if(!valid||!inside(tip.x,tip.z))continue;
    const start=vertices.length;vertices.push(...blade,tip);
    for(let row=0;row<4;row++)for(let side=0;side<2;side++){
      const a=start+row*3+side,b=a+1,c=a+3,d=c+1;
      indices.push(a,b,c,b,d,c);
    }
    indices.push(start+12,start+13,start+15,start+13,start+14,start+15);
    roots.push(...rootSamples.map((sample,i)=>({...sample,vertexIndex:start+i})));bladeCount++;
  }
  if(bladeCount<32)throw new Error(`GRASS_TRIAL_INSUFFICIENT_ELIGIBLE_ROOTS:${primitive.primitiveId}`);
  const result=constructHEarthTriangleMesh({
    primitiveId:primitive.primitiveId,geometryId:primitive.geometry.geometryId,
    primitiveType:SOUTH.primitiveType.TRIANGLE_MESH,vertices,indices,
    normalMode:SOUTH.normalMode.FACE_AND_VERTEX,expectedClosure:SOUTH.expectedClosure.OPEN_ALLOWED,
    semanticRole:primitive.semanticRole,materialHint:primitive.materialHint,
    metadata:{...primitive.metadata,lowlandGrassTrial:{id:P.id,bladeCount,rootPoints:roots,sourceGeometryId:primitive.geometry.geometryId,worldTruthMutated:false,attachment:'FINAL_CANONICAL_FLOAT32_TERRAIN_TRIANGLES'}},
    source:primitive.source??{sourceType:'BOUNDED_GRASS_PRESENTATION_TRIAL'}
  });
  if(!result.valid||!result.primitiveRecord)throw new Error(`GRASS_TRIAL_SOUTH_CONSTRUCTION_FAILED:${JSON.stringify(result.issues)}`);
  return result.primitiveRecord;
}
/** Owner-directed presentation suppression; canonical population truth stays intact. */
export function applyHEarthLowlandGrassTrialBatch(batch,renderPackage) {
  const needsReplacement=batch.primitives.some(primitive=>eligiblePrimitive(primitive)&&!primitive.metadata?.lowlandGrassTrial);
  let index;
  if(needsReplacement){
    index=cache.get(renderPackage);
    if(!index){index=buildHEarthGrassTrialTerrainIndex(renderPackage);cache.set(renderPackage,index);}
  }
  let replacedPrimitiveCount=0,suppressedLegacyGrassCount=0;
  const primitives=[];
  for(const primitive of batch.primitives){
    let presented=primitive;
    if(eligiblePrimitive(primitive)&&!primitive.metadata?.lowlandGrassTrial){
      presented=replaceTuft(primitive,index);replacedPrimitiveCount++;
    }
    if(presented.materialHint?.archetypeId==='COASTAL_GRASS_TUFT'&&!presented.metadata?.lowlandGrassTrial){
      suppressedLegacyGrassCount++;continue;
    }
    primitives.push(presented);
  }
  return freeze({...batch,primitives,lowlandGrassTrial:{
    id:P.id,
    presentationPolicyId:'H_EARTH_ACCEPTED_PATCH_GRASS_ONLY_LEGACY_GRASS_HIDDEN_v1',
    replacedPrimitiveCount,suppressedLegacyGrassCount,renderedPrimitiveCount:primitives.length,
    populationIdentityPreserved:true,legacyGrassPresentationSuppressed:true,
    completeWorldPlacementPresentationClaimed:false
  }});
}
