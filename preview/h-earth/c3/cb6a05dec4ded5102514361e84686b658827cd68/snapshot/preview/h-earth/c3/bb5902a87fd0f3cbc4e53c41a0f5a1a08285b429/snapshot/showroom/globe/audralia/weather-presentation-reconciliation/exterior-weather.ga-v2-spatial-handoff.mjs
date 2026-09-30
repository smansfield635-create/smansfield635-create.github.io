import {
  buildFAP1GPUWeatherPacket,
  evaluateFAP1GPUWeatherPacket
} from './fap1-gpu-weather-descriptors.mjs';

const PLANET_RADIUS=6200;
const PLANET_CENTER=[0,-PLANET_RADIUS,0];
const EPOCH_MS=Date.parse('2026-08-08T03:26:20.000Z'),TIME_SCALE=24;
const REST_STEPS=32,INTERACTION_STEPS=15,REST_MAX_PIXELS=230000,INTERACTION_MAX_PIXELS=90000;
const GENUS=Object.freeze({Ci:0,Cc:1,Cs:2,Ac:3,As:4,Ns:5,Sc:6,St:7,Cu:8,Cb:9});
const CLASS_CODE=Object.freeze({HIGH_ICE:1,MID_FRONTAL:2,LOW_CUMULIFORM:3,DEEP_CONVECTION:4,CYCLONE:5});
const degToRad=deg=>deg*Math.PI/180;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

const VS=`#version 300 es
precision highp float;
out vec2 vNdc;
void main(){vec2 p=gl_VertexID==0?vec2(-1.0,-1.0):(gl_VertexID==1?vec2(3.0,-1.0):vec2(-1.0,3.0));vNdc=p;gl_Position=vec4(p,0.0,1.0);}`;

