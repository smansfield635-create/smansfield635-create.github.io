// TNT — /world/completion_engine.js
// PURPOSE: progression, unlocks, mastery, and completeness receipts
// AUTHORITY:
// - reads planet field + runtime audits
// - does not generate world truth
// - does not define render truth
// - does not mutate kernel truth

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function ratio(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : 0;
}

function countTruthyValues(objectValue) {
  const source = normalizeObject(objectValue);
  return Object.values(source).reduce((total, value) => total + (value === true ? 1 : 0), 0);
}

function totalKeys(objectValue) {
  return Object.keys(normalizeObject(objectValue)).length;
}

function computeCompletenessPass(planetField) {
  const completeness = normalizeObject(planetField?.completeness);
  const total = totalKeys(completeness);
  const complete = countTruthyValues(completeness);

  return Object.freeze({
    total,
    complete,
    ratio: ratio(complete, total),
    pass: total > 0 && complete === total
  });
}

function computeSummaryIntegrity(planetField) {
  const summary = normalizeObject(planetField?.summary);

  const checks = Object.freeze({
    sampleCount: isFiniteNumber(summary.sampleCount) && summary.sampleCount > 0,
    landCount: isFiniteNumber(summary.landCount) && summary.landCount >= 0,
    waterCount: isFiniteNumber(summary.waterCount) && summary.waterCount >= 0,
    continentCount: isFiniteNumber(summary.continentCount) && summary.continentCount >= 0,
    elevationMin: isFiniteNumber(summary.elevationMin),
    elevationMax: isFiniteNumber(summary.elevationMax),
    topologyVariance: isFiniteNumber(summary.topologyVariance),
    temperatureAverage: isFiniteNumber(summary.temperatureAverage),
    rainfallAverage: isFiniteNumber(summary.rainfallAverage),
    seasonalTemperatureAverage: isFiniteNumber(summary.seasonalTemperatureAverage),
    seasonalMoistureAverage: isFiniteNumber(summary.seasonalMoistureAverage),
    seasonCoverage: totalKeys(summary.seasonCoverage) > 0,
    climateBandCoverage: totalKeys(summary.climateBandCoverage) > 0
  });

  const total = totalKeys(checks);
  const complete = countTruthyValues(checks);

  return Object.freeze({
    checks,
    total,
    complete,
    ratio: ratio(complete, total),
    pass: total > 0 && complete === total
  });
}

function computeCoverageIntegrity(planetField) {
  const summary = normalizeObject(planetField?.summary);
  const seasonCoverage = normalizeObject(summary.seasonCoverage);
  const climateBandCoverage = normalizeObject(summary.climateBandCoverage);

  const seasonTotal = totalKeys(seasonCoverage);
  const seasonComplete = countTruthyValues(seasonCoverage);

  const climateTotal = totalKeys(climateBandCoverage);
  const climateComplete = countTruthyValues(climateBandCoverage);

  return Object.freeze({
    seasons: Object.freeze({
      total: seasonTotal,
      complete: seasonComplete,
      ratio: ratio(seasonComplete, seasonTotal),
      pass: seasonTotal > 0 && seasonComplete === seasonTotal
    }),
    climateBands: Object.freeze({
      total: climateTotal,
      complete: climateComplete,
      ratio: ratio(climateComplete, climateTotal),
      pass: climateTotal > 0 && climateComplete === climateTotal
    })
  });
}

function computeWorldMaturity(planetField) {
  const summary = normalizeObject(planetField?.summary);

  const continentCount = isFiniteNumber(summary.continentCount) ? summary.continentCount : 0;
  const mountainRegionCount = isFiniteNumber(summary.mountainRegionCount) ? summary.mountainRegionCount : 0;
  const basinRegionCount = isFiniteNumber(summary.basinRegionCount) ? summary.basinRegionCount : 0;
  const topologyVariance = isFiniteNumber(summary.topologyVariance) ? summary.topologyVariance : 0;
  const seasonalCoverage = normalizeObject(summary.seasonCoverage);
  const climateCoverage = normalizeObject(summary.climateBandCoverage);

  const continentScore = clamp(continentCount / 9, 0, 1);
  const mountainScore = clamp(mountainRegionCount / 7, 0, 1);
  const basinScore = clamp(basinRegionCount / 7, 0, 1);
  const topologyScore = clamp(topologyVariance / 0.95, 0, 1);
  const seasonScore = ratio(countTruthyValues(seasonalCoverage), Math.max(1, totalKeys(seasonalCoverage)));
  const climateScore = ratio(countTruthyValues(climateCoverage), Math.max(1, totalKeys(climateCoverage)));

  const maturity =
    (continentScore * 0.22) +
    (mountainScore * 0.16) +
    (basinScore * 0.14) +
    (topologyScore * 0.16) +
    (seasonScore * 0.16) +
    (climateScore * 0.16);

  return Object.freeze({
    continentScore,
    mountainScore,
    basinScore,
    topologyScore,
    seasonScore,
    climateScore,
    ratio: clamp(maturity, 0, 1)
  });
}

function computeConfusionLoad(runtime) {
  const planetField = normalizeObject(runtime?.planetField);
  const samples = normalizeArray(planetField.samples);

  let confusion = 0;

  for (const row of samples) {
    for (const sample of normalizeArray(row)) {
      const flags = normalizeArray(sample?.eventFlags);
      if (flags.includes("CONFUSION")) {
        confusion += 1;
      }
    }
  }

  return confusion;
}

