/**
 * FD_05 contract-specific admission and receipt construction for F5 and F13.
 * This module verifies exact bytes and digest domains. It does not mutate source.
 */
import {
  canonicalizeRfc8785,
  deepFreeze,
  digestCanonicalObject,
  isNonEmptyString,
  isRecord
} from './evidence.js?v=fd05-nine-cycle-20260718a';

export const H_EARTH_FD05_ENGINEERING_DISPOSITION_RECEIPT_CONTRACT_ID =
  'H_EARTH_FD05_ENGINEERING_DISPOSITION_RECEIPT_CONTRACT_v1';
export const H_EARTH_FD05_REPOSITORY_OCCURRENCE_RECEIPT_CONTRACT_ID =
  'H_EARTH_FD05_REPOSITORY_OCCURRENCE_RECEIPT_CONTRACT_v1';

export const H_EARTH_FD05_ENGINEERING_RECEIPT_DIGEST_DOMAIN =
  'H_EARTH_FD05:ENGINEERING_DISPOSITION_RECEIPT:v1';
export const H_EARTH_FD05_REPOSITORY_RECEIPT_DIGEST_DOMAIN =
  'H_EARTH_FD05:REPOSITORY_OCCURRENCE_RECEIPT:v1';
export const H_EARTH_FD05_DECODED_BYTE_PROVENANCE =
  'EXACT_BASE64_DECODED_BROWSER_PACKAGE_ROW_BYTES';

export const H_EARTH_FD05_PINNED_REPOSITORY_FULL_NAME =
  'smansfield635-create/smansfield635-create.github.io';
export const H_EARTH_FD05_PINNED_REPOSITORY_COMMIT =
  '41f1fc2a99f3161966d6ad2228a6e2d12a8890d6';
export const H_EARTH_FD05_EAST_REPOSITORY_PATH =
  '/showroom/globe/h-earth/render/geometry-kernel.east.js';
export const H_EARTH_FD05_PINNED_EAST_GIT_BLOB_SHA =
  'b9872c89291f9ec6d404fd7203d7de57826670cf';

const HEX_SHA256 = /^[a-f0-9]{64}$/;
const HEX_SHA1 = /^[a-f0-9]{40}$/;
const RECEIPT_DIGEST_KEYS = Object.freeze([
  'algorithm',
  'canonicalization',
  'domain',
  'encoding',
  'value'
]);
const ENGINEERING_RECEIPT_KEYS = Object.freeze([
  'browserPackageDigest',
  'browserPackageId',
  'claimCeiling',
  'contractId',
  'createdAt',
  'decodedByteProvenance',
  'engineeringFinding',
  'manifestDigest',
  'manifestId',
  'parser',
  'productionClaimAuthority',
  'receiptDigest',
  'receiptId',
  'rowResults',
  'sourceCorrectionAuthority',
  'syntaxFailureCount',
  'syntaxPassCount'
]);
const ENGINEERING_PARSER_KEYS = Object.freeze(['mode', 'name', 'version']);
const ENGINEERING_ROW_KEYS = Object.freeze([
  'boundedSourceExcerpt',
  'captureOrder',
  'decodedByteProvenance',
  'parseError',
  'parseResult',
  'repositoryPath',
  'sourceByteLength',
  'sourceSha256'
]);
const PARSE_ERROR_KEYS = Object.freeze(['column', 'line', 'message', 'name']);
const ENGINEERING_FINDING_KEYS = Object.freeze([
  'boundedSourceExcerpt',
  'captureOrder',
  'column',
  'errorMessage',
  'errorName',
  'line',
  'repositoryPath'
]);
const REPOSITORY_RECEIPT_KEYS = Object.freeze([
  'browserPackageDigest',
  'browserPackageId',
  'claimCeiling',
  'contractId',
  'createdAt',
  'deployedEastSha256',
  'digestCalculationDomain',
  'gitBlobSha',
  'productionClaimAuthority',
  'receiptDigest',
  'receiptId',
  'repositoryByteLength',
  'repositoryBytes',
  'repositoryCommit',
  'repositoryDeploymentComparison',
  'repositoryFullName',
  'repositoryPath',
  'repositorySha256',
  'sourceCorrectionAuthority'
]);
const REPOSITORY_BYTES_KEYS = Object.freeze(['encoding', 'value']);
const REPOSITORY_DIGEST_DOMAIN_KEYS = Object.freeze([
  'gitBlobSha',
  'receiptDigest',
  'repositorySha256'
]);
const CLAIM_CEILING_KEYS = Object.freeze([
  'incidentClosureEstablished',
  'productionClaimAuthority',
  'sourceCorrectionAuthority'
]);

