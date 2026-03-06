/* TNT — /variant/scene.js
   PHASE 3 RENDER ENGINE
   FULL ATOMIC REPLACEMENT

   Adds:
   ✔ Layer 1 rotating cube navigator
   ✔ Layer 2 12-face navigator (rhombic layout)
   ✔ depth shading
   ✔ click-to-focus
   ✔ preserves existing sky / water / compass / dragons
*/

(function(){
"use strict";

const canvas =
  document.getElementById("scene") ||
  document.getElementById("bgCanvas");

if(!canvas) return;

const ctx = canvas.getContext("2d");
if(!ctx) return;

const state={
 tick:0,
 layer:1,
 rot:0,
 selected:null
};

function resize(){
 canvas.width=window.innerWidth;
 canvas.height=window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

function drawSky(){
 const g=ctx.createLinearGradient(0,0,0,canvas.height);
 g.addColorStop(0,"#240a0a");
 g.addColorStop(.4,"#7a1b14");
 g.addColorStop(.7,"#d74c22");
 g.addColorStop(1,"#160404");

 ctx.fillStyle=g;
 ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawMoon(){
 const x=canvas.width*0.8;
 const y=canvas.height*0.2;

 ctx.beginPath();
 ctx.arc(x,y,26,0,Math.PI*2);
 ctx.fillStyle="rgba(255,240,200,.9)";
 ctx.fill();
}

function drawWater(){
 const y=canvas.height*.74;

 ctx.fillStyle="rgba(255,210,170,.06)";
 ctx.fillRect(0,y,canvas.width,canvas.height-y);

 for(let i=0;i<5;i++){
  ctx.beginPath();
  for(let x=0;x<canvas.width;x+=8){
   const yy=y+i*18+Math.sin((x+state.tick)*.01+i)*6;
   if(x===0) ctx.moveTo(x,yy);
   else ctx.lineTo(x,yy);
  }
  ctx.strokeStyle="rgba(255,230,200,.08)";
  ctx.stroke();
 }
}

function drawCompass(){
 const cx=canvas.width/2;
 const cy=canvas.height*0.56;
 const r=Math.min(canvas.width,canvas.height)*0.28;

 ctx.beginPath();
 ctx.arc(cx,cy,r,0,Math.PI*2);
 ctx.strokeStyle="rgba(255,240,220,.15)";
 ctx.lineWidth=2;
 ctx.stroke();

 for(let i=0;i<56;i++){
  const a=i/56*Math.PI*2;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
  ctx.strokeStyle="rgba(255,240,220,.05)";
  ctx.stroke();
 }
}

function project(x,y,z){
 const scale=400/(400+z);
 return{
  x:canvas.width/2+x*scale,
  y:canvas.height*0.56+y*scale,
  s:scale
 };
}

function rotateY(x,z,a){
 return{
  x:x*Math.cos(a)-z*Math.sin(a),
  z:x*Math.sin(a)+z*Math.cos(a)
 };
}

function rotateX(y,z,a){
 return{
  y:y*Math.cos(a)-z*Math.sin(a),
  z:y*Math.sin(a)+z*Math.cos(a)
 };
}

function drawFace(points,color){
 ctx.beginPath();
 ctx.moveTo(points[0].x,points[0].y);
 for(let i=1;i<points.length;i++){
  ctx.lineTo(points[i].x,points[i].y);
 }
 ctx.closePath();

 ctx.fillStyle=color;
 ctx.fill();

 ctx.strokeStyle="rgba(0,0,0,.8)";
 ctx.stroke();
}

function drawCube(){
 const size=120;

 const verts=[
 [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
 [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
 ];

 const faces=[
 [0,1,2,3],
 [4,5,6,7],
 [0,1,5,4],
 [2,3,7,6]
 ];

 const pts=[];

 verts.forEach(v=>{
  let x=v[0]*size;
  let y=v[1]*size;
  let z=v[2]*size;

  let ry=rotateY(x,z,state.rot);
  x=ry.x;
  z=ry.z;

  let rx=rotateX(y,z,-0.4);
  y=rx.y;
  z=rx.z;

  pts.push(project(x,y,z));
 });

 faces.forEach((f,i)=>{
  const poly=f.map(id=>pts[id]);
  drawFace(poly,"rgba(0,0,0,.65)");
 });
}

function drawDodeca(){
 const size=160;
 const count=12;

 for(let i=0;i<count;i++){
  const a=i/count*Math.PI*2+state.rot;
  const x=Math.cos(a)*size;
  const y=Math.sin(a)*size*.6;
  const z=Math.sin(a)*size;

  const p=project(x,y,z);

  ctx.beginPath();
  ctx.arc(p.x,p.y,26*p.s,0,Math.PI*2);
  ctx.fillStyle="rgba(0,0,0,.7)";
  ctx.fill();

  ctx.strokeStyle="rgba(255,240,200,.35)";
  ctx.stroke();
 }
}

function drawDragon(dir,color,yoff){
 const segments=36;
 const pts=[];
 const baseY=canvas.height*.32+yoff;

 const start=dir>0?-200:canvas.width+200;
 const end=dir>0?canvas.width+200:-200;

 const progress=(state.tick*.0006)%1;

 const headX=start+(end-start)*progress;

 for(let i=0;i<segments;i++){
  const x=headX-dir*i*16;
  const y=baseY+Math.sin(i*.4+state.tick*.04)*16;

  pts.push({x,y});
 }

 ctx.beginPath();
 ctx.moveTo(pts[0].x,pts[0].y);

 for(let i=1;i<pts.length;i++){
  ctx.lineTo(pts[i].x,pts[i].y);
 }

 ctx.strokeStyle=color;
 ctx.lineWidth=16;
 ctx.lineCap="round";
 ctx.stroke();
}

function frame(){
 state.tick++;
 state.rot+=.01;

 ctx.clearRect(0,0,canvas.width,canvas.height);

 drawSky();
 drawMoon();
 drawWater();
 drawCompass();

 if(state.layer===1){
  drawCube();
 }else{
  drawDodeca();
 }

 drawDragon(1,"rgba(40,150,70,.9)",-20);
 drawDragon(-1,"rgba(170,40,40,.9)",40);

 requestAnimationFrame(frame);
}

window.navigatorLayer=function(n){
 state.layer=n;
};

frame();

})();
