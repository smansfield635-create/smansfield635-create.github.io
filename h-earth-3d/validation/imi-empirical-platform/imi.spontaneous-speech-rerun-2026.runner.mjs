import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { addStudyToPortfolio, createPortfolio, portfolioSummary, runStudy } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/spontaneous-speech-current-repository-rerun-2026-route.v1.json');

const EXPECTED_SOURCE_SHA256 = '8aeea454a7e52ce072fa19289976cb1a06adac0ea8103c7537ec5677b72b4e2d';
const EXPECTED = Object.freeze({
  participants: 291,
  languageCounts: { EN: 237, EL: 54 },
  validCases: 291,
  unevaluableCases: 0,
  hardCollapseCases: 0,
  meanIMI: 0.046104,
  medianIMI: 0.012221,
  varianceIMI: 0.007304,
  minIMI: 0.0000002452,
  maxIMI: 0.648228,
  weakestFactorCounts: {
    CONCEPTUAL_BREADTH_AVAILABILITY: 72,
    CONTEXTUAL_BREADTH_AVAILABILITY: 70,
    VISUAL_GROUNDING_AVAILABILITY: 37,
    SYNTACTIC_ORGANIZATION_AVAILABILITY: 47,
    ADJUSTED_PREDICTABILITY_AVAILABILITY: 65
  }
});

const SOURCE = Object.freeze({
  article: "The structure of spontaneous speech changes in Alzheimer's disease: Crosslingual evidence from English and Greek",
  doi: '10.1371/journal.pone.0324270',
  supplementaryDoi: '10.1371/journal.pone.0324270.s003',
  pmcid: 'PMC12097628',
  pmid: '40402990',
  sourceFile: 'pone.0324270.s003.csv',
  expectedBytes: 43331,
  expectedSha256: EXPECTED_SOURCE_SHA256,
  retrievalCandidates: [
    'https://journals.plos.org/plosone/article/file?type=supplementary&id=10.1371/journal.pone.0324270.s003',
    'https://journals.plos.org/plosone/article/file?id=10.1371%2Fjournal.pone.0324270.s003&type=supplementary',
    'https://pmc.ncbi.nlm.nih.gov/articles/instance/12097628/bin/pone.0324270.s003.csv',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC12097628/bin/pone.0324270.s003.csv'
  ]
});

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
const outputDir = argValue('--output-dir', '/tmp/imi-spontaneous-speech-rerun-2026');
const clock = () => new Date(argValue('--clock', '2026-08-05T16:38:00.000Z'));

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''));
    if (row.some((value) => value !== '')) rows.push(row);
  }
  if (rows.length < 2) throw new Error('SPEECH_SOURCE_CSV_EMPTY');
  const headers = rows[0].map((value) => value.trim());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

function normalizedKey(value) {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function resolveField(row, aliases) {
  const map = new Map(Object.keys(row).map((key) => [normalizedKey(key), key]));
  for (const alias of aliases) {
    const key = map.get(normalizedKey(alias));
    if (key) return row[key];
  }
  return undefined;
}

function finite(value) {
  const parsed = Number(String(value ?? '').trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function averageRanks(values) {
  const indexed = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const ranks = new Array(values.length);
  let cursor = 0;
  while (cursor < indexed.length) {
    let end = cursor + 1;
    while (end < indexed.length && indexed[end].value === indexed[cursor].value) end += 1;
    const average = (cursor + 1 + end) / 2;
    for (let i = cursor; i < end; i += 1) ranks[indexed[i].index] = average;
    cursor = end;
  }
  return ranks;
}

function percentileRanks(values) {
  const ranks = averageRanks(values);
  return ranks.map((rank) => (rank - 0.5) / values.length);
}

function residualize(y, x) {
  const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const mx = mean(x);
  const my = mean(y);
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < x.length; i += 1) {
    numerator += (x[i] - mx) * (y[i] - my);
    denominator += (x[i] - mx) ** 2;
  }
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = my - slope * mx;
  return y.map((value, index) => value - (intercept + slope * x[index]));
}

function variance(values) {
  if (values.length < 2) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
}

function counts(values) {
  const output = {};
  for (const value of values) output[value] = (output[value] || 0) + 1;
  return output;
}

async function fetchSource() {
  const failures = [];
  for (const url of SOURCE.retrievalCandidates) {
    try {
      const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'H-Earth-IMI-Empirical-Platform/1.0' } });
      if (!response.ok) {
        failures.push(`${url}:HTTP_${response.status}`);
        continue;
      }
      const text = await response.text();
      if (!text.includes('FT_GSim') || !text.includes('BERT_GSim') || !text.includes('CLIP')) {
        failures.push(`${url}:NOT_EXPECTED_CSV`);
        continue;
      }
      const digest = sha256(text);
      if (digest !== EXPECTED_SOURCE_SHA256) {
        failures.push(`${url}:SHA256_${digest}`);
        continue;
      }
      return { url, text, digest };
    } catch (error) {
      failures.push(`${url}:${error?.message || 'FETCH_ERROR'}`);
    }
  }
  throw new Error(`SPEECH_SOURCE_FETCH_FAILED:${failures.join('|')}`);
}

