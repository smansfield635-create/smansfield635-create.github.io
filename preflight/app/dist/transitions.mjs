import {allCheckpoints} from './history.mjs';
import {progressSnapshot} from './progress-record.mjs';

// A source-report projection, not an execution or acceptance authority.
export const TRANSITION_STAGES=['INVESTIGATION','READY FOR EXECUTION','EXECUTION','VERIFICATION','QUALIFICATION','USER REVIEW','RELEASE'];
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);
const text=(x,max=8000)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
const absent=x=>x===undefined||x===null||x===''||typeof x==='string'&&/^(UNKNOWN|NONE|NOT SUPPLIED)[.!]?$/i.test(x.trim());
const knownIdentity=x=>text(x)&&!/^(UNKNOWN|NONE|NOT SUPPLIED|N\/A)[.!]?$/i.test(x.trim());
const fail=message=>{throw Error(message);};
function decode(value,fields,requirements){
 if(absent(value))return null;
 let r=value;
 if(typeof r==='string'){
  if(r.length>60000)fail('Transition report exceeds the supported size.');
  try{r=JSON.parse(r.replace(/^\s*```(?:json)?\s*\n/i,'').replace(/\n```\s*$/,''));}catch{fail('Transition report must be one JSON object.');}
 }
 if(!plain(r))fail('Transition report must be one JSON object.');
 for(const key of ['task','requirement','subject','intendedAction'])if(!text(r[key]))fail('Transition report requires '+key+'.');
 if(!knownIdentity(r.subject))fail('Transition subject identity is unknown.');
 if(requirements?.length&&!requirements.some(x=>x.id===r.requirement))fail('Transition requirement is not in the established map.');
 if(!TRANSITION_STAGES.includes(r.stage))fail('Transition stage is unsupported; imported reports cannot complete a project.');
 if(knownIdentity(fields.resultIdentity)&&r.subject!==fields.resultIdentity)fail('Transition subject differs from the current result identity.');
 if(!Array.isArray(r.conditions)||r.conditions.length>80)fail('Transition conditions must be an array of at most 80 prerequisites.');
 if(r.attemptedRoute!==undefined&&typeof r.attemptedRoute!=='string'||r.executionConditions!==undefined&&typeof r.executionConditions!=='string')fail('Attempt route and conditions must be text.');
 if((r.attemptedRoute||'').length>8000||(r.executionConditions||'').length>8000)fail('Attempt route or conditions exceed the supported size.');
 if(r.attempt!==undefined){
  if(!plain(r.attempt)||!text(r.attempt.routeId,200)||!text(r.attempt.conditionsId,200)||!text(r.attempt.reference)||r.attempt.subject!==r.subject||!knownIdentity(fields.resultIdentity))fail('Attempt evidence requires stable route and condition IDs, a reference and current matching subject identity.');
 }
 const ids=new Set();
 for(const c of r.conditions){
  if(!plain(c)||!text(c.id,200)||ids.has(c.id))fail('Transition prerequisite IDs must be unique.');
  ids.add(c.id);
  if(!['UNKNOWN','MISSING','SATISFIED'].includes(c.status)||!Array.isArray(c.dependsOn)||c.dependsOn.length>80||c.dependsOn.some(x=>!text(x,200))||new Set(c.dependsOn).size!==c.dependsOn.length)fail('Transition prerequisite status or dependency list is invalid.');
  for(const key of ['action','criterion'])if(!text(c[key]))fail('Each prerequisite needs an action and observable criterion.');
  if(c.stage!==undefined&&!TRANSITION_STAGES.includes(c.stage))fail('Prerequisite stage is unsupported.');
  if(c.reference!==undefined&&!text(c.reference))fail('Prerequisite evidence reference must be nonempty text.');
  if(c.blocker!==undefined&&!text(c.blocker))fail('Prerequisite blocker association must be exact text.');
  if(c.status==='SATISFIED'&&(!text(c.reference)||c.subject!==r.subject||!knownIdentity(fields.resultIdentity)))fail('Satisfied prerequisites require a reference and current matching subject identity.');
 }
 const byId=new Map(r.conditions.map(c=>[c.id,c])),visiting=new Set(),visited=new Set();
 function visit(id){
  if(!byId.has(id))fail('Transition dependency names an unknown prerequisite.');
  if(visiting.has(id))fail('Transition dependencies contain a cycle.');
  if(visited.has(id))return;
  visiting.add(id);for(const dep of byId.get(id).dependsOn)visit(dep);visiting.delete(id);visited.add(id);
 }
 for(const id of ids)visit(id);
 for(const c of r.conditions)if(c.status==='SATISFIED'&&c.dependsOn.some(id=>byId.get(id).status!=='SATISFIED'))fail('A satisfied prerequisite still has an unresolved dependency.');
 return structuredClone(r);
}
// Task movement is independent of descriptions, array order and route prose.
const signature=r=>JSON.stringify([r.task,r.requirement,r.subject,r.conditions.map(c=>[c.id,c.status,[...c.dependsOn].sort()]).sort((a,b)=>a[0].localeCompare(b[0]))]);
const attemptSignature=a=>a?JSON.stringify([a.routeId,a.conditionsId,a.subject]):null;
const frontier=r=>r.conditions.filter(c=>c.status!=='SATISFIED'&&c.dependsOn.every(id=>r.conditions.find(x=>x.id===id).status==='SATISFIED')).sort((a,b)=>a.id.localeCompare(b.id));

