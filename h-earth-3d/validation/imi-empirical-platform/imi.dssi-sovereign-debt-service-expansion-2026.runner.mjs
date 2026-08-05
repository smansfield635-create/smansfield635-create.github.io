import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { addStudyToPortfolio, createPortfolio, portfolioSummary, runStudy } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/dssi-sovereign-debt-service-expansion-2026-route.v1.json');

const DSSI_CANDIDATE_COUNTRIES = Object.freeze([
  'AFG','AGO','BGD','BEN','BTN','BFA','BDI','CPV','KHM','CMR','CAF','TCD','COM','COG','CIV','DJI','DMA','ETH','FJI','GMB','GHA','GRD','GIN','GNB','GUY','HTI','HND','KEN','KIR','KGZ','LAO','LSO','LBR','MDG','MWI','MDV','MLI','MRT','FSM','MDA','MNG','MOZ','MMR','NPL','NIC','NER','NGA','PAK','PNG','RWA','WSM','STP','SEN','SLE','SLB','SOM','SSD','LCA','VCT','SDN','TJK','TZA','TLS','TGO','TON','UGA','UZB','VUT','YEM','ZMB'
]);

const MONTHS = Object.freeze(['January','February','March','April','May','June','July','August','September','October','November','December']);

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const outputDir = argValue('--output-dir', '/tmp/imi-dssi-sovereign-debt-service-expansion-2026');
const clock = () => new Date(argValue('--clock', '2026-08-05T15:08:00.000Z'));

