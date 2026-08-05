import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const dssiDir = argValue('--dssi-dir', '/tmp/imi-dssi-sovereign-debt-service-expansion-2026');
const summaryPath = path.join(dssiDir, 'dssi-expansion-summary.v1.json');
const summary = JSON.parse(await readFile(summaryPath, 'utf8'));

const candidateCountryCount = Number(summary.candidateCountryCount);
const transformedCountryRows = Number(summary.transformedCountryRows);
if (!Number.isInteger(candidateCountryCount) || candidateCountryCount <= 0) {
  throw new Error(`DSSI_CANDIDATE_COUNTRY_COUNT_INVALID:${summary.candidateCountryCount}`);
}
if (!Number.isInteger(transformedCountryRows) || transformedCountryRows < 0) {
  throw new Error(`DSSI_TRANSFORMED_COUNTRY_ROWS_INVALID:${summary.transformedCountryRows}`);
}
if (transformedCountryRows > candidateCountryCount) {
  throw new Error(`DSSI_TRANSFORMED_ROWS_EXCEED_CANDIDATES:${transformedCountryRows}:${candidateCountryCount}`);
}

const allCountryExtractionComplete = transformedCountryRows >= candidateCountryCount;
const normalized = {
  ...summary,
  boundaries: {
    ...(summary.boundaries || {}),
    allCountryExtractionComplete
  },
  synthesisBoundaryAdapter: {
    schemaVersion: 'IMI_DSSI_SYNTHESIS_BOUNDARY_ADAPTER_v1',
    derivation: 'allCountryExtractionComplete = transformedCountryRows >= candidateCountryCount',
    candidateCountryCount,
    transformedCountryRows,
    result: allCountryExtractionComplete ? 'COMPLETE' : 'OPEN'
  }
};

await writeFile(summaryPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
await import('./imi.multi-domain-portfolio-synthesis.runner.mjs');
