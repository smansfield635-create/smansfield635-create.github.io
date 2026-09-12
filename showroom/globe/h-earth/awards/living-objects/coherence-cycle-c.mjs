const CONTRACT = Object.freeze({
  id: 'AWARDS_COHERENCE_LIVING_OBJECT_CYCLE_C_V1',
  cycle: 'C_COHERENCE',
  claim: 'Coherence can be inspected without pretending uncertainty is certainty.',
  sourceBinding: Object.freeze({
    governingHead: '0c00c49f678c1ea6f597e864ca08d538dc05b274',
    coherenceDiagnostic: Object.freeze({
      path: '/products/coherence-diagnostic/index.html',
      blob: 'b0785f36d913c286dc19e042f33ea91afcd166bc'
    })
  }),
  semanticBinding: Object.freeze({
    posture: 'CALIBRATE_SELF_ALIGN_TEAMS_STABILIZE_SCALE',
    rule: 'NO_RECEIPTS_NO_UPGRADE',
    observerInvariant: 'SAME_RECEIPTS_SAME_RESULT',
    actionClasses: Object.freeze(['PROCEED','HOLD','CONTAIN']),
    dimensions: Object.freeze(['SCOPE','RECEIPTS','RULES','SCALE']),
    numericScoreAuthorized: false,
    coherenceIndexMeaning: 'QUALITATIVE_SOURCE_BOUND_ALIGNMENT_INDEX',
    scoreMeaning: 'BOUNDED_ACTION_CLASSIFICATION_NOT_A_NUMERIC_EFFICACY_SCORE'
  }),
  lifecycle: Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

const STYLE_ID='awards-coherence-cycle-c-style';
const STYLE=`
.awards-coherence-object{position:relative;width:100%;height:100%;min-height:240px;overflow:hidden;isolation:isolate;contain:layout paint style;pointer-events:none;background:radial-gradient(circle at 50% 48%,rgba(167,139,250,.10),transparent 34%),radial-gradient(circle at 50% 76%,rgba(96,165,250,.06),transparent 44%)}
.awards-coherence-object .coh-field{position:absolute;inset:4%;display:grid;place-items:center;perspective:760px}
.awards-coherence-object .coh-orbit{position:absolute;width:min(76%,270px);aspect-ratio:1;border-radius:50%;border:1px solid rgba(214,198,255,.18);box-shadow:inset 0 0 38px rgba(137,110,255,.05),0 0 30px rgba(78,141,255,.05);transform:rotateX(62deg) rotateZ(-16deg);transition:transform .85s cubic-bezier(.18,.78,.2,1),opacity .4s ease}
.awards-coherence-object .coh-orbit:before,.awards-coherence-object .coh-orbit:after{content:"";position:absolute;inset:14%;border-radius:50%;border:1px solid rgba(145,209,255,.14)}
.awards-coherence-object .coh-orbit:after{inset:29%;border-color:rgba(244,211,94,.16)}
.awards-coherence-object .coh-index{position:absolute;left:50%;top:48%;width:min(58%,204px);aspect-ratio:1;transform:translate(-50%,-50%);display:grid;place-items:center}
.awards-coherence-object .coh-ring{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:conic-gradient(from -40deg,rgba(245,158,11,.52) 0 22%,rgba(147,197,253,.50) 22% 47%,rgba(212,175,55,.54) 47% 72%,rgba(96,165,250,.50) 72% 100%);mask:radial-gradient(circle,transparent 59%,#000 61%);opacity:.42;transform:rotate(-18deg);transition:opacity .45s ease,transform 1.1s cubic-bezier(.18,.78,.2,1)}
.awards-coherence-object .coh-core{position:absolute;inset:23%;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.15),rgba(58,45,94,.36) 34%,rgba(8,15,26,.90) 76%);box-shadow:0 0 34px rgba(137,110,255,.14);display:grid;place-items:center;text-align:center;padding:12px}
.awards-coherence-object .coh-core strong{display:block;font:700 10px/1.15 system-ui,sans-serif;letter-spacing:1.6px;color:rgba(255,255,255,.84)}
.awards-coherence-object .coh-core span{display:block;margin-top:5px;font:600 8px/1.2 system-ui,sans-serif;letter-spacing:1px;color:rgba(255,255,255,.48)}
.awards-coherence-object .coh-dimension{position:absolute;left:50%;top:50%;width:7px;height:7px;border-radius:2px;transform:translate(-50%,-50%) rotate(45deg) translateY(-108px);background:rgba(255,255,255,.72);box-shadow:0 0 12px rgba(180,214,255,.45);transition:transform .8s cubic-bezier(.18,.78,.2,1),opacity .4s ease}
.awards-coherence-object .coh-dimension:nth-child(2){transform:translate(-50%,-50%) rotate(135deg) translateY(-108px)}
.awards-coherence-object .coh-dimension:nth-child(3){transform:translate(-50%,-50%) rotate(225deg) translateY(-108px)}
.awards-coherence-object .coh-dimension:nth-child(4){transform:translate(-50%,-50%) rotate(315deg) translateY(-108px)}
.awards-coherence-object .coh-score{position:absolute;left:50%;bottom:8%;transform:translateX(-50%);display:flex;gap:7px;align-items:center;padding:8px 10px;border:1px solid rgba(255,255,255,.11);border-radius:999px;background:rgba(7,12,20,.64);font:700 8px/1 system-ui,sans-serif;letter-spacing:1px;color:rgba(255,255,255,.46)}
.awards-coherence-object .coh-score i{width:5px;height:5px;border-radius:50%;background:currentColor;box-shadow:0 0 8px currentColor}
.awards-coherence-object .coh-score b{font:800 9px/1 system-ui,sans-serif;color:rgba(255,255,255,.82);letter-spacing:1.2px}
.awards-coherence-object[data-coh-phase="receipts"] .coh-ring{opacity:.72;transform:rotate(8deg)}
.awards-coherence-object[data-coh-phase="align"] .coh-orbit{transform:rotateX(68deg) rotateZ(12deg) scale(.96)}
.awards-coherence-object[data-coh-phase="rules"] .coh-ring{opacity:.92;transform:rotate(34deg)}
.awards-coherence-object[data-coh-phase="classify"] .coh-score{color:rgba(244,211,94,.78)}
.awards-coherence-object[data-coh-phase="classify"] .coh-score b{color:rgba(244,211,94,.95)}
.awards-coherence-object[data-coh-phase="restore"] .coh-orbit{transform:rotateX(62deg) rotateZ(-16deg) scale(.92)}
.awards-coherence-object[data-coh-phase="selected"] .coh-ring{opacity:.92}.awards-coherence-object[data-coh-phase="selected"] .coh-score{color:rgba(147,197,253,.82)}
.awards-coherence-object[data-coh-phase="rear"]{opacity:.32;filter:saturate(.7) blur(1px)}
.awards-coherence-object[data-coh-phase="equivalent"] .coh-ring{opacity:.88;transform:rotate(24deg)}.awards-coherence-object[data-coh-phase="equivalent"] .coh-score{color:rgba(244,211,94,.78)}
@media(prefers-reduced-motion:reduce){.awards-coherence-object *{transition:none!important;animation:none!important}}
`;

function ensureStyle(){
  let style=document.getElementById(STYLE_ID);
  if(style)return style;
  style=document.createElement('style');style.id=STYLE_ID;style.textContent=STYLE;document.head.append(style);return style;
}

function markup(){return `<div class="awards-coherence-object" data-awards-lo="coherence" data-awards-lo-state="FOREGROUND_REST" data-coh-phase="rest" aria-hidden="true"><div class="coh-field"><div class="coh-orbit"></div><div class="coh-index"><div class="coh-ring"></div><div class="coh-dimension"></div><div class="coh-dimension"></div><div class="coh-dimension"></div><div class="coh-dimension"></div><div class="coh-core"><div><strong>COHERENCE INDEX</strong><span>SCOPE · RECEIPTS · RULES · SCALE</span></div></div></div><div class="coh-score"><i></i><span>SCORE</span><b>BOUNDED</b></div></div></div>`;}

export function mountCoherenceLivingObject(root, options={}){
  if(!root || typeof root.replaceChildren!=='function') throw new TypeError('COHERENCE_ROOT_REQUIRED');
  ensureStyle();
  const reduced=options.reducedMotion ?? globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const wrap=document.createElement('div');wrap.innerHTML=markup();const node=wrap.firstElementChild;root.replaceChildren(node);
  let state='FOREGROUND_REST',token=0,timers=[],classification='HOLD';
  const phase=v=>{if(node)node.dataset.cohPhase=v};
  const clear=()=>{timers.forEach(clearTimeout);timers=[]};
  const schedule=(fn,ms,t)=>{const id=setTimeout(()=>{if(t===token)fn()},ms);timers.push(id)};
  const scoreLabel=()=>node?.querySelector('.coh-score b');
  function setClassification(next){if(!CONTRACT.semanticBinding.actionClasses.includes(next))throw new Error(`COHERENCE_INVALID_CLASSIFICATION:${next}`);classification=next;const el=scoreLabel();if(el)el.textContent=next;return classification}
  function setState(next){if(!CONTRACT.lifecycle.includes(next))throw new Error(`COHERENCE_INVALID_STATE:${next}`);state=next;node.dataset.awardsLoState=next;return state}
  function stable(){phase(reduced?'equivalent':'idle');setState('FOREGROUND_IDLE')}
  function playSignature(){token++;clear();const t=token;setState('SIGNATURE_PLAY');setClassification('HOLD');if(reduced){phase('equivalent');return stable()}phase('receipts');schedule(()=>phase('align'),660,t);schedule(()=>phase('rules'),1360,t);schedule(()=>{phase('classify');setClassification('PROCEED')},2200,t);schedule(()=>phase('restore'),3200,t);schedule(()=>stable(),3980,t);return t}
  function selectResponse(){token++;clear();setState('SELECT_RESPONSE');phase(reduced?'equivalent':'selected');setClassification('HOLD')}
  function readerOpen(){setState('READER_OPEN')}
  function restore(){token++;clear();setState('RETURN_RESTORING');phase(reduced?'equivalent':'restore');setClassification('HOLD');const t=token;schedule(()=>{phase('rest');setState('FOREGROUND_REST')},reduced?0:460,t)}
  function setLifecycle(next){token++;clear();setState(next);if(next==='REAR_INERT')phase('rear');else if(next==='APPROACHING')phase('approach');else if(next==='FOREGROUND_REST')phase('rest');else if(next==='FOREGROUND_IDLE')phase('idle')}
  function inspect(){return Object.freeze({contract:CONTRACT.id,cycle:CONTRACT.cycle,state,phase:node.dataset.cohPhase,reducedMotion:!!reduced,webglContexts:0,classification,numericScore:false,sourceBinding:CONTRACT.sourceBinding,semanticBinding:CONTRACT.semanticBinding})}
  function destroy(){token++;clear();root.replaceChildren()}
  if(reduced)phase('equivalent');
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,setClassification,inspect,destroy,element:node})
}

export { CONTRACT as AWARDS_COHERENCE_CYCLE_C_CONTRACT };
