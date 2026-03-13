function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function normalize(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function getViewportWidth(runtime) {
  return normalize(runtime?.width, 1180);
}

function getViewportHeight(runtime) {
  return normalize(runtime?.height, 1240);
}

function getWorldBounds(runtime) {
  return {
    width: normalize(runtime?.worldBounds?.width, 1180),
    height: normalize(runtime?.worldBounds?.height, 1240)
  };
}

function rotateY(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: (p.x * c) - (p.z * s),
    y: p.y,
    z: (p.x * s) + (p.z * c)
  };
}

function rotateX(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: p.x,
    y: (p.y * c) - (p.z * s),
    z: (p.y * s) + (p.z * c)
  };
}

function getPlanetBodyGeometry(runtime) {
  const width = getViewportWidth(runtime);
  const height = getViewportHeight(runtime);

  const centerX = width * 0.5;
  const centerY = height * 1.18;
  const radius = width * 1.02;

  return Object.freeze({
    centerX,
    centerY,
    radius,
    horizonY: centerY - (radius * 0.78)
  });
}

function projectSphere(runtime, worldX, worldY) {
  const bounds = getWorldBounds(runtime);
  const body = getPlanetBodyGeometry(runtime);

  const u = clamp(worldX / bounds.width, 0, 1);
  const v = clamp(worldY / bounds.height, 0, 1);

  const lon = (u - 0.5) * 1.6;
  const lat = (0.5 - v) * 0.9;

  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);
  const sinLon = Math.sin(lon);
  const cosLon = Math.cos(lon);

  let p = {
    x: body.radius * sinLon * cosLat,
    y: -body.radius * sinLat,
    z: body.radius * cosLon * cosLat
  };

  /* IMPORTANT FIX
     keep island facing camera
  */

  const baseYaw = 0;
  const basePitch = 0.35;

  p = rotateY(p, baseYaw);
  p = rotateX(p, basePitch);

  const cameraDistance = body.radius * 2.4;
  const perspective = cameraDistance / (cameraDistance - p.z);

  return Object.freeze({
    x: body.centerX + (p.x * perspective),
    y: body.centerY + (p.y * perspective),
    scale: clamp(perspective, 0.6, 1.4),
    visible: p.z > -body.radius * 0.3
  });
}

function projectRadius(runtime, value, worldY = 620) {
  const p = projectSphere(runtime, 590, worldY);
  return Math.max(0.5, value * p.scale);
}

function projectRect(runtime, x, y, w, h) {
  const center = projectSphere(runtime, x + w * 0.5, y + h * 0.5);

  const pw = projectRadius(runtime, w, y);
  const ph = projectRadius(runtime, h, y);

  return Object.freeze({
    x: center.x - pw * 0.5,
    y: center.y - ph * 0.5,
    width: pw,
    height: ph,
    visible: center.visible
  });
}

export function createPlanetSurfaceProjector(runtime) {

  const body = getPlanetBodyGeometry(runtime);

  function point(x, y) {
    return projectSphere(runtime, x, y);
  }

  function radius(v, y = 620) {
    return projectRadius(runtime, v, y);
  }

  function lineWidth(v, y = 620) {
    return projectRadius(runtime, v, y);
  }

  function rect(x, y, w, h) {
    return projectRect(runtime, x, y, w, h);
  }

  return Object.freeze({
    body,
    point,
    radius,
    lineWidth,
    rect
  });
}
