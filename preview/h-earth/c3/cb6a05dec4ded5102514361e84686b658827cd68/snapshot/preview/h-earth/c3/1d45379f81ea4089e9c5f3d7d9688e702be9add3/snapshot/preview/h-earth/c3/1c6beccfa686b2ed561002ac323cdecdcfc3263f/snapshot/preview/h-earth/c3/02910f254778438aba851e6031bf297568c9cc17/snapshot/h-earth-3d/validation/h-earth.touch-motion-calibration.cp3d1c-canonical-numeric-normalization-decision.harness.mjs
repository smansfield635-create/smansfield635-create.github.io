import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { buildCP3D1CCanonicalizationReceipt } from './h-earth.touch-motion-calibration.cp3d1c-canonical-numeric-normalization-probe.mjs';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const probeUrl = `${origin}/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d1c-canonical-numeric-normalization-probe.mjs`;
await mkdir(evidenceDirectory, { recursive: true });

const nodeReceipt = await buildCP3D1CCanonicalizationReceipt('NODE');
const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
const browserReceipt = await page.evaluate(async url => {
  const module = await import(`${url}?runtime=BROWSER&stamp=${Date.now()}`);
  return module.buildCP3D1CCanonicalizationReceipt('BROWSER');
}, probeUrl);
await browser.close();

const browserById = new Map(browserReceipt.candidates.map(candidate => [candidate.candidateId, candidate]));
const comparisons = nodeReceipt.candidates.map(nodeCandidate => {
  const browserCandidate = browserById.get(nodeCandidate.candidateId);
  const canonicalBytesEqual =
    browserCandidate?.canonicalFloat64LittleEndianSHA256 === nodeCandidate.canonicalFloat64LittleEndianSHA256;
  return {
    candidateId: nodeCandidate.candidateId,
    law: nodeCandidate.law,
    canonicalBytesEqual,
    nodeSHA256: nodeCandidate.canonicalFloat64LittleEndianSHA256,
    browserSHA256: browserCandidate?.canonicalFloat64LittleEndianSHA256 ?? null,
    nodeMaximumAbsoluteAdjustment: nodeCandidate.maximumAbsoluteAdjustment,
    browserMaximumAbsoluteAdjustment: browserCandidate?.maximumAbsoluteAdjustment ?? null,
    maximumObservedAbsoluteAdjustment: Math.max(
      nodeCandidate.maximumAbsoluteAdjustment,
      browserCandidate?.maximumAbsoluteAdjustment ?? Number.POSITIVE_INFINITY
    ),
    nodeChangedElementCount: nodeCandidate.changedElementCount,
    browserChangedElementCount: browserCandidate?.changedElementCount ?? null,
    nodeVertex72Y: nodeCandidate.vertex72Y,
    browserVertex72Y: browserCandidate?.vertex72Y ?? null
  };
});

const passing = comparisons.filter(candidate => candidate.canonicalBytesEqual);
const preferenceOrder = [
  'DECIMAL_FIXED_15',
  'DECIMAL_FIXED_14',
  'DECIMAL_FIXED_13',
  'DECIMAL_FIXED_12',
  'BINARY_GRID_2_NEGATIVE_24',
  'FLOAT32_MATH_FROUND',
  'BINARY_GRID_2_NEGATIVE_20'
];
const selected = preferenceOrder
  .map(id => passing.find(candidate => candidate.candidateId === id))
  .find(Boolean) ?? null;

const decision = {
  receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1C_CANONICAL_TRANSCENDENTAL_NUMERIC_NORMALIZATION_DECISION_v1',
  checkpoint: 'CP3D_1C_CANONICAL_TRANSCENDENTAL_NUMERIC_NORMALIZATION_DECISION',
  status: selected ? 'CANONICALIZATION_CANDIDATE_SELECTED' : 'NO_CANDIDATE_PROVEN',
  sourceDefect: {
    operation: 'Math.sin((-104 - 18) / 31)',
    nodeValue: 0.7130867027035391,
    browserValue: 0.713086702703539,
    ulpDelta: '1'
  },
  selectionLaw: 'HIGHEST_TESTED_PRECISION_WITH_FULL_POSITION_BUFFER_BYTE_EQUALITY',
  selectedCandidate: selected,
  comparisons,
  productionMutationPerformed: false,
  rendererExpectationChanged: false,
  identityGuardWeakened: false,
  stoppingBoundary: selected
    ? 'STOP_BEFORE_PRODUCTION_CANONICALIZATION_MUTATION'
    : 'STOP_AND_EXPAND_CANDIDATE_SET'
};

await writeFile(`${evidenceDirectory}/cp3d1c-node-candidates.receipt.json`, `${JSON.stringify(nodeReceipt, null, 2)}\n`);
await writeFile(`${evidenceDirectory}/cp3d1c-browser-candidates.receipt.json`, `${JSON.stringify(browserReceipt, null, 2)}\n`);
await writeFile(`${evidenceDirectory}/cp3d1c-decision.receipt.json`, `${JSON.stringify(decision, null, 2)}\n`);
console.log(JSON.stringify(decision, null, 2));

if (!selected) throw new Error('CP3D1C_NO_CANONICALIZATION_CANDIDATE_PROVEN');
throw new Error(`CP3D1C_DECISION_COMPLETE:${selected.candidateId}`);
