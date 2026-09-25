import { getHEarthRun8ER2ImmutableLiveRenderPackage } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';

const textEncoder = new TextEncoder();

function encodeFloat64(values) {
  const bytes = new Uint8Array(values.length * 8);
  const view = new DataView(bytes.buffer);
  values.forEach((value, index) => view.setFloat64(index * 8, value, true));
  return bytes;
}

async function sha256(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

const canonicalizers = Object.freeze([
  {
    id: 'FLOAT32_MATH_FROUND',
    law: 'CANONICAL_VALUE=Math.fround(SOURCE_VALUE)',
    apply: value => Math.fround(value)
  },
  {
    id: 'BINARY_GRID_2_NEGATIVE_20',
    law: 'CANONICAL_VALUE=Math.round(SOURCE_VALUE*2^20)/2^20',
    apply: value => Math.round(value * 1048576) / 1048576
  },
  {
    id: 'BINARY_GRID_2_NEGATIVE_24',
    law: 'CANONICAL_VALUE=Math.round(SOURCE_VALUE*2^24)/2^24',
    apply: value => Math.round(value * 16777216) / 16777216
  },
  {
    id: 'DECIMAL_FIXED_12',
    law: 'CANONICAL_VALUE=Number(SOURCE_VALUE.toFixed(12))',
    apply: value => Number(value.toFixed(12))
  },
  {
    id: 'DECIMAL_FIXED_13',
    law: 'CANONICAL_VALUE=Number(SOURCE_VALUE.toFixed(13))',
    apply: value => Number(value.toFixed(13))
  },
  {
    id: 'DECIMAL_FIXED_14',
    law: 'CANONICAL_VALUE=Number(SOURCE_VALUE.toFixed(14))',
    apply: value => Number(value.toFixed(14))
  },
  {
    id: 'DECIMAL_FIXED_15',
    law: 'CANONICAL_VALUE=Number(SOURCE_VALUE.toFixed(15))',
    apply: value => Number(value.toFixed(15))
  }
]);

export async function buildCP3D1CCanonicalizationReceipt(runtime = 'UNKNOWN') {
  const packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage();
  if (packageRecord?.eligible !== true) throw new Error('CP3D1C_PACKAGE_NOT_ELIGIBLE');
  const source = packageRecord.buffers.positions;
  const candidates = [];

  for (const candidate of canonicalizers) {
    let changedElementCount = 0;
    let maximumAbsoluteAdjustment = 0;
    let negativeZeroCount = 0;
    const values = source.map(value => {
      const canonical = candidate.apply(value);
      if (!Number.isFinite(canonical)) throw new Error(`CP3D1C_NONFINITE:${candidate.id}`);
      if (!Object.is(canonical, value)) changedElementCount += 1;
      maximumAbsoluteAdjustment = Math.max(maximumAbsoluteAdjustment, Math.abs(canonical - value));
      if (Object.is(canonical, -0)) negativeZeroCount += 1;
      return Object.is(canonical, -0) ? 0 : canonical;
    });
    const bytes = encodeFloat64(values);
    candidates.push({
      candidateId: candidate.id,
      law: candidate.law,
      elementCount: values.length,
      changedElementCount,
      maximumAbsoluteAdjustment,
      negativeZeroCount,
      canonicalByteLength: bytes.byteLength,
      canonicalFloat64LittleEndianSHA256: await sha256(bytes),
      vertex72Y: values[217],
      vertex72YText: textEncoder.encode(String(values[217])).length
    });
  }

  return Object.freeze({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1C_CANONICAL_NUMERIC_NORMALIZATION_CANDIDATE_RECEIPT_v1',
    runtime,
    sourcePackageIdentity: packageRecord.packageIdentity,
    sourcePositionElementCount: source.length,
    sourcePositionSHA256: await sha256(encodeFloat64(source)),
    candidates
  });
}