function admitSourceRows(sourceRows) {
  return sourceRows.map((row, index) => {
    const participantId = String(resolveField(row, ['PAR', 'participant', 'participant_id']) ?? '').trim();
    const language = String(resolveField(row, ['language', 'lang']) ?? '').trim().toUpperCase();
    const record = {
      source_index: index,
      participant_id: participantId,
      language,
      ft_global_similarity: finite(resolveField(row, ['FT_GSim', 'FT GSim'])),
      bert_global_similarity: finite(resolveField(row, ['BERT_GSim', 'BERT GSim'])),
      clip_alignment: finite(resolveField(row, ['CLIP'])),
      averaged_dependency_distance: finite(resolveField(row, ['ADD'])),
      perplexity: finite(resolveField(row, ['PPL'])),
      bert_type_token_ratio: finite(resolveField(row, ['BERT_TTR', 'BERT TTR']))
    };
    const missing = Object.entries(record)
      .filter(([key, value]) => key !== 'source_index' && (value === null || value === ''))
      .map(([key]) => key);
    if (missing.length) throw new Error(`SPEECH_REQUIRED_SOURCE_FIELD_MISSING:${participantId || index}:${missing.join(',')}`);
    if (!['EN', 'EL'].includes(language)) throw new Error(`SPEECH_LANGUAGE_UNEXPECTED:${language}`);
    if (record.perplexity <= 0) throw new Error(`SPEECH_PERPLEXITY_NONPOSITIVE:${participantId}`);
    return record;
  });
}

function transformRows(admitted) {
  const transformed = [];
  const sourceOrder = new Map(admitted.map((row, index) => [row.participant_id, index]));
  for (const language of ['EN', 'EL']) {
    const group = admitted.filter((row) => row.language === language);
    const conceptualRank = percentileRanks(group.map((row) => row.ft_global_similarity));
    const contextualRank = percentileRanks(group.map((row) => row.bert_global_similarity));
    const visualRank = percentileRanks(group.map((row) => row.clip_alignment));
    const syntacticRank = percentileRanks(group.map((row) => row.averaged_dependency_distance));
    const logPpl = group.map((row) => Math.log(row.perplexity));
    const residuals = residualize(logPpl, group.map((row) => row.bert_type_token_ratio));
    const predictabilityRank = percentileRanks(residuals);
    for (let i = 0; i < group.length; i += 1) {
      transformed.push({
        participant_id: group[i].participant_id,
        language,
        a_conceptual: 1 - conceptualRank[i],
        a_contextual: 1 - contextualRank[i],
        a_visual_grounding: visualRank[i],
        a_syntactic_organization: syntacticRank[i],
        a_adjusted_predictability: 1 - predictabilityRank[i],
        ppl_log_residual: residuals[i]
      });
    }
  }
  return transformed.sort((a, b) => sourceOrder.get(a.participant_id) - sourceOrder.get(b.participant_id));
}

function resolveLegacyWeakestFactorTies(caseResults) {
  const tieResolvedCounts = {};
  const tiePatternCounts = {};
  let tieCases = 0;
  for (const result of caseResults.filter((candidate) => candidate.status === 'VALID')) {
    const weakest = result.factors
      .filter((factor) => factor.availability === result.wmi)
      .map((factor) => factor.factorId);
    if (weakest.length > 1) {
      tieCases += 1;
      const pattern = weakest.join('|');
      tiePatternCounts[pattern] = (tiePatternCounts[pattern] || 0) + 1;
    }
    const firstRequiredFactor = weakest[0];
    tieResolvedCounts[firstRequiredFactor] = (tieResolvedCounts[firstRequiredFactor] || 0) + 1;
  }
  return deepFreeze({
    policy: 'FIRST_REQUIRED_FACTOR_IN_FROZEN_ROUTE_ORDER_FOR_LEGACY_COMPARISON_ONLY',
    engineNativePolicy: 'PRESERVE_ALL_EXACT_TIES',
    tieCases,
    tiePatternCounts,
    tieResolvedCounts
  });
}

