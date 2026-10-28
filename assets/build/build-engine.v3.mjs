const fill=(s='',x={})=>String(s).replace(/\{(\w+)\}/g,(_,k)=>x[k]??'');
export function initial(){return {cursor:'WELCOME',queue:[],records:[],history:[],sharedIndex:0,route:null,purposePath:'root',contact:{name:'',email:'',phone:''},sufficiencyOffered:false,deepMode:false};}
export function validName(v){return String(v||'').trim().replace(/[^\p{L}\p{N}]/gu,'').length>=2}
export function validEmail(v){return /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(String(v||'').trim())}
export function phoneDigits(v){return String(v||'').replace(/\D/g,'')}
export function validPhone(v){return phoneDigits(v).length===10}
export function formatPhone(v){const x=phoneDigits(v).slice(0,10);return x.length===10?`(${x.slice(0,3)}) ${x.slice(3,6)}-${x.slice(6)}`:x}
export function node(m,id){if(id==='ENTRY')return {id:'ENTRY',prompt:m.entry.prompt,multi:false,options:m.entry.choices.map((o,i)=>({...o,id:'entry_'+i,status:'confirmed',kind:'business_fact',scope:'inherit'}))};const n=m.nodes?.[id]||m.inputNodes?.[id]||m.states?.[id];return n?{...n,id}:null;}
// A question belongs to its business purpose, not to the particular button that
// happened to enqueue it. Only demonstrably equivalent sibling purposes fold.
function canonicalPurpose(id,purpose='root'){
 if(id.startsWith('SH.')&&id!=='SH.HANDOFF')return 'shared';
 if(id==='PRIVATE_FIELDS')return purpose.replace(/\/?private_event_0[123]$/,'')||'root';
 if(id==='EDITOR')return purpose.replace(/\/?publish_0[14]$/,'')||'root';
 return purpose;
}
export function questionKey(s,n){return [s.route||'UNSET',canonicalPurpose(n.id,s.purposePath||'root'),n.id].join('/');}
export const recordKey=questionKey;
function recordIdentity(s,r){return r.questionKey||questionKey({...s,purposePath:r.purposePath||'root'},{id:r.node});}
export function answered(s,n){const key=questionKey(s,n);return (s.records||[]).find(r=>recordIdentity(s,r)===key);}
function contextLabel(m,purpose,id){
 const canonical=canonicalPurpose(id,purpose),labels=[];
 for(const n of Object.values(m.nodes||{}))for(const o of n.options||[]){const at=canonical.indexOf(o.id);if(at>=0&&(at===0||canonical.slice(0,at).endsWith('root')||canonical[at-1]==='/')&&(at+o.id.length===canonical.length||canonical[at+o.id.length]==='/'))labels.push({at,label:o.label});}
 return labels.sort((a,b)=>a.at-b.at).map(x=>x.label).slice(-2).join(' / ');
}
function activate(m,s,q){const id=typeof q==='string'?q:q.id;s.purposePath=typeof q==='string'?s.purposePath:q.purpose||'root';s.contextLabel=contextLabel(m,s.purposePath,id);return id;}
function enqueueUnique(m,s,items){
 for(const item of items){const key=questionKey({...s,purposePath:item.purpose},{id:item.id});if(answered({...s,purposePath:item.purpose},{id:item.id}))continue;
 const existing=s.queue.find(q=>questionKey({...s,purposePath:typeof q==='string'?s.purposePath:q.purpose},{id:typeof q==='string'?q:q.id})===key);
 if(!existing)s.queue.push(item);
 }
}
export function nextAfterReturn(m,s){
 while(s.queue.length){const id=activate(m,s,s.queue.shift());if(!answered(s,{id}))return id;}
 while(s.sharedIndex<(m.sharedSequence||[]).length){const id=m.sharedSequence[s.sharedIndex++];s.purposePath='root';s.contextLabel='';if(!answered(s,{id}))return id;}
 return 'REVIEW';
}
export function resolveNext(m,s,id){if(!id||id==='RETURN')return nextAfterReturn(m,s);s.contextLabel=contextLabel(m,s.purposePath,id);return answered(s,{id})?nextAfterReturn(m,s):id;}
function storeRecord(m,s,n,data){
 const key=questionKey(s,n),existing=answered(s,n);if(existing)return existing;
 const r={key,questionKey:key,node:n.id,field:n.field||'context.route',section:n.emailSection||'Business facts',kind:n.kind||'business_fact',question:contextualPrompt(n,{...s,contextLabel:contextLabel(m,s.purposePath,n.id)}),purposePath:s.purposePath,contextLabel:contextLabel(m,s.purposePath,n.id),...data};s.records.push(r);return r;
}
export function applyOption(m,s,n,o){
 if(answered(s,n))return nextAfterReturn(m,s);
 storeRecord(m,s,n,{kind:o.kind||n.kind||'business_fact',status:o.status||'confirmed',label:o.label,value:o.record,optionId:o.id});
 if(n.id==='ENTRY'){const mm=String(o.record||'').match(/context\.route=(.+)/);if(mm)s.route=mm[1]}
 else if(n.id==='HOSPITALITY'&&o.status==='confirmed'){if(o.next==='REST.INTENT')s.route='REST';else if(o.next==='STAY.INTENT')s.route='STAY'}
 else if((n.id==='CLARIFY'||n.id==='FORMAT')&&o.status==='confirmed'){const route=String(o.next||'').split('.')[0];if(['BUS','PRO','CRE','PORT','COM','SHOP','APP','SPACE'].includes(route))s.route=route}
 if(o.scope?.startsWith('child:'))s.purposePath+=(s.purposePath==='root'?'':'/')+o.scope.slice(6);
 return resolveNext(m,s,o.next);
}
export function optionLabel(n,o,s){const reuse=s.inquiryReuse?.[questionKey(s,n)];if(reuse?.sharedDate&&o.id==='catering_fields_03')return 'Preferred serving time (date already included)';if(reuse?.sharedDate&&o.id==='private_fields_02')return 'Event duration (date already included)';return o.label;}
export function inheritedOptions(s,n){return s.inquiryReuse?.[questionKey(s,n)]?.optionIds||[];}
export function applyMulti(m,s,n,ids){
 if(answered(s,n))return nextAfterReturn(m,s);
 const chosen=[...new Set(ids)].map(id=>n.options.find(o=>o.id===id)).filter(Boolean),ex=chosen.find(o=>o.exclusive),inherit=s.inquiryReuse?.[questionKey(s,n)];
 const selected=ex?[ex]:chosen,inherited=(inherit?.optionIds||[]).map(id=>n.options.find(o=>o.id===id)).filter(Boolean);
 const final=(inherited.length||inherit?.sharedDate)?[...new Map([...inherited,...selected.filter(o=>!o.exclusive)].map(o=>[o.id,o])).values()]:selected;
 storeRecord(m,s,n,{status:final.some(o=>o.status==='unknown')?'unknown':final.some(o=>o.status==='declined')?'declined':'confirmed',label:[...(inherit?.sharedDate?['Date (reused from the earlier inquiry)']:[]),...final.map(o=>o.label)].join(', '),value:[...(inherit?.sharedDate?['Date']:[]),...final.map(o=>o.record)],optionIds:final.map(o=>o.id),...(inherit?{reusedFrom:inherit.sourceKey,reusedOptionIds:inherit.optionIds,reusedDate:!!inherit.sharedDate,additionalStatus:ex?.status||'confirmed'}:{})});
 const children=[];for(const o of final)if(o.status==='confirmed'&&o.next&&o.next!=='RETURN')children.push({id:o.next,purpose:o.scope?.startsWith('child:')?s.purposePath+(s.purposePath==='root'?'':'/')+o.scope.slice(6):s.purposePath});
 for(const a of n.appendAfter||[])children.push({id:a,purpose:s.purposePath});enqueueUnique(m,s,children);return nextAfterReturn(m,s);
}
export function recordAnswer(m,s,n,value,status='confirmed'){
 storeRecord(m,s,n,{status,label:value,value});return resolveNext(m,s,n.next||'RETURN');
}
function overlapIds(target,source){
 const ids=new Set(source.optionIds||[]),out=[];
 if(target==='CATERING_FIELDS'&&source.node==='PRIVATE_FIELDS'){
  if(ids.has('private_fields_01'))out.push('catering_fields_01','catering_fields_02');
  if(ids.has('private_fields_03'))out.push('catering_fields_04');
  if(ids.has('private_fields_04'))out.push('catering_fields_05');
 }else if(target==='PRIVATE_FIELDS'&&source.node==='CATERING_FIELDS'){
  if(ids.has('catering_fields_01')&&ids.has('catering_fields_02'))out.push('private_fields_01');
  if(ids.has('catering_fields_05'))out.push('private_fields_04');
 }
 return out;
}
export function reusableAnswer(m,s,n){
 if(answered(s,n)||s.inquiryReuse?.[questionKey(s,n)])return null;
 const records=(s.records||[]).filter(r=>r.status==='confirmed'&&recordIdentity(s,r)!==questionKey(s,n));
 if(['PRIVATE_FIELDS','CATERING_FIELDS'].includes(n.id))for(const record of [...records].reverse()){
  const optionIds=overlapIds(n.id,record),sharedDate=(n.id==='CATERING_FIELDS'&&record.node==='PRIVATE_FIELDS'&&record.optionIds?.includes('private_fields_02'))||(n.id==='PRIVATE_FIELDS'&&record.node==='CATERING_FIELDS'&&record.optionIds?.includes('catering_fields_03'));if(optionIds.length||sharedDate)return {record,optionIds,sharedDate:!!sharedDate,summary:[...optionIds.map(id=>n.options.find(o=>o.id===id)?.label).filter(Boolean),...(sharedDate?['Date']:[])].join(', '),partial:true};
 }
 // Reuse is an explicit visitor choice. Service references are only reusable
 // once the actual public name/link is present, never just an "add now" choice.
 if(n.id==='SYSTEM')return null;
 const record=[...records].reverse().find(r=>r.node===n.id&&(r.optionIds?.length||r.optionId||r.value));
 if(!record)return null;
 const optionIds=record.optionIds||[];return {record,optionIds,summary:record.label||String(record.value||''),partial:false};
}
export function reuseAnswer(m,s,n,proposal){
 if(!proposal?.record)return null;const sourceKey=recordIdentity(s,proposal.record),targetKey=questionKey(s,n);
 if(proposal.partial){s.inquiryReuse??={};s.inquiryReuse[questionKey(s,n)]={optionIds:[...proposal.optionIds],sourceKey,sharedDate:!!proposal.sharedDate};return null;}
 let next;if(n.multi)next=applyMulti(m,s,n,proposal.optionIds);else if(n.options){const o=n.options.find(o=>o.id===proposal.record.optionId);if(!o)return null;next=applyOption(m,s,n,o);}else next=recordAnswer(m,s,n,proposal.record.value);
 const target=s.records.find(r=>r.questionKey===targetKey);if(target)target.reusedFrom=sourceKey;return next;
}
export function ack(n,opts){if(!Array.isArray(opts))return opts.reply||'';return opts.every(o=>o.status==='declined')?'We’ll leave those features out for now.':opts.every(o=>o.status==='unknown')?'We’ll mark that as something to discuss.':'I’ve noted '+opts.map(o=>o.label).join(', ')+'.';}
const critical=new Set(['BUS.ACTIVITY','PRO.ACTIVITY','CRE.ACTIVITY','PORT.ACTIVITY','HOSPITALITY','COM.ACTIVITY','BUS.INTENT','PRO.INTENT','CRE.INTENT','PORT.INTENT','REST.INTENT','STAY.INTENT','COM.INTENT','SHOP.INTENT','APP.INTENT','SPACE.INTENT','CLARIFY','FORMAT','SH.EXISTING']);
export function nodeDepth(id){return critical.has(id)?'QUALIFICATION_CRITICAL':id.startsWith('SH.')?'CONDITIONAL_QUALIFICATION':'DEEP_SCOPING'}
export function readiness(s){const contact=validName(s.contact?.name)&&validEmail(s.contact?.email)&&validPhone(s.contact?.phone),hasRoute=!!s.route&&s.route!=='unknown'&&s.route!=='pending_hospitality',hasSubtype=s.records.some(r=>/\.ACTIVITY$|HOSPITALITY/.test(r.node)&&r.status==='confirmed'),hasFunction=s.records.some(r=>/\.INTENT$/.test(r.node)&&r.status==='confirmed'),hasOperational=s.records.some(r=>r.status==='confirmed'&&(r.kind==='future_customer_field'||(r.kind==='website_requirement'&&nodeDepth(r.node)==='DEEP_SCOPING'&&!['APPOINTMENT','VOLUNTEER'].includes(r.node)))),hasStart=s.records.some(r=>r.node==='SH.EXISTING');return {contact,hasRoute,hasSubtype:hasSubtype||['SHOP','APP','SPACE'].includes(s.route),hasFunction,hasOperational,hasStart}}
export function needsStartingPoint(s){const x=readiness(s);return x.contact&&x.hasRoute&&x.hasSubtype&&x.hasFunction&&x.hasOperational&&!x.hasStart}
export function sufficient(s){const x=readiness(s);return Object.values(x).every(Boolean)&&['SH.DOMAIN','SH.ASSETS','SH.TIMING'].every(id=>s.records.some(r=>r.node===id))&&!s.queue.length}
export function brief(s,m){
 const groups=new Map([['Contact',[[s.contact?.name,s.contact?.email,s.contact?.phone&&formatPhone(s.contact.phone)].filter(Boolean).join(' · ')]]]);
 const topics={'ENTRY':'Website type','SH.EXISTING':'Starting point','SH.DOMAIN':'Domain','SH.ASSETS':'Content readiness','SH.TIMING':'Timing','SH.READINESS':'Next step','SH.PRESERVE':'Keep from the current website','SH.STYLE':'Presentation preference'};
 for(const r of s.records){const section=r.status==='unknown'?'Decisions still open':r.section||'Project details';if(!groups.has(section))groups.set(section,[]);
 const topic=topics[r.node]||r.question||node(m||{nodes:{}},r.node)?.prompt||(/\.INTENT$/.test(r.node)?'What visitors should be able to do':/\.ACTIVITY$/.test(r.node)?'Business or project focus':'Project detail');
 const answer=(!r.optionId&&!r.optionIds&&typeof r.value==='string'&&!r.value.startsWith('context.route='))?r.value:r.label||'Not specified';groups.get(section).push(topic+': '+answer+(r.status==='unknown'?' — to discuss':r.status==='declined'?' — not requested':'')+(r.additionalStatus==='unknown'?' — additional fields to discuss':''));
 }
 return [...groups].filter(([,v])=>v.some(Boolean)).map(([k,v])=>k+'\n'+v.filter(Boolean).map(x=>'• '+x).join('\n')).join('\n\n');
}
export function contextualPrompt(n,s,m){
 const redesign=s.records.some(r=>r.node==='SH.EXISTING'&&/redesign|Improve/i.test(r.label));
 if(n.id==='SH.DOMAIN')return redesign?'Will we keep your current website’s domain, or use a different one?':n.prompt;
 if(n.id==='SH.ASSETS'){const what={REST:'menus, photos and business information',SHOP:'product descriptions, prices and photos',SPACE:'images, plans or other material for the experience',PRO:'service descriptions, credentials and team information',COM:'your organization’s story, programs and photos'}[s.route]||'text, images and business information';return 'How much of your '+what+' is ready?';}
 const label=s.contextLabel||(m?contextLabel(m,s.purposePath||'root',n.id):'');
 if(n.id==='INPUT.RULES')return fill(n.prompt,{selected_rule:label.split(' / ').at(-1)||'selected ordering rule'});
 if(s.inquiryReuse?.[questionKey(s,n)])return n.id==='CATERING_FIELDS'?'What else should the catering inquiry include?':'What else should the private-event inquiry include?';
 const sharedModules=new Set(['SYSTEM','INPUT.SYSTEM','PAYMENT','RULE_SOURCE','VISUAL_ASSETS','EDITOR','MEDIA_SOURCE','COMMISSION','ACCESS','SH.HANDOFF']);
 return label&&sharedModules.has(n.id)?n.prompt+' For: '+label+'.':n.prompt;
}
