(function(){
const canvas=document.getElementById("scene");
if(!canvas)return;
const ctx=canvas.getContext("2d");
if(!ctx)return;

const DOMAIN_MAP={
N:{label:"LAWS",short:"N",fill:"rgba(198,46,46,0.96)",glow:"rgba(255,120,90,0.42)"},
E:{label:"ENERGY",short:"E",fill:"rgba(214,162,58,0.96)",glow:"rgba(255,220,120,0.40)"},
S:{label:"FINANCE",short:"S",fill:"rgba(86,180,176,0.96)",glow:"rgba(120,255,245,0.34)"},
W:{label:"GOVERNANCE",short:"W",fill:"rgba(160,96,212,0.96)",glow:"rgba(215,170,255,0.34)"},
C:{label:"CORE",short:"CORE",fill:"rgba(242,242,242,0.98)",glow:"rgba(255,255,255,0.38)"}
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
gemZones:{},
rotY:0,
fireworks:[],
dragonClock:0,
lanterns:[],
cube:null
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
const count=Math.max(10,Math.round(w/150));
state.lanterns=[];
for(let i=0;i<count;i++){
const seed=i+1;
state.lanterns.push({
x:hash(seed*2.17)*w,
y:h*(0.52+hash(seed*3.91)*0.34),
size:18+hash(seed*5.31)*12,
speed:0.10+hash(seed*6.17)*0.20,
sway:8+hash(seed*7.33)*16,
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

function diamondContains(x,y,node){
return(Math.abs(x-node.x)/node.hw)+(Math.abs(y-node.y)/node.hh)<=1;
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
const gem=state.gemZones[dir];
if(gem){
spawnFirework(gem.x,gem.y,18,1.8);
return;
}
spawnFirework(window.innerWidth*0.5,window.innerHeight*0.4,18,1.8);
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
const glow=ctx.createLinearGradient(0,horizonY-110,0,horizonY+70);
glow.addColorStop(0,"rgba(255,175,88,0)");
glow.addColorStop(0.42,"rgba(255,132,52,0.30)");
glow.addColorStop(0.72,"rgba(255,96,36,0.20)");
glow.addColorStop(1,"rgba(255,96,36,0)");
ctx.fillStyle=glow;
ctx.fillRect(0,horizonY-110,w,180);
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
if(key==="FRONT")return "rgba(139,0,0,0.22)";
if(key==="TOP")return "rgba(176,24,24,0.18)";
if(key==="RIGHT"||key==="LEFT")return "rgba(120,0,0,0.15)";
if(key==="BOTTOM")return "rgba(35,0,0,0.12)";
return "rgba(70,0,0,0.10)";
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
ctx.fillStyle="rgba(0,0,0,0.10)";
ctx.globalAlpha=face.avgZ<0?0.18:0.06;
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
ctx.fillStyle=isHot?"rgba(255,215,0,0.06)":"rgba(255,255,255,0)";
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

function gemAnchorMap(){
return{
N:{x:0,y:0.88,z:0.34},
W:{x:-0.88,y:0,z:0.34},
C:{x:0,y:0,z:1.08},
E:{x:0.88,y:0,z:0.34},
S:{x:0,y:-0.88,z:0.34}
};
}

function drawGem(x,y,size,fill,glow,active,hover){
ctx.save();
ctx.translate(x,y);
ctx.shadowBlur=active?24:(hover?18:12);
ctx.shadowColor=glow;
ctx.fillStyle=fill;
ctx.beginPath();
ctx.moveTo(0,-size);
ctx.lineTo(size*0.78,0);
ctx.lineTo(0,size);
ctx.lineTo(-size*0.78,0);
ctx.closePath();
ctx.fill();

ctx.fillStyle="rgba(255,255,255,0.18)";
ctx.beginPath();
ctx.moveTo(0,-size*0.72);
ctx.lineTo(size*0.24,-size*0.10);
ctx.lineTo(-size*0.24,-size*0.10);
ctx.closePath();
ctx.fill();

ctx.lineWidth=active?2.2:1.4;
ctx.strokeStyle=active?"rgba(255,250,238,0.96)":"rgba(255,245,225,0.70)";
ctx.stroke();
ctx.restore();
}

function drawEmbeddedGems(geo){
const reveal=easeOutCubic(state.compassReveal);
state.gemZones={};
if(reveal<=0.001)return;

const anchors=gemAnchorMap();
for(const key of ["N","W","C","E","S"]){
const a=anchors[key];
const size=geo.size*0.14*(key==="C"?1.10:0.92);
const p=rotateVertex(a.x*geo.size,a.y*geo.size,a.z*geo.size,state.rotY,-1.08);
const proj=project(p.x,p.y,p.z);
const active=state.activeDirection===key;
const hover=state.hoveredRegion===key;
const gemSize=size*proj.scale*reveal;

state.gemZones[key]={
x:proj.x,
y:proj.y,
hw:gemSize*0.92,
hh:gemSize*1.02
};

drawGem(proj.x,proj.y,gemSize,DOMAIN_MAP[key].fill,DOMAIN_MAP[key].glow,active,hover);

ctx.save();
ctx.globalAlpha=0.94*reveal;
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillStyle="rgba(255,250,240,0.96)";
ctx.font=`700 ${key==="C"?"10":"9"}px system-ui,Segoe UI,Roboto,sans-serif`;
ctx.fillText(DOMAIN_MAP[key].short,proj.x,proj.y);
ctx.restore();
}
}

function buildDragonSpine(mirror){
const w=window.innerWidth;
const h=window.innerHeight;
const cx=w*0.5;
const cy=h*0.46;
const dir=mirror?-1:1;
const cycle=1180;
const t=(state.dragonClock%cycle)/cycle;

let phase,u;
if(t<0.18){
phase="enter";
u=t/0.18;
}else if(t<0.60){
phase="orbit";
u=(t-0.18)/0.42;
}else if(t<0.80){
phase="exit";
u=(t-0.60)/0.20;
}else{
phase="pause";
u=(t-0.80)/0.20;
}

if(phase==="pause")return[];

const pts=[];
for(let i=0;i<55;i++){
const segT=i/54;
const lag=segT*0.26;
let x,y;
if(phase==="enter"){
const startX=mirror?w+420:-420;
const startY=cy+(mirror?-40:40);
const endAngle=mirror?0:Math.PI;
const targetX=cx+Math.cos(endAngle)*250;
const targetY=cy+Math.sin(endAngle)*96;
const uu=clamp(u-lag,0,1);
x=lerp(startX,targetX,uu)+(-dir*i*11);
y=lerp(startY,targetY,uu)+Math.sin(i*0.48+state.tick*0.028*dir)*12;
}else if(phase==="orbit"){
const uu=clamp(u-lag*0.45,0,1);
const angle=(mirror?0:Math.PI)+(mirror?1:-1)*uu*TAU;
x=cx+Math.cos(angle)*250+(-dir*i*9);
y=cy+Math.sin(angle)*96+Math.sin(i*0.42+uu*TAU*1.25)*11;
}else{
const startAngle=mirror?Math.PI:0;
const startX=cx+Math.cos(startAngle)*250;
const startY=cy+Math.sin(startAngle)*96;
const endX=mirror?-420:w+420;
const endY=cy+(mirror?46:-46);
const uu=clamp(u-lag,0,1);
x=lerp(startX,endX,uu)+(-dir*i*11);
y=lerp(startY,endY,uu)+Math.sin(i*0.48+state.tick*0.028*dir)*12;
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
const r=lerp(36,6.4,t);

ctx.save();
ctx.globalAlpha=0.94-(t*0.26);
ctx.shadowBlur=16;
ctx.shadowColor=glowColor;
ctx.fillStyle=baseFill;
ctx.beginPath();
ctx.ellipse(p.x,p.y,r*1.28,r,0,0,TAU);
ctx.fill();
ctx.restore();

ctx.save();
ctx.globalAlpha=0.42-(t*0.16);
ctx.fillStyle=accent;
ctx.beginPath();
ctx.arc(p.x,p.y,r*0.30,0,TAU);
ctx.fill();
ctx.restore();
}

const head=points[0];
ctx.save();
ctx.shadowBlur=20;
ctx.shadowColor=glowColor;
ctx.fillStyle=baseFill;
ctx.beginPath();
ctx.ellipse(head.x,head.y,26,18,0,0,TAU);
ctx.fill();
ctx.restore();
}

function dragons(){
drawSegmentedDragon(
buildDragonSpine(false),
"rgba(128,18,18,0.92)",
"rgba(210,62,40,0.52)",
"rgba(255,132,72,0.72)"
);
drawSegmentedDragon(
buildDragonSpine(true),
"rgba(186,132,30,0.92)",
"rgba(255,210,110,0.50)",
"rgba(255,244,188,0.76)"
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
state.cube=geo;
drawCube(geo);
dragons();
drawEmbeddedGems(geo);
fireworks();
}

function getRegionAt(x,y){
if(state.activeLayer===2){
for(const key of ["N","E","S","W","C"]){
const gem=state.gemZones[key];
if(gem&&diamondContains(x,y,gem))return key;
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
if(region==="W"||region==="E"||region==="N"||region==="S"){
selectDirection(region);
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
