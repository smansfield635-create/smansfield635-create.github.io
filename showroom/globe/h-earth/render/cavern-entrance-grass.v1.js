/** Bounded entrance planting; never rewrites the authenticated saved population. */
import {projectRegionVertex,unprojectPlanetVertex} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
const f=Math.fround,smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const hash=(x,z)=>{let h=Math.imul(x^0x45d9f3b,z^0x27d4eb2d);h=Math.imul(h^(h>>>16),0x45d9f3b);return(h>>>0)/4294967296;};
export const CAVERN_GRASS_LIMIT=30000;
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
export async function buildCavernEntranceGrass({existingTiles,visibleSurface,geology,palms=[],yieldControl=async()=>{}}){
 if(!Array.isArray(existingTiles)||typeof visibleSurface?.sample!=='function'||!geology?.formation)throw Error('ENTRANCE_GRASS_INPUT');
 const physicalCounts=new Map();
 for(const tile of existingTiles){const k=`${tile.minX}:${tile.minZ}`;physicalCounts.set(k,(physicalCounts.get(k)??0)+tile.count);}
 const occupied=new Map(),cell=(x,z)=>`${Math.floor(x/.08)}:${Math.floor(z/.08)}`;
 const remember=(x,z)=>{const k=cell(x,z);if(!occupied.has(k))occupied.set(k,[]);occupied.get(k).push([x,z]);};
 for(const tile of existingTiles){
  if(tile.minX>70||tile.minX+4<10||tile.minZ>-257||tile.minZ+4<-303)continue;
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
 return {tiles:[...tiles.values()],receipt:{schema:'H_EARTH_CAVERN_ENTRANCE_GRASS_v1',contactCount,interiorCount,haloCount,rejected,duplicatesAvoided,floorTriangleCount:floor.triangleCount,maximumAddedRoots:CAVERN_GRASS_LIMIT,existingRootsPreserved:true,interiorMaximumDepthMeters:2,perFrameGeneration:false}};
}
