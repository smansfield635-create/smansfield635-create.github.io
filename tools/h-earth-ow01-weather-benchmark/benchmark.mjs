const CONFIGS = [
  { id: "C16L3", n: 16, layers: 3 },
  { id: "C24L3", n: 24, layers: 3 },
  { id: "C16L5", n: 16, layers: 5 },
  { id: "C24L5", n: 24, layers: 5 },
  { id: "C32L3", n: 32, layers: 3 },
  { id: "C32L5", n: 32, layers: 5 }
];

const runButton = document.getElementById("run");
const copyButton = document.getElementById("copy");
const statusNode = document.getElementById("status");
const outputNode = document.getElementById("output");

let latestReceipt = null;
let running = false;
const gridCache = new Map();

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const hypot3 = (x, y, z) => Math.hypot(x, y, z) || 1;

function faceRaw(face, u, v) {
  switch (face) {
    case 0: return [1, v, -u];
    case 1: return [-1, v, u];
    case 2: return [u, 1, -v];
    case 3: return [u, -1, v];
    case 4: return [u, v, 1];
    default: return [-u, v, -1];
  }
}

function faceDerivatives(face) {
  switch (face) {
    case 0: return [[0, 0, -1], [0, 1, 0]];
    case 1: return [[0, 0, 1], [0, 1, 0]];
    case 2: return [[1, 0, 0], [0, 0, -1]];
    case 3: return [[1, 0, 0], [0, 0, 1]];
    case 4: return [[1, 0, 0], [0, 1, 0]];
    default: return [[-1, 0, 0], [0, 1, 0]];
  }
}

function faceUVToDir(face, u, v) {
  const r = faceRaw(face, u, v);
  const m = hypot3(r[0], r[1], r[2]);
  return [r[0] / m, r[1] / m, r[2] / m];
}

function dirToFaceUV(x, y, z) {
  const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z);
  if (ax >= ay && ax >= az) {
    if (x >= 0) return [0, -z / x, y / x];
    const s = -x;
    return [1, z / s, y / s];
  }
  if (ay >= ax && ay >= az) {
    if (y >= 0) return [2, x / y, -z / y];
    const s = -y;
    return [3, x / s, z / s];
  }
  if (z >= 0) return [4, x / z, y / z];
  return [5, x / z, y / (-z)];
}

function projectAndNormalize(dx, dy, dz, nx, ny, nz) {
  const dot = dx * nx + dy * ny + dz * nz;
  let x = dx - dot * nx;
  let y = dy - dot * ny;
  let z = dz - dot * nz;
  const m = hypot3(x, y, z);
  x /= m; y /= m; z /= m;
  return [x, y, z];
}

function cellIndex(face, i, j, n) {
  return face * n * n + j * n + i;
}

function directionToCell(x, y, z, n) {
  const [face, u0, v0] = dirToFaceUV(x, y, z);
  const u = clamp(u0, -0.999999, 0.999999);
  const v = clamp(v0, -0.999999, 0.999999);
  const i = clamp(Math.floor((u + 1) * 0.5 * n), 0, n - 1);
  const j = clamp(Math.floor((v + 1) * 0.5 * n), 0, n - 1);
  return cellIndex(face, i, j, n);
}

