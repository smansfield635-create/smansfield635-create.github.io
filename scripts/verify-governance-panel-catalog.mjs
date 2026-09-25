import { readFile } from 'node:fs/promises';

const EXPECTED_SOURCE_REVISION = '3fbbe363777398cc29040ae258ebab5eec9ced48';
const LOCAL_PATH = 'assets/compass/governance-panel.catalog.v1.json';
const EXPECTED_CATALOG_REVISION = '1.0.2';

const localText = await readFile(LOCAL_PATH, 'utf8');
const local = JSON.parse(localText);
if (local.substrate?.repository !== 'smansfield635-create/geodiametrics1') throw new Error('wrong substrate repository');
if (local.catalogId !== 'GOVERNANCE_PANEL_CATALOG_V1') throw new Error('wrong catalog identity');
if (local.substrate?.revision !== '8f6dc4a74348a5165a5628affa3820448122abc0') throw new Error('wrong canonical substrate inspection revision');
if (local.consumerBinding?.repository !== 'smansfield635-create/smansfield635-create.github.io') throw new Error('wrong consumer repository binding');
if (local.consumerBinding?.componentIdentity !== 'GOVERNANCE_PANEL_V2') throw new Error('wrong consumer component binding');
for (const asset of ['assets/compass/compass.governance-platform.js','assets/compass/compass.governance-platform.css']) if (!local.consumerBinding?.assets?.includes(asset)) throw new Error(`missing consumer asset binding: ${asset}`);
if (local.catalogRevision !== EXPECTED_CATALOG_REVISION) throw new Error('wrong catalog revision');
if (local.generatedFor !== 'GOVERNANCE_PANEL_V2') throw new Error('wrong generatedFor identity');
if (local.status !== 'ACTIVE_CANONICAL_CATALOG') throw new Error('catalog is not marked ACTIVE_CANONICAL_CATALOG');
if (local.nodes?.length !== 14) throw new Error('unexpected node count');
if (local.edges?.length !== 21) throw new Error('unexpected edge count');
if (Object.keys(local.operations ?? {}).length !== 8) throw new Error('unexpected operation count');

const js = await readFile('assets/compass/compass.governance-platform.js', 'utf8');
if (!js.includes("const CATALOG_URL='/assets/compass/governance-panel.catalog.v1.json';")) {
  throw new Error('panel runtime is not bound to the same-origin derived catalog');
}
if (js.includes('raw.githubusercontent.com')) throw new Error('panel runtime contains an external raw GitHub runtime dependency');

console.log('Governance Panel catalog integrity: PASS');
console.log(`canonical revision: ${EXPECTED_SOURCE_REVISION}`);
console.log(`catalog revision: ${EXPECTED_CATALOG_REVISION}`);
console.log('nodes: 14 | edges: 21 | operations: 8');
