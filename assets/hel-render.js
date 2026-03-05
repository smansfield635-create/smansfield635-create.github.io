/* TNT — /assets/hel-render.js
   BUILD: HEL_RENDER_DRAGON_MORPH_v1
*/

(function(){
"use strict";

function evenoddFill(ctx){
try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }
}

function polyFill(ctx,pts){
ctx.beginPath();
ctx.moveTo(pts[0].x,pts[0].y);
for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y);
ctx.closePath();
evenoddFill(ctx);
}

window.HEL_RENDER = {

version:"HEL_RENDER_DRAGON_MORPH_v1",

drawDragon(ctx,frame,style){

if(!ctx||!frame) return;

const L=frame.L;
const R=frame.R;

if(!L||!R||L.length<3||R.length<3) return;

style=style||{};
const fill=style.fill||"rgba(255,255,255,0.9)";
const strokeW=style.strokeW||2;

ctx.save();

/* ===== BODY ===== */

ctx.beginPath();
ctx.moveTo(L[0].x,L[0].y);

for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x,R[i].y);

ctx.closePath();

ctx.fillStyle="rgba(0,0,0,0.25)";
evenoddFill(ctx);

ctx.fillStyle=fill;
evenoddFill(ctx);

ctx.strokeStyle="rgba(0,0,0,0.75)";
ctx.lineWidth=strokeW;
ctx.lineJoin="round";
ctx.lineCap="round";
ctx.stroke();

/* ===== HEAD ===== */

if(frame.head){

const h=frame.head;

ctx.fillStyle="rgba(0,0,0,0.4)";
polyFill(ctx,[h.tip,h.left,h.right]);

ctx.fillStyle="rgba(0,0,0,0.35)";
ctx.beginPath();
ctx.ellipse(h.cap.x,h.cap.y,h.cap.rx,h.cap.ry,0,0,Math.PI*2);
ctx.fill();
}

/* ===== HORNS ===== */

const spine=frame.spine;
const nArr=frame.n;
const tArr=frame.t;
const rad=frame.rad;

const i=frame.anchors.head;

const P=spine[i];
const t=tArr[i];
const n=nArr[i];

const r=rad[i];

const baseL={
x:P.x - t.x*r + n.x*r,
y:P.y - t.y*r + n.y*r
};

const baseR={
x:P.x - t.x*r - n.x*r,
y:P.y - t.y*r - n.y*r
};

const tipL={
x:baseL.x + t.x*2*r + n.x*0.5*r,
y:baseL.y + t.y*2*r + n.y*0.5*r
};

const tipR={
x:baseR.x + t.x*2*r - n.x*0.5*r,
y:baseR.y + t.y*2*r - n.y*0.5*r
};

ctx.fillStyle="rgba(0,0,0,0.4)";
polyFill(ctx,[baseL,tipL,{
x:baseL.x + n.x*0.6*r,
y:baseL.y + n.y*0.6*r
}]);

polyFill(ctx,[baseR,tipR,{
x:baseR.x - n.x*0.6*r,
y:baseR.y - n.y*0.6*r
}]);

/* ===== WHISKERS ===== */

function whisker(side){

const s=side;

const root={
x:P.x + t.x*r + n.x*s*r,
y:P.y + t.y*r + n.y*s*r
};

const mid={
x:root.x + t.x*2*r + n.x*s*r,
y:root.y + t.y*2*r + n.y*s*r
};

const tip={
x:root.x + t.x*4*r + n.x*s*1.5*r,
y:root.y + t.y*4*r + n.y*s*1.5*r
};

ctx.strokeStyle="rgba(0,0,0,0.6)";
ctx.lineWidth=strokeW*0.6;

ctx.beginPath();
ctx.moveTo(root.x,root.y);
ctx.quadraticCurveTo(mid.x,mid.y,tip.x,tip.y);
ctx.stroke();
}

whisker(1);
whisker(-1);

/* ===== LEGS ===== */

function leg(idx){

const P=spine[idx];
const t=tArr[idx];
const n=nArr[idx];
const r=rad[idx];

const root={
x:P.x - n.x*r,
y:P.y - n.y*r
};

const foot={
x:root.x - n.x*1.2*r,
y:root.y - n.y*1.2*r
};

ctx.lineWidth=strokeW*0.9;

ctx.beginPath();
ctx.moveTo(root.x,root.y);
ctx.lineTo(foot.x,foot.y);
ctx.stroke();
}

leg(frame.anchors.leg1);
leg(frame.anchors.leg2);
leg(frame.anchors.leg3);
leg(frame.anchors.leg4);

/* ===== RIDGE ===== */

for(let k=frame.anchors.ridge0;k<frame.anchors.ridge1;k+=4){

const P=spine[k];
const n=nArr[k];
const r=rad[k];

const base={
x:P.x + n.x*r,
y:P.y + n.y*r
};

const tip={
x:base.x + n.x*0.7*r,
y:base.y + n.y*0.7*r
};

ctx.lineWidth=strokeW*0.5;

ctx.beginPath();
ctx.moveTo(base.x,base.y);
ctx.lineTo(tip.x,tip.y);
ctx.stroke();
}

/* ===== TAIL ===== */

if(frame.tailFin){

const tf=frame.tailFin;

ctx.fillStyle="rgba(0,0,0,0.15)";
polyFill(ctx,[tf.a,tf.b,tf.c]);
}

ctx.restore();
}

};

})();