function buildGrid(n) {
  if (gridCache.has(n)) return gridCache.get(n);
  const t0 = performance.now();
  const cells = 6 * n * n;
  const du = 2 / n;
  const nx = new Float32Array(cells), ny = new Float32Array(cells), nz = new Float32Array(cells);
  const eux = new Float32Array(cells), euy = new Float32Array(cells), euz = new Float32Array(cells);
  const evx = new Float32Array(cells), evy = new Float32Array(cells), evz = new Float32Array(cells);
  const terrain = new Float32Array(cells), gradTU = new Float32Array(cells), gradTV = new Float32Array(cells);
  const neighbors = new Int32Array(cells * 4);

  for (let face = 0; face < 6; face++) {
    const [dU, dV] = faceDerivatives(face);
    for (let j = 0; j < n; j++) {
      const v = -1 + (j + 0.5) * du;
      for (let i = 0; i < n; i++) {
        const u = -1 + (i + 0.5) * du;
        const idx = cellIndex(face, i, j, n);
        const d = faceUVToDir(face, u, v);
        nx[idx] = d[0]; ny[idx] = d[1]; nz[idx] = d[2];
        const bu = projectAndNormalize(dU[0], dU[1], dU[2], d[0], d[1], d[2]);
        const bv = projectAndNormalize(dV[0], dV[1], dV[2], d[0], d[1], d[2]);
        eux[idx] = bu[0]; euy[idx] = bu[1]; euz[idx] = bu[2];
        evx[idx] = bv[0]; evy[idx] = bv[1]; evz[idx] = bv[2];
        terrain[idx] = 0.025 * (
          Math.sin(3.1 * d[0] + 1.7 * d[2]) * Math.cos(2.4 * d[1] - 0.6 * d[0]) +
          0.35 * Math.sin(8.2 * d[0] * d[2] + 2.1 * d[1])
        );

        const dirs = [
          faceUVToDir(face, u + du, v),
          faceUVToDir(face, u - du, v),
          faceUVToDir(face, u, v + du),
          faceUVToDir(face, u, v - du)
        ];
        const no = idx * 4;
        neighbors[no] = directionToCell(dirs[0][0], dirs[0][1], dirs[0][2], n);
        neighbors[no + 1] = directionToCell(dirs[1][0], dirs[1][1], dirs[1][2], n);
        neighbors[no + 2] = directionToCell(dirs[2][0], dirs[2][1], dirs[2][2], n);
        neighbors[no + 3] = directionToCell(dirs[3][0], dirs[3][1], dirs[3][2], n);
      }
    }
  }

  for (let i = 0; i < cells; i++) {
    const no = i * 4;
    gradTU[i] = 0.5 * (terrain[neighbors[no]] - terrain[neighbors[no + 1]]);
    gradTV[i] = 0.5 * (terrain[neighbors[no + 2]] - terrain[neighbors[no + 3]]);
  }

  const grid = { n, cells, du, nx, ny, nz, eux, euy, euz, evx, evy, evz, terrain, gradTU, gradTV, neighbors, buildMs: performance.now() - t0 };
  gridCache.set(n, grid);
  return grid;
}

function allocState(total) {
  return {
    h: new Float32Array(total),
    vx: new Float32Array(total),
    vy: new Float32Array(total),
    vz: new Float32Array(total),
    theta: new Float32Array(total),
    qv: new Float32Array(total),
    ql: new Float32Array(total),
    qi: new Float32Array(total)
  };
}

function initializeState(grid, layers, rest = false) {
  const total = grid.cells * layers;
  const s = allocState(total);
  for (let k = 0; k < layers; k++) {
    const kf = layers === 1 ? 0 : k / (layers - 1);
    const layerOffset = k * grid.cells;
    for (let i = 0; i < grid.cells; i++) {
      const o = layerOffset + i;
      if (rest) {
        s.h[o] = 1;
        s.theta[o] = 0.62;
        s.qv[o] = 0.24;
        continue;
      }
      const x = grid.nx[i], y = grid.ny[i], z = grid.nz[i];
      s.h[o] = 1 + 0.012 * Math.sin(2.7 * x + 1.3 * z + 0.8 * k) + 0.004 * y * z;
      s.theta[o] = 0.59 - 0.075 * kf + 0.025 * y + 0.012 * grid.terrain[i];
      s.qv[o] = clamp(0.45 - 0.16 * kf + 0.07 * (1 - Math.abs(y)) + 0.025 * Math.sin(4.1 * x - 2.3 * z), 0.08, 0.62);
      const ex = z, ez = -x;
      const em = Math.hypot(ex, ez);
      const speed = 0.028 * (1 - 0.18 * kf);
      if (em > 1e-6) {
        s.vx[o] = speed * ex / em;
        s.vz[o] = speed * ez / em;
      } else {
        s.vx[o] = speed * grid.eux[i];
        s.vy[o] = speed * grid.euy[i];
        s.vz[o] = speed * grid.euz[i];
      }
    }
  }
  return s;
}

