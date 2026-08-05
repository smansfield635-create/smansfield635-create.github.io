import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stableStringify } from '../../tools/instrument-platform/platform-core.mjs';

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const inputPath = argValue('--input');
const outputPath = argValue('--output');
if (!inputPath || !outputPath) throw new Error('CLAC_JS_BIND_INPUT_AND_OUTPUT_REQUIRED');

const source = JSON.parse(await readFile(inputPath, 'utf8'));
const { payloadSha256: pythonPayloadSha256, ...body } = source;
if (typeof pythonPayloadSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(pythonPayloadSha256)) {
  throw new Error(`CLAC_PYTHON_PAYLOAD_SHA256_INVALID:${pythonPayloadSha256}`);
}
const boundBody = {
  ...body,
  canonicalBinding: {
    pythonPayloadSha256,
    javascriptCanonicalization: 'H_EARTH_PLATFORM_STABLE_STRINGIFY',
    featureValuesChanged: false
  }
};
const payloadSha256 = createHash('sha256').update(stableStringify(boundBody), 'utf8').digest('hex');
const output = { ...boundBody, payloadSha256 };
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({
  result: 'PASS_CLAC_FEATURE_PACKAGE_JAVASCRIPT_CANONICAL_BINDING',
  pythonPayloadSha256,
  payloadSha256,
  featureValuesChanged: false
}, null, 2));
