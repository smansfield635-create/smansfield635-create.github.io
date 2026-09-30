(()=>{
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const mod=(value,base)=>((value%base)+base)%base;
const TAU=Math.PI*2;
const STYLE_ID='compass-statement-orbit-restoration-style';
function bindMirrorlandNarrativeEntry(){
  const root=document.querySelector('[data-compass-root]');
  if(!root)return;
  const routes=document.querySelector('[data-compass-mirrorland-routes]');
  const narrative=routes?.querySelector('a:not([data-compass-mirrorland-inline-back])');
  if(narrative){narrative.href='/characters/';narrative.textContent='Enter the Narrative';narrative.dataset.mirrorlandRouteRole='NARRATIVE_ENTRY';}
  const threshold=root.querySelector('[data-compass-object="mirrorland"]');
  if(threshold){threshold.dataset.route='/characters/';threshold.setAttribute('data-panel-body','Enter through the door to begin Mirrorland at Gratitude Coast, or choose another connected world experience.');threshold.setAttribute('data-panel-why','The door opens Mirrorland. The narrative begins at Gratitude Coast; Demo and World remain complementary routes.');}
  root.dataset.mirrorlandNarrativeAuthority='CHARACTERS_COAST';
  globalThis.DGB_MIRRORLAND_ENTRY_REBIND=Object.freeze({mounted:true,contract:'MIRRORLAND_NARRATIVE_ENTRY_REBIND_v1',narrative:'/characters/',showroom:'/showroom/',hEarth:'/showroom/globe/h-earth/',audralia:'/showroom/globe/audralia/'});
}
function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.compass-statement-orbit{position:relative;max-width:760px;min-height:7rem;margin:1rem auto .9rem;display:grid;grid-template-rows:minmax(4.8rem,auto) auto;row-gap:.35rem;place-items:center;isolation:isolate;outline:0}
.compass-statement-object{grid-area:1/1;position:relative;width:min(92%,720px);margin:0!important;padding:.25rem .5rem!important;border:0!important;background:none!important;box-shadow:none!important;color:rgba(249,244,226,.96);font-family:var(--font-display,Georgia,serif);font-size:clamp(1.02rem,2.25vw,1.32rem);font-style:italic;line-height:1.48;text-align:center;text-shadow:0 0 18px rgba(244,214,128,.10);transition:opacity .22s ease}
.compass-statement-object[data-slot="front"]{z-index:2;opacity:1;pointer-events:auto}
.compass-statement-object[data-slot="rear"]{z-index:1;opacity:0;pointer-events:none}
.compass-statement-object.is-arriving{animation:compassThoughtArrival .38s ease-out 1}
.compass-statement-guidance{grid-area:2/1;margin:0;color:rgba(185,218,226,.72);font:760 clamp(.68rem,1.5vw,.76rem)/1.35 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.065em;text-align:center;text-transform:uppercase;text-shadow:0 0 9px rgba(102,205,224,.24)}
.compass-statement-sparkles{position:absolute;inset:-22% -10%;pointer-events:none;overflow:visible}
.compass-statement-sparkles i{position:absolute;left:var(--sx);top:var(--sy);width:3px;height:3px;border-radius:50%;background:rgba(255,239,181,.96);box-shadow:0 0 7px rgba(244,214,128,.95),0 0 13px rgba(102,205,224,.55);animation:compassStatementSparkle .56s ease-out var(--delay) both}
@keyframes compassThoughtArrival{0%{opacity:.28;text-shadow:0 0 0 transparent}45%{opacity:1;text-shadow:0 0 24px rgba(244,214,128,.42),0 0 34px rgba(102,205,224,.18)}100%{opacity:1;text-shadow:0 0 18px rgba(244,214,128,.10)}}
@keyframes compassStatementSparkle{0%{opacity:0;transform:scale(.4)}38%{opacity:1;transform:scale(1.6)}100%{opacity:0;transform:scale(.2)}}
@media(prefers-reduced-motion:reduce){.compass-statement-object{transition:none}.compass-statement-sparkles{display:none}}
`;
  document.head.append(style);
}
function claimSwipe(stage,onResolve){
  let active=false,captured=false,startX=0,startY=0,pointerId=null;
  stage.style.touchAction='pan-y';
  stage.addEventListener('pointerdown',event=>{
    if(event.button>0||event.target.closest('a,button,input,select,textarea,[role="button"]'))return;
    active=true;captured=false;pointerId=event.pointerId;startX=event.clientX;startY=event.clientY;
  });
  stage.addEventListener('pointermove',event=>{
    if(!active||captured||event.pointerId!==pointerId)return;
    const dx=event.clientX-startX,dy=event.clientY-startY;
    if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.25)return;
    captured=true;stage.setPointerCapture?.(pointerId);
  });
  stage.addEventListener('pointerup',event=>{
    if(!active||event.pointerId!==pointerId)return;
    const dx=event.clientX-startX,dy=event.clientY-startY,width=Math.max(1,stage.getBoundingClientRect().width);
    active=false;
    if(captured&&stage.hasPointerCapture?.(pointerId))stage.releasePointerCapture?.(pointerId);
    captured=false;
    if(Math.abs(dx)<36&&Math.abs(dx)<width*.08)return;
    if(Math.abs(dx)<Math.abs(dy)*1.25)return;
    event.preventDefault();onResolve(dx<0?1:-1);
  });
  stage.addEventListener('pointercancel',event=>{active=false;if(captured&&stage.hasPointerCapture?.(event.pointerId))stage.releasePointerCapture?.(event.pointerId);captured=false});
}
function sparkle(sentence){
  sentence.closest('[data-statement-orbit]')?.querySelectorAll('.compass-statement-sparkles').forEach(field=>field.remove());
  sentence.classList.remove('is-arriving');void sentence.offsetWidth;sentence.classList.add('is-arriving');
  if(reduce.matches){setTimeout(()=>sentence.classList.remove('is-arriving'),260);return}
  const field=document.createElement('span');field.className='compass-statement-sparkles';field.setAttribute('aria-hidden','true');
  for(let index=0;index<10;index+=1){const star=document.createElement('i'),angle=(index/10)*TAU+(index%2)*.23,radius=38+(index%4)*11;star.style.setProperty('--sx',`${50+Math.cos(angle)*radius}%`);star.style.setProperty('--sy',`${50+Math.sin(angle)*radius*.42}%`);star.style.setProperty('--delay',`${index*26}ms`);field.append(star)}
  sentence.append(field);setTimeout(()=>{field.remove();sentence.classList.remove('is-arriving')},680);
}
function mount(){
  bindMirrorlandNarrativeEntry();
  ensureStyle();
  const header=document.querySelector('.compass-estate__header');
  if(!header||header.querySelector('[data-statement-orbit]'))return;
  const opening=header.querySelector('.compass-estate__sentence'),reflection=header.querySelector('.compass-estate__epigraph');
  if(!opening||!reflection)return;
  const stage=document.createElement('div');stage.className='compass-statement-orbit';stage.dataset.statementOrbit='true';stage.setAttribute('role','region');stage.setAttribute('aria-roledescription','carousel');stage.setAttribute('aria-label','Opening statements');stage.setAttribute('aria-describedby','compass-statement-guidance');stage.tabIndex=0;
  const guidance=document.createElement('p');guidance.id='compass-statement-guidance';guidance.className='compass-statement-guidance';guidance.textContent='Not everything is as it first appears. Swipe the thought above.';
  const status=document.createElement('p');status.className='compass-orbit-status';status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
  const items=[opening,reflection];let activeIndex=0,busy=false;
  items.forEach((element,index)=>{element.classList.add('compass-statement-object');element.setAttribute('aria-posinset',String(index+1));element.setAttribute('aria-setsize',String(items.length));element.dataset.slot=index===0?'front':'rear';stage.append(element)});
  stage.append(guidance,status);header.append(stage);
  function render(arrival=false){items.forEach((element,index)=>{const front=index===activeIndex;element.dataset.slot=front?'front':'rear';element.setAttribute('aria-current',front?'true':'false');element.setAttribute('aria-hidden',front?'false':'true');element.inert=!front});status.textContent=`Statement ${activeIndex+1} of ${items.length}: ${items[activeIndex].textContent.trim()}`;if(arrival)sparkle(items[activeIndex])}
  function rotate(direction){if(busy)return;busy=true;activeIndex=mod(activeIndex+direction,items.length);render(false);setTimeout(()=>{sparkle(items[activeIndex]);busy=false},reduce.matches?110:440)}
  claimSwipe(stage,rotate);
  stage.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();rotate(event.key==='ArrowRight'?1:-1)}});
  render(true);
  document.dispatchEvent(new CustomEvent('compass:statement-orbit-restored',{detail:{count:items.length}}));
}
const api=Object.freeze({version:'statement-orbit-restoration-v1',mount});
Object.defineProperty(globalThis,'CompassStatementOrbit',{configurable:false,enumerable:true,get:()=>api,set:()=>{}});
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();
