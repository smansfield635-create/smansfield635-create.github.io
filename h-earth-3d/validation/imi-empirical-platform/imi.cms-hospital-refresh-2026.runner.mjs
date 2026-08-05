import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { addStudyToPortfolio, createPortfolio, portfolioSummary, runStudy } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/cms-hospital-refresh-2026-route.v1.json');

const DATASETS = Object.freeze({
  complications: {
    id: 'ynj2-r877',
    name: 'Complications and Deaths - Hospital',
    page: 'https://data.cms.gov/provider-data/dataset/ynj2-r877',
    api: 'https://data.cms.gov/provider-data/api/1/datastore/query/ynj2-r877',
    csvFallback: 'https://data.cms.gov/provider-data/sites/default/files/resources/6af7c44d77436e5a1caac3ce39a83fe9_1744668314/Complications_and_Deaths-Hospital.csv'
  },
  general: {
    id: 'xubh-q36u',
    name: 'Hospital General Information',
    page: 'https://data.cms.gov/provider-data/dataset/xubh-q36u',
    api: 'https://data.cms.gov/provider-data/api/1/datastore/query/xubh-q36u',
    csvFallback: 'https://data.cms.gov/provider-data/sites/default/files/resources/893c372430d9d71a1c52737d01239d47_1745467507/Hospital_General_Information.csv'
  }
});

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
const outputDir = argValue('--output-dir', '/tmp/imi-cms-hospital-refresh-2026');
const clock = () => new Date(argValue('--clock', '2026-08-05T14:50:00.000Z'));

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i += 1; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (ch !== '\r') field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift()?.map((h) => h.trim()) || [];
  return rows.filter((r) => r.some((v) => String(v).trim() !== '')).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function apiRowsFromJson(json) {
  if (Array.isArray(json)) return json;
  for (const key of ['results', 'records', 'data', 'items']) if (Array.isArray(json?.[key])) return json[key];
  for (const outer of ['result', 'response']) for (const key of ['results', 'records', 'data', 'items']) if (Array.isArray(json?.[outer]?.[key])) return json[outer][key];
  return [];
}
function apiTotalFromJson(json) {
  for (const key of ['count', 'total', 'total_count']) if (Number.isFinite(Number(json?.[key]))) return Number(json[key]);
  for (const outer of ['result', 'response']) for (const key of ['count', 'total', 'total_count']) if (Number.isFinite(Number(json?.[outer]?.[key]))) return Number(json[outer][key]);
  return null;
}

async function fetchRows(dataset) {
  const apiRows = [];
  try {
    let offset = 0;
    for (let page = 0; page < 500; page += 1) {
      const response = await fetch(`${dataset.api}/${offset}`);
      if (!response.ok) throw new Error(`API_HTTP_${response.status}`);
      const json = await response.json();
      const rows = apiRowsFromJson(json);
      if (!rows.length) break;
      apiRows.push(...rows);
      const total = apiTotalFromJson(json);
      offset += rows.length;
      if ((total !== null && offset >= total) || rows.length < 1000) break;
    }
    if (apiRows.length) return { rows: apiRows, source: 'provider-data-api', url: dataset.api };
  } catch (error) {
    console.error(`PDC_API_FALLBACK:${dataset.id}:${String(error?.message || error)}`);
  }
  const csvResponse = await fetch(dataset.csvFallback);
  if (!csvResponse.ok) throw new Error(`CSV_FALLBACK_HTTP_${dataset.id}_${csvResponse.status}`);
  return { rows: parseCsv(await csvResponse.text()), source: 'csv-fallback', url: dataset.csvFallback };
}

