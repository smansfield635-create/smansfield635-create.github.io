const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode=document.querySelector('[data-h-earth-status]');
const diagnosticNode=document.querySelector('[data-h-earth-diagnostic]');
const focusButton=document.querySelector('[data-fit-world]');
const brandNode=document.querySelector('.preview-brand');

const OP='H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const COH='H_EARTH_V2_COASTAL_INTEGRATION_AND_POSITIONAL_IDENTITY_CLOSURE';
const ATMOSPHERE_BASE_HEAD='91a2b3b8ffbe1d14605f19ffefd68f4dee161597';
const EVOLVING_CLOUD_STATE_MERGE='45d8a7d3b642d99a4377110f63bca15d14c8b900';
const PLANETARY_REFERENCE_FRAME_MERGE='def62786f469a5a9d0027898810d4878642dbf32';
const CLOUD_VISUAL_REFERENCE_HEAD='69da15a26811ddfc11b8c41c4707894e9248a90c';
const setStatus=(text,state=text)=>{if(statusNode){statusNode.textContent=text;statusNode.dataset.status=state;}};
const setDiagnostic=text=>{if(diagnosticNode)diagnosticNode.textContent=text;};
const fail=(stage,error)=>{const message=error instanceof Error?error.message:String(error);console.error(`AUDRALIA_OW01_${stage}_FAILED`,error);setStatus('ERROR',`${stage}_FAILED`);setDiagnostic(`${stage}_FAILED: ${message}`);window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW_ERROR__=Object.freeze({operationId:OP,coherenceOperation:COH,stage,message});};

function updateScaleUI(renderer){
  const scale=renderer.getViewScale();
  if(brandNode)brandNode.textContent=`Audralia · Gratitude · OW01 · ${scale.toLowerCase()}`;
  if(focusButton)focusButton.textContent=scale==='LOCAL'?'reset view':'focus Gratitude';
  const descriptions={
    LOCAL:'LOCAL · protected volumetric cloud interiors remain full-quality when settled · tablet/mobile interaction now uses an adaptive cloud budget without changing terrain, water, opacity or gesture authority.',
    REGION:'REGION · continuous world-anchored cloud support and the eight organized weather authorities are preserved · cloud rendering now decouples from raw pointer-event frequency.',
    CONTINENT:'CONTINENT · full visual cloud quality returns automatically after interaction settles · larger screens receive a bounded cloud-pixel budget instead of an unbounded fragment-cost increase.',
    PLANETARY:'PLANETARY · protected global cloud distribution preserved · adaptive interaction quality and bounded render pixels reduce tablet load while settled planetary weather retains the 36-step reference pass.'
  };
  setDiagnostic(descriptions[scale]||descriptions.LOCAL);
}

