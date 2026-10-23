/* DiamondGate Preflight Studio | native browser adapter.
 * Owner-inspection candidate rebuilt against preserved HTML, not identical to lost draft. */
(function(){
"use strict";
const core=window.PreflightCore;
const storageKey="diamondgate-preflight-studio-v0.1-local";
const el=id=>document.getElementById(id);
const fields=["projectName","category","goal","model","customModel","duration"];
const refs={};for(const id of [...fields,"protectedList","allowedList","protectedInput","allowedInput","protectedCount","allowedCount","intentBadge","integrityDesc","techBadge","techDesc","continuityBadge","continuityDesc","changesSummary","approvalMessage","approveLabel","approveBtn","suggestionBox","suggestionList","outputBox","preparedText","durationField","resetBtn","suggestBtn","prepareBtn","copyBtn","addProtected","addAllowed"])refs[id]=el(id);
if(!core||!refs.goal||!refs.approveBtn){document.body.dataset.startup="error";throw new Error("Preflight required DOM/core unavailable");}
const presets={
  trees:{projectName:"Interactive sanctuary",category:"3d",goal:"Expand a walkable interactive world with coherent vegetation, preserving its existing geography and interaction.",protected:["Keep the established terrain, river, and navigation intact.","Do not replace approved scene assets without consent."],allowed:["Add appropriate native vegetation in previously open spaces."],model:"Unspecified / Other",duration:""},
  video:{projectName:"Cinematic sequence",category:"video",goal:"Create a cinematic scene with consistent subjects, atmosphere, and camera movement.",protected:["Preserve the approved subject identity throughout the sequence.","Do not change the agreed story or framing silently."],allowed:["Adjust lighting and natural environmental motion."],model:"Unspecified / Other",duration:"8"},
  app:{projectName:"Customer-facing application",category:"app",goal:"Create an accessible application that helps customers manage their existing information without disrupting their current workflows.",protected:["Existing user data must not be deleted.","Keep essential navigation and accessibility intact."],allowed:["Improve layout and clarify instructions."],model:"Unspecified / Other",duration:""}
};
let record={...core.snapshot({category:"3d",model:"Unspecified / Other"}),approvedSnapshot:null,approvedAt:""};
function load(){
  try{const data=JSON.parse(localStorage.getItem(storageKey)||"null");return core.safeStored(data);}catch{return null;}
}
const recovered=load();if(recovered)record=recovered;
function save(){try{localStorage.setItem(storageKey,JSON.stringify(record));}catch{/* Storage unavailable: remain functional in memory. */}}
function setField(id,value){record[id]=value;invalidateOutput();save();render();}
function current(){return core.snapshot(record);}
function state(){return core.compare(record.approvedSnapshot,current());}
function statusBadge(target,title,kind){target.textContent=title;target.className="state-badge"+(kind?" "+kind:"");}
function invalidateOutput(){refs.outputBox.hidden=true;refs.preparedText.textContent="";}
function fillList(name){
  const target=refs[name+"List"],items=core.distinct(record[name]);target.replaceChildren();refs[name+"Count"].textContent=String(items.length);
  if(items.length===0){const li=document.createElement("li");li.className="empty";li.textContent=name==="protected"?"No protected requirements yet.":"No permitted changes listed.";target.append(li);return;}
  items.forEach((value,index)=>{
    const li=document.createElement("li"),label=document.createElement("span"),remove=document.createElement("button");
    label.textContent=value;remove.type="button";remove.textContent="×";remove.setAttribute("aria-label","Remove "+(name==="protected"?"protected":"permitted")+" requirement: "+value);
    remove.addEventListener("click",()=>{record[name]=items.filter((_,i)=>i!==index);invalidateOutput();save();render();});
    li.append(label,remove);target.append(li);
  });
}
function render(){
  for(const id of fields){const value=record[id]??"";if(refs[id].value!==String(value))refs[id].value=String(value);}
  refs.durationField.hidden=record.category!=="video";
  fillList("protected");fillList("allowed");
  const s=state(),valid=core.validateApproval(record),tech=core.compatibility(record);
  statusBadge(refs.techBadge,"Unverified","neutral");refs.techDesc.textContent=tech.explanation;
  if(!record.approvedSnapshot){statusBadge(refs.intentBadge,"Draft","neutral");refs.integrityDesc.textContent="Waiting for your approval";statusBadge(refs.continuityBadge,"Not started","neutral");refs.continuityDesc.textContent="Nothing approved yet";refs.changesSummary.textContent="Approve a first version to track meaningful revisions here.";}
  else if(s.changed){statusBadge(refs.intentBadge,"Review needed","warn");refs.integrityDesc.textContent="Current intent differs from your approved record";statusBadge(refs.continuityBadge,"Changed","warn");refs.continuityDesc.textContent="Renew approval to continue";refs.changesSummary.textContent=s.changes.join("; ")+". These changes are not yet approved.";}
  else{statusBadge(refs.intentBadge,"User approved","good");refs.integrityDesc.textContent="This exact local intent was approved";statusBadge(refs.continuityBadge,"Preserved","good");refs.continuityDesc.textContent="Current input matches the approved baseline";refs.changesSummary.textContent="No changes against the locally approved snapshot.";}
  refs.approveLabel.textContent=record.approvedSnapshot&&!s.changed?"Approved — reaffirm intent":"Approve this intent";
  refs.approvalMessage.textContent=valid.ok?"Approval is explicit and local; it is not a signed kernel proof.":valid.reason;
  refs.approveBtn.disabled=!valid.ok;
}
function add(name){
  const field=refs[name+"Input"],value=core.plain(field.value);
  if(!value)return;
  const other=name==="protected"?"allowed":"protected";
  if(core.distinct(record[other]).some(x=>x.toLowerCase()===value.toLowerCase())){refs.approvalMessage.textContent="This item cannot be both protected and permitted.";return;}
  record[name]=core.distinct([...(record[name]||[]),value]);field.value="";invalidateOutput();save();render();field.focus();
}
function suggestions(){
  refs.suggestionBox.hidden=!refs.suggestionBox.hidden;
  if(refs.suggestionBox.hidden)return;
  refs.suggestionList.replaceChildren();
  const existing=core.distinct(record.protected).map(x=>x.toLowerCase());
  const items=core.suggestions(record.goal).filter(x=>!existing.includes(x.toLowerCase()));
  if(items.length===0){const msg=document.createElement("p");msg.textContent="No new suggestions for this description.";refs.suggestionList.append(msg);}
  for(const suggestion of items){
    const b=document.createElement("button");b.type="button";b.textContent="+ Add: "+suggestion;
    b.addEventListener("click",()=>{record.protected=core.distinct([...(record.protected||[]),suggestion]);invalidateOutput();save();render();suggestions();});refs.suggestionList.append(b);
  }
}
fields.forEach(id=>refs[id].addEventListener(id==="goal"||id==="projectName"||id==="customModel"||id==="duration"?"input":"change",()=>setField(id,refs[id].value)));
refs.addProtected.addEventListener("click",()=>add("protected"));
refs.addAllowed.addEventListener("click",()=>add("allowed"));
[["protectedInput","protected"],["allowedInput","allowed"]].forEach(([id,name])=>refs[id].addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();add(name);}}));
refs.suggestBtn.addEventListener("click",suggestions);
document.querySelectorAll("[data-preset]").forEach(button=>button.addEventListener("click",()=>{
  const selected=presets[button.dataset.preset];if(!selected)return;
  record={...core.snapshot(selected),approvedSnapshot:record.approvedSnapshot,approvedAt:record.approvedAt};
  refs.suggestionBox.hidden=true;invalidateOutput();save();render();refs.goal.focus();
}));
refs.approveBtn.addEventListener("click",()=>{
  const check=core.validateApproval(record);
  if(!check.ok){refs.approvalMessage.textContent=check.reason;return;}
  record.approvedSnapshot=current();record.approvedAt=new Date().toISOString();invalidateOutput();save();render();
  refs.approvalMessage.textContent="You approved this local intent snapshot. Revisions will be compared against it.";
});
refs.prepareBtn.addEventListener("click",()=>{
  const output=core.prepare(record,record.approvedSnapshot);
  if(!output.ok){refs.outputBox.hidden=true;refs.approvalMessage.textContent=output.reason;refs.approveBtn.focus();return;}
  refs.preparedText.textContent=output.text;refs.outputBox.hidden=false;
});
refs.copyBtn.addEventListener("click",async()=>{
  const value=refs.preparedText.textContent;if(!value)return;
  try{if(!navigator.clipboard?.writeText)throw new Error("unavailable");await navigator.clipboard.writeText(value);refs.copyBtn.textContent="Copied";}
  catch{refs.copyBtn.textContent="Select and copy the instructions above";}
});
refs.resetBtn.addEventListener("click",()=>{
  record={...core.snapshot({category:"3d",model:"Unspecified / Other"}),approvedSnapshot:null,approvedAt:""};
  try{localStorage.removeItem(storageKey);}catch{}
  refs.suggestionBox.hidden=true;invalidateOutput();render();refs.approvalMessage.textContent="Local draft cleared.";
});
render();
document.body.dataset.startup="ready";
})();
