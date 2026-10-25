export const SCHEMA='diamondgate.intent-workspace.v1';
export const clean=s=>String(s??'').trim().replace(/\s+/g,' ');
export const clone=x=>JSON.parse(JSON.stringify(x));
export function blank(){return {title:'Untitled brief',category:'Websites & apps',original:'',request:'',destination:'',requirements:[],questions:'',notes:''};}
export function validateBrief(b){
  if(!b||typeof b!=='object'||Array.isArray(b))throw Error('Invalid brief.');
  for(const k of ['title','category','original','request','destination','questions','notes'])if(typeof b[k]!=='string'||b[k].length>30000)throw Error('Invalid or oversized '+k+'.');
  if(!Array.isArray(b.requirements)||b.requirements.length>100)throw Error('Invalid requirement list.');
  const ids=new Set();
  for(const r of b.requirements){if(!r||typeof r.id!=='string'||r.id.length>100||ids.has(r.id)||typeof r.text!=='string'||r.text.length>4000||!['protected','flexible','permitted'].includes(r.kind))throw Error('Invalid requirement.');ids.add(r.id);}
  return b;
}
export function changes(before,after){
  if(!before)return [];
  const out=[];const old=new Map(before.requirements.map(r=>[r.id,r]));
  for(const r of after.requirements){const p=old.get(r.id);if(!p)out.push({kind:r.kind==='protected'?'protected':'ordinary',text:'Added '+r.kind+' requirement: '+r.text});else if(clean(p.text)!==clean(r.text)||p.kind!==r.kind)out.push({kind:p.kind==='protected'||r.kind==='protected'?'protected':'ordinary',text:'Changed '+p.kind+' requirement “'+p.text+'” → '+r.kind+': “'+r.text+'”'});old.delete(r.id);}
  for(const r of old.values())out.push({kind:r.kind==='protected'?'protected':'ordinary',text:'Removed '+r.kind+' requirement: '+r.text});
  for(const k of ['request','destination','questions','notes','title','category'])if(clean(before[k])!==clean(after[k]))out.push({kind:k==='request'||k==='destination'?'uncertain':'ordinary',text:({request:'Working request changed. Review its meaning against every protected requirement.',destination:'Destination changed. Technical compatibility remains unverified.',questions:'Open decisions changed.',notes:'Reference notes changed.',title:'Brief title changed.',category:'Task category changed.'})[k]});
  return out;
}
export function check(b){return {missing:!clean(b.original)||!clean(b.request)||!clean(b.title)||b.requirements.some(r=>!clean(r.text)),open:!!clean(b.questions)};}
export function prepared(b,revision){return ['DIAMONDGATE — PORTABLE INTENT BRIEF',b.title,'Revision: '+revision,'','ORIGINAL REQUEST',b.original,'','WORKING REQUEST',b.request,'',...['protected','flexible','permitted'].flatMap(kind=>[({protected:'PROTECTED — change only with my explicit approval',flexible:'FLEXIBLE PREFERENCES',permitted:'PERMITTED CHANGES'})[kind],...b.requirements.filter(r=>r.kind===kind).map(r=>'- '+r.text),'']),'REFERENCE NOTES',b.notes||'None supplied.','','OPEN DECISIONS',b.questions||'None recorded by the user.','','DESTINATION',b.destination||'Not specified.','Technical compatibility: NOT VERIFIED.','Meaning and consistency require human review.','','HANDOFF','Preserve the original request and protected requirements. Surface proposed changes before acting. Do not treat this brief as authorization to execute or publish.'].join('\n');}
export function canonical(x){if(x===null||typeof x!=='object')return JSON.stringify(x);if(Array.isArray(x))return '['+x.map(canonical).join(',')+']';return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}';}
export async function digest(x){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(x))))].map(v=>v.toString(16).padStart(2,'0')).join('');}
export async function pack(workspace){return {schema:SCHEMA,payload:clone(workspace),sha256:await digest(workspace)};}
export async function unpack(envelope){
  if(envelope?.schema!==SCHEMA||typeof envelope.sha256!=='string'||await digest(envelope.payload)!==envelope.sha256)throw Error('This handoff is unsupported or its checksum does not match. Your current work was kept.');
  const w=envelope.payload;if(!w||typeof w!=='object'||typeof w.id!=='string'||w.id.length>100||!Array.isArray(w.history)||w.history.length>30)throw Error('Invalid workspace.');
  validateBrief(w.draft);let original=w.draft.original;
  for(const h of w.history){if(!h||!Number.isInteger(h.number)||typeof h.at!=='string'||typeof h.reason!=='string'||h.reason.length>4000)throw Error('Invalid revision history.');validateBrief(h.brief);if(h.brief.original!==original)throw Error('The original request differs across revisions.');}
  if(w.history.some((h,i)=>h.number!==i+1))throw Error('Revision sequence is invalid.');
  return {id:w.id,draft:clone(w.draft),history:clone(w.history),imported:true};
}
