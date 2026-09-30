#!/usr/bin/env node
import { contains, fail, hashObject, intersects } from './lib.v1.mjs';

const REQUIRED = ['MANOR_CORE','COURTYARD_AND_GARDENS','DRIVE_AND_APPROACH','OUTBUILDING_SPACE','FUTURE_EXPANSION','COASTAL_VIEW_CORRIDOR','BUILDABLE_SLOPE_LIMIT','TERRAIN_BUFFER'];

export function validateEstateReservation({ reservation, census }) {
  const byType = new Map(reservation.components.map(component => [component.type, component]));
  for (const type of REQUIRED) if (!byType.has(type)) fail('ESTATE_COMPONENT_MISSING', type);
  const core = byType.get('MANOR_CORE');
  if (!core.bounds || !contains(core.bounds, reservation.anchor)) fail('ESTATE_ANCHOR_OUTSIDE_MANOR_CORE');
  const world = census.world;
  for (const component of reservation.components) {
    if (!component.protected) fail('ESTATE_COMPONENT_NOT_PROTECTED', component.type);
    if (component.bounds && (component.bounds.minX < world.originX || component.bounds.maxX > world.originX + world.width || component.bounds.minZ < world.originZ || component.bounds.maxZ > world.originZ + world.depth)) fail('ESTATE_COMPONENT_OUTSIDE_WORLD', component.type);
  }
  if (reservation.buildableSlopeLimitDeg > 12) fail('ESTATE_BUILDABLE_SLOPE_LIMIT_EXCEEDED');
  if (!reservation.accessCorridors.length || reservation.accessCorridors.some(c => !c.traversable || c.minWidth < 8)) fail('ESTATE_ACCESS_CORRIDOR_INVALID');
  const spatial = reservation.components.filter(c => c.bounds);
  const protectedCells = census.cells.filter(cell => spatial.some(component => intersects(cell.bounds, component.bounds))).map(cell => cell.address).sort();
  const payload = {
    reservationId: reservation.reservationId,
    anchor: reservation.anchor,
    protectedCells,
    componentTypes: REQUIRED,
    viewCorridor: reservation.viewCorridor,
    accessCorridors: reservation.accessCorridors,
    buildableSlopeLimitDeg: reservation.buildableSlopeLimitDeg,
    terrainBuffer: reservation.terrainBuffer
  };
  return { schema: 'ESTATE_RESERVATION_VALIDATION_RESULT_v1', result: 'PASS_CLOSED', ...payload, reservationDigest: hashObject(payload) };
}
