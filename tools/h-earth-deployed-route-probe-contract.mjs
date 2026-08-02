import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const H_EARTH_DEPLOYED_ROUTE_PROBE_CONTRACT_ID =
  'H_EARTH_DEPLOYED_ROUTE_PROFILE_AND_SOURCE_IDENTITY_CONTRACT_v1';

export const H_EARTH_DEPLOYED_ROUTE_PROFILES = Object.freeze([
  Object.freeze({
    id: 'DEPLOYED_MOBILE_PORTRAIT_DPR_3',
    orientation: 'PORTRAIT',
    viewport: Object.freeze({ width: 390, height: 844 }),
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  }),
  Object.freeze({
    id: 'DEPLOYED_DESKTOP_LANDSCAPE_DPR_1',
    orientation: 'LANDSCAPE',
    viewport: Object.freeze({ width: 1440, height: 900 }),
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false
  })
]);

export const H_EARTH_DEPLOYED_SOURCE_IDENTITY_PATHS = Object.freeze([
  '/showroom/globe/h-earth/index.html',
  '/showroom/globe/h-earth/index.js',
  '/showroom/globe/h-earth/compositor.js',
  '/showroom/globe/h-earth/renderer.js',
  '/showroom/globe/h-earth/capacity.js',
  '/showroom/globe/h-earth/admitted-geometry-frame.js',
  '/showroom/globe/h-earth/render/shoreline-preview.js',
  '/showroom/globe/h-earth/render/geometry-kernel.js',
  '/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js'
]);

function isPositiveSafeInteger(value) {
  return Number.isSafeInteger(value) && value >= 1;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeBody(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === 'string') return Buffer.from(value, 'utf8');
  throw new TypeError('Observed source body must be a Buffer, Uint8Array, or string.');
}

function normalizeTargetUrl(targetUrl) {
  if (typeof targetUrl !== 'string' || targetUrl.trim().length === 0) {
    throw new TypeError('targetUrl must be a non-empty string.');
  }
  return new URL(targetUrl);
}

function normalizeCacheToken(cacheToken) {
  if (typeof cacheToken !== 'string' || cacheToken.trim().length === 0) {
    throw new TypeError('cacheToken must be a non-empty string.');
  }
  return cacheToken.trim();
}

export function createHEarthDeployedAttemptUrl({
  targetUrl,
  expectedRepositoryCommit = 'manual',
  attemptNumber,
  profileId
} = {}) {
  if (!isPositiveSafeInteger(attemptNumber)) {
    throw new TypeError('attemptNumber must be a positive safe integer.');
  }
  if (typeof profileId !== 'string' || profileId.trim().length === 0) {
    throw new TypeError('profileId must be a non-empty string.');
  }

  const target = normalizeTargetUrl(targetUrl);
  const commit =
    typeof expectedRepositoryCommit === 'string' &&
    expectedRepositoryCommit.trim().length > 0
      ? expectedRepositoryCommit.trim()
      : 'manual';
  target.searchParams.set(
    'hEarthDeployedSmoke',
    `${commit}-${attemptNumber}-${profileId.trim()}`
  );
  target.searchParams.set('hEarthDeployedProfile', profileId.trim());
  return target.href;
}

export function createHEarthDeployedSourceUrl({
  targetUrl,
  sourcePath,
  cacheToken
} = {}) {
  const target = normalizeTargetUrl(targetUrl);
  if (!H_EARTH_DEPLOYED_SOURCE_IDENTITY_PATHS.includes(sourcePath)) {
    throw new TypeError(`Unsupported deployed source path: ${String(sourcePath)}`);
  }

  const sourceUrl = new URL(sourcePath, `${target.origin}/`);
  sourceUrl.searchParams.set(
    'hEarthSourceIdentity',
    normalizeCacheToken(cacheToken)
  );
  return sourceUrl.href;
}

export function buildExpectedHEarthDeployedSourceIdentityManifest({
  repositoryRoot
} = {}) {
  if (typeof repositoryRoot !== 'string' || repositoryRoot.trim().length === 0) {
    throw new TypeError('repositoryRoot must be a non-empty string.');
  }

  const normalizedRoot = path.resolve(repositoryRoot);
  const sources = H_EARTH_DEPLOYED_SOURCE_IDENTITY_PATHS.map((sourcePath) => {
    const repositoryRelativePath = sourcePath.replace(/^\/+/, '');
    const absolutePath = path.join(normalizedRoot, repositoryRelativePath);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      throw new Error(`Expected repository source is missing: ${repositoryRelativePath}`);
    }
    const body = fs.readFileSync(absolutePath);
    return Object.freeze({
      sourcePath,
      repositoryRelativePath,
      expectedByteLength: body.byteLength,
      expectedSha256: sha256(body)
    });
  });

  return Object.freeze({
    contractId: H_EARTH_DEPLOYED_ROUTE_PROBE_CONTRACT_ID,
    sourceCount: sources.length,
    sources: Object.freeze(sources)
  });
}

