/** Gen3485 P9 native material-specific central hillside cover.
 * Five genuine low leaves per new root, not a terrain color/shader fake.
 * All previous P3/P4/P6/P7/P8 populations are immutable inputs.
 */
export const P9_UPLAND_ALLOCATION=Object.freeze({maximumRoots:110000,maximumPackedBytes:1760000,maximumTileRoots:1600});
export const P9_UPLAND_FOOTPRINT=Object.freeze({minX:-38,maxX:152,minZ:-235,maxZ:-95});
export const P9_UPLAND_MATERIAL=Object.freeze({
 allowedClasses:Object.freeze(['COASTAL_SOIL','STONE_AND_SPARSE_SOIL']),
 coastalSoilMinDepth:.16,stoneSoilMinDepth:.035,rockExposureMax:.86,
 slopeMax:1.12,sandCoverageMax:.12,minimumWaterClearance:.15
});
const f=Math.fround;
const hash=(x,z,salt)=>{
 let h=Math.imul(x+8192,73856093)^Math.imul(z+8192,19349663)^Math.imul(salt+1,83492791);
 h=Math.imul(h^(h>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);
 return ((h^(h>>>16))>>>0)/4294967296;
};
const smooth=x=>x*x*(3-2*x);
function field(x,z,scale,salt){
 const xx=x/scale,zz=z/scale,ix=Math.floor(xx),iz=Math.floor(zz);
 const tx=smooth(xx-ix),tz=smooth(zz-iz);
 const a=hash(ix,iz,salt),b=hash(ix+1,iz,salt),c=hash(ix,iz+1,salt),d=hash(ix+1,iz+1,salt);
 return ((a*(1-tx)+b*tx)*(1-tz)+(c*(1-tx)+d*tx)*tz);
}
const tileKey=(x,z)=>Math.floor(x/4)*4+':'+Math.floor(z/4)*4;
const segmentDistance=(x,z,ax,az,bx,bz)=>{
 const dx=bx-ax,dz=bz-az,denom=dx*dx+dz*dz;
 const t=denom?Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/denom)):0;
 return Math.hypot(x-ax-t*dx,z-az-t*dz);
};
const protectedEstate=(x,z)=>
 Math.hypot(x-80,z+172)<31||
 Math.hypot(x+139.40268,z+210.74617)<44||
 segmentDistance(x,z,48,-144,0,-96)<6.5;

/** The contact callback MUST use the existing actual WebGL terrain and Run8C material.
 * This planner cannot manufacture a dry soil witness or bypass the callback.
 */
