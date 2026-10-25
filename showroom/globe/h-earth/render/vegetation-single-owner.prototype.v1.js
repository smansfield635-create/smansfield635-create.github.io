import {LANDSCAPE_COHERENCE_GLSL} from './landscape-coherence-field.v1.js';
import {assertOasisBankBudget,OASIS_BANK_ALLOCATION,oasisBankTiles} from './oasis-bank-field.v1.js';
import {buildCavernEntranceGrass,createEntranceFloorSupport,ENTRANCE_BLEND_GLSL} from './cavern-entrance-grass.v1.js';
import {unprojectPlanetVertex} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
import {takePrecomputedGrassPlan} from './precomputed-grass.v1.js';
import {FOOTHILL_MEADOW_GLSL} from './foothill-meadow-field.v1.js';
import {HILLSIDE_SHORELINE_GLSL} from './hillside-shoreline-field.v1.js';
import {boundGrassTiles,grassFrustumPlanes,selectVisibleGrassTiles,mergeGrassRanges} from './grass-visibility.v2.js';
import {GRASS_CONTINUITY_ALLOCATION as allocation} from './grass-continuity-supplement.v1.js';
import {uploadInSlices} from './performance-scheduling.v1.js';
/** Only authenticated original prefixes influence the unchanged runtime planting recipe.
 * Offline continuity additions remain installed but must not suppress saved runtime planting. */
export function runtimePlantingBaselineTiles(tiles){
 return Object.freeze(tiles.flatMap(tile=>{
  const count=tile.baselineCount;
  if(!Number.isInteger(count)||count<0||count>tile.count||!(tile.packed instanceof Float32Array)||tile.packed.length!==tile.count*4)throw Error('RUNTIME_PLANTING_BASELINE_INVALID');
  return count?[Object.freeze({...tile,count,packed:tile.packed.subarray(0,count*4)})]:[];
 }));
}
/** Extend only the existing ravine atlas from the roots actually installed.
 * Empty, wet and unsupported texels cannot gain soil; old coverage never falls. */
