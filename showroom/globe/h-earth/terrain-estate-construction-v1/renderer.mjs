import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT,
  sampleHEarthMapWideEnvironmentPresentation
} from '../../../../h-earth-3d/environment/h-earth.gratitude-region-mirror-manor-estate.v1.js';
import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const clamp01=(v)=>clamp(v,0,1);
const mix=(a,b,t)=>a*(1-t)+b*t;
const mix3=(a,b,t)=>[mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)];
const normalize=(v)=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l];};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const subtract=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const wrapAngle=(v)=>Math.atan2(Math.sin(v),Math.cos(v));

export const PREVIEW_DOMAIN=Object.freeze({xMinimum:-256,xMaximum:256,zMinimum:-320,zMaximum:64,columns:121,rows:91});
const WORLD_CENTER=Object.freeze({x:0,z:-132});
const CAMERA_LIMITS=Object.freeze({minimumPitch:0.46,maximumPitch:1.49,minimumDistance:95,maximumDistance:1600,worldFitDistance:1180,maximumTargetX:246,minimumTargetX:-246,maximumTargetZ:54,minimumTargetZ:-310});

function perspective(fov,aspect,near,far){
  const f=1/Math.tan(fov/2),nf=1/(near-far);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
function lookAt(eye,target,up){
  const z=normalize(subtract(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=normalize(x);const y=cross(z,x);
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x[0]*eye[0]-x[1]*eye[1]-x[2]*eye[2],-y[0]*eye[0]-y[1]*eye[1]-y[2]*eye[2],-z[0]*eye[0]-z[1]*eye[1]-z[2]*eye[2],1]);
}
function multiply(a,b){
  const out=new Float32Array(16);
  for(let c=0;c<4;c+=1)for(let r=0;r<4;r+=1)out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
  return out;
}

const TERRAIN_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec3 aColor;
layout(location=3) in float aRelief;
uniform mat4 uViewProjection;
uniform float uVerticalScale;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec3 vColor;
void main(){float y=aPosition.y+aRelief;vec3 p=vec3(aPosition.x,y*uVerticalScale,aPosition.z);vWorldPosition=vec3(aPosition.x,y,aPosition.z);vNormal=normalize(vec3(aNormal.x,aNormal.y/max(uVerticalScale,0.0001),aNormal.z));vColor=aColor;gl_Position=uViewProjection*vec4(p,1.0);}`;
const TERRAIN_FS=`#version 300 es
precision highp float;
in vec3 vWorldPosition;in vec3 vNormal;in vec3 vColor;uniform vec3 uCameraPosition;uniform vec3 uSunDirection;uniform vec3 uGroundHaze;out vec4 outColor;
vec3 perturbTerrainNormal(vec3 n,vec3 p,float h){vec3 dx=dFdx(p),dy=dFdy(p);float hx=dFdx(h),hy=dFdy(h);vec3 g=hx*cross(dy,n)+hy*cross(n,dx);float d=dot(dx,cross(dy,n));float o=d<0.0?-1.0:1.0;return normalize(abs(d)*n-o*g);}
vec3 limitTerrainNormalDeviation(vec3 n,vec3 c){const float C=0.9271838545667874;const float S=0.3746065934159120;float q=clamp(dot(n,c),-1.0,1.0);if(q>=C)return c;vec3 t=c-n*q;float l=length(t);if(l<0.00001)return n;return normalize(n*C+t/l*S);}
void main(){vec3 n=normalize(vNormal);float slope=1.0-clamp(n.y,0.0,1.0);float distanceToCamera=length(vWorldPosition-uCameraPosition);const vec3 A=vec3(0.8164965809277260,0.4082482904638630,0.4082482904638630);const vec3 B=vec3(-0.4082482904638630,0.8164965809277260,0.4082482904638630);const vec3 C=vec3(0.4082482904638630,-0.4082482904638630,0.8164965809277260);float pa=dot(vWorldPosition,A)*3.306939635357677+0.37;float pb=dot(vWorldPosition,B)*2.7318196987737333+2.17;float pc=dot(vWorldPosition,C)*2.243994752564138+4.11;float footprint=max(fwidth(pa),max(fwidth(pb),fwidth(pc)));float aa=1.0-smoothstep(0.45,0.95,footprint);float signal=sin(pa)*0.50+sin(pb)*0.30+sin(pc)*0.20;float h=signal*0.22*0.42;float distanceEnvelope=1.0-smoothstep(120.0,300.0,distanceToCamera);float slopeEnvelope=mix(0.82,1.0,smoothstep(0.05,0.55,slope));float steepSuppression=1.0-smoothstep(0.58,0.88,slope);float envelope=clamp(distanceEnvelope*slopeEnvelope*aa*steepSuppression,0.0,1.0);vec3 bounded=limitTerrainNormalDeviation(n,perturbTerrainNormal(n,vWorldPosition,h));vec3 shadingNormal=normalize(mix(n,bounded,envelope));vec3 lightDirection=normalize(-uSunDirection);float diffuse=max(dot(shadingNormal,lightDirection),0.0);float hemisphere=0.50+0.50*clamp(shadingNormal.y*0.5+0.5,0.0,1.0);vec3 color=vColor*(0.46+0.64*diffuse)*hemisphere;float fog=clamp((distanceToCamera-280.0)/(690.0-280.0),0.0,0.68);outColor=vec4(mix(color,uGroundHaze,fog),1.0);}`;
const WATER_VS=`#version 300 es
precision highp float;layout(location=0) in vec3 aPosition;layout(location=1) in vec4 aColor;uniform mat4 uViewProjection;uniform float uVerticalScale;out vec4 vColor;void main(){vColor=aColor;gl_Position=uViewProjection*vec4(aPosition.x,aPosition.y*uVerticalScale,aPosition.z,1.0);}`;
const WATER_FS=`#version 300 es
precision highp float;in vec4 vColor;out vec4 outColor;void main(){outColor=vColor;}`;

function compileShader(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;}
function createProgram(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,compileShader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,compileShader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(p)}`);return p;}
function deterministicSignal(x,z){const s=Math.sin(x*12.9898+z*78.233)*43758.5453;return s-Math.floor(s);}
function terrainColor(t,x,z){
  const p=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT.palette,e=t.presentationElevation,site=clamp01(t.sitePreparation?.weight??0),reservoir=clamp01(t.hydrology?.reservoirWeight??0),cavern=clamp01(t.hydrology?.cavernReserveWeight??0);
  const slope=1-clamp01(t.normal?.y??1),coast=clamp01((z+154)/78),shore=clamp01(1-Math.abs(e-1.2)/6.4)*coast,high=clamp01((e-28)/36),low=clamp01((31-e)/22);
  let c=p.openMeadow;c=mix3(c,p.coastalLowland,low*0.60);c=mix3(c,p.beachSand,shore*0.90);c=mix3(c,p.upland,high*0.50);c=mix3(c,p.highlandRock,high*0.72);c=mix3(c,p.exposedStone,clamp01(slope*1.1));c=mix3(c,p.reservoirBank,reservoir*0.66);c=mix3(c,p.cavernApproach,cavern*0.42);if(t.insideReservedEstateEnvelope)c=mix3(c,p.estateMeadow,0.44);c=mix3(c,p.preparedEarth,site*0.58);
  const v=(deterministicSignal(x,z)-0.5)*0.035*(1-site*0.6);return c.map((q)=>clamp01(q+v));
}
function gridNormal(samples,row,column,columns,rows,dx,dz){
  const idx=(r,c)=>r*columns+c,left=samples[idx(row,Math.max(0,column-1))].presentationElevation,right=samples[idx(row,Math.min(columns-1,column+1))].presentationElevation,back=samples[idx(Math.max(0,row-1),column)].presentationElevation,front=samples[idx(Math.min(rows-1,row+1),column)].presentationElevation;
  return normalize([left-right,2*dx,back-front].map((v,i)=>i===2?v*dx/dz:v));
}

