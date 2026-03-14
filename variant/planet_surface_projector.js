function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

export function createPlanetSurfaceProjector({ canvas, getViewport }) {
  let viewport = getViewport();

  const camera = {
    azimuth: 0,
    elevation: 0.34,
    radius: 1
  };

  function update(nextViewport) {
    viewport = nextViewport;
  }

  function worldToView(x, y) {
    const centeredX = (x - 0.5) * 2;
    const centeredY = (y - 0.72) * 2;

    const cosA = Math.cos(camera.azimuth);
    const sinA = Math.sin(camera.azimuth);

    const rotatedX = (centeredX * cosA) - (centeredY * sinA);
    const rotatedY = (centeredX * sinA) + (centeredY * cosA);

    const horizonLift = 0.18 + (camera.elevation * 0.16);
    const bowl = 1 - clamp(Math.abs(rotatedX), 0, 1);
    const curvature = bowl * bowl;

    const depth = clamp(0.5 + (rotatedY * 0.42) + (curvature * 0.18), 0, 1);
    const frontness = clamp(0.58 + (rotatedY * 0.65) + (curvature * 0.22), 0, 1);

    return {
      rotatedX,
      rotatedY,
      depth,
      frontness,
      horizonLift
    };
  }

  function screenPoint(x, y) {
    const view = worldToView(x, y);
    const width = canvas.width;
    const height = canvas.height;

    const px = width * (0.5 + (view.rotatedX * 0.48));
    const py = height * (0.54 + (view.horizonLift * 0.08) + (view.rotatedY * 0.26) + ((1 - view.depth) * 0.22));

    return {
      x: px,
      y: py,
      depth: view.depth,
      frontness: view.frontness
    };
  }

  function point(x, y) {
    return screenPoint(x, y);
  }

  function poly(points) {
    return points.map(([x, y]) => screenPoint(x, y));
  }

  function averageDepth(points) {
    if (!points?.length) return 0.5;
    let sum = 0;
    for (const [x, y] of points) {
      sum += worldToView(x, y).depth;
    }
    return sum / points.length;
  }

  function scaleAt(x, y) {
    const { depth } = worldToView(x, y);
    return lerp(0.68, 1.16, depth);
  }

  function radius(value, y = 0.72) {
    const shortEdge = Math.min(viewport.pixelWidth, viewport.pixelHeight);
    return (value / 1000) * shortEdge * scaleAt(0.5, y);
  }

  function lineWidth(value, y = 0.72) {
    return Math.max(1, radius(value, y));
  }

  function isFrontFacing(x, y) {
    return worldToView(x, y).frontness > 0.12;
  }

  function unproject(px, py) {
    const x = clamp(px / canvas.width, 0, 1);
    const y = clamp((py / canvas.height) * 0.9 + 0.18, 0, 1);
    return { x, y };
  }

  function getCameraState() {
    return { ...camera };
  }

  return {
    update,
    point,
    poly,
    radius,
    lineWidth,
    scaleAt,
    averageDepth,
    isFrontFacing,
    unproject,
    getCameraState
  };
}
