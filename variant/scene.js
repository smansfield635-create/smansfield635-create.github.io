(function(){
"use strict";

const canvas=document.getElementById("scene");
if(!canvas)return;

const ctx=canvas.getContext("2d");
if(!ctx)return;

const CAMERA=window.OPENWORLD_CAMERA;
const BG=window.OPENWORLD_BACKGROUND_RENDERER;
const INPUT=window.OPENWORLD_SCENE_INPUT;

if(!CAMERA||!BG||!INPUT){
console.error("OPENWORLD_SCENE_vMIN1 missing required modules.");
return;
}

const state={
tick:0,
dragging:false,
lastX:0,
lastY:0,
dragX:0,
dragY:0,
velX:0,
velY:0,
camera:CAMERA.createState("fixed_harbor"),
background:BG.createState()
};

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

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

const preset=CAMERA.getPreset(state.camera.mode);
BG.initClouds(state.background,w,h);
BG.initLanterns(state.background,w,h);
BG.initMountains(state.background,w,h,preset);
}

function pointerDown(p){
state.dragging=true;
state.lastX=p.x;
state.lastY=p.y;
CAMERA.blendTo(state.camera,"drag_view");
}

function pointerMove(p){
if(!state.dragging)return;

const dx=p.x-state.lastX;
const dy=p.y-state.lastY;
state.lastX=p.x;
state.lastY=p.y;

state.velX+=dx*0.0025;
state.velY+=dy*0.0018;
}

function pointerUp(){
state.dragging=false;
CAMERA.blendTo(state.camera,"fixed_harbor");
}

function animate(){
state.tick++;
CAMERA.update(state.camera,0.08);
BG.syncCelestials(state.background,null,state.tick);

state.dragX+=state.velX;
state.dragY+=state.velY;

state.velX*=state.dragging?0.88:0.94;
state.velY*=state.dragging?0.88:0.94;

state.dragX=clamp(state.dragX,-1.2,1.2);
state.dragY=clamp(state.dragY,-0.8,0.8);
state.velX=clamp(state.velX,-0.12,0.12);
state.velY=clamp(state.velY,-0.12,0.12);
}

function drawOverlayMarker(ctx,w,h){
const x=w*0.50+(state.dragX*18);
const y=h*0.58+(state.dragY*10);

ctx.save();
ctx.globalAlpha=0.68;
ctx.fillStyle="rgba(255,232,190,0.92)";
ctx.font='700 12px system-ui,Segoe UI,Roboto,sans-serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText("HARBOR CORE",x,y);

ctx.globalAlpha=0.30;
ctx.beginPath();
ctx.moveTo(x,y-18);
ctx.lineTo(x+9,y-2);
ctx.lineTo(x-9,y-2);
ctx.closePath();
ctx.fill();
ctx.restore();
}

function draw(){
const w=window.innerWidth;
const h=window.innerHeight;
const preset=CAMERA.getBlendedPreset(state.camera);

ctx.clearRect(0,0,w,h);

BG.drawSky(ctx,w,h,state.tick,preset,state.background);
BG.drawSun(ctx,w,h,state.background);
BG.drawMoon(ctx,w,h,state.background);
BG.drawClouds(ctx,state.background,state.tick,null);
BG.drawLanterns(ctx,state.background,state.tick,1);
BG.drawMountains(ctx,w,h,state.background,preset);
BG.drawWater(ctx,w,h,state.tick,preset,state.background,null);

drawOverlayMarker(ctx,w,h);
}

function frame(){
animate();
draw();
requestAnimationFrame(frame);
}

INPUT.bind(canvas,{
onPointerDown:pointerDown,
onPointerMove:pointerMove,
onPointerUp:pointerUp,
onTouchStart:pointerDown,
onTouchMove:pointerMove,
onTouchEnd:pointerUp,
onPointerLeave:function(){
state.dragging=false;
CAMERA.blendTo(state.camera,"fixed_harbor");
}
});

window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});

resize();
frame();
})();
