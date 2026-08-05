import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  addStudyToPortfolio,
  createPortfolio,
  portfolioSummary,
  runStudy,
  validateRouteSpec
} from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const route = require('../../tools/imi-empirical-platform/routes/example-hospital-route.v1.json');
const rows = require('../../tools/imi-empirical-platform/examples/example-hospital-rows.v1.json');
const outputDir = argValue('--output-dir', null);

const fixedClock = () => new Date('2026-08-05T04:00:00.000Z');
const routeValidation = validateRouteSpec(route);
if (!routeValidation.pass) throw new Error(`ROUTE_VALIDATION_FAILED:${routeValidation.errors.join(',')}`);

const studyRun = runStudy({
  studyMeta: {
    studyId: 'IMI_EMPIRICAL_PLATFORM_EXAMPLE_RUN_001',
    studyVersion: '1.0.0-example',
    validationClass: 'EXPLORATORY_EXAMPLE',
    backupStatus: 'REPOSITORY_EXAMPLE_ONLY',
    notes: ['Validates repository-integrated empirical platform behavior; does not certify hospital route.']
  },
  datasetMeta: {
    datasetId: 'IMI_EXAMPLE_HOSPITAL_ROWS',
    datasetVersion: '1.0.0-example'
  },
  routeSpec: route,
  rows,
  clock: fixedClock
});

let portfolio = createPortfolio({
  portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_EXAMPLE_v1',
  owner: 'DGB',
  createdAt: '2026-08-05T04:00:00.000Z'
});
portfolio = addStudyToPortfolio(portfolio, studyRun);

const summary = portfolioSummary(portfolio);
const receipt = {
  schemaVersion: 'IMI_EMPIRICAL_PLATFORM_VALIDATION_RECEIPT_v1',
  result: 'PASS_CLOSED_IMI_EMPIRICAL_PLATFORM_EXAMPLE_FIXTURE',
  routeValidation,
  studyReceiptFingerprint: studyRun.receiptFingerprint,
  studySummary: studyRun.receipt.summary,
  portfolioSummary: summary,
  caseResults: studyRun.caseResults,
  boundaries: {
    routeCertificationPerformed: false,
    realStudyDataLoaded: false,
    empiricalValidationClaimed: false,
    productMutationPerformed: false,
    publicReleaseAuthorized: false
  }
};

if (studyRun.receipt.summary.totalCases !== 4) throw new Error('TOTAL_CASE_COUNT_FAILURE');
if (studyRun.receipt.summary.validCases !== 3) throw new Error('VALID_CASE_COUNT_FAILURE');
if (studyRun.receipt.summary.unevaluableCases !== 1) throw new Error('UNEVALUABLE_CASE_COUNT_FAILURE');
if (studyRun.receipt.summary.hardCollapseCases !== 1) throw new Error('HARD_COLLAPSE_COUNT_FAILURE');
if (summary.studyCount !== 1) throw new Error('PORTFOLIO_STUDY_COUNT_FAILURE');
if (!studyRun.caseResults.some((result) => result.status === 'UNEVALUABLE')) throw new Error('UNEVALUABLE_FIXTURE_NOT_PRESENT');
if (!studyRun.caseResults.some((result) => result.hardCollapse === true && result.imi === 0)) throw new Error('HARD_COLLAPSE_FIXTURE_NOT_PRESENT');

if (outputDir) {
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'imi-empirical-platform-validation-receipt.v1.json'), JSON.stringify(receipt, null, 2));
}

console.log(JSON.stringify(receipt, null, 2));
