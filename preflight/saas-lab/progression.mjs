/**
 * DiamondGate bounded progression component (standalone, pure data layer).
 * NOT the private DiamondGate Site source; integrate only after inspecting it.
 * No model calls, network, file I/O, mutation, grant of authority, or content-specific heuristics.
 */

const STATUSES = new Set(['pending','active','reported_complete','verified_complete','awaiting_review']);
const STANDINGS = new Set(['proposed','approved']);
const EVENT_KINDS = new Set(['FINDING','RESULT','LIMITATION','VERIFICATION','DECISION']);
const MATERIAL_ACTIONS = new Set(['implementation','merge','deployment','publication']);
const VALID_TRANSITIONS = {
  pending: new Set(['active','reported_complete','verified_complete','awaiting_review']),
  active: new Set(['reported_complete','verified_complete','awaiting_review']),
  reported_complete: new Set(['verified_complete','awaiting_review']),
  verified_complete: new Set(['awaiting_review']),
  awaiting_review: new Set(['verified_complete'])
};

export class ProgressionError extends Error {
  constructor(code, message){ super(message); this.name='ProgressionError'; this.code=code; }
}
const assert=(ok,code,message)=>{if(!ok)throw new ProgressionError(code,message);};
const clone=x=>structuredClone(x);
const nonEmpty=x=>typeof x==='string'&&x.trim().length>0;
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const isComplete=x=>x.status==='reported_complete'||x.status==='verified_complete';
const allMilestones=s=>s.requirements.flatMap(r=>r.milestones.map(m=>({requirement:r,milestone:m})));
const getMilestone=(s,id)=>allMilestones(s).find(x=>x.milestone.id===id);
const getEvent=(s,id)=>s.events.find(e=>e.id===id);

export function validateState(state){
  assert(state&&typeof state==='object','INVALID_STATE','State must be an object');
  assert(nonEmpty(state.projectId)&&nonEmpty(state.projectName),'INVALID_PROJECT','Project ID and name required');
  assert(Array.isArray(state.requirements),'INVALID_REQUIREMENTS','REQUIREMENTS must be a JSON array');
  assert(Array.isArray(state.events)&&Array.isArray(state.history)&&Array.isArray(state.attempts),'INVALID_COLLECTION','Events, history and attempts must be arrays');
  const ids=new Set();
  for(const r of state.requirements){
    assert(nonEmpty(r.id)&&nonEmpty(r.title)&&STANDINGS.has(r.standing),'INVALID_REQUIREMENT','Requirement ID, title, and standing required');
    assert(!ids.has('r:'+r.id),'DUPLICATE_REQUIREMENT',r.id);ids.add('r:'+r.id);
    assert(Array.isArray(r.milestones),'INVALID_MILESTONES','Milestones must be arrays');
    r.milestones.forEach((m,i)=>{
      assert(nonEmpty(m.id)&&nonEmpty(m.title)&&nonEmpty(m.objective)&&STATUSES.has(m.status),'INVALID_MILESTONE','Milestone ID/title/objective/status required');
      assert(Number.isInteger(m.order)&&m.order>=0,'INVALID_MILESTONE_ORDER','Milestone order must be a nonnegative integer');
      assert(Array.isArray(m.acceptanceCriteria)&&m.acceptanceCriteria.every(nonEmpty),'INVALID_ACCEPTANCE_CRITERIA','Milestone acceptance criteria required');
      assert(Array.isArray(m.prerequisites??[])&&Array.isArray(m.evidenceIds??[]),'INVALID_MILESTONE','Invalid milestone references');
      assert(!ids.has('m:'+m.id),'DUPLICATE_MILESTONE',m.id);ids.add('m:'+m.id);
    });
  }
  for(const {milestone:m} of allMilestones(state)){
    for(const p of m.prerequisites??[])assert(Boolean(getMilestone(state,p)),'UNKNOWN_PREREQUISITE',p);
    for(const e of m.evidenceIds??[])assert(Boolean(getEvent(state,e)),'UNKNOWN_EVIDENCE',e);
  }
  const seen=new Set();
  for(const e of state.events){
    assert(nonEmpty(e.id)&&EVENT_KINDS.has(e.kind)&&nonEmpty(e.details),'INVALID_EVENT','Event ID/kind/details required');
    assert(!seen.has(e.id),'DUPLICATE_EVENT',e.id);seen.add(e.id);
    if(e.requirementId!=null)assert(state.requirements.some(r=>r.id===e.requirementId),'UNKNOWN_REQUIREMENT',e.id);
    if(e.milestoneId!=null){const found=getMilestone(state,e.milestoneId);assert(found&&found.requirement.id===e.requirementId,'UNKNOWN_MILESTONE',e.id);}
  }
  if(state.activeMilestoneId!=null)assert(Boolean(getMilestone(state,state.activeMilestoneId)),'UNKNOWN_ACTIVE_MILESTONE',state.activeMilestoneId);
  assert(Array.isArray(state.verificationLedger??[]),'INVALID_VERIFICATION_LEDGER','Trusted verification ledger must be an array');
  assert(Array.isArray(state.userDecisions??[]),'INVALID_USER_DECISIONS','Trusted user-decision ledger must be an array');
  return true;
}

