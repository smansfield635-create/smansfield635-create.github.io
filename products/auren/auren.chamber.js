/* TARGET FILE: /products/auren/auren.chamber.js
   AUREN_C2_TIMED_CONVERSATION_RUNTIME_V1 */
(()=>{"use strict";
const CONTRACT="AUREN_C2_TIMED_CONVERSATION_RUNTIME_V1";
const q=(s,r=document)=>r.querySelector(s),empty=n=>{while(n&&n.firstChild)n.removeChild(n.firstChild);};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const reduced=()=>typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function bubble(text,kind="auren"){const n=document.createElement("div");n.className="auren-bubble auren-bubble-"+kind;const b=document.createElement("div");b.className="auren-bubble-body";b.textContent=text;n.appendChild(b);return n;}
function typing(){const n=document.createElement("div");n.className="auren-bubble auren-bubble-auren auren-typing";n.setAttribute("aria-label","Auren is typing");const b=document.createElement("div");b.className="auren-typing-dots";b.innerHTML="<i></i><i></i><i></i>";n.appendChild(b);return n;}
async function boot(){
 const root=q("[data-auren-chamber]"),thread=q("[data-auren-thread]"),options=q("[data-auren-options]");const voice=globalThis.AUREN_CHAMBER_VOICE,env=globalThis.AUREN_ROOM_ENVIRONMENT,pres=globalThis.AUREN_ROOM_PRESENTATION;if(!root||!thread||!options||!voice||!env||!pres)return;
 env.mount(root);pres.mount(q("[data-auren-room]"));empty(thread);empty(options);let busy=true,sequence=0,current="root";const history=[];
 const wait=ms=>sleep(reduced()?Math.min(120,ms):ms);
 const reading=text=>Math.min(1200,650+Math.max(0,String(text).length-45)*5);
 function stage(visitor){empty(thread);if(visitor)thread.appendChild(bubble(visitor,"visitor"));root.setAttribute("data-auren-active-turn",String(history.length));}
 async function perform(visitor,messages,token){
  stage(visitor);root.setAttribute("data-auren-performance","LISTENING");await wait(450);if(token!==sequence)return false;
  for(let i=0;i<messages.length;i++){
   root.setAttribute("data-auren-performance","TYPING");const t=typing();thread.appendChild(t);await wait(i?600:760);if(token!==sequence)return false;t.remove();
   root.setAttribute("data-auren-performance","SPEAKING");thread.appendChild(bubble(messages[i]));if(i<messages.length-1){await wait(reading(messages[i]));if(token!==sequence)return false;}
  }
  root.setAttribute("data-auren-performance","READING_PAUSE");await wait(480);return token===sequence;
 }
 function renderOptions(nodeId){current=nodeId;empty(options);for(const p of voice.getOptions(nodeId).slice(0,3)){const b=document.createElement("button");b.type="button";b.className="auren-option";b.textContent=p.label;b.addEventListener("click",()=>choose(p.id));options.appendChild(b);}root.setAttribute("data-auren-node",nodeId);root.setAttribute("data-auren-options-ready",options.childElementCount?"true":"false");root.setAttribute("data-auren-performance","CHOICES");busy=false;}
 async function choose(id){if(busy)return;const node=voice.getNode(id);if(!node)return;busy=true;sequence++;const token=sequence;empty(options);root.setAttribute("data-auren-options-ready","false");history.push(Object.freeze({from:current,to:id,prompt:node.prompt||id}));const ok=await perform(node.prompt||id,node.responses||[],token);if(!ok)return;
  if(node.route){const a=document.createElement("a");a.className="auren-option";a.href=node.route;a.textContent="Open ARCHCOIN";options.appendChild(a);const back=document.createElement("button");back.type="button";back.className="auren-option";back.textContent="Back to Products";back.addEventListener("click",()=>choose("products"));options.appendChild(back);root.setAttribute("data-auren-options-ready","true");root.setAttribute("data-auren-performance","CHOICES");busy=false;return;}renderOptions(id);}
 sequence++;const token=sequence;const ok=await perform(null,voice.opening,token);if(ok)renderOptions("root");root.setAttribute("data-auren-ready","true");
 globalThis.AUREN_CHAMBER_RECEIPT=Object.freeze({contract:CONTRACT,ready:true,voice:voice.contract,geometry:globalThis.AUREN_ROOM_GEOMETRY.contract,presentation:pres.getReceipt(),environment:env.getReceipt(),conversationPrimary:true,progressiveRuntime:true,boundedActiveStage:true,timedPerformance:true,typingIndicator:true,choicesDelayedUntilTurnComplete:true,maxContextualChoices:3,historyMode:"MEMORY_NOT_ACTIVE_TRANSCRIPT"});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
