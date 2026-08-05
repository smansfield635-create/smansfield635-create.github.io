import { canonicalDigest, deepFreeze, nowIso, stableStringify } from '../instrument-platform/platform-core.mjs';

export const IMI_EMPIRICAL_ENGINE_META = deepFreeze({
  schemaVersion: 'IMI_CORE_AND_EMPIRICAL_PORTFOLIO_ENGINE_v1',
  version: '1.0.0-preofficial',
  artifact: 'h-earth-3d/tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs',
  class: 'EMPIRICAL_INTRINSIC_MANEUVERABILITY_INDEX_ROUTE_SCORING_AND_PORTFOLIO_RECEIPT_ENGINE',
  official: false,
  source: 'PROMOTED_FROM_SANDBOX_SCRATCH_PROTOTYPE_WITH_ACTIVE_TOOLBASE_COMPATIBILITY_REWRITE',
  boundaries: { productMutationPerformed: false, routeCertificationPerformed: false, empiricalValidationClaimed: false, publicReleaseAuthorized: false }
});

export const DEFAULT_IMI_ORDINAL_SCALE = deepFreeze({
  scaleId: 'IMI_EXPLORATORY_EQUAL_WIDTH_0_6_WITH_IMI7_TERMINAL_ONLY_v1',
  status: 'EXPLORATORY_SCALE_SCAFFOLD_NOT_FINAL_CANONICAL_SCALE',
  rule: 'IMI-7 requires affirmative terminalLock=true; otherwise levels IMI-0 through IMI-6 are assigned from CS=1-IMI by equal-width exploratory bands.',
  levels: [
    { level: 'IMI-0', minCS: 0, maxCS: 1 / 7, upperInclusive: false, label: 'full_or_near_full_maneuverability' },
    { level: 'IMI-1', minCS: 1 / 7, maxCS: 2 / 7, upperInclusive: false, label: 'minimal_constraint' },
    { level: 'IMI-2', minCS: 2 / 7, maxCS: 3 / 7, upperInclusive: false, label: 'mild_constraint' },
    { level: 'IMI-3', minCS: 3 / 7, maxCS: 4 / 7, upperInclusive: false, label: 'moderate_constraint' },
    { level: 'IMI-4', minCS: 4 / 7, maxCS: 5 / 7, upperInclusive: false, label: 'high_constraint' },
    { level: 'IMI-5', minCS: 5 / 7, maxCS: 6 / 7, upperInclusive: false, label: 'severe_constraint' },
    { level: 'IMI-6', minCS: 6 / 7, maxCS: 1, upperInclusive: true, label: 'critical_nonterminal_constraint' },
    { level: 'IMI-7', terminalOnly: true, label: 'terminal_or_locked_trajectory' }
  ]
});

const finiteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const field = (row, key) => (Object.prototype.hasOwnProperty.call(row, key) ? row[key] : undefined);
const product = (values) => values.reduce((acc, value) => acc * value, 1);
const mean = (values) => (values.length ? values.reduce((acc, value) => acc + value, 0) / values.length : null);

