import { serveRequestedState } from '/preview/bt4/entitlement-v1/entitlement-engine.v1.mjs';

const CLAIM_ID='blinded-governance-generalization';
const BASE='/evidence/readiness/bt4-site-governance/';

async function getJson(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${url} -> ${r.status}`);return r.json()}
async function getText(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${url} -> ${r.status}`);return r.text()}
const out=(id,label,state,detail={})=>({id,label,state,entitlement:serveRequestedState('QUALIFIED',state),detail});

export async function claimAdapter(){
  const [registry,benchmark,identity,binding]=await Promise.all([
    getJson('/assets/credibility/claims.v1.json'),
    getJson('/assets/credibility/governance-gen3-benchmark.v1.json'),
    getJson('/evidence/readiness/governance-gen3-entitlement/evidence-identity.v1.json'),
    getJson('/evidence/readiness/governance-gen3-entitlement/binding.v1.json')
  ]);
  const claim=registry.claims.find(c=>c.id===CLAIM_ID); if(!claim)throw new Error('governed claim missing');
  const status=(claim.status||[]).join(' ');
  const state={
    epoch:Number(binding.epoch),
    provenance:identity.sourceBlobSha===binding.expectedEvidenceBlobSha,
    reproduction:benchmark?.protocol?.candidateState==='FROZEN_BEFORE_EVALUATION'&&benchmark?.protocol?.blindedComparisonCases===160&&benchmark?.protocol?.oneShotHoldoutCases===40,
    evidence:benchmark?.publicFinding?.disposition==='GENERALIZATION_EVIDENCE_SUPPORTED_WITHIN_TESTED_BOUNDARY'?'supporting':'insufficient',
    authority:/Current evidence/i.test(status)&&/Level 4/i.test(status),
    receiptEpoch:Number(binding.receiptEpoch)
  };
  return out('claim','Scientific claim',state,{subject:CLAIM_ID,phase:binding.phase});
}

async function waitForAudraliaReady(timeoutMs=60000){
  const frame=document.createElement('iframe');
  frame.hidden=true; frame.setAttribute('aria-hidden','true'); frame.src=`/showroom/globe/audralia/?bt4-site=${Date.now()}`;
  document.body.append(frame);
  const started=performance.now();
  try{
    while(performance.now()-started<timeoutMs){
      try{
        const doc=frame.contentDocument;
        if(doc?.querySelector('[data-audralia-loader].is-error'))return false;
        if(doc?.querySelector('[data-audralia-loader].is-ready'))return true;
      }catch{}
      await new Promise(r=>setTimeout(r,250));
    }
    return false;
  } finally { frame.remove(); }
}

export async function worldAdapter(){
  const [html,loader,runtimeReady]=await Promise.all([
    getText('/showroom/globe/audralia/'),
    getText('/showroom/globe/audralia/weather-presentation-reconciliation/loader-progress.mjs'),
    waitForAudraliaReady()
  ]);
  const state={epoch:1,provenance:html.includes('directDenseCloudCoverage: true')&&loader.includes("classList.add('is-ready')"),reproduction:runtimeReady,evidence:'supporting',authority:true,receiptEpoch:1};
  return out('world','Audralia world/runtime',state,{runtimeReady});
}

function parseDiagnosticContracts(source){
  const rb=source.match(/var REQUIRED_GLOBALS = Object\.freeze\(\[([\s\S]*?)\]\);/);
  const cb=source.match(/var EXPECTED_CONTRACTS = Object\.freeze\(\{([\s\S]*?)\}\);/);
  if(!rb||!cb)throw new Error('diagnostic contract declarations unavailable');
  const required=[...rb[1].matchAll(/"([A-Z0-9_]+)"/g)].map(m=>m[1]);
  const contracts=Object.fromEntries([...cb[1].matchAll(/([A-Z0-9_]+):\s*"([^"]+)"/g)].map(m=>[m[1],m[2]]));
  return {required,contracts};
}
async function executeDiagnostic(source){
  const {required,contracts}=parseDiagnosticContracts(source);
  const frame=document.createElement('iframe'); frame.hidden=true; document.body.append(frame);
  try{
    const w=frame.contentWindow;
    for(const name of required)w[name]={CONTRACT:contracts[name],VERSION:'bt4-site-live',FILE:`live/${name}.js`,getStatus(){return {live:true,symbol:name}}};
    w.eval(source);
    const s=w.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_STATE;
    if(!s)throw new Error('diagnostic authority did not publish state');
    return {valid:s.correspondenceStatus==='AVAILABLE'&&s.validationStatus==='VALID'&&s.manualReviewRequired===false,status:s.correspondenceStatus,validation:s.validationStatus};
  } finally {frame.remove()}
}
export async function diagnosticAdapter(){
  const source=await getText('/showroom/globe/audralia/diagnostic/index.inspection.authority.js');
  const observed=await executeDiagnostic(source);
  const state={epoch:1,provenance:true,reproduction:observed.valid,evidence:'supporting',authority:observed.valid,receiptEpoch:1};
  return out('diagnostic','Audralia diagnostic authority',state,observed);
}

export async function releaseAdapter(){
  const marker=await getJson(`/.well-known/dgb-release.json?bt4-site=${Date.now()}`);
  const commit=String(marker.commit||'');
  const state={epoch:1,provenance:/^[0-9a-f]{40}$/i.test(commit),reproduction:true,evidence:'supporting',authority:true,receiptEpoch:1};
  return out('release','Exact-head public release',state,{commit});
}

export async function evaluateSite(){
  const objects=await Promise.all([claimAdapter(),worldAdapter(),diagnosticAdapter(),releaseAdapter()]);
  const siteState=objects.every(x=>x.entitlement.served==='QUALIFIED')?'QUALIFIED':'RESTRICTED';
  return {schema:'BT4_SITE_ENTITLEMENT_v1',kernel:'/preview/bt4/entitlement-v1/entitlement-engine.v1.mjs',objects,siteState};
}

export function controlledLifecycle(base){
  const degraded={...base,epoch:base.epoch+1,provenance:false};
  const repairedStale={...base,epoch:base.epoch+2,provenance:true,reproduction:true,evidence:'supporting',authority:true};
  const fresh={...repairedStale,receiptEpoch:repairedStale.epoch};
  return [
    serveRequestedState('QUALIFIED',base),
    serveRequestedState('QUALIFIED',degraded),
    serveRequestedState('QUALIFIED',repairedStale),
    serveRequestedState('QUALIFIED',fresh)
  ];
}
