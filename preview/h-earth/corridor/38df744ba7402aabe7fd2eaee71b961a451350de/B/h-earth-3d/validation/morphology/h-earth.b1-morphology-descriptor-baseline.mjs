import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import b0 from '../../control-plane/post-cp2-round2/morphology/h-earth.b0-morphology-baseline-freeze.v1.mjs';
import authority from '../../control-plane/post-cp2-round2/morphology/h-earth.b1-morphology-descriptor-baseline.v1.mjs';
import { buildHEarthB1MorphologyDescriptorBaseline } from '../../analysis/morphology/h-earth.b1-morphology-descriptor-baseline.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed, status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};
const countNonzero = (values) => values.reduce((sum, value) => sum + (value ? 1 : 0), 0);

const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${authority.controllingB0Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactPathScope].sort();
check('EXACT_B1_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('B1_HAS_NO_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });
check('EXACT_B0_CLOSED_BASE', git('merge-base', authority.controllingB0Merge, head) === authority.controllingB0Merge, { base: authority.controllingB0Merge, head });
for (const [id, record] of Object.entries(b0.frozenSources)) {
  const actual = git('hash-object', record.path);
  check(`B1_FROZEN_${id.toUpperCase()}`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

const options = {
  width: authority.grid.width,
  height: authority.grid.height,
  domain: authority.source.worldDomain,
  orientationsDegrees: authority.repetitionLocalization.orientationsDegrees,
  lagsCells: authority.repetitionLocalization.lagsCells,
  detrendBoxRadiusCells: authority.repetitionLocalization.detrendBoxRadiusCells,
  hotspotWindowCells: authority.repetitionLocalization.hotspotWindowCells,
  hotspotStrideCells: authority.repetitionLocalization.hotspotStrideCells,
  hotspotRetentionQuantile: authority.repetitionLocalization.hotspotRetentionQuantile
};
const first = buildHEarthB1MorphologyDescriptorBaseline(options);
const second = buildHEarthB1MorphologyDescriptorBaseline(options);
check('INDEPENDENT_BASELINES_DIGEST_IDENTICAL', first.baselineDigest === second.baselineDigest, { first: first.baselineDigest, second: second.baselineDigest });
check('EXACT_GRID_DIMENSIONS', first.grid.width === authority.grid.width && first.grid.height === authority.grid.height && first.heights.length === authority.grid.width * authority.grid.height, first.grid);
check('ALL_HEIGHTFIELD_SAMPLES_FINITE', first.summaries.heights.finiteCount === first.summaries.heights.elementCount, first.summaries.heights);
check('DOMINANT_LAG_AUTHORIZED', authority.repetitionLocalization.lagsCells.includes(first.repetition.dominant.lagCells), first.repetition.dominant);
check('DOMINANT_ORIENTATION_AUTHORIZED', authority.repetitionLocalization.orientationsDegrees.includes(first.repetition.dominant.orientationDegrees), first.repetition.dominant);
check('DOMINANT_REPETITION_NONTRIVIAL', first.repetition.dominant.score > 0 && first.repetition.dominant.score <= 1, first.repetition.dominant);
check('HOTSPOT_MINIMUM_RETAINED', first.hotspots.length >= authority.gates.minimumRetainedHotspots, { count: first.hotspots.length, minimum: authority.gates.minimumRetainedHotspots });
const activeClasses = first.classHistogram.filter((count) => count > 0).length;
check('LANDFORM_CLASS_DIVERSITY', activeClasses >= authority.gates.minimumLandformClassCount, { activeClasses, histogram: first.classHistogram });
check('RIDGE_AND_VALLEY_NETWORKS_PRESENT', countNonzero(first.ridgeSeed) > 0 && countNonzero(first.valleySeed) > 0, { ridgeCells: countNonzero(first.ridgeSeed), valleyCells: countNonzero(first.valleySeed) });
check('FLOW_ACCUMULATION_NONTRIVIAL', first.summaries.flowAccumulation.maximum > 1, first.summaries.flowAccumulation);
const nonfiniteDescriptors = Object.entries(first.summaries).filter(([, summary]) => summary.finiteCount !== summary.elementCount).map(([name]) => name);
check('ALL_DESCRIPTOR_VALUES_FINITE', nonfiniteDescriptors.length === 0, { nonfiniteDescriptors });
check('MORPHOLOGY_SCALE_DERIVED_FROM_DOMINANT_LAG', first.radii.large === first.repetition.dominant.lagCells && first.radii.medium === Math.max(2, Math.round(first.radii.large / 2)) && first.radii.small === Math.max(1, Math.round(first.radii.large / 4)), { radii: first.radii, dominantLag: first.repetition.dominant.lagCells });
check('NO_HEIGHTFIELD_OR_PROBE_MUTATION', authority.boundaries.heightfieldMutationPerformed === false && authority.boundaries.probeGenerationStarted === false && authority.boundaries.productMutationPerformed === false);

const summary = {
  baselineDigest: first.baselineDigest,
  grid: first.grid,
  domain: first.domain,
  dominantRepetition: first.repetition.dominant,
  morphologyRadiiCells: first.radii,
  hotspotCount: first.hotspots.length,
  topHotspots: first.hotspots.slice(0, 12),
  landformClassHistogram: first.classHistogram,
  ridgeCellCount: countNonzero(first.ridgeSeed),
  valleyCellCount: countNonzero(first.valleySeed),
  descriptorSummaries: first.summaries
};
const receiptBody = {
  receiptType: 'H_EARTH_B1_MORPHOLOGY_DESCRIPTOR_BASELINE_RECEIPT_v1',
  checkpoint: 'B1',
  result: failures.length === 0 ? authority.result : 'B1_MORPHOLOGY_DESCRIPTOR_BASELINE_FAIL',
  pass: failures.length === 0,
  baseHead: authority.controllingB0Merge,
  executedHead: head,
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  summary,
  productMutationPerformed: false,
  heightfieldMutationPerformed: false,
  liveRouteChanged: false,
  b2Authorized: failures.length === 0
};
const canonicalReceiptSha256 = crypto.createHash('sha256').update(JSON.stringify(receiptBody)).digest('hex');
console.log(JSON.stringify({ ...receiptBody, canonicalReceiptSha256 }, null, 2));
if (failures.length) process.exit(1);
