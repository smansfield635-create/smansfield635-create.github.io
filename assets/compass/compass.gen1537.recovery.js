(()=>{
'use strict';
const PERFECTED_H_EARTH='https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/d29d2b8ec114669149f09904ebd269ac45c34c62/showroom/globe/h-earth/index.html';
const bindPerfectedHEarth=()=>{
  document.querySelectorAll('[data-compass-room][data-label="H-Earth"]').forEach(el=>{
    el.dataset.route=PERFECTED_H_EARTH;
    el.setAttribute('href',PERFECTED_H_EARTH);
  });
  document.querySelectorAll('a[href="/showroom/globe/h-earth/"]').forEach(el=>{
    el.setAttribute('href',PERFECTED_H_EARTH);
  });
};
document.addEventListener('DOMContentLoaded',bindPerfectedHEarth,{once:true});
document.addEventListener('click',event=>{
  const root=event.target?.closest?.('[data-compass-root]');
  if(!root)return;
  const room=root.querySelector('[data-compass-room][data-label="H-Earth"]');
  const selected=root.dataset.selectedRoom||root.dataset.clusterPreviewPrimaryRoom||root.dataset.clusterPrimaryRoom||'';
  const enter=event.target?.closest?.('[data-compass-enter]');
  const direct=event.target?.closest?.('a[href="/showroom/globe/h-earth/"],a[href="'+PERFECTED_H_EARTH+'"]');
  if(direct){
    event.preventDefault();
    event.stopImmediatePropagation();
    globalThis.location.assign(PERFECTED_H_EARTH);
    return;
  }
  if(enter&&room&&selected===room.dataset.roomId){
    event.preventDefault();
    event.stopImmediatePropagation();
    globalThis.location.assign(PERFECTED_H_EARTH);
  }
},true);
const receipt=Object.freeze({
  mounted:false,
  retired:true,
  authoritative:false,
  version:'gen1537-historical-artifact-retired-h-earth-experience-successor-23949-v5-gentle-coast',
  instrumentMounted:false,
  lowerCarouselPreserved:true,
  clusterGuidanceMounted:false,
  perfectedHEarthDirectBinding:true,
  perfectedHEarthTarget:PERFECTED_H_EARTH
});
Object.defineProperty(globalThis,'DGB_COMPASS_GEN1537_LIVE_RECOVERY',{
  configurable:true,
  enumerable:false,
  writable:false,
  value:Object.freeze({mounted:false,retired:true,authoritative:false,version:receipt.version,receipt:()=>receipt,stop:()=>{}})
});
})();
