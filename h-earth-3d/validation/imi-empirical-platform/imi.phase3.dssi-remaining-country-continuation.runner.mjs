import { createRequire } from 'node:module';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { runStudy } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/dssi-sovereign-debt-service-expansion-2026-route.v1.json');
const manifest = require('../../tools/imi-empirical-platform/generalizability/imi-phase3-parallel-external-tests-manifest.v1.json');
const sourceManifest = require('../../tools/imi-empirical-platform/studies/source-packages/dssi-2025/dssi-source-package-manifest.v1.json');
const track = manifest.tracks.find((entry) => entry.track === 'DSSI_REMAINING_COUNTRY_CONTINUATION');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
const outputDir = argValue('--output-dir', '/tmp/imi-phase3-dssi-remaining-country-continuation');
const clock = () => new Date(argValue('--clock', '2026-08-05T17:45:00.000Z'));
const segmentsDir = path.resolve('h-earth-3d/tools/imi-empirical-platform/studies/source-packages/dssi-2025/segments');

function decodeHtml(text) {
  return String(text)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}
function stripTags(text) {
  return decodeHtml(String(text).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
function parseNumber(value) {
  const cleaned = String(value ?? '').replace(/,/g, '').replace(/\s+/g, '').trim();
  if (!cleaned || cleaned === '-' || cleaned === '—') return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}
function normalizedEntropy(values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!(total > 0)) return null;
  let entropy = 0;
  for (const value of values) {
    if (value <= 0) continue;
    const p = value / total;
    entropy -= p * Math.log(p);
  }
  return entropy / Math.log(values.length);
}
function peak(values) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const total = values.reduce((sum, value) => sum + value, 0);
  const maximum = Math.max(...values);
  const names = values.map((value, index) => value === maximum ? months[index] : null).filter(Boolean);
  return { month: names.join('/'), share: total > 0 ? maximum / total : null };
}
function extractCells(rowHtml) {
  return [...rowHtml.matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map((match) => stripTags(match[1]));
}
function find2025TotalCells(html) {
  const tables = [...html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)].map((match) => match[1]);
  const candidates = [];
  for (const table of tables) {
    const tableText = stripTags(table);
    if (!/\b2025\b/.test(tableText)) continue;
    const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => extractCells(match[1]));
    let activeYear = /\b2025\b/.test(tableText) && !/\b2026\b/.test(tableText) ? 2025 : null;
    for (const cells of rows) {
      if (cells.some((cell) => cell.trim() === '2025')) activeYear = 2025;
      if (cells.some((cell) => cell.trim() === '2026')) activeYear = 2026;
      if (activeYear !== 2025) continue;
      if ((cells[0] || '').trim().toLowerCase() !== 'total') continue;
      const numeric = cells.slice(1).map(parseNumber);
      if (numeric.length >= 36 && numeric.slice(0, 36).every((value) => value !== null)) candidates.push(numeric.slice(0, 36));
    }
  }
  if (candidates.length) return candidates[candidates.length - 1];

  const text = stripTags(html);
  const sectionStart = text.search(/\b2025\b/);
  const sectionEndRaw = text.slice(sectionStart + 4).search(/\b2026\b/);
  const sectionEnd = sectionEndRaw >= 0 ? sectionStart + 4 + sectionEndRaw : text.length;
  const section = sectionStart >= 0 ? text.slice(sectionStart, sectionEnd) : text;
  const totalMatches = [...section.matchAll(/(?:^|\s)Total\s+((?:[\d,.-]+\s+){35}[\d,.-]+)/g)];
  if (!totalMatches.length) return null;
  const values = totalMatches[totalMatches.length - 1][1].trim().split(/\s+/).map(parseNumber);
  return values.length >= 36 && values.slice(0, 36).every((value) => value !== null) ? values.slice(0, 36) : null;
}
function parseCountryPage(code, html, url) {
  const values = find2025TotalCells(html);
  if (!values) return { ok: false, code, url, errorClass: 'COMPLETE_2025_TOTAL_ROW_NOT_PARSED', pageDigest: canonicalDigest(html) };
  const interest = [], principal = [], totalDebtService = [];
  for (let month = 0; month < 12; month += 1) {
    interest.push(values[month * 3]);
    principal.push(values[month * 3 + 1]);
    totalDebtService.push(values[month * 3 + 2]);
  }
  const annualInterest = interest.reduce((sum, value) => sum + value, 0);
  const annualPrincipal = principal.reduce((sum, value) => sum + value, 0);
  const annualTotal = totalDebtService.reduce((sum, value) => sum + value, 0);
  const aInterest = normalizedEntropy(interest);
  const aPrincipal = normalizedEntropy(principal);
  if (aInterest === null || aPrincipal === null) return { ok: false, code, url, errorClass: 'ZERO_OR_UNAVAILABLE_REQUIRED_PAYMENT_SERIES', pageDigest: canonicalDigest(html) };
  const text = stripTags(html);
  const countryName = text.match(/Country\s*:\s*([^:]+?)(?:Last Updated Date|Data Source|$)/i)?.[1]?.trim() || code;
  const lastUpdated = text.match(/Last Updated Date\s*:\s*([^:]+?)(?:Data Source|$)/i)?.[1]?.trim() || null;
  const interestPeak = peak(interest), principalPeak = peak(principal), totalPeak = peak(totalDebtService);
  return {
    ok: true,
    row: {
      status: 'VALID_SOURCE_ROW',
      country_code: code,
      country_name: countryName,
      data_year: 2025,
      annual_interest: annualInterest,
      annual_principal: annualPrincipal,
      annual_total_debt_service: annualTotal,
      principal_share: annualInterest + annualPrincipal > 0 ? annualPrincipal / (annualInterest + annualPrincipal) : null,
      interest_peak_month: interestPeak.month,
      interest_peak_share: interestPeak.share,
      principal_peak_month: principalPeak.month,
      principal_peak_share: principalPeak.share,
      total_peak_month: totalPeak.month,
      total_peak_share: totalPeak.share,
      a_interest_dispersion: aInterest,
      a_principal_dispersion: aPrincipal,
      dssi_page: url,
      source_table: 'Debt Service Payments Due',
      source_units: 'US$ thousands',
      source_last_updated: lastUpdated,
      source_data_source: 'World Bank Debtor Reporting System',
      extraction_evidence: 'Runtime HTML extraction of the complete 2025 Total row under the frozen Phase 3 continuation runner.',
      source_total_row_2025: { interest, principal, total_debt_service: totalDebtService },
      source_page_digest: canonicalDigest(html)
    }
  };
}
async function loadExistingRows() {
  const names = (await readdir(segmentsDir)).filter((name) => name.endsWith('.json')).sort();
  const rows = [];
  for (const name of names) {
    const segment = JSON.parse(await readFile(path.join(segmentsDir, name), 'utf8'));
    rows.push(...(segment.rows || []));
  }
  return rows;
}
async function fetchCountry(code) {
  const url = track.sourcePattern.replace('{ISO3}', code);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(track.thresholds.perCountryTimeoutMilliseconds) });
    const html = await response.text();
    if (!response.ok) return { ok: false, code, url, httpStatus: response.status, errorClass: 'HTTP_SOURCE_UNAVAILABLE', pageDigest: canonicalDigest(html) };
    return { ...parseCountryPage(code, html, url), httpStatus: response.status };
  } catch (error) {
    return { ok: false, code, url, errorClass: 'FETCH_OR_TIMEOUT_FAILURE', error: String(error?.message || error) };
  }
}
async function mapConcurrent(values, limit, worker) {
  const output = new Array(values.length);
  let cursor = 0;
  async function run() {
    while (true) {
      const index = cursor++;
      if (index >= values.length) return;
      output[index] = await worker(values[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, run));
  return output;
}

await mkdir(outputDir, { recursive: true });
const existingRows = await loadExistingRows();
const existingCodes = new Set(existingRows.map((row) => row.country_code));
const remainingCodes = sourceManifest.candidateCountries.filter((code) => !existingCodes.has(code));
const attempts = await mapConcurrent(remainingCodes, track.thresholds.maximumConcurrentFetches, fetchCountry);
const newRows = attempts.filter((attempt) => attempt.ok).map((attempt) => attempt.row).sort((a, b) => a.country_code.localeCompare(b.country_code));
const failures = attempts.filter((attempt) => !attempt.ok).sort((a, b) => a.code.localeCompare(b.code));
const combinedRows = [...existingRows, ...newRows].sort((a, b) => a.country_code.localeCompare(b.country_code));
const duplicateCount = combinedRows.length - new Set(combinedRows.map((row) => row.country_code)).size;
if (duplicateCount) throw new Error(`DSSI_PHASE3_DUPLICATE_COUNTRY_ROWS:${duplicateCount}`);

const sourceIdentity = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_DSSI_REMAINING_COUNTRY_SOURCE_IDENTITY_v1',
  observedAt: clock().toISOString(),
  sourcePattern: track.sourcePattern,
  baselineExtractedCountryCount: existingRows.length,
  attemptedRemainingCountryCount: remainingCodes.length,
  newlyExtractedCountryCount: newRows.length,
  failedCountryCount: failures.length,
  combinedCountryCount: combinedRows.length,
  newRowsDigest: canonicalDigest(newRows),
  failureLedgerDigest: canonicalDigest(failures),
  attemptsDigest: canonicalDigest(attempts.map((attempt) => ({ code: attempt.code || attempt.row?.country_code, ok: attempt.ok, httpStatus: attempt.httpStatus || null, errorClass: attempt.errorClass || null, pageDigest: attempt.pageDigest || attempt.row?.source_page_digest || null })))
});

