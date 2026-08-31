const canvas=document.querySelector('#scene');
const statusNode=document.querySelector('#status');
const returnButton=document.querySelector('#return');
const story=document.querySelector('#story');
const storyKind=document.querySelector('#story-kind');
const storyTitle=document.querySelector('#story-title');
const storyCopy=document.querySelector('#story-copy');
const fatal=document.querySelector('#fatal');
const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});
if(!gl){fatal.classList.add('show');throw new Error('WEBGL2_UNAVAILABLE');}

// Bounded adaptation of the established Gratitude coast geometry. The broad sweep and
// inlet rhythm are inherited from the existing H-Earth/Audralia coastline authority;
// this scene deliberately renders only a player-scale Mirror Manor coastal region.
const COAST=[[-520,-40],[-760,-80],[-980,-180],[-1180,-340],[-1500,-520],[-1660,-720],[-1500,-900],[-1260,-850],[-1080,-700],[-1180,-1010],[-1380,-1260],[-1510,-1490],[-1370,-1710],[-1080,-1880],[-760,-1990],[-470,-1910],[-190,-2050],[120,-2010],[390,-2160],[650,-2050],[760,-1850],[1040,-1700],[1370,-1800],[1650,-1600],[1760,-1360],[1580,-1260],[1350,-1220],[1140,-1100],[900,-1040],[690,-900],[560,-700],[760,-430]];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const v3=(x=0,y=0,z=0)=>[x,y,z];
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const l=Math.hypot(...a)||1;return scale(a,1/l)};
const bezier=(a,b,c,d,t)=>{const q=1-t;return a.map((_,i)=>q*q*q*a[i]+3*q*q*t*b[i]+3*q*t*t*c[i]+t*t*t*d[i]);};

