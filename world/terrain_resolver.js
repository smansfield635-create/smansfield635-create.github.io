import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function continentProfileByTier(tier) {
  return WORLD_KERNEL.continents.find((entry) => entry.tier === tier) ?? WORLD_KERNEL.continents[0];
}

function waterFamily(sample) {
  return sample?.waterMask === 1 ||
    sample?.terrainClass === "WATER" ||
    sample?.terrainClass === "SHELF";
}

function cryosphere(sample) {
  return sample?.terrainClass === "POLAR_ICE" ||
    sample?.terrainClass === "GLACIAL_HIGHLAND" ||
    sample?.biomeType === "GLACIER" ||
    sample?.surfaceMaterial === "ICE" ||
    sample?.surfaceMaterial === "SNOW";
}

function terrainBand(sample) {
  if (waterFamily(sample)) return "WATER";
  if (sample?.terrainClass === "BEACH" || sample?.terrainClass === "SHORELINE") return "COAST";
  if (sample?.terrainClass === "SUMMIT" || sample?.terrainClass === "MOUNTAIN") return "PEAK";
  if (sample?.terrainClass === "RIDGE" || sample?.terrainClass === "PLATEAU") return "UPLAND";
  if (sample?.terrainClass === "BASIN" || sample?.terrainClass === "CANYON") return "BASIN";
  return "LAND";
}

function difficultyClass(sample, profile) {
  const score =
    (sample?.traversalDifficulty ?? profile.traversalDifficulty) * 0.55 +
    (sample?.slopeSeverity ?? 0) * 0.30 +
    (1 - (sample?.habitability ?? profile.habitabilityFraction)) * 0.15;

  if (score >= 0.86) return "EXTREME";
  if (score >= 0.68) return "SEVERE";
  if (score >= 0.48) return "HIGH";
  if (score >= 0.30) return "MODERATE";
  return "LOW";
}

function reliefClass(sample, profile) {
  const elevation = Math.max(0, sample?.elevation ?? 0);
  const score = elevation * 0.58 + profile.reliefAmp * 0.42;

  if (score >= 0.84) return "SPIRE";
  if (score >= 0.66) return "MASSIF";
  if (score >= 0.46) return "RIDGED";
  if (score >= 0.24) return "WORN";
  return "OPEN";
}

export function resolveTerrain(sample) {
  const profile = sample?.continentTier
    ? continentProfileByTier(sample.continentTier)
    : null;

  if (!profile || waterFamily(sample)) {
    return Object.freeze({
      kind: "WATER",
      continentId: null,
      continentTier: null,
      continentName: null,
      profile: null,
      shardClass: null,
      terrainBand: "WATER",
      difficultyClass: "LOW",
      reliefClass: "OPEN",
      waterFamily: true,
      landFamily: false,
      cryosphere: cryosphere(sample),
      shoreline: sample?.shoreline === true || sample?.shorelineBand === true,
      coastEmphasis: sample?.shoreline === true || sample?.shorelineBand === true ? 0.42 : 0.0,
      tectonicMemory: 0,
      elevationOffsetScale: 0.24,
      opacityWeight: sample?.terrainClass === "SHELF" ? 0.70 : 0.64,
      habitability: 0,
      activationWeight: 0,
      ridgeEmphasis: 0,
      basinEmphasis: 0
    });
  }

  const terrainBandValue = terrainBand(sample);
  const difficulty = difficultyClass(sample, profile);
  const relief = reliefClass(sample, profile);
  const shoreline = sample?.shoreline === true || sample?.shorelineBand === true;
  const ridgeEmphasis =
    terrainBandValue === "PEAK" || terrainBandValue === "UPLAND"
      ? clamp(profile.ridgeAlignment * 0.55 + (sample?.slopeSeverity ?? 0) * 0.35, 0, 1)
      : 0;

  const basinEmphasis =
    terrainBandValue === "BASIN"
      ? clamp(profile.valleyDepth * 0.60 + (1 - (sample?.habitability ?? 0)) * 0.20, 0, 1)
      : 0;

  const elevationOffsetScale =
    0.26 +
    profile.reliefAmp * 0.46 +
    profile.traversalDifficulty * 0.28;

  const opacityWeight =
    terrainBandValue === "PEAK" ? 0.90 :
    terrainBandValue === "UPLAND" ? 0.86 :
    terrainBandValue === "COAST" ? 0.80 :
    0.76;

  return Object.freeze({
    kind: "LAND",
    continentId: profile.id,
    continentTier: profile.tier,
    continentName: profile.canonicalName,
    profile,
    shardClass: profile.shardClass,
    terrainBand: terrainBandValue,
    difficultyClass: difficulty,
    reliefClass: relief,
    waterFamily: false,
    landFamily: true,
    cryosphere: cryosphere(sample),
    shoreline,
    coastEmphasis: shoreline ? clamp(0.34 + profile.coastSmoothness * 0.36, 0, 1) : 0,
    tectonicMemory: clamp(sample?.tectonicMemory ?? 0, 0, 1),
    elevationOffsetScale,
    opacityWeight,
    habitability: clamp(sample?.habitability ?? profile.habitabilityFraction, 0, 1),
    activationWeight: clamp(sample?.activationWeight ?? profile.activeNodeDensity, 0, 1),
    ridgeEmphasis,
    basinEmphasis
  });
}
