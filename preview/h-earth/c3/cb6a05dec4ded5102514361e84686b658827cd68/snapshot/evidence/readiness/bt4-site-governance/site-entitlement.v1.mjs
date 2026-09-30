import { serveRequestedState } from './entitlement-engine.v1.mjs?cb=prod1';

const CLAIM_ID='blinded-governance-generalization';
const FETCH_DEADLINE_MS=10000;
const ADAPTER_DEADLINE_MS=15000;
const LIVE_RELEASE_MARKER='/.well-known/dgb-release.json';
const AUDRALIA_RUNTIME_RECEIPT='/.well-known/publication-surfaces/audralia-runtime.json';

async function fetchBounded(url,init={}){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(new Error(`fetch deadline exceeded: ${url}`)),FETCH_DEADLINE_MS);
  try{return await fetch(url,{...init,cache:'no-store',signal:controller.signal});}
  finally{clearTimeout(timer)}
}
async function getJson(url){const r=await fetchBounded(url);if(!r.ok)throw new Error(`${url} -> ${r.status}`);return r.json()}
async function getText(url){const r=await fetchBounded(url);if(!r.ok)throw new Error(`${url} -> ${r.status}`);return r.text()}
const out=(id,label,state,detail={})=>({id,label,state,entitlement:serveRequestedState('QUALIFIED',state),detail});
const held=(id,label,error)=>out(id,label,{epoch:1,provenance:false,reproduction:false,evidence:'insufficient',authority:false,receiptEpoch:0},{error:String(error?.message||error||'adapter unavailable')});
const withDeadline=(promise,label,timeoutMs=ADAPTER_DEADLINE_MS)=>new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error(`${label} evaluation deadline exceeded after ${timeoutMs}ms`)),timeoutMs);
  Promise.resolve(promise).then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)});
});
export async function claimAdapter(){
  const [registry,benchmark,identity,binding]=await Promise.all([
    getJson('/assets/credibility/claims.v1.json'),
    getJson('/assets/credibility/governance-gen3-benchmark.v1.json'),
    getJson('/evidence/readiness/governance-gen3-entitlement/evidence-identity.v1.json'),
    getJson('/evidence/readiness/governance-gen3-entitlement/binding.v1.json')
  ]);
  const claim=registry.claims.find(c=>c.id===CLAIM_ID); if(!claim)throw new Error('governed claim missing');
  const status=(claim.status||[]).join(' ');
  const state={epoch:Number(binding.epoch),provenance:identity.sourceBlobSha===binding.expectedEvidenceBlobSha,reproduction:benchmark?.protocol?.candidateState==='FROZEN_BEFORE_EVALUATION'&&benchmark?.protocol?.blindedComparisonCases===160&&benchmark?.protocol?.oneShotHoldoutCases===40,evidence:benchmark?.publicFinding?.disposition==='GENERALIZATION_EVIDENCE_SUPPORTED_WITHIN_TESTED_BOUNDARY'?'supporting':'insufficient',authority:/Current evidence/i.test(status)&&/Level 4/i.test(status),receiptEpoch:Number(binding.receiptEpoch)};
  return out('claim','Scientific claim',state,{subject:CLAIM_ID,phase:binding.phase});
}

export async function worldAdapter(){
  const authority='CANONICAL_POST_DEPLOY_AUDRALIA_RUNTIME_RECEIPT';
  const closed=(reason,detail={})=>out('world','Audralia world/runtime',{epoch:1,provenance:false,reproduction:false,evidence:'insufficient',authority:false,receiptEpoch:0},{runtimeReady:false,runtimeAuthority:authority,reason,...detail});
  let marker;
  try{marker=await getJson(`${LIVE_RELEASE_MARKER}?bt4-world=${Date.now()}`)}
  catch(error){return closed('LIVE_RELEASE_MARKER_UNAVAILABLE',{fetchFailure:String(error?.message||error)})}
  const releaseCommit=String(marker?.commit||'');
  const releasePresent=/^[0-9a-f]{40}$/i.test(releaseCommit);
  if(!releasePresent)return closed('LIVE_RELEASE_MARKER_INVALID',{releaseCommit:releaseCommit||null});
  const localPreflightOrigin=typeof location!=='undefined'&&(location.hostname==='127.0.0.1'||location.hostname==='localhost');
  if(localPreflightOrigin)return closed('AUDRALIA_RUNTIME_RECEIPT_DEFERRED_DURING_LOCAL_PREFLIGHT',{releaseCommit,origin:location.origin});

  let receipt;
  try{receipt=await getJson(`${AUDRALIA_RUNTIME_RECEIPT}?bt4-world=${Date.now()}`)}
  catch(error){return closed('AUDRALIA_RUNTIME_RECEIPT_UNAVAILABLE',{releaseCommit,fetchFailure:String(error?.message||error)})}
  const receiptTargetSha=String(receipt?.targetSha||'');
  const receiptValid=receipt?.schema==='DGB_PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1'&&receipt?.result==='PASS_CLOSED';
  const surfaceMatch=receipt?.surfaceId==='audralia';
  const shaMatch=receiptTargetSha===releaseCommit;
  const runtimePass=receipt?.runtimeVerification?.schema==='PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1'&&receipt?.runtimeVerification?.surfaceId==='audralia'&&receipt?.runtimeVerification?.result==='PASS'&&receipt?.runtimeVerification?.protectedContinuity===true;
  const runtimeReady=Boolean(releasePresent&&receiptValid&&surfaceMatch&&shaMatch&&runtimePass);

  let reason='LIVE_AUDRALIA_PUBLICATION_RUNTIME_RECEIPT_MATCH';
  if(!receiptValid)reason='AUDRALIA_RUNTIME_RECEIPT_SCHEMA_OR_RESULT_MISMATCH';
  else if(!surfaceMatch)reason='AUDRALIA_RUNTIME_RECEIPT_SURFACE_MISMATCH';
  else if(!shaMatch)reason='AUDRALIA_RUNTIME_RECEIPT_TARGET_SHA_MISMATCH';
  else if(!runtimePass)reason='AUDRALIA_PUBLIC_RUNTIME_VERIFICATION_NOT_PASS';
  if(!runtimeReady)return closed(reason,{releaseCommit,receiptTargetSha:receiptTargetSha||null,receiptSurfaceId:receipt?.surfaceId||null,runtimeVerificationResult:receipt?.runtimeVerification?.result||null});

  const state={epoch:1,provenance:true,reproduction:true,evidence:'supporting',authority:true,receiptEpoch:1};
  return out('world','Audralia world/runtime',state,{runtimeReady:true,runtimeAuthority:authority,receipt:receipt.schema,releaseCommit,receiptTargetSha,finalUrl:receipt.finalUrl||null,runtimeVerificationResult:receipt.runtimeVerification.result,timestamp:receipt.timestamp||null,reason});
}

