import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  H_EARTH_REPRESENTATION_TRANSITION_SURFACE_ID,
  H_EARTH_TRANSITION_DIRECTIONS,
  H_EARTH_TRANSITION_P1_KEYS,
  createHEarthRepresentationTransitionSurface
} from '../../showroom/globe/h-earth/functional-landscape/representation-transition-surface.v1.js';

const SCHEMA = 'H_EARTH_H1_TRANSITION_SURFACE_VERIFICATION_RECEIPT_v1';
const BASE_HEAD = '0b41d4d8c8dbc18ccf0f678be46f027bac8fcbc9';
const FIXTURE_CANONICAL = 'EXTERNAL_CANONICAL_REFERENCE_FIXTURE_001';
const FIXTURE_CORRESPONDENCE = 'CORRESPONDENCE_FIXTURE_001';
const FIXTURE_RECEIPT = 'EXTERNAL_TRANSITION_RECEIPT_FIXTURE_001';
const FIXTURE_ANCHOR = 'H_EARTH_ANCHOR_FIXTURE_001';
const FIXTURE_CONTEXT = 'H_EARTH_RETURN_CONTEXT_FIXTURE_001';

const ALLOWED_PATHS = Object.freeze([
  'showroom/globe/h-earth/functional-landscape/representation-transition-surface.v1.js',
  'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
  'showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js',
  'h-earth-3d/validation/h-earth.representation-transition-surface-gap-closure.v1.mjs'
]);

const P1_SORTED = [...H_EARTH_TRANSITION_P1_KEYS].sort();
const exactP1 = (value) =>
  value && typeof value === 'object' &&
  JSON.stringify(Object.keys(value).sort()) === JSON.stringify(P1_SORTED);
const stable = (value) => JSON.stringify(value);

function parseOutputPath() {
  const index = process.argv.indexOf('--output');
  return index >= 0 ? process.argv[index + 1] ?? null : null;
}

function makeAuthorityAdapters() {
  return Object.freeze({
    validateCanonicalPlaceReference: (canonicalPlaceId) =>
      canonicalPlaceId === FIXTURE_CANONICAL,
    validateTransitionReceipt: (input) =>
      input?.canonicalPlaceId === FIXTURE_CANONICAL &&
      input?.correspondenceId === FIXTURE_CORRESPONDENCE &&
      input?.transitionReceiptId === FIXTURE_RECEIPT &&
      [H_EARTH_TRANSITION_DIRECTIONS.OUTBOUND, H_EARTH_TRANSITION_DIRECTIONS.INBOUND]
        .includes(input?.direction)
  });
}

function makeAdapter({ active = true } = {}) {
  const session = {
    activeAnchorId: active ? FIXTURE_ANCHOR : 'H_EARTH_NONANCHOR_SESSION_FIXTURE',
    restoreCommitCount: 0,
    prepareCount: 0
  };
  const prepared = new Map();
  let sequence = 0;
  const adapter = Object.freeze({
    listTransitionAnchorIds: () => [FIXTURE_ANCHOR],
    isKnownTransitionAnchor: (anchorId) => anchorId === FIXTURE_ANCHOR,
    isTransitionAnchorActive: (anchorId) =>
      anchorId === FIXTURE_ANCHOR && session.activeAnchorId === FIXTURE_ANCHOR,
    getReturnContextId: (anchorId) =>
      anchorId === FIXTURE_ANCHOR ? FIXTURE_CONTEXT : null,
    isKnownReturnContext: (anchorId, returnContextId) =>
      anchorId === FIXTURE_ANCHOR && returnContextId === FIXTURE_CONTEXT,
    prepareRestore: (anchorId, returnContextId) => {
      if (anchorId !== FIXTURE_ANCHOR || returnContextId !== FIXTURE_CONTEXT) return null;
      session.prepareCount += 1;
      sequence += 1;
      const preparedRestoreId = `PREPARED_FIXTURE_${sequence}`;
      prepared.set(preparedRestoreId, { anchorId, returnContextId });
      return Object.freeze({ preparedRestoreId });
    },
    commitRestore: (token) => {
      const record = prepared.get(token?.preparedRestoreId);
      if (!record) return false;
      prepared.delete(token.preparedRestoreId);
      session.activeAnchorId = record.anchorId;
      session.restoreCommitCount += 1;
      return true;
    }
  });
  return { adapter, session };
}

function outboundRequest(overrides = {}) {
  return {
    canonicalPlaceId: FIXTURE_CANONICAL,
    correspondenceId: FIXTURE_CORRESPONDENCE,
    entryAnchorId: FIXTURE_ANCHOR,
    transitionReceiptId: FIXTURE_RECEIPT,
    ...overrides
  };
}

