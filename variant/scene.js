(function(){
const canvas=document.getElementById("scene");
if(!canvas)return;
const ctx=canvas.getContext("2d");
if(!ctx)return;

const DOMAIN_MAP={
N:{label:"LAWS",short:"N",fill:"rgba(198,46,46,0.34)",edge:"rgba(255,170,150,0.70)",glow:"rgba(255,120,90,0.24)"},
E:{label:"ENERGY",short:"E",fill:"rgba(214,162,58,0.34)",edge:"rgba(255,235,170,0.72)",glow:"rgba(255,220,120,0.24)"},
S:{label:"FINANCE",short:"S",fill:"rgba(86,180,176,0.30)",edge:"rgba(190,255,246,0.72)",glow:"rgba(120,255,245,0.22)"},
W:{label:"GOVERNANCE",short:"W",fill:"rgba(160,96,212,0.30)",edge:"rgba(232,210,255,0.72)",glow:"rgba(215,170,255,0.22)"},
C:{label:"CORE",short:"CORE",fill:"rgba(242,242,242,0.22)",edge:"rgba(255,255,255,0.84)",glow:"rgba(255,255,255,0.22)"}
};

const TAU=Math.PI*2;
const DRAGON_ORBIT_ROTATIONS=1.5; // 540 degrees

const state={
tick:0,
activeLayer:1,
activeDirection:null,
hoveredRegion:null,
compassReveal:0,
pointer:{x:0,y:0,down:false},
faceZones:{},
rotY:0,
rotVel:0,
isDragging:false,
lastPointerAngle:0,
hasTriggeredDragons:false,
entryPolarityHigh:true,
dragonEvent:null,
fireworks:[],
lanterns:[],
cube:null
};

function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function easeOutCubic(t){return 1-Math.pow(1-t,3);}
function easeInOutCubic(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function fract(v){return v-Math.floor(v);}
function hash(n){return fract(Math.sin(n*127.1)*43758.5453123);}
function angleBetween(a,b){return Math.atan2(b.y-a.y,b.x-a.x);}
function wrapPi(a){
while(a>Math.PI)a-=TAU;
while(a<-Math.PI)a+=TAU;
return a;
}

function roundedRectPath(x,y,w,h,r){
const rr=Math.min(r,w*0.5,h*0.5);
ctx.beginPath();
ctx.moveTo(x+rr,y);
ctx.lineTo(x+w-rr,y);
ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
ctx.lineTo(x+w,y+h-rr);
ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
ctx.lineTo(x+rr,y+h);
ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
ctx.lineTo(x,y+rr);
ctx.quadraticCurveTo(x,y,x+rr,y);
ctx.closePath();
}

function resize(){
const dpr=Math.max(1,window.devicePixelRatio||1);
const w=window.innerWidth;
const h=window.innerHeight;
canvas.style.width=w+"px";
canvas.style.height=h+"px";
canvas.width=Math.floor(w*dpr);
canvas.height=Math.floor(h*dpr);
ctx.setTransform(1,0,0,1,0,0);
ctx.scale(dpr,dpr);
initLanterns();
}
window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});

function initLanterns(){
const w=window.innerWidth||1;
const h=window.innerHeight||1;
const count=Math.max(12,Math.round(w/150));
state.lanterns=[];
for(let i=0;i<count;i++){
const seed=i+1;
state.lanterns.push({
x:hash(seed*2.17)*w,
y:h*(0.50+hash(seed*3.91)*0.36),
size:18+hash(seed*5.31)*12,
speed:0.10+hash(seed*6.17)*0.18,
sway:8+hash(seed*7.33)*18,
phase:hash(seed*8.07)*TAU,
group:i%5
});
}
}

resize();

function getPointerPos(e){
const rect=canvas.getBoundingClientRect();
return{x:e.clientX-rect.left,y:e.clientY-rect.top};
}

function getTouchPos(touch){
const rect=canvas.getBoundingClientRect();
return{x:touch.clientX-rect.left,y:touch.clientY-rect.top};
}

function pointInPoly(x,y,poly){
let inside=false;
for(let i=0,j=poly.length-1;i<poly.length;j=i++){
const xi=poly[i].x,yi=poly[i].y;
const xj=poly[j].x,yj=poly[j].y;
const hit=((yi>y)!==(yj>y))&&(x<((xj-xi)*(y-yi))/(yj-yi)+xi);
if(hit)inside=!inside;
}
return inside;
}

function spawnFirework(x,y,count,sizeBase){
const particles=[];
for(let i=0;i<count;i++){
const a=(i/count)*TAU+(hash(i+count)*0.32);
const speed=sizeBase*(0.75+hash(i*5.7)*0.65);
particles.push({
x,y,
vx:Math.cos(a)*speed,
vy:Math.sin(a)*speed,
life:48+Math.floor(hash(i*2.1)*20)
});
}
state.fireworks.push({particles,life:60,maxLife:60});
}

function spawnTransitionFireworks(){
const w=window.innerWidth;
const h=window.innerHeight;
spawnFirework(w*0.22,h*0.24,22,2.1);
spawnFirework(w*0.78,h*0.22,24,2.3);
}

function startDragonEvent(){
if(state.dragonEvent)return;
state.dragonEvent={
startTick:state.tick,
entryHigh:state.entryPolarityHigh
};
state.entryPolarityHigh=!state.entryPolarityHigh;
state.hasTriggeredDragons=true;
spawnTransitionFireworks();
}

function setLayer(n){
const next=Number(n)===2?2:1;
if(state.activeLayer!==next&&next===2)spawnTransitionFireworks();
state.activeLayer=next;
if(next!==2){
state.activeDirection=null;
state.hoveredRegion=null;
}
}

function selectDirection(dir){
state.activeDirection=dir;
if(state.activeLayer!==2){
state.activeLayer=2;
spawnTransitionFireworks();
}
const geo=state.cube;
if(geo&&geo.faceCenters[dir]){
spawnFirework(geo.faceCenters[dir].x,geo.faceCenters[dir].y,18,1.8);
}
}

window.renderEngine={
setLayer(n){
setLayer(Number(n)||1);
}
};

function sky(){
const w=window.innerWidth;
const h=window.innerHeight;
const g=ctx.createLinearGradient(0,0,0,h);
g.addColorStop(0,"#18060c");
g.addColorStop(0.18,"#340a12");
g.addColorStop(0.42,"#701715");
g.addColorStop(0.64,"#cb451f");
g.addColorStop(0.80,"#ff7c32");
g.addColorStop(1,"#41130e");
ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);

const horizonY=h*0.66;
ctx.save();
const glow=ctx.createLinearGradient(0,horizonY-120,0,horizonY+90);
glow.addColorStop(0,"rgba(255,175,88,0)");
glow.addColorStop(0.40,"rgba(255,132,52,0.30)");
glow.addColorStop(0.72,"rgba(255,96,36,0.20)");
glow.addColorStop(1,"rgba(255,96,36,0)");
ctx.fillStyle=glow;
ctx.fillRect(0,horizonY-120,w,210);
ctx.restore();
}

