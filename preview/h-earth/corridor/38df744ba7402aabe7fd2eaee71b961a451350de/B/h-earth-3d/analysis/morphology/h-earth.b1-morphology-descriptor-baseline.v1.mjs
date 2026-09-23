import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  sampleHEarthRun8BSuccessorTerrainField
} from '../../terrain/h-earth.successor-terrain-field.run8b.js';

const finite = Number.isFinite;
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const percentile = (values, fraction) => {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1))];
};

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;
function hashNumbers(values) {
  let hash = FNV_OFFSET;
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  for (const value of values) {
    view.setFloat64(0, Number(value), true);
    for (let index = 0; index < 8; index += 1) {
      hash ^= view.getUint8(index);
      hash = Math.imul(hash, FNV_PRIME) >>> 0;
    }
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}
function hashStrings(values) {
  let hash = FNV_OFFSET;
  const encoder = new TextEncoder();
  for (const value of values) {
    for (const byte of encoder.encode(String(value))) {
      hash ^= byte;
      hash = Math.imul(hash, FNV_PRIME) >>> 0;
    }
    hash ^= 0xff;
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}

function createIntegral(values, width, height) {
  const stride = width + 1;
  const integral = new Float64Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y += 1) {
    let row = 0;
    for (let x = 0; x < width; x += 1) {
      row += values[y * width + x];
      integral[(y + 1) * stride + x + 1] = integral[y * stride + x + 1] + row;
    }
  }
  return { integral, stride };
}
function rectangleSum(record, x0, y0, x1, y1) {
  const { integral, stride } = record;
  return integral[y1 * stride + x1] - integral[y0 * stride + x1] - integral[y1 * stride + x0] + integral[y0 * stride + x0];
}
function boxMean(values, width, height, radius) {
  const record = createIntegral(values, width, height);
  const output = new Float64Array(values.length);
  for (let y = 0; y < height; y += 1) {
    const y0 = Math.max(0, y - radius);
    const y1 = Math.min(height, y + radius + 1);
    for (let x = 0; x < width; x += 1) {
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(width, x + radius + 1);
      output[y * width + x] = rectangleSum(record, x0, y0, x1, y1) / ((x1 - x0) * (y1 - y0));
    }
  }
  return output;
}

function sampleGrid({ width, height, domain }) {
  const heights = new Float64Array(width * height);
  const valid = new Uint8Array(width * height);
  const xSpacing = (domain.xMaximum - domain.xMinimum) / (width - 1);
  const zSpacing = (domain.zMaximum - domain.zMinimum) / (height - 1);
  for (let row = 0; row < height; row += 1) {
    const z = domain.zMinimum + row * zSpacing;
    for (let column = 0; column < width; column += 1) {
      const x = domain.xMinimum + column * xSpacing;
      const index = row * width + column;
      const sample = sampleHEarthRun8BSuccessorTerrainField(x, z);
      if (sample?.valid === true && finite(sample.elevation)) {
        heights[index] = sample.elevation;
        valid[index] = 1;
      } else {
        heights[index] = NaN;
      }
    }
  }
  return { heights, valid, xSpacing, zSpacing };
}

function computeDerivatives(heights, width, height, xSpacing, zSpacing) {
  const slopeX = new Float64Array(heights.length);
  const slopeZ = new Float64Array(heights.length);
  const dxx = new Float64Array(heights.length);
  const dzz = new Float64Array(heights.length);
  const dxz = new Float64Array(heights.length);
  const at = (x, y) => heights[clamp(y, 0, height - 1) * width + clamp(x, 0, width - 1)];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const left = at(x - 1, y), right = at(x + 1, y);
      const down = at(x, y - 1), up = at(x, y + 1);
      slopeX[index] = (right - left) / (2 * xSpacing);
      slopeZ[index] = (up - down) / (2 * zSpacing);
      dxx[index] = (right - 2 * heights[index] + left) / (xSpacing * xSpacing);
      dzz[index] = (up - 2 * heights[index] + down) / (zSpacing * zSpacing);
      dxz[index] = (at(x + 1, y + 1) - at(x + 1, y - 1) - at(x - 1, y + 1) + at(x - 1, y - 1)) / (4 * xSpacing * zSpacing);
    }
  }
  return { slopeX, slopeZ, dxx, dzz, dxz };
}

