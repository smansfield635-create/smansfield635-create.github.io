/* TNT — /variant/scene.js
   PRESERVATION-FIRST UPGRADE
   Changes only Layer 1 navigator

   Keeps:
   sky
   moon
   water
   compass
   dragons
   frame loop

   Replaces:
   drawLayer1Guide() with real cube renderer
*/

(function(){
"use strict";

const canvas=document.getElementById("scene")||document.getElementById("bgCanvas");
if(!canvas)return;

const ctx=canvas.getContext("2d",{alpha:true});
if(!ctx)return;

const state={
tick:0,
layer:1
};

function resize(){
const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
canvas.width=Math.floor(window.innerWidth*dpr);
canvas.height=Math.floor(window.innerHeight*dpr);
canvas.style.width=window.innerWidth+"px";
canvas.style.height=window.innerHeight+"px";
ctx.setTransform(dpr,0,0,dpr,0,0);
}

window.addEventListener("resize",resize);

function drawSky(w,h){
const g=ctx.createLinearGradient(0,0,0,h);
g.addColorStop(0,"#240a0a");
g.addColorStop(.30,"#7a1b14");
g.addColorStop(.68,"#d74c22");
g.addColorStop(1,"#1a0606");
ctx.fillStyle=g;
ctx.fillRect(0,0,w,h);
}

function drawMoon(w,h){
const x=w*.80;
const y=h*.18;
const r=Math.max(22,Math.min(w,h)*.034);

ctx.beginPath();
ctx.arc(x,y,r,0,Math.PI*2);
ctx.fillStyle="rgba(230,230,220,.95)";
ctx.fill();
}

function drawWater(w,h,t){

const base=h*.74;

for(let r=0;r<6;r++){

ctx.beginPath();

for(let x=0;x<=w;x+=10){

const y=
base+r*18+
Math.sin(x*.015+t*.90+r*.45)*6+
Math.sin(x*.032+t*.42)*2;

if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);

}

ctx.strokeStyle="rgba(255,235,210,"+(0.05+r*.02)+")";
ctx.lineWidth=1.1;
ctx.stroke();

}

}

function drawCompass(w,h,t){

const cx=w*.50;
const cy=h*.56;
const r=Math.min(w,h)*.29;

ctx.beginPath();
ctx.arc(cx,cy,r,0,Math.PI*2);
ctx.strokeStyle="rgba(255,248,235,.12)";
ctx.lineWidth=2;
ctx.stroke();

for(let i=0;i<60;i++){

const a=-Math.PI/2+(i/60)*Math.PI*2;

ctx.beginPath();
ctx.moveTo(cx,cy);
ctx.lineTo(
cx+Math.cos(a)*r,
cy+Math.sin(a)*r
);

ctx.strokeStyle="rgba(255,245,230,.06)";
ctx.lineWidth=1;
ctx.stroke();

}

}

function drawCube(w,h,t){

const cx=w*.50;
const cy=h*.56;

const size=Math.min(w,h)*.15;
const depth=size*.45;

const rot=t*.6;

const ox=Math.cos(rot)*depth;
const oy=Math.sin(rot*.7)*depth*.4;

const fx=cx-size/2;
const fy=cy-size/2;

const bx=fx+ox;
const by=fy-oy;

const front=[
[fx,fy],
[fx+size,fy],
[fx+size,fy+size],
[fx,fy+size]
];

const back=[
[bx,by],
[bx+size,by],
[bx+size,by+size],
[bx,by+size]
];

ctx.lineWidth=2;
ctx.strokeStyle="rgba(255,245,230,.92)";

ctx.beginPath();
ctx.moveTo(front[0][0],front[0][1]);
for(let i=1;i<4;i++)ctx.lineTo(front[i][0],front[i][1]);
ctx.closePath();
ctx.stroke();

ctx.beginPath();
ctx.moveTo(back[0][0],back[0][1]);
for(let i=1;i<4;i++)ctx.lineTo(back[i][0],back[i][1]);
ctx.closePath();
ctx.stroke();

for(let i=0;i<4;i++){
ctx.beginPath();
ctx.moveTo(front[i][0],front[i][1]);
ctx.lineTo(back[i][0],back[i][1]);
ctx.stroke();
}

ctx.fillStyle="rgba(235,199,120,.95)";
ctx.font="900 18px system-ui";
ctx.textAlign="center";
ctx.textBaseline="middle";

ctx.fillText("N",cx,fy-26);
ctx.fillText("E",fx+size+26,cy);
ctx.fillText("S",cx,fy+size+26);
ctx.fillText("W",fx-26,cy);

}

function buildDragon(dir,offset,phase){

const seg=40;
const spacing=18;

const start=dir>0?-canvas.width*.34:canvas.width*1.34;
const end=dir>0?canvas.width*1.34:-canvas.width*.34;

const p=(state.tick*.0006+phase)%1;

const head=start+(end-start)*p;

const baseY=canvas.height*.31+offset;

const pts=[];

for(let i=0;i<seg;i++){

const x=head-dir*i*spacing;

const y=
baseY+
Math.sin(p*8+i*.35)*20+
Math.sin(p*3+i*.22)*14;

const size=16-i*.35;

pts.push({x,y,size});

}

return pts;

}

function drawDragon(points,color,dir){

const up=[];
const down=[];

for(let i=0;i<points.length;i++){

const p=points[i];

const prev=points[Math.max(0,i-1)];
const next=points[Math.min(points.length-1,i+1)];

const dx=next.x-prev.x;
const dy=next.y-prev.y;

const len=Math.max(1,Math.hypot(dx,dy));

const nx=-dy/len;
const ny=dx/len;

up.push({x:p.x+nx*p.size,y:p.y+ny*p.size});
down.push({x:p.x-nx*p.size,y:p.y-ny*p.size});

}

ctx.beginPath();

ctx.moveTo(up[0].x,up[0].y);

for(let i=1;i<up.length;i++)
ctx.lineTo(up[i].x,up[i].y);

for(let i=down.length-1;i>=0;i--)
ctx.lineTo(down[i].x,down[i].y);

ctx.closePath();

ctx.fillStyle=color;
ctx.fill();

}

function frame(){

state.tick++;

const w=window.innerWidth;
const h=window.innerHeight;
const t=state.tick*.012;

ctx.clearRect(0,0,w,h);

drawSky(w,h);
drawMoon(w,h);
drawWater(w,h,t);
drawCompass(w,h,t);

if(state.layer===1){
drawCube(w,h,t);
}

const wise=buildDragon(1,-28,0);
const fear=buildDragon(-1,42,.23);

drawDragon(wise,"rgba(55,160,90,.9)",1);
drawDragon(fear,"rgba(178,32,30,.9)",-1);

requestAnimationFrame(frame);

}

window.navigatorLayer=function(n){
state.layer=Number(n)===2?2:1;
};

resize();
frame();

})();