const FS=`#version 300 es
precision highp float;
in vec2 vNdc;
out vec4 outColor;
uniform vec3 uEye,uForward,uRight,uUp,uSunDir;
uniform float uAspect,uTanHalfFov,uTimeHours,uNearCutoff,uNearFade,uExteriorScale,uOpacity;
uniform int uSystemCount,uClearCount,uStepCount;
uniform float uFullDetail;
uniform vec4 uSysA[8],uSysB[8],uSysC[8],uSysD[8],uClearA[4];
uniform int uCarveActive,uCarveSystemIndex;
uniform float uCarveWeight;
uniform vec3 uCarveCenter,uCarveAxisU,uCarveAxisUp,uCarveAxisV,uCarveRadii;
const float PI=3.141592653589793,R=6200.0,OUTER=6345.0,OCCLUDER=6210.0;
const vec3 CENTER=vec3(0.0,-6200.0,0.0),NORTH=vec3(0.0,.5,-.8660254037844386),MERIDIAN=vec3(0.0,.8660254037844386,.5),EAST=vec3(1.0,0.0,0.0);
float hash31(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);float a=hash31(i),b=hash31(i+vec3(1,0,0)),c=hash31(i+vec3(0,1,0)),d=hash31(i+vec3(1,1,0)),e=hash31(i+vec3(0,0,1)),g=hash31(i+vec3(1,0,1)),h=hash31(i+vec3(0,1,1)),j=hash31(i+vec3(1,1,1));return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.0,a=.62;v+=noise3(p)*a;p=p*2.07+vec3(5.3,1.7,9.2);a*=.48;v+=noise3(p)*a;return v;}
float wrapPi(float a){return atan(sin(a),cos(a));}
vec2 raySphere(vec3 ro,vec3 rd,float radius){vec3 o=ro-CENTER;float b=dot(o,rd),c=dot(o,o)-radius*radius,h=b*b-c;if(h<0.0)return vec2(1e20,-1e20);h=sqrt(h);return vec2(-b-h,-b+h);}
float verticalEnvelope(float z){return smoothstep(0.0,.075,z)*(1.0-smoothstep(.86,1.0,z));}
float morphology(float g,vec2 xy,float z,float seed,float time,float fieldScale){
  float r=length(xy),edge=1.0-smoothstep(.70,1.08,r),detailScale=clamp(fieldScale,1.0,9.0);vec2 q=xy*detailScale;
  float n=fbm(vec3(q*2.15,z*3.2)+vec3(seed*19.0,time*.018,-time*.012)),v=verticalEnvelope(z);
  if(g<2.5){float veil=.5+.5*sin(q.x*1.55+q.y*.72+seed*7.0+n*2.2);return edge*v*smoothstep(.32,.63,n+.12*veil)*.44;}
  if(g<4.5){float cells=.5+.5*sin(q.x*2.7+n*2.4)*cos(q.y*2.3-time*.012);return edge*v*smoothstep(.39,.66,n+.18*cells)*.60;}
  if(g<7.5){float sheet=.5+.5*sin(q.x*1.35+q.y*.47+seed*5.0);return edge*v*smoothstep(.35,.62,n+.10*sheet)*.68;}
  if(g<8.5){float taper=mix(1.0,.48,smoothstep(.08,.95,z)),cell=.5+.5*sin(q.x*2.6+seed*9.0)*cos(q.y*2.35-time*.014);return (1.0-smoothstep(taper*.65,taper*1.08,r))*v*smoothstep(.44,.66,n+.22*cell)*.88;}
  float taper=mix(.90,.39,smoothstep(.05,.72,z)),cell=.5+.5*sin(q.x*2.2+seed*7.0)*cos(q.y*2.0-time*.012);
  float tower=(1.0-smoothstep(taper*.62,taper*1.10,r))*v*smoothstep(.39,.62,n+.20*cell);
  float anvilBand=smoothstep(.62,.76,z)*(1.0-smoothstep(.95,1.0,z));
  float anvil=(1.0-smoothstep(.48,1.32,r))*anvilBand*smoothstep(.34,.59,n+.14*cell)*.76;
  return max(tower,anvil);
}
float clearSuppression(float lat,float lon){
  float result=0.0;
  for(int i=0;i<4;i++){if(i>=uClearCount)break;vec4 c=uClearA[i];float dl=wrapPi(lon-c.y),dx=dl*cos(c.x),dy=lat-c.x,d=sqrt(dx*dx+dy*dy);float support=1.0-smoothstep(c.z*.55,c.z,d);result=max(result,support*c.w);}
  return clamp(result,0.0,1.0);
}
float localCarveMask(vec3 p){
  if(uCarveActive==0)return 0.0;
  vec3 d=p-uCarveCenter;
  vec3 q=vec3(dot(d,uCarveAxisU)/max(uCarveRadii.x,.001),dot(d,uCarveAxisUp)/max(uCarveRadii.y,.001),dot(d,uCarveAxisV)/max(uCarveRadii.z,.001));
  return 1.0-smoothstep(.78,1.0,length(q));
}
vec3 densityAt(vec3 p){
  vec3 q=p-CENTER;float rr=length(q);if(rr<=0.0)return vec3(0.0);float h=rr-R;vec3 radial=q/rr;
  float lat=asin(clamp(dot(radial,NORTH),-1.0,1.0)),lon=atan(dot(radial,EAST),dot(radial,MERIDIAN));
  float mass=0.0,iceMass=0.0,precipMass=0.0;
  for(int i=0;i<8;i++){
    if(i>=uSystemCount)break;vec4 a=uSysA[i],b=uSysB[i],c=uSysC[i],d=uSysD[i];
    if(h<a.z||h>a.w)continue;
    float z=(h-a.z)/max(a.w-a.z,.001),dlon=wrapPi(lon-a.y),dx=dlon*cos(a.x)*R,dy=(lat-a.x)*R;
    dx-=d.x*(z-.5);dy-=d.y*(z-.5);
    float co=cos(b.z),si=sin(b.z);vec2 local=vec2(co*dx+si*dy,-si*dx+co*dy),xy=vec2(local.x/max(b.x,1.0),local.y/max(b.y,1.0));
    if(length(xy)>1.42)continue;
    float fs=clamp(sqrt(max(b.x*b.y,1.0))/260.0,1.0,9.0),shape=morphology(b.w,xy,z,c.y,uTimeHours,fs);
    if(d.w>4.5){float r=length(xy),eye=1.0-smoothstep(.10,.19,r),wall=smoothstep(.12,.22,r)*(1.0-smoothstep(.31,.46,r));shape=max(shape,wall*.64*verticalEnvelope(z));shape*=1.0-eye*.985;}
    float den=shape*c.x;
    if(uCarveActive==1&&i==uCarveSystemIndex)den*=1.0-uCarveWeight*localCarveMask(p);
    mass+=den;iceMass+=den*c.z;precipMass+=den*c.w;
  }
  float clear=clearSuppression(lat,lon);float keep=1.0-clear*.96;mass*=keep;iceMass*=keep;precipMass*=keep;
  if(mass<=.0001)return vec3(0.0);return vec3(min(mass,1.7),clamp(iceMass/mass,0.0,1.0),clamp(precipMass/mass,0.0,1.0));
}
void main(){
  vec3 rd=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));vec2 outerHit=raySphere(uEye,rd,OUTER);
  float eyeAltitude=length(uEye-CENTER)-R,inside=step(10.0,eyeAltitude)*(1.0-step(145.0,eyeAltitude));
  float exteriorT0=max(max(0.0,outerHit.x),uNearCutoff),t0=mix(exteriorT0,max(0.0,outerHit.x),inside),t1=outerHit.y;if(t1<=t0){outColor=vec4(0.0);return;}
  vec2 ph=raySphere(uEye,rd,OCCLUDER);if(ph.x>0.0)t1=min(t1,ph.x);if(t1<=t0){outColor=vec4(0.0);return;}
  float count=max(float(uStepCount),1.0),stepLen=(t1-t0)/count,jitter=hash31(vec3(gl_FragCoord.xy,uTimeHours*.01)),t=t0+stepLen*jitter;vec3 premul=vec3(0.0);float alpha=0.0;vec3 sun=normalize(uSunDir);
  for(int s=0;s<40;s++){
    if(s>=uStepCount||t>t1||alpha>.92)break;vec3 cloudSample=densityAt(uEye+rd*t);float gate=mix(smoothstep(uNearCutoff,uNearCutoff+max(1.0,uNearFade),t),1.0,inside),den=cloudSample.x*gate*uExteriorScale;
    if(den>.003){vec3 radial=normalize(uEye+rd*t-CENTER);float daylight=.40+.60*clamp(dot(radial,sun)*.5+.5,0.0,1.0),forward=pow(max(dot(rd,sun),0.0),7.0),core=clamp(den*.56+cloudSample.z*.22,0.0,.76);vec3 bright=mix(vec3(.84,.88,.92),vec3(1.02,1.0,.95),daylight),dark=vec3(.31,.35,.41),col=mix(bright,dark,core);col=mix(col,vec3(.91,.95,1.0),cloudSample.y*.13);col+=vec3(1.0,.95,.84)*forward*.10;float a=(1.0-exp(-den*stepLen*.017))*uOpacity;premul+=(1.0-alpha)*col*a;alpha+=(1.0-alpha)*a;}t+=stepLen;
  }
  if(alpha<.003){outColor=vec4(0.0);return;}outColor=vec4(premul/max(alpha,.0001),clamp(alpha,0.0,.88));
}`;

