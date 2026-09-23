import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import authority from '../../control-plane/post-cp2-round2/morphology/h-earth.b0-morphology-baseline-freeze.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed, status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const expectedPaths = [...authority.exactPathScope].sort();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${authority.controllingHead}..${head}`).split(/\r?\n/).filter(Boolean).sort();
check('EXACT_B0_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('B0_HAS_NO_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });
check('EXACT_BM5_CLOSED_BASE', git('merge-base', authority.controllingHead, head) === authority.controllingHead, { base: authority.controllingHead, head });

for (const [id, record] of Object.entries(authority.frozenSources)) {
  const actual = git('hash-object', record.path);
  check(`FROZEN_${id.toUpperCase()}`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

check('HEIGHTFIELD_Y_ONLY_BOUNDED_MUTABILITY', authority.mutableEnvelope.heightfieldYValues === 'BOUNDED_OFFLINE_PROBES_ONLY');
check('XZ_TOPOLOGY_VERTEX_COUNT_FROZEN', authority.mutableEnvelope.heightfieldXZCoordinates === 'FROZEN' && authority.mutableEnvelope.meshIndexTopology === 'FROZEN' && authority.mutableEnvelope.vertexCount === 'FROZEN');
check('RUNTIME_CP2_AUTHORITIES_FROZEN', authority.mutableEnvelope.runtimeRenderer === 'ACCEPTED_CP2_EXACT' && authority.mutableEnvelope.runtimeMaterials === 'ACCEPTED_CP2_EXACT' && authority.mutableEnvelope.runtimeTextures === 'ACCEPTED_CP2_EXACT');
check('P0_P1_P2_CLASSES_FIXED', ['P0','P1','P2'].every((id) => authority.protectedAuthorityClasses[id]));
check('EXACT_TWO_PROBES_FIXED', JSON.stringify(authority.probeLaw.amplitudesRelativeToLocalRelief) === JSON.stringify([0.04, 0.08]) && authority.probeLaw.exactlyTwoProbes === true && authority.probeLaw.thirdAmplitudeProhibited === true);
check('CLASSIFICATION_GAP_CLOSED', authority.classificationLaw.leverageEstablished.heightfieldDirectionalRepetitionReductionMinimum === 0.10 && authority.classificationLaw.leverageEstablished.finalFrameRepetitionReductionMinimum === 0.08 && authority.classificationLaw.leverageEstablished.improvedSceneMinimum === 5 && authority.classificationLaw.leverageNotEstablished.bothProbeFinalFrameReductionMaximumExclusive === 0.05 && authority.classificationLaw.otherwise === 'WEAK_OR_INCONCLUSIVE_LEVERAGE');
check('PROBE_GENERATION_NOT_STARTED', authority.boundaries.probeGenerationStarted === false);
check('LIVE_ROUTE_FROZEN', authority.mutableEnvelope.liveRoute === 'FROZEN' && authority.boundaries.productMutationPerformed === false);

const receiptBody = {
  receiptType: 'H_EARTH_B0_MORPHOLOGY_BASELINE_FREEZE_RECEIPT_v1',
  checkpoint: 'B0',
  result: failures.length === 0 ? authority.result : 'B0_MORPHOLOGY_BASELINE_FREEZE_FAIL',
  pass: failures.length === 0,
  baseHead: authority.controllingHead,
  executedHead: head,
  changedPaths,
  frozenSources: authority.frozenSources,
  checks,
  failureCount: failures.length,
  failures,
  productMutationPerformed: false,
  liveRouteChanged: false,
  b1Authorized: failures.length === 0
};
const canonical = JSON.stringify(receiptBody);
const receipt = {
  ...receiptBody,
  canonicalReceiptSha256: crypto.createHash('sha256').update(canonical).digest('hex')
};
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exit(1);
