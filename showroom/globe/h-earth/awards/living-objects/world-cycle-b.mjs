const CONTRACT=Object.freeze({
  id:'AWARDS_WORLD_LIVING_OBJECT_CYCLE_B_V2_RECOGNIZABLE_HEARTH_AUDRALIA',
  cycle:'B_WORLD',claim:'The browser can hold a world.',recognizableObject:'H_EARTH_AUDRALIA_WORLD',signatureEvent:'ENVIRONMENT_DEPTH_RESOLVE',eventCount:1,
  sourceBinding:Object.freeze({governingHead:'56c1630070b869f5e3a2d91e53a0812fd885a046',hEarthIndex:Object.freeze({path:'/showroom/globe/h-earth/index.js',blob:'b26aa16abfebf24bf0d77b62d36f7a11ade1ac5c'}),hEarthRenderer:Object.freeze({path:'/showroom/globe/h-earth/renderer.js',blob:'799d37cec5244e6aa19b7d94dffe37e182b85884'}),hEarthEnvironment:Object.freeze({path:'/showroom/globe/h-earth/environment.js',blob:'3f3bc750b0e1a87531e0ea425dc0ac343fb18381'}),audralia:Object.freeze({path:'/showroom/globe/audralia/index.html',blob:'a10fff1420681abdc377e5c06d8620a7b4f019ac'})}),
  worldGrammar:Object.freeze(['ATMOSPHERE','HORIZON','MOUNTAIN_TERRAIN','SHORELINE','WATER','DEPTH']),lifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});
