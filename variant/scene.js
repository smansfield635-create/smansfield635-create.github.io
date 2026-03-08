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

if(!CAMERA||!BG||!INPUT){
console.error("OPENWORLD_SCENE_vMAX1 missing required modules.");
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
compassSignalRect:{x:0,y:0,w:0,h:0},
compassAnchor:{x:0,y:0},
fx:FX&&typeof FX.createState==="function"?FX.createState():null,
showroom:SHOWROOM&&typeof SHOWROOM.createState==="function"?SHOWROOM.createState():null
};

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
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

state.compassAnchor.x=w*0.5;
state.compassAnchor.y=h*0.62;

const sigW=118;
const sigH=34;
state.compassSignalRect={
x:(w*0.5)-(sigW*0.5),
y:(h*0.53),
w:sigW,
h:sigH
};
}

function pointerDown(p){
if(INPUT.pointInRect(p.x,p.y,state.compassSignalRect)){
state.compassRaised=!state.compassRaised;
state.compassTarget=state.compassRaised?1:0;
CAMERA.blendTo(state.camera,state.compassRaised?"compass_focus":"fixed_harbor");
return;
}

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

state.velX+=dx*0.0024;
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

state.compassLift=lerp(state.compassLift,state.compassTarget,0.10);

state.dragX+=state.velX;
state.dragY+=state.velY;

state.velX*=state.dragging?0.88:0.94;
state.velY*=state.dragging?0.88:0.94;

state.dragX=clamp(state.dragX,-1.2,1.2);
state.dragY=clamp(state.dragY,-0.8,0.8);
state.velX=clamp(state.velX,-0.12,0.12);
state.velY=clamp(state.velY,-0.12,0.12);

if(state.fx&&typeof FX.decay==="function"){
FX.decay(state.fx);
}
}

function drawCompassSignal(w,h){
const r=state.compassSignalRect;

ctx.save();
ctx.globalAlpha=0.90;
ctx.fillStyle="rgba(18,10,14,0.74)";
ctx.strokeStyle="rgba(255,222,168,0.76)";
ctx.lineWidth=1.0;
ctx.beginPath();
ctx.roundRect?ctx.roundRect(r.x,r.y,r.w,r.h,17):null;
if(!ctx.roundRect){
ctx.moveTo(r.x+17,r.y);
ctx.lineTo(r.x+r.w-17,r.y);
ctx.quadraticCurveTo(r.x+r.w,r.y,r.x+r.w,r.y+17);
ctx.lineTo(r.x+r.w,r.y+r.h-17);
ctx.quadraticCurveTo(r.x+r.w,r.y+r.h,r.x+r.w-17,r.y+r.h);
ctx.lineTo(r.x+17,r.y+r.h);
ctx.quadraticCurveTo(r.x,r.y+r.h,r.x,r.y+r.h-17);
ctx.lineTo(r.x,r.y+17);
ctx.quadraticCurveTo(r.x,r.y,r.x+17,r.y);
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

function drawHarborMarker(w,h){
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

function drawCompass(w,h,preset){
if(!COMPASS||typeof COMPASS.getDiamondGeometry!=="function"||typeof COMPASS.drawCompass!=="function")return;

const y=state.compassAnchor.y-(state.compassLift*96)+(preset.compassLift*window.innerHeight);
const geo=COMPASS.getDiamondGeometry({
width:w,
height:h,
centerX:state.compassAnchor.x+(state.dragX*12),
centerY:y,
size:Math.min(w,h)*0.085,
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

drawCompass(w,h,preset);
BG.drawWater(ctx,w,h,state.tick,preset,state.background,null);
drawHarborMarker(w,h);
drawCompassSignal(w,h);

if(state.fx&&typeof FX.drawNavigationOverlay==="function"){
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