function computeRenderReadiness(runtime) {
  const renderAudit = normalizeObject(runtime?.renderAudit ?? runtime?.render?.audit ?? runtime?.audit);
  const orbitalAudit = normalizeObject(runtime?.orbitalAudit);

  const checks = Object.freeze({
    renderAuditPresent: totalKeys(renderAudit) > 0,
    sampleCountReadable: isFiniteNumber(renderAudit.sampleCount),
    landReadable: isFiniteNumber(renderAudit.landFamilyCount),
    waterReadable: isFiniteNumber(renderAudit.waterFamilyCount),
    shorelineReadable: isFiniteNumber(renderAudit.shorelineCount),
    orbitalReadable: totalKeys(orbitalAudit) > 0
      ? isFiniteNumber(orbitalAudit.count) && isFiniteNumber(orbitalAudit.frontVisibleCount)
      : true
  });

  const total = totalKeys(checks);
  const complete = countTruthyValues(checks);

  return Object.freeze({
    checks,
    total,
    complete,
    ratio: ratio(complete, total),
    pass: total > 0 && complete === total
  });
}

function computeSummitCompletion(runtime) {
  const planetField = normalizeObject(runtime?.planetField);
  const summary = normalizeObject(planetField.summary);

  const completenessPass = computeCompletenessPass(planetField);
  const coverage = computeCoverageIntegrity(planetField);
  const maturity = computeWorldMaturity(planetField);

  const landCount = isFiniteNumber(summary.landCount) ? summary.landCount : 0;
  const mountainCount = isFiniteNumber(summary.mountainCount) ? summary.mountainCount : 0;
  const basinCount = isFiniteNumber(summary.basinCount) ? summary.basinCount : 0;
  const shorelineCount = isFiniteNumber(summary.shorelineCount) ? summary.shorelineCount : 0;
  const glacialCount = isFiniteNumber(summary.glacialRegionCount) ? summary.glacialRegionCount : 0;

  const landPresence = clamp(landCount / 12000, 0, 1);
  const mountainPresence = clamp(mountainCount / 1800, 0, 1);
  const basinPresence = clamp(basinCount / 1400, 0, 1);
  const shorelinePresence = clamp(shorelineCount / 2600, 0, 1);
  const cryospherePresence = clamp(glacialCount / 600, 0, 1);

  const value =
    (completenessPass.ratio * 0.20) +
    (maturity.ratio * 0.28) +
    (coverage.seasons.ratio * 0.12) +
    (coverage.climateBands.ratio * 0.12) +
    (landPresence * 0.08) +
    (mountainPresence * 0.07) +
    (basinPresence * 0.05) +
    (shorelinePresence * 0.05) +
    (cryospherePresence * 0.03);

  return clamp(value, 0, 1);
}

function buildProgress(runtime) {
  const planetField = normalizeObject(runtime?.planetField);
  const completenessPass = computeCompletenessPass(planetField);
  const summaryIntegrity = computeSummaryIntegrity(planetField);
  const coverageIntegrity = computeCoverageIntegrity(planetField);
  const renderReadiness = computeRenderReadiness(runtime);
  const summitCompletion = computeSummitCompletion(runtime);
  const confusionLoad = computeConfusionLoad(runtime);

  const masteryPass =
    summitCompletion >= 0.92 &&
    confusionLoad === 0 &&
    completenessPass.pass &&
    summaryIntegrity.pass &&
    coverageIntegrity.seasons.pass &&
    coverageIntegrity.climateBands.pass &&
    renderReadiness.pass;

  return Object.freeze({
    summitCompletion,
    confusionLoad,
    completenessRatio: completenessPass.ratio,
    summaryIntegrityRatio: summaryIntegrity.ratio,
    seasonalCoverageRatio: coverageIntegrity.seasons.ratio,
    climateCoverageRatio: coverageIntegrity.climateBands.ratio,
    renderReadinessRatio: renderReadiness.ratio,
    masteryPass
  });
}

function buildUnlocks(runtime, progress) {
  const planetField = normalizeObject(runtime?.planetField);
  const summary = normalizeObject(planetField.summary);
  const continentCount = isFiniteNumber(summary.continentCount) ? summary.continentCount : 0;
  const seasonCoverage = normalizeObject(summary.seasonCoverage);
  const climateCoverage = normalizeObject(summary.climateBandCoverage);

  const seasonsSeen = countTruthyValues(seasonCoverage);
  const climatesSeen = countTruthyValues(climateCoverage);

  return Object.freeze({
    underground: progress.summitCompletion >= 0.45,
    north: progress.summitCompletion >= 0.92 && progress.confusionLoad === 0,
    south: progress.summitCompletion >= 0.92 && progress.confusionLoad < 50,
    continents: continentCount >= 9,
    seasons: seasonsSeen >= 4,
    climates: climatesSeen >= 5,
    renderReady: progress.renderReadinessRatio >= 1
  });
}

function buildCompletionReceipt(runtime) {
  const planetField = normalizeObject(runtime?.planetField);

  const completenessPass = computeCompletenessPass(planetField);
  const summaryIntegrity = computeSummaryIntegrity(planetField);
  const coverageIntegrity = computeCoverageIntegrity(planetField);
  const renderReadiness = computeRenderReadiness(runtime);
  const progress = buildProgress(runtime);
  const unlocks = buildUnlocks(runtime, progress);

  return Object.freeze({
    completeness: completenessPass,
    summaryIntegrity,
    coverageIntegrity,
    renderReadiness,
    progress,
    unlocks,
    pass:
      completenessPass.pass &&
      summaryIntegrity.pass &&
      coverageIntegrity.seasons.pass &&
      coverageIntegrity.climateBands.pass
  });
}

export function createCompletionEngine() {
  function update(runtime) {
    const target = normalizeObject(runtime);
    const receipt = buildCompletionReceipt(target);

    target.progress = receipt.progress;
    target.unlocks = receipt.unlocks;
    target.completion = receipt;

    return target;
  }

  return Object.freeze({
    update
  });
}
