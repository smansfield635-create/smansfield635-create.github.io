import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const outputDir = process.argv.includes('--output-dir')
  ? process.argv[process.argv.indexOf('--output-dir') + 1]
  : '/tmp/imi-empirical-platform-operational-suite';

function runNode(args) {
  return execFileSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
}

const fixtureLog = runNode([
  'h-earth-3d/validation/imi-empirical-platform/imi.empirical-platform.runner.mjs',
  '--output-dir',
  path.join(outputDir, 'fixture')
]);

const intakeLog = runNode([
  'h-earth-3d/validation/imi-empirical-platform/imi.empirical-intake.runner.mjs',
  '--route',
  'h-earth-3d/tools/imi-empirical-platform/routes/example-hospital-route.v1.json',
  '--rows',
  'h-earth-3d/tools/imi-empirical-platform/examples/example-hospital-rows.v1.json',
  '--output-dir',
  path.join(outputDir, 'intake'),
  '--strict'
]);

const requiredOutputFiles = [
  'imi-study-run-output.v1.json',
  'imi-study-receipt.v1.json',
  'imi-case-results.v1.json',
  'imi-portfolio-registry.v1.json',
  'imi-portfolio-summary.v1.json',
  'imi-empirical-intake-operational-receipt.v1.json'
].map((name) => path.join(outputDir, 'intake', name));

for (const file of requiredOutputFiles) {
  if (!existsSync(file)) throw new Error(`MISSING_OPERATIONAL_OUTPUT:${file}`);
}

const operationalReceipt = JSON.parse(readFileSync(path.join(outputDir, 'intake', 'imi-empirical-intake-operational-receipt.v1.json'), 'utf8'));
if (operationalReceipt.result !== 'PASS_CLOSED_REPOSITORY_BRANCH_EMPIRICAL_INTAKE_OPERATIONAL') {
  throw new Error(`INTAKE_OPERATIONAL_RECEIPT_FAILED:${operationalReceipt.result}`);
}
if (operationalReceipt.boundaries.branchOperational !== true) throw new Error('BRANCH_OPERATIONAL_FLAG_MISSING');
if (operationalReceipt.boundaries.mainMerged !== false) throw new Error('MAIN_MERGE_BOUNDARY_BROKEN');
if (operationalReceipt.boundaries.liveWebsiteOperational !== false) throw new Error('LIVE_WEBSITE_BOUNDARY_BROKEN');

const suiteReceipt = {
  schemaVersion: 'IMI_EMPIRICAL_PLATFORM_OPERATIONAL_SUITE_RECEIPT_v1',
  result: 'PASS_CLOSED_OPERATIONAL_BRANCH_EMPIRICAL_PLATFORM',
  fixtureRunnerExecuted: true,
  genericIntakeRunnerExecuted: true,
  requiredOutputFiles,
  operationalReceipt,
  boundaries: {
    repositoryBranchOperational: true,
    oneRepositoryBasedEngineUsed: true,
    automaticPerceivedDataCapture: false,
    explicitDatasetAdmissionRequired: true,
    mainMerged: false,
    liveWebsiteOperational: false,
    finalRatification: false
  }
};

console.log(JSON.stringify(suiteReceipt, null, 2));
