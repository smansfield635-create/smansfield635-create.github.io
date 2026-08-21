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
function polar(radius,deg){const r=(deg-90)*Math.PI/180;return {x:50+Math.cos(r)*radius,y:50+Math.sin(r)*radius}}
function renderConstellation(){
 constellation.innerHTML='';
 const current=nearestCardinal();front=current.id;app.dataset.front=front;
 for(const c of CARDINALS){
   const p=polar(34,c.angle-angle);
   const b=document.createElement('button');b.type='button';b.className='star';b.dataset.cardinal=c.id;b.dataset.primary=String(c.id===front);b.style.left=p.x+'%';b.style.top=p.y+'%';b.setAttribute('aria-label',`${c.label}${c.id===front?' — in front':''}`);b.innerHTML=`<span class="star-label">${c.label}</span>`;
   b.addEventListener('click',()=>{if(moved>8)return;if(c.id===front)openCluster(c.id);else{angle=c.angle;renderAll();mark('tap')}});
   constellation.append(b);
 }
 setPanel('Direction in front',current.label,current.body);
 openFront.textContent=`Open ${current.label}`;openFront.hidden=false;returnBtn.hidden=true;
 setInstruction('Drag to rotate.','Bring a cardinal star to the front, then tap it to open its rooms.');
 mark('cardinals');mark('labels');
}
function renderCluster(){
 cluster.innerHTML='';
 const wing=CARDINALS.find(c=>c.id===activeWing);if(!wing)return;
 wing.rooms.forEach((room,i)=>{
   const base=i*90;const p=polar(33,base-clusterAngle);
   const b=document.createElement('button');b.type='button';b.className='star room-star';b.dataset.room=room[0];b.dataset.primary=String(Math.abs(signed(base-clusterAngle))<45);b.style.left=p.x+'%';b.style.top=p.y+'%';b.setAttribute('aria-label',room[1]);b.innerHTML=`<span class="star-label">${room[1]}</span>`;
   b.addEventListener('click',()=>{if(moved>8)return;setPanel('Room selected',room[1],`Selected from the ${wing.label} cluster. Navigation is intentionally disabled on this isolated qualification stage.`);setInstruction('Room selected.','Use Return to Orbit to reopen the four-cardinal constellation.');mark('tap')});
   cluster.append(b);
 });
 setPanel(`${wing.label} cluster`,wing.label,`Rotate this room cluster independently. This proves cluster state without attaching estate navigation.`);
 setInstruction('Drag the room cluster.','Tap a room star to select it. Return to Orbit restores the four-cardinal constellation.');
 mark('clusters');
}
function renderState(){stateMode.textContent=mode;stateFront.textContent=front;stateAngle.textContent=Math.round(mode==='CONSTELLATION'?angle:clusterAngle)+'°';app.dataset.mode=mode}
function renderAll(){if(mode==='CONSTELLATION'){constellation.hidden=false;cluster.hidden=true;renderConstellation()}else{constellation.hidden=true;cluster.hidden=false;renderCluster()}renderState()}
function openCluster(id=front){activeWing=id;mode='CLUSTER_OPEN';clusterAngle=0;openFront.hidden=true;returnBtn.hidden=false;renderAll();mark('tap')}
function returnOrbit(){mode='CONSTELLATION';activeWing=null;renderAll();mark('return')}
function rotateBy(dx){if(mode==='CONSTELLATION'){angle=norm(angle+dx*.38)}else{clusterAngle=norm(clusterAngle+dx*.45)}renderAll();mark('drag')}
function settle(){if(mode==='CONSTELLATION'){const c=nearestCardinal();angle=c.angle}else{clusterAngle=Math.round(clusterAngle/90)*90}renderAll()}

stage.addEventListener('pointerdown',e=>{dragging=true;pointerId=e.pointerId;lastX=e.clientX;moved=0;stage.setPointerCapture?.(pointerId)});
stage.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==pointerId)return;const dx=e.clientX-lastX;lastX=e.clientX;moved+=Math.abs(dx);rotateBy(dx)});
function endPointer(e){if(!dragging||e.pointerId!==pointerId)return;dragging=false;stage.releasePointerCapture?.(pointerId);settle();setTimeout(()=>{moved=0},0)}
stage.addEventListener('pointerup',endPointer);stage.addEventListener('pointercancel',endPointer);
stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();rotateBy(e.key==='ArrowRight'?-28:28);settle()}else if(e.key==='Enter'||e.key===' '){if(mode==='CONSTELLATION'){e.preventDefault();openCluster(front)}}else if(e.key==='Escape'&&mode!=='CONSTELLATION'){e.preventDefault();returnOrbit()}});
openFront.addEventListener('click',()=>openCluster(front));returnBtn.addEventListener('click',returnOrbit);
renderAll();
})();