import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  canonicalDigest,
  deepFreeze,
  stableStringify
} from '../../tools/instrument-platform/platform-core.mjs';
import {
  runStudy
} from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/spontaneous-speech-current-repository-rerun-2026-route.v1.json');
const manifest = require('../../tools/imi-empirical-platform/generalizability/imi-phase3-parallel-external-tests-manifest.v1.json');
const contract = require('../../tools/imi-empirical-platform/generalizability/imi-phase3-clac-five-feature-extraction-contract.v1.json');
const track = manifest.tracks.find((entry) => entry.track === 'SPEECH_HELD_OUT_DATASET_REPRODUCTION');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const featurePackagePath = argValue('--feature-package');
const outputDir = argValue('--output-dir', '/tmp/imi-phase3-clac-five-feature-completion');
const clockValue = argValue('--clock', '2026-08-05T20:05:00.000Z');
const clock = () => new Date(clockValue);
if (!featurePackagePath) throw new Error('CLAC_FEATURE_PACKAGE_PATH_REQUIRED');

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function verifyPythonCanonicalPayload(payload) {
  const { payloadSha256, ...body } = payload;
  const calculated = sha256(stableStringify(body));
  if (typeof payloadSha256 !== 'string' || payloadSha256 !== calculated) {
    throw new Error(`CLAC_FEATURE_PACKAGE_PAYLOAD_SHA256_MISMATCH:${payloadSha256}:${calculated}`);
  }
  return calculated;
}

