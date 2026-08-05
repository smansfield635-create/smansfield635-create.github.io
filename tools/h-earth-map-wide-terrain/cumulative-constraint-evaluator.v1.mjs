#!/usr/bin/env node
import { fail, hashObject } from './lib.v1.mjs';

export function evaluateCumulativeConstraints({ census, estateValidation, zonePlan, orchestration, constraints }) {
  for (const operation of orchestration.cellOperations) {
    if (estateValidation.protectedCells.includes(operation.cellAddress) && operation.mode !== 'PROTECTED_RESERVATION_MASK') fail('ESTATE_MASK_INTRUSION', operation.cellAddress);
    if (estateValidation.protectedCells.includes(operation.cellAddress) && operation.parameters.amplitude !== 0) fail('ESTATE_MASK_INTRUSION', operation.cellAddress);
  }
  if (orchestration.adjacencyBlends.length !== census.adjacencyEdgeCount || orchestration.adjacencyBlends.some(edge => edge.status !== 'REQUIRED_AND_PRESENT')) fail('ADJACENCY_BLEND_MISSING');
  const active = orchestration.cellOperations.filter(op => op.mode === 'ARTICULATE');
  const maxProjectedSlopeDeg = Math.max(...active.map(op => 14 + Math.abs(op.parameters.amplitude) * 48));
  if (maxProjectedSlopeDeg > constraints.maxTerrainSlopeDeg) fail('CUMULATIVE_SLOPE_LIMIT_EXCEEDED', maxProjectedSlopeDeg.toFixed(3));
  const requiredTraversal = zonePlan.cellAssignments.filter(item => item.traversalRequired && !item.protected);
  const traversableAddresses = new Set(census.cells.filter(cell => cell.traversable).map(cell => cell.address));
  if (!requiredTraversal.some(item => traversableAddresses.has(item.cellAddress))) fail('TRAVERSAL_CORRIDOR_LOST');
  const estimatedOperations = active.length * 2 + orchestration.adjacencyBlends.length;
  if (estimatedOperations > constraints.maxEstimatedOperations) fail('PERFORMANCE_BUDGET_EXCEEDED', `${estimatedOperations}`);
  const cumulativeDisplacement = Number(active.reduce((sum, op) => sum + Math.abs(op.parameters.amplitude), 0).toFixed(3));
  if (cumulativeDisplacement > constraints.maxCumulativeDisplacement) fail('CUMULATIVE_DISPLACEMENT_EXCEEDED', `${cumulativeDisplacement}`);
  const metrics = {
    activeCellCount: active.length,
    protectedCellCount: estateValidation.protectedCells.length,
    adjacencyBlendCount: orchestration.adjacencyBlends.length,
    maxProjectedSlopeDeg: Number(maxProjectedSlopeDeg.toFixed(3)),
    estimatedOperations,
    cumulativeDisplacement,
    traversalCorridorCount: requiredTraversal.filter(item => traversableAddresses.has(item.cellAddress)).length,
    estateIntrusionCount: 0
  };
  return { schema: 'CUMULATIVE_CONSTRAINT_RESULT_v1', result: 'PASS_CLOSED', metrics, failures: [], evaluationDigest: hashObject(metrics) };
}
