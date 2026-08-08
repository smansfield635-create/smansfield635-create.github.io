const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');

const PLANET_RADIUS=6200;
const PLANET_CENTER=[0,-PLANET_RADIUS,0];
const NORTH=[0,.5,-.8660254037844386];
const MERIDIAN=[0,.8660254037844386,.5];
const EAST=[1,0,0];
const SUN=[.42,.78,.46];
const OUTER_RADIUS=6304;
const OCCLUDER_RADIUS=6227;
const EPOCH_MS=Date.parse('2026-08-08T03:26:20.000Z');
const TIME_SCALE=24;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

function createLayer(renderer){
  if(!(canvas instanceof HTMLCanvasElement))throw Error('H_EARTH_GLOBAL_CLOUD_SUPPORT_CANVAS_MISSING');
  const parent=canvas.parentElement;
  if(!(parent instanceof HTMLElement))throw Error('H_EARTH_GLOBAL_CLOUD_SUPPORT_PARENT_MISSING');
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';

  const overlay=document.createElement('canvas');
  overlay.setAttribute('aria-hidden','true');
  overlay.dataset.hEarthGlobalCloudSupport='true';
  Object.assign(overlay.style,{position:'absolute',pointerEvents:'none',zIndex:'1',background:'transparent',imageRendering:'auto'});
  parent.appendChild(overlay);

  const gl=overlay.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'high-performance'});
  if(!gl)throw Error('H_EARTH_GLOBAL_CLOUD_SUPPORT_WEBGL2_UNAVAILABLE');

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
uniform float uOpacity;
out vec4 outColor;
const float R=6200.0;
const float OUTER=6304.0;
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
  float a=hash31(i+vec3(0,0,0));
  float b=hash31(i+vec3(1,0,0));
  float c=hash31(i+vec3(0,1,0));
  float d=hash31(i+vec3(1,1,0));
  float e=hash31(i+vec3(0,0,1));
  float g=hash31(i+vec3(1,0,1));
  float h=hash31(i+vec3(0,1,1));
  float j=hash31(i+vec3(1,1,1));
  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);
}
float fbm(vec3 p){
  float v=0.0,a=.62;
  v+=noise3(p)*a;
  p=p*2.03+vec3(7.2,3.1,5.6);a*=.46;
  v+=noise3(p)*a;
  return v;
}
vec2 raySphere(vec3 ro,vec3 rd,float radius){
  vec3 o=ro-CENTER;
  float b=dot(o,rd),c=dot(o,o)-radius*radius,q=b*b-c;
  if(q<0.0)return vec2(1e20,-1e20);
  q=sqrt(q);
  return vec2(-b-q,-b+q);
}
float band(float lat,float center,float halfWidth){
  return 1.0-smoothstep(halfWidth*.55,halfWidth,abs(lat-center));
}
float supportAt(vec3 p){
  vec3 q=p-CENTER;
  float rr=length(q);
  if(rr<=R)return 0.0;
  float alt=rr-R;
  vec3 radial=q/rr;
  float lat=asin(clamp(dot(radial,NORTH),-1.0,1.0));
  float lon=atan(dot(radial,EAST),dot(radial,MERIDIAN));
  float t=uTimeHours*.012;

  float equatorCenter=.055*sin(lon*2.0+t)+.025*sin(lon*5.0-t*.7);
  float equator=band(lat,equatorCenter,.20);
  float northSub=band(lat,.47+.035*sin(lon*1.4-t*.4),.17);
  float southSub=band(lat,-.45+.03*sin(lon*1.7+t*.35),.17);
  float northMid=band(lat,.78+.055*sin(lon*2.2+t*.24),.20);
  float southMid=band(lat,-.76+.05*sin(lon*2.0-t*.22),.20);
  float northHigh=band(lat,1.02+.035*sin(lon*2.8+t*.18),.16);
  float southHigh=band(lat,-1.00+.03*sin(lon*2.5-t*.17),.16);

  float lowZ=smoothstep(31.0,36.0,alt)*(1.0-smoothstep(43.0,49.0,alt));
  float midZ=smoothstep(42.0,49.0,alt)*(1.0-smoothstep(64.0,73.0,alt));
  float highZ=smoothstep(62.0,72.0,alt)*(1.0-smoothstep(96.0,104.0,alt));
  float deepZ=smoothstep(32.0,38.0,alt)*(1.0-smoothstep(91.0,103.0,alt));

  vec3 world=vec3(lon*2.25,lat*4.0,alt*.045);
  float broad=fbm(world+vec3(t*.28,-t*.11,t*.04));
  float detail=fbm(world*2.3+vec3(11.7,-4.2,t*.31));
  float slots=.5+.5*sin(lon*3.4+sin(lat*5.0)*1.3+t*.55);
  float broken=smoothstep(.48,.72,broad*.72+detail*.28+.09*slots);

  float tropical=(equator*(.38*lowZ+.62*deepZ));
  float subtropical=(northSub+southSub)*lowZ*.60;
  float midlatitude=(northMid+southMid)*(midZ*.66+highZ*.30);
  float jet=(northHigh+southHigh)*highZ*.42;

  float climate=tropical+subtropical+midlatitude+jet;
  float clearSlot=1.0-smoothstep(.70,.92,.5+.5*sin(lon*1.15-lat*2.4+t*.21));
  float density=climate*broken*mix(.58,1.0,clearSlot);
  return clamp(density,0.0,.78);
}
void main(){
  vec3 rd=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  vec2 outerHit=raySphere(uEye,rd,OUTER);
  float t0=max(0.0,outerHit.x),t1=outerHit.y;
  if(t1<=t0){outColor=vec4(0.0);return;}
  vec2 planetHit=raySphere(uEye,rd,OCCLUDER);
  if(planetHit.x>0.0)t1=min(t1,planetHit.x);
  if(t1<=t0){outColor=vec4(0.0);return;}

  const int STEPS=12;
  float stepLen=(t1-t0)/float(STEPS);
  float jitter=hash31(vec3(gl_FragCoord.xy,uTimeHours*.013));
  float t=t0+stepLen*jitter;
  vec3 premul=vec3(0.0);
  float alpha=0.0;
  vec3 sun=normalize(uSunDir);
  for(int i=0;i<STEPS;i++){
    if(t>t1||alpha>.82)break;
    vec3 p=uEye+rd*t;
    float den=supportAt(p);
    if(den>.012){
      vec3 radial=normalize(p-CENTER);
      float daylight=.48+.52*clamp(dot(radial,sun)*.5+.5,0.0,1.0);
      vec3 bright=mix(vec3(.77,.82,.88),vec3(.99,.98,.94),daylight);
      vec3 dark=vec3(.46,.50,.56);
      vec3 col=mix(bright,dark,clamp(den*.38,0.0,.46));
      float a=(1.0-exp(-den*stepLen*.0105))*uOpacity;
      premul+=(1.0-alpha)*col*a;
      alpha+=(1.0-alpha)*a;
    }
    t+=stepLen;
  }
  if(alpha<.003){outColor=vec4(0.0);return;}
  outColor=vec4(premul/max(alpha,.0001),clamp(alpha,0.0,.78));
}`;

  const compile=(type,source)=>{
    const shader=gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(`GLOBAL_CLOUD_SUPPORT_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);
    return shader;
  };
  const program=gl.createProgram();
  gl.attachShader(program,compile(gl.VERTEX_SHADER,VS));
  gl.attachShader(program,compile(gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(`GLOBAL_CLOUD_SUPPORT_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  const vao=gl.createVertexArray();

  const tangentDirection=(u,v)=>{
    const radius=Math.hypot(u,v);
    if(radius<1e-9)return[0,1,0];
    const angle=radius/PLANET_RADIUS,sine=Math.sin(angle),cosine=Math.cos(angle);
    return norm([sine*u/radius,cosine,sine*v/radius]);
  };
  const surfacePosition=(direction,elevation=0)=>[
    PLANET_CENTER[0]+direction[0]*(PLANET_RADIUS+elevation),
    PLANET_CENTER[1]+direction[1]*(PLANET_RADIUS+elevation),
    PLANET_CENTER[2]+direction[2]*(PLANET_RADIUS+elevation)
  ];
  const tangentPosition=(u,v)=>surfacePosition(tangentDirection(u,v),0);
  const cameraFrame=snapshot=>{
    const pitch=clamp(snapshot.pitch,.46,1.49),distance=clamp(snapshot.distance,95,5600),yaw=snapshot.yaw,targetU=snapshot.targetU,targetV=snapshot.targetV;
    const direction=tangentDirection(targetU,targetV),target=surfacePosition(direction,0);
    const eU=norm(sub(tangentPosition(targetU+1,targetV),tangentPosition(targetU-1,targetV)));
    const eV=norm(sub(tangentPosition(targetU,targetV+1),tangentPosition(targetU,targetV-1)));
    const horizontal=norm(add(scale(eU,Math.sin(yaw)),scale(eV,Math.cos(yaw))));
    const eye=add(add(target,scale(direction,distance*Math.sin(pitch)+18)),scale(horizontal,distance*Math.cos(pitch)));
    const forward=norm(sub(target,eye)),right=norm(cross(forward,direction)),up=norm(cross(right,forward));
    return{eye,forward,right,up};
  };

  const uniform=name=>gl.getUniformLocation(program,name);
  const U=Object.freeze({
    eye:uniform('uEye'),forward:uniform('uForward'),right:uniform('uRight'),up:uniform('uUp'),sun:uniform('uSunDir'),
    aspect:uniform('uAspect'),tanHalfFov:uniform('uTanHalfFov'),time:uniform('uTimeHours'),opacity:uniform('uOpacity')
  });

  const resize=()=>{
    const rect=canvas.getBoundingClientRect(),parentRect=parent.getBoundingClientRect();
    overlay.style.left=`${rect.left-parentRect.left}px`;
    overlay.style.top=`${rect.top-parentRect.top}px`;
    overlay.style.width=`${rect.width}px`;
    overlay.style.height=`${rect.height}px`;
    const dpr=.42,w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
    if(overlay.width!==w||overlay.height!==h){overlay.width=w;overlay.height=h;}
    gl.viewport(0,0,w,h);
  };

  const render=()=>{
    resize();
    const scaleName=renderer.getViewScale?.()||'LOCAL';
    const opacityByScale={PLANETARY:.86,CONTINENT:.72,REGION:.34,LOCAL:0};
    const opacity=opacityByScale[scaleName]??0;
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if(opacity<=.001)return;
    const snapshot=renderer.getSnapshot(),cam=cameraFrame(snapshot),timeHours=Math.max(0,(Date.now()-EPOCH_MS)/3600000*TIME_SCALE);
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(program);gl.bindVertexArray(vao);
    gl.uniform3fv(U.eye,cam.eye);gl.uniform3fv(U.forward,cam.forward);gl.uniform3fv(U.right,cam.right);gl.uniform3fv(U.up,cam.up);gl.uniform3fv(U.sun,SUN);
    gl.uniform1f(U.aspect,overlay.width/Math.max(1,overlay.height));gl.uniform1f(U.tanHalfFov,Math.tan(55*Math.PI/360));gl.uniform1f(U.time,timeHours);gl.uniform1f(U.opacity,opacity);
    gl.drawArrays(gl.TRIANGLES,0,3);
    overlay.dataset.scale=scaleName;
    overlay.dataset.timeHours=timeHours.toFixed(3);
  };

  let raf=0,last=0,running=false;
  const tick=now=>{if(!running)return;if(now-last>=170){last=now;render();}raf=requestAnimationFrame(tick);};
  const start=()=>{if(running)return;running=true;raf=requestAnimationFrame(tick);};
  const stop=()=>{running=false;if(raf)cancelAnimationFrame(raf);raf=0;};
  const evidence=Object.freeze({
    schema:'H_EARTH_OW01_GLOBAL_CONTINUOUS_CLOUD_SUPPORT_v1',
    worldAnchored:true,
    cameraGenerated:false,
    continuousPlanetarySupport:true,
    organizedWeatherAuthoritiesRemainSeparate:true,
    backgroundRaySteps:12,
    backgroundRenderScale:.42,
    localFadeOut:true,
    preservesExistingVolumetricTraversal:true
  });
  return Object.freeze({overlay,render,start,stop,getEvidence:()=>evidence,destroy:()=>{stop();overlay.remove();}});
}

async function boot(){
  for(let attempt=0;attempt<240;attempt++){
    const preview=window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__;
    const renderer=preview?.renderer;
    if(renderer){
      const layer=createLayer(renderer);
      layer.render();
      layer.start();
      window.__H_EARTH_OW01_GLOBAL_CLOUD_SUPPORT_LAYER__=layer;
      window.__H_EARTH_OW01_GLOBAL_CLOUD_SUPPORT_EVIDENCE__=layer.getEvidence();
      window.addEventListener('resize',()=>layer.render());
      return;
    }
    await new Promise(resolve=>setTimeout(resolve,25));
  }
  console.warn('H_EARTH_GLOBAL_CLOUD_SUPPORT_BOOT_DEFERRED: renderer preview was not published in time');
}

boot().catch(error=>console.error('H_EARTH_GLOBAL_CLOUD_SUPPORT_FAILED',error));
