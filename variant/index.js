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

    const lang = query.get("lang") || localStorage.getItem("gd_lang") || DEFAULT_STATE.lang;
    const style = query.get("style") || localStorage.getItem("gd_style") || DEFAULT_STATE.style;
    const time = query.get("time") || localStorage.getItem("gd_time") || DEFAULT_STATE.time;
    const depth = query.get("depth") || localStorage.getItem("gd_depth") || DEFAULT_STATE.depth;

    return { lang, style, time, depth };
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
      root,
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
    if(!window.RD12_SCENE || typeof window.RD12_SCENE.start !== "function") return;

    const shell = mountShell();
    if(!shell) return;

    const state = readState();

    shell.stateBadge.textContent = [state.lang, state.style, state.time, state.depth].join(" · ");
    shell.modeBadge.textContent = labelMode(state);
    shell.signalBadge.textContent = labelSignal(state);

    window.RD12_SCENE.start(shell.canvas, {
      state,
      family: "rhombic_dodecahedron",
      nodeCount: 12,
      gate: "home_primary_hub"
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }
})();