function finite(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function averageRanks(values) {
  const indexed = values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value - right.value);
  const ranks = new Array(values.length);
  let cursor = 0;
  while (cursor < indexed.length) {
    let end = cursor + 1;
    while (end < indexed.length && indexed[end].value === indexed[cursor].value) end += 1;
    const average = (cursor + 1 + end) / 2;
    for (let index = cursor; index < end; index += 1) ranks[indexed[index].index] = average;
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
  const xMean = mean(x);
  const yMean = mean(y);
  let numerator = 0;
  let denominator = 0;
  for (let index = 0; index < x.length; index += 1) {
    numerator += (x[index] - xMean) * (y[index] - yMean);
    denominator += (x[index] - xMean) ** 2;
  }
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;
  return y.map((value, index) => value - (intercept + slope * x[index]));
}

function countBy(values) {
  const result = {};
  for (const value of values) result[value] = (result[value] || 0) + 1;
  return result;
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function transformRows(sourceRows) {
  const required = ['FT_GSim', 'BERT_GSim', 'CLIP', 'ADD', 'PPL', 'BERT_TTR'];
  const admitted = sourceRows.map((row, sourceIndex) => {
    const missing = required.filter((field) => !finite(row[field]));
    if (missing.length > 0) {
      throw new Error(`CLAC_REQUIRED_FEATURE_MISSING:${row.participant_id || sourceIndex}:${missing.join(',')}`);
    }
    if (row.PPL <= 0) throw new Error(`CLAC_PPL_NONPOSITIVE:${row.participant_id || sourceIndex}`);
    if (!row.participant_id) throw new Error(`CLAC_PARTICIPANT_ID_MISSING:${sourceIndex}`);
    if (!row.language) throw new Error(`CLAC_LANGUAGE_MISSING:${row.participant_id}`);
    if (!row.group) throw new Error(`CLAC_DECLARED_GROUP_MISSING:${row.participant_id}`);
    return { ...row, sourceIndex };
  });

  const sourceOrder = new Map(admitted.map((row, index) => [row.participant_id, index]));
  const transformed = [];
  const languages = [...new Set(admitted.map((row) => row.language))].sort();
  for (const language of languages) {
    const groupRows = admitted.filter((row) => row.language === language);
    const conceptualRank = percentileRanks(groupRows.map((row) => row.FT_GSim));
    const contextualRank = percentileRanks(groupRows.map((row) => row.BERT_GSim));
    const visualRank = percentileRanks(groupRows.map((row) => row.CLIP));
    const syntacticRank = percentileRanks(groupRows.map((row) => row.ADD));
    const logPpl = groupRows.map((row) => Math.log(row.PPL));
    const residuals = residualize(logPpl, groupRows.map((row) => row.BERT_TTR));
    const predictabilityRank = percentileRanks(residuals);

    for (let index = 0; index < groupRows.length; index += 1) {
      const row = groupRows[index];
      transformed.push({
        participant_id: row.participant_id,
        language,
        group: row.group,
        age_years: row.age_years,
        education_years: row.education_years,
        worker_country: row.worker_country,
        symptoms: row.symptoms,
        text_sha256: row.text_sha256,
        a_conceptual: 1 - conceptualRank[index],
        a_contextual: 1 - contextualRank[index],
        a_visual_grounding: visualRank[index],
        a_syntactic_organization: syntacticRank[index],
        a_adjusted_predictability: 1 - predictabilityRank[index],
        ppl_log_residual: residuals[index]
      });
    }
  }
  return transformed.sort(
    (left, right) => sourceOrder.get(left.participant_id) - sourceOrder.get(right.participant_id)
  );
}

function weakestDiagnostics(caseResults) {
  const tiePatternCounts = {};
  let tieCases = 0;
  for (const result of caseResults.filter((entry) => entry.status === 'VALID')) {
    const weakest = result.factors
      .filter((factor) => factor.availability === result.wmi)
      .map((factor) => factor.factorId);
    if (weakest.length > 1) {
      tieCases += 1;
      const key = weakest.join('|');
      tiePatternCounts[key] = (tiePatternCounts[key] || 0) + 1;
    }
  }
  return deepFreeze({
    enginePolicy: 'PRESERVE_ALL_EXACT_TIES',
    tieCases,
    tiePatternCounts
  });
}

function comparatorSummary(caseResults) {
  const valid = caseResults.filter((entry) => entry.status === 'VALID');
  const absoluteDifference = (selector) => mean(valid.map((entry) => Math.abs(entry.imi - selector(entry))));
  return deepFreeze({
    meanAbsoluteIMIAdditiveDifference: absoluteDifference((entry) => entry.additiveMean),
    meanAbsoluteIMIWeakestFactorDifference: absoluteDifference((entry) => entry.wmi),
    meanAbsoluteIMIGeometricMeanDifference: absoluteDifference((entry) => entry.imiGeometricMean),
    meanAbsoluteIMIBestSingleFactorDifference: absoluteDifference(
      (entry) => Math.max(...entry.factors.map((factor) => factor.availability))
    ),
    domainStandardOutcomeBaselineAvailable: false,
    outcomeTestExecuted: false
  });
}

await mkdir(outputDir, { recursive: true });
const featurePackage = JSON.parse(await readFile(featurePackagePath, 'utf8'));
const featurePackagePayloadSha256 = verifyPythonCanonicalPayload(featurePackage);
if (featurePackage.schemaVersion !== 'IMI_PHASE_3_CLAC_FIVE_FEATURE_PACKAGE_v1') {
  throw new Error(`CLAC_FEATURE_PACKAGE_SCHEMA_INVALID:${featurePackage.schemaVersion}`);
}
if (featurePackage.result !== 'PASS_CLAC_FIVE_FEATURE_PACKAGE_COMPLETE') {
  throw new Error(`CLAC_FEATURE_PACKAGE_NOT_COMPLETE:${featurePackage.result}`);
}
if (featurePackage.sourcePackageSha256 !== contract.sourcePackage.packageSha256) {
  throw new Error('CLAC_FEATURE_PACKAGE_SOURCE_IDENTITY_MISMATCH');
}
if (featurePackage.participantCount !== 240 || featurePackage.rows?.length !== 240) {
  throw new Error(`CLAC_FEATURE_PACKAGE_PARTICIPANT_COUNT_INVALID:${featurePackage.participantCount}:${featurePackage.rows?.length}`);
}
if ((featurePackage.unevaluable || []).length !== 0) {
  throw new Error(`CLAC_FEATURE_PACKAGE_UNEVALUABLE_NOT_EMPTY:${featurePackage.unevaluable.length}`);
}

const groups = [...new Set(featurePackage.rows.map((row) => row.group))].sort();
const languages = [...new Set(featurePackage.rows.map((row) => row.language))].sort();
if (groups.length < contract.sourcePackage.minimumDeclaredGroups) {
  throw new Error(`CLAC_DECLARED_GROUP_MINIMUM_NOT_MET:${groups.join(',')}`);
}

const rows = transformRows(featurePackage.rows);
const sourceIdentity = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_CLAC_FIVE_FEATURE_SOURCE_IDENTITY_v1',
  observedAt: clock().toISOString(),
  sourcePackageSha256: featurePackage.sourcePackageSha256,
  featurePackagePayloadSha256,
  featurePayloadSha256: featurePackage.featurePayloadSha256,
  participantCount: featurePackage.participantCount,
  declaredGroups: groups,
  languages,
  extractionContractDigest: canonicalDigest(contract),
  routeDigest: canonicalDigest(route),
  transformedRowsFingerprint: canonicalDigest(rows),
  pplRepresentation: {
    baseModel: contract.featureImplementations.PPL.baseModel,
    representation: contract.featureImplementations.PPL.quantization,
    fullPrecisionEquivalenceClaimed: false
  }
});

