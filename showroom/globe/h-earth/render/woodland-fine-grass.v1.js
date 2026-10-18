import {appendGrassContinuity} from './grass-continuity-supplement.v1.js';
import {WOODLAND_HABITAT,habitatHash,planWoodlandHabitatCandidates,habitatSlopeWeight} from './woodland-habitat-field.v1.js';
import {decodeVerifiedPlantingRoots,H_EARTH_VERIFIED_PLANTING_PACKET} from './verified-planting-packet.v1.js';
import {isVerifiedPlantingPoint,H_EARTH_VERIFIED_PLANTING_CELLS} from './verified-planting-cells.v1.js';
/** Same selected-cell atlas for generated and precomputed package startup.
 * Left woodland texels remain exact; membership never substitutes for support. */
export function applyVerifiedPlantingHabitat(field){
 if(!field.woodland||field.width!==field.size*2)throw Error('VERIFIED_PLANTING_ATLAS_LAYOUT');
 const c=H_EARTH_VERIFIED_PLANTING_CELLS,bounds=Object.freeze([c.minX,c.minZ,c.minX+c.width,c.minZ+c.height]);
 const pixels=new Uint8Array(field.pixels),size=field.size;
 for(let z=0;z<size;z++)for(let x=0;x<size;x++)pixels[z*field.width+size+x]=isVerifiedPlantingPoint(bounds[0]+(x+.5)/size*c.width,bounds[1]+(z+.5)/size*c.height)?255:0;
 const ravine=Object.freeze({...field.ravine,bounds,sample:(x,z)=>Number(isVerifiedPlantingPoint(x,z))});
 return Object.freeze({...field,pixels,ravine,sample:(x,z)=>Math.max(field.woodland.sample(x,z),ravine.sample(x,z)),receipt:{...field.receipt,verifiedPlantingCells:c.count,ravine:{...field.receipt.ravine,bounds,selectedCells:c.count},coverageSource:'EXACT_SAVED_CELL_MEMBERSHIP_WITH_PER_ROOT_SUPPORT_VALIDATION'}});
}
/** Presentation-only woodland grass. Canonical world and records stay immutable. */
import {inverseHEarthGroundCoverPoint} from './landscape-groundcover.global-v1.js?cb=gen2671-visible-three-strata-20261012&rev=gen2780-stable-planting-v1';
import {sampleHEarthRun8CSuccessorSurfaceMaterial as materialAt} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate,sampleHEarthGen311PlacementStructureDisposition} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';
import {H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis} from './grass-lowland-trial.js';
/** Optional observations describe actual calls; fixtures must identify themselves externally. */
function diagnosticCap(value,name,limit){if(!Number.isSafeInteger(value)||value<1||value>limit)throw Error('VEGETATION_TRACE_'+name+'_INVALID');return value;}
export function summarizeVegetationRoots(roots,{maximumRoots=128,presentationOwner=null,ownerForRoot=null}={}){
 diagnosticCap(maximumRoots,'MAXIMUM_ROOTS',128);
 if(ownerForRoot!==null&&typeof ownerForRoot!=='function')throw Error('VEGETATION_TRACE_OWNER_CALLBACK_INVALID');
 if(!roots||typeof roots[Symbol.iterator]!=='function')throw Error('VEGETATION_TRACE_ROOTS_INVALID');
 const bytes=new DataView(new ArrayBuffer(8)),sample=[];let ordered=2166136261,count=0,sum=0,xor=0;
 const feed=(h,byte)=>Math.imul(h^byte,16777619)>>>0;
 const number=(h,value)=>{if(value===null||value===undefined)return feed(h,0);h=feed(h,1);bytes.setFloat64(0,Number(value),true);for(let j=0;j<8;j++)h=feed(h,bytes.getUint8(j));return h;};
 const string=(h,value)=>{if(value===null||value===undefined)return feed(h,0);h=feed(h,1);const text=String(value);h=number(h,text.length);for(let j=0;j<text.length;j++){const code=text.charCodeAt(j);h=feed(feed(h,code&255),code>>>8);}return h;};
 for(const root of roots){
  const owner=ownerForRoot?.(root)??presentationOwner??root.presentationOwner??root.owner??null;
  let h=2166136261;h=number(h,root.x);h=number(h,root.y);h=number(h,root.z);h=number(h,root.seed??null);h=string(h,owner);
  bytes.setUint32(0,h,true);for(let j=0;j<4;j++)ordered=feed(ordered,bytes.getUint8(j));
  sum=(sum+h)>>>0;xor=(xor^h)>>>0;count++;
  if(sample.length<maximumRoots)sample.push({x:root.x,y:root.y,z:root.z,seed:root.seed??null,owner,supportOwner:root.support?.owner??root.owner??null});
 }
 const hex=value=>value.toString(16).padStart(8,'0');
 return{rootCount:count,digest:'fnv1a32-ordered:'+hex(ordered),membershipDigest:'fnv1a32-sum-xor:'+hex(sum)+':'+hex(xor)+':'+count,sample,truncatedRootCount:Math.max(0,count-sample.length),identityFields:['x','y','z','seed','owner'],orderSensitive:true,membershipOrderIndependent:true,digestCollisionCaveat:'Noncryptographic digests can collide; compare sampled identities or exact records when adjudicating a mismatch.'};
}
export function createVegetationContinuityTrace({maximumEvents=512,maximumRoots=128,now=()=>performance.now()}={}){
 diagnosticCap(maximumEvents,'MAXIMUM_EVENTS',512);diagnosticCap(maximumRoots,'MAXIMUM_ROOTS',128);
 if(typeof now!=='function')throw Error('VEGETATION_TRACE_CLOCK_INVALID');
 const events=new Array(maximumEvents);let sequence=0,size=0,droppedCount=0,observerErrorCount=0,disposed=false;
 const rejectionReasonCounts={TYPE_INVALID:0,TIME_INVALID:0,EVENT_TOO_LARGE:0,COPY_OR_RECORD_FAILED:0};
 const copy=value=>JSON.parse(JSON.stringify(value,(_key,item)=>Array.isArray(item)?item.slice(0,maximumRoots):item));
 function record(type,details={}){
  if(disposed)return false;
  try{
   if(typeof type!=='string'||!type||type.length>128)throw Error('VEGETATION_TRACE_TYPE_INVALID');
   const timestamp=now();if(!Number.isFinite(timestamp))throw Error('VEGETATION_TRACE_TIME_INVALID');
   const safe=copy(details),encoded=JSON.stringify(safe);if(encoded.length>32768)throw Error('VEGETATION_TRACE_EVENT_TOO_LARGE');
   const event={sequence:sequence+1,type,timestamp,details:safe};events[sequence%maximumEvents]=event;sequence++;
   if(size===maximumEvents)droppedCount++;else size++;return true;
  }catch(error){const reason=error?.message==='VEGETATION_TRACE_TYPE_INVALID'?'TYPE_INVALID':error?.message==='VEGETATION_TRACE_TIME_INVALID'?'TIME_INVALID':error?.message==='VEGETATION_TRACE_EVENT_TOO_LARGE'?'EVENT_TOO_LARGE':'COPY_OR_RECORD_FAILED';rejectionReasonCounts[reason]++;observerErrorCount++;droppedCount++;return false;}
 }
 function summary(){return{schema:'H_EARTH_VEGETATION_CONTINUITY_TRACE_v1',maximumEvents,maximumRoots,eventCount:size,lastSequence:sequence,droppedCount,observerErrorCount,rejectionReasonCounts:{...rejectionReasonCounts},timingPerturbed:true,disposed};}
 function getSnapshot({sinceSequence=0}={}){
  if(!Number.isSafeInteger(sinceSequence)||sinceSequence<0)throw Error('VEGETATION_TRACE_SEQUENCE_INVALID');
  const selected=[];for(let seq=sequence-size+1;seq<=sequence;seq++){if(seq>sinceSequence)selected.push(JSON.parse(JSON.stringify(events[(seq-1)%maximumEvents])));}
  return{...summary(),events:selected};
 }
 function dispose(){if(disposed)return;disposed=true;events.fill(undefined);size=0;}
 return Object.freeze({record,getSnapshot,summary,dispose});
}
export const WOODLAND_FINE_GRASS=Object.freeze({center:Object.freeze([-141,-226]),radii:Object.freeze([41.25,40]),tileMeters:4,spacing:.11,contactsPerParent:64,maxParents:1024,rootTextureBytes:1048576,indexBytes:12288});
const f=Math.fround,clamp=v=>Math.max(0,Math.min(1,v));
function hash(x,z,k=0){let h=Math.imul(x^0x51ed270b,1597334677)^Math.imul(z^0x68bc21eb,3812015801)^Math.imul(k+1,747796405);h=Math.imul(h^(h>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);return(h^(h>>>16))>>>0;}
export function isWoodlandFineGrassPoint(x,y,z){const a=inverseHEarthGroundCoverPoint(x,y,z);return Math.hypot((a.x+141)/41.25,(a.z+226)/40)<=1;}
export function woodlandEdgeWeight(x,y,z){const a=inverseHEarthGroundCoverPoint(x,y,z);return clamp(40*(1-Math.hypot((a.x+141)/41.25,(a.z+226)/40)));}
export function nearbyWoodlandComplement(x,y,z){return 1-woodlandEdgeWeight(x,y,z);}
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
export async function buildWoodlandFineGrass(pkg,{refinement=null,yieldControl=async()=>{},onProgress=()=>{},priorityOrigin=null,onPriorityPreview=null,visibleSurface=null,admitGround=visibleSurface?.admitGround,habitat=null}={}){
 if(typeof admitGround!=='function')throw Error('WOODLAND_RENDERED_BEACH_PROVIDER_REQUIRED');
 if(habitat)return buildHabitatWoodland(pkg,{visibleSurface,admitGround,habitat,yieldControl,onProgress});
 if(priorityOrigin!==null&&(![priorityOrigin.x,priorityOrigin.z].every(Number.isFinite)))throw Error('WOODLAND_PRIORITY_ORIGIN_INVALID');
 if(onPriorityPreview!==null&&typeof onPriorityPreview!=='function')throw Error('WOODLAND_PRIORITY_CALLBACK_INVALID');
 const started=performance.now();let sliceStart=started,yieldCount=0;
 const base=surface(pkg.buffers.positions,pkg.buffers.indices,pkg.primitiveSpans.filter(s=>s.role==='TERRAIN')),water=surface(pkg.buffers.positions,pkg.buffers.indices,pkg.primitiveSpans.filter(s=>String(s.primitiveId).includes('FAR_OCEAN_CONTINUATION')));
 const refined=refinement?surface(refinement.positions,refinement.indices,[{indexStart:0,indexCount:refinement.indices.length}]):null,clip=refinement?.clip;
 if(refined&&(!Array.isArray(clip)||clip.length!==4))throw Error('WOODLAND_REFINEMENT_CLIP_INVALID');
 const sample=visibleSurface?.sample??((x,z)=>refined&&x>clip[0]&&x<clip[2]&&z>clip[1]&&z<clip[3]?refined.sample(x,z):base.sample(x,z)),tiles=new Map(),rejections={};let candidates=0,accepted=0;
 const reject=k=>rejections[k]=(rejections[k]??0)+1,obstacles=pkg.landscapeCoverFootprints??[],trees=pkg.landscapeFloorFootprints??[];
 // Camera-nearest rows first: every candidate is tested once, and final tiles
 // and individual roots retain the identical canonical deterministic sort.
 // Exact accepted-root rules are unchanged. Sample a useful camera-near
 // ground patch first, then expand outward. Every grid cell is visited once.
 const visit=(ix,iz)=>{
   const x=f(-183.5+(ix+(hash(ix,iz,0)/4294967296-.5)*.76)*.11),z=f(-267.5+(iz+(hash(ix,iz,1)/4294967296-.5)*.76)*.11);
   if(Math.hypot((x+141)/41.25,(z+226)/40)>1.001)return;candidates++;
   const s=sample(x,z);if(!s){reject('NO_TERRAIN');return;}if(!isWoodlandFineGrassPoint(x,s.y,z)){reject('BOUNDARY');return;}
   if(!admitGround(x,z,s)){reject('SHARED_GROUND_ADMISSION');return;}
   const a=inverseHEarthGroundCoverPoint(x,s.y,z),m=materialAt(a.x,a.z),w=(visibleSurface?.water??water).sample(x,z);
   if(w&&s.y<=w.y+.01){reject('WATER');return;}
   if(m?.valid!==true||s.slope>.35||!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20)){reject('MATERIAL_OR_SLOPE');return;}
   if(!woodlandGrassClear(a.x,a.z)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.radius+.03))||trees.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.trunkRadius+.10))){reject('PROTECTED_FOOTPRINT');return;}
   const edge=1-Math.hypot((a.x+141)/41.25,(a.z+226)/40),weight=Math.min(1,edge*40),priority=hash(ix,iz,2)/4294967296;
   if(priority>weight){reject('BOUNDARY_FEATHER');return;}
   const tx=Math.floor(x/4),tz=Math.floor(z/4),id=`${tx}:${tz}`;if(!tiles.has(id))tiles.set(id,{id,minX:tx*4,minZ:tz*4,roots:[]});
   tiles.get(id).roots.push({x,y:s.y,z,angle:f(hash(ix,iz,3)/4294967296*Math.PI*2),seed:hash(ix,iz,4),triangleId:s.triangleId,slope:s.slope});accepted++;
 };
 const scanned=priorityOrigin&&onPriorityPreview?new Uint8Array(756*780):null;
 const cameraInWoodland=!!(scanned&&Math.hypot((priorityOrigin.x+141)/41.25,(priorityOrigin.z+226)/40)<1.35);
 let scannedCells=0,completedRows=0;
 const yieldWhenNeeded=async()=>{
   if(performance.now()-sliceStart>=8){await yieldControl();yieldCount++;sliceStart=performance.now();}
 };
 const publishPreview=async radius=>{
   if(!onPriorityPreview||accepted===0)return;
   // The source visit grid is rectangular for cheap deterministic sampling;
   // never show that temporary rectangle as a hard-edged meadow carpet.
   // Only the *preview submission* is irregularly feathered; every accepted
   // record survives untouched into the canonical full woodland presentation.
   const previewContactVisible=root=>{
     const dx=root.x-priorityOrigin.x,dz=root.z-priorityOrigin.z;
     const theta=Math.atan2(dz,dx);
     const envelope=radius*(.84+.06*Math.sin(3*theta+.7)+.04*Math.sin(5*theta-1.4));
     const feather=Math.max(0,Math.min(1,(envelope-Math.hypot(dx,dz))/(radius*.12)+.5));
     return hash(Math.floor(root.x*2),Math.floor(root.z*2),9)/4294967296<feather;
   };
   const snapshotTiles=[...tiles.values()]
     .map(t=>({...t,roots:t.roots.filter(previewContactVisible).sort((a,b)=>a.seed-b.seed)}))
     .filter(t=>t.roots.length>0)
     .sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX);
   const stagedContacts=snapshotTiles.reduce((n,t)=>n+t.roots.length,0);
   if(stagedContacts===0)return;
   await onPriorityPreview({tiles:snapshotTiles,receipt:{
     schema:'H_EARTH_WOODLAND_FINE_GRASS_PRIORITY_PREVIEW_v1',
     contactCount:stagedContacts,sourceAcceptedCount:accepted,processedCells:scannedCells,
     featherRule:'SOURCE_ONLY_DETERMINISTIC_IRREGULAR_RADIAL_TAPER_NO_NEW_ROOTS',
     priorityRadiusMeters:radius,rowsPrepared:completedRows,totalRows:756,
     originalRecordsChanged:false,terrainChanged:false,
     actualPixelsVerified:false
   }});
 };
 if(cameraInWoodland){
   const cx=Math.max(0,Math.min(779,Math.round((priorityOrigin.x+183.5)/.11)));
   const cz=Math.max(0,Math.min(755,Math.round((priorityOrigin.z+267.5)/.11)));
   for(const radius of [4,9,17]){
     const half=Math.ceil(radius/.11);
     for(let iz=Math.max(0,cz-half);iz<=Math.min(755,cz+half);iz++){
       for(let ix=Math.max(0,cx-half);ix<=Math.min(779,cx+half);ix++){
         const index=iz*780+ix;if(scanned[index])continue;
         scanned[index]=1;scannedCells++;visit(ix,iz);
         if((ix&31)===0)await yieldWhenNeeded();
       }
       await yieldWhenNeeded();
     }
     await publishPreview(radius);
   }
 }
 const rows=Array.from({length:756},(_,i)=>i);
 if(priorityOrigin)rows.sort((a,b)=>{
   const da=Math.abs(-267.5+(a+.5)*.11-priorityOrigin.z);
   const db=Math.abs(-267.5+(b+.5)*.11-priorityOrigin.z);
   return da-db||a-b;
 });
 for(const iz of rows){
   for(let ix=0;ix<780;ix++){
     const index=iz*780+ix;if(scanned?.[index])continue;
     scannedCells++;visit(ix,iz);
     if((ix&31)===0){
       onProgress({phase:'WOODLAND_FINE_GRASS_CONTACTS',completedRows,totalRows:756,
         acceptedContacts:accepted,processedCells:scannedCells});
       await yieldWhenNeeded();
     }
   }
   completedRows++;await yieldWhenNeeded();
 }
 const ordered=[...tiles.values()].sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX);for(const t of ordered)t.roots.sort((a,b)=>a.seed-b.seed);
 const presentation={tiles:ordered};await prepareWoodlandSelectionCache(presentation,yieldControl);
 return Object.assign(presentation,{receipt:{schema:'H_EARTH_WOODLAND_FINE_GRASS_PRESENTATION_v1',candidateCount:candidates,contactCount:accepted,tileCount:ordered.length,selectionCacheTypedArrayBytes:accepted*44,selectionSupportCacheTypedArrayBytesMaximum:accepted*8,selectionCacheTypedArrayBytesMaximum:accepted*52,selectionCacheReferenceSlots:accepted*2,elapsedMilliseconds:performance.now()-started,yieldCount,rejections,originalRecordsChanged:false,terrainChanged:false,footprint:WOODLAND_FINE_GRASS,rootEncoding:'ACTUAL_FLOAT32_TRIANGLE_CONTACTS'}});
}
/** Continuous visibility is separate from immutable root placement and blade geometry. */
export const FINE_GRASS_CONTINUITY=Object.freeze({nearbyInner:14,nearbyOuter:20,woodlandInner:56,woodlandOuter:62,fadeWidth:.04,scoreGuard:.0001});
export function fineGrassPriority(angle){
 let seed=Math.imul(Math.trunc(Math.fround(Math.fround(angle)*1000)),1664525)>>>0;
 seed=Math.imul(seed^(seed>>>16),2246822519)>>>0;seed=Math.imul(seed^(seed>>>13),3266489917)>>>0;
 return ((seed^(seed>>>16))&0xffffff)/16777216;
}
export function fineGrassImportance(root,camera,{nearby=false,priority=fineGrassPriority(root.angle)}={}){
 const dx=Math.fround(root.x)-Math.fround(camera.x),dz=Math.fround(root.z)-Math.fround(camera.z),d=Math.sqrt(dx*dx+dz*dz);
 const inner=nearby?FINE_GRASS_CONTINUITY.nearbyInner:FINE_GRASS_CONTINUITY.woodlandInner;
 const outer=nearby?FINE_GRASS_CONTINUITY.nearbyOuter:FINE_GRASS_CONTINUITY.woodlandOuter;
 const t=Math.max(0,Math.min(1,(d-inner)/(outer-inner))),envelope=1-t*t*(3-2*t),q=Math.max(0,d-8)/7;
 return Math.max(0,.16+.84*Math.exp(-q*q)-priority)*envelope;
}
export function fineGrassVisibility(root,camera,cutoff=0,options={}){
 const t=Math.max(0,Math.min(1,(fineGrassImportance(root,camera,options)-cutoff-FINE_GRASS_CONTINUITY.scoreGuard)/FINE_GRASS_CONTINUITY.fadeWidth));
 return t*t*(3-2*t);
}
export function sameWoodlandFineGrassPackedRoots(a,b){
 if(!a||!b||a.pixels.length!==b.pixels.length)return false;
 for(let i=0;i<a.pixels.length;i++)if(!Object.is(a.pixels[i],b.pixels[i]))return false;
 return true;
}
const woodlandSelectionCache=new WeakMap(),woodlandPackedSelectionCache=new WeakMap();
export async function prepareWoodlandSelectionCache(presentation,yieldControl=async()=>{}){
 const n=presentation.tiles.reduce((sum,t)=>sum+t.roots.length,0),c={roots:new Array(n),tiles:[],tileIds:new Array(n),x:new Float64Array(n),z:new Float64Array(n),u:new Float64Array(n),ranks:new Float64Array(n),distances:new Float64Array(n),eligible:new Uint32Array(n)};let i=0,slice=performance.now();
 for(const tile of presentation.tiles){const start=i;for(const root of tile.roots){c.roots[i]=root;c.x[i]=root.x;c.z[i]=root.z;c.u[i]=fineGrassPriority(root.angle);c.tileIds[i++]=tile.id;}c.tiles.push({x:tile.minX+2,z:tile.minZ+2,nearby:tile.id.startsWith('NEARBY:'),start,end:i});if(performance.now()-slice>=8){await yieldControl();slice=performance.now();}}
 woodlandSelectionCache.set(presentation,c);
}

