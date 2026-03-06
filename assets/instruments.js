(function(){

let layer = 1

window.navigatorLayer = function(n){
  layer = n
  if(window.__renderEngine){
     window.__renderEngine.setLayer(n)
  }
}

})();
