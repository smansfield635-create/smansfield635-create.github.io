import {LANDSCAPE_COHERENCE_GLSL} from './landscape-coherence-field.v1.js';
import {assertOasisBankBudget,OASIS_BANK_ALLOCATION,oasisBankTiles} from './oasis-bank-field.v1.js';
import {buildCavernEntranceGrass,createEntranceFloorSupport,ENTRANCE_BLEND_GLSL} from './cavern-entrance-grass.v1.js';
import {unprojectPlanetVertex} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
import {takePrecomputedGrassPlan} from './precomputed-grass.v1.js';
import {FOOTHILL_MEADOW_GLSL} from './foothill-meadow-field.v1.js';
import {HILLSIDE_SHORELINE_GLSL} from './hillside-shoreline-field.v1.js';
import {boundGrassTiles,grassFrustumPlanes,selectVisibleGrassTiles,mergeGrassRanges} from './grass-visibility.v2.js';
import {GRASS_CONTINUITY_ALLOCATION as allocation,GRASS_CONTINUITY_CONNECTOR} from './grass-continuity-supplement.v1.js';
import {habitatHash} from './woodland-habitat-field.v1.js';
import {uploadInSlices} from './performance-scheduling.v1.js';
/** Only authenticated original prefixes influence the unchanged runtime planting recipe.
 * Offline continuity additions remain installed but must not suppress saved runtime planting. */
export function runtimePlantingBaselineTiles(tiles){
 return Object.freeze(tiles.flatMap(tile=>{
  const count=tile.baselineCount;
  if(!Number.isInteger(count)||count<0||count>tile.count||!(tile.packed instanceof Float32Array)||tile.packed.length!==tile.count*4)throw Error('RUNTIME_PLANTING_BASELINE_INVALID');
  return count?[Object.freeze({...tile,count,packed:tile.packed.subarray(0,count*4)})]:[];
 }));
}

/** Gen3207: attach existing-blade grass roots along the accepted woodland-to-meadow
 * connector. This is placement data only. The authenticated original tiles, the
 * grass vertex/fragment shaders and the terrain are never changed. */
