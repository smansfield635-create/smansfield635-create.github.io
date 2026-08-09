const validTiers=new Set(['T1','T2','T3','T4']);
export function evaluateVV(input={}) {
 if(!validTiers.has(input.integrityTier)) return stop('VV_INTEGRITY_TIER_UNKNOWN');
 if(typeof input.constructorHolder!=='string'||typeof input.verifierHolder!=='string') return stop('VV_HOLDER_IDENTITY_MISSING');
 const requires=input.integrityTier!=='T1';
 if(requires && input.constructorHolder===input.verifierHolder) return stop('VV_INDEPENDENCE_REQUIRED');
 if(requires && input.verifierMayRepair===true) return stop('VV_VERIFIER_REPAIR_FORBIDDEN');
 if(['T3','T4'].includes(input.integrityTier) && input.evidenceSourceIndependent!==true) return stop('VV_EVIDENCE_INDEPENDENCE_REQUIRED');
 if(input.integrityTier==='T4' && input.organizationalIndependenceEstablished!==true) return stop('VV_ORGANIZATIONAL_INDEPENDENCE_REQUIRED');
 return {schema:'L2_VV_INTEGRITY_CLOSURE_RECEIPT_v1',result:'PASS_CLOSED',disposition:'EVIDENCED',integrityTier:input.integrityTier,independentVerifier:requires,authorityCreated:false};
}
function stop(errorCode){return {schema:'L2_VV_INTEGRITY_CLOSURE_RECEIPT_v1',result:'STOP',disposition:'GAP',errorCode,authorityCreated:false};}