export function buildMapWideEnvironmentMesh(){
  const {xMinimum,xMaximum,zMinimum,zMaximum,columns,rows}=PREVIEW_DOMAIN,dx=(xMaximum-xMinimum)/(columns-1),dz=(zMaximum-zMinimum)/(rows-1),samples=new Array(columns*rows),vertices=[],indices=[];
  let minimumElevation=Infinity,maximumElevation=-Infinity,minimumRelief=Infinity,maximumRelief=-Infinity,validSampleCount=0,estateSampleCount=0,sitePreparationSampleCount=0,reservoirSampleCount=0,waterfallSampleCount=0,cavernReserveSampleCount=0;
  for(let row=0;row<rows;row+=1){const z=mix(zMinimum,zMaximum,row/(rows-1));for(let column=0;column<columns;column+=1){const x=mix(xMinimum,xMaximum,column/(columns-1)),terrain=sampleHEarthMapWideEnvironmentTerrainCandidate(x,z);if(terrain?.valid!==true)throw new Error(`TERRAIN_SAMPLE_INVALID:${x}:${z}`);samples[row*columns+column]=terrain;}}
  for(let row=0;row<rows;row+=1){const z=mix(zMinimum,zMaximum,row/(rows-1));for(let column=0;column<columns;column+=1){const x=mix(xMinimum,xMaximum,column/(columns-1)),terrain=samples[row*columns+column],normal=gridNormal(samples,row,column,columns,rows,dx,dz),color=terrainColor(terrain,x,z);vertices.push(x,terrain.elevation,z,normal[0],normal[1],normal[2],color[0],color[1],color[2],terrain.presentationReliefOffset);validSampleCount+=1;minimumElevation=Math.min(minimumElevation,terrain.presentationElevation);maximumElevation=Math.max(maximumElevation,terrain.presentationElevation);minimumRelief=Math.min(minimumRelief,terrain.presentationReliefOffset);maximumRelief=Math.max(maximumRelief,terrain.presentationReliefOffset);if(terrain.insideReservedEstateEnvelope)estateSampleCount+=1;if((terrain.sitePreparation?.weight??0)>0.01)sitePreparationSampleCount+=1;if((terrain.hydrology?.reservoirWeight??0)>0.01)reservoirSampleCount+=1;if((terrain.hydrology?.waterfallWeight??0)>0.01)waterfallSampleCount+=1;if((terrain.hydrology?.cavernReserveWeight??0)>0.01)cavernReserveSampleCount+=1;}}
  const idx=(r,c)=>r*columns+c;for(let r=0;r<rows-1;r+=1)for(let c=0;c<columns-1;c+=1){const a=idx(r,c),b=idx(r,c+1),d=idx(r+1,c+1),e=idx(r+1,c);indices.push(a,e,b,b,e,d);}
  return Object.freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:Object.freeze({validSampleCount,triangleCount:indices.length/3,minimumElevation,maximumElevation,minimumRelief,maximumRelief,estateSampleCount,sitePreparationSampleCount,reservoirSampleCount,waterfallSampleCount,cavernReserveSampleCount,rendererClass:'WEBGL2_MOBILE_SINGLE_PASS_TERRAIN_INSPECTOR',worldInspectorRepairRevision:4,singlePassTerrainSampling:true,neighborResamplingRemoved:true,guideOverlayRenderPathPresent:false,v2VirtualNormalReliefExecutedInFragmentShader:true,inspectorVirtualReliefScale:0.42,verticalScale:1.35})});
}

