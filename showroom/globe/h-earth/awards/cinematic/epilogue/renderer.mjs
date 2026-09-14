import createMapWideEnvironmentRenderer from '../../../terrain-estate-construction-v1/renderer.mjs';
import {
  CARDINAL_GEOMETRY_MATERIALS,
  CARDINAL_SITE_GEOMETRY_AUTHORITY,
  buildCardinalSiteGeometry
} from '../../../../../../characters/cardinal-scene-geometry.mjs';

const WIDTH = 1280;
const HEIGHT = 720;
const DURATION = 58.774;
const SITE_IDS = Object.freeze([
  'WATERLINE_STATION',
  'WATCHFIRE_OVERLOOK',
  'SIGNAL_LANTERN_FIELD',
  'RESTORATION_BOUNDARY'
]);

const picture = document.getElementById('picture');
const worldCanvas = document.getElementById('world-source');
const status = document.getElementById('status');
const ctx = picture.getContext('2d', { alpha: false });
if (!ctx) throw new Error('EPILOGUE_PICTURE_CONTEXT_UNAVAILABLE');
const world = createMapWideEnvironmentRenderer(worldCanvas);

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const invLerp = (a, b, value) => clamp((value - a) / (b - a || 1));
const smooth = (t) => { const x = clamp(t); return x * x * (3 - 2 * x); };
const easeInOut = (t) => { const x = clamp(t); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const pulse = (a, b, c, d, t) => smooth(invLerp(a, b, t)) * (1 - smooth(invLerp(c, d, t)));
const TAU = Math.PI * 2;

function makeCanvas(width = 640, height = 360) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

const siteCanvases = new Map(SITE_IDS.map((id) => [id, makeCanvas()]));
const mirrorlandCanvas = makeCanvas();
const compassCanvas = makeCanvas();

function rgb01(color, multiplier = 1) {
  const source = Array.isArray(color) ? color : [0.5, 0.5, 0.5];
  return `rgb(${source.map((v) => Math.round(clamp(v * multiplier, 0, 1) * 255)).join(' ')})`;
}

function rotatePoint(point, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x1 = point[0] * cy - point[2] * sy;
  const z1 = point[0] * sy + point[2] * cy;
  const y2 = point[1] * cp - z1 * sp;
  const z2 = point[1] * sp + z1 * cp;
  return [x1, y2, z2];
}

function renderCardinalSite(siteId, canvas, timeSeconds = 0, options = {}) {
  const geometry = buildCardinalSiteGeometry(siteId, 'LOCAL');
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, canvas.width, canvas.height);
  const bounds = geometry.bounds;
  const center = [
    (bounds.minimum.x + bounds.maximum.x) * .5,
    (bounds.minimum.y + bounds.maximum.y) * .5,
    (bounds.minimum.z + bounds.maximum.z) * .5
  ];
  const maximumSpan = Math.max(bounds.span.x, bounds.span.y, bounds.span.z, 1);
  const modelScale = (options.modelScale ?? 1) * 105 / maximumSpan;
  const yaw = (options.yaw ?? 0.55) + Math.sin(timeSeconds * .17 + SITE_IDS.indexOf(siteId)) * .08;
  const pitch = options.pitch ?? -0.32;
  const focal = options.focal ?? 520;
  const cameraDistance = options.cameraDistance ?? 185;
  const lift = options.lift ?? 4;
  const triangles = [];
  const light = [0.25, -0.75, 0.61];
  const lightLength = Math.hypot(...light);

  for (const component of geometry.components) {
    const mesh = component.mesh;
    const material = CARDINAL_GEOMETRY_MATERIALS[mesh.materialId] ?? { baseColor: [.5, .5, .5] };
    for (let i = 0; i < mesh.indices.length; i += 3) {
      const indices = [mesh.indices[i], mesh.indices[i + 1], mesh.indices[i + 2]];
      const projected = [];
      let depth = 0;
      let normalLight = 0;
      for (const index of indices) {
        const source = [
          (mesh.positions[index * 3] - center[0]) * modelScale,
          (mesh.positions[index * 3 + 1] - center[1] + lift) * modelScale,
          (mesh.positions[index * 3 + 2] - center[2]) * modelScale
        ];
        const rotated = rotatePoint(source, yaw, pitch);
        const z = cameraDistance + rotated[2];
        const perspective = focal / Math.max(70, z + focal);
        projected.push([
          canvas.width * .5 + rotated[0] * perspective,
          canvas.height * .56 - rotated[1] * perspective
        ]);
        depth += z;
        if (mesh.normals?.length >= index * 3 + 3) {
          const normal = rotatePoint([
            mesh.normals[index * 3],
            mesh.normals[index * 3 + 1],
            mesh.normals[index * 3 + 2]
          ], yaw, pitch);
          const nl = Math.hypot(...normal) || 1;
          normalLight += (normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2]) / (nl * lightLength);
        }
      }
      const brightness = clamp(.55 + (normalLight / 3) * .38, .28, 1.08);
      triangles.push({ projected, depth: depth / 3, color: rgb01(material.baseColor, brightness) });
    }
  }

  triangles.sort((a, b) => b.depth - a.depth);
  c.save();
  c.globalAlpha = options.alpha ?? 1;
  c.lineJoin = 'round';
  for (const triangle of triangles) {
    c.beginPath();
    c.moveTo(...triangle.projected[0]);
    c.lineTo(...triangle.projected[1]);
    c.lineTo(...triangle.projected[2]);
    c.closePath();
    c.fillStyle = triangle.color;
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,.045)';
    c.lineWidth = .7;
    c.stroke();
  }
  c.restore();
  return geometry;
}

