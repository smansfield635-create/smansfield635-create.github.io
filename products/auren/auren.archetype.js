/* TARGET FILE: /products/auren/auren.archetype.js
   AUREN_C3_3_VISITOR_ARCHETYPE_EVIDENCE_V1 */
(()=>{"use strict";
const CONTRACT="AUREN_C3_3_VISITOR_ARCHETYPE_EVIDENCE_V1",NAMES=Object.freeze(["Strategist","Builder","Mitigator","Auditor"]),OPS=new Set(["OBSERVE","CLAIM","RESET_ARCHETYPE_EVIDENCE"]),LIMIT=32;
const zero=()=>({Strategist:0,Builder:0,Mitigator:0,Auditor:0});let vector=zero(),observations=[],claimedPrimary=null,claimedSupport=null,revision=0,lastReceipt=null;
const validName=x=>NAMES.includes(x);
function derive(){
 const count=observations.length,rank=NAMES.map(name=>({name,value:vector[name]})).sort((a,b)=>b.value-a.value||NAMES.indexOf(a.name)-NAMES.indexOf(b.name));
 if(count<3)return{provisionalPrimary:null,provisionalSupport:null,disposition:"INSUFFICIENT",confidence:"NONE"};
 const top=rank[0],second=rank[1],topTie=rank.filter(x=>x.value===top.value).length>1,secondTie=rank.filter(x=>x.value===second.value).length>1;
 const disposition=top.value-second.value<=1?"MIXED":"LEADING";
 const provisionalPrimary=topTie?null:top.name,provisionalSupport=second.value>0&&!secondTie?second.name:null;
 let confidence="LOW";if(disposition==="LEADING"&&count>=8&&top.value-second.value>=3)confidence="HIGH";else if(disposition==="LEADING"&&count>=5)confidence="MODERATE";
 return{provisionalPrimary,provisionalSupport,disposition,confidence};
}
const snapshot=()=>Object.freeze({contract:CONTRACT,vector:Object.freeze({...vector}),observations:Object.freeze(observations.map(x=>Object.freeze({...x,evidence:Object.freeze({...x.evidence}),previousVector:Object.freeze({...x.previousVector}),nextVector:Object.freeze({...x.nextVector})}))),claimedPrimary,claimedSupport,...derive(),revision,lastReceipt});
function reject(op,reason){const r=Object.freeze({contract:CONTRACT,accepted:false,operation:op||null,reason,revision});lastReceipt=r;return r}
function apply(input={}){
 const op=input.operation;if(!OPS.has(op))return reject(op,"UNKNOWN_OPERATION_FAIL_CLOSED");
 if(op==="RESET_ARCHETYPE_EVIDENCE"){vector=zero();observations=[];claimedPrimary=null;claimedSupport=null;revision++;const r=Object.freeze({contract:CONTRACT,accepted:true,operation:op,reason:"RESET_ACCEPTED",revision});lastReceipt=r;return r}
 if(op==="CLAIM"){const p=input.claimedPrimary??null,s=input.claimedSupport??null;if((p&&!validName(p))||(s&&!validName(s))||(p&&s&&p===s))return reject(op,"INVALID_CLAIM_FAIL_CLOSED");claimedPrimary=p;claimedSupport=s;revision++;const r=Object.freeze({contract:CONTRACT,accepted:true,operation:op,reason:"CLAIM_ACCEPTED",revision});lastReceipt=r;return r}
 const ev=input.evidence;if(!ev||typeof ev!=="object"||Array.isArray(ev))return reject(op,"INVALID_EVIDENCE_FAIL_CLOSED");const keys=Object.keys(ev);if(!keys.length||keys.length>2||keys.some(k=>!validName(k)||ev[k]!==1))return reject(op,"INVALID_EVIDENCE_FAIL_CLOSED");
 const previousVector={...vector};for(const k of keys)vector[k]++;revision++;const nextVector={...vector};observations=[...observations,Object.freeze({sourceNode:input.sourceNode||null,choiceId:input.choiceId||null,evidence:{...ev},previousVector,nextVector,resultingRevision:revision})].slice(-LIMIT);
 const r=Object.freeze({contract:CONTRACT,accepted:true,operation:op,reason:"OBSERVATION_ACCEPTED",revision});lastReceipt=r;return r;
}
const api=Object.freeze({contract:CONTRACT,ledgerLimit:LIMIT,names:NAMES,getState:snapshot,apply,observe:(x={})=>apply({...x,operation:"OBSERVE"}),claim:(x={})=>apply({...x,operation:"CLAIM"}),reset:()=>apply({operation:"RESET_ARCHETYPE_EVIDENCE"})});
Object.defineProperty(globalThis,"AUREN_ARCHETYPE_EVIDENCE",{value:api,writable:false,configurable:false});globalThis.dispatchEvent(new CustomEvent("auren:archetype-ready",{detail:{contract:CONTRACT}}));
})();