import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPECTED, assert, digest, loadD3, relationWeightId, unique, weightId, writeJson } from './metaverse-3d-benchmark-disposition-d4-core.mjs';
import { classifyFactWeight, classifyRelationWeight } from './metaverse-3d-benchmark-disposition-d4-rules.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const d3Root = process.env.D3_ARTIFACT_ROOT ?? resolve(here, '../../artifacts/metaverse-3d-benchmark-disposition-d3-input');
const outRoot = process.env.D4_ARTIFACT_ROOT ?? resolve(here, '../../artifacts/metaverse-3d-benchmark-disposition-d4');

export async function buildFactWeights() {
  const { facts } = await loadD3(d3Root);
  const records = facts.records.map(record => {
    const weight = classifyFactWeight(record);
    const result = {
      schemaVersion: 'METAVERSE_3D_BENCHMARK_FACT_WEIGHT_v1',
      canonicalFactId: record.canonicalFactId,
      classificationId: record.classificationId,
      laneId: record.laneId,
      subjectIdentity: record.subjectIdentity,
      predicateIdentity: record.predicateIdentity,
      primaryDimension: record.primaryDimension,
      dimensionState: record.dimensionState,
      ...weight,
      dimensionStateChanged: false,
      winnerSelected: false,
      disposition: 'NOT_COMPILED'
    };
    result.weightId = weightId(result);
    return result;
  });
  assert(records.length === EXPECTED.factCount, 'D4B_FACT_COUNT');
  assert(unique(records.map(record => record.canonicalFactId)), 'D4B_FACT_DUPLICATE');
  assert(unique(records.map(record => record.weightId)), 'D4B_WEIGHT_ID_DUPLICATE');
  assert(records.every(record => EXPECTED.bands.includes(record.strengthBand)), 'D4B_INVALID_BAND');
  assert(records.every(record => record.dimensionStateChanged === false && record.winnerSelected === false && record.disposition === 'NOT_COMPILED'), 'D4B_BOUNDARY');
  const manifest = {
    schema: 'METAVERSE_3D_D4B_CANONICAL_FACT_WEIGHT_MANIFEST_v1',
    checkpoint: 'D4B_CANONICAL_FACT_WEIGHT_ASSIGNMENT',
    sourceClassificationCount: EXPECTED.factCount,
    weightRecordCount: records.length,
    weightManifestSha256: digest(records),
    records
  };
  await writeJson(resolve(outRoot, 'canonical-fact-weight-manifest.json'), manifest);
  return manifest;
}

export async function buildRelationWeights() {
  const { relations } = await loadD3(d3Root);
  const records = relations.records.map(record => {
    const weight = classifyRelationWeight(record);
    const result = {
      schemaVersion: 'METAVERSE_3D_BENCHMARK_RELATION_WEIGHT_v1',
      relationId: record.relationId,
      relationClassificationId: record.relationClassificationId,
      primaryDimension: record.primaryDimension,
      dimensionState: record.dimensionState,
      ...weight,
      resolutionPerformed: false,
      winnerFactId: 'NONE',
      disposition: 'NOT_COMPILED'
    };
    result.relationWeightId = relationWeightId(result);
    return result;
  });
  assert(records.length === EXPECTED.relationCount, 'D4C_RELATION_COUNT');
  assert(unique(records.map(record => record.relationId)), 'D4C_RELATION_DUPLICATE');
  assert(unique(records.map(record => record.relationWeightId)), 'D4C_RELATION_WEIGHT_ID_DUPLICATE');
  assert(records.every(record => record.resolutionPerformed === false && record.winnerFactId === 'NONE' && record.disposition === 'NOT_COMPILED'), 'D4C_RELATION_BOUNDARY');
  const manifest = {
    schema: 'METAVERSE_3D_D4C_RELATION_WEIGHT_MANIFEST_v1',
    checkpoint: 'D4C_RELATION_AND_DIMENSION_STRENGTH_COMPILATION',
    sourceRelationCount: EXPECTED.relationCount,
    weightRecordCount: records.length,
    relationWeightManifestSha256: digest(records),
    records
  };
  await writeJson(resolve(outRoot, 'relation-weight-manifest.json'), manifest);
  return manifest;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2] ?? 'facts';
  if (mode === 'facts') {
    const result = await buildFactWeights();
    console.log(JSON.stringify({ checkpoint: result.checkpoint, count: result.weightRecordCount, sha256: result.weightManifestSha256 }));
  } else if (mode === 'relations') {
    const result = await buildRelationWeights();
    console.log(JSON.stringify({ checkpoint: result.checkpoint, count: result.weightRecordCount, sha256: result.relationWeightManifestSha256 }));
  } else {
    throw new Error(`D4_UNKNOWN_MODE:${mode}`);
  }
}
