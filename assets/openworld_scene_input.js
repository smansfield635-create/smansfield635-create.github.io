(function(){
"use strict";

function getPoint(canvas,clientX,clientY){
const rect=canvas.getBoundingClientRect();
return{
x:clientX-rect.left,
y:clientY-rect.top
};
}

function pointInPoly(x,y,poly){
if(!Array.isArray(poly)||poly.length<3)return false;

let inside=false;

for(let i=0,j=poly.length-1;i<poly.length;j=i++){
const xi=poly[i].x;
const yi=poly[i].y;
const xj=poly[j].x;
const yj=poly[j].y;

const intersects=((yi>y)!==(yj>y))&&(x<((xj-xi)*(y-yi)/(yj-yi))+xi);
if(intersects)inside=!inside;
}

return inside;
}

function bind(canvas,handlers){
const h=handlers||{};

canvas.addEventListener("pointerdown",function(e){
const p=getPoint(canvas,e.clientX,e.clientY);
if(h.onPointerDown)h.onPointerDown(p,e);
});

canvas.addEventListener("pointermove",function(e){
const p=getPoint(canvas,e.clientX,e.clientY);
if(h.onPointerMove)h.onPointerMove(p,e);
});

canvas.addEventListener("pointerup",function(e){
const p=getPoint(canvas,e.clientX,e.clientY);
if(h.onPointerUp)h.onPointerUp(p,e);
});

canvas.addEventListener("pointerleave",function(e){
if(h.onPointerLeave)h.onPointerLeave(e);
});

canvas.addEventListener("touchstart",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
const p=getPoint(canvas,t.clientX,t.clientY);
if(h.onTouchStart)h.onTouchStart(p,t,e);
},{passive:true});

canvas.addEventListener("touchmove",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
const p=getPoint(canvas,t.clientX,t.clientY);
if(h.onTouchMove)h.onTouchMove(p,t,e);
},{passive:true});

canvas.addEventListener("touchend",function(e){
if(!e.changedTouches||!e.changedTouches.length)return;
const t=e.changedTouches[0];
const p=getPoint(canvas,t.clientX,t.clientY);
if(h.onTouchEnd)h.onTouchEnd(p,t,e);
},{passive:true});
}

window.OPENWORLD_SCENE_INPUT=Object.freeze({
version:"OPENWORLD_SCENE_INPUT_v1",
bind:bind,
pointInPoly:pointInPoly
});
})();
