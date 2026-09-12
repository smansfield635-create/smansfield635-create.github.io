const CONTRACT=Object.freeze({
  id:'AWARDS_EXPERIENCE_LIVING_OBJECT_CYCLE_A_V2_RECOGNIZABLE_MIRRORLAND',
  cycle:'A_EXPERIENCE',
  claim:'A website can behave like a place.',
  recognizableObject:'MIRRORLAND_WINDOW',
  signatureEvent:'OPAQUE_CATHEDRAL_GLASS_TO_CLEAR_AUDRALIA_TO_OPAQUE',
  sourceBinding:Object.freeze({
    governingHead:'56c1630070b869f5e3a2d91e53a0812fd885a046',
    mirrorlandWindow:Object.freeze({path:'/assets/compass/compass.mirrorland-window.js',blob:'f99d3ffedf7b7654d067d21d9363eb287877f852',paneCount:21}),
    audralia:Object.freeze({path:'/showroom/globe/audralia/index.html',blob:'a10fff1420681abdc377e5c06d8620a7b4f019ac'})
  }),
  invariant:'SAME_WINDOW_GEOMETRY_ACROSS_OPAQUE_AND_CLEAR_STATES',
  eventCount:1,
  lifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

const STYLE_ID='awards-experience-recognizable-v2-style';
const STYLE=`
.awards-exp-window{position:relative;width:100%;height:100%;min-height:220px;overflow:hidden;isolation:isolate;pointer-events:none;display:grid;place-items:center;background:radial-gradient(circle at 50% 52%,rgba(116,214,236,.09),transparent 50%)}
.awards-exp-window .mirror-window{position:relative;width:70%;height:88%;max-width:165px;max-height:205px;border:6px solid rgba(45,50,63,.96);border-radius:50% 50% 13px 13px/24% 24% 13px 13px;background:#07131b;box-shadow:inset 0 0 0 2px rgba(132,146,164,.34),0 0 24px rgba(96,197,224,.11);overflow:hidden;transform:translateZ(0);transition:transform .55s cubic-bezier(.2,.8,.2,1),filter .45s ease}
.awards-exp-window .audralia-view{position:absolute;inset:0;background:linear-gradient(#64a8c4 0 39%,#c8b37b 40% 42%,#1d6b79 43% 100%);opacity:.18;transition:opacity .72s ease,filter .72s ease;filter:saturate(.65) brightness(.7)}
.awards-exp-window .audralia-sky{position:absolute;inset:0 0 55%;background:linear-gradient(180deg,#1b4b69,#72bad1 78%,#d7ccaa)}
.awards-exp-window .audralia-mountains{position:absolute;left:-8%;right:-8%;bottom:34%;height:45%;background:linear-gradient(145deg,#34482f,#789063 50%,#33493c);clip-path:polygon(0 88%,8% 70%,15% 76%,24% 38%,32% 64%,43% 24%,53% 58%,62% 42%,71% 67%,81% 31%,92% 61%,100% 48%,100% 100%,0 100%)}
.awards-exp-window .audralia-water{position:absolute;left:0;right:0;bottom:0;height:39%;background:linear-gradient(180deg,#347f8b,#145160 58%,#0a3546);box-shadow:inset 0 5px 12px rgba(222,230,195,.22)}
.awards-exp-window .audralia-water:after{content:'';position:absolute;left:8%;right:6%;top:22%;height:1px;background:rgba(220,244,239,.6);box-shadow:0 12px rgba(220,244,239,.25),0 25px rgba(220,244,239,.16)}
.awards-exp-window .pane-grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(7,1fr);z-index:3}
.awards-exp-window .pane{border:1.4px solid rgba(24,28,38,.92);background:var(--glass);opacity:.91;box-shadow:inset 0 0 9px rgba(255,255,255,.09);transition:opacity .7s ease,background .7s ease,backdrop-filter .7s ease}
.awards-exp-window .pane:nth-child(5n+1){--glass:rgba(78,177,204,.76)}.awards-exp-window .pane:nth-child(5n+2){--glass:rgba(95,102,184,.76)}.awards-exp-window .pane:nth-child(5n+3){--glass:rgba(185,111,65,.74)}.awards-exp-window .pane:nth-child(5n+4){--glass:rgba(118,75,169,.75)}.awards-exp-window .pane:nth-child(5n){--glass:rgba(177,74,119,.72)}
.awards-exp-window .mullion-v,.awards-exp-window .mullion-h{position:absolute;z-index:4;background:rgba(20,24,31,.94);box-shadow:0 0 2px rgba(221,232,242,.16)}
.awards-exp-window .mullion-v{top:0;bottom:0;left:50%;width:3px;transform:translateX(-50%)}.awards-exp-window .mullion-h{left:0;right:0;top:46%;height:3px}
.awards-exp-window[data-exp-phase='clear'] .audralia-view,.awards-exp-window[data-exp-phase='equivalent'] .audralia-view{opacity:1;filter:saturate(1.08) brightness(1.02)}
.awards-exp-window[data-exp-phase='clear'] .pane{opacity:.13;background:rgba(210,238,242,.06)}
.awards-exp-window[data-exp-phase='equivalent'] .pane{opacity:.28;background:rgba(183,220,226,.13)}
.awards-exp-window[data-exp-phase='clear'] .mirror-window{filter:drop-shadow(0 0 10px rgba(117,219,238,.22));transform:scale(1.035)}
.awards-exp-window[data-exp-phase='selected'] .mirror-window{transform:scale(.97);filter:drop-shadow(0 0 13px rgba(234,211,154,.24))}
.awards-exp-window[data-exp-phase='rear']{opacity:.3;filter:saturate(.65) blur(1px)}
@media(max-width:760px){.awards-exp-window .mirror-window{width:76%;height:84%;max-width:150px;max-height:190px}}
@media(prefers-reduced-motion:reduce){.awards-exp-window *{transition:none!important}}
`;
function ensureStyle(doc){let s=doc.getElementById(STYLE_ID);if(s)return;s=doc.createElement('style');s.id=STYLE_ID;s.textContent=STYLE;doc.head.append(s)}
function markup(){const panes=Array.from({length:21},(_,i)=>`<i class="pane" data-pane="${i+1}"></i>`).join('');return `<div class="awards-exp-window" data-awards-lo="experience" data-awards-lo-state="FOREGROUND_REST" data-exp-phase="opaque" data-recognizable-object="MIRRORLAND_WINDOW" aria-hidden="true"><div class="mirror-window"><div class="audralia-view"><i class="audralia-sky"></i><i class="audralia-mountains"></i><i class="audralia-water"></i></div><div class="pane-grid">${panes}</div><i class="mullion-v"></i><i class="mullion-h"></i></div></div>`}
export function mountExperienceLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('EXPERIENCE_ROOT_REQUIRED');
  ensureStyle(root.ownerDocument||document);const reduced=options.reducedMotion??globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  const wrap=(root.ownerDocument||document).createElement('div');wrap.innerHTML=markup();const node=wrap.firstElementChild;root.replaceChildren(node);
  let state='FOREGROUND_REST',token=0,timers=[];const clearTimers=()=>{timers.forEach(clearTimeout);timers=[]};const phase=v=>{node.dataset.expPhase=v};const schedule=(fn,ms,t)=>timers.push(setTimeout(()=>{if(token===t)fn()},ms));
  function setState(next){if(!CONTRACT.lifecycle.includes(next))throw new Error(`EXPERIENCE_INVALID_STATE:${next}`);state=next;node.dataset.awardsLoState=next;return state}
  function stable(){setState('FOREGROUND_IDLE');if(!reduced)phase('opaque')}
  function playSignature(){token++;clearTimers();const t=token;setState('SIGNATURE_PLAY');if(reduced){phase('equivalent');return stable()}phase('opaque');schedule(()=>phase('clear'),420,t);schedule(()=>phase('opaque'),2600,t);schedule(()=>stable(),3400,t);return t}
  function selectResponse(){token++;clearTimers();setState('SELECT_RESPONSE');phase(reduced?'equivalent':'selected')}
  function readerOpen(){setState('READER_OPEN')}
  function restore(){token++;clearTimers();setState('RETURN_RESTORING');phase(reduced?'equivalent':'opaque');const t=token;schedule(()=>setState('FOREGROUND_REST'),reduced?0:380,t)}
  function setLifecycle(next){token++;clearTimers();setState(next);if(next==='REAR_INERT')phase('rear');else if(next==='APPROACHING')phase(reduced?'equivalent':'opaque');else if(next==='FOREGROUND_REST')phase(reduced?'equivalent':'opaque');else if(next==='FOREGROUND_IDLE')phase(reduced?'equivalent':'opaque')}
  function inspect(){return Object.freeze({contract:CONTRACT.id,cycle:CONTRACT.cycle,state,phase:node.dataset.expPhase,reducedMotion:!!reduced,webglContexts:0,recognizableObject:CONTRACT.recognizableObject,signatureEvent:CONTRACT.signatureEvent,eventCount:1,paneCount:21,sourceBinding:CONTRACT.sourceBinding})}
  function destroy(){token++;clearTimers();root.replaceChildren()}
  if(reduced)phase('equivalent');return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:node})
}
export {CONTRACT as AWARDS_EXPERIENCE_CYCLE_A_CONTRACT};