export function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number(value.trim().replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function clamp01(value) {
  if (!finiteNumber(value)) return null;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function rankAverage(values) {
  const indexed = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const ranks = new Array(values.length);
  let i = 0;
  while (i < indexed.length) {
    let j = i + 1;
    while (j < indexed.length && indexed[j].value === indexed[i].value) j += 1;
    const avg = (i + 1 + j) / 2;
    for (let k = i; k < j; k += 1) ranks[indexed[k].index] = avg;
    i = j;
  }
  return ranks;
}

export function pearson(xs, ys) {
  if (!Array.isArray(xs) || !Array.isArray(ys) || xs.length !== ys.length || xs.length < 2) return null;
  const mx = mean(xs);
  const my = mean(ys);
  let numerator = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i += 1) {
    const x = xs[i] - mx;
    const y = ys[i] - my;
    numerator += x * y;
    dx += x * x;
    dy += y * y;
  }
  if (dx === 0 || dy === 0) return null;
  return numerator / Math.sqrt(dx * dy);
}

export function spearman(xs, ys) {
  if (!Array.isArray(xs) || !Array.isArray(ys) || xs.length !== ys.length || xs.length < 2) return null;
  return pearson(rankAverage(xs), rankAverage(ys));
}

export function validateRouteSpec(routeSpec) {
  const errors = [];
  if (!routeSpec || typeof routeSpec !== 'object') errors.push('ROUTE_SPEC_MISSING');
  if (routeSpec && typeof routeSpec === 'object') {
    if (!routeSpec.routeId) errors.push('ROUTE_ID_MISSING');
    if (!routeSpec.routeVersion) errors.push('ROUTE_VERSION_MISSING');
    if (!routeSpec.domain) errors.push('DOMAIN_MISSING');
    if (!Array.isArray(routeSpec.requiredFactors) || routeSpec.requiredFactors.length === 0) errors.push('REQUIRED_FACTORS_MISSING');
    const ids = new Set();
    for (const factor of routeSpec.requiredFactors || []) {
      if (!factor.factorId) errors.push('FACTOR_ID_MISSING');
      if (factor.factorId && ids.has(factor.factorId)) errors.push(`DUPLICATE_FACTOR_ID:${factor.factorId}`);
      ids.add(factor.factorId);
      if (!factor.normalizer || !factor.normalizer.type) errors.push(`NORMALIZER_MISSING:${factor.factorId || 'UNKNOWN'}`);
    }
  }
  return deepFreeze({ pass: errors.length === 0, errors });
}

export function evaluateNormalizer(row, factor) {
  const normalizer = factor.normalizer || {};
  let availability = null;
  if (normalizer.type === 'direct_availability') {
    availability = clamp01(toNumber(field(row, normalizer.field)));
  } else if (normalizer.type === 'direct_constraint') {
    const constraint = clamp01(toNumber(field(row, normalizer.field)));
    availability = constraint === null ? null : 1 - constraint;
  } else if (normalizer.type === 'availability_from_worse_reported') {
    const worse = toNumber(field(row, normalizer.worseField));
    const reported = toNumber(field(row, normalizer.reportedField));
    availability = reported === null || reported <= 0 || worse === null ? null : clamp01(1 - worse / reported);
  } else if (normalizer.type === 'availability_from_bad_total') {
    const bad = toNumber(field(row, normalizer.badField));
    const total = toNumber(field(row, normalizer.totalField));
    availability = total === null || total <= 0 || bad === null ? null : clamp01(1 - bad / total);
  } else if (normalizer.type === 'availability_ratio') {
    const numerator = toNumber(field(row, normalizer.numeratorField));
    const denominator = toNumber(field(row, normalizer.denominatorField));
    availability = denominator === null || denominator <= 0 || numerator === null ? null : clamp01(numerator / denominator);
  } else if (normalizer.type === 'inverse_ratio_constraint') {
    const numerator = toNumber(field(row, normalizer.numeratorField));
    const denominator = toNumber(field(row, normalizer.denominatorField));
    availability = denominator === null || denominator <= 0 || numerator === null ? null : clamp01(1 - numerator / denominator);
  } else {
    return deepFreeze({ factorId: factor.factorId, label: factor.label || factor.factorId, status: 'UNEVALUABLE', reason: 'UNKNOWN_NORMALIZER_TYPE', availability: null });
  }
  if (availability === null) return deepFreeze({ factorId: factor.factorId, label: factor.label || factor.factorId, status: 'UNEVALUABLE', reason: 'MISSING_OR_INVALID_REQUIRED_FACTOR', availability: null });
  return deepFreeze({ factorId: factor.factorId, label: factor.label || factor.factorId, status: 'VALID', reason: null, availability });
}

function terminalLocked(row, routeSpec) {
  const lock = routeSpec.terminalLock || { type: 'none' };
  if (!lock || lock.type === 'none' || lock.type === undefined) return false;
  if (lock.type === 'boolean_field_true') {
    const value = field(row, lock.field);
    return value === true || value === 1 || value === 'true' || value === '1';
  }
  if (lock.type === 'field_equals') return field(row, lock.field) === lock.value;
  return false;
}

export function assignOrdinalLevel(imi, cs, isTerminalLocked, ordinalScale = DEFAULT_IMI_ORDINAL_SCALE) {
  if (isTerminalLocked) return 'IMI-7';
  for (const level of ordinalScale.levels || DEFAULT_IMI_ORDINAL_SCALE.levels) {
    if (level.terminalOnly) continue;
    const lowerOk = cs >= level.minCS;
    const upperOk = level.upperInclusive ? cs <= level.maxCS : cs < level.maxCS;
    if (lowerOk && upperOk) return level.level;
  }
  return 'IMI-UNCLASSIFIED';
}

export function evaluateCase(row, routeSpec, caseIndex = 0) {
  const caseId = field(row, routeSpec.caseIdField || 'id') ?? String(caseIndex + 1);
  const factors = routeSpec.requiredFactors.map((factor) => evaluateNormalizer(row, factor));
  const invalid = factors.filter((factor) => factor.status !== 'VALID');
  if (invalid.length > 0) return deepFreeze({ caseId, status: 'UNEVALUABLE', reason: 'MISSING_REQUIRED_FACTOR', factors, imi: null, imiGeometricMean: null, cs: null, wmi: null, additiveMean: null, hardCollapse: false, terminalLocked: false, ordinalLevel: 'UNEVALUABLE' });
  const availabilities = factors.map((factor) => factor.availability);
  const imi = product(availabilities);
  const cs = 1 - imi;
  const wmi = Math.min(...availabilities);
  const lock = terminalLocked(row, routeSpec);
  return deepFreeze({ caseId, status: 'VALID', reason: null, factors, imi, imiGeometricMean: Math.pow(imi, 1 / availabilities.length), cs, wmi, additiveMean: mean(availabilities), hardCollapse: availabilities.some((value) => value === 0), terminalLocked: lock, ordinalLevel: assignOrdinalLevel(imi, cs, lock, routeSpec.ordinalScale) });
}

function countBy(values) {
  const counts = {};
  for (const value of values) counts[value] = (counts[value] || 0) + 1;
  return counts;
}

function numericSummary(values) {
  const clean = values.filter(finiteNumber).sort((a, b) => a - b);
  if (clean.length === 0) return null;
  const quantile = (p) => {
    const pos = (clean.length - 1) * p;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return lo === hi ? clean[lo] : clean[lo] + (clean[hi] - clean[lo]) * (pos - lo);
  };
  return deepFreeze({ n: clean.length, min: clean[0], q1: quantile(0.25), median: quantile(0.5), q3: quantile(0.75), max: clean[clean.length - 1], mean: mean(clean) });
}

export function buildStudySummary(caseResults, rows, routeSpec) {
  const valid = caseResults.filter((result) => result.status === 'VALID');
  const outcomeComparators = {};
  for (const outcomeField of routeSpec.outcomeFields || []) {
    const imi = [], additive = [], wmi = [], outcome = [];
    for (let i = 0; i < caseResults.length; i += 1) {
      const result = caseResults[i];
      const value = toNumber(field(rows[i], outcomeField));
      if (result.status === 'VALID' && value !== null) { imi.push(result.imi); additive.push(result.additiveMean); wmi.push(result.wmi); outcome.push(value); }
    }
    outcomeComparators[outcomeField] = deepFreeze({ pairedN: outcome.length, spearmanIMI: spearman(imi, outcome), spearmanAdditiveMean: spearman(additive, outcome), spearmanWMI: spearman(wmi, outcome) });
  }
  const weakestFactorCounts = {};
  for (const result of valid) {
    const weakest = result.factors.filter((factor) => factor.availability === result.wmi).map((factor) => factor.factorId);
    const key = weakest.length === 1 ? weakest[0] : `TIE:${weakest.join('|')}`;
    weakestFactorCounts[key] = (weakestFactorCounts[key] || 0) + 1;
  }
  return deepFreeze({ totalCases: caseResults.length, validCases: valid.length, unevaluableCases: caseResults.length - valid.length, validPercent: caseResults.length ? valid.length / caseResults.length : null, unevaluablePercent: caseResults.length ? (caseResults.length - valid.length) / caseResults.length : null, hardCollapseCases: valid.filter((result) => result.hardCollapse).length, terminalLockedCases: valid.filter((result) => result.terminalLocked).length, ordinalDistribution: countBy(caseResults.map((result) => result.ordinalLevel)), imiSummary: numericSummary(valid.map((result) => result.imi)), csSummary: numericSummary(valid.map((result) => result.cs)), wmiSummary: numericSummary(valid.map((result) => result.wmi)), additiveMeanSummary: numericSummary(valid.map((result) => result.additiveMean)), weakestFactorCounts, outcomeComparators });
}

export function runStudy({ studyMeta = {}, datasetMeta = {}, routeSpec, rows, clock } = {}) {
  const routeValidation = validateRouteSpec(routeSpec);
  if (!routeValidation.pass) throw new Error(`ROUTE_SPEC_INVALID:${routeValidation.errors.join(',')}`);
  if (!Array.isArray(rows)) throw new Error('ROWS_MUST_BE_ARRAY');
  const caseResults = rows.map((row, index) => evaluateCase(row, routeSpec, index));
  const summary = buildStudySummary(caseResults, rows, routeSpec);
  const receipt = deepFreeze({ schemaVersion: 'IMI_STUDY_RECEIPT_v1', engine: IMI_EMPIRICAL_ENGINE_META, studyMeta: { studyId: studyMeta.studyId || 'UNSPECIFIED_STUDY', studyVersion: studyMeta.studyVersion || '0.0.0', validationClass: studyMeta.validationClass || 'EXPLORATORY_UNFROZEN', backupStatus: studyMeta.backupStatus || 'NOT_VERIFIED', notes: studyMeta.notes || [] }, datasetMeta: { datasetId: datasetMeta.datasetId || 'UNSPECIFIED_DATASET', datasetVersion: datasetMeta.datasetVersion || 'UNSPECIFIED', datasetFingerprint: datasetMeta.datasetFingerprint || canonicalDigest(rows) }, routeIdentity: { routeId: routeSpec.routeId, routeVersion: routeSpec.routeVersion, domain: routeSpec.domain, routeFingerprint: canonicalDigest(routeSpec), frozenBeforeRun: routeSpec.frozenBeforeRun === true }, formulas: { imi: 'IMI_tau(t)=prod_{i in R_tau} a_i(t)', constraintSeverity: 'CS_tau(t)=1-IMI_tau(t)', weakestFactor: 'WMI_tau(t)=min_{i in R_tau} a_i(t)', geometricMeanComparator: 'IMI*_tau(t)=IMI_tau(t)^(1/|R_tau|)' }, summary, caseResultCount: caseResults.length, generatedAt: nowIso(clock), limitations: routeSpec.limitations || [], nextValidationStep: routeSpec.nextValidationStep || 'NOT_SPECIFIED' });
  return deepFreeze({ schemaVersion: 'IMI_STUDY_RUN_OUTPUT_v1', receiptFingerprint: canonicalDigest(receipt), receipt, caseResults });
}

export function createPortfolio(portfolioMeta = {}) {
  return deepFreeze({ schemaVersion: 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_v1', version: '1.0.0-preofficial', portfolioMeta: { portfolioId: portfolioMeta.portfolioId || 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_v1', owner: portfolioMeta.owner || 'UNSPECIFIED', createdAt: portfolioMeta.createdAt || nowIso(portfolioMeta.clock) }, studies: [] });
}

