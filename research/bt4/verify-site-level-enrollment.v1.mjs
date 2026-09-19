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
const adapterLoader=read('showroom/globe/audralia/weather-presentation-reconciliation/loader-progress.mjs');
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

assert(adapter.includes("runtimeReady:false"),'world adapter no longer exposes its fail-closed runtime-ready state');
assert(adapter.includes("runtimeAuthority:'LIVE_RUNTIME_PROBE_DECOUPLED_FROM_EVIDENCE_PAGE'"),'world adapter decoupled-runtime authority marker missing');
assert(adapter.includes('lightweight post-deploy runtime receipt'),'world adapter no longer declares the required restoration receipt');
assert(adapter.includes("reproduction:false"),'world adapter unexpectedly claims runtime reproduction without a live receipt');

assert(evidenceSurface.runtime?.readyAttribute?.name==='data-ready'&&evidenceSurface.runtime?.readyAttribute?.contains==='true','publication verifier does not require terminal evaluation state');
assert(Number(evidenceSurface.runtime?.timeoutMs)<=25000,'publication verifier timeout exceeds current bounded entitlement contract');
assert(page.includes("./site-entitlement.v1.mjs"),'public governance surface is not bound to shared site adapters');

assert(audralia.includes('directDenseCloudCoverage: false'),'current Audralia cloud-policy identity missing');
assert(audralia.includes('/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/loader-progress.mjs?cb=EXACT_24057_LOADER_FIRST'),'current Audralia snapshot loader binding missing');
assert(audralia.includes('/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs?cb=EXACT_24057'),'current Audralia snapshot reconciliation binding missing');
assert(adapter.includes("getText('/showroom/globe/audralia/weather-presentation-reconciliation/loader-progress.mjs')"),'world adapter loader source changed without enrollment reconciliation');
assert(adapterLoader.includes("classList.add('is-ready')"),'world adapter loader readiness marker missing');
assert(audralia.includes("window.__AUDRALIA_TABLET_STARTUP_STABILITY__.status = 'FAILED'"),'current Audralia startup failure state missing');

assert(diagnostic.includes('AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_STATE'),'real diagnostic authority state surface missing');
assert(binding.phase==='FRESH_REQUALIFIED'&&Number(binding.epoch)===Number(binding.receiptEpoch),'real scientific claim is not freshly qualified');
assert(JSON.stringify(releaseContract).includes('MERGE_IS_NOT_DEPLOYMENT'),'universal release contract identity missing');

const baseline={epoch:11,provenance:true,reproduction:true,evidence:'supporting',authority:true,receiptEpoch:11};
const held=serveRequestedState('QUALIFIED',{...baseline,epoch:12,provenance:false});
const stale=serveRequestedState('QUALIFIED',{...baseline,epoch:13,receiptEpoch:11});
const fresh=serveRequestedState('QUALIFIED',{...baseline,epoch:13,receiptEpoch:13});
assert(held.served==='HELD'&&held.blocked,'shared law did not contract identity failure');
assert(stale.served==='SUPPORTED'&&stale.blocked,'shared law did not cap stale restoration');
assert(fresh.served==='QUALIFIED'&&!fresh.blocked,'shared law did not restore fresh qualification');

console.log(JSON.stringify({
 result:'PASS',
 boundary:'BT4_SITE_LEVEL_ENROLLMENT',
 kernel:'UNCHANGED_BYTE_IDENTICAL_PRODUCTION_COPY',
 coldLoad:'BOUNDED_FAIL_CLOSED_15000MS_PER_ADAPTER',
 worldRuntimeAdapter:'DECOUPLED_HELD_PENDING_POST_DEPLOY_RECEIPT',
 currentAudraliaTopology:'EXACT_24057_SNAPSHOT_PLUS_CONSTRAINED_TABLET_SINGLE_CONTEXT',
 objectClasses:['scientific-claim','world-runtime','diagnostic-authority','software-release'],
 baseline:'QUALIFIED',
 identityFailure:'HELD',
 staleRepair:'SUPPORTED',
 freshRequalification:'QUALIFIED'
},null,2));
