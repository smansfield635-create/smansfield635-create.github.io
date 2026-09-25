const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

function srgbToLinear(value) {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(bytes) {
  const values = new Float32Array(bytes.length / 4);
  for (let index = 0; index < values.length; index += 1) {
    const offset = index * 4;
    values[index] =
      0.2126 * srgbToLinear(bytes[offset]) +
      0.7152 * srgbToLinear(bytes[offset + 1]) +
      0.0722 * srgbToLinear(bytes[offset + 2]);
  }
  return values;
}

function normalizeValues(values, mask, width, height, outputWidth, outputHeight) {
  const outputValues = new Float32Array(outputWidth * outputHeight);
  const outputMask = new Uint8Array(outputWidth * outputHeight);
  for (let outputY = 0; outputY < outputHeight; outputY += 1) {
    const y0 = Math.floor(outputY * height / outputHeight);
    const y1 = Math.max(y0 + 1, Math.floor((outputY + 1) * height / outputHeight));
    for (let outputX = 0; outputX < outputWidth; outputX += 1) {
      const x0 = Math.floor(outputX * width / outputWidth);
      const x1 = Math.max(x0 + 1, Math.floor((outputX + 1) * width / outputWidth));
      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          const index = y * width + x;
          if (!mask[index]) continue;
          sum += values[index];
          count += 1;
        }
      }
      const target = outputY * outputWidth + outputX;
      outputMask[target] = count >= ((x1 - x0) * (y1 - y0) * 0.5) ? 1 : 0;
      outputValues[target] = count ? sum / count : 0;
    }
  }
  return { values: outputValues, mask: outputMask };
}

function gaussianBlur(values, width, height, sigma) {
  const radius = Math.ceil(sigma * 2.5);
  const kernel = new Float32Array(radius * 2 + 1);
  let total = 0;
  for (let offset = -radius; offset <= radius; offset += 1) {
    const value = Math.exp(-(offset * offset) / (2 * sigma * sigma));
    kernel[offset + radius] = value;
    total += value;
  }
  for (let index = 0; index < kernel.length; index += 1) kernel[index] /= total;
  const temporary = new Float32Array(values.length);
  const output = new Float32Array(values.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let value = 0;
      for (let kernelOffset = -radius; kernelOffset <= radius; kernelOffset += 1) {
        value += values[y * width + clamp(x + kernelOffset, 0, width - 1)] * kernel[kernelOffset + radius];
      }
      temporary[y * width + x] = value;
    }
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let value = 0;
      for (let kernelOffset = -radius; kernelOffset <= radius; kernelOffset += 1) {
        value += temporary[clamp(y + kernelOffset, 0, height - 1) * width + x] * kernel[kernelOffset + radius];
      }
      output[y * width + x] = value;
    }
  }
  return output;
}

function directionalPeak(values, mask, width, height, orientations, lags) {
  let mean = 0;
  let count = 0;
  for (let index = 0; index < values.length; index += 1) {
    if (!mask[index]) continue;
    mean += values[index];
    count += 1;
  }
  mean /= Math.max(1, count);
  let best = {
    peakStrength: 0,
    signedCorrelation: 0,
    dominantOrientationDegrees: orientations[0],
    dominantLagPixels: lags[0],
    pairCount: 0
  };
  const grid = [];
  for (const orientationDegrees of orientations) {
    const radians = orientationDegrees * Math.PI / 180;
    for (const lagPixels of lags) {
      const dx = Math.round(Math.cos(radians) * lagPixels);
      const dy = Math.round(Math.sin(radians) * lagPixels);
      let numerator = 0;
      let leftEnergy = 0;
      let rightEnergy = 0;
      let pairs = 0;
      for (let y = Math.max(0, -dy); y < Math.min(height, height - dy); y += 1) {
        for (let x = Math.max(0, -dx); x < Math.min(width, width - dx); x += 1) {
          const left = y * width + x;
          const right = (y + dy) * width + x + dx;
          if (!mask[left] || !mask[right]) continue;
          const a = values[left] - mean;
          const b = values[right] - mean;
          numerator += a * b;
          leftEnergy += a * a;
          rightEnergy += b * b;
          pairs += 1;
        }
      }
      const signedCorrelation = pairs > 32 && leftEnergy > 1e-12 && rightEnergy > 1e-12
        ? numerator / Math.sqrt(leftEnergy * rightEnergy)
        : 0;
      const peakStrength = Math.abs(signedCorrelation);
      grid.push({ orientationDegrees, lagPixels, dx, dy, pairCount: pairs, signedCorrelation, peakStrength });
      if (peakStrength > best.peakStrength) {
        best = {
          peakStrength,
          signedCorrelation,
          dominantOrientationDegrees: orientationDegrees,
          dominantLagPixels: lagPixels,
          pairCount: pairs
        };
      }
    }
  }
  return { ...best, grid };
}