const clone = (value) =>
  Array.isArray(value)
    ? value.map(clone)
    : isRecord(value)
      ? Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, clone(nested)]))
      : value;

const exactKeys = (value, expected) =>
  isRecord(value) &&
  Object.keys(value).length === expected.length &&
  Object.keys(value).sort().every((key, index) => key === expected[index]);

const canonicalEqual = (left, right) => {
  try {
    return canonicalizeRfc8785(left) === canonicalizeRfc8785(right);
  } catch {
    return false;
  }
};

const without = (value, key) => {
  const copy = clone(value);
  delete copy[key];
  return copy;
};

function digestDescriptor(domain, value) {
  return {
    algorithm: 'SHA-256',
    canonicalization: 'RFC8785',
    domain,
    encoding: 'LOWERCASE_HEXADECIMAL',
    value
  };
}

function validDigestDescriptor(value, domain) {
  return (
    exactKeys(value, RECEIPT_DIGEST_KEYS) &&
    value.algorithm === 'SHA-256' &&
    value.canonicalization === 'RFC8785' &&
    value.domain === domain &&
    value.encoding === 'LOWERCASE_HEXADECIMAL' &&
    typeof value.value === 'string' &&
    HEX_SHA256.test(value.value)
  );
}

function validClaimCeiling(value) {
  return (
    exactKeys(value, CLAIM_CEILING_KEYS) &&
    value.sourceCorrectionAuthority === 'WITHHELD' &&
    value.productionClaimAuthority === 'NONE' &&
    value.incidentClosureEstablished === false
  );
}

function packageDigestObject(browserPackage) {
  return browserPackage?.packageDigest ?? null;
}

function packageRows(browserPackage) {
  return Array.isArray(browserPackage?.rows) ? browserPackage.rows : [];
}

function packageEastRow(browserPackage) {
  return packageRows(browserPackage).find(
    (row) =>
      row?.captureOrder === 13 &&
      row?.repositoryPath === H_EARTH_FD05_EAST_REPOSITORY_PATH
  ) ?? null;
}

