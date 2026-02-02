(function(){
  window.GEO = window.GEO || {};
  GEO.ui = {
    ready(fn){
      if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
      else fn();
    }
  };
})();
