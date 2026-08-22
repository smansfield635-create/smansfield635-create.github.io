import {createW5RefinementState,verifyW5RefinementState,W5_EMPTY_THRESHOLD} from './fap1-w5-local-density.gb.mjs';
import {L5_EXTINCTION,L5_QUALITY} from './fap1-l5-direct-transmittance.gc.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};

export const FAP1_W5_LOCAL_RAYMARCH_SCHEMA='FAP1_W5_LOCAL_RAYMARCH_SURFACE_v4_R8_L5_DIRECT';
export const W5_RAYMARCH_MAX_STEPS=32;
export const W5_RAYMARCH_MIN_LOCAL_WEIGHT=.035;
export const W5_RAYMARCH_MAX_PIXELS=110000;
export const W5_TEXTURE_DENSITY_MAX=1.8;
export const W5_TEXTURE_FORMAT='R8_UNORM_LINEAR';

const VS=`#version 300 es
precision highp float;
out vec2 vNdc;
void main(){
  vec2 p=gl_VertexID==0?vec2(-1.0,-1.0):(gl_VertexID==1?vec2(3.0,-1.0):vec2(-1.0,3.0));
  vNdc=p;
  gl_Position=vec4(p,0.0,1.0);
}`;

const FS=`#version 300 es
precision highp float;
precision highp sampler3D;
in vec2 vNdc;
out vec4 outColor;
uniform sampler3D uDensity;
uniform vec3 uEye,uForward,uRight,uUp,uSunDir;
uniform vec3 uCenter,uAxisU,uAxisUp,uAxisV,uRadii;
uniform float uAspect,uTanHalfFov,uLocalWeight,uDensityScale,uExtinction,uLightExtinction;
uniform int uStepCount,uLightStepCount;

vec2 intersectUnitSphere(vec3 ro,vec3 rd){
  float a=dot(rd,rd),b=2.0*dot(ro,rd),c=dot(ro,ro)-1.0;
  float disc=b*b-4.0*a*c;
  if(disc<0.0||a<1e-9)return vec2(1e20,-1e20);
  float root=sqrt(disc);
  float t0=(-b-root)/(2.0*a),t1=(-b+root)/(2.0*a);
  return vec2(max(0.0,min(t0,t1)),max(t0,t1));
}

float densityAtUVW(vec3 uvw){
  if(any(lessThan(uvw,vec3(0.0)))||any(greaterThan(uvw,vec3(1.0))))return 0.0;
  return texture(uDensity,uvw).r*uDensityScale;
}

float directSunTransmittance(vec3 q,vec3 sunLocal){
  vec3 origin=q+sunLocal*0.05;
  vec2 hit=intersectUnitSphere(origin,sunLocal);
  if(hit.y<=hit.x)return 1.0;
  float span=hit.y-hit.x;
  float steps=max(float(uLightStepCount),1.0);
  float dt=span/steps;
  float opticalDepth=0.0;
  for(int i=0;i<8;i++){
    if(i>=uLightStepCount)break;
    float t=hit.x+(float(i)+0.5)*dt;
    vec3 uvw=(origin+sunLocal*t)*0.5+0.5;
    float density=densityAtUVW(uvw);
    if(density>0.0025)opticalDepth+=density*dt*uLightExtinction;
  }
  return exp(-opticalDepth);
}

void main(){
  vec3 rdWorld=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  vec3 eyeDelta=uEye-uCenter;
  vec3 ro=vec3(dot(eyeDelta,uAxisU)/uRadii.x,dot(eyeDelta,uAxisUp)/uRadii.y,dot(eyeDelta,uAxisV)/uRadii.z);
  vec3 rd=vec3(dot(rdWorld,uAxisU)/uRadii.x,dot(rdWorld,uAxisUp)/uRadii.y,dot(rdWorld,uAxisV)/uRadii.z);
  vec3 sunWorld=normalize(uSunDir);
  vec3 sunLocal=vec3(dot(sunWorld,uAxisU)/uRadii.x,dot(sunWorld,uAxisUp)/uRadii.y,dot(sunWorld,uAxisV)/uRadii.z);
  vec2 hit=intersectUnitSphere(ro,rd);
  if(hit.y<=hit.x){outColor=vec4(0.0);return;}

  float span=hit.y-hit.x;
  float steps=max(float(uStepCount),1.0);
  float dt=span/steps;
  float accumulatedAlpha=0.0;
  vec3 accumulatedColor=vec3(0.0);
  float occupied=0.0;
  float transmittanceSum=0.0;
  float litSamples=0.0;
  for(int i=0;i<32;i++){
    if(i>=uStepCount||accumulatedAlpha>0.92)break;
    float t=hit.x+(float(i)+0.5)*dt;
    vec3 q=ro+rd*t;
    float density=densityAtUVW(q*0.5+0.5);
    if(density>0.0025){
      occupied+=1.0;
      float directT=directSunTransmittance(q,sunLocal);
      transmittanceSum+=directT;
      litSamples+=1.0;
      float sampleAlpha=1.0-exp(-density*dt*uExtinction*uLocalWeight);
      float directLight=0.28+0.72*directT;
      vec3 litColor=vec3(0.78,0.81,0.85)*directLight;
      accumulatedColor+=(1.0-accumulatedAlpha)*litColor*sampleAlpha;
      accumulatedAlpha+=(1.0-accumulatedAlpha)*sampleAlpha;
    }
  }

  if(accumulatedAlpha<0.001){outColor=vec4(0.0);return;}
  float structure=clamp(occupied/steps,0.0,1.0);
  float meanDirect=litSamples>0.0?transmittanceSum/litSamples:1.0;
  vec3 structureLift=vec3(0.03*structure*meanDirect);
  outColor=vec4(accumulatedColor/max(accumulatedAlpha,0.0001)+structureLift,clamp(accumulatedAlpha,0.0,0.82));
}`;

