(function(){
"use strict";

/*
OPENWORLD_SCENE_v2
Compass rise/set system
Moon tap phase cycling
Dragon spawn triggers
Global action consequence system
*/

const canvas=document.getElementById("scene");
if(!canvas)return;

const ctx=canvas.getContext("2d");
if(!ctx)return;

/* MODULES */

const CAMERA=window.OPENWORLD_CAMERA;
const BG=window.OPENWORLD_BACKGROUND_RENDERER;
const COMPASS=window.OPENWORLD_COMPASS_RENDERER;
const DRAGONS=window.OPENWORLD_DRAGON_RENDERER;
const SHOWROOM=window.OPENWORLD_SHOWROOM_RENDERER;
const FX=window.OPENWORLD_SCENE_FX;
const INPUT=window.OPENWORLD_SCENE_INPUT;

const ENV=window.ENVIRONMENT_RUNTIME||null;
const HARBOR=window.HARBOR_RENDERER||null;

/* CONSTANTS */

const COMPASS_REST_Y_FACTOR=0.16;
const COMPASS_ACTIVE_Y_FACTOR=0.28;

/* GLOBAL STATE */

const state={
tick:0,

rotX:-0.3,
rotY:0.24,
rotVelX:0,
rotVelY:0,

dragging:false,
lastX:0,
lastY:0,

faceZones:{},
cube:null,

/* compass */

compassState:"REST",
compassLift:0,

/* moons */

moonPhaseLeft:0,
moonPhaseRight:0,

/* dragons */

dragonLeftActive:false,
dragonRightActive:false,

/* action system */

actionCounter:0,

/* rendering */

camera:CAMERA.createState("fixed_harbor"),
background:BG.createState(),
showroom:SHOWROOM.createState(),
fx:FX.createState()
};

/* UTIL */

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
}

function dispatch(name,detail){
document.dispatchEvent(new CustomEvent(name,{detail}));
}

/* ACTION CONSEQUENCE SYSTEM */

function registerAction(){
state.actionCounter++;
state.moonPhaseLeft=state.moonPhaseLeft%4;
state.moonPhaseRight=state.moonPhaseRight%4;
}

/* MOON TAP */

function tapMoonLeft(){
state.moonPhaseLeft=(state.moonPhaseLeft+1)%4;
state.dragonLeftActive=true;
registerAction();
}

function tapMoonRight(){
state.moonPhaseRight=(state.moonPhaseRight+1)%4;
state.dragonRightActive=true;
registerAction();
}

/* COMPASS STATE MACHINE */

function summonCompass(){
if(state.compassState==="REST"){
state.compassState="RISING";
}
}

function lowerCompass(){
if(state.compassState==="ACTIVE"){
state.compassState="SETTING";
}
}

function updateCompass(){
if(state.compassState==="RISING"){
state.compassLift+=0.05;
if(state.compassLift>=1){
state.compassLift=1;
state.compassState="ACTIVE";
}
}else if(state.compassState==="SETTING"){
state.compassLift-=0.05;
if(state.compassLift<=0){
state.compassLift=0;
state.compassState="REST";
}
}
}

/* RESIZE */

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

BG.initLanterns(state.background,w,h);
BG.initClouds(state.background,w,h);
BG.initMountains(state.background,w,h,preset);

SHOWROOM.refreshTargets(state.showroom,w,h);

}

/* INTERACTION */

function engageDrag(x,y){
state.dragging=true;
state.lastX=x;
state.lastY=y;
}

function moveDrag(x,y){

if(!state.dragging)return;

const dx=x-state.lastX;
const dy=y-state.lastY;

state.lastX=x;
state.lastY=y;

state.rotVelY+=dx*0.001;
state.rotVelX+=dy*0.001;
}

function releaseDrag(){
state.dragging=false;
}

/* ANIMATE */

function animate(){

state.tick++;

updateCompass();

state.rotY+=state.rotVelY;
state.rotX+=state.rotVelX;

state.rotVelY*=0.97;
state.rotVelX*=0.97;

CAMERA.update(state.camera,0.06);

BG.syncCelestials(state.background,ENV,state.tick);
}

/* DRAW */

function draw(){

const w=window.innerWidth;
const h=window.innerHeight;

const preset=CAMERA.getBlendedPreset(state.camera);

ctx.clearRect(0,0,w,h);

/* SKY */
BG.drawSky(ctx,w,h,state.tick,preset,state.background);
BG.drawSun(ctx,w,h,state.background);
BG.drawMoon(ctx,w,h,state.background);

/* CLOUDS */
BG.drawClouds(ctx,state.background,state.tick,null);

/* LANTERNS */
BG.drawLanterns(ctx,state.background,state.tick,1);

/* MOUNTAINS */
BG.drawMountains(ctx,w,h,state.background,preset);

/* WATER */
BG.drawWater(ctx,w,h,state.tick,preset,state.background,null);

/* HARBOR */
if(HARBOR)HARBOR.draw(ctx,w,h,state.tick);

/* COMPASS POSITION */
const liftY=lerp(
h*COMPASS_REST_Y_FACTOR,
h*COMPASS_ACTIVE_Y_FACTOR,
state.compassLift
);

/* COMPASS */
const geo=COMPASS.getCubeGeometry({
width:w,
height:h,
preset:preset,
rotX:state.rotX,
rotY:state.rotY,
morphPulse:0,
cameraRequested:state.camera.requested
});

geo.centerY=liftY;

state.cube=geo;
state.faceZones=geo.faces;

/* DRAGONS */
const dragonBundles=DRAGONS.getDragonBundles(geo,state);

if(state.dragonLeftActive||state.dragonRightActive){
DRAGONS.drawBack(ctx,geo,dragonBundles,state.tick);
}

/* COMPASS DRAW */
COMPASS.drawCube(ctx,geo,state.tick,()=>null,null);

/* FRONT DRAGONS */
if(state.dragonLeftActive||state.dragonRightActive){
DRAGONS.drawFront(ctx,geo,dragonBundles,state.tick,"en",state);
}

}

/* FRAME */

function frame(){
animate();
draw();
requestAnimationFrame(frame);
}

/* INPUT */

INPUT.bind(canvas,{
onPointerMove:function(p){
moveDrag(p.x,p.y);
},
onPointerDown:function(p){
engageDrag(p.x,p.y);
},
onPointerUp:function(){
releaseDrag();
},
onTouchStart:function(p){
engageDrag(p.x,p.y);
},
onTouchMove:function(p){
moveDrag(p.x,p.y);
},
onTouchEnd:function(){
releaseDrag();
}
});

/* BOOT */

window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});

resize();
frame();

})();
