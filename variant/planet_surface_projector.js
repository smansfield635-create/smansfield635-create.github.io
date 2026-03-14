function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createCameraState() {
  return {
    azimuth: 0,
    pitch: Math.PI * 0.34,
    focusX: 0.56,
    focusY: 0.72,
    zoom: 1.18
  };
}

export function createPlanetSurfaceProjector({ canvas, getViewport }) {
  let viewport = getViewport();
  const camera = createCameraState();

  function update(nextViewport) {
    viewport = nextViewport;
  }

  function getBody() {
    const width = canvas.width;
    const height = canvas.height;

    const radius = Math.max(width * 0.56, height * 0.58);

    return {
      centerX: width * 0.62,
      centerY: height * 1.18,
      radius,
      horizonY: (height * 1.18) - radius
    };
  }

  function toSurface(x, y) {
    const lon = (x - camera.focusX) * Math.PI * 1.10;
    const lat = (camera.focusY - y) * Math.PI * 0.80;
    return { lon, lat };
  }

  function projectSurface(x, y) {
    const body = getBody();
    const surface = toSurface(x, y);

    const lon = surface.lon + camera.azimuth;
    const lat = surface.lat;

    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const sinLon = Math.sin(lon);
    const cosLon = Math.cos(lon);

    const worldX = sinLon * cosLat;
    const worldY = sinLat;
    const worldZ = cosLon * cosLat;

    const pitch = camera.pitch;
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    const rotatedY = (worldY * cosP) - (worldZ * sinP);
    const rotatedZ = (worldY * sinP) + (worldZ * cosP);
    const rotatedX = worldX;

    const visible = rotatedZ > -0.85;
    const depth = clamp((rotatedZ + 1) * 0.5, 0, 1);

    const px = body.centerX + (rotatedX * body.radius * 0.96 * camera.zoom);
    const py = body.centerY - (rotatedY * body.radius * 0.88 * camera.zoom);

    return {
      x: px,
      y: py,
      depth,
      visible,
      rotatedX,
      rotatedY,
      rotatedZ
    };
  }

  function point(x, y) {
    return projectSurface(x, y);
  }

  function poly(points) {
    return points.map(([x, y]) => projectSurface(x, y));
  }

  function scaleAt(x, y) {
    const projected = point(x, y);
    return 0.56 + (projected.depth * 0.70);
  }

  function radius(value, y = 0.72) {
    const shortEdge = Math.min(viewport.pixelWidth, viewport.pixelHeight);
    return (value / 1000) * shortEdge * scaleAt(0.5, y);
  }

  function lineWidth(value, y = 0.72) {
    return Math.max(1, radius(value, y));
  }

  function averageDepth(points) {
    if (!points?.length) return 0.5;
    let total = 0;
    for (const [x, y] of points) {
      total += point(x, y).depth;
    }
    return total / points.length;
  }

  function isFrontFacing(x, y) {
    return point(x, y).visible;
  }

  function unproject(px, py) {
    const body = getBody();
    const dx = (px - body.centerX) / Math.max(1, body.radius * 0.96 * camera.zoom);
    const dy = (body.centerY - py) / Math.max(1, body.radius * 0.88 * camera.zoom);
    const d2 = (dx * dx) + (dy * dy);

    if (d2 >= 1) {
      return {
        x: camera.focusX,
        y: camera.focusY
      };
    }

    const dz = Math.sqrt(Math.max(0, 1 - d2));
    const pitch = camera.pitch;
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    const wx = dx;
    const wy = (dy * cosP) + (dz * sinP);
    const wz = (dz * cosP) - (dy * sinP);

    const lon = Math.atan2(wx, wz) - camera.azimuth;
    const lat = Math.asin(clamp(wy, -1, 1));

    const x = clamp(camera.focusX + (lon / (Math.PI * 1.10)), 0, 1);
    const y = clamp(camera.focusY - (lat / (Math.PI * 0.80)), 0, 1);

    return { x, y };
  }

  function setFocus(x, y) {
    camera.focusX = clamp(x, 0.04, 0.96);
    camera.focusY = clamp(y, 0.50, 0.94);
  }

  function nudgeAzimuth(delta) {
    camera.azimuth += delta;
  }

  function getCameraState() {
    return {
      azimuth: camera.azimuth,
      pitch: camera.pitch,
      zoom: camera.zoom,
      focusX: camera.focusX,
      focusY: camera.focusY
    };
  }

  return {
    update,
    getBody,
    point,
    poly,
    scaleAt,
    radius,
    lineWidth,
    averageDepth,
    isFrontFacing,
    unproject,
    setFocus,
    nudgeAzimuth,
    getCameraState
  };
}
