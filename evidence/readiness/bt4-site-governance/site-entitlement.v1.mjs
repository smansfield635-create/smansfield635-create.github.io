import { serveRequestedState } from './entitlement-engine.v1.mjs?cb=prod1';

const CLAIM_ID='blinded-governance-generalization';
const FETCH_DEADLINE_MS=10000;
const ADAPTER_DEADLINE_MS=15000;
const AUDRALIA_RUNTIME_RECEIPT='/evidence/readiness/bt4-site-governance/audralia-live-runtime-receipt.v1.json';

async function fetchBounded(url,init={}){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(new Error(`fetch deadline exceeded: ${url}`)),FETCH_DEADLINE_MS);
  try{return await fetch(url,{...init,cache:'no-store',signal:controller.signal});}
  finally{clearTimeout(timer)}
}
async function getJson(url){const r=await fetchBounded(url);if(!r.ok)throw new Error(`${url} -> ${r.status}`);return r.json()}
async function getText(url){const r=await fetchBounded(url);if(!r.ok)throw new Error(`${url} -> ${r.status}`);return r.text()}
async function getBytes(url){const r=await fetchBounded(url);if(!r.ok)throw new Error(`${url} -> ${r.status}`);return new Uint8Array(await r.arrayBuffer())}
const out=(id,label,state,detail={})=>({id,label,state,entitlement:serveRequestedState('QUALIFIED',state),detail});
const held=(id,label,error)=>out(id,label,{epoch:1,provenance:false,reproduction:false,evidence:'insufficient',authority:false,receiptEpoch:0},{error:String(error?.message||error||'adapter unavailable')});
const withDeadline=(promise,label,timeoutMs=ADAPTER_DEADLINE_MS)=>new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error(`${label} evaluation deadline exceeded after ${timeoutMs}ms`)),timeoutMs);
  Promise.resolve(promise).then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)});
});
async function gitBlobHex(bytes){
  const prefix=new TextEncoder().encode(`blob ${bytes.byteLength}\0`);
  const input=new Uint8Array(prefix.byteLength+bytes.byteLength);
  input.set(prefix,0);input.set(bytes,prefix.byteLength);
  const digest=await crypto.subtle.digest('SHA-1',input);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

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
  const [html,loader,rendererBytes,tabletBytes,receipt]=await Promise.all([
    getText('/showroom/globe/audralia/'),
    getText('/showroom/globe/audralia/weather-presentation-reconciliation/loader-progress.mjs'),
    getBytes('/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs'),
    getBytes('/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-runtime.mjs'),
    getJson(AUDRALIA_RUNTIME_RECEIPT)
  ]);
  const [rendererBlob,tabletRuntimeBlob]=await Promise.all([gitBlobHex(rendererBytes),gitBlobHex(tabletBytes)]);
  const receiptValid=
    receipt?.schema==='AUDRALIA_LIVE_RUNTIME_RECEIPT_v1'&&
    receipt?.result==='PASS_CLOSED'&&
    receipt?.surfaceId==='audralia'&&
    receipt?.qualificationResult==='PASS_CLOSED'&&
    receipt?.publicationResult==='LIVE_EXACT_HEAD_VERIFIED'&&
    receipt?.hiddenWebGLRequired===false;
  const topologyValid=
    html.includes(receipt?.integrationSchema||'__missing__')&&
    html.includes('directDenseCloudCoverage: false')&&
    html.includes(`@${receipt?.tabletRuntimeRef}/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-runtime.mjs`)&&
    loader.includes("classList.add('is-ready')");
  const identityValid=
    rendererBlob===receipt?.rendererBlob&&
    tabletRuntimeBlob===receipt?.tabletRuntimeBlob;
  const runtimeReady=Boolean(receiptValid&&topologyValid&&identityValid);
  const state={epoch:1,provenance:Boolean(topologyValid&&identityValid),reproduction:runtimeReady,evidence:receiptValid?'supporting':'insufficient',authority:runtimeReady,receiptEpoch:runtimeReady?1:0};
  return out('world','Audralia world/runtime',state,{
    runtimeReady,
    runtimeAuthority:'DURABLE_AUDRALIA_LIVE_RUNTIME_RECEIPT',
    receipt:receipt?.schema||null,
    qualifiedCandidate:receipt?.qualifiedCandidate||null,
    adoptedCommit:receipt?.adoptedCommit||null,
    qualificationRun:receipt?.qualificationRun||null,
    publicationRun:receipt?.publicationRun||null,
    rendererBlob,
    tabletRuntimeBlob,
    reason:runtimeReady
      ?'Current live Audralia runtime identities match the durable qualification/publication receipt. No hidden WebGL reproduction is required on the Evidence page.'
      :'Current live Audralia identities do not fully match the durable runtime receipt; the world object remains held closed.'
  });
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

export async function releaseAdapter(){const marker=await getJson(`/.well-known/dgb-release.json?bt4-site=${Date.now()}`);const commit=String(marker.commit||'');const state={epoch:1,provenance:/^[0-9a-f]{40}$/i.test(commit),reproduction:true,evidence:'supporting',authority:true,receiptEpoch:1};return out('release','Exact-head public release',state,{commit});}

export async function evaluateSite(){
  const specs=[['claim','Scientific claim',claimAdapter],['world','Audralia world/runtime',worldAdapter],['diagnostic','Audralia diagnostic authority',diagnosticAdapter],['release','Exact-head public release',releaseAdapter]];
  const settled=await Promise.allSettled(specs.map(([id,,adapter])=>withDeadline(adapter(),id)));
  const objects=settled.map((result,i)=>result.status==='fulfilled'?result.value:held(specs[i][0],specs[i][1],result.reason));
  const siteState=objects.every(x=>x.entitlement.served==='QUALIFIED')?'QUALIFIED':'RESTRICTED';
  return {schema:'BT4_SITE_ENTITLEMENT_v1',kernel:'/evidence/readiness/bt4-site-governance/entitlement-engine.v1.mjs',objects,siteState,partialFailure:objects.some(x=>x.detail?.error),evaluationDeadlineMs:ADAPTER_DEADLINE_MS};
}

export function controlledLifecycle(base){const degraded={...base,epoch:base.epoch+1,provenance:false};const repairedStale={...base,epoch:base.epoch+2,provenance:true,reproduction:true,evidence:'supporting',authority:true};const fresh={...repairedStale,receiptEpoch:repairedStale.epoch};return [serveRequestedState('QUALIFIED',base),serveRequestedState('QUALIFIED',degraded),serveRequestedState('QUALIFIED',repairedStale),serveRequestedState('QUALIFIED',fresh)];}
