/** Static world-space coverage shared by immutable roots and terrain shading. */
export const WOODLAND_HABITAT=Object.freeze({bounds:Object.freeze([-213,-298,-69,-154]),size:192,spacing:.14,maximumRoots:450000,maximumTileRoots:1600,maximumSandCoverage:.12});
const clamp=v=>Math.max(0,Math.min(1,v));
export const habitatSmooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export function habitatHash(x,z,k=0){let h=Math.imul(x^0x51ed270b,1597334677)^Math.imul(z^0x68bc21eb,3812015801)^Math.imul(k+1,747796405);h=Math.imul(h^(h>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);return(h^(h>>>16))>>>0;}
export function habitatNoise(x,z,scale,k=0){const xx=x/scale,zz=z/scale,ix=Math.floor(xx),iz=Math.floor(zz),u=habitatSmooth(0,1,xx-ix),v=habitatSmooth(0,1,zz-iz),n=(a,b)=>habitatHash(a,b,k)/4294967296;return(n(ix,iz)*(1-u)+n(ix+1,iz)*u)*(1-v)+(n(ix,iz+1)*(1-u)+n(ix+1,iz+1)*u)*v;}
export function regionalWoodlandWeight(x,z){
 const [x0,z0,x1,z1]=WOODLAND_HABITAT.bounds;
 if(![x,z].every(Number.isFinite)||x<=x0||x>=x1||z<=z0||z>=z1)return 0;
 const warp=(habitatNoise(x,z,23,31)-.5)*15+(habitatNoise(x,z,47,32)-.5)*10;
 const d=Math.min(Math.hypot(x+141,z+226),Math.hypot(x+155,z+210)+8,Math.hypot(x+125,z+247)+9);
 const extent=1-habitatSmooth(40+warp,65+warp,d);
 const boundary=habitatSmooth(2,10,Math.min(x-x0,x1-x,z-z0,z1-z));
 return clamp(extent*boundary*(.72+.28*habitatNoise(x,z,18,33)));
}
/** suitability must use rendered support plus the same exact hard admission as roots. */
export async function buildWoodlandHabitatField({suitability,yieldControl=async()=>{}}={}){
 if(typeof suitability!=='function')throw Error('WOODLAND_HABITAT_SUITABILITY_REQUIRED');
 const {size,bounds}=WOODLAND_HABITAT,[x0,z0,x1,z1]=bounds,step=(x1-x0)/size;
 const weights=new Float32Array(size*size),distance=new Float32Array(size*size),pixels=new Uint8Array(size*size);
 let admittedCells=0;
 for(let iz=0;iz<size;iz++){
  for(let ix=0;ix<size;ix++){
   const i=iz*size+ix,x=x0+(ix+.5)*step,z=z0+(iz+.5)*step,regional=regionalWoodlandWeight(x,z);
   const support=regional>0?Number(suitability(x,z)):0;
   if(!Number.isFinite(support)||support<0||support>1)throw Error('WOODLAND_HABITAT_SUITABILITY_INVALID');
   weights[i]=regional*support;distance[i]=weights[i]>0?10000:0;if(weights[i]>0)admittedCells++;
  }
  if((iz&7)===0)await yieldControl();
 }
 // Static chamfer distance to rejected support; conservative erosion keeps
 // linear texture filtering away from protected cells, with a graded approach.
 for(let z=0;z<size;z++)for(let x=0;x<size;x++){const i=z*size+x;if(x)distance[i]=Math.min(distance[i],distance[i-1]+step);if(z)distance[i]=Math.min(distance[i],distance[i-size]+step);if(x&&z)distance[i]=Math.min(distance[i],distance[i-size-1]+step*Math.SQRT2);if(x+1<size&&z)distance[i]=Math.min(distance[i],distance[i-size+1]+step*Math.SQRT2);}
 for(let z=size-1;z>=0;z--)for(let x=size-1;x>=0;x--){const i=z*size+x;if(x+1<size)distance[i]=Math.min(distance[i],distance[i+1]+step);if(z+1<size)distance[i]=Math.min(distance[i],distance[i+size]+step);if(x+1<size&&z+1<size)distance[i]=Math.min(distance[i],distance[i+size+1]+step*Math.SQRT2);if(x&&z+1<size)distance[i]=Math.min(distance[i],distance[i+size-1]+step*Math.SQRT2);pixels[i]=Math.round(255*weights[i]*habitatSmooth(step*1.5,5,distance[i]));}
 const sample=(x,z)=>sampleWoodlandHabitat({pixels,size,bounds},x,z);
 return Object.freeze({pixels,size,bounds,sample,receipt:{schema:'H_EARTH_WOODLAND_HABITAT_FIELD_v1',coordinateSpace:'RENDERED_WORLD_XZ_METERS',size,byteLength:pixels.byteLength,admittedCells,uploadPolicy:'ONCE_BEFORE_READY',cameraIndependent:true,coverageSource:'SHARED_RENDERED_SUPPORT_AND_GRADED_PROTECTED_BOUNDARIES'}});
}
/** Matches CLAMP_TO_EDGE linear R8 sampling and the shader's bounds transform. */
export function sampleWoodlandHabitat(field,x,z){
 const {bounds:[x0,z0,x1,z1],size,pixels}=field;if(x<=x0||x>=x1||z<=z0||z>=z1)return 0;
 const px=(x-x0)/(x1-x0)*size-.5,pz=(z-z0)/(z1-z0)*size-.5,ix=Math.floor(px),iz=Math.floor(pz),u=px-ix,v=pz-iz;
 const n=(a,b)=>pixels[Math.max(0,Math.min(size-1,b))*size+Math.max(0,Math.min(size-1,a))]/255;
 return(n(ix,iz)*(1-u)+n(ix+1,iz)*u)*(1-v)+(n(ix,iz+1)*(1-u)+n(ix+1,iz+1)*u)*v;
}
/** Cheap static thinning before triangle contact work; cap never depends on camera. */
export function planWoodlandHabitatCandidates(field){
 const {bounds:[x0,z0,x1,z1],spacing,maximumRoots}=WOODLAND_HABITAT,candidates=[];
 for(let iz=0;iz<Math.ceil((z1-z0)/spacing);iz++)for(let ix=0;ix<Math.ceil((x1-x0)/spacing);ix++){
  const x=Math.fround(x0+(ix+.5+(habitatHash(ix,iz,0)/4294967296-.5)*.76)*spacing),z=Math.fround(z0+(iz+.5+(habitatHash(ix,iz,1)/4294967296-.5)*.76)*spacing);
  const rank=habitatHash(ix,iz,2);if(rank/4294967296<field.sample(x,z))candidates.push({x,z,ix,iz,rank});
 }
 if(candidates.length>maximumRoots){candidates.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);candidates.length=maximumRoots;}
 candidates.sort((a,b)=>a.iz-b.iz||a.ix-b.ix);return candidates;
}
