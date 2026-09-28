/* TARGET FILE: /products/auren/auren.chamber.js
   TNT FULL-FILE REPLACEMENT
   AUREN_PROGRESSIVE_CONVERSATION_RUNTIME_PROOF2_v1 */
(()=>{"use strict";
const CONTRACT="AUREN_PROGRESSIVE_CONVERSATION_RUNTIME_PROOF2_v1";
const q=(s,r=document)=>r.querySelector(s);
const empty=n=>{while(n&&n.firstChild)n.removeChild(n.firstChild);};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const reduced=()=>typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function bubble(text,kind="auren"){const n=document.createElement("div");n.className="auren-bubble auren-bubble-"+kind;const b=document.createElement("div");b.className="auren-bubble-body";b.textContent=text;n.appendChild(b);return n;}
function scroll(thread){thread.scrollTop=thread.scrollHeight;}
async function boot(){
 const root=q("[data-auren-chamber]"),thread=q("[data-auren-thread]"),options=q("[data-auren-options]");
 const voice=globalThis.AUREN_CHAMBER_VOICE,env=globalThis.AUREN_ROOM_ENVIRONMENT,pres=globalThis.AUREN_ROOM_PRESENTATION;
 if(!root||!thread||!options||!voice||!env||!pres)return;
 env.mount(root);pres.mount(q("[data-auren-room]"));empty(thread);empty(options);
 let busy=true,current="root",sequence=0;
 const wait=ms=>sleep(reduced()?0:ms);
 const thinking=()=>{const n=bubble("Auren …","system");n.setAttribute("data-auren-thinking","true");thread.appendChild(n);scroll(thread);return n;};
 async function speak(messages,token){
   for(let i=0;i<messages.length;i++){
     if(token!==sequence)return false;
     const t=thinking();await wait(i?520:700);if(token!==sequence)return false;t.remove();
     thread.appendChild(bubble(messages[i]));scroll(thread);
     if(i<messages.length-1)await wait(850);
   }
   return token===sequence;
 }
 function renderOptions(nodeId){
   current=nodeId;empty(options);
   voice.getOptions(nodeId).slice(0,3).forEach(p=>{const b=document.createElement("button");b.type="button";b.className="auren-option";b.textContent=p.label;b.addEventListener("click",()=>choose(p.id));options.appendChild(b);});
   root.setAttribute("data-auren-node",nodeId);root.setAttribute("data-auren-options-ready",options.childElementCount?"true":"false");busy=false;
 }
 async function choose(id){
   if(busy)return;const node=voice.getNode(id);if(!node)return;
   busy=true;sequence++;const token=sequence;empty(options);root.setAttribute("data-auren-options-ready","false");
   thread.appendChild(bubble(node.prompt||id,"visitor"));scroll(thread);
   const ok=await speak(node.responses||[],token);if(!ok)return;
   if(node.route){const a=document.createElement("a");a.className="auren-option";a.href=node.route;a.textContent="Enter ARCHCOIN";options.appendChild(a);root.setAttribute("data-auren-options-ready","true");busy=false;return;}
   renderOptions(id);
 }
 const token=sequence;
 await speak(voice.opening.slice(0,2),token);
 if(token===sequence)renderOptions("root");
 root.setAttribute("data-auren-ready","true");
 globalThis.AUREN_CHAMBER_RECEIPT=Object.freeze({contract:CONTRACT,ready:true,voice:voice.contract,geometry:globalThis.AUREN_ROOM_GEOMETRY.contract,presentation:pres.getReceipt(),environment:env.getReceipt(),conversationPrimary:true,progressiveRuntime:true,maxContextualChoices:3,qualificationCorridors:Object.freeze(["products>archcoin>archcoinWhat","about>who>protect"])});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();