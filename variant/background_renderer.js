(function(){
"use strict";

const TAU=Math.PI*2;

function fract(v){
return v-Math.floor(v);
}

function hash(n){
return fract(Math.sin(n*127.1)*43758.5453123);
}

function roundedRectPath(ctx,x,y,w,h,r){
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

function createState(){
return{
clouds:[],
lanterns:[],
mountains:[],
sun:{x:0,y:0,r:0},
moonA:{x:0,y:0,r:0},
moonB:{x:0,y:0,r:0},
phase:0
};
}

function initClouds(state,w,h){
state.clouds=[];
const count=Math.max(7,Math.round(w/200));
for(let i=0;i<count;i++){
const seed=i+1;
state.clouds.push({
x:hash(seed*2.7)*w,
y:h*(0.10+(hash(seed*5.3)*0.24)),
w:(100+hash(seed*7.9)*170),
h:(24+hash(seed*11.1)*42),
speed:0.10+hash(seed*13.7)*0.18,
alpha:0.07+hash(seed*17.1)*0.12
});
}
}

function initLanterns(state,w,h){
state.lanterns=[];
const count=Math.max(16,Math.round(w/115));
for(let i=0;i<count;i++){
const seed=i+1;
state.lanterns.push({
x:hash(seed*3.1)*w,
y:h*(0.33+(hash(seed*4.9)*0.36)),
sway:8+hash(seed*6.7)*18,
phase:hash(seed*8.3)*TAU,
size:10+hash(seed*9.7)*9
});
}
}

function initMountains(state,w,h,preset){
state.mountains=[];
const horizon=h*((preset&&preset.horizon)||0.615);

for(let band=0;band<3;band++){
const pts=[];
const baseY=horizon+(band===0?24:(band===1?62:104));
const step=band===0?86:(band===1?72:58);
const amp=band===0?58:(band===1?40:26);

for(let x=-120;x<=w+120;x+=step){
const seed=(band+1)*10000+x;
pts.push({
x:x,
y:baseY+((hash(seed*0.013)-0.5)*amp)
});
}

state.mountains.push({pts:pts,band:band});
}
}

function syncCelestials(state,env,tick){
const t=(typeof tick==="number"&&isFinite(tick))?tick:0;
const w=window.innerWidth||1280;
const h=window.innerHeight||720;

state.phase=t*0.0030;

state.sun.x=w*(0.18+((Math.sin(state.phase)*0.23)+0.23));
state.sun.y=h*(0.19+(Math.cos(state.phase*0.85)*0.05));
state.sun.r=Math.min(w,h)*0.040;

state.moonA.x=w*(0.27+Math.cos(state.phase+1.0)*0.05);
state.moonA.y=h*(0.17+Math.sin(state.phase+1.0)*0.03);
state.moonA.r=Math.min(w,h)*0.050;

state.moonB.x=w*(0.76+Math.cos(state.phase+Math.PI)*0.06);
state.moonB.y=h*(0.16+Math.sin(state.phase+Math.PI)*0.035);
state.moonB.r=Math.min(w,h)*0.062;
}

function drawSky(ctx,w,h,tick,preset,state){
const g=ctx.createLinearGradient(0,0,0,h);
g.addColorStop(0,"#13060b");
g.addColorStop(0.40,"#5c1612");
g.addColorStop(1,"#17070a");
ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);

ctx.save();
ctx.globalAlpha=0.10;
ctx.fillStyle="rgba(255,230,190,0.8)";
ctx.beginPath();
ctx.arc(w*0.78,h*0.18,Math.min(w,h)*0.17,0,TAU);
ctx.fill();
ctx.restore();
}

function drawSun(ctx,w,h,state){
ctx.save();
ctx.beginPath();
ctx.arc(state.sun.x,state.sun.y,state.sun.r,0,TAU);
ctx.fillStyle="rgba(255,214,120,0.92)";
ctx.fill();
ctx.restore();
}

function drawMoonCore(ctx,moon,fill){
ctx.beginPath();
ctx.arc(moon.x,moon.y,moon.r,0,TAU);
ctx.fillStyle=fill;
ctx.fill();
ctx.beginPath();
ctx.arc(moon.x+(moon.r*0.18),moon.y-(moon.r*0.06),moon.r*0.92,0,TAU);
ctx.fillStyle="rgba(255,248,232,0.22)";
ctx.fill();
}

function drawMoon(ctx,w,h,state){
ctx.save();
drawMoonCore(ctx,state.moonA,"rgba(255,220,170,0.88)");
drawMoonCore(ctx,state.moonB,"rgba(255,238,205,0.92)");
ctx.restore();
}

function drawClouds(ctx,state,tick,env){
ctx.save();
for(let i=0;i<state.clouds.length;i++){
const cl=state.clouds[i];
cl.x+=cl.speed;
if(cl.x>window.innerWidth+(cl.w*0.8))cl.x=-(cl.w*0.8);

ctx.globalAlpha=cl.alpha;
ctx.fillStyle="rgba(255,228,210,0.22)";
ctx.beginPath();
ctx.ellipse(cl.x,cl.y,cl.w*0.50,cl.h*0.55,0,0,TAU);
ctx.fill();
ctx.beginPath();
ctx.ellipse(cl.x-(cl.w*0.24),cl.y+(cl.h*0.06),cl.w*0.26,cl.h*0.42,0,0,TAU);
ctx.fill();
ctx.beginPath();
ctx.ellipse(cl.x+(cl.w*0.24),cl.y+(cl.h*0.02),cl.w*0.30,cl.h*0.44,0,0,TAU);
ctx.fill();
}
ctx.restore();
}

function drawLanterns(ctx,state,tick,northBoost){
ctx.save();
for(let i=0;i<state.lanterns.length;i++){
const ln=state.lanterns[i];
const x=ln.x;
const y=ln.y-(Math.sin((tick*0.012)+ln.phase)*ln.sway*0.35);
const glow=(0.18+(Math.sin((tick*0.04)+ln.phase)*0.04))*((typeof northBoost==="number")?northBoost:1);

ctx.globalAlpha=glow;
ctx.beginPath();
ctx.arc(x,y,ln.size*1.15,0,TAU);
ctx.fillStyle="rgba(255,206,132,0.28)";
ctx.fill();

ctx.globalAlpha=0.94;
ctx.fillStyle="rgba(148,34,26,0.96)";
roundedRectPath(ctx,x-(ln.size*0.42),y-(ln.size*0.56),ln.size*0.84,ln.size*1.1,3.6);
ctx.fill();

ctx.globalAlpha=0.86;
ctx.fillStyle="rgba(255,214,140,0.92)";
ctx.beginPath();
ctx.arc(x,y-(ln.size*0.04),ln.size*0.18,0,TAU);
ctx.fill();
}
ctx.restore();
}

function drawMountains(ctx,w,h,state,preset){
for(let i=0;i<state.mountains.length;i++){
const band=state.mountains[i];
ctx.beginPath();
ctx.moveTo(-120,h);
for(let j=0;j<band.pts.length;j++){
ctx.lineTo(band.pts[j].x,band.pts[j].y);
}
ctx.lineTo(w+120,h);
ctx.closePath();

ctx.fillStyle=band.band===0?"rgba(35,16,17,0.82)":(band.band===1?"rgba(28,13,15,0.74)":"rgba(22,10,12,0.66)");
ctx.fill();
}
}

function drawWater(ctx,w,h,tick,preset,state,env){
const horizon=h*((preset&&preset.horizon)||0.615);
const g=ctx.createLinearGradient(0,horizon,0,h);
g.addColorStop(0,"rgba(28,18,40,0.54)");
g.addColorStop(1,"rgba(8,8,18,0.96)");
ctx.fillStyle=g;
ctx.fillRect(0,horizon,w,h-horizon);

ctx.save();
for(let layer=0;layer<8;layer++){
const depth=layer/7;
const yBase=h*(0.74+(layer*0.022));
ctx.beginPath();
for(let x=0;x<=w;x+=10){
const wave=Math.sin((x*0.022)+(tick*0.024)+(layer*0.7))*((5-depth*1.8));
const y=yBase+wave;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.lineWidth=1.0+depth*0.4;
ctx.strokeStyle="rgba(255,170,150,"+(0.040+(depth*0.05))+")";
ctx.stroke();
}
ctx.restore();
}

window.OPENWORLD_BACKGROUND_RENDERER=Object.freeze({
version:"OPENWORLD_BACKGROUND_RENDERER_vMAX1",
createState:createState,
initClouds:initClouds,
initLanterns:initLanterns,
initMountains:initMountains,
syncCelestials:syncCelestials,
drawSky:drawSky,
drawSun:drawSun,
drawMoon:drawMoon,
drawClouds:drawClouds,
drawLanterns:drawLanterns,
drawMountains:drawMountains,
drawWater:drawWater
});
})();