function scalarAdvection(value, east, west, north, south, u, v) {
  return 0.5 * (u * (east - west) + v * (north - south));
}

function weatherStep(grid, layers, src, dst, options = {}) {
  const moist = options.moist !== false;
  const forcing = options.forcing !== false;
  const dt = options.dt ?? 0.08;
  const c = grid.cells;

  for (let k = 0; k < layers; k++) {
    const base = k * c;
    for (let i = 0; i < c; i++) {
      const o = base + i;
      const no = i * 4;
      const e = base + grid.neighbors[no];
      const w = base + grid.neighbors[no + 1];
      const n = base + grid.neighbors[no + 2];
      const s = base + grid.neighbors[no + 3];

      const bux = grid.eux[i], buy = grid.euy[i], buz = grid.euz[i];
      const bvx = grid.evx[i], bvy = grid.evy[i], bvz = grid.evz[i];
      const u = src.vx[o] * bux + src.vy[o] * buy + src.vz[o] * buz;
      const v = src.vx[o] * bvx + src.vy[o] * bvy + src.vz[o] * bvz;

      const uE = src.vx[e] * bux + src.vy[e] * buy + src.vz[e] * buz;
      const uW = src.vx[w] * bux + src.vy[w] * buy + src.vz[w] * buz;
      const uN = src.vx[n] * bux + src.vy[n] * buy + src.vz[n] * buz;
      const uS = src.vx[s] * bux + src.vy[s] * buy + src.vz[s] * buz;
      const vE = src.vx[e] * bvx + src.vy[e] * bvy + src.vz[e] * bvz;
      const vW = src.vx[w] * bvx + src.vy[w] * bvy + src.vz[w] * bvz;
      const vN = src.vx[n] * bvx + src.vy[n] * bvy + src.vz[n] * bvz;
      const vS = src.vx[s] * bvx + src.vy[s] * bvy + src.vz[s] * bvz;

      const div = 0.5 * ((uE - uW) + (vN - vS));
      const gradHU = 0.5 * (src.h[e] - src.h[w]);
      const gradHV = 0.5 * (src.h[n] - src.h[s]);
      const lapH = src.h[e] + src.h[w] + src.h[n] + src.h[s] - 4 * src.h[o];
      const lapU = uE + uW + uN + uS - 4 * u;
      const lapV = vE + vW + vN + vS - 4 * v;
      const f = 0.075 * grid.ny[i];

      let u2 = u + dt * (-0.22 * gradHU + f * v - 0.008 * u + 0.004 * lapU);
      let v2 = v + dt * (-0.22 * gradHV - f * u - 0.008 * v + 0.004 * lapV);
      const h2 = clamp(src.h[o] + dt * (-0.075 * div + 0.004 * lapH), 0.72, 1.28);

      const tAdv = scalarAdvection(src.theta[o], src.theta[e], src.theta[w], src.theta[n], src.theta[s], u, v);
      let theta2 = src.theta[o] - dt * 0.025 * tAdv;
      if (forcing) {
        const solar = Math.max(0, 0.58 * grid.nx[i] + 0.36 * grid.ny[i] + 0.73 * grid.nz[i]);
        theta2 += dt * (0.00045 * solar - 0.00018 * (theta2 - 0.55));
      }

      const qvAdv = scalarAdvection(src.qv[o], src.qv[e], src.qv[w], src.qv[n], src.qv[s], u, v);
      let qv2 = src.qv[o] - dt * 0.022 * qvAdv;
      let ql2 = src.ql[o];
      let qi2 = src.qi[o];

      if (moist) {
        const qlAdv = scalarAdvection(src.ql[o], src.ql[e], src.ql[w], src.ql[n], src.ql[s], u, v);
        const qiAdv = scalarAdvection(src.qi[o], src.qi[e], src.qi[w], src.qi[n], src.qi[s], u, v);
        ql2 = Math.max(0, ql2 - dt * 0.018 * qlAdv);
        qi2 = Math.max(0, qi2 - dt * 0.018 * qiAdv);

        if (forcing && k === 0) {
          const oceanMoisture = 0.00055 * (1 - Math.abs(grid.ny[i])) * (1 + 0.5 * Math.max(0, -grid.terrain[i]));
          qv2 += dt * oceanMoisture;
        }

        const terrainLift = Math.max(0, u * grid.gradTU[i] + v * grid.gradTV[i]);
        const convectiveLift = Math.max(0, (theta2 - 0.555) * (qv2 - 0.38)) * 0.18;
        const qsat = clamp(0.43 + 0.34 * (theta2 - 0.50) - 0.035 * (h2 - 1) - 0.30 * terrainLift - convectiveLift, 0.18, 0.72);
        const condensation = Math.max(0, qv2 - qsat) * 0.42;
        qv2 -= condensation;
        theta2 += condensation * 0.055;

        const iceFraction = clamp((0.515 - theta2) / 0.115, 0, 1);
        ql2 += condensation * (1 - iceFraction);
        qi2 += condensation * iceFraction;

        const totalCondensate = ql2 + qi2;
        if (totalCondensate > 0.075) {
          const fallout = (totalCondensate - 0.075) * 0.11;
          const liquidShare = totalCondensate > 0 ? ql2 / totalCondensate : 0;
          ql2 = Math.max(0, ql2 - fallout * liquidShare);
          qi2 = Math.max(0, qi2 - fallout * (1 - liquidShare));
        }

        const deficit = Math.max(0, qsat - qv2);
        const available = ql2 + qi2;
        if (deficit > 0 && available > 0) {
          const evaporation = Math.min(available, deficit * 0.055);
          const liquidShare = available > 0 ? ql2 / available : 0;
          ql2 = Math.max(0, ql2 - evaporation * liquidShare);
          qi2 = Math.max(0, qi2 - evaporation * (1 - liquidShare));
          qv2 += evaporation;
          theta2 -= evaporation * 0.03;
        }
      }

      qv2 = clamp(qv2, 0, 0.9);
      ql2 = clamp(ql2, 0, 0.5);
      qi2 = clamp(qi2, 0, 0.5);
      theta2 = clamp(theta2, 0.30, 0.82);
      u2 = clamp(u2, -0.22, 0.22);
      v2 = clamp(v2, -0.22, 0.22);

      dst.h[o] = h2;
      dst.theta[o] = theta2;
      dst.qv[o] = qv2;
      dst.ql[o] = ql2;
      dst.qi[o] = qi2;
      dst.vx[o] = u2 * bux + v2 * bvx;
      dst.vy[o] = u2 * buy + v2 * bvy;
      dst.vz[o] = u2 * buz + v2 * bvz;
    }
  }
}

