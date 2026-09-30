import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const EXPECTED = Object.freeze({
  parentD3Head: 'f284180bdd6ca13387d61215b80b4bddb0fa035c',
  parentArtifactId: '8621733159',
  parentArtifactSize: 31584,
  parentArtifactSha256: '11a6a3531f709bb5ac921c943c87a159356902f013d59badddf535667101b224',
  factCount: 119,
  relationCount: 7,
  dimensionCount: 11,
  classificationSha256: '1b4fe0343dc5b7c24d248855405269b23c8735467d974a693676d49c30a8d8c8',
  relationClassificationSha256: '886c1e15ece9bae61760ff1195aab1644f9f3c7252608bcde365f8da63373088',
  dimensionSummarySha256: '39394397b7ce8640e3555a00757d2db57bc9eb677ffc6aa21a6221548cc17474',
  d3AggregateReceiptSha256: '2747d3935ded466fa744e5f4302de552ccc7dfafcf699e1c034fcb183ab0c9f7',
  dimensions: [
    'SOURCE_CUSTODY','AUTHORITY_BOUNDARIES','RUNTIME_LOAD','INTERACTION_EXECUTION',
    'VISUAL_REALIZATION','SPATIAL_REALIZATION','RESPONSIVE_BEHAVIOR','PERFORMANCE',
    'ACCESSIBILITY','DEPLOYED_IDENTITY','USER_ACCEPTANCE'
  ],
  bands: ['W4_DIRECT_EXECUTED_EXACT','W3_DIRECT_EXACT','W2_DETERMINISTIC_DERIVED','W1_CONTEXTUAL_OR_LIMITED','W0_NON_WEIGHTABLE']
});

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key.normalize('NFC'), stable(value[key])]))
    : typeof value === 'string' ? value.normalize('NFC') : value;

export const digest = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
export const assert = (condition, code) => { if (!condition) throw new Error(code); };
export const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
export const writeJson = async (path, value) => {
  await mkdir(resolve(path, '..'), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
export const unique = values => new Set(values).size === values.length;

export async function loadD3(root) {
  const facts = await readJson(resolve(root, 'canonical-fact-dimension-classification-manifest.json'));
  const relations = await readJson(resolve(root, 'relation-dimension-classification-manifest.json'));
  const dimensions = await readJson(resolve(root, 'dimension-coverage-manifest.json'));
  const receipt = await readJson(resolve(root, 'd3.aggregate.receipt.json'));
  assert(facts.classificationCount === EXPECTED.factCount, 'D4_PARENT_FACT_COUNT');
  assert(facts.classificationManifestSha256 === EXPECTED.classificationSha256, 'D4_PARENT_FACT_DIGEST');
  assert(digest(facts.records) === facts.classificationManifestSha256, 'D4_PARENT_FACT_BODY');
  assert(relations.classificationCount === EXPECTED.relationCount, 'D4_PARENT_RELATION_COUNT');
  assert(relations.classificationManifestSha256 === EXPECTED.relationClassificationSha256, 'D4_PARENT_RELATION_DIGEST');
  assert(digest(relations.records) === relations.classificationManifestSha256, 'D4_PARENT_RELATION_BODY');
  assert(dimensions.governedDimensionCount === EXPECTED.dimensionCount, 'D4_PARENT_DIMENSION_COUNT');
  assert(dimensions.dimensionSummarySha256 === EXPECTED.dimensionSummarySha256, 'D4_PARENT_DIMENSION_DIGEST');
  assert(digest(dimensions.dimensions) === dimensions.dimensionSummarySha256, 'D4_PARENT_DIMENSION_BODY');
  const { deterministicReceiptSha256, ...receiptBody } = receipt;
  assert(deterministicReceiptSha256 === EXPECTED.d3AggregateReceiptSha256, 'D4_PARENT_RECEIPT_DIGEST');
  assert(digest(receiptBody) === deterministicReceiptSha256, 'D4_PARENT_RECEIPT_BODY');
  return { facts, relations, dimensions, receipt };
}

export const weightId = record => `D4W_${digest({
  canonicalFactId: record.canonicalFactId,
  classificationId: record.classificationId,
  strengthBand: record.strengthBand,
  precedenceVector: record.precedenceVector
})}`;

export const relationWeightId = record => `D4RW_${digest({
  relationId: record.relationId,
  relationClassificationId: record.relationClassificationId,
  strengthBand: record.strengthBand,
  precedenceVector: record.precedenceVector
})}`;
