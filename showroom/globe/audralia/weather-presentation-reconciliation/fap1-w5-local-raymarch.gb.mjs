import {createW5RefinementState,verifyW5RefinementState,W5_EMPTY_THRESHOLD} from './fap1-w5-local-density.gb.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

export const FAP1_W5_LOCAL_RAYMARCH_SCHEMA='FAP1_W5_LOCAL_RAYMARCH_SURFACE_v1';
export const W5_RAYMARCH_MAX_STEPS=32;
export const W5_RAYMARCH_MIN_LOCAL_WEIGHT=.035;
export const W5_RAYMARCH_MAX_PIXELS=110000;

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
uniform vec3 uEye,uForward,uRight,uUp;
uniform vec3 uCenter,uAxisU,uAxisUp,uAxisV,uRadii;
uniform float uAspect,uTanHalfFov,uLocalWeight,uDensityScale,uExtinction;
uniform int uStepCount;

vec2 intersectUnitSphere(vec3 ro,vec3 rd){
  float a=dot(rd,rd),b=2.0*dot(ro,rd),c=dot(ro,ro)-1.0;
  float disc=b*b-4.0*a*c;
  if(disc<0.0||a<1e-9)return vec2(1e20,-1e20);
  float root=sqrt(disc);
  float t0=(-b-root)/(2.0*a),t1=(-b+root)/(2.0*a);
  return vec2(max(0.0,min(t0,t1)),max(t0,t1));
}

