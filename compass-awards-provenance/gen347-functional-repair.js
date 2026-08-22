(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],mod=(n,m)=>((n%m)+m)%m;
const root=q('[data-compass-root]'); if(!root)return;
const controller=()=>window.DGB_COMPASS_CONTROLLER||null;
const allUnique=()=>{const seen=new Set();return qa('[data-compass-room]').filter(el=>{const id=el.dataset.roomId||'';if(!id||seen.has(id))return false;seen.add(id);return true})};
const uniqueRooms=w=>allUnique().filter(el=>(el.dataset.wing||'')===w);
const roomById=id=>allUnique().find(r=>r.dataset.roomId===id)||null;
const label=()=>q('.ap-room-label');
let previewId='';
const currentWing=()=>roomById(previewId||label()?.dataset.roomId||'')?.dataset.wing||root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||'';
const paint=room=>{const el=label();if(!el||!room)return;previewId=room.dataset.roomId||'';el.dataset.roomId=previewId;el.innerHTML=`<small>${room.dataset.localCoordinate||'ESTATE ROOM'}</small><strong>${room.dataset.label||room.textContent.trim()}</strong><span>${room.dataset.localFunction||room.dataset.preview||''}</span>`;const state=q('.ap-cluster-state');if(state){const rooms=uniqueRooms(room.dataset.wing||'');const idx=rooms.findIndex(r=>r.dataset.roomId===previewId);q('.count',state)?.replaceChildren(`${String(idx+1).padStart(2,'0')} / ${String(rooms.length).padStart(2,'0')}`)}};
const move=d=>{const rooms=uniqueRooms(currentWing());if(!rooms.length)return;const id=previewId||label()?.dataset.roomId||'';let i=rooms.findIndex(r=>r.dataset.roomId===id);if(i<0)i=0;paint(rooms[mod(i+d,rooms.length)]);};
const openPreview=()=>{const id=previewId||label()?.dataset.roomId||'';if(id)controller()?.requestRoomSelection?.(id)};
const returnConstellation=()=>{previewId='';controller()?.requestReturnToConstellation?.()};

/* Earliest capture owns secondary controls. This prevents older clone-local handlers from resetting preview state after a click. */
window.addEventListener('click',e=>{
 const target=e.target.closest?.('[data-ap-room-prev],[data-ap-room-next],[data-ap-room-open],[data-ap-room-back],.ap-room-label');
 if(!target)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(target.matches('[data-ap-room-prev]'))return move(-1);
 if(target.matches('[data-ap-room-next]'))return move(1);
 if(target.matches('[data-ap-room-back]'))return returnConstellation();
 return openPreview();
},true);

new MutationObserver(()=>{
 const mode=root.dataset.compassMode||'';
 if(mode==='CONSTELLATION'){previewId='';return}
 if((mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED')&&!previewId){const rooms=uniqueRooms(currentWing());const wanted=root.dataset.selectedRoom||root.dataset.clusterPrimaryRoom||root.dataset.clusterPreviewPrimaryRoom||'';paint(rooms.find(r=>r.dataset.roomId===wanted)||rooms[0]);return}
 if(previewId){const room=roomById(previewId);if(room)queueMicrotask(()=>paint(room));}
}).observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-active-cluster-wing','data-selected-wing','data-selected-cardinal','data-selected-room','data-cluster-primary-room','data-cluster-preview-primary-room']});

/* Stable semantic direction rail drives the canonical controller while the spherical geometry remains visible and state-derived. */
const scene=q('[data-compass-scene]',root);
if(scene&&!q('.ap-direction-rail')){
 const rail=document.createElement('nav');rail.className='ap-direction-rail';rail.setAttribute('aria-label','Compass primary directions');
 for(const [id,letter,title] of [['north','N','Orientation'],['east','E','Worlds'],['south','S','Instruments'],['west','W','Frontier']]){const b=document.createElement('button');b.type='button';b.dataset.apCardinal=id;b.innerHTML=`<span>${letter}</span><strong>${title}</strong>`;b.addEventListener('click',e=>{e.preventDefault();previewId='';controller()?.requestCardinalSelection?.(id)});rail.appendChild(b)}
 scene.before(rail);
 const sync=()=>{const active=root.dataset.activeClusterWing||root.dataset.selectedWing||root.dataset.selectedCardinal||root.dataset.renderedForegroundCardinal||root.dataset.readableCardinal||root.dataset.orbitFocus||'north';qa('[data-ap-cardinal]',rail).forEach(b=>{const on=b.dataset.apCardinal===active;b.classList.toggle('is-active',on);b.setAttribute('aria-current',on?'true':'false')})};
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-active-cluster-wing','data-selected-wing','data-selected-cardinal','data-rendered-foreground-cardinal','data-readable-cardinal','data-orbit-focus']});sync();
}

document.documentElement.dataset.compassGen347SecondaryRepair='semantic-room-navigation-5';
})();