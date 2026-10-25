// History segments belong to the original project. Moving records is bookkeeping,
// never a checkpoint, completed milestone, permission grant or new project.
export const allCheckpoints=p=>[...(p.archives||[]).flatMap(s=>s.checkpoints),...p.checkpoints];
export const allActivity=p=>[...(p.archives||[]).flatMap(s=>s.activity),...(p.flow?.log||[])];
export function archiveHistory(p,{cycle=false,at=new Date().toISOString()}={}){
 const moveCheckpoints=cycle||p.checkpoints.length>=50;
 const moveActivity=cycle||(p.flow?.log.length||0)>=200;
 const checkpoints=moveCheckpoints?p.checkpoints.splice(0,Math.max(0,p.checkpoints.length-1)):[];
 const activity=moveActivity?p.flow.log.splice(0,Math.max(0,p.flow.log.length-1)):[];
 if(!checkpoints.length&&!activity.length&&!cycle)return null;
 const segment={at,reason:cycle?'CYCLE':'CAPACITY',checkpoints,activity};
 if(cycle)segment.closed={baseline:p.checkpoints.at(-1).id,status:p.flow.status,userDecision:structuredClone(p.flow.userDecision||null)};
 (p.archives||=[]).push(segment);
 return segment;
}
export function validateArchives(p){
 if(p.archives===undefined)return;
 if(!Array.isArray(p.archives)||p.archives.length>10000)throw Error('Invalid archived history.');
 for(const s of p.archives){
  if(!s||!['CYCLE','CAPACITY'].includes(s.reason)||typeof s.at!=='string'||!Number.isFinite(Date.parse(s.at))||!Array.isArray(s.checkpoints)||s.checkpoints.length>49||!Array.isArray(s.activity)||s.activity.length>199)throw Error('Invalid history segment.');
  if((s.reason==='CYCLE'&&!s.closed)||(s.reason!=='CYCLE'&&s.closed)||(s.closed&&(!s.closed.baseline||s.closed.status!=='COMPLETE')))throw Error('Invalid cycle closure.');
  for(const r of s.activity)if(!r||typeof r.id!=='string'||typeof r.at!=='string'||typeof r.raw!=='string'||r.raw.length>180000)throw Error('Invalid archived activity.');
 }
}
