(function(){

"use strict";

/*
HARBOR_RENDERER_v1
Purpose:
Render Horseshoe Harbor environment layer beneath the compass cube.

Rules:
• Lightweight geometry
• No interference with cube rendering
• Uses existing canvas context
• Called from scene engine
*/

const HARBOR={};

HARBOR.draw=function(ctx,width,height,tick){

const horizon=height*0.66;
const harborRadius=Math.min(width,height)*0.34;
const centerX=width/2;
const centerY=horizon+20;

/* =====================================================
   HORSESHOE LAND MASS
===================================================== */

ctx.save();

ctx.fillStyle="rgba(40,22,18,0.92)";
ctx.beginPath();

for(let i=0;i<=180;i+=6){
const a=(i/180)*Math.PI;
const r=harborRadius*(0.9+Math.sin(i*0.1)*0.02);
const x=centerX+Math.cos(a)*r;
const y=centerY+Math.sin(a)*r*0.45;
if(i===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}

ctx.lineTo(centerX+harborRadius*1.05, height);
ctx.lineTo(centerX-harborRadius*1.05, height);

ctx.closePath();
ctx.fill();

ctx.restore();

/* =====================================================
   DOCK PIERS
===================================================== */

ctx.save();

ctx.strokeStyle="rgba(210,170,110,0.85)";
ctx.lineWidth=3;

for(let i=-2;i<=2;i++){

const x=centerX+i*48;

ctx.beginPath();
ctx.moveTo(x,horizon+6);
ctx.lineTo(x,horizon+70);
ctx.stroke();

ctx.lineWidth=2;

for(let j=0;j<6;j++){
ctx.beginPath();
ctx.moveTo(x-8,horizon+14+j*10);
ctx.lineTo(x+8,horizon+14+j*10);
ctx.stroke();
}

}

ctx.restore();

/* =====================================================
   HARBOR VILLAGE
===================================================== */

ctx.save();

for(let i=-4;i<=4;i++){

const x=centerX+i*70;
const y=horizon-10-Math.abs(i)*4;

ctx.fillStyle="rgba(55,34,30,0.95)";
ctx.fillRect(x-18,y-16,36,16);

ctx.fillStyle="rgba(110,60,50,0.95)";
ctx.beginPath();
ctx.moveTo(x-20,y-16);
ctx.lineTo(x+20,y-16);
ctx.lineTo(x,y-28);
ctx.closePath();
ctx.fill();

}

ctx.restore();

/* =====================================================
   HARBOR WATER GLOW
===================================================== */

ctx.save();

const g=ctx.createRadialGradient(
centerX,
horizon+20,
40,
centerX,
horizon+20,
harborRadius*0.7
);

g.addColorStop(0,"rgba(255,200,120,0.18)");
g.addColorStop(1,"rgba(0,0,0,0)");

ctx.fillStyle=g;

ctx.beginPath();
ctx.ellipse(centerX,horizon+20,harborRadius*0.9,harborRadius*0.34,0,0,Math.PI*2);
ctx.fill();

ctx.restore();

};

/* =====================================================
   EXPORT
===================================================== */

window.HARBOR_RENDERER=HARBOR;

})();