export function analyzeDirectionalFrame(bytes, depthMask, width, height, analysis) {
  const normalized = normalizeValues(
    luminance(bytes),
    depthMask,
    width,
    height,
    analysis.normalizedAnalysisSize.width,
    analysis.normalizedAnalysisSize.height
  );
  const [sigmaMicro, sigmaMeso, sigmaMacro] = analysis.gaussianSigmasPixels;
  const blurMicro = gaussianBlur(normalized.values, analysis.normalizedAnalysisSize.width, analysis.normalizedAnalysisSize.height, sigmaMicro);
  const blurMeso = gaussianBlur(normalized.values, analysis.normalizedAnalysisSize.width, analysis.normalizedAnalysisSize.height, sigmaMeso);
  const blurMacro = gaussianBlur(normalized.values, analysis.normalizedAnalysisSize.width, analysis.normalizedAnalysisSize.height, sigmaMacro);
  const micro = new Float32Array(normalized.values.length);
  const meso = new Float32Array(normalized.values.length);
  const macro = new Float32Array(normalized.values.length);
  for (let index = 0; index < normalized.values.length; index += 1) {
    micro[index] = normalized.values[index] - blurMicro[index];
    meso[index] = blurMicro[index] - blurMeso[index];
    macro[index] = blurMeso[index] - blurMacro[index];
  }
  const bands = {
    micro: directionalPeak(micro, normalized.mask, analysis.normalizedAnalysisSize.width, analysis.normalizedAnalysisSize.height, analysis.orientationsDegrees, analysis.lagsPixels),
    meso: directionalPeak(meso, normalized.mask, analysis.normalizedAnalysisSize.width, analysis.normalizedAnalysisSize.height, analysis.orientationsDegrees, analysis.lagsPixels),
    macro: directionalPeak(macro, normalized.mask, analysis.normalizedAnalysisSize.width, analysis.normalizedAnalysisSize.height, analysis.orientationsDegrees, analysis.lagsPixels)
  };
  const dominantBand = Object.entries(bands)
    .sort((left, right) => right[1].peakStrength - left[1].peakStrength)[0];
  const eligiblePixelCount = normalized.mask.reduce((sum, value) => sum + value, 0);
  return {
    bands,
    sceneScore: average(Object.values(bands).map((band) => band.peakStrength)),
    dominantBand: dominantBand[0],
    dominantOrientationDegrees: dominantBand[1].dominantOrientationDegrees,
    dominantLagPixels: dominantBand[1].dominantLagPixels,
    peakStrength: dominantBand[1].peakStrength,
    eligiblePixelCount,
    eligibleFraction: eligiblePixelCount / normalized.mask.length
  };
}

export function summarizePassScenes(sceneRecords) {
  const aggregateScore = average(sceneRecords.map((record) => record.metric.sceneScore));
  const total = sceneRecords.reduce((sum, record) => sum + record.metric.sceneScore, 0);
  return {
    aggregateScore,
    sceneCount: sceneRecords.length,
    sceneContributions: sceneRecords.map((record) => ({
      sceneId: record.scene.id,
      score: record.metric.sceneScore,
      contributionFraction: total > 0 ? record.metric.sceneScore / total : 0,
      dominantBand: record.metric.dominantBand,
      dominantOrientationDegrees: record.metric.dominantOrientationDegrees,
      dominantLagPixels: record.metric.dominantLagPixels,
      peakStrength: record.metric.peakStrength
    }))
  };
}

export default analyzeDirectionalFrame;