function correlation(values, width, height, dx, dy, bounds = null) {
  const x0 = bounds?.x0 ?? 0;
  const y0 = bounds?.y0 ?? 0;
  const x1 = bounds?.x1 ?? width;
  const y1 = bounds?.y1 ?? height;
  let leftMean = 0, rightMean = 0, pairs = 0;
  const startX = Math.max(x0, x0 - dx);
  const endX = Math.min(x1, x1 - dx);
  const startY = Math.max(y0, y0 - dy);
  const endY = Math.min(y1, y1 - dy);
  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      leftMean += values[y * width + x];
      rightMean += values[(y + dy) * width + x + dx];
      pairs += 1;
    }
  }
  if (pairs < 32) return 0;
  leftMean /= pairs;
  rightMean /= pairs;
  let numerator = 0, leftEnergy = 0, rightEnergy = 0;
  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const a = values[y * width + x] - leftMean;
      const b = values[(y + dy) * width + x + dx] - rightMean;
      numerator += a * b;
      leftEnergy += a * a;
      rightEnergy += b * b;
    }
  }
  return leftEnergy > 1e-12 && rightEnergy > 1e-12 ? Math.abs(numerator / Math.sqrt(leftEnergy * rightEnergy)) : 0;
}

function localReliefAtRadius(heights, width, height, radius) {
  const output = new Float64Array(heights.length);
  const directions = [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let minimum = Infinity, maximum = -Infinity;
      for (const [dx, dy] of directions) {
        const nx = clamp(x + dx * radius, 0, width - 1);
        const ny = clamp(y + dy * radius, 0, height - 1);
        const value = heights[ny * width + nx];
        minimum = Math.min(minimum, value);
        maximum = Math.max(maximum, value);
      }
      output[y * width + x] = maximum - minimum;
    }
  }
  return output;
}

function distanceTransform(seed, width, height) {
  const distance = new Float64Array(seed.length);
  const diagonal = Math.SQRT2;
  for (let index = 0; index < distance.length; index += 1) distance[index] = seed[index] ? 0 : 1e9;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      if (x > 0) distance[i] = Math.min(distance[i], distance[i - 1] + 1);
      if (y > 0) distance[i] = Math.min(distance[i], distance[i - width] + 1);
      if (x > 0 && y > 0) distance[i] = Math.min(distance[i], distance[i - width - 1] + diagonal);
      if (x + 1 < width && y > 0) distance[i] = Math.min(distance[i], distance[i - width + 1] + diagonal);
    }
  }
  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      const i = y * width + x;
      if (x + 1 < width) distance[i] = Math.min(distance[i], distance[i + 1] + 1);
      if (y + 1 < height) distance[i] = Math.min(distance[i], distance[i + width] + 1);
      if (x + 1 < width && y + 1 < height) distance[i] = Math.min(distance[i], distance[i + width + 1] + diagonal);
      if (x > 0 && y + 1 < height) distance[i] = Math.min(distance[i], distance[i + width - 1] + diagonal);
    }
  }
  return distance;
}

