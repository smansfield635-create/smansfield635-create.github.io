(function(){
"use strict";

function getPointerPos(canvas,e){
const rect=canvas.getBoundingClientRect();
return{
x:e.clientX-rect.left,
y:e.clientY-rect.top
};
}

function getTouchPos(canvas,touch){
const rect=canvas.getBoundingClientRect();
return{
x:touch.clientX-rect.left,
y:touch.clientY-rect.top
};
}

function pointInPoly(x,y,poly){
let inside=false;

for(let i=0,j=poly.length-1;i<poly.length;j=i++){
const xi=poly[i].x;
const yi=poly[i].y;
const xj=poly[j].x;
const yj=poly[j].y;
const hit=((yi>y)!==(yj>y))&&(x<((xj-xi)*(y-yi))/(yj-yi)+xi);
if(hit)inside=!inside;
}

return inside;
}

function bind(canvas,handlers){
if(!canvas||!handlers)return;

canvas.addEventListener("pointermove",function(e){
const p=getPointerPos(canvas,e);
if(typeof handlers.onPointerMove==="function")handlers.onPointerMove(p,e);
},{passive:true});

canvas.addEventListener("pointerdown",function(e){
const p=getPointerPos(canvas,e);
if(typeof handlers.onPointerDown==="function")handlers.onPointerDown(p,e);
},{passive:true});

canvas.addEventListener("pointerup",function(e){
const p=getPointerPos(canvas,e);
if(typeof handlers.onPointerUp==="function")handlers.onPointerUp(p,e);
},{passive:true});

canvas.addEventListener("touchstart",function(e){
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(canvas,touch);
if(typeof handlers.onTouchStart==="function")handlers.onTouchStart(p,touch,e);
},{passive:true});

canvas.addEventListener("touchmove",function(e){
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(canvas,touch);
if(typeof handlers.onTouchMove==="function")handlers.onTouchMove(p,touch,e);
},{passive:true});

canvas.addEventListener("touchend",function(e){
const touch=e.changedTouches&&e.changedTouches[0];
if(!touch)return;
const p=getTouchPos(canvas,touch);
if(typeof handlers.onTouchEnd==="function")handlers.onTouchEnd(p,touch,e);
e.preventDefault();
},{passive:false});

canvas.addEventListener("pointerleave",function(e){
if(typeof handlers.onPointerLeave==="function")handlers.onPointerLeave(e);
});

document.addEventListener("compass:morph",function(e){
if(typeof handlers.onMorphEvent==="function")handlers.onMorphEvent(e);
});

document.addEventListener("scene:camera",function(e){
if(typeof handlers.onSceneCamera==="function")handlers.onSceneCamera(e);
});

document.addEventListener("scene:camera:cycle",function(e){
if(typeof handlers.onSceneCameraCycle==="function")handlers.onSceneCameraCycle(e);
});
}

window.OPENWORLD_SCENE_INPUT=Object.freeze({
version:"OPENWORLD_SCENE_INPUT_v1",
pointInPoly,
bind
});

})();
