// Characters cloud presentation adapter.
// Source-bound to accepted Audralia weather presentation lineage (PR #780 exact head
// 65aedb63832c4774f4a7326297fadbfb14552955) and bounded spatial-LOD principles (PR #779).
// Characters retains its own bank/traversal identity; Audralia supplies morphology, breakup,
// optical language and near-field presentation law. No showroom runtime coupling is created.

export const AUDRALIA_WEATHER_PRESENTATION_SOURCE=Object.freeze({
  pr:780,
  exactHead:'65aedb63832c4774f4a7326297fadbfb14552955',
  sourcePath:'showroom/globe/audralia/weather-presentation-reconciliation/exterior-weather.mjs',
  spatialLodPrecedent:779,
  inheritanceLaw:'OLD_EXTERIOR_APPEARANCE_MAY_BE_INHERITED_NOT_OLD_OCCLUSION_BEHAVIOR'
});

export const CLOUD_PRESENTATION_BY_STATE=Object.freeze({
  ORBIT:Object.freeze({opacity:.21,opticalDepth:.15,veil:0,drift:1}),
  ASCENT:Object.freeze({opacity:.29,opticalDepth:.27,veil:.06,drift:1.05}),
  CLOUD_ENTRY:Object.freeze({opacity:.44,opticalDepth:.50,veil:.24,drift:1.08}),
  CLOUD_TRANSIT:Object.freeze({opacity:.58,opticalDepth:.80,veil:.62,drift:1.10}),
  DESCENT:Object.freeze({opacity:.36,opticalDepth:.36,veil:.14,drift:.85}),
  ARRIVAL:Object.freeze({opacity:.18,opticalDepth:.12,veil:0,drift:.55})
});

const DESKTOP_BANKS=[
  [-430,118,-720,1.15,0.12],[-245,96,-930,.92,.42],[-55,132,-610,1.28,.75],[155,108,-820,1.04,1.18],
  [360,124,-560,1.18,1.61],[-335,146,-1160,.90,2.03],[80,158,-1110,1.14,2.48],[455,138,-1010,.98,2.91]
];
const MOBILE_BANKS=[DESKTOP_BANKS[0],DESKTOP_BANKS[2],DESKTOP_BANKS[3],DESKTOP_BANKS[5],DESKTOP_BANKS[7]];
const PUFF_PATTERN=[[-54,-8,-6,.82],[-28,5,7,1.04],[0,10,0,1.20],[31,4,-5,1.00],[56,-5,9,.76],[-10,-9,19,.86],[18,-7,-18,.72]];
const AUDRALIA_GENUS_SEQUENCE=['Sc','Cu','Ac','Ns','As','Cs','Ci','St'];

export function buildCloudBankLayout({compact=false}={}){
  const seeds=compact?MOBILE_BANKS:DESKTOP_BANKS;
  return seeds.map(([x,y,z,scale,phase],bankIndex)=>({
    bankIndex,x,y,z,scale,phase,genus:AUDRALIA_GENUS_SEQUENCE[bankIndex%AUDRALIA_GENUS_SEQUENCE.length],
    puffs:PUFF_PATTERN.map(([dx,dy,dz,s],puffIndex)=>({
      puffIndex,
      x:x+dx*scale,
      y:y+dy*scale,
      z:z+dz*scale,
      radius:(32+((bankIndex*17+puffIndex*11)%19))*scale*s,
      flatten:.52+((bankIndex+puffIndex)%4)*.06
    }))
  }));
}

