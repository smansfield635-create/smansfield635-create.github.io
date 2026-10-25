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
 if(e.kind==='LIMITATION')row.route=text(e.route,'attempted route',300);
 // Acceptance cannot be supplied by an AI packet.
 if('accepted' in e||'acceptance' in e||'independentlyVerified' in e)throw Error('AI events cannot grant user acceptance or independent verification.');
 return row;
});}
function addEvents(record,events,source){
 const byId=new Map(record.events.map(e=>[e.id,e]));
 for(const e of events){
  const linked=record.requirements.some(r=>r.id===e.requirement);
  const prior=byId.get(e.id);
  if(prior){const {source:ignored,...payload}=prior;if(JSON.stringify(payload)!==JSON.stringify(e))throw Error('An existing event ID cannot be rewritten: '+e.id);continue;}
  if(e.kind==='CHECK'&&linked){
   const result=byId.get(e.result),r=record.requirements.find(r=>r.id===e.requirement);
   if(!result||result.kind!=='RESULT'||result.requirement!==e.requirement||result.artifact!==e.artifact||r.criterion!==e.criterion)throw Error('Check must match the requirement criterion and exact result artifact.');
  }
  const duplicateEvidence=record.events.find(x=>x.requirement===e.requirement&&x.kind===e.kind&&x.reference===e.reference&&x.artifact===e.artifact&&x.result===e.result&&x.outcome===e.outcome&&x.route===e.route&&(e.kind!=='FINDING'||x.details===e.details));
  if(duplicateEvidence)throw Error('This evidence is already recorded as '+duplicateEvidence.id+'. Reuse its event ID; do not create progress by relabeling it.');
  const next={...e,source};record.events.push(next);byId.set(e.id,next);
 }
 if(record.events.length>2000)throw Error('Progress record capacity reached; preserve the backup before extending this project.');
}
export function prepareProgress(p,fields){
 if(!p.progress&&!known(fields.requirements))return null;
 if(p.progress&&!known(fields.progressEvents)&&['completed','observations'].some(k=>known(fields[k])&&fields[k]!==p.checkpoints.at(-1).fields[k]))throw new ProgressFormatError('PROGRESS EVENTS','The response contains work descriptions but no requirement-linked events. Preserve those descriptions and supply their requirement IDs and evidence references');
 const record=p.progress?clone(p.progress):{version:1,objective:text(p.checkpoints.at(-1).fields.goal,'project objective'),requirements:parseRequirements(fields.requirements),events:[],decisions:[]};
 if(known(fields.requirements)&&JSON.stringify(parseRequirements(fields.requirements))!==JSON.stringify(record.requirements))throw Error('Accepted requirements cannot be replaced by a tool response. Preserve their IDs and criteria; scope changes need a separate user decision.');
 const before=record.events.length;
 addEvents(record,parseEvents(fields.progressEvents),fields.baseline||p.checkpoints.at(-1).id);
 return {record,changed:!p.progress||record.events.length>before,needsReview:!p.progress};
}
export function initializeProgress(p){
 if(p.progress){validateProgress(p.progress);return;}
 const f=p.checkpoints.at(-1).fields;
 if(known(f.requirements)){const prepared=prepareProgress(p,f);p.progress=prepared.record;}
}
export function validateProgress(record){
 if(!record||record.version!==1||!known(record.objective)||!Array.isArray(record.events)||record.events.length>2000||!Array.isArray(record.decisions)||record.decisions.length>2000)throw Error('Invalid progress record.');
 const requirements=parseRequirements(JSON.stringify(record.requirements));
 const rebuilt={requirements,events:[]};
 // Replay validates references and immutable identities, including across restores.
 for(const saved of record.events){if(!known(saved.source))throw Error('Progress event source is missing.');const {source,...e}=saved;addEvents(rebuilt,parseEvents(JSON.stringify([e])),source);}
 for(const d of record.decisions)if(!requirements.some(r=>r.id===d.requirement)||!['ACCEPTED','REJECTED'].includes(d.value)||!id(d.result)||!known(d.at)||!record.events.some(e=>e.id===d.result&&e.requirement===d.requirement&&e.kind==='RESULT'))throw Error('Invalid human requirement decision.');
 return true;
}
export function progressSnapshot(record){
 if(!record)return null;
 const rows=record.requirements.map(r=>{
  const events=record.events.filter(e=>e.requirement===r.id),result=events.findLast(e=>e.kind==='RESULT');
  const check=result?events.findLast(e=>e.kind==='CHECK'&&e.result===result.id):null;
  const decision=result?record.decisions.findLast(d=>d.requirement===r.id&&d.result===result.id):null;
  let status=result?'RESULT_REPORTED':events.some(e=>e.kind==='FINDING')?'FINDINGS_REPORTED':'OPEN';
  if(check?.outcome==='PASS')status='CHECK_REPORTED';
  if(check?.outcome==='FAIL'||decision?.value==='REJECTED')status='NEEDS_CORRECTION';
  if(check?.outcome==='PASS'&&decision?.value==='ACCEPTED')status='ACCEPTED';
  const satisfied=status==='ACCEPTED'||status==='CHECK_REPORTED'&&r.review==='NOT_REQUIRED';
  return {...r,status,satisfied,result,check,decision,limitations:events.filter(e=>e.kind==='LIMITATION'),events};
 });
 const next=rows.find(r=>!r.satisfied&&r.dependsOn.every(d=>rows.find(x=>x.id===d).satisfied))||rows.find(r=>!r.satisfied);
 const latest=record.events.at(-1);
 return {objective:record.objective,rows,next,latest,unassigned:record.events.filter(e=>!record.requirements.some(r=>r.id===e.requirement)),checked:rows.filter(r=>['CHECK_REPORTED','ACCEPTED'].includes(r.status)).length,accepted:rows.filter(r=>r.status==='ACCEPTED').length,total:rows.length,allSatisfied:rows.every(r=>r.satisfied)};
}
export function requirementDecision(p,requirement,value){
 const snapshot=progressSnapshot(p.progress),r=snapshot?.rows.find(r=>r.id===requirement);
 if(!r?.result||!['ACCEPTED','REJECTED'].includes(value))throw Error('Choose an existing requirement result.');
 if(value==='ACCEPTED'&&r.check?.outcome!=='PASS')throw Error('A matching passed check is required before accepting this result.');
 p.progress.decisions.push({requirement,result:r.result.id,value,at:new Date().toISOString()});
}
function recordRecent(record,source){return record.events.filter(e=>e.source===source&&e.kind!=='LIMITATION'&&record.requirements.some(r=>r.id===e.requirement));}
export function progressPlan(p){
 const s=progressSnapshot(p.progress);if(!s)return null;
 const r=s.next;
 const attempt=currentAttempt(p);
 const advance=attempt.latest.join('\n')||'No new finding classified in the current response. Earlier evidence remains in history.';
 let phase,action,condition;
 if(!r){phase='USER REVIEW';action='Review the project outcome against the established objective. All requirement checks are reported; confirm the overall result with the user. Publication remains subject to its own recorded requirement and authorization.';condition='An explicit user decision on the project outcome; no independent verification or publication inferred.';}
 else if(r.status==='CHECK_REPORTED'){phase='USER REVIEW';action='Present requirement '+r.id+' for user judgment: '+r.text.replace(/[.!?]+$/,'')+'. Show the result and its reported check. Do not accept on the user’s behalf.';condition='The user accepts this exact result or supplies corrective feedback.';}
 else if(r.status==='RESULT_REPORTED'){phase='VERIFICATION';action='Verify requirement '+r.id+': '+r.text.replace(/[.!?]+$/,'')+'. Check exact result '+r.result.artifact+' against: '+r.criterion.replace(/[.!?]+$/,'')+'. The receiving AI chooses the appropriate permitted verification method.';condition='A CHECK event bound to result '+r.result.id+', its exact artifact, criterion, outcome and evidence reference.';}
 else{phase='INVESTIGATION';action='Continue unfinished requirement '+r.id+': '+r.text.replace(/[.!?]+$/,'')+'. Acceptance criterion: '+r.criterion.replace(/[.!?]+$/,'')+'. Perform one bounded test or deliverable for this requirement using existing findings. Identify the exact case and evidence gained; do not repeat the entire program. Choose the permitted method in the receiving AI tool. Preserve completed requirements and existing authority.';if(r.limitations.length)action+=' Previous attempted routes failed: '+r.limitations.map(e=>e.route+' — '+e.details+' ['+e.reference+']').join('; ')+'. Choose a different permitted approach; repeat a failed route only with new conditions and an explicit reason.';if(r.status==='NEEDS_CORRECTION')action+=' Address the failed check or user rejection before seeking acceptance.';condition='New requirement-linked findings, a result with evidence, or a demonstrated limitation of a different attempted route. Rephrasing prior evidence is not progress.';}
 return {snapshot:s,phase,type:phase==='USER REVIEW'?'Review Prompt':phase==='VERIFICATION'?'Verification Prompt':'Investigation Prompt',action,condition,reason:'The next action follows unsatisfied acceptance criteria. Receiving AI tools choose methods; failed routes do not replace the objective.',latest:advance,resumed:true,accounted:true};
}
export function progressContext(p){
 const s=progressSnapshot(p.progress);
 const summaries=s.rows.map(r=>{
  const findings=r.events.filter(e=>e.kind==='FINDING').slice(-3);
  const routes=[...new Map(r.limitations.map(e=>[e.route,e])).values()];
  return r.id+' | '+r.status+' | user: '+(r.decision?.value||'No acceptance recorded')+'\n'+[...findings,...(r.result?[r.result]:[]),...(r.check?[r.check]:[]),...routes].map(e=>e.id+' | '+e.kind+' | '+e.details+' | '+e.reference+(e.artifact?' | artifact: '+e.artifact:'')).join('\n');
 }).join('\n\n');
 return 'OBJECTIVE\n'+s.objective+'\n\nACCEPTED REQUIREMENTS\n'+JSON.stringify(p.progress.requirements)+'\n\nCURRENT PROGRESS AND RELEVANT EVIDENCE\n'+summaries+'\n\nUNASSIGNED EVIDENCE (does not advance requirements)\n'+s.unassigned.map(e=>e.id+' | supplied requirement: '+e.requirement+' | '+e.kind+' | '+e.details+' | '+e.reference).join('\n')+'\n\nCURRENT REPORTED ATTEMPT\n'+currentAttempt(p).latest.join('\n')+'\nEvidence artifacts: '+currentAttempt(p).identities.join('; ')+'\nEvidence references: '+currentAttempt(p).references.join('; ')+'\nDo not repeat these reported diagnostics merely to recreate evidence. Their limitations remain unresolved.\n\nAll original events remain in project history. This brief carries current results, checks, recent findings and the latest limitation per attempted route. Evidence checks are source-reported. DiamondGate validates correspondence, not the truth of arbitrary claims. Human acceptance is recorded separately in the app.';
}
export const PROGRESS_CONTRACT=`REQUIREMENTS: JSON array of {id,text,criterion,review,dependsOn}. Use stable IDs such as R1; criterion is an observable completion condition; review is REQUIRED only where human judgment is needed, otherwise NOT_REQUIRED; dependsOn lists prerequisite requirement IDs. Cover the end-to-end user objective, including verification and any requested publication. Existing requirements cannot silently change. Preserve any supplied standing as PROPOSED, APPROVED or UNKNOWN; never infer approval. The complete initial map awaits explicit user review in DiamondGate before adoption.
PROGRESS EVENTS: JSON array of new events only. Each has {id,requirement,kind,details,reference}. requirement must match an established ID; use UNKNOWN only when attribution is unresolved. Such evidence is held unassigned and cannot advance completion. kind is FINDING, RESULT, CHECK, or LIMITATION. RESULT additionally requires artifact (exact version/identity). CHECK requires artifact, result (RESULT event ID), criterion (exact accepted criterion), outcome (PASS or FAIL). LIMITATION requires route (the attempted method/environment). Keep all claims source-reported; never grant user acceptance or independent verification. Use a new RESULT ID for changed artifacts. Reuse event IDs for unchanged evidence; do not relabel old evidence as new. Execution limitations attach to attempts, not to the project objective. Write these two section values as JSON arrays; fenced json blocks are accepted. Do not output placeholders or convert the arrays into prose. Example REQUIREMENTS value: [{"id":"R1","text":"Investigate the reported defect","criterion":"A cause is documented with evidence","review":"NOT_REQUIRED","dependsOn":[],"standing":"PROPOSED"}]. Example PROGRESS EVENTS value: [{"id":"E1","requirement":"R1","kind":"FINDING","details":"A potential cause was identified; location reproduction remains unfinished","reference":"Investigation report, source section"}]. Omit unchanged requirements on subsequent reports. If no requirements exist, propose them from established intent and accomplished work without repeating work; request user judgment only for material scope ambiguity.`;
