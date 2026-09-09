export const CARD_LIFECYCLE_CONTRACT='DOOR_EXPLORE_CARD_LIFECYCLE_V1';
export const CARD_LIFECYCLE_ENTER_RATIO=.58;
export const CARD_LIFECYCLE_EXIT_RATIO=.42;

const finite=(n,f=0)=>Number.isFinite(Number(n))?Number(n):f;

export function reduceCardLifecycle(state,event){
  const s={active:Boolean(state?.active),epochMs:finite(state?.epochMs),generation:Math.max(0,Math.trunc(finite(state?.generation)))};
  if(event?.type==='ACTIVATE'){
    const now=Math.max(0,finite(event.nowMs));
    if(!s.active)return Object.freeze({active:true,epochMs:now,generation:s.generation+1});
  }
  if(event?.type==='DEACTIVATE'&&s.active)return Object.freeze({active:false,epochMs:s.epochMs,generation:s.generation});
  if(event?.type==='RESET'){
    const now=Math.max(0,finite(event.nowMs));
    return Object.freeze({active:s.active,epochMs:now,generation:s.generation+1});
  }
  return Object.freeze(s);
}

export function sampleCardLifecycle(state,nowMs){
  const now=Math.max(0,finite(nowMs));
  const epoch=Math.max(0,finite(state?.epochMs));
  const active=Boolean(state?.active);
  return Object.freeze({
    active,
    elapsedMs:active?Math.max(0,now-epoch):0,
    generation:Math.max(0,Math.trunc(finite(state?.generation)))
  });
}

export function createCardClock(root,{enterRatio=CARD_LIFECYCLE_ENTER_RATIO,exitRatio=CARD_LIFECYCLE_EXIT_RATIO}={}){
  const card=root?.closest?.('.route-card')||root||null;
  let state=Object.freeze({active:false,epochMs:0,generation:0});
  let lastRatio=0;
  const listeners=new Set();
  const emit=type=>{
    const detail=Object.freeze({contract:CARD_LIFECYCLE_CONTRACT,type,generation:state.generation,active:state.active,ratio:lastRatio});
    try{card?.dispatchEvent?.(new CustomEvent('dgb-card-lifecycle',{detail,bubbles:false}));}catch{}
    listeners.forEach(fn=>{try{fn(detail)}catch{}});
  };
  const activate=now=>{
    const next=reduceCardLifecycle(state,{type:'ACTIVATE',nowMs:now});
    if(next!==state){state=next;if(card?.dataset){card.dataset.cardLifecycle='active';card.dataset.cardLifecycleGeneration=String(state.generation)}emit('ACTIVATE')}
  };
  const deactivate=()=>{
    const next=reduceCardLifecycle(state,{type:'DEACTIVATE'});
    if(next!==state){state=next;if(card?.dataset)card.dataset.cardLifecycle='inactive';emit('DEACTIVATE')}
  };
  let observer=null;
  if(card&&typeof IntersectionObserver==='function'){
    observer=new IntersectionObserver(entries=>{
      const entry=entries[0];
      lastRatio=Math.max(0,Math.min(1,finite(entry?.intersectionRatio)));
      if(!state.active&&lastRatio>=enterRatio)activate(performance.now());
      else if(state.active&&lastRatio<=exitRatio)deactivate();
    },{threshold:[0,exitRatio,enterRatio,1]});
    observer.observe(card);
  }else{
    lastRatio=1;activate(typeof performance!=='undefined'?performance.now():0);
  }
  return Object.freeze({
    contract:CARD_LIFECYCLE_CONTRACT,
    sample(now=performance.now()){return sampleCardLifecycle(state,now)},
    reset(now=performance.now()){state=reduceCardLifecycle(state,{type:'RESET',nowMs:now});if(card?.dataset)card.dataset.cardLifecycleGeneration=String(state.generation);emit('RESET');return sampleCardLifecycle(state,now)},
    subscribe(fn){if(typeof fn!=='function')return()=>{};listeners.add(fn);return()=>listeners.delete(fn)},
    inspect(){return Object.freeze({...sampleCardLifecycle(state,typeof performance!=='undefined'?performance.now():0),ratio:lastRatio})},
    destroy(){observer?.disconnect();listeners.clear();if(card?.dataset){delete card.dataset.cardLifecycle;delete card.dataset.cardLifecycleGeneration}}
  });
}
