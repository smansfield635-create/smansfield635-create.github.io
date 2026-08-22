(()=>{
'use strict';
const PROD='https://diamondgatebridge.com';
const esc=value=>globalThis.CSS?.escape?CSS.escape(String(value)):String(value).replace(/["\\]/g,'\\$&');
function init(){
 const root=document.querySelector('[data-compass-root]');
 const scene=document.querySelector('[data-compass-scene]');
 const panel=document.querySelector('[data-compass-panel]');
 const enter=document.querySelector('[data-compass-enter]');
 const enterLabel=document.querySelector('[data-compass-enter-label]');
 const eyebrow=document.querySelector('[data-compass-panel-eyebrow]');
 const title=document.querySelector('[data-compass-panel-title]');
 const purpose=document.querySelector('[data-compass-panel-purpose]');
 const relationship=document.querySelector('[data-compass-panel-relationship]');
 if(!root||!scene)return;

 // Normalize clone declarations to the same semantic contract used by production.
 document.querySelectorAll('[data-compass-room]').forEach(room=>{
   room.setAttribute('data-compass-destination','');
   room.dataset.destinationType='petal';
   room.dataset.destinationId=room.dataset.roomId||'';
 });

 const label=document.createElement('div');
 label.className='compass-projected-room-label';
 label.hidden=true;
 label.setAttribute('aria-hidden','true');
 scene.append(label);

 const cardinal=()=>String(root.dataset.orbitPreviewFocus||root.dataset.orbitFocus||root.dataset.readableCardinal||'north').toLowerCase();
 const roomId=()=>String(root.dataset.clusterPreviewPrimaryRoom||root.dataset.clusterPrimaryRoom||root.dataset.selectedRoom||'');
 const roomDecl=id=>id?document.querySelector(`[data-compass-room][data-room-id="${esc(id)}"]`):null;

 function syncCardinal(){
   const id=cardinal();
   root.dataset.readableCardinal=id;
   root.dataset.renderedForegroundCardinal=id;
   document.querySelectorAll('[data-compass-cardinal]').forEach(el=>el.classList.toggle('is-readable-cardinal',el.dataset.cardinalId===id));
 }

 function syncRoomLabel(){
   const mode=String(root.dataset.compassMode||'');
   const id=roomId();
   if(!(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')||!id){label.hidden=true;return}
   const decl=roomDecl(id);
   if(!decl){label.hidden=true;return}
   const proxy=document.querySelector(`[data-compass-room-proxy][data-room-id="${esc(id)}"],[data-compass-room-proxy][data-room="${esc(id)}"]`);
   label.textContent=decl.dataset.label||decl.textContent.trim();
   label.dataset.roomId=id;
   if(!proxy){label.hidden=true;return}
   const a=scene.getBoundingClientRect(),b=proxy.getBoundingClientRect();
   label.style.left=`${b.left-a.left+b.width/2}px`;
   label.style.top=`${b.bottom-a.top+7}px`;
   label.hidden=false;
 }

 function syncPanel(){
   const mode=String(root.dataset.compassMode||'');
   if(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED'){
     const id=roomId();
     const decl=roomDecl(id);
     if(!decl)return;
     if(eyebrow)eyebrow.textContent=`${String(decl.dataset.wing||'').toUpperCase()} · ${mode==='ROOM_SELECTED'?'Selected room':'Room in front'}`;
     if(title)title.textContent=decl.dataset.label||decl.textContent.trim();
     if(purpose)purpose.textContent=decl.dataset.preview||decl.dataset.localFunction||'';
     if(relationship)relationship.textContent=decl.dataset.whyEnter||'Rotate the cluster to bring another room forward.';
     if(enter){const selected=String(root.dataset.selectedRoom||'');const enabled=mode==='ROOM_SELECTED'&&selected===id;enter.disabled=!enabled;enter.setAttribute('aria-disabled',String(!enabled));}
     if(enterLabel)enterLabel.textContent=mode==='ROOM_SELECTED'?'Enter Room':'Select Room';
   }
 }

 function sync(){syncCardinal();syncRoomLabel();syncPanel()}
 const observer=new MutationObserver(()=>queueMicrotask(sync));
 observer.observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-orbit-focus','data-orbit-preview-focus','data-cluster-primary-room','data-cluster-preview-primary-room','data-selected-room','data-selected-wing']});

 const animate=()=>{
   const mode=String(root.dataset.compassMode||'');
   if(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')syncRoomLabel();
   requestAnimationFrame(animate);
 };
 requestAnimationFrame(animate);

 enter?.addEventListener('click',event=>{
   const selected=String(root.dataset.selectedRoom||'');
   const decl=roomDecl(selected);
   const route=decl?.dataset.route;
   if(!selected||!route||!route.startsWith('/'))return;
   event.preventDefault();
   event.stopImmediatePropagation();
   location.href=PROD+route;
 },true);

 addEventListener('resize',syncRoomLabel,{passive:true});
 sync();
 globalThis.DGB_COMPASS_CLONE_BRIDGE=Object.freeze({version:'clone-stage1b',productionUntouched:true,roomCount:document.querySelectorAll('[data-compass-room]').length});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();