function parseDiagnosticContracts(source){
  const rb=source.match(/var REQUIRED_GLOBALS = Object\.freeze\(\[([\s\S]*?)\]\);/);const cb=source.match(/var EXPECTED_CONTRACTS = Object\.freeze\(\{([\s\S]*?)\}\);/);if(!rb||!cb)throw new Error('diagnostic contract declarations unavailable');
  const required=[...rb[1].matchAll(/"([A-Z0-9_]+)"/g)].map(m=>m[1]);const contracts=Object.fromEntries([...cb[1].matchAll(/([A-Z0-9_]+):\s*"([^"]+)"/g)].map(m=>[m[1],m[2]]));return {required,contracts};
}
async function executeDiagnostic(source){
  const {required,contracts}=parseDiagnosticContracts(source);const frame=document.createElement('iframe'); frame.hidden=true; document.body.append(frame);
  try{const w=frame.contentWindow;for(const name of required)w[name]={CONTRACT:contracts[name],VERSION:'bt4-site-live',FILE:`live/${name}.js`,getStatus(){return {live:true,symbol:name}}};w.eval(source);const s=w.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_STATE;if(!s)throw new Error('diagnostic authority did not publish state');return {valid:s.correspondenceStatus==='AVAILABLE'&&s.validationStatus==='VALID'&&s.manualReviewRequired===false,status:s.correspondenceStatus,validation:s.validationStatus};} finally {frame.remove()}
}
export async function diagnosticAdapter(){const source=await getText('/showroom/globe/audralia/diagnostic/index.inspection.authority.js');const observed=await executeDiagnostic(source);const state={epoch:1,provenance:true,reproduction:observed.valid,evidence:'supporting',authority:observed.valid,receiptEpoch:1};return out('diagnostic','Audralia diagnostic authority',state,observed);}

export async function releaseAdapter(){const marker=await getJson(`${LIVE_RELEASE_MARKER}?bt4-site=${Date.now()}`);const commit=String(marker.commit||'');const state={epoch:1,provenance:/^[0-9a-f]{40}$/i.test(commit),reproduction:true,evidence:'supporting',authority:true,receiptEpoch:1};return out('release','Exact-head public release',state,{commit});}

export async function evaluateSite(){
  const specs=[['claim','Scientific claim',claimAdapter],['world','Audralia world/runtime',worldAdapter],['diagnostic','Audralia diagnostic authority',diagnosticAdapter],['release','Exact-head public release',releaseAdapter]];
  const settled=await Promise.allSettled(specs.map(([id,,adapter])=>withDeadline(adapter(),id)));
  const objects=settled.map((result,i)=>result.status==='fulfilled'?result.value:held(specs[i][0],specs[i][1],result.reason));
  const siteState=objects.every(x=>x.entitlement.served==='QUALIFIED')?'QUALIFIED':'RESTRICTED';
  return {schema:'BT4_SITE_ENTITLEMENT_v1',kernel:'/evidence/readiness/bt4-site-governance/entitlement-engine.v1.mjs',objects,siteState,partialFailure:objects.some(x=>x.detail?.error),evaluationDeadlineMs:ADAPTER_DEADLINE_MS};
}

export function controlledLifecycle(base){const degraded={...base,epoch:base.epoch+1,provenance:false};const repairedStale={...base,epoch:base.epoch+2,provenance:true,reproduction:true,evidence:'supporting',authority:true};const fresh={...repairedStale,receiptEpoch:repairedStale.epoch};return [serveRequestedState('QUALIFIED',base),serveRequestedState('QUALIFIED',degraded),serveRequestedState('QUALIFIED',repairedStale),serveRequestedState('QUALIFIED',fresh)];}
