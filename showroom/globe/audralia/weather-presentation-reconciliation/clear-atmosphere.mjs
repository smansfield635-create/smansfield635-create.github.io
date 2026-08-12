const PLANET_RADIUS=6200;
const PLANET_CENTER=[0,-PLANET_RADIUS,0];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const perspective=(fov,aspect,near,far)=>{const f=1/Math.tan(fov/2),inv=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*inv,-1,0,0,2*far*near*inv,0]);};
const lookAt=(eye,target,up)=>{const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);};
const multiply=(left,right)=>{const output=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)output[c*4+r]=left[r]*right[c*4]+left[4+r]*right[c*4+1]+left[8+r]*right[c*4+2]+left[12+r]*right[c*4+3];return output;};

function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`CLEAR_ATMOSPHERE_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;}
function makeProgram(gl,vs,fs){const program=gl.createProgram();gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`CLEAR_ATMOSPHERE_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);return program;}
function meshVao(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,40,0);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return{vao,count:mesh.indices.length};}

const DEPTH_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
uniform mat4 uVP;
void main(){gl_Position=uVP*vec4(aPosition,1.0);}`;
const DEPTH_FS=`#version 300 es
precision highp float;
out vec4 outColor;
void main(){outColor=vec4(0.0);}`;
const SKY_VS=`#version 300 es
precision highp float;
out vec2 vNdc;
void main(){vec2 p=gl_VertexID==0?vec2(-1.0,-1.0):(gl_VertexID==1?vec2(3.0,-1.0):vec2(-1.0,3.0));vNdc=p;gl_Position=vec4(p,0.0,1.0);}`;
const SKY_FS=`#version 300 es
precision highp float;
in vec2 vNdc;
out vec4 outColor;
uniform sampler2D uDepth;
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uSunDir;
uniform float uAspect;
uniform float uTanHalfFov;
const vec3 CENTER=vec3(0.0,-6200.0,0.0);
const float R=6200.0;
float sstep(float a,float b,float v){float t=clamp((v-a)/(b-a),0.0,1.0);return t*t*(3.0-2.0*t);}
void main(){
  ivec2 px=ivec2(gl_FragCoord.xy);
  if(texelFetch(uDepth,px,0).r<.999999){outColor=vec4(0.0);return;}
  vec3 rd=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  vec3 localUp=normalize(uEye-CENTER);
  vec3 sun=normalize(uSunDir);
  float altitude=max(0.0,length(uEye-CENTER)-R);
  float viewUp=clamp(dot(rd,localUp),-.12,1.0);
  float mu=clamp(viewUp,0.0,1.0);
  float horizon=pow(1.0-mu,2.15);
  float nearHorizon=exp(-pow(mu/.115,2.0));
  float sunHeight=dot(localUp,sun);
  float daylight=sstep(-.20,.16,sunHeight);
  float civilTwilight=(1.0-sstep(-.26,-.02,sunHeight))*sstep(-.32,.08,sunHeight);
  float twilight=exp(-abs(sunHeight)*7.0)*(1.0-daylight*.30);
  float sunAlignment=max(dot(rd,sun),0.0);
  float solarHalo=pow(sunAlignment,10.0);
  float solarCore=pow(sunAlignment,72.0);
  float antiSolar=pow(max(dot(rd,-sun),0.0),4.0);
  float airmass=1.0/(.20+.80*max(mu,.015));

  vec3 dayZenith=vec3(.045,.205,.48);
  vec3 dayMid=vec3(.20,.47,.72);
  vec3 dayHorizon=vec3(.62,.79,.93);
  vec3 nightZenith=vec3(.004,.010,.032);
  vec3 nightMid=vec3(.014,.030,.072);
  vec3 nightHorizon=vec3(.045,.070,.125);
  vec3 dayBase=mix(dayZenith,dayMid,sstep(.18,.72,horizon));
  dayBase=mix(dayBase,dayHorizon,sstep(.62,1.0,horizon));
  vec3 nightBase=mix(nightZenith,nightMid,sstep(.18,.74,horizon));
  nightBase=mix(nightBase,nightHorizon,sstep(.68,1.0,horizon));
  vec3 color=mix(nightBase,dayBase,daylight);

  vec3 horizonScatter=vec3(.44,.64,.82)*nearHorizon*(.08+.12*daylight)*clamp(airmass*.22,0.0,.72);
  vec3 warmTwilight=vec3(.98,.34,.095)*twilight*horizon*(.18+.34*nearHorizon);
  vec3 twilightGold=vec3(1.0,.60,.25)*civilTwilight*solarHalo*horizon*.12;
  vec3 sunHaze=vec3(1.0,.84,.58)*solarHalo*(.018+.085*horizon)*daylight;
  vec3 sunDiskGlow=vec3(1.0,.93,.76)*solarCore*(.016+.035*daylight);
  vec3 antiSolarCool=vec3(.018,.035,.065)*antiSolar*horizon*(.35+.30*(1.0-daylight));
  color+=horizonScatter+warmTwilight+twilightGold+sunHaze+sunDiskGlow-antiSolarCool;

  float surfacePresence=1.0-sstep(380.0,1800.0,altitude);
  float upperPresence=1.0-sstep(1450.0,5400.0,altitude);
  float spaceMix=sstep(1200.0,5200.0,altitude);
  color=mix(color,color*vec3(.42,.52,.70),spaceMix*.34);
  float upperLimb=upperPresence*horizon*(.09+.38*(1.0-sstep(1700.0,4300.0,altitude)));
  float alpha=clamp(surfacePresence*.988+(1.0-surfacePresence)*upperLimb,0.0,.988);
  if(alpha<.002){outColor=vec4(0.0);return;}
  outColor=vec4(max(color,vec3(0.0)),alpha);
}`;

export function createClearAtmosphereLayer({renderer,worldCanvas,getSunDirection}={}){
  if(!renderer||!(worldCanvas instanceof HTMLCanvasElement))throw new Error('CLEAR_ATMOSPHERE_INPUT_INVALID');
  const parent=worldCanvas.parentElement;if(!(parent instanceof HTMLElement))throw new Error('CLEAR_ATMOSPHERE_PARENT_MISSING');
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  const overlay=document.createElement('canvas');overlay.dataset.audraliaClearAtmosphere='true';overlay.setAttribute('aria-hidden','true');Object.assign(overlay.style,{position:'absolute',pointerEvents:'none',zIndex:'1',background:'transparent'});parent.appendChild(overlay);
  const gl=overlay.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('CLEAR_ATMOSPHERE_WEBGL2_UNAVAILABLE');
  const depthProgram=makeProgram(gl,DEPTH_VS,DEPTH_FS),skyProgram=makeProgram(gl,SKY_VS,SKY_FS),planet=meshVao(gl,renderer.planetMesh),gratitude=meshVao(gl,renderer.gratitudeMesh);
  const framebuffer=gl.createFramebuffer(),depthTexture=gl.createTexture(),colorTexture=gl.createTexture();let width=0,height=0;
  function allocate(w,h){if(w===width&&h===height)return;width=w;height=h;gl.bindTexture(gl.TEXTURE_2D,depthTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,w,h,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);gl.bindTexture(gl.TEXTURE_2D,colorTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,depthTexture,0);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,colorTexture,0);const status=gl.checkFramebufferStatus(gl.FRAMEBUFFER);gl.bindFramebuffer(gl.FRAMEBUFFER,null);if(status!==gl.FRAMEBUFFER_COMPLETE)throw new Error(`CLEAR_ATMOSPHERE_FRAMEBUFFER_INCOMPLETE:${status}`);}
  function resize(){const rect=worldCanvas.getBoundingClientRect(),parentRect=parent.getBoundingClientRect();overlay.style.left=`${rect.left-parentRect.left}px`;overlay.style.top=`${rect.top-parentRect.top}px`;overlay.style.width=`${rect.width}px`;overlay.style.height=`${rect.height}px`;const dpr=Math.min(1.15,window.devicePixelRatio||1),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(overlay.width!==w||overlay.height!==h){overlay.width=w;overlay.height=h;allocate(w,h);}gl.viewport(0,0,w,h);}
  function renderDepth(vp){gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.viewport(0,0,width,height);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.colorMask(false,false,false,false);gl.useProgram(depthProgram);gl.uniformMatrix4fv(gl.getUniformLocation(depthProgram,'uVP'),false,vp);gl.bindVertexArray(planet.vao);gl.drawElements(gl.TRIANGLES,planet.count,gl.UNSIGNED_INT,0);gl.bindVertexArray(gratitude.vao);gl.drawElements(gl.TRIANGLES,gratitude.count,gl.UNSIGNED_INT,0);gl.colorMask(true,true,true,true);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
  function render(camera){resize();const aspect=overlay.width/Math.max(1,overlay.height),vp=multiply(perspective(55*Math.PI/180,aspect,2,PLANET_RADIUS*4.5),lookAt(camera.eye,camera.target,camera.up));renderDepth(vp);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(skyProgram);const U=name=>gl.getUniformLocation(skyProgram,name);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,depthTexture);gl.uniform1i(U('uDepth'),0);gl.uniform3fv(U('uEye'),camera.eye);gl.uniform3fv(U('uForward'),camera.forward);gl.uniform3fv(U('uRight'),camera.right);gl.uniform3fv(U('uUp'),camera.up);gl.uniform3fv(U('uSunDir'),typeof getSunDirection==='function'?getSunDirection():[.42,.78,.46]);gl.uniform1f(U('uAspect'),aspect);gl.uniform1f(U('uTanHalfFov'),Math.tan(55*Math.PI/360));gl.drawArrays(gl.TRIANGLES,0,3);overlay.dataset.cameraAltitude=(Math.max(0,Math.hypot(...sub(camera.eye,PLANET_CENTER))-PLANET_RADIUS)).toFixed(2);}
  return Object.freeze({overlay,render,destroy:()=>overlay.remove(),getEvidence:()=>Object.freeze({schema:'AUDRALIA_CLEAR_ATMOSPHERE_PROJECTION_v1',terrainDepthAware:true,nearTerrainVeil:false,surfaceSky:true,progressiveSpaceTransition:true,celestialMechanicsRedefined:false})});
}
