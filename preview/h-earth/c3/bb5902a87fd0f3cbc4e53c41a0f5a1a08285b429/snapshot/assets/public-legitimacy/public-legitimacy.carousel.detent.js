(()=>{
"use strict";
const root=document.querySelector("[data-carousel]");
const viewport=root?.querySelector("[data-viewport]");
const ring=root?.querySelector("[data-ring]");
const tabs=root?.querySelector("[data-tabs]");
if(!root||!viewport||!ring||!tabs)return;

let dragging=false,pointerId=null,startX=0,lastX=0,lastTime=0,travel=0,velocity=0,startIndex=0,suppressClick=false;
let openPointerId=null,openButton=null,openStartX=0,openStartY=0,openTravel=0;
const tabButtons=()=>[...tabs.querySelectorAll("[data-index]")];
const cards=()=>[...ring.querySelectorAll(".card")];
const count=()=>Math.max(1,tabButtons().length||cards().length);
const normalize=(value,n)=>((value%n)+n)%n;
const activeIndex=()=>{
  const list=tabButtons();
  const selected=list.findIndex(b=>b.getAttribute("aria-selected")==="true");
  if(selected>=0)return selected;
  const active=cards().findIndex(c=>c.dataset.active==="true");
  return active>=0?active:0;
};
const step=()=>360/count();
const angleFor=index=>-normalize(index,count())*step();
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

function syncInspectionPlane(){
  const inspecting=root.dataset.inspecting==="true";
  if(inspecting){
    ring.style.setProperty("transition","none","important");
    ring.style.setProperty("transform","none","important");
    viewport.style.setProperty("perspective","none","important");
    root.dataset.inspectionPlane="flat";
  }else{
    ring.style.removeProperty("transform");
    ring.style.removeProperty("transition");
    viewport.style.removeProperty("perspective");
    root.dataset.inspectionPlane="orbit";
  }
}
addEventListener("PUBLIC_LEGITIMACY_CAROUSEL_CHANGED",syncInspectionPlane);
syncInspectionPlane();

function selectAdjacent(direction){
  if(!direction)return;
  const list=tabButtons();
  if(!list.length)return;
  const next=normalize(startIndex-direction,list.length);
  list[next]?.click();
}

viewport.addEventListener("pointerdown",event=>{
  const opener=event.target.closest("[data-open]");
  if(opener&&event.pointerType!=="mouse"&&root.dataset.inspecting!=="true"){
    openPointerId=event.pointerId;
    openButton=opener;
    openStartX=event.clientX;
    openStartY=event.clientY;
    openTravel=0;
    return;
  }
  if(root.dataset.inspecting==="true"||(event.pointerType==="mouse"&&event.button!==0)||event.target.closest("button,a"))return;
  event.stopImmediatePropagation();
  dragging=true;
  pointerId=event.pointerId;
  startX=lastX=event.clientX;
  lastTime=performance.now();
  travel=0;
  velocity=0;
  startIndex=activeIndex();
  suppressClick=false;
  viewport.dataset.dragging="true";
  viewport.setPointerCapture?.(event.pointerId);
},{capture:true});

viewport.addEventListener("pointermove",event=>{
  if(openPointerId===event.pointerId){
    openTravel=Math.max(openTravel,Math.hypot(event.clientX-openStartX,event.clientY-openStartY));
    return;
  }
  if(!dragging||event.pointerId!==pointerId)return;
  event.stopImmediatePropagation();
  const now=performance.now();
  const width=Math.max(320,viewport.clientWidth||root.clientWidth||960);
  const delta=event.clientX-startX;
  travel=Math.max(travel,Math.abs(delta));
  const maxAngle=step()*.92;
  const dragAngle=clamp((delta/width)*190,-maxAngle,maxAngle);
  ring.style.setProperty("--ring-rotation",`${angleFor(startIndex)+dragAngle}deg`);
  const elapsed=Math.max(8,now-lastTime);
  velocity=(event.clientX-lastX)/elapsed;
  lastX=event.clientX;
  lastTime=now;
},{capture:true});

function finish(event){
  if(openPointerId===event.pointerId){
    const button=openButton;
    const isTap=openTravel<7;
    openPointerId=null;
    openButton=null;
    openTravel=0;
    if(isTap&&button?.isConnected&&root.dataset.inspecting!=="true"){
      event.preventDefault();
      event.stopImmediatePropagation();
      button.click();
    }
    return;
  }
  if(!dragging||event.pointerId!==pointerId)return;
  event.stopImmediatePropagation();
  dragging=false;
  viewport.dataset.dragging="false";
  viewport.releasePointerCapture?.(event.pointerId);
  pointerId=null;
  const delta=event.clientX-startX;
  if(travel<7){
    ring.style.setProperty("--ring-rotation",`${angleFor(startIndex)}deg`);
    return;
  }
  suppressClick=true;
  const threshold=Math.max(18,(viewport.clientWidth||320)*.055);
  const direction=Math.abs(delta)>=threshold||Math.abs(velocity)>.28?Math.sign(delta||velocity):0;
  if(direction)selectAdjacent(direction);
  else ring.style.setProperty("--ring-rotation",`${angleFor(startIndex)}deg`);
}
viewport.addEventListener("pointerup",finish,{capture:true});
viewport.addEventListener("pointercancel",event=>{
  if(openPointerId===event.pointerId){
    openPointerId=null;
    openButton=null;
    openTravel=0;
    return;
  }
  finish(event);
},{capture:true});
viewport.addEventListener("click",event=>{
  if(!suppressClick)return;
  suppressClick=false;
  event.preventDefault();
  event.stopImmediatePropagation();
},{capture:true});
})();
