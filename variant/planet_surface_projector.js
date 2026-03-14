export function createPlanetSurfaceProjector({ canvas }) {
  const state = {
    width: canvas.width,
    height: canvas.height,
    yaw: 0,
    pitch: -0.38,
    cameraDistance: 2.42,
    centerX: 0,
    centerY: 0,
    pixelRadius: 0
  };

  function resize(width, height) {
    state.width = width;
    state.height = height;

    canvas.width = width;
    canvas.height = height;

    state.centerX = width * 0.5;
    state.centerY = height * 0.56;

    const minAxis = Math.min(width, height);
    state.pixelRadius = minAxis * 0.34;
  }

  function clampPitch() {
    const minPitch = -0.62;
    const maxPitch = -0.16;
    if (state.pitch < minPitch) state.pitch = minPitch;
    if (state.pitch > maxPitch) state.pitch = maxPitch;
  }

  function rotateUnitVector(x, y, z) {
    const cosY = Math.cos(state.yaw);
    const sinY = Math.sin(state.yaw);
    const cosP = Math.cos(state.pitch);
    const sinP = Math.sin(state.pitch);

    const rx = (cosY * x) + (sinY * z);
    const rz = (-sinY * x) + (cosY * z);

    const ry = (cosP * y) - (sinP * rz);
    const rz2 = (sinP * y) + (cosP * rz);

    return { x: rx, y: ry, z: rz2 };
  }

  function planetPointToUnitSphere(x, y) {
    const px = (x * 2) - 1;
    const py = (y * 2) - 1;
    const d2 = (px * px) + (py * py);
    const pz = Math.sqrt(Math.max(0, 1 - d2));
    return { x: px, y: py, z: pz };
  }

  function projectUnitVector(v) {
    const p = rotateUnitVector(v.x, v.y, v.z);
    const perspective = state.pixelRadius / (state.cameraDistance - p.z);

    return {
      x: state.centerX + (p.x * perspective),
      y: state.centerY + (p.y * perspective),
      z: p.z,
      visible: p.z >= -0.08
    };
  }

  function project(x, y) {
    return projectUnitVector(planetPointToUnitSphere(x, y));
  }

  function point(x, y) {
    return project(x, y);
  }

  function poly(polygon) {
    if (!Array.isArray(polygon)) return [];
    return polygon.map(([x, y]) => point(x, y));
  }

  function scaleAt(x, y) {
    const p = point(x, y);
    const scale = state.pixelRadius / (state.cameraDistance - p.z);
    return Math.max(0.35, Math.min(2.2, scale / Math.max(1, state.pixelRadius * 0.52)));
  }

  function lineWidth(value) {
    return value;
  }

  function radius(value) {
    return value;
  }

  function rect(x, y, w, h) {
    const p = point(x, y);
    return {
      x: p.x,
      y: p.y,
      width: w,
      height: h,
      visible: p.visible
    };
  }

  function unproject(px, py) {
    const nx = (px - state.centerX) / Math.max(1, state.pixelRadius);
    const ny = (py - state.centerY) / Math.max(1, state.pixelRadius);

    const d2 = (nx * nx) + (ny * ny);
    if (d2 > 1) {
      const d = Math.sqrt(d2);
      return {
        x: ((nx / d) * 0.5) + 0.5,
        y: ((ny / d) * 0.5) + 0.5
      };
    }

    return {
      x: (nx * 0.5) + 0.5,
      y: (ny * 0.5) + 0.5
    };
  }

  function update(viewport) {
    resize(viewport.width, viewport.height);
    clampPitch();
  }

  function drag(dx, dy) {
    state.yaw += dx * 0.003;
    state.pitch += dy * 0.003;
    clampPitch();
  }

  function dragRotate(dx, dy) {
    drag(dx, dy);
  }

  function getCameraState() {
    return {
      azimuth: state.yaw,
      latitudeTilt: state.pitch
    };
  }

  const body = {
    get centerX() {
      return state.centerX;
    },
    get centerY() {
      return state.centerY;
    },
    get radius() {
      return state.pixelRadius;
    },
    get horizonY() {
      return state.centerY;
    }
  };

  function getBody() {
    return body;
  }

  clampPitch();

  return Object.freeze({
    update,
    point,
    poly,
    scaleAt,
    rect,
    lineWidth,
    radius,
    unproject,
    drag,
    dragRotate,
    getCameraState,
    getBody,
    body
  });
}
