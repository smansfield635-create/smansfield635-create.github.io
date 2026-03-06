(function(){
  "use strict";

  const ROOT_ID = "variant-root";
  const CANON_DEFAULTS = {
    lang: "en",
    style: "formal",
    time: "now",
    depth: "explore"
  };

  function readCanonicalState(){
    try{
      if(window.CORE_STATE && typeof window.CORE_STATE.get === "function"){
        const state = window.CORE_STATE.get();
        return {
          lang: state.lang || CANON_DEFAULTS.lang,
          style: state.style || CANON_DEFAULTS.style,
          time: state.time || CANON_DEFAULTS.time,
          depth: state.depth || CANON_DEFAULTS.depth
        };
      }
    }catch(err){}
    return { ...CANON_DEFAULTS };
  }

  function mountShell(){
    const root = document.getElementById(ROOT_ID);
    if(!root) return null;

    root.innerHTML = [
      '<div class="sceneRoot">',
      '  <canvas class="sceneCanvas" aria-hidden="true"></canvas>',
      '  <div class="sceneHud" aria-hidden="true">',
      '    <div class="sceneBadge" data-role="state"></div>',
      '    <div class="sceneBadge" data-role="sector"></div>',
      '    <div class="sceneBadge" data-role="signal"></div>',
      '  </div>',
      '</div>'
    ].join("");

    return {
      root,
      canvas: root.querySelector(".sceneCanvas"),
      stateBadge: root.querySelector('[data-role="state"]'),
      sectorBadge: root.querySelector('[data-role="sector"]'),
      signalBadge: root.querySelector('[data-role="signal"]')
    };
  }

  function buildLabels(state){
    const stateLabel = [state.lang, state.style, state.time, state.depth].join(" · ");
    const sectorMap = {
      formal: "west bias",
      informal: "east bias"
    };
    const signalMap = {
      origin: "origin trace",
      now: "live frame",
      post: "post frame"
    };
    return {
      state: stateLabel,
      sector: sectorMap[state.style] || "center bias",
      signal: signalMap[state.time] || "live frame"
    };
  }

  function start(){
    const shell = mountShell();
    if(!shell) return;

    if(!window.RD12_SCENE || typeof window.RD12_SCENE.start !== "function"){
      return;
    }

    const state = readCanonicalState();
    const labels = buildLabels(state);

    shell.stateBadge.textContent = labels.state;
    shell.sectorBadge.textContent = labels.sector;
    shell.signalBadge.textContent = labels.signal;

    window.RD12_SCENE.start(shell.canvas, {
      state,
      nodeCount: 12,
      family: "rhombic_dodecahedron",
      mode: "immersive_primary_hub"
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", start);
  }else{
    start();
  }
})();