function createAtmosphereLayer(renderer){
  const PLANET_RADIUS=6200;
  const PLANET_CENTER=[0,-PLANET_RADIUS,0];
  const SHELL_HEIGHT=120;
  const SHELL_RADIUS=PLANET_RADIUS+SHELL_HEIGHT;
  const SUN=[.42,.78,.46];
  const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
  const add=(a,b)=>a.map((v,i)=>v+b[i]);
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const scale=(a,s)=>a.map(v=>v*s);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
  const overlay=document.createElement('canvas');
  overlay.setAttribute('aria-hidden','true');
  overlay.dataset.hEarthAtmosphere='true';
  const parent=canvas.parentElement;
  if(!(parent instanceof HTMLElement))throw Error('H_EARTH_ATMOSPHERE_PARENT_MISSING');
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  Object.assign(overlay.style,{position:'absolute',pointerEvents:'none',zIndex:'3',background:'transparent'});
  parent.appendChild(overlay);
  const gl=overlay.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'high-performance'});
  if(!gl)throw Error('H_EARTH_ATMOSPHERE_WEBGL2_UNAVAILABLE');

  const VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;\nlayout(location=1) in vec3 aNormal;\nuniform mat4 uVP;\nout vec3 vPos;\nout vec3 vNormal;\nvoid main(){vPos=aPosition;vNormal=aNormal;gl_Position=uVP*vec4(aPosition,1.0);}`;
  const FS=`#version 300 es\nprecision highp float;\nin vec3 vPos;\nin vec3 vNormal;\nuniform vec3 uEye;\nuniform vec3 uSunDir;\nuniform float uOpacity;\nout vec4 outColor;\nvoid main(){vec3 n=normalize(vNormal);vec3 viewDir=normalize(uEye-vPos);vec3 sun=normalize(uSunDir);float facing=abs(dot(n,viewDir));float tangent=1.0-clamp(facing,0.0,1.0);float limb=pow(tangent,5.4);float daylight=.38+.62*clamp(dot(n,sun)*.5+.5,0.0,1.0);float mie=pow(max(dot(sun,-viewDir),0.0),20.0);vec3 rayleigh=vec3(.26,.66,1.0);vec3 horizon=vec3(.70,.90,1.0);float glow=clamp(limb*1.28+mie*.12,0.0,1.0);vec3 c=mix(rayleigh,horizon,glow)*(.82+.18*daylight);float a=uOpacity*clamp(limb*.24+mie*.018,0.0,.18);outColor=vec4(c,a);}`;
  const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(`ATMOSPHERE_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;};
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,VS));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(`ATMOSPHERE_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);

  const lon=128,lat=80,vertices=[],indices=[],at=(r,c)=>r*(lon+1)+c;
  for(let r=0;r<=lat;r++){
    const latitude=-Math.PI/2+r/lat*Math.PI,cosLat=Math.cos(latitude),sinLat=Math.sin(latitude);
    for(let c=0;c<=lon;c++){
      const longitude=-Math.PI+c/lon*Math.PI*2,n=norm([cosLat*Math.cos(longitude),sinLat,cosLat*Math.sin(longitude)]);
      vertices.push(PLANET_CENTER[0]+n[0]*SHELL_RADIUS,PLANET_CENTER[1]+n[1]*SHELL_RADIUS,PLANET_CENTER[2]+n[2]*SHELL_RADIUS,...n);
    }
  }
  for(let r=0;r<lat;r++)for(let c=0;c<lon;c++){const a=at(r,c),b=at(r,c+1),d=at(r+1,c),e=at(r+1,c+1);indices.push(a,d,b,b,d,e);}
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
  const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),gl.STATIC_DRAW);

  const perspective=(fov,aspect,near,far)=>{const f=1/Math.tan(fov/2),inv=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*inv,-1,0,0,2*far*near*inv,0]);};
  const lookAt=(eye,target,up)=>{const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);};
  const multiply=(left,right)=>{const output=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)output[c*4+r]=left[r]*right[c*4]+left[4+r]*right[c*4+1]+left[8+r]*right[c*4+2]+left[12+r]*right[c*4+3];return output;};
  const tangentDirection=(u,v)=>{const radius=Math.hypot(u,v);if(radius<1e-9)return[0,1,0];const angle=radius/PLANET_RADIUS,sine=Math.sin(angle),cosine=Math.cos(angle);return norm([sine*u/radius,cosine,sine*v/radius]);};
  const surfacePosition=(direction,elevation=0)=>[PLANET_CENTER[0]+direction[0]*(PLANET_RADIUS+elevation),PLANET_CENTER[1]+direction[1]*(PLANET_RADIUS+elevation),PLANET_CENTER[2]+direction[2]*(PLANET_RADIUS+elevation)];
  const tangentPosition=(u,v)=>surfacePosition(tangentDirection(u,v),0);
  const cameraFrame=snapshot=>{
    const pitch=clamp(snapshot.pitch,.46,1.49),distance=clamp(snapshot.distance,95,5600),yaw=snapshot.yaw,targetU=snapshot.targetU,targetV=snapshot.targetV,direction=tangentDirection(targetU,targetV),target=surfacePosition(direction,0),pU1=tangentPosition(targetU+1,targetV),pU0=tangentPosition(targetU-1,targetV),pV1=tangentPosition(targetU,targetV+1),pV0=tangentPosition(targetU,targetV-1),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(yaw)),scale(eV,Math.cos(yaw)))),eye=add(add(target,scale(direction,distance*Math.sin(pitch)+18)),scale(horizontal,distance*Math.cos(pitch)));return{eye,target,up:direction};
  };
  const resize=()=>{
    const rect=canvas.getBoundingClientRect(),parentRect=parent.getBoundingClientRect();
    overlay.style.left=`${rect.left-parentRect.left}px`;overlay.style.top=`${rect.top-parentRect.top}px`;overlay.style.width=`${rect.width}px`;overlay.style.height=`${rect.height}px`;
    const dpr=Math.min(1.35,window.devicePixelRatio||1),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(overlay.width!==w||overlay.height!==h){overlay.width=w;overlay.height=h;}gl.viewport(0,0,w,h);
  };
  const render=()=>{
    resize();const snapshot=renderer.getSnapshot(),cam=cameraFrame(snapshot),altitude=Math.max(0,Math.hypot(...sub(cam.eye,PLANET_CENTER))-PLANET_RADIUS),entry=smooth(700,2600,altitude),distant=1-smooth(5200,7600,altitude),opacity=.74*entry*distant;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(opacity<=.002)return;
    const vp=multiply(perspective(55*Math.PI/180,overlay.width/overlay.height,2,PLANET_RADIUS*4.5),lookAt(cam.eye,cam.target,cam.up));
    gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.CULL_FACE);gl.cullFace(altitude<SHELL_HEIGHT?gl.FRONT:gl.BACK);
    gl.useProgram(program);gl.uniformMatrix4fv(gl.getUniformLocation(program,'uVP'),false,vp);gl.uniform3fv(gl.getUniformLocation(program,'uEye'),cam.eye);gl.uniform3fv(gl.getUniformLocation(program,'uSunDir'),SUN);gl.uniform1f(gl.getUniformLocation(program,'uOpacity'),opacity);gl.bindVertexArray(vao);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_INT,0);
    gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.depthMask(true);
    overlay.dataset.altitude=altitude.toFixed(2);overlay.dataset.opacity=opacity.toFixed(4);
  };
  const evidence=Object.freeze({schema:'H_EARTH_OW01_ATMOSPHERE_PRESENTATION_CHECKPOINT_v2',protectedBaseHead:ATMOSPHERE_BASE_HEAD,planetCentered:true,cameraCentered:false,geographicAuthority:false,shellHeightAuthoringUnits:SHELL_HEIGHT,analyticScattering:true,limbConcentrationExponent:5.4,broadShellDarkeningRemoved:true,descentFade:true,cloudSystemConstructed:false,separatePresentationCanvas:true,rendererMutation:false});
  return Object.freeze({overlay,render,getEvidence:()=>evidence,destroy:()=>overlay.remove()});
}

