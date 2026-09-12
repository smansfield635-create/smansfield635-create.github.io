const CONTRACT = Object.freeze({
  id: 'AWARDS_EXPERIENCE_LIVING_OBJECT_CYCLE_A_V1',
  cycle: 'A_EXPERIENCE',
  claim: 'A website can behave like a place.',
  sourceBinding: Object.freeze({
    governingHead: '751b93edbd662573231b651e2f915c3a5882a942',
    compassController: Object.freeze({path:'/assets/compass/compass.controller.js', blob:'568a6b2cd608a4cbcd62cf70ed59b241c39c90d2'}),
    compassGeometry: Object.freeze({path:'/assets/compass/upstream-compass.geometry.js', blob:'fe35d8d844859a6af810684ace53d2c65258522f'}),
    compassRenderer: Object.freeze({path:'/assets/compass/upstream-compass.renderer.js', blob:'965376dd8a92686bc7008d1fea4846b5f8300872'}),
    mirrorlandWindow: Object.freeze({path:'/assets/compass/compass.mirrorland-window.js', blob:'f99d3ffedf7b7654d067d21d9363eb287877f852'})
  }),
  spatialGrammar: Object.freeze([
    'FOUR_CARDINAL_SPHERICAL_CONSTELLATION',
    'CARDINAL_FOCUS_TO_ROOM_CLUSTER',
    'ROOM_SELECTION',
    'MIRRORLAND_REVEAL_AND_FOCUS',
    'EXACT_RESTORATION'
  ]),
  lifecycle: Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

const wings = [
  {id:'north', label:'N', x:0, y:-35, z:54, rx:-18, ry:0},
  {id:'east', label:'E', x:38, y:1, z:-4, rx:4, ry:58},
  {id:'south', label:'S', x:0, y:34, z:-52, rx:18, ry:180},
  {id:'west', label:'W', x:-38, y:1, z:-4, rx:4, ry:-58}
];

function markup(){
  const nodes = wings.map((w,i)=>`<div class="exp-node exp-node--${w.id}" data-exp-wing="${w.id}" style="--x:${w.x}%;--y:${w.y}%;--z:${w.z}px;--rx:${w.rx}deg;--ry:${w.ry}deg;--delay:${i*38}ms"><div class="exp-crystal"><i></i><i></i><i></i><i></i><span>${w.label}</span></div></div>`).join('');
  const rooms = ['01','02','03','04'].map((n,i)=>`<div class="exp-room exp-room--${i+1}" data-exp-room="${i+1}"><i></i><span>${n}</span></div>`).join('');
  return `<div class="awards-lo awards-lo--experience" data-awards-lo="experience" data-awards-lo-state="FOREGROUND_REST" data-exp-phase="rest" aria-hidden="true">
    <div class="exp-atmosphere"><i></i><i></i><i></i></div>
    <div class="exp-space">
      <div class="exp-horizon exp-horizon--outer"></div><div class="exp-horizon exp-horizon--inner"></div>
      <div class="exp-field" data-exp-field>
        <div class="exp-route exp-route--a"></div><div class="exp-route exp-route--b"></div>
        ${nodes}
        <div class="exp-core"><div class="exp-core__halo"></div><div class="exp-core__ring exp-core__ring--a"></div><div class="exp-core__ring exp-core__ring--b"></div><div class="exp-core__point"></div></div>
        <div class="exp-cluster" data-exp-cluster>${rooms}<div class="exp-cluster__axis"></div></div>
      </div>
      <div class="exp-threshold" data-exp-threshold><div class="exp-threshold__frame"><div class="exp-threshold__glass"></div><div class="exp-threshold__line"></div></div></div>
      <div class="exp-depth-mark exp-depth-mark--near"></div><div class="exp-depth-mark exp-depth-mark--far"></div>
    </div>
  </div>`;
}

export function mountExperienceLivingObject(root, options={}){
  if(!root || typeof root.replaceChildren !== 'function') throw new TypeError('EXPERIENCE_ROOT_REQUIRED');
  const reduced = options.reducedMotion ?? globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = markup();
  const node = wrapper.firstElementChild;
  root.replaceChildren(node);
  let state='FOREGROUND_REST', token=0, timers=[];
  const phase = value => { if(node) node.dataset.expPhase=value; };
  const schedule=(fn,ms,t)=>{const id=setTimeout(()=>{if(t===token)fn()},ms);timers.push(id)};
  const clear=()=>{timers.forEach(clearTimeout);timers=[]};
  function setState(next){ if(!CONTRACT.lifecycle.includes(next)) throw new Error(`EXPERIENCE_INVALID_STATE:${next}`); state=next; node.dataset.awardsLoState=next; return state; }
  function stable(){ phase(reduced?'equivalent':'idle'); setState('FOREGROUND_IDLE'); }
  function playSignature(){
    token++; clear(); const t=token; setState('SIGNATURE_PLAY');
    if(reduced){ phase('equivalent'); return stable(); }
    phase('orient');
    schedule(()=>phase('cluster'),680,t);
    schedule(()=>phase('select'),1580,t);
    schedule(()=>phase('threshold'),2420,t);
    schedule(()=>phase('travel'),3300,t);
    schedule(()=>phase('restore'),4050,t);
    schedule(()=>stable(),4920,t);
    return t;
  }
  function selectResponse(){token++;clear();setState('SELECT_RESPONSE');phase(reduced?'selected-equivalent':'selected');}
  function readerOpen(){setState('READER_OPEN');}
  function restore(){token++;clear();setState('RETURN_RESTORING');phase(reduced?'equivalent':'restore');const t=token;schedule(()=>{phase('rest');setState('FOREGROUND_REST')},reduced?0:460,t);}
  function setLifecycle(next){ token++; clear(); setState(next); if(next==='REAR_INERT')phase('rear'); else if(next==='APPROACHING')phase('approach'); else if(next==='FOREGROUND_REST')phase('rest'); else if(next==='FOREGROUND_IDLE')phase('idle'); }
  function inspect(){return Object.freeze({contract:CONTRACT.id,cycle:CONTRACT.cycle,state,phase:node.dataset.expPhase,reducedMotion:!!reduced,webglContexts:0,sourceBinding:CONTRACT.sourceBinding,spatialGrammar:CONTRACT.spatialGrammar.slice()});}
  function destroy(){token++;clear();root.replaceChildren();}
  if(reduced) phase('equivalent');
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:node});
}

export { CONTRACT as AWARDS_EXPERIENCE_CYCLE_A_CONTRACT };
