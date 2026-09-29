/* TARGET FILE: /products/auren/auren.relationship.js
   AUREN_C3_2_RELATIONSHIP_STATE_FOUNDATION_V1 */
(()=>{"use strict";
const CONTRACT="AUREN_C3_2_RELATIONSHIP_STATE_FOUNDATION_V1",ACTIONS=new Set(["ENGAGE","FOLLOW_UP","RESPECT_BOUNDARY","CHALLENGE","RETREAT","PRY","RESET"]),LIMIT=32;
let phase="PUBLIC",revision=0,events=[],lastTransition=null;
const next=(p,a)=>{if(a==="RESET")return"PUBLIC";if(a==="RETREAT")return"PUBLIC";if(a==="PRY")return"GUARDED";if(p==="GUARDED")return a==="RESPECT_BOUNDARY"?"ENGAGED":"GUARDED";return["ENGAGE","FOLLOW_UP","RESPECT_BOUNDARY","CHALLENGE"].includes(a)?"ENGAGED":p};
const snapshot=()=>Object.freeze({contract:CONTRACT,mode:phase==="PUBLIC"?"PUBLIC":"RELATIONSHIP",phase,events:Object.freeze(events.map(x=>Object.freeze({...x}))),revision,lastTransition});
function transition(input={}){
 const action=input.action,previousPhase=phase,previousRevision=revision,base={contract:CONTRACT,action:action||null,sourceNode:input.sourceNode||null,choiceId:input.choiceId||null,previousPhase,previousRevision};
 if(!ACTIONS.has(action)){const receipt=Object.freeze({...base,accepted:false,nextPhase:previousPhase,nextRevision:previousRevision,reason:"UNKNOWN_ACTION_FAIL_CLOSED"});lastTransition=receipt;return receipt;}
 if(action==="RESET"){phase="PUBLIC";events=[];revision++;const receipt=Object.freeze({...base,accepted:true,nextPhase:phase,nextRevision:revision,reason:"RESET_ACCEPTED"});lastTransition=receipt;return receipt;}
 const nextPhase=next(phase,action);revision++;const event=Object.freeze({action,sourceNode:base.sourceNode,choiceId:base.choiceId,previousPhase,nextPhase,resultingRevision:revision});events=[...events,event].slice(-LIMIT);
 phase=nextPhase;const receipt=Object.freeze({...base,accepted:true,nextPhase,nextRevision:revision,reason:"AUTHORED_ACTION_ACCEPTED"});lastTransition=receipt;return receipt;
}
const api=Object.freeze({contract:CONTRACT,ledgerLimit:LIMIT,getState:snapshot,transition,reset:()=>transition({action:"RESET",sourceNode:"SYSTEM",choiceId:"RESET"})});
Object.defineProperty(globalThis,"AUREN_RELATIONSHIP",{value:api,writable:false,configurable:false});
globalThis.dispatchEvent(new CustomEvent("auren:relationship-ready",{detail:{contract:CONTRACT}}));
})();