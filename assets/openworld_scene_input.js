(function(){
"use strict";

function getPoint(canvas,clientX,clientY){
const rect=canvas.getBoundingClientRect();
return{
x:clientX-rect.left,
y:clientY-rect.top
};
}

function pointInRect(x,y,rect){
if(!rect)return false;
return x>=rect.x&&x<=rect.x+rect.w&&y>=rect.y&&y<=rect.y+rect.h;
}

function bind(canvas,handlers){
const h=handlers||{};

canvas.addEventListener("pointerdown",function(e){
const p=getPoint(canvas,e.clientX,e.clientY);
if(typeof h.onPointerDown==="function")h.onPointerDown(p,e);
});

canvas.addEventListener("pointermove",function(e){
const p=getPoint(canvas,e.clientX,e.clientY);
if(typeof h.onPointerMove==="function")h.onPointerMove(p,e);
});

canvas.addEventListener("pointerup",function(e){
const p=getPoint(canvas,e.clientX,e.clientY);
if(typeof h.onPointerUp==="function")h.onPointerUp(p,e);
});

canvas.addEventListener("pointerleave",function(e){
if(typeof h.onPointerLeave==="function")h.onPointerLeave(e);
});

canvas.addEventListener("touchstart",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
const p=getPoint(canvas,t.clientX,t.clientY);
if(typeof h.onTouchStart==="function")h.onTouchStart(p,t,e);
},{passive:true});

canvas.addEventListener("touchmove",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
const p=getPoint(canvas,t.clientX,t.clientY);
if(typeof h.onTouchMove==="function")h.onTouchMove(p,t,e);
},{passive:true});

canvas.addEventListener("touchend",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
const p=getPoint(canvas,t.clientX,t.clientY);
if(typeof h.onTouchEnd==="function")h.onTouchEnd(p,t,e);
},{passive:true});
}

window.OPENWORLD_SCENE_INPUT=Object.freeze({
version:"OPENWORLD_SCENE_INPUT_vMAX1",
bind:bind,
pointInRect:pointInRect
});
})();
