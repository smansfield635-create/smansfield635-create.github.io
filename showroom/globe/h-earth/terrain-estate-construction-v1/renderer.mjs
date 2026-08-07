import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT,
  sampleHEarthMapWideEnvironmentPresentation
} from '../../../../h-earth-3d/environment/h-earth.gratitude-region-mirror-manor-estate.v1.js';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (left, right, amount) => left * (1 - amount) + right * amount;
const rgb = (color) => `rgb(${color.map((value) => Math.round(clamp(value, 0, 1) * 255)).join(',')})`;

function mixColor(left, right, amount) {
  return [
    mix(left[0], right[0], amount),
    mix(left[1], right[1], amount),
    mix(left[2], right[2], amount)
  ];
}

function normalize(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export const PREVIEW_DOMAIN = Object.freeze({
  xMinimum: -256,
  xMaximum: 256,
  zMinimum: -320,
  zMaximum: 64,
  columns: 65,
  rows: 49
});

export function buildMapWideEnvironmentMesh() {
  const vertices = [];
  const { xMinimum, xMaximum, zMinimum, zMaximum, columns, rows } = PREVIEW_DOMAIN;
  let minimumElevation = Infinity;
  let maximumElevation = -Infinity;
  let minimumRelief = Infinity;
  let maximumRelief = -Infinity;
  let validSampleCount = 0;

  for (let row = 0; row < rows; row += 1) {
    const z = mix(zMinimum, zMaximum, row / (rows - 1));
    for (let column = 0; column < columns; column += 1) {
      const x = mix(xMinimum, xMaximum, column / (columns - 1));
      const environment = sampleHEarthMapWideEnvironmentPresentation(x, z);
      if (environment?.valid !== true) {
        vertices.push(null);
        continue;
      }
      const terrain = environment.terrain;
      const y = terrain.presentationElevation;
      validSampleCount += 1;
      minimumElevation = Math.min(minimumElevation, y);
      maximumElevation = Math.max(maximumElevation, y);
      minimumRelief = Math.min(minimumRelief, terrain.presentationReliefOffset);
      maximumRelief = Math.max(maximumRelief, terrain.presentationReliefOffset);
      vertices.push({
        x,
        y,
        z,
        baseY: terrain.elevation,
        relief: terrain.presentationReliefOffset,
        color: environment.baseColorLinear,
        precinctClass: environment.precinctClass,
        treeSuitability: environment.treeSuitability,
        meadowSuitability: environment.meadowSuitability
      });
    }
  }

  const triangles = [];
  const index = (row, column) => row * columns + column;
  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const a = vertices[index(row, column)];
      const b = vertices[index(row, column + 1)];
      const c = vertices[index(row + 1, column)];
      const d = vertices[index(row + 1, column + 1)];
      if (a && b && c) triangles.push([a, c, b]);
      if (b && c && d) triangles.push([b, c, d]);
    }
  }

  return Object.freeze({
    vertices,
    triangles,
    statistics: Object.freeze({
      validSampleCount,
      triangleCount: triangles.length,
      minimumElevation,
      maximumElevation,
      minimumRelief,
      maximumRelief
    })
  });
}

function averageColor(triangle) {
  return [0, 1, 2].map((channel) =>
    (triangle[0].color[channel] + triangle[1].color[channel] + triangle[2].color[channel]) / 3
  );
}

function triangleNormal(triangle, verticalScale) {
  const a = { x: triangle[0].x, y: triangle[0].y * verticalScale, z: triangle[0].z };
  const b = { x: triangle[1].x, y: triangle[1].y * verticalScale, z: triangle[1].z };
  const c = { x: triangle[2].x, y: triangle[2].y * verticalScale, z: triangle[2].z };
  return normalize(cross(subtract(b, a), subtract(c, a)));
}

