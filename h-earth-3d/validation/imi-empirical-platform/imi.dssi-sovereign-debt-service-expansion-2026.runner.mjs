import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { addStudyToPortfolio, createPortfolio, portfolioSummary, runStudy } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/dssi-sovereign-debt-service-expansion-2026-route.v1.json');
const outputDir = process.argv.includes('--output-dir') ? process.argv[process.argv.indexOf('--output-dir') + 1] : '/tmp/imi-dssi-sovereign-debt-service-expansion-2026';
const clock = () => new Date('2026-08-05T15:08:00.000Z');
const CODES = Object.freeze(['AFG','AGO','BGD','BEN','BTN','BFA','BDI','CPV','KHM','CMR','CAF','TCD','COM','COG','CIV','DJI','DMA','ETH','FJI','GMB','GHA','GRD','GIN','GNB','GUY','HTI','HND','KEN','KIR','KGZ','LAO','LSO','LBR','MDG','MWI','MDV','MLI','MRT','FSM','MDA','MNG','MOZ','MMR','NPL','NIC','NER','NGA','PAK','PNG','RWA','WSM','STP','SEN','SLE','SLB','SOM','SSD','LCA','VCT','SDN','TJK','TZA','TLS','TGO','TON','UGA','UZB','VUT','YEM','ZMB']);
const MONTHS = Object.freeze(['January','February','March','April','May','June','July','August','September','October','November','December']);

