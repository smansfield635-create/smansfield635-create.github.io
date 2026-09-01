import { buildHEarthB1MorphologyDescriptorBaseline } from './h-earth.b1-morphology-descriptor-baseline.v1.mjs';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const finite = Number.isFinite;
const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function hashBytes(arrays) {
  let hash = FNV_OFFSET;
  for (const array of arrays) {
    const bytes = array instanceof Uint8Array
      ? array
      : new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
    for (const byte of bytes) {
      hash ^= byte;
      hash = Math.imul(hash, FNV_PRIME) >>> 0;
    }
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}

function gridCoordinate(value, minimum, spacing, maximumIndex) {
  return clamp(Math.round((value - minimum) / spacing), 0, maximumIndex);
}
function indexForWorld(model, x, z) {
  const column = gridCoordinate(x, model.domain.xMinimum, model.grid.xSpacing, model.grid.width - 1);
  const row = gridCoordinate(z, model.domain.zMinimum, model.grid.zSpacing, model.grid.height - 1);
  return { index: row * model.grid.width + column, column, row };
}
function worldForCell(model, column, row) {
  return {
    x: model.domain.xMinimum + column * model.grid.xSpacing,
    z: model.domain.zMinimum + row * model.grid.zSpacing
  };
}
function markCircle(mask, model, center, radiusWorldUnits, value = 1) {
  const radiusCells = Math.ceil(radiusWorldUnits / Math.min(model.grid.xSpacing, model.grid.zSpacing));
  const anchor = indexForWorld(model, center.x, center.z);
  for (let row = Math.max(0, anchor.row - radiusCells); row <= Math.min(model.grid.height - 1, anchor.row + radiusCells); row += 1) {
    for (let column = Math.max(0, anchor.column - radiusCells); column <= Math.min(model.grid.width - 1, anchor.column + radiusCells); column += 1) {
      const world = worldForCell(model, column, row);
      if (Math.hypot(world.x - center.x, world.z - center.z) <= radiusWorldUnits + 1e-9) {
        mask[row * model.grid.width + column] = value;
      }
    }
  }
}
function markRectangle(mask, model, bounds, value = 1) {
  for (let row = 0; row < model.grid.height; row += 1) {
    for (let column = 0; column < model.grid.width; column += 1) {
      const world = worldForCell(model, column, row);
      if (world.x >= bounds.xMinimum && world.x <= bounds.xMaximum && world.z >= bounds.zMinimum && world.z <= bounds.zMaximum) {
        mask[row * model.grid.width + column] = value;
      }
    }
  }
}
function pointToSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const lengthSquared = dx * dx + dz * dz;
  if (lengthSquared <= 1e-12) return Math.hypot(point.x - start.x, point.z - start.z);
  const t = clamp(((point.x - start.x) * dx + (point.z - start.z) * dz) / lengthSquared, 0, 1);
  return Math.hypot(point.x - (start.x + t * dx), point.z - (start.z + t * dz));
}
function markCorridor(mask, model, start, end, halfWidthWorldUnits, value = 1) {
  for (let row = 0; row < model.grid.height; row += 1) {
    for (let column = 0; column < model.grid.width; column += 1) {
      const world = worldForCell(model, column, row);
      if (pointToSegmentDistance(world, start, end) <= halfWidthWorldUnits + 1e-9) {
        mask[row * model.grid.width + column] = value;
      }
    }
  }
}
function markNearestLine(mask, model, axis, coordinate, value = 1) {
  if (axis === 'x') {
    const column = gridCoordinate(coordinate, model.domain.xMinimum, model.grid.xSpacing, model.grid.width - 1);
    for (let row = 0; row < model.grid.height; row += 1) mask[row * model.grid.width + column] = value;
  } else {
    const row = gridCoordinate(coordinate, model.domain.zMinimum, model.grid.zSpacing, model.grid.height - 1);
    for (let column = 0; column < model.grid.width; column += 1) mask[row * model.grid.width + column] = value;
  }
}
function distanceFromMask(mask, width, height) {
  const result = new Float64Array(mask.length);
  const diagonal = Math.SQRT2;
  for (let index = 0; index < result.length; index += 1) result[index] = mask[index] ? 0 : 1e9;
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const index = row * width + column;
      if (column > 0) result[index] = Math.min(result[index], result[index - 1] + 1);
      if (row > 0) result[index] = Math.min(result[index], result[index - width] + 1);
      if (column > 0 && row > 0) result[index] = Math.min(result[index], result[index - width - 1] + diagonal);
      if (column + 1 < width && row > 0) result[index] = Math.min(result[index], result[index - width + 1] + diagonal);
    }
  }
  for (let row = height - 1; row >= 0; row -= 1) {
    for (let column = width - 1; column >= 0; column -= 1) {
      const index = row * width + column;
      if (column + 1 < width) result[index] = Math.min(result[index], result[index + 1] + 1);
      if (row + 1 < height) result[index] = Math.min(result[index], result[index + width] + 1);
      if (column + 1 < width && row + 1 < height) result[index] = Math.min(result[index], result[index + width + 1] + diagonal);
      if (column > 0 && row + 1 < height) result[index] = Math.min(result[index], result[index + width - 1] + diagonal);
    }
  }
  return result;
}
function count(mask) {
  let result = 0;
  for (const value of mask) result += value ? 1 : 0;
  return result;
}
function summarizeWeights(values) {
  let minimum = Infinity, maximum = -Infinity, sum = 0, finiteCount = 0;
  for (const value of values) {
    if (!finite(value)) continue;
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
    sum += value;
    finiteCount += 1;
  }
  return { minimum, maximum, mean: sum / Math.max(1, finiteCount), finiteCount, elementCount: values.length };
}