export async function planP9NativeUplandMats({
 installedTiles,p4BankTiles,p6DryTiles,p8SandTiles,admitNativeUplandContact,
 maximumAddedRoots=110000,yieldControl=async()=>{}
}={}){
 if(![installedTiles,p4BankTiles,p6DryTiles,p8SandTiles].every(Array.isArray)||
    typeof admitNativeUplandContact!=='function'||typeof yieldControl!=='function'||
    !Number.isInteger(maximumAddedRoots)||maximumAddedRoots<0)
  throw Error('P9_UPLAND_INPUT_INVALID');
 const max=Math.min(maximumAddedRoots,P9_UPLAND_ALLOCATION.maximumRoots);
 const {minX,maxX,minZ,maxZ}=P9_UPLAND_FOOTPRINT;
 const existingCells=new Map(),occupiedTiles=new Map(),buckets=new Map(),proposals=new Map();
 const bucket=(x,z)=>Math.floor(x*5)+':'+Math.floor(z*5);
 function remember(x,z){const key=bucket(x,z);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push([x,z]);}
 function near(x,z){
  const bx=Math.floor(x*5),bz=Math.floor(z*5);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)
   for(const p of buckets.get((bx+dx)+':'+(bz+dz))??[])
    if((p[0]-x)**2+(p[1]-z)**2<.145**2)return true;
  return false;
 }
 let protectedRootsObserved=0;
 for(const tile of [...installedTiles,...p4BankTiles,...p6DryTiles,...p8SandTiles]){
  if(!tile||!Number.isInteger(tile.count)||tile.count<0||
     !(tile.packed instanceof Float32Array)||tile.packed.length!==tile.count*4||
     !Number.isFinite(tile.minX)||!Number.isFinite(tile.minZ))
   throw Error('P9_PROTECTED_TILE_INVALID');
  if(tile.minX>=maxX||tile.minX+4<=minX||tile.minZ>=maxZ||tile.minZ+4<=minZ)continue;
  for(let i=0;i<tile.packed.length;i+=4){
   const x=tile.packed[i],z=tile.packed[i+2];
   if(x<minX||x>=maxX||z<minZ||z>=maxZ)continue;
   const cell=Math.floor(x)+':'+Math.floor(z),key=tileKey(x,z);
   existingCells.set(cell,(existingCells.get(cell)??0)+1);
   occupiedTiles.set(key,(occupiedTiles.get(key)??0)+1);
   remember(x,z);protectedRootsObserved++;
  }
 }
 const rejected={patch:0,protectedArea:0,occupied:0,tileCapacity:0,nativeMaterialOrGround:0};
 const materialCounts={COASTAL_SOIL:0,STONE_AND_SPARSE_SOIL:0};
 let added=0,contactTrials=0,cellsFilled=0,processed=0;
 // Stable scrambled order avoids row-major exhaustion concentrating roots on one side.
 const candidateCells=[];
 for(let cz=minZ;cz<maxZ;cz++)for(let cx=minX;cx<maxX;cx++){
  const broad=field(cx+.5,cz+.5,29,5101),local=field(cx+.5,cz+.5,9.5,5102);
  const coherence=broad*.62+local*.38;
  if(coherence<.37){rejected.patch++;continue;}
  candidateCells.push({cx,cz,coherence,order:hash(cx,cz,5103)});
 }
 candidateCells.sort((a,b)=>a.order-b.order||a.cz-b.cz||a.cx-b.cx);
 for(const {cx,cz,coherence} of candidateCells){
  if(added>=max)break;
  const c=cx+':'+cz,prior=existingCells.get(c)??0;
  if(protectedEstate(cx+.5,cz+.5)){rejected.protectedArea++;continue;}
  if(prior>=14){rejected.occupied++;continue;}
  const quota=Math.max(5,Math.min(17,Math.floor(6+coherence*13+hash(cx,cz,5104)*3)));
  let acceptedCell=0;
  for(let k=0;k<quota&&added<max;k++){
   const x=f(cx+.075+.85*hash(cx,cz,5200+k*3));
   const z=f(cz+.075+.85*hash(cx,cz,5201+k*3));
   if(near(x,z)){rejected.occupied++;continue;}
   const t=tileKey(x,z);
   if((occupiedTiles.get(t)??0)>=P9_UPLAND_ALLOCATION.maximumTileRoots){rejected.tileCapacity++;continue;}
   contactTrials++;
   const hit=admitNativeUplandContact(x,z);
   if(!hit||!Number.isFinite(hit.y)||!Number.isFinite(hit.slope)||
      hit.slope>P9_UPLAND_MATERIAL.slopeMax||
      !P9_UPLAND_MATERIAL.allowedClasses.includes(hit.materialClass)||
      !Number.isFinite(hit.soilDepth)||!Number.isFinite(hit.rockExposure)||
      hit.rockExposure>P9_UPLAND_MATERIAL.rockExposureMax||
      hit.soilDepth<(hit.materialClass==='STONE_AND_SPARSE_SOIL'?
        P9_UPLAND_MATERIAL.stoneSoilMinDepth:P9_UPLAND_MATERIAL.coastalSoilMinDepth)){
    rejected.nativeMaterialOrGround++;continue;
   }
   if(!proposals.has(t))proposals.set(t,{id:'P9_UPLAND:'+t,
      minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,values:[],rootIds:[]});
   const tile=proposals.get(t);
   const angle=hash(cx,cz,5202+k*3)*Math.PI*2;
   // Negative angle is P9-only immutable rock-mat species tag. Older root formats untouched.
   const packedAngle=hit.materialClass==='STONE_AND_SPARSE_SOIL'?f(-angle-.01):f(angle);
   tile.values.push(x,f(hit.y),z,packedAngle);
   tile.rootIds.push('P9:'+x+':'+z+':'+k);
   materialCounts[hit.materialClass]++;
   existingCells.set(c,(existingCells.get(c)??0)+1);
   occupiedTiles.set(t,(occupiedTiles.get(t)??0)+1);
   remember(x,z);acceptedCell++;added++;
  }
  if(acceptedCell)cellsFilled++;
  if((++processed%384)===0)await yieldControl();
 }
 let first=0;
 const tiles=[...proposals.values()].sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX).map(t=>{
  const {values,rootIds,...rest}=t,count=values.length/4;
  const result=Object.freeze({...rest,count,first,packed:Float32Array.from(values),rootIds:Object.freeze(rootIds)});
  first+=count;return result;
 });
 if(first!==added||added>max||added*16>P9_UPLAND_ALLOCATION.maximumPackedBytes)
  throw Error('P9_UPLAND_GPU_BUDGET');
 return Object.freeze({tiles:Object.freeze(tiles),receipt:Object.freeze({
  schema:'H_EARTH_P9_NATIVE_UPLAND_SOIL_ROCK_MAT_v1',
  footprint:P9_UPLAND_FOOTPRINT,material:P9_UPLAND_MATERIAL,
  addedRoots:added,addedGpuBytes:added*16,maximumAddedRoots:max,
  materialRootCounts:Object.freeze({...materialCounts}),
  contactTrials,cellsFilled,protectedRootsObserved,rejected:Object.freeze({...rejected}),
  ownerOriginalPopulationsUnchanged:true,rootMaterialWitnessRequired:true,
  nativeVisibleGroundAndWaterRequired:true,p8DrySandProtectionRequired:true,visualGainNotInferred:true
 })});
}
