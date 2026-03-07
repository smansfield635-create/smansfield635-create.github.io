(function(){
"use strict";

const TAU=Math.PI*2;

function lerp(a,b,t){return a+(b-a)*t;}
function fract(v){return v-Math.floor(v);}
function hash(n){return fract(Math.sin(n*127.1)*43758.5453123);}

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
lanterns:[],
clouds:[],
mountains:[],
sun:{x:0,y:0,glow:0.72},
moon:{x:0,y:0,glow:0.86}
};
}

function initLanterns(state,w,h){
const count=Math.max(16,Math.round(w/120));
state.lanterns=[];
for(let i=0;i<count;i++){
const seed=i+1;
const depth=i%3===0?1:(i%3===1?0.78:0.58);
state.lanterns.push({
x:hash(seed*2.17)*w,
y:h*(0.5+hash(seed*3.91)*0.36),
size:(18+hash(seed*5.31)*12)*depth,
speed:(0.1+hash(seed*6.17)*0.16)*(0.7+depth*0.75),
sway:(8+hash(seed*7.33)*18)*(0.8+depth*0.45),
phase:hash(seed*8.07)*TAU,
flame:hash(seed*9.07)*TAU,
depth,
tilt:(hash(seed*10.11)-0.5)*0.16
});
}
return state.lanterns;
}

function initClouds(state,w,h){
const count=Math.max(8,Math.round(w/190));
state.clouds=[];
for(let i=0;i<count;i++){
const seed=i+1;
const layer=i%3;
state.clouds.push({
x:hash(seed*12.1)*w,
y:h*(layer===0?(0.16+hash(seed*1.8)*0.10):layer===1?(0.23+hash(seed*2.8)*0.10):(0.30+hash(seed*3.8)*0.10)),
size:(110+hash(seed*13.7)*120)*(layer===0?1.2:layer===1?0.95:0.72),
speed:(0.1+hash(seed*14.3)*0.12)*(layer===0?0.22:layer===1?0.38:0.6),
alpha:layer===0?0.10:layer===1?0.14:0.18,
phase:hash(seed*15.1)*TAU,
layer
});
}
return state.clouds;
}

function initMountains(state,w,h,preset){
const horizon=h*preset.horizon;
state.mountains=[];
for(let band=0;band<3;band++){
const pts=[];
const baseY=horizon+(band===0?22:(band===1?44:68));
for(let x=-120;x<=w+120;x+=80-(band*12)){
const seed=(band+1)*1000+x;
const peak=(hash(seed*0.013)-0.5)*(band===0?58:(band===1?44:30));
pts.push({x,y:baseY+peak});
}
state.mountains.push({band,pts});
}
return state.mountains;
}

function syncCelestials(state,env,tick){
if(env&&typeof env.tick==="function"){
const snapshot=env.tick(1);
if(snapshot){
state.sun.x=window.innerWidth*0.5+(snapshot.sun.x*0.18);
state.sun.y=window.innerHeight*0.22+(snapshot.sun.y*0.10);
state.sun.glow=snapshot.sun.glow||0.72;
state.moon.x=window.innerWidth*0.5+(snapshot.moon.x*0.20);
state.moon.y=window.innerHeight*0.20+(snapshot.moon.y*0.10);
state.moon.glow=snapshot.moon.glow||0.86;
window.OPENWORLD_BACKGROUND_RENDERER._state=state;
return snapshot;
}
}

const sunA=tick*0.0035;
const moonA=tick*0.0028+Math.PI;

state.sun.x=window.innerWidth*0.5+Math.cos(sunA)*(1100*0.24);
state.sun.y=window.innerHeight*0.22+Math.sin(sunA)*(1100*0.06);
state.sun.glow=0.72;

state.moon.x=window.innerWidth*0.5+Math.cos(moonA)*(980*0.26);
state.moon.y=window.innerHeight*0.20+Math.sin(moonA)*(980*0.07);
state.moon.glow=0.86;

window.OPENWORLD_BACKGROUND_RENDERER._state=state;
return null;
}