function swapPair(pair) {
  const t = pair.src;
  pair.src = pair.dst;
  pair.dst = t;
}

function percentile(values, p) {
  if (!values.length) return null;
  const a = [...values].sort((x, y) => x - y);
  const x = (a.length - 1) * p;
  const lo = Math.floor(x), hi = Math.ceil(x);
  if (lo === hi) return a[lo];
  return a[lo] + (a[hi] - a[lo]) * (x - lo);
}

function stats(values) {
  return {
    min: Math.min(...values),
    p50: percentile(values, 0.50),
    p95: percentile(values, 0.95),
    p99: percentile(values, 0.99),
    max: Math.max(...values),
    mean: values.reduce((a, b) => a + b, 0) / values.length
  };
}

async function yieldToLoop() {
  const t0 = performance.now();
  await new Promise(resolve => setTimeout(resolve, 0));
  return performance.now() - t0;
}

async function measurePass(grid, layers, moist, yieldDelays) {
  const pair = { src: initializeState(grid, layers, false), dst: allocState(grid.cells * layers) };
  for (let i = 0; i < 3; i++) {
    weatherStep(grid, layers, pair.src, pair.dst, { moist, forcing: true });
    swapPair(pair);
  }
  const samples = [];
  const iterations = 12;
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    weatherStep(grid, layers, pair.src, pair.dst, { moist, forcing: true });
    const t1 = performance.now();
    samples.push(t1 - t0);
    swapPair(pair);
    if ((i + 1) % 3 === 0) yieldDelays.push(await yieldToLoop());
  }
  return { samples, stats: stats(samples) };
}

