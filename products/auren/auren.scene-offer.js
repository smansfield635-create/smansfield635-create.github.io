/* TARGET FILE: /products/auren/auren.scene-offer.js
   AUREN_SUCCESSOR_CONTEXTUAL_SCENE_OFFER_BRIDGE_V1 */
(()=>{"use strict";
const CONTRACT="AUREN_SUCCESSOR_CONTEXTUAL_SCENE_OFFER_BRIDGE_V1";
const CORRIDOR=new Set(["manor","auren","jeeves"]);
const REGISTRY=Object.freeze({manor:"/characters/?scene=manor&entry=fade",auren:"/characters/?scene=auren&entry=fade",jeeves:"/characters/?scene=jeeves&entry=fade"});
const LEARN_SUBJECTS=new Set(["auren:self","mirrorland:auren-domain","manor:people","manor:handoff"]);
function evaluate({sourceNode=null,sessionContext=null,destinationId="manor",inLearnPath=false}={}){
 const route=REGISTRY[destinationId]||null,registryValidated=Boolean(route&&CORRIDOR.has(destinationId));
 const state=sessionContext&&typeof sessionContext.getState==="function"?sessionContext.getState():null;
 const activeSubject=state?.activeSubject||null,activeThread=state?.activeThread||null;
 const subjectRelevant=Boolean(activeSubject&&LEARN_SUBJECTS.has(activeSubject));
 const threadRelevant=Boolean(activeThread&&state?.unresolvedThreads?.some(x=>x.threadId===activeThread));
 const contextual=Boolean(subjectRelevant||threadRelevant);
 const eligible=Boolean(inLearnPath&&registryValidated&&contextual);
 return Object.freeze({contract:CONTRACT,sourceNode,destinationId,destinationRoute:route,registryValidated,inLearnPath,activeSubject,activeThread,subjectRelevant,threadRelevant,contextual,eligible,offered:eligible,reason:!registryValidated?"DESTINATION_REJECTED":!inLearnPath?"NOT_LEARN_PATH":!contextual?"NO_CONTEXTUAL_RELEVANCE":"OFFER_AUTHORIZED_BY_CONTEXT"});
}
Object.defineProperty(globalThis,"AUREN_SCENE_OFFER",{value:Object.freeze({contract:CONTRACT,evaluate,routeFor:id=>REGISTRY[id]||null}),writable:false,configurable:false});
globalThis.dispatchEvent(new CustomEvent("auren:scene-offer-ready",{detail:{contract:CONTRACT}}));
})();