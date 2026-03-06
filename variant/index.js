(function(){
  "use strict";

  const ROOT_ID = "variant-root";
  const DEFAULT_STATE = {
    lang: "en",
    style: "formal",
    time: "now",
    depth: "explore"
  };

  function readState(){
    const query = new URLSearchParams(window.location.search);
    return {
      lang: query.get("lang") || localStorage.getItem("gd_lang") || DEFAULT_STATE.lang,
      style: query.get("style") || localStorage.getItem("gd_style") || DEFAULT_STATE.style,
      time: query.get("time") || localStorage.getItem("gd_time") || DEFAULT_STATE.time,
      depth: query.get("depth") || localStorage.getItem("gd_depth") || DEFAULT_STATE.depth
    };
  }

  function mountShell(){
    const root = document.getElementById(ROOT_ID);
    if(!root) return null;

    root.innerHTML = [
      '<div class="sceneRoot">',
      '  <canvas class="sceneCanvas" aria-hidden="true"></canvas>',
      '  <div class="sceneHud" aria-hidden="true">',
      '    <div class="sceneBadge" data-role="state"></div>',
      '    <div class="sceneBadge" data-role="mode"></div>',
      '    <div class="sceneBadge" data-role="signal"></div>',
      '  </div>',
      '</div>'
    ].join("");

    return {
      canvas: root.querySelector(".sceneCanvas"),
      stateBadge: root.querySelector('[data-role="state"]'),
      modeBadge: root.querySelector('[data-role="mode"]'),
      signalBadge: root.querySelector('[data-role="signal"]')
    };
  }

  function labelMode(state){
    if(state.depth === "learn") return "verification lean";
    if(state.style === "informal") return "frontier lean";
    return "foundation lean";
  }

  function labelSignal(state){
    if(state.time === "origin") return "origin frame";
    if(state.time === "post") return "post frame";
    return "live frame";
  }

  function boot(){
    if(!window.DRAGON_COMPASS_SCENE || typeof window.DRAGON_COMPASS_SCENE.start !== "function") return;

    const shell = mountShell();
    if(!shell) return;

    const state = readState();

    shell.stateBadge.textContent = [state.lang, state.style, state.time, state.depth].join(" · ");
    shell.modeBadge.textContent = labelMode(state);
    shell.signalBadge.textContent = labelSignal(state);

    window.DRAGON_COMPASS_SCENE.start(shell.canvas, {
      state,
      mode: "home_primary_hub",
      structure: "rhombic_dodecahedron"
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }
})();
