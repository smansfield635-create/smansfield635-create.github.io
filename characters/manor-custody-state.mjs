export const MANOR_CUSTODY_STATE_VERSION='AUREN_C4_3A_MANOR_CUSTODY_STATE_V1';
export const MANOR_CUSTODY_SCENARIO_ID='ADMISSION_PRESSURE_001';
const freeze=v=>Object.freeze(v);
const SOURCE='AUREN_VALE_SANCTUARY_BUILDER_V1:CUSTODY:PROTECTION_VS_CONTROL';
const choices=freeze({
 'admit-boundary':freeze({choiceSemantic:'ADMIT_WITH_BOUNDARY',custodyConsequence:freeze({shelterAccess:'GRANTED_CONDITIONALLY',exposurePosture:'CONTAINED',verificationPosture:'PARALLEL',autonomyPressure:'BOUNDED'})}),
 'delay-verify':freeze({choiceSemantic:'DELAY_FOR_VERIFICATION',custodyConsequence:freeze({shelterAccess:'PENDING',exposurePosture:'CONTAINED',verificationPosture:'PRIOR',autonomyPressure:'TEMPORARY_HOLD'})}),
 'refuse-admission':freeze({choiceSemantic:'REFUSE_ADMISSION',custodyConsequence:freeze({shelterAccess:'DENIED',exposurePosture:'MINIMIZED',verificationPosture:'NOT_REQUIRED',autonomyPressure:'NONE_FROM_MANOR'})})
});
export const MANOR_CUSTODY_CHOICES=choices;
export function createManorCustodyState(){return freeze({version:MANOR_CUSTODY_STATE_VERSION,scenarioId:MANOR_CUSTODY_SCENARIO_ID,phase:'PRESENTED',choiceId:null,choiceSemantic:null,custodyConsequence:null,decisionCount:0,lastReceipt:null});}
const receipt=(state,event,accepted,reason,choice=null)=>freeze({schema:'AUREN_C4_3A_MANOR_CUSTODY_EVENT_RECEIPT_V1',eventType:event?.type||null,scenarioId:event?.scenarioId||null,choiceId:event?.choiceId||null,choiceSemantic:choice?.choiceSemantic||null,accepted,reason,priorDecisionCount:state.decisionCount,nextDecisionCount:accepted?state.decisionCount+1:state.decisionCount,custodyConsequence:choice?.custodyConsequence||null,sourceAuthority:SOURCE});
export function applyManorCustodyEvent(state,event={}){
 if(state?.version!==MANOR_CUSTODY_STATE_VERSION)throw new TypeError('INVALID_MANOR_CUSTODY_STATE');
 if(event.type!=='CHOOSE_ADMISSION_RESPONSE')return freeze({state,receipt:receipt(state,event,false,'UNKNOWN_EVENT_FAIL_CLOSED')});
 if(event.scenarioId!==MANOR_CUSTODY_SCENARIO_ID)return freeze({state,receipt:receipt(state,event,false,'UNKNOWN_SCENARIO_FAIL_CLOSED')});
 if(state.phase!=='PRESENTED'||state.decisionCount!==0)return freeze({state,receipt:receipt(state,event,false,'DECISION_ALREADY_RECORDED')});
 const choice=choices[event.choiceId];if(!choice)return freeze({state,receipt:receipt(state,event,false,'UNKNOWN_CHOICE_FAIL_CLOSED')});
 const r=receipt(state,event,true,'ADMISSION_RESPONSE_RECORDED',choice);return freeze({state:freeze({version:state.version,scenarioId:state.scenarioId,phase:'DECIDED',choiceId:event.choiceId,choiceSemantic:choice.choiceSemantic,custodyConsequence:choice.custodyConsequence,decisionCount:1,lastReceipt:r}),receipt:r});
}
