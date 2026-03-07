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
pts.push({x,y:
