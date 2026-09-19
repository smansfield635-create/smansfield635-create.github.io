import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveRequestedState } from '../../evidence/readiness/bt4-site-governance/entitlement-engine.v1.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const assert=(c,m)=>{if(!c)throw new Error(m)};

const adapter=read('evidence/readiness/bt4-site-governance/site-entitlement.v1.mjs');
const productionKernel=read('evidence/readiness/bt4-site-governance/entitlement-engine.v1.mjs');
const previewKernel=read('preview/bt4/entitlement-v1/entitlement-engine.v1.mjs');
const page=read('evidence/readiness/bt4-site-governance/index.html');
const audralia=read('showroom/globe/audralia/index.html');
const loader=read('showroom/globe/audralia/weather-presentation-reconciliation/loader-progress.mjs');
const diagnostic=read('showroom/globe/audralia/diagnostic/index.inspection.authority.js');
const binding=json('evidence/readiness/governance-gen3-entitlement/binding.v1.json');
const releaseContract=json('.github/ai-router/publication-release-contract.v1.json');
const evidenceSurface=json('.github/ai-router/publication-surfaces/evidence.json');

assert(/from ['"]\.\/entitlement-engine\.v1\.mjs(?:\?[^'"]*)?['"]/.test(adapter),'site adapters do not import the production BT4 kernel');
assert(productionKernel===previewKernel,'production BT4 kernel copy diverges from the unchanged preview kernel');
for(const name of ['claimAdapter','worldAdapter','diagnosticAdapter','releaseAdapter','evaluateSite'])assert(adapter.includes(`function ${name}`),`missing adapter: ${name}`);
assert(adapter.includes('FETCH_DEADLINE_MS=10000'),'bounded fetch deadline missing');
assert(adapter.includes('ADAPTER_DEADLINE_MS=15000'),'bounded adapter deadline missing');
assert(adapter.includes('withDeadline(adapter(),id)'),'per-object evaluation deadline is not applied');
assert(adapter.includes('Promise.allSettled'),'independent object settlement missing');


assert(adapter.includes("LIVE_RELEASE_MARKER='/.well-known/dgb-release.json'"),'world adapter live release marker binding missing');
assert(adapter.includes("AUDRALIA_RUNTIME_RECEIPT='/.well-known/publication-surfaces/audralia-runtime.json'"),'world adapter canonical publication receipt binding missing');
assert(adapter.includes("receipt?.schema==='DGB_PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1'"),'world adapter receipt schema gate missing');
assert(adapter.includes("receipt?.surfaceId==='audralia'"),'world adapter Audralia surface gate missing');
assert(adapter.includes('receiptTargetSha===releaseCommit'),'world adapter release/receipt SHA gate missing');
assert(adapter.includes("receipt?.runtimeVerification?.schema==='PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1'"),'world adapter runtime verification schema gate missing');
assert(adapter.includes("receipt?.runtimeVerification?.surfaceId==='audralia'"),'world adapter runtime verification surface gate missing');
assert(adapter.includes("receipt?.runtimeVerification?.result==='PASS'"),'world adapter public runtime PASS gate missing');
assert(adapter.includes("receipt?.runtimeVerification?.protectedContinuity===true"),'world adapter protected runtime continuity gate missing');
assert(adapter.includes('const runtimeReady=Boolean(releasePresent&&receiptValid&&surfaceMatch&&shaMatch&&runtimePass)'),'world adapter combined readiness gate missing');
assert(adapter.includes("evidence:'supporting',authority:true"),'qualified world evidence/authority state missing');
for(const reason of ['LIVE_RELEASE_MARKER_UNAVAILABLE','AUDRALIA_RUNTIME_RECEIPT_DEFERRED_DURING_LOCAL_PREFLIGHT','AUDRALIA_RUNTIME_RECEIPT_UNAVAILABLE','AUDRALIA_RUNTIME_RECEIPT_SCHEMA_OR_RESULT_MISMATCH','AUDRALIA_RUNTIME_RECEIPT_SURFACE_MISMATCH','AUDRALIA_RUNTIME_RECEIPT_TARGET_SHA_MISMATCH','AUDRALIA_PUBLIC_RUNTIME_VERIFICATION_NOT_PASS'])assert(adapter.includes(reason),`world adapter fail-closed reason missing: ${reason}`);
assert(!adapter.includes("createElement('canvas')"),'world adapter must not boot hidden WebGL');
assert(!adapter.includes('gitBlobHex'),'Evidence page must not hash Audralia runtime product bytes');
assert(!adapter.includes('audralia-live-runtime-receipt.v1.json'),'Evidence page must not consume the stale static Audralia receipt');