function pushWaterVertex(v,x,y,z,c){v.push(x,y,z,c[0],c[1],c[2],c[3]);}
export function buildWaterContextMesh(){
  const vertices=[],indices=[],palette=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT.waterPresentation,hydro=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,tri=(a,b,c)=>indices.push(a,b,c),oceanBase=0,oceanY=hydro.seaLevelY+0.12;
  for(const [x,z] of [[-300,-145],[300,-145],[-300,90],[300,90]])pushWaterVertex(vertices,x,oceanY,z,palette.ocean);tri(oceanBase,oceanBase+2,oceanBase+1);tri(oceanBase+1,oceanBase+2,oceanBase+3);
  const reservoir=hydro.reservoir,reservoirBase=vertices.length/7,reservoirSegments=40;pushWaterVertex(vertices,reservoir.center.x,reservoir.waterSurfaceElevation+0.12,reservoir.center.z,palette.reservoir);for(let i=0;i<=reservoirSegments;i+=1){const a=i/reservoirSegments*Math.PI*2;pushWaterVertex(vertices,reservoir.center.x+Math.cos(a)*reservoir.radius.x*0.82,reservoir.waterSurfaceElevation+0.12,reservoir.center.z+Math.sin(a)*reservoir.radius.z*0.82,palette.reservoir);}for(let i=0;i<reservoirSegments;i+=1)tri(reservoirBase,reservoirBase+i+1,reservoirBase+i+2);
  const waterfall=hydro.waterfall,waterfallBase=vertices.length/7,waterfallSegments=24,crest=sampleHEarthMapWideEnvironmentPresentation(waterfall.visibleCrest.x,waterfall.visibleCrest.z),topY=crest?.valid===true?crest.presentationElevation+1.4:reservoir.waterSurfaceElevation+28,bottomY=reservoir.waterSurfaceElevation+0.55,w=2.6;for(let i=0;i<=waterfallSegments;i+=1){const t=i/waterfallSegments,x=mix(waterfall.visibleCrest.x,waterfall.landing.x,t),z=mix(waterfall.visibleCrest.z,waterfall.landing.z,t),y=mix(topY,bottomY,t);pushWaterVertex(vertices,x-w,y,z,palette.waterfall);pushWaterVertex(vertices,x+w,y,z,palette.waterfall);}for(let i=0;i<waterfallSegments;i+=1){const a=waterfallBase+i*2,b=a+1,c=a+2,d=a+3;tri(a,c,b);tri(b,c,d);}
  return Object.freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:Object.freeze({triangleCount:indices.length/3,oceanTriangleCount:2,reservoirTriangleCount:reservoirSegments,waterfallTriangleCount:waterfallSegments*2,authoringContextOnly:true,liveWaterMutation:false})});
}
function createIndexedMeshBuffers(gl,mesh,stride,attributes){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vertexBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);for(const [location,size,offset] of attributes){gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,stride,offset);}const indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return Object.freeze({vao,vertexBuffer,indexBuffer});}

