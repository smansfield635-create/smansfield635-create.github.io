(()=>{
'use strict';
const PROD='https://diamondgatebridge.com';
function init(){
 const root=document.querySelector('[data-compass-root]'),scene=document.querySelector('[data-compass-scene]'),enter=document.querySelector('[data-compass-enter]');
 if(!root||!scene)return;
 const label=document.createElement('div');
 label.className='compass-projected-room-label';label.hidden=true;label.setAttribute('aria-hidden','true');scene.append(label);
 function focusCardinal(){return String(root.dataset.orbitPreviewFocus||root.dataset.orbitFocus||root.dataset.readableCardinal||'north').toLowerCase()}
 function syncCardinal(){const f=focusCardinal();root.dataset.readableCardinal=f;root.dataset.renderedForegroundCardinal=f;document.querySelectorAll('[data-compass-cardinal]').forEach(el=>el.classList.toggle('is-readable-cardinal',el.dataset.cardinalId===f))}
 function currentRoom(){return String(root.dataset.clusterPreviewPrimaryRoom||root.dataset.clusterPrimaryRoom||root.dataset.selectedRoom||'')}
 function syncRoomLabel(){
  const mode=String(root.dataset.compassMode||'');const id=currentRoom();
  if(!(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')||!id){label.hidden=true;return}
  const decl=document.querySelector(`[data-compass-room][data-room-id="${CSS.escape(id)}"]`);if(!decl){label.hidden=true;return}
  const proxy=document.querySelector(`[data-compass-room-proxy][data-room-id="${CSS.escape(id)}"],[data-compass-room-proxy][data-room="${CSS.escape(id)}"]`);
  label.textContent=decl.dataset.label||decl.textContent.trim();label.dataset.roomId=id;
  if(proxy){const a=scene.getBoundingClientRect(),b=proxy.getBoundingClientRect();label.style.left=`${b.left-a.left+b.width/2}px`;label.style.top=`${b.bottom-a.top+7}px`;label.hidden=false}else{label.hidden=true}
 }
 function sync(){syncCardinal();syncRoomLabel()}
 new MutationObserver(()=>queueMicrotask(sync)).observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-orbit-focus','data-orbit-preview-focus','data-cluster-primary-room','data-cluster-preview-primary-room','data-selected-room']});
 const raf=()=>{if(root.dataset.compassMode==='CLUSTER_OPEN'||root.dataset.compassMode==='ROOM_SELECTED')syncRoomLabel();requestAnimationFrame(raf)};requestAnimationFrame(raf);
 enter?.addEventListener('click',e=>{
   const roomId=String(root.dataset.selectedRoom||'');if(!roomId)return;
   const decl=document.querySelector(`[data-compass-room][data-room-id="${CSS.escape(roomId)}"]`);const route=decl?.dataset.route;if(!route||!route.startsWith('/'))return;
   e.preventDefault();e.stopImmediatePropagation();location.href=PROD+route;
 },true);
 sync();
 globalThis.DGB_COMPASS_CLONE_BRIDGE=Object.freeze({version:'clone-stage1',productionUntouched:true});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();