function estimateBytes(grid, layers) {
  const c = grid.cells;
  const gridBytes = c * ((13 * 4) + (4 * 4));
  const doubleBufferedStateBytes = c * layers * 8 * 4 * 2;
  return { gridBytes, doubleBufferedStateBytes, estimatedTotalBytes: gridBytes + doubleBufferedStateBytes };
}

function checksumState(state) {
  let hash = 2166136261 >>> 0;
  const fields = [state.h, state.vx, state.vy, state.vz, state.theta, state.qv, state.ql, state.qi];
  for (const field of fields) {
    const words = new Uint32Array(field.buffer, field.byteOffset, field.length);
    for (let i = 0; i < words.length; i++) {
      hash ^= words[i];
      hash = Math.imul(hash, 16777619) >>> 0;
    }
  }
  return hash.toString(16).padStart(8, "0");
}

function validateSeams(grid) {
  const { n, cells, neighbors, nx, ny, nz } = grid;
  let seamTransitions = 0;
  let roundtripMismatch = 0;
  let maxNeighborAngle = 0;
  for (let i = 0; i < cells; i++) {
    const face = Math.floor(i / (n * n));
    const rt = directionToCell(nx[i], ny[i], nz[i], n);
    if (rt !== i) roundtripMismatch++;
    const no = i * 4;
    for (let d = 0; d < 4; d++) {
      const j = neighbors[no + d];
      const nFace = Math.floor(j / (n * n));
      if (nFace !== face) seamTransitions++;
      const dot = clamp(nx[i] * nx[j] + ny[i] * ny[j] + nz[i] * nz[j], -1, 1);
      maxNeighborAngle = Math.max(maxNeighborAngle, Math.acos(dot));
    }
  }
  const angularLimit = 6 / n;
  return {
    pass: roundtripMismatch === 0 && seamTransitions > 0 && maxNeighborAngle < angularLimit,
    roundtripMismatch,
    seamTransitions,
    maxNeighborAngleRad: maxNeighborAngle,
    angularLimitRad: angularLimit
  };
}

function primeKernel() {
  const grid = buildGrid(16);
  const layers = 3;
  for (const moist of [false, true]) {
    const pair = { src: initializeState(grid, layers, false), dst: allocState(grid.cells * layers) };
    for (let i = 0; i < 8; i++) {
      weatherStep(grid, layers, pair.src, pair.dst, { moist, forcing: true, dt: 0.08 });
      swapPair(pair);
    }
  }
}

function validateRestState() {
  const grid = buildGrid(16);
  const layers = 3;
  const src = initializeState(grid, layers, true);
  const dst = allocState(grid.cells * layers);
  weatherStep(grid, layers, src, dst, { moist: false, forcing: false, dt: 0.08 });
  let maxDelta = 0;
  const fields = ["h", "vx", "vy", "vz", "theta", "qv", "ql", "qi"];
  for (const name of fields) {
    const a = src[name], b = dst[name];
    for (let i = 0; i < a.length; i++) maxDelta = Math.max(maxDelta, Math.abs(a[i] - b[i]));
  }
  return { pass: maxDelta <= 1e-7, maxDelta };
}