export async function buildLiveWoodlandSeamBridge({
 existingTiles,visibleSurface,geology,maximumAddedRoots=60000,yieldControl=async()=>{}
}={}){
 if(!Array.isArray(existingTiles)||typeof visibleSurface?.sample!=='function'||
    typeof visibleSurface?.admitGround!=='function'||typeof geology?.sampleWaterAt!=='function'||
    !Number.isSafeInteger(maximumAddedRoots)||maximumAddedRoots<0)throw Error('WOODLAND_SEAM_INPUT_INVALID');
 const max=Math.min(maximumAddedRoots,60000);
 // Reuse the established immutable world-space integer hash for all distribution jitter.
 const hash=(x,z)=>habitatHash(x,z,3207)/4294967296;
 // Prior owner observation is a search anchor, not a claimed first-hit on the
 // latest Android photograph. Find two ACTUAL installed grass stands on dry
 // admitted terrain in this positive-X neighborhood before adding roots.
 const stationB=Object.freeze({x:129.82571460976874,z:-389.03054421247367});
 const bounds=Object.freeze({minX:50,maxX:212,minZ:-495,maxZ:-294});
 const count=new Map(),physical=new Map(),occupied=new Map(),tileKey=(x,z)=>Math.floor(x/4)*4+':'+Math.floor(z/4)*4;
 const cellKey=(x,z)=>Math.floor(x)+':'+Math.floor(z);
 const nearKey=(x,z)=>Math.floor(x/.12)+':'+Math.floor(z/.12);
 const remember=(x,z)=>{const key=nearKey(x,z);let cell=occupied.get(key);if(!cell){cell=[];occupied.set(key,cell);}cell.push([x,z]);};
 const near=(x,z)=>{const a=Math.floor(x/.12),b=Math.floor(z/.12);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)for(const r of occupied.get((a+dx)+':'+(b+dz))??[])
   if(Math.hypot(r[0]-x,r[1]-z)<.085)return true;
  return false;};
 for(const tile of existingTiles){
  if(tile.minX>=bounds.maxX+4||tile.minX+4<=bounds.minX-4||tile.minZ>=bounds.maxZ+4||tile.minZ+4<=bounds.minZ-4)continue;
  const key=tile.minX+':'+tile.minZ;physical.set(key,(physical.get(key)??0)+tile.count);
  for(let i=0;i<tile.packed.length;i+=4){
   const x=tile.packed[i],z=tile.packed[i+2];
   if(x<bounds.minX-2||x>bounds.maxX+2||z<bounds.minZ-2||z>bounds.maxZ+2)continue;
   const k=cellKey(x,z);count.set(k,(count.get(k)??0)+1);remember(x,z);
  }
 }
 // Gen3216 ONE_REPAIR: use installed root occupancy directly; never require
 // an arbitrary pair of grass banks before checking actual eligible ground.
 // This is a prior positive-X observer search region, not a photo first hit.
 const patches=new Map();
 for(const [key,n] of count){
  if(n===0)continue;
  const [x,z]=key.split(':').map(Number);
  if(Math.hypot(x+.5-stationB.x,z+.5-stationB.z)>104)continue;
  const px=Math.floor(x/6),pz=Math.floor(z/6),k=px+':'+pz;
  let p=patches.get(k);if(!p){p={id:k,n:0,x:0,z:0};patches.set(k,p);}
  p.n+=n;p.x+=(x+.5)*n;p.z+=(z+.5)*n;
 }
 const stands=[...patches.values()].filter(p=>p.n>=24).map(p=>({
  id:p.id,n:p.n,x:p.x/p.n,z:p.z/p.n
 })).sort((a,b)=>
  Math.hypot(a.x-stationB.x,a.z-stationB.z)-
  Math.hypot(b.x-stationB.x,b.z-stationB.z)||
  a.id.localeCompare(b.id));
 const sourceCondition={stationB,standBins:stands.length,
  candidateStandPairs:'NOT_REQUIRED_DIRECT_OCCUPANCY_INFILL',
  observedGrassCells:count.size,selectedPair:null,
  photographicFirstHitProven:false,waterAndGroundAdmissionUnmodified:true};
 if(!stands.length)return {tiles:[],receipt:{
  schema:'H_EARTH_EXISTING_GRASS_SEAM_BRIDGE_v1',addedRoots:0,contactCount:0,
  source:'ACTIVE_SINGLE_OWNER_WOODLAND_V1',
  routeAnchor:'PREVIOUS_STATION_B_POSITIVE_X_OCCUPANCY_SEARCH',spineAnchors:[],bounds,sourceCondition,
  failureCode:'NO_SOURCE_OBSERVED_POSITIVE_X_GRASS_OCCUPANCY',
  maximumAddedRoots:max,originalRootsPreserved:true,grassAppearanceChanged:false,
  shaderMaterialOrTerrainChanged:false,worldSupportAndGroundAdmissionRequired:true,
  screenshotSeamWorldCoordinatesUnproven:true,ownerVisualAcceptance:'PENDING'}};
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{const t=clamp(x);return t*t*(3-2*t);};
 const field=(x,z,scale,salt)=>{
  const u=x/scale,v=z/scale,ix=Math.floor(u),iz=Math.floor(v),a=smooth(u-ix),b=smooth(v-iz);
  const h=(dx,dz)=>hash(ix+dx+salt,iz+dz-salt);
  return (h(0,0)*(1-a)+h(1,0)*a)*(1-b)+(h(0,1)*(1-a)+h(1,1)*a)*b;
 };
 // Occupancy-driven transition axis through all authenticated nearby grass
 // groups. No arbitrary two-bank pairing, geometric gap threshold, or pre-gate.
 // Candidate roots still face the unchanged real ground/water/footprint admission.
 const weights=stands.map(p=>Math.min(p.n,180));
 const weightSum=weights.reduce((n,v)=>n+v,0);
 const center=stands.reduce((v,p,i)=>({x:v.x+p.x*weights[i],z:v.z+p.z*weights[i]}),{x:0,z:0});
 center.x/=weightSum;center.z/=weightSum;
 let varX=0,varZ=0,cross=0;
 for(let i=0;i<stands.length;i++){
  const dx=stands[i].x-center.x,dz=stands[i].z-center.z,w=weights[i];
  varX+=w*dx*dx;varZ+=w*dz*dz;cross+=w*dx*dz;
 }
 const theta=.5*Math.atan2(2*cross,varX-varZ),ux=Math.cos(theta),uz=Math.sin(theta);
 const projection=p=>(p.x-center.x)*ux+(p.z-center.z)*uz;
 const standPositions=stands.map(projection);
 let minAlong=Math.min(...standPositions)-7,maxAlong=Math.max(...standPositions)+7;
 if(maxAlong-minAlong<38){const mid=(maxAlong+minAlong)/2;minAlong=mid-19;maxAlong=mid+19;}
 sourceCondition.infillCenter={x:center.x,z:center.z};
 sourceCondition.infillAxis={ux,uz,minAlong,maxAlong,widthMeters:14};
 sourceCondition.standExtent={
  minX:Math.min(...stands.map(p=>p.x)),maxX:Math.max(...stands.map(p=>p.x)),
  minZ:Math.min(...stands.map(p=>p.z)),maxZ:Math.max(...stands.map(p=>p.z))};
 // The previous narrow footprint left a wide bare middle. Cover the bounded
 // dry corridor linking observed roots to the owner's prior positive-X camera
 // search region; observer position is NOT asserted to be a terrain first hit.
 // The source-observed grass-axis envelope remains included at its origin.
 const corridorX=stationB.x-center.x,corridorZ=stationB.z-center.z;
 const corridorLength=Math.hypot(corridorX,corridorZ);
 const dirX=corridorX/corridorLength,dirZ=corridorZ/corridorLength;
 sourceCondition.corridorSearch={
  origin:{x:center.x,z:center.z},
  towardPriorObserver:{x:stationB.x,z:stationB.z},
  lengthMeters:corridorLength,priorObserverNotGroundHit:true,
  sourceDerivedGrassConnection:true,finalPhotoCorrespondenceUnproven:true};
 const proposed=[];
 for(let cz=bounds.minZ;cz<bounds.maxZ;cz++)for(let cx=bounds.minX;cx<bounds.maxX;cx++){
  const x=cx+.5,z=cz+.5,dx=x-center.x,dz=z-center.z;
  const along=dx*ux+dz*uz,lateral=Math.abs(-dx*uz+dz*ux);
  const patch=.52*field(x,z,5,47)+.48*field(x,z,12,71);
  const originalWidth=11+7*field(x,z,19,81);
  const originalFeather=(along>=minAlong&&along<=maxAlong&&lateral<=originalWidth)
   ?(1-smooth((lateral-3)/Math.max(1,originalWidth-3)))*(.72+.28*patch):0;
  const forward=dx*dirX+dz*dirZ,side=Math.abs(-dx*dirZ+dz*dirX);
  // Full continuous corridor envelope, tapered to existing planted edges.
  const width=7.5+2.5*field(x,z,17,93);
  const inCorridor=forward>=-7&&forward<=corridorLength+5&&side<=width;
  const longitudinal=inCorridor?
    smooth(Math.min((forward+7)/10,(corridorLength+5-forward)/10)):0;
  const corridorFeather=inCorridor?
    (1-smooth((side-2)/Math.max(1,width-2)))*(.66+.34*patch)*(.75+.25*longitudinal):0;
  const coverage=Math.max(originalFeather,corridorFeather);
  if(coverage<=.08)continue;
  const before=count.get(cellKey(x,z))??0;
  if(before>22)continue; // Already dense grass remains untouched.
  const target=Math.floor(36*Math.min(1,coverage+.14));
  if(target<=before)continue;
  const edge=Math.min(cx-bounds.minX,bounds.maxX-cx,cz-bounds.minZ,bounds.maxZ-cz);
  if(edge<2)continue;
  // Interleave eight longitudinal sectors so the entire eligible corridor
  // gets its first planting pass before any local densification.
  const sector=Math.max(0,Math.min(7,Math.floor(8*clamp(forward/corridorLength))));
  const gapPriority=before<=2?.74:.2;
  proposed.push({cx,cz,target,sector,before,
   priority:coverage+gapPriority+.06*hash(cx+117,cz-57)});
 }
 sourceCondition.sparseCandidateCells=proposed.length;
 sourceCondition.occupancyAxisMode='SOURCE_GRASS_TO_PRIOR_OBSERVER_DRY_CORRIDOR_WITH_SOURCE_AXIS';
 if(!proposed.length)return {tiles:[],receipt:{
  schema:'H_EARTH_EXISTING_GRASS_SEAM_BRIDGE_v1',addedRoots:0,contactCount:0,
  source:'ACTIVE_SINGLE_OWNER_WOODLAND_V1',
  routeAnchor:'PREVIOUS_STATION_B_POSITIVE_X_OCCUPANCY_SEARCH',spineAnchors:[],bounds,sourceCondition,
  failureCode:'NO_OCCUPANCY_DRIVEN_SPARSE_CELLS_FOUND',
  maximumAddedRoots:max,originalRootsPreserved:true,grassAppearanceChanged:false,
  shaderMaterialOrTerrainChanged:false,worldSupportAndGroundAdmissionRequired:true,
  screenshotSeamWorldCoordinatesUnproven:true,ownerVisualAcceptance:'PENDING'}};
 // Interleave every accepted connection segment before spending the bounded
 // root budget; a dense patch at one end must not starve the other regions.
 const groups=Array.from({length:8},()=>[]);
 for(const cell of proposed)groups[cell.sector].push(cell);
 for(const group of groups)group.sort((a,b)=>b.priority-a.priority||a.cz-b.cz||a.cx-b.cx);
 const order=[];for(let i=0;i<Math.max(...groups.map(g=>g.length));i++)for(const group of groups)if(group[i])order.push(group[i]);
 let added=0,candidates=0;
 const filledCellKeys=new Set();
 const rejected={terrain:0,slope:0,groundAdmission:0,water:0,duplicate:0,tileCapacity:0};
 const tiles=new Map();
 // Level every eligible corridor sector before spending the remaining root
 // allowance on denser clumps. The user-requested broad coverage takes
 // priority over a locally perfect-looking patch.
 for(const passCap of [8,18,36]){
  for(const cell of order){
   if(added>=max)break;
   const {cx,cz,target}=cell,desired=Math.min(passCap,target);
   const localKey=cx+':'+cz;let have=count.get(localKey)??0,cellAdded=0;
   if(have>=desired)continue;
   for(let k=0;k<36&&have<desired&&added<max;k++){
    const j=(k*17)%36,ix=j%6,iz=Math.floor(j/6);
    const x=Math.fround(cx+(ix+.14+.72*hash(cx*89+ix,cz*97+iz))/6);
    const z=Math.fround(cz+(iz+.14+.72*hash(cx*101+iz,cz*103+ix))/6);
    candidates++;
    if(near(x,z)){rejected.duplicate++;continue;}
    const hit=visibleSurface.sample(x,z);
    if(!hit||!Number.isFinite(hit.y)||!Number.isFinite(hit.slope)){rejected.terrain++;continue;}
    if(hit.slope>1.05){rejected.slope++;continue;}
    if(!visibleSurface.admitGround(x,z,hit)){rejected.groundAdmission++;continue;}
    const local=unprojectPlanetVertex(x,hit.y,z),water=geology.sampleWaterAt(local.x,local.z);
    if(water&&water.y>local.y+.04){rejected.water++;continue;}
    const key=tileKey(x,z),already=physical.get(key)??0;
    if(already>=1600){rejected.tileCapacity++;continue;}
    const minX=Math.floor(x/4)*4,minZ=Math.floor(z/4)*4,id='WOODLAND_SEAM_BRIDGE:'+key;
    if(!tiles.has(id))tiles.set(id,{id,minX,minZ,roots:[]});
    tiles.get(id).roots.push({x,y:Math.fround(hit.y),z,
     angle:hash(cx*109+k,cz*113+k)*Math.PI*2,
     seed:(Math.imul(cx*127+k,73856093)^Math.imul(cz*131+k,19349663))>>>0,
     slope:hit.slope,triangleId:hit.triangleId,region:'WOODLAND_SEAM_BRIDGE',support:hit.owner});
    physical.set(key,already+1);remember(x,z);have++;cellAdded++;added++;
   }
   if(cellAdded){filledCellKeys.add(localKey);count.set(localKey,have);}
   if(added%256<cellAdded)await yieldControl();
  }
  if(added>=max)break;
 }
 const cellsFilled=filledCellKeys.size;
 sourceCondition.coveragePasses=[8,18,36];
 sourceCondition.cellsWithNewGrass=cellsFilled;
 sourceCondition.rootAllowanceUsed=added;
 const receipt={schema:'H_EARTH_EXISTING_GRASS_SEAM_BRIDGE_v1',addedRoots:added,source:'ACTIVE_SINGLE_OWNER_WOODLAND_V1',
   routeAnchor:'PREVIOUS_STATION_B_POSITIVE_X_OCCUPANCY_INFILL',spineAnchors:[],bounds,sourceCondition,
   candidateCells:proposed.length,cellsFilled,candidates,rejected,maximumAddedRoots:max,
   originalRootsPreserved:true,grassAppearanceChanged:false,shaderMaterialOrTerrainChanged:false,
   worldSupportAndGroundAdmissionRequired:true,rootGeometry:'ORIGINAL_SINGLE_OWNER_UNCHANGED',
   screenshotSeamWorldCoordinatesUnproven:true,ownerVisualAcceptance:'PENDING'};
 return {tiles:[...tiles.values()],receipt:{...receipt,contactCount:added}};
}

