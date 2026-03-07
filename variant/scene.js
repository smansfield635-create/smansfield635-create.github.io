(function(){
"use strict";

const canvas=document.getElementById("scene");
if(!canvas)return;
const ctx=canvas.getContext("2d");
if(!ctx)return;

const TAU=Math.PI*2;

const KERNEL=window.WORLD_KERNEL||null;
const ENV=window.ENVIRONMENT_RUNTIME||null;
const REGIONS=window.ISLAND_REGIONS||null;
const ROUTER=window.REGION_ROUTER||null;

const LOCAL_FACE_FALLBACK={
N:{label:"NORTH",short:"N",route:null},
E:{label:"EAST",short:"E",route:"/products/"},
S:{label:"SOUTH",short:"S",route:"/laws/"},
W:{label:"WEST",short:"W",route:"/gauges/"},
C:{label:"CORE",short:"CORE",route:"/home/"},
M:{label:"MORPH",short:"MORPH",route:"SCENE_ACTION_ONLY"}
};

const PHRASE_ROLE_BY_DRAGON={
fear:"control",
wisdom:"alignment"
};

const BANNER_PHRASES={
zh:{
alignment:[
"道生一，一生二，二生三，三生萬物",
"上善若水",
"天知地知我知",
"苦盡甘來",
"德定命"
],
control:[
"少說多做",
"一時之利，千古之恨",
"當機立斷",
"性格決定命運"
]
},
en:{
alignment:[
"The Dao Gives Birth",
"Be Like Water",
"Heaven Earth I Know",
"After Bitterness Sweetness",
"Virtue Determines Fate"
],
control:[
"Speak Less Do More",
"Momentary Gain Lasting Regret",
"Act Decisively",
"Character Determines Destiny"
]
},
es:{
alignment:[
"El Dao Da Origen",
"Se Como El Agua",
"Cielo Tierra Y Yo",
"Tras Amargura Dulzura",
"La Virtud Define El Destino"
],
control:[
"Habla Menos Haz Mas",
"Ganancia Breve Arrepentimiento Largo",
"Decide Sin Vacilar",
"El Carácter Decide El Destino"
]
}
};

const state={
tick:0,
rotX:-0.32,
rotY:0.26,
rotVelX:0,
rotVelY:0,
dragging:false,
lastX:0,
lastY:0,
faceZones:{},
cube:null,
dragonLoop:false,
dragonStart:0,
navigateTo:null,
navigateDelay:0,
overlayAlpha:0,
lockedFace:null,
lockedPulse:0,
morphPulse:0,
lanterns:[],
clouds:[],
mountains:[],
fireworks:[],
sun:{
x:0,
y:0,
glow:0.72
},
moon:{
x:0,
y:0,
glow:0.86
},
regionId:(document.body&&document.body.dataset&&document.body.dataset.regionId)||"harbor_core",
regionContext:null,
showroom:{
mode:"idle",
t:0,
fragments:[],
nodes:[]
}
};

const DRAGON_CYCLE_FRAMES=1890;
const WISDOM_DELAY=0.12;
const DRAGON_SEGMENTS=44;
const DRAGON_LAG=0.0092;

function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function fract(v){return v-Math.floor(v);}
function hash(n){return fract(Math.sin(n*127.1)*43758.5453123);}
function angleBetween(a,b){return Math.atan2(b.y-a.y,b.x-a.x);}
function easeOutCubic(t){return 1-Math.pow(1-t,3);}
function easeInOutCubic(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}

function dispatch(name,detail){
document.dispatchEvent(new CustomEvent(name,{detail}));
}

function getSceneLanguage(){
try{
const qs=new URLSearchParams(window.location.search||"");
const q=qs.get("lang");
const ls=window.localStorage.getItem("gd_lang");
const lang=(q||ls||document.documentElement.lang||"en").toLowerCase();
if(lang.startsWith("zh"))return "zh";
if(lang.startsWith("es"))return "es";
return "en";
}catch(_e){
return "en";
}
}

function getCycleIndex(){
if(!state.dragonLoop)return 0;
return Math.floor(Math.max(0,state.tick-state.dragonStart)/DRAGON_CYCLE_FRAMES);
}

function getBannerPair(dragonType){
const role=PHRASE_ROLE_BY_DRAGON[dragonType]||"alignment";
const cycle=getCycleIndex();
const sceneLang=getSceneLanguage();
const secondaryLang=sceneLang==="es"?"es":"en";

const zhList=BANNER_PHRASES.zh[role]||BANNER_PHRASES.zh.alignment;
const secList=(BANNER_PHRASES[secondaryLang]&&BANNER_PHRASES[secondaryLang][role])||BANNER_PHRASES.en.alignment;

const zhPhrase=zhList[cycle%zhList.length];
const secPhrase=secList[cycle%secList.length];
const swap=cycle%2===1;

const text=dragonType==="fear"
? (swap?secPhrase:zhPhrase)
: (swap?zhPhrase:secPhrase);

return{
text,
isChinese:dragonType==="fear"?!swap:swap
};
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

function currentRegionContext(){
if(ROUTER&&typeof ROUTER.getRegionContext==="function"){
return ROUTER.getRegionContext(window.location.pathname||"/");
}
return null;
}

function currentCompassMap(){
if(ROUTER&&typeof ROUTER.compassTargetMap==="function"){
const map=ROUTER.compassTargetMap(state.regionId);
if(map)return map;
}
return null;
}

function getFaceMeta(face){
const fallback=LOCAL_FACE_FALLBACK[face];
const map=currentCompassMap();
if(!map)return fallback||null;

if(face==="M"){
return {label:"MORPH",short:"MORPH",route:"SCENE_ACTION_ONLY"};
}

if(face==="N"){
const target=map.N||(state.regionId==="harbor_core"?"gratitude_southlands":null);
if(target&&REGIONS&&REGIONS.byId){
const region=REGIONS.byId(target);
if(region)return {label:"NORTH",short:"N",route:region.route};
}
return {label:"NORTH",short:"N",route:null};
}

if(face==="E"){
const target=map.E;
if(target&&REGIONS&&REGIONS.byId){
const region=REGIONS.byId(target);
if(region)return {label:"EAST",short:"E",route:region.route};
}
return fallback;
}

if(face==="S"){
const target=map.S;
if(target&&REGIONS&&REGIONS.byId){
const region=REGIONS.byId(target);
if(region)return {label:"SOUTH",short:"S",route:region.route};
}
return fallback;
}

if(face==="W"){
const target=map.W;
if(target&&REGIONS&&REGIONS.byId){
const region=REGIONS.byId(target);
if(region)return {label:"WEST",short:"W",route:region.route};
}
return fallback;
}

if(face==="C"){
const target=map.C;
if(target&&REGIONS&&REGIONS.byId){
const region=REGIONS.byId(target);
if(region)return {label:"CORE",short:"CORE",route:region.route};
}
return fallback;
}

return fallback||null;
}

function initLanterns(){
const w=window.innerWidth||1;
const h=window.innerHeight||1;
const count=Math.max(16,Math.round(w/120));
state.lanterns=[];
for(let i=0;i<count;i++){
const seed=i+1;
const depthBand=i%3;
const depth=depthBand===0?1:(depthBand===1?0.78:0.58);
state.lanterns.push({
x:hash(seed*2.17)*w,
y:h*(0.50+hash(seed*3.91)*0.36),
size:(18+hash(seed*5.31)*12)*depth,
speed:(0.10+hash(seed*6.17)*0.16)*(0.7+depth*0.75),
sway:(8+hash(seed*7.33)*18)*(0.8+depth*0.45),
phase:hash(seed*8.07)*TAU,
flame:hash(seed*9.07)*TAU,
depth,
tilt:(hash(seed*10.11)-0.5)*0.16
});
}
}

function initClouds(){
const w=window.innerWidth||1;
const h=window.innerHeight||1;
const count=Math.max(8,Math.round(w/190));
state.clouds=[];
for(let i=0;i<count;i++){
const seed=i+1;
const layer=i%3;
state.clouds.push({
x:hash(seed*12.1)*w,
y:h*(layer===0?0.16+hash(seed*1.8)*0.10:layer===1?0.23+hash(seed*2.8)*0.10:0.30+hash(seed*3.8)*0.10),
size:(110+hash(seed*13.7)*120)*(layer===0?1.2:layer===1?0.95:0.72),
speed:(0.10+hash(seed*14.3)*0.12)*(layer===0?0.22:layer===1?0.38:0.60),
alpha:layer===0?0.10:layer===1?0.14:0.18,
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
initClouds();
initMountains();
refreshShowroomTargets();
}
window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});
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
if(state.dragonLoop)return;
state.dragonLoop=true;
state.dragonStart=state.tick;
spawnFirework(window.innerWidth*0.24,window.innerHeight*0.22,22,2.2);
spawnFirework(window.innerWidth*0.76,window.innerHeight*0.22,22,2.2);
}

function triggerLocked(face){
state.lockedFace=face;
state.lockedPulse=1;
dispatch("compass:locked",{face});
const geo=state.cube;
if(geo&&geo.faceCenters[face]){
spawnFirework(geo.faceCenters[face].x,geo.faceCenters[face].y,14,1.5);
}
}

function queueNavigation(route,face){
state.navigateTo=route;
state.navigateDelay=12;
state.overlayAlpha=1;
dispatch("compass:route",{face,route});
}

function buildShowroomNodes(){
const cx=window.innerWidth*0.5;
const cy=window.innerHeight*0.23;
const rx=Math.min(window.innerWidth,window.innerHeight)*0.22;
const ry=rx*0.48;
const labels=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW"];
const nodes=[];
for(let i=0;i<12;i++){
const a=(-Math.PI/2)+(i/12)*TAU;
nodes.push({
label:labels[i],
targetX:cx+Math.cos(a)*rx,
targetY:cy+Math.sin(a)*ry,
x:cx,
y:cy
});
}
return nodes;
}

function refreshShowroomTargets(){
if(state.showroom.nodes.length){
const rebuilt=buildShowroomNodes();
for(let i=0;i<state.showroom.nodes.length&&i<rebuilt.length;i++){
state.showroom.nodes[i].targetX=rebuilt[i].targetX;
state.showroom.nodes[i].targetY=rebuilt[i].targetY;
}
}
}

function startMorphSequence(){
if(state.showroom.mode==="show"||state.showroom.mode==="swirl"||state.showroom.mode==="shatter")return;
const geo=state.cube||getCubeGeometry();
const center={x:geo.centerX,y:geo.centerY};
const fragments=[];
const points=geo.pts;
for(let i=0;i<points.length;i++){
const p=points[i];
const a=Math.atan2(p.y-center.y,p.x-center.x)+((i%2===0)?0.22:-0.22);
const speed=18+hash(i*4.7)*26;
fragments.push({
x:p.x,
y:p.y,
vx:Math.cos(a)*speed,
vy:Math.sin(a)*speed,
r:8+hash(i*7.1)*14,
rot:hash(i*8.3)*TAU,
rotVel:(hash(i*9.1)-0.5)*0.22
});
}
state.showroom.fragments=fragments;
state.showroom.nodes=buildShowroomNodes();
state.showroom.mode="shatter";
state.showroom.t=0;
state.morphPulse=1;
dispatch("compass:morph",{face:"M",mode:"start"});
spawnFirework(center.x,center.y,28,2.8);
}

function closeMorphSequence(){
state.showroom.mode="return";
state.showroom.t=0;
dispatch("compass:morph",{face:"M",mode:"return"});
}

function selectFace(face){
const meta=getFaceMeta(face);
if(!meta)return;
if(face==="M"){
if(state.showroom.mode==="show"){
closeMorphSequence();
}else{
startMorphSequence();
}
return;
}
if(meta.route===null){
triggerLocked(face);
return;
}
const geo=state.cube;
if(geo&&geo.faceCenters[face]){
spawnFirework(geo.faceCenters[face].x,geo.faceCenters[face].y,16,1.7);
}
queueNavigation(meta.route,face);
}

function syncEnvironment(){
if(!ENV||typeof ENV.tick!=="function")return;
const snapshot=ENV.tick(1);
if(!snapshot)return;

const sunX=window.innerWidth*0.5 + (snapshot.sun.x*0.18);
const sunY=window.innerHeight*0.24 + (snapshot.sun.y*0.10);
const moonX=window.innerWidth*0.5 + (snapshot.moon.x*0.20);
const moonY=window.innerHeight*0.22 + (snapshot.moon.y*0.10);

state.sun.x=sunX;
state.sun.y=sunY;
state.sun.glow=snapshot.sun.glow;

state.moon.x=moonX;
state.moon.y=moonY;
state.moon.glow=snapshot.moon.glow;
}

function sky(){
const w=window.innerWidth;
const h=window.innerHeight;
const warmMix=0.28+Math.sin(state.tick*0.002)*0.04;
const g=ctx.createLinearGradient(0,0,0,h);
g.addColorStop(0,`rgba(${Math.round(18+25*warmMix)},${Math.round(8+10*warmMix)},${Math.round(22+34*(1-warmMix))},1)`);
g.addColorStop(0.14,`rgba(${Math.round(36+18*warmMix)},${Math.round(11+8*warmMix)},${Math.round(30+18*(1-warmMix))},1)`);
g.addColorStop(0.36,`rgba(${Math.round(72+28*warmMix)},${Math.round(18+10*warmMix)},${Math.round(46+10*(1-warmMix))},1)`);
g.addColorStop(0.58,`rgba(${Math.round(124+34*warmMix)},${Math.round(34+18*warmMix)},${Math.round(68+6*(1-warmMix))},1)`);
g.addColorStop(0.78,`rgba(${Math.round(192+28*warmMix)},${Math.round(88+24*warmMix)},${Math.round(74+4*(1-warmMix))},1)`);
g.addColorStop(1,"rgba(26,6,6,1)");
ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);

const horizonY=h*0.66;
const glow=ctx.createLinearGradient(0,horizonY-150,0,horizonY+110);
glow.addColorStop(0,"rgba(255,175,88,0)");
glow.addColorStop(0.22,`rgba(108,140,255,${0.09*state.moon.glow})`);
glow.addColorStop(0.48,`rgba(255,152,62,${0.16*state.sun.glow})`);
glow.addColorStop(0.72,`rgba(255,112,48,${0.20*state.sun.glow})`);
glow.addColorStop(1,"rgba(255,96,36,0)");
ctx.fillStyle=glow;
ctx.fillRect(0,horizonY-150,w,260);

for(let i=0;i<22;i++){
const sx=hash(i*3.17)*w;
const sy=hash(i*4.11)*h*0.42;
const a=0.03+hash(i*5.7)*0.08;
ctx.fillStyle=`rgba(255,245,228,${a})`;
ctx.beginPath();
ctx.arc(sx,sy,0.8+hash(i*6.1)*1.1,0,TAU);
ctx.fill();
}
}

function sun(){
const x=state.sun.x||window.innerWidth*0.20;
const y=state.sun.y||window.innerHeight*0.18;
const r=Math.min(window.innerWidth,window.innerHeight)*0.045;

ctx.save();
const halo=ctx.createRadialGradient(x,y,r*0.28,x,y,r*2.8);
halo.addColorStop(0,`rgba(255,190,110,${0.22*state.sun.glow})`);
halo.addColorStop(0.45,`rgba(255,146,82,${0.14*state.sun.glow})`);
halo.addColorStop(1,"rgba(255,146,82,0)");
ctx.fillStyle=halo;
ctx.beginPath();
ctx.arc(x,y,r*2.8,0,TAU);
ctx.fill();

ctx.shadowBlur=54;
ctx.shadowColor=`rgba(255,180,120,${0.18*state.sun.glow})`;
const grad=ctx.createRadialGradient(x-r*0.22,y-r*0.22,r*0.08,x,y,r*1.1);
grad.addColorStop(0,"rgba(255,248,214,0.92)");
grad.addColorStop(0.55,"rgba(255,204,130,0.88)");
grad.addColorStop(1,"rgba(226,122,72,0.86)");
ctx.fillStyle=grad;
ctx.beginPath();
ctx.arc(x,y,r,0,TAU);
ctx.fill();
ctx.restore();
}

function moon(){
const x=state.moon.x||window.innerWidth*0.80;
const y=state.moon.y||window.innerHeight*0.15;
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
const drift=(ENV&&ENV.getSnapshot)?(ENV.getSnapshot().weather.cloudDrift||0.26):0.26;
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

ctx.globalAlpha=cl.alpha*0.22;
ctx.fillStyle="rgba(255,230,212,0.26)";
ctx.beginPath();
ctx.ellipse(x+scale*0.10,y+scale*0.06,scale*0.70,scale*0.18,0.02,0,TAU);
ctx.fill();
ctx.restore();

cl.x+=cl.speed*0.12*drift;
if(cl.x-cl.size>window.innerWidth+cl.size*1.6)cl.x=-cl.size*1.4;
}

function clouds(){
for(let i=0;i<state.clouds.length;i++){
drawCloudBank(state.clouds[i]);
}
}

function lanterns(){
const h=window.innerHeight;
for(let i=0;i<state.lanterns.length;i++){
const ln=state.lanterns[i];
const driftY=(state.tick*ln.speed)%((h*0.86)+180);
const y=ln.y-driftY<-120?ln.y-driftY+(h*0.86)+200:ln.y-driftY;
const x=ln.x+Math.sin(state.tick*0.008+ln.phase)*ln.sway;
const flicker=0.82+Math.sin(state.tick*0.09+ln.flame)*0.12+Math.sin(state.tick*0.043+ln.flame*0.7)*0.06;

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
for(let p=0;p<band.pts.length;p++)ctx.lineTo(band.pts[p].x,band.pts[p].y);
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

function drawHarborTerrain(){
if(state.regionId!=="harbor_core")return;

const w=window.innerWidth;
const h=window.innerHeight;
const horizon=h*0.66;
const cx=w*0.5;

ctx.save();

ctx.beginPath();
ctx.moveTo(0,h);
ctx.lineTo(0,horizon+22);

ctx.bezierCurveTo(
w*0.08,horizon+8,
w*0.16,horizon-10,
w*0.24,horizon-20
);

ctx.bezierCurveTo(
w*0.31,horizon-22,
w*0.35,horizon+4,
w*0.39,horizon+36
);

ctx.bezierCurveTo(
w*0.43,horizon+64,
w*0.46,horizon+88,
w*0.50,horizon+98
);

ctx.bezierCurveTo(
w*0.54,horizon+88,
w*0.57,horizon+64,
w*0.61,horizon+36
);

ctx.bezierCurveTo(
w*0.65,horizon+4,
w*0.69,horizon-22,
w*0.76,horizon-20
);

ctx.bezierCurveTo(
w*0.84,horizon-10,
w*0.92,horizon+8,
w,horizon+22
);

ctx.lineTo(w,h);
ctx.closePath();

const landGrad=ctx.createLinearGradient(0,horizon-28,0,h);
landGrad.addColorStop(0,"rgba(54,34,28,0.96)");
landGrad.addColorStop(0.36,"rgba(42,24,22,0.98)");
landGrad.addColorStop(1,"rgba(18,12,14,1)");
ctx.fillStyle=landGrad;
ctx.fill();

ctx.beginPath();
ctx.moveTo(0,horizon+22);
ctx.bezierCurveTo(
w*0.08,horizon+8,
w*0.16,horizon-10,
w*0.24,horizon-20
);
ctx.bezierCurveTo(
w*0.31,horizon-22,
w*0.35,horizon+4,
w*0.39,horizon+36
);
ctx.bezierCurveTo(
w*0.43,horizon+64,
w*0.46,horizon+88,
w*0.50,horizon+98
);
ctx.bezierCurveTo(
w*0.54,horizon+88,
w*0.57,horizon+64,
w*0.61,horizon+36
);
ctx.bezierCurveTo(
w*0.65,horizon+4,
w*0.69,horizon-22,
w*0.76,horizon-20
);
ctx.bezierCurveTo(
w*0.84,horizon-10,
w*0.92,horizon+8,
w,horizon+22
);
ctx.lineWidth=2.2;
ctx.strokeStyle="rgba(255,214,150,0.18)";
ctx.stroke();

ctx.globalAlpha=0.28;
ctx.fillStyle="rgba(255,186,126,0.14)";
ctx.beginPath();
ctx.ellipse(cx,horizon+86,w*0.21,h*0.026,0,0,TAU);
ctx.fill();

ctx.restore();
}

function drawHarborVillage(){
if(state.regionId!=="harbor_core")return;

const w=window.innerWidth;
const h=window.innerHeight;
const horizon=h*0.66;
const buildings=[
{x:0.21,y:horizon-2,w:34,h:28,roof:"pagoda"},
{x:0.26,y:horizon-8,w:42,h:34,roof:"merchant"},
{x:0.32,y:horizon+2,w:38,h:30,roof:"merchant"},
{x:0.40,y:horizon+26,w:44,h:34,roof:"pagoda"},
{x:0.57,y:horizon+26,w:44,h:34,roof:"pagoda"},
{x:0.66,y:horizon+2,w:38,h:30,roof:"merchant"},
{x:0.72,y:horizon-8,w:42,h:34,roof:"merchant"},
{x:0.77,y:horizon-2,w:34,h:28,roof:"pagoda"}
];

for(let i=0;i<buildings.length;i++){
const b=buildings[i];
const bx=w*b.x;
const by=b.y;
const bw=b.w;
const bh=b.h;

ctx.save();
ctx.fillStyle="rgba(26,18,18,0.92)";
ctx.fillRect(bx-bw*0.5,by-bh,bw,bh);

if(b.roof==="pagoda"){
ctx.fillStyle="rgba(116,28,24,0.94)";
ctx.beginPath();
ctx.moveTo(bx-bw*0.68,by-bh);
ctx.lineTo(bx,by-bh-14);
ctx.lineTo(bx+bw*0.68,by-bh);
ctx.lineTo(bx+bw*0.44,by-bh+4);
ctx.lineTo(bx-bw*0.44,by-bh+4);
ctx.closePath();
ctx.fill();

ctx.fillStyle="rgba(84,20,18,0.96)";
ctx.beginPath();
ctx.moveTo(bx-bw*0.44,by-bh+4);
ctx.lineTo(bx,by-bh-6);
ctx.lineTo(bx+bw*0.44,by-bh+4);
ctx.lineTo(bx+bw*0.28,by-bh+8);
ctx.lineTo(bx-bw*0.28,by-bh+8);
ctx.closePath();
ctx.fill();
}else{
ctx.fillStyle="rgba(168,154,132,0.92)";
ctx.beginPath();
ctx.moveTo(bx-bw*0.60,by-bh);
ctx.lineTo(bx,by-bh-12);
ctx.lineTo(bx+bw*0.60,by-bh);
ctx.closePath();
ctx.fill();
}

ctx.fillStyle="rgba(255,214,150,0.20)";
for(let wi=0;wi<3;wi++){
ctx.fillRect(bx-bw*0.30+wi*(bw*0.22),by-bh*0.62,5,8);
}
ctx.restore();
}
}

function drawHarborDocks(){
if(state.regionId!=="harbor_core")return;

const w=window.innerWidth;
const h=window.innerHeight;
const horizon=h*0.66;
const dockY=horizon+78;

const docks=[
{x:0.34,len:110,wid:10},
{x:0.46,len:132,wid:12},
{x:0.54,len:132,wid:12},
{x:0.66,len:110,wid:10}
];

for(let i=0;i<docks.length;i++){
const d=docks[i];
const x=w*d.x;
	ctx.save();
	ctx.strokeStyle="rgba(92,62,48,0.96)";
	ctx.lineWidth=d.wid;
	ctx.beginPath();
	ctx.moveTo(x,dockY);
	ctx.lineTo(x,dockY+d.len);
	ctx.stroke();

	ctx.lineWidth=2;
	ctx.strokeStyle="rgba(160,114,76,0.62)";
	for(let j=0;j<5;j++){
const yy=dockY+18+j*22;
ctx.beginPath();
ctx.moveTo(x-d.wid*0.85,yy);
ctx.lineTo(x+d.wid*0.85,yy);
ctx.stroke();
}
	ctx.restore();
}

const boats=[
{x:0.28,y:dockY+52,s:22},
{x:0.72,y:dockY+58,s:26}
];

for(let i=0;i<boats.length;i++){
const b=boats[i];
const bx=w*b.x;
const by=b.y;
const s=b.s;
ctx.save();
ctx.fillStyle="rgba(34,22,24,0.94)";
ctx.beginPath();
ctx.moveTo(bx-s,by);
ctx.quadraticCurveTo(bx,by+s*0.44,bx+s,by);
ctx.lineTo(bx+s*0.74,by+8);
ctx.lineTo(bx-s*0.74,by+8);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(182,154,116,0.72)";
ctx.lineWidth=1.2;
ctx.beginPath();
ctx.moveTo(bx,by-18);
ctx.lineTo(bx,by+2);
ctx.stroke();

ctx.fillStyle="rgba(214,196,172,0.82)";
ctx.beginPath();
ctx.moveTo(bx,by-18);
ctx.lineTo(bx+s*0.72,by-6);
ctx.lineTo(bx,by-2);
ctx.closePath();
ctx.fill();
ctx.restore();
}
}

function drawNorthPath(){
if(state.regionId!=="harbor_core")return;
const w=window.innerWidth;
const h=window.innerHeight;
const horizon=h*0.66;
const cx=w*0.5;
const pathTopY=horizon-24;
const pathBottomY=horizon+104;

ctx.save();

const pathGrad=ctx.createLinearGradient(cx,pathTopY,cx,pathBottomY);
pathGrad.addColorStop(0,"rgba(170,142,108,0.18)");
pathGrad.addColorStop(1,"rgba(110,84,62,0.34)");
ctx.fillStyle=pathGrad;

ctx.beginPath();
ctx.moveTo(cx-18,pathTopY);
ctx.lineTo(cx+18,pathTopY);
ctx.lineTo(cx+74,pathBottomY);
ctx.lineTo(cx-74,pathBottomY);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(255,220,170,0.16)";
ctx.lineWidth=1.4;
ctx.beginPath();
ctx.moveTo(cx,pathTopY-16);
ctx.lineTo(cx,pathBottomY);
ctx.stroke();

ctx.fillStyle="rgba(255,214,150,0.80)";
ctx.beginPath();
ctx.moveTo(cx,pathTopY-28);
ctx.lineTo(cx+10,pathTopY-10);
ctx.lineTo(cx,pathTopY-16);
ctx.lineTo(cx-10,pathTopY-10);
ctx.closePath();
ctx.fill();

ctx.restore();
}

function water(){
const h=window.innerHeight;
const w=window.innerWidth;
const horizon=h*0.66;
const base=h*0.80;
const waveEnergy=(ENV&&ENV.getSnapshot)?(ENV.getSnapshot().weather.waveEnergy||0.34):0.34;

const g=ctx.createLinearGradient(0,horizon-24,0,h);
g.addColorStop(0,"rgba(56,20,20,0.46)");
g.addColorStop(0.16,"rgba(28,14,18,0.84)");
g.addColorStop(0.54,"rgba(11,8,14,0.96)");
g.addColorStop(1,"rgba(5,4,8,1)");
ctx.fillStyle=g;
ctx.fillRect(0,horizon-24,w,h-(horizon-24));

ctx.save();
ctx.globalAlpha=0.16;
const moonReflectionX=state.moon.x||window.innerWidth*0.80;
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

for(let layer=0;layer<10;layer++){
const depth=layer/9;
const yBase=base+layer*14;
const amp=lerp(2.0,9.6,depth)*(0.8+waveEnergy*0.6);
const f1=lerp(0.008,0.024,depth);
const f2=lerp(0.004,0.013,depth);
ctx.beginPath();
for(let x=0;x<=w;x+=10){
const wave1=Math.sin((x*f1)+(state.tick*(0.010+depth*0.028))+layer*0.72)*amp;
const wave2=Math.sin((x*f2)-(state.tick*(0.006+depth*0.010))+layer*1.22)*amp*0.52;
const wave3=Math.sin((x*0.017)+(state.tick*0.017)+layer*0.45)*amp*0.18;
const y=yBase+wave1+wave2+wave3;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,${Math.round(110+depth*70)},${Math.round(88+depth*40)},${0.018+depth*0.046})`;
ctx.lineWidth=1.35+depth*1.0;
ctx.stroke();
}

for(let crest=0;crest<5;crest++){
ctx.beginPath();
for(let x=0;x<=w;x+=14){
const y=base+crest*22+
Math.sin((x*0.020)+(state.tick*0.026)+crest*0.9)*4.2*(0.85+waveEnergy*0.5)+
Math.sin((x*0.006)-(state.tick*0.009)+crest*1.4)*2.0;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,228,176,${0.032-crest*0.004})`;
ctx.lineWidth=0.95;
ctx.stroke();
}

for(let foam=0;foam<3;foam++){
ctx.beginPath();
for(let x=0;x<=w;x+=18){
const y=base+foam*28+
Math.sin(x*0.028+state.tick*0.038+foam)*2.2+
Math.sin(x*0.011-state.tick*0.012+foam*1.8)*1.0;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,244,214,${0.020-foam*0.003})`;
ctx.lineWidth=0.8;
ctx.stroke();
}

const geo=state.cube;
if(geo){
const dragonReflectAlpha=0.08+0.02*Math.sin(state.tick*0.03);
ctx.save();
ctx.globalAlpha=dragonReflectAlpha;
const shimmer=ctx.createLinearGradient(geo.centerX-120,horizon,geo.centerX+120,h);
shimmer.addColorStop(0,"rgba(255,92,72,0)");
shimmer.addColorStop(0.30,"rgba(255,92,72,0.24)");
shimmer.addColorStop(0.52,"rgba(255,220,124,0.18)");
shimmer.addColorStop(1,"rgba(255,220,124,0)");
ctx.fillStyle=shimmer;
ctx.beginPath();
ctx.moveTo(geo.centerX-70,horizon+10);
ctx.lineTo(geo.centerX+55,horizon+10);
ctx.lineTo(geo.centerX+160,h);
ctx.lineTo(geo.centerX-170,h);
ctx.closePath();
ctx.fill();
ctx.restore();
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
return{x:lerp(x,sx,blend),y:lerp(y,sy,blend),z:lerp(z,sz,blend)};
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
for(let i=0;i<poly.length;i++){x+=poly[i].x;y+=poly[i].y;}
return{x:x/poly.length,y:y/poly.length};
}

function insetPoly(poly,amount){
const c=polyCenter(poly);
return poly.map(p=>({x:lerp(p.x,c.x,amount),y:lerp(p.y,c.y,amount)}));
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
size
};
}

function faceBaseFill(key){
if(key==="C")return "rgba(139,0,0,0.16)";
if(key==="N")return "rgba(176,24,24,0.14)";
if(key==="E"||key==="W")return "rgba(120,0,0,0.12)";
if(key==="S")return "rgba(35,0,0,0.10)";
return "rgba(70,0,0,0.08)";
}

function drawCompassPlate(poly,key){
const c=polyCenter(poly);
const meta=getFaceMeta(key)||LOCAL_FACE_FALLBACK[key];
if(key==="C"||key==="M"){
ctx.save();
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillStyle="rgba(255,244,224,0.96)";
ctx.font=`700 ${key==="C"||key==="M"?"9":"10"}px system-ui,Segoe UI,Roboto,sans-serif`;
ctx.fillText(meta.short,c.x,c.y+1.5);
ctx.restore();
return;
}

let edgeMid;
if(key==="N")edgeMid={x:(poly[0].x+poly[1].x)*0.5,y:(poly[0].y+poly[1].y)*0.5};
else if(key==="E")edgeMid={x:(poly[1].x+poly[2].x)*0.5,y:(poly[1].y+poly[2].y)*0.5};
else if(key==="S")edgeMid={x:(poly[2].x+poly[3].x)*0.5,y:(poly[2].y+poly[3].y)*0.5};
else edgeMid={x:(poly[3].x+poly[0].x)*0.5,y:(poly[3].y+poly[0].y)*0.5};

const px=lerp(c.x,edgeMid.x,0.56);
const py=lerp(c.y,edgeMid.y,0.56);
const w=22;
const h=14;

ctx.save();
roundedRectPath(px-w*0.5,py-h*0.5,w,h,4.5);
ctx.fillStyle="rgba(10,10,12,0.78)";
ctx.fill();
ctx.lineWidth=1.1;
ctx.strokeStyle="rgba(212,175,88,0.88)";
ctx.stroke();

ctx.shadowBlur=10;
ctx.shadowColor="rgba(255,215,150,0.18)";
ctx.fillStyle="rgba(255,238,190,0.96)";
ctx.font='italic 700 11px "Georgia","Times New Roman",serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(meta.short,px,py+0.5);
ctx.restore();
}

function drawBeveledFace(poly,key){
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
ctx.moveTo(inner[0].x,inner[0].y);
for(let i=1;i<inner.length;i++)ctx.lineTo(inner[i].x,inner[i].y);
ctx.closePath();
ctx.fillStyle="rgba(255,255,255,0.08)";
ctx.fill();
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

drawCompassPlate(inner,key);
}

function drawCompassHalo(geo){
const r=geo.size*2.58;
ctx.save();
ctx.translate(geo.centerX,geo.centerY);
ctx.rotate(state.tick*0.0012);
ctx.globalAlpha=0.12;
ctx.strokeStyle="rgba(220,185,102,0.76)";
ctx.lineWidth=1.1;
ctx.beginPath();
ctx.ellipse(0,0,r,r*0.40,0,0,TAU);
ctx.stroke();

const marks=["N","E","S","W"];
for(let i=0;i<4;i++){
const a=(-Math.PI/2)+(i/4)*TAU;
const x=Math.cos(a)*r;
const y=Math.sin(a)*r*0.40;
ctx.save();
ctx.translate(x,y);
ctx.fillStyle="rgba(255,226,170,0.78)";
ctx.font='italic 700 12px "Georgia","Times New Roman",serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(marks[i],0,0);
ctx.restore();
}
ctx.restore();
}

function drawCube(geo){
state.faceZones=geo.faces;
drawCompassHalo(geo);
for(const face of geo.renderFaces){
const poly=face.idxs.map(i=>geo.pts[i]);
drawBeveledFace(poly,face.key);
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

function getCycleProgress(){
if(!state.dragonLoop)return null;
return ((state.tick-state.dragonStart)%DRAGON_CYCLE_FRAMES)/DRAGON_CYCLE_FRAMES;
}

function dragonOrbit(geo,t,dragonType){
const orbitCenter=(KERNEL&&KERNEL.dragons&&KERNEL.dragons.orbitCenter)||null;
const anchorX=orbitCenter?window.innerWidth*0.5+(orbitCenter.x*0.18):geo.centerX;
const anchorY=orbitCenter?window.innerHeight*0.42-(orbitCenter.y*0.06):geo.centerY;
const radius=(KERNEL&&KERNEL.dragons&&KERNEL.dragons.orbitRadius)||420;
const radiusScale=(radius/420);
const shell=(dragonType==="fear"?geo.size*2.96:geo.size*3.42)*radiusScale;
const phase=dragonType==="fear"?0:Math.PI;
const a=t*1.18*TAU+phase;
const x=Math.sin(a)*shell;
const y=Math.sin(a)*Math.cos(a)*shell*0.40;
const z=Math.cos(a)*shell*0.46+(dragonType==="fear"?-0.18:0.18);
return{
x:anchorX+x,
y:anchorY+y,
z:z/(shell*0.46),
a
};
}

function buildDragonBody(geo,dragonType,delay){
const prog=getCycleProgress();
if(prog===null)return null;
const points=[];
for(let i=0;i<DRAGON_SEGMENTS;i++){
const raw=prog-delay-i*DRAGON_LAG;
const t=((raw%1)+1)%1;
const p=dragonOrbit(geo,t,dragonType);
const cross=1-Math.min(1,Math.abs(Math.sin(p.a+(dragonType==="fear"?0:Math.PI))));
const crossThin=1-cross*0.22;

const wavePrimary=Math.sin((state.tick*0.018)+(i*0.37)+(dragonType==="fear"?0:Math.PI))*geo.size*0.018;
const waveSecondary=Math.sin((state.tick*0.031)+(i*0.71)+(dragonType==="fear"?0.4:Math.PI+0.4))*geo.size*0.0105;
const waveTertiary=Math.cos((state.tick*0.013)+(i*0.23)+(dragonType==="fear"?0.9:Math.PI+0.9))*geo.size*0.0055;
const wave=(wavePrimary*0.62)+(waveSecondary*0.28)+(waveTertiary*0.10);

const liftPrimary=Math.cos((state.tick*0.012)+(i*0.28)+(dragonType==="fear"?0:Math.PI))*geo.size*0.011;
const liftSecondary=Math.sin((state.tick*0.022)+(i*0.49)+(dragonType==="fear"?0.6:Math.PI+0.6))*geo.size*0.0068;
const waveY=(liftPrimary*0.72)+(liftSecondary*0.28);

const nx=-Math.sin(p.a);
const ny=Math.cos(p.a)*0.22;

points.push({
x:p.x+nx*wave,
y:p.y+ny*wave+waveY,
z:p.z,
a:p.a,
crossThin
});
}
return{points};
}

function getDragonBundles(geo){
return{
fear:buildDragonBody(geo,"fear",0.00),
wisdom:buildDragonBody(geo,"wisdom",WISDOM_DELAY)
};
}

function drawPortalAt(x,y,r,colorA,colorB){
ctx.save();
ctx.translate(x,y);
ctx.rotate(Math.sin(state.tick*0.01+x*0.01)*0.12);
ctx.globalAlpha=0.55;
ctx.strokeStyle=colorA;
ctx.lineWidth=2.2;
ctx.shadowBlur=18;
ctx.shadowColor=colorB;
ctx.beginPath();
ctx.ellipse(0,0,r*0.28,r*0.09,0,0,TAU);
ctx.stroke();
ctx.beginPath();
ctx.ellipse(0,0,r*0.18,r*0.05,0,0,TAU);
ctx.stroke();
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

function drawWhiskerSet(x,y,angle,len,color,alpha,flip){
const dir=flip?-1:1;
for(let i=0;i<2;i++){
const localLen=len*(i===0?1:0.72);
ctx.save();
ctx.translate(x,y+(i===0?0:dir*3.2));
ctx.rotate(angle+dir*(0.22+i*0.12));
ctx.globalAlpha=alpha*(i===0?1:0.8);
ctx.strokeStyle=color;
ctx.lineWidth=i===0?1.9:1.35;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.quadraticCurveTo(localLen*0.16,dir*localLen*0.08,localLen*0.58,dir*localLen*0.20);
ctx.quadraticCurveTo(localLen*0.84,dir*localLen*0.28,localLen,dir*localLen*0.42);
ctx.stroke();
ctx.restore();
}
}

function drawDragonWake(bundle,color){
if(!bundle||!bundle.points||bundle.points.length<8)return;
ctx.save();
ctx.lineCap="round";
ctx.lineJoin="round";
ctx.shadowBlur=18;
ctx.shadowColor=color;
ctx.strokeStyle=color;
ctx.globalAlpha=0.18;
ctx.lineWidth=5.2;
ctx.beginPath();
ctx.moveTo(bundle.points[0].x,bundle.points[0].y);
for(let i=1;i<Math.min(bundle.points.length,16);i++){
ctx.lineTo(bundle.points[i].x,bundle.points[i].y);
}
ctx.stroke();
ctx.restore();
}

function drawDragonHead(head,next,baseFill,glowColor,accentFill,dragonType){
const a=angleBetween(head,next);
const headScale=dragonType==="fear"?1.16:1.12;

ctx.save();
ctx.translate(head.x,head.y);
ctx.rotate(a);

ctx.shadowBlur=22;
ctx.shadowColor=glowColor;

ctx.fillStyle=baseFill;
ctx.beginPath();
ctx.moveTo(34*headScale,0);
ctx.lineTo(22*headScale,-8*headScale);
ctx.lineTo(10*headScale,-18*headScale);
ctx.lineTo(-6*headScale,-20*headScale);
ctx.lineTo(-22*headScale,-13*headScale);
ctx.lineTo(-34*headScale,-4*headScale);
ctx.lineTo(-38*headScale,0);
ctx.lineTo(-34*headScale,4*headScale);
ctx.lineTo(-22*headScale,13*headScale);
ctx.lineTo(-6*headScale,20*headScale);
ctx.lineTo(10*headScale,18*headScale);
ctx.lineTo(22*headScale,8*headScale);
ctx.closePath();
ctx.fill();

ctx.fillStyle=accentFill;
ctx.beginPath();
ctx.moveTo(22*headScale,0);
ctx.lineTo(10*headScale,-8*headScale);
ctx.lineTo(-4*headScale,-7*headScale);
ctx.lineTo(-10*headScale,0);
ctx.lineTo(-4*headScale,7*headScale);
ctx.lineTo(10*headScale,8*headScale);
ctx.closePath();
ctx.fill();

ctx.fillStyle="rgba(255,248,224,0.96)";
ctx.beginPath();
ctx.arc(8*headScale,-5.5*headScale,2.7*headScale,0,TAU);
ctx.fill();
ctx.beginPath();
ctx.arc(8*headScale,5.5*headScale,1.15*headScale,0,TAU);
ctx.fill();

ctx.fillStyle="rgba(255,232,170,0.94)";
ctx.beginPath();
ctx.moveTo(4*headScale,-15*headScale);
ctx.lineTo(-10*headScale,-28*headScale);
ctx.lineTo(-3*headScale,-12*headScale);
ctx.closePath();
ctx.fill();
ctx.beginPath();
ctx.moveTo(4*headScale,15*headScale);
ctx.lineTo(-10*headScale,28*headScale);
ctx.lineTo(-3*headScale,12*headScale);
ctx.closePath();
ctx.fill();

ctx.fillStyle="rgba(255,226,152,0.88)";
ctx.beginPath();
ctx.moveTo(-10*headScale,-12*headScale);
ctx.lineTo(-26*headScale,-26*headScale);
ctx.lineTo(-16*headScale,-8*headScale);
ctx.closePath();
ctx.fill();
ctx.beginPath();
ctx.moveTo(-10*headScale,12*headScale);
ctx.lineTo(-26*headScale,26*headScale);
ctx.lineTo(-16*headScale,8*headScale);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(255,244,206,0.82)";
ctx.lineWidth=1.4*headScale;
ctx.beginPath();
ctx.moveTo(18*headScale,-2*headScale);
ctx.lineTo(30*headScale,-4*headScale);
ctx.moveTo(18*headScale,2*headScale);
ctx.lineTo(30*headScale,4*headScale);
ctx.stroke();

ctx.fillStyle="rgba(255,246,218,0.92)";
for(let i=0;i<4;i++){
const tx=(6+i*5)*headScale;
const ty=(i%2===0?-1.8:1.8)*headScale;
ctx.beginPath();
ctx.moveTo(tx,ty);
ctx.lineTo((tx+4.4*headScale),0);
ctx.lineTo(tx,-ty);
ctx.closePath();
ctx.fill();
}

ctx.restore();

drawWhiskerSet(head.x+4*headScale,head.y-3*headScale,a,48*headScale,"rgba(255,238,205,0.76)",0.92,false);
drawWhiskerSet(head.x+4*headScale,head.y+3*headScale,a,48*headScale,"rgba(255,238,205,0.76)",0.92,true);
}

function drawDragonHair(points,glowColor){
if(points.length<6)return;
const head=points[0];
const neck=points[4];
const a=angleBetween(head,neck);
for(let i=0;i<6;i++){
const len=28+i*9;
const offset=i*2.7;
ctx.save();
ctx.translate(head.x-5-offset,head.y);
ctx.rotate(a+Math.PI);
ctx.globalAlpha=0.20+(i*0.04);
ctx.strokeStyle=glowColor;
ctx.lineWidth=i<2?1.7:1.35;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.quadraticCurveTo(-len*0.18,-len*0.22,-len*0.66,-len*0.16);
ctx.quadraticCurveTo(-len,-len*0.02,-len*1.10,len*0.08);
ctx.stroke();
ctx.restore();
}
}

function drawBanner(bundle,dragonType){
if(!bundle||!bundle.points||bundle.points.length<18)return;
const pts=bundle.points;
const start=5;
const end=17;
const baseColor=dragonType==="fear"?"rgba(168,34,36,0.84)":"rgba(214,166,58,0.84)";
const edgeColor=dragonType==="fear"?"rgba(255,182,160,0.84)":"rgba(255,239,196,0.86)";
const textColor=dragonType==="fear"?"rgba(255,238,228,0.95)":"rgba(48,20,8,0.95)";
const wavePhase=state.tick*0.08+(dragonType==="fear"?0:1.4);
const phrase=getBannerPair(dragonType);

const upper=[];
const lower=[];
for(let i=start;i<=end;i++){
const p=pts[i];
const prev=pts[Math.max(0,i-1)];
const next=pts[Math.min(pts.length-1,i+1)];
const a=angleBetween(prev,next);
const nx=-Math.sin(a);
const ny=Math.cos(a);
const width=(i===start?14.6:lerp(13.4,5.4,(i-start)/(end-start)))*p.crossThin;
const flutter=Math.sin(wavePhase+i*0.55)*(i===start?1.7:2.7);
upper.push({x:p.x+nx*(width+flutter*0.18),y:p.y+ny*(width+flutter*0.28)});
lower.push({x:p.x-nx*(width*0.66+flutter*0.20),y:p.y-ny*(width*0.66+flutter*0.30)});
}

ctx.save();
ctx.globalAlpha=0.90;
ctx.beginPath();
ctx.moveTo(upper[0].x,upper[0].y);
for(let i=1;i<upper.length;i++)ctx.lineTo(upper[i].x,upper[i].y);
for(let i=lower.length-1;i>=0;i--)ctx.lineTo(lower[i].x,lower[i].y);
ctx.closePath();
const grad=ctx.createLinearGradient(upper[0].x,upper[0].y,lower[lower.length-1].x,lower[lower.length-1].y);
grad.addColorStop(0,edgeColor);
grad.addColorStop(0.16,baseColor);
grad.addColorStop(1,dragonType==="fear"?"rgba(168,34,36,0.26)":"rgba(214,166,58,0.26)");
ctx.fillStyle=grad;
ctx.fill();
ctx.lineWidth=0.9;
ctx.strokeStyle=edgeColor;
ctx.stroke();
ctx.restore();

const textAnchor=pts[11];
const leftAnchor=pts[8];
const rightAnchor=pts[14];
const textDir=angleBetween(leftAnchor,rightAnchor);
ctx.save();
ctx.translate(textAnchor.x,textAnchor.y);
ctx.rotate(textDir);
ctx.fillStyle=textColor;
ctx.font=phrase.isChinese?'italic 700 10.2px "Georgia","Times New Roman",serif':'italic 700 8.5px "Georgia","Times New Roman",serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(phrase.text,0,0);
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
const radius=(30*Math.pow(1-t,1.20)+5.8)*depthScale*p.crossThin;
const a=angleBetween(prev,next);

ctx.save();
ctx.globalAlpha=(0.95-(t*0.20))*clamp(1+p.z*0.16,0.72,1.26);
ctx.shadowBlur=17*(1+p.z*0.10);
ctx.shadowColor=glowColor;
ctx.fillStyle=baseFill;
ctx.translate(p.x,p.y);
ctx.rotate(a);
ctx.beginPath();
ctx.ellipse(0,0,radius*1.20,radius,0,0,TAU);
ctx.fill();
ctx.restore();

drawScalePatch(p.x,p.y-radius*0.10,a,radius*0.50,radius*0.24,accent,0.36);
drawScalePatch(p.x-radius*0.24,p.y+radius*0.07,a,radius*0.34,radius*0.18,"rgba(255,250,228,0.24)",0.24);
if(i%3===0){
drawScalePatch(p.x+radius*0.12,p.y-radius*0.20,a,radius*0.18,radius*0.09,"rgba(255,244,210,0.28)",0.18);
}
}

if(front){
drawBanner(bundle,dragonType);
drawDragonHair(points,glowColor);
drawDragonHead(points[0],points[3],baseFill,glowColor,accent,dragonType);
}
}

function drawDragonReflections(geo,bundles){
const horizon=window.innerHeight*0.66;
const reflectionSets=[
{bundle:bundles.fear,color:"rgba(255,100,76,0.16)"},
{bundle:bundles.wisdom,color:"rgba(255,214,126,0.14)"}
];

for(let b=0;b<reflectionSets.length;b++){
const bundle=reflectionSets[b].bundle;
if(!bundle||!bundle.points||bundle.points.length<2)continue;
ctx.save();
ctx.shadowBlur=10;
ctx.shadowColor=reflectionSets[b].color;
for(let i=bundle.points.length-1;i>=1;i-=2){
const p=bundle.points[i];
const prev=bundle.points[Math.max(0,i-1)];
const next=bundle.points[Math.min(bundle.points.length-1,i+1)];
const t=i/(bundle.points.length-1);
const a=angleBetween(prev,next);
const ry=horizon+(horizon-p.y);
const rippleX=Math.sin(state.tick*0.028+i*0.8)*1.7;
const rippleY=Math.sin(state.tick*0.017+i*0.55)*0.7;
const radius=(16*Math.pow(1-t,1.18)+2.4)*0.58;
ctx.save();
ctx.globalAlpha=0.56;
ctx.translate(p.x+rippleX,ry+rippleY);
ctx.rotate(-a);
ctx.fillStyle=reflectionSets[b].color;
ctx.beginPath();
ctx.ellipse(0,0,radius*1.22,radius*0.48,0,0,TAU);
ctx.fill();
ctx.restore();
}
ctx.restore();
}
}

function dragonsBack(geo,bundles){
if(bundles.fear&&bundles.fear.points.length){
drawPortalAt(bundles.fear.points[0].x,bundles.fear.points[0].y,geo.size,"rgba(255,96,72,0.82)","rgba(255,80,80,0.42)");
drawDragonWake(bundles.fear,"rgba(255,98,78,0.44)");
drawDragonHalf(bundles.fear,"fear","rgba(128,18,18,0.92)","rgba(210,62,40,0.52)","rgba(255,132,72,0.72)",false);
}
if(bundles.wisdom&&bundles.wisdom.points.length){
drawPortalAt(bundles.wisdom.points[0].x,bundles.wisdom.points[0].y,geo.size,"rgba(255,220,130,0.82)","rgba(255,220,130,0.36)");
drawDragonWake(bundles.wisdom,"rgba(255,214,122,0.42)");
drawDragonHalf(bundles.wisdom,"wisdom","rgba(186,132,30,0.92)","rgba(255,210,110,0.50)","rgba(255,244,188,0.76)",false);
}
}

function dragonsFront(_geo,bundles){
if(bundles.fear)drawDragonHalf(bundles.fear,"fear","rgba(128,18,18,0.92)","rgba(210,62,40,0.52)","rgba(255,132,72,0.72)",true);
if(bundles.wisdom)drawDragonHalf(bundles.wisdom,"wisdom","rgba(186,132,30,0.92)","rgba(255,210,110,0.50)","rgba(255,244,188,0.76)",true);
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

function drawShowroomFragments(){
const mode=state.showroom.mode;
if(mode!=="shatter"&&mode!=="swirl"&&mode!=="return")return;
const t=clamp(state.showroom.t,0,1);

for(let i=0;i<state.showroom.fragments.length;i++){
const frag=state.showroom.fragments[i];
let x=frag.x;
let y=frag.y;
let alpha=1;

if(mode==="shatter"){
const e=easeOutCubic(t);
x=frag.x+frag.vx*e;
y=frag.y+frag.vy*e;
alpha=1-t*0.15;
}else if(mode==="swirl"){
const node=state.showroom.nodes[i%state.showroom.nodes.length];
const cx=window.innerWidth*0.5;
const cy=window.innerHeight*0.24;
const swirlA=(i/state.showroom.fragments.length)*TAU + t*6.2;
const swirlR=lerp(160,22,t);
x=lerp(cx+Math.cos(swirlA)*swirlR,node.targetX,t);
y=lerp(cy+Math.sin(swirlA)*swirlR*0.56,node.targetY,t);
alpha=0.84;
}else if(mode==="return"){
const e=easeInOutCubic(t);
const node=state.showroom.nodes[i%state.showroom.nodes.length];
x=lerp(node.targetX,frag.x,e);
y=lerp(node.targetY,frag.y,e);
alpha=1-e*0.15;
}

ctx.save();
ctx.translate(x,y);
ctx.rotate(frag.rot + state.tick*0.02 + frag.rotVel*t*10);
ctx.globalAlpha=alpha;
ctx.fillStyle=i%2===0?"rgba(255,220,160,0.86)":"rgba(92,146,255,0.66)";
ctx.shadowBlur=14;
ctx.shadowColor=ctx.fillStyle;
ctx.beginPath();
ctx.moveTo(-frag.r*0.9,0);
ctx.lineTo(0,-frag.r*0.58);
ctx.lineTo(frag.r,0);
ctx.lineTo(0,frag.r*0.58);
ctx.closePath();
ctx.fill();
ctx.restore();
}
}

function drawShowroomCompass(){
if(state.showroom.mode!=="show"&&state.showroom.mode!=="swirl")return;
const alpha=state.showroom.mode==="show"?1:clamp(state.showroom.t,0,1);
ctx.save();
ctx.globalAlpha=0.90*alpha;

for(let i=0;i<state.showroom.nodes.length;i++){
const node=state.showroom.nodes[i];
if(state.showroom.mode==="swirl"){
const cx=window.innerWidth*0.5;
const cy=window.innerHeight*0.24;
const swirlA=(i/state.showroom.nodes.length)*TAU + state.showroom.t*6.2;
const swirlR=lerp(160,22,state.showroom.t);
node.x=lerp(cx+Math.cos(swirlA)*swirlR,node.targetX,state.showroom.t);
node.y=lerp(cy+Math.sin(swirlA)*swirlR*0.56,node.targetY,state.showroom.t);
}else{
node.x=node.targetX;
node.y=node.targetY;
}

ctx.save();
roundedRectPath(node.x-20,node.y-12,40,24,12);
ctx.fillStyle="rgba(18,18,28,0.82)";
ctx.fill();
ctx.lineWidth=1.3;
ctx.strokeStyle=i%3===0?"rgba(255,216,150,0.82)":"rgba(120,168,255,0.78)";
ctx.stroke();
ctx.fillStyle="rgba(255,246,230,0.96)";
ctx.font='italic 700 10px "Georgia","Times New Roman",serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(node.label,node.x,node.y+0.5);
ctx.restore();
}

ctx.globalAlpha=0.82*alpha;
ctx.fillStyle="rgba(255,245,235,0.94)";
ctx.font="700 14px system-ui,Segoe UI,Roboto,sans-serif";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText("12-FACE SHOWROOM",window.innerWidth*0.5,window.innerHeight*0.11);
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
ctx.fillText(`${(getFaceMeta(state.lockedFace)||LOCAL_FACE_FALLBACK[state.lockedFace]).label} LOCKED`,x+w*0.5,y+h*0.5);
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
sun();
moon();
clouds();
lanterns();
mountains();
water();
if(window.HARBOR_RENDERER){
HARBOR_RENDERER.draw(ctx,window.innerWidth,window.innerHeight,state.tick);
}
const geo=getCubeGeometry();
state.cube=geo;
const bundles=getDragonBundles(geo);

drawDragonReflections(geo,bundles);
dragonsBack(geo,bundles);

if(state.showroom.mode==="idle"||state.showroom.mode==="return"||state.showroom.mode==="shatter"){
drawCube(geo);
}

dragonsFront(geo,bundles);
drawShowroomFragments();
drawShowroomCompass();
fireworks();
drawLockedOverlay();
drawNavigationOverlay();
}

function getRegionAt(x,y){
if(state.showroom.mode==="show")return "M";
for(const key of ["C","W","E","N","S","M"]){
const poly=state.faceZones[key];
if(poly&&pointInPoly(x,y,poly))return key;
}
return null;
}

function engageDrag(x,y){
state.dragging=true;
state.lastX=x;
state.lastY=y;
const hit=getRegionAt(x,y);
if(hit&&!state.dragonLoop)startDragonLoop();
}

function moveDrag(x,y){
if(!state.dragging)return;
if(state.showroom.mode==="show"||state.showroom.mode==="swirl"||state.showroom.mode==="shatter")return;
const dx=x-state.lastX;
const dy=y-state.lastY;
state.lastX=x;
state.lastY=y;
state.rotVelY+=dx*0.0010;
state.rotVelX+=dy*0.0010;
}

function releaseDrag(x,y){
const hit=getRegionAt(x,y);
state.dragging=false;
if(hit)selectFace(hit);
}

canvas.addEventListener("pointermove",e=>{
const p=getPointerPos(e);
moveDrag(p.x,p.y);
},{passive:true});

canvas.addEventListener("pointerdown",e=>{
const p=getPointerPos(e);
engageDrag(p.x,p.y);
dispatch("environment:tap",{x:e.clientX,y:e.clientY});
});

canvas.addEventListener("pointerup",e=>{
const p=getPointerPos(e);
releaseDrag(p.x,p.y);
});

canvas.addEventListener("touchstart",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
engageDrag(p.x,p.y);
dispatch("environment:tap",{x:touch.clientX,y:touch.clientY});
},{passive:true});

canvas.addEventListener("touchmove",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
moveDrag(p.x,p.y);
},{passive:true});

canvas.addEventListener("touchend",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
releaseDrag(p.x,p.y);
e.preventDefault();
},{passive:false});

canvas.addEventListener("pointerleave",()=>{
state.dragging=false;
});

document.addEventListener("compass:morph",function(e){
if(e&&e.detail&&e.detail.mode==="return")closeMorphSequence();
});

function updateShowroomState(){
const mode=state.showroom.mode;
if(mode==="idle")return;

if(mode==="shatter"){
state.showroom.t+=0.075;
if(state.showroom.t>=1){
state.showroom.mode="swirl";
state.showroom.t=0;
}
return;
}

if(mode==="swirl"){
state.showroom.t+=0.055;
if(state.showroom.t>=1){
state.showroom.mode="show";
state.showroom.t=1;
}
return;
}

if(mode==="show"){
return;
}

if(mode==="return"){
state.showroom.t+=0.065;
if(state.showroom.t>=1){
state.showroom.mode="idle";
state.showroom.t=0;
state.showroom.fragments=[];
}
}
}

function animateState(){
state.tick++;
state.regionContext=currentRegionContext();
if(state.regionContext)state.regionId=state.regionContext.regionId||state.regionId;

syncEnvironment();

state.rotY+=state.rotVelY;
state.rotX+=state.rotVelX;

state.rotVelY*=state.dragging?0.91:0.972;
state.rotVelX*=state.dragging?0.91:0.972;

state.rotVelY=clamp(state.rotVelY,-0.14,0.14);
state.rotVelX=clamp(state.rotVelX,-0.14,0.14);

if(!state.dragging&&state.showroom.mode==="idle")state.rotY+=0.0008;

state.morphPulse*=0.94;
state.lockedPulse*=0.93;
state.overlayAlpha*=0.88;

updateShowroomState();

if(state.navigateTo){
state.navigateDelay--;
state.overlayAlpha=Math.max(state.overlayAlpha,0.35);
if(state.navigateDelay<=0)window.location.href=state.navigateTo;
}
}

function frame(){
animateState();
drawSceneFrame();
requestAnimationFrame(frame);
}

frame();
})();
