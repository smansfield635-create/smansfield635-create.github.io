/** H-Earth P6 Gen3471: bounded physical grass at authentic dry bank/foothill contacts.
 * P3 and P4 root arrays are read-only; this is a separate, local-offset channel.
 * All terrain, water and beach decisions come from the existing native surfaces.
 */
export const P6_ECOTONE_ALLOCATION=Object.freeze({
 maximumRoots:60000,maximumPackedBytes:960000,maximumTileRoots:1600
});
export const P6_ECOTONE_FOOTPRINT=Object.freeze({minX:-160,maxX:80,minZ:-218,maxZ:-108});
const hash=(x,z,salt)=>{
 let h=Math.imul(x+8192,73856093)^Math.imul(z+8192,19349663)^Math.imul(salt+1,83492791);
 h=Math.imul(h^(h>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);
 return ((h^(h>>>16))>>>0)/4294967296;
};
const tileKey=(x,z)=>Math.floor(x/4)+':'+Math.floor(z/4);
const distanceToSegment=(x,z,ax,az,bx,bz)=>{
 const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
 return Math.hypot(x-ax-t*dx,z-az-t*dz);
};
export async function planP6DryEcotone({
 installedTiles,p4BankTiles,admitDryContact,maximumAddedRoots=60000,yieldControl=async()=>{}
}={}){
 if(!Array.isArray(installedTiles)||!Array.isArray(p4BankTiles)||
   typeof admitDryContact!=='function'||typeof yieldControl!=='function'||
   !Number.isInteger(maximumAddedRoots)||maximumAddedRoots<0)
  throw Error('P6_ECOTONE_INPUT_INVALID');
 const target=Math.min(maximumAddedRoots,P6_ECOTONE_ALLOCATION.maximumRoots);
 const {minX,maxX,minZ,maxZ}=P6_ECOTONE_FOOTPRINT;
 const physical=new Map(),cells=new Map(),buckets=new Map();
 const bucketKey=(x,z)=>Math.floor(x*5)+':'+Math.floor(z*5);
 function remember(x,z){
  const bx=Math.floor(x*5),bz=Math.floor(z*5),key=bx+':'+bz;
  if(!buckets.has(key))buckets.set(key,[]);
  buckets.get(key).push([x,z]);
 }
 function near(x,z){
  const bx=Math.floor(x*5),bz=Math.floor(z*5);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)
   for(const [px,pz] of buckets.get((bx+a)+':'+(bz+b))??[])
    if((x-px)**2+(z-pz)**2<0.085**2)return true;
  return false;
 }
 let protectedRootsObserved=0;
 for(const tile of [...installedTiles,...p4BankTiles]){
  if(!tile||!(tile.packed instanceof Float32Array)||!Number.isInteger(tile.count)||
    tile.count<0||tile.packed.length!==tile.count*4||
    !Number.isFinite(tile.minX)||!Number.isFinite(tile.minZ))
   throw Error('P6_ECOTONE_INSTALLED_TILE_INVALID');
  if(tile.minX>=maxX||tile.minX+4<=minX||tile.minZ>=maxZ||tile.minZ+4<=minZ)continue;
  for(let i=0;i<tile.packed.length;i+=4){
   const x=tile.packed[i],z=tile.packed[i+2];
   if(x<minX||x>=maxX||z<minZ||z>=maxZ)continue;
   const cell=Math.floor(x)+':'+Math.floor(z),tileId=tileKey(x,z);
   cells.set(cell,(cells.get(cell)??0)+1);
   physical.set(tileId,(physical.get(tileId)??0)+1);
   remember(x,z);protectedRootsObserved++;
  }
 }
 const proposed=new Map(),rejected={patch:0,occupied:0,tileCapacity:0,contact:0,protectedArea:0};
 let admitted=0,trials=0,cellsFilled=0;
 for(let cz=minZ;cz<maxZ&&admitted<target;cz++){
  for(let cx=minX;cx<maxX&&admitted<target;cx++){
   // Existing physical roots already fill healthy habitat; never replant it.
   const key=cx+':'+cz,existing=cells.get(key)??0;
   if(existing>=16){rejected.occupied++;continue;}
   // Preserve estate/manor, woodland control and the known approach corridor.
   const xCenter=cx+.5,zCenter=cz+.5;
   if(Math.hypot(xCenter-80,zCenter+172)<31||
      Math.hypot(xCenter+139.40268,zCenter+210.74617)<44||
      distanceToSegment(xCenter,zCenter,48,-144,0,-96)<6.5){
    rejected.protectedArea++;continue;
   }
   // Nonrectilinear cover: deterministic open earth breaks and soft foothill fringe.
   const soilPatch=0.62*hash(cx,cz,16)+0.38*hash(Math.floor(cx/7),Math.floor(cz/7),17);
   const outer=Math.max(0,cx-54,-145-cx,cz+119,-211-cz);
   const feather=Math.max(0,1-outer/22);
   if(soilPatch<.17||hash(cx,cz,18)>feather){rejected.patch++;continue;}
   const quota=existing>=8?3:existing>=3?6:
    18+(hash(cx,cz,19)>.62?6:0)+(cx<-82?4:0);
   let cellAdded=0;
   for(let k=0;k<quota&&admitted<target;k++){
    const x=Math.fround(cx+.10+.80*hash(cx,cz,30+k*3));
    const z=Math.fround(cz+.10+.80*hash(cx,cz,31+k*3));
    const physicalId=tileKey(x,z);
    if(near(x,z)){rejected.occupied++;continue;}
    if((physical.get(physicalId)??0)>=P6_ECOTONE_ALLOCATION.maximumTileRoots){
     rejected.tileCapacity++;continue;
    }
    trials++;
    const support=admitDryContact(x,z);
    if(!support||support.dryContact!==true||
      !Number.isFinite(support.y)||!Number.isFinite(support.slope)||
      support.slope>.75){rejected.contact++;continue;}
    if(!proposed.has(physicalId))proposed.set(physicalId,{
     id:'P6_DRY_ECOTONE:'+physicalId,minX:Math.floor(x/4)*4,
     minZ:Math.floor(z/4)*4,values:[],rootIds:[]
    });
    const tile=proposed.get(physicalId);
    tile.values.push(x,Math.fround(support.y),z,
     Math.fround(hash(cx,cz,32+k*3)*Math.PI*2));
    tile.rootIds.push('P6:'+x+':'+z+':'+k);
    physical.set(physicalId,(physical.get(physicalId)??0)+1);
    cells.set(key,(cells.get(key)??0)+1);
    remember(x,z);admitted++;cellAdded++;
   }
   if(cellAdded)cellsFilled++;
  }
  if((cz-minZ)%8===0)await yieldControl();
 }
 let first=0;
 const tiles=[...proposed.values()].sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX).map(t=>{
  const {values,rootIds,...rest}=t,count=values.length/4;
  const out=Object.freeze({...rest,count,first,packed:Float32Array.from(values),rootIds:Object.freeze(rootIds)});
  first+=count;return out;
 });
 if(first!==admitted||admitted>target||
    admitted*16>P6_ECOTONE_ALLOCATION.maximumPackedBytes)
  throw Error('P6_ECOTONE_GPU_BUDGET_EXCEEDED');
 return Object.freeze({tiles:Object.freeze(tiles),receipt:Object.freeze({
  schema:'H_EARTH_P6_AUTHENTIC_DRY_CONTACT_V1',addedRoots:admitted,
  addedGpuBytes:admitted*16,maximumAddedRoots:target,
  originalP3RootsPreserved:true,p4AdditionalRootsPreserved:true,
  newRootsRequireNativeDryContact:true,protectedRootsObserved,
  cellsFilled,trials,rejected,footprint:P6_ECOTONE_FOOTPRINT,
  sourceContactAcceptance:true,originalRootArraysUnchanged:true,
  visualGainNotInferred:true
 })});
}
