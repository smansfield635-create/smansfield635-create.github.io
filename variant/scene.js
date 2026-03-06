(function(){
const canvas=document.getElementById("scene");
if(!canvas)return;
const ctx=canvas.getContext("2d");
if(!ctx)return;

const DOMAIN_MAP={
N:{label:"LAWS",short:"N"},
E:{label:"ENERGY",short:"E"},
S:{label:"FINANCE",short:"S"},
W:{label:"GOVERNANCE",short:"W"},
C:{label:"CORE",short:"CORE"}
};

const state={
tick:0,
activeLayer:1,
rot:0,
hoveredRegion:null,
activeDirection:null,
compassReveal:0,
transitionProgress:0,
pointer:{x:0,y:0,down:false},
cube:null,
faceZones:{},
compassZones:{},
lastTapRegion:null
};

const CUBE_STYLE={
edgeGold:"rgba(255,215,0,0.92)",
edgeGoldDim:"rgba(255,215,0,0.38)",
faceRubyFront:"rgba(139,0,0,0.24)",
faceRubySide:"rgba(120,0,0,0.19)",
faceRubyBack:"rgba(70,0,0,0.14)",
innerShade:"rgba(0,0,0,0.18)",
glowGold:"rgba(255,215,0,0.20)"
};

function resize(){
const dpr=Math.max(1,window.devicePixelRatio||1);
const w=window.innerWidth;
const h=window.innerHeight;
canvas.style.width=w+"px";
canvas.style.height=h+"px";
canvas.width=Math.floor(w*dpr);
canvas.height=Math.floor(h*dpr);
ctx.setTransform(1,0,0,1,0,0);
ctx.scale(dpr,dpr);
}
window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});
resize();

function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function easeOut(t){return 1-Math.pow(1-t,3)}

function pointInPoly(x,y,poly){
let inside=false;
for(let i=0,j=poly.length-1;i<poly.length;j=i++){
const xi=poly[i].x,yi=poly[i].y;
const xj=poly[j].x,yj=poly[j].y;
const hit=((yi>y)!==(yj>y))&&(x<((xj-xi)*(y-yi))/(yj-yi)+xi);
if(hit)inside=!inside;
}
return inside;
}

function diamondContains(x,y,node){
return(Math.abs(x-node.x)/node.hw)+(Math.abs(y-node.y)/node.hh)<=1;
}

function getPointerPos(e){
const rect=canvas.getBoundingClientRect();
return{x:e.clientX-rect.left,y:e.clientY-rect.top};
}

function getTouchPos(touch){
const rect=canvas.getBoundingClientRect();
return{x:touch.clientX-rect.left,y:touch.clientY-rect.top};
}

function setLayer(n){
const next=Number(n)===2?2:1;
state.activeLayer=next;
state.transitionProgress=0;
if(next!==2){
state.activeDirection=null;
state.hoveredRegion=null;
}
}

function selectDirection(dir){
state.activeDirection=dir;
state.lastTapRegion=dir;
if(state.activeLayer!==2){
state.activeLayer=2;
state.transitionProgress=0;
}
}

window.renderEngine={
setLayer(n){setLayer(Number(n)||1);}
};

function sky(){
const g=ctx.createLinearGradient(0,0,0,window.innerHeight);
g.addColorStop(0,"#160810");
g.addColorStop(.28,"#2d0b18");
g.addColorStop(.56,"#5a1120");
g.addColorStop(.82,"#8d2a18");
g.addColorStop(1,"#2a0908");
ctx.fillStyle=g;
ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
}

function moon(){
const x=window.innerWidth*.82;
const y=window.innerHeight*.16;
const r=Math.min(window.innerWidth,window.innerHeight)*.065;
ctx.save();
ctx.globalAlpha=.34+.08*state.compassReveal;
ctx.shadowBlur=38;
ctx.shadowColor="rgba(255,228,170,.45)";
ctx.fillStyle="rgba(255,244,215,.92)";
ctx.beginPath();
ctx.arc(x,y,r,0,Math.PI*2);
ctx.fill();
ctx.shadowBlur=0;
ctx.globalCompositeOperation="destination-out";
ctx.beginPath();
ctx.arc(x+r*.33,y-r*.05,r*.9,0,Math.PI*2);
ctx.fill();
ctx.restore();
}

