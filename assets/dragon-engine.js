/* TNT — /assets/dragon-engine.js
   HEX DRAGON ENGINE v3
   PURPOSE: moving hex-lattice dragon silhouettes
   BUILD: HEX_DRAGON_ENGINE_v3
*/

(function(){

/* prevent double-start but do NOT stop animation */
if(window.__HEX_DRAGON_ENGINE__) return;
window.__HEX_DRAGON_ENGINE__ = true;

/* canvas */
const canvas=document.createElement("canvas");
canvas.style.position="fixed";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
canvas.style.zIndex="5";
document.body.appendChild(canvas);

const ctx=canvas.getContext("2d");

/* resize */
function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

/* hex size */
const HEX=3;

/* draw hex */
function hex(x,y){
ctx.beginPath();
for(let i=0;i<6;i++){
const a=Math.PI/3*i;
const px=x+Math.cos(a)*HEX;
const py=y+Math.sin(a)*HEX;
if(i===0) ctx.moveTo(px,py);
else ctx.lineTo(px,py);
}
ctx.closePath();
ctx.fill();
}

/* build dragon body */
function dragon(cx,cy,len,dir,color){

ctx.fillStyle=color;

for(let i=0;i<len;i++){

const t=i/len;

/* spine */
const x=cx + i*dir*HEX*3;
const y=cy + Math.sin(i*0.25)*HEX*6;

/* body radius profile */
let r;

if(t<0.15) r=2;
else if(t<0.35) r=4;
else if(t<0.75) r=3;
else r=1;

for(let q=-r;q<=r;q++){
for(let s=-r;s<=r;s++){
if(Math.abs(q+s)<=r){
hex(x+q*HEX*2,y+s*HEX*2);
}
}
}

}

/* head */
hex(cx+len*dir*HEX*3,cy);

}

/* animation */
let t=0;

function loop(){

ctx.clearRect(0,0,canvas.width,canvas.height);

t+=0.04;

const cx=canvas.width/2;
const cy=canvas.height/2;

dragon(
cx-300+Math.sin(t)*120,
cy-120,
80,
1,
"#31d07b"
);

dragon(
cx+300+Math.sin(t+Math.PI)*120,
cy+120,
80,
-1,
"#ff3a3a"
);

requestAnimationFrame(loop);

}

loop();

/* version label */
ctx.fillStyle="rgba(255,255,255,0.4)";
ctx.font="12px system-ui";
ctx.fillText("HEX_DRAGON_ENGINE_v3",12,canvas.height-12);

})();
