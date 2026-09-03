(()=>{
'use strict';
const STATE={ARMED:'ARMED',PLAYING:'PLAYING',SETTLED:'SETTLED'};
const MASTER_DURATION=28000;
const BOUNDARIES=[0,3250,6500,9250,10350,11950,13550,14500,18750,22250,25500,28000];
const BEATS=[
  {key:'identity',label:'Diamond Gate Bridge',selector:'.compass-estate__header',at:0},
  {key:'compass',label:'The Compass',selector:'[data-compass-scene]',at:3250},
  {key:'chapter-one',label:'Chapter One',selector:'[data-compass-static-introduction]',at:6500,prepare:'chapter'},
  {key:'research',label:'Research',selector:'[data-readiness-family="research"]',at:9250,prepare:'research'},
  {key:'trl',label:'TRL',selector:'[data-readiness-family="trl"]',at:10350,prepare:'trl'},
  {key:'tra',label:'TRA',selector:'[data-readiness-family="tra"]',at:11950,prepare:'tra'},
  {key:'community',label:'Community',selector:'[data-readiness-family="community"]',at:13550,prepare:'community'},
  {key:'engage',label:'Three ways to engage',selector:'[data-capability-orbit]',at:14500},
  {key:'mirrorland',label:'Mirrorland',selector:'[data-compass-scene]',at:18750,findText:'Mirrorland'},
  {key:'estate',label:'The wider estate',selector:'.compass-accessibility-routes',at:22250,prepare:'routes'},
  {key:'return',label:'Return to Compass',selector:'[data-compass-scene]',at:25500},
];
const $=(s,r=document)=>r.querySelector(s);
const all=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={phase:null,overlay:null,frame:null,raf:0,start:0,beat:-1,settled:false,priorFocus:null,root:null,rootInert:false,rootAriaHidden:null,url:'',historyLength:0,frameReady:false,abortTimer:0};
const setPhase=phase=>{state.phase=phase;if(state.overlay)state.overlay.dataset.state=phase;document.documentElement.dataset.compassOrientationCinematic=phase;};
function restoreRoot(){
  if(!state.root)return;
  state.root.inert=state.rootInert;
  if(state.rootAriaHidden===null)state.root.removeAttribute('aria-hidden');else state.root.setAttribute('aria-hidden',state.rootAriaHidden);
}
function clearRuntime(){
  cancelAnimationFrame(state.raf);state.raf=0;
  clearTimeout(state.abortTimer);state.abortTimer=0;
  window.removeEventListener('keydown',onKey,true);
  state.frame?.removeEventListener('load',onFrameLoad);
}
function settle(reason='complete'){
  if(state.settled)return;
  state.settled=true;
  clearRuntime();
  setPhase(STATE.SETTLED);
  if(state.overlay){state.overlay.dataset.settleReason=reason;state.overlay.remove();}
  restoreRoot();
  document.documentElement.classList.remove('compass-orientation-cinematic-active');
  if(location.href!==state.url){try{history.replaceState(history.state,'',state.url);}catch{}}
  requestAnimationFrame(()=>{
    const target=state.priorFocus&&state.priorFocus.isConnected?state.priorFocus:null;
    if(target&&typeof target.focus==='function')target.focus({preventScroll:true});
    document.dispatchEvent(new CustomEvent('dgb:compass-orientation-cinematic-settled',{detail:{reason,durationMs:MASTER_DURATION,navigationIntentEvents:0}}));
  });
}
function failOpen(code){
  try{document.documentElement.dataset.compassOrientationCinematicError=code;}catch{}
  settle('fail-open');
}
function onKey(e){
  if(e.key==='Escape'){e.preventDefault();settle('skip-keyboard');return;}
  if(e.key==='Tab'&&state.overlay){
    const focusable=all('button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',state.overlay).filter(n=>!n.hidden);
    if(!focusable.length){e.preventDefault();return;}
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
}
function createShell(){
  const overlay=document.createElement('section');
  overlay.id='compass-orientation-cinematic';
  overlay.className='compass-orientation-cinematic';
  overlay.dataset.state=STATE.ARMED;
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-labelledby','compass-orientation-cinematic-title');
  overlay.innerHTML=`<div class="compass-orientation-cinematic__backdrop" aria-hidden="true"></div>
    <div class="compass-orientation-cinematic__stage" data-cinematic-stage>
      <div class="compass-orientation-cinematic__armed" data-cinematic-armed>
        <p class="compass-orientation-cinematic__eyebrow">Diamond Gate Bridge</p>
        <h2 id="compass-orientation-cinematic-title">Find your way.</h2>
        <p>One short orientation through the real Compass, Chapter One, research, readiness, ways to engage, Mirrorland, and the wider estate.</p>
        <div class="compass-orientation-cinematic__actions"><button type="button" data-cinematic-play>Begin orientation</button><button type="button" data-cinematic-skip>Skip</button></div>
      </div>
      <div class="compass-orientation-cinematic__player" data-cinematic-player hidden>
        <div class="compass-orientation-cinematic__frame-wrap" data-cinematic-frame-wrap></div>
        <div class="compass-orientation-cinematic__scrim" aria-hidden="true"></div>
        <div class="compass-orientation-cinematic__caption" aria-live="polite"><span data-cinematic-ordinal></span><strong data-cinematic-label></strong></div>
        <div class="compass-orientation-cinematic__progress" aria-hidden="true"><i data-cinematic-progress></i></div>
        <button class="compass-orientation-cinematic__skip" type="button" data-cinematic-skip>Skip orientation</button>
      </div>
      <div class="compass-orientation-cinematic__reduced" data-cinematic-reduced hidden>
        <p class="compass-orientation-cinematic__eyebrow">Orientation · reduced motion</p>
        <h2>The estate, in order.</h2>
        <ol>${BEATS.map(b=>`<li>${b.label}</li>`).join('')}</ol>
        <button type="button" data-cinematic-skip>Continue to Compass</button>
      </div>
    </div>`;
  return overlay;
}
function prepareFrameBeat(beat){
  const win=state.frame?.contentWindow,doc=state.frame?.contentDocument;
  if(!win||!doc)return null;
  if(!doc.documentElement.dataset.cinematicNavigationGuard){
    doc.documentElement.dataset.cinematicNavigationGuard='true';
    doc.addEventListener('click',e=>{if(e.target.closest('a,form')){e.preventDefault();e.stopImmediatePropagation();}},true);
    doc.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();},true);
  }
  if(beat.prepare==='chapter'){
    const details=$(beat.selector,doc);if(details)details.open=true;
  }
  if(['research','trl','tra','community'].includes(beat.prepare)){
    const tab=$(`.compass-readiness-tab[data-readiness-tab="${beat.prepare}"]`,doc)||$(`[data-readiness-family="${beat.prepare}"]`,doc)?.closest('[data-compass-readiness-stage]')?.querySelector(`button[aria-controls*="${beat.prepare}"]`);
    if(tab&&tab.getAttribute('aria-selected')!=='true')tab.click();
    all('.compass-readiness-family',doc).forEach(node=>{const active=node.dataset.readinessFamily===beat.prepare;node.hidden=!active;node.inert=!active;});
  }
  if(beat.prepare==='routes'){
    const details=$(beat.selector,doc);if(details)details.open=true;
  }
  let target=$(beat.selector,doc);
  if(beat.findText&&target){
    const text=all('*',target).find(node=>node.children.length===0&&node.textContent?.trim().toLowerCase().includes(beat.findText.toLowerCase()));
    if(text)target=text;
  }
  return target;
}
function showBeat(index){
  if(index===state.beat)return;
  const beat=BEATS[index];if(!beat)return;
  state.beat=index;
  const target=prepareFrameBeat(beat);
  const doc=state.frame?.contentDocument;
  if(target&&doc){
    const scroller=doc.scrollingElement||doc.documentElement;
    const rect=target.getBoundingClientRect();
    const top=Math.max(0,rect.top+scroller.scrollTop-(state.frame.clientHeight-rect.height)/2);
    scroller.scrollTo({top,behavior:'auto'});
  }
  const label=$('[data-cinematic-label]',state.overlay),ordinal=$('[data-cinematic-ordinal]',state.overlay);
  if(label)label.textContent=beat.label;
  if(ordinal)ordinal.textContent=String(index+1).padStart(2,'0')+' / '+String(BEATS.length).padStart(2,'0');
  state.overlay.dataset.beat=beat.key;
}
function tick(now){
  if(state.phase!==STATE.PLAYING||state.settled)return;
  const elapsed=Math.min(MASTER_DURATION,Math.max(0,now-state.start));
  let index=0;for(let i=0;i<BEATS.length;i++)if(elapsed>=BEATS[i].at)index=i;
  showBeat(index);
  const progress=$('[data-cinematic-progress]',state.overlay);if(progress)progress.style.transform=`scaleX(${elapsed/MASTER_DURATION})`;
  if(elapsed>=MASTER_DURATION){requestAnimationFrame(()=>settle('complete'));return;}
  state.raf=requestAnimationFrame(tick);
}
function startPlayback(){
  if(state.phase!==STATE.ARMED||state.settled)return;
  if(reduced()){
    $('[data-cinematic-armed]',state.overlay).hidden=true;
    $('[data-cinematic-reduced]',state.overlay).hidden=false;
    setPhase(STATE.PLAYING);
    $('[data-cinematic-skip]',state.overlay)?.focus();
    return;
  }
  $('[data-cinematic-armed]',state.overlay).hidden=true;
  $('[data-cinematic-player]',state.overlay).hidden=false;
  setPhase(STATE.PLAYING);
  const wrap=$('[data-cinematic-frame-wrap]',state.overlay);
  const frame=document.createElement('iframe');
  frame.className='compass-orientation-cinematic__frame';
  frame.title='Live Diamond Gate Bridge orientation view';
  frame.setAttribute('sandbox','allow-scripts allow-same-origin');
  frame.setAttribute('aria-hidden','true');
  frame.tabIndex=-1;
  state.frame=frame;
  frame.addEventListener('load',onFrameLoad,{once:true});
  wrap.appendChild(frame);
  const url=new URL(location.href);url.searchParams.set('orientation-cinematic-frame','1');url.hash='';
  frame.src=url.href;
  state.abortTimer=setTimeout(()=>{if(!state.frameReady)failOpen('FRAME_LOAD_TIMEOUT');},8000);
}
function onFrameLoad(){
  clearTimeout(state.abortTimer);state.abortTimer=0;
  try{
    const doc=state.frame.contentDocument;
    if(!doc||!$('[data-compass-root]',doc))return failOpen('FRAME_SOURCE_BINDING_FAILURE');
    state.frameReady=true;
    state.start=performance.now();
    state.beat=-1;
    showBeat(0);
    state.raf=requestAnimationFrame(tick);
  }catch{return failOpen('FRAME_ACCESS_FAILURE');}
}
function mount(){
  if(window.self!==window.top)return;
  if(new URLSearchParams(location.search).has('orientation-cinematic-frame'))return;
  state.root=$('[data-compass-root]');
  if(!state.root||!$('[data-compass-scene]')||!$('[data-compass-static-introduction]')||!$('[data-readiness-family="research"]')||!$('[data-capability-orbit]'))return;
  state.priorFocus=document.activeElement;
  state.rootInert=state.root.inert;
  state.rootAriaHidden=state.root.getAttribute('aria-hidden');
  state.url=location.href;
  state.historyLength=history.length;
  state.overlay=createShell();
  document.body.appendChild(state.overlay);
  state.root.inert=true;
  state.root.setAttribute('aria-hidden','true');
  document.documentElement.classList.add('compass-orientation-cinematic-active');
  setPhase(STATE.ARMED);
  state.overlay.addEventListener('click',e=>{
    if(e.target.closest('[data-cinematic-play]'))startPlayback();
    else if(e.target.closest('[data-cinematic-skip]'))settle(state.phase===STATE.ARMED?'skip-armed':'skip-playing');
  });
  window.addEventListener('keydown',onKey,true);
  $('[data-cinematic-play]',state.overlay)?.focus({preventScroll:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