export function inspectTransition(p){
 const checkpoints=allCheckpoints(p),current=checkpoints.at(-1),fields=current?.fields||{};
 let report;
 try{
  if(absent(fields.transition)){
   const prior=checkpoints.slice(0,-1).findLast(c=>!absent(c.fields?.transition));
   if(prior){const changes=['next','resultIdentity','requirements'].filter(k=>fields[k]!==prior.fields[k]);return {status:'ABSENT',needsRebind:true,priorTask:prior.fields.transition,reason:'A previous task map remains in history but is not active'+(changes.length?' after changes to '+changes.join(', '):' in the current record')+'. Supply only its necessary binding or prerequisite update; do not reconstruct completed history or reuse stale satisfaction.'};}
   return {status:'ABSENT'};
  }
  const snapshot=p.progress?progressSnapshot(p.progress):null;
  // Finished requirement evidence and actual user acceptance govern closure.
  // A retained task report must not resurrect an already satisfied task.
  if(snapshot?.allSatisfied)return {status:'ABSENT',reason:'All tracked requirements are satisfied; task report retained as history.'};
  const next=snapshot?.next||null;
  const binding=next?.result?.artifact?{...fields,resultIdentity:next.result.artifact}:fields;
  report=decode(fields.transition,binding,p.progress?.requirements);
  if(p.progress&&(!next||report.requirement!==next.id))fail('Transition does not belong to the next unfinished requirement.');
 }catch(e){return {status:'INVALID',error:e.message,evidenceStanding:'SOURCE_REPORTED'};}
 if(!report)return {status:'ABSENT'};
 const available=frontier(report),selected=available[0]||null;
 let previous=null;
 for(const c of checkpoints.slice(0,-1).reverse()){
  try{const r=decode(c.fields?.transition,c.fields||{},p.progress?.requirements);if(r&&r.task===report.task){previous=r;break;}}catch{}
 }
 const previousSelected=previous?frontier(previous)[0]||null:null;
 const sameSubject=!!previous&&previous.subject===report.subject&&previous.requirement===report.requirement;
 const noTransition=!!selected&&sameSubject&&signature(report)===signature(previous);
 const attemptChanged=noTransition&&!!report.attempt&&attemptSignature(report.attempt)!==attemptSignature(previous.attempt);
 const repeated=noTransition&&!!report.attempt&&!!previous.attempt&&attemptSignature(report.attempt)===attemptSignature(previous.attempt);
 const satisfied=report.conditions.filter(c=>c.status==='SATISFIED').map(c=>c.id).sort(),missing=report.conditions.filter(c=>c.status!=='SATISFIED').map(c=>c.id).sort();
 const priorSatisfied=new Set(previous?.conditions.filter(c=>c.status==='SATISFIED').map(c=>c.id)||[]);
 const resolved=sameSubject?satisfied.filter(id=>!priorSatisfied.has(id)):[];
 const priorById=new Map((sameSubject?previous.conditions:[]).map(c=>[c.id,c]));
 const introduced=sameSubject?report.conditions.filter(c=>!priorById.has(c.id)).map(c=>c.id).sort():[];
 const addedDependencies=sameSubject?report.conditions.flatMap(c=>c.dependsOn.filter(id=>!priorById.get(c.id)?.dependsOn.includes(id)).map(id=>({condition:c.id,dependency:id}))):[];
 if(introduced.some(id=>!text(report.conditions.find(c=>c.id===id).reference)))return {status:'INVALID',error:'Newly discovered prerequisites require a source reference for the observed missing condition.',evidenceStanding:'SOURCE_REPORTED'};
 const delta=previous&&previous.subject!==report.subject?'SUBJECT_CHANGED':introduced.length||addedDependencies.length?'DEPENDENCY_DISCOVERED':resolved.length?'PREREQUISITE_RESOLVED':noTransition?'NO_TRANSITION':previous&&previousSelected?.id!==selected?.id?'PREREQUISITE_MOVED':'REPORTED_STATE';
 const needsPrerequisite=noTransition&&!attemptChanged;
 const phase=needsPrerequisite?'INVESTIGATION':selected?(selected.stage||'INVESTIGATION'):report.stage;
 let action=selected?selected.action:report.intendedAction;
 let condition=selected?selected.criterion:'Return the result and evidence for this bounded action; preserve verification, qualification, user acceptance and destination authorization as separate conditions.';
 let reason=selected?'Prerequisite '+selected.id+' is unresolved. '+(selected.dependsOn.length?'Its declared upstream prerequisites have matching source-reported evidence.':'No upstream prerequisites were declared for this step.')+' The intended task remains: '+report.intendedAction:'All declared prerequisites have matching source-reported evidence. Existing requirement checks, permissions and acceptance rules still govern advancement.';
 if(available.length>1)reason+=' Other independent ready prerequisites remain: '+available.slice(1).map(c=>c.id).join(', ')+'.';
 if(needsPrerequisite){
  action='Identify the exact missing capability, input, permission or check preventing prerequisite '+selected.id+' using the latest reported limitation and existing evidence. If an actual missing condition is established, add it to conditions with a stable ID, source reference, action and observable criterion, and link '+selected.id+' to it through dependsOn. Preserve the intended task and existing prerequisites. Do not invent a dependency, repeat completed preparation or retry a failed route under unchanged conditions. If a different permitted route is already available, report its stable attempt identity and supporting evidence instead.';
  condition='A source-referenced missing prerequisite linked to '+selected.id+', or a current-subject attempt record establishing an available changed route or execution condition. If neither is established, return BLOCKED with a concrete capability handoff: missing capability, exact input/subject, bounded operation, expected output, known destination if any, and permission boundary. Do not invent a destination or another preparation layer; preparation artifacts do not resolve this prerequisite.';
  reason='The subject and prerequisite states remain unchanged. New descriptions or a completed investigation do not establish prerequisite resolution.'+(repeated?' The structured route and execution-condition identities also remain unchanged.':' Route identity is not inferred from narrative wording.');
 }else if(attemptChanged){
  reason+=' A changed attempt has a current-subject source reference; prerequisite resolution and execution permission are not implied.';
 }
 const trace={schema:'DGB_TRANSITION_TRACE_v1',task:report.task,requirement:report.requirement,subject:report.subject,stage:phase,intendedStage:report.stage,selectedPrerequisite:selected?.id||null,satisfied,missing,resolved,introduced,addedDependencies,delta,noTransition,repeated,attemptChanged,attempt:report.attempt||null,route:report.attemptedRoute||'',executionConditions:report.executionConditions||'',expectedEvidence:condition,evidenceStanding:'SOURCE_REPORTED',authorityEffect:'NONE'};
 return {status:'VALID',report,selected,phase,action,condition,reason,noTransition,repeated,attemptChanged,trace,evidenceStanding:'SOURCE_REPORTED'};
}

