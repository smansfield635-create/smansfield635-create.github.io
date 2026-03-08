(function(){
"use strict";

/*
OPENWORLD_SCENE_v3
Stable animation kernel
Compass lift controller
Dragon runtime integration
Moon tap interaction
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

/* SAFETY */

if(!CAMERA||!BG||!COMPASS||!DRAGONS||!INPUT){
console.error("OPENWORLD_SCENE_v3 missing modules");
return;
}

/* CONSTANTS */

const COMPASS_REST=0.18;
const COMPASS_ACTIVE=0.30;

/* STATE */

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

compassLift:0,
compassTarget:0,

/* moons */

moonLeftPhase:0,
moonRightPhase:0,

/* dragons */

dragonLeft:false,
dragonRight:false,

camera:CAMERA.createState("fixed_harbor"),
background:BG.createState()
};

/* UTIL */

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
}

function resolveFaceMeta(face){
if(face==="C")return{short:"CORE"};
if(face==="M")return{short:"M"};
if(face==="N")return{short:"N"};
if(face==="E")return{short:"E"};
if(face==="S")return{short:"S"};
if(face==="W")return{short:"W"};
return{short:String(face||"")};
}

/* COMPASS */

function raiseCompass(){
state.compassTarget=1;
}

function lowerCompass(){
state.compassTarget=0;
}

/* MOONS */

function tapLeftMoon(){
state.moonLeftPhase=(state.moonLeftPhase+1)%4;
state.dragonLeft=true;
raiseCompass();
}

function tapRightMoon(){
state.moonRightPhase=(state.moonRightPhase+1)%4;
state.dragonRight=true;
raiseCompass();
}

/* INPUT */

function pointerDown(p){
state.dragging=true;
state.lastX=p.x;
state.lastY=p.y;
}

function pointerMove(p){
if(!state.dragging)return;

const dx=p.x-state.lastX;
const dy=p.y-state.lastY;

state.lastX=p.x;
state.lastY=p.y;

state.rotVelY+=dx*0.001;
state.rotVelX+=dy*0.001;
}

function pointerUp(){
state.dragging=false;
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
}

/* ANIMATION */

function animate(){
state.tick++;

/* compass easing */
state.compassLift=lerp(state.compassLift,state.compassTarget,0.06);

/* rotation */
state.rotY+=state.rotVelY;
state.rotX+=state.rotVelX;

state.rotVelY*=0.97;
state.rotVelX*=0.97;

state.rotVelY=clamp(state.rotVelY,-0.14,0.14);
state.rotVelX=clamp(state.rotVelX,-0.14,0.14);

/* camera */
CAMERA.update(state.camera,0.06);

/* celestial */
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
if(HARBOR&&HARBOR.draw){
HARBOR.draw(ctx,w,h,state.tick);
}

/* COMPASS HEIGHT */
const compassY=lerp(
h*COMPASS_REST,
h*COMPASS_ACTIVE,
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

geo.centerY=compassY;
state.cube=geo;

/* DRAGONS */
const bundles=DRAGONS.getDragonBundles(geo,{
tick:state.tick,
dragonLoop:true,
dragonStart:0,
background:state.background,
motion:{
dragons:{
orbitCenter:{x:0,y:520,z:420},
orbitRadius:420,
orbitSpeed:0.0019
}
}
});

/* BACK */
if(state.dragonLeft||state.dragonRight){
DRAGONS.drawBack(ctx,geo,bundles,state.tick);
}

/* COMPASS */
COMPASS.drawCube(ctx,geo,state.tick,resolveFaceMeta,null);

/* FRONT */
if(state.dragonLeft||state.dragonRight){
DRAGONS.drawFront(ctx,geo,bundles,state.tick,"en",{
tick:state.tick,
dragonLoop:true,
dragonStart:0,
background:state.background,
motion:{
dragons:{
orbitCenter:{x:0,y:520,z:420},
orbitRadius:420,
orbitSpeed:0.0019
}
}
});
}
}

/* FRAME */

function frame(){
animate();
draw();
requestAnimationFrame(frame);
}

/* INPUT BIND */

INPUT.bind(canvas,{
onPointerDown:pointerDown,
onPointerMove:pointerMove,
onPointerUp:pointerUp,
onTouchStart:pointerDown,
onTouchMove:pointerMove,
onTouchEnd:pointerUp
});

/* BOOT */

window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});

resize();
frame();

})();
