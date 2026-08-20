import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  getHEarthCanonicalShorelineZ,
  sampleHEarthTerrainField
} from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const canvas=document.getElementById('world');
const scaleLabel=document.getElementById('scaleLabel');
const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});
if(!gl) throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l)};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const mix3=(a,b,t)=>a.map((v,i)=>mix(v,b[i],t));
const gaussian=(x,z,cx,cz,rx,rz,a)=>{const dx=(x-cx)/rx,dz=(z-cz)/rz;return a*Math.exp(-(dx*dx+dz*dz)*1.6)};

const PLANET_RADIUS=6200;
const CENTER=[0,-PLANET_RADIUS,0];
const LOCAL_CENTER_Z=-128;
const RESOLVED=H_EARTH_TERRAIN_FIELD.worldDomain;

const PALETTE={
  sky:[0.045,0.105,0.17], ocean:[0.025,0.19,0.34], oceanDeep:[0.012,0.075,0.16],
  provisional:[0.19,0.31,0.22], low:[0.28,0.43,0.22], meadow:[0.34,0.49,0.25],
  upland:[0.40,0.42,0.25], rock:[0.42,0.37,0.31], high:[0.48,0.46,0.40], sand:[0.63,0.57,0.40]
};

function tangentDirection(u,v){const r=Math.hypot(u,v);if(r<1e-9)return[0,1,0];const a=r/PLANET_RADIUS,s=Math.sin(a),c=Math.cos(a);return norm([s*u/r,c,s*v/r]);}
function surface(direction,elevation=0,relief=1){const r=PLANET_RADIUS+elevation*relief;return[CENTER[0]+direction[0]*r,CENTER[1]+direction[1]*r,CENTER[2]+direction[2]*r];}
function directionFromLatLon(lat,lon){lat*=Math.PI/180;lon*=Math.PI/180;return norm([Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon)]);}

const NORTH_COAST=[];
for(let x=RESOLVED.xMinimum;x<=RESOLVED.xMaximum;x+=8) NORTH_COAST.push([x,getHEarthCanonicalShorelineZ(x)]);
if(NORTH_COAST[NORTH_COAST.length-1][0]!==RESOLVED.xMaximum) NORTH_COAST.push([RESOLVED.xMaximum,getHEarthCanonicalShorelineZ(RESOLVED.xMaximum)]);

const PROVISIONAL_REMAINDER=[
  [1120,-176],[1238,-300],[1300,-455],[1218,-575],[1345,-725],[1280,-885],
  [1124,-1035],[1188,-1190],[1070,-1350],[890,-1460],[720,-1605],[510,-1710],
  [265,-1815],[10,-1772],[-190,-1650],[-420,-1732],[-645,-1640],[-815,-1490],
  [-1005,-1530],[-1160,-1390],[-1108,-1210],[-1275,-1070],[-1218,-885],[-1360,-720],
  [-1290,-545],[-1192,-388],[-1130,-245]
];
const CONTINENT_LOOP=[...NORTH_COAST,...PROVISIONAL_REMAINDER];

function pointInPolygon(x,z,loop=CONTINENT_LOOP){let inside=false;for(let i=0,j=loop.length-1;i<loop.length;j=i++){const a=loop[i],b=loop[j];if(((a[1]>z)!==(b[1]>z))&&(x<(b[0]-a[0])*(z-a[1])/((b[1]-a[1])||1e-9)+a[0]))inside=!inside;}return inside;}
function distanceToSegment(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],d=dx*dx+dz*dz||1,t=clamp(((x-a[0])*dx+(z-a[1])*dz)/d,0,1);return Math.hypot(x-(a[0]+dx*t),z-(a[1]+dz*t));}
function coastDistance(x,z){let best=1e9;for(let i=0;i<CONTINENT_LOOP.length;i++)best=Math.min(best,distanceToSegment(x,z,CONTINENT_LOOP[i],CONTINENT_LOOP[(i+1)%CONTINENT_LOOP.length]));return best;}

function macroContinuationElevation(x,z){
  const south=smooth(-760,-1700,z);
  let e=4.5+5.5*smooth(30,360,coastDistance(x,z));
  const spine=[
    [120,-330,82,70,50],[210,-500,110,90,58],[330,-700,130,105,68],
    [410,-920,150,120,72],[300,-1140,170,125,66],[80,-1325,185,130,58],
    [-170,-1440,205,145,50],[-405,-1510,220,155,42]
  ];
  for(const [cx,cz,rx,rz,a] of spine)e+=gaussian(x,z,cx,cz,rx,rz,a);
  e+=gaussian(x,z,-700,-1100,230,180,30)*.72;
  e+=gaussian(x,z,790,-1030,210,180,34)*.78;
  e-=gaussian(x,z,95,-620,120,130,18);
  e-=gaussian(x,z,-40,-1040,180,160,13);
  e+=3.2*Math.sin((x+z)*.0061)+2.4*Math.sin(x*.009-z*.0047);
  return Math.max(1.2,e*(1-.10*south));
}
function canonicalElevation(x,z){
  if(x>=RESOLVED.xMinimum&&x<=RESOLVED.xMaximum&&z>=RESOLVED.zMinimum&&z<=RESOLVED.zMaximum){
    const s=sampleHEarthTerrainField(x,z);if(s?.valid)return Math.max(0.15,s.elevation);
  }
  return macroContinuationElevation(x,z);
}
function terrainColor(elevation,edgeDistance,x,z){
  let c=mix3(PALETTE.low,PALETTE.meadow,smooth(3,18,elevation));
  c=mix3(c,PALETTE.upland,smooth(18,42,elevation)*.82);
  c=mix3(c,PALETTE.rock,smooth(38,72,elevation)*.64);
  c=mix3(c,PALETTE.high,smooth(62,96,elevation)*.44);
  const dry=.5+.5*Math.sin(x*.006+z*.004);c=mix3(c,PALETTE.upland,dry*.06);
  if(edgeDistance<20)c=mix3(c,PALETTE.sand,1-smooth(4,20,edgeDistance));
  return c;
}

