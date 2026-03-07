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
}

function initClouds(state,w,h){
const count=Math.max(8,Math.round(w/190));
state.clouds=[];
for(let i=0;i<count;i++){
const seed=i+1;
const layer=i%3;
state.clouds.push({
x:hash(seed*12.1)*w,
y:h*(layer===0?0.16:layer===1?0.23:0.30),
size:(110+hash(seed*13.7)*120)*(layer===0?1.2:layer===1?0.95:0.72),
speed:(0.1+hash(seed*14.3)*0.12)*(layer===0?0.22:layer===1?0.38:0.6),
alpha:layer===0?0.1:layer===1?0.14:0.18,
phase:hash(seed*15.1)*TAU,
layer
});
}
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
}

function syncCelestials(state,env,tick){

const sunA=tick*0.0035;
const moonA=tick*0.0028+Math.PI;

state.sun.x=window.innerWidth*0.5+Math.cos(sunA)*(1100*0.24);
state.sun.y=window.innerHeight*0.22+Math.sin(sunA)*(1100*0.06);

state.moon.x=window.innerWidth*0.5+Math.cos(moonA)*(980*0.26);
state.moon.y=window.innerHeight*0.20+Math.sin(moonA)*(980*0.07);
}

function drawSky(ctx,w,h,tick,preset,state){

const warmMix=0.28+Math.sin(tick*0.002)*0.04;

const g=ctx.createLinearGradient(0,0,0,h);

g.addColorStop(0,"#16050a");
g.addColorStop(0.4,"#641414");
g.addColorStop(1,"#1b0707");

ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);

}

function drawSun(ctx,w,h,state){
const x=state.sun.x;
const y=state.sun.y;
const r=Math.min(w,h)*0.045;

ctx.beginPath();
ctx.arc(x,y,r,0,TAU);
ctx.fillStyle="rgba(255,214,120,0.92)";
ctx.fill();
}

function drawMoon(ctx,w,h,state){
const x=state.moon.x;
const y=state.moon.y;
const r=Math.min(w,h)*0.074;

ctx.beginPath();
ctx.arc(x,y,r,0,TAU);
ctx.fillStyle="rgba(255,236,200,0.92)";
ctx.fill();
}

function drawClouds(ctx,state,tick){

for(const cl of state.clouds){
cl.x+=cl.speed;
if(cl.x>window.innerWidth+100)cl.x=-100;

ctx.globalAlpha=cl.alpha;
ctx.beginPath();
ctx.ellipse(cl.x,cl.y,cl.size*0.5,cl.size*0.18,0,0,TAU);
ctx.fillStyle="rgba(255,230,210,0.14)";
ctx.fill();
}

ctx.globalAlpha=1;
}

function drawLanterns(ctx,state,tick,northBoost){

for(const ln of state.lanterns){

const y=ln.y-Math.sin(tick*0.01+ln.phase)*ln.sway;
const x=ln.x;

ctx.save();
ctx.translate(x,y);

ctx.fillStyle="rgba(160,30,28,0.9)";
roundedRectPath(ctx,-6,-10,12,20,4);
ctx.fill();

ctx.restore();
}

}

function drawMountains(ctx,w,h,state,preset){

for(const band of state.mountains){

ctx.beginPath();
ctx.moveTo(-100,h);

for(const p of band.pts){
ctx.lineTo(p.x,p.y);
}

ctx.lineTo(w+100,h);
ctx.closePath();

ctx.fillStyle="rgba(32,18,18,0.6)";
ctx.fill();

}

}

function drawWater(ctx,w,h,tick,preset,state,env){

const horizon=h*preset.horizon;
const base=h*0.80;

const g=ctx.createLinearGradient(0,horizon,0,h);

g.addColorStop(0,"rgba(26,20,40,0.5)");
g.addColorStop(1,"rgba(5,5,12,1)");

ctx.fillStyle=g;
ctx.fillRect(0,horizon,w,h-horizon);

for(let layer=0;layer<10;layer++){

const depth=layer/9;
const yBase=base+layer*14;

ctx.beginPath();

for(let x=0;x<=w;x+=10){

const wave=Math.sin(x*0.02+tick*0.02+layer)*6;

const y=yBase+wave;

if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);

}

ctx.strokeStyle=`rgba(255,${Math.round(120+depth*80)},${Math.round(110+depth*60)},${0.028+depth*0.056})`;
ctx.lineWidth=1.2;
ctx.stroke();

}

}

window.OPENWORLD_BACKGROUND_RENDERER={
version:"OPENWORLD_BACKGROUND_RENDERER_v1",
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
