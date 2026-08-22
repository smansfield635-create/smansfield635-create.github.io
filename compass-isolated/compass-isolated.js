(()=>{
'use strict';
const app=document.querySelector('[data-compass-app]');
const stage=document.querySelector('[data-stage]');
const constellation=document.querySelector('[data-constellation]');
const cluster=document.querySelector('[data-cluster]');
const openFront=document.querySelector('[data-open-front]');
const returnBtn=document.querySelector('[data-return]');
const instructionKey=document.querySelector('[data-instruction-key]');
const instructionRest=document.querySelector('[data-instruction-rest]');
const panelKicker=document.querySelector('[data-panel-kicker]');
const panelTitle=document.querySelector('[data-panel-title]');
const panelBody=document.querySelector('[data-panel-body]');
const stateMode=document.querySelector('[data-state-mode]');
const stateFront=document.querySelector('[data-state-front]');
const stateAngle=document.querySelector('[data-state-angle]');
const checks=[...document.querySelectorAll('[data-check]')];

const CARDINALS=[
 {id:'north',label:'North',angle:0,body:'Boundary, authority, admissibility, and orientation.',rooms:[['north-gate','North Gate'],['laws','Laws Chamber'],['governance','Governance'],['evidence','Evidence']]},
 {id:'east',label:'East',angle:90,body:'Discovery, exploration, development, and outward movement.',rooms:[['showroom','Showroom'],['products','Products'],['developer','Developer'],['frontier','Frontier']]},
 {id:'south',label:'South',angle:180,body:'Embodiment, experience, environment, and lived continuity.',rooms:[['h-earth','H-Earth'],['mirrorland','Mirrorland'],['home','Home'],['door','Door']]},
 {id:'west',label:'West',angle:270,body:'Reflection, story, memory, and return.',rooms:[['prelude','Prelude'],['explore','Explore'],['about','About'],['upper-room','Upper Room']]}
];

let mode='CONSTELLATION';
let angle=0;
let front='north';
let activeWing=null;
let clusterAngle=0;
let selectedRoom='';
let dragging=false;
let pointerId=null;
let lastX=0;
let moved=0;

function norm(v){return ((v%360)+360)%360}
function signed(v){const n=norm(v);return n>180?n-360:n}
function nearestCardinal(){let best=CARDINALS[0],dist=999;for(const c of CARDINALS){const d=Math.abs(signed(c.angle-angle));if(d<dist){best=c;dist=d}}return best}
function mark(key){checks.find(el=>el.dataset.check===key)?.setAttribute('data-pass','true')}
function setInstruction(key,rest){instructionKey.textContent=key;instructionRest.textContent=rest;mark('instructions')}
function setPanel(kicker,title,body){panelKicker.textContent=kicker;panelTitle.textContent=title;panelBody.textContent=body}
function project(relativeDeg,radius=34){
 const rad=relativeDeg*Math.PI/180;
 const depth=Math.cos(rad);
 const x=50+Math.sin(rad)*radius;
 const y=50-depth*18;
 const scale=.72+(depth+1)*.18;
 const opacity=.32+(depth+1)*.34;
 return {x,y,depth,scale,opacity};
}
function applyProjection(el,p){
 el.style.left=p.x+'%';el.style.top=p.y+'%';el.style.setProperty('--star-scale',p.scale.toFixed(3));el.style.setProperty('--star-opacity',p.opacity.toFixed(3));el.style.zIndex=String(Math.round((p.depth+1)*20)+2);
}
function renderConstellation(){
 constellation.innerHTML='';selectedRoom='';
 const current=nearestCardinal();front=current.id;app.dataset.front=front;
 for(const c of CARDINALS){
   const rel=signed(c.angle-angle);const p=project(rel,34);
   const b=document.createElement('button');b.type='button';b.className='star';b.dataset.cardinal=c.id;b.dataset.primary=String(c.id===front);b.dataset.depth=p.depth.toFixed(3);applyProjection(b,p);b.setAttribute('aria-label',`${c.label}${c.id===front?' — in front':''}`);b.innerHTML=`<span class="star-label">${c.label}</span>`;
   b.addEventListener('click',()=>{if(moved>8)return;if(c.id===front)openCluster(c.id);else{angle=c.angle;renderAll();mark('tap')}});
   constellation.append(b);
 }
 setPanel('Direction in front',current.label,current.body);
 openFront.textContent=`Open ${current.label}`;openFront.hidden=false;returnBtn.hidden=true;
 setInstruction('DRAG TO ROTATE','Bring a cardinal star to the front. The highlighted label must change with the star in front; tap that star to open its rooms.');
 mark('cardinals');mark('labels');
}
function renderCluster(){
 cluster.innerHTML='';
 const wing=CARDINALS.find(c=>c.id===activeWing);if(!wing)return;
 let primaryRoom=wing.rooms[0];let primaryDist=999;
 wing.rooms.forEach((room,i)=>{const d=Math.abs(signed(i*90-clusterAngle));if(d<primaryDist){primaryDist=d;primaryRoom=room}});
 wing.rooms.forEach((room,i)=>{
   const rel=signed(i*90-clusterAngle);const p=project(rel,32);
   const b=document.createElement('button');b.type='button';b.className='star room-star';b.dataset.room=room[0];b.dataset.primary=String(room[0]===primaryRoom[0]);b.dataset.selected=String(room[0]===selectedRoom);applyProjection(b,p);b.setAttribute('aria-label',`${room[1]}${room[0]===primaryRoom[0]?' — in front':''}`);b.innerHTML=`<span class="star-label">${room[1]}</span>`;
   b.addEventListener('click',()=>{if(moved>8)return;if(room[0]!==primaryRoom[0]){clusterAngle=i*90;renderAll();mark('tap');return}selectedRoom=room[0];renderAll();setPanel('Room selected',room[1],`Selected from the ${wing.label} cluster. Navigation remains intentionally disabled on this isolated qualification stage.`);setInstruction('ROOM SELECTED','The Compass state is stable. Use Return to Orbit to restore the four-cardinal constellation.');mark('tap')});
   cluster.append(b);
 });
 if(!selectedRoom){setPanel(`${wing.label} cluster`,primaryRoom[1],`Room in front. Rotate the ${wing.label} cluster independently, then tap the highlighted room.`);setInstruction('DRAG THE ROOM CLUSTER','Bring a room to the front. Its highlighted label must change with the foreground room; tap it to select.');}
 openFront.hidden=true;returnBtn.hidden=false;
 mark('clusters');mark('labels');
}
function renderState(){stateMode.textContent=selectedRoom?'ROOM_SELECTED':mode;stateFront.textContent=selectedRoom||front;stateAngle.textContent=Math.round(mode==='CONSTELLATION'?angle:clusterAngle)+'°';app.dataset.mode=selectedRoom?'ROOM_SELECTED':mode}
function renderAll(){if(mode==='CONSTELLATION'){constellation.hidden=false;cluster.hidden=true;renderConstellation()}else{constellation.hidden=true;cluster.hidden=false;renderCluster()}renderState()}
function openCluster(id=front){activeWing=id;mode='CLUSTER_OPEN';clusterAngle=0;selectedRoom='';renderAll();mark('tap')}
function returnOrbit(){mode='CONSTELLATION';activeWing=null;selectedRoom='';renderAll();mark('return')}
function rotateBy(dx){selectedRoom='';if(mode==='CONSTELLATION'){angle=norm(angle+dx*.34)}else{clusterAngle=norm(clusterAngle+dx*.40)}renderAll();mark('drag')}
function settle(){if(mode==='CONSTELLATION'){const c=nearestCardinal();angle=c.angle}else{clusterAngle=norm(Math.round(clusterAngle/90)*90)}renderAll()}

stage.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;dragging=true;pointerId=e.pointerId;lastX=e.clientX;moved=0;stage.classList.add('is-dragging');stage.setPointerCapture?.(pointerId)});
stage.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==pointerId)return;const dx=e.clientX-lastX;lastX=e.clientX;moved+=Math.abs(dx);rotateBy(dx)});
function endPointer(e){if(!dragging||e.pointerId!==pointerId)return;dragging=false;stage.classList.remove('is-dragging');stage.releasePointerCapture?.(pointerId);settle();setTimeout(()=>{moved=0},0)}
stage.addEventListener('pointerup',endPointer);stage.addEventListener('pointercancel',endPointer);stage.addEventListener('lostpointercapture',()=>{dragging=false;stage.classList.remove('is-dragging')});
stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();rotateBy(e.key==='ArrowRight'?-90:90);settle()}else if(e.key==='Enter'||e.key===' '){if(mode==='CONSTELLATION'){e.preventDefault();openCluster(front)}}else if(e.key==='Escape'&&mode!=='CONSTELLATION'){e.preventDefault();returnOrbit()}});
openFront.addEventListener('click',()=>openCluster(front));returnBtn.addEventListener('click',returnOrbit);
renderAll();
})();