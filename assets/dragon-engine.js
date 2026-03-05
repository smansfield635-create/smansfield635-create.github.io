/* TNT — /assets/dragon-engine.js
   BUILD: HEX_DRAGON_ENGINE_v5_SEGMENTED
   PURPOSE:
   - Variable segment lengths (head/neck/torso/tail)
   - Longer dragon silhouette
   - Thin pointed head
   - Larger shoulder mass
   - Proper taper to tail
*/

(function(){

if(window.__HEX_DRAGON_RUNNING__) return;
window.__HEX_DRAGON_RUNNING__ = true;

const HEX_SIZE = 3;

/* segment lengths */
const HEAD_LEN = 8;
const NECK_LEN = 14;
const SHOULDER_LEN = 20;
const TORSO_LEN = 60;
const TAIL_LEN = 40;

const SPINE_LEN =
HEAD_LEN +
NECK_LEN +
SHOULDER_LEN +
TORSO_LEN +
TAIL_LEN;

const canvas = document.createElement("canvas");
canvas.style.position="fixed";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
canvas.style.zIndex="6";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

/* hex draw */
function hex(q,r){

const x = HEX_SIZE*Math.sqrt(3)*(q + r/2);
const y = HEX_SIZE*1.5*r;

ctx.beginPath();

for(let i=0;i<6;i++){
const a=Math.PI/3*i;
const px=x+HEX_SIZE*Math.cos(a);
const py=y+HEX_SIZE*Math.sin(a);

if(i===0) ctx.moveTo(px,py);
else ctx.lineTo(px,py);
}

ctx.closePath();
ctx.fill();

}

/* radius profile by section */

function radius(i){

if(i < HEAD_LEN) return 1;

if(i < HEAD_LEN + NECK_LEN)
return 1;

if(i < HEAD_LEN + NECK_LEN + SHOULDER_LEN)
return 4;

if(i < HEAD_LEN + NECK_LEN + SHOULDER_LEN + TORSO_LEN)
return 3;

return 1;

}

/* dragon builder */

function dragon(spineX,spineY,dir,color){

ctx.fillStyle=color;

for(let i=0;i<SPINE_LEN;i++){

const q = spineX + dir*i;
const r = spineY + Math.sin(i*0.18)*2;

const rad = radius(i);

for(let dq=-rad;dq<=rad;dq++){
for(let dr=-rad;dr<=rad;dr++){

if(Math.abs(dq)+Math.abs(dr)<=rad){
hex(q+dq,r+dr);
}

}
}

}

}

/* animation */

let t=0;

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.save();
ctx.translate(canvas.width/2,canvas.height/2);

t+=0.01;

dragon(
-120 + Math.sin(t)*40,
-8,
1,
"#1aa34a"
);

dragon(
120 + Math.sin(t+1.2)*40,
8,
-1,
"#c92525"
);

ctx.restore();

requestAnimationFrame(frame);

}

frame();

})();