function decodeHtml(text) {
  return String(text)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function htmlToText(html) {
  return decodeHtml(String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function parseNumberToken(token) {
  if (token === '-' || token === '—' || token === '–') return 0;
  const n = Number(String(token).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

function extractCountryName(text, code) {
  const patterns = [
    new RegExp(`Monthly Debt Service[^A-Za-z0-9]+([^0-9]{3,90})\\s+2025`, 'i'),
    new RegExp(`(${code})\\s+([^0-9]{3,90})\\s+2025`, 'i')
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const raw = (match[1] || match[2] || code).trim().replace(/\s+/g, ' ');
      if (raw && !/interest|principal|total|debt service/i.test(raw)) return raw;
    }
  }
  return code;
}

function findTotalRowNumbers(text) {
  const token = '(?:-?\\d[\\d,]*(?:\\.\\d+)?|-|—|–)';
  const pattern = new RegExp(`(?:^|\\s)Total\\s+((?:${token}\\s+){35,}${token})`, 'gi');
  let selected = null;
  for (const match of text.matchAll(pattern)) {
    const values = match[1].trim().split(/\s+/).map(parseNumberToken).filter((v) => v !== null);
    if (values.length >= 36) selected = values.slice(0, 36);
  }
  return selected;
}

function normalizedEntropy(values) {
  const total = values.reduce((acc, value) => acc + value, 0);
  if (!(total > 0)) return null;
  let entropy = 0;
  for (const value of values) {
    if (value <= 0) continue;
    const p = value / total;
    entropy -= p * Math.log(p);
  }
  return entropy / Math.log(12);
}

function peak(values) {
  let index = 0;
  let value = values[0] ?? 0;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] > value) { index = i; value = values[i]; }
  }
  const total = values.reduce((acc, v) => acc + v, 0);
  return { month: MONTHS[index], value, share: total > 0 ? value / total : null };
}

function buildRowFromPage({ code, html, url }) {
  const text = htmlToText(html);
  const numbers = findTotalRowNumbers(text);
  if (!numbers || numbers.length < 36) return { status: 'UNEVALUABLE', code, reason: 'TOTAL_ROW_NOT_FOUND_OR_INCOMPLETE', url, sourceTextFingerprint: canonicalDigest(text) };
  const interest = [];
  const principal = [];
  const totalDebtService = [];
  for (let month = 0; month < 12; month += 1) {
    interest.push(numbers[month * 3]);
    principal.push(numbers[month * 3 + 1]);
    totalDebtService.push(numbers[month * 3 + 2]);
  }
  const annualInterest = interest.reduce((acc, v) => acc + v, 0);
  const annualPrincipal = principal.reduce((acc, v) => acc + v, 0);
  const annualTotal = totalDebtService.reduce((acc, v) => acc + v, 0);
  const aInterest = normalizedEntropy(interest);
  const aPrincipal = normalizedEntropy(principal);
  if (aInterest === null || aPrincipal === null) return { status: 'UNEVALUABLE', code, reason: 'ZERO_OR_INVALID_INTEREST_OR_PRINCIPAL_TOTAL', url, annualInterest, annualPrincipal, annualTotal, sourceTextFingerprint: canonicalDigest(text) };
  const ip = peak(interest);
  const pp = peak(principal);
  return {
    status: 'VALID_SOURCE_ROW',
    country_code: code,
    country_name: extractCountryName(text, code),
    data_year: 2025,
    annual_interest: annualInterest,
    annual_principal: annualPrincipal,
    annual_total_debt_service: annualTotal,
    principal_share: annualTotal > 0 ? annualPrincipal / annualTotal : null,
    interest_peak_month: ip.month,
    interest_peak_share: ip.share,
    principal_peak_month: pp.month,
    principal_peak_share: pp.share,
    total_peak_month: peak(totalDebtService).month,
    total_peak_share: peak(totalDebtService).share,
    a_interest_dispersion: aInterest,
    a_principal_dispersion: aPrincipal,
    dssi_page: url,
    source_text_fingerprint: canonicalDigest(text)
  };
}

async function fetchDssiPage(code) {
  const url = `https://datatopics.worldbank.org/dssitables/monthly/${code}`;
  const response = await fetch(url, { headers: { 'user-agent': 'IMI empirical platform DSSI refresh runner' } });
  if (!response.ok) return { status: 'FETCH_FAILED', code, url, reason: `HTTP_${response.status}` };
  return buildRowFromPage({ code, html: await response.text(), url });
}

function rankCorrelation(xs, ys) {
  const pairs = xs.map((x, i) => ({ x, y: ys[i] })).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  if (pairs.length < 2) return null;
  const rank = (vals) => {
    const sorted = vals.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
    const ranks = new Array(vals.length);
    let i = 0;
    while (i < sorted.length) {
      let j = i + 1;
      while (j < sorted.length && sorted[j].value === sorted[i].value) j += 1;
      const avg = (i + 1 + j) / 2;
      for (let k = i; k < j; k += 1) ranks[sorted[k].index] = avg;
      i = j;
    }
    return ranks;
  };
  const rx = rank(pairs.map((p) => p.x));
  const ry = rank(pairs.map((p) => p.y));
  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const mx = mean(rx), my = mean(ry);
  let numerator = 0, dx = 0, dy = 0;
  for (let i = 0; i < rx.length; i += 1) {
    const x = rx[i] - mx;
    const y = ry[i] - my;
    numerator += x * y;
    dx += x * x;
    dy += y * y;
  }
  return dx && dy ? numerator / Math.sqrt(dx * dy) : null;
}

function summarizeDssi(studyRun, sourceIdentity, transformedRows, rejectedRows) {
  const valid = studyRun.caseResults.filter((r) => r.status === 'VALID');
  const additive = valid.map((r) => r.additiveMean);
  const imi = valid.map((r) => r.imi);
  const divergence = valid.map((r) => r.additiveMean - r.imi);
  const maxDivergence = divergence.length ? Math.max(...divergence) : null;
  const maxDivergenceCase = maxDivergence === null ? null : valid[divergence.indexOf(maxDivergence)]?.caseId ?? null;
  const prior = { numericCases: 14, meanIMI: 0.8016, medianIMI: 0.8266, minIMI: 0.5851, maxIMI: 0.9448, maxDivergence: 0.1910, hardCollapseCases: 0 };
  return deepFreeze({
    schemaVersion: 'IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_SUMMARY_v1',
    result: 'PASS_CLOSED_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_REPOSITORY_INTAKE_RUN',
    sourceIdentity,
    candidateCountryCount: DSSI_CANDIDATE_COUNTRIES.length,
    transformedCountryRows: transformedRows.length,
    rejectedCountryRows: rejectedRows.length,
    validCases: studyRun.receipt.summary.validCases,
    unevaluableCases: studyRun.receipt.summary.unevaluableCases,
    hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
    meanIMI: studyRun.receipt.summary.imiSummary?.mean ?? null,
    medianIMI: studyRun.receipt.summary.imiSummary?.median ?? null,
    minIMI: studyRun.receipt.summary.imiSummary?.min ?? null,
    maxIMI: studyRun.receipt.summary.imiSummary?.max ?? null,
    meanAdditive: studyRun.receipt.summary.additiveMeanSummary?.mean ?? null,
    additiveIMIRankSpearman: rankCorrelation(additive, imi),
    maxAdditiveMinusIMIDivergence: maxDivergence,
    maxDivergenceCase,
    weakestFactorCounts: studyRun.receipt.summary.weakestFactorCounts,
    priorReference: prior,
    comparisonToPrior: {
      numericCasesDelta: studyRun.receipt.summary.validCases - prior.numericCases,
      meanIMIDelta: (studyRun.receipt.summary.imiSummary?.mean ?? 0) - prior.meanIMI,
      medianIMIDelta: (studyRun.receipt.summary.imiSummary?.median ?? 0) - prior.medianIMI,
      hardCollapseCasesDelta: studyRun.receipt.summary.hardCollapseCases - prior.hardCollapseCases,
      maxDivergenceDelta: maxDivergence === null ? null : maxDivergence - prior.maxDivergence
    },
    boundaries: {
      confirmatoryStyleExpansion: true,
      finalValidationClaimed: false,
      solvencyOrDefaultPredictionClaimed: false,
      terminalIMI7Assigned: false,
      rawDownloadedAtRuntime: true,
      scheduleDispersionOnly: true
    }
  });
}

await mkdir(outputDir, { recursive: true });
const fetched = [];
for (const code of DSSI_CANDIDATE_COUNTRIES) {
  // Sequential fetch keeps the World Bank site load small and makes failure order reproducible.
  fetched.push(await fetchDssiPage(code));
}
const transformedRows = fetched.filter((row) => row.status === 'VALID_SOURCE_ROW');
const rejectedRows = fetched.filter((row) => row.status !== 'VALID_SOURCE_ROW');
if (transformedRows.length < 14) throw new Error(`DSSI_RETRIEVABLE_COHORT_TOO_SMALL:${transformedRows.length}`);

const sourceIdentity = deepFreeze({
  schemaVersion: 'DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_SOURCE_IDENTITY_v1',
  retrievedAt: clock().toISOString(),
  source: {
    program: 'Debt Service Suspension Initiative',
    agency: 'World Bank',
    programPage: 'https://www.worldbank.org/en/programs/debt-statistics/dssi',
    monthlyTablePattern: 'https://datatopics.worldbank.org/dssitables/monthly/{ISO3}',
    dataSourceDeclaredByMonthlyPages: 'World Bank Debtor Reporting System',
    year: 2025
  },
  candidateCountryCount: DSSI_CANDIDATE_COUNTRIES.length,
  retrievableCountryCount: transformedRows.length,
  rejectedCountryCount: rejectedRows.length,
  transformedRowsFingerprint: canonicalDigest(transformedRows),
  rejectedRowsFingerprint: canonicalDigest(rejectedRows)
});

const studyRun = runStudy({
  studyMeta: {
    studyId: 'IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_v1',
    studyVersion: '1.0.0-preofficial-expansion',
    validationClass: 'CONFIRMATORY_STYLE_EXPANSION_NOT_FINAL_VALIDATION',
    backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD',
    notes: [
      'World Bank DSSI monthly country pages pulled at workflow runtime.',
      'Route frozen before execution in dssi-sovereign-debt-service-expansion-2026-route.v1.json.',
      'Schedule dispersion only; solvency, default risk, reserves, exports, revenue, and refinancing capacity are outside this route.'
    ]
  },
  datasetMeta: {
    datasetId: 'WORLD_BANK_DSSI_MONTHLY_DEBT_SERVICE_2025_RETRIEVABLE_COUNTRY_COHORT',
    datasetVersion: sourceIdentity.retrievedAt,
    datasetFingerprint: sourceIdentity.transformedRowsFingerprint
  },
  routeSpec: route,
  rows: transformedRows,
  clock
});
let portfolio = createPortfolio({ portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_WITH_DSSI_EXPANSION_2026_v1', owner: 'DGB', createdAt: clock().toISOString() });
portfolio = addStudyToPortfolio(portfolio, studyRun);
const dssiSummary = summarizeDssi(studyRun, sourceIdentity, transformedRows, rejectedRows);
const portfolioSummaryOut = portfolioSummary(portfolio);

const files = {
  'dssi-source-identity.v1.json': sourceIdentity,
  'dssi-transformed-country-rows.v1.json': transformedRows,
  'dssi-rejected-country-rows.v1.json': rejectedRows,
  'imi-study-run-output.v1.json': studyRun,
  'imi-study-receipt.v1.json': studyRun.receipt,
  'imi-case-results.v1.json': studyRun.caseResults,
  'imi-portfolio-registry.v1.json': portfolio,
  'imi-portfolio-summary.v1.json': portfolioSummaryOut,
  'dssi-expansion-summary.v1.json': dssiSummary
};
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), JSON.stringify(value, null, 2));
console.log(JSON.stringify(dssiSummary, null, 2));