function flowAccumulation(heights, width, height, xSpacing, zSpacing) {
  const receiver = new Int32Array(heights.length).fill(-1);
  const accumulation = new Float64Array(heights.length).fill(1);
  const neighbors = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      let best = -1, bestGradient = 0;
      for (const [dx, dy] of neighbors) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const ni = ny * width + nx;
        const distance = Math.hypot(dx * xSpacing, dy * zSpacing);
        const gradient = (heights[i] - heights[ni]) / distance;
        if (gradient > bestGradient + 1e-12 || (Math.abs(gradient - bestGradient) <= 1e-12 && ni < best)) {
          bestGradient = gradient;
          best = ni;
        }
      }
      receiver[i] = best;
    }
  }
  const order = [...Array(heights.length).keys()].sort((a, b) => heights[b] - heights[a] || a - b);
  for (const index of order) if (receiver[index] >= 0) accumulation[receiver[index]] += accumulation[index];
  return { receiver, accumulation };
}

function summarize(values) {
  let minimum = Infinity, maximum = -Infinity, sum = 0, finiteCount = 0;
  for (const value of values) {
    if (!finite(value)) continue;
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
    sum += value;
    finiteCount += 1;
  }
  return {
    minimum,
    maximum,
    mean: sum / Math.max(1, finiteCount),
    finiteCount,
    elementCount: values.length,
    digest: hashNumbers(values)
  };
}

