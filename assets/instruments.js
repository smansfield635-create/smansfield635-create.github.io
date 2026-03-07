(function(){
"use strict";

const FACE_BINDINGS={
N:{type:"locked",route:null},
E:{type:"route",route:"/products/"},
S:{type:"route",route:"/laws/"},
W:{type:"route",route:"/gauges/"},
C:{type:"route",route:"/home/"},
M:{type:"morph",route:null}
};

function normalizeFace(value){
if(!value)return null;
const key=String(value).trim().toUpperCase();
return Object.prototype.hasOwnProperty.call(FACE_BINDINGS,key)?key:null;
}

function dispatch(name,detail){
document.dispatchEvent(new CustomEvent(name,{detail}));
}

/* ---------- UI CLEANUP ---------- */

function removeLegacyLayerUI(){
document.documentElement.removeAttribute("data-layer");
document.body.removeAttribute("data-layer");

document.querySelectorAll("[data-layer]").forEach(node=>{
node.setAttribute("hidden","hidden");
node.setAttribute("aria-hidden","true");
node.classList.remove("is-active");
if("disabled" in node)node.disabled=true;
node.style.pointerEvents="none";
node.style.opacity="0";
node.style.visibility="hidden";
});
}

/* ---------- ROUTING ---------- */

function navigate(route){
if(!route)return false;
window.location.href=route;
return true;
}

/* ---------- COMPASS ACTION ---------- */

function activate(face){

const key=normalizeFace(face);
if(!key)return {ok:false,status:"unknown-face",face:null};

const binding=FACE_BINDINGS[key];

if(binding.type==="route"){
dispatch("compass:route",{face:key,route:binding.route});
navigate(binding.route);
return {ok:true,status:"route",face:key,route:binding.route};
}

if(binding.type==="morph"){
dispatch("compass:morph",{face:key});
return {ok:true,status:"morph",face:key};
}

dispatch("compass:locked",{face:key});
return {ok:true,status:"locked",face:key,route:null};

}

/* ---------- CLICK BINDINGS ---------- */

function bindFaceClicks(){

document.addEventListener("click",e=>{

const layerBtn=e.target.closest("[data-layer]");
if(layerBtn){
e.preventDefault();
e.stopPropagation();
return;
}

const faceBtn=e.target.closest("[data-face]");
if(!faceBtn)return;

const face=normalizeFace(faceBtn.getAttribute("data-face"));
if(!face)return;

e.preventDefault();
activate(face);

});

}

/* ---------- WORLD TAP EVENTS ---------- */

function bindEnvironmentTap(){

document.addEventListener("pointerdown",e=>{

dispatch("environment:tap",{
x:e.clientX,
y:e.clientY,
time:performance.now()
});

});

}

/* ---------- GLOBAL API ---------- */

function installGlobalAPI(){

window.compassActions={
bindings:FACE_BINDINGS,
activate,
navigate,
morph(){
return activate("M");
},
locked(){
return activate("N");
}
};

window.worldEvents={
emit:(name,data)=>dispatch(name,data)
};

}

/* ---------- INIT ---------- */

function init(){

removeLegacyLayerUI();

bindFaceClicks();

bindEnvironmentTap();

installGlobalAPI();

dispatch("compass:ready",{bindings:FACE_BINDINGS});

}

/* ---------- BOOT ---------- */

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",init,{once:true});
}else{
init();
}

})();