function addEvent(s,raw){
  assert(raw&&nonEmpty(raw.id)&&nonEmpty(raw.details)&&EVENT_KINDS.has(raw.kind),'INVALID_EVENT','Incoming event malformed');
  const e=clone(raw);
  // Unknown or absent IDs are preserved as unassigned evidence, never completion credit.
  const id=nonEmpty(e.requirementId)&&e.requirementId!=='UNKNOWN'?e.requirementId:null;
  const mid=nonEmpty(e.milestoneId)&&e.milestoneId!=='UNKNOWN'?e.milestoneId:null;
  if(id===null||mid===null){e.requirementId=null;e.milestoneId=null;e.assignment='UNASSIGNED';}
  else {
    const m=getMilestone(s,mid);
    assert(Boolean(m)&&m.requirement.id===id,'INVALID_EVIDENCE_LINK','Unknown or mismatched milestone/requirement for '+e.id);
    e.assignment='EXPLICIT';
  }
  e.verification=e.verification??'source_reported';
  assert(['source_reported','independently_checked','user_accepted'].includes(e.verification),'INVALID_VERIFICATION','Invalid verification');
  const previous=getEvent(s,e.id);
  if(previous){assert(canonical(previous)===canonical(e),'CONFLICTING_EVENT_ID','Conflicting event payload '+e.id);return false;}
  s.events.push(e);
  if(e.assignment==='EXPLICIT'){
    const milestone=getMilestone(s,e.milestoneId).milestone;
    milestone.evidenceIds??=[];if(!milestone.evidenceIds.includes(e.id))milestone.evidenceIds.push(e.id);
  }
  return true;
}

function linkEvidence(s,assignment){
  assert(assignment&&nonEmpty(assignment.eventId)&&nonEmpty(assignment.requirementId)&&nonEmpty(assignment.milestoneId)&&nonEmpty(assignment.rationale),'INVALID_EVIDENCE_ASSIGNMENT','Evidence assignment needs exact IDs and rationale');
  const event=getEvent(s,assignment.eventId),found=getMilestone(s,assignment.milestoneId);
  assert(event&&found&&found.requirement.id===assignment.requirementId,'INVALID_EVIDENCE_ASSIGNMENT','Unknown event, milestone or mismatched requirement');
  if(event.assignment==='EXPLICIT'){
    assert(event.requirementId===assignment.requirementId&&event.milestoneId===assignment.milestoneId,'CONFLICTING_EVIDENCE_ASSIGNMENT','A different existing link cannot be silently replaced');
    return;
  }
  event.requirementId=assignment.requirementId;
  event.milestoneId=assignment.milestoneId;
  event.assignment='EXPLICIT';
  event.assignmentBasis='RECEIVING_AI_PROPOSAL';
  event.assignmentRationale=assignment.rationale;
  found.milestone.evidenceIds??=[];
  if(!found.milestone.evidenceIds.includes(event.id))found.milestone.evidenceIds.push(event.id);
}

