import {
  evaluateSpatialState,
  evaluateRayDiagnostics,
  verifyProofInvariants
} from './weather-model.mjs';

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const perspective=(fov,aspect,near,far)=>{const f=1/Math.tan(fov/2),inv=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*inv,-1,0,0,2*far*near*inv,0]);};
const lookAt=(eye,target,up)=>{const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);};
const multiply=(left,right)=>{const output=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)output[c*4+r]=left[r]*right[c*4]+left[4+r]*right[c*4+1]+left[8+r]*right[c*4+2]+left[12+r]*right[c*4+3];return output;};

const REST_MAX_PIXELS=320000;
const INTERACTION_MAX_PIXELS=110000;
const REST_SCALE=.72;
const INTERACTION_SCALE=.48;

function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`WEATHER_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;}
function program(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`WEATHER_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(p)}`);return p;}

const DEPTH_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
uniform mat4 uVP;
void main(){gl_Position=uVP*vec4(aPosition,1.0);}`;
const DEPTH_FS=`#version 300 es
precision highp float;
out vec4 outColor;
void main(){outColor=vec4(0.0);}`;
const CLOUD_VS=`#version 300 es
precision highp float;
out vec2 vNdc;
void main(){
  vec2 p=gl_VertexID==0?vec2(-1.0,-1.0):(gl_VertexID==1?vec2(3.0,-1.0):vec2(-1.0,3.0));
  vNdc=p;
  gl_Position=vec4(p,0.0,1.0);
}`;
const CLOUD_FS=`#version 300 es
precision highp float;
in vec2 vNdc;
out vec4 outColor;
uniform sampler2D uTerrainDepth;
uniform mat4 uVP;
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uRight;
uniform vec3 uUp;
uniform float uAspect;
uniform float uTanHalfFov;
uniform vec3 uCenter;
uniform vec3 uAxisU;
uniform vec3 uAxisV;
uniform vec3 uAxisUp;
uniform vec3 uRadii;
uniform vec3 uWeights;
uniform float uDensity;
uniform float uSeed;
uniform vec3 uSunDir;

float hashWave(vec3 q,float seed){return .5+.5*sin(q.x*2.13+q.y*3.71+q.z*1.83+seed*19.7+sin(q.x*1.17-q.z*.91+seed*7.1));}
vec3 localCoordinates(vec3 p){vec3 d=p-uCenter;return vec3(dot(d,uAxisU)/uRadii.x,dot(d,uAxisUp)/uRadii.y,dot(d,uAxisV)/uRadii.z);}
vec2 hitVolume(vec3 ro,vec3 rd){
  vec3 d=ro-uCenter;
  vec3 o=vec3(dot(d,uAxisU)/uRadii.x,dot(d,uAxisUp)/uRadii.y,dot(d,uAxisV)/uRadii.z);
  vec3 v=vec3(dot(rd,uAxisU)/uRadii.x,dot(rd,uAxisUp)/uRadii.y,dot(rd,uAxisV)/uRadii.z);
  float a=dot(v,v),b=2.0*dot(o,v),c=dot(o,o)-1.0,disc=b*b-4.0*a*c;
  if(disc<0.0||a<1e-12)return vec2(1e9,-1e9);
  float root=sqrt(disc),t0=(-b-root)/(2.0*a),t1=(-b+root)/(2.0*a);
  return vec2(max(0.0,min(t0,t1)),max(t0,t1));
}
float sampleDepth(vec3 p){vec4 clip=uVP*vec4(p,1.0);return clip.z/clip.w*.5+.5;}
float densityMode(vec3 q,int mode){
  float r2=dot(q,q);if(r2>=1.0)return 0.0;
  float edge=1.0-r2;
  if(mode==0)return uDensity*edge*.72;
  float broad=.78+.22*hashWave(vec3(q.x*1.8,q.y*1.5,q.z*1.9),uSeed);
  if(mode==1)return uDensity*edge*broad;
  float localEdge=edge*edge;
  float broadLocal=.72+.28*hashWave(vec3(q.x*2.2,q.y*2.7,q.z*2.0),uSeed);
  float detail=.76+.24*hashWave(vec3(q.x*5.1,q.y*4.3,q.z*4.8),uSeed+.37);
  return uDensity*localEdge*broadLocal*detail;
}
float integrateMode(vec3 ro,vec3 rd,vec2 interval,int mode,int steps,float coefficient,float terrainDepth,out float firstVisible){
  if(interval.y<=interval.x)return 0.0;
  float segment=interval.y-interval.x,stepLen=segment/float(steps),tau=0.0;
  for(int s=0;s<14;s++){
    if(s>=steps)break;
    float t=interval.x+(float(s)+.5)*stepLen;
    vec3 p=ro+rd*t;
    float d=sampleDepth(p);
    if(d>=terrainDepth-1e-5)break;
    vec3 q=localCoordinates(p);
    float den=densityMode(q,mode);
    if(den>1e-5&&firstVisible>1e8)firstVisible=t;
    tau+=den*stepLen*coefficient;
  }
  return tau;
}
void main(){
  vec3 rd=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  vec2 interval=hitVolume(uEye,rd);
  if(interval.y<=interval.x){outColor=vec4(0.0);return;}
  ivec2 pixel=ivec2(gl_FragCoord.xy);
  float terrainDepth=texelFetch(uTerrainDepth,pixel,0).r;
  float firstVisible=1e9;
  float tauP=integrateMode(uEye,rd,interval,0,4,.010,terrainDepth,firstVisible);
  float tauR=integrateMode(uEye,rd,interval,1,8,.012,terrainDepth,firstVisible);
  float tauL=integrateMode(uEye,rd,interval,2,14,.014,terrainDepth,firstVisible);
  float tau=uWeights.x*tauP+uWeights.y*tauR+uWeights.z*tauL;
  if(tau<=.0005||firstVisible>1e8){outColor=vec4(0.0);return;}
  vec3 firstPoint=uEye+rd*firstVisible;
  vec3 normal=normalize(firstPoint-uCenter);
  float daylight=.68+.32*clamp(dot(normalize(uSunDir),normal)*.5+.5,0.0,1.0);
  float localMix=uWeights.z;
  vec3 bright=mix(vec3(.84,.87,.89),vec3(.97,.97,.94),daylight);
  vec3 shade=vec3(.53,.57,.60);
  vec3 color=mix(shade,bright,.70+.16*localMix);
  float alpha=clamp(1.0-exp(-tau),0.0,.91);
  outColor=vec4(color,alpha);
}`;

