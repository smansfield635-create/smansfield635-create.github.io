import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPECTED, assert, classificationId, digest, loadD2S, writeJson } from './metaverse-3d-benchmark-disposition-d3-core.mjs';
import { classifyFact } from './metaverse-3d-benchmark-disposition-d3-rules.mjs';

export function classifyParentFacts(records) {
  const source = records.filter(x => x.canonicalFactId.startsWith('D2F_'));
  assert(source.length === EXPECTED.parentFactCount, 'D3B_PARENT_COUNT');
  const classifications = source.map(fact => {
    const record = classifyFact(fact);
    return { ...record, classificationId: classificationId(record) };
  });
  assert(new Set(classifications.map(x => x.canonicalFactId)).size === EXPECTED.parentFactCount, 'D3B_PARENT_UNIQUE');
  const classificationManifestSha256 = digest(classifications);
  return {
    schema: 'METAVERSE_3D_D3B_PARENT_FACT_CLASSIFICATION_MANIFEST_v1',
    checkpoint: 'D3B_PARENT_D2_FACT_CLASSIFICATION',
    sourceFactCount: EXPECTED.parentFactCount,
    classificationCount: classifications.length,
    classificationManifestSha256,
    records: classifications,
  };
}

export function classifyDeltaFacts(records) {
  const source = records.filter(x => x.canonicalFactId.startsWith('D2SF_'));
  assert(source.length === EXPECTED.deltaFactCount, 'D3C_DELTA_COUNT');
  const classifications = source.map(fact => {
    const record = classifyFact(fact);
    return { ...record, classificationId: classificationId(record) };
  });
  assert(new Set(classifications.map(x => x.canonicalFactId)).size === EXPECTED.deltaFactCount, 'D3C_DELTA_UNIQUE');
  const classificationManifestSha256 = digest(classifications);
  return {
    schema: 'METAVERSE_3D_D3C_DELTA_FACT_CLASSIFICATION_MANIFEST_v1',
    checkpoint: 'D3C_T3_DELTA_FACT_CLASSIFICATION',
    sourceFactCount: EXPECTED.deltaFactCount,
    classificationCount: classifications.length,
    classificationManifestSha256,
    records: classifications,
  };
}

async function main() {
  const mode = process.env.D3_CLASSIFICATION_MODE || process.argv[2] || 'both';
  const input = process.env.D3_INPUT_ROOT || process.argv[3];
  const output = process.env.D3_OUTPUT_ROOT || process.argv[4];
  assert(input && output, 'D3_CLASSIFICATION_PATHS_REQUIRED');
  const { facts } = await loadD2S(resolve(input));
  const results = [];
  if (mode === 'parent' || mode === 'both') {
    const manifest = classifyParentFacts(facts.records);
    await writeJson(resolve(output, 'd3b-parent-classification.json'), manifest);
    results.push({ checkpoint: manifest.checkpoint, count: manifest.classificationCount, digest: manifest.classificationManifestSha256 });
  }
  if (mode === 'delta' || mode === 'both') {
    const manifest = classifyDeltaFacts(facts.records);
    await writeJson(resolve(output, 'd3c-delta-classification.json'), manifest);
    results.push({ checkpoint: manifest.checkpoint, count: manifest.classificationCount, digest: manifest.classificationManifestSha256 });
  }
  assert(['parent','delta','both'].includes(mode), 'D3_CLASSIFICATION_MODE');
  console.log(JSON.stringify(results));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
