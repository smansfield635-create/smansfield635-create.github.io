(function(){

function setLayer(n){
const next = Number(n) || 1;

if(
window.renderEngine &&
typeof window.renderEngine.setLayer === "function"
){
window.renderEngine.setLayer(next);
}

document.documentElement.setAttribute("data-layer", String(next));
document.body.setAttribute("data-layer", String(next));

document.querySelectorAll("[data-layer]").forEach(btn=>{
const on = Number(btn.dataset.layer) === next;
btn.setAttribute("aria-pressed", on ? "true" : "false");
btn.classList.toggle("is-active", on);
});
}

function handleLayerTarget(target){
const btn = target && target.closest ? target.closest("[data-layer]") : null;
if(!btn) return false;
setLayer(btn.dataset.layer);
return true;
}

document.addEventListener("click", e=>{
if(handleLayerTarget(e.target)){
e.preventDefault();
}
});

document.addEventListener("pointerup", e=>{
if(handleLayerTarget(e.target)){
e.preventDefault();
}
});

document.addEventListener("touchend", e=>{
const touch = e.changedTouches && e.changedTouches[0];
if(!touch) return;
const target = document.elementFromPoint(touch.clientX, touch.clientY);
if(handleLayerTarget(target)){
e.preventDefault();
}
},{passive:false});

document.addEventListener("DOMContentLoaded", ()=>{
setLayer(1);
});

})();