function drawSky(ctx,w,h,tick,preset,state){
const warmMix=0.28+Math.sin(tick*0.002)*0.04;
const g=ctx.createLinearGradient(0,0,0,h);
g.addColorStop(0,`rgba(${Math.round(18+18*warmMix)},${Math.round(8+8*warmMix)},${Math.round(20+20*(1-warmMix))},1)`);
g.addColorStop(0.20,`rgba(${Math.round(36+16*warmMix)},${Math.round(10+8*warmMix)},${Math.round(28+14*(1-warmMix))},1)`);
g.addColorStop(0.48,`rgba(${Math.round(84+24*warmMix)},${Math.round(20+12*warmMix)},${Math.round(48+12*(1-warmMix))},1)`);
g.addColorStop(0.72,`rgba(${Math.round(150+30*warmMix)},${Math.round(48+22*warmMix)},${Math.round(64+8*(1-warmMix))},1)`);
g.addColorStop(1,"rgba(20,6,8,1)");
ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);

const horizonY=h*preset.horizon;
const glow=ctx.createLinearGradient(0,horizonY-140,0,horizonY+120);
glow.addColorStop(0,"rgba(255,175,88,0)");
glow.addColorStop(0.22,`rgba(108,140,255,${0.08*state.moon.glow})`);
glow.addColorStop(0.48,`rgba(255,152,62,${0.16*state.sun.glow})`);
glow.addColorStop(0.72,`rgba(255,112,48,${0.18*state.sun.glow})`);
glow.addColorStop(1,"rgba(255,96,36,0)");
ctx.fillStyle=glow;
ctx.fillRect(0,horizonY-140,w,260);

for(let i=0;i<18;i++){
const sx=hash(i*3.17)*w;
const sy=hash(i*4.11)*h*0.42;
const a=0.025+hash(i*5.7)*0.06;
ctx.fillStyle=`rgba(255,245,228,${a})`;
ctx.beginPath();
ctx.arc(sx,sy,0.8+hash(i*6.1)*1.1,0,TAU);
ctx.fill();
}
}

function drawSun(ctx,w,h,state){
const x=state.sun.x;
const y=state.sun.y;
const r=Math.min(w,h)*0.045;
ctx.save();
const halo=ctx.createRadialGradient(x,y,r*0.2,x,y,r*2.6);
halo.addColorStop(0,`rgba(255,216,140,${0.20*state.sun.glow})`);
halo.addColorStop(0.45,`rgba(255,150,90,${0.14*state.sun.glow})`);
halo.addColorStop(1,"rgba(255,150,90,0)");
ctx.fillStyle=halo;
ctx.beginPath();
ctx.arc(x,y,r*2.6,0,TAU);
ctx.fill();
ctx.fillStyle="rgba(255,214,120,0.92)";
ctx.beginPath();
ctx.arc(x,y,r,0,TAU);
ctx.fill();
ctx.restore();
}

function drawMoon(ctx,w,h,state){
const x=state.moon.x;
const y=state.moon.y;
const r=Math.min(w,h)*0.074;
ctx.save();
const halo=ctx.createRadialGradient(x,y,r*0.3,x,y,r*2.2);
halo.addColorStop(0,"rgba(255,244,215,0.18)");
halo.addColorStop(0.48,"rgba(255,226,176,0.12)");
halo.addColorStop(1,"rgba(255,226,176,0)");
ctx.fillStyle=halo;
ctx.beginPath();
ctx.arc(x,y,r*2.2,0,TAU);
ctx.fill();
ctx.fillStyle="rgba(255,236,200,0.92)";
ctx.beginPath();
ctx.arc(x,y,r,0,TAU);
ctx.fill();
ctx.restore();
}

