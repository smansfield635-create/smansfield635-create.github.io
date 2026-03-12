/* DESTINATION FILE: /world/phase_kernel.js */

function freezeObjectTree(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const sub of Object.values(value)) {
      freezeObjectTree(sub);
    }
  }
  return value;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function assertKernel(kernel) {
  if (!kernel || typeof kernel !== "object") {
    throw new Error("Missing kernel");
  }

  if (!kernel.worldMeta || kernel.worldMeta.worldId !== "nine_summits_island") {
    throw new Error("Invalid kernel.worldMeta");
  }

  if (!kernel.regionsById || typeof kernel.regionsById.values !== "function") {
    throw new Error("Missing kernel.regionsById");
  }

  if (!kernel.coastlineModel || typeof kernel.coastlineModel !== "object") {
    throw new Error("Missing kernel.coastlineModel");
  }

  if (!kernel.environmentModel || typeof kernel.environmentModel !== "object") {
    throw new Error("Missing kernel.environmentModel");
  }
}

function safeHashTick(tick) {
  const value = Number.isFinite(tick) ? tick : 0;
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function getRegionIdsByBand(kernel) {
  const regionIds = [...kernel.regionsById.keys()];

  const harbor = [];
  const low = [];
  const mid = [];
  const high = [];
  const summit = [];

  for (const regionId of regionIds) {
    if (
      regionId === "harbor_village" ||
      regionId === "market_district"
    ) {
      harbor.push(regionId);
      continue;
    }

    if (
      regionId === "exploration_basin"
    ) {
      low.push(regionId);
      continue;
    }

    if (
      regionId === "summit_approach" ||
      regionId === "summit_ridge"
    ) {
      high.push(regionId);
      continue;
    }

    if (
      regionId === "summit_plaza"
    ) {
      summit.push(regionId);
      continue;
    }

    mid.push(regionId);
  }

  return freezeObjectTree({
    harbor,
    low,
    mid,
    high,
    summit
  });
}

function getBandExposure(regionId, bandRegistry) {
  if (bandRegistry.harbor.includes(regionId)) return 0.15;
  if (bandRegistry.low.includes(regionId)) return 0.35;
  if (bandRegistry.mid.includes(regionId)) return 0.50;
  if (bandRegistry.high.includes(regionId)) return 0.72;
  if (bandRegistry.summit.includes(regionId)) return 0.92;
  return 0.50;
}

function getBandName(regionId, bandRegistry) {
  if (bandRegistry.harbor.includes(regionId)) return "harbor";
  if (bandRegistry.low.includes(regionId)) return "low";
  if (bandRegistry.mid.includes(regionId)) return "mid";
  if (bandRegistry.high.includes(regionId)) return "high";
  if (bandRegistry.summit.includes(regionId)) return "summit";
  return "mid";
}

function computeCosmicPressure(tick) {
  const slow = 0.5 + (0.5 * Math.sin(tick * 0.0021));
  const long = 0.5 + (0.5 * Math.sin((tick * 0.00047) + 1.4));
  const surge = 0.5 + (0.5 * Math.sin((tick * 0.0063) + 2.1));
  const noise = safeHashTick(tick * 0.15) * 0.08;

  return clamp(
    (slow * 0.48) +
    (long * 0.34) +
    (surge * 0.18) +
    noise,
    0,
    1
  );
}

function computeEnvironmentalLoad(kernel, tick) {
  const humidityBias =
    typeof kernel.environmentModel?.humidityBias === "number"
      ? clamp(kernel.environmentModel.humidityBias, 0, 1)
      : 0.58;

  const thermalBias =
    typeof kernel.environmentModel?.thermalBias === "number"
      ? clamp(kernel.environmentModel.thermalBias, 0, 1)
      : 0.62;

  const oceanBias =
    typeof kernel.environmentModel?.oceanBias === "number"
      ? clamp(kernel.environmentModel.oceanBias, 0, 1)
      : 0.54;

  const humidityWave = 0.5 + (0.5 * Math.sin((tick * 0.0037) + 0.8));
  const thermalWave = 0.5 + (0.5 * Math.sin((tick * 0.0049) + 2.7));
  const oceanWave = 0.5 + (0.5 * Math.sin((tick * 0.0029) + 4.1));

  return clamp(
    (lerp(0.25, 0.95, humidityBias) * humidityWave * 0.38) +
    (lerp(0.25, 0.95, thermalBias) * thermalWave * 0.37) +
    (lerp(0.25, 0.95, oceanBias) * oceanWave * 0.25),
    0,
    1
  );
}

function computeCivilizationBuffer(kernel, tick) {
  const harborCount = kernel.harborInstancesById?.size ?? 0;
  const maritimeNodeCount = kernel.maritimeNetwork?.seaNodesById?.size ?? 0;
  const maritimeRouteCount = kernel.maritimeNetwork?.seaRoutesById?.size ?? 0;
  const coastalDomainCount = kernel.coastalBlueprint?.coastalDomainsById?.size ?? 0;

  const infrastructureScore = clamp(
    (
      Math.min(harborCount, 3) * 0.20 +
      Math.min(maritimeNodeCount, 8) * 0.04 +
      Math.min(maritimeRouteCount, 12) * 0.025 +
      Math.min(coastalDomainCount, 16) * 0.0125
    ),
    0,
    1
  );

  const maintenanceWave = 0.5 + (0.5 * Math.sin((tick * 0.0019) + 0.35));
  const readiness = lerp(0.58, 0.92, maintenanceWave);

  return clamp(
    (infrastructureScore * 0.72) + (readiness * 0.28),
    0,
    1
  );
}

function classifyGlobalPhase(score) {
  if (score >= 0.88) return "LOCKDOWN";
  if (score >= 0.72) return "SEVERE";
  if (score >= 0.54) return "UNSTABLE";
  if (score >= 0.36) return "BUILDING";
  if (score >= 0.18) return "RECOVERY";
  return "CALM";
}

function classifyRegionalPhase(score, bandName) {
  if (bandName === "summit" && score <= 0.18) return "CLEAR_WINDOW";
  if (bandName === "harbor" && score <= 0.26) return "CALM";
  if (bandName === "harbor" && score >= 0.86) return "LOCKDOWN";

  if (score >= 0.88) return "LOCKDOWN";
  if (score >= 0.72) return "SEVERE";
  if (score >= 0.54) return "UNSTABLE";
  if (score >= 0.36) return "BUILDING";
  if (score >= 0.18) return "RECOVERY";
  return "CALM";
}

function getStormClass(phase) {
  if (phase === "LOCKDOWN") return "catastrophic_radiation_storm";
  if (phase === "SEVERE") return "severe_ion_storm";
  if (phase === "UNSTABLE") return "electrical_storm_front";
  if (phase === "BUILDING") return "building_charge_band";
  if (phase === "RECOVERY") return "residual_distortion";
  if (phase === "CLEAR_WINDOW") return "clear_window";
  return "calm";
}

function getRadiationLevel(phase) {
  if (phase === "LOCKDOWN") return 1.0;
  if (phase === "SEVERE") return 0.76;
  if (phase === "UNSTABLE") return 0.52;
  if (phase === "BUILDING") return 0.28;
  if (phase === "RECOVERY") return 0.14;
  if (phase === "CLEAR_WINDOW") return 0.06;
  return 0.10;
}

function getSkyState(phase) {
  if (phase === "LOCKDOWN") return "occluded_radiant_haze";
  if (phase === "SEVERE") return "charged_cloud_density";
  if (phase === "UNSTABLE") return "distorted_visibility";
  if (phase === "BUILDING") return "forming_bands";
  if (phase === "RECOVERY") return "clearing_residue";
  if (phase === "CLEAR_WINDOW") return "legendary_visibility";
  return "stable_reflection";
}

function getTraversalState(phase) {
  if (phase === "LOCKDOWN") {
    return Object.freeze({
      portalsOpen: false,
      maritimeOpen: false,
      localFastTravelOpen: false,
      surfaceTravelAdvisory: "underground_only"
    });
  }

  if (phase === "SEVERE") {
    return Object.freeze({
      portalsOpen: true,
      maritimeOpen: false,
      localFastTravelOpen: false,
      surfaceTravelAdvisory: "restricted"
    });
  }

  if (phase === "UNSTABLE") {
    return Object.freeze({
      portalsOpen: true,
      maritimeOpen: true,
      localFastTravelOpen: false,
      surfaceTravelAdvisory: "hazardous"
    });
  }

  if (phase === "BUILDING") {
    return Object.freeze({
      portalsOpen: true,
      maritimeOpen: true,
      localFastTravelOpen: true,
      surfaceTravelAdvisory: "caution"
    });
  }

  if (phase === "RECOVERY") {
    return Object.freeze({
      portalsOpen: true,
      maritimeOpen: true,
      localFastTravelOpen: true,
      surfaceTravelAdvisory: "recovering"
    });
  }

  if (phase === "CLEAR_WINDOW") {
    return Object.freeze({
      portalsOpen: true,
      maritimeOpen: true,
      localFastTravelOpen: true,
      surfaceTravelAdvisory: "optimal"
    });
  }

  return Object.freeze({
    portalsOpen: true,
    maritimeOpen: true,
    localFastTravelOpen: true,
    surfaceTravelAdvisory: "open"
  });
}

function buildRegionalPhaseMap(kernel, blendedScore, bandRegistry) {
  const regionalPhaseById = new Map();

  for (const region of kernel.regionsById.values()) {
    const bandName = getBandName(region.regionId, bandRegistry);
    const exposure = getBandExposure(region.regionId, bandRegistry);

    const regionalScore = clamp(
      blendedScore + ((exposure - 0.5) * 0.62),
      0,
      1
    );

    const phase = classifyRegionalPhase(regionalScore, bandName);

    regionalPhaseById.set(region.regionId, Object.freeze({
      regionId: region.regionId,
      bandName,
      exposure,
      score: regionalScore,
      phase,
      stormClass: getStormClass(phase),
      radiationLevel: getRadiationLevel(phase),
      skyState: getSkyState(phase),
      traversalState: getTraversalState(phase)
    }));
  }

  return regionalPhaseById;
}

function computePhase(input) {
  const {
    kernel,
    tick = 0
  } = input ?? {};

  assertKernel(kernel);

  const bandRegistry = getRegionIdsByBand(kernel);

  const cosmicPressure = computeCosmicPressure(tick);
  const environmentalLoad = computeEnvironmentalLoad(kernel, tick);
  const civilizationBuffer = computeCivilizationBuffer(kernel, tick);

  const blendedPressure = clamp(
    (cosmicPressure * 0.46) +
    (environmentalLoad * 0.54),
    0,
    1
  );

  const netStress = clamp(
    blendedPressure - (civilizationBuffer * 0.42),
    0,
    1
  );

  const globalPhase = classifyGlobalPhase(netStress);
  const regionalPhaseById = buildRegionalPhaseMap(kernel, netStress, bandRegistry);

  return freezeObjectTree({
    tick,
    cosmicPressure,
    environmentalLoad,
    civilizationBuffer,
    netStress,
    globalPhase,
    stormClass: getStormClass(globalPhase),
    radiationLevel: getRadiationLevel(globalPhase),
    skyState: getSkyState(globalPhase),
    traversalState: getTraversalState(globalPhase),
    regionalPhaseById
  });
}

export const phaseKernel = Object.freeze({
  computePhase
});