export function buildCavernGrassSoilHabitat(habitat,baseTiles,addition,{eligibleAt}={}){
 const {size,width,height,ravine}=habitat??{},bounds=ravine?.bounds;
 const density=habitat?.receipt?.grassContinuity?.reference?.density;
 if(!Number.isInteger(size)||width!==size*3||height!==size||habitat.pixels?.length!==width*height||bounds?.length!==4||!(density>0)||typeof eligibleAt!=='function')throw Error('CAVERN_SOIL_HABITAT_LAYOUT');
 const [x0,z0,x1,z1]=bounds,dx=(x1-x0)/size,dz=(z1-z0)/size;
 if(!(dx>0&&dz>0))throw Error('CAVERN_SOIL_HABITAT_BOUNDS');
 const cell=(x,z)=>x<x0||x>=x1||z<z0||z>=z1?-1:Math.floor((z-z0)/dz)*size+Math.floor((x-x0)/dx);
 const counts=new Map();let additionRoots=0;
 for(const tile of addition.tiles)for(const root of tile.roots){const i=cell(root.x,root.z);if(i<0)throw Error('CAVERN_SOIL_ROOT_OUTSIDE_ATLAS');counts.set(i,(counts.get(i)??0)+1);additionRoots++;}
 // Count existing cover only in cells touched by the accepted addition.
 for(const tile of baseTiles)for(let k=0;k<tile.packed.length;k+=4){const i=cell(tile.packed[k],tile.packed[k+2]);if(counts.has(i))counts.set(i,counts.get(i)+1);}
 const pixels=new Uint8Array(habitat.pixels);let raisedTexels=0,rejectedTexels=0;
 for(const [i,count] of counts){const x=i%size,z=Math.floor(i/size),px=x0+(x+.5)*dx,pz=z0+(z+.5)*dz;
  if(!eligibleAt(px,pz)){rejectedTexels++;continue;}
  const offset=z*width+size+x,value=Math.round(255*Math.min(1,count/(density*dx*dz)));
  if(value>pixels[offset]){pixels[offset]=value;raisedTexels++;}
 }
 const cavernGrassSoil={schema:'H_EARTH_CAVERN_GRASS_SOIL_CONTINUITY_v1',additionRoots,touchedTexels:counts.size,raisedTexels,rejectedTexels,referenceDensity:density,coverageSource:'ACTUAL_INSTALLED_ROOT_OCCUPANCY_WITH_DRY_TRIANGLE_SUPPORT',existingCoverageNeverReduced:true,otherAtlasPanelsPreserved:true,rootBytesChanged:false};
 return {...habitat,pixels,receipt:{...habitat.receipt,cavernGrassSoil}};
}
/** Isolated woodland prototype. One immutable population; detail adds lobes, never removes cover. */
export function detailWeight(distance){
 if(!Number.isFinite(distance)||distance<0)throw Error('DETAIL_DISTANCE_INVALID');
 const t=Math.max(0,Math.min(1,(distance-14)/10));return 1-t*t*(3-2*t);
}
export function planImmutableTiles(presentation){
 if(!Array.isArray(presentation?.tiles))throw Error('POPULATION_INVALID');
 const ids=new Set(),tileIds=new Set();let first=0,woodlandRoots=0,ravineRoots=0;
 const tiles=presentation.tiles.map(tile=>{
  if(typeof tile.id!=='string'||tileIds.has(tile.id)||![tile.minX,tile.minZ].every(Number.isFinite)||!Array.isArray(tile.roots))throw Error('TILE_INVALID');
  if(tile.roots.length>1600)throw Error('TILE_ROOT_BUDGET_EXCEEDED');
  tileIds.add(tile.id);const packed=new Float32Array(tile.roots.length*4),rootIds=[];
  tile.roots.forEach((root,i)=>{
   if(![root.x,root.y,root.z,root.angle,root.seed,root.slope].every(Number.isFinite)||![root.x,root.y,root.z,root.angle].every(v=>Number.isFinite(Math.fround(v))))throw Error('ROOT_NONFINITE');
   if(root.x<tile.minX||root.x>=tile.minX+4||root.z<tile.minZ||root.z>=tile.minZ+4)throw Error('ROOT_OUTSIDE_TILE');
   const id=`${Math.fround(root.x)}:${Math.fround(root.y)}:${Math.fround(root.z)}:${root.seed}`;
   if(ids.has(id))throw Error('ROOT_DUPLICATE');ids.add(id);rootIds.push(id);
   if((root.region==='RAVINE'||root.region==='RAVINE_SUPPLEMENT'))ravineRoots++;else woodlandRoots++;
   if(woodlandRoots>450000)throw Error('POPULATION_GPU_BUDGET_EXCEEDED');
   if(ravineRoots>allocation.maximumRavineRoots)throw Error('RAVINE_ROOT_BUDGET_EXCEEDED');
   packed.set([root.x,root.y,root.z,root.angle],i*4);
  });
  const result=Object.freeze({id:tile.id,minX:tile.minX,minZ:tile.minZ,rootIds:Object.freeze(rootIds),packed,count:rootIds.length,first});first+=result.count;if(first>allocation.maximumRoots||first*16>allocation.maximumPackedBytes)throw Error('POPULATION_GPU_BUDGET_EXCEEDED');return result;
 });
 if(!first)throw Error('EMPTY_WOODLAND_POPULATION');if(presentation.receipt?.contactCount!==first)throw Error('POPULATION_COUNT_MISMATCH');return Object.freeze(tiles);
}
export function selectFineTiles(tiles,camera){
 if(![camera?.x,camera?.z].every(Number.isFinite))throw Error('CAMERA_INVALID');
 return tiles.filter(tile=>Math.hypot(Math.max(tile.minX-camera.x,0,camera.x-tile.minX-4),Math.max(tile.minZ-camera.z,0,camera.z-tile.minZ-4))<24);
}
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec4 aRoot;
uniform mat4 uViewProjection;
uniform vec3 uCamera;
uniform float uRadius;
uniform int uFine;
out vec3 vNormal;out vec3 vColor;out float vDistance;
${LANDSCAPE_COHERENCE_GLSL}
${FOOTHILL_MEADOW_GLSL}
${HILLSIDE_SHORELINE_GLSL}
${ENTRANCE_BLEND_GLSL}
void main(){
 float d=length(aRoot.xz-uCamera.xz),t=clamp((d-14.)/10.,0.,1.);
 float detail=1.-t*t*(3.-2.*t),h=fract(sin(dot(aRoot.xz,vec2(12.9898,78.233)))*43758.5453);
 vec3 up=normalize(vec3(aRoot.x,aRoot.y+uRadius,aRoot.z));
 float angle=aRoot.w+float(uFine)*1.5707963;
 vec3 across=normalize(vec3(cos(angle),0.,sin(angle)));across=normalize(across-up*dot(up,across));
 int k=gl_VertexID%6;
 float side=(k==0||k==3||k==5)?-1.:1.;
 float level=(k==2||k==4||k==5)?1.:0.;
 float scale=uFine==1?detail:1.;
 float width=mix(.010,.016,h)*scale;
 // Local entrance growth affects existing and supplemental roots alike.
 float core=(1.-smoothstep(10.,12.,abs(aRoot.x-40.)))*smoothstep(-293.,-287.,aRoot.z)*(1.-smoothstep(-259.,-257.8,aRoot.z));
 float entrance=max(core,entranceBlend(aRoot.xz));
 float shoulders=smoothstep(1.6,5.,abs(aRoot.x-40.));
 float mouthBanks=(1.-smoothstep(.7,2.5,abs(abs(aRoot.x-40.)-3.8)))*(1.-smoothstep(2.,7.,abs(aRoot.z+262.)));
 float entranceHeight=mix(mix(mix(.30,.48,h),mix(.58,.88,h),shoulders),mix(1.15,1.65,h),mouthBanks);
 float height=mix(mix(.11,.21,h),entranceHeight,entrance)*scale;
 vec3 p=aRoot.xyz+up*(.003+level*height)+across*(side*width*(1.-level*.86));
 p+=vec3(sin(angle),0.,-cos(angle))*level*level*mix(.025,height*mix(.12,.30,h),entrance)*scale;
 gl_Position=uViewProjection*vec4(p,1.);vNormal=up;
 // One world-space palette for existing grass and occupied ground.
 float foothillDry=max(foothillDryAmount(aRoot.xyz,uRadius),hillsideDry(aRoot.xyz));
 vec3 palette=landscapeCoverPalette(aRoot.xz,foothillDry);
 palette=mix(palette,vec3(.29,.255,.12),smoothstep(.78,.99,h)*.34);
 vColor=palette*(.78+level*.40)*(.88+.24*h);vDistance=length(p-uCamera);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNormal;in vec3 vColor;in float vDistance;
uniform vec3 uSunDirection;uniform vec3 uSunColor;uniform vec3 uHaze;
uniform float uSunIntensity;uniform float uFogStart;uniform float uFogFalloff;uniform float uMaxFog;
out vec4 outColor;
void main(){float lit=.48+.52*max(0.,dot(normalize(vNormal),normalize(uSunDirection)));vec3 color=vColor*(vec3(.5)+uSunColor*lit*uSunIntensity*.5);float fog=min(uMaxFog,1.-exp(-max(0.,vDistance-uFogStart)*uFogFalloff));color=mix(color,uHaze,fog);outColor=vec4(pow(max(color,vec3(0.)),vec3(1./2.2)),1.);}`;
export async function createSingleOwnerVegetation(gl,presentation,{environment,planetRadius,yieldControl=async()=>{},onProgress=()=>{},uploadBudget={},entranceGrass=null}={}){
 if(!environment||!Number.isFinite(planetRadius))throw Error('OWNER_ENVIRONMENT_REQUIRED');
 const started=performance.now(),trusted=takePrecomputedGrassPlan(presentation),globalTiles=trusted?.tiles??planImmutableTiles(presentation);
 const originalRootCount=globalTiles.reduce((n,t)=>n+t.count,0),bankTiles=trusted?oasisBankTiles(originalRootCount):[],oasisRoots=bankTiles.reduce((n,t)=>n+t.count,0),baseTiles=Object.freeze([...globalTiles,...bankTiles]),baseRootCount=originalRootCount+oasisRoots;
 let tiles=baseTiles,entranceReceipt=null,habitat=presentation.habitat;
 if(entranceGrass){
  if(!trusted)throw Error('ENTRANCE_GRASS_REQUIRES_AUTHENTICATED_BASELINE');
  const addition=await buildCavernEntranceGrass({...entranceGrass,existingTiles:runtimePlantingBaselineTiles(baseTiles),yieldControl});
  const extra=planImmutableTiles(addition).map(t=>Object.freeze({...t,first:t.first+baseRootCount}));
  tiles=Object.freeze([...baseTiles,...extra]);entranceReceipt=addition.receipt;
  const floor=createEntranceFloorSupport(entranceGrass.geology);
  habitat=buildCavernGrassSoilHabitat(habitat,baseTiles,addition,{eligibleAt:(x,z)=>{
   const hit=floor.sample(x,z)??entranceGrass.visibleSurface.sample(x,z);
   if(!hit||hit.slope>1.35)return false;
   const local=unprojectPlanetVertex(x,hit.y,z),water=entranceGrass.geology.sampleWaterAt(local.x,local.z);
   return !water||water.y<=local.y+.04;
  }});
 }
 const rootCount=tiles.reduce((n,t)=>n+t.count,0);
 assertOasisBankBudget(rootCount-oasisRoots,oasisRoots,allocation);
 const controlRoots=trusted?.controlRoots??[];if(!trusted)for(const tile of tiles)tile.rootIds.forEach((id,i)=>{if(Math.hypot(tile.packed[i*4]+139.40267987050615,tile.packed[i*4+2]+194.5)<=2)controlRoots.push(id);});
 if(!controlRoots.length)throw Error('EMPTY_FIXED_CONTROL');
 const ownedShaders=[];let program=null,vao=null,buffer=null;
 function cleanup(){if(buffer)gl.deleteBuffer(buffer);if(vao)gl.deleteVertexArray(vao);if(program)gl.deleteProgram(program);for(const shader of ownedShaders)gl.deleteShader(shader);}
 try{

 function graphicsError(code,stage,log){const lost=gl.isContextLost?.()===true;return Error(`${lost?'OWNER_CONTEXT_LOST':code}:${stage}:${String(log??'').trim()||'NO_DRIVER_LOG'}`);}
 function assertContext(stage){if(gl.isContextLost?.()===true)throw graphicsError('OWNER_CONTEXT_LOST',stage);}
 function shader(type,source){
  const stage=type===gl.VERTEX_SHADER?'VERTEX':'FRAGMENT';assertContext(stage);
  const s=gl.createShader(type);if(!s)throw graphicsError('OWNER_SHADER_ALLOCATION',stage);
  ownedShaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw graphicsError('OWNER_SHADER_COMPILE',stage,gl.getShaderInfoLog(s));
  assertContext(stage);return s;
 }
 assertContext('PROGRAM');program=gl.createProgram();if(!program)throw graphicsError('OWNER_PROGRAM_ALLOCATION','PROGRAM');
 gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw graphicsError('OWNER_LINK','PROGRAM',gl.getProgramInfoLog(program));
 assertContext('LINKED');
 const gpuRequestedBytes=rootCount*16;
 vao=gl.createVertexArray();buffer=gl.createBuffer();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,gpuRequestedBytes,gl.STATIC_DRAW);
 const gpuObservedBufferBytes=gl.getBufferParameter(gl.ARRAY_BUFFER,gl.BUFFER_SIZE),allocationGlError=gl.getError();
 assertContext('BUFFER_ALLOCATION');
 if(allocationGlError!==gl.NO_ERROR)throw graphicsError('OWNER_BUFFER_ALLOCATION_GL_ERROR','BUFFER_ALLOCATION',allocationGlError);
 if(gpuObservedBufferBytes!==gpuRequestedBytes)throw graphicsError('OWNER_BUFFER_SIZE_MISMATCH','BUFFER_ALLOCATION',`${gpuObservedBufferBytes}/${gpuRequestedBytes}`);
 let gpuUploadCount=1,gpuUploadedBytes=0;
 const uploadScheduling=await uploadInSlices(tiles,{...uploadBudget,yieldControl,onProgress,upload:tile=>{gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,tile.first*16,tile.packed);gpuUploadCount++;gpuUploadedBytes+=tile.packed.byteLength;}});
 const uploadGlError=gl.getError();assertContext('BUFFER_UPLOAD');
 if(uploadGlError!==gl.NO_ERROR)throw graphicsError('OWNER_BUFFER_UPLOAD_GL_ERROR','BUFFER_UPLOAD',uploadGlError);
 if(gpuUploadedBytes!==gpuRequestedBytes)throw graphicsError('OWNER_BUFFER_UPLOAD_SIZE_MISMATCH','BUFFER_UPLOAD',`${gpuUploadedBytes}/${gpuRequestedBytes}`);
 gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);gl.vertexAttribDivisor(0,1);
 const u=Object.fromEntries(['uViewProjection','uCamera','uRadius','uFine','uSunDirection','uSunColor','uHaze','uSunIntensity','uFogStart','uFogFalloff','uMaxFog'].map(n=>[n,gl.getUniformLocation(program,n)]));
 const rgb=value=>{const a=Array.isArray(value)?value.slice(0,3):[value.r,value.g,value.b],scale=a.some(v=>v>1)?255:1;return a.map(v=>v/scale);};
 gl.useProgram(program);const e=environment;gl.uniform1f(u.uRadius,planetRadius);gl.uniform3f(u.uSunDirection,e.sunDirection.x,e.sunDirection.y,e.sunDirection.z);gl.uniform3fv(u.uSunColor,rgb(e.sunColor));gl.uniform3fv(u.uHaze,rgb(e.groundHazeColor));gl.uniform1f(u.uSunIntensity,e.sunIntensity);gl.uniform1f(u.uFogStart,e.fogStartDistance);gl.uniform1f(u.uFogFalloff,e.fogFalloff);gl.uniform1f(u.uMaxFog,e.maximumFogFactor);
 const visibilityBounds=boundGrassTiles(tiles);
 let disposed=false,lastDraw={visibleCoarseRoots:0,selectedFineRoots:0,drawCallCount:0,submittedTriangles:0,perFrameUploadBytes:0};const preparationMs=performance.now()-started;
 function draw(packet){
  if(disposed)throw Error('OWNER_DISPOSED');const cpuStarted=performance.now();const camera=packet.camera.position,frustum=grassFrustumPlanes(packet.camera.viewProjectionMatrix),visible=selectVisibleGrassTiles(visibilityBounds,frustum.planes),fine=selectFineTiles(visible,camera);
  gl.useProgram(program);gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.uniformMatrix4fv(u.uViewProjection,false,frustum.matrix);gl.uniform3f(u.uCamera,camera.x,camera.y,camera.z);gl.uniform1i(u.uFine,0);
  let visibleCoarseRoots=0,selectedFineRoots=0,drawCallCount=0;
  for(const range of mergeGrassRanges(visible)){gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,range.first*16);gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count);drawCallCount++;visibleCoarseRoots+=range.count;}
  gl.uniform1i(u.uFine,1);
  for(const range of mergeGrassRanges(fine)){gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,range.first*16);gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count);drawCallCount++;selectedFineRoots+=range.count;}
  lastDraw={cpuDrawSubmissionMilliseconds:performance.now()-cpuStarted,visibleCoarseRoots,selectedFineRoots,drawCallCount,submittedTriangles:(visibleCoarseRoots+selectedFineRoots)*2,perFrameUploadBytes:0,coarseTiles:visible.length,culledTiles:tiles.length-visible.length,fineTiles:fine.length};return {...lastDraw};
 }
 function getReceipt(){return {schema:'H_EARTH_SINGLE_OWNER_WOODLAND_v1',scope:'APPROVED_WOODLAND_AND_MEASURED_RAVINE_NOT_WHOLE_WORLD',entranceGrass:entranceReceipt,originalRootCount,installedRootCount:rootCount,coarseRootCount:rootCount,rootOwnerCount:1,generationCount:1,ownedObjectCounts:{programs:1,shaders:2,vertexArrays:1,buffers:1,textures:0},maximumRoots:allocation.maximumRoots+OASIS_BANK_ALLOCATION.maximumRoots,globalMaximumRoots:allocation.maximumRoots,oasisRoots,oasisAllocation:OASIS_BANK_ALLOCATION,maximumWoodlandRoots:450000,maximumRavineRoots:allocation.maximumRavineRoots,maximumPackedBytes:allocation.maximumPackedBytes+OASIS_BANK_ALLOCATION.maximumPackedBytes,globalMaximumPackedBytes:allocation.maximumPackedBytes,maximumTileRoots:1600,tileCount:tiles.length,uploadScheduling,gpuUploadCount,gpuUploadedBytes,gpuAllocatedBytes:gpuObservedBufferBytes,gpuRequestedBytes,gpuObservedBufferBytes,allocationGlError,uploadGlError,gpuAllocationVerified:true,cpuDrawTimingScope:'CPU_CULLING_AND_DRAW_SUBMISSION_EXCLUDES_GPU_EXECUTION',preparationMs,controlRoots:[...controlRoots],coarseCoverPolicy:'ALL_POTENTIALLY_VISIBLE_ROOTS_CONSERVATIVE_FRUSTUM',finePolicy:'SECOND_LOBE_SAME_ROOTS_SMOOTH_14_TO_24_METERS',...lastDraw,disposed};}
 function dispose(){if(disposed)return;disposed=true;cleanup();}
 return Object.freeze({draw,getReceipt,dispose,habitat});
 }catch(error){cleanup();throw error;}
}

