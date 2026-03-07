(function(){
"use strict";

const canvas=document.getElementById("scene");
if(!canvas)return;

const ctx=canvas.getContext("2d");
if(!ctx)return;

const CAMERA=window.OPENWORLD_CAMERA;
const BG=window.OPENWORLD_BACKGROUND_RENDERER;
const COMPASS=window.OPENWORLD_COMPASS_RENDERER;
const DRAGONS=window.OPENWORLD_DRAGON_RENDERER;
const SHOWROOM=window.OPENWORLD_SHOWROOM_RENDERER;
const FX=window.OPENWORLD_SCENE_FX;
const INPUT=window.OPENWORLD_SCENE_INPUT;

const ENV=window.ENVIRONMENT_RUNTIME||null;
const HARBOR=window.HARBOR_RENDERER||null;

const state={
tick:0,

rotX:-0.30,
rotY:0.24,
rotVelX:0,
rotVelY:0,

dragging:false,
lastX:0,
lastY:0,

hoverFace:null,
faceZones:{},
cube:null,

camera:CAMERA.createState("fixed_harbor"),
background:BG.createState(),
showroom:SHOWROOM.createState(),
fx:FX.createState(),

compass:{
mode:"rest",       // rest | rising | active | setting
height:0,          // 0 = hidden | 1 = full raised
}
};

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function dispatch(name,detail){
document.dispatchEvent(new CustomEvent(name,{detail}));
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

BG.initLanterns(state.background,w,h);
BG.initClouds(state.background,w,h);
BG.initMountains(state.background,w,h,preset);

SHOWROOM.refreshTargets(state.showroom,w,h);
}

function getFaceAt(x,y){
for(const key of ["C","W","E","N","S","M"]){
const poly=state.faceZones[key];
if(poly && INPUT.pointInPoly(x,y,poly)) return key;
}
return null;
}

function engageDrag(x,y){
state.dragging=true;
state.lastX=x;
state.lastY=y;
}

function moveDrag(x,y){

state.hoverFace=getFaceAt(x,y);

if(!state.dragging)return;

const dx=x-state.lastX;
const dy=y-state.lastY;

state.lastX=x;
state.lastY=y;

state.rotVelY+=dx*0.001;
state.rotVelX+=dy*0.001;

if(state.compass.mode==="rest"){
state.compass.mode="rising";
}

}

function releaseDrag(){
state.dragging=false;
}

function updateCompass(){

if(state.compass.mode==="rising"){
state.compass.height+=0.05;
if(state.compass.height>=1){
state.compass.height=1;
state.compass.mode="active";
}
}

if(state.compass.mode==="setting"){
state.compass.height-=0.05;
if(state.compass.height<=0){
state.compass.height=0;
state.compass.mode="rest";
}
}

if(state.compass.mode==="active" && !state.dragging){
state.compass.mode="setting";
}

}

function animate(){

state.tick++;

BG.syncCelestials(state.background,ENV,state.tick);

CAMERA.update(state.camera,0.06);

updateCompass();

state.rotY+=state.rotVelY;
state.rotX+=state.rotVelX;

state.rotVelY*=0.96;
state.rotVelX*=0.96;

draw();

requestAnimationFrame(animate);
}

function draw(){

const w=window.innerWidth;
const h=window.innerHeight;

const preset=CAMERA.getBlendedPreset(state.camera);

ctx.clearRect(0,0,w,h);

BG.drawSky(ctx,w,h,state.tick,preset,state.background);
BG.drawSun(ctx,w,h,state.background);
BG.drawMoon(ctx,w,h,state.background);

BG.drawClouds(ctx,state.background,state.tick);
BG.drawLanterns(ctx,state.background,state.tick,1);

BG.drawMountains(ctx,w,h,state.background,preset);
BG.drawWater(ctx,w,h,state.tick,preset,state.background);

if(HARBOR && HARBOR.draw){
HARBOR.draw(ctx,w,h,state.tick);
}

const geo=COMPASS.getCubeGeometry({
width:w,
height:h,
preset:preset,
rotX:state.rotX,
rotY:state.rotY,
cameraRequested:state.camera.requested
});

state.cube=geo;
state.faceZones=geo.faces;

/* vertical lift */

geo.centerY -= geo.size*2.2*state.compass.height;

COMPASS.drawCube(ctx,geo,state.tick,()=>({short:""}),state.hoverFace);

const bundles=DRAGONS.getDragonBundles(geo,state);

DRAGONS.drawDragonReflections(ctx,geo,preset,bundles,state.tick);
DRAGONS.drawBack(ctx,geo,bundles,state.tick);
DRAGONS.drawFront(ctx,geo,bundles,state.tick,"en",state);

SHOWROOM.drawFragments(ctx,state.showroom,state.tick);

FX.drawFireworks(ctx,state.fx);
}

INPUT.bind(canvas,{
onPointerMove:p=>moveDrag(p.x,p.y),
onPointerDown:p=>engageDrag(p.x,p.y),
onPointerUp:releaseDrag,
onPointerLeave:releaseDrag
});

window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",resize,{passive:true});

resize();
animate();

})();
