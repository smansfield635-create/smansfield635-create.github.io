import {currentAttempt} from './automatic-tracking.mjs';
import {readProgressRows,ProgressFormatError} from './progress-wire.mjs';
// Deterministic progress accounting. Technical judgments and methods belong to
// the working AI. A well-formed check is still source-reported, never independent proof.
const clone=x=>structuredClone(x);
const known=x=>typeof x==='string'&&x.trim()&&!/^(unknown|none|n\/a)$/i.test(x.trim());
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,79}$/.test(x);
const list=readProgressRows;
function text(x,label,max=4000){if(!known(x)||x.length>max)throw Error('Missing or invalid '+label+'.');return x.trim();}
export function parseRequirements(raw){
 const rows=list(raw,'REQUIREMENTS',100),seen=new Set();
 if(!rows.length)throw Error('Requirements cannot be empty.');
 const requirements=rows.map(r=>{
  if(!r||!id(r.id)||seen.has(r.id))throw Error('Requirement IDs must be unique and stable.');
  seen.add(r.id);
  if(!['REQUIRED','NOT_REQUIRED'].includes(r.review))throw Error('Each requirement must declare whether human review is REQUIRED or NOT_REQUIRED.');
  if(!Array.isArray(r.dependsOn)||r.dependsOn.some(x=>!id(x)))throw Error('Each requirement needs a dependsOn array.');
  if(r.standing!==undefined&&!['PROPOSED','APPROVED','UNKNOWN'].includes(r.standing))throw Error('Invalid requirement standing.');
  return {...(r.standing?{standing:r.standing}:{}),id:r.id,text:text(r.text,'requirement',1000),criterion:text(r.criterion,'acceptance criterion',3000),review:r.review,dependsOn:[...new Set(r.dependsOn)]};
 });
 const byId=new Map(requirements.map(r=>[r.id,r])),active=new Set(),done=new Set();
 function visit(r){if(active.has(r.id))throw Error('Requirement dependencies form a cycle.');if(done.has(r.id))return;active.add(r.id);for(const d of r.dependsOn){if(!byId.has(d))throw Error('Unknown requirement dependency: '+d);visit(byId.get(d));}active.delete(r.id);done.add(r.id);}
 requirements.forEach(visit);return requirements;
}
function parseEvents(raw){return !known(raw)?[]:list(raw,'PROGRESS EVENTS',100).map(e=>{
 if(!e||!id(e.id)||!id(e.requirement)||!['FINDING','RESULT','CHECK','LIMITATION'].includes(e.kind))throw Error('Invalid progress event identity or kind.');
 const row={id:e.id,requirement:e.requirement,kind:e.kind,details:text(e.details,'event details'),reference:text(e.reference,'evidence reference',2000)};
 if(e.kind==='RESULT'||e.kind==='CHECK')row.artifact=text(e.artifact,'exact artifact identity',500);
 if(e.kind==='CHECK'){
  if(!id(e.result)||!['PASS','FAIL'].includes(e.outcome))throw Error('A check needs a result event ID and PASS or FAIL.');
  row.result=e.result;row.outcome=e.outcome;row.criterion=text(e.criterion,'checked criterion',3000);
 }
 if(e.attributionOf!==undefined){if(!id(e.attributionOf))throw Error('Invalid source event attribution.');row.attributionOf=e.attributionOf;}
 if(e.kind==='LIMITATION')row.route=text(e.route,'attempted route',300);
 // Acceptance cannot be supplied by an AI packet.
 if('accepted' in e||'acceptance' in e||'independentlyVerified' in e)throw Error('AI events cannot grant user acceptance or independent verification.');
 return row;
});}
function evidenceConflict(message,existing,incoming){const e=new Error(message);e.name='EvidenceConflictError';e.issue={existing,incoming};return e;}
function addEvents(record,events,source){
 const byId=new Map(record.events.map(e=>[e.id,e]));
 for(const e of events){
  const linked=record.requirements.some(r=>r.id===e.requirement);
  const prior=byId.get(e.id);
  if(prior){const {source:ignored,...payload}=prior;if(JSON.stringify(payload)!==JSON.stringify(e))throw evidenceConflict('An existing event ID cannot be rewritten: '+e.id,prior,e);continue;}
  if(e.attributionOf){
   const original=byId.get(e.attributionOf);
   if(!linked||!original||record.requirements.some(r=>r.id===original.requirement)||original.attributionOf)throw Error('Attribution must map an existing unassigned event to an established requirement.');
   const payload=x=>JSON.stringify(Object.fromEntries(Object.entries(x).filter(([key])=>!['id','requirement','source','attributionOf'].includes(key)).sort(([a],[b])=>a.localeCompare(b))));
   const attributed=e.kind==='CHECK'&&byId.get(e.result)?.attributionOf===original.result?{...e,result:original.result}:e;
   if(payload(original)!==payload(attributed))throw Error('Attribution must preserve the original evidence payload.');
   if(record.events.some(x=>x.attributionOf===e.attributionOf))throw Error('This source event is already attributed.');
  }
  if(e.kind==='CHECK'&&linked){
   const result=byId.get(e.result),r=record.requirements.find(r=>r.id===e.requirement);
   if(!result||result.kind!=='RESULT'||result.requirement!==e.requirement||result.artifact!==e.artifact||r.criterion!==e.criterion)throw Error('Check must match the requirement criterion and exact result artifact.');
  }
  const duplicateEvidence=record.events.find(x=>x.requirement===e.requirement&&x.kind===e.kind&&x.reference===e.reference&&x.artifact===e.artifact&&x.result===e.result&&x.outcome===e.outcome&&x.route===e.route&&(e.kind!=='FINDING'||x.details===e.details));
  if(duplicateEvidence)throw evidenceConflict('This evidence is already recorded as '+duplicateEvidence.id+'. Reuse its event ID; do not create progress by relabeling it.',duplicateEvidence,e);
  const next={...e,source};record.events.push(next);byId.set(e.id,next);
 }
 if(record.events.length>2000)throw Error('Progress record capacity reached; preserve the backup before extending this project.');
}
export function prepareProgress(p,fields,{allowScopeExtension=false}={}){
 if(!p.progress&&!known(fields.requirements))return null;
 if(p.progress&&!known(fields.progressEvents)&&['completed','observations'].some(k=>known(fields[k])&&fields[k]!==p.checkpoints.at(-1).fields[k]))throw new ProgressFormatError('PROGRESS EVENTS','The response contains work descriptions but no requirement-linked events. Preserve those descriptions and supply their requirement IDs and evidence references');
 const record=p.progress?clone(p.progress):{version:1,objective:text(p.checkpoints.at(-1).fields.goal,'project objective'),requirements:parseRequirements(fields.requirements),events:[],decisions:[]};
 let scopeExtended=false;
 if(known(fields.requirements)){
  const proposed=parseRequirements(fields.requirements);
  if(JSON.stringify(proposed)!==JSON.stringify(record.requirements)){
   const existing=new Set(record.requirements.map(r=>r.id));
   if(!allowScopeExtension||p.flow?.promptRequest!=='DIRECTION'||!progressSnapshot(record).allSatisfied||proposed.length<=record.requirements.length||JSON.stringify(proposed.filter(r=>existing.has(r.id)))!==JSON.stringify(record.requirements))throw Error('Accepted requirements cannot be replaced by a tool response. Preserve their IDs and criteria; scope changes need a separate user decision.');
   record.requirements=proposed;scopeExtended=true;
  }
 }
 // Pin legacy decisions to the check that existed before a new response arrives.
 // This preserves old backups without letting later checks inherit old consent.
 for(const decision of record.decisions)if(decision.check===undefined){const prior=record.events.findLast(e=>e.kind==='CHECK'&&e.requirement===decision.requirement&&e.result===decision.result);if(prior)decision.check=prior.id;}
 const before=record.events.length;
 addEvents(record,parseEvents(fields.progressEvents),fields.baseline||p.checkpoints.at(-1).id);
 return {record,changed:!p.progress||scopeExtended||record.events.length>before,needsReview:!p.progress||scopeExtended,scopeExtended};
}
export function initializeProgress(p){
 if(p.progress){validateProgress(p.progress);return;}
 const f=p.checkpoints.at(-1).fields;
 if(known(f.requirements)){const prepared=prepareProgress(p,f);p.progress=prepared.record;}
}
// Called only by explicit in-app requirement adoption, never by import/restore.
// Keep the supplied standing immutable: it describes source provenance.
export function recordRequirementAdoption(p,{at=new Date().toISOString(),baseline=p.checkpoints.at(-1).id,requirements=p.progress?.requirements.map(r=>r.id)||[]}={}){
 if(!p.progress)return;
 validateProgress(p.progress);
 const already=new Set((p.progress.adoptions||[]).flatMap(a=>a.requirements));
 const ids=[...new Set(requirements)].filter(id=>!already.has(id));
 if(!ids.length)return;
 const adoption={requirements:ids,baseline,at};
 const candidate={...p.progress,adoptions:[...(p.progress.adoptions||[]),adoption]};
 validateProgress(candidate);p.progress.adoptions=candidate.adoptions;
}
export function validateProgress(record){
 if(!record||record.version!==1||!known(record.objective)||!Array.isArray(record.events)||record.events.length>2000||!Array.isArray(record.decisions)||record.decisions.length>2000)throw Error('Invalid progress record.');
 const requirements=parseRequirements(JSON.stringify(record.requirements));
 if(record.adoptions!==undefined){
  if(!Array.isArray(record.adoptions)||record.adoptions.length>100)throw Error('Invalid requirement adoption records.');
  const adopted=new Set();
  for(const a of record.adoptions){
   if(!a||Object.keys(a).some(k=>!['requirements','baseline','at'].includes(k))||!Array.isArray(a.requirements)||!a.requirements.length||!known(a.baseline)||!Number.isFinite(Date.parse(a.at))||typeof a.at!=='string')throw Error('Invalid requirement adoption record.');
   for(const requirement of a.requirements){if(!requirements.some(r=>r.id===requirement)||adopted.has(requirement))throw Error('Invalid adopted requirement identity.');adopted.add(requirement);}
  }
 }
 const rebuilt={requirements,events:[]};
 // Replay validates references and immutable identities, including across restores.
 for(const saved of record.events){if(!known(saved.source))throw Error('Progress event source is missing.');const {source,...e}=saved;addEvents(rebuilt,parseEvents(JSON.stringify([e])),source);}
 for(const d of record.decisions)if(!requirements.some(r=>r.id===d.requirement)||!['ACCEPTED','REJECTED'].includes(d.value)||!id(d.result)||!known(d.at)||!Number.isFinite(Date.parse(d.at))||(d.note!==undefined&&(typeof d.note!=='string'||d.note.length>4000))||(d.check!==undefined&&!record.events.some(e=>e.id===d.check&&e.kind==='CHECK'&&e.result===d.result&&e.requirement===d.requirement))||!record.events.some(e=>e.id===d.result&&e.requirement===d.requirement&&e.kind==='RESULT'))throw Error('Invalid human requirement decision.');
 if(record.reviewRequests!==undefined){
  if(!Array.isArray(record.reviewRequests)||record.reviewRequests.length>2000)throw Error('Invalid evidence requests.');
  for(const q of record.reviewRequests)if(!q||!requirements.some(r=>r.id===q.requirement)||!id(q.result)||!id(q.check)||typeof q.note!=='string'||q.note.length>4000||!Number.isFinite(Date.parse(q.at))||!record.events.some(e=>e.id===q.result&&e.requirement===q.requirement&&e.kind==='RESULT')||!record.events.some(e=>e.id===q.check&&e.requirement===q.requirement&&e.kind==='CHECK'&&e.result===q.result))throw Error('Invalid evidence request.');
 }
 return true;
}
export function progressSnapshot(record){
 if(!record)return null;
 const rows=record.requirements.map(r=>{
  const events=record.events.filter(e=>e.requirement===r.id),result=events.findLast(e=>e.kind==='RESULT');
  const check=result?events.findLast(e=>e.kind==='CHECK'&&e.result===result.id):null;
  const decision=result?record.decisions.findLast(d=>d.requirement===r.id&&d.result===result.id&&(d.check===undefined||d.check===check?.id)):null;
  const request=result?(record.reviewRequests||[]).findLast(q=>q.requirement===r.id&&q.result===result.id):null;
  const evidenceRequest=request&&request.check===check?.id?request:null;
  let status=result?'RESULT_REPORTED':events.some(e=>e.kind==='FINDING')?'FINDINGS_REPORTED':'OPEN';
  if(check?.outcome==='PASS')status='CHECK_REPORTED';
  if(check?.outcome==='PASS'&&decision?.value==='ACCEPTED'&&r.review==='REQUIRED')status='ACCEPTED';
  if(check?.outcome==='FAIL'||decision?.value==='REJECTED')status='NEEDS_CORRECTION';
  if(evidenceRequest)status='EVIDENCE_REQUESTED';
  return {...r,status,satisfied:false,result,check,decision,evidenceRequest,limitations:events.filter(e=>e.kind==='LIMITATION'),events};
 });
 const byId=new Map(rows.map(r=>[r.id,r])),done=new Set();
 function evaluate(r){
  if(done.has(r.id))return;
  for(const id of r.dependsOn)evaluate(byId.get(id));
  r.dependenciesSatisfied=r.dependsOn.every(id=>byId.get(id).satisfied);
  r.staleDependencies=r.check?r.dependsOn.filter(id=>{const result=byId.get(id).result;return result&&record.events.indexOf(result)>record.events.indexOf(r.check);}):[];
  if(!r.dependenciesSatisfied)r.status='BLOCKED_DEPENDENCY';
  else if(r.staleDependencies.length)r.status='NEEDS_RECHECK';
  r.satisfied=r.dependenciesSatisfied&&!r.staleDependencies.length&&(r.status==='ACCEPTED'||r.status==='CHECK_REPORTED'&&r.review==='NOT_REQUIRED');
  done.add(r.id);
 }
 rows.forEach(evaluate);
 const next=rows.find(r=>r.status==='NEEDS_CORRECTION'&&r.dependenciesSatisfied)||rows.find(r=>!r.satisfied&&r.dependenciesSatisfied)||rows.find(r=>!r.satisfied);
 return {objective:record.objective,rows,next,latest:record.events.at(-1),unassigned:record.events.filter(e=>!record.requirements.some(r=>r.id===e.requirement)&&!record.events.some(x=>x.attributionOf===e.id)),checked:rows.filter(r=>['CHECK_REPORTED','ACCEPTED'].includes(r.status)).length,accepted:rows.filter(r=>r.status==='ACCEPTED').length,total:rows.length,allSatisfied:rows.every(r=>r.satisfied)};
}
export function requirementReviewState(p,requirement){
 const snapshot=progressSnapshot(p.progress),row=requirement?snapshot?.rows.find(r=>r.id===requirement):snapshot?.next;
 let reason='';
 if(!row)reason='No requirement result is awaiting human review.';
 else if(row.review!=='REQUIRED')reason='This criterion does not require human acceptance.';
 else if(!row.dependenciesSatisfied)reason='Prerequisite requirements are not satisfied.';
 else if(row.status!=='CHECK_REPORTED')reason='The current result needs a matching passing check before review.';
 else if(p.flow?.status==='COMPLETE'||p.flow?.promptRequest||p.request?.trim())reason='Resolve the current direction before reviewing a requirement result.';
 else if(p.flow?.blockers?.length)reason='Resolve the recorded blocker before reviewing this result.';
 else if(p.flow?.attempt||p.flow?.reviewPending)reason='Finish processing the current response before judging its result.';
 return {eligible:!reason,row,reason};
}
function reviewNote(note){if(typeof note!=='string'||note.length>4000)throw Error('Review feedback must be text of at most 4000 characters.');return note.trim();}
export function requirementDecision(p,requirement,value,{note=''}={}){
 if(!['ACCEPTED','REJECTED'].includes(value))throw Error('Invalid requirement decision.');
 const review=requirementReviewState(p,requirement);if(!review.eligible)throw Error(review.reason);
 note=reviewNote(note);
 if(p.progress.decisions.length>=2000)throw Error('Decision capacity reached; preserve a backup before extending this project.');
 p.progress.decisions.push({requirement,result:review.row.result.id,check:review.row.check.id,value,note,at:new Date().toISOString()});
}
export function requestRequirementEvidence(p,requirement,note=''){
 const review=requirementReviewState(p,requirement);if(!review.eligible)throw Error(review.reason);
 note=reviewNote(note);
 if((p.progress.reviewRequests?.length||0)>=2000)throw Error('Evidence request capacity reached; preserve a backup before extending this project.');
 (p.progress.reviewRequests||=[]).push({requirement,result:review.row.result.id,check:review.row.check.id,note,at:new Date().toISOString()});
}
function recordRecent(record,source){return record.events.filter(e=>e.source===source&&e.kind!=='LIMITATION'&&record.requirements.some(r=>r.id===e.requirement));}
export function progressPlan(p){
 const s=progressSnapshot(p.progress);if(!s)return null;
 const r=s.next,fields=p.checkpoints.at(-1).fields;
 const attempt=currentAttempt(p);
 const advance=attempt.latest.join('\n')||'No new finding classified in the current response. Earlier evidence remains in history.';
 let phase,action,condition;
 if(s.unassigned.length&&r&&['OPEN','FINDINGS_REPORTED'].includes(r.status)&&!(known(fields.next)&&['EXECUTION','READY FOR EXECUTION','VERIFICATION','QUALIFICATION','RELEASE'].includes(fields.phase))){phase='EVIDENCE MAPPING';action='Map the already recorded unassigned evidence to the established requirement IDs. Reuse the original artifacts and references; do not repeat the underlying investigation. Return requirement-linked copies using a new event ID and attributionOf set to the original event ID, preserving every other evidence field, or identify the exact attribution that cannot be established.';condition='Existing evidence is attributed to an established requirement, or a specific unresolved attribution is identified. No completion or execution permission is inferred.';}
 else if(!r){phase='USER REVIEW';action='Review the project outcome against the established objective. All requirement checks are reported; confirm the overall result with the user. Publication remains subject to its own recorded requirement and authorization.';condition='An explicit user decision on the project outcome; no independent verification or publication inferred.';}
 else if(r.status==='CHECK_REPORTED'){phase='USER REVIEW';action='Present requirement '+r.id+' for user judgment: '+r.text.replace(/[.!?]+$/,'')+'. Show the exact result and its reported check. Do not accept on the user’s behalf.';condition='The user accepts this exact result or supplies corrective feedback.';}
 else if(['RESULT_REPORTED','NEEDS_RECHECK','EVIDENCE_REQUESTED'].includes(r.status)){phase='VERIFICATION';action='Verify requirement '+r.id+': '+r.text.replace(/[.!?]+$/,'')+'. Check exact result '+r.result.artifact+' against: '+r.criterion.replace(/[.!?]+$/,'')+'. '+(r.evidenceRequest?'The user requested additional evidence: '+(r.evidenceRequest.note||'Identify and supply the evidence needed to judge this result.')+' ':r.staleDependencies.length?'Prerequisite results changed after the earlier check; verify against their current results. ':'')+'The receiving AI chooses the appropriate permitted verification method.';condition='A new CHECK event bound to result '+r.result.id+', its exact artifact, criterion, outcome and evidence reference.';}
 else if(r.status==='NEEDS_CORRECTION'){phase='CORRECTION';action='Correct the demonstrated gap in requirement '+r.id+': '+r.text+'. Preserve accepted work. '+(r.decision?.value==='REJECTED'?'User feedback: '+(r.decision.note||'Ask the user which part of the result needs correction before selecting a repair.'):'Failed check: '+r.check.details)+' Return the changed result with an exact artifact identity, then verify it against: '+r.criterion;condition='A corrected RESULT with an exact artifact identity and subsequent matching CHECK. A failed result cannot be accepted.';}
 else {const next=known(fields.next)?fields.next.trim():'';phase=next&&['EXECUTION','READY FOR EXECUTION','VERIFICATION','QUALIFICATION','RELEASE','INVESTIGATION'].includes(fields.phase)?fields.phase:'INVESTIGATION';action=next||'Identify the specific missing fact preventing execution of requirement '+r.id+': '+r.text+'. Explain how that fact would change the next bounded action; if no such gap remains, perform the permitted action.';const suffix=' Acceptance criterion: '+r.criterion+'. Use existing findings; do not repeat completed work. Preserve existing authorization boundaries.';action=action.split(suffix)[0]+suffix;if(r.limitations.length)action+=' Historical attempt limitations (not proof that this environment has the same limitation): '+r.limitations.map(e=>e.route+' — '+e.details+' ['+e.reference+']').join('; ')+'. Check the receiving environment for a permitted alternative. Do not repeat the same failed method under unchanged conditions.';condition='A requirement-linked result and evidence, or a specific missing fact that materially prevents the next action. Rephrasing prior evidence is not progress.';}
 return {snapshot:s,phase,type:({'USER REVIEW':'Review Prompt','VERIFICATION':'Verification Prompt','QUALIFICATION':'Qualification Prompt','EXECUTION':'Execution Prompt','READY FOR EXECUTION':'Execution Readiness Prompt','RELEASE':'Release Prompt','CORRECTION':'Correction Prompt','EVIDENCE MAPPING':'Evidence Mapping Prompt'})[phase]||'Investigation Prompt',action,condition,reason:'The next action follows current results, acceptance criteria and prerequisite evidence. Source-reported checks do not grant authority or human acceptance.',latest:advance,resumed:true,accounted:true};
}
export function progressContext(p){
 const s=progressSnapshot(p.progress),adoptions=p.progress.adoptions||[];
 const adopted=new Set(adoptions.flatMap(a=>a.requirements));
 const adoptionText=adoptions.length?'In-app adoption records: '+JSON.stringify(adoptions)+'. Source standing below is preserved exactly; map adoption does not accept results or grant execution permission.':'In-app requirement adoption was not separately recorded in this legacy record. Source standing is preserved; no new approval is inferred.';
 const eventLine=e=>e.id+' | '+e.kind+' · '+e.details+' | '+JSON.stringify(Object.fromEntries(Object.entries(e).filter(([key])=>!['source','id','kind','details'].includes(key))));
 const summaries=s.rows.map(r=>{
  const findings=r.events.filter(e=>e.kind==='FINDING').slice(-3);
  const routes=[...new Map(r.limitations.map(e=>[e.route,e])).values()];
  const selected=[...findings,...(r.result?[r.result]:[]),...(r.check?[r.check]:[]),...routes];
  return r.id+' | '+r.status+' | '+(r.review==='REQUIRED'?'user: '+(r.decision?.value||'No acceptance recorded'):'human review not required')+(r.decision?.note?' | feedback: '+r.decision.note:'')+(r.evidenceRequest?' | evidence requested: '+r.evidenceRequest.note:'')+'\n'+selected.map(eventLine).join('\n');
 }).join('\n\n');
 const unassigned=s.unassigned.length?'\n\nUNASSIGNED EVIDENCE (does not advance requirements)\n'+s.unassigned.map(eventLine).join('\n'):'';
 return 'OBJECTIVE\n'+s.objective+'\n\n'+(adopted.size===s.total?'ADOPTED REQUIREMENT MAP':'TRACKED REQUIREMENTS')+'\n'+adoptionText+'\n'+JSON.stringify(p.progress.requirements)+'\n\nCURRENT PROGRESS AND RELEVANT EVIDENCE\n'+summaries+unassigned+'\n\nAll original events remain in project history. Current results, matching checks, recent findings and the latest limitation per route are shown once. Historical limitations describe their recorded attempts, not every future environment. Reuse completed work. Checks remain source-reported; DiamondGate validates correspondence, not the truth of arbitrary claims. Human acceptance is separate.';
}
export const PROGRESS_CONTRACT=`REQUIREMENTS: JSON array of {id,text,criterion,review,dependsOn}. Use stable IDs such as R1; criterion is an observable completion condition; review is REQUIRED only where human judgment is needed, otherwise NOT_REQUIRED; dependsOn lists only genuine prerequisite requirement IDs; do not chain independent checks or make a bounded correction to an observed failure wait for unrelated checks. Mark human review REQUIRED only for subjective or explicitly requested user judgment, not merely objective presence or field matching. Preserve existing adopted dependencies unchanged; propose changes for user review rather than silently rewriting them. Cover the end-to-end user objective, including verification and any requested publication. Existing requirements cannot silently change. After a completed scope is explicitly reopened, propose an append-only map retaining every prior requirement unchanged and adding new IDs for the new direction; this extension awaits user adoption. Preserve any supplied standing as PROPOSED, APPROVED or UNKNOWN; never infer approval. The complete initial map awaits explicit user review in DiamondGate before adoption.
PROGRESS EVENTS: JSON array of new events only. Each has {id,requirement,kind,details,reference}. requirement must match an established ID; use UNKNOWN only when attribution is unresolved. Such evidence is held unassigned and cannot advance completion. To resolve attribution, return a new event with a new id, the established requirement, and attributionOf naming the original unassigned event; preserve all other evidence fields (a CHECK result reference may name the corresponding attributed RESULT). Do not rerun the work to map it. kind is FINDING, RESULT, CHECK, or LIMITATION. RESULT additionally requires artifact (exact version/identity). CHECK requires artifact, result (RESULT event ID), criterion (exact accepted criterion), outcome (PASS or FAIL). LIMITATION requires route (the attempted method/environment). Keep all claims source-reported; never grant user acceptance or independent verification. Use a new RESULT ID for changed artifacts. Reuse event IDs for unchanged evidence; do not relabel old evidence as new. Execution limitations attach to attempts, not to the project objective. Write these two section values as JSON arrays; fenced json blocks are accepted. Do not output placeholders or convert the arrays into prose. Example REQUIREMENTS value: [{"id":"R1","text":"Investigate the reported defect","criterion":"A cause is documented with evidence","review":"NOT_REQUIRED","dependsOn":[],"standing":"PROPOSED"}]. Example PROGRESS EVENTS value: [{"id":"E1","requirement":"R1","kind":"FINDING","details":"A potential cause was identified; location reproduction remains unfinished","reference":"Investigation report, source section"}]. Omit unchanged requirements on subsequent reports. If no requirements exist, propose them from established intent and accomplished work without repeating work; request user judgment only for material scope ambiguity.`;
