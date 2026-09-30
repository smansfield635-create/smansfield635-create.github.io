#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fail, parseArgs, readJson, stable, writeJson } from './lib.v1.mjs';
import { runSelfTest } from './self-test.v1.mjs';

export function runFreshVerifier({ root, expectedHead, builderReceiptPath, holder, outputDir, repairRequested = false }) {
  if (repairRequested) fail('VERIFIER_REPAIR_PROHIBITED');
  const builder = readJson(builderReceiptPath);
  if (builder.result !== 'PASS_CLOSED') fail('BUILDER_RECEIPT_NOT_PASS_CLOSED');
  if (builder.executionHolder === holder) fail('EXECUTION_HOLDERS_NOT_DISTINCT');
  const reproduced = runSelfTest({ root, expectedHead, holder, outputDir: path.join(outputDir,'reproduction') });
  if (reproduced.packageFingerprint !== builder.packageFingerprint) fail('PACKAGE_FINGERPRINT_MISMATCH');
  const receipt = stable({
    schema:'FRESH_INDEPENDENT_BOOTSTRAP_VERIFIER_RECEIPT_v1',
    result:'PASS_CLOSED',
    executionHolder:holder,
    builderExecutionHolder:builder.executionHolder,
    expectedHead,
    packageFingerprint:reproduced.packageFingerprint,
    builderFingerprint:builder.packageFingerprint,
    independentReproduction:true,
    repairPerformed:false,
    actualTerrainMutationPerformed:false,
    manorConstructionPerformed:false,
    permanentInstrumentActivated:false,
    mergePerformed:false
  });
  writeJson(path.join(outputDir,'fresh-verifier-receipt.json'),receipt);
  return receipt;
}

function main(){
  const args=parseArgs(process.argv.slice(2));
  runFreshVerifier({
    root:path.resolve(args.root??'.'),
    expectedHead:args['expected-head'],
    builderReceiptPath:path.resolve(args['builder-receipt']),
    holder:args.holder,
    outputDir:path.resolve(args['output-dir']??'/tmp/map-wide-terrain-verifier'),
    repairRequested:false
  });
}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);if(invoked)main();
