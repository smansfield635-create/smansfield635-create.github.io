import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  H_EARTH_DEPLOYED_ROUTE_PROFILES,
  H_EARTH_DEPLOYED_SOURCE_IDENTITY_PATHS,
  auditHEarthDeployedSourceIdentity,
  buildExpectedHEarthDeployedSourceIdentityManifest,
  createHEarthDeployedAttemptUrl,
  createHEarthDeployedSourceUrl
} from './h-earth-deployed-route-probe-contract.mjs';

const mobileProfile = H_EARTH_DEPLOYED_ROUTE_PROFILES.find(
  (profile) => profile.id === 'DEPLOYED_MOBILE_PORTRAIT_DPR_3'
);
const desktopProfile = H_EARTH_DEPLOYED_ROUTE_PROFILES.find(
  (profile) => profile.id === 'DEPLOYED_DESKTOP_LANDSCAPE_DPR_1'
);

assert.equal(H_EARTH_DEPLOYED_ROUTE_PROFILES.length, 2);
assert.ok(mobileProfile);
assert.equal(mobileProfile.orientation, 'PORTRAIT');
assert.ok(mobileProfile.viewport.height > mobileProfile.viewport.width);
assert.equal(mobileProfile.isMobile, true);
assert.equal(mobileProfile.hasTouch, true);
assert.ok(desktopProfile);
assert.equal(desktopProfile.orientation, 'LANDSCAPE');
assert.ok(desktopProfile.viewport.width > desktopProfile.viewport.height);
assert.equal(desktopProfile.isMobile, false);
assert.equal(desktopProfile.hasTouch, false);

const attemptUrl = createHEarthDeployedAttemptUrl({
  targetUrl: 'https://example.test/showroom/globe/h-earth/',
  expectedRepositoryCommit: 'abc123',
  attemptNumber: 2,
  profileId: mobileProfile.id
});
const parsedAttemptUrl = new URL(attemptUrl);
assert.equal(
  parsedAttemptUrl.searchParams.get('hEarthDeployedSmoke'),
  `abc123-2-${mobileProfile.id}`
);
assert.equal(
  parsedAttemptUrl.searchParams.get('hEarthDeployedProfile'),
  mobileProfile.id
);

const sourceUrl = createHEarthDeployedSourceUrl({
  targetUrl: 'https://example.test/showroom/globe/h-earth/',
  sourcePath: '/showroom/globe/h-earth/renderer.js',
  cacheToken: 'abc123-2'
});
const parsedSourceUrl = new URL(sourceUrl);
assert.equal(parsedSourceUrl.pathname, '/showroom/globe/h-earth/renderer.js');
assert.equal(parsedSourceUrl.searchParams.get('hEarthSourceIdentity'), 'abc123-2');

const temporaryRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), 'h-earth-deployed-probe-self-test-')
);
try {
  const bodiesByPath = new Map();
  for (const sourcePath of H_EARTH_DEPLOYED_SOURCE_IDENTITY_PATHS) {
    const body = Buffer.from(`fixture:${sourcePath}\n`, 'utf8');
    bodiesByPath.set(sourcePath, body);
    const filePath = path.join(temporaryRoot, sourcePath.replace(/^\/+/, ''));
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, body);
  }

  const expectedManifest = buildExpectedHEarthDeployedSourceIdentityManifest({
    repositoryRoot: temporaryRoot
  });
  assert.equal(
    expectedManifest.sourceCount,
    H_EARTH_DEPLOYED_SOURCE_IDENTITY_PATHS.length
  );

  const exactAudit = await auditHEarthDeployedSourceIdentity({
    targetUrl: 'https://example.test/showroom/globe/h-earth/',
    expectedManifest,
    cacheToken: 'exact-control',
    async fetchSource({ sourcePath }) {
      return {
        status: 200,
        headers: { 'content-type': 'text/javascript; charset=utf-8' },
        body: bodiesByPath.get(sourcePath)
      };
    }
  });
  assert.equal(exactAudit.sourceIdentityEstablished, true);
  assert.equal(exactAudit.matchedSourceCount, expectedManifest.sourceCount);

  const mismatchAudit = await auditHEarthDeployedSourceIdentity({
    targetUrl: 'https://example.test/showroom/globe/h-earth/',
    expectedManifest,
    cacheToken: 'mismatch-control',
    async fetchSource({ sourcePath }) {
      return {
        status: 200,
        headers: { 'content-type': 'text/javascript; charset=utf-8' },
        body:
          sourcePath === '/showroom/globe/h-earth/renderer.js'
            ? Buffer.from('mutated renderer source\n', 'utf8')
            : bodiesByPath.get(sourcePath)
      };
    }
  });
  assert.equal(mismatchAudit.sourceIdentityEstablished, false);
  const rendererMismatch = mismatchAudit.records.find(
    (record) => record.sourcePath === '/showroom/globe/h-earth/renderer.js'
  );
  assert.ok(rendererMismatch.issueCodes.includes('DEPLOYED_SOURCE_DIGEST_MISMATCH'));

  const missingAudit = await auditHEarthDeployedSourceIdentity({
    targetUrl: 'https://example.test/showroom/globe/h-earth/',
    expectedManifest,
    cacheToken: 'missing-control',
    async fetchSource({ sourcePath }) {
      if (sourcePath === '/showroom/globe/h-earth/capacity.js') {
        return {
          status: 404,
          headers: { 'content-type': 'text/html' },
          body: Buffer.from('not found', 'utf8')
        };
      }
      return {
        status: 200,
        headers: { 'content-type': 'text/javascript; charset=utf-8' },
        body: bodiesByPath.get(sourcePath)
      };
    }
  });
  assert.equal(missingAudit.sourceIdentityEstablished, false);
  const missingCapacity = missingAudit.records.find(
    (record) => record.sourcePath === '/showroom/globe/h-earth/capacity.js'
  );
  assert.ok(
    missingCapacity.issueCodes.includes('DEPLOYED_SOURCE_HTTP_STATUS_REJECTED')
  );

  process.stdout.write(`${JSON.stringify({
    status: 'PASS',
    contract: 'H_EARTH_DEPLOYED_ROUTE_PROBE_SELF_TEST_v1',
    profileCount: H_EARTH_DEPLOYED_ROUTE_PROFILES.length,
    portraitProfileVerified: true,
    landscapeProfileVerified: true,
    sourceIdentityPathCount: expectedManifest.sourceCount,
    exactIdentityControl: exactAudit.sourceIdentityEstablished,
    digestMismatchControlFailedClosed: !mismatchAudit.sourceIdentityEstablished,
    missingSourceControlFailedClosed: !missingAudit.sourceIdentityEstablished,
    liveNetworkExecutionPerformed: false,
    deployedRoutePassEstablished: false
  }, null, 2)}\n`);
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