function buildAxis(min,max,fineMin,fineMax,coarse=22,fine=9){const out=[min];let x=min;while(x<max-1e-6){let step=x>=fineMin&&x<fineMax?fine:coarse,next=Math.min(max,x+step);if(x<fineMin&&next>fineMin)next=fineMin;if(x<fineMax&&next>fineMax)next=fineMax;out.push(next);x=next;}return out;}
function buildGratitudeMesh(){
  const xs=buildAxis(-1400,1400,-320,320,22,8),zs=buildAxis(-1900,260,-420,120,22,8),cols=xs.length,rows=zs.length;
  const vertices=[],indices=[],inside=new Uint8Array(cols*rows),at=(r,c)=>r*cols+c;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const x=xs[c],z=zs[r],land=pointInPolygon(x,z);inside[at(r,c)]=land?1:0;
    const v=z-LOCAL_CENTER_Z,dir=tangentDirection(x,v),edge=land?coastDistance(x,z):0,e=land?canonicalElevation(x,z):0,col=land?terrainColor(e,edge,x,z):PALETTE.low;
    vertices.push(...dir,e,...col);
  }
  for(let r=0;r<rows-1;r++)for(let c=0;c<cols-1;c++){
    const ids=[at(r,c),at(r,c+1),at(r+1,c+1),at(r+1,c)],count=ids.reduce((n,i)=>n+inside[i],0);
    if(count===4)indices.push(ids[0],ids[3],ids[1],ids[1],ids[3],ids[2]);
    else if(count>=2){const x=(xs[c]+xs[c+1])*.5,z=(zs[r]+zs[r+1])*.5;if(pointInPolygon(x,z))indices.push(ids[0],ids[3],ids[1],ids[1],ids[3],ids[2]);}
  }
  return{vertices:new Float32Array(vertices),indices:new Uint32Array(indices)};
}

const PROVISIONAL_CENTERS=[
  [28,38,.34],[-24,72,.30],[15,119,.28],[-32,154,.31],[34,-149,.30],[-27,-112,.32],[8,-76,.29],[-42,-37,.28]
].map(([a,b,r],i)=>({dir:directionFromLatLon(a,b),radius:r,phase:i*1.731}));
function provisionalScore(d){let score=0;for(const p of PROVISIONAL_CENTERS){const a=Math.acos(clamp(dot(d,p.dir),-1,1)),r=p.radius*(.82+.14*Math.sin(d[0]*11+p.phase)+.10*Math.sin(d[2]*17-p.phase));score=Math.max(score,1-smooth(r*.72,r,a));}return score;}
function buildPlanetMesh(){
  const lon=224,lat=144,vertices=[],indices=[],at=(r,c)=>r*(lon+1)+c;
  for(let r=0;r<=lat;r++){
    const la=-Math.PI/2+r/lat*Math.PI,cl=Math.cos(la),sl=Math.sin(la);
    for(let c=0;c<=lon;c++){
      const lo=-Math.PI+c/lon*Math.PI*2,d=norm([cl*Math.cos(lo),sl,cl*Math.sin(lo)]),p=provisionalScore(d);
      const ocean=mix3(PALETTE.oceanDeep,PALETTE.ocean,.42+.16*(.5+.5*Math.sin(d[0]*9+d[2]*7)));
      const col=p>.53?mix3(ocean,PALETTE.provisional,clamp((p-.53)/.12,0,1)*.88):ocean;
      vertices.push(...d,0,...col);
    }
  }
  for(let r=0;r<lat;r++)for(let c=0;c<lon;c++){const a=at(r,c),b=at(r,c+1),d=at(r+1,c),e=at(r+1,c+1);indices.push(a,d,b,b,d,e)}
  return{vertices:new Float32Array(vertices),indices:new Uint32Array(indices)};
}

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aDirection;
layout(location=1) in float aElevation;
layout(location=2) in vec3 aColor;
uniform mat4 uVP;
uniform vec3 uCenter;
uniform float uRadius;
uniform float uRelief;
out vec3 vNormal;
out vec3 vColor;
void main(){vec3 d=normalize(aDirection);vec3 p=uCenter+d*(uRadius+aElevation*uRelief);vNormal=d;vColor=aColor;gl_Position=uVP*vec4(p,1.0);}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vColor;
out vec4 outColor;
void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(.46,.76,.42));float sun=max(dot(n,light),0.0);float hemi=.72+.28*clamp(n.y*.5+.5,0.0,1.0);vec3 c=vColor*(.62+.50*sun)*hemi;outColor=vec4(c,1.0);}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
function vao(mesh){const v=gl.createVertexArray();gl.bindVertexArray(v);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,28,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,1,gl.FLOAT,false,28,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,3,gl.FLOAT,false,28,16);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return v;}
const planetMesh=buildPlanetMesh(),gratitudeMesh=buildGratitudeMesh(),planetVao=vao(planetMesh),gratitudeVao=vao(gratitudeMesh);

