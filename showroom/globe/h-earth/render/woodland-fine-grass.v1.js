/** Presentation-only woodland grass. Canonical world and records stay immutable. */
import {inverseHEarthGroundCoverPoint} from './landscape-groundcover.global-v1.js?cb=gen2671-visible-three-strata-20261012&rev=gen2694-legacy-fan-recovery-v1';
import {sampleHEarthRun8CSuccessorSurfaceMaterial as materialAt} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate,sampleHEarthGen311PlacementStructureDisposition} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';
import {H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis} from './grass-lowland-trial.js';
export const WOODLAND_FINE_GRASS=Object.freeze({center:Object.freeze([-141,-226]),radii:Object.freeze([41.25,40]),tileMeters:4,spacing:.11,contactsPerParent:64,maxParents:1024,rootTextureBytes:1048576,indexBytes:12288});
const f=Math.fround,clamp=v=>Math.max(0,Math.min(1,v));
function hash(x,z,k=0){let h=Math.imul(x^0x51ed270b,1597334677)^Math.imul(z^0x68bc21eb,3812015801)^Math.imul(k+1,747796405);h=Math.imul(h^(h>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);return(h^(h>>>16))>>>0;}
export function isWoodlandFineGrassPoint(x,y,z){const a=inverseHEarthGroundCoverPoint(x,y,z);return Math.hypot((a.x+141)/41.25,(a.z+226)/40)<=1;}
function segmentDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,q=dx*dx+dz*dz,t=q?clamp(((x-a.x)*dx+(z-a.z)*dz)/q):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
export function woodlandGrassClear(x,z,r=.03){
 const structure=sampleHEarthGen311PlacementStructureDisposition(x,z);if(structure.hardExclusions.length||structure.planningHolds.length)return false;
 for(const b of [estate.manorCore,estate.gardens,estate.outbuildingProposal,estate.acceptedEnvelope])if(Math.hypot(x-Math.max(b.minX,Math.min(b.maxX,x)),z-Math.max(b.minZ,Math.min(b.maxZ,z)))<=r)return false;
 if(estate.footRoute.slice(1).some((b,i)=>segmentDistance(x,z,estate.footRoute[i],b)<=estate.footRouteRadius+r))return false;

 return !(x>=oasis.minX-r&&x<=oasis.maxX+r&&z>=oasis.minZ-r&&z<=oasis.maxZ+r);
}
function surface(positions,indices,spans){
 const bins=new Map();let count=0;
 for(const span of spans)for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){
  const a=[0,1,2].map(k=>{const n=indices[j+k]*3;return [f(positions[n]),f(positions[n+1]),f(positions[n+2])];});
  const xmin=Math.min(...a.map(p=>p[0])),xmax=Math.max(...a.map(p=>p[0])),zmin=Math.min(...a.map(p=>p[2])),zmax=Math.max(...a.map(p=>p[2]));
  if(xmax< -185||xmin> -97||zmax< -269||zmin> -183)continue;
  const[p,q,r]=a,det=(q[2]-r[2])*(p[0]-r[0])+(r[0]-q[0])*(p[2]-r[2]);if(Math.abs(det)<1e-12)continue;
  const u=q.map((v,k)=>v-p[k]),v=r.map((v,k)=>v-p[k]),ny=u[2]*v[0]-u[0]*v[2],slope=Math.hypot(u[1]*v[2]-u[2]*v[1],u[0]*v[1]-u[1]*v[0])/Math.abs(ny),t={a,det,slope,triangleId:j/3};count++;
  for(let iz=Math.floor(Math.max(-269,zmin)/4);iz<=Math.floor(Math.min(-183,zmax)/4);iz++)for(let ix=Math.floor(Math.max(-185,xmin)/4);ix<=Math.floor(Math.min(-97,xmax)/4);ix++){const key=`${ix}:${iz}`;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(t);}
 }
 return{count,sample(x,z){for(const t of bins.get(`${Math.floor(x/4)}:${Math.floor(z/4)}`)??[]){const[a,b,c]=t.a,u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/t.det,v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/t.det,w=1-u-v;if(Math.min(u,v,w)>=-1e-8)return{y:f(u*a[1]+v*b[1]+w*c[1]),slope:t.slope,triangleId:t.triangleId};}return null;}};
}
export async function buildWoodlandFineGrass(pkg,{refinement=null,yieldControl=async()=>{},onProgress=()=>{}}={}){
 const started=performance.now();let sliceStart=started,yieldCount=0;
 const base=surface(pkg.buffers.positions,pkg.buffers.indices,pkg.primitiveSpans.filter(s=>s.role==='TERRAIN')),water=surface(pkg.buffers.positions,pkg.buffers.indices,pkg.primitiveSpans.filter(s=>String(s.primitiveId).includes('FAR_OCEAN_CONTINUATION')));
 const refined=refinement?surface(refinement.positions,refinement.indices,[{indexStart:0,indexCount:refinement.indices.length}]):null,clip=refinement?.clip;
 if(refined&&(!Array.isArray(clip)||clip.length!==4))throw Error('WOODLAND_REFINEMENT_CLIP_INVALID');
 const sample=(x,z)=>refined&&x>clip[0]&&x<clip[2]&&z>clip[1]&&z<clip[3]?refined.sample(x,z):base.sample(x,z),tiles=new Map(),rejections={};let candidates=0,accepted=0;
 const reject=k=>rejections[k]=(rejections[k]??0)+1,obstacles=pkg.landscapeCoverFootprints??[],trees=pkg.landscapeFloorFootprints??[];
 for(let iz=0;iz<756;iz++){
  for(let ix=0;ix<780;ix++){
   if(ix%32===0&&performance.now()-sliceStart>=8){onProgress({phase:'WOODLAND_FINE_GRASS_CONTACTS',completedRows:iz,totalRows:756,acceptedContacts:accepted});await yieldControl();yieldCount++;sliceStart=performance.now();}
   const x=f(-183.5+(ix+(hash(ix,iz,0)/4294967296-.5)*.76)*.11),z=f(-267.5+(iz+(hash(ix,iz,1)/4294967296-.5)*.76)*.11);
   if(Math.hypot((x+141)/41.25,(z+226)/40)>1.001)continue;candidates++;
   const s=sample(x,z);if(!s){reject('NO_TERRAIN');continue;}if(!isWoodlandFineGrassPoint(x,s.y,z)){reject('BOUNDARY');continue;}
   const a=inverseHEarthGroundCoverPoint(x,s.y,z),m=materialAt(a.x,a.z),w=water.sample(x,z);
   if(w&&s.y<=w.y+.01){reject('WATER');continue;}
   if(m?.valid!==true||s.slope>.35||!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20)){reject('MATERIAL_OR_SLOPE');continue;}
   if(!woodlandGrassClear(a.x,a.z)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<t.radius+.03)||trees.some(t=>Math.hypot(x-t.x,z-t.z)<t.trunkRadius+.10)){reject('PROTECTED_FOOTPRINT');continue;}
   const edge=1-Math.hypot((a.x+141)/41.25,(a.z+226)/40),weight=Math.min(1,edge*40),priority=hash(ix,iz,2)/4294967296;
   if(priority>weight){reject('BOUNDARY_FEATHER');continue;}
   const tx=Math.floor(x/4),tz=Math.floor(z/4),id=`${tx}:${tz}`;if(!tiles.has(id))tiles.set(id,{id,minX:tx*4,minZ:tz*4,roots:[]});
   tiles.get(id).roots.push({x,y:s.y,z,angle:f(hash(ix,iz,3)/4294967296*Math.PI*2),seed:hash(ix,iz,4),triangleId:s.triangleId,slope:s.slope});accepted++;
  }
  if(performance.now()-sliceStart>=8){await yieldControl();yieldCount++;sliceStart=performance.now();}
 }
 const ordered=[...tiles.values()].sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX);for(const t of ordered)t.roots.sort((a,b)=>a.seed-b.seed);
 const presentation={tiles:ordered};await prepareWoodlandSelectionCache(presentation,yieldControl);
 return Object.assign(presentation,{receipt:{schema:'H_EARTH_WOODLAND_FINE_GRASS_PRESENTATION_v1',candidateCount:candidates,contactCount:accepted,tileCount:ordered.length,selectionCacheTypedArrayBytes:accepted*44,selectionCacheReferenceSlots:accepted*2,elapsedMilliseconds:performance.now()-started,yieldCount,rejections,originalRecordsChanged:false,terrainChanged:false,footprint:WOODLAND_FINE_GRASS,rootEncoding:'ACTUAL_FLOAT32_TRIANGLE_CONTACTS'}});
}
const woodlandSelectionCache=new WeakMap();
async function prepareWoodlandSelectionCache(presentation,yieldControl){
 const n=presentation.tiles.reduce((sum,t)=>sum+t.roots.length,0),c={roots:new Array(n),tiles:[],tileIds:new Array(n),x:new Float64Array(n),z:new Float64Array(n),u:new Float64Array(n),ranks:new Float64Array(n),distances:new Float64Array(n),eligible:new Uint32Array(n)};let i=0,slice=performance.now();
 for(const tile of presentation.tiles){const start=i;for(const root of tile.roots){let h=Math.imul(root.seed^(root.seed>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);c.roots[i]=root;c.x[i]=root.x;c.z[i]=root.z;c.u[i]=((h^(h>>>16))>>>0)/4294967296;c.tileIds[i++]=tile.id;}c.tiles.push({x:tile.minX+2,z:tile.minZ+2,start,end:i});if(performance.now()-slice>=8){await yieldControl();slice=performance.now();}}
 woodlandSelectionCache.set(presentation,c);
}

export function selectWoodlandFineGrass(presentation,camera,{maximumParents=1024}={}){
 const capacity=Math.min(1024,Math.max(0,maximumParents|0)),qx=Math.floor(camera.x/4)*4+2,qz=Math.floor(camera.z/4)*4+2;
 let c=woodlandSelectionCache.get(presentation);
 if(!c){const roots=presentation.tiles.flatMap(t=>t.roots),n=roots.length;c={roots,tiles:[],tileIds:[],x:new Float64Array(n),z:new Float64Array(n),u:new Float64Array(n),ranks:new Float64Array(n),distances:new Float64Array(n),eligible:new Uint32Array(n)};let i=0;for(const tile of presentation.tiles){const start=i;for(const root of tile.roots){let h=Math.imul(root.seed^(root.seed>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);c.x[i]=root.x;c.z[i]=root.z;c.u[i]=((h^(h>>>16))>>>0)/4294967296;c.tileIds[i++]=tile.id;}c.tiles.push({x:tile.minX+2,z:tile.minZ+2,start,end:i});}woodlandSelectionCache.set(presentation,c);}
 let count=0;const {x,z,u,ranks,distances,eligible}=c;
 for(const tile of c.tiles){const tx=tile.x-qx,tz=tile.z-qz;if(tx*tx+tz*tz>65*65)continue;const nearest=Math.max(0,Math.sqrt(tx*tx+tz*tz)-Math.SQRT2*2),tmax=Math.max(0,nearest-8)/7,upperP=.065+.935*Math.exp(-tmax*tmax);for(let i=tile.start;i<tile.end;i++){if(u[i]>=upperP)continue;const dx=x[i]-qx,dz=z[i]-qz,d2=dx*dx+dz*dz;if(d2>3844)continue;const d=Math.sqrt(d2),t=Math.max(0,d-8)/7,p=.065+.935*Math.exp(-t*t),rank=u[i]/p;if(rank<1){ranks[i]=rank;distances[i]=d2;eligible[count++]=i;}}}
 const limit=Math.max(0,capacity*64-128);
 if(count>limit&&limit>0){let lo=0,hi=count-1;while(lo<hi){const pivot=ranks[eligible[(lo+hi)>>>1]];let i=lo,j=hi;while(i<=j){while(ranks[eligible[i]]<pivot)i++;while(ranks[eligible[j]]>pivot)j--;if(i<=j){const tmp=eligible[i];eligible[i++]=eligible[j];eligible[j--]=tmp;}}if(limit-1<=j)hi=j;else if(limit-1>=i)lo=i;else break;}}
 const packed=[[],[],[]];for(let j=0;j<Math.min(limit,count);j++){const i=eligible[j],d2=distances[i];packed[d2<100?0:d2<576?1:2].push({root:c.roots[i],tileId:c.tileIds[i]});}
 const pixels=new Float32Array(capacity*64*4);for(let i=1;i<pixels.length;i+=4)pixels[i]=-100000;
 const groups=[],chunks=[];let parentCount=0,contactCount=0,vertices=0,triangles=0;
 for(let level=0;level<3;level++){const firstParent=parentCount,leafCount=4,list=packed[level];for(let i=0;i<list.length;i+=64){const group=list.slice(i,i+64),chunk={tileId:'PACKED_'+level,first:i,roots:group.map(x=>x.root),sourceTileIds:[...new Set(group.map(x=>x.tileId))],parent:parentCount,level};chunks.push(chunk);chunk.roots.forEach((r,k)=>pixels.set([r.x,r.y,r.z,r.angle],(parentCount*64+k)*4));parentCount++;contactCount+=chunk.roots.length;}const count=parentCount-firstParent;if(count){groups.push({level,leafCount,firstParent,parentCount:count});vertices+=count*64*leafCount*6;triangles+=count*64*leafCount*4;}}
 const signature=`${qx}:${qz}:${capacity}:`+groups.map(g=>`${g.level}:${g.parentCount}`).join(',');
 return{pixels:pixels.subarray(0,parentCount*256),groups,chunks,signature,parentCount,contactCount,vertices,triangles,draws:groups.length};
}
export function filterWoodlandLegacyGrass(pkg){
 const original=pkg.buffers.indices,indices=Uint32Array.from(original),positions=pkg.buffers.positions,attributes=pkg.clearingAttributes,span=pkg.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_LANDSCAPE_P2_GRASS');let suppressedTriangles=0;const suppressedTypeCounts={},preservedTypeCounts={};
 if(!span)throw Error('WOODLAND_LEGACY_GRASS_SPAN_MISSING');
 for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){const ids=[original[j],original[j+1],original[j+2]],types=ids.map(i=>attributes[i*3+2]),centroid=[0,1,2].map(k=>ids.reduce((n,i)=>n+positions[i*3+k]/3,0)),target=types.every(t=>t===types[0])&&(types[0]===0||types[0]===3)&&ids.some(i=>isWoodlandFineGrassPoint(positions[i*3],positions[i*3+1],positions[i*3+2]));
  if(target){indices[j+1]=indices[j];indices[j+2]=indices[j];suppressedTriangles++;suppressedTypeCounts[types[0]]=(suppressedTypeCounts[types[0]]??0)+1;}else preservedTypeCounts[types[0]]=(preservedTypeCounts[types[0]]??0)+1;
 }
 return{indices,receipt:{suppressedTriangles,suppressedTypeCounts,preservedTypeCounts,scope:'P2_GRASS_TYPE_0_OR_3_TRIANGLE_INTERSECTS_AUTHORED_ELLIPSE_AT_VERTEX',originalWorldChanged:false,indexBufferBytes:indices.byteLength,submittedDegenerateTriangles:suppressedTriangles}};
}
export function buildWoodlandFineGrassIndices(){const out=[];for(let leaf=0;leaf<64*4;leaf++){const v=leaf*6;out.push(v,v+1,v+2,v+1,v+3,v+2,v+2,v+3,v+4,v+3,v+5,v+4);}return Uint32Array.from(out);}
export function woodlandFineGrassVertex(root,leaf,leafCount=4){
 const seed=(Math.imul(Math.trunc(Math.fround(root.angle*1000)),1664525)+Math.imul(leaf,747796405))>>>0,r0=(seed&1023)/1023,r1=((seed>>>10)&1023)/1023,r2=((seed>>>20)&1023)/1023,angle=root.angle+leaf*2.399963+r0*.8,h=.22+.18*r1,halfWidth=.010+.006*r2,bend=.06+.09*r2;
 return{angle,h,halfWidth,bend,r0,leaf,leafCount};
}
