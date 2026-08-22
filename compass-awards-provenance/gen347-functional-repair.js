(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],mod=(n,m)=>((n%m)+m)%m;
const root=q('[data-compass-root]'); if(!root)return;
const controller=()=>window.DGB_COMPASS_CONTROLLER||null;
const allUnique=()=>{const seen=new Set();return qa('[data-compass-room]').filter(el=>{const id=el.dataset.roomId||'';if(!id||seen.has(id))return false;seen.add(id);return true})};
const uniqueRooms=wing=>allUnique().filter(el=>(el.dataset.wing||'')===wing);
const label=()=>q('.ap-room-label');
const wingFromRoomId=id=>allUnique().find(r=>r.dataset.roomId===id)?.dataset.wing||'';
const wing=()=>wingFromRoomId(label()?.dataset.roomId||'')||root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||'';
const currentIndex=rooms=>{const id=label()?.dataset.roomId||'';const i=rooms.findIndex(r=>r.dataset.roomId===id);return i<0?0:i};
const paint=room=>{const el=label();if(!el||!room)return;el.dataset.roomId=room.dataset.roomId||'';el.innerHTML=`<small>${room.dataset.localCoordinate||'ESTATE ROOM'}</small><strong>${room.dataset.label||room.textContent.trim()}</strong><span>${room.dataset.localFunction||room.dataset.preview||''}</span>`;const state=q('.ap-cluster-state');if(state){const rooms=uniqueRooms(room.dataset.wing||'');const idx=rooms.findIndex(r=>r.dataset.roomId===room.dataset.roomId);q('.count',state)?.replaceChildren(`${String(idx+1).padStart(2,'0')} / ${String(rooms.length).padStart(2,'0')}`)}};
const move=d=>{const rooms=uniqueRooms(wing());if(!rooms.length)return;paint(rooms[mod(currentIndex(rooms)+d,rooms.length)])};
const intercept=(selector,fn)=>{q(selector)?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();fn()},true)};
intercept('[data-ap-room-prev]',()=>move(-1));
intercept('[data-ap-room-next]',()=>move(1));
intercept('[data-ap-room-open]',()=>{const id=label()?.dataset.roomId||'';if(id)controller()?.requestRoomSelection?.(id)});
intercept('[data-ap-room-back]',()=>controller()?.requestReturnToConstellation?.());

/* Stable premium direction rail: the spherical stars remain visual/interactive, while the primary direction labels provide a deterministic accessible control surface. */
const scene=q('[data-compass-scene]',root);
if(scene&&!q('.ap-direction-rail')){
 const rail=document.createElement('nav');rail.className='ap-direction-rail';rail.setAttribute('aria-label','Compass primary directions');
 const defs=[['north','N','Orientation'],['east','E','Worlds'],['south','S','Instruments'],['west','W','Frontier']];
 for(const [id,letter,title] of defs){const b=document.createElement('button');b.type='button';b.dataset.apCardinal=id;b.innerHTML=`<span>${letter}</span><strong>${title}</strong>`;b.addEventListener('click',e=>{e.preventDefault();controller()?.requestCardinalSelection?.(id)});rail.appendChild(b)}
 scene.before(rail);
 const sync=()=>{const active=root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||root.dataset.renderedForegroundCardinal||root.dataset.readableCardinal||root.dataset.orbitFocus||'north';qa('[data-ap-cardinal]',rail).forEach(b=>{const on=b.dataset.apCardinal===active;b.classList.toggle('is-active',on);b.setAttribute('aria-current',on?'true':'false')})};
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-active-cluster-wing','data-selected-wing','data-selected-cardinal','data-rendered-foreground-cardinal','data-readable-cardinal','data-orbit-focus']});sync();
}
document.documentElement.dataset.compassGen347SecondaryRepair='semantic-room-navigation-2';
})();