import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { addStudyToPortfolio, createPortfolio, portfolioSummary, runStudy } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/cms-hospital-refresh-2026-route.v1.json');
const DATASETS = Object.freeze({
  complications: { id: 'ynj2-r877', name: 'Complications and Deaths - Hospital', page: 'https://data.cms.gov/provider-data/dataset/ynj2-r877' },
  general: { id: 'xubh-q36u', name: 'Hospital General Information', page: 'https://data.cms.gov/provider-data/dataset/xubh-q36u' }
});
const argValue = (name, fallback = null) => { const i = process.argv.indexOf(name); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback; };
const outputDir = argValue('--output-dir', '/tmp/imi-cms-hospital-refresh-2026');
const clock = () => new Date(argValue('--clock', '2026-08-05T14:50:00.000Z'));

function parseCsv(text) {
  const rows = []; let row = []; let field = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i], next = text[i + 1];
    if (quoted) { if (ch === '"' && next === '"') { field += '"'; i += 1; } else if (ch === '"') quoted = false; else field += ch; }
    else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (ch !== '\r') field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const header = (rows.shift() || []).map((h) => h.trim());
  return rows.filter((r) => r.some((v) => String(v).trim() !== '')).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}
async function fetchDatasetCsv(dataset) {
  const metaUrl = `https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/${dataset.id}`;
  const metaResponse = await fetch(metaUrl);
  if (!metaResponse.ok) throw new Error(`CMS_METASTORE_HTTP_${dataset.id}_${metaResponse.status}`);
  const meta = await metaResponse.json();
  const downloadUrl = meta?.distribution?.find?.((d) => d.mediaType === 'text/csv')?.downloadURL || meta?.distribution?.[0]?.downloadURL;
  if (!downloadUrl) throw new Error(`CMS_DOWNLOAD_URL_MISSING_${dataset.id}`);
  const csvResponse = await fetch(downloadUrl);
  if (!csvResponse.ok) throw new Error(`CMS_CSV_HTTP_${dataset.id}_${csvResponse.status}`);
  const text = await csvResponse.text();
  const rows = parseCsv(text);
  return { rows, source: 'cms-provider-data-metastore-downloadURL', metaUrl, downloadUrl, metaReleased: meta.released || null, metaModified: meta.modified || null, title: meta.title || dataset.name };
}
const keyVariants = (row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), v]));
const first = (obj, keys, fallback = '') => keys.map((k) => obj[k]).find((v) => v !== undefined && v !== null && String(v).trim() !== '') ?? fallback;
const num = (value) => { const parsed = Number(String(value ?? '').trim().replace(/,/g, '')); return Number.isFinite(parsed) ? parsed : null; };
function comparableStatus(row) {
  const r = keyVariants(row);
  const text = [first(r, ['compared_to_national', 'comparison_to_national']), first(r, ['score']), first(r, ['footnote'])].join(' ').toLowerCase();
  if (/worse\s+than|worse_than|below\s+the\s+national|lower\s+than\s+the\s+national/.test(text)) return 'WORSE';
  if (/better\s+than|better_than|above\s+the\s+national|higher\s+than\s+the\s+national|no\s+different|same\s+as|not\s+different/.test(text)) return 'NONWORSE';
  return 'NOT_COMPARABLE';
}
function factorClass(row) {
  const r = keyVariants(row);
  const joined = `${first(r, ['measure_id', 'measureid'])} ${first(r, ['condition'])} ${first(r, ['measure_name', 'measurename'])}`.toUpperCase();
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
    const factor = factorClass(row);
    const status = comparableStatus(row);
    if (!factor || status === 'NOT_COMPARABLE') continue;
    if (!byFacility.has(id)) byFacility.set(id, { facility_id: id, facility_name: String(first(r, ['facility_name', 'hospital_name', 'name'])), state: String(first(r, ['state'])), mortality_worse: 0, mortality_reported: 0, safety_worse: 0, safety_reported: 0, overall_rating: ratingByFacility.get(id) ?? null });
    const out = byFacility.get(id);
    if (factor === 'MORT') { out.mortality_reported += 1; if (status === 'WORSE') out.mortality_worse += 1; }
    if (factor === 'SAFETY') { out.safety_reported += 1; if (status === 'WORSE') out.safety_worse += 1; }
  }
  return [...byFacility.values()].sort((a, b) => String(a.facility_id).localeCompare(String(b.facility_id)));
}
function summarize(studyRun, sourceIdentity, transformedRows) {
  const valid = studyRun.caseResults.filter((r) => r.status === 'VALID');
  const exact1 = valid.filter((r) => r.imi === 1).length;
  const prior = { validCases: 2973, hardCollapseCases: 3, medianIMI: 1.0, exactIMI1Percent: 77.262025 };
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
const complications = await fetchDatasetCsv(DATASETS.complications);
const general = await fetchDatasetCsv(DATASETS.general);
const transformedRows = aggregate(complications.rows, general.rows);
if (complications.rows.length < 1000) throw new Error(`COMPLICATION_SOURCE_TOO_SMALL:${complications.rows.length}`);
if (general.rows.length < 1000) throw new Error(`GENERAL_SOURCE_TOO_SMALL:${general.rows.length}`);
if (transformedRows.length < 1000) throw new Error(`TRANSFORMED_ROWS_TOO_SMALL:${transformedRows.length}`);
const sourceIdentity = deepFreeze({ schemaVersion: 'CMS_HOSPITAL_REFRESH_2026_SOURCE_IDENTITY_v1', retrievedAt: clock().toISOString(), datasets: { complications: { ...DATASETS.complications, ...complications, rows: undefined, rowCount: complications.rows.length, fingerprint: canonicalDigest(complications.rows) }, general: { ...DATASETS.general, ...general, rows: undefined, rowCount: general.rows.length, fingerprint: canonicalDigest(general.rows) } }, transformedRows: { rowCount: transformedRows.length, fingerprint: canonicalDigest(transformedRows) } });
const studyRun = runStudy({ studyMeta: { studyId: 'IMI_CONFIRMATORY_HOSPITAL_REFRESH_2026_v1', studyVersion: '1.0.0-preofficial-refresh', validationClass: 'CONFIRMATORY_STYLE_REFRESH_NOT_FINAL_VALIDATION', backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD', notes: ['Current CMS provider-data pull executed in repository workflow.', 'Route frozen before execution in cms-hospital-refresh-2026-route.v1.json.'] }, datasetMeta: { datasetId: 'CMS_PROVIDER_DATA_HOSPITAL_COMPLICATIONS_AND_GENERAL_INFORMATION_REFRESH_2026', datasetVersion: sourceIdentity.retrievedAt, datasetFingerprint: sourceIdentity.transformedRows.fingerprint }, routeSpec: route, rows: transformedRows, clock });
let portfolio = createPortfolio({ portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_WITH_CMS_REFRESH_2026_v1', owner: 'DGB', createdAt: clock().toISOString() });
portfolio = addStudyToPortfolio(portfolio, studyRun);
const refreshSummary = summarize(studyRun, sourceIdentity, transformedRows);
const files = { 'cms-hospital-refresh-source-identity.v1.json': sourceIdentity, 'cms-hospital-refresh-transformed-rows.v1.json': transformedRows, 'imi-study-run-output.v1.json': studyRun, 'imi-study-receipt.v1.json': studyRun.receipt, 'imi-case-results.v1.json': studyRun.caseResults, 'imi-portfolio-registry.v1.json': portfolio, 'imi-portfolio-summary.v1.json': portfolioSummary(portfolio), 'cms-hospital-refresh-summary.v1.json': refreshSummary };
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), JSON.stringify(value, null, 2));
console.log(JSON.stringify(refreshSummary, null, 2));
