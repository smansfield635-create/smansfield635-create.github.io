import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { addStudyToPortfolio, createPortfolio, portfolioSummary, runStudy, spearman } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/usda-honey-bee-refresh-2026-route.v1.json');

const SOURCE = Object.freeze({
  publication: 'Honey Bee Colonies',
  agency: 'USDA National Agricultural Statistics Service',
  publicationPage: 'https://esmis.nal.usda.gov/publication/honey-bee-colonies',
  releasePage: 'https://esmis.nal.usda.gov/publication/honey-bee-colonies/2026-08-03',
  txtUrl: 'https://esmis.nal.usda.gov/sites/default/release-files/796006/hcny0726.txt',
  released: '2026-08-03'
});

const QUARTERS = Object.freeze([
  { key: '2025_Q1', label: 'January-March 2025', lossAnchor: 'States and United States: January 1, 2025 and January-March 2025' },
  { key: '2025_Q2', label: 'April-June 2025', lossAnchor: 'States and United States: April 1, 2025 and April-June 2025' },
  { key: '2025_Q3', label: 'July-September 2025', lossAnchor: 'States and United States: July 1, 2025 and July-September 2025' },
  { key: '2025_Q4', label: 'October-December 2025', lossAnchor: 'States and United States: October 1, 2025 and October-December 2025' },
  { key: '2026_Q1', label: 'January-March 2026', lossAnchor: 'States and United States: January 1, 2026 and January-March 2026' },
  { key: '2026_Q2', label: 'April-June 2026', lossAnchor: 'States and United States: April 1, 2026 and April-June 2026' }
]);

const PRIMARY_STATE_COUNT = 20;

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
const outputDir = argValue('--output-dir', '/tmp/imi-usda-honey-bee-refresh-2026');
const clock = () => new Date(argValue('--clock', '2026-08-05T15:00:00.000Z'));

