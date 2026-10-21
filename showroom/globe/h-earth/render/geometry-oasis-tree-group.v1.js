/** Gen2855: four cavern-side trees. Presentation overlay; hydrated source stays intact. */
import {appendHEarthAgedWoodlandTree} from './geometry-aged-woodland-tree.v1.js';
import {constructHEarthTriangleMesh,admitHEarthPrimitiveRecord} from './geometry-kernel.js';
import {projectGeologicalMeshForRenderer} from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';

// Owner's second-from-left specimen keeps its established riverbank anchor.
// The companions step back and forward rather than following one planted row.
export const OASIS_TREE_PLACEMENTS=Object.freeze([
 {id:'PROPOSED_OASIS_01',x:55.5,z:-307.5,sourceX:55.5,sourceZ:-307.5,scaleX:1,scaleY:1,scaleZ:1,heading:.22,agedFocus:true},
 {id:'PROPOSED_OASIS_02',x:46,z:-320,sourceX:47.5,sourceZ:-317.5,scaleX:.72,scaleY:.94,scaleZ:.82,heading:2.14,agedFocus:false},
 {id:'PROPOSED_OASIS_03',x:74,z:-290,sourceX:71.5,sourceZ:-291.5,scaleX:.84,scaleY:.83,scaleZ:.69,heading:4.07,agedFocus:false},
 {id:'PROPOSED_OASIS_04',x:65,z:-306,sourceX:63.5,sourceZ:-301.5,scaleX:.79,scaleY:.88,scaleZ:.88,heading:5.36,agedFocus:false}
].map(Object.freeze));
const empty=()=>({vertices:[],indices:[],colors:[],clearingAttributes:[]});
const segmentDistance=(x,z,a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,d=dx*dx+dz*dz,t=d?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/d)):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);};
const boundsOf=vs=>({min:['x','y','z'].map(k=>Math.min(...vs.map(v=>v[k]))),max:['x','y','z'].map(k=>Math.max(...vs.map(v=>v[k])))});