function summarize(studyRun, sourceIdentity, rows) {
  const valid = studyRun.caseResults.filter((result) => result.status === 'VALID');
  const imis = valid.map((result) => result.imi);
  const languageCounts = counts(rows.map((row) => row.language));
  const uniqueIMIValues = new Set(imis.map((value) => value.toPrecision(16))).size;
  const tieResolution = resolveLegacyWeakestFactorTies(studyRun.caseResults);
  const summary = {
    schemaVersion: 'IMI_SPONTANEOUS_SPEECH_REPOSITORY_RERUN_2026_SUMMARY_v1',
    result: 'PASS_CLOSED_SPONTANEOUS_SPEECH_CURRENT_REPOSITORY_RERUN_2026',
    runId: 'IMI_SPONTANEOUS_SPEECH_REPOSITORY_RERUN_2026_v1',
    sourceIdentity,
    participantRows: rows.length,
    languageCounts,
    validCases: studyRun.receipt.summary.validCases,
    unevaluableCases: studyRun.receipt.summary.unevaluableCases,
    hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
    meanIMI: studyRun.receipt.summary.imiSummary?.mean ?? null,
    medianIMI: studyRun.receipt.summary.imiSummary?.median ?? null,
    varianceIMI: variance(imis),
    minIMI: studyRun.receipt.summary.imiSummary?.min ?? null,
    maxIMI: studyRun.receipt.summary.imiSummary?.max ?? null,
    uniqueIMIValues,
    weakestFactorCounts: tieResolution.tieResolvedCounts,
    engineNativeWeakestFactorCounts: studyRun.receipt.summary.weakestFactorCounts,
    weakestFactorTieDiagnostics: {
      policy: tieResolution.policy,
      engineNativePolicy: tieResolution.engineNativePolicy,
      tieCases: tieResolution.tieCases,
      tiePatternCounts: tieResolution.tiePatternCounts
    },
    legacyReproductionComparison: {
      expected: EXPECTED,
      absoluteDeltas: {
        meanIMI: Math.abs((studyRun.receipt.summary.imiSummary?.mean ?? NaN) - EXPECTED.meanIMI),
        medianIMI: Math.abs((studyRun.receipt.summary.imiSummary?.median ?? NaN) - EXPECTED.medianIMI),
        varianceIMI: Math.abs(variance(imis) - EXPECTED.varianceIMI),
        minIMI: Math.abs((studyRun.receipt.summary.imiSummary?.min ?? NaN) - EXPECTED.minIMI),
        maxIMI: Math.abs((studyRun.receipt.summary.imiSummary?.max ?? NaN) - EXPECTED.maxIMI)
      }
    },
    determinations: {
      rawPublishedFeatureFileRerun: true,
      currentRepositoryEngineUsed: true,
      domainVarianceMaterial: uniqueIMIValues === rows.length,
      weakestFactorDiversity: Object.keys(tieResolution.tieResolvedCounts).length === 5,
      exactWeakestFactorTiesPreserved: tieResolution.tieCases === 5,
      clinicalValidationEstablished: false,
      naturalDiagnosticCategoriesEstablished: false
    },
    boundaries: {
      reproductionClass: 'REPOSITORY_REPRODUCTION_OF_EXPLORATORY_ROUTE',
      finalValidationClaimed: false,
      diagnosisOrClinicalDiscriminationClaimed: false,
      terminalIMI7Assigned: false,
      rawAudioOrTranscriptLoaded: false,
      publishedFeatureFileDownloadedAtRuntime: true,
      weakestFactorLegacyComparisonUsesFirstRequiredFactorTieResolution: true,
      engineNativeReceiptsPreserveAllExactTies: true,
      mainMerged: false,
      liveWebsiteOperational: false
    }
  };

  if (summary.participantRows !== EXPECTED.participants) throw new Error(`SPEECH_PARTICIPANT_COUNT_MISMATCH:${summary.participantRows}`);
  if (languageCounts.EN !== EXPECTED.languageCounts.EN || languageCounts.EL !== EXPECTED.languageCounts.EL) throw new Error(`SPEECH_LANGUAGE_COUNT_MISMATCH:${JSON.stringify(languageCounts)}`);
  if (summary.validCases !== EXPECTED.validCases || summary.unevaluableCases !== 0 || summary.hardCollapseCases !== 0) throw new Error('SPEECH_VALIDITY_SUMMARY_MISMATCH');
  if (uniqueIMIValues !== EXPECTED.participants) throw new Error(`SPEECH_UNIQUE_IMI_COUNT_MISMATCH:${uniqueIMIValues}`);
  for (const [factorId, expectedCount] of Object.entries(EXPECTED.weakestFactorCounts)) {
    if (summary.weakestFactorCounts[factorId] !== expectedCount) throw new Error(`SPEECH_WEAKEST_FACTOR_COUNTS_MISMATCH:${factorId}:${summary.weakestFactorCounts[factorId]}`);
  }
  if (Object.keys(summary.weakestFactorCounts).length !== Object.keys(EXPECTED.weakestFactorCounts).length) throw new Error(`SPEECH_WEAKEST_FACTOR_KEY_COUNT_MISMATCH:${JSON.stringify(summary.weakestFactorCounts)}`);
  for (const [key, delta] of Object.entries(summary.legacyReproductionComparison.absoluteDeltas)) {
    const tolerance = key === 'minIMI' ? 1e-10 : 5e-6;
    if (!Number.isFinite(delta) || delta > tolerance) throw new Error(`SPEECH_LEGACY_REPRODUCTION_DELTA_EXCEEDED:${key}:${delta}`);
  }
  return deepFreeze(summary);
}

