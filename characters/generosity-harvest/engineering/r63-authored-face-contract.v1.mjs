/**
 * Generosity Harvest R63: additive provenance gate for genuinely authored faces.
 * The archived first-party source-parent validator remains unchanged and remains
 * the only route for legacy proposals. This function is self-contained so the
 * exact-source integration can bind it into an owner-private HTML workpiece.
 * No model, imagery, baked animation poses or accepted source bytes are bundled.
 */
export const R63_ACCEPTED_SHA256 = 'afb4727e1027e88535e7f18dcd6caaf792b8779b113b7b5ffac663fe057d21fd';
export const R63_PRIVATE_SCULPT_LAB_SHA256 = '4463366ac86212edbfd450150240c93a251b75ca53d344d8b1d9fc175daf49be';
export const REGION_ID = 'R63_EXACT_408_FACES_54_BOUNDARY';
export const POLICY_A = Object.freeze({
  minAngleP5Degrees: 5.89735549,
  medianMinAngleDegrees: 23.75240338,
  adjacentMedianEdgeRatioP95Maximum: 2.52665403,
  percentile: 'SORTED_LINEAR_INTERPOLATION_P_TIMES_N_MINUS_ONE',
  diagnosticOnShapeFailure: true,
  unchangedOriginalParentAreaFloor: 0.5,
  unchangedOriginalParentEdgeRatioLower: 0.5,
  unchangedOriginalParentEdgeRatioUpper: 1.5
});

/**
 * Full assembled candidate, not a face-only sample. ctx is supplied by the
 * exact-SHA-gated first-party integration and contains original native
 * candidate/source geometry and the unchanged native mechanical checkers.
 *
 * Only a proposal explicitly declaring NEW_AUTHORED_FACE may enter this path.
 * Existing original-parent face proposals bypass this function entirely.
 */
