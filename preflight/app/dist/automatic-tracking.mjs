import {parsePacket} from './packet.mjs';
import {readProgressRows} from './progress-wire.mjs';
import {allActivity,allCheckpoints} from './history.mjs';
// Automatic, conservative projection of existing records. No inferred approval,
// completion or semantic evidence-to-requirement association.
const known=s=>typeof s==='string'&&s.trim()&&!/^(none|unknown|not supplied|n\/a)[.!]?$/i.test(s.trim());
const eventNotes=(s,limits=false)=>{try{const a=readProgressRows(s||'[]','PROGRESS EVENTS');return Array.isArray(a)?a.filter(e=>e&&typeof e.details==='string'&&(limits?e.kind==='LIMITATION':e.kind!=='LIMITATION')).map(e=>e.details+(typeof e.reference==='string'?' [Source: '+e.reference+']':'')):[];}catch{return [];}};
const lines=s=>String(s||'').split('\n').map(s=>s.replace(/^\s*[-*•]\s*/,'').trim()).filter(known);
export function currentAttempt(p){
 const checkpoint=p.checkpoints.at(-1),previous=p.checkpoints.at(-2)?.fields||{};
 let fields={};try{fields=parsePacket(checkpoint.raw,{plain:true}).fields;}catch{}
 let events=[];try{events=readProgressRows(fields.progressEvents||'[]','PROGRESS EVENTS');if(!Array.isArray(events))events=[];}catch{}
 events=events.filter(e=>e&&typeof e.details==='string');
 const descriptions=events.filter(e=>e.kind!=='LIMITATION').map(e=>e.kind+' · '+e.details);
 const fresh=key=>known(fields[key])&&fields[key]!==previous[key]?fields[key]:'';
 const latest=descriptions.length?descriptions:lines(fresh('completed')).concat(lines(fresh('observations')));
 const identities=[...new Set(events.filter(e=>e.kind==='RESULT').map(e=>e.artifact).filter(known))];
 const references=[...new Set(events.map(e=>e.reference).filter(known))];
 const sourceIdentity=fields.resultIdentity||'';
 const warnings=[];
 if(descriptions.length&&known(fields.completed)&&fields.completed===previous.completed)warnings.push('The response repeats an earlier accomplishment. Current event descriptions are shown separately.');
 if(identities.length&&known(sourceIdentity)&&!identities.includes(sourceIdentity))warnings.push('The response-level result identity differs from the event artifact. Both are retained; correspondence is unresolved.');
 const activity=allActivity(p).findLast(r=>r.checkpointId===checkpoint.id);
 warnings.push(...(activity?.validationErrors||[]));
 return {fields,events,latest,identities,references,sourceIdentity,productChanges:fields.productChanges||'UNKNOWN',warnings,unassigned:events.filter(e=>!p.progress?.requirements.some(r=>r.id===e.requirement))};
}
export function automaticSnapshot(p){
 const checkpoints=allCheckpoints(p);
 const reports=allActivity(p).flatMap(r=>{try{return [parsePacket(r.raw,{plain:true}).fields];}catch{return [];}});
 const sources=checkpoints.map(c=>c.fields).concat(reports);
 const current=p.checkpoints.at(-1).fields,attempt=currentAttempt(p);
 const collect=key=>[...new Set(sources.flatMap(f=>lines(f[key])))];
 return {objective:current.goal||current.intent||'Objective needs clarification.',remaining:lines(current.remaining),findings:collect('completed'),observations:[...new Set(collect('observations').concat(sources.flatMap(f=>eventNotes(f.progressEvents))))],checks:collect('verification'),limitations:[...new Set(collect('blockers').concat(sources.flatMap(f=>eventNotes(f.progressEvents,true))))],unclassified:reports.filter(f=>!known(f.completed)&&!known(f.observations)&&!known(f.progressEvents)).flatMap(f=>lines(f.state)),unmapped:collect('requirements').concat(collect('progressEvents')),attempt,latest:attempt.latest,sourceCount:checkpoints.length};
}
export function automaticPlan(p){
 const s=automaticSnapshot(p),fields=p.checkpoints.at(-1).fields,remaining=s.remaining[0];
 const explicit=known(fields.next)?fields.next:'';
 const action=explicit|| (remaining?'Resolve the next unfinished item: '+remaining+'. Identify the specific missing fact that prevents a bounded action, or execute that action within established permission. Reuse preserved findings; do not repeat completed preparation.':'Review the preserved findings against the established objective: '+s.objective+'. Identify any unmet criterion from existing evidence; do not invent further work or infer completion.');
 const reported=String(fields.phase||'').trim().toUpperCase();
 const phase=['INVESTIGATION','READY FOR EXECUTION','EXECUTION','VERIFICATION','QUALIFICATION','USER REVIEW','RECOVERY','RELEASE'].includes(reported)?reported:/^(verify|test|check|validate)\b/i.test(action)?'VERIFICATION':/^(implement|fix|correct|modify|build|add|update|execute|create|draft|write|design|produce|revise|compose|generate)\b/i.test(action)?'EXECUTION':/^(publish|deploy|release)\b/i.test(action)?'RELEASE':/^(review|accept|approve)\b/i.test(action)?'USER REVIEW':'INVESTIGATION';
 return {phase,type:'Continuation Prompt',action,condition:known(fields.success)?fields.success:'Return the bounded action’s result and appropriate check, or the exact missing fact and why its answer changes the action. Preserve prior evidence and report what remains unfinished.',reason:'The next action uses the current report and established scope; historical unfinished work does not override a newer bounded action.',latest:s.latest.join('\n')||'Existing project history preserved; no new finding in the latest response.',resumed:true,accounted:true,snapshot:s};
}
export function automaticContext(p){const s=automaticSnapshot(p);const excerpt=(rows,n)=>rows.slice(-n).map(x=>x.length>1400?x.slice(0,1400)+' [excerpt; full text in saved history]':x).join('\n');return 'CURRENT REPORTED ATTEMPT\n'+s.latest.join('\n')+'\nEvidence artifacts: '+(s.attempt.identities.join('; ')||'Not supplied')+'\nEvidence references: '+(s.attempt.references.join('; ')||'Not supplied')+'\nResponse-level identity (separate from event artifacts): '+(s.attempt.sourceIdentity||'Not supplied')+'\nProduct changes: '+s.attempt.productChanges+'\nValidation notes: '+(s.attempt.warnings.join('; ')||'None')+'\nDo not repeat these reported diagnostics merely to recreate evidence. Their stated limitations remain unresolved.\n\nHISTORICAL CONTEXT AND PRESERVED EVIDENCE\nObjective: '+s.objective+'\n\nREPORTED FINDINGS\n'+excerpt(s.findings.concat(s.observations),8)+'\n\nREPORTED CHECKS (not independently verified)\n'+excerpt(s.checks,5)+'\n\nATTEMPT LIMITATIONS (historical reports, not global project blockers)\n'+excerpt(s.limitations,4)+'\n\nREQUIREMENT / EVIDENCE TEXT AWAITING PRECISE ASSOCIATION\n'+excerpt(s.unmapped,2)+'\n\nADDITIONAL RESPONSE TEXT (unclassified)\n'+s.unclassified.slice(-2).join('\n')+'\n\nThis is a bounded recent-context excerpt; all original reports remain in saved history. No completion, user acceptance or evidence association is inferred from these text records. Preserve their uncertainty. Supply explicit links during ordinary work when established; do not start a separate setup or formatting task.';}
