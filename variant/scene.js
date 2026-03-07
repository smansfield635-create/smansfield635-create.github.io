(function(){
const canvas=document.getElementById("scene");
if(!canvas)return;
const ctx=canvas.getContext("2d");
if(!ctx)return;

const TAU=Math.PI*2;

const FACE_MAP={
N:{label:"NORTH",short:"N",role:"direction",route:null},
E:{label:"EAST",short:"E",role:"direction",route:"/products/"},
S:{label:"SOUTH",short:"S",role:"direction",route:"/laws/"},
W:{label:"WEST",short:"W",role:"direction",route:"/gauges/"},
C:{label:"CORE",short:"CORE",role:"core",route:"/home/"},
M:{label:"MORPH",short:"MORPH",role:"morph",route:"SCENE_ACTION_ONLY"}
};

const MATERIALS={
ruby:{ridge:"rgba(255,210,190,0.94)",outer:"rgba(155,32,38,0.52)",inner:"rgba(214,58,48,0.66)",glow:"rgba(255,96,72,0.26)"},
amber:{ridge:"rgba(255,238,188,0.94)",outer:"rgba(164,104,16,0.50)",inner:"rgba(230,168,46,0.64)",glow:"rgba(255,208,96,0.26)"},
jade:{ridge:"rgba(214,255,232,0.92)",outer:"rgba(26,112,88,0.48)",inner:"rgba(78,182,142,0.62)",glow:"rgba(110,255,205,0.22)"},
obsidian:{ridge:"rgba(236,224,255,0.94)",outer:"rgba(28,26,42,0.56)",inner:"rgba(78,72,112,0.58)",glow:"rgba(180,150,255,0.22)"},
core:{ridge:"rgba(255,255,255,0.98)",outer:"rgba(130,130,140,0.34)",inner:"rgba(238,238,244,0.52)",glow:"rgba(255,255,255,0.24)"},
morph:{ridge:"rgba(198,226,255,0.96)",outer:"rgba(42,72,146,0.42)",inner:"rgba(92,148,255,0.56)",glow:"rgba(120,182,255,0.26)"}
};

const FACE_MATERIAL={
N:"ruby",
E:"amber",
S:"jade",
W:"obsidian",
C:"core",
M:"morph"
};

const BANNER_TEXT={
fear:"CONTROL",
wisdom:"ALIGNMENT"
};

const state={
tick:0,
activeFace:null,
hoveredFace:null,
pointer:{x:0,y:0,down:false},
faceZones:{},
rotY:0.26,
rotX:-0.32,
rotVelY:0,
rotVelX:0,
isDragging:false,
lastPointer:{x:0,y:0},
dragDistance:0,
fireworks:[],
lanterns:[],
cloudBanks:[],
mountains:[],
cube:null,
dragonLoopStarted:false,
dragonLoopStartTick:0,
morphPulse:0,
secondCompassOpen:false,
lockedPulse:0,
lockedFace:null,
navigateTo:null,
navigateDelay:0,
overlayAlpha:0
};

const DRAGON_CYCLE_FRAMES=1800;
const ENTRY_RATIO=0.18;
const ORBIT_RATIO=0.58;
const EXIT_RATIO=0.24;
const WISDOM_DELAY=0.12;

function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function fract(v){return v-Math.floor(v);}
function hash(n){return fract(Math.sin(n*127.1)*43758.5453123);}
function easeOutCubic(t){return 1-Math.pow(1-t,3);}
function easeInOutCubic(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function easeInQuad(t){return t*t;}
function angleBetween(a,b){return Math.atan2(b.y-a.y,b.x-a.x);}
function wrapPi(a){
while(a>Math.PI)a-=TAU;
while(a<-Math.PI)a+=TAU;
return a;
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
initCloudBanks();
initMountains();
}
window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});

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

function initLanterns(){
const w=window.innerWidth||1;
const h=window.innerHeight||1;
const count=Math.max(18,Math.round(w/110));
state.lanterns=[];
for(let i=0;i<count;i++){
const seed=i+1;
const depthBand=i%3;
const depthScale=depthBand===0?1.0:(depthBand===1?0.78:0.58);
state.lanterns.push({
x:hash(seed*2.17)*w,
y:h*(0.48+hash(seed*3.91)*0.42),
size:(18+hash(seed*5.31)*12)*depthScale,
speed:(0.08+hash(seed*6.17)*0.16)*(0.65+depthScale*0.8),
sway:(8+hash(seed*7.33)*18)*(0.8+depthScale*0.45),
phase:hash(seed*8.07)*TAU,
flamePhase:hash(seed*9.13)*TAU,
depth:depthScale,
tilt:(hash(seed*10.11)-0.5)*0.16
});
}
}

function initCloudBanks(){
const w=window.innerWidth||1;
const h=window.innerHeight||1;
const count=Math.max(9,Math.round(w/180));
state.cloudBanks=[];
for(let i=0;i<count;i++){
const seed=i+1;
const layer=i%3;
const scale=layer===0?1.25:(layer===1?0.95:0.72);
state.cloudBanks.push({
x:hash(seed*12.1)*w,
y:h*(layer===0?0.16+hash(seed*1.8)*0.10:layer===1?0.22+hash(seed*2.8)*0.12:0.30+hash(seed*3.8)*0.12),
size:(110+hash(seed*13.7)*120)*scale,
speed:(0.05+hash(seed*14.3)*0.12)*(layer===0?0.35:layer===1?0.55:0.85),
alpha:layer===0?0.11:layer===1?0.15:0.18,
phase:hash(seed*15.1)*TAU,
layer
});
}
}

function initMountains(){
const w=window.innerWidth||1;
const h=window.innerHeight||1;
const horizon=h*0.66;
state.mountains=[];
for(let band=0;band<3;band++){
const pts=[];
const baseY=horizon+(band===0?22:(band===1?44:68));
const step=80-(band*12);
for(let x=-120;x<=w+120;x+=step){
const seed=(band+1)*1000+x;
const peak=(hash(seed*0.013)-0.5)*(band===0?58:(band===1?44:30));
pts.push({x,y:baseY+peak});
}
state.mountains.push({band,pts});
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
const xi=poly[i].x, yi=poly[i].y;
const xj=poly[j].x, yj=poly[j].y;
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
life:46+Math.floor(hash(i*2.1)*20)
});
}
state.fireworks.push({particles,life:60,maxLife:60});
}