function renderMirrorland(canvas, timeSeconds) {
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, canvas.width, canvas.height);
  const api = globalThis.DGB_MIRRORLAND_WINDOW_GEOMETRY;
  if (!api?.ready) return false;
  const scale = Math.min(canvas.width / api.dimensions.designWidth, canvas.height / api.dimensions.designHeight) * .78;
  const ox = canvas.width * .5 - api.dimensions.designWidth * scale * .5;
  const oy = canvas.height * .5 - api.dimensions.designHeight * scale * .5;
  c.save();
  c.translate(ox, oy);
  c.scale(scale, scale);
  c.shadowColor = 'rgba(112,190,255,.28)';
  c.shadowBlur = 20 / scale;
  for (const pane of api.createPanes()) {
    const [r, g, b] = pane.color;
    c.beginPath();
    c.moveTo(pane.points[0][0], pane.points[0][1]);
    for (let i = 1; i < pane.points.length; i += 1) c.lineTo(pane.points[i][0], pane.points[i][1]);
    c.closePath();
    const shimmer = .86 + .12 * Math.sin(timeSeconds * .9 + pane.phase * 5.7);
    c.fillStyle = `rgba(${r},${g},${b},${clamp((pane.alpha ?? .8) * shimmer, .18, .96)})`;
    c.fill();
    c.strokeStyle = 'rgba(230,241,255,.22)';
    c.lineWidth = 1.2 / scale;
    c.stroke();
  }
  c.shadowBlur = 0;
  c.strokeStyle = 'rgba(205,220,236,.72)';
  c.lineWidth = 2.4 / scale;
  for (const segment of api.createFrameSegments()) {
    c.beginPath();
    c.moveTo(segment[0][0], segment[0][1]);
    for (let i = 1; i < segment.length; i += 1) c.lineTo(segment[i][0], segment[i][1]);
    c.stroke();
  }
  c.restore();
  return true;
}

function compassMaterialColor(materialKey) {
  const key = String(materialKey || '');
  if (key.includes('NORTH')) return '#d7edf4';
  if (key.includes('JEWEL')) return '#f2d48b';
  if (key.includes('DIAL')) return '#18232a';
  if (key.includes('HUB')) return '#b98a43';
  if (key.includes('BEZEL') || key.includes('HOUSING')) return '#6f542d';
  return '#caa56a';
}

