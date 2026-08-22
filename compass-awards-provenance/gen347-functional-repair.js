(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],mod=(n,m)=>((n%m)+m)%m;
const root=q('[data-compass-root]'); if(!root)return;
const controller=()=>window.DGB_COMPASS_CONTROLLER||null;
const allUnique=()=>{const seen=new Set();return qa('[data-compass-room]').filter(el=>{const id=el.dataset.roomId||'';if(!id||seen.has(id))return false;seen.add(id);return true})};
const uniqueRooms=wing=>allUnique().filter(el=>(el.dataset.wing||'')===wing);
const label=()=>q('.ap-room-label');
const roomById=id=>allUnique().find(r=>r.dataset.roomId===id)||null;
const wingFromRoomId=id=>roomById(id)?.dataset.wing||'';
let previewId='';
const wing=()=>wingFromRoomId(previewId||label()?.dataset.roomId||'')||root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||'';
const currentIndex=rooms=>{const id=previewId||label()?.dataset.roomId||'';const i=rooms.findIndex(r=>r.dataset.roomId===id);return i<0?0:i};
const paint=room=>{const el=label();if(!el||!room)return;previewId=room.dataset.roomId||'';el.dataset.roomId=previewId;el.innerHTML=`<small>${room.dataset.localCoordinate||'ESTATE ROOM'}</small><strong>${room.dataset.label||room.textContent.trim()}</strong><span>${room.dataset.localFunction||room.dataset.preview||''}</span>`;const state=q('.ap-cluster-state');if(state){const rooms=uniqueRooms(room.dataset.wing||'');const idx=rooms.findIndex(r=>r.dataset.roomId===room.dataset.roomId);q('.count',state)?.replaceChildren(`${String(idx+1).padStart(2,'0')} / ${String(rooms.length).padStart(2,'0')}`)}};
const move=d=>{const currentWing=wing(),rooms=uniqueRooms(currentWing);if(!rooms.length)return;paint(rooms[mod(currentIndex(rooms)+d,rooms.length)]);};
/* Delegated capture owns the visible secondary-label controls regardless of deferred-script construction order. Preview is local/transient; Open commits through the canonical controller. */
document.addEventListener('click',e=>{
 const target=e.target.closest?.('[data-ap-room-prev],[data-ap-room-next],[data-ap-room-open],[data-ap-room-back]');if(!target)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(target.matches('[data-ap-room-prev]'))return move(-1);
 if(target.matches('[data-ap-room-next]'))return move(1);
 if(target.matches('[data-ap-room-open]')){const id=previewId||label()?.dataset.roomId||'';if(id)controller()?.requestRoomSelection?.(id);return}
 previewId='';controller()?.requestReturnToConstellation?.();
},true);
q('.ap-room-label')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const id=previewId||label()?.dataset.roomId||'';if(id)controller()?.requestRoomSelection?.(id)},true);
new MutationObserver(()=>{const mode=root.dataset.compassMode||'';if(mode==='CONSTELLATION'){previewId='';return}if(previewId&&(mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')){const room=roomById(previewId);if(room)queueMicrotask(()=>paint(room));}}).observe(root,{attributes:true});

/* Stable premium direction rail: the spherical stars remain visual/interactive, while the primary direction labels provide a deterministic accessible control surface. */
const scene=q('[data-compass-scene]',root);
if(scene&&!q('.ap-direction-rail')){
 const rail=document.createElement('nav');rail.className='ap-direction-rail';rail.setAttribute('aria-label','Compass primary directions');
 const defs=[['north','N','Orientation'],['east','E','Worlds'],['south','S','Instruments'],['west','W','Frontier']];
 for(const [id,letter,title] of defs){const b=document.createElement('button');b.type='button';b.dataset.apCardinal=id;b.innerHTML=`<span>${letter}</span><strong>${title}</strong>`;b.addEventListener('click',e=>{e.preventDefault();previewId='';controller()?.requestCardinalSelection?.(id)});rail.appendChild(b)}
 scene.before(rail);
 const sync=()=>{const active=root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||root.dataset.renderedForegroundCardinal||root.dataset.readableCardinal||root.dataset.orbitFocus||'north';qa('[data-ap-cardinal]',rail).forEach(b=>{const on=b.dataset.apCardinal===active;b.classList.toggle('is-active',on);b.setAttribute('aria-current',on?'true':'false')})};
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-active-cluster-wing','data-selected-wing','data-selected-cardinal','data-rendered-foreground-cardinal','data-readable-cardinal','data-orbit-focus']});sync();
}
document.documentElement.dataset.compassGen347SecondaryRepair='semantic-room-navigation-4';
})();