/** A world-anchored nearby presentation, rather than another whole-world survey. */
export function createNearbyFineGrassCache(pkg,{visibleSurface,yieldControl=async()=>{},onProgress=()=>{},placementExclusion=null,onDiagnostic=null,onPresentation=null,admitGround=visibleSurface?.admitGround}={}){
 if(typeof admitGround!=='function')throw Error('NEARBY_RENDERED_BEACH_PROVIDER_REQUIRED');
 if(typeof visibleSurface?.ground?.sample!=='function'||typeof visibleSurface?.water?.sample!=='function')throw Error('NEARBY_FINE_GRASS_VISIBLE_SURFACE_REQUIRED');
 if(placementExclusion!==null&&typeof placementExclusion!=='function')throw Error('NEARBY_FINE_GRASS_EXCLUSION_INVALID');
 if(onDiagnostic!==null&&typeof onDiagnostic!=='function')throw Error('NEARBY_FINE_GRASS_DIAGNOSTIC_INVALID');
 if(onPresentation!==null&&typeof onPresentation!=='function')throw Error('NEARBY_FINE_GRASS_PRESENTATION_INVALID');
 const observe=onDiagnostic?(type,details)=>{try{onDiagnostic(type,JSON.parse(JSON.stringify(typeof details==='function'?details():details)));}catch{/* Diagnostic observers cannot affect construction. */}}:null;
 const spacing=.22,tileMeters=4,maximumRoots=65536;
 const tiles=new Map(),obstacles=pkg.landscapeCoverFootprints??[],trees=pkg.landscapeFloorFootprints??[];
 let latestRequest=null,builder=null,publisher=null,pendingPublication=null,requestRevision=0,presentationSequence=0;
 let cachedRoots=0,peakCachedRoots=0,peakRequestRoots=0,lastPresentation=null,stickyError=null,errorCount=0,failedRevision=null;
 let completion=null,resolveCompletion=null,rejectCompletion=null,activePublicationRevision=null;
 const tileDistance=(tx,tz,cx,cz)=>Math.hypot(cx-Math.max(tx*4,Math.min(tx*4+4,cx)),cz-Math.max(tz*4,Math.min(tz*4+4,cz)));
 const fail=(error,revision)=>{stickyError=String(error?.message??error);errorCount++;failedRevision=revision;if(observe)observe('CACHE_ERROR',{requestRevision:revision,message:stickyError,errorCount});if(rejectCompletion&&revision===latestRequest?.revision){rejectCompletion(error);completion=null;resolveCompletion=null;rejectCompletion=null;}};
 function evict(){
  const request=latestRequest;if(!request)return;
  for(const [id,tile] of tiles)if(tileDistance(tile.minX/4,tile.minZ/4,request.cx,request.cz)>request.outerRadius+8){tiles.delete(id);cachedRoots-=tile.roots.length;request.evictedTiles++;request.evictedRoots+=tile.roots.length;}
  if(cachedRoots>maximumRoots){const ranked=[...tiles.entries()].sort((a,b)=>tileDistance(b[1].minX/4,b[1].minZ/4,request.cx,request.cz)-tileDistance(a[1].minX/4,a[1].minZ/4,request.cx,request.cz)||b[1].minZ-a[1].minZ||b[1].minX-a[1].minX);for(const [id,tile] of ranked){if(cachedRoots<=maximumRoots)break;tiles.delete(id);cachedRoots-=tile.roots.length;request.evictedTiles++;request.evictedRoots+=tile.roots.length;}}
  peakCachedRoots=Math.max(peakCachedRoots,cachedRoots);
 }
 function filteredTile(request,tile){
  const roots=tile.roots.filter(root=>{const distance=Math.hypot(root.x-request.cx,root.z-request.cz);if(distance<=request.coreRadius)return true;if(distance>=request.outerRadius)return false;const t=(request.outerRadius-distance)/(request.outerRadius-request.coreRadius),weight=t*t*(3-2*t);return hash(Math.round(root.x/spacing),Math.round(root.z/spacing),14)/4294967296<weight;});
  return Object.freeze({id:tile.id,minX:tile.minX,minZ:tile.minZ,roots:Object.freeze(roots)});
 }
 function sameRoots(a,b){
  if(a===b)return true;if(a.length!==b.length)return false;
  return a.every((root,i)=>root===b[i]||['x','y','z','angle','seed','triangleId','slope','owner'].every(key=>Object.is(root[key],b[i][key])));
 }
 function retainSelected(request,tile){
  const id=`${tile.minX/4}:${tile.minZ/4}`;if(request.selected.has(id))return;
  const selected=filteredTile(request,tile),previous=request.provisional.get(id);
  const count=request.contactCount+selected.roots.length-(previous?.roots.length??0);
  if(count>maximumRoots)throw Error('NEARBY_FINE_GRASS_ROOT_BUDGET_EXCEEDED:'+count);
  if(!sameRoots(selected.roots,previous?.roots??[]))request.contentRevision++;
  request.contactCount=count;request.provisional.delete(id);request.selected.set(id,selected);
  peakRequestRoots=Math.max(peakRequestRoots,request.contactCount);
 }
 function seedRequest(request,previous){
  for(const descriptor of request.requested){const id=`${descriptor.tx}:${descriptor.tz}`;if(tiles.has(id)){retainSelected(request,tiles.get(id));request.reusedTiles++;}}
  if(!previous)return;
  const required=new Set(request.requested.map(item=>`${item.tx}:${item.tz}`));
  for(const tile of previous.tiles){
   const id=`${tile.minX/4}:${tile.minZ/4}`;if(!required.has(id)||request.selected.has(id))continue;
   // These are only previously accepted roots, refiltered using the exact new
   // request density. They are continuity support, not a completed raw tile.
   const selected=filteredTile(request,tile);if(!selected.roots.length)continue;
   const count=request.contactCount+selected.roots.length;if(count>maximumRoots)throw Error('NEARBY_FINE_GRASS_ROOT_BUDGET_EXCEEDED:'+count);
   request.provisional.set(id,selected);request.contactCount=count;request.contentRevision++;
  }
  peakRequestRoots=Math.max(peakRequestRoots,request.contactCount);
 }
 function snapshot(request){
  const output=[...request.selected.values(),...request.provisional.values()].filter(tile=>tile.roots.length).sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX);
  const sequence=++presentationSequence,complete=request.selected.size===request.requested.length;
  const receipt={schema:'H_EARTH_NEARBY_FINE_GRASS_CACHE_v1',key:request.key,requestRevision:request.revision,presentationSequence:sequence,complete,contactCount:request.contactCount,tileCount:output.length,builtTiles:request.builtTiles,reusedTiles:request.reusedTiles,cachedTiles:tiles.size,cachedRoots,maximumRoots,centerX:request.cx,centerZ:request.cz,spacing,coreRadiusMeters:request.coreRadius,outerRadiusMeters:request.outerRadius,elapsedMilliseconds:performance.now()-request.started,rootEncoding:'ACTUAL_FLOAT32_VISIBLE_TRIANGLE_CONTACTS',originalRecordsChanged:false,terrainChanged:false,approvedWoodlandOwnerPreserved:true,evictedTiles:request.evictedTiles,evictedRoots:request.evictedRoots,requestedTileCount:request.requested.length,completedTileCount:request.selected.size,provisionalTileCount:request.provisional.size,stickyError,errorCount,retainedRootBounds:{cache:maximumRoots,currentRequest:maximumRoots,preparingSnapshot:maximumRoots,lastPresentation:maximumRoots,rendererInstalledNearby:maximumRoots,additionalInFlightTiles:1,maximumInFlightTileRoots:484},peakCachedRoots,peakRequestRoots};
  if(observe)receipt.diagnostic={requestRevision:request.revision,key:request.key,evictedTiles:request.evictedTiles,evictedRoots:request.evictedRoots};
  Object.freeze(receipt.retainedRootBounds);if(receipt.diagnostic)Object.freeze(receipt.diagnostic);
  return Object.freeze({tiles:Object.freeze(output),receipt:Object.freeze(receipt)});
 }
 function queuePublication(request){
  if(request!==latestRequest||request.revision===failedRevision)return;
  const complete=request.selected.size===request.requested.length;
  if((!onPresentation&&!complete)||(!complete&&request.contactCount===0))return;
  const publicationVersion=`${request.contentRevision}:${complete}`;
  if(request.lastQueuedSize===publicationVersion)return;
  request.lastQueuedSize=publicationVersion;
  // One newest marker, not an accumulating queue of whole-world snapshots.
  pendingPublication=request;
  if(publisher)return;
  publisher=(async()=>{
   while(pendingPublication){
    const selectedRequest=pendingPublication;pendingPublication=null;
    if(selectedRequest!==latestRequest||selectedRequest.revision===failedRevision)continue;
    activePublicationRevision=selectedRequest.revision;
    const presentation=snapshot(selectedRequest);
    await prepareWoodlandSelectionCache(presentation,yieldControl);
    if(selectedRequest!==latestRequest||selectedRequest.revision===failedRevision){if(observe)observe('CACHE_CANCEL',{requestRevision:selectedRequest.revision,currentRequestRevision:requestRevision,stage:'PRESENTATION_PREPARED'});continue;}
    // New tiles in this SAME revision do not invalidate an already prepared
    // partial. This serial callback gives the renderer monotonic commits.
    if(onPresentation)await onPresentation(presentation,Object.freeze({requestRevision:selectedRequest.revision,key:selectedRequest.key,presentationSequence:presentation.receipt.presentationSequence,complete:presentation.receipt.complete}));
    lastPresentation=presentation;
    if(selectedRequest!==latestRequest)continue;
    if(observe)observe(presentation.receipt.complete?'BUILD_COMPLETE':'PARTIAL_BUILD_COMPLETE',()=>({...presentation.receipt,roots:summarizeVegetationRoots((function*(){for(const tile of presentation.tiles)yield* tile.roots;})(),{presentationOwner:'NEARBY'})}));
    if(presentation.receipt.complete&&resolveCompletion){const resolve=resolveCompletion;completion=null;resolveCompletion=null;rejectCompletion=null;resolve(presentation);}
   }
  })().catch(error=>fail(error,activePublicationRevision??requestRevision)).finally(()=>{publisher=null;const next=pendingPublication;pendingPublication=null;if(next&&next.revision!==failedRevision){next.lastQueuedSize=-1;queuePublication(next);}});
 }
 async function constructTile(tx,tz,revision){
  const roots=[],rejections={};let candidates=0,slice=performance.now();
  const reject=reason=>rejections[reason]=(rejections[reason]??0)+1;
  // Neighboring cells may jitter across a tile boundary. Both tiles examine the
  // apron, but only the world-position owner retains that root, exactly once.
  for(let iz=Math.floor(tz*4/spacing)-1;iz<=Math.ceil((tz*4+4)/spacing)+1;iz++){
   for(let ix=Math.floor(tx*4/spacing)-1;ix<=Math.ceil((tx*4+4)/spacing)+1;ix++){
    const x=f((ix+(hash(ix,iz,10)/4294967296-.5)*.76)*spacing),z=f((iz+(hash(ix,iz,11)/4294967296-.5)*.76)*spacing);
    if(Math.floor(x/4)!==tx||Math.floor(z/4)!==tz)continue;candidates++;
    if(placementExclusion?.(x,z)){reject('SHARED_PILOT_OWNER');continue;}
    const s=visibleSurface.ground.sample(x,z);
    if(!s){reject('NO_VISIBLE_TERRAIN');continue;}
    if(!admitGround(x,z,s)){reject('SHARED_GROUND_ADMISSION');continue;}
    const nearbyWeight=nearbyWoodlandComplement(x,s.y,z);
    if(nearbyWeight<=0||hash(ix,iz,15)/4294967296>=nearbyWeight){reject('APPROVED_WOODLAND_OWNER');continue;}
    const water=visibleSurface.water.sample(x,z);
    if(water&&s.y<=water.y+.01){reject('RENDERED_WATER');continue;}
    const a=inverseHEarthGroundCoverPoint(x,s.y,z),m=materialAt(a.x,a.z);
    if(m?.valid!==true||s.slope>.35||!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20)){reject('MATERIAL_OR_SLOPE');continue;}
    if(!woodlandGrassClear(a.x,a.z)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.radius+.03))||trees.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.trunkRadius+.10))){reject('PROTECTED_FOOTPRINT');continue;}
    roots.push({x,y:s.y,z,angle:f(hash(ix,iz,12)/4294967296*Math.PI*2),seed:hash(ix,iz,13),triangleId:s.triangleId,slope:s.slope,owner:s.owner});
    if((candidates&63)===0&&performance.now()-slice>=8){await yieldControl();slice=performance.now();}
   }
   if(performance.now()-slice>=8){await yieldControl();slice=performance.now();}
  }
  roots.sort((a,b)=>a.seed-b.seed||a.z-b.z||a.x-b.x);
  for(const root of roots)Object.freeze(root);Object.freeze(roots);
  if(observe)observe('TILE_BUILD_COMPLETE',()=>({requestRevision:revision,tileId:`NEARBY:${tx}:${tz}`,candidates,rejections,roots:summarizeVegetationRoots(roots,{presentationOwner:'NEARBY'})}));
  return {id:`NEARBY:${tx}:${tz}`,minX:tx*4,minZ:tz*4,roots,candidates,rejections};
 }
 function startBuilder(){
  if(builder)return;
  builder=(async()=>{
   while(latestRequest&&latestRequest.revision!==failedRevision){
    const request=latestRequest;
    // Reuse all completed world tiles immediately. Each request records its
    // own filtered subset, so raw cache eviction cannot cause a rebuild loop.
    for(const descriptor of request.requested){const id=`${descriptor.tx}:${descriptor.tz}`;if(!request.selected.has(id)&&tiles.has(id)){retainSelected(request,tiles.get(id));request.reusedTiles++;}}
    queuePublication(request);
    const next=request.requested.find(tile=>!request.selected.has(`${tile.tx}:${tile.tz}`));
    if(!next)return;
    const tile=await constructTile(next.tx,next.tz,request.revision);
    const id=`${next.tx}:${next.tz}`;tiles.set(id,tile);cachedRoots+=tile.roots.length;
    // Tile construction is absolute-world work, independent of old camera
    // revision. Preserve it, then prioritize the next tile from latest input.
    const current=latestRequest;evict();
    if(current.requested.some(item=>item.tx===next.tx&&item.tz===next.tz)){retainSelected(current,tile);current.builtTiles++;}
    queuePublication(current);
    onProgress({phase:'NEARBY_FINE_GRASS_TILES',completedTiles:current.selected.size,totalTiles:current.requested.length,centerX:current.cx,centerZ:current.cz});
    await yieldControl();
   }
  })().catch(error=>fail(error,latestRequest?.revision??requestRevision)).finally(()=>{builder=null;const request=latestRequest;if(request&&request.revision!==failedRevision&&request.selected.size<request.requested.length)startBuilder();});
 }
 return Object.freeze({update(camera,{coreRadiusMeters=24,outerRadiusMeters=32}={}){
  if(![coreRadiusMeters,outerRadiusMeters].every(Number.isFinite)||coreRadiusMeters<=0||coreRadiusMeters>=outerRadiusMeters||outerRadiusMeters>32)throw Error('NEARBY_FINE_GRASS_RADIUS_INVALID');
  const point=camera?.position??camera;if(!point||![point.x,point.z].every(Number.isFinite))throw Error('NEARBY_FINE_GRASS_CAMERA_INVALID');
  const cx=Math.floor(point.x/4)*4+2,cz=Math.floor(point.z/4)*4+2,key=`${cx}:${cz}:${coreRadiusMeters}:${outerRadiusMeters}`;
  if(latestRequest?.key===key&&latestRequest.revision!==failedRevision){if(completion)return completion;if(lastPresentation?.receipt.key===key&&lastPresentation.receipt.complete)return Promise.resolve(lastPresentation);}
  if(!completion)completion=new Promise((resolve,reject)=>{resolveCompletion=resolve;rejectCompletion=reject;});
  const result=completion;
  if(observe)observe('CACHE_REQUEST',{previousRequestRevision:requestRevision,requestRevision:requestRevision+1,camera:{x:point.x,z:point.z},coreRadiusMeters,outerRadiusMeters,pendingWorker:!!builder});
  const requested=[];for(let tz=Math.floor((cz-outerRadiusMeters)/4);tz<=Math.floor((cz+outerRadiusMeters)/4);tz++)for(let tx=Math.floor((cx-outerRadiusMeters)/4);tx<=Math.floor((cx+outerRadiusMeters)/4);tx++){const distance=tileDistance(tx,tz,cx,cz);if(distance<=outerRadiusMeters)requested.push({tx,tz,distance});}requested.sort((a,b)=>a.distance-b.distance||a.tz-b.tz||a.tx-b.tx);
  if(latestRequest){latestRequest.selected.clear();latestRequest.provisional.clear();}
  latestRequest={revision:++requestRevision,key,cx,cz,coreRadius:coreRadiusMeters,outerRadius:outerRadiusMeters,requested,selected:new Map(),provisional:new Map(),contentRevision:0,contactCount:0,builtTiles:0,reusedTiles:0,evictedTiles:0,evictedRoots:0,started:performance.now()};
  try{seedRequest(latestRequest,lastPresentation);evict();queuePublication(latestRequest);startBuilder();}catch(error){fail(error,latestRequest.revision);}
  return result;
 },getReceipt(){return{requestRevision,key:latestRequest?.key??null,cachedTiles:tiles.size,cachedRoots,maximumRoots,peakCachedRoots,peakRequestRoots,stickyError,errorCount,building:!!builder,publishing:!!publisher,lastPresentation:lastPresentation?.receipt??null};}});
}

