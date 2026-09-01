import { buildHEarthB1MorphologyDescriptorBaseline } from './h-earth.b1-morphology-descriptor-baseline.v1.mjs';
import { buildHEarthB2ProtectionModel } from './h-earth.b2-protection-model.v1.mjs';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const finite = Number.isFinite;
const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function hashArrays(arrays) {
  let hash = FNV_OFFSET;
  for (const array of arrays) {
    const bytes = array instanceof Uint8Array
      ? array
      : new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
    for (const byte of bytes) {
      hash ^= byte;
      hash = Math.imul(hash, FNV_PRIME) >>> 0;
    }
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}

function percentileSorted(sorted, fraction) {
  if (!sorted.length) return 0;
  const position = clamp((sorted.length - 1) * fraction, 0, sorted.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const blend = position - lower;
  return sorted[lower] * (1 - blend) + sorted[upper] * blend;
}

function localReliefP95P05(heights, width, height, radius) {
  const output = new Float64Array(heights.length);
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const values = [];
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const x = clamp(column + dx, 0, width - 1);
          const y = clamp(row + dy, 0, height - 1);
          values.push(heights[y * width + x]);
        }
      }
      values.sort((a, b) => a - b);
      output[row * width + column] = Math.max(0, percentileSorted(values, 0.95) - percentileSorted(values, 0.05));
    }
  }
  return output;
}

function cellDistance(indexA, indexB, width, xSpacing, zSpacing) {
  const ax = indexA % width;
  const ay = Math.floor(indexA / width);
  const bx = indexB % width;
  const by = Math.floor(indexB / width);
  return Math.max(1e-9, Math.hypot((bx - ax) * xSpacing, (by - ay) * zSpacing));
}

function buildErosionGuidance(baseline, protection, law) {
  const width = baseline.grid.width;
  const height = baseline.grid.height;
  const source = baseline.heights;
  const guidance = Float64Array.from(source);
  const sediment = new Float64Array(source.length);
  const maximumLogAccumulation = Math.max(1e-9, ...Array.from(baseline.flowAccumulation, (value) => Math.log1p(value)));

  // One stream-power erosion step.
  for (let index = 0; index < source.length; index += 1) {
    if (protection.p0[index]) continue;
    const receiver = baseline.flowReceiver[index];
    if (receiver < 0 || protection.p0[receiver]) continue;
    const drop = Math.max(0, source[index] - source[receiver]);
    if (drop <= 0) continue;
    const distance = cellDistance(index, receiver, width, baseline.grid.xSpacing, baseline.grid.zSpacing);
    const slope = drop / distance;
    const accumulation = Math.log1p(baseline.flowAccumulation[index]) / maximumLogAccumulation;
    const hotspot = baseline.hotspotWeights[index];
    const editable = protection.editableWeight[index];
    const eroded = Math.min(
      drop * 0.45,
      law.streamPowerCoefficient
        * Math.pow(accumulation, law.accumulationExponent)
        * Math.pow(slope, law.slopeExponent)
        * hotspot
        * editable
    );
    guidance[index] -= eroded;
    sediment[index] = eroded;
  }

  // One synchronous thermal-relaxation step.
  const thermalDelta = new Float64Array(source.length);
  const neighbors = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const index = row * width + column;
      if (protection.p0[index]) continue;
      let bestIndex = -1;
      let bestExcess = 0;
      for (const [dx, dy] of neighbors) {
        const x = column + dx;
        const y = row + dy;
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        const neighbor = y * width + x;
        if (protection.p0[neighbor]) continue;
        const distance = Math.hypot(dx * baseline.grid.xSpacing, dy * baseline.grid.zSpacing);
        const excess = guidance[index] - guidance[neighbor] - law.thermalTalusWorldSlope * distance;
        if (excess > bestExcess + 1e-12 || (Math.abs(excess - bestExcess) <= 1e-12 && neighbor < bestIndex)) {
          bestExcess = excess;
          bestIndex = neighbor;
        }
      }
      if (bestIndex >= 0 && bestExcess > 0) {
        const editable = Math.min(protection.editableWeight[index], protection.editableWeight[bestIndex]);
        const hotspot = Math.max(baseline.hotspotWeights[index], baseline.hotspotWeights[bestIndex]);
        const transfer = bestExcess * law.thermalTransferFraction * editable * hotspot;
        thermalDelta[index] -= transfer;
        thermalDelta[bestIndex] += transfer;
      }
    }
  }
  for (let index = 0; index < guidance.length; index += 1) guidance[index] += thermalDelta[index];

  // One deposition step using the frozen flow receivers.
  for (let index = 0; index < sediment.length; index += 1) {
    const receiver = baseline.flowReceiver[index];
    if (sediment[index] <= 0 || receiver < 0 || protection.p0[receiver]) continue;
    guidance[receiver] += sediment[index] * law.depositionFraction * protection.editableWeight[receiver];
  }

  for (let index = 0; index < guidance.length; index += 1) {
    if (protection.p0[index]) guidance[index] = source[index];
  }
  return guidance;
}

