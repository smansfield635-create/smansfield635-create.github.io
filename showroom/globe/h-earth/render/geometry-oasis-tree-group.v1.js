/** Gen2855: four cavern-side trees. Presentation overlay; hydrated source stays intact. */
import {unprojectPlanetVertex} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
import {constructHEarthTriangleMesh,admitHEarthPrimitiveRecord} from './geometry-kernel.js';
import {projectGeologicalMeshForRenderer} from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';

// Owner's second-from-left specimen keeps its established riverbank anchor.
// The companions step back and forward rather than following one planted row.
export const OASIS_TREE_PLACEMENTS=Object.freeze([
 {id:'PROPOSED_OASIS_01',x:55.5,z:-307.5,sourceX:55.5,sourceZ:-307.5},
 {id:'PROPOSED_OASIS_02',x:43,z:-315,sourceX:47.5,sourceZ:-317.5},
 {id:'PROPOSED_OASIS_03',x:75,z:-294,sourceX:71.5,sourceZ:-291.5},
 {id:'PROPOSED_OASIS_04',x:61,z:-297,sourceX:63.5,sourceZ:-301.5}
].map(d=>Object.freeze({...d,scaleX:1,scaleY:1,scaleZ:1,heading:0,agedFocus:false})));
const empty=()=>({vertices:[],indices:[],colors:[],clearingAttributes:[]});
const segmentDistance=(x,z,a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,d=dx*dx+dz*dz,t=d?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/d)):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);};
const boundsOf=vs=>({min:['x','y','z'].map(k=>Math.min(...vs.map(v=>v[k]))),max:['x','y','z'].map(k=>Math.max(...vs.map(v=>v[k])))});