function startDragonLoop(){
if(state.dragonLoopStarted)return;
state.dragonLoopStarted=true;
state.dragonLoopStartTick=state.tick;
spawnFirework(window.innerWidth*0.24,window.innerHeight*0.22,22,2.2);
spawnFirework(window.innerWidth*0.76,window.innerHeight*0.22,22,2.2);
}

function triggerLocked(face){
state.lockedFace=face;
state.lockedPulse=1;
const geo=state.cube;
if(geo&&geo.faceCenters[face]){
spawnFirework(geo.faceCenters[face].x,geo.faceCenters[face].y,14,1.5);
}
}

function queueNavigation(route){
state.navigateTo=route;
state.navigateDelay=12;
state.overlayAlpha=1;
}

function selectFace(face){
state.activeFace=face;
const geo=state.cube;
if(geo&&geo.faceCenters[face]){
spawnFirework(geo.faceCenters[face].x,geo.faceCenters[face].y,16,1.7);
}
const meta=FACE_MAP[face];
if(!meta)return;
if(meta.route===null){
triggerLocked(face);
return;
}
if(meta.route==="SCENE_ACTION_ONLY"){
state.morphPulse=1;
state.secondCompassOpen=!state.secondCompassOpen;
return;
}
queueNavigation(meta.route);
}

function sky(){
const w=window.innerWidth;
const h=window.innerHeight;
const g=ctx.createLinearGradient(0,0,0,h);
g.addColorStop(0,"#12050a");
g.addColorStop(0.14,"#2b0b10");
g.addColorStop(0.36,"#571410");
g.addColorStop(0.58,"#9f2817");
g.addColorStop(0.78,"#dd6130");
g.addColorStop(1,"#1a0606");
ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);

const horizonY=h*0.66;
const glow=ctx.createLinearGradient(0,horizonY-150,0,horizonY+110);
glow.addColorStop(0,"rgba(255,175,88,0)");
glow.addColorStop(0.32,"rgba(255,152,62,0.18)");
glow.addColorStop(0.56,"rgba(255,112,48,0.26)");
glow.addColorStop(1,"rgba(255,96,36,0)");
ctx.fillStyle=glow;
ctx.fillRect(0,horizonY-150,w,260);

for(let i=0;i<26;i++){
const x=hash(i*3.11)*w;
const y=hash(i*4.17)*h*0.40;
const a=0.05+hash(i*5.13)*0.10;
ctx.fillStyle=`rgba(255,245,225,${a})`;
ctx.beginPath();
ctx.arc(x,y,0.8+hash(i*6.31)*1.2,0,TAU);
ctx.fill();
}
}

function moon(){
const x=window.innerWidth*0.80;
const y=window.innerHeight*0.15;
const r=Math.min(window.innerWidth,window.innerHeight)*0.074;
ctx.save();

const halo=ctx.createRadialGradient(x,y,r*0.35,x,y,r*2.4);
halo.addColorStop(0,"rgba(255,244,215,0.20)");
halo.addColorStop(0.45,"rgba(255,226,176,0.14)");
halo.addColorStop(1,"rgba(255,226,176,0)");
ctx.fillStyle=halo;
ctx.beginPath();
ctx.arc(x,y,r*2.4,0,TAU);
ctx.fill();

ctx.shadowBlur=78;
ctx.shadowColor="rgba(255,224,170,0.28)";
const moonGrad=ctx.createRadialGradient(x-r*0.28,y-r*0.22,r*0.08,x,y,r*1.05);
moonGrad.addColorStop(0,"rgba(255,252,236,0.96)");
moonGrad.addColorStop(0.56,"rgba(255,238,200,0.95)");
moonGrad.addColorStop(1,"rgba(228,206,164,0.94)");
ctx.fillStyle=moonGrad;
ctx.beginPath();
ctx.arc(x,y,r,0,TAU);
ctx.fill();
ctx.shadowBlur=0;

ctx.globalAlpha=0.16;
ctx.fillStyle="rgba(180,150,122,0.90)";
for(let i=0;i<6;i++){
const a=(i/6)*TAU+0.2;
ctx.beginPath();
ctx.ellipse(
x+Math.cos(a)*r*0.35,
y+Math.sin(a)*r*0.22,
r*(0.08+hash(i*9.1)*0.10),
r*(0.05+hash(i*10.2)*0.08),
a*0.6,0,TAU
);
ctx.fill();
}
ctx.restore();
}

