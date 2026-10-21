/** Accepted left cluster plus walk-through brush at the actual cave threshold. */
import {buildCavernUnderstoryPlant} from './geometry-cavern-understory.v1.js';
import {constructHEarthTriangleMesh,admitHEarthPrimitiveRecord} from './geometry-kernel.js';
import {projectGeologicalMeshForRenderer} from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
import {createEntranceFloorSupport} from './cavern-entrance-grass.v1.js';
import {projectRegionVertex,unprojectPlanetVertex} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
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
export const CAVERN_THRESHOLD_PLACEMENTS=Object.freeze([
 ['broadleaf',37.9,-262.0,1.15,.25],['broadleaf',42.1,-262.0,1.15,3.0],
 ['broadleaf',38.1,-260.6,1.20,.8],['broadleaf',41.9,-260.6,1.20,3.7],
 ['broadleaf',38.3,-259.35,1.10,1.3],['broadleaf',41.7,-259.3,1.10,4.2],
 ['fern',38.9,-261.6,1.05,.5],['fern',41.1,-261.4,1.05,3.4],
 ['fern',38.8,-259.0,.80,1.1],['fern',41.15,-258.95,.80,4.1],
 ['flower',38.4,-262.2,1.40,.3],['flower',41.6,-262.2,1.30,3.2],
 ['flower',39.5,-260.7,1.35,1.2],['flower',40.6,-260.4,1.20,4.0],
 ['flower',39.3,-259.1,1.15,.7],['flower',40.6,-258.9,1.10,3.5],
 ['groundcover',39.25,-260.1,.8,.9],['groundcover',40.9,-259.8,.8,3.6]
].map(([kind,x,z,scale,heading],i)=>Object.freeze({id:'CAVERN_THRESHOLD_'+i,kind,x,z,scale,heading})));
/** Sample only submitted outdoor or floor triangles; never the overhead mantle. */
export function createCavernThresholdSupport(model){
 const floor=createEntranceFloorSupport(model);
 return (x,z)=>{
  if(z<model.site.portalZ)return model.sampleOutdoorAt(x,z);
  const p=projectRegionVertex(x,model.formation.floorAt(x,z),z),hit=floor.sample(Math.fround(p.x),Math.fround(p.z));
  if(!hit)return null;
  const q=unprojectPlanetVertex(Math.fround(p.x),hit.y,Math.fround(p.z));
  return {y:q.y,role:'CAVERN_ENTRANCE_FLOOR'};
 };
}
export function buildCavernUnderstoryPlacement(model){
 if(model?.site?.id!=='B_REAR_RAVINE'||typeof model.sampleOutdoorAt!=='function'||typeof model.sampleWaterAt!=='function')throw Error('UNDERSTORY_SITE_REQUIRED');
 const groups=new Map(),placements=[],contacts=[],supportCache=new Map(),thresholdSupport=createCavernThresholdSupport(model);
 const support=(x,z,threshold=false)=>{
  const key=threshold+':'+x+':'+z;if(supportCache.has(key))return supportCache.get(key);
  const hit=threshold?thresholdSupport(x,z):model.sampleOutdoorAt(x,z),water=model.sampleWaterAt(x,z);
  if(!Number.isFinite(hit?.y))throw Error('UNDERSTORY_SUPPORT_MISSING:'+x+','+z);
  if(water&&water.y>=hit.y-.02)throw Error('UNDERSTORY_SUBMERGED');
  supportCache.set(key,hit.y);return hit.y;
 };
 for(const d of [...CAVERN_UNDERSTORY_PLACEMENTS,...CAVERN_THRESHOLD_PLACEMENTS]){
  const threshold=d.id.startsWith('CAVERN_THRESHOLD_');
  const rootY=support(d.x,d.z,threshold),plant=buildCavernUnderstoryPlant(d);
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
    const groundY=support(x,z,threshold),y=groundY+v.y-.012;
    if(!threshold&&x>=37.8)throw Error('UNDERSTORY_PASSAGE_OCCUPIED');
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
 return {meshes,contacts,receipt:{schema:'H_EARTH_CAVERN_UNDERSTORY_v1',siteId:model.site.id,clusterCount:3,side:'LEFT_ORIGINAL_AND_BILATERAL_THRESHOLD',originalPlantCount:17,thresholdPlantCount:CAVERN_THRESHOLD_PLACEMENTS.length,walkThroughBrush:true,navigationModified:false,plantCount:placements.length,placements,triangleCount,gpuByteLength,drawBatchCount:meshes.length,shadowCasterBatchCount:meshes.length,surfaceSource:'ACTUAL_EMITTED_OUTDOOR_AND_FLOOR_TRIANGLES',groundAdaptation:'CONNECTED_MESH_TERRAIN_FOLLOWING',perFrameGeneration:false,sourceTerrainMutated:false,existingPlantingMutated:false,physicalReview:'PENDING'}};
}
