/**
 * First bounded consumer of the opt-in Geometry Kernel sweep.
 * Certifies only a two-station, constant-profile convex finite passage.
 * Existing West admits a closed outward mathematical shell; disposable GPU
 * buffers reverse winding/normals for interior rendering. Queries use private
 * immutable planes, never caller-writable render buffers or claimed receipts.
 * No world placement, character collision, navigation or release authority.
 */
import {constructHEarthSweptPassageMesh} from './geometry-kernel.sweep.v1.js';
import {admitHEarthPrimitiveRecord, isHEarthAdmittedPrimitiveRecord} from './geometry-kernel.west.js';
import {
  isHEarthVector3, subtractHEarthVector3, crossHEarthVector3,
  dotHEarthVector3, normalizeHEarthVector3
} from './geometry-kernel.north.js';

export const GEOMETRY_KERNEL_PASSAGE_CONSUMER_V1 = Object.freeze({
  contractId: 'GEOMETRY_KERNEL_CONVEX_PASSAGE_CONSUMER_v1',
  geometryClass: 'TWO_STATION_CONSTANT_SECTION_CONVEX_PRISM',
  movementClass: 'POSITIVE_RADIUS_SPHERE_LINEAR_TRANSLATION_INSIDE_FINITE_ENDS',
  bentPassagesSupported: false,
  characterCapsuleSupported: false,
  ownsNavigation: false,
  productIntegrated: false
});
const privateCertificates = new WeakMap();
const finite = Number.isFinite;
const absMax = points => Math.max(1, ...points.flatMap(p => [Math.abs(p.x), Math.abs(p.y), Math.abs(p.z)]));
const hold = (disposition, reason, details = null) => Object.freeze({
  valid: false, disposition, reason, details, clearanceCertified: false,
  ownsNavigation: false, productIntegrated: false
});

export function buildHEarthPassageConsumer(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return hold('HOLD_INVALID_INPUT', 'OPTIONS_RECORD_REQUIRED');
  }
  const keys = new Set(['primitiveId', 'centerline', 'profile', 'scales', 'initialUp', 'toleranceContext']);
  if (Object.keys(input).some(key => !keys.has(key))) {
    return hold('HOLD_UNSUPPORTED_GEOMETRY', 'UNSUPPORTED_CONSUMER_OPTION');
  }
  if (!Array.isArray(input.centerline) || input.centerline.length < 2 ||
      !Array.from(input.centerline).every(isHEarthVector3)) {
    return hold('HOLD_INVALID_INPUT', 'FINITE_CENTERLINE_REQUIRED');
  }
  if (input.centerline.length !== 2) {
    return hold('HOLD_UNSUPPORTED_GEOMETRY', 'TWO_STATION_STRAIGHT_PRISM_ONLY');
  }
  if (input.scales !== undefined) {
    if (!Array.isArray(input.scales) || input.scales.length !== 2 ||
        !Array.from(input.scales).every(s => s && finite(s.x) && finite(s.y) && s.x > 0 && s.y > 0)) {
      return hold('HOLD_INVALID_INPUT', 'POSITIVE_TWO_STATION_SCALES_REQUIRED');
    }
    if (input.scales[0].x !== input.scales[1].x || input.scales[0].y !== input.scales[1].y) {
      return hold('HOLD_UNSUPPORTED_GEOMETRY', 'CONSTANT_SECTION_ONLY');
    }
  }
  const construction = constructHEarthSweptPassageMesh({...input, capStart: true, capEnd: true});
  if (!construction.valid) return hold('HOLD_INVALID_GEOMETRY', 'KERNEL_CONSTRUCTION_REJECTED', construction.issues);
  const admission = admitHEarthPrimitiveRecord(construction.primitiveRecord);
  if (!admission.valid || !isHEarthAdmittedPrimitiveRecord(admission.primitive)) {
    return hold('HOLD_ADMISSION', 'EXISTING_WEST_ADMISSION_REQUIRED', admission.issues);
  }
  const geometry = admission.geometry;
  const analysis = geometry.metadata.topologyAnalysis;
  if (!analysis?.outwardClosed || analysis.topology?.boundaryEdges?.length !== 0) {
    return hold('HOLD_INVALID_GEOMETRY', 'CLOSED_OUTWARD_SHELL_REQUIRED');
  }
  const origin = Object.freeze({...input.centerline[0]});
  const vertices = geometry.vertices.map(p => subtractHEarthVector3(p, origin));
  if (!vertices.every(isHEarthVector3)) return hold('HOLD_NUMERICAL_AMBIGUITY', 'LOCAL_COORDINATE_OVERFLOW');
  const localScale = absMax(vertices);
  const margin = Math.max(1e-9,
    construction.sweep.toleranceContext.positionTolerance * 16,
    absMax(geometry.vertices) * Number.EPSILON * 256,
    localScale * Number.EPSILON * 256);
  if (!finite(margin)) return hold('HOLD_NUMERICAL_AMBIGUITY', 'MARGIN_OVERFLOW');
  const witness = Object.freeze({
    x: vertices.reduce((s,p) => s + p.x / vertices.length, 0),
    y: vertices.reduce((s,p) => s + p.y / vertices.length, 0),
    z: vertices.reduce((s,p) => s + p.z / vertices.length, 0)
  });
  const planes = [];
  let volume = 0;
  for (let i = 0; i < geometry.indices.length; i += 3) {
    const [a,b,c] = geometry.indices.slice(i,i+3).map(j => vertices[j]);
    const outward = crossHEarthVector3(subtractHEarthVector3(b,a), subtractHEarthVector3(c,a));
    const normalized = normalizeHEarthVector3(outward, construction.sweep.toleranceContext.areaTolerance);
    if (!normalized.valid) return hold('HOLD_NUMERICAL_AMBIGUITY', 'FACE_NORMAL_DEGENERATE');
    const n = Object.freeze({x:-normalized.vector.x, y:-normalized.vector.y, z:-normalized.vector.z});
    const anchor = Object.freeze({...a});
    // West establishes lawful topology. This separate pass establishes the
    // convex halfspace contract from the actual admitted immutable vertices.
    for (const p of vertices) {
      const distance = dotHEarthVector3(n, subtractHEarthVector3(p,anchor));
      if (!finite(distance) || distance < -margin) {
        return hold('HOLD_NUMERICAL_AMBIGUITY', 'CONVEX_SUPPORT_PLANE_FAILED');
      }
    }
    const interiorDistance = dotHEarthVector3(n, subtractHEarthVector3(witness,anchor));
    if (!finite(interiorDistance) || interiorDistance <= margin * 4) {
      return hold('HOLD_NUMERICAL_AMBIGUITY', 'INTERIOR_MARGIN_UNRESOLVED');
    }
    volume += dotHEarthVector3(a, crossHEarthVector3(b,c)) / 6;
    planes.push(Object.freeze({anchor, normal:n, triangle:i/3}));
  }
  if (!finite(volume) || volume <= construction.sweep.toleranceContext.volumeTolerance) {
    return hold('HOLD_NUMERICAL_AMBIGUITY', 'POSITIVE_LOCAL_VOLUME_REQUIRED');
  }
  const positions = new Float32Array(vertices.flatMap(p => [p.x,p.y,p.z]));
  const normals = new Float32Array(geometry.normals.flatMap(p => [-p.x,-p.y,-p.z]));
  if (![...positions,...normals].every(finite)) return hold('HOLD_RENDER_BUFFER', 'FLOAT32_OVERFLOW');
  const indices = new Uint16Array(geometry.indices.length);
  for (let i = 0; i < indices.length; i += 3) {
    indices[i]=geometry.indices[i];indices[i+1]=geometry.indices[i+2];indices[i+2]=geometry.indices[i+1];
  }
  const result = Object.freeze({
    valid:true, disposition:'CONSUMER_READY',
    contractId:GEOMETRY_KERNEL_PASSAGE_CONSUMER_V1.contractId,
    admission, geometry, primitive:admission.primitive,
    renderBuffers:Object.freeze({positions,normals,indices,origin,coordinateMode:'ORIGIN_RELATIVE_FLOAT32',winding:'INTERIOR_FACING'}),
    certificate:Object.freeze({geometryClass:GEOMETRY_KERNEL_PASSAGE_CONSUMER_V1.geometryClass,
      finiteEndPlanes:true, sphereLinearMotionOnly:true, margin, localVolume:volume,
      planeCount:planes.length, arbitraryMeshIntersectionCertified:false}),
    ownsNavigation:false, productIntegrated:false
  });
  privateCertificates.set(result,Object.freeze({origin,planes:Object.freeze(planes),margin}));
  return result;
}

