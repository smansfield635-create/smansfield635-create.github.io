(()=>{
'use strict';
const H_EARTH_CANONICAL='/showroom/globe/h-earth/';
const isHEarthExternal=(value)=>typeof value==='string'&&value.includes('raw.githack.com')&&value.includes('/showroom/globe/h-earth/');
const bindHEarth=()=>{
  document.querySelectorAll('[data-compass-room][data-label="H-Earth"]').forEach(el=>{
    if(el.dataset.route!==H_EARTH_CANONICAL) el.dataset.route=H_EARTH_CANONICAL;
    if(el.getAttribute('href')!==H_EARTH_CANONICAL) el.setAttribute('href',H_EARTH_CANONICAL);
  });
  document.querySelectorAll('a[href]').forEach(el=>{
    const href=el.getAttribute('href')||'';
    if(isHEarthExternal(href) && href!==H_EARTH_CANONICAL) el.setAttribute('href',H_EARTH_CANONICAL);
  });
};
const positionCapability=()=>{
  const cta=document.querySelector('.compass-build-cta');
  const capability=document.querySelector('[data-capability-orbit]')||document.querySelector('[data-compass-capability-switcher]');
  const cue=document.querySelector('.compass-capability-cue');
  if(!cta||!capability)return false;
  if(cue){
    cta.after(cue);
    cue.after(capability);
  }else{
    cta.after(capability);
  }
  return true;
};
const initialize=()=>{
  bindHEarth();
  if(!positionCapability()) requestAnimationFrame(positionCapability);
};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initialize,{once:true});
else initialize();
document.addEventListener('click',event=>{
  const target=event.target?.closest?.('a,[data-compass-enter]');
  if(!target)return;
  const href=target.getAttribute?.('href')||'';
  const root=target.closest?.('[data-compass-root]');
  const room=root?.querySelector?.('[data-compass-room][data-label="H-Earth"]');
  const selected=root?.dataset?.selectedRoom||root?.dataset?.clusterPreviewPrimaryRoom||root?.dataset?.clusterPrimaryRoom||'';
  const isEnter=target.matches?.('[data-compass-enter]')&&room&&selected===room.dataset.roomId;
  if(href===H_EARTH_CANONICAL||isHEarthExternal(href)||isEnter){
    event.preventDefault();
    event.stopImmediatePropagation();
    globalThis.location.assign(H_EARTH_CANONICAL);
  }
},true);
const receipt=Object.freeze({
  mounted:true,
  retired:false,
  authoritative:true,
  version:'gen1537-compass-stable-lower-capability-20260820-1738',
  externalProxyBypass:true,
  canonicalRoute:H_EARTH_CANONICAL,
  mutationObserverRemoved:true,
  capabilityPlacement:'AFTER_BUILD_CTA',
  repeatedReparenting:false
});
Object.defineProperty(globalThis,'DGB_COMPASS_GEN1537_LIVE_RECOVERY',{
  configurable:true,
  enumerable:false,
  writable:false,
  value:Object.freeze({mounted:true,retired:false,authoritative:true,version:receipt.version,receipt:()=>receipt,stop:()=>{}})
});
})();