function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),q=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*q,-1,0,0,2*far*near*q,0]);}
function lookAt(eye,target,up){const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;}

const state={yaw:-.28,pitch:.92,distance:5000,targetU:0,targetV:-620};
function viewScale(){return state.distance<850?'Region':state.distance<2400?'Continent':'Planetary';}
function reliefScale(){return 1+3.6*smooth(1100,5200,state.distance);}
function resize(){const dpr=Math.min(1.5,devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h)}
function camera(){state.pitch=clamp(state.pitch,.42,1.48);state.distance=clamp(state.distance,130,5600);const dir=tangentDirection(state.targetU,state.targetV),target=surface(dir,0),du=norm(sub(surface(tangentDirection(state.targetU+1,state.targetV)),surface(tangentDirection(state.targetU-1,state.targetV)))),dv=norm(sub(surface(tangentDirection(state.targetU,state.targetV+1)),surface(tangentDirection(state.targetU,state.targetV-1)))),h=norm(add(mul(du,Math.sin(state.yaw)),mul(dv,Math.cos(state.yaw)))),eye=add(add(target,mul(dir,state.distance*Math.sin(state.pitch)+24)),mul(h,state.distance*Math.cos(state.pitch)));return{target,eye,up:dir}}
function draw(mesh,v,VP,relief){gl.bindVertexArray(v);gl.uniformMatrix4fv(gl.getUniformLocation(program,'uVP'),false,VP);gl.uniform3fv(gl.getUniformLocation(program,'uCenter'),CENTER);gl.uniform1f(gl.getUniformLocation(program,'uRadius'),PLANET_RADIUS);gl.uniform1f(gl.getUniformLocation(program,'uRelief'),relief);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0)}
function render(){resize();gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.clearColor(...PALETTE.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const cam=camera(),VP=multiply(perspective(54*Math.PI/180,canvas.width/canvas.height,2,PLANET_RADIUS*4.2),lookAt(cam.eye,cam.target,cam.up));gl.useProgram(program);draw(planetMesh,planetVao,VP,1);draw(gratitudeMesh,gratitudeVao,VP,reliefScale());scaleLabel.textContent=viewScale();}
function setView(which){if(which==='world')Object.assign(state,{distance:5350,pitch:1.00,targetU:0,targetV:-620});else if(which==='gratitude')Object.assign(state,{distance:2850,pitch:.92,targetU:0,targetV:-650});else Object.assign(state,{distance:760,pitch:.82,targetU:40,targetV:-110});render()}
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>setView(b.dataset.view));

const pointers=new Map();let lastSingle=null,lastPinch=null;
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===1)lastSingle=[e.clientX,e.clientY]});
canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);const pts=[...pointers.values()];if(pts.length===1&&lastSingle){const dx=pts[0][0]-lastSingle[0],dy=pts[0][1]-lastSingle[1];state.yaw-=dx*.0047;state.pitch=clamp(state.pitch+dy*.0032,.42,1.48);lastSingle=pts[0];render()}else if(pts.length>=2){const d=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);if(lastPinch){state.distance=clamp(state.distance*(lastPinch/d),130,5600);render()}lastPinch=d}});
function endPointer(e){pointers.delete(e.pointerId);lastPinch=null;lastSingle=pointers.size===1?[...pointers.values()][0]:null}
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);
canvas.addEventListener('wheel',e=>{e.preventDefault();state.distance=clamp(state.distance*Math.exp(clamp(e.deltaY,-800,800)*.0011),130,5600);render()},{passive:false});
canvas.addEventListener('dblclick',()=>setView('gratitude'));
window.addEventListener('resize',render);

console.info('AUDRALIA_GCR1_CONTINENT_RECONSTRUCTION',{
  world:'AUDRALIA',continent:'GRATITUDE',resolvedSource:H_EARTH_TERRAIN_FIELD.contractId,
  coast:H_EARTH_GRATITUDE_COASTAL_SYSTEM.systemId,watershed:H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM.systemId,
  otherTerritories:'PROVISIONAL',clouds:'HELD_CONSTANT_OUT_OF_SCOPE',legacyVisibleContinentAuthority:false
});
render();
