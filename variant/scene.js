(function(){
const canvas=document.getElementById("scene");
if(!canvas)return;
const ctx=canvas.getContext("2d");
if(!ctx)return;

const DOMAIN_MAP={
N:{label:"LAWS",short:"N"},
E:{label:"ENERGY",short:"E"},
S:{label:"FINANCE",short:"S"},
W:{label:"GOVERNANCE",short:"W"},
C:{label:"CORE",short:"CORE"}
};

const TAU=Math.PI*2;

const state={
tick:0,
activeLayer:1,
activeDirection:null,
hoveredRegion:null,
compassReveal:0,
pointer:{x:0,y:0,down:false},
faceZones:{},
compassZones:{},
rotY:0,
fireworks:[],
dragonClock:0,
lanterns:[]
};

function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function easeOutCubic(t){return 1-Math.pow(1-t,3);}
function fract(v){return v-Math.floor(v);}
function hash(n){return fract(Math.sin(n*127.1)*43758.5453123);}
function rgba(r,g,b,a){return `rgba(${r},${g},${b},${a})`;}

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
const count=Math.max(10,Math.round(w/140));
state.lanterns=[];
for(let i=0;i<count;i++){
const seed=i+1;
state.lanterns.push({
x:hash(seed*2.17)*w,
y:h*(0.55+hash(seed*3.91)*0.34),
size:18+hash(seed*5.31)*12,
speed:0.12+hash(seed*6.17)*0.24,
sway:8+hash(seed*7.33)*16,
phase:hash(seed*8.07)*TAU,
group:i%4
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

function diamondContains(x,y,node){
return (Math.abs(x-node.x)/node.hw)+(Math.abs(y-node.y)/node.hh)<=1;
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

function spawnDirectionFirework(dir){
const w=window.innerWidth;
const h=window.innerHeight;
const pos={
N:{x:w*0.5,y:h*0.20},
E:{x:w*0.82,y:h*0.42},
S:{x:w*0.5,y:h*0.72},
W:{x:w*0.18,y:h*0.44},
C:{x:w*0.5,y:h*0.42}
}[dir]||{x:w*0.5,y:h*0.3};
spawnFirework(pos.x,pos.y,18,1.9);
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
spawnDirectionFirework(dir);
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
g.addColorStop(0,"#19060b");
g.addColorStop(0.20,"#3b0912");
g.addColorStop(0.46,"#7a1b16");
g.addColorStop(0.68,"#d14b20");
g.addColorStop(0.82,"#ff7a2d");
g.addColorStop(1,"#45110d");
ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);

const horizonY=h*0.69;
ctx.save();
const glow=ctx.createLinearGradient(0,horizonY-90,0,horizonY+50);
glow.addColorStop(0,"rgba(255,180,90,0)");
glow.addColorStop(0.45,"rgba(255,136,52,0.28)");
glow.addColorStop(0.75,"rgba(255,96,36,0.18)");
glow.addColorStop(1,"rgba(255,96,36,0)");
ctx.fillStyle=glow;
ctx.fillRect(0,horizonY-90,w,140);
ctx.restore();

ctx.save();
ctx.globalAlpha=0.18;
ctx.strokeStyle="rgba(255,170,90,0.32)";
ctx.lineWidth=1.4;
ctx.beginPath();
ctx.moveTo(0,horizonY);
ctx.lineTo(w,horizonY);
ctx.stroke();
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
if(state.activeDirection==="W"&&ln.group===0)boost=0.36;
if(state.activeDirection==="N"&&ln.group===1)boost=0.36;
if(state.activeDirection==="E"&&ln.group===2)boost=0.36;
if(state.activeDirection==="S"&&ln.group===3)boost=0.36;
if(state.activeDirection==="C")boost=0.22;
return 0.56+boost+state.compassReveal*0.08;
}

function lanterns(){
for(let i=0;i<state.lanterns.length;i++){
const ln=state.lanterns[i];
const driftY=(state.tick*ln.speed)%((window.innerHeight*0.72)+120);
const y=ln.y-driftY<-80?ln.y-driftY+(window.innerHeight*0.72)+140:ln.y-driftY;
const x=ln.x+Math.sin(state.tick*0.01+ln.phase)*ln.sway;
const glow=lanternGlowFactor(ln);

ctx.save();
ctx.translate(x,y);
ctx.globalAlpha=0.9;
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
ctx.shadowColor=`rgba(255,190,90,${0.28*glow})`;
ctx.fillStyle=`rgba(255,192,92,${0.28*glow})`;
roundedRectPath(-ln.size*0.22,-ln.size*0.36,ln.size*0.44,ln.size*0.62,ln.size*0.10);
ctx.fill();
ctx.restore();
}
}

function water(){
const h=window.innerHeight;
const w=window.innerWidth;
const horizon=h*0.69;
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
const g=ctx.createLinearGradient(0,horizon,0,h);
g.addColorStop(0,"rgba(35,10,14,0.90)");
g.addColorStop(0.36,"rgba(20,8,12,0.95)");
g.addColorStop(1,"rgba(8,3,5,1)");
ctx.fillStyle=g;
ctx.fillRect(0,horizon,w,h-horizon);
ctx.restore();

for(let i=0;i<9;i++){
ctx.beginPath();
for(let x=0;x<=w;x+=10){
const wave1=Math.sin((x+state.tick*(1+drift))*0.018+i*0.82)*amp;
const wave2=Math.sin((x-state.tick*0.65)*0.008+i*1.12)*amp*0.45;
const slope=(x/w-0.5)*tilt;
const y=base+i*18+wave1+wave2+slope;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,160,112,${0.03+i*0.014})`;
ctx.lineWidth=2;
ctx.stroke();
}

ctx.save();
ctx.globalAlpha=0.12;
const shimmer=ctx.createLinearGradient(0,base-12,w,base+180);
shimmer.addColorStop(0,"rgba(255,120,72,0)");
shimmer.addColorStop(0.5,"rgba(255,132,84,0.42)");
shimmer.addColorStop(1,"rgba(255,120,72,0)");
ctx.fillStyle=shimmer;
ctx.fillRect(0,base-12,w,180);
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
N:[pts[3],pts[2],pts[6],pts[7]]
};

const renderFaces=Object.entries(faces3D).map(([key,idxs])=>{
const avgZ=(rotated[idxs[0]].z+rotated[idxs[1]].z+rotated[idxs[2]].z+rotated[idxs[3]].z)/4;
return{key,idxs,avgZ};
}).sort((a,b)=>a.avgZ-b.avgZ);

const centerX=(pts[4].x+pts[5].x+pts[6].x+pts[7].x)/4;
const centerY=(pts[4].y+pts[5].y+pts[6].y+pts[7].y)/4;

return{
pts,
rotated,
edges,
faces:faces2D,
renderFaces,
centerX,
centerY,
size
};
}

function faceFillFor(key){
if(key==="FRONT")return "rgba(139,0,0,0.24)";
if(key==="TOP")return "rgba(176,24,24,0.22)";
if(key==="RIGHT"||key==="LEFT")return "rgba(120,0,0,0.19)";
if(key==="BOTTOM")return "rgba(35,0,0,0.16)";
return "rgba(70,0,0,0.14)";
}

function drawCube(geo){
state.faceZones=geo.faces;
const hovered=state.hoveredRegion;
const selected=state.activeDirection;

for(const face of geo.renderFaces){
const poly=face.idxs.map(i=>geo.pts[i]);
ctx.save();
ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);
for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i].x,poly[i].y);
ctx.closePath();
ctx.fillStyle=faceFillFor(face.key);
ctx.fill();
ctx.fillStyle="rgba(0,0,0,0.16)";
ctx.globalAlpha=face.avgZ<0?0.24:0.08;
ctx.fill();
ctx.restore();
}

for(const key of ["W","E","N","C"]){
const poly=geo.faces[key];
const isHot=hovered===key||selected===key||(selected==="C"&&key==="C");
ctx.save();
ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);
for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i].x,poly[i].y);
ctx.closePath();
ctx.fillStyle=isHot?"rgba(255,215,0,0.08)":"rgba(255,255,255,0)";
ctx.fill();
ctx.restore();
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

function drawCompass(geo){
const reveal=easeOutCubic(state.compassReveal);
if(reveal<=0.001){
state.compassZones={};
return;
}

const cx=geo.centerX;
const cy=geo.centerY;
const radius=geo.size*1.18;
const outer=radius+28*reveal;
const inner=radius-24*reveal;

ctx.save();
ctx.globalAlpha=0.14*reveal;
for(let i=0;i<3;i++){
ctx.beginPath();
ctx.arc(cx,cy,outer+i*24,0,TAU);
ctx.strokeStyle="rgba(255,235,200,0.20)";
ctx.lineWidth=2;
ctx.stroke();
}
for(let i=0;i<20;i++){
const a=(i/20)*TAU;
ctx.beginPath();
ctx.moveTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner);
ctx.lineTo(cx+Math.cos(a)*(outer+38),cy+Math.sin(a)*(outer+38));
ctx.strokeStyle="rgba(255,235,200,0.08)";
ctx.lineWidth=1;
ctx.stroke();
}
ctx.restore();

const nodeDist=radius+16;
const nodes={
N:{x:cx,y:cy-nodeDist},
E:{x:cx+nodeDist,y:cy},
S:{x:cx,y:cy+nodeDist},
W:{x:cx-nodeDist,y:cy},
C:{x:cx,y:cy}
};
state.compassZones={};

for(const key of ["N","W","C","E","S"]){
const node=nodes[key];
const hw=key==="C"?geo.size*0.32:geo.size*0.19;
const hh=key==="C"?geo.size*0.32:geo.size*0.19;
state.compassZones[key]={x:node.x,y:node.y,hw,hh};
const active=state.activeDirection===key;
const hover=state.hoveredRegion===key;
const alpha=key==="C"?0.82:0.72;

ctx.save();
ctx.globalAlpha=alpha*reveal;
ctx.translate(node.x,node.y);
ctx.rotate(Math.PI/4);
ctx.fillStyle=active?"rgba(20,20,30,0.96)":hover?"rgba(32,26,26,0.93)":"rgba(18,18,26,0.86)";
ctx.strokeStyle=active?"rgba(255,245,220,0.82)":hover?"rgba(255,245,220,0.58)":"rgba(255,255,255,0.26)";
ctx.lineWidth=active?2.4:1.5;
roundedRectPath(-hw,-hh,hw*2,hh*2,18);
ctx.fill();
ctx.stroke();
ctx.restore();

ctx.save();
ctx.globalAlpha=reveal;
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillStyle="rgba(255,255,255,0.96)";
ctx.font=`${key==="C"?"700":"800"} ${key==="C"?15:13}px system-ui,Segoe UI,Roboto,sans-serif`;
ctx.fillText(DOMAIN_MAP[key].label,node.x,node.y-(key==="C"?7:4));
ctx.font=`700 ${key==="C"?11:10}px system-ui,Segoe UI,Roboto,sans-serif`;
ctx.fillStyle="rgba(240,240,240,0.92)";
ctx.fillText(DOMAIN_MAP[key].short,node.x,node.y+(key==="C"?13:14));
ctx.restore();
}
}

function buildDragonPoints(mirror){
const w=window.innerWidth;
const h=window.innerHeight;
const cx=w*0.5;
const cy=h*0.48;
const dir=mirror?-1:1;
const cycle=1080;
const t=(state.dragonClock%cycle)/cycle;

let phase,u;
if(t<0.20){
phase="enter";
u=t/0.20;
}else if(t<0.58){
phase="orbit";
u=(t-0.20)/0.38;
}else if(t<0.78){
phase="exit";
u=(t-0.58)/0.20;
}else{
phase="pause";
u=(t-0.78)/0.22;
}

if(phase==="pause")return[];

const pts=[];
for(let i=0;i<30;i++){
const segT=i/29;
const lag=segT*0.22;
let x,y;
if(phase==="enter"){
const startX=mirror?w+260:-260;
const startY=cy+(mirror?-22:22);
const endAngle=mirror?0:Math.PI;
const targetX=cx+Math.cos(endAngle)*190;
const targetY=cy+Math.sin(endAngle)*58;
const uu=clamp(u-lag,0,1);
x=lerp(startX,targetX,uu)+(-dir*i*6);
y=lerp(startY,targetY,uu)+Math.sin(i*0.44+state.tick*0.035*dir)*6;
}else if(phase==="orbit"){
const uu=clamp(u-lag*0.55,0,1);
const angle=(mirror?0:Math.PI)+(mirror?1:-1)*uu*TAU;
x=cx+Math.cos(angle)*190+(-dir*i*5);
y=cy+Math.sin(angle)*58+Math.sin(i*0.40+uu*TAU)*6;
}else{
const startAngle=mirror?Math.PI:0;
const startX=cx+Math.cos(startAngle)*190;
const startY=cy+Math.sin(startAngle)*58;
const endX=mirror?-260:w+260;
const endY=cy+(mirror?24:-24);
const uu=clamp(u-lag,0,1);
x=lerp(startX,endX,uu)+(-dir*i*6);
y=lerp(startY,endY,uu)+Math.sin(i*0.44+state.tick*0.035*dir)*6;
}
pts.push({x,y});
}
return pts;
}

function drawSegmentedDragon(points,baseFill,glowColor,accent){
if(!points.length)return;

for(let i=points.length-1;i>=0;i--){
const p=points[i];
const t=i/(points.length-1);
const r=lerp(9.5,2.4,t);

ctx.save();
ctx.globalAlpha=0.92-(t*0.30);
ctx.shadowBlur=12;
ctx.shadowColor=glowColor;
ctx.fillStyle=baseFill;
ctx.beginPath();
ctx.ellipse(p.x,p.y,r*1.18,r,0,0,TAU);
ctx.fill();
ctx.restore();

ctx.save();
ctx.globalAlpha=0.55-(t*0.18);
ctx.fillStyle=accent;
ctx.beginPath();
ctx.arc(p.x,p.y,r*0.34,0,TAU);
ctx.fill();
ctx.restore();
}

const head=points[0];
ctx.save();
ctx.shadowBlur=16;
ctx.shadowColor=glowColor;
ctx.fillStyle=baseFill;
ctx.beginPath();
ctx.ellipse(head.x,head.y,12,9,0,0,TAU);
ctx.fill();
ctx.restore();
}

function dragons(){
drawSegmentedDragon(
buildDragonPoints(false),
"rgba(132,18,18,0.88)",
"rgba(210,62,40,0.48)",
"rgba(255,132,72,0.72)"
);
drawSegmentedDragon(
buildDragonPoints(true),
"rgba(186,132,30,0.88)",
"rgba(255,210,110,0.44)",
"rgba(255,244,188,0.72)"
);
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
drawCube(geo);
dragons();
drawCompass(geo);
fireworks();
}

function getRegionAt(x,y){
if(state.activeLayer===2){
for(const key of ["N","E","S","W","C"]){
const node=state.compassZones[key];
if(node&&diamondContains(x,y,node))return key;
}
}
for(const key of ["C","W","E","N"]){
const poly=state.faceZones[key];
if(poly&&pointInPoly(x,y,poly))return key;
}
return null;
}

function routeRegion(region){
if(region==="C"){
if(state.activeLayer===1){
setLayer(2);
return;
}
selectDirection("C");
return;
}
if(region==="W"||region==="E"||region==="N"){
selectDirection(region);
return;
}
if(region==="S"){
selectDirection("S");
}
}

function updateInteractionFromPoint(x,y){
state.hoveredRegion=getRegionAt(x,y);
}

function activateAtPoint(x,y){
updateInteractionFromPoint(x,y);
const hit=getRegionAt(x,y);
if(hit)routeRegion(hit);
}

canvas.addEventListener("pointermove",e=>{
const p=getPointerPos(e);
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
},{passive:true});

canvas.addEventListener("pointerdown",e=>{
const p=getPointerPos(e);
state.pointer.down=true;
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
});

canvas.addEventListener("pointerup",e=>{
const p=getPointerPos(e);
state.pointer.down=false;
state.pointer.x=p.x;
state.pointer.y=p.y;
activateAtPoint(p.x,p.y);
});

canvas.addEventListener("touchstart",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.down=true;
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
},{passive:true});

canvas.addEventListener("touchend",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.down=false;
state.pointer.x=p.x;
state.pointer.y=p.y;
activateAtPoint(p.x,p.y);
e.preventDefault();
},{passive:false});

canvas.addEventListener("pointerleave",()=>{
state.pointer.down=false;
state.hoveredRegion=null;
});

function animateState(){
state.tick++;
state.dragonClock++;
state.rotY+=state.activeLayer===1?0.0030:0.0026;
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