/** Gen3225 experimental broad dryland placement. A second pass after the exact published seam. Original roots, shaders, geometry and groundwater admission remain unchanged. Not owner-accepted or published. */
export async function buildWideExistingGrassTrial({
 existingTiles,visibleSurface,geology,maximumAddedRoots=500000,yieldControl=async()=>{}
}={}){
 if(!Array.isArray(existingTiles)||typeof visibleSurface?.sample!=='function'||
    typeof visibleSurface?.admitGround!=='function'||typeof geology?.sampleWaterAt!=='function'||
    !Number.isSafeInteger(maximumAddedRoots)||maximumAddedRoots<0)throw Error('WOODLAND_SEAM_INPUT_INVALID');
 const max=Math.min(maximumAddedRoots,500000);
 // Reuse the established immutable world-space integer hash for all distribution jitter.
 const hash=(x,z)=>habitatHash(x,z,3225)/4294967296;
 // Prior owner observation is a search anchor, not a claimed first-hit on the
 // latest Android photograph. Find two ACTUAL installed grass stands on dry
 // admitted terrain in this positive-X neighborhood before adding roots.
 const stationB=Object.freeze({x:129.82571460976874,z:-389.03054421247367});
 const bounds=Object.freeze({minX:40,maxX:230,minZ:-535,maxZ:-260});
 const count=new Map(),physical=new Map(),occupied=new Map(),tileKey=(x,z)=>Math.floor(x/4)*4+':'+Math.floor(z/4)*4;
 const cellKey=(x,z)=>Math.floor(x)+':'+Math.floor(z);
 const nearKey=(x,z)=>Math.floor(x/.12)+':'+Math.floor(z/.12);
 const remember=(x,z)=>{const key=nearKey(x,z);let cell=occupied.get(key);if(!cell){cell=[];occupied.set(key,cell);}cell.push([x,z]);};
 const near=(x,z)=>{const a=Math.floor(x/.12),b=Math.floor(z/.12);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)for(const r of occupied.get((a+dx)+':'+(b+dz))??[])
   if(Math.hypot(r[0]-x,r[1]-z)<.085)return true;
  return false;};
 for(const tile of existingTiles){
  if(tile.minX>=bounds.maxX+4||tile.minX+4<=bounds.minX-4||tile.minZ>=bounds.maxZ+4||tile.minZ+4<=bounds.minZ-4)continue;
  const key=tile.minX+':'+tile.minZ;physical.set(key,(physical.get(key)??0)+tile.count);
  for(let i=0;i<tile.packed.length;i+=4){
   const x=tile.packed[i],z=tile.packed[i+2];
   if(x<bounds.minX-2||x>bounds.maxX+2||z<bounds.minZ-2||z>bounds.maxZ+2)continue;
   const k=cellKey(x,z);count.set(k,(count.get(k)??0)+1);remember(x,z);
  }
 }
 // Gen3225 BROAD_EXPERIMENT: use installed root occupancy directly; never require
 // an arbitrary pair of grass banks before checking actual eligible ground.
 // This is a prior positive-X observer search region, not a photo first hit.
 const patches=new Map();
 for(const [key,n] of count){
  if(n===0)continue;
  const [x,z]=key.split(':').map(Number);
  if(Math.hypot(x+.5-stationB.x,z+.5-stationB.z)>104)continue;
  const px=Math.floor(x/6),pz=Math.floor(z/6),k=px+':'+pz;
  let p=patches.get(k);if(!p){p={id:k,n:0,x:0,z:0};patches.set(k,p);}
  p.n+=n;p.x+=(x+.5)*n;p.z+=(z+.5)*n;
 }
 const stands=[...patches.values()].filter(p=>p.n>=24).map(p=>({
  id:p.id,n:p.n,x:p.x/p.n,z:p.z/p.n
 })).sort((a,b)=>
  Math.hypot(a.x-stationB.x,a.z-stationB.z)-
  Math.hypot(b.x-stationB.x,b.z-stationB.z)||
  a.id.localeCompare(b.id));
 const sourceCondition={stationB,standBins:stands.length,
  candidateStandPairs:'NOT_REQUIRED_DIRECT_OCCUPANCY_INFILL',
  observedGrassCells:count.size,selectedPair:null,
  photographicFirstHitProven:false,waterAndGroundAdmissionUnmodified:true};
 if(!stands.length)return {tiles:[],receipt:{
  schema:'H_EARTH_WIDE_EXISTING_GRASS_TRIAL_v1',addedRoots:0,contactCount:0,
  source:'ACTIVE_SINGLE_OWNER_WOODLAND_V1',
  routeAnchor:'SOURCE_OBSERVED_BROAD_DRYLAND_SEARCH',spineAnchors:[],bounds,sourceCondition,
  failureCode:'NO_SOURCE_OBSERVED_POSITIVE_X_GRASS_OCCUPANCY',
  maximumAddedRoots:max,originalRootsPreserved:true,grassAppearanceChanged:false,
  shaderMaterialOrTerrainChanged:false,worldSupportAndGroundAdmissionRequired:true,
  screenshotSeamWorldCoordinatesUnproven:true,ownerVisualAcceptance:'PENDING_NEW_EXPERIMENT'}};
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{const t=clamp(x);return t*t*(3-2*t);};
 const field=(x,z,scale,salt)=>{
  const u=x/scale,v=z/scale,ix=Math.floor(u),iz=Math.floor(v),a=smooth(u-ix),b=smooth(v-iz);
  const h=(dx,dz)=>hash(ix+dx+salt,iz+dz-salt);
  return (h(0,0)*(1-a)+h(1,0)*a)*(1-b)+(h(0,1)*(1-a)+h(1,1)*a)*b;
 };
 // Occupancy-driven transition axis through all authenticated nearby grass
 // groups. No arbitrary two-bank pairing, geometric gap threshold, or pre-gate.
 // Candidate roots still face the unchanged real ground/water/footprint admission.
 const weights=stands.map(p=>Math.min(p.n,180));
 const weightSum=weights.reduce((n,v)=>n+v,0);
 const center=stands.reduce((v,p,i)=>({x:v.x+p.x*weights[i],z:v.z+p.z*weights[i]}),{x:0,z:0});
 center.x/=weightSum;center.z/=weightSum;
 let varX=0,varZ=0,cross=0;
 for(let i=0;i<stands.length;i++){
  const dx=stands[i].x-center.x,dz=stands[i].z-center.z,w=weights[i];
  varX+=w*dx*dx;varZ+=w*dz*dz;cross+=w*dx*dz;
 }
 const theta=.5*Math.atan2(2*cross,varX-varZ),ux=Math.cos(theta),uz=Math.sin(theta);
 const projection=p=>(p.x-center.x)*ux+(p.z-center.z)*uz;
 const standPositions=stands.map(projection);
 let minAlong=Math.min(...standPositions)-7,maxAlong=Math.max(...standPositions)+7;
 if(maxAlong-minAlong<38){const mid=(maxAlong+minAlong)/2;minAlong=mid-19;maxAlong=mid+19;}
 sourceCondition.infillCenter={x:center.x,z:center.z};
 sourceCondition.infillAxis={ux,uz,minAlong,maxAlong,widthMeters:80};
 sourceCondition.standExtent={
  minX:Math.min(...stands.map(p=>p.x)),maxX:Math.max(...stands.map(p=>p.x)),
  minZ:Math.min(...stands.map(p=>p.z)),maxZ:Math.max(...stands.map(p=>p.z))};
 // The published narrow footprint left a wider bare landscape. Cover the bounded
 // dry corridor linking observed roots to the owner's prior positive-X camera
 // search region; observer position is NOT asserted to be a terrain first hit.
 // The source-observed grass-axis envelope remains included at its origin.
 const corridorX=stationB.x-center.x,corridorZ=stationB.z-center.z;
 const corridorLength=Math.hypot(corridorX,corridorZ);
 const dirX=corridorX/corridorLength,dirZ=corridorZ/corridorLength;
 sourceCondition.corridorSearch={
  origin:{x:center.x,z:center.z},
  towardPriorObserver:{x:stationB.x,z:stationB.z},
  lengthMeters:corridorLength,priorObserverNotGroundHit:true,
  sourceDerivedGrassConnection:true,finalPhotoCorrespondenceUnproven:true};
 const proposed=[];
 for(let cz=bounds.minZ;cz<bounds.maxZ;cz++)for(let cx=bounds.minX;cx<bounds.maxX;cx++){
  const x=cx+.5,z=cz+.5,dx=x-center.x,dz=z-center.z;
  const along=dx*ux+dz*uz,lateral=Math.abs(-dx*uz+dz*ux);
  const patch=.52*field(x,z,5,47)+.48*field(x,z,12,71);
  const originalWidth=24+16*field(x,z,23,81);
  const originalFeather=(along>=minAlong&&along<=maxAlong&&lateral<=originalWidth)
   ?(1-smooth((lateral-3)/Math.max(1,originalWidth-3)))*(.72+.28*patch):0;
  const forward=dx*dirX+dz*dirZ,side=Math.abs(-dx*dirZ+dz*dirX);
  // Broad regional trial footprint, tapered to existing planted edges.
  const width=36+18*field(x,z,27,93);
  const inCorridor=forward>=-7&&forward<=corridorLength+5&&side<=width;
  const longitudinal=inCorridor?
    smooth(Math.min((forward+7)/10,(corridorLength+5-forward)/10)):0;
  const corridorFeather=inCorridor?
    (1-smooth((side-2)/Math.max(1,width-2)))*(.66+.34*patch)*(.75+.25*longitudinal):0;
  // Source-root distance provides a broad ecological footprint rather than
  // relying on a photo-inferred ground hit or an arbitrary narrow corridor.
  let nearest=Infinity;for(const stand of stands)nearest=Math.min(nearest,Math.hypot(x-stand.x,z-stand.z));
  const reach=1-smooth((nearest-12)/95);
  const organic=.48*field(x,z,21,281)+.52*field(x,z,8,317);
  const regionalFeather=(.20+.60*reach)*smooth((organic-.18)/.65);
  const coverage=Math.max(originalFeather,corridorFeather,regionalFeather);
  if(coverage<=.08)continue;
  const before=count.get(cellKey(x,z))??0;
  if(before>22)continue; // Already dense grass remains untouched.
  const target=Math.floor(36*Math.min(1,coverage+.14));
  if(target<=before)continue;
  const edge=Math.min(cx-bounds.minX,bounds.maxX-cx,cz-bounds.minZ,bounds.maxZ-cz);
  if(edge<2)continue;
  // Interleave eight longitudinal sectors so the entire eligible corridor
  // gets its first planting pass before any local densification.
  const sector=Math.max(0,Math.min(7,Math.floor(8*clamp(forward/corridorLength))));
  const gapPriority=before<=2?.74:.2;
  proposed.push({cx,cz,target,sector,before,
   priority:coverage+gapPriority+.06*hash(cx+117,cz-57)});
 }
 sourceCondition.sparseCandidateCells=proposed.length;
 sourceCondition.occupancyAxisMode='SOURCE_GRASS_TO_WIDE_ADMITTED_DRYLAND_WITH_ORGANIC_FEATHER';
 if(!proposed.length)return {tiles:[],receipt:{
  schema:'H_EARTH_WIDE_EXISTING_GRASS_TRIAL_v1',addedRoots:0,contactCount:0,
  source:'ACTIVE_SINGLE_OWNER_WOODLAND_V1',
  routeAnchor:'SOURCE_OBSERVED_BROAD_DRYLAND_SEARCH',spineAnchors:[],bounds,sourceCondition,
  failureCode:'NO_OCCUPANCY_DRIVEN_SPARSE_CELLS_FOUND',
  maximumAddedRoots:max,originalRootsPreserved:true,grassAppearanceChanged:false,
  shaderMaterialOrTerrainChanged:false,worldSupportAndGroundAdmissionRequired:true,
  screenshotSeamWorldCoordinatesUnproven:true,ownerVisualAcceptance:'PENDING_NEW_EXPERIMENT'}};
 // Interleave every accepted connection segment before spending the bounded
 // root budget; a dense patch at one end must not starve the other regions.
 const groups=Array.from({length:8},()=>[]);
 for(const cell of proposed)groups[cell.sector].push(cell);
 for(const group of groups)group.sort((a,b)=>b.priority-a.priority||a.cz-b.cz||a.cx-b.cx);
 const order=[];for(let i=0;i<Math.max(...groups.map(g=>g.length));i++)for(const group of groups)if(group[i])order.push(group[i]);
 let added=0,candidates=0;
 let nextWideYieldAt=performance.now()+20;
 const filledCellKeys=new Set();
 const rejected={terrain:0,slope:0,groundAdmission:0,water:0,duplicate:0,tileCapacity:0};
 const tiles=new Map();
 // Level every eligible corridor sector before spending the remaining root
 // allowance on denser clumps. The user-requested broad coverage takes
 // priority over a locally perfect-looking patch.
 for(const passCap of [8,18,36]){
  for(const cell of order){
   if(added>=max)break;
   const {cx,cz,target}=cell,desired=Math.min(passCap,target);
   const localKey=cx+':'+cz;let have=count.get(localKey)??0,cellAdded=0;
   if(have>=desired)continue;
   for(let k=0;k<36&&have<desired&&added<max;k++){
    const j=(k*17)%36,ix=j%6,iz=Math.floor(j/6);
    const x=Math.fround(cx+(ix+.14+.72*hash(cx*89+ix,cz*97+iz))/6);
    const z=Math.fround(cz+(iz+.14+.72*hash(cx*101+iz,cz*103+ix))/6);
    candidates++;
    if(near(x,z)){rejected.duplicate++;continue;}
    const hit=visibleSurface.sample(x,z);
    if(!hit||!Number.isFinite(hit.y)||!Number.isFinite(hit.slope)){rejected.terrain++;continue;}
    if(hit.slope>1.05){rejected.slope++;continue;}
    if(!visibleSurface.admitGround(x,z,hit)){rejected.groundAdmission++;continue;}
    const local=unprojectPlanetVertex(x,hit.y,z),water=geology.sampleWaterAt(local.x,local.z);
    if(water&&water.y>local.y+.04){rejected.water++;continue;}
    const key=tileKey(x,z),already=physical.get(key)??0;
    if(already>=1600){rejected.tileCapacity++;continue;}
    const minX=Math.floor(x/4)*4,minZ=Math.floor(z/4)*4,id='WIDE_GRASS_TRIAL:'+key;
    if(!tiles.has(id))tiles.set(id,{id,minX,minZ,roots:[]});
    tiles.get(id).roots.push({x,y:Math.fround(hit.y),z,
     angle:hash(cx*109+k,cz*113+k)*Math.PI*2,
     seed:(Math.imul(cx*127+k,73856093)^Math.imul(cz*131+k,19349663))>>>0,
     slope:hit.slope,triangleId:hit.triangleId,region:'WIDE_GRASS_TRIAL',support:hit.owner});
    physical.set(key,already+1);remember(x,z);have++;cellAdded++;added++;
   }
   if(cellAdded){filledCellKeys.add(localKey);count.set(localKey,have);}
   if(added%256<cellAdded&&performance.now()>=nextWideYieldAt){await yieldControl();nextWideYieldAt=performance.now()+20;}
  }
  if(added>=max)break;
 }
 const cellsFilled=filledCellKeys.size;
 sourceCondition.coveragePasses=[8,18,36];
 sourceCondition.cellsWithNewGrass=cellsFilled;
 sourceCondition.rootAllowanceUsed=added;
 const receipt={schema:'H_EARTH_WIDE_EXISTING_GRASS_TRIAL_v1',addedRoots:added,source:'ACTIVE_SINGLE_OWNER_WOODLAND_V1',
   routeAnchor:'SOURCE_OBSERVED_BROAD_DRYLAND_DENSIFICATION',spineAnchors:[],bounds,sourceCondition,
   candidateCells:proposed.length,cellsFilled,candidates,rejected,maximumAddedRoots:max,
   originalRootsPreserved:true,grassAppearanceChanged:false,shaderMaterialOrTerrainChanged:false,
   worldSupportAndGroundAdmissionRequired:true,rootGeometry:'ORIGINAL_SINGLE_OWNER_UNCHANGED',
   screenshotSeamWorldCoordinatesUnproven:true,ownerVisualAcceptance:'PENDING_NEW_EXPERIMENT'};
 return {tiles:[...tiles.values()],receipt:{...receipt,contactCount:added}};
}