export function addStudyToPortfolio(portfolio, studyRunOutput) {
  if (!portfolio || portfolio.schemaVersion !== 'IMI_EMPIRICAL_PORTFOLIO_REGISTRY_v1') throw new Error('PORTFOLIO_INVALID');
  if (!studyRunOutput || studyRunOutput.schemaVersion !== 'IMI_STUDY_RUN_OUTPUT_v1') throw new Error('STUDY_RUN_OUTPUT_INVALID');
  const entry = deepFreeze({ studyId: studyRunOutput.receipt.studyMeta.studyId, studyVersion: studyRunOutput.receipt.studyMeta.studyVersion, domain: studyRunOutput.receipt.routeIdentity.domain, routeId: studyRunOutput.receipt.routeIdentity.routeId, routeVersion: studyRunOutput.receipt.routeIdentity.routeVersion, datasetId: studyRunOutput.receipt.datasetMeta.datasetId, validationClass: studyRunOutput.receipt.studyMeta.validationClass, receiptFingerprint: studyRunOutput.receiptFingerprint, generatedAt: studyRunOutput.receipt.generatedAt, totalCases: studyRunOutput.receipt.summary.totalCases, validCases: studyRunOutput.receipt.summary.validCases, unevaluableCases: studyRunOutput.receipt.summary.unevaluableCases, hardCollapseCases: studyRunOutput.receipt.summary.hardCollapseCases, routeFingerprint: studyRunOutput.receipt.routeIdentity.routeFingerprint, datasetFingerprint: studyRunOutput.receipt.datasetMeta.datasetFingerprint, backupStatus: studyRunOutput.receipt.studyMeta.backupStatus });
  return deepFreeze({ schemaVersion: portfolio.schemaVersion, version: portfolio.version, portfolioMeta: portfolio.portfolioMeta, studies: portfolio.studies.concat([entry]) });
}