export function buildOasisTreeGroup(model){
 if(model?.site?.id!=='B_REAR_RAVINE'||typeof model.sampleOutdoorAt!=='function'||typeof model.sampleWaterAt!=='function')throw Error('OASIS_GROUP_ACTUAL_SURFACE_REQUIRED');
 const groups={BARK:empty(),CANOPY:empty()},placements=[],contacts=[];
 for(const d of OASIS_TREE_PLACEMENTS){
  const center=model.sampleOutdoorAt(d.x,d.z);if(!Number.isFinite(center?.y))throw Error('OASIS_GROUP_ROOT_SUPPORT:'+d.id);
  const rootY=center.y,c=Math.cos(d.heading),s=Math.sin(d.heading);
  const toWorld=(x,z)=>({x:d.x+c*x*d.scaleX-s*z*d.scaleZ,z:d.z+s*x*d.scaleX+c*z*d.scaleZ});
  const supportCache=new Map();
  const ground=(x,z)=>{
   const key=x+','+z;if(supportCache.has(key))return supportCache.get(key);
   const q=toWorld(x,z),hit=model.sampleOutdoorAt(q.x,q.z),water=model.sampleWaterAt(q.x,q.z);
   if(!Number.isFinite(hit?.y))throw Error('OASIS_GROUP_CONTACT_MISSING:'+d.id);
   if(water&&water.y>=hit.y-.03)throw Error('OASIS_GROUP_WATER_CONTACT:'+d.id);
   if(estate.footRoute.slice(1).some((b,i)=>segmentDistance(q.x,q.z,estate.footRoute[i],b)<=estate.footRouteRadius+.3))throw Error('OASIS_GROUP_WALK_CONTACT:'+d.id);
   const out={y:(hit.y-rootY)/d.scaleY,triangle:hit.role??'OUTDOOR_TERRAIN'};supportCache.set(key,out);return out;
  };
  // Reuse the saved A08 construction as a shape template, never as scene identity.
  const bark=empty(),foliage=empty(),shape=appendHEarthAgedWoodlandTree({bark,foliage,p:{id:'P2_TREE_A_08',x:0,z:0,anchor:{y:0}},ground});
  const spans={};
  for(const [key,m]of [['BARK',bark],['CANOPY',foliage]]){
   const dst=groups[key],offset=dst.vertices.length,indexStart=dst.indices.length;
   const transformed=m.vertices.map(v=>{const q=toWorld(v.x,v.z);return{x:q.x,y:rootY+v.y*d.scaleY,z:q.z};});
   // Keep every low wooden point out of the established walk corridor.
   if(key==='BARK')for(const v of transformed)if(v.y-rootY<2.5&&estate.footRoute.slice(1).some((b,i)=>segmentDistance(v.x,v.z,estate.footRoute[i],b)<=estate.footRouteRadius+.3))throw Error('OASIS_GROUP_LOW_WOOD_WALK:'+d.id);
   dst.vertices.push(...transformed);dst.indices.push(...m.indices.map(i=>i+offset));
   dst.colors.push(...m.colors.map(a=>a.slice(0,3).map(v=>v/255)));dst.clearingAttributes.push(...m.clearingAttributes.map(a=>[...a]));
   spans[key]={vertexStart:offset,vertexCount:m.vertices.length,indexStart,indexCount:m.indices.length,bounds:boundsOf(transformed)};
  }
  const witnesses=shape.support.witnesses.map(w=>{const q=toWorld(w.x,w.z);return{id:d.id,x:q.x,z:q.z,surfaceY:rootY+w.surfaceY*d.scaleY,meshY:rootY+w.meshY*d.scaleY,burial:w.burial*d.scaleY};});
  contacts.push(...witnesses);
  placements.push({...d,sourceAnchor:{x:d.sourceX,z:d.sourceZ},rootY,spans,rootCount:shape.visualTree.roots.length,leafCount:shape.visualTree.leafCount,triangleCount:shape.visualTree.triangleCount,minimumBurial:Math.min(...witnesses.map(w=>w.burial)),visualHeight:shape.visualTree.visualHeight*d.scaleY,shapeTemplate:'SAVED_AGED_A08',groundSamples:supportCache.size});
 }
 const meshes=Object.entries(groups).map(([part,m])=>{
  const built=constructHEarthTriangleMesh({primitiveId:'OASIS_TREE_GROUP_'+part,vertices:m.vertices,indices:m.indices,expectedClosure:'OPEN_ALLOWED',semanticRole:'OASIS_TREE_GROUP',attributes:{colors:m.colors}});
  if(!built.valid)throw Error('OASIS_GROUP_CONSTRUCTION:'+JSON.stringify(built.issues));
  const admitted=admitHEarthPrimitiveRecord(built.primitiveRecord);if(!admitted.valid)throw Error('OASIS_GROUP_ADMISSION:'+JSON.stringify(admitted.issues));
  const positions=Float32Array.from(m.vertices.flatMap(v=>[v.x,v.y,v.z]));
  return{role:'OASIS_TREE_GROUP',part,leaflets:part==='CANOPY',mesh:projectGeologicalMeshForRenderer({positions,indices:Uint32Array.from(m.indices)}),colors:m.colors,clearingAttributes:m.clearingAttributes};
 });
 const triangleCount=meshes.reduce((n,p)=>n+p.mesh.triangleCount,0),gpuByteLength=meshes.reduce((n,p)=>n+p.mesh.vertexCount*69+p.mesh.indices.byteLength,0);
 if(triangleCount>33000||gpuByteLength>5*1024*1024||meshes.length!==2)throw Error('OASIS_GROUP_BUDGET_EXCEEDED');
 return{meshes,contacts,receipt:{schema:'H_EARTH_OASIS_TREE_GROUP_v1',targetId:'PROPOSED_OASIS_01',treeCount:4,placements,triangleCount,gpuByteLength,drawBatchCount:2,shadowCasterBatchCount:0,castShadowClaim:false,existingCavernShadowPreserved:true,perFrameGeneration:false,sourceTerrainMutated:false,originalWoodlandGeometryMutated:false,hydrationPreserved:true,physicalReview:'PENDING'}};
}