function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`FAP1_GA_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;}
function makeProgram(gl){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,VS));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`FAP1_GA_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(p)}`);return p;}
function projectionPolicy(scaleName){if(scaleName==='LOCAL')return{nearCutoff:0,nearFade:360,exteriorScale:.42,opacity:.58};if(scaleName==='REGION')return{nearCutoff:120,nearFade:520,exteriorScale:.60,opacity:.68};if(scaleName==='CONTINENT')return{nearCutoff:70,nearFade:360,exteriorScale:.80,opacity:.79};return{nearCutoff:0,nearFade:180,exteriorScale:1,opacity:.91};}

export function createExteriorWeatherProjectionGA({renderer,worldCanvas,getSunDirection}={}){
  if(!renderer||!(worldCanvas instanceof HTMLCanvasElement))throw new Error('FAP1_GA_EXTERIOR_INPUT_INVALID');
  const parent=worldCanvas.parentElement;if(!(parent instanceof HTMLElement))throw new Error('FAP1_GA_EXTERIOR_PARENT_MISSING');if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  const overlay=document.createElement('canvas');overlay.dataset.audraliaExteriorWeather='true';overlay.dataset.fap1GA='true';overlay.dataset.spatialW5Carveout='true';overlay.setAttribute('aria-hidden','true');Object.assign(overlay.style,{position:'absolute',pointerEvents:'none',zIndex:'2',background:'transparent',imageRendering:'auto'});parent.appendChild(overlay);
  const gl=overlay.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('FAP1_GA_WEBGL2_UNAVAILABLE');
  const program=makeProgram(gl),vao=gl.createVertexArray();let interaction=false,lastPacket=null,localCarveout=null;
  const names=['uEye','uForward','uRight','uUp','uSunDir','uAspect','uTanHalfFov','uTimeHours','uNearCutoff','uNearFade','uExteriorScale','uOpacity','uSystemCount','uClearCount','uStepCount','uFullDetail','uSysA[0]','uSysB[0]','uSysC[0]','uSysD[0]','uClearA[0]','uCarveActive','uCarveSystemIndex','uCarveWeight','uCarveCenter','uCarveAxisU','uCarveAxisUp','uCarveAxisV','uCarveRadii'];
  const U=Object.freeze(Object.fromEntries(names.map(name=>[name,gl.getUniformLocation(program,name)])));
  function resize(){const rect=worldCanvas.getBoundingClientRect(),parentRect=parent.getBoundingClientRect();overlay.style.left=`${rect.left-parentRect.left}px`;overlay.style.top=`${rect.top-parentRect.top}px`;overlay.style.width=`${rect.width}px`;overlay.style.height=`${rect.height}px`;const area=Math.max(1,rect.width*rect.height),maxPixels=interaction?INTERACTION_MAX_PIXELS:REST_MAX_PIXELS,base=interaction?.48:.68,scaleFactor=Math.max(.28,Math.min(base,Math.sqrt(maxPixels/area))),w=Math.max(1,Math.round(rect.width*scaleFactor)),h=Math.max(1,Math.round(rect.height*scaleFactor));if(overlay.width!==w||overlay.height!==h){overlay.width=w;overlay.height=h;}gl.viewport(0,0,w,h);overlay.dataset.renderScale=scaleFactor.toFixed(3);overlay.dataset.renderPixels=String(w*h);}
  function setLocalCarveout(value){
    if(!value){localCarveout=null;return;}
    if(typeof value.weatherId!=='string'||!Array.isArray(value.center)||!Array.isArray(value.axisU)||!Array.isArray(value.axisUp)||!Array.isArray(value.axisV)||!Array.isArray(value.radii))throw new Error('FAP1_GA_LOCAL_CARVEOUT_INVALID');
    localCarveout=Object.freeze({weatherId:value.weatherId,center:[...value.center],axisU:[...value.axisU],axisUp:[...value.axisUp],axisV:[...value.axisV],radii:[...value.radii],weight:clamp(Number(value.weight)||0,0,1)});
  }
  function clearLocalCarveout(){localCarveout=null;}
  function render(camera){
    resize();const timeHours=Math.max(0,(Date.now()-EPOCH_MS)/3600000*TIME_SCALE),packet=buildFAP1GPUWeatherPacket({canonicalTimeHours:timeHours}),evaluation=evaluateFAP1GPUWeatherPacket(packet);if(!evaluation.eligible)throw new Error(`FAP1_GA_PACKET_INVALID:${evaluation.issues.join(',')}`);lastPacket=packet;
    const policy=projectionPolicy(renderer.getViewScale?.()||camera.snapshot?.viewScale||'LOCAL'),systems=packet.systems.slice(0,8),clears=packet.clearRegions.slice(0,4),a=new Float32Array(32),b=new Float32Array(32),c=new Float32Array(32),d=new Float32Array(32),clearA=new Float32Array(16);
    systems.forEach((system,index)=>{const baseAuth=10+system.baseKm*7.2,topAuth=10+system.topKm*7.2;a.set([degToRad(system.latitudeDeg),degToRad(system.longitudeDeg),baseAuth,topAuth],index*4);b.set([system.majorKm,system.minorKm,degToRad(system.orientationDeg),GENUS[system.genus]],index*4);c.set([Number.isFinite(system.canonicalDensity)?system.canonicalDensity:system.density,system.seed,system.ice,system.precip],index*4);d.set([system.shearShiftE,system.shearShiftN,system.support,CLASS_CODE[system.weatherClass]??0],index*4);});
    clears.forEach((clear,index)=>clearA.set([degToRad(clear.latitudeDeg),degToRad(clear.longitudeDeg),degToRad(clear.radiusDeg),clear.suppression],index*4));
    const carveIndex=localCarveout?systems.findIndex(system=>system.id===localCarveout.weatherId):-1,carveActive=carveIndex>=0&&localCarveout.weight>0;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(program);gl.bindVertexArray(vao);
    gl.uniform3fv(U.uEye,camera.eye);gl.uniform3fv(U.uForward,camera.forward);gl.uniform3fv(U.uRight,camera.right);gl.uniform3fv(U.uUp,camera.up);gl.uniform3fv(U.uSunDir,typeof getSunDirection==='function'?getSunDirection():[.42,.78,.46]);gl.uniform1f(U.uAspect,overlay.width/Math.max(1,overlay.height));gl.uniform1f(U.uTanHalfFov,Math.tan(55*Math.PI/360));gl.uniform1f(U.uTimeHours,timeHours);gl.uniform1f(U.uNearCutoff,policy.nearCutoff);gl.uniform1f(U.uNearFade,policy.nearFade);gl.uniform1f(U.uExteriorScale,policy.exteriorScale);gl.uniform1f(U.uOpacity,policy.opacity);gl.uniform1i(U.uSystemCount,systems.length);gl.uniform1i(U.uClearCount,clears.length);gl.uniform1i(U.uStepCount,interaction?INTERACTION_STEPS:REST_STEPS);gl.uniform1f(U.uFullDetail,interaction?0:1);gl.uniform4fv(U['uSysA[0]'],a);gl.uniform4fv(U['uSysB[0]'],b);gl.uniform4fv(U['uSysC[0]'],c);gl.uniform4fv(U['uSysD[0]'],d);gl.uniform4fv(U['uClearA[0]'],clearA);
    gl.uniform1i(U.uCarveActive,carveActive?1:0);gl.uniform1i(U.uCarveSystemIndex,carveIndex);gl.uniform1f(U.uCarveWeight,carveActive?localCarveout.weight:0);gl.uniform3fv(U.uCarveCenter,carveActive?localCarveout.center:[0,0,0]);gl.uniform3fv(U.uCarveAxisU,carveActive?localCarveout.axisU:[1,0,0]);gl.uniform3fv(U.uCarveAxisUp,carveActive?localCarveout.axisUp:[0,1,0]);gl.uniform3fv(U.uCarveAxisV,carveActive?localCarveout.axisV:[0,0,1]);gl.uniform3fv(U.uCarveRadii,carveActive?localCarveout.radii:[1,1,1]);gl.drawArrays(gl.TRIANGLES,0,3);
    overlay.dataset.nearCutoff=String(policy.nearCutoff);overlay.dataset.scaleAuthority=renderer.getViewScale?.()||'UNKNOWN';overlay.dataset.fap1DescriptorCount=String(systems.length);overlay.dataset.fap1ClearDescriptorCount=String(clears.length);overlay.dataset.fap1MeteorologicalAuthority='FAP1_ONLY';overlay.dataset.localCarveoutActive=String(carveActive);overlay.dataset.localCarveoutWeatherId=carveActive?localCarveout.weatherId:'';
  }
  return Object.freeze({overlay,render,setLocalCarveout,clearLocalCarveout,beginInteraction:()=>{interaction=true;},endInteraction:()=>{interaction=false;},destroy:()=>overlay.remove(),getPacket:()=>lastPacket,getCarveout:()=>localCarveout,getEvidence:()=>Object.freeze({schema:'AUDRALIA_FAP1_GA_EXTERIOR_WEATHER_v2_SPATIAL_W5_CARVEOUT',meteorologicalAuthority:'FAP1_ONLY',legacySystemsAuthority:false,globalCloudSupportAuthority:false,noiseCreatesWeather:false,noiseExpressesDescriptors:true,clearAirExecutable:true,interactionSchedulingPreserved:true,spatialW5Carveout:true,descriptorIds:lastPacket?.systems?.map(x=>x.id)??[]})});
}
