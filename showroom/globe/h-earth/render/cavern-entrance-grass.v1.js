/** Bounded entrance planting; never rewrites the authenticated saved population. */
import {projectRegionVertex,unprojectPlanetVertex} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
const f=Math.fround,smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const hash=(x,z)=>{let h=Math.imul(x^0x45d9f3b,z^0x27d4eb2d);h=Math.imul(h^(h>>>16),0x45d9f3b);return(h>>>0)/4294967296;};
export const CAVERN_GRASS_LIMIT=130000;
export const CAVERN_SLOPE_REPAIR=Object.freeze({bounds:Object.freeze([-10,-330,88,-235]),maximumAddedRoots:100000,referenceDensity:41.9375,spacing:.14});
/** One continuous field over both slopes, conditioned on surrounding meadow
 * occupancy and low-pass terrain slope rather than separate planting shapes. */
export function createCavernSlopeDensityField({densityAt,slopeAt}){
 const [x0,z0,x1,z1]=CAVERN_SLOPE_REPAIR.bounds,pad=16,w=x1-x0+pad*2,h=z1-z0+pad*2,ox=x0-pad,oz=z0-pad;
 const density=new Float64Array(w*h),slope=new Float64Array(w*h),kernel=Array.from({length:17},(_,i)=>Math.exp(-(((i-8)/4)**2)/2)),kernelSum=kernel.reduce((a,b)=>a+b,0);
 for(let z=0;z<h;z++)for(let x=0;x<w;x++){density[z*w+x]=Math.min(1,densityAt(ox+x+.5,oz+z+.5)/24);slope[z*w+x]=Math.min(1.6,slopeAt(ox+x+.5,oz+z+.5));}
 const blur=input=>{const a=new Float64Array(input.length),b=new Float64Array(input.length);for(let z=0;z<h;z++)for(let x=0;x<w;x++)for(let k=-8;k<=8;k++)a[z*w+x]+=input[z*w+Math.max(0,Math.min(w-1,x+k))]*kernel[k+8]/kernelSum;for(let z=0;z<h;z++)for(let x=0;x<w;x++)for(let k=-8;k<=8;k++)b[z*w+x]+=a[Math.max(0,Math.min(h-1,z+k))*w+x]*kernel[k+8]/kernelSum;return b;};
 const cover=blur(blur(density)),terrainSlope=blur(slope);
 const sample=(array,x,z)=>{const px=x-ox-.5,pz=z-oz-.5,ix=Math.floor(px),iz=Math.floor(pz),u=px-ix,v=pz-iz;return (array[iz*w+ix]*(1-u)+array[iz*w+ix+1]*u)*(1-v)+(array[(iz+1)*w+ix]*(1-u)+array[(iz+1)*w+ix+1]*u)*v;};
 return {sample(x,z){if(x<=x0||x>=x1||z<=z0||z>=z1)return 0;
  const edge=Math.min(x-x0,x1-x,z-z0,z1-z),feather=14+3*Math.sin(x*.061+z*.037),boundary=smooth(edge/feather);
  const continuity=smooth((sample(cover,x,z)-.025)/.32),slopeWeight=1-smooth((sample(terrainSlope,x,z)-.35)/.95);
  return CAVERN_SLOPE_REPAIR.referenceDensity*.8*continuity*slopeWeight*boundary;
 },bounds:CAVERN_SLOPE_REPAIR.bounds};
}
export function entranceWeight(x,z){
 if(z<-292||z>-258||Math.abs(x-40)>12)return 0;
 if(z>=-260)return (1-smooth((z+260)/2))*(1-smooth((Math.abs(x-40)-1.8)/.8));
 const width=10.2+.65*Math.sin(z*.37)+.45*Math.sin(z*.83);
 return (1-smooth((Math.abs(x-40)-width+2)/2))*smooth((z+292)/5);
}
/** Broad entrance shoulder blend, shared numerically with the vertex shader. */
export function entranceBlend(x,z){
 const edge=8+1.2*Math.sin(z*.17)+.7*Math.sin(z*.41);
 return (1-smooth((Math.abs(x-40)-edge)/18))*smooth((z+302)/15)*(1-smooth((z+262)/4));
}
export const ENTRANCE_BLEND_GLSL=`float entranceBlend(vec2 p){float edge=8.+1.2*sin(p.y*.17)+.7*sin(p.y*.41);return (1.-smoothstep(edge,edge+18.,abs(p.x-40.)))*smoothstep(-302.,-287.,p.y)*(1.-smoothstep(-262.,-258.,p.y));}`;
/** Only low-slope triangles adjacent to the actual floor qualify inside. */
export function createEntranceFloorSupport(model){
 const parts=model.meshes.filter(p=>p.role==='CAVERN_PHYSICAL_SHELL'),triangles=[];
 for(const {mesh} of parts)for(let i=0;i<mesh.indices.length;i+=3){
  const p=[0,1,2].map(k=>Array.from(mesh.positions.slice(mesh.indices[i+k]*3,mesh.indices[i+k]*3+3)));
  const local=p.map(a=>unprojectPlanetVertex(...a));
  if(local.some(q=>q.z<-260.05||q.z>-257.5||Math.abs(q.x-40)>3.5||Math.abs(q.y-model.formation.floorAt(q.x,q.z))>.35))continue;
  const [a,b,c]=p,det=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);
  if(Math.abs(det)<1e-9)continue;
  const u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-a[k]);
  const slope=Math.hypot(u[1]*v[2]-u[2]*v[1],u[0]*v[1]-u[1]*v[0])/Math.abs(det);
  if(slope>.7)continue;
  triangles.push({p,det,slope,triangleId:i/3});
 }
 return {triangleCount:triangles.length,sample(x,z){
  let best=null;
  for(const {p:[a,b,c],det,slope,triangleId} of triangles){
   const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/det,v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/det,w=1-u-v;
   if(Math.min(u,v,w)<-1e-7)continue;
   const y=f(u*a[1]+v*b[1]+w*c[1]);if(!best||y<best.y)best={x:f(x),y,z:f(z),slope,triangleId,owner:'CAVERN_ENTRANCE_FLOOR'};
  }return best;
 }};
}
export async function buildCavernEntranceGrass({existingTiles,visibleSurface,geology,palms=[],yieldControl=async()=>{},includeSlopeRepair=true}){
 if(!Array.isArray(existingTiles)||typeof visibleSurface?.sample!=='function'||!geology?.formation)throw Error('ENTRANCE_GRASS_INPUT');
 const physicalCounts=new Map();
 for(const tile of existingTiles){const k=`${tile.minX}:${tile.minZ}`;physicalCounts.set(k,(physicalCounts.get(k)??0)+tile.count);}
 const occupied=new Map(),cell=(x,z)=>`${Math.floor(x/.08)}:${Math.floor(z/.08)}`;
 const remember=(x,z)=>{const k=cell(x,z);if(!occupied.has(k))occupied.set(k,[]);occupied.get(k).push([x,z]);};
 for(const tile of existingTiles){
  if(tile.minX>96||tile.minX+4<-11||tile.minZ>-234||tile.minZ+4<-331)continue;
  for(let i=0;i<tile.packed.length;i+=4)remember(tile.packed[i],tile.packed[i+2]);
 }
 const near=(x,z)=>{const ix=Math.floor(x/.08),iz=Math.floor(z/.08);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(const p of occupied.get(`${ix+a}:${iz+b}`)??[])if(Math.hypot(p[0]-x,p[1]-z)<.075)return true;return false;};
 const density=new Map();for(const tile of existingTiles)for(let i=0;i<tile.packed.length;i+=4){const k=`${Math.floor(tile.packed[i])}:${Math.floor(tile.packed[i+2])}`;density.set(k,(density.get(k)??0)+1);}
 const rejected={support:0,slope:0,water:0,density:0};let haloCount=0;
 const floor=createEntranceFloorSupport(geology),tiles=new Map();let contactCount=0,interiorCount=0,duplicatesAvoided=0;
 for(let pass=0;pass<2;pass++)for(let iz=pass?-72:0;iz<243;iz++){
  // Independent full-cell offsets remove fixed planting rows.
  for(let ix=pass?-115:0;ix<(pass?287:172);ix++){
   const x=28+(ix+hash(ix+431,iz+719))*.14,z=-292+(iz+hash(ix+977,iz+239))*.14,core=entranceWeight(x,z),weight=pass?.38*entranceBlend(x,z):core;
   const roll=hash(ix+731,iz+97);if(roll>weight*.94||(pass&&roll<=core*.94))continue;
   if(palms.some(p=>Math.hypot(x-p.x,z-p.z)<p.radius*1.2+.18))continue;
   const q=projectRegionVertex(x,geology.formation.floorAt(x,z),z),px=f(q.x),pz=f(q.z);
   if(near(px,pz)){duplicatesAvoided++;continue;}
   const hit=z>=-260?floor.sample(px,pz):visibleSurface.sample(px,pz);
   if(!hit){rejected.support++;continue;}if(hit.slope>(z>=-260?.7:1.35)){rejected.slope++;continue;}
   const local=unprojectPlanetVertex(px,hit.y,pz),water=geology.sampleWaterAt(local.x,local.z);
   if(water&&water.y>local.y+.04){rejected.water++;continue;}
   const densityKey=`${Math.floor(px)}:${Math.floor(pz)}`;if(pass&&(density.get(densityKey)??0)>=Math.ceil(24*entranceBlend(x,z))){rejected.density++;continue;}
   if(z>=-260&&(!geology.formation.insideVoid(local.x,local.y+.25,local.z)||local.z>-258))continue;
   const minX=Math.floor(px/4)*4,minZ=Math.floor(pz/4)*4,id=`CAVERN_ENTRANCE:${minX}:${minZ}`;
   const physicalKey=`${minX}:${minZ}`;if((physicalCounts.get(physicalKey)??0)>=1600)continue;
   physicalCounts.set(physicalKey,(physicalCounts.get(physicalKey)??0)+1);
   if(!tiles.has(id))tiles.set(id,{id,minX,minZ,roots:[]});
   tiles.get(id).roots.push({x:px,y:hit.y,z:pz,angle:hash(ix+11,iz+17)*Math.PI*2,seed:(iz*172+ix)>>>0,slope:hit.slope,triangleId:hit.triangleId,region:'RAVINE_SUPPLEMENT',support:hit.owner});remember(px,pz);density.set(densityKey,(density.get(densityKey)??0)+1);if(pass)haloCount++;contactCount++;if(z>=-260)interiorCount++;
   if(contactCount>CAVERN_GRASS_LIMIT)throw Error('ENTRANCE_GRASS_BUDGET');
  }
  if(iz%16===0)await yieldControl();
 }
 if(!contactCount||!interiorCount)throw Error('ENTRANCE_GRASS_SUPPORT_EMPTY');
 if(!includeSlopeRepair)return {tiles:[...tiles.values()],receipt:{schema:'H_EARTH_CAVERN_ENTRANCE_GRASS_v1',contactCount,interiorCount,haloCount,rejected,duplicatesAvoided,floorTriangleCount:floor.triangleCount,maximumAddedRoots:CAVERN_GRASS_LIMIT,existingRootsPreserved:true,interiorMaximumDepthMeters:2,perFrameGeneration:false}};
 const priorEntranceCount=contactCount,slopeTiles=new Map(),slopeStarted=performance.now();
 const terrainHit=(x,z)=>{const q={x:f(x),z:f(z)};return {q,hit:visibleSurface.sample(q.x,q.z)};};
 const field=createCavernSlopeDensityField({densityAt:(x,z)=>density.get(`${Math.floor(x)}:${Math.floor(z)}`)??0,slopeAt:(x,z)=>terrainHit(x,z).hit?.slope??1.6});
 const [x0,z0,x1,z1]=field.bounds,s=CAVERN_SLOPE_REPAIR.spacing,slopeRejected={support:0,slope:0,water:0,palm:0,duplicate:0},witnessRejected={support:0,slope:0,water:0,palm:0,entrance:0},unfilled=[];
 let slopeCount=0,targetDeficit=0,remainingDeficit=0,eligibleCells=0,leftAdded=0,rightAdded=0;
 for(let cz=z0;cz<z1;cz++){
  for(let cx=x0;cx<x1;cx++){
   const expected=field.sample(cx+.5,cz+.5),quota=Math.floor(expected)+(hash(cx+9011,cz+9173)<expected%1?1:0),key=`${cx}:${cz}`,before=density.get(key)??0;
   if(quota<=before)continue;
   // Four actual support witnesses scale the quota by dry usable cell area.
   let dry=0;for(const dz of [.25,.75])for(const dx of [.25,.75]){const {q,hit}=terrainHit(cx+dx,cz+dz);if(!hit){witnessRejected.support++;continue;}if(hit.slope>1.35){witnessRejected.slope++;continue;}const local=unprojectPlanetVertex(q.x,hit.y,q.z),water=geology.sampleWaterAt(local.x,local.z);if(water&&water.y>local.y+.04){witnessRejected.water++;continue;}if(floor.sample(q.x,q.z)){witnessRejected.entrance++;continue;}if(palms.some(p=>Math.hypot(local.x-p.x,local.z-p.z)<p.radius*1.2+.18)){witnessRejected.palm++;continue;}dry++;}
   const target=Math.round(quota*dry/4);if(target<=before)continue;eligibleCells++;targetDeficit+=target-before;
   const proposals=[];
   for(let iz=Math.floor(cz/s);iz<Math.ceil((cz+1)/s);iz++)for(let ix=Math.floor(cx/s);ix<Math.ceil((cx+1)/s);ix++){
    const x=(ix+hash(ix+17431,iz+17719))*s,z=(iz+hash(ix+17977,iz+17239))*s;if(x<cx||x>=cx+1||z<cz||z>=cz+1)continue;
    proposals.push({x,z,ix,iz,rank:hash(ix+18731,iz+18097)});
   }
   proposals.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);
   for(const {x,z,ix,iz}of proposals){
    if((density.get(key)??0)>=target)break;
    const {q,hit}=terrainHit(x,z),px=f(q.x),pz=f(q.z);
    if(!hit){slopeRejected.support++;continue;}if(hit.slope>1.35){slopeRejected.slope++;continue;}
    const local=unprojectPlanetVertex(px,hit.y,pz),water=geology.sampleWaterAt(local.x,local.z);if(water&&water.y>local.y+.04){slopeRejected.water++;continue;}
    if(palms.some(p=>Math.hypot(local.x-p.x,local.z-p.z)<p.radius*1.2+.18)){slopeRejected.palm++;continue;}
    if(floor.sample(px,pz))continue;
    if(near(px,pz)){slopeRejected.duplicate++;continue;}
    const minX=Math.floor(px/4)*4,minZ=Math.floor(pz/4)*4,physicalKey=`${minX}:${minZ}`;if((physicalCounts.get(physicalKey)??0)>=1600)throw Error('CAVERN_SLOPE_TILE_BUDGET');
    const id=`CAVERN_SLOPE:${minX}:${minZ}`;if(!slopeTiles.has(id))slopeTiles.set(id,{id,minX,minZ,roots:[]});
    slopeTiles.get(id).roots.push({x:px,y:hit.y,z:pz,angle:hash(ix+19011,iz+19017)*Math.PI*2,seed:(Math.imul(ix,73856093)^Math.imul(iz,19349663))>>>0,slope:hit.slope,triangleId:hit.triangleId,region:'RAVINE_SUPPLEMENT',support:hit.owner});
    remember(px,pz);physicalCounts.set(physicalKey,(physicalCounts.get(physicalKey)??0)+1);const actualKey=`${Math.floor(px)}:${Math.floor(pz)}`;density.set(actualKey,(density.get(actualKey)??0)+1);slopeCount++;if(x<40)leftAdded++;else rightAdded++;
    if(slopeCount>CAVERN_SLOPE_REPAIR.maximumAddedRoots)throw Error('CAVERN_SLOPE_BUDGET_REQUIRES_REDESIGN');
   }
   const deficit=Math.max(0,target-(density.get(key)??0));if(deficit){remainingDeficit+=deficit;unfilled.push({x:cx,z:cz,target,before,final:density.get(key)??0});}
  }
  if((cz-z0)%4===0)await yieldControl();
 }
 contactCount+=slopeCount;
 const slopeRepair={schema:'H_EARTH_CAVERN_SLOPE_CONTINUITY_v1',bounds:field.bounds,priorEntranceCount,addedRoots:slopeCount,leftAdded,rightAdded,eligibleCells,targetDeficit,remainingDeficit,unfilledCells:unfilled.length,unfilledWitnesses:unfilled.slice(0,16),rejected:slopeRejected,witnessRejected,referenceDensity:CAVERN_SLOPE_REPAIR.referenceDensity,maximumTargetDensity:CAVERN_SLOPE_REPAIR.referenceDensity*.8,maximumAddedRoots:CAVERN_SLOPE_REPAIR.maximumAddedRoots,generationMs:performance.now()-slopeStarted,field:'MEADOW_OCCUPANCY_LOW_PASS_WITH_SMOOTH_TERRAIN_SLOPE_AND_FEATHERED_SURVEY_LIMIT',priorRootsPreserved:true,iterationOrderTruncation:false};
 return {tiles:[...tiles.values(),...slopeTiles.values()],receipt:{schema:'H_EARTH_CAVERN_ENTRANCE_GRASS_v1',contactCount,interiorCount,haloCount,rejected,duplicatesAvoided,floorTriangleCount:floor.triangleCount,maximumAddedRoots:CAVERN_GRASS_LIMIT,existingRootsPreserved:true,interiorMaximumDepthMeters:2,perFrameGeneration:false,slopeRepair}};
}