const cleanText = (html) => String(html).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const numberToken = (token) => token === '-' || token === '—' || token === '–' ? 0 : Number(String(token).replace(/,/g, ''));
const sum = (values) => values.reduce((acc, value) => acc + value, 0);
function entropy(values) { const total = sum(values); if (!(total > 0)) return null; let h = 0; for (const value of values) if (value > 0) { const p = value / total; h -= p * Math.log(p); } return h / Math.log(12); }
function peak(values) { let i = 0; for (let j = 1; j < values.length; j += 1) if (values[j] > values[i]) i = j; const total = sum(values); return { month: MONTHS[i], value: values[i], share: total > 0 ? values[i] / total : null }; }
function totalRow(text) {
  const token = '(?:-?\\d[\\d,]*(?:\\.\\d+)?|-|—|–)';
  const pattern = new RegExp(`(?:^|\\s)Total\\s+((?:${token}\\s+){35,}${token})`, 'gi');
  let selected = null;
  for (const match of text.matchAll(pattern)) {
    const values = match[1].trim().split(/\s+/).map(numberToken).filter(Number.isFinite);
    if (values.length >= 36) selected = values.slice(0, 36);
  }
  return selected;
}
function sourceRow(code, html, url) {
  const text = cleanText(html);
  const values = totalRow(text);
  if (!values) return { status: 'UNEVALUABLE', code, reason: 'TOTAL_ROW_NOT_FOUND_OR_INCOMPLETE', url, sourceTextFingerprint: canonicalDigest(text) };
  const interest = [], principal = [], total = [];
  for (let m = 0; m < 12; m += 1) { interest.push(values[m * 3]); principal.push(values[m * 3 + 1]); total.push(values[m * 3 + 2]); }
  const aInterest = entropy(interest), aPrincipal = entropy(principal);
  if (aInterest === null || aPrincipal === null) return { status: 'UNEVALUABLE', code, reason: 'ZERO_OR_INVALID_INTEREST_OR_PRINCIPAL_TOTAL', url, annual_interest: sum(interest), annual_principal: sum(principal), annual_total_debt_service: sum(total), sourceTextFingerprint: canonicalDigest(text) };
  const ip = peak(interest), pp = peak(principal), tp = peak(total);
  return { status: 'VALID_SOURCE_ROW', country_code: code, country_name: code, data_year: 2025, annual_interest: sum(interest), annual_principal: sum(principal), annual_total_debt_service: sum(total), principal_share: sum(total) > 0 ? sum(principal) / sum(total) : null, interest_peak_month: ip.month, interest_peak_share: ip.share, principal_peak_month: pp.month, principal_peak_share: pp.share, total_peak_month: tp.month, total_peak_share: tp.share, a_interest_dispersion: aInterest, a_principal_dispersion: aPrincipal, dssi_page: url, source_text_fingerprint: canonicalDigest(text) };
}
async function fetchCode(code) {
  const url = `https://datatopics.worldbank.org/dssitables/monthly/${code}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { 'user-agent': 'IMI empirical platform DSSI expansion runner' } });
    clearTimeout(timeout);
    if (!response.ok) return { status: 'FETCH_FAILED', code, url, reason: `HTTP_${response.status}` };
    return sourceRow(code, await response.text(), url);
  } catch (error) {
    clearTimeout(timeout);
    return { status: 'FETCH_FAILED', code, url, reason: String(error?.name || error?.message || error) };
  }
}
function rankCorrelation(xs, ys) {
  const pairs = xs.map((x, i) => ({ x, y: ys[i] })).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  if (pairs.length < 2) return null;
  const rank = (vals) => { const sorted = vals.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value); const ranks = Array(vals.length); let i = 0; while (i < sorted.length) { let j = i + 1; while (j < sorted.length && sorted[j].value === sorted[i].value) j += 1; const avg = (i + 1 + j) / 2; for (let k = i; k < j; k += 1) ranks[sorted[k].index] = avg; i = j; } return ranks; };
  const rx = rank(pairs.map((p) => p.x)), ry = rank(pairs.map((p) => p.y));
  const mean = (arr) => sum(arr) / arr.length; const mx = mean(rx), my = mean(ry); let n = 0, dx = 0, dy = 0;
  for (let i = 0; i < rx.length; i += 1) { const x = rx[i] - mx, y = ry[i] - my; n += x * y; dx += x * x; dy += y * y; }
  return dx && dy ? n / Math.sqrt(dx * dy) : null;
}
function summary(studyRun, sourceIdentity, rows, rejected) {
  const valid = studyRun.caseResults.filter((r) => r.status === 'VALID');
  const additive = valid.map((r) => r.additiveMean), imi = valid.map((r) => r.imi), divergence = valid.map((r) => r.additiveMean - r.imi);
  const maxDivergence = divergence.length ? Math.max(...divergence) : null;
  const prior = { numericCases: 14, meanIMI: 0.8016, medianIMI: 0.8266, minIMI: 0.5851, maxIMI: 0.9448, maxDivergence: 0.1910, hardCollapseCases: 0 };
  return deepFreeze({ schemaVersion: 'IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_SUMMARY_v1', result: 'PASS_CLOSED_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_REPOSITORY_INTAKE_RUN', sourceIdentity, candidateCountryCount: CODES.length, transformedCountryRows: rows.length, rejectedCountryRows: rejected.length, validCases: studyRun.receipt.summary.validCases, unevaluableCases: studyRun.receipt.summary.unevaluableCases, hardCollapseCases: studyRun.receipt.summary.hardCollapseCases, meanIMI: studyRun.receipt.summary.imiSummary?.mean ?? null, medianIMI: studyRun.receipt.summary.imiSummary?.median ?? null, minIMI: studyRun.receipt.summary.imiSummary?.min ?? null, maxIMI: studyRun.receipt.summary.imiSummary?.max ?? null, meanAdditive: studyRun.receipt.summary.additiveMeanSummary?.mean ?? null, additiveIMIRankSpearman: rankCorrelation(additive, imi), maxAdditiveMinusIMIDivergence: maxDivergence, weakestFactorCounts: studyRun.receipt.summary.weakestFactorCounts, priorReference: prior, comparisonToPrior: { numericCasesDelta: studyRun.receipt.summary.validCases - prior.numericCases, meanIMIDelta: (studyRun.receipt.summary.imiSummary?.mean ?? 0) - prior.meanIMI, medianIMIDelta: (studyRun.receipt.summary.imiSummary?.median ?? 0) - prior.medianIMI, hardCollapseCasesDelta: studyRun.receipt.summary.hardCollapseCases - prior.hardCollapseCases, maxDivergenceDelta: maxDivergence === null ? null : maxDivergence - prior.maxDivergence }, boundaries: { confirmatoryStyleExpansion: true, finalValidationClaimed: false, solvencyOrDefaultPredictionClaimed: false, terminalIMI7Assigned: false, rawDownloadedAtRuntime: true, scheduleDispersionOnly: true } });
}

await mkdir(outputDir, { recursive: true });
const fetched = await Promise.all(CODES.map(fetchCode));
const rows = fetched.filter((r) => r.status === 'VALID_SOURCE_ROW');
const rejected = fetched.filter((r) => r.status !== 'VALID_SOURCE_ROW');
if (rows.length < 14) throw new Error(`DSSI_RETRIEVABLE_COHORT_TOO_SMALL:${rows.length}`);
const sourceIdentity = deepFreeze({ schemaVersion: 'DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_SOURCE_IDENTITY_v1', retrievedAt: clock().toISOString(), source: { program: 'Debt Service Suspension Initiative', agency: 'World Bank', programPage: 'https://www.worldbank.org/en/programs/debt-statistics/dssi', monthlyTablePattern: 'https://datatopics.worldbank.org/dssitables/monthly/{ISO3}', dataSourceDeclaredByMonthlyPages: 'World Bank Debtor Reporting System', year: 2025 }, candidateCountryCount: CODES.length, retrievableCountryCount: rows.length, rejectedCountryCount: rejected.length, transformedRowsFingerprint: canonicalDigest(rows), rejectedRowsFingerprint: canonicalDigest(rejected) });
const studyRun = runStudy({ studyMeta: { studyId: 'IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_v1', studyVersion: '1.0.0-preofficial-expansion', validationClass: 'CONFIRMATORY_STYLE_EXPANSION_NOT_FINAL_VALIDATION', backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD', notes: ['World Bank DSSI monthly country pages pulled at workflow runtime.', 'Route frozen before execution in dssi-sovereign-debt-service-expansion-2026-route.v1.json.', 'Schedule dispersion only; solvency/default risk is outside this route.'] }, datasetMeta: { datasetId: 'WORLD_BANK_DSSI_MONTHLY_DEBT_SERVICE_2025_RETRIEVABLE_COUNTRY_COHORT', datasetVersion: sourceIdentity.retrievedAt, datasetFingerprint: sourceIdentity.transformedRowsFingerprint }, routeSpec: route, rows, clock });
let portfolio = createPortfolio({ portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_WITH_DSSI_EXPANSION_2026_v1', owner: 'DGB', createdAt: clock().toISOString() });
portfolio = addStudyToPortfolio(portfolio, studyRun);
const dssiSummary = summary(studyRun, sourceIdentity, rows, rejected);
const files = { 'dssi-source-identity.v1.json': sourceIdentity, 'dssi-transformed-country-rows.v1.json': rows, 'dssi-rejected-country-rows.v1.json': rejected, 'imi-study-run-output.v1.json': studyRun, 'imi-study-receipt.v1.json': studyRun.receipt, 'imi-case-results.v1.json': studyRun.caseResults, 'imi-portfolio-registry.v1.json': portfolio, 'imi-portfolio-summary.v1.json': portfolioSummary(portfolio), 'dssi-expansion-summary.v1.json': dssiSummary };
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), JSON.stringify(value, null, 2));
console.log(JSON.stringify(dssiSummary, null, 2));