function compile(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`FAP1_W5_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);
  return shader;
}
function program(gl){
  const p=gl.createProgram();
  gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,VS));
  gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`FAP1_W5_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(p)}`);
  return p;
}
function uniformMap(gl,p,names){return freeze(Object.fromEntries(names.map(name=>[name,gl.getUniformLocation(p,name)])));}
function resizeCanvas(canvas,worldCanvas,interaction=false){
  const rect=worldCanvas.getBoundingClientRect(),parent=worldCanvas.parentElement,parentRect=parent.getBoundingClientRect();
  canvas.style.left=`${rect.left-parentRect.left}px`;
  canvas.style.top=`${rect.top-parentRect.top}px`;
  canvas.style.width=`${rect.width}px`;
  canvas.style.height=`${rect.height}px`;
  const area=Math.max(1,rect.width*rect.height),base=interaction?.42:.54,scale=Math.max(.24,Math.min(base,Math.sqrt(W5_RAYMARCH_MAX_PIXELS/area)));
  const width=Math.max(1,Math.round(rect.width*scale)),height=Math.max(1,Math.round(rect.height*scale));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  canvas.dataset.renderScale=scale.toFixed(3);
  canvas.dataset.renderPixels=String(width*height);
}
function quantizeBrick(brick){
  const data=new Uint8Array(brick.values.length);
  for(let i=0;i<brick.values.length;i++)data[i]=Math.round(clamp(brick.values[i]/W5_TEXTURE_DENSITY_MAX,0,1)*255);
  return data;
}
function uploadBrick(gl,texture,brick){
  const data=quantizeBrick(brick);
  gl.bindTexture(gl.TEXTURE_3D,texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_WRAP_R,gl.CLAMP_TO_EDGE);
  gl.texImage3D(gl.TEXTURE_3D,0,gl.R8,brick.resolution,brick.resolution,brick.resolution,0,gl.RED,gl.UNSIGNED_BYTE,data);
  const error=gl.getError();
  if(error!==gl.NO_ERROR)throw new Error(`FAP1_W5_TEXTURE_UPLOAD_FAILED:${error}`);
}
function qualityName(value){return value==='CAPTURE'?'CAPTURE':value==='INTERACTIVE'?'INTERACTIVE':'REST';}

export function createW5LocalRayMarchSurface({worldCanvas,parent=worldCanvas?.parentElement}={}){
  if(!(worldCanvas instanceof HTMLCanvasElement))throw new Error('FAP1_W5_WORLD_CANVAS_REQUIRED');
  if(!(parent instanceof HTMLElement))throw new Error('FAP1_W5_PARENT_REQUIRED');
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';

  const canvas=document.createElement('canvas');
  canvas.dataset.fap1W5LocalRaymarch='true';
  canvas.dataset.authority='FAP1_DESCRIPTOR_REFINEMENT_ONLY';
  canvas.dataset.lightingApplied='true';
  canvas.dataset.l5Lighting='DIRECT_SUN_TRANSMITTANCE_ONLY';
  canvas.dataset.densityTextureFormat=W5_TEXTURE_FORMAT;
  canvas.dataset.macroRendererMutation='false';
  canvas.dataset.extinctionSplit='true';
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'absolute',pointerEvents:'none',zIndex:'3',background:'transparent',display:'none'});
  parent.appendChild(canvas);

  const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'high-performance'});
  if(!gl)throw new Error('FAP1_W5_WEBGL2_UNAVAILABLE');
  const p=program(gl),vao=gl.createVertexArray(),texture=gl.createTexture();
  const U=uniformMap(gl,p,['uDensity','uEye','uForward','uRight','uUp','uSunDir','uCenter','uAxisU','uAxisUp','uAxisV','uRadii','uAspect','uTanHalfFov','uLocalWeight','uDensityScale','uExtinction','uLightExtinction','uStepCount','uLightStepCount']);
  let lastBrickAddress=null,lastWeatherId=null,lastReceipt=null,interaction=false,requestedQuality='REST';

  function render({camera,spatialState,sunDirection=[.42,.78,.46],quality=null}={}){
    if(!camera?.eye||!camera?.forward||!camera?.right||!camera?.up)throw new Error('FAP1_W5_CAMERA_FRAME_REQUIRED');
    const refinement=createW5RefinementState(spatialState);
    const verified=verifyW5RefinementState(refinement);
    if(!verified.pass)throw new Error(`FAP1_W5_REFINEMENT_INVALID:${verified.failures.join(',')}`);

    const activeEntry=refinement.active?spatialState.objects.find(entry=>entry.object.ID_i===refinement.activeWeatherId):null;
    const localWeight=activeEntry?.alpha?.l??0;
    const effectiveQuality=qualityName(quality??(interaction?'INTERACTIVE':requestedQuality));
    const lightSteps=L5_QUALITY[effectiveQuality].lightSteps;
    if(!refinement.active||!activeEntry||localWeight<W5_RAYMARCH_MIN_LOCAL_WEIGHT){
      canvas.style.display='none';
      lastReceipt=freeze({schema:FAP1_W5_LOCAL_RAYMARCH_SCHEMA,active:false,weatherId:null,localWeight:0,macroRendererMutation:false,lightingApplied:true,l5LightingActive:true,l5LightingModel:'DIRECT_SUN_TRANSMITTANCE_ONLY',quality:effectiveQuality,lightSteps,densityTextureFormat:W5_TEXTURE_FORMAT,extinctionSplit:true,compositeAuthority:'BOUNDED_HANDOFF_PARTICIPANT'});
      return lastReceipt;
    }

    resizeCanvas(canvas,worldCanvas,interaction);
    const brick=refinement.brick,object=activeEntry.object;
    if(lastBrickAddress!==brick.address){uploadBrick(gl,texture,brick);lastBrickAddress=brick.address;}
    lastWeatherId=object.ID_i;
    canvas.style.display='block';
    canvas.dataset.weatherId=object.ID_i;
    canvas.dataset.brickAddress=brick.address;
    canvas.dataset.localWeight=localWeight.toFixed(6);
    canvas.dataset.l5Quality=effectiveQuality;
    canvas.dataset.l5LightSteps=String(lightSteps);

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);
    gl.useProgram(p);gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_3D,texture);gl.uniform1i(U.uDensity,0);
    gl.uniform3fv(U.uEye,camera.eye);gl.uniform3fv(U.uForward,camera.forward);gl.uniform3fv(U.uRight,camera.right);gl.uniform3fv(U.uUp,camera.up);gl.uniform3fv(U.uSunDir,norm(sunDirection));
    gl.uniform3fv(U.uCenter,object.V_i.center);gl.uniform3fv(U.uAxisU,object.V_i.axisU);gl.uniform3fv(U.uAxisUp,object.V_i.axisUp);gl.uniform3fv(U.uAxisV,object.V_i.axisV);gl.uniform3fv(U.uRadii,object.V_i.radii);
    gl.uniform1f(U.uAspect,canvas.width/Math.max(1,canvas.height));gl.uniform1f(U.uTanHalfFov,Math.tan(55*Math.PI/360));gl.uniform1f(U.uLocalWeight,clamp(localWeight,0,1));gl.uniform1f(U.uDensityScale,W5_TEXTURE_DENSITY_MAX);gl.uniform1f(U.uExtinction,.018);gl.uniform1f(U.uLightExtinction,L5_EXTINCTION);gl.uniform1i(U.uStepCount,interaction?20:W5_RAYMARCH_MAX_STEPS);gl.uniform1i(U.uLightStepCount,lightSteps);
    gl.drawArrays(gl.TRIANGLES,0,3);

    lastReceipt=freeze({
      schema:FAP1_W5_LOCAL_RAYMARCH_SCHEMA,
      active:true,
      weatherId:object.ID_i,
      brickAddress:brick.address,
      persistentWeatherIdentity:brick.weatherId===object.ID_i,
      localWeight,
      overlapRegime:localWeight>0&&localWeight<1,
      densitySource:'W5_BOUND_3D_BRICK',
      densityTextureFormat:W5_TEXTURE_FORMAT,
      densityTextureLinearFilteringRequiresExtension:false,
      densityThreshold:W5_EMPTY_THRESHOLD,
      rayMarchSteps:interaction?20:W5_RAYMARCH_MAX_STEPS,
      renderPixels:canvas.width*canvas.height,
      cameraCentered:false,
      macroRendererMutation:false,
      lightingApplied:true,
      l5LightingActive:true,
      l5LightingModel:'DIRECT_SUN_TRANSMITTANCE_ONLY',
      l5DensityAuthority:'W5_FAP1_REFINEMENT',
      quality:effectiveQuality,
      lightSteps,
      lightExtinction:L5_EXTINCTION,
      multipleScattering:false,
      skyAmbient:false,
      groundContribution:false,
      extinctionSplit:true,
      transmittanceLaw:'T_MACRO_TIMES_T_LOCAL_EQUALS_T_CANONICAL_WHEN_DENSITY_MATCHES',
      compositeAuthority:'BOUNDED_HANDOFF_PARTICIPANT'
    });
    return lastReceipt;
  }

  return freeze({
    schema:FAP1_W5_LOCAL_RAYMARCH_SCHEMA,
    canvas,
    render,
    setQuality(value){requestedQuality=qualityName(value);},
    beginInteraction(){interaction=true;},
    endInteraction(){interaction=false;},
    getReceipt:()=>lastReceipt,
    getWeatherId:()=>lastWeatherId,
    destroy(){gl.deleteTexture(texture);gl.deleteVertexArray(vao);gl.deleteProgram(p);canvas.remove();}
  });
}

export function verifyW5LocalRayMarchReceipt(receipt){
  const failures=[];
  if(receipt?.active){
    if(!receipt.weatherId)failures.push('WEATHER_ID_MISSING');
    if(receipt.persistentWeatherIdentity!==true)failures.push('PERSISTENT_WEATHER_IDENTITY_FAILED');
    if(!(receipt.localWeight>=W5_RAYMARCH_MIN_LOCAL_WEIGHT&&receipt.localWeight<=1))failures.push('LOCAL_WEIGHT_INVALID');
    if(receipt.cameraCentered!==false)failures.push('CAMERA_CENTERED_VOLUME_FORBIDDEN');
    if(receipt.densitySource!=='W5_BOUND_3D_BRICK')failures.push('NON_W5_DENSITY_SOURCE');
    if(receipt.densityTextureFormat!==W5_TEXTURE_FORMAT)failures.push('W5_TEXTURE_FORMAT_INVALID');
    if(receipt.densityTextureLinearFilteringRequiresExtension!==false)failures.push('FLOAT_LINEAR_DEPENDENCY_FORBIDDEN');
  }
  if(receipt?.macroRendererMutation!==false)failures.push('LOCAL_MODULE_MACRO_MUTATION_FORBIDDEN');
  if(receipt?.lightingApplied!==true||receipt?.l5LightingActive!==true)failures.push('L5_DIRECT_LIGHTING_NOT_ACTIVE');
  if(receipt?.l5LightingModel!=='DIRECT_SUN_TRANSMITTANCE_ONLY')failures.push('L5_LIGHTING_SCOPE_DRIFT');
  if(!Number.isInteger(receipt?.lightSteps)||![3,5,8].includes(receipt.lightSteps))failures.push('L5_LIGHT_STEP_SCHEDULE_INVALID');
  if(receipt?.multipleScattering!==false||receipt?.groundContribution!==false)failures.push('L5_SCOPE_EXPANSION_FORBIDDEN');
  if(receipt?.extinctionSplit!==true)failures.push('EXTINCTION_SPLIT_REQUIRED');
  if(receipt?.compositeAuthority!=='BOUNDED_HANDOFF_PARTICIPANT')failures.push('BOUNDED_HANDOFF_AUTHORITY_REQUIRED');
  return freeze({schema:'FAP1_W5_LOCAL_RAYMARCH_INVARIANTS_v4_R8_L5_DIRECT',pass:failures.length===0,failures:freeze(failures),weatherId:receipt?.weatherId??null});
}
