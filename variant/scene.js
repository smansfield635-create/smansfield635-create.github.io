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
const FX=window.OPENWORLD_SCENE_FX||null;
const SHOWROOM=window.OPENWORLD_SHOWROOM_RENDERER||null;

if(!CAMERA||!BG||!INPUT||!COMPASS){
console.error("OPENWORLD_SCENE_vL2D missing required modules.");
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

compassRaised:false,
compassLift:0,
compassTarget:0,

compassAnchor:{x:0,y:0},
compassTrigger:{x:0,y:0,w:0,h:0},

moonLeftPhase:0,
moonRightPhase:0,
moonLeftHot:{x:0,y:0,r:0},
moonRightHot:{x:0,y:0,r:0},

dragonFearActive:false,
dragonAlignActive:false,

fx:FX&&typeof FX.createState==="function"?FX.createState():null,
showroom:SHOWROOM&&typeof SHOWROOM.createState==="function"?SHOWROOM.createState():null
};

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
}

function pointInRect(px,py,rect){
return px>=rect.x&&px<=rect.x+rect.w&&py>=rect.y&&py<=rect.y+rect.h;
}

function pointInCircle(px,py,cx,cy,r){
const dx=px-cx;
const dy=py-cy;
return (dx*dx+dy*dy)<=(r*r);
}

function refreshWorldAnchors(){
const w=window.innerWidth;
const h=window.innerHeight;
const preset=CAMERA.getBlendedPreset(state.camera);
const horizonY=h*preset.horizon;

state.compassAnchor.x=w*0.5;
state.compassAnchor.y=horizonY+18;

state.compassTrigger.w=Math.min(148,w*0.34);
state.compasstriggerh=40;
state.compassTrigger.h=40;
state.compassTrigger.x=state.compassAnchor.x-(state.compassTrigger.w*0.5);
state.compassTrigger.y=horizonY-30;
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

if(state.showroom&&SHOWROOM.refreshTargets){
SHOWROOM.refreshTargets(state.showroom,w,h);
}
}

function onCompassTrigger(){
state.compassRaised=!state.compassRaised;
state.compassTarget=state.compassRaised?1:0;
CAMERA.blendTo(state.camera,state.compassRaised?"compass_focus":"fixed_harbor");

if(state.fx&&FX.triggerOverlay){
FX.triggerOverlay(state.fx,0.24);
}
if(state.fx&&FX.burstAt){
FX.burstAt(
state.fx,
state.compassTrigger.x+(state.compassTrigger.w*0.5),
state.compassTrigger.y+(state.compassTrigger.h*0.5),
"compass"
);
}
}

function onLeftMoonPressed(){
state.moonLeftPhase=(state.moonLeftPhase+1)%4;
state.dragonFearActive=true;

if(state.fx&&FX.triggerOverlay){
FX.triggerOverlay(state.fx,0.16);
}
if(state.fx&&FX.burstAt){
FX.burstAt(state.fx,state.moonLeftHot.x,state.moonLeftHot.y,"fear");
}
}

function onRightMoonPressed(){
state.moonRightPhase=(state.moonRightPhase+1)%4;
state.dragonAlignActive=true;

if(state.fx&&FX.triggerOverlay){
FX.triggerOverlay(state.fx,0.16);
}
if(state.fx&&FX.burstAt){
FX.burstAt(state.fx,state.moonRightHot.x,state.moonRightHot.y,"align");
}
}

function pointerDown(p){
if(pointInRect(p.x,p.y,state.compassTrigger)){
onCompassTrigger();
return;
}

if(pointInCircle(p.x,p.y,state.moonLeftHot.x,state.moonLeftHot.y,state.moonLeftHot.r)){
onLeftMoonPressed();
return;
}

if(pointInCircle(p.x,p.y,state.moonRightHot.x,state.moonRightHot.y,state.moonRightHot.r)){
onRightMoonPressed();
return;
}

state.dragging=true;
state.lastX=p.x;
state.lastY=p.y;
CAMERA.blendTo(state.camera,state.compassRaised?"compass_focus":"drag_view");
}

function pointerMove(p){
if(!state.dragging)return;

const dx=p.x-state.lastX;
const dy=p.y-state.lastY;

state.lastX=p.x;
state.lastY=p.y;

state.velX+=dx*0.0023;
state.velY+=dy*0.0017;
}

function pointerUp(){
state.dragging=false;
CAMERA.blendTo(state.camera,state.compassRaised?"compass_focus":"fixed_harbor");
}

function animate(){
state.tick++;

CAMERA.update(state.camera,0.08);
BG.syncCelestials(state.background,null,state.tick);

state.compassLift=lerp(state.compassLift,state.compassTarget,0.08);

state.dragX+=state.velX;
state.dragY+=state.velY;

state.velX*=state.dragging?0.88:0.94;
state.velY*=state.dragging?0.88:0.94;

state.dragX=clamp(state.dragX,-1.2,1.2);
state.dragY=clamp(state.dragY,-0.8,0.8);
state.velX=clamp(state.velX,-0.12,0.12);
state.velY=clamp(state.velY,-0.12,0.12);

refreshWorldAnchors();

if(state.fx&&FX.decay){
FX.decay(state.fx,state.tick);
}
if(state.showroom&&SHOWROOM.update){
SHOWROOM.update(state.showroom,state.tick,state);
}
}

function drawHarborCoreMarker(w,h){
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
ctx.fillText(state.compassRaised?"LOWER COMPASS":"RAISE COMPASS",r.x+(r.w*0.5),r.y+(r.h*0.5)+0.5);
ctx.restore();
}

function drawMoonAnchors(){
ctx.save();
ctx.globalAlpha=0.18;
ctx.strokeStyle="rgba(255,232,190,0.40)";
ctx.lineWidth=1.0;

ctx.beginPath();
ctx.arc(state.moonLeftHot.x,state.moonLeftHot.y,state.moonLeftHot.r,0,Math.PI*2);
ctx.stroke();

ctx.beginPath();
ctx.arc(state.moonRightHot.x,state.moonRightHot.y,state.moonRightHot.r,0,Math.PI*2);
ctx.stroke();

ctx.restore();
}

function drawCompass(w,h,preset){
const y=state.compassAnchor.y-(state.compassLift*112)+(preset.compassLift*h);

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

state.moonLeftHot.x=state.background.moonA.x;
state.moonLeftHot.y=state.background.moonA.y;
state.moonLeftHot.r=state.background.moonA.r*1.08;

state.moonRightHot.x=state.background.moonB.x;
state.moonRightHot.y=state.background.moonB.y;
state.moonRightHot.r=state.background.moonB.r*1.08;

BG.drawClouds(ctx,state.background,state.tick,null);
BG.drawLanterns(ctx,state.background,state.tick,1);
BG.drawMountains(ctx,w,h,state.background,preset);

drawCompass(w,h,preset);

if(state.showroom&&SHOWROOM.drawDragonMarkers){
SHOWROOM.drawDragonMarkers(ctx,state,w,h);
}

BG.drawWater(ctx,w,h,state.tick,preset,state.background,null);

drawCompassTrigger();
drawHarborCoreMarker(w,h);
drawMoonAnchors();

if(state.fx&&FX.drawBursts){
FX.drawBursts(ctx,state.fx,state.tick);
}
if(state.fx&&FX.drawNavigationOverlay){
FX.drawNavigationOverlay(ctx,state.fx);
}
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
CAMERA.blendTo(state.camera,state.compassRaised?"compass_focus":"fixed_harbor");
}
});

window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});

resize();
frame();
})();
