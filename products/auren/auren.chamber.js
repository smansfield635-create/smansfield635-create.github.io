/* TARGET FILE: /products/auren/auren.chamber.js
   AUREN_C1_BOUNDED_ACTIVE_CONVERSATION_RUNTIME_v1 */
(()=>{"use strict";
const CONTRACT="AUREN_C1_BOUNDED_ACTIVE_CONVERSATION_RUNTIME_v1";
const q=(s,r=document)=>r.querySelector(s),empty=n=>{while(n&&n.firstChild)n.removeChild(n.firstChild);};
const reduced=()=>typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function bubble(text,kind="auren"){const n=document.createElement("div");n.className="auren-bubble auren-bubble-"+kind;const b=document.createElement("div");b.className="auren-bubble-body";b.textContent=text;n.appendChild(b);return n;}
async function boot(){
 const root=q("[data-auren-chamber]"),thread=q("[data-auren-thread]"),options=q("[data-auren-options]");
 const voice=globalThis.AUREN_CHAMBER_VOICE,env=globalThis.AUREN_ROOM_ENVIRONMENT,pres=globalThis.AUREN_ROOM_PRESENTATION;
 if(!root||!thread||!options||!voice||!env||!pres)return;
 env.mount(root);pres.mount(q("[data-auren-room]"));empty(thread);empty(options);
 let busy=true,sequence=0,current="root";const history=[];
 const wait=ms=>sleep(reduced()?0:ms);
 function renderStage(visitor,responses){empty(thread);if(visitor)thread.appendChild(bubble(visitor,"visitor"));for(const text of responses)thread.appendChild(bubble(text));root.setAttribute("data-auren-active-turn",String(history.length));}
 function renderOptions(nodeId){current=nodeId;empty(options);for(const p of voice.getOptions(nodeId).slice(0,3)){const b=document.createElement("button");b.type="button";b.className="auren-option";b.textContent=p.label;b.addEventListener("click",()=>choose(p.id));options.appendChild(b);}root.setAttribute("data-auren-node",nodeId);root.setAttribute("data-auren-options-ready",options.childElementCount?"true":"false");busy=false;}
 async function choose(id){
  if(busy)return;const node=voice.getNode(id);if(!node)return;busy=true;sequence++;const token=sequence;empty(options);root.setAttribute("data-auren-options-ready","false");
  const previous=current;renderStage(node.prompt||id,["Auren …"]);await wait(260);if(token!==sequence)return;
  history.push(Object.freeze({from:previous,to:id,prompt:node.prompt||id,responses:Object.freeze([...(node.responses||[])])}));
  renderStage(node.prompt||id,node.responses||[]);
  if(node.route){const a=document.createElement("a");a.className="auren-option";a.href=node.route;a.textContent="Open ARCHCOIN";options.appendChild(a);const back=document.createElement("button");back.type="button";back.className="auren-option";back.textContent="Back to Products";back.addEventListener("click",()=>choose("products"));options.appendChild(back);root.setAttribute("data-auren-options-ready","true");busy=false;return;}
  renderOptions(id);
 }
 renderStage(null,voice.opening);await wait(180);renderOptions("root");
 root.setAttribute("data-auren-ready","true");
 globalThis.AUREN_CHAMBER_RECEIPT=Object.freeze({contract:CONTRACT,ready:true,voice:voice.contract,geometry:globalThis.AUREN_ROOM_GEOMETRY.contract,presentation:pres.getReceipt(),environment:env.getReceipt(),conversationPrimary:true,progressiveRuntime:true,boundedActiveStage:true,maxContextualChoices:3,historyMode:"MEMORY_NOT_ACTIVE_TRANSCRIPT",getHistoryCount:()=>history.length});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
