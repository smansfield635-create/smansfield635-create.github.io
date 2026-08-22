import { getHEarthRun8ER2ImmutableLiveRenderPackage } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';

const BUFFER_ORDER = Object.freeze([
  'positions',
  'normals',
  'baseColorsLinear',
  'materialParameters',
  'materialModelCodes',
  'surfaceClassCodes',
  'primitiveIndices',
  'roleCodes',
  'indices'
]);

const textEncoder = new TextEncoder();

function fnv1a32(bytes) {
  let hash = 0x811c9dc5;
  for (const value of bytes) {
    hash ^= value & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}

function encodeString(value) {
  const body = textEncoder.encode(String(value));
  const bytes = new Uint8Array(body.length + 1);
  bytes.set(body, 0);
  bytes[bytes.length - 1] = 0xff;
  return bytes;
}

function encodeNumbers(values) {
  const bytes = new Uint8Array(values.length * 8 + 1);
  const view = new DataView(bytes.buffer);
  values.forEach((value, index) => view.setFloat64(index * 8, value, true));
  bytes[bytes.length - 1] = 0xfe;
  return bytes;
}

function concatenate(chunks) {
  const byteLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function countNumericEdges(values) {
  let nonFiniteValueCount = 0;
  let negativeZeroCount = 0;
  for (const value of values) {
    if (!Number.isFinite(value)) nonFiniteValueCount += 1;
    if (Object.is(value, -0)) negativeZeroCount += 1;
  }
  return { nonFiniteValueCount, negativeZeroCount };
}

async function sha256(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

export function buildCP3D1APositionLocalizationSnapshot(runtime = 'UNKNOWN') {
  const packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage();
  if (packageRecord?.eligible !== true) {
    throw new Error(`CP3D1A_PACKAGE_NOT_ELIGIBLE:${packageRecord?.issues?.join(',') ?? 'UNKNOWN'}`);
  }
  return Object.freeze({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1A_POSITION_LOCALIZATION_SNAPSHOT_v1',
    runtime,
    packageIdentity: packageRecord.packageIdentity,
    positions: [...packageRecord.buffers.positions],
    primitiveSpans: packageRecord.primitiveSpans.map(span => ({
      primitiveIndex: span.primitiveIndex,
      primitiveId: span.primitiveId,
      geometryId: span.geometryId,
      role: span.role,
      vertexStart: span.vertexStart,
      vertexCount: span.vertexCount,
      indexStart: span.indexStart,
      indexCount: span.indexCount
    }))
  });
}

export async function buildCP3D1PackageDeterminismReceipt(runtime = 'UNKNOWN') {
  const packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage();
  if (packageRecord?.eligible !== true) {
    throw new Error(`CP3D1_PACKAGE_NOT_ELIGIBLE:${packageRecord?.issues?.join(',') ?? 'UNKNOWN'}`);
  }

  const contractStrings = [
    packageRecord.sourceAuthorities.run8ER2ContractId,
    packageRecord.sourceAuthorities.packet002TransferContractId,
    packageRecord.sourceAuthorities.run8CMaterialContractId,
    packageRecord.sourceAuthorities.atmosphereContractId
  ];
  const primitiveIdentifiers = [...packageRecord.primitiveIds];
  const stringChunks = [...contractStrings, ...primitiveIdentifiers].map(encodeString);
  const bufferRecords = [];
  const numberChunks = [];
  let nonFiniteValueCount = 0;
  let negativeZeroCount = 0;

  for (const kind of BUFFER_ORDER) {
    const values = packageRecord.buffers[kind];
    const edges = countNumericEdges(values);
    nonFiniteValueCount += edges.nonFiniteValueCount;
    negativeZeroCount += edges.negativeZeroCount;
    const bytes = encodeNumbers(values);
    numberChunks.push(bytes);
    bufferRecords.push({
      kind,
      constructor: values?.constructor?.name ?? null,
      length: values.length,
      byteLength: bytes.byteLength,
      canonicalFloat64LittleEndianSha256: await sha256(bytes),
      fnv1a32: fnv1a32(bytes)
    });
  }

  const canonicalBytes = concatenate([...stringChunks, ...numberChunks]);
  const accumulationSteps = [];
  const accumulated = [];
  for (const [index, chunk] of [...stringChunks, ...numberChunks].entries()) {
    accumulated.push(chunk);
    const bytes = concatenate(accumulated);
    accumulationSteps.push({
      step: index + 1,
      kind: index < stringChunks.length ? 'STRING' : BUFFER_ORDER[index - stringChunks.length],
      cumulativeByteLength: bytes.byteLength,
      cumulativeFNV1A32: fnv1a32(bytes)
    });
  }

  return Object.freeze({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1_CROSS_RUNTIME_PACKAGE_DETERMINISM_RECEIPT_v1',
    runtime,
    packageIdentity: packageRecord.packageIdentity,
    contentDigest: packageRecord.contentDigest,
    hashAlgorithm: 'FNV1A32_OVER_UTF8_STRINGS_AND_FLOAT64_LE_NUMBERS',
    hashInputCount: contractStrings.length + primitiveIdentifiers.length + BUFFER_ORDER.length,
    hashInputByteLength: canonicalBytes.byteLength,
    primitiveCount: packageRecord.primitiveCount,
    primitiveOrder: primitiveIdentifiers.map((primitiveId, index) => ({ index, primitiveId })),
    primitiveIdentifiers,
    bufferCount: bufferRecords.length,
    bufferKinds: [...BUFFER_ORDER],
    bufferConstructors: bufferRecords.map(record => record.constructor),
    bufferLengths: Object.fromEntries(bufferRecords.map(record => [record.kind, record.length])),
    bufferByteLengths: Object.fromEntries(bufferRecords.map(record => [record.kind, record.byteLength])),
    bufferRecords,
    drawRangeCount: packageRecord.drawRanges.length,
    drawRangeOrder: packageRecord.drawRanges.map((range, index) => ({ index, primitiveIds: [...range.primitiveIds] })),
    drawRangeValues: packageRecord.drawRanges.map(range => ({
      role: range.role,
      transparencyClass: range.transparencyClass,
      materialModelCode: range.materialModelCode,
      indexStart: range.indexStart,
      indexCount: range.indexCount,
      primitiveCount: range.primitiveCount,
      primitiveIds: [...range.primitiveIds]
    })),
    serializationVersion: 'CP3D1_CANONICAL_FLOAT64_LE_v1',
    numericNormalizationRules: [
      'FINITE_JAVASCRIPT_NUMBER_REQUIRED',
      'NO_ROUNDING_BEFORE_ENCODING',
      'FLOAT64_LITTLE_ENDIAN',
      'NEGATIVE_ZERO_PRESERVED'
    ],
    endiannessAssumption: 'EXPLICIT_LITTLE_ENDIAN_DATAVIEW',
    nonFiniteValueCount,
    negativeZeroCount,
    canonicalBytesSHA256: await sha256(canonicalBytes),
    canonicalBytesFNV1A32: fnv1a32(canonicalBytes),
    canonicalByteLength: canonicalBytes.byteLength,
    hashAccumulationSteps: accumulationSteps
  });
}
