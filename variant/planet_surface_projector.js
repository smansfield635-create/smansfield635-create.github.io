export function createPlanetSurfaceProjector({ canvas }) {

  const state = {
    width: canvas.width,
    height: canvas.height,

    // camera orientation
    yaw: 0,
    pitch: -0.45,

    // camera distance
    cameraDistance: 2.4,

    // planet radius in normalized units
    radius: 1,

    // projection cache
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
    state.centerY = height * 0.60;

    // important: radius derived from smaller axis
    const minAxis = Math.min(width, height);

    state.pixelRadius = minAxis * 0.38;
  }

  function rotatePoint(x, y) {

    const sinY = Math.sin(state.yaw);
    const cosY = Math.cos(state.yaw);

    const sinP = Math.sin(state.pitch);
    const cosP = Math.cos(state.pitch);

    let px = x - 0.5;
    let py = y - 0.5;
    let pz = Math.sqrt(Math.max(0, 1 - px * px - py * py));

    const rx = cosY * px + sinY * pz;
    const rz = -sinY * px + cosY * pz;

    const ry = cosP * py - sinP * rz;
    const rz2 = sinP * py + cosP * rz;

    return { x: rx, y: ry, z: rz2 };
  }

  function project(x, y) {

    const p = rotatePoint(x, y);

    const scale = state.pixelRadius / (state.cameraDistance - p.z);

    return {
      x: state.centerX + (p.x * scale),
      y: state.centerY + (p.y * scale),
      z: p.z
    };
  }

  function unproject(px, py) {

    const nx = (px - state.centerX) / state.pixelRadius;
    const ny = (py - state.centerY) / state.pixelRadius;

    return { x: nx + 0.5, y: ny + 0.5 };
  }

  function point(x, y) {
    return project(x, y);
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
      height: h
    };
  }

  function update(viewport) {
    resize(viewport.width, viewport.height);
  }

  function drag(dx, dy) {
    state.yaw += dx * 0.003;
    state.pitch += dy * 0.003;

    const limit = Math.PI * 0.45;

    if (state.pitch > limit) state.pitch = limit;
    if (state.pitch < -limit) state.pitch = -limit;
  }

  return Object.freeze({
    update,
    point,
    rect,
    lineWidth,
    radius,
    unproject,
    drag,
    body: {
      get centerX() { return state.centerX; },
      get centerY() { return state.centerY; },
      get radius() { return state.pixelRadius; }
    }
  });
}
