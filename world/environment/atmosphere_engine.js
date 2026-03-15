import { WORLD_KERNEL } from "../world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toFixedNumber(value, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function createAtmosphereEngine() {
  const classes = Object.freeze({
    wind: Object.freeze({ enabled: true, coverage: "256x256" }),
    atmospheric_discharge: Object.freeze({ enabled: true, coverage: "256x256" }),
    moisture: Object.freeze({ enabled: true, coverage: "256x256" }),
    temperature: Object.freeze({ enabled: true, coverage: "256x256" })
  });

  function getThermodynamicField(runtime) {
    return normalizeObject(runtime?.planetField?.thermodynamicField ?? runtime?.thermodynamicField);
  }

  function getHydrologyField(runtime) {
    return normalizeObject(runtime?.planetField?.hydrologyField ?? runtime?.hydrologyField);
  }

  function getTopologyField(runtime) {
    return normalizeObject(runtime?.planetField?.topologyField ?? runtime?.topologyField);
  }

  function getMagneticField(runtime) {
    return normalizeObject(runtime?.planetField?.magneticField ?? runtime?.magneticField);
  }

  function getClimateState(runtime) {
    const thermodynamicField = getThermodynamicField(runtime);
    const hydrologyField = getHydrologyField(runtime);
    const topologyField = getTopologyField(runtime);
    const magneticField = getMagneticField(runtime);

    const thermalGradient = normalizeObject(thermodynamicField?.thermalGradientField);
    const hydrologySummary = normalizeObject(hydrologyField?.summary);

    const temperatureField = clamp(toFixedNumber(thermodynamicField?.temperatureField, 0.5), 0, 1);
    const freezePotentialField = clamp(toFixedNumber(thermodynamicField?.freezePotentialField, 0), 0, 1);
    const meltPotentialField = clamp(toFixedNumber(thermodynamicField?.meltPotentialField, 0), 0, 1);
    const evaporationPressureField = clamp(toFixedNumber(thermodynamicField?.evaporationPressureField, 0), 0, 1);

    const polarCooling = clamp(toFixedNumber(thermalGradient?.polarCooling, 0), 0, 1);
    const heatNodeInfluence = clamp(toFixedNumber(thermalGradient?.heatNodeInfluence, 0), 0, 1.5);
    const wildernessDecay = clamp(toFixedNumber(thermalGradient?.wildernessDecay, 0), 0, 1);

    const runoffAverage = clamp(toFixedNumber(hydrologySummary?.runoffAverage, 0), 0, 1);
    const basinAverage = clamp(toFixedNumber(hydrologySummary?.basinAverage, 0), 0, 1);

    const magneticIntensity = clamp(toFixedNumber(magneticField?.magneticIntensityField, 0), 0, 1);
    const auroralPotential = clamp(toFixedNumber(magneticField?.auroralPotentialField, 0), 0, 1);
    const shieldingGradient = clamp(toFixedNumber(magneticField?.shieldingGradientField, 0), 0, 1);

    const topologySamples = Array.isArray(topologyField?.samples) ? topologyField.samples : [];
    const thermodynamicSamples = Array.isArray(thermodynamicField?.samples) ? thermodynamicField.samples : [];

    let ridgeAverage = 0;
    let basinStrengthAverage = 0;
    let divideAverage = 0;

    if (topologySamples.length > 0) {
      let ridgeTotal = 0;
      let basinTotal = 0;
      let divideTotal = 0;

      for (const sample of topologySamples) {
        ridgeTotal += toFixedNumber(sample?.ridgeStrength, 0);
        basinTotal += toFixedNumber(sample?.basinStrength, 0);
        divideTotal += toFixedNumber(sample?.divideStrength, 0);
      }

      ridgeAverage = clamp(ridgeTotal / topologySamples.length, 0, 1);
      basinStrengthAverage = clamp(basinTotal / topologySamples.length, 0, 1);
      divideAverage = clamp(divideTotal / topologySamples.length, 0, 1);
    }

    let sampleTemperatureAverage = temperatureField;
    if (thermodynamicSamples.length > 0) {
      let total = 0;
      for (const sample of thermodynamicSamples) {
        total += toFixedNumber(sample?.temperatureField, 0.5);
      }
      sampleTemperatureAverage = clamp(total / thermodynamicSamples.length, 0, 1);
    }

    const warmBias = clamp(temperatureField * 0.58 + heatNodeInfluence * 0.16 + meltPotentialField * 0.18, 0, 1);
    const coolBias = clamp(freezePotentialField * 0.52 + polarCooling * 0.36 + wildernessDecay * 0.12, 0, 1);
    const evaporationHaze = clamp(evaporationPressureField * 0.62 + runoffAverage * 0.18 + basinAverage * 0.12, 0, 1);
    const stormPotential = clamp(meltPotentialField * 0.26 + basinAverage * 0.24 + ridgeAverage * 0.10 + runoffAverage * 0.18, 0, 1);
    const auroraStrength = clamp(auroralPotential * 0.58 + magneticIntensity * 0.22 + shieldingGradient * 0.10, 0, 1);
    const cloudDensity = clamp(evaporationHaze * 0.62 + basinAverage * 0.18 + ridgeAverage * 0.10, 0, 1);
    const thermalBandShift = clamp(sampleTemperatureAverage - 0.5, -0.5, 0.5);

    return Object.freeze({
      temperatureField,
      freezePotentialField,
      meltPotentialField,
      evaporationPressureField,
      polarCooling,
      heatNodeInfluence,
      wildernessDecay,
      runoffAverage,
      basinAverage,
      ridgeAverage,
      basinStrengthAverage,
      divideAverage,
      magneticIntensity,
      auroralPotential,
      shieldingGradient,
      warmBias,
      coolBias,
      evaporationHaze,
      stormPotential,
      auroraStrength,
      cloudDensity,
      thermalBandShift
    });
  }

  function renderOuter(ctx, projector, runtime) {
    const { centerX, centerY, radius } = projector.state;
    const climate = getClimateState(runtime);

    const warmOuterAlpha = 0.04 + climate.warmBias * 0.08;
    const coolOuterAlpha = 0.04 + climate.coolBias * 0.10;
    const shellAlpha = 0.16 + climate.evaporationHaze * 0.14;
    const upperAccentAlpha = 0.10 + climate.heatNodeInfluence * 0.06;
    const auroraAlpha = climate.auroraStrength * 0.24;

    ctx.save();
    const shadow = ctx.createRadialGradient(
      centerX + radius * 0.24,
      centerY + radius * 0.18,
      radius * 0.06,
      centerX + radius * 0.22,
      centerY + radius * 0.18,
      radius * 1.06
    );
    shadow.addColorStop(0, "rgba(0,0,0,0)");
    shadow.addColorStop(0.44, "rgba(0,0,0,0.04)");
    shadow.addColorStop(0.70, "rgba(0,0,0,0.15)");
    shadow.addColorStop(1, "rgba(0,0,0,0.30)");
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.03, 0, Math.PI * 2);
    ctx.fillStyle = shadow;
    ctx.fill();
    ctx.restore();

    ctx.save();
    const outerGlow = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.96,
      centerX,
      centerY,
      radius * 1.30
    );
    outerGlow.addColorStop(0, "rgba(110,180,255,0)");
    outerGlow.addColorStop(0.46, `rgba(255,168,88,${warmOuterAlpha.toFixed(3)})`);
    outerGlow.addColorStop(0.66, `rgba(84,146,255,${(0.03 + climate.evaporationHaze * 0.04).toFixed(3)})`);
    outerGlow.addColorStop(0.82, `rgba(148,208,255,${coolOuterAlpha.toFixed(3)})`);
    outerGlow.addColorStop(1, "rgba(44,92,210,0)");
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.30, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow;
    ctx.fill();
    ctx.restore();

    const thickness = radius * WORLD_KERNEL.constants.atmosphereThicknessFactor;
    const shell = ctx.createRadialGradient(
      centerX,
      centerY - radius * 0.06,
      radius * 0.98,
      centerX,
      centerY - radius * 0.08,
      radius + thickness * 2.7
    );
    shell.addColorStop(0, "rgba(75,145,255,0)");
    shell.addColorStop(0.56, `rgba(255,180,110,${(climate.warmBias * 0.06).toFixed(3)})`);
    shell.addColorStop(0.72, `rgba(84,168,255,${(0.03 + climate.cloudDensity * 0.04).toFixed(3)})`);
    shell.addColorStop(0.84, `rgba(112,216,255,${shellAlpha.toFixed(3)})`);
    shell.addColorStop(0.92, `rgba(200,236,255,${(0.16 + climate.coolBias * 0.14).toFixed(3)})`);
    shell.addColorStop(1, "rgba(75,145,255,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + thickness * 2.7, 0, Math.PI * 2);
    ctx.fillStyle = shell;
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = upperAccentAlpha;
    const upperAccent = ctx.createRadialGradient(
      centerX,
      centerY - radius * 0.44,
      radius * 0.04,
      centerX,
      centerY - radius * 0.44,
      radius * 0.42
    );
    upperAccent.addColorStop(0, "rgba(205,240,255,0.36)");
    upperAccent.addColorStop(0.38, `rgba(255,214,148,${(0.16 + climate.warmBias * 0.12).toFixed(3)})`);
    upperAccent.addColorStop(0.72, `rgba(120,220,255,${(0.08 + climate.evaporationHaze * 0.08).toFixed(3)})`);
    upperAccent.addColorStop(1, "rgba(120,220,255,0)");
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - radius * 0.46, radius * 0.42, radius * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = upperAccent;
    ctx.fill();
    ctx.restore();

    if (auroraAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = auroraAlpha;
      const aurora = ctx.createLinearGradient(
        centerX - radius * 0.82,
        centerY - radius * 0.98,
        centerX + radius * 0.82,
        centerY - radius * 0.78
      );
      aurora.addColorStop(0, "rgba(112,255,210,0)");
      aurora.addColorStop(0.22, "rgba(112,255,210,0.12)");
      aurora.addColorStop(0.48, "rgba(160,255,196,0.22)");
      aurora.addColorStop(0.74, "rgba(112,220,255,0.14)");
      aurora.addColorStop(1, "rgba(112,220,255,0)");
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY - radius * (0.76 + climate.polarCooling * 0.08),
        radius * 0.92,
        radius * 0.15,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = aurora;
      ctx.fill();
      ctx.restore();
    }
  }

  function renderInner(ctx, projector, runtime, state) {
    const { centerX, centerY, radius } = projector.state;
    const climate = getClimateState(runtime);

    ctx.save();
    ctx.globalAlpha = 0.10 + climate.coolBias * 0.16;
    ctx.fillStyle = `rgba(220,245,255,${(0.42 + climate.coolBias * 0.20).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY - radius * (0.70 + climate.polarCooling * 0.04),
      radius * (0.26 + climate.coolBias * 0.05),
      radius * (0.09 + climate.coolBias * 0.02),
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.12 + climate.stormPotential * 0.10;
    for (let i = 0; i < 4; i += 1) {
      const arcRadius = radius * (0.44 + i * 0.08);
      const start =
        0.14 * Math.PI +
        Math.sin(state.time * (0.0007 + climate.stormPotential * 0.00018) + i * 0.8) *
          (0.05 + climate.stormPotential * 0.03);
      const end =
        0.70 * Math.PI +
        Math.cos(state.time * (0.00055 + climate.cloudDensity * 0.00014) + i * 0.6) *
          (0.04 + climate.evaporationHaze * 0.02);
      ctx.beginPath();
      ctx.arc(centerX, centerY - radius * 0.22, arcRadius, start, end);
      ctx.strokeStyle = `rgba(225,238,255,${(0.50 + climate.cloudDensity * 0.26).toFixed(3)})`;
      ctx.lineWidth = 1.1 + climate.cloudDensity * 0.45;
      ctx.stroke();
    }
    ctx.restore();

    const cloudBodies = [
      { x: -0.10, y: -0.22, rx: 0.22, ry: 0.06, rot: -0.10 },
      { x: 0.12, y: -0.08, rx: 0.28, ry: 0.07, rot: 0.04 },
      { x: 0.04, y: 0.08, rx: 0.18, ry: 0.055, rot: -0.06 }
    ];

    ctx.save();
    ctx.globalAlpha = 0.05 + climate.cloudDensity * 0.10 + climate.evaporationHaze * 0.08;
    cloudBodies.forEach((body, index) => {
      const wobbleX =
        Math.sin(state.time * (0.00018 + climate.runoffAverage * 0.00008) + index) *
        radius *
        (0.018 + climate.stormPotential * 0.008);
      const wobbleY =
        Math.cos(state.time * (0.00015 + climate.basinAverage * 0.00006) + index) *
        radius *
        (0.010 + climate.evaporationHaze * 0.006);

      ctx.beginPath();
      ctx.ellipse(
        centerX + radius * body.x + wobbleX,
        centerY + radius * body.y + wobbleY,
        radius * (body.rx + climate.cloudDensity * 0.04),
        radius * (body.ry + climate.evaporationHaze * 0.02),
        body.rot,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(240,248,255,${(0.54 + climate.cloudDensity * 0.22).toFixed(3)})`;
      ctx.fill();
    });
    ctx.restore();

    if (climate.evaporationHaze > 0.01 || climate.warmBias > 0.01) {
      const haze = ctx.createRadialGradient(
        centerX + radius * 0.10,
        centerY + radius * 0.16,
        radius * 0.10,
        centerX,
        centerY + radius * 0.08,
        radius * 0.88
      );
      haze.addColorStop(0, `rgba(255,234,196,${(0.03 + climate.warmBias * 0.05).toFixed(3)})`);
      haze.addColorStop(0.46, `rgba(255,244,220,${(0.04 + climate.evaporationHaze * 0.10).toFixed(3)})`);
      haze.addColorStop(1, "rgba(255,244,220,0)");
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.98, 0, Math.PI * 2);
      ctx.fillStyle = haze;
      ctx.fill();
    }

    if (climate.coolBias > 0.01) {
      const coldWash = ctx.createLinearGradient(
        centerX - radius,
        centerY - radius,
        centerX + radius,
        centerY + radius * 0.35
      );
      coldWash.addColorStop(0, `rgba(196,230,255,${(0.04 + climate.coolBias * 0.08).toFixed(3)})`);
      coldWash.addColorStop(0.44, `rgba(196,230,255,${(0.02 + climate.polarCooling * 0.08).toFixed(3)})`);
      coldWash.addColorStop(1, "rgba(196,230,255,0)");
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.996, 0, Math.PI * 2);
      ctx.fillStyle = coldWash;
      ctx.fill();
    }

    const sheen = ctx.createRadialGradient(
      centerX - radius * 0.30,
      centerY - radius * 0.26,
      radius * 0.03,
      centerX,
      centerY,
      radius
    );
    sheen.addColorStop(0, `rgba(255,255,255,${(0.05 + climate.cloudDensity * 0.04).toFixed(3)})`);
    sheen.addColorStop(0.14, `rgba(255,255,255,${(0.02 + climate.evaporationHaze * 0.03).toFixed(3)})`);
    sheen.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = sheen;
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.14 + climate.stormPotential * 0.08;
    const terminator = ctx.createLinearGradient(
      centerX - radius,
      centerY - radius * 0.14,
      centerX + radius,
      centerY + radius * 0.12
    );
    terminator.addColorStop(0, "rgba(0,0,0,0)");
    terminator.addColorStop(0.30, "rgba(0,0,0,0.14)");
    terminator.addColorStop(
      0.42,
      `rgba(150,225,255,${(0.10 + climate.evaporationHaze * 0.10 + climate.coolBias * 0.06).toFixed(3)})`
    );
    terminator.addColorStop(
      0.54,
      `rgba(255,255,255,${(0.018 + climate.warmBias * 0.020).toFixed(3)})`
    );
    terminator.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.996, 0, Math.PI * 2);
    ctx.fillStyle = terminator;
    ctx.fill();
    ctx.restore();
  }

  function renderOutline(ctx, projector, runtime) {
    const { centerX, centerY, radius } = projector.state;
    const climate = getClimateState(runtime);
    const outlineAlpha = 0.14 + climate.coolBias * 0.06 + climate.evaporationHaze * 0.03;
    const outlineWarm = 205 + Math.round(climate.warmBias * 36);
    const outlineCool = 255;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${outlineWarm},${outlineCool},255,${outlineAlpha.toFixed(3)})`;
    ctx.lineWidth = 1.35;
    ctx.stroke();
  }

  return Object.freeze({
    classes,
    renderOuter,
    renderInner,
    renderOutline
  });
}
