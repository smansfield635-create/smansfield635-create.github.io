/**
 * Opt-in Geometry Kernel sweep construction candidate v1.
 * North supplies mathematics; East validates/triangulates the local profile;
 * South constructs and analyzes a neutral mesh. West alone admits that record.
 * No facade, scene, terrain, renderer, navigation or admission authority here.
 *
 * Open centerline, one strictly convex CCW XY profile, positive per-ring scales.
 * Rings use bisector tangents and minimal-rotation parallel transport, no roll.
 * Caps are explicit. Topology qualification does not certify nonintersection.
 */
import {
  isHEarthVector3, createHEarthVector3, createHEarthGeometryBounds,
  deriveHEarthGeometryToleranceContext, isHEarthGeometryToleranceContext,
  createHEarthGeometryIssue, addHEarthVector3, subtractHEarthVector3,
  scaleHEarthVector3, dotHEarthVector3, crossHEarthVector3,
  normalizeHEarthVector3, getHEarthVector3Length
} from './geometry-kernel.north.js';
import {
  H_EARTH_3D_GEOMETRY_EAST_ENUMS, triangulateHEarthConvexPolygon
} from './geometry-kernel.east.js';
import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS, constructHEarthTriangleMesh
} from './geometry-kernel.south.js';

export const GEOMETRY_KERNEL_SWEEP_V1 = Object.freeze({
  contractId: 'GEOMETRY_KERNEL_OPEN_PATH_CONVEX_PROFILE_SWEEP_v1',
  status: 'OPT_IN_CONSTRUCTION_CANDIDATE',
  maximumRings: 256,
  maximumProfileVertices: 64,
  maximumVertices: 16384,
  frameMethod: 'BISECTOR_TANGENT_MINIMAL_ROTATION_PARALLEL_TRANSPORT',
  maximumTurnDegrees: 90,
  rollSupported: false,
  selfIntersectionCertified: false,
  collisionCertified: false,
  admissionAuthority: 'EXISTING_WEST_ONLY'
});

function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) freeze(item);
    Object.freeze(value);
  }
  return value;
}
const finite = Number.isFinite;
const unit = value => normalizeHEarthVector3(value, 1e-12).vector;
function failure(code, message, details = null) {
  return freeze({
    valid: false, constructionType: 'SWEPT_PASSAGE_MESH',
    geometry: null, primitiveRecord: null, sweep: null,
    issues: [createHEarthGeometryIssue(code, 'ERROR', message, details)],
    admitted: false
  });
}

// Rodrigues' minimal rotation mapping from one unit tangent onto the next.
function transport(vector, from, to) {
  const axis = crossHEarthVector3(from, to);
  const cosine = Math.max(-1, Math.min(1, dotHEarthVector3(from, to)));
  if (cosine < -0.999999) return null;
  const first = crossHEarthVector3(axis, vector);
  const second = crossHEarthVector3(axis, first);
  return addHEarthVector3(addHEarthVector3(vector, first), scaleHEarthVector3(second, 1 / (1 + cosine)));
}

