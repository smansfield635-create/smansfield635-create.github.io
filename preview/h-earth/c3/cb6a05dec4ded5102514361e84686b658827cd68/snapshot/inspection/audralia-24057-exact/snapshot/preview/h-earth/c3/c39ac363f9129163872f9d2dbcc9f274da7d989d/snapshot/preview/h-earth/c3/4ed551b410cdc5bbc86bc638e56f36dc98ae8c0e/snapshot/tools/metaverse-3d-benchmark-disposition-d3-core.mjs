import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export const EXPECTED = Object.freeze({
  parentHead: 'f2dbc0e3cf9c5053641425f662eaee036aa3d11d',
  artifactId: '8621351263', artifactSize: 35907,
  artifactSha256: '5c5c9bd026845918cc908de643368a8aeeb0cde1e48b9b285aaa0c3c575101c8',
  factCount: 119,
  factDigest: '7ce22d2cb309bcec5590043d38ebea95c80c3aa8f49474b7b7321c7b56827b20',
  relationCount: 7,
  relationDigest: 'd37d39e950ae9c67c5e2abd99af79d465379270a55481590e822912c5cbd8b52',
  supplementDigest: '940f4705c6bdddc89f67692b6e938410de280a8977f25062d77cccd5369ba7ed',
  aggregateDigest: '0c67caecbfe10c44cacd8fc39891a6fb63315fa30b0c3355893ca1071d9ed970',
  parentFactCount: 47,
  deltaFactCount: 72,
});

export const DIMENSIONS = Object.freeze([
  'SOURCE_CUSTODY','AUTHORITY_BOUNDARIES','RUNTIME_LOAD','INTERACTION_EXECUTION',
  'VISUAL_REALIZATION','SPATIAL_REALIZATION','RESPONSIVE_BEHAVIOR','PERFORMANCE',
  'ACCESSIBILITY','DEPLOYED_IDENTITY','USER_ACCEPTANCE',
]);
export const STATES = Object.freeze(['PASS','FAIL','BLOCKED','UNRESOLVED','NOT_EXECUTED','NOT_APPLICABLE','SUPERSEDED','WITHHELD']);
export const LANES = Object.freeze(['FOUR_COMPASS_PRODUCTION_BENCHMARK_CORPUS','UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE','PROJECT_AWARENESS_V1_HISTORICAL_BASELINE']);

export const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(k => [k.normalize('NFC'), stable(value[k])]))
  : typeof value === 'string' ? value.normalize('NFC') : value;
export const digest = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
export const fail = code => { throw new Error(code); };
export const assert = (condition, code) => { if (!condition) fail(code); };
export const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
export const writeJson = async (path, value) => { await mkdir(resolve(path, '..'), { recursive: true }); await writeFile(path, `${JSON.stringify(value, null, 2)}\n`); };
export const receiptDigestValid = (receipt, expected) => {
  const { deterministicReceiptSha256, ...body } = receipt;
  return deterministicReceiptSha256 === expected && digest(body) === expected;
};

export async function loadD2S(root) {
  const [facts, relations, supplement, aggregate] = await Promise.all([
    readJson(resolve(root, 'combined-canonical-fact-manifest.json')),
    readJson(resolve(root, 'combined-fact-coexistence-index.json')),
    readJson(resolve(root, 'supplement.receipt.json')),
    readJson(resolve(root, 'aggregate.receipt.json')),
  ]);
  assert(facts.combinedCanonicalFactCount === EXPECTED.factCount, 'D3_FACT_COUNT');
  assert(facts.combinedFactManifestSha256 === EXPECTED.factDigest, 'D3_FACT_DECLARED_DIGEST');
  assert(digest(facts.records) === EXPECTED.factDigest, 'D3_FACT_BODY_DIGEST');
  assert(relations.combinedRelationCount === EXPECTED.relationCount, 'D3_RELATION_COUNT');
  assert(relations.combinedCoexistenceIndexSha256 === EXPECTED.relationDigest, 'D3_RELATION_DECLARED_DIGEST');
  assert(digest(relations.relations) === EXPECTED.relationDigest, 'D3_RELATION_BODY_DIGEST');
  assert(receiptDigestValid(supplement, EXPECTED.supplementDigest), 'D3_SUPPLEMENT_RECEIPT');
  assert(receiptDigestValid(aggregate, EXPECTED.aggregateDigest), 'D3_AGGREGATE_RECEIPT');
  const ids = facts.records.map(x => x.canonicalFactId);
  assert(new Set(ids).size === EXPECTED.factCount, 'D3_FACT_ID_UNIQUENESS');
  return { facts, relations, supplement, aggregate };
}

export const classificationId = record => `D3C_${digest({
  canonicalFactId: record.canonicalFactId,
  primaryDimension: record.primaryDimension,
  dimensionState: record.dimensionState,
  ruleId: record.ruleId,
})}`;
export const relationClassificationId = record => `D3RC_${digest({
  relationId: record.relationId,
  primaryDimension: record.primaryDimension,
  dimensionState: record.dimensionState,
  ruleId: record.ruleId,
})}`;