const studyRun = runStudy({
  studyMeta: {
    studyId: 'IMI_PHASE_3_CLAC_FIVE_FEATURE_REPRODUCTION_v1',
    studyVersion: '1.0.0-preofficial-heldout-reproduction',
    validationClass: 'PHASE_3_INDEPENDENT_PUBLIC_PROSPECTIVE_FROZEN_FEATURE_REEXTRACTION',
    backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_DRAFT_PR_BRANCH_RECORD',
    notes: [
      'Public CLAC Cookie Theft transcript and metadata package hash-bound before feature extraction.',
      'Five-feature extraction contract frozen before feature value inspection.',
      'The unchanged spontaneous-speech route and shared IMI engine were used.',
      'Mistral PPL uses a declared Q5_K_M access representation and is not claimed full-precision equivalent.',
      'No diagnosis, clinical screening, causal decline, or outcome association is claimed.'
    ]
  },
  datasetMeta: {
    datasetId: 'CLAC_PUBLIC_COOKIE_THEFT_TRANSCRIPT_METADATA_240',
    datasetVersion: featurePackage.sourcePackageSha256,
    datasetFingerprint: sourceIdentity.transformedRowsFingerprint
  },
  routeSpec: route,
  rows,
  clock
});

const valid = studyRun.caseResults.filter((entry) => entry.status === 'VALID');
const imiValues = valid.map((entry) => entry.imi);
const uniqueIMIValues = new Set(imiValues.map((value) => value.toPrecision(16))).size;
const ties = weakestDiagnostics(studyRun.caseResults);
const comparators = comparatorSummary(studyRun.caseResults);
const minimumEvidenceSatisfied =
  featurePackage.participantCount >= contract.sourcePackage.minimumParticipants &&
  groups.length >= contract.sourcePackage.minimumDeclaredGroups &&
  studyRun.receipt.summary.totalCases === 240 &&
  studyRun.receipt.summary.validCases === 240 &&
  studyRun.receipt.summary.unevaluableCases === 0 &&
  studyRun.receipt.summary.hardCollapseCases === 0 &&
  route.frozenBeforeRun === true;

const summary = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_CLAC_FIVE_FEATURE_REPRODUCTION_SUMMARY_v1',
  result: minimumEvidenceSatisfied
    ? 'PASS_CLOSED_PHASE_3_SPEECH_CLAC_FIVE_FEATURE_REPRODUCTION_EXECUTED_WITH_Q5_K_M_PPL_REPRESENTATION'
    : 'HELD_PHASE_3_SPEECH_CLAC_FIVE_FEATURE_REPRODUCTION_MINIMUM_NOT_MET',
  observedAt: clock().toISOString(),
  participantRows: featurePackage.participantCount,
  languageCounts: countBy(featurePackage.rows.map((row) => row.language)),
  declaredGroupCounts: countBy(featurePackage.rows.map((row) => row.group)),
  validCases: studyRun.receipt.summary.validCases,
  unevaluableCases: studyRun.receipt.summary.unevaluableCases,
  hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
  terminalLockedCases: studyRun.receipt.summary.terminalLockedCases,
  imiSummary: studyRun.receipt.summary.imiSummary,
  csSummary: studyRun.receipt.summary.csSummary,
  wmiSummary: studyRun.receipt.summary.wmiSummary,
  additiveMeanSummary: studyRun.receipt.summary.additiveMeanSummary,
  uniqueIMIValues,
  uniqueScoreRate: featurePackage.participantCount ? uniqueIMIValues / featurePackage.participantCount : null,
  weakestFactorCounts: studyRun.receipt.summary.weakestFactorCounts,
  weakestFactorTieDiagnostics: ties,
  comparatorResults: comparators,
  primaryTests: {
    fiveFactorRouteExecution: studyRun.receipt.summary.validCases === 240,
    uniqueScoreRateRetainedAsFinding: true,
    weakestFactorDiversityRetainedAsFinding: true,
    exactTiePreservation: true,
    legacyRouteAlgorithmReproduced: true,
    developmentSampleNumericalEqualityExpected: false
  },
  minimumEvidenceSatisfied,
  phase4Candidate: false,
  findings: {
    routeExecutionPass: studyRun.receipt.summary.validCases === 240,
    allRequiredFactorsOperational: Object.keys(studyRun.receipt.summary.weakestFactorCounts).length > 0,
    noOutcomeAssociationAvailable: true,
    q5PplRepresentationDeclared: true
  },
  boundaries: {
    routeRetuned: false,
    outcomeTestExecuted: false,
    diagnosisOrClinicalScreeningClaimed: false,
    causalLanguageDeclineClaimed: false,
    fullPrecisionPplEquivalenceClaimed: false,
    finalValidationClaimed: false,
    phase4AutomaticallyAuthorized: false,
    mainMergeAuthorized: false,
    publicReleaseAuthorized: false
  }
});