export function constructHEarthSweptPassageMesh(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return failure('SWEEP_INPUT_INVALID', 'A sweep requires an options record.');
  }
  const allowed = new Set(['primitiveId', 'centerline', 'profile', 'scales', 'initialUp', 'capStart', 'capEnd', 'toleranceContext']);
  if (Object.keys(input).some(key => !allowed.has(key))) {
    return failure('SWEEP_UNKNOWN_OPTION', 'Unsupported sweep option.');
  }
  const {primitiveId, centerline, profile, capStart, capEnd, toleranceContext} = input;
  const initialUp = input.initialUp === undefined ? createHEarthVector3(0, 1, 0) : input.initialUp;
  if (typeof primitiveId !== 'string' || !primitiveId.trim() ||
      !Array.isArray(centerline) || centerline.length < 2 ||
      centerline.length > GEOMETRY_KERNEL_SWEEP_V1.maximumRings ||
      !Array.isArray(profile) || profile.length < 3 ||
      profile.length > GEOMETRY_KERNEL_SWEEP_V1.maximumProfileVertices ||
      centerline.length * profile.length > GEOMETRY_KERNEL_SWEEP_V1.maximumVertices ||
      !Array.from(centerline).every(isHEarthVector3) ||
      !Array.from(profile).every(p => p && finite(p.x) && finite(p.y)) ||
      !isHEarthVector3(initialUp) || typeof capStart !== 'boolean' || typeof capEnd !== 'boolean') {
    return failure('SWEEP_INPUT_INVALID', 'Supply a finite bounded path/profile, explicit cap booleans, an ID and a finite initial up vector.');
  }
  const scales = input.scales === undefined
    ? centerline.map(() => ({x: 1, y: 1})) : input.scales;
  if (!Array.isArray(scales) || scales.length !== centerline.length ||
      !Array.from(scales).every(s => s && finite(s.x) && finite(s.y) && s.x > 0 && s.y > 0)) {
    return failure('SWEEP_SCALE_INVALID', 'Each station requires finite positive x/y scales.');
  }
  // The unscaled local profile has its own dimensional tolerance regime.
  const profile3 = profile.map(p => createHEarthVector3(p.x, p.y, 0));
  const profileContext = deriveHEarthGeometryToleranceContext(createHEarthGeometryBounds(profile3));
  if (!profileContext) return failure('SWEEP_PROFILE_INVALID', 'Profile bounds are invalid.');
  const plan = triangulateHEarthConvexPolygon(profile3,
    H_EARTH_3D_GEOMETRY_EAST_ENUMS.polygonProjectionPlane.XY, profileContext);
  if (!plan.valid || !(plan.signedArea > profileContext.areaTolerance)) {
    return failure('SWEEP_PROFILE_INVALID', 'Profile must be simple, convex and counterclockwise.');
  }
  for (let j = 0; j < profile.length; j++) {
    const a = profile[j], b = profile[(j + 1) % profile.length], c = profile[(j + 2) % profile.length];
    const turn = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (!finite(turn) || turn <= profileContext.areaTolerance) {
      return failure('SWEEP_PROFILE_INVALID', 'Profile corners must be strictly convex with no collapsed edges.');
    }
  }
  const radius = Math.max(...profile.map(p => Math.hypot(p.x, p.y))) *
    Math.max(...scales.flatMap(s => [s.x, s.y]));
  if (!finite(radius)) return failure('SWEEP_SCALE_INVALID', 'Scaled profile exceeds finite bounds.');
  const envelope = centerline.flatMap(p => [
    createHEarthVector3(p.x - radius, p.y - radius, p.z - radius),
    createHEarthVector3(p.x + radius, p.y + radius, p.z + radius)
  ]);
  // Copy only North's scalar context fields: freezing our result must never
  // freeze the caller's context or objects attached under unrelated keys.
  const context = toleranceContext === undefined
    ? deriveHEarthGeometryToleranceContext(createHEarthGeometryBounds(envelope))
    : isHEarthGeometryToleranceContext(toleranceContext)
      ? Object.fromEntries(Object.keys(deriveHEarthGeometryToleranceContext()).map(key => [key, toleranceContext[key]]))
      : null;
  if (!isHEarthGeometryToleranceContext(context)) {
    return failure('SWEEP_TOLERANCE_INVALID', 'A valid scale-aware tolerance context is required.');
  }
  if (getHEarthVector3Length(subtractHEarthVector3(centerline[0], centerline.at(-1))) <= context.positionTolerance) {
    return failure('SWEEP_CLOSED_PATH_UNSUPPORTED', 'v1 requires an open centerline.');
  }
  const segments = [];
  for (let i = 1; i < centerline.length; i++) {
    const delta = subtractHEarthVector3(centerline[i], centerline[i - 1]);
    const length = getHEarthVector3Length(delta);
    if (!finite(length) || length <= context.lengthTolerance) {
      return failure('SWEEP_SEGMENT_DEGENERATE', 'Adjacent stations must be distinct at the declared tolerance.', {station: i});
    }
    segments.push(scaleHEarthVector3(delta, 1 / length));
  }
  const tangents = [segments[0]];
  for (let i = 1; i < centerline.length - 1; i++) {
    if (dotHEarthVector3(segments[i - 1], segments[i]) < 0) {
      return failure('SWEEP_TURN_UNSUPPORTED', 'v1 rejects turns greater than 90 degrees.', {station: i});
    }
    tangents.push(unit(addHEarthVector3(segments[i - 1], segments[i])));
  }
  tangents.push(segments.at(-1));
  const up = unit(initialUp);
  if (!up) return failure('SWEEP_FRAME_AMBIGUOUS', 'Initial up must be nonzero.');
  let v = unit(subtractHEarthVector3(up, scaleHEarthVector3(tangents[0], dotHEarthVector3(up, tangents[0]))));
  if (!v) return failure('SWEEP_FRAME_AMBIGUOUS', 'Initial up must not be parallel to the first tangent.');
  let u = unit(crossHEarthVector3(v, tangents[0]));
  const frames = [];
  const vertices = [];
  for (let i = 0; i < centerline.length; i++) {
    if (i > 0) {
      const rotated = transport(u, tangents[i - 1], tangents[i]);
      if (!rotated) return failure('SWEEP_FRAME_AMBIGUOUS', 'Frame transport is ambiguous.', {station: i});
      u = unit(subtractHEarthVector3(rotated, scaleHEarthVector3(tangents[i], dotHEarthVector3(rotated, tangents[i]))));
      if (!u) return failure('SWEEP_FRAME_AMBIGUOUS', 'Frame collapsed.', {station: i});
      v = unit(crossHEarthVector3(tangents[i], u));
    }
    frames.push({tangent: tangents[i], u, v});
    for (const p of profile) {
      const vertex = addHEarthVector3(centerline[i], addHEarthVector3(
        scaleHEarthVector3(u, p.x * scales[i].x), scaleHEarthVector3(v, p.y * scales[i].y)));
      if (!isHEarthVector3(vertex)) return failure('SWEEP_VERTEX_NONFINITE', 'A swept vertex is nonfinite.');
      vertices.push(vertex);
    }
  }
  const indices = [], n = profile.length;
  for (let i = 0; i < centerline.length - 1; i++) {
    for (let j = 0; j < n; j++) {
      const a = i * n + j, b = i * n + (j + 1) % n, c = a + n, d = b + n;
      // Reject local fold/collapse before delegating full topology to South/East.
      const edge = subtractHEarthVector3(vertices[b], vertices[a]);
      const outward = crossHEarthVector3(edge, tangents[i]);
      for (const tri of [[a, b, c], [b, d, c]]) {
        const normal = crossHEarthVector3(subtractHEarthVector3(vertices[tri[1]], vertices[tri[0]]), subtractHEarthVector3(vertices[tri[2]], vertices[tri[0]]));
        const nl = getHEarthVector3Length(normal), ol = getHEarthVector3Length(outward);
        if (!finite(nl) || !finite(ol) || nl <= context.areaTolerance || ol <= context.lengthTolerance ||
            dotHEarthVector3(normal, outward) <= 1e-10 * nl * ol) {
          return failure('SWEEP_LOCAL_FOLD', 'A side face collapses or folds against its section orientation.', {segment: i, edge: j});
        }
        indices.push(...tri);
      }
    }
  }
  const last = (centerline.length - 1) * n;
  for (let i = 0; i < plan.triangleIndices.length; i += 3) {
    const [a, b, c] = plan.triangleIndices.slice(i, i + 3);
    if (capStart) indices.push(a, c, b);
    if (capEnd) indices.push(last + a, last + b, last + c);
  }
  const result = constructHEarthTriangleMesh({
    primitiveId, vertices, indices,
    expectedClosure: capStart && capEnd
      ? H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.CLOSED_REQUIRED
      : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    toleranceContext: context,
    source: {sourceType: 'GEOMETRY_KERNEL_SWEEP_V1'},
    metadata: {sweepContract: GEOMETRY_KERNEL_SWEEP_V1.contractId,
      selfIntersectionCertified: false, collisionCertified: false}
  });
  if (!result.valid) return result;
  return freeze({...result, sweep: {
    contractId: GEOMETRY_KERNEL_SWEEP_V1.contractId,
    ringCount: centerline.length, profileVertexCount: n, capStart, capEnd,
    frames, toleranceContext: context,
    selfIntersectionCertified: false, collisionCertified: false
  }});
}