function moon(){
const x=window.innerWidth*0.80;
const y=window.innerHeight*0.15;
const r=Math.min(window.innerWidth,window.innerHeight)*0.074;
ctx.save();
ctx.shadowBlur=42;
ctx.shadowColor="rgba(255,224,170,0.55)";
ctx.fillStyle="rgba(255,244,215,0.94)";
ctx.beginPath();
ctx.arc(x,y,r,0,TAU);
ctx.fill();
ctx.shadowBlur=0;
ctx.globalAlpha=0.18;
ctx.fillStyle="rgba(255,230,180,0.85)";
ctx.beginPath();
ctx.arc(x,y,r*1.45,0,TAU);
ctx.fill();
ctx.globalCompositeOperation="destination-out";
ctx.globalAlpha=1;
ctx.beginPath();
ctx.arc(x+r*0.30,y-r*0.05,r*0.90,0,TAU);
ctx.fill();
ctx.restore();
}

function drawCloud(cx,cy,scale,alpha,drift){
const x=cx+Math.sin(state.tick*0.002+drift)*18;
const y=cy+Math.cos(state.tick*0.0016+drift)*4;
ctx.save();
ctx.globalAlpha=alpha;
ctx.fillStyle="rgba(255,230,215,0.14)";
ctx.beginPath();
ctx.ellipse(x-scale*0.85,y,scale*0.62,scale*0.28,0,0,TAU);
ctx.ellipse(x-scale*0.2,y-scale*0.12,scale*0.56,scale*0.30,0,0,TAU);
ctx.ellipse(x+scale*0.42,y-scale*0.03,scale*0.72,scale*0.34,0,0,TAU);
ctx.ellipse(x+scale*0.98,y+scale*0.03,scale*0.44,scale*0.23,0,0,TAU);
ctx.fill();
ctx.restore();
}