function renderCompass(canvas, timeSeconds) {
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, canvas.width, canvas.height);
  const api = globalThis.DGB_UPSTREAM_COMPASS_GEOMETRY;
  if (!api?.createFrontProjectionSchema) return false;
  const schema = api.createFrontProjectionSchema({ includeIntercardinalTicks: true });
  const s = Math.min(canvas.width, canvas.height) * .40;
  const cx = canvas.width * .5;
  const cy = canvas.height * .5;
  const mapX = (x) => cx + x * s;
  const mapY = (y) => cy - y * s;
  c.save();
  c.translate(cx, cy);
  c.rotate(Math.sin(timeSeconds * .21) * .035);
  c.translate(-cx, -cy);
  c.shadowColor = 'rgba(214,177,112,.25)';
  c.shadowBlur = 22;
  for (const layer of schema.layers) {
    c.fillStyle = compassMaterialColor(layer.materialKey);
    c.strokeStyle = 'rgba(255,244,218,.18)';
    c.lineWidth = 1;
    if (layer.type === 'ANNULUS') {
      c.beginPath();
      c.arc(cx, cy, layer.outerRadius * s, 0, TAU);
      c.arc(cx, cy, layer.innerRadius * s, 0, TAU, true);
      c.fill('evenodd');
    } else if (layer.type === 'CIRCLE') {
      c.beginPath();
      c.arc(cx, cy, layer.radius * s, 0, TAU);
      c.fill();
    } else if (layer.type === 'POLYGON' && Array.isArray(layer.vertices) && layer.vertices.length) {
      c.beginPath();
      c.moveTo(mapX(layer.vertices[0][0]), mapY(layer.vertices[0][1]));
      for (let i = 1; i < layer.vertices.length; i += 1) c.lineTo(mapX(layer.vertices[i][0]), mapY(layer.vertices[i][1]));
      c.closePath();
      c.fill();
      c.stroke();
    }
  }
  c.restore();
  return true;
}

function setWorldCamera(t) {
  let yaw = -.62, pitch = .88, distance = 720, targetU = 0, targetV = -4;
  if (t < 3.13) {
    const p = smooth(invLerp(0, 3.13, t));
    yaw = lerp(-.32, -.46, p);
    pitch = lerp(.66, .76, p);
    distance = lerp(1550, 1120, p);
    targetU = lerp(-620, -420, p);
    targetV = lerp(-170, -120, p);
  } else if (t < 13.19) {
    const p = easeInOut(invLerp(3.13, 13.19, t));
    yaw = lerp(-.46, -.72, p);
    pitch = lerp(.76, .86, p);
    distance = lerp(1120, 610, p);
    targetU = lerp(-420, -20, p);
    targetV = lerp(-120, -20, p);
  } else if (t < 29.58) {
    const p = smooth(invLerp(13.19, 29.58, t));
    yaw = lerp(-.72, -.52, p);
    pitch = lerp(.86, .76, p);
    distance = lerp(610, 850, p);
    targetU = lerp(-20, 40, p);
    targetV = lerp(-20, -90, p);
  } else if (t < 36.73) {
    const p = smooth(invLerp(29.58, 36.73, t));
    yaw = lerp(-.52, -.60, p);
    pitch = lerp(.76, .80, p);
    distance = lerp(850, 560, p);
    targetU = lerp(40, 15, p);
    targetV = lerp(-90, -30, p);
  } else {
    const p = easeInOut(invLerp(36.73, 47.63, t));
    yaw = lerp(-.60, -.24, p);
    pitch = lerp(.80, 1.02, p);
    distance = lerp(560, 5000, p);
    targetU = lerp(15, 0, p);
    targetV = lerp(-30, -4, p);
    if (t >= 47.63) {
      const q = invLerp(47.63, DURATION, t);
      yaw = -.24 + q * .13;
      pitch = 1.02 + Math.sin(q * Math.PI) * .025;
      distance = 5000 - Math.sin(q * Math.PI) * 110;
      targetU = 0;
      targetV = -4;
    }
  }
  Object.assign(world.state, { yaw, pitch, distance, targetU, targetV });
  world.render();
}

function drawWorld(alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(worldCanvas, 0, 0, WIDTH, HEIGHT);
  ctx.restore();
}

