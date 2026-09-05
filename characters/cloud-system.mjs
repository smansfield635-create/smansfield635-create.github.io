// Characters cloud presentation adapter.
// Stage 1 of Environment Maturity Parity adopts Audralia PR #780 cloud geometry semantics
// without importing the showroom runtime or changing Characters traversal authority.

export const AUDRALIA_WEATHER_PRESENTATION_SOURCE=Object.freeze({
  pr:780,
  exactHead:'65aedb63832c4774f4a7326297fadbfb14552955',
  sourcePath:'showroom/globe/audralia/weather-presentation-reconciliation/exterior-weather.mjs',
  spatialLodPrecedent:779,
  inheritanceLaw:'OLD_EXTERIOR_APPEARANCE_MAY_BE_INHERITED_NOT_OLD_OCCLUSION_BEHAVIOR'
});
export const AUDRALIA_VOLUMETRIC_GEOMETRY_MODEL='PR780_DENSITY_SAMPLED_VOLUME_CELLS';

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

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const fract=v=>v-Math.floor(v);
function hash31(x,y,z){
  x=fract(x*.1031);y=fract(y*.1031);z=fract(z*.1031);
  const d=x*(y+33.33)+y*(z+33.33)+z*(x+33.33);
  x=fract(x+d);y=fract(y+d);z=fract(z+d);
  return fract((x+y)*z);
}
function noise3(x,y,z){
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=fract(x),fy=fract(y),fz=fract(z);
  const ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy),uz=fz*fz*(3-2*fz);
  const h=(dx,dy,dz)=>hash31(ix+dx,iy+dy,iz+dz),m=(a,b,t)=>a+(b-a)*t;
  const a=m(h(0,0,0),h(1,0,0),ux),b=m(h(0,1,0),h(1,1,0),ux),c=m(h(0,0,1),h(1,0,1),ux),d=m(h(0,1,1),h(1,1,1),ux);
  return m(m(a,b,uy),m(c,d,uy),uz);
}
function fbm(x,y,z){
  let v=0,a=.62;
  v+=noise3(x,y,z)*a;
  x=x*2.07+5.3;y=y*2.07+1.7;z=z*2.07+9.2;a*=.48;
  v+=noise3(x,y,z)*a;
  return v;
}
function verticalEnvelope(z){return smooth(0,.09,z)*(1-smooth(.80,1,z));}
function morphologyDensity(genus,x,z,y,seed,time=0){
  const r=Math.hypot(x,z),edge=1-smooth(.74,1.10,r),qX=x*3.6,qZ=z*3.6;
  const n=fbm(qX*2.15+seed*19,y*3.2+time*.018,qZ*2.15-time*.012),v=verticalEnvelope(y);
  let shape;
  if(genus==='Sc'){const f=.5+.5*Math.sin(qX*5.4+qZ*1.8+n*4+time*.035+seed*11);shape=smooth(.50,.77,n+.24*f)*.62;}
  else if(genus==='Cu'){const c=.5+.5*Math.sin(qX*2.8+seed*9)*Math.cos(qZ*2.5-time*.014);const taper=.98-(.52*smooth(.08,.95,y));shape=(1-smooth(taper*.68,taper*1.08,r))*smooth(.48,.68,n+.25*c)*(.72+.28*Math.sin(y*19+n*5+seed*12));}
  else if(genus==='Ac'){const c=.5+.5*Math.sin(qX*3.7+n*3)*Math.cos(qZ*3.9-time*.014);shape=smooth(.46,.70,n+.26*c)*.62;}
  else if(genus==='Ns'){const b=.5+.5*Math.sin(qX*1.5-qZ*.7+seed*8);shape=smooth(.35,.61,n+.14*b)*.95;}
  else if(genus==='As'){const b=.5+.5*Math.sin(qX*1.25+qZ*.52+seed*6);shape=smooth(.37,.64,n+.12*b)*.66;}
  else if(genus==='Cs'){const b=.5+.5*Math.sin(qX*1.5-qZ*.7+seed*8);shape=smooth(.35,.61,n+.14*b)*.56;}
  else if(genus==='Ci'){const f=.5+.5*Math.sin(qX*5.4+qZ*1.8+n*4+time*.035+seed*11);shape=smooth(.50,.77,n+.24*f)*.48;}
  else {const s=.5+.5*Math.sin(qX*1.45+qZ*.55+seed*5);shape=smooth(.40,.65,n+.10*s)*.56;}
  return edge*v*shape;
}
function bankVolumeBounds(bank){
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(const puff of bank.puffs){
    minX=Math.min(minX,puff.x-puff.radius);maxX=Math.max(maxX,puff.x+puff.radius);
    const vr=puff.radius*puff.flatten;minY=Math.min(minY,puff.y-vr);maxY=Math.max(maxY,puff.y+vr);
    minZ=Math.min(minZ,puff.z-puff.radius*.78);maxZ=Math.max(maxZ,puff.z+puff.radius*.78);
  }
  const pad=18*bank.scale;
  return {minX:minX-pad,maxX:maxX+pad,minY:minY-pad*.35,maxY:maxY+pad*.55,minZ:minZ-pad,maxZ:maxZ+pad};
}
function deterministicJitter(seed){return hash31(seed*1.7+3.1,seed*2.3+5.7,seed*3.1+7.9)-.5;}
function buildVolumetricCells(layout,{compact=false}={}){
  const cells=[],nx=compact?7:11,ny=compact?4:6,nz=compact?7:11;
  for(const bank of layout){
    const b=bankVolumeBounds(bank),seed=.11+bank.phase*.17+bank.bankIndex*.071;
    const cx=(b.minX+b.maxX)/2,cz=(b.minZ+b.maxZ)/2,rx=(b.maxX-b.minX)/2,rz=(b.maxZ-b.minZ)/2;
    for(let iy=0;iy<ny;iy++)for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++){
      const u=(ix+.5)/nx,v=(iy+.5)/ny,w=(iz+.5)/nz;
      const lx=(u*2-1),lz=(w*2-1),density=morphologyDensity(bank.genus,lx,lz,v,seed);
      if(density<.085)continue;
      const sampleSeed=bank.bankIndex*10000+iy*1000+iz*100+ix;
      const jx=deterministicJitter(sampleSeed+1),jy=deterministicJitter(sampleSeed+2),jz=deterministicJitter(sampleSeed+3);
      const x=cx+lx*rx+jx*(rx/nx)*1.35,y=b.minY+v*(b.maxY-b.minY)+jy*((b.maxY-b.minY)/ny)*.85,z=cz+lz*rz+jz*(rz/nz)*1.35;
      const radius=(11+22*Math.pow(clamp(density,0,1),.72))*bank.scale*(compact?.92:1);
      cells.push(x,y,z,radius,genusCode(bank.genus),seed+density*.13,clamp(density*.98+.08,0,1),bank.bankIndex);
    }
  }
  return new Float32Array(cells);
}
function genusCode(genus){return ({Sc:0,Cu:1,Ac:2,Ns:3,As:4,Cs:5,Ci:6,St:7})[genus]??0;}

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in float aRadius;
layout(location=2) in float aGenus;
layout(location=3) in float aSeed;
layout(location=4) in float aDensity;
layout(location=5) in float aBank;
uniform mat4 uVP;
uniform float uDrift;
uniform float uTime;
uniform float uPointScale;
out float vDepth;
out float vGenus;
out float vSeed;
out float vDensity;
out float vBank;
void main(){
  vec3 p=aPos;
  p.x+=sin(aPos.z*.004+uTime*.031+aSeed*7.0)*uDrift*1.15;
  p.z+=cos(aPos.x*.0036+uTime*.024+aSeed*5.0)*uDrift*.88;
  vec4 clip=uVP*vec4(p,1.0);
  vDepth=abs(clip.w);vGenus=aGenus;vSeed=aSeed;vDensity=aDensity;vBank=aBank;
  gl_Position=clip;
  gl_PointSize=clamp(aRadius*uPointScale*820.0/max(vDepth,1.0),3.0,84.0);
}`;

const FS=`#version 300 es
precision highp float;
in float vDepth;
in float vGenus;
in float vSeed;
in float vDensity;
in float vBank;
uniform float uOpacity;
uniform float uOpticalDepth;
uniform float uTime;
out vec4 outColor;
float hash31(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);float a=hash31(i),b=hash31(i+vec3(1,0,0)),c=hash31(i+vec3(0,1,0)),d=hash31(i+vec3(1,1,0)),e=hash31(i+vec3(0,0,1)),g=hash31(i+vec3(1,0,1)),h=hash31(i+vec3(0,1,1)),j=hash31(i+vec3(1,1,1));return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.0,a=.62;v+=noise3(p)*a;p=p*2.07+vec3(5.3,1.7,9.2);a*=.48;v+=noise3(p)*a;return v;}
void main(){
  vec2 uv=gl_PointCoord*2.0-1.0;float r2=dot(uv,uv);if(r2>1.0)discard;
  float z=sqrt(max(0.0,1.0-r2));vec3 n=normalize(vec3(uv,z));
  float cellular=fbm(vec3(uv*3.2,vSeed*11.0+uTime*.006));
  float edge=(1.0-smoothstep(.42,1.0,sqrt(r2)))*smoothstep(.22,.54,cellular+.22*vDensity);
  float underside=.55+.45*smoothstep(-.65,.32,n.y);
  float lunar=max(0.0,dot(n,normalize(vec3(-.34,.84,.42))));
  float silver=.30+.70*lunar;vec3 cool=vec3(.31,.39,.50),lit=vec3(.70,.77,.86);vec3 c=mix(cool,lit,silver)*underside;
  float nearExclusion=smoothstep(150.0,420.0,vDepth);
  float genusLift=.88+.03*mod(vGenus,4.0),bankLift=.94+.03*mod(vBank,3.0);
  float alpha=uOpacity*vDensity*edge*(.66+.34*uOpticalDepth)*nearExclusion*genusLift*bankLift;
  if(alpha<.012)discard;
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

export function createCloudSystem({gl,compact=false,reducedMotion=false}={}){
  if(!gl)throw new Error('CLOUD_SYSTEM_WEBGL2_REQUIRED');
  const layout=buildCloudBankLayout({compact});
  const cells=buildVolumetricCells(layout,{compact});
  const cloudProgram=link(gl,VS,FS),veilProgram=link(gl,VEIL_VS,VEIL_FS);
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,cells,gl.STATIC_DRAW);
  const stride=8*4;
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,stride,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,1,gl.FLOAT,false,stride,12);
  gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,stride,16);
  gl.enableVertexAttribArray(3);gl.vertexAttribPointer(3,1,gl.FLOAT,false,stride,20);
  gl.enableVertexAttribArray(4);gl.vertexAttribPointer(4,1,gl.FLOAT,false,stride,24);
  gl.enableVertexAttribArray(5);gl.vertexAttribPointer(5,1,gl.FLOAT,false,stride,28);
  const veilVao=gl.createVertexArray();gl.bindVertexArray(null);
  const pointRange=gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)||[1,64];
  const pointScale=Math.min(1,Number(pointRange[1]||64)/84);
  const locations={
    vp:gl.getUniformLocation(cloudProgram,'uVP'),opacity:gl.getUniformLocation(cloudProgram,'uOpacity'),
    opticalDepth:gl.getUniformLocation(cloudProgram,'uOpticalDepth'),drift:gl.getUniformLocation(cloudProgram,'uDrift'),time:gl.getUniformLocation(cloudProgram,'uTime'),pointScale:gl.getUniformLocation(cloudProgram,'uPointScale'),
    veil:gl.getUniformLocation(veilProgram,'uVeil'),veilTime:gl.getUniformLocation(veilProgram,'uTime')
  };
  let last={state:'ORBIT',...resolveCloudPresentation('ORBIT',{reducedMotion,compact})};
  const puffCount=layout.reduce((n,b)=>n+b.puffs.length,0),cellCount=cells.length/8;
  function draw({vp,time=0,state}={}){
    const liveState=state||globalThis.document?.documentElement?.dataset?.cloudTravel||'ORBIT';
    const profile=resolveCloudPresentation(liveState,{reducedMotion,compact});
    last={state:liveState,...profile};
    gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
    gl.useProgram(cloudProgram);gl.uniformMatrix4fv(locations.vp,false,vp);gl.uniform1f(locations.opacity,profile.opacity);gl.uniform1f(locations.opticalDepth,profile.opticalDepth);gl.uniform1f(locations.drift,profile.drift);gl.uniform1f(locations.time,reducedMotion?0:time);gl.uniform1f(locations.pointScale,pointScale);
    gl.bindVertexArray(vao);gl.drawArrays(gl.POINTS,0,cellCount);
    if(profile.veil>0){
      gl.disable(gl.DEPTH_TEST);gl.useProgram(veilProgram);gl.uniform1f(locations.veil,profile.veil);gl.uniform1f(locations.veilTime,reducedMotion?0:time);gl.bindVertexArray(veilVao);gl.drawArrays(gl.TRIANGLES,0,3);
    }
    gl.bindVertexArray(null);gl.depthMask(true);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);
  }
  function snapshot(){return {schema:'MIRRORLAND_CLOUD_SYSTEM_RUNTIME_v1',state:last.state,bankCount:layout.length,puffCount,cellCount,geometryModel:AUDRALIA_VOLUMETRIC_GEOMETRY_MODEL,opacity:last.opacity,opticalDepth:last.opticalDepth,veil:last.veil,drift:last.drift,reducedMotion,compact,audraliaWeatherSource:AUDRALIA_WEATHER_PRESENTATION_SOURCE};}
  const api={draw,snapshot,layout};
  if(typeof globalThis!=='undefined')globalThis.__MIRRORLAND_CLOUD_SYSTEM__=api;
  return api;
}