function createCloudLayer(renderer){
  const PLANET_RADIUS=6200;
  const PLANET_CENTER=[0,-PLANET_RADIUS,0];
  const SUN=[.42,.78,.46];
  const NORTH=[0,.5,-.8660254037844386];
  const MERIDIAN=[0,.8660254037844386,.5];
  const EAST=[1,0,0];
  const BASE_CLEARANCE=30;
  const KM_TO_AUTHORING=4.2;
  const CLOUD_OUTER_ALTITUDE=108;
  const PLANET_OCCLUSION_ALTITUDE=27;
  const TIME_SCALE=24;
  const LIFECYCLE_PRESENCE_FLOOR=.38;
  const REST_RAY_STEPS=36;
  const INTERACTION_RAY_STEPS=18;
  const REST_MAX_PIXELS=175000;
  const INTERACTION_MAX_PIXELS=70000;
  const REST_FRAME_INTERVAL_MS=240;
  const INTERACTION_FRAME_INTERVAL_MS=135;
  const INTERACTION_SYSTEM_LIMIT=5;
  const INTERACTION_SETTLE_MS=110;
  const EPOCH_MS=Date.parse('2026-08-08T03:26:20.000Z');
  const GENUS=Object.freeze({Ci:0,Cc:1,Cs:2,Ac:3,As:4,Ns:5,Sc:6,St:7,Cu:8,Cb:9});
  const SYSTEMS=Object.freeze([
    Object.freeze({id:'SC_SUBTROPICAL_GRATITUDE',seed:.17,genus:'Sc',lat:30.0,lon:-12.0,base:0.8,top:2.3,major:1450,minor:820,orientation:-18,windE:35,windN:5,shearE:2.0,shearN:-1.0,density:.62,ice:.03,precip:.14,support:.76,phase:.36,lifetime:320}),
    Object.freeze({id:'CU_SUBTROPICAL_EAST',seed:.31,genus:'Cu',lat:23.0,lon:34.0,base:1.1,top:4.6,major:1200,minor:690,orientation:12,windE:28,windN:8,shearE:3.0,shearN:1.0,density:.76,ice:.05,precip:.22,support:.84,phase:.28,lifetime:250}),
    Object.freeze({id:'CB_TROPICAL_EAST',seed:.47,genus:'Cb',lat:9.0,lon:72.0,base:1.0,top:15.5,major:1320,minor:760,orientation:24,windE:20,windN:10,shearE:6.5,shearN:2.0,density:.90,ice:.58,precip:.92,support:.92,phase:.45,lifetime:280}),
    Object.freeze({id:'NS_EQUATORIAL_WEST',seed:.07,genus:'Ns',lat:-3.0,lon:-58.0,base:1.8,top:8.8,major:1580,minor:920,orientation:6,windE:16,windN:3,shearE:2.5,shearN:1.0,density:.64,ice:.28,precip:.78,support:.80,phase:.33,lifetime:410}),
    Object.freeze({id:'AC_NORTH_MIDLAT',seed:.59,genus:'Ac',lat:43.0,lon:82.0,base:3.5,top:6.8,major:2050,minor:820,orientation:-8,windE:58,windN:2,shearE:4.0,shearN:-2.0,density:.56,ice:.20,precip:.12,support:.72,phase:.52,lifetime:360}),
    Object.freeze({id:'CS_NORTH_JET',seed:.71,genus:'Cs',lat:57.0,lon:-88.0,base:7.5,top:12.5,major:3100,minor:980,orientation:15,windE:85,windN:1,shearE:7.0,shearN:1.0,density:.38,ice:.92,precip:.03,support:.74,phase:.50,lifetime:520}),
    Object.freeze({id:'CI_SOUTH_JET',seed:.83,genus:'Ci',lat:-42.0,lon:48.0,base:9.0,top:15.8,major:3250,minor:920,orientation:29,windE:82,windN:-3,shearE:9.0,shearN:2.0,density:.34,ice:.98,precip:.01,support:.76,phase:.60,lifetime:560}),
    Object.freeze({id:'AS_SOUTH_STORM',seed:.93,genus:'As',lat:-31.0,lon:-108.0,base:2.5,top:7.8,major:2650,minor:1120,orientation:-14,windE:48,windN:4,shearE:3.0,shearN:0.0,density:.48,ice:.32,precip:.32,support:.72,phase:.42,lifetime:430})
  ]);
  const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
  const add=(a,b)=>a.map((v,i)=>v+b[i]);
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const scale=(a,s)=>a.map(v=>v*s);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
  const wrapLon=lon=>((lon+180)%360+360)%360-180;
  const degToRad=deg=>deg*Math.PI/180;
  const radToDeg=rad=>rad*180/Math.PI;
  const overlay=document.createElement('canvas');
  overlay.setAttribute('aria-hidden','true');
  overlay.dataset.hEarthClouds='true';
  const parent=canvas.parentElement;
  if(!(parent instanceof HTMLElement))throw Error('H_EARTH_CLOUD_PARENT_MISSING');
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  Object.assign(overlay.style,{position:'absolute',pointerEvents:'none',zIndex:'2',background:'transparent',imageRendering:'auto'});
  parent.appendChild(overlay);
  const gl=overlay.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'high-performance'});
  if(!gl)throw Error('H_EARTH_CLOUD_WEBGL2_UNAVAILABLE');

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
in vec2 vNdc;
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uSunDir;
uniform float uAspect;
uniform float uTanHalfFov;
uniform float uTimeHours;
uniform int uSystemCount;
uniform int uStepCount;
uniform float uFullDetail;
uniform vec4 uSysA[8];
uniform vec4 uSysB[8];
uniform vec4 uSysC[8];
uniform vec4 uSysD[8];
out vec4 outColor;
const float PI=3.141592653589793;
const float R=6200.0;
const float OUTER=6308.0;
const float OCCLUDER=6227.0;
const vec3 CENTER=vec3(0.0,-6200.0,0.0);
const vec3 NORTH=vec3(0.0,0.5,-0.8660254037844386);
const vec3 MERIDIAN=vec3(0.0,0.8660254037844386,0.5);
const vec3 EAST=vec3(1.0,0.0,0.0);