function drawCloudBank(cl){
const x=cl.x+Math.sin(state.tick*0.0016+cl.phase)*18;
const y=cl.y+Math.cos(state.tick*0.0012+cl.phase)*4;
const scale=cl.size;
ctx.save();
ctx.globalAlpha=cl.alpha;
const g=ctx.createLinearGradient(x,y-scale*0.25,x,y+scale*0.28);
g.addColorStop(0,"rgba(255,235,222,0.18)");
g.addColorStop(0.42,"rgba(255,223,210,0.12)");
g.addColorStop(1,"rgba(255,220,208,0.04)");
ctx.fillStyle=g;
ctx.beginPath();
ctx.ellipse(x-scale*0.78,y,scale*0.50,scale*0.18,0,0,TAU);
ctx.ellipse(x-scale*0.34,y-scale*0.11,scale*0.42,scale*0.20,0,0,TAU);
ctx.ellipse(x+scale*0.06,y-scale*0.13,scale*0.48,scale*0.22,0,0,TAU);
ctx.ellipse(x+scale*0.48,y-scale*0.04,scale*0.58,scale*0.23,0,0,TAU);
ctx.ellipse(x+scale*0.92,y+scale*0.01,scale*0.34,scale*0.14,0,0,TAU);
ctx.fill();

ctx.globalAlpha=cl.alpha*0.42;
ctx.fillStyle="rgba(255,255,255,0.20)";
ctx.beginPath();
ctx.ellipse(x-scale*0.06,y-scale*0.16,scale*0.28,scale*0.08,-0.12,0,TAU);
ctx.ellipse(x+scale*0.42,y-scale*0.10,scale*0.30,scale*0.08,-0.08,0,TAU);
ctx.fill();
ctx.restore();
}

function clouds(){
const w=window.innerWidth;
for(let i=0;i<state.cloudBanks.length;i++){
const cl=state.cloudBanks[i];
cl.x+=cl.speed*0.12;
if(cl.x-cl.size>w+cl.size*1.6)cl.x=-cl.size*1.4;
drawCloudBank(cl);
}
}

function lanterns(){
const h=window.innerHeight;
for(let i=0;i<state.lanterns.length;i++){
const ln=state.lanterns[i];
const driftY=(state.tick*ln.speed)%((h*0.86)+180);
const y=ln.y-driftY<-120?ln.y-driftY+(h*0.86)+200:ln.y-driftY;
const x=ln.x+Math.sin(state.tick*0.008+ln.phase)*ln.sway;
const flicker=0.82+Math.sin(state.tick*0.09+ln.flamePhase)*0.12+Math.sin(state.tick*0.043+ln.flamePhase*0.7)*0.06;

ctx.save();
ctx.translate(x,y);
ctx.rotate(ln.tilt+Math.sin(state.tick*0.01+ln.phase)*0.04);

ctx.globalAlpha=0.38*ln.depth;
ctx.strokeStyle="rgba(255,214,160,0.42)";
ctx.lineWidth=1;
ctx.beginPath();
ctx.moveTo(0,-ln.size*1.10);
ctx.lineTo(0,-ln.size*0.62);
ctx.stroke();

ctx.globalAlpha=0.95*ln.depth;
ctx.fillStyle="rgba(105,15,18,0.88)";
roundedRectPath(-ln.size*0.42,-ln.size*0.62,ln.size*0.84,ln.size*1.10,ln.size*0.20);
ctx.fill();
ctx.strokeStyle="rgba(255,218,148,0.74)";
ctx.lineWidth=1.1;
ctx.stroke();

ctx.fillStyle="rgba(255,230,195,0.10)";
roundedRectPath(-ln.size*0.20,-ln.size*0.38,ln.size*0.40,ln.size*0.64,ln.size*0.10);
ctx.fill();

ctx.globalAlpha=0.58*ln.depth;
ctx.strokeStyle="rgba(255,228,188,0.26)";
ctx.beginPath();
ctx.moveTo(-ln.size*0.22,-ln.size*0.22);
ctx.lineTo(ln.size*0.22,-ln.size*0.22);
ctx.moveTo(-ln.size*0.22,0);
ctx.lineTo(ln.size*0.22,0);
ctx.moveTo(-ln.size*0.22,ln.size*0.22);
ctx.lineTo(ln.size*0.22,ln.size*0.22);
ctx.stroke();

ctx.shadowBlur=26*ln.depth;
ctx.shadowColor=`rgba(255,196,96,${0.32*flicker})`;
ctx.globalAlpha=0.54*ln.depth;
ctx.fillStyle=`rgba(255,196,96,${0.30*flicker})`;
roundedRectPath(-ln.size*0.18,-ln.size*0.30,ln.size*0.36,ln.size*0.54,ln.size*0.10);
ctx.fill();

ctx.globalAlpha=0.86*ln.depth;
ctx.fillStyle="rgba(255,244,216,0.95)";
ctx.beginPath();
ctx.moveTo(0,-ln.size*0.18);
ctx.quadraticCurveTo(ln.size*0.09,0,0,ln.size*0.16);
ctx.quadraticCurveTo(-ln.size*0.09,0,0,-ln.size*0.18);
ctx.fill();

ctx.restore();
}
}

function mountains(){
const w=window.innerWidth;
const h=window.innerHeight;
const horizon=h*0.66;

for(let i=state.mountains.length-1;i>=0;i--){
const band=state.mountains[i];
ctx.beginPath();
ctx.moveTo(-140,h);
for(let p=0;p<band.pts.length;p++){
ctx.lineTo(band.pts[p].x,band.pts[p].y);
}
ctx.lineTo(w+140,h);
ctx.closePath();

ctx.fillStyle=band.band===0?"rgba(22,14,18,0.82)":band.band===1?"rgba(28,16,20,0.62)":"rgba(34,18,20,0.44)";
ctx.fill();
}

const haze=ctx.createLinearGradient(0,horizon-18,0,horizon+110);
haze.addColorStop(0,"rgba(255,182,126,0.10)");
haze.addColorStop(0.45,"rgba(34,18,20,0.12)");
haze.addColorStop(1,"rgba(0,0,0,0)");
ctx.fillStyle=haze;
ctx.fillRect(0,horizon-18,w,140);
}

