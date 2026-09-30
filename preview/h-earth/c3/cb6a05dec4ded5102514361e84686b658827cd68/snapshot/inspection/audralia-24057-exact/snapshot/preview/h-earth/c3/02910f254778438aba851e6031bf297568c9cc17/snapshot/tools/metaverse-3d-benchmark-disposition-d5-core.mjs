import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export const EXPECTED = Object.freeze({
  parentD4Head: '874012997a9a41c91d5c50746f29ec063e979755',
  factCount: 119,
  relationCount: 7,
  dimensionCount: 11,
  factWeightManifestSha256: '24c8d4d97db4dd6b0a3feb268cb58a2e560b9d76452ddb2f93acd1afed1a1092',
  relationWeightManifestSha256: '17da29918716c7cb39918b8b52157d00cf38b6af8b5561a1f377ef662a4f49e8',
  dimensionStrengthManifestSha256: 'e438e286a7d0760692b81f31ee224094e9fd138c81f3ffb5adbfe62354858df6',
  d4AggregateReceiptSha256: '15f5c32ab54f0090ace8928e02137684118dd90c72c27747a0b2a23b7eaacc4a'
});

export const DIMENSIONS = Object.freeze([
  'SOURCE_CUSTODY','AUTHORITY_BOUNDARIES','RUNTIME_LOAD','INTERACTION_EXECUTION',
  'VISUAL_REALIZATION','SPATIAL_REALIZATION','RESPONSIVE_BEHAVIOR','PERFORMANCE',
  'ACCESSIBILITY','DEPLOYED_IDENTITY','USER_ACCEPTANCE'
]);

export const SUBJECTS = Object.freeze([
  'MAIN_COMPASS','ARCHCOIN_COMPASS','SHOWROOM_COMPASS','LAWS_COMPASS',
  'WEBSITE_HOME_RECEIVER_CONTROL','UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE',
  'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE','FOUR_COMPASS_SHARED_EVIDENCE_INFRASTRUCTURE'
]);

export const BAND_ORDER = Object.freeze([
  'W4_DIRECT_EXECUTED_EXACT','W3_DIRECT_EXACT','W2_DETERMINISTIC_DERIVED',
  'W1_CONTEXTUAL_OR_LIMITED','W0_NON_WEIGHTABLE'
]);

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key.normalize('NFC'), stable(value[key])]))
    : typeof value === 'string' ? value.normalize('NFC') : value;

export const digest = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
export const assert = (condition, code) => { if (!condition) throw new Error(code); };
export const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
export const writeJson = async (root, name, value) => {
  await mkdir(root, { recursive: true });
  await writeFile(resolve(root, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
export const idFor = (prefix, value) => `${prefix}_${digest(value)}`;
export const strongestBand = records => {
  for (const band of BAND_ORDER) if (records.some(record => record.strengthBand === band)) return band;
  return 'W0_NON_WEIGHTABLE';
};

export function governedSubject(subjectIdentity) {
  if (['MAIN_COMPASS','ARCHCOIN_COMPASS','SHOWROOM_COMPASS','LAWS_COMPASS'].includes(subjectIdentity)) return subjectIdentity;
  if (subjectIdentity.includes('HOME_AUXILIARY') || subjectIdentity === 'WEBSITE_HOME_RECEIVER_CONTROL') return 'WEBSITE_HOME_RECEIVER_CONTROL';
  if (subjectIdentity.includes('UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE')) return 'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE';
  if (subjectIdentity.includes('PROJECT_AWARENESS_V1_HISTORICAL_BASELINE')) return 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE';
  return 'FOUR_COMPASS_SHARED_EVIDENCE_INFRASTRUCTURE';
}

export async function loadD4(root = process.env.D4_ARTIFACT_ROOT) {
  assert(root, 'D5_D4_ARTIFACT_ROOT_REQUIRED');
  const [facts, relations, dimensions, aggregate] = await Promise.all([
    readJson(resolve(root, 'canonical-fact-weight-manifest.json')),
    readJson(resolve(root, 'relation-weight-manifest.json')),
    readJson(resolve(root, 'dimension-evidence-strength-manifest.json')),
    readJson(resolve(root, 'd4.aggregate.receipt.json'))
  ]);
  assert(facts.weightRecordCount === EXPECTED.factCount, 'D5_D4_FACT_COUNT_MISMATCH');
  assert(facts.weightManifestSha256 === EXPECTED.factWeightManifestSha256, 'D5_D4_FACT_DIGEST_MISMATCH');
  assert(digest(facts.records) === facts.weightManifestSha256, 'D5_D4_FACT_SEMANTIC_DIGEST_MISMATCH');
  assert(relations.weightRecordCount === EXPECTED.relationCount, 'D5_D4_RELATION_COUNT_MISMATCH');
  assert(relations.relationWeightManifestSha256 === EXPECTED.relationWeightManifestSha256, 'D5_D4_RELATION_DIGEST_MISMATCH');
  assert(digest(relations.records) === relations.relationWeightManifestSha256, 'D5_D4_RELATION_SEMANTIC_DIGEST_MISMATCH');
  assert(dimensions.governedDimensionCount === EXPECTED.dimensionCount, 'D5_D4_DIMENSION_COUNT_MISMATCH');
  assert(dimensions.dimensionStrengthManifestSha256 === EXPECTED.dimensionStrengthManifestSha256, 'D5_D4_DIMENSION_DIGEST_MISMATCH');
  assert(digest(dimensions.dimensions) === dimensions.dimensionStrengthManifestSha256, 'D5_D4_DIMENSION_SEMANTIC_DIGEST_MISMATCH');
  const { deterministicReceiptSha256, ...aggregateBody } = aggregate;
  assert(deterministicReceiptSha256 === EXPECTED.d4AggregateReceiptSha256, 'D5_D4_AGGREGATE_DIGEST_MISMATCH');
  assert(digest(aggregateBody) === deterministicReceiptSha256, 'D5_D4_AGGREGATE_SEMANTIC_DIGEST_MISMATCH');
  return { facts, relations, dimensions, aggregate };
}