function shorelineZ(x){
  // Local interpolation from the established coast control field; shifted into the
  // Mirror Manor working window so the same geographic language survives at this scale.
  const pts=COAST.filter(p=>p[0]>=-1180&&p[0]<=1180).sort((a,b)=>a[0]-b[0]);
  if(x<=pts[0][0])return pts[0][1]; if(x>=pts.at(-1)[0])return pts.at(-1)[1];
  for(let i=0;i<pts.length-1;i++)if(x>=pts[i][0]&&x<=pts[i+1][0]){const t=(x-pts[i][0])/(pts[i+1][0]-pts[i][0]);return mix(pts[i][1],pts[i+1][1],smooth(t));}
  return -900;
}
function terrainHeight(x,z){
  const shore=shorelineZ(x)*.42+250;
  const inland=shore-z;
  const beach=clamp(inland/150,0,1);
  const macro=24*Math.sin(x*.004)+15*Math.cos(z*.006)+9*Math.sin((x+z)*.011);
  const rise=Math.max(0,inland)*.055;
  const dune=beach*(6*Math.sin(x*.026)+4*Math.cos(z*.034));
  return inland<0?-5:2+rise+macro+dune;
}

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormal;
uniform mat4 uVP;
uniform float uTime;
out vec3 vPos;out vec3 vNormal;out float vH;
void main(){vPos=aPos;vNormal=aNormal;vH=aPos.y;gl_Position=uVP*vec4(aPos,1.0);}`;
const FS=`#version 300 es
precision highp float;
in vec3 vPos;in vec3 vNormal;in float vH;
uniform vec3 uEye;uniform float uTime;uniform int uWater;
out vec4 outColor;
void main(){
 if(uWater==1){float r=.5+.5*sin(vPos.x*.035+uTime*1.3)+.25*sin(vPos.z*.047-uTime*.8);vec3 c=mix(vec3(.045,.25,.31),vec3(.13,.48,.55),r*.35);float fres=pow(1.0-max(dot(normalize(vNormal),normalize(uEye-vPos)),0.0),3.0);outColor=vec4(c+vec3(.16,.25,.25)*fres,1.0);return;}
 vec3 n=normalize(vNormal);vec3 light=normalize(vec3(.35,.82,.28));float d=.42+.58*max(dot(n,light),0.0);
 float sand=smoothstep(-1.0,13.0,vH)*(1.0-smoothstep(18.0,42.0,vH));
 vec3 rock=mix(vec3(.12,.24,.18),vec3(.25,.34,.22),smoothstep(25.0,120.0,vH));
 vec3 c=mix(rock,vec3(.67,.58,.39),sand);
 c*=d; float haze=clamp(length(vPos.xz)/2200.0,0.0,.65);c=mix(c,vec3(.43,.62,.61),haze*.32);outColor=vec4(c,1.0);
}`;
const PVS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;layout(location=1) in float aSize;layout(location=2) in float aHot;
uniform mat4 uVP;uniform float uDpr;out float vHot;
void main(){gl_Position=uVP*vec4(aPos,1.0);gl_PointSize=aSize*uDpr*(.75+1.0/(max(.28,gl_Position.w*.0018)));vHot=aHot;}`;
const PFS=`#version 300 es
precision highp float;in float vHot;out vec4 outColor;
void main(){vec2 p=gl_PointCoord*2.0-1.0;float d=dot(p,p);if(d>1.0)discard;float a=smoothstep(1.0,.05,d);vec3 c=mix(vec3(.69,.86,.78),vec3(1.0,.82,.42),vHot);outColor=vec4(c,a);}`;
function program(vs,fs){const c=(t,s)=>{const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh};const p=gl.createProgram();gl.attachShader(p,c(gl.VERTEX_SHADER,vs));gl.attachShader(p,c(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
const worldProgram=program(VS,FS),pointProgram=program(PVS,PFS);

function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
function lookAt(eye,target,up=[0,1,0]){const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;}
function project(p,m,w,h){const x=p[0],y=p[1],z=p[2],cx=m[0]*x+m[4]*y+m[8]*z+m[12],cy=m[1]*x+m[5]*y+m[9]*z+m[13],cw=m[3]*x+m[7]*y+m[11]*z+m[15];if(cw<=0)return null;return[(cx/cw*.5+.5)*w,(1-(cy/cw*.5+.5))*h,cw];}

function meshTerrain(){const N=150,size=2100,z0=-1200,z1=280,verts=[],idx=[];for(let j=0;j<=N;j++){const z=mix(z0,z1,j/N);for(let i=0;i<=N;i++){const x=mix(-1050,1050,i/N),y=terrainHeight(x,z);const eps=3,dx=terrainHeight(x+eps,z)-terrainHeight(x-eps,z),dz=terrainHeight(x,z+eps)-terrainHeight(x,z-eps),n=norm([-dx,2*eps,-dz]);verts.push(x,y,z,...n);}}const row=N+1;for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=j*row+i,b=a+1,c=a+row,d=c+1;idx.push(a,c,b,b,c,d);}return {verts:new Float32Array(verts),idx:new Uint32Array(idx)};}
function meshWater(){const y=-2,x0=-1250,x1=1250,z0=-1550,z1=420,verts=new Float32Array([x0,y,z0,0,1,0,x1,y,z0,0,1,0,x0,y,z1,0,1,0,x1,y,z1,0,1,0]),idx=new Uint32Array([0,2,1,1,2,3]);return{verts,idx};}
function makeVAO(mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.verts,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.idx,gl.STATIC_DRAW);return{vao,count:mesh.idx.length};}
const terrain=makeVAO(meshTerrain()),water=makeVAO(meshWater());

const DESTINATIONS=[
 {id:'crossing',kind:'A place where everything changed',title:'The Crossing',copy:'The first team crossed into Mirrorland. The return path never opened. From that moment forward, discovery carried responsibility.',pos:[-640,terrainHeight(-640,-310)+34,-310],eye:[-470,145,-70],look:[-650,25,-325]},
 {id:'alaric',kind:'Someone is watching the route',title:'Alaric',copy:'He reads danger before proof arrives. Waiting until everyone agrees can mean waiting until the safe route is already gone.',pos:[-170,terrainHeight(-170,-560)+42,-560],eye:[40,122,-315],look:[-175,35,-565]},
 {id:'manor',kind:'A light farther inland',title:'Mirror Manor',copy:'The Manor stands because the crossing became permanent. Shelter is not the end of the problem; it is where preparation begins.',pos:[430,terrainHeight(430,-810)+96,-810],eye:[610,180,-515],look:[430,70,-810]},
 {id:'elara',kind:'A signal beyond the dunes',title:'Elara',copy:'She makes a possible future visible before the world believes in it. Hope has to become visible before people can move toward it.',pos:[760,terrainHeight(760,-650)+38,-650],eye:[900,135,-390],look:[760,34,-650]},
 {id:'p12',kind:'The horizon is still moving',title:'The Clock',copy:'Time will happen. Preparation is the variable. What this world becomes is not separate from what eventually happens to Earth.',pos:[900,terrainHeight(900,-1060)+58,-1060],eye:[1030,210,-720],look:[900,50,-1060]}
];
const pverts=[];DESTINATIONS.forEach((d,i)=>pverts.push(...d.pos,16,i===0||i===4?1:.45));const pvao=gl.createVertexArray();gl.bindVertexArray(pvao);const pbuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pbuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pverts),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,1,gl.FLOAT,false,20,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,20,16);

