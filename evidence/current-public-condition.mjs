import { evaluateSite } from '/evidence/readiness/bt4-site-governance/site-entitlement.v1.mjs';

const root=document.querySelector('[data-current-public-condition]');
if(root){
 const aggregate=root.querySelector('[data-condition-state]');
 const objects=root.querySelector('[data-condition-objects]');
 const inspect=root.querySelector('[data-condition-inspect]');
 const error=root.querySelector('[data-condition-error]');
 const yes=v=>v?'Valid':'Not established';
 const restoration=x=>{
   const s=x.state||{};
   if(x.entitlement.served==='QUALIFIED')return 'No restoration required. Current qualification remains admitted.';
   if(!s.provenance)return 'Restore source/artifact identity, then obtain fresh qualification for the current epoch.';
   if(!s.reproduction)return 'Restore required execution or reproduction, then obtain fresh qualification.';
   if(s.evidence==='contradictory')return 'Resolve the adverse evidence under the governing evidence contract before requalification.';
   if(!s.authority)return 'Restore the required authority before the stronger public state can return.';
   if(Number(s.receiptEpoch)!==Number(s.epoch))return 'Issue a fresh qualification receipt for the current epoch.';
   return 'Satisfy the governing qualification conditions and issue fresh admissible proof.';
 };
 const preserved=x=>{
   const s=x.state||{}, kept=[];
   if(s.provenance)kept.push('identity'); if(s.reproduction)kept.push('execution/reproduction');
   if(s.evidence==='supporting')kept.push('supporting evidence'); if(s.authority)kept.push('authority');
   if(Number(s.receiptEpoch)===Number(s.epoch))kept.push('current receipt');
   return kept.length?kept.join(', '):'No stronger authority inferred.';
 };
 const show=x=>{
   inspect.innerHTML=`<h3>${x.label} · ${x.entitlement.served}</h3><p>${x.entitlement.reason}</p><div class="condition-facts"><div class="condition-fact"><strong>Why this state</strong><span>${x.entitlement.blocked?'The requested stronger representation is blocked by current entitlement.':'The current supporting conditions admit this representation.'}</span></div><div class="condition-fact"><strong>Authority still valid</strong><span>${preserved(x)}</span></div><div class="condition-fact"><strong>What restores it</strong><span>${restoration(x)}</span></div></div>`;
   objects.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.object===x.id)));
 };
 try{
   const result=await evaluateSite();
   aggregate.textContent=result.siteState;
   root.dataset.ready='true';
   root.dataset.aggregate=result.siteState;
   document.documentElement.dataset.currentPublicCondition=result.siteState;
   result.objects.forEach((x,i)=>{
     const b=document.createElement('button'); b.type='button'; b.className='condition-object'; b.dataset.object=x.id; b.dataset.served=x.entitlement.served; b.setAttribute('aria-selected',String(i===0));
     b.innerHTML=`<small>${x.id}</small><strong>${x.label}</strong><span>${x.entitlement.served}</span>`;
     b.addEventListener('click',()=>show(x)); objects.append(b);
   });
   const restricting=result.objects.find(x=>x.entitlement.served!=='QUALIFIED');
   show(restricting||result.objects[0]);
 }catch(e){
   aggregate.textContent='RESTRICTED'; root.dataset.ready='error'; error.textContent='Current condition could not be fully established. The public surface remains restricted rather than inferring a stronger state.';
   document.documentElement.dataset.currentPublicCondition='RESTRICTED';
 }
}