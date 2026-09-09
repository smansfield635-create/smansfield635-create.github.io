export const FRONTIER_CYCLE_MS = 12000;

export const FRONTIER_PHASES = Object.freeze([
  Object.freeze({id:'QUIESCENT', start:0.00, end:0.18}),
  Object.freeze({id:'AWAKEN', start:0.18, end:0.38}),
  Object.freeze({id:'FLOW', start:0.38, end:0.58}),
  Object.freeze({id:'ENERGY', start:0.58, end:0.78}),
  Object.freeze({id:'TRANSFORMED', start:0.78, end:0.94}),
  Object.freeze({id:'RESET', start:0.94, end:1.00})
]);

const clamp01 = value => Math.max(0, Math.min(1, value));
const smooth = value => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};
const segment = (t, a, b) => smooth((t - a) / Math.max(1e-9, b - a));

export function getFrontierCycleState(timeMs, reducedMotion = false) {
  if (reducedMotion) {
    return Object.freeze({
      t:0.88,
      phase:'TRANSFORMED',
      awaken:1,
      flow:1,
      energy:1,
      transformed:1,
      reset:0,
      waterPulse:0.72,
      energyPulse:0.64,
      inspection:0.72,
      windowLevel:1
    });
  }

  const wrapped = ((Number(timeMs) || 0) % FRONTIER_CYCLE_MS + FRONTIER_CYCLE_MS) % FRONTIER_CYCLE_MS;
  const t = wrapped / FRONTIER_CYCLE_MS;
  const phase = FRONTIER_PHASES.find(item => t >= item.start && t < item.end)?.id || 'RESET';

  const awaken = t < 0.94 ? segment(t, 0.18, 0.38) : 1 - segment(t, 0.94, 1.00);
  const flow = t < 0.94 ? segment(t, 0.36, 0.56) : 1 - segment(t, 0.94, 1.00);
  const energy = t < 0.94 ? segment(t, 0.56, 0.76) : 1 - segment(t, 0.94, 1.00);
  const transformed = t < 0.94 ? segment(t, 0.72, 0.84) : 1 - segment(t, 0.94, 1.00);
  const reset = segment(t, 0.94, 1.00);

  return Object.freeze({
    t,
    phase,
    awaken,
    flow,
    energy,
    transformed,
    reset,
    waterPulse: clamp01((t - 0.38) / 0.20),
    energyPulse: clamp01((t - 0.58) / 0.20),
    inspection: transformed,
    windowLevel: clamp01(0.16 + awaken * 0.46 + energy * 0.38)
  });
}

export function deterministicUnit(seed, index) {
  let x = (seed ^ Math.imul(index + 1, 0x9e3779b1)) >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return (x >>> 0) / 0xffffffff;
}
