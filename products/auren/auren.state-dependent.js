/* TARGET FILE: /products/auren/auren.state-dependent.js
   AUREN_C3_4_STATE_DEPENDENT_AUREN_V1 */
(()=>{"use strict";
const CONTRACT="AUREN_C3_4_STATE_DEPENDENT_AUREN_V1",MASK={PUBLIC:"PUBLIC_MASK",ENGAGED:"OPEN_MASK",GUARDED:"PROTECTIVE_MASK"},ARCH=new Set(["Strategist","Builder","Mitigator","Auditor"]);
function select(node,relationship,archetype){
 const phase=MASK[relationship?.phase]?relationship.phase:"PUBLIC",maskBand=MASK[phase],eligible=archetype?.disposition==="LEADING"&&["MODERATE","HIGH"].includes(archetype?.confidence)&&ARCH.has(archetype?.provisionalPrimary);
 const framing=eligible?archetype.provisionalPrimary:"neutral",variants=node?.variants||null,band=variants?.[maskBand]||null;let selected=band?.[framing]||band?.neutral||null,fallbackUsed=false,reason="EXACT_AUTHORED_VARIANT";
 if(!selected){selected=node?.responses||[];fallbackUsed=true;reason="BASELINE_FALLBACK";}
 return Object.freeze({responses:Object.freeze([...(selected||[])]),receipt:Object.freeze({contract:CONTRACT,sourceNode:node?.id||null,relationshipPhase:phase,maskBand,archetypeDisposition:archetype?.disposition||"INSUFFICIENT",archetypeConfidence:archetype?.confidence||"NONE",eligibleFraming:eligible,selectedFraming:selected===band?.[framing]&&framing!=="neutral"?framing:"neutral",selectedVariant:selected===band?.[framing]?maskBand+":"+framing:selected===band?.neutral?maskBand+":neutral":"baseline",fallbackUsed,reason})});
}
Object.defineProperty(globalThis,"AUREN_STATE_DEPENDENT",{value:Object.freeze({contract:CONTRACT,select}),writable:false,configurable:false});globalThis.dispatchEvent(new CustomEvent("auren:state-dependent-ready",{detail:{contract:CONTRACT}}));
})();