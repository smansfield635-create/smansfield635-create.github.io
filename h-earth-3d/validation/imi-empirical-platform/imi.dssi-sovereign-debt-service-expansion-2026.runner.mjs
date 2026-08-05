import { createRequire } from 'node:module';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { addStudyToPortfolio, createPortfolio, portfolioSummary, runStudy } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/dssi-sovereign-debt-service-expansion-2026-route.v1.json');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const packageRoot = path.join(repoRoot, 'h-earth-3d/tools/imi-empirical-platform/studies/source-packages/dssi-2025');
const manifestPath = path.join(packageRoot, 'dssi-source-package-manifest.v1.json');
const segmentsDir = path.join(packageRoot, 'segments');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const outputDir = argValue('--output-dir', '/tmp/imi-dssi-sovereign-debt-service-expansion-2026');
const clock = () => new Date(argValue('--clock', '2026-08-05T15:20:00.000Z'));
const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));
const unique = (values) => Array.from(new Set(values));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateManifest(manifest) {
  assert(manifest.schemaVersion === 'DSSI_WEB_EXTRACTED_SOURCE_PACKAGE_MANIFEST_v1', 'INVALID_DSSI_MANIFEST_SCHEMA');
  assert(manifest.routeId === route.routeId, 'DSSI_ROUTE_MANIFEST_MISMATCH');
  assert(Array.isArray(manifest.candidateCountries), 'DSSI_CANDIDATE_COUNTRIES_NOT_ARRAY');
  assert(manifest.candidateCountries.length === manifest.candidateCountryCount, 'DSSI_CANDIDATE_COUNT_MISMATCH');
  assert(unique(manifest.candidateCountries).length === manifest.candidateCountries.length, 'DSSI_DUPLICATE_CANDIDATE_COUNTRY');
  const segmented = manifest.segmentation.flatMap((entry) => entry.countryCodes);
  assert(segmented.length === manifest.candidateCountries.length, 'DSSI_SEGMENTED_COUNTRY_COUNT_MISMATCH');
  assert(unique(segmented).length === segmented.length, 'DSSI_DUPLICATE_SEGMENTED_COUNTRY');
}

function rowError(row, manifest) {
  for (const key of ['country_code', 'country_name', 'data_year', 'annual_interest', 'annual_principal', 'annual_total_debt_service', 'a_interest_dispersion', 'a_principal_dispersion', 'dssi_page']) {
    if (!(key in row)) return `MISSING_${key}`;
  }
  if (!manifest.candidateCountries.includes(row.country_code)) return `COUNTRY_NOT_IN_MANIFEST:${row.country_code}`;
  for (const key of ['a_interest_dispersion', 'a_principal_dispersion']) {
    if (!(Number.isFinite(row[key]) && row[key] >= 0 && row[key] <= 1)) return `INVALID_AVAILABILITY:${row.country_code}:${key}`;
  }
  return null;
}

async function loadRows(manifest) {
  const names = (await readdir(segmentsDir)).filter((name) => name.endsWith('.json')).sort();
  const rows = [];
  const invalidRows = [];
  const seen = new Set();
  for (const name of names) {
    const segment = await readJson(path.join(segmentsDir, name));
    assert(segment.schemaVersion === 'DSSI_WEB_EXTRACTED_SOURCE_ROW_SEGMENT_v1', `INVALID_DSSI_SEGMENT_SCHEMA:${name}`);
    assert(segment.packageId === manifest.packageId, `DSSI_SEGMENT_PACKAGE_MISMATCH:${name}`);
    for (const row of (segment.rows || [])) {
      const error = rowError(row, manifest);
      if (error) invalidRows.push({ country_code: row.country_code ?? null, segment: name, error });
      else if (seen.has(row.country_code)) invalidRows.push({ country_code: row.country_code, segment: name, error: 'DUPLICATE_SOURCE_ROW' });
      else { seen.add(row.country_code); rows.push(row); }
    }
  }
  return { segmentCount: names.length, rows, invalidRows };
}

function heldReceipt({ manifest, segmentCount, rows, invalidRows }) {
  const extractedCountryCodes = unique(rows.map((row) => row.country_code)).sort();
  const pendingCountryCodes = manifest.candidateCountries.filter((code) => !extractedCountryCodes.includes(code));
  return deepFreeze({
    schemaVersion: 'IMI_DSSI_SEGMENTED_SOURCE_INTAKE_HELD_RECEIPT_v1',
    result: 'HELD_PENDING_DSSI_WEB_EXTRACTED_SOURCE_SEGMENTS',
    reason: 'NUMERIC_DSSI_THRESHOLD_NOT_MET',
    routeId: route.routeId,
    packageId: manifest.packageId,
    candidateCountryCount: manifest.candidateCountryCount,
    expectedIncludedDssiCountryCountFromWorldBankProgramPage: manifest.expectedIncludedDssiCountryCountFromWorldBankProgramPage,
    segmentCount,
    extractedRowCount: rows.length,
    extractedCountryCodes,
    pendingCountryCount: pendingCountryCodes.length,
    pendingCountryCodes,
    invalidRows,
    minimumRowsRequiredForNumericRun: manifest.completionLaw.numericStudyRunMinimumValidRows,
    sourcePackageFingerprint: canonicalDigest({ manifest, rows, invalidRows }),
    boundaries: { allCountrySetup: true, segmentedExtractionAllowed: true, numericDssiResultClaimed: false, finalValidationClaimed: false, solvencyOrDefaultPredictionClaimed: false, terminalIMI7Assigned: false, noImputation: true }
  });
}