function canActivate(s,m){return (m.prerequisites??[]).every(p=>isComplete(getMilestone(s,p).milestone));}

function updateMilestone(s,update){
  assert(update&&nonEmpty(update.milestoneId)&&STATUSES.has(update.status),'INVALID_MILESTONE_UPDATE','Milestone update malformed');
  const resolved=getMilestone(s,update.milestoneId);
  assert(Boolean(resolved),'UNKNOWN_MILESTONE',update.milestoneId);
  const m=resolved.milestone;
  if(m.status===update.status)return;
  assert(VALID_TRANSITIONS[m.status]?.has(update.status),'INVALID_STATUS_TRANSITION',m.id+': '+m.status+' to '+update.status);
  assert(canActivate(s,m),'UNMET_PREREQUISITES','Milestone has unfinished prerequisites');
  // A report can recommend a scoped closure. This is NOT a verified requirement completion.
  if(['reported_complete','verified_complete'].includes(update.status)){
    assert(Array.isArray(update.evidenceEventIds)&&update.evidenceEventIds.length>0,'COMPLETION_WITHOUT_EVIDENCE','Explicit evidence event IDs required');
    for(const eid of update.evidenceEventIds){
      const event=getEvent(s,eid);
      assert(event?.milestoneId===m.id,'EVIDENCE_WRONG_MILESTONE','Event does not support milestone '+eid);
      if(update.status==='verified_complete'){
        // Self-reported verification labels are not sufficient. Receipts enter through
        // an independently controlled verifier/connector ledger in SAVED state.
        const receipt=(s.verificationLedger??[]).find(v=>v.eventId===event.id&&v.verified===true&&nonEmpty(v.reference)&&v.evidenceDigest===event.artifact);
        assert(event.verification==='independently_checked'&&receipt,'UNVERIFIED_COMPLETION','Trusted matching verification-ledger entry required');
      }
    }
  }
  if(m.requiresHumanAcceptance&&update.status==='verified_complete'){
    // AI result text is not the source of user authorization or acceptance.
    const accepted=(s.userDecisions??[]).some(d=>d.milestoneId===m.id&&d.decision==='ACCEPT'&&nonEmpty(d.reference)&&d.confirmedFromUser===true);
    assert(accepted,'USER_ACCEPTANCE_REQUIRED','Existing trusted user decision required');
  }
  m.status=update.status;
  m.progressBasis=update.status==='reported_complete'?'source_reported':update.status==='verified_complete'?'independently_checked':'declared';
  if(update.status==='reported_complete')m.reportedCompletionEvidenceIds=[...update.evidenceEventIds];
  if(update.status==='verified_complete')m.verifiedCompletionEvidenceIds=[...update.evidenceEventIds];
}

