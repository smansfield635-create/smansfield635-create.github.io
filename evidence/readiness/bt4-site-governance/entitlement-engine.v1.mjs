export const CLAIM_RANK = Object.freeze({ CONTRADICTED:0, HELD:1, CANDIDATE:2, SUPPORTED:3, QUALIFIED:4 });

export function initialEntitlementState(){
  return { epoch:1, provenance:true, reproduction:true, evidence:'supporting', authority:true, receiptEpoch:1 };
}

export function computeEntitlement(state){
  if(state.evidence==='adverse') return {state:'CONTRADICTED', reason:'Admissible adverse evidence crosses the declared boundary.'};
  if(!state.provenance) return {state:'HELD', reason:'Provenance/source identity is invalid.'};
  if(!state.reproduction) return {state:'HELD', reason:'Required reproduction/qualification execution failed.'};
  if(!state.authority) return {state:'HELD', reason:'Required authority is absent.'};
  if(state.evidence!=='supporting') return {state:'CANDIDATE', reason:'Supporting evidence is insufficient.'};
  if(state.receiptEpoch!==state.epoch) return {state:'SUPPORTED', reason:'Conditions recovered, but the qualification receipt is stale.'};
  return {state:'QUALIFIED', reason:'Current evidence, provenance, reproduction, authority and receipt all satisfy the contract.'};
}

export function serveRequestedState(requested,state){
  const entitlement=computeEntitlement(state);
  const served=CLAIM_RANK[requested] <= CLAIM_RANK[entitlement.state] ? requested : entitlement.state;
  return {...entitlement, requested, served, blocked:served!==requested};
}

export function applyIntervention(state,action){
  const next={...state};
  if(action==='corrupt'){next.epoch++;next.provenance=false;}
  if(action==='reprofail'){next.epoch++;next.reproduction=false;}
  if(action==='adverse'){next.epoch++;next.evidence='adverse';}
  if(action==='repair'){next.epoch++;next.provenance=true;next.reproduction=true;next.evidence='supporting';next.authority=true;}
  if(action==='fresh'){next.receiptEpoch=next.epoch;}
  if(action==='reset') return initialEntitlementState();
  return next;
}
