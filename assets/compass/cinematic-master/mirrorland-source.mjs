import {
  GRATITUDE_DEVELOPMENT_FRAME,
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  sampleGratitudeWorld,
  resolveGratitudeShoreline
} from '../../../characters/gratitude-geography.adapter.mjs';

export const COMPASS_MASTER_MIRRORLAND_SOURCE_ID = 'COMPASS_SINGLE_MASTER_MIRRORLAND_SOURCE_v1';

export const COMPASS_MASTER_MIRRORLAND_BINDING = Object.freeze({
  thresholdGeometry: Object.freeze({
    path: 'assets/shared/mirrorland-window.geometry.js',
    blob: 'fb3ee8ab92fa4b08e7708b83780de75d1a6f8595',
    role: 'CANONICAL_21_PANE_THRESHOLD_IDENTITY'
  }),
  geographyAdapter: Object.freeze({
    path: 'characters/gratitude-geography.adapter.mjs',
    blob: '8e094b2beed8117f6322ca18d9b592949998aac4',
    role: 'READ_ONLY_MATURE_GRATITUDE_COAST_SOURCE'
  }),
  applicationDependency: false,
  sourceMode: 'DIRECT_GEOGRAPHY_DERIVATIVE_INSIDE_CANONICAL_THRESHOLD'
});

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, value) => {
  const t = clamp((value - a) / (b - a || 1));
  return t * t * (3 - 2 * t);
};

function ensureCanvas(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('MIRRORLAND_MASTER_CANVAS_REQUIRED');
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width || canvas.clientWidth || 1280));
  const height = Math.max(1, Math.round(rect.height || canvas.clientHeight || 720));
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 1.5);
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function drawSky(ctx, width, height, progress) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#030812');
  sky.addColorStop(.48, '#071625');
  sky.addColorStop(1, '#0b1c28');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  const seed = 41;
  for (let i = 0; i < 90; i += 1) {
    const x = ((i * 73 + seed * 17) % 997) / 997 * width;
    const y = ((i * 47 + seed * 29) % 521) / 521 * height * .58;
    const pulse = .45 + .35 * Math.sin(progress * Math.PI * 2 + i * .73);
    ctx.fillStyle = `rgba(218,235,242,${.18 + .42 * pulse})`;
    const r = i % 7 === 0 ? 1.35 : .75;
    ctx.fillRect(x, y, r, r);
  }
}

function projectWorld(worldX, worldZ, elevation, width, height) {
  const env = GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const u = (worldX - env.xMinimum) / (env.xMaximum - env.xMinimum);
  const v = (worldZ - env.zMinimum) / (env.zMaximum - env.zMinimum);
  const perspective = .28 + .72 * v;
  return {
    x: width * (.5 + (u - .5) * perspective * 1.14),
    y: height * (.43 + v * .49) - elevation * (.065 + .035 * perspective)
  };
}