void main(){
  vec3 rdWorld=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  vec3 eyeDelta=uEye-uCenter;
  vec3 ro=vec3(dot(eyeDelta,uAxisU)/uRadii.x,dot(eyeDelta,uAxisUp)/uRadii.y,dot(eyeDelta,uAxisV)/uRadii.z);
  vec3 rd=vec3(dot(rdWorld,uAxisU)/uRadii.x,dot(rdWorld,uAxisUp)/uRadii.y,dot(rdWorld,uAxisV)/uRadii.z);
  vec2 hit=intersectUnitSphere(ro,rd);
  if(hit.y<=hit.x){outColor=vec4(0.0);return;}

  float span=hit.y-hit.x;
  float steps=max(float(uStepCount),1.0);
  float dt=span/steps;
  float opticalDepth=0.0;
  float occupied=0.0;
  for(int i=0;i<32;i++){
    if(i>=uStepCount)break;
    float t=hit.x+(float(i)+0.5)*dt;
    vec3 q=ro+rd*t;
    vec3 uvw=q*0.5+0.5;
    float density=texture(uDensity,uvw).r*uDensityScale;
    if(density>0.0025){occupied+=1.0;opticalDepth+=density*dt*uExtinction;}
  }

  float alpha=(1.0-exp(-opticalDepth))*uLocalWeight;
  if(alpha<0.001){outColor=vec4(0.0);return;}
  float structure=clamp(occupied/steps,0.0,1.0);
  vec3 neutral=vec3(0.86+0.08*structure);
  outColor=vec4(neutral,clamp(alpha,0.0,0.82));
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
function cameraSignature(camera){
  const s=camera?.snapshot||{};
  return [s.yaw,s.pitch,s.distance,s.targetU,s.targetV].map(v=>Number(v??0).toFixed(3)).join('|');
}
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

function uploadBrick(gl,texture,brick){
  gl.bindTexture(gl.TEXTURE_3D,texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_WRAP_R,gl.CLAMP_TO_EDGE);
  gl.texImage3D(gl.TEXTURE_3D,0,gl.R32F,brick.resolution,brick.resolution,brick.resolution,0,gl.RED,gl.FLOAT,brick.values);
}

export function createW5LocalRayMarchSurface({worldCanvas,parent=worldCanvas?.parentElement}={}){
  if(!(worldCanvas instanceof HTMLCanvasElement))throw new Error('FAP1_W5_WORLD_CANVAS_REQUIRED');
  if(!(parent instanceof HTMLElement))throw new Error('FAP1_W5_PARENT_REQUIRED');
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';

  const canvas=document.createElement('canvas');
  canvas.dataset.fap1W5LocalRaymarch='true';
  canvas.dataset.authority='FAP1_DESCRIPTOR_REFINEMENT_ONLY';
  canvas.dataset.lightingApplied='false';
  canvas.dataset.macroRendererMutation='false';
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'absolute',pointerEvents:'none',zIndex:'3',background:'transparent',display:'none'});
  parent.appendChild(canvas);

  const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'high-performance'});
  if(!gl)throw new Error('FAP1_W5_WEBGL2_UNAVAILABLE');
  const p=program(gl),vao=gl.createVertexArray(),texture=gl.createTexture();
  const U=uniformMap(gl,p,['uDensity','uEye','uForward','uRight','uUp','uCenter','uAxisU','uAxisUp','uAxisV','uRadii','uAspect','uTanHalfFov','uLocalWeight','uDensityScale','uExtinction','uStepCount']);
  let lastBrickAddress=null,lastWeatherId=null,lastReceipt=null,interaction=false;

  function render({camera,spatialState}={}){
    if(!camera?.eye||!camera?.forward||!camera?.right||!camera?.up)throw new Error('FAP1_W5_CAMERA_FRAME_REQUIRED');
    const refinement=createW5RefinementState(spatialState);
    const verified=verifyW5RefinementState(refinement);
    if(!verified.pass)throw new Error(`FAP1_W5_REFINEMENT_INVALID:${verified.failures.join(',')}`);

    const activeEntry=refinement.active?spatialState.objects.find(entry=>entry.object.ID_i===refinement.activeWeatherId):null;
    const localWeight=activeEntry?.alpha?.l??0;
    if(!refinement.active||!activeEntry||localWeight<W5_RAYMARCH_MIN_LOCAL_WEIGHT){
      canvas.style.display='none';
      lastReceipt=freeze({schema:FAP1_W5_LOCAL_RAYMARCH_SCHEMA,active:false,weatherId:null,localWeight:0,macroRendererMutation:false,lightingApplied:false,l5LightingActive:false});
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

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);
    gl.useProgram(p);gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_3D,texture);gl.uniform1i(U.uDensity,0);
    gl.uniform3fv(U.uEye,camera.eye);gl.uniform3fv(U.uForward,camera.forward);gl.uniform3fv(U.uRight,camera.right);gl.uniform3fv(U.uUp,camera.up);
    gl.uniform3fv(U.uCenter,object.V_i.center);gl.uniform3fv(U.uAxisU,object.V_i.axisU);gl.uniform3fv(U.uAxisUp,object.V_i.axisUp);gl.uniform3fv(U.uAxisV,object.V_i.axisV);gl.uniform3fv(U.uRadii,object.V_i.radii);
    gl.uniform1f(U.uAspect,canvas.width/Math.max(1,canvas.height));gl.uniform1f(U.uTanHalfFov,Math.tan(55*Math.PI/360));gl.uniform1f(U.uLocalWeight,clamp(localWeight,0,1));gl.uniform1f(U.uDensityScale,1);gl.uniform1f(U.uExtinction,.018);gl.uniform1i(U.uStepCount,interaction?20:W5_RAYMARCH_MAX_STEPS);
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
      densityThreshold:W5_EMPTY_THRESHOLD,
      rayMarchSteps:interaction?20:W5_RAYMARCH_MAX_STEPS,
      renderPixels:canvas.width*canvas.height,
      cameraCentered:false,
      macroRendererMutation:false,
      macroPassUntouched:true,
      lightingApplied:false,
      l5LightingActive:false,
      compositeAuthority:'DIAGNOSTIC_LOCAL_OVERLAP_ONLY'
    });
    return lastReceipt;
  }

  return freeze({
    schema:FAP1_W5_LOCAL_RAYMARCH_SCHEMA,
    canvas,
    render,
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
  }
  if(receipt?.macroRendererMutation!==false||receipt?.macroPassUntouched!==true)failures.push('MACRO_PASS_MUTATION_FORBIDDEN');
  if(receipt?.lightingApplied!==false||receipt?.l5LightingActive!==false)failures.push('L5_PREMATURE_ACTIVATION');
  if(receipt?.compositeAuthority!=='DIAGNOSTIC_LOCAL_OVERLAP_ONLY')failures.push('UNAUTHORIZED_COMPOSITE_AUTHORITY');
  return freeze({schema:'FAP1_W5_LOCAL_RAYMARCH_INVARIANTS_v1',pass:failures.length===0,failures:freeze(failures),weatherId:receipt?.weatherId??null});
}
