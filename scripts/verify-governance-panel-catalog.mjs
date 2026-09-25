import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const SOURCE_URL = 'https://raw.githubusercontent.com/smansfield635-create/geodiametrics1/3fbbe363777398cc29040ae258ebab5eec9ced48/control-plane/governance-panel/GOVERNANCE_PANEL_CATALOG_v1.json';
const LOCAL_PATH = 'assets/compass/governance-panel.catalog.v1.json';
const EXPECTED_SOURCE_REVISION = '3fbbe363777398cc29040ae258ebab5eec9ced48';
const EXPECTED_CATALOG_REVISION = '1.0.2';

const localText = await readFile(LOCAL_PATH, 'utf8');
const response = await fetch(SOURCE_URL, { cache: 'no-store' });
if (!response.ok) throw new Error(`canonical catalog fetch failed: HTTP ${response.status}`);
const sourceText = await response.text();

const hash = text => createHash('sha256').update(text, 'utf8').digest('hex');
if (hash(localText) !== hash(sourceText)) {
  throw new Error('derived catalog drift detected: local delivery artifact differs from canonical catalog revision');
}

const local = JSON.parse(localText);
if (local.sourceRepository !== 'smansfield635-create/geodiametrics1') throw new Error('wrong source repository');
if (local.sourceRevision !== EXPECTED_SOURCE_REVISION) throw new Error('wrong source revision');
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
