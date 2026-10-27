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
 const ids=new Set();
 for(const c of r.conditions){
  if(!plain(c)||!text(c.id,200)||ids.has(c.id))fail('Transition prerequisite IDs must be unique.');
  ids.add(c.id);
  if(!['UNKNOWN','MISSING','SATISFIED'].includes(c.status)||!Array.isArray(c.dependsOn)||c.dependsOn.length>80||c.dependsOn.some(x=>!text(x,200))||new Set(c.dependsOn).size!==c.dependsOn.length)fail('Transition prerequisite status or dependency list is invalid.');
  for(const key of ['action','criterion'])if(!text(c[key]))fail('Each prerequisite needs an action and observable criterion.');
  if(c.stage!==undefined&&!TRANSITION_STAGES.includes(c.stage))fail('Prerequisite stage is unsupported.');
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
const signature=(r,selected)=>JSON.stringify([r.task,r.requirement,r.subject,selected?.id||'',r.attemptedRoute||'',r.executionConditions||'',r.conditions.map(c=>[c.id,c.status,[...c.dependsOn].sort()]).sort((a,b)=>a[0].localeCompare(b[0]))]);
const frontier=r=>r.conditions.filter(c=>c.status!=='SATISFIED'&&c.dependsOn.every(id=>r.conditions.find(x=>x.id===id).status==='SATISFIED'));

export function inspectTransition(p){
 const checkpoints=allCheckpoints(p),current=checkpoints.at(-1),fields=current?.fields||{};
 let report;
 try{
  if(absent(fields.transition))return {status:'ABSENT'};
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
 const repeated=!!selected&&!!report.attemptedRoute&&!!previous&&signature(report,selected)===signature(previous,previousSelected);
 const satisfied=report.conditions.filter(c=>c.status==='SATISFIED').map(c=>c.id),missing=report.conditions.filter(c=>c.status!=='SATISFIED').map(c=>c.id);
 const priorSatisfied=new Set(previous?.conditions.filter(c=>c.status==='SATISFIED').map(c=>c.id)||[]);
 const resolved=previous&&previous.subject===report.subject?satisfied.filter(id=>!priorSatisfied.has(id)):[];
 const delta=previous&&previous.subject!==report.subject?'SUBJECT_CHANGED':resolved.length?'PREREQUISITE_RESOLVED':repeated?'NO_TRANSITION':previous&&previousSelected?.id!==selected?.id?'PREREQUISITE_MOVED':'REPORTED_STATE';
 const phase=repeated?'INVESTIGATION':selected?(selected.stage||'INVESTIGATION'):report.stage;
 let action=selected?selected.action:report.intendedAction;
 let condition=selected?selected.criterion:'Return the result and evidence for this bounded action; preserve verification, qualification, user acceptance and destination authorization as separate conditions.';
 let reason=selected?'Prerequisite '+selected.id+' is unresolved; its own declared dependencies are satisfied. The intended task remains: '+report.intendedAction:'All declared prerequisites have matching source-reported evidence. Existing requirement checks, permissions and acceptance rules still govern advancement.';
 if(available.length>1)reason+=' Other independent ready prerequisites remain: '+available.slice(1).map(c=>c.id).join(', ')+'.';
 if(repeated){
  action='Establish a materially different permitted route or changed execution condition for prerequisite '+selected.id+': '+selected.action+' The same reported route remains unresolved: '+report.attemptedRoute+'. Do not repeat it under unchanged conditions. Test the availability of the alternative, then perform the bounded action if supported; otherwise identify the exact unmet capability.';
  condition='Evidence that an alternative can execute or that execution conditions changed, followed by the prerequisite result when feasible; a repeated diagnosis alone does not advance the task.';
  reason='The same prerequisite, subject, attempted route and execution conditions remain unresolved across reports. New descriptive findings do not constitute a transition.';
 }
 const trace={schema:'DGB_TRANSITION_TRACE_v1',task:report.task,requirement:report.requirement,subject:report.subject,stage:phase,intendedStage:report.stage,selectedPrerequisite:selected?.id||null,satisfied,missing,resolved,delta,repeated,route:report.attemptedRoute||'',executionConditions:report.executionConditions||'',expectedEvidence:condition,evidenceStanding:'SOURCE_REPORTED',authorityEffect:'NONE'};
 return {status:'VALID',report,selected,phase,action,condition,reason,repeated,trace,evidenceStanding:'SOURCE_REPORTED'};
}

export const TRANSITION_CONTRACT=`TASK TRANSITION: Optional JSON object describing the current bounded task, not a new authority or replacement requirement map. Supply {task,requirement,subject,stage,intendedAction,conditions,attemptedRoute,executionConditions}. Reuse stable task and prerequisite IDs. subject is the exact current result/candidate/document identity and must match RESULT IDENTITY. stage is the intended NEXT stage after all declared conditions are satisfied: INVESTIGATION, READY FOR EXECUTION, EXECUTION, VERIFICATION, QUALIFICATION, USER REVIEW, or RELEASE. Each condition has {id,dependsOn,status,action,criterion}, optional stage (the work needed to resolve that condition; defaults to INVESTIGATION) and blocker (copy the exact active blocker text). For example a qualification prerequisite has stage QUALIFICATION while the report's intended next stage may be USER REVIEW. status is UNKNOWN, MISSING, or SATISFIED. SATISFIED requires reference and subject matching the current result; do not carry checks to changed subjects. Include only actual prerequisites and their evidence; unknown dependency relationships remain unknown. Do not invent dependencies or mark upstream conditions satisfied while their dependencies remain unresolved. Preserve intendedAction while diagnosing a prerequisite. attemptedRoute and executionConditions describe the actual attempt, allowing the next prompt to distinguish a changed route from repetition. Qualification means identifying and checking the applicable selected gates against this exact subject, not generic test success. These are source reports: no transition can create permission, human acceptance, independent authentication or project completion. On later responses return the current complete task object, or omit it when no reliable task map can be established; do not repeat work merely to format this object.`;

export function transitionContext(p,decision){
 const t=inspectTransition(p);
 if(t.status==='INVALID')return 'TASK TRANSITION NEEDS CORRECTION\n'+t.error+' Preserve the original source report; establish only the missing or inconsistent dependency evidence. Do not infer readiness.\n\n'+TRANSITION_CONTRACT;
 if(t.status==='ABSENT')return 'TASK TRANSITION\nNo explicit task prerequisite map is recorded. During the requested work, identify the immediate missing condition and the evidence that would unlock the intended action where useful; do not create a separate mapping ceremony or invent dependency order.\n\n'+TRANSITION_CONTRACT;
 const trace=decision?{...t.trace,stage:decision.phase,expectedEvidence:decision.condition}:t.trace;
 return 'TASK TRANSITION DECISION\n'+JSON.stringify(trace)+'\nSelected action: '+(decision?.action||t.action)+'\nWhy: '+(decision?.reason||t.reason)+'\nPreserved intended action: '+t.report.intendedAction+'\nExpected return: '+(decision?.condition||t.condition)+'\n\n'+TRANSITION_CONTRACT;
}