function water(){
const h=window.innerHeight;
const w=window.innerWidth;
const base=h*.78;
const dir=state.activeDirection;
const reveal=state.compassReveal;
const calmAmp=4;
const activeAmp=10;
const amp=lerp(calmAmp,activeAmp,reveal*(dir?1:0));
const tilt=
dir==="W"?-12:
dir==="E"?12:
dir==="N"?-6:
dir==="S"?8:0;
const drift=
dir==="W"?-.03:
dir==="E"?.03:
0;

for(let i=0;i<7;i++){
ctx.beginPath();
for(let x=0;x<=w;x+=10){
const wave1=Math.sin((x+state.tick*(1+drift))*.018+i*.85)*amp;
const wave2=Math.sin((x-state.tick*.65)*.008+i*1.1)*amp*.45;
const slope=(x/w-.5)*tilt;
const y=base+i*18+wave1+wave2+slope;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,220,170,${0.05+i*0.018})`;
ctx.lineWidth=2;
ctx.stroke();
}
}

function project(x,y,z){
const scale=420/(420+z);
return{
x:window.innerWidth/2+x*scale,
y:window.innerHeight*.6+y*scale,
scale
};
}

function rotateVertex(x,y,z,rotY,tiltX){
const cy=Math.cos(rotY),sy=Math.sin(rotY);
const cx=Math.cos(tiltX),sx=Math.sin(tiltX);

const x1=x*cy-z*sy;
const z1=x*sy+z*cy;

const y2=y*cx-z1*sx;
const z2=y*sx+z1*cx;

return{x:x1,y:y2,z:z2};
}

function getCubeGeometry(){
const size=Math.min(window.innerWidth,window.innerHeight)*.16;
const tiltX=-0.58;
const verts=[
[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];
const edges=[
[0,1],[1,2],[2,3],[3,0],
[4,5],[5,6],[6,7],[7,4],
[0,4],[1,5],[2,6],[3,7]
];
const faces3D={
BACK:[0,1,2,3],
FRONT:[4,5,6,7],
LEFT:[0,3,7,4],
RIGHT:[1,2,6,5],
TOP:[3,2,6,7],
BOTTOM:[0,1,5,4]
};

const rotated=[];
const pts=[];

for(const v of verts){
const p=rotateVertex(v[0]*size,v[1]*size,v[2]*size,state.rot,tiltX);
rotated.push(p);
pts.push(project(p.x,p.y,p.z));
}

const faces2D={
C:[pts[4],pts[5],pts[6],pts[7]],
W:[pts[0],pts[3],pts[7],pts[4]],
E:[pts[1],pts[2],pts[6],pts[5]],
N:[pts[3],pts[2],pts[6],pts[7]]
};

const renderFaces=Object.entries(faces3D).map(([key,idxs])=>{
const avgZ=(rotated[idxs[0]].z+rotated[idxs[1]].z+rotated[idxs[2]].z+rotated[idxs[3]].z)/4;
return{key,idxs,avgZ};
}).sort((a,b)=>a.avgZ-b.avgZ);

const centerX=(pts[4].x+pts[5].x+pts[6].x+pts[7].x)/4;
const centerY=(pts[4].y+pts[5].y+pts[6].y+pts[7].y)/4;

return{
pts,
rotated,
edges,
faces:faces2D,
renderFaces,
centerX,
centerY,
size
};
}

function faceFillFor(key,avgZ){
if(key==="FRONT")return CUBE_STYLE.faceRubyFront;
if(key==="TOP")return "rgba(170,20,20,0.22)";
if(key==="RIGHT"||key==="LEFT")return CUBE_STYLE.faceRubySide;
if(key==="BOTTOM")return "rgba(35,0,0,0.16)";
return CUBE_STYLE.faceRubyBack;
}

function drawCube(geo){
state.faceZones=geo.faces;
const hovered=state.hoveredRegion;
const selected=state.activeDirection;

for(const face of geo.renderFaces){
const poly=face.idxs.map(i=>geo.pts[i]);
ctx.save();
ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);
for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i].x,poly[i].y);
ctx.closePath();

ctx.fillStyle=faceFillFor(face.key,face.avgZ);
ctx.fill();

ctx.fillStyle=CUBE_STYLE.innerShade;
ctx.globalAlpha=face.avgZ<0?0.24:0.08;
ctx.fill();

ctx.restore();
}

for(const key of ["W","E","N","C"]){
const poly=geo.faces[key];
const isHot=hovered===key||selected===key||(selected==="C"&&key==="C");
ctx.save();
ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);
for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i].x,poly[i].y);
ctx.closePath();
ctx.fillStyle=isHot?"rgba(255,215,0,0.07)":"rgba(255,255,255,0)";
ctx.fill();
ctx.restore();
}

ctx.save();
ctx.shadowBlur=14;
ctx.shadowColor=CUBE_STYLE.glowGold;
for(const e of geo.edges){
const a=geo.rotated[e[0]].z+geo.rotated[e[1]].z;
ctx.beginPath();
ctx.moveTo(geo.pts[e[0]].x,geo.pts[e[0]].y);
ctx.lineTo(geo.pts[e[1]].x,geo.pts[e[1]].y);
ctx.lineWidth=2.2;
ctx.strokeStyle=a<0?CUBE_STYLE.edgeGoldDim:CUBE_STYLE.edgeGold;
ctx.stroke();
}
ctx.restore();
}

function drawCompass(geo){
const reveal=easeOut(state.compassReveal);
if(reveal<=0.001){
state.compassZones={};
return;
}

const cx=geo.centerX;
const cy=geo.centerY;
const radius=geo.size*1.35;
const outer=radius+40*reveal;
const inner=radius-40*reveal;

ctx.save();
ctx.globalAlpha=.16*reveal;
for(let i=0;i<3;i++){
ctx.beginPath();
ctx.arc(cx,cy,outer+i*34,0,Math.PI*2);
ctx.strokeStyle="rgba(255,235,200,.25)";
ctx.lineWidth=2;
ctx.stroke();
}
for(let i=0;i<32;i++){
const a=(i/32)*Math.PI*2;
ctx.beginPath();
ctx.moveTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner);
ctx.lineTo(cx+Math.cos(a)*(outer+56),cy+Math.sin(a)*(outer+56));
ctx.strokeStyle="rgba(255,235,200,.12)";
ctx.lineWidth=1;
ctx.stroke();
}
ctx.restore();

const nodeDist=radius+30;
const nodes={
N:{x:cx,y:cy-nodeDist},
E:{x:cx+nodeDist,y:cy},
S:{x:cx,y:cy+nodeDist},
W:{x:cx-nodeDist,y:cy},
C:{x:cx,y:cy}
};
state.compassZones={};

for(const key of ["N","W","C","E","S"]){
const node=nodes[key];
const hw=key==="C"?geo.size*.38:geo.size*.24;
const hh=key==="C"?geo.size*.38:geo.size*.24;
state.compassZones[key]={x:node.x,y:node.y,hw,hh};
const active=state.activeDirection===key;
const hover=state.hoveredRegion===key;
const alpha=key==="C"?0.82:.74;

ctx.save();
ctx.globalAlpha=alpha*reveal;
ctx.translate(node.x,node.y);
ctx.rotate(Math.PI/4);
ctx.fillStyle=active?"rgba(18,18,26,.95)":hover?"rgba(28,28,38,.92)":"rgba(18,18,26,.86)";
ctx.strokeStyle=active?"rgba(255,245,220,.78)":hover?"rgba(255,245,220,.55)":"rgba(255,255,255,.26)";
ctx.lineWidth=active?2.6:1.6;
ctx.beginPath();
ctx.roundRect(-hw,-hh,hw*2,hh*2,18);
ctx.fill();
ctx.stroke();
ctx.restore();

ctx.save();
ctx.globalAlpha=reveal;
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillStyle="rgba(255,255,255,.96)";
ctx.font=`${key==="C"?"700":"800"} ${key==="C"?16:14}px system-ui,Segoe UI,Roboto,sans-serif`;
ctx.fillText(DOMAIN_MAP[key].label,node.x,node.y-(key==="C"?8:4));
ctx.font=`700 ${key==="C"?12:11}px system-ui,Segoe UI,Roboto,sans-serif`;
ctx.fillStyle="rgba(240,240,240,.92)";
ctx.fillText(DOMAIN_MAP[key].short,node.x,node.y+(key==="C"?14:16));
ctx.restore();
}

ctx.save();
ctx.globalAlpha=.12*reveal;
ctx.beginPath();
ctx.arc(cx,cy,outer+72,0,Math.PI*2);
ctx.fillStyle="rgba(0,0,0,.35)";
ctx.fill();
ctx.restore();
}

function dragonBands(){
const reveal=state.compassReveal;
const topY=window.innerHeight*.26;
const botY=window.innerHeight*.73;
const drift=state.tick*.035;

function band(y,color1,color2,dir,isTop){
for(let i=0;i<28;i++){
const x=(i*44+(drift*dir))%(window.innerWidth+120)-60;
ctx.beginPath();
ctx.arc(x,y,28,0,Math.PI*2);
ctx.strokeStyle=isTop?color1:color2;
ctx.lineWidth=3;
ctx.globalAlpha=.28+.12*reveal;
ctx.stroke();
}
ctx.globalAlpha=1;
}

band(topY,"rgba(70,255,120,.45)","rgba(0,0,0,.28)",1,true);
band(botY,"rgba(255,210,120,.18)","rgba(0,0,0,.34)",-1,false);

const topGlow=state.activeDirection==="N"?"rgba(70,255,120,.72)":"rgba(70,255,120,.16)";
const botGlow=state.activeDirection==="S"?"rgba(255,80,80,.62)":"rgba(255,80,80,.12)";

ctx.strokeStyle=topGlow;
ctx.lineWidth=10;
ctx.beginPath();
ctx.moveTo(0,topY);
for(let x=0;x<=window.innerWidth;x+=18){
ctx.lineTo(x,topY+Math.sin((x+state.tick)*.02)*7);
}
ctx.stroke();

ctx.strokeStyle=botGlow;
ctx.lineWidth=10;
ctx.beginPath();
ctx.moveTo(0,botY);
for(let x=0;x<=window.innerWidth;x+=18){
ctx.lineTo(x,botY+Math.sin((x-state.tick)*.02+1.2)*7);
}
ctx.stroke();
}

function drawSceneFrame(){
ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
sky();
moon();
water();
dragonBands();

const geo=getCubeGeometry();
state.cube=geo;
drawCube(geo);
drawCompass(geo);
}

function getRegionAt(x,y){
if(state.activeLayer===2){
for(const key of ["N","E","S","W","C"]){
const node=state.compassZones[key];
if(node&&diamondContains(x,y,node))return key;
}
}
for(const key of ["C","W","E","N"]){
const poly=state.faceZones[key];
if(poly&&pointInPoly(x,y,poly))return key;
}
return null;
}

function routeRegion(region){
if(region==="C"){
if(state.activeLayer===1){
setLayer(2);
return;
}
selectDirection("C");
return;
}
if(region==="W"||region==="E"||region==="N"){
selectDirection(region);
return;
}
if(region==="S"){
selectDirection("S");
}
}

function updateInteractionFromPoint(x,y){
state.hoveredRegion=getRegionAt(x,y);
}

function activateAtPoint(x,y){
updateInteractionFromPoint(x,y);
const hit=getRegionAt(x,y);
if(hit)routeRegion(hit);
}

canvas.addEventListener("pointermove",e=>{
const p=getPointerPos(e);
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
},{passive:true});

canvas.addEventListener("pointerdown",e=>{
const p=getPointerPos(e);
state.pointer.down=true;
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
});

canvas.addEventListener("pointerup",e=>{
const p=getPointerPos(e);
state.pointer.down=false;
state.pointer.x=p.x;
state.pointer.y=p.y;
activateAtPoint(p.x,p.y);
});

canvas.addEventListener("touchstart",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.down=true;
state.pointer.x=p.x;
state.pointer.y=p.y;
updateInteractionFromPoint(p.x,p.y);
},{passive:true});

canvas.addEventListener("touchend",e=>{
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(touch);
state.pointer.down=false;
state.pointer.x=p.x;
state.pointer.y=p.y;
activateAtPoint(p.x,p.y);
e.preventDefault();
},{passive:false});

canvas.addEventListener("pointerleave",()=>{
state.pointer.down=false;
state.hoveredRegion=null;
});

function animateState(){
state.tick++;
state.rot+=state.activeLayer===1?.0044:.0039;
const targetReveal=state.activeLayer===2?1:0;
state.compassReveal=lerp(state.compassReveal,targetReveal,.08);
state.transitionProgress=clamp(state.transitionProgress+.04,0,1);
}

function frame(){
animateState();
drawSceneFrame();
requestAnimationFrame(frame);
}

frame();
})();