await mkdir(outputDir, { recursive: true });
const fetched = await fetchSource();
const sourceRows = parseCsv(fetched.text);
const admitted = admitSourceRows(sourceRows);
const rows = transformRows(admitted);
const sourceIdentity = deepFreeze({
  schemaVersion: 'SPONTANEOUS_SPEECH_PUBLISHED_FEATURE_SOURCE_IDENTITY_v1',
  retrievedAt: clock().toISOString(),
  source: SOURCE,
  resolvedDownloadUrl: fetched.url,
  sourceBytes: Buffer.byteLength(fetched.text, 'utf8'),
  sourceSha256: fetched.digest,
  sourceRowCount: sourceRows.length,
  transformedRowsFingerprint: canonicalDigest(rows)
});

const studyRun = runStudy({
  studyMeta: {
    studyId: 'IMI_SPONTANEOUS_SPEECH_REPOSITORY_RERUN_2026_v1',
    studyVersion: '1.0.0-preofficial-reproduction',
    validationClass: 'EXPLORATORY_ROUTE_REPOSITORY_REPRODUCTION_NOT_CLINICAL_VALIDATION',
    backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD',
    notes: [
      'Published PLOS S3 linguistic-feature CSV downloaded and hash-bound at execution.',
      'Route frozen before execution in spontaneous-speech-current-repository-rerun-2026-route.v1.json.',
      'No diagnosis, MMSE, demographic, clinical classification, raw audio, or transcript inference is performed.'
    ]
  },
  datasetMeta: {
    datasetId: 'PLOS_ONE_PONE_0324270_S3_LINGUISTIC_FEATURES',
    datasetVersion: EXPECTED_SOURCE_SHA256,
    datasetFingerprint: sourceIdentity.transformedRowsFingerprint
  },
  routeSpec: route,
  rows,
  clock
});

let portfolio = createPortfolio({
  portfolioId: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_WITH_SPONTANEOUS_SPEECH_REPRODUCTION_2026_v1',
  owner: 'DGB',
  createdAt: clock().toISOString()
});
portfolio = addStudyToPortfolio(portfolio, studyRun);
const speechSummary = summarize(studyRun, sourceIdentity, rows);
const portfolioSummaryOut = portfolioSummary(portfolio);

const files = {
  'spontaneous-speech-source-identity.v1.json': sourceIdentity,
  'spontaneous-speech-transformed-rows.v1.json': rows,
  'imi-study-run-output.v1.json': studyRun,
  'imi-study-receipt.v1.json': studyRun.receipt,
  'imi-case-results.v1.json': studyRun.caseResults,
  'imi-portfolio-registry.v1.json': portfolio,
  'imi-portfolio-summary.v1.json': portfolioSummaryOut,
  'spontaneous-speech-rerun-summary.v1.json': speechSummary
};
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), JSON.stringify(value, null, 2));
console.log(JSON.stringify(speechSummary, null, 2));