const ORBIT={eye:[0,360,580],look:[70,24,-660]};
let camera={eye:[...ORBIT.eye],look:[...ORBIT.look]},active=null,transition=null,lastVP=null;
function setStory(d){if(!d){story.classList.remove('show');return;}storyKind.textContent=d.kind;storyTitle.textContent=d.title;storyCopy.textContent=d.copy;story.classList.add('show');}
function travelTo(d){if(transition)return;active=d;setStory(null);returnButton.classList.remove('show');statusNode.textContent=`Traveling toward ${d.title}`;const start={eye:[...camera.eye],look:[...camera.look]},end={eye:d.eye,look:d.look};const dir=norm(sub(end.eye,start.eye)),side=norm(cross(dir,[0,1,0]));const lift=125,arc=85;transition={start:performance.now(),duration:2700,from:start,to:end,c1Eye:add(add(start.eye,scale(side,arc)),[0,lift,0]),c2Eye:add(add(end.eye,scale(side,-arc*.55)),[0,lift*.42,0]),returning:false};}
function returnOrbit(){if(transition)return;setStory(null);statusNode.textContent='Returning to the coast';const start={eye:[...camera.eye],look:[...camera.look]},end=ORBIT;const dir=norm(sub(end.eye,start.eye)),side=norm(cross(dir,[0,1,0]));transition={start:performance.now(),duration:2350,from:start,to:end,c1Eye:add(add(start.eye,scale(side,-70)),[0,110,0]),c2Eye:add(add(end.eye,scale(side,55)),[0,65,0]),returning:true};returnButton.classList.remove('show');}
returnButton.addEventListener('click',returnOrbit);
function updateTransition(now){if(!transition)return;let t=clamp((now-transition.start)/transition.duration,0,1),e=ease(t);camera.eye=bezier(transition.from.eye,transition.c1Eye,transition.c2Eye,transition.to.eye,e);const mid1=add(transition.from.look,[0,55,0]),mid2=add(transition.to.look,[0,28,0]);camera.look=bezier(transition.from.look,mid1,mid2,transition.to.look,e);if(t>=1){const wasReturn=transition.returning;transition=null;if(wasReturn){active=null;statusNode.textContent='Orbit · survey the coast';}else{statusNode.textContent=`Arrived · ${active.title}`;returnButton.classList.add('show');setStory(active);}}}
function resize(){const dpr=Math.min(1.65,devicePixelRatio||1),w=Math.max(1,Math.round(innerWidth*dpr)),h=Math.max(1,Math.round(innerHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);return{w,h,dpr};}
function render(now){const {w,h,dpr}=resize();updateTransition(now);const vp=mul(perspective(52*Math.PI/180,w/h,1,5000),lookAt(camera.eye,camera.look));lastVP=vp;gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.clearColor(.40,.67,.75,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(worldProgram);gl.uniformMatrix4fv(gl.getUniformLocation(worldProgram,'uVP'),false,vp);gl.uniform3fv(gl.getUniformLocation(worldProgram,'uEye'),camera.eye);gl.uniform1f(gl.getUniformLocation(worldProgram,'uTime'),now*.001);gl.uniform1i(gl.getUniformLocation(worldProgram,'uWater'),0);gl.bindVertexArray(terrain.vao);gl.drawElements(gl.TRIANGLES,terrain.count,gl.UNSIGNED_INT,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.uniform1i(gl.getUniformLocation(worldProgram,'uWater'),1);gl.bindVertexArray(water.vao);gl.drawElements(gl.TRIANGLES,water.count,gl.UNSIGNED_INT,0);gl.disable(gl.DEPTH_TEST);gl.useProgram(pointProgram);gl.uniformMatrix4fv(gl.getUniformLocation(pointProgram,'uVP'),false,vp);gl.uniform1f(gl.getUniformLocation(pointProgram,'uDpr'),dpr);gl.bindVertexArray(pvao);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.drawArrays(gl.POINTS,0,DESTINATIONS.length);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);requestAnimationFrame(render);}
canvas.addEventListener('pointerup',e=>{if(transition||!lastVP)return;const rect=canvas.getBoundingClientRect(),sx=(e.clientX-rect.left)*(canvas.width/rect.width),sy=(e.clientY-rect.top)*(canvas.height/rect.height);let best=null,bestD=64*(canvas.width/rect.width);for(const d of DESTINATIONS){const p=project(d.pos,lastVP,canvas.width,canvas.height);if(!p)continue;const dist=Math.hypot(sx-p[0],sy-p[1]);if(dist<bestD){best=d;bestD=dist;}}if(best)travelTo(best);});
canvas.addEventListener('keydown',e=>{if(e.key==='Escape'&&active&&!transition)returnOrbit();});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&active&&!transition)returnOrbit();});
requestAnimationFrame(render);
window.__CHARACTERS_COASTAL_CHECKPOINT__=Object.freeze({geography:'Gratitude coast derivative',freeLocomotion:false,cameraStates:['ORBIT','DEPART','SURVEY','TRANSIT','ARRIVAL','INSPECT','RETURN'],destinationIds:DESTINATIONS.map(d=>d.id),returnToOrbit:true});