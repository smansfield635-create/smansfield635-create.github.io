import {archiveHistory} from './history.mjs';
import {parsePacket,parseReturnedResponse,mergePacket,normalizeName,projectName,packetValue,uid} from './packet.mjs';
import {assessUpdate,applyReviewed,informationStepReady} from './progression.mjs';

const known=s=>String(s||'').trim()&&!/^(none|unknown|not supplied|not known|n\/a)[.!]?$/i.test(String(s).trim());
// Display only. The complete accepted action remains in storage and in prompts.
export function actionTitle(action){if(/^Reconcile returned report [a-zA-Z0-9_-]+ with the accepted project history/.test(String(action||'')))return 'Match the returned findings to saved receipts.';const line=String(action||'').split(/\r?\n/).map(s=>s.replace(/^\s*[-*•]\s*/, '').trim()).find(Boolean)||'Clarify the next unfinished step.';return line.length>150?line.slice(0,147).trimEnd()+'…':line;}
export function inspectResponse(p,raw,{reassess=false}={}){
 if(!reassess&&p.flow.log.at(-1)?.raw.trim()===raw.trim())return {duplicate:true};
 const incoming=parseReturnedResponse(raw,p),merged=mergePacket(p.checkpoints.at(-1),incoming),assessment=assessUpdate(p,incoming,merged),reasons=[];
 if(!known(incoming.fields.project)||normalizeName(incoming.fields.project)!==normalizeName(projectName(p)))reasons.push('The response does not identify this project. Confirm its project identity.');
 if(incoming.fields.baseline!==p.checkpoints.at(-1).id)reasons.push('The response does not contain the current project baseline. Confirm which record it belongs to.');
 for(const finding of assessment.findings){
  if(finding.kind==='conflict'||finding.kind==='drift'&&!finding.text.startsWith('Files or evidence'))reasons.push(finding.text);
 }
 const explicitCompletion=packetValue(incoming.fields.outcome,['COMPLETED','PARTIAL','BLOCKED','FAILED','NO_CHANGE','UNKNOWN'])==='COMPLETED'||packetValue(incoming.fields.status,['READY','BLOCKED','COMPLETE','UNKNOWN'])==='COMPLETE';
 if(explicitCompletion&&!known(incoming.fields.verification)&&!known(incoming.fields.artifacts)&&!assessment.evidenceAdvance)reasons.push('The response reports completion without verification details or evidence references.');
 if(packetValue(incoming.fields.status,['READY','BLOCKED','COMPLETE','UNKNOWN'])==='COMPLETE'&&assessment.blockers.length)reasons.push('The response reports completion while an unresolved blocker is recorded.');
 return {incoming,merged,assessment,reasons:[...new Set(reasons)]};
}
// Scope changes can wait for user judgment without withholding factual findings.
function factualCandidate(p,inspected){
 if(inspected.duplicate)return null;
 const keys=['goal','decisions','authorization'].filter(k=>inspected.merged.diff.includes(k));
 if(!keys.length)return inspected.reasons.length?null:inspected;
 if(!informationStepReady(inspected.incoming.fields.next,inspected.incoming.fields.access||p.flow.access))return null;
 const scopeMessages=keys.map(k=>k==='decisions'?'Decision statements changed. Check for contradictions; earlier decisions stay until explicitly released.':(k==='goal'?'The project objective':'Reported authorization boundaries')+' changed. Confirm that this is within the requested scope.');
 if(inspected.reasons.some(x=>!scopeMessages.includes(x)))return null;
 const incoming={...inspected.incoming,fields:{...inspected.incoming.fields}};
 for(const k of keys)incoming.fields[k]='';
 const merged=mergePacket(p.checkpoints.at(-1),incoming),assessment=assessUpdate(p,incoming,merged);
 const unchangedProposal=keys.every(key=>p.flow.scopeProposals?.some(x=>x.key===key&&x.value===inspected.incoming.fields[key]));
 if(assessment.kind!=='PROGRESS'&&!(assessment.kind==='NO_CHANGE'&&unchangedProposal)||assessment.findings.some(x=>x.kind==='conflict'||x.kind==='drift'&&!x.text.startsWith('Files or evidence')))return null;
 return {incoming,merged,assessment,reasons:[],heldKeys:keys.filter(key=>!p.flow.scopeProposals?.some(x=>x.key===key&&x.value===inspected.incoming.fields[key])),original:inspected.incoming};
}
function applyCandidate(p,candidate){
 const prior=p.checkpoints.at(-1),result=applyReviewed(p,candidate.incoming,candidate.merged,candidate.assessment,{recordMode:'AUTO_RECORDED'});
 if(candidate.heldKeys?.length){
  const proposals=new Map((p.flow.scopeProposals||[]).map(x=>[x.key,x]));
  for(const key of candidate.heldKeys)proposals.set(key,{key,value:candidate.original.fields[key],original:prior.fields[key]||'',sourceId:p.flow.log.at(-1).id});
  p.flow.scopeProposals=[...proposals.values()];
 }
 return {...candidate,result,proposalsHeld:!!candidate.heldKeys?.length};
}
export function recordResponse(p,raw){
 const inspected=inspectResponse(p,raw);if(inspected.duplicate)return inspected;
 const candidate=factualCandidate(p,inspected);
 return candidate?applyCandidate(p,candidate):inspected;
}
export function scopeProposalPacket(p){
 const proposals=p.flow.scopeProposals||[];
 if(!proposals.length)throw Error('No direction changes are pending.');
 return 'PROJECT: '+projectName(p)+'\nBASELINE: '+p.checkpoints.at(-1).id+'\nTASK OUTCOME: PARTIAL\n'+proposals.map(x=>({goal:'GOAL',decisions:'ACCEPTED DECISIONS',authorization:'AUTHORIZATION BOUNDARIES'})[x.key]+': '+x.value).join('\n')+'\nSOURCE: User review of saved proposal(s); original reports preserved in activity '+[...new Set(proposals.map(x=>x.sourceId))].join(', ');
}
export function dismissScopeProposals(p){
 archiveHistory(p);
 p.flow.log.push({id:uid(),at:new Date().toISOString(),baseline:p.checkpoints.at(-1).id,kind:'SCOPE_REVIEW',status:p.flow.status,outcome:'NO_CHANGE',raw:'',note:'User kept the accepted direction; unaccepted proposals remain in the original source reports.'});
 p.flow.scopeProposals=[];
}

// A bounded repair of the latest legacy attempt only. Never replay across a user
// decision, accepted checkpoint or pending exception, and never bypass identity review.
export function reconcileSavedFindings(p){
 const last=p.flow.log.at(-1);
 if(p.flow.reviewPending||!last||!['NO_CHANGE','ATTEMPT_ONLY'].includes(last.kind)||last.baseline!==p.checkpoints.at(-1).id)return null;
 let inspected;try{inspected=inspectResponse(p,last.raw,{reassess:true});}catch{return null;}
 const candidate=factualCandidate(p,inspected);
 if(!candidate||candidate.assessment.kind!=='PROGRESS')return null;
 const replayed=applyCandidate(p,candidate);
 Object.assign(p.flow.log.at(-1),{reconciledFrom:last.id,attemptId:last.attemptId||null,attemptAction:last.attemptAction||'',sourceBaseline:last.baseline});
 return replayed;
}