export function buildHEarthB2ProtectionModel(authority) {
  const baseline = buildHEarthB1MorphologyDescriptorBaseline({
    width: authority.grid.width,
    height: authority.grid.height,
    domain: {
      xMinimum: authority.grid.xMinimum,
      xMaximum: authority.grid.xMaximum,
      zMinimum: authority.grid.zMinimum,
      zMaximum: authority.grid.zMaximum,
      seaLevelY: 0
    }
  });
  if (baseline.baselineDigest !== authority.b1BaselineDigest) {
    throw new Error(`B2_B1_BASELINE_DIGEST_MISMATCH:${baseline.baselineDigest}`);
  }

  const length = baseline.heights.length;
  const p0 = new Uint8Array(length);
  const p1 = new Uint8Array(length);
  const p2 = new Uint8Array(length);
  const anchorReceipts = [];

  for (let column = 0; column < baseline.grid.width; column += 1) {
    p0[column] = 1;
    p0[(baseline.grid.height - 1) * baseline.grid.width + column] = 1;
  }
  for (let row = 0; row < baseline.grid.height; row += 1) {
    p0[row * baseline.grid.width] = 1;
    p0[row * baseline.grid.width + baseline.grid.width - 1] = 1;
  }

  const neighborOffsets = [[1,0],[-1,0],[0,1],[0,-1]];
  for (let row = 0; row < baseline.grid.height; row += 1) {
    for (let column = 0; column < baseline.grid.width; column += 1) {
      const index = row * baseline.grid.width + column;
      const elevation = baseline.heights[index];
      let interfaceCell = Math.abs(elevation) <= 0.40;
      for (const [dx, dz] of neighborOffsets) {
        const x = column + dx, z = row + dz;
        if (x < 0 || x >= baseline.grid.width || z < 0 || z >= baseline.grid.height) continue;
        const neighbor = baseline.heights[z * baseline.grid.width + x];
        if ((elevation <= 0 && neighbor > 0) || (elevation > 0 && neighbor <= 0)) interfaceCell = true;
      }
      if (interfaceCell) p0[index] = 1;
    }
  }

  for (const x of authority.p0.navigationChunkBoundaryX) markNearestLine(p0, baseline, 'x', x);
  for (const z of authority.p0.navigationChunkBoundaryZ) markNearestLine(p0, baseline, 'z', z);
  const exactAnchorGroups = [
    ...authority.p0.acceptedWaypointAnchors,
    ...authority.p0.manorAnchors,
    ...authority.p0.cavernAnchors,
    ...authority.p0.exactContractAnchors
  ];
  for (const anchor of exactAnchorGroups) {
    const resolved = indexForWorld(baseline, anchor.x, anchor.z);
    p0[resolved.index] = 1;
    anchorReceipts.push({ ...anchor, resolvedColumn: resolved.column, resolvedRow: resolved.row, resolvedIndex: resolved.index, resolvedWorld: worldForCell(baseline, resolved.column, resolved.row) });
  }

  const p0Distance = distanceFromMask(p0, baseline.grid.width, baseline.grid.height);
  for (let index = 0; index < length; index += 1) {
    if (!p0[index] && p0Distance[index] <= authority.p1.bufferWidthCells + 1e-9) p1[index] = 1;
  }

  markRectangle(p2, baseline, authority.p2.manorEnvelope);
  markCircle(p2, baseline, authority.p2.cavernRelation.face, authority.p2.cavernRelation.localCorrectionRadiusWorldUnits);
  markCircle(p2, baseline, authority.p2.cavernRelation.apron, authority.p2.cavernRelation.localCorrectionRadiusWorldUnits);
  markCircle(p2, baseline, authority.p2.cavernRelation.precinctCenter, authority.p2.cavernRelation.localCorrectionRadiusWorldUnits);
  markRectangle(p2, baseline, authority.p2.ravineRelation);
  markCircle(p2, baseline, authority.p2.lowerCorridor.origin, authority.p2.lowerCorridor.noBuildHalfWidthWorldUnits);
  for (let index = 1; index < authority.p0.acceptedWaypointAnchors.length; index += 1) {
    markCorridor(p2, baseline, authority.p0.acceptedWaypointAnchors[index - 1], authority.p0.acceptedWaypointAnchors[index], authority.p2.traversalCorridorHalfWidthWorldUnits);
  }
  for (const scene of authority.permanentSceneApproaches) {
    markCorridor(p2, baseline, scene.camera, scene.target, authority.p2.approachViewshedHalfWidthWorldUnits);
  }

  const hardness = new Float32Array(length);
  const editableWeight = new Float32Array(length);
  let hotspotEditableCells = 0;
  let hotspotCells = 0;
  for (let index = 0; index < length; index += 1) {
    let value = clamp(authority.hardnessLaw.freeBase - baseline.hotspotWeights[index] * authority.hardnessLaw.hotspotReduction, authority.hardnessLaw.freeMinimum, authority.hardnessLaw.freeBase);
    if (p2[index]) value = Math.max(value, authority.hardnessLaw.p2Minimum + (authority.hardnessLaw.p2Maximum - authority.hardnessLaw.p2Minimum) * (1 - baseline.hotspotWeights[index]));
    if (p1[index]) value = authority.hardnessLaw.p1;
    if (p0[index]) value = authority.hardnessLaw.p0;
    hardness[index] = value;
    editableWeight[index] = 1 - value;
    if (baseline.hotspotWeights[index] > 0.25) {
      hotspotCells += 1;
      if (editableWeight[index] >= 0.20) hotspotEditableCells += 1;
    }
  }

  const summary = {
    cellCount: length,
    p0CellCount: count(p0),
    p1CellCount: count(p1),
    p2CellCount: count(p2),
    p0Fraction: count(p0) / length,
    p1Fraction: count(p1) / length,
    p2Fraction: count(p2) / length,
    editableCellCount: Array.from(editableWeight).filter((value) => value >= 0.20).length,
    editableCellFraction: Array.from(editableWeight).filter((value) => value >= 0.20).length / length,
    hotspotCellCount: hotspotCells,
    hotspotEditableCellCount: hotspotEditableCells,
    hotspotEditableCellFraction: hotspotEditableCells / Math.max(1, hotspotCells),
    hardness: summarizeWeights(hardness),
    editableWeight: summarizeWeights(editableWeight),
    anchorCount: anchorReceipts.length
  };
  const protectionDigest = hashBytes([p0, p1, p2, new Uint8Array(hardness.buffer), new Uint8Array(editableWeight.buffer)]);

  return {
    identity: 'H_EARTH_B2_P0_P1_P2_PROTECTION_MODEL_v1',
    baselineDigest: baseline.baselineDigest,
    protectionDigest,
    grid: baseline.grid,
    domain: baseline.domain,
    p0,
    p1,
    p2,
    hardness,
    editableWeight,
    anchorReceipts,
    summary
  };
}

export default buildHEarthB2ProtectionModel;
