import {validateState,receiveResult,describeProgress,generateContinuation} from './progression.mjs';

// Deliberately memory-only: no persistent storage, cookies, network, models, or telemetry.
// A private project record must not be silently uploaded or persisted by a free web tool.
const element = id => document.getElementById(id);
const ui = Object.fromEntries(['project-input','report-input','preview','apply','copy','reset','status','advanced','remaining','decision','continuation'].map(id=>[id,element(id)]));
let staged=null,accepted=null;
function status(message){ui.status.textContent=message;}
function entry(title,description,metadata=''){
  const root=document.createElement('article');root.className='entry';
  const head=document.createElement('strong');head.textContent=title;root.append(head);
  const body=document.createElement('p');body.textContent=description;root.append(body);
  if(metadata){const foot=document.createElement('small');foot.textContent=metadata;root.append(foot);}
  return root;
}
function replace(container,items,fallback){container.replaceChildren(...(items.length?items:[document.createTextNode(fallback)]));}
function render(state){
  const view=describeProgress(state);
  replace(ui.advanced,view.whatAdvanced.map(e=>entry(`${e.kind} · ${e.eventId}`,e.details,`${e.verification} · ${e.assignedMilestoneId??'Unassigned evidence'}${e.artifact?' · '+e.artifact:''}`)),'No new evidence in the latest result.');
  const remaining=view.whatRemains;
  replace(ui.remaining,remaining?[entry(remaining.title,remaining.objective,remaining.acceptanceCriteria.join('; '))]:[],'No unfinished milestone identified. Do not infer project completion.');
  ui.decision.textContent=view.whereUserComesIn??'No new decision required for this step.';
  ui.continuation.textContent=generateContinuation(state);
  ui.copy.disabled=false;
}
function reset(){staged=null;accepted=null;ui['project-input'].value='';ui['report-input'].value='';ui.apply.disabled=true;ui.copy.disabled=true;ui.advanced.textContent='No new evidence yet.';ui.remaining.textContent='No project yet.';ui.decision.textContent='No decision required yet.';ui.continuation.textContent='Load a project and preview a result.';status('Tab cleared.');}
ui.preview.addEventListener('click',()=>{
  try{
    const base=JSON.parse(ui['project-input'].value);
    validateState(base);
    const responseText=ui['report-input'].value.trim();
    const candidate=responseText?receiveResult(base,JSON.parse(responseText)):base;
    staged=candidate;ui.apply.disabled=false;render(candidate);
    const p=describeProgress(candidate);
    status(`Preview only. ${p.unassignedEvidenceCount} unassigned evidence event(s); no server changes.`);
  }catch(error){staged=null;ui.apply.disabled=true;ui.copy.disabled=true;status(`Validation failed: ${error.code??'INVALID_INPUT'} — ${error.message}`);}
});
ui.apply.addEventListener('click',()=>{
  if(!staged)return;
  accepted=structuredClone(staged);
  ui['project-input'].value=JSON.stringify(accepted,null,2);
  ui['report-input'].value='';ui.apply.disabled=true;
  status('Updated in this tab only. No external project records or website files were changed.');
});
ui.copy.addEventListener('click',async()=>{
  if(!staged&&!accepted)return;
  try{await navigator.clipboard.writeText(ui.continuation.textContent);status('Continuation copied.');}
  catch{status('Copy unavailable; select and copy continuation text manually.');}
});
ui.reset.addEventListener('click',reset);
