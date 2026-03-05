/* TNT — /assets/dragon-engine.js
   BUILD: HEX_DRAGON_ENGINE_v3_HEX3
   PURPOSE: thinner + longer dragon silhouette using 3px hex cells
*/

(function(){

if(window.__HEX_DRAGON_RUNNING__) return;
window.__HEX_DRAGON_RUNNING__ = true;

const HEX_SIZE = 3;        // smaller hex
const SPINE_LEN = 56;      // longer dragon
const SHOULDER = 4;        // thinner body

const canvas = document.createElement("canvas");
canvas.style.position="fixed";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
canvas.style.zIndex="6";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

function hex(q,r){

const x = HEX_SIZE*Math.sqrt(3)*(q + r/2);
const y = HEX_SIZE*1.5*r;

ctx.beginPath();
for(let i=0;i<6;i++){
const a=Math.PI/3*i;
const px=x+HEX_SIZE*Math.cos(a);
const py=y+HEX_SIZE*Math.sin(a);
if(i===0)ctx.moveTo(px,py);
else ctx.lineTo(px,py);
}
ctx.closePath();
ctx.fill();

}

function dragon(spineX,spineY,dir,color){

ctx.fillStyle=color;

for(let i=0;i<SPINE_LEN;i++){

const q = spineX + dir*i;
const r = spineY + Math.sin(i*0.25)*1.2;

const radius =
i<6 ? 2 :
i<16 ? SHOULDER :
i<32 ? 3 :
i<46 ? 2 :
1;

for(let dq=-radius;dq<=radius;dq++){
for(let dr=-radius;dr<=radius;dr++){
if(Math.abs(dq)+Math.abs(dr)<=radius){
hex(q+dq,r+dr);
}
}
}

}

}

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.save();
ctx.translate(canvas.width/2,canvas.height/2);

dragon(-32,-2,1,"#1aa34a");  // love dragon
dragon(32,2,-1,"#c92525");   // fear dragon

ctx.restore();

requestAnimationFrame(frame);

}

frame();

})();