export function createMapWideEnvironmentRenderer(canvas) {
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throw new Error('CANVAS_2D_CONTEXT_UNAVAILABLE');

  const mesh = buildMapWideEnvironmentMesh();
  const atmosphere = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT.atmosphere;
  const light = normalize({
    x: -atmosphere.sunDirection[0],
    y: -atmosphere.sunDirection[1],
    z: -atmosphere.sunDirection[2]
  });

  const state = {
    yaw: -0.62,
    pitch: 0.72,
    zoom: 1,
    targetX: 34,
    targetZ: -190,
    verticalScale: 2.15,
    showEstate: true,
    showEntry: true,
    showRelief: true,
    wireframe: false
  };

  let width = 1;
  let height = 1;
  let devicePixelRatio = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);
    const nextWidth = Math.max(1, Math.round(rect.width * devicePixelRatio));
    const nextHeight = Math.max(1, Math.round(rect.height * devicePixelRatio));
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }
    width = canvas.width;
    height = canvas.height;
  }

  function project(vertex) {
    const elevation = state.showRelief ? vertex.y : vertex.baseY;
    const x = vertex.x - state.targetX;
    const y = elevation * state.verticalScale;
    const z = vertex.z - state.targetZ;
    const cosineYaw = Math.cos(state.yaw);
    const sineYaw = Math.sin(state.yaw);
    const yawX = cosineYaw * x - sineYaw * z;
    const yawZ = sineYaw * x + cosineYaw * z;
    const cosinePitch = Math.cos(state.pitch);
    const sinePitch = Math.sin(state.pitch);
    const pitchY = cosinePitch * y - sinePitch * yawZ;
    const pitchZ = sinePitch * y + cosinePitch * yawZ;
    const scale = Math.min(width, height) / 560 * state.zoom;
    return {
      x: width * 0.5 + yawX * scale,
      y: height * 0.56 - pitchY * scale,
      depth: pitchZ,
      scale
    };
  }

  function drawSky() {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, rgb(atmosphere.skyZenith));
    gradient.addColorStop(0.58, rgb(atmosphere.skyHorizon));
    gradient.addColorStop(1, rgb(atmosphere.groundHaze));
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function drawTriangle(item) {
    const { triangle, projected, depth, normal } = item;
    const diffuse = Math.max(0, normal.x * light.x + normal.y * light.y + normal.z * light.z);
    const slope = 1 - clamp(Math.abs(normal.y), 0, 1);
    const base = averageColor(triangle);
    let shaded = base.map((component) => component * (0.46 + diffuse * 0.72));
    shaded = mixColor(shaded, [0.33, 0.34, 0.33], clamp(slope * 0.34, 0, 0.34));
    const far = clamp((depth + 280) / 680, 0, 1);
    shaded = mixColor(shaded, atmosphere.groundHaze, far * 0.40);

    context.beginPath();
    context.moveTo(projected[0].x, projected[0].y);
    context.lineTo(projected[1].x, projected[1].y);
    context.lineTo(projected[2].x, projected[2].y);
    context.closePath();
    context.fillStyle = rgb(shaded);
    context.fill();
    if (state.wireframe) {
      context.strokeStyle = 'rgba(12,18,14,0.16)';
      context.lineWidth = Math.max(0.5, devicePixelRatio * 0.5);
      context.stroke();
    }
  }

  function sampleOverlayPoint(x, z) {
    const sample = sampleHEarthMapWideEnvironmentPresentation(x, z);
    if (sample?.valid !== true) return null;
    return project({ x, z, y: sample.terrain.presentationElevation, baseY: sample.terrain.elevation });
  }

  function drawPolygonOverlay(points, strokeStyle, fillStyle, label) {
    const projected = points.map(([x, z]) => sampleOverlayPoint(x, z));
    if (projected.some((point) => !point)) return;
    context.beginPath();
    context.moveTo(projected[0].x, projected[0].y);
    for (let index = 1; index < projected.length; index += 1) {
      context.lineTo(projected[index].x, projected[index].y);
    }
    context.closePath();
    context.fillStyle = fillStyle;
    context.fill();
    context.strokeStyle = strokeStyle;
    context.lineWidth = 2 * devicePixelRatio;
    context.stroke();
    const centerX = projected.reduce((sum, point) => sum + point.x, 0) / projected.length;
    const centerY = projected.reduce((sum, point) => sum + point.y, 0) / projected.length;
    context.font = `${11 * devicePixelRatio}px system-ui, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'bottom';
    context.fillStyle = strokeStyle;
    context.fillText(label, centerX, centerY - 5 * devicePixelRatio);
  }

  function drawOverlays() {
    if (state.showEstate) {
      drawPolygonOverlay(
        [[64, -188], [96, -188], [96, -156], [64, -156]],
        'rgba(245,232,177,0.95)',
        'rgba(245,232,177,0.10)',
        'Reserved estate — manor deferred'
      );
    }
    if (state.showEntry) {
      drawPolygonOverlay(
        [[-24, -132], [24, -132], [24, -88], [-24, -88]],
        'rgba(184,224,235,0.92)',
        'rgba(184,224,235,0.07)',
        'Entry region'
      );
    }
  }

  function render() {
    resize();
    drawSky();
    const items = [];
    for (const triangle of mesh.triangles) {
      const projected = triangle.map(project);
      const depth = (projected[0].depth + projected[1].depth + projected[2].depth) / 3;
      items.push({
        triangle,
        projected,
        depth,
        normal: triangleNormal(triangle, state.verticalScale)
      });
    }
    items.sort((left, right) => left.depth - right.depth);
    for (const item of items) drawTriangle(item);
    drawOverlays();
  }

  function orbit(deltaX, deltaY) {
    state.yaw += deltaX * 0.006;
    state.pitch = clamp(state.pitch + deltaY * 0.004, 0.24, 1.22);
    render();
  }

  function zoom(delta) {
    state.zoom = clamp(state.zoom * Math.exp(-delta * 0.0012), 0.52, 2.8);
    render();
  }

  function pan(deltaX, deltaZ) {
    state.targetX = clamp(state.targetX + deltaX, -220, 220);
    state.targetZ = clamp(state.targetZ + deltaZ, -300, 32);
    render();
  }

  function setOption(option, value) {
    if (!(option in state)) throw new Error(`UNKNOWN_RENDER_OPTION:${option}`);
    state[option] = value;
    render();
  }

  return Object.freeze({
    mesh,
    state,
    render,
    orbit,
    zoom,
    pan,
    setOption,
    getSnapshot: () => Object.freeze({
      ...state,
      statistics: mesh.statistics
    })
  });
}
