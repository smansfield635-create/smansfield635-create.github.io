/** Gen2794: immutable paired-wedge identities become submerged mountain-foot rockfall.
 * The 14 accepted type-3 small clearing rocks are not modified.
 */
import {inverseHEarthGroundCoverPoint} from './landscape-groundcover.global-v1.js?cb=gen2671-visible-three-strata-20261012&rev=gen2694-legacy-fan-recovery-v1';
import {sampleHEarthRun8CSuccessorSurfaceMaterial as materialAt} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis,buildHEarthOasisConnectedBasinIndex,buildHEarthGrassTrialTerrainIndex,sampleHEarthGrassTrialTerrain} from './grass-lowland-trial.js';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate,sampleHEarthGen311PlacementStructureDisposition as structureAt} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';
const f=Math.fround,pi=Math.PI,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const noise=(i,j,k=0)=>{let v=Math.imul(i+17,1597334677)^Math.imul(j+101,3812015801)^Math.imul(k+59,747796405);v=Math.imul(v^(v>>>16),2246822519);v=Math.imul(v^(v>>>13),3266489917);return((v^(v>>>16))>>>0)/4294967296;};
export const LARGE_P2_BOULDER_PRESENTATION=Object.freeze({originalRocks:14,originalTriangles:336,protectedSmallRocks:14,protectedSmallTriangles:224,rings:5,sides:12,vertices:868,triangles:1680,maximumGpuBytes:92000});
export function identifyLargeP2RockSource(raw){
 const idx=raw.buffers.indices,pos=raw.buffers.positions,tags=raw.clearingAttributes;
 const span=raw.primitiveSpans.find(t=>t.primitiveId==='H_EARTH_LANDSCAPE_P2_ROCK');
 if(!span||!tags||tags.length!==pos.length)throw Error('LARGE_P2_SOURCE_TAGS_MISSING');
 const large=[],small=[],adj=new Map();
 for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){
   const ids=[idx[j],idx[j+1],idx[j+2]],type=ids.map(i=>tags[i*3+2]);
   if(!type.every(t=>t===type[0]))throw Error('LARGE_P2_MIXED_SOURCE_TYPE');
   if(type[0]===3){small.push(j);continue;}
   if(type[0]!==0)throw Error('LARGE_P2_UNKNOWN_SOURCE_TYPE');
   large.push({j,ids});
   for(const i of ids){if(!adj.has(i))adj.set(i,new Set());for(const n of ids)adj.get(i).add(n);}
 }
 if(large.length!==336||small.length!==224)throw Error('LARGE_P2_SOURCE_336_224_CENSUS_FAILED');
 const seen=new Set(),components=[];
 for(const first of adj.keys()){
   if(seen.has(first))continue;seen.add(first);const stack=[first],ids=[];
   while(stack.length){const id=stack.pop();ids.push(id);for(const n of adj.get(id))if(!seen.has(n)){seen.add(n);stack.push(n);}}
   ids.sort((a,b)=>a-b);components.push({ids,first:ids[0],triangles:0,offsets:[]});
 }
 components.sort((a,b)=>a.first-b.first);
 const owner=new Map();components.forEach((g,i)=>g.ids.forEach(v=>owner.set(v,i)));
 for(const t of large){const group=owner.get(t.ids[0]);if(!t.ids.every(v=>owner.get(v)===group))throw Error('LARGE_P2_COMPONENT_BOUNDARY');components[group].triangles++;components[group].offsets.push(t.j);}
 if(components.length!==28||components.some(c=>c.ids.length!==8||c.triangles!==12))throw Error('LARGE_P2_EXPECTED_28_WEDGES');
 const rocks=[];
 for(let i=0;i<14;i++){
   const a=components[2*i],b=components[2*i+1];if(b.first!==a.first+8)throw Error('LARGE_P2_PAIRED_WEDGES_NOT_ADJACENT');
   const verts=a.ids.concat(b.ids),x=f(verts.reduce((s,id)=>s+pos[id*3],0)/16),z=f(verts.reduce((s,id)=>s+pos[id*3+2],0)/16);
   rocks.push({originalRockId:'P2_ROCK_'+String(i).padStart(2,'0'),sourceVertexIndices:verts,
     sourceTriangleOffsets:a.offsets.concat(b.offsets),sourceCenter:{x,z},
     radius:clamp(Math.max(...verts.map(id=>Math.hypot(pos[id*3]-x,pos[id*3+2]-z)))*.77,1.65,3.0)});
 }
 return{rocks,largeOffsets:large.map(t=>t.j),smallOffsets:small,sourceIndices:idx,sourceUnchanged:true};
}
function terrainField(raw){
 const p=raw.buffers.positions,idx=raw.buffers.indices,bins=new Map(),size=16;
 for(const span of raw.primitiveSpans.filter(t=>t.role==='TERRAIN'))for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){
   const v=[0,1,2].map(k=>{const n=idx[j+k]*3;return[p[n],p[n+1],p[n+2]];});
   const minX=Math.min(...v.map(q=>q[0])),maxX=Math.max(...v.map(q=>q[0])),minZ=Math.min(...v.map(q=>q[2])),maxZ=Math.max(...v.map(q=>q[2]));
   if(maxX<oasis.minX-12||minX>oasis.maxX+12||maxZ<oasis.minZ-12||minZ>oasis.maxZ+12)continue;
   const [a,b,c]=v,d=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);
   if(Math.abs(d)<1e-10)continue;
   const slope=Math.hypot(((b[1]-a[1])*(c[2]-a[2])-(c[1]-a[1])*(b[2]-a[2]))/((b[0]-a[0])*(c[2]-a[2])-(c[0]-a[0])*(b[2]-a[2])),((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]))/((b[0]-a[0])*(c[2]-a[2])-(c[0]-a[0])*(b[2]-a[2])));
   const t={v,d,slope,id:j/3};
   for(let ix=Math.floor(minX/size);ix<=Math.floor(maxX/size);ix++)for(let iz=Math.floor(minZ/size);iz<=Math.floor(maxZ/size);iz++){
     const key=ix+':'+iz;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(t);
   }
 }
 return(x,z)=>{
   for(const t of bins.get(Math.floor(x/size)+':'+Math.floor(z/size))??[]){
     const [a,b,c]=t.v,d=t.d,u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/d,
       v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/d,w=1-u-v;
     if(Math.min(u,v,w)>=-1e-8)return{y:f(u*a[1]+v*b[1]+w*c[1]),triangleId:t.id,slope:t.slope};
   }
   return null;
 };
}
/** Survey the existing connected water and its independently measured uphill source. */
function bankSurvey(raw,sample){
 const basin=buildHEarthOasisConnectedBasinIndex(raw),bounds={minX:oasis.minX-12,maxX:oasis.maxX+12,minZ:oasis.minZ-12,maxZ:oasis.maxZ+12},
   water=buildHEarthGrassTrialTerrainIndex(raw,bounds,true),wet=new Set(basin.wetCells.map(p=>p.x+':'+p.z));
 const edge=basin.wetCells.filter(p=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!wet.has((p.x+dx)+':'+(p.z+dz))));
 if(!edge.length)throw Error('LARGE_P2_CONNECTED_BANK_PERIMETER_MISSING');
 const nearest=(x,z)=>edge.reduce((best,p)=>{const distance=Math.hypot(x-p.x,z-p.z);return distance<best.distance?{x:p.x,z:p.z,distance}:best;},{distance:Infinity});
 const submerged=(x,z)=>{const t=sample(x,z),w=sampleHEarthGrassTrialTerrain(water,x,z);return t&&w&&t.y<w.y-.05?{terrainY:t.y,waterY:w.y,triangleId:t.triangleId,depth:w.y-t.y}:null;};
 const candidates=[];
 for(let z=bounds.minZ;z<=-172;z+=.5)for(let x=bounds.minX;x<=bounds.maxX;x+=.5){
   const bed=submerged(x,z);if(!bed||bed.depth>6)continue;
   const shoreline=nearest(x,z);if(shoreline.distance>12)continue;
   let uphill=null;
   for(let k=0;k<16;k++){const a=k*pi/8,px=x+12*Math.cos(a),pz=z+12*Math.sin(a),t=sample(px,pz);
     if(t&&(!uphill||t.y>uphill.terrainY))uphill={x:px,z:pz,terrainY:t.y,triangleId:t.triangleId};}
   if(!uphill||uphill.z>=z-4||uphill.terrainY-bed.terrainY<3)continue;
   candidates.push({x,z,shoreline,bed,uphill});
 }
 return{basin,edge,nearest,submerged,bounds,candidates};
}
function footDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,q=dx*dx+dz*dz,t=q?clamp(((x-a.x)*dx+(z-a.z)*dz)/q,0,1):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
function site(raw,sample,bank,candidate,r,selected){
 const {x,z,shoreline,uphill}=candidate;
 const ground=sample(x,z);if(!ground||ground.slope>3)return null;
 const authored=inverseHEarthGroundCoverPoint(x,ground.y,z),m=materialAt(authored.x,authored.z);
 if(m?.valid!==true)return null;
 const context=Math.max(m.foothillTransition??0,m.drainageRetention??0,m.rockExposure??0);
 if(shoreline.distance>r+8||!bank.submerged(x,z))return null;
 const structure=structureAt(authored.x,authored.z);if(structure.hardExclusions.length||structure.planningHolds.length)return null;
 for(const box of [estate.manorCore,estate.gardens,estate.outbuildingProposal,estate.acceptedEnvelope])if(Math.hypot(authored.x-clamp(authored.x,box.minX,box.maxX),authored.z-clamp(authored.z,box.minZ,box.maxZ))<r+1)return null;
 if(estate.footRoute.slice(1).some((b,i)=>footDistance(authored.x,authored.z,estate.footRoute[i],b)<estate.footRouteRadius+r+1))return null;
 if((raw.landscapeCoverFootprints??[]).some(o=>Math.hypot(x-o.x,z-o.z)<o.radius+r+.6))return null;
 if((raw.landscapeFloorFootprints??[]).some(o=>Math.hypot(x-o.x,z-o.z)<o.trunkRadius+r+1))return null;
 if(selected.some(o=>Math.hypot(x-o.x,z-o.z)<o.radius+r+.35))return null;
 // Independently sampled underwater bed around the buried lower ring.
 const perimeter=[];for(let k=0;k<12;k++){const a=k*pi/6,px=x+r*1.08*Math.cos(a),pz=z+r*1.08*Math.sin(a),wet=bank.submerged(px,pz);if(!wet)return null;perimeter.push({x:px,z:pz,...wet});}
 return{x:f(x),z:f(z),ground,authored,m,context,shoreline,perimeter,uphill,bed:candidate.bed};
}
export function buildLargeP2BoulderPresentation(raw){
 const source=identifyLargeP2RockSource(raw),ground=terrainField(raw),bank=bankSurvey(raw,ground),positions=[],colors=[],indices=[],sourceVertexIndices=[],records=[],selected=[];
 const vertex=(x,y,z,col,sourceId)=>{const v=positions.length/3;positions.push(f(x),f(y),f(z));colors.push(...col.map(f),1);sourceVertexIndices.push(sourceId);return v;};
 for(const id of source.rocks.map((_,i)=>i).sort((a,b)=>source.rocks[b].radius-source.rocks[a].radius||a-b)){
   const original=source.rocks[id],radius=original.radius*.82;let best=null,score=-Infinity;
   // Deterministic connected-water grid: eligibility follows actual submerged
   // terrain and mountain ascent, never distance to the moving camera.
   for(const candidate of bank.candidates){
     const trial=site(raw,ground,bank,candidate,radius,selected);if(!trial)continue;
     // Mountain-foot pockets derive from measured uphill relief, with hashed
     // variation and breathing room rather than a continuous perimeter ring.
     const relief=trial.uphill.terrainY-trial.ground.y;
     const value=relief*.12-trial.bed.depth*.2-trial.shoreline.distance*.08+noise(trial.x,trial.z,id)*.65;
     if(value>score){score=value;best=trial;}
   }
   if(!best)throw Error('LARGE_P2_NO_ELIGIBLE_GROUNDED_BOULDER:'+id+':'+selected.length+':'+bank.candidates.length);
   const {x,z,m}=best,baseY=best.ground.y,h=Math.max(1.5+1.7*noise(id,29),best.bed.depth+.65+.8*noise(id,28)),direction=2*pi*noise(id,31),
     rx=radius*(.85+.2*noise(id,32)),rz=radius*(.73+.24*noise(id,33));
   const sourceId=original.sourceVertexIndices[0],start=positions.length/3,indexStart=indices.length,contacts=[],rings=[];
   const baseColor=[0,1,2].map(ch=>original.sourceVertexIndices.reduce((sum,i)=>sum+raw.buffers.baseColorsLinear[i*4+ch],0)/16);
   const stoneTint=[.20,.195,.175].map((v,ch)=>v*(.88+.24*noise(id,87,ch)));
   const color=(layer,k)=>baseColor.map((v,ch)=>clamp((v*.48+stoneTint[ch]*.52)*(.80+layer*.055)*(.94+.12*noise(id,k,layer)),.012,.75));
   for(let layer=0;layer<5;layer++){
     const ring=[];
     for(let k=0;k<12;k++){
       const a=k*pi/6+.055*Math.sin(k*2.7+id),phi=a+direction;
       const irregular=1+.105*Math.sin(3*a+id*1.1)+.055*Math.cos(5*a-id);
       const scale=[.72,.96,.88,.63,.28][layer]*(.96+.04*noise(id,k+layer*17));
       const px=f(x+rx*Math.cos(phi)*scale*irregular),pz=f(z+rz*Math.sin(phi)*scale*irregular);
       const contact=ground(px,pz);if(!contact)throw Error('LARGE_P2_UNGROUNDED_RING:'+id+':'+layer+':'+k);
       if(layer<2&&!bank.submerged(px,pz))throw Error('LARGE_P2_BASE_NOT_SUBMERGED:'+id+':'+layer+':'+k);
       const y=f(layer<2?contact.y-(layer===0?.18:.023):baseY+h*([0,0,.36,.70,.94][layer]+.06*(noise(id,k+layer*37)-.5)));
       ring.push(vertex(px,y,pz,color(layer,k),sourceId));
       if(layer<2)contacts.push({x:px,z:pz,terrainY:contact.y,meshY:y,burial:f(contact.y-y),triangleId:contact.triangleId,layer});
     }
     rings.push(ring);
   }
   for(let layer=0;layer<4;layer++)for(let k=0;k<12;k++){const n=(k+1)%12,a=rings[layer][k],b=rings[layer][n],c=rings[layer+1][k],d=rings[layer+1][n];indices.push(a,c,b,b,c,d);}
   const low=vertex(x,baseY-.22,z,color(0,51),sourceId),top=vertex(x,baseY+h*.99,z,color(4,52),sourceId);
   for(let k=0;k<12;k++){const n=(k+1)%12;indices.push(low,rings[0][k],rings[0][n],top,rings[4][n],rings[4][k]);}
   selected.push({x,z,radius});
   records.push({originalRockId:original.originalRockId,originalForm:'PAIRED_FRACTURE_WEDGES',
     newForm:'MOUNTAIN_DERIVED_SUBMERGED_ROCKFALL',sourceTriangleOffsets:original.sourceTriangleOffsets,
     sourceVertexIndices:original.sourceVertexIndices,sourceCenter:original.sourceCenter,
     presentationCenter:{x,y:baseY,z},authoredCenter:best.authored,terrainContactWitnesses:contacts,
     bankWitness:{waterPrimitive:bank.basin.waterPrimitive,connectedSeed:bank.basin.seed,nearestWetCell:best.shoreline,centerSubmerged:bank.submerged(x,z),submergedPerimeter:best.perimeter,uphillSource:best.uphill},
     radius,height:h,vertexStart:start,vertexCount:positions.length/3-start,indexStart,indexCount:indices.length-indexStart,
     context:{surfaceClass:m.surfaceClass,landformClass:m.landformClass,rockExposure:m.rockExposure,drainageRetention:m.drainageRetention,foothillTransition:m.foothillTransition}});
 }
 const normals=new Float32Array(positions.length);
 for(let j=0;j<indices.length;j+=3){
   const a=indices[j]*3,b=indices[j+1]*3,c=indices[j+2]*3,
     ux=positions[b]-positions[a],uy=positions[b+1]-positions[a+1],uz=positions[b+2]-positions[a+2],
     vx=positions[c]-positions[a],vy=positions[c+1]-positions[a+1],vz=positions[c+2]-positions[a+2],n=[uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx];
   for(const k of [a,b,c])for(let v=0;v<3;v++)normals[k+v]+=n[v];
 }
 for(let j=0;j<normals.length;j+=3){const l=Math.hypot(normals[j],normals[j+1],normals[j+2]);if(l<1e-10)throw Error('LARGE_P2_NONMANIFOLD_SURFACE');for(let k=0;k<3;k++)normals[j+k]/=l;}
 if(positions.length/3!==868||indices.length/3!==1680)throw Error('LARGE_P2_REPLACEMENT_GEOMETRY_CENSUS');
 return{positions:Float32Array.from(positions),normals,baseColorsLinear:Float32Array.from(colors),
   indices:Uint32Array.from(indices),sourceVertexIndices:Uint32Array.from(sourceVertexIndices),
   suppressedTriangleOffsets:source.largeOffsets,protectedSmallTriangleOffsets:source.smallOffsets,
   records,receipt:{schema:'H_EARTH_GEN2794_MOUNTAIN_FOOT_SUBMERGED_BOULDERS_v1',rockCount:14,
     placement:'CONNECTED_WATER_MOUNTAIN_BACKED_SUBMERGED_ROCKFALL',connectedWetCells:bank.basin.wetCellCount,oldOpenGroundClustersSuppressed:true,waterGeometryChanged:false,
     suppressedTriangles:336,protectedSmallTriangles:224,vertices:868,triangles:1680,
     originalWorldChanged:false,sourceRecipeChanged:false,terrainChanged:false,meadowChanged:false,
     ownerVisualAcceptance:false,releaseAuthorized:false}};
}
export function suppressLargeP2SourceRockTriangles(indices,large){
 const out=Uint32Array.from(indices);
 for(const i of large.suppressedTriangleOffsets){if(out[i]!==indices[i]||out[i+1]!==indices[i+1]||out[i+2]!==indices[i+2])throw Error('LARGE_P2_SOURCE_INDEX_CHANGED');out[i+1]=out[i];out[i+2]=out[i];}
 return out;
}