let studyRun = null;
let empiricalSummary = null;
let result;
let terminalDisposition;
let minimumEvidenceSatisfied = newRows.length >= 20;
if (newRows.length) {
  studyRun = runStudy({
    studyMeta: {
      studyId: 'IMI_PHASE_3_DSSI_REMAINING_COUNTRY_CONTINUATION_2025_v1',
      studyVersion: '1.0.0-frozen-phase3',
      validationClass: 'EXTERNAL_COUNTRY_CONTINUATION_NOT_OUTCOME_VALIDATION',
      backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD',
      notes: [
        'The frozen DSSI schedule-dispersion route is executed only on country schedules absent from the 32-country development package.',
        'No solvency, default, or credit-rating outcome is used or claimed.'
      ]
    },
    datasetMeta: {
      datasetId: 'WORLD_BANK_DSSI_2025_REMAINING_COUNTRY_RUNTIME_EXTRACTION',
      datasetVersion: clock().toISOString(),
      datasetFingerprint: sourceIdentity.newRowsDigest
    },
    routeSpec: route,
    rows: newRows,
    clock
  });
  const valid = studyRun.caseResults.filter((entry) => entry.status === 'VALID');
  const meanAbsoluteImiAdditiveDifference = valid.length
    ? valid.reduce((sum, entry) => sum + Math.abs(entry.imi - entry.additiveMean), 0) / valid.length
    : null;
  empiricalSummary = {
    evaluatedCases: newRows.length,
    validCases: studyRun.receipt.summary.validCases,
    unevaluableCases: studyRun.receipt.summary.unevaluableCases,
    hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
    weakestFactorCounts: studyRun.receipt.summary.weakestFactorCounts,
    imiSummary: studyRun.receipt.summary.imiSummary,
    additiveMeanSummary: studyRun.receipt.summary.additiveMeanSummary,
    meanAbsoluteImiAdditiveDifference,
    materialityThreshold: track.thresholds.noncompensatoryMeanAbsoluteDifference,
    h2NoncompensatoryDifferentiationSupported: meanAbsoluteImiAdditiveDifference >= track.thresholds.noncompensatoryMeanAbsoluteDifference
  };
}
if (minimumEvidenceSatisfied) {
  result = 'PASS_CLOSED_PHASE_3_DSSI_REMAINING_COUNTRY_CONTINUATION_MINIMUM_MET';
  terminalDisposition = 'PASS_CLOSED_TRACK_EXECUTION';
} else {
  result = 'HELD_DSSI_REMAINING_COUNTRY_MINIMUM_NOT_MET_WITH_FAILURE_LEDGER';
  terminalDisposition = 'HELD_OPEN_SOURCE_EXTRACTION_INCOMPLETE';
}