export function evaluateHEarthPassageSphereMove(consumer, request) {
  const certificate = privateCertificates.get(consumer);
  if (!certificate) return hold('HOLD_UNTRUSTED_CONSUMER', 'ACTUAL_CONSTRUCTED_CONSUMER_REQUIRED');
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    return hold('HOLD_INVALID_QUERY', 'QUERY_RECORD_REQUIRED');
  }
  if (Object.keys(request).some(k => !['from','to','radius'].includes(k))) {
    return hold('HOLD_UNSUPPORTED_QUERY', 'ONLY_SPHERE_LINEAR_TRANSLATION_SUPPORTED');
  }
  const {from,to,radius}=request;
  if (!isHEarthVector3(from) || !isHEarthVector3(to) || !finite(radius) || radius <= 0) {
    return hold('HOLD_INVALID_QUERY', 'FINITE_ENDPOINTS_AND_POSITIVE_RADIUS_REQUIRED');
  }
  const points=[from,to].map(p => subtractHEarthVector3(p,certificate.origin));
  if (!points.every(isHEarthVector3)) return hold('HOLD_NUMERICAL_AMBIGUITY', 'QUERY_COORDINATE_OVERFLOW');
  const margin=Math.max(certificate.margin,absMax([from,to])*Number.EPSILON*256);
  let minimumClearance=Infinity,limitingTriangle=null;
  for (const plane of certificate.planes) {
    for (const p of points) {
      const clearance=dotHEarthVector3(plane.normal,subtractHEarthVector3(p,plane.anchor))-radius;
      if (!finite(clearance)) return hold('HOLD_NUMERICAL_AMBIGUITY', 'QUERY_PLANE_OVERFLOW');
      if (clearance<minimumClearance) {minimumClearance=clearance;limitingTriangle=plane.triangle;}
    }
  }
  const certified=minimumClearance>margin;
  return Object.freeze({
    valid:true, disposition:certified?'CLEARANCE_CERTIFIED':'HOLD_OBSTRUCTED_OR_AMBIGUOUS',
    clearanceCertified:certified, minimumClearance, requiredMargin:margin, limitingTriangle,
    proof:'BOTH_ENDPOINTS_IN_ALL_ERODED_CONVEX_HALFSPACES_IMPLY_ENTIRE_LINEAR_SPHERE_MOVE',
    sphereRadius:radius, ownsNavigation:false, productIntegrated:false
  });
}
