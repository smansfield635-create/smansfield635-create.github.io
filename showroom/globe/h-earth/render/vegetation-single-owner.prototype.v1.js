import {GRASS_CONTINUITY_ALLOCATION as allocation} from './grass-continuity-supplement.v1.js';
import {uploadInSlices} from './performance-scheduling.v1.js';
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
float woodlandPaletteNoise(vec2 p){vec2 cell=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453),b=fract(sin(dot(cell+vec2(1.,0.),vec2(127.1,311.7)))*43758.5453),c=fract(sin(dot(cell+vec2(0.,1.),vec2(127.1,311.7)))*43758.5453),d=fract(sin(dot(cell+vec2(1.,1.),vec2(127.1,311.7)))*43758.5453);return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
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
 float width=mix(.024,.045,h)*scale;
 float height=mix(.11,.21,h)*scale;
 vec3 p=aRoot.xyz+up*(.003+level*height)+across*(side*width*(1.-level*.86));
 p+=vec3(sin(angle),0.,-cos(angle))*level*level*.025*scale;
 gl_Position=uViewProjection*vec4(p,1.);vNormal=up;
 // Rotate and warp only color coordinates; every immutable root stays fixed.
 vec2 colorWorld=mat2(.8,.6,-.6,.8)*aRoot.xz;
 vec2 colorWarp=vec2(woodlandPaletteNoise(colorWorld/37.),woodlandPaletteNoise(colorWorld/41.+vec2(19.,-7.)))-.5;
 float palettePatch=woodlandPaletteNoise(colorWorld/13.+colorWarp*1.4),dry=woodlandPaletteNoise(colorWorld/29.+colorWarp+vec2(7.,-11.));
 vec3 forest=mix(vec3(.055,.105,.028),vec3(.125,.185,.048),palettePatch);
 vec3 olive=mix(vec3(.12,.15,.035),vec3(.24,.225,.075),palettePatch);
 vec3 palette=mix(forest,olive,smoothstep(.35,.8,dry));
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
export async function createSingleOwnerVegetation(gl,presentation,{environment,planetRadius,yieldControl=async()=>{},onProgress=()=>{},uploadBudget={}}={}){
 if(!environment||!Number.isFinite(planetRadius))throw Error('OWNER_ENVIRONMENT_REQUIRED');
 const started=performance.now(),tiles=planImmutableTiles(presentation),rootCount=tiles.reduce((n,t)=>n+t.count,0);
 const controlRoots=[];for(const tile of tiles)tile.rootIds.forEach((id,i)=>{if(Math.hypot(tile.packed[i*4]+139.40267987050615,tile.packed[i*4+2]+194.5)<=2)controlRoots.push(id);});
 if(!controlRoots.length)throw Error('EMPTY_FIXED_CONTROL');
 const ownedShaders=[];let program=null,vao=null,buffer=null;
 function cleanup(){if(buffer)gl.deleteBuffer(buffer);if(vao)gl.deleteVertexArray(vao);if(program)gl.deleteProgram(program);for(const shader of ownedShaders)gl.deleteShader(shader);}
 try{

 function shader(type,source){const s=gl.createShader(type);ownedShaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('OWNER_SHADER:'+gl.getShaderInfoLog(s));return s;}
 program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('OWNER_LINK:'+gl.getProgramInfoLog(program));
 vao=gl.createVertexArray();buffer=gl.createBuffer();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,rootCount*16,gl.STATIC_DRAW);let gpuUploadCount=1,gpuUploadedBytes=0;
 const uploadScheduling=await uploadInSlices(tiles,{...uploadBudget,yieldControl,onProgress,upload:tile=>{gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,tile.first*16,tile.packed);gpuUploadCount++;gpuUploadedBytes+=tile.packed.byteLength;}});
 gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);gl.vertexAttribDivisor(0,1);
 const u=Object.fromEntries(['uViewProjection','uCamera','uRadius','uFine','uSunDirection','uSunColor','uHaze','uSunIntensity','uFogStart','uFogFalloff','uMaxFog'].map(n=>[n,gl.getUniformLocation(program,n)]));
 const rgb=value=>{const a=Array.isArray(value)?value.slice(0,3):[value.r,value.g,value.b],scale=a.some(v=>v>1)?255:1;return a.map(v=>v/scale);};
 gl.useProgram(program);const e=environment;gl.uniform1f(u.uRadius,planetRadius);gl.uniform3f(u.uSunDirection,e.sunDirection.x,e.sunDirection.y,e.sunDirection.z);gl.uniform3fv(u.uSunColor,rgb(e.sunColor));gl.uniform3fv(u.uHaze,rgb(e.groundHazeColor));gl.uniform1f(u.uSunIntensity,e.sunIntensity);gl.uniform1f(u.uFogStart,e.fogStartDistance);gl.uniform1f(u.uFogFalloff,e.fogFalloff);gl.uniform1f(u.uMaxFog,e.maximumFogFactor);
 let disposed=false,lastDraw={selectedFineRoots:0,drawCallCount:0,submittedTriangles:0,perFrameUploadBytes:0};const preparationMs=performance.now()-started;
 function draw(packet){
  if(disposed)throw Error('OWNER_DISPOSED');const camera=packet.camera.position,fine=selectFineTiles(tiles,camera);
  gl.useProgram(program);gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.uniformMatrix4fv(u.uViewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));gl.uniform3f(u.uCamera,camera.x,camera.y,camera.z);gl.uniform1i(u.uFine,0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);gl.drawArraysInstanced(gl.TRIANGLES,0,6,rootCount);
  gl.uniform1i(u.uFine,1);let selectedFineRoots=0,drawCallCount=1;
  // Merge consecutive immutable tile ranges; no selection buffer or texture upload.
  const ranges=[];for(const tile of fine){const last=ranges[ranges.length-1];if(last&&last.first+last.count===tile.first)last.count+=tile.count;else ranges.push({first:tile.first,count:tile.count});selectedFineRoots+=tile.count;}
  for(const range of ranges){gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,range.first*16);gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count);drawCallCount++;}
  lastDraw={selectedFineRoots,drawCallCount,submittedTriangles:(rootCount+selectedFineRoots)*2,perFrameUploadBytes:0,coarseTiles:tiles.length,fineTiles:fine.length};return {...lastDraw};
 }
 function getReceipt(){return {schema:'H_EARTH_SINGLE_OWNER_WOODLAND_v1',scope:'APPROVED_WOODLAND_AND_MEASURED_RAVINE_NOT_WHOLE_WORLD',installedRootCount:rootCount,coarseRootCount:rootCount,rootOwnerCount:1,generationCount:1,ownedObjectCounts:{programs:1,shaders:2,vertexArrays:1,buffers:1,textures:0},maximumRoots:allocation.maximumRoots,maximumWoodlandRoots:450000,maximumRavineRoots:allocation.maximumRavineRoots,maximumPackedBytes:allocation.maximumPackedBytes,maximumTileRoots:1600,tileCount:tiles.length,uploadScheduling,gpuUploadCount,gpuUploadedBytes,gpuAllocatedBytes:rootCount*16,preparationMs,controlRoots:[...controlRoots],coarseCoverPolicy:'ALL_INSTALLED_ROOTS_ALWAYS_SUBMITTED',finePolicy:'SECOND_LOBE_SAME_ROOTS_SMOOTH_14_TO_24_METERS',...lastDraw,disposed};}
 function dispose(){if(disposed)return;disposed=true;cleanup();}
 return Object.freeze({draw,getReceipt,dispose});
 }catch(error){cleanup();throw error;}
}