const STYLE_ID='awards-world-recognizable-v2-style';
const STYLE=`
.awards-world-landscape{position:relative;width:100%;height:100%;min-height:220px;overflow:hidden;isolation:isolate;pointer-events:none;background:linear-gradient(180deg,rgba(7,24,37,.2),rgba(4,15,24,.08));perspective:700px}
.awards-world-landscape .world-frame{position:absolute;inset:8% 2% 7%;overflow:hidden;border-radius:44% 44% 18px 18px/18% 18% 18px 18px;border:1px solid rgba(134,205,218,.18);background:linear-gradient(180deg,#173c55 0%,#5799ad 34%,#d2c69d 45%,#1f6f7d 47%,#0a384a 100%);box-shadow:inset 0 0 35px rgba(0,0,0,.35),0 0 24px rgba(93,193,211,.08)}
.awards-world-landscape .atmosphere{position:absolute;inset:0 0 50%;background:radial-gradient(circle at 72% 25%,rgba(235,218,161,.58) 0 2%,rgba(235,218,161,.12) 3% 12%,transparent 27%),linear-gradient(180deg,#0d2b43,#4f8fa5 72%,#b4b49a);transition:filter .8s ease}
.awards-world-landscape .far-peaks,.awards-world-landscape .near-peaks{position:absolute;left:-6%;right:-6%;transform-origin:50% 100%;transition:transform .9s cubic-bezier(.2,.8,.2,1),filter .8s ease,opacity .8s ease}
.awards-world-landscape .far-peaks{bottom:43%;height:42%;background:linear-gradient(180deg,#6d7764,#344b40);clip-path:polygon(0 100%,0 74%,8% 64%,15% 71%,23% 42%,29% 61%,38% 27%,45% 62%,54% 38%,62% 67%,71% 29%,80% 59%,88% 44%,100% 68%,100% 100%);opacity:.76}
.awards-world-landscape .near-peaks{bottom:30%;height:49%;background:linear-gradient(160deg,#53644b 0%,#263d34 56%,#172c29);clip-path:polygon(0 100%,0 85%,10% 66%,18% 77%,28% 39%,36% 69%,47% 48%,57% 75%,68% 33%,78% 63%,90% 47%,100% 69%,100% 100%);filter:brightness(.8)}
.awards-world-landscape .shore{position:absolute;left:-5%;right:-5%;bottom:30%;height:16%;background:#bba97e;clip-path:polygon(0 35%,18% 47%,34% 24%,51% 51%,68% 34%,83% 55%,100% 32%,100% 100%,0 100%);transition:transform .9s cubic-bezier(.2,.8,.2,1),filter .8s ease}
.awards-world-landscape .water{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(180deg,#2b7884,#145267 57%,#082d41);transition:filter .8s ease,transform .9s cubic-bezier(.2,.8,.2,1)}
.awards-world-landscape .water:before,.awards-world-landscape .water:after{content:'';position:absolute;left:8%;right:9%;height:1px;background:rgba(216,240,231,.52);top:22%;box-shadow:0 18px rgba(216,240,231,.21),0 34px rgba(216,240,231,.12)}.awards-world-landscape .water:after{left:38%;right:5%;top:44%;opacity:.5}
.awards-world-landscape .foreground{position:absolute;left:-7%;right:-7%;bottom:-2%;height:19%;background:linear-gradient(180deg,#263b31,#0d201d);clip-path:polygon(0 35%,12% 16%,28% 28%,41% 10%,55% 29%,69% 7%,81% 24%,100% 13%,100% 100%,0 100%);transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.awards-world-landscape[data-world-phase='resolve'] .far-peaks{transform:translateY(-3%) scale(1.02);filter:brightness(1.08)}
.awards-world-landscape[data-world-phase='resolve'] .near-peaks{transform:translateY(-5%) scale(1.035);filter:brightness(1.08) saturate(1.08)}
.awards-world-landscape[data-world-phase='resolve'] .shore{transform:translateY(-3%);filter:brightness(1.16)}
.awards-world-landscape[data-world-phase='resolve'] .water{filter:brightness(1.14) saturate(1.12);transform:translateY(2%)}
.awards-world-landscape[data-world-phase='resolve'] .foreground{transform:translateY(7%) scale(1.06)}
.awards-world-landscape[data-world-phase='equivalent'] .far-peaks,.awards-world-landscape[data-world-phase='equivalent'] .near-peaks{filter:brightness(1.08) saturate(1.05)}
.awards-world-landscape[data-world-phase='selected'] .world-frame{box-shadow:inset 0 0 35px rgba(0,0,0,.3),0 0 25px rgba(234,211,154,.18)}
.awards-world-landscape[data-world-phase='rear']{opacity:.3;filter:saturate(.66) blur(1px)}
@media(max-width:760px){.awards-world-landscape .world-frame{inset:10% 0 8%}}
@media(prefers-reduced-motion:reduce){.awards-world-landscape *{transition:none!important}}
`;
function ensureStyle(doc){let s=doc.getElementById(STYLE_ID);if(s)return;s=doc.createElement('style');s.id=STYLE_ID;s.textContent=STYLE;doc.head.append(s)}
function markup(){return `<div class="awards-world-landscape" data-awards-lo="world" data-awards-lo-state="FOREGROUND_REST" data-world-phase="rest" data-recognizable-object="H_EARTH_AUDRALIA_WORLD" aria-hidden="true"><div class="world-frame"><i class="atmosphere"></i><i class="far-peaks"></i><i class="near-peaks"></i><i class="shore"></i><i class="water"></i><i class="foreground"></i></div></div>`}
export function mountWorldLivingObject(root,options={}){
 if(!root||typeof root.replaceChildren!=='function')throw new TypeError('WORLD_ROOT_REQUIRED');ensureStyle(root.ownerDocument||document);const reduced=options.reducedMotion??globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;const wrap=(root.ownerDocument||document).createElement('div');wrap.innerHTML=markup();const node=wrap.firstElementChild;root.replaceChildren(node);let state='FOREGROUND_REST',token=0,timers=[];const clear=()=>{timers.forEach(clearTimeout);timers=[]};const phase=v=>node.dataset.worldPhase=v;const schedule=(fn,ms,t)=>timers.push(setTimeout(()=>{if(t===token)fn()},ms));
 function setState(next){if(!CONTRACT.lifecycle.includes(next))throw new Error(`WORLD_INVALID_STATE:${next}`);state=next;node.dataset.awardsLoState=next;return state}
 function stable(){setState('FOREGROUND_IDLE');if(!reduced)phase('rest')}
 function playSignature(){token++;clear();const t=token;setState('SIGNATURE_PLAY');if(reduced){phase('equivalent');return stable()}phase('rest');schedule(()=>phase('resolve'),360,t);schedule(()=>phase('rest'),2700,t);schedule(()=>stable(),3350,t);return t}
 function selectResponse(){token++;clear();setState('SELECT_RESPONSE');phase(reduced?'equivalent':'selected')}
 function readerOpen(){setState('READER_OPEN')}
 function restore(){token++;clear();setState('RETURN_RESTORING');phase(reduced?'equivalent':'rest');const t=token;schedule(()=>setState('FOREGROUND_REST'),reduced?0:380,t)}
 function setLifecycle(next){token++;clear();setState(next);phase(next==='REAR_INERT'?'rear':reduced?'equivalent':'rest')}
 function inspect(){return Object.freeze({contract:CONTRACT.id,cycle:CONTRACT.cycle,state,phase:node.dataset.worldPhase,reducedMotion:!!reduced,webglContexts:0,recognizableObject:CONTRACT.recognizableObject,signatureEvent:CONTRACT.signatureEvent,eventCount:1,sourceBinding:CONTRACT.sourceBinding,worldGrammar:CONTRACT.worldGrammar.slice()})}
 function destroy(){token++;clear();root.replaceChildren()}if(reduced)phase('equivalent');return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:node})
}
export {CONTRACT as AWARDS_WORLD_CYCLE_B_CONTRACT};
