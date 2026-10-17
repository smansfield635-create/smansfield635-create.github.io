/** Bounded presentation layout. No camera input or canonical world mutation. */
export const PLANTING_PILOT=Object.freeze({id:'H_EARTH_PLANTING_PILOT_v1',bounds:Object.freeze([-105,-345,-25,-275]),spacing:.65,maximumRoots:20000,recordStride:8,waterClearance:.03});
export const PLANTING_PILOT_FAMILIES=Object.freeze(['PLANTED_BANK','MEADOW_POCKET','SPARSE_UPLAND','ROCK_TRANSITION']);
const f=Math.fround,clamp=v=>Math.max(0,Math.min(1,v));
function hash(x,z,k=0){let h=Math.imul(x^0x51ed270b,1597334677)^Math.imul(z^0x68bc21eb,3812015801)^Math.imul(k+1,747796405);h=Math.imul(h^(h>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);return(h^(h>>>16))>>>0;}
const unit=(x,z,k)=>hash(x,z,k)/4294967296;
function noise(x,z,step,k){const xx=x/step,zz=z/step,ix=Math.floor(xx),iz=Math.floor(zz),ux=xx-ix,uz=zz-iz,u=ux*ux*(3-2*ux),v=uz*uz*(3-2*uz);return(unit(ix,iz,k)*(1-u)+unit(ix+1,iz,k)*u)*(1-v)+(unit(ix,iz+1,k)*(1-u)+unit(ix+1,iz+1,k)*u)*v;}
export function isPlantingPilotPoint(x,z){return Number.isFinite(x)&&Number.isFinite(z)&&x>=-105&&x<=-25&&z>=-345&&z<=-275;}
function distance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,q=dx*dx+dz*dz,t=q?clamp(((x-a.x)*dx+(z-a.z)*dz)/q):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
async function boundaryIndex(geology,yieldControl){
 const edges=new Map();let slice=performance.now();
 const pause=async()=>{if(performance.now()-slice>=8){await yieldControl();slice=performance.now();}};
 for(const part of geology.meshes){
  if(!['FRESHWATER_RIVER','OASIS_WATER'].includes(part.role))continue;
  const {positions:p,indices:i}=part.mesh??{};
  if(!p||!i||p.length%3||i.length%3)throw Error('PLANTING_PILOT_WATER_MESH_INVALID');
  for(let n=0;n<i.length;n+=3){
   if((n&63)===0)await pause();
   const v=[i[n],i[n+1],i[n+2]].map(id=>{if(!Number.isInteger(id)||id<0||id*3+2>=p.length)throw Error('PLANTING_PILOT_WATER_INDEX_INVALID');const a={x:f(p[id*3]),z:f(p[id*3+2])};if(!Number.isFinite(a.x)||!Number.isFinite(a.z))throw Error('PLANTING_PILOT_WATER_VERTEX_INVALID');return a;});
   for(let k=0;k<3;k++){let a=v[k],b=v[(k+1)%3];if(a.x===b.x&&a.z===b.z)continue;let ak=`${a.x},${a.z}`,bk=`${b.x},${b.z}`;if(ak>bk){[a,b]=[b,a];[ak,bk]=[bk,ak];}const key=ak+'|'+bk,e=edges.get(key);if(e)e.count++;else edges.set(key,{a,b,count:1});}
  }
 }
 const boundary=[...edges.values()].filter(e=>e.count===1),bins=new Map(),size=20;
 for(const edge of boundary){await pause();for(let iz=Math.floor((Math.min(edge.a.z,edge.b.z)-20)/size);iz<=Math.floor((Math.max(edge.a.z,edge.b.z)+20)/size);iz++)for(let ix=Math.floor((Math.min(edge.a.x,edge.b.x)-20)/size);ix<=Math.floor((Math.max(edge.a.x,edge.b.x)+20)/size);ix++){const key=ix+':'+iz;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(edge);}}
 if(!boundary.length)throw Error('PLANTING_PILOT_WATER_BOUNDARY_MISSING');
 return {count:boundary.length,distance(x,z){let best=Infinity;for(const edge of bins.get(Math.floor(x/size)+':'+Math.floor(z/size))??[])best=Math.min(best,distance(x,z,edge.a,edge.b));return best;}};
}
function policyClear(x,z,estate,oasis){
 for(const box of [estate.manorCore,estate.gardens,estate.outbuildingProposal,estate.acceptedEnvelope]){if(!box||![box.minX,box.maxX,box.minZ,box.maxZ].every(Number.isFinite))throw Error('PLANTING_PILOT_ESTATE_BOX_INVALID');if(x>=box.minX-.1&&x<=box.maxX+.1&&z>=box.minZ-.1&&z<=box.maxZ+.1)return false;}
 for(let i=1;i<estate.footRoute.length;i++)if(distance(x,z,estate.footRoute[i-1],estate.footRoute[i])<=estate.footRouteRadius+.1)return false;
 return !(x>=oasis.minX-.1&&x<=oasis.maxX+.1&&z>=oasis.minZ-.1&&z<=oasis.maxZ+.1);
}
/** Geographic replacement admission, independent of the former rectangle. */
export async function createUniformGroundAdmission({visibleSurface,geology,toLocal,estate,obstacles=[],trees=[],oasis,sampleStructure,yieldControl=async()=>{},maximumSandCoverage=0}={}){
 if(typeof visibleSurface?.beach?.sample!=='function'||typeof geology?.sampleWaterAt!=='function'||typeof toLocal!=='function'||typeof sampleStructure!=='function')throw Error('UNIFORM_GROUND_PROVIDER_REQUIRED');
 if(!Number.isFinite(maximumSandCoverage)||maximumSandCoverage<0||maximumSandCoverage>.12)throw Error('UNIFORM_GROUND_SAND_LIMIT_INVALID');
 const boundary=await boundaryIndex(geology,yieldControl),rejections={};let tested=0;
 const reject=reason=>{rejections[reason]=(rejections[reason]??0)+1;return false;};
 const admit=(x,z,support)=>{
  tested++;const beach=visibleSurface.beach.sample({x,z,support});
  if(beach?.valid!==true){reject('RENDERED_BEACH_EVIDENCE_UNAVAILABLE');throw Error('UNIFORM_GROUND_RENDERED_BEACH_EVIDENCE_UNAVAILABLE');}
  if(!Number.isFinite(beach.rawSandCoverage)||beach.rawSandCoverage<0||beach.rawSandCoverage>maximumSandCoverage)return reject('RENDERED_BEACH');
  const water=visibleSurface.water.sample(x,z),future=geology.sampleWaterAt(x,z);
  if(water&&support.y<=water.y+.03)return reject('RENDERED_WATER');
  if(future&&support.y<=future.y+.03)return reject('FUTURE_WATER');
  if(boundary.distance(x,z)<=2)return reject('BARE_CHANNEL_MARGIN');
  const local=toLocal(x,support.y,z),structure=sampleStructure(local.x,local.z);
  if(structure?.hardExclusions?.length||structure?.planningHolds?.length)return reject('STRUCTURE');
  if(!policyClear(local.x,local.z,estate,oasis)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<t.radius+.10)||trees.some(t=>Math.hypot(x-t.x,z-t.z)<t.trunkRadius+.15))return reject('PROTECTED_FOOTPRINT');
  return true;
 };
 admit.getReceipt=()=>({schema:'H_EARTH_UNIFORM_GROUND_ADMISSION_v1',tested,rejections:{...rejections},waterBoundaryEdges:boundary.count,maximumSandCoverage,geographicWaterPolicy:true,rectangleMask:false});
 return admit;
}
/** Accepted roots are shared by every pilot representation. */
export async function buildPlantingPilotLayout({visibleSurface,geology,sampleMaterial,toLocal,estate,obstacles=[],trees=[],oasis,yieldControl=async()=>{},sampleStructure,admitGround=visibleSurface?.admitGround}={}){
 if(typeof admitGround!=='function')throw Error('PLANTING_PILOT_CALLBACK_REQUIRED_RENDERED_BEACH_PROVIDER');
 if(typeof visibleSurface?.ground?.sample!=='function'||typeof visibleSurface?.water?.sample!=='function'||typeof geology?.sampleWaterAt!=='function'||!Array.isArray(geology?.meshes)||typeof sampleMaterial!=='function'||typeof toLocal!=='function'||typeof yieldControl!=='function')throw Error('PLANTING_PILOT_CALLBACK_REQUIRED');
 if(!estate||!Array.isArray(estate.footRoute)||!Number.isFinite(estate.footRouteRadius)||!oasis||![oasis.minX,oasis.maxX,oasis.minZ,oasis.maxZ].every(Number.isFinite)||!Array.isArray(obstacles)||!Array.isArray(trees))throw Error('PLANTING_PILOT_POLICY_REQUIRED');
 for(const obstacle of obstacles)if(!obstacle||![obstacle.x,obstacle.z,obstacle.radius].every(Number.isFinite)||obstacle.radius<0)throw Error('PLANTING_PILOT_OBSTACLE_INVALID');
 for(const tree of trees)if(!tree||![tree.x,tree.z,tree.trunkRadius].every(Number.isFinite)||tree.trunkRadius<0)throw Error('PLANTING_PILOT_TREE_INVALID');
 if(estate.footRoute.some(p=>!p||![p.x,p.z].every(Number.isFinite))||estate.footRouteRadius<0)throw Error('PLANTING_PILOT_ROUTE_INVALID');
 if(sampleStructure!==undefined&&typeof sampleStructure!=='function')throw Error('PLANTING_PILOT_STRUCTURE_CALLBACK_INVALID');
 const boundary=await boundaryIndex(geology,yieldControl),roots=[],data=[],rejections={},families={},patches=new Set();let candidates=0,digest=2166136261,slice=performance.now(),yields=0;
 const reject=reason=>rejections[reason]=(rejections[reason]??0)+1;
 for(let iz=Math.floor(-345/.65)-1;iz<=Math.ceil(-275/.65)+1;iz++){
  for(let ix=Math.floor(-105/.65)-1;ix<=Math.ceil(-25/.65)+1;ix++){
   if(performance.now()-slice>=8){await yieldControl();yields++;slice=performance.now();}
   const x=f((ix+(unit(ix,iz,0)-.5)*.76)*.65),z=f((iz+(unit(ix,iz,1)-.5)*.76)*.65);
   if(!isPlantingPilotPoint(x,z))continue;candidates++;
   const support=visibleSurface.ground.sample(x,z);
   if(!support||!Number.isFinite(support.y)||!Number.isFinite(support.slope)){reject('NO_VISIBLE_TERRAIN');continue;}
   if(!['CANONICAL_VISIBLE_TERRAIN','VISIBLE_REFINEMENT','ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(support.owner)){reject('UNSUPPORTED_SURFACE_OWNER');continue;}
   if(!admitGround(x,z,support)){reject('SHARED_GROUND_ADMISSION');continue;}
   const y=f(support.y),renderedWater=visibleSurface.water.sample(x,z),futureWater=geology.sampleWaterAt(x,z);
   if(renderedWater&&y<=renderedWater.y+PLANTING_PILOT.waterClearance){reject('RENDERED_WATER');continue;}
   if(futureWater&&y<=futureWater.y+PLANTING_PILOT.waterClearance){reject('FUTURE_WATER');continue;}
   const local=toLocal(x,y,z);if(!local||![local.x,local.z].every(Number.isFinite))throw Error('PLANTING_PILOT_LOCAL_POINT_INVALID');
   const material=sampleMaterial(local.x,local.z),stone=material?.surfaceClass==='STONE_AND_SPARSE_SOIL';
   if(material?.valid!==true||support.slope>.35||!(stone?material.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(material.surfaceClass)&&material.soilDepth>=.20)){reject('MATERIAL_OR_SLOPE');continue;}
   const structure=sampleStructure?.(local.x,local.z);
   if(structure&&(structure.hardExclusions?.length||structure.planningHolds?.length)){reject('STRUCTURE');continue;}
   if(!policyClear(local.x,local.z,estate,oasis)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<t.radius+.10)||trees.some(t=>Math.hypot(x-t.x,z-t.z)<t.trunkRadius+.15)){reject('PROTECTED_FOOTPRINT');continue;}
   const bankDistance=boundary.distance(x,z);
   if(bankDistance<=2){reject('BARE_CHANNEL_MARGIN');continue;}
   const px=Math.floor(x/9),pz=Math.floor(z/11),patchSeed=hash(px,pz,20),patchId=`PILOT:${px}:${pz}`,pocket=noise(x,z,15,21)*.65+noise(x,z,31,28)*.35,side=noise(x,z,23,22);
   const family=bankDistance<=8?'PLANTED_BANK':stone?'ROCK_TRANSITION':pocket>.60?'MEADOW_POCKET':'SPARSE_UPLAND';
   const taper=Number.isFinite(bankDistance)?clamp((20-bankDistance)/12):0;
   let density=stone?.20:.18+.52*pocket;
   if(bankDistance<=8)density=Math.max(density,.79);
   else if(bankDistance<11)density+=(Math.max(density,.79)-density)*clamp((11-bankDistance)/3);
   density*=.76+side*.34;density=Math.max(density,taper*(.38+.23*side));
   const edge=Math.min(x+105,-25-x,z+345,-275-z),feather=clamp(edge/3);density*=feather*feather*(3-2*feather);
   if(unit(ix,iz,23)>density){reject('HABITAT_DENSITY');continue;}
   const seed=hash(ix,iz,24),angle=f(unit(ix,iz,25)*Math.PI*2),height=f(Math.min(.40,(stone?.10:.12+.08*pocket+.05*taper)+unit(ix,iz,26)*.16)),width=f(.018+unit(ix,iz,27)*.020),palette=f(stone?1:clamp(.12+.60*pocket+.18*taper)),seedNormalized=f(Math.min(1-2**-24,seed/4294967296));
   roots.push(Object.freeze({id:`PILOT:${ix}:${iz}`,x,y,z,seed,angle,height,width,palette,family,patchId,patchSeed,bankDistance:Number.isFinite(bankDistance)?bankDistance:null,support:Object.freeze({owner:support.owner,triangleId:support.triangleId,terrainPrimitiveId:support.terrainPrimitiveId??support.owner,slope:support.slope,y})}));
   data.push(x,y,z,angle,height,width,palette,seedNormalized);families[family]=(families[family]??0)+1;patches.add(patchId);
  }
 }
 if(roots.length>PLANTING_PILOT.maximumRoots)throw Error('PLANTING_PILOT_ROOT_BUDGET_EXCEEDED');
 const records=new Float32Array(data),bytes=new Uint8Array(records.buffer);for(const byte of bytes)digest=Math.imul(digest^byte,16777619)>>>0;
 const receipt=Object.freeze({schema:'H_EARTH_PLANTING_PILOT_LAYOUT_v1',bounds:PLANTING_PILOT.bounds,rootCount:roots.length,candidateCount:candidates,recordStride:8,recordBytes:records.byteLength,familyCounts:Object.freeze(families),patchCount:patches.size,rejections:Object.freeze(rejections),waterBoundaryEdges:boundary.count,layoutDigest:`FNV1A32_NONCRYPTOGRAPHIC:${digest.toString(16).padStart(8,'0')}`,coordinateSpace:'UPLOADED_FLOAT32_WORLD_XZ',rootEncoding:'ACTUAL_FLOAT32_VISIBLE_TRIANGLE_CONTACTS',cameraIndependent:true,sharedCoarseFineLayout:true,fixedHeight:true,hiddenFutureWaterExcluded:true,terrainChanged:false,originalRecordsChanged:false,newTrees:0,yieldCount:yields});
 return Object.freeze({records,roots:Object.freeze(roots),receipt});
}
