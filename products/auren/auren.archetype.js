/* TARGET FILE: /products/auren/auren.archetype.js
   AUREN_SUCCESSOR_NATURAL_ARCHETYPE_OBSERVATION_V1 */
(()=>{"use strict";
const CONTRACT="AUREN_SUCCESSOR_NATURAL_ARCHETYPE_OBSERVATION_V1",NAMES=Object.freeze(["Strategist","Builder","Mitigator","Auditor"]),LIMIT=32;
const zero=()=>({Strategist:0,Builder:0,Mitigator:0,Auditor:0});let vector=zero(),observations=[],revision=0,lastReceipt=null;
const CUES=Object.freeze({
 "helpRoom":Object.freeze({Builder:1}),
 "helpRoomDone":Object.freeze({Builder:1,Auditor:1}),
 "room":Object.freeze({Builder:1}),
 "work":Object.freeze({Mitigator:1}),
 "who":Object.freeze({Strategist:1}),
 "mirrorland":Object.freeze({Strategist:1}),
 "privacyLimited":Object.freeze({Mitigator:1,Auditor:1}),
 "privacyPress":Object.freeze({Auditor:1}),
 "archcoinCapabilities":Object.freeze({Auditor:1}),
 "educationHow":Object.freeze({Strategist:1}),
 "nutritionPrototype":Object.freeze({Builder:1}),
 "nutritionOpen":Object.freeze({Auditor:1})
});
function derive(){const count=observations.length,rank=NAMES.map(name=>({name,value:vector[name]})).sort((a,b)=>b.value-a.value||NAMES.indexOf(a.name)-NAMES.indexOf(b.name));if(count<3)return{provisionalPrimary:null,provisionalSupport:null,disposition:"INSUFFICIENT",confidence:"NONE"};const top=rank[0],second=rank[1],topTie=rank.filter(x=>x.value===top.value).length>1,secondTie=rank.filter(x=>x.value===second.value).length>1;return{provisionalPrimary:topTie?null:top.name,provisionalSupport:second.value>0&&!secondTie?second.name:null,disposition:top.value-second.value<=1?"MIXED":"LEADING",confidence:count>=8&&top.value-second.value>=3?"HIGH":count>=5&&top.value>second.value?"MODERATE":"LOW"};}
const snapshot=()=>Object.freeze({contract:CONTRACT,vector:Object.freeze({...vector}),observations:Object.freeze(observations.map(x=>Object.freeze({...x,evidence:Object.freeze({...x.evidence})}))),...derive(),revision,lastReceipt});
function observeAction({sourceNode=null,choiceId=null}={}){const evidence=CUES[choiceId]||null;if(!evidence){const r=Object.freeze({contract:CONTRACT,accepted:false,operation:"OBSERVE_NATURAL_ACTION",reason:"NO_CANONICAL_CUE",revision});lastReceipt=r;return r;}const previousVector={...vector};for(const k of Object.keys(evidence))vector[k]++;revision++;observations=[...observations,Object.freeze({sourceNode,choiceId,evidence:{...evidence},previousVector,nextVector:{...vector},resultingRevision:revision})].slice(-LIMIT);const r=Object.freeze({contract:CONTRACT,accepted:true,operation:"OBSERVE_NATURAL_ACTION",reason:"NATURAL_ACTION_OBSERVED",revision});lastReceipt=r;return r;}
function reset(){vector=zero();observations=[];revision++;const r=Object.freeze({contract:CONTRACT,accepted:true,operation:"RESET",reason:"RESET_ACCEPTED",revision});lastReceipt=r;return r;}
const api=Object.freeze({contract:CONTRACT,ledgerLimit:LIMIT,names:NAMES,getState:snapshot,observeAction,observe:observeAction,reset,cues:CUES});
Object.defineProperty(globalThis,"AUREN_ARCHETYPE_EVIDENCE",{value:api,writable:false,configurable:false});globalThis.dispatchEvent(new CustomEvent("auren:archetype-ready",{detail:{contract:CONTRACT}}));
})();