/** Extend only the existing ravine atlas from the roots actually installed.
 * Empty, wet and unsupported texels cannot gain soil; old coverage never falls. */
export function buildCavernGrassSoilHabitat(habitat,baseTiles,addition,{eligibleAt}={}){
 const {size,width,height,ravine}=habitat??{},bounds=ravine?.bounds;
 const density=habitat?.receipt?.grassContinuity?.reference?.density;
 if(!Number.isInteger(size)||width!==size*3||height!==size||habitat.pixels?.length!==width*height||bounds?.length!==4||!(density>0)||typeof eligibleAt!=='function')throw Error('CAVERN_SOIL_HABITAT_LAYOUT');
 const [x0,z0,x1,z1]=bounds,dx=(x1-x0)/size,dz=(z1-z0)/size;
 if(!(dx>0&&dz>0))throw Error('CAVERN_SOIL_HABITAT_BOUNDS');
 const cell=(x,z)=>x<x0||x>=x1||z<z0||z>=z1?-1:Math.floor((z-z0)/dz)*size+Math.floor((x-x0)/dx);
 const counts=new Map();let additionRoots=0;
 for(const tile of addition.tiles)for(const root of tile.roots){const i=cell(root.x,root.z);if(i<0)throw Error('CAVERN_SOIL_ROOT_OUTSIDE_ATLAS');counts.set(i,(counts.get(i)??0)+1);additionRoots++;}
 // Count existing cover only in cells touched by the accepted addition.
 for(const tile of baseTiles)for(let k=0;k<tile.packed.length;k+=4){const i=cell(tile.packed[k],tile.packed[k+2]);if(counts.has(i))counts.set(i,counts.get(i)+1);}
 const pixels=new Uint8Array(habitat.pixels);let raisedTexels=0,rejectedTexels=0;
 for(const [i,count] of counts){const x=i%size,z=Math.floor(i/size),px=x0+(x+.5)*dx,pz=z0+(z+.5)*dz;
  if(!eligibleAt(px,pz)){rejectedTexels++;continue;}
  const offset=z*width+size+x,value=Math.round(255*Math.min(1,count/(density*dx*dz)));
  if(value>pixels[offset]){pixels[offset]=value;raisedTexels++;}
 }
 const cavernGrassSoil={schema:'H_EARTH_CAVERN_GRASS_SOIL_CONTINUITY_v1',additionRoots,touchedTexels:counts.size,raisedTexels,rejectedTexels,referenceDensity:density,coverageSource:'ACTUAL_INSTALLED_ROOT_OCCUPANCY_WITH_DRY_TRIANGLE_SUPPORT',existingCoverageNeverReduced:true,otherAtlasPanelsPreserved:true,rootBytesChanged:false};
 return {...habitat,pixels,receipt:{...habitat.receipt,cavernGrassSoil}};
}
/** Isolated woodland prototype. One immutable population; detail adds lobes, never removes cover. */
export function detailWeight(distance){
 if(!Number.isFinite(distance)||distance<0)throw Error('DETAIL_DISTANCE_INVALID');
 const t=Math.max(0,Math.min(1,(distance-14)/10));return 1-t*t*(3-2*t);
}
export function planImmutableTiles(presentation){
 if(!Array.isArray(presentation?.tiles))throw Error('POPULATION_INVALID');
 const ids=new Set(),tileIds=new Set();let first=0,woodlandRoots=0,ravineRoots=0;
 const tiles=presentation.tiles.map(tile=>{
  if(typeof tile.id!=='string'||tileIds.has(tile.id)||![tile.minX,tile.minZ].every(Number.isFinite)||!Array.isArray(tile.roots))throw Error('TILE_INVALID');
  if(tile.roots.length>1600)throw Error('TILE_ROOT_BUDGET_EXCEEDED');
  tileIds.add(tile.id);const packed=new Float32Array(tile.roots.length*4),rootIds=[];
  tile.roots.forEach((root,i)=>{
   if(![root.x,root.y,root.z,root.angle,root.seed,root.slope].every(Number.isFinite)||![root.x,root.y,root.z,root.angle].every(v=>Number.isFinite(Math.fround(v))))throw Error('ROOT_NONFINITE');
   if(root.x<tile.minX||root.x>=tile.minX+4||root.z<tile.minZ||root.z>=tile.minZ+4)throw Error('ROOT_OUTSIDE_TILE');
   const id=`${Math.fround(root.x)}:${Math.fround(root.y)}:${Math.fround(root.z)}:${root.seed}`;
   if(ids.has(id))throw Error('ROOT_DUPLICATE');ids.add(id);rootIds.push(id);
   if((root.region==='RAVINE'||root.region==='RAVINE_SUPPLEMENT'))ravineRoots++;else woodlandRoots++;
   if(woodlandRoots>allocation.maximumWoodlandRoots)throw Error('POPULATION_GPU_BUDGET_EXCEEDED');
   if(ravineRoots>allocation.maximumRavineRoots)throw Error('RAVINE_ROOT_BUDGET_EXCEEDED');
   packed.set([root.x,root.y,root.z,root.angle],i*4);
  });
  const result=Object.freeze({id:tile.id,minX:tile.minX,minZ:tile.minZ,rootIds:Object.freeze(rootIds),packed,count:rootIds.length,first});first+=result.count;if(first>allocation.maximumRoots||first*16>allocation.maximumPackedBytes)throw Error('POPULATION_GPU_BUDGET_EXCEEDED');return result;
 });
 if(!first)throw Error('EMPTY_WOODLAND_POPULATION');if(presentation.receipt?.contactCount!==first)throw Error('POPULATION_COUNT_MISMATCH');return Object.freeze(tiles);
}
export function selectFineTiles(tiles,camera){
 if(![camera?.x,camera?.z].every(Number.isFinite))throw Error('CAMERA_INVALID');
 return tiles.filter(tile=>Math.hypot(Math.max(tile.minX-camera.x,0,camera.x-tile.minX-4),Math.max(tile.minZ-camera.z,0,camera.z-tile.minZ-4))<24);
}
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec4 aRoot;
uniform mat4 uViewProjection;
uniform vec3 uCamera;
uniform float uRadius;
uniform int uFine;
out vec3 vNormal;out vec3 vColor;out float vDistance;
${LANDSCAPE_COHERENCE_GLSL}
${FOOTHILL_MEADOW_GLSL}
${HILLSIDE_SHORELINE_GLSL}
${ENTRANCE_BLEND_GLSL}
void main(){
 float d=length(aRoot.xz-uCamera.xz),t=clamp((d-14.)/10.,0.,1.);
 float detail=1.-t*t*(3.-2.*t),h=fract(sin(dot(aRoot.xz,vec2(12.9898,78.233)))*43758.5453);
 vec3 up=normalize(vec3(aRoot.x,aRoot.y+uRadius,aRoot.z));
 // Fixed per-root tuft irregularity: no new roots, camera-dependent sway, or extra draw.
 float tuftVariation=fract(sin(dot(aRoot.xz,vec2(29.321,51.773)))*19735.283);
 float angle=aRoot.w+float(uFine)*(1.5707963+.24*(tuftVariation-.5));
 vec3 across=normalize(vec3(cos(angle),0.,sin(angle)));across=normalize(across-up*dot(up,across));
 int k=gl_VertexID%6;
 float side=(k==0||k==3||k==5)?-1.:1.;
 float level=(k==2||k==4||k==5)?1.:0.;
 float scale=uFine==1?detail:1.;
 // Fuller persistent blades connect the near crossed tuft to the far coarse cover.
 // Same two triangles and unchanged 14-24 m fine-lobe fade.
 float width=mix(.010,.016,h)*scale*mix(1.18,1.42,tuftVariation);
 // Local entrance growth affects existing and supplemental roots alike.
 float core=(1.-smoothstep(10.,12.,abs(aRoot.x-40.)))*smoothstep(-293.,-287.,aRoot.z)*(1.-smoothstep(-259.,-257.8,aRoot.z));
 float entrance=max(core,entranceBlend(aRoot.xz));
 float shoulders=smoothstep(1.6,5.,abs(aRoot.x-40.));
 float mouthBanks=(1.-smoothstep(.7,2.5,abs(abs(aRoot.x-40.)-3.8)))*(1.-smoothstep(2.,7.,abs(aRoot.z+262.)));
 float entranceHeight=mix(mix(mix(.30,.48,h),mix(.58,.88,h),shoulders),mix(1.15,1.65,h),mouthBanks);
 float height=mix(mix(.11,.21,h),entranceHeight,entrance)*scale;
 vec3 p=aRoot.xyz+up*(.003+level*height)+across*(side*width*(1.-level*.81));
 p+=vec3(sin(angle),0.,-cos(angle))*level*level*mix(.025,height*mix(.12,.30,h),entrance)*scale;
 gl_Position=uViewProjection*vec4(p,1.);vNormal=up;
 // One world-space palette for existing grass and occupied ground.
 float foothillDry=max(foothillDryAmount(aRoot.xyz,uRadius),hillsideDry(aRoot.xyz));
 vec3 palette=landscapeCoverPalette(aRoot.xz,foothillDry);
 palette=mix(palette,vec3(.29,.255,.12),smoothstep(.78,.99,h)*.34);
 vColor=palette*(.78+level*.40)*(.88+.24*h);vDistance=length(p-uCamera);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNormal;in vec3 vColor;in float vDistance;
uniform vec3 uSunDirection;uniform vec3 uSunColor;uniform vec3 uHaze;
uniform float uSunIntensity;uniform float uFogStart;uniform float uFogFalloff;uniform float uMaxFog;
out vec4 outColor;
void main(){float lit=.48+.52*max(0.,dot(normalize(vNormal),normalize(uSunDirection)));vec3 color=vColor*(vec3(.5)+uSunColor*lit*uSunIntensity*.5);float fog=min(uMaxFog,1.-exp(-max(0.,vDistance-uFogStart)*uFogFalloff));color=mix(color,uHaze,fog);outColor=vec4(pow(max(color,vec3(0.)),vec3(1./2.2)),1.);}`;
export async function createSingleOwnerVegetation(gl,presentation,{environment,planetRadius,yieldControl=async()=>{},onProgress=()=>{},uploadBudget={},entranceGrass=null}={}){
 if(!environment||!Number.isFinite(planetRadius))throw Error('OWNER_ENVIRONMENT_REQUIRED');
 const started=performance.now(),trusted=takePrecomputedGrassPlan(presentation),globalTiles=trusted?.tiles??planImmutableTiles(presentation);
 const originalRootCount=globalTiles.reduce((n,t)=>n+t.count,0),bankTiles=trusted?oasisBankTiles(originalRootCount):[],oasisRoots=bankTiles.reduce((n,t)=>n+t.count,0),baseTiles=Object.freeze([...globalTiles,...bankTiles]),baseRootCount=originalRootCount+oasisRoots;
 let tiles=baseTiles,entranceReceipt=null,woodlandSeamReceipt=null,wideGrassTrialReceipt=null,habitat=presentation.habitat;
 if(entranceGrass){
  if(!trusted)throw Error('ENTRANCE_GRASS_REQUIRES_AUTHENTICATED_BASELINE');
  const addition=await buildCavernEntranceGrass({...entranceGrass,existingTiles:runtimePlantingBaselineTiles(baseTiles),yieldControl});
  const extra=planImmutableTiles(addition).map(t=>Object.freeze({...t,first:t.first+baseRootCount}));
  const cavernAdded=extra.reduce((n,t)=>n+t.count,0);
  const remaining=Math.max(0,allocation.maximumRoots-(baseRootCount-oasisRoots)-cavernAdded);
  const seam=await buildLiveWoodlandSeamBridge({existingTiles:baseTiles,visibleSurface:entranceGrass.visibleSurface,
    geology:entranceGrass.geology,maximumAddedRoots:Math.min(60000,remaining),yieldControl});
  const seamExtra=seam.tiles.length?planImmutableTiles(seam).map(t=>Object.freeze({...t,first:t.first+baseRootCount+cavernAdded})):[];
  const seamRoots=seamExtra.reduce((n,t)=>n+t.count,0);
  const wideRemaining=Math.max(0,allocation.maximumRoots-(baseRootCount-oasisRoots)-cavernAdded-seamRoots);
  const wide=await buildWideExistingGrassTrial({existingTiles:[...baseTiles,...extra,...seamExtra],
   visibleSurface:entranceGrass.visibleSurface,geology:entranceGrass.geology,
   maximumAddedRoots:Math.min(500000,wideRemaining),yieldControl,onProgress});
  const wideExtra=wide.tiles.length?planImmutableTiles(wide).map(t=>Object.freeze({...t,first:t.first+baseRootCount+cavernAdded+seamRoots})):[];
  tiles=Object.freeze([...baseTiles,...extra,...seamExtra,...wideExtra]);
  entranceReceipt=addition.receipt;woodlandSeamReceipt=seam.receipt;wideGrassTrialReceipt=wide.receipt;
  const floor=createEntranceFloorSupport(entranceGrass.geology);
  habitat=buildCavernGrassSoilHabitat(habitat,baseTiles,addition,{eligibleAt:(x,z)=>{
   const hit=floor.sample(x,z)??entranceGrass.visibleSurface.sample(x,z);
   if(!hit||hit.slope>1.35)return false;
   const local=unprojectPlanetVertex(x,hit.y,z),water=entranceGrass.geology.sampleWaterAt(local.x,local.z);
   return !water||water.y<=local.y+.04;
  }});
 }
 const rootCount=tiles.reduce((n,t)=>n+t.count,0);
 assertOasisBankBudget(rootCount-oasisRoots,oasisRoots,allocation);
 const controlRoots=trusted?.controlRoots??[];if(!trusted)for(const tile of tiles)tile.rootIds.forEach((id,i)=>{if(Math.hypot(tile.packed[i*4]+139.40267987050615,tile.packed[i*4+2]+194.5)<=2)controlRoots.push(id);});
 if(!controlRoots.length)throw Error('EMPTY_FIXED_CONTROL');
 const ownedShaders=[];let program=null,vao=null,buffer=null;
 function cleanup(){if(buffer)gl.deleteBuffer(buffer);if(vao)gl.deleteVertexArray(vao);if(program)gl.deleteProgram(program);for(const shader of ownedShaders)gl.deleteShader(shader);}
 try{

 function graphicsError(code,stage,log){const lost=gl.isContextLost?.()===true;return Error(`${lost?'OWNER_CONTEXT_LOST':code}:${stage}:${String(log??'').trim()||'NO_DRIVER_LOG'}`);}
 function assertContext(stage){if(gl.isContextLost?.()===true)throw graphicsError('OWNER_CONTEXT_LOST',stage);}
 function shader(type,source){
  const stage=type===gl.VERTEX_SHADER?'VERTEX':'FRAGMENT';assertContext(stage);
  const s=gl.createShader(type);if(!s)throw graphicsError('OWNER_SHADER_ALLOCATION',stage);
  ownedShaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw graphicsError('OWNER_SHADER_COMPILE',stage,gl.getShaderInfoLog(s));
  assertContext(stage);return s;
 }
 assertContext('PROGRAM');program=gl.createProgram();if(!program)throw graphicsError('OWNER_PROGRAM_ALLOCATION','PROGRAM');
 gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw graphicsError('OWNER_LINK','PROGRAM',gl.getProgramInfoLog(program));
 assertContext('LINKED');
 const gpuRequestedBytes=rootCount*16;
 vao=gl.createVertexArray();buffer=gl.createBuffer();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,gpuRequestedBytes,gl.STATIC_DRAW);
 const gpuObservedBufferBytes=gl.getBufferParameter(gl.ARRAY_BUFFER,gl.BUFFER_SIZE),allocationGlError=gl.getError();
 assertContext('BUFFER_ALLOCATION');
 if(allocationGlError!==gl.NO_ERROR)throw graphicsError('OWNER_BUFFER_ALLOCATION_GL_ERROR','BUFFER_ALLOCATION',allocationGlError);
 if(gpuObservedBufferBytes!==gpuRequestedBytes)throw graphicsError('OWNER_BUFFER_SIZE_MISMATCH','BUFFER_ALLOCATION',`${gpuObservedBufferBytes}/${gpuRequestedBytes}`);
 let gpuUploadCount=1,gpuUploadedBytes=0;
 const uploadScheduling=await uploadInSlices(tiles,{...uploadBudget,yieldControl,onProgress,upload:tile=>{gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,tile.first*16,tile.packed);gpuUploadCount++;gpuUploadedBytes+=tile.packed.byteLength;}});
 const uploadGlError=gl.getError();assertContext('BUFFER_UPLOAD');
 if(uploadGlError!==gl.NO_ERROR)throw graphicsError('OWNER_BUFFER_UPLOAD_GL_ERROR','BUFFER_UPLOAD',uploadGlError);
 if(gpuUploadedBytes!==gpuRequestedBytes)throw graphicsError('OWNER_BUFFER_UPLOAD_SIZE_MISMATCH','BUFFER_UPLOAD',`${gpuUploadedBytes}/${gpuRequestedBytes}`);
 gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);gl.vertexAttribDivisor(0,1);
 const u=Object.fromEntries(['uViewProjection','uCamera','uRadius','uFine','uSunDirection','uSunColor','uHaze','uSunIntensity','uFogStart','uFogFalloff','uMaxFog'].map(n=>[n,gl.getUniformLocation(program,n)]));
 const rgb=value=>{const a=Array.isArray(value)?value.slice(0,3):[value.r,value.g,value.b],scale=a.some(v=>v>1)?255:1;return a.map(v=>v/scale);};
 gl.useProgram(program);const e=environment;gl.uniform1f(u.uRadius,planetRadius);gl.uniform3f(u.uSunDirection,e.sunDirection.x,e.sunDirection.y,e.sunDirection.z);gl.uniform3fv(u.uSunColor,rgb(e.sunColor));gl.uniform3fv(u.uHaze,rgb(e.groundHazeColor));gl.uniform1f(u.uSunIntensity,e.sunIntensity);gl.uniform1f(u.uFogStart,e.fogStartDistance);gl.uniform1f(u.uFogFalloff,e.fogFalloff);gl.uniform1f(u.uMaxFog,e.maximumFogFactor);
 const visibilityBounds=boundGrassTiles(tiles);
 let disposed=false,lastDraw={visibleCoarseRoots:0,selectedFineRoots:0,drawCallCount:0,submittedTriangles:0,perFrameUploadBytes:0};const preparationMs=performance.now()-started;
 function draw(packet){
  if(disposed)throw Error('OWNER_DISPOSED');const cpuStarted=performance.now();const camera=packet.camera.position,frustum=grassFrustumPlanes(packet.camera.viewProjectionMatrix),visible=selectVisibleGrassTiles(visibilityBounds,frustum.planes),fine=selectFineTiles(visible,camera);
  gl.useProgram(program);gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.uniformMatrix4fv(u.uViewProjection,false,frustum.matrix);gl.uniform3f(u.uCamera,camera.x,camera.y,camera.z);gl.uniform1i(u.uFine,0);
  let visibleCoarseRoots=0,selectedFineRoots=0,drawCallCount=0;
  for(const range of mergeGrassRanges(visible)){gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,range.first*16);gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count);drawCallCount++;visibleCoarseRoots+=range.count;}
  gl.uniform1i(u.uFine,1);
  for(const range of mergeGrassRanges(fine)){gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,range.first*16);gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count);drawCallCount++;selectedFineRoots+=range.count;}
  lastDraw={cpuDrawSubmissionMilliseconds:performance.now()-cpuStarted,visibleCoarseRoots,selectedFineRoots,drawCallCount,submittedTriangles:(visibleCoarseRoots+selectedFineRoots)*2,perFrameUploadBytes:0,coarseTiles:visible.length,culledTiles:tiles.length-visible.length,fineTiles:fine.length};return {...lastDraw};
 }
 function getReceipt(){return {schema:'H_EARTH_SINGLE_OWNER_WOODLAND_v1',scope:'APPROVED_WOODLAND_AND_MEASURED_RAVINE_NOT_WHOLE_WORLD',entranceGrass:entranceReceipt,woodlandSeamBridge:woodlandSeamReceipt,wideGrassTrial:wideGrassTrialReceipt,originalRootCount,installedRootCount:rootCount,coarseRootCount:rootCount,rootOwnerCount:1,generationCount:1,ownedObjectCounts:{programs:1,shaders:2,vertexArrays:1,buffers:1,textures:0},maximumRoots:allocation.maximumRoots+OASIS_BANK_ALLOCATION.maximumRoots,globalMaximumRoots:allocation.maximumRoots,oasisRoots,oasisAllocation:OASIS_BANK_ALLOCATION,maximumWoodlandRoots:allocation.maximumWoodlandRoots,maximumRavineRoots:allocation.maximumRavineRoots,maximumPackedBytes:allocation.maximumPackedBytes+OASIS_BANK_ALLOCATION.maximumPackedBytes,globalMaximumPackedBytes:allocation.maximumPackedBytes,maximumTileRoots:1600,tileCount:tiles.length,uploadScheduling,gpuUploadCount,gpuUploadedBytes,gpuAllocatedBytes:gpuObservedBufferBytes,gpuRequestedBytes,gpuObservedBufferBytes,allocationGlError,uploadGlError,gpuAllocationVerified:true,cpuDrawTimingScope:'CPU_CULLING_AND_DRAW_SUBMISSION_EXCLUDES_GPU_EXECUTION',preparationMs,controlRoots:[...controlRoots],coarseCoverPolicy:'ALL_POTENTIALLY_VISIBLE_ROOTS_CONSERVATIVE_FRUSTUM',finePolicy:'SECOND_LOBE_SAME_ROOTS_SMOOTH_14_TO_24_METERS',...lastDraw,disposed};}
 function dispose(){if(disposed)return;disposed=true;cleanup();}
 return Object.freeze({draw,getReceipt,dispose,habitat});
 }catch(error){cleanup();throw error;}
}