function drawAtmosphericDepth(amount = .25) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, `rgba(1,4,7,${amount * .35})`);
  gradient.addColorStop(.55, `rgba(2,6,9,${amount * .08})`);
  gradient.addColorStop(1, `rgba(0,2,4,${amount * .62})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawSiteOverWorld(siteId, t, alpha = 1, scale = 1, x = WIDTH * .5, y = HEIGHT * .53) {
  const canvas = siteCanvases.get(siteId);
  renderCardinalSite(siteId, canvas, t, { yaw: .38 + t * .018, pitch: -.34, modelScale: 1.05 });
  const w = 760 * scale;
  const h = 427.5 * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(canvas, x - w * .5, y - h * .5, w, h);
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}

function drawSpatialCell(source, index, p, emphasis = 0) {
  const count = 7;
  const base = index / count * TAU;
  const spin = base + p * TAU * (1.15 + index * .031);
  const inward = smooth(invLerp(.05, .92, p));
  const radius = lerp(500, 92, inward);
  const x = WIDTH * .5 + Math.cos(spin) * radius;
  const y = HEIGHT * .50 + Math.sin(spin * 1.12) * radius * .34;
  const depthWave = .5 + .5 * Math.sin(spin + index * .71);
  const resolvePulse = emphasis * Math.sin(Math.PI * clamp(emphasis));
  const scale = lerp(.34, .18, inward) * lerp(.80, 1.28, depthWave) + resolvePulse * .45;
  const w = 460 * scale;
  const h = 258 * scale;
  const tilt = Math.sin(spin * .73) * .22;
  const shear = Math.cos(spin * .61) * .10;
  const side = 10 + 18 * depthWave;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.transform(1, shear, Math.sin(spin) * .06, 1, 0, 0);
  ctx.globalAlpha = clamp(.66 + depthWave * .25 + resolvePulse * .25, 0, 1);
  ctx.fillStyle = 'rgba(5,10,14,.72)';
  ctx.beginPath();
  ctx.moveTo(-w * .5 + side, -h * .5 - side);
  ctx.lineTo(w * .5 + side, -h * .5 - side);
  ctx.lineTo(w * .5 + side, h * .5 - side);
  ctx.lineTo(-w * .5 + side, h * .5 - side);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'rgba(117,194,231,.24)';
  ctx.shadowBlur = 18 + resolvePulse * 22;
  ctx.drawImage(source, -w * .5, -h * .5, w, h);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(211,231,240,${.18 + resolvePulse * .35})`;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-w * .5, -h * .5, w, h);
  ctx.restore();
}

function prepareStormSources(t) {
  for (let i = 0; i < SITE_IDS.length; i += 1) {
    renderCardinalSite(SITE_IDS[i], siteCanvases.get(SITE_IDS[i]), t + i * .31, {
      yaw: .36 + i * .72 + t * .024,
      pitch: -.32,
      modelScale: 1.08
    });
  }
  renderMirrorland(mirrorlandCanvas, t);
  renderCompass(compassCanvas, t);
  return [worldCanvas, ...SITE_IDS.map((id) => siteCanvases.get(id)), mirrorlandCanvas, compassCanvas];
}