function water(){
const h=window.innerHeight;
const w=window.innerWidth;
const horizon=h*0.66;
const base=h*0.80;

const g=ctx.createLinearGradient(0,horizon-24,0,h);
g.addColorStop(0,"rgba(56,20,20,0.46)");
g.addColorStop(0.16,"rgba(28,14,18,0.84)");
g.addColorStop(0.54,"rgba(11,8,14,0.96)");
g.addColorStop(1,"rgba(5,4,8,1)");
ctx.fillStyle=g;
ctx.fillRect(0,horizon-24,w,h-(horizon-24));

ctx.save();
ctx.globalAlpha=0.16;
const moonReflectionX=window.innerWidth*0.80;
const refl=ctx.createLinearGradient(moonReflectionX-80,horizon,moonReflectionX+120,h);
refl.addColorStop(0,"rgba(255,220,160,0)");
refl.addColorStop(0.48,"rgba(255,220,160,0.30)");
refl.addColorStop(1,"rgba(255,220,160,0)");
ctx.fillStyle=refl;
ctx.beginPath();
ctx.moveTo(moonReflectionX-72,horizon+6);
ctx.lineTo(moonReflectionX+22,horizon+6);
ctx.lineTo(moonReflectionX+110,h);
ctx.lineTo(moonReflectionX-146,h);
ctx.closePath();
ctx.fill();
ctx.restore();

for(let layer=0;layer<12;layer++){
const depth=layer/11;
const yBase=base+layer*12;
const amp=lerp(2.0,10.5,depth);
const f1=lerp(0.008,0.026,depth);
const f2=lerp(0.004,0.014,depth);
ctx.beginPath();
for(let x=0;x<=w;x+=8){
const wave1=Math.sin((x* f1)+(state.tick*(0.010+depth*0.028))+layer*0.72)*amp;
const wave2=Math.sin((x* f2)-(state.tick*(0.006+depth*0.010))+layer*1.22)*amp*0.52;
const wave3=Math.sin((x*0.017)+(state.tick*0.017)+layer*0.45)*amp*0.18;
const y=yBase+wave1+wave2+wave3;
    if(x===0)ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,${Math.round(110+depth*70)},${Math.round(88+depth*40)},${0.018+depth*0.050})`;
ctx.lineWidth=1.5+depth*1.1;
ctx.stroke();
}

for(let crest=0;crest<6;crest++){
ctx.beginPath();
for(let x=0;x<=w;x+=10){
const y=base+crest*20+
Math.sin((x*0.020)+(state.tick*0.026)+crest*0.9)*4.6+
Math.sin((x*0.006)-(state.tick*0.009)+crest*1.4)*2.2;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,228,176,${0.030-crest*0.003})`;
ctx.lineWidth=1.0;
ctx.stroke();
}
}

function project(x,y,z){
const scale=420/(420+z);
return{
x:window.innerWidth/2+x*scale,
y:window.innerHeight*0.60+y*scale,
scale
};
}

function spherify(x,y,z,blend){
const len=Math.sqrt(x*x+y*y+z*z)||1;
const sx=x/len;
const sy=y/len;
const sz=z/len;
return{
x:lerp(x,sx,blend),
y:lerp(y,sy,blend),
z:lerp(z,sz,blend)
};
}

function rotateVertex(x,y,z,rotY,rotX){
const cy=Math.cos(rotY), sy=Math.sin(rotY);
const cx=Math.cos(rotX), sx=Math.sin(rotX);

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

function insetPoly(poly,amount){
const c=polyCenter(poly);
return poly.map(p=>({
x:lerp(p.x,c.x,amount),
y:lerp(p.y,c.y,amount)
}));
}

function getCubeGeometry(){
const size=Math.min(window.innerWidth,window.innerHeight)*0.16;
const pulse=1+state.morphPulse*0.03;
const soften=0.42;
const vertsRaw=[
[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];
const edges=[
[0,1],[1,2],[2,3],[3,0],
[4,5],[5,6],[6,7],[7,4],
[0,4],[1,5],[2,6],[3,7]
];
const faces3D={
M:[0,1,2,3],
C:[4,5,6,7],
W:[0,3,7,4],
E:[1,2,6,5],
N:[3,2,6,7],
S:[0,1,5,4]
};

const rotated=[];
const pts=[];

for(const v of vertsRaw){
const sv=spherify(v[0],v[1],v[2],soften);
const p=rotateVertex(sv.x*size*pulse,sv.y*size*pulse,sv.z*size*pulse,state.rotY,state.rotX);
rotated.push(p);
pts.push(project(p.x,p.y,p.z));
}

const faces2D={
M:[pts[0],pts[1],pts[2],pts[3]],
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
size:size*pulse
};
}

function faceBaseFill(key){
if(key==="C")return "rgba(139,0,0,0.16)";
if(key==="N")return "rgba(176,24,24,0.14)";
if(key==="E"||key==="W")return "rgba(120,0,0,0.12)";
if(key==="S")return "rgba(35,0,0,0.10)";
return "rgba(70,0,0,0.08)";
}

function drawBeveledFace(poly,key,active,hover){
const mat=MATERIALS[FACE_MATERIAL[key]];
const inner=insetPoly(poly,0.18);
const deep=insetPoly(poly,0.33);

ctx.save();
ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);
for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i].x,poly[i].y);
ctx.closePath();
ctx.fillStyle=faceBaseFill(key);
ctx.fill();
ctx.restore();

