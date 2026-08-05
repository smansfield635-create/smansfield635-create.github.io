import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function finite(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

const dssiDir = argValue('--dssi-dir', '/tmp/imi-dssi-sovereign-debt-service-expansion-2026');
const dssiSummaryPath = path.join(dssiDir, 'dssi-expansion-summary.v1.json');
const dssi = JSON.parse(await readFile(dssiSummaryPath, 'utf8'));

const candidateCountryCount = Number(dssi.candidateCountryCount);
const transformedCountryRows = Number(dssi.transformedCountryRows);
if (!Number.isInteger(candidateCountryCount) || candidateCountryCount <= 0) {
  throw new Error(`DSSI_CANDIDATE_COUNTRY_COUNT_INVALID:${dssi.candidateCountryCount}`);
}
if (!Number.isInteger(transformedCountryRows) || transformedCountryRows < 0) {
  throw new Error(`DSSI_TRANSFORMED_COUNTRY_ROWS_INVALID:${dssi.transformedCountryRows}`);
}
if (transformedCountryRows > candidateCountryCount) {
  throw new Error(`DSSI_TRANSFORMED_ROWS_EXCEED_CANDIDATES:${transformedCountryRows}:${candidateCountryCount}`);
}

const allCountryExtractionComplete = transformedCountryRows >= candidateCountryCount;
const normalizedDssi = {
  ...dssi,
  boundaries: {
    ...(dssi.boundaries || {}),
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
await writeFile(dssiSummaryPath, `${JSON.stringify(normalizedDssi, null, 2)}\n`, 'utf8');

const speechDir = argValue('--speech-dir', '/tmp/imi-spontaneous-speech-rerun-2026');
const speechSummaryPath = path.join(speechDir, 'spontaneous-speech-rerun-summary.v1.json');
const speech = JSON.parse(await readFile(speechSummaryPath, 'utf8'));
const deltas = speech.legacyReproductionAbsoluteDeltas || speech.legacyReproductionComparison?.absoluteDeltas;
if (!deltas || !['meanIMI', 'medianIMI', 'varianceIMI', 'minIMI', 'maxIMI'].every((key) => finite(deltas[key]))) {
  throw new Error('SPEECH_REPRODUCTION_DELTAS_MISSING_OR_INVALID');
}
const withinFrozenTolerance =
  deltas.meanIMI <= 5e-6 &&
  deltas.medianIMI <= 5e-6 &&
  deltas.varianceIMI <= 5e-6 &&
  deltas.minIMI <= 1e-10 &&
  deltas.maxIMI <= 5e-6;
if (!withinFrozenTolerance) {
  throw new Error(`SPEECH_REPRODUCTION_DELTAS_EXCEED_FROZEN_TOLERANCE:${JSON.stringify(deltas)}`);
}
const normalizedSpeech = {
  ...speech,
  legacyReproductionAbsoluteDeltas: deltas,
  determinations: {
    ...(speech.determinations || {}),
    legacyNumericResultsReproducedWithinFrozenTolerance: true
  },
  synthesisBoundaryAdapter: {
    schemaVersion: 'IMI_SPEECH_REPRODUCTION_SYNTHESIS_ADAPTER_v1',
    derivation: 'Boolean reproduction result derived from frozen per-statistic tolerances already enforced by the speech runner.',
    tolerances: {
      meanIMI: 5e-6,
      medianIMI: 5e-6,
      varianceIMI: 5e-6,
      minIMI: 1e-10,
      maxIMI: 5e-6
    },
    absoluteDeltas: deltas,
    result: 'PASS_WITHIN_FROZEN_TOLERANCE'
  }
};
await writeFile(speechSummaryPath, `${JSON.stringify(normalizedSpeech, null, 2)}\n`, 'utf8');

await import('./imi.multi-domain-portfolio-synthesis.runner.mjs');