export function receiveResult(original, report){
  validateState(original);
  assert(report&&nonEmpty(report.id),'INVALID_REPORT','Unique receiving-room report ID required');
  assert(Array.isArray(report.events??[])&&Array.isArray(report.evidenceAssignments??[])&&Array.isArray(report.milestoneUpdates??[])&&Array.isArray(report.attempts??[]),'INVALID_REPORT','Invalid report event/update arrays');
  const existing=original.history.find(h=>h.id===report.id);
  if(existing){
    assert(existing.fingerprint===canonical(report),'CONFLICTING_REPORT_ID','Same report ID with changed content');
    return clone(original);
  }
  const next=clone(original),newEvents=[];
  for(const event of report.events??[])if(addEvent(next,event))newEvents.push(event.id);
  for(const assignment of report.evidenceAssignments??[])linkEvidence(next,assignment);
  for(const update of report.milestoneUpdates??[])updateMilestone(next,update);
  for(const attempt of report.attempts??[]){
    assert(nonEmpty(attempt.id)&&nonEmpty(attempt.milestoneId)&&Boolean(getMilestone(next,attempt.milestoneId)),'INVALID_ATTEMPT','Invalid attempt binding');
    if(next.attempts.some(x=>x.id===attempt.id)){
      assert(canonical(next.attempts.find(x=>x.id===attempt.id))===canonical(attempt),'CONFLICTING_ATTEMPT','Attempt ID conflict');
    }else next.attempts.push(clone(attempt));
  }
  if(report.suggestedNextMilestoneId!=null){
    const target=getMilestone(next,report.suggestedNextMilestoneId);
    assert(Boolean(target),'INVALID_NEXT_MILESTONE','Unknown next milestone');
    assert(!isComplete(target.milestone),'COMPLETED_MILESTONE_TARGET','Cannot target completed milestone');
    assert(canActivate(next,target.milestone),'UNMET_PREREQUISITES','Cannot target milestone before prerequisites');
    next.activeMilestoneId=target.milestone.id;
    if(target.milestone.status==='pending'&&(!MATERIAL_ACTIONS.has(target.milestone.actionClass)||next.authorizations?.[target.milestone.actionClass]===true))target.milestone.status='active';
  }
  const currentEvidence=newEvents.map(id=>getEvent(next,id)).filter(Boolean);
  const findings=currentEvidence.filter(e=>e.kind!=='LIMITATION');
  const latestSummary=findings.length?findings.map(e=>`${e.kind}: ${e.details}`).join(' | '):
    currentEvidence.length?`Attempt limitations: ${currentEvidence.map(e=>e.details).join(' | ')}`:
    report.milestoneUpdates?.length?`Milestone updates recorded: ${report.milestoneUpdates.map(u=>u.milestoneId+' '+u.status).join(', ')}`:
    report.attempts?.length?`Execution attempts recorded: ${report.attempts.map(a=>a.id+' '+a.outcome).join(', ')}`:
    'No new requirement evidence or milestone progress in this response';
  // Current accomplishment follows newly accepted evidence, not a stale
  // incoming COMPLETED WORK/RESULT IDENTITY field. The AI text remains in history.
  const latest={id:report.id,summary:latestSummary,reportedSummary:report.summary??null,outcome:report.outcome??'UNKNOWN',newEventIds:newEvents,resultArtifact:report.resultArtifact??null,at:report.at??null};
  // Historical COMPLETE WORK and RESULT IDENTITY fields are never carried as current.
  next.history.push({id:report.id,fingerprint:canonical(report),latest:clone(latest)});
  next.latestActivity=latest;
  validateState(next);
  return next;
}

export function selectContinuation(state){
  validateState(state);
  const all=allMilestones(state);
  const active=state.activeMilestoneId?getMilestone(state,state.activeMilestoneId):null;
  const eligible=x=>!isComplete(x.milestone)&&canActivate(state,x.milestone);
  let selection=active&&eligible(active)?active:null;
  if(!selection)selection=all.filter(eligible).sort((a,b)=>{
    const ax=a.milestone.status==='active'?0:1,bx=b.milestone.status==='active'?0:1;
    return ax-bx||a.milestone.order-b.milestone.order;
  })[0]??null;
  if(!selection)return {status:'NO_OPEN_MILESTONE',target:null,authorization:'NONE'};
  const action=selection.milestone.actionClass??'investigation';
  const permitted= !MATERIAL_ACTIONS.has(action)||state.authorizations?.[action]===true;
  return {
    status:permitted?'READY':'AUTHORIZATION_REQUIRED',
    target:{requirementId:selection.requirement.id,requirementTitle:selection.requirement.title,requirementStanding:selection.requirement.standing,milestoneId:selection.milestone.id,milestoneTitle:selection.milestone.title,objective:selection.milestone.objective,acceptanceCriteria:[...selection.milestone.acceptanceCriteria],actionClass:action},
    authorization:permitted?'PERMITTED_IN_SAVED_STATE':'REQUIRED_BEFORE_EXECUTION'
  };
}