ctx.save();
ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);
for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i].x,poly[i].y);
ctx.closePath();
ctx.moveTo(inner[0].x,inner[0].y);
for(let i=1;i<inner.length;i++)ctx.lineTo(inner[i].x,inner[i].y);
ctx.closePath();
ctx.fillStyle=mat.outer;
ctx.fill("evenodd");
ctx.restore();

const grad=ctx.createLinearGradient(deep[0].x,deep[0].y,deep[2].x,deep[2].y);
grad.addColorStop(0,mat.inner);
grad.addColorStop(0.55,"rgba(255,255,255,0.08)");
grad.addColorStop(1,mat.outer);

ctx.save();
ctx.beginPath();
ctx.moveTo(inner[0].x,inner[0].y);
for(let i=1;i<inner.length;i++)ctx.lineTo(inner[i].x,inner[i].y);
ctx.closePath();
ctx.fillStyle=grad;
ctx.fill();
ctx.shadowBlur=active?22:(hover?14:10);
ctx.shadowColor=mat.glow;
ctx.lineWidth=active?2.8:1.5;
ctx.strokeStyle=active?mat.ridge:"rgba(255,215,150,0.30)";
ctx.stroke();
ctx.restore();

ctx.save();
ctx.beginPath();
ctx.moveTo(deep[0].x,deep[0].y);
for(let i=1;i<deep.length;i++)ctx.lineTo(deep[i].x,deep[i].y);
ctx.closePath();
ctx.lineWidth=1.0;
ctx.strokeStyle="rgba(255,255,255,0.18)";
ctx.stroke();
ctx.restore();

const c=polyCenter(inner);
ctx.save();
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillStyle="rgba(255,250,240,0.96)";
ctx.font=`700 ${key==="C"||key==="M"?"9":"11"}px system-ui,Segoe UI,Roboto,sans-serif`;
ctx.fillText(FACE_MAP[key].short,c.x,c.y);
ctx.restore();
}

function drawCube(geo){
state.faceZones=geo.faces;
for(const face of geo.renderFaces){
const poly=face.idxs.map(i=>geo.pts[i]);
drawBeveledFace(poly,face.key,state.activeFace===face.key,state.hoveredFace===face.key);
}
ctx.save();
ctx.shadowBlur=14;
ctx.shadowColor="rgba(255,215,0,0.18)";
for(const e of geo.edges){
const a=geo.rotated[e[0]].z+geo.rotated[e[1]].z;
ctx.beginPath();
ctx.moveTo(geo.pts[e[0]].x,geo.pts[e[0]].y);
ctx.lineTo(geo.pts[e[1]].x,geo.pts[e[1]].y);
ctx.lineWidth=1.9;
ctx.strokeStyle=a<0?"rgba(255,215,0,0.28)":"rgba(255,215,0,0.70)";
ctx.stroke();
}
ctx.restore();
}

function getCycleIndex(){
return Math.floor(Math.max(0,state.tick-state.dragonLoopStartTick)/DRAGON_CYCLE_FRAMES);
}
function getCycleProgress(){
if(!state.dragonLoopStarted)return null;
const local=(state.tick-state.dragonLoopStartTick)%DRAGON_CYCLE_FRAMES;
return local/DRAGON_CYCLE_FRAMES;
}
function cycleDirection(cycleIndex){
return cycleIndex%2===0?1:-1;
}
function entryAngle(cycleIndex,dragonType){
const channel=dragonType==="fear"?1:2;
return hash(cycleIndex*19.37+channel*41.11)*TAU;
}
function dragonCycleState(dragonType,delay){
const p=getCycleProgress();
if(p===null)return null;
const cycleIndex=getCycleIndex();
const delayed=p-delay;
if(delayed<0)return null;

let phase, localT;
if(delayed<ENTRY_RATIO){
phase="entry";
localT=delayed/ENTRY_RATIO;
}else if(delayed<ENTRY_RATIO+ORBIT_RATIO){
phase="orbit";
localT=(delayed-ENTRY_RATIO)/ORBIT_RATIO;
}else if(delayed<1){
phase="exit";
localT=(delayed-ENTRY_RATIO-ORBIT_RATIO)/EXIT_RATIO;
}else{
return null;
}

return{
cycleIndex,
phase,
t:localT,
dir:cycleDirection(cycleIndex),
startAngle:entryAngle(cycleIndex,dragonType),
phaseOffset:dragonType==="fear"?0:Math.PI
};
}

function figureEightOrbit(geo,a,phaseOffset,dragonType){
const shell=dragonType==="fear"?geo.size*2.96:geo.size*3.42;
const t=a+phaseOffset;
const x=Math.sin(t)*shell;
const y=Math.sin(t)*Math.cos(t)*shell*0.40;
const z=Math.cos(t)*shell*0.46 + (dragonType==="fear"?-0.18:0.18);
return{
x:geo.centerX+x,
y:geo.centerY+y,
z:z/(shell*0.46),
rawZ:z
};
}

