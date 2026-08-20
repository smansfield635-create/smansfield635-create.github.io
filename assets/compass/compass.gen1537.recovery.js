(()=>{
'use strict';
const H_EARTH_CANONICAL='/showroom/globe/h-earth/';
const isHEarthExternal=(value)=>typeof value==='string'&&value.includes('raw.githack.com')&&value.includes('/showroom/globe/h-earth/');
const bindHEarth=()=>{
  document.querySelectorAll('[data-compass-room][data-label="H-Earth"]').forEach(el=>{
    el.dataset.route=H_EARTH_CANONICAL;
    el.setAttribute('href',H_EARTH_CANONICAL);
  });
  document.querySelectorAll('a[href]').forEach(el=>{
    const href=el.getAttribute('href')||'';
    if(href==='/showroom/globe/h-earth/'||isHEarthExternal(href)) el.setAttribute('href',H_EARTH_CANONICAL);
  });
};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bindHEarth,{once:true});
else bindHEarth();
new MutationObserver(bindHEarth).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href','data-route']});
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
  version:'gen1537-h-earth-canonical-direct-route-20260820-1654',
  externalProxyBypass:true,
  canonicalRoute:H_EARTH_CANONICAL
});
Object.defineProperty(globalThis,'DGB_COMPASS_GEN1537_LIVE_RECOVERY',{
  configurable:true,
  enumerable:false,
  writable:false,
  value:Object.freeze({mounted:true,retired:false,authoritative:true,version:receipt.version,receipt:()=>receipt,stop:()=>{}})
});
})();