function choiceMilestone(state,selected){return selected.target?getMilestone(state,selected.target.milestoneId)?.milestone:null;}

export function describeProgress(state){
  const selected=selectContinuation(state);
  const recent=(state.latestActivity?.newEventIds??[]).map(id=>getEvent(state,id)).filter(Boolean);
  const unassigned=state.events.filter(e=>e.assignment==='UNASSIGNED');
  const objective=(state.goal??'').trim();
  const selectedMilestone=choiceMilestone(state,selected);
  return {
    projectId:state.projectId,
    latestAccomplishment:state.latestActivity?{...state.latestActivity}:null,
    whatAdvanced:recent.filter(e=>e.kind!=='LIMITATION').map(e=>({eventId:e.id,kind:e.kind,details:e.details,verification:e.verification,artifact:e.artifact??null,reference:e.reference??null,assignedMilestoneId:e.milestoneId??null})),
    attemptLimitations:recent.filter(e=>e.kind==='LIMITATION').map(e=>({eventId:e.id,details:e.details})),
    whatRemains:selected.target?{milestoneId:selected.target.milestoneId,title:selected.target.milestoneTitle,objective:selected.target.objective,acceptanceCriteria:selected.target.acceptanceCriteria}:null,
    whereUserComesIn:selected.status==='AUTHORIZATION_REQUIRED'?'Authorization required before material execution':(selectedMilestone?.requiresHumanAcceptance||selectedMilestone?.status==='awaiting_review')?'Human acceptance remains required':null,
    unassignedEvidenceCount:unassigned.length,
    reportedEvidenceCount:state.events.filter(e=>e.verification==='source_reported').length,
    widerObjective:objective,
    continuation:selected
  };
}

export function generateContinuation(state){
  const view=describeProgress(state),choice=view.continuation;
  if(!choice.target)return `CONTINUATION — ${state.projectName}\nNo unfinished milestone identified. Preserve evidence; do not infer project completion.`;
  const t=choice.target,lines=[
    `CONTINUATION PROMPT — ${state.projectName}`,
    `CURRENT UNFINISHED MILESTONE: ${t.milestoneTitle} (${t.milestoneId})`,
    `REQUIREMENT: ${t.requirementTitle} (${t.requirementId}, ${t.requirementStanding.toUpperCase()})`,
    `INTENDED OUTCOME: ${t.objective}`,
    `COMPLETION CONDITION: ${t.acceptanceCriteria.join('; ')}`
  ];
  const recent=view.whatAdvanced;
  if(recent.length){lines.push('RECENT EVIDENCE (preserve, do not repeat):');for(const e of recent.slice(-6))lines.push(`- ${e.eventId} [${e.verification}]: ${e.details}${e.artifact?' | artifact: '+e.artifact:''}${e.reference?' | source: '+e.reference:''}`);}
  const old=state.requirements.flatMap(r=>r.milestones.filter(m=>isComplete(m)).map(m=>m.title));
  if(old.length)lines.push(`COMPLETED WITHIN RECORDED SCOPE (do not restart): ${old.slice(-8).join('; ')}`);
  if(choice.status==='AUTHORIZATION_REQUIRED')lines.push(`AUTHORIZATION BOUNDARY: ${t.actionClass} not authorized; request applicable authorization rather than executing material changes.`);
  else lines.push('AUTHORIZATION BOUNDARY: Apply saved permissions; no new authority is created by this prompt.');
  lines.push(`WIDER OBJECTIVE: ${view.widerObjective}`);
  lines.push('The receiving AI selects the permitted technical method. Do not substitute failed execution routes or historical reconciliation for the unfinished milestone. Report new evidence and remaining uncertainties.');
  return lines.join('\n\n');
}
