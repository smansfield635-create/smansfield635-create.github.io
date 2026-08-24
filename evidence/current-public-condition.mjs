import { evaluateSite } from '/evidence/readiness/bt4-site-governance/site-entitlement.v1.mjs';

const root=document.querySelector('[data-current-public-condition]');
if(root){
  const stateEl=root.querySelector('[data-condition-state]');
  const objectsEl=root.querySelector('[data-condition-objects]');
  const inspection=root.querySelector('[data-condition-inspection]');
  const detailEl=root.querySelector('[data-condition-detail]');
  const close=root.querySelector('[data-condition-close]');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const conditionText=o=>o.entitlement.reason;
  const preserved=o=>{
    const s=o.state; const ok=[];
    if(s.provenance)ok.push('source identity');
    if(s.reproduction)ok.push('required execution');
    if(s.evidence==='supporting')ok.push('supporting evidence');
    if(s.authority)ok.push('authority');
    if(s.receiptEpoch===s.epoch)ok.push('current qualification receipt');
    return ok.length?ok.join(', '):'No stronger authority is currently preserved by this projection.';
  };
  const missing=o=>{
    const s=o.state; const out=[];
    if(!s.provenance)out.push('valid source identity');
    if(!s.reproduction)out.push('successful required execution');
    if(s.evidence!=='supporting')out.push('supporting evidence');
    if(!s.authority)out.push('required authority');
    if(s.receiptEpoch!==s.epoch)out.push('fresh qualification receipt');
    return out.length?out.join(', '):'No missing condition at the current qualified state.';
  };
  const restoration=o=>o.entitlement.served==='QUALIFIED'?'No restoration is required.':`Restore ${missing(o)}; then the object must be evaluated again before stronger public representation is permitted.`;
  function inspect(o){
    detailEl.innerHTML=`<div class="condition-detail"><article><p class="kicker">Current state</p><h3>${esc(o.label)} · ${esc(o.entitlement.served)}</h3><p>${esc(conditionText(o))}</p></article><article><p class="kicker">Still valid</p><h3>Preserved authority</h3><p>${esc(preserved(o))}</p></article><article><p class="kicker">Missing or limiting</p><h3>What prevents a stronger state</h3><p>${esc(missing(o))}</p></article><article><p class="kicker">Restoration</p><h3>What would permit recovery</h3><p>${esc(restoration(o))}</p></article></div>`;
    inspection.hidden=false;
    inspection.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  close?.addEventListener('click',()=>{inspection.hidden=true;detailEl.replaceChildren();root.scrollIntoView({behavior:'smooth',block:'start'});});
  try{
    const result=await evaluateSite();
    stateEl.textContent=result.siteState;
    stateEl.dataset.state=result.siteState;
    root.dataset.siteState=result.siteState;
    objectsEl.replaceChildren(...result.objects.map(o=>{
      const b=document.createElement('button');
      b.type='button';b.className='condition-object';b.dataset.object=o.id;b.dataset.state=o.entitlement.served;
      b.innerHTML=`<span class="state">${esc(o.entitlement.served)}</span><strong>${esc(o.label)}</strong><p>${esc(o.entitlement.reason)}</p>`;
      b.addEventListener('click',()=>inspect(o));
      return b;
    }));
    window.__CURRENT_PUBLIC_CONDITION__={schema:'CURRENT_PUBLIC_CONDITION_SURFACE_v1',siteState:result.siteState,objects:result.objects.map(o=>({id:o.id,state:o.entitlement.served}))};
    dispatchEvent(new CustomEvent('CURRENT_PUBLIC_CONDITION_READY',{detail:window.__CURRENT_PUBLIC_CONDITION__}));
  }catch(error){
    stateEl.textContent='UNAVAILABLE';stateEl.dataset.state='RESTRICTED';root.dataset.siteState='UNAVAILABLE';
    objectsEl.innerHTML='<p>Current condition could not be established. No stronger public state is inferred.</p>';
    console.error(error);
  }
}