export function buildHEarthB1MorphologyDescriptorBaseline(options = {}) {
  const domain = options.domain ?? H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
  const width = options.width ?? 129;
  const height = options.height ?? 97;
  const orientations = options.orientationsDegrees ?? [0,22.5,45,67.5,90,112.5,135,157.5];
  const lags = options.lagsCells ?? [2,3,4,6,8,12,16,24,32];
  const detrendRadius = options.detrendBoxRadiusCells ?? 12;
  const sampled = sampleGrid({ width, height, domain });
  if (sampled.valid.some((value) => value !== 1)) throw new Error('B1_INVALID_TERRAIN_SAMPLE');

  const trend = boxMean(sampled.heights, width, height, detrendRadius);
  const residual = new Float64Array(sampled.heights.length);
  for (let index = 0; index < residual.length; index += 1) residual[index] = sampled.heights[index] - trend[index];

  const candidates = [];
  for (const orientationDegrees of orientations) {
    const radians = orientationDegrees * Math.PI / 180;
    for (const lagCells of lags) {
      const dx = Math.round(Math.cos(radians) * lagCells);
      const dy = Math.round(Math.sin(radians) * lagCells);
      if (dx === 0 && dy === 0) continue;
      candidates.push({ orientationDegrees, lagCells, dx, dy, score: correlation(residual, width, height, dx, dy) });
    }
  }
  candidates.sort((a, b) => b.score - a.score || a.lagCells - b.lagCells || a.orientationDegrees - b.orientationDegrees);
  const dominant = candidates[0];
  const dominantLagWorldUnits = dominant.lagCells * (sampled.xSpacing + sampled.zSpacing) * 0.5;

  const derivatives = computeDerivatives(sampled.heights, width, height, sampled.xSpacing, sampled.zSpacing);
  const slopeMagnitude = new Float64Array(sampled.heights.length);
  const aspect = new Float64Array(sampled.heights.length);
  const directionalSlope = new Float64Array(sampled.heights.length);
  const profileCurvature = new Float64Array(sampled.heights.length);
  const planCurvature = new Float64Array(sampled.heights.length);
  const theta = dominant.orientationDegrees * Math.PI / 180;
  for (let index = 0; index < slopeMagnitude.length; index += 1) {
    const p = derivatives.slopeX[index], q = derivatives.slopeZ[index];
    const r = derivatives.dxx[index], s = derivatives.dxz[index], t = derivatives.dzz[index];
    const gradientSquared = p * p + q * q;
    slopeMagnitude[index] = Math.sqrt(gradientSquared);
    aspect[index] = Math.atan2(q, p);
    directionalSlope[index] = p * Math.cos(theta) + q * Math.sin(theta);
    const denominator = Math.max(1e-12, gradientSquared);
    profileCurvature[index] = (r * p * p + 2 * s * p * q + t * q * q) / denominator;
    planCurvature[index] = (r * q * q - 2 * s * p * q + t * p * p) / denominator;
  }

  const radii = {
    small: Math.max(1, Math.round(dominant.lagCells / 4)),
    medium: Math.max(2, Math.round(dominant.lagCells / 2)),
    large: dominant.lagCells
  };
  const tpi = {};
  const localRelief = {};
  for (const [name, radius] of Object.entries(radii)) {
    const mean = boxMean(sampled.heights, width, height, radius);
    const relief = localReliefAtRadius(sampled.heights, width, height, radius);
    const normalized = new Float64Array(sampled.heights.length);
    for (let index = 0; index < normalized.length; index += 1) normalized[index] = (sampled.heights[index] - mean[index]) / Math.max(1e-6, relief[index]);
    tpi[name] = normalized;
    localRelief[name] = relief;
  }

  const landformClass = new Uint8Array(sampled.heights.length);
  const ridgeSeed = new Uint8Array(sampled.heights.length);
  const valleySeed = new Uint8Array(sampled.heights.length);
  for (let index = 0; index < landformClass.length; index += 1) {
    const large = tpi.large[index];
    const medium = tpi.medium[index];
    const small = tpi.small[index];
    const slope = slopeMagnitude[index];
    let code;
    if (slope < 0.025 && Math.abs(large) < 0.04) code = 0;
    else if (large > 0.28 && medium > 0.18) code = 1;
    else if (large > 0.16 && planCurvature[index] < 0) code = 2;
    else if (large > 0.08 && small > 0.05) code = 3;
    else if (medium > 0.08 && profileCurvature[index] < 0) code = 4;
    else if (large < -0.28 && medium < -0.18) code = 9;
    else if (large < -0.16 && planCurvature[index] > 0) code = 8;
    else if (large < -0.08 && small < -0.05) code = 7;
    else if (medium < -0.08 && profileCurvature[index] > 0) code = 6;
    else code = 5;
    landformClass[index] = code;
    ridgeSeed[index] = code === 1 || code === 2 || code === 3 ? 1 : 0;
    valleySeed[index] = code === 7 || code === 8 || code === 9 ? 1 : 0;
  }
  const ridgeDistance = distanceTransform(ridgeSeed, width, height);
  const valleyDistance = distanceTransform(valleySeed, width, height);
  const flow = flowAccumulation(sampled.heights, width, height, sampled.xSpacing, sampled.zSpacing);

  const positiveOpenness = new Float64Array(sampled.heights.length);
  const negativeOpenness = new Float64Array(sampled.heights.length);
  const horizonDirections = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      let positive = 0, negative = 0;
      for (const [dx, dy] of horizonDirections) {
        const nx = clamp(x + dx * radii.large, 0, width - 1);
        const ny = clamp(y + dy * radii.large, 0, height - 1);
        const horizontal = Math.max(1e-6, Math.hypot((nx - x) * sampled.xSpacing, (ny - y) * sampled.zSpacing));
        const angle = Math.atan2(sampled.heights[ny * width + nx] - sampled.heights[index], horizontal);
        positive += Math.max(0, -angle);
        negative += Math.max(0, angle);
      }
      positiveOpenness[index] = positive / horizonDirections.length;
      negativeOpenness[index] = negative / horizonDirections.length;
    }
  }

  const hotspotWindow = options.hotspotWindowCells ?? 17;
  const hotspotStride = options.hotspotStrideCells ?? 8;
  const half = Math.floor(hotspotWindow / 2);
  const rawHotspots = [];
  for (let y = half; y < height - half; y += hotspotStride) {
    for (let x = half; x < width - half; x += hotspotStride) {
      rawHotspots.push({
        centerColumn: x,
        centerRow: y,
        worldX: domain.xMinimum + x * sampled.xSpacing,
        worldZ: domain.zMinimum + y * sampled.zSpacing,
        score: correlation(residual, width, height, dominant.dx, dominant.dy, { x0: x - half, y0: y - half, x1: x + half + 1, y1: y + half + 1 })
      });
    }
  }
  const threshold = percentile(rawHotspots.map((record) => record.score), options.hotspotRetentionQuantile ?? 0.75);
  const hotspots = rawHotspots.filter((record) => record.score >= threshold).sort((a, b) => b.score - a.score || a.centerRow - b.centerRow || a.centerColumn - b.centerColumn);
  const hotspotWeights = new Float64Array(sampled.heights.length);
  const maximumHotspot = Math.max(1e-9, ...hotspots.map((record) => record.score));
  for (const hotspot of hotspots) {
    const normalized = hotspot.score / maximumHotspot;
    for (let y = Math.max(0, hotspot.centerRow - half); y <= Math.min(height - 1, hotspot.centerRow + half); y += 1) {
      for (let x = Math.max(0, hotspot.centerColumn - half); x <= Math.min(width - 1, hotspot.centerColumn + half); x += 1) {
        const distance = Math.hypot(x - hotspot.centerColumn, y - hotspot.centerRow) / Math.max(1, half);
        hotspotWeights[y * width + x] = Math.max(hotspotWeights[y * width + x], normalized * Math.max(0, 1 - distance));
      }
    }
  }

  const classHistogram = Array(10).fill(0);
  for (const code of landformClass) classHistogram[code] += 1;
  const descriptorSummaries = {
    heights: summarize(sampled.heights),
    residual: summarize(residual),
    directionalSlope: summarize(directionalSlope),
    slopeMagnitude: summarize(slopeMagnitude),
    aspect: summarize(aspect),
    profileCurvature: summarize(profileCurvature),
    planCurvature: summarize(planCurvature),
    localReliefSmall: summarize(localRelief.small),
    localReliefMedium: summarize(localRelief.medium),
    localReliefLarge: summarize(localRelief.large),
    tpiSmall: summarize(tpi.small),
    tpiMedium: summarize(tpi.medium),
    tpiLarge: summarize(tpi.large),
    ridgeDistance: summarize(ridgeDistance),
    valleyDistance: summarize(valleyDistance),
    flowAccumulation: summarize(flow.accumulation),
    positiveOpenness: summarize(positiveOpenness),
    negativeOpenness: summarize(negativeOpenness),
    hotspotWeights: summarize(hotspotWeights)
  };
  const baselineDigest = hashStrings([
    width, height, sampled.xSpacing, sampled.zSpacing,
    dominant.orientationDegrees, dominant.lagCells, dominant.score,
    ...Object.values(descriptorSummaries).map((summary) => summary.digest),
    hashNumbers(landformClass), hashNumbers(ridgeSeed), hashNumbers(valleySeed),
    hashStrings(hotspots.map((record) => `${record.centerColumn}:${record.centerRow}:${record.score}`))
  ]);

  return {
    identity: 'H_EARTH_B1_MORPHOLOGY_DESCRIPTOR_BASELINE_v1',
    domain: { ...domain },
    grid: { width, height, xSpacing: sampled.xSpacing, zSpacing: sampled.zSpacing },
    heights: sampled.heights,
    residual,
    derivatives,
    directionalSlope,
    slopeMagnitude,
    aspect,
    profileCurvature,
    planCurvature,
    radii,
    localRelief,
    tpi,
    landformClass,
    classHistogram,
    ridgeSeed,
    valleySeed,
    ridgeDistance,
    valleyDistance,
    flowReceiver: flow.receiver,
    flowAccumulation: flow.accumulation,
    positiveOpenness,
    negativeOpenness,
    hotspotWeights,
    hotspots,
    repetition: {
      candidates,
      dominant: { ...dominant, lagWorldUnits: dominantLagWorldUnits },
      heightfieldDirectionalScore: dominant.score
    },
    summaries: descriptorSummaries,
    baselineDigest
  };
}

export default buildHEarthB1MorphologyDescriptorBaseline;