export function resolveCloudPresentation(state='ORBIT',{reducedMotion=false,compact=false}={}){
  const base=CLOUD_PRESENTATION_BY_STATE[state]||CLOUD_PRESENTATION_BY_STATE.ORBIT;
  return {...base,drift:reducedMotion?0:base.drift,compact};
}

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormal;
layout(location=2) in float aGenus;
layout(location=3) in float aSeed;
uniform mat4 uVP;
uniform float uDrift;
uniform float uTime;
out vec3 vNormal;
out vec3 vWorld;
out float vDepth;
out float vGenus;
out float vSeed;
void main(){
  vec3 p=aPos;
  p.x += sin((aPos.z*.0038)+(uTime*.035)+aSeed)*uDrift*1.25;
  p.z += cos((aPos.x*.0034)+(uTime*.027)+aSeed*.7)*uDrift*.95;
  vec4 clip=uVP*vec4(p,1.0);
  vNormal=aNormal;
  vWorld=p;
  vDepth=abs(clip.w);
  vGenus=aGenus;
  vSeed=aSeed;
  gl_Position=clip;
}`;

// Morphology/noise grammar is adapted from PR #780 exterior-weather.mjs. The bank shell is
// only a bounded carrier; visible density is carved by the Audralia-derived field rather than
// exposing a smooth ellipsoid/puff silhouette.
const FS=`#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vWorld;
in float vDepth;
in float vGenus;
in float vSeed;
uniform float uOpacity;
uniform float uOpticalDepth;
uniform float uTime;
out vec4 outColor;
float hash31(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);float a=hash31(i),b=hash31(i+vec3(1,0,0)),c=hash31(i+vec3(0,1,0)),d=hash31(i+vec3(1,1,0)),e=hash31(i+vec3(0,0,1)),g=hash31(i+vec3(1,0,1)),h=hash31(i+vec3(0,1,1)),j=hash31(i+vec3(1,1,1));return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.0,a=.62;v+=noise3(p)*a;p=p*2.07+vec3(5.3,1.7,9.2);a*=.48;v+=noise3(p)*a;return v;}
float morphology(float g,vec3 p,float seed,float time){
  vec3 q=p*.018+vec3(seed*7.3,time*.012,-time*.008);
  float n=fbm(q),d=fbm(q*2.35+vec3(11.0,3.0,19.0));
  if(g<.5){float f=.5+.5*sin(q.x*5.4+q.z*1.8+n*4.0);return smoothstep(.52,.72,n+.18*f+.10*d);}
  if(g<1.5){float c=.5+.5*sin(q.x*4.2+seed*9.0)*cos(q.z*3.8-time*.018);return smoothstep(.48,.68,n+.22*c+.08*d);}
  if(g<2.5){float veil=.5+.5*sin(q.x*1.7+q.z*.8+seed*7.0);return smoothstep(.40,.64,n+.10*veil+.08*d);}
  if(g<3.5){float c=.5+.5*sin(q.x*3.7+n*3.0)*cos(q.z*3.9-time*.014);return smoothstep(.46,.67,n+.22*c+.08*d);}
  if(g<4.5){float b=.5+.5*sin(q.x*1.25+q.z*.52+seed*6.0);return smoothstep(.39,.62,n+.11*b+.07*d);}
  if(g<5.5){float b=.5+.5*sin(q.x*1.5-q.z*.7+seed*8.0);return smoothstep(.37,.60,n+.12*b+.07*d);}
  if(g<6.5){float b=.5+.5*sin(q.x*3.0+n*3.0)*cos(q.z*3.25+seed*8.0);return smoothstep(.46,.67,n+.20*b+.08*d);}
  float s=.5+.5*sin(q.x*1.45+q.z*.55+seed*5.0);return smoothstep(.42,.64,n+.09*s+.07*d);
}
void main(){
  vec3 n=normalize(vNormal);
  float density=morphology(vGenus,vWorld,vSeed,uTime);
  float underside=.55+.45*smoothstep(-.65,.32,n.y);
  float lunar=max(0.0,dot(n,normalize(vec3(-.34,.84,.42))));
  float silver=.30+.70*lunar;
  vec3 cool=vec3(.31,.39,.50),lit=vec3(.70,.77,.86);
  vec3 c=mix(cool,lit,silver)*underside;
  // PR #780 local exclusion translated to Characters scale: geometry is extinguished before
  // it becomes inspectable. Traversal veil remains the local extinction authority.
  float nearExclusion=smoothstep(150.0,420.0,vDepth);
  float edgeBreak=.55+.45*fbm(vWorld*.028+vec3(vSeed*13.0));
  float alpha=uOpacity*density*edgeBreak*(.68+.32*uOpticalDepth)*nearExclusion;
  if(alpha<.018)discard;
  outColor=vec4(c,alpha);
}`;

const VEIL_VS=`#version 300 es
precision highp float;
out vec2 vUv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUv=p*.5;gl_Position=vec4(p-1.0,0.0,1.0);}`;
const VEIL_FS=`#version 300 es
precision highp float;
in vec2 vUv;
uniform float uVeil;
uniform float uTime;
out vec4 outColor;
float h(vec2 p){return fract(sin(dot(p,vec2(41.3,289.7)))*43758.5453);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 q=vUv*vec2(5.0,3.3)+vec2(uTime*.008,-uTime*.004);
  float broad=n2(q)+.45*n2(q*2.11+4.7);
  float band=.70+.30*smoothstep(.25,1.15,broad);
  vec3 c=mix(vec3(.34,.42,.52),vec3(.66,.71,.78),band);
  float a=uVeil*(.66+.22*band);
  outColor=vec4(c,a);
}`;

function compile(gl,type,src){const shader=gl.createShader(type);gl.shaderSource(shader,src);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`CLOUD_SHADER_COMPILE:${gl.getShaderInfoLog(shader)}`);return shader;}
function link(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`CLOUD_PROGRAM_LINK:${gl.getProgramInfoLog(p)}`);return p;}

function bankEnvelope(bank){
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(const puff of bank.puffs){
    minX=Math.min(minX,puff.x-puff.radius);maxX=Math.max(maxX,puff.x+puff.radius);
    const vr=puff.radius*puff.flatten;minY=Math.min(minY,puff.y-vr);maxY=Math.max(maxY,puff.y+vr);
    minZ=Math.min(minZ,puff.z-puff.radius*.78);maxZ=Math.max(maxZ,puff.z+puff.radius*.78);
  }
  return {cx:(minX+maxX)/2,cy:(minY+maxY)/2,cz:(minZ+maxZ)/2,rx:(maxX-minX)*.62,ry:(maxY-minY)*.62,rz:(maxZ-minZ)*.70};
}
function genusCode(genus){return ({Sc:0,Cu:1,Ac:2,Ns:3,As:4,Cs:5,Ci:6,St:7})[genus]??0;}
function weatherCarrier(cx,cy,cz,rx,ry,rz,seed,genus){
  const out=[],latBands=14,lonBands=36,g=genusCode(genus);
  const point=(lat,lon)=>{
    const phi=-Math.PI/2+(lat/latBands)*Math.PI,theta=(lon/lonBands)*Math.PI*2,cp=Math.cos(phi);
    const low=.91+.09*Math.sin(theta*2.0+seed*.41)*Math.cos(phi*1.7+seed*.09);
    const mid=.94+.06*Math.sin(theta*5.0-phi*3.0+seed*.23)+.035*Math.cos(theta*7.0+phi*4.0+seed*.37);
    const x=cp*Math.cos(theta),y=Math.sin(phi),z=cp*Math.sin(theta),warp=low*mid;
    return [cx+rx*x*warp,cy+ry*y*(.92+.08*Math.sin(theta*3.0+seed)),cz+rz*z*(.94+.07*Math.cos(theta*4.0-phi+seed*.17)),x,y,z,g,seed*.017];
  };
  for(let lat=0;lat<latBands;lat++)for(let lon=0;lon<lonBands;lon++){
    const a=point(lat,lon),b=point(lat+1,lon),c=point(lat+1,lon+1),d=point(lat,lon+1);
    out.push(...a,...b,...c,...a,...c,...d);
  }
  return out;
}
function geometry(layout){
  const verts=[];
  for(const bank of layout){
    const e=bankEnvelope(bank),seed=bank.bankIndex*53+17;
    verts.push(...weatherCarrier(e.cx,e.cy,e.cz,e.rx,e.ry,e.rz,seed,bank.genus));
  }
  return new Float32Array(verts);
}

export function createCloudSystem({gl,compact=false,reducedMotion=false}={}){
  if(!gl)throw new Error('CLOUD_SYSTEM_WEBGL2_REQUIRED');
  const layout=buildCloudBankLayout({compact});
  const verts=geometry(layout);
  const cloudProgram=link(gl,VS,FS),veilProgram=link(gl,VEIL_VS,VEIL_FS);
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,verts,gl.STATIC_DRAW);
  const stride=8*4;
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,stride,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,stride,12);
  gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,stride,24);
  gl.enableVertexAttribArray(3);gl.vertexAttribPointer(3,1,gl.FLOAT,false,stride,28);
  const veilVao=gl.createVertexArray();gl.bindVertexArray(null);
  const locations={
    vp:gl.getUniformLocation(cloudProgram,'uVP'),opacity:gl.getUniformLocation(cloudProgram,'uOpacity'),
    opticalDepth:gl.getUniformLocation(cloudProgram,'uOpticalDepth'),drift:gl.getUniformLocation(cloudProgram,'uDrift'),time:gl.getUniformLocation(cloudProgram,'uTime'),
    veil:gl.getUniformLocation(veilProgram,'uVeil'),veilTime:gl.getUniformLocation(veilProgram,'uTime')
  };
  let last={state:'ORBIT',...resolveCloudPresentation('ORBIT',{reducedMotion,compact})};
  const puffCount=layout.reduce((n,b)=>n+b.puffs.length,0);
  function draw({vp,time=0,state}={}){
    const liveState=state||globalThis.document?.documentElement?.dataset?.cloudTravel||'ORBIT';
    const profile=resolveCloudPresentation(liveState,{reducedMotion,compact});
    last={state:liveState,...profile};
    gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
    gl.useProgram(cloudProgram);gl.uniformMatrix4fv(locations.vp,false,vp);gl.uniform1f(locations.opacity,profile.opacity);gl.uniform1f(locations.opticalDepth,profile.opticalDepth);gl.uniform1f(locations.drift,profile.drift);gl.uniform1f(locations.time,reducedMotion?0:time);
    gl.bindVertexArray(vao);gl.drawArrays(gl.TRIANGLES,0,verts.length/8);
    if(profile.veil>0){
      gl.disable(gl.DEPTH_TEST);gl.useProgram(veilProgram);gl.uniform1f(locations.veil,profile.veil);gl.uniform1f(locations.veilTime,reducedMotion?0:time);gl.bindVertexArray(veilVao);gl.drawArrays(gl.TRIANGLES,0,3);
    }
    gl.bindVertexArray(null);gl.depthMask(true);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);
  }
  function snapshot(){return {schema:'MIRRORLAND_CLOUD_SYSTEM_RUNTIME_v1',state:last.state,bankCount:layout.length,puffCount,opacity:last.opacity,opticalDepth:last.opticalDepth,veil:last.veil,drift:last.drift,reducedMotion,compact,audraliaWeatherSource:AUDRALIA_WEATHER_PRESENTATION_SOURCE};}
  const api={draw,snapshot,layout};
  if(typeof globalThis!=='undefined')globalThis.__MIRRORLAND_CLOUD_SYSTEM__=api;
  return api;
}
