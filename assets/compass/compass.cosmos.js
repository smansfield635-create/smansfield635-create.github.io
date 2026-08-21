/* Functional clone bridge derived from browser-qualified Gen1531. */
(()=>{
  'use strict';
  const GEN1531='https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/747b064135a0ff86915f5dbb75d8a128f66514a1/assets/compass/compass.cosmos.js';
  const PERFECTED_H_EARTH='https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/0c6069f30e494be2f84d2653f40e374178251c77/showroom/globe/h-earth/index.html';

  const original=document.createElement('script');
  original.src=GEN1531;
  original.defer=true;
  document.head.appendChild(original);

  const bind=()=>{
    document.querySelectorAll('[data-compass-room][data-label="H-Earth"]').forEach(el=>{
      el.dataset.route=PERFECTED_H_EARTH;
      el.setAttribute('href',PERFECTED_H_EARTH);
    });
    document.querySelectorAll('[data-compass-mirrorland-routes] a').forEach(el=>{
      if((el.textContent||'').trim()==='Enter the Demo') el.setAttribute('href',PERFECTED_H_EARTH);
    });
    document.querySelectorAll('a[href="/showroom/globe/h-earth/"]').forEach(el=>el.setAttribute('href',PERFECTED_H_EARTH));
  };

  document.addEventListener('DOMContentLoaded',bind,{once:true});
  document.addEventListener('click',event=>{
    const root=event.target?.closest?.('[data-compass-root]');
    if(!root)return;
    const enter=event.target?.closest?.('[data-compass-enter]');
    const selected=root.dataset.selectedRoom||root.dataset.clusterPreviewPrimaryRoom||root.dataset.clusterPrimaryRoom||'';
    const room=root.querySelector('[data-compass-room][data-label="H-Earth"]');
    if(enter&&room&&selected===room.dataset.roomId){
      event.preventDefault();
      event.stopImmediatePropagation();
      location.assign(PERFECTED_H_EARTH);
    }
  },true);

  globalThis.DGB_FUNCTIONAL_CLONE_BINDING=Object.freeze({
    source:'GEN1531_BROWSER_QUALIFIED',
    sourceHead:'747b064135a0ff86915f5dbb75d8a128f66514a1',
    perfectedHEarth:PERFECTED_H_EARTH,
    productionUntouched:true
  });
})();
