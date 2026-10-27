/** Presentation-only reconciliation at the existing near/far topological seam.
 * Source buffers retain authority for geometry, contact and vegetation support.
 * Far normals stay inward: the existing fragment shader corrects their sign.
 */
const NEAR='H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_MOUNTAIN_NEUTRAL_PRIMITIVE_001';
const FAR='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION';
function boundaryEdges(indices,span){
 const edges=new Map();
 for(let k=span.indexStart;k<span.indexStart+span.indexCount;k+=3){
  for(let j=0;j<3;j++){
   const a=indices[k+j],b=indices[k+(j+1)%3];
   if(a===b)continue;
   if(a<span.vertexStart||b<span.vertexStart||a>=span.vertexStart+span.vertexCount||b>=span.vertexStart+span.vertexCount)throw Error('TERRAIN_SEAM_INDEX_OUTSIDE_SPAN');
   const key=a<b?`${a}:${b}`:`${b}:${a}`,edge=edges.get(key);
   if(edge)edge.count++;else edges.set(key,{a,b,count:1});
  }
 }
 return [...edges.values()].filter(e=>e.count===1);
}
export function createTerrainSeamPresentation({positions,normals,indices,coastDistances,contactDistances,primitiveSpans}){
 const near=primitiveSpans.find(s=>s.primitiveId===NEAR),far=primitiveSpans.find(s=>s.primitiveId===FAR),count=positions.length/3;
 if(!near||!far||!Number.isInteger(count)||normals.length!==positions.length||coastDistances.length!==count||contactDistances.length!==count)throw Error('TERRAIN_SEAM_INPUT_INVALID');
 const nearEdges=boundaryEdges(indices,near),farEdges=boundaryEdges(indices,far);
 const boundary=new Set(farEdges.flatMap(e=>[e.a,e.b]));
 const output={normals:new Float32Array(normals),coastDistances:new Float32Array(coastDistances),contactDistances:new Float32Array(contactDistances)};
 let matched=0,maxResidual=0;
 for(const id of boundary){
  const p=id*3,px=positions[p],py=positions[p+1],pz=positions[p+2];
  // Accept only agreement within the source Float32 coordinate resolution.
  const tolerance=Math.max(1e-6,2*Math.max(Math.abs(px),Math.abs(py),Math.abs(pz))*2**-23);
  let best=null,bestDistance=Infinity;
  for(const edge of nearEdges){
   const a=edge.a*3,b=edge.b*3,dx=positions[b]-positions[a],dy=positions[b+1]-positions[a+1],dz=positions[b+2]-positions[a+2],length2=dx*dx+dy*dy+dz*dz;
   if(length2===0)continue;
   const t=Math.max(0,Math.min(1,((px-positions[a])*dx+(py-positions[a+1])*dy+(pz-positions[a+2])*dz)/length2));
   const distance=Math.hypot(px-positions[a]-t*dx,py-positions[a+1]-t*dy,pz-positions[a+2]-t*dz);
   if(distance<bestDistance){bestDistance=distance;best={...edge,t};}
  }
  if(!best||bestDistance>tolerance)continue;
  const {a,b,t}=best;
  // Keep the raw linear interpolant. Normalizing a T-junction vertex here
  // would change interpolation along its subdivided boundary segments.
  for(let j=0;j<3;j++)output.normals[p+j]=-(normals[a*3+j]*(1-t)+normals[b*3+j]*t);
  if(!Number.isFinite(output.normals[p]+output.normals[p+1]+output.normals[p+2])||output.normals[p+1]>=0)throw Error('TERRAIN_SEAM_NORMAL_INVALID');
  output.coastDistances[id]=coastDistances[a]*(1-t)+coastDistances[b]*t;
  output.contactDistances[id]=contactDistances[a]*(1-t)+contactDistances[b]*t;
  if(!Number.isFinite(output.coastDistances[id]+output.contactDistances[id]))throw Error('TERRAIN_SEAM_SCALAR_INVALID');
  matched++;maxResidual=Math.max(maxResidual,bestDistance);
 }
 if(!matched)throw Error('TERRAIN_SEAM_NOT_FOUND');
 output.receipt=Object.freeze({schema:'H_EARTH_NEAR_FAR_SEAM_PRESENTATION_v1',matchedVertices:matched,maxPositionResidualMeters:maxResidual,sourceBuffersMutated:false,geometryChanged:false,vegetationSupportChanged:false,gpuBufferCountDelta:0,gpuByteLengthDelta:0});
 return output;
}

// Presentation-only geographic coast continuity for replacement soil. The
// rendered support/provider arrays and exposed-water contact remain untouched.
export function createGeologicalCoastPresentation(model,role,mesh,source,original){
 if(role!=='ERODED_TERRAIN'&&role!=='MOUNTAIN_OVERBURDEN')return original;
 if(original.length!==mesh.vertexCount)throw Error('COAST_PRESENTATION_LENGTH');
 const out=new Float32Array(original);
 for(let i=0;i<mesh.vertexCount;i++){
  const x=mesh.positions[i*3],y=mesh.positions[i*3+1],z=mesh.positions[i*3+2];
  const h=Math.hypot(x,z),k=h>Number.EPSILON?Math.atan2(h,y+420000)*420000/h:0;
  const q=model.originalTerrainContactAt(x*k,z*k);
  if(!q||q.ids.some(id=>source.roleCodes[id]!==1))throw Error('COAST_PRESENTATION_SOURCE');
  const value=q.ids.reduce((sum,id,j)=>sum+q.weights[j]*source.coastDistances[id],0);
  if(!Number.isFinite(value))throw Error('COAST_PRESENTATION_NONFINITE');
  out[i]=value;
 }
 return out;
}
