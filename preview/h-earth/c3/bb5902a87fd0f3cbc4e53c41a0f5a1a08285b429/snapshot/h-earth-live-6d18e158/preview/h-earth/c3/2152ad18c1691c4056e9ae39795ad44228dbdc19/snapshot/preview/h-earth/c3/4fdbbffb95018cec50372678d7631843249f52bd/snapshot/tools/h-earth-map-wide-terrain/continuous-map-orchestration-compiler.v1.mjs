#!/usr/bin/env node
import { address, fail, hashObject } from './lib.v1.mjs';

export function compileContinuousOrchestration({ census, zonePlan }) {
  const byAddress = new Map(zonePlan.cellAssignments.map(item => [item.cellAddress, item]));
  const cellOperations = zonePlan.cellAssignments.map(item => ({
    cellAddress: item.cellAddress,
    mode: item.protected ? 'PROTECTED_RESERVATION_MASK' : 'ARTICULATE',
    familyId: item.familyId,
    parameters: { amplitude: item.amplitude, spacing: item.spacing, rotationDeg: item.rotationDeg },
    supportMask: item.supportMask,
    smoothBlend: item.smoothBlend,
    outputFieldId: census.world.continuousFieldId
  }));
  const adjacencyBlends = [];
  for (let row = 0; row < census.world.latticeRows; row += 1) {
    for (let column = 0; column < census.world.latticeColumns; column += 1) {
      const current = address(row, column);
      for (const [dr, dc, edge] of [[0,1,'EAST_WEST'],[1,0,'NORTH_SOUTH']]) {
        const nr = row + dr;
        const nc = column + dc;
        if (nr >= census.world.latticeRows || nc >= census.world.latticeColumns) continue;
        const neighbor = address(nr, nc);
        if (!byAddress.has(current) || !byAddress.has(neighbor)) fail('ZONE_COVERAGE_GAP');
        adjacencyBlends.push({ a: current, b: neighbor, edge, blendLaw: 'C2_SMOOTH_SUPPORT_MASK_BLEND', status: 'REQUIRED_AND_PRESENT' });
      }
    }
  }
  if (adjacencyBlends.length !== census.adjacencyEdgeCount || adjacencyBlends.some(edge => edge.status !== 'REQUIRED_AND_PRESENT')) fail('ADJACENCY_BLEND_MISSING');
  const payload = {
    continuousFieldId: census.world.continuousFieldId,
    compilationMode: 'ONE_CONTINUOUS_MAP_WIDE_SUCCESSOR_FIELD_PLAN',
    disconnectedCellModels: false,
    cellOperations,
    adjacencyBlends
  };
  return { schema: 'CONTINUOUS_MAP_WIDE_SUCCESSOR_PLAN_v1', ...payload, orchestrationDigest: hashObject(payload) };
}