export function buildOasisTreeGroup(model,source){
 if(model?.site?.id!=='B_REAR_RAVINE'||typeof model.sampleOutdoorAt!=='function'||typeof model.sampleWaterAt!=='function')throw Error('OASIS_GROUP_ACTUAL_SURFACE_REQUIRED');
 if(!source?.buffers?.positions||!source?.clearingAttributes||!source?.primitiveSpans)throw Error('OASIS_GROUP_HYDRATED_SOURCE_REQUIRED');
 const groups={BARK:empty(),CANOPY:empty()},placements=[],contacts=[],buffers=source.buffers;
 for(const d of OASIS_TREE_PLACEMENTS){
  const sourceParts=Object.fromEntries(['BARK','CANOPY'].map(part=>{
   const span=source.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_GEN2800_'+d.id+'_'+part);
   if(!span)throw Error('OASIS_GROUP_SOURCE_SPAN:'+d.id+':'+part);
   const vertices=Array.from({length:span.vertexCount},(_,i)=>{const j=(span.vertexStart+i)*3;return unprojectPlanetVertex(...buffers.positions.slice(j,j+3).map(Math.fround));});
   return[part,{span,vertices}];
  }));
  const dx=d.x-d.sourceX,dz=d.z-d.sourceZ,bark=sourceParts.BARK.vertices,minY=Math.min(...bark.map(v=>v.y));
  const basal=bark.filter(v=>v.y<=minY+.25),samples=basal.map(v=>{
   const x=v.x+dx,z=v.z+dz,hit=model.sampleOutdoorAt(x,z),water=model.sampleWaterAt(x,z);
   if(!Number.isFinite(hit?.y)||water&&water.y>=hit.y-.03)throw Error('OASIS_GROUP_DRY_SUPPORT:'+d.id);
   if(estate.footRoute.slice(1).some((b,i)=>segmentDistance(x,z,estate.footRoute[i],b)<=estate.footRouteRadius+.3))throw Error('OASIS_GROUP_WALK_CONTACT:'+d.id);
   return{source:v,x,z,surfaceY:hit.y};
  });
  if(samples.length<3)throw Error('OASIS_GROUP_BASAL_WITNESSES:'+d.id);
  const dy=Math.min(...samples.map(w=>w.surfaceY-w.source.y-.03)),witnesses=samples.map(w=>({id:d.id,x:w.x,z:w.z,surfaceY:w.surfaceY,meshY:w.source.y+dy,burial:w.surfaceY-w.source.y-dy}));
  if(Math.max(...witnesses.map(w=>w.burial))>.35)throw Error('OASIS_GROUP_EXCESSIVE_BURIAL:'+d.id);
  const spans={};
  for(const [part,{span,vertices}]of Object.entries(sourceParts)){
   const dst=groups[part],offset=dst.vertices.length,indexStart=dst.indices.length;
   const transformed=vertices.map(v=>({x:v.x+dx,y:v.y+dy,z:v.z+dz}));
   if(part==='BARK')for(const v of transformed)if(v.y-(minY+dy)<2.5&&estate.footRoute.slice(1).some((b,i)=>segmentDistance(v.x,v.z,estate.footRoute[i],b)<=estate.footRouteRadius+.3))throw Error('OASIS_GROUP_LOW_WOOD_WALK:'+d.id);
   dst.vertices.push(...transformed);
   for(const index of buffers.indices.slice(span.indexStart,span.indexStart+span.indexCount)){
    if(index<span.vertexStart||index>=span.vertexStart+span.vertexCount)throw Error('OASIS_GROUP_CROSS_SOURCE_FACE');
    dst.indices.push(offset+index-span.vertexStart);
   }
   for(let i=0;i<span.vertexCount;i++){const id=span.vertexStart+i;dst.colors.push(buffers.baseColorsLinear.slice(id*4,id*4+3));dst.clearingAttributes.push(source.clearingAttributes.slice(id*3,id*3+3));}
   spans[part]={vertexStart:offset,vertexCount:span.vertexCount,indexStart,indexCount:span.indexCount,bounds:boundsOf(transformed),sourcePrimitiveId:span.primitiveId,sourceVertexStart:span.vertexStart};
  }
  contacts.push(...witnesses);
  placements.push({...d,sourceAnchor:{x:d.sourceX,z:d.sourceZ},rootY:minY+dy,translation:{x:dx,y:dy,z:dz},spans,rootCount:0,leafCount:sourceParts.CANOPY.span.vertexCount/4,triangleCount:Object.values(sourceParts).reduce((n,p)=>n+p.span.indexCount/3,0),minimumBurial:Math.min(...witnesses.map(w=>w.burial)),maximumBurial:Math.max(...witnesses.map(w=>w.burial)),visualHeight:Math.max(...sourceParts.CANOPY.vertices.map(v=>v.y))-minY,shapeTemplate:'HYDRATED_ORIGINAL',groundSamples:samples.length});
 }
 const meshes=Object.entries(groups).map(([part,m])=>{
  const built=constructHEarthTriangleMesh({primitiveId:'OASIS_TREE_GROUP_'+part,vertices:m.vertices,indices:m.indices,expectedClosure:'OPEN_ALLOWED',semanticRole:'OASIS_TREE_GROUP',attributes:{colors:m.colors}});
  if(!built.valid)throw Error('OASIS_GROUP_CONSTRUCTION:'+JSON.stringify(built.issues));
  const admitted=admitHEarthPrimitiveRecord(built.primitiveRecord);if(!admitted.valid)throw Error('OASIS_GROUP_ADMISSION:'+JSON.stringify(admitted.issues));
  const positions=Float32Array.from(m.vertices.flatMap(v=>[v.x,v.y,v.z]));
  return{role:'OASIS_TREE_GROUP',part,leaflets:part==='CANOPY',mesh:projectGeologicalMeshForRenderer({positions,indices:Uint32Array.from(m.indices)}),colors:m.colors,colorsAreLinear:true,clearingAttributes:m.clearingAttributes};
 });
 const triangleCount=meshes.reduce((n,p)=>n+p.mesh.triangleCount,0),gpuByteLength=meshes.reduce((n,p)=>n+p.mesh.vertexCount*69+p.mesh.indices.byteLength,0);
 if(triangleCount>33000||gpuByteLength>5*1024*1024||meshes.length!==2)throw Error('OASIS_GROUP_BUDGET_EXCEEDED');
 return{meshes,contacts,receipt:{schema:'H_EARTH_OASIS_TREE_GROUP_v1',targetId:'PROPOSED_OASIS_01',treeCount:4,placements,triangleCount,gpuByteLength,drawBatchCount:2,shadowCasterBatchCount:0,castShadowClaim:false,existingCavernShadowPreserved:true,perFrameGeneration:false,sourceTerrainMutated:false,originalWoodlandGeometryMutated:false,hydrationPreserved:true,focusShapeStatus:'RESET_TO_ORIGINAL_PENDING_OWNER_REVIEW',physicalReview:'PENDING'}};
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
