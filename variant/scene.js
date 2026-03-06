(function(){

const canvas=document.getElementById("scene");
const ctx=canvas.getContext("2d");

let state={
tick:0,
layer:1,
rot:0
};

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}

window.addEventListener("resize",resize);
resize();

function sky(){

const g=ctx.createLinearGradient(0,0,0,canvas.height);
g.addColorStop(0,"#240909");
g.addColorStop(.4,"#7d1d15");
g.addColorStop(.7,"#d84d22");
g.addColorStop(1,"#1a0606");

ctx.fillStyle=g;
ctx.fillRect(0,0,canvas.width,canvas.height);

}

function water(){

const base=canvas.height*.75;

for(let i=0;i<6;i++){

ctx.beginPath();

for(let x=0;x<canvas.width;x+=10){

const y=
base+i*18+
Math.sin((x+state.tick)*.02+i)*6;

if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);

}

ctx.strokeStyle="rgba(255,230,200,.1)";
ctx.stroke();

}

}

function project(x,y,z){

const scale=400/(400+z);

return{
x:canvas.width/2+x*scale,
y:canvas.height*.55+y*scale
};

}

function drawCube(){

const size=120;

const verts=[
[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];

const edges=[
[0,1],[1,2],[2,3],[3,0],
[4,5],[5,6],[6,7],[7,4],
[0,4],[1,5],[2,6],[3,7]
];

let pts=[];

verts.forEach(v=>{

let x=v[0]*size;
let y=v[1]*size;
let z=v[2]*size;

let xr=x*Math.cos(state.rot)-z*Math.sin(state.rot);
let zr=x*Math.sin(state.rot)+z*Math.cos(state.rot);

pts.push(project(xr,y,zr));

});

ctx.strokeStyle="white";
ctx.lineWidth=2;

edges.forEach(e=>{

ctx.beginPath();
ctx.moveTo(pts[e[0]].x,pts[e[0]].y);
ctx.lineTo(pts[e[1]].x,pts[e[1]].y);
ctx.stroke();

});

}

function drawNodes(){

const count=12;
const r=180;

for(let i=0;i<count;i++){

const a=i/count*Math.PI*2+state.rot;

const x=Math.cos(a)*r;
const y=Math.sin(a)*r*.6;
const z=Math.sin(a)*r;

const p=project(x,y,z);

ctx.beginPath();
ctx.arc(p.x,p.y,24,0,Math.PI*2);

ctx.fillStyle="rgba(0,0,0,.7)";
ctx.fill();

ctx.strokeStyle="rgba(255,230,180,.4)";
ctx.stroke();

}

}

function dragon(dir,color,yoff){

const seg=36;

const start=dir>0?-200:canvas.width+200;
const end=dir>0?canvas.width+200:-200;

const progress=(state.tick*.0006)%1;

const head=start+(end-start)*progress;

ctx.beginPath();

for(let i=0;i<seg;i++){

const x=head-dir*i*16;
const y=canvas.height*.3+yoff+
Math.sin(i*.4+state.tick*.04)*18;

if(i===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);

}

ctx.strokeStyle=color;
ctx.lineWidth=14;
ctx.lineCap="round";
ctx.stroke();

}

function frame(){

state.tick++;
state.rot+=.01;

ctx.clearRect(0,0,canvas.width,canvas.height);

sky();
water();

if(state.layer===1){
drawCube();
}else{
drawNodes();
}

dragon(1,"rgba(50,160,80,.9)",-20);
dragon(-1,"rgba(180,40,40,.9)",40);

requestAnimationFrame(frame);

}

window.navigatorLayer=function(n){
state.layer=n;
};

frame();

})();
