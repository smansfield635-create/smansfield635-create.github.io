(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],mod=(n,m)=>((n%m)+m)%m;
const root=q('[data-compass-root]'); if(!root)return;
const controller=()=>window.DGB_COMPASS_CONTROLLER||null;
const uniqueRooms=wing=>{const seen=new Set();return qa(`[data-compass-room][data-wing="${wing}"]`).filter(el=>{const id=el.dataset.roomId||'';if(!id||seen.has(id))return false;seen.add(id);return true})};
const wing=()=>root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||'';
const label=()=>q('.ap-room-label');
const currentIndex=rooms=>{const id=label()?.dataset.roomId||'';const i=rooms.findIndex(r=>r.dataset.roomId===id);return i<0?0:i};
const paint=room=>{const el=label();if(!el||!room)return;el.dataset.roomId=room.dataset.roomId||'';el.innerHTML=`<small>${room.dataset.localCoordinate||'ESTATE ROOM'}</small><strong>${room.dataset.label||room.textContent.trim()}</strong><span>${room.dataset.localFunction||room.dataset.preview||''}</span>`};
const move=d=>{const rooms=uniqueRooms(wing());if(!rooms.length)return;paint(rooms[mod(currentIndex(rooms)+d,rooms.length)])};
const intercept=(selector,fn)=>{q(selector)?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();fn()},true)};
intercept('[data-ap-room-prev]',()=>move(-1));
intercept('[data-ap-room-next]',()=>move(1));
intercept('[data-ap-room-open]',()=>{const id=label()?.dataset.roomId||'';if(id)controller()?.requestRoomSelection?.(id)});
document.documentElement.dataset.compassGen347SecondaryRepair='semantic-room-navigation-1';
})();