export function validateTwoClassCandidate(candidate, base, repl, ctx) {
  'use strict';
  const fail = (code, witness = null) => {
    const error = new Error('GH_R63_TWO_CLASS_' + code + (witness === null ? '' : ':' + String(witness)));
    error.code = 'GH_R63_TWO_CLASS_' + code;
    error.witness = witness;
    throw error;
  };
  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const v3 = (arr, id) => [arr[3 * id], arr[3 * id + 1], arr[3 * id + 2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => Math.hypot(a[0], a[1], a[2]);
  const median = a => {
    const sorted = a.slice().sort((x, y) => x - y);
    return sorted[Math.floor(sorted.length / 2)];
  };
  const percentile = (a, p) => {
    if (!a.length) fail('EMPTY_GRADE_DISTRIBUTION');
    const sorted = a.slice().sort((x, y) => x - y);
    const i = p * (sorted.length - 1), lo = Math.floor(i), hi = Math.ceil(i);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
  };
  const edgeKey = (a, b) => a < b ? a + ':' + b : b + ':' + a;
  const triangle = (ids, positions) => {
    const points = ids.map(id => v3(positions, id));
    if (points.some(p => p.some(x => !finite(x)))) fail('NONFINITE_VERTEX', ids.join(','));
    const edges = [norm(sub(points[0], points[1])), norm(sub(points[1], points[2])), norm(sub(points[2], points[0]))];
    if (edges.some(e => !finite(e) || e <= 1e-10)) fail('COLLAPSED_AUTHORED_EDGE', ids.join(','));
    const n = cross(sub(points[1], points[0]), sub(points[2], points[0]));
    const area2 = norm(n);
    if (!finite(area2) || area2 <= 1e-10) fail('COLLAPSED_AUTHORED_FACE', ids.join(','));
    const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (norm(a) * norm(b))))) * 180 / Math.PI;
    const angles = [
      angle(sub(points[1], points[0]), sub(points[2], points[0])),
      angle(sub(points[0], points[1]), sub(points[2], points[1])),
      angle(sub(points[0], points[2]), sub(points[1], points[2]))
    ];
    if (angles.some(a => !finite(a))) fail('NONFINITE_ANGLE', ids.join(','));
    return { n, area2, edges, minAngle: Math.min(...angles), medianEdge: median(edges) };
  };

  if (!candidate || !base || !repl || !ctx) fail('MISSING_BOUND_INPUT');
  if (ctx.exactAcceptedSourceSHA256 !== 'afb4727e1027e88535e7f18dcd6caaf792b8779b113b7b5ffac663fe057d21fd' ||
      repl.parentSnapshotSHA256 !== ctx.exactAcceptedSourceSHA256) fail('EXACT_SOURCE_SHA_MISMATCH');
  if (ctx.expectedRegionId !== 'R63_EXACT_408_FACES_54_BOUNDARY') fail('REGION_ID_MISMATCH');
  if (!Array.isArray(repl.faces) || !Array.isArray(repl.faceLineage) || !Array.isArray(repl.provenance) ||
      repl.faces.length !== repl.faceLineage.length || repl.faces.length !== repl.provenance.length) fail('FACE_LINEAGE_ALIGNMENT');
  if (!Array.isArray(base.kept) || !(base.selected instanceof Set) || !Array.isArray(base.loops)) fail('REGION_NOT_BOUND');
  if (base.kept.length !== ctx.expectedKeptFaces || base.selected.size !== ctx.expectedSelectedFaces ||
      base.loops.length !== 1 || base.loops[0].length !== ctx.expectedBoundaryLength) fail('CUT_OR_KEPT_SCOPE_MISMATCH');
  if (JSON.stringify(repl.boundaryLogicalLoopsOrdered) !== JSON.stringify(base.loops)) fail('BOUNDARY_IDENTITY_MISMATCH');
  if (!candidate.indices || !candidate.positions || !candidate.UV || !candidate.logical || !candidate.sources ||
      !ctx.originalPositions || !ctx.originalIndices || !ctx.originalUV || !ctx.originalSources ||
      typeof ctx.patchAuditMesh !== 'function' || typeof ctx.inspectSurfaceIntersections !== 'function') fail('NATIVE_CHECKER_MISSING');
  if (candidate.indices.length / 3 !== base.kept.length + repl.faces.length) fail('CANDIDATE_FACE_COUNT_MISMATCH');

  const {positions, indices, UV, logical, sources, groups} = candidate;
  if (positions.length < ctx.originalPositions.length || UV.length < ctx.originalUV.length || sources.length < ctx.originalSources.length) fail('ORIGINAL_RENDER_VERTEX_LOST');
  for (let i = 0; i < ctx.originalPositions.length; i++) if (positions[i] !== ctx.originalPositions[i]) fail('OLD_RENDER_VERTEX_MUTATED', Math.floor(i / 3));
  for (let i = 0; i < ctx.originalUV.length; i++) if (UV[i] !== ctx.originalUV[i]) fail('OLD_UV_MUTATED', Math.floor(i / 2));
  for (let i = 0; i < ctx.originalSources.length; i++) if (sources[i] !== ctx.originalSources[i]) fail('OLD_SOURCE_MUTATED', i);
  for (let f = 0; f < base.kept.length; f++) for (let c = 0; c < 3; c++) {
    if (indices[3 * f + c] !== ctx.originalIndices[3 * base.kept[f] + c]) fail('KEPT_FACE_CHANGED', base.kept[f]);
  }
  const audit = ctx.patchAuditMesh(positions, indices, UV, logical, groups);
  if (!audit || !audit.valid) fail('NATIVE_TOPOLOGY_UV_AUDIT_FAILED', JSON.stringify(audit));
  if (positions.length % 3 || UV.length !== 2 * (positions.length / 3) || logical.length !== positions.length / 3) fail('CANDIDATE_ARRAY_LENGTH');
  for (const x of positions) if (!finite(x)) fail('NONFINITE_POSITION');
  for (const u of UV) if (!finite(u)) fail('NONFINITE_UV');

  const owners = new Map();
  const faceQuality = new Array(indices.length / 3);
  for (let f = 0; f < faceQuality.length; f++) {
    const ids = [indices[3 * f], indices[3 * f + 1], indices[3 * f + 2]];
    if (new Set(ids).size !== 3 || ids.some(id => !Number.isInteger(id) || id < 0 || id >= positions.length / 3)) fail('INVALID_TRIANGLE_INDICES', f);
    faceQuality[f] = triangle(ids, positions);
    for (let c = 0; c < 3; c++) {
      const a = logical[ids[c]], b = logical[ids[(c + 1) % 3]];
      if (a === b) fail('DEGENERATE_LOGICAL_EDGE', f);
      const key = edgeKey(a, b);
      if (!owners.has(key)) owners.set(key, []);
      owners.get(key).push({f,a,b});
    }
  }
  for (const [key, pair] of owners) if (pair.length !== 2 || pair[0].a !== pair[1].b || pair[0].b !== pair[1].a) fail('WELDED_EDGE_WINDING', key);
  let cutStitches = 0;
  for (const loop of base.loops) for (let i = 0; i < loop.length; i++) {
    const pair = owners.get(edgeKey(loop[i], loop[(i + 1) % loop.length]));
    if (!pair || pair.length !== 2 || !pair.some(o => o.f < base.kept.length) || !pair.some(o => o.f >= base.kept.length)) fail('CUT_STITCH_FAILED', i);
    cutStitches++;
  }
  let originalSourceStitches = 0;
  for (const pair of owners.values()) if (pair.some(o => o.f < ctx.originalSourceProtectionFaceCount) && pair.some(o => o.f >= ctx.originalSourceProtectionFaceCount)) originalSourceStitches++;
  if (originalSourceStitches !== ctx.expectedOriginalSourceStitches) fail('SOURCE_STITCH_COUNT', originalSourceStitches);
  // Ensure that the replacement region is a connected face-component, rather than detached islands.
  const selectedFaces = new Set(Array.from({length: repl.faces.length}, (_, i) => base.kept.length + i));
  const adj = new Map([...selectedFaces].map(f => [f, []]));
  for (const pair of owners.values()) if (pair.every(o => selectedFaces.has(o.f))) {
    adj.get(pair[0].f).push(pair[1].f); adj.get(pair[1].f).push(pair[0].f);
  }
  const seen = new Set([base.kept.length]), stack = [base.kept.length];
  while (stack.length) for (const next of adj.get(stack.pop())) if (!seen.has(next)) {seen.add(next); stack.push(next);}
  if (seen.size !== selectedFaces.size) fail('REPLACEMENT_DISCONNECTED', `${seen.size}/${selectedFaces.size}`);

  const uniqueAuthored = new Set(); const newFaceOrdinals = [];
  let retainedCount = 0, minOldArea = Infinity, minOldEdge = Infinity, maxOldEdge = 0;
  for (let i = 0; i < repl.faceLineage.length; i++) {
    const lineage = repl.faceLineage[i], parent = repl.provenance[i];
    if (!lineage || typeof lineage !== 'object') fail('LINEAGE_RECORD_MISSING', i);
    const newIds = [indices[3 * (base.kept.length + i)], indices[3 * (base.kept.length + i) + 1], indices[3 * (base.kept.length + i) + 2]];
    if (lineage.class === 'RETAINED_OR_SOURCE_DERIVED_FACE') {
      retainedCount++;
      if (!Number.isInteger(parent) || parent !== lineage.sourceParent || parent !== lineage.originalFace || !base.selected.has(parent)) fail('SOURCE_PARENT_UNTRUTHFUL', i);
      if (lineage.authoredFaceId != null || lineage.geometryParent === null) fail('SOURCE_PARENT_CLASS_CONTAMINATION', i);
      const original = [ctx.originalIndices[3 * parent], ctx.originalIndices[3 * parent + 1], ctx.originalIndices[3 * parent + 2]];
      const a = original.map(id => v3(ctx.originalPositions, id));
      const b = newIds.map(id => v3(positions, id));
      const n0 = cross(sub(a[1], a[0]), sub(a[2], a[0]));
      const n1 = cross(sub(b[1], b[0]), sub(b[2], b[0]));
      const d0 = norm(n0), d1 = norm(n1);
      if (d0 < 1e-10 || d1 < 1e-10 || dot(n0, n1) <= 0) fail('ORIGINAL_PARENT_AREA_WINDING', parent);
      const area = d1 / d0;
      if (area < 0.5) fail('ORIGINAL_PARENT_AREA_STRAIN', parent);
      minOldArea = Math.min(minOldArea, area);
      const oldEdges = [norm(sub(a[0], a[1])), norm(sub(a[1], a[2])), norm(sub(a[2], a[0]))];
      const newEdges = [norm(sub(b[0], b[1])), norm(sub(b[1], b[2])), norm(sub(b[2], b[0]))];
      for (let j = 0; j < 3; j++) {
        const ratio = newEdges[j] / oldEdges[j];
        if (ratio < 0.5 || ratio > 1.5) fail('ORIGINAL_PARENT_EDGE_STRAIN', `${parent}:${j}`);
        minOldEdge = Math.min(minOldEdge, ratio); maxOldEdge = Math.max(maxOldEdge, ratio);
      }
    } else if (lineage.class === 'NEW_AUTHORED_FACE') {
      newFaceOrdinals.push(i);
      if (parent !== null || (lineage.geometryParent != null) || (lineage.sourceParent != null) ||
          (lineage.geometryParentUnderOriginalOneToOneStrainLaw != null)) fail('FAKE_ONE_TO_ONE_PARENT', i);
      if (typeof lineage.authoredFaceId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.:-]{5,127}$/.test(lineage.authoredFaceId) || uniqueAuthored.has(lineage.authoredFaceId)) fail('AUTHORED_ID_INVALID_OR_DUPLICATE', i);
      uniqueAuthored.add(lineage.authoredFaceId);
      if (lineage.immutableParentSnapshot !== ctx.exactAcceptedSourceSHA256 || lineage.replacementRegion !== ctx.expectedRegionId ||
          typeof lineage.constructionReceipt !== 'string' || !lineage.constructionReceipt.trim()) fail('CONSTRUCTION_RECEIPT_OR_SNAPSHOT_INVALID', i);
      if (lineage.appearanceReference != null && (lineage.appearanceReference.geometryParentClaimed !== false || !Number.isInteger(lineage.appearanceReference.sourceR63Face))) fail('APPEARANCE_CORRESPONDENCE_UNTRUTHFUL', i);
      if (lineage.constructionSeedR63Face != null && (!Number.isInteger(lineage.constructionSeedR63Face) || !base.selected.has(lineage.constructionSeedR63Face))) fail('CONSTRUCTION_SEED_OUTSIDE_REGION', i);
    } else fail('UNKNOWN_FACE_CLASS', i);
  }
  if (!newFaceOrdinals.length) fail('NEW_FACE_EXPLICIT_DECLARATION_REQUIRED');
  const newCheckerIndices = new Set(newFaceOrdinals.map(i => base.kept.length + i));
  const angles = newFaceOrdinals.map(i => faceQuality[base.kept.length + i].minAngle);
  const edgeGrades = [];
  for (const pair of owners.values()) if (pair.some(o => newCheckerIndices.has(o.f))) {
    const a = faceQuality[pair[0].f].medianEdge, b = faceQuality[pair[1].f].medianEdge;
    edgeGrades.push(Math.max(a, b) / Math.min(a, b));
  }
  if (!edgeGrades.length) fail('NEW_FACE_ADJACENCY_MISSING');
  const measured = {
    newFaceCount: newFaceOrdinals.length, retainedFaceCount: retainedCount, adjacentPairCount: edgeGrades.length,
    minAngleP5Degrees: percentile(angles, 0.05), medianMinAngleDegrees: percentile(angles, 0.5),
    adjacentMedianEdgeRatioP95: percentile(edgeGrades, 0.95),
    absoluteMinimumNewFaceAngle: Math.min(...angles), absoluteMaximumAdjacentMedianEdgeRatio: Math.max(...edgeGrades),
    minOriginalAreaRatio: minOldArea, minOriginalEdgeRatio: minOldEdge, maxOriginalEdgeRatio: maxOldEdge
  };
  const policy = { minAngleP5Degrees: 5.89735549, medianMinAngleDegrees: 23.75240338, adjacentMedianEdgeRatioP95Maximum: 2.52665403 };
  const failures = [];
  if (measured.minAngleP5Degrees + 1e-9 < policy.minAngleP5Degrees) failures.push('NEW_FACE_P5_ANGLE');
  if (measured.medianMinAngleDegrees + 1e-9 < policy.medianMinAngleDegrees) failures.push('NEW_FACE_MEDIAN_ANGLE');
  if (measured.adjacentMedianEdgeRatioP95 > policy.adjacentMedianEdgeRatioP95Maximum + 1e-9) failures.push('NEW_FACE_ADJACENT_EDGE_GRADE');
  if (failures.length) {
    // The native editor may expose the rejected positions for diagnostic views.
    // A failed grade NEVER allows commit/acceptance via this validator.
    fail('POLICY_A_SHAPE_GRADE_REJECTED', JSON.stringify({failures, measured, policy}));
  }
  // The original unchanged strict first-party checker also executes downstream
  // in r63BuildExplicit, before any preview/KEEP/commit. Invoke here as well
  // so this two-class route cannot be independently reused without it.
  const collision = ctx.inspectSurfaceIntersections(positions, indices, logical, base.kept.length);
  if (!collision || typeof collision !== 'object' || collision.intersections !== 0) fail('NATIVE_COLLISION_CHECK_NOT_CONFIRMED');
  return {
    schema: 'GENEROSITY_HARVEST_R63_TWO_CLASS_ACCEPTANCE_RECEIPT_v1',
    result: 'ACCEPTED_MECHANICALLY_ONLY_NOT_ARTISTIC',
    audit, cutStitches, originalSourceStitches,
    minArea: minOldArea, minEdge: minOldEdge, maxEdge: maxOldEdge,
    originalSourceQualityUnchanged: true, acceptedR63SHA256: ctx.exactAcceptedSourceSHA256,
    authoredFaceIds: [...uniqueAuthored], shapeGrade: measured, policyA: policy,
    collisionCheckInvoked: true, R64Saved: false
  };
}
