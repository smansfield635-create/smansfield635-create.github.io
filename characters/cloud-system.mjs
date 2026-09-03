export const CLOUD_PRESENTATION_BY_STATE=Object.freeze({
  ORBIT:Object.freeze({opacity:.28,opticalDepth:.16,veil:0,drift:1}),
  ASCENT:Object.freeze({opacity:.38,opticalDepth:.28,veil:.08,drift:1.05}),
  CLOUD_ENTRY:Object.freeze({opacity:.58,opticalDepth:.52,veil:.30,drift:1.08}),
  CLOUD_TRANSIT:Object.freeze({opacity:.78,opticalDepth:.82,veil:.68,drift:1.10}),
  DESCENT:Object.freeze({opacity:.48,opticalDepth:.38,veil:.18,drift:.85}),
  ARRIVAL:Object.freeze({opacity:.24,opticalDepth:.14,veil:0,drift:.55})
});

const DESKTOP_BANKS=[
  [-430,118,-720,1.15,0.12],[-245,96,-930,.92,.42],[-55,132,-610,1.28,.75],[155,108,-820,1.04,1.18],
  [360,124,-560,1.18,1.61],[-335,146,-1160,.90,2.03],[80,158,-1110,1.14,2.48],[455,138,-1010,.98,2.91]
];
const MOBILE_BANKS=[DESKTOP_BANKS[0],DESKTOP_BANKS[2],DESKTOP_BANKS[3],DESKTOP_BANKS[5],DESKTOP_BANKS[7]];
const PUFF_PATTERN=[[-54,-8,-6,.82],[-28,5,7,1.04],[0,10,0,1.20],[31,4,-5,1.00],[56,-5,9,.76],[-10,-9,19,.86],[18,-7,-18,.72]];

export function buildCloudBankLayout({compact=false}={}){
  const seeds=compact?MOBILE_BANKS:DESKTOP_BANKS;
  return seeds.map(([x,y,z,scale,phase],bankIndex)=>({
    bankIndex,x,y,z,scale,phase,
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
uniform mat4 uVP;
uniform float uDrift;
uniform float uTime;
out vec3 vNormal;
out float vEdge;
void main(){
  vec3 p=aPos;
  p.x += sin((aPos.z*.007)+(uTime*.07))*uDrift*3.0;
  p.z += cos((aPos.x*.006)+(uTime*.052))*uDrift*2.2;
  vNormal=aNormal;
  vEdge=abs(aNormal.y);
  gl_Position=uVP*vec4(p,1.0);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNormal;
in float vEdge;
uniform float uOpacity;
uniform float uOpticalDepth;
out vec4 outColor;
void main(){
  vec3 n=normalize(vNormal);
  float moon=max(0.0,dot(n,normalize(vec3(-.42,.72,.56))));
  float body=.56+.34*moon;
  float underside=smoothstep(-.72,.25,n.y);
  vec3 cool=vec3(.66,.73,.84);
  vec3 silver=vec3(.88,.91,.95);
  vec3 c=mix(cool,silver,body)*mix(.68,1.0,underside);
  float alpha=uOpacity*(.52+.34*(1.0-vEdge))*(.72+.28*uOpticalDepth);
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
void main(){
  vec2 q=vUv*vec2(6.0,4.0)+vec2(uTime*.012,-uTime*.006);
  float n=mix(h(floor(q)),h(floor(q)+vec2(1.0,1.0)),.5);
  float band=.78+.22*sin(vUv.y*9.0+vUv.x*3.0);
  vec3 c=mix(vec3(.48,.56,.66),vec3(.76,.80,.84),band);
  float a=uVeil*(.76+.16*n);
  outColor=vec4(c,a);
}`;

function compile(gl,type,src){const shader=gl.createShader(type);gl.shaderSource(shader,src);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`CLOUD_SHADER_COMPILE:${gl.getShaderInfoLog(shader)}`);return shader;}
function link(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`CLOUD_PROGRAM_LINK:${gl.getProgramInfoLog(p)}`);return p;}

function ellipsoidPuff(cx,cy,cz,r,flatten){
  const verts=[],latBands=5,lonBands=10,ry=r*flatten;
  const point=(lat,lon)=>{const phi=-Math.PI/2+(lat/latBands)*Math.PI,theta=(lon/lonBands)*Math.PI*2,cp=Math.cos(phi);return [cx+r*cp*Math.cos(theta),cy+ry*Math.sin(phi),cz+r*cp*Math.sin(theta),cp*Math.cos(theta),Math.sin(phi),cp*Math.sin(theta)];};
  for(let lat=0;lat<latBands;lat++)for(let lon=0;lon<lonBands;lon++){
    const a=point(lat,lon),b=point(lat+1,lon),c=point(lat+1,lon+1),d=point(lat,lon+1);
    verts.push(...a,...b,...c,...a,...c,...d);
  }
  return verts;
}
function geometry(layout){const verts=[];for(const bank of layout)for(const puff of bank.puffs)verts.push(...ellipsoidPuff(puff.x,puff.y,puff.z,puff.radius,puff.flatten));return new Float32Array(verts);}

export function createCloudSystem({gl,compact=false,reducedMotion=false}={}){
  if(!gl)throw new Error('CLOUD_SYSTEM_WEBGL2_REQUIRED');
  const layout=buildCloudBankLayout({compact});
  const verts=geometry(layout);
  const cloudProgram=link(gl,VS,FS),veilProgram=link(gl,VEIL_VS,VEIL_FS);
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,verts,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
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
    gl.bindVertexArray(vao);gl.drawArrays(gl.TRIANGLES,0,verts.length/6);
    if(profile.veil>0){
      gl.disable(gl.DEPTH_TEST);gl.useProgram(veilProgram);gl.uniform1f(locations.veil,profile.veil);gl.uniform1f(locations.veilTime,reducedMotion?0:time);gl.bindVertexArray(veilVao);gl.drawArrays(gl.TRIANGLES,0,3);
    }
    gl.bindVertexArray(null);gl.depthMask(true);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);
  }
  function snapshot(){return {schema:'MIRRORLAND_CLOUD_SYSTEM_RUNTIME_v1',state:last.state,bankCount:layout.length,puffCount,opacity:last.opacity,opticalDepth:last.opticalDepth,veil:last.veil,drift:last.drift,reducedMotion,compact};}
  const api={draw,snapshot,layout};
  if(typeof globalThis!=='undefined')globalThis.__MIRRORLAND_CLOUD_SYSTEM__=api;
  return api;
}
