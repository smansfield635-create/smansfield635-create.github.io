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
export function buildHEarthGrassTrialTerrainIndex(renderPackage,bounds=P,water=false) {
  const positions=renderPackage?.buffers?.positions, indices=renderPackage?.buffers?.indices;
  if(!positions||!indices)throw new Error('GRASS_TRIAL_CANONICAL_TERRAIN_BUFFERS_REQUIRED');
  const triangles=[];
  for(const span of renderPackage.primitiveSpans??[]) {
    if(water?!String(span.primitiveId).includes('FAR_OCEAN_CONTINUATION'):span.role!=='TERRAIN')continue;
    for(let offset=span.indexStart;offset<span.indexStart+span.indexCount;offset+=3) {
      const ids=[indices[offset],indices[offset+1],indices[offset+2]];
      const vertices=ids.map(id=>({x:Math.fround(positions[id*3]),y:Math.fround(positions[id*3+1]),z:Math.fround(positions[id*3+2])}));
      if(!vertices.every(v=>Object.values(v).every(Number.isFinite)))throw new Error('GRASS_TRIAL_NONFINITE_TERRAIN');
      const xs=vertices.map(v=>v.x),zs=vertices.map(v=>v.z);
      if(Math.max(...xs)<bounds.minX||Math.min(...xs)>bounds.maxX||Math.max(...zs)<bounds.minZ||Math.min(...zs)>bounds.maxZ)continue;
      triangles.push({triangleId:offset/3,primitiveId:span.primitiveId,indices:ids,vertices});
    }
  }
  if(!triangles.length)throw new Error('GRASS_TRIAL_TERRAIN_PATCH_NOT_FOUND');
  return freeze({triangles,bounds,positionEncoding:'CANONICAL_PACKAGE_THEN_FLOAT32',packageIdentity:renderPackage.packageIdentity});
}
export function sampleHEarthGrassTrialTerrain(index,x,z) {
  const b=index.bounds??P;if(x<b.minX||x>b.maxX||z<b.minZ||z>b.maxZ)return null;
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
  const oasis=batch.batchId===O.batchId?buildHEarthOasisFoliagePresentation(renderPackage):null;
  if(oasis)primitives.push(...oasis.primitives);
  return freeze({...batch,primitives,oasisFoliage:oasis?{id:O.id,grassTuftCount:oasis.grassTuftCount,cattailCount:oasis.cattailCount,addedPresentationPrimitiveCount:oasis.primitives.length,worldPlacementCountChanged:false,waterPrimitive:O.waterPrimitive}:null,lowlandGrassTrial:{
    id:P.id,
    presentationPolicyId:'H_EARTH_ACCEPTED_PATCH_GRASS_ONLY_LEGACY_GRASS_HIDDEN_v1',
    replacedPrimitiveCount,suppressedLegacyGrassCount,renderedPrimitiveCount:primitives.length,
    populationIdentityPreserved:true,legacyGrassPresentationSuppressed:true,
    completeWorldPlacementPresentationClaimed:false
  }});
}

