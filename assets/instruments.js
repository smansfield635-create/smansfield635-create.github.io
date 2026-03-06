(function(){

let layer=1

function setLayer(n){
layer=n
if(window.__renderEngine){
window.__renderEngine.setLayer(n)
}
}

document.addEventListener("click",e=>{

if(e.target.dataset.layer){
setLayer(Number(e.target.dataset.layer))
}

})

})();