float hash31(vec3 p){
  p=fract(p*.1031);
  p+=dot(p,p.yzx+33.33);
  return fract((p.x+p.y)*p.z);
}
float noise3(vec3 p){
  vec3 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  float n000=hash31(i+vec3(0.0,0.0,0.0));
  float n100=hash31(i+vec3(1.0,0.0,0.0));
  float n010=hash31(i+vec3(0.0,1.0,0.0));
  float n110=hash31(i+vec3(1.0,1.0,0.0));
  float n001=hash31(i+vec3(0.0,0.0,1.0));
  float n101=hash31(i+vec3(1.0,0.0,1.0));
  float n011=hash31(i+vec3(0.0,1.0,1.0));
  float n111=hash31(i+vec3(1.0,1.0,1.0));
  return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y),mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y),f.z);
}
float fbm(vec3 p){
  float v=.0,a=.62;
  v+=noise3(p)*a;
  p=p*2.07+vec3(5.3,1.7,9.2);a*=.48;
  v+=noise3(p)*a;
  return v;
}
float wrapPi(float a){return atan(sin(a),cos(a));}
vec2 raySphere(vec3 ro,vec3 rd,float radius){
  vec3 o=ro-CENTER;
  float b=dot(o,rd),c=dot(o,o)-radius*radius,h=b*b-c;
  if(h<0.0)return vec2(1e20,-1e20);
  h=sqrt(h);
  return vec2(-b-h,-b+h);
}
float verticalEnvelope(float z){
  return smoothstep(0.0,.09,z)*(1.0-smoothstep(.80,1.0,z));
}
float morphology(float g,vec2 xy,float z,float seed,float time,float fieldScale){
  float r=length(xy);
  float edge=1.0-smoothstep(.74,1.10,r);
  float detailScale=clamp(fieldScale,1.0,9.0);
  vec2 q=xy*detailScale;
  float n=fbm(vec3(q*2.15,z*3.2)+vec3(seed*19.0,time*.018,-time*.012));
  float v=verticalEnvelope(z);
  if(g<.5){
    float filament=.5+.5*sin(q.x*5.4+q.y*1.8+n*4.0+time*.035+seed*11.0);
    return edge*v*smoothstep(.50,.77,n+.24*filament)*.48;
  }else if(g<1.5){
    float cells=.5+.5*sin(q.x*4.2+seed*9.0)*cos(q.y*3.8-time*.018);
    return edge*v*smoothstep(.49,.72,n+.27*cells)*.55;
  }else if(g<2.5){
    float veil=.5+.5*sin(q.x*1.7+q.y*.8+seed*7.0);
    return edge*v*smoothstep(.38,.66,n+.13*veil)*.42;
  }else if(g<3.5){
    float cells=.5+.5*sin(q.x*3.7+n*3.0)*cos(q.y*3.9-time*.014);
    return edge*v*smoothstep(.46,.70,n+.26*cells)*.62;
  }else if(g<4.5){
    float bands=.5+.5*sin(q.x*1.25+q.y*.52+seed*6.0);
    return edge*v*smoothstep(.37,.64,n+.12*bands)*.66;
  }else if(g<5.5){
    float rainBands=.5+.5*sin(q.x*1.5-q.y*.7+seed*8.0);
    return edge*v*smoothstep(.35,.61,n+.14*rainBands)*.95;
  }else if(g<6.5){
    float broken=.5+.5*sin(q.x*3.0+n*3.0)*cos(q.y*3.25+seed*8.0);
    return edge*v*smoothstep(.46,.69,n+.24*broken)*.72;
  }else if(g<7.5){
    float sheets=.5+.5*sin(q.x*1.45+q.y*.55+seed*5.0);
    return edge*v*smoothstep(.40,.65,n+.10*sheets)*.56;
  }else if(g<8.5){
    float taper=mix(.98,.46,smoothstep(.08,.95,z));
    float clusters=.5+.5*sin(q.x*2.8+seed*9.0)*cos(q.y*2.5-time*.014);
    float tower=(1.0-smoothstep(taper*.68,taper*1.08,r))*smoothstep(.48,.68,n+.25*clusters);
    float puffs=.72+.28*sin(z*19.0+n*5.0+seed*12.0);
    return tower*v*puffs*.92;
  }else{
    float taper=mix(.82,.38,smoothstep(.05,.70,z));
    float clusters=.5+.5*sin(q.x*2.45+seed*7.0)*cos(q.y*2.2-time*.012);
    float breakup=smoothstep(.43,.64,n+.22*clusters);
    float tower=(1.0-smoothstep(taper*.65,taper*1.08,r))*v*breakup;
    float anvilBand=smoothstep(.66,.78,z)*(1.0-smoothstep(.94,1.0,z));
    float anvil=(1.0-smoothstep(.52,1.30,r))*anvilBand*smoothstep(.38,.61,n+.15*clusters)*.82;
    return max(tower,anvil);
  }
}
float climateBand(float lat,float center,float halfWidth){
  return 1.0-smoothstep(halfWidth*.58,halfWidth,abs(lat-center));
}
float globalCloudSupport(vec3 radial,float h,float lat,float lon){
  float t=uTimeHours*.0065;
  float equatorCenter=.045*sin(lon*2.0+t)+.018*sin(lon*5.0-t*.7);
  float equator=climateBand(lat,equatorCenter,.23);
  float subtropical=climateBand(lat,.43+.026*sin(lon*1.5-t*.45),.18)+climateBand(lat,-.43+.024*sin(lon*1.7+t*.38),.18);
  float midlatitude=climateBand(lat,.76+.042*sin(lon*2.1+t*.24),.22)+climateBand(lat,-.75+.040*sin(lon*2.0-t*.22),.22);
  float highlatitude=climateBand(lat,1.05+.028*sin(lon*2.7+t*.18),.24)+climateBand(lat,-1.04+.026*sin(lon*2.5-t*.17),.24);
  float low=smoothstep(30.0,35.0,h)*(1.0-smoothstep(54.0,65.0,h));
  float middle=smoothstep(44.0,51.0,h)*(1.0-smoothstep(75.0,86.0,h));
  float high=smoothstep(67.0,76.0,h)*(1.0-smoothstep(99.0,108.0,h));
  vec3 advect=radial*8.2+vec3(t*.72,-t*.21,t*.36);
  float broad=fbm(advect);
  float detail=broad;
  if(uFullDetail>.5)detail=fbm(radial*18.0+vec3(-t*.34,t*.19,t*.51));
  float longitudinal=.5+.5*sin(lon*3.2+sin(lat*5.1)*1.25+t*.46);
  float broken=smoothstep(.50,.70,broad*.72+detail*.28+.075*longitudinal);
  float clearWave=.5+.5*sin(lon*1.12-lat*2.35+t*.20);
  float clearSlot=.64+.36*(1.0-smoothstep(.72,.93,clearWave));
  float climate=equator*(low*.58+middle*.34)+subtropical*low*.42+midlatitude*(middle*.60+high*.18)+highlatitude*high*.28;
  return clamp(climate*broken*clearSlot*.38,0.0,.34);
}
vec3 densityAt(vec3 p){
  vec3 q=p-CENTER;
  float rr=length(q);
  if(rr<=0.0)return vec3(0.0);
  float h=rr-R;
  vec3 radial=q/rr;
  float lat=asin(clamp(dot(radial,NORTH),-1.0,1.0));
  float lon=atan(dot(radial,EAST),dot(radial,MERIDIAN));
  float background=globalCloudSupport(radial,h,lat,lon);
  float backgroundIce=background*smoothstep(66.0,96.0,h)*.78;
  float backgroundPrecip=background*(1.0-smoothstep(58.0,82.0,h))*.10;
  float mass=background,iceMass=backgroundIce,precipMass=backgroundPrecip;
  for(int i=0;i<8;i++){
    if(i>=uSystemCount)break;
    vec4 a=uSysA[i],b=uSysB[i],c=uSysC[i],d=uSysD[i];
    if(h<a.z||h>a.w)continue;
    float z=(h-a.z)/max(a.w-a.z,.001);
    float dlon=wrapPi(lon-a.y);
    float dx=dlon*cos(a.x)*R;
    float dy=(lat-a.x)*R;
    dx-=d.x*(z-.5);
    dy-=d.y*(z-.5);
    float co=cos(b.z),si=sin(b.z);
    vec2 local=vec2(co*dx+si*dy,-si*dx+co*dy);
    vec2 xy=vec2(local.x/max(b.x,1.0),local.y/max(b.y,1.0));
    if(length(xy)>1.38)continue;
    float fieldScale=clamp(sqrt(max(b.x*b.y,1.0))/240.0,1.0,9.0);
    float shape=morphology(b.w,xy,z,c.y,uTimeHours,fieldScale);
    float den=shape*c.x;
    mass+=den;
    iceMass+=den*c.z;
    precipMass+=den*c.w;
  }
  if(mass<=.0001)return vec3(0.0);
  return vec3(min(mass,1.6),clamp(iceMass/mass,0.0,1.0),clamp(precipMass/mass,0.0,1.0));
}
void main(){
  vec3 rd=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  vec2 outerHit=raySphere(uEye,rd,OUTER);
  float t0=max(0.0,outerHit.x),t1=outerHit.y;
  if(t1<=t0){outColor=vec4(0.0);return;}
  vec2 planetHit=raySphere(uEye,rd,OCCLUDER);
  if(planetHit.x>0.0)t1=min(t1,planetHit.x);
  if(t1<=t0){outColor=vec4(0.0);return;}
  float stepCount=max(float(uStepCount),1.0);
  float stepLen=(t1-t0)/stepCount;
  float jitter=hash31(vec3(gl_FragCoord.xy,uTimeHours*.01));
  float t=t0+stepLen*jitter;
  vec3 premul=vec3(0.0);
  float alpha=0.0;
  vec3 sun=normalize(uSunDir);
  for(int s=0;s<36;s++){
    if(s>=uStepCount||t>t1||alpha>.965)break;
    vec3 p=uEye+rd*t;
    vec3 cloudSample=densityAt(p);
    float den=cloudSample.x;
    if(den>.003){
      vec3 radial=normalize(p-CENTER);
      float daylight=.42+.58*clamp(dot(radial,sun)*.5+.5,0.0,1.0);
      float forward=pow(max(dot(rd,sun),0.0),7.0);
      float core=clamp(den*.62+cloudSample.z*.18,0.0,.72);
      vec3 bright=mix(vec3(.82,.86,.90),vec3(1.03,1.01,.96),daylight);
      vec3 dark=vec3(.40,.43,.48);
      vec3 col=mix(bright,dark,core);
      col=mix(col,vec3(.84,.90,.98),cloudSample.y*.10);
      col+=vec3(1.0,.94,.82)*forward*.08;
      float a=1.0-exp(-den*stepLen*.021);
      premul+=(1.0-alpha)*col*a;
      alpha+=(1.0-alpha)*a;
    }
    t+=stepLen;
  }
  if(alpha<.003){outColor=vec4(0.0);return;}
  outColor=vec4(premul/max(alpha,.0001),clamp(alpha,0.0,.94));
}`;
  const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(`CLOUD_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;};
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,VS));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(`CLOUD_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);

  const tangentDirection=(u,v)=>{const radius=Math.hypot(u,v);if(radius<1e-9)return[0,1,0];const angle=radius/PLANET_RADIUS,sine=Math.sin(angle),cosine=Math.cos(angle);return norm([sine*u/radius,cosine,sine*v/radius]);};
  const surfacePosition=(direction,elevation=0)=>[PLANET_CENTER[0]+direction[0]*(PLANET_RADIUS+elevation),PLANET_CENTER[1]+direction[1]*(PLANET_RADIUS+elevation),PLANET_CENTER[2]+direction[2]*(PLANET_RADIUS+elevation)];
  const tangentPosition=(u,v)=>surfacePosition(tangentDirection(u,v),0);
  const cameraFrame=snapshot=>{
    const pitch=clamp(snapshot.pitch,.46,1.49),distance=clamp(snapshot.distance,95,5600),yaw=snapshot.yaw,targetU=snapshot.targetU,targetV=snapshot.targetV,direction=tangentDirection(targetU,targetV),target=surfacePosition(direction,0),pU1=tangentPosition(targetU+1,targetV),pU0=tangentPosition(targetU-1,targetV),pV1=tangentPosition(targetU,targetV+1),pV0=tangentPosition(targetU,targetV-1),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(yaw)),scale(eV,Math.cos(yaw)))),eye=add(add(target,scale(direction,distance*Math.sin(pitch)+18)),scale(horizontal,distance*Math.cos(pitch))),forward=norm(sub(target,eye)),right=norm(cross(forward,direction)),up=norm(cross(right,forward));return{eye,target,up,right,forward};
  };
  const directionFromLatLon=(latDeg,lonDeg)=>{
    const lat=degToRad(latDeg),lon=degToRad(lonDeg),cosLat=Math.cos(lat);
    return norm(add(scale(NORTH,Math.sin(lat)),add(scale(MERIDIAN,cosLat*Math.cos(lon)),scale(EAST,cosLat*Math.sin(lon)))));
  };
  const lifecycleEnvelope=progress=>{
    if(progress<.12)return smooth(0,.12,progress);
    if(progress<.62)return 1;
    if(progress<.90)return 1-.72*smooth(.62,.90,progress);
    return .28*(1-smooth(.90,1,progress));
  };
  const evolveSystems=timeHours=>SYSTEMS.map(system=>{
    const phase=((system.phase+timeHours/system.lifetime)%1+1)%1;
    const life=LIFECYCLE_PRESENCE_FLOOR+(1-LIFECYCLE_PRESENCE_FLOOR)*lifecycleEnvelope(phase);
    const lat0=degToRad(system.lat);
    const windE=system.windE+5*Math.sin(timeHours*.035+system.seed*17);
    const windN=system.windN+2.5*Math.cos(timeHours*.029+system.seed*11);
    const lat=clamp(system.lat+radToDeg(windN*timeHours/PLANET_RADIUS),-89,89);
    const lon=wrapLon(system.lon+radToDeg(windE*timeHours/(PLANET_RADIUS*Math.max(Math.cos(lat0),.15))));
    const support=clamp(system.support+.10*Math.sin(timeHours*.043+system.seed*21+degToRad(lat+lon)),.30,1);
    const baseAuth=BASE_CLEARANCE+system.base*KM_TO_AUTHORING;
    const topKm=system.base+(system.top-system.base)*(.82+.18*support);
    const topAuth=BASE_CLEARANCE+topKm*KM_TO_AUTHORING;
    const size=(.90+.12*life)*(.94+.10*support);
    const density=system.density*life*(.86+.18*support);
    const verticalSpan=Math.max(.1,topKm-system.base);
    return {
      ...system,lat,lon,baseAuth,topAuth,
      major:system.major*size,minor:system.minor*size,
      density,
      shearShiftE:system.shearE*verticalSpan*1.45,
      shearShiftN:system.shearN*verticalSpan*1.45
    };
  });
  const selectSystems=(systems,cam,interactive)=>{
    if(!interactive)return systems;
    const eyeRadial=norm(sub(cam.eye,PLANET_CENTER));
    return systems.map(system=>({system,score:dot(directionFromLatLon(system.lat,system.lon),eyeRadial)}))
      .filter(entry=>entry.score>-.45)
      .sort((a,b)=>b.score-a.score)
      .slice(0,INTERACTION_SYSTEM_LIMIT)
      .map(entry=>entry.system);
  };
  const uniform=(name)=>gl.getUniformLocation(program,name);
  const U=Object.freeze({
    eye:uniform('uEye'),forward:uniform('uForward'),right:uniform('uRight'),up:uniform('uUp'),sun:uniform('uSunDir'),
    aspect:uniform('uAspect'),tanHalfFov:uniform('uTanHalfFov'),time:uniform('uTimeHours'),count:uniform('uSystemCount'),steps:uniform('uStepCount'),fullDetail:uniform('uFullDetail'),
    a:uniform('uSysA[0]'),b:uniform('uSysB[0]'),c:uniform('uSysC[0]'),d:uniform('uSysD[0]')
  });
  const resize=interactive=>{
    const rect=canvas.getBoundingClientRect(),parentRect=parent.getBoundingClientRect();
    overlay.style.left=`${rect.left-parentRect.left}px`;overlay.style.top=`${rect.top-parentRect.top}px`;overlay.style.width=`${rect.width}px`;overlay.style.height=`${rect.height}px`;
    const baseScale=Math.min(.72,Math.max(.50,(window.devicePixelRatio||1)*.22));
    const area=Math.max(1,rect.width*rect.height),maxPixels=interactive?INTERACTION_MAX_PIXELS:REST_MAX_PIXELS,capScale=Math.sqrt(maxPixels/area),qualityScale=interactive?baseScale*.72:baseScale,renderScale=Math.max(.24,Math.min(qualityScale,capScale));
    const w=Math.max(1,Math.round(rect.width*renderScale)),h=Math.max(1,Math.round(rect.height*renderScale));
    if(overlay.width!==w||overlay.height!==h){overlay.width=w;overlay.height=h;}
    gl.viewport(0,0,w,h);
    overlay.dataset.renderScale=renderScale.toFixed(3);overlay.dataset.renderPixels=String(w*h);
  };
  let interactionActive=false,raf=0,lastFrame=0,running=false,settleTimer=0;
  const render=(quality=interactionActive?'interaction':'rest')=>{
    const interactive=quality==='interaction';
    resize(interactive);
    const snapshot=renderer.getSnapshot(),cam=cameraFrame(snapshot),timeHours=Math.max(0,(Date.now()-EPOCH_MS)/3600000*TIME_SCALE),evolved=evolveSystems(timeHours),systems=selectSystems(evolved,cam,interactive);
    const a=new Float32Array(8*4),b=new Float32Array(8*4),c=new Float32Array(8*4),d=new Float32Array(8*4);
    systems.forEach((system,index)=>{
      a.set([degToRad(system.lat),degToRad(system.lon),system.baseAuth,system.topAuth],index*4);
      b.set([system.major,system.minor,degToRad(system.orientation),GENUS[system.genus]],index*4);
      c.set([system.density,system.seed,system.ice,system.precip],index*4);
      d.set([system.shearShiftE,system.shearShiftN,system.support,0],index*4);
    });
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(program);gl.bindVertexArray(vao);
    gl.uniform3fv(U.eye,cam.eye);gl.uniform3fv(U.forward,cam.forward);gl.uniform3fv(U.right,cam.right);gl.uniform3fv(U.up,cam.up);gl.uniform3fv(U.sun,SUN);
    gl.uniform1f(U.aspect,overlay.width/Math.max(1,overlay.height));gl.uniform1f(U.tanHalfFov,Math.tan(55*Math.PI/360));gl.uniform1f(U.time,timeHours);gl.uniform1i(U.count,systems.length);gl.uniform1i(U.steps,interactive?INTERACTION_RAY_STEPS:REST_RAY_STEPS);gl.uniform1f(U.fullDetail,interactive?0:1);
    gl.uniform4fv(U.a,a);gl.uniform4fv(U.b,b);gl.uniform4fv(U.c,c);gl.uniform4fv(U.d,d);
    gl.drawArrays(gl.TRIANGLES,0,3);
    overlay.dataset.timeHours=timeHours.toFixed(3);overlay.dataset.systemCount=String(systems.length);overlay.dataset.quality=interactive?'interaction':'rest';overlay.dataset.raySteps=String(interactive?INTERACTION_RAY_STEPS:REST_RAY_STEPS);
  };
  const scheduleSettledRender=()=>{
    if(settleTimer)clearTimeout(settleTimer);
    settleTimer=setTimeout(()=>{interactionActive=false;render('rest');lastFrame=performance.now();settleTimer=0;},INTERACTION_SETTLE_MS);
  };
  const beginInteraction=()=>{interactionActive=true;if(settleTimer){clearTimeout(settleTimer);settleTimer=0;}};
  const touchInteraction=()=>{interactionActive=true;scheduleSettledRender();};
  const endInteraction=()=>{scheduleSettledRender();};
  const tick=now=>{
    if(!running)return;
    const interval=interactionActive?INTERACTION_FRAME_INTERVAL_MS:REST_FRAME_INTERVAL_MS;
    if(!document.hidden&&now-lastFrame>=interval){lastFrame=now;render(interactionActive?'interaction':'rest');}
    raf=requestAnimationFrame(tick);
  };
  const start=()=>{if(running)return;running=true;lastFrame=0;raf=requestAnimationFrame(tick);};
  const stop=()=>{running=false;if(raf)cancelAnimationFrame(raf);raf=0;if(settleTimer)clearTimeout(settleTimer);settleTimer=0;};
  const evidence=Object.freeze({
    schema:'H_EARTH_OW01_EVOLVING_VOLUMETRIC_CLOUD_PERFORMANCE_CHECKPOINT_v1',
    visualReferenceHead:CLOUD_VISUAL_REFERENCE_HEAD,
    planetaryReferenceFrameMerge:PLANETARY_REFERENCE_FRAME_MERGE,
    evolvingCloudStateMerge:EVOLVING_CLOUD_STATE_MERGE,
    acceptedAtmosphereHead:'8381f3323261b4facf70ec1f236c015b7d5df5a9',
    persistentWorldCoordinates:true,
    gratitudeLatitudeDeg:30,
    gratitudeLongitudeDeg:0,
    cloudSystemCount:SYSTEMS.length,
    generaPresent:Object.freeze([...new Set(SYSTEMS.map(system=>system.genus))]),
    continuousPlanetarySupport:true,
    backgroundSupportWorldAnchored:true,
    backgroundSupportCameraGenerated:false,
    organizedSystemsModulateGlobalSupport:true,
    explicitClearSkySlots:true,
    regionalFieldBodyMultiplication:true,
    lifecyclePresenceFloor:LIFECYCLE_PRESENCE_FLOOR,
    volumetricRayIntegration:true,
    sphericalAlphaCloudShell:false,
    analyticPlanetOcclusion:true,
    continuousEvolution:true,
    defaultVisualTimeScale:TIME_SCALE,
    adaptiveInteractionQuality:true,
    directPointerMoveCloudRender:false,
    restRaySteps:REST_RAY_STEPS,
    interactionRaySteps:INTERACTION_RAY_STEPS,
    restMaxPixels:REST_MAX_PIXELS,
    interactionMaxPixels:INTERACTION_MAX_PIXELS,
    restFrameIntervalMs:REST_FRAME_INTERVAL_MS,
    interactionFrameIntervalMs:INTERACTION_FRAME_INTERVAL_MS,
    interactionSystemLimit:INTERACTION_SYSTEM_LIMIT,
    fullDetailGlobalSupportAtRest:true,
    reducedGlobalSupportDetailDuringInteraction:true,
    authoringAltitudeMapping:Object.freeze({candidateOnly:true,baseClearanceAuthoringUnits:BASE_CLEARANCE,authoringUnitsPerPhysicalKm:KM_TO_AUTHORING,outerCloudAltitudeAuthoringUnits:CLOUD_OUTER_ALTITUDE}),
    rendererMutation:false,
    geographicAuthority:false
  });
  return Object.freeze({overlay,render:()=>render('rest'),start,stop,beginInteraction,touchInteraction,endInteraction,getEvidence:()=>evidence,destroy:()=>{stop();overlay.remove();}});
}

function wire(renderer,atmosphere,clouds){
  const pointers=new Map();
  let gesture=null;
  const safe=value=>Math.max(-64,Math.min(64,value));
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5});
  const vectorLength=vector=>Math.hypot(vector.x,vector.y);
  const orderedPoints=()=>[...pointers.entries()].sort((a,b)=>Number(a[0])-Number(b[0]));
  const beginTwoFingerGesture=()=>{
    const entries=orderedPoints();
    if(entries.length!==2){gesture=null;return;}
    const a={...entries[0][1]},b={...entries[1][1]},mid=midpoint(a,b),dist=Math.max(1,distance(a,b));
    gesture={ids:[entries[0][0],entries[1][0]],startA:a,startB:b,startMid:mid,startDistance:dist,lastMid:mid,lastDistance:dist,mode:'PENDING'};
  };
  const refreshGesture=()=>{if(pointers.size===2)beginTwoFingerGesture();else gesture=null;};
  const afterCameraMutation=()=>{updateScaleUI(renderer);atmosphere.render();clouds.touchInteraction();};
  const afterSettledMutation=()=>{updateScaleUI(renderer);atmosphere.render();clouds.endInteraction();};

  canvas.addEventListener('pointerdown',event=>{
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    clouds.beginInteraction();
    if(pointers.size===2)beginTwoFingerGesture();
    else if(pointers.size>2)gesture=null;
  });

  canvas.addEventListener('pointermove',event=>{
    const previous=pointers.get(event.pointerId);if(!previous)return;
    const next={x:event.clientX,y:event.clientY};pointers.set(event.pointerId,next);
    if(pointers.size===1){renderer.orbit(safe(next.x-previous.x),safe(next.y-previous.y));afterCameraMutation();return;}
    if(pointers.size!==2)return;
    if(!gesture)beginTwoFingerGesture();
    if(!gesture)return;

    const a=pointers.get(gesture.ids[0]),b=pointers.get(gesture.ids[1]);
    if(!a||!b){beginTwoFingerGesture();return;}
    const mid=midpoint(a,b),dist=Math.max(1,distance(a,b));
    const d1={x:a.x-gesture.startA.x,y:a.y-gesture.startA.y};
    const d2={x:b.x-gesture.startB.x,y:b.y-gesture.startB.y};
    const common={x:(d1.x+d2.x)*.5,y:(d1.y+d2.y)*.5};
    const opposing={x:(d1.x-d2.x)*.5,y:(d1.y-d2.y)*.5};
    const commonMagnitude=vectorLength(common),opposingMagnitude=vectorLength(opposing);
    const pinchMagnitude=Math.abs(dist-gesture.startDistance)*.5;
    const zoomEvidence=Math.max(opposingMagnitude,pinchMagnitude);

    if(gesture.mode==='PENDING'){
      if(commonMagnitude>=2.2&&commonMagnitude>zoomEvidence*1.28)gesture.mode='TRAVEL';
      else if(zoomEvidence>=2.0&&zoomEvidence>commonMagnitude*1.20)gesture.mode='ZOOM';
      else return;
      gesture.lastMid=mid;
      gesture.lastDistance=dist;
      return;
    }

    if(gesture.mode==='TRAVEL'){
      const dx=mid.x-gesture.lastMid.x,dy=mid.y-gesture.lastMid.y;
      if(Math.abs(dx)>0.01||Math.abs(dy)>0.01)renderer.panScreen(safe(dx*1.45),safe(dy*1.45));
    }else if(gesture.mode==='ZOOM'){
      const ratio=dist/Math.max(1,gesture.lastDistance);
      if(Math.abs(Math.log(Math.max(.001,ratio)))>=.00035)renderer.zoomByFactor(ratio);
    }
    gesture.lastMid=mid;
    gesture.lastDistance=dist;
    afterCameraMutation();
  });

  const clear=event=>{pointers.delete(event.pointerId);refreshGesture();if(pointers.size===0)clouds.endInteraction();else clouds.beginInteraction();};
  canvas.addEventListener('pointerup',clear);
  canvas.addEventListener('pointercancel',clear);
  canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',event=>{event.preventDefault();clouds.beginInteraction();renderer.zoom(event.deltaY);afterCameraMutation();},{passive:false});
  canvas.addEventListener('dblclick',()=>{renderer.focusGratitude();afterSettledMutation();});
  focusButton?.addEventListener('click',()=>{renderer.focusGratitude();afterSettledMutation();});
  window.addEventListener('resize',()=>{renderer.render();atmosphere.render();clouds.endInteraction();});
}

async function observerAfterPaint(renderer,atmosphere,clouds){
  try{
    await new Promise(resolve=>setTimeout(resolve,0));
    const module=await import('./observer.mjs'),receipt=module.buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer),pos=receipt?.canonicalPositionalIdentity?.canonicalPositionalIdentityPassed===true,corr=receipt?.surfaceCorrespondence?.pass===true;
    if(receipt.mechanicalChecksPassed===true&&pos&&corr){setStatus('REVIEW','OW01_CLOUD_PERFORMANCE_USER_REVIEW_REQUIRED');setDiagnostic(`MECHANICAL BASE PASS · 12/12 geographic anchors · visual reference ${CLOUD_VISUAL_REFERENCE_HEAD.slice(0,8)} preserved as the quality target · pointer movement no longer forces a synchronous full cloud ray-march · judge tablet responsiveness, settled cloud quality, planetary occupancy, cloud-interior traversal, motion, atmosphere, Mirage, coast, water, terrain and gestures.`);}else{setStatus('FAIL','OW01_MECHANICAL_FAIL');setDiagnostic(`MECHANICAL_FAIL · ${(receipt.failedChecks||['unknown']).join(', ')}`);}
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({operationId:OP,coherenceOperation:COH,renderer,observerReceipt:receipt,atmosphereEvidence:atmosphere.getEvidence(),cloudEvidence:clouds.getEvidence()});
    window.__H_EARTH_OW01_ATMOSPHERE_LAYER__=atmosphere;
    window.__H_EARTH_OW01_CLOUD_LAYER__=clouds;
  }catch(error){console.warn('AUDRALIA_OW01_OBSERVER_FAILED',error);setStatus('REVIEW','VISUAL_READY_OBSERVER_DEFERRED');setDiagnostic(`CLOUD_PERFORMANCE_VISUAL_READY · observer deferred: ${error instanceof Error?error.message:String(error)}`);}
}

async function initialize(){
  try{
    if(!(canvas instanceof HTMLCanvasElement))throw Error('H_EARTH_OW01_CANVAS_MISSING');
    setStatus('world…','IMPORTING_CLOUD_VISUAL_REFERENCE');
    setDiagnostic('Loading the approved cloud visual reference before applying the bounded tablet/mobile performance successor…');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const module=await import('./renderer.mjs');
    setStatus('building…','BUILDING_CLOUD_PERFORMANCE_SUCCESSOR');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const renderer=module.createMapWideEnvironmentRenderer(canvas);renderer.render();
    const atmosphere=createAtmosphereLayer(renderer);atmosphere.render();
    const clouds=createCloudLayer(renderer);clouds.render();clouds.start();
    wire(renderer,atmosphere,clouds);updateScaleUI(renderer);setStatus('REVIEW','CLOUD_PERFORMANCE_VISUAL_READY_USER_REVIEW_REQUIRED');requestAnimationFrame(()=>observerAfterPaint(renderer,atmosphere,clouds));
  }catch(error){fail('INITIALIZATION',error);}
}
setStatus('boot…','BOOTSTRAP_ACTIVE');setDiagnostic('Starting tablet/mobile cloud-performance successor over the approved visual reference…');initialize();