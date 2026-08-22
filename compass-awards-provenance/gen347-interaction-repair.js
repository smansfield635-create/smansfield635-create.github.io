(()=>{
'use strict';
const root=document.querySelector('[data-compass-root]');
const controller=()=>window.DGB_COMPASS_CONTROLLER||null;
if(!root)return;
const declarations=[...document.querySelectorAll('[data-compass-room]')];
const unique=[...new Map(declarations.map(el=>[el.dataset.roomId,el])).values()].filter(el=>el.dataset.roomId);
const byWing=new Map();
for(const el of unique){const wing=el.dataset.wing||'';if(!byWing.has(wing))byWing.set(wing,[]);byWing.get(wing).push(el)}
const label=document.querySelector('.ap-room-label');
const nav=document.querySelector('.ap-room-nav');
if(!label||!nav)return;
let previewId='';
const roomFor=id=>unique.find(r=>r.dataset.roomId===id)||null;
const currentWing=()=>{
 const fromPreview=roomFor(previewId||label.dataset.roomId||'')?.dataset.wing;
 return fromPreview||root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||'';
};
const paint=id=>{
 const room=roomFor(id);if(!room)return false;
 previewId=id;
 label.dataset.roomId=id;
 label.innerHTML=`<small>${room.dataset.localCoordinate||'ESTATE ROOM'}</small><strong>${room.dataset.label||room.textContent.trim()}</strong><span>${room.dataset.localFunction||room.dataset.preview||''}</span>`;
 const rooms=byWing.get(room.dataset.wing)||[];
 const idx=rooms.findIndex(r=>r.dataset.roomId===id);
 const state=document.querySelector('.ap-cluster-state');
 if(state&&idx>=0){const count=state.querySelector('.count');if(count)count.textContent=`${String(idx+1).padStart(2,'0')} / ${String(rooms.length).padStart(2,'0')}`}
 return true;
};
const advance=delta=>{
 const wing=currentWing(),rooms=byWing.get(wing)||[];
 if(!rooms.length)return;
 let idx=rooms.findIndex(r=>r.dataset.roomId===(previewId||label.dataset.roomId));
 if(idx<0)idx=0;
 idx=(idx+delta+rooms.length)%rooms.length;
 paint(rooms[idx].dataset.roomId);
};
const on=(selector,fn)=>{const el=document.querySelector(selector);if(!el)return;el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();fn()},true)};
on('[data-ap-room-prev]',()=>advance(-1));
on('[data-ap-room-next]',()=>advance(1));
on('[data-ap-room-open]',()=>{const id=previewId||label.dataset.roomId;if(id)controller()?.requestRoomSelection?.(id)});
on('[data-ap-room-back]',()=>controller()?.requestReturnToConstellation?.());
label.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const id=previewId||label.dataset.roomId;if(id)controller()?.requestRoomSelection?.(id)},true);
new MutationObserver(()=>{
 const mode=root.dataset.compassMode||'';
 if(mode==='CONSTELLATION'){previewId='';return}
 if((mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')&&!previewId){
  const id=root.dataset.selectedRoom||root.dataset.clusterPrimaryRoom||root.dataset.clusterPreviewPrimaryRoom||label.dataset.roomId;
  if(id)paint(id);
 }
}).observe(root,{attributes:true});
document.documentElement.dataset.gen347InteractionRepair='semantic-room-v1';
})();