function reconstructScreenedPoisson(source, target, protection, width, height, law) {
  let current = Float64Array.from(source);
  let next = new Float64Array(source.length);
  const neighbors = [[-1,0],[1,0],[0,-1],[0,1]];
  for (let iteration = 0; iteration < law.iterations; iteration += 1) {
    for (let row = 0; row < height; row += 1) {
      for (let column = 0; column < width; column += 1) {
        const index = row * width + column;
        if (protection.p0[index]) {
          next[index] = source[index];
          continue;
        }
        let numerator = 0;
        let denominator = 0;
        for (const [dx, dy] of neighbors) {
          const x = column + dx;
          const y = row + dy;
          if (x < 0 || x >= width || y < 0 || y >= height) continue;
          const neighbor = y * width + x;
          const gradientWeight = law.gradientGuidanceWeight
            * (0.35 + 0.65 * Math.max(protection.editableWeight[index], protection.editableWeight[neighbor]));
          const desiredDifference = target[neighbor] - target[index];
          numerator += gradientWeight * (current[neighbor] - desiredDifference);
          denominator += gradientWeight;
        }
        const fidelityWeight = law.originalHeightFidelityBase
          + law.originalHeightFidelityFromHardness * protection.hardness[index];
        numerator += fidelityWeight * source[index];
        denominator += fidelityWeight;
        next[index] = denominator > 0 ? numerator / denominator : source[index];
      }
    }
    const swap = current;
    current = next;
    next = swap;
  }
  return current;
}

function summarize(values) {
  let minimum = Infinity;
  let maximum = -Infinity;
  let sum = 0;
  let absoluteSum = 0;
  let finiteCount = 0;
  for (const value of values) {
    if (!finite(value)) continue;
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
    sum += value;
    absoluteSum += Math.abs(value);
    finiteCount += 1;
  }
  return {
    minimum,
    maximum,
    mean: sum / Math.max(1, finiteCount),
    meanAbsolute: absoluteSum / Math.max(1, finiteCount),
    finiteCount,
    elementCount: values.length
  };
}

