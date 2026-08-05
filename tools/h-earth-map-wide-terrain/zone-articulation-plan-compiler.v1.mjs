#!/usr/bin/env node
import { fail, hashObject, within } from './lib.v1.mjs';

export function compileZonePlan({ census, estateValidation, zoneDefinitions, operatorRegistry }) {
  const familyMap = new Map(operatorRegistry.families.map(f => [f.familyId, f]));
  const assignment = new Map();
  const protectedSet = new Set(estateValidation.protectedCells);
  const zones = [];
  for (const zone of zoneDefinitions) {
    const family = familyMap.get(zone.familyId);
    if (!family) fail('UNAUTHORIZED_OPERATOR_FAMILY', zone.familyId);
    const zoneCells = census.cells.filter(cell => cell.row >= zone.rowRange[0] && cell.row <= zone.rowRange[1] && cell.column >= zone.columnRange[0] && cell.column <= zone.columnRange[1]);
    if (!zoneCells.length) fail('ZONE_COVERAGE_GAP', zone.zoneId);
    for (const cell of zoneCells) {
      if (assignment.has(cell.address)) fail('ZONE_OVERLAP', cell.address);
      const protectedCell = protectedSet.has(cell.address);
      const localIndex = cell.row * census.world.latticeColumns + cell.column;
      const amplitude = Number(Math.min(family.parameterBounds.amplitude.max, Math.max(family.parameterBounds.amplitude.min, zone.baseAmplitude + ((localIndex % 11) - 5) * 0.006)).toFixed(3));
      const spacing = Number(Math.min(family.parameterBounds.spacing.max, Math.max(family.parameterBounds.spacing.min, zone.baseSpacing + ((localIndex % 9) - 4) * 1.25)).toFixed(3));
      const rotationDeg = Number((((zone.baseRotationDeg + localIndex * 17.3 + 180) % 360) - 180).toFixed(3));
      if (!within(amplitude, family.parameterBounds.amplitude.min, family.parameterBounds.amplitude.max) || !within(spacing, family.parameterBounds.spacing.min, family.parameterBounds.spacing.max)) fail('OPERATOR_PARAMETER_OUT_OF_BOUNDS', cell.address);
      assignment.set(cell.address, {
        cellAddress: cell.address,
        zoneId: zone.zoneId,
        protected: protectedCell,
        familyId: zone.familyId,
        amplitude: protectedCell ? 0 : amplitude,
        spacing,
        rotationDeg,
        supportMask: protectedCell ? 'ESTATE_ZERO_INFLUENCE_MASK' : `CELL_SUPPORT_${cell.address}`,
        smoothBlend: true,
        traversalRequired: Boolean(zone.traversalRequired)
      });
    }
    zones.push({ ...zone, cellCount: zoneCells.length });
  }
  if (assignment.size !== census.cells.length) fail('ZONE_COVERAGE_GAP', `${assignment.size}/${census.cells.length}`);
  const cellAssignments = [...assignment.values()].sort((a,b) => a.cellAddress.localeCompare(b.cellAddress));
  const payload = { zones, cellAssignments, protectedCells: [...protectedSet].sort() };
  return { schema: 'ZONE_ARTICULATION_PLAN_v1', ...payload, planDigest: hashObject(payload) };
}
