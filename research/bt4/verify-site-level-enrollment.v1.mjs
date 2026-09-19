import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveRequestedState } from '../../evidence/readiness/bt4-site-governance/entitlement-engine.v1.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const assert=(c,m)=>{if(!c)throw new Error(m)};

const adapter=read('evidence/readiness/bt4-site-governance/site-entitlement.v1.mjs');
const runtimeReceipt=json('evidence/readiness/bt4-site-governance/audralia-live-runtime-receipt.v1.json');
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

assert(runtimeReceipt.schema==='AUDRALIA_LIVE_RUNTIME_RECEIPT_v1','Audralia runtime receipt schema drift');
assert(runtimeReceipt.result==='PASS_CLOSED','Audralia runtime receipt is not terminal PASS_CLOSED');
assert(runtimeReceipt.surfaceId==='audralia','Audralia runtime receipt surface mismatch');
assert(runtimeReceipt.qualificationRun===35463049772&&runtimeReceipt.qualificationResult==='PASS_CLOSED','Audralia qualification receipt binding drift');
assert(runtimeReceipt.publicationRun===35463353855&&runtimeReceipt.publicationResult==='LIVE_EXACT_HEAD_VERIFIED','Audralia publication receipt binding drift');
assert(runtimeReceipt.qualifiedCandidate==='57324b162560eb42bd55320b5fa5cf89ad3ff54a','Audralia candidate identity drift');
assert(runtimeReceipt.adoptedCommit==='1954f112b0f3b78d2ca66c4bef341bc6f3c231b3','Audralia adopted commit identity drift');
assert(runtimeReceipt.indexSourceBlob==='2108710132506f1c6b30a7dcd6ac751288694251','Audralia index source blob drift');
assert(runtimeReceipt.rendererBlob==='fd787eb387efb195747658518573cb91508f989c','Audralia renderer receipt blob drift');
assert(runtimeReceipt.tabletRuntimeBlob==='ae5b2e9f786b42332b58872f7f0663e1937b5f04','Audralia tablet runtime receipt blob drift');
assert(runtimeReceipt.tabletRuntimeRef==='9b768171e284785a7e5c7ee0142cb9368acf597d','Audralia tablet exact-ref drift');
assert(runtimeReceipt.hiddenWebGLRequired===false,'Evidence world receipt unexpectedly requires hidden WebGL');

assert(adapter.includes("AUDRALIA_RUNTIME_RECEIPT='/evidence/readiness/bt4-site-governance/audralia-live-runtime-receipt.v1.json'"),'world adapter durable receipt binding missing');
assert(adapter.includes("runtimeAuthority:'DURABLE_AUDRALIA_LIVE_RUNTIME_RECEIPT'"),'world adapter durable receipt authority marker missing');
assert(adapter.includes("receipt?.result==='PASS_CLOSED'"),'world adapter receipt PASS gate missing');
assert(adapter.includes("receipt?.publicationResult==='LIVE_EXACT_HEAD_VERIFIED'"),'world adapter publication PASS gate missing');
assert(adapter.includes("html.includes('directDenseCloudCoverage: false')"),'world adapter current cloud-policy identity missing');
assert(adapter.includes('rendererBlob===receipt?.rendererBlob'),'world adapter renderer identity gate missing');
assert(adapter.includes('tabletRuntimeBlob===receipt?.tabletRuntimeBlob'),'world adapter tablet identity gate missing');
assert(adapter.includes('const runtimeReady=Boolean(receiptValid&&topologyValid&&identityValid)'),'world adapter combined readiness gate missing');
assert(adapter.includes('reproduction:runtimeReady'),'world adapter reproduction is not bound to durable runtime readiness');
assert(!adapter.includes("createElement('canvas')"),'world adapter must not boot hidden WebGL');

assert(evidenceSurface.runtime?.readyAttribute?.name==='data-ready'&&evidenceSurface.runtime?.readyAttribute?.contains==='true','publication verifier does not require terminal evaluation state');
assert(Number(evidenceSurface.runtime?.timeoutMs)<=25000,'publication verifier timeout exceeds current bounded entitlement contract');
assert(JSON.stringify(evidenceSurface).includes('audralia-live-runtime-receipt.v1.json'),'Evidence publication manifest does not verify the runtime receipt');
assert(JSON.stringify(evidenceSurface).includes('site-entitlement.v1.mjs?cb=prod6'),'Evidence publication manifest stale adapter cache identity');
assert(JSON.stringify(evidenceSurface).includes('current-public-condition.mjs?v=1&cb=prod7'),'Evidence publication manifest stale current-condition cache identity');

assert(page.includes("./site-entitlement.v1.mjs"),'public governance surface is not bound to shared site adapters');
assert(audralia.includes('directDenseCloudCoverage: false'),'current Audralia cloud policy identity missing');
assert(audralia.includes(`@${runtimeReceipt.tabletRuntimeRef}/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-runtime.mjs`),'current Audralia exact tablet runtime binding missing');
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
 worldRuntimeEvidence:'DURABLE_AUDRALIA_LIVE_RUNTIME_RECEIPT',
 hiddenWebGL:false,
 currentAudraliaTopology:'EXACT_24057_SNAPSHOT_PLUS_CONSTRAINED_TABLET_SINGLE_CONTEXT',
 objectClasses:['scientific-claim','world-runtime','diagnostic-authority','software-release'],
 baseline:'QUALIFIED',
 identityFailure:'HELD',
 missingRuntimeReceipt:'HELD',
 staleRepair:'SUPPORTED',
 freshRequalification:'QUALIFIED'
},null,2));