function drawClouds(ctx,state,tick,envSnapshot){
const drift=envSnapshot&&envSnapshot.weather?(envSnapshot.weather.cloudDrift||0.26):0.26;
for(const cl of state.clouds){
cl.x+=cl.speed*drift;
if(cl.x>window.innerWidth+cl.size*1.2)cl.x=-cl.size*1.2;
const x=cl.x+Math.sin(tick*0.0016+cl.phase)*18;
const y=cl.y+Math.cos(tick*0.0012+cl.phase)*4;
ctx.save();
ctx.globalAlpha=cl.alpha;
ctx.beginPath();
ctx.ellipse(x-cl.size*0.26,y,cl.size*0.34,cl.size*0.12,0,0,TAU);
ctx.ellipse(x+cl.size*0.08,y-cl.size*0.05,cl.size*0.42,cl.size*0.15,0,0,TAU);
ctx.ellipse(x+cl.size*0.42,y,cl.size*0.30,cl.size*0.11,0,0,TAU);
ctx.fillStyle="rgba(255,230,210,0.14)";
ctx.fill();
ctx.restore();
}
ctx.globalAlpha=1;
}

function drawLanterns(ctx,state,tick,northBoost){
for(const ln of state.lanterns){
const y=ln.y-Math.sin(tick*0.01+ln.phase)*ln.sway;
const x=ln.x;
const flicker=(0.82+Math.sin(tick*0.09+ln.flame)*0.12+Math.sin(tick*0.043+ln.flame*0.7)*0.06)*(northBoost||1);
ctx.save();
ctx.translate(x,y);
ctx.rotate(ln.tilt+Math.sin(tick*0.01+ln.phase)*0.04);
ctx.globalAlpha=0.95*ln.depth;
ctx.fillStyle="rgba(160,30,28,0.92)";
roundedRectPath(ctx,-6,-10,12,20,4);
ctx.fill();
ctx.globalAlpha=0.50*ln.depth;
ctx.fillStyle=`rgba(255,216,128,${0.30*flicker})`;
roundedRectPath(ctx,-2.5,-3.5,5,7,2);
ctx.fill();
ctx.restore();
}
}

function drawMountains(ctx,w,h,state,preset){
for(const band of state.mountains){
ctx.beginPath();
ctx.moveTo(-100,h);
for(const p of band.pts)ctx.lineTo(p.x,p.y);
ctx.lineTo(w+100,h);
ctx.closePath();
ctx.fillStyle=band.band===0?"rgba(28,16,18,0.78)":band.band===1?"rgba(34,18,20,0.58)":"rgba(42,20,22,0.42)";
ctx.fill();
}
}

function drawWater(ctx,w,h,tick,preset,state,env){
const horizon=h*preset.horizon;
const base=h*0.80;
const g=ctx.createLinearGradient(0,horizon,0,h);
g.addColorStop(0,"rgba(18,22,48,0.56)");
g.addColorStop(0.36,"rgba(10,14,28,0.82)");
g.addColorStop(1,"rgba(4,5,12,1)");
ctx.fillStyle=g;
ctx.fillRect(0,horizon,w,h-horizon);

const moonReflectionX=state.moon.x||w*0.80;
ctx.save();
ctx.globalAlpha=0.14;
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
ctx.beginPath();
for(let x=0;x<=w;x+=10){
const wave1=Math.sin(x*0.020+tick*0.020+layer)*6*(0.7+depth*0.4);
const wave2=Math.sin(x*0.007-tick*0.012+layer*1.3)*2.4;
const y=yBase+wave1+wave2;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,${Math.round(120+depth*80)},${Math.round(110+depth*60)},${0.028+depth*0.056})`;
ctx.lineWidth=1.2;
ctx.stroke();
}
}

window.OPENWORLD_BACKGROUND_RENDERER={
version:"OPENWORLD_BACKGROUND_RENDERER_v2",
_state:null,
createState,
initLanterns,
initClouds,
initMountains,
syncCelestials,
drawSky,
drawSun,
drawMoon,
drawClouds,
drawLanterns,
drawMountains,
drawWater
};

})();
