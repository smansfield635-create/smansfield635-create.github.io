/* AUREN_SPATIAL_CHAMBER_ORCHESTRATION_PROOF1_v1 */
(()=>{"use strict";
const CONTRACT="AUREN_SPATIAL_CHAMBER_ORCHESTRATION_PROOF1_v1";
const q=(s,r=document)=>r.querySelector(s),empty=n=>{while(n&&n.firstChild)n.removeChild(n.firstChild);};
function bubble(text,kind="auren"){const n=document.createElement("div");n.className="auren-bubble auren-bubble-"+kind;const b=document.createElement("div");b.className="auren-bubble-body";b.textContent=text;n.appendChild(b);return n;}
function boot(){
 const root=q("[data-auren-chamber]"),thread=q("[data-auren-thread]"),options=q("[data-auren-options]");
 const voice=globalThis.AUREN_CHAMBER_VOICE,env=globalThis.AUREN_ROOM_ENVIRONMENT,pres=globalThis.AUREN_ROOM_PRESENTATION;
 if(!root||!thread||!options||!voice||!env||!pres)return;
 env.mount(root);pres.mount(q("[data-auren-room]"));
 empty(thread);voice.opening.forEach(x=>thread.appendChild(bubble(x)));
 function prompts(){empty(options);voice.prompts.forEach(p=>{const b=document.createElement("button");b.type="button";b.className="auren-option";b.textContent=p.label;b.addEventListener("click",()=>respond(p.id));options.appendChild(b);});}
 function respond(id){thread.appendChild(bubble(voice.prompts.find(p=>p.id===id)?.label||id,"visitor"));voice.response(id).forEach(x=>thread.appendChild(bubble(x)));if(id==="protected"){const r=document.createElement("button");r.type="button";r.className="auren-option auren-reveal";r.textContent="Show me what you mean.";r.addEventListener("click",()=>{env.reveal();thread.appendChild(bubble("Show me what you mean.","visitor"));voice.revealResponse.forEach(x=>thread.appendChild(bubble(x)));prompts();});empty(options);options.appendChild(r);}else prompts();thread.scrollTop=thread.scrollHeight;}
 prompts();root.setAttribute("data-auren-ready","true");
 globalThis.AUREN_CHAMBER_RECEIPT=Object.freeze({contract:CONTRACT,ready:true,voice:voice.contract,geometry:globalThis.AUREN_ROOM_GEOMETRY.contract,presentation:pres.getReceipt(),environment:env.getReceipt(),conversationPrimary:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();