function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computeBody(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.max(width * 0.62, height * 0.54);

  return {
    centerX: width * 0.5,
    centerY: height * 1.08,
    radius,
    topY: (height * 1.08) - radius
  };
}

export function createPlanetSurfaceProjector({ canvas, getViewport }) {
  let viewport = getViewport();

  function update(nextViewport) {
    viewport = nextViewport;
  }

  function getBody() {
    return computeBody(canvas);
  }

  function point(x, y) {
    const body = getBody();

    const normalizedX = (x - 0.5) * 1.58;
    const clampedX = clamp(normalizedX, -0.985, 0.985);
    const horizonFactor = Math.sqrt(Math.max(0, 1 - (clampedX * clampedX)));

    const horizonY = body.centerY - (horizonFactor * body.radius);
    const verticalProgress = clamp((y - 0.50) / 0.50, 0, 1);
    const localDepth = clamp(0.32 + (verticalProgress * 0.68), 0, 1);
    const thickness = Math.max(body.radius * 0.10, (body.centerY - horizonY) * 0.58);

    return {
      x: body.centerX + (clampedX * body.radius * 0.96),
      y: horizonY + (verticalProgress * thickness),
      depth: localDepth,
      frontness: localDepth
    };
  }

  function poly(points) {
    return points.map(([x, y]) => point(x, y));
  }

  function scaleAt(x, y) {
    const projected = point(x, y);
    return 0.72 + (projected.depth * 0.42);
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
    return point(x, y).frontness > 0.14;
  }

  function unproject(px, py) {
    const body = getBody();
    const nx = clamp((px - body.centerX) / (body.radius * 0.96), -0.985, 0.985);
    const x = clamp(0.5 + (nx / 1.58), 0, 1);

    const horizonFactor = Math.sqrt(Math.max(0, 1 - (nx * nx)));
    const horizonY = body.centerY - (horizonFactor * body.radius);
    const thickness = Math.max(body.radius * 0.10, (body.centerY - horizonY) * 0.58);
    const verticalProgress = clamp((py - horizonY) / Math.max(1, thickness), 0, 1);
    const y = clamp(0.50 + (verticalProgress * 0.50), 0, 1);

    return { x, y };
  }

  function getCameraState() {
    return {
      mode: "FIXED_SURVEY_STAGE_1"
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
    getCameraState
  };
}