export function verifyHEarthDeployedSourceIdentity({
  expectedManifest,
  observedSources
} = {}) {
  if (!expectedManifest || !Array.isArray(expectedManifest.sources)) {
    throw new TypeError('expectedManifest.sources must be an array.');
  }
  if (!Array.isArray(observedSources)) {
    throw new TypeError('observedSources must be an array.');
  }

  const observedByPath = new Map(
    observedSources.map((source) => [source?.sourcePath, source])
  );
  const records = expectedManifest.sources.map((expected) => {
    const observed = observedByPath.get(expected.sourcePath) ?? null;
    const issueCodes = [];
    if (!observed) {
      issueCodes.push('DEPLOYED_SOURCE_NOT_OBSERVED');
    } else {
      if (observed.error) issueCodes.push('DEPLOYED_SOURCE_FETCH_ERROR');
      if (observed.status !== 200) issueCodes.push('DEPLOYED_SOURCE_HTTP_STATUS_REJECTED');
      if (observed.observedByteLength !== expected.expectedByteLength) {
        issueCodes.push('DEPLOYED_SOURCE_BYTE_LENGTH_MISMATCH');
      }
      if (observed.observedSha256 !== expected.expectedSha256) {
        issueCodes.push('DEPLOYED_SOURCE_DIGEST_MISMATCH');
      }
    }

    return Object.freeze({
      ...expected,
      auditedUrl: observed?.auditedUrl ?? null,
      status: observed?.status ?? null,
      contentType: observed?.contentType ?? null,
      observedByteLength: observed?.observedByteLength ?? null,
      observedSha256: observed?.observedSha256 ?? null,
      error: observed?.error ?? null,
      issueCodes: Object.freeze(issueCodes),
      identityMatch: issueCodes.length === 0
    });
  });

  const unexpectedSourcePaths = observedSources
    .map((source) => source?.sourcePath)
    .filter(
      (sourcePath) =>
        typeof sourcePath === 'string' &&
        !expectedManifest.sources.some((expected) => expected.sourcePath === sourcePath)
    )
    .sort();
  const matchedSourceCount = records.filter((record) => record.identityMatch).length;

  return Object.freeze({
    contractId: H_EARTH_DEPLOYED_ROUTE_PROBE_CONTRACT_ID,
    expectedSourceCount: expectedManifest.sources.length,
    observedSourceCount: observedSources.length,
    matchedSourceCount,
    unexpectedSourcePaths: Object.freeze(unexpectedSourcePaths),
    records: Object.freeze(records),
    sourceIdentityEstablished:
      records.length === expectedManifest.sources.length &&
      matchedSourceCount === expectedManifest.sources.length &&
      unexpectedSourcePaths.length === 0
  });
}

export async function auditHEarthDeployedSourceIdentity({
  targetUrl,
  expectedManifest,
  cacheToken,
  fetchSource
} = {}) {
  if (typeof fetchSource !== 'function') {
    throw new TypeError('fetchSource must be a function.');
  }
  const normalizedCacheToken = normalizeCacheToken(cacheToken);
  const observedSources = [];

  for (const expected of expectedManifest.sources) {
    const auditedUrl = createHEarthDeployedSourceUrl({
      targetUrl,
      sourcePath: expected.sourcePath,
      cacheToken: normalizedCacheToken
    });
    try {
      const response = await fetchSource({
        sourcePath: expected.sourcePath,
        auditedUrl
      });
      const status = response?.status ?? null;
      const body = normalizeBody(response?.body ?? Buffer.alloc(0));
      const headers = response?.headers ?? {};
      observedSources.push(Object.freeze({
        sourcePath: expected.sourcePath,
        auditedUrl,
        status,
        contentType:
          headers['content-type'] ?? headers['Content-Type'] ?? null,
        observedByteLength: body.byteLength,
        observedSha256: sha256(body),
        error: null
      }));
    } catch (error) {
      observedSources.push(Object.freeze({
        sourcePath: expected.sourcePath,
        auditedUrl,
        status: null,
        contentType: null,
        observedByteLength: null,
        observedSha256: null,
        error: Object.freeze({
          name: error?.name ?? 'Error',
          message: error?.message ?? String(error)
        })
      }));
    }
  }

  return verifyHEarthDeployedSourceIdentity({
    expectedManifest,
    observedSources
  });
}
