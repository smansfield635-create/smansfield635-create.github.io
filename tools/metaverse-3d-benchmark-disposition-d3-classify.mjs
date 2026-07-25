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

async function main() {
  const input = process.env.D3_INPUT_ROOT || process.argv[2];
  const output = process.env.D3_OUTPUT_ROOT || process.argv[3];
  assert(input && output, 'D3B_PATHS_REQUIRED');
  const { facts } = await loadD2S(resolve(input));
  const manifest = classifyParentFacts(facts.records);
  await writeJson(resolve(output, 'd3b-parent-classification.json'), manifest);
  console.log(JSON.stringify({ checkpoint: manifest.checkpoint, count: manifest.classificationCount, digest: manifest.classificationManifestSha256 }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