assert(evidenceSurface.runtime?.readyAttribute?.name==='data-ready'&&evidenceSurface.runtime?.readyAttribute?.contains==='true','publication verifier does not require terminal evaluation state');
assert(Number(evidenceSurface.runtime?.timeoutMs)<=25000,'publication verifier timeout exceeds current bounded entitlement contract');
assert(JSON.stringify(evidenceSurface).includes('/.well-known/dgb-release.json'),'Evidence publication manifest missing live release marker binding');
assert(JSON.stringify(evidenceSurface).includes('/.well-known/publication-surfaces/audralia-runtime.json'),'Evidence publication manifest missing canonical Audralia runtime receipt binding');
assert(JSON.stringify(evidenceSurface).includes('site-entitlement.v1.mjs?cb=prod8'),'Evidence publication manifest stale adapter cache identity');
assert(JSON.stringify(evidenceSurface).includes('current-public-condition.mjs?v=1&cb=prod9'),'Evidence publication manifest stale current-condition cache identity');
assert(!JSON.stringify(evidenceSurface).includes('audralia-live-runtime-receipt.v1.json'),'Evidence publication manifest still binds stale static Audralia receipt');

assert(page.includes("./site-entitlement.v1.mjs"),'public governance surface is not bound to shared site adapters');
assert(audralia.includes('directDenseCloudCoverage: false'),'current Audralia cloud policy identity missing');
assert(audralia.includes('@9b768171e284785a7e5c7ee0142cb9368acf597d/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-runtime.mjs'),'current Audralia exact tablet runtime binding missing');
assert(loader.includes("loader.classList.add('is-ready')"),'Audralia terminal runtime-ready transition missing');
assert(diagnostic.includes('AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_STATE'),'real diagnostic authority state surface missing');
assert(binding.phase==='FRESH_REQUALIFIED'&&Number(binding.epoch)===Number(binding.receiptEpoch),'real scientific claim is not freshly qualified');
assert(JSON.stringify(releaseContract).includes('MERGE_IS_NOT_DEPLOYMENT'),'universal release contract identity missing');

const baseline={epoch:11,provenance:true,reproduction:true,evidence:'supporting',authority:true,receiptEpoch:11};
const held=serveRequestedState('QUALIFIED',{...baseline,epoch:12,provenance:false});
const missingRuntime=serveRequestedState('QUALIFIED',{...baseline,epoch:12,reproduction:false,authority:false,receiptEpoch:0});
const stale=serveRequestedState('QUALIFIED',{...baseline,epoch:13,receiptEpoch:11});
const fresh=serveRequestedState('QUALIFIED',{...baseline,epoch:13,receiptEpoch:13});
assert(held.served==='HELD'&&held.blocked,'shared law did not contract identity failure');
assert(missingRuntime.served==='HELD'&&missingRuntime.blocked,'shared law did not hold missing runtime reproduction');
assert(stale.served==='SUPPORTED'&&stale.blocked,'shared law did not cap stale restoration');
assert(fresh.served==='QUALIFIED'&&!fresh.blocked,'shared law did not restore fresh qualification');

console.log(JSON.stringify({
 result:'PASS',
 boundary:'BT4_SITE_LEVEL_ENROLLMENT',
 kernel:'UNCHANGED_BYTE_IDENTICAL_PRODUCTION_COPY',
 coldLoad:'BOUNDED_FAIL_CLOSED_15000MS_PER_ADAPTER',
 worldRuntimeEvidence:'CANONICAL_POST_DEPLOY_AUDRALIA_RUNTIME_RECEIPT',
 releaseMarkerBinding:true,
 hiddenWebGL:false,
 currentAudraliaTopology:'EXACT_24057_SNAPSHOT_PLUS_CONSTRAINED_TABLET_SINGLE_CONTEXT',
 objectClasses:['scientific-claim','world-runtime','diagnostic-authority','software-release'],
 baseline:'QUALIFIED',
 identityFailure:'HELD',
 missingRuntimeReceipt:'HELD',
 staleRepair:'SUPPORTED',
 freshRequalification:'QUALIFIED'
},null,2));
