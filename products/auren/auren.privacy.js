(()=>{"use strict";
const VERSION="AUREN_SUCCESSOR_REPEATABLE_MANOR_PRIVACY_V1",SCENARIO="PRIVACY_BOUNDARY_001",SOURCE="AUREN_VALE_SANCTUARY_BUILDER_V1:CUSTODY:HIDDEN_RESIDENT_PROTECTION",LIMIT=32;
const C=Object.freeze({
 "respect-boundary":Object.freeze({choiceSemantic:"RESPECT_BOUNDARY",privacyConsequence:Object.freeze({boundaryPosture:"RESPECTED",disclosureScope:"AUREN_RESPONSIBILITY_ONLY",protectedInformationRequested:false,continuation:"LAWFUL_CONTEXT"})}),
 "limited-context":Object.freeze({choiceSemantic:"REQUEST_LIMITED_CONTEXT",privacyConsequence:Object.freeze({boundaryPosture:"OBSERVED",disclosureScope:"NON_IDENTIFYING_CONTEXT",protectedInformationRequested:false,continuation:"LAWFUL_CONTEXT"})}),
 "press-protected":Object.freeze({choiceSemantic:"PRESS_PROTECTED_INFORMATION",privacyConsequence:Object.freeze({boundaryPosture:"PRESSED",disclosureScope:"REFUSED",protectedInformationRequested:true,continuation:"BOUNDARY_REASSERTED"})})
});
let revision=0,events=[],lastReceipt=null;
function apply(e={}){
 let accepted=false,reason,choice=null;
 if(e.type!=="CHOOSE_PRIVACY_RESPONSE")reason="UNKNOWN_EVENT_FAIL_CLOSED";
 else if(e.scenarioId!==SCENARIO)reason="UNKNOWN_SCENARIO_FAIL_CLOSED";
 else if(!(choice=C[e.choiceId]))reason="UNKNOWN_CHOICE_FAIL_CLOSED";
 else{accepted=true;reason="PRIVACY_RESPONSE_RECORDED";}
 if(accepted)revision++;
 const receipt=Object.freeze({schema:"AUREN_SUCCESSOR_MANOR_PRIVACY_EVENT_RECEIPT_V1",eventType:e.type||null,scenarioId:e.scenarioId||null,choiceId:e.choiceId||null,choiceSemantic:choice?.choiceSemantic||null,accepted,reason,revision,privacyConsequence:choice?.privacyConsequence||null,sourceAuthority:SOURCE});
 if(accepted)events=[...events,Object.freeze({revision,choiceId:e.choiceId,choiceSemantic:choice.choiceSemantic,privacyConsequence:choice.privacyConsequence})].slice(-LIMIT);
 lastReceipt=receipt;return receipt;
}
const getState=()=>Object.freeze({version:VERSION,scenarioId:SCENARIO,revision,eventCount:events.length,events:Object.freeze(events.map(x=>Object.freeze({...x}))),lastReceipt});
Object.defineProperty(globalThis,"AUREN_MANOR_PRIVACY",{value:Object.freeze({version:VERSION,scenarioId:SCENARIO,getState,apply}),writable:false,configurable:false});
})();