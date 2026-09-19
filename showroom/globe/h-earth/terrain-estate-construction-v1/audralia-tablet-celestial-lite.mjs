const freeze=v=>Object.freeze(v);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5));
const STAR_COUNT=88;
const SEGMENTS=48;
const RINGS=32;
const SUN_TRIANGLES=SEGMENTS*RINGS*2;
const MOON_TRIANGLES=SEGMENTS*RINGS*2;
const SUN_DIRECTION=freeze(norm([.42,.78,.46]));
const MOON_DIRECTION=freeze(norm([-.72,.28,.63]));
const DONORS=freeze({
  fibonacci:'76d71d7cbafe52421c9eb68e3604792cc6755cf3',
  celestial:'27577c49250f42b03d123f8105e1d55d59c3a4b4',
  phoneNonDonor:'3dbe7ade97c6d6cd472d87dc100a3162113ae05d'
});
const STAR_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aDirection;
layout(location=1) in float aSize;
layout(location=2) in vec4 aColor;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uForward;
uniform float uAspect;
uniform float uVisibility;
out vec4 vColor;
void main(){
  vec3 d=normalize(aDirection);
  float z=dot(d,uForward);
  float safeZ=max(.18,z);
  vec2 p=vec2(dot(d,uRight)/uAspect,dot(d,uUp))/safeZ*.72;
  gl_Position=vec4(p,.98,1.0);
  gl_PointSize=aSize;
  vColor=vec4(aColor.rgb,aColor.a*uVisibility*step(.18,z));
}`;
const STAR_FS=`#version 300 es
precision highp float;
in vec4 vColor;
out vec4 outColor;
void main(){vec2 q=gl_PointCoord*2.0-1.0;float r=dot(q,q);if(r>1.0)discard;outColor=vec4(vColor.rgb,vColor.a*(1.0-smoothstep(.16,1.0,r)));}`;
const BODY_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec3 aColor;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uForward;
uniform vec3 uDirection;
uniform float uAspect;
uniform float uAngularScale;
out vec3 vNormal;
out vec3 vColor;
void main(){
  vec3 d=normalize(uDirection);
  vec2 center=vec2(dot(d,uRight)/uAspect,dot(d,uUp))/max(.22,dot(d,uForward))*.72;
  vec2 local=vec2(aPosition.x/uAspect,aPosition.y)*uAngularScale;
  gl_Position=vec4(center+local,.97+aPosition.z*.001,1.0);
  vNormal=aNormal;vColor=aColor;
}`;
const BODY_FS=`#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vColor;
uniform float uVisibility;
uniform float uEmissive;
out vec4 outColor;
void main(){float shade=mix(.48+.52*max(dot(normalize(vNormal),normalize(vec3(-.42,.58,.70))),0.0),1.0,uEmissive);outColor=vec4(vColor*shade,uVisibility);}`;
function compile(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('CELESTIAL_SHADER_COMPILE_FAILED:'+gl.getShaderInfoLog(s));return s;}
function program(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('CELESTIAL_PROGRAM_LINK_FAILED:'+gl.getProgramInfoLog(p));return p;}
function field(x,y,z,f,p){return Math.sin((x*1.73+y*2.11+z*2.67)*f+p)*.5+Math.sin((x*2.93-y*1.37+z*1.91)*f*1.61-p*.73)*.3+Math.sin((-x*1.17+y*2.51+z*3.07)*f*2.37+p*1.29)*.2;}
function starData(){const out=[];for(let i=0;i<STAR_COUNT;i++){const t=(i+.5)/STAR_COUNT,y=1-2*t,r=Math.sqrt(Math.max(0,1-y*y)),a=i*GOLDEN_ANGLE,x=Math.cos(a)*r,z=Math.sin(a)*r,size=1.5+(i%7)*.24,alpha=.42+(i%9)*.045,p=i%11===0?[.78,.86,1]:i%13===0?[1,.82,.52]:[1,.95,.84];out.push(x,y,z,size,p[0],p[1],p[2],Math.min(.88,alpha));}return new Float32Array(out);}
function sphereData(mode){const out=[];const sample=(phi,theta)=>{const nx=Math.sin(phi)*Math.cos(theta),ny=Math.cos(phi),nz=Math.sin(phi)*Math.sin(theta);if(mode==='solar'){const broad=field(nx,ny,nz,2.65,.73),fine=field(nx,ny,nz,18.8,1.31),heat=clamp(.58+broad*.19+fine*.06,0,1),c=heat<.5?[.72+.56*heat,.12+.42*heat,.008]:[1,.33+.64*(heat-.5),.025+.45*(heat-.5)];return{p:[nx,ny,nz],n:[nx,ny,nz],c:c.map(v=>clamp(v,0,1))};}const macro=field(nx,ny,nz,2.1,1.43),ridge=field(nx,ny,nz,8.6,1.17),crater=Math.exp(-Math.pow((Math.acos(clamp(nx*.34+ny*.18+nz*.92,-1,1))/.46-.62)*4.8,2)),relief=1+macro*.005+ridge*.003+crater*.018,shade=clamp(.58+macro*.12+ridge*.06-crater*.14,.22,.9);return{p:[nx*relief,ny*relief,nz*relief],n:[nx,ny,nz],c:[shade*1.02,shade*1.01,shade]};};for(let r=0;r<RINGS;r++)for(let s=0;s<SEGMENTS;s++){const n=(s+1)%SEGMENTS,pts=[[r,s],[r+1,s],[r+1,n],[r,s],[r+1,n],[r,n]];for(const [rr,ss] of pts){const v=sample(rr/RINGS*Math.PI,ss/SEGMENTS*Math.PI*2);out.push(...v.p,...v.n,...v.c);}}return new Float32Array(out);}
function bodyVao(gl,data){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);for(const [loc,size,off] of [[0,3,0],[1,3,12],[2,3,24]]){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,36,off);}return{vao,buffer:b,count:data.length/9};}
export function createAudraliaTabletCelestialLite({gl}={}){
  if(!gl)throw new Error('CELESTIAL_PRIMARY_GL_REQUIRED');
  let status='UNPREPARED',failure=null,resources=null,last=freeze({distance:null,visibility:0,viewScale:'LOCAL',draws:0}),disposed=false;
  function prepare(){if(status==='READY'||status==='FAILED'||disposed)return status;try{const starProgram=program(gl,STAR_VS,STAR_FS),bodyProgram=program(gl,BODY_VS,BODY_FS),stars=starData(),starVao=gl.createVertexArray();gl.bindVertexArray(starVao);const starBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,starBuffer);gl.bufferData(gl.ARRAY_BUFFER,stars,gl.STATIC_DRAW);for(const [loc,size,off] of [[0,3,0],[1,1,12],[2,4,16]]){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,32,off);}const sun=bodyVao(gl,sphereData('solar')),moon=bodyVao(gl,sphereData('lunar'));resources={starProgram,bodyProgram,starVao,starBuffer,sun,moon};status='READY';}catch(error){failure=String(error?.message||error);status='FAILED';}finally{gl.bindVertexArray(null);gl.bindBuffer(gl.ARRAY_BUFFER,null);}return status;}
  function uniforms(p,cameraFrame,aspect,visibility,direction,scale,emissive){gl.useProgram(p);gl.uniform3fv(gl.getUniformLocation(p,'uRight'),cameraFrame.right);gl.uniform3fv(gl.getUniformLocation(p,'uUp'),cameraFrame.up);gl.uniform3fv(gl.getUniformLocation(p,'uForward'),cameraFrame.forward);gl.uniform1f(gl.getUniformLocation(p,'uAspect'),aspect);gl.uniform1f(gl.getUniformLocation(p,'uVisibility'),visibility);if(direction)gl.uniform3fv(gl.getUniformLocation(p,'uDirection'),direction);if(scale!=null)gl.uniform1f(gl.getUniformLocation(p,'uAngularScale'),scale);if(emissive!=null)gl.uniform1f(gl.getUniformLocation(p,'uEmissive'),emissive);}
  function draw({cameraFrame,distance,viewportWidth,viewportHeight,visibility,viewScale}={}){let draws=0;const v=clamp(Number(visibility)||0,0,1);if(disposed||status==='FAILED'||v<=0){last=freeze({distance:Number(distance)||0,visibility:v,viewScale:viewScale||'LOCAL',draws});return;}if(status!=='READY'&&prepare()!=='READY')return;try{const aspect=Math.max(1,viewportWidth||1)/Math.max(1,viewportHeight||1);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.disable(gl.STENCIL_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);uniforms(resources.starProgram,cameraFrame,aspect,v);gl.bindVertexArray(resources.starVao);gl.drawArrays(gl.POINTS,0,STAR_COUNT);draws++;uniforms(resources.bodyProgram,cameraFrame,aspect,v,MOON_DIRECTION,.11,0);gl.bindVertexArray(resources.moon.vao);gl.drawArrays(gl.TRIANGLES,0,resources.moon.count);draws++;uniforms(resources.bodyProgram,cameraFrame,aspect,v,SUN_DIRECTION,.16,1);gl.bindVertexArray(resources.sun.vao);gl.drawArrays(gl.TRIANGLES,0,resources.sun.count);draws++;}catch(error){failure=String(error?.message||error);status='FAILED';}finally{gl.bindVertexArray(null);gl.depthMask(true);gl.disable(gl.BLEND);gl.disable(gl.STENCIL_TEST);last=freeze({distance:Number(distance)||0,visibility:v,viewScale:viewScale||'UNKNOWN',draws});}}
  function getEvidence(){return freeze({schema:'AUDRALIA_TABLET_CELESTIAL_LITE_EVIDENCE_v1',status,donors:DONORS,phoneCelestialRuntimeImported:false,lawsRuntimeImported:false,canvasCreated:false,webglContextCreated:false,independentAnimationLoop:false,starCount:STAR_COUNT,sunTriangleCount:SUN_TRIANGLES,moonTriangleCount:MOON_TRIANGLES,totalTriangleCount:SUN_TRIANGLES+MOON_TRIANGLES,textureBytes:0,additionalDrawCallsLastFrame:last.draws,maximumAdditionalDrawCalls:3,distance:last.distance,visibility:last.visibility,viewScale:last.viewScale,sunDirectionSource:'EXISTING_TABLET_TERRAIN_LIGHT',sunDirection:SUN_DIRECTION,moonDirection:MOON_DIRECTION,preparationMode:'LAZY_FIRST_VISIBLE_RENDER',failure});}
  function dispose(){disposed=true;if(!resources)return;for(const x of [resources.starProgram,resources.bodyProgram])gl.deleteProgram(x);for(const x of [resources.starBuffer,resources.sun.buffer,resources.moon.buffer])gl.deleteBuffer(x);for(const x of [resources.starVao,resources.sun.vao,resources.moon.vao])gl.deleteVertexArray(x);resources=null;}
  return freeze({prepare,draw,getEvidence,dispose});
}
export default createAudraliaTabletCelestialLite;