/** Owner-requested wet-edge visual sample. Existing continuous water is not reclassified as freshwater. */
export const H_EARTH_OASIS_FOLIAGE_SAMPLE=freeze({
  id:'H_EARTH_BOUNDED_WET_EDGE_FOLIAGE_SAMPLE_v1',
  minX:-14,maxX:2,minZ:-174,maxZ:-158,bladesPerTuft:48,
  batchId:'GEN2514_BATCH:H_EARTH_GEN311_PLACEMENT:0001527b',
  waterPrimitive:'FAR_OCEAN_CONTINUATION',waterAuthorityChanged:false,
  canonicalPlacementAuthorityChanged:false,maximumTriangles:100000
});
const O=H_EARTH_OASIS_FOLIAGE_SAMPLE,oasisCache=new WeakMap(),waterForIndex=new WeakMap();
const oasisInside=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&x>=O.minX&&x<=O.maxX&&z>=O.minZ&&z<=O.maxZ;
function oasisEligible(index,x,z,wet){
  if(!oasisInside(x,z))return false;
  const t=sampleHEarthGrassTrialTerrain(index,x,z),w=sampleHEarthGrassTrialTerrain(waterForIndex.get(index),x,z);
  if(!t||!w)return false;
  const clearance=t.y-w.y;
  if(wet?(clearance<-.30||clearance>.18):(clearance<.035||clearance>1.10))return false;
  const m=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
  if(!m.valid||!['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)||m.slope>.45)return false;
  const r=sampleHEarthGen311PlacementStructureDisposition(x,z);
  return r.status==='NO_KNOWN_ESTATE_FOOTPRINT_OVERLAP'&&!r.hardExclusions.length&&!r.planningHolds.length;
}
const mixRgb=(a,b,t)=>a.map((v,i)=>Math.max(0,Math.min(1,(v+(b[i]-v)*t)/255)));
function colorOasisPrimitive(primitive,kind,bankClearance=0){
  const verts=primitive.geometry.vertices,rng=randomFor(`${primitive.primitiveId}:NATURAL_COLOR_V2`),colors=[];
  const dryness=Math.max(0,Math.min(1,(bankClearance-.035)/.80));
  if(kind==='GRASS'){
    // Stable per-blade palettes: olive, yellow-green, cooler green, and sparse straw.
    const palettes=[[[65,78,33],[133,146,65]],[[84,96,39],[167,168,79]],[[39,75,42],[95,145,90]],[[85,70,38],[199,166,99]]];
    for(let base=0;base<verts.length;base+=16){
      const draw=rng(),strawShare=.025+.13*dryness,yellowShare=.19+.20*dryness,oliveShare=.27;
      const palette=palettes[draw<strawShare?3:draw<strawShare+yellowShare?1:draw<strawShare+yellowShare+oliveShare?0:2],shade=.89+rng()*.20;
      for(let i=0;i<16&&base+i<verts.length;i++){
        const t=i===15?1:Math.floor(i/3)/5,c=mixRgb(palette[0],palette[1],Math.pow(t,.72));
        colors.push(c.map(v=>Math.min(1,v*shade)));
      }
    }
  }else if(kind==='CATTAIL_STEM_AND_LEAVES'){
    const stemShade=.9+rng()*.15;
    for(let i=0;i<48;i++)colors.push(mixRgb([35,65,43],[91,124,73],Math.floor(i/8)/5).map(v=>v*stemShade));
    for(let base=48;base<verts.length;base+=19){
      const aged=rng()<.10+.12*dryness,shade=.88+rng()*.20,lo=aged?[105,90,44]:[29,67,47],hi=aged?[172,146,83]:[99,146,97];
      for(let i=0;i<19&&base+i<verts.length;i++)colors.push(mixRgb(lo,hi,i===18?1:Math.floor(i/3)/6).map(v=>v*shade));
    }
  }else{
    const shade=.82+rng()*.27,minY=Math.min(...verts.map(v=>v.y)),maxY=Math.max(...verts.map(v=>v.y));
    for(const v of verts)colors.push(mixRgb([62,39,23],[132,91,49],(v.y-minY)/(maxY-minY||1)).map(c=>c*shade));
  }
  if(colors.length!==verts.length)throw new Error('OASIS_VERTEX_COLOR_COUNT_MISMATCH');
  return freeze({...primitive,metadata:{...primitive.metadata,oasisFoliage:{...primitive.metadata.oasisFoliage,vertexColorsSrgb:colors,colorEncoding:'SRGB_NORMALIZED_RGB',bankClearanceMeters:bankClearance,dryBankPaletteBias:dryness,colorDesign:'ROOT_TIP_GRADIENT_SEEDED_BLADE_VARIATION_V2',heightLayers:kind==='GRASS'?['SHORT_UNDERSTORY','TALL_CURVED_BLADES']:null}}});
}
function replaceOasisTuft(primitive,index) {
  const anchor=primitive.metadata.worldAnchor,random=randomFor(primitive.primitiveId);
  const vertices=[],indices=[],roots=[];let bladeCount=0;
  for(let attempt=0;attempt<O.bladesPerTuft*5&&bladeCount<O.bladesPerTuft;attempt++) {
    const angle=random()*Math.PI*2,radius=Math.sqrt(random())*.34;
    const x=Math.fround(anchor.x+Math.cos(angle)*radius),z=Math.fround(anchor.z+Math.sin(angle)*radius);
    const shortLayer=bladeCount%3!==0;
    const heading=angle+(random()-.5)*1.8,height=shortLayer?.10+random()*.18:.34+random()*.43,width=shortLayer?.008+random()*.012:.007+random()*.011;
    const bend=shortLayer?.09+random()*.20:.12+random()*.29,dx=Math.cos(heading),dz=Math.sin(heading),sx=-dz,sz=dx;
    const root=sampleHEarthGrassTrialTerrain(index,x,z);
    if(!root||!oasisEligible(index,x,z,false))continue;
    const blade=[],rootSamples=[];
    let valid=true;
    // Three columns form a shallow folded leaf. Five curved sections taper into one point.
    for(let section=0;section<5;section++) {
      const t=section/5,cx=x+dx*bend*t*t,cz=z+dz*bend*t*t;
      const half=width*.5*Math.pow(1-t,.8);
      for(let column=-1;column<=1;column++) {
        const vx=Math.fround(cx+sx*half*column),vz=Math.fround(cz+sz*half*column);
        if(!oasisInside(vx,vz)){valid=false;break;}
        let vy=root.y+height*(t-.13*t*t)+(column===0?width*.24*Math.sin(Math.PI*t):0);
        if(section===0){const sample=sampleHEarthGrassTrialTerrain(index,vx,vz);if(!sample||!oasisEligible(index,vx,vz,false)){valid=false;break;}vy=sample.y;rootSamples.push({...sample,bladeIndex:bladeCount,column});}
        blade.push({x:vx,y:Math.fround(vy),z:vz});
      }
      if(!valid)break;
    }
    const tip={x:Math.fround(x+dx*bend),y:Math.fround(root.y+height*.87),z:Math.fround(z+dz*bend)};
    if(!valid||!oasisInside(tip.x,tip.z))continue;
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
    metadata:{...primitive.metadata,oasisFoliage:{id:O.id,bladeCount,rootPoints:roots,sourceGeometryId:primitive.geometry.geometryId,worldTruthMutated:false,attachment:'FINAL_CANONICAL_FLOAT32_TERRAIN_TRIANGLES'}},
    source:primitive.source??{sourceType:'BOUNDED_GRASS_PRESENTATION_TRIAL'}
  });
  if(!result.valid||!result.primitiveRecord)throw new Error(`GRASS_TRIAL_SOUTH_CONSTRUCTION_FAILED:${JSON.stringify(result.issues)}`);
  const water=sampleHEarthGrassTrialTerrain(waterForIndex.get(index),anchor.x,anchor.z);
  const ground=sampleHEarthGrassTrialTerrain(index,anchor.x,anchor.z);
  return colorOasisPrimitive(result.primitiveRecord,'GRASS',ground.y-water.y);
}

function oasisMesh(id,vertices,indices,roots,intent,kind,bankClearance=0){
  const r=constructHEarthTriangleMesh({primitiveId:id,geometryId:`${id}:GEOMETRY`,primitiveType:SOUTH.primitiveType.TRIANGLE_MESH,vertices,indices,normalMode:SOUTH.normalMode.FACE_AND_VERTEX,expectedClosure:SOUTH.expectedClosure.OPEN_ALLOWED,semanticRole:'BOUNDED_WET_EDGE_PRESENTATION',materialHint:{materialIntent:intent,archetypeId:'OASIS_CATTAIL'},metadata:{oasisFoliage:{id:O.id,kind,rootPoints:roots,worldTruthMutated:false,attachment:'FINAL_CANONICAL_FLOAT32_TERRAIN_TRIANGLES'}},source:{sourceType:'OWNER_REQUESTED_BOUNDED_FOLIAGE_PRESENTATION'}});
  if(!r.valid||!r.primitiveRecord)throw new Error(`OASIS_MESH_INVALID:${id}:${JSON.stringify(r.issues)}`);
  return colorOasisPrimitive(r.primitiveRecord,kind,bankClearance);
}
function cattail(index,x,z,number){
  const id=`${O.id}:CATTAIL:${number}`,rng=randomFor(id),root=sampleHEarthGrassTrialTerrain(index,x,z),h=1.15+rng()*.65,angle=rng()*Math.PI*2,lean=.04+rng()*.09;
  const verts=[],inds=[],roots=[];
  // Narrow bent tubular stem, rooted around its entire circumference.
  for(let row=0;row<=5;row++)for(let side=0;side<8;side++){
    const t=row/5,a=side*Math.PI/4,vx=x+Math.cos(angle)*lean*t*t+Math.cos(a)*.013,vz=z+Math.sin(angle)*lean*t*t+Math.sin(a)*.013;
    let y=root.y+h*t;
    if(!row){const r=sampleHEarthGrassTrialTerrain(index,vx,vz);if(!r||!oasisEligible(index,vx,vz,true))return null;y=r.y;roots.push({...r,vertexIndex:verts.length});}
    verts.push({x:Math.fround(vx),y:Math.fround(y),z:Math.fround(vz)});
    if(row){const a0=(row-1)*8+side,b0=(row-1)*8+(side+1)%8,c0=row*8+side,d0=row*8+(side+1)%8;inds.push(a0,b0,c0,b0,d0,c0);}
  }
  // Six folded strap leaves, each curved outward and attached to final ground triangles.
  for(let leaf=0;leaf<6;leaf++){
    const a=angle+leaf*2.399963+rng()*.45,dx=Math.cos(a),dz=Math.sin(a),lh=h*(.52+rng()*.29),bend=.22+rng()*.30,width=.015+rng()*.012,start=verts.length;
    for(let row=0;row<6;row++){
      const t=row/6,cx=x+dx*bend*t*t,cz=z+dz*bend*t*t;
      for(let col=-1;col<=1;col++){
        const half=width*Math.pow(1-t,.8),vx=cx-dz*half*col,vz=cz+dx*half*col;
        if(!oasisInside(vx,vz))return null;
        let y=root.y+lh*(t-.13*t*t)+(col===0?width*.3*Math.sin(Math.PI*t):0);
        if(!row){const r=sampleHEarthGrassTrialTerrain(index,vx,vz);if(!r||!oasisEligible(index,vx,vz,true))return null;y=r.y;roots.push({...r,vertexIndex:verts.length});}
        verts.push({x:Math.fround(vx),y:Math.fround(y),z:Math.fround(vz)});
      }
      if(row)for(let c=0;c<2;c++){const a0=start+(row-1)*3+c,b0=a0+1,c0=start+row*3+c,d0=c0+1;inds.push(a0,b0,c0,b0,d0,c0);}
    }
    const tip=verts.length;verts.push({x:Math.fround(x+dx*bend),y:Math.fround(root.y+lh*.87),z:Math.fround(z+dz*bend)});inds.push(start+15,start+16,tip,start+16,start+17,tip);
  }
  const headV=[],headI=[],baseY=root.y+h*.80,length=.22+rng()*.11,radius=.033+rng()*.012;
  // Rounded closed seedhead: six radial rings plus two polar points (no planar cards).
  for(let ring=0;ring<6;ring++){
    const t=ring/5,r=radius*(ring===0||ring===5?.42:1),cy=baseY+length*t;
    for(let side=0;side<10;side++){const a=side*Math.PI/5,stemT=(cy-root.y)/h;headV.push({x:Math.fround(x+Math.cos(angle)*lean*stemT*stemT+Math.cos(a)*r),y:Math.fround(cy),z:Math.fround(z+Math.sin(angle)*lean*stemT*stemT+Math.sin(a)*r)});if(ring){const p=(ring-1)*10+side,q=(ring-1)*10+(side+1)%10,r0=ring*10+side,s0=ring*10+(side+1)%10;headI.push(p,q,r0,q,s0,r0);}}
  }
  for(const [ring,dy] of [[0,-radius*.3],[5,radius*.3]]){
    const cy=baseY+length*(ring/5)+dy,t=(cy-root.y)/h,tip=headV.length;headV.push({x:Math.fround(x+Math.cos(angle)*lean*t*t),y:Math.fround(cy),z:Math.fround(z+Math.sin(angle)*lean*t*t)});for(let side=0;side<10;side++){const a=ring*10+side,b=ring*10+(side+1)%10;headI.push(...(ring?[a,b,tip]:[b,a,tip]));}
  }
  for(let i=0;i<headI.length;i+=3){const t=headI[i+1];headI[i+1]=headI[i+2];headI[i+2]=t;}
  return [oasisMesh(`${id}:STEM_LEAVES`,verts,inds,roots,'SHRUB_GREEN_CATTAIL','CATTAIL_STEM_AND_LEAVES',root.y-sampleHEarthGrassTrialTerrain(waterForIndex.get(index),x,z).y),oasisMesh(`${id}:SEEDHEAD`,headV,headI,[],'WOODY_BROWN_CATTAIL_SEEDHEAD','ROUNDED_CATTAIL_SEEDHEAD')];
}
export function buildHEarthOasisFoliagePresentation(renderPackage){
  if(oasisCache.has(renderPackage))return oasisCache.get(renderPackage);
  const index=buildHEarthGrassTrialTerrainIndex(renderPackage,O),water=buildHEarthGrassTrialTerrainIndex(renderPackage,O,true);waterForIndex.set(index,water);
  const primitives=[],rng=randomFor(O.id);let grassTuftCount=0,cattailCount=0;
  const candidates=[];
  // Overlapping tuft footprints follow the bank as one irregular band; preserve two small gaps.
  for(let z=-172.8,row=0;z<=-159.4;z+=.48,row++)for(let across=-1.30;across<=1.30;across+=.48){
    const pathX=-8.3+(z+161)*.34;
    const x=pathX+across+(rng()-.5)*.28+(row%2)*.13,zz=z+(rng()-.5)*.28;
    const edgeNoise=.88+.18*Math.sin(zz*1.71)+.14*Math.cos(x*2.13);
    if(Math.abs(across)>1.24*edgeNoise)continue;
    if(Math.hypot((x+9.5)/.42,(zz+163.6)/.50)<1||Math.hypot((x+11.6)/.42,(zz+169.1)/.55)<1)continue;
    candidates.push({x,z:zz,priority:rng()});
  }
  // Seeded ordering fills all parts of the band before increasing local density.
  candidates.sort((a,b)=>a.priority-b.priority);
  for(const {x,z} of candidates){
    if(grassTuftCount>=96)break;
    if(!oasisEligible(index,x,z,false)||!oasisInside(x-.65,z-.65)||!oasisInside(x+.65,z+.65))continue;
    const id=`${O.id}:GRASS:${grassTuftCount}`,source={primitiveId:id,geometry:{geometryId:`${id}:GEOMETRY`},semanticRole:'BOUNDED_WET_EDGE_PRESENTATION',materialHint:{materialIntent:'COASTAL_GRASS_GREEN',archetypeId:'OASIS_ACCEPTED_BLADE_GRASS'},metadata:{worldAnchor:{x,y:sampleHEarthGrassTrialTerrain(index,x,z).y,z}},source:{sourceType:'OWNER_REQUESTED_BOUNDED_FOLIAGE_PRESENTATION'}};
    try{primitives.push(replaceOasisTuft(source,index));grassTuftCount++;}catch(error){if(!String(error.message).startsWith('GRASS_TRIAL_INSUFFICIENT_ELIGIBLE_ROOTS:'))throw error;}
  }
  const wetCenters=[[-8,-166],[-6,-164],[-10,-170]];
  for(let attempt=0;attempt<240&&cattailCount<18;attempt++){
    const c=wetCenters[attempt%3],a=rng()*Math.PI*2,r=Math.sqrt(rng())*.85,x=c[0]+Math.cos(a)*r,z=c[1]+Math.sin(a)*r;
    if(!oasisEligible(index,x,z,true))continue;const p=cattail(index,x,z,cattailCount);if(!p)continue;primitives.push(...p);cattailCount++;
  }
  if(grassTuftCount<48||cattailCount<9)throw new Error(`OASIS_ELIGIBLE_SAMPLE_INCOMPLETE:${grassTuftCount}:${cattailCount}`);
  const triangleCount=primitives.reduce((n,p)=>n+p.geometry.indices.length/3,0);if(triangleCount>O.maximumTriangles)throw new Error('OASIS_TRIANGLE_BUDGET_EXCEEDED');
  const out=freeze({id:O.id,primitives,grassTuftCount,cattailCount,triangleCount,waterPrimitive:O.waterPrimitive,worldPlacementCountChanged:false});oasisCache.set(renderPackage,out);return out;
}