function dragonPathPoint(geo,dragonType,delay){
const cycle=dragonCycleState(dragonType,delay);
if(!cycle)return null;

const orbitAngle=cycle.startAngle+cycle.dir*(cycle.t*1.18*TAU);
const orbit=figureEightOrbit(geo,orbitAngle,cycle.phaseOffset,dragonType);

const portalRadius=geo.size*4.78;
const portalX=geo.centerX+Math.cos(cycle.startAngle)*portalRadius;
const portalY=geo.centerY+Math.sin(cycle.startAngle)*portalRadius*0.52;
const exitAngle=cycle.startAngle+cycle.dir*(1.65*TAU);
const exitX=geo.centerX+Math.cos(exitAngle)*portalRadius;
const exitY=geo.centerY+Math.sin(exitAngle)*portalRadius*0.52;

if(cycle.phase==="entry"){
const t=easeInOutCubic(cycle.t);
return{
x:lerp(portalX,orbit.x,t),
y:lerp(portalY,orbit.y,t),
z:lerp(-0.22,orbit.z,t),
a:orbitAngle,
portal:{x:portalX,y:portalY,phase:"entry",alpha:1-cycle.t}
};
}
if(cycle.phase==="orbit"){
return{
x:orbit.x,
y:orbit.y,
z:orbit.z,
a:orbitAngle,
portal:null
};
}
const t=easeInOutCubic(cycle.t);
return{
x:lerp(orbit.x,exitX,t),
y:lerp(orbit.y,exitY,t),
z:lerp(orbit.z,0.22,t),
a:orbitAngle,
portal:{x:exitX,y:exitY,phase:"exit",alpha:cycle.t}
};
}

function buildDragonBody(geo,dragonType,delay){
const headState=dragonPathPoint(geo,dragonType,delay);
if(!headState)return null;
const points=[];
const count=44;
for(let i=0;i<count;i++){
const lag=i*0.0125;
const raw=(getCycleProgress()??0)-delay-lag;
if(raw<0)break;
let phase, localT;
if(raw<ENTRY_RATIO){
phase="entry";
localT=raw/ENTRY_RATIO;
}else if(raw<ENTRY_RATIO+ORBIT_RATIO){
phase="orbit";
localT=(raw-ENTRY_RATIO)/ORBIT_RATIO;
}else{
phase="exit";
localT=(raw-ENTRY_RATIO-ORBIT_RATIO)/EXIT_RATIO;
}
localT=clamp(localT,0,1);

const cycleIndex=getCycleIndex();
const dir=cycleDirection(cycleIndex);
const startAngle=entryAngle(cycleIndex,dragonType);
const orbitAngle=startAngle+dir*(localT*1.18*TAU);
const orbit=figureEightOrbit(geo,orbitAngle,dragonType==="fear"?0:Math.PI,dragonType);

const portalRadius=geo.size*4.78;
const portalX=geo.centerX+Math.cos(startAngle)*portalRadius;
const portalY=geo.centerY+Math.sin(startAngle)*portalRadius*0.52;
const exitAngle=startAngle+dir*(1.65*TAU);
const exitX=geo.centerX+Math.cos(exitAngle)*portalRadius;
const exitY=geo.centerY+Math.sin(exitAngle)*portalRadius*0.52;

let x,y,z;
if(phase==="entry"){
const tt=easeInOutCubic(localT);
x=lerp(portalX,orbit.x,tt);
y=lerp(portalY,orbit.y,tt);
z=lerp(-0.22,orbit.z,tt);
}else if(phase==="orbit"){
x=orbit.x;
y=orbit.y;
z=orbit.z;
}else{
const tt=easeInOutCubic(localT);
x=lerp(orbit.x,exitX,tt);
y=lerp(orbit.y,exitY,tt);
z=lerp(orbit.z,0.22,tt);
}
const cross=1-Math.min(1,Math.abs(Math.sin(orbitAngle+ (dragonType==="fear"?0:Math.PI))));
const crossThin=1-cross*0.24;
const wave=Math.sin((state.tick*0.018)+(i*0.40)+(dragonType==="fear"?0:Math.PI))*geo.size*0.018;
const waveY=Math.cos((state.tick*0.012)+(i*0.31)+(dragonType==="fear"?0:Math.PI))*geo.size*0.012;
const nx=-Math.sin(orbitAngle);
const ny=Math.cos(orbitAngle)*0.22;
points.push({x:x+nx*wave,y:y+ny*wave+waveY,z,a:orbitAngle,crossThin});
}
return{points,portal:headState.portal};
}

