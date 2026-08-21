(()=>{
'use strict';
const SOURCE='744961bd34be67a58037f685f2eda618dff58b10';
const BASE=`https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/${SOURCE}/assets/compass`;
const mod=(v,n)=>((v%n)+n)%n;
function load(src,key){return new Promise(resolve=>{if(globalThis[key])return resolve(globalThis[key]);const s=document.createElement('script');s.src=src;s.defer=true;s.onload=()=>resolve(globalThis[key]);s.onerror=()=>resolve(null);document.head.append(s)})}
const LEGACY=['[data-capability-orbit]','.compass-capability-orbit','.compass-capability-cue','.compass-monuments','.compass-built','[data-functional-lower-carousels]:not(.dgb-lower-stack)'];
function purgeLegacy(){LEGACY.forEach(sel=>document.querySelectorAll(sel).forEach(node=>node.remove()))}
function suppressLegacy(root){purgeLegacy();new MutationObserver(()=>purgeLegacy()).observe(root,{childList:true,subtree:true})}
function makeOrbit({id,eyebrow,title,note,items,kind}){
 const section=document.createElement('section');section.className=`dgb-orbit dgb-orbit--${kind}`;section.dataset.dgbOrbit=id;
 section.innerHTML=`<header class="dgb-orbit__head"><div><p class="dgb-orbit__kicker">${eyebrow}</p><h2>${title}</h2></div><div class="dgb-orbit__live" data-live></div></header><div class="dgb-orbit__tabs" role="tablist" data-tabs></div><div class="dgb-orbit__viewport" data-viewport tabindex="0" aria-label="${title}. Swipe horizontally or use the tabs."><div class="dgb-orbit__ring" data-ring></div></div><p class="dgb-orbit__note">${note}</p>`;
 const tabs=section.querySelector('[data-tabs]'),viewport=section.querySelector('[data-viewport]'),ring=section.querySelector('[data-ring]'),live=section.querySelector('[data-live]');
 const count=items.length,step=360/count,cards=[];let index=0,startX=0,startIndex=0,startAngle=0,drag=false,pid=null,travel=0;
 items.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.role='tab';b.className='dgb-orbit__tab';b.dataset.index=i;b.textContent=item.label;tabs.append(b);const c=document.createElement('article');c.className='dgb-orbit__card';c.dataset.id=item.id;c.innerHTML=item.markup;ring.append(c);cards.push(c);b.onclick=()=>select(i)});
 function radius(){const w=Math.max(320,viewport.clientWidth||section.clientWidth||900);if(kind==='objects')return w<520?220:w<820?330:480;return w<520?235:w<820?340:470}
 function render(reason='render'){const r=radius(),angle=-index*step;ring.style.setProperty('--orbit-rotation',`${angle}deg`);cards.forEach((c,i)=>{c.style.transform=`rotateY(${i*step}deg) translateZ(${r}px)`;const on=i===index;c.dataset.active=String(on);c.setAttribute('aria-hidden',String(!on));c.tabIndex=on?0:-1});[...tabs.children].forEach((b,i)=>{const on=i===index;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});live.textContent=`${items[index].label} · ${index+1} of ${count}`;section.dispatchEvent(new CustomEvent('dgb:orbit-change',{detail:{id,index,reason,item:items[index].id}}))}
 function select(i,reason='select'){if(drag)return;index=mod(i,count);render(reason)}
 tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home')select(0,'keyboard');else if(e.key==='End')select(count-1,'keyboard');else select(index+(e.key==='ArrowRight'?1:-1),'keyboard')});
 viewport.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||e.target.closest('a,button'))return;drag=true;pid=e.pointerId;startX=e.clientX;startIndex=index;startAngle=-index*step;travel=0;viewport.dataset.dragging='true';viewport.setPointerCapture?.(pid)});
 viewport.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==pid)return;const dx=e.clientX-startX;travel=Math.max(travel,Math.abs(dx));ring.style.setProperty('--orbit-rotation',`${startAngle+(dx/Math.max(320,viewport.clientWidth))*185}deg`)});
 function finish(e){if(!drag||e.pointerId!==pid)return;const dx=e.clientX-startX;drag=false;viewport.dataset.dragging='false';viewport.releasePointerCapture?.(pid);pid=null;if(travel>Math.max(24,viewport.clientWidth*.05))index=mod(startIndex+(dx<0?1:-1),count);else index=startIndex;render('drag')}
 viewport.addEventListener('pointerup',finish);viewport.addEventListener('pointercancel',finish);section.addEventListener('keydown',e=>{if(e.target.closest('[role=tablist]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1),'stage-keyboard')}});addEventListener('resize',()=>render('resize'),{passive:true});render('init');return{section,cards,get index(){return index}};
}
function objectMarkup(kind,kicker,title,body,actions){return `<div class="dgb-object"><div class="dgb-object__visual" data-object-visual="${kind}"><canvas role="img" aria-label="${title}"></canvas></div><div class="dgb-object__copy"><p class="dgb-orbit__kicker">${kicker}</p><h3>${title}</h3><p>${body}</p><div class="dgb-object__actions">${actions.map(([label,href])=>`<a class="dgb-orbit__action" href="${href}">${label}</a>`).join('')}</div></div></div>`}
function readinessMarkup({type,title,subtitle,body,bullets,action,href}){return `<div class="dgb-readiness"><div class="dgb-readiness__mark">${type}</div><div class="dgb-readiness__copy"><p class="dgb-orbit__kicker">${subtitle}</p><h3>${title}</h3><p>${body}</p>${bullets?.length?`<ul>${bullets.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}<a class="dgb-orbit__action" href="${href}">${action}</a></div></div>`}
async function mount(){
 const root=document.querySelector('[data-compass-root]');if(!root)return;suppressLegacy(root);
 const build=document.querySelector('.compass-build-cta');const host=document.createElement('section');host.className='dgb-lower-stack';host.dataset.functionalLowerCarousels='object-spread-v3';
 const objects=[
  {id:'trophy',label:'Trophy',markup:objectMarkup('trophy','Awards & Recognition','The Trophy','One body of work. Five reasons to look closer.',[['Explore Awards','/showroom/globe/h-earth/awards/']])},
  {id:'house',label:'House',markup:objectMarkup('house','Ask for directions','The House','Choose who to speak with.',[['Jeeves','/showroom/globe/hearth/jeeves/'],['Elara','/elara/'],['Auren','/products/auren/']])},
  {id:'brain',label:'Brain',markup:objectMarkup('brain','Assessment','Coheriscope','Compare how you live and decide with what matters to you.',[['Enter Coheriscope','/coherence-diagnostic/']])}
 ];
 const objectOrbit=makeOrbit({id:'objects',kind:'objects',eyebrow:'Three ways to engage',title:'Choose an object.',note:'Swipe to rotate. The clear object is the active destination.',items:objects});
 const readiness=[
  {id:'trl',label:'TRL',markup:readinessMarkup({type:'7',subtitle:'Technology Readiness Level',title:'Software TRL 7',body:'A bounded maturity disposition for the governed software-construction platform against published NASA software TRL criteria.',bullets:['Self-assessed','Criterion-by-criterion','TRL 8 not claimed'],action:'Inspect TRL 7',href:'/evidence/readiness/'})},
  {id:'tra',label:'TRA',markup:readinessMarkup({type:'TRA',subtitle:'Technology Readiness Assessment',title:'Inspect the assessment.',body:'The assessment checks whether each readiness claim is matched to the evidence class, identity, and boundary that actually supports it.',bullets:['Criterion → capability','Capability → evidence class','Evidence → identity + boundary'],action:'Inspect TRA',href:'/evidence/readiness/validation/'})}
 ];
 const readinessOrbit=makeOrbit({id:'readiness',kind:'readiness',eyebrow:'Readiness',title:'TRL and TRA.',note:'TRL states the bounded readiness level. TRA inspects the assessment supporting that level.',items:readiness});
 host.append(objectOrbit.section,readinessOrbit.section);if(build)build.before(host);else root.append(host);
 const [Brain,Trophy,House]=await Promise.all([load(`${BASE}/compass.brain-scene.js`,'CompassBrainScene'),load(`${BASE}/compass.trophy-scene.js`,'CompassTrophyScene'),load(`${BASE}/compass.house-scene.js`,'CompassHouseScene')]);const cards=objectOrbit.cards;
 Trophy?.mount?.(cards[0].querySelector('canvas'),{foreground:()=>cards[0].dataset.active==='true'});House?.mount?.(cards[1].querySelector('canvas'),{foreground:()=>cards[1].dataset.active==='true'});Brain?.mount?.(cards[2].querySelector('canvas'),{foreground:()=>cards[2].dataset.active==='true'});
 objectOrbit.section.addEventListener('dgb:orbit-change',()=>{House?.setForeground?.(cards[1].dataset.active==='true');if(cards[0].dataset.active==='true')Trophy?.activate?.()});
 root.dataset.functionalLowerCarousels='OBJECT_SPREAD_PLUS_TRL_TRA';globalThis.DGB_COMPASS_FUNCTIONAL_CAROUSELS=Object.freeze({version:'object-spread-plus-readiness-v3',legacySuppressed:true,orbitRoots:2,objects:['trophy','house','brain'],readiness:['trl','tra'],compassStateOwnership:false});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();