function drawCoast(ctx, width, height) {
  const env = GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const rows = 30;
  const cols = 44;
  const samples = [];
  for (let rz = 0; rz <= rows; rz += 1) {
    const row = [];
    const v = rz / rows;
    const z = mix(env.zMinimum, env.zMaximum, v);
    for (let cx = 0; cx <= cols; cx += 1) {
      const u = cx / cols;
      const x = mix(env.xMinimum, env.xMaximum, u);
      const source = sampleGratitudeWorld(x, z).source;
      row.push({ x, z, elevation: Number(source.elevation) || 0 });
    }
    samples.push(row);
  }

  for (let rz = 0; rz < rows; rz += 1) {
    for (let cx = 0; cx < cols; cx += 1) {
      const a = samples[rz][cx];
      const b = samples[rz][cx + 1];
      const c = samples[rz + 1][cx + 1];
      const d = samples[rz + 1][cx];
      const avg = (a.elevation + b.elevation + c.elevation + d.elevation) / 4;
      const pa = projectWorld(a.x, a.z, a.elevation, width, height);
      const pb = projectWorld(b.x, b.z, b.elevation, width, height);
      const pc = projectWorld(c.x, c.z, c.elevation, width, height);
      const pd = projectWorld(d.x, d.z, d.elevation, width, height);
      const land = avg >= -1;
      const light = clamp((avg + 80) / 300);
      ctx.fillStyle = land
        ? `rgba(${Math.round(mix(16, 60, light))},${Math.round(mix(45, 92, light))},${Math.round(mix(54, 76, light))},.96)`
        : `rgba(8,38,58,${.72 + light * .12})`;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.lineTo(pc.x, pc.y);
      ctx.lineTo(pd.x, pd.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.lineWidth = 1.3;
  ctx.strokeStyle = 'rgba(153,215,220,.48)';
  ctx.beginPath();
  for (let i = 0; i <= 72; i += 1) {
    const u = i / 72;
    const x = mix(env.xMinimum, env.xMaximum, u);
    const shoreline = resolveGratitudeShoreline(x).world;
    const p = projectWorld(shoreline.x, shoreline.z, shoreline.y, width, height);
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

function drawWindow(ctx, width, height, progress) {
  const geometry = globalThis.DGB_MIRRORLAND_WINDOW_GEOMETRY;
  if (!geometry?.ready) throw new Error('MIRRORLAND_CANONICAL_GEOMETRY_NOT_READY');
  const scale = Math.min(width / 700, height / 780) * mix(.86, 1.08, smooth(.05, .7, progress));
  const x = width / 2 - geometry.dimensions.designWidth * scale / 2;
  const y = height / 2 - geometry.dimensions.designHeight * scale / 2 + mix(16, -12, progress);
  const paneAlpha = 1 - smooth(.24, .72, progress);
  const frameAlpha = mix(.96, .62, smooth(.55, 1, progress));

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  geometry.getPanes().forEach((pane) => {
    geometry.tracePolygon(ctx, pane.points);
    const [r, g, b] = pane.color;
    ctx.fillStyle = `rgba(${r},${g},${b},${pane.alpha * paneAlpha})`;
    ctx.fill();
  });

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 7;
  ctx.strokeStyle = `rgba(12,18,28,${frameAlpha})`;
  geometry.traceOuterWindow(ctx);
  ctx.stroke();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = `rgba(71,84,105,${frameAlpha * .8})`;
  geometry.traceInnerWindow(ctx);
  ctx.stroke();
  geometry.getFrameSegments().forEach((segment) => {
    ctx.beginPath();
    segment.forEach((point, index) => index ? ctx.lineTo(point[0], point[1]) : ctx.moveTo(point[0], point[1]));
    ctx.stroke();
  });
  ctx.restore();
}

export function createMirrorlandMasterDonor(canvas) {
  return Object.freeze({
    id: COMPASS_MASTER_MIRRORLAND_SOURCE_ID,
    binding: COMPASS_MASTER_MIRRORLAND_BINDING,
    render(progress = 0) {
      const p = clamp(progress);
      const { ctx, width, height } = ensureCanvas(canvas);
      drawSky(ctx, width, height, p);
      ctx.save();
      const geometry = globalThis.DGB_MIRRORLAND_WINDOW_GEOMETRY;
      if (!geometry?.ready) throw new Error('MIRRORLAND_CANONICAL_GEOMETRY_NOT_READY');
      const scale = Math.min(width / 700, height / 780) * mix(.86, 1.08, smooth(.05, .7, p));
      const x = width / 2 - geometry.dimensions.designWidth * scale / 2;
      const y = height / 2 - geometry.dimensions.designHeight * scale / 2 + mix(16, -12, p);
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      geometry.traceInnerWindow(ctx);
      ctx.clip();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawCoast(ctx, width, height);
      ctx.restore();
      drawWindow(ctx, width, height, p);
      return Object.freeze({
        sourceId: COMPASS_MASTER_MIRRORLAND_SOURCE_ID,
        geographyAuthority: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
        canonicalPaneCount: geometry.paneCount,
        applicationDependency: false,
        progress: p
      });
    }
  });
}
