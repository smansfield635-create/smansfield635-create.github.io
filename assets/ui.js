(function () {
  function onReady(fn){
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  onReady(()=>{
    // Home is static. Do nothing here.
    const page = document.querySelector("[data-page]")?.getAttribute("data-page") || "";
    if(page === "home") return;
  });
})();
