(function(){
function setLayer(n){
const next=Number(n)||1;
if(window.__renderEngine&&typeof window.__renderEngine.setLayer==="function"){
window.__renderEngine.setLayer(next);
}
document.documentElement.setAttribute("data-layer",String(next));
document.body.setAttribute("data-layer",String(next));
document.querySelectorAll("[data-layer]").forEach(btn=>{
const on=Number(btn.dataset.layer)===next;
btn.setAttribute("aria-pressed",on?"true":"false");
btn.classList.toggle("is-active",on);
});
}

document.addEventListener("click",e=>{
const btn=e.target.closest("[data-layer]");
if(!btn)return;
e.preventDefault();
setLayer(btn.dataset.layer);
});

document.addEventListener("DOMContentLoaded",()=>{
setLayer(1);
});
})();