export const TRANSITION_CONTRACT=`TASK TRANSITION: Optional JSON object describing the current bounded task, not a new authority or replacement requirement map. Supply {task,requirement,subject,stage,intendedAction,conditions,attemptedRoute,executionConditions,attempt?}. Reuse stable task and prerequisite IDs. subject is the exact current result/candidate/document identity and must match RESULT IDENTITY. stage is the intended NEXT stage after all declared conditions are satisfied: INVESTIGATION, READY FOR EXECUTION, EXECUTION, VERIFICATION, QUALIFICATION, USER REVIEW, or RELEASE. Each condition has {id,dependsOn,status,action,criterion}, optional stage (the work needed to resolve that condition; defaults to INVESTIGATION) and blocker (copy the exact active blocker text). For example a qualification prerequisite has stage QUALIFICATION while the report's intended next stage may be USER REVIEW. status is UNKNOWN, MISSING, or SATISFIED. SATISFIED requires reference and subject matching the current result; do not carry checks to changed subjects. When an attempt demonstrates a missing capability, input, permission or check, add that actual prerequisite to conditions with a stable ID, source reference, action and observable criterion; link the affected condition to it through dependsOn. Preserve the original task and other prerequisites. Newly introduced prerequisites require a reference. Do not infer new prerequisites from an empty dependency list. Include only actual prerequisites and their evidence; unknown dependency relationships remain unknown. Do not invent dependencies or mark upstream conditions satisfied while their dependencies remain unresolved. Preserve intendedAction while diagnosing a prerequisite. attemptedRoute and executionConditions preserve narrative context; changed wording alone is not task movement. Optional attempt is {routeId,conditionsId,reference,subject}: stable identifiers for the actual route and execution conditions, a source reference supporting their availability, and the current matching subject. Change these IDs only when the route or conditions actually change. A new reference alone does not establish a changed attempt. A changed attempt is not a satisfied prerequisite or permission. Qualification means identifying and checking the applicable selected gates against this exact subject, not generic test success. These are source reports: no transition can create permission, human acceptance, independent authentication or project completion. On later responses return the current complete task object, or omit it when no reliable task map can be established; do not repeat work merely to format this object.`;

