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
async function buildHabitatRaster({suitability,yieldControl,bounds,size,regionalWeight}){
 if(typeof suitability!=='function')throw Error('WOODLAND_HABITAT_SUITABILITY_REQUIRED');
 const [x0,z0,x1,z1]=bounds,stepX=(x1-x0)/size,stepZ=(z1-z0)/size,step=Math.min(stepX,stepZ),diagonal=Math.hypot(stepX,stepZ);
 const weights=new Float32Array(size*size),distance=new Float32Array(size*size),pixels=new Uint8Array(size*size);
 let admittedCells=0;
 for(let iz=0;iz<size;iz++){
  for(let ix=0;ix<size;ix++){
   const i=iz*size+ix,x=x0+(ix+.5)*stepX,z=z0+(iz+.5)*stepZ,regional=regionalWeight(x,z);
   const support=regional>0?Number(suitability(x,z)):0;
   if(!Number.isFinite(support)||support<0||support>1)throw Error('WOODLAND_HABITAT_SUITABILITY_INVALID');
   weights[i]=regional*support;distance[i]=weights[i]>0?10000:0;if(weights[i]>0)admittedCells++;
  }
  if((iz&7)===0)await yieldControl();
 }
 // Static chamfer distance to rejected support; conservative erosion keeps
 // linear texture filtering away from protected cells, with a graded approach.
 for(let z=0;z<size;z++)for(let x=0;x<size;x++){const i=z*size+x;if(x)distance[i]=Math.min(distance[i],distance[i-1]+stepX);if(z)distance[i]=Math.min(distance[i],distance[i-size]+stepZ);if(x&&z)distance[i]=Math.min(distance[i],distance[i-size-1]+diagonal);if(x+1<size&&z)distance[i]=Math.min(distance[i],distance[i-size+1]+diagonal);}
 for(let z=size-1;z>=0;z--)for(let x=size-1;x>=0;x--){const i=z*size+x;if(x+1<size)distance[i]=Math.min(distance[i],distance[i+1]+stepX);if(z+1<size)distance[i]=Math.min(distance[i],distance[i+size]+stepZ);if(x+1<size&&z+1<size)distance[i]=Math.min(distance[i],distance[i+size+1]+diagonal);if(x&&z+1<size)distance[i]=Math.min(distance[i],distance[i+size-1]+diagonal);pixels[i]=Math.round(255*weights[i]*habitatSmooth(step*1.5,5,distance[i]));}
 const sample=(x,z)=>sampleWoodlandHabitat({pixels,size,bounds},x,z);
 return Object.freeze({pixels,size,bounds,sample,receipt:{schema:'H_EARTH_WOODLAND_HABITAT_FIELD_v1',coordinateSpace:'RENDERED_WORLD_XZ_METERS',size,byteLength:pixels.byteLength,admittedCells,uploadPolicy:'ONCE_BEFORE_READY',cameraIndependent:true,coverageSource:'SHARED_RENDERED_SUPPORT_AND_GRADED_PROTECTED_BOUNDARIES'}});
}
/** Rear habitat follows the measured canonical drainage; no river or terrain is invented. */
export const RAVINE_HABITAT=Object.freeze({bounds:Object.freeze([-110,-376,68,-248]),size:192,spacing:.14,maximumRoots:64000});
function segmentDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz,t=den?clamp(((x-a.x)*dx+(z-a.z)*dz)/den):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
export function ravineHabitatWeight(points,x,z){
 if(!Array.isArray(points)||points.length<2)return 0;
 const [x0,z0,x1,z1]=RAVINE_HABITAT.bounds;
 if(x<=x0||x>=x1||z<=z0||z>=z1)return 0;
 let distance=Infinity;for(let i=1;i<points.length;i++)distance=Math.min(distance,segmentDistance(x,z,points[i-1],points[i]));
 // Rotated, warped broad fields give irregular shoulders, independently of atlas bounds.
 const xx=.819*x+.574*z,zz=-.574*x+.819*z,noise=habitatNoise(xx,zz,19,71),warp=(habitatNoise(xx,zz,31,72)-.5)*7;
 const shoulders=1-habitatSmooth(6+warp,20+warp,distance),boundary=habitatSmooth(0,9,Math.min(x-x0,x1-x,z-z0,z1-z));
 return shoulders*boundary*(.34+.22*noise);
}
export async function buildWoodlandHabitatField({suitability,yieldControl=async()=>{},ravinePoints=null}={}){
 const woodland=await buildHabitatRaster({suitability,yieldControl,...WOODLAND_HABITAT,regionalWeight:regionalWoodlandWeight});
 if(ravinePoints===null)return woodland;
 if(!Array.isArray(ravinePoints)||ravinePoints.length<2||ravinePoints.some(p=>![p.x,p.z].every(Number.isFinite)))throw Error('RAVINE_DRAINAGE_POINTS_INVALID');
 const ravine=await buildHabitatRaster({suitability,yieldControl,...RAVINE_HABITAT,regionalWeight:(x,z)=>ravineHabitatWeight(ravinePoints,x,z)});
 // Side-by-side exact texels keep the accepted woodland sample grid unchanged.
 const size=woodland.size,width=size*2,height=size,pixels=new Uint8Array(width*height);
 for(let row=0;row<size;row++){pixels.set(woodland.pixels.subarray(row*size,(row+1)*size),row*width);pixels.set(ravine.pixels.subarray(row*size,(row+1)*size),row*width+size);}
 return Object.freeze({pixels,size,width,height,bounds:woodland.bounds,woodland,ravine,sample:(x,z)=>Math.max(woodland.sample(x,z),ravine.sample(x,z)),receipt:{...woodland.receipt,width,height,byteLength:pixels.byteLength,regionCount:2,woodlandGridPreserved:true,ravine:{...ravine.receipt,drainagePointCount:ravinePoints.length,maximumRoots:RAVINE_HABITAT.maximumRoots},coverageSource:'ONE_STATIC_ATLAS_ORIGINAL_WOODLAND_AND_MEASURED_RAVINE_SHARED_SUPPORT'}});
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
 const woodland=field.woodland??field;
 for(let iz=0;iz<Math.ceil((z1-z0)/spacing);iz++)for(let ix=0;ix<Math.ceil((x1-x0)/spacing);ix++){
  const x=Math.fround(x0+(ix+.5+(habitatHash(ix,iz,0)/4294967296-.5)*.76)*spacing),z=Math.fround(z0+(iz+.5+(habitatHash(ix,iz,1)/4294967296-.5)*.76)*spacing);
  const rank=habitatHash(ix,iz,2);if(rank/4294967296<woodland.sample(x,z))candidates.push({x,z,ix,iz,rank});
 }
 if(candidates.length>maximumRoots){candidates.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);candidates.length=maximumRoots;}
 candidates.sort((a,b)=>a.iz-b.iz||a.ix-b.ix);
 if(field.ravine){
  const rear=[],[rx0,rz0,rx1,rz1]=RAVINE_HABITAT.bounds,s=RAVINE_HABITAT.spacing;
  for(let iz=Math.floor(rz0/s);iz<Math.ceil(rz1/s);iz++)for(let ix=Math.floor(rx0/s);ix<Math.ceil(rx1/s);ix++){
   const x=Math.fround((ix+.5+(habitatHash(ix,iz,80)/4294967296-.5)*.76)*s),z=Math.fround((iz+.5+(habitatHash(ix,iz,81)/4294967296-.5)*.76)*s);
   const rank=habitatHash(ix,iz,82);
   // The accepted woodland always owns its old population; rear roots cannot steal its budget.
   if(woodland.sample(x,z)>0||rank/4294967296>=field.ravine.sample(x,z))continue;
   rear.push({x,z,ix:ix+8000000,iz:iz+8000000,rank,region:'RAVINE'});
  }
  const remaining=Math.min(RAVINE_HABITAT.maximumRoots,maximumRoots-candidates.length);
  if(rear.length>remaining){rear.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);rear.length=remaining;}
  rear.sort((a,b)=>a.iz-b.iz||a.ix-b.ix);candidates.push(...rear);
 }
 return candidates;
}
