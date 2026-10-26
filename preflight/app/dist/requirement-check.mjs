import {progressSnapshot,validateProgress} from './progress-record.mjs';

export const CHECK_LIMIT='Checks run locally against supplied records. Evidence references and reported test outcomes are not independently authenticated.';
// This is an explanation of the existing progress engine, not a second planner.
export function requirementCheck(p,record=p.progress){
 const binding={projectId:p.id,baseline:p.checkpoints.at(-1).id};
 if(!record)return {schema:'DIAMONDGATE_REQUIREMENT_CHECK_v1',...binding,scope:'SAVED_RECORD',result:'UNMAPPED',rows:[],unresolved:0,unassigned:[],limitation:CHECK_LIMIT,notice:'No structured requirement map is available. Requirement coverage is unverified; use the existing setup prompt.'};
 validateProgress(record);
 const snapshot=progressSnapshot(record);
 const rows=snapshot.rows.map(r=>{
  let status='UNVERIFIED',reason='A current result and a matching passing check are still needed.';
  if(r.check?.outcome==='FAIL'||r.decision?.value==='REJECTED'){status='CONTRADICTED';reason=r.decision?.value==='REJECTED'?'You rejected the current result.':'The current result has a reported failing check.';}
  else if(!r.events.length){status='MISSING';reason='No evidence is linked to this requirement in the saved record plus the reviewed response.';}
  else if(r.status==='BLOCKED_DEPENDENCY')reason='Prerequisite requirements are unresolved: '+r.dependsOn.join(', ')+'.';
  else if(r.staleDependencies.length)reason='Earlier support needs rechecking because prerequisite results changed: '+r.staleDependencies.join(', ')+'.';
  else if(r.evidenceRequest)reason='Additional evidence requested by you: '+(r.evidenceRequest.note||'Provide evidence for the current result.');
  else if(r.check?.outcome==='PASS'){status='SUPPORTED';reason='A reported PASS matches the current result, artifact and recorded criterion.';}
  const evidence=[r.result,r.check].filter(Boolean).map(e=>({id:e.id,kind:e.kind,details:e.details,reference:e.reference,artifact:e.artifact,source:e.source}));
  if(!evidence.length)for(const e of r.events.slice(-2))evidence.push({id:e.id,kind:e.kind,details:e.details,reference:e.reference,source:e.source});
  return {id:r.id,text:r.text,criterion:r.criterion,status,reason,evidence,satisfied:r.satisfied,humanReview:r.review==='REQUIRED'?(r.decision?.value||'PENDING'):'NOT_REQUIRED',next:r.id===snapshot.next?.id};
 });
 return {schema:'DIAMONDGATE_REQUIREMENT_CHECK_v1',...binding,scope:'SAVED_RECORD',result:'CHECKED',rows,unresolved:rows.filter(r=>!r.satisfied).length,unassigned:snapshot.unassigned.map(e=>({id:e.id,requirement:e.requirement,reference:e.reference})),limitation:CHECK_LIMIT};
}
export function requirementCheckContext(p){
 const receipt=requirementCheck(p);
 if(receipt.result==='UNMAPPED')return '';
 const pending=receipt.rows.filter(r=>!r.satisfied),kept=receipt.rows.filter(r=>r.satisfied);
 return 'REQUIREMENT CHECK — LOCAL RECORD CORRESPONDENCE\n'+receipt.limitation+'\n'+pending.map(r=>r.id+' · '+r.status+(r.status==='SUPPORTED'?' (source-reported; human review pending)':'')+' · '+r.reason).join('\n')+'\nPreserve satisfied requirements: '+(kept.map(r=>r.id).join(', ')||'None yet')+'. Do not repeat their work without changed evidence.\nUnassigned evidence: '+(receipt.unassigned.map(e=>e.id).join(', ')||'None')+'.\nFollow the existing next action; these findings grant no new permission.';
}