function clouds(){
const w=window.innerWidth;
const h=window.innerHeight;
drawCloud(w*0.15,h*0.18,68,0.20,0.2);
drawCloud(w*0.42,h*0.12,92,0.13,1.1);
drawCloud(w*0.72,h*0.24,82,0.18,2.4);
drawCloud(w*0.30,h*0.30,108,0.10,3.5);
drawCloud(w*0.86,h*0.30,74,0.14,4.1);
}

function lanternGlowFactor(ln){
let boost=0;
if(state.activeDirection==="W"&&ln.group===0)boost=0.32;
if(state.activeDirection==="N"&&ln.group===1)boost=0.32;
if(state.activeDirection==="C"&&ln.group===2)boost=0.22;
if(state.activeDirection==="E"&&ln.group===3)boost=0.32;
if(state.activeDirection==="S"&&ln.group===4)boost=0.32;
return 0.54+boost+state.compassReveal*0.08;
}

function lanterns(){
for(let i=0;i<state.lanterns.length;i++){
const ln=state.lanterns[i];
const driftY=(state.tick*ln.speed)%((window.innerHeight*0.76)+120);
const y=ln.y-driftY<-80?ln.y-driftY+(window.innerHeight*0.76)+140:ln.y-driftY;
const x=ln.x+Math.sin(state.tick*0.01+ln.phase)*ln.sway;
const glow=lanternGlowFactor(ln);

ctx.save();
ctx.translate(x,y);
ctx.globalAlpha=0.88;
ctx.fillStyle="rgba(120,12,18,0.88)";
roundedRectPath(-ln.size*0.42,-ln.size*0.62,ln.size*0.84,ln.size*1.10,ln.size*0.18);
ctx.fill();

ctx.strokeStyle="rgba(255,210,120,0.82)";
ctx.lineWidth=1.2;
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0,-ln.size*0.90);
ctx.lineTo(0,-ln.size*0.62);
ctx.strokeStyle="rgba(255,210,120,0.72)";
ctx.stroke();

ctx.shadowBlur=24;
ctx.shadowColor=`rgba(255,190,90,${0.26*glow})`;
ctx.fillStyle=`rgba(255,192,92,${0.26*glow})`;
roundedRectPath(-ln.size*0.22,-ln.size*0.36,ln.size*0.44,ln.size*0.62,ln.size*0.10);
ctx.fill();
ctx.restore();
}
}

