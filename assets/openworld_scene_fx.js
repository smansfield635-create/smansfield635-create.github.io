(function(){
"use strict";

function getPoint(canvas,clientX,clientY){
const rect=canvas.getBoundingClientRect();
return{
x:clientX-rect.left,
y:clientY-rect.top
};
}

function bind(canvas,handlers){
const h=handlers||{};

canvas.addEventListener("pointerdown",function(e){
if(typeof h.onPointerDown==="function"){
h.onPointerDown(getPoint(canvas,e.clientX,e.clientY),e);
}
});

canvas.addEventListener("pointermove",function(e){
if(typeof h.onPointerMove==="function"){
h.onPointerMove(getPoint(canvas,e.clientX,e.clientY),e);
}
});

canvas.addEventListener("pointerup",function(e){
if(typeof h.onPointerUp==="function"){
h.onPointerUp(getPoint(canvas,e.clientX,e.clientY),e);
}
});

canvas.addEventListener("pointerleave",function(e){
if(typeof h.onPointerLeave==="function"){
h.onPointerLeave(e);
}
});

canvas.addEventListener("touchstart",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
if(typeof h.onTouchStart==="function"){
h.onTouchStart(getPoint(canvas,t.clientX,t.clientY),t,e);
}
},{passive:true});

canvas.addEventListener("touchmove",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
if(typeof h.onTouchMove==="function"){
h.onTouchMove(getPoint(canvas,t.clientX,t.clientY),t,e);
}
},{passive:true});

canvas.addEventListener("touchend",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
if(typeof h.onTouchEnd==="function"){
h.onTouchEnd(getPoint(canvas,t.clientX,t.clientY),t,e);
}
},{passive:true});
}

window.OPENWORLD_SCENE_INPUT=Object.freeze({
version:"OPENWORLD_SCENE_INPUT_vMIN1",
bind:bind
});
})();
