import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import b0 from '../../control-plane/post-cp2-round2/morphology/h-earth.b0-morphology-baseline-freeze.v1.mjs';
import b2 from '../../control-plane/post-cp2-round2/morphology/h-earth.b2-protection-model.v1.mjs';
import authority from '../../control-plane/post-cp2-round2/morphology/h-earth.b3-two-fixed-morphology-probes.v1.mjs';
import { buildHEarthB3TwoFixedMorphologyProbes } from '../../analysis/morphology/h-earth.b3-two-fixed-morphology-probes.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed, status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};
const finiteArray = (values) => {
  for (const value of values) if (!Number.isFinite(value)) return false;
  return true;
};
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function encodeFloat64LE(values) {
  const output = Buffer.alloc(values.length * 8);
  for (let index = 0; index < values.length; index += 1) output.writeDoubleLE(values[index], index * 8);
  return output;
}

const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${authority.controllingB2Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactPathScope].sort();
check('EXACT_B3_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('B3_HAS_NO_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });
check('EXACT_B2_CLOSED_BASE', git('merge-base', authority.controllingB2Merge, head) === authority.controllingB2Merge, { base: authority.controllingB2Merge, head });
for (const [id, record] of Object.entries(b0.frozenSources)) {
  const actual = git('hash-object', record.path);
  check(`B3_FROZEN_${id.toUpperCase()}`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

const first = buildHEarthB3TwoFixedMorphologyProbes(authority, b2);
const second = buildHEarthB3TwoFixedMorphologyProbes(authority, b2);
check('FROZEN_B1_BASELINE_DIGEST', first.baselineDigest === authority.frozenBaselineDigest, { expected: authority.frozenBaselineDigest, actual: first.baselineDigest });
check('FROZEN_B2_PROTECTION_DIGEST', first.protectionDigest === authority.frozenProtectionDigest, { expected: authority.frozenProtectionDigest, actual: first.protectionDigest });
check('EXACT_TWO_PROBES', first.probes.length === authority.gates.exactProbeCount && second.probes.length === authority.gates.exactProbeCount, { first: first.probes.length, second: second.probes.length });
check('EXACT_PROBE_IDENTITIES', JSON.stringify(first.probes.map((probe) => probe.probeId)) === JSON.stringify(authority.probes.map((probe) => probe.probeId)), { actual: first.probes.map((probe) => probe.probeId), expected: authority.probes.map((probe) => probe.probeId) });
check('EXACT_AMPLITUDE_FRACTIONS', JSON.stringify(first.probes.map((probe) => probe.amplitudeFractionOfLocalRelief)) === JSON.stringify(authority.gates.exactAmplitudeFractions), { actual: first.probes.map((probe) => probe.amplitudeFractionOfLocalRelief), expected: authority.gates.exactAmplitudeFractions });
check('INDEPENDENT_GUIDANCE_DIGEST_IDENTICAL', first.guidanceDigest === second.guidanceDigest, { first: first.guidanceDigest, second: second.guidanceDigest });
check('INDEPENDENT_PROBE_DIGESTS_IDENTICAL', JSON.stringify(first.probes.map((probe) => probe.digest)) === JSON.stringify(second.probes.map((probe) => probe.digest)), { first: first.probes.map((probe) => probe.digest), second: second.probes.map((probe) => probe.digest) });
check('EXACT_GRID_VERTEX_COUNT', first.sourceHeights.length === authority.grid.vertexCount && first.grid.width === authority.grid.width && first.grid.height === authority.grid.height, { sourceLength: first.sourceHeights.length, grid: first.grid });
check('ALL_GUIDANCE_VALUES_FINITE', finiteArray(first.localRelief) && finiteArray(first.guidance) && finiteArray(first.reconstructed));

for (let probeIndex = 0; probeIndex < first.probes.length; probeIndex += 1) {
  const probe = first.probes[probeIndex];
  const definition = authority.probes[probeIndex];
  let p0MismatchCount = 0;
  let envelopeViolationCount = 0;
  let p1ViolationCount = 0;
  let maximumEnvelopeRatio = 0;
  for (let index = 0; index < probe.heights.length; index += 1) {
    const absoluteDelta = Math.abs(probe.delta[index]);
    const envelope = definition.amplitudeFractionOfLocalRelief * first.localRelief[index];
    if (first.p0[index] && probe.heights[index] !== first.sourceHeights[index]) p0MismatchCount += 1;
    if (absoluteDelta > envelope + authority.gates.amplitudeEnvelopeTolerance) envelopeViolationCount += 1;
    if (first.p1[index] && absoluteDelta > envelope * (b2.p1.maximumEditableWeight + 1e-6) + authority.gates.amplitudeEnvelopeTolerance) p1ViolationCount += 1;
    if (envelope > 1e-12) maximumEnvelopeRatio = Math.max(maximumEnvelopeRatio, absoluteDelta / envelope);
  }
  check(`${probe.probeId}_ALL_VALUES_FINITE`, finiteArray(probe.heights) && finiteArray(probe.delta) && finiteArray(probe.envelope));
  check(`${probe.probeId}_P0_HEIGHTS_EXACT`, p0MismatchCount === 0, { p0MismatchCount });
  check(`${probe.probeId}_AMPLITUDE_ENVELOPE`, envelopeViolationCount === 0 && probe.summary.envelopeViolationCount === 0, { envelopeViolationCount, summaryCount: probe.summary.envelopeViolationCount, maximumEnvelopeRatio });
  check(`${probe.probeId}_P1_TRANSITION_LIMIT`, p1ViolationCount === 0, { p1ViolationCount });
  check(`${probe.probeId}_NONTRIVIAL_CHANGE`, probe.summary.changedCellCount >= authority.gates.minimumChangedCellCountPerProbe, { changedCellCount: probe.summary.changedCellCount });
  check(`${probe.probeId}_EXACT_ENCODING`, probe.encoding === authority.artifactLaw.encoding, { expected: authority.artifactLaw.encoding, actual: probe.encoding });
}

check('PROBE_B_MAXIMUM_DELTA_NOT_LESS_THAN_A', first.probes[1].summary.maximumAbsoluteDelta >= first.probes[0].summary.maximumAbsoluteDelta, { probeA: first.probes[0].summary.maximumAbsoluteDelta, probeB: first.probes[1].summary.maximumAbsoluteDelta });
check('NO_THIRD_AMPLITUDE', authority.probes.length === 2 && authority.gates.noThirdAmplitude === true);
check('OFFLINE_ONLY_NO_LIVE_OR_PRODUCT_MUTATION', authority.boundaries.productMutationPerformed === false && authority.boundaries.runtimeGeometryMutationPerformed === false && authority.boundaries.finalFrameExecutionPerformed === false && authority.boundaries.causalClassificationPerformed === false && authority.boundaries.liveRouteChanged === false);

const artifactRecords = [];
const outputDirectory = process.env.B3_OUTPUT_DIR;
if (outputDirectory) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  for (const probe of first.probes) {
    const fileName = probe.probeId === 'B1_A_4_PERCENT_LOCAL_RELIEF'
      ? 'h-earth.b3-probe-a-4pct.f64le'
      : 'h-earth.b3-probe-b-8pct.f64le';
    const bytes = encodeFloat64LE(probe.heights);
    fs.writeFileSync(path.join(outputDirectory, fileName), bytes);
    artifactRecords.push({
      probeId: probe.probeId,
      fileName,
      byteLength: bytes.length,
      sha256: sha256(bytes),
      heightfieldDigest: probe.digest
    });
  }
}

const summary = {
  baselineDigest: first.baselineDigest,
  protectionDigest: first.protectionDigest,
  guidanceDigest: first.guidanceDigest,
  dominantRepetition: first.dominantRepetition,
  grid: first.grid,
  localRelief: {
    minimum: Math.min(...first.localRelief),
    maximum: Math.max(...first.localRelief)
  },
  probes: first.probes.map((probe) => ({
    probeId: probe.probeId,
    amplitudeFractionOfLocalRelief: probe.amplitudeFractionOfLocalRelief,
    digest: probe.digest,
    summary: probe.summary
  })),
  artifactRecords
};
const receiptBody = {
  receiptType: 'H_EARTH_B3_TWO_FIXED_MORPHOLOGY_PROBES_RECEIPT_v1',
  checkpoint: 'B3',
  result: failures.length === 0 ? authority.result : 'B3_TWO_FIXED_MORPHOLOGY_PROBES_FAIL',
  pass: failures.length === 0,
  baseHead: authority.controllingB2Merge,
  executedHead: head,
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  summary,
  productMutationPerformed: false,
  runtimeGeometryMutationPerformed: false,
  offlineProbeGenerationPerformed: true,
  finalFrameExecutionPerformed: false,
  causalClassificationPerformed: false,
  liveRouteChanged: false,
  b4Authorized: failures.length === 0
};
const canonicalReceiptSha256 = crypto.createHash('sha256').update(JSON.stringify(receiptBody)).digest('hex');
const receipt = { ...receiptBody, canonicalReceiptSha256 };
if (outputDirectory) fs.writeFileSync(path.join(outputDirectory, 'h-earth.b3-two-fixed-morphology-probes.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