export function transitionContext(p,decision){
 const t=inspectTransition(p);
 if(t.status==='INVALID')return 'TASK TRANSITION NEEDS CORRECTION\n'+t.error+' Preserve the original source report; establish only the missing or inconsistent dependency evidence. Do not infer readiness.\n\n'+TRANSITION_CONTRACT;
 if(t.status==='ABSENT'&&t.needsRebind)return 'TASK TRANSITION UPDATE NEEDED\n'+t.reason+'\nPrevious map (historical, not current authority): '+t.priorTask;
 if(t.status==='ABSENT')return 'TASK TRANSITION\nNo explicit task prerequisite map is recorded. During the requested work, identify the immediate missing condition and the evidence that would unlock the intended action where useful; do not create a separate mapping ceremony or invent dependency order.\n\n'+TRANSITION_CONTRACT;
 const trace=decision?{...t.trace,stage:decision.phase,expectedEvidence:decision.condition}:t.trace;
 return 'TASK TRANSITION DECISION\n'+JSON.stringify(trace)+'\nSelected action: '+(decision?.action||t.action)+'\nWhy: '+(decision?.reason||t.reason)+'\nPreserved intended action: '+t.report.intendedAction+'\nExpected return: '+(decision?.condition||t.condition)+'\n\n'+TRANSITION_CONTRACT;
}