function validateDeterministicReplay() {
  const grid = buildGrid(16);
  const layers = 3;
  const run = () => {
    const pair = { src: initializeState(grid, layers, false), dst: allocState(grid.cells * layers) };
    for (let i = 0; i < 6; i++) {
      weatherStep(grid, layers, pair.src, pair.dst, { moist: true, forcing: true, dt: 0.08 });
      swapPair(pair);
    }
    return checksumState(pair.src);
  };
  const a = run();
  const b = run();
  return { pass: a === b, checksumA: a, checksumB: b };
}

function validateStateFinite(config) {
  const grid = buildGrid(config.n);
  const pair = { src: initializeState(grid, config.layers, false), dst: allocState(grid.cells * config.layers) };
  for (let i = 0; i < 8; i++) {
    weatherStep(grid, config.layers, pair.src, pair.dst, { moist: true, forcing: true, dt: 0.08 });
    swapPair(pair);
  }
  let nonFinite = 0, negativeMoisture = 0, nonPositiveH = 0;
  for (let i = 0; i < pair.src.h.length; i++) {
    const vals = [pair.src.h[i], pair.src.vx[i], pair.src.vy[i], pair.src.vz[i], pair.src.theta[i], pair.src.qv[i], pair.src.ql[i], pair.src.qi[i]];
    for (const v of vals) if (!Number.isFinite(v)) nonFinite++;
    if (pair.src.h[i] <= 0) nonPositiveH++;
    if (pair.src.qv[i] < 0 || pair.src.ql[i] < 0 || pair.src.qi[i] < 0) negativeMoisture++;
  }
  return { pass: nonFinite === 0 && negativeMoisture === 0 && nonPositiveH === 0, nonFinite, negativeMoisture, nonPositiveH };
}

function roundStats(s) {
  const r = {};
  for (const [k, v] of Object.entries(s)) r[k] = typeof v === "number" ? Number(v.toFixed(4)) : v;
  return r;
}

function deviceInfo() {
  const mem = performance.memory ? {
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
  } : null;
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    deviceMemoryGB: navigator.deviceMemory ?? null,
    screen: { width: screen.width, height: screen.height, devicePixelRatio: window.devicePixelRatio },
    performanceMemory: mem
  };
}