function drawPortal(portal,colorA,colorB,geo){
if(!portal)return;
const pulse=0.85+Math.sin(state.tick*0.05)*0.15;
ctx.save();
ctx.translate(portal.x,portal.y);
ctx.rotate(Math.sin(state.tick*0.01+portal.x*0.01)*0.12);
ctx.globalAlpha=0.55*clamp(portal.alpha*1.2,0.25,1);
ctx.strokeStyle=colorA;
ctx.lineWidth=2.2;
ctx.shadowBlur=18;
ctx.shadowColor=colorB;
ctx.beginPath();
ctx.ellipse(0,0,geo.size*0.28*pulse,geo.size*0.09*pulse,0,0,TAU);
ctx.stroke();
ctx.beginPath();
ctx.ellipse(0,0,geo.size*0.18*pulse,geo.size*0.05*pulse,0,0,TAU);
ctx.stroke();
for(let i=0;i<4;i++){
const a=(i/4)*TAU+state.tick*0.015*(i%2===0?1:-1);
ctx.beginPath();
ctx.moveTo(Math.cos(a)*geo.size*0.10,Math.sin(a)*geo.size*0.03);
ctx.lineTo(Math.cos(a)*geo.size*0.26,Math.sin(a)*geo.size*0.09);
ctx.strokeStyle=colorA;
ctx.lineWidth=1.2;
ctx.stroke();
}
ctx.restore();
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

function drawBanner(bundle,dragonType){
if(!bundle||!bundle.points||bundle.points.length<16)return;
const pts=bundle.points;
const start=4;
const end=14;
const baseColor=dragonType==="fear"?"rgba(168,34,36,0.84)":"rgba(214,166,58,0.84)";
const edgeColor=dragonType==="fear"?"rgba(255,182,160,0.84)":"rgba(255,239,196,0.86)";
const textColor=dragonType==="fear"?"rgba(255,238,228,0.95)":"rgba(48,20,8,0.95)";
const wavePhase=state.tick*0.08+(dragonType==="fear"?0:1.4);

const upper=[];
const lower=[];
for(let i=start;i<=end;i++){
const p=pts[i];
const prev=pts[Math.max(0,i-1)];
const next=pts[Math.min(pts.length-1,i+1)];
const a=angleBetween(prev,next);
const nx=-Math.sin(a);
const ny=Math.cos(a);
const width=(i===start?16:lerp(15,6,(i-start)/(end-start)))*p.crossThin;
const flutter=Math.sin(wavePhase+i*0.5)*(i===start?2.0:3.2);
upper.push({x:p.x+nx*(width+flutter*0.20),y:p.y+ny*(width+flutter*0.30)});
lower.push({x:p.x-nx*(width*0.68+flutter*0.28),y:p.y-ny*(width*0.68+flutter*0.36)});
}

ctx.save();
ctx.globalAlpha=0.88;
ctx.beginPath();
ctx.moveTo(upper[0].x,upper[0].y);
for(let i=1;i<upper.length;i++)ctx.lineTo(upper[i].x,upper[i].y);
for(let i=lower.length-1;i>=0;i--)ctx.lineTo(lower[i].x,lower[i].y);
ctx.closePath();
const grad=ctx.createLinearGradient(upper[0].x,upper[0].y,lower[lower.length-1].x,lower[lower.length-1].y);
grad.addColorStop(0,edgeColor);
grad.addColorStop(0.18,baseColor);
grad.addColorStop(1,`${baseColor.replace(/0\.84\)/,"0.30)")}`);
ctx.fillStyle=grad;
ctx.fill();
ctx.lineWidth=1.0;
ctx.strokeStyle=edgeColor;
ctx.stroke();
ctx.restore();

const textAnchor=pts[8];
const textDir=angleBetween(pts[7],pts[9]);
ctx.save();
ctx.translate(textAnchor.x,textAnchor.y);
ctx.rotate(textDir);
ctx.fillStyle=textColor;
ctx.font="800 9px system-ui,Segoe UI,Roboto,sans-serif";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(BANNER_TEXT[dragonType],0,0);
ctx.restore();
}

function drawDragonHalf(bundle,dragonType,baseFill,glowColor,accent,front){
if(!bundle||!bundle.points||bundle.points.length<6)return;
const points=bundle.points;

for(let i=points.length-1;i>=1;i--){
const p=points[i];
if(front?(p.z<0):(p.z>=0))continue;
const prev=points[Math.max(0,i-1)];
const next=points[Math.min(points.length-1,i+1)];
const t=i/(points.length-1);
const depthScale=lerp(1.18,0.84,(p.z+1)/2);
const r=lerp(34,5.8,t)*depthScale*p.crossThin;
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
const fin=lerp(12,2.4,t)*(1+p.z*0.10)*p.crossThin;
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
drawBanner(bundle,dragonType);
drawDragonHair(points,glowColor);
drawDragonHead(points[0],points[3],baseFill,glowColor,accent);
}
}

function dragonsBack(geo){
const fear=buildDragonBody(geo,"fear",0.00);
const wisdom=buildDragonBody(geo,"wisdom",WISDOM_DELAY);
if(fear)drawPortal(fear.portal,"rgba(255,96,72,0.82)","rgba(255,80,80,0.42)",geo);
if(wisdom)drawPortal(wisdom.portal,"rgba(255,220,130,0.82)","rgba(255,220,130,0.36)",geo);
drawDragonHalf(fear,"fear","rgba(128,18,18,0.92)","rgba(210,62,40,0.52)","rgba(255,132,72,0.72)",false);
drawDragonHalf(wisdom,"wisdom","rgba(186,132,30,0.92)","rgba(255,210,110,0.50)","rgba(255,244,188,0.76)",false);
}

function dragonsFront(geo){
const fear=buildDragonBody(geo,"fear",0.00);
const wisdom=buildDragonBody(geo,"wisdom",WISDOM_DELAY);
drawDragonHalf(fear,"fear","rgba(128,18,18,0.92)","rgba(210,62,40,0.52)","rgba(255,132,72,0.72)",true);
drawDragonHalf(wisdom,"wisdom","rgba(186,132,30,0.92)","rgba(255,210,110,0.50)","rgba(255,244,188,0.76)",true);
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

function drawSecondCompassOverlay(){
if(!state.secondCompassOpen)return;
const cx=window.innerWidth*0.5;
const cy=window.innerHeight*0.20;
const r1=Math.min(window.innerWidth,window.innerHeight)*0.15;
const nodes=["NNE","NE","ENE","ESE","SE","SSE","SSW","SW","WSW","WNW","NW","NNW"];
ctx.save();
ctx.globalAlpha=0.78;
for(let i=0;i<nodes.length;i++){
const a=(-Math.PI/2)+(i/nodes.length)*TAU;
const x=cx+Math.cos(a)*r1;
const y=cy+Math.sin(a)*r1*0.55;
ctx.beginPath();
ctx.arc(x,y,16,0,TAU);
ctx.fillStyle="rgba(24,20,34,0.84)";
ctx.fill();
ctx.lineWidth=1.5;
ctx.strokeStyle="rgba(255,215,150,0.58)";
ctx.stroke();
ctx.fillStyle="rgba(255,245,232,0.92)";
ctx.font="700 8px system-ui,Segoe UI,Roboto,sans-serif";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(nodes[i],x,y);
}
ctx.restore();
}

function drawLockedOverlay(){
if(state.lockedPulse<=0||!state.lockedFace)return;
const alpha=clamp(state.lockedPulse,0,1);
ctx.save();
ctx.globalAlpha=0.82*alpha;
const w=220;
const h=50;
const x=window.innerWidth*0.5-w*0.5;
const y=window.innerHeight*0.12;
roundedRectPath(x,y,w,h,16);
ctx.fillStyle="rgba(20,18,28,0.88)";
ctx.fill();
ctx.lineWidth=1.4;
ctx.strokeStyle="rgba(255,215,150,0.52)";
ctx.stroke();
ctx.fillStyle="rgba(255,245,235,0.94)";
ctx.font="700 14px system-ui,Segoe UI,Roboto,sans-serif";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(`${FACE_MAP[state.lockedFace].label} LOCKED`,x+w*0.5,y+h*0.5);
ctx.restore();
}

function drawNavigationOverlay(){
if(state.overlayAlpha<=0)return;
ctx.save();
ctx.globalAlpha=clamp(state.overlayAlpha,0,1)*0.22;
ctx.fillStyle="black";
ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
ctx.restore();
}

function drawSceneFrame(){
ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
sky();
moon();
clouds();
lanterns();
mountains();
water();

const geo=getCubeGeometry();
state.cube=geo;

dragonsBack(geo);
drawCube(geo);
dragonsFront(geo);
drawSecondCompassOverlay();
fireworks();
drawLockedOverlay();
drawNavigationOverlay();
}

function getRegionAt(x,y){
for(const key of ["C","W","E","N","S","M"]){
const poly=state.faceZones[key];
if(poly&&pointInPoly(x,y,poly))return key;
}
return null;
}

function updateInteractionFromPoint(x,y){
state.hoveredFace=getRegionAt(x,y);
}

function engageDrag(x,y){
state.isDragging=true;
state.lastPointer.x=x;
state.lastPointer.y=y;
state.dragDistance=0;
state.pointer.down=true;
const hit=getRegionAt(x,y);
if(hit&&!state.dragonLoopStarted)startDragonLoop();
}

function moveDrag(x,y){
if(!state.isDragging)return;
const dx=x-state.lastPointer.x;
const dy=y-state.lastPointer.y;
state.lastPointer.x=x;
state.lastPointer.y=y;
state.dragDistance+=Math.abs(dx)+Math.abs(dy);
state.rotVelY+=dx*0.0010;
state.rotVelX+=dy*0.0010;
}

function releaseDrag(x,y){
const hit=getRegionAt(x,y);
const wasTap=state.dragDistance<10;
state.isDragging=false;
state.pointer.down=false;
if(wasTap&&hit)selectFace(hit);
}

canvas.addEventListener("pointermove",e=>{
const p=getPointerPos(e);
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
moveDrag(p.x,p.y);
},{passive:true});

canvas.addEventListener("pointerdown",e=>{
const p=getPointerPos(e);
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
const hit=getRegionAt(p.x,p.y);
if(hit)engageDrag(p.x,p.y);
});

canvas.addEventListener("pointerup",e=>{
const p=getPointerPos(e);
state.pointer.x=p.x;
state.pointer.y=p.y;
if(state.isDragging)releaseDrag(p.x,p.y);
});

canvas.addEventListener("touchstart",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
const hit=getRegionAt(p.x,p.y);
if(hit)engageDrag(p.x,p.y);
},{passive:true});

canvas.addEventListener("touchmove",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
moveDrag(p.x,p.y);
},{passive:true});

