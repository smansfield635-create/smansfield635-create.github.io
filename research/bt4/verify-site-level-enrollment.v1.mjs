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
assert(adapter.includes('WORLD_READY_DEADLINE_MS=30000'),'bounded world readiness deadline missing');
assert(adapter.includes('ADAPTER_DEADLINE_MS=35000'),'bounded adapter deadline missing');
assert(adapter.includes('withDeadline(adapter(),id)'),'per-object evaluation deadline is not applied');
assert(adapter.includes('Promise.allSettled'),'independent object settlement missing');
assert(evidenceSurface.runtime?.readyAttribute?.name==='data-ready'&&evidenceSurface.runtime?.readyAttribute?.contains==='true','publication verifier does not require terminal evaluation state');
assert(Number(evidenceSurface.runtime?.timeoutMs)<=45000,'publication verifier timeout exceeds bounded entitlement contract');
assert(page.includes("./site-entitlement.v1.mjs"),'public governance surface is not bound to shared site adapters');
assert(audralia.includes('directDenseCloudCoverage: true'),'Audralia live integration identity missing');
assert(loader.includes("loader.classList.add('is-ready')"),'Audralia terminal runtime-ready transition missing');
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
 coldLoad:'BOUNDED_FAIL_CLOSED_35000MS',
 objectClasses:['scientific-claim','world-runtime','diagnostic-authority','software-release'],
 baseline:'QUALIFIED',
 identityFailure:'HELD',
 staleRepair:'SUPPORTED',
 freshRequalification:'QUALIFIED'
},null,2));