function createProbe({ definition, source, reconstructed, relief, protection }) {
  const rawDelta = new Float64Array(source.length);
  const editableAbsolute = [];
  for (let index = 0; index < source.length; index += 1) {
    rawDelta[index] = reconstructed[index] - source[index];
    if (!protection.p0[index] && protection.editableWeight[index] > 0) editableAbsolute.push(Math.abs(rawDelta[index]));
  }
  editableAbsolute.sort((a, b) => a - b);
  const normalization = Math.max(1e-12, percentileSorted(editableAbsolute, 0.95));
  const heights = new Float64Array(source.length);
  const delta = new Float64Array(source.length);
  const envelope = new Float64Array(source.length);
  let changedCellCount = 0;
  let envelopeViolationCount = 0;
  let p0MaximumAbsoluteDelta = 0;
  let p1MaximumAbsoluteDelta = 0;
  for (let index = 0; index < source.length; index += 1) {
    const maximum = definition.amplitudeFractionOfLocalRelief * relief[index];
    envelope[index] = maximum;
    const shape = clamp(rawDelta[index] / normalization, -1, 1);
    let value = shape * maximum * protection.editableWeight[index];
    value = clamp(value, -maximum, maximum);
    if (protection.p0[index]) value = 0;
    delta[index] = value;
    heights[index] = source[index] + value;
    if (Math.abs(value) > 1e-10) changedCellCount += 1;
    if (Math.abs(value) > maximum + 1e-8) envelopeViolationCount += 1;
    if (protection.p0[index]) p0MaximumAbsoluteDelta = Math.max(p0MaximumAbsoluteDelta, Math.abs(value));
    if (protection.p1[index]) p1MaximumAbsoluteDelta = Math.max(p1MaximumAbsoluteDelta, Math.abs(value));
  }
  const digest = hashArrays([
    new Uint8Array(heights.buffer),
    new Uint8Array(delta.buffer),
    new Uint8Array(envelope.buffer)
  ]);
  return {
    probeId: definition.probeId,
    amplitudeFractionOfLocalRelief: definition.amplitudeFractionOfLocalRelief,
    encoding: 'FLOAT64_LITTLE_ENDIAN',
    heights,
    delta,
    envelope,
    digest,
    summary: {
      changedCellCount,
      envelopeViolationCount,
      maximumAbsoluteDelta: Math.max(...Array.from(delta, Math.abs)),
      p0MaximumAbsoluteDelta,
      p1MaximumAbsoluteDelta,
      normalization,
      heights: summarize(heights),
      delta: summarize(delta),
      envelope: summarize(envelope)
    }
  };
}

export function buildHEarthB3TwoFixedMorphologyProbes(authority, b2Authority) {
  const baseline = buildHEarthB1MorphologyDescriptorBaseline({
    width: authority.grid.width,
    height: authority.grid.height,
    domain: {
      xMinimum: authority.grid.xMinimum,
      xMaximum: authority.grid.xMaximum,
      zMinimum: authority.grid.zMinimum,
      zMaximum: authority.grid.zMaximum,
      seaLevelY: 0
    }
  });
  if (baseline.baselineDigest !== authority.frozenBaselineDigest) {
    throw new Error(`B3_BASELINE_DIGEST_MISMATCH:${baseline.baselineDigest}`);
  }
  const protection = buildHEarthB2ProtectionModel(b2Authority);
  if (protection.protectionDigest !== authority.frozenProtectionDigest) {
    throw new Error(`B3_PROTECTION_DIGEST_MISMATCH:${protection.protectionDigest}`);
  }
  if (baseline.repetition.dominant.lagCells !== baseline.radii.large) {
    throw new Error('B3_DOMINANT_SCALE_MISMATCH');
  }

  const localRelief = localReliefP95P05(
    baseline.heights,
    baseline.grid.width,
    baseline.grid.height,
    baseline.repetition.dominant.lagCells
  );
  const guidance = buildErosionGuidance(baseline, protection, authority.erosionGuidance);
  const reconstructed = reconstructScreenedPoisson(
    baseline.heights,
    guidance,
    protection,
    baseline.grid.width,
    baseline.grid.height,
    authority.reconstruction
  );
  const probes = authority.probes.map((definition) => createProbe({
    definition,
    source: baseline.heights,
    reconstructed,
    relief: localRelief,
    protection
  }));

  return {
    identity: authority.schemaVersion,
    baselineDigest: baseline.baselineDigest,
    protectionDigest: protection.protectionDigest,
    dominantRepetition: { ...baseline.repetition.dominant },
    grid: { ...baseline.grid },
    domain: { ...baseline.domain },
    sourceHeights: baseline.heights,
    p0: protection.p0,
    p1: protection.p1,
    p2: protection.p2,
    localRelief,
    guidance,
    reconstructed,
    guidanceDigest: hashArrays([
      new Uint8Array(localRelief.buffer),
      new Uint8Array(guidance.buffer),
      new Uint8Array(reconstructed.buffer)
    ]),
    probes
  };
}

export default buildHEarthB3TwoFixedMorphologyProbes;