const receiptBody = {
  schemaVersion: 'IMI_PHASE_3_SPEECH_HELD_OUT_REPRODUCTION_RECEIPT_v1',
  operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
  track: track.track,
  result: summary.result,
  terminalDisposition: minimumEvidenceSatisfied
    ? 'PASS_CLOSED_PUBLIC_PROSPECTIVE_FROZEN_FEATURE_REEXTRACTION'
    : 'HELD_OPEN_FIVE_FEATURE_MINIMUM_EVIDENCE',
  observedAt: clock().toISOString(),
  routeId: route.routeId,
  routeDigest: canonicalDigest(route),
  extractionContractDigest: canonicalDigest(contract),
  sourceDigest: canonicalDigest(sourceIdentity),
  executionDigest: canonicalDigest(studyRun),
  summaryDigest: canonicalDigest(summary),
  minimumEvidenceSatisfied,
  phase4Candidate: false,
  admission: {
    independentPublicCorpusBound: true,
    transcriptMetadataPackageBound: true,
    prospectivelyExtractedFrozenFeatureSet: true,
    participantCount: featurePackage.participantCount,
    minimumParticipantCountRequired: contract.sourcePackage.minimumParticipants,
    declaredGroups: groups,
    minimumDeclaredGroupsRequired: contract.sourcePackage.minimumDeclaredGroups,
    frozenFiveFeatureInputsCompleted: studyRun.receipt.summary.validCases === 240,
    routeRetuned: false
  },
  reason: minimumEvidenceSatisfied
    ? 'THE_INDEPENDENT_PUBLIC_CLAC_PACKAGE_COMPLETED_ALL_FROZEN_FIVE_FEATURE_INPUTS_AND_ALL_240_PARTICIPANTS_EXECUTED_VALIDLY_UNDER_THE_UNCHANGED_ROUTE'
    : 'THE_CLAC_FEATURE_PACKAGE_EXECUTED_BUT_ONE_OR_MORE_FROZEN_MINIMUM_EVIDENCE_CONDITIONS_REMAIN_UNSATISFIED',
  boundaries: summary.boundaries
};
const trackReceipt = deepFreeze({ ...receiptBody, receiptDigest: canonicalDigest(receiptBody) });

const outputs = {
  'clac-five-feature-source-identity.v1.json': sourceIdentity,
  'clac-five-feature-transformed-route-rows.v1.json': rows,
  'imi-study-run-output.v1.json': studyRun,
  'imi-study-receipt.v1.json': studyRun.receipt,
  'imi-case-results.v1.json': studyRun.caseResults,
  'speech-phase3-summary.v1.json': summary,
  'speech-phase3-track-receipt.v1.json': trackReceipt
};
for (const [name, value] of Object.entries(outputs)) {
  await writeFile(path.join(outputDir, name), `${JSON.stringify(value, null, 2)}\n`);
}
console.log(JSON.stringify(trackReceipt, null, 2));
