/** P8 Gen3483: physically separate, native-sampled dry-sand riparian sedges.
 * P6 rejects rendered sand >0.12; NEVER alter its admission policy or roots.
 * P8 only targets actually exposed sandy ground with independently proven dry contact.
 */
export const P8_SEDGE_ALLOCATION=Object.freeze({maximumRoots:80000,maximumPackedBytes:1280000,maximumTileRoots:1600});
export const P8_SEDGE_FOOTPRINT=Object.freeze({minX:-160,maxX:34,minZ:-185,maxZ:-113});
export const P8_SEDGE_MATERIAL=Object.freeze({sandMinExclusive:.12,sandMaxInclusive:1,slopeMax:.70,minimumWaterClearance:.15,minimumExposedContact:.75});
const hash=(x,z,salt)=>{
 let h=Math.imul(x+8192,73856093)^Math.imul(z+8192,19349663)^Math.imul(salt+1,83492791);
 h=Math.imul(h^(h>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);
 return ((h^(h>>>16))>>>0)/4294967296;
};
const tileKey=(x,z)=>Math.floor(x/4)*4+':'+Math.floor(z/4)*4;
const distanceToSegment=(x,z,ax,az,bx,bz)=>{
 const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
 return Math.hypot(x-ax-t*dx,z-az-t*dz);
};
export async function planP8NativeDrySandSedges({
 installedTiles,p4BankTiles,p6DryTiles,admitDrySandContact,
 maximumAddedRoots=80000,yieldControl=async()=>{}
}={}){
 if(!Array.isArray(installedTiles)||!Array.isArray(p4BankTiles)||!Array.isArray(p6DryTiles)||
 typeof admitDrySandContact!=='function'||typeof yieldControl!=='function'||
 !Number.isInteger(maximumAddedRoots)||maximumAddedRoots<0)
  throw Error('P8_DRY_SAND_INPUT_INVALID');
 const target=Math.min(maximumAddedRoots,P8_SEDGE_ALLOCATION.maximumRoots),bounds=P8_SEDGE_FOOTPRINT;
 const {minX,maxX,minZ,maxZ}=bounds;
 const existingCells=new Map(),tileOccupancy=new Map(),buckets=new Map(),proposed=new Map();
 const bucket=(x,z)=>Math.floor(x*4)+':'+Math.floor(z*4);
 function remember(x,z){const k=bucket(x,z);if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push([x,z]);}
 function nearby(x,z){const bx=Math.floor(x*4),bz=Math.floor(z*4);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)for(const p of buckets.get((bx+dx)+':'+(bz+dz))??[])
   if((p[0]-x)**2+(p[1]-z)**2<.13**2)return true;
  return false;
 }
 let originalRootsObserved=0;
 for(const tile of [...installedTiles,...p4BankTiles,...p6DryTiles]){
  if(!tile||!(tile.packed instanceof Float32Array)||!Number.isInteger(tile.count)||
  tile.count<0||tile.packed.length!==tile.count*4||
  !Number.isFinite(tile.minX)||!Number.isFinite(tile.minZ))
   throw Error('P8_PROTECTED_TILE_INVALID');
  if(tile.minX>=maxX||tile.minX+4<=minX||tile.minZ>=maxZ||tile.minZ+4<=minZ)continue;
  for(let i=0;i<tile.packed.length;i+=4){
   const x=tile.packed[i],z=tile.packed[i+2];
   if(x<minX||x>=maxX||z<minZ||z>=maxZ)continue;
   const c=Math.floor(x)+':'+Math.floor(z),t=tileKey(x,z);
   existingCells.set(c,(existingCells.get(c)??0)+1);
   tileOccupancy.set(t,(tileOccupancy.get(t)??0)+1);
   remember(x,z);originalRootsObserved++;
  }
 }
 const rejected={patch:0,protectedArea:0,occupied:0,tileCapacity:0,contact:0};
 let accepted=0,contactTrials=0,cellsFilled=0;
 for(let cz=minZ;cz<maxZ&&accepted<target;cz++){
  for(let cx=minX;cx<maxX&&accepted<target;cx++){
   const key=cx+':'+cz,existing=existingCells.get(key)??0;
   if(existing>=14){rejected.occupied++;continue;}
   const xCenter=cx+.5,zCenter=cz+.5;
   if(Math.hypot(xCenter-80,zCenter+172)<31||
      Math.hypot(xCenter+139.40268,zCenter+210.74617)<44||
      distanceToSegment(xCenter,zCenter,48,-144,0,-96)<6.5){
    rejected.protectedArea++;continue;
   }
   // Coherent variation in sandy stands without changing any terrain material.
   const patch=.55*hash(cx,cz,41)+.45*hash(Math.floor(cx/6),Math.floor(cz/6),42);
   if(patch<.13){rejected.patch++;continue;}
   const quota=10+(hash(cx,cz,43)>.65?3:0);
   let cellAdded=0;
   for(let k=0;k<quota&&accepted<target;k++){
    const x=Math.fround(cx+.08+.84*hash(cx,cz,50+k*3));
    const z=Math.fround(cz+.08+.84*hash(cx,cz,51+k*3));
    if(nearby(x,z)){rejected.occupied++;continue;}
    const t=tileKey(x,z);
    if((tileOccupancy.get(t)??0)>=P8_SEDGE_ALLOCATION.maximumTileRoots){rejected.tileCapacity++;continue;}
    contactTrials++;
    const hit=admitDrySandContact(x,z);
    if(!hit||hit.sandDryContact!==true||!Number.isFinite(hit.y)||
      !Number.isFinite(hit.slope)||hit.slope>P8_SEDGE_MATERIAL.slopeMax){
     rejected.contact++;continue;
    }
    if(!proposed.has(t))proposed.set(t,{id:'P8_TRUE_DRY_SAND:'+t,
      minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,values:[],rootIds:[]});
    const tile=proposed.get(t);
    tile.values.push(x,Math.fround(hit.y),z,Math.fround(hash(cx,cz,52+k*3)*Math.PI*2));
    tile.rootIds.push('P8:'+x+':'+z+':'+k);
    existingCells.set(key,(existingCells.get(key)??0)+1);
    tileOccupancy.set(t,(tileOccupancy.get(t)??0)+1);
    remember(x,z);accepted++;cellAdded++;
   }
   if(cellAdded)cellsFilled++;
  }
  if((cz-minZ)%8===0)await yieldControl();
 }
 let first=0;
 const tiles=[...proposed.values()].sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX).map(t=>{
  const {values,rootIds,...rest}=t,count=values.length/4;
  const obj=Object.freeze({...rest,count,first,packed:Float32Array.from(values),rootIds:Object.freeze(rootIds)});
  first+=count;return obj;
 });
 if(first!==accepted||accepted>target||accepted*16>P8_SEDGE_ALLOCATION.maximumPackedBytes)
  throw Error('P8_DRY_SAND_GPU_BUDGET_EXCEEDED');
 return Object.freeze({tiles:Object.freeze(tiles),receipt:Object.freeze({
  schema:'H_EARTH_P8_NATIVE_EXPOSED_DRY_SAND_SEDGE_v1',addedRoots:accepted,
  addedGpuBytes:accepted*16,maximumAddedRoots:target,footprint:bounds,material:P8_SEDGE_MATERIAL,
  sourceRootPopulationsUnchanged:true,independentNativeBeachAndWaterContact:true,
  originalRootsObserved,contactTrials,cellsFilled,rejected,
  nativeSandGreaterThanP6ExclusionRequired:true,actualWaterClearanceRequired:true,
  visualGainNotInferred:true
 })});
}