export function suppressOasisTreeGroupIndices(indices,primitiveSpans){
 if(!(indices instanceof Uint32Array)&&!Array.isArray(indices))throw Error('OASIS_GROUP_INDEX_SOURCE');
 const expected=OASIS_TREE_PLACEMENTS.flatMap(d=>['BARK','CANOPY'].map(k=>'H_EARTH_GEN2800_'+d.id+'_'+k)),spans=expected.map(id=>primitiveSpans.find(p=>p.primitiveId===id));
 if(spans.some(p=>!p)||new Set(spans.map(p=>p.primitiveId)).size!==8)throw Error('OASIS_GROUP_EIGHT_SOURCE_SPANS_REQUIRED');
 const result=Uint32Array.from(indices);let retiredTriangleCount=0;
 for(const span of spans){
  if(!Number.isInteger(span.indexStart)||span.indexStart<0||span.indexCount%3||span.indexStart+span.indexCount>result.length)throw Error('OASIS_GROUP_SPAN_INVALID');
  for(let n=span.indexStart;n<span.indexStart+span.indexCount;n+=3){result[n+1]=result[n];result[n+2]=result[n];retiredTriangleCount++;}
 }
 return{indices:result,receipt:{schema:'H_EARTH_OASIS_TREE_RETIREMENT_v1',retiredSpanIds:expected,retiredSpanCount:8,retiredTriangleCount,sourceIndicesMutated:false,originalWoodlandRetired:false}};
}

/** Startup-only cutout mipmaps, separately preserving both padded atlas recipes.
 * Level zero is byte-identical. Tiny levels retain at least one covered texel
 * per recipe; RGB is alpha weighted to avoid dark transparent-edge fringes. */
export function buildCoveragePreservingLeafMipmaps(pixels,width=256,height=256,cutoff=.45){
 if(!(pixels instanceof Uint8Array||pixels instanceof Uint8ClampedArray)||pixels.length!==width*height*4||width!==height||width<2||(width&(width-1))||!(cutoff>0&&cutoff<1))throw Error('LEAF_MIP_INPUT');
 const threshold=Math.ceil(cutoff*255),coverage=(data,w,h,x0,x1)=>{let n=0;for(let y=0;y<h;y++)for(let x=x0;x<x1;x++)if(data[(y*w+x)*4+3]>=threshold)n++;return n/(h*(x1-x0));};
 const target=[coverage(pixels,width,height,0,width/2),coverage(pixels,width,height,width/2,width)];
 const levels=[{width,height,pixels:new Uint8Array(pixels),coverage:target.slice()}];
 while(width>1){
  const prev=levels.at(-1),w=width/2,h=height/2,next=new Uint8Array(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const sum=[0,0,0],a=[];for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const i=((y*2+dy)*width+x*2+dx)*4,alpha=prev.pixels[i+3];a.push(alpha);for(let k=0;k<3;k++)sum[k]+=prev.pixels[i+k]*alpha;}
   const total=a.reduce((n,v)=>n+v,0),i=(y*w+x)*4;for(let k=0;k<3;k++)next[i+k]=total?Math.round(sum[k]/total):0;next[i+3]=Math.round(total/4);
  }
  const bands=w===1?[[0,1,(target[0]+target[1])/2]]:[[0,w/2,target[0]],[w/2,w,target[1]]];
  for(const [x0,x1,t]of bands){
   const values=[];for(let y=0;y<h;y++)for(let x=x0;x<x1;x++)values.push(next[(y*w+x)*4+3]);values.sort((a,b)=>b-a);
   const count=t>0?Math.max(1,Math.round(t*values.length)):0;if(!count)continue;
   const pivot=values[Math.min(count-1,values.length-1)],factor=pivot>0?(threshold+.5)/pivot:1;
   for(let y=0;y<h;y++)for(let x=x0;x<x1;x++){const i=(y*w+x)*4+3;next[i]=Math.min(255,Math.round(next[i]*factor));}
  }
  levels.push({width:w,height:h,pixels:next,coverage:bands.map(([a,b])=>coverage(next,w,h,a,b))});width=w;height=h;
 }
 return levels;
}