function parseReportValue(token, { percent = false } = {}) {
  const clean = String(token ?? '').trim();
  if (!clean || clean === '(X)') return null;
  if (clean === '-') return 0;
  if (clean === '(Z)') return percent ? 0.25 : 0;
  const parsed = Number(clean.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeState(raw) {
  return String(raw)
    .replace(/\.+$/g, '')
    .replace(/\s+\d+\/?\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRowLine(line) {
  const match = line.match(/^\s*([A-Za-z][A-Za-z\s]+(?:\s\d+\/)?|Other States\s\d+\/|United States)\s*\.*:\s*(.+)$/);
  if (!match) return null;
  const state = normalizeState(match[1]);
  const tokens = match[2].trim().split(/\s+/).filter(Boolean);
  return { state, tokens };
}

function parseLossTables(text) {
  const byQuarter = new Map();
  for (const quarter of QUARTERS) byQuarter.set(quarter.key, new Map());
  let active = null;
  for (const line of text.split(/\r?\n/)) {
    for (const quarter of QUARTERS) {
      if (line.includes(quarter.lossAnchor)) active = quarter.key;
    }
    if (!active) continue;
    if (line.startsWith('Colony Health Stressors')) active = null;
    const parsed = parseRowLine(line);
    if (!parsed) continue;
    const [coloniesAtStart, maximumColonies, lostColonies, percentLost, addedColonies, renovatedColonies, percentRenovated] = parsed.tokens;
    const record = {
      state: parsed.state,
      colonies_at_start: parseReportValue(coloniesAtStart),
      maximum_colonies: parseReportValue(maximumColonies),
      lost_colonies: parseReportValue(lostColonies),
      percent_lost: parseReportValue(percentLost, { percent: true }),
      added_colonies: parseReportValue(addedColonies),
      renovated_colonies: parseReportValue(renovatedColonies),
      percent_renovated: parseReportValue(percentRenovated, { percent: true })
    };
    if (record.state && record.percent_lost !== null) byQuarter.get(active).set(record.state, record);
  }
  return byQuarter;
}

function parseStressTables(text) {
  const byQuarter = new Map();
  for (const quarter of QUARTERS) byQuarter.set(quarter.key, new Map());
  let active = null;
  for (const line of text.split(/\r?\n/)) {
    const stressMatch = line.match(/Colony Health Stressors with Five or More Colonies - States and United States: (.+)$/);
    if (stressMatch) {
      active = QUARTERS.find((quarter) => quarter.label === stressMatch[1])?.key ?? null;
      continue;
    }
    if (!active) continue;
    if (line.startsWith('Colonies Lost with Colony Collapse')) active = null;
    const parsed = parseRowLine(line);
    if (!parsed || parsed.tokens.length < 6) continue;
    const [varroa, otherPests, disease, pesticide, other, unknown] = parsed.tokens;
    const record = {
      state: parsed.state,
      varroa_percent: parseReportValue(varroa, { percent: true }),
      other_pests_percent: parseReportValue(otherPests, { percent: true }),
      disease_percent: parseReportValue(disease, { percent: true }),
      pesticide_percent: parseReportValue(pesticide, { percent: true }),
      other_percent: parseReportValue(other, { percent: true }),
      unknown_percent: parseReportValue(unknown, { percent: true })
    };
    if (record.state && record.varroa_percent !== null) byQuarter.get(active).set(record.state, record);
  }
  return byQuarter;
}

function primaryStates(stressByQuarter) {
  const counts = new Map();
  for (const quarter of QUARTERS) {
    for (const state of stressByQuarter.get(quarter.key).keys()) {
      if (state === 'United States' || state === 'Other States') continue;
      counts.set(state, (counts.get(state) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count === QUARTERS.length)
    .map(([state]) => state)
    .sort();
}

function buildRows(stressByQuarter, lossByQuarter) {
  const states = primaryStates(stressByQuarter);
  if (states.length !== PRIMARY_STATE_COUNT) throw new Error(`PRIMARY_STATE_COUNT_MISMATCH:${states.length}`);
  const rows = [];
  for (let i = 0; i < QUARTERS.length - 1; i += 1) {
    const quarter = QUARTERS[i];
    const nextQuarter = QUARTERS[i + 1];
    for (const state of states) {
      const stress = stressByQuarter.get(quarter.key).get(state);
      const currentLoss = lossByQuarter.get(quarter.key).get(state);
      const nextLoss = lossByQuarter.get(nextQuarter.key).get(state);
      if (!stress || !currentLoss || !nextLoss) continue;
      rows.push({
        case_id: `${state.replace(/[^A-Za-z0-9]+/g, '_').toUpperCase()}__${quarter.key}`,
        state,
        quarter: quarter.key,
        next_quarter: nextQuarter.key,
        varroa_constraint: stress.varroa_percent / 100,
        other_pests_constraint: stress.other_pests_percent / 100,
        disease_constraint: stress.disease_percent / 100,
        pesticide_constraint: stress.pesticide_percent / 100,
        other_stressor_constraint_sensitivity: stress.other_percent / 100,
        unknown_stressor_percent: stress.unknown_percent,
        current_loss_rate: currentLoss.percent_lost / 100,
        next_loss_rate: nextLoss.percent_lost / 100,
        current_percent_lost: currentLoss.percent_lost,
        next_percent_lost: nextLoss.percent_lost
      });
    }
  }
  return rows;
}

function summarizeBee(studyRun, sourceIdentity, rows) {
  const valid = studyRun.caseResults.filter((result) => result.status === 'VALID');
  const cs = valid.map((result) => result.cs);
  const imi = valid.map((result) => result.imi);
  const additiveSeverity = valid.map((result) => 1 - result.additiveMean);
  const wmiSeverity = valid.map((result) => 1 - result.wmi);
  const outcomes = rows.filter((_, i) => studyRun.caseResults[i]?.status === 'VALID').map((row) => row.next_loss_rate);
  const prior = {
    transitions: 100,
    fourFactorSeveritySpearmanNextLoss: 0.345,
    multiplicativeAdvantageOverAdditive: 'NOT_ESTABLISHED',
    weakestFactorDiversity: 'FAILED_VARROA_AS_WEAKEST_FACTOR_ALL_ROWS'
  };
  return deepFreeze({
    schemaVersion: 'IMI_USDA_HONEY_BEE_REFRESH_2026_SUMMARY_v1',
    result: 'PASS_CLOSED_USDA_HONEY_BEE_REFRESH_2026_REPOSITORY_INTAKE_RUN',
    sourceIdentity,
    transitionRows: rows.length,
    validCases: studyRun.receipt.summary.validCases,
    unevaluableCases: studyRun.receipt.summary.unevaluableCases,
    hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
    medianIMI: studyRun.receipt.summary.imiSummary?.median ?? null,
    meanIMI: studyRun.receipt.summary.imiSummary?.mean ?? null,
    medianCS: studyRun.receipt.summary.csSummary?.median ?? null,
    weakestFactorCounts: studyRun.receipt.summary.weakestFactorCounts,
    outcomeComparators: {
      next_loss_rate: {
        pairedN: outcomes.length,
        spearmanIMI: spearman(imi, outcomes),
        spearmanCS: spearman(cs, outcomes),
        spearmanAdditiveSeverity: spearman(additiveSeverity, outcomes),
        spearmanWMISeverity: spearman(wmiSeverity, outcomes)
      }
    },
    priorReference: prior,
    boundaries: {
      confirmatoryStyleRefresh: true,
      finalValidationClaimed: false,
      terminalIMI7Assigned: false,
      rawDownloadedAtRuntime: true,
      stateLevelAggregateOnly: true
    }
  });
}

await mkdir(outputDir, { recursive: true });
const response = await fetch(SOURCE.txtUrl);
if (!response.ok) throw new Error(`USDA_HONEY_BEE_TXT_FETCH_FAILED:${response.status}`);
const text = await response.text();
if (!text.includes('Released August 3, 2026')) throw new Error('USDA_RELEASE_IDENTITY_NOT_2026_08_03');
const lossByQuarter = parseLossTables(text);
const stressByQuarter = parseStressTables(text);
const rows = buildRows(stressByQuarter, lossByQuarter);
if (rows.length !== 100) throw new Error(`TRANSITION_ROW_COUNT_FAILURE:${rows.length}`);

const sourceIdentity = deepFreeze({
  schemaVersion: 'USDA_HONEY_BEE_REFRESH_2026_SOURCE_IDENTITY_v1',
  retrievedAt: clock().toISOString(),
  source: SOURCE,
  sourceTextBytes: Buffer.byteLength(text, 'utf8'),
  sourceTextFingerprint: canonicalDigest(text),
  parsedTables: {
    lossQuarterCount: [...lossByQuarter.values()].filter((map) => map.size > 0).length,
    stressQuarterCount: [...stressByQuarter.values()].filter((map) => map.size > 0).length,
    primaryStateCount: PRIMARY_STATE_COUNT,
    transitionRows: rows.length,
    transformedRowsFingerprint: canonicalDigest(rows)
  }
});

const studyRun = runStudy({
  studyMeta: {
    studyId: 'IMI_USDA_HONEY_BEE_COLONY_RESILIENCE_REFRESH_2026_v1',
    studyVersion: '1.0.0-preofficial-refresh',
    validationClass: 'CONFIRMATORY_STYLE_TEMPORAL_REFRESH_NOT_FINAL_VALIDATION',
    backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD',
    notes: [
      'USDA NASS Honey Bee Colonies text report pulled in repository workflow.',
      'Route frozen before execution in usda-honey-bee-refresh-2026-route.v1.json.',
      'Outcome is next-quarter percent lost at state aggregate level.'
    ]
  },
  datasetMeta: {
    datasetId: 'USDA_NASS_HONEY_BEE_COLONIES_AUGUST_2026_TEXT_REPORT',
    datasetVersion: SOURCE.released,
    datasetFingerprint: sourceIdentity.parsedTables.transformedRowsFingerprint
  },
  routeSpec: route,
  rows,
  clock
});
let portfolio = createPortfolio({
  portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_WITH_USDA_HONEY_BEE_REFRESH_2026_v1',
  owner: 'DGB',
  createdAt: clock().toISOString()
});
portfolio = addStudyToPortfolio(portfolio, studyRun);
const beeSummary = summarizeBee(studyRun, sourceIdentity, rows);
const portfolioSummaryOut = portfolioSummary(portfolio);

const files = {
  'usda-honey-bee-refresh-source-identity.v1.json': sourceIdentity,
  'usda-honey-bee-refresh-transformed-rows.v1.json': rows,
  'imi-study-run-output.v1.json': studyRun,
  'imi-study-receipt.v1.json': studyRun.receipt,
  'imi-case-results.v1.json': studyRun.caseResults,
  'imi-portfolio-registry.v1.json': portfolio,
  'imi-portfolio-summary.v1.json': portfolioSummaryOut,
  'usda-honey-bee-refresh-summary.v1.json': beeSummary
};
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), JSON.stringify(value, null, 2));
console.log(JSON.stringify(beeSummary, null, 2));