function water(){
const h=window.innerHeight;
const w=window.innerWidth;
const horizon=h*0.66;
const base=h*0.79;
const dir=state.activeDirection;
const reveal=state.compassReveal;
const calmAmp=4;
const activeAmp=10;
const amp=lerp(calmAmp,activeAmp,reveal*(dir?1:0));
const tilt=
dir==="W"?-10:
dir==="E"?10:
dir==="N"?-5:
dir==="S"?7:0;
const drift=
dir==="W"?-0.03:
dir==="E"?0.03:
0;

ctx.save();
const g=ctx.createLinearGradient(0,horizon-26,0,h);
g.addColorStop(0,"rgba(52,18,20,0.58)");
g.addColorStop(0.20,"rgba(34,12,18,0.86)");
g.addColorStop(0.55,"rgba(16,8,14,0.96)");
g.addColorStop(1,"rgba(6,4,8,1)");
ctx.fillStyle=g;
ctx.fillRect(0,horizon-26,w,h-(horizon-26));
ctx.restore();

for(let i=0;i<10;i++){
ctx.beginPath();
for(let x=0;x<=w;x+=10){
const wave1=Math.sin((x+state.tick*(1+drift))*0.018+i*0.82)*amp;
const wave2=Math.sin((x-state.tick*0.65)*0.008+i*1.12)*amp*0.45;
const slope=(x/w-0.5)*tilt;
const y=base+i*16+wave1+wave2+slope;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,142,96,${0.022+i*0.012})`;
ctx.lineWidth=2;
ctx.stroke();
}

ctx.save();
ctx.globalAlpha=0.12;
const shimmer=ctx.createLinearGradient(0,horizon,w,base+180);
shimmer.addColorStop(0,"rgba(255,118,72,0)");
shimmer.addColorStop(0.5,"rgba(255,136,88,0.40)");
shimmer.addColorStop(1,"rgba(255,118,72,0)");
ctx.fillStyle=shimmer;
ctx.fillRect(0,horizon-6,w,220);
ctx.restore();
}

function project(x,y,z){
const scale=420/(420+z);
return{
x:window.innerWidth/2+x*scale,
y:window.innerHeight*0.60+y*scale,
scale
};
}

function rotateVertex(x,y,z,rotY,tiltX){
const cy=Math.cos(rotY),sy=Math.sin(rotY);
const cx=Math.cos(tiltX),sx=Math.sin(tiltX);
const x1=x*cy-z*sy;
const z1=x*sy+z*cy;
const y2=y*cx-z1*sx;
const z2=y*sx+z1*cx;
return{x:x1,y:y2,z:z2};
}

function polyCenter(poly){
let x=0,y=0;
for(let i=0;i<poly.length;i++){
x+=poly[i].x;
y+=poly[i].y;
}
return{x:x/poly.length,y:y/poly.length};
}

function getCubeGeometry(){
const size=Math.min(window.innerWidth,window.innerHeight)*0.16;
const tiltX=-1.08;
const verts=[
[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];
const edges=[
[0,1],[1,2],[2,3],[3,0],
[4,5],[5,6],[6,7],[7,4],
[0,4],[1,5],[2,6],[3,7]
];
const faces3D={
BACK:[0,1,2,3],
FRONT:[4,5,6,7],
LEFT:[0,3,7,4],
RIGHT:[1,2,6,5],
TOP:[3,2,6,7],
BOTTOM:[0,1,5,4]
};

const rotated=[];
const pts=[];

for(const v of verts){
const p=rotateVertex(v[0]*size,v[1]*size,v[2]*size,state.rotY,tiltX);
rotated.push(p);
pts.push(project(p.x,p.y,p.z));
}

const faces2D={
C:[pts[4],pts[5],pts[6],pts[7]],
W:[pts[0],pts[3],pts[7],pts[4]],
E:[pts[1],pts[2],pts[6],pts[5]],
N:[pts[3],pts[2],pts[6],pts[7]],
S:[pts[0],pts[1],pts[5],pts[4]]
};

const renderFaces=Object.entries(faces3D).map(([key,idxs])=>{
const avgZ=(rotated[idxs[0]].z+rotated[idxs[1]].z+rotated[idxs[2]].z+rotated[idxs[3]].z)/4;
return{key,idxs,avgZ};
}).sort((a,b)=>a.avgZ-b.avgZ);

const faceCenters={};
for(const k of Object.keys(faces2D))faceCenters[k]=polyCenter(faces2D[k]);

const centerX=(pts[4].x+pts[5].x+pts[6].x+pts[7].x)/4;
const centerY=(pts[4].y+pts[5].y+pts[6].y+pts[7].y)/4;

return{
pts,
rotated,
edges,
faces:faces2D,
renderFaces,
faceCenters,
centerX,
centerY,
size,
tiltX
};
}

function faceFillFor(key){
if(key==="FRONT")return "rgba(139,0,0,0.22)";
if(key==="TOP")return "rgba(176,24,24,0.18)";
if(key==="RIGHT"||key==="LEFT")return "rgba(120,0,0,0.15)";
if(key==="BOTTOM")return "rgba(35,0,0,0.12)";
return "rgba(70,0,0,0.10)";
}

function drawFaceGem(poly,dir,active,hover,reveal){
const spec=DOMAIN_MAP[dir];
ctx.save();
ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);
for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i].x,poly[i].y);
ctx.closePath();
ctx.fillStyle=spec.fill;
ctx.globalAlpha=(0.45+0.25*reveal)+(active?0.12:0)+(hover?0.06:0);
ctx.fill();

ctx.lineWidth=active?2.6:1.6;
ctx.strokeStyle=active?spec.edge:"rgba(255,215,150,0.22)";
ctx.stroke();
ctx.restore();

const c=polyCenter(poly);
ctx.save();
ctx.globalAlpha=0.88*reveal;
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillStyle="rgba(255,250,240,0.96)";
ctx.font=`700 ${dir==="C"?"10":"9"}px system-ui,Segoe UI,Roboto,sans-serif`;
ctx.fillText(DOMAIN_MAP[dir].short,c.x,c.y);
ctx.restore();
}

function drawCube(geo){
state.faceZones=geo.faces;
const reveal=easeOutCubic(state.compassReveal);

for(const face of geo.renderFaces){
const poly=face.idxs.map(i=>geo.pts[i]);
ctx.save();
ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);
for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i].x,poly[i].y);
ctx.closePath();
ctx.fillStyle=faceFillFor(face.key);
ctx.fill();
ctx.fillStyle="rgba(0,0,0,0.10)";
ctx.globalAlpha=face.avgZ<0?0.18:0.06;
ctx.fill();
ctx.restore();
}

if(reveal>0.001){
for(const dir of ["W","E","N","S","C"]){
const poly=geo.faces[dir];
if(!poly)continue;
drawFaceGem(poly,dir,state.activeDirection===dir,state.hoveredRegion===dir,reveal);
}
}

ctx.save();
ctx.shadowBlur=16;
ctx.shadowColor="rgba(255,215,0,0.24)";
for(const e of geo.edges){
const a=geo.rotated[e[0]].z+geo.rotated[e[1]].z;
ctx.beginPath();
ctx.moveTo(geo.pts[e[0]].x,geo.pts[e[0]].y);
ctx.lineTo(geo.pts[e[1]].x,geo.pts[e[1]].y);
ctx.lineWidth=2.2;
ctx.strokeStyle=a<0?"rgba(255,215,0,0.42)":"rgba(255,215,0,0.94)";
ctx.stroke();
}
ctx.restore();
}

function dragonEventProgress(){
if(!state.dragonEvent)return null;
const elapsed=state.tick-state.dragonEvent.startTick;
const duration=360;
const p=elapsed/duration;
if(p>=1){
state.dragonEvent=null;
return null;
}
return p;
}

function dragonPathPoint(geo,p,mirror,entryHigh){
const cx=geo.centerX;
const cy=geo.centerY;
const sign=mirror?1:-1;
const progress=easeInOutCubic(clamp(p,0,1));
const theta=(progress*DRAGON_ORBIT_ROTATIONS*TAU)+(mirror?0:Math.PI);

const rX=geo.size*2.85;
const rY=geo.size*1.40;
const baseX=cx+Math.cos(theta)*rX;
const baseY=cy+Math.sin(theta)*rY*0.58;

const highY=cy-geo.size*1.60;
const lowY=cy+geo.size*1.60;
const startY=entryHigh?highY:lowY;
const endY=entryHigh?lowY:highY;
const gateMix=Math.sin(progress*Math.PI);
const guidedY=lerp(startY,endY,progress);
const y=lerp(guidedY,baseY,gateMix)+Math.sin(progress*TAU*2.0+sign)*geo.size*0.06;

const enterX=mirror?(cx+rX+geo.size*2.1):(cx-rX-geo.size*2.1);
const exitX=mirror?(cx-rX-geo.size*2.1):(cx+rX+geo.size*2.1);
let x;
if(progress<0.14){
x=lerp(enterX,baseX,progress/0.14);
}else if(progress>0.86){
x=lerp(baseX,exitX,(progress-0.86)/0.14);
}else{
x=baseX;
}

const orbitZ=Math.sin(theta+sign*0.55)*1.18;
const z=progress<0.14?lerp(-0.25,orbitZ,progress/0.14):progress>0.86?lerp(orbitZ,0.25,(progress-0.86)/0.14):orbitZ;

return{x,y,z,theta};
}

function buildDragonBody(geo,mirror,entryHigh){
const p=dragonEventProgress();
if(p===null)return null;
const segments=[];
const count=44;
for(let i=0;i<count;i++){
const lag=i*0.0095;
const pp=clamp(p-lag,0,1);
const head=dragonPathPoint(geo,pp,mirror,entryHigh);
const ripple=Math.sin((p*TAU*4.0)+(i*0.40)+(mirror?0:Math.PI))*geo.size*0.020;
const rippleY=Math.cos((p*TAU*2.2)+(i*0.31)+(mirror?0:Math.PI))*geo.size*0.012;
const nx=-Math.sin(head.theta);
const ny=Math.cos(head.theta)*0.28;
segments.push({
x:head.x+nx*ripple,
y:head.y+ny*ripple+rippleY,
z:head.z
});
}
return segments;
}

function drawScalePatch(x,y,a,sx,sy,color,alpha){
ctx.save();
ctx.translate(x,y);
ctx.rotate(a);
ctx.globalAlpha=alpha;
ctx.fillStyle=color;
ctx.beginPath();
ctx.moveTo(-sx,0);
ctx.quadraticCurveTo(0,-sy,sx,0);
ctx.quadraticCurveTo(0,sy,-sx,0);
ctx.closePath();
ctx.fill();
ctx.restore();
}

function drawWhisker(x,y,angle,len,dir,alpha){
ctx.save();
ctx.translate(x,y);
ctx.rotate(angle+dir*0.34);
ctx.globalAlpha=alpha;
ctx.strokeStyle="rgba(255,238,205,0.74)";
ctx.lineWidth=1.8;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.quadraticCurveTo(len*0.18,dir*len*0.10,len*0.60,dir*len*0.20);
ctx.quadraticCurveTo(len*0.82,dir*len*0.26,len,dir*len*0.38);
ctx.stroke();
ctx.restore();
}

function drawDragonHead(head,next,baseFill,glowColor,accentFill){
const a=angleBetween(head,next);
ctx.save();
ctx.translate(head.x,head.y);
ctx.rotate(a);
ctx.shadowBlur=18;
ctx.shadowColor=glowColor;
ctx.fillStyle=baseFill;
ctx.beginPath();
ctx.moveTo(30,0);
ctx.lineTo(12,-14);
ctx.lineTo(-8,-16);
ctx.lineTo(-22,-10);
ctx.lineTo(-30,0);
ctx.lineTo(-22,10);
ctx.lineTo(-8,16);
ctx.lineTo(12,14);
ctx.closePath();
ctx.fill();

ctx.fillStyle=accentFill;
ctx.beginPath();
ctx.moveTo(12,-5);
ctx.lineTo(22,0);
ctx.lineTo(12,5);
ctx.lineTo(-1,4);
ctx.lineTo(-1,-4);
ctx.closePath();
ctx.fill();

ctx.fillStyle="rgba(255,246,218,0.96)";
ctx.beginPath();
ctx.arc(5,-5.2,2.2,0,TAU);
ctx.fill();

ctx.fillStyle="rgba(255,220,140,0.88)";
ctx.beginPath();
ctx.moveTo(-7,-11);
ctx.lineTo(-18,-22);
ctx.lineTo(-11,-9);
ctx.closePath();
ctx.fill();
ctx.beginPath();
ctx.moveTo(-7,11);
ctx.lineTo(-18,22);
ctx.lineTo(-11,9);
ctx.closePath();
ctx.fill();

ctx.beginPath();
ctx.moveTo(-15,-8);
ctx.lineTo(-26,-17);
ctx.lineTo(-19,-5);
ctx.closePath();
ctx.fill();
ctx.beginPath();
ctx.moveTo(-15,8);
ctx.lineTo(-26,17);
ctx.lineTo(-19,5);
ctx.closePath();
ctx.fill();
ctx.restore();

drawWhisker(head.x+2,head.y+2,a,42,1,0.76);
drawWhisker(head.x+2,head.y-2,a,42,-1,0.76);
}

function drawDragonHair(points,glowColor){
if(points.length<6)return;
const head=points[0];
const neck=points[4];
const a=angleBetween(head,neck);
for(let i=0;i<5;i++){
const len=26+i*8;
const offset=i*2.6;
ctx.save();
ctx.translate(head.x-4-offset,head.y);
ctx.rotate(a+Math.PI);
ctx.globalAlpha=0.20+(i*0.04);
ctx.strokeStyle=glowColor;
ctx.lineWidth=1.5;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.quadraticCurveTo(-len*0.20,-len*0.18,-len*0.70,-len*0.12);
ctx.quadraticCurveTo(-len,-len*0.04,-len*1.08,len*0.06);
ctx.stroke();
ctx.restore();
}
}

function drawDragonHalf(points,baseFill,glowColor,accent,front){
if(!points||points.length<6)return;

for(let i=points.length-1;i>=1;i--){
const p=points[i];
if(front?(p.z<0):(p.z>=0))continue;
const prev=points[Math.max(0,i-1)];
const next=points[Math.min(points.length-1,i+1)];
const t=i/(points.length-1);
const depthScale=lerp(1.18,0.84,(p.z+1)/2);
const r=lerp(34,5.8,t)*depthScale;
const a=angleBetween(prev,next);

ctx.save();
ctx.globalAlpha=(0.94-(t*0.22))*clamp(1+p.z*0.16,0.72,1.26);
ctx.shadowBlur=16*(1+p.z*0.10);
ctx.shadowColor=glowColor;
ctx.fillStyle=baseFill;
ctx.translate(p.x,p.y);
ctx.rotate(a);
ctx.beginPath();
ctx.ellipse(0,0,r*1.16,r,0,0,TAU);
ctx.fill();
ctx.restore();

drawScalePatch(p.x,p.y-r*0.10,a,r*0.48,r*0.24,accent,0.34);
drawScalePatch(p.x-r*0.22,p.y+r*0.06,a,r*0.32,r*0.18,"rgba(255,250,228,0.22)",0.22);
}

for(let i=3;i<points.length-2;i+=2){
const p=points[i];
if(front?(p.z<0):(p.z>=0))continue;
const prev=points[i-1];
const next=points[i+1];
const a=angleBetween(prev,next);
const t=i/(points.length-1);
const fin=lerp(12,2.4,t)*(1+p.z*0.10);
ctx.save();
ctx.translate(p.x,p.y);
ctx.rotate(a);
ctx.globalAlpha=0.22*(1-t);
ctx.fillStyle="rgba(255,236,190,0.42)";
ctx.beginPath();
ctx.moveTo(-fin*0.30,0);
ctx.lineTo(0,-fin);
ctx.lineTo(fin*0.36,0);
ctx.closePath();
ctx.fill();
ctx.restore();
}

if(front){
drawDragonHair(points,glowColor);
drawDragonHead(points[0],points[3],baseFill,glowColor,accent);
}
}

function dragonsBack(geo){
if(!state.dragonEvent)return;
const entryHigh=state.dragonEvent.entryHigh;
const fear=buildDragonBody(geo,false,entryHigh);
const love=buildDragonBody(geo,true,!entryHigh);
drawDragonHalf(fear,"rgba(128,18,18,0.92)","rgba(210,62,40,0.52)","rgba(255,132,72,0.72)",false);
drawDragonHalf(love,"rgba(186,132,30,0.92)","rgba(255,210,110,0.50)","rgba(255,244,188,0.76)",false);
}

function dragonsFront(geo){
if(!state.dragonEvent)return;
const entryHigh=state.dragonEvent.entryHigh;
const fear=buildDragonBody(geo,false,entryHigh);
const love=buildDragonBody(geo,true,!entryHigh);
drawDragonHalf(fear,"rgba(128,18,18,0.92)","rgba(210,62,40,0.52)","rgba(255,132,72,0.72)",true);
drawDragonHalf(love,"rgba(186,132,30,0.92)","rgba(255,210,110,0.50)","rgba(255,244,188,0.76)",true);
}

function fireworks(){
for(let f=state.fireworks.length-1;f>=0;f--){
const burst=state.fireworks[f];
burst.life--;
for(let i=burst.particles.length-1;i>=0;i--){
const p=burst.particles[i];
p.x+=p.vx;
p.y+=p.vy;
p.vx*=0.985;
p.vy*=0.985;
p.vy+=0.012;
p.life--;
if(p.life<=0)burst.particles.splice(i,1);
}
if(burst.life<=0||burst.particles.length===0){
state.fireworks.splice(f,1);
continue;
}
const alpha=burst.life/burst.maxLife;
for(let i=0;i<burst.particles.length;i++){
const p=burst.particles[i];
ctx.save();
ctx.globalAlpha=alpha*0.9;
ctx.fillStyle=i%3===0?"rgba(255,215,120,0.95)":(i%3===1?"rgba(255,82,82,0.92)":"rgba(255,245,225,0.92)");
ctx.shadowBlur=10;
ctx.shadowColor=ctx.fillStyle;
ctx.beginPath();
ctx.arc(p.x,p.y,1.8,0,TAU);
ctx.fill();
ctx.restore();
}
}
}

function drawSceneFrame(){
ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
sky();
moon();
clouds();
lanterns();
water();

const geo=getCubeGeometry();
state.cube=geo;

dragonsBack(geo);
drawCube(geo);
dragonsFront(geo);
fireworks();
}

function getRegionAt(x,y){
for(const key of ["C","W","E","N","S"]){
const poly=state.faceZones[key];
if(poly&&pointInPoly(x,y,poly))return key;
}
return null;
}

function updateInteractionFromPoint(x,y){
state.hoveredRegion=getRegionAt(x,y);
}

function pointerAngleFromCenter(x,y){
const geo=state.cube;
if(!geo)return 0;
return Math.atan2(y-geo.centerY,x-geo.centerX);
}

function engageDial(x,y){
state.isDragging=true;
state.lastPointerAngle=pointerAngleFromCenter(x,y);
if(state.activeLayer!==2)setLayer(2);
if(!state.hasTriggeredDragons)startDragonEvent();
}

function moveDial(x,y){
if(!state.isDragging)return;
const a=pointerAngleFromCenter(x,y);
let delta=wrapPi(a-state.lastPointerAngle);
state.lastPointerAngle=a;
state.rotVel+=delta*0.32;
}

function releaseDial(){
state.isDragging=false;
}

function activateAtPoint(x,y){
updateInteractionFromPoint(x,y);
const hit=getRegionAt(x,y);
if(hit){
selectDirection(hit);
}
}

canvas.addEventListener("pointermove",e=>{
const p=getPointerPos(e);
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
moveDial(p.x,p.y);
},{passive:true});

canvas.addEventListener("pointerdown",e=>{
const p=getPointerPos(e);
state.pointer.down=true;
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
const hit=getRegionAt(p.x,p.y);
if(hit)engageDial(p.x,p.y);
});

canvas.addEventListener("pointerup",e=>{
const p=getPointerPos(e);
state.pointer.down=false;
state.pointer.x=p.x;
state.pointer.y=p.y;
if(state.isDragging){
releaseDial();
activateAtPoint(p.x,p.y);
}else{
activateAtPoint(p.x,p.y);
}
});

canvas.addEventListener("touchstart",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.down=true;
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
const hit=getRegionAt(p.x,p.y);
if(hit)engageDial(p.x,p.y);
},{passive:true});

canvas.addEventListener("touchmove",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
moveDial(p.x,p.y);
},{passive:true});

canvas.addEventListener("touchend",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.down=false;
state.pointer.x=p.x;
state.pointer.y=p.y;
if(state.isDragging){
releaseDial();
activateAtPoint(p.x,p.y);
}else{
activateAtPoint(p.x,p.y);
}
e.preventDefault();
},{passive:false});

canvas.addEventListener("pointerleave",()=>{
state.pointer.down=false;
state.hoveredRegion=null;
releaseDial();
});

function animateState(){
state.tick++;
state.rotY+=state.rotVel;
state.rotVel*=state.isDragging?0.88:0.94;
state.rotVel=clamp(state.rotVel,-0.08,0.08);
if(!state.isDragging)state.rotY+=state.activeLayer===1?0.0016:0.0008;

const targetReveal=state.activeLayer===2?1:0;
state.compassReveal=lerp(state.compassReveal,targetReveal,0.08);

if(state.activeLayer===2&&state.tick%320===0){
spawnFirework(
window.innerWidth*(0.24+hash(state.tick)*0.52),
window.innerHeight*(0.18+hash(state.tick*0.3)*0.20),
16,
1.7
);
}
}

function frame(){
animateState();
drawSceneFrame();
requestAnimationFrame(frame);
}

frame();
})();
