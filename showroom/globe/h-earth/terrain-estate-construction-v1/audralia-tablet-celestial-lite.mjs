const SCHEMA='AUDRALIA_TABLET_CELESTIAL_LITE_v1';
const STAR_COUNT=96;
const SEGMENTS=48;
const RINGS=32;
const TRIANGLES_PER_BODY=SEGMENTS*RINGS*2;
const MAXIMUM_DRAWS=4;
const FOV=55*Math.PI/180;
const SUN_DIRECTION=normalize([0.42,0.78,0.46]);
const MOON_DIRECTION=normalize([-0.74,0.18,0.65]);
const DONORS=Object.freeze({
  fibonacci:'76d71d7cbafe52421c9eb68e3604792cc6755cf3',
  fibonacciReference:'93a9fc9989b53ef75319dc1af0206ebc6a2b537c',
  celestial:'27577c49250f42b03d123f8105e1d55d59c3a4b4',
  phoneCelestialNonDonor:'3dbe7ade97c6d6cd472d87dc100a3162113ae05d'
});

function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function normalize(v){const n=Math.hypot(v[0],v[1],v[2])||1;return [v[0]/n,v[1]/n,v[2]/n];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function mix3(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
function smoothstep(a,b,v){const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);}
function deterministicField(x,y,z,frequency,phase){return Math.sin((x*1.73+y*2.11+z*2.67)*frequency+phase)*.50+Math.sin((x*2.93-y*1.37+z*1.91)*frequency*1.61-phase*.73)*.30+Math.sin((-x*1.17+y*2.51+z*3.07)*frequency*2.37+phase*1.29)*.20;}
function compile(gl,type,source){const shader=gl.createShader(type);if(!shader)throw new Error('CELESTIAL_SHADER_CREATE_FAILED');gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(shader)||'UNKNOWN_SHADER_ERROR';gl.deleteShader(shader);throw new Error(`CELESTIAL_SHADER_COMPILE_FAILED:${message}`);}return shader;}
function program(gl,vs,fs){const v=compile(gl,gl.VERTEX_SHADER,vs),f=compile(gl,gl.FRAGMENT_SHADER,fs),p=gl.createProgram();if(!p)throw new Error('CELESTIAL_PROGRAM_CREATE_FAILED');gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){const message=gl.getProgramInfoLog(p)||'UNKNOWN_PROGRAM_LINK_ERROR';gl.deleteProgram(p);throw new Error(`CELESTIAL_PROGRAM_LINK_FAILED:${message}`);}return p;}
function buffer(gl,data){const out=gl.createBuffer();if(!out)throw new Error('CELESTIAL_BUFFER_CREATE_FAILED');gl.bindBuffer(gl.ARRAY_BUFFER,out);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return out;}
function basis(center){const helper=Math.abs(center[1])<.9?[0,1,0]:[1,0,0],right=normalize(cross(helper,center)),up=normalize(cross(center,right));return {right,up};}
function surfaceColor(mode,n){
  const [x,y,z]=n;
  if(mode==='solar'){
    const broad=deterministicField(x,y,z,2.65,.73),fold=deterministicField(x,y,z,6.9,2.17),fine=deterministicField(x,y,z,24,1.31),channel=1-smoothstep(.055,.31,Math.abs(deterministicField(x,y,z,4.2,1.07)));
    const heat=clamp(.50+broad*.18+fold*.13+fine*.05-channel*.17,0,1);
    if(heat<.25)return mix3([.38,.07,.006],[.72,.145,.008],heat/.25);
    if(heat<.55)return mix3([.72,.145,.008],[1,.335,.015],(heat-.25)/.30);
    if(heat<.80)return mix3([1,.335,.015],[1,.69,.075],(heat-.55)/.25);
    return mix3([1,.69,.075],[1,.97,.67],(heat-.80)/.20);
  }
  const macro=deterministicField(x,y,z,2.1,1.43),high=deterministicField(x,y,z,5.4,.39),ridge=deterministicField(x,y,z,8.6,1.17),fine=deterministicField(x,y,z,18.8,2.07);
  const craterA=Math.exp(-Math.pow((dot(n,normalize([.34,.18,.92]))-.93)*7.5,2));
  const craterB=Math.exp(-Math.pow((dot(n,normalize([-.48,.52,.70]))-.94)*9.0,2));
  const maria=smoothstep(.18,.72,dot(n,normalize([.12,.30,.95])));
  const light=normalize([-.62,.22,.75]),illum=dot(n,light),terminator=.14+.86*smoothstep(-.20,.22,illum);
  const albedo=clamp(.56+macro*.05+high*.09+ridge*.04+fine*.015-craterA*.16-craterB*.11-maria*.14,.18,.96);
  const shade=clamp(albedo*(.31+.69*terminator),.10,1);
  return [shade*.92,shade*.95,shade];
}
function createSphere(center,angularRadius,mode){
  const distance=1000,radius=Math.tan(angularRadius)*distance,{right,up}=basis(center),vertices=[];
  function point(phi,theta){
    const sx=Math.sin(phi)*Math.cos(theta),sy=Math.cos(phi),sz=Math.sin(phi)*Math.sin(theta);
    const local=[right[0]*sx+up[0]*sy+center[0]*sz,right[1]*sx+up[1]*sy+center[1]*sz,right[2]*sx+up[2]*sy+center[2]*sz];
    const p=[center[0]*distance+local[0]*radius,center[1]*distance+local[1]*radius,center[2]*distance+local[2]*radius];
    const color=surfaceColor(mode,normalize(local));
    return {p,color};
  }
  for(let ring=0;ring<RINGS;ring++){
    const p0=ring/RINGS*Math.PI,p1=(ring+1)/RINGS*Math.PI;
    for(let segment=0;segment<SEGMENTS;segment++){
      const t0=segment/SEGMENTS*Math.PI*2,t1=(segment+1)/SEGMENTS*Math.PI*2;
      const a=point(p0,t0),b=point(p1,t0),c=point(p1,t1),d=point(p0,t1);
      for(const v of [a,b,c,a,c,d])vertices.push(v.p[0],v.p[1],v.p[2],v.color[0],v.color[1],v.color[2]);
    }
  }
  return new Float32Array(vertices);
}
function createStars(){
  const data=[],golden=Math.PI*(3-Math.sqrt(5)),palette=[[1,.96,.88],[.78,.88,1],[1,.78,.45],[.84,.70,1]];
  for(let i=0;i<STAR_COUNT;i++){
    const y=1-2*(i+.5)/STAR_COUNT,r=Math.sqrt(Math.max(0,1-y*y)),theta=i*golden+.37,direction=[Math.cos(theta)*r,y,Math.sin(theta)*r];
    const h=(Math.imul(i+11,2654435761)>>>0)/4294967295,klass=i%17===0?3:i%11===0?2:i%7===0?1:0,color=palette[klass],size=1.45+h*1.65,alpha=.52+h*.42;
    data.push(direction[0],direction[1],direction[2],size,alpha,color[0],color[1],color[2]);
  }
  return new Float32Array(data);
}
const STAR_VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aDirection;\nlayout(location=1) in float aSize;\nlayout(location=2) in float aAlpha;\nlayout(location=3) in vec3 aColor;\nuniform vec3 uRight;uniform vec3 uUp;uniform vec3 uForward;uniform float uAspect;uniform float uTanHalfFov;uniform float uVisibility;uniform float uViewportScale;\nout vec3 vColor;out float vAlpha;\nvoid main(){float z=dot(aDirection,uForward);if(z<=0.04){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;}else{float x=dot(aDirection,uRight)/(z*uTanHalfFov*uAspect);float y=dot(aDirection,uUp)/(z*uTanHalfFov);gl_Position=vec4(x,y,0.999,1.0);gl_PointSize=aSize*uViewportScale;}vColor=aColor;vAlpha=aAlpha*uVisibility;}`;
const STAR_FS=`#version 300 es\nprecision highp float;\nin vec3 vColor;in float vAlpha;out vec4 outColor;\nvoid main(){vec2 p=gl_PointCoord*2.0-1.0;float d=dot(p,p);if(d>1.0)discard;float a=(1.0-smoothstep(.15,1.0,d))*vAlpha;outColor=vec4(vColor,a);}`;
const BODY_VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;layout(location=1) in vec3 aColor;\nuniform vec3 uRight;uniform vec3 uUp;uniform vec3 uForward;uniform float uAspect;uniform float uTanHalfFov;uniform float uVisibility;out vec3 vColor;out float vAlpha;\nvoid main(){float z=dot(aPosition,uForward);if(z<=1.0){gl_Position=vec4(2.0,2.0,2.0,1.0);}else{float x=dot(aPosition,uRight)/(z*uTanHalfFov*uAspect);float y=dot(aPosition,uUp)/(z*uTanHalfFov);gl_Position=vec4(x,y,0.998,1.0);}vColor=aColor;vAlpha=uVisibility;}`;
const BODY_FS=`#version 300 es\nprecision highp float;\nin vec3 vColor;in float vAlpha;out vec4 outColor;\nvoid main(){outColor=vec4(vColor,vAlpha);}`;

export function createAudraliaTabletCelestialLite({gl}={}){
  if(!gl)throw new Error('AUDRALIA_CELESTIAL_LITE_GL_REQUIRED');
  let status='UNPREPARED',failure=null,preparationMode='DEFERRED_OR_LAZY',lastDistance=null,lastVisibility=0,lastViewScale=null,lastDraws=0;
  let starProgram=null,bodyProgram=null,starVao=null,sunVao=null,moonVao=null,resources=[];
  const stars=createStars();
  function classifyFailure(error){status='FAILED';failure=String(error?.message||error||'UNKNOWN_CELESTIAL_FAILURE');lastDraws=0;safeState();return false;}
  function safeState(){try{gl.depthMask(true);gl.disable(gl.BLEND);gl.disable(gl.STENCIL_TEST);gl.disable(gl.CULL_FACE);gl.bindVertexArray(null);gl.bindBuffer(gl.ARRAY_BUFFER,null);gl.useProgram(null);}catch{}}
  function bodyVao(data){const vao=gl.createVertexArray();if(!vao)throw new Error('CELESTIAL_VAO_CREATE_FAILED');gl.bindVertexArray(vao);const b=buffer(gl,data);resources.push(b);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);return vao;}
  function prepare(){
    if(status==='READY')return true;if(status==='FAILED')return false;
    try{
      starProgram=program(gl,STAR_VS,STAR_FS);bodyProgram=program(gl,BODY_VS,BODY_FS);resources.push(starProgram,bodyProgram);
      starVao=gl.createVertexArray();if(!starVao)throw new Error('CELESTIAL_STAR_VAO_CREATE_FAILED');gl.bindVertexArray(starVao);const sb=buffer(gl,stars);resources.push(sb);const stride=32;gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,stride,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,1,gl.FLOAT,false,stride,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,stride,16);gl.enableVertexAttribArray(3);gl.vertexAttribPointer(3,3,gl.FLOAT,false,stride,20);
      sunVao=bodyVao(createSphere(SUN_DIRECTION,.082,'solar'));moonVao=bodyVao(createSphere(MOON_DIRECTION,.052,'lunar'));
      status='READY';preparationMode='ONE_SHOT_GPU_PREPARED';safeState();return true;
    }catch(error){return classifyFailure(error);}
  }
  function uniforms(p,cameraFrame,viewportWidth,viewportHeight,visibility){
    const aspect=Math.max(1,viewportWidth)/Math.max(1,viewportHeight),tanHalfFov=Math.tan(FOV/2);
    gl.uniform3fv(gl.getUniformLocation(p,'uRight'),cameraFrame.right);gl.uniform3fv(gl.getUniformLocation(p,'uUp'),cameraFrame.up);gl.uniform3fv(gl.getUniformLocation(p,'uForward'),cameraFrame.forward);gl.uniform1f(gl.getUniformLocation(p,'uAspect'),aspect);gl.uniform1f(gl.getUniformLocation(p,'uTanHalfFov'),tanHalfFov);gl.uniform1f(gl.getUniformLocation(p,'uVisibility'),visibility);
  }
  function draw({cameraFrame,distance,viewportWidth,viewportHeight,visibility,viewScale}={}){
    lastDistance=Number.isFinite(distance)?distance:null;lastVisibility=clamp(Number(visibility)||0,0,1);lastViewScale=viewScale||null;lastDraws=0;
    if(lastVisibility<=0||status==='FAILED')return 0;
    if(!cameraFrame||!Array.isArray(cameraFrame.right)||!Array.isArray(cameraFrame.up)||!Array.isArray(cameraFrame.forward))return classifyFailure(new Error('CELESTIAL_CAMERA_FRAME_INVALID'))?0:0;
    if(!prepare())return 0;
    try{
      gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.disable(gl.STENCIL_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(starProgram);uniforms(starProgram,cameraFrame,viewportWidth,viewportHeight,lastVisibility);gl.uniform1f(gl.getUniformLocation(starProgram,'uViewportScale'),clamp(Math.min(viewportWidth,viewportHeight)/720,.75,1.45));gl.bindVertexArray(starVao);gl.drawArrays(gl.POINTS,0,STAR_COUNT);lastDraws++;
      gl.useProgram(bodyProgram);uniforms(bodyProgram,cameraFrame,viewportWidth,viewportHeight,lastVisibility);
      gl.bindVertexArray(moonVao);gl.drawArrays(gl.TRIANGLES,0,TRIANGLES_PER_BODY*3);lastDraws++;
      gl.bindVertexArray(sunVao);gl.drawArrays(gl.TRIANGLES,0,TRIANGLES_PER_BODY*3);lastDraws++;
      safeState();return lastDraws;
    }catch(error){classifyFailure(error);return 0;}
  }
  function getEvidence(){return Object.freeze({schema:SCHEMA,status,donorBlobIdentities:DONORS,phoneCelestialRuntimeImported:false,lawsRuntimeImported:false,canvasCreated:false,webglContextCreated:false,independentAnimationLoop:false,starCount:STAR_COUNT,sunTriangleCount:TRIANGLES_PER_BODY,moonTriangleCount:TRIANGLES_PER_BODY,totalTriangleCount:TRIANGLES_PER_BODY*2,textureBytes:0,additionalDrawCallsLastFrame:lastDraws,maximumAdditionalDrawCalls:MAXIMUM_DRAWS,distance:lastDistance,visibility:lastVisibility,viewScale:lastViewScale,sunDirectionSource:'EXISTING_TABLET_TERRAIN_LIGHT',sunDirection:Object.freeze([...SUN_DIRECTION]),moonDirection:Object.freeze([...MOON_DIRECTION]),preparationMode,failure});}
  function dispose(){for(const resource of resources){try{if(resource&&gl.isBuffer?.(resource))gl.deleteBuffer(resource);else if(resource&&gl.isProgram?.(resource))gl.deleteProgram(resource);}catch{}}try{if(starVao)gl.deleteVertexArray(starVao);if(sunVao)gl.deleteVertexArray(sunVao);if(moonVao)gl.deleteVertexArray(moonVao);}catch{}resources=[];starProgram=bodyProgram=starVao=sunVao=moonVao=null;status='UNPREPARED';preparationMode='DISPOSED';safeState();}
  return Object.freeze({prepare,draw,getEvidence,dispose});
}