export function portfolioSummary(portfolio) {
  return deepFreeze({ studyCount: portfolio.studies.length, domains: countBy(portfolio.studies.map((study) => study.domain)), validationClasses: countBy(portfolio.studies.map((study) => study.validationClass)), totalCasesAcrossStudies: portfolio.studies.reduce((acc, study) => acc + (study.totalCases || 0), 0), validCasesAcrossStudies: portfolio.studies.reduce((acc, study) => acc + (study.validCases || 0), 0), unevaluableCasesAcrossStudies: portfolio.studies.reduce((acc, study) => acc + (study.unevaluableCases || 0), 0), hardCollapseCasesAcrossStudies: portfolio.studies.reduce((acc, study) => acc + (study.hardCollapseCases || 0), 0) });
}

export const IMI_EMPIRICAL_PLATFORM_API = deepFreeze({ meta: IMI_EMPIRICAL_ENGINE_META, defaultOrdinalScale: DEFAULT_IMI_ORDINAL_SCALE, validateRouteSpec, evaluateNormalizer, evaluateCase, buildStudySummary, runStudy, createPortfolio, addStudyToPortfolio, portfolioSummary, stableStringify, canonicalDigest });
if (typeof globalThis !== 'undefined') globalThis.IMI_EMPIRICAL_PLATFORM_API = IMI_EMPIRICAL_PLATFORM_API;
export default IMI_EMPIRICAL_PLATFORM_API;
