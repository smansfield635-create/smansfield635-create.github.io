import {habitatHash,habitatNoise,sampleWoodlandHabitat} from './woodland-habitat-field.v1.js';
import {isVerifiedPlantingPoint} from './verified-planting-cells.v1.js';
/** Gen2810 foothill and meadow presentation allocation. Design budget, not a hardware claim. */
export const GRASS_CONTINUITY_ALLOCATION=Object.freeze({maximumRoots:1500134,maximumPackedBytes:24002144,maximumWoodlandRoots:450000,maximumRavineRoots:1114190,maximumTileRoots:1600,originalWoodlandRoots:385944,originalRavineRoots:139198,spacing:.14});
export const GRASS_CONTINUITY_BOUNDS=Object.freeze([-298,-570,88,-234]);
export const GRASS_CONTINUITY_CONNECTOR=Object.freeze([[-108,-256],[-78,-278],[-38,-286],[0,-282],[40,-274]].map(Object.freeze));
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{const t=clamp(x);return t*t*(3-2*t);},f=Math.fround;
function distance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],q=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz));return Math.hypot(x-a[0]-q*dx,z-a[1]-q*dz);}
/** Only a proposal envelope. Actual rendered-ground admission remains mandatory. */
export function createGrassContinuityEnvelope(){
 const [x0,z0,x1,z1]=GRASS_CONTINUITY_BOUNDS,width=x1-x0,height=z1-z0,d=new Float32Array(width*height),weights=new Float32Array(width*height);
 for(let z=0;z<height;z++)for(let x=0;x<width;x++)d[z*width+x]=isVerifiedPlantingPoint(x0+x+.5,z0+z+.5)?0:10000;
 for(let z=0;z<height;z++)for(let x=0;x<width;x++){const i=z*width+x;if(x)d[i]=Math.min(d[i],d[i-1]+1);if(z)d[i]=Math.min(d[i],d[i-width]+1);if(x&&z)d[i]=Math.min(d[i],d[i-width-1]+Math.SQRT2);if(x+1<width&&z)d[i]=Math.min(d[i],d[i-width+1]+Math.SQRT2);}
 for(let z=height-1;z>=0;z--)for(let x=width-1;x>=0;x--){const i=z*width+x;if(x+1<width)d[i]=Math.min(d[i],d[i+1]+1);if(z+1<height)d[i]=Math.min(d[i],d[i+width]+1);if(x+1<width&&z+1<height)d[i]=Math.min(d[i],d[i+width+1]+Math.SQRT2);if(x&&z+1<height)d[i]=Math.min(d[i],d[i+width-1]+Math.SQRT2);}
 for(let z=0;z<height;z++)for(let x=0;x<width;x++){
  const xx=x0+x+.5,zz=z0+z+.5,i=z*width+x,shoulder=3+3*habitatNoise(xx,zz,17,94);
  let route=Infinity;for(let k=1;k<GRASS_CONTINUITY_CONNECTOR.length;k++)route=Math.min(route,distance(xx,zz,GRASS_CONTINUITY_CONNECTOR[k-1],GRASS_CONTINUITY_CONNECTOR[k]));
  const banks=1-smooth(d[i]/shoulder),connection=1-smooth((route-3)/shoulder);
  const cave=1-smooth((Math.hypot((xx-40)/18,(zz+264)/16)-.85)/.35);
  const boundary=smooth(Math.min(x,width-1-x,z,height-1-z)/3);
  weights[i]=Math.max(banks,connection,cave)*boundary;
 }
 const cell=(x,z)=>{const ix=Math.floor(x-x0),iz=Math.floor(z-z0);return ix>=0&&ix<width&&iz>=0&&iz<height?iz*width+ix:-1;};
 const sample=(x,z)=>{const qx=x-x0-.5,qz=z-z0-.5,ix=Math.floor(qx),iz=Math.floor(qz),u=qx-ix,v=qz-iz,n=(a,b)=>a<0||a>=width||b<0||b>=height?0:weights[b*width+a];return(n(ix,iz)*(1-u)+n(ix+1,iz)*u)*(1-v)+(n(ix,iz+1)*(1-u)+n(ix+1,iz+1)*u)*v;};
 return{bounds:GRASS_CONTINUITY_BOUNDS,width,height,weights,cell,sample};
}
export function measureWoodlandReference(presentation,habitat,acceptRoot){
 const controls=[];
 for(const tile of presentation.tiles){
  if(Math.hypot(tile.minX+2+141,tile.minZ+2+226)>24||tile.roots.some(r=>r.region==='RAVINE'))continue;
  let complete=true;
  for(let z=.25;z<4&&complete;z+=.5)for(let x=.25;x<4;x+=.5){const xx=tile.minX+x,zz=tile.minZ+z;if(habitat.woodland.sample(xx,zz)<.70||!acceptRoot(xx,zz,'WOODLAND')){complete=false;break;}}
  if(complete)controls.push({id:tile.id,minX:tile.minX,minZ:tile.minZ,eligibleArea:16,rootCount:tile.roots.length,density:tile.roots.length/16});
 }
 if(controls.length<4)throw Error('GRASS_CONTINUITY_REFERENCE_INSUFFICIENT:'+controls.length);
 const sorted=controls.map(t=>t.density).sort((a,b)=>a-b),density=sorted[Math.floor(sorted.length/2)];
 if(!(density>0&&density<=1/.14**2))throw Error('GRASS_CONTINUITY_REFERENCE_INVALID:'+density);
 return{density,lowerQuartile:sorted[Math.floor(sorted.length/4)],sampleResolution:.5,areaConvention:'FULL_4M_TILE_WITH_ALL_64_CELL_CENTER_ADMISSION_WITNESSES',controls};
}
/** Preserve accepted objects; append a fixed, deduplicated, admitted population. */
export async function appendGrassContinuity(presentation,{habitat,acceptRoot,yieldControl=async()=>{},onProgress=()=>{}}){
 const allocation=GRASS_CONTINUITY_ALLOCATION,envelope=createGrassContinuityEnvelope(),reference=measureWoodlandReference(presentation,habitat,acceptRoot),probability=Math.min(1,reference.density*allocation.spacing**2);
 const tiles=new Map(),existing=new Set(),occupancy=new Uint32Array(envelope.weights.length);let originalCount=0,originalWoodland=0,originalRavine=0;
 for(const tile of presentation.tiles){tiles.set(tile.id,{...tile,roots:[...tile.roots]});for(const r of tile.roots){existing.add(`${r.x}:${r.z}`);originalCount++;if(r.region==='RAVINE')originalRavine++;else originalWoodland++;const i=envelope.cell(r.x,r.z);if(i>=0)occupancy[i]++;}}
 if(originalWoodland!==allocation.originalWoodlandRoots||originalRavine!==allocation.originalRavineRoots)throw Error('GRASS_CONTINUITY_ORIGINAL_IDENTITY_COUNT');
 let added=0,candidates=0,duplicates=0,rejected=0;const [x0,z0,x1,z1]=envelope.bounds,s=allocation.spacing;
 const proposals=new Map();
 for(let iz=Math.floor(z0/s);iz<Math.ceil(z1/s);iz++){for(let ix=Math.floor(x0/s);ix<Math.ceil(x1/s);ix++){
  const x=f((ix+.5+(habitatHash(ix,iz,80)/4294967296-.5)*.76)*s),z=f((iz+.5+(habitatHash(ix,iz,81)/4294967296-.5)*.76)*s),weight=envelope.sample(x,z);
  if(weight<=0||habitat.woodland.sample(x,z)>0||habitatHash(ix,iz,82)/4294967296>=probability)continue;
  const cell=envelope.cell(x,z);if(cell<0)continue;
  if(!proposals.has(cell))proposals.set(cell,[]);
  proposals.get(cell).push({x,z,ix,iz,rank:habitatHash(ix,iz,95)});
 }if((iz&15)===0){onProgress({phase:'GRASS_CONTINUITY_PROPOSALS',proposalCells:proposals.size});await yieldControl();}}
 let processedCells=0;
 for(const [cell,points]of proposals){
  const cx=x0+cell%envelope.width,cz=z0+Math.floor(cell/envelope.width),target=reference.density*envelope.sample(cx+.5,cz+.5),quota=Math.floor(target)+(habitatHash(cx,cz,93)/4294967296<target%1?1:0);
  // Existing roots consume the union quota. Hash priority avoids directional
  // scan stripes when a cell has more eligible proposals than it needs.
  points.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);
  for(const {x,z,ix,iz}of points){
   if(occupancy[cell]>=quota)break;
   candidates++;if(existing.has(`${x}:${z}`)){duplicates++;continue;}
   const support=acceptRoot(x,z,'RAVINE');if(!support){rejected++;continue;}
   const tx=Math.floor(x/4),tz=Math.floor(z/4),id=`${tx}:${tz}`;if(!tiles.has(id))tiles.set(id,{id,minX:tx*4,minZ:tz*4,roots:[]});const tile=tiles.get(id);
   if(tile.roots.length>=allocation.maximumTileRoots)throw Error('GRASS_CONTINUITY_TILE_BUDGET:'+id);
   if(originalCount+added+1>allocation.maximumRoots||originalRavine+added+1>allocation.maximumRavineRoots)throw Error('GRASS_CONTINUITY_ALLOCATION_EXCEEDED');
   tile.roots.push({x,y:f(support.y),z,angle:f(habitatHash(ix+8000000,iz+8000000,3)/4294967296*Math.PI*2),seed:habitatHash(ix+8000000,iz+8000000,4),triangleId:support.triangleId,slope:support.slope,region:'RAVINE_SUPPLEMENT'});existing.add(`${x}:${z}`);added++;occupancy[cell]++;
  }
  if((++processedCells&127)===0){onProgress({phase:'GRASS_CONTINUITY_CONTACTS',addedContacts:added,candidates});await yieldControl();}
 }
 const ordered=[...tiles.values()].sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX);for(const tile of ordered)tile.roots.sort((a,b)=>a.seed-b.seed);
 // Reuse the same atlas allocation. The approved woodland half is byte-identical.
 const size=habitat.size,width=habitat.width,pixels=new Uint8Array(habitat.pixels),bounds=envelope.bounds;
 const sample=(x,z)=>{const i=envelope.cell(x,z);return i<0?0:Math.max(habitat.ravine.sample(x,z),clamp(occupancy[i]/reference.density));};
 for(let z=0;z<size;z++)for(let x=0;x<size;x++){
  const xx=x0+(x+.5)/size*(x1-x0),zz=z0+(z+.5)/size*(z1-z0),old=habitat.ravine.sample(xx,zz),valid=acceptRoot(xx,zz,'RAVINE');
  pixels[z*width+size+x]=Math.round(255*Math.max(old,valid?sample(xx,zz):0));
 }
 const receipt={schema:'H_EARTH_GRASS_CONTINUITY_v1',originalWoodland,originalRavine,originalCount,addedContacts:added,totalContacts:originalCount+added,packedBytes:(originalCount+added)*16,candidates,duplicateCandidates:duplicates,rejectedCandidates:rejected,reference,allocation,maximumTileRoots:Math.max(...ordered.map(t=>t.roots.length)),densityAllocation:'EXISTING_PLUS_SUPPLEMENT_ONE_METRE_QUOTA',cameraIndependent:true,originalRootsPreserved:true,renderedAcceptance:false};
 const rightPixels=new Uint8Array(size*size);for(let z=0;z<size;z++)rightPixels.set(pixels.subarray(z*width+size,z*width+2*size),z*size);
 const gpuSample=(x,z)=>sampleWoodlandHabitat({pixels:rightPixels,size,bounds},x,z);
 const nextHabitat={...habitat,pixels,ravine:{...habitat.ravine,bounds,sample:gpuSample},sample:(x,z)=>Math.max(habitat.woodland.sample(x,z),gpuSample(x,z)),receipt:{...habitat.receipt,grassContinuity:receipt,ravine:{...habitat.receipt.ravine,bounds},coverageSource:'SAVED_MEMBERSHIP_PLUS_ADMITTED_STATIC_SUPPLEMENT'}};
 return{...presentation,tiles:ordered,habitat:nextHabitat,receipt:{...presentation.receipt,contactCount:originalCount+added,tileCount:ordered.length,grassContinuity:receipt}};
}
