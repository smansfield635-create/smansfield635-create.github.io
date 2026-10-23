/* DiamondGate Preflight v2: first-use value before optional continuity.
 * Only deterministic rules; no model call, provider guarantee or implied approval. */
(function(){
"use strict";
const core=window.PreflightCore;
const $=id=>document.getElementById(id);
const ids=["idea","checkBtn","formMessage","assessmentPanel","taskLabel","recognizedIdea","questionList","flagsPanel","flagsList","methodNote","prepareBtn","resultPanel","preparedText","copyBtn","copyMessage","saveBaselineBtn","baselineMessage","continuityDetails","revisionPanel","revisionText","startOverBtn"];
const refs=Object.fromEntries(ids.map(id=>[id,$(id)]));
if(!core?.assessFirstUse||Object.values(refs).some(x=>!x)){
 document.body.dataset.startup="error";throw new Error("Preflight first-use dependencies missing");
}
const storageKey="diamondgate-preflight-first-use-v2-local";
const examples={
 video:"I want to create a 20-second commercial for my bakery using AI.",
 app:"Build a simple appointment-booking app that customers can use.",
 world:"Create a 3D riverside world with realistic plants and paths people can explore."
};
let report=null,answers={},prepared="",baseline=null;
try{const stored=JSON.parse(localStorage.getItem(storageKey)||"null");if(stored&&typeof stored.key==="string"&&stored.key.length<12000)baseline={key:stored.key,date:String(stored.date||"")};}catch{}
function replaceText(node,value){node.textContent=String(value??"");}
function scrollToPanel(node){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)node.scrollIntoView({block:"start"});else node.scrollIntoView({behavior:"smooth",block:"start"});}
function clearOutput(){prepared="";refs.resultPanel.hidden=true;replaceText(refs.preparedText,"");replaceText(refs.copyMessage,"");}
function revisionNotice(){
 if(!baseline){refs.revisionPanel.hidden=true;return;}
 const id=core.firstUseIdentity(report,answers);
 let changed=!id||id!==baseline.key;
 if(report&&core.plain(refs.idea.value)!==report.idea)changed=true;
 refs.revisionPanel.hidden=!changed;
 if(changed)replaceText(refs.revisionText,"This differs from the version you saved on this device. Review it before saving a new baseline.");
}
function updateResultOnChange(){
 clearOutput();revisionNotice();
 if(report&&core.plain(refs.idea.value)!==report.idea){
   refs.assessmentPanel.hidden=true;
   replaceText(refs.formMessage,"The idea changed. Check it again for relevant suggestions.");
 }
}
refs.idea.addEventListener("input",updateResultOnChange);
function renderReport(next){
 report=next;answers={};clearOutput();
 refs.assessmentPanel.hidden=false;
 const labels={video:"Video / animation",app:"App / website",world:"3D world",image:"Image / design",writing:"Writing",audio:"Audio",agent:"Automation",general:"AI task"};
 replaceText(refs.taskLabel,labels[next.kind]||"AI task");
 replaceText(refs.recognizedIdea,next.idea);
 refs.questionList.replaceChildren();
 for(const q of next.questions){
  const section=document.createElement("div");section.className="question";
  const label=document.createElement("label");label.htmlFor="choice-"+q.id;label.textContent=q.title;
  const why=document.createElement("p");why.textContent=q.why;
  const select=document.createElement("select");select.id="choice-"+q.id;select.name=q.id;
  const placeholder=document.createElement("option");placeholder.value="";placeholder.textContent="Skip for now / not decided";select.append(placeholder);
  for(const value of q.options){const option=document.createElement("option");option.value=value;option.textContent=value;select.append(option);}
  select.addEventListener("change",()=>{answers[q.id]=select.value;clearOutput();revisionNotice();});
  section.append(label,why,select);refs.questionList.append(section);
 }
 refs.flagsPanel.hidden=next.flags.length===0;refs.flagsList.replaceChildren();
 for(const flag of next.flags){const li=document.createElement("li");li.textContent=flag;refs.flagsList.append(li);}
 replaceText(refs.methodNote,next.method);
 replaceText(refs.formMessage,"");
 revisionNotice();
 scrollToPanel(refs.assessmentPanel);
}
function checkIdea(){
 const next=core.assessFirstUse(refs.idea.value);
 if(!next.ok){report=null;refs.assessmentPanel.hidden=true;clearOutput();replaceText(refs.formMessage,next.error);refs.idea.focus();revisionNotice();return;}
 renderReport(next);
}
refs.checkBtn.addEventListener("click",checkIdea);
refs.idea.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();checkIdea();}});
document.querySelectorAll("[data-example]").forEach(button=>button.addEventListener("click",()=>{
 const value=examples[button.dataset.example];if(!value)return;
 refs.idea.value=value;checkIdea();
}));
refs.prepareBtn.addEventListener("click",()=>{
 if(!report||core.plain(refs.idea.value)!==report.idea){replaceText(refs.formMessage,"Check the current idea before preparing it.");refs.idea.focus();return;}
 const ready=core.makeFirstRequest(report,answers);
 if(!ready.ok){replaceText(refs.formMessage,ready.error);return;}
 prepared=ready.text;replaceText(refs.preparedText,prepared);
 refs.resultPanel.hidden=false;replaceText(refs.copyMessage,"");replaceText(refs.baselineMessage,"");
 revisionNotice();scrollToPanel(refs.resultPanel);
});
refs.copyBtn.addEventListener("click",async()=>{
 if(!prepared)return;
 try{
  if(!navigator.clipboard?.writeText)throw new Error("Clipboard API unavailable");
  await navigator.clipboard.writeText(prepared);
  replaceText(refs.copyMessage,"Copied. Paste it into your AI tool.");
 }catch{
  replaceText(refs.copyMessage,"Copy isn't available in this browser. Select the request text above and use Copy.");
  refs.preparedText.focus();
 }
});
refs.saveBaselineBtn.addEventListener("click",()=>{
 if(!prepared||!report){replaceText(refs.baselineMessage,"Prepare a request before saving it.");return;}
 const key=core.firstUseIdentity(report,answers);
 if(!key){replaceText(refs.baselineMessage,"Cannot save an unverified draft.");return;}
 const date=new Date().toISOString();
 try{
  localStorage.setItem(storageKey,JSON.stringify({key,date}));
  baseline={key,date};
  replaceText(refs.baselineMessage,"Saved on this device. New changes will need another explicit save.");
  revisionNotice();
 }catch{
  replaceText(refs.baselineMessage,"Local storage is unavailable. The request has not been saved.");
 }
});
refs.startOverBtn.addEventListener("click",()=>{
 refs.idea.value="";report=null;answers={};refs.assessmentPanel.hidden=true;clearOutput();
 replaceText(refs.formMessage,"");refs.continuityDetails.open=false;revisionNotice();
 scrollToPanel(refs.idea);refs.idea.focus();
});
document.body.dataset.startup="ready";
})();