const keyVariants = (row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), v]));
const first = (obj, keys, fallback = '') => keys.map((k) => obj[k]).find((v) => v !== undefined && v !== null && String(v).trim() !== '') ?? fallback;
const num = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).trim().replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};
function comparableStatus(row) {
  const r = keyVariants(row);
  const text = [
    first(r, ['compared_to_national', 'comparison_to_national', 'compared_to_national_value']),
    first(r, ['score']),
    first(r, ['footnote'])
  ].join(' ').toLowerCase();
  if (/worse\s+than|worse_than|below\s+the\s+national|lower\s+than\s+the\s+national/.test(text)) return 'WORSE';
  if (/better\s+than|better_than|above\s+the\s+national|higher\s+than\s+the\s+national|no\s+different|same\s+as|not\s+different/.test(text)) return 'NONWORSE';
  return 'NOT_COMPARABLE';
}
function factorClass(row) {
  const r = keyVariants(row);
  const measureId = String(first(r, ['measure_id', 'measureid'])).toUpperCase();
  const condition = String(first(r, ['condition'])).toUpperCase();
  const measureName = String(first(r, ['measure_name', 'measurename'])).toUpperCase();
  const joined = `${measureId} ${condition} ${measureName}`;
  if (/\bMORT|MORTALITY|DEATH|HYBRID_HWM/.test(joined)) return 'MORT';
  if (/\bPSI|SAFETY|COMPLICATION|COMP_HIP_KNEE|HIP\/KNEE/.test(joined)) return 'SAFETY';
  return null;
}

function aggregate(complicationRows, generalRows) {
  const ratingByFacility = new Map();
  for (const row of generalRows) {
    const r = keyVariants(row);
    const id = String(first(r, ['facility_id', 'provider_id', 'cms_certification_number_ccn', 'ccn'])).trim();
    const rating = num(first(r, ['hospital_overall_rating', 'overall_rating', 'rating']));
    if (id) ratingByFacility.set(id, rating);
  }
  const byFacility = new Map();
  for (const row of complicationRows) {
    const r = keyVariants(row);
    const id = String(first(r, ['facility_id', 'provider_id', 'ccn'])).trim();
    if (!id) continue;
    const name = String(first(r, ['facility_name', 'hospital_name', 'name']));
    const state = String(first(r, ['state']));
    const factor = factorClass(row);
    const status = comparableStatus(row);
    if (!factor || status === 'NOT_COMPARABLE') continue;
    if (!byFacility.has(id)) byFacility.set(id, { facility_id: id, facility_name: name, state, mortality_worse: 0, mortality_reported: 0, safety_worse: 0, safety_reported: 0, overall_rating: ratingByFacility.get(id) ?? null });
    const out = byFacility.get(id);
    if (factor === 'MORT') { out.mortality_reported += 1; if (status === 'WORSE') out.mortality_worse += 1; }
    if (factor === 'SAFETY') { out.safety_reported += 1; if (status === 'WORSE') out.safety_worse += 1; }
  }
  return [...byFacility.values()].sort((a, b) => String(a.facility_id).localeCompare(String(b.facility_id)));
}

function summarizeRefresh(studyRun, sourceIdentity, transformedRows) {
  const valid = studyRun.caseResults.filter((r) => r.status === 'VALID');
  const prior = { validCases: 2973, hardCollapseCases: 3, medianIMI: 1.0, exactIMI1Percent: 77.262025 };
  const exact1 = valid.filter((r) => r.imi === 1).length;
  return deepFreeze({
    schemaVersion: 'IMI_CMS_HOSPITAL_REFRESH_2026_SUMMARY_v1',
    result: 'PASS_CLOSED_CMS_HOSPITAL_REFRESH_2026_REPOSITORY_INTAKE_RUN',
    sourceIdentity,
    transformedHospitalRows: transformedRows.length,
    validCases: studyRun.receipt.summary.validCases,
    unevaluableCases: studyRun.receipt.summary.unevaluableCases,
    hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
    medianIMI: studyRun.receipt.summary.imiSummary?.median ?? null,
    exactIMI1Cases: exact1,
    exactIMI1PercentOfValid: valid.length ? exact1 / valid.length : null,
    outcomeComparators: studyRun.receipt.summary.outcomeComparators,
    priorReference: prior,
    comparisonToPrior: {
      validCasesDelta: studyRun.receipt.summary.validCases - prior.validCases,
      hardCollapseCasesDelta: studyRun.receipt.summary.hardCollapseCases - prior.hardCollapseCases,
      medianIMIDelta: (studyRun.receipt.summary.imiSummary?.median ?? null) === null ? null : studyRun.receipt.summary.imiSummary.median - prior.medianIMI,
      exactIMI1PercentDelta: valid.length ? (exact1 / valid.length * 100) - prior.exactIMI1Percent : null
    },
    boundaries: { confirmatoryStyleRefresh: true, finalValidationClaimed: false, terminalIMI7Assigned: false, rawDownloadedAtRuntime: true }
  });
}