function inboundPayload(overrides = {}) {
  return {
    canonicalPlaceId: FIXTURE_CANONICAL,
    correspondenceId: FIXTURE_CORRESPONDENCE,
    direction: H_EARTH_TRANSITION_DIRECTIONS.INBOUND,
    entryAnchorId: FIXTURE_ANCHOR,
    returnContextId: FIXTURE_CONTEXT,
    transitionReceiptId: FIXTURE_RECEIPT,
    ...overrides
  };
}

const checks = {};
const facts = {};

try {
  assert.equal(H_EARTH_REPRESENTATION_TRANSITION_SURFACE_ID, 'H_EARTH_REPRESENTATION_TRANSITION_SURFACE_v1');
  checks.surfaceIdentity = true;

  const outboundFixture = makeAdapter({ active: true });
  const outboundSurface = createHEarthRepresentationTransitionSurface({
    hRepresentationAdapter: outboundFixture.adapter
  });
  const descriptor = outboundSurface.getCapabilityDescriptor();
  assert.equal(descriptor.owner, 'H_EARTH');
  assert.equal(descriptor.outbound, true);
  assert.equal(descriptor.inbound, true);
  assert.equal(descriptor.transitionPresentation, false);
  assert.equal(descriptor.canonicalIdentityAuthority, false);
  assert.deepEqual(descriptor.canonicalReferencePolicy, {
    required: true,
    default: null,
    fallback: null,
    autoMint: false
  });
  assert.deepEqual([...descriptor.sharedPayloadKeys].sort(), P1_SORTED);
  assert.deepEqual(descriptor.anchorIds, [FIXTURE_ANCHOR]);
  checks.capabilityBoundary = true;
  checks.canonicalReferenceRequiredNoDefaultNoFallbackNoAutoMint = true;

  const outboundBefore = stable(outboundFixture.session);
  const outbound = outboundSurface.requestOutboundTransition(
    outboundRequest(),
    makeAuthorityAdapters()
  );
  assert.equal(outbound.ok, true);
  assert.equal(outbound.commit, true);
  assert.equal(outbound.status, 'H_OUT_COMMITTED');
  assert.equal(exactP1(outbound.sharedPayload), true);
  assert.equal(outbound.sharedPayload.direction, H_EARTH_TRANSITION_DIRECTIONS.OUTBOUND);
  assert.equal(outbound.sharedPayload.returnContextId, FIXTURE_CONTEXT);
  assert.deepEqual(outbound.stages, {
    VALIDATE: 'PASS', PREPARE: 'PASS', ACCEPT: 'PASS', COMMIT: 'PASS'
  });
  assert.equal(stable(outboundFixture.session), outboundBefore);
  checks.hOutPositive = true;
  checks.hOutDoesNotMutateSession = true;
  checks.p1ExactAllowlist = true;

  const inboundFixture = makeAdapter({ active: false });
  const inboundSurface = createHEarthRepresentationTransitionSurface({
    hRepresentationAdapter: inboundFixture.adapter
  });
  const inbound = inboundSurface.requestInboundRestore(
    inboundPayload(),
    makeAuthorityAdapters()
  );
  assert.equal(inbound.ok, true);
  assert.equal(inbound.commit, true);
  assert.equal(inbound.status, 'H_IN_COMMITTED');
  assert.equal(exactP1(inbound.sharedPayload), true);
  assert.deepEqual(inbound.stages, {
    VALIDATE: 'PASS', PREPARE: 'PASS', ACCEPT: 'PASS', COMMIT: 'PASS'
  });
  assert.equal(inboundFixture.session.activeAnchorId, FIXTURE_ANCHOR);
  assert.equal(inboundFixture.session.prepareCount, 1);
  assert.equal(inboundFixture.session.restoreCommitCount, 1);
  checks.hInPositive = true;
  checks.atomicValidatePrepareAcceptCommit = true;

  const invalidCanonicalFixture = makeAdapter({ active: true });
  const invalidCanonicalSurface = createHEarthRepresentationTransitionSurface({
    hRepresentationAdapter: invalidCanonicalFixture.adapter
  });
  const invalidCanonicalBefore = stable(invalidCanonicalFixture.session);
  const invalidCanonical = invalidCanonicalSurface.requestOutboundTransition(
    outboundRequest({ canonicalPlaceId: 'INVALID_CANONICAL_REFERENCE_FIXTURE' }),
    makeAuthorityAdapters()
  );
  assert.equal(invalidCanonical.commit, false);
  assert.equal(invalidCanonical.status, 'CANONICAL_REFERENCE_INVALID');
  assert.equal(stable(invalidCanonicalFixture.session), invalidCanonicalBefore);
  checks.invalidCanonicalReferenceFailsClosedSessionUnchanged = true;

  const unknownAnchorFixture = makeAdapter({ active: true });
  const unknownAnchorSurface = createHEarthRepresentationTransitionSurface({
    hRepresentationAdapter: unknownAnchorFixture.adapter
  });
  const unknownAnchorBefore = stable(unknownAnchorFixture.session);
  const unknownAnchor = unknownAnchorSurface.requestOutboundTransition(
    outboundRequest({ entryAnchorId: 'H_EARTH_UNKNOWN_ANCHOR_FIXTURE' }),
    makeAuthorityAdapters()
  );
  assert.equal(unknownAnchor.commit, false);
  assert.equal(unknownAnchor.status, 'UNKNOWN_H_ANCHOR');
  assert.equal(stable(unknownAnchorFixture.session), unknownAnchorBefore);
  checks.unknownHAnchorFailsClosedSessionUnchanged = true;

  const malformedContextFixture = makeAdapter({ active: false });
  const malformedContextSurface = createHEarthRepresentationTransitionSurface({
    hRepresentationAdapter: malformedContextFixture.adapter
  });
  const malformedContextBefore = stable(malformedContextFixture.session);
  const malformedContext = malformedContextSurface.requestInboundRestore(
    inboundPayload({ returnContextId: '' }),
    makeAuthorityAdapters()
  );
  assert.equal(malformedContext.commit, false);
  assert.equal(malformedContext.status, 'RETURN_CONTEXT_MALFORMED');
  assert.equal(stable(malformedContextFixture.session), malformedContextBefore);
  checks.malformedReturnContextFailsClosedSessionUnchanged = true;

  const invalidReceiptFixture = makeAdapter({ active: false });
  const invalidReceiptSurface = createHEarthRepresentationTransitionSurface({
    hRepresentationAdapter: invalidReceiptFixture.adapter
  });
  const invalidReceiptBefore = stable(invalidReceiptFixture.session);
  const invalidReceipt = invalidReceiptSurface.requestInboundRestore(
    inboundPayload({ transitionReceiptId: 'INVALID_TRANSITION_RECEIPT_FIXTURE' }),
    makeAuthorityAdapters()
  );
  assert.equal(invalidReceipt.commit, false);
  assert.equal(invalidReceipt.status, 'TRANSITION_RECEIPT_INVALID');
  assert.equal(stable(invalidReceiptFixture.session), invalidReceiptBefore);
  checks.invalidTransitionReceiptFailsClosedSessionUnchanged = true;

  const extraKeyFixture = makeAdapter({ active: false });
  const extraKeySurface = createHEarthRepresentationTransitionSurface({
    hRepresentationAdapter: extraKeyFixture.adapter
  });
  const extraKeyBefore = stable(extraKeyFixture.session);
  const extraKey = extraKeySurface.requestInboundRestore(
    { ...inboundPayload(), weather: 'PROHIBITED' },
    makeAuthorityAdapters()
  );
  assert.equal(extraKey.commit, false);
  assert.equal(extraKey.status, 'SHARED_PAYLOAD_SHAPE_INVALID');
  assert.equal(stable(extraKeyFixture.session), extraKeyBefore);
  checks.absenceFromP1AllowlistFailsClosed = true;

  const missingAuthorityFixture = makeAdapter({ active: true });
  const missingAuthoritySurface = createHEarthRepresentationTransitionSurface({
    hRepresentationAdapter: missingAuthorityFixture.adapter
  });
  const missingAuthorityBefore = stable(missingAuthorityFixture.session);
  const missingAuthority = missingAuthoritySurface.requestOutboundTransition(outboundRequest(), {});
  assert.equal(missingAuthority.commit, false);
  assert.equal(stable(missingAuthorityFixture.session), missingAuthorityBefore);
  checks.externalAuthorityAdaptersMandatory = true;

  const root = process.cwd();
  const transitionSource = fs.readFileSync(path.join(
    root,
    'showroom/globe/h-earth/functional-landscape/representation-transition-surface.v1.js'
  ), 'utf8');
  const intakeSource = fs.readFileSync(path.join(
    root,
    'showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js'
  ), 'utf8');
  const integrationSource = fs.readFileSync(path.join(
    root,
    'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js'
  ), 'utf8');

  for (const forbidden of [
    'waypointId', 'position', 'camera', 'terrain', 'renderer', 'physics',
    'geometry', 'material', 'simulation', 'persistence', 'audralia'
  ]) {
    assert.equal(
      transitionSource.toLowerCase().includes(forbidden.toLowerCase()),
      false,
      `transition surface leaked representation-local concept: ${forbidden}`
    );
  }
  checks.transitionSurfaceContainsNoRepresentationLocalWorldMechanics = true;

  assert.equal(integrationSource.includes("from './representation-transition-surface.v1.js'"), true);
  assert.equal(integrationSource.includes('getRepresentationTransitionSurface'), true);
  assert.equal(integrationSource.toLowerCase().includes('audralia'), false);
  checks.publicRuntimeWiresHOwnedSurfaceOnly = true;

  assert.equal(intakeSource.includes("waypointId: 'COAST'"), true);
  assert.equal(intakeSource.includes('H_EARTH_ANCHOR_COASTAL_ENTRY_v1'), true);
  assert.equal(intakeSource.includes('H_EARTH_RETURN_CONTEXT_COASTAL_ENTRY_v1'), true);
  assert.equal(intakeSource.includes('listTransitionAnchorIds'), true);
  assert.equal(intakeSource.includes('prepareRestore'), true);
  assert.equal(intakeSource.includes('commitRestore'), true);
  assert.equal(intakeSource.toLowerCase().includes('audralia'), false);
  checks.hOwnedAnchorMappingRemainsInsideHRepresentationAdapter = true;

  assert.deepEqual(Object.keys(outboundSurface).sort(), [
    'getCapabilityDescriptor',
    'requestInboundRestore',
    'requestOutboundTransition',
    'surfaceId'
  ]);
  checks.surfaceDoesNotExposeHRepresentationAdapter = true;

  const sharedPayloadText = JSON.stringify(outbound.sharedPayload).toLowerCase();
  for (const forbidden of [
    'weather', 'time', 'npc', 'inventory', 'quest', 'environment', 'vegetation',
    'water', 'procedural', 'physics', 'camera', 'renderer', 'coordinate', 'objectid'
  ]) {
    assert.equal(sharedPayloadText.includes(forbidden), false);
  }
  checks.noProhibitedSharedStateClasses = true;

  facts.allowedPaths = [...ALLOWED_PATHS];
  facts.baseHead = BASE_HEAD;
  facts.surfaceDescriptor = descriptor;
  facts.positiveOutboundStatus = outbound.status;
  facts.positiveInboundStatus = inbound.status;
  facts.failClosedStatuses = Object.freeze({
    invalidCanonical: invalidCanonical.status,
    unknownAnchor: unknownAnchor.status,
    malformedReturnContext: malformedContext.status,
    invalidTransitionReceipt: invalidReceipt.status,
    extraSharedState: extraKey.status,
    missingExternalAuthority: missingAuthority.status
  });

  const receipt = {
    schema: SCHEMA,
    result: 'PASS',
    eligible: true,
    startingRepresentation: 'H0',
    targetRepresentation: 'H1',
    surfaceId: H_EARTH_REPRESENTATION_TRANSITION_SURFACE_ID,
    checks,
    facts,
    boundaries: {
      canonicalIdentityCreatedOrRedefined: false,
      openWorldMutationPerformed: false,
      correspondenceBindingConstructed: false,
      transitionPresentationMutated: false,
      representationLocalWorldAuthorityTransferred: false,
      constructionAuthorityCreatedByVerifier: false,
      mergeAuthorityCreatedByVerifier: false
    }
  };
  const output = `${JSON.stringify(receipt, null, 2)}\n`;
  const outputPath = parseOutputPath();
  if (outputPath) fs.writeFileSync(outputPath, output);
  process.stdout.write(output);
} catch (error) {
  const receipt = {
    schema: SCHEMA,
    result: 'FAIL',
    eligible: false,
    startingRepresentation: 'H0',
    targetRepresentation: 'H1',
    checks,
    facts,
    failure: {
      name: error?.name ?? 'Error',
      message: error?.message ?? String(error),
      stack: error?.stack ?? null
    },
    boundaries: {
      constructionAuthorityCreatedByVerifier: false,
      mergeAuthorityCreatedByVerifier: false
    }
  };
  const output = `${JSON.stringify(receipt, null, 2)}\n`;
  const outputPath = parseOutputPath();
  if (outputPath) fs.writeFileSync(outputPath, output);
  process.stderr.write(output);
  process.exitCode = 1;
}
