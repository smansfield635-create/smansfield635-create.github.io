import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import b0 from '../../control-plane/post-cp2-round2/morphology/h-earth.b0-morphology-baseline-freeze.v1.mjs';
import authority from '../../control-plane/post-cp2-round2/morphology/h-earth.b2-protection-model.v1.mjs';
import { buildHEarthB2ProtectionModel } from '../../analysis/morphology/h-earth.b2-protection-model.v1.mjs';

const VERIFICATION_TRIGGER_REVISION = 1;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed, status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${authority.controllingB1Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactPathScope].sort();
check('EXACT_B2_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('B2_HAS_NO_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });
check('EXACT_B1_CLOSED_BASE', git('merge-base', authority.controllingB1Merge, head) === authority.controllingB1Merge, { base: authority.controllingB1Merge, head });
for (const [id, record] of Object.entries(b0.frozenSources)) {
  const actual = git('hash-object', record.path);
  check(`B2_FROZEN_${id.toUpperCase()}`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

const first = buildHEarthB2ProtectionModel(authority);
const second = buildHEarthB2ProtectionModel(authority);
check('INDEPENDENT_PROTECTION_DIGESTS_IDENTICAL', first.protectionDigest === second.protectionDigest, { first: first.protectionDigest, second: second.protectionDigest });
check('B1_BASELINE_DIGEST_FROZEN', first.baselineDigest === authority.b1BaselineDigest, { actual: first.baselineDigest, expected: authority.b1BaselineDigest });
check('ALL_P0_ANCHORS_RESOLVED', first.anchorReceipts.length === authority.p0.acceptedWaypointAnchors.length + authority.p0.manorAnchors.length + authority.p0.cavernAnchors.length + authority.p0.exactContractAnchors.length && first.anchorReceipts.every((record) => first.p0[record.resolvedIndex] === 1), { anchorReceipts: first.anchorReceipts });
let p0P1Overlap = 0;
for (let index = 0; index < first.p0.length; index += 1) if (first.p0[index] && first.p1[index]) p0P1Overlap += 1;
check('P0_P1_DISJOINT', p0P1Overlap === 0, { p0P1Overlap });
check('P0_CELL_FRACTION_WITHIN_GATE', first.summary.p0Fraction <= authority.gates.maximumP0CellFraction, { actual: first.summary.p0Fraction, maximum: authority.gates.maximumP0CellFraction });
check('EDITABLE_CELL_FRACTION_WITHIN_GATE', first.summary.editableCellFraction >= authority.gates.minimumEditableCellFraction, { actual: first.summary.editableCellFraction, minimum: authority.gates.minimumEditableCellFraction });
check('HOTSPOT_EDITABLE_CELL_FRACTION_WITHIN_GATE', first.summary.hotspotEditableCellFraction >= authority.gates.minimumHotspotEditableCellFraction, { actual: first.summary.hotspotEditableCellFraction, minimum: authority.gates.minimumHotspotEditableCellFraction });
check('P0_P1_P2_NONEMPTY', first.summary.p0CellCount > 0 && first.summary.p1CellCount > 0 && first.summary.p2CellCount > 0, first.summary);
check('ALL_HARDNESS_WEIGHTS_FINITE_BOUNDED', first.summary.hardness.finiteCount === first.summary.hardness.elementCount && first.summary.editableWeight.finiteCount === first.summary.editableWeight.elementCount && first.summary.hardness.minimum >= 0 && first.summary.hardness.maximum <= 1 && first.summary.editableWeight.minimum >= 0 && first.summary.editableWeight.maximum <= 1, { hardness: first.summary.hardness, editableWeight: first.summary.editableWeight });
check('P0_HARDNESS_EXACT_ONE', first.p0.every((value, index) => !value || first.hardness[index] === 1));
check('P1_HARDNESS_FIXED', first.p1.every((value, index) => !value || Math.abs(first.hardness[index] - authority.hardnessLaw.p1) <= 1e-7));
check('NO_HEIGHTFIELD_OR_PROBE_MUTATION', authority.boundaries.heightfieldMutationPerformed === false && authority.boundaries.probeGenerationStarted === false && authority.boundaries.productMutationPerformed === false && authority.boundaries.liveRouteChanged === false);

const receiptBody = {
  receiptType: 'H_EARTH_B2_PROTECTION_MODEL_RECEIPT_v1',
  checkpoint: 'B2',
  verificationTriggerRevision: VERIFICATION_TRIGGER_REVISION,
  result: failures.length === 0 ? authority.result : 'B2_PROTECTION_MODEL_FAIL',
  pass: failures.length === 0,
  baseHead: authority.controllingB1Merge,
  executedHead: head,
  changedPaths,
  protectionDigest: first.protectionDigest,
  b1BaselineDigest: first.baselineDigest,
  summary: first.summary,
  anchorReceipts: first.anchorReceipts,
  checks,
  failureCount: failures.length,
  failures,
  productMutationPerformed: false,
  heightfieldMutationPerformed: false,
  liveRouteChanged: false,
  b3Authorized: failures.length === 0
};
const canonicalReceiptSha256 = crypto.createHash('sha256').update(JSON.stringify(receiptBody)).digest('hex');
console.log(JSON.stringify({ ...receiptBody, canonicalReceiptSha256 }, null, 2));
if (failures.length) process.exit(1);
