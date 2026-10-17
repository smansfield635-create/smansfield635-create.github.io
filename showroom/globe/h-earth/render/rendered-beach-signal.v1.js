/** Geometry-bound presentation signal. No authored-distance or vegetation-derived fallback. */
export const RENDERED_BEACH_CONSTANTS=Object.freeze({contactStart:-1,contactWet:0,contactDry:10,contactEnd:38,coastStart:4,coastEnd:28,slopeStart:.035,slopeEnd:.16,heightStart:2,heightEnd:10,slopeWeight:.72,heightWeight:.28});
const C=RENDERED_BEACH_CONSTANTS,clamp=x=>Math.max(0,Math.min(1,x)),smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export function renderedBeachCoverage({contactDistance,coastDistance,worldY,normal}){
 if(!normal||normal.length!==3||![contactDistance,coastDistance,worldY,...normal].every(Number.isFinite))throw Error('RENDERED_BEACH_ATTRIBUTES_INVALID');
 const length=Math.hypot(...normal);if(length===0)throw Error('RENDERED_BEACH_NORMAL_INVALID');
 const slope=1-clamp(normal[1]/length),suitability=(1-smooth(C.slopeStart,C.slopeEnd,slope))*C.slopeWeight+(1-smooth(C.heightStart,C.heightEnd,worldY))*C.heightWeight;
 return smooth(C.contactStart,C.contactWet,contactDistance)*(1-smooth(C.contactDry,C.contactEnd,contactDistance))*(1+(clamp(suitability)-1)*smooth(C.coastStart,C.coastEnd,coastDistance));
}
const gl=n=>Number.isInteger(n)?n.toFixed(1):String(n);
export const RENDERED_BEACH_GLSL=`float renderedBeachCoverage(float contactDistance,float coastDistance,float worldY,float shaderSlope){
 float suitability=clamp((1.0-smoothstep(${gl(C.slopeStart)},${gl(C.slopeEnd)},shaderSlope))*${gl(C.slopeWeight)}+(1.0-smoothstep(${gl(C.heightStart)},${gl(C.heightEnd)},worldY))*${gl(C.heightWeight)},0.0,1.0);
 return smoothstep(${gl(C.contactStart)},${gl(C.contactWet)},contactDistance)*(1.0-smoothstep(${gl(C.contactDry)},${gl(C.contactEnd)},contactDistance))*mix(1.0,suitability,smoothstep(${gl(C.coastStart)},${gl(C.coastEnd)},coastDistance));
}`;
/** Parts retain the actual submitted arrays. Geometry cannot change during this vegetation lifecycle. */
export function createRenderedBeachProvider({surfaceRevision,parts,protectedReferenceAt=()=>false}){
 if(!Number.isSafeInteger(surfaceRevision)||!Array.isArray(parts)||typeof protectedReferenceAt!=='function')throw Error('RENDERED_BEACH_PROVIDER_INVALID');
 const indexed=new Map();for(const part of parts){if(!part.partId||indexed.has(part.partId)||!part.positions||!part.indices)throw Error('RENDERED_BEACH_PART_INVALID');indexed.set(part.partId,part);}
 const unavailable=reason=>Object.freeze({valid:false,reason});
 return Object.freeze({surfaceRevision,sample({x,z,support}={}){
  if(!support||![x,z,support.y].every(Number.isFinite))return unavailable('SUPPORT_MISSING');
  const part=indexed.get(support.partId);if(!part||support.surfaceRevision!==surfaceRevision)return unavailable('SURFACE_IDENTITY_MISMATCH');
  if(part.owner!==support.owner||!['CANONICAL_VISIBLE_TERRAIN','VISIBLE_REFINEMENT','ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(part.owner))return unavailable('SUPPORT_OWNER_MISMATCH');
  const offset=support.triangleOffset,weights=support.barycentricWeights,ids=support.vertexIndices;
  if(!Number.isSafeInteger(offset)||offset<0||offset%3||offset+2>=part.indices.length||!weights||weights.length!==3||!ids||ids.length!==3||!weights.every(Number.isFinite)||Math.min(...weights)<-1e-8||Math.abs(weights.reduce((a,b)=>a+b,0)-1)>1e-8||ids.some((id,i)=>id!==part.indices[offset+i]))return unavailable('TRIANGLE_IDENTITY_MISMATCH');
  const inside=clip=>clip&&x>clip[0]&&x<clip[2]&&z>clip[1]&&z<clip[3];
  if(part.skip?.has(offset)||inside(part.hiddenClip)||(part.visibleClip&&!inside(part.visibleClip))||new Set(ids).size<3)return unavailable('TRIANGLE_NOT_PRESENTED');
  const n=part.positions.length/3;
  if(!part.normals||part.normals.length!==n*3||!part.coastDistances||part.coastDistances.length!==n||!part.contactDistances||part.contactDistances.length!==n)return unavailable('UPLOADED_ATTRIBUTES_MISSING');
  const mix=(array,stride,component=0)=>weights.reduce((sum,w,i)=>sum+w*array[ids[i]*stride+component],0);
  const worldY=mix(part.positions,3,1),px=mix(part.positions,3,0),pz=mix(part.positions,3,2);
  if(Math.abs(px-x)>1e-6||Math.abs(pz-z)>1e-6||Math.fround(worldY)!==support.y)return unavailable('SUPPORT_POSITION_MISMATCH');
  const normal=[0,1,2].map(k=>mix(part.normals,3,k)),coastDistance=mix(part.coastDistances,1),contactDistance=mix(part.contactDistances,1),length=Math.hypot(...normal);
  if(![worldY,coastDistance,contactDistance,length,...normal].every(Number.isFinite)||length===0)return unavailable('UPLOADED_ATTRIBUTES_INVALID');
  const normalizedShaderNormal=normal.map(v=>v/length),protectedReference=protectedReferenceAt(x,worldY,z)===true;
  const rawSandCoverage=protectedReference?0:renderedBeachCoverage({contactDistance,coastDistance,worldY,normal});
  return Object.freeze({valid:true,reason:null,surfaceRevision,partId:part.partId,owner:part.owner,triangleId:offset/3,barycentricWeights:Object.freeze([...weights]),worldY,normalizedShaderNormal:Object.freeze(normalizedShaderNormal),shaderSlope:1-clamp(normalizedShaderNormal[1]),interpolatedCanonicalCoastDistance:coastDistance,interpolatedExposedContactDistance:contactDistance,rawSandCoverage,beachStage:'RAW_BEACH_BEFORE_VEGETATION_DERIVED_SOIL',rendererMaterialBranch:protectedReference?'PROTECTED_CLEARING_SOIL':'REGIONAL_TERRAIN'});
 }});
}
export function createPilotCoverageOwner({contains}={}){
 if(typeof contains!=='function')throw Error('PILOT_OWNER_CONTAINS_REQUIRED');
 let uniformResident=false,transitionCount=0;
 return Object.freeze({commit({uploadComplete,coverageValidated,glError}={}){if(uniformResident||uploadComplete!==true||coverageValidated!==true||glError!==0)return false;uniformResident=true;transitionCount++;return true;},shouldDrawPilot:()=>!uniformResident,suppressUniform:(x,z)=>!uniformResident&&contains(x,z),getReceipt:()=>({state:uniformResident?'UNIFORM_RESIDENT':'PILOT_FALLBACK',transitionCount})});
}
