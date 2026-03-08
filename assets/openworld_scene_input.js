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
let touchActive=false;

function emit(name,payload,raw){
const fn=h[name];
if(typeof fn==="function")fn(payload,raw);
}

canvas.style.touchAction="none";

canvas.addEventListener("pointerdown",function(e){
if(touchActive)return;
emit("onPointerDown",getPoint(canvas,e.clientX,e.clientY),e);
},{passive:false});

canvas.addEventListener("pointermove",function(e){
if(touchActive)return;
emit("onPointerMove",getPoint(canvas,e.clientX,e.clientY),e);
},{passive:false});

canvas.addEventListener("pointerup",function(e){
if(touchActive)return;
emit("onPointerUp",getPoint(canvas,e.clientX,e.clientY),e);
},{passive:false});

canvas.addEventListener("pointerleave",function(e){
if(touchActive)return;
emit("onPointerLeave",null,e);
},{passive:false});

canvas.addEventListener("touchstart",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
touchActive=true;
const t=e.changedTouches[0];
emit("onTouchStart",getPoint(canvas,t.clientX,t.clientY),t);
e.preventDefault();
},{passive:false});

canvas.addEventListener("touchmove",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
emit("onTouchMove",getPoint(canvas,t.clientX,t.clientY),t);
e.preventDefault();
},{passive:false});

canvas.addEventListener("touchend",function(e){
if(!e.changedTouches||!e.changedTouches.length){
touchActive=false;
emit("onTouchEnd",null,e);
return;
}
const t=e.changedTouches[0];
emit("onTouchEnd",getPoint(canvas,t.clientX,t.clientY),t);
touchActive=false;
e.preventDefault();
},{passive:false});

canvas.addEventListener("click",function(e){
emit("onPointerDown",getPoint(canvas,e.clientX,e.clientY),e);
emit("onPointerUp",getPoint(canvas,e.clientX,e.clientY),e);
},{passive:false});
}

window.OPENWORLD_SCENE_INPUT=Object.freeze({
version:"OPENWORLD_SCENE_INPUT_v1",
bind:bind
});
})();
