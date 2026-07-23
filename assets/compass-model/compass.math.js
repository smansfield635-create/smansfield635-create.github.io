import { assertContract } from "./compass.contracts.js";

export const EPSILON = 1e-8;
export const IDENTITY_QUATERNION = Object.freeze([0, 0, 0, 1]);
export const WORLD_UP = Object.freeze([0, 1, 0]);

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const finite = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const subtract3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale3 = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
export const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const length3 = v => Math.hypot(v[0], v[1], v[2]);
export function normalize3(v, fallback = [0, 0, 1]) { const length = length3(v); return length > EPSILON && Number.isFinite(length) ? scale3(v, 1 / length) : [...fallback]; }

export function normalizeQuaternion(value, fallback = IDENTITY_QUATERNION) {
  const q = Array.from(value || []).map(Number);
  if (q.length !== 4 || q.some(v => !Number.isFinite(v))) return [...fallback];
  const length = Math.hypot(...q);
  return length > EPSILON ? q.map(v => v / length) : [...fallback];
}

export function multiplyQuaternion(a, b) {
  const [ax, ay, az, aw] = normalizeQuaternion(a);
  const [bx, by, bz, bw] = normalizeQuaternion(b);
  return normalizeQuaternion([
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz
  ]);
}

export function quaternionFromAxisAngle(axis, angle) {
  const unit = normalize3(axis, [1, 0, 0]);
  const bounded = finite(angle, 0);
  const half = bounded * 0.5;
  const sine = Math.sin(half);
  return normalizeQuaternion([unit[0] * sine, unit[1] * sine, unit[2] * sine, Math.cos(half)]);
}

export function rotateVectorByQuaternion(vector, quaternion) {
  const [x, y, z, w] = normalizeQuaternion(quaternion);
  const [vx, vy, vz] = vector;
  const tx = 2 * (y * vz - z * vy), ty = 2 * (z * vx - x * vz), tz = 2 * (x * vy - y * vx);
  return [vx + w * tx + (y * tz - z * ty), vy + w * ty + (z * tx - x * tz), vz + w * tz + (x * ty - y * tx)];
}

export function slerpQuaternion(a, b, t) {
  let qa = normalizeQuaternion(a), qb = normalizeQuaternion(b);
  let cosine = qa.reduce((sum, value, index) => sum + value * qb[index], 0);
  if (cosine < 0) { qb = qb.map(v => -v); cosine = -cosine; }
  if (cosine > 0.9995) return normalizeQuaternion(qa.map((v, i) => v + (qb[i] - v) * clamp(t, 0, 1)));
  const theta = Math.acos(clamp(cosine, -1, 1));
  const sine = Math.sin(theta);
  const aWeight = Math.sin((1 - clamp(t, 0, 1)) * theta) / sine;
  const bWeight = Math.sin(clamp(t, 0, 1) * theta) / sine;
  return normalizeQuaternion(qa.map((v, i) => v * aWeight + qb[i] * bWeight));
}

export function cameraBasis(camera) {
  assertContract(camera && camera.eye && camera.target, "COMPASS_CAMERA_FACTS_REQUIRED");
  const forward = normalize3(subtract3(camera.target, camera.eye), [0, 0, -1]);
  const right = normalize3(cross3(forward, WORLD_UP), [1, 0, 0]);
  const up = normalize3(cross3(right, forward), WORLD_UP);
  return Object.freeze({ right, up, forward });
}

export function fixedBasisIncrement({ dx, dy, rightAxis = [1, 0, 0], yawAxis = WORLD_UP, radiansPerPixel, maximumAngle }) {
  const yaw = quaternionFromAxisAngle(yawAxis, clamp(finite(dx) * finite(radiansPerPixel), -maximumAngle, maximumAngle));
  const pitch = quaternionFromAxisAngle(rightAxis, clamp(finite(dy) * finite(radiansPerPixel), -maximumAngle, maximumAngle));
  return multiplyQuaternion(pitch, yaw);
}

export function settleQuaternion(current, targetVector, anchorVector) {
  const from = normalize3(rotateVectorByQuaternion(targetVector, current));
  const to = normalize3(anchorVector);
  const axis = cross3(from, to);
  const cosine = clamp(dot3(from, to), -1, 1);
  if (length3(axis) <= EPSILON) return cosine >= 0 ? normalizeQuaternion(current) : multiplyQuaternion(quaternionFromAxisAngle([0, 1, 0], Math.PI), current);
  return multiplyQuaternion(quaternionFromAxisAngle(axis, Math.acos(cosine)), current);
}