export function selectWoodlandFineGrass(presentation,camera,{maximumParents=1024,reusePackedSelection=null}={}){
 if(![camera?.x,camera?.z].every(Number.isFinite))throw Error('WOODLAND_SELECTION_CAMERA_INVALID');
 const capacity=Math.min(1024,Math.max(0,maximumParents|0));
 let c=woodlandSelectionCache.get(presentation);
 if(!c){
  const roots=presentation.tiles.flatMap(t=>t.roots),n=roots.length;
  c={roots,tiles:[],tileIds:[],x:new Float64Array(n),z:new Float64Array(n),u:new Float64Array(n),ranks:new Float64Array(n),distances:new Float64Array(n),eligible:new Uint32Array(n)};
  let i=0;for(const tile of presentation.tiles){const start=i;for(const root of tile.roots){c.x[i]=root.x;c.z[i]=root.z;c.u[i]=fineGrassPriority(root.angle);c.tileIds[i++]=tile.id;}c.tiles.push({x:tile.minX+2,z:tile.minZ+2,nearby:tile.id.startsWith('NEARBY:'),start,end:i});}
  woodlandSelectionCache.set(presentation,c);
 }
 if(!c.supportSquared){c.supportSquared=new Float64Array(c.roots.length);for(let i=0;i<c.u.length;i++){const u=c.u[i];c.supportSquared[i]=u<=.16?Infinity:(8+7*Math.sqrt(-Math.log((u-.16)/.84)))**2;}}
 const cx=Math.fround(camera.x),cz=Math.fround(camera.z);let count=0;
 for(const tile of c.tiles){
  const outer=tile.nearby?FINE_GRASS_CONTINUITY.nearbyOuter:FINE_GRASS_CONTINUITY.woodlandOuter;
  if(Math.hypot(tile.x-camera.x,tile.z-camera.z)>outer+Math.SQRT2*2)continue;
  const options={nearby:tile.nearby,priority:0};
  for(let i=tile.start;i<tile.end;i++){
   const dx=c.x[i]-cx,dz=c.z[i]-cz,d2=dx*dx+dz*dz;if(d2>=outer*outer||d2>c.supportSquared[i]+.000001)continue;
   options.priority=c.u[i];const score=fineGrassImportance(c.roots[i],camera,options);
   if(score<=0)continue;c.ranks[i]=score;c.eligible[count++]=i;
  }
 }
 // Two owner groups need at most 126 padding slots. Keep the existing128-slot reserve.
 const limit=Math.max(0,capacity*64-128),selectedCount=Math.min(limit,count);let cutoff=0;
 if(count>limit&&limit>0){
  // Partition at K+1, not K: the first excluded score rises continuously from0.
  let lo=0,hi=count-1;
  while(lo<hi){const pivot=c.ranks[c.eligible[(lo+hi)>>>1]];let i=lo,j=hi;
   while(i<=j){while(c.ranks[c.eligible[i]]>pivot)i++;while(c.ranks[c.eligible[j]]<pivot)j--;if(i<=j){const t=c.eligible[i];c.eligible[i++]=c.eligible[j];c.eligible[j--]=t;}}
   if(limit<=j)hi=j;else if(limit>=i)lo=i;else break;
  }
  cutoff=Math.fround(c.ranks[c.eligible[limit]]);
 }
 const chosen=Array.from(c.eligible.subarray(0,selectedCount));if(count>limit)chosen.sort((a,b)=>a-b);
 const previous=reusePackedSelection&&woodlandPackedSelectionCache.get(reusePackedSelection);
 if(previous?.presentation===presentation&&previous.capacity===capacity&&previous.chosen.length===chosen.length&&chosen.every((id,i)=>id===previous.chosen[i])){
  const selection={...reusePackedSelection,cutoff};woodlandPackedSelectionCache.set(selection,previous);return selection;
 }
 const packed=[[],[]];
 for(const i of chosen)packed[c.tileIds[i].startsWith('NEARBY:')?1:0].push({root:c.roots[i],tileId:c.tileIds[i]});
 const pixels=new Float32Array(capacity*64*4);for(let i=1;i<pixels.length;i+=4)pixels[i]=-100000;
 const groups=[],chunks=[];let parentCount=0,contactCount=0,vertices=0,triangles=0,persistentContactCount=chosen.reduce((n,i)=>n+Number(c.u[i]<.16),0);
 for(let level=0;level<2;level++){
  const firstParent=parentCount,leafCount=4,list=packed[level];
  for(let i=0;i<list.length;i+=64){const group=list.slice(i,i+64),chunk={tileId:level?'PACKED_NEARBY':'PACKED_WOODLAND',first:i,roots:group.map(x=>x.root),sourceTileIds:[...new Set(group.map(x=>x.tileId))],parent:parentCount,level,nearby:level===1};chunks.push(chunk);
   chunk.roots.forEach((r,k)=>{pixels.set([r.x,r.y,r.z,r.angle],(parentCount*64+k)*4);});parentCount++;contactCount+=chunk.roots.length;
  }
  const n=parentCount-firstParent;if(n){groups.push({level,nearby:level===1,leafCount,firstParent,parentCount:n});vertices+=n*64*leafCount*6;triangles+=n*64*leafCount*4;}
 }
 if(parentCount>capacity)throw Error('WOODLAND_SELECTION_PARENT_CAPACITY_EXCEEDED');
 const selection={pixels:pixels.subarray(0,parentCount*256),groups,chunks,signature:groups.map(g=>`${g.level}:${g.parentCount}`).join(','),cutoff,parentCount,contactCount,persistentContactCount,dynamicContactCount:contactCount-persistentContactCount,vertices,triangles,draws:groups.length};
 woodlandPackedSelectionCache.set(selection,{presentation,capacity,chosen});return selection;
}
export function filterWoodlandLegacyGrass(pkg){
 const original=pkg.buffers.indices,indices=Uint32Array.from(original),positions=pkg.buffers.positions,attributes=pkg.clearingAttributes,span=pkg.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_LANDSCAPE_P2_GRASS');let suppressedTriangles=0;const suppressedTypeCounts={},preservedTypeCounts={};
 if(!span)throw Error('WOODLAND_LEGACY_GRASS_SPAN_MISSING');
 for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){const ids=[original[j],original[j+1],original[j+2]],types=ids.map(i=>attributes[i*3+2]);
  // Retire only the original broad folded grass (types 0/3) everywhere it
  // occurs in this one bounded P2_GRASS primitive. Keep real understory (1)
  // and fallen leaf/litter (2), plus every other geometry span, unchanged.
  const target=types.every(t=>t===types[0])&&(types[0]===0||types[0]===3);
  if(target){indices[j+1]=indices[j];indices[j+2]=indices[j];suppressedTriangles++;suppressedTypeCounts[types[0]]=(suppressedTypeCounts[types[0]]??0)+1;}else preservedTypeCounts[types[0]]=(preservedTypeCounts[types[0]]??0)+1;
 }
 return{indices,receipt:{suppressedTriangles,suppressedTypeCounts,preservedTypeCounts,scope:'P2_GRASS_TYPE_0_OR_3_RETIRED_THROUGHOUT_BOUNDED_P2_PRIMITIVE',originalWorldChanged:false,indexBufferBytes:indices.byteLength,submittedDegenerateTriangles:suppressedTriangles}};
}
export function buildWoodlandFineGrassIndices(){const out=[];for(let leaf=0;leaf<64*4;leaf++){const v=leaf*6;out.push(v,v+1,v+2,v+1,v+3,v+2,v+2,v+3,v+4,v+3,v+5,v+4);}return Uint32Array.from(out);}
export function woodlandFineGrassVertex(root,leaf,leafCount=4){
 const seed=(Math.imul(Math.trunc(Math.fround(root.angle*1000)),1664525)+Math.imul(leaf,747796405))>>>0,r0=(seed&1023)/1023,r1=((seed>>>10)&1023)/1023,r2=((seed>>>20)&1023)/1023,angle=root.angle+leaf*2.399963+r0*.8,h=.22+.18*r1,halfWidth=.010+.006*r2,bend=.06+.09*r2;
 return{angle,h,halfWidth,bend,r0,leaf,leafCount};
}

