(()=>{
  'use strict';

  const CONTRACT='HOME_ARRIVAL_EXTERIOR_v1';
  const HOUSE_RENDERER_VERSION='mirror-manor-gothic-phase3-carousel-v6-material-detail-final';
  const HOUSE_SCENE_URL='/assets/compass/compass.house-scene.js?v=mirror-manor-gothic-phase3-carousel-v6-material-detail-final';
  const stage=document.querySelector('[data-home-arrival]');
  const manorStage=document.querySelector('[data-home-manor-stage]');
  const canvas=document.querySelector('[data-home-manor-canvas]');
  const torches=[...document.querySelectorAll('[data-home-torch]')];
  if(!stage||!manorStage||!canvas) return;

  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  let houseApi=null;
  let foreground=true;
  let destroyed=false;
  let readinessTimer=0;
  let torchTimers=[];

  stage.dataset.homeArrivalContract=CONTRACT;
  stage.dataset.homeArrivalRenderer=HOUSE_RENDERER_VERSION;
  stage.dataset.homeArrivalReady='false';
  stage.dataset.homeArrivalTorchCount=String(torches.length);
  stage.dataset.homeArrivalReducedMotion=reduced?'true':'false';
  manorStage.dataset.homeManorSource='assets/compass/compass.house-scene.js';
  manorStage.dataset.homeManorStatus='loading';

  const lightTorches=()=>{
    torchTimers.forEach(clearTimeout);
    torchTimers=[];
    if(reduced){
      torches.forEach(torch=>torch.classList.add('is-lit'));
      stage.classList.add('is-torch-ready');
      stage.dataset.homeArrivalTorches='steady';
      return;
    }
    const order=[0,5,1,4,2,3];
    order.forEach((index,step)=>{
      const id=setTimeout(()=>{
        torches[index]?.classList.add('is-lit');
        if(step===order.length-1){
          stage.classList.add('is-torch-ready');
          stage.dataset.homeArrivalTorches='lit';
        }
      },820+step*260);
      torchTimers.push(id);
    });
  };

  const waitForReady=()=>{
    let attempts=0;
    const check=()=>{
      if(destroyed) return;
      attempts+=1;
      const inspection=houseApi?.inspect?.();
      if(inspection?.ready){
        stage.dataset.homeArrivalReady='true';
        stage.dataset.homeArrivalHouseReady='true';
        stage.dataset.homeArrivalGeometry=inspection.geometry||'';
        manorStage.dataset.homeManorStatus='ready';
        lightTorches();
        return;
      }
      if(attempts>=120){
        stage.dataset.homeArrivalReady='false';
        stage.dataset.homeArrivalHouseReady='false';
        manorStage.dataset.homeManorStatus='timeout';
        return;
      }
      readinessTimer=setTimeout(check,100);
    };
    check();
  };

  const loadScene=()=>{
    const existing=globalThis.CompassHouseScene;
    if(existing?.version===HOUSE_RENDERER_VERSION) return Promise.resolve(existing);
    return import(HOUSE_SCENE_URL).then(()=>{
      const scene=globalThis.CompassHouseScene;
      if(!scene?.mount||scene.version!==HOUSE_RENDERER_VERSION) throw new Error('HOME_MATURE_MANOR_RENDERER_UNAVAILABLE');
      return scene;
    });
  };

  loadScene().then(scene=>{
    if(destroyed) return;
    houseApi=scene.mount(canvas,{foreground:()=>foreground});
    manorStage.dataset.homeManorRenderer=scene.version;
    houseApi?.draw?.();
    waitForReady();
  }).catch(error=>{
    manorStage.dataset.homeManorStatus='error';
    stage.dataset.homeArrivalError=String(error?.message||error);
  });

  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    foreground=!!entries[0]?.isIntersecting;
    houseApi?.setForeground?.(foreground);
    if(foreground) houseApi?.draw?.();
  },{threshold:.04}):null;
  observer?.observe(stage);

  globalThis.DGBHomeArrival=Object.freeze({
    contract:CONTRACT,
    renderer:HOUSE_RENDERER_VERSION,
    inspect(){
      return Object.freeze({
        contract:CONTRACT,
        renderer:HOUSE_RENDERER_VERSION,
        ready:stage.dataset.homeArrivalReady==='true',
        torches:stage.dataset.homeArrivalTorches||'pending',
        torchCount:torches.length,
        manor:houseApi?.inspect?.()||null
      });
    },
    destroy(){
      destroyed=true;
      clearTimeout(readinessTimer);
      torchTimers.forEach(clearTimeout);
      observer?.disconnect();
      houseApi?.setForeground?.(false);
    }
  });
})();
