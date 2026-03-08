(function(){
"use strict";

const canvas=document.getElementById("scene");
if(!canvas)return;

const ctx=canvas.getContext("2d");
if(!ctx)return;

const CAMERA=window.OPENWORLD_CAMERA;
const BG=window.OPENWORLD_BACKGROUND_RENDERER;
const INPUT=window.OPENWORLD_SCENE_INPUT;
const COMPASS=window.OPENWORLD_COMPASS_RENDERER||null;

if(!CAMERA||!BG||!INPUT){
console.error("OPENWORLD_SCENE_vRESET1 missing required modules.");
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
background:BG.createState(),

compassVisible:true,
compassAnchor:{x:0,y:0},
compassHiddenY:0,
compassRaisedY:0,
compassTrigger:{x:0,y:0,w:0,h:0}
};

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function pointInRect(px,py,rect){
return px>=rect.x&&px<=rect.x+rect.w&&py>=rect.y&&py<=rect.y+rect.h;
}

function refreshWorldAnchors(){
const w=window.innerWidth;
const h=window.innerHeight;
const preset=CAMERA.getBlendedPreset(state.camera);
const horizonY=h*preset.horizon;

state.compassAnchor.x=w*0.5;
state.compassHiddenY=horizonY+84;
state.compassRaisedY=horizonY-98;

state.compassTrigger.w=Math.min(148,w*0.34);
state.compassTrigger.h=40;
state.compassTrigger.x=state.compassAnchor.x-(state.compassTrigger.w*0.5);
state.compassTrigger.y=horizonY-28;
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

refreshWorldAnchors();
}

function toggleCompass(){
state.compassVisible=!state.compassVisible;
CAMERA.blendTo(state.camera,state.compassVisible?"compass_focus":"fixed_harbor");
}

function pointerDown(p){
if(pointInRect(p.x,p.y,state.compassTrigger)){
toggleCompass();
return;
}

state.dragging=true;
state.lastX=p.x;
state.lastY=p.y;
CAMERA.blendTo(state.camera,state.compassVisible?"compass_focus":"drag_view");
}

function pointerMove(p){
if(!state.dragging)return;

const dx=p.x-state.lastX;
const dy=p.y-state.lastY;

state.lastX=p.x;
state.lastY=p.y;

state.velX+=dx*0.0022;
state.velY+=dy*0.0016;
}

function pointerUp(){
state.dragging=false;
CAMERA.blendTo(state.camera,state.compassVisible?"compass_focus":"fixed_harbor");
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

refreshWorldAnchors();
}

function drawCompassTrigger(){
const r=state.compassTrigger;

ctx.save();
ctx.globalAlpha=0.92;
ctx.fillStyle="rgba(18,10,14,0.74)";
ctx.strokeStyle="rgba(255,222,168,0.82)";
ctx.lineWidth=1.2;
ctx.beginPath();

if(ctx.roundRect){
ctx.roundRect(r.x,r.y,r.w,r.h,18);
}else{
ctx.moveTo(r.x+18,r.y);
ctx.lineTo(r.x+r.w-18,r.y);
ctx.quadraticCurveTo(r.x+r.w,r.y,r.x+r.w,r.y+18);
ctx.lineTo(r.x+r.w,r.y+r.h-18);
ctx.quadraticCurveTo(r.x+r.w,r.y+r.h,r.x+r.w-18,r.y+r.h);
ctx.lineTo(r.x+18,r.y+r.h);
ctx.quadraticCurveTo(r.x,r.y+r.h,r.x,r.y+r.h-18);
ctx.lineTo(r.x,r.y+18);
ctx.quadraticCurveTo(r.x,r.y,r.x+18,r.y);
ctx.closePath();
}

ctx.fill();
ctx.stroke();

ctx.fillStyle="rgba(255,238,200,0.96)";
ctx.font='700 12px system-ui,Segoe UI,Roboto,sans-serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(state.compassVisible?"LOWER COMPASS":"RAISE COMPASS",r.x+(r.w*0.5),r.y+(r.h*0.5)+0.5);
ctx.restore();
}

function drawHarborCoreMarker(){
const x=state.compassAnchor.x+(state.dragX*8);
const y=state.compassTrigger.y+state.compassTrigger.h+18;

ctx.save();
ctx.globalAlpha=0.76;
ctx.fillStyle="rgba(255,232,190,0.96)";
ctx.font='700 12px system-ui,Segoe UI,Roboto,sans-serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText("HARBOR CORE",x,y);

ctx.globalAlpha=0.34;
ctx.beginPath();
ctx.moveTo(x,y-18);
ctx.lineTo(x+9,y-2);
ctx.lineTo(x-9,y-2);
ctx.closePath();
ctx.fill();
ctx.restore();
}

function drawCompass(w,h){
if(!COMPASS||typeof COMPASS.getDiamondGeometry!=="function"||typeof COMPASS.drawCompass!=="function"){
return;
}

const y=state.compassVisible?state.compassRaisedY:state.compassHiddenY;

const geo=COMPASS.getDiamondGeometry({
width:w,
height:h,
centerX:state.compassAnchor.x+(state.dragX*10),
centerY:y,
size:Math.min(w,h)*0.086,
rotX:(state.dragY*0.18)-0.10,
rotY:(state.tick*0.006)+(state.dragX*0.20)
});

COMPASS.drawCompass(ctx,geo,{
showLabels:true,
showHalo:true
});
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

drawCompass(w,h);

BG.drawWater(ctx,w,h,state.tick,preset,state.background,null);

drawCompassTrigger();
drawHarborCoreMarker();
}

function frame(){
try{
animate();
draw();
}catch(err){
console.error("OPENWORLD_SCENE_vRESET1 frame error",err);
}
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
CAMERA.blendTo(state.camera,state.compassVisible?"compass_focus":"fixed_harbor");
}
});

window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});

resize();
frame();
})();
