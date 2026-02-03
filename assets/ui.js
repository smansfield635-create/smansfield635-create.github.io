/* ui.js — TNT SAFE MODE
   RULE: Home page is STATIC. ui.js must not inject diamonds or content into Home.
   It may only provide generic click-to-reveal / toggles on pages that declare them.
*/

(function () {
  function onReady(fn){ if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",fn);} else {fn();} }

  function bindClickToReveal(){
    // Any element with [data-open] toggles the element referenced by id in data-open.
    document.querySelectorAll("[data-open]").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        e.preventDefault();
        const id = btn.getAttribute("data-open");
        const panel = document.getElementById(id);
        if(!panel) return;
        panel.hidden = !panel.hidden;
      }, {passive:false});
    });
  }

  function bindTabToggles(){
    // Any container with [data-tabs] expects buttons [data-tab] and panels [data-panel].
    document.querySelectorAll("[data-tabs]").forEach(root=>{
      const buttons = root.querySelectorAll("[data-tab]");
      const panels  = root.querySelectorAll("[data-panel]");
      if(!buttons.length || !panels.length) return;

      function activate(name){
        buttons.forEach(b=>b.classList.toggle("active", b.getAttribute("data-tab")===name));
        panels.forEach(p=>p.hidden = (p.getAttribute("data-panel")!==name));
      }

      buttons.forEach(b=>{
        b.addEventListener("click",(e)=>{
          e.preventDefault();
          activate(b.getAttribute("data-tab"));
        }, {passive:false});
      });

      activate(buttons[0].getAttribute("data-tab"));
    });
  }

  onReady(()=>{
    const page = document.querySelector("[data-page]")?.getAttribute("data-page") || "";
    if(page === "home"){
      // HARD LOCK: Home is static. Do nothing.
      return;
    }
    bindClickToReveal();
    bindTabToggles();
  });
})();
