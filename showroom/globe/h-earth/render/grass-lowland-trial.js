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
  id:'H_EARTH_CONNECTED_OASIS_BANK_FOLIAGE_GEN2532_v1',
  minX:-18,maxX:34,minZ:-204,maxZ:-131,bladesPerTuft:48,
  batchId:'GEN2514_BATCH:H_EARTH_GEN311_PLACEMENT:0001527b',
  waterPrimitive:'FAR_OCEAN_CONTINUATION',waterAuthorityChanged:false,
  canonicalPlacementAuthorityChanged:false,maximumTriangles:350000
});
const O=H_EARTH_OASIS_FOLIAGE_SAMPLE,oasisCache=new WeakMap(),waterForIndex=new WeakMap(),basinForIndex=new WeakMap(),basinCache=new WeakMap(),slopeForIndex=new WeakMap();
const oasisInside=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&x>=O.minX&&x<=O.maxX&&z>=O.minZ&&z<=O.maxZ;
function actualTriangleSlope(index,triangleId){
  let slopes=slopeForIndex.get(index);if(!slopes){slopes=new Map();for(const t of index.triangles){const [a,b,c]=t.vertices,ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=c.x-a.x,vy=c.y-a.y,vz=c.z-a.z,nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;slopes.set(t.triangleId,Math.abs(ny)>1e-12?Math.hypot(nx,nz)/Math.abs(ny):Infinity);}slopeForIndex.set(index,slopes);}return slopes.get(triangleId)??Infinity;
}
function connectBasin(index,water){
  const wet=new Set(),key=(x,z)=>`${x},${z}`;
  for(let z=O.minZ;z<=O.maxZ;z++)for(let x=O.minX;x<=O.maxX;x++){
    const t=sampleHEarthGrassTrialTerrain(index,x,z),w=sampleHEarthGrassTrialTerrain(water,x,z);if(t&&w&&w.y>t.y)wet.add(key(x,z));
  }
  const seed=key(-6,-164);if(!wet.has(seed))throw new Error('OASIS_CONNECTED_BASIN_SEED_NOT_WET');
  const connected=new Set([seed]),queue=[[-6,-164]];
  for(let i=0;i<queue.length;i++){const [x,z]=queue[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const q=key(x+dx,z+dz);if(wet.has(q)&&!connected.has(q)){connected.add(q);queue.push([x+dx,z+dz]);}}}
  const distances=new Map([...connected].map(k=>[k,0])),bankQueue=queue.slice();
  for(let i=0;i<bankQueue.length;i++){const [x,z]=bankQueue[i],d=distances.get(key(x,z));if(d>=4)continue;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(oasisInside(nx,nz)&&!distances.has(k)){distances.set(k,d+1);bankQueue.push([nx,nz]);}}}
  return {connected,distances,receipt:freeze({schema:'OASIS_CONNECTED_RENDERED_WATER_GRID_v1',seed:{x:-6,z:-164},gridSpacingMeters:1,adjacency:'FOUR_CARDINAL_NEIGHBORS',grassMaximumGridDistance:4,wetCells:queue.map(([x,z])=>({x,z})),wetCellCount:connected.size,waterPrimitive:O.waterPrimitive})};
}
export function buildHEarthOasisConnectedBasinIndex(renderPackage){
  if(basinCache.has(renderPackage))return basinCache.get(renderPackage);
  const terrain=buildHEarthGrassTrialTerrainIndex(renderPackage,O),water=buildHEarthGrassTrialTerrainIndex(renderPackage,O,true),basin=connectBasin(terrain,water);
  const receipt=basin.receipt;basinCache.set(renderPackage,receipt);return receipt;
}
function oasisEligible(index,x,z,wet){
  if(!oasisInside(x,z))return false;
  const t=sampleHEarthGrassTrialTerrain(index,x,z),w=sampleHEarthGrassTrialTerrain(waterForIndex.get(index),x,z);
  if(!t||!w||actualTriangleSlope(index,t.triangleId)>.45)return false;
  const clearance=t.y-w.y;
  if(wet?(clearance<-.45||clearance>0):(clearance<.035||clearance>1.10))return false;
  const basin=basinForIndex.get(index),cell=`${Math.round(x)},${Math.round(z)}`;
  if(wet?!basin.connected.has(cell):!basin.distances.has(cell))return false;
  const m=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
  if(!m.valid||!['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)||!Number.isFinite(m.soilDepth)||m.soilDepth<.20||m.slope>.45)return false;
  const r=sampleHEarthGen311PlacementStructureDisposition(x,z);
  return r.status==='NO_KNOWN_ESTATE_FOOTPRINT_OVERLAP'&&!r.hardExclusions.length&&!r.planningHolds.length;
}
const shorelineSection=freeze({minX:-15,maxX:-3,minZ:-176,maxZ:-154,inset:.8});
function shorelineAnchor(x,z){const b=shorelineSection;return x>=b.minX+b.inset&&x<=b.maxX-b.inset&&z>=b.minZ+b.inset&&z<=b.maxZ-b.inset;}
function shorelineStyle(x,z){
  const signal=Math.sin(x*.91+z*.39)+.62*Math.cos(x*.37-z*.73);
  return signal>.45?'GOLD':signal<-.45?'BROWN':'OLIVE';
}
function refineGrassUpper(vertices,anchor,index,id){
  if(!shorelineAnchor(anchor.x,anchor.z))return null;
  const rng=randomFor(`${id}:SHORELINE_LEAF_FORM`),tuftScale=.68+rng()*.62,pocket=shorelineStyle(anchor.x,anchor.z);
  for(let start=0;start<vertices.length;start+=16){
    const root=vertices[start+1],tip=vertices[start+15],dx=tip.x-root.x,dz=tip.z-root.z,oldBend=Math.hypot(dx,dz),ux=oldBend?dx/oldBend:1,uz=oldBend?dz/oldBend:0;
    const collapsed=rng()<(pocket==='BROWN'?.48:.24),heightScale=collapsed?.18+rng()*.20:tuftScale*(.80+rng()*.35),spread=collapsed?1.6+rng()*.55:1.25+rng()*.50,widthScale=2.3+rng()*1.8;
    for(let local=3;local<16;local++){
      const v=vertices[start+local],t=local===15?1:Math.floor(local/3)/5,px=v.x-root.x,pz=v.z-root.z,along=px*ux+pz*uz,side=-px*uz+pz*ux;
      let x=root.x+ux*along*spread-uz*side*(1+(widthScale-1)*Math.sin(Math.PI*t*.85)),z=root.z+uz*along*spread+ux*side*(1+(widthScale-1)*Math.sin(Math.PI*t*.85));
      const ax=x-anchor.x,az=z-anchor.z,r=Math.hypot(ax,az);if(r>.69){x=anchor.x+ax*.69/r;z=anchor.z+az*.69/r;}
      const terrain=sampleHEarthGrassTrialTerrain(index,x,z);let y=root.y+(v.y-root.y)*heightScale;
      if(collapsed)y+=.035*Math.sin(Math.PI*t);
      y=Math.max(y,(terrain?.y??root.y)+.018+.018*Math.sin(Math.PI*t));
      vertices[start+local]={x:Math.fround(x),y:Math.fround(y),z:Math.fround(z)};
    }
  }
  return {version:'REPRESENTATIVE_SHORELINE_LEAF_REFINEMENT_v1',section:shorelineSection,anchor:{x:anchor.x,z:anchor.z},pocket,rootVerticesPreserved:true};
}
function refineCattailUpper(stem,head,roots,x,z,id){
  if(!shorelineAnchor(x,z))return null;
  const rng=randomFor(`${id}:SHORELINE_CATTAIL_FORM`),base=roots.reduce((n,r)=>n+r.y,0)/roots.length,heightScale=.72+rng()*.63,leanX=(rng()-.5)*.36,leanZ=(rng()-.5)*.36,rootIds=new Set(roots.map(r=>r.vertexIndex));
  const transform=(v,isHead=false)=>{const h=Math.max(0,v.y-base),t=h/1.8;return {x:Math.fround(v.x+leanX*t*t),y:Math.fround(base+(v.y-base)*heightScale),z:Math.fround(v.z+leanZ*t*t)};};
  for(let i=0;i<stem.length;i++)if(!rootIds.has(i))stem[i]=transform(stem[i]);
  for(let i=0;i<head.length;i++)head[i]=transform(head[i],true);
  return {version:'REPRESENTATIVE_SHORELINE_LEAF_REFINEMENT_v1',section:shorelineSection,anchor:{x,z},pocket:shorelineStyle(x,z),rootVerticesPreserved:true};
}
/** Photo 27734 morphology, applied after surveyed roots and original indices are fixed. */
function referenceCattailUpper(stem,head,roots,x,z,id){
  const rng=randomFor(`${id}:PHOTO_REFERENCE_FORM_27734`),bottom={...head[60]},oldTop=head[61];
  const normalize=v=>{const length=Math.hypot(v.x,v.y,v.z);return {x:v.x/length,y:v.y/length,z:v.z/length};};
  const axis=normalize({x:oldTop.x-bottom.x,y:oldTop.y-bottom.y,z:oldTop.z-bottom.z});
  const side=normalize({x:1-axis.x*axis.x,y:-axis.x*axis.y,z:-axis.x*axis.z});
  const across={x:side.y*axis.z-side.z*axis.y,y:side.z*axis.x-side.x*axis.z,z:side.x*axis.y-side.y*axis.x};
  const oldLength=Math.hypot(oldTop.x-bottom.x,oldTop.y-bottom.y,oldTop.z-bottom.z),length=Math.max(.28,Math.min(.46,oldLength*1.15)),aspect=6+rng(),radius=length/(2*aspect);
  const point=(t,radial,a)=>({x:Math.fround(bottom.x+axis.x*length*t+radial*(side.x*Math.cos(a)+across.x*Math.sin(a))),y:Math.fround(bottom.y+axis.y*length*t+radial*(side.y*Math.cos(a)+across.y*Math.sin(a))),z:Math.fround(bottom.z+axis.z*length*t+radial*(side.z*Math.cos(a)+across.z*Math.sin(a)))});
  const fractions=[.025,.075,.15,.85,.925,.975],radii=[.45,.85,1,1,.85,.45];
  for(let ring=0;ring<6;ring++)for(let column=0;column<10;column++)head[ring*10+column]=point(fractions[ring],radius*radii[ring],column*Math.PI/5);
  head[60]=point(0,0,0);head[61]=point(1,0,0);
  const spikeLength=.10+rng()*.06;
  // Reuse the final stem segment as a slender extension through and above the head.
  for(const [row,t,stemRadius] of [[4,.03,.010],[5,1+spikeLength/length,.0025]])for(let column=0;column<8;column++)stem[row*8+column]=point(t,stemRadius,column*Math.PI/4);
  let curvedDryLeafCount=0;
  for(let leaf=0;leaf<6;leaf++){
    const start=48+leaf*19,a=stem[start],b=stem[start+1],c=stem[start+2],oldTip=stem[start+18],root={x:b.x,y:b.y,z:b.z};
    const initialReach=Math.hypot(oldTip.x-root.x,oldTip.z-root.z),dx=(oldTip.x-root.x)/initialReach,dz=(oldTip.z-root.z)/initialReach;
    const rootHalfWidth=Math.hypot(c.x-a.x,c.y-a.y,c.z-a.z)/2,height=Math.max(.20,oldTip.y-root.y),reach=initialReach*(1.50+rng()*.25),curled=rng()<.28,twist=(rng()-.5)*.32;
    if(curled)curvedDryLeafCount++;
    const center=t=>{const travel=reach*(.32*t+.68*t*t),sweep=reach*twist*Math.sin(Math.PI*t),rise=height*(curled?2*t-1.25*t*t*t:1.42*t-.42*t*t*t);return {x:root.x+dx*travel-dz*sweep,y:root.y+rise,z:root.z+dz*travel+dx*sweep};};
    for(let row=1;row<6;row++){
      const t=row/6,mid=center(t),half=rootHalfWidth*(1+2.2*Math.sin(Math.PI*t))*Math.pow(1-t,.55),rotation=twist*t,wx=-dz*Math.cos(rotation)+dx*Math.sin(rotation),wz=dx*Math.cos(rotation)+dz*Math.sin(rotation);
      for(let column=-1;column<=1;column++)stem[start+row*3+column+1]={x:Math.fround(Math.max(O.minX+.002,Math.min(O.maxX-.002,mid.x+wx*half*column))),y:Math.fround(mid.y+(column===0?half*.22*Math.sin(Math.PI*t):0)),z:Math.fround(Math.max(O.minZ+.002,Math.min(O.maxZ-.002,mid.z+wz*half*column)))};
    }
    const tip=center(1);stem[start+18]={x:Math.fround(Math.max(O.minX+.002,Math.min(O.maxX-.002,tip.x))),y:Math.fround(tip.y),z:Math.fround(Math.max(O.minZ+.002,Math.min(O.maxZ-.002,tip.z)))};
  }
  return {reference:'27734.jpg',version:'FULL_OASIS_CATTAIL_REFERENCE_FORM_v1',headLengthMeters:length,headLengthToDiameter:aspect,spikeLengthMeters:spikeLength,leafCount:6,curvedDryLeafCount,rootVerticesPreserved:true,indexTopologyPreserved:true};
}
const mixRgb=(a,b,t)=>a.map((v,i)=>Math.max(0,Math.min(1,(v+(b[i]-v)*t)/255)));
function colorOasisPrimitive(primitive,kind,bankClearance=0){
  const verts=primitive.geometry.vertices,rng=randomFor(`${primitive.primitiveId}:NATURAL_COLOR_V2`),colors=[];
  const dryness=Math.max(0,Math.min(1,(bankClearance-.035)/.80));
  if(kind==='GRASS'){
    // Stable per-blade palettes: olive, yellow-green, cooler green, and sparse straw.
    const palettes=[[[65,78,33],[133,146,65]],[[116,111,45],[193,183,90]],[[39,75,42],[95,145,90]],[[110,79,40],[202,159,91]]];
    for(let base=0;base<verts.length;base+=16){
      const draw=rng(),strawShare=.18+.30*dryness,yellowShare=.25+.10*dryness,oliveShare=.18;
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
      const aged=rng()<.24+.16*dryness,shade=.88+rng()*.20,lo=aged?[105,90,44]:[29,67,47],hi=aged?[172,146,83]:[99,146,97];
      for(let i=0;i<19&&base+i<verts.length;i++)colors.push(mixRgb(lo,hi,i===18?1:Math.floor(i/3)/6).map(v=>v*shade));
    }
  }else{
    const shade=.88+rng()*.20;
    for(let i=0;i<verts.length;i++){
      const ring=Math.floor(i/10),side=i%10,mottle=.47+.18*Math.sin(side*2.1+ring*.7)+.12*(rng()-.5);
      colors.push(mixRgb([100,55,25],[165,98,41],mottle).map(c=>c*shade));
    }
  }
  const refinement=primitive.metadata.oasisFoliage.shorelineRefinement;
  if(refinement&&kind==='GRASS'){
    const prng=randomFor(`${primitive.primitiveId}:SHORELINE_POCKET_COLORS`),palette={GOLD:[[66,57,26],[211,177,91]],BROWN:[[58,39,23],[181,128,68]],OLIVE:[[37,52,25],[138,155,76]]};
    for(let start=0;start<colors.length;start+=16){
      const pocket=prng()<.78?refinement.pocket:['GOLD','BROWN','OLIVE'][Math.floor(prng()*3)],shade=.88+prng()*.22;
      for(let i=0;i<16;i++){const t=i===15?1:Math.floor(i/3)/5;colors[start+i]=mixRgb(palette[pocket][0],palette[pocket][1],Math.pow(t,.55)).map(c=>Math.min(1,c*shade));}
    }
  }
  if(colors.length!==verts.length)throw new Error('OASIS_VERTEX_COLOR_COUNT_MISMATCH');
  return freeze({...primitive,metadata:{...primitive.metadata,oasisFoliage:{...primitive.metadata.oasisFoliage,vertexColorsSrgb:colors,colorEncoding:'SRGB_NORMALIZED_RGB',bankClearanceMeters:bankClearance,dryBankPaletteBias:dryness,colorDesign:'MOIST_GREEN_DRY_YELLOW_AND_DEAD_BROWN_BLADES_GEN2532',heightLayers:kind==='GRASS'?['SHORT_UNDERSTORY','TALL_CURVED_BLADES']:null}}});
}
function replaceOasisTuft(primitive,index,woodland=null) {
  const bladeLimit=woodland?.bladeCount??O.bladesPerTuft,within=woodland?.inside??oasisInside;
  const sample=woodland?.sample??((x,z)=>sampleHEarthGrassTrialTerrain(index,x,z));
  const eligible=woodland?.eligible??((x,z)=>oasisEligible(index,x,z,false));
  const anchor=primitive.metadata.worldAnchor,random=randomFor(primitive.primitiveId);
  const vertices=[],indices=[],roots=[];let bladeCount=0;
  for(let attempt=0;attempt<bladeLimit*5&&bladeCount<bladeLimit;attempt++) {
    const angle=random()*Math.PI*2,radius=Math.sqrt(random())*.34;
    const x=Math.fround(anchor.x+Math.cos(angle)*radius),z=Math.fround(anchor.z+Math.sin(angle)*radius);
    const shortLayer=woodland?bladeCount%2===1:bladeCount%3!==0;
    const heading=angle+(random()-.5)*1.8,height=woodland?(shortLayer?.22+random()*.16:.65+random()*.30):(shortLayer?.10+random()*.18:.34+random()*.43),width=woodland?.045+random()*.030:(shortLayer?.008+random()*.012:.007+random()*.011);
    const bend=woodland?.18+random()*.20:(shortLayer?.09+random()*.20:.12+random()*.29),dx=Math.cos(heading),dz=Math.sin(heading),sx=-dz,sz=dx;
    const root=sample(x,z);
    if(!root||!eligible(x,z))continue;
    const blade=[],rootSamples=[];
    let valid=true;
    // Three columns form a shallow folded leaf. Five curved sections taper into one point.
    for(let section=0;section<5;section++) {
      const t=section/5,cx=x+dx*bend*t*t,cz=z+dz*bend*t*t;
      const half=width*.5*Math.pow(1-t,.8);
      for(let column=-1;column<=1;column++) {
        const vx=Math.fround(cx+sx*half*column),vz=Math.fround(cz+sz*half*column);
        if(!within(vx,vz)){valid=false;break;}
        let vy=root.y+height*(t-.13*t*t)+(column===0?width*.24*Math.sin(Math.PI*t):0);
        if(section===0){const supportSample=sample(vx,vz);if(!supportSample||!eligible(vx,vz)){valid=false;break;}vy=supportSample.y;rootSamples.push({...supportSample,bladeIndex:bladeCount,column});}
        blade.push({x:vx,y:Math.fround(vy),z:vz});
      }
      if(!valid)break;
    }
    const tip={x:Math.fround(x+dx*bend),y:Math.fround(root.y+height*.87),z:Math.fround(z+dz*bend)};
    if(!valid||!within(tip.x,tip.z))continue;
    const start=vertices.length;vertices.push(...blade,tip);
    for(let row=0;row<4;row++)for(let side=0;side<2;side++){
      const a=start+row*3+side,b=a+1,c=a+3,d=c+1;
      indices.push(a,b,c,b,d,c);
    }
    indices.push(start+12,start+13,start+15,start+13,start+14,start+15);
    roots.push(...rootSamples.map((sample,i)=>({...sample,vertexIndex:start+i})));bladeCount++;
  }
  if(bladeCount<(woodland?bladeLimit:32))throw new Error(`GRASS_TRIAL_INSUFFICIENT_ELIGIBLE_ROOTS:${primitive.primitiveId}`);
  // Frozen leaf correction: acceptance/random stream is complete before this transform.
  if(woodland){
    for(let start=0;start<vertices.length;start+=16){
      const root=vertices[start+1],tip=vertices[start+15],length=Math.hypot(tip.x-root.x,tip.z-root.z);
      const ux=(tip.x-root.x)/length,uz=(tip.z-root.z)/length;
      for(let row=1;row<5;row++){
        const center=vertices[start+row*3+1],scale=1+3*Math.sin(Math.PI*row/5);
        for(const column of [0,2]){
          const offset=start+row*3+column,v=vertices[offset],px=v.x-center.x,pz=v.z-center.z;
          const side=-px*uz+pz*ux;
          vertices[offset]={x:Math.fround(v.x-uz*side*(scale-1)),y:v.y,z:Math.fround(v.z+ux*side*(scale-1))};
        }
      }
    }
    if(vertices.some(v=>!within(v.x,v.z)))throw new Error(`WOODLAND_LEAF_DOMAIN_INVALID:${primitive.primitiveId}`);
  }
  const shorelineRefinement=woodland?{version:'OASIS_PALETTE_REUSE_WOODLAND_v1',pocket:woodland.pocket,rootVerticesPreserved:true}:refineGrassUpper(vertices,anchor,index,primitive.primitiveId);
  const result=constructHEarthTriangleMesh({
    primitiveId:primitive.primitiveId,geometryId:primitive.geometry.geometryId,
    primitiveType:SOUTH.primitiveType.TRIANGLE_MESH,vertices,indices,
    normalMode:SOUTH.normalMode.FACE_AND_VERTEX,expectedClosure:SOUTH.expectedClosure.OPEN_ALLOWED,
    semanticRole:primitive.semanticRole,materialHint:primitive.materialHint,
    metadata:{...primitive.metadata,oasisFoliage:{id:O.id,bladeCount,rootPoints:roots,...(shorelineRefinement?{shorelineRefinement}:{}),sourceGeometryId:primitive.geometry.geometryId,worldTruthMutated:false,attachment:'FINAL_CANONICAL_FLOAT32_TERRAIN_TRIANGLES'}},
    source:primitive.source??{sourceType:'BOUNDED_GRASS_PRESENTATION_TRIAL'}
  });
  if(!result.valid||!result.primitiveRecord)throw new Error(`GRASS_TRIAL_SOUTH_CONSTRUCTION_FAILED:${JSON.stringify(result.issues)}`);
  // Woodland uses the inherited dry-palette parameter; it is not a water measurement.
  const bankClearance=woodland?.6:sample(anchor.x,anchor.z).y-sampleHEarthGrassTrialTerrain(waterForIndex.get(index),anchor.x,anchor.z).y;
  const colored=colorOasisPrimitive(result.primitiveRecord,'GRASS',bankClearance);
  return woodland?.fan?compactWoodlandFan(colored,woodland):colored;
}

/** Compact accepted LEAF geometry and add perpendicular companions without random draws. */
function compactWoodlandFan(primitive,woodland){
  const selection=[0,1,2,6,7,8,15],topology=[0,1,3,1,4,3,1,2,4,2,5,4,3,4,6,4,5,6];
  const original=primitive.geometry.vertices,old=primitive.metadata.oasisFoliage,vertices=[],indices=[],roots=[],colors=[];
  for(let blade=0;blade<4;blade++){
    const sourceBlade=blade%2,start=sourceBlade*16,center=original[start+1],turn=blade<2?0:sourceBlade===0?1:-1,offset=vertices.length;
    for(let local=0;local<selection.length;local++){
      const source=original[start+selection[local]],dx=source.x-center.x,dz=source.z-center.z;
      let vertex=turn?{x:Math.fround(center.x-turn*dz),y:source.y,z:Math.fround(center.z+turn*dx)}:source;
      if(local<3){
        const support=turn?woodland.sample(vertex.x,vertex.z):old.rootPoints.find(p=>p.vertexIndex===start+local);
        if(!support||!woodland.eligible(vertex.x,vertex.z))throw new Error(`WOODLAND_FAN_ROOT_INVALID:${primitive.primitiveId}`);
        if(turn&&local!==1)vertex={...vertex,y:support.y};
        if(turn&&local===1&&support.y!==center.y)throw new Error(`WOODLAND_FAN_CENTER_SUPPORT_DRIFT:${primitive.primitiveId}`);
        roots.push({...support,x:vertex.x,y:vertex.y,z:vertex.z,bladeIndex:blade,column:local-1,vertexIndex:offset+local});
      }
      vertices.push(vertex);colors.push(old.vertexColorsSrgb[start+selection[local]]);
    }
    indices.push(...topology.map(i=>i+offset));
  }
  if(vertices.some(v=>!woodland.inside(v.x,v.z)))throw new Error(`WOODLAND_FAN_DOMAIN_INVALID:${primitive.primitiveId}`);
  const result=constructHEarthTriangleMesh({primitiveId:primitive.primitiveId,geometryId:primitive.geometry.geometryId,primitiveType:SOUTH.primitiveType.TRIANGLE_MESH,vertices,indices,normalMode:SOUTH.normalMode.FACE_AND_VERTEX,expectedClosure:SOUTH.expectedClosure.OPEN_ALLOWED,semanticRole:primitive.semanticRole,materialHint:primitive.materialHint,metadata:{...primitive.metadata,oasisFoliage:{...old,bladeCount:4,rootPoints:roots,vertexColorsSrgb:colors,fanRecipe:'COMPACT_LEAF_7_VERTICES_6_TRIANGLES_PERPENDICULAR_FAN_v1'}},source:primitive.source});
  if(!result.valid||!result.primitiveRecord)throw new Error(`WOODLAND_FAN_SOUTH_INVALID:${JSON.stringify(result.issues)}`);
  return freeze(result.primitiveRecord);
}

/** Reuse the accepted oasis folded blade and palette, with explicit woodland
 * habitat/ground callbacks. Default oasis construction is unchanged. */
export function buildHEarthWoodlandGrassTuft({id,x,z,bladeCount=8,pocket='OLIVE',sample,eligible,inside}) {
  if(![2,4,6,7,8,18].includes(bladeCount)||!['GOLD','BROWN','OLIVE'].includes(pocket)||![sample,eligible,inside].every(f=>typeof f==='function'))throw new Error('WOODLAND_GRASS_INPUT_INVALID');
  const root=sample(x,z);if(!root)throw new Error('WOODLAND_GRASS_ROOT_MISSING');
  const source={primitiveId:id,geometry:{geometryId:`${id}:GEOMETRY`},semanticRole:'BOUNDED_WOODLAND_GRASS_PRESENTATION',materialHint:{materialIntent:'COASTAL_GRASS_GREEN',archetypeId:'OASIS_ACCEPTED_BLADE_GRASS'},metadata:{worldAnchor:{x,y:root.y,z},woodlandGrass:{sourceRecipe:O.id,populationTruthMutated:false}},source:{sourceType:'EXISTING_OASIS_BLADE_REUSE'}};
  return replaceOasisTuft(source,null,{bladeCount:bladeCount===4?2:bladeCount,fan:bladeCount===4,pocket,sample,eligible,inside});
}

function oasisMesh(id,vertices,indices,roots,intent,kind,bankClearance=0,shorelineRefinement=null,cattailReferenceForm=null){
  const r=constructHEarthTriangleMesh({primitiveId:id,geometryId:`${id}:GEOMETRY`,primitiveType:SOUTH.primitiveType.TRIANGLE_MESH,vertices,indices,normalMode:SOUTH.normalMode.FACE_AND_VERTEX,expectedClosure:SOUTH.expectedClosure.OPEN_ALLOWED,semanticRole:'BOUNDED_WET_EDGE_PRESENTATION',materialHint:{materialIntent:intent,archetypeId:'OASIS_CATTAIL'},metadata:{oasisFoliage:{id:O.id,kind,rootPoints:roots,...(shorelineRefinement?{shorelineRefinement}:{}),...(cattailReferenceForm?{cattailReferenceForm}:{}),worldTruthMutated:false,attachment:'FINAL_CANONICAL_FLOAT32_TERRAIN_TRIANGLES'}},source:{sourceType:'OWNER_REQUESTED_BOUNDED_FOLIAGE_PRESENTATION'}});
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
  const shorelineRefinement=refineCattailUpper(verts,headV,roots,x,z,id);
  const cattailReferenceForm=referenceCattailUpper(verts,headV,roots,x,z,id);
  return [oasisMesh(`${id}:STEM_LEAVES`,verts,inds,roots,'SHRUB_GREEN_CATTAIL','CATTAIL_STEM_AND_LEAVES',root.y-sampleHEarthGrassTrialTerrain(waterForIndex.get(index),x,z).y,shorelineRefinement,cattailReferenceForm),oasisMesh(`${id}:SEEDHEAD`,headV,headI,[],'WOODY_BROWN_CATTAIL_SEEDHEAD','ROUNDED_CATTAIL_SEEDHEAD',0,shorelineRefinement,cattailReferenceForm)];
}
function* constructOasisFoliageSteps(renderPackage,onPrimitive=()=>{}){
  if(oasisCache.has(renderPackage))return oasisCache.get(renderPackage);
  yield {phase:'PREPARING_BASIN',grassTuftCount:0,cattailCount:0,primitiveCount:0};
  const index=buildHEarthGrassTrialTerrainIndex(renderPackage,O),water=buildHEarthGrassTrialTerrainIndex(renderPackage,O,true);waterForIndex.set(index,water);
  const basin=connectBasin(index,water);basinForIndex.set(index,basin);basinCache.set(renderPackage,basin.receipt);
  const primitives=[],rng=randomFor(O.id);let grassTuftCount=0,cattailCount=0;
  const candidates=[],wetCandidates=[];
  const progress=phase=>({phase,grassTuftCount,cattailCount,primitiveCount:primitives.length});
  yield progress('BASIN_READY');
  // Survey-guided connected banks, with seeded spatial gaps and no row-first allocation.
  for(let z=O.minZ+.8,row=0;z<O.maxZ-.8;z+=.70,row++)for(let x=O.minX+.8;x<O.maxX-.8;x+=.70){
    const px=x+(rng()-.5)*.30+(row%2)*.16,pz=z+(rng()-.5)*.30;
    const gap=.5+.5*Math.sin(px*1.29+pz*.63)*Math.cos(px*.42-pz*.91);
    if(gap<.12)continue;
    candidates.push({x:px,z:pz,priority:rng()});
  }
  candidates.sort((a,b)=>a.priority-b.priority);
  let grassAttempts=0;
  yield progress('GRASS_CANDIDATES_READY');
  for(const {x,z} of candidates){
    if(++grassAttempts%32===0)yield progress('GRASS_SCAN');
    if(grassTuftCount>=360)break;
    if(!oasisEligible(index,x,z,false)||!oasisInside(x-.65,z-.65)||!oasisInside(x+.65,z+.65))continue;
    const id=`${O.id}:GRASS:${grassTuftCount}`,source={primitiveId:id,geometry:{geometryId:`${id}:GEOMETRY`},semanticRole:'BOUNDED_WET_EDGE_PRESENTATION',materialHint:{materialIntent:'COASTAL_GRASS_GREEN',archetypeId:'OASIS_ACCEPTED_BLADE_GRASS'},metadata:{worldAnchor:{x,y:sampleHEarthGrassTrialTerrain(index,x,z).y,z}},source:{sourceType:'OWNER_REQUESTED_BOUNDED_FOLIAGE_PRESENTATION'}};
    try{const primitive=replaceOasisTuft(source,index);primitives.push(primitive);onPrimitive(primitive);grassTuftCount++;yield progress('GRASS');}catch(error){if(!String(error.message).startsWith('GRASS_TRIAL_INSUFFICIENT_ELIGIBLE_ROOTS:'))throw error;}
  }
  for(let z=O.minZ+.8;z<O.maxZ-.8;z+=.92)for(let x=O.minX+.8;x<O.maxX-.8;x+=.92){
    const px=x+(rng()-.5)*.40,pz=z+(rng()-.5)*.40;
    if(.5+.5*Math.sin(px*.81+pz*.44)*Math.cos(px*.33-pz*.71)<.20)continue;
    wetCandidates.push({x:px,z:pz,priority:rng()});
  }
  wetCandidates.sort((a,b)=>a.priority-b.priority);
  let cattailAttempts=0;
  yield progress('CATTAIL_CANDIDATES_READY');
  for(const {x,z} of wetCandidates){
    if(++cattailAttempts%32===0)yield progress('CATTAIL_SCAN');
    if(cattailCount>=72)break;
    if(!oasisEligible(index,x,z,true))continue;const p=cattail(index,x,z,cattailCount);if(!p)continue;primitives.push(...p);p.forEach(onPrimitive);cattailCount++;yield progress('CATTAIL');
  }
  if(grassTuftCount<100||cattailCount<24)throw new Error(`OASIS_ELIGIBLE_SAMPLE_INCOMPLETE:${grassTuftCount}:${cattailCount}`);
  const triangleCount=primitives.reduce((n,p)=>n+p.geometry.indices.length/3,0);if(triangleCount>O.maximumTriangles)throw new Error('OASIS_TRIANGLE_BUDGET_EXCEEDED');
  const out=freeze({id:O.id,primitives,grassTuftCount,cattailCount,triangleCount,basinAssociation:basin.receipt,waterPrimitive:O.waterPrimitive,worldPlacementCountChanged:false});oasisCache.set(renderPackage,out);return out;
}

/** Synchronous compatibility path consumes exactly the same deterministic construction steps. */
export function buildHEarthOasisFoliagePresentation(renderPackage){
  if(oasisCache.has(renderPackage))return oasisCache.get(renderPackage);
  const steps=constructOasisFoliageSteps(renderPackage);let result;
  do{result=steps.next();}while(!result.done);
  return result.value;
}
const oasisPreparationInFlight=new WeakMap();
/** Prepare without monopolizing the browser event loop; no partial presentation is published. */
export async function prepareHEarthOasisFoliagePresentation(renderPackage,{yieldControl=()=>new Promise(resolve=>setTimeout(resolve,0)),onProgress=()=>{}}={}){
  if(oasisCache.has(renderPackage))return oasisCache.get(renderPackage);
  if(oasisPreparationInFlight.has(renderPackage))return oasisPreparationInFlight.get(renderPackage);
  if(typeof yieldControl!=='function'||typeof onProgress!=='function')throw new TypeError('OASIS_PREPARATION_CALLBACK_INVALID');
  const preparation=typeof window!=='undefined'&&typeof Worker==='function'
    ? prepareOasisInWorker(renderPackage,onProgress)
    : (async()=>{
    const steps=constructOasisFoliageSteps(renderPackage);
    const diagnostics=globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS;
    for(;;){
      const stepStart=diagnostics?.performanceEnabled?performance.now():0;
      let step;try{step=steps.next();}finally{if(diagnostics?.performanceEnabled)diagnostics.recordCost('OASIS_STEP',performance.now()-stepStart);}
      if(step.done){onProgress({phase:'COMPLETE',grassTuftCount:step.value.grassTuftCount,cattailCount:step.value.cattailCount,primitiveCount:step.value.primitives.length});return step.value;}
      onProgress(step.value);
      const yieldStart=diagnostics?.performanceEnabled?performance.now():0;
      try{await yieldControl();}finally{if(diagnostics?.performanceEnabled)diagnostics.recordCost('OASIS_YIELD_WAIT',performance.now()-yieldStart);}
    }
  })();
  oasisPreparationInFlight.set(renderPackage,preparation);
  try{return await preparation;}finally{oasisPreparationInFlight.delete(renderPackage);}
}

/** One presentation mask from the existing oasis grass roots; never a terrain or placement authority. */
export function buildHEarthOasisGrassSoilCoverage(primitives){
  const cellSizeMeters=.5,width=104,height=146,size=width*height,bounds=Object.freeze({minX:O.minX,maxX:O.maxX,minZ:O.minZ,maxZ:O.maxZ});
  const occupied=new Uint8Array(size);let grassTuftCount=0,grassRootCount=0;
  for(const primitive of primitives??[]){
    if(!primitive.primitiveId?.startsWith(`${O.id}:GRASS:`)||!primitive.metadata?.oasisFoliage)continue;
    grassTuftCount++;
    for(const root of primitive.metadata.oasisFoliage.rootPoints){
      const x=Math.floor((root.x-O.minX)/cellSizeMeters),z=Math.floor((root.z-O.minZ)/cellSizeMeters);
      if(x>=0&&x<width&&z>=0&&z<height){occupied[z*width+x]=1;grassRootCount++;}
    }
  }
  let occupiedCellCount=0;const expanded=new Float32Array(size);
  for(let z=0;z<height;z++)for(let x=0;x<width;x++)if(occupied[z*width+x]){
    occupiedCellCount++;
    for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)if(dx*dx+dz*dz<=4&&x+dx>=0&&x+dx<width&&z+dz>=0&&z+dz<height)expanded[(z+dz)*width+x+dx]=1;
  }
  const blur=input=>{const horizontal=new Float32Array(size),output=new Float32Array(size);
    for(let z=0;z<height;z++)for(let x=0;x<width;x++){let sum=0;for(let d=-2;d<=2;d++)if(x+d>=0&&x+d<width)sum+=input[z*width+x+d];horizontal[z*width+x]=sum/5;}
    for(let z=0;z<height;z++)for(let x=0;x<width;x++){let sum=0;for(let d=-2;d<=2;d++)if(z+d>=0&&z+d<height)sum+=horizontal[(z+d)*width+x];output[z*width+x]=sum/5;}
    return output;
  };
  const blurred=blur(blur(expanded)),pixels=new Uint8Array(size),smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};let nonzeroTexelCount=0;
  for(let z=0;z<height;z++)for(let x=0;x<width;x++){
    const edge=Math.min(x,width-1-x,z,height-1-z)*cellSizeMeters,value=smooth(.025,.70,blurred[z*width+x])*smooth(0,1.5,edge);
    pixels[z*width+x]=Math.round(value*255);if(pixels[z*width+x])nonzeroTexelCount++;
  }
  return Object.freeze({width,height,bounds,cellSizeMeters,pixels,grassTuftCount,grassRootCount,occupiedCellCount,nonzeroTexelCount});
}


