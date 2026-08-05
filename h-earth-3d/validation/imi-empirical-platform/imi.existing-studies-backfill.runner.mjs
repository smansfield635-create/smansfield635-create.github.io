import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze, stableStringify } from '../../tools/instrument-platform/platform-core.mjs';

const require = createRequire(import.meta.url);
const manifest = require('../../tools/imi-empirical-platform/studies/existing/legacy-study-backfill.manifest.v1.json');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function countBy(values) {
  const counts = {};
  for (const value of values) counts[value] = (counts[value] || 0) + 1;
  return counts;
}

function safeFileName(id) {
  return String(id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildBackfillReceipt(study) {
  const body = {
    schemaVersion: 'IMI_LEGACY_STUDY_BACKFILL_RECEIPT_v1',
    receiptClass: 'LEGACY_SUMMARY_RECEIPT_IMPORTED_TO_REPOSITORY_BRANCH_EMPIRICAL_PLATFORM',
    studyId: study.studyId,
    registryId: study.registryId,
    domain: study.domain,
    studyVersion: study.studyVersion,
    validationClass: study.validationClass,
    sourceClass: study.sourceClass,
    sourceFiles: study.sourceFiles,
    routeIdentity: study.routeIdentity,
    rawRowsAvailableInBranch: study.rawRowsAvailableInBranch === true,
    derivedCaseOutputAvailable: study.derivedCaseOutputAvailable === true,
    summary: study.summary,
    weakestFactorCounts: study.weakestFactorCounts || null,
    portfolioDeterminations: study.portfolioDeterminations,
    limitations: study.limitations,
    boundaries: {
      rawDataRerunPerformed: false,
      summaryBackfillPerformed: true,
      generatedByRepositoryBackfillRunner: true,
      routeCertificationPerformed: false,
      confirmatoryValidationClaimed: false,
      publicReleaseAuthorized: false
    }
  };
  return deepFreeze({
    ...body,
    receiptFingerprint: canonicalDigest(body)
  });
}

function buildPortfolioRegistry(receipts) {
  const entries = receipts.map((receipt) => ({
    studyId: receipt.studyId,
    registryId: receipt.registryId,
    domain: receipt.domain,
    studyVersion: receipt.studyVersion,
    validationClass: receipt.validationClass,
    routeId: receipt.routeIdentity.routeId,
    routeVersion: receipt.routeIdentity.routeVersion,
    receiptFingerprint: receipt.receiptFingerprint,
    rawRowsAvailableInBranch: receipt.rawRowsAvailableInBranch,
    derivedCaseOutputAvailable: receipt.derivedCaseOutputAvailable,
    caseCount: receipt.summary.validCases ?? receipt.summary.numericCases ?? receipt.summary.participants ?? receipt.summary.stateQuarterRows ?? null,
    hardCollapseCases: receipt.summary.hardCollapseCases ?? null
  }));
  const body = {
    schemaVersion: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_LEGACY_BACKFILL_v1',
    registryClass: 'EXISTING_STUDY_BACKFILL_PORTFOLIO_REGISTRY',
    entryCount: entries.length,
    entries
  };
  return deepFreeze({
    ...body,
    registryFingerprint: canonicalDigest(body)
  });
}

const outputDir = argValue('--output-dir', null);
const expectedStudyIds = new Set([
  'IMI_HOSPITAL_MEASURE_LEVEL_ROBUSTNESS_EXTENSION_1B',
  'IMI_EMPIRICAL_STUDY_02_SPONTANEOUS_SPEECH_EXPLORATORY_v1',
  'IMI_AGRICULTURAL_COLONY_RESILIENCE_EXPLORATORY_LONGITUDINAL_v1',
  'DSSI_SOVEREIGN_DEBT_SERVICE_IMI_BOOTSTRAP_v1'
]);

if (manifest.schemaVersion !== 'IMI_EXISTING_STUDY_BACKFILL_MANIFEST_v1') throw new Error('BACKFILL_MANIFEST_SCHEMA_MISMATCH');
if (!Array.isArray(manifest.studies)) throw new Error('BACKFILL_MANIFEST_STUDIES_MISSING');
if (manifest.studies.length !== 4) throw new Error(`BACKFILL_STUDY_COUNT_FAILURE:${manifest.studies.length}`);

const seen = new Set();
for (const study of manifest.studies) {
  if (!expectedStudyIds.has(study.studyId)) throw new Error(`UNKNOWN_BACKFILL_STUDY:${study.studyId}`);
  if (seen.has(study.studyId)) throw new Error(`DUPLICATE_BACKFILL_STUDY:${study.studyId}`);
  seen.add(study.studyId);
  if (!study.routeIdentity?.routeId) throw new Error(`BACKFILL_ROUTE_ID_MISSING:${study.studyId}`);
  if (!study.summary || typeof study.summary !== 'object') throw new Error(`BACKFILL_SUMMARY_MISSING:${study.studyId}`);
  if (!Array.isArray(study.sourceFiles) || study.sourceFiles.length === 0) throw new Error(`BACKFILL_SOURCE_FILES_MISSING:${study.studyId}`);
  if (!String(study.validationClass).includes('EXPLORATORY')) throw new Error(`BACKFILL_CLASSIFICATION_NOT_EXPLORATORY:${study.studyId}`);
}

const receipts = manifest.studies.map(buildBackfillReceipt);
const portfolioRegistry = buildPortfolioRegistry(receipts);
const summary = deepFreeze({
  schemaVersion: 'IMI_EXISTING_STUDY_BACKFILL_SUMMARY_v1',
  result: 'PASS_CLOSED_EXISTING_STUDIES_IMPORTED_AS_LEGACY_BACKFILL_RECEIPTS',
  studyCount: receipts.length,
  domains: countBy(receipts.map((receipt) => receipt.domain)),
  validationClasses: countBy(receipts.map((receipt) => receipt.validationClass)),
  rawRowsAvailableInBranchCount: receipts.filter((receipt) => receipt.rawRowsAvailableInBranch).length,
  derivedCaseOutputAvailableCount: receipts.filter((receipt) => receipt.derivedCaseOutputAvailable).length,
  hardCollapseCasesAcrossBackfill: receipts.reduce((total, receipt) => total + (receipt.summary.hardCollapseCases || 0), 0),
  registryFingerprint: portfolioRegistry.registryFingerprint
});

const operationalReceiptBody = {
  schemaVersion: 'IMI_EXISTING_STUDIES_BACKFILL_OPERATIONAL_RECEIPT_v1',
  result: summary.result,
  manifestFingerprint: canonicalDigest(manifest),
  receiptFingerprints: receipts.map((receipt) => receipt.receiptFingerprint),
  portfolioRegistryFingerprint: portfolioRegistry.registryFingerprint,
  summary,
  boundaries: manifest.boundaries
};
const operationalReceipt = deepFreeze({
  ...operationalReceiptBody,
  operationalReceiptFingerprint: canonicalDigest(operationalReceiptBody)
});

if (outputDir) {
  await mkdir(path.join(outputDir, 'legacy-study-receipts'), { recursive: true });
  for (const receipt of receipts) {
    await writeFile(path.join(outputDir, 'legacy-study-receipts', `${safeFileName(receipt.studyId)}.receipt.v1.json`), stableStringify(receipt, 2));
  }
  await writeFile(path.join(outputDir, 'imi-existing-study-backfill-portfolio-registry.v1.json'), stableStringify(portfolioRegistry, 2));
  await writeFile(path.join(outputDir, 'imi-existing-study-backfill-summary.v1.json'), stableStringify(summary, 2));
  await writeFile(path.join(outputDir, 'imi-existing-study-backfill-operational-receipt.v1.json'), stableStringify(operationalReceipt, 2));
}

console.log(stableStringify(operationalReceipt, 2));