function drawStorm(t) {
  const p = invLerp(19.43, 29.58, t);
  const sources = prepareStormSources(t);
  ctx.save();
  ctx.fillStyle = `rgba(0,3,6,${.18 + smooth(p) * .35})`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
  for (let i = 0; i < sources.length; i += 1) {
    const emphasisA = pulse(.25, .34, .43, .52, p) * (i === 2 ? 1 : 0);
    const emphasisB = pulse(.55, .64, .73, .82, p) * (i === 5 ? 1 : 0);
    drawSpatialCell(sources[i], i, p, Math.max(emphasisA, emphasisB));
  }
  const centerGlow = ctx.createRadialGradient(WIDTH * .5, HEIGHT * .5, 10, WIDTH * .5, HEIGHT * .5, 320);
  centerGlow.addColorStop(0, `rgba(155,218,242,${.04 + p * .12})`);
  centerGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawLanding(t) {
  const p = smooth(invLerp(29.58, 36.73, t));
  const stormFade = 1 - smooth(invLerp(29.58, 31.15, t));
  if (stormFade > .001) drawStorm(Math.min(t, 29.579));
  ctx.save();
  ctx.fillStyle = `rgba(1,5,8,${lerp(.38, .08, p)})`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
  const scale = lerp(.70, 1.02, p);
  const siteAlpha = smooth(invLerp(29.72, 31.70, t));
  drawSiteOverWorld('WATERLINE_STATION', t, siteAlpha, scale, WIDTH * .52, HEIGHT * .54);
}

function textAlpha(inTime, settleTime, leaveTime, outTime, t) {
  return pulse(inTime, settleTime, leaveTime, outTime, t);
}

function drawText(text, options = {}) {
  const {
    x = WIDTH * .5,
    y = HEIGHT * .5,
    alpha = 1,
    size = 46,
    weight = 500,
    align = 'center',
    tracking = 0,
    offsetY = 0,
    emphasis = false
  } = options;
  if (alpha <= .001) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${size}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = emphasis ? 'rgba(247,250,252,.98)' : 'rgba(238,244,247,.94)';
  ctx.shadowColor = 'rgba(0,0,0,.78)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 2;
  if (!tracking) {
    ctx.fillText(text, x, y + offsetY);
  } else {
    const chars = [...text];
    const widths = chars.map((ch) => ctx.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1);
    let cursor = align === 'center' ? x - total * .5 : x;
    for (let i = 0; i < chars.length; i += 1) {
      ctx.textAlign = 'left';
      ctx.fillText(chars[i], cursor, y + offsetY);
      cursor += widths[i] + tracking;
    }
  }
  ctx.restore();
}

function drawTypography(t) {
  const rise = (a, b) => lerp(18, 0, smooth(invLerp(a, b, t)));
  drawText('What makes something real?', {
    y: HEIGHT * .34,
    alpha: textAlpha(.22, .70, 2.25, 3.10, t),
    size: 48,
    weight: 460,
    offsetY: rise(.22, .70)
  });
  drawText("What WASN'T before", {
    y: HEIGHT * .68,
    alpha: textAlpha(2.00, 2.65, 4.35, 5.30, t),
    size: 40,
    weight: 560,
    offsetY: rise(2.00, 2.65),
    emphasis: true
  });
  drawText("doesn't define", {
    y: HEIGHT * .68,
    alpha: textAlpha(4.45, 5.25, 7.25, 8.15, t),
    size: 42,
    weight: 480,
    offsetY: rise(4.45, 5.25)
  });
  drawText('what IS possible.', {
    y: HEIGHT * .68,
    alpha: textAlpha(7.35, 8.15, 12.15, 13.15, t),
    size: 48,
    weight: 610,
    offsetY: rise(7.35, 8.15),
    emphasis: true
  });
  drawText('The experience', {
    y: HEIGHT * .23,
    alpha: textAlpha(14.05, 14.85, 21.00, 22.15, t),
    size: 42,
    weight: 470,
    offsetY: rise(14.05, 14.85)
  });
  drawText('creates', {
    y: HEIGHT * .23,
    alpha: textAlpha(21.20, 22.05, 28.55, 29.55, t),
    size: 55,
    weight: 660,
    offsetY: rise(21.20, 22.05),
    emphasis: true
  });
  drawText('reality.', {
    y: HEIGHT * .73,
    alpha: textAlpha(30.20, 31.15, 35.65, 36.70, t),
    size: 64,
    weight: 650,
    offsetY: rise(30.20, 31.15),
    emphasis: true
  });
  drawText('So where does reality begin?', {
    y: HEIGHT * .73,
    alpha: textAlpha(38.00, 39.10, 45.80, 47.55, t),
    size: 46,
    weight: 470,
    offsetY: rise(38.00, 39.10)
  });
  drawText('DISCOVER', {
    y: HEIGHT * .38,
    alpha: textAlpha(47.72, 48.20, 49.30, 50.05, t),
    size: 50,
    weight: 680,
    tracking: 5,
    offsetY: rise(47.72, 48.20),
    emphasis: true
  });
  drawText('EXPLORE', {
    y: HEIGHT * .52,
    alpha: textAlpha(49.22, 49.75, 51.65, 52.32, t),
    size: 50,
    weight: 680,
    tracking: 5,
    offsetY: rise(49.22, 49.75),
    emphasis: true
  });
  drawText('DIAMONDGATEBRIDGE.COM', {
    y: HEIGHT * .72,
    alpha: smooth(invLerp(52.45, 53.25, t)),
    size: 35,
    weight: 560,
    tracking: 3.3,
    offsetY: rise(52.45, 53.25),
    emphasis: true
  });
}

function renderAt(inputTime) {
  const t = clamp(Number(inputTime) || 0, 0, DURATION);
  setWorldCamera(t);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#020406';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawWorld(1);
  drawAtmosphericDepth(t < 13.19 ? .30 : .18);

  if (t >= 13.19 && t < 19.43) {
    const p = invLerp(13.19, 19.43, t);
    const firstAlpha = 1 - smooth(invLerp(.42, .62, p));
    const secondAlpha = smooth(invLerp(.38, .58, p));
    drawSiteOverWorld('WATERLINE_STATION', t, firstAlpha * .92, lerp(.72, .93, smooth(p)), WIDTH * .49, HEIGHT * .55);
    drawSiteOverWorld('WATCHFIRE_OVERLOOK', t + .4, secondAlpha * .86, lerp(.64, .82, smooth(p)), WIDTH * .57, HEIGHT * .54);
  }

  if (t >= 19.43 && t < 29.58) drawStorm(t);
  if (t >= 29.58 && t < 38.05) {
    drawLanding(Math.min(t, 36.73));
    if (t >= 36.73) {
      const fade = 1 - smooth(invLerp(36.73, 38.05, t));
      drawSiteOverWorld('WATERLINE_STATION', t, fade * .82, 1.0, WIDTH * .52, HEIGHT * .54);
    }
  }

  drawTypography(t);
  ctx.restore();
  status.textContent = `GEN2128  t=${t.toFixed(3)}  source=canonical  raw-video-final=false`;
  picture.dataset.time = t.toFixed(6);
  return { time: t, width: WIDTH, height: HEIGHT };
}

let previewHandle = 0;
let previewStart = 0;
function startPreview() {
  cancelAnimationFrame(previewHandle);
  previewStart = performance.now();
  const tick = (now) => {
    const t = ((now - previewStart) / 1000) % DURATION;
    renderAt(t);
    previewHandle = requestAnimationFrame(tick);
  };
  previewHandle = requestAnimationFrame(tick);
}
function stopPreview() {
  cancelAnimationFrame(previewHandle);
  previewHandle = 0;
}

renderAt(0);
const API = Object.freeze({
  schema: 'AWARDS_CINEMATIC_EPILOGUE_DETERMINISTIC_RENDER_API_v1',
  operationId: 'AWARDS_CINEMATIC_EPILOGUE_FIRST_PICTURE_CONSTRUCTION_20260911_002',
  lockGeneration: 2128,
  governingHead: 'ec39bc5ac6529e015f147433d9a39df05757fe65',
  duration: DURATION,
  width: WIDTH,
  height: HEIGHT,
  fps: 30,
  sourceMode: 'CANONICAL_GEOMETRY_WITH_CINEMATOGRAPHY_DONORS',
  generatedImagery: false,
  rawScreenRecordingFinalPicture: false,
  renderAt,
  startPreview,
  stopPreview,
  getWorldSnapshot: () => world.getSnapshot(),
  getCardinalAuthority: () => CARDINAL_SITE_GEOMETRY_AUTHORITY
});
Object.defineProperty(globalThis, 'DGB_AWARDS_EPILOGUE_RENDER', { value: API, enumerable: true, configurable: false, writable: false });
document.documentElement.dataset.epilogueReady = 'true';
window.dispatchEvent(new CustomEvent('dgb:awards-epilogue-ready', { detail: { operationId: API.operationId, lockGeneration: API.lockGeneration } }));

const params = new URLSearchParams(location.search);
if (params.get('debug') === '1') document.documentElement.dataset.debug = 'true';
if (params.get('autoplay') === '1') startPreview();