/** Replacement-only region; legacy ellipse helpers and selection caches stay unchanged. */
async function buildHabitatWoodland(pkg,{visibleSurface,admitGround,habitat,yieldControl,onProgress}){
 if(typeof visibleSurface?.sample!=='function')throw Error('WOODLAND_HABITAT_RENDERED_SURFACE_REQUIRED');
 const started=performance.now(),saved=await decodeVerifiedPlantingRoots(),candidates=[...planWoodlandHabitatCandidates(habitat.woodland??habitat),...saved],tiles=new Map(),rejections={};let accepted=0,woodlandAccepted=0,ravineAccepted=0;
 let packetRoot=false;
 const reject=k=>{if(packetRoot)throw Error('VERIFIED_PLANTING_ROOT_REJECTED:'+k);rejections[k]=(rejections[k]??0)+1;};
 const obstacles=pkg.landscapeCoverFootprints??[],trees=pkg.landscapeFloorFootprints??[];
 for(let i=0;i<candidates.length;i++){
  const candidate=candidates[i],{x,z,ix,iz,region}=candidate;packetRoot=region==='RAVINE';const support=visibleSurface.sample(x,z);
  if(!support){reject('NO_TERRAIN');continue;}
  if(!admitGround(x,z,support)){reject('SHARED_GROUND_ADMISSION');continue;}
  const a=inverseHEarthGroundCoverPoint(x,support.y,z),m=materialAt(a.x,a.z),w=visibleSurface.water.sample(x,z);
  if(w&&support.y<=w.y+.03){reject('WATER');continue;}
  if(m?.valid!==true||habitatSlopeWeight(support.slope,region)<=0||!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20)){reject('MATERIAL_OR_SLOPE');continue;}
  if(!woodlandGrassClear(a.x,a.z)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.radius+.03))||trees.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.trunkRadius+.10))){reject('PROTECTED_FOOTPRINT');continue;}
  const tx=Math.floor(x/4),tz=Math.floor(z/4),id=`${tx}:${tz}`;if(!tiles.has(id))tiles.set(id,{id,minX:tx*4,minZ:tz*4,roots:[]});
  const tile=tiles.get(id);if(tile.roots.length>=WOODLAND_HABITAT.maximumTileRoots)throw Error('WOODLAND_HABITAT_TILE_BUDGET_EXCEEDED');
  if(packetRoot&&Math.abs(Math.fround(support.y)-candidate.y)>2e-5)throw Error('VERIFIED_PLANTING_TERRAIN_CONTACT_CHANGED');
  tile.roots.push({x,y:packetRoot?candidate.y:Math.fround(support.y),z,angle:packetRoot?candidate.angle:Math.fround(habitatHash(ix,iz,3)/4294967296*Math.PI*2),seed:packetRoot?candidate.seed:habitatHash(ix,iz,4),triangleId:support.triangleId,slope:support.slope,...(packetRoot?{region}: {})});accepted++;if(packetRoot)ravineAccepted++;else woodlandAccepted++;
  if((i&1023)===0){onProgress({phase:'WOODLAND_HABITAT_CONTACTS',acceptedContacts:accepted,processedCandidates:i,totalCandidates:candidates.length});await yieldControl();}
 }
 if(woodlandAccepted!==H_EARTH_VERIFIED_PLANTING_PACKET.counts.woodland||ravineAccepted!==H_EARTH_VERIFIED_PLANTING_PACKET.counts.ravine)throw Error('VERIFIED_PLANTING_POPULATION_MISMATCH:'+woodlandAccepted+':'+ravineAccepted);
 const ordered=[...tiles.values()].sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX);for(const tile of ordered)tile.roots.sort((a,b)=>a.seed-b.seed);
 const original={tiles:ordered,receipt:{schema:'H_EARTH_WOODLAND_FINE_GRASS_PRESENTATION_v1',candidateCount:candidates.length,contactCount:accepted,tileCount:ordered.length,rejections,elapsedMilliseconds:performance.now()-started,footprint:WOODLAND_HABITAT,habitat:habitat.receipt,selectionCacheTypedArrayBytes:0,cameraIndependent:true,originalRecordsChanged:false,terrainChanged:false,rootEncoding:'ACTUAL_FLOAT32_TRIANGLE_CONTACTS'}};
 // Supplementary roots use the same actual support, beach and protection rules.
 const acceptRoot=(x,z,region)=>{
  const support=visibleSurface.sample(x,z);if(!support||!admitGround(x,z,support))return null;
  const a=inverseHEarthGroundCoverPoint(x,support.y,z),m=materialAt(a.x,a.z),w=visibleSurface.water.sample(x,z);
  if(w&&support.y<=w.y+.03)return null;
  if(m?.valid!==true||habitatSlopeWeight(support.slope,region)<=0||!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20))return null;
  if(!woodlandGrassClear(a.x,a.z)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.radius+.03))||trees.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.trunkRadius+.10)))return null;
  return support;
 };
 return appendGrassContinuity(original,{habitat,acceptRoot,yieldControl,onProgress});
}