function base64ToBytes(value, atobImpl = globalThis.atob) {
  if (typeof value !== 'string' || typeof atobImpl !== 'function') {
    throw new Error('BASE64_DECODER_UNAVAILABLE');
  }
  const binary = atobImpl(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function bytesToBase64(bytes, btoaImpl = globalThis.btoa) {
  if (!(bytes instanceof Uint8Array) || typeof btoaImpl !== 'function') {
    throw new Error('BASE64_ENCODER_UNAVAILABLE');
  }
  const chunkSize = 0x8000;
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoaImpl(binary);
}

async function digestBytes(algorithm, bytes, cryptoObject = globalThis.crypto) {
  if (!cryptoObject?.subtle || typeof cryptoObject.subtle.digest !== 'function') {
    throw new Error('WEB_CRYPTO_SUBTLE_DIGEST_UNAVAILABLE');
  }
  const result = await cryptoObject.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(result), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

async function gitBlobSha(bytes, cryptoObject, TextEncoderImpl = globalThis.TextEncoder) {
  if (typeof TextEncoderImpl !== 'function') {
    throw new Error('TEXT_ENCODER_UNAVAILABLE');
  }
  const header = new TextEncoderImpl().encode(`blob ${bytes.byteLength}\0`);
  const input = new Uint8Array(header.byteLength + bytes.byteLength);
  input.set(header, 0);
  input.set(bytes, header.byteLength);
  return digestBytes('SHA-1', input, cryptoObject);
}

function classifyIdentityIssues(issues) {
  return issues.some((issue) =>
    issue.includes('IDENTITY') ||
    issue.includes('PACKAGE_ID') ||
    issue.includes('MANIFEST') ||
    issue.includes('REPOSITORY_FULL_NAME') ||
    issue.includes('REPOSITORY_COMMIT') ||
    issue.includes('REPOSITORY_PATH')
  );
}

export async function buildHEarthFd05EngineeringDispositionReceipt({
  browserPackage,
  parser,
  rowResults,
  receiptId,
  createdAt = new Date().toISOString(),
  cryptoObject = globalThis.crypto,
  TextEncoderImpl = globalThis.TextEncoder
} = {}) {
  const passes = rowResults.filter((row) => row.parseResult === 'PASS');
  const failures = rowResults.filter((row) => row.parseResult === 'FAIL');
  const failure = failures[0] ?? null;
  const body = {
    browserPackageDigest: clone(packageDigestObject(browserPackage)),
    browserPackageId: browserPackage?.packetId ?? null,
    claimCeiling: {
      incidentClosureEstablished: false,
      productionClaimAuthority: 'NONE',
      sourceCorrectionAuthority: 'WITHHELD'
    },
    contractId: H_EARTH_FD05_ENGINEERING_DISPOSITION_RECEIPT_CONTRACT_ID,
    createdAt,
    decodedByteProvenance: H_EARTH_FD05_DECODED_BYTE_PROVENANCE,
    engineeringFinding: failure
      ? {
          boundedSourceExcerpt: failure.boundedSourceExcerpt,
          captureOrder: failure.captureOrder,
          column: failure.parseError?.column ?? null,
          errorMessage: failure.parseError?.message ?? null,
          errorName: failure.parseError?.name ?? null,
          line: failure.parseError?.line ?? null,
          repositoryPath: failure.repositoryPath
        }
      : null,
    manifestDigest: browserPackage?.manifestDigest ?? null,
    manifestId: browserPackage?.manifestId ?? null,
    parser: clone(parser),
    productionClaimAuthority: 'NONE',
    receiptId,
    rowResults: clone(rowResults),
    sourceCorrectionAuthority: 'WITHHELD',
    syntaxFailureCount: failures.length,
    syntaxPassCount: passes.length
  };
  const computed = await digestCanonicalObject(body, cryptoObject, TextEncoderImpl);
  return deepFreeze({
    ...body,
    receiptDigest: digestDescriptor(
      H_EARTH_FD05_ENGINEERING_RECEIPT_DIGEST_DOMAIN,
      computed.digest
    )
  });
}

export async function verifyHEarthFd05EngineeringDispositionReceipt({
  receipt,
  browserPackage,
  manifest,
  cryptoObject = globalThis.crypto,
  TextEncoderImpl = globalThis.TextEncoder
} = {}) {
  const issues = [];
  if (!exactKeys(receipt, ENGINEERING_RECEIPT_KEYS)) {
    issues.push('ENGINEERING_RECEIPT_FIELD_SURFACE_INVALID');
  }
  if (receipt?.contractId !== H_EARTH_FD05_ENGINEERING_DISPOSITION_RECEIPT_CONTRACT_ID) {
    issues.push('ENGINEERING_RECEIPT_CONTRACT_IDENTITY_INVALID');
  }
  if (!isNonEmptyString(receipt?.receiptId) || !isNonEmptyString(receipt?.createdAt)) {
    issues.push('ENGINEERING_RECEIPT_IDENTITY_INVALID');
  }
  if (
    receipt?.manifestId !== manifest?.manifestId ||
    receipt?.manifestDigest !== manifest?.manifestDigest ||
    receipt?.manifestId !== browserPackage?.manifestId ||
    receipt?.manifestDigest !== browserPackage?.manifestDigest
  ) {
    issues.push('ENGINEERING_RECEIPT_MANIFEST_IDENTITY_INVALID');
  }
  if (
    receipt?.browserPackageId !== browserPackage?.packetId ||
    !canonicalEqual(receipt?.browserPackageDigest, packageDigestObject(browserPackage))
  ) {
    issues.push('ENGINEERING_RECEIPT_PACKAGE_IDENTITY_INVALID');
  }
  if (
    !exactKeys(receipt?.parser, ENGINEERING_PARSER_KEYS) ||
    !isNonEmptyString(receipt?.parser?.name) ||
    !isNonEmptyString(receipt?.parser?.version) ||
    receipt?.parser?.mode !== 'ES_MODULE'
  ) {
    issues.push('ENGINEERING_RECEIPT_PARSER_IDENTITY_INVALID');
  }
  if (receipt?.decodedByteProvenance !== H_EARTH_FD05_DECODED_BYTE_PROVENANCE) {
    issues.push('ENGINEERING_RECEIPT_DECODED_BYTE_PROVENANCE_INVALID');
  }

  const rows = Array.isArray(receipt?.rowResults) ? receipt.rowResults : [];
  if (rows.length !== 19 || packageRows(browserPackage).length !== 19) {
    issues.push('ENGINEERING_RECEIPT_EXACT_NINETEEN_INVALID');
  }
  const seenOrders = new Set();
  const seenPaths = new Set();
  let passCount = 0;
  let failureCount = 0;
  for (const rowResult of rows) {
    if (!exactKeys(rowResult, ENGINEERING_ROW_KEYS)) {
      issues.push('ENGINEERING_RECEIPT_ROW_FIELD_SURFACE_INVALID');
      continue;
    }
    if (seenOrders.has(rowResult.captureOrder) || seenPaths.has(rowResult.repositoryPath)) {
      issues.push('ENGINEERING_RECEIPT_ROW_UNIQUENESS_INVALID');
    }
    seenOrders.add(rowResult.captureOrder);
    seenPaths.add(rowResult.repositoryPath);
    const packageRow = packageRows(browserPackage).find(
      (row) =>
        row.captureOrder === rowResult.captureOrder &&
        row.repositoryPath === rowResult.repositoryPath
    );
    if (!packageRow) {
      issues.push(`ENGINEERING_RECEIPT_ROW_IDENTITY_INVALID:${rowResult.captureOrder}`);
      continue;
    }
    if (
      rowResult.sourceByteLength !== packageRow.responseByteLength ||
      rowResult.sourceSha256 !== packageRow.deployedSha256
    ) {
      issues.push(`ENGINEERING_RECEIPT_ROW_SOURCE_BINDING_INVALID:${rowResult.captureOrder}`);
    }
    if (rowResult.decodedByteProvenance !== H_EARTH_FD05_DECODED_BYTE_PROVENANCE) {
      issues.push(`ENGINEERING_RECEIPT_ROW_PROVENANCE_INVALID:${rowResult.captureOrder}`);
    }
    if (rowResult.parseResult === 'PASS') {
      passCount += 1;
      if (rowResult.parseError !== null || rowResult.boundedSourceExcerpt !== null) {
        issues.push(`ENGINEERING_RECEIPT_PASS_ROW_PAYLOAD_INVALID:${rowResult.captureOrder}`);
      }
    } else if (rowResult.parseResult === 'FAIL') {
      failureCount += 1;
      if (
        !exactKeys(rowResult.parseError, PARSE_ERROR_KEYS) ||
        rowResult.parseError?.name !== 'SyntaxError' ||
        !isNonEmptyString(rowResult.parseError?.message) ||
        !Number.isInteger(rowResult.parseError?.line) ||
        !Number.isInteger(rowResult.parseError?.column) ||
        !isNonEmptyString(rowResult.boundedSourceExcerpt) ||
        rowResult.boundedSourceExcerpt.length > 1200
      ) {
        issues.push(`ENGINEERING_RECEIPT_FAILURE_ROW_PAYLOAD_INVALID:${rowResult.captureOrder}`);
      }
    } else {
      issues.push(`ENGINEERING_RECEIPT_PARSE_RESULT_INVALID:${rowResult.captureOrder}`);
    }
  }

  const failure = rows.find((row) => row.parseResult === 'FAIL') ?? null;
  if (
    passCount !== 18 ||
    failureCount !== 1 ||
    receipt?.syntaxPassCount !== 18 ||
    receipt?.syntaxFailureCount !== 1 ||
    failure?.captureOrder !== 13 ||
    failure?.repositoryPath !== H_EARTH_FD05_EAST_REPOSITORY_PATH
  ) {
    issues.push('ENGINEERING_RECEIPT_PARSE_DISTRIBUTION_INVALID');
  }
  const expectedFinding = failure
    ? {
        boundedSourceExcerpt: failure.boundedSourceExcerpt,
        captureOrder: failure.captureOrder,
        column: failure.parseError?.column ?? null,
        errorMessage: failure.parseError?.message ?? null,
        errorName: failure.parseError?.name ?? null,
        line: failure.parseError?.line ?? null,
        repositoryPath: failure.repositoryPath
      }
    : null;
  if (
    !exactKeys(receipt?.engineeringFinding, ENGINEERING_FINDING_KEYS) ||
    !canonicalEqual(receipt?.engineeringFinding, expectedFinding)
  ) {
    issues.push('ENGINEERING_RECEIPT_FINDING_INVALID');
  }
  if (
    !validClaimCeiling(receipt?.claimCeiling) ||
    receipt?.sourceCorrectionAuthority !== 'WITHHELD' ||
    receipt?.productionClaimAuthority !== 'NONE'
  ) {
    issues.push('ENGINEERING_RECEIPT_CLAIM_CEILING_INVALID');
  }

  let computedDigest = null;
  try {
    computedDigest = (
      await digestCanonicalObject(without(receipt, 'receiptDigest'), cryptoObject, TextEncoderImpl)
    ).digest;
  } catch {
    issues.push('ENGINEERING_RECEIPT_DIGEST_DOMAIN_UNCOMPUTABLE');
  }
  if (
    !validDigestDescriptor(
      receipt?.receiptDigest,
      H_EARTH_FD05_ENGINEERING_RECEIPT_DIGEST_DOMAIN
    ) ||
    computedDigest !== receipt?.receiptDigest?.value
  ) {
    issues.push('ENGINEERING_RECEIPT_DIGEST_INVALID');
  }

  return deepFreeze({
    computedDigest,
    identityConflict: classifyIdentityIssues(issues),
    issues,
    valid: issues.length === 0,
    failure: clone(expectedFinding),
    parser: clone(receipt?.parser ?? null),
    syntaxFailureCount: failureCount,
    syntaxPassCount: passCount
  });
}

export async function buildHEarthFd05RepositoryOccurrenceReceipt({
  browserPackage,
  repositoryBytes,
  receiptId,
  createdAt = new Date().toISOString(),
  cryptoObject = globalThis.crypto,
  TextEncoderImpl = globalThis.TextEncoder,
  btoaImpl = globalThis.btoa
} = {}) {
  const bytes = repositoryBytes instanceof Uint8Array
    ? repositoryBytes
    : new Uint8Array(repositoryBytes ?? 0);
  const repositorySha256 = await digestBytes('SHA-256', bytes, cryptoObject);
  const blobSha = await gitBlobSha(bytes, cryptoObject, TextEncoderImpl);
  const deployedEastSha256 = packageEastRow(browserPackage)?.deployedSha256 ?? null;
  const body = {
    browserPackageDigest: clone(packageDigestObject(browserPackage)),
    browserPackageId: browserPackage?.packetId ?? null,
    claimCeiling: {
      incidentClosureEstablished: false,
      productionClaimAuthority: 'NONE',
      sourceCorrectionAuthority: 'WITHHELD'
    },
    contractId: H_EARTH_FD05_REPOSITORY_OCCURRENCE_RECEIPT_CONTRACT_ID,
    createdAt,
    deployedEastSha256,
    digestCalculationDomain: {
      gitBlobSha: 'SHA-1 over ASCII "blob <byteLength>\\0" followed by exact repository file bytes',
      repositorySha256: 'SHA-256 over exact repository file bytes',
      receiptDigest: `RFC8785 canonical UTF-8 bytes of the receipt excluding receiptDigest; domain ${H_EARTH_FD05_REPOSITORY_RECEIPT_DIGEST_DOMAIN}`
    },
    gitBlobSha: blobSha,
    productionClaimAuthority: 'NONE',
    receiptId,
    repositoryByteLength: bytes.byteLength,
    repositoryBytes: {
      encoding: 'BASE64',
      value: bytesToBase64(bytes, btoaImpl)
    },
    repositoryCommit: H_EARTH_FD05_PINNED_REPOSITORY_COMMIT,
    repositoryDeploymentComparison:
      repositorySha256 === deployedEastSha256 ? 'MATCH' : 'MISMATCH',
    repositoryFullName: H_EARTH_FD05_PINNED_REPOSITORY_FULL_NAME,
    repositoryPath: H_EARTH_FD05_EAST_REPOSITORY_PATH,
    repositorySha256,
    sourceCorrectionAuthority: 'WITHHELD'
  };
  const computed = await digestCanonicalObject(body, cryptoObject, TextEncoderImpl);
  return deepFreeze({
    ...body,
    receiptDigest: digestDescriptor(
      H_EARTH_FD05_REPOSITORY_RECEIPT_DIGEST_DOMAIN,
      computed.digest
    )
  });
}

export async function verifyHEarthFd05RepositoryOccurrenceReceipt({
  receipt,
  browserPackage,
  cryptoObject = globalThis.crypto,
  TextEncoderImpl = globalThis.TextEncoder,
  atobImpl = globalThis.atob,
  expectedGitBlobSha = H_EARTH_FD05_PINNED_EAST_GIT_BLOB_SHA
} = {}) {
  const issues = [];
  if (!exactKeys(receipt, REPOSITORY_RECEIPT_KEYS)) {
    issues.push('REPOSITORY_RECEIPT_FIELD_SURFACE_INVALID');
  }
  if (receipt?.contractId !== H_EARTH_FD05_REPOSITORY_OCCURRENCE_RECEIPT_CONTRACT_ID) {
    issues.push('REPOSITORY_RECEIPT_CONTRACT_IDENTITY_INVALID');
  }
  if (!isNonEmptyString(receipt?.receiptId) || !isNonEmptyString(receipt?.createdAt)) {
    issues.push('REPOSITORY_RECEIPT_IDENTITY_INVALID');
  }
  if (
    receipt?.browserPackageId !== browserPackage?.packetId ||
    !canonicalEqual(receipt?.browserPackageDigest, packageDigestObject(browserPackage))
  ) {
    issues.push('REPOSITORY_RECEIPT_PACKAGE_IDENTITY_INVALID');
  }
  if (receipt?.repositoryFullName !== H_EARTH_FD05_PINNED_REPOSITORY_FULL_NAME) {
    issues.push('REPOSITORY_RECEIPT_REPOSITORY_FULL_NAME_INVALID');
  }
  if (receipt?.repositoryCommit !== H_EARTH_FD05_PINNED_REPOSITORY_COMMIT) {
    issues.push('REPOSITORY_RECEIPT_REPOSITORY_COMMIT_INVALID');
  }
  if (receipt?.repositoryPath !== H_EARTH_FD05_EAST_REPOSITORY_PATH) {
    issues.push('REPOSITORY_RECEIPT_REPOSITORY_PATH_INVALID');
  }
  if (
    !exactKeys(receipt?.repositoryBytes, REPOSITORY_BYTES_KEYS) ||
    receipt?.repositoryBytes?.encoding !== 'BASE64' ||
    !isNonEmptyString(receipt?.repositoryBytes?.value)
  ) {
    issues.push('REPOSITORY_RECEIPT_BYTES_INVALID');
  }
  if (!exactKeys(receipt?.digestCalculationDomain, REPOSITORY_DIGEST_DOMAIN_KEYS)) {
    issues.push('REPOSITORY_RECEIPT_DIGEST_DOMAIN_INVALID');
  }

  let bytes = null;
  let computedSha256 = null;
  let computedBlobSha = null;
  try {
    bytes = base64ToBytes(receipt?.repositoryBytes?.value, atobImpl);
    computedSha256 = await digestBytes('SHA-256', bytes, cryptoObject);
    computedBlobSha = await gitBlobSha(bytes, cryptoObject, TextEncoderImpl);
  } catch {
    issues.push('REPOSITORY_RECEIPT_BYTES_UNVERIFIABLE');
  }
  if (
    !Number.isInteger(receipt?.repositoryByteLength) ||
    receipt.repositoryByteLength < 1 ||
    bytes?.byteLength !== receipt?.repositoryByteLength
  ) {
    issues.push('REPOSITORY_RECEIPT_BYTE_LENGTH_INVALID');
  }
  if (!HEX_SHA256.test(receipt?.repositorySha256 ?? '') || computedSha256 !== receipt?.repositorySha256) {
    issues.push('REPOSITORY_RECEIPT_SHA256_INVALID');
  }
  if (!HEX_SHA1.test(receipt?.gitBlobSha ?? '') || computedBlobSha !== receipt?.gitBlobSha) {
    issues.push('REPOSITORY_RECEIPT_GIT_BLOB_SHA_INVALID');
  }
  if (receipt?.gitBlobSha !== expectedGitBlobSha) {
    issues.push('REPOSITORY_RECEIPT_PINNED_GIT_BLOB_SHA_INVALID');
  }

  const eastRow = packageEastRow(browserPackage);
  if (!eastRow || !HEX_SHA256.test(eastRow.deployedSha256 ?? '')) {
    issues.push('REPOSITORY_RECEIPT_DEPLOYED_EAST_REFERENCE_INVALID');
  }
  if (receipt?.deployedEastSha256 !== eastRow?.deployedSha256) {
    issues.push('REPOSITORY_RECEIPT_DEPLOYED_EAST_DIGEST_INVALID');
  }
  const comparisonMatches = computedSha256 === eastRow?.deployedSha256;
  if (
    receipt?.repositoryDeploymentComparison !==
      (comparisonMatches ? 'MATCH' : 'MISMATCH')
  ) {
    issues.push('REPOSITORY_RECEIPT_COMPARISON_INVALID');
  }
  if (
    !validClaimCeiling(receipt?.claimCeiling) ||
    receipt?.sourceCorrectionAuthority !== 'WITHHELD' ||
    receipt?.productionClaimAuthority !== 'NONE'
  ) {
    issues.push('REPOSITORY_RECEIPT_CLAIM_CEILING_INVALID');
  }

  let computedReceiptDigest = null;
  try {
    computedReceiptDigest = (
      await digestCanonicalObject(without(receipt, 'receiptDigest'), cryptoObject, TextEncoderImpl)
    ).digest;
  } catch {
    issues.push('REPOSITORY_RECEIPT_DIGEST_DOMAIN_UNCOMPUTABLE');
  }
  if (
    !validDigestDescriptor(
      receipt?.receiptDigest,
      H_EARTH_FD05_REPOSITORY_RECEIPT_DIGEST_DOMAIN
    ) ||
    computedReceiptDigest !== receipt?.receiptDigest?.value
  ) {
    issues.push('REPOSITORY_RECEIPT_DIGEST_INVALID');
  }

  return deepFreeze({
    comparisonMatches,
    computedBlobSha,
    computedReceiptDigest,
    computedSha256,
    identityConflict: classifyIdentityIssues(issues),
    issues,
    repositoryByteLength: bytes?.byteLength ?? null,
    valid: issues.length === 0
  });
}