const summary = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_DSSI_REMAINING_COUNTRY_SUMMARY_v1',
  result,
  sourceIdentity,
  routeId: route.routeId,
  routeDigest: canonicalDigest(route),
  priorCountryCount: existingRows.length,
  newlyExtractedCountryCount: newRows.length,
  combinedCountryCount: combinedRows.length,
  candidateCountryCount: sourceManifest.candidateCountryCount,
  failedCountryCount: failures.length,
  minimumEvidenceSatisfied,
  empiricalSummary,
  phase4Candidate: false,
  boundaries: {
    newRowsOverlapDevelopmentPackage: false,
    routeRetuned: false,
    outcomeTestExecuted: false,
    solvencyPredictionClaimed: false,
    defaultPredictionClaimed: false,
    creditRatingClaimed: false,
    finalValidationClaimed: false,
    completeFailureLedgerPreserved: true
  }
});
const receiptBody = {
  schemaVersion: 'IMI_PHASE_3_DSSI_REMAINING_COUNTRY_RECEIPT_v1',
  operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
  track: track.track,
  result,
  terminalDisposition,
  sourceDigest: canonicalDigest(sourceIdentity),
  routeDigest: summary.routeDigest,
  executionDigest: studyRun ? canonicalDigest(studyRun) : null,
  summaryDigest: canonicalDigest(summary),
  minimumEvidenceSatisfied,
  phase4Candidate: false,
  boundaries: summary.boundaries
};
const receipt = deepFreeze({ ...receiptBody, receiptDigest: canonicalDigest(receiptBody) });

const files = {
  'dssi-phase3-source-identity.v1.json': sourceIdentity,
  'dssi-phase3-new-country-rows.v1.json': newRows,
  'dssi-phase3-failure-ledger.v1.json': failures,
  'dssi-phase3-combined-country-rows.v1.json': combinedRows,
  'dssi-phase3-study-run-output.v1.json': studyRun,
  'dssi-phase3-summary.v1.json': summary,
  'dssi-phase3-track-receipt.v1.json': receipt
};
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), `${JSON.stringify(value, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
