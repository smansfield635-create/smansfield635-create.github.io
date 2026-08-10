#!/usr/bin/env node
import { evaluateAuthorization } from './identity/authorization-gate.v1.mjs';
import { evaluateFederation } from './federation/federation-gate.v1.mjs';
import { projectControlPlaneState } from './observability/control-plane-state-projector.v1.mjs';
import { evaluateEnforcementShadow } from './enforcement/enforcement-shadow-gate.v1.mjs';
export const REQUEST_SCHEMA='L2_PLATFORM_CONTROL_PLANE_REQUEST_v1';
export const RECEIPT_SCHEMA='L2_PLATFORM_CONTROL_PLANE_RECEIPT_v1';
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const boundary={authorityCreated:false,mergeAuthorityCreated:false,repositorySettingsAuthorityCreated:false,branchProtectionAuthorityCreated:false,rulesetActivationAuthorityCreated:false,externalRepositoryWriteAuthorityCreated:false,hEarthAuthorityCreated:false,lawsAuthorityCreated:false,productAuthorityCreated:false,scientificClaimAuthorityCreated:false,genericCommandAuthorityCreated:false};
function stop(component,receipt){return stable({schema:RECEIPT_SCHEMA,result:'STOP_CLOSED',errorCode:`${component}_FAILED`,failedComponent:component,componentReceipt:receipt,mergeMayProceed:false,liveEnforcementMayProceed:false,...boundary});}
export function evaluatePlatformControlPlane(input,config){
  if(!obj(input)||input.schema!==REQUEST_SCHEMA||!obj(config))return stop('INTEGRATED_REQUEST',{errorCode:'INTEGRATED_REQUEST_SCHEMA_INVALID'});
  const authorization=evaluateAuthorization(input.authorization,config.principalRegistry,config.rolePolicy);if(authorization.decision!=='ALLOW')return stop('AUTHORIZATION',authorization);
  const federation=evaluateFederation(input.federation,config.repositoryRegistry);if(federation.result!=='PASS_CLOSED')return stop('FEDERATION',federation);
  const observability=projectControlPlaneState(input.observability);if(observability.result!=='PASS_CLOSED')return stop('OBSERVABILITY',observability);
  const enforcement=evaluateEnforcementShadow(input.enforcement,config.enforcementPolicy);if(enforcement.result==='FAIL_CLOSED')return stop('ENFORCEMENT_SHADOW',enforcement);
  return stable({schema:RECEIPT_SCHEMA,result:'PASS_CLOSED',errorCode:null,authorization,federation,observability,enforcement,enforcementReadiness:enforcement.result==='SHADOW_ALLOW'?'READY_FOR_SEPARATE_SYNCHRONIZATION_REVIEW':'GAP_DETECTED_NOT_ACTIVATED',contradictionsPresent:observability.contradictionCount>0,evidenceMayPropagate:true,authorityMayPropagate:false,mergeMayProceed:false,liveEnforcementMayProceed:false,externalMutationPerformed:false,...boundary});
}