canvas.addEventListener("touchend",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.x=p.x;
state.pointer.y=p.y;
if(state.isDragging)releaseDrag(p.x,p.y);
e.preventDefault();
},{passive:false});

canvas.addEventListener("pointerleave",()=>{
state.pointer.down=false;
state.hoveredFace=null;
state.isDragging=false;
});

function animateState(){
state.tick++;

state.rotY+=state.rotVelY;
state.rotX+=state.rotVelX;

state.rotVelY*=state.isDragging?0.91:0.972;
state.rotVelX*=state.isDragging?0.91:0.972;

state.rotVelY=clamp(state.rotVelY,-0.14,0.14);
state.rotVelX=clamp(state.rotVelX,-0.14,0.14);

if(!state.isDragging){
state.rotY+=0.0008;
}

state.morphPulse*=0.94;
state.lockedPulse*=0.93;
state.overlayAlpha*=0.88;

if(state.tick%320===0&&state.activeFace){
const geo=state.cube;
if(geo&&geo.faceCenters[state.activeFace]){
spawnFirework(geo.faceCenters[state.activeFace].x,geo.faceCenters[state.activeFace].y,12,1.5);
}
}

if(state.navigateTo){
state.navigateDelay--;
state.overlayAlpha=Math.max(state.overlayAlpha,0.35);
if(state.navigateDelay<=0){
window.location.href=state.navigateTo;
}
}

for(let i=0;i<state.cloudBanks.length;i++){
const cl=state.cloudBanks[i];
cl.x+=cl.speed;
if(cl.x-cl.size>window.innerWidth+cl.size*1.6)cl.x=-cl.size*1.4;
}
}

function frame(){
animateState();
drawSceneFrame();
requestAnimationFrame(frame);
}

frame();
})();
