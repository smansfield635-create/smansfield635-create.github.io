const CONTRACT=Object.freeze({
  id:'AWARDS_TRUST_LIVING_OBJECT_CYCLE_D_V1',
  cycle:'D_TRUST',
  claim:'Software should have to earn the right to say it worked.',
  sourceBinding:Object.freeze({
    governingHead:'423f428f8d8a0a000de65ba792be8c6f002ce1e6',
    governanceIndex:Object.freeze({path:'/governance/index.html',blob:'9b216d8f86e5dbc76794ab01ce967d3e9357ef21'}),
    governanceRuntime:Object.freeze({path:'/governance/governance.js',blob:'d4404826317739dca929f046c960fd5fd11f6995'}),
    evidenceIndex:Object.freeze({path:'/evidence/index.html',blob:'69b15800b1d7ef044a1ab7e77b84861bdd81602f'}),
    evidenceCondition:Object.freeze({path:'/evidence/current-public-condition.mjs',blob:'b2d4231a984da4579ad71528dd1276df023fd1aa'})
  }),
  semanticBinding:Object.freeze({
    authorityProgression:Object.freeze(['INTENT','EXECUTION','VERIFICATION','EVIDENCE','AUTHORIZED_CLAIM']),
    boundedDispositions:Object.freeze(['HOLD','DENY','FAIL_CLOSED','AUTHORIZED']),
    executionImpliesSuccess:false,
    executionImpliesClaimAuthority:false,
    authorizedClaimRequires:Object.freeze(['VERIFICATION','EVIDENCE']),
    rule:'NO_AUTHORIZED_CLAIM_WITHOUT_VERIFICATION_AND_EVIDENCE'
  }),
  lifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

const STYLE_ID='awards-trust-cycle-d-style';
const STYLE=`
.awards-trust-object{position:relative;width:100%;height:100%;min-height:240px;overflow:hidden;isolation:isolate;contain:layout paint style;pointer-events:none;background:radial-gradient(circle at 50% 48%,rgba(212,175,55,.09),transparent 34%),radial-gradient(circle at 50% 82%,rgba(96,165,250,.05),transparent 45%)}
.awards-trust-object .trust-stage{position:absolute;inset:7%;display:grid;place-items:center;perspective:760px}
.awards-trust-object .trust-spine{position:absolute;left:50%;top:16%;bottom:22%;width:1px;background:linear-gradient(rgba(255,255,255,.08),rgba(212,175,55,.48),rgba(255,255,255,.08));transform:translateX(-50%)}
.awards-trust-object .trust-gates{position:absolute;inset:12% 6% 24%;display:grid;grid-template-columns:repeat(5,1fr);gap:7px;align-items:center}
.awards-trust-object .trust-gate{height:58%;min-height:74px;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:linear-gradient(160deg,rgba(13,20,31,.82),rgba(5,9,15,.92));box-shadow:inset 0 1px rgba(255,255,255,.05);display:grid;place-items:center;text-align:center;padding:5px;opacity:.28;transform:translateY(7px);transition:.45s ease}
.awards-trust-object .trust-gate b{font:800 7px/1.25 system-ui,sans-serif;letter-spacing:.8px;color:rgba(255,255,255,.75)}
.awards-trust-object .trust-seal{position:absolute;left:50%;bottom:4%;transform:translateX(-50%);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:8px 12px;background:rgba(5,9,15,.76);font:800 8px/1 system-ui,sans-serif;letter-spacing:1.15px;color:rgba(255,255,255,.55);white-space:nowrap}
.awards-trust-object .trust-seal i{display:inline-block;width:5px;height:5px;border-radius:50%;margin-right:7px;background:currentColor;box-shadow:0 0 8px currentColor}
.awards-trust-object[data-trust-step="INTENT"] .trust-gate:nth-child(-n+1),
.awards-trust-object[data-trust-step="EXECUTION"] .trust-gate:nth-child(-n+2),
.awards-trust-object[data-trust-step="VERIFICATION"] .trust-gate:nth-child(-n+3),
.awards-trust-object[data-trust-step="EVIDENCE"] .trust-gate:nth-child(-n+4),
.awards-trust-object[data-trust-step="AUTHORIZED_CLAIM"] .trust-gate{opacity:.92;transform:none;border-color:rgba(212,175,55,.28)}
.awards-trust-object[data-trust-disposition="AUTHORIZED"] .trust-seal{color:rgba(212,175,55,.96);border-color:rgba(212,175,55,.36)}
.awards-trust-object[data-trust-disposition="DENY"] .trust-seal,.awards-trust-object[data-trust-disposition="FAIL_CLOSED"] .trust-seal{color:rgba(248,113,113,.86)}
.awards-trust-object[data-trust-disposition="HOLD"] .trust-seal{color:rgba(147,197,253,.78)}
.awards-trust-object[data-trust-phase="rear"]{opacity:.30;filter:saturate(.65) blur(1px)}
.awards-trust-object[data-trust-phase="equivalent"] .trust-gate{transition:none}
@media(prefers-reduced-motion:reduce){.awards-trust-object *{transition:none!important;animation:none!important}}
`;
function ensureStyle(){let s=document.getElementById(STYLE_ID);if(s)return s;s=document.createElement('style');s.id=STYLE_ID;s.textContent=STYLE;document.head.append(s);return s}
function markup(){return `<div class="awards-trust-object" data-awards-lo="trust" data-awards-lo-state="FOREGROUND_REST" data-trust-phase="rest" data-trust-step="INTENT" data-trust-disposition="HOLD" aria-hidden="true"><div class="trust-stage"><div class="trust-spine"></div><div class="trust-gates"><div class="trust-gate"><b>INTENT</b></div><div class="trust-gate"><b>EXECUTION</b></div><div class="trust-gate"><b>VERIFICATION</b></div><div class="trust-gate"><b>EVIDENCE</b></div><div class="trust-gate"><b>AUTHORIZED<br>CLAIM</b></div></div><div class="trust-seal"><i></i><span>HOLD</span></div></div></div>`}

export function mountTrustLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('TRUST_ROOT_REQUIRED');
  ensureStyle();
  const reduced=options.reducedMotion??globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  const wrap=document.createElement('div');wrap.innerHTML=markup();const node=wrap.firstElementChild;root.replaceChildren(node);
  let state='FOREGROUND_REST',step='INTENT',disposition='HOLD',token=0,timers=[];
  const clear=()=>{timers.forEach(clearTimeout);timers=[]};
  const schedule=(fn,ms,t)=>{const id=setTimeout(()=>{if(t===token)fn()},ms);timers.push(id)};
  const paint=()=>{node.dataset.trustStep=step;node.dataset.trustDisposition=disposition;const s=node.querySelector('.trust-seal span');if(s)s.textContent=disposition};
  const setState=next=>{if(!CONTRACT.lifecycle.includes(next))throw new Error(`TRUST_INVALID_STATE:${next}`);state=next;node.dataset.awardsLoState=next;return state};
  const setStep=next=>{if(!CONTRACT.semanticBinding.authorityProgression.includes(next))throw new Error(`TRUST_INVALID_STEP:${next}`);step=next;paint();return step};
  function setDisposition(next){if(!CONTRACT.semanticBinding.boundedDispositions.includes(next))throw new Error(`TRUST_INVALID_DISPOSITION:${next}`);if(next==='AUTHORIZED'&&step!=='AUTHORIZED_CLAIM')throw new Error('TRUST_AUTHORITY_WITHOUT_EVIDENCE');disposition=next;paint();return disposition}
  function stable(){node.dataset.trustPhase=reduced?'equivalent':'idle';setState('FOREGROUND_IDLE')}
  function playSignature(){token++;clear();const t=token;setState('SIGNATURE_PLAY');disposition='HOLD';setStep('INTENT');node.dataset.trustPhase=reduced?'equivalent':'intent';
    if(reduced){setStep('EXECUTION');setStep('VERIFICATION');setStep('EVIDENCE');setStep('AUTHORIZED_CLAIM');setDisposition('AUTHORIZED');stable();return t}
    schedule(()=>{setStep('EXECUTION');node.dataset.trustPhase='execution'},620,t);
    schedule(()=>{setStep('VERIFICATION');node.dataset.trustPhase='verification'},1320,t);
    schedule(()=>{setStep('EVIDENCE');node.dataset.trustPhase='evidence'},2080,t);
    schedule(()=>{setStep('AUTHORIZED_CLAIM');setDisposition('AUTHORIZED');node.dataset.trustPhase='authorized'},2920,t);
    schedule(()=>stable(),3560,t);return t}
  function hold(){token++;clear();disposition='HOLD';setStep('VERIFICATION');setState('SELECT_RESPONSE');node.dataset.trustPhase=reduced?'equivalent':'held';paint()}
  function deny(){token++;clear();disposition='DENY';setState('SELECT_RESPONSE');node.dataset.trustPhase='denied';paint()}
  function failClosed(){token++;clear();disposition='FAIL_CLOSED';setState('SELECT_RESPONSE');node.dataset.trustPhase='fail-closed';paint()}
  function selectResponse(){hold()}
  function readerOpen(){setState('READER_OPEN')}
  function restore(){token++;clear();disposition='HOLD';step='INTENT';paint();setState('RETURN_RESTORING');node.dataset.trustPhase=reduced?'equivalent':'restore';const t=token;schedule(()=>{node.dataset.trustPhase='rest';setState('FOREGROUND_REST')},reduced?0:420,t)}
  function setLifecycle(next){token++;clear();setState(next);node.dataset.trustPhase=next==='REAR_INERT'?'rear':next==='APPROACHING'?'approach':next==='FOREGROUND_REST'?'rest':'idle'}
  function inspect(){return Object.freeze({contract:CONTRACT.id,cycle:CONTRACT.cycle,state,step,disposition,reducedMotion:!!reduced,webglContexts:0,executionImpliesSuccess:false,executionImpliesClaimAuthority:false,sourceBinding:CONTRACT.sourceBinding,semanticBinding:CONTRACT.semanticBinding})}
  function destroy(){token++;clear();root.replaceChildren()}
  if(reduced)node.dataset.trustPhase='equivalent';paint();
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,hold,deny,failClosed,setDisposition,inspect,destroy,element:node})
}
export {CONTRACT as AWARDS_TRUST_CYCLE_D_CONTRACT};
