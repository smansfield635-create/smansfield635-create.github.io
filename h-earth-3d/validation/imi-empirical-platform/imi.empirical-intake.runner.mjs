import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  addStudyToPortfolio,
  createPortfolio,
  portfolioSummary,
  runStudy,
  validateRouteSpec
} from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function resolveRepoPath(value) {
  if (!value) return null;
  return path.isAbsolute(value) ? value : path.join(ROOT, value);
}

async function readJson(filePath, fallback = null) {
  if (!filePath) return fallback;
  const text = await readFile(filePath, 'utf8');
  return JSON.parse(text);
}

async function exists(filePath) {
  if (!filePath) return false;
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const routePath = resolveRepoPath(argValue('--route', 'h-earth-3d/tools/imi-empirical-platform/routes/example-hospital-route.v1.json'));
const rowsPath = resolveRepoPath(argValue('--rows', 'h-earth-3d/tools/imi-empirical-platform/examples/example-hospital-rows.v1.json'));
const studyMetaPath = resolveRepoPath(argValue('--study-meta', null));
const datasetMetaPath = resolveRepoPath(argValue('--dataset-meta', null));
const portfolioInPath = resolveRepoPath(argValue('--portfolio-in', null));
const outputDir = resolveRepoPath(argValue('--output-dir', 'h-earth-3d/validation/imi-empirical-platform/output/example-operational-intake'));
const clockValue = argValue('--clock', '2026-08-05T04:30:00.000Z');
const strict = process.argv.includes('--strict');

const routeSpec = await readJson(routePath);
const rows = await readJson(rowsPath);
const studyMeta = await readJson(studyMetaPath, {
  studyId: 'IMI_EMPIRICAL_INTAKE_EXAMPLE_RUN_001',
  studyVersion: '1.0.0-example',
  validationClass: 'EXPLORATORY_EXAMPLE',
  backupStatus: 'REPOSITORY_BRANCH_OUTPUT',
  notes: ['Generic intake runner fixture; not a certified hospital route or real empirical claim.']
});
const datasetMeta = await readJson(datasetMetaPath, {
  datasetId: 'IMI_EXAMPLE_HOSPITAL_ROWS',
  datasetVersion: '1.0.0-example'
});

const routeValidation = validateRouteSpec(routeSpec);
if (!routeValidation.pass) throw new Error(`ROUTE_VALIDATION_FAILED:${routeValidation.errors.join(',')}`);

const studyRun = runStudy({
  studyMeta,
  datasetMeta,
  routeSpec,
  rows,
  clock: () => new Date(clockValue)
});

let portfolio;
if (await exists(portfolioInPath)) {
  portfolio = await readJson(portfolioInPath);
} else {
  portfolio = createPortfolio({
    portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_OPERATIONAL_v1',
    owner: 'DGB',
    createdAt: clockValue
  });
}
portfolio = addStudyToPortfolio(portfolio, studyRun);
const summary = portfolioSummary(portfolio);

await mkdir(outputDir, { recursive: true });
const outputs = {
  studyRunOutput: path.join(outputDir, 'imi-study-run-output.v1.json'),
  studyReceipt: path.join(outputDir, 'imi-study-receipt.v1.json'),
  caseResults: path.join(outputDir, 'imi-case-results.v1.json'),
  portfolioRegistry: path.join(outputDir, 'imi-portfolio-registry.v1.json'),
  portfolioSummary: path.join(outputDir, 'imi-portfolio-summary.v1.json'),
  operationalReceipt: path.join(outputDir, 'imi-empirical-intake-operational-receipt.v1.json')
};

await writeFile(outputs.studyRunOutput, JSON.stringify(studyRun, null, 2));
await writeFile(outputs.studyReceipt, JSON.stringify(studyRun.receipt, null, 2));
await writeFile(outputs.caseResults, JSON.stringify(studyRun.caseResults, null, 2));
await writeFile(outputs.portfolioRegistry, JSON.stringify(portfolio, null, 2));
await writeFile(outputs.portfolioSummary, JSON.stringify(summary, null, 2));

const operationalReceipt = {
  schemaVersion: 'IMI_EMPIRICAL_INTAKE_OPERATIONAL_RECEIPT_v1',
  result: 'PASS_CLOSED_REPOSITORY_BRANCH_EMPIRICAL_INTAKE_OPERATIONAL',
  repositoryRoot: ROOT,
  routePath,
  rowsPath,
  routeValidation,
  studyReceiptFingerprint: studyRun.receiptFingerprint,
  caseResultCount: studyRun.caseResults.length,
  portfolioStudyCount: summary.studyCount,
  outputs,
  boundaries: {
    branchOperational: true,
    mainMerged: false,
    liveWebsiteOperational: false,
    routeCertificationPerformed: false,
    realStudyClaimMade: false,
    publicReleaseAuthorized: false
  }
};

if (strict) {
  if (studyRun.receipt.summary.totalCases !== rows.length) throw new Error('INTAKE_TOTAL_CASE_MISMATCH');
  if (studyRun.receipt.summary.validCases < 1) throw new Error('INTAKE_NO_VALID_CASES');
  if (summary.studyCount < 1) throw new Error('INTAKE_PORTFOLIO_EMPTY');
  if (!studyRun.receiptFingerprint) throw new Error('INTAKE_RECEIPT_FINGERPRINT_MISSING');
}

await writeFile(outputs.operationalReceipt, JSON.stringify(operationalReceipt, null, 2));
console.log(JSON.stringify(operationalReceipt, null, 2));
