/** One terrain-following planting cluster; accepted palms and grass remain independent. */
import {buildCavernUnderstoryPlant} from './geometry-cavern-understory.v1.js';
import {constructHEarthTriangleMesh,admitHEarthPrimitiveRecord} from './geometry-kernel.js';
import {projectGeologicalMeshForRenderer} from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
import {CAVERN_PALM_PLACEMENTS} from './cavern-palm-placement.v1.js';

export const CAVERN_UNDERSTORY_PLACEMENTS=Object.freeze([
 ['broadleaf',34.55,-265.8,1.05,.3],['broadleaf',33.45,-267.0,.86,2.1],
 ['fern',35.45,-267.2,1.05,.7],['fern',32.7,-268.0,.8,2.8],
 ['flower',34.45,-268.15,1.25,.25],['flower',35.5,-268.6,1.05,1.7],
 ['flower',33.25,-269.0,.95,3.4],
 ['groundcover',33.1,-265.8,.68,.5],['groundcover',32.6,-266.8,.72,1.4],
 ['groundcover',34.8,-267.7,.8,2.2],['groundcover',36.3,-267.9,.68,.9],
 ['groundcover',35.95,-269.1,.75,2.9],['groundcover',34.8,-269.5,.7,4.2],
 ['groundcover',33.8,-269.8,.65,1.2],['groundcover',32.7,-269.6,.55,2.6],
 ['groundcover',32.0,-268.6,.5,3.2],['groundcover',34.0,-268.1,.65,5.4]
].map(([kind,x,z,scale,heading],i)=>Object.freeze({id:'CAVERN_UNDERSTORY_'+i,kind,x,z,scale,heading})));
export function buildCavernUnderstoryPlacement(model){
 if(model?.site?.id!=='B_REAR_RAVINE'||typeof model.sampleOutdoorAt!=='function'||typeof model.sampleWaterAt!=='function')throw Error('UNDERSTORY_SITE_REQUIRED');
 const groups=new Map(),placements=[],contacts=[],supportCache=new Map();
 const support=(x,z)=>{
  const key=x+':'+z;if(supportCache.has(key))return supportCache.get(key);
  const hit=model.sampleOutdoorAt(x,z),water=model.sampleWaterAt(x,z);
  if(!Number.isFinite(hit?.y))throw Error('UNDERSTORY_SUPPORT_MISSING');
  if(water&&water.y>=hit.y-.02)throw Error('UNDERSTORY_SUBMERGED');
  supportCache.set(key,hit.y);return hit.y;
 };
 for(const d of CAVERN_UNDERSTORY_PLACEMENTS){
  const rootY=support(d.x,d.z),plant=buildCavernUnderstoryPlant(d);
  if(CAVERN_PALM_PLACEMENTS.some(p=>Math.hypot(d.x-p.x,d.z-p.z)<p.radius*1.2+.18))throw Error('UNDERSTORY_PALM_ROOT_COLLISION');
  let maximumHeight=0;
  for(const part of plant.parts){
   const g=part.geometry,key=part.leaflets?'FOLIAGE':'STEMS';
   if(!groups.has(key))groups.set(key,{vertices:[],indices:[],colors:[],leaflets:part.leaflets});
   const m=groups.get(key),offset=m.vertices.length;
   for(let i=0;i<g.vertices.length;i++){
    const v=g.vertices[i],x=d.x+v.x,z=d.z+v.z;
    // Every vertex follows the actual emitted soil beneath it. This adapts the
    // connected stem/leaf mesh to the shoulder without hovering basal leaves.
    const groundY=support(x,z),y=groundY+v.y-.012;
    if(x>=37.8)throw Error('UNDERSTORY_PASSAGE_OCCUPIED');
    if(CAVERN_PALM_PLACEMENTS.some(p=>Math.hypot(x-p.x,z-p.z)<p.radius*1.2+.08))throw Error('UNDERSTORY_PALM_COLLISION');
    m.vertices.push({x,y,z});m.colors.push(g.attributes.colors[i]);maximumHeight=Math.max(maximumHeight,v.y);
   }
   m.indices.push(...g.indices.map(i=>i+offset));
  }
  contacts.push({id:d.id,x:d.x,z:d.z,groundY:rootY,rootY:rootY-.012});
  placements.push({...d,rootY:rootY-.012,maximumHeight});
 }
 const meshes=[...groups].map(([key,m])=>{
  const constructed=constructHEarthTriangleMesh({primitiveId:'CAVERN_UNDERSTORY_'+key,vertices:m.vertices,indices:m.indices,expectedClosure:'OPEN_ALLOWED',semanticRole:'CAVERN_UNDERSTORY',attributes:{colors:m.colors}});
  if(!constructed.valid)throw Error('UNDERSTORY_PLACEMENT_CONSTRUCTION:'+JSON.stringify(constructed.issues));
  const admitted=admitHEarthPrimitiveRecord(constructed.primitiveRecord);
  if(!admitted.valid)throw Error('UNDERSTORY_PLACEMENT_ADMISSION:'+JSON.stringify(admitted.issues));
  const positions=Float32Array.from(m.vertices.flatMap(v=>[v.x,v.y,v.z]));
  return {role:'CAVERN_UNDERSTORY',part:key,leaflets:m.leaflets,mesh:projectGeologicalMeshForRenderer({positions,indices:Uint32Array.from(m.indices)}),colors:m.colors};
 });
 const triangleCount=meshes.reduce((n,p)=>n+p.mesh.triangleCount,0),gpuByteLength=meshes.reduce((n,p)=>n+p.mesh.vertexCount*69+p.mesh.indices.byteLength,0);
 if(triangleCount>10000||gpuByteLength>2097152||meshes.length>3)throw Error('UNDERSTORY_BUDGET_EXCEEDED');
 return {meshes,contacts,receipt:{schema:'H_EARTH_CAVERN_UNDERSTORY_v1',siteId:model.site.id,clusterCount:1,side:'LEFT',plantCount:placements.length,placements,triangleCount,gpuByteLength,drawBatchCount:meshes.length,shadowCasterBatchCount:meshes.length,surfaceSource:'ACTUAL_EMITTED_OUTDOOR_TRIANGLES',groundAdaptation:'CONNECTED_MESH_TERRAIN_FOLLOWING',perFrameGeneration:false,sourceTerrainMutated:false,existingPlantingMutated:false,physicalReview:'PENDING'}};
}
