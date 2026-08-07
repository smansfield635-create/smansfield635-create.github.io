#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { runHEarthMapWideEnvironmentRedevelopmentVerification } from './verify.v1.mjs';

const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
    : value;

export async function observeHEarthMapWideEnvironmentRedevelopment({ output = null } = {}) {
  const verification = await runHEarthMapWideEnvironmentRedevelopmentVerification({ role: 'OBSERVER', output });
  const observation = stable({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_OBSERVER_RECEIPT_v1',
    result: verification.result,
    operationId: verification.operationId,
    lockGeneration: verification.lockGeneration,
    candidateHead: verification.candidateHead,
    constructionFingerprint: verification.constructionFingerprint,
    exactPathCount: verification.exactPathCount,
    changedPathCount: verification.changedPathCount,
    manorGeometryConstructed: false,
    liveRuntimeMutationAuthorized: false,
    mergeDeploymentReleaseAuthorized: false,
    verification
  });
  if (output) {
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(path.join(output, 'observer.receipt.v1.json'), JSON.stringify(observation, null, 2) + '\n');
  }
  return observation;
}

const invoked = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invoked) {
  const outputIndex = process.argv.indexOf('--output');
  const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  observeHEarthMapWideEnvironmentRedevelopment({ output }).then((receipt) => {
    process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
    if (receipt.result !== 'PASS') process.exitCode = 1;
  }).catch((error) => {
    process.stderr.write(JSON.stringify({ result: 'FAIL_CLOSED', error: error.message }, null, 2) + '\n');
    process.exitCode = 1;
  });
}
