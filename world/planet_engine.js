// /world/planet_engine.js
// ENGINE_BASELINE_CONTRACT_G1
// FULL DENSE FIELD | DETERMINISTIC | NON-DRIFT | KERNEL-SUBORDINATE

import WORLD_KERNEL from "./world_kernel.js";

const GRID = 256;
const KERNEL_GRID = 16;

const deepFreeze = (v) => {
  if (v === null || typeof v !== "object" || Object.isFrozen(v)) return v;
  Object.getOwnPropertyNames(v).forEach((k) => deepFreeze(v[k]));
  return Object.freeze(v);
};

const assert = (cond, code) => {
  if (!cond) {
    const e = new Error(code);
    e.code = code;
    throw e;
  }
};

const clamp = (n, min, max) => {
  if (!Number.isFinite(n)) return min;
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

const clamp01 = (n) => (n <= 0 ? 0 : n >= 1 ? 1 : n);

const stableRound = (v, p = 12) => {
  const f = 10 ** p;
  return Math.round(v * f) / f;
};

const noise = (x, y, s = 0) => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + s * 37.719) * 43758.5453123;
  return (n - Math.floor(n)) * 2 - 1;
};

const octaveNoise = (x, y, octaves = 4, persistence = 0.5, seed = 0) => {
  let amp = 1;
  let freq = 1;
  let total = 0;
  let max = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += noise(x * freq, y * freq, seed + i * 17.3) * amp;
    max += amp;
    amp *= persistence;
    freq *= 2;
  }

  return max > 0 ? total / max : 0;
};

const normalizeObject = (v) =>
  v && typeof v === "object" && !Array.isArray(v) ? v : {};

const buildTimeState = (input = {}) => {
  const src = normalizeObject(input);
  const elapsedSeconds =
    typeof src.elapsedSeconds === "number" && Number.isFinite(src.elapsedSeconds)
      ? Math.max(0, src.elapsedSeconds)
      : 0;

  const dayPhase = ((elapsedSeconds * 0.02) % 1 + 1) % 1;
  const seasonPhase = ((elapsedSeconds * 0.0025) % 1 + 1) % 1;
  const stormPhase = ((elapsedSeconds * 0.01) % 1 + 1) % 1;

  return deepFreeze({
    elapsedSeconds: stableRound(elapsedSeconds),
    dayPhase: stableRound(dayPhase),
    seasonPhase: stableRound(seasonPhase),
    stormPhase: stableRound(stormPhase),
  });
};

const kernelIndexFromDense = (u01, v01) => {
  const i = clamp(Math.floor(u01 * KERNEL_GRID), 0, KERNEL_GRID - 1);
  const j = clamp(Math.floor(v01 * KERNEL_GRID), 0, KERNEL_GRID - 1);
  return { i, j };
};

const sampleKernelCell = (u01, v01) => {
  const { i, j } = kernelIndexFromDense(u01, v01);
  return WORLD_KERNEL.lattice[j * KERNEL_GRID + i];
};

const deriveElevation = (u01, v01, cell) => {
  const macro = 1 - cell.normalized.radius01;
  const terrainNoise = octaveNoise(u01 * 2.0, v01 * 2.0, 5, 0.5, 1);
  const ridgeNoise = octaveNoise(u01 * 5.5, v01 * 5.5, 3, 0.45, 7);
  const boundaryBias = cell.force.vector.B * 0.18
