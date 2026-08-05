#!/usr/bin/env node
import { entropy, fail, hashObject } from './lib.v1.mjs';

export function detectVarianceAndRepetition({ zonePlan, orchestration, constraints, overrideMetrics = null }) {
  const active = zonePlan.cellAssignments.filter(item => !item.protected);
  const signatures = active.map(item => `${item.familyId}|${item.amplitude.toFixed(3)}|${item.spacing.toFixed(3)}|${item.rotationDeg.toFixed(1)}`);
  const counts = new Map();
  for (const signature of signatures) counts.set(signature, (counts.get(signature) ?? 0) + 1);
  const maxRepeatedSignature = overrideMetrics?.maxRepeatedSignature ?? Math.max(...counts.values());
  const uniqueSignatureRatio = new Set(signatures).size / signatures.length;
  const distinctFamilies = new Set(active.map(item => item.familyId)).size;
  const familyEntropy = entropy(active.map(item => item.familyId));
  const rotationBuckets = active.map(item => Math.round(item.rotationDeg / 15));
  const gridCorrelation = overrideMetrics?.gridCorrelation ?? Number((Math.abs(rotationBuckets.reduce((sum, bucket, index) => sum + bucket * ((index % 16) - 7.5), 0)) / (rotationBuckets.length * 180)).toFixed(4));
  if (maxRepeatedSignature > constraints.maxRepeatedSignature) fail('REPETITION_SIGNATURE_EXCEEDED', `${maxRepeatedSignature}`);
  if (gridCorrelation > constraints.maxGridCorrelation) fail('GRID_CORRELATION_EXCEEDED', `${gridCorrelation}`);
  if (distinctFamilies < constraints.minDistinctFamilies || uniqueSignatureRatio < constraints.minUniqueSignatureRatio) fail('INSUFFICIENT_GLOBAL_VARIANCE');
  const metrics = {
    activeCellCount: active.length,
    distinctFamilies,
    familyEntropy: Number(familyEntropy.toFixed(4)),
    uniqueSignatureRatio: Number(uniqueSignatureRatio.toFixed(4)),
    maxRepeatedSignature,
    gridCorrelation,
    disconnectedCellModels: orchestration.disconnectedCellModels
  };
  return { schema: 'GLOBAL_VARIANCE_REPETITION_RESULT_v1', result: 'PASS_CLOSED', metrics, failures: [], detectorDigest: hashObject(metrics) };
}
