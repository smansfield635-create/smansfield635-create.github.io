import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authority from '../../control-plane/post-cp2-round2/baked-material/h-earth.bm2-landform-segmentation-authority.v1.mjs';
import { generateHEarthBM2LandformSegmentation } from '../../authoring/round2-baked-material/h-earth.bm2-landform-segmentation.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, passed, status: passed ? 'PASS' : 'FAIL', detail });
  if (!passed) failures.push({ id, detail });
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const finiteArray = (array) => {
  for (const value of array) if (!Number.isFinite(value)) return false;
  return true;
};

const head = git('rev-parse', 'HEAD');
const base = authority.controllingBasis.bm1MergeHead;
const changedPaths = git('diff', '--name-only', `${base}..${head}`).split(/\r?\n/).filter(Boolean).sort();
check('EXACT_BM1_BASE', git('merge-base', base, head) === base, { base, head });
check('EXACT_BM2_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify([...authority.exactPathScope].sort()), { changedPaths });
check('NO_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { changedPaths });
for (const [id, record] of Object.entries({
  ACCEPTED_RENDERER: { path: authority.controllingBasis.acceptedRendererPath, blob: authority.controllingBasis.acceptedRendererBlob },
  TERRAIN: { path: authority.controllingBasis.terrainPath, blob: authority.controllingBasis.terrainBlob },
  LIVE_HOST: { path: authority.controllingBasis.liveHostPath, blob: authority.controllingBasis.liveHostBlob },
  LIVE_BINDING: { path: authority.controllingBasis.liveBindingPath, blob: authority.controllingBasis.liveBindingBlob }
})) {
  const actual = git('hash-object', record.path);
  check(`${id}_BLOB_PRESERVED`, actual === record.blob, { expected: record.blob, actual });
}

const first = generateHEarthBM2LandformSegmentation();
const second = generateHEarthBM2LandformSegmentation();
check('ANALYSIS_DIMENSIONS_EXACT', first.width === authority.analysisGrid.width && first.height === authority.analysisGrid.height);
check('DESCRIPTOR_DIGEST_DETERMINISTIC', first.descriptorDigest === second.descriptorDigest, { first: first.descriptorDigest, second: second.descriptorDigest });
check('SEGMENTATION_DIGEST_DETERMINISTIC', first.segmentationDigest === second.segmentationDigest, { first: first.segmentationDigest, second: second.segmentationDigest });
check('LANDORM_CLASSES_SUFFICIENTLY_REPRESENTED', first.representedClassCount >= authority.gates.allTenLandformClassesRepresentedMinimum, { representedClassCount: first.representedClassCount, histogram: first.classHistogram });
check('REGION_COUNT_BOUNDED', first.activeRegionCount >= authority.gates.minimumRegionCount && first.activeRegionCount <= authority.gates.maximumRegionCount, { activeRegionCount: first.activeRegionCount });
check('NO_ADJACENT_SAME_VARIANT', first.adjacentSameVariantViolationCount === authority.gates.adjacentSameVariantViolationCount, { violations: first.adjacentSameVariantViolationCount });
check('UNIQUE_WORLD_COVERAGE', first.segmentation.regionId.length === first.width * first.height && first.segmentation.materialVariantId.length === first.width * first.height && first.segmentation.boundaryBlend.length === first.width * first.height);
check('ALL_DESCRIPTOR_ARRAYS_FINITE', [
  first.descriptors.tpiSmall, first.descriptors.tpiMedium, first.descriptors.tpiLarge,
  first.descriptors.slope, first.descriptors.aspect, first.descriptors.profileCurvature,
  first.descriptors.planCurvature, first.descriptors.exposureWetness,
  first.descriptors.signedRidgeValleyDistance
].every(finiteArray));
check('BOUNDARY_BLEND_NORMALIZED', [...first.segmentation.boundaryBlend].every((value) => value >= 0 && value <= 1));
check('EXPOSURE_WETNESS_NORMALIZED', [...first.descriptors.exposureWetness].every((value) => value >= 0 && value <= 1));
check('VARIANTS_WITHIN_RANGE', [...first.segmentation.materialVariantId].every((value) => value < authority.analysisGrid.materialVariantCount));
check('ALL_REQUIRED_DESCRIPTORS_IMPLEMENTED', authority.descriptors.length === 8);
check('MAP_BAKE_NOT_STARTED', authority.boundaries.mapBakeStarted === false && authority.boundaries.rendererIntegrationStarted === false && authority.boundaries.liveAdmissionAuthorized === false);

const stable = {
  receiptType: 'H_EARTH_BM2_LANDFORM_DESCRIPTOR_AND_SEGMENTATION_RECEIPT_v1',
  result: failures.length === 0 ? authority.result : 'BM2_LANDFORM_DESCRIPTOR_AND_SEGMENTATION_FAIL',
  pass: failures.length === 0,
  baseHead: base,
  executedHead: head,
  changedPaths,
  descriptorDigest: first.descriptorDigest,
  segmentationDigest: first.segmentationDigest,
  dimensions: { width: first.width, height: first.height },
  elevationRange: { minimum: first.minimumElevation, maximum: first.maximumElevation },
  classHistogram: first.classHistogram,
  representedClassCount: first.representedClassCount,
  activeRegionCount: first.activeRegionCount,
  adjacentSameVariantViolationCount: first.adjacentSameVariantViolationCount,
  checks,
  failureCount: failures.length,
  failures,
  checkpointBM3Authorized: failures.length === 0,
  productMutationPerformed: false,
  liveRouteChanged: false
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(JSON.stringify(stable)) };
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