function summary(studyRun, manifest, rows, segmentCount) {
  return deepFreeze({
    schemaVersion: 'IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_SUMMARY_v1',
    result: 'PASS_CLOSED_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_REPOSITORY_INTAKE_RUN',
    sourceIdentity: { schemaVersion: 'DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_SOURCE_IDENTITY_v1', retrievedAt: clock().toISOString(), source: manifest.source, candidateCountryCount: manifest.candidateCountryCount, segmentCount, transformedRowsFingerprint: canonicalDigest(rows) },
    candidateCountryCount: manifest.candidateCountryCount,
    transformedCountryRows: rows.length,
    validCases: studyRun.receipt.summary.validCases,
    unevaluableCases: studyRun.receipt.summary.unevaluableCases,
    hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
    meanIMI: studyRun.receipt.summary.imiSummary?.mean ?? null,
    medianIMI: studyRun.receipt.summary.imiSummary?.median ?? null,
    minIMI: studyRun.receipt.summary.imiSummary?.min ?? null,
    maxIMI: studyRun.receipt.summary.imiSummary?.max ?? null,
    meanAdditive: studyRun.receipt.summary.additiveMeanSummary?.mean ?? null,
    weakestFactorCounts: studyRun.receipt.summary.weakestFactorCounts,
    boundaries: { confirmatoryStyleExpansion: true, finalValidationClaimed: false, solvencyOrDefaultPredictionClaimed: false, terminalIMI7Assigned: false, webExtractedSourcePackage: true, scheduleDispersionOnly: true }
  });
}

await mkdir(outputDir, { recursive: true });
const manifest = await readJson(manifestPath);
validateManifest(manifest);
const { segmentCount, rows, invalidRows } = await loadRows(manifest);

if (rows.length < manifest.completionLaw.numericStudyRunMinimumValidRows) {
  const held = heldReceipt({ manifest, segmentCount, rows, invalidRows });
  await writeFile(path.join(outputDir, 'dssi-segmented-source-intake-held-receipt.v1.json'), JSON.stringify(held, null, 2));
  await writeFile(path.join(outputDir, 'dssi-source-package-manifest.v1.json'), JSON.stringify(manifest, null, 2));
  await writeFile(path.join(outputDir, 'dssi-extracted-source-rows.v1.json'), JSON.stringify(rows, null, 2));
  console.log(JSON.stringify(held, null, 2));
  process.exit(0);
}

if (invalidRows.length) throw new Error(`DSSI_INVALID_SOURCE_ROWS:${JSON.stringify(invalidRows)}`);
const studyRun = runStudy({
  studyMeta: { studyId: 'IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_v1', studyVersion: '1.0.0-preofficial-segmented-source-package', validationClass: 'CONFIRMATORY_STYLE_EXPANSION_NOT_FINAL_VALIDATION', backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD', notes: ['World Bank DSSI monthly 2025 Total rows supplied by segmented web-extracted source package.', 'Schedule dispersion only; solvency/default risk is outside this route.'] },
  datasetMeta: { datasetId: 'WORLD_BANK_DSSI_MONTHLY_DEBT_SERVICE_2025_SEGMENTED_WEB_EXTRACTED_SOURCE_PACKAGE', datasetVersion: clock().toISOString(), datasetFingerprint: canonicalDigest(rows) },
  routeSpec: route,
  rows,
  clock
});
let portfolio = createPortfolio({ portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_WITH_DSSI_EXPANSION_2026_v1', owner: 'DGB', createdAt: clock().toISOString() });
portfolio = addStudyToPortfolio(portfolio, studyRun);
const dssiSummary = summary(studyRun, manifest, rows, segmentCount);
const files = { 'dssi-transformed-country-rows.v1.json': rows, 'imi-study-run-output.v1.json': studyRun, 'imi-study-receipt.v1.json': studyRun.receipt, 'imi-case-results.v1.json': studyRun.caseResults, 'imi-portfolio-registry.v1.json': portfolio, 'imi-portfolio-summary.v1.json': portfolioSummary(portfolio), 'dssi-expansion-summary.v1.json': dssiSummary };
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), JSON.stringify(value, null, 2));
console.log(JSON.stringify(dssiSummary, null, 2));