function meshVao(gl,mesh){
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,40,0);
  const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);
  return {vao,count:mesh.indices.length};
}

export function createCanonicalWeatherProjectionLayer({renderer,worldCanvas,objects,onDiagnostics}={}){
  if(!renderer||!(worldCanvas instanceof HTMLCanvasElement)||!Array.isArray(objects))throw new Error('CANONICAL_WEATHER_RENDERER_INPUT_INVALID');
  const parent=worldCanvas.parentElement;if(!(parent instanceof HTMLElement))throw new Error('CANONICAL_WEATHER_PARENT_MISSING');
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  const overlay=document.createElement('canvas');overlay.dataset.canonicalWeatherProjection='true';overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{position:'absolute',pointerEvents:'none',zIndex:'2',background:'transparent'});parent.appendChild(overlay);
  const gl=overlay.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('CANONICAL_WEATHER_WEBGL2_UNAVAILABLE');
  const depthProgram=program(gl,DEPTH_VS,DEPTH_FS),cloudProgram=program(gl,CLOUD_VS,CLOUD_FS);
  const planet=meshVao(gl,renderer.planetMesh),gratitude=meshVao(gl,renderer.gratitudeMesh);
  const depthFramebuffer=gl.createFramebuffer(),depthTexture=gl.createTexture(),colorTexture=gl.createTexture();
  let width=0,height=0,interaction=false,lastDiagnostics=null;

  function allocateTargets(w,h){
    if(width===w&&height===h)return;width=w;height=h;
    gl.bindTexture(gl.TEXTURE_2D,depthTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,w,h,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);
    gl.bindTexture(gl.TEXTURE_2D,colorTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    gl.bindFramebuffer(gl.FRAMEBUFFER,depthFramebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,depthTexture,0);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,colorTexture,0);
    const status=gl.checkFramebufferStatus(gl.FRAMEBUFFER);gl.bindFramebuffer(gl.FRAMEBUFFER,null);if(status!==gl.FRAMEBUFFER_COMPLETE)throw new Error(`CANONICAL_WEATHER_DEPTH_FRAMEBUFFER_INCOMPLETE:${status}`);
  }
  function resize(){
    const rect=worldCanvas.getBoundingClientRect(),parentRect=parent.getBoundingClientRect();overlay.style.left=`${rect.left-parentRect.left}px`;overlay.style.top=`${rect.top-parentRect.top}px`;overlay.style.width=`${rect.width}px`;overlay.style.height=`${rect.height}px`;
    const area=Math.max(1,rect.width*rect.height),maxPixels=interaction?INTERACTION_MAX_PIXELS:REST_MAX_PIXELS,base=interaction?INTERACTION_SCALE:REST_SCALE,cap=Math.sqrt(maxPixels/area),scale=Math.max(.32,Math.min(base,cap));
    const w=Math.max(1,Math.round(rect.width*scale)),h=Math.max(1,Math.round(rect.height*scale));if(overlay.width!==w||overlay.height!==h){overlay.width=w;overlay.height=h;allocateTargets(w,h);}gl.viewport(0,0,w,h);overlay.dataset.renderScale=scale.toFixed(3);overlay.dataset.renderPixels=String(w*h);
  }
  function renderDepth(vp){
    gl.bindFramebuffer(gl.FRAMEBUFFER,depthFramebuffer);gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.depthFunc(gl.LESS);gl.colorMask(false,false,false,false);gl.useProgram(depthProgram);gl.uniformMatrix4fv(gl.getUniformLocation(depthProgram,'uVP'),false,vp);
    gl.bindVertexArray(planet.vao);gl.drawElements(gl.TRIANGLES,planet.count,gl.UNSIGNED_INT,0);gl.bindVertexArray(gratitude.vao);gl.drawElements(gl.TRIANGLES,gratitude.count,gl.UNSIGNED_INT,0);
    gl.colorMask(true,true,true,true);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  }
  function setObjectUniforms(entry){
    const o=entry.object,U=name=>gl.getUniformLocation(cloudProgram,name);
    gl.uniform3fv(U('uCenter'),o.V_i.center);gl.uniform3fv(U('uAxisU'),o.V_i.axisU);gl.uniform3fv(U('uAxisV'),o.V_i.axisV);gl.uniform3fv(U('uAxisUp'),o.V_i.axisUp);gl.uniform3fv(U('uRadii'),o.V_i.radii);
    gl.uniform3f(U('uWeights'),entry.alpha.p,entry.alpha.r,entry.alpha.l);gl.uniform1f(U('uDensity'),o.W_i.density);gl.uniform1f(U('uSeed'),o.W_i.seed);
  }
  function render(camera){
    resize();
    const aspect=overlay.width/overlay.height,vp=multiply(perspective(55*Math.PI/180,aspect,2,6200*4.5),lookAt(camera.eye,camera.target,camera.up));
    const spatial=evaluateSpatialState(objects,camera),rayDiagnostics=evaluateRayDiagnostics(spatial,camera),invariants=verifyProofInvariants(spatial,rayDiagnostics);
    renderDepth(vp);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(cloudProgram);
    const U=name=>gl.getUniformLocation(cloudProgram,name);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,depthTexture);gl.uniform1i(U('uTerrainDepth'),0);gl.uniformMatrix4fv(U('uVP'),false,vp);gl.uniform3fv(U('uEye'),camera.eye);gl.uniform3fv(U('uForward'),camera.forward);gl.uniform3fv(U('uRight'),camera.right);gl.uniform3fv(U('uUp'),camera.up);gl.uniform1f(U('uAspect'),aspect);gl.uniform1f(U('uTanHalfFov'),Math.tan(55*Math.PI/360));gl.uniform3f(U('uSunDir'),.42,.78,.46);
    const visible=[...spatial.objects].filter(x=>x.Q_i).sort((a,b)=>b.distance-a.distance||a.object.ID_i.localeCompare(b.object.ID_i));
    for(const entry of visible){setObjectUniforms(entry);gl.drawArrays(gl.TRIANGLES,0,3);}
    gl.disable(gl.BLEND);gl.depthMask(true);
    lastDiagnostics=Object.freeze({schema:'AUDRALIA_CANONICAL_WEATHER_RENDER_RUNTIME_v1',spatial,rayDiagnostics,invariants,renderScale:Number(overlay.dataset.renderScale),renderPixels:Number(overlay.dataset.renderPixels),terrainDepthPrepass:true,planetDepthAuthority:true,gratitudeReliefDepthAuthority:true,activeProjectionCount:visible.length,interactionQuality:interaction?'INTERACTION':'REST'});
    onDiagnostics?.(lastDiagnostics);return lastDiagnostics;
  }
  return Object.freeze({overlay,render,beginInteraction(){interaction=true;},endInteraction(){interaction=false;},getDiagnostics:()=>lastDiagnostics,destroy(){overlay.remove();}});
}
