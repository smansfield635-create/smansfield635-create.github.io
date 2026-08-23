const WORLD_CANVAS=document.querySelector('[data-h-earth-map-wide-canvas]');
const stage=WORLD_CANVAS?.parentElement;
if(stage){
  const enforce=()=>{
    const canvases=[...stage.querySelectorAll('canvas')];
    for(const canvas of canvases){
      if(canvas===WORLD_CANVAS){canvas.style.zIndex='0';continue;}
      if(canvas.dataset.audraliaExteriorWeather==='true'){canvas.style.zIndex='2';continue;}
      if(canvas.dataset.audraliaCanonicalWeather==='true'||canvas.dataset.audraliaLocalWeather==='true'){canvas.style.zIndex='3';continue;}
      const zi=Number.parseInt(canvas.style.zIndex||getComputedStyle(canvas).zIndex,10);
      if(zi===4){canvas.style.zIndex='1';canvas.dataset.audraliaCelestialBehindWeather='true';}
    }
  };
  enforce();
  new MutationObserver(enforce).observe(stage,{childList:true,subtree:false});
  window.__AUDRALIA_COMPOSITION_AUTHORITY_REPAIR__=Object.freeze({schema:'AUDRALIA_COMPOSITION_AUTHORITY_REPAIR_v1',terrain:0,celestial:1,macroWeather:2,localWeather:3});
}
