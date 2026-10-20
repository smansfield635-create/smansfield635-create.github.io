/** Four accepted palms, grounded on the existing rendered outdoor triangles. */
import {buildCavernPalm} from './geometry-cavern-palms.v1.js';
import {projectGeologicalMeshForRenderer} from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
export const CAVERN_PALM_PLACEMENTS=Object.freeze([
 {id:'CAVERN_LEFT_TALL',x:34.5,z:-267.5,height:4.8,lean:2.8,heading:0,radius:.36,frondLength:3.8},
 {id:'CAVERN_LEFT_SHORT',x:35,z:-269,height:4.1,lean:1.3,heading:0,radius:.32,frondLength:3},
 {id:'CAVERN_RIGHT_TALL',x:45.5,z:-267.5,height:4.3,lean:2.5,heading:Math.PI,radius:.36,frondLength:3.8},
 {id:'CAVERN_RIGHT_SHORT',x:45,z:-270,height:4.1,lean:1.3,heading:Math.PI,radius:.32,frondLength:3}
].map(Object.freeze));
export function buildCavernPalmPlacement(model){
 if(model?.site?.id!=='B_REAR_RAVINE'||typeof model.sampleOutdoorAt!=='function')throw Error('PALM_SITE_SUPPORT_REQUIRED');
 const meshes=[],placements=[];
 for(const descriptor of CAVERN_PALM_PLACEMENTS){
  const {x,z,radius}=descriptor;
  // Sink the foot to the lowest support under its flared circumference:
  // every rim point meets or enters soil even on a sloping shoulder.
  const supports=Array.from({length:16},(_,j)=>{
   const a=j*Math.PI/8,q=model.sampleOutdoorAt(x+1.2*radius*Math.cos(a),z+1.2*radius*Math.sin(a));
   if(!Number.isFinite(q?.y))throw Error('PALM_GROUND_CONTACT_MISSING:'+descriptor.id);
   return q.y;
  });
  const center=model.sampleOutdoorAt(x,z);
  if(!Number.isFinite(center?.y))throw Error('PALM_GROUND_CONTACT_MISSING:'+descriptor.id);
  supports.push(center.y);
  const rootY=Math.min(...supports)-.04;
  if(Math.max(...supports)-Math.min(...supports)>1.2)throw Error('PALM_SUPPORT_TOO_STEEP:'+descriptor.id);
  const palm=buildCavernPalm(descriptor);
  for(const part of palm.parts){
   const g=part.geometry,positions=new Float32Array(g.vertices.length*3);
   g.vertices.forEach((v,i)=>positions.set([v.x+x,v.y+rootY,v.z+z],i*3));
   meshes.push(Object.freeze({role:'CAVERN_PALM',leaflets:part===palm.parts[2],
    mesh:projectGeologicalMeshForRenderer({positions,indices:new Uint32Array(g.indices)}),
    colors:g.attributes.colors}));
  }
  placements.push(Object.freeze({...descriptor,rootY,supportRange:[Math.min(...supports),Math.max(...supports)],crown:[x+palm.crown[0],rootY+palm.crown[1],z+palm.crown[2]]}));
 }
 return Object.freeze({meshes:Object.freeze(meshes),receipt:Object.freeze({schema:'H_EARTH_CAVERN_PALM_INTEGRATION_v1',acceptedPrototype:'a3341e9b8b9038c6fde4407fd799f744b150bd26',placements,treeCount:4,triangleCount:meshes.reduce((n,p)=>n+p.mesh.triangleCount,0),twoSidedLeaflets:true,perFrameGeneration:false,sourceTerrainMutated:false})});
}