// Stream completed primitives separately: cloning/freezing the whole oasis in one
// browser task would reintroduce the loading stall that worker execution avoids.
function prepareOasisInWorker(renderPackage,onProgress){
  return new Promise((resolve,reject)=>{
    const url=new URL(import.meta.url);url.searchParams.set('hearthOasisWorker','1');
    const worker=new Worker(url,{type:'module'}),primitives=[];
    let settled=false,sequence=0;
    const fail=error=>{if(settled)return;settled=true;worker.terminate();reject(error);};
    worker.onerror=event=>fail(new Error(event.message||'OASIS_WORKER_FAILED'));
    worker.onmessageerror=()=>fail(new Error('OASIS_WORKER_MESSAGE_INVALID'));
    worker.onmessage=event=>{
      if(settled)return;
      try{
        const message=event.data;
        if(message?.sequence!==sequence++)throw new Error('OASIS_WORKER_SEQUENCE_INVALID');
        if(message.type==='OASIS_WORKER_FAILED')throw new Error(message.error?.message||'OASIS_WORKER_FAILED');
        if(message.type==='OASIS_WORKER_PROGRESS'){
          globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.recordCost?.('WORKER_OASIS_STEP',message.durationMs);
          for(const primitive of message.primitives??[]){
            if(!primitive?.metadata?.oasisFoliage||!primitive.geometry?.vertices?.length)throw new Error('OASIS_WORKER_PRIMITIVE_INVALID');
            primitives.push(freeze(primitive));
          }
          if(message.progress?.primitiveCount!==primitives.length)throw new Error('OASIS_WORKER_PROGRESS_INVALID');
          onProgress(message.progress);return;
        }
        if(message.type!=='OASIS_WORKER_COMPLETE'||message.primitiveCount!==primitives.length)throw new Error('OASIS_WORKER_RESULT_INVALID');
        const summary=message.summary;
        const out=freeze({id:summary.id,primitives,grassTuftCount:summary.grassTuftCount,cattailCount:summary.cattailCount,triangleCount:summary.triangleCount,basinAssociation:summary.basinAssociation,waterPrimitive:summary.waterPrimitive,worldPlacementCountChanged:summary.worldPlacementCountChanged});
        if(out.id!==O.id||out.grassTuftCount+2*out.cattailCount!==primitives.length)throw new Error('OASIS_WORKER_IDENTITY_INVALID');
        oasisCache.set(renderPackage,out);basinCache.set(renderPackage,out.basinAssociation);
        onProgress({phase:'COMPLETE',grassTuftCount:out.grassTuftCount,cattailCount:out.cattailCount,primitiveCount:primitives.length});
        settled=true;worker.terminate();resolve(out);
      }catch(error){fail(error);}
    };
    // Copy only the immutable terrain inputs used by the unchanged constructor.
    // Never transfer/detach the renderer's live buffers.
    try{worker.postMessage({type:'OASIS_WORKER_PREPARE',renderPackage:{packageIdentity:renderPackage.packageIdentity,buffers:{positions:renderPackage.buffers.positions,indices:renderPackage.buffers.indices},primitiveSpans:renderPackage.primitiveSpans}});}catch(error){fail(error);}
  });
}
if(typeof DedicatedWorkerGlobalScope!=='undefined'&&globalThis instanceof DedicatedWorkerGlobalScope&&new URL(import.meta.url).searchParams.get('hearthOasisWorker')==='1'){
  globalThis.addEventListener('message',async event=>{
    if(event.data?.type!=='OASIS_WORKER_PREPARE')return;
    let sequence=0,pending=[];
    try{
      const steps=constructOasisFoliageSteps(event.data.renderPackage,primitive=>pending.push(primitive));
      for(;;){
        const startedAt=performance.now(),step=steps.next(),durationMs=performance.now()-startedAt;
        if(step.done){const {primitives,...summary}=step.value;globalThis.postMessage({type:'OASIS_WORKER_COMPLETE',sequence:sequence++,primitiveCount:primitives.length,summary});break;}
        globalThis.postMessage({type:'OASIS_WORKER_PROGRESS',sequence:sequence++,progress:step.value,primitives:pending,durationMs});pending=[];
        // Backpressure through the event loop keeps output delivery incremental.
        await new Promise(resolve=>setTimeout(resolve,0));
      }
    }catch(error){globalThis.postMessage({type:'OASIS_WORKER_FAILED',sequence:sequence++,error:{name:error?.name,message:error?.message}});}
  },{once:true});
}