async function runBenchmark() {
  if (running) return;
  running = true;
  runButton.disabled = true;
  copyButton.disabled = true;
  statusNode.textContent = "RUNNING · Do not background the page while measurements are active.";
  outputNode.textContent = "Preparing validation…";

  try {
    const receipt = {
      schema: "H_EARTH_AUDRALIA_WEATHER_GATE_H_COMPUTE_RECEIPT_v1",
      benchmarkVersion: "1.0.1",
      architectureHead: "fa1495eef1252b05cc75da22e548b459f4bc3bc5",
      branch: "research/h-earth-ow01-weather-benchmark-001",
      timestamp: new Date().toISOString(),
      device: deviceInfo(),
      validation: {},
      configurations: [],
      eventLoopYieldMs: null,
      stoppedEarly: false,
      stopReason: null,
      gateHDisposition: "PARTIAL_MEASUREMENT_ONLY_NOT_CLOSABLE"
    };

    primeKernel();
    receipt.validation.restState = validateRestState();
    receipt.validation.deterministicReplay = validateDeterministicReplay();
    receipt.validation.cubedSphereSeams = {};
    for (const n of [16, 24, 32]) receipt.validation.cubedSphereSeams[`C${n}`] = validateSeams(buildGrid(n));

    const yieldDelays = [];

    for (const config of CONFIGS) {
      statusNode.textContent = `RUNNING · ${config.id} · dry dynamics`;
      outputNode.textContent = JSON.stringify(receipt, null, 2);
      await yieldToLoop();
      const grid = buildGrid(config.n);
      const dry = await measurePass(grid, config.layers, false, yieldDelays);

      statusNode.textContent = `RUNNING · ${config.id} · moist/full kernel`;
      const moist = await measurePass(grid, config.layers, true, yieldDelays);
      const finite = validateStateFinite(config);
      const memory = estimateBytes(grid, config.layers);

      receipt.configurations.push({
        id: config.id,
        faceResolution: config.n,
        horizontalCells: grid.cells,
        dynamicLayers: config.layers,
        stateCells: grid.cells * config.layers,
        gridBuildMs: Number(grid.buildMs.toFixed(4)),
        estimatedMemoryBytes: memory,
        dryDynamicsMs: roundStats(dry.stats),
        moistFullKernelMs: roundStats(moist.stats),
        finitePositiveValidation: finite
      });

      outputNode.textContent = JSON.stringify(receipt, null, 2);
      await yieldToLoop();

      if (moist.stats.p99 > 150 || moist.stats.max > 250) {
        receipt.stoppedEarly = true;
        receipt.stopReason = `${config.id} exceeded conservative standalone safety stop (p99>150ms or max>250ms)`;
        break;
      }
    }

    receipt.eventLoopYieldMs = yieldDelays.length ? roundStats(stats(yieldDelays)) : null;
    receipt.validation.executedInThisStage = ["REST_STATE", "CUBED_SPHERE_SEAM_MAPPING", "DETERMINISTIC_REPLAY", "FINITE_POSITIVE_STATE"];
    receipt.validation.deferredToSuccessorValidation = [
      "SOLID_BODY_TRACER_ROTATION",
      "STEADY_GEOSTROPHIC_FLOW",
      "ISOLATED_MOUNTAIN_FLOW",
      "ROSSBY_HAURWITZ_OR_EQUIVALENT_PLANETARY_WAVE",
      "CLOSED_COLUMN_WATER_CONSERVATION",
      "LATENT_HEAT_FEEDBACK",
      "OROGRAPHIC_CLOUD_SUPPORT",
      "CONVECTIVE_COLUMN_LIFECYCLE",
      "STRATIFORM_COLUMN_LIFECYCLE",
      "ALL_WMO_GENUS_FIXTURES",
      "TC_RADAR_REGRESSION_FIXTURES",
      "INTEGRATED_PHONE_GESTURE_NONREGRESSION",
      "INTEGRATED_TABLET_GESTURE_NONREGRESSION"
    ];

    latestReceipt = receipt;
    outputNode.textContent = JSON.stringify(receipt, null, 2);
    statusNode.textContent = receipt.stoppedEarly
      ? `COMPLETE WITH SAFETY STOP · ${receipt.stopReason}`
      : "COMPLETE · Copy the JSON receipt and preserve it as this device's Gate-H compute measurement.";
    copyButton.disabled = false;
  } catch (error) {
    const failure = {
      schema: "H_EARTH_AUDRALIA_WEATHER_GATE_H_COMPUTE_FAILURE_v1",
      timestamp: new Date().toISOString(),
      device: deviceInfo(),
      error: String(error && error.stack ? error.stack : error),
      gateHDisposition: "FAILURE_RECORDED_DO_NOT_FORCE_HIGHER_CONFIGURATIONS"
    };
    latestReceipt = failure;
    outputNode.textContent = JSON.stringify(failure, null, 2);
    statusNode.textContent = "FAILED · Preserve the failure receipt. Do not force higher configurations.";
    copyButton.disabled = false;
  } finally {
    running = false;
    runButton.disabled = false;
  }
}

runButton.addEventListener("click", runBenchmark);
copyButton.addEventListener("click", async () => {
  if (!latestReceipt) return;
  const text = JSON.stringify(latestReceipt, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    statusNode.textContent = "COPIED · JSON receipt is on the clipboard.";
  } catch {
    outputNode.focus?.();
    statusNode.textContent = "COPY BLOCKED BY BROWSER · Select the receipt text manually.";
  }
});