await mkdir(outputDir, { recursive: true });
const complications = await fetchRows(DATASETS.complications);
const general = await fetchRows(DATASETS.general);
const transformedRows = aggregate(complications.rows, general.rows);
if (complications.rows.length < 1000) throw new Error(`COMPLICATION_SOURCE_TOO_SMALL:${complications.rows.length}`);
if (general.rows.length < 1000) throw new Error(`GENERAL_SOURCE_TOO_SMALL:${general.rows.length}`);
if (transformedRows.length < 1000) throw new Error(`TRANSFORMED_ROWS_TOO_SMALL:${transformedRows.length}`);

const sourceIdentity = deepFreeze({
  schemaVersion: 'CMS_HOSPITAL_REFRESH_2026_SOURCE_IDENTITY_v1',
  retrievedAt: clock().toISOString(),
  datasets: { complications: { ...DATASETS.complications, retrieval: complications.source, rowCount: complications.rows.length, fingerprint: canonicalDigest(complications.rows) }, general: { ...DATASETS.general, retrieval: general.source, rowCount: general.rows.length, fingerprint: canonicalDigest(general.rows) } },
  transformedRows: { rowCount: transformedRows.length, fingerprint: canonicalDigest(transformedRows) }
});

const studyRun = runStudy({
  studyMeta: { studyId: 'IMI_CONFIRMATORY_HOSPITAL_REFRESH_2026_v1', studyVersion: '1.0.0-preofficial-refresh', validationClass: 'CONFIRMATORY_STYLE_REFRESH_NOT_FINAL_VALIDATION', backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD', notes: ['Current CMS provider-data pull executed in repository workflow.', 'Route frozen before execution in cms-hospital-refresh-2026-route.v1.json.'] },
  datasetMeta: { datasetId: 'CMS_PROVIDER_DATA_HOSPITAL_COMPLICATIONS_AND_GENERAL_INFORMATION_REFRESH_2026', datasetVersion: sourceIdentity.retrievedAt, datasetFingerprint: sourceIdentity.transformedRows.fingerprint },
  routeSpec: route,
  rows: transformedRows,
  clock
});
let portfolio = createPortfolio({ portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_WITH_CMS_REFRESH_2026_v1', owner: 'DGB', createdAt: clock().toISOString() });
portfolio = addStudyToPortfolio(portfolio, studyRun);
const refreshSummary = summarizeRefresh(studyRun, sourceIdentity, transformedRows);
const portfolioSummaryOut = portfolioSummary(portfolio);

const files = {
  'cms-hospital-refresh-source-identity.v1.json': sourceIdentity,
  'cms-hospital-refresh-transformed-rows.v1.json': transformedRows,
  'imi-study-run-output.v1.json': studyRun,
  'imi-study-receipt.v1.json': studyRun.receipt,
  'imi-case-results.v1.json': studyRun.caseResults,
  'imi-portfolio-registry.v1.json': portfolio,
  'imi-portfolio-summary.v1.json': portfolioSummaryOut,
  'cms-hospital-refresh-summary.v1.json': refreshSummary
};
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), JSON.stringify(value, null, 2));
console.log(JSON.stringify(refreshSummary, null, 2));
