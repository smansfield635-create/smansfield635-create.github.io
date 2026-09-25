import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const SOURCE_URL = 'https://api.github.com/repos/smansfield635-create/geodiametrics1/contents/control-plane/governance-panel/GOVERNANCE_PANEL_CATALOG_v1.json?ref=3fbbe363777398cc29040ae258ebab5eec9ced48';
const LOCAL_PATH = 'assets/compass/governance-panel.catalog.v1.json';
const EXPECTED_SOURCE_REVISION = '3fbbe363777398cc29040ae258ebab5eec9ced48';
const EXPECTED_CATALOG_REVISION = '1.0.2';

const localText = await readFile(LOCAL_PATH, 'utf8');
const response = await fetch(SOURCE_URL, { cache: 'no-store' });
if (!response.ok) throw new Error(`canonical catalog fetch failed: HTTP ${response.status}`);
const sourcePayload = await response.json();
if (sourcePayload?.sha !== 'ec3454db6557746e477180b874c0b4649f4ee0ae') throw new Error('canonical catalog blob identity mismatch');
if (sourcePayload?.encoding !== 'base64' || typeof sourcePayload?.content !== 'string') throw new Error('canonical catalog content transport mismatch');
const sourceText = Buffer.from(sourcePayload.content.replace(/\\n/g, ''), 'base64').toString('utf8');

const hash = text => createHash('sha256').update(text, 'utf8').digest('hex');
if (hash(localText) !== hash(sourceText)) {
  throw new Error('derived catalog drift detected: local delivery artifact differs from canonical catalog revision');
}

const local = JSON.parse(localText);
if (local.substrate?.repository !== 'smansfield635-create/geodiametrics1') throw new Error('wrong substrate repository');
if (local.catalogId !== 'GOVERNANCE_PANEL_CATALOG_V1') throw new Error('wrong catalog identity');
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