export function createMapWideEnvironmentRenderer(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');
  const terrainProgram=createProgram(gl,TERRAIN_VS,TERRAIN_FS),waterProgram=createProgram(gl,WATER_VS,WATER_FS),mesh=buildMapWideEnvironmentMesh(),waterMesh=buildWaterContextMesh(),terrainBuffers=createIndexedMeshBuffers(gl,mesh,40,[[0,3,0],[1,3,12],[2,3,24],[3,1,36]]),waterBuffers=createIndexedMeshBuffers(gl,waterMesh,28,[[0,3,0],[1,4,12]]);
  const state={yaw:-0.62,pitch:0.82,distance:CAMERA_LIMITS.worldFitDistance,targetX:WORLD_CENTER.x,targetZ:WORLD_CENTER.z,verticalScale:1.35,renderedFrames:0,cameraRecoveryCount:0};
  function resize(){const dpr=Math.min(1.5,window.devicePixelRatio||1),width=Math.max(1,Math.round(canvas.clientWidth*dpr)),height=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,canvas.width,canvas.height);}
  function clampCameraState(){const prior=`${state.pitch}|${state.distance}|${state.targetX}|${state.targetZ}`;state.pitch=clamp(state.pitch,CAMERA_LIMITS.minimumPitch,CAMERA_LIMITS.maximumPitch);state.distance=clamp(state.distance,CAMERA_LIMITS.minimumDistance,CAMERA_LIMITS.maximumDistance);state.targetX=clamp(state.targetX,CAMERA_LIMITS.minimumTargetX,CAMERA_LIMITS.maximumTargetX);state.targetZ=clamp(state.targetZ,CAMERA_LIMITS.minimumTargetZ,CAMERA_LIMITS.maximumTargetZ);state.yaw=wrapAngle(state.yaw);if(prior!==`${state.pitch}|${state.distance}|${state.targetX}|${state.targetZ}`)state.cameraRecoveryCount+=1;}
  function targetElevation(){const s=sampleHEarthMapWideEnvironmentTerrainCandidate(state.targetX,state.targetZ);return s?.valid===true&&Number.isFinite(s.presentationElevation)?s.presentationElevation:18;}
  function camera(){clampCameraState();const targetY=targetElevation()*state.verticalScale,cp=Math.cos(state.pitch),target=[state.targetX,targetY,state.targetZ],eye=[target[0]+state.distance*cp*Math.sin(state.yaw),target[1]+state.distance*Math.sin(state.pitch),target[2]+state.distance*cp*Math.cos(state.yaw)];return{eye,target};}
  function render(){resize();const {eye,target}=camera(),projection=perspective(Math.PI/3,canvas.width/canvas.height,1,2400),view=lookAt(eye,target,[0,1,0]),vp=multiply(projection,view),atmosphere=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT.atmosphere;gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.depthMask(true);gl.clearColor(atmosphere.skyZenith[0],atmosphere.skyZenith[1],atmosphere.skyZenith[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(terrainProgram);gl.uniformMatrix4fv(gl.getUniformLocation(terrainProgram,'uViewProjection'),false,vp);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uVerticalScale'),state.verticalScale);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uCameraPosition'),[eye[0],eye[1]/state.verticalScale,eye[2]]);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uSunDirection'),atmosphere.sunDirection);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uGroundHaze'),atmosphere.groundHaze);gl.bindVertexArray(terrainBuffers.vao);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,terrainBuffers.indexBuffer);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.useProgram(waterProgram);gl.uniformMatrix4fv(gl.getUniformLocation(waterProgram,'uViewProjection'),false,vp);gl.uniform1f(gl.getUniformLocation(waterProgram,'uVerticalScale'),state.verticalScale);gl.bindVertexArray(waterBuffers.vao);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,waterBuffers.indexBuffer);gl.drawElements(gl.TRIANGLES,waterMesh.indices.length,gl.UNSIGNED_INT,0);gl.depthMask(true);gl.disable(gl.BLEND);state.renderedFrames+=1;}
  function orbit(dx,dy){state.yaw=wrapAngle(state.yaw+clamp(Number(dx)||0,-64,64)*0.0052);state.pitch=clamp(state.pitch+clamp(Number(dy)||0,-64,64)*0.0032,CAMERA_LIMITS.minimumPitch,CAMERA_LIMITS.maximumPitch);render();}
  function zoom(delta){state.distance=clamp(state.distance*Math.exp(clamp(Number(delta)||0,-900,900)*0.00115),CAMERA_LIMITS.minimumDistance,CAMERA_LIMITS.maximumDistance);render();}
  function zoomByFactor(factor){state.distance=clamp(state.distance/clamp(Number(factor)||1,0.75,1.33),CAMERA_LIMITS.minimumDistance,CAMERA_LIMITS.maximumDistance);render();}
  function pan(dx,dz){state.targetX=clamp(state.targetX+(Number(dx)||0),CAMERA_LIMITS.minimumTargetX,CAMERA_LIMITS.maximumTargetX);state.targetZ=clamp(state.targetZ+(Number(dz)||0),CAMERA_LIMITS.minimumTargetZ,CAMERA_LIMITS.maximumTargetZ);render();}
  function panScreen(dx,dy){const scale=clamp(state.distance*0.0021,0.28,2.2),rx=Math.cos(state.yaw),rz=-Math.sin(state.yaw),fx=Math.sin(state.yaw),fz=Math.cos(state.yaw);pan((-dx*rx+dy*fx)*scale,(-dx*rz+dy*fz)*scale);}
  function fitWorld(){Object.assign(state,{yaw:-0.62,pitch:0.82,distance:CAMERA_LIMITS.worldFitDistance,targetX:WORLD_CENTER.x,targetZ:WORLD_CENTER.z});render();}
  function getCameraSafety(){return Object.freeze({pitchWithinBounds:state.pitch>=CAMERA_LIMITS.minimumPitch&&state.pitch<=CAMERA_LIMITS.maximumPitch,distanceWithinBounds:state.distance>=CAMERA_LIMITS.minimumDistance&&state.distance<=CAMERA_LIMITS.maximumDistance,targetWithinWorld:state.targetX>=CAMERA_LIMITS.minimumTargetX&&state.targetX<=CAMERA_LIMITS.maximumTargetX&&state.targetZ>=CAMERA_LIMITS.minimumTargetZ&&state.targetZ<=CAMERA_LIMITS.maximumTargetZ,fitWorldAvailable:true,guideOverlayRenderPathAbsent:true,authoringWaterContextOnly:true});}
  return Object.freeze({mesh,waterMesh,state,render,orbit,zoom,zoomByFactor,pan,panScreen,fitWorld,getCameraSafety,getSnapshot:()=>Object.freeze({...state,webgl2:true,v2VirtualNormalReliefExecuted:true,statistics:mesh.statistics,waterStatistics:waterMesh.statistics,manorGeometryConstructed:false,cavernInteriorConstructed:false,vaultInteriorConstructed:false,liveWaterMutated:false,cameraScope:'NONPUBLIC_PREVIEW_ONLY',guideOverlayRenderPathPresent:false,cameraSafety:getCameraSafety()})});
}
