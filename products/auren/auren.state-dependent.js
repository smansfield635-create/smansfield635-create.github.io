/* TARGET FILE: /products/auren/auren.state-dependent.js
   AUREN_SUCCESSOR_CONTEXTUAL_SELECTION_BRIDGE_V1
   Transitional successor authority: no global relationship phase/mask selection. */
(()=>{"use strict";
const CONTRACT="AUREN_SUCCESSOR_CONTEXTUAL_SELECTION_BRIDGE_V1";
function select(node,context={},archetype={}){
 const variants=node?.variants||null;
 const neutral=variants?.PUBLIC_MASK?.neutral||node?.responses||[];
 const selected=Array.isArray(neutral)&&neutral.length?neutral:(node?.responses||[]);
 const state=context&&typeof context.getState==="function"?context.getState():null;
 return Object.freeze({
  responses:Object.freeze([...(selected||[])]),
  receipt:Object.freeze({
   contract:CONTRACT,
   sourceNode:node?.id||null,
   selectionAuthority:"AUREN_CANON_PLUS_CONTEXT",
   relationshipPhase:null,
   maskBand:null,
   archetypeDisposition:archetype?.disposition||"UNUSED_FOR_DIALOGUE_SELECTION",
   archetypeConfidence:archetype?.confidence||"UNUSED_FOR_DIALOGUE_SELECTION",
   eligibleFraming:false,
   selectedFraming:"neutral",
   selectedVariant:variants?.PUBLIC_MASK?.neutral?"legacy-neutral-reconciled":"baseline",
   sessionRevision:state?.revision??null,
   activeSubject:state?.activeSubject??null,
   activeThread:state?.activeThread??null,
   fallbackUsed:false,
   reason:"GLOBAL_PHASE_AND_ARCHETYPE_BANKS_NON_AUTHORITATIVE"
  })
 });
}
Object.defineProperty(globalThis,"AUREN_STATE_DEPENDENT",{value:Object.freeze({contract:CONTRACT,select}),writable:false,configurable:false});
globalThis.dispatchEvent(new CustomEvent("auren:state-dependent-ready",{detail:{contract:CONTRACT}}));
})();