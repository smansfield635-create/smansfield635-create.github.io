(function(){
"use strict";

const TAU=Math.PI*2;

function fract(v){return v-Math.floor(v);}
function hash(n){return fract(Math.sin(n*127.1)*43758.5453123);}
function lerp(a,b,t){return a+(b-a)*t;}

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

function initClouds(state,w,h){

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

function initMountains(state,w,h,preset){

const horizon=h*preset.horizon;

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

function syncCelestials(state,env,tick){

if(env&&env.getSnapshot){

const snap=env.getSnapshot();

state.sun.x=window.innerWidth*0.5+(snap.sun.x*0.18);
state.sun.y=window.innerHeight*0.24+(snap.sun.y*0.10);
state.sun.glow=snap.sun.glow;

state.moon.x=window.innerWidth*0.5+(snap.moon.x*0.20);
state.moon.y=window.innerHeight*0.22+(snap.moon.y*0.10);
state.moon.glow=snap.moon.glow;

return;

}

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

g.addColorStop(0,"rgba(18,8,22,1)");
g.addColorStop(0.3,"rgba(52,20,38,1)");
g.addColorStop(0.6,"rgba(102,38,42,1)");
g.addColorStop(1,"rgba(20,6,10,1)");

ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);

}

function drawSun(ctx,w,h,state){

const x=state.sun.x;
const y=state.sun.y;

ctx.save();
ctx.fillStyle="rgba(255,200,120,0.8)";
ctx.beginPath();
ctx.arc(x,y,18,0,TAU);
ctx.fill();
ctx.restore();

}

function drawMoon(ctx,w,h,state){

const x=state.moon.x;
const y=state.moon.y;

ctx.save();
ctx.fillStyle="rgba(255,244,210,0.85)";
ctx.beginPath();
ctx.arc(x,y,26,0,TAU);
ctx.fill();
ctx.restore();

}

function drawClouds(ctx,state,tick){

for(let i=0;i<state.clouds.length;i++){

const cl=state.clouds[i];

const x=cl.x+Math.sin(tick*0.0016+cl.phase)*18;
const y=cl.y;

ctx.save();

ctx.globalAlpha=cl.alpha;
ctx.fillStyle="rgba(255,255,255,0.12)";
ctx.beginPath();
ctx.ellipse(x,y,cl.size*0.5,cl.size*0.18,0,0,TAU);
ctx.fill();

ctx.restore();

}

}

function drawLanterns(ctx,state,tick,boost){

for(let i=0;i<state.lanterns.length;i++){

const ln=state.lanterns[i];

const x=ln.x+Math.sin(tick*0.008+ln.phase)*ln.sway;
const y=ln.y-(tick*ln.speed%800);

ctx.save();

ctx.globalAlpha=0.7*ln.depth;

ctx.fillStyle="rgba(200,40,40,0.9)";
roundedRectPath(ctx,x-6,y-12,12,18,4);
ctx.fill();

ctx.fillStyle="rgba(255,220,140,0.8)";
ctx.fillRect(x-2,y-8,4,4);

ctx.restore();

}

}

function drawMountains(ctx,w,h,state,preset){

const horizon=h*preset.horizon;

for(let i=state.mountains.length-1;i>=0;i--){

const band=state.mountains[i];

ctx.beginPath();
ctx.moveTo(-140,h);

for(let p=0;p<band.pts.length;p++){
ctx.lineTo(band.pts[p].x,band.pts[p].y);
}

ctx.lineTo(w+140,h);
ctx.closePath();

ctx.fillStyle="rgba(24,12,18,0.85)";
ctx.fill();

}

}

function drawWater(ctx,w,h,tick,preset,state,env){

const horizon=h*preset.horizon;

ctx.fillStyle="rgba(8,10,18,0.95)";
ctx.fillRect(0,horizon,w,h-horizon);

}

window.OPENWORLD_BACKGROUND_RENDERER=Object.freeze({